import { redirect } from "next/navigation";
import {
	getLogoutRequest,
	acceptLogoutRequest,
	revokeHydraLoginSessions,
	revokeHydraConsentSessions,
} from "@/lib/hydra";
import { revokeKratosSessions } from "@/lib/kratos";

export default async function LogoutPage({
	searchParams,
}: {
	searchParams: Promise<{ logout_challenge?: string }>;
}) {
	const { logout_challenge: challenge } = await searchParams;

	if (!challenge) {
		return <p>Missing logout_challenge</p>;
	}

	// Get the logout request to obtain the subject (identity ID)
	const logoutRequest = await getLogoutRequest(challenge);

	if (logoutRequest.subject) {
		// Revoke all Kratos sessions so the user cannot be auto-logged
		// back in via an existing ory_kratos_session cookie
		await revokeKratosSessions(logoutRequest.subject);

		// Revoke Hydra login & consent sessions so Hydra won't auto-skip
		// login (loginRequest.skip) on the next OAuth2 authorization flow
		await Promise.all([
			revokeHydraLoginSessions(logoutRequest.subject),
			revokeHydraConsentSessions(logoutRequest.subject),
		]);
	}

	// Accept the Hydra logout (invalidates the specific OAuth2/OIDC session)
	const result = await acceptLogoutRequest(challenge);
	redirect(result.redirect_to);
}
