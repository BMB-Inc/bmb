# Production/Staging Setup with PM2

## Overview

This guide explains how to run the ImageRight application on the staging server using PM2 and nginx on port 3333.

## Prerequisites

- Node.js and Yarn installed
- PM2 installed globally: `npm install -g pm2`
- Nginx configured to forward port 3333

## Setup Instructions

### 1. Build the Application

```bash
cd /home/adevries/bmb/packages/imageright
yarn build:app
```

This creates an optimized production build in the `dist` directory.

### 2. Start with PM2

```bash
# Start the application
pm2 start ecosystem.config.cjs

# Save PM2 process list
pm2 save

# Setup PM2 to start on system boot (first time only)
pm2 startup
```

### 3. Verify It's Running

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs imageright-app

# Check if the app is responding
curl http://localhost:3333
```

## PM2 Commands

```bash
# Start the app
pm2 start ecosystem.config.cjs

# Stop the app
pm2 stop imageright-app

# Restart the app
pm2 restart imageright-app

# Delete the app from PM2
pm2 delete imageright-app

# View logs
pm2 logs imageright-app

# Monitor resources
pm2 monit
```

## Deployment Workflow

When you need to deploy updates:

```bash
# 1. Pull latest code
cd /home/adevries/bmb
git pull

# 2. Install dependencies (if needed)
yarn install

# 3. Build the application
cd packages/imageright
yarn build:app

# 4. Restart PM2
pm2 restart imageright-app

# 5. Verify
pm2 logs imageright-app
```

## Nginx Configuration

The nginx reverse proxy should be configured to forward requests to port 3333:

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

## Authentication

The application uses the `@bmb-inc/auth-context` package for authentication. When accessed through `staging.bmbinc.com/dev`, authentication cookies are automatically shared with the auth server at `staging.bmbinc.com/api/auth`.

Benefits:
- ✅ Same domain - cookies work automatically
- ✅ No CORS issues
- ✅ Uses production auth flow
- ✅ Secure session management

## Environment Variables

Production environment variables are stored in `.env.production`:

```env
VITE_IMAGERIGHT_API_URL=/api/Imageright
VITE_TENANT_ID=c7709bed-f47a-4b21-a3a0-95565cc5b907
```

These are baked into the build at build time (Vite convention).

## Troubleshooting

### Port 3333 already in use

```bash
# Check what's using the port
lsof -i:3333

# Stop the PM2 process
pm2 stop imageright-app

# Or kill the process
kill -9 <PID>
```

### Application not starting

```bash
# Check PM2 logs
pm2 logs imageright-app --lines 100

# Check if build exists
ls -la dist/

# Rebuild if needed
yarn build:app
```

### Changes not reflecting

```bash
# Make sure to rebuild before restarting
yarn build:app
pm2 restart imageright-app
```

### Authentication issues

1. Verify you're accessing through `staging.bmbinc.com/dev`, not `localhost:3333`
2. Check that auth cookies are being set (browser dev tools)
3. Verify nginx is properly forwarding requests
4. Check API URL is set to `/api/Imageright` (relative path)

## Logs

PM2 logs are stored in:
- Error logs: `/home/adevries/bmb/packages/imageright/logs/error.log`
- Output logs: `/home/adevries/bmb/packages/imageright/logs/out.log`
- Combined: `/home/adevries/bmb/packages/imageright/logs/combined.log`

View logs in real-time:
```bash
pm2 logs imageright-app
```

## Automatic Restarts

PM2 automatically restarts the application if:
- It crashes
- Memory exceeds 1GB
- The server reboots (with `pm2 startup` configured)

