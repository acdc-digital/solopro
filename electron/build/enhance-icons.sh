#!/bin/bash

echo "🎨 Generating high-quality icons from SVG source..."

# Check if we have the SVG logo
SVG_SOURCE="../../renderer/public/solologo.svg"
if [ ! -f "$SVG_SOURCE" ]; then
    echo "❌ SVG source not found at $SVG_SOURCE"
    exit 1
fi

echo "Using SVG source: $SVG_SOURCE"

# Check if rsvg-convert is installed (for high-quality SVG to PNG conversion)
if ! command -v rsvg-convert &> /dev/null; then
    echo "⚠️  rsvg-convert not found. Installing with homebrew..."
    if command -v brew &> /dev/null; then
        brew install librsvg
    else
        echo "❌ Homebrew not found. Please install librsvg manually:"
        echo "   brew install librsvg"
        echo "   Or use the fallback method with sips (lower quality)"
        exit 1
    fi
fi

# Create a high-resolution master PNG (1024x1024) from SVG
echo "Creating 1024x1024 master PNG from SVG..."
rsvg-convert -w 1024 -h 1024 "$SVG_SOURCE" -o master-1024.png

# Verify the master was created
if [ ! -f "master-1024.png" ]; then
    echo "❌ Failed to create master PNG"
    exit 1
fi

echo "✅ Created master-1024.png"

# For Windows - create multi-size ICO
echo "Creating Windows ICO with multiple sizes..."
# First, create all the sizes Windows needs
mkdir -p ico-sizes
rsvg-convert -w 16 -h 16 "$SVG_SOURCE" -o ico-sizes/16.png
rsvg-convert -w 32 -h 32 "$SVG_SOURCE" -o ico-sizes/32.png
rsvg-convert -w 48 -h 48 "$SVG_SOURCE" -o ico-sizes/48.png
rsvg-convert -w 64 -h 64 "$SVG_SOURCE" -o ico-sizes/64.png
rsvg-convert -w 128 -h 128 "$SVG_SOURCE" -o ico-sizes/128.png
rsvg-convert -w 256 -h 256 "$SVG_SOURCE" -o ico-sizes/256.png

# Use ImageMagick to create a proper multi-resolution ICO
if command -v convert &> /dev/null; then
    convert ico-sizes/16.png ico-sizes/32.png ico-sizes/48.png ico-sizes/64.png ico-sizes/128.png ico-sizes/256.png icon.ico
    echo "✅ Created multi-resolution icon.ico"
else
    echo "⚠️  ImageMagick not found. Using existing ICO file."
    cp "../../public/solologo_256.ico" icon.ico
fi

# Clean up temporary files
rm -rf ico-sizes

# For Linux - use high-quality 512x512 PNG
echo "Creating Linux icon.png (512x512)..."
rsvg-convert -w 512 -h 512 "$SVG_SOURCE" -o icon.png

# Create icons directory for Linux with multiple sizes
mkdir -p icons
echo "Creating multiple icon sizes for Linux..."
for size in 16 32 48 64 128 256 512 1024; do
    rsvg-convert -w $size -h $size "$SVG_SOURCE" -o "icons/${size}x${size}.png"
    echo "  ✅ Created icons/${size}x${size}.png"
done

# For macOS - create proper ICNS file with all required sizes
echo "Creating macOS ICNS file..."
mkdir -p iconset.iconset

# Generate all required icon sizes for macOS from SVG
rsvg-convert -w 16 -h 16 "$SVG_SOURCE" -o iconset.iconset/icon_16x16.png
rsvg-convert -w 32 -h 32 "$SVG_SOURCE" -o iconset.iconset/icon_16x16@2x.png
rsvg-convert -w 32 -h 32 "$SVG_SOURCE" -o iconset.iconset/icon_32x32.png
rsvg-convert -w 64 -h 64 "$SVG_SOURCE" -o iconset.iconset/icon_32x32@2x.png
rsvg-convert -w 128 -h 128 "$SVG_SOURCE" -o iconset.iconset/icon_128x128.png
rsvg-convert -w 256 -h 256 "$SVG_SOURCE" -o iconset.iconset/icon_128x128@2x.png
rsvg-convert -w 256 -h 256 "$SVG_SOURCE" -o iconset.iconset/icon_256x256.png
rsvg-convert -w 512 -h 512 "$SVG_SOURCE" -o iconset.iconset/icon_256x256@2x.png
rsvg-convert -w 512 -h 512 "$SVG_SOURCE" -o iconset.iconset/icon_512x512.png
rsvg-convert -w 1024 -h 1024 "$SVG_SOURCE" -o iconset.iconset/icon_512x512@2x.png

# Convert iconset to ICNS
iconutil -c icns iconset.iconset
mv iconset.icns icon.icns

# Clean up
rm -rf iconset.iconset
rm -f master-1024.png

echo ""
echo "✅ High-quality icons generated successfully!"
echo ""
echo "Files created:"
echo "  - icon.ico (Windows) - Multi-resolution ICO (16-256px)"
echo "  - icon.png (Linux) - 512x512 high-res PNG"
echo "  - icon.icns (macOS) - Full resolution set (16-1024px)"
echo "  - icons/ (Linux) - Multiple sizes from 16x16 to 1024x1024"
echo ""
echo "🎉 All icons generated from SVG source for maximum quality!"
echo ""
echo "To use these icons:"
echo "1. Rebuild your Electron app"
echo "2. The new high-resolution icons will be used automatically" 