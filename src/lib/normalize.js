export function normalize(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
}

export function check(input, movie) {
  const inp = normalize(input)
  if (inp.length < 3) return false

  const title = normalize(movie.title)
  const alts = (movie.alt || []).map(normalize)

  if (inp === title || alts.includes(inp)) return true
  if (inp.includes(title) || title.includes(inp)) return true
  if (alts.some(alt => inp.includes(alt) || alt.includes(inp))) return true

  return false
}
