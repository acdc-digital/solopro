#!/bin/bash

# Build script for macOS with notarization
# Make sure you have your environment variables set before running this script

set -e  # Exit on any error

echo "🚀 Starting macOS build process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    print_error "This script is designed for macOS only!"
    exit 1
fi

# Check for required environment variables
check_env_vars() {
    print_status "Checking environment variables..."
    
    if [ -z "$CSC_NAME" ]; then
        print_warning "CSC_NAME not set. Make sure to set your code signing identity."
        print_warning "Example: export CSC_NAME='Developer ID Application: Your Name (TEAM_ID)'"
    fi
    
    if [ -z "$APPLE_API_ISSUER" ]; then
        print_warning "APPLE_API_ISSUER not set. You'll need this for notarization."
    fi
    
    if [ -z "$APPLE_API_KEY_ID" ]; then
        print_warning "APPLE_API_KEY_ID not set. Using default 5X66MM738M"
    fi
}

# Build the renderer (Next.js app)
build_renderer() {
    print_status "Building Next.js renderer..."
    cd renderer
    
    if [ ! -d "node_modules" ]; then
        print_status "Installing renderer dependencies..."
        npm install
    fi
    
    print_status "Building Next.js app..."
    npm run build
    
    cd ..
    print_success "Renderer build completed!"
}

# Build the Electron app
build_electron() {
    print_status "Building Electron app..."
    cd electron
    
    if [ ! -d "node_modules" ]; then
        print_status "Installing electron dependencies..."
        npm install
    fi
    
    print_status "Running electron-builder..."
    npm run build:mac
    
    cd ..
    print_success "Electron build completed!"
}

# Check code signing certificates
check_certificates() {
    print_status "Checking for code signing certificates..."
    
    # Check for Developer ID Application certificate
    if security find-identity -v -p codesigning | grep -q "Developer ID Application"; then
        print_success "Developer ID Application certificate found!"
        security find-identity -v -p codesigning | grep "Developer ID Application"
    else
        print_warning "No Developer ID Application certificate found!"
        print_warning "You'll need to install your certificate in Keychain Access"
    fi
    
    # Check for API key file
    if [ -f "electron/certs/AuthKey_5X66MM738M.p8" ]; then
        print_success "Apple API Key found!"
    else
        print_warning "Apple API Key not found at electron/certs/AuthKey_5X66MM738M.p8"
    fi
}

# Clean previous builds
clean_builds() {
    print_status "Cleaning previous builds..."
    rm -rf electron/dist
    rm -rf renderer/.next
    print_success "Clean completed!"
}

# Main execution
main() {
    print_status "Starting macOS build and notarization process"
    
    check_env_vars
    check_certificates
    clean_builds
    build_renderer
    build_electron
    
    print_success "🎉 Build process completed!"
    print_status "Built files are in electron/dist/"
    
    if [ -f "electron/dist/Soloist.Pro-*.dmg" ]; then
        print_success "DMG file created successfully!"
        ls -la electron/dist/*.dmg
    fi
}

# Run the main function
main "$@" 