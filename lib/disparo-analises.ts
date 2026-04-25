// Análise cirúrgica por lead — playbook de disparo dos 14 priorizados
// Usado por scripts/top-14-disparo.ts (gera markdown) e app/api/disparo (UI)

export type Analise = {
  tier: 'A' | 'B' | 'C'
  posicao_no_tier: number
  dor: string
  gancho: string
  objecao: string
  resposta_objecao: string
  abertura: string
  razao_ranking: string
}

export const ANALISES: Record<number, Analise> = {
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
