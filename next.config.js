/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove deprecated experimental.appDir as it's default in Next.js 13+
  // Removed experimental.optimizeCss as it was causing build errors due to missing critters dependency

  // Add headers to help with Clerk telemetry issues
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          // Add CORS headers for Clerk telemetry
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://clerk-telemetry.com',
          },
        ],
      },
    ];
  },

  // Environment variable validation
  env: {
    CLERK_TELEMETRY_DISABLED: process.env.NODE_ENV === 'development' ? 'true' : 'false',
  },
}

module.exports = nextConfig
