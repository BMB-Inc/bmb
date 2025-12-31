# Development Configuration

## Environment Variables

Update your `.env` file to use the proxy:

```env
VITE_TENANT_ID=c7709bed-f47a-4b21-a3a0-95565cc5b907
VITE_IMAGERIGHT_API_URL=/api
VITE_IMAGERIGHT_USERNAME=APIUser4
VITE_IMAGERIGHT_PASSWORD=By~b4PC@WA=thniBD+>^
```

## How the Proxy Works

1. **Your app makes requests to**: `/api/authenticate`
2. **Vite proxy forwards to**: `https://1105460.wsol.vertafore.com/iisapp/api/authenticate`
3. **CORS is handled** by the proxy server

## Base URL Configuration

### Local Development

For local development, set the base URL to use the proxy:

```env
VITE_IMAGERIGHT_API_URL=/api
```

Then in your component:

```tsx
<ImageRightBrowser
  baseUrl="/api"
  folderTypes={[FolderTypes.policy]}
/>
```

### Production/Staging

In your Next.js applications, use a relative path:

```tsx
<ImageRightBrowser
  baseUrl="/api/Imageright"
  folderTypes={[FolderTypes.policy]}
/>
```

This automatically works on any domain:
- `staging.bmbinc.com` → fetches from `staging.bmbinc.com/api/Imageright`
- `apps.bmbinc.com` → fetches from `apps.bmbinc.com/api/Imageright`

### Configuration Priority

1. `baseUrl` prop (highest priority)
2. `VITE_IMAGERIGHT_API_URL` environment variable
3. Default: `https://staging.bmbinc.com/api/Imageright`

## Authentication

All API requests automatically include cookies using `credentials: 'include'`.

When your application and ImageRight backend are on the **same domain**, authentication cookies are automatically shared:

```
Your App:     staging.bmbinc.com/your-app
ImageRight:   staging.bmbinc.com/api/Imageright
              ↑ Same domain = cookies sent automatically!
```

No additional configuration needed!

## Restart Required

After updating environment variables, restart your dev server:
```bash
npm run dev
```

