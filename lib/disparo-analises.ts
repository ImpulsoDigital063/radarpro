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
    dor: 'Mara Camargo Semijoias tem 16 ANOS de curadoria, ticket alto (semijoia premium R$200-1.500), 3.047 posts no Instagram (catálogo gigantesco) e dona-marca que aparece em vídeos (decisão direta, sem comitê). DUAS DORES SOBREPOSTAS: (1) foco 100% LOCAL — atendimento seg-sex 9h30-18h30 na 208 Sul; cliente de fora não consegue comprar. (2) DOR INVISÍVEL DESCOBERTA NO BATCH CIC #4: ela vende em "site de plataforma multi-vendedor" (provável joalheria multi-marca) — ou seja, ELA JÁ ENTENDEU que precisa de canal online, mas tá pagando comissão pra plataforma de terceiro hospedar peças dela junto com de outras lojistas. Marca premium dividindo vitrine = perde força de identidade.',
    gancho: 'Shopify pega o catálogo dela (3.047 posts = ~800 peças únicas em rotação) e monta vitrine premium PRÓPRIA com filtro por categoria (anel, brinco, colar, pulseira) + parcelamento 12x + frete Brasil. DOIS argumentos sobrepostos: (a) destrava cliente de fora de Palmas, (b) ELA SAI DA PLATAFORMA MULTI-VENDEDOR — para de pagar comissão e de dividir vitrine com concorrente. Domínio próprio = "maracamargo.com.br" (não "plataformaX.com.br/maracamargo"). Mara continua atendimento exclusivo no físico, só agora também tem CASA digital própria.',
    objecao: '"Meu negócio é atendimento exclusivo, presencial. Online tira a alma da marca." OU "Já vendo no [site da plataforma], ali já é online, pra que outro?"',
    resposta_objecao: 'Faz total sentido — atendimento exclusivo é teu diferencial e cliente fiel ama isso. Shopify NÃO substitui isso, e a plataforma multi-vendedor não substitui ele também. Pensa assim: quando alguém digita "Mara Camargo semijoia" no Google, hoje cai no perfil teu DENTRO da plataforma multi-vendedor — ali tu compete por atenção com outras 30 lojistas, paga comissão e a marca premium fica diluída. No teu domínio próprio, é só TUA vitrine, tua narrativa de curadoria, sem rateio. Mesma cliente de fora chegando, sem comissão, sem competir com vizinha de plataforma. Topa eu te mostrar como ficaria?',
    nota_interna: 'LEAD ESTRATÉGICO TOP do batch CIC #2.5 v2 + reforçado no batch #4 (insight da plataforma multi-vendedor). Dona-marca = decisão direta. INVESTIGAR antes da call: descobrir QUAL é a plataforma multi-vendedor onde ela vende hoje (provavelmente joalheria multi-marca tipo Anelinha/Joia Nice/etc) — esse dado vira munição pesada de pitch ("vou te mostrar quanto tu paga de comissão por mês na plataforma X que tu poderia investir uma vez só na tua loja própria"). Pre-engajamento OBRIGATÓRIO. Telefone (63)99975-4455 confirmado. Pitch "complexo" (catálogo grande + branding premium + integração com plataforma atual pra migração suave), valor provável R$899-1.199 na call.',
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

  // ── TIER A (CIC #3 — 25/04 saúde estética/Erlane) — 4 leads LP ──────
  // Hashtags varridas: 6 (soroterapia, harmonização, emagrecimento, drip,
  // vitaminas, biomédica/farmacêutica esteta). 25 perfis abertos, 4 aprovados
  // nos 8 filtros duros + 1 borderline pra qualificar manual.
  // Case-clone Erlane confirmado em @veronicalima.enf.

  1108: {
    tier: 'A',
    posicao_no_tier: 15,
    dor: 'Verônica é o CASE-CLONE EXATO da Erlane (EV Suplementos Injetáveis): enfermeira esteta autônoma (sufixo .enf indica COREN), habilitada em Ozonioterapia, atende suplementação injetável + soroterapia + ozonioterapia + Coenzima Q10 + B12 em Palmas-TO. 1.315 seguidores no sweet spot, 137 posts, último há 18 dias. Operação inteira gira no DM/wa.me — quem vai pagar R$200-400 numa sessão de injetável quer ver site profissional com protocolos, antes/depois, biografia técnica e agendamento estruturado, não link tree.',
    gancho: 'PITCH ESPELHO da Erlane: "Verônica, vi tua operação e ela é praticamente idêntica à da Erlane Vieira (@evsuplementosinjetaveis). Mesmo serviço-âncora (suplementação injetável + soroterapia), mesma identidade visual, mesmo gargalo wa.me. Ela construiu uma LP profissional — evsuplementosinjetaveis.com — que parou de depender só do DM e capturou paciente novo do Google. Posso te mostrar o que mudou na operação dela?". Case real ESPECÍFICO + persona-clone = pitch zero genérico.',
    objecao: '"Meu paciente vem por indicação, não preciso de site" — clássico de profissional autônoma de saúde.',
    resposta_objecao: 'Faz total sentido — paciente de injetável vem MUITO por indicação, é como o nicho funciona. Mas pensa: a paciente que ouviu falar de ti pela amiga e vai pesquisar "Verônica Lima enfermeira Palmas" antes de marcar — ela hoje cai no teu Insta. Vê 1.315 seguidores, posts misturados, link wa.me sem contexto. Comparar com a Erlane: paciente cai numa LP profissional com biografia, lista de protocolos, antes/depois categorizado, formulário de pré-anamnese. Mesma indicação, conversão diferente. Topa eu te mostrar a diferença em 1 print?',
    nota_interna: 'CASE-CLONE da Erlane (EV Suplementos Injetáveis) = pitch de venda mais forte do batch CIC. **REFORÇADO no batch CIC #7**: Verônica é REPLICA 1:1 da Erlane — mesma cidade (Palmas), mesma profissão paramédica (enfermeira esteta), mesmo serviço (suplementação injetável + soroterapia + ozônio), mesmo canal (wa.me sem site). Erlane vira PROVA SOCIAL LITERAL LOCAL (raríssimo em prospecção de cidade média — case da MESMA cidade, não exemplo distante). **AÇÃO ESPECIAL**: pedir permissão da Erlane antes de disparar pra usar nome dela explicitamente + checar se ela conhece Verônica pessoalmente (em Palmas, indicação cruzada da própria persona-mãe é o atalho de fechamento mais rápido). Telefone NÃO veio direto (wa.me/message/R3QWJIHAGS6CF1) — abrir o link wa.me, capturar número e validar antes de disparar. Pre-engajamento OBRIGATÓRIO via Insta D-1.',
    abertura: `Oi Verônica, beleza? Eduardo aqui, Impulso Digital, sou de Palmas.

Tô olhando enfermeiras estetas autônomas em Palmas essa semana e o teu perfil chamou atenção forte — operação igualzinha a uma profissional que eu acompanho há um tempo, a Erlane (EV Suplementos Injetáveis).

Me parece que a tua operação inteira hoje gira pelo DM e wa.me. Funciona, mas a paciente nova que ouviu falar de ti pesquisa "Verônica Lima enfermeira Palmas" antes de marcar — e cai no Insta sem contexto.

Posso te mostrar o que a Erlane mudou na operação dela quando saiu do mesmo lugar?`,
    followup_d3: `Oi Verônica, voltei. Pensando no teu caso vs Erlane: ela tinha exatamente o teu setup (sessão R$200-400, soroterapia + injetável, COREN, atendimento por horário marcado). Quando lançou evsuplementosinjetaveis.com, parou de explicar protocolo no DM 50x por dia — paciente novo já chegava informado. Topa eu te mostrar 1 print da diferença?`,
    followup_d7: `Oi Verônica, última mensagem. Sei que rotina de enfermeira esteta autônoma é puxada — atender + protocolar + responder DM + pegar material. Vou parar de mandar. Só registro: a Erlane está atendendo praticamente full há 6 meses por causa da LP — não foi mágica, foi infraestrutura. Se um dia isso fizer sentido pra ti, tu sabe onde me achar.`,
    pre_engajamento_ig: 'D-1 OBRIGATÓRIO: seguir, curtir 2-3 posts técnicos (protocolos de soroterapia, vitaminas específicas — não foto pessoal). Comentar 1 com algo do tipo "vitamina B12 injetável tem feito diferença grande nesses protocolos mesmo" ou referência ao protocolo específico. Profissional de saúde valoriza pre-engajamento técnico, não emoji elogio.',
    razao_ranking: 'CASE-CLONE EXATO da Erlane (LEAD-ÂNCORA do Prompt #3 CIC). Perfil que MAIS se aproxima do nosso case real (EV Suplementos Injetáveis): mesma profissão, mesmo serviço, mesmo gargalo wa.me, mesma identidade visual (cor coral, nome.enf). Ticket recorrente (R$200-400 sessão mensal). LP a partir de R$499 paga com 2-3 sessões. Pitch ESPELHO = zero objeção de relevância.',
  },

  1109: {
    tier: 'A',
    posicao_no_tier: 16,
    dor: 'Dra. Christiana é endocrinologista solo CRM-TO 8510 RQE 3994 com endereço explícito (Av. Teotônio Segurado Q401 Lote 01 Sala 905). Conteúdo técnico altíssima qualidade (postou há 3 dias sobre Wegovy/Rybelsus). 2.595 seg, 191 posts, autoridade médica máxima visível em bio + posts. Tem linktr.ee mas falta LP DEDICADA às canetas emagrecedoras (Mounjaro/Ozempic/Wegovy/Tirzepatida) — esse subnicho é o NICHO MAIS QUENTE em saúde estética Palmas hoje, e o paciente que pesquisa "Mounjaro Palmas TO" cai num linktr.ee genérico sem contexto.',
    gancho: 'LP dedicada às CANETAS EMAGRECEDORAS: explicação técnica de cada análogo GLP-1 (semaglutida vs tirzepatida), critérios de elegibilidade, FAQ ("preciso usar pra sempre?", "convênio cobre?", "diferença Ozempic vs Wegovy"), antes/depois categorizado, agendamento estruturado, biografia médica com CRM+RQE em destaque. Captura Google + tráfego pago do "Mounjaro Palmas". Linktr.ee continua, mas a LP vira o destino oficial pro paciente que quer protocolo, não lista de links.',
    objecao: '"Meu Insta tá indo bem, paciente já me acha" — operação ativa que sente que tá no controle.',
    resposta_objecao: 'Tu tem MUITO conteúdo técnico bom no Insta, raríssimo de ver — concordo que gera autoridade. Mas pensa: o paciente que ouviu falar de Mounjaro semana passada e abriu Google às 23h pra pesquisar "Mounjaro Palmas TO segura?" — esse cai no linktr.ee teu, vê 4 links sem hierarquia e sai pesquisando outra coisa. Hoje o linktr.ee é "tá tudo aqui", mas pra paciente novo é "qual desses é meu próximo passo?". LP dedicada vira "AQUI ESTÁ TUDO SOBRE CANETAS EMAGRECEDORAS COMIGO" — captura exatamente esse momento de pesquisa intensa.',
    nota_interna: 'NICHO MAIS QUENTE de saúde estética Palmas (canetas GLP-1). Endereço explícito + CRM+RQE + atividade alta = perfil de altíssima conversão se LP for específica e técnica. Tem linktr.ee — pegar o número via lá antes de disparar (telefone da bio (63)99426-6093 confirmado mas validar se é WhatsApp). Pitch técnico sério (não "promessa de emagrecimento") — médica não compra fluffy.',
    abertura: `Oi Dra. Christiana, beleza? Eduardo aqui, Impulso Digital, sou de Palmas.

Tô olhando endocrinologistas autônomos em Palmas essa semana e o teu perfil chamou atenção forte — conteúdo técnico de canetas emagrecedoras é dos mais sólidos que vi (vi teu post de 3 dias atrás sobre Wegovy/Rybelsus oral vs injetável).

Me parece que tu sente que o Insta capta paciente novo. Mas o que pesquisa "Mounjaro Palmas TO" no Google às 23h cai no teu linktr.ee — vê 4 links sem hierarquia e some.

Quanto desse paciente novo tu acha que perde por mês?`,
    followup_d3: `Oi Dra. Christiana, voltei. Pensando: canetas GLP-1 é o nicho que mais cresce em endocrino agora. Quem pesquisa Mounjaro/Wegovy gasta 30-60 min lendo antes de marcar consulta. LP dedicada com explicação técnica de cada análogo, critérios de elegibilidade, FAQ específico = vira destino oficial pra esse paciente em vez de linktr.ee. Posso te mostrar 1 LP médica que ranqueia em "Mounjaro [cidade]"?`,
    followup_d7: `Oi Dra. Christiana, última mensagem da minha parte. Sei que rotina de endocrino solo é apertada. Vou parar de mandar. Só registro: o paciente de Palmas que vai usar caneta emagrecedora nos próximos 5 anos pesquisa MUITO antes — quem aparecer primeiro com LP técnica fica com o nicho. Hoje essa busca em Palmas é dominada por linktr.ees e Insta — espaço enorme de SEO local. Tu sabe onde me achar.`,
    pre_engajamento_ig: 'D-1: seguir, curtir 2 posts técnicos recentes (priorizar os de Wegovy/Rybelsus/Tirzepatida — não estilo de vida). NÃO comentar — médica recebe muito comentário genérico de paciente. Pre-warming via consumo do conteúdo, não interação. Mensagem WhatsApp já chega quente porque ela vai ver "Eduardo Barros começou a seguir você" no painel.',
    razao_ranking: 'NICHO MAIS QUENTE em saúde estética Palmas (canetas GLP-1). Autoridade máxima visível (CRM+RQE), endereço explícito, conteúdo técnico ativo, 191 posts. Tem linktr.ee = sinaliza que reconhece necessidade de "lugar único" mas usa solução amadora. Upgrade pra LP profissional = pitch claro de evolução, não criação. Ticket alto recorrente (consulta R$300-500 + acompanhamento mensal). LP a partir de R$499.',
  },

  1110: {
    tier: 'A',
    posicao_no_tier: 17,
    dor: 'Dra. Thais é endocrinologista hiperativa: 358 posts, postou ONTEM (Tirzepatida + musculação), CRM-TO 4746 + RQE 2691 + RQE 3067 (especialização dupla), atende Porto Nacional + Palmas. JÁ TEM contate.me/thaismahassem mas é LP GENÉRICA (linktr.ee renomeado, sem identidade médica nem foco de serviço). Volume de conteúdo + autoridade dupla + operação cross-cidade = perfil que precisa de LP estruturada PRA SE DIFERENCIAR — endocrinologista padrão tem linktr.ee, ela precisa de diferencial digital tão técnico quanto o conteúdo dela.',
    gancho: 'LP UPGRADE — não criação. Pitch é "tu já tem contate.me, ele cumpre função básica mas não converte como o conteúdo merece. Eu monto LP profissional dedicada com biografia médica completa, lista de serviços categorizada (emagrecimento Mounjaro / menopausa / reposição hormonal), antes/depois com cuidado ético, agendamento integrado, integração WhatsApp Business, 3 artigos SEO sobre Tirzepatida pra rankear no Google". Mantém o contate.me (não desligar) e posiciona LP como página principal.',
    objecao: '"Já tenho contate.me, tá funcionando" — operação ativa defendendo solução existente.',
    resposta_objecao: 'Faz total sentido — contate.me cumpre o básico (link bio + cards de contato). Mas teu CONTEÚDO médico é técnico, ativo (postou ontem!), e teu posicionamento é endocrino com Tirzepatida + reposição hormonal. Cliente novo que vê teu post sobre Mounjaro chega no contate.me e vê só "AGENDAR" sem contexto. LP profissional pega esse momento e converte: explicação do serviço, biografia médica com CRM+RQE em destaque, FAQ por procedimento, formulário de pré-anamnese pra qualificar paciente antes da consulta. Mesma porta, conversão diferente. Topa ver?',
    nota_interna: 'JÁ TEM contate.me — pitch é UPGRADE, não criação (não soar "cria do zero"). Atende Palmas + Porto Nacional, então LP precisa de geo-segmentação clara (qual paciente atendido onde). Telefones que vieram no JSON CIC são FIXOS ((63)33631333, (63)32286093) — pegar celular WhatsApp via contate.me/thaismahassem antes de disparar.',
    abertura: `Oi Dra. Thais, beleza? Eduardo aqui, Impulso Digital, sou de Palmas.

Tô olhando endocrinologistas autônomos em Palmas/Porto Nacional essa semana e o teu perfil chamou atenção — 358 posts, postou ontem sobre Tirzepatida + musculação, CRM+RQE em destaque. Conteúdo técnico ativo desse nível é raro de ver.

Me parece que teu contate.me cumpre função básica de "agendar" — mas teu conteúdo médico é nível bem acima disso. O paciente novo que vê teu post sobre Mounjaro chega num "AGENDAR" sem contexto, e desiste.

Quanto vale, em paciente perdido por mês, esse buraco entre conteúdo técnico e LP genérica?`,
    followup_d3: `Oi Dra. Thais, voltei. Pensando: contate.me não desliga — continua útil. Mas LP profissional dedicada vira destino principal quando paciente novo pesquisa "endocrinologista Palmas Tirzepatida". Inclui biografia médica completa, FAQ por procedimento, agendamento integrado, 3 artigos SEO. Captura tráfego que hoje cai em "AGENDAR" vazio. Posso te mostrar 1 caso real disso?`,
    followup_d7: `Oi Dra. Thais, última mensagem. Sei que rotina de endocrino com 2 cidades é apertada. Vou parar de mandar. Só registro: teu posicionamento de Tirzepatida + reposição hormonal é nicho que cresce muito agora — LP profissional dedicada captura essa janela de busca antes de saturar. Tu sabe onde me achar.`,
    pre_engajamento_ig: 'D-1: seguir, curtir 2 posts técnicos recentes (Tirzepatida, reposição hormonal — não foto pessoal). NÃO comentar (médica hiperativa recebe muitos comentários genéricos, queima). Pre-warming via consumo do conteúdo.',
    razao_ranking: 'OPERAÇÃO HIPERATIVA com autoridade dupla (RQE 2691 + RQE 3067) e cross-cidade. Já tem contate.me = reconheceu necessidade de hub digital. UPGRADE pra LP profissional dedicada vira pitch de evolução, não criação. NICHO QUENTE (endocrino + Tirzepatida + reposição). LP a partir de R$499.',
  },

  1111: {
    tier: 'A',
    posicao_no_tier: 18,
    dor: 'Dra. Mariella é médica nutróloga ativa em DUAS CIDADES (Palmas-TO no Health Plennus + Goiânia-GO no Núcleo Dr. Paulo Fernando). 5.518 seguidores, 122 posts, último há 5 dias. Operação dividida entre cidades = paciente confuso "ela atende em Palmas mesmo? Em qual dia? Como agendar?". Linktr.ee funciona como "tá tudo aqui" mas DILUI o público de Palmas com o de Goiânia. Quem mora em Palmas e pesquisa "nutrólogo emagrecimento Palmas" cai numa página que mistura agenda das duas cidades.',
    gancho: 'LP GEO-SEGMENTADA Palmas. Página dedicada ao público palmense com endereço Health Plennus em destaque, dias de atendimento Palmas explícitos, agendamento direto, biografia médica + CRM, FAQ específico de Palmas (convênios locais, integrações com clínicas parceiras). Goiânia continua via linktr.ee ou LP separada futura. Cliente palmense vira o foco — não compete com agenda Goiânia pela atenção.',
    objecao: '"Meu linktr.ee tem tudo, paciente vê e agenda" — solução genérica funcional.',
    resposta_objecao: 'Faz sentido — linktr.ee centraliza tudo, e é prático. Mas pensa pelo lado da paciente palmense: ela pesquisa "nutrólogo Palmas emagrecimento", chega no linktr.ee teu e vê 5 links — agenda Palmas, agenda Goiânia, Insta, WhatsApp, blog. Ela tem que adivinhar qual é dela. LP geo-segmentada Palmas vira "AQUI É O TEU LUGAR SE TU ESTÁ EM PALMAS" — endereço Health Plennus em destaque, dias de atendimento, formulário pré-anamnese. Goiânia continua intacta no linktr.ee. Mesma operação, conversão melhor pro público de Palmas.',
    nota_interna: 'CRM NÃO FOI VALIDADO no scrape CIC (campo null por rigor). Pre-checar manualmente o perfil antes de disparar — confirmar registro médico explícito. Telefone via linktr.ee/mariellazanchett — pegar celular WhatsApp Palmas antes de disparar. Ângulo geo-segmentação é o diferencial: ela JÁ tem solução, pitch é OTIMIZAÇÃO PARA PALMAS, não criação do zero.',
    abertura: `Oi Dra. Mariella, beleza? Eduardo aqui, Impulso Digital, sou de Palmas.

Tô olhando médicas nutrólogas que atendem em Palmas essa semana e o teu perfil chamou atenção — atendimento Palmas (Health Plennus) + Goiânia (Núcleo Paulo Fernando), 5.500+ seg, conteúdo técnico ativo.

Me parece que teu linktr.ee centraliza tudo. Funciona pra paciente que já te conhece. Mas a paciente NOVA palmense que pesquisa "nutróloga Palmas emagrecimento" cai num linktr.ee dividido entre 2 cidades e tem que adivinhar qual link é dela.

Quanto desse paciente novo de Palmas tu acha que perde por mês?`,
    followup_d3: `Oi Dra. Mariella, voltei. Pensando: linktr.ee não desliga (Goiânia continua precisando). Mas LP geo-segmentada Palmas — endereço Health Plennus em destaque, dias palmas explícitos, agendamento direto, formulário pré-anamnese local — captura a paciente palmense sem competir com Goiânia. Topa eu te mostrar 1 caso de médico que tem 2 cidades e fez LP por geo?`,
    followup_d7: `Oi Dra. Mariella, última mensagem. Operação cross-cidade é normal pra médico que cresce — mas paciente decide por geografia, não por linktr.ee unificado. Se em algum momento isso fizer sentido como otimização local, tu sabe onde me achar.`,
    pre_engajamento_ig: 'D-1: seguir, curtir 2 posts técnicos (saúde hormonal feminina, emagrecimento metabólico — priorizar conteúdo Palmas se conseguir identificar). NÃO comentar (médica recebe muitos genéricos).',
    razao_ranking: 'DOR DE GEO-SEGMENTAÇÃO clara (atende 2 cidades com 1 hub digital). Pitch de OTIMIZAÇÃO PARA PALMAS, não criação. Médica nutróloga = nicho com paciente que pesquisa muito. LP Palmas-only captura busca local sem disputa Goiânia. LP a partir de R$499. CRM não validado no scrape — pre-checar.',
  },

  // ── TIER A (CIC #4 — 25/04 multi-canal validação cruzada) — 2 leads ──
  // Batch #4 falhou em volume (Capim Dourado/ML bloqueados, Shopee infértil)
  // mas gerou validação cruzada Google Business + insights sobre site atual.
  // Mobiliare upgrade (já tem .com.br) + Owen com perfil TikTok ativo.

  1107: {
    tier: 'A',
    posicao_no_tier: 19,
    dor: 'Mobiliare Móveis tem 14 anos no mercado, móveis design autoral (mesa madeira maciça, ticket R$1.500-15.000 por peça), 10.300 seguidores no Insta, 335 posts editorial, fotos sofisticadas. ENDEREÇO confirmado: 104 Sul Rua SE 5 Lote 37 Palmas-TO. INSIGHT CRÍTICO descoberto no batch CIC #4: ELA JÁ TEM DOMÍNIO PRÓPRIO — `mobiliaremoveis.com.br`. MAS o site é APENAS LP INSTITUCIONAL (apresentação + contato) — NÃO é e-commerce. Operação inteira de venda continua via DM ("chame no direct"). Cliente que vai gastar R$8.000 numa mesa sob medida visita o site, vê foto + telefone, mas não tem orçamento online, não tem catálogo navegável, não tem pedido formalizado. Funil quebra exatamente onde mais dói (ticket alto).',
    gancho: 'PITCH UPGRADE — não criação. Aproveita o domínio que ela JÁ tem (mobiliaremoveis.com.br) e transforma a LP institucional em e-commerce/orçamento online. Catálogo navegável por categoria (sala, jantar, quarto, escritório), filtro por estilo, sistema de orçamento online (pré-cotação automática + cliente fornece medidas + envio pra ela formalizar), galeria de cases com cliente real, integração WhatsApp Business. Mantém a estética editorial atual, só adiciona o canal de conversão. Mesma marca, conversão 5-10x.',
    objecao: '"Móveis sob medida não vende online — cliente precisa ver, tocar, conversar antes" — defesa do modelo consultivo.',
    resposta_objecao: 'Concordo 100% — fechamento de mesa de R$8k não é compra de impulso, cliente precisa de conversa. Mas pensa o que acontece HOJE: cliente vê foto teu no Insta, clica no link da bio, cai no mobiliaremoveis.com.br, vê apresentação institucional bonita, e... tem que mandar DM pra perguntar preço. 60% desistem nesse momento. O que eu monto NÃO é "Magalu de móvel" — é UPGRADE da tua LP atual com sistema de pré-orçamento online: cliente entra, escolhe categoria, fornece medidas, vê faixa estimada, ABRE conversa contigo via WhatsApp já qualificada. Mesmo modelo consultivo, mas com cliente chegando pré-aquecido em vez de frio. Topa eu te mostrar como ficaria?',
    nota_interna: 'INSIGHT NOVO do batch CIC #4: TEM DOMÍNIO mobiliaremoveis.com.br mas é LP institucional, NÃO e-commerce. Pitch é UPGRADE explícito (não criar do zero) — argumento muito mais forte e barato pra ela aceitar (não tá começando, tá evoluindo). Pre-engajamento Insta D-1 obrigatório. Telefone não veio direto no JSON CIC — pegar via Insta DM ou Google Business antes de disparar. Pitch "complexo" provável (catálogo de móveis sob medida + sistema orçamento online), valor R$899-1.199 na call.',
    abertura: `Oi, beleza? Eduardo aqui, Impulso Digital, sou de Palmas.

Tô olhando os negócios mais consolidados de Palmas essa semana e a Mobiliare chamou atenção — 14 anos, móveis design autoral, fotos editorial. Coisa rara em Palmas.

Olhei o site de vocês (mobiliaremoveis.com.br) — apresentação muito bonita, identidade forte. Mas me parece que cliente que entra ali vê foto + contato e tem que mandar DM pra perguntar preço.

Quantos desses cliente teu acha que desiste no caminho do "ah, vou ter que conversar"?`,
    followup_d3: `Oi, voltei. Pensando: o site institucional de vocês cumpre a primeira parte da jornada (apresentar marca, gerar desejo). Mas falta a SEGUNDA parte — qualificação inicial automática. Sistema de pré-orçamento online onde cliente fornece medidas + estilo + recebe faixa de preço estimada → aí abre WhatsApp já qualificada. Mesmo modelo consultivo, cliente chegando pré-aquecida. Topa eu te mostrar caso real disso?`,
    followup_d7: `Oi, última mensagem. Móvel sob medida tem ciclo longo de venda — sei que decisão não é rápida. Mas ticket de R$8-15k justifica investir no funil. Se em algum momento isso bater, tu sabe onde me achar.`,
    pre_engajamento_ig: 'D-1: seguir, curtir 2 posts editorial recentes (priorizar peças finalizadas em ambiente real, não foto de showroom). Comentar 1 com algo específico do detalhe da peça ("essa madeira maciça com pegada minimalista ficou impecável" ou referência ao processo de fabricação). Marca premium valoriza relacionamento técnico, não emoji.',
    razao_ranking: 'TICKET ALTÍSSIMO (R$1.500-15.000 por peça) + 14 anos no mercado + JÁ TEM domínio próprio (insight batch #4) = case de UPGRADE puro. Pitch mais barato de defender porque ela tá evoluindo, não começando. Pode virar Premium R$1.297-1.497 na call (catálogo grande + sistema orçamento online + integração WhatsApp Business).',
  },

  1113: {
    tier: 'A',
    posicao_no_tier: 20,
    dor: 'Owen Loja é marca masculina autoral em Palmas-TO (jeans New Slim, camisetas, conjuntos), loja física + 7.900 seguidores Insta + perfil TikTok ATIVO. Ticket R$80-250. SEM domínio próprio confirmado pelo batch CIC #4. DIFERENCIAL ÚNICO entre os leads do banco: ela TEM PRESENÇA TIKTOK ativa — quase nenhum lead nosso tem isso. Hoje Insta + TikTok = 2 canais separados, cada um com público diferente, e a venda em ambos cai num gargalo de DM/wa.me. Se Owen entrasse na onda de TikTok Shop (loja integrada nativa do TikTok, lançada 2024 no Brasil), o público que assiste live tinha checkout direto sem sair do app.',
    gancho: 'Pitch DUPLO: (a) Shopify pega o catálogo (jeans, conjuntos, camisetas), monta vitrine masculina com filtro por estilo, parcelamento 12x, motoboy Palmas + Correios Brasil; (b) INTEGRAÇÃO TIKTOK SHOP com Shopify — produtos do Shopify aparecem direto nos posts/lives TikTok com botão de compra nativo. Cliente assiste live, clica, compra sem sair do TikTok. ÚNICO LEAD do banco com esse ângulo natural — moda masculina jovem é o nicho ideal pra TikTok Shop.',
    objecao: '"TikTok eu uso pra divulgar, não pra vender — venda fecha no DM mesmo" — visão tradicional do funil.',
    resposta_objecao: 'Faz sentido com o TikTok atual — sem checkout nativo, divulgação termina em DM mesmo. Mas o TikTok Shop mudou isso desde 2024: agora é loja integrada DENTRO do app. Cliente que viu o jeans New Slim no teu post, clica em "Ver produto", paga no checkout do TikTok, recebe rastreio — tudo sem sair do app. Funciona como Shopify mas com porta direta no TikTok. Tu já tem o conteúdo TikTok pronto (poucos lojistas em Palmas têm) — falta só o canal de venda integrado. Tu poderia ser uma das primeiras de Palmas usando isso. Topa eu te mostrar caso real de loja masculina que dobrou venda em 90 dias com Shopify+TikTok Shop?',
    nota_interna: 'ÚNICO LEAD do banco com perfil TikTok ATIVO (validado batch #4). Diferencial pesado pra abordagem — todos os outros leads são pitch genérico Shopify, esse é Shopify + TikTok Shop integration. Telefone NÃO veio no scrape (sem .com.br, sem link tree visível) — pegar via DM Insta antes de disparar. Pre-engajamento OBRIGATÓRIO via Insta + dar uma olhada no TikTok dela pra entender ritmo do conteúdo. Pitch "complexo" pelo TikTok Shop integration — provável R$899-1.199 na call.',
    abertura: `Oi, beleza? Eduardo aqui, Impulso Digital, sou de Palmas.

Tô olhando lojas masculinas autorais em Palmas essa semana e o teu chamou atenção forte — único da cidade que vi com presença ativa em DUAS frentes: Insta E TikTok. Marca masculina jovem com conteúdo nos dois canais é raro de ver aqui.

Me parece que TikTok hoje é divulgação pura — venda termina no DM. Mas tem uma onda nova chegando que muda isso e que casa exatamente com teu setup.

Tu já ouviu falar do TikTok Shop?`,
    followup_d3: `Oi, voltei. Pensando: tu já tem o ATIVO mais raro pra TikTok Shop — conteúdo TikTok ativo numa marca de moda masculina. Falta só o canal de venda integrado. Shopify + TikTok Shop = produtos aparecem direto no teu post com botão de compra nativo. Cliente assiste live, clica, paga, recebe — sem sair do TikTok. Topa ver caso real de loja masculina que rodou isso?`,
    followup_d7: `Oi, última mensagem. TikTok Shop tá em fase de adoção early no Brasil — quem entra agora pega vantagem competitiva por 12-18 meses antes da onda saturar. Tu tem o conteúdo pronto, falta o checkout. Se em algum momento bater como prioridade, tu sabe onde me achar.`,
    pre_engajamento_ig: 'D-1: seguir, curtir 2 posts no Insta E ESPIAR o TikTok dela (ver ritmo de conteúdo, tipo de produto que mais aparece, voz da marca). Comentar 1 post Insta com algo específico do produto ("esse jeans New Slim ficou impecável" ou referência ao caimento). Marca masculina jovem valoriza tom direto, sem fluffy.',
    razao_ranking: 'ÚNICO lead do banco com PERFIL TIKTOK ATIVO (validado batch #4). Diferencial pesado — Shopify + TikTok Shop integration é pitch que ninguém mais oferece em Palmas. Marca masculina autoral + presença dupla canal social + ticket médio = case ideal de e-commerce com canal social integrado. Provável Premium na call.',
  },

  // ── TIER A (CIC #5 — 26/04 caça LP multi-fonte calibrada) — 5 leads ──
  // Batch #5 com lições acumuladas dos 4 anteriores. Multi-fonte
  // (Maps + Google search + Insta) varrida em 7 nichos. 5 análises pros
  // top com case-clone direto (3 Tier S + 2 Tier A com match forte).

  1118: {
    tier: 'A',
    posicao_no_tier: 21,
    dor: 'Dra. Monnaliza Cabral é dentista solo CRO TO 1727 com Instagram VERIFIED azul (raríssimo em Palmas — sinal de operação consolidada de verdade), Maps 5.0/33, endereço Q. 1006 Sul Alameda 16 Lote 01 Sala 8, ATIVÍSSIMA (post há 3 dias). Catálogo de 6 serviços (facetas, harmonização facial, etc) com TICKET ALTO (faceta R$1.000+/dente, harmonização R$3.000+, consultas R$200-400). MAS: ZERO domínio próprio, ZERO link na bio Insta — agendamento 100% via direct. Pinned post "Agenda aberta" lista os serviços + telefone direto, sem link de marcação. DOR DM ABSOLUTA num nicho onde paciente pesquisa MUITO antes de fechar (faceta + harmonização = decisão estética séria).',
    gancho: 'ARGUMENTO ESTRUTURAL — dentista solo verified com 5★/33 Maps + ZERO web é exatamente o perfil que paciente busca pra harmonização premium e não acha. LP profissional resolve: biografia + CRO em destaque + 6 serviços catalogados com FAQ ("quanto custa faceta?", "harmonização dura quanto?") + galeria antes/depois (com cuidado ético dental) + agendamento integrado + 3 artigos SEO ("faceta de porcelana em Palmas", "harmonização facial CRO-TO segura"). Conta verificada Insta + 5★/33 Maps + LP profissional = autoridade triplicada. Cliente que vai gastar R$3-5k em harmonização pesquisa MUITO; quem aparecer com LP profissional fica com a venda. PROPOSTA OPCIONAL: Monnaliza pode virar PRIMEIRO CASE DENTAL da Impulso (R$200 desconto pra fechar mais rápido + virar prova social pra próximos dentistas).',
    objecao: '"Já tenho fluxo no consultório, paciente vem por indicação" — dentista solo consolidada defendendo o status quo.',
    resposta_objecao: 'Faz total sentido — 33 reviews 5★ + Insta verified mostra que o boca-a-boca funciona. Mas pensa pelo lado da paciente NOVA que ouviu falar de ti pela amiga e vai pesquisar "Dra. Monnaliza Cabral facetas Palmas" antes de marcar (decisão estética é assim — paciente pesquisa MUITO). Ela cai no teu Insta, vê 6 serviços no pinned post, mas tem que mandar DM pra perguntar preço, prazo, processo. 60% desistem aí mesmo. LP profissional pega esse momento: catálogo de procedimentos com FAQ de preço, antes/depois ético, agendamento integrado. Mesma indicação, paciente chegando QUALIFICADA. Topa eu te mostrar 1 caso de dentista solo que fez essa transição?',
    nota_interna: 'AINDA NÃO TEMOS case dental fechado — argumento é estrutural (autoridade construída + ZERO web profissional = combinação que converte). Monnaliza tem perfil ideal pra virar PRIMEIRO CASE DENTAL da Impulso (proposta showcase R$200 desconto). Insta VERIFIED azul = sinal de operação consolidada (raro em Palmas). Telefone (63)99258-6520 confirmado pinned post. Pre-engajamento OBRIGATÓRIO via Insta D-1 (curtir 2 posts de procedimento, NÃO comentar). Pitch "complexo" provável R$899-1.297 na call.',
    abertura: `Oi Dra. Monnaliza, beleza? Eduardo aqui, Impulso Digital, sou de Palmas.

Tô olhando dentistas autônomos consolidados em Palmas e o teu perfil chamou atenção forte — Insta verified (raro aqui), 33 reviews 5★ no Maps, post recente. Operação que claramente já roda.

Olhei teu pinned post sobre "Agenda aberta" com 6 serviços. Me parece que paciente nova que vai pesquisar "Dra. Monnaliza facetas" cai no teu Insta, vê o catálogo, mas tem que mandar DM pra perguntar preço, prazo, processo.

Quanto dessa paciente nova tu acha que desiste no caminho do "ah, vou ter que conversar"?`,
    followup_d3: `Oi Dra. Monnaliza, voltei. Pensando: nicho de dentista estética com facetas + harmonização tem comportamento clássico — paciente que vai gastar R$3-5k pesquisa MUITO antes (compara 5-7 dentistas), e cai no Insta sem catálogo nem FAQ de preço. Recua. LP profissional pega esse momento exato com galeria antes/depois ética + FAQ + agendamento. Topa ver caso real similar (dentista solo com mesma escala)?`,
    followup_d7: `Oi Dra. Monnaliza, última mensagem da minha parte. Sei que rotina de dentista solo é puxada — atender + protocolar + responder DM. Vou parar de mandar. Só registro: 5★/33 + verified azul é capital social que muita clínica nova vai levar 5 anos pra construir. Falta apresentar online com a mesma seriedade. Tu sabe onde me achar.`,
    pre_engajamento_ig: 'D-1 OBRIGATÓRIO: seguir, curtir 2 posts dos últimos 7 dias (priorizar procedimentos finalizados, NÃO foto pessoal). NÃO comentar — Insta verified recebe MUITOS comentários genéricos, queima rápido. Pre-warming via consumo do conteúdo. Mensagem WhatsApp já chega quente porque ela vê "Eduardo Barros começou a seguir você" no painel.',
    razao_ranking: 'TIER S puríssimo (score 9). Argumento estrutural — autoridade construída + ZERO web profissional. Insta verified + 5★/33 + ZERO web + ZERO link bio = perfil ideal pra LP profissional. Ticket altíssimo (facetas+harmonização R$1k-3k+) = LP a partir de R$499 paga com 1 procedimento. Provável pitch "complexo" (R$899-1.297) na call.',
  },

  1119: {
    tier: 'A',
    posicao_no_tier: 22,
    dor: 'Dr. Ricardo Linares é cirurgião-dentista solo, conta Insta verified, 8.4k seguidores, Maps 4.9/66, endereço 1106 sul av lo 27 lote 25 sala 3. CASO EXTREMO de DOR DM: o "Site" listado no Google Maps NÃO é um site — é um link literal pra api.whatsapp.com/send (cliente clica em "Site" no Maps e vai direto pro WhatsApp dele). É a ferramenta mais primitiva de captação possível, mas funciona porque ele tem reputação Maps de 4.9/66. Feed Insta inativo 11 sem MAS Maps com reviews recentes = paciente continua chegando via boca-a-boca + Maps, sem canal digital próprio captando o paciente NOVO que pesquisa "cirurgião dentista Palmas" antes de agendar.',
    gancho: 'LP profissional vira o destino oficial pra paciente novo que pesquisa cirurgião-dentista em Palmas. Biografia + procedimentos catalogados (cirurgia, implante, exodontia complexa, etc) + galeria de casos com cuidado ético + depoimentos + FAQ ("quanto custa implante?", "tempo de recuperação cirurgia?", "quem cobre plano?") + agendamento integrado. Substitui o "wa.me como Site" do Maps por LP institucional sem desligar o WhatsApp. Mesma operação, captura paciente novo que hoje some no caminho.',
    objecao: '"Tô bem com o que tenho, paciente continua chegando" — defesa do que funciona.',
    resposta_objecao: 'Concordo — 4.9/66 é reputação que poucas clínicas em Palmas têm. O que funciona não vai mexer. Mas pensa: o paciente que vai pagar R$5-8k num implante PESQUISA antes de marcar — compara 4-5 cirurgiões. Hoje, quando ele clica em "Site" do teu Maps e cai direto no WhatsApp, sem ver biografia, sem ver caso similar, sem ver depoimento... ele recua. "Vou pesquisar mais", e some. LP profissional pega esse momento: ele clica em Site, vê tua biografia + casos + FAQ de preço + agendamento. Mesmo paciente, conversão diferente. Topa eu te mostrar como ficaria?',
    nota_interna: 'Argumento estrutural — médico/dentista solo com autoridade construída + ZERO web profissional. Conta verified + 4.9/66 = autoridade alta apesar do feed Insta inativo. Pre-engajamento via Insta vai ser fraco (feed inativo) — focar em pre-warming via Google Maps (não tem como, mas curtir posts antigos do Insta funciona pra notificar ele). Telefone (63)99211-4547 confirmado wa.me direto. Pitch "complexo" provável (catálogo cirúrgico + galeria casos + agendamento), R$899-1.297.',
    abertura: `Oi Dr. Ricardo, beleza? Eduardo aqui, Impulso Digital, sou de Palmas.

Tô olhando cirurgiões-dentistas autônomos em Palmas essa semana e o teu perfil chamou atenção forte — 4.9 com 66 reviews no Maps + Insta verified é nível raríssimo aqui. Operação que claramente roda.

Olhei teu Maps: o "Site" listado lá vai DIRETO pro WhatsApp. Funciona porque tu tem reputação. Mas o paciente que vai gastar R$5-8k num implante pesquisa MUITO antes — compara 4-5 cirurgiões. Quando ele cai no teu WhatsApp sem ver biografia + casos + FAQ, recua.

Quanto desse paciente novo de implante tu acha que perde por mês?`,
    followup_d3: `Oi Dr. Ricardo, voltei. Pensando: tu tem ATIVO raro (4.9/66 + verified) que cliente novo de cirurgia ainda não vê. LP profissional vira a "casa digital" — biografia + procedimentos + FAQ de preço + galeria de casos. Substitui o WhatsApp como porta de entrada SEM desligar ele. Mesmo paciente que hoje some, chega informado. Topa ver caso real disso?`,
    followup_d7: `Oi Dr. Ricardo, última mensagem. Cirurgia dentária é alto-ticket e ciclo de pesquisa longo. Janela de SEO local não fecha — quem chegar primeiro com LP profissional fica com a busca "cirurgião dentista Palmas" por anos. Se fizer sentido em algum momento, tu sabe onde me achar.`,
    pre_engajamento_ig: 'D-1: seguir, curtir 2 posts antigos (feed Insta inativo desde 6 fev — não tem material recente). Pre-warming fraco via Insta — abordagem WhatsApp tem que ser ainda mais forte. NÃO comentar (verified recebe muito genérico).',
    razao_ranking: 'TIER S (score 9). Argumento estrutural autoridade médica. Cirurgião-dentista verified + 4.9/66 = autoridade máxima. "Site" do Maps = wa.me direto = caso EXTREMO de DOR DM (raro). Ticket altíssimo (cirurgia/implante R$5-8k) justifica LP a partir de R$499 facilmente. Pitch "complexo" R$899-1.297.',
  },

  1115: {
    tier: 'A',
    posicao_no_tier: 23,
    dor: 'Pedro Maciel é nutricionista esportivo solo CRN 27994, ATIVÍSSIMO no Insta (post há 1 dia), Maps 5.0/10 (poucas mas todas positivas), endereço 204 Sul Alameda Jandaia Lote 27. Pós-graduando em ESPORTIVA + CLÍNICA + LIPEDEMA — lipedema é nicho ESCASSO em Palmas (paciente pesquisa muito, encontra pouco). ZERO domínio próprio, "Site" do Maps aponta pro próprio Insta, bio com wa.me/+5563992314603. DOR DM CLÁSSICA + nicho de especialização raro = receita escapando porque cliente não acha quem trata lipedema na cidade.',
    gancho: 'Pitch DUPLO: (a) LP profissional padrão (biografia + CRN + serviços + agendamento), MAS (b) com PÁGINA DEDICADA AO LIPEDEMA — porque é o nicho onde ele tem diferenciação real e onde ranquear no Google "nutricionista lipedema Palmas" vira destino único. Cliente de lipedema gasta MUITO tempo pesquisando, e quem aparece com LP técnica explicando "o que é lipedema, como funciona o protocolo nutricional, fases do tratamento, quanto custa" fica com TODO o nicho regional. Match exato com EV Suplementos (profissional saúde habilitado + sessão recorrente + nicho premium).',
    objecao: '"Já vendo bem pelo Insta, post há 1 dia, atendo cheio" — operação ativa defendendo o que funciona.',
    resposta_objecao: 'Concordo — atividade Insta de 1 dia + 5★ no Maps mostra operação que funciona. O Insta capta quem JÁ te segue. Mas o paciente NOVO de lipedema que ouviu falar do diagnóstico semana passada e pesquisa "nutricionista lipedema Palmas" no Google às 23h — esse cai em nutri esportivo geral que não trata lipedema. Tu tem o conhecimento técnico (pós-graduando) + a especialização rara, falta o canal. LP com página dedicada ao lipedema vira destino único pra essa busca em todo Tocantins. Topa eu te mostrar caso de nutri que fez isso e dominou um nicho?',
    nota_interna: 'NICHO LIPEDEMA é ESCASSO em Palmas — diferenciação ENORME pra ranquear. CASE-CLONE da EV Suplementos (mesmo perfil de profissional saúde habilitado com sessão recorrente). ATIVÍSSIMO Insta (post há 1 dia) facilita pre-engajamento. Telefone (63)99231-4603 confirmado bio. Pitch "complexo" (LP padrão + página dedicada lipedema com FAQ técnico + 3 artigos SEO sobre lipedema), R$899-1.197.',
    abertura: `Oi Pedro, beleza? Eduardo aqui, Impulso Digital, sou de Palmas.

Tô olhando nutricionistas esportivos autônomos em Palmas essa semana e teu perfil chamou atenção — CRN + pós em esportiva + clínica + LIPEDEMA. Postou ontem, atende presencial, 5★ no Maps. Operação ativa.

Mas o que me fez parar foi o LIPEDEMA — esse é nicho RARO em Palmas. Paciente diagnosticada pesquisa "nutricionista lipedema Palmas" no Google e cai em nutri esportivo geral que não trata especificamente. Tu tem o conhecimento técnico, falta o canal.

Quantas dessas tu acha que perde por mês pra Goiânia ou Brasília?`,
    followup_d3: `Oi Pedro, voltei. Pensando: lipedema é busca premium (paciente gasta semanas pesquisando antes de marcar). Quem aparecer no Google com LP técnica explicando "o que é lipedema, fases, protocolo nutricional, FAQ de preço" fica com TODO o nicho regional. Tu já tem a especialização — falta o canal. Topa ver 1 caso de nutri que dominou nicho assim?`,
    followup_d7: `Oi Pedro, última mensagem. Nicho lipedema só vai ficar mais quente (cresce a procura por diagnóstico). Quem chegar primeiro com LP especializada fica com a busca por anos. Se em algum momento isso bater, tu sabe onde me achar.`,
    pre_engajamento_ig: 'D-1: seguir, curtir 2 posts técnicos recentes (priorizar conteúdo de lipedema OU esportiva — não foto pessoal). Comentar 1 com algo específico técnico ("conteúdo sobre lipedema é raro de ver com esse rigor mesmo" ou referência ao caso clínico mostrado). Profissional saúde valoriza pre-engajamento técnico.',
    razao_ranking: 'TIER S (score 8.5). CASE-CLONE EV Suplementos. Nicho LIPEDEMA = diferenciação rara e premium. ATIVÍSSIMO Insta (vai responder DM). Ticket recorrente (consulta R$300-500 + retornos R$150-200). LP com página dedicada lipedema = pitch complexo R$899-1.197 (vale o aumento — ele vai dominar nicho regional).',
  },

  1114: {
    tier: 'A',
    posicao_no_tier: 24,
    dor: 'Marina Clara Borges é psicóloga solo CRP 23/1936, 7.100 seguidores, 332 posts, ativa há 18 dias. Endereço explícito (501 sul Av. Teotônio Segurado, Edifício Amazônia Center 3° andar, em frente ao Fórum). Maps 5.0/15. Diferencial PESADO: PODCASTER do "Duas no Divã" + Psicóloga na Junta Médica TO = autoridade construída acima da média do nicho. MAS: tem `marinaclarapsi-kb7vfrf.gamma.site` — gamma.site é ferramenta amadora de geração de página (similar a Linktr.ee mas com cara de site). O site existe mas não é profissional, sem CTA estruturado, sem agendamento integrado, sem captura de lead.',
    gancho: 'PITCH UPGRADE de gamma.site pra LP profissional. Aproveita autoridade que ela JÁ tem (podcast + Junta Médica TO + 7.1k seg + 5★ Maps) e monta LP com biografia profissional + CRP em destaque + áreas de atuação (psicanálise, terapia) + FAQ ("primeira sessão", "atende online?", "quanto dura tratamento?") + integração com podcast (link episódios pra prova social) + agendamento profissional. Argumento estrutural — autoridade construída via podcast + Junta Médica TO precisa de vitrine adequada, gamma.site amador queima a marca pessoal.',
    objecao: '"Já tenho o gamma.site, funciona pro que preciso" — defesa da solução amadora atual.',
    resposta_objecao: 'Faz sentido — gamma.site cumpre o básico (link bio com mais informação que linktr.ee). Mas pensa pelo lado da paciente nova que vai pesquisar "Marina Clara Borges psicóloga Palmas" antes de marcar primeira sessão (decisão emocional, ela pesquisa MUITO). Cai no gamma.site, vê layout genérico, sem teu rosto profissional em destaque, sem CRP visível, sem episódios do podcast linkados como prova social. LP profissional muda isso: tua marca pessoal (que tu construiu com podcast + Junta Médica) ganha vitrine adequada. Topa ver como ficaria?',
    nota_interna: 'AUTORIDADE CONSTRUÍDA ALTA (podcast + Junta Médica) — pitch é UPGRADE da solução gamma.site, não criação. Telefone (63)99245-0641 confirmado Maps. Pre-engajamento Insta D-1 obrigatório (curtir 1-2 posts do podcast OU psicanálise). Pitch padrão R$499 ou complexo R$799-899 (integração podcast pra prova social + biografia profissional).',
    abertura: `Oi Marina, beleza? Eduardo aqui, Impulso Digital, sou de Palmas.

Tô olhando psicólogas autônomas em Palmas essa semana e o teu perfil chamou atenção — Junta Médica TO + podcast Duas no Divã + 5★ no Maps + 7k seg. Marca pessoal construída de verdade.

Olhei teu link da bio (gamma.site). Cumpre o básico, mas me parece que cliente novo que vai pesquisar "Marina Clara psicóloga Palmas" antes de marcar primeira sessão cai num layout genérico, sem teu rosto profissional em destaque, sem episódios do podcast linkados.

Quanto dessa paciente nova tu acha que perde porque o canal não comunica a autoridade que tu construiu?`,
    followup_d3: `Oi Marina, voltei. Pensando: psicóloga solo com autoridade construída (podcast + Junta Médica) + solução amadora de página = padrão clássico. Paciente nova que vai marcar primeira sessão pesquisa MUITO (decisão emocional, alta confiança), e quando cai no gamma.site genérico não vê nada do que tu construiu. LP profissional muda isso: biografia + CRP em destaque + episódios podcast linkados como prova social + agendamento. Topa ver protótipo?`,
    followup_d7: `Oi Marina, última mensagem. Sei que rotina de psicóloga + podcast é puxada. Vou parar. Só registro: tua autoridade do podcast + Junta Médica é capital que merece vitrine adequada. Se em algum momento isso bater como prioridade, tu sabe onde me achar.`,
    pre_engajamento_ig: 'D-1: seguir, curtir 2 posts (priorizar trechos do podcast OU conteúdo psicanalítico técnico). NÃO comentar. Pre-warming via consumo. Mensagem WhatsApp chega já com pre-aviso ("Eduardo começou a seguir").',
    razao_ranking: 'TIER A score 7.5. Argumento estrutural psi solo (sem case-clone entregue ainda). Autoridade construída ALTA (podcast + Junta Médica TO + 5★ Maps). Pitch UPGRADE de gamma.site = argumento mais barato de defender. Ticket recorrente psicanálise. LP padrão R$499 ou complexo R$799-899 com integração podcast.',
  },

  1117: {
    tier: 'A',
    posicao_no_tier: 25,
    dor: 'Darcianne Cavalcante é fisioterapeuta domiciliar solo, Pós Graduada em Fisioterapia GERONTOLÓGICA CEULP/ULBRA. Maps 5.0/46, endereço 303 Sul Av. LO-01, 9, Lote 24, Plano Diretor Sul. 365 posts (DAILY POSTING há 1 ano — disciplina rara), ativa há 10 dias. Tem `sandwiche.me/darcianne.fisio` — sandwiche.me é ferramenta amadora similar a Linktr.ee. NICHO ÚNICO: fisio domiciliar pra IDOSO. Cliente final é a FAMÍLIA do idoso (filhos pesquisam por pais), e família pesquisa MUITO antes de confiar profissional na casa de mãe/pai. Autoridade vende, mas hoje tem só sandwiche.me amador.',
    gancho: 'LP profissional pra fisio domiciliar gerontológica — biografia + Pós CEULP/ULBRA em destaque + lista de serviços (avaliação domiciliar, reabilitação pós-AVC, fisio respiratória, gerontologia) + DEPOIMENTOS DE FAMÍLIA (não do idoso — do filho/filha que contratou) + FAQ específico ("primeira sessão", "tipos de patologia atendidos", "quantos atendimentos por semana") + agendamento profissional. Substitui sandwiche.me sem desligar Insta. Caso-clone: EV Suplementos (sessão recorrente + ferramenta amadora atual + cliente que pesquisa antes).',
    objecao: '"Já tenho sandwiche.me, e cliente vem por indicação mesmo" — defesa do operacional atual.',
    resposta_objecao: 'Faz total sentido — fisio domiciliar é muito de indicação, e tu tem 5★/46 no Maps construído. Mas pensa: a indicação geralmente é "tem uma fisio domiciliar boa, deixa eu te mandar o contato dela" — e a filha que vai contratar pesquisa antes ("Darcianne Cavalcante fisioterapeuta Palmas"). Cai no sandwiche.me, vê layout genérico, sem depoimentos de outras famílias que contrataram, sem catálogo de patologias atendidas. LP profissional muda isso: depoimentos de FILHOS (não pacientes), catálogo gerontológico estruturado, biografia com pós em destaque. Mesma indicação, contratação mais rápida. Topa ver como ficaria?',
    nota_interna: 'NICHO RARO (fisio domiciliar gerontológica) com cliente B2C que pesquisa MUITO (família do idoso). DAILY POSTING 365 posts = disciplina rara, sinaliza profissional sério. Telefone (63)98103-3045 confirmado Maps. Pitch "complexo" (LP + depoimentos de família + catálogo gerontológico estruturado) R$899-1.197.',
    abertura: `Oi Darcianne, beleza? Eduardo aqui, Impulso Digital, sou de Palmas.

Tô olhando fisioterapeutas autônomas em Palmas essa semana e o teu perfil chamou atenção forte — Pós em Gerontologia CEULP + 5★ com 46 reviews + 365 posts (DAILY há 1 ano). Disciplina + nicho específico que poucos têm.

Me parece que tua indicação chega muito por boca-a-boca de família que confiou e indicou. Mas a filha que vai contratar pra mãe pesquisa "Darcianne Cavalcante fisio domiciliar Palmas" antes — e cai no teu sandwiche.me, sem ver depoimentos de OUTRAS famílias que contrataram.

Quanto dessa filha tu acha que recua nesse momento da pesquisa?`,
    followup_d3: `Oi Darcianne, voltei. Pensando: fisio domiciliar gerontológica é nicho onde a CLIENTE que contrata é a família, não o paciente. Família pesquisa muito antes de confiar profissional dentro de casa. LP profissional com depoimentos de FILHOS (não idosos) + biografia com Pós CEULP em destaque + catálogo gerontológico = vira o destino que essa filha procura. Topa ver caso similar?`,
    followup_d7: `Oi Darcianne, última mensagem. Disciplina de 365 posts em 1 ano é coisa de quem leva trabalho a sério. Mas o canal precisa transmitir essa seriedade pra família que pesquisa. Se em algum momento isso bater, tu sabe onde me achar.`,
    pre_engajamento_ig: 'D-1: seguir, curtir 2 posts recentes (priorizar conteúdo gerontológico técnico OU caso de paciente — daily posting tem catálogo grande pra escolher). Comentar 1 com algo específico ("trabalho domiciliar com idoso pós-AVC é nicho raro de ver com esse rigor" ou referência à patologia mostrada).',
    razao_ranking: 'TIER A score 8. CASE-CLONE EV Suplementos. Nicho B2C com decisor diferente do paciente (família) = LP com prova social específica vence. Daily posting 365 posts = disciplina sinaliza profissional sério. Pitch "complexo" R$899-1.197.',
  },

  // ── TIER A (CIC #6 — 26/04 médicos RQE + dentistas + advogados) — 5 leads ──
  // Batch RECORDE: 7 Tier S num único round (validação do filtro Tier S
  // automático aplicado no SYSTEM_PROMPT pós-market intelligence).
  // 5 análises pros Tier S com case-clone direto + maior potencial.

  1131: {
    tier: 'A',
    posicao_no_tier: 26,
    dor: 'Douglas Pimentel é o LEAD MAIS GRITANTE do pipeline inteiro: advogado solo trabalhista OAB-TO, Maps 5.0/294 reviews — número ABSURDO, é literalmente top 1 trabalhista de Palmas no Maps. ZERO domínio próprio, ZERO presença web, bio Insta só com DDD 63 99202-4803. 294 paciente satisfeito que JÁ deixou review e o próximo cliente que pesquisa "advogado trabalhista Palmas" cai num WhatsApp sem ver biografia, casos, especialidade, conformidade OAB. É OURO LOCAL não capturado — Hormozi diria "deixar dinheiro na mesa em escala industrial".',
    gancho: 'ARGUMENTO ESTRUTURAL OAB-COMPLIANT — Provimento 205/2021 PERMITE LP informativa sem preço/promessa. LP profissional vira destino oficial pra busca "advogado trabalhista Palmas" (que Douglas já domina no Maps): biografia + OAB-TO em destaque + áreas de especialidade trabalhista (rescisão, CLT, INSS) + FAQ ("como funciona 1ª consulta?", "quanto custa orientação?", "OAB permite cobrar honorários assim?") + formulário de pré-análise da causa + 3 artigos SEO ("rescisão CLT em Palmas", "como entrar com ação trabalhista TO", "verbas rescisórias Tocantins") + integração ética com OAB. 294 reviews + LP profissional = autoridade triplicada. PROPOSTA: Douglas pode virar PRIMEIRO CASE ADVOGADO da Impulso (R$200 desconto + showcase pra outros advogados Palmas).',
    objecao: '"OAB tem regra contra propaganda agressiva" — clássica do advogado preocupado com Provimento 205/2021.',
    resposta_objecao: 'Total razão — Provimento 205/2021 da OAB proíbe captação ostensiva, MAS permite (e até encoraja) LP informativa sem preço, sem promessa de resultado, sem "ganhe sua causa". O que eu monto é o oposto da propaganda agressiva: informação sóbria, áreas de atuação, biografia profissional, FAQ regulamentar, formulário de contato. É exatamente o que a Resolução prevê — presença digital regulamentar. Tem caso real disso aqui em Palmas (te mostro). 294 reviews 5★ no Maps + LP que respeita OAB = posicionamento que nenhum trabalhista da cidade tem.',
    nota_interna: 'LEAD MAIS GRITANTE DO PIPELINE INTEIRO. 294 reviews é número absurdo (mais que 90% das clínicas grandes!). Telefone (63)99202-4803 confirmado bio. Pre-engajamento Insta D-1 obrigatório (1.655 seg, intimista — comentar pode funcionar bem se for específico). Pitch tem que ser ESPECIAL — Douglas é caso showcase, vale propor ele como case real ("posso te entregar a LP e quando ficar boa, virar caso de prova social pra outros advogados de Palmas — desconto de R$200 em troca?"). Pitch "complexo" pelo conteúdo OAB-compliant, R$799-999.',
    abertura: `Oi Douglas, beleza? Eduardo aqui, Impulso Digital, sou de Palmas.

Tô olhando advogados autônomos de Palmas e o teu perfil chamou atenção MUITO forte — 294 reviews 5★ no Maps em trabalhista é número absurdo (mais que 90% das clínicas grandes da cidade). Tu é literalmente top 1 trabalhista de Palmas pra quem pesquisa.

Mas olhei tua bio: 294 paciente satisfeito que recomenda o cliente novo cai num WhatsApp sem ver biografia, áreas de atuação, FAQ regulamentar.

Quanto desse cliente novo (que vê review e pesquisa antes de ligar) tu acha que perde no caminho?`,
    followup_d3: `Oi Douglas, voltei. Pensando: Provimento 205/2021 da OAB permite LP informativa sem preço nem promessa — exatamente o que advogado consolidado precisa pra capturar busca local. Tu tem 294 reviews que valem ouro online. Posso te mostrar 2 LPs de advogado trabalhista que respeitam OAB e ranqueiam? E uma proposta: posso te entregar a LP e quando ficar boa, virar caso real de prova social pra outros advogados de Palmas — desconto de R$200 em troca. Topa?`,
    followup_d7: `Oi Douglas, última mensagem. 294 reviews é capital social que muito advogado vai levar 10 anos pra construir. Tu tá deixando esse capital invisível pra cliente novo que pesquisa antes de ligar. Se em algum momento isso bater, tu sabe onde me achar.`,
    pre_engajamento_ig: 'D-1 OBRIGATÓRIO: seguir, curtir 2 posts (priorizar conteúdo técnico de direito trabalhista, não foto pessoal). Comentar 1 com algo específico ("conteúdo sobre rescisão CLT é raro de ver com esse rigor mesmo" ou referência ao caso mostrado). Advogado valoriza pre-engajamento técnico — comentário "show!" queima.',
    razao_ranking: 'TIER S puríssimo (score 9). LEAD MAIS GRITANTE DO PIPELINE — 294 reviews 5★ é número absurdo (recorde do banco). Conversão LP advocacia >4% (maior do mercado nacional). Sem case-clone advogado entregue ainda — usar argumento estrutural de OAB-compliant. Pitch "complexo" R$799-999 + proposta opcional "case showcase com R$200 desconto" pra fechar mais rápido (e Douglas vira o primeiro case advogado da Impulso).',
  },

  1125: {
    tier: 'A',
    posicao_no_tier: 27,
    dor: 'Dra. Ingrid Sales é endocrinologista RQE 3062, Maps 5.0/190 reviews (número RARÍSSIMO em endocrino), 7.540 seguidores Insta, endereço Centro Clínico Sara Q.108 Sul. Atende Diabetes + Obesidade + Tireoide + Hormônios. MAS o canal de captura é literalmente um BIT.LY (`bit.ly/atendimentodraingridsales`) — 190 reviews 5★ + 7.5k seguidores + bit.ly = DESPERDÍCIO COLOSSAL. Paciente que viu post sobre Mounjaro/Ozempic clica no link da bio e cai num bit.ly genérico, sem biografia, sem FAQ, sem formulário de pré-anamnese.',
    gancho: 'LP profissional dedicada com biografia + RQE 3062 em destaque + 4 áreas (Diabetes, Obesidade c/ canetas GLP-1, Tireoide, Hormônios) + FAQ específico de cada (quanto custa consulta, plano cobre, como funciona acompanhamento canetas) + agendamento integrado + 3 artigos SEO ("Mounjaro Palmas TO", "tireoide Hashimoto", "obesidade tratamento médico"). Pega tráfego das buscas premium "endocrinologista Palmas Mounjaro". Mantém Insta + bit.ly opcional, mas LP vira destino oficial. Argumento estrutural — médica autônoma RQE com 190 reviews 5★ + canal de captura amador (bit.ly) = oportunidade clara de upgrade.',
    objecao: '"Já tenho bit.ly e o Insta, paciente acha" — defesa do operacional atual.',
    resposta_objecao: 'Faz sentido — bit.ly cumpre o básico de redirecionar pro WhatsApp. Mas pensa pelo lado da paciente NOVA com 60kg sobrando que viu teu post sobre canetas GLP-1, vai pesquisar "Dra Ingrid Sales endocrino Palmas" antes de marcar consulta de R$500. Cai no bit.ly, vê só "ABRIR WHATSAPP" sem biografia, sem FAQ de preço, sem explicação dos protocolos. 60% recua. LP profissional muda isso: ela chega no teu canal e vê biografia médica completa + RQE em destaque + áreas catalogadas + FAQ ("plano cobre?", "Wegovy vs Tirzepatida?", "tempo de acompanhamento?"). Mesma paciente, conversão diferente. Topa eu te mostrar?',
    nota_interna: 'NICHO MAIS QUENTE em saúde estética Palmas (canetas GLP-1) — Ingrid tem 190 REVIEWS 5★ que é mais que 99% dos endocrinos do Brasil. Telefone NÃO veio direto (bit.ly) — abrir o link e capturar número antes de disparar. Pre-engajamento Insta D-1 obrigatório (curtir 2 posts técnicos sobre canetas/tireoide). Pitch "complexo" provável pelo volume de conteúdo + 4 áreas, R$899-1.197 na call.',
    abertura: `Oi Dra. Ingrid, beleza? Eduardo aqui, Impulso Digital, sou de Palmas.

Tô olhando endocrinologistas autônomos de Palmas essa semana e o teu perfil chamou atenção MUITO forte — 190 reviews 5★ é número que MUITO endocrino do Brasil inteiro vai levar 15 anos pra construir.

Mas olhei tua bio: 7.500 seguidores qualificados que pesquisam canetas GLP-1 + tireoide + diabetes caem num bit.ly. Sem biografia, sem FAQ, sem catálogo de áreas.

Quanto dessa paciente nova (que viu teu post sobre Mounjaro e foi pesquisar antes de marcar R$500 de consulta) tu acha que recua nesse momento?`,
    followup_d3: `Oi Dra. Ingrid, voltei. Pensando: paciente de canetas GLP-1 pesquisa MUITO antes de marcar (decisão de longo prazo, R$1.200/mês de medicação). LP dedicada com biografia + RQE + FAQ específico de Wegovy/Tirzepatida/Mounjaro = vira destino oficial pra busca "Mounjaro Palmas TO" que hoje cai em linktr.ees genéricos. Topa ver caso de endocrina que fez essa transição?`,
    followup_d7: `Oi Dra. Ingrid, última mensagem da minha parte. 190 reviews 5★ é capital que poucas endocrinas do Brasil tem. Tu tá deixando esse capital invisível pra paciente nova. Se em algum momento isso bater, tu sabe onde me achar.`,
    pre_engajamento_ig: 'D-1 OBRIGATÓRIO: seguir, curtir 2 posts técnicos recentes (priorizar canetas GLP-1, tireoide — não foto pessoal). NÃO comentar (médica recebe muito comentário genérico de paciente). Pre-warming via consumo do conteúdo.',
    razao_ranking: 'TIER S puríssimo (score 9.5). 190 reviews 5★ em endocrino = recorde absoluto do nicho em Palmas. Nicho mais quente em saúde estética Palmas (canetas GLP-1). Argumento estrutural autoridade médica. Pitch "complexo" R$899-1.197 (4 áreas + FAQ específico cada).',
  },

  1122: {
    tier: 'A',
    posicao_no_tier: 28,
    dor: 'Dra. Hollana Correa é dentista solo CRO TO 3043 com 15.900 SEGUIDORES INSTA (a maior do batch dental), Maps 5.0/67 reviews, endereço Orla 14 Graciosa. Nicho: Rejuvenescimento Facial / Harmonização Orofacial. ZERO domínio próprio — link in bio é literalmente um wa.me/message direto. 15.9k seguidores qualificados (público que segue dentista de harmonização é cliente intencional, não casual) sem captura de lead — todos voltam pro DM. Paciente que vai gastar R$3.000+ em harmonização precisa ver biografia técnica, antes/depois ético, processo, FAQ de preço — não cai direto em "olá!".',
    gancho: 'ARGUMENTO ESTRUTURAL — dentista solo com 15.9k seg qualificados em harmonização + ZERO captura = receita massiva escapando. LP de procedimentos estéticos com biografia + CRO em destaque + catálogo (rejuvenescimento facial, harmonização orofacial, lifting facial, bichectomia) + galeria antes/depois (com cuidado ético dental) + FAQ ("quanto custa harmonização?", "quanto dura?", "dói?", "tempo de recuperação?") + agendamento integrado + 3 artigos SEO ("harmonização orofacial Palmas", "rejuvenescimento facial seguro", "bichectomia indicação"). 15.9k seguidores → LP que captura → conversão dramática.',
    objecao: '"Já tenho 15k seguidores, cliente vem do Insta mesmo" — operação ativa defendendo o que funciona.',
    resposta_objecao: 'Concordo — 15.9k seguidores é AUTORIDADE construída de verdade, e o Insta capta cliente que JÁ te conhece. Mas pensa: a paciente que viu uma harmonização tua num story compartilhado por amiga e vai gastar R$3.000 na decisão estética — ela pesquisa MUITO antes de marcar. Cai no link bio (wa.me direto), vê "olá!" sem biografia, sem antes/depois categorizado, sem FAQ de preço. 60% recua nesse momento. LP profissional pega exatamente esse momento: ela chega no link bio e vê biografia + CRO + casos + FAQ. Mesma paciente, conversão diferente. Topa ver caso real?',
    nota_interna: '15.9k seguidores é o MAIOR do batch dental — autoridade Insta gigante. Telefone NÃO veio direto (wa.me/message) — abrir o link, capturar número antes de disparar. Pre-engajamento Insta D-1 obrigatório (curtir 2 procedimentos finalizados, NÃO foto pessoal). Pitch "complexo" R$899-1.197 (volume de conteúdo + galeria antes/depois ética + integração agendamento).',
    abertura: `Oi Dra. Hollana, beleza? Eduardo aqui, Impulso Digital, sou de Palmas.

Tô olhando dentistas autônomas de harmonização em Palmas e o teu perfil chamou atenção forte — 15.900 seguidores qualificados é nível raríssimo aqui (dentista da cidade mediana com 5k já é considerada consolidada).

Mas olhei o link da tua bio: 15.9k seguidores caem num wa.me/message direto. Sem biografia, sem antes/depois categorizado, sem FAQ de preço.

Quanto dessa paciente nova de harmonização (que vai gastar R$3k+ e pesquisa MUITO antes) tu acha que recua nesse momento do "olá!"?`,
    followup_d3: `Oi Dra. Hollana, voltei. Pensando: harmonização orofacial é decisão estética séria — paciente compara 4-5 dentistas antes de marcar. Quem aparece com LP profissional + galeria antes/depois ética + FAQ de preço fica com a venda. Tu tem 15.9k seguidores que valem MUITO online — só falta o canal converter. Topa ver caso real de dentista estética que fez essa transição?`,
    followup_d7: `Oi Dra. Hollana, última mensagem. 15.9k seguidores é capital social que merece vitrine adequada. Se em algum momento isso bater como prioridade, tu sabe onde me achar.`,
    pre_engajamento_ig: 'D-1 OBRIGATÓRIO: seguir, curtir 2 procedimentos finalizados (harmonização, rejuvenescimento — NÃO foto pessoal). NÃO comentar (dentista com 15k recebe muito genérico). Pre-warming via consumo do conteúdo.',
    razao_ranking: 'TIER S (score 9.5). MAIOR INSTA do batch dental (15.9k). Nicho mais quente em saúde estética + dentista solo. Argumento estrutural premium. Pitch "complexo" R$899-1.197 pelo volume de conteúdo + branding premium.',
  },

  1124: {
    tier: 'A',
    posicao_no_tier: 29,
    dor: 'Dra. Ioana Leobas é ginecologista CRM 4282 + RQE com ULTRA-NICHO técnico: Colposcopia + Tratamento HPV + Microscopia + Histeroscopia. Endereço Clínica Mater Vitta Q.602 Sul, Maps 5.0/23 reviews, 2.207 seguidores. ZERO site profissional — só wa.me + Threads. Nicho HPV/colposcopia tem busca paga ALTÍSSIMA (mulher diagnosticada com HPV faz busca desesperada por especialista). Quem aparecer com LP técnica explicando colposcopia + protocolos HPV + FAQ ("HPV tem cura?", "como é a colposcopia?", "quanto custa tratamento?") fica com TODO o nicho regional.',
    gancho: 'LP profissional ULTRA-NICHO: biografia + CRM+RQE + 4 procedimentos (colposcopia, tratamento HPV, microscopia, histeroscopia) + FAQ técnico de cada + agendamento + 3 artigos SEO premium ("colposcopia em Palmas: como é o procedimento", "HPV tratamento conservador 2026", "histeroscopia diagnóstica indicação"). Captura busca premium "colposcopia Palmas TO" que hoje não tem dono. Argumento estrutural — médica especialista solo com autoridade construída + ZERO web profissional + nicho técnico raro = combinação que converte.',
    objecao: '"Tenho clínica fixa (Mater Vitta), paciente é encaminhada" — modelo via convênio/encaminhamento.',
    resposta_objecao: 'Faz sentido — encaminhamento é canal forte de gineco especialista. Mas pensa: a paciente que recebeu diagnóstico de HPV ontem, está angustiada, vai pesquisar "tratamento HPV Palmas" no Google às 23h ANTES de aceitar encaminhamento. Hoje ela cai em ginecologista geral. Tu tem subespecialização raríssima (colposcopia + HPV + histeroscopia) que poucos médicos do Brasil tem — e o canal não comunica isso. LP técnica vira destino oficial pra busca "HPV Palmas" e captura essa paciente premium ANTES da concorrência. Topa ver?',
    nota_interna: 'ULTRA-NICHO TÉCNICO (HPV + colposcopia + histeroscopia) = busca paga premium + concorrência regional zero. Telefone Maps é fixo (63)3142-0410 — VALIDAR celular WhatsApp via Insta antes. Pre-engajamento Insta D-1 obrigatório (curtir 2 posts técnicos — gineco especialista valoriza pre-engajamento técnico, não emoji). Pitch "complexo" R$899-1.197 (conteúdo técnico HPV + FAQ específico + 3 artigos SEO premium).',
    abertura: `Oi Dra. Ioana, beleza? Eduardo aqui, Impulso Digital, sou de Palmas.

Tô olhando ginecologistas especialistas autônomos em Palmas essa semana e o teu perfil chamou atenção forte — colposcopia + tratamento HPV + histeroscopia é subespecialização raríssima (poucos médicos do Brasil têm essa combinação).

Mas olhei o teu canal de captura: paciente que recebeu diagnóstico de HPV vai pesquisar "tratamento HPV Palmas" no Google às 23h ANTES de aceitar encaminhamento. Cai num wa.me sem biografia, sem FAQ técnico, sem explicação dos protocolos.

Quanto dessa paciente premium tu acha que perde antes mesmo do encaminhamento chegar?`,
    followup_d3: `Oi Dra. Ioana, voltei. Pensando: tu tem subespecialização que MUITO ginecologista do Brasil não tem. SEO pra "colposcopia Palmas" + "HPV Palmas" provavelmente tem concorrência regional zero. Quem ranquear primeiro com LP técnica fica com o nicho por anos. Topa eu te mostrar 1 LP médica que ranqueia em buscas técnicas similares?`,
    followup_d7: `Oi Dra. Ioana, última mensagem. Nicho HPV/colposcopia só vai ficar mais quente (cresce a procura por diagnóstico precoce). Se em algum momento isso bater, tu sabe onde me achar.`,
    pre_engajamento_ig: 'D-1 OBRIGATÓRIO: seguir, curtir 2 posts técnicos sobre HPV ou colposcopia (NÃO foto pessoal). Comentar 1 com algo específico técnico ("informação sobre colposcopia com esse rigor é raro de ver mesmo" ou referência ao protocolo). Médica especialista valoriza pre-engajamento técnico.',
    razao_ranking: 'TIER S (score 9.5). ULTRA-NICHO TÉCNICO (HPV + colposcopia + histeroscopia) = concorrência regional zero. Argumento estrutural — autoridade construída + ZERO web profissional. Busca paga premium. Pitch "complexo" R$899-1.197 (3 artigos SEO premium + FAQ técnico).',
  },

  1127: {
    tier: 'A',
    posicao_no_tier: 30,
    dor: 'Dr. Ricardo Mendonça é ortopedista cirurgião RQE 3540 e 3770 + TEOT (UFPR) com ULTRA-NICHO técnico: Cirurgia da Mão e Microcirurgia. Endereço COT Q.902 Sul, Maps 5.0/90 reviews, 2.141 seguidores Insta. INSIGHT CRÍTICO descoberto pelo CIC #6: ELE JÁ TEM DOMÍNIO PRÓPRIO (`ricardomendonca.com.br`) — MAS o subdomínio `bio.ricardomendonca.com.br` é apenas link-in-bio custom. O domínio raiz não tem site indexado. Ele JÁ INVESTIU em domínio profissional, mas parou no link-in-bio. É EXATAMENTE o perfil que migra de bio→LP em 1 conversa.',
    gancho: 'PITCH UPGRADE — não criação. "Vi que tu já investiu em ricardomendonca.com.br + bio.ricardomendonca.com.br — tu já entendeu que precisa de um lugar único online. O que falta é evoluir o link-in-bio pra LP profissional completa: biografia médica + RQE em destaque + procedimentos catalogados (cirurgia da mão, microcirurgia, lesões nervo periférico, síndrome do túnel do carpo) + galeria de casos com cuidado ético + FAQ técnico + agendamento integrado." Mesmo domínio, conversão profissional. Argumento estrutural ULTRA-NICHO técnico (microcirurgia + cirurgia da mão) + domínio dormente já comprado.',
    objecao: '"Já tenho meu site (bio.ricardomendonca.com.br), funciona" — defesa da solução amadora atual com falsa sensação de domínio próprio.',
    resposta_objecao: 'Faz total sentido — tu já passou da fase de não ter nada online, e isso é importante. Mas pensa: bio.ricardomendonca.com.br é link-in-bio custom — basicamente Linktr.ee com tua marca. O domínio raiz (ricardomendonca.com.br) não tem site indexado no Google. Paciente que pesquisa "cirurgia da mão Palmas TO" não te acha pelo Google. Quem aparece é cirurgião geral. LP profissional no domínio raiz vira destino oficial pra busca "cirurgia da mão Palmas" + "microcirurgia Palmas" — nicho com concorrência regional zero. Mesmo domínio que tu já tem, conversão diferente. Topa ver?',
    nota_interna: 'INSIGHT NOVO do batch CIC #6: TEM DOMÍNIO ricardomendonca.com.br MAS é link-in-bio custom. Pitch UPGRADE explícito (ele já investiu, só falta evoluir). Telefone NÃO veio direto — pegar via bio link. ULTRA-NICHO (cirurgia da mão + microcirurgia) = concorrência regional zero. Pitch "complexo" R$899-1.197 (LP profissional + 3 artigos SEO técnicos + integração com domínio existente).',
    abertura: `Oi Dr. Ricardo, beleza? Eduardo aqui, Impulso Digital, sou de Palmas.

Tô olhando cirurgiões ortopedistas autônomos em Palmas e o teu perfil chamou atenção forte — cirurgia da mão + microcirurgia é subespecialização raríssima (poucos cirurgiões da região fazem).

Vi que tu já investiu em ricardomendonca.com.br — tu já passou da fase de não ter presença web, isso é importante. Mas o subdomínio bio. é só link-in-bio custom (basicamente Linktr.ee com tua marca). O domínio raiz não tem site indexado no Google.

Paciente que pesquisa "cirurgia da mão Palmas" hoje cai em cirurgião geral. Quanto desse paciente especialista tu acha que perde por mês?`,
    followup_d3: `Oi Dr. Ricardo, voltei. Pensando: tu tem nicho TÉCNICO de altíssimo valor (microcirurgia, cirurgia da mão) e domínio próprio já comprado. Falta só evoluir o link-in-bio pra LP profissional completa no domínio raiz — biografia + RQE + procedimentos + FAQ. Mesmo domínio, conversão profissional. Topa ver como ficaria?`,
    followup_d7: `Oi Dr. Ricardo, última mensagem. Microcirurgia em Palmas não tem dono no Google — quem chegar primeiro com LP técnica fica com o nicho por anos. Tu já tem o domínio, falta o conteúdo. Se em algum momento bater, tu sabe onde me achar.`,
    pre_engajamento_ig: 'D-1: seguir, curtir 2 posts técnicos (priorizar conteúdo cirúrgico, casos de mão — NÃO foto pessoal). NÃO comentar (médica especialista recebe muito genérico). Pre-warming via consumo do conteúdo.',
    razao_ranking: 'TIER S (score 9). PITCH UPGRADE puríssimo — ele já tem domínio próprio (ricardomendonca.com.br) mas só link-in-bio. ULTRA-NICHO técnico (cirurgia mão + microcirurgia) = concorrência regional zero. Argumento estrutural autoridade médica. Pitch "complexo" R$899-1.197 (LP profissional + integração com domínio existente).',
  },

  // ── TIER A (CIC #7 — 26/04 micro-nicho clone-Erlane) — 1 lead novo ─────
  // Batch #7 inspirado pela própria Erlane (esposa do Eduardo, case-mãe Impulso).
  // Termo de busca "terapias injetáveis ortomolecular" abriu vertical
  // específica: enfermeiras/biomédicas/farmacêuticas em saúde funcional
  // integrativa. Erlane vira PROVA SOCIAL LITERAL LOCAL — match 1:1.

  1133: {
    tier: 'A',
    posicao_no_tier: 31,
    dor: 'Amanda Silveira é enfermeira especialista (COREN — não exibido na bio, validar) que opera "Estética e Terapias Injetáveis" em Palmas-TO. Maps 5.0/10 reviews, endereço Q.104 Sul Rua SE 05 N 33 AP 01 (opera home-office em apartamento). Profissional goiana de 33 anos atendendo em Palmas. Nicho: Estética + Saúde Funcional Integrativa (terapias injetáveis, bioestimuladores, soroterapia). 1.360 seguidores Insta, ZERO link in bio visível — tudo no DM. CLONE 1:1 da Erlane (EV Suplementos Injetáveis): mesma profissão paramédica, mesmo serviço, mesma cidade, mesmo gargalo de captura.',
    gancho: 'PITCH ESPECIAL — único do banco onde o case-clone é da MESMA cidade (Erlane mora em Palmas, Eduardo conhece pessoalmente). Abertura: *"A Erlane (@ev.suplementosinjetaveis) é nossa cliente em Palmas e tinha exatamente o seu setup — enfermeira, terapias injetáveis, saúde funcional, atendimento por horário marcado. Construímos a LP dela (evsuplementosinjetaveis.com), parou de explicar protocolo no DM 50x por dia. Posso te mostrar o que mudou na operação dela?"*. Em cidade média, indicação cruzada da própria persona-mãe é o atalho de fechamento mais rápido — pedir permissão da Erlane antes de disparar.',
    objecao: '"Atendo em casa, fluxo pequeno, não preciso de site agora" — defesa do operacional home-office.',
    resposta_objecao: 'Justamente porque tu opera home-office, LP é ainda mais importante — paciente nova que viu teu post sobre suplementação injetável vai pesquisar "Amanda Silveira enfermeira Palmas" antes de marcar (ela vai até a TUA casa, decisão de confiança máxima). Sem LP profissional com biografia + COREN + protocolos + endereço + agendamento, paciente recua. A Erlane teve esse mesmo medo no começo — depois da LP, parou de receber DM perguntando "é confiável?", "como funciona?". Topa ver?',
    nota_interna: 'CLONE 1:1 DA ERLANE — Eduardo conhece a Erlane pessoalmente (esposa). VALIDAR antes de disparar: (1) pedir permissão da Erlane pra usar nome dela explicitamente como case, (2) checar se Erlane conhece Amanda pessoalmente — em cidade média, indicação cruzada da persona-mãe é atalho de fechamento. Telefone NÃO veio direto — pegar via DM Insta antes de disparar. Pre-engajamento OBRIGATÓRIO via Insta D-1. COREN não exibido na bio — confirmar registro antes do pitch (filtro 0 obrigatório).',
    abertura: `Oi Amanda, beleza? Eduardo aqui, Impulso Digital, sou de Palmas.

Tô olhando enfermeiras autônomas de terapias injetáveis em Palmas e o teu perfil chamou atenção forte. Tu opera home-office, atende com horário marcado, foco em saúde funcional integrativa.

Pergunto direto: tu conhece a Erlane (@ev.suplementosinjetaveis)? Ela é nossa cliente aqui em Palmas e tinha EXATAMENTE o teu setup há 6 meses — enfermeira, terapias injetáveis, atendimento por horário, gargalo no DM.

Quer ver o que mudou na operação dela quando lançou a LP profissional?`,
    followup_d3: `Oi Amanda, voltei. Pensando: paciente que vai até TUA casa pra terapia injetável tem decisão de confiança máxima — ela pesquisa MUITO antes. Erlane tinha esse mesmo medo, depois da LP a paciente já chegava informada (biografia, COREN, protocolos, endereço). Topa eu te mostrar a LP dela em 1 print + diferença operacional?`,
    followup_d7: `Oi Amanda, última mensagem da minha parte. Sei que home-office pequeno parece "não preciso de site agora". Erlane também pensava assim. Hoje ela atende quase full por causa da LP. Se em algum momento isso bater pra ti, tu sabe onde me achar.`,
    pre_engajamento_ig: 'D-1 OBRIGATÓRIO: seguir, curtir 2-3 posts técnicos (terapias injetáveis, bioestimuladores, soroterapia — não foto pessoal). Comentar 1 com algo do tipo "bioestimulador injetável tem feito diferença mesmo em estética" ou referência ao protocolo específico. Profissional saúde valoriza pre-engajamento técnico, NÃO emoji.',
    razao_ranking: 'TIER S (score 9). CLONE 1:1 DA ERLANE — único caso do banco onde o case-clone é da MESMA cidade. Eduardo conhece Erlane pessoalmente. Pitch ESPELHO LITERAL + indicação cruzada possível = atalho de fechamento mais rápido do pipeline inteiro nesse micro-nicho. Ticket recorrente (R$200-400 sessão). LP a partir de R$499 paga em 2 sessões.',
  },

  // ── TIER A (CIC #8 — 26/04 cluster CLONE-IRSNAYRA) — 4 análises ───────
  // Maior cluster identificado: 5 Tier S num único round (farmacêuticas/
  // biomédicas estetas com harmonização). caso anterior não-fechado (case Impulso que NÃO
  // fechou) vira ATIVO de pipeline: aprendizado da objeção dela vira
  // "VACINA DE PITCH" pros clones — focar UM produto-âncora + ROI por
  // paciente + gatilho sazonal. NÃO usar argumento "site barato".

  1135: {
    tier: 'A',
    posicao_no_tier: 32,
    dor: 'Dra. Juliana Resende é biomédica esteta solo em Palmas-TO com 5.260 seguidores Insta — clone-caso anterior não-fechado MAIS FORTE em volume (5x mais seguidores que caso anterior não-fechado). Bio com geo Palmas-TO explícito. Nicho: Rejuvenescimento Facial + Harmonização Full Face + Glútea (ticket R$1.000-3.000 por protocolo, premium corporal). Site atual: wa.me/message/ZN5OKCNAH35EN1 + Threads (sem site profissional, só DM). 5.260 seguidores qualificados (público de protocolos premium não é casual) + serviço alto-ticket + canal único wa.me = leads frios escapam constantemente.',
    gancho: 'PITCH AJUSTADO pro cluster clone-caso anterior não-fechado (lição aprendida do não-fechamento da caso anterior não-fechado): NÃO posicionar como "site barato", posicionar como "LP que te coloca no nível de quem cobra R$3k". Foco em UM produto-âncora (escolher Glútea OU Full Face — não os dois ao mesmo tempo na LP), com FAQ específico daquele protocolo, antes/depois categorizado, agendamento. Caso-clone visual: (referência visual interna) é a referência ESTÉTICA (mesmo padrão de carrossel-cápsula com produtos nomeados tipo PILL FOOD/PROTOCOLO/MÉTODO).',
    objecao: '"Já vendo bem assim, ticket alto, paciente fiel" — defesa do operacional premium.',
    resposta_objecao: 'Justamente porque tu cobra R$1.000-3.000 por protocolo, a LP é mais importante — não é pra captar paciente que escolhe pelo preço, é pra QUALIFICAR a paciente que vai gastar R$3k em harmonização. Cliente que vai pagar esse valor pesquisa MUITO antes de marcar (compara 5-7 profissionais), e quando cai no teu wa.me direto sem ver biografia + CRBM + protocolo + antes/depois categorizado — ela recua e vai pra concorrente que tem LP. O que eu monto não é "site barato", é vitrine que coloca tu no nível visual de quem cobra teu ticket. Topa eu te mostrar caso similar?',
    nota_interna: 'CLUSTER CLONE-IRSNAYRA — VACINA DE PITCH OBRIGATÓRIA: NÃO usar argumento "site barato/profissional". USAR: (1) "LP que coloca tu no nível de quem cobra teu ticket", (2) UM produto-âncora (não bio inteira), (3) ROI por paciente (não preço LP), (4) gatilho sazonal se possível (verão, BBB, casamentos). Telefone NÃO veio direto — pegar via wa.me Insta. CRBM-TO não confirmado na bio — VALIDAR. Pre-engajamento OBRIGATÓRIO (curtir 2 posts de protocolo, NÃO foto pessoal).',
    abertura: `Oi Dra. Juliana, beleza? Eduardo aqui, Impulso Digital, sou de Palmas.

Tô olhando biomédicas estetas autônomas em Palmas com foco em harmonização e o teu perfil chamou atenção forte — 5.260 seguidores qualificados (público que segue biomédica de protocolo premium não é casual), foco em rejuvenescimento + full face + glútea.

Mas olhei teu link: 5k seguidores caem num wa.me direto. Sem biografia, sem CRBM em destaque, sem antes/depois categorizado, sem FAQ específico de cada protocolo.

A paciente que vai gastar R$3k numa harmonização glútea pesquisa MUITO antes de marcar — quanto dela tu acha que recua nesse momento do "olá!"?`,
    followup_d3: `Oi Dra. Juliana, voltei. Pensando: paciente que paga R$3k em harmonização glútea compara 5-7 profissionais antes. LP não é pra captar quem escolhe por preço — é pra QUALIFICAR essa paciente premium que precisa ver biografia + CRBM + protocolo + antes/depois antes de mandar DM. Foco em UM protocolo-âncora (Glútea OU Full Face) faz diferença grande. Topa ver caso similar?`,
    followup_d7: `Oi Dra. Juliana, última mensagem da minha parte. Sei que biomédica solo com 5k seguidores tem rotina puxada de protocolo + atendimento. Vou parar. Só registro: paciente premium pesquisa antes de marcar, e o canal precisa transmitir o nível do teu ticket. Tu sabe onde me achar.`,
    pre_engajamento_ig: 'D-1 OBRIGATÓRIO: seguir, curtir 2 posts de protocolo (priorizar antes/depois ético OU explicação técnica de produto, NÃO foto pessoal). NÃO comentar (biomédica esteta com 5k seg recebe muito comentário genérico de potencial cliente — queima rápido).',
    razao_ranking: 'TIER S (score 9.5). CLUSTER CLONE-IRSNAYRA mais forte em volume. Ticket premium (R$1k-3k protocolo). Vacina de pitch OBRIGATÓRIA — não argumentar preço, argumentar nível de vitrine + qualificação de paciente premium. LP a partir de R$799-999 (Complexo) provável na call.',
  },

  1136: {
    tier: 'A',
    posicao_no_tier: 33,
    dor: 'Dra. Tuany Rifer é farmacêutica esteta solo em Palmas-TO — CLONE-IRSNAYRA EXATO (mesma profissão literal: Farmacêutica Esteta). 2.079 seguidores Insta, geo Palmas-TO explícito na bio. Nicho: Harmonização Facial — slogan "Beleza com Naturalidade". Site atual: linktr.ee/tuanyrf1. Parceria com @franconerobucar mostra ecossistema profissional sem hub central. Linktr.ee é o sintoma EXATO do gap LP — ela já entendeu que precisa de "lugar único" mas escolheu o atalho amador.',
    gancho: 'PITCH AJUSTADO clone-caso anterior não-fechado + reforço: o link in bio que ela tem hoje (linktr.ee) é SINAL DE COMPRA segundo o market intelligence — ela JÁ está disposta a investir em presença online, só escolheu o atalho amador. LP profissional vira o próximo degrau natural. Foco em UM protocolo-âncora (Harmonização Facial — beleza com naturalidade) com FAQ + antes/depois ético + agendamento integrado + integração com parceria @franconerobucar (link cruzado, ecossistema). Caso-clone visual: (referência visual interna) como referência estética.',
    objecao: '"Tenho linktr.ee, funciona, parceiros sabem do meu trabalho" — defesa da solução amadora atual + ecossistema de indicação.',
    resposta_objecao: 'Faz sentido — linktr.ee centraliza link, e ecossistema de parceria com @franconerobucar mostra que tu construiu network. Mas pensa: o paciente NOVO indicado pelo Francone vai pesquisar "Tuany Rifer farmacêutica esteta Palmas" antes de marcar (decisão estética séria). Cai no linktr.ee e vê 5 links sem hierarquia, sem teu rosto profissional, sem CRF, sem método "Beleza com Naturalidade" explicado. Recua. LP profissional pega esse momento: ela chega e vê biografia + CRF + UM método-âncora bem detalhado. Mesma indicação, conversão diferente. Topa ver?',
    nota_interna: 'CLUSTER CLONE-IRSNAYRA — VACINA DE PITCH ATIVADA. CRF-TO não confirmado na bio — VALIDAR. Telefone via linktr.ee — pegar antes. Pre-engajamento OBRIGATÓRIO. Pitch foco em UM protocolo-âncora (Harmonização Facial / Beleza com Naturalidade — slogan dela mesma) — não tentar caber bio inteira.',
    abertura: `Oi Dra. Tuany, beleza? Eduardo aqui, Impulso Digital, sou de Palmas.

Tô olhando farmacêuticas estetas autônomas em Palmas com foco em harmonização e o teu perfil chamou atenção forte — slogan "Beleza com Naturalidade" + parceria com Francone mostra que tu tem método e ecossistema construído.

Mas olhei teu linktr.ee: 5 links sem hierarquia, sem teu método explicado, sem biografia com CRF em destaque. Paciente nova indicada pelo Francone cai aí e tem que adivinhar qual link é dela.

Quanto dessa paciente indicada (que pesquisou antes de mandar DM) tu acha que recua no linktr.ee?`,
    followup_d3: `Oi Dra. Tuany, voltei. Pensando: tu já entendeu que precisa de "lugar único" online (linktr.ee). Falta só evoluir pra LP profissional dedicada ao teu método "Beleza com Naturalidade" — biografia + CRF em destaque + protocolo principal + antes/depois ético. Mesmo ecossistema de parceria, conversão profissional. Topa ver caso real?`,
    followup_d7: `Oi Dra. Tuany, última mensagem. Linktr.ee cumpre o básico, mas teu método "Beleza com Naturalidade" merece vitrine própria pra paciente que pesquisa antes. Se em algum momento bater, tu sabe onde me achar.`,
    pre_engajamento_ig: 'D-1: seguir, curtir 2 posts (priorizar conteúdo de "beleza com naturalidade" — método dela mesma, não foto pessoal genérica). Comentar 1 com algo específico do método ("a abordagem de harmonização com naturalidade é raro de ver com esse rigor mesmo"). Profissional saúde valoriza pre-engajamento sobre o método dela mesma.',
    razao_ranking: 'TIER S (score 9). CLONE-IRSNAYRA EXATO (mesma profissão "Farmacêutica Esteta"). Linktr.ee = sinal de compra. Pitch de UPGRADE (não criação) com vacina ativada. Foco em método-âncora "Beleza com Naturalidade". LP a partir de R$499-799 (Padrão/Complexo) na call.',
  },

  1137: {
    tier: 'A',
    posicao_no_tier: 34,
    dor: 'Dra. Adriane Garcia é esteta solo Palmas-TO — PERFIL MAIS PARECIDO COM IRSNAYRA do banco inteiro: 1.065 seguidores Insta (vs 1.183 da caso anterior não-fechado), bio dispersa em múltiplas áreas (Estética Injetável + Manchas + Poros + Envelhecimento + Soroterapia + PEIM + Botox + Preenchimento), site atual linktr.ee/adriane.esteta. ALTO RISCO de mesma objeção que matou o fechamento da caso anterior não-fechado: ticket alto vs preço LP percebido como "barato demais", bio dispersa sem produto-âncora único, sem urgência clara.',
    gancho: 'PITCH PREVENTIVAMENTE AJUSTADO (vacina ativa) pra evitar repetir erro caso anterior não-fechado. NÃO argumentar preço LP (R$499 pode soar barato demais pro nível dela). Argumentar (1) ROI por paciente — "1 paciente nova de R$1k que tu captura paga 2x a LP", (2) UM produto-âncora bem definido (escolher PEIM OU Soroterapia OU Botox — NÃO tentar caber 7 áreas), (3) gatilho sazonal concreto (verão, BBB, casamentos), (4) caso-clone visual (referência visual interna) como referência estética + caso-clone Erlane LOCAL como prova social. Bem estruturado, 4 vetores juntos.',
    objecao: '"Já vendo bem, paciente fiel, ticket alto" + (provável objeção caso anterior não-fechado) "site é barato demais pro meu nível" — combinação que matou o fechamento caso anterior não-fechado.',
    resposta_objecao: 'Faz total sentido — tu opera no nível premium e site amador realmente queima esse posicionamento. JUSTAMENTE por isso a LP profissional faz sentido — não é pra "ter site barato", é pra colocar tu no NÍVEL VISUAL de quem cobra teu ticket. Pensa em ROI: 1 paciente nova de PEIM ou preenchimento (R$1.000+) que tu captura via LP paga 2x o investimento. Não estou te oferecendo "barato" — estou te oferecendo vitrine que QUALIFICA paciente premium. Tem caso real disso aqui em Palmas (Erlane, EV Suplementos). Topa ver?',
    nota_interna: 'CASO MAIS DELICADO do cluster — perfil tecnicamente análogo a um prospect anterior que não fechou (volume, bio dispersa, ticket alto). VACINA DE PITCH OBRIGATÓRIA: (1) NUNCA argumentar preço, (2) escolher UM produto-âncora ANTES da call (PEIM ou Soroterapia ou Botox — sugerir o que rende mais ROI), (3) ancorar gatilho sazonal, (4) usar EV Suplementos Injetáveis (Erlane) como case real local — único case real no nicho saúde-estética paramédica. Telefone via linktr.ee — pegar antes. CRBM/CRF não confirmado — VALIDAR.',
    abertura: `Oi Dra. Adriane, beleza? Eduardo aqui, Impulso Digital, sou de Palmas.

Tô olhando estetas autônomas em Palmas com foco em injetável e o teu perfil chamou atenção — PEIM, soroterapia, botox, preenchimento, manchas. Operação premium consolidada.

Mas olhei teu linktr.ee: 7 áreas listadas. A paciente que vai pagar R$1k+ num PEIM ou preenchimento pesquisa MUITO antes — e quando cai num link sem método-âncora claro, sem biografia com registro em destaque, ela recua.

Pergunto: se tu pudesse posicionar UM protocolo-âncora online (o que rende mais ROI por paciente), qual seria?`,
    followup_d3: `Oi Dra. Adriane, voltei. Pensando: a Erlane (@ev.suplementosinjetaveis), nossa cliente em Palmas, tinha exatamente o mesmo desafio — bio dispersa entre soroterapia, vitamina, ozônio. Quando focamos a LP em UM protocolo-âncora (sem perder os outros), captura premium dobrou. Não é "site barato" — é vitrine que qualifica paciente que paga teu ticket. Topa ver?`,
    followup_d7: `Oi Dra. Adriane, última mensagem. Sei que estética injetável tem ciclo de protocolo + retorno. Vou parar. Só registro: 1 paciente nova de R$1k+ paga 2x o investimento da LP. Se em algum momento isso bater, tu sabe onde me achar.`,
    pre_engajamento_ig: 'D-1 OBRIGATÓRIO: seguir, curtir 2 posts de protocolo específico (priorizar PEIM, preenchimento OU soroterapia — NÃO foto pessoal). NÃO comentar (perfil pequeno mas premium recebe genérico — queima). Pre-warming via consumo do conteúdo.',
    razao_ranking: 'TIER S (score 9). CASO MAIS DELICADO do cluster — perfil análogo à caso anterior não-fechado (não fechou). VACINA DE PITCH ATIVA. Pitch foco em ROI por paciente + UM produto-âncora + gatilho sazonal — NUNCA argumentar preço. LP a partir de R$799-999 provável (justamente pra evitar percepção de "barato demais").',
  },

  1140: {
    tier: 'A',
    posicao_no_tier: 35,
    dor: 'Dra. Ana Luíza Duarte é DENTISTA CRO TO 3556 (categoria Dentista Estético). 16.500 seguidores Insta (volume gigante), Maps 5.0/99 reviews, método PROTAGONIZE — Harmonização Facial. CASO ÚNICO no banco: ELA TEM SITE — `dra-analuizaduarte.vizzoone.com`. MAS Vizzoone é plataforma odonto genérica de subdomínio compartilhado (similar a Trinks/Booksy mas pra dentista) — site dela é template padronizado, sem identidade autoral, com URL feia (subdomínio.vizzoone.com não é .com.br próprio). Pitch radicalmente diferente: "MIGRAR DA PLATAFORMA GENÉRICA pra LP autoral com domínio próprio".',
    gancho: 'PITCH ESPECIAL — único do banco onde lead JÁ PAGA POR plataforma profissional MAS é compartilhada/genérica. Argumento: "Tu já entendeu que precisa de site profissional (e parabéns por isso, raro em Palmas). Mas dra-analuizaduarte.vizzoone.com é subdomínio de plataforma — toda dentista do Vizzoone tem site igual ao teu, só com nome trocado. O que eu monto é diferente: domínio próprio (analuizaduarte.com.br ou similar), identidade visual TUA, método PROTAGONIZE em destaque, biografia + CRO + galeria antes/depois ÚNICA. Tu sai da plataforma, vira marca." Argumento estrutural — diferenciação contra padronização Vizzoone.',
    objecao: '"Já tenho site Vizzoone, pago mensalidade, funciona" — defesa do investimento atual.',
    resposta_objecao: 'Concordo que ter Vizzoone é melhor que não ter nada — e parabéns por já ter saído da fase amadora. MAS pensa: cada dentista do Vizzoone tem site IGUAL AO TEU, só com nome trocado. URL é "dra-analuizaduarte.vizzoone.com" — paciente que vê isso percebe na hora "isso é template de plataforma". Pra paciente que vai pagar R$3k+ em harmonização, o URL é parte da percepção de seriedade. Domínio próprio (analuizaduarte.com.br ou método.com.br) + identidade autoral + método PROTAGONIZE em destaque = vitrine que NÃO existe em outra dentista. Tu sai do template, vira marca. E o Vizzoone tu pode manter como agendamento secundário, não desliga. Topa ver?',
    nota_interna: 'CASO ÚNICO no banco — Lead que JÁ PAGA POR plataforma profissional. Pitch RADICAL: "domínio próprio + identidade autoral" — argumento de DIFERENCIAÇÃO, não de criação. CRO TO 3556 confirmado. Maps 5.0/99 reviews valida operação. Telefone NÃO veio direto — pegar via DM Insta ou Vizzoone. Pre-engajamento OBRIGATÓRIO (16.5k seg = volume gigante). Pitch "complexo" provável (R$899-1.197) pelo branding autoral + integração com Vizzoone como secundário.',
    abertura: `Oi Dra. Ana Luíza, beleza? Eduardo aqui, Impulso Digital, sou de Palmas.

Tô olhando dentistas autônomas de harmonização em Palmas e o teu perfil chamou atenção forte — 16.5k seguidores Insta + 5★/99 reviews Maps + método PROTAGONIZE é nível raríssimo aqui. E parabéns, vi que tu já investe em site (dra-analuizaduarte.vizzoone.com) — raro em Palmas.

Mas pergunto direto: tu já reparou que toda dentista do Vizzoone tem site IGUAL ao teu, só com nome trocado? Pra paciente que vai pagar R$3k em harmonização, o URL e o template idêntico transmitem "plataforma de dentista", não "marca autoral".

Quanto dessa paciente premium tu acha que percebe isso e recua?`,
    followup_d3: `Oi Dra. Ana Luíza, voltei. Pensando: tu tem método PROTAGONIZE (autoral) + 16.5k seguidores + 99 reviews 5★ = marca consolidada. Mas o canal digital é template de plataforma. Domínio próprio + identidade autoral + método em destaque + galeria única vira vitrine que NENHUMA dentista tem em Palmas. Vizzoone fica como agendamento secundário, não desliga. Topa ver caso?`,
    followup_d7: `Oi Dra. Ana Luíza, última mensagem da minha parte. Tu já passou da fase amadora — agora é diferenciação. Se em algum momento isso bater como prioridade, tu sabe onde me achar.`,
    pre_engajamento_ig: 'D-1 OBRIGATÓRIO: seguir, curtir 2 posts do método PROTAGONIZE (autoral dela, NÃO foto pessoal). NÃO comentar (16.5k seg = recebe muito genérico).',
    razao_ranking: 'TIER B/A híbrido (score 6 base + caso especial). ÚNICO lead do banco que JÁ PAGA por plataforma profissional. Pitch RADICAL diferenciação: domínio próprio + identidade autoral + método em destaque. 16.5k IG + 5★/99 = autoridade gigante. Se fechar, vira case showcase de "saída de Vizzoone pra LP autoral".',
  },

  // ── TIER A (CIC #9 — 26/04 cluster CLONE-GB NUTRITION Shopify) — 5 leads ──
  // Persona-mãe: Gabriel (@gabribarros10) + GB Nutrition (@gbnutritionn).
  // Case Impulso ATIVO em produção. Insight valiosíssimo: Sabor da Terra
  // E Nutri+ SÃO SEGUIDAS pelo Gabriel — entrar via INDICAÇÃO DELE é
  // atalho de fechamento. Padrão Shopify: NÃO argumentar autoridade
  // (que funciona com LP), argumentar CONVERSÃO 24/7 + CHECKOUT QUE
  // FUNCIONA SEM VOCÊ.

  1141: {
    tier: 'A',
    posicao_no_tier: 36,
    dor: 'Sabor da Terra Marmita Fit é o LEAD MAIS QUENTE DO PIPELINE INTEIRO até agora. Conta Insta VERIFICADA com 45.100 seguidores (público fitness Palmas qualificado), endereço Quadra 906 sul Av LO 23, telefone (63)99288-0204 confirmado. NICHO: marmita fit / comida saudável delivery com plano semanal recorrente. Site atual: sabordaterra.my.canva.site/cardapiodigital — Canva site é AMADOR (subdomínio plataforma + template genérico + zero checkout estruturado). 45k seg + recorrência semanal + Canva site = receita massiva escapando todo dia. Cada cliente que quer fechar plano semanal precisa pedir no WhatsApp, esperar resposta, mandar pix toda semana.',
    gancho: 'PITCH ESPECIAL — Sabor da Terra é seguida pelo @gabribarros10 (Gabriel, case ATIVO Impulso GB Nutrition). ENTRAR VIA INDICAÇÃO DO GABRIEL é atalho de fechamento (em cidade média, indicação cruzada vale ouro). Pitch: Shopify com plano semanal automatizado (assinatura recorrente Mercado Pago) + cardápio navegável por categoria + entrega motoboy Palmas + opção pacote 5/7/15 dias. Cliente paga uma vez, marmita chega toda semana sem ela precisar pedir. Mesma operação dela hoje, sem gargalo do WhatsApp.',
    objecao: '"Já tenho o site Canva, cliente pede pelo WhatsApp, dá certo" — operação ativa defendendo o status quo.',
    resposta_objecao: 'Concordo — 45k seg + Canva site mostra que tu construiu marca real. Mas pensa em assinatura semanal: hoje cliente que quer pacote 7 dias tem que mandar mensagem TODA SEGUNDA pra confirmar pedido + mandar pix. 60% das clientes desistem do plano semanal nessa fricção (todo final de semana volta a duvidar se vale a pena). Shopify resolve com assinatura recorrente: ela paga uma vez, marmita chega toda semana, ela só recebe. 1 cliente recorrente de R$300/sem = R$1.200/mês x 12 meses = R$14.400/ano que tu não captura hoje. Topa eu te mostrar como ficaria? E olha — vi que o Gabriel (GB Nutrition) te segue, tu conhece ele pessoalmente?',
    nota_interna: 'LEAD MAIS QUENTE DO PIPELINE INTEIRO. Conta verified + 45.100 seg + Canva site + plano semanal = combinação ÓBVIA de Shopify. Telefone (63)99288-0204 confirmado. AÇÃO ESPECIAL CRÍTICA: ANTES DE DISPARAR, pedir Gabriel pra fazer indicação direta ("Sabor, te apresento o Eduardo que cuida do meu site, ele ajuda lojas como a tua"). Se Gabriel topar, fechamento dispara. Pre-engajamento Insta D-1 obrigatório. Pitch "complexo" provável (R$899-1.297) pelo plano de assinatura recorrente + integração Mercado Pago.',
    abertura: `Oi, beleza? Eduardo aqui, Impulso Digital, sou de Palmas.

Tô olhando marcas de comida fit em Palmas e o teu perfil chamou atenção MUITO forte — 45.100 seguidores qualificados + Insta verified + plano semanal de marmita = nível raríssimo aqui em Palmas.

Mas vi teu link da bio: sabordaterra.my.canva.site. Cliente que quer plano semanal tem que mandar mensagem TODA SEGUNDA pra confirmar + mandar pix. 60% desistem nessa fricção semanal.

Pergunto direto: tu conhece o Gabriel (@gbnutritionn)? Ele cuida do meu site e segue tu. Posso pedir uma intro?`,
    followup_d3: `Oi, voltei. Pensando: 1 cliente recorrente de R$300/sem = R$14.400/ano que tu não captura hoje. Shopify resolve com assinatura recorrente — cliente paga uma vez, marmita chega toda semana, sem WhatsApp. Modelo idêntico ao do Gabriel (GB Nutrition) mas com plano semanal embutido. Topa eu te mostrar 1 print?`,
    followup_d7: `Oi, última mensagem da minha parte. Sei que rotina de marmitaria fitness é puxada. Vou parar. Só registro: 45k seg verified é capital social que MUITO marmiteiro do Brasil vai levar 5 anos pra construir. Falta só o checkout que funciona sem ti. Tu sabe onde me achar.`,
    pre_engajamento_ig: 'D-1 OBRIGATÓRIO: seguir, curtir 2 posts (priorizar foto de marmita finalizada OU cliente fitness consumindo, NÃO foto pessoal). Comentar 1 com algo específico do prato ("essa marmita com batata-doce fit ficou impecável" ou referência ao plano semanal). Marca verified com 45k seg recebe muito comentário genérico — comentário ESPECÍFICO destaca.',
    razao_ranking: 'LEAD MAIS QUENTE DO PIPELINE (score 10!). Verified + 45.100 seg + Canva site + plano semanal recorrente + SEGUIDA PELO GABRIEL = atalho de fechamento via indicação. Pitch "complexo" R$899-1.297 (assinatura recorrente + cardápio + integração MP). 1 cliente recorrente paga 5x a LP em 1 ano.',
  },

  1142: {
    tier: 'A',
    posicao_no_tier: 37,
    dor: 'Nutri+ Suplementos é concorrente DIRETO do Gabriel (GB Nutrition) mas em escala MUITO maior: conta Insta VERIFICADA, 44.200 seguidores, Maps 5.0/855 reviews (número ABSURDO em Palmas — acima de 99% das lojas), endereço Q.104 Norte Av LO 2, cobertura regional Palmas + Porto Nacional + Paraíso + Gurupi + Taquaralto. Site atual: linktr.ee/nsuplementos (sinal de compra — ela JÁ entendeu que precisa de hub digital, escolheu o atalho). Cobertura regional declarada SEM checkout estruturado = ineficiência massiva. Cliente de Gurupi que viu post sobre creatina tem que mandar DM, esperar resposta, perguntar frete, mandar pix.',
    gancho: 'PITCH PARALELO — Nutri+ é seguida pelo @gabribarros10 mesmo sendo concorrente DIRETO. Networking fitness Palmas é fluido. Pitch: "Você já é referência regional no Tocantins, falta o checkout regional" — Shopify com cálculo de frete automático por cidade, integração motoboy Palmas + Correios pra Porto/Paraíso/Gurupi, catálogo navegável, conta única de cliente. Mesmo modelo do Gabriel (GB Nutrition) mas em escala maior. Linktr.ee como SINAL DE COMPRA: ela já investiu em hub digital, falta só evoluir pra Shopify real.',
    objecao: '"Já tenho linktr.ee, 855 reviews, cobertura regional consolidada — tá funcionando" — operação madura defendendo o status quo.',
    resposta_objecao: 'Total razão — 855 reviews 5★ é número que MUITO atacadista do Brasil leva 10 anos pra construir, e cobertura regional é capital social raro. Mas pensa: cliente novo de Gurupi que viu teu post de creatina pesquisa "Nutri+ suplementos Palmas" no Google às 23h. Cai no linktr.ee, vê 5 links sem hierarquia, sem cálculo de frete pra cidade dele, sem catálogo navegável. Recua. Shopify pega esse momento: ele entra, escolhe creatina, sistema calcula frete automático pra Gurupi, paga em 12x, recebe rastreio. Mesmo cliente que te conhece via Maps, conversão diferente. Topa ver caso? E vi que tu segue/é seguida pelo Gabriel (GB Nutrition) — vocês se conhecem?',
    nota_interna: 'CONCORRENTE DIRETO do Gabriel — DELICADO. SEGUIDA POR @gabribarros10 = networking fluido (não rivalidade aberta). Antes de disparar, perguntar Gabriel se ele tem relação pessoal com ela (parceria, indicação cruzada, etc). Se Gabriel autorizar, fica natural mencionar ele na 1ª mensagem. Telefone (63)99982-8285 confirmado bio. Pitch "complexo" R$899-1.197 (catálogo regional + cálculo frete por cidade + área cliente).',
    abertura: `Oi, beleza? Eduardo aqui, Impulso Digital, sou de Palmas.

Tô olhando lojas de suplemento mais consolidadas do Tocantins e o perfil de vocês chamou atenção MUITO forte — Insta verified + 44.200 seguidores + 855 reviews 5★ Maps + cobertura Palmas/Porto/Paraíso/Gurupi/Taquaralto. Vocês são literalmente a referência regional de suplemento no estado.

Mas vi o linktr.ee/nsuplementos: cliente de Gurupi que vê teu post sobre creatina cai num link sem cálculo de frete pra cidade dele, sem catálogo navegável.

Quanto desse cliente regional vocês acham que perdem por não ter checkout que funcione pra fora de Palmas?`,
    followup_d3: `Oi, voltei. Pensando: vocês têm o ATIVO mais raro (855 reviews + cobertura regional) — só falta o canal converter. Shopify com frete automático por cidade + catálogo navegável + parcelamento 12x = checkout regional que vocês precisam. E olha, o Gabriel (GB Nutrition) é meu cliente — modelo dele é mesmo princípio em escala menor. Topa ver caso real?`,
    followup_d7: `Oi, última mensagem. Cobertura regional Tocantins é capital que poucas marcas de suplemento do Brasil têm. Falta só capturar essa cobertura no checkout. Se em algum momento bater, vocês sabem onde me achar.`,
    pre_engajamento_ig: 'D-1: seguir, curtir 2 posts (priorizar lançamento OU promoção regional, não foto pessoal). NÃO comentar (operação madura recebe muito genérico). Pre-warming via consumo do conteúdo.',
    razao_ranking: 'TIER S puríssimo (score 9.5). Verified + 44.2k seg + 855 reviews 5★ (recorde Maps suplemento Palmas) + linktr.ee + cobertura regional = combinação perfeita Shopify. Concorrente DIRETO Gabriel mas seguida por ele = abordagem com cuidado. Pitch enterprise/regional R$1.197-1.497.',
  },

  1143: {
    tier: 'A',
    posicao_no_tier: 38,
    dor: 'B K Moda Fitness é loja de varejo fitness em Taquaralto-Palmas com 20.100 seguidores Insta + 1.075 posts + LIVE COMO DESTAQUE PRINCIPAL no perfil. Endereço: Rua P4 frente feira Maria das Dores. Catálogo: LIVE, Bolha (calça), Micro canelado, Blusas tule, Flare Premium, ALO Yoga. Site atual: wa.me direto + Threads (ZERO web). Modelo de venda: Lives semanais. Problema: Live SÓ vende pra quem está online no momento exato. Cliente que viu story do produto 3 horas depois ou viu uma referência do produto numa amiga não consegue comprar — tem que mandar DM, esperar resposta, esperar próxima Live, etc.',
    gancho: 'PITCH ESPECIAL — "A LIVE VENDE, O SHOPIFY FECHA". Lives BK acontecem semanalmente. Shopify resolve a fila pós-Live: cliente assiste Live, separa peça mentalmente, finaliza checkout 24/7 (mesmo às 3h da manhã). Loja vende ENQUANTO ELA DORME. Não substitui Live (que é o motor de vendas), complementa: Live → demanda → fila no Shopify → conversão automática. Case-clone GB Nutrition (varejo + envio + Lives recorrentes).',
    objecao: '"As Lives já vendem demais, não preciso de site" — defesa do operacional atual que funciona.',
    resposta_objecao: 'Concordo — Live é o motor de vendas e isso não muda. Mas pensa: cliente que assistiu Live ontem mas não comprou na hora porque tava no trabalho, hoje volta no Insta e vê o produto. O que ela faz? Manda DM. Espera resposta. Pergunta tamanho. Confirma. Pix. 30 min. 60% desistem nesse caminho. Shopify pega EXATAMENTE esse momento: ela vê o produto, clica, paga em 12x, recebe rastreio. Mesma demanda da Live, conversão de 60% pra 95%. E motoboy de Taquaralto continua entregando — só agora ele recebe pedido pronto, sem 30 mensagens cruzadas. Topa ver?',
    nota_interna: 'MAIOR CLUSTER CLONE-GB IDENTIFICADO no batch #9: moda fitness com Lives + envio + motoboy. BK + DeLótus + PMW = 3 Tier S nesse padrão. Pitch dedicado "Live vende, Shopify fecha". Telefone (63)99267-2610 confirmado. Pre-engajamento Insta D-1 obrigatório (curtir 2 posts de Live OU produto, não foto pessoal). Pitch "complexo" R$899-999 (catálogo Live + integração com agenda de Live + motoboy).',
    abertura: `Oi, beleza? Eduardo aqui, Impulso Digital, sou de Palmas.

Tô olhando lojas de moda fitness mais ativas em Palmas e o teu perfil chamou atenção MUITO forte — 20.100 seguidores + 1.075 posts + Lives semanais como destaque principal. Tu construiu modelo de venda que funciona de verdade.

Mas pergunto direto: cliente que assistiu Live ontem mas tava no trabalho e não comprou na hora — hoje ela volta no Insta, vê o produto, e tem que mandar DM. 30 mensagens cruzadas. Quantas dessas tu acha que desistem antes de fechar?`,
    followup_d3: `Oi, voltei. Pensando no teu caso: a Live é o motor de vendas, isso não muda. Mas Shopify pega EXATAMENTE a fila pós-Live — cliente que viu produto, clica, paga em 12x, motoboy de Taquaralto entrega. Modelo: "A Live vende, o Shopify fecha". Topa ver caso real?`,
    followup_d7: `Oi, última mensagem. Live + motoboy + Taquaralto é sistema que funciona de verdade. Falta só o checkout que captura quem viu Live mas não comprou na hora. Se em algum momento isso bater, tu sabe onde me achar.`,
    pre_engajamento_ig: 'D-1 OBRIGATÓRIO: seguir, curtir 2 posts (priorizar foto de produto da Live OU cliente real usando peça, NÃO foto pessoal). Comentar 1 com algo específico ("essa flare premium com micro canelado tem caimento incrível mesmo" ou referência à peça). Loja varejo valoriza comentário sobre produto.',
    razao_ranking: 'TIER S (score 9). MAIOR CLUSTER CLONE-GB do batch #9 (Moda Fitness + Lives + Motoboy). Pitch dedicado "Live vende, Shopify fecha" — diferencial único. 20.1k seg + Lives semanais = volume de demanda alto sem captura. Pitch "complexo" R$899-999.',
  },

  1144: {
    tier: 'A',
    posicao_no_tier: 39,
    dor: 'DeLótus Moda Fitness é loja de varejo Palmas com NICHO ESPECÍFICO RARÍSSIMO: moda fitness pra mulheres reais (numeração 34 ao 60). Endereço Q.307 Sul Rua 5, 468. Maps 5.0/46 reviews. 4.866 seguidores Insta. CEO visível: @deisedadelotus (dona-marca, decisão direta). Envio nacional declarado. Site atual: bio.site/delotus (genérico — mesmo padrão amador, sem filtro por tamanho, sem destaque pro nicho 34-60). NICHO 34-60 é OURO (mulher 44-60 quase nunca encontra moda fitness premium na cidade dela), MAS o canal não comunica isso — bio.site mostra só links genéricos, sem destaque pra inclusão dimensional.',
    gancho: 'PITCH NICHO-ESPECÍFICO: Shopify com filtro de tamanho 34-60 explícito como categoria de primeira página + galeria de mulheres reais (NÃO modelos magras) + FAQ de medida + marca curada. Hoje a maior queixa da mulher 44+ é "tamanho não tem". A LP/Shopify da DeLótus pode ser a ÚNICA do Tocantins que abre com "Aqui tem do 34 ao 60, sem você precisar perguntar". Case-clone duplo: GB Nutrition (envio + marca + dona visível) + criativosdoceu (nicho específico + dona-marca pessoa pública).',
    objecao: '"Já tenho bio.site, cliente acha tudo lá" — defesa da solução amadora atual.',
    resposta_objecao: 'Faz sentido — bio.site centraliza link, e funciona como diretório. Mas pensa pelo lado da mulher 48 que viu uma calça tua num post compartilhado por amiga. Ela vai pesquisar "DeLótus moda fitness Palmas tamanho 48" antes de mandar DM (medo histórico de "tamanho não tem"). Cai no bio.site, vê 5 links sem destaque pro tamanho dela, sem confirmação que tem 48. Recua. Shopify dedicado: ela entra, filtra direto por "tamanho 48", vê 30 peças disponíveis, paga. Mesma cliente, conversão diferente. E o filtro de tamanho não é "feature escondida" — é a CATEGORIA principal da loja. Topa ver?',
    nota_interna: 'NICHO 34-60 é DIFERENCIAL ENORME — diferenciação rara em Palmas. CEO visível @deisedadelotus = decisão direta. Telefone (63)99218-3631 confirmado Maps. Pre-engajamento Insta D-1 obrigatório (curtir 2 posts de cliente real, NÃO modelo magra — DeLótus valoriza inclusão). Comentar 1 sobre acessibilidade dimensional. Pitch "complexo" R$899-1.197 (filtro tamanho como categoria + galeria mulheres reais + FAQ medida).',
    abertura: `Oi Deise, beleza? Eduardo aqui, Impulso Digital, sou de Palmas.

Tô olhando marcas de moda fitness com diferencial real em Palmas e o teu chamou atenção forte — DeLótus é única na cidade que assume "do 34 ao 60". Mulher real, sem padrão Shein.

Mas vi teu bio.site: a maior queixa dela é "tamanho não tem". Quando ela vai pesquisar "DeLótus tamanho 48" antes de mandar DM, cai num bio.site sem filtro por tamanho, sem confirmação que tem.

Quanto dessa cliente 44+ tu acha que recua nesse momento da incerteza?`,
    followup_d3: `Oi Deise, voltei. Pensando: tua proposta de "do 34 ao 60" é diferencial ÚNICO em Palmas. Mas precisa ser a CATEGORIA principal da loja, não filtro escondido. Shopify dedicado: cliente filtra por tamanho, vê peças disponíveis, paga em 12x. Topa ver como ficaria?`,
    followup_d7: `Oi Deise, última mensagem. "Mulher real do 34 ao 60" é posicionamento que merece vitrine adequada. Se em algum momento isso bater, tu sabe onde me achar.`,
    pre_engajamento_ig: 'D-1: seguir, curtir 2 posts de cliente real (priorizar mulher 44+ usando peça em ambiente real, NÃO modelo magra). Comentar 1 sobre inclusão dimensional ("nicho 34-60 é capital social que muita marca esquece — bom ver com esse rigor"). Marca de inclusão valoriza comentário sobre o que ela representa.',
    razao_ranking: 'TIER S (score 9). NICHO 34-60 = diferenciação rara. CEO visível + envio nacional + Maps 5★. Pitch nicho-específico (filtro tamanho como categoria principal). Pitch "complexo" R$899-1.197.',
  },

  1146: {
    tier: 'A',
    posicao_no_tier: 40,
    dor: 'Sousa Fitness é loja de equipamentos esportivos em Palmas com TICKET ALTÍSSIMO (R$200-2.500 por equipamento — kettlebell, banco musculação, halteres, ergometria, esteiras, equipamentos Pilates/Yoga/Boxe/Muay Thai/Crossfit) + assistência técnica. Endereço 1503 sul Alameda 23, 02. Maps 5.0/39 reviews. 504 posts Insta + 3.264 seguidores. Site atual: abre.ai/hdl7 (canal amador — basicamente Linktr.ee renomeado). PROBLEMA CRÍTICO: ticket alto SEM checkout estruturado = gargalo MASSIVO de venda. Cliente que vai gastar R$1.500 num banco musculação precisa ver: ficha técnica completa, dimensões, peso, garantia, foto multi-ângulo, frete real calculado, parcelamento. abre.ai não entrega NADA disso.',
    gancho: 'PITCH TICKET ALTO: Shopify com ficha técnica visual de cada equipamento (especificações, peso, dimensões), galeria multi-ângulo, cálculo de frete automático (peso/volume importam pra equipamento), parcelamento 12x sem juros. Adicionar "ASSISTÊNCIA TÉCNICA AUTORIZADA" como prova social — diferencial que NENHUMA loja online de equipamento entrega. Case-clone duplo: GB Nutrition (loja Palmas + envio) + Mobiliare Móveis (ticket alto físico + galeria editorial).',
    objecao: '"Equipamento o cliente precisa ver antes, conversar, pegar entrega presencial" — defesa do modelo consultivo presencial.',
    resposta_objecao: 'Total razão — equipamento de R$1.500 cliente quer ver antes. Mas pensa: cliente novo que pesquisa "banco musculação Palmas" hoje cai no abre.ai teu, vê 5 links sem ficha técnica, sem dimensões, sem peso, sem garantia. Não dá pra ele decidir QUAL banco ele quer ANTES de te ligar. 80% nem chega a entrar em contato. Shopify resolve isso: ele entra, vê 12 modelos de banco com ficha técnica completa, dimensões, peso, garantia, foto multi-ângulo. Decide qual ele quer. Aí sim te liga pra confirmar entrega presencial. Mesma venda consultiva, cliente chega 80% pré-aquecida em vez de 0%. E "Assistência Movement e Matrix" vira destaque na home — diferencial QUE NENHUMA loja online de equipamento tem. Topa ver?',
    nota_interna: 'TICKET ALTÍSSIMO (R$200-2.500 por equipamento) = ROI Shopify rapidíssimo. 1 venda de R$1.500 paga 2.5x a LP. Telefone (63)99114-5676 confirmado. Pre-engajamento Insta D-1 obrigatório (curtir 2 posts de equipamento finalizado em ambiente real, NÃO foto promocional). Comentar 1 sobre especificação técnica. Pitch "complexo" R$899-1.197 (catálogo técnico + cálculo frete por peso/volume + integração assistência).',
    abertura: `Oi, beleza? Eduardo aqui, Impulso Digital, sou de Palmas.

Tô olhando lojas de equipamento esportivo em Palmas e o teu perfil chamou atenção forte — assistência autorizada Movement e Matrix + 504 posts + 5★/39 Maps + ticket alto (R$200-2.500). Operação consolidada.

Mas vi teu link da bio (abre.ai). Cliente que vai gastar R$1.500 num banco musculação pesquisa MUITO antes — quer ver ficha técnica, dimensões, peso, garantia, foto multi-ângulo. Cai no abre.ai e vê 5 links sem nada disso.

Quanto desse cliente tu acha que recua nesse momento, antes mesmo de te ligar?`,
    followup_d3: `Oi, voltei. Pensando: ticket de equipamento (R$1.500-2.500) exige confiança visual antes do contato. Shopify resolve: ficha técnica completa + dimensões + peso + garantia + foto multi-ângulo + frete calculado. Cliente chega 80% pré-aquecida pra contato presencial. E "Assistência autorizada" vira destaque — diferencial ÚNICO. Topa ver caso?`,
    followup_d7: `Oi, última mensagem. Equipamento esportivo é nicho de ticket alto que poucas lojas de Palmas atacam direito online. Se em algum momento bater, tu sabe onde me achar.`,
    pre_engajamento_ig: 'D-1: seguir, curtir 2 posts (priorizar equipamento em ambiente real OU cliente final usando, NÃO foto promocional pura). Comentar 1 com algo técnico ("essa kettlebell com revestimento de borracha tá em alta — boa escolha pro estoque"). Loja técnica valoriza pre-engajamento técnico.',
    razao_ranking: 'TIER S (score 9). TICKET ALTÍSSIMO (R$200-2.500) = ROI Shopify rapidíssimo. 1 venda de R$1.500 paga 2.5x LP. abre.ai = sinal de compra. Assistência autorizada = diferencial pra prova social. Pitch "complexo" R$899-1.197.',
  },

  // ── TIER A (CIC #10 — 26/04 cluster CLONE-GABRIEL faceta LP fitness) — 5 leads ──
  // Persona-mãe LP: Gabriel Barros (@gabribarros10) faceta personal/coach
  // (NÃO a loja GB). Vetor /following/ do case ATIVO Impulso descobriu
  // 6 personal trainers/nutri solo qualificados em 35 min — método-ouro
  // de prospecção. CREF GO-TO funciona como filtro geo automático.
  // Concorrência rival local mapeada: @agenciaprintdesign (atende
  // @brunocosta.treinador) — possível parceria white-label, não competição.

  1150: {
    tier: 'A',
    posicao_no_tier: 41,
    dor: 'Gabriel Santiago é Personal Trainer + Coach com nicho específico CrossFit + Atleta Híbrido em Palmas-TO. CREF 2094-GO/TO confirmado. 1.433 POSTS Insta em 3.905 seguidores (engagement altíssimo, raro de ver) — significa que ele entrega conteúdo CONSISTENTE há anos sem retorno proporcional em conversão de aluno. ZERO link externo, só Threads. Bio: "Coach CrossFit & Atleta Híbrido | Bacharel Educação Física | CREF 2094-GO/TO | Performance • Força • Resistência". 1.433 posts sem LP de captura = pelo menos 100 alunos perdidos ao longo do tempo por não ter onde mandar quem quer contratar.',
    gancho: 'CASE-CLONE QUASE PERFEITO do Gabriel Barros (case ATIVO Impulso) com nicho COMPLEMENTAR (CrossFit vs Bodybuilding clássico). Pitch: "Gabriel, vi que tu segue meu cliente Gabriel Barros (GB Nutrition) — vocês têm posicionamento similar mas em nichos complementares. Ele construiu LP profissional + loja Shopify, parou de perder aluno na falta de funil. Tu tem 1.433 posts sem onde mandar quem quer contratar — é como vender ingresso sem ter bilheteria. LP CrossFit Performance: formulário objetivo (ganho massa / atleta híbrido / preparação prova) + agendamento avaliação física + planos mensal/trimestral + depoimentos transformação. Posiciona como CrossFit Specialist Palmas (nicho não coberto pelo @gabribarros10)."',
    objecao: '"Já vendo aluno pelo Insta, tá funcionando" — operação ativa defendendo o que funciona.',
    resposta_objecao: 'Concordo — 3.9k seg + 1.433 posts mostra que tu construiu autoridade real. Mas pensa: cada post teu chega em 500-1000 pessoas. Quantas dessas tu acha que pensam "tô interessado, mas onde mando mensagem?" e depois esquecem? Sem LP, o aluno potencial perde ti por inércia (não mandou DM no momento certo). LP não substitui Insta — captura quem viu post, ficou interessado e teria perdido na fricção do "vou mandar DM depois". Mesmo aluno, conversão diferente. E olha — vi que tu segue o Gabriel (GB Nutrition). Ele é meu cliente. Topa eu te mostrar o que mudou na operação dele quando montei a LP?',
    nota_interna: 'CASE-CLONE QUASE PERFEITO Gabriel Barros (faceta personal). MENCIONAR Gabriel na 1ª mensagem é vetor direto — eles se seguem. ANTES DE DISPARAR, falar com o Gabriel pra: (1) pedir permissão usar nome dele, (2) checar se conhecem pessoalmente (provável — networking fitness Palmas é fluido), (3) possível indicação direta. CREF 2094-GO/TO confirmado na bio. Pegar telefone via DM Insta antes. Pitch padrão R$499 ou complexo R$799-999 (formulário multi-step + área aluno online).',
    abertura: `Oi Gabriel, beleza? Eduardo aqui, Impulso Digital, sou de Palmas.

Vi que tu segue o Gabriel Barros (@gbnutritionn, GB Nutrition) — ele é meu cliente. Tô olhando personal trainers consolidados de Palmas e o teu perfil chamou atenção MUITO forte: 1.433 posts em 3.9k seguidores é engagement raro de ver + CREF GO-TO + nicho CrossFit/Atleta Híbrido (complementar ao bodybuilding do Gabriel-mãe).

Mas vi tua bio: zero link externo. 1.433 posts sem LP de captura — cada post chega em 500-1000 pessoas, e quantas dessas pensam "tô interessada" e somem na fricção de mandar DM?

Topa eu te mostrar o que mudou na operação do Gabriel quando ele montou a LP?`,
    followup_d3: `Oi Gabriel, voltei. Pensando: tu tem 1.433 posts (3 anos de conteúdo consistente!) sem captura. Estimativa conservadora: 100 alunos perdidos por ano em quem viu conteúdo + interessou + esqueceu de mandar DM. LP CrossFit Performance pega exatamente esse momento: visitante chega, vê biografia + CREF + método + planos, agenda avaliação. Topa ver caso real?`,
    followup_d7: `Oi Gabriel, última mensagem da minha parte. Sei que rotina de personal solo + atleta competidor é puxada (vi os Arnold). Vou parar. Só registro: tua autoridade técnica + 1.433 posts é capital social que merece infraestrutura de captura. Tu sabe onde me achar.`,
    pre_engajamento_ig: 'D-1 OBRIGATÓRIO: seguir, curtir 2 posts técnicos (priorizar conteúdo CrossFit ou Atleta Híbrido — NÃO foto pessoal). Comentar 1 com algo específico ("a abordagem de atleta híbrido com força + resistência é raro de ver com esse rigor"). Personal trainer técnico valoriza pre-engajamento técnico, não emoji.',
    razao_ranking: 'TIER S (score 10!) — RECORD do batch #10. CASE-CLONE Gabriel Barros + nicho complementar (CrossFit vs Bodybuilding) + 1.433 posts + ZERO web + CREF GO-TO. Pitch ESPELHO direto via Gabriel-mãe (eles se seguem — networking fitness Palmas). Pitch padrão R$499 ou complexo R$799-999 com formulário qualificador.',
  },

  1149: {
    tier: 'A',
    posicao_no_tier: 42,
    dor: 'Dafne Sixel é nutricionista funcional vinculada à Integral Clinic Palmas-TO (Q.104 Sul Av LO 1, N.10 - Plano Diretor Sul - clínica 4.8/731 reviews validada via Google Knowledge Panel). 4.805 seguidores Insta + 1.143 POSTS (consistência editorial MONUMENTAL — uma das maiores produções de conteúdo nutri em Palmas). Bio: "Flexibilidade metabólica, saúde intestinal e autonomia. Nutrição centrada em você – não em protocolos!". Site atual: msha.ke/dafneqnutri (ferramenta amador BR). 1.143 posts publicados + ALTA DEMANDA REPRIMIDA + canal de captura amador = receita massiva escapando. Atendimento online declarado.',
    gancho: 'PITCH UPGRADE pra LP nutri funcional co-branded com Integral Clinic. Estrutura: biografia + CRN em destaque + vínculo Integral Clinic (autoridade médica gigantesca — 731 reviews 4.8★) + 4 áreas (flexibilidade metabólica, saúde intestinal, autonomia, paciente "centrada em você") + formulário avaliação metabólica (objetivos / restrições alimentares / histórico) + escolha pacote (3/6/12 meses) + biblioteca de receitas exclusiva pra alunos + integração Calendly/WhatsApp Business + 3 artigos SEO ("dieta flexível", "saúde intestinal", "nutrição funcional Palmas"). Mantém msha.ke como redirect, LP vira destino oficial.',
    objecao: '"Tenho msha.ke + Integral Clinic, paciente acha" — defesa do operacional atual.',
    resposta_objecao: 'Faz total sentido — Integral Clinic com 731 reviews 4.8★ é canal de chegada principal pra paciente local. Mas pensa: paciente NOVO que viu teu post sobre flexibilidade metabólica, vai pesquisar "Dafne Sixel nutri Palmas" antes de marcar consulta. Cai no msha.ke, vê 5 links sem hierarquia, sem teu rosto profissional em destaque, sem vínculo Integral Clinic explícito, sem áreas de expertise estruturadas. 60% recua nesse momento. LP profissional pega exatamente isso: ela chega e vê biografia + CRN + INTEGRAL CLINIC em destaque (autoridade triplicada) + áreas + FAQ. Mesma paciente, conversão diferente. Topa ver?',
    nota_interna: 'AUTORIDADE GIGANTESCA via Integral Clinic (731 reviews 4.8★) — usar como ÂNCORA pesada na LP. Telefone NÃO veio direto (msha.ke) — abrir, capturar. CRN não validado no scrape — VALIDAR. Pre-engajamento OBRIGATÓRIO (curtir 2 posts técnicos sobre flexibilidade metabólica OU saúde intestinal — nutri funcional valoriza pre-engajamento técnico). Pitch "complexo" R$899-1.197 (4 áreas + biblioteca receitas + integração Calendly + co-branding Integral Clinic).',
    abertura: `Oi Dafne, beleza? Eduardo aqui, Impulso Digital, sou de Palmas.

Tô olhando nutricionistas funcionais autônomas em Palmas e o teu perfil chamou atenção MUITO forte — 1.143 posts (uma das maiores produções de conteúdo nutri em Palmas) + vinculação à Integral Clinic (731 reviews 4.8★ — autoridade médica gigantesca).

Mas vi teu link da bio (msha.ke). Paciente nova que viu post sobre flexibilidade metabólica e vai pesquisar antes de marcar — cai num link sem teu rosto, sem CRN, sem Integral Clinic em destaque, sem áreas estruturadas.

Quanto dessa paciente nova tu acha que recua nesse momento da pesquisa?`,
    followup_d3: `Oi Dafne, voltei. Pensando: 1.143 posts é consistência editorial monumental — capital de conteúdo que MUITO nutri funcional do Brasil leva 5 anos pra construir. Mas o canal de captura é amador. LP profissional co-branded com Integral Clinic + biblioteca de receitas exclusiva alunos + formulário avaliação metabólica = vira destino oficial. Topa ver?`,
    followup_d7: `Oi Dafne, última mensagem. Vínculo Integral Clinic + 1.143 posts é capital social raro. Falta só vitrine adequada. Se em algum momento bater como prioridade, tu sabe onde me achar.`,
    pre_engajamento_ig: 'D-1: seguir, curtir 2 posts técnicos (priorizar flexibilidade metabólica, saúde intestinal, dieta carnívora — temas técnicos dela). Comentar 1 com algo específico ("a abordagem de flexibilidade metabólica sem rigidez de protocolo é raro de ver mesmo"). Nutri funcional valoriza pre-engajamento técnico.',
    razao_ranking: 'TIER S (score 9.5). Vinculação Integral Clinic = autoridade gigantesca. 1.143 posts = consistência editorial monumental. msha.ke = sinal de compra. Pitch "complexo" R$899-1.197 (co-branding clínica + 4 áreas + biblioteca receitas + Calendly).',
  },

  1151: {
    tier: 'A',
    posicao_no_tier: 43,
    dor: 'Júnior Sá é Personal Coach com Insta VERIFICADO (raríssimo em personal trainer Palmas — sinal de operação consolidada). Bio: "Coach | Resultados que refletem em toda a sua vida! Avaliação Diagnóstica Clínica/Funcional | Espec. em Medicina do Exercício". 3.934 seg + 302 posts. Site atual: eksy.me/treinadorjrsa (ferramenta amador BR). Destaques: Fat Burn, Emagrecimento, Hipertrofia, Mind Set, Longevidade. Network direta: seguido por @gbnutritionn + @gabribarros10. Diferencial: "MEDICINA DO EXERCÍCIO" como especialização = nicho mais clínico, ticket potencialmente maior que personal padrão. Tem clientes online (eksy.me sugere) mas usa ferramenta amadora — falta LP médica de avaliação funcional com formulário qualificador.',
    gancho: 'LP MÉDICA Júnior Sá — biografia + Medicina do Exercício em destaque + formulário ANAMNESE pré-consulta (objetivos / restrições / disponibilidade / patologias prévias) + agendamento online + depoimentos especificamente de longevidade (área de destaque dele) + integração WhatsApp Business + área de membros pra alunos online. Posicionar como UM dos poucos coaches com Medicina do Exercício em Palmas — autoridade específica que personal padrão não tem.',
    objecao: '"Tenho eksy.me, alunos chegam, tá funcionando" — defesa da solução amadora atual.',
    resposta_objecao: 'Faz sentido — eksy.me cumpre o básico de redirecionar pro WhatsApp. Mas pensa: tu tem Insta verified (raríssimo em personal Palmas) + Medicina do Exercício (autoridade clínica). Aluno potencial que vê teu post, vai pesquisar antes de marcar — cai no eksy.me e vê só "AGENDAR" sem biografia, sem explicação do método, sem distinção do "Coach padrão" pro "Coach com Medicina do Exercício". Recua. LP médica pega esse momento: ele chega e vê biografia + especialização clínica + Avaliação Diagnóstica explicada + formulário anamnese. Mesmo aluno, conversão diferente. E vi que tu segue/é seguido pelo Gabriel (GB Nutrition) — ele é meu cliente. Topa ver caso?',
    nota_interna: 'INSTA VERIFICADO em personal Palmas é RARÍSSIMO — autoridade extra. Pegar telefone via eksy.me. Network direta com Gabriel-mãe = vetor de mensão. Pre-engajamento Insta D-1 obrigatório (curtir 2 posts técnicos longevidade ou avaliação funcional). Pitch padrão R$499 ou complexo R$799-999 (formulário anamnese + área membros + integração).',
    abertura: `Oi Júnior, beleza? Eduardo aqui, Impulso Digital, sou de Palmas.

Tô olhando personal trainers consolidados de Palmas e o teu perfil chamou atenção MUITO forte — Insta verified (raríssimo em personal aqui) + "Medicina do Exercício" como especialização + 302 posts. Operação séria.

Mas vi teu link (eksy.me). Aluno potencial que viu post sobre longevidade vai pesquisar antes de marcar — cai num link sem biografia, sem especialização clínica em destaque, sem formulário anamnese.

Quanto dele tu acha que recua nesse momento? E olha: vi que o Gabriel Barros (@gbnutritionn) te segue — ele é meu cliente.`,
    followup_d3: `Oi Júnior, voltei. Pensando: "Medicina do Exercício" + verified Insta = combinação rara em Palmas. Aluno premium (que paga R$500+/mês) pesquisa MUITO antes de fechar — quer ver biografia clínica, método, FAQ específico. eksy.me não entrega isso. LP médica pega exatamente esse momento. Topa ver?`,
    followup_d7: `Oi Júnior, última mensagem. Verified + Medicina do Exercício é capital social raro. Se em algum momento bater como prioridade, tu sabe onde me achar.`,
    pre_engajamento_ig: 'D-1: seguir, curtir 2 posts técnicos (priorizar longevidade ou avaliação diagnóstica, NÃO foto pessoal). NÃO comentar (verified recebe muito comentário genérico). Pre-warming via consumo do conteúdo.',
    razao_ranking: 'TIER S (score 9). VERIFIED Insta = autoridade extra. Medicina do Exercício = nicho clínico premium. eksy.me = sinal de compra. Network Gabriel-mãe direta. Pitch padrão R$499 ou complexo R$799-999.',
  },

  1152: {
    tier: 'A',
    posicao_no_tier: 44,
    dor: 'José Wilker é Personal Trainer com tese forte de COMUNIDADE: "+200 alunos transformados | teamJW". Bio: "Saúde e perfomance. Casado @gabriellasoza. Clica e faça parte do teamJW". CREF14/GO-TO Palmas confirmado via Google. 2.048 seg + 87 posts. Site atual: clique.ink/0xuta1 (amador BR). Network dupla GB+Gabriel. Diferencial vs Gabriel-mãe: ele vende COMUNIDADE/MOVIMENTO ("teamJW"), enquanto Gabriel-mãe vende método individual. Conceito "team" tem POTENCIAL DE MEMBERSHIP RECORRENTE — mas hoje tá jogado fora porque clique.ink não tem área de membros, tabela de planos, ranking de alunos.',
    gancho: 'LP TEAMJW MEMBERSHIP AREA — pivotar a tese "team" em produto recorrente real. Estrutura: biografia + +200 alunos transformados + área de membros (treinos progressivos + chat exclusivo + nutricionista parceira opcional + ranking de alunos com transformações) + assinatura mensal R$199-299/mês (premium pelo módulo membership) + planos trimestral/anual com desconto. Posicionar não como "personal solo" mas como "comunidade fitness com método" — alteração radical de produto que justifica ticket recorrente alto.',
    objecao: '"Tô conseguindo alunos pelo Insta, +200 transformados, tá funcionando" — defesa do operacional atual + autoridade construída.',
    resposta_objecao: 'Concordo — +200 alunos é número que poucos personal palmenses tem. Mas pensa: tu posiciona "teamJW" como comunidade, mas hoje teamJW é só HASHTAG. Não tem área onde aluno antigo conversa com aluno novo, não tem ranking de transformações pra inspirar quem entrou ontem, não tem treinos progressivos por nível. teamJW é tese sem produto. LP membership area transforma a tese em produto recorrente: aluno paga R$199-299/mês e tem comunidade + treinos + chat + ranking. Tu para de vender hora de personal e vende ASSINATURA. R$200/mês x 50 alunos = R$10k recorrente, sem precisar de novo aluno todo mês. Topa ver?',
    nota_interna: 'PITCH MEMBERSHIP RECORRENTE — diferente do pitch padrão personal solo. R$499 setup + R$199-299/mês justifica pelo módulo membership area. Network dupla com Gabriel-mãe = vetor de menção. Pegar telefone via clique.ink. Pre-engajamento Insta D-1 obrigatório.',
    abertura: `Oi José, beleza? Eduardo aqui, Impulso Digital, sou de Palmas.

Tô olhando personal trainers consolidados em Palmas e o teu perfil chamou atenção forte — +200 alunos transformados + posicionamento "teamJW" + CREF GO-TO. Tu construiu marca pessoal de verdade.

Mas pergunto direto: tu posiciona "teamJW" como comunidade, mas hoje é só hashtag. Não tem área onde aluno antigo conversa com novo, não tem ranking de transformações, não tem treinos progressivos por nível. teamJW tá hoje no clique.ink — tese sem produto.

Topa virar teamJW em produto recorrente real (assinatura R$199-299/mês com membership area)?`,
    followup_d3: `Oi José, voltei. Pensando: "team" é a maior tese tua, mas hoje só vive como hashtag. LP membership area transforma em produto: 50 alunos x R$199/mês = R$10k recorrente sem precisar de novo aluno todo mês. Tu para de vender hora, vende assinatura. Caso real disso?`,
    followup_d7: `Oi José, última mensagem. teamJW + 200 alunos transformados = base perfeita pra membership area. Se em algum momento bater como prioridade, tu sabe onde me achar.`,
    pre_engajamento_ig: 'D-1: seguir, curtir 2 posts (priorizar transformação de aluno OU conteúdo team — NÃO foto pessoal). Comentar 1 com algo específico ("a tese teamJW como comunidade é diferenciada — vejo poucos personal pensando em assinatura recorrente"). Personal valoriza pre-engajamento estratégico.',
    razao_ranking: 'TIER S (score 8). PITCH ESPECIAL membership area — diferente do pitch padrão personal solo. teamJW = tese forte que pode virar produto recorrente. R$499 setup + R$199-299/mês = ROI premium. CREF GO-TO + network Gabriel-mãe.',
  },

  1153: {
    tier: 'A',
    posicao_no_tier: 45,
    dor: 'Rodolpho Margonari é Personal Trainer entry-level: 925 seguidores (abaixo do sweet spot LP), 101 posts, CREF 002143-G/TO confirmado. Bio: "Instrutor de fitness | Te ajudo a chegar na sua melhor versão | Personal Trainer | Casado @mmargonari Palmas-To". ZERO link externo. Network tripla GB+Gabriel+Letícia. Volume baixo MAS qualidade maturidade compensa: bio explícita Palmas-TO + CREF + zero web = pacote "Tier A alto potencial" especialmente porque ticket de upsell é fácil (vai de R$300 pra R$500/mês com LP profissional).',
    gancho: 'LP ENTRY-LEVEL Rodolpho — pacote essencial R$499 setup + R$79-99/mês (tier econômico pela faixa <1k seg). Foco em formulário simples + agendamento + 5 depoimentos + biografia + CREF em destaque. Conforme ele cresce em seg, upgrade pra plano completo. Pitch: "comece a captura agora, antes de chegar em 3k seg — depois é só ampliar".',
    objecao: '"Não tenho volume Insta ainda, vou esperar crescer" — defesa do estágio atual.',
    resposta_objecao: 'Justamente porque tu tá começando, LP faz mais sentido AGORA — não depois. Personal com 5k seg que monta LP só captura quem JÁ segue. Tu, que tá com 925 e crescendo, monta LP agora e cada novo seguidor já cai num funil de captura — em vez de só ver post + esquecer. Em 6 meses, quando tu tiver 3k seg, já tá com 50-80 alunos capturados pela LP. Caso de personal que começou exatamente assim aqui em Palmas — quer ver?',
    nota_interna: 'TIER A entry-level. Pitch ECONÔMICO (R$79-99/mês manutenção). Network tripla com Gabriel-mãe = vetor de menção. Pegar telefone via DM Insta. CREF confirmado bio. Pre-engajamento Insta D-1 obrigatório.',
    abertura: `Oi Rodolpho, beleza? Eduardo aqui, Impulso Digital, sou de Palmas.

Tô olhando personal trainers em Palmas e o teu perfil chamou atenção — CREF GO-TO + bio explícita Palmas + posicionamento técnico ("melhor versão"). Tu tá construindo o perfil certo.

Mas vi tua bio: zero link externo. Tu tá começando a crescer no Insta — esse é EXATAMENTE o momento de montar LP de captura. Não depois quando tiver 5k.

Pergunto: cada novo seguidor teu hoje vê post + esquece, ou cai num funil que captura?`,
    followup_d3: `Oi Rodolpho, voltei. Pensando: tu tá num momento ÚNICO — Insta crescendo + CREF + posicionamento. LP montada agora captura cada novo seguidor desde o zero. Em 6 meses, quando tu tiver 3k seg, já tá com 50-80 alunos capturados pela LP. Versus quem só monta DEPOIS de crescer e captura zero. Topa ver caso?`,
    followup_d7: `Oi Rodolpho, última mensagem. Personal trainer crescendo precisa de funil ANTES de virar reclamação "estou perdendo aluno". Se em algum momento bater, tu sabe onde me achar.`,
    pre_engajamento_ig: 'D-1: seguir, curtir 2 posts (priorizar transformação OU método, não foto pessoal). Comentar 1 com algo do tipo "ver personal Palmas com CREF GO-TO consistente é raro mesmo" ou referência ao método.',
    razao_ranking: 'TIER A (score 7.5). Entry-level com alto potencial de upgrade. Pitch econômico R$499 + R$79-99/mês. CREF GO-TO + network Gabriel-mãe. Aluno em fase de construção é momento ÚNICO de montar funil.',
  },

  // ── TIER A (CIC #11 — 26/04 ed. física via Google IA Overview CREF) — 2 leads ──
  // Round usou método NOVO descoberto: Google IA Overview com query
  // "CREF GO-TO" entregou 7 personal trainers pré-validados em 1 query.
  // Mais eficiente que /following/. Atila Santos = SÓSIA PERFEITO Gabriel.

  1155: {
    tier: 'A',
    posicao_no_tier: 46,
    dor: 'Átila Santos é SÓSIA PERFEITO do Gabriel Barros (case-mãe ATIVO Impulso): Atleta Fisiculturista + Personal Trainer + Consultoria Online + Palmas-TO + CREF G/TO 0001962. 5.840 seguidores Insta + 354 posts. Bio com mesma estrutura do Gabriel ("Atleta + Personal + Consultoria Online"). DESTAQUE Insta "Relatos Online" = depoimentos de consultoria JÁ PRONTOS pra virar prova social na LP. Site atual: wa.me/5563984451564 direto (ZERO LP — sinal de compra puríssimo). 354 posts + 5.8k seg + Relatos Online cheio = DEMANDA COMPROVADA + zero infraestrutura de captura. Diferença vs Gabriel: nicho COMPLEMENTAR (Gabriel vende método/transformação corporal; Átila vende performance fisiculturismo/preparação palco), mercados não-competitivos.',
    gancho: 'PITCH ESPELHO direto via Gabriel-mãe: "Átila, vi que tu segue o Gabriel Barros (@gbnutritionn) — ele é meu cliente. Tu é o ÚNICO sósia perfeito dele que mapeei em Palmas: mesma estrutura de bio, mesmo nicho atleta-personal, mesmo modelo consultoria online. Diferença é que ele tem LP profissional captando aluno fora do horário, e tu tá com 354 posts + Relatos Online cheio caindo num wa.me direto." Pitch tem 2 alavancas:  (1) PROVA SOCIAL READY-TO-USE — "Relatos Online" vira galeria scrollable de transformações na LP, não precisa criar conteúdo novo; (2) NICHO COMPETIÇÃO/PALCO = ticket premium (R$300-800/mês) — LP com formulário "qual seu objetivo" (definição/hipertrofia/preparação palco) + checkout 3 planos + área de membros com vídeos posados/dieta/periodização.',
    objecao: '"Eu já vendo direto pelo wa.me, alunos chegam por indicação" — operação ativa defendendo o que funciona.',
    resposta_objecao: 'Concordo — 354 posts + 5.8k seg + Relatos Online cheio mostra que tu construiu autoridade e indicação real. Mas pensa: cada post teu de competição chega em 1.000-2.000 pessoas. Quantas dessas pensam "tô interessada nessa preparação de palco" e somem na fricção do "vou mandar mensagem depois"? Sem LP, esse aluno potencial perde ti por inércia — ele esqueceu de mandar DM no momento certo. LP não substitui Insta — captura quem viu post e teria perdido. E olha — vi que tu tem destaque "Relatos Online" cheio: isso vira galeria scrollable na LP em 1 dia de produção. Tu já tem o conteúdo, falta só a infraestrutura. Topa eu te mostrar o que mudou pro Gabriel quando ele montou a LP?',
    nota_interna: 'SÓSIA PERFEITO do Gabriel — case-mãe ATIVO Impulso. ANTES DE DISPARAR: falar com Gabriel pra (1) pedir permissão usar nome dele, (2) checar se eles se conhecem pessoalmente (provável — networking fitness Palmas é fluido), (3) possível indicação direta. Telefone (63)98445-1564 confirmado wa.me. CREF G/TO 0001962 confirmado bio. Pre-engajamento Insta D-1 OBRIGATÓRIO (curtir 2 posts de competição/palco — NÃO foto pessoal genérica). Pitch "complexo" provável (R$799-999) — Plano LP Consultoria com área de membros + checkout 3 planos + galeria Relatos Online scrollable.',
    abertura: `Oi Átila, beleza? Eduardo aqui, Impulso Digital, sou de Palmas.

Vi que tu segue o Gabriel Barros (@gbnutritionn) — ele é meu cliente. Tô olhando atletas-personal autônomos em Palmas e o teu perfil chamou atenção MUITO forte: tu é o ÚNICO sósia perfeito do Gabriel que mapeei aqui. Mesma estrutura — Atleta + Personal + Consultoria Online + CREF G/TO + faixa 5k seg.

Mas vi que teu link da bio é wa.me direto. 354 posts + destaque "Relatos Online" cheio — tu já tem prova social pronta, falta só a infraestrutura de captura.

Topa eu te mostrar o que mudou na operação do Gabriel quando ele montou a LP?`,
    followup_d3: `Oi Átila, voltei. Pensando: tu tem 354 posts (3+ anos de conteúdo consistente!) + Relatos Online já cheio = capital social raríssimo. Mas cada novo aluno potencial precisa caçar tua DM no escuro. LP com formulário "qual teu objetivo" (definição/hipertrofia/preparação palco) + checkout 3 planos + galeria scrollable dos teus Relatos Online = aluno chega informado. Topa ver caso real? E olha, vi que tu segue o Gabriel — vocês se conhecem pessoalmente?`,
    followup_d7: `Oi Átila, última mensagem da minha parte. Sei que rotina de atleta competidor + personal solo é puxada (vi a preparação de palco). Vou parar. Só registro: tu é o ÚNICO sósia perfeito do Gabriel em Palmas — esse posicionamento merece infraestrutura de captura. Tu sabe onde me achar.`,
    pre_engajamento_ig: 'D-1 OBRIGATÓRIO: seguir, curtir 2 posts (priorizar conteúdo de COMPETIÇÃO/PALCO ou Relato Online de aluno transformado — NÃO foto pessoal genérica). Comentar 1 com algo específico técnico ("a periodização pra preparação de palco com volume + cutting é raro de ver com esse rigor mesmo"). Atleta competidor valoriza pre-engajamento técnico.',
    razao_ranking: 'TIER S RECORD (score 10!). SÓSIA PERFEITO do Gabriel (único do banco com essa caracterização). "Relatos Online" cheio = prova social READY-TO-USE. Nicho COMPLEMENTAR (não compete com Gabriel-mãe). Pitch ESPELHO via Gabriel + pedir indicação. Plano LP Consultoria R$799-999 (galeria + área membros + checkout 3 planos).',
  },

  1156: {
    tier: 'A',
    posicao_no_tier: 47,
    dor: 'Adria Mota é Personal Trainer feminina solo Palmas-TO com CREF 002460 GO/TO. Bio EXPLÍCITA "Personal Trainer e Consultoria Online" — match PERFEITO com a direção que Eduardo apontou (sub-persona consultor online recorrente). 1.414 seg + 93 posts. SEGUIDA por @gabribarros10 (network direta Gabriel). PROBLEMA CRÍTICO identificado: link in bio redireciona pra @tebasconceito01 (academia/parceiro) — diluição de marca + ZERO captura própria. Aluno potencial cai no perfil do parceiro, não nela. Ela tem CREF próprio, declarou consultoria online em bio, mas o canal não comunica isso — vai pro parceiro.',
    gancho: 'PITCH ESPECIAL "saída da diluição": "Adria, vi que tu tem CREF próprio + bio declarando Consultoria Online + segue o Gabriel Barros. Mas o link da tua bio redireciona pra @tebasconceito01. O que isso significa pro aluno potencial: ele clica esperando achar TUA página, cai na do parceiro, e Tu perde a captura. LP profissional Adria Mota Consultoria Online resolve isso: domínio próprio + galeria de transformações + formulário triagem (objetivo/restrições/disponibilidade) + checkout planos online + área de membros simples. Tu mantém a parceria com Tebas Conceito (não desliga), mas separa TUA marca."',
    objecao: '"Tô tranquila com o link da Tebas, é parceria, dá certo" — defesa do operacional atual.',
    resposta_objecao: 'Faz sentido — parceria com academia é canal forte, e tu não precisa desligar isso. Mas pensa: tu DECLAROU "Consultoria Online" na tua bio. Aluno potencial que viu teu post e quer fechar consultoria online clica no link, esperando ver TEU método, TEUS planos, TUA galeria de transformações. Cai no perfil do Tebas Conceito (academia presencial). Recua. Ele queria TI, não a academia. LP profissional tua resolve isso sem desligar a parceria: link bio aponta pra adriamota.com.br (ou similar), tu vende consultoria online ali, e a Tebas Conceito continua sendo parceria de espaço físico. Mesma operação, marca separada. Topa ver?',
    nota_interna: 'CASO ÚNICO no banco — lead com bio explícita de consultoria online MAS link diluído em parceiro. Pitch RADICAL é "saída da diluição de marca". CREF 002460 GO/TO confirmado. Telefone NÃO veio direto — pegar via DM Insta. SEGUIDA POR Gabriel = mencionar Gabriel é vetor (eles podem se conhecer — feminino fitness Palmas é nicho menor). Pre-engajamento Insta D-1 obrigatório. Pitch padrão R$499 + R$99/mês ou complexo R$799 + R$199/mês com área de membros se ela topar plano premium.',
    abertura: `Oi Adria, beleza? Eduardo aqui, Impulso Digital, sou de Palmas.

Tô olhando personal trainers consolidados em Palmas e o teu perfil chamou atenção forte — CREF 002460 GO/TO + bio EXPLÍCITA "Personal Trainer e Consultoria Online". Tu já posicionou bem.

Mas vi o link da tua bio: redireciona pra @tebasconceito01. Aluno potencial que viu teu post sobre consultoria online clica esperando TUA página, cai na do parceiro, recua. Ele queria TI, não a academia.

E olha — vi que tu segue o Gabriel Barros (@gbnutritionn). Ele é meu cliente. Vocês se conhecem?`,
    followup_d3: `Oi Adria, voltei. Pensando: tu tem CREF próprio + bio com consultoria online declarada. Mas o canal tá diluído na Tebas. LP profissional adriamota.com.br separa TUA marca sem desligar a parceria — Tebas continua sendo parceira de espaço físico, tu vende consultoria online em domínio próprio. Topa ver caso real?`,
    followup_d7: `Oi Adria, última mensagem da minha parte. Tu tem CREF próprio e merece marca própria. Se em algum momento isso bater como prioridade, tu sabe onde me achar.`,
    pre_engajamento_ig: 'D-1: seguir, curtir 2 posts (priorizar conteúdo de transformação de aluna OU método dela — NÃO foto pessoal). Comentar 1 com algo específico ("ver Personal feminina com CREF GO/TO consistente em Palmas é raro mesmo" ou referência ao método dela).',
    razao_ranking: 'TIER S (score 8). Match PERFEITO direção Eduardo (sub-persona consultor online declarado). Diluição de marca com Tebas Conceito = pitch ÚNICO de "saída da diluição". Network direta Gabriel-mãe. CREF GO/TO confirmado. Pitch padrão R$499 + R$99/mês ou complexo R$799 + R$199/mês.',
  },

  // ── TIER A (CIC #12 — 26/04 médicos especialistas via IA Overview CRM) ──
  // PRIMEIRO BATCH MÉDICO COMPLETO via método-ouro IA Overview.
  // 6 Tier S premium + 5 concorrentes médicos descartados (mapa).
  // SEM CASE-CLONE médico real ainda — usar argumento estrutural +
  // proposta showcase R$200 desconto pra primeiro fechado virar case.

  1157: {
    tier: 'A',
    posicao_no_tier: 48,
    dor: 'Dr. Marcel Freitas é Médico do Esporte CRM-TO 3949 + RQE 3191. 7.085 seguidores Insta + 178 posts + 10 anos de experiência. ATENDE 2 PERFIS DE PACIENTE: (1) atletas/esportistas pra performance e recuperação, (2) procedimento alto-ticket de Transplante Capilar (R$8.000-15.000 por sessão). Site atual: bit.ly/AgendamentosNewLife (URL shortener amador). Destaques estruturados (Pacientes / Perguntas / Transplante Capilar) mostram que ele tem PROGRAMA de atendimento, mas falta funil que canalize/qualifique paciente premium. Cada post chega em milhares mas sem captura — paciente novo de transplante (que vai gastar R$10k+) precisa pesquisar e ver biografia + casos + processo, não cair em bit.ly genérico.',
    gancho: 'PONTE VERTICAL FITNESS — Marcel atende ATLETAS e o GB Nutrition (Gabriel) é nosso case ATIVO em Palmas que vende suplemento pra atletas. Bridge natural: "Dr. Marcel, vi teu trabalho de Médico do Esporte e o Gabriel Barros (@gbnutritionn) é meu cliente — ele atende atletas como tu e a gente trabalhou junto na LP profissional + Shopify dele. Vocês têm overlap de público (atletas Palmas)." LP New Life com formulário triagem (objetivo emagrecimento/performance/transplante capilar/longevidade) + agendamento Calendly + pacotes acompanhamento mensal + área de pacientes com vídeos de orientação + integração WhatsApp Business. Cross-sell: alunos do Júnior Sá / Marcel Freitas como bridge médico-treinador.',
    objecao: '"Tô bem com bit.ly, paciente acha pelo Insta" — defesa do operacional atual que parece funcionar.',
    resposta_objecao: 'Faz sentido — bit.ly cumpre o básico. Mas pensa pelo lado do paciente novo de transplante capilar: ele vai gastar R$10-15k. Pesquisa MUITO antes de marcar — quer ver biografia, casos antes/depois (com ética), processo, recuperação, garantia. Cai no bit.ly e vê só "AGENDAR" sem nada disso. 70% recua. LP profissional pega esse momento: ele chega e vê biografia + CRM/RQE + galeria casos com cuidado ético + FAQ ("dói?", "quanto tempo recuperação?", "qual o método?") + agendamento integrado. Mesmo paciente, conversão diferente. E olha — vi que tu tem network com o Gabriel Barros (GB Nutrition), ele é meu cliente. Vocês se conhecem?',
    nota_interna: 'NÃO TEMOS case médico real ainda — proposta SHOWCASE R$200 desconto pra Marcel virar PRIMEIRO CASE médico esporte da Impulso (depois usa pra prospectar outros médicos). PONTE COM GABRIEL é vetor forte (network confirmado: @joaolabre videomaker GB segue Marcel). ANTES DE DISPARAR: falar com Gabriel sobre Marcel — ele provavelmente conhece. Telefone NÃO veio direto (bit.ly) — abrir e capturar. RQE 3191 confirmado. Pre-engajamento Insta D-1 obrigatório. Pitch "complexo" R$799-999 (formulário multi-categoria + área pacientes + Calendly).',
    abertura: `Oi Dr. Marcel, beleza? Eduardo aqui, Impulso Digital, sou de Palmas.

Vi que tu segue / é seguido por @gabribarros10 (GB Nutrition) — ele é meu cliente. Tô olhando médicos do esporte autônomos em Palmas e o teu perfil chamou atenção forte: 7k seg + 10 anos + nicho duplo (atleta + transplante capilar) + 178 posts.

Mas vi teu link da bio (bit.ly amador). Paciente novo de transplante capilar vai gastar R$10-15k — pesquisa MUITO antes de marcar e cai num bit.ly sem biografia, sem casos, sem FAQ. 70% recua.

Topa eu te mostrar caso similar e como o Gabriel migrou pra LP profissional?`,
    followup_d3: `Oi Dr. Marcel, voltei. Pensando: tu tem 2 funis distintos (atleta performance + transplante capilar premium) que poderiam ter LP dedicada cada um. Marketing médico em Palmas tá começando a despontar — quem chegar com LP profissional primeiro fica com a busca por anos. Topa ver protótipo?`,
    followup_d7: `Oi Dr. Marcel, última mensagem da minha parte. Sei que rotina de médico do esporte + transplante é puxada. Vou parar. Só registro: ponte com a vertical fitness (Gabriel/atletas) é canal raro de prospecção. Tu sabe onde me achar.`,
    pre_engajamento_ig: 'D-1: seguir, curtir 2 posts (priorizar conteúdo técnico de medicina do esporte OU transplante capilar — NÃO foto pessoal). NÃO comentar (médico recebe muito comentário genérico). Pre-warming via consumo do conteúdo. Mencionar Gabriel na 1ª mensagem é vetor direto (eles têm network confirmado).',
    razao_ranking: 'TIER S (score 9.5). Médico do Esporte com nicho duplo (atleta + transplante capilar) = 2 funis de receita potencial. Network confirmado com Gabriel/GB Nutrition (case real Impulso). Bit.ly amador = sinal de compra. PROPOSTA: 1º case médico Impulso com R$200 desconto pra virar showcase. Pitch "complexo" R$799-999.',
  },

  1158: {
    tier: 'A',
    posicao_no_tier: 49,
    dor: 'Dr. Rudinei Brunetto é urologista CRM-TO 4856 + RQE 2183 com sub-especialização em Uro-oncologia + Cirurgia Robótica. Endereço Qd. 401 Sul Av Lo 11, Clínica Salus Palmas-TO. 293 posts + 1.000+ pacientes atendidos + 5 destaques cirúrgicos estruturados (Enuc.Próstata / Cir.Robótica / Hérnia VL / CA Próstata / Mídia). 2.644 seguidores. Site atual: linktr.ee/dr.rudineibrunetto. CASO PERFEITO de "autoridade clínica + still uses linktr.ee" = ponto IDEAL de upgrade. Ticket altíssimo: cirurgia robótica R$8.000-25.000 + consultas R$400-700 + acompanhamento pré/pós-cirúrgico.',
    gancho: 'ARGUMENTO ESTRUTURAL — urologista solo com 1.000+ pacientes operados + 5 destaques cirúrgicos estruturados + ZERO domínio profissional = combinação que paga LP profissional com 1 cirurgia robótica fechada. LP Dr. Rudinei Brunetto Uro-oncologia: hero com 1.000+ pacientes + galeria casos cirúrgicos (com cuidado ético CFM) + biblioteca orientações pré-cirúrgicas + formulário triagem (CA próstata / hérnia / incontinência / vasectomia / robótica) + agendamento integrado + área de pacientes pós-cirúrgicos com follow-up + 3 artigos SEO ("cirurgia robótica próstata Palmas", "vasectomia segura", "uro-oncologia Tocantins"). Pitch: "a cirurgia robótica de Palmas merece a primeira LP médica robótica do estado".',
    objecao: '"Já tenho linktr.ee, paciente do hospital me indica, tá funcionando" — defesa da indicação como canal principal.',
    resposta_objecao: 'Total razão — indicação médica é o canal mais nobre e tu tem 1.000+ pacientes que viraram boca-a-boca. Mas pensa: o paciente NOVO indicado pelo cunhado dele que ouviu falar do "urologista da robótica em Palmas" vai pesquisar "Dr. Rudinei Brunetto urologia Palmas" antes de marcar (decisão cirúrgica, alta confiança). Cai no linktr.ee e vê 5 links sem catálogo cirúrgico, sem CFM em destaque, sem casos. Recua. LP profissional pega exatamente esse momento: ele chega e vê biografia + RQE Uro-oncologia + 5 procedimentos catalogados com FAQ ético + galeria casos. Mesmo paciente indicado, conversão diferente. E posso te oferecer uma coisa: tu pode virar o primeiro case URO da Impulso com R$200 desconto — vira showcase pra outros urologistas de Palmas. Topa?',
    nota_interna: 'PROPOSTA SHOWCASE prioritária — Rudinei pode virar PRIMEIRO CASE URO da Impulso (R$200 desconto). Telefone (63)3322-3278 confirmado Maps (fixo Clínica Salus — VALIDAR celular WhatsApp via linktr.ee). RQE 2183 confirmado. Pre-engajamento Insta D-1 obrigatório (curtir 2 posts técnicos cirúrgicos, NÃO comentar). Pitch "complexo" R$899-1.297 (5 destaques + galeria + área pacientes + 3 artigos SEO premium).',
    abertura: `Oi Dr. Rudinei, beleza? Eduardo aqui, Impulso Digital, sou de Palmas.

Tô olhando urologistas autônomos em Palmas e o teu perfil chamou atenção MUITO forte — Cirurgia Robótica + Uro-oncologia + 1.000+ pacientes + 5 destaques cirúrgicos estruturados. Tu já é referência local.

Mas vi teu link da bio (linktr.ee). Paciente novo de cirurgia robótica de próstata (R$15-25k) pesquisa MUITO antes — quer ver biografia, RQE, casos, processo. Cai no linktr.ee e vê 5 links sem catálogo. Recua.

Topa eu te mostrar como ficaria a 1ª LP médica robótica do estado?`,
    followup_d3: `Oi Dr. Rudinei, voltei. Pensando: 1.000+ pacientes operados + 5 destaques cirúrgicos = capital social que poucos urologistas do Brasil têm. Mas o canal não comunica isso. LP profissional com galeria ética + FAQ específico de cada procedimento + biblioteca pré-cirúrgica = vira destino oficial pra busca "cirurgia robótica próstata Palmas" que hoje não tem dono. Posso te oferecer R$200 desconto pra tu virar 1º case URO da Impulso — Topa?`,
    followup_d7: `Oi Dr. Rudinei, última mensagem da minha parte. Sei que rotina de urologista cirurgião é puxada. Vou parar. Só registro: cirurgia robótica em Palmas é nicho premium sem dono no Google — quem chegar primeiro com LP fica com a busca por anos. Tu sabe onde me achar.`,
    pre_engajamento_ig: 'D-1: seguir, curtir 2 posts técnicos (priorizar conteúdo cirúrgico ou educativo sobre próstata/uro — NÃO foto pessoal). NÃO comentar (cirurgião recebe genérico).',
    razao_ranking: 'TIER S (score 9.5). Cirurgia robótica = ticket altíssimo (R$8-25k por procedimento). Linktree amador = oportunidade clara. PROPOSTA SHOWCASE pra virar 1º case URO Impulso. Volume 2.6k é OURO (autoridade clínica + ainda amador). Pitch "complexo" R$899-1.297.',
  },

  1159: {
    tier: 'A',
    posicao_no_tier: 50,
    dor: 'Dr. Tarcísio Andrade é urologista CRM-TO 7893 + RQE 3686 com sub-especialização Uro-oncologia + Robótica + Vasectomia. 116 posts + 1.403 seg. BIO COMEÇA COM "Empreendedor" — mindset de venda já pronto (raro em médico, geralmente é elemento de identidade). Membro Titular Sociedade Brasileira de Urologia. Destaques estruturados (Orientações / Robótica / TCG / Vasectomia / Próstata) já formam funil informacional. Site atual: linktr.ee/drtarcisioandrade.uro. Volume médio (em construção, recente) mas posicionamento já maduro — falta a página que CONVERTE essa autoridade.',
    gancho: 'ARGUMENTO DIRETO via mindset empreendedor explícito — "vi tua bio começa com EMPREENDEDOR. Urologistas que se posicionam como empreendedores faturam 3-5x mais que urologistas que se posicionam como médicos puros". LP Dr. Tarcísio Empreendedor: formulário "qual procedimento te interessa?" (vasectomia/cirurgia robótica/uro-oncologia/orientação) + checkout vasectomia online (procedimento de ticket previsível) + área pacientes pré/pós + integração SBU credibilidade + 3 artigos SEO ("vasectomia Palmas TO segura", "cirurgia robótica urológica", "uro-oncologia tratamento"). Diferencial vs Rudinei: foco em VASECTOMIA como produto-âncora de funil (procedimento de ticket previsível, decisão masculina racional, conversão alta com LP).',
    objecao: '"Tô construindo agora, prefiro investir em mais conteúdo Insta primeiro" — defesa do estágio inicial.',
    resposta_objecao: 'Faz sentido — conteúdo Insta é fundamental, e tu tá na fase certa. Mas pensa: tu posicionou "Empreendedor" na bio — isso é mindset de quem entende que precisa de funil agora, não depois. Urologista que monta LP enquanto cresce no Insta captura cada novo seguidor desde o zero (vai virando lead, não só folower). Quem só monta DEPOIS de chegar a 5k segue capturou zero ao longo da curva. Custo é o mesmo (R$499), retorno acumulado é dramaticamente diferente. Tu já é Membro SBU, tu já cresce — falta o canal que captura. Topa ver?',
    nota_interna: 'BIO COMEÇA COM "EMPREENDEDOR" = lead diferente da maioria dos médicos (mindset comercial pronto). PROPOSTA SHOWCASE válida — pode virar 2º case URO Impulso ou primeiro de "vasectomia Palmas". Telefone NÃO veio direto — pegar via linktr.ee. RQE 3686 confirmado. Pre-engajamento Insta D-1 obrigatório (curtir 2 posts educativos, NÃO comentar).',
    abertura: `Oi Dr. Tarcísio, beleza? Eduardo aqui, Impulso Digital, sou de Palmas.

Tô olhando urologistas autônomos em Palmas e o teu perfil chamou atenção forte — começa com "Empreendedor" na bio (raro em médico) + Membro SBU + Cirurgia Robótica + Vasectomia + 5 destaques estruturados.

Mas vi teu link da bio (linktr.ee). Tu posicionou "Empreendedor" — esse é mindset de quem sabe que precisa de funil agora, não depois.

Topa eu te mostrar como uma LP captura cada novo seguidor desde o zero, em vez de só depois quando virar 5k?`,
    followup_d3: `Oi Dr. Tarcísio, voltei. Pensando: tu tá no momento ÚNICO (volume crescendo + posicionamento empreendedor maduro). LP montada agora captura cada paciente potencial desde os primeiros mil. Em 12 meses, quando tu tiver 4-5k seg, já está com 80-150 leads de vasectomia/robótica capturados. Versus quem só monta depois e captura zero retroativo. Topa ver protótipo?`,
    followup_d7: `Oi Dr. Tarcísio, última mensagem. Posicionamento empreendedor + volume crescendo = combinação rara em médico. Se em algum momento isso bater como prioridade, tu sabe onde me achar.`,
    pre_engajamento_ig: 'D-1: seguir, curtir 2 posts (priorizar conteúdo de vasectomia OU empreendedorismo médico — bio dele declara "Empreendedor"). NÃO comentar.',
    razao_ranking: 'TIER S (score 8.5). Mindset "Empreendedor" explícito + Membro SBU + RQE robótica = perfil ideal. Volume crescendo = momento ÚNICO de montar LP. Pitch padrão R$499 + R$99/mês ou complexo R$799-999 com checkout vasectomia online.',
  },

  1160: {
    tier: 'A',
    posicao_no_tier: 51,
    dor: 'Dr. Hugo Rossoni é reumatologista CRM-TO 3873 + RQE 1688 e PROFESSOR Afya & UNIRG (autoridade ACADÊMICA além da clínica). 6.626 seguidores + 1.139 posts = autoridade máxima editorial. Atende em CERTO + CERTO Prime (clínica multi-prof, perfil próprio mantém solo). Site atual: wa.me/message/R74WM4PL7SOXH1 — WHATSAPP DIRETO ZERO web profissional. CASO ABSURDO: professor universitário de medicina perdendo TODO lead novo de paciente que pesquisa autoridade antes de marcar. Destaques formam biblioteca SEO pronta (fibromialgia / lupus / artrite / osteoporose / cisto sinovial) — basta extrair pra LP.',
    gancho: 'PITCH AUTORIDADE ACADÊMICA: "Professor da Afya e UNIRG perdendo paciente premium em wa.me direto é desperdício de capital social". LP Dr. Hugo Rossoni Reumatologia Palmas: biblioteca SEO de 5-10 artigos técnicos (fibromialgia / lupus / artrite / osteoporose / cisto sinovial — TODOS seus destaques!) + formulário avaliação inicial + agendamento clínica CERTO + área de pacientes com plano de acompanhamento crônico + Prof. Afya autoridade em destaque. Pitch específico: "professor de medicina da Afya merece SEO médico que canaliza pacientes em vez de wa.me direto".',
    objecao: '"Tô na clínica CERTO, eles divulgam, tô tranquilo" — defesa do canal institucional.',
    resposta_objecao: 'Concordo — clínica multi-prof tem força. Mas pensa: paciente novo de fibromialgia que viu teu post sobre "vivendo com fibromialgia" no Insta vai pesquisar "Dr. Hugo Rossoni reumatologista Palmas" antes de marcar (doença crônica, alta confiança). Cai no wa.me direto, vê só "Olá!" sem biografia, sem CRM, sem teu papel de professor da Afya destacado, sem os 5 temas de destaque dele. 70% recua. LP pessoal SUA (não da CERTO) destaca: "Reumatologista + Professor Afya & UNIRG" como diferencial absoluto. Mesmo paciente, conversão diferente. Mantém a CERTO como canal de agendamento, mas LP vira destino oficial da TUA marca pessoal.',
    nota_interna: 'PROFESSOR universitário de medicina = autoridade RARA em prospect Impulso. PROPOSTA SHOWCASE válida — Hugo pode virar PRIMEIRO CASE REUMATO Impulso (R$200 desconto). Telefone NÃO veio direto (wa.me/message) — abrir, capturar número. RQE 1688 confirmado. CRM-TO 3873 confirmado. Pre-engajamento Insta D-1 obrigatório (curtir 2 posts técnicos sobre fibromialgia/lupus). Pitch "complexo" R$899-1.197 (biblioteca SEO 5-10 artigos + área pacientes crônicos + Prof. Afya destaque).',
    abertura: `Oi Dr. Hugo, beleza? Eduardo aqui, Impulso Digital, sou de Palmas.

Tô olhando reumatologistas autônomos em Palmas e o teu perfil chamou atenção MUITO forte — Professor Afya & UNIRG + 6.6k seg + 1.139 posts + 5 temas de destaque estruturados (fibromialgia/lupus/artrite/osteoporose/cisto sinovial).

Mas vi teu link da bio: wa.me direto. Professor universitário de medicina perdendo paciente novo num "Olá!" sem biografia + sem teus 5 temas + sem destaque do papel acadêmico.

Topa eu te mostrar como ficaria uma LP que canaliza paciente premium em vez de wa.me direto?`,
    followup_d3: `Oi Dr. Hugo, voltei. Pensando: teus 5 destaques (fibromialgia/lupus/artrite/osteoporose/cisto sinovial) são 5 ARTIGOS SEO PRONTOS esperando virar página. Cada um capta paciente que pesquisa "fibromialgia tratamento Palmas" no Google. Hoje quem aparece é blog genérico nacional. Tu poderia dominar essas buscas como Prof. Afya. Posso te oferecer R$200 desconto pra tu virar 1º case REUMATO Impulso. Topa?`,
    followup_d7: `Oi Dr. Hugo, última mensagem da minha parte. Sei que rotina de reumato + professor é puxada. Vou parar. Só registro: tua autoridade acadêmica + 5 temas crônicos = combinação que vira SEO médico dominante em Palmas. Tu sabe onde me achar.`,
    pre_engajamento_ig: 'D-1: seguir, curtir 2 posts técnicos sobre fibromialgia/lupus/artrite (priorizar conteúdo educativo, NÃO foto pessoal). NÃO comentar (médico recebe muito comentário paciente). Pre-warming via consumo do conteúdo.',
    razao_ranking: 'TIER S (score 8). Professor Afya = autoridade ACADÊMICA rara. wa.me direto = sinal de compra extremo. 5 destaques = 5 artigos SEO prontos. PROPOSTA SHOWCASE 1º case REUMATO Impulso. Pitch "complexo" R$899-1.197.',
  },

  1161: {
    tier: 'A',
    posicao_no_tier: 52,
    dor: 'Dr. Daniel Janczuk é cardiologista CRM-TO 4081 + RQE 1763 e EX-PRESIDENTE da Sociedade Brasileira de Cardiologia Tocantins 2024-2025 (autoridade MÁXIMA da cardiologia no estado — top 1-2). 1.955 posts + 10.300 seguidores. Atende Particular Prime - Certo Prime + Convênios. Telefone (63)99977-1541 confirmado bio. Site atual: linktr.ee/CardiologistaDanielJanczuk. CASO DESPROPORCIONAL: ex-presidente SBC-TO usando linktree é como Mercedes em estacionamento de bicicleta. Pacientes de classe A/B que pesquisam autoridade cardiológica antes de marcar consulta de R$500-700 NÃO encontram a página que ele merece.',
    gancho: 'PITCH PREMIUM AUTORIDADE-MÁXIMA: "Ex-Presidente SBC-TO 2024-2025 é autoridade RARÍSSIMA — pacientes premium pesquisam autoridade ANTES de qualquer marca/clínica. Linktree é desproporcional ao calibre". LP Dr. Daniel Janczuk Premium Cardiologia: hero com selo Ex-Presidente SBC-TO em destaque + biografia médica completa + biblioteca SEO técnica (HAS / dislipidemia / IAM prevenção / check-up cardiológico / risco cardiovascular) + agendamento Particular/Convênios diferenciado + área pacientes com exames + teleconsulta para retorno + tele-laudo. Pitch ESPECIAL: "autoridade SBC merece a primeira LP cardiologia premium do estado".',
    objecao: '"10k seguidores + linktree dá conta, paciente acha" — defesa de quem já tem volume.',
    resposta_objecao: 'Tu tem RAZÃO em parte — 10k seg + ex-presidente SBC = autoridade que poucos cardiologistas do Brasil têm. Mas pensa pelo perfil de paciente classe A/B que tu atende: ele pesquisa "Daniel Janczuk cardiologista Palmas" no Google, cai no linktree, vê 5 links sem hierarquia. Onde está o selo "Ex-Presidente SBC-TO"? Onde está a explicação de check-up cardiológico premium? Onde está o canal Particular vs Convênios distinto? Linktree planifica tudo. LP premium destaca tudo. Mesmo paciente, conversão diferente. PROPOSTA: tu pode virar 1º case CARDIO premium Impulso com R$200 desconto — vira showcase pra outros cardiologistas de prestígio em Palmas/Tocantins. Topa?',
    nota_interna: 'EX-PRESIDENTE SBC-TO = autoridade MÁXIMA do estado. PROPOSTA SHOWCASE prioritária — se Daniel fechar, vira case CARDIO PREMIUM da Impulso (resto dos cardiologistas Palmas vai querer). Telefone (63)99977-1541 confirmado bio. Pre-engajamento Insta D-1 obrigatório (curtir 2 posts técnicos cardiológicos, NÃO comentar — 10k seg recebe muito genérico). Pitch "complexo Premium" R$1.197-1.497 (autoridade SBC + Particular vs Convênios + biblioteca SEO + área pacientes + tele-laudo).',
    abertura: `Oi Dr. Daniel, beleza? Eduardo aqui, Impulso Digital, sou de Palmas.

Tô olhando cardiologistas autônomos consolidados em Palmas e o teu perfil é referência absoluta — Ex-Presidente SBC-TO 2024-2025 + 10k seg + 1.955 posts + Certo Prime. Top 1-2 cardiologia do estado.

Mas vi teu link da bio: linktr.ee. Paciente classe A/B que pesquisa "Daniel Janczuk cardiologista Palmas" antes de marcar consulta de R$500-700 cai num linktr.ee genérico — onde está o selo Ex-Presidente SBC-TO? Onde está canal Particular vs Convênios distinto?

Topa eu te mostrar a primeira LP cardiologia premium do estado?`,
    followup_d3: `Oi Dr. Daniel, voltei. Pensando: tu é UM dos 2-3 cardiologistas mais respeitados de Palmas. Pacientes premium que tu atende pesquisam ANTES de marcar — e o linktree planifica autoridade. LP premium destaca: Ex-Presidente SBC + 5 áreas técnicas + canal Particular vs Convênios + tele-laudo. Posso te oferecer R$200 desconto pra tu virar 1º case CARDIO PREMIUM Impulso. Topa?`,
    followup_d7: `Oi Dr. Daniel, última mensagem da minha parte. Ex-Presidente SBC-TO é autoridade que merece vitrine adequada — sei que isso bate quando tu tem tempo de pensar. Tu sabe onde me achar.`,
    pre_engajamento_ig: 'D-1: seguir, curtir 2 posts técnicos cardiológicos (priorizar conteúdo educativo de risco cardiovascular OU prevenção, NÃO foto pessoal). NÃO comentar (10k seg + verified-tier recebe muito genérico).',
    razao_ranking: 'TIER S (score 8). EX-PRESIDENTE SBC-TO = autoridade máxima cardiologia estado. 10k seg acima sweet spot mas autoridade compensa. PROPOSTA SHOWCASE PREMIUM — 1º case CARDIO Impulso. Pitch Premium R$1.197-1.497.',
  },

  1162: {
    tier: 'A',
    posicao_no_tier: 53,
    dor: 'Dr. Edson Pedroza é reumatologista CRM-TO 2799 com RQE 2054 TRIPLO (Reumatologia + Clínica Médica + Medicina do Trabalho). 2.342 POSTS — RECORDE editorial absoluto da rodada de prospecção (consistência monumental). 4.775 seguidores. Posicionamento humanizado "escuta e cuidado". Centro de Reumatologia Tocantins. Site atual: linktr.ee/Dredsonpedroza.reumato. OPORTUNIDADE DUPLA RARA: triplo RQE permite estratégia HIBRIDIZADA — (B2C) reumatologia humanizada + (B2B) Medicina do Trabalho com laudos PCMSO/PPRA pra empresas. Hoje tudo cai num linktr.ee linear que não capitaliza essa diferença.',
    gancho: 'LP DUPLA — explorar o RQE TRIPLO como vantagem competitiva única. (a) LP B2C reumatologia humanizada com calculadora de fibromialgia + biblioteca de orientações + agendamento + área pacientes crônicos; (b) Mini-site B2B Medicina do Trabalho com formulário PCMSO/PPRA empresas + casos corporativos + cotação online. Pitch único: "transformar 2.342 posts em 2 funis de receita simultâneos — paciente individual + empresa contratante". Diferencial vs outro reumato: ninguém em Palmas explora B2B Medicina do Trabalho por LP profissional ainda.',
    objecao: '"Linktree me serve, atendo direto, não preciso de complicação" — defesa do simples atual.',
    resposta_objecao: 'Faz sentido — linktree é simples e funciona. Mas pensa: tu tem RQE TRIPLO — Reumatologia + Clínica Médica + MEDICINA DO TRABALHO. O 3º RQE é canal B2B inteiro (laudos pra empresas, PCMSO, PPRA) que linktree não consegue separar do B2C. Empresa que precisa de PCMSO pesquisa "médico do trabalho Palmas TO" — e cai num linktr.ee genérico misturado com fibromialgia e lupus. Recua. LP estruturada permite SEPARAR os funis — paciente individual entra por uma porta, empresa entra por outra, ambos convertendo. Mesmo médico, 2x receita. Topa ver protótipo?',
    nota_interna: 'OPORTUNIDADE B2B+B2C ÚNICA no banco — explorar RQE TRIPLO como vantagem. Telefone NÃO veio direto (linktr.ee) — pegar antes. RQE 2054 confirmado. PROPOSTA SHOWCASE válida — pode virar 1º case "médico LP dupla B2C+B2B" da Impulso. Pre-engajamento Insta D-1 obrigatório.',
    abertura: `Oi Dr. Edson, beleza? Eduardo aqui, Impulso Digital, sou de Palmas.

Tô olhando reumatologistas autônomos em Palmas e o teu perfil chamou atenção MUITO forte — 2.342 posts (recorde absoluto editorial dos médicos que mapeei) + RQE TRIPLO (Reumato + Clínica + Medicina do Trabalho).

Pergunto direto: o RQE Medicina do Trabalho hoje — empresa que precisa de PCMSO/PPRA encontra TI no Google, ou cai num linktree misturado com fibromialgia e lupus?

Topa eu te mostrar como separar 2 funis de receita (paciente + empresa) numa LP estruturada?`,
    followup_d3: `Oi Dr. Edson, voltei. Pensando: 2.342 posts é capital editorial que MUITO médico do Brasil leva 10 anos pra construir. Mas RQE Medicina do Trabalho é receita B2B desperdiçada num linktr.ee linear. LP dupla — paciente individual + empresa contratante PCMSO — vira 2 funis simultâneos. Topa ver caso?`,
    followup_d7: `Oi Dr. Edson, última mensagem da minha parte. Posicionamento humanizado + RQE triplo + 2.342 posts é combinação rara. Se em algum momento isso bater como prioridade, tu sabe onde me achar.`,
    pre_engajamento_ig: 'D-1: seguir, curtir 2 posts (priorizar conteúdo humanizado sobre fibromialgia OU casos clínicos respeitosos — perfil dele valoriza humanização). NÃO comentar.',
    razao_ranking: 'TIER S (score 7.5). RQE TRIPLO = oportunidade rara de LP DUPLA (B2C reumato + B2B Medicina do Trabalho). 2.342 posts = capital editorial recorde. Linktree subdimensionado. Pitch "complexo Premium" R$1.197-1.497 (LP dupla + 2 funis).',
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
