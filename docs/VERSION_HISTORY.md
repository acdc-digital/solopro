# 🔐 SoloPro v1.6.4 - Enhanced Security & Authentication

This release significantly strengthens user security with comprehensive authentication enhancements, email verification, and robust password management.

## ✨ **Major Security Improvements**

### 🛡️ **New Security Features**

#### **Email Verification System**
- ✅ **Required email verification** for all new user accounts
- ✅ **8-digit OTP codes** sent via professional branded emails
- ✅ **Resend integration** for reliable email delivery
- ✅ **Secure token generation** using Oslo cryptography

#### **Advanced Password Security**
- ✅ **Strong password requirements**: 8+ characters with uppercase, lowercase, numbers, and special characters
- ✅ **Real-time validation** with helpful requirement hints
- ✅ **Custom password provider** with detailed error messages
- ✅ **Backward compatibility** for existing user accounts

#### **Complete Password Reset Flow**
- ✅ **Email-based password reset** with secure OTP verification
- ✅ **Two-step process**: email verification → new password creation
- ✅ **Rate limiting protection** via Convex Auth
- ✅ **Professional email templates** with security warnings

### 🎨 **Enhanced User Experience**

#### **Improved Error Handling**
- ✅ **Smart error detection** with contextual messaging
- ✅ **Color-coded badges**: amber for verification issues, red for critical errors
- ✅ **User-friendly suggestions** with actionable next steps
- ✅ **Professional styling** with icons and proper visual hierarchy

#### **Streamlined Security Settings**
- ✅ **Integrated password reset** within user profile modals
- ✅ **No overlapping modals** - clean, single-modal experience
- ✅ **Consistent security iconography** across all interfaces
- ✅ **Mobile-responsive design** for all authentication flows

### 🔧 **Technical Improvements**

#### **Schema & Database**
- ✅ **Fixed schema conflicts** between custom users table and Convex Auth
- ✅ **Standardized user ID fields** across all tables
- ✅ **Database cleanup** of orphaned authentication records
- ✅ **Maintained backward compatibility** with existing data

#### **TypeScript & Build**
- ✅ **Fixed compilation errors** in authentication components
- ✅ **Proper type annotations** for enhanced development experience
- ✅ **Build optimization** for all packages (renderer, website, electron)

### 📧 **Email Infrastructure**

#### **Professional Email Templates**
- ✅ **Branded verification emails** with SoloPro styling
- ✅ **Security-focused messaging** for password reset notifications
- ✅ **Clear call-to-action buttons** for better user engagement
- ✅ **Mobile-optimized email layouts**

#### **Reliable Delivery**
- ✅ **Resend service integration** for professional email delivery
- ✅ **Proper domain verification** for production email sending
- ✅ **Enhanced error logging** for debugging email issues

### 🏗️ **Architecture Updates**

#### **Authentication Flow**
- ✅ **Unified authentication system** across website and desktop app
- ✅ **Consistent error handling** between all authentication states
- ✅ **Proper flow control** with back navigation and state management
- ✅ **Security-first design** with verification-required workflows

#### **Component Architecture**
- ✅ **Reusable authentication components** across packages
- ✅ **Shared error handling logic** for consistent user experience
- ✅ **Modular security features** for easy maintenance and updates

## 📦 Downloads

**Choose the right version for your platform:**

| Platform | Download | Size | Compatibility |
|----------|----------|------|---------------|
| **Windows** | [Soloist.Pro-Setup-1.6.4.exe](https://github.com/acdc-digital/solopro/releases/download/v1.6.4/Soloist.Pro-Setup-1.6.4.exe) | ~74MB | Windows 10 or later (64-bit) |
| **macOS Intel** | [Soloist.Pro-1.6.4-x64.dmg](https://github.com/acdc-digital/solopro/releases/download/v1.6.4/Soloist.Pro-1.6.4-x64.dmg) | ~99MB | Intel-based Macs, macOS 10.15+ |
| **macOS Apple Silicon** | [Soloist.Pro-1.6.4-arm64.dmg](https://github.com/acdc-digital/solopro/releases/download/v1.6.4/Soloist.Pro-1.6.4-arm64.dmg) | ~92MB | M1/M2/M3 Macs, macOS 11+ |
| **Linux AppImage** | [Soloist.Pro-1.6.4.AppImage](https://github.com/acdc-digital/solopro/releases/download/v1.6.4/Soloist.Pro-1.6.4.AppImage) | ~102MB | Most Linux distributions |
| **Ubuntu/Debian** | [solopro-electron-1.6.4.deb](https://github.com/acdc-digital/solopro/releases/download/v1.6.4/solopro-electron-1.6.4.deb) | ~71MB | Ubuntu, Debian, and derivatives |

> **Platform Detection:**
> - **Windows**: Download the `.exe` installer
> - **Mac (2020+)**: Download Apple Silicon `.dmg`
> - **Mac (2019-)**: Download Intel `.dmg`  
> - **Linux**: Try AppImage first, or use `.deb` for Ubuntu/Debian

## 🔄 Upgrading from v1.6.1

This is a seamless upgrade with significant security enhancements:
- Your data and settings are preserved
- Enhanced security with email verification (new users only)
- Improved password management for all users
- Direct replacement installation

## 🚀 **What's Next?**

This release establishes a robust security foundation for SoloPro. Future updates will build upon these improvements with additional enterprise-grade security features.

### Upcoming Security Enhancements
- Two-factor authentication (2FA)
- Enhanced session management
- Advanced account recovery options
- Security audit logging

## 🙏 **Acknowledgments**

Special thanks to the Convex Auth team for providing excellent authentication infrastructure and the Resend team for reliable email delivery services.

---

**Full Changelog**: [v1.6.3...v1.6.4](https://github.com/acdc-digital/solopro/compare/v1.6.3...v1.6.4)

**Built with ❤️ by [ACDC.digital](https://acdc.digital)**

---

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