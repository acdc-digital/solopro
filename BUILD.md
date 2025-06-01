# Soloist Pro - Build & Distribution Guide

This guide explains how to build and distribute the Soloist Pro Electron app.

## Architecture Overview

The Soloist Pro Electron app runs Next.js as a local server within Electron. This approach allows us to:
- Use API routes for authentication (Convex auth)
- Maintain full Next.js functionality
- Support server-side features

## Prerequisites

- Node.js 18+ and pnpm installed
- GitHub account (for hosting releases)
- Code signing certificates (optional, for production releases)

## Build Process

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Build the Electron App

The build process consists of two steps:
1. Building the Next.js renderer app
2. Packaging everything with Electron

To build for all platforms:

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

### 3. Test the Build

To quickly test the build process for your current platform:

```bash
./test-build.sh
```

## How It Works

1. **Development Mode**: 
   - The renderer (Next.js) runs on port 3002
   - Electron connects to the development server
   - Hot reload and all dev features work normally

2. **Production Mode**:
   - The Next.js app is built and included in the Electron package
   - Electron starts a Next.js production server internally
   - The app loads from `http://localhost:3002`

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

## Environment Variables

The Electron app inherits environment variables from the renderer app. Make sure your `.env.local` file in the renderer directory contains:

```
NEXT_PUBLIC_CONVEX_URL=your-convex-url
# Other necessary environment variables
```

## Troubleshooting

### Build Fails
- Ensure all dependencies are installed: `pnpm install`
- Clean and rebuild: `pnpm run clean && pnpm install && pnpm run build:app`

### Next.js Server Not Starting
- Check the Electron console for error messages
- Ensure the renderer was built successfully (`.next` directory exists)
- Verify all required environment variables are set

### Authentication Issues
- Ensure the Convex backend is running
- Check that API routes are accessible
- Verify environment variables are correctly set

### Icons Not Showing
- Ensure icon files exist in `electron/build/`
- Check file formats match platform requirements

## Development Workflow

For development, run services separately:

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

## Architecture Details

The packaged app structure:
```
electron-app/
├── electron files (main process)
├── resources/
│   └── app/
│       └── renderer/
│           ├── .next/          # Built Next.js app
│           ├── public/         # Static assets
│           ├── package.json    # Renderer dependencies
│           └── node_modules/   # Renderer modules
```

When the Electron app starts in production:
1. Main process launches
2. Spawns a Node.js process running Next.js server
3. Opens a BrowserWindow pointing to localhost:3002
4. Handles app lifecycle (closing server on quit, etc.) 