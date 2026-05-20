# healthx-platform-kb

HealthX Agentic Knowledge Base — architecture, agent catalog, AAA harness reference, and operational guides for the [healthx-web-app](https://github.com/toolit-ai/healthx-web-app) platform.

Built with **Next.js 15 (App Router) + Nextra 4** for Vercel-style documentation. Deployed as a static export to GitHub Pages.

## Status

Phase 0 — bootstrap. The full 14-chapter architecture spec is being ported in alongside the engine work.

## Local development

```bash
corepack enable && corepack prepare pnpm@9.15.0 --activate
pnpm install
pnpm dev          # http://localhost:3000/healthx-platform-kb/
pnpm typecheck
pnpm build        # → out/
```

## Deploy

Push to `main` → GitHub Actions builds and publishes to `https://toolit-ai.github.io/healthx-platform-kb/`.

## Companion app

The runnable platform lives at [toolit-ai.github.io/healthx-web-app](https://toolit-ai.github.io/healthx-web-app/) and shares design tokens (`@healthx/tokens`), typography (Geist), and canonical URL helpers with this docs site.
