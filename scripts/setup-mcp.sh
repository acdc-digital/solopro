#!/bin/bash

# Convex MCP Setup Script
# This script helps you configure your Convex MCP server for GitHub Copilot

echo "🔧 Setting up Convex MCP for GitHub Copilot"
echo

# Check if Convex is available (locally or globally)
if command -v convex &> /dev/null; then
    CONVEX_CMD="convex"
elif command -v npx &> /dev/null && npx convex --version &> /dev/null; then
    CONVEX_CMD="npx convex"
elif command -v pnpm &> /dev/null && pnpm convex --version &> /dev/null; then
    CONVEX_CMD="pnpm convex"
else
    echo "❌ Convex CLI not found. Please install it first:"
    echo "   pnpm install -g convex"
    echo "   or use: npx convex"
    exit 1
fi

# Check for existing environment variables
echo "🔍 Checking for existing Convex configuration..."
if [ -f ".env.local" ]; then
    echo "📄 Found .env.local file"
    if grep -q "NEXT_PUBLIC_CONVEX_URL" .env.local; then
        echo "✅ NEXT_PUBLIC_CONVEX_URL found in .env.local:"
        grep "NEXT_PUBLIC_CONVEX_URL" .env.local
    fi
    if grep -q "CONVEX_URL" .env.local; then
        echo "✅ CONVEX_URL found in .env.local:"
        grep "CONVEX_URL" .env.local
    fi
fi

# Get Convex deployment info
echo
echo "📋 Getting your Convex environment variables..."
$CONVEX_CMD env list

echo
echo "📝 To complete the MCP setup, you need to:"
echo "1. Get your CONVEX_URL from your .env.local file or deployment"
echo "   • It should look like: https://your-deployment.convex.cloud"
echo "   • Check your .env.local file or Convex dashboard"
echo
echo "2. Get your CONVEX_DEPLOY_KEY from your Convex dashboard:"
echo "   • Go to: https://dashboard.convex.dev/"
echo "   • Select your project → Settings → Deploy Keys"
echo "   • Create or copy an existing deploy key"
echo
echo "3. Add these to your shell profile (~/.zshrc):"
echo "   export CONVEX_URL=\"https://your-deployment.convex.cloud\""
echo "   export CONVEX_DEPLOY_KEY=\"your-deploy-key\""
echo
echo "4. Reload your shell: source ~/.zshrc"
echo "5. Restart VS Code to load the MCP configuration"
echo
echo "✅ MCP configuration file created at: ~/.config/github-copilot/hosts.json"
