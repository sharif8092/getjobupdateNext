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

  async headers() {
    return [
      {
        // Cache Next.js static chunks (JS/CSS) aggressively — filenames are content-hashed
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache public assets (images, fonts, icons) for 1 day
        source: '/(.*)\\.(png|jpg|jpeg|webp|avif|svg|woff2|woff|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        // HTML pages: cache for 5 minutes, stale-while-revalidate for 5 minutes
        // This matches the revalidate=300 on the homepage
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, stale-while-revalidate=300',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

