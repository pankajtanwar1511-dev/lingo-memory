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
  // Old "extended-kanji" routes were renamed to plain "kanji" — keep
  // bookmarks and external links working.
  async redirects() {
    return [
      {
        source: '/study/extended-kanji-practice',
        destination: '/study/kanji-practice',
        permanent: true,
      },
      {
        source: '/study/extended-kanji-practice/:path*',
        destination: '/study/kanji-practice/:path*',
        permanent: true,
      },
      {
        source: '/study/extended-kanji',
        destination: '/study/kanji',
        permanent: true,
      },
      {
        source: '/study/extended-kanji/:path*',
        destination: '/study/kanji/:path*',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig