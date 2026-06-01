import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
};

export default nextConfig;
