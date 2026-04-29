// Gerador de mensagens personalizadas para cada tipo de prospect
//
// Calibração 27/04/2026 — REWRITE TOTAL baseado em diagnóstico GPT:
// "RadarPRO sabe muito sobre o lead mas fala como quem não sabe nada"
//
// Regras NOVAS (substituem as antigas):
// - Máximo 3 linhas (observação real → consequência simples → pergunta direta)
// - PROIBIDO: "Olá [nome]!", "Vi seu perfil", "Posso te fazer uma pergunta", emoji 👋
// - PROIBIDO: elogio genérico, linguagem de vendedor
// - SEMPRE usar dado real do lead (categoria, especialidade, ausência de site, contexto local)
// - Se a mensagem servir pra qualquer lead, está ERRADA
//
// Estes templates são FALLBACK genérico — leads do playbook customizado
// (lib/disparo-analises.ts) têm aberturas próprias mais cirúrgicas

// ── Helpers de cortesia cirúrgica (calibração 29/04/2026 — Verbo s01) ────────
// Hash determinístico por nome → mesma pessoa cai SEMPRE na mesma variante.
// Permite A/B tracking real e evita parecer template quando 2 leads comparam.

function hashNome(s: string): number {
  const clean = (s ?? '').toLowerCase().replace(/[^a-z0-9]/g, '')
  return clean.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) || 1
}

// Rotação de verbos de abertura — variedade orgânica > template fixo
const VERBOS_ABERTURA = [
  'Vi que',
  'Reparei que',
  'Olhei aqui rapidinho e vi que',
  'Tava passando pelo teu perfil e percebi que',
  'Cheguei no teu Google Business agora e vi que',
] as const

function pickVerbo(seed: string): string {
  return VERBOS_ABERTURA[hashNome(seed) % VERBOS_ABERTURA.length]
}

// Categorias FORMAIS — saúde com registro profissional + jurídico
// Lead formal recebe saudação cirúrgica curta declarativa (não interrogativa)
const CATEGORIAS_FORMAIS = [
  'médico', 'medico', 'dentista', 'dr.', 'dra.',
  'advogado', 'advocacia',
  'psicólogo', 'psicologo', 'psicóloga', 'psicologa',
  'fonoaudiólogo', 'fonoaudiologo', 'fonoaudióloga', 'fonoaudiologa',
  'fisioterapeuta', 'nutricionista', 'nutróloga', 'nutrologa',
  'endocrinologista', 'dermatologista', 'cardiologista',
  'ginecologista', 'urologista', 'oftalmologista', 'mastologista',
]

function ehFormal(categoria: string): boolean {
  const cat = (categoria ?? '').toLowerCase()
  return CATEGORIAS_FORMAIS.some(c => cat.includes(c))
}

function saudacao(nome: string, categoria: string): string {
  if (!ehFormal(categoria)) return 'ei' // informal
  // Formal: tenta inferir tratamento; default doutor(a) genérico se não bater
  const cat = categoria.toLowerCase()
  if (cat.includes('dra') || cat.includes('médica') || cat.includes('medica') ||
      cat.includes('psicóloga') || cat.includes('psicologa') ||
      cat.includes('nutricionista') || cat.includes('dentista')) {
    return 'doutora, boa noite'
  }
  return 'doutor, boa noite'
}

// ── Helper: gera 3 horários nos próximos 3 dias úteis ───────────────────────
// Usado nos `fechamento` pra evitar dias hardcoded ("quinta 15h, sexta 14h")
// que ficam estranhos quando hoje é sexta ou quinta. Pula fim de semana.
//
// Formato de saída: "quinta 10h, sexta 14h ou segunda 15h"

export function gerar3Horarios(hoje: Date = new Date()): string {
  const diasNomes = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado']
  const horarios = ['10h', '14h', '15h']
  const dias: string[] = []
  let offset = 1
  while (dias.length < 3 && offset < 14) {
    const d = new Date(hoje.getTime())
    d.setDate(d.getDate() + offset)
    const dow = d.getDay()
    if (dow !== 0 && dow !== 6) {
      dias.push(`${diasNomes[dow]} ${horarios[dias.length]}`)
    }
    offset++
  }
  return `${dias[0]}, ${dias[1]} ou ${dias[2]}`
}

// ── Funções de abertura genérica (fallback quando lead não tem playbook custom)
// Estrutura nova (29/04/2026):
//   1. Saudação cirúrgica (informal "ei" / formal "doutor, boa noite")
//   2. Verbo rotacionado + observação real (não SEMPRE "Vi que...")
//   3. Conector de convite antes da pergunta ("queria te perguntar...")
//   4. Pergunta direta com texto humanizado (não só impositiva)

export function gerarMensagemLP(nome: string, especialidade: string): string {
  const sd = saudacao(nome, especialidade)
  const v = pickVerbo(nome)
  return `${sd}

${v} tu atende ${especialidade} aqui em Palmas
queria te perguntar uma coisa rápida: quem pesquisa "${especialidade} em Palmas" no Google hoje, te acha direto ou cai em concorrente?`
}

export function gerarMensagemShopify(nome: string, categoria: string): string {
  const sd = saudacao(nome, categoria)
  const v = pickVerbo(nome)
  return `${sd}

${v} tu tem uma ${categoria} aqui em Palmas
se tu puder me dizer rapidinho — cliente nova que abre teu Insta consegue comprar direto, ou precisa mandar mensagem e esperar resposta?`
}

export function gerarMensagemAgendaPRO(nome: string, categoria: string): string {
  const sd = saudacao(nome, categoria)
  const v = pickVerbo(nome)
  return `${sd}

${v} tu atende com hora marcada aqui em Palmas (${categoria})
deixa eu te perguntar uma coisa: hoje tu organiza a agenda na mão pelo WhatsApp, ou tem sistema que cliente marca sozinho?`
}

// ── Script de abordagem WhatsApp (4 mensagens em sequência) ──────────────────
// Padrão validado em 14/04/2026 — nunca disparar tudo junto, uma de cada vez

export type ScriptAbordagem = {
  abertura:                 string                    // msg 1 — abertura genérica (substituída por aberturas customizadas em disparo-analises pros 14 priorizados)
  diagnosticos:             [string, string, string]  // msg 2 — A/B/C rotação por hash do telefone
  pitch_se_so_ig:           string                    // msg 3A — se disser "só Instagram/indicação"
  pitch_se_tem_site:        string                    // msg 3B — se disser "tenho site/página" (1ª resposta, pede o link)
  pitch_se_tem_site_resposta?: string                 // msg 3B-cont — depois que ele manda o link, mensagem com diagnóstico
  fechamento:               string                    // msg 4 — 3 horários concretos + Risk-Mitigation
  call_alinhamento?:        string                    // arma de fechamento pra lead com objeção
}

export function scriptAbordagemLP(nome: string, especialidade: string): ScriptAbordagem {
  const esp = especialidade.toLowerCase()
  return {
    abertura: gerarMensagemLP(nome, especialidade),
    diagnosticos: [
      // A — Espelho: mostra o buraco no Google
      `Posso te perguntar uma coisa?\n\nAgora, se alguém digitar "${especialidade} em Palmas" no Google, você aparece?\n\nOu só seu Insta, que o Google nem indexa direito?`,
      // B — Indicação vs Google (calibrated question OURO)
      `Último cliente novo que apareceu — veio de indicação, ou foi alguém que te achou sozinho pesquisando?\n\nPergunto porque a diferença aí é tudo.`,
      // C — Autoridade: a dor é a DÚVIDA do cliente, não a competência do lead
      `Quando o cliente pede "me manda seu site", o que você responde hoje?\n\nPergunto porque pra ${esp} com tua autoridade, o cliente já decidiu que quer — só falta o link pra confirmar. Sem isso, dúvida cresce e ele desiste no caminho.`,
    ],
    // PITCH curto (CORE_SYSTEM_V2): conectar com dor → solução → preço → CTA
    pitch_se_so_ig: `pelo que você falou, hoje quem te procura no Google não te acha
eu resolvo isso com uma página simples que já começa a trazer cliente
começa em R$499 e entrego em 7 dias
quer ver um exemplo no teu caso?`,
    pitch_se_tem_site: `se já tem, manda o link que dou uma olhada rápida — só pra entender o ponto de partida`,
    pitch_se_tem_site_resposta: `vi aqui — deixa eu olhar com calma 2-3 min e te volto com 3 pontos específicos que tão segurando o teu
posso te mostrar também como ficaria mais limpo — topa?`,
    // FECHAMENTO curto + 3 horários (Risk-Mitigation Klaff) — horários gerados dinamicamente
    fechamento: `em 20 min eu te mostro o protótipo da TUA LP rodando — não é mockup, é Next.js no ar
qual horário fecha: ${gerar3Horarios()}?`,
    call_alinhamento: `antes da gente fechar, tem uma etapa: call de alinhamento de 20min
não é pitch — é briefing pra LP sair com a TUA cara, não genérica
você sai da call com protótipo funcional rodando — é o que me garante entregar na qualidade que prometo`,
  }
}

export function scriptAbordagemShopify(nome: string, categoria: string): ScriptAbordagem {
  return {
    abertura: gerarMensagemShopify(nome, categoria),
    diagnosticos: [
      // A — concorrência fora vence local
      `cliente de Palmas que quer receber hoje
compra de ti ou compra de loja de SP que entrega aqui?`,
      // B — gargalo WhatsApp+PIX
      `quando cai pedido, é tudo no WhatsApp na mão? frete, pix, confirmação?
quanto tempo isso come por semana?`,
      // C — madrugada/domingo
      `sábado à noite, domingo de manhã — cliente vê produto e quer comprar
tu tá pra responder ou o pedido some até segunda?`,
    ],
    // PITCH curto (CORE_SYSTEM_V2)
    pitch_se_so_ig: `pelo que você falou, hoje toda venda depende de conversa no direct
a loja resolve isso e o cliente compra sozinho
começa em R$599 com Mercado Pago, frete e motoboy Palmas integrados
quer ver como ficaria no teu caso?`,
    pitch_se_tem_site: `se já tem, manda o link que dou uma olhada rápida — só pra entender o ponto de partida`,
    pitch_se_tem_site_resposta: `vi aqui — deixa eu olhar com calma 2-3 min e te volto com 3 pontos específicos que tão segurando a tua
posso te mostrar também como ficaria mais limpo — topa?`,
    fechamento: `em 20 min eu te mostro o protótipo da TUA loja rodando — não é mockup, é Shopify no ar
qual horário fecha: ${gerar3Horarios()}?`,
    call_alinhamento: `antes da gente fechar, tem uma etapa: call de alinhamento de 30min
é diagnóstico operacional — motoboy, Mercado Pago, frete grátis, fornecedores
você sai da call com a loja alinhada pra rodar — é o que me garante entregar a estrutura certa`,
  }
}

export function scriptAbordagemAgendaPRO(nome: string, categoria: string): ScriptAbordagem {
  return {
    abertura: gerarMensagemAgendaPRO(nome, categoria),
    diagnosticos: [
      // A — gargalo marcação + comissão
      `como funciona a agenda aí — cliente marca pelo WhatsApp ou tem sistema?
e no fim do mês, vê quanto cada profissional te deve de comissão ou ainda faz na mão?`,
      // B — buraco cancelamento
      `quando alguém cancela em cima da hora, o que acontece?
fica buraco na agenda ou tu preenche rápido?`,
      // C — financeiro tempo real
      `tu vê em tempo real quanto cada cadeira faturou no dia
ou financeiro só fecha no fim do mês em planilha?`,
    ],
    pitch_se_so_ig: `pelo que você falou, hoje você ainda organiza tudo na mão
isso aqui automatiza e o cliente agenda sozinho
fica R$67/mês (ou R$97 com equipe até 5)
os 10 primeiros entram sem setup de R$197 — quer testar?`,
    pitch_se_tem_site: `tu já tem sistema de agendamento ou cliente ainda marca no WhatsApp?
e o financeiro — vê quanto cada profissional te deve em tempo real?`,
    fechamento: `em 15 min eu te mostro a SmartAgenda configurada pro TEU caso — tu testa como cliente, vê dashboard, vê cancelamento
qual horário fecha: ${gerar3Horarios()}?`,
  }
}

// ── Roteador de ofertas ──────────────────────────────────────────────────────

export type TipoOferta = 'lp-solo' | 'agendapro-solo' | 'combo' | 'shopify-solo'

const CATEGORIAS_PURO_AGENDA = [
  'barbearia', 'salão de beleza', 'salao de beleza',
  'clínica estética', 'clinica estetica',
  'estúdio de tatuagem', 'estudio de tatuagem',
  'massoterapeuta', 'depilação', 'depilacao',
  'cabeleireiro',
]

const CATEGORIAS_COMBO = [
  'nutricionista', 'personal trainer', 'psicólogo', 'psicologo',
  'fisioterapeuta', 'dentista', 'maquiadora', 'fotógrafo', 'fotografo',
  'nail designer', 'sobrancelha', 'designer de sobrancelhas',
  'médico esteta', 'medico esteta', 'esteticista',
  'fonoaudiólogo', 'fonoaudiologo', 'terapeuta',
]

// Categorias que casam com Shopify (FIT estrito após calibração 25/04)
// Cuidado: ordem importa, MATCH usa includes() (parcial). Termos amplos
// como 'loja' não entram aqui — vão pra LP por default.
const CATEGORIAS_SHOPIFY_MATCH = [
  // Moda (foto vende, ticket >R$80, vende pra fora)
  'moda feminina', 'moda masculina', 'moda fitness', 'moda festa', 'moda praia',
  'loja de roupa', 'loja de roupas',         // singular + plural
  'loja de calçado', 'loja de calçados',     // singular + plural
  'loja de calcado', 'loja de calcados',     // sem cedilha
  'loja de acessório', 'loja de acessórios', // singular + plural
  'loja de acessorio', 'loja de acessorios', // sem acento
  'loja de vestido', 'loja de vestidos',     // singular + plural
  'loja de moda', 'atacado de moda', 'atacado de roupa',
  'lingerie', 'boutique',
  // Joias
  'joalheria', 'joalherias',
  'semi-joia', 'semi-joias', 'semi joia', 'semi joias', 'semijoia', 'semijoias',
  // Saúde/beleza (produto físico)
  'loja de suplemento', 'loja de suplementos', 'suplemento',
  'whey protein',
  'perfumaria', 'perfumarias',
  'cosmético', 'cosméticos', 'cosmetico', 'cosmeticos',
  'skincare', 'maquiagem',
  // Esportivo (Copa timing)
  'loja de artigo esportivo', 'loja de artigos esportivos',
  'artigos esportivos', 'artigo esportivo',
  'camisa de time', 'camisas de time',
  // Nicho
  'loja de artesanato', 'artesanato',
]

// Categorias EXPLICITAMENTE NÃO-FIT pra Shopify — mesmo que apareçam no
// scrape, NÃO entram no funil. Auditoria 25/04 confirmou: tiro perdido.
const CATEGORIAS_NAO_FIT = [
  'papelaria',
  'pet shop', 'petshop',
  'açaí', 'acai', 'sorveteria',
  'café', 'cafe', 'lanchonete',
  'floricultora', 'floricultura', 'floricultor',
  'empório', 'emporio', 'mercado', 'mercadinho',
  'material de construção', 'material de construcao',
  'confeitaria', 'doceria',
  'loja de bebida', 'distribuidora de bebida',
]

export function detectarTipoOferta(categoria: string): TipoOferta {
  const cat = categoria.toLowerCase()

  // Filtro NÃO-FIT primeiro — categorias descartadas em auditoria 25/04
  // (papelaria, açaí, café, floricultora, etc) ainda recebem 'lp-solo'
  // como fallback técnico, mas top-20-perfeitos.ts vai filtrar elas.
  // (Não retornamos 'no-fit' como tipo pra não quebrar contratos
  // existentes — quem usa a função espera um TipoOferta válido.)

  if (CATEGORIAS_SHOPIFY_MATCH.some(c => cat.includes(c))) return 'shopify-solo'

  // AgendaPRO fora do foco de prospecção atual: tudo que não é
  // loja/produto físico vira LP. CATEGORIAS_PURO_AGENDA e CATEGORIAS_COMBO
  // seguem exportadas pra uso em outras telas, mas não roteiam mais.
  return 'lp-solo'
}

// Helper: lead deve ser ignorado na prospecção?
// Usado por scripts/top-20-perfeitos.ts pra filtrar antes de listar.
export function categoriaEhNaoFit(categoria: string): boolean {
  const cat = (categoria ?? '').toLowerCase()
  return CATEGORIAS_NAO_FIT.some(c => cat.includes(c))
}

// Oferta combo — setup AgendaPRO GRÁTIS como gancho da LP
// Só vale pros 10 primeiros que fecham LP com a Impulso (promoção sazonal)
export function scriptAbordagemCombo(nome: string, categoria: string): ScriptAbordagem {
  const esp = categoria.toLowerCase()
  return {
    abertura: gerarMensagemLP(nome, categoria),
    diagnosticos: [
      // A — Google + agenda
      `duas coisas rápidas:
quem pesquisa "${esp} em Palmas" no Google — te acha ou cai no concorrente?
e cliente novo — marca pelo WhatsApp ou tem sistema?`,
      // B — indicação + gargalo
      `último cliente novo veio de indicação ou te achou no Google?
e pra marcar horário, é tudo pelo WhatsApp ainda?`,
      // C — site + agenda
      `quando cliente pede "me manda teu site pra ver horários", o que tu responde?
responde cada horário na mão ou tem link onde ele marca sozinho?`,
    ],
    pitch_se_so_ig: `pelo que você falou, são duas dores juntas — Google e agenda
LP que aparece no Google + SmartAgenda que cliente marca sozinho. trabalham juntas
LP a partir de R$499 + SmartAgenda R$67/mês (ou R$97 equipe). os 10 primeiros entram sem setup de R$197
topa ver os dois rodando antes de decidir?`,
    pitch_se_tem_site: `se já tem, manda o link que dou uma olhada — só pra entender o ponto de partida
e pra agenda — tem sistema onde cliente marca sozinho ou ainda é WhatsApp?`,
    fechamento: `em 20 min eu te mostro a TUA LP no ar + SmartAgenda configurada — tu vê os dois funcionando antes de decidir
qual horário fecha: ${gerar3Horarios()}?`,
    call_alinhamento: `antes da gente fechar, tem uma etapa: call de alinhamento
não é pitch — é briefing pra projeto sair com a TUA cara, não genérico
é o que me garante entregar com a qualidade que prometo`,
  }
}

// Roteador — olha a categoria do lead e devolve o script com a oferta certa
export function escolherScriptAbordagem(params: {
  nome: string
  categoria: string
}): { tipo: TipoOferta; script: ScriptAbordagem } {
  const tipo = detectarTipoOferta(params.categoria)
  switch (tipo) {
    case 'shopify-solo':
      return { tipo, script: scriptAbordagemShopify(params.nome, params.categoria) }
    case 'combo':
    case 'agendapro-solo':
    case 'lp-solo':
    default:
      return { tipo: 'lp-solo', script: scriptAbordagemLP(params.nome, params.categoria) }
  }
}

// Distribui os 3 diagnósticos 33/33/33 por hash do telefone (determinístico)
// Mesmo lead cai sempre na mesma variante — permite A/B/C tracking real
export function pickDiagnostico(
  script: ScriptAbordagem,
  telefone: string | null,
): { texto: string; variante: 'A' | 'B' | 'C' } {
  const digits = (telefone ?? '').replace(/\D/g, '')
  const hash = digits.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) || 1
  const idx = hash % 3
  return {
    texto: script.diagnosticos[idx],
    variante: (['A', 'B', 'C'] as const)[idx],
  }
}

// ── Objeções universais — framework LAER (Listen-Acknowledge-Empathize-Respond)
// Calibrado 25/04/2026 com base em pesquisa de objection handling 2025

export type ObjecaoCalibrada = {
  contexto: string                // quando essa objeção tipicamente aparece
  nota_interna: string            // o que Eduardo deve fazer ANTES de responder (instrução privada)
  acknowledge_label: string       // mirror + label (Voss tactical empathy) — frase calibrada de validação
  resposta: string                // resposta pronta pra mandar no WhatsApp depois do label
}

export const OBJECOES_IMPULSO: Record<string, ObjecaoCalibrada> = {
  ja_tenho_instagram: {
    contexto: 'Lead diz que vende/atende pelo Insta e não precisa de site',
    nota_interna: 'NÃO ataca o Insta. Reconhece que funciona pra quem já segue. Reframe: site capta cliente NOVO que NUNCA ouviu falar.',
    acknowledge_label: 'faz sentido — Insta capta quem já te conhece',
    resposta: `mas e quem pesquisa "[especialidade] em Palmas" no Google agora e nunca ouviu falar?
são dois funis diferentes — Insta + site soma, não substitui`,
  },
  quanto_custa: {
    contexto: 'Lead pediu o preço diretamente',
    nota_interna: 'NUNCA esconda preço. Mas NUNCA crave valor fixo — Eduardo precisa avaliar complexidade na call. "A partir de" + ancoragem real R$2k-15k mercado nacional + chamar pra call.',
    acknowledge_label: 'vamo direto',
    resposta: `a partir de R$499 — depende da complexidade
mercado nacional cobra R$2-15k. eu tô abaixo porque sou de Palmas, sem overhead
em 20min de call te falo o número exato — topa?`,
  },
  vou_pensar: {
    contexto: 'Lead recuou após pitch — sinal de objeção escondida',
    nota_interna: 'NÃO pressiona. Pergunta calibrada que descobre o que ele precisa pensar.',
    acknowledge_label: 'tranquilo, decisão de site não é impulso',
    resposta: `o que tu precisa pensar — preço, prazo, escopo ou ver mais um case?
pergunto pra te mandar a coisa certa, não te encher`,
  },
  sem_dinheiro: {
    contexto: 'Lead diz que tá apertado financeiramente',
    nota_interna: 'NÃO insiste. Respeita. Mas mantém porta aberta pra retomar.',
    acknowledge_label: 'tranquilo, esse não é o momento',
    resposta: `fica com meu contato — quando virar prioridade, me chama
sem pitch`,
  },
  ja_tentei_antes: {
    contexto: 'Lead já tentou site/agência antes e não deu certo',
    nota_interna: 'NÃO defenda. NUNCA diga "comigo é diferente". Mirror + investigar o que aconteceu antes.',
    acknowledge_label: 'já tentou e não rolou — qual foi o caso específico?',
    resposta: `me conta: quem fez, o que entregaram, onde travou?
maioria que diz isso testou agência genérica que não entendeu o nicho — se for o teu caso, te mostro como evito esse buraco`,
  },
  preciso_falar_com_socio: {
    contexto: 'Decisão envolve outra pessoa (sócio, marido/esposa, gestor)',
    nota_interna: 'Decisão multi-stakeholder = Consensus-Based Close. Facilita reunião com os 2.',
    acknowledge_label: 'faz sentido, decisão de R$500+ não fecha solo',
    resposta: `posso te apresentar a proposta em 20min com vocês 2 juntos
quinta 15h, sexta 14h ou segunda 10h?`,
  },
  agora_nao_da_tempo: {
    contexto: 'Lead alega que tá ocupado / não é hora',
    nota_interna: 'Calibrated question pra descobrir o REAL motivo.',
    acknowledge_label: 'entendi, fase apertada',
    resposta: `quando tu acha que faria sentido conversar de novo?
pergunto pra te chamar no momento certo, sem desperdiçar tempo`,
  },
}

// ── Follow-up timeline (cadência D+3 / D+7 / D+30) ───────────────────────────
// Os follow-ups específicos por lead estão em lib/disparo-analises.ts
// Esses aqui são templates GENÉRICOS pra leads SEM análise customizada

export const FOLLOWUP_TIMELINE = [
  { dia: 3,  mensagem: 'uma coisa que vejo aqui em Palmas\nquem aparece no Google leva o cliente — hoje tá assim contigo?' },
  { dia: 7,  mensagem: 'vou parar por aqui pra não encher\nse fizer sentido depois, me chama' },
  { dia: 30, mensagem: '[reabordagem após mute de 30 dias — usar trigger event ou novidade real]' },
]

// Link direto pro WhatsApp com mensagem pré-preenchida
export function gerarLinkWhatsApp(telefone: string | null, mensagem: string): string {
  if (!telefone) return ''
  const numero = telefone.replace(/\D/g, '')
  if (!numero) return ''
  const numeroCompleto = numero.startsWith('55') ? numero : `55${numero}`
  const mensagemEncoded = encodeURIComponent(mensagem)
  return `https://wa.me/${numeroCompleto}?text=${mensagemEncoded}`
}

// Link direto pro Instagram (handle sem @)
export function gerarLinkInstagram(handle: string): string {
  const username = handle.replace(/^@/, '').trim()
  return `https://instagram.com/${username}`
}

// Link direto pra abrir conversa de DM no Instagram
// Usa ig.me/m/{handle} — atalho oficial Meta que abre direto a conversa
// (mobile e web). Mais confiável que /direct/new/ que foi depreciado.
export function gerarLinkDmInsta(handle: string | null): string {
  if (!handle) return ''
  const username = handle.replace(/^@/, '').trim()
  if (!username) return ''
  return `https://ig.me/m/${username}`
}

// Adapta a Msg 1 (escrita pra WhatsApp formal) pra tom DM Insta
// (mais casual, sem auto-identificação porque o handle já te identifica
// + saudação mais leve).
export function adaptarMensagemDm(msgWhatsapp: string): string {
  let dm = msgWhatsapp
  // Remove identificação formal Eduardo/Impulso (handle já identifica no Insta)
  dm = dm.replace(/^Oi[^,!?]*[,!]?\s*beleza\?\s*Eduardo aqui,?\s*Impulso Digital,?\s*sou de Palmas\.\s*/i, 'Oi! ')
  dm = dm.replace(/^Oi[^,!?]*[,!]?\s*Eduardo aqui,?\s*Impulso Digital,?\s*sou de Palmas\.\s*/i, 'Oi! ')
  dm = dm.replace(/^Oi[^,!?]*[,!]?\s*beleza\?\s*Eduardo aqui,?\s*Impulso Digital,?\s*falo de Palmas\.\s*/i, 'Oi! ')
  // Limpa quebras de linha duplas no início
  dm = dm.replace(/^\s*\n+/, '').trim()
  return dm
}

// Categorias para LP — profissionais liberais com cliente que PESQUISA antes
// Calibração FIT 25/04/2026: tirei serviços de baixa autoridade (Coach,
// Professor, Personal organizer) — quem fecha LP precisa ter reputação
// construída + cliente pesquisa antes de marcar.
export const CATEGORIAS_LP = [
  // Saúde mental e corporal — paciente pesquisa autoridade antes
  'Nutricionista', 'Psicólogo', 'Fisioterapeuta', 'Fonoaudiólogo',
  'Terapeuta', 'Médico esteta', 'Dentista', 'Podólogo',
  // Estética — nicho injetáveis (Erlane case) é prioridade alta
  'Esteticista', 'Biomédica esteta', 'Designer de sobrancelhas',
  // Especialistas com ticket alto
  'Personal trainer', 'Advogado', 'Arquiteto',
  'Designer de interiores', 'Fotógrafo casamento',
]

// Categorias para Shopify — produto físico que CABE foto + ticket >R$80
// + vende pra fora OU motoboy mesmo dia FAZ DIFERENÇA
//
// Calibração FIT 25/04/2026: tirei papelaria/açaí/café/empório/floricultora
// (negócios LOCAIS sem dor de e-commerce real). Tirei pet shop também
// (cliente vai presencial toda semana). Adicionei nichos quentes.
export const CATEGORIAS_SHOPIFY = [
  // Moda — alta probabilidade, foto vende
  'Loja de roupas', 'Loja de calçados', 'Loja de acessórios',
  'Moda feminina', 'Moda masculina', 'Moda fitness',
  'Moda festa', 'Moda praia', 'Lingerie', 'Boutique',
  // Joias — ticket alto + decisão visual
  'Joalheria', 'Semi-joias',
  // Saúde & Beleza com produto físico
  'Loja de suplementos', 'Perfumaria importada', 'Loja de cosméticos',
  'Skincare', 'Loja de maquiagem',
  // Esportivo — Copa 2026 timing
  'Loja de artigos esportivos', 'Camisa de time',
  // Nicho com ticket ou venda pra fora
  'Loja de artesanato',
]

// Categorias DESCARTADAS (NÃO fit) — não prospectar, não vale tempo
// Mantém aqui pra documentar a decisão e justificar pra quem pergunta
export const CATEGORIAS_NAO_FIT_SHOPIFY = [
  'Papelaria',          // cliente local, ticket baixo
  'Pet shop',           // cliente recorrente presencial (ração)
  'Açaí',               // venda na hora, sem catálogo
  'Sorveteria',         // mesmo problema
  'Café', 'Lanchonete', // venda urgente, sem ticket
  'Floricultora',       // já tem WhatsApp + delivery próprio
  'Empório', 'Mercado', // cliente compra perto de casa
  'Material de construção', // volume + B2B
  'Confeitaria',        // sob encomenda WhatsApp já funciona
  'Loja de bebida',     // restrição legal
]

// Queries para o Google Maps — LP
export const QUERIES_GMAPS_LP = [
  'nutricionista Palmas TO', 'personal trainer Palmas TO',
  'psicólogo Palmas TO', 'fisioterapeuta Palmas TO',
  'dentista estético Palmas TO', 'médico esteta Palmas TO',
  'esteticista Palmas TO', 'fotógrafo Palmas TO',
  'coach Palmas TO', 'maquiadora Palmas TO',
]

// Queries para o Google Maps — Shopify
export const QUERIES_GMAPS_SHOPIFY = [
  'loja de roupas Palmas TO', 'loja de calçados Palmas TO',
  'confeitaria Palmas TO', 'loja de suplementos Palmas TO',
  'pet shop Palmas TO', 'papelaria Palmas TO',
  'joalheria Palmas TO', 'loja de cosméticos Palmas TO',
  'açaí Palmas TO', 'loja de acessórios Palmas TO',
]

// Hashtags Instagram — LP
export const HASHTAGS_INSTAGRAM_LP = [
  'nutricionistapalmas', 'personaltrainerpalmas',
  'psicologopalmas', 'fisioterapeutapalmas',
  'estetistapalmas', 'fotografopalmas',
  'maquiadorapalmas', 'naildesignerpalmas',
  'coachpalmas', 'dentistapalmas',
]

// Hashtags Instagram — Shopify
export const HASHTAGS_INSTAGRAM_SHOPIFY = [
  'modapalmas', 'lojapalmas',
  'confeitariapalmas', 'suplementospalmas',
  'roupaspalmas', 'calcadospalmas',
  'docespalmas', 'petshoppalmas',
  'papelariapamas', 'joiaspalmas',
]

// Categorias para AgendaPRO
export const CATEGORIAS_AGENDAPRO = [
  'Barbearia', 'Salão de beleza', 'Nail designer',
  'Clínica estética', 'Estúdio de tatuagem',
  'Psicólogo', 'Personal trainer', 'Fisioterapeuta',
  'Nutricionista', 'Dentista', 'Massoterapeuta',
  'Depilação', 'Sobrancelha', 'Maquiadora', 'Fotógrafo',
]

// Queries Google Maps — AgendaPRO
export const QUERIES_GMAPS_AGENDAPRO = [
  'barbearia Palmas TO', 'salão de beleza Palmas TO',
  'nail designer Palmas TO', 'clínica estética Palmas TO',
  'estúdio de tatuagem Palmas TO', 'psicólogo Palmas TO',
  'personal trainer Palmas TO', 'fisioterapeuta Palmas TO',
  'massoterapeuta Palmas TO', 'depilação Palmas TO',
]

// Hashtags Instagram — AgendaPRO
export const HASHTAGS_INSTAGRAM_AGENDAPRO = [
  'barbeariapalmas', 'salaodebelezapalmas', 'nailpalmas',
  'esteticapalmas', 'tatuagempalmas', 'psicologopalmas',
  'personalpalmas', 'fisiopalmas', 'massagempalmas', 'depilacaopalmas',
]
