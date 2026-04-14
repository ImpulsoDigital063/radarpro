import { GoogleGenerativeAI } from '@google/generative-ai'

// ── Sistema de agente ─────────────────────────────────────────────────────────
// Contexto completo da Impulso Digital para o agente ter memória permanente

const SYSTEM_PROMPT = `Você é o agente de prospecção da Impulso Digital, agência de marketing digital de Eduardo Barros em Palmas-TO.

## Quem você é
Você pensa como um consultor de vendas experiente. Analisa negócios locais e identifica oportunidades reais de crescimento digital. Fala de forma direta, como conversa de WhatsApp — sem frescura, sem jargões, sem firula.

## A Impulso Digital
Agência especializada em 3 produtos:

**1. Landing Page — R$499**
- Página de alta conversão com foco no produto/serviço do cliente
- Hospedagem vitalícia inclusa
- 3 artigos de blog com foco em SEO (aparece no Google)
- Design baseado nas referências do cliente
- Prazo: até 5 dias após briefing
- 3 rodadas de ajuste inclusas
- Pagamento: Pix ou cartão pelo Mercado Pago
- Casos de sucesso: evsuplementosinjetaveis.com (loja de suplementos), criativosdoceu.com (doceria artesanal)
- Público ideal: profissional liberal ou pequeno negócio SEM site profissional

**2. Loja Shopify — a partir de R$599**
- Loja online completa com produtos, carrinho, pagamento
- Integração com meios de pagamento brasileiros
- Público ideal: quem vende produto físico mas só pelo Instagram ou WhatsApp

**3. AgendaPRO — R$67/mês**
- Sistema de agendamento online (cliente agenda sozinho, sem WhatsApp)
- Reduz tempo perdido com confirmações
- Ideal para: barbearia, salão, clínica estética, personal trainer, psicólogo, dentista, fisioterapeuta

## Tom de voz obrigatório
- Direto, como mensagem de amigo
- Máximo 3-4 linhas por mensagem
- Primeira mensagem: sempre uma pergunta, nunca uma venda
- Nunca usar: "democratizar", "potencializar", "alavancar", "excelência", "parceria"
- Nunca listar benefícios na primeira mensagem
- Não usar saudação corporativa ("Prezado", "Venho por meio desta")

## O que você sabe sobre Palmas-TO
- Mercado em crescimento, maioria dos negócios locais ainda não tem presença digital profissional
- Profissionais liberais (nutricionistas, psicólogos, personal trainers) usam só Instagram e WhatsApp
- Donos de salão, barbearia e clínica perdem horas por dia agendando pelo WhatsApp
- Potencial de fechar 2-4 clientes/semana com prospecção ativa

## Regras para mensagens de abordagem
1. Primeira mensagem: máximo 4 linhas, termina com UMA pergunta
2. Não revelar preço na primeira mensagem
3. Mencionar algo específico do negócio (nota no Google, categoria, algo da bio)
4. Objetivo da primeira mensagem: gerar curiosidade, não vender
5. Se tiver nota Google alta (≥4.5): mencionar que o negócio parece consolidado
6. Se não tiver site: a dor é implícita, não explícita na primeira mensagem`

// ── Instância do cliente ──────────────────────────────────────────────────────

function getClient() {
  const key = process.env.GEMINI_API_KEY
  if (!key) throw new Error('GEMINI_API_KEY não configurada no .env.local')
  return new GoogleGenerativeAI(key)
}

// ── Tipos ─────────────────────────────────────────────────────────────────────

export type DadosLead = {
  nome: string
  categoria: string
  tipo: 'lp' | 'shopify' | 'agendapro'
  telefone?: string | null
  instagram?: string | null
  instagram_bio?: string | null
  instagram_seguidores?: string | null
  site?: string | null
  nota?: number | null
  num_avaliacoes?: number | null
  tem_site?: boolean
  tem_ecommerce?: boolean
  tem_agendamento?: boolean
  fonte?: string
  endereco?: string | null
}

export type RespostaAgente = {
  mensagem: string       // mensagem de abordagem pronta para WhatsApp
  diagnostico: string    // análise estratégica do negócio
  argumento: string      // principal argumento de venda para esse lead
  urgencia: string       // por que esse lead é oportunidade agora
}

// ── Funções principais ────────────────────────────────────────────────────────

/**
 * Gera mensagem de abordagem personalizada + diagnóstico estratégico
 */
export async function gerarAbordagem(lead: DadosLead): Promise<RespostaAgente> {
  const genAI  = getClient()
  const model  = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: SYSTEM_PROMPT,
  })

  const produto = lead.tipo === 'lp'
    ? 'Landing Page (R$499)'
    : lead.tipo === 'shopify'
      ? 'Loja Shopify (a partir de R$599)'
      : 'AgendaPRO (R$67/mês)'

  const prompt = `Analise este lead e gere a abordagem ideal.

## Dados do lead
- Nome: ${lead.nome}
- Categoria: ${lead.categoria}
- Produto alvo: ${produto}
- Telefone: ${lead.telefone ?? 'não encontrado'}
- Instagram: ${lead.instagram ?? 'não encontrado'}
- Bio Instagram: ${lead.instagram_bio ?? 'não disponível'}
- Seguidores: ${lead.instagram_seguidores ?? 'desconhecido'}
- Site: ${lead.site ?? 'não tem'}
- Nota Google: ${lead.nota ?? 'sem nota'} ${lead.num_avaliacoes ? `(${lead.num_avaliacoes} avaliações)` : ''}
- Tem site: ${lead.tem_site ? 'sim' : 'não'}
- Tem e-commerce: ${lead.tem_ecommerce ? 'sim' : 'não'}
- Tem sistema de agendamento: ${lead.tem_agendamento ? 'sim' : 'não'}
- Endereço: ${lead.endereco ?? 'não disponível'}
- Fonte: ${lead.fonte ?? 'desconhecida'}

## Retorne EXATAMENTE neste formato JSON (sem markdown, sem explicações):
{
  "mensagem": "mensagem de WhatsApp pronta — máximo 4 linhas, termina com pergunta",
  "diagnostico": "análise em 2-3 linhas: pontos fortes, fraquezas digitais, perfil geral",
  "argumento": "principal argumento de venda para esse lead específico em 1 linha",
  "urgencia": "por que esse lead é oportunidade agora em 1 linha"
}`

  const result = await model.generateContent(prompt)
  const texto  = result.response.text().trim()

  // Limpa possível markdown do Gemini
  const json = texto.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim()

  try {
    return JSON.parse(json) as RespostaAgente
  } catch {
    // Fallback se o JSON vier malformado
    return {
      mensagem:    texto,
      diagnostico: 'Análise não disponível',
      argumento:   'Verificar manualmente',
      urgencia:    'A definir',
    }
  }
}

/**
 * Analisa o conteúdo de um site/LP e dá um parecer estratégico
 */
export async function analisarConteudoSite(url: string, conteudo: string, nome: string): Promise<string> {
  const genAI = getClient()
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: SYSTEM_PROMPT,
  })

  const prompt = `Analise este site/LP do lead "${nome}" (${url}) e dê um parecer estratégico.

## Conteúdo extraído da página:
${conteudo.slice(0, 3000)}

## Responda em 4-5 linhas diretas:
1. O site converte bem ou não? Por quê?
2. Quais são os 2 maiores pontos fracos?
3. Qual seria o argumento para convencê-lo a refazer/melhorar?
4. Nível de urgência (1-5) e justificativa`

  const result = await model.generateContent(prompt)
  return result.response.text()
}

/**
 * Responde perguntas livres sobre prospecção/vendas no contexto da Impulso Digital
 */
export async function chat(historico: { role: 'user' | 'model'; text: string }[], pergunta: string): Promise<string> {
  const genAI = getClient()
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: SYSTEM_PROMPT,
  })

  const chatSession = model.startChat({
    history: historico.map(h => ({
      role: h.role,
      parts: [{ text: h.text }],
    })),
  })

  const result = await chatSession.sendMessage(pergunta)
  return result.response.text()
}
