import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  ...(isProd && {
    basePath: '/tone-clock',
    assetPrefix: '/tone-clock/',
  }),
};

export default nextConfig;