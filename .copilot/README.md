# Copilot Rules for Soloist Pro

This folder contains GitHub Copilot-specific rules and guidelines for the **Soloist Pro** project - an advanced personal analytics platform that transforms daily experiences into actionable insights through intelligent mood tracking and predictive AI analysis.

## 🎯 Application Overview

**Soloist** is a sophisticated personal analytics platform that serves as your "weather forecast for mood." It combines:

- **Daily Mood Tracking** with 0-100 scoring, notes, tags, and media
- **AI-Powered Forecasting** that predicts your mood 3 days ahead using OpenAI GPT models
- **Interactive Heatmaps** showing 365-day yearly mood visualizations
- **Cross-Platform Experience** with native desktop apps (Electron) and web interface
- **Subscription Model** with Stripe integration for premium AI features
- **Real-time Analytics** including OpenAI cost tracking and admin dashboards

### Key Technical Architecture
- **Monorepo Structure**: `convex/` (backend), `renderer/` (desktop app), `website/` (marketing), `electron/` (wrapper)
- **Modern Stack**: Next.js 15, TypeScript, Tailwind CSS, Shadcn/UI, Convex serverless backend
- **AI Integration**: OpenAI GPT models for mood forecasting, consultations, and pattern analysis
- **Authentication**: Convex Auth with email verification and GitHub OAuth
- **Payments**: Stripe subscriptions with webhook handling
- **Deployment**: Vercel (frontend), Convex Cloud (backend), GitHub Releases (desktop)

## Files Overview

### Core Rule Files

1. **`authentication_rules.md`** - Authentication implementation patterns and security guidelines
   - Convex Auth integration with `getAuthUserId(ctx)` patterns
   - User identification and correlation for Stripe webhooks
   - Security best practices for user data isolation
   - Email verification and password reset flows

2. **`convex_rules.md`** - Convex backend development guidelines
   - Function syntax with proper validators and type safety
   - Database schema design for `dailyLogs`, `forecasts`, `userSubscriptions`
   - Query optimization with proper indexing (`by_userId`, `by_date`)
   - Internal vs public function patterns

3. **`soloist_core_rules.md`** - Core architectural principles and development standards
   - Tech stack requirements (Next.js 15+, TypeScript strict, Shadcn/UI)
   - Component architecture with responsive design patterns
   - Mood color system (6-tier: struggling → excellent)
   - State management with Zustand stores and Convex reactive queries
   - Cross-platform considerations for web and Electron

4. **`stripe_rules.md`** - Stripe integration guidelines
   - Subscription-based feature gating
   - Webhook processing with user correlation
   - LLM-assisted development patterns

## Usage with GitHub Copilot

These rule files serve as context for GitHub Copilot to understand the sophisticated architecture of Soloist Pro and provide contextually appropriate suggestions for:

### AI-Powered Features
- **Mood Forecasting**: 3-day predictions using historical pattern analysis
- **Daily Consultations**: Personalized AI insights based on 7-day context windows
- **Pattern Recognition**: Weekly trend analysis and actionable recommendations
- **Cost Tracking**: Real-time OpenAI usage monitoring with admin analytics

### Data Architecture
- **User-Centric Design**: All data scoped to `userId` with proper indexing
- **Mood Scoring**: 0-100 scale with 6-tier color coding system
- **Time-Based Patterns**: Daily logs with date-based querying and forecasting
- **Subscription Features**: Premium AI functionality gated by Stripe status

### Cross-Platform Development
- **Responsive Design**: Mobile-first with desktop enhancements
- **Electron Integration**: Native desktop app with web parity
- **Environment Detection**: Platform-specific features and navigation
- **Performance Optimization**: Code splitting and lazy loading patterns

## Migration from Cursor IDE

This configuration was migrated from `.cursor/rules/` to provide the same level of AI assistance in VS Code with GitHub Copilot. The original MDC (Markdown Component) format has been converted to standard Markdown for better compatibility.

### Changes Made:

- Removed Cursor-specific frontmatter metadata
- Updated file extensions from `.mdc` to `.md`
- Preserved all core content and examples
- Enhanced formatting for better readability in VS Code

## How to Use

1. Ensure these files are present in your `.copilot/rules/` directory
2. GitHub Copilot will automatically reference these files for context
3. When writing code, Copilot will suggest implementations that follow these patterns
4. Use the guidelines as reference during code reviews

## Key Principles

### Technical Standards
- **TypeScript First**: Strict typing with proper interfaces for all components
- **Authentication Security**: Server-side validation with `getAuthUserId(ctx)` patterns
- **Component Consistency**: Shadcn/UI components with Radix UI primitives
- **Database Best Practices**: User-scoped queries with proper indexing strategies
- **Performance Optimization**: Responsive design with efficient data fetching

### AI Integration Patterns
- **OpenAI Integration**: Proper error handling and fallback mechanisms
- **Cost Monitoring**: Track all AI usage with detailed analytics
- **User Privacy**: Secure AI processing with minimal data exposure
- **Forecast Accuracy**: Confidence scoring and feedback loop learning

### Business Logic
- **Subscription Features**: Stripe-based premium functionality
- **Mood Analytics**: Scientific approach to emotional pattern recognition
- **Cross-Platform UX**: Consistent experience across web and desktop
- **Data Export**: User-controlled data portability and transparency

### Development Workflow
- **Monorepo Management**: Synchronized versioning across packages
- **Release Process**: Automated build verification and distribution
- **Environment Separation**: Clear dev/staging/production boundaries
- **Code Quality**: ESLint, Prettier, and conventional commits

## Contributing

When updating these rules:

1. **Maintain Architecture Consistency** - Ensure changes align with the established monorepo structure
2. **Include AI Context** - Add examples for OpenAI integration and cost tracking patterns
3. **Update All Related Files** - Authentication, Convex, and core rules should be synchronized
4. **Test Cross-Platform** - Verify patterns work for both web and Electron environments
5. **Document Business Logic** - Include subscription and feature gating considerations
6. **Validate with Production** - Test that Copilot suggestions work with the actual Soloist codebase

### Special Considerations for Soloist Pro
- **Mood Data Sensitivity**: Always implement proper privacy protections
- **AI Cost Management**: Include cost tracking in all OpenAI integrations  
- **Subscription Boundaries**: Respect feature gating between free and premium tiers
- **Version Synchronization**: Update version references across all packages
- **Cross-Platform Testing**: Ensure features work in both web and desktop contexts

---

*Last migrated: July 11, 2025*  
*Original source: `.cursor/rules/`*  
*Application: Soloist Pro v1.6.5 - Personal Analytics Platform*
