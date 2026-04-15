import { NextResponse } from 'next/server'

export async function GET() {
  const url   = process.env.TURSO_URL   ?? ''
  const token = process.env.TURSO_TOKEN ?? ''

  // Localiza cada whitespace no token (posição e char code)
  const wsPositions: Array<{ i: number; code: number; name: string }> = []
  for (let i = 0; i < token.length; i++) {
    if (/\s/.test(token[i])) {
      const c = token.charCodeAt(i)
      wsPositions.push({
        i,
        code: c,
        name: c === 10 ? '\\n' : c === 13 ? '\\r' : c === 32 ? 'space' : c === 9 ? '\\t' : 'other',
      })
    }
  }

  const checks: Record<string, any> = {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY ? '✅ definida' : '❌ ausente',
    TURSO_URL:      url   ? '✅ ' + url : '❌ ausente',
    TURSO_TOKEN:    token ? `✅ definido — len=${token.length}, prefix=${token.slice(0, 20)}…, suffix=…${token.slice(-10)}` : '❌ ausente',
    url_has_whitespace:   /\s/.test(url),
    token_has_whitespace: /\s/.test(token),
    token_whitespace_count: wsPositions.length,
    token_whitespace_positions: wsPositions.slice(0, 10),
    url_scheme:     url.split('://')[0] || '(nenhum)',
    node_version:   process.version,
  }

  // Teste 1: conexão com o valor cru (como vem do env)
  try {
    const { createClient } = await import('@libsql/client')
    const client = createClient({ url, authToken: token })
    const result = await client.execute({ sql: 'SELECT 1 as ok', args: [] })
    checks.test_raw = '✅ conectado — ' + JSON.stringify(result.rows[0])
  } catch (err: any) {
    checks.test_raw = '❌ ' + (err?.message ?? String(err))
  }

  // Teste 2: conexão com whitespace removido (strip total, não só trim)
  try {
    const { createClient } = await import('@libsql/client')
    const urlClean   = url.replace(/\s/g, '')
    const tokenClean = token.replace(/\s/g, '')
    const client = createClient({ url: urlClean, authToken: tokenClean })
    const result = await client.execute({ sql: 'SELECT 1 as ok', args: [] })
    checks.test_stripped = `✅ conectado (stripped, token len=${tokenClean.length}) — ` + JSON.stringify(result.rows[0])
  } catch (err: any) {
    checks.test_stripped = '❌ ' + (err?.message ?? String(err))
  }

  return NextResponse.json(checks, { headers: { 'Cache-Control': 'no-store' } })
}
