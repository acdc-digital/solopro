# Apple Notarization Setup Guide

This guide will help you set up Apple notarization for your Soloist Pro Electron app.

## Prerequisites

1. **Apple Developer Account** - You need a paid Apple Developer account
2. **Developer ID Certificate** - For code signing outside the App Store
3. **App-Specific Password or API Key** - For notarization

## Step 1: Install Developer ID Certificate

1. Go to [Apple Developer Certificates](https://developer.apple.com/account/resources/certificates/list)
2. Create a "Developer ID Application" certificate if you don't have one
3. Download and install it in your macOS Keychain
4. Verify installation:
   ```bash
   security find-identity -v -p codesigning
   ```

## Step 2: Get Your Team ID

1. Go to [Apple Developer Account](https://developer.apple.com/account/)
2. Find your Team ID (10-character string)
3. Note it down - you'll need it for the CSC_NAME environment variable

## Step 3: Set Up API Key for Notarization (Recommended)

### Option A: App Store Connect API Key (Recommended)

1. Go to [App Store Connect API Keys](https://appstoreconnect.apple.com/access/api)
2. Create a new API key with "Developer" role
3. Download the `.p8` file
4. Note the Key ID and Issuer ID

Your API key file is already at `electron/certs/AuthKey_5X66MM738M.p8`

### Option B: App-Specific Password (Alternative)

1. Go to [Apple ID Account](https://appleid.apple.com/account/manage)
2. Generate an app-specific password
3. Use this with your Apple ID for notarization

## Step 4: Set Environment Variables

Create these environment variables before building:

```bash
# Required for code signing
export CSC_NAME="Developer ID Application: Your Name (YOUR_TEAM_ID)"

# Required for notarization (API Key method)
export APPLE_API_KEY_ID="5X66MM738M"
export APPLE_API_ISSUER="YOUR_ISSUER_ID_HERE"
export APPLE_API_KEY="./certs/AuthKey_5X66MM738M.p8"

# Alternative: App-specific password method
# export APPLE_ID="your-apple-id@example.com"
# export APPLE_APP_SPECIFIC_PASSWORD="your-app-specific-password"
# export APPLE_TEAM_ID="YOUR_TEAM_ID"
```

## Step 5: Build and Notarize

### Quick Build
```bash
./build-mac.sh
```

### Manual Steps
```bash
# 1. Build the renderer
cd renderer
npm run build
cd ..

# 2. Build the Electron app with notarization
cd electron
npm run build:mac
```

## Troubleshooting

### Common Issues

1. **"No identity found"**
   - Make sure your Developer ID certificate is installed in Keychain
   - Check that CSC_NAME matches exactly

2. **"Notarization failed"**
   - Verify your Apple API credentials
   - Check that your app bundle is properly signed
   - Ensure all entitlements are correct

3. **"Invalid Bundle"**
   - Clean build and try again: `rm -rf electron/dist renderer/.next`
   - Check that all required files are included

### Verification Commands

```bash
# Check certificates
security find-identity -v -p codesigning

# Check if app is signed
codesign -dv --verbose=4 "electron/dist/mac/Soloist Pro.app"

# Check notarization status
xcrun altool --notarization-history 0 -u "your-apple-id@example.com" -p "@keychain:AC_PASSWORD"
```

## Environment Setup Script

Add this to your shell profile (`.zshrc`, `.bash_profile`, etc.):

```bash
# Soloist Pro Build Environment
export CSC_NAME="Developer ID Application: Matthew Simon (YOUR_TEAM_ID)"
export APPLE_API_KEY_ID="5X66MM738M"
export APPLE_API_ISSUER="YOUR_ISSUER_ID_HERE"
export APPLE_API_KEY="./certs/AuthKey_5X66MM738M.p8"
```

## Next Steps

1. Replace `YOUR_TEAM_ID` and `YOUR_ISSUER_ID_HERE` with your actual values
2. Run `./build-mac.sh` to build and notarize your app
3. The final DMG will be in `electron/dist/`

## Security Notes

- Never commit your `.p8` API key file to version control
- Keep your app-specific passwords secure
- The API key method is more secure than app-specific passwords

## Support

If you encounter issues:
1. Check the [Electron Builder documentation](https://www.electron.build/configuration/mac)
2. Review [Apple's notarization requirements](https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution)
3. Check the build logs for specific error messages 