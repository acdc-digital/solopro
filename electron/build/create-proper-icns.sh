#!/bin/bash

# Create proper ICNS file with all required sizes for macOS dock icons
# This script creates a complete iconset with all standard macOS icon sizes

echo "Creating proper ICNS file with all required sizes..."

# Create iconset directory
mkdir -p icon.iconset

# You'll need to provide a high-resolution source image (1024x1024)
# For now, we'll use the existing 1024x1024 icon as source
SOURCE_ICON="../dock-icon-source.png"

if [ ! -f "$SOURCE_ICON" ]; then
    echo "Error: Source icon not found at $SOURCE_ICON"
    echo "Please ensure you have a 1024x1024 source icon"
    exit 1
fi

echo "Using source icon: $SOURCE_ICON"

# Generate all required icon sizes
sips -z 16 16     "$SOURCE_ICON" --out icon.iconset/icon_16x16.png
sips -z 32 32     "$SOURCE_ICON" --out icon.iconset/icon_16x16@2x.png
sips -z 32 32     "$SOURCE_ICON" --out icon.iconset/icon_32x32.png
sips -z 64 64     "$SOURCE_ICON" --out icon.iconset/icon_32x32@2x.png
sips -z 128 128   "$SOURCE_ICON" --out icon.iconset/icon_128x128.png
sips -z 256 256   "$SOURCE_ICON" --out icon.iconset/icon_128x128@2x.png
sips -z 256 256   "$SOURCE_ICON" --out icon.iconset/icon_256x256.png
sips -z 512 512   "$SOURCE_ICON" --out icon.iconset/icon_256x256@2x.png
sips -z 512 512   "$SOURCE_ICON" --out icon.iconset/icon_512x512.png
sips -z 1024 1024 "$SOURCE_ICON" --out icon.iconset/icon_512x512@2x.png

echo "Generated icon sizes, creating ICNS..."

# Create the ICNS file
iconutil -c icns icon.iconset --output new-icon.icns

# Check if ICNS was created successfully
if [ -f "new-icon.icns" ]; then
    echo "✅ Created new-icon.icns with all required sizes"
    
    # Backup old icon.icns if it exists
    if [ -f "icon.icns" ]; then
        mv icon.icns icon.icns.backup
        echo "📦 Backed up old icon.icns to icon.icns.backup"
    fi
    
    # Replace with new icon
    mv new-icon.icns icon.icns
    echo "✅ Replaced icon.icns with new version"
else
    echo "❌ Failed to create ICNS file"
    exit 1
fi

# Clean up
rm -rf icon.iconset

echo "✅ Done! New icon.icns created with all standard macOS icon sizes"
