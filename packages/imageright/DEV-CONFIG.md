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

## Restart Required

After updating the Vite config, restart your dev server:
```bash
npm run dev
```

