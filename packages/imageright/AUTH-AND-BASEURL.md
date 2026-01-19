# ImageRight Browser - Authentication & Base URL Configuration

## Overview

The ImageRight Browser package is configured to work seamlessly with cookie-based authentication when deployed on the same domain as the ImageRight backend.

**Key Features:**
1. **Configurable Base URL**: Dynamically point to different ImageRight API endpoints
2. **Automatic Authentication**: Cookies are automatically sent with all requests via `credentials: 'include'`
3. **Multi-Environment Support**: Works across staging, production, and development environments

## How It Works

### Same-Domain Deployment (Recommended)

When your application and ImageRight backend are on the same domain:

```
Your App:           staging.bmbinc.com/api/marketing-submissions
ImageRight API:     staging.bmbinc.com/api/Imageright
                    ↑ Same domain = cookies automatically shared!
```

**Benefits:**
- ✅ No CORS configuration needed
- ✅ Authentication cookies sent automatically
- ✅ No proxy/API routes required
- ✅ Simple configuration

### Configuration

#### Option 1: Relative URL (Simplest)

```tsx
import { ImageRightBrowser } from '@bmb-inc/imageright';

<ImageRightBrowser 
  baseUrl="/api/Imageright"  // Works on any domain!
  folderTypes={[FolderTypes.policy]}
/>
```

This works because:
- On `staging.bmbinc.com` → fetches from `staging.bmbinc.com/api/Imageright`
- On `apps.bmbinc.com` → fetches from `apps.bmbinc.com/api/Imageright`
- Same domain = auth cookies included automatically

#### Option 2: Dynamic Absolute URL

```tsx
import { ImageRightBrowser } from '@bmb-inc/imageright';

const getImageRightBaseUrl = () => {
  if (typeof window === 'undefined') return ''; // SSR safety
  return `${window.location.origin}/api/Imageright`;
};

<ImageRightBrowser 
  baseUrl={getImageRightBaseUrl()}
  folderTypes={[FolderTypes.policy]}
/>
```

#### Option 3: Environment Variable

```tsx
// .env.local (staging)
NEXT_PUBLIC_IMAGERIGHT_BASE_URL=/api/Imageright

// .env.production
NEXT_PUBLIC_IMAGERIGHT_BASE_URL=/api/Imageright

// Component
<ImageRightBrowser 
  baseUrl={process.env.NEXT_PUBLIC_IMAGERIGHT_BASE_URL}
  folderTypes={[FolderTypes.policy]}
/>
```

## Base URL Priority

The package determines the API URL using this priority:

```
1. baseUrl prop (highest priority)
   ↓
2. VITE_IMAGERIGHT_API_URL environment variable
   ↓
3. Default: 'https://staging.bmbinc.com/api/Imageright'
```

## Implementation Details

### Files Modified for Auth Support

1. **`src/api/fetcher.ts`**
   - Added `credentials: 'include'` to all fetch requests
   - Ensures `Content-Type: application/json` header is set

2. **`src/api/images/route.ts`**
   - Added `credentials: 'include'` to image requests

3. **`src/api/preview/route.ts`**
   - Added `credentials: 'include'` to PDF preview requests

4. **`src/api/emails/route.ts`**
   - Added `credentials: 'include'` to email document requests

### What `credentials: 'include'` Does

```javascript
fetch('https://staging.bmbinc.com/api/Imageright/folders', {
  credentials: 'include'  // Sends cookies for this domain
});
```

When the request is to the **same domain**, the browser automatically includes:
- Session cookies
- Authentication cookies
- Any other httpOnly cookies set by the server

## Architecture Flow

```
┌─────────────────┐
│  Browser        │
│  (Next.js App)  │
└────────┬────────┘
         │ credentials: 'include'
         │ Cookies: session=abc123
         │ (Same domain - automatic!)
         ↓
┌─────────────────────────┐
│  ImageRight Backend     │
│  /api/Imageright/*      │
└─────────────────────────┘
```

## Usage Examples

### Basic Usage

```tsx
import { ImageRightBrowser } from '@bmb-inc/imageright';
import { FolderTypes, DocumentTypes } from '@bmb-inc/types';

export default function ImageRightPage() {
  return (
    <ImageRightBrowser 
      baseUrl="/api/Imageright"
      folderTypes={[FolderTypes.policy, FolderTypes.binding]}
      documentTypes={[DocumentTypes.policy]}
    />
  );
}
```

### Multiple Environments

Your Next.js application automatically handles different environments:

**Staging Deployment:**
```
Domain: staging.bmbinc.com
App runs at: staging.bmbinc.com/app-a
Fetches from: staging.bmbinc.com/api/Imageright
```

**Production Deployment:**
```
Domain: apps.bmbinc.com
App runs at: apps.bmbinc.com/app-a
Fetches from: apps.bmbinc.com/api/Imageright
```

Just use the same configuration in both:
```tsx
<ImageRightBrowser baseUrl="/api/Imageright" />
```

### Reusing Across Applications

The package works identically in multiple Next.js applications:

**App A:**
```tsx
// apps.bmbinc.com/app-a
<ImageRightBrowser baseUrl="/api/Imageright" />
```

**App B:**
```tsx
// apps.bmbinc.com/app-b
<ImageRightBrowser baseUrl="/api/Imageright" />
```

Both share the same authentication cookies since they're on the same domain!

## Development Setup

### Local Development with Proxy

For local development, you may need to proxy to a remote ImageRight backend:

**vite.config.ts:**
```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api/Imageright': {
        target: 'https://staging.bmbinc.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
});
```

**Component:**
```tsx
<ImageRightBrowser baseUrl="/api/Imageright" />
```

Now `localhost:3000/api/Imageright` → `staging.bmbinc.com/api/Imageright`

### Environment Variable Override

```env
# .env.local (for local dev)
NEXT_PUBLIC_IMAGERIGHT_BASE_URL=https://staging.bmbinc.com/api/Imageright
```

```tsx
<ImageRightBrowser 
  baseUrl={process.env.NEXT_PUBLIC_IMAGERIGHT_BASE_URL || '/api/Imageright'}
/>
```

## Authentication Flow

### 1. User Authenticates

User logs into your Next.js application. Server sets cookies:

```
Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Strict
Set-Cookie: auth_token=xyz789; HttpOnly; Secure; SameSite=Strict
```

### 2. Cookies Stored by Browser

Browser stores cookies for the domain (e.g., `staging.bmbinc.com`)

### 3. ImageRight Package Makes Requests

```typescript
// Package internally does:
fetch('https://staging.bmbinc.com/api/Imageright/folders', {
  credentials: 'include'  // Tells browser to include cookies
});
```

### 4. Browser Sends Cookies Automatically

Since it's the same domain, browser automatically includes:
```
Cookie: session=abc123; auth_token=xyz789
```

### 5. Backend Validates

ImageRight backend receives cookies and validates the session.

## Troubleshooting

### 401 Unauthorized Errors

**Check:**
1. User is logged into your Next.js app
2. Cookies are being set correctly (check DevTools → Application → Cookies)
3. Cookies have correct domain (should be `.bmbinc.com` or `staging.bmbinc.com`)
4. `baseUrl` is correct (relative path like `/api/Imageright`)

### Cookies Not Being Sent

**Check:**
1. Frontend and backend are on the same domain
2. Not using `localhost` with a remote domain (use proxy in dev)
3. Cookies are not `SameSite=Strict` when crossing subdomains

### CORS Errors

If you see CORS errors, it means domains don't match:

**Wrong:**
```
App: localhost:3000
API: staging.bmbinc.com
→ Different domains = CORS issues
```

**Correct:**
```
App: staging.bmbinc.com
API: staging.bmbinc.com/api/Imageright
→ Same domain = no CORS
```

Use a proxy in development to solve this.

## Security Considerations

### Cookie Security

Ensure your authentication cookies are secure:

```javascript
// Server-side (setting cookies)
res.cookie('session', sessionId, {
  httpOnly: true,    // Can't be accessed by JavaScript
  secure: true,      // Only sent over HTTPS
  sameSite: 'strict', // Only sent to same site
  maxAge: 3600000    // 1 hour
});
```

### HTTPS Required

In production, always use HTTPS:
- Cookies marked `Secure` won't be sent over HTTP
- Authentication tokens remain encrypted in transit

## Cross-Domain Scenario (Not Recommended)

If you absolutely must use different domains:

**App:** `myapp.com`  
**ImageRight:** `imageright-backend.com`

You would need:
1. CORS configuration on backend
2. Separate authentication for ImageRight
3. More complex setup

This is **not recommended** and not the intended use case for this package.

## Summary

✅ **Simple Setup**: Just set `baseUrl="/api/Imageright"`  
✅ **Automatic Auth**: Cookies work automatically on same domain  
✅ **Multi-Environment**: Same config works across staging/production  
✅ **Reusable**: Use the same package in multiple Next.js apps  
✅ **No Proxies Needed**: Direct fetch from browser to backend

The package is designed to work seamlessly when your application and ImageRight backend are deployed on the same domain! 🎉
