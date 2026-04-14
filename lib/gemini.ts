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
    model: 'gemini-2.0-flash',
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
export type AnaliseSite = {
  converte: string      // O site converte bem ou não?
  pontos_fracos: string // Os 2 maiores problemas
  argumento: string     // Argumento de venda direto
  urgencia: number      // 1-5
  urgencia_motivo: string
  nota: number          // 0-10
}

export async function analisarConteudoSite(url: string, conteudo: string, nome: string): Promise<AnaliseSite> {
  const genAI = getClient()
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: SYSTEM_PROMPT,
  })

  const prompt = `Você está analisando o site atual de um prospect chamado "${nome}" (${url}).
Nosso objetivo é vender uma Landing Page profissional por R$499 para substituir ou melhorar esse site.

## Conteúdo extraído da página:
${conteudo.slice(0, 4000)}

## Indicadores para avaliar:
- Tem CTA claro (botão de contato, WhatsApp, agendamento)?
- Carrega rápido (site leve ou cheio de imagens pesadas)?
- Aparece no Google (tem título/descrição otimizados)?
- Tem prova social (depoimentos, cases, fotos reais)?
- Design profissional ou amador?
- Mobile friendly?

Retorne EXATAMENTE este JSON (sem markdown):
{
  "converte": "<1 frase: sim/não e por quê>",
  "pontos_fracos": "<2 pontos fracos principais separados por ';'>",
  "argumento": "<1 frase direta para usar no pitch de vendas>",
  "urgencia": <número 1 a 5>,
  "urgencia_motivo": "<por que é urgente ou não em 1 frase>",
  "nota": <nota geral do site de 0 a 10>
}`

  const result = await model.generateContent(prompt)
  const texto  = result.response.text().trim().replace(/^```json\n?/, '').replace(/\n?```$/, '')

  try {
    return JSON.parse(texto) as AnaliseSite
  } catch {
    return {
      converte: 'Análise não disponível',
      pontos_fracos: 'Verificar manualmente',
      argumento: 'Visitar o site e analisar',
      urgencia: 3,
      urgencia_motivo: 'A definir',
      nota: 5,
    }
  }
}

/**
 * Calcula score inteligente 0-10 com justificativa via IA
 */
export async function calcularScoreIA(lead: DadosLead): Promise<{ score: number; justificativa: string }> {
  const genAI = getClient()
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: SYSTEM_PROMPT,
  })

  const prompt = `Avalie o potencial de venda deste lead para o produto ${lead.tipo === 'lp' ? 'Landing Page (R$499)' : lead.tipo === 'shopify' ? 'Shopify (a partir de R$599)' : 'AgendaPRO (R$67/mês)'}.

Dados do lead:
- Nome: ${lead.nome}
- Categoria: ${lead.categoria}
- Telefone: ${lead.telefone ?? 'não encontrado'}
- Instagram: ${lead.instagram ?? 'não tem'} (${lead.instagram_seguidores ?? '?'} seguidores)
- Bio Instagram: ${lead.instagram_bio ?? 'não disponível'}
- Tem site: ${lead.tem_site ? 'sim' : 'não'}
- Tem e-commerce: ${lead.tem_ecommerce ? 'sim' : 'não'}
- Tem agendamento online: ${lead.tem_agendamento ? 'sim' : 'não'}
- Nota Google: ${lead.nota ?? 'sem nota'} ${lead.num_avaliacoes ? `(${lead.num_avaliacoes} avaliações)` : ''}

Responda EXATAMENTE neste JSON (sem markdown):
{
  "score": <número de 0 a 10>,
  "justificativa": "<2 linhas explicando o score — o que torna esse lead quente ou frio para esse produto específico>"
}`

  const result = await model.generateContent(prompt)
  const texto  = result.response.text().trim().replace(/^```json\n?/, '').replace(/\n?```$/, '')

  try {
    const data = JSON.parse(texto)
    return { score: Math.min(10, Math.max(0, Number(data.score))), justificativa: data.justificativa }
  } catch {
    return { score: 5, justificativa: 'Análise não disponível' }
  }
}

/**
 * Gera mensagem de follow-up personalizada com base no histórico do lead
 */
export type RespostaFollowup = {
  mensagem: string        // próxima mensagem para enviar no WhatsApp
  quando: string          // quando enviar (ex: "Amanhã às 10h", "Em 3 dias")
  dias: number            // dias a partir de hoje para o próximo contato
  angulo: string          // ângulo/abordagem desta etapa
}

export async function gerarFollowup(lead: DadosLead & {
  status: string
  mensagem_enviada?: string | null
  notas?: string | null
}): Promise<RespostaFollowup> {
  const genAI = getClient()
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: SYSTEM_PROMPT,
  })

  const statusLabel: Record<string, string> = {
    novo:                'ainda não foi abordado',
    abordado:            'já recebeu a primeira mensagem mas não respondeu',
    respondeu:           'respondeu, está em contato',
    consultoria_marcada: 'consultoria marcada',
    consultoria_feita:   'consultoria já foi feita',
    proposta_enviada:    'proposta enviada, aguardando decisão',
    fechado:             'fechou negócio',
    sem_interesse:       'disse que não tem interesse',
  }

  const produto = lead.tipo === 'lp'
    ? 'Landing Page (R$499)'
    : lead.tipo === 'shopify'
      ? 'Loja Shopify (a partir de R$599)'
      : 'AgendaPRO (R$67/mês)'

  const prompt = `Você precisa gerar a próxima mensagem de follow-up para este lead.

## Dados do lead
- Nome: ${lead.nome}
- Categoria: ${lead.categoria}
- Produto alvo: ${produto}
- Status atual: ${statusLabel[lead.status] ?? lead.status}
- Nota Google: ${lead.nota ?? 'sem nota'} ${lead.num_avaliacoes ? `(${lead.num_avaliacoes} avaliações)` : ''}
- Seguidores Instagram: ${lead.instagram_seguidores ?? 'desconhecido'}

## Histórico
- Primeira mensagem enviada: ${lead.mensagem_enviada ? `"${lead.mensagem_enviada}"` : 'não enviada ainda'}
- Anotações: ${lead.notas ?? 'nenhuma'}

## Regras para o follow-up
- Não repetir o mesmo ângulo da primeira mensagem
- Trazer algo novo: uma dor diferente, um resultado de cliente, uma pergunta direta
- Máximo 3 linhas, termina com pergunta curta
- Não revelar preço ainda (exceto se status for proposta_enviada)
- Se o lead disse que vai pensar: follow-up em 3 dias com prova social
- Se o lead não respondeu: follow-up em 2 dias com ângulo diferente
- Se a consultoria foi feita: follow-up com proposta clara em 1 dia

Responda EXATAMENTE neste JSON (sem markdown):
{
  "mensagem": "<próxima mensagem de WhatsApp — máximo 3 linhas, termina com pergunta>",
  "quando": "<quando enviar, ex: 'Amanhã de manhã', 'Em 2 dias', 'Esta semana'>",
  "dias": <número de dias a partir de hoje para enviar>,
  "angulo": "<qual ângulo/abordagem está usando neste follow-up em 1 frase>"
}`

  const result = await model.generateContent(prompt)
  const texto  = result.response.text().trim().replace(/^```json\n?/, '').replace(/\n?```$/, '')

  try {
    const data = JSON.parse(texto)
    return {
      mensagem: data.mensagem,
      quando:   data.quando ?? 'Em 2 dias',
      dias:     Math.max(1, Math.min(30, Number(data.dias) || 2)),
      angulo:   data.angulo ?? 'Follow-up padrão',
    }
  } catch {
    return {
      mensagem: 'Oi, tudo bem? Queria saber se teve chance de pensar no que conversamos.',
      quando:   'Em 2 dias',
      dias:     2,
      angulo:   'Retomada simples',
    }
  }
}

/**
 * Responde perguntas livres sobre prospecção/vendas no contexto da Impulso Digital
 */
export async function chat(historico: { role: 'user' | 'model'; text: string }[], pergunta: string): Promise<string> {
  const genAI = getClient()
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
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
