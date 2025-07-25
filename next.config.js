/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove deprecated experimental.appDir as it's default in Next.js 13+
  experimental: {
    optimizeCss: true,
  },
}

module.exports = nextConfig
