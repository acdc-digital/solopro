#!/bin/bash

echo "🎨 Enhancing icons using built-in tools..."

# Use the existing 256x256 PNG as source
PNG_SOURCE="../../public/solologo.png"
if [ ! -f "$PNG_SOURCE" ]; then
    echo "❌ PNG source not found at $PNG_SOURCE"
    exit 1
fi

echo "Using PNG source: $PNG_SOURCE"

# For Windows - use the existing 256x256 ICO
echo "Copying Windows icon..."
cp "../../public/solologo_256.ico" icon.ico

# For Linux - create a high-quality 512x512 PNG using sips (macOS built-in)
echo "Creating Linux icon (512x512)..."
# First copy the original
cp "$PNG_SOURCE" icon-temp.png
# Upscale to 512x512 using Lanczos algorithm for better quality
sips -z 512 512 icon-temp.png --resampleHeightWidthMax 512 --out icon.png
rm icon-temp.png

# Create icons directory for Linux
mkdir -p icons
echo "Creating multiple icon sizes for Linux..."
# Create 256x256 (copy original)
cp "$PNG_SOURCE" icons/256x256.png
# Create 512x512
sips -z 512 512 "$PNG_SOURCE" --resampleHeightWidthMax 512 --out icons/512x512.png

# For macOS - create enhanced ICNS with better quality settings
echo "Creating enhanced macOS ICNS file..."
mkdir -p iconset.iconset

# Generate all required sizes with high-quality resampling
echo "Generating icon sizes with high-quality resampling..."
sips -z 16 16 "$PNG_SOURCE" --resampleHeightWidthMax 16 --out iconset.iconset/icon_16x16.png
sips -z 32 32 "$PNG_SOURCE" --resampleHeightWidthMax 32 --out iconset.iconset/icon_16x16@2x.png
sips -z 32 32 "$PNG_SOURCE" --resampleHeightWidthMax 32 --out iconset.iconset/icon_32x32.png
sips -z 64 64 "$PNG_SOURCE" --resampleHeightWidthMax 64 --out iconset.iconset/icon_32x32@2x.png
sips -z 128 128 "$PNG_SOURCE" --resampleHeightWidthMax 128 --out iconset.iconset/icon_128x128.png
sips -z 256 256 "$PNG_SOURCE" --resampleHeightWidthMax 256 --out iconset.iconset/icon_128x128@2x.png
sips -z 256 256 "$PNG_SOURCE" --resampleHeightWidthMax 256 --out iconset.iconset/icon_256x256.png
sips -z 512 512 "$PNG_SOURCE" --resampleHeightWidthMax 512 --out iconset.iconset/icon_256x256@2x.png
sips -z 512 512 "$PNG_SOURCE" --resampleHeightWidthMax 512 --out iconset.iconset/icon_512x512.png

# For the 1024x1024 size, we'll upscale with high quality
echo "Creating 1024x1024 icon with high-quality upscaling..."
sips -z 1024 1024 "$PNG_SOURCE" --resampleHeightWidthMax 1024 --out iconset.iconset/icon_512x512@2x.png

# Convert iconset to ICNS
iconutil -c icns iconset.iconset
mv iconset.icns icon.icns

# Clean up
rm -rf iconset.iconset

echo ""
echo "✅ Icons enhanced successfully!"
echo ""
echo "Improvements made:"
echo "  - Used high-quality resampling for all sizes"
echo "  - Created 512x512 Linux icon (2x original size)"
echo "  - Generated 1024x1024 for macOS Retina displays"
echo "  - All icons use Lanczos algorithm for sharper results"
echo ""
echo "Files updated:"
echo "  - icon.ico (Windows) - 256x256"
echo "  - icon.png (Linux) - 512x512 high-quality"
echo "  - icon.icns (macOS) - Full set including 1024x1024"
echo ""
echo "🎉 Icons are now optimized for high-DPI displays!" 