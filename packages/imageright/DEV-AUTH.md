# Development Authentication Setup

This guide explains how to bypass OAuth authentication during local development using a dev token.

## Why This is Needed

When running locally on `http://localhost:5173`, the OAuth login flow fails because:
1. The staging auth server doesn't accept `localhost` as a valid redirect URI
2. The OAuth redirect happens in the browser and bypasses any proxy

## How We Solve It

The setup uses **two approaches** together:

1. **Vite Proxy**: All `/api/*` requests are proxied through the dev server to avoid CORS
2. **Dev Token**: Bypasses the OAuth redirect flow that can't be proxied

## Workaround: Use Dev Token

You can bypass the OAuth flow by using a valid authentication token from the staging environment.

### Step 1: Get Your Auth Token

1. **Visit staging**: Go to https://staging.bmbinc.com
2. **Log in**: Use your credentials to authenticate
3. **Open DevTools**: Press `F12` or right-click → Inspect
4. **Navigate to cookies**:
   - Chrome/Edge: `Application` tab → `Cookies` → `https://staging.bmbinc.com`
   - Firefox: `Storage` tab → `Cookies` → `https://staging.bmbinc.com`
5. **Find the token**: Look for the cookie named `Authorization-V2`
6. **Copy the value**: Copy the entire cookie value (it should be a long JWT token)

### Step 2: Create `.env.local` File

Create a file named `.env.local` in the `packages/imageright` directory:

```env
# Dev authentication token (bypasses OAuth)
VITE_DEV_AUTH_TOKEN=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cG4iOiJ5b3VyLWVtYWlsQGRvbWFpbi5jb20iLCJleHAiOjE3MzY1MjU2MDAsImlhdCI6MTczNjQzOTIwMH0...
```

**Note**: Replace the example token with your actual token from step 1.

### Step 3: Restart Dev Server

```bash
# Stop the dev server (Ctrl+C)
# Then restart:
yarn workspace @bmb-inc/imageright dev
```

### Step 4: Test

Visit `http://localhost:5173` - you should now be able to access the app without going through the OAuth login flow.

## How It Works

When `VITE_DEV_AUTH_TOKEN` is set:
1. The `AuthProvider` is skipped entirely
2. All API requests include `Authorization: Bearer YOUR_TOKEN` header
3. The staging API authenticates you using the token

## Token Expiration

JWT tokens expire after a certain time (usually 24 hours). When your token expires:
1. API requests will start failing with 401 errors
2. Simply repeat steps 1-3 to get a fresh token

## Security Notes

⚠️ **Never commit `.env.local` to git!** (It's already in `.gitignore`)
⚠️ **Tokens are sensitive** - don't share them or post them publicly
⚠️ **Only use this for local development** - production uses proper OAuth

## When Backend Fixes localhost Support

Once the backend team adds `http://localhost:5173` to the allowed OAuth redirect URIs:
1. Delete your `.env.local` file
2. The normal OAuth flow will work automatically
3. This workaround won't be needed anymore

## Troubleshooting

### "Still getting 401 errors"
- Token might be expired - get a fresh one
- Token might be malformed - make sure you copied the entire value
- Make sure there's no `Bearer ` prefix in the env variable

### "Still redirecting to login"
- Make sure `.env.local` file is in `packages/imageright/` directory
- Restart the dev server after creating/updating `.env.local`
- Check that the env variable is named exactly `VITE_DEV_AUTH_TOKEN`

### "How do I check if it's working?"
- Open browser console
- If you see the app without redirect, it's working
- Check Network tab - requests should have `Authorization: Bearer ...` header

