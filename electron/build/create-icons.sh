#!/bin/bash

echo "🎨 Creating icons for all platforms..."

# Check if we have a logo to work with
if [ -f "../../public/solologo.png" ]; then
    PNG_SOURCE="../../public/solologo.png"
    echo "Using PNG source: $PNG_SOURCE"
else
    echo "❌ No PNG source logo found! Please add solologo.png to public/"
    exit 1
fi

# For Windows - use the 256x256 ICO file
if [ -f "../../public/solologo_256.ico" ]; then
    echo "Creating icon.ico for Windows (256x256)..."
    cp "../../public/solologo_256.ico" icon.ico
else
    echo "❌ No Windows 256x256 ICO found! Please add solologo_256.ico to public/"
    exit 1
fi

# For Linux - create icon.png
echo "Creating icon.png for Linux..."
cp "$PNG_SOURCE" icon.png

# Create icons directory for Linux (electron-builder expects this)
mkdir -p icons
echo "Creating multiple icon sizes for Linux..."
# Create 256x256 icon in icons directory
cp "$PNG_SOURCE" icons/256x256.png

# For macOS - we need ICNS but we'll keep the existing one
echo "Note: For macOS, you'll need to create icon.icns properly"
echo "      See BUILD.md for instructions using iconutil"

echo "✅ Icons created successfully!"
echo ""
echo "Files created:"
echo "  - icon.ico (Windows) - proper 256x256 ICO file"
echo "  - icon.png (Linux) - 256x256"
echo "  - icons/256x256.png (Linux) - explicit size for builds"
echo ""
echo "Note: icon.icns for macOS needs to be created with iconutil" 