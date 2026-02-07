import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      //  For Nodejs ts
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*',
      },
     
    ];
  },
};

export default nextConfig;
