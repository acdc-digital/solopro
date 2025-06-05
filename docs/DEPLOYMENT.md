# 🚀 Solopro Deployment Guide

This guide will help you deploy both the website (marketing site) and renderer (app) to production domains.

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Domain Names**: You'll need two domains or subdomains:
   - Main website (marketing): `yourdomain.com`
   - App (renderer): `app.yourdomain.com` or separate domain
3. **Convex Production Deployment**: Your Convex project should be deployed to production
4. **Stripe Configuration**: Production Stripe keys

## 🌐 Recommended Domain Structure

```
yourdomain.com           → Website (marketing site)
app.yourdomain.com       → Renderer (main app)
```

## 📝 Step 1: Environment Variables Setup

### Website Environment Variables (.env.local)
Create `website/.env.local`:

```bash
# Website Base URL
NEXT_PUBLIC_BASE_URL=https://yourdomain.com

# App URL (where users go after signup/payment)
NEXT_PUBLIC_APP_URL=https://app.yourdomain.com

# Convex
CONVEX_DEPLOY_KEY=your_production_convex_deploy_key

# Stripe Production Keys
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### Renderer Environment Variables (.env.local)
Create `renderer/.env.local`:

```bash
# Website URL (for linking back to marketing site)
NEXT_PUBLIC_WEBSITE_URL=https://yourdomain.com

# Convex
CONVEX_DEPLOY_KEY=your_production_convex_deploy_key
NEXT_PUBLIC_CONVEX_URL=https://your-convex-deployment.convex.cloud
```

## 🚀 Step 2: Deploy to Vercel

### Option A: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy Website**:
   ```bash
   cd website
   vercel --prod
   ```
   - Follow prompts to link to your Vercel account
   - Set your custom domain: `yourdomain.com`

4. **Deploy Renderer**:
   ```bash
   cd ../renderer
   vercel --prod
   ```
   - Set your custom domain: `app.yourdomain.com`

### Option B: Deploy via Vercel Dashboard

1. **Connect GitHub**: Link your repository to Vercel
2. **Import Projects**: Import both `website` and `renderer` as separate projects
3. **Configure Domains**: Set custom domains for each project
4. **Set Environment Variables**: Add the environment variables in Vercel dashboard

## ⚙️ Step 3: Configure Environment Variables in Vercel

For each project in Vercel dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add all the environment variables from your `.env.local` files
3. Set them for **Production** environment

### Website Variables:
- `NEXT_PUBLIC_BASE_URL`
- `NEXT_PUBLIC_APP_URL`
- `CONVEX_DEPLOY_KEY`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`

### Renderer Variables:
- `NEXT_PUBLIC_WEBSITE_URL`
- `CONVEX_DEPLOY_KEY`
- `NEXT_PUBLIC_CONVEX_URL`

## 🔗 Step 4: Configure Custom Domains

1. **In Vercel Dashboard**:
   - Go to each project → **Settings** → **Domains**
   - Add your custom domains
   - Follow DNS configuration instructions

2. **DNS Configuration**:
   ```
   yourdomain.com          → CNAME to vercel-deployment.vercel.app
   app.yourdomain.com      → CNAME to vercel-deployment.vercel.app
   ```

## 🔄 Step 5: Update Stripe Webhook Endpoints

Update your Stripe webhook endpoints to use production URLs:

```
Website Webhooks: https://yourdomain.com/api/webhooks/stripe
```

## 🧪 Step 6: Test Your Deployment

1. **Website Tests**:
   - Visit `https://yourdomain.com`
   - Test signup flow
   - Test payment flow
   - Verify redirects to app

2. **Renderer Tests**:
   - Visit `https://app.yourdomain.com`
   - Test authentication
   - Test all app features
   - Verify links back to website

## 🚀 Step 7: Deploy Using Scripts

You can also use the built-in deployment scripts:

```bash
# Deploy everything at once
pnpm run deploy:all

# Or deploy individually
pnpm run deploy:website
pnpm run deploy:renderer
```

## 🔧 Troubleshooting

### Common Issues:

1. **CORS Errors**: Ensure your Convex deployment allows your production domains
2. **Stripe Webhooks**: Update webhook URLs in Stripe dashboard
3. **Environment Variables**: Double-check all environment variables are set correctly
4. **DNS Propagation**: Allow 24-48 hours for DNS changes to propagate

### Vercel Build Issues:

If builds fail, check:
1. All environment variables are set
2. Convex deployment is accessible
3. Build command includes `prebuild` for website

## 📱 Electron App Update

After deploying the renderer, update your Electron app configuration to point to the production URL instead of localhost.

## 🎉 You're Live!

Once deployed:
- **Marketing Site**: `https://yourdomain.com`
- **App**: `https://app.yourdomain.com`
- **Documentation**: Update any documentation with new URLs

## 🔄 Future Deployments

For future updates:
```bash
# Automatic deployment on git push (if connected to GitHub)
git push origin main

# Or manual deployment
pnpm run deploy:all
``` 