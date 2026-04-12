/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Transpile the PDF library
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

  // 2. Ignore 'canvas' which is a Node-only dependency and causes browser errors
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;