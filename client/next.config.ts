import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.BECKEND_URL}/:path*`,
      },
    ]
  },
  reactCompiler: true,
};

export default nextConfig;
