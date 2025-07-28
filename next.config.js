/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove deprecated experimental.appDir as it's default in Next.js 13+
  // Removed experimental.optimizeCss as it was causing build errors due to missing critters dependency
}

module.exports = nextConfig
