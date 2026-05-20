import { readFileSync } from 'fs'
import { resolve } from 'path'
import Link from 'next/link'

const registryPath = '/tmp/swarm-output/playbooks/playbook-registry.json'

function getPlaybookName(slug: string): string | null {
  try {
    const raw = readFileSync(registryPath, 'utf-8')
    const list = JSON.parse(raw)
    const found = list.find((p: any) => p.slug === slug)
    return found?.name || null
  } catch {
    return null
  }
}

const slugs = [
  'overtime',
  'float_staffing',
  'shift_differential',
  'on_call_callback',
  'critical_staffing',
  'weekend_option',
  'break_exceptions',
  'punch_exceptions',
  'consecutive_days',
  'premium_labor',
  'role_based_premiums',
  'holiday_pay',
  'one_off_practices',
  'incidental_overtime',
  'schedule_effectiveness',
  'stacking',
]

export function generateStaticParams() {
  return slugs.map((slug) => ({ slug }))
}

export default async function PlaybookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const name = getPlaybookName(slug)
  const filePath = resolve('/tmp/swarm-output/playbooks/pages', `${slug}.md`)

  let content: string
  try {
    content = readFileSync(filePath, 'utf-8')
  } catch {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-2xl font-semibold">Playbook not found</h1>
        <p className="mt-4 text-muted">The requested playbook does not exist.</p>
        <Link href="/playbooks" className="mt-4 inline-block text-brand hover:underline">
          Back to Playbooks
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-muted">
        playbooks / {slug}
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">{name || slug}</h1>
      <div className="mt-8 rounded-lg border border-line bg-card p-0 overflow-hidden">
        <pre className="p-6 text-sm leading-loose whitespace-pre-wrap break-words overflow-x-auto">
          {content}
        </pre>
      </div>
      <div className="mt-8">
        <Link href="/playbooks" className="text-brand hover:underline text-sm">
          Back to Playbooks
        </Link>
      </div>
    </main>
  )
}
