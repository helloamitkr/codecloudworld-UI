/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

// Only apply PWA in production
if (process.env.NODE_ENV === 'production') {
  const withPWA = require('@ducanh2912/next-pwa').default({
    dest: 'public',
    cacheOnFrontEndNav: true,
    aggressiveFrontEndNavCaching: true,
    reloadOnOnline: true,
    swcMinify: true,
    workboxOptions: {
      disableDevLogs: true,
    }
  });
  
  module.exports = withPWA(nextConfig);
} else {
  module.exports = nextConfig;
}
