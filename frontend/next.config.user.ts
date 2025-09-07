import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: '',
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/:path*',
      },
    ];
  },
};

export default nextConfig;