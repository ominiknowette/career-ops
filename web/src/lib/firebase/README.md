# Firebase setup

Put Firebase client setup for the frontend in this folder.

Use environment variables instead of pasting real keys into source files:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

For local development, put them in `web/.env.local`.

For Vercel, add the same keys in:

`Project Settings -> Environment Variables`

When Firebase is installed, this folder is where `initializeApp`, `getAuth`, and provider setup should live.
