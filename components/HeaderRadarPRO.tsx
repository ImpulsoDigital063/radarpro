'use client'

// Header compartilhado entre painéis secundários (/tally, /licoes, futuros)
// Painel principal (/) tem header próprio mais rico (com busca, filtros, etc)

type ActiveTab = 'tally' | 'licoes' | null

const BG    = '#0F1117'
const CARD  = '#111827'
const BRD   = '#1F2937'
const TXT   = '#F9FAFB'
const MUTED = '#6B7280'
const BLUE  = '#2563EB'

export default function HeaderRadarPRO({ activeTab = null }: { activeTab?: ActiveTab }) {
  return (
    <div style={{
      borderBottom: `1px solid ${BRD}`,
      padding: '16px 32px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      flexWrap: 'wrap',
      background: BG,
      color: TXT,
      fontFamily: 'system-ui, sans-serif',
    }}>
      <a href="/" style={{ marginRight: '8px', textDecoration: 'none', color: TXT }}>
        <h1 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>
          radar<span style={{ color: BLUE }}>PRO</span>
        </h1>
        <p style={{ fontSize: '10px', color: MUTED, margin: '2px 0 0' }}>Impulso Digital</p>
      </a>

      <a href="/" style={badgeStyle({ active: false })}>
        ← Painel
      </a>

      <a href="/tally" style={badgeStyle({ active: activeTab === 'tally' })}>
        📋 Tally
      </a>

      <a href="/licoes" style={badgeStyle({ active: activeTab === 'licoes' })}>
        📚 Lições
      </a>

      <a href="/integracao/whatsapp" style={badgeStyle({ active: false })}>
        💬 WhatsApp
      </a>
    </div>
  )
}

function badgeStyle({ active }: { active: boolean }): React.CSSProperties {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '5px 10px',
    borderRadius: '999px',
    background: active ? '#1E3A8A22' : CARD,
    border: `1px solid ${active ? BLUE : BRD}`,
    color: active ? '#93C5FD' : MUTED,
    fontSize: '11px',
    fontWeight: 700,
    textDecoration: 'none',
  }
}
