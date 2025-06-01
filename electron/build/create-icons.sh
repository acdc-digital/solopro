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

# For Windows and Linux - use the PNG directly
echo "Creating icon.png for Windows and Linux..."
cp "$SOURCE" icon.png

# Create icons directory for Linux (electron-builder expects this)
mkdir -p icons
echo "Creating multiple icon sizes for Linux..."
# Create 256x256 icon in icons directory
cp "$SOURCE" icons/256x256.png

# For macOS - we need ICNS but we'll keep the existing one
echo "Note: For macOS, you'll need to create icon.icns properly"
echo "      See BUILD.md for instructions using iconutil"

echo "✅ Icons created successfully!"
echo ""
echo "Files created:"
echo "  - icon.png (Windows/Linux) - 256x256"
echo "  - icons/256x256.png (Linux) - explicit size for RPM builds"
echo ""
echo "Note: icon.icns for macOS needs to be created with iconutil"
echo "      Electron-builder will automatically convert PNG to ICO for Windows" 