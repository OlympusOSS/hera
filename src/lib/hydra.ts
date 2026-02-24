const HYDRA_ADMIN_URL = process.env.HYDRA_ADMIN_URL || "http://localhost:4103";

async function hydraAdmin(path: string, method = "GET", body?: unknown) {
	const opts: RequestInit = {
		method,
		headers: { "Content-Type": "application/json" },
	};
	if (body) opts.body = JSON.stringify(body);

	const res = await fetch(`${HYDRA_ADMIN_URL}${path}`, opts);
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`Hydra ${method} ${path} failed (${res.status}): ${text}`);
	}
	return res.json();
}

export function getLoginRequest(challenge: string) {
	return hydraAdmin(`/admin/oauth2/auth/requests/login?login_challenge=${challenge}`);
}

export function acceptLoginRequest(challenge: string, body: Record<string, unknown>) {
	return hydraAdmin(`/admin/oauth2/auth/requests/login/accept?login_challenge=${challenge}`, "PUT", body);
}

// --- Clients ---

export function getOAuth2Client(clientId: string) {
	return hydraAdmin(`/admin/clients/${clientId}`);
}

// --- Consent ---

export function getConsentRequest(challenge: string) {
	return hydraAdmin(`/admin/oauth2/auth/requests/consent?consent_challenge=${challenge}`);
}

export function acceptConsentRequest(challenge: string, body: Record<string, unknown>) {
	return hydraAdmin(`/admin/oauth2/auth/requests/consent/accept?consent_challenge=${challenge}`, "PUT", body);
}

// --- Logout ---

export function getLogoutRequest(challenge: string) {
	return hydraAdmin(`/admin/oauth2/auth/requests/logout?logout_challenge=${challenge}`);
}

export function acceptLogoutRequest(challenge: string) {
	return hydraAdmin(`/admin/oauth2/auth/requests/logout/accept?logout_challenge=${challenge}`, "PUT");
}

/**
 * Revoke all Hydra OAuth2 login & consent sessions for a subject.
 *
 * This ensures Hydra won't auto-skip login on the next OAuth2 flow
 * (i.e. loginRequest.skip won't be true after logout).
 * Non-throwing — logs errors but allows logout to proceed.
 */
export async function revokeHydraLoginSessions(subject: string): Promise<void> {
	try {
		const res = await fetch(
			`${HYDRA_ADMIN_URL}/admin/oauth2/auth/sessions/login?subject=${encodeURIComponent(subject)}`,
			{ method: "DELETE" },
		);
		if (!res.ok && res.status !== 404) {
			const text = await res.text().catch(() => "");
			console.error(
				`Failed to revoke Hydra login sessions for ${subject} (${res.status}): ${text}`,
			);
		}
	} catch (err) {
		console.error(`Error revoking Hydra login sessions for ${subject}:`, err);
	}
}

/**
 * Revoke all Hydra OAuth2 consent sessions for a subject.
 *
 * This ensures remembered consent doesn't auto-grant scopes after logout.
 * Non-throwing — logs errors but allows logout to proceed.
 */
export async function revokeHydraConsentSessions(subject: string): Promise<void> {
	try {
		const res = await fetch(
			`${HYDRA_ADMIN_URL}/admin/oauth2/auth/sessions/consent?subject=${encodeURIComponent(subject)}&all=true`,
			{ method: "DELETE" },
		);
		if (!res.ok && res.status !== 404) {
			const text = await res.text().catch(() => "");
			console.error(
				`Failed to revoke Hydra consent sessions for ${subject} (${res.status}): ${text}`,
			);
		}
	} catch (err) {
		console.error(`Error revoking Hydra consent sessions for ${subject}:`, err);
	}
}
