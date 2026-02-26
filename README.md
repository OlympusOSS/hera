# Hera

Authentication and consent UI for [Ory Kratos](https://www.ory.sh/kratos/) and [Ory Hydra](https://www.ory.sh/hydra/).

Built with Next.js, TypeScript, and the [Canvas](https://github.com/OlympusOSS/canvas) design system.

---

## Screenshot

![Login](assets/login.png)

---

## What It Does

Hera handles the user-facing side of OAuth2 authentication flows:

1. **Login** — Authenticates users against Ory Kratos (email + password). If a valid Kratos session exists, login is skipped automatically.
2. **Consent** — Auto-grants OAuth2 scopes and records the consent decision in Hydra. Consent is remembered so users aren't prompted again.
3. **Logout** — Revokes both Kratos sessions and Hydra login/consent sessions, then redirects to the post-logout URI.

### Flow

```
App → Hydra /oauth2/auth
  → Hera /login (authenticate via Kratos)
  → Hera /consent (auto-grant scopes)
  → Hydra issues tokens
  → App receives authorization code
```

---

## Prerequisites

- An [Ory Kratos](https://www.ory.sh/kratos/) instance (identity + session management)
- An [Ory Hydra](https://www.ory.sh/hydra/) instance (OAuth2 authorization server)

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `KRATOS_PUBLIC_URL` | Kratos public API | `http://localhost:4100` |
| `KRATOS_ADMIN_URL` | Kratos admin API | `http://localhost:4101` |
| `HYDRA_PUBLIC_URL` | Hydra public API (for client-side redirects) | `http://localhost:4102` |
| `HYDRA_ADMIN_URL` | Hydra admin API (for login/consent acceptance) | `http://localhost:4103` |
| `DEFAULT_OAUTH2_CLIENT_ID` | Default client ID when no login_challenge is present | — |

---

## Getting Started

### Run locally

```bash
bun install
bun run dev
```

### Run with Docker

```bash
docker build -t hera .
docker run -p 3000:3000 \
  -e KRATOS_PUBLIC_URL=http://your-kratos:4433 \
  -e KRATOS_ADMIN_URL=http://your-kratos:4434 \
  -e HYDRA_PUBLIC_URL=http://your-hydra:4444 \
  -e HYDRA_ADMIN_URL=http://your-hydra:4445 \
  hera
```

---

## Routes

| Route | Purpose |
|-------|---------|
| `/login` | Login form — receives `login_challenge` from Hydra |
| `/consent` | Consent handler — receives `consent_challenge` from Hydra |
| `/logout` | Logout handler — receives `logout_challenge` from Hydra |
| `/health` | Health check endpoint |

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 15, React 19 |
| Language | TypeScript |
| Runtime | [Bun](https://bun.sh/) |
| Design System | [@olympusoss/canvas](https://github.com/OlympusOSS/canvas) |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| API Clients | Ory Kratos + Hydra (direct HTTP) |

---

## Project Structure

```
src/
├── app/
│   ├── login/          # Login page + form + server action
│   ├── consent/        # OAuth2 consent handler
│   ├── logout/         # Logout + session revocation
│   └── health/         # Health check
├── components/         # AnimatedBackground
├── lib/
│   ├── config.ts       # Environment variable configuration
│   ├── kratos.ts       # Kratos API client
│   └── hydra.ts        # Hydra Admin API client
└── styles/
    └── globals.css     # Canvas tokens + Tailwind
```

---

## License

MIT
