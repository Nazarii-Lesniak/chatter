import type { NextConfig } from 'next';

function getApiUrl() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (apiUrl) {
    return apiUrl.replace(/\/+$/, '');
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'NEXT_PUBLIC_API_URL is not set. Add it to the Vercel environment variables ' +
        '(Production, Preview and Development) and redeploy without build cache.',
    );
  }

  return 'http://localhost:3001';
}

const nextConfig: NextConfig = {
  reactCompiler: true,

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${getApiUrl()}/:path*`,
      },
    ];
  },
};

export default nextConfig;
