#!/bin/bash

# ImageRight Application Deployment Script
# This script builds and deploys the ImageRight app with PM2

set -e  # Exit on error

echo "🚀 Starting ImageRight deployment..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo -e "${BLUE}📦 Installing dependencies...${NC}"
cd ../..
yarn install

echo -e "${BLUE}🔨 Building workspace dependencies...${NC}"
# Build auth-context and types packages that imageright depends on
yarn workspace @bmb-inc/types build 2>/dev/null || echo "types already built or not needed"
yarn workspace @bmb-inc/auth-context build

echo -e "${BLUE}🏗️  Building application...${NC}"
cd packages/imageright
yarn build:app

echo -e "${BLUE}📁 Ensuring logs directory exists...${NC}"
mkdir -p logs

echo -e "${BLUE}🔄 Checking PM2 status...${NC}"
if pm2 list | grep -q "imageright-app"; then
    echo -e "${BLUE}♻️  Restarting existing PM2 process...${NC}"
    pm2 restart imageright-app
else
    echo -e "${BLUE}🆕 Starting new PM2 process...${NC}"
    pm2 start ecosystem.config.cjs
    pm2 save
fi

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "📊 Application status:"
pm2 status imageright-app

echo ""
echo "📝 To view logs, run:"
echo "  pm2 logs imageright-app"
echo ""
echo "🌐 Access the app at:"
echo "  https://staging.bmbinc.com/dev"

