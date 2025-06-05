# Changelog

All notable changes to SoloPro will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.5.0] - 2025-01-28

### Added
- **Comprehensive Feedback System**: New feedback modal with detailed user feedback collection
  - Star ratings for overall satisfaction, ease of use, data accuracy, helpfulness, and recommendation
  - Feature value assessment (most/least valuable features)
  - Text fields for improvement suggestions, feature requests, privacy concerns, and comments
  - Anonymous feedback support for unauthenticated users
  - Convex backend integration with `userFeedback` table and analytics queries

- **Production Deployment Configuration**: Complete deployment setup for production
  - Environment variable support for website and renderer URLs
  - Vercel configuration files for both website and renderer
  - Automated deployment script (`deploy.sh`) with build validation
  - Comprehensive deployment guide with step-by-step instructions

- **Cross-Application Routing**: Dynamic URL handling between website and renderer
  - Environment-based URL routing (localhost for dev, production domains for prod)
  - Seamless navigation between marketing site and application
  - Updated all hardcoded localhost references to use environment variables

### Changed
- **Updated Package Versions**: Unified all package.json versions to 1.5.0
  - Root monorepo: 1.4.2 → 1.5.0
  - Website: 0.1.0 → 1.5.0  
  - Renderer: 0.1.0 → 1.5.0
  - Electron: 1.4.2 → 1.5.0

- **Enhanced Authentication Integration**: Improved feedback system integration with authentication
  - Uses `useConvexUser` hook for consistent authentication state
  - Proper handling of authenticated and anonymous user feedback

### Technical Improvements
- **Database Schema Updates**: New `userFeedback` table with comprehensive feedback tracking
- **Type Safety**: Full TypeScript support for all new feedback functions
- **Error Handling**: Enhanced error handling and user feedback in the feedback modal
- **Deployment Automation**: Streamlined deployment process with validation and testing

### Developer Experience
- **Deployment Tooling**: New automated deployment script with environment validation
- **Documentation**: Comprehensive deployment guide with troubleshooting section
- **Environment Management**: Clear separation of development and production configurations

---

## [1.4.2] - Previous Release
- Base functionality and core features 