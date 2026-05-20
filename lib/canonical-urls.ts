/**
 * canonical-urls.ts — single source of truth for cross-repo links.
 *
 * Both healthx-platform-kb (docs) and healthx-web-app (live app) need to link
 * to each other and to deterministic anchors (agent IDs, schema IDs, page routes,
 * finding IDs). Keeping this in one helper means a deploy URL change only
 * touches this file.
 */

export const WEB_APP_BASE = 'https://toolit-ai.github.io/healthx-web-app/'
export const KB_BASE = 'https://toolit-ai.github.io/healthx-platform-kb/'

export type CitationKind =
  | { kind: 'agent'; id: string }
  | { kind: 'schema'; id: string }
  | { kind: 'event'; id: string }
  | { kind: 'page'; route: string }
  | { kind: 'finding'; runId: string; findingId: string }
  | { kind: 'doc'; path: string }

export function urlFor(target: CitationKind): string {
  switch (target.kind) {
    case 'agent':
      return `${KB_BASE}reference/agents/${target.id}`
    case 'schema':
      return `${KB_BASE}reference/schemas/${target.id}`
    case 'event':
      return `${KB_BASE}reference/events/${target.id}`
    case 'doc':
      return `${KB_BASE}${target.path.replace(/^\//, '')}`
    case 'page':
      return `${WEB_APP_BASE}${target.route.replace(/^\//, '')}`
    case 'finding':
      return `${WEB_APP_BASE}runs/${target.runId}/bleda#finding-${target.findingId}`
  }
}
