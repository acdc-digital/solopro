// RELEASE SPECIFICAITON
// /Users/matthewsimon/Projects/solopro/docs/RELEASE.MD

# 🚀 RELEASE SPECIFICATION

## Overview
This document outlines the complete process for releasing new versions of SoloPro. Follow this specification to ensure consistent, reliable releases across all platforms and components.

## 🎯 Release Information

### Version 1.6.6
- **Current Version**: 1.6.5
- **New Version**: 1.6.6
- **Release Date**: January 2025
- **Release Type**: Patch Release
- **Status**: Planned

### Release Goals
- [ ] Update all version references across the codebase
- [ ] Update frontend components that display version information
- [ ] Update documentation and changelog
- [ ] Create GitHub release with proper assets
- [ ] Ensure all download links work correctly

---

## 📋 Pre-Release Checklist

### 1. Code Preparation
- [ ] All code changes for this release are merged to main branch
- [ ] All tests are passing
- [ ] Build process works correctly for all platforms
- [ ] No blocking issues or critical bugs

### 2. Documentation Updates
- [ ] CHANGELOG.md updated with new version entry
- [ ] VERSION_HISTORY.md updated with release notes
- [ ] README.md version references updated
- [ ] Release notes prepared

### 3. Version Consistency Check
- [ ] All package.json files have consistent version numbers
- [ ] Frontend components display correct version
- [ ] Download links point to correct version
- [ ] Git tags are properly formatted

---

## 🔧 Version Update Process

### Step 1: Update Package.json Files
Update version in all package.json files from `1.6.5` to `1.6.6`:

```bash
# Files to update:
- package.json (root)
- electron/package.json
- renderer/package.json
- website/package.json
```

### Step 2: Update Frontend Components
Update hardcoded version references in:

1. **`renderer/src/hooks/useAppVersion.ts`**
   - Line 13: `current: '1.6.6'`
   - Line 27: `|| '1.6.6'`
   - Line 30: `return '1.6.6'`
   - Line 33: `return '1.6.6'`

2. **`website/components/Navbar.tsx`**
   - Line 171: `v1.6.6`

3. **`website/components/DownloadModal.tsx`**
   - Line 29: Update download URL to `v1.6.6`
   - Line 36: Update download URL to `v1.6.6`
   - Line 43: Update download URL to `v1.6.6`
   - Line 59: Update version badge to `Version 1.6.6`

4. **`website/components/Admin.tsx`**
   - Line 76: Update download URL to `v1.6.6`

### Step 3: Update Documentation

1. **README.md**
   - Line 10: Update version badge to `1.6.6`
   - Lines 38-42: Update all download URLs to `v1.6.6`
   - Line 136: Update version history table entry

2. **docs/CHANGELOG.md**
   - Add new entry for `[1.6.6] - 2025-01-XX`
   - Include all changes, additions, fixes, and security updates

3. **docs/VERSION_HISTORY.md**
   - Add comprehensive release notes for v1.6.6
   - Include download links and platform-specific information

### Step 4: Build and Test

1. **Clean Build**
   ```bash
   pnpm clean
   pnpm install
   ```

2. **Test All Platforms**
   ```bash
   # Test renderer
   pnpm dev:renderer

   # Test website
   pnpm dev:website

   # Test electron
   pnpm dev:electron
   ```

3. **Build Production Assets**
   ```bash
   # Build electron distributables
   pnpm --filter solopro-electron run build:mac
   pnpm --filter solopro-electron run build:win
   pnpm --filter solopro-electron run build:linux
   ```

### Step 5: Git Operations

1. **Create Version Commit**
   ```bash
   git add .
   git commit -m "chore: bump version to 1.6.6"
   ```

2. **Create Git Tag**
   ```bash
   git tag -a v1.6.6 -m "SoloPro v1.6.6"
   ```

3. **Push Changes**
   ```bash
   git push origin main
   git push origin v1.6.6
   ```

### Step 6: GitHub Release

1. **Create GitHub Release**
   - Go to: https://github.com/acdc-digital/solopro/releases/new
   - Tag version: `v1.6.6`
   - Release title: `SoloPro v1.6.6 - [Brief Description]`
   - Description: Copy from VERSION_HISTORY.md
   - Upload built assets

2. **Upload Assets**
   - Windows: `Soloist.Pro-Setup-1.6.6.exe`
   - macOS Intel: `Soloist.Pro-1.6.6-x64.dmg`
   - macOS Apple Silicon: `Soloist.Pro-1.6.6-arm64.dmg`
   - Linux AppImage: `Soloist.Pro-1.6.6.AppImage`
   - Linux Deb: `solopro-electron-1.6.6.deb`

### Step 7: Post-Release Verification

1. **Download Link Testing**
   - Test all download links work correctly
   - Verify file sizes and integrity
   - Check platform compatibility

2. **Frontend Version Display**
   - Verify version shows correctly in Navbar
   - Check Settings dialog version display
   - Confirm update check functionality

3. **Documentation**
   - Verify README displays correct version
   - Check changelog formatting
   - Confirm version history accuracy

---

## 🤖 Automation Scripts

### Release Update Script
Create a script to automate version updates:

```bash
#!/bin/bash
# scripts/update-version.sh
OLD_VERSION="1.6.5"
NEW_VERSION="1.6.6"

echo "🚀 Updating version from $OLD_VERSION to $NEW_VERSION"

# Update package.json files
find . -name "package.json" -not -path "./node_modules/*" -exec sed -i "s/\"version\": \"$OLD_VERSION\"/\"version\": \"$NEW_VERSION\"/g" {} \;

# Update frontend components
sed -i "s/$OLD_VERSION/$NEW_VERSION/g" renderer/src/hooks/useAppVersion.ts
sed -i "s/v$OLD_VERSION/v$NEW_VERSION/g" website/components/Navbar.tsx
sed -i "s/v$OLD_VERSION/v$NEW_VERSION/g" website/components/DownloadModal.tsx
sed -i "s/v$OLD_VERSION/v$NEW_VERSION/g" website/components/Admin.tsx

# Update README
sed -i "s/$OLD_VERSION/$NEW_VERSION/g" README.md

echo "✅ Version updated successfully!"
echo "📝 Don't forget to:"
echo "   - Update CHANGELOG.md"
echo "   - Update VERSION_HISTORY.md"
echo "   - Test all builds"
echo "   - Create git tag and release"
```

### Build Verification Script
```bash
#!/bin/bash
# scripts/verify-build.sh
echo "🔍 Verifying build files..."

VERSION="1.6.6"
BUILD_DIR="electron/dist"

# Check if all expected files exist
FILES=(
    "Soloist.Pro-Setup-$VERSION.exe"
    "Soloist.Pro-$VERSION-x64.dmg"
    "Soloist.Pro-$VERSION-arm64.dmg"
    "Soloist.Pro-$VERSION.AppImage"
    "solopro-electron-$VERSION.deb"
)

for file in "${FILES[@]}"; do
    if [ -f "$BUILD_DIR/$file" ]; then
        echo "✅ $file ($(du -h "$BUILD_DIR/$file" | cut -f1))"
    else
        echo "❌ $file (missing)"
    fi
done
```

---

## 🚦 Release Criteria

### Quality Gates
- [ ] All builds complete successfully
- [ ] No critical bugs or security issues
- [ ] Version consistency across all components
- [ ] Documentation is complete and accurate
- [ ] Download links are functional

### Platform Requirements
- [ ] Windows: Windows 10 or later (64-bit)
- [ ] macOS: macOS 10.15 or later (Intel and Apple Silicon)
- [ ] Linux: AppImage and Deb packages for major distributions

### Performance Benchmarks
- [ ] Application startup time < 3 seconds
- [ ] Build sizes within acceptable limits
- [ ] No memory leaks or performance regressions

---

## 📈 Release Metrics

### Track These Metrics
- Download counts per platform
- User adoption rate
- Bug reports in first 48 hours
- Performance metrics
- User feedback scores

### Success Criteria
- [ ] 95% successful download rate
- [ ] < 5% bug report rate
- [ ] Positive user feedback
- [ ] No critical issues reported

---

## 🔧 Troubleshooting

### Common Issues

**Build Failures**
- Clean node_modules and reinstall dependencies
- Check environment variables
- Verify certificates and signing setup

**Version Mismatch**
- Run version consistency check
- Use search and replace to fix all references
- Test all frontend components

**Download Link Issues**
- Verify GitHub release assets are uploaded
- Check file naming conventions
- Test links in incognito/private browsing

---

## 📞 Support

For issues with the release process:
- Check existing GitHub issues
- Review build logs
- Contact maintainer: msimon@acdc.digital

© 2025 ACDC.digital • Release Process v1.0

