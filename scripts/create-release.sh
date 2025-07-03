#!/bin/bash

# GitHub Release Creation Script for Soloist Pro v1.6.6
# This script helps create a new GitHub release with the built files

VERSION="v1.6.6"
RELEASE_TITLE="SoloPro v1.6.6 - Release Management & Process Enhancement"
RELEASE_NOTES="## 🚀 SoloPro v1.6.6 - Release Management & Process Enhancement

### ✨ What's New
- ✅ **Comprehensive Release Management System** - Complete specification and automation for version management
- ✅ **Release Specification Document** - Detailed process documentation in \`docs/RELEASE.MD\`
- ✅ **Automated Version Update Scripts** - One-command version updating with \`scripts/update-version.sh\`
- ✅ **Build Verification Tools** - Automated build file verification with \`scripts/verify-build.sh\`
- ✅ **Enhanced Release Process** - Git integration and GitHub release automation

### 🔧 Technical Improvements
- ✅ **Version Consistency** - All package.json files and frontend components synchronized
- ✅ **Developer Experience** - Automated scripts reduce manual errors in version management
- ✅ **Build Verification** - Ensure all platform builds are complete before release
- ✅ **Documentation Updates** - Consistent version references across all documentation

### 📦 Downloads
Choose the right version for your platform:
- **Windows**: \`Soloist.Pro-Setup-1.6.6.exe\`
- **macOS Intel**: \`Soloist.Pro-1.6.6-x64.dmg\`
- **macOS Apple Silicon**: \`Soloist.Pro-1.6.6-arm64.dmg\`
- **Linux AppImage**: \`Soloist.Pro-1.6.6.AppImage\`
- **Ubuntu/Debian**: \`solopro-electron-1.6.6.deb\`

### 🎯 Impact
This release establishes a foundation for reliable, consistent version management that will:
- **Reduce Release Errors** - Automated processes eliminate manual mistakes
- **Improve User Experience** - Consistent version information and reliable downloads
- **Enhance Developer Productivity** - Streamlined release processes

---

**Full Changelog**: https://github.com/acdc-digital/solopro/compare/v1.6.5...v1.6.6"

echo "🚀 Creating GitHub Release for $VERSION"
echo ""

# Check if we have the built files
if [ ! -f "electron/dist/Soloist.Pro-1.6.6-x64.dmg" ]; then
    echo "❌ Intel DMG not found. Please build first with: cd electron && npm run build:mac"
    exit 1
fi

if [ ! -f "electron/dist/Soloist.Pro-1.6.6-arm64.dmg" ]; then
    echo "❌ Apple Silicon DMG not found. Please build first with: cd electron && npm run build:mac"
    exit 1
fi

echo "✅ Found required files:"
echo "  - Soloist.Pro-1.6.6-x64.dmg ($(du -h electron/dist/Soloist.Pro-1.6.6-x64.dmg | cut -f1))"
echo "  - Soloist.Pro-1.6.6-arm64.dmg ($(du -h electron/dist/Soloist.Pro-1.6.6-arm64.dmg | cut -f1))"
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
echo "     - electron/dist/Soloist.Pro-Setup-1.6.6.exe"
echo "     - electron/dist/Soloist.Pro-Setup-1.6.6.exe.blockmap"
echo "   📁 macOS:"
echo "     - electron/dist/Soloist.Pro-1.6.6-x64.dmg"
echo "     - electron/dist/Soloist.Pro-1.6.6-arm64.dmg"
echo "     - electron/dist/Soloist.Pro-1.6.6-x64.dmg.blockmap"
echo "     - electron/dist/Soloist.Pro-1.6.6-arm64.dmg.blockmap"
echo "   📁 Linux:"
echo "     - electron/dist/Soloist.Pro-1.6.6.AppImage"
echo "     - electron/dist/solopro-electron-1.6.6.deb"
echo ""
echo "4. Click 'Publish release'"
echo ""
echo "📝 Release Notes (copy this):"
echo "================================"
echo "$RELEASE_NOTES"
echo "================================"
echo ""
echo "🌐 After publishing, your download links will work at:"
echo "   - https://github.com/acdc-digital/solopro/releases/download/v1.6.6/Soloist.Pro-1.6.6-x64.dmg"
echo "   - https://github.com/acdc-digital/solopro/releases/download/v1.6.6/Soloist.Pro-1.6.6-arm64.dmg"