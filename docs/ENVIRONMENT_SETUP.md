# 🔧 Environment Variables Setup

## Production URLs
- **Website**: https://www.acdc.digital/
- **App**: https://app.acdc.digital/

## Website Environment Variables
Set these in Vercel for your website project:

```bash
NEXT_PUBLIC_BASE_URL=https://www.acdc.digital
NEXT_PUBLIC_APP_URL=https://app.acdc.digitalim
CONVEX_DEPLOY_KEY=your_convex_production_key
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

## Renderer Environment Variables
Set these in Vercel for your renderer project:

```bash
NEXT_PUBLIC_WEBSITE_URL=https://www.acdc.digital
CONVEX_DEPLOY_KEY=your_convex_production_key
NEXT_PUBLIC_CONVEX_URL=https://your-convex-deployment.convex.cloud
```

## Local Development
For local development, create these files:

### website/.env.local
```bash
NEXT_PUBLIC_BASE_URL=http://localhost:3004
NEXT_PUBLIC_APP_URL=http://localhost:3002
# ... other variables
```

### renderer/.env.local
```bash
NEXT_PUBLIC_WEBSITE_URL=http://localhost:3004
# ... other variables
```

## Setting in Vercel Dashboard

1. Go to each project in Vercel
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable with value set to **Production**
4. Redeploy both applications

## Quick Deploy Command
After setting environment variables:
```bash
pnpm run deploy:all
``` 