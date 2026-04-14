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

export type DiagnosticoNegocio = {
  dor_central: string        // a dor número 1 desse negócio AGORA (específico, não genérico)
  custo_da_dor: string       // o que essa dor está custando: tempo, dinheiro, clientes perdidos
  produto_ideal: 'lp' | 'shopify' | 'agendapro'
  por_que_esse_produto: string  // raciocínio direto: por que ESTE produto resolve esta dor
  argumento_cirurgico: string   // a frase mais poderosa para usar no pitch — impacto máximo
  gatilho: string               // medo de perder, desejo de ganhar ou prova social?
  mensagem_impacto: string      // mensagem de abordagem reformulada com a dor no centro
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

  const semSite   = !lead.tem_site
  const semAgenda = !lead.tem_agendamento
  const notaAlta  = (lead.nota ?? 0) >= 4.5
  const muitasAval = (lead.num_avaliacoes ?? 0) >= 30
  const temIG     = !!lead.instagram
  const bioIG     = lead.instagram_bio ?? ''

  const prompt = `Você é um vendedor afiado da Impulso Digital. Precisa gerar uma abordagem CIRÚRGICA para este lead — nada genérico.

## Lead em análise
- Nome: ${lead.nome}
- Categoria: ${lead.categoria}
- Produto que vamos oferecer: ${produto}
- Instagram: ${lead.instagram ?? 'não tem'} ${bioIG ? `| Bio: "${bioIG}"` : ''}
- Seguidores: ${lead.instagram_seguidores ?? '?'}
- Site: ${lead.site ?? 'NÃO TEM SITE'}
- Nota Google: ${lead.nota ?? 'sem nota'} ${lead.num_avaliacoes ? `(${lead.num_avaliacoes} avaliações)` : '(sem avaliações)'}
- Tem sistema de agendamento: ${lead.tem_agendamento ? 'sim' : 'NÃO TEM'}
- Endereço: ${lead.endereco ?? 'Palmas-TO'}

## Contexto de oportunidade
${semSite ? `→ NÃO TEM SITE: clientes que pesquisam no Google não encontram nada profissional` : ''}
${semAgenda ? `→ SEM AGENDAMENTO ONLINE: provavelmente perde tempo confirmando horário no WhatsApp` : ''}
${notaAlta ? `→ NOTA ${lead.nota} NO GOOGLE: negócio consolidado com boa reputação — merece presença digital à altura` : ''}
${muitasAval ? `→ ${lead.num_avaliacoes} AVALIAÇÕES: negócio movimentado, mas sem estrutura digital para converter esse tráfego` : ''}
${temIG ? `→ TEM INSTAGRAM ATIVO: já tem audiência, só falta converter para clientes reais` : ''}

## O que a mensagem PRECISA fazer
1. Mencionar algo REAL e ESPECÍFICO desse negócio (nota, categoria, algo da bio)
2. A pergunta final deve fazer o prospect pensar "nossa, ele acertou na mosca"
3. Não revelar produto, não listar benefícios — apenas despertar curiosidade
4. Soar como mensagem de alguém que fez o dever de casa, não spam

## Retorne EXATAMENTE neste JSON (sem markdown):
{
  "mensagem": "<mensagem WhatsApp — máx 4 linhas, específica, termina com pergunta que dói>",
  "diagnostico": "<3 linhas: o que esse negócio tem de bom, onde está sangrando digitalmente, o perfil real do dono>",
  "argumento": "<1 frase: o argumento mais forte para fechar — baseado na DOR específica desse negócio>",
  "urgencia": "<1 frase concreta: por que agir AGORA — concorrência, sazonalidade, crescimento do segmento>"
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
 * Diagnóstico profundo do negócio — identifica dor real e triangula produto ideal
 */
export async function diagnosticarNegocio(lead: DadosLead): Promise<DiagnosticoNegocio> {
  const genAI = getClient()
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: SYSTEM_PROMPT,
  })

  const prompt = `Faça um diagnóstico CIRÚRGICO deste negócio local de Palmas-TO.

## Dados disponíveis
- Nome: ${lead.nome}
- Categoria: ${lead.categoria}
- Instagram: ${lead.instagram ?? 'não tem'} ${lead.instagram_bio ? `| Bio: "${lead.instagram_bio}"` : ''}
- Seguidores: ${lead.instagram_seguidores ?? 'desconhecido'}
- Site: ${lead.site ? 'tem site' : 'NÃO TEM SITE'}
- Nota Google: ${lead.nota ?? 'sem nota'} ${lead.num_avaliacoes ? `(${lead.num_avaliacoes} avaliações)` : ''}
- Tem e-commerce: ${lead.tem_ecommerce ? 'sim' : 'não'}
- Tem agendamento online: ${lead.tem_agendamento ? 'sim' : 'não'}

## Nossos 3 produtos
1. **Landing Page R$499** — para quem não tem site ou tem site amador. Aparece no Google, converte visitante em cliente.
2. **Loja Shopify a partir de R$599** — para quem vende produto físico só pelo Instagram/WhatsApp e quer uma loja real.
3. **AgendaPRO R$67/mês** — para barbearia, salão, clínica, personal, psicólogo, dentista. Cliente agenda sozinho, sem WhatsApp.

## Sua missão
Identifique com precisão cirúrgica:
- Qual é a DOR NÚMERO 1 desse negócio? (não genérico — específico para essa categoria e situação)
- O que essa dor está custando CONCRETAMENTE? (clientes perdidos, horas gastas, dinheiro deixado na mesa)
- Qual dos 3 produtos resolve melhor essa dor e POR QUÊ?
- Qual seria a frase mais poderosa para usar no pitch de vendas?

Retorne EXATAMENTE neste JSON (sem markdown):
{
  "dor_central": "<a dor número 1 desse negócio AGORA — específica, concreta, não genérica>",
  "custo_da_dor": "<o que essa dor está custando — seja concreto: 'X horas por dia', 'clientes que não voltam', 'concorrente que aparece no Google'>",
  "produto_ideal": "<lp | shopify | agendapro>",
  "por_que_esse_produto": "<raciocínio direto: como ESTE produto elimina ESTA dor específica — 2 frases>",
  "argumento_cirurgico": "<a frase mais poderosa para usar no pitch — deve fazer o prospect pensar 'é exatamente isso'>",
  "gatilho": "<medo_de_perder | desejo_de_ganhar | prova_social — qual gatilho usar com esse tipo de negócio>",
  "mensagem_impacto": "<mensagem de WhatsApp reformulada com a dor no centro — máx 4 linhas, termina com pergunta que dói>"
}`

  const result = await model.generateContent(prompt)
  const texto  = result.response.text().trim().replace(/^```json\n?/, '').replace(/\n?```$/, '')

  try {
    const data = JSON.parse(texto)
    // Normaliza o produto_ideal
    const produtoValido = ['lp', 'shopify', 'agendapro'].includes(data.produto_ideal)
      ? data.produto_ideal
      : lead.tipo
    return { ...data, produto_ideal: produtoValido }
  } catch {
    return {
      dor_central:         'Negócio sem presença digital estruturada',
      custo_da_dor:        'Clientes que procuram online não encontram o negócio',
      produto_ideal:       lead.tipo,
      por_que_esse_produto: 'Presença digital resolve o problema de visibilidade',
      argumento_cirurgico: 'Enquanto você não aparece no Google, seu concorrente aparece',
      gatilho:             'medo_de_perder',
      mensagem_impacto:    `Oi ${lead.nome}, vi seu negócio no Google. Você recebe clientes novos pela internet ou só por indicação?`,
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
 * Ranqueia os leads e decide quais prospectar hoje
 */
export type PrioridadeHoje = {
  lead_id: number
  prioridade: number   // 1 = mais urgente
  motivo: string       // por que esse lead hoje especificamente
  acao: string         // o que fazer: "Primeira abordagem", "Follow-up", "Fechar proposta"
}

export async function gerarPlanoHoje(leads: (DadosLead & {
  id: number
  status: string
  score: number
  proximo_followup?: string | null
  mensagem?: string | null
})[]): Promise<PrioridadeHoje[]> {
  if (leads.length === 0) return []

  const genAI = getClient()
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: SYSTEM_PROMPT,
  })

  const hoje = new Date().toISOString().split('T')[0]

  const resumo = leads.slice(0, 30).map(l => ({
    id: l.id,
    nome: l.nome,
    categoria: l.categoria,
    tipo: l.tipo,
    status: l.status,
    score: l.score,
    nota: l.nota,
    telefone: !!l.telefone,
    instagram: !!l.instagram,
    followup: l.proximo_followup,
    vencido: l.proximo_followup ? l.proximo_followup < hoje : false,
  }))

  const prompt = `Hoje é ${hoje}. Analise estes leads e decida quais 5 devemos contatar HOJE, em ordem de prioridade.

## Lista de leads disponíveis:
${JSON.stringify(resumo, null, 2)}

## Critérios de priorização:
1. Follow-up vencido (data já passou) → ação imediata
2. Score alto (≥7) com telefone disponível → oportunidade quente
3. Leads em "respondeu" ou "consultoria_feita" → prontos para avançar no funil
4. Leads novos com nota Google alta (≥4.5) e telefone → primeira abordagem vale a pena
5. AgendaPRO para barbearias/salões/clínicas → recorrente, vale priorizar

Retorne EXATAMENTE este JSON (sem markdown) com os 5 leads mais prioritários:
[
  {
    "lead_id": <id do lead>,
    "prioridade": <1 a 5, 1 é mais urgente>,
    "motivo": "<por que esse lead HOJE — 1 frase específica>",
    "acao": "<o que fazer: 'Primeira abordagem', 'Follow-up', 'Fechar proposta', 'Enviar contrato'>"
  }
]`

  const result = await model.generateContent(prompt)
  const texto  = result.response.text().trim().replace(/^```json\n?/, '').replace(/\n?```$/, '')

  try {
    return JSON.parse(texto) as PrioridadeHoje[]
  } catch {
    // Fallback: ranqueia localmente pelos dados mais óbvios
    return leads
      .filter(l => l.status !== 'fechado' && l.status !== 'sem_interesse')
      .sort((a, b) => {
        const aVencido = a.proximo_followup && a.proximo_followup < hoje ? 1 : 0
        const bVencido = b.proximo_followup && b.proximo_followup < hoje ? 1 : 0
        return (bVencido - aVencido) || ((b.score ?? 0) - (a.score ?? 0))
      })
      .slice(0, 5)
      .map((l, i) => ({
        lead_id:    l.id,
        prioridade: i + 1,
        motivo:     l.proximo_followup && l.proximo_followup < hoje
          ? 'Follow-up vencido — não deixar esfriar'
          : `Score ${l.score}/10 — lead qualificado`,
        acao: l.status === 'novo' ? 'Primeira abordagem' : 'Follow-up',
      }))
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
