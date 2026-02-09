import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
      },
      {
        protocol: 'https',
        hostname: 'wallpaperaccess.com',
      },
      {
        protocol: 'https',
        hostname: 'e0.365dm.com',
      },
      {
        protocol: 'https',
        hostname: 'media.pitchfork.com',
      },
      {
        protocol: 'https',
        hostname: 'in.bmscdn.com',
      },
      {
        protocol: 'https',
        hostname: 'img.etimg.com',
      },
      {
        protocol: 'https',
        hostname: 'images.news18.com',
      },
      {
        protocol: 'https',
        hostname: 'tatamumbaimarathon.procam.in',
      },
      {
        protocol: 'https',
        hostname: 'bsmedia.business-standard.com',
      },
      {
        protocol: 'https',
        hostname: 'www.wimbledon.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://localhost:8080/api/v1/:path*',
      },
    ];
  },
};

export default nextConfig;
