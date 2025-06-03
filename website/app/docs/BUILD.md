# Soloist Pro - Build & Distribution Guide

This guide explains how to build and distribute the Soloist Pro Electron app.

## Prerequisites

- Node.js 18+ and pnpm installed
- GitHub account (for hosting releases)
- Code signing certificates (optional, for production releases)

## Build Process

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Build the Renderer (Next.js App)

The renderer needs to be built as static files before packaging with Electron:

```bash
pnpm run build:renderer
```

This creates static files in `renderer/out/` that will be bundled with the Electron app.

### 3. Build the Electron App

To create distributable packages for all platforms:

```bash
pnpm run build:app
```

Or build for specific platforms:

```bash
# Windows only
cd electron && pnpm run build -- --win

# macOS only  
cd electron && pnpm run build -- --mac

# Linux only
cd electron && pnpm run build -- --linux
```

The built packages will be in `electron/dist/`.

## Creating Icons

The placeholder icons in `electron/build/` should be replaced with proper icons:

### Windows (icon.ico)
- Create a 256x256 PNG of your logo
- Convert to ICO format using a tool like:
  - Online: https://convertio.co/png-ico/
  - Command line: `convert icon.png -define icon:auto-resize=256,128,64,48,32,16 icon.ico`

### macOS (icon.icns)
- Create a 1024x1024 PNG of your logo
- Use `iconutil` (comes with Xcode):
  ```bash
  mkdir icon.iconset
  sips -z 16 16     icon1024.png --out icon.iconset/icon_16x16.png
  sips -z 32 32     icon1024.png --out icon.iconset/icon_16x16@2x.png
  sips -z 32 32     icon1024.png --out icon.iconset/icon_32x32.png
  sips -z 64 64     icon1024.png --out icon.iconset/icon_32x32@2x.png
  sips -z 128 128   icon1024.png --out icon.iconset/icon_128x128.png
  sips -z 256 256   icon1024.png --out icon.iconset/icon_128x128@2x.png
  sips -z 256 256   icon1024.png --out icon.iconset/icon_256x256.png
  sips -z 512 512   icon1024.png --out icon.iconset/icon_256x256@2x.png
  sips -z 512 512   icon1024.png --out icon.iconset/icon_512x512.png
  cp icon1024.png icon.iconset/icon_512x512@2x.png
  iconutil -c icns icon.iconset
  ```

### Linux (icon.png)
- Use a 512x512 PNG

## Publishing Releases

### 1. Update Version Numbers

Update version in:
- `package.json` (root)
- `electron/package.json`
- `website/app/download/page.tsx` (LATEST_VERSION constant)

### 2. Build All Platforms

```bash
pnpm run build:app
```

### 3. Create GitHub Release

1. Go to your GitHub repository
2. Click "Releases" → "Draft a new release"
3. Create a new tag (e.g., `v1.2.0`)
4. Upload the built files from `electron/dist/`:
   - `Soloist-Pro-Setup-1.2.0.exe` (Windows installer)
   - `Soloist-Pro-1.2.0.dmg` (macOS installer)
   - `Soloist-Pro-1.2.0.AppImage` (Linux AppImage)
   - `soloist-pro_1.2.0_amd64.deb` (Debian/Ubuntu)
   - `soloist-pro-1.2.0.x86_64.rpm` (Fedora/RHEL)
5. Publish the release

### 4. Update Download Page

Update the GitHub username in `website/app/download/page.tsx`:

```typescript
const GITHUB_REPO = "your-username/solopro"; // Update this
```

### 5. Deploy Website

The website will automatically deploy via Vercel when you push changes.

## Code Signing (Production)

For production releases, you should sign your code:

### Windows
- Obtain a code signing certificate
- Add to electron-builder config:
  ```json
  "win": {
    "certificateFile": "path/to/certificate.pfx",
    "certificatePassword": "password"
  }
  ```

### macOS
- Requires Apple Developer account
- Add to electron-builder config:
  ```json
  "mac": {
    "identity": "Developer ID Application: Your Name (XXXXXXXXXX)",
    "hardenedRuntime": true,
    "gatekeeperAssess": false,
    "entitlements": "build/entitlements.mac.plist",
    "entitlementsInherit": "build/entitlements.mac.plist"
  }
  ```

## Troubleshooting

### Build Fails
- Ensure all dependencies are installed: `pnpm install`
- Clean and rebuild: `pnpm run clean && pnpm install && pnpm run build:app`

### Renderer Not Loading
- Check that `renderer/out/` exists after building
- Verify the path in `electron/package.json` build config matches your setup

### Icons Not Showing
- Ensure icon files exist in `electron/build/`
- Check file formats match platform requirements

## Development Workflow

For development, you can run the renderer and electron separately:

```bash
# Terminal 1: Start all services
pnpm dev

# Or run individually:
# Terminal 1: Convex backend
pnpm run convex:dev

# Terminal 2: Renderer (Next.js)
pnpm run dev:renderer

# Terminal 3: Electron
pnpm run dev:electron
``` 