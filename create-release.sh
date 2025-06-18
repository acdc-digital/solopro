#!/bin/bash

# GitHub Release Creation Script for Soloist Pro v1.6.1
# This script helps create a new GitHub release with the built files

VERSION="v1.6.1"
RELEASE_TITLE="Soloist Pro v1.6.1 - Build & Notarization Improvements"
RELEASE_NOTES="## 🚀 Soloist Pro v1.6.1

### ✨ What's New
- ✅ **Complete Apple Notarization Setup** - Full code signing and notarization pipeline
- ✅ **Automated Build Scripts** - One-command macOS builds with \`./build-mac.sh\`
- ✅ **Universal Binary Support** - Native Intel (x64) and Apple Silicon (arm64) builds
- ✅ **Enhanced Development Workflow** - Streamlined environment setup and deployment
- ✅ **Production-Ready Distribution** - Signed and notarized DMGs ready for distribution

### 📦 Downloads
Choose the right version for your Mac:
- **Intel Macs**: \`Soloist.Pro-1.6.1-x64.dmg\`
- **Apple Silicon (M1/M2/M3)**: \`Soloist.Pro-1.6.1-arm64.dmg\`

### 🔧 For Developers
- Updated build configuration with proper entitlements
- Environment setup scripts for easy development
- GitHub Actions workflow improvements
- Enhanced error handling and logging

### 🐛 Bug Fixes
- Fixed code signing certificate format issues
- Improved build process reliability
- Enhanced notarization error handling

---

**Full Changelog**: https://github.com/acdc-digital/solopro/compare/v1.6.0...v1.6.1"

echo "🚀 Creating GitHub Release for $VERSION"
echo ""

# Check if we have the built files
if [ ! -f "electron/dist/Soloist.Pro-1.6.1-x64.dmg" ]; then
    echo "❌ Intel DMG not found. Please build first with: cd electron && npm run build:mac"
    exit 1
fi

if [ ! -f "electron/dist/Soloist.Pro-1.6.1-arm64.dmg" ]; then
    echo "❌ Apple Silicon DMG not found. Please build first with: cd electron && npm run build:mac"
    exit 1
fi

echo "✅ Found required files:"
echo "  - Soloist.Pro-1.6.1-x64.dmg ($(du -h electron/dist/Soloist.Pro-1.6.1-x64.dmg | cut -f1))"
echo "  - Soloist.Pro-1.6.1-arm64.dmg ($(du -h electron/dist/Soloist.Pro-1.6.1-arm64.dmg | cut -f1))"
echo ""

echo "📋 Manual Steps to Complete:"
echo ""
echo "1. Go to: https://github.com/acdc-digital/solopro/releases/new"
echo ""
echo "2. Fill in the form:"
echo "   - Tag version: $VERSION"
echo "   - Release title: $RELEASE_TITLE"
echo "   - Description: Copy the release notes below"
echo ""
echo "3. Upload these files:"
echo "   📁 Windows:"
echo "     - electron/dist/Soloist.Pro-Setup-1.6.1.exe"
echo "     - electron/dist/Soloist.Pro-Setup-1.6.1.exe.blockmap"
echo "   📁 macOS:"
echo "     - electron/dist/Soloist.Pro-1.6.1-x64.dmg"
echo "     - electron/dist/Soloist.Pro-1.6.1-arm64.dmg"
echo "     - electron/dist/Soloist.Pro-1.6.1-x64.dmg.blockmap"
echo "     - electron/dist/Soloist.Pro-1.6.1-arm64.dmg.blockmap"
echo "   📁 Linux:"
echo "     - electron/dist/Soloist.Pro-1.6.1.AppImage"
echo "     - electron/dist/solopro-electron-1.6.1.deb"
echo ""
echo "4. Click 'Publish release'"
echo ""
echo "📝 Release Notes (copy this):"
echo "================================"
echo "$RELEASE_NOTES"
echo "================================"
echo ""
echo "🌐 After publishing, your download links will work at:"
echo "   - https://github.com/acdc-digital/solopro/releases/download/v1.6.1/Soloist.Pro-1.6.1-x64.dmg"
echo "   - https://github.com/acdc-digital/solopro/releases/download/v1.6.1/Soloist.Pro-1.6.1-arm64.dmg" 