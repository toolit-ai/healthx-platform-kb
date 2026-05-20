# healthx-platform-kb

HealthX Agentic Knowledge Base — architecture, agent catalog, AAA harness reference, and operational guides for the [healthx-web-app](https://github.com/toolit-ai/healthx-web-app) platform.

Built with **Next.js 15 (App Router)** for static export to GitHub Pages.

## Status

v1.0.0 — Full 14-chapter architecture spec, agent catalog, schema registry, harness reference, and 16 pay-practice playbooks ported.

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

## Companion projects

- [healthx-web-app](https://toolit-ai.github.io/healthx-web-app/) — Browser-native AAA pipeline (React/Vite)
- [bsmh-agentic-system](https://github.com/SnehashisPattanayak/bsmh-agentic-system) — Python LangGraph execution engine

Maintainer — Snehashis Pattanayak : BSMH Higher Code Initiative
