import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: '',
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/admin',
      },
      {
        source: '/:path*',
        destination: '/admin/:path*',
      },
    ];
  },
};

export default nextConfig;