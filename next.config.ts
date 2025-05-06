import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['randomuser.me'],
  },
  // Configure how Next.js handles font optimization
  optimizeFonts: true,
};

export default nextConfig;
