# ImageRight Deployment Summary

## What Was Configured

Your ImageRight application is now set up to run on **port 3333** with PM2, ready for nginx reverse proxy integration.

## Files Created/Modified

### Modified Files
1. **`vite.config.ts`** - Added preview configuration for port 3333
2. **`package.json`** - Added `build:app` and `start` scripts

### New Files Created
1. **`ecosystem.config.cjs`** - PM2 configuration for process management
2. **`deploy.sh`** - Automated deployment script
3. **`PRODUCTION-SETUP.md`** - Detailed production setup guide
4. **`QUICK-START.md`** - Quick reference guide
5. **`README.md`** - Updated comprehensive documentation
6. **`.env.production.example`** - Example production environment variables
7. **`logs/`** - Directory for PM2 logs

## Architecture

```
User Browser
    ↓
https://staging.bmbinc.com/dev
    ↓
Nginx (reverse proxy on staging server)
    ↓
localhost:3333 (PM2 running Vite preview)
    ↓
ImageRight React App
    ↓
API Requests to /api/Imageright & /api/auth
    ↓
Backend APIs (same domain - cookies work!)
```

## Authentication Flow

The app uses `@bmb-inc/auth-context` which is already integrated in `src/main.tsx`:

```tsx
<AuthProvider authUrl={AUTH_URL} redirectUrl={REDIRECT_URL}>
  {/* Your app */}
</AuthProvider>
```

- **Auth URL**: `/api/auth` (relative path)
- **Redirect URL**: Current page URL
- **Cookies**: Automatically shared on same domain (`staging.bmbinc.com`)

## Deployment Steps

### First Time Setup

```bash
cd /home/adevries/bmb/packages/imageright

# 1. Create production env file (if needed)
cp .env.production.example .env.production

# 2. Deploy
./deploy.sh

# 3. Setup PM2 auto-start (first time only)
pm2 startup
# Follow the command it provides
pm2 save
```

### Subsequent Deployments

```bash
cd /home/adevries/bmb
git pull
cd packages/imageright
./deploy.sh
```

## Key Commands

```bash
# Deploy/redeploy
./deploy.sh

# PM2 Management
pm2 status                    # Check status
pm2 logs imageright-app       # View logs
pm2 restart imageright-app    # Restart
pm2 stop imageright-app       # Stop
pm2 delete imageright-app     # Remove

# Manual operations
yarn build:app                # Build for production
yarn start                    # Start on port 3333 (used by PM2)
```

## Port Configuration

- **Development**: Port 5174 (`yarn dev`)
- **Production**: Port 3333 (`yarn start` via PM2)
- **Nginx**: Forwards `/dev` to `localhost:3333`

## Environment Variables

Production variables (`.env.production`):

```env
VITE_IMAGERIGHT_API_URL=/api/Imageright
VITE_TENANT_ID=c7709bed-f47a-4b21-a3a0-95565cc5b907
```

These are baked into the build at build time (Vite convention).

## Nginx Configuration

Your nginx should have a location block like:

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

## How It Works with Auth

1. **User visits** `https://staging.bmbinc.com/dev`
2. **Nginx forwards** to `localhost:3333` (your PM2 app)
3. **App checks** for auth via `@bmb-inc/auth-context`
4. **If not authenticated**:
   - Redirects to `/api/auth` (handled by auth package)
   - User logs in
   - Auth server sets cookie on `staging.bmbinc.com`
   - Redirects back to app
5. **If authenticated**:
   - App loads normally
   - All API requests include auth cookie automatically
   - Requests to `/api/Imageright` work seamlessly

## Benefits of This Setup

✅ **Same domain** - No CORS issues  
✅ **Cookies work** - Auth cookies shared automatically  
✅ **Production-like** - Real auth flow  
✅ **Easy deployment** - One command (`./deploy.sh`)  
✅ **Auto-restart** - PM2 restarts on crashes  
✅ **Logs** - Centralized in `logs/` directory  
✅ **Boot persistence** - Starts on server reboot

## Verification Checklist

After deployment, verify:

- [ ] PM2 shows app running: `pm2 status`
- [ ] App responds locally: `curl http://localhost:3333`
- [ ] Logs look good: `pm2 logs imageright-app`
- [ ] Nginx forwards correctly: Visit `https://staging.bmbinc.com/dev`
- [ ] Auth works: Try logging in
- [ ] API requests work: Check browser network tab

## Troubleshooting

### Port 3333 already in use
```bash
lsof -i:3333
pm2 stop imageright-app
```

### App not starting
```bash
pm2 logs imageright-app --lines 50
yarn build:app
pm2 restart imageright-app
```

### Auth not working
- Access via `staging.bmbinc.com/dev`, NOT `localhost:3333`
- Check browser cookies in dev tools
- Verify nginx is forwarding correctly

### Changes not appearing
```bash
yarn build:app
pm2 restart imageright-app
# Hard refresh browser (Ctrl+Shift+R)
```

## Documentation

- **Quick Start**: [QUICK-START.md](./QUICK-START.md)
- **Production Guide**: [PRODUCTION-SETUP.md](./PRODUCTION-SETUP.md)
- **Dev Setup**: [DEV-NGINX-SETUP.md](./DEV-NGINX-SETUP.md)
- **Main README**: [README.md](./README.md)

## Next Steps

1. Run `./deploy.sh` to deploy
2. Configure nginx to forward port 3333 (if not already done)
3. Visit `https://staging.bmbinc.com/dev` to test
4. Setup PM2 auto-start: `pm2 startup && pm2 save`

---

**Questions?** Check the documentation files or PM2 logs for more details.

