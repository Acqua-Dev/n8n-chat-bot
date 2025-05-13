import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9444',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 's3',
        port: '9000',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
