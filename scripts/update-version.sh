#!/bin/bash
# scripts/update-version.sh
# Automated version update script for SoloPro

OLD_VERSION="1.6.5"
NEW_VERSION="1.6.6"

echo "🚀 Updating version from $OLD_VERSION to $NEW_VERSION"
echo ""

# Update package.json files
echo "📦 Updating package.json files..."
find . -name "package.json" -not -path "./node_modules/*" -not -path "./.next/*" -not -path "./dist/*" -exec sed -i.bak "s/\"version\": \"$OLD_VERSION\"/\"version\": \"$NEW_VERSION\"/g" {} \;

# Update frontend components
echo "🎨 Updating frontend components..."
sed -i.bak "s/$OLD_VERSION/$NEW_VERSION/g" renderer/src/hooks/useAppVersion.ts
sed -i.bak "s/v$OLD_VERSION/v$NEW_VERSION/g" website/components/Navbar.tsx
sed -i.bak "s/v$OLD_VERSION/v$NEW_VERSION/g" website/components/DownloadModal.tsx
sed -i.bak "s/v$OLD_VERSION/v$NEW_VERSION/g" website/components/Admin.tsx

# Update README
echo "📄 Updating README.md..."
sed -i.bak "s/$OLD_VERSION/$NEW_VERSION/g" README.md

# Clean up backup files
echo "🧹 Cleaning up backup files..."
find . -name "*.bak" -not -path "./node_modules/*" -not -path "./.next/*" -not -path "./dist/*" -delete

echo ""
echo "✅ Version updated successfully!"
echo ""
echo "📝 Next steps:"
echo "   1. Review the changes with: git diff"
echo "   2. Update CHANGELOG.md"
echo "   3. Update VERSION_HISTORY.md"
echo "   4. Test all builds"
echo "   5. Create git tag and release"
echo ""
echo "🔍 Files updated:"
echo "   - All package.json files"
echo "   - renderer/src/hooks/useAppVersion.ts"
echo "   - website/components/Navbar.tsx"
echo "   - website/components/DownloadModal.tsx"
echo "   - website/components/Admin.tsx"
echo "   - README.md"
echo ""
echo "Run 'git status' to see all changes." 