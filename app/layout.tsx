import type { Metadata } from 'next'
import type { ReactNode } from 'react'
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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
