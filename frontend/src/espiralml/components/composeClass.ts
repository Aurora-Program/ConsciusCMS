// Utility to compose Espiral class axes: fn--, es--, fo-- in the correct order
// Usage: composeClass({ fn: ['Pagina', 'Hero'], es: 'grid', fo: ['standard', 'acentuada'], className: 'extra' })
export type Axes = {
  fn?: string | string[]
  es?: string | string[]
  fo?: string | string[]
  className?: string
}

function normalize(prefix: 'fn' | 'es' | 'fo', val?: string | string[]): string[] {
  const arr = Array.isArray(val) ? val : (val ? [val] : [])
  const pre = `${prefix}--`
  const out = arr
    .map((t) => String(t || '').trim())
    .filter(Boolean)
    .map((t) => (t.startsWith(pre) ? t : `${pre}${t}`))
  // de-duplicate keeping order
  const seen = new Set<string>()
  return out.filter((t) => (seen.has(t) ? false : (seen.add(t), true)))
}

export function composeClass({ fn, es, fo, className }: Axes): string {
  const parts = [
    ...normalize('fn', fn),
    ...normalize('es', es),
    ...normalize('fo', fo),
    ...(className ? [className] : []),
  ]
  return parts.join(' ').trim()
}

export default composeClass
