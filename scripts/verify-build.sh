#!/bin/bash
# scripts/verify-build.sh
# Build verification script for SoloPro releases

VERSION="1.6.6"
BUILD_DIR="electron/dist"

echo "🔍 Verifying build files for version $VERSION..."
echo ""

# Check if build directory exists
if [ ! -d "$BUILD_DIR" ]; then
    echo "❌ Build directory $BUILD_DIR does not exist"
    echo "   Run 'pnpm --filter electron run build:mac' to build"
    exit 1
fi

# Check if all expected files exist
FILES=(
    "Soloist.Pro-Setup-$VERSION.exe"
    "Soloist.Pro-$VERSION-x64.dmg"
    "Soloist.Pro-$VERSION-arm64.dmg"
    "Soloist.Pro-$VERSION.AppImage"
    "solopro-electron-$VERSION.deb"
)

echo "📦 Checking for required files:"
echo ""

missing_files=0
for file in "${FILES[@]}"; do
    if [ -f "$BUILD_DIR/$file" ]; then
        echo "✅ $file ($(du -h "$BUILD_DIR/$file" | cut -f1))"
    else
        echo "❌ $file (missing)"
        missing_files=$((missing_files + 1))
    fi
done

echo ""

if [ $missing_files -eq 0 ]; then
    echo "🎉 All build files are present!"
    echo ""
    echo "📊 Build Summary:"
    echo "   Total files: ${#FILES[@]}"
    echo "   Missing files: $missing_files"
    echo "   Build directory: $BUILD_DIR"
    echo ""
    echo "✅ Ready for release!"
else
    echo "⚠️  $missing_files file(s) missing"
    echo ""
    echo "🔧 To build missing files:"
    echo "   Windows: pnpm --filter electron run build:win"
    echo "   macOS: pnpm --filter electron run build:mac"
    echo "   Linux: pnpm --filter electron run build:linux"
    echo ""
    exit 1
fi 