# Development Setup with Nginx Proxy

## Overview

The backend team has configured an nginx reverse proxy at `staging.bmbinc.com/dev` that routes to your local Vite dev server. This eliminates CORS issues and allows cookies to work properly.

## How It Works

```
Your Browser
  ↓ Visit https://staging.bmbinc.com/dev
Nginx Reverse Proxy (on staging.bmbinc.com)
  ↓ Proxies to localhost:6666
Your Vite Dev Server (localhost:6666)
  ↓ Serves your React app
API Requests go to /api/auth and /api/Imageright
  ↓ Same domain (staging.bmbinc.com)
Backend API (staging.bmbinc.com/api/*)
  ✅ Cookies work automatically
  ✅ No CORS issues
```

## Setup Instructions

### 1. Start Your Dev Server

```bash
# From repo root
yarn workspace @bmb-inc/imageright dev
```

This will start Vite on port 6666 (configured in `vite.config.ts`).

### 2. Access Your App

**Visit:** https://staging.bmbinc.com/dev

**Do NOT use:** `http://localhost:6666` (CORS issues will occur)

### 3. Log In

- You'll be redirected to the staging login page
- Log in with your credentials
- You'll be redirected back to `staging.bmbinc.com/dev`
- Everything should work! 🎉

## Benefits

✅ **No CORS errors** - Same domain for app and API  
✅ **Cookies work** - Auth cookies are on staging.bmbinc.com  
✅ **OAuth works** - Redirect URL is on staging.bmbinc.com  
✅ **Hot Module Reload** - Changes reload instantly  
✅ **Real auth** - Uses actual staging authentication

## Configuration

### vite.config.ts
```typescript
server: {
  port: 6666, // Backend nginx proxies to this port
  base: '/dev/', // Base path for nginx routing
}
```

### .env.local
```env
# Use relative URLs - work automatically on staging.bmbinc.com
VITE_IMAGERIGHT_API_URL=/api/Imageright
```

## Troubleshooting

### Port 6666 already in use

```bash
# Kill the process on port 6666
# Windows:
netstat -ano | findstr :6666
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:6666 | xargs kill -9
```

### Can't access staging.bmbinc.com/dev

1. **Check dev server is running** - Should see output on port 6666
2. **Check nginx config** - Contact backend team
3. **Try hard refresh** - Ctrl+Shift+R (Cmd+Shift+R on Mac)

### "Failed to connect" error

The Vite dev server must be running on localhost:6666 before accessing staging.bmbinc.com/dev.

### HMR not working

If hot module reload doesn't work, the HMR websocket might be blocked. Try:
1. Hard refresh the page
2. Check browser console for websocket errors
3. Restart the dev server

## Comparison with Other Methods

| Method | CORS | Cookies | OAuth | Setup |
|--------|------|---------|-------|-------|
| **Nginx Proxy** ✅ | ✅ None | ✅ Works | ✅ Works | Easy |
| Vite Proxy | ❌ Complex | ⚠️ Rewrite needed | ❌ Fails | Medium |
| Dev Token | ✅ None | ❌ Bypassed | ❌ Bypassed | Complex |

## Notes

- You're accessing the app through HTTPS (staging domain)
- Your local code is served in real-time via the nginx proxy
- Changes you make locally appear instantly at staging.bmbinc.com/dev
- This is ONLY for development - production builds deploy differently

