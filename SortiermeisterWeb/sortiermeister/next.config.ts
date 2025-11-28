import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',  // Required for the Dockerfile to work
  /* config options here */
};

export default nextConfig;