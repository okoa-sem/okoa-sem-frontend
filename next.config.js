/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Transpile react-pdf to handle ESM and internal dependencies
  transpilePackages: ['react-pdf'],

  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
        ],
      },
    ]
  },

  // 2. Instruct Webpack to ignore the 'canvas' module
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;