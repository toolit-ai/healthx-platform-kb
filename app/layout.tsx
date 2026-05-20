import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import '../lib/tokens.css'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://toolit-ai.github.io/healthx-platform-kb/'),
  title: {
    default: 'HealthX Agentic Knowledge Base',
    template: '%s — HealthX KB',
  },
  description:
    'Architecture, agent catalog, AAA harness reference, and operational guides for the HealthX healthcare workforce agentic platform.',
  applicationName: 'HealthX KB',
  generator: 'Next.js',
}

export const viewport = {
  themeColor: '#f3eee5',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />
        <link href="https://api.fontshare.com/v2/css?f[]=geist@400,500,600,700&f[]=geist-mono@400,500,600,700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-fg">
        <header className="sticky top-0 z-50 border-b border-line bg-background shadow-sm">
          <div className="mx-auto max-w-4xl px-6 py-4 flex items-baseline justify-between gap-4">
            <Link href="/" className="font-semibold text-fg decoration-none">
              HealthX KB
            </Link>
            <nav className="flex flex-wrap gap-4 text-sm">
              <Link href="/" className="decoration-none text-muted hover:underline">
                Home
              </Link>
              <Link href="/architecture" className="decoration-none text-muted hover:underline">
                Architecture
              </Link>
              <Link href="/harness" className="decoration-none text-muted hover:underline">
                Harness
              </Link>
              <Link href="/reference/agents" className="decoration-none text-muted hover:underline">
                Reference
              </Link>
              <Link href="/playbooks" className="decoration-none text-muted hover:underline">
                Playbooks
              </Link>
            </nav>
          </div>
        </header>
        <div className="flex-1">{children}</div>
        <footer className="border-t border-line mt-20 py-6 text-xs text-muted">
          <div className="mx-auto max-w-4xl px-6 flex flex-wrap justify-between gap-2">
            <span>v1.0.0</span>
            <span>Maintainer — Snehashis Pattanayak : BSMH Higher Code Initiative</span>
          </div>
        </footer>
      </body>
    </html>
  )
}
