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
    ],
  },
};

export default nextConfig;
