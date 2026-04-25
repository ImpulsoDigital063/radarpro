// Análise cirúrgica por lead — playbook de disparo dos 14 priorizados
// Usado por scripts/top-14-disparo.ts (gera markdown) e app/api/disparo (UI)
//
// Atualizado 25/04/2026 com base em pesquisa benchmarks 2025-2026:
// - Aberturas < 80 palavras (Instantly 2026: short bate long)
// - Timeline hook (9.91-10.67% reply rate) > Problem hook (3.90-4.77%)
// - Voss Labeling mantido + Black Swan question no fim
// - Follow-ups D+3 e D+7 estruturados (42% das respostas vêm em follow-up;
//   48% dos reps NUNCA mandam segundo toque — gap explorado)
// - Pré-engajamento Insta D-1 (multichannel = 287% mais respostas que single)

export type Analise = {
  tier: 'A' | 'B' | 'C'
  posicao_no_tier: number
  dor: string
  gancho: string
  objecao: string
  resposta_objecao: string
  abertura: string
  followup_d3: string
  followup_d7: string
  pre_engajamento_ig: string
  razao_ranking: string
}

const PRE_IG_PADRAO = `D-1 (24h antes de mandar): abrir Instagram do lead, curtir 2 posts recentes, comentar 1 (comentario genuino — nada de "foto top"; algo do tipo "boa, isso ai" ou referencia ao conteudo). Isso cria pre-warming: quando WhatsApp chegar, perfil ja foi visto.`

export const ANALISES: Record<number, Analise> = {
  // ── TIER A — 6 apostas fortes ──────────────────────────────────────────

  55: {
    tier: 'A',
    posicao_no_tier: 1,
    dor: 'Psicólogo em Palmas compete por confiança. Paciente que busca "psicólogo Palmas" no Google hoje encontra o Gilson no Maps, mas clica e vê só endereço e telefone — zero contexto, zero cara, zero abordagem. Insta não transmite sigilo/seriedade do consultório. 4.9 com 135 avaliações prova autoridade, mas ele não está capitalizando esse ativo.',
    gancho: 'LP dedicada mostra linha de abordagem, especialidades, primeira consulta, FAQ ("sigilo é garantido?", "atende online?"). O "aparece no Google quando alguém pesquisa psicólogo em Palmas" é literal — Gilson já tem a reputação pra estourar SEO local.',
    objecao: 'Psicólogo tem escrúpulo com marketing agressivo. Provável: "não quero algo que pareça venda".',
    resposta_objecao: 'LP sóbria (paleta clara, foto profissional, linguagem ética), sem copy agressiva — a autoridade dos 135 avaliações 4.9 fala por si. Mostra o case Gilson Afonso na pasta de trabalhos depois (virou prova social).',
    abertura: `Oi Gilson, beleza? Eduardo aqui, Impulso Digital, sou de Palmas.

Olha — tô mapeando consultórios fortes daqui essa semana pra entender o terreno digital. 4.9 com 135 avaliações em psicologia é dos números mais sólidos que vi.

Me parece que teu gargalo não é reputação — tu já tem. É que paciente novo pesquisa "psicólogo Palmas" e cai em ti só pelo Maps, sem nada que ajude ele a bater o martelo de marcar.

Quantos desses tu acha que perde por mês?`,
    followup_d3: `Oi Gilson, voltei rapidinho. Pensei numa coisa específica pro teu caso: a maioria dos psicólogos em Palmas que aparece bem no Google tem 1 página simples com foto, linha de abordagem e FAQ. Os 3 que mais ranqueam não tem propaganda agressiva — tem informação clara. Posso te mostrar em 1 print? Sem compromisso.`,
    followup_d7: `Oi Gilson, última mensagem da minha parte. Sei que tu deve receber muita oferta — vou parar de incomodar. Só registro: vi 4 psicólogos em Palmas com nota mais baixa que a tua aparecendo antes de ti no Google só porque tem site. Se daqui a 3 meses isso te incomodar, me chama.`,
    pre_engajamento_ig: PRE_IG_PADRAO,
    razao_ranking: 'Autônomo (decide sozinho), ticket alto (R$150-250/sessão), 135 avaliações = reputação já construída (não precisa provar nada), dor de credibilidade digital é clássica do psicólogo. R$499 paga com 3 sessões.',
  },

  24: {
    tier: 'A',
    posicao_no_tier: 2,
    dor: 'Advocacia em Palmas: cliente pesquisa "advogado trabalhista Palmas" (ou família, ou previdenciário) ANTES de ligar. Se não tem site, cliente liga primeiro pro concorrente que tem. Nota 5 com 120 avaliações é escandalosa — Guilherme tá sentado numa mina de autoridade sem LP pra capturar essa intenção de busca.',
    gancho: 'LP de escritório de advocacia converte violento: áreas de atuação, foto do escritório, biografia, casos (sem expor cliente), FAQ ("quanto custa consulta?", "atende OAB-TO?"). SEO local + 3 artigos ("como entrar com ação trabalhista em Palmas", etc) = tráfego orgânico pra vida toda.',
    objecao: 'OAB tem regra contra marketing "chamativo". Provável: "não posso fazer propaganda de advogado".',
    resposta_objecao: 'Provimento 205/2021 da OAB permite LP informativa sem preço nem promessa de resultado. A LP segue direitinho: informação sóbria, áreas de atuação, formulário de contato. Não é captação agressiva, é presença digital regulamentar.',
    abertura: `Oi Guilherme, beleza? Eduardo aqui, Impulso Digital, sou de Palmas.

Olha — tô olhando escritórios de advocacia em Palmas essa semana e nota 5 com 120 avaliações é coisa rara aí no segmento.

Me parece que tu já sente que metade do cliente novo pesquisa "advogado [área] Palmas" antes de ligar. E quando cai no Maps, vê só endereço — nada que ajude ele a escolher entre ti e o concorrente.

Como funciona hoje quando chega um cliente novo que não veio por indicação?`,
    followup_d3: `Oi Guilherme, voltei. Pensando no teu caso: o Provimento 205/2021 da OAB permite LP informativa sem preço nem promessa de resultado — exatamente o que escritório forte precisa pra capturar busca local. Tu sabia que era permitido? Posso te mostrar 2 LPs de advogado que respeitam OAB e ranqueiam.`,
    followup_d7: `Oi Guilherme, última mensagem. Vou parar de incomodar — sei que advogado bom tem agenda apertada. Só pro teu radar: 2 escritórios em Palmas com menos avaliações que o teu já aparecem antes em "advogado Palmas". Se um dia fizer sentido, tu sabe onde me achar.`,
    pre_engajamento_ig: PRE_IG_PADRAO,
    razao_ranking: 'Decide sozinho, ticket cliente altíssimo (honorários 10%+ de causa), 120 reviews 5 = autoridade máxima. R$499 paga com 1/10 de um honorário. Objeção OAB é real mas contornável.',
  },

  146: {
    tier: 'A',
    posicao_no_tier: 3,
    dor: 'Perfumaria de importado em Palmas: a DOR é PROVA DE AUTENTICIDADE. Cliente que vai gastar R$400-800 num perfume importado quer site profissional, notas fiscais visíveis, política de troca, garantia. Vender perfume importado só pelo Instagram é assinar atestado de "pode ser falso". Nota 5 com 109 aval prova que os clientes já confiam — mas quem não conhece ainda, desconfia.',
    gancho: 'Shopify com checkout MP (parcelamento 12x) + cadastro organizado por marca (Dior, Carolina Herrera, Chanel, etc) + vitrine com estoque real + selo "Perfumaria autorizada" + entrega Palmas no dia. Ticket médio do setor é alto, Shopify paga com 1-2 vendas.',
    objecao: '"Já vendo bem pelo WhatsApp, pra que site?" — Don Parfum provavelmente já fatura bem.',
    resposta_objecao: 'Cliente NOVO que não te conhece não compra R$500 no WhatsApp de alguém que só tem Insta. Shopify = porta de entrada pra cliente novo. Os que já confiam continuam no WhatsApp se quiserem. Você dobra o funil.',
    abertura: `Oi, beleza? Eduardo aqui, Impulso Digital, falo de Palmas.

Antes do dia das mães (faltam 3 semanas), tô olhando perfumarias fortes em Palmas. 5 com 109 avaliações é referência aí no segmento de importado.

Me parece que cliente que já te conhece compra de boa pelo WhatsApp. Mas o cliente NOVO — aquele que tá com R$500 na mão pra gastar num perfume e nunca pisou aí — esse não compra de quem só tem Insta.

Tu já calculou quantas vendas o cliente novo deixa de fazer?`,
    followup_d3: `Oi, voltei rápido. Pensei no teu caso: cliente que vai gastar R$500 num importado quer ver foto da loja, política de troca, NF-e visível. Hoje no Insta ele não vê nada disso — desconfia. Quer que eu te mostre 2 perfumarias de importado de outras cidades faturando 3-5x mais com Shopify simples?`,
    followup_d7: `Oi, última msg. Vou parar de incomodar. Só pro registro: o dia das mães entra em 3 semanas e Shopify novo demora 7-10 dias pra ficar redondo. Não dá tempo agora — mas se em junho tu pensar em estruturar pro Natal, me chama.`,
    pre_engajamento_ig: PRE_IG_PADRAO,
    razao_ranking: 'Ticket altíssimo (Shopify paga com UMA venda), dor de autenticidade é clássica de importado, 109 reviews 5 mostra base fiel mas sem capturar tráfego novo. Provável que dono seja executivo e reconheça o valor de um site.',
  },

  116: {
    tier: 'A',
    posicao_no_tier: 4,
    dor: 'Moda executiva feminina em Palmas: cliente é advogada, servidora pública concursada, executiva. Ticket médio alto (R$300-800 por peça). Essa cliente NÃO compra roupa de trabalho pelo WhatsApp — ela quer ver vitrine organizada, filtrar por tamanho, pagar no cartão corporativo, receber em casa. "Moda executiva" sem site é contraste: vende sofisticação num canal informal.',
    gancho: 'Shopify com filtro por tamanho + ocasião (trabalho, evento, reunião) + parcelamento 12x + retirada na loja OU entrega em casa. Tema da loja com paleta sóbria/premium. 20 produtos cadastrados no entregável já cobre a coleção atual.',
    objecao: '"Minha cliente é fiel, compra pessoalmente" — vai defender o relacionamento.',
    resposta_objecao: 'A cliente fiel continua indo na loja. O site capta a que TROCA de emprego, que MUDA pra Palmas, que viu a concorrente vendendo online e busca "moda executiva feminina Palmas". Hoje essa cliente nova não te acha.',
    abertura: `Oi Dely, beleza? Eduardo aqui, Impulso Digital, sou de Palmas.

Olha — moda executiva feminina em Palmas com 5 estrelas e 63 aval é nicho posicionado de verdade. Não é loja genérica.

Me parece que tu sente que cliente fiel compra pessoalmente. Mas a advogada que mudou pra Palmas semana passada, a servidora que tomou posse mês passado — essa pesquisa "moda executiva Palmas" no Google. E quem aparece é concorrente que vende pior mas tem site.

O que tu acha disso?`,
    followup_d3: `Oi Dely, voltei. Pensando: tua cliente fiel não vai pro site mesmo — ela já te conhece. Mas a Cliente Nova (advogada/servidora que acabou de chegar em Palmas) gasta 30-40 min pesquisando antes de comprar. Se tu não aparece, ela compra em loja online de SP. Tu já sentiu isso aí?`,
    followup_d7: `Oi Dely, vou parar de incomodar — última mensagem. O ciclo de moda executiva tem rush em julho/agosto (volta de férias, novos cargos). Site demora 7-10 dias pra ficar pronto, então pra pegar essa janela seria começar até início de junho. Se fizer sentido em algum momento, tu sabe onde me achar.`,
    pre_engajamento_ig: PRE_IG_PADRAO,
    razao_ranking: 'Nicho posicionado (moda EXECUTIVA, não genérica), cliente de ticket alto, dona provavelmente mulher executiva que entende o valor de presença digital. Nota 5 com 63 avaliações = base sólida, não pequena.',
  },

  9: {
    tier: 'A',
    posicao_no_tier: 5,
    dor: 'Nutri autônoma em Palmas: cliente busca "nutricionista Palmas" no Google antes de agendar. Izabela tem Insta (@nutriizabelacampos), mas Insta não aparece no Google pra quem pesquisa. 5.0 com 63 avaliações = autoridade construída sem canal pra capturar tráfego frio.',
    gancho: 'LP de nutri converte: especialidades (emagrecimento, esportiva, nutrição clínica), "como funciona a primeira consulta", FAQ ("atende plano de saúde?", "faz online?"), formulário de agendamento. 3 artigos SEO tipo "nutricionista em Palmas com atendimento online" = tráfego orgânico.',
    objecao: '"Capto pelo Instagram, tá funcionando" — nutri jovem, fluente em mídia social.',
    resposta_objecao: 'Instagram capta quem já te segue. LP capta quem NUNCA ouviu falar de você. São dois funis diferentes. Link da bio do Insta aponta pra LP → converte quem veio do Insta também. Soma, não substitui.',
    abertura: `Oi Izabela, beleza? Eduardo aqui, Impulso Digital, falo de Palmas.

Olha — tô olhando nutricionistas autônomas fortes em Palmas essa semana. 5 com 63 avaliações é base sólida, dá pra ver que tu construiu coisa boa no Insta.

Me parece que tu sente que o Insta capta quem já te segue. Mas o paciente que pesquisa "nutricionista Palmas" no Google às 23h pensando em começar dieta na segunda — esse cai em nutri qualquer.

Quantos pacientes desse tipo tu acha que perde por mês?`,
    followup_d3: `Oi Izabela, voltei. Pensando no teu caso: Insta e Google são funis diferentes. Insta = quem já te segue. Google = quem nunca ouviu de ti. Hoje tu domina o primeiro, perde o segundo. LP simples + 3 artigos SEO ranqueia em 30-60 dias e captura paciente novo. Tem 2 nutris em Palmas fazendo isso bem — quer ver?`,
    followup_d7: `Oi Izabela, última msg. Vou parar de mandar. Tua autoridade no Insta é real e tu não precisa de mim pra isso. Mas se em algum momento tu sentir que tá empacando em volume de paciente novo, é exatamente nesse buraco do Google que tá a resposta. Tu sabe onde me achar.`,
    pre_engajamento_ig: PRE_IG_PADRAO,
    razao_ranking: 'Autônoma decide sozinha, ticket médio ok (R$200-350/consulta), dor de SEO local é óbvia pra ela. 5.0 / 63 aval mostra que tem público fiel — o que falta é capturar o novo. R$499 paga com 2-3 pacientes.',
  },

  11: {
    tier: 'A',
    posicao_no_tier: 6,
    dor: 'NUTRI NEFRO — ou seja, nutricionista especializada em doença renal. Nicho raríssimo. Paciente renal busca desesperado por esse perfil (alimentação correta faz diferença entre diálise ou não). Não ter LP com "nutri nefro" escrito explícito é DEIXAR DINHEIRO NA MESA — SEO pra "nutricionista renal Palmas" deve ter concorrência zero.',
    gancho: 'LP + 3 artigos SEO ("dieta pra paciente com insuficiência renal", "nutri nefro em Palmas", "alimentação pré-diálise") = domínio absoluto dessa busca em Palmas e região.',
    objecao: 'IG é @draanacarolinaalmeida (nome próprio, não @nutrinefro-algo) — provável que o nicho nefro ainda não esteja no posicionamento público dela.',
    resposta_objecao: 'Exatamente por isso a LP resolve. Insta você não muda do dia pra noite sem perder público. LP você lança com o posicionamento nefro EXPLÍCITO. É sua chance de ocupar o nicho em Palmas antes de alguém chegar.',
    abertura: `Oi Dra. Allana, beleza? Eduardo aqui, Impulso Digital.

Olha — tô olhando nutris especialistas em Palmas e nutri nefro é raríssimo. Tu sabe melhor que eu: paciente renal precisa cirurgicamente da nutri certa.

Me parece que paciente teu chega encaminhado pelo nefrologista. Mas o paciente que pesquisou "nutricionista pra insuficiência renal Palmas" hoje à noite — esse cai em nutri genérica que não entende de nefro.

Como esse paciente novo te acharia hoje?`,
    followup_d3: `Oi Dra. Allana, voltei. Pensando no teu nicho: SEO pra "nutricionista renal Palmas" provavelmente tem concorrência zero. Quem ranqueia primeiro domina a busca da região inteira por anos. LP + 2-3 artigos ("dieta pré-diálise", "nutrição em insuficiência renal") = tu vira a referência online também. Topa eu te mostrar?`,
    followup_d7: `Oi Dra. Allana, última mensagem. Sei que rotina de nutri clínica é puxada. Vou parar de incomodar. Só registro: o paciente renal de Palmas que precisar de nutri nefro nos próximos 5 anos vai pesquisar no Google. Quem aparecer primeiro fica com ele. Hoje essa vaga tá aberta.`,
    pre_engajamento_ig: PRE_IG_PADRAO,
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
    abertura: `Oi, beleza? Eduardo aqui, Impulso Digital, sou de Palmas.

Antes da Copa começar (faltam 6 semanas) e do verão chegando, tô olhando lojas fortes de moda praia em Palmas. 4.9/73 é forte mesmo.

Me parece que tu deve responder muita mensagem do tipo "tem esse tamanho?", "aceita cartão?" antes da cliente bater o martelo. Mensagem que toma teu tempo e a cliente some na metade.

Quantas dessas tu responde por dia?`,
    followup_d3: `Oi, voltei. Pensando: enquanto tu responde "tem M?" no WhatsApp, a cliente já desistiu e foi pra Shein. No Shopify ela filtra sozinha, paga, e tu vê o pedido pronto. Diferença é vender enquanto dorme. Quer ver case da UrbanFeet (1.600+ pares vendidos pela internet em 3 anos)?`,
    followup_d7: `Oi, última msg. Verão chega forte e Copa em 6 semanas — janela boa pra Shopify. Site novo demora 7-10 dias. Se quiser pegar o rush, é começar em maio. Se não fizer sentido, sem stress — tu sabe onde me achar.`,
    pre_engajamento_ig: PRE_IG_PADRAO,
    razao_ranking: 'Setor que vai muito bem no Shopify, nota alta, mas provavelmente já vende bem no Insta — precisa de argumento de ESCALA (automação), não de SEO (Insta atende).',
  },

  111: {
    tier: 'B',
    posicao_no_tier: 2,
    dor: 'Moda masculina em Palmas: homem compra online cada vez mais (menos vergonha que mulher pedindo opinião). 91 avaliações 4.6 é sólido mas não é estrela — espaço pra escalar. Nota 4.6 (não 5) pode indicar alguma insatisfação recorrente (atendimento, estoque) — Shopify com política de troca clara RESOLVE isso.',
    gancho: 'Shopify com filtro por ocasião (trabalho, casamento, casual) + tabela de medidas + política de troca visível + parcelamento. Cliente homem valoriza processo claro e rápido.',
    objecao: '"Meu público prefere provar antes de comprar" — clássico varejo físico.',
    resposta_objecao: 'Prova se quer, com retirada na loja (opção no Shopify). Quem não quer provar compra online com troca garantida. Dá pra ter os dois no mesmo sistema.',
    abertura: `Oi, beleza? Eduardo aqui, Impulso Digital, falo de Palmas.

Antes da Copa começar (junho), tô mapeando lojas de moda masculina fortes em Palmas. 91 aval com 4.6 é base consolidada, dá pra ver que tu tem cliente fiel.

Me parece que cliente que mora perto da loja vai presencialmente. Mas o que viu um look teu no Insta lá do Plano Diretor Sul, ou em Paraíso — esse trava em "tem que ir presencial?" e some.

Como tu atende esse cliente hoje?`,
    followup_d3: `Oi, voltei. Pensando: cliente homem quer processo claro — tabela de medidas, troca garantida, retirada na loja OU entrega. No Shopify isso é nativo. Hoje no WhatsApp ele pergunta "tem o tamanho 42?" e tu responde, ele some. Some 30%, fica 70%. Quer ver case real disso?`,
    followup_d7: `Oi, última msg. Copa em 6 semanas, mês das festas em junho — janela boa pra moda masculina. Shopify novo demora 7-10 dias. Se não fizer sentido agora, tu sabe onde me achar.`,
    pre_engajamento_ig: PRE_IG_PADRAO,
    razao_ranking: 'Setor forte, loja consolidada (91 reviews), nota 4.6 indica espaço pra melhoria operacional. Moda masculina funciona muito bem online. Probabilidade média-alta.',
  },

  30: {
    tier: 'B',
    posicao_no_tier: 3,
    dor: 'Dentista com 144 avaliações 4.8 em Palmas. Paciente que busca "dentista implante Palmas", "dentista estético Palmas" precisa ver antes/depois, especialidades, equipe. Consultório sem site perde paciente pra concorrente com site mesmo tendo reputação inferior.',
    gancho: 'LP odontológica com galeria antes/depois, especialidades (clínico, estético, implante, ortodontia), equipe com CRO visível, horários de atendimento, convênios aceitos. 3 artigos SEO ("quanto custa implante em Palmas", etc).',
    objecao: '"Consultório tem gestor, eu atendo, decide ele/ela". Fricção de cadeia de decisão.',
    resposta_objecao: 'Posso te apresentar a LP em 20 min — você e o gestor juntos. Em 20 min vocês decidem. Se não fechar, saem com uma análise digital do consultório de graça.',
    abertura: `Oi, beleza? Eduardo aqui, Impulso Digital, sou de Palmas.

Olha — tô olhando consultórios fortes em Palmas e Palmas Bucal com 144 avaliações é reputação que muito consultório novo nunca alcança.

Me parece que vocês têm essa autoridade construída mas não capitalizam. Quando paciente novo pesquisa "dentista de confiança Palmas" e compara dois resultados — um com galeria, equipe; outro só com Maps — ele não dá segunda chance pra quem não mostra.

Como funciona a captação de paciente novo aí hoje?`,
    followup_d3: `Oi, voltei. Pensando: o paciente que vai gastar R$3-5k num implante pesquisa MUITO. Ele compara 4-5 consultórios antes. Se o primeiro tem foto da equipe + antes/depois e o segundo é só Maps, o segundo já era. Vocês têm 144 aval — capital social construído. Falta só apresentar online.`,
    followup_d7: `Oi, última msg. Sei que decisão de consultório com gestor tem ciclo. Vou parar de incomodar. Se quiser, posso apresentar em 20 min você + gestor — análise digital do consultório de graça, sem compromisso. Senão, tu sabe onde me achar.`,
    pre_engajamento_ig: PRE_IG_PADRAO,
    razao_ranking: 'Reputação enorme (144 aval) mas clínica com gestão pode ter ciclo de decisão lento. Ticket alto (implante R$2-5k) justifica LP fácil.',
  },

  32: {
    tier: 'B',
    posicao_no_tier: 4,
    dor: 'Clínica focada em IMPLANTE. Ticket individual R$2-5k por implante. Paciente pesquisa muito antes de fechar ("clínica de implante confiável", "quanto custa implante Palmas", "implante com garantia"). Sem LP dedicada, perde pra concorrente com site.',
    gancho: 'LP específica de implante: antes/depois, explicação técnica (implante + coroa, cirurgia guiada), garantia, equipe com especialização em implantodontia, FAQ de preço. 3 artigos SEO ("implante dentário em Palmas: passo a passo e preço") = domínio de busca cara.',
    objecao: '"Já tenho muito paciente" — clínica consolidada.',
    resposta_objecao: '144 aval = paciente antigo. Mas o paciente que SÓ vai fazer implante uma vez na vida, que tá pesquisando agora em Palmas, ele te acha? Esse é o cliente novo de R$5k que você tá perdendo pro concorrente com site.',
    abertura: `Oi, beleza? Eduardo aqui, Impulso Digital, falo de Palmas.

Olha — clínica focada em implante com 4.8/112 é autoridade que clínica nova vai levar 5 anos pra construir.

Me parece que vocês já fecharam muito implante por indicação. Mas o paciente novo que vai gastar R$3-5k pesquisa MUITO antes — "implante com garantia Palmas", "quanto custa implante" — e cai em clínica menor que tem site.

Quanto vale, em paciente perdido por mês, esse buraco?`,
    followup_d3: `Oi, voltei. Pensando: paciente de implante R$5k é decisão de vida — ele compara 4-6 clínicas antes de marcar. Se no Google a primeira opção é clínica menor com site bonito e a segunda é vocês com Maps puro, o ranking psicológico inverte. 1 implante perdido = R$5k. Em 12 meses isso é R$60k+ que escapa.`,
    followup_d7: `Oi, última msg. Implante em Palmas tem ticket alto e ciclo de pesquisa longo. Janela de SEO local não fecha — quem chegar primeiro domina por anos. Se em algum momento isso te bater, tu sabe onde me achar.`,
    pre_engajamento_ig: PRE_IG_PADRAO,
    razao_ranking: 'Nicho (implante) + ticket altíssimo justifica LP, mas é clínica (decisão em grupo). Um pouco mais lento que consultório solo.',
  },

  17: {
    tier: 'B',
    posicao_no_tier: 5,
    dor: 'Parecido com Izabela, mas com detalhe: IG é @nutripridbarros (não @tatianesouza). Nome do IG ≠ nome do Google = confusão de branding. Isso pode ser ex-nome, co-autora ou parceria. Precisa investigar antes de disparar.',
    gancho: 'LP resolve exatamente isso — você centraliza o posicionamento. Seja qual for o nome profissional que você quer fortalecer, LP com domínio próprio = sua autoridade.',
    objecao: 'Possível confusão: "essa mensagem é pra quem?" — o prospecto pode não se reconhecer como "Tatiane" se ele se promove como "@nutripridbarros".',
    resposta_objecao: 'Investigar IG antes de disparar. Se @nutripridbarros for a marca principal, abordar como "nutri Pridbarros" em vez de "Tatiane".',
    abertura: `Oi, beleza? Eduardo aqui, Impulso Digital, sou de Palmas.

Olha — tô olhando perfis de nutri em Palmas e o teu chamou atenção: no Google é Tatiane Souza, no Insta é @nutripridbarros. Nota 5 com 63 aval, autoridade construída.

Me parece que tu tá num momento de transição de marca — mas paciente novo que pesquisa "nutricionista Palmas" no Google fica confuso. Ele vê dois nomes e não sabe pra qual canal vai.

Como tu vê isso hoje?`,
    followup_d3: `Oi, voltei. Pensando no teu caso: a confusão de branding (nome no Google ≠ Insta) é exatamente o que LP resolve. LP com domínio próprio + foto + posicionamento claro = paciente novo bate o martelo no nome certo. Quer eu te mostrar como casar os dois sem perder histórico?`,
    followup_d7: `Oi, última msg. Sei que decidir mudança de branding tem peso. Vou parar de incomodar. Só registro: enquanto a confusão estiver aí, paciente novo escolhe o concorrente que tem clareza. Tu sabe onde me achar.`,
    pre_engajamento_ig: PRE_IG_PADRAO,
    razao_ranking: 'Nutri, bom ticket, mas ambiguidade de branding pode indicar lead confuso/em transição. Priorizar Izabela e Allana antes.',
  },

  148: {
    tier: 'B',
    posicao_no_tier: 6,
    dor: 'IG é @cheirodeamor_perfumaria (categoria no Google é "cosméticos" mas IG é "perfumaria") — provavelmente multimarcas perfumaria/cosméticos local. 63 aval 5.0 é base fiel. Cliente que busca marca específica ("onde comprar O Boticário em Palmas" — ou importado) precisa de vitrine organizada por marca.',
    gancho: 'Shopify com vitrine por marca + filtros por tipo (perfume, shampoo, maquiagem) + parcelamento 12x. Cadastro de 20 produtos cobre as principais marcas.',
    objecao: '"Revendedora de marca tem regra da matriz" — pode ter limitação comercial.',
    resposta_objecao: 'Shopify independente trata disso. Você vende multimarcas no seu próprio site, não o site da marca. Nada impede de listar O Boticário, Natura, importados, tudo junto — você é o ponto de venda.',
    abertura: `Oi, beleza? Eduardo aqui, Impulso Digital, sou de Palmas.

Antes do dia das mães, tô olhando perfumarias e cosméticos em Palmas. 5 com 63 avaliações em multimarcas é base fiel de verdade.

Me parece que cliente que já te conhece compra direto. Mas o cliente que pesquisa "onde comprar perfume O Boticário em Palmas" cai no site da matriz, não em ti como ponto de venda.

Tu vende multimarcas ou é revendedora autorizada de uma só?`,
    followup_d3: `Oi, voltei. Pensando: se tu é multimarcas (vende várias), Shopify independente cabe perfeitamente — tu organiza por marca + tipo, e captura quem pesquisa "comprar [marca] Palmas". Se for revendedora exclusiva, a solução muda. Me confirma rapidinho qual é o caso?`,
    followup_d7: `Oi, última msg. Mês das mães entra em 3 semanas — janela de pico do ano pra cosmético. Se for fazer Shopify, era pra começar em maio. Se não fizer sentido agora, tu sabe onde me achar.`,
    pre_engajamento_ig: PRE_IG_PADRAO,
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
    abertura: `Oi, beleza? Eduardo aqui, Impulso Digital, sou de Palmas.

Antes de qualquer coisa, me confirma uma parada — falo com a equipe da Doxsen mesmo (Moda Praia, Fitness e Casual)?

Pergunto porque vi vocês no Google com 161 avaliações nota 4.8 — número forte — mas o Instagram que apareceu aqui parece não ser de vocês. Não quero te tomar tempo com pitch errado.`,
    followup_d3: `Oi, voltei só pra confirmar — é da Doxsen mesmo (Moda Praia/Fitness)? Se sim, te mando rapidinho o que eu vi de oportunidade pra loja de vocês. Se não, abandono e desculpa o incômodo.`,
    followup_d7: `Oi, última tentativa. Se eu tiver enviado pro número errado, me ignora — sem stress. Se for da Doxsen mesmo e não fizer sentido agora, sem problema também.`,
    pre_engajamento_ig: 'NÃO fazer pré-engajamento — ID suspeita. Confirma identidade primeiro.',
    razao_ranking: 'Volume de avaliações alto mas Insta suspeito = dado sujo. Não investir tempo antes de confirmar identidade. Se confirmar = vira TIER A.',
  },

  153: {
    tier: 'C',
    posicao_no_tier: 2,
    dor: 'RACCO é marca nacional de cosméticos vendida via REVENDEDORA/consultora (MMN, tipo Avon/Natura). Essa "loja" provavelmente é uma consultora autorizada, não dona de negócio próprio. Revendedora não pode montar loja online própria — regra da matriz.',
    gancho: 'Possível ângulo: LP pessoal de consultora (NÃO Shopify com produtos Racco) mostrando "encontre sua consultora Racco em Palmas". Mas isso é LP, não Shopify — mudou a oferta.',
    objecao: 'Provável: "não posso, a Racco não deixa" ou "só posso vender via catálogo deles".',
    resposta_objecao: 'Concordar e reposicionar: LP pessoal de consultora (R$499) pra vender o SERVIÇO dela (atendimento, consultoria, visita domiciliar) — não o produto Racco. Isso a matriz permite. Foca em "pegue sua consultora de confiança", não em e-commerce.',
    abertura: `Oi, beleza? Eduardo aqui, Impulso Digital, sou de Palmas.

Olha — vi a Racco no Google, 5 com 63 avaliações. Antes de te pitchar qualquer coisa, preciso entender:

Tu é consultora autorizada Racco ou dona de um ponto físico independente? Pergunto porque a Racco tem regra de marketing pra revendedora, e a solução que faz sentido pra ti muda completamente dependendo de qual dos dois.`,
    followup_d3: `Oi, voltei. Se tu é consultora Racco autorizada, tem um ângulo legal — LP pessoal de consultora (não Shopify) mostrando "pegue sua consultora de confiança em Palmas" + agendamento. A matriz permite isso. Se for ponto físico independente, a coisa muda. Como tu vê?`,
    followup_d7: `Oi, última msg. Sei que regra de matriz cosmética é apertada. Se em algum momento tu quiser construir presença pessoal (consultora-marca, não a Racco), me chama. Senão, sem stress.`,
    pre_engajamento_ig: 'Pular pré-engajamento — qualifica primeiro o modelo de negócio.',
    razao_ranking: 'Qualificação duvidosa (revendedora vs. dona). Shopify provavelmente não cabe legalmente. Requer mudar oferta pra LP pessoal. Não perder tempo até esclarecer modelo de negócio.',
  },
}
