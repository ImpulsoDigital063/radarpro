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
    abertura: `Oi Gilson, beleza? Eduardo aqui da Impulso Digital, falo de Palmas.

Olha — vi teu consultório no Google. 4.9 com 135 avaliações em psicologia em Palmas é raro pra caramba, tu sabe disso.

Me parece que esse é hoje teu maior ativo digital. Mas quando paciente novo pesquisa "psicólogo Palmas" e cai em ti pelo Maps, ele vê endereço e telefone. Não te vê. Não vê tua linha de abordagem, não vê se tu atende online, não vê nada que faça ele bater o martelo de marcar.

Posso te perguntar uma coisa? Quantos pacientes mês passado tu acha que pesquisaram "psicólogo Palmas" e fecharam com outro só porque o outro tinha um site?`,
    razao_ranking: 'Autônomo (decide sozinho), ticket alto (R$150-250/sessão), 135 avaliações = reputação já construída (não precisa provar nada), dor de credibilidade digital é clássica do psicólogo. R$499 paga com 3 sessões.',
  },

  24: {
    tier: 'A',
    posicao_no_tier: 2,
    dor: 'Advocacia em Palmas: cliente pesquisa "advogado trabalhista Palmas" (ou família, ou previdenciário) ANTES de ligar. Se não tem site, cliente liga primeiro pro concorrente que tem. Nota 5 com 120 avaliações é escandalosa — Guilherme tá sentado numa mina de autoridade sem LP pra capturar essa intenção de busca.',
    gancho: 'LP de escritório de advocacia converte violento: áreas de atuação, foto do escritório, biografia, casos (sem expor cliente), FAQ ("quanto custa consulta?", "atende OAB-TO?"). SEO local + 3 artigos ("como entrar com ação trabalhista em Palmas", etc) = tráfego orgânico pra vida toda.',
    objecao: 'OAB tem regra contra marketing "chamativo". Provável: "não posso fazer propaganda de advogado".',
    resposta_objecao: 'Provimento 205/2021 da OAB permite LP informativa sem preço nem promessa de resultado. A LP segue direitinho: informação sóbria, áreas de atuação, formulário de contato. Não é captação agressiva, é presença digital regulamentar.',
    abertura: `Oi Guilherme, beleza? Eduardo aqui da Impulso Digital, sou de Palmas.

Olha — nota 5 com 120 avaliações em escritório de advocacia em Palmas é coisa rara. Tu construiu autoridade pesada aí.

Me parece que tu já sente que metade do cliente novo pesquisa "advogado [área] Palmas" antes de ligar. E quando cai em ti, vê só Maps. Sem áreas de atuação, sem teu rosto, sem nada que ele use pra escolher entre tu e o concorrente.

Como funciona hoje, quando chega um cliente novo que não veio por indicação?`,
    razao_ranking: 'Decide sozinho, ticket cliente altíssimo (honorários 10%+ de causa), 120 reviews 5 = autoridade máxima. R$499 paga com 1/10 de um honorário. Objeção OAB é real mas contornável.',
  },

  146: {
    tier: 'A',
    posicao_no_tier: 3,
    dor: 'Perfumaria de importado em Palmas: a DOR é PROVA DE AUTENTICIDADE. Cliente que vai gastar R$400-800 num perfume importado quer site profissional, notas fiscais visíveis, política de troca, garantia. Vender perfume importado só pelo Instagram é assinar atestado de "pode ser falso". Nota 5 com 109 aval prova que os clientes já confiam — mas quem não conhece ainda, desconfia.',
    gancho: 'Shopify com checkout MP (parcelamento 12x) + cadastro organizado por marca (Dior, Carolina Herrera, Chanel, etc) + vitrine com estoque real + selo "Perfumaria autorizada" + entrega Palmas no dia. Ticket médio do setor é alto, Shopify paga com 1-2 vendas.',
    objecao: '"Já vendo bem pelo WhatsApp, pra que site?" — Don Parfum provavelmente já fatura bem.',
    resposta_objecao: 'Cliente NOVO que não te conhece não compra R$500 no WhatsApp de alguém que só tem Insta. Shopify = porta de entrada pra cliente novo. Os que já confiam continuam no WhatsApp se quiserem. Você dobra o funil.',
    abertura: `Oi, tudo bem? Eduardo aqui da Impulso Digital, falo de Palmas.

Olha — vi a Don Parfum no Google. 5 com 109 avaliações em perfumaria de importado é muito forte aí em Palmas, parabéns.

Me parece que cliente que já te conhece e confia compra de boa pelo WhatsApp. Mas o cliente NOVO — aquele que nunca pisou aí, que tá com R$500 na mão pra gastar num perfume — esse não compra pelo WhatsApp de quem só tem Insta. Ele pesquisa, vê site, vê política de troca, vê foto da loja.

Tu já parou pra calcular quantas vendas de R$400-800 o cliente novo deixa de fazer só por não ter um lugar profissional pra comprar?`,
    razao_ranking: 'Ticket altíssimo (Shopify paga com UMA venda), dor de autenticidade é clássica de importado, 109 reviews 5 mostra base fiel mas sem capturar tráfego novo. Provável que dono seja executivo e reconheça o valor de um site.',
  },

  116: {
    tier: 'A',
    posicao_no_tier: 4,
    dor: 'Moda executiva feminina em Palmas: cliente é advogada, servidora pública concursada, executiva. Ticket médio alto (R$300-800 por peça). Essa cliente NÃO compra roupa de trabalho pelo WhatsApp — ela quer ver vitrine organizada, filtrar por tamanho, pagar no cartão corporativo, receber em casa. "Moda executiva" sem site é contraste: vende sofisticação num canal informal.',
    gancho: 'Shopify com filtro por tamanho + ocasião (trabalho, evento, reunião) + parcelamento 12x + retirada na loja OU entrega em casa. Tema da loja com paleta sóbria/premium. 20 produtos cadastrados no entregável já cobre a coleção atual.',
    objecao: '"Minha cliente é fiel, compra pessoalmente" — vai defender o relacionamento.',
    resposta_objecao: 'A cliente fiel continua indo na loja. O site capta a que TROCA de emprego, que MUDA pra Palmas, que viu a concorrente vendendo online e busca "moda executiva feminina Palmas". Hoje essa cliente nova não te acha.',
    abertura: `Oi Dely, beleza? Eduardo aqui da Impulso Digital, sou de Palmas.

Olha — moda executiva feminina em Palmas com nota 5 e 63 aval é nicho posicionado de verdade. Não é loja genérica, é posicionamento.

Me parece que tu já sente isso: tua cliente fiel compra pessoalmente. Mas a advogada que mudou pra Palmas semana passada, a servidora que tomou posse mês passado, a executiva que nem te conhece ainda — essa pesquisa "moda executiva feminina Palmas" no Google. E tu não aparece.

Quem aparece pra ela: concorrente que vende pior mas tem site.

O que tu acha disso?`,
    razao_ranking: 'Nicho posicionado (moda EXECUTIVA, não genérica), cliente de ticket alto, dona provavelmente mulher executiva que entende o valor de presença digital. Nota 5 com 63 avaliações = base sólida, não pequena.',
  },

  9: {
    tier: 'A',
    posicao_no_tier: 5,
    dor: 'Nutri autônoma em Palmas: cliente busca "nutricionista Palmas" no Google antes de agendar. Izabela tem Insta (@nutriizabelacampos), mas Insta não aparece no Google pra quem pesquisa. 5.0 com 63 avaliações = autoridade construída sem canal pra capturar tráfego frio.',
    gancho: 'LP de nutri converte: especialidades (emagrecimento, esportiva, nutrição clínica), "como funciona a primeira consulta", FAQ ("atende plano de saúde?", "faz online?"), formulário de agendamento. 3 artigos SEO tipo "nutricionista em Palmas com atendimento online" = tráfego orgânico.',
    objecao: '"Capto pelo Instagram, tá funcionando" — nutri jovem, fluente em mídia social.',
    resposta_objecao: 'Instagram capta quem já te segue. LP capta quem NUNCA ouviu falar de você. São dois funis diferentes. Link da bio do Insta aponta pra LP → converte quem veio do Insta também. Soma, não substitui.',
    abertura: `Oi Izabela, beleza? Eduardo aqui da Impulso Digital, falo de Palmas.

Olha — vi teu perfil. Nota 5 com 63 avaliações pra nutri autônoma é ótimo. Tu construiu base sólida no Insta, dá pra ver.

Me parece que tu sente que o Insta capta quem já te segue. Mas paciente novo que NUNCA ouviu falar de ti — aquele que pesquisa "nutricionista em Palmas" no Google às 23h pensando em começar dieta na segunda — esse cai no Maps de nutri qualquer e não te encontra.

Quantos pacientes desse tipo tu acha que perde por mês?`,
    razao_ranking: 'Autônoma decide sozinha, ticket médio ok (R$200-350/consulta), dor de SEO local é óbvia pra ela. 5.0 / 63 aval mostra que tem público fiel — o que falta é capturar o novo. R$499 paga com 2-3 pacientes.',
  },

  11: {
    tier: 'A',
    posicao_no_tier: 6,
    dor: 'NUTRI NEFRO — ou seja, nutricionista especializada em doença renal. Nicho raríssimo. Paciente renal busca desesperado por esse perfil (alimentação correta faz diferença entre diálise ou não). Não ter LP com "nutri nefro" escrito explícito é DEIXAR DINHEIRO NA MESA — SEO pra "nutricionista renal Palmas" deve ter concorrência zero.',
    gancho: 'LP + 3 artigos SEO ("dieta pra paciente com insuficiência renal", "nutri nefro em Palmas", "alimentação pré-diálise") = domínio absoluto dessa busca em Palmas e região.',
    objecao: 'IG é @draanacarolinaalmeida (nome próprio, não @nutrinefro-algo) — provável que o nicho nefro ainda não esteja no posicionamento público dela.',
    resposta_objecao: 'Exatamente por isso a LP resolve. Insta você não muda do dia pra noite sem perder público. LP você lança com o posicionamento nefro EXPLÍCITO. É sua chance de ocupar o nicho em Palmas antes de alguém chegar.',
    abertura: `Oi Dra. Allana, beleza? Eduardo aqui da Impulso Digital, sou de Palmas.

Olha — nutri nefro em Palmas é nicho RARÍSSIMO. Tu sabe melhor que eu: paciente renal precisa cirurgicamente da nutri certa pra evitar diálise antecipada. Não é nutri genérica.

Me parece que tu vive isso na prática: paciente renal chega encaminhado pelo nefro, ou por indicação. Mas o paciente que descobriu o problema agora, que tá pesquisando "nutricionista pra insuficiência renal Palmas" hoje à noite no celular — esse cai em nutri genérica que não entende de nefro.

E tu sabe o estrago que isso faz no rim dele.

Como é que esse paciente novo te acharia hoje?`,
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
    abertura: `Oi, beleza? Eduardo aqui da Impulso Digital, sou de Palmas.

Olha — vi a Cia do Verão no Google. 4.9 com 73 aval em moda praia em Palmas tá forte mesmo.

Me parece que tu deve responder muita mensagem do tipo "tem esse tamanho?", "aceita cartão?", "qual o frete?" antes da cliente bater o martelo. Mensagem que toma teu tempo e a cliente some na metade.

Quantas dessas tu acha que tu responde por dia?`,
    razao_ranking: 'Setor que vai muito bem no Shopify, nota alta, mas provavelmente já vende bem no Insta — precisa de argumento de ESCALA (automação), não de SEO (Insta atende).',
  },

  111: {
    tier: 'B',
    posicao_no_tier: 2,
    dor: 'Moda masculina em Palmas: homem compra online cada vez mais (menos vergonha que mulher pedindo opinião). 91 avaliações 4.6 é sólido mas não é estrela — espaço pra escalar. Nota 4.6 (não 5) pode indicar alguma insatisfação recorrente (atendimento, estoque) — Shopify com política de troca clara RESOLVE isso.',
    gancho: 'Shopify com filtro por ocasião (trabalho, casamento, casual) + tabela de medidas + política de troca visível + parcelamento. Cliente homem valoriza processo claro e rápido.',
    objecao: '"Meu público prefere provar antes de comprar" — clássico varejo físico.',
    resposta_objecao: 'Prova se quer, com retirada na loja (opção no Shopify). Quem não quer provar compra online com troca garantida. Dá pra ter os dois no mesmo sistema.',
    abertura: `Oi, beleza? Eduardo aqui da Impulso Digital, falo de Palmas.

Olha — vi a San Remo no Google. 91 aval com 4.6 é base consolidada, dá pra ver que tu tem cliente fiel.

Me parece que cliente que mora perto da loja vai presencialmente sem problema. Mas o que viu um look teu no Insta lá do Plano Diretor Sul, ou aquele que mora em Paraíso e não vai dirigir 40 min — esse trava em "tem que ir presencial?" e some.

Como tu atende esse cliente hoje?`,
    razao_ranking: 'Setor forte, loja consolidada (91 reviews), nota 4.6 indica espaço pra melhoria operacional. Moda masculina funciona muito bem online. Probabilidade média-alta.',
  },

  30: {
    tier: 'B',
    posicao_no_tier: 3,
    dor: 'Dentista com 144 avaliações 4.8 em Palmas. Paciente que busca "dentista implante Palmas", "dentista estético Palmas" precisa ver antes/depois, especialidades, equipe. Consultório sem site perde paciente pra concorrente com site mesmo tendo reputação inferior.',
    gancho: 'LP odontológica com galeria antes/depois, especialidades (clínico, estético, implante, ortodontia), equipe com CRO visível, horários de atendimento, convênios aceitos. 3 artigos SEO ("quanto custa implante em Palmas", etc).',
    objecao: '"Consultório tem gestor, eu atendo, decide ele/ela". Fricção de cadeia de decisão.',
    resposta_objecao: 'Posso te apresentar a LP em 20 min — você e o gestor juntos. Em 20 min vocês decidem. Se não fechar, saem com uma análise digital do consultório de graça.',
    abertura: `Oi, beleza? Eduardo aqui da Impulso Digital, sou de Palmas.

Olha — vi o Palmas Bucal no Google. 4.8 com 144 avaliações é reputação que muito consultório novo nunca vai alcançar.

Me parece que vocês têm essa autoridade construída mas não capitalizam. Quando paciente novo pesquisa "dentista de confiança em Palmas" e compara dois resultados — um com galeria antes/depois, equipe com CRO, especialidades; outro só com Maps — ele não dá segunda chance pra quem não mostra.

Como funciona hoje a captação de paciente novo aí?`,
    razao_ranking: 'Reputação enorme (144 aval) mas clínica com gestão pode ter ciclo de decisão lento. Ticket alto (implante R$2-5k) justifica LP fácil.',
  },

  32: {
    tier: 'B',
    posicao_no_tier: 4,
    dor: 'Clínica focada em IMPLANTE. Ticket individual R$2-5k por implante. Paciente pesquisa muito antes de fechar ("clínica de implante confiável", "quanto custa implante Palmas", "implante com garantia"). Sem LP dedicada, perde pra concorrente com site.',
    gancho: 'LP específica de implante: antes/depois, explicação técnica (implante + coroa, cirurgia guiada), garantia, equipe com especialização em implantodontia, FAQ de preço. 3 artigos SEO ("implante dentário em Palmas: passo a passo e preço") = domínio de busca cara.',
    objecao: '"Já tenho muito paciente" — clínica consolidada.',
    resposta_objecao: '144 aval = paciente antigo. Mas o paciente que SÓ vai fazer implante uma vez na vida, que tá pesquisando agora em Palmas, ele te acha? Esse é o cliente novo de R$5k que você tá perdendo pro concorrente com site.',
    abertura: `Oi, beleza? Eduardo aqui da Impulso Digital, falo de Palmas.

Olha — vi a Odonto Fama. 4.8 com 112 avaliações focada em implante é autoridade que clínica nova vai levar 5 anos pra construir.

Me parece que vocês já fecharam muito implante por indicação. Mas o paciente novo que vai gastar R$3-5k num implante — esse pesquisa MUITO antes de marcar. "Implante com garantia em Palmas", "quanto custa implante Palmas", "clínica de implante boa". E hoje ele cai em clínica menor que tem site e parece mais profissional só por isso.

Quanto vale, em paciente perdido por mês, esse buraco?`,
    razao_ranking: 'Nicho (implante) + ticket altíssimo justifica LP, mas é clínica (decisão em grupo). Um pouco mais lento que consultório solo.',
  },

  17: {
    tier: 'B',
    posicao_no_tier: 5,
    dor: 'Parecido com Izabela, mas com detalhe: IG é @nutripridbarros (não @tatianesouza). Nome do IG ≠ nome do Google = confusão de branding. Isso pode ser ex-nome, co-autora ou parceria. Precisa investigar antes de disparar.',
    gancho: 'LP resolve exatamente isso — você centraliza o posicionamento. Seja qual for o nome profissional que você quer fortalecer, LP com domínio próprio = sua autoridade.',
    objecao: 'Possível confusão: "essa mensagem é pra quem?" — o prospecto pode não se reconhecer como "Tatiane" se ele se promove como "@nutripridbarros".',
    resposta_objecao: 'Investigar IG antes de disparar. Se @nutripridbarros for a marca principal, abordar como "nutri Pridbarros" em vez de "Tatiane".',
    abertura: `Oi, beleza? Eduardo aqui da Impulso Digital, sou de Palmas.

Olha — vi teu perfil. No Google tu tá como Tatiane Souza (nutri), no Instagram como @nutripridbarros. Nota 5 com 63 aval, autoridade construída.

Me parece que tu tá num momento de transição de marca, ou o IG é da parceria — mas pra paciente novo que pesquisa "nutricionista Palmas" no Google, é confusão. Ele vê dois nomes e não sabe pra qual canal vai.

Como tu vê isso hoje?`,
    razao_ranking: 'Nutri, bom ticket, mas ambiguidade de branding pode indicar lead confuso/em transição. Priorizar Izabela e Allana antes.',
  },

  148: {
    tier: 'B',
    posicao_no_tier: 6,
    dor: 'IG é @cheirodeamor_perfumaria (categoria no Google é "cosméticos" mas IG é "perfumaria") — provavelmente multimarcas perfumaria/cosméticos local. 63 aval 5.0 é base fiel. Cliente que busca marca específica ("onde comprar O Boticário em Palmas" — ou importado) precisa de vitrine organizada por marca.',
    gancho: 'Shopify com vitrine por marca + filtros por tipo (perfume, shampoo, maquiagem) + parcelamento 12x. Cadastro de 20 produtos cobre as principais marcas.',
    objecao: '"Revendedora de marca tem regra da matriz" — pode ter limitação comercial.',
    resposta_objecao: 'Shopify independente trata disso. Você vende multimarcas no seu próprio site, não o site da marca. Nada impede de listar O Boticário, Natura, importados, tudo junto — você é o ponto de venda.',
    abertura: `Oi, beleza? Eduardo aqui da Impulso Digital, sou de Palmas.

Olha — vi a Cheiro de Amor. 5 com 63 avaliações em perfumaria/cosméticos em Palmas é base fiel de verdade.

Me parece que cliente que já te conhece compra direto contigo. Mas o cliente que entra no Google pesquisando "onde comprar perfume O Boticário em Palmas" ou "perfumaria importado Palmas" — esse cai no site da marca matriz, não em ti como ponto de venda.

Tu vende multimarcas ou é revendedora autorizada de uma só?`,
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
    abertura: `Oi, beleza? Eduardo aqui da Impulso Digital, sou de Palmas.

Antes de qualquer coisa, me confirma uma parada — falo com a equipe da Doxsen mesmo (Moda Praia, Fitness e Casual)?

Pergunto porque vi vocês no Google com 161 avaliações nota 4.8 — número forte — mas o Instagram que apareceu aqui parece não ser de vocês. Não quero te tomar tempo com pitch errado.`,
    razao_ranking: 'Volume de avaliações alto mas Insta suspeito = dado sujo. Não investir tempo antes de confirmar identidade. Se confirmar = vira TIER A.',
  },

  153: {
    tier: 'C',
    posicao_no_tier: 2,
    dor: 'RACCO é marca nacional de cosméticos vendida via REVENDEDORA/consultora (MMN, tipo Avon/Natura). Essa "loja" provavelmente é uma consultora autorizada, não dona de negócio próprio. Revendedora não pode montar loja online própria — regra da matriz.',
    gancho: 'Possível ângulo: LP pessoal de consultora (NÃO Shopify com produtos Racco) mostrando "encontre sua consultora Racco em Palmas". Mas isso é LP, não Shopify — mudou a oferta.',
    objecao: 'Provável: "não posso, a Racco não deixa" ou "só posso vender via catálogo deles".',
    resposta_objecao: 'Concordar e reposicionar: LP pessoal de consultora (R$499) pra vender o SERVIÇO dela (atendimento, consultoria, visita domiciliar) — não o produto Racco. Isso a matriz permite. Foca em "pegue sua consultora de confiança", não em e-commerce.',
    abertura: `Oi, beleza? Eduardo aqui da Impulso Digital, sou de Palmas.

Olha — vi a Racco Cosméticos no Google, 5 com 63 avaliações. Antes de te pitchar qualquer coisa, preciso entender:

Tu é consultora autorizada Racco ou dona de um ponto físico independente? Pergunto porque a Racco tem regra de marketing pra revendedora, e a solução que faz sentido pra ti muda completamente dependendo de qual dos dois.`,
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
  out.push(`# Playbook de ataque — 14 leads (atualizado 2026-04-25)`)
  out.push('')
  out.push(`**Meta:** fechar no mínimo 2 dos 14 esta semana.`)
  out.push(`**Fonte:** análise cirúrgica hardcoded em \`scripts/top-14-disparo.ts\`.`)
  out.push(`**Arsenal aplicado:** aberturas calibradas pelos 5 livros — **Voss** (Labeling + Black Swan question), **Klaff** (Award Frame, Eduardo avalia o lead, não suplica), **Hormozi** (Equação de Valor na oferta), **Cialdini** (autoridade + escassez real), **Hill** (especialização brutal — UMA solução por categoria).`)
  out.push(`**Importante:** scraping IG ainda pendente — análise baseada em categoria, nota Google, volume de avaliações e nicho.`)
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
  out.push(`## Oferta consolidada — Grand Slam Offer (Hormozi)`)
  out.push('')
  out.push(`Toda oferta segue 4 vetores da **Equação de Valor**: (Sonho × Probabilidade) / (Tempo × Esforço). Bônus stack categorizado em 4 tipos: **AMPLIA** o resultado / **ACELERA** entrega / **REMOVE ESFORÇO** do cliente / **REMOVE RISCO**.`)
  out.push('')
  out.push(`### Pacote Lançamento Vitalício (LP — R$499)`)
  out.push('')
  out.push(`> *Aparece no Google em 7 dias e nunca mais paga hospedagem.*`)
  out.push('')
  out.push(`**O que entra:**`)
  out.push(`- Landing Page Next.js otimizada pra SEO local (mobile-first, carrega em 1s)`)
  out.push(`- Botão WhatsApp flutuante com mensagem pré-preenchida`)
  out.push(`- Formulário de captura integrado ao seu WhatsApp/email`)
  out.push('')
  out.push(`**Bônus stack (R$2.500 de valor de mercado):**`)
  out.push(`- 🔥 **AMPLIA:** 3 artigos SEO ranqueados pra captar tráfego orgânico vitalício (R$500)`)
  out.push(`- ⚡ **ACELERA:** entrega em 7 dias contados do briefing (mercado entrega em 30-60)`)
  out.push(`- 🪶 **REMOVE ESFORÇO:** call de alinhamento de 20 min onde sai um protótipo funcional Next.js já no ar (você não explica nada do zero)`)
  out.push(`- 🛡️ **REMOVE RISCO:** hospedagem **vitalícia** grátis (mercado: R$30/mês × eternidade) + garantia de 7 dias após prévia`)
  out.push('')
  out.push(`**Ancoragem de mercado:**`)
  out.push(`- Agência local Palmas: R$1.500-3.000 + R$200/mês de mensalidade`)
  out.push(`- Fiverr terceirizado: R$800-1.200 SEM SEO, blog ou hosting`)
  out.push(`- **Impulso Digital: R$499 uma vez** (50% entrada, 50% na entrega)`)
  out.push('')
  out.push(`**Garantia condicional:** "Se a prévia visual não for a cara do seu negócio, devolvo 100%. Antes de a gente publicar."`)
  out.push('')
  out.push(`**Escassez REAL:** Promo hospedagem vitalícia válida só pros primeiros 10 fechamentos. Depois volta pra R$49,90/mês de hosting.`)
  out.push('')
  out.push(`### Pacote Loja-Que-Vende-Dormindo (Shopify — R$599)`)
  out.push('')
  out.push(`> *Sua loja vende enquanto você dorme — você só recebe o pedido pronto pra despachar.*`)
  out.push('')
  out.push(`**O que entra:**`)
  out.push(`- Loja Shopify com tema MPN (mesmo da UrbanFeet, 1.600+ pares vendidos)`)
  out.push(`- 20 produtos cadastrados (foto + descrição + variações)`)
  out.push(`- Integração Yampi (checkout) + Melhor Envio (frete automático)`)
  out.push(`- Mercado Pago configurado (Pix + cartão 12x + boleto)`)
  out.push('')
  out.push(`**Bônus stack (R$3.200 de valor de mercado):**`)
  out.push(`- 🔥 **AMPLIA:** lista de fornecedores Palmas + scripts de prospecção pra atacado (R$400)`)
  out.push(`- ⚡ **ACELERA:** Shopify a $1/mês nos 3 primeiros meses (economia R$300)`)
  out.push(`- 🪶 **REMOVE ESFORÇO:** call de alinhamento de 30 min com diagnóstico operacional ao vivo (motoboy + MP + frete + fornecedores)`)
  out.push(`- 🛡️ **REMOVE RISCO:** call de entrega gravada — você revê quantas vezes precisar`)
  out.push('')
  out.push(`**Ancoragem de mercado:**`)
  out.push(`- Agência local Palmas: R$1.500-4.000 + mensalidade`)
  out.push(`- Fiverr terceirizado: R$1.200-2.000 SEM tema profissional, integrações ou call`)
  out.push(`- **Impulso Digital: R$599 uma vez** (50% entrada, 50% na entrega)`)
  out.push('')
  out.push(`**Prova social viva:** Gabriel da GB Nutrition (personal trainer em Palmas) virou loja automatizada de suplementos com entrega expressa no mesmo dia. Plano de Negócio entregue, loja no ar.`)
  out.push('')
  out.push(`**Garantia condicional:** "Antes de publicar, você aprova a prévia. Se não for a cara do seu negócio, devolvo 100%."`)
  out.push('')
  out.push(`---`)
  out.push('')
  out.push(`## Princípios de abordagem (5 livros)`)
  out.push('')
  out.push(`Antes de cada disparo, lembrar:`)
  out.push(`- **Award Frame (Klaff):** Eduardo NÃO suplica. Ele AVALIA se vale ajudar esse lead. Postura de quem tem agenda cheia, não de quem precisa fechar.`)
  out.push(`- **Labeling (Voss):** "Me parece que tu..." antes de qualquer pitch. Antecipa o que ele tá sentindo e ele baixa a guarda.`)
  out.push(`- **Black Swan question:** termina abertura com uma pergunta que dói. Não "quer um site?" — "quem busca [seu serviço] hoje em Palmas, te acha?"`)
  out.push(`- **Calibrated Questions:** "Como…" e "O que…" — NUNCA "Por que" (soa acusatório).`)
  out.push(`- **Hot Cognition (Klaff):** mira emoção (medo de perder, ambição, status), não razão.`)
  out.push(`- **Hill — desejo ardente:** se o lead disser "vou pensar", insiste com mais um ângulo. Nunca passivo.`)
  out.push(`- **Tom Eduardo:** "tamo junto", "olha", "pensa comigo", "tu manda?". Curto. Sem corporativês. Pontuação de chat real.`)
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
