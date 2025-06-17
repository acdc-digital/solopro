const { notarize } = require('@electron/notarize');

module.exports = {
  appId: "com.soloistpro.app",
  productName: "Soloist Pro",
  publish: null,
  files: [
    "index.js",
    "preload.js", 
    "index.html",
    "node_modules/**/*"
  ],
  extraResources: [
    {
      from: "../renderer",
      to: "app/renderer",
      filter: [
        "**/*",
        "!src/**/*",
        "!node_modules/**/*",
        "!.next/cache/**/*",
        "!.next/cache*/**/*",
        "!.next/trace",
        "!**/*.map",
        "!*.log",
        "!**/.DS_Store",
        "!**/cache/**/*",
        "!**/temp/**/*",
        "!**/tmp/**/*"
      ]
    }
  ],
  directories: {
    buildResources: "build",
    output: "dist"
  },
  win: {
    target: [
      {
        target: "nsis",
        arch: ["x64"]
      }
    ],
    icon: "build/icon.ico",
    artifactName: "Soloist.Pro-Setup-${version}.${ext}"
  },
  nsis: {
    oneClick: false,
    allowElevation: true,
    allowToChangeInstallationDirectory: true,
    installerIcon: "build/icon.ico",
    uninstallerIcon: "build/icon.ico",
    installerHeaderIcon: "build/icon.ico",
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    shortcutName: "Soloist Pro",
    artifactName: "Soloist.Pro-Setup-${version}.${ext}"
  },
  mac: {
    target: [
      {
        target: "dmg",
        arch: ["x64", "arm64"]
      }
    ],
    icon: "build/icon.icns",
    category: "public.app-category.productivity",
    hardenedRuntime: true,
    gatekeeperAssess: false,
    entitlements: "build/entitlements.mac.plist",
    entitlementsInherit: "build/entitlements.mac.plist",
    // Code signing identity
    identity: process.env.CSC_NAME || "Matthew Simon (JNNAATJZ3T)"
  },
  dmg: {
    contents: [
      {
        x: 130,
        y: 220
      },
      {
        x: 410,
        y: 220,
        type: "link",
        path: "/Applications"
      }
    ],
    artifactName: "Soloist.Pro-${version}-${arch}.${ext}"
  },
  linux: {
    target: [
      {
        target: "AppImage",
        arch: ["x64"]
      },
      {
        target: "deb",
        arch: ["x64"]
      }
    ],
    icon: "build/icons",
    category: "Audio",
    maintainer: "matthew@soloistpro.com",
    artifactName: "${name}-${version}.${ext}",
    executableName: "soloist-pro",
    desktop: {
      Name: "Soloist Pro",
      Comment: "Professional Music Practice App"
    }
  },
  appImage: {
    artifactName: "Soloist.Pro-${version}.${ext}"
  },
  afterPack: async context => {
    if (process.platform === 'darwin') {
      const { execSync } = require('child_process');
      const appPath = `${context.appOutDir}/Soloist Pro.app`;
      
      console.log('Cleaning extended attributes and dot-underscore files...');
      
      try {
        // 1. Strip all extended attributes recursively
        execSync(`xattr -cr "${appPath}"`, { stdio: 'inherit' });
        console.log('✅ Stripped extended attributes');
        
        // 2. Delete dot-underscore resource fork files
        execSync(`find "${appPath}" -name '._*' -delete`, { stdio: 'inherit' });
        console.log('✅ Removed dot-underscore files');
        
        console.log('Successfully cleaned app bundle for code signing');
      } catch (error) {
        console.error('❌ Failed to clean app bundle:', error.message);
        throw error;
      }
    }
  },
  afterSign: async (context) => {
    const { electronPlatformName, appOutDir } = context;
    if (electronPlatformName !== 'darwin') {
      return;
    }

    const appName = context.packager.appInfo.productFilename;
    const appPath = `${appOutDir}/${appName}.app`;

    // Check if notarization credentials are properly set
    const appleApiIssuer = process.env.APPLE_API_ISSUER;
    
    if (!appleApiIssuer || appleApiIssuer === 'YOUR_ISSUER_ID') {
      console.log('⚠️  Skipping notarization - APPLE_API_ISSUER not set');
      console.log('   To enable notarization, set: export APPLE_API_ISSUER="your-issuer-id"');
      console.log('   Get your Issuer ID from: https://appstoreconnect.apple.com/access/api');
      return;
    }

    console.log('🍎 Starting notarization process...');

    try {
      await notarize({
        appBundleId: 'com.soloistpro.app',
        appPath: appPath,
        appleApiKey: process.env.APPLE_API_KEY || './certs/AuthKey_5X66MM738M.p8',
        appleApiKeyId: process.env.APPLE_API_KEY_ID || '5X66MM738M',
        appleApiIssuer: appleApiIssuer
      });

      console.log('✅ Notarization completed successfully!');
    } catch (error) {
      console.error('❌ Notarization failed:', error);
      throw error;
    }
  }
}; 