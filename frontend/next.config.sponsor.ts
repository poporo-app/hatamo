import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: '',
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/sponsor',
      },
      {
        source: '/:path*',
        destination: '/sponsor/:path*',
      },
    ];
  },
};

export default nextConfig;