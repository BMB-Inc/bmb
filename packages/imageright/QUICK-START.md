# Quick Start Guide - ImageRight on Staging

## First Time Setup

### 1. Copy Environment Variables

```bash
cd /home/adevries/bmb/packages/imageright
cp .env.production.example .env.production
```

Edit `.env.production` if needed (default values should work).

### 2. Deploy

```bash
./deploy.sh
```

That's it! The script will:
- Install dependencies
- Build the application
- Start PM2 process on port 3333
- Save PM2 configuration

### 3. Verify

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs imageright-app

# Test locally
curl http://localhost:3333
```

### 4. Access the App

Open in browser: **https://staging.bmbinc.com/dev**

(Don't use `localhost:3333` - use the staging domain for proper auth)

## Daily Operations

### Deploy Updates

```bash
cd /home/adevries/bmb
git pull
cd packages/imageright
./deploy.sh
```

### View Logs

```bash
pm2 logs imageright-app
```

### Restart App

```bash
pm2 restart imageright-app
```

### Stop App

```bash
pm2 stop imageright-app
```

### Remove App

```bash
pm2 delete imageright-app
```

## Nginx Configuration

Your nginx should be configured to forward port 3333 to the public endpoint.

Example nginx config:

```nginx
location /dev {
    proxy_pass http://localhost:3333;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

## Authentication Flow

1. User visits `https://staging.bmbinc.com/dev`
2. Nginx forwards to `localhost:3333` (your PM2 app)
3. App checks for auth cookie from `@bmb-inc/auth-context`
4. If not authenticated, redirects to `/api/auth` login
5. After login, redirected back to app with auth cookie
6. App makes API requests to `/api/Imageright` with cookie

All authentication is handled automatically through the same domain (`staging.bmbinc.com`), so cookies work seamlessly.

## Troubleshooting

### App won't start

```bash
# Check logs
pm2 logs imageright-app --lines 50

# Rebuild
yarn build:app
pm2 restart imageright-app
```

### Port 3333 in use

```bash
# Check what's using it
lsof -i:3333

# Stop PM2 app
pm2 stop imageright-app
```

### Auth not working

- Make sure you're accessing via `staging.bmbinc.com/dev`, NOT `localhost:3333`
- Check browser dev tools for cookies
- Verify nginx is forwarding correctly

### Changes not appearing

```bash
# Rebuild and restart
yarn build:app
pm2 restart imageright-app

# Clear browser cache
# Or hard refresh (Ctrl+Shift+R)
```

## PM2 Auto-Start on Boot

First time only:

```bash
pm2 startup
# Follow the instructions it provides
pm2 save
```

Now PM2 will start automatically when the server reboots.

## Need Help?

- Full docs: [PRODUCTION-SETUP.md](./PRODUCTION-SETUP.md)
- Dev setup: [DEV-NGINX-SETUP.md](./DEV-NGINX-SETUP.md)
- PM2 docs: https://pm2.keymetrics.io/docs/usage/quick-start/

