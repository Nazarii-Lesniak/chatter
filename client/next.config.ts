import type { NextConfig } from 'next';

const API_URL = process.env.API_URL;

if (!API_URL) {
  throw new Error('API_URL is required');
}

const nextConfig: NextConfig = {
  reactCompiler: true,

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${API_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
