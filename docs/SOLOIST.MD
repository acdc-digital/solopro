# Soloist - Advanced Personal Analytics Platform

## 🎯 **Core Concept**

Soloist is a dynamic personal analytics platform that transforms your daily experiences into actionable insights through intelligent mood tracking and predictive analysis. Think of it as your personal data scientist for emotional well-being—it helps you identify self-patterns and make data-driven decisions about your life. With AI-powered forecasting, you get 3-day predictions based on your historical patterns, interactive heatmaps that visualize your entire year at a glance, and auto-generated summaries that turn scattered thoughts into meaningful insights.

**Tagline**: "Track. Predict. Forecast." - Turn everyday moments into powerful predictions, see patterns in your life before they happen, and take control of your future.

---

## 🏗️ **Technical Architecture**

### **Monorepo Structure**
```
solopro/
├── convex/              # Backend (Convex serverless functions)
├── renderer/            # Desktop app frontend (Next.js)
├── website/             # Public website (Next.js)
├── electron/            # Desktop app wrapper (Electron)
└── docs/               # Documentation
```

### **Tech Stack**

#### **Frontend**
- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Component Library**: Shadcn/UI (built on Radix UI primitives)
- **Icons**: Lucide React + Radix Icons
- **State Management**: Zustand
- **Forms**: React Hook Form
- **Authentication**: Convex Auth (email/password + GitHub OAuth)
- **Charts**: Recharts for mood visualization
- **Date Handling**: date-fns

#### **Backend**
- **Platform**: Convex (serverless backend-as-a-service)
- **Database**: Convex native (NoSQL with relational capabilities)
- **Authentication**: Convex Auth with custom providers
- **Email**: Resend integration for verification/reset
- **Payments**: Stripe integration for subscriptions
- **AI**: OpenAI GPT models for analysis and forecasting

#### **Desktop App**
- **Wrapper**: Electron (cross-platform)
- **Frontend**: Same Next.js renderer as web
- **Distribution**: Code-signed and notarized for macOS, Windows, Linux

#### **Deployment**
- **Frontend**: Vercel (website + renderer)
- **Backend**: Convex Cloud
- **Desktop**: GitHub Releases with auto-updater

---

## 🗃️ **Database Schema**

### **Core Tables**

#### **dailyLogs**
```typescript
{
  _id: Id<"dailyLogs">,
  userId: Id<"users">,
  date: string,           // YYYY-MM-DD format
  score: number,          // 0-100 mood score
  notes?: string,         // User notes
  tags?: string[],        // Activity tags
  media?: string[],       // Base64 encoded images
  createdAt: number,      // Unix timestamp
  updatedAt: number
}
```

#### **users**
```typescript
{
  _id: Id<"users">,
  authId: string,         // Convex Auth ID
  name?: string,
  email?: string,
  image?: string,
  role: "user" | "admin",
  githubId?: string,
  createdAt: number,
  updatedAt: number
}
```

#### **userSubscriptions**
```typescript
{
  _id: Id<"userSubscriptions">,
  userId: Id<"users">,
  stripeCustomerId: string,
  stripeSubscriptionId: string,
  status: "active" | "canceled" | "past_due",
  currentPeriodEnd: number,
  priceId: string,
  createdAt: number,
  updatedAt: number
}
```

#### **forecasts**
```typescript
{
  _id: Id<"forecasts">,
  userId: Id<"users">,
  baseDate: string,       // Date forecast was generated from
  predictions: Array<{
    date: string,
    predictedScore: number,
    confidence: number,    // 0-100
    reasoning: string
  }>,
  trend: "up" | "down" | "stable",
  createdAt: number
}
```

#### **userAttributes**
```typescript
{
  _id: Id<"userAttributes">,
  userId: Id<"users">,
  attributes: Record<string, any>, // Flexible user preferences
  createdAt: number,
  updatedAt: number
}
```

---

## 🤖 **AI Integration Details**

### **1. Predictive Mood Forecasting**
The core AI feature uses OpenAI's GPT models to analyze historical mood data and generate 3-day forecasts:

- **Data Processing**: The system analyzes your past 4 days of mood logs (emotion scores, activities, notes) to predict the next 3 days
- **Pattern Recognition**: AI identifies trends, cycles, and correlations in your emotional patterns
- **Confidence Scoring**: Each forecast includes a confidence level that decreases with distance (e.g., 90% for tomorrow, 75% for day after tomorrow)
- **Trend Analysis**: Determines if your mood is trending "up," "down," or "stable"

### **2. Daily AI Consultations**
The system provides personalized daily insights through AI-generated consultations:

- **Context-Aware Analysis**: AI reviews your selected day in the context of the surrounding 7-day period
- **Personalized Summaries**: Generates 2-4 sentence summaries that connect your daily score to weekly patterns
- **Supportive Tone**: Maintains an empathetic, wellness-focused perspective in all AI interactions

### **3. Weekly Pattern Analysis**
Advanced AI generates comprehensive weekly insights:

- **Multi-Day Analysis**: Processes 7 days of data including both historical logs and future forecasts
- **Trend Identification**: Spots emerging patterns, winning streaks, and concerning dips
- **Actionable Recommendations**: Provides specific suggestions based on identified patterns

### **4. Smart Auto-Generation**
The platform offers AI-powered automation features:

- **Auto-Summaries**: AI analyzes your daily entries and generates concise summaries
- **Template Intelligence**: Dynamic form generation based on your tracking preferences
- **Feed Generation**: AI curates your daily notes, media, and tags into a meaningful timeline

### **5. Technical Implementation**
The AI system is built with robust architecture:

- **OpenAI Integration**: Uses GPT models via direct API calls with proper error handling
- **Real-time Processing**: AI consultations and forecasts are generated on-demand
- **Data Privacy**: All AI processing respects user privacy with secure data handling
- **Fallback Systems**: Graceful degradation when AI services are unavailable

### **6. Feedback Loop Learning**
The system continuously improves through user feedback:

- **Forecast Accuracy Tracking**: Users can rate forecast accuracy (thumbs up/down)
- **Pattern Validation**: Compares AI predictions against actual outcomes
- **Continuous Improvement**: Uses feedback to refine future predictions

---

## 🎨 **Frontend Architecture**

### **Component Structure**

#### **Shared Components** (`/components/ui/`)
- shadcn/ui components (Button, Dialog, Input, Card, etc.)
- Built on Radix UI primitives with Tailwind CSS styling
- Customizable design system with CSS variables for theming
- Lucide React icons for consistent iconography

#### **Dashboard Components** (`renderer/src/app/dashboard/_components/`)
- **Sidebar**: Navigation, user avatar, settings
- **Heatmap**: Year-view mood visualization with D3-like interactions
- **Controls**: Year selector, filtering, legend controls
- **Feed**: Daily log entries with media, notes, tags
- **RightSidebar**: Resizable panel for log details and forms
- **Templates**: Reusable log templates with auto-suggestions

#### **Specialized Views**
- **Soloist**: AI consultation and forecast interface
- **Testing/Playground**: Advanced analytics for premium users
- **Settings**: User preferences, account management, security

### **State Management**

#### **Zustand Stores**
- **feedStore**: Manages selected date, active tab, sidebar state
- **sidebarStore**: Navigation state, collapsed state, current view
- **userStore**: User preferences, subscription status
- **TestingStore**: Playground-specific state management

#### **Convex Reactive Queries**
- Real-time data synchronization
- Optimistic updates for better UX
- Automatic caching and invalidation

### **Responsive Design**
- **Mobile-first**: Tailwind breakpoints (sm, md, lg, xl)
- **Desktop optimization**: Electron-specific UI adaptations
- **Cross-platform**: Consistent experience across web/desktop

---

## 🔐 **Authentication & Security**

### **Authentication System**
- **Convex Auth**: Custom implementation with email/password + OAuth
- **Email Verification**: Required for new accounts with OTP codes
- **Password Reset**: Secure email-based flow with validation
- **GitHub OAuth**: Social login integration

### **Security Features**
- **Strong Password Requirements**: 8+ chars, mixed case, numbers, symbols
- **Rate Limiting**: Built into Convex Auth
- **CSRF Protection**: Next.js built-in protections
- **Secure Headers**: Production security headers via Vercel
- **Code Signing**: Desktop apps are signed and notarized

### **User Roles & Permissions**
- **Admin**: Full access to admin panel, user management
- **User**: Standard access to personal data only
- **Subscription-based**: Premium features for paying users

---

## 💳 **Subscription & Monetization**

### **Stripe Integration**
- **Products**: Free tier + Premium subscription
- **Webhooks**: Real-time subscription status updates
- **Customer Portal**: Self-service subscription management
- **Payment Methods**: Cards, bank transfers, regional methods

### **Feature Gating**
- **Free Tier**: Basic mood tracking, limited history
- **Premium**: AI features, unlimited history, desktop app, exports
- **Feature Flags**: Dynamic feature control based on subscription

---

## 📊 **Data Visualization**

### **Mood Heatmap**
- **Year View**: 365-day grid showing mood scores as colors
- **Color Coding**: 6-tier system (Struggling → Thriving)
- **Interactive**: Click dates to view/edit logs
- **Filtering**: By score ranges, tags, date ranges
- **Responsive**: Adapts to screen sizes with smart scaling

### **Charts & Analytics**
- **Recharts Integration**: Line charts, bar charts, trend analysis
- **Forecast Visualization**: Future predictions with confidence intervals
- **Weekly Patterns**: Identify recurring patterns and cycles
- **Trend Analysis**: Visual trend indicators and statistical insights

---

## 🚀 **Development Workflow**

### **Environment Setup**
```bash
# Install dependencies
pnpm install

# Start development environment
pnpm dev  # Starts all services (Convex + Next.js)

# Individual services
pnpm dev:renderer    # Just the desktop app frontend
pnpm dev:website     # Just the public website
pnpm dev:electron    # Just the Electron wrapper
```

### **Build & Deployment**
```bash
# Build all packages
pnpm build

# Deploy to production
pnpm deploy:all      # Both website and renderer
pnpm deploy:website  # Public site only
pnpm deploy:renderer # Web app only

# Desktop app distribution
pnpm build:electron  # All platforms
pnpm build:mac      # macOS only
pnpm build:win      # Windows only
pnpm build:linux    # Linux only
```

### **Code Organization**
- **TypeScript**: Strict mode, consistent type definitions
- **ESLint**: Consistent code style and best practices
- **Prettier**: Automated code formatting
- **Conventional Commits**: Structured commit messages

---

## 🎛️ **Configuration & Environment**

### **Environment Variables**
```bash
# Convex
CONVEX_DEPLOYMENT=         # Convex deployment URL
NEXT_PUBLIC_CONVEX_URL=    # Public Convex URL

# Authentication
AUTH_RESEND_KEY=           # Resend API key for emails
CONVEX_AUTH_ADAPTER=       # Auth adapter configuration

# Stripe
STRIPE_SECRET_KEY=         # Stripe secret key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=  # Stripe public key
STRIPE_WEBHOOK_SECRET=     # Webhook signing secret

# OpenAI
OPENAI_API_KEY=           # OpenAI API key for AI features

# App URLs
NEXT_PUBLIC_WEBSITE_URL=   # Public website URL
NEXT_PUBLIC_APP_URL=       # Web app URL
```

### **Feature Flags**
- **AI_FEATURES_ENABLED**: Toggle AI consultations and forecasts
- **PREMIUM_FEATURES**: Control access to premium functionality
- **DESKTOP_DOWNLOADS**: Enable/disable desktop app downloads

---

## 🔧 **Advanced Features**

### **Data Export**
- **JSON Export**: Complete user data in structured format
- **CSV Export**: Spreadsheet-compatible mood data
- **API Access**: RESTful endpoints for data access (premium)

### **Customization**
- **Themes**: Light/dark mode with system preference detection
- **Templates**: Custom daily log templates
- **Tags**: Personal activity tracking categories
- **Scoring**: Flexible 0-100 mood scale

### **Performance Optimizations**
- **Code Splitting**: Route-based and component-based splitting
- **Image Optimization**: Next.js automatic image optimization
- **Caching**: Convex query caching and React Query integration
- **Lazy Loading**: Progressive loading of heavy components

---

## 🎯 **Key Technical Challenges & Solutions**

### **Real-time Synchronization**
- **Challenge**: Keep data in sync across devices
- **Solution**: Convex reactive queries with optimistic updates

### **AI Response Times**
- **Challenge**: OpenAI API can be slow
- **Solution**: Background processing with loading states and caching

### **Cross-platform Consistency**
- **Challenge**: Same UX across web and desktop
- **Solution**: Shared Next.js frontend with environment detection

### **Data Privacy**
- **Challenge**: Sensitive personal mood data
- **Solution**: End-to-end encryption, minimal data collection, user-controlled exports

### **Scalable Architecture**
- **Challenge**: Handle growing user base
- **Solution**: Serverless backend (Convex) with automatic scaling

---

## 📈 **Metrics & Analytics**

### **User Engagement**
- Daily active users and session duration
- Feature adoption rates (AI vs manual tracking)
- Subscription conversion and retention rates

### **System Performance**
- API response times and error rates
- Database query performance
- AI processing times and accuracy

### **Business Metrics**
- Monthly recurring revenue (MRR)
- Customer acquisition cost (CAC)
- Feature usage patterns and preferences

---

## 🎨 **Design Philosophy**

### **User Experience**
- **Simplicity**: Complex AI features hidden behind intuitive interfaces
- **Empathy**: Supportive, non-judgmental tone throughout
- **Privacy**: User control over data with clear privacy indicators
- **Accessibility**: WCAG compliance and keyboard navigation

### **Visual Design**
- **Minimalist**: Clean, distraction-free interface
- **Color Psychology**: Mood colors based on emotional research
- **Responsive**: Mobile-first with desktop enhancements
- **Consistent**: Shared design system across all platforms

---

This comprehensive technical overview provides the context needed for LLM assistance with Soloist development, covering architecture, implementation details, and design philosophy. The AI integration transforms Soloist from a simple mood tracker into an intelligent personal analytics platform that not only records your emotional journey but actively helps you understand and predict it.
