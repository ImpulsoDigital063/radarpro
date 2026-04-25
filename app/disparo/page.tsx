'use client'

import { useEffect, useState } from 'react'
import HeaderRadarPRO from '@/components/HeaderRadarPRO'

type Analise = {
  tier: 'A' | 'B' | 'C'
  posicao_no_tier: number
  dor: string
  gancho: string
  objecao: string
  resposta_objecao: string
  abertura: string
  razao_ranking: string
}

type LeadDisparo = {
  id: number
  nome: string
  categoria: string
  telefone: string
  telefoneFormatado: string
  instagram: string | null
  site: string
  nota: number | null
  numAvaliacoes: number | null
  oferta: string
  tier: 'A' | 'B' | 'C'
  posicao: number
  analise: Analise
  scripts: {
    abertura: string
    diagnostico: { variante: string; texto: string }
    pitchSeSoIG: string
    pitchSeTemSite: string
    fechamento: string
    callAlinhamento?: string
  }
  linkWhatsApp: string
}

type Stats = { total: number; tierA: number; tierB: number; tierC: number }
type Aba = 'todos' | 'A' | 'B' | 'C' | 'ofertas' | 'principios'

const TIER_COR: Record<'A' | 'B' | 'C', { fundo: string; borda: string; texto: string; label: string }> = {
  A: { fundo: '#DC262633', borda: '#DC2626', texto: '#FCA5A5', label: '🔥 Tier A' },
  B: { fundo: '#F59E0B33', borda: '#F59E0B', texto: '#FCD34D', label: '⚡ Tier B' },
  C: { fundo: '#6B728033', borda: '#6B7280', texto: '#9CA3AF', label: '🚧 Tier C' },
}

const OFERTA_LABEL: Record<string, string> = {
  'lp-solo': 'Landing Page',
  'shopify-solo': 'Loja Shopify',
  'agendapro-solo': 'AgendaPRO',
  'consultoria': 'Consultoria',
}

const OFERTA_COR: Record<string, string> = {
  'lp-solo': '#2563EB',
  'shopify-solo': '#10B981',
  'agendapro-solo': '#A855F7',
  'consultoria': '#F59E0B',
}

export default function DisparoPage() {
  const [leads, setLeads] = useState<LeadDisparo[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, tierA: 0, tierB: 0, tierC: 0 })
  const [erro, setErro] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [aba, setAba] = useState<Aba>('A')

  useEffect(() => {
    fetch('/api/disparo')
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) {
          setLeads(data.leads ?? [])
          setStats(data.stats ?? { total: 0, tierA: 0, tierB: 0, tierC: 0 })
        } else {
          setErro(data.erro ?? 'Erro desconhecido')
        }
      })
      .catch((e) => setErro(String(e)))
      .finally(() => setLoading(false))
  }, [])

  const leadsFiltrados =
    aba === 'todos'
      ? leads
      : aba === 'A' || aba === 'B' || aba === 'C'
      ? leads.filter((l) => l.tier === aba)
      : []

  return (
    <div style={{ minHeight: '100vh', background: '#0F1117', color: '#F9FAFB', fontFamily: 'system-ui, sans-serif' }}>
      <HeaderRadarPRO activeTab="disparo" />

      <main style={{ padding: '20px 24px 40px', maxWidth: '1100px', margin: '0 auto' }}>
        <header style={{ marginBottom: '20px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 800, margin: 0 }}>
            Playbook de disparo — top 14 leads
          </h1>
          <p style={{ color: '#9CA3AF', fontSize: '12px', marginTop: '6px', lineHeight: 1.5 }}>
            14 leads priorizados (7 LP + 7 Shopify) com análise cirúrgica + abertura calibrada
            pelos 5 livros (Voss, Klaff, Hormozi, Cialdini, Hill). Atacar Tier A primeiro.
          </p>
        </header>

        {/* Stats em cards */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <StatCard label="Total" valor={stats.total} cor="#F9FAFB" />
          <StatCard label="Tier A — atacar primeiro" valor={stats.tierA} cor="#FCA5A5" />
          <StatCard label="Tier B" valor={stats.tierB} cor="#FCD34D" />
          <StatCard label="Tier C — qualificar" valor={stats.tierC} cor="#9CA3AF" />
        </div>

        {/* Abas */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap', borderBottom: '1px solid #1F2937', paddingBottom: '12px' }}>
          <Tab label={`Tier A (${stats.tierA})`} ativa={aba === 'A'} onClick={() => setAba('A')} cor="#DC2626" />
          <Tab label={`Tier B (${stats.tierB})`} ativa={aba === 'B'} onClick={() => setAba('B')} cor="#F59E0B" />
          <Tab label={`Tier C (${stats.tierC})`} ativa={aba === 'C'} onClick={() => setAba('C')} cor="#6B7280" />
          <Tab label="💼 Ofertas" ativa={aba === 'ofertas'} onClick={() => setAba('ofertas')} cor="#2563EB" />
          <Tab label="📚 Princípios" ativa={aba === 'principios'} onClick={() => setAba('principios')} cor="#A855F7" />
        </div>

        {loading && <div style={{ color: '#6B7280', padding: '40px 0', textAlign: 'center' }}>Carregando…</div>}

        {erro && (
          <div style={{ background: '#7F1D1D33', border: '1px solid #DC2626', borderRadius: '8px', padding: '14px', color: '#FCA5A5', fontSize: '13px' }}>
            {erro}
          </div>
        )}

        {!loading && !erro && (aba === 'A' || aba === 'B' || aba === 'C' || aba === 'todos') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {leadsFiltrados.length === 0 && (
              <div style={{ color: '#6B7280', padding: '40px 0', textAlign: 'center', fontSize: '13px' }}>
                Nenhum lead nessa categoria.
              </div>
            )}
            {leadsFiltrados.map((lead) => <CardLead key={lead.id} lead={lead} />)}
          </div>
        )}

        {!loading && aba === 'ofertas' && <OfertasPanel />}
        {!loading && aba === 'principios' && <PrincipiosPanel />}
      </main>
    </div>
  )
}

function StatCard({ label, valor, cor }: { label: string; valor: number; cor: string }) {
  return (
    <div style={{ background: '#111827', border: '1px solid #1F2937', borderRadius: '8px', padding: '12px 16px', minWidth: '140px' }}>
      <div style={{ fontSize: '24px', fontWeight: 800, color: cor }}>{valor}</div>
      <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>{label}</div>
    </div>
  )
}

function Tab({ label, ativa, onClick, cor }: { label: string; ativa: boolean; onClick: () => void; cor: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: ativa ? `${cor}33` : '#111827',
        border: `1px solid ${ativa ? cor : '#1F2937'}`,
        color: ativa ? '#F9FAFB' : '#9CA3AF',
        padding: '6px 14px',
        borderRadius: '999px',
        fontSize: '12px',
        fontWeight: 700,
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  )
}

function CardLead({ lead }: { lead: LeadDisparo }) {
  const [aberto, setAberto] = useState(false)
  const tierCor = TIER_COR[lead.tier]
  const ofertaLabel = OFERTA_LABEL[lead.oferta] || lead.oferta
  const ofertaCor = OFERTA_COR[lead.oferta] || '#6B7280'

  return (
    <div style={{ background: '#111827', border: `1px solid ${aberto ? tierCor.borda : '#1F2937'}`, borderRadius: '10px', overflow: 'hidden' }}>
      {/* Linha principal — sempre visível */}
      <div
        onClick={() => setAberto(!aberto)}
        style={{
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
          flexWrap: 'wrap',
        }}
      >
        {/* Tier badge à esquerda */}
        <div
          style={{
            background: tierCor.fundo,
            border: `1px solid ${tierCor.borda}`,
            color: tierCor.texto,
            padding: '6px 10px',
            borderRadius: '8px',
            fontWeight: 800,
            fontSize: '13px',
            minWidth: '46px',
            textAlign: 'center',
          }}
        >
          {lead.tier}
          {lead.posicao}
        </div>

        {/* Oferta + nome + dados */}
        <div style={{ flex: 1, minWidth: '200px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
            <span
              style={{
                background: `${ofertaCor}33`,
                color: ofertaCor,
                fontSize: '10px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '4px',
              }}
            >
              {ofertaLabel}
            </span>
            <span style={{ fontWeight: 700, fontSize: '14px' }}>{lead.nome}</span>
          </div>
          <div style={{ fontSize: '11px', color: '#9CA3AF', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span>{lead.categoria}</span>
            <span>·</span>
            <span>📞 {lead.telefoneFormatado}</span>
            {lead.nota !== null && (
              <>
                <span>·</span>
                <span>⭐ {lead.nota} ({lead.numAvaliacoes ?? 0} aval)</span>
              </>
            )}
            {lead.instagram && (
              <>
                <span>·</span>
                <span>{lead.instagram}</span>
              </>
            )}
          </div>
        </div>

        {/* Botões de ação */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <a
            href={lead.linkWhatsApp}
            target="_blank"
            rel="noopener"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#10B981',
              color: 'white',
              padding: '7px 14px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            💬 WA
          </a>
          <span style={{ color: '#6B7280', fontSize: '14px' }}>{aberto ? '▲' : '▼'}</span>
        </div>
      </div>

      {/* Detalhes — expansível */}
      {aberto && (
        <div style={{ borderTop: '1px solid #1F2937', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <CampoBloco titulo="🎯 Razão do ranking" texto={lead.analise.razao_ranking} />
          <CampoBloco titulo="🔍 Dor real" texto={lead.analise.dor} />
          <CampoBloco titulo="🎣 Gancho da oferta" texto={lead.analise.gancho} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <CampoBloco titulo="🛡️ Objeção esperada" texto={lead.analise.objecao} />
            <CampoBloco titulo="💡 Como responder" texto={lead.analise.resposta_objecao} />
          </div>
          <MensagemCopiavel titulo="📝 Msg 1 — Abertura cirúrgica (calibrada pelos 5 livros)" texto={lead.scripts.abertura} destaque />
          <MensagemCopiavel
            titulo={`📋 Msg 2 — Diagnóstico (variante ${lead.scripts.diagnostico.variante})`}
            texto={lead.scripts.diagnostico.texto}
          />
          <MensagemCopiavel titulo="🎯 Msg 3A — Pitch se 'só tenho Instagram'" texto={lead.scripts.pitchSeSoIG} />
          <MensagemCopiavel titulo="🎯 Msg 3B — Pitch se 'tenho site'" texto={lead.scripts.pitchSeTemSite} />
          <MensagemCopiavel titulo="🤝 Msg 4 — Fechamento" texto={lead.scripts.fechamento} />
          {lead.scripts.callAlinhamento && (
            <MensagemCopiavel titulo="🔒 Arma de travamento — Call de alinhamento" texto={lead.scripts.callAlinhamento} />
          )}
          <a
            href={lead.linkWhatsApp}
            target="_blank"
            rel="noopener"
            style={{
              display: 'block',
              background: '#10B981',
              color: 'white',
              padding: '10px 16px',
              borderRadius: '8px',
              textAlign: 'center',
              fontWeight: 700,
              textDecoration: 'none',
              marginTop: '4px',
            }}
          >
            💬 Abrir WhatsApp com a abertura já preenchida
          </a>
        </div>
      )}
    </div>
  )
}

function CampoBloco({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <div>
      <div style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 700, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {titulo}
      </div>
      <div style={{ fontSize: '13px', color: '#D1D5DB', lineHeight: 1.5 }}>{texto}</div>
    </div>
  )
}

function MensagemCopiavel({ titulo, texto, destaque }: { titulo: string; texto: string; destaque?: boolean }) {
  const [copiado, setCopiado] = useState(false)
  function copiar() {
    navigator.clipboard.writeText(texto).then(() => {
      setCopiado(true)
      setTimeout(() => setCopiado(false), 1500)
    })
  }
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
        <span style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {titulo}
        </span>
        <button
          onClick={copiar}
          style={{
            background: copiado ? '#10B981' : '#1F2937',
            color: copiado ? 'white' : '#D1D5DB',
            border: 'none',
            padding: '4px 10px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          {copiado ? '✓ Copiado' : '📋 Copiar'}
        </button>
      </div>
      <pre
        style={{
          background: destaque ? '#1E3A8A22' : '#0F1117',
          border: `1px solid ${destaque ? '#1E3A8A' : '#1F2937'}`,
          color: '#F3F4F6',
          padding: '10px 12px',
          borderRadius: '6px',
          fontSize: '12px',
          fontFamily: 'system-ui, sans-serif',
          whiteSpace: 'pre-wrap',
          margin: 0,
          lineHeight: 1.5,
        }}
      >
        {texto}
      </pre>
    </div>
  )
}

function OfertasPanel() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <CardOferta
        titulo="Pacote Lançamento Vitalício"
        subtitulo="Landing Page · R$499"
        slogan="Aparece no Google em 7 dias e nunca mais paga hospedagem."
        cor="#2563EB"
        entrega={[
          'Landing Page Next.js otimizada pra SEO local (mobile-first, carrega em 1s)',
          'Botão WhatsApp flutuante com mensagem pré-preenchida',
          'Formulário de captura integrado ao seu WhatsApp/email',
        ]}
        bonus={[
          { tipo: '🔥 AMPLIA', texto: '3 artigos SEO ranqueados pra captar tráfego orgânico vitalício (R$500)' },
          { tipo: '⚡ ACELERA', texto: 'Entrega em 7 dias contados do briefing (mercado entrega em 30-60)' },
          { tipo: '🪶 REMOVE ESFORÇO', texto: 'Call de alinhamento de 20 min onde sai um protótipo Next.js já no ar' },
          { tipo: '🛡️ REMOVE RISCO', texto: 'Hospedagem vitalícia grátis + garantia de 7 dias após prévia' },
        ]}
        ancoragem="Agência Palmas: R$1.500-3.000 + R$200/mês · Fiverr: R$800-1.200 sem SEO/blog/hosting"
        garantia='Se a prévia visual não for a cara do seu negócio, devolvo 100%. Antes de a gente publicar.'
        escassez="Hospedagem vitalícia válida só pros primeiros 10 fechamentos."
      />
      <CardOferta
        titulo="Pacote Loja-Que-Vende-Dormindo"
        subtitulo="Loja Shopify · R$599"
        slogan="Sua loja vende enquanto você dorme — você só recebe o pedido pronto."
        cor="#10B981"
        entrega={[
          'Loja Shopify com tema MPN (mesmo da UrbanFeet, 1.600+ pares vendidos)',
          '20 produtos cadastrados (foto + descrição + variações)',
          'Integração Yampi (checkout) + Melhor Envio (frete automático)',
          'Mercado Pago configurado (Pix + cartão 12x + boleto)',
        ]}
        bonus={[
          { tipo: '🔥 AMPLIA', texto: 'Lista de fornecedores Palmas + scripts de prospecção pra atacado (R$400)' },
          { tipo: '⚡ ACELERA', texto: 'Shopify a $1/mês nos 3 primeiros meses (economia R$300)' },
          { tipo: '🪶 REMOVE ESFORÇO', texto: 'Call de 30 min com diagnóstico operacional ao vivo (motoboy + MP + frete + fornecedores)' },
          { tipo: '🛡️ REMOVE RISCO', texto: 'Call de entrega gravada — você revê quantas vezes precisar' },
        ]}
        ancoragem="Agência Palmas: R$1.500-4.000 + mensalidade · Fiverr: R$1.200-2.000 sem tema/integrações/call"
        garantia="Antes de publicar, você aprova a prévia. Se não for a cara, devolvo 100%."
        provaSocial="Gabriel da GB Nutrition (personal trainer em Palmas) virou loja automatizada de suplementos com entrega expressa."
      />
    </div>
  )
}

function CardOferta({
  titulo,
  subtitulo,
  slogan,
  cor,
  entrega,
  bonus,
  ancoragem,
  garantia,
  escassez,
  provaSocial,
}: {
  titulo: string
  subtitulo: string
  slogan: string
  cor: string
  entrega: string[]
  bonus: { tipo: string; texto: string }[]
  ancoragem: string
  garantia: string
  escassez?: string
  provaSocial?: string
}) {
  return (
    <div style={{ background: '#111827', border: `1px solid ${cor}55`, borderRadius: '12px', padding: '20px 24px' }}>
      <div style={{ marginBottom: '14px' }}>
        <div style={{ fontSize: '11px', color: cor, fontWeight: 700, marginBottom: '4px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          {subtitulo}
        </div>
        <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>{titulo}</h3>
        <p style={{ fontSize: '13px', color: '#D1D5DB', fontStyle: 'italic', margin: '6px 0 0', borderLeft: `3px solid ${cor}`, paddingLeft: '10px' }}>
          {slogan}
        </p>
      </div>

      <Section titulo="O que entra">
        <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', lineHeight: 1.6, color: '#D1D5DB' }}>
          {entrega.map((e, i) => <li key={i}>{e}</li>)}
        </ul>
      </Section>

      <Section titulo="Bônus stack — empilha valor (Hormozi)">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {bonus.map((b, i) => (
            <div key={i} style={{ background: '#0F1117', border: '1px solid #1F2937', borderRadius: '6px', padding: '8px 12px', fontSize: '12px' }}>
              <span style={{ fontWeight: 800, marginRight: '8px' }}>{b.tipo}:</span>
              <span style={{ color: '#D1D5DB' }}>{b.texto}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section titulo="Ancoragem">
        <div style={{ fontSize: '12px', color: '#9CA3AF', lineHeight: 1.5 }}>{ancoragem}</div>
      </Section>

      <Section titulo="Garantia condicional">
        <div style={{ background: `${cor}22`, border: `1px solid ${cor}55`, borderRadius: '6px', padding: '10px 12px', fontSize: '12px', fontStyle: 'italic', color: '#D1D5DB' }}>
          "{garantia}"
        </div>
      </Section>

      {escassez && (
        <Section titulo="Escassez REAL">
          <div style={{ fontSize: '12px', color: '#FCD34D' }}>⏳ {escassez}</div>
        </Section>
      )}

      {provaSocial && (
        <Section titulo="Prova social viva">
          <div style={{ fontSize: '12px', color: '#86EFAC' }}>✅ {provaSocial}</div>
        </Section>
      )}
    </div>
  )
}

function Section({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: '12px' }}>
      <div style={{ fontSize: '10px', color: '#9CA3AF', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {titulo}
      </div>
      {children}
    </div>
  )
}

function PrincipiosPanel() {
  const principios = [
    {
      titulo: 'Award Frame (Klaff)',
      texto: 'Eduardo NÃO suplica. Ele AVALIA se vale ajudar esse lead. Postura de quem tem agenda cheia, não de quem precisa fechar.',
    },
    {
      titulo: 'Labeling (Voss)',
      texto: '"Me parece que tu..." antes de qualquer pitch. Antecipa o que ele tá sentindo e ele baixa a guarda.',
    },
    {
      titulo: 'Black Swan question',
      texto: 'Termina abertura com pergunta que dói. Não "quer um site?" — "quem busca [seu serviço] hoje em Palmas, te acha?"',
    },
    {
      titulo: 'Calibrated Questions (Voss)',
      texto: '"Como…" e "O que…" — NUNCA "Por que" (soa acusatório).',
    },
    {
      titulo: 'Hot Cognition (Klaff)',
      texto: 'Mira emoção (medo de perder, ambição, status), não razão.',
    },
    {
      titulo: 'Desejo ardente (Hill)',
      texto: 'Se o lead disser "vou pensar", insiste com mais um ângulo. Nunca passivo.',
    },
    {
      titulo: 'Tom Eduardo',
      texto: '"tamo junto", "olha", "pensa comigo", "tu manda?". Curto. Sem corporativês. Pontuação de chat real.',
    },
  ]

  return (
    <div>
      <div style={{ background: '#111827', border: '1px solid #1F2937', borderRadius: '10px', padding: '16px 20px', marginBottom: '14px' }}>
        <div style={{ fontSize: '12px', color: '#A855F7', fontWeight: 700, marginBottom: '6px' }}>
          ANTES DE CADA DISPARO — checklist mental
        </div>
        <div style={{ fontSize: '13px', color: '#D1D5DB', lineHeight: 1.5 }}>
          7 princípios destilados dos 5 livros de venda que alimentam o sistema. Bata o olho aqui antes de mandar a primeira mensagem.
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
        {principios.map((p, i) => (
          <div key={i} style={{ background: '#111827', border: '1px solid #1F2937', borderRadius: '10px', padding: '14px 16px' }}>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#A855F7', marginBottom: '6px' }}>{i + 1}. {p.titulo}</div>
            <div style={{ fontSize: '12px', color: '#D1D5DB', lineHeight: 1.5 }}>{p.texto}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
