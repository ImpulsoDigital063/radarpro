import { NextResponse } from 'next/server'

export async function GET() {
  const checks: Record<string, any> = {
    GEMINI_API_KEY:  process.env.GEMINI_API_KEY ? '✅ definida' : '❌ ausente',
    TURSO_URL:       process.env.TURSO_URL       ? '✅ ' + process.env.TURSO_URL : '❌ ausente',
    TURSO_TOKEN:     process.env.TURSO_TOKEN     ? '✅ definido (' + process.env.TURSO_TOKEN.slice(0, 20) + '...)' : '❌ ausente',
  }

  // Testa conexão com Turso
  try {
    const { getClient } = await import('@/lib/db')
    const db = getClient()
    const result = await db.execute({ sql: 'SELECT 1 as ok', args: [] })
    checks.turso_connection = '✅ conectado — ' + JSON.stringify(result.rows[0])
  } catch (err: any) {
    checks.turso_connection = '❌ erro: ' + err.message
  }

  return NextResponse.json(checks)
}
