# Deployment Guide for Soloist Pro

This monorepo contains two separate Next.js applications that are deployed to different Vercel instances:
- **website**: Marketing/download site
- **renderer**: The actual Soloist Pro web app

## Setting Up Vercel Deployments

### Option 1: Using Vercel CLI (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy Website**:
   ```bash
   cd website
   vercel --prod
   ```
   - Follow the prompts to link to your existing Vercel project or create a new one
   - Name it something like `solopro-website`

3. **Deploy Renderer**:
   ```bash
   cd ../renderer
   vercel --prod
   ```
   - Link to your existing renderer Vercel project or create a new one
   - Name it something like `solopro-app`

### Option 2: Using GitHub Integration

1. **In Vercel Dashboard**, import your repository twice:
   - Once for the website
   - Once for the renderer

2. **For the Website deployment**:
   - Set **Root Directory** to `website`
   - Set **Build Command** to `cd .. && pnpm run build:website`
   - Set **Install Command** to `cd .. && pnpm install`

3. **For the Renderer deployment**:
   - Set **Root Directory** to `renderer`
   - Set **Build Command** to `cd .. && pnpm run build:renderer`
   - Set **Install Command** to `cd .. && pnpm install`
   - Add environment variable: `NEXT_PUBLIC_CONVEX_URL` (from your Convex dashboard)

### Option 3: Manual Deployment Script

Create deployment scripts in your root package.json:

```json
{
  "scripts": {
    "deploy:website": "cd website && vercel --prod",
    "deploy:renderer": "cd renderer && vercel --prod",
    "deploy:all": "pnpm run deploy:website && pnpm run deploy:renderer"
  }
}
```

## Environment Variables

### For Renderer:
- `NEXT_PUBLIC_CONVEX_URL` - Your Convex deployment URL
- Any other Convex-related environment variables

### For Website:
- Typically doesn't need special environment variables unless you add analytics, etc.

## Continuous Deployment

To set up automatic deployments on git push:

1. **Connect GitHub to Vercel** for both projects
2. **Configure branch deployments**:
   - Production: `main` branch
   - Preview: All other branches

## Deployment Commands

```bash
# Deploy website only
pnpm run deploy:website

# Deploy renderer only
pnpm run deploy:renderer

# Deploy both
pnpm run deploy:all
```

## Troubleshooting

1. **Build fails**: Make sure all dependencies are installed at the root level
2. **Wrong directory**: Vercel should detect the monorepo structure with our configuration
3. **Environment variables**: Double-check they're set in Vercel dashboard, not just locally 