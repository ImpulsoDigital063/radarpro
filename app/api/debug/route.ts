import { NextRequest, NextResponse } from 'next/server'

// /api/debug — endpoint protegido pra debug de conexão Turso.
// Antes: PÚBLICO e vazava URL completa + prefix do auth token.
// Agora: exige header `x-debug-key` igual a env DEBUG_KEY.
//
// Uso:
//   curl -H "x-debug-key: SUA_KEY" https://radarpro-inky.vercel.app/api/debug
//
// Se DEBUG_KEY não estiver setado no env, endpoint retorna 503 (forçar
// configuração consciente — nunca aceita request).

export async function GET(req: NextRequest) {
  const expectedKey = process.env.DEBUG_KEY
  if (!expectedKey) {
    return NextResponse.json(
      { error: 'DEBUG_KEY não configurado — endpoint desabilitado em produção' },
      { status: 503 },
    )
  }

  const providedKey = req.headers.get('x-debug-key')
  if (providedKey !== expectedKey) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const url = process.env.TURSO_URL ?? ''
  const token = process.env.TURSO_TOKEN ?? ''

  // Só metadata SEM expor o token cru. Localiza whitespaces (problema comum
  // de copy/paste do dashboard Turso pro Vercel).
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

  const checks: Record<string, unknown> = {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY ? '✅ definida' : '❌ ausente',
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY ? '✅ definida' : '❌ ausente',
    OPENAI_API_KEY: process.env.OPENAI_API_KEY ? '✅ definida' : '❌ ausente',
    TALLY_WEBHOOK_SECRET: process.env.TALLY_WEBHOOK_SECRET ? '✅ definido' : '❌ ausente',
    INTERNAL_API_KEY: process.env.INTERNAL_API_KEY ? '✅ definida' : '❌ ausente',
    TURSO_URL: url ? '✅ definida (length=' + url.length + ')' : '❌ ausente',
    TURSO_TOKEN: token ? `✅ definido — len=${token.length}` : '❌ ausente',
    url_has_whitespace: /\s/.test(url),
    token_has_whitespace: /\s/.test(token),
    token_whitespace_count: wsPositions.length,
    token_whitespace_positions: wsPositions.slice(0, 10),
    node_version: process.version,
  }

  // Teste de conexão (sem expor o token na resposta)
  try {
    const { createClient } = await import('@libsql/client')
    const client = createClient({
      url: url.replace(/\s/g, ''),
      authToken: token.replace(/\s/g, ''),
    })
    const result = await client.execute({ sql: 'SELECT 1 as ok', args: [] })
    checks.test_conexao = '✅ conectado — ' + JSON.stringify(result.rows[0])
  } catch (err) {
    checks.test_conexao = '❌ ' + (err instanceof Error ? err.message : String(err))
  }

  return NextResponse.json(checks, { headers: { 'Cache-Control': 'no-store' } })
}
