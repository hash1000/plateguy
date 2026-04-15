/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["plateguy.co.uk"],
  },
  experimental: {
    // Fixes Windows environments where child_process spawning is blocked (EPERM).
    // Uses worker_threads instead of child processes for Next workers.
    workerThreads: true,
  },
  eslint: {
    // This repo contains a lot of legacy/any-heavy code; don’t block production builds on lint.
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
