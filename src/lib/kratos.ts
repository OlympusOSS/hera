const KRATOS_PUBLIC_URL = process.env.KRATOS_PUBLIC_URL || "http://localhost:4100";
const KRATOS_ADMIN_URL = process.env.KRATOS_ADMIN_URL || "http://localhost:4101";

export async function getSession(cookieHeader: string | null) {
	if (!cookieHeader) return null;

	try {
		const res = await fetch(`${KRATOS_PUBLIC_URL}/sessions/whoami`, {
			headers: { cookie: cookieHeader },
		});
		if (!res.ok) return null;
		return res.json();
	} catch {
		return null;
	}
}

export async function createLoginFlow() {
	const res = await fetch(`${KRATOS_PUBLIC_URL}/self-service/login/api`);
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`Failed to create login flow (${res.status}): ${text}`);
	}
	return res.json();
}

export async function submitLoginFlow(
	flowId: string,
	email: string,
	password: string,
	csrfToken: string,
) {
	const params = new URLSearchParams();
	params.set("method", "password");
	params.set("identifier", email);
	params.set("password", password);
	if (csrfToken) params.set("csrf_token", csrfToken);

	const res = await fetch(
		`${KRATOS_PUBLIC_URL}/self-service/login?flow=${flowId}`,
		{
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: params.toString(),
		},
	);

	if (!res.ok) {
		const body = await res.json().catch(() => ({}));
		const msg =
			body?.ui?.messages?.[0]?.text ||
			body?.error?.message ||
			"Authentication failed";
		throw new Error(msg);
	}

	return res.json();
}

export function getEmail(identity: Record<string, unknown>): string | null {
	const traits = identity?.traits as Record<string, unknown> | undefined;
	return (traits?.email as string) || null;
}

export function extractCsrfToken(flow: Record<string, unknown>): string {
	const ui = flow?.ui as { nodes?: Array<{ attributes?: { name?: string; value?: string } }> } | undefined;
	if (!ui?.nodes) return "";
	const csrfNode = ui.nodes.find((n) => n.attributes?.name === "csrf_token");
	return csrfNode?.attributes?.value || "";
}

/**
 * Revoke all Kratos sessions for a given identity.
 * Uses the Kratos admin API: DELETE /admin/identities/{id}/sessions
 * Non-throwing — logs errors but allows logout to proceed.
 */
export async function revokeKratosSessions(identityId: string): Promise<void> {
	const res = await fetch(
		`${KRATOS_ADMIN_URL}/admin/identities/${identityId}/sessions`,
		{ method: "DELETE" },
	);

	if (!res.ok && res.status !== 404) {
		const text = await res.text().catch(() => "");
		console.error(
			`Failed to revoke Kratos sessions for identity ${identityId} (${res.status}): ${text}`,
		);
	}
}
