import Link from 'next/link'

const playbooks = [
  { slug: 'overtime', name: 'Overtime', checks: 9, status: 'fully_implemented', roc: true },
  { slug: 'float_staffing', name: 'Float Staffing and Agency Labor', checks: 6, status: 'fully_implemented', roc: true },
  { slug: 'shift_differential', name: 'Shift Differential and Stacking', checks: 6, status: 'fully_implemented', roc: false },
  { slug: 'on_call_callback', name: 'On Call and Call Back', checks: 6, status: 'fully_implemented', roc: true },
  { slug: 'critical_staffing', name: 'Critical Staffing', checks: 6, status: 'fully_implemented', roc: true },
  { slug: 'role_based_premiums', name: 'Role-Based Premiums', checks: 5, status: 'fully_implemented', roc: false },
  { slug: 'holiday_pay', name: 'Holiday Pay', checks: 5, status: 'fully_implemented', roc: false },
  { slug: 'weekend_option', name: 'Weekend Option', checks: 0, status: 'stub', roc: false },
  { slug: 'break_exceptions', name: 'Break Exceptions', checks: 0, status: 'stub', roc: false },
  { slug: 'punch_exceptions', name: 'Punch Exceptions', checks: 0, status: 'stub', roc: false },
  { slug: 'consecutive_days', name: 'Consecutive Days', checks: 0, status: 'stub', roc: false },
  { slug: 'premium_labor', name: 'Premium Labor', checks: 0, status: 'stub', roc: false },
  { slug: 'one_off_practices', name: 'One-Off Pay Practices', checks: 0, status: 'stub', roc: false },
  { slug: 'incidental_overtime', name: 'Incidental Overtime', checks: 0, status: 'stub', roc: false },
  { slug: 'schedule_effectiveness', name: 'Schedule Effectiveness', checks: 0, status: 'stub', roc: false },
  { slug: 'stacking', name: 'Stacking', checks: 0, status: 'stub', roc: false },
]

export default function PlaybooksPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-muted">Playbooks</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Pay-Practice Playbooks</h1>
      <p className="mt-4 text-muted">16 in-scope healthcare pay practices with check families, thresholds, and scenario models.</p>

      <section className="mt-10 grid gap-3 sm:grid-cols-2">
        {playbooks.map((p) => (
          <article key={p.slug} className="rounded-lg border border-line bg-card p-5">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-base font-semibold">{p.name}</h2>
              <span className={`font-mono text-[10px] uppercase tracking-widest ${p.status === 'fully_implemented' ? 'text-emerald-600' : 'text-muted'}`}>
                {p.status.replace('_', ' ')}
              </span>
            </div>
            <div className="mt-2 flex gap-4 text-xs text-muted">
              <span>{p.checks} checks</span>
              {p.roc && <span>ROC segmented</span>}
            </div>
            <Link className="mt-4 inline-block font-mono text-xs text-brand hover:underline" href={`/playbooks/${p.slug}/`}>
              View playbook
            </Link>
          </article>
        ))}
      </section>

      <div className="mt-12 border-t border-line pt-6">
        <Link href="/" className="font-mono text-xs text-brand hover:underline">
          ← Back to Home
        </Link>
      </div>
    </main>
  )
}
