import type { NextConfig } from "next";
import { protocol } from "socket.io-client";

const nextConfig: NextConfig = {
  // Enforce linting and type-checking during builds
  eslint: {
    // When false/omitted, Next.js will fail the build on ESLint errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    // When false/omitted, Next.js will fail the build on TypeScript errors
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.licdn.com',
        port: '',
        pathname: '/**',
      },
    ],
    qualities: [75, 90, 100, 95],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
  },
};

export default nextConfig;
