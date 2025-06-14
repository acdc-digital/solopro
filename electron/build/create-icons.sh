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

# For macOS - create proper ICNS file
echo "Creating icon.icns for macOS..."

# Create iconset directory
mkdir -p iconset.iconset

# Generate all required icon sizes
sips -z 16 16 "$PNG_SOURCE" --out iconset.iconset/icon_16x16.png
sips -z 32 32 "$PNG_SOURCE" --out iconset.iconset/icon_16x16@2x.png
sips -z 32 32 "$PNG_SOURCE" --out iconset.iconset/icon_32x32.png
sips -z 64 64 "$PNG_SOURCE" --out iconset.iconset/icon_32x32@2x.png
sips -z 128 128 "$PNG_SOURCE" --out iconset.iconset/icon_128x128.png
sips -z 256 256 "$PNG_SOURCE" --out iconset.iconset/icon_128x128@2x.png
sips -z 256 256 "$PNG_SOURCE" --out iconset.iconset/icon_256x256.png
sips -z 512 512 "$PNG_SOURCE" --out iconset.iconset/icon_256x256@2x.png
sips -z 512 512 "$PNG_SOURCE" --out iconset.iconset/icon_512x512.png
sips -z 1024 1024 "$PNG_SOURCE" --out iconset.iconset/icon_512x512@2x.png

# Convert iconset to ICNS
iconutil -c icns iconset.iconset
cp iconset.icns icon.icns

# Clean up
rm -rf iconset.iconset iconset.icns

echo "✅ Icons created successfully!"
echo ""
echo "Files created:"
echo "  - icon.ico (Windows) - proper 256x256 ICO file"
echo "  - icon.png (Linux) - 256x256"
echo "  - icon.icns (macOS) - multi-resolution ICNS file"
echo "  - icons/256x256.png (Linux) - explicit size for builds"
echo ""
echo "🎉 All platform icons ready for Electron!"