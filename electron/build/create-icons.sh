#!/bin/bash

echo "🎨 Creating icons for all platforms..."

# Check if we have a logo to work with
if [ -f "../../public/solologo.png" ]; then
    SOURCE="../../public/solologo.png"
    echo "Using PNG source: $SOURCE"
else
    echo "❌ No source logo found! Please add solologo.png to public/"
    exit 1
fi

# For Windows - copy the PNG as ICO (electron-builder will handle it)
echo "Creating icon.ico for Windows..."
# Since we don't have ImageMagick, we'll let electron-builder convert the PNG
cp "$SOURCE" icon.png.tmp
# Also copy as ico for now (electron-builder can work with PNG renamed as ICO)
cp "$SOURCE" icon.ico

# For Linux - need at least 256x256 PNG (we already have it at 256x256)
echo "Creating icon.png for Linux..."
cp "$SOURCE" icon.png

# For macOS - we need ICNS but we'll keep the existing one
echo "Note: For macOS, you'll need to create icon.icns properly"
echo "      See BUILD.md for instructions using iconutil"

# Clean up temp file if we created one
[ -f "icon.png.tmp" ] && rm icon.png.tmp

echo "✅ Icons created successfully!"
echo ""
echo "Files created:"
echo "  - icon.ico (Windows) - 256x256 PNG renamed as ICO"
echo "  - icon.png (Linux) - 256x256"
echo ""
echo "Note: icon.icns for macOS needs to be created with iconutil"
echo "      The PNG-as-ICO workaround should work for Windows builds" 