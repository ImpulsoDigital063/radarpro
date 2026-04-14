import { NextResponse } from 'next/server'

export async function GET() {
  const url   = process.env.TURSO_URL   ?? ''
  const token = process.env.TURSO_TOKEN ?? ''

  const checks: Record<string, any> = {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY ? '✅ definida' : '❌ ausente',
    TURSO_URL:      url   ? '✅ ' + url : '❌ ausente',
    TURSO_TOKEN:    token ? `✅ definido — len=${token.length}, prefix=${token.slice(0, 20)}…, suffix=…${token.slice(-10)}` : '❌ ausente',
    url_has_whitespace:   /\s/.test(url),
    token_has_whitespace: /\s/.test(token),
    url_scheme:           url.split('://')[0] || '(nenhum)',
    node_version:         process.version,
  }

  try {
    const { createClient } = await import('@libsql/client')
    const client = createClient({ url: url.trim(), authToken: token.trim() })
    const result = await client.execute({ sql: 'SELECT 1 as ok', args: [] })
    checks.turso_connection = '✅ conectado — ' + JSON.stringify(result.rows[0])
  } catch (err: any) {
    checks.turso_connection = '❌ erro'
    checks.error_message    = err?.message ?? String(err)
    checks.error_code       = err?.code ?? null
    checks.error_cause      = err?.cause ? String(err.cause) : null
    checks.error_stack      = err?.stack?.split('\n').slice(0, 6).join('\n') ?? null
  }

  return NextResponse.json(checks, { headers: { 'Cache-Control': 'no-store' } })
}
