/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["plateguy.co.uk"],
  },
  eslint: {
    // This repo contains a lot of legacy/any-heavy code; don’t block production builds on lint.
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
