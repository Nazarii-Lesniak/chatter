import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://chatter-phr0.onrender.com/:path*',
      },
    ];
  },
};

export default nextConfig;