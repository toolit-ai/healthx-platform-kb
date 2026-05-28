import { notFound } from 'next/navigation'
import { readFileSync } from 'fs'
import { join } from 'path'
import Link from 'next/link'
import { simpleMarkdownToHtml } from '@/lib/markdown'

const SLUGS = [
  'overtime',
  'float_staffing',
  'shift_differential',
  'on_call_callback',
  'critical_staffing',
  'role_based_premiums',
  'holiday_pay',
  'weekend_option',
  'break_exceptions',
  'punch_exceptions',
  'consecutive_days',
  'premium_labor',
  'one_off_practices',
  'incidental_overtime',
  'schedule_effectiveness',
  'stacking',
]

export function generateStaticParams() {
  return SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const name = slug.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
  return { title: `${name} — Playbook` }
}

export default async function PlaybookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!SLUGS.includes(slug)) {
    notFound()
  }

  const filePath = join(process.cwd(), 'content', 'playbooks', `${slug}.md`)
  const content = readFileSync(filePath, 'utf-8')

  const html = simpleMarkdownToHtml(content)

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/playbooks/" className="font-mono text-xs text-brand hover:underline">
        ← Playbooks Index
      </Link>
      <article
        className="mt-6 prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <div className="mt-12 border-t border-line pt-6">
        <Link href="/playbooks/" className="font-mono text-xs text-brand hover:underline">
          ← Back to Playbooks Index
        </Link>
      </div>
    </main>
  )
}
