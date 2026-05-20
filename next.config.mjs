/** @type {import('next').NextConfig} */
const nextConfig = {
  // Phase 0: plain Next.js + static export to GitHub Pages.
  // Phase 8 wires Nextra (or successor) back in for the full 14-chapter MDX port.
  output: 'export',
  distDir: 'out',
  basePath: '/healthx-platform-kb',
  assetPrefix: '/healthx-platform-kb/',
  images: { unoptimized: true },
  trailingSlash: true,
  reactStrictMode: true,
  outputFileTracingRoot: new URL('.', import.meta.url).pathname,
}

export default nextConfig
