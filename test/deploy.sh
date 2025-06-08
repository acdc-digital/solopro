#!/bin/bash

# 🚀 Solopro Deployment Script
# This script will help you deploy both website and renderer to production

set -e  # Exit on any error

echo "🚀 Solopro Production Deployment"
echo "================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if required tools are installed
check_requirements() {
    echo "🔍 Checking requirements..."
    
    if ! command -v pnpm &> /dev/null; then
        print_error "pnpm is not installed. Please install it first: npm install -g pnpm"
        exit 1
    fi
    
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI not found. Installing..."
        npm install -g vercel
    fi
    
    print_status "All requirements satisfied"
}

# Check environment variables
check_env_vars() {
    echo ""
    echo "🔧 Environment Variables Check"
    echo "-----------------------------"
    
    # Website env vars
    if [ ! -f "website/.env.local" ]; then
        print_warning "website/.env.local not found"
        echo "Please create website/.env.local with these variables:"
        echo "NEXT_PUBLIC_BASE_URL=https://yourdomain.com"
        echo "NEXT_PUBLIC_APP_URL=https://app.yourdomain.com"
        echo "CONVEX_DEPLOY_KEY=your_convex_key"
        echo "STRIPE_SECRET_KEY=sk_live_..."
        echo "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_..."
        echo "STRIPE_WEBHOOK_SECRET=whsec_..."
        echo ""
        read -p "Create environment files manually and press Enter to continue..."
    else
        print_status "Website environment file found"
    fi
    
    # Renderer env vars  
    if [ ! -f "renderer/.env.local" ]; then
        print_warning "renderer/.env.local not found"
        echo "Please create renderer/.env.local with these variables:"
        echo "NEXT_PUBLIC_WEBSITE_URL=https://yourdomain.com"
        echo "CONVEX_DEPLOY_KEY=your_convex_key"
        echo ""
        read -p "Create environment files manually and press Enter to continue..."
    else
        print_status "Renderer environment file found"
    fi
}

# Build and test locally first
build_locally() {
    echo ""
    echo "🔨 Building projects locally..."
    echo "-----------------------------"
    
    # Build website
    echo "Building website..."
    cd website
    if pnpm run build; then
        print_status "Website build successful"
    else
        print_error "Website build failed"
        exit 1
    fi
    cd ..
    
    # Build renderer
    echo "Building renderer..."
    cd renderer
    if pnpm run build; then
        print_status "Renderer build successful"
    else
        print_error "Renderer build failed"
        exit 1
    fi
    cd ..
}

# Deploy to Vercel
deploy_to_vercel() {
    echo ""
    echo "🚀 Deploying to Vercel..."
    echo "------------------------"
    
    # Check if user is logged in to Vercel
    if ! vercel whoami &> /dev/null; then
        echo "Please login to Vercel:"
        vercel login
    fi
    
    # Deploy website
    echo "Deploying website..."
    cd website
    if vercel --prod; then
        print_status "Website deployed successfully"
    else
        print_error "Website deployment failed"
        exit 1
    fi
    cd ..
    
    # Deploy renderer
    echo "Deploying renderer..."
    cd renderer
    if vercel --prod; then
        print_status "Renderer deployed successfully"
    else
        print_error "Renderer deployment failed"
        exit 1
    fi
    cd ..
}

# Main deployment flow
main() {
    echo "This script will:"
    echo "1. Check requirements"
    echo "2. Verify environment variables"
    echo "3. Build projects locally"
    echo "4. Deploy to Vercel"
    echo ""
    
    read -p "Continue with deployment? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Deployment cancelled"
        exit 0
    fi
    
    check_requirements
    check_env_vars
    build_locally
    deploy_to_vercel
    
    echo ""
    echo "🎉 Deployment Complete!"
    echo "======================"
    echo ""
    echo "Your applications should now be live at:"
    echo "• Website: https://yourdomain.com"
    echo "• App: https://app.yourdomain.com"
    echo ""
    echo "Next steps:"
    echo "1. Configure custom domains in Vercel dashboard"
    echo "2. Update Stripe webhook URLs"
    echo "3. Test all functionality"
    echo ""
    print_status "Don't forget to update your Electron app to point to the production renderer URL!"
}

# Run main function
main 