import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false, // Remove X-Powered-By header (security + minor byte saving)

  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
      },
      {
        protocol: 'https',
        hostname: 'images-na.ssl-images-amazon.com',
      },
      {
        protocol: 'https',
        hostname: 'api.getjobupdate.com',
      },
      {
        protocol: 'https',
        hostname: 'api.getjobupdate.co.in',
      },
      {
        protocol: 'https',
        hostname: 'getjobupdate.co.in',
      }
    ],
  },

  experimental: {
    optimizePackageImports: ['lucide-react', '@heroicons/react'],
  },

};

export default nextConfig;

