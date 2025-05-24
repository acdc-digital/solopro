import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for Electron environment
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Keep strict mode for development
  reactStrictMode: true,
  // Ensure assets are properly handled in Electron
  assetPrefix: '',
  // Configure for development server (remove export mode)
  experimental: {
    esmExternals: false,
  },
};

export default nextConfig;
