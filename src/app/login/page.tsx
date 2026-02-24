import { redirect } from "next/navigation";
import { randomBytes } from "crypto";
import { headers } from "next/headers";
import { getLoginRequest, acceptLoginRequest, getOAuth2Client } from "@/lib/hydra";
import { getSession, getEmail } from "@/lib/kratos";
import { DEFAULT_OAUTH2_CLIENT_ID, HYDRA_PUBLIC_URL } from "@/lib/config";
import { LoginForm } from "./login-form";

/**
 * When no valid login_challenge exists but a default OAuth2 client is configured,
 * redirect the browser to Hydra's authorize endpoint to start a fresh OAuth2 flow.
 * Hydra will redirect back to this page with a valid login_challenge.
 */
async function redirectToDefaultClient(): Promise<never | null> {
	if (!DEFAULT_OAUTH2_CLIENT_ID) return null;

	try {
		const client = await getOAuth2Client(DEFAULT_OAUTH2_CLIENT_ID);
		const redirectUri = client.redirect_uris?.[0];
		if (!redirectUri) return null;

		const state = randomBytes(32).toString("hex");
		const authUrl = new URL("/oauth2/auth", HYDRA_PUBLIC_URL);
		authUrl.searchParams.set("client_id", DEFAULT_OAUTH2_CLIENT_ID);
		authUrl.searchParams.set("response_type", "code");
		authUrl.searchParams.set("scope", "openid profile email");
		authUrl.searchParams.set("redirect_uri", redirectUri);
		authUrl.searchParams.set("state", state);

		redirect(authUrl.toString());
	} catch (err) {
		// Re-throw redirects
		if (err instanceof Error && err.message === "NEXT_REDIRECT") throw err;
		return null;
	}
}

export default async function LoginPage({
	searchParams,
}: {
	searchParams: Promise<{ login_challenge?: string }>;
}) {
	const { login_challenge: challenge } = await searchParams;

	// No challenge — try to start a fresh OAuth2 flow with the default client
	if (!challenge) {
		await redirectToDefaultClient();

		// If we get here, no default client is configured
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="text-center">
					<p className="text-sm font-medium text-slate-300">
						No login flow available
					</p>
					<p className="mt-1 text-xs text-slate-500">
						Please access this page through an application.
					</p>
				</div>
			</div>
		);
	}

	try {
		// Check if Hydra says we can skip
		const loginRequest = await getLoginRequest(challenge);
		if (loginRequest.skip) {
			const result = await acceptLoginRequest(challenge, {
				subject: loginRequest.subject,
			});
			redirect(result.redirect_to);
		}

		// Check for existing Kratos session
		const hdrs = await headers();
		const cookie = hdrs.get("cookie");
		const session = await getSession(cookie);

		if (session?.identity) {
			const result = await acceptLoginRequest(challenge, {
				subject: session.identity.id,
				context: { email: getEmail(session.identity) },
			});
			redirect(result.redirect_to);
		}

		// No session — render login form
		return <LoginForm challenge={challenge} />;
	} catch (err) {
		// Re-throw redirects (Next.js uses throw for redirect)
		if (err instanceof Error && err.message === "NEXT_REDIRECT") throw err;

		// Invalid/expired challenge — try to start a fresh flow with the default client
		await redirectToDefaultClient();

		// If we get here, no default client is configured
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="text-center">
					<p className="text-sm font-medium text-slate-300">
						Invalid or expired login request
					</p>
					<p className="mt-1 text-xs text-slate-500">
						Please return to the application and try again.
					</p>
				</div>
			</div>
		);
	}
}
