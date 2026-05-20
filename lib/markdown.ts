export function simpleMarkdownToHtml(md: string): string {
  return md
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-6 mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-8 mb-3">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-semibold mt-10 mb-4">$1</h1>')
    .replace(/^```([\w]*)\n([\s\S]*?)```/gm, '<pre class="mt-3 mb-3 rounded-lg bg-muted p-4 overflow-x-auto text-xs leading-relaxed"><code>$2</code></pre>')
    .replace(/^```\n([\s\S]*?)```/gm, '<pre class="mt-3 mb-3 rounded-lg bg-muted p-4 overflow-x-auto text-xs leading-relaxed"><code>$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code class="rounded bg-muted px-1 py-0.5 text-xs">$1</code>')
    .replace(/^\* (.*$)/gim, '<li class="ml-4 list-disc text-sm">$1</li>')
    .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc text-sm">$1</li>')
    .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 list-decimal text-sm">$1</li>')
    .replace(/\n/gim, '\n')
    .split('\n\n')
    .map((para) => {
      const trimmed = para.trim()
      if (!trimmed) return ''
      if (trimmed.startsWith('<')) return trimmed
      if (trimmed.startsWith('|')) {
        const rows = trimmed.split('\n').filter((r) => r.trim())
        if (rows.length < 2) return `<p class="text-sm leading-relaxed mb-4">${trimmed}</p>`
        const headerCells = rows[0].split('|').filter((c) => c.trim())
        const bodyRows = rows.slice(2)
        const headerHtml = headerCells.map((c) => `<th class="px-3 py-2 text-left text-xs font-semibold border-b border-line">${c.trim()}</th>`).join('')
        const bodyHtml = bodyRows.map((r) => {
          const cells = r.split('|').filter((c) => c.trim())
          return `<tr class="border-b border-line">${cells.map((c) => `<td class="px-3 py-2 text-xs">${c.trim()}</td>`).join('')}</tr>`
        }).join('')
        return `<div class="overflow-x-auto mt-3 mb-4"><table class="w-full text-sm border-collapse border border-line"><thead class="bg-muted">${headerHtml}</thead><tbody>${bodyHtml}</tbody></table></div>`
      }
      return `<p class="text-sm leading-relaxed mb-4">${trimmed}</p>`
    })
    .join('\n')
}
