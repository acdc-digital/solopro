# 🚀 Soloist Pro v1.6.1 - Build & Notarization Improvements

This release focuses on production readiness with complete Apple notarization, universal binary support, and streamlined development workflows.

## ✨ What's New

### 🔐 **Complete Apple Notarization Pipeline**
- ✅ Full code signing and notarization setup for macOS
- ✅ Automatic Apple Developer API integration
- ✅ Enhanced security with proper entitlements
- ✅ Gatekeeper-compliant distribution ready

### 🏗️ **Universal Binary Support**
- ✅ **Native Intel (x64)** builds for older Macs
- ✅ **Native Apple Silicon (arm64)** builds for M1/M2/M3 Macs
- ✅ Optimized performance for each architecture
- ✅ Automatic architecture detection

### 🛠️ **Developer Experience Improvements**
- ✅ One-command builds with `./build-mac.sh`
- ✅ Automated environment setup with `setup-env.sh`
- ✅ Enhanced error handling and logging
- ✅ Streamlined release process

## 📦 Downloads

**Choose the right version for your platform:**

| Platform | Download | Size | Compatibility |
|----------|----------|------|---------------|
| **Windows** | [Soloist.Pro-Setup-1.6.1.exe](https://github.com/acdc-digital/solopro/releases/download/v1.6.1/Soloist.Pro-Setup-1.6.1.exe) | ~78MB | Windows 10 or later (64-bit) |
| **macOS Intel** | [Soloist.Pro-1.6.1-x64.dmg](https://github.com/acdc-digital/solopro/releases/download/v1.6.1/Soloist.Pro-1.6.1-x64.dmg) | ~99MB | Intel-based Macs, macOS 10.15+ |
| **macOS Apple Silicon** | [Soloist.Pro-1.6.1-arm64.dmg](https://github.com/acdc-digital/solopro/releases/download/v1.6.1/Soloist.Pro-1.6.1-arm64.dmg) | ~96MB | M1/M2/M3 Macs, macOS 11+ |
| **Linux AppImage** | [Soloist.Pro-1.6.1.AppImage](https://github.com/acdc-digital/solopro/releases/download/v1.6.1/Soloist.Pro-1.6.1.AppImage) | ~107MB | Most Linux distributions |
| **Ubuntu/Debian** | [solopro-electron-1.6.1.deb](https://github.com/acdc-digital/solopro/releases/download/v1.6.1/solopro-electron-1.6.1.deb) | ~74MB | Ubuntu, Debian, and derivatives |

> **Platform Detection:**
> - **Windows**: Download the `.exe` installer
> - **Mac (2020+)**: Download Apple Silicon `.dmg`
> - **Mac (2019-)**: Download Intel `.dmg`  
> - **Linux**: Try AppImage first, or use `.deb` for Ubuntu/Debian

## 🔧 Technical Improvements

### **Build System**
- Enhanced `electron-builder` configuration
- Automated DMG creation with proper signatures
- Block map generation for efficient updates
- Cross-architecture build support

### **Code Signing**
- Developer ID Application certificate integration
- Hardened runtime with required entitlements
- Extended attributes cleanup during build
- Automatic certificate detection

### **Development Workflow**
- Environment variable validation
- Dependency management improvements
- Build verification scripts
- Release automation helpers

## 🐛 Bug Fixes

- Fixed code signing certificate format issues
- Improved build process reliability  
- Enhanced notarization error handling
- Resolved electron-builder configuration conflicts
- Fixed architecture-specific build paths

## 🚀 Installation

1. **Download** the appropriate DMG for your Mac
2. **Double-click** the DMG to mount it
3. **Drag** Soloist Pro to your Applications folder
4. **Right-click** and select "Open" on first launch (Gatekeeper requirement)
5. **Enjoy** your enhanced Soloist Pro experience!

## 🔄 Upgrading from v1.6.0

This is a seamless upgrade with no breaking changes:
- Your data and settings are preserved
- No database migrations required
- Direct replacement installation

## 🏆 For Developers

### **New Build Scripts**
```bash
# Quick setup
source setup-env.sh

# Build for macOS (universal)
./build-mac.sh

# Manual build
cd electron && npm run build:mac
```

### **Environment Variables**
```bash
export CSC_NAME="Developer ID Application: Your Name (TEAM_ID)"
export APPLE_API_KEY_ID="your-key-id"
export APPLE_API_ISSUER="your-issuer-id"
export APPLE_API_KEY="./certs/AuthKey_XXXXXXXXXX.p8"
```

### **New Files**
- `build-mac.sh` - Complete macOS build automation
- `setup-env.sh` - Environment configuration
- `electron/build/entitlements.mac.plist` - macOS entitlements
- `create-release.sh` - GitHub release helper
- `verify-downloads.sh` - Download verification

## 📋 System Requirements

| Platform | Minimum | Recommended |
|----------|---------|-------------|
| **Windows** | Windows 10 (64-bit) | Windows 11 or later |
| **macOS** | 10.15 Catalina | 12.0 Monterey or later |
| **Linux** | Ubuntu 18.04+ / Most modern distros | Ubuntu 22.04+ |
| **Memory** | 4GB RAM | 8GB RAM |
| **Storage** | 200MB free | 1GB free |
| **Architecture** | x64 (Intel/AMD) | Native architecture for best performance |

## 🔗 Links

- **🌐 Website**: [soloist.pro](https://soloist.pro)
- **📱 Web App**: [app.soloist.pro](https://app.soloist.pro)
- **📚 Documentation**: [GitHub Wiki](https://github.com/acdc-digital/solopro/wiki)
- **🐛 Issues**: [Report bugs](https://github.com/acdc-digital/solopro/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/acdc-digital/solopro/discussions)

## 🎯 What's Next

- Auto-update mechanism implementation
- Enhanced cross-platform notifications
- Improved Linux desktop integration
- Community contribution guidelines

---

**Full Changelog**: https://github.com/acdc-digital/solopro/compare/v1.6.0...v1.6.1

**Built with ❤️ by [ACDC.digital](https://acdc.digital)** 