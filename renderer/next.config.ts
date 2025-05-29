import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep strict mode for development
  reactStrictMode: true,
  
  // Configure for deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Image optimization
  images: {
    unoptimized: false, // Enable optimization for web deployment
  },
};

export default nextConfig;
