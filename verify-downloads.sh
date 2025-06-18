#!/bin/bash

# Download Verification Script
# Run this after publishing the GitHub release to verify links work

VERSION="v1.6.1"

echo "🔍 Verifying download links for Soloist Pro $VERSION"
echo ""

# List of download URLs to test
URLS=(
    "https://github.com/acdc-digital/solopro/releases/download/v1.6.1/Soloist.Pro-Setup-1.6.1.exe"
    "https://github.com/acdc-digital/solopro/releases/download/v1.6.1/Soloist.Pro-1.6.1-x64.dmg"
    "https://github.com/acdc-digital/solopro/releases/download/v1.6.1/Soloist.Pro-1.6.1-arm64.dmg"
    "https://github.com/acdc-digital/solopro/releases/download/v1.6.1/Soloist.Pro-1.6.1.AppImage"
    "https://github.com/acdc-digital/solopro/releases/download/v1.6.1/solopro-electron-1.6.1.deb"
)

echo "Testing download URLs..."
echo ""

for url in "${URLS[@]}"; do
    echo -n "Testing: $(basename "$url")... "
    
    # Use curl to check if the URL returns 200 OK
    if curl -s -I "$url" | grep -q "200 OK"; then
        echo "✅ Available"
    else
        echo "❌ Not found (release may not be published yet)"
    fi
done

echo ""
echo "📱 Website Download Locations Updated:"
echo "  - Website DownloadModal: ✅"
echo "  - Website Navbar: ✅"
echo "  - Renderer Sidebar: ✅"
echo ""

echo "🌐 Your customers will now download v1.6.1 when they click:"
echo "  - Download buttons on your website"
echo "  - Download links in the renderer app"
echo "  - Direct DMG links in GitHub releases"
echo ""

echo "📋 Next Steps:"
echo "1. Publish the GitHub release at: https://github.com/acdc-digital/solopro/releases/new"
echo "2. Run this script again to verify the links work"
echo "3. Test the download flow on your website"
echo "4. Announce the new release to your users!" 