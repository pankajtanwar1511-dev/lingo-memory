/** @type {import('next').NextConfig} */

// Build identifier surfaced on the home page so it's obvious when a new
// deploy is live. Vercel sets VERCEL_GIT_COMMIT_SHA on every build; for
// local `next dev` we shell out to git so the value isn't blank.
function resolveBuildSha() {
  if (process.env.VERCEL_GIT_COMMIT_SHA) return process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 7);
  try {
    return require('child_process').execSync('git rev-parse HEAD').toString().trim().slice(0, 7);
  } catch {
    return 'dev';
  }
}

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // typedRoutes: true, // Disabled for deployment - some routes are placeholders
  },
  images: {
    domains: ['localhost'],
  },
  env: {
    NEXT_PUBLIC_BUILD_SHA: resolveBuildSha(),
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
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