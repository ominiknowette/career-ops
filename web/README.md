# career-ops web

The Career-Ops web app is the hosted onboarding and documentation experience for
the local-first Career-Ops agent workflow.

It gives users:

- Firebase sign up and sign in
- A first-run CV paste step
- A signed-in CV Profile page
- A documentation dashboard for installation, agent setup, API keys, and common workflows
- A light/dark theme toggle

The app does not replace the local agent. Career-Ops evaluations, scans, tailored
CV generation, and report writing still run from the Career-Ops checkout through a
supported AI coding agent or CLI.

## Local Development

Requires Node 20+.

```bash
cd web
npm install
npm run dev
```

Open `http://localhost:3000`.

## Firebase Setup

Create `web/.env.local` with the Firebase client values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

Enable Email/Password and Google sign-in in the Firebase console.

## Vercel

Use these settings:

- Framework preset: Next.js
- Root directory: `web`
- Build command: `npm run build`
- Output directory: leave default

Add the Firebase values above in Vercel Project Settings -> Environment
Variables. Add server-side provider keys such as `GEMINI_API_KEY` and
`OPENROUTER_API_KEY` there as well if the hosted docs need to show gateway
status.

Do not commit `.env`, `.env.local`, `.next`, or `node_modules`.

## Verification

```bash
npm run typecheck
npm run build
```
