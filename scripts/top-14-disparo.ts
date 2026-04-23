// Playbook de disparo — 14 leads priorizados (7 LP + 7 Shopify) com análise
// cirúrgica feita no Claude (hardcoded). Puxa do banco, filtra, ranqueia por
// tier A/B/C (aposta forte, provável, red flag) e gera markdown pronto pra
// disparo manual no WhatsApp com link wa.me pré-preenchido por lead.
//
// Uso: `npx tsx scripts/top-14-disparo.ts`
// Saída: top-14-disparo.md na raiz do projeto.
//
// Análise é hardcoded neste arquivo (ANALISES, indexada por lead id). Pra
// atualizar análise de um lead, edita aqui — NÃO usa mais Gemini em lote
// (cota FREE 20/dia estourava fácil em rajadas de 14).

import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { writeFileSync } from 'fs'
import { getClient } from '../lib/db'
import {
  detectarTipoOferta,
  escolherScriptAbordagem,
  pickDiagnostico,
  gerarLinkWhatsApp,
} from '../lib/mensagens'

type Row = {
  id: number
  nome: string
  categoria: string
  telefone: string
  instagram: string | null
  instagram_url: string | null
  instagram_bio: string | null
  site: string | null
  nota: number | null
  num_avaliacoes: number | null
  tem_site: number
  tem_agendamento: number
  tipo: string
  status: string
}

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

// Análise cirúrgica por lead — feita no Claude 23/04. Chave = id no banco.
const ANALISES: Record<number, Analise> = {
  // ── TIER A — 6 apostas fortes ──────────────────────────────────────────

  55: {
    tier: 'A',
    posicao_no_tier: 1,
    dor: 'Psicólogo em Palmas compete por confiança. Paciente que busca "psicólogo Palmas" no Google hoje encontra o Gilson no Maps, mas clica e vê só endereço e telefone — zero contexto, zero cara, zero abordagem. Insta não transmite sigilo/seriedade do consultório. 4.9 com 135 avaliações prova autoridade, mas ele não está capitalizando esse ativo.',
    gancho: 'LP dedicada mostra linha de abordagem, especialidades, primeira consulta, FAQ ("sigilo é garantido?", "atende online?"). O "aparece no Google quando alguém pesquisa psicólogo em Palmas" é literal — Gilson já tem a reputação pra estourar SEO local.',
    objecao: 'Psicólogo tem escrúpulo com marketing agressivo. Provável: "não quero algo que pareça venda".',
    resposta_objecao: 'LP sóbria (paleta clara, foto profissional, linguagem ética), sem copy agressiva — a autoridade dos 135 avaliações 4.9 fala por si. Mostra o case Gilson Afonso na pasta de trabalhos depois (virou prova social).',
    abertura: `Olá Gilson, tudo bem?

Vi seu consultório no Google — 4.9 com 135 avaliações é muita coisa, é claramente o maior ativo digital que você tem hoje.

Só que quando alguém pesquisa "psicólogo Palmas" e te acha, cai no Maps sem site. Posso te perguntar uma coisa rápida sobre isso?`,
    razao_ranking: 'Autônomo (decide sozinho), ticket alto (R$150-250/sessão), 135 avaliações = reputação já construída (não precisa provar nada), dor de credibilidade digital é clássica do psicólogo. R$499 paga com 3 sessões.',
  },

  24: {
    tier: 'A',
    posicao_no_tier: 2,
    dor: 'Advocacia em Palmas: cliente pesquisa "advogado trabalhista Palmas" (ou família, ou previdenciário) ANTES de ligar. Se não tem site, cliente liga primeiro pro concorrente que tem. Nota 5 com 120 avaliações é escandalosa — Guilherme tá sentado numa mina de autoridade sem LP pra capturar essa intenção de busca.',
    gancho: 'LP de escritório de advocacia converte violento: áreas de atuação, foto do escritório, biografia, casos (sem expor cliente), FAQ ("quanto custa consulta?", "atende OAB-TO?"). SEO local + 3 artigos ("como entrar com ação trabalhista em Palmas", etc) = tráfego orgânico pra vida toda.',
    objecao: 'OAB tem regra contra marketing "chamativo". Provável: "não posso fazer propaganda de advogado".',
    resposta_objecao: 'Provimento 205/2021 da OAB permite LP informativa sem preço nem promessa de resultado. A LP segue direitinho: informação sóbria, áreas de atuação, formulário de contato. Não é captação agressiva, é presença digital regulamentar.',
    abertura: `Olá Guilherme, tudo bem?

Vi o escritório no Google — nota 5 com 120 avaliações é raríssimo na advocacia. Quando alguém pesquisa "advogado Palmas" e te acha, cai só no Maps, sem site.

Posso te perguntar uma coisa rápida sobre isso?`,
    razao_ranking: 'Decide sozinho, ticket cliente altíssimo (honorários 10%+ de causa), 120 reviews 5 = autoridade máxima. R$499 paga com 1/10 de um honorário. Objeção OAB é real mas contornável.',
  },

  146: {
    tier: 'A',
    posicao_no_tier: 3,
    dor: 'Perfumaria de importado em Palmas: a DOR é PROVA DE AUTENTICIDADE. Cliente que vai gastar R$400-800 num perfume importado quer site profissional, notas fiscais visíveis, política de troca, garantia. Vender perfume importado só pelo Instagram é assinar atestado de "pode ser falso". Nota 5 com 109 aval prova que os clientes já confiam — mas quem não conhece ainda, desconfia.',
    gancho: 'Shopify com checkout MP (parcelamento 12x) + cadastro organizado por marca (Dior, Carolina Herrera, Chanel, etc) + vitrine com estoque real + selo "Perfumaria autorizada" + entrega Palmas no dia. Ticket médio do setor é alto, Shopify paga com 1-2 vendas.',
    objecao: '"Já vendo bem pelo WhatsApp, pra que site?" — Don Parfum provavelmente já fatura bem.',
    resposta_objecao: 'Cliente NOVO que não te conhece não compra R$500 no WhatsApp de alguém que só tem Insta. Shopify = porta de entrada pra cliente novo. Os que já confiam continuam no WhatsApp se quiserem. Você dobra o funil.',
    abertura: `Olá, tudo bem? Vi a Don Parfum no Google — nota 5 com 109 avaliações, é claramente a perfumaria de importado mais forte de Palmas.

Queria te perguntar rápido: cliente novo, que nunca te comprou, como ele decide gastar R$500 num perfume sem nunca ter pisado na loja?

Pergunto porque é exatamente o gargalo que a gente resolve.`,
    razao_ranking: 'Ticket altíssimo (Shopify paga com UMA venda), dor de autenticidade é clássica de importado, 109 reviews 5 mostra base fiel mas sem capturar tráfego novo. Provável que dono seja executivo e reconheça o valor de um site.',
  },

  116: {
    tier: 'A',
    posicao_no_tier: 4,
    dor: 'Moda executiva feminina em Palmas: cliente é advogada, servidora pública concursada, executiva. Ticket médio alto (R$300-800 por peça). Essa cliente NÃO compra roupa de trabalho pelo WhatsApp — ela quer ver vitrine organizada, filtrar por tamanho, pagar no cartão corporativo, receber em casa. "Moda executiva" sem site é contraste: vende sofisticação num canal informal.',
    gancho: 'Shopify com filtro por tamanho + ocasião (trabalho, evento, reunião) + parcelamento 12x + retirada na loja OU entrega em casa. Tema da loja com paleta sóbria/premium. 20 produtos cadastrados no entregável já cobre a coleção atual.',
    objecao: '"Minha cliente é fiel, compra pessoalmente" — vai defender o relacionamento.',
    resposta_objecao: 'A cliente fiel continua indo na loja. O site capta a que TROCA de emprego, que MUDA pra Palmas, que viu a concorrente vendendo online e busca "moda executiva feminina Palmas". Hoje essa cliente nova não te acha.',
    abertura: `Olá Dely, tudo bem?

Vi a loja no Google — nota 5 com 63 avaliações em moda executiva feminina é posicionamento forte. Minha pergunta: a cliente que acabou de passar em concurso ou mudar pra Palmas, que busca "moda executiva Palmas" hoje — ela te acha online?

Porque se ela não te acha, quem acha é a concorrente.`,
    razao_ranking: 'Nicho posicionado (moda EXECUTIVA, não genérica), cliente de ticket alto, dona provavelmente mulher executiva que entende o valor de presença digital. Nota 5 com 63 avaliações = base sólida, não pequena.',
  },

  9: {
    tier: 'A',
    posicao_no_tier: 5,
    dor: 'Nutri autônoma em Palmas: cliente busca "nutricionista Palmas" no Google antes de agendar. Izabela tem Insta (@nutriizabelacampos), mas Insta não aparece no Google pra quem pesquisa. 5.0 com 63 avaliações = autoridade construída sem canal pra capturar tráfego frio.',
    gancho: 'LP de nutri converte: especialidades (emagrecimento, esportiva, nutrição clínica), "como funciona a primeira consulta", FAQ ("atende plano de saúde?", "faz online?"), formulário de agendamento. 3 artigos SEO tipo "nutricionista em Palmas com atendimento online" = tráfego orgânico.',
    objecao: '"Capto pelo Instagram, tá funcionando" — nutri jovem, fluente em mídia social.',
    resposta_objecao: 'Instagram capta quem já te segue. LP capta quem NUNCA ouviu falar de você. São dois funis diferentes. Link da bio do Insta aponta pra LP → converte quem veio do Insta também. Soma, não substitui.',
    abertura: `Olá Izabela, tudo bem?

Vi seu perfil — nota 5 com 63 avaliações é ótimo. Mas queria te perguntar: paciente novo, que não te conhece e nunca viu seu Insta, pesquisa "nutricionista em Palmas" no Google — você aparece?

Pergunto porque vejo muita nutri forte perder paciente só por esse buraco.`,
    razao_ranking: 'Autônoma decide sozinha, ticket médio ok (R$200-350/consulta), dor de SEO local é óbvia pra ela. 5.0 / 63 aval mostra que tem público fiel — o que falta é capturar o novo. R$499 paga com 2-3 pacientes.',
  },

  11: {
    tier: 'A',
    posicao_no_tier: 6,
    dor: 'NUTRI NEFRO — ou seja, nutricionista especializada em doença renal. Nicho raríssimo. Paciente renal busca desesperado por esse perfil (alimentação correta faz diferença entre diálise ou não). Não ter LP com "nutri nefro" escrito explícito é DEIXAR DINHEIRO NA MESA — SEO pra "nutricionista renal Palmas" deve ter concorrência zero.',
    gancho: 'LP + 3 artigos SEO ("dieta pra paciente com insuficiência renal", "nutri nefro em Palmas", "alimentação pré-diálise") = domínio absoluto dessa busca em Palmas e região.',
    objecao: 'IG é @draanacarolinaalmeida (nome próprio, não @nutrinefro-algo) — provável que o nicho nefro ainda não esteja no posicionamento público dela.',
    resposta_objecao: 'Exatamente por isso a LP resolve. Insta você não muda do dia pra noite sem perder público. LP você lança com o posicionamento nefro EXPLÍCITO. É sua chance de ocupar o nicho em Palmas antes de alguém chegar.',
    abertura: `Olá Dra. Allana, tudo bem?

Vi seu perfil — nutri nefro é um nicho raríssimo em Palmas, imagino a demanda que você tem. Queria te perguntar: paciente renal que pesquisa "nutri pra insuficiência renal em Palmas" hoje, ele te acha no Google?

Porque se não acha, ele cai em nutricionista genérico que não entende de nefro.`,
    razao_ranking: 'Nicho raro = concorrência zero em SEO = LP domina rápido. Cliente renal é recorrente (consulta mensal por anos) e paga qualquer preço. Nota 5 confirma que quem chega fica. R$499 paga com 2 pacientes novos.',
  },

  // ── TIER B — 6 prováveis com mais fricção ─────────────────────────────

  108: {
    tier: 'B',
    posicao_no_tier: 1,
    dor: 'Moda praia/fitness em Palmas: público jovem, compra online natural, competição com Shein/Amazon. Sem Shopify, a loja fica dependente de tráfego físico (Avenida JK) e WhatsApp. Biquíni e legging são COMPRA POR IMPULSO — precisa de vitrine visual forte + checkout rápido.',
    gancho: 'Shopify com vitrine por categoria (biquíni, fitness, saída de praia) + filtro por tamanho + parcelamento 12x + frete rápido Palmas. Tema visual forte tipo UrbanFeet (mostra o case).',
    objecao: '"Já vendo 200% pelo Insta" — moda praia funciona no Insta hoje.',
    resposta_objecao: 'Insta vende com atendente respondendo DM. Shopify vende enquanto você dorme. No Insta, cliente pergunta "tem tamanho M?", você responde, ela some. No Shopify, ela filtra sozinha, paga e você recebe o pedido pronto.',
    abertura: `Olá, tudo bem? Vi a Cia do Verão no Google — 4.9 com 73 avaliações em moda praia Palmas é forte.

Queria te perguntar rápido: quantas mensagens por dia você responde só com "tem esse tamanho?" ou "aceita cartão?" antes da cliente comprar?`,
    razao_ranking: 'Setor que vai muito bem no Shopify, nota alta, mas provavelmente já vende bem no Insta — precisa de argumento de ESCALA (automação), não de SEO (Insta atende).',
  },

  111: {
    tier: 'B',
    posicao_no_tier: 2,
    dor: 'Moda masculina em Palmas: homem compra online cada vez mais (menos vergonha que mulher pedindo opinião). 91 avaliações 4.6 é sólido mas não é estrela — espaço pra escalar. Nota 4.6 (não 5) pode indicar alguma insatisfação recorrente (atendimento, estoque) — Shopify com política de troca clara RESOLVE isso.',
    gancho: 'Shopify com filtro por ocasião (trabalho, casamento, casual) + tabela de medidas + política de troca visível + parcelamento. Cliente homem valoriza processo claro e rápido.',
    objecao: '"Meu público prefere provar antes de comprar" — clássico varejo físico.',
    resposta_objecao: 'Prova se quer, com retirada na loja (opção no Shopify). Quem não quer provar compra online com troca garantida. Dá pra ter os dois no mesmo sistema.',
    abertura: `Olá, tudo bem? Vi a San Remo no Google — 91 avaliações é base consolidada em Palmas.

Queria te perguntar: o cliente que NÃO mora na região da loja mas viu um look seu no Insta — como ele compra hoje? WhatsApp na mão?`,
    razao_ranking: 'Setor forte, loja consolidada (91 reviews), nota 4.6 indica espaço pra melhoria operacional. Moda masculina funciona muito bem online. Probabilidade média-alta.',
  },

  30: {
    tier: 'B',
    posicao_no_tier: 3,
    dor: 'Dentista com 144 avaliações 4.8 em Palmas. Paciente que busca "dentista implante Palmas", "dentista estético Palmas" precisa ver antes/depois, especialidades, equipe. Consultório sem site perde paciente pra concorrente com site mesmo tendo reputação inferior.',
    gancho: 'LP odontológica com galeria antes/depois, especialidades (clínico, estético, implante, ortodontia), equipe com CRO visível, horários de atendimento, convênios aceitos. 3 artigos SEO ("quanto custa implante em Palmas", etc).',
    objecao: '"Consultório tem gestor, eu atendo, decide ele/ela". Fricção de cadeia de decisão.',
    resposta_objecao: 'Posso te apresentar a LP em 20 min — você e o gestor juntos. Em 20 min vocês decidem. Se não fechar, saem com uma análise digital do consultório de graça.',
    abertura: `Olá, tudo bem? Vi o Palmas Bucal no Google — 4.8 com 144 avaliações é reputação sólida.

Queria te perguntar rápido: paciente que busca "dentista de confiança em Palmas" no Google, com site profissional + galeria antes/depois + equipe visível — ele clica em vocês ou no concorrente?`,
    razao_ranking: 'Reputação enorme (144 aval) mas clínica com gestão pode ter ciclo de decisão lento. Ticket alto (implante R$2-5k) justifica LP fácil.',
  },

  32: {
    tier: 'B',
    posicao_no_tier: 4,
    dor: 'Clínica focada em IMPLANTE. Ticket individual R$2-5k por implante. Paciente pesquisa muito antes de fechar ("clínica de implante confiável", "quanto custa implante Palmas", "implante com garantia"). Sem LP dedicada, perde pra concorrente com site.',
    gancho: 'LP específica de implante: antes/depois, explicação técnica (implante + coroa, cirurgia guiada), garantia, equipe com especialização em implantodontia, FAQ de preço. 3 artigos SEO ("implante dentário em Palmas: passo a passo e preço") = domínio de busca cara.',
    objecao: '"Já tenho muito paciente" — clínica consolidada.',
    resposta_objecao: '144 aval = paciente antigo. Mas o paciente que SÓ vai fazer implante uma vez na vida, que tá pesquisando agora em Palmas, ele te acha? Esse é o cliente novo de R$5k que você tá perdendo pro concorrente com site.',
    abertura: `Olá, tudo bem? Vi a Odonto Fama — 4.8 com 112 avaliações focada em implante é autoridade clara.

Pergunta objetiva: paciente novo que nunca te conheceu, pesquisa "implante dentário Palmas" no Google hoje — ele te acha, ou cai numa clínica menor com site?`,
    razao_ranking: 'Nicho (implante) + ticket altíssimo justifica LP, mas é clínica (decisão em grupo). Um pouco mais lento que consultório solo.',
  },

  17: {
    tier: 'B',
    posicao_no_tier: 5,
    dor: 'Parecido com Izabela, mas com detalhe: IG é @nutripridbarros (não @tatianesouza). Nome do IG ≠ nome do Google = confusão de branding. Isso pode ser ex-nome, co-autora ou parceria. Precisa investigar antes de disparar.',
    gancho: 'LP resolve exatamente isso — você centraliza o posicionamento. Seja qual for o nome profissional que você quer fortalecer, LP com domínio próprio = sua autoridade.',
    objecao: 'Possível confusão: "essa mensagem é pra quem?" — o prospecto pode não se reconhecer como "Tatiane" se ele se promove como "@nutripridbarros".',
    resposta_objecao: 'Investigar IG antes de disparar. Se @nutripridbarros for a marca principal, abordar como "nutri Pridbarros" em vez de "Tatiane".',
    abertura: `Olá, tudo bem?

Vi seu perfil no Google como Tatiane Souza (nutri) e no Instagram como @nutripridbarros — nota 5 com 63 avaliações.

Queria te perguntar: paciente novo pesquisa "nutricionista Palmas" e cai no Google, que te mostra só no Maps. Isso já te fez perder paciente que ficou confuso entre os dois nomes?`,
    razao_ranking: 'Nutri, bom ticket, mas ambiguidade de branding pode indicar lead confuso/em transição. Priorizar Izabela e Allana antes.',
  },

  148: {
    tier: 'B',
    posicao_no_tier: 6,
    dor: 'IG é @cheirodeamor_perfumaria (categoria no Google é "cosméticos" mas IG é "perfumaria") — provavelmente multimarcas perfumaria/cosméticos local. 63 aval 5.0 é base fiel. Cliente que busca marca específica ("onde comprar O Boticário em Palmas" — ou importado) precisa de vitrine organizada por marca.',
    gancho: 'Shopify com vitrine por marca + filtros por tipo (perfume, shampoo, maquiagem) + parcelamento 12x. Cadastro de 20 produtos cobre as principais marcas.',
    objecao: '"Revendedora de marca tem regra da matriz" — pode ter limitação comercial.',
    resposta_objecao: 'Shopify independente trata disso. Você vende multimarcas no seu próprio site, não o site da marca. Nada impede de listar O Boticário, Natura, importados, tudo junto — você é o ponto de venda.',
    abertura: `Olá, tudo bem? Vi a Cheiro de Amor no Google — 5 com 63 avaliações é sólido.

Queria te perguntar: cliente que quer comprar um perfume específico em Palmas, pesquisa a marca e o bairro — ele te acha como ponto de venda, ou cai direto no site da marca?`,
    razao_ranking: 'Ticket OK, mas precisa qualificar se é multimarcas ou revendedora (afeta se o Shopify faz sentido legal). Um nível abaixo de Don Parfum.',
  },

  // ── TIER C — 2 red flags, qualificar antes ────────────────────────────

  115: {
    tier: 'C',
    posicao_no_tier: 1,
    dor: 'Nota altíssima (4.8 com 161 aval — o MAIOR volume dos 14 shopify). MAS o Instagram cadastrado é @startpage — isso não parece Instagram oficial da loja, parece erro de cadastro ou captura errada do scraper. @startpage é conta genérica, provavelmente não é dela.',
    gancho: 'Se for lead verdadeiro: Shopify com catálogo por categoria (praia, fitness, casual), tamanhos, parcelamento. Mesma tese da Cia do Verão mas com mais volume.',
    objecao: 'Primeira coisa: "você mandou pra pessoa certa?" — se o Insta tá errado, o telefone pode estar errado também.',
    resposta_objecao: 'QUALIFICAR ANTES DE PITCH. Primeira msg: "Olá, é da Doxsen?" — confirma identidade. Se sim, segue com pitch normal. Se não, abandona.',
    abertura: `Olá, tudo bem? Aqui é o Eduardo da Impulso Digital.

Só pra confirmar — falo com a equipe da Doxsen (Moda Praia, Fitness e Casual), Avenida Palmas?

Perguntei porque vi vocês no Google com 161 avaliações (nota 4.8) mas o Instagram que tenho aqui parece errado.`,
    razao_ranking: 'Volume de avaliações alto mas Insta suspeito = dado sujo. Não investir tempo antes de confirmar identidade. Se confirmar = vira TIER A.',
  },

  153: {
    tier: 'C',
    posicao_no_tier: 2,
    dor: 'RACCO é marca nacional de cosméticos vendida via REVENDEDORA/consultora (MMN, tipo Avon/Natura). Essa "loja" provavelmente é uma consultora autorizada, não dona de negócio próprio. Revendedora não pode montar loja online própria — regra da matriz.',
    gancho: 'Possível ângulo: LP pessoal de consultora (NÃO Shopify com produtos Racco) mostrando "encontre sua consultora Racco em Palmas". Mas isso é LP, não Shopify — mudou a oferta.',
    objecao: 'Provável: "não posso, a Racco não deixa" ou "só posso vender via catálogo deles".',
    resposta_objecao: 'Concordar e reposicionar: LP pessoal de consultora (R$499) pra vender o SERVIÇO dela (atendimento, consultoria, visita domiciliar) — não o produto Racco. Isso a matriz permite. Foca em "pegue sua consultora de confiança", não em e-commerce.',
    abertura: `Olá, tudo bem? Vi a Racco Cosméticos no Google — 5 com 63 avaliações.

Antes de qualquer coisa, me conta: você é consultora autorizada Racco ou dona de um ponto físico independente? Pergunto porque a solução certa muda bastante.`,
    razao_ranking: 'Qualificação duvidosa (revendedora vs. dona). Shopify provavelmente não cabe legalmente. Requer mudar oferta pra LP pessoal. Não perder tempo até esclarecer modelo de negócio.',
  },
}

function resolverSite(r: Row): string {
  if (!r.site) return 'NÃO TEM'
  if (/google\.com\/maps/i.test(r.site)) return 'NÃO TEM (só Google Maps)'
  return r.site
}

function blocoLead(r: Row, a: Analise): string[] {
  const script = escolherScriptAbordagem({ nome: r.nome, categoria: r.categoria }).script
  const diag = pickDiagnostico(script, r.telefone)
  const link = gerarLinkWhatsApp(r.telefone, a.abertura)
  const oferta = detectarTipoOferta(r.categoria)

  const ig = r.instagram ? `@${r.instagram.replace(/^@/, '')}` : '—'
  const lines: string[] = []
  lines.push(`**Ficha:** ${r.categoria} · Google ${r.nota ?? '—'} (${r.num_avaliacoes ?? 0} aval) · IG ${ig} · Site: ${resolverSite(r)}`)
  lines.push(`**Telefone:** \`${r.telefone}\` · **Oferta:** \`${oferta}\``)
  lines.push('')
  lines.push(`**Dor real:** ${a.dor}`)
  lines.push('')
  lines.push(`**Gancho da oferta:** ${a.gancho}`)
  lines.push('')
  lines.push(`**Objeção esperada:** ${a.objecao}`)
  lines.push('')
  lines.push(`**Como responder:** ${a.resposta_objecao}`)
  lines.push('')
  lines.push(`**Razão do ranking:** ${a.razao_ranking}`)
  lines.push('')
  lines.push(`#### Msg 1 — Abertura cirúrgica`)
  lines.push('```')
  lines.push(a.abertura)
  lines.push('```')
  lines.push('')
  lines.push(`#### Msg 2 — Diagnóstico (variante ${diag.variante}, escolhida por hash do telefone)`)
  lines.push('```')
  lines.push(diag.texto)
  lines.push('```')
  lines.push('')
  lines.push(`#### Msg 3A — Pitch se "só tenho Instagram"`)
  lines.push('```')
  lines.push(script.pitch_se_so_ig)
  lines.push('```')
  lines.push('')
  lines.push(`#### Msg 3B — Pitch se "tenho site"`)
  lines.push('```')
  lines.push(script.pitch_se_tem_site)
  lines.push('```')
  lines.push('')
  lines.push(`#### Msg 4 — Fechamento`)
  lines.push('```')
  lines.push(script.fechamento)
  lines.push('```')
  if (script.call_alinhamento) {
    lines.push('')
    lines.push(`#### Arma de travamento — Call de alinhamento`)
    lines.push('```')
    lines.push(script.call_alinhamento)
    lines.push('```')
  }
  lines.push('')
  lines.push(`**→ Disparar no WhatsApp (abertura já pré-preenchida):** ${link}`)
  lines.push('')
  return lines
}

async function main() {
  const db = getClient()
  const res = await db.execute(
    `SELECT id, nome, categoria, telefone, instagram, instagram_url, instagram_bio,
            site, nota, num_avaliacoes, tem_site, tem_agendamento, tipo, status
       FROM leads
      WHERE status = 'novo'
        AND telefone IS NOT NULL AND telefone != ''
        AND (instagram IS NOT NULL AND instagram != '' OR instagram_url IS NOT NULL AND instagram_url != '')
      ORDER BY num_avaliacoes DESC NULLS LAST, nota DESC NULLS LAST`,
  )
  const rows = res.rows as unknown as Row[]
  console.error(`Total candidatos (novo + tel + IG): ${rows.length}`)

  const CATEGORIAS_GENERICAS = [
    'profissional liberal', 'comércio local', 'comercio local',
    'serviços locais', 'servicos locais', 'estabelecimento',
    'empresa', 'loja', 'serviço', 'servico',
  ]
  const filtrados = rows.filter(r => {
    const cat = (r.categoria ?? '').trim().toLowerCase()
    if (!cat) return false
    if (/^[\d().,\s-]+$/.test(cat)) return false
    if (CATEGORIAS_GENERICAS.includes(cat)) return false
    if (/\bshopping\b/.test((r.nome ?? '').toLowerCase())) return false
    return true
  })
  console.error(`Após filtro de categoria/nome: ${filtrados.length}`)

  // Seleciona 7 LP + 7 Shopify (mesma lógica do v1)
  const lp: Row[] = []
  const shopify: Row[] = []
  for (const r of filtrados) {
    const oferta = detectarTipoOferta(r.categoria ?? '')
    if (oferta === 'shopify-solo' && shopify.length < 7) shopify.push(r)
    else if (oferta === 'lp-solo' && lp.length < 7) lp.push(r)
    if (lp.length === 7 && shopify.length === 7) break
  }
  const todos = [...lp, ...shopify]

  // Alerta de cobertura: lead no top 14 sem análise ANALISES
  const semAnalise = todos.filter(r => !ANALISES[r.id])
  if (semAnalise.length > 0) {
    console.error(`\n⚠️  ${semAnalise.length} lead(s) sem análise hardcoded (o banco mudou?):`)
    for (const r of semAnalise) console.error(`   - id=${r.id} ${r.nome} (${r.categoria})`)
    console.error(`   Esses leads NÃO aparecerão no md. Editar ANALISES em scripts/top-14-disparo.ts.\n`)
  }

  const ranked = todos
    .filter(r => ANALISES[r.id])
    .sort((a, b) => {
      const A = ANALISES[a.id]
      const B = ANALISES[b.id]
      if (A.tier !== B.tier) return A.tier.localeCompare(B.tier)
      return A.posicao_no_tier - B.posicao_no_tier
    })

  const tierA = ranked.filter(r => ANALISES[r.id].tier === 'A')
  const tierB = ranked.filter(r => ANALISES[r.id].tier === 'B')
  const tierC = ranked.filter(r => ANALISES[r.id].tier === 'C')

  const out: string[] = []
  out.push(`# Playbook de ataque — 14 leads (2026-04-23)`)
  out.push('')
  out.push(`**Meta:** fechar no mínimo 2 dos 14 esta semana.`)
  out.push(`**Fonte:** análise cirúrgica hardcoded em \`scripts/top-14-disparo.ts\` (feita no Claude, plano MAX).`)
  out.push(`**Importante:** scraping IG ainda pendente — leads NÃO têm bio nem seguidores. Análise baseada em categoria, nota Google, volume de avaliações e nicho.`)
  out.push('')
  out.push(`## Ranking realista (ordem de ataque)`)
  out.push('')
  out.push(`**TIER A (${tierA.length}) — aposta forte, atacar primeiro:**`)
  tierA.forEach((r, i) => {
    const a = ANALISES[r.id]
    out.push(`${i + 1}. ${r.nome} — \`${detectarTipoOferta(r.categoria)}\` · ${r.nota} (${r.num_avaliacoes} aval). *${a.razao_ranking.split('.')[0]}.*`)
  })
  out.push('')
  out.push(`**TIER B (${tierB.length}) — prováveis, atacar depois:**`)
  tierB.forEach((r, i) => {
    const a = ANALISES[r.id]
    out.push(`${i + 1}. ${r.nome} — \`${detectarTipoOferta(r.categoria)}\` · ${r.nota} (${r.num_avaliacoes} aval). *${a.razao_ranking.split('.')[0]}.*`)
  })
  out.push('')
  out.push(`**TIER C (${tierC.length}) — red flag, qualificar antes:**`)
  tierC.forEach((r, i) => {
    const a = ANALISES[r.id]
    out.push(`${i + 1}. ${r.nome} — \`${detectarTipoOferta(r.categoria)}\` · ${r.nota} (${r.num_avaliacoes} aval). *${a.razao_ranking.split('.')[0]}.*`)
  })
  out.push('')
  out.push(`---`)
  out.push('')
  out.push(`## Oferta consolidada`)
  out.push('')
  out.push(`### LP (R$499)`)
  out.push(`- Valor de mercado empilhado: **R$2.500** (setup R$1.500 + SEO R$500 + mobile R$300 + WhatsApp R$200)`)
  out.push(`- Grátis: hospedagem **vitalícia** + 3 artigos SEO no blog`)
  out.push(`- Ancoragem: agência Palmas R$1.500-3.000 + mensalidade · Fiverr R$800-1.200 sem SEO/blog/hosting`)
  out.push(`- Preço: **R$499 uma vez** · Entrega 7 dias · Garantia 7 dias`)
  out.push(`- Call de alinhamento: 20 min, sai com **protótipo funcional Next.js no ar** (fecha 10× mais que mockup)`)
  out.push('')
  out.push(`### Shopify (R$599)`)
  out.push(`- Valor de mercado empilhado: **R$3.200** (setup R$1.500 + tema MPN R$1.000 + integrações R$400 + 20 produtos R$300)`)
  out.push(`- Grátis: Shopify $1/mês por 3 meses + lista de fornecedores + scripts prospecção + call de entrega gravada`)
  out.push(`- Ancoragem: agência Palmas R$1.500-4.000 + mensalidade · Fiverr R$1.200-2.000 sem tema/integrações/call`)
  out.push(`- Preço: **R$599 uma vez** · Entrega 7-10 dias`)
  out.push(`- Call de alinhamento: 30 min, **diagnóstico operacional ao vivo** (motoboy + MP + frete + fornecedores)`)
  out.push(`- Case vivo: Gabriel da GB Nutrition (personal trainer que virou loja automatizada)`)
  out.push('')
  out.push(`---`)
  out.push('')

  out.push(`## TIER A — Atacar primeiro (${tierA.length})`)
  out.push('')
  tierA.forEach((r, i) => {
    out.push(`### A${i + 1}. ${r.nome}`)
    out.push('')
    out.push(...blocoLead(r, ANALISES[r.id]))
    out.push(`---`)
    out.push('')
  })
  out.push(`## TIER B — Atacar depois (${tierB.length})`)
  out.push('')
  tierB.forEach((r, i) => {
    out.push(`### B${i + 1}. ${r.nome}`)
    out.push('')
    out.push(...blocoLead(r, ANALISES[r.id]))
    out.push(`---`)
    out.push('')
  })
  out.push(`## TIER C — Qualificar antes (${tierC.length})`)
  out.push('')
  tierC.forEach((r, i) => {
    out.push(`### C${i + 1}. ${r.nome}`)
    out.push('')
    out.push(...blocoLead(r, ANALISES[r.id]))
    out.push(`---`)
    out.push('')
  })

  const md = out.join('\n')
  const outPath = resolve(process.cwd(), 'top-14-disparo.md')
  writeFileSync(outPath, md, 'utf-8')
  console.error(`Playbook salvo em: ${outPath}`)
  console.error(`Tier A: ${tierA.length} · B: ${tierB.length} · C: ${tierC.length}`)
  console.error(`Tamanho: ${md.length.toLocaleString()} chars · ${md.split('\n').length} linhas`)
}

main().catch(e => { console.error(e); process.exit(1) })
