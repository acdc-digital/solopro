#!/bin/bash

echo "🚀 Testing Soloist Pro Build Process"
echo "===================================="

# Exit on error
set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo ""
echo "1️⃣  Building renderer (Next.js)..."
pnpm run build:renderer

if [ -d "renderer/.next" ]; then
    echo -e "${GREEN}✅ Renderer built successfully!${NC}"
    echo "   Next.js production build created in: renderer/.next/"
else
    echo -e "${RED}❌ Renderer build failed - no .next directory found${NC}"
    exit 1
fi

echo ""
echo "2️⃣  Creating Electron packages (this may take a few minutes)..."
echo "   Note: This will only build for your current platform in test mode"

# Build only for current platform to save time during testing
cd electron
pnpm run pack
cd ..

if [ -d "electron/dist" ]; then
    echo -e "${GREEN}✅ Electron packages created successfully!${NC}"
    echo ""
    echo "📦 Built packages:"
    ls -la electron/dist/
else
    echo -e "${RED}❌ Electron build failed - no dist directory found${NC}"
    exit 1
fi

echo ""
echo "===================================="
echo -e "${GREEN}✨ Build test completed successfully!${NC}"
echo ""
echo "Next steps:"
echo "1. Test the built app in electron/dist/"
echo "2. Replace placeholder icons in electron/build/"
echo "3. Update GITHUB_REPO in website/app/download/page.tsx"
echo "4. Run 'pnpm run build:app' to build for all platforms"
echo "5. Create a GitHub release and upload the built files"
echo ""
echo "Note: The app now runs Next.js as a server inside Electron,"
echo "      which allows for full authentication support." 