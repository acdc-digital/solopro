import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    externalDir: true, // Allow imports from outside the website directory
  },
};

export default nextConfig;
