'use client'

import { useEffect, useState } from 'react'
import HeaderRadarPRO from '@/components/HeaderRadarPRO'

export default function DisparoPage() {
  const [md, setMd] = useState<string>('')
  const [erro, setErro] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [geradoEm, setGeradoEm] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/disparo')
      .then(r => r.json())
      .then(data => {
        if (data.ok) {
          setMd(data.md)
          setGeradoEm(data.geradoEm ?? null)
        } else {
          setErro(data.erro ?? 'Erro desconhecido')
        }
      })
      .catch(e => setErro(String(e)))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#0F1117', color: '#F9FAFB' }}>
      <HeaderRadarPRO activeTab="disparo" />

      <main style={{ padding: '24px 32px', maxWidth: '960px', margin: '0 auto' }}>
        <header style={{ marginBottom: '20px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800, margin: 0 }}>
            Playbook de disparo — top 14 leads
          </h1>
          <p style={{ color: '#9CA3AF', fontSize: '13px', marginTop: '8px', lineHeight: 1.5 }}>
            14 leads priorizados (7 LP + 7 Shopify) com análise cirúrgica por lead, abertura
            já calibrada pelos 5 livros (Hill, Hormozi, Voss, Cialdini, Klaff) e link wa.me
            pré-preenchido. Ranking por tier A/B/C — atacar A primeiro.
          </p>
          {geradoEm && (
            <p style={{ color: '#6B7280', fontSize: '11px', marginTop: '4px' }}>
              Gerado em {new Date(geradoEm).toLocaleString('pt-BR')}.
              Pra atualizar: <code style={{ background: '#1F2937', padding: '2px 6px', borderRadius: '4px' }}>npx tsx scripts/top-14-disparo.ts</code> + commit + push.
            </p>
          )}
        </header>

        {loading && (
          <div style={{ color: '#6B7280', padding: '40px 0', textAlign: 'center' }}>
            Carregando playbook…
          </div>
        )}

        {erro && (
          <div style={{
            background: '#7F1D1D33',
            border: '1px solid #DC2626',
            borderRadius: '8px',
            padding: '16px',
            color: '#FCA5A5',
            fontSize: '13px',
            lineHeight: 1.5,
          }}>
            {erro}
          </div>
        )}

        {md && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '32px 40px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          }}>
            <div dangerouslySetInnerHTML={{ __html: renderizarPreview(md) }} />
          </div>
        )}
      </main>
    </div>
  )
}

// Markdown renderer (mesma lógica de /tally pra consistência visual)
function renderizarPreview(md: string): string {
  let html = md

  // Code fences ``` → <pre>
  html = html.replace(/```([\s\S]*?)```/g, (_m, code: string) => {
    const escaped = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
    return `<pre style="background:#0F1117;color:#F9FAFB;padding:12px 16px;border-radius:6px;overflow-x:auto;font-size:12px;font-family:'SF Mono',Menlo,Consolas,monospace;line-height:1.5;margin:10px 0;white-space:pre-wrap">${escaped.trim()}</pre>`
  })

  // Tabelas
  html = html.replace(/(\|.+\|\n\|[\s|:-]+\|\n(?:\|.+\|\n?)+)/g, (tbl) => {
    const linhas = tbl.trim().split('\n')
    const head = linhas[0].split('|').slice(1, -1).map(s => s.trim())
    const body = linhas.slice(2).map(l => l.split('|').slice(1, -1).map(s => s.trim()))
    let out = '<table style="border-collapse:collapse;width:100%;margin:12px 0;font-size:12px"><thead><tr>'
    head.forEach(h => out += `<th style="border:1px solid #ddd;padding:6px 8px;background:#f3f4f6;text-align:left">${h}</th>`)
    out += '</tr></thead><tbody>'
    body.forEach(row => {
      out += '<tr>'
      row.forEach(c => out += `<td style="border:1px solid #ddd;padding:6px 8px">${c}</td>`)
      out += '</tr>'
    })
    out += '</tbody></table>'
    return out
  })

  html = html
    .replace(/^#### (.+)$/gm, '<h4 style="font-size:13px;font-weight:700;margin:14px 0 4px;color:#1F2937">$1</h4>')
    .replace(/^### (.+)$/gm, '<h3 style="font-size:15px;font-weight:700;margin:18px 0 6px;color:#111">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 style="font-size:18px;font-weight:800;margin:24px 0 8px;color:#0F1117;border-bottom:2px solid #2563EB;padding-bottom:4px">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 style="font-size:24px;font-weight:900;margin:0 0 16px;color:#0F1117">$1</h1>')
    .replace(/^---$/gm, '<hr style="border:0;border-top:1px solid #E5E7EB;margin:24px 0">')
    .replace(/^> (.+)$/gm, '<blockquote style="border-left:3px solid #2563EB;padding:8px 12px;margin:10px 0;background:#f0f9ff;font-style:italic;color:#1e3a8a">$1</blockquote>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" style="color:#2563EB;text-decoration:underline">$1</a>')
    .replace(/`([^`]+)`/g, '<code style="background:#F3F4F6;color:#1F2937;padding:1px 5px;border-radius:3px;font-size:0.9em">$1</code>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li style="margin:4px 0">$1</li>')
    .replace(/(<li.*<\/li>\n?)+/g, (m) => `<ul style="margin:8px 0;padding-left:20px">${m}</ul>`)
    .replace(/\n\n/g, '</p><p style="margin:8px 0;line-height:1.6">')

  return `<div style="font-family:system-ui,sans-serif;line-height:1.6;color:#111"><p>${html}</p></div>`
}
