/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // typedRoutes: true, // Disabled for deployment - some routes are placeholders
  },
  images: {
    domains: ['localhost'],
  },
}

module.exports = nextConfig