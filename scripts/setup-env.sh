#!/bin/bash

# Environment setup script for Soloist Pro build
# Run with: source setup-env.sh

echo "🔧 Setting up build environment for Soloist Pro..."

# Code signing identity (already detected)
export CSC_NAME="Matthew Simon (JNNAATJZ3T)"

# Apple API credentials for notarization
export APPLE_API_KEY_ID="5X66MM738M"
export APPLE_API_KEY="./certs/AuthKey_5X66MM738M.p8"
export APPLE_API_ISSUER="55f3e31e-7e96-49e8-b5c7-876dbfca3d84"

echo "✅ Code signing identity: $CSC_NAME"
echo "✅ API Key ID: $APPLE_API_KEY_ID"
echo "✅ API Key Path: $APPLE_API_KEY"

if [ -f "electron/certs/AuthKey_5X66MM738M.p8" ]; then
    echo "✅ API Key file found"
else
    echo "❌ API Key file not found at electron/certs/AuthKey_5X66MM738M.p8"
fi

echo ""
echo "📋 Next steps:"
echo "1. Set your APPLE_API_ISSUER (see warning above)"
echo "2. Run: ./build-mac.sh"
echo "" 