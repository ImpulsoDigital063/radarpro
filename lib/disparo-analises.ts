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
  objecao: string                 // o que o cliente provavelmente vai dizer
  resposta_objecao: string        // resposta pra MANDAR no WhatsApp depois do label
  abertura: string
  followup_d3: string
  followup_d7: string
  pre_engajamento_ig: string
  razao_ranking: string           // info INTERNA pro Eduardo (cliente nunca vê)
  nota_interna?: string           // instrução PRIVADA pro Eduardo fazer ANTES da abordagem (não é mensagem)
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
    resposta_objecao: 'Faz sentido — tu tem ética profissional alta. A LP que eu monto pra psicólogo é o oposto de copy agressiva: paleta clara, foto profissional, linguagem ética. A autoridade dos teus 135 avaliações 4.9 fala por si. Não vende "promessa de cura" — vende presença digital regulamentar. Pode te mostrar 2 LPs de psi que ranqueiam sem soar comercial?',
    nota_interna: 'Se ele fechar e a LP virar boa, propor o caso Gilson Afonso como prova social na pasta de trabalhos — virou um dos cases mais elegantes pra mostrar pra outros profissionais de saúde.',
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

  // ── TIER A (CIC 25/04) — 5 leads IG-only verificados via Claude in Chrome ──
  // Hashtags varridas: #modafemininapalmas, #modafestapalmas, #brechopalmas
  // Filtros duros aplicados (handle real do post + bio + engajamento + ticket).

  1096: {
    tier: 'A',
    posicao_no_tier: 7,
    dor: 'Brechó moderno com 13.7k seguidores, 14% engajamento (anomalia positiva — média do varejo IG é 1-3%), 5 categorias (roupas, bolsas, acessórios, sapatos, artesanato) e "frete pra todo Brasil" JÁ rodando via DM. Volume gigante invisível: cada peça = 8-15 mensagens trocadas (foto, medida, frete, pix, comprovante, código de envio). Ela já vende como uma loja — só não TEM uma.',
    gancho: 'Shopify pega o catálogo dela das 5 categorias, monta vitrine navegável + checkout MP (parcelamento 12x) + cálculo de frete automático Correios + rastreio. Ela responde DM pra dúvida real, não pra processar pedido. Mesmo volume, 1/4 do trabalho.',
    objecao: '"Já vendo muito bem assim, pra que mexer?" — base sólida (13.7k + 14% engaj) é argumento forte dela.',
    resposta_objecao: 'Faz total sentido — tu vende muito bem mesmo, é raro ver 14% engajamento em varejo. Mas pensa: se hoje tu fatura X respondendo DM o dia inteiro, quanto tu poderia faturar SEM responder DM de pagamento e frete? Shopify não substitui o teu Insta. Substitui só a parte burocrática. Cliente paga sozinho, escolhe frete sozinho, recebe rastreio automático. Tu fica livre pra postar mais achadinho — que é o que faz a magia funcionar.',
    nota_interna: 'TELEFONE TRUNCADO no JSON CIC ("(63) 92112-019" — só 8 dígitos). VALIDAR antes de mandar WhatsApp. Endereço confirmado: Quadra 404 Sul Alameda 2 Lote 20 QI 13, Palmas-TO 77021600. LEAD #1 do batch CIC — mais perfeito da semana. Pre-engajamento OBRIGATÓRIO via DM Instagram (não WhatsApp direto).',
    abertura: `Oi, beleza? Eduardo aqui, Impulso Digital, sou de Palmas.

Tô olhando os brechós mais fortes de Palmas essa semana e o teu chamou atenção pesado: 13.7k seguidores e 14% de engajamento (varejo bom fica em 1-3%, então tu tá num outro patamar).

Me parece que esse engajamento todo se traduz em DM. Muita DM. Cliente perguntando medida, frete, pix, comprovante.

Quanto da tua semana vai só pra responder essas mensagens hoje?`,
    followup_d3: `Oi, voltei. Pensando no teu caso: tu tem o ATIVO mais raro do varejo digital — 14% de engajamento. Esse é o motor. O Shopify não mexe nele, só desafoga o operacional. Tu tem 5 categorias prontas (roupa, bolsa, acessório, sapato, artesanato) — basicamente o esqueleto de uma loja. Topa eu te montar um protótipo da vitrine pra tu olhar?`,
    followup_d7: `Oi, última mensagem da minha parte. Sei que brechó vive de feeling de garimpo, e Insta serve isso bem. Mas todo brechó top que escalou (Maracujás Vintage SP, Brechó da Ju, Renovo Acervo) começou exatamente nesse ponto: virou Shopify pra parar de afogar em DM. Se um dia tu sentir que tá empacando em volume operacional, tu sabe onde me achar.`,
    pre_engajamento_ig: 'D-1 (24h antes): seguir, curtir 3 posts dos últimos 7 dias (priorizar achadinhos com muito comentário), comentar 1 com algo genuíno tipo "essa peça é incrível" ou referência ao item específico. Brechó vive de comunidade — engajamento real importa MUITO mais que pra outros nichos.',
    razao_ranking: 'LEAD #1 do batch CIC. 13.7k seg + 14% engajamento (anomalia positiva forte) + frete Brasil já operando = dor de operação invisível mas real. 5 categorias = vitrine pronta. Ticket médio brechó moderno (R$50-200/peça) com volume justifica Shopify (a partir de R$599). Pré-engajamento Insta obrigatório porque comunidade brechó valoriza relacionamento.',
  },

  1093: {
    tier: 'A',
    posicao_no_tier: 8,
    dor: 'Carpe Diem tem story FIXO chamado "Shop On-line" no perfil — sinal escancarado de que a Mirian (dona ativa, @mirian.pereiraa) JÁ SABE que precisa de loja online. Ou tentou e travou, ou tá em fila esperando alguém pra montar. 1.893 seg + 2.7% engajamento real (alto pra varejo) + 447 posts = catálogo robusto, base sólida. Falta o canal.',
    gancho: 'Não precisa convencer da NECESSIDADE — ela já sabe. O pitch é: "vi que tu tem story Shop On-line há um tempo e provavelmente travou em alguma coisa (preço, complexidade, achar quem fizesse). Eu monto em 7-10 dias, a partir de R$599, com 20 produtos cadastrados e treinamento". Pulo o convencimento, vou direto pra cotação.',
    objecao: '"Quanto custa?" — provável PRIMEIRA pergunta dela, porque ela já tá pesquisando.',
    resposta_objecao: 'A partir de R$599 — depende do tamanho do catálogo (tu tem 447 posts, então provavelmente é catálogo médio-grande, mas a gente fecha o número certo na call). Setup uma vez, sem mensalidade Impulso. Shopify cobra US$1/mês nos 3 primeiros meses, depois US$19/mês — direto com eles. Em 20 min de call eu te falo o número exato pro teu caso.',
    abertura: `Oi Mirian, beleza? Eduardo aqui, Impulso Digital, sou de Palmas.

Tô olhando lojas de moda feminina fortes em Palmas essa semana e a Carpe Diem chamou atenção. Mas o que me fez parar foi o story fixo "Shop On-line" no teu perfil.

Me parece que tu já tentou montar a loja online pelo menos uma vez e travou em alguma coisa — preço, complexidade ou esperando aparecer alguém pra fazer.

Em qual desses tu travou?`,
    followup_d3: `Oi Mirian, voltei. Pensando: tu tem 447 posts e 2.7% engajamento (alto pra varejo), ou seja, base pronta. O que falta é o canal. Eu monto Shopify em 7-10 dias, com 20 produtos cadastrados, treinamento de uso e tu vira pra Mercado Pago (parcelamento 12x). Topa eu te mostrar o protótipo antes mesmo de tu decidir?`,
    followup_d7: `Oi Mirian, última mensagem. Story "Shop On-line" parado no perfil é um custo silencioso — toda cliente que abre teu perfil vê que a loja "tá vindo". Quanto mais tempo passa, menos credibilidade. Se em algum momento tu quiser destravar isso, tu sabe onde me achar.`,
    pre_engajamento_ig: PRE_IG_PADRAO,
    razao_ranking: 'INTENT-AWARE LEAD. Story "Shop On-line" = sinal explícito de necessidade reconhecida. Pula etapa de convencimento — vai direto pra cotação. 447 posts = catálogo pronto. Mirian (dona) ativa visível. Ticket médio bom. Provável fechamento rápido.',
  },

  1087: {
    tier: 'A',
    posicao_no_tier: 9,
    dor: 'Mary Fashion tem 2.140 posts no Instagram — 5+ anos de catálogo acumulado. Quando cliente quer ver "o que tem em vermelho tamanho M", precisa rolar feed infinito. Volume de catálogo virou problema, não solução. Sem filtro, sem busca, sem categoria — Shopify resolve em 1 dia.',
    gancho: 'Shopify pega esses 2.140 posts e organiza nas peças que ainda estão em estoque (provavelmente 100-200 produtos ativos), com filtro por categoria, cor, tamanho, preço. O catálogo de 5 anos vira loja navegável em horas, não em rolagem.',
    objecao: '"Meu cliente já me conhece e vê pelo Insta" — argumento clássico de loja com base fiel.',
    resposta_objecao: 'Cliente fiel continua no Insta — perfeito, não mexe. Mas a CLIENTE NOVA, que viu uma referência tua num story compartilhado por amiga, ela abre teu Insta e vê 2.140 posts. Como ela acha o conjunto que viu? Ela não acha. Vai pra concorrência. Shopify pega esses 2.140 posts e vira "filtro por cor, tamanho, ocasião" — cliente nova compra sozinha, cliente fiel continua no DM.',
    abertura: `Oi, beleza? Eduardo aqui, Impulso Digital, falo de Palmas.

Tô olhando lojas de moda feminina mais consolidadas de Palmas essa semana. 2.140 posts no Insta é nível de catálogo que poucas lojas em Palmas tem.

Me parece que cliente fiel já te encontra rapidinho. Mas a cliente nova que abre teu perfil pela primeira vez vê 2.140 posts e... não sabe por onde começar.

Como ela acha hoje a peça que ela quer?`,
    followup_d3: `Oi, voltei. Pensando: 2.140 posts é ATIVO gigante, não problema — só precisa virar buscável. Shopify pega tua coleção atual (provavelmente 100-200 peças ativas), monta vitrine com filtro por cor/tamanho/ocasião e checkout direto. Cliente nova compra sem te mandar DM. Topa ver caso de outra loja com volume parecido que fez essa migração?`,
    followup_d7: `Oi, última mensagem. Loja com 5+ anos de feed tem ouro escondido — só precisa de organização pra cliente nova achar. Se em algum momento isso bater como prioridade, tu sabe onde me achar.`,
    pre_engajamento_ig: PRE_IG_PADRAO,
    razao_ranking: 'Volume de catálogo (2.140 posts) é ativo subutilizado. Loja consolidada com base fiel — argumento de cliente nova é o gancho. Provavelmente já fatura bem, então o pitch é ESCALA, não SEO.',
  },

  1092: {
    tier: 'A',
    posicao_no_tier: 10,
    dor: 'Lorenn parcela 3x cartão VIA DIRECT MESSAGE — cliente manda print do cartão pelo WhatsApp/DM, ela registra manualmente, processa em maquininha física. Pesadelo operacional + risco de fraude + chargeback fácil. Cada venda parcelada = 15-20 mensagens. Volume baixo (1.391 seg) mas conjunto R$195 = ticket médio decente. Mercado Pago integrado no Shopify resolve em 1 clique.',
    gancho: 'Shopify + Mercado Pago = parcelamento 12x automático, antifraude da plataforma, repasse direto na conta. Ela para de mandar cliente conferir 3x se vai cair certo, para de digitar dado de cartão de outra pessoa. Cliente paga, ela recebe notificação "pagamento aprovado", pronto.',
    objecao: '"Faço já há tempo, dá certo, cliente confia" — defesa do processo manual existente.',
    resposta_objecao: 'Faz sentido — tu construiu confiança forte com tua cliente. Mas cliente NOVA que nunca te conheceu não manda print do cartão dela pra estranha no WhatsApp — ela some. Mercado Pago resolve confiança da cliente nova (selo de plataforma conhecida), enquanto pra cliente fiel é ainda mais cômodo. E tu para de carregar a operação de cobrança nas costas.',
    nota_interna: 'TELEFONE TRUNCADO no JSON CIC ("(63) 92689-659" — só 8 dígitos no número, deveria ter 9). VALIDAR antes de disparar WhatsApp. Pre-engajamento via DM Instagram primeiro.',
    abertura: `Oi, beleza? Eduardo aqui, Impulso Digital, sou de Palmas.

Tô olhando lojas de moda feminina em Palmas essa semana e o teu chamou atenção: bio fala em parcelar 3x cartão via DM.

Me parece que cada cliente que parcela toma uns 15-20 minutos teus — print do cartão, conferência, máquina, comprovante. E cliente nova trava em "vou mandar dado do meu cartão por DM mesmo?" e some.

Quantas dessas tu acha que perde por mês?`,
    followup_d3: `Oi, voltei. Pensando: Mercado Pago integrado ao Shopify resolve essa parte em 1 clique. Cliente paga em ambiente seguro (com o selo "Pague com Mercado Pago" que todo brasileiro reconhece), tu recebe notificação automática, sem digitar dado de cartão de ninguém. Tu volta a postar e atender — não a operar maquininha. Quer ver?`,
    followup_d7: `Oi, última mensagem. Parcelamento via DM é gargalo silencioso — tu não sente quando perde a cliente que travou ali. Se em algum momento isso bater como prioridade, tu sabe onde me achar.`,
    pre_engajamento_ig: PRE_IG_PADRAO,
    razao_ranking: 'Dor MUITO clara e visível na bio (parcelamento DM). Ticket médio decente (conjunto R$195). Pequena (1.391 seg) mas com tração real. Shopify a partir de R$599 paga com 3-4 vendas. Probabilidade alta de fechar pelo argumento de operacional.',
  },

  1089: {
    tier: 'A',
    posicao_no_tier: 11,
    dor: 'Dborah Closet tem PROCESSO MADURO mas escala via DM: posta caption com preço E parcelamento ("vestido R$440 em 3x R$146 ou 6x R$73"), bio diz "Enviamos pra todo Brasil", 1.105 posts no catálogo. Ela já estruturou a oferta como uma loja real — só falta o checkout. Cliente que viu o caption pronto não pode clicar e comprar. Tem que mandar DM pra confirmar disponibilidade, pedido, frete, pix.',
    gancho: 'Shopify pega o que ela já faz manualmente (preço fixo + parcelamento + frete Brasil) e automatiza. Caption no Insta linka pra produto direto na loja. Cliente lê caption, clica, vê o tamanho dela, paga em 12x, escolhe frete Correios, pronto. Sem DM.',
    objecao: '"Já tenho fluxo, todo mundo me manda DM, dá certo" — operação consolidada.',
    resposta_objecao: 'Tu já criou metade da loja sem perceber: preço, parcelamento e frete Brasil já estão na tua bio e nos teus captions. Falta só o último click. Hoje a cliente lê o caption, vê que o vestido custa R$440 em 3x — mas pra fechar, tem que mandar DM, esperar tu responder, mandar foto da peça, perguntar tamanho, mandar pix... 30 min de jornada. Shopify reduz isso pra 2 min, sem te tirar do meio.',
    abertura: `Oi, beleza? Eduardo aqui, Impulso Digital, sou de Palmas.

Tô olhando lojas de moda feminina em Palmas essa semana e o teu chamou atenção. Caption com preço E parcelamento ("3x R$146 ou 6x R$73"), bio dizendo "enviamos pra todo Brasil" — tu já fez metade do trabalho de uma loja online sem ter loja online.

Me parece que cliente que lê caption tem que mandar DM pra fechar — o que mata 50% das vendas no caminho.

Tu sente esse buraco?`,
    followup_d3: `Oi, voltei. Pensando: tu já tem preço fixo + parcelamento + frete Brasil — basicamente o checkout estruturado, só sem o botão. Shopify pega tudo isso e vira clique direto. Caption do Insta linka pro produto, cliente paga em 12x sem DM. 1.105 posts viram catálogo navegável. Topa ver o protótipo?`,
    followup_d7: `Oi, última mensagem. Tu já é uma loja online — só falta a infraestrutura. Em algum momento essa transição vai fazer sentido. Tu sabe onde me achar.`,
    pre_engajamento_ig: PRE_IG_PADRAO,
    razao_ranking: 'PROCESSO MADURO sem ferramenta. Preço + parcelamento + frete Brasil já no caption = ela pensa como dona de loja online, só não tem o checkout. 1.105 posts = catálogo. Loja física + envio Brasil = volume real. Shopify cabe perfeito.',
  },

  // ── TIER A (CIC #2.5 v2 — 25/04 multi-nicho) — 3 leads-âncora score 8 ──
  // Hashtags varridas: suplementos, semi-joias, perfumaria. 35 perfis abertos,
  // 11 aprovados nos 7 filtros duros. Top 3 com score 8 ganham playbook customizado.

  1103: {
    tier: 'A',
    posicao_no_tier: 12,
    dor: 'Mara Camargo Semijoias tem 16 ANOS de curadoria, ticket alto (semijoia premium R$200-1.500), 3.047 posts no Instagram (catálogo gigantesco) e dona-marca que aparece em vídeos (decisão direta, sem comitê). MAS o foco é 100% LOCAL — atendimento exclusivo seg-sex 9h30-18h30 na 208 Sul. Cliente de fora de Palmas que quer aquela peça vista no Insta NÃO consegue comprar. 16 anos de catálogo digital sem checkout = oceano de receita escapando.',
    gancho: 'Shopify pega o catálogo dela (3.047 posts = ~800 peças únicas em rotação) e monta vitrine premium com filtro por categoria (anel, brinco, colar, pulseira) + parcelamento 12x + frete Brasil. Mara continua a curadoria + atendimento exclusivo no físico — Shopify só captura a cliente de fora que JÁ quer comprar. Posicionamento mantido (premium, não Shein), só destrava distribuição.',
    objecao: '"Meu negócio é atendimento exclusivo, presencial. Online tira a alma da marca." — defesa de valor da experiência.',
    resposta_objecao: 'Faz total sentido — atendimento exclusivo é teu diferencial e o teu cliente fiel ama isso. Shopify NÃO substitui isso. Pega só a cliente de FORA de Palmas que viu uma peça tua num story compartilhado e não consegue ir até a loja. Ela hoje desiste e compra outra. Com Shopify, ela compra a TUA peça, a curadoria continua tua, e tua cliente local continua sendo recebida no espaço. Tu ganha o canal nacional sem perder o atendimento.',
    nota_interna: 'LEAD ESTRATÉGICO TOP do batch CIC #2.5 v2. Dona-marca = decisão direta. Pre-engajamento OBRIGATÓRIO (curtir 3 posts editorial, comentar 1 sobre peça específica). Telefone (63)99975-4455 confirmado no perfil. Pitch da call de alinhamento é CRUCIAL aqui — projeto é "complexo" pelo volume de catálogo + branding premium, valor final provavelmente sobe pra R$899-1.199.',
    abertura: `Oi Mara, beleza? Eduardo aqui, Impulso Digital, sou de Palmas.

Tô olhando os negócios mais consolidados de Palmas essa semana e 16 anos de curadoria em semijoia premium é coisa rara. Tu construiu uma marca que tem identidade própria — não é "loja de joia", é Mara Camargo.

Me parece que tua cliente fiel ama o atendimento exclusivo na loja. Mas a cliente que mora em Goiânia, Brasília, São Paulo e viu uma peça tua no story de uma amiga — essa hoje desiste e compra outra coisa.

Quanto dessa cliente de fora tu acha que perde por mês?`,
    followup_d3: `Oi Mara, voltei. Pensando: 16 anos + 3.047 posts = catálogo digital que ninguém em Palmas tem. O que falta é só botão de compra. Shopify abriria mercado nacional sem mexer no atendimento exclusivo presencial — uma porta extra, não substituição. Topa eu te montar um protótipo da vitrine pra tu olhar antes de decidir?`,
    followup_d7: `Oi Mara, última mensagem da minha parte. Sei que decisão de marca consolidada não é compra de impulso — tu construiu isso ao longo de 16 anos. Só registro: peça única + ticket alto + dona-marca é exatamente o perfil que mais escala em Shopify quando faz a transição. Se um dia fizer sentido, tu sabe onde me achar.`,
    pre_engajamento_ig: 'D-1 OBRIGATÓRIO: seguir, curtir 3 posts editorial dos últimos 7 dias (priorizar peças com close-up e foto de modelo), comentar 1 com algo específico da peça ("essa pulseira ficou com um caimento incrível" ou referência ao material). Marca premium valoriza relacionamento — engajamento genérico queima.',
    razao_ranking: 'LEAD-ÂNCORA TOP do batch CIC #2.5 v2. Ticket alto + 16 anos curadoria + dona-marca decisão direta + 3.047 posts catálogo = case ideal Shopify pra escalar fora de Palmas. Foco LOCAL hoje é a oportunidade — destrava nacional. Pitch "complexo" (catálogo grande + branding premium), valor provável R$899-1.199 na call.',
  },

  1102: {
    tier: 'A',
    posicao_no_tier: 13,
    dor: 'One Suplementos tem 5 LOJAS FÍSICAS em Palmas, 12.300 seguidores, 437 posts, "envia para todo Brasil" declarado na bio, frete grátis Tocantins R$199,90+, conta verificada e link tree no perfil. Operação grande já vendendo nacional via DM/link tree. Cada pedido de fora = pedido por mensagem (estoque, frete, pix), 5 lojas pra coordenar inventário, link tree em vez de checkout real. É EV Suplementos Injetáveis em escala maior — exatamente o caso GB Nutrition pronto pra Shopify.',
    gancho: 'Shopify resolve 3 dores em 1: (a) checkout único com cálculo de frete automático (cliente paga sozinho, escolhe motoboy ou Correios), (b) catálogo unificado com estoque por loja (cliente vê o que tem perto e retira), (c) substitui link tree por loja real (legitimidade pra cliente novo). Mesma operação, 1/3 do trabalho de DM, 3x o ticket médio porque cliente compra cesta em vez de 1 item.',
    objecao: '"Já vendemos pelo Brasil, dá certo. Por que mexer?" — operação madura defendendo o status quo.',
    resposta_objecao: 'Entendo — vocês construíram operação que funciona, raríssimo nesse setor. Mas pensa: hoje o cliente de Cuiabá que viu vocês pelo Insta tem que mandar mensagem, esperar resposta, perguntar frete, mandar pix. Quantos desistem nessa jornada? No Shopify ele paga em 5 min, escolhe Correios ou motoboy, e vocês recebem o pedido pronto. Mesma operação — só sem o gargalo da DM. Topa eu te mostrar caso de Distribuidora de SP que fez essa migração e dobrou volume?',
    nota_interna: 'OPERAÇÃO MADURA — não pitchar como entry-level Shopify. Pitch deve ser de UPGRADE de canal, não criação. Validar se já tem ERP (provável) — Shopify integra com Bling, Tiny e ContaAzul (o que já usa). Telefone NÃO veio direto no JSON (link tree) — pegar número do link tree antes de disparar. Projeto provavelmente "complexo" — múltiplas lojas, integração ERP, talvez Premium R$1.497+.',
    abertura: `Oi, beleza? Eduardo aqui, Impulso Digital, sou de Palmas.

Tô olhando as operações de suplemento mais sólidas de Palmas essa semana. 5 lojas físicas + envio Brasil declarado + verificação Insta — isso é nível de operação que eu não esperava encontrar em loja palmense.

Me parece que vocês construíram operação madura. Mas o gargalo agora é diferente do que era no início: cliente novo de Cuiabá manda DM perguntando estoque/frete/pix e desiste no caminho.

Quanto vale esse cliente que se perde no DM?`,
    followup_d3: `Oi, voltei. Pensando no caso de vocês: 5 lojas + Brasil é distribuição que loja única não tem. Shopify daria checkout unificado com cálculo de frete automático + estoque por loja física (cliente vê o que tem perto e retira). Tem caso real disso em distribuidora de SP que dobrou volume nos primeiros 90 dias. Topa ver?`,
    followup_d7: `Oi, última mensagem. Operação de vocês é grande demais pra Shopify entry-level — meu pitch normal não cabe. Mas se em algum momento vocês quiserem conversar sobre upgrade de canal (não substituição da operação atual, agregação), tu sabe onde me achar.`,
    pre_engajamento_ig: 'D-1: seguir, curtir 2 posts (priorizar lançamentos/promoções recentes — operação grande gosta de feedback de mercado), NÃO comentar (operação madura recebe muitos comentários genéricos, queima rápido). Pre-warming via consumo do conteúdo, não via interação social.',
    razao_ranking: 'CASO GB NUTRITION EM ESCALA MAIOR. 5 lojas + Brasil declarado + verificado = operação que JÁ pensa nacional. Ticket alto-médio (suplemento R$80-300), volume grande. Shopify destrava 3-5x. Pitch enterprise/complexo (não entry-level). Probabilidade de fechamento depende de quem decide (sócio único? 5 sócios?) — qualificar antes.',
  },

  1104: {
    tier: 'A',
    posicao_no_tier: 14,
    dor: 'L\'Essence é a ÚNICA perfumaria de luxo importada do Capim Dourado Shopping (maior shopping de Palmas). Ticket altíssimo (Bad Boy Carolina Herrera, importados árabes, faixa R$300-1.500), 1.085 posts (catálogo robusto), foto editorial. Mas opera 100% LOCAL — quem mora fora de Palmas e quer importado original (não falsificado de marketplace) não tem onde comprar com selo de autenticidade. Oceano azul: Shopify abre mercado nacional pra perfume importado palmense.',
    gancho: 'Shopify com selo "Perfumaria autorizada do Capim Dourado" + nota fiscal eletrônica visível + política de troca clara + parcelamento 12x = resolve a DOR DE AUTENTICIDADE que perfume importado tem. Cliente que vai gastar R$800 num Bad Boy não compra de Insta sem CNPJ — mas compra de Shopify com selo institucional. Mesma loja, alcance nacional. Ticket R$500-1.500 paga Shopify com 1-2 vendas.',
    objecao: '"Já tenho clientela fiel no shopping, vendo bem" — operação física consolidada.',
    resposta_objecao: 'Faz sentido — clientela fiel do Capim Dourado é tua base. Shopify não mexe nela. Mas pensa: tu é a ÚNICA perfumaria importada de luxo no shopping. Em Palmas inteira, em Tocantins, em todo o entorno. Quem em Goiânia, Brasília, Imperatriz quer comprar Bad Boy ORIGINAL e desconfia de marketplace — esse cliente hoje vai pra Sephora ou Beleza na Web. Shopify com selo "Perfumaria autorizada" pega exatamente esse cliente. 1 venda de R$800 paga 1/3 do investimento. Topa eu te mostrar 1 perfumaria que fez essa transição?',
    nota_interna: 'TICKET ALTÍSSIMO = ROI rápido. Único do nicho em Palmas + entorno = oceano azul. Telefone não veio no JSON (linktr.ee/PerfumariaLessence) — pegar do link tree antes de disparar. Pitch da CALL DE ALINHAMENTO é crítico: pode argumentar Premium (R$1.297+) pelo branding luxo + integração com NF-e + selo de autenticidade. Confirmar antes na call quem é dono(a) — perfume importado tem decisor único geralmente.',
    abertura: `Oi, beleza? Eduardo aqui, Impulso Digital, sou de Palmas.

Tô olhando as perfumarias mais consolidadas de Palmas essa semana e a L'Essence chamou atenção: única perfumaria importada de luxo no Capim Dourado. Não é "perfumaria" — é a perfumaria de Palmas.

Me parece que cliente local fiel já vai aí. Mas quem mora em Goiânia, Imperatriz, Brasília e quer Bad Boy ORIGINAL com nota fiscal — esse hoje vai pra Sephora ou Beleza na Web.

Quantos desses tu acha que perde por mês?`,
    followup_d3: `Oi, voltei. Pensando no teu caso: perfume importado tem dor escancarada de AUTENTICIDADE. Cliente que vai gastar R$800 num importado não compra de Insta sem CNPJ. Shopify com selo "Perfumaria autorizada Capim Dourado" + NF-e visível + política de troca = resolve isso. 1 venda de R$800 paga 1/3 do investimento. Topa ver?`,
    followup_d7: `Oi, última mensagem da minha parte. Tu é a única perfumaria de luxo do Capim Dourado — esse posicionamento vale ouro online. Hoje a busca "perfume importado original Tocantins" não tem dono. Quem chegar primeiro fica com o nicho por anos. Se em algum momento isso bater como prioridade, tu sabe onde me achar.`,
    pre_engajamento_ig: 'D-1: seguir, curtir 2 posts (priorizar lançamentos e fotos editoriais — perfumaria luxo valoriza estética). Comentar 1 com algo SEMPRE específico ao perfume mostrado ("Bad Boy é uma das fragrâncias mais procuradas mesmo" ou referência a notas olfativas se conseguir identificar). Comentário genérico tipo "lindo!" queima a abordagem.',
    razao_ranking: 'OCEANO AZUL — única perfumaria importada de luxo em Palmas + entorno. Ticket altíssimo (R$300-1.500) = ROI Shopify rápido. Dor de AUTENTICIDADE escancarada (clássica de importado). Shopify resolve cirurgicamente. Pitch Premium provável na call (R$1.297+) — branding luxo + NF-e + selo institucional justificam.',
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
    objecao: 'Possível confusão dela mesma: "essa mensagem é pra quem?" — ela pode não se reconhecer como "Tatiane" se ela se promove como "@nutripridbarros".',
    resposta_objecao: 'Faz sentido. Me parece que tu tá num momento de transição e por isso o nome ainda tá em duas frentes. LP resolve exatamente esse limbo: domínio próprio + foto + posicionamento no nome que tu QUER fortalecer = paciente novo bate o martelo no canal certo. Sem apagar o histórico do outro nome — só centralizando autoridade.',
    nota_interna: 'INVESTIGAR IG antes de disparar. Se @nutripridbarros for a marca principal hoje, abordar como "nutri Pridbarros" em vez de "Tatiane" pra ela se reconhecer na primeira mensagem.',
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
    resposta_objecao: 'Sem stress se eu errei o número — só me confirma "é da Doxsen?" que eu sigo ou abandono. Não quero te tomar tempo com pitch errado.',
    nota_interna: 'QUALIFICAR ANTES DE PITCH. Confirmar identidade na 1ª mensagem ("é da Doxsen mesmo?"). Se confirmar = segue com pitch Tier A normal. Se não = abandona, atualiza banco com "telefone errado" e foca em outro lead. NÃO investir 30 min pesquisando antes de saber se é a empresa certa.',
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
    resposta_objecao: 'Faz total sentido — a Racco tem regra apertada pra revendedora. Mas o que eu te ofereço NÃO é loja de produto Racco. É LP pessoal TUA, vendendo o teu SERVIÇO de consultora (atendimento, consultoria, visita domiciliar) com "pegue sua consultora de confiança em Palmas". Isso a matriz permite. A partir de R$499 (cotação exata na call). Topa eu te mostrar 1 caso de consultora que faz isso?',
    nota_interna: 'IMPORTANTE: NÃO oferecer Shopify (vai contra regra Racco). REPOSICIONAR pra LP pessoal R$499 (serviço, não produto). Confirmar antes de pitchar se ela é consultora autorizada ou ponto físico independente — muda tudo.',
    abertura: `Oi, beleza? Eduardo aqui, Impulso Digital, sou de Palmas.

Olha — vi a Racco no Google, 5 com 63 avaliações. Antes de te pitchar qualquer coisa, preciso entender:

Tu é consultora autorizada Racco ou dona de um ponto físico independente? Pergunto porque a Racco tem regra de marketing pra revendedora, e a solução que faz sentido pra ti muda completamente dependendo de qual dos dois.`,
    followup_d3: `Oi, voltei. Se tu é consultora Racco autorizada, tem um ângulo legal — LP pessoal de consultora (não Shopify) mostrando "pegue sua consultora de confiança em Palmas" + agendamento. A matriz permite isso. Se for ponto físico independente, a coisa muda. Como tu vê?`,
    followup_d7: `Oi, última msg. Sei que regra de matriz cosmética é apertada. Se em algum momento tu quiser construir presença pessoal (consultora-marca, não a Racco), me chama. Senão, sem stress.`,
    pre_engajamento_ig: 'Pular pré-engajamento — qualifica primeiro o modelo de negócio.',
    razao_ranking: 'Qualificação duvidosa (revendedora vs. dona). Shopify provavelmente não cabe legalmente. Requer mudar oferta pra LP pessoal. Não perder tempo até esclarecer modelo de negócio.',
  },
}
