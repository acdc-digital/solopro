#!/bin/bash

# Quick setup script to add Convex environment variables to your shell profile

echo "🔧 Setting up Convex environment variables for MCP"
echo

# Check if .zshrc exists
if [ ! -f ~/.zshrc ]; then
    echo "Creating ~/.zshrc file..."
    touch ~/.zshrc
fi

echo "Your Convex URL has been identified as: https://calm-akita-97.convex.cloud"
echo
echo "Please enter your CONVEX_DEPLOY_KEY from the Convex dashboard:"
echo "1. Go to: https://dashboard.convex.dev/"
echo "2. Select your project → Settings → Deploy Keys"
echo "3. Copy an existing deploy key or create a new one"
echo
read -p "Enter your CONVEX_DEPLOY_KEY: " deploy_key

if [ -n "$deploy_key" ]; then
    echo "# Convex MCP Configuration" >> ~/.zshrc
    echo "export CONVEX_URL=\"https://calm-akita-97.convex.cloud\"" >> ~/.zshrc
    echo "export CONVEX_DEPLOY_KEY=\"$deploy_key\"" >> ~/.zshrc
    echo
    echo "✅ Environment variables added to ~/.zshrc"
    echo "📌 Run: source ~/.zshrc (or restart your terminal)"
    echo "🔄 Then restart VS Code to activate MCP"
else
    echo "❌ No deploy key entered. Please run this script again."
fi
