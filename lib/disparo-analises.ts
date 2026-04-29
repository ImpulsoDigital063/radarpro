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
    posicao_no_tier: 3,
    dor: 'Psicólogo em Palmas compete por confiança. Paciente que busca "psicólogo Palmas" no Google hoje encontra o Gilson no Maps, mas clica e vê só endereço e telefone — zero contexto, zero cara, zero abordagem. Insta não transmite sigilo/seriedade do consultório. 4.9 com 135 avaliações prova autoridade, mas ele não está capitalizando esse ativo.',
    gancho: 'LP dedicada mostra linha de abordagem, especialidades, primeira consulta, FAQ ("sigilo é garantido?", "atende online?"). O "aparece no Google quando alguém pesquisa psicólogo em Palmas" é literal — Gilson já tem a reputação pra estourar SEO local.',
    objecao: 'Psicólogo tem escrúpulo com marketing agressivo. Provável: "não quero algo que pareça venda".',
    resposta_objecao: 'Faz sentido — tu tem ética profissional alta. A LP que eu monto pra psicólogo é o oposto de copy agressiva: paleta clara, foto profissional, linguagem ética. A autoridade dos teus 135 avaliações 4.9 fala por si — ela vende sozinha. Não vende "promessa de cura" — vende presença digital regulamentar. Posso te mostrar como ficaria a TUA — já com o tom certo de psicologia, paleta sóbria, sem soar comercial?',
    nota_interna: 'Se ele fechar e a LP virar boa, propor o caso Gilson Afonso como prova social na pasta de trabalhos — virou um dos cases mais elegantes pra mostrar pra outros profissionais de saúde.',
    abertura: `Doutor, boa noite

Reparei que tu tem 135 avaliações no Google aí em Palmas — base sólida pra quem ainda tá chegando
Queria te perguntar uma coisa: quem te acha ali hoje agenda direto, ou tu sente que muita gente fica em dúvida e some?`,
    followup_d3: `Ei doutor, voltei rapidinho — uma coisa que vejo bastante em psi
Paciente novo pesquisa, vê só endereço no Maps e desaparece sem nem mandar mensagem. Tá acontecendo aí no teu consultório?`,
    followup_d7: `Tô parando por aqui pra não te incomodar
Minha porta tá aberta quando fizer sentido, doutor`,
    pre_engajamento_ig: PRE_IG_PADRAO,
    razao_ranking: 'Autônomo (decide sozinho), ticket alto (R$150-250/sessão), 135 avaliações = reputação já construída (não precisa provar nada), dor de credibilidade digital é clássica do psicólogo. R$499 paga com 3 sessões.',
  },

  24: {
    tier: 'A',
    posicao_no_tier: 15,
    dor: 'Advocacia em Palmas: cliente pesquisa "advogado trabalhista Palmas" (ou família, ou previdenciário) ANTES de ligar. Se não tem site, cliente liga primeiro pro concorrente que tem. Nota 5 com 120 avaliações é escandalosa — Guilherme tá sentado numa mina de autoridade sem LP pra capturar essa intenção de busca.',
    gancho: 'LP de escritório de advocacia converte violento: áreas de atuação, foto do escritório, biografia, casos (sem expor cliente), FAQ ("quanto custa consulta?", "atende OAB-TO?"). SEO local + 3 artigos ("como entrar com ação trabalhista em Palmas", etc) = tráfego orgânico pra vida toda.',
    objecao: 'OAB tem regra contra marketing "chamativo". Provável: "não posso fazer propaganda de advogado".',
    resposta_objecao: 'Provimento 205/2021 da OAB permite LP informativa sem preço nem promessa de resultado. A LP segue direitinho: informação sóbria, áreas de atuação, formulário de contato. Não é captação agressiva, é presença digital regulamentar.',
    abertura: `Doutor, boa noite

Vi que você tem 120 avaliações no Google e nota 5 — em advocacia, isso é raro
Hoje cliente novo pesquisa "advogado [área] Palmas" antes de ligar
Quando ele chega no Maps e vê só endereço, ele liga em você ou no concorrente?`,
    followup_d3: `Ei doutor, voltei rapidinho — uma coisa que vejo em advogado consolidado
O Provimento 205/2021 da OAB libera LP informativa (sem preço, sem promessa) — você sabia que tinha isso?`,
    followup_d7: `Tô parando por aqui pra não te incomodar, doutor
Minha porta fica aberta quando fizer sentido`,
    pre_engajamento_ig: PRE_IG_PADRAO,
    razao_ranking: 'Decide sozinho, ticket cliente altíssimo (honorários 10%+ de causa), 120 reviews 5 = autoridade máxima. R$499 paga com 1/10 de um honorário. Objeção OAB é real mas contornável.',
  },

  146: {
    tier: 'A',
    posicao_no_tier: 35,
    dor: 'Perfumaria de importado em Palmas: a DOR é PROVA DE AUTENTICIDADE. Cliente que vai gastar R$400-800 num perfume importado quer site profissional, notas fiscais visíveis, política de troca, garantia. Vender perfume importado só pelo Instagram é assinar atestado de "pode ser falso". Nota 5 com 109 aval prova que os clientes já confiam — mas quem não conhece ainda, desconfia.',
    gancho: 'Shopify com checkout MP (parcelamento 12x) + cadastro organizado por marca (Dior, Carolina Herrera, Chanel, etc) + vitrine com estoque real + selo "Perfumaria autorizada" + entrega Palmas no dia. Ticket médio do setor é alto, Shopify paga com 1-2 vendas.',
    objecao: '"Já vendo bem pelo WhatsApp, pra que site?" — Don Parfum provavelmente já fatura bem.',
    resposta_objecao: 'Cliente NOVO que não te conhece não compra R$500 no WhatsApp de alguém que só tem Insta. Shopify = porta de entrada pra cliente novo. Os que já confiam continuam no WhatsApp se quiserem. Você dobra o funil.',
    abertura: `Ei, passei pelo perfil de vocês agora

Vocês têm 109 avaliações 5 estrelas em perfumaria importada aí em Palmas — base fiel forte
Cliente novo que vai gastar R$500 num importado pesquisa MUITO antes — desconfia de quem só tem Insta
Deixa eu te perguntar: hoje quem busca isso te acha ou cai em loja online de SP?`,
    followup_d3: `Ei, voltei aqui rapidinho — uma coisa que vejo em perfumaria importada
Cliente que paga R$500 quer ver foto da loja, política de troca, autenticidade — Insta não cobre isso. Tá acontecendo aí?`,
    followup_d7: `Tô parando por aqui pra não encher
Minha porta fica aberta quando fizer sentido`,
    pre_engajamento_ig: PRE_IG_PADRAO,
    razao_ranking: 'Ticket altíssimo (Shopify paga com UMA venda), dor de autenticidade é clássica de importado, 109 reviews 5 mostra base fiel mas sem capturar tráfego novo. Provável que dono seja executivo e reconheça o valor de um site.',
  },

  116: {
    tier: 'A',
    posicao_no_tier: 43,
    dor: 'Moda executiva feminina em Palmas: cliente é advogada, servidora pública concursada, executiva. Ticket médio alto (R$300-800 por peça). Essa cliente NÃO compra roupa de trabalho pelo WhatsApp — ela quer ver vitrine organizada, filtrar por tamanho, pagar no cartão corporativo, receber em casa. "Moda executiva" sem site é contraste: vende sofisticação num canal informal.',
    gancho: 'Shopify com filtro por tamanho + ocasião (trabalho, evento, reunião) + parcelamento 12x + retirada na loja OU entrega em casa. Tema da loja com paleta sóbria/premium. 20 produtos cadastrados no entregável já cobre a coleção atual.',
    objecao: '"Minha cliente é fiel, compra pessoalmente" — vai defender o relacionamento.',
    resposta_objecao: 'A cliente fiel continua indo na loja. O site capta a que TROCA de emprego, que MUDA pra Palmas, que viu a concorrente vendendo online e busca "moda executiva feminina Palmas". Hoje essa cliente nova não te acha.',
    abertura: `Ei, passei pelo perfil agora

Reparei que tu trabalha com moda executiva feminina aí em Palmas — nicho posicionado, 5 estrelas com 63 avaliações
Advogada/servidora que acabou de chegar em Palmas pesquisa "moda executiva Palmas" antes de comprar
Deixa eu te perguntar: hoje quem busca isso te acha ou cai em loja online de SP?`,
    followup_d3: `Ei, voltei aqui rapidinho — uma coisa que vejo em moda executiva
Cliente fiel compra pessoalmente, mas cliente nova (que mudou pra Palmas semana passada) precisa de site pra confiar. Tá rolando aí?`,
    followup_d7: `Tô parando por aqui pra não encher
Minha porta fica aberta quando fizer sentido`,
    pre_engajamento_ig: PRE_IG_PADRAO,
    razao_ranking: 'Nicho posicionado (moda EXECUTIVA, não genérica), cliente de ticket alto, dona provavelmente mulher executiva que entende o valor de presença digital. Nota 5 com 63 avaliações = base sólida, não pequena.',
  },

  9: {
    tier: 'A',
    posicao_no_tier: 44,
    dor: 'Nutri autônoma em Palmas: cliente busca "nutricionista Palmas" no Google antes de agendar. Izabela tem Insta (@nutriizabelacampos), mas Insta não aparece no Google pra quem pesquisa. 5.0 com 63 avaliações = autoridade construída sem canal pra capturar tráfego frio.',
    gancho: 'LP de nutri converte: especialidades (emagrecimento, esportiva, nutrição clínica), "como funciona a primeira consulta", FAQ ("atende plano de saúde?", "faz online?"), formulário de agendamento. 3 artigos SEO tipo "nutricionista em Palmas com atendimento online" = tráfego orgânico.',
    objecao: '"Capto pelo Instagram, tá funcionando" — nutri jovem, fluente em mídia social.',
    resposta_objecao: 'Instagram capta quem já te segue. LP capta quem NUNCA ouviu falar de você. São dois funis diferentes. Link da bio do Insta aponta pra LP → converte quem veio do Insta também. Soma, não substitui.',
    abertura: `Boa noite, Izabela

Vi que tu tem 5 estrelas com 63 avaliações como nutricionista em Palmas — autoridade construída de verdade
Insta capta quem já te segue, mas paciente novo que pesquisa "nutricionista Palmas" no Google às 23h cai em nutri qualquer
Hoje ele te acha primeiro, ou tu sente que muito paciente novo se perde nesse momento?`,
    followup_d3: `Ei Izabela, voltei rapidinho — uma coisa que vejo em nutri autônoma
Insta e Google são 2 funis diferentes — Insta capta seguidor, Google capta paciente novo. Tá rolando isso contigo?`,
    followup_d7: `Tô parando por aqui pra não encher
Minha porta fica aberta quando fizer sentido`,
    pre_engajamento_ig: PRE_IG_PADRAO,
    razao_ranking: 'Autônoma decide sozinha, ticket médio ok (R$200-350/consulta), dor de SEO local é óbvia pra ela. 5.0 / 63 aval mostra que tem público fiel — o que falta é capturar o novo. R$499 paga com 2-3 pacientes.',
  },

  11: {
    tier: 'A',
    posicao_no_tier: 10,
    dor: 'NUTRI NEFRO — ou seja, nutricionista especializada em doença renal. Nicho raríssimo. Paciente renal busca desesperado por esse perfil (alimentação correta faz diferença entre diálise ou não). Não ter LP com "nutri nefro" escrito explícito é DEIXAR DINHEIRO NA MESA — SEO pra "nutricionista renal Palmas" deve ter concorrência zero.',
    gancho: 'LP + 3 artigos SEO ("dieta pra paciente com insuficiência renal", "nutri nefro em Palmas", "alimentação pré-diálise") = domínio absoluto dessa busca em Palmas e região.',
    objecao: 'IG é @draanacarolinaalmeida (nome próprio, não @nutrinefro-algo) — provável que o nicho nefro ainda não esteja no posicionamento público dela.',
    resposta_objecao: 'Exatamente por isso a LP resolve. Insta você não muda do dia pra noite sem perder público. LP você lança com o posicionamento nefro EXPLÍCITO. É sua chance de ocupar o nicho em Palmas antes de alguém chegar.',
    abertura: `Doutora, boa noite

Vi que você é nutri nefro em Palmas — nicho raríssimo na cidade
Paciente renal que pesquisa "nutricionista pra insuficiência renal Palmas" hoje cai em nutri genérica
Quando ele busca isso, te acha ou perde pelo caminho?`,
    followup_d3: `Ei doutora, voltei rapidinho — uma coisa que vejo em nicho médico raro
SEO pra "nutricionista renal Palmas" provavelmente tem concorrência zero — quem ranqueia primeiro domina por anos. Faz sentido pra você?`,
    followup_d7: `Tô parando por aqui pra não te incomodar, doutora
Minha porta fica aberta quando fizer sentido`,
    pre_engajamento_ig: PRE_IG_PADRAO,
    razao_ranking: 'Nicho raro = concorrência zero em SEO = LP domina rápido. Cliente renal é recorrente (consulta mensal por anos) e paga qualquer preço. Nota 5 confirma que quem chega fica. R$499 paga com 2 pacientes novos.',
  },

  // ── TIER A (CIC 25/04) — 5 leads IG-only verificados via Claude in Chrome ──
  // Hashtags varridas: #modafemininapalmas, #modafestapalmas, #brechopalmas
  // Filtros duros aplicados (handle real do post + bio + engajamento + ticket).

  1096: {
    tier: 'A',
    posicao_no_tier: 26,
    dor: 'Brechó moderno com 13.7k seguidores, 14% engajamento (anomalia positiva — média do varejo IG é 1-3%), 5 categorias (roupas, bolsas, acessórios, sapatos, artesanato) e "frete pra todo Brasil" JÁ rodando via DM. Volume gigante invisível: cada peça = 8-15 mensagens trocadas (foto, medida, frete, pix, comprovante, código de envio). Ela já vende como uma loja — só não TEM uma.',
    gancho: 'Shopify pega o catálogo dela das 5 categorias, monta vitrine navegável + checkout MP (parcelamento 12x) + cálculo de frete automático Correios + rastreio. Ela responde DM pra dúvida real, não pra processar pedido. Mesmo volume, 1/4 do trabalho.',
    objecao: '"Já vendo muito bem assim, pra que mexer?" — base sólida (13.7k + 14% engaj) é argumento forte dela.',
    resposta_objecao: 'Faz total sentido — tu vende muito bem mesmo, é raro ver 14% engajamento em varejo. Mas pensa: se hoje tu fatura X respondendo DM o dia inteiro, quanto tu poderia faturar SEM responder DM de pagamento e frete? Shopify não substitui o teu Insta. Substitui só a parte burocrática. Cliente paga sozinho, escolhe frete sozinho, recebe rastreio automático. Tu fica livre pra postar mais achadinho — que é o que faz a magia funcionar.',
    nota_interna: 'TELEFONE TRUNCADO no JSON CIC ("(63) 92112-019" — só 8 dígitos). VALIDAR antes de mandar WhatsApp. Endereço confirmado: Quadra 404 Sul Alameda 2 Lote 20 QI 13, Palmas-TO 77021600. LEAD #1 do batch CIC — mais perfeito da semana. Pre-engajamento OBRIGATÓRIO via DM Instagram (não WhatsApp direto).',
    abertura: `Ei, passei pelo teu Insta agora

Tu tem 13.7k seguidores com 14% de engajamento — varejo bom fica em 1-3%, isso é absurdamente alto
O lado B desse engajamento todo é o DM virando call center: medida, frete, pix, comprovante
Deixa eu te perguntar uma coisa: quanto da tua semana vai só pra isso?`,
    followup_d3: `Ei, voltei aqui rapidinho — uma coisa que vejo em brechó com volume alto
O engajamento é o motor, mas o operacional sufoca — Shopify desafoga sem mexer no Insta. Tá acontecendo isso contigo?`,
    followup_d7: `vou parar por aqui pra não encher
se fizer sentido depois, me chama`,
    pre_engajamento_ig: 'D-1 (24h antes): seguir, curtir 3 posts dos últimos 7 dias (priorizar achadinhos com muito comentário), comentar 1 com algo genuíno tipo "essa peça é incrível" ou referência ao item específico. Brechó vive de comunidade — engajamento real importa MUITO mais que pra outros nichos.',
    razao_ranking: 'LEAD #1 do batch CIC. 13.7k seg + 14% engajamento (anomalia positiva forte) + frete Brasil já operando = dor de operação invisível mas real. 5 categorias = vitrine pronta. Ticket médio brechó moderno (R$50-200/peça) com volume justifica Shopify (a partir de R$599). Pré-engajamento Insta obrigatório porque comunidade brechó valoriza relacionamento.',
  },

  1093: {
    tier: 'A',
    posicao_no_tier: 27,
    dor: 'Carpe Diem tem story FIXO chamado "Shop On-line" no perfil — sinal escancarado de que a Mirian (dona ativa, @mirian.pereiraa) JÁ SABE que precisa de loja online. Ou tentou e travou, ou tá em fila esperando alguém pra montar. 1.893 seg + 2.7% engajamento real (alto pra varejo) + 447 posts = catálogo robusto, base sólida. Falta o canal.',
    gancho: 'Não precisa convencer da NECESSIDADE — ela já sabe. O pitch é: "vi que tu tem story Shop On-line há um tempo e provavelmente travou em alguma coisa (preço, complexidade, achar quem fizesse). Eu monto em 7-10 dias, a partir de R$599, com 20 produtos cadastrados e treinamento". Pulo o convencimento, vou direto pra cotação.',
    objecao: '"Quanto custa?" — provável PRIMEIRA pergunta dela, porque ela já tá pesquisando.',
    resposta_objecao: 'A partir de R$599 — depende do tamanho do catálogo (tu tem 447 posts, então provavelmente é catálogo médio-grande, mas a gente fecha o número certo na call). Setup uma vez, sem mensalidade Impulso. Shopify cobra US$1/mês nos 3 primeiros meses, depois US$19/mês — direto com eles. Em 20 min de call eu te falo o número exato pro teu caso.',
    abertura: `Ei Mirian, passei pelo teu perfil agora

Reparei que tu tem story FIXO "Shop On-line" há um tempo — isso mostra que tu já reconheceu que precisa de loja online, só travou em algum ponto
Deixa eu te perguntar: tu travou em qual parte — preço, complexidade ou esperando alguém pra fazer?`,
    followup_d3: `Ei, voltei aqui rapidinho — uma coisa que vejo em loja com base pronta
447 posts e 2.7% de engajamento é tração real, o que falta é só o canal. Tá acontecendo isso contigo?`,
    followup_d7: `Tô parando por aqui pra não te encher
Minha porta fica aberta quando fizer sentido`,
    pre_engajamento_ig: PRE_IG_PADRAO,
    razao_ranking: 'INTENT-AWARE LEAD. Story "Shop On-line" = sinal explícito de necessidade reconhecida. Pula etapa de convencimento — vai direto pra cotação. 447 posts = catálogo pronto. Mirian (dona) ativa visível. Ticket médio bom. Provável fechamento rápido.',
  },

  1087: {
    tier: 'A',
    posicao_no_tier: 39,
    dor: 'Mary Fashion tem 2.140 posts no Instagram — 5+ anos de catálogo acumulado. Quando cliente quer ver "o que tem em vermelho tamanho M", precisa rolar feed infinito. Volume de catálogo virou problema, não solução. Sem filtro, sem busca, sem categoria — Shopify resolve em 1 dia.',
    gancho: 'Shopify pega esses 2.140 posts e organiza nas peças que ainda estão em estoque (provavelmente 100-200 produtos ativos), com filtro por categoria, cor, tamanho, preço. O catálogo de 5 anos vira loja navegável em horas, não em rolagem.',
    objecao: '"Meu cliente já me conhece e vê pelo Insta" — argumento clássico de loja com base fiel.',
    resposta_objecao: 'Cliente fiel continua no Insta — perfeito, não mexe. Mas a CLIENTE NOVA, que viu uma referência tua num story compartilhado por amiga, ela abre teu Insta e vê 2.140 posts. Como ela acha o conjunto que viu? Ela não acha. Vai pra concorrência. Shopify pega esses 2.140 posts e vira "filtro por cor, tamanho, ocasião" — cliente nova compra sozinha, cliente fiel continua no DM.',
    abertura: `Ei, passei pelo perfil de vocês agora

Vocês têm 2.140 posts no Insta — 5+ anos de catálogo acumulado em moda feminina, ativo raro
Cliente fiel acha rapidinho, mas cliente nova abre o perfil e não sabe por onde começar
Deixa eu te perguntar: como ela acha hoje a peça que ela quer?`,
    followup_d3: `Ei, voltei aqui rapidinho — uma coisa que vejo em loja com volume alto
2.140 posts é ativo gigante, não problema — só precisa virar buscável. Tá rolando esse buraco com cliente nova?`,
    followup_d7: `Tô parando por aqui pra não encher
Minha porta fica aberta quando fizer sentido`,
    pre_engajamento_ig: PRE_IG_PADRAO,
    razao_ranking: 'Volume de catálogo (2.140 posts) é ativo subutilizado. Loja consolidada com base fiel — argumento de cliente nova é o gancho. Provavelmente já fatura bem, então o pitch é ESCALA, não SEO.',
  },

  1092: {
    tier: 'A',
    posicao_no_tier: 31,
    dor: 'Lorenn parcela 3x cartão VIA DIRECT MESSAGE — cliente manda print do cartão pelo WhatsApp/DM, ela registra manualmente, processa em maquininha física. Pesadelo operacional + risco de fraude + chargeback fácil. Cada venda parcelada = 15-20 mensagens. Volume baixo (1.391 seg) mas conjunto R$195 = ticket médio decente. Mercado Pago integrado no Shopify resolve em 1 clique.',
    gancho: 'Shopify + Mercado Pago = parcelamento 12x automático, antifraude da plataforma, repasse direto na conta. Ela para de mandar cliente conferir 3x se vai cair certo, para de digitar dado de cartão de outra pessoa. Cliente paga, ela recebe notificação "pagamento aprovado", pronto.',
    objecao: '"Faço já há tempo, dá certo, cliente confia" — defesa do processo manual existente.',
    resposta_objecao: 'Faz sentido — tu construiu confiança forte com tua cliente. Mas cliente NOVA que nunca te conheceu não manda print do cartão dela pra estranha no WhatsApp — ela some. Mercado Pago resolve confiança da cliente nova (selo de plataforma conhecida), enquanto pra cliente fiel é ainda mais cômodo. E tu para de carregar a operação de cobrança nas costas.',
    nota_interna: 'TELEFONE TRUNCADO no JSON CIC ("(63) 92689-659" — só 8 dígitos no número, deveria ter 9). VALIDAR antes de disparar WhatsApp. Pre-engajamento via DM Instagram primeiro.',
    abertura: `Ei Lorenn, passei pelo teu perfil agora

Reparei que tu parcela 3x cartão via direct — print do cartão, conferência manual, maquininha (uns 15-20 min por venda parcelada)
Operação que escalava no início vai sufocando conforme volume cresce, sem visibilidade
Deixa eu te perguntar: cliente nova trava em "mando dado de cartão por DM mesmo?" e some?`,
    followup_d3: `Ei, voltei aqui rapidinho — uma coisa que vejo em loja que parcela via DM
Cliente nova não confia em mandar cartão por mensagem — ela some sem avisar. Tá acontecendo isso contigo?`,
    followup_d7: `Tô parando por aqui pra não encher
Minha porta fica aberta quando fizer sentido`,
    pre_engajamento_ig: PRE_IG_PADRAO,
    razao_ranking: 'Dor MUITO clara e visível na bio (parcelamento DM). Ticket médio decente (conjunto R$195). Pequena (1.391 seg) mas com tração real. Shopify a partir de R$599 paga com 3-4 vendas. Probabilidade alta de fechar pelo argumento de operacional.',
  },

  1089: {
    tier: 'A',
    posicao_no_tier: 32,
    dor: 'Dborah Closet tem PROCESSO MADURO mas escala via DM: posta caption com preço E parcelamento ("vestido R$440 em 3x R$146 ou 6x R$73"), bio diz "Enviamos pra todo Brasil", 1.105 posts no catálogo. Ela já estruturou a oferta como uma loja real — só falta o checkout. Cliente que viu o caption pronto não pode clicar e comprar. Tem que mandar DM pra confirmar disponibilidade, pedido, frete, pix.',
    gancho: 'Shopify pega o que ela já faz manualmente (preço fixo + parcelamento + frete Brasil) e automatiza. Caption no Insta linka pra produto direto na loja. Cliente lê caption, clica, vê o tamanho dela, paga em 12x, escolhe frete Correios, pronto. Sem DM.',
    objecao: '"Já tenho fluxo, todo mundo me manda DM, dá certo" — operação consolidada.',
    resposta_objecao: 'Tu já criou metade da loja sem perceber: preço, parcelamento e frete Brasil já estão na tua bio e nos teus captions. Falta só o último click. Hoje a cliente lê o caption, vê que o vestido custa R$440 em 3x — mas pra fechar, tem que mandar DM, esperar tu responder, mandar foto da peça, perguntar tamanho, mandar pix... 30 min de jornada. Shopify reduz isso pra 2 min, sem te tirar do meio.',
    abertura: `Ei Dborah, passei pelo teu perfil agora

Reparei que tu posta preço e parcelamento direto no caption ("3x R$146 ou 6x R$73"), bio diz "enviamos pra todo Brasil"
Basicamente tu já fez metade do trabalho de uma loja online — só falta o botão de comprar
Deixa eu te perguntar: quanta cliente lê o caption mas trava em "mandar DM pra fechar" e some?`,
    followup_d3: `Ei, voltei aqui rapidinho — uma coisa que vejo em loja que vende por caption
Quando cliente já lê preço pronto mas precisa mandar DM, perde 30-50% no caminho. Tá rolando isso contigo?`,
    followup_d7: `Tô parando por aqui pra não encher
Minha porta fica aberta quando fizer sentido`,
    pre_engajamento_ig: PRE_IG_PADRAO,
    razao_ranking: 'PROCESSO MADURO sem ferramenta. Preço + parcelamento + frete Brasil já no caption = ela pensa como dona de loja online, só não tem o checkout. 1.105 posts = catálogo. Loja física + envio Brasil = volume real. Shopify cabe perfeito.',
  },

  // ── TIER A (CIC #2.5 v2 — 25/04 multi-nicho) — 3 leads-âncora score 8 ──
  // Hashtags varridas: suplementos, semi-joias, perfumaria. 35 perfis abertos,
  // 11 aprovados nos 7 filtros duros. Top 3 com score 8 ganham playbook customizado.

  1103: {
    tier: 'A',
    posicao_no_tier: 30,
    dor: 'Mara Camargo Semijoias tem 16 ANOS de curadoria, ticket alto (semijoia premium R$200-1.500), 3.047 posts no Instagram (catálogo gigantesco) e dona-marca que aparece em vídeos (decisão direta, sem comitê). DUAS DORES SOBREPOSTAS: (1) foco 100% LOCAL — atendimento seg-sex 9h30-18h30 na 208 Sul; cliente de fora não consegue comprar. (2) DOR INVISÍVEL DESCOBERTA NO BATCH CIC #4: ela vende em "site de plataforma multi-vendedor" (provável joalheria multi-marca) — ou seja, ELA JÁ ENTENDEU que precisa de canal online, mas tá pagando comissão pra plataforma de terceiro hospedar peças dela junto com de outras lojistas. Marca premium dividindo vitrine = perde força de identidade.',
    gancho: 'Shopify pega o catálogo dela (3.047 posts = ~800 peças únicas em rotação) e monta vitrine premium PRÓPRIA com filtro por categoria (anel, brinco, colar, pulseira) + parcelamento 12x + frete Brasil. DOIS argumentos sobrepostos: (a) destrava cliente de fora de Palmas, (b) ELA SAI DA PLATAFORMA MULTI-VENDEDOR — para de pagar comissão e de dividir vitrine com concorrente. Domínio próprio = "maracamargo.com.br" (não "plataformaX.com.br/maracamargo"). Mara continua atendimento exclusivo no físico, só agora também tem CASA digital própria.',
    objecao: '"Meu negócio é atendimento exclusivo, presencial. Online tira a alma da marca." OU "Já vendo no [site da plataforma], ali já é online, pra que outro?"',
    resposta_objecao: 'Faz total sentido — atendimento exclusivo é teu diferencial e cliente fiel ama isso. Shopify NÃO substitui isso, e a plataforma multi-vendedor não substitui ele também. Pensa assim: quando alguém digita "Mara Camargo semijoia" no Google, hoje cai no perfil teu DENTRO da plataforma multi-vendedor — ali tu compete por atenção com outras 30 lojistas, paga comissão e a marca premium fica diluída. No teu domínio próprio, é só TUA vitrine, tua narrativa de curadoria, sem rateio. Mesma cliente de fora chegando, sem comissão, sem competir com vizinha de plataforma. Topa eu te mostrar como ficaria?',
    nota_interna: 'LEAD ESTRATÉGICO TOP do batch CIC #2.5 v2 + reforçado no batch #4 (insight da plataforma multi-vendedor). Dona-marca = decisão direta. INVESTIGAR antes da call: descobrir QUAL é a plataforma multi-vendedor onde ela vende hoje (provavelmente joalheria multi-marca tipo Anelinha/Joia Nice/etc) — esse dado vira munição pesada de pitch ("vou te mostrar quanto tu paga de comissão por mês na plataforma X que tu poderia investir uma vez só na tua loja própria"). Pre-engajamento OBRIGATÓRIO. Telefone (63)99975-4455 confirmado. Pitch "complexo" (catálogo grande + branding premium + integração com plataforma atual pra migração suave), valor provável R$899-1.199 na call.',
    abertura: `Ei Mara, passei pelo teu perfil agora

Reparei que tu tem 16 anos de curadoria em semijoia premium em Palmas — base de marca rara, raríssima na cidade
Atendimento é 100% local seg-sex 9h30-18h30 — cliente de Goiânia, Brasília que viu peça tua no story não consegue comprar
Deixa eu te perguntar: tu sente que muita cliente de fora chega no story e some sem fechar?`,
    followup_d3: `Ei, voltei aqui rapidinho — uma coisa que vejo em marca premium consolidada
16 anos + 3.047 posts é catálogo digital que ninguém em Palmas tem — só falta o botão de compra. Faz sentido pra ti?`,
    followup_d7: `Tô parando por aqui pra não encher
Minha porta fica aberta quando fizer sentido`,
    pre_engajamento_ig: 'D-1 OBRIGATÓRIO: seguir, curtir 3 posts editorial dos últimos 7 dias (priorizar peças com close-up e foto de modelo), comentar 1 com algo específico da peça ("essa pulseira ficou com um caimento incrível" ou referência ao material). Marca premium valoriza relacionamento — engajamento genérico queima.',
    razao_ranking: 'LEAD-ÂNCORA TOP do batch CIC #2.5 v2. Ticket alto + 16 anos curadoria + dona-marca decisão direta + 3.047 posts catálogo = case ideal Shopify pra escalar fora de Palmas. Foco LOCAL hoje é a oportunidade — destrava nacional. Pitch "complexo" (catálogo grande + branding premium), valor provável R$899-1.199 na call.',
  },

  1102: {
    tier: 'A',
    posicao_no_tier: 29,
    dor: 'One Suplementos tem 5 LOJAS FÍSICAS em Palmas, 12.300 seguidores, 437 posts, "envia para todo Brasil" declarado na bio, frete grátis Tocantins R$199,90+, conta verificada e link tree no perfil. Operação grande já vendendo nacional via DM/link tree. Cada pedido de fora = pedido por mensagem (estoque, frete, pix), 5 lojas pra coordenar inventário, link tree em vez de checkout real. É EV Suplementos Injetáveis em escala maior — exatamente o caso GB Nutrition pronto pra Shopify.',
    gancho: 'Shopify resolve 3 dores em 1: (a) checkout único com cálculo de frete automático (cliente paga sozinho, escolhe motoboy ou Correios), (b) catálogo unificado com estoque por loja (cliente vê o que tem perto e retira), (c) substitui link tree por loja real (legitimidade pra cliente novo). Mesma operação, 1/3 do trabalho de DM, 3x o ticket médio porque cliente compra cesta em vez de 1 item.',
    objecao: '"Já vendemos pelo Brasil, dá certo. Por que mexer?" — operação madura defendendo o status quo.',
    resposta_objecao: 'Entendo — vocês construíram operação que funciona, raríssimo nesse setor. Mas pensa: hoje o cliente de Cuiabá que viu vocês pelo Insta tem que mandar mensagem, esperar resposta, perguntar frete, mandar pix. Quantos desistem nessa jornada? No Shopify ele paga em 5 min, escolhe Correios ou motoboy, e vocês recebem o pedido pronto. Mesma operação — só sem o gargalo da DM. Topa eu te mostrar caso de Distribuidora de SP que fez essa migração e dobrou volume?',
    nota_interna: 'OPERAÇÃO MADURA — não pitchar como entry-level Shopify. Pitch deve ser de UPGRADE de canal, não criação. Validar se já tem ERP (provável) — Shopify integra com Bling, Tiny e ContaAzul (o que já usa). Telefone NÃO veio direto no JSON (link tree) — pegar número do link tree antes de disparar. Projeto provavelmente "complexo" — múltiplas lojas, integração ERP, talvez Premium R$1.497+.',
    abertura: `Ei, passei pelo perfil de vocês agora

Vocês têm 5 lojas físicas + envio Brasil declarado + verificação Insta — operação consolidada que pouca loja tem
Cliente novo de Cuiabá que abre vocês pelo Insta tem que mandar DM perguntando estoque/frete/pix
Quantos desistem nesse caminho?`,
    followup_d3: `Ei, voltei aqui rapidinho — uma coisa que vejo em operação multi-loja
5 lojas + Brasil é distribuição que loja única não tem — checkout unificado com estoque por loja resolve isso. Faz sentido pra vocês?`,
    followup_d7: `Tô parando por aqui pra não encher
Minha porta fica aberta quando fizer sentido`,
    pre_engajamento_ig: 'D-1: seguir, curtir 2 posts (priorizar lançamentos/promoções recentes — operação grande gosta de feedback de mercado), NÃO comentar (operação madura recebe muitos comentários genéricos, queima rápido). Pre-warming via consumo do conteúdo, não via interação social.',
    razao_ranking: 'CASO GB NUTRITION EM ESCALA MAIOR. 5 lojas + Brasil declarado + verificado = operação que JÁ pensa nacional. Ticket alto-médio (suplemento R$80-300), volume grande. Shopify destrava 3-5x. Pitch enterprise/complexo (não entry-level). Probabilidade de fechamento depende de quem decide (sócio único? 5 sócios?) — qualificar antes.',
  },

  1104: {
    tier: 'A',
    posicao_no_tier: 28,
    dor: 'L\'Essence é a ÚNICA perfumaria de luxo importada do Capim Dourado Shopping (maior shopping de Palmas). Ticket altíssimo (Bad Boy Carolina Herrera, importados árabes, faixa R$300-1.500), 1.085 posts (catálogo robusto), foto editorial. Mas opera 100% LOCAL — quem mora fora de Palmas e quer importado original (não falsificado de marketplace) não tem onde comprar com selo de autenticidade. Oceano azul: Shopify abre mercado nacional pra perfume importado palmense.',
    gancho: 'Shopify com selo "Perfumaria autorizada do Capim Dourado" + nota fiscal eletrônica visível + política de troca clara + parcelamento 12x = resolve a DOR DE AUTENTICIDADE que perfume importado tem. Cliente que vai gastar R$800 num Bad Boy não compra de Insta sem CNPJ — mas compra de Shopify com selo institucional. Mesma loja, alcance nacional. Ticket R$500-1.500 paga Shopify com 1-2 vendas.',
    objecao: '"Já tenho clientela fiel no shopping, vendo bem" — operação física consolidada.',
    resposta_objecao: 'Faz sentido — clientela fiel do Capim Dourado é tua base. Shopify não mexe nela. Mas pensa: tu é a ÚNICA perfumaria importada de luxo no shopping. Em Palmas inteira, em Tocantins, em todo o entorno. Quem em Goiânia, Brasília, Imperatriz quer comprar Bad Boy ORIGINAL e desconfia de marketplace — esse cliente hoje vai pra Sephora ou Beleza na Web. Shopify com selo "Perfumaria autorizada" pega exatamente esse cliente. 1 venda de R$800 paga 1/3 do investimento. Topa eu te mostrar 1 perfumaria que fez essa transição?',
    nota_interna: 'TICKET ALTÍSSIMO = ROI rápido. Único do nicho em Palmas + entorno = oceano azul. Telefone não veio no JSON (linktr.ee/PerfumariaLessence) — pegar do link tree antes de disparar. Pitch da CALL DE ALINHAMENTO é crítico: pode argumentar Premium (R$1.297+) pelo branding luxo + integração com NF-e + selo de autenticidade. Confirmar antes na call quem é dono(a) — perfume importado tem decisor único geralmente.',
    abertura: `Ei, passei pelo perfil agora

Vocês são a única perfumaria importada de luxo do Capim Dourado em Palmas — diferenciação rara, ninguém mais oferece
Cliente que mora em Goiânia, Imperatriz, Brasília e quer importado ORIGINAL — esse hoje vai pra Sephora ou Beleza na Web
Deixa eu te perguntar: vocês sentem que muito cliente de fora some no caminho de não ter site profissional?`,
    followup_d3: `Ei, voltei aqui rapidinho — uma coisa que vejo em perfumaria importada
Cliente que vai gastar R$800 num importado não compra de Insta sem CNPJ — pesquisa NF-e e selo de autenticidade. Tá acontecendo aí?`,
    followup_d7: `Tô parando por aqui pra não encher
Minha porta fica aberta quando fizer sentido`,
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
    posicao_no_tier: 2,
    dor: 'Verônica é o CASE-CLONE EXATO da Erlane (EV Suplementos Injetáveis): enfermeira esteta autônoma (sufixo .enf indica COREN), habilitada em Ozonioterapia, atende suplementação injetável + soroterapia + ozonioterapia + Coenzima Q10 + B12 em Palmas-TO. 1.315 seguidores no sweet spot, 137 posts, último há 18 dias. Operação inteira gira no DM/wa.me — quem vai pagar R$200-400 numa sessão de injetável quer ver site profissional com protocolos, antes/depois, biografia técnica e agendamento estruturado, não link tree.',
    gancho: 'PITCH ESPELHO da Erlane: "Verônica, vi tua operação e ela é praticamente idêntica à da Erlane Vieira (@evsuplementosinjetaveis). Mesmo serviço-âncora (suplementação injetável + soroterapia), mesma identidade visual, mesmo gargalo wa.me. Ela construiu uma LP profissional — evsuplementosinjetaveis.com — que parou de depender só do DM e capturou paciente novo do Google. Posso te mostrar o que mudou na operação dela?". Case real ESPECÍFICO + persona-clone = pitch zero genérico.',
    objecao: '"Meu paciente vem por indicação, não preciso de site" — clássico de profissional autônoma de saúde.',
    resposta_objecao: 'Faz total sentido — paciente de injetável vem MUITO por indicação, é como o nicho funciona. Mas pensa: a paciente que ouviu falar de ti pela amiga e vai pesquisar "Verônica Lima enfermeira Palmas" antes de marcar — ela hoje cai no teu Insta. Vê 1.315 seguidores, posts misturados, link wa.me sem contexto. Comparar com a Erlane: paciente cai numa LP profissional com biografia, lista de protocolos, antes/depois categorizado, formulário de pré-anamnese. Mesma indicação, conversão diferente. Topa eu te mostrar a diferença em 1 print?',
    nota_interna: 'CASE-CLONE da Erlane (EV Suplementos Injetáveis) = pitch de venda mais forte do batch CIC. **REFORÇADO no batch CIC #7**: Verônica é REPLICA 1:1 da Erlane — mesma cidade (Palmas), mesma profissão paramédica (enfermeira esteta), mesmo serviço (suplementação injetável + soroterapia + ozônio), mesmo canal (wa.me sem site). Erlane vira PROVA SOCIAL LITERAL LOCAL (raríssimo em prospecção de cidade média — case da MESMA cidade, não exemplo distante). **AÇÃO ESPECIAL**: pedir permissão da Erlane antes de disparar pra usar nome dela explicitamente + checar se ela conhece Verônica pessoalmente (em Palmas, indicação cruzada da própria persona-mãe é o atalho de fechamento mais rápido). Telefone NÃO veio direto (wa.me/message/R3QWJIHAGS6CF1) — abrir o link wa.me, capturar número e validar antes de disparar. Pre-engajamento OBRIGATÓRIO via Insta D-1.',
    abertura: `Ei Verônica, passei pelo teu perfil agora

Reparei que tu atende ozonioterapia, soroterapia e injetáveis em Palmas — nicho técnico que paciente pesquisa MUITO
Paciente novo quer ver protocolo, valores, antes/depois antes de fechar — Insta não cobre isso direito
Deixa eu te perguntar: hoje quem busca esse tipo de atendimento te acha ou cai no concorrente?`,
    followup_d3: `Ei, voltei aqui rapidinho — uma coisa que vejo em estética injetável
Quem cobra R$200-400 por sessão sem site profissional perde muito cliente premium que ia gastar. Tá acontecendo isso contigo?`,
    followup_d7: `Tô parando por aqui pra não encher
Minha porta fica aberta quando fizer sentido`,
    pre_engajamento_ig: 'D-1 OBRIGATÓRIO: seguir, curtir 2-3 posts técnicos (protocolos de soroterapia, vitaminas específicas — não foto pessoal). Comentar 1 com algo do tipo "vitamina B12 injetável tem feito diferença grande nesses protocolos mesmo" ou referência ao protocolo específico. Profissional de saúde valoriza pre-engajamento técnico, não emoji elogio.',
    razao_ranking: 'CASE-CLONE EXATO da Erlane (LEAD-ÂNCORA do Prompt #3 CIC). Perfil que MAIS se aproxima do nosso case real (EV Suplementos Injetáveis): mesma profissão, mesmo serviço, mesmo gargalo wa.me, mesma identidade visual (cor coral, nome.enf). Ticket recorrente (R$200-400 sessão mensal). LP a partir de R$499 paga com 2-3 sessões. Pitch ESPELHO = zero objeção de relevância.',
  },

  1109: {
    tier: 'A',
    posicao_no_tier: 12,
    dor: 'Dra. Christiana é endocrinologista solo CRM-TO 8510 RQE 3994 com endereço explícito (Av. Teotônio Segurado Q401 Lote 01 Sala 905). Conteúdo técnico altíssima qualidade (postou há 3 dias sobre Wegovy/Rybelsus). 2.595 seg, 191 posts, autoridade médica máxima visível em bio + posts. Tem linktr.ee mas falta LP DEDICADA às canetas emagrecedoras (Mounjaro/Ozempic/Wegovy/Tirzepatida) — esse subnicho é o NICHO MAIS QUENTE em saúde estética Palmas hoje, e o paciente que pesquisa "Mounjaro Palmas TO" cai num linktr.ee genérico sem contexto.',
    gancho: 'LP dedicada às CANETAS EMAGRECEDORAS: explicação técnica de cada análogo GLP-1 (semaglutida vs tirzepatida), critérios de elegibilidade, FAQ ("preciso usar pra sempre?", "convênio cobre?", "diferença Ozempic vs Wegovy"), antes/depois categorizado, agendamento estruturado, biografia médica com CRM+RQE em destaque. Captura Google + tráfego pago do "Mounjaro Palmas". Linktr.ee continua, mas a LP vira o destino oficial pro paciente que quer protocolo, não lista de links.',
    objecao: '"Meu Insta tá indo bem, paciente já me acha" — operação ativa que sente que tá no controle.',
    resposta_objecao: 'Tu tem MUITO conteúdo técnico bom no Insta, raríssimo de ver — concordo que gera autoridade. Mas pensa: o paciente que ouviu falar de Mounjaro semana passada e abriu Google às 23h pra pesquisar "Mounjaro Palmas TO segura?" — esse cai no linktr.ee teu, vê 4 links sem hierarquia e sai pesquisando outra coisa. Hoje o linktr.ee é "tá tudo aqui", mas pra paciente novo é "qual desses é meu próximo passo?". LP dedicada vira "AQUI ESTÁ TUDO SOBRE CANETAS EMAGRECEDORAS COMIGO" — captura exatamente esse momento de pesquisa intensa.',
    nota_interna: 'NICHO MAIS QUENTE de saúde estética Palmas (canetas GLP-1). Endereço explícito + CRM+RQE + atividade alta = perfil de altíssima conversão se LP for específica e técnica. Tem linktr.ee — pegar o número via lá antes de disparar (telefone da bio (63)99426-6093 confirmado mas validar se é WhatsApp). Pitch técnico sério (não "promessa de emagrecimento") — médica não compra fluffy.',
    abertura: `Doutora, boa noite

Vi que você é endocrinologista CRM-TO 8510 com RQE — autoridade técnica visível
Mas quem pesquisa "Mounjaro Palmas" cai num linktr.ee genérico, sem contexto sobre canetas emagrecedoras
Quando chega paciente novo procurando isso, ele te acha ou perde pelo caminho?`,
    followup_d3: `Ei doutora, voltei rapidinho — uma coisa que vejo em Palmas
Endocrino com RQE perdendo paciente pra clínica genérica que paga ads de "Wegovy Palmas". Tá assim no seu caso?`,
    followup_d7: `Tô parando por aqui pra não te incomodar, doutora
Minha porta fica aberta quando fizer sentido`,
    pre_engajamento_ig: 'D-1: seguir, curtir 2 posts técnicos recentes (priorizar os de Wegovy/Rybelsus/Tirzepatida — não estilo de vida). NÃO comentar — médica recebe muito comentário genérico de paciente. Pre-warming via consumo do conteúdo, não interação. Mensagem WhatsApp já chega quente porque ela vai ver "Eduardo Barros começou a seguir você" no painel.',
    razao_ranking: 'NICHO MAIS QUENTE em saúde estética Palmas (canetas GLP-1). Autoridade máxima visível (CRM+RQE), endereço explícito, conteúdo técnico ativo, 191 posts. Tem linktr.ee = sinaliza que reconhece necessidade de "lugar único" mas usa solução amadora. Upgrade pra LP profissional = pitch claro de evolução, não criação. Ticket alto recorrente (consulta R$300-500 + acompanhamento mensal). LP a partir de R$499.',
  },

  1110: {
    tier: 'A',
    posicao_no_tier: 21,
    dor: 'Dra. Thais é endocrinologista hiperativa: 358 posts, postou ONTEM (Tirzepatida + musculação), CRM-TO 4746 + RQE 2691 + RQE 3067 (especialização dupla), atende Porto Nacional + Palmas. JÁ TEM contate.me/thaismahassem mas é LP GENÉRICA (linktr.ee renomeado, sem identidade médica nem foco de serviço). Volume de conteúdo + autoridade dupla + operação cross-cidade = perfil que precisa de LP estruturada PRA SE DIFERENCIAR — endocrinologista padrão tem linktr.ee, ela precisa de diferencial digital tão técnico quanto o conteúdo dela.',
    gancho: 'LP UPGRADE — não criação. Pitch é "tu já tem contate.me, ele cumpre função básica mas não converte como o conteúdo merece. Eu monto LP profissional dedicada com biografia médica completa, lista de serviços categorizada (emagrecimento Mounjaro / menopausa / reposição hormonal), antes/depois com cuidado ético, agendamento integrado, integração WhatsApp Business, 3 artigos SEO sobre Tirzepatida pra rankear no Google". Mantém o contate.me (não desligar) e posiciona LP como página principal.',
    objecao: '"Já tenho contate.me, tá funcionando" — operação ativa defendendo solução existente.',
    resposta_objecao: 'Faz total sentido — contate.me cumpre o básico (link bio + cards de contato). Mas teu CONTEÚDO médico é técnico, ativo (postou ontem!), e teu posicionamento é endocrino com Tirzepatida + reposição hormonal. Cliente novo que vê teu post sobre Mounjaro chega no contate.me e vê só "AGENDAR" sem contexto. LP profissional pega esse momento e converte: explicação do serviço, biografia médica com CRM+RQE em destaque, FAQ por procedimento, formulário de pré-anamnese pra qualificar paciente antes da consulta. Mesma porta, conversão diferente. Topa ver?',
    nota_interna: 'JÁ TEM contate.me — pitch é UPGRADE, não criação (não soar "cria do zero"). Atende Palmas + Porto Nacional, então LP precisa de geo-segmentação clara (qual paciente atendido onde). Telefones que vieram no JSON CIC são FIXOS ((63)33631333, (63)32286093) — pegar celular WhatsApp via contate.me/thaismahassem antes de disparar.',
    abertura: `Doutora, boa noite

Vi que você é endocrinologista CRM-TO 4746 com RQE dupla, postou ontem sobre Tirzepatida — autoridade técnica visível
O link da bio (contate.me) é genérico — paciente que pesquisa "Tirzepatida Palmas" cai num "AGENDAR" sem contexto
Hoje ele decide marcar com você ou continua pesquisando outra opção?`,
    followup_d3: `Ei doutora, voltei rapidinho — uma coisa que vejo em endocrino com conteúdo técnico ativo
Contate.me cumpre o básico, mas não converte como o conteúdo merece. Faz sentido pra você?`,
    followup_d7: `Tô parando por aqui pra não te incomodar, doutora
Minha porta fica aberta quando fizer sentido`,
    pre_engajamento_ig: 'D-1: seguir, curtir 2 posts técnicos recentes (Tirzepatida, reposição hormonal — não foto pessoal). NÃO comentar (médica hiperativa recebe muitos comentários genéricos, queima). Pre-warming via consumo do conteúdo.',
    razao_ranking: 'OPERAÇÃO HIPERATIVA com autoridade dupla (RQE 2691 + RQE 3067) e cross-cidade. Já tem contate.me = reconheceu necessidade de hub digital. UPGRADE pra LP profissional dedicada vira pitch de evolução, não criação. NICHO QUENTE (endocrino + Tirzepatida + reposição). LP a partir de R$499.',
  },

  1111: {
    tier: 'A',
    posicao_no_tier: 42,
    dor: 'Dra. Mariella é médica nutróloga ativa em DUAS CIDADES (Palmas-TO no Health Plennus + Goiânia-GO no Núcleo Dr. Paulo Fernando). 5.518 seguidores, 122 posts, último há 5 dias. Operação dividida entre cidades = paciente confuso "ela atende em Palmas mesmo? Em qual dia? Como agendar?". Linktr.ee funciona como "tá tudo aqui" mas DILUI o público de Palmas com o de Goiânia. Quem mora em Palmas e pesquisa "nutrólogo emagrecimento Palmas" cai numa página que mistura agenda das duas cidades.',
    gancho: 'LP GEO-SEGMENTADA Palmas. Página dedicada ao público palmense com endereço Health Plennus em destaque, dias de atendimento Palmas explícitos, agendamento direto, biografia médica + CRM, FAQ específico de Palmas (convênios locais, integrações com clínicas parceiras). Goiânia continua via linktr.ee ou LP separada futura. Cliente palmense vira o foco — não compete com agenda Goiânia pela atenção.',
    objecao: '"Meu linktr.ee tem tudo, paciente vê e agenda" — solução genérica funcional.',
    resposta_objecao: 'Faz sentido — linktr.ee centraliza tudo, e é prático. Mas pensa pelo lado da paciente palmense: ela pesquisa "nutrólogo Palmas emagrecimento", chega no linktr.ee teu e vê 5 links — agenda Palmas, agenda Goiânia, Insta, WhatsApp, blog. Ela tem que adivinhar qual é dela. LP geo-segmentada Palmas vira "AQUI É O TEU LUGAR SE TU ESTÁ EM PALMAS" — endereço Health Plennus em destaque, dias de atendimento, formulário pré-anamnese. Goiânia continua intacta no linktr.ee. Mesma operação, conversão melhor pro público de Palmas.',
    nota_interna: 'CRM NÃO FOI VALIDADO no scrape CIC (campo null por rigor). Pre-checar manualmente o perfil antes de disparar — confirmar registro médico explícito. Telefone via linktr.ee/mariellazanchett — pegar celular WhatsApp Palmas antes de disparar. Ângulo geo-segmentação é o diferencial: ela JÁ tem solução, pitch é OTIMIZAÇÃO PARA PALMAS, não criação do zero.',
    abertura: `Doutora, boa noite

Vi que você é nutróloga atendendo Palmas + Goiânia — operação cross-cidade rara
O linktr.ee mistura as duas agendas — paciente palmense que pesquisa "nutróloga Palmas" tem que adivinhar qual link é dele
Hoje ele consegue agendar direto, ou se perde no meio?`,
    followup_d3: `Ei doutora, voltei rapidinho — uma coisa que vejo em médico cross-cidade
Paciente decide por geografia — quando os 2 hubs misturam, perde paciente local. Faz sentido pra você?`,
    followup_d7: `Tô parando por aqui pra não te incomodar, doutora
Minha porta fica aberta quando fizer sentido`,
    pre_engajamento_ig: 'D-1: seguir, curtir 2 posts técnicos (saúde hormonal feminina, emagrecimento metabólico — priorizar conteúdo Palmas se conseguir identificar). NÃO comentar (médica recebe muitos genéricos).',
    razao_ranking: 'DOR DE GEO-SEGMENTAÇÃO clara (atende 2 cidades com 1 hub digital). Pitch de OTIMIZAÇÃO PARA PALMAS, não criação. Médica nutróloga = nicho com paciente que pesquisa muito. LP Palmas-only captura busca local sem disputa Goiânia. LP a partir de R$499. CRM não validado no scrape — pre-checar.',
  },

  // ── TIER A (CIC #4 — 25/04 multi-canal validação cruzada) — 2 leads ──
  // Batch #4 falhou em volume (Capim Dourado/ML bloqueados, Shopee infértil)
  // mas gerou validação cruzada Google Business + insights sobre site atual.
  // Mobiliare upgrade (já tem .com.br) + Owen com perfil TikTok ativo.

  1107: {
    tier: 'A',
    posicao_no_tier: 33,
    dor: 'Mobiliare Móveis tem 14 anos no mercado, móveis design autoral (mesa madeira maciça, ticket R$1.500-15.000 por peça), 10.300 seguidores no Insta, 335 posts editorial, fotos sofisticadas. ENDEREÇO confirmado: 104 Sul Rua SE 5 Lote 37 Palmas-TO. INSIGHT CRÍTICO descoberto no batch CIC #4: ELA JÁ TEM DOMÍNIO PRÓPRIO — `mobiliaremoveis.com.br`. MAS o site é APENAS LP INSTITUCIONAL (apresentação + contato) — NÃO é e-commerce. Operação inteira de venda continua via DM ("chame no direct"). Cliente que vai gastar R$8.000 numa mesa sob medida visita o site, vê foto + telefone, mas não tem orçamento online, não tem catálogo navegável, não tem pedido formalizado. Funil quebra exatamente onde mais dói (ticket alto).',
    gancho: 'PITCH UPGRADE — não criação. Aproveita o domínio que ela JÁ tem (mobiliaremoveis.com.br) e transforma a LP institucional em e-commerce/orçamento online. Catálogo navegável por categoria (sala, jantar, quarto, escritório), filtro por estilo, sistema de orçamento online (pré-cotação automática + cliente fornece medidas + envio pra ela formalizar), galeria de cases com cliente real, integração WhatsApp Business. Mantém a estética editorial atual, só adiciona o canal de conversão. Mesma marca, conversão 5-10x.',
    objecao: '"Móveis sob medida não vende online — cliente precisa ver, tocar, conversar antes" — defesa do modelo consultivo.',
    resposta_objecao: 'Concordo 100% — fechamento de mesa de R$8k não é compra de impulso, cliente precisa de conversa. Mas pensa o que acontece HOJE: cliente vê foto teu no Insta, clica no link da bio, cai no mobiliaremoveis.com.br, vê apresentação institucional bonita, e... tem que mandar DM pra perguntar preço. 60% desistem nesse momento. O que eu monto NÃO é "Magalu de móvel" — é UPGRADE da tua LP atual com sistema de pré-orçamento online: cliente entra, escolhe categoria, fornece medidas, vê faixa estimada, ABRE conversa contigo via WhatsApp já qualificada. Mesmo modelo consultivo, mas com cliente chegando pré-aquecido em vez de frio. Topa eu te mostrar como ficaria?',
    nota_interna: 'INSIGHT NOVO do batch CIC #4: TEM DOMÍNIO mobiliaremoveis.com.br mas é LP institucional, NÃO e-commerce. Pitch é UPGRADE explícito (não criar do zero) — argumento muito mais forte e barato pra ela aceitar (não tá começando, tá evoluindo). Pre-engajamento Insta D-1 obrigatório. Telefone não veio direto no JSON CIC — pegar via Insta DM ou Google Business antes de disparar. Pitch "complexo" provável (catálogo de móveis sob medida + sistema orçamento online), valor R$899-1.199 na call.',
    abertura: `Boa noite

Reparei que vocês têm 14 anos de móveis autorais e domínio mobiliaremoveis.com.br — base de marca rara
Mas o site é só apresentação — cliente que vai gastar R$8.000 numa mesa não vê catálogo, orçamento online, faixa de valor
Deixa eu te perguntar: quanto desse cliente premium some no "ah, vou ter que conversar antes"?`,
    followup_d3: `Ei, voltei aqui rapidinho — uma coisa que vejo em móveis sob medida
Ticket alto exige cliente chegar qualificado — site institucional não filtra e DM trava no preço. Tá acontecendo aí?`,
    followup_d7: `Tô parando por aqui pra não encher
Minha porta fica aberta quando fizer sentido`,
    pre_engajamento_ig: 'D-1: seguir, curtir 2 posts editorial recentes (priorizar peças finalizadas em ambiente real, não foto de showroom). Comentar 1 com algo específico do detalhe da peça ("essa madeira maciça com pegada minimalista ficou impecável" ou referência ao processo de fabricação). Marca premium valoriza relacionamento técnico, não emoji.',
    razao_ranking: 'TICKET ALTÍSSIMO (R$1.500-15.000 por peça) + 14 anos no mercado + JÁ TEM domínio próprio (insight batch #4) = case de UPGRADE puro. Pitch mais barato de defender porque ela tá evoluindo, não começando. Pode virar Premium R$1.297-1.497 na call (catálogo grande + sistema orçamento online + integração WhatsApp Business).',
  },

  1113: {
    tier: 'A',
    posicao_no_tier: 40,
    dor: 'Owen Loja é marca masculina autoral em Palmas-TO (jeans New Slim, camisetas, conjuntos), loja física + 7.900 seguidores Insta + perfil TikTok ATIVO. Ticket R$80-250. SEM domínio próprio confirmado pelo batch CIC #4. DIFERENCIAL ÚNICO entre os leads do banco: ela TEM PRESENÇA TIKTOK ativa — quase nenhum lead nosso tem isso. Hoje Insta + TikTok = 2 canais separados, cada um com público diferente, e a venda em ambos cai num gargalo de DM/wa.me. Se Owen entrasse na onda de TikTok Shop (loja integrada nativa do TikTok, lançada 2024 no Brasil), o público que assiste live tinha checkout direto sem sair do app.',
    gancho: 'Pitch DUPLO: (a) Shopify pega o catálogo (jeans, conjuntos, camisetas), monta vitrine masculina com filtro por estilo, parcelamento 12x, motoboy Palmas + Correios Brasil; (b) INTEGRAÇÃO TIKTOK SHOP com Shopify — produtos do Shopify aparecem direto nos posts/lives TikTok com botão de compra nativo. Cliente assiste live, clica, compra sem sair do TikTok. ÚNICO LEAD do banco com esse ângulo natural — moda masculina jovem é o nicho ideal pra TikTok Shop.',
    objecao: '"TikTok eu uso pra divulgar, não pra vender — venda fecha no DM mesmo" — visão tradicional do funil.',
    resposta_objecao: 'Faz sentido com o TikTok atual — sem checkout nativo, divulgação termina em DM mesmo. Mas o TikTok Shop mudou isso desde 2024: agora é loja integrada DENTRO do app. Cliente que viu o jeans New Slim no teu post, clica em "Ver produto", paga no checkout do TikTok, recebe rastreio — tudo sem sair do app. Funciona como Shopify mas com porta direta no TikTok. Tu já tem o conteúdo TikTok pronto (poucos lojistas em Palmas têm) — falta só o canal de venda integrado. Tu poderia ser uma das primeiras de Palmas usando isso. Topa eu te mostrar caso real de loja masculina que dobrou venda em 90 dias com Shopify+TikTok Shop?',
    nota_interna: 'ÚNICO LEAD do banco com perfil TikTok ATIVO (validado batch #4). Diferencial pesado pra abordagem — todos os outros leads são pitch genérico Shopify, esse é Shopify + TikTok Shop integration. Telefone NÃO veio no scrape (sem .com.br, sem link tree visível) — pegar via DM Insta antes de disparar. Pre-engajamento OBRIGATÓRIO via Insta + dar uma olhada no TikTok dela pra entender ritmo do conteúdo. Pitch "complexo" pelo TikTok Shop integration — provável R$899-1.199 na call.',
    abertura: `Ei, passei pelo perfil de vocês agora

Reparei que vocês têm presença ativa em Insta E TikTok — único de moda masculina em Palmas que vi com isso, ativo raro
Mas tanto Insta quanto TikTok terminam num wa.me — cliente que assiste live tem que mandar DM pra fechar
Deixa eu te perguntar: quanto cliente da live some no caminho da DM?`,
    followup_d3: `Ei, voltei aqui rapidinho — uma coisa que vejo em moda masculina jovem
Vocês já têm o ativo mais raro (conteúdo TikTok ativo) — só falta canal de venda integrado. Tá rolando esse buraco?`,
    followup_d7: `Tô parando por aqui pra não encher
Minha porta fica aberta quando fizer sentido`,
    pre_engajamento_ig: 'D-1: seguir, curtir 2 posts no Insta E ESPIAR o TikTok dela (ver ritmo de conteúdo, tipo de produto que mais aparece, voz da marca). Comentar 1 post Insta com algo específico do produto ("esse jeans New Slim ficou impecável" ou referência ao caimento). Marca masculina jovem valoriza tom direto, sem fluffy.',
    razao_ranking: 'ÚNICO lead do banco com PERFIL TIKTOK ATIVO (validado batch #4). Diferencial pesado — Shopify + TikTok Shop integration é pitch que ninguém mais oferece em Palmas. Marca masculina autoral + presença dupla canal social + ticket médio = case ideal de e-commerce com canal social integrado. Provável Premium na call.',
  },

  // ── TIER A (CIC #5 — 26/04 caça LP multi-fonte calibrada) — 5 leads ──
  // Batch #5 com lições acumuladas dos 4 anteriores. Multi-fonte
  // (Maps + Google search + Insta) varrida em 7 nichos. 5 análises pros
  // top com case-clone direto (3 Tier S + 2 Tier A com match forte).

  1118: {
    tier: 'A',
    posicao_no_tier: 4,
    dor: 'Dra. Monnaliza Cabral é dentista solo CRO TO 1727 com Instagram VERIFIED azul (raríssimo em Palmas — sinal de operação consolidada de verdade), Maps 5.0/33, endereço Q. 1006 Sul Alameda 16 Lote 01 Sala 8, ATIVÍSSIMA (post há 3 dias). Catálogo de 6 serviços (facetas, harmonização facial, etc) com TICKET ALTO (faceta R$1.000+/dente, harmonização R$3.000+, consultas R$200-400). MAS: ZERO domínio próprio, ZERO link na bio Insta — agendamento 100% via direct. Pinned post "Agenda aberta" lista os serviços + telefone direto, sem link de marcação. DOR DM ABSOLUTA num nicho onde paciente pesquisa MUITO antes de fechar (faceta + harmonização = decisão estética séria).',
    gancho: 'ARGUMENTO ESTRUTURAL — dentista solo verified com 5★/33 Maps + ZERO web é exatamente o perfil que paciente busca pra harmonização premium e não acha. LP profissional resolve: biografia + CRO em destaque + 6 serviços catalogados com FAQ ("quanto custa faceta?", "harmonização dura quanto?") + galeria antes/depois (com cuidado ético dental) + agendamento integrado + 3 artigos SEO ("faceta de porcelana em Palmas", "harmonização facial CRO-TO segura"). Conta verificada Insta + 5★/33 Maps + LP profissional = autoridade triplicada. Cliente que vai gastar R$3-5k em harmonização pesquisa MUITO; quem aparecer com LP profissional fica com a venda. PROPOSTA OPCIONAL: Monnaliza pode virar PRIMEIRO CASE DENTAL da Impulso (R$200 desconto pra fechar mais rápido + virar prova social pra próximos dentistas).',
    objecao: '"Já tenho fluxo no consultório, paciente vem por indicação" — dentista solo consolidada defendendo o status quo.',
    resposta_objecao: 'Faz total sentido — 33 reviews 5★ + Insta verified mostra que o boca-a-boca funciona. Mas pensa pelo lado da paciente NOVA que ouviu falar de ti pela amiga e vai pesquisar "Dra. Monnaliza Cabral facetas Palmas" antes de marcar (decisão estética é assim — paciente pesquisa MUITO). Ela cai no teu Insta, vê 6 serviços no pinned post, mas tem que mandar DM pra perguntar preço, prazo, processo. 60% desistem aí mesmo. LP profissional pega esse momento: catálogo de procedimentos com FAQ de preço, antes/depois ético, agendamento integrado. Mesma indicação, paciente chegando QUALIFICADA. Topa eu te mostrar 1 caso de dentista solo que fez essa transição?',
    nota_interna: 'AINDA NÃO TEMOS case dental fechado — argumento é estrutural (autoridade construída + ZERO web profissional = combinação que converte). Monnaliza tem perfil ideal pra virar PRIMEIRO CASE DENTAL da Impulso (proposta showcase R$200 desconto). Insta VERIFIED azul = sinal de operação consolidada (raro em Palmas). Telefone (63)99258-6520 confirmado pinned post. Pre-engajamento OBRIGATÓRIO via Insta D-1 (curtir 2 posts de procedimento, NÃO comentar). Pitch "complexo" provável R$899-1.297 na call.',
    abertura: `Doutora, boa noite

Vi que você trabalha com faceta e harmonização aí em Palmas com Insta verified — operação consolidada
A bio do Insta não tem link nenhum — todo agendamento passa pelo direct
Paciente que pesquisa "faceta Palmas" no Google chega em você ou no concorrente?`,
    followup_d3: `Ei doutora, voltei rapidinho — uma coisa que vejo em odonto premium
Faceta de R$1k+ exige paciente confiando ANTES de marcar — site organiza essa confiança. Faz sentido pra você?`,
    followup_d7: `Tô parando por aqui pra não te incomodar, doutora
Minha porta fica aberta quando fizer sentido`,
    pre_engajamento_ig: 'D-1 OBRIGATÓRIO: seguir, curtir 2 posts dos últimos 7 dias (priorizar procedimentos finalizados, NÃO foto pessoal). NÃO comentar — Insta verified recebe MUITOS comentários genéricos, queima rápido. Pre-warming via consumo do conteúdo. Mensagem WhatsApp já chega quente porque ela vê "Eduardo Barros começou a seguir você" no painel.',
    razao_ranking: 'TIER S puríssimo (score 9). Argumento estrutural — autoridade construída + ZERO web profissional. Insta verified + 5★/33 + ZERO web + ZERO link bio = perfil ideal pra LP profissional. Ticket altíssimo (facetas+harmonização R$1k-3k+) = LP a partir de R$499 paga com 1 procedimento. Provável pitch "complexo" (R$899-1.297) na call.',
  },

  1119: {
    tier: 'A',
    posicao_no_tier: 9,
    dor: 'Dr. Ricardo Linares é cirurgião-dentista solo, conta Insta verified, 8.4k seguidores, Maps 4.9/66, endereço 1106 sul av lo 27 lote 25 sala 3. CASO EXTREMO de DOR DM: o "Site" listado no Google Maps NÃO é um site — é um link literal pra api.whatsapp.com/send (cliente clica em "Site" no Maps e vai direto pro WhatsApp dele). É a ferramenta mais primitiva de captação possível, mas funciona porque ele tem reputação Maps de 4.9/66. Feed Insta inativo 11 sem MAS Maps com reviews recentes = paciente continua chegando via boca-a-boca + Maps, sem canal digital próprio captando o paciente NOVO que pesquisa "cirurgião dentista Palmas" antes de agendar.',
    gancho: 'LP profissional vira o destino oficial pra paciente novo que pesquisa cirurgião-dentista em Palmas. Biografia + procedimentos catalogados (cirurgia, implante, exodontia complexa, etc) + galeria de casos com cuidado ético + depoimentos + FAQ ("quanto custa implante?", "tempo de recuperação cirurgia?", "quem cobre plano?") + agendamento integrado. Substitui o "wa.me como Site" do Maps por LP institucional sem desligar o WhatsApp. Mesma operação, captura paciente novo que hoje some no caminho.',
    objecao: '"Tô bem com o que tenho, paciente continua chegando" — defesa do que funciona.',
    resposta_objecao: 'Concordo — 4.9/66 é reputação que poucas clínicas em Palmas têm. O que funciona não vai mexer. Mas pensa: o paciente que vai pagar R$5-8k num implante PESQUISA antes de marcar — compara 4-5 cirurgiões. Hoje, quando ele clica em "Site" do teu Maps e cai direto no WhatsApp, sem ver biografia, sem ver caso similar, sem ver depoimento... ele recua. "Vou pesquisar mais", e some. LP profissional pega esse momento: ele clica em Site, vê tua biografia + casos + FAQ de preço + agendamento. Mesmo paciente, conversão diferente. Topa eu te mostrar como ficaria?',
    nota_interna: 'Argumento estrutural — médico/dentista solo com autoridade construída + ZERO web profissional. Conta verified + 4.9/66 = autoridade alta apesar do feed Insta inativo. Pre-engajamento via Insta vai ser fraco (feed inativo) — focar em pre-warming via Google Maps (não tem como, mas curtir posts antigos do Insta funciona pra notificar ele). Telefone (63)99211-4547 confirmado wa.me direto. Pitch "complexo" provável (catálogo cirúrgico + galeria casos + agendamento), R$899-1.297.',
    abertura: `Doutor, boa noite

Vi que você tem 4.9 com 66 avaliações no Google e Insta verified — autoridade construída
Reparei que o "Site" no seu Google Maps é um link direto pro WhatsApp — paciente que pesquisa "dentista Palmas" cai num chat sem contexto, sem prova, sem agenda
Isso ainda funciona, ou tá filtrando paciente cedo?`,
    followup_d3: `Ei doutor, voltei rapidinho — uma coisa que vejo aqui em Palmas
Quem tem Maps 4.9 e site acaba ficando na frente de quem tem só WhatsApp. Tá assim com você hoje?`,
    followup_d7: `Tô parando por aqui pra não te incomodar, doutor
Minha porta fica aberta quando fizer sentido`,
    pre_engajamento_ig: 'D-1: seguir, curtir 2 posts antigos (feed Insta inativo desde 6 fev — não tem material recente). Pre-warming fraco via Insta — abordagem WhatsApp tem que ser ainda mais forte. NÃO comentar (verified recebe muito genérico).',
    razao_ranking: 'TIER S (score 9). Argumento estrutural autoridade médica. Cirurgião-dentista verified + 4.9/66 = autoridade máxima. "Site" do Maps = wa.me direto = caso EXTREMO de DOR DM (raro). Ticket altíssimo (cirurgia/implante R$5-8k) justifica LP a partir de R$499 facilmente. Pitch "complexo" R$899-1.297.',
  },

  1115: {
    tier: 'A',
    posicao_no_tier: 17,
    dor: 'Pedro Maciel é nutricionista esportivo solo CRN 27994, ATIVÍSSIMO no Insta (post há 1 dia), Maps 5.0/10 (poucas mas todas positivas), endereço 204 Sul Alameda Jandaia Lote 27. Pós-graduando em ESPORTIVA + CLÍNICA + LIPEDEMA — lipedema é nicho ESCASSO em Palmas (paciente pesquisa muito, encontra pouco). ZERO domínio próprio, "Site" do Maps aponta pro próprio Insta, bio com wa.me/+5563992314603. DOR DM CLÁSSICA + nicho de especialização raro = receita escapando porque cliente não acha quem trata lipedema na cidade.',
    gancho: 'Pitch DUPLO: (a) LP profissional padrão (biografia + CRN + serviços + agendamento), MAS (b) com PÁGINA DEDICADA AO LIPEDEMA — porque é o nicho onde ele tem diferenciação real e onde ranquear no Google "nutricionista lipedema Palmas" vira destino único. Cliente de lipedema gasta MUITO tempo pesquisando, e quem aparece com LP técnica explicando "o que é lipedema, como funciona o protocolo nutricional, fases do tratamento, quanto custa" fica com TODO o nicho regional. Match exato com EV Suplementos (profissional saúde habilitado + sessão recorrente + nicho premium).',
    objecao: '"Já vendo bem pelo Insta, post há 1 dia, atendo cheio" — operação ativa defendendo o que funciona.',
    resposta_objecao: 'Concordo — atividade Insta de 1 dia + 5★ no Maps mostra operação que funciona. O Insta capta quem JÁ te segue. Mas o paciente NOVO de lipedema que ouviu falar do diagnóstico semana passada e pesquisa "nutricionista lipedema Palmas" no Google às 23h — esse cai em nutri esportivo geral que não trata lipedema. Tu tem o conhecimento técnico (pós-graduando) + a especialização rara, falta o canal. LP com página dedicada ao lipedema vira destino único pra essa busca em todo Tocantins. Topa eu te mostrar caso de nutri que fez isso e dominou um nicho?',
    nota_interna: 'NICHO LIPEDEMA é ESCASSO em Palmas — diferenciação ENORME pra ranquear. CASE-CLONE da EV Suplementos (mesmo perfil de profissional saúde habilitado com sessão recorrente). ATIVÍSSIMO Insta (post há 1 dia) facilita pre-engajamento. Telefone (63)99231-4603 confirmado bio. Pitch "complexo" (LP padrão + página dedicada lipedema com FAQ técnico + 3 artigos SEO sobre lipedema), R$899-1.197.',
    abertura: `Boa noite, Pedro

Vi que tu atende lipedema em Palmas — nicho raro
Paciente pesquisa MUITO antes de marcar e tem pouca opção qualificada na cidade
Quem busca "nutricionista lipedema Palmas" hoje te acha ou cai em quem só faz dieta?`,
    followup_d3: `Ei Pedro, voltei rapidinho — uma coisa que vejo em nutri de nicho
Especialização específica (esportivo, lipedema) precisa de SEO local pra capturar busca. Tu já reparou que tá perdendo paciente nesse caminho?`,
    followup_d7: `Tô parando por aqui pra não te incomodar
Minha porta fica aberta quando fizer sentido`,
    pre_engajamento_ig: 'D-1: seguir, curtir 2 posts técnicos recentes (priorizar conteúdo de lipedema OU esportiva — não foto pessoal). Comentar 1 com algo específico técnico ("conteúdo sobre lipedema é raro de ver com esse rigor mesmo" ou referência ao caso clínico mostrado). Profissional saúde valoriza pre-engajamento técnico.',
    razao_ranking: 'TIER S (score 8.5). CASE-CLONE EV Suplementos. Nicho LIPEDEMA = diferenciação rara e premium. ATIVÍSSIMO Insta (vai responder DM). Ticket recorrente (consulta R$300-500 + retornos R$150-200). LP com página dedicada lipedema = pitch complexo R$899-1.197 (vale o aumento — ele vai dominar nicho regional).',
  },

  1114: {
    tier: 'A',
    posicao_no_tier: 41,
    dor: 'Marina Clara Borges é psicóloga solo CRP 23/1936, 7.100 seguidores, 332 posts, ativa há 18 dias. Endereço explícito (501 sul Av. Teotônio Segurado, Edifício Amazônia Center 3° andar, em frente ao Fórum). Maps 5.0/15. Diferencial PESADO: PODCASTER do "Duas no Divã" + Psicóloga na Junta Médica TO = autoridade construída acima da média do nicho. MAS: tem `marinaclarapsi-kb7vfrf.gamma.site` — gamma.site é ferramenta amadora de geração de página (similar a Linktr.ee mas com cara de site). O site existe mas não é profissional, sem CTA estruturado, sem agendamento integrado, sem captura de lead.',
    gancho: 'PITCH UPGRADE de gamma.site pra LP profissional. Aproveita autoridade que ela JÁ tem (podcast + Junta Médica TO + 7.1k seg + 5★ Maps) e monta LP com biografia profissional + CRP em destaque + áreas de atuação (psicanálise, terapia) + FAQ ("primeira sessão", "atende online?", "quanto dura tratamento?") + integração com podcast (link episódios pra prova social) + agendamento profissional. Argumento estrutural — autoridade construída via podcast + Junta Médica TO precisa de vitrine adequada, gamma.site amador queima a marca pessoal.',
    objecao: '"Já tenho o gamma.site, funciona pro que preciso" — defesa da solução amadora atual.',
    resposta_objecao: 'Faz sentido — gamma.site cumpre o básico (link bio com mais informação que linktr.ee). Mas pensa pelo lado da paciente nova que vai pesquisar "Marina Clara Borges psicóloga Palmas" antes de marcar primeira sessão (decisão emocional, ela pesquisa MUITO). Cai no gamma.site, vê layout genérico, sem teu rosto profissional em destaque, sem CRP visível, sem episódios do podcast linkados como prova social. LP profissional muda isso: tua marca pessoal (que tu construiu com podcast + Junta Médica) ganha vitrine adequada. Topa ver como ficaria?',
    nota_interna: 'AUTORIDADE CONSTRUÍDA ALTA (podcast + Junta Médica) — pitch é UPGRADE da solução gamma.site, não criação. Telefone (63)99245-0641 confirmado Maps. Pre-engajamento Insta D-1 obrigatório (curtir 1-2 posts do podcast OU psicanálise). Pitch padrão R$499 ou complexo R$799-899 (integração podcast pra prova social + biografia profissional).',
    abertura: `Doutora, boa noite

Vi que você tem podcast "Duas no Divã" + Junta Médica TO + 7k seguidores + 5★ no Maps — autoridade construída de verdade
O link da bio (gamma.site) é layout genérico — paciente nova que pesquisa antes de marcar primeira sessão não vê nada do que você construiu
Hoje ela se sente segura pra marcar, ou continua pesquisando outra opção?`,
    followup_d3: `Ei doutora, voltei rapidinho — uma coisa que vejo em psi com autoridade construída
Podcast + Junta Médica é capital que merece vitrine adequada — gamma.site não comunica isso. Faz sentido pra você?`,
    followup_d7: `Tô parando por aqui pra não te incomodar, doutora
Minha porta fica aberta quando fizer sentido`,
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
    abertura: `Boa noite, Darcianne

Vi que tu é fisio domiciliar com Pós em Gerontologia CEULP, 5★/46 reviews, 365 posts daily há 1 ano — disciplina rara
Em fisio domiciliar pra idoso, quem contrata é a FAMÍLIA — filha que vai contratar pra mãe pesquisa antes
Deixa eu te perguntar: tu sente que essa filha recua quando cai no sandwiche.me sem ver depoimentos?`,
    followup_d3: `Ei Darcianne, voltei rapidinho — uma coisa que vejo em fisio domiciliar gerontológica
Quem decide é a família, não o paciente — depoimentos de FILHOS (não idosos) é o que converte. Faz sentido pra ti?`,
    followup_d7: `Tô parando por aqui pra não encher
Minha porta fica aberta quando fizer sentido`,
    pre_engajamento_ig: 'D-1: seguir, curtir 2 posts recentes (priorizar conteúdo gerontológico técnico OU caso de paciente — daily posting tem catálogo grande pra escolher). Comentar 1 com algo específico ("trabalho domiciliar com idoso pós-AVC é nicho raro de ver com esse rigor" ou referência à patologia mostrada).',
    razao_ranking: 'TIER A score 8. CASE-CLONE EV Suplementos. Nicho B2C com decisor diferente do paciente (família) = LP com prova social específica vence. Daily posting 365 posts = disciplina sinaliza profissional sério. Pitch "complexo" R$899-1.197.',
  },

  // ── TIER A (CIC #6 — 26/04 médicos RQE + dentistas + advogados) — 5 leads ──
  // Batch RECORDE: 7 Tier S num único round (validação do filtro Tier S
  // automático aplicado no SYSTEM_PROMPT pós-market intelligence).
  // 5 análises pros Tier S com case-clone direto + maior potencial.

  1131: {
    tier: 'A',
    posicao_no_tier: 1,
    dor: 'Douglas Pimentel é o LEAD MAIS GRITANTE do pipeline inteiro: advogado solo trabalhista OAB-TO, Maps 5.0/294 reviews — número ABSURDO, é literalmente top 1 trabalhista de Palmas no Maps. ZERO domínio próprio, ZERO presença web, bio Insta só com DDD 63 99202-4803. 294 paciente satisfeito que JÁ deixou review e o próximo cliente que pesquisa "advogado trabalhista Palmas" cai num WhatsApp sem ver biografia, casos, especialidade, conformidade OAB. É OURO LOCAL não capturado — Hormozi diria "deixar dinheiro na mesa em escala industrial".',
    gancho: 'ARGUMENTO ESTRUTURAL OAB-COMPLIANT — Provimento 205/2021 PERMITE LP informativa sem preço/promessa. LP profissional vira destino oficial pra busca "advogado trabalhista Palmas" (que Douglas já domina no Maps): biografia + OAB-TO em destaque + áreas de especialidade trabalhista (rescisão, CLT, INSS) + FAQ ("como funciona 1ª consulta?", "quanto custa orientação?", "OAB permite cobrar honorários assim?") + formulário de pré-análise da causa + 3 artigos SEO ("rescisão CLT em Palmas", "como entrar com ação trabalhista TO", "verbas rescisórias Tocantins") + integração ética com OAB. 294 reviews + LP profissional = autoridade triplicada. PROPOSTA: Douglas pode virar PRIMEIRO CASE ADVOGADO da Impulso (R$200 desconto + showcase pra outros advogados Palmas).',
    objecao: '"OAB tem regra contra propaganda agressiva" — clássica do advogado preocupado com Provimento 205/2021.',
    resposta_objecao: 'Total razão — Provimento 205/2021 da OAB proíbe captação ostensiva, MAS permite (e até encoraja) LP informativa sem preço, sem promessa de resultado, sem "ganhe sua causa". O que eu monto é o oposto da propaganda agressiva: informação sóbria, áreas de atuação, biografia profissional, FAQ regulamentar, formulário de contato. É exatamente o que a Resolução prevê — presença digital regulamentar. Tem caso real disso aqui em Palmas (te mostro). 294 reviews 5★ no Maps + LP que respeita OAB = posicionamento que nenhum trabalhista da cidade tem.',
    nota_interna: 'LEAD MAIS GRITANTE DO PIPELINE INTEIRO. 294 reviews é número absurdo (mais que 90% das clínicas grandes!). Telefone (63)99202-4803 confirmado bio. Pre-engajamento Insta D-1 obrigatório (1.655 seg, intimista — comentar pode funcionar bem se for específico). Pitch tem que ser ESPECIAL — Douglas é caso showcase, vale propor ele como case real ("posso te entregar a LP e quando ficar boa, virar caso de prova social pra outros advogados de Palmas — desconto de R$200 em troca?"). Pitch "complexo" pelo conteúdo OAB-compliant, R$799-999.',
    abertura: `Doutor, boa noite

Vi que você tem 294 reviews 5★ no Google em trabalhista — número absurdo, top 1 de Palmas pra quem pesquisa
Cliente novo que vê review e quer saber mais cai num WhatsApp sem biografia, áreas, FAQ
Quando ele chega ali, ele liga em você ou continua pesquisando outros?`,
    followup_d3: `Ei doutor, voltei rapidinho — uma coisa que vejo em advogado consolidado
O Provimento 205/2021 da OAB libera LP informativa (sem preço, sem promessa) — você sabia que tinha isso?`,
    followup_d7: `Tô parando por aqui pra não te incomodar, doutor
Minha porta fica aberta quando fizer sentido`,
    pre_engajamento_ig: 'D-1 OBRIGATÓRIO: seguir, curtir 2 posts (priorizar conteúdo técnico de direito trabalhista, não foto pessoal). Comentar 1 com algo específico ("conteúdo sobre rescisão CLT é raro de ver com esse rigor mesmo" ou referência ao caso mostrado). Advogado valoriza pre-engajamento técnico — comentário "show!" queima.',
    razao_ranking: 'TIER S puríssimo (score 9). LEAD MAIS GRITANTE DO PIPELINE — 294 reviews 5★ é número absurdo (recorde do banco). Conversão LP advocacia >4% (maior do mercado nacional). Sem case-clone advogado entregue ainda — usar argumento estrutural de OAB-compliant. Pitch "complexo" R$799-999 + proposta opcional "case showcase com R$200 desconto" pra fechar mais rápido (e Douglas vira o primeiro case advogado da Impulso).',
  },

  1125: {
    tier: 'A',
    posicao_no_tier: 8,
    dor: 'Dra. Ingrid Sales é endocrinologista RQE 3062, Maps 5.0/190 reviews (número RARÍSSIMO em endocrino), 7.540 seguidores Insta, endereço Centro Clínico Sara Q.108 Sul. Atende Diabetes + Obesidade + Tireoide + Hormônios. MAS o canal de captura é literalmente um BIT.LY (`bit.ly/atendimentodraingridsales`) — 190 reviews 5★ + 7.5k seguidores + bit.ly = DESPERDÍCIO COLOSSAL. Paciente que viu post sobre Mounjaro/Ozempic clica no link da bio e cai num bit.ly genérico, sem biografia, sem FAQ, sem formulário de pré-anamnese.',
    gancho: 'LP profissional dedicada com biografia + RQE 3062 em destaque + 4 áreas (Diabetes, Obesidade c/ canetas GLP-1, Tireoide, Hormônios) + FAQ específico de cada (quanto custa consulta, plano cobre, como funciona acompanhamento canetas) + agendamento integrado + 3 artigos SEO ("Mounjaro Palmas TO", "tireoide Hashimoto", "obesidade tratamento médico"). Pega tráfego das buscas premium "endocrinologista Palmas Mounjaro". Mantém Insta + bit.ly opcional, mas LP vira destino oficial. Argumento estrutural — médica autônoma RQE com 190 reviews 5★ + canal de captura amador (bit.ly) = oportunidade clara de upgrade.',
    objecao: '"Já tenho bit.ly e o Insta, paciente acha" — defesa do operacional atual.',
    resposta_objecao: 'Faz sentido — bit.ly cumpre o básico de redirecionar pro WhatsApp. Mas pensa pelo lado da paciente NOVA com 60kg sobrando que viu teu post sobre canetas GLP-1, vai pesquisar "Dra Ingrid Sales endocrino Palmas" antes de marcar consulta de R$500. Cai no bit.ly, vê só "ABRIR WHATSAPP" sem biografia, sem FAQ de preço, sem explicação dos protocolos. 60% recua. LP profissional muda isso: ela chega no teu canal e vê biografia médica completa + RQE em destaque + áreas catalogadas + FAQ ("plano cobre?", "Wegovy vs Tirzepatida?", "tempo de acompanhamento?"). Mesma paciente, conversão diferente. Topa eu te mostrar?',
    nota_interna: 'NICHO MAIS QUENTE em saúde estética Palmas (canetas GLP-1) — Ingrid tem 190 REVIEWS 5★ que é mais que 99% dos endocrinos do Brasil. Telefone NÃO veio direto (bit.ly) — abrir o link e capturar número antes de disparar. Pre-engajamento Insta D-1 obrigatório (curtir 2 posts técnicos sobre canetas/tireoide). Pitch "complexo" provável pelo volume de conteúdo + 4 áreas, R$899-1.197 na call.',
    abertura: `Doutora, boa noite

Vi que você tem 190 reviews 5★ no Maps em endocrino — número absurdo, raríssimo no Brasil
O link da bio é bit.ly — paciente que viu post sobre Mounjaro cai num "ABRIR WHATSAPP" sem biografia, sem FAQ
Hoje ela se sente segura pra marcar consulta de R$500, ou continua pesquisando?`,
    followup_d3: `Ei doutora, voltei rapidinho — uma coisa que vejo em endocrino com volume alto
Paciente de canetas GLP-1 decide a longo prazo (R$1.200/mês de medicação) — bit.ly não converte essa pesquisa. Faz sentido pra você?`,
    followup_d7: `Tô parando por aqui pra não te incomodar, doutora
Minha porta fica aberta quando fizer sentido`,
    pre_engajamento_ig: 'D-1 OBRIGATÓRIO: seguir, curtir 2 posts técnicos recentes (priorizar canetas GLP-1, tireoide — não foto pessoal). NÃO comentar (médica recebe muito comentário genérico de paciente). Pre-warming via consumo do conteúdo.',
    razao_ranking: 'TIER S puríssimo (score 9.5). 190 reviews 5★ em endocrino = recorde absoluto do nicho em Palmas. Nicho mais quente em saúde estética Palmas (canetas GLP-1). Argumento estrutural autoridade médica. Pitch "complexo" R$899-1.197 (4 áreas + FAQ específico cada).',
  },

  1122: {
    tier: 'A',
    posicao_no_tier: 14,
    dor: 'Dra. Hollana Correa é dentista solo CRO TO 3043 com 15.900 SEGUIDORES INSTA (a maior do batch dental), Maps 5.0/67 reviews, endereço Orla 14 Graciosa. Nicho: Rejuvenescimento Facial / Harmonização Orofacial. ZERO domínio próprio — link in bio é literalmente um wa.me/message direto. 15.9k seguidores qualificados (público que segue dentista de harmonização é cliente intencional, não casual) sem captura de lead — todos voltam pro DM. Paciente que vai gastar R$3.000+ em harmonização precisa ver biografia técnica, antes/depois ético, processo, FAQ de preço — não cai direto em "olá!".',
    gancho: 'ARGUMENTO ESTRUTURAL — dentista solo com 15.9k seg qualificados em harmonização + ZERO captura = receita massiva escapando. LP de procedimentos estéticos com biografia + CRO em destaque + catálogo (rejuvenescimento facial, harmonização orofacial, lifting facial, bichectomia) + galeria antes/depois (com cuidado ético dental) + FAQ ("quanto custa harmonização?", "quanto dura?", "dói?", "tempo de recuperação?") + agendamento integrado + 3 artigos SEO ("harmonização orofacial Palmas", "rejuvenescimento facial seguro", "bichectomia indicação"). 15.9k seguidores → LP que captura → conversão dramática.',
    objecao: '"Já tenho 15k seguidores, cliente vem do Insta mesmo" — operação ativa defendendo o que funciona.',
    resposta_objecao: 'Concordo — 15.9k seguidores é AUTORIDADE construída de verdade, e o Insta capta cliente que JÁ te conhece. Mas pensa: a paciente que viu uma harmonização tua num story compartilhado por amiga e vai gastar R$3.000 na decisão estética — ela pesquisa MUITO antes de marcar. Cai no link bio (wa.me direto), vê "olá!" sem biografia, sem antes/depois categorizado, sem FAQ de preço. 60% recua nesse momento. LP profissional pega exatamente esse momento: ela chega no link bio e vê biografia + CRO + casos + FAQ. Mesma paciente, conversão diferente. Topa ver caso real?',
    nota_interna: '15.9k seguidores é o MAIOR do batch dental — autoridade Insta gigante. Telefone NÃO veio direto (wa.me/message) — abrir o link, capturar número antes de disparar. Pre-engajamento Insta D-1 obrigatório (curtir 2 procedimentos finalizados, NÃO foto pessoal). Pitch "complexo" R$899-1.197 (volume de conteúdo + galeria antes/depois ética + integração agendamento).',
    abertura: `Doutora, boa noite

Vi que você tem 15.900 seguidores no Insta — maior dentista do batch dental Palmas, autoridade gigante
O link da bio cai num wa.me direto — sem biografia, antes/depois categorizado, FAQ de preço
Paciente de harmonização (R$3k+ de decisão) recua no momento do "olá!" ou segue?`,
    followup_d3: `Ei doutora, voltei rapidinho — uma coisa que vejo em dentista de harmonização premium
Paciente compara 4-5 dentistas antes de marcar — quem tem LP profissional + galeria + FAQ fica com a venda. Faz sentido pra você?`,
    followup_d7: `Tô parando por aqui pra não te incomodar, doutora
Minha porta fica aberta quando fizer sentido`,
    pre_engajamento_ig: 'D-1 OBRIGATÓRIO: seguir, curtir 2 procedimentos finalizados (harmonização, rejuvenescimento — NÃO foto pessoal). NÃO comentar (dentista com 15k recebe muito genérico). Pre-warming via consumo do conteúdo.',
    razao_ranking: 'TIER S (score 9.5). MAIOR INSTA do batch dental (15.9k). Nicho mais quente em saúde estética + dentista solo. Argumento estrutural premium. Pitch "complexo" R$899-1.197 pelo volume de conteúdo + branding premium.',
  },

  1124: {
    tier: 'A',
    posicao_no_tier: 5,
    dor: 'Dra. Ioana Leobas é ginecologista CRM 4282 + RQE com ULTRA-NICHO técnico: Colposcopia + Tratamento HPV + Microscopia + Histeroscopia. Endereço Clínica Mater Vitta Q.602 Sul, Maps 5.0/23 reviews, 2.207 seguidores. ZERO site profissional — só wa.me + Threads. Nicho HPV/colposcopia tem busca paga ALTÍSSIMA (mulher diagnosticada com HPV faz busca desesperada por especialista). Quem aparecer com LP técnica explicando colposcopia + protocolos HPV + FAQ ("HPV tem cura?", "como é a colposcopia?", "quanto custa tratamento?") fica com TODO o nicho regional.',
    gancho: 'LP profissional ULTRA-NICHO: biografia + CRM+RQE + 4 procedimentos (colposcopia, tratamento HPV, microscopia, histeroscopia) + FAQ técnico de cada + agendamento + 3 artigos SEO premium ("colposcopia em Palmas: como é o procedimento", "HPV tratamento conservador 2026", "histeroscopia diagnóstica indicação"). Captura busca premium "colposcopia Palmas TO" que hoje não tem dono. Argumento estrutural — médica especialista solo com autoridade construída + ZERO web profissional + nicho técnico raro = combinação que converte.',
    objecao: '"Tenho clínica fixa (Mater Vitta), paciente é encaminhada" — modelo via convênio/encaminhamento.',
    resposta_objecao: 'Faz sentido — encaminhamento é canal forte de gineco especialista. Mas pensa: a paciente que recebeu diagnóstico de HPV ontem, está angustiada, vai pesquisar "tratamento HPV Palmas" no Google às 23h ANTES de aceitar encaminhamento. Hoje ela cai em ginecologista geral. Tu tem subespecialização raríssima (colposcopia + HPV + histeroscopia) que poucos médicos do Brasil tem — e o canal não comunica isso. LP técnica vira destino oficial pra busca "HPV Palmas" e captura essa paciente premium ANTES da concorrência. Topa ver?',
    nota_interna: 'ULTRA-NICHO TÉCNICO (HPV + colposcopia + histeroscopia) = busca paga premium + concorrência regional zero. Telefone Maps é fixo (63)3142-0410 — VALIDAR celular WhatsApp via Insta antes. Pre-engajamento Insta D-1 obrigatório (curtir 2 posts técnicos — gineco especialista valoriza pre-engajamento técnico, não emoji). Pitch "complexo" R$899-1.197 (conteúdo técnico HPV + FAQ específico + 3 artigos SEO premium).',
    abertura: `Doutora, boa noite

Vi que você atende colposcopia, tratamento HPV e histeroscopia em Palmas — subespecialização raríssima no Brasil
Paciente diagnosticada com HPV pesquisa "tratamento HPV Palmas" no Google às 23h, cai num wa.me sem FAQ técnico
Hoje ela te acha primeiro ou cai em ginecologista geral?`,
    followup_d3: `Ei doutora, voltei rapidinho — uma coisa que vejo em gineco especialista
SEO pra "colposcopia Palmas" + "HPV Palmas" tem concorrência regional zero — quem ranquear primeiro fica com o nicho. Faz sentido pra você?`,
    followup_d7: `Tô parando por aqui pra não te incomodar, doutora
Minha porta fica aberta quando fizer sentido`,
    pre_engajamento_ig: 'D-1 OBRIGATÓRIO: seguir, curtir 2 posts técnicos sobre HPV ou colposcopia (NÃO foto pessoal). Comentar 1 com algo específico técnico ("informação sobre colposcopia com esse rigor é raro de ver mesmo" ou referência ao protocolo). Médica especialista valoriza pre-engajamento técnico.',
    razao_ranking: 'TIER S (score 9.5). ULTRA-NICHO TÉCNICO (HPV + colposcopia + histeroscopia) = concorrência regional zero. Argumento estrutural — autoridade construída + ZERO web profissional. Busca paga premium. Pitch "complexo" R$899-1.197 (3 artigos SEO premium + FAQ técnico).',
  },

  1127: {
    tier: 'A',
    posicao_no_tier: 16,
    dor: 'Dr. Ricardo Mendonça é ortopedista cirurgião RQE 3540 e 3770 + TEOT (UFPR) com ULTRA-NICHO técnico: Cirurgia da Mão e Microcirurgia. Endereço COT Q.902 Sul, Maps 5.0/90 reviews, 2.141 seguidores Insta. INSIGHT CRÍTICO descoberto pelo CIC #6: ELE JÁ TEM DOMÍNIO PRÓPRIO (`ricardomendonca.com.br`) — MAS o subdomínio `bio.ricardomendonca.com.br` é apenas link-in-bio custom. O domínio raiz não tem site indexado. Ele JÁ INVESTIU em domínio profissional, mas parou no link-in-bio. É EXATAMENTE o perfil que migra de bio→LP em 1 conversa.',
    gancho: 'PITCH UPGRADE — não criação. "Vi que tu já investiu em ricardomendonca.com.br + bio.ricardomendonca.com.br — tu já entendeu que precisa de um lugar único online. O que falta é evoluir o link-in-bio pra LP profissional completa: biografia médica + RQE em destaque + procedimentos catalogados (cirurgia da mão, microcirurgia, lesões nervo periférico, síndrome do túnel do carpo) + galeria de casos com cuidado ético + FAQ técnico + agendamento integrado." Mesmo domínio, conversão profissional. Argumento estrutural ULTRA-NICHO técnico (microcirurgia + cirurgia da mão) + domínio dormente já comprado.',
    objecao: '"Já tenho meu site (bio.ricardomendonca.com.br), funciona" — defesa da solução amadora atual com falsa sensação de domínio próprio.',
    resposta_objecao: 'Faz total sentido — tu já passou da fase de não ter nada online, e isso é importante. Mas pensa: bio.ricardomendonca.com.br é link-in-bio custom — basicamente Linktr.ee com tua marca. O domínio raiz (ricardomendonca.com.br) não tem site indexado no Google. Paciente que pesquisa "cirurgia da mão Palmas TO" não te acha pelo Google. Quem aparece é cirurgião geral. LP profissional no domínio raiz vira destino oficial pra busca "cirurgia da mão Palmas" + "microcirurgia Palmas" — nicho com concorrência regional zero. Mesmo domínio que tu já tem, conversão diferente. Topa ver?',
    nota_interna: 'INSIGHT NOVO do batch CIC #6: TEM DOMÍNIO ricardomendonca.com.br MAS é link-in-bio custom. Pitch UPGRADE explícito (ele já investiu, só falta evoluir). Telefone NÃO veio direto — pegar via bio link. ULTRA-NICHO (cirurgia da mão + microcirurgia) = concorrência regional zero. Pitch "complexo" R$899-1.197 (LP profissional + 3 artigos SEO técnicos + integração com domínio existente).',
    abertura: `Doutor, boa noite

Vi que você é cirurgião ortopedista com cirurgia da mão e microcirurgia — subespecialização raríssima da região
Você já investiu em ricardomendonca.com.br, mas o domínio raiz não tem site indexado — só link-in-bio
Hoje paciente que pesquisa "cirurgia da mão Palmas" te acha primeiro ou cai em cirurgião geral?`,
    followup_d3: `Ei doutor, voltei rapidinho — uma coisa que vejo em cirurgião com domínio dormente
Você já passou da fase inicial — só falta evoluir o link-in-bio pra LP completa no domínio raiz. Faz sentido pra você?`,
    followup_d7: `Tô parando por aqui pra não te incomodar, doutor
Minha porta fica aberta quando fizer sentido`,
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
    posicao_no_tier: 6,
    dor: 'Amanda Silveira é enfermeira especialista (COREN — não exibido na bio, validar) que opera "Estética e Terapias Injetáveis" em Palmas-TO. Maps 5.0/10 reviews, endereço Q.104 Sul Rua SE 05 N 33 AP 01 (opera home-office em apartamento). Profissional goiana de 33 anos atendendo em Palmas. Nicho: Estética + Saúde Funcional Integrativa (terapias injetáveis, bioestimuladores, soroterapia). 1.360 seguidores Insta, ZERO link in bio visível — tudo no DM. CLONE 1:1 da Erlane (EV Suplementos Injetáveis): mesma profissão paramédica, mesmo serviço, mesma cidade, mesmo gargalo de captura.',
    gancho: 'PITCH ESPECIAL — único do banco onde o case-clone é da MESMA cidade (Erlane mora em Palmas, Eduardo conhece pessoalmente). Abertura: *"A Erlane (@ev.suplementosinjetaveis) é nossa cliente em Palmas e tinha exatamente o seu setup — enfermeira, terapias injetáveis, saúde funcional, atendimento por horário marcado. Construímos a LP dela (evsuplementosinjetaveis.com), parou de explicar protocolo no DM 50x por dia. Posso te mostrar o que mudou na operação dela?"*. Em cidade média, indicação cruzada da própria persona-mãe é o atalho de fechamento mais rápido — pedir permissão da Erlane antes de disparar.',
    objecao: '"Atendo em casa, fluxo pequeno, não preciso de site agora" — defesa do operacional home-office.',
    resposta_objecao: 'Justamente porque tu opera home-office, LP é ainda mais importante — paciente nova que viu teu post sobre suplementação injetável vai pesquisar "Amanda Silveira enfermeira Palmas" antes de marcar (ela vai até a TUA casa, decisão de confiança máxima). Sem LP profissional com biografia + COREN + protocolos + endereço + agendamento, paciente recua. A Erlane teve esse mesmo medo no começo — depois da LP, parou de receber DM perguntando "é confiável?", "como funciona?". Topa ver?',
    nota_interna: 'CLONE 1:1 DA ERLANE — Eduardo conhece a Erlane pessoalmente (esposa). VALIDAR antes de disparar: (1) pedir permissão da Erlane pra usar nome dela explicitamente como case, (2) checar se Erlane conhece Amanda pessoalmente — em cidade média, indicação cruzada da persona-mãe é atalho de fechamento. Telefone NÃO veio direto — pegar via DM Insta antes de disparar. Pre-engajamento OBRIGATÓRIO via Insta D-1. COREN não exibido na bio — confirmar registro antes do pitch (filtro 0 obrigatório).',
    abertura: `Ei Amanda, passei pelo teu perfil agora

Reparei que tu opera home-office com terapias injetáveis e saúde funcional em Palmas — modelo de confiança máxima
Paciente nova que viu post sobre suplementação injetável pesquisa MUITO antes — ela vai até a TUA casa, decisão pesada
Deixa eu te perguntar: hoje quem busca isso te acha, ou cai em quem tem site profissional?`,
    followup_d3: `Ei Amanda, voltei rapidinho — uma coisa que vejo em terapia injetável home-office
Paciente que vai até TUA casa pesquisa MUITO antes — Erlane (EV Suplementos) tinha esse mesmo gargalo no DM antes da LP. Tá rolando contigo?`,
    followup_d7: `Tô parando por aqui pra não encher
Minha porta fica aberta quando fizer sentido`,
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
    posicao_no_tier: 7,
    dor: 'Dra. Juliana Resende é biomédica esteta solo em Palmas-TO com 5.260 seguidores Insta — clone-caso anterior não-fechado MAIS FORTE em volume (5x mais seguidores que caso anterior não-fechado). Bio com geo Palmas-TO explícito. Nicho: Rejuvenescimento Facial + Harmonização Full Face + Glútea (ticket R$1.000-3.000 por protocolo, premium corporal). Site atual: wa.me/message/ZN5OKCNAH35EN1 + Threads (sem site profissional, só DM). 5.260 seguidores qualificados (público de protocolos premium não é casual) + serviço alto-ticket + canal único wa.me = leads frios escapam constantemente.',
    gancho: 'PITCH AJUSTADO pro cluster clone-caso anterior não-fechado (lição aprendida do não-fechamento da caso anterior não-fechado): NÃO posicionar como "site barato", posicionar como "LP que te coloca no nível de quem cobra R$3k". Foco em UM produto-âncora (escolher Glútea OU Full Face — não os dois ao mesmo tempo na LP), com FAQ específico daquele protocolo, antes/depois categorizado, agendamento. Caso-clone visual: (referência visual interna) é a referência ESTÉTICA (mesmo padrão de carrossel-cápsula com produtos nomeados tipo PILL FOOD/PROTOCOLO/MÉTODO).',
    objecao: '"Já vendo bem assim, ticket alto, paciente fiel" — defesa do operacional premium.',
    resposta_objecao: 'Justamente porque tu cobra R$1.000-3.000 por protocolo, a LP é mais importante — não é pra captar paciente que escolhe pelo preço, é pra QUALIFICAR a paciente que vai gastar R$3k em harmonização. Cliente que vai pagar esse valor pesquisa MUITO antes de marcar (compara 5-7 profissionais), e quando cai no teu wa.me direto sem ver biografia + CRBM + protocolo + antes/depois categorizado — ela recua e vai pra concorrente que tem LP. O que eu monto não é "site barato", é vitrine que coloca tu no nível visual de quem cobra teu ticket. Tem caso real disso aqui em Palmas (Erlane, EV Suplementos Injetáveis) — paramédica esteta que fez essa transição. Topa ver?',
    nota_interna: 'CLUSTER CLONE-IRSNAYRA — VACINA DE PITCH OBRIGATÓRIA: NÃO usar argumento "site barato/profissional". USAR: (1) "LP que coloca tu no nível de quem cobra teu ticket", (2) UM produto-âncora (não bio inteira), (3) ROI por paciente (não preço LP), (4) gatilho sazonal se possível (verão, BBB, casamentos). Telefone NÃO veio direto — pegar via wa.me Insta. CRBM-TO não confirmado na bio — VALIDAR. Pre-engajamento OBRIGATÓRIO (curtir 2 posts de protocolo, NÃO foto pessoal).',
    abertura: `Doutora, boa noite

Vi que tu trabalha com harmonização full face e glútea em Palmas — ticket R$1k-3k por protocolo, operação premium
O link da bio cai num wa.me direto — sem biografia, CRBM em destaque, antes/depois, FAQ por protocolo
Paciente premium recua no momento do "olá!" ou continua?`,
    followup_d3: `Ei doutora, voltei rapidinho — uma coisa que vejo em biomédica esteta premium
Paciente que paga R$3k compara 5-7 profissionais — LP qualifica antes do DM. Faz sentido pra ti?`,
    followup_d7: `Tô parando por aqui pra não te incomodar, doutora
Minha porta fica aberta quando fizer sentido`,
    pre_engajamento_ig: 'D-1 OBRIGATÓRIO: seguir, curtir 2 posts de protocolo (priorizar antes/depois ético OU explicação técnica de produto, NÃO foto pessoal). NÃO comentar (biomédica esteta com 5k seg recebe muito comentário genérico de potencial cliente — queima rápido).',
    razao_ranking: 'TIER S (score 9.5). CLUSTER CLONE-IRSNAYRA mais forte em volume. Ticket premium (R$1k-3k protocolo). Vacina de pitch OBRIGATÓRIA — não argumentar preço, argumentar nível de vitrine + qualificação de paciente premium. LP a partir de R$799-999 (Complexo) provável na call.',
  },

  1136: {
    tier: 'A',
    posicao_no_tier: 13,
    dor: 'Dra. Tuany Rifer é farmacêutica esteta solo em Palmas-TO — CLONE-IRSNAYRA EXATO (mesma profissão literal: Farmacêutica Esteta). 2.079 seguidores Insta, geo Palmas-TO explícito na bio. Nicho: Harmonização Facial — slogan "Beleza com Naturalidade". Site atual: linktr.ee/tuanyrf1. Parceria com @franconerobucar mostra ecossistema profissional sem hub central. Linktr.ee é o sintoma EXATO do gap LP — ela já entendeu que precisa de "lugar único" mas escolheu o atalho amador.',
    gancho: 'PITCH AJUSTADO clone-caso anterior não-fechado + reforço: o link in bio que ela tem hoje (linktr.ee) é SINAL DE COMPRA segundo o market intelligence — ela JÁ está disposta a investir em presença online, só escolheu o atalho amador. LP profissional vira o próximo degrau natural. Foco em UM protocolo-âncora (Harmonização Facial — beleza com naturalidade) com FAQ + antes/depois ético + agendamento integrado + integração com parceria @franconerobucar (link cruzado, ecossistema). Caso-clone visual: (referência visual interna) como referência estética.',
    objecao: '"Tenho linktr.ee, funciona, parceiros sabem do meu trabalho" — defesa da solução amadora atual + ecossistema de indicação.',
    resposta_objecao: 'Faz sentido — linktr.ee centraliza link, e ecossistema de parceria com @franconerobucar mostra que tu construiu network. Mas pensa: o paciente NOVO indicado pelo Francone vai pesquisar "Tuany Rifer farmacêutica esteta Palmas" antes de marcar (decisão estética séria). Cai no linktr.ee e vê 5 links sem hierarquia, sem teu rosto profissional, sem CRF, sem método "Beleza com Naturalidade" explicado. Recua. LP profissional pega esse momento: ela chega e vê biografia + CRF + UM método-âncora bem detalhado. Tem caso real disso aqui em Palmas — Erlane (EV Suplementos Injetáveis) é farmacêutica esteta que fez essa transição. Mesma indicação, conversão diferente. Topa ver?',
    nota_interna: 'CLUSTER CLONE-IRSNAYRA — VACINA DE PITCH ATIVADA. CRF-TO não confirmado na bio — VALIDAR. Telefone via linktr.ee — pegar antes. Pre-engajamento OBRIGATÓRIO. Pitch foco em UM protocolo-âncora (Harmonização Facial / Beleza com Naturalidade — slogan dela mesma) — não tentar caber bio inteira.',
    abertura: `Doutora, boa noite

Vi que tu tem método "Beleza com Naturalidade" + parceria com Francone Bucar — ecossistema construído
Mas o link da bio é linktr.ee — paciente indicada que pesquisa antes de DM cai em 5 links sem hierarquia, sem teu método explicado
Deixa eu te perguntar: quanta dessa paciente indicada recua no linktr.ee?`,
    followup_d3: `Ei doutora, voltei rapidinho — uma coisa que vejo em farmacêutica esteta com método autoral
Linktr.ee cumpre o básico, mas o teu método "Beleza com Naturalidade" merece vitrine própria. Faz sentido pra ti?`,
    followup_d7: `Tô parando por aqui pra não te incomodar, doutora
Minha porta fica aberta quando fizer sentido`,
    pre_engajamento_ig: 'D-1: seguir, curtir 2 posts (priorizar conteúdo de "beleza com naturalidade" — método dela mesma, não foto pessoal genérica). Comentar 1 com algo específico do método ("a abordagem de harmonização com naturalidade é raro de ver com esse rigor mesmo"). Profissional saúde valoriza pre-engajamento sobre o método dela mesma.',
    razao_ranking: 'TIER S (score 9). CLONE-IRSNAYRA EXATO (mesma profissão "Farmacêutica Esteta"). Linktr.ee = sinal de compra. Pitch de UPGRADE (não criação) com vacina ativada. Foco em método-âncora "Beleza com Naturalidade". LP a partir de R$499-799 (Padrão/Complexo) na call.',
  },

  1137: {
    tier: 'A',
    posicao_no_tier: 18,
    dor: 'Dra. Adriane Garcia é esteta solo Palmas-TO — PERFIL MAIS PARECIDO COM IRSNAYRA do banco inteiro: 1.065 seguidores Insta (vs 1.183 da caso anterior não-fechado), bio dispersa em múltiplas áreas (Estética Injetável + Manchas + Poros + Envelhecimento + Soroterapia + PEIM + Botox + Preenchimento), site atual linktr.ee/adriane.esteta. ALTO RISCO de mesma objeção que matou o fechamento da caso anterior não-fechado: ticket alto vs preço LP percebido como "barato demais", bio dispersa sem produto-âncora único, sem urgência clara.',
    gancho: 'PITCH PREVENTIVAMENTE AJUSTADO (vacina ativa) pra evitar repetir erro caso anterior não-fechado. NÃO argumentar preço LP (R$499 pode soar barato demais pro nível dela). Argumentar (1) ROI por paciente — "1 paciente nova de R$1k que tu captura paga 2x a LP", (2) UM produto-âncora bem definido (escolher PEIM OU Soroterapia OU Botox — NÃO tentar caber 7 áreas), (3) gatilho sazonal concreto (verão, BBB, casamentos), (4) caso-clone visual (referência visual interna) como referência estética + caso-clone Erlane LOCAL como prova social. Bem estruturado, 4 vetores juntos.',
    objecao: '"Já vendo bem, paciente fiel, ticket alto" + (provável objeção caso anterior não-fechado) "site é barato demais pro meu nível" — combinação que matou o fechamento caso anterior não-fechado.',
    resposta_objecao: 'Faz total sentido — tu opera no nível premium e site amador realmente queima esse posicionamento. JUSTAMENTE por isso a LP profissional faz sentido — não é pra "ter site barato", é pra colocar tu no NÍVEL VISUAL de quem cobra teu ticket. Pensa em ROI: 1 paciente nova de PEIM ou preenchimento (R$1.000+) que tu captura via LP paga 2x o investimento. Não estou te oferecendo "barato" — estou te oferecendo vitrine que QUALIFICA paciente premium. Tem caso real disso aqui em Palmas — Erlane (@evsuplementosinjetaveis) é paramédica esteta que fez essa transição com a Impulso e parou de explicar protocolo no DM 50x por dia. Topa ver?',
    nota_interna: 'CASO MAIS DELICADO do cluster — perfil tecnicamente análogo a um prospect anterior que não fechou (volume, bio dispersa, ticket alto). VACINA DE PITCH OBRIGATÓRIA: (1) NUNCA argumentar preço, (2) escolher UM produto-âncora ANTES da call (PEIM ou Soroterapia ou Botox — sugerir o que rende mais ROI), (3) ancorar gatilho sazonal, (4) usar EV Suplementos Injetáveis (Erlane) como case real local — único case real no nicho saúde-estética paramédica. Telefone via linktr.ee — pegar antes. CRBM/CRF não confirmado — VALIDAR.',
    abertura: `Doutora, boa noite

Vi que tu trabalha com PEIM, soroterapia, botox, preenchimento e mais 3 áreas — operação premium consolidada
O linktr.ee lista 7 áreas sem hierarquia — paciente que vai gastar R$1k+ num PEIM cai sem ver método-âncora
Hoje ela escolhe direto contigo, ou compara com outras esteta antes?`,
    followup_d3: `Ei doutora, voltei rapidinho — uma coisa que vejo em estética injetável premium
LP profissional não é "site barato" — é vitrine que qualifica ticket alto. Faz sentido pra ti?`,
    followup_d7: `Tô parando por aqui pra não te incomodar, doutora
Minha porta fica aberta quando fizer sentido`,
    pre_engajamento_ig: 'D-1 OBRIGATÓRIO: seguir, curtir 2 posts de protocolo específico (priorizar PEIM, preenchimento OU soroterapia — NÃO foto pessoal). NÃO comentar (perfil pequeno mas premium recebe genérico — queima). Pre-warming via consumo do conteúdo.',
    razao_ranking: 'TIER S (score 9). CASO MAIS DELICADO do cluster — perfil análogo à caso anterior não-fechado (não fechou). VACINA DE PITCH ATIVA. Pitch foco em ROI por paciente + UM produto-âncora + gatilho sazonal — NUNCA argumentar preço. LP a partir de R$799-999 provável (justamente pra evitar percepção de "barato demais").',
  },

  1140: {
    tier: 'A',
    posicao_no_tier: 23,
    dor: 'Dra. Ana Luíza Duarte é DENTISTA CRO TO 3556 (categoria Dentista Estético). 16.500 seguidores Insta (volume gigante), Maps 5.0/99 reviews, método PROTAGONIZE — Harmonização Facial. CASO ÚNICO no banco: ELA TEM SITE — `dra-analuizaduarte.vizzoone.com`. MAS Vizzoone é plataforma odonto genérica de subdomínio compartilhado (similar a Trinks/Booksy mas pra dentista) — site dela é template padronizado, sem identidade autoral, com URL feia (subdomínio.vizzoone.com não é .com.br próprio). Pitch radicalmente diferente: "MIGRAR DA PLATAFORMA GENÉRICA pra LP autoral com domínio próprio".',
    gancho: 'PITCH ESPECIAL — único do banco onde lead JÁ PAGA POR plataforma profissional MAS é compartilhada/genérica. Argumento: "Tu já entendeu que precisa de site profissional (e parabéns por isso, raro em Palmas). Mas dra-analuizaduarte.vizzoone.com é subdomínio de plataforma — toda dentista do Vizzoone tem site igual ao teu, só com nome trocado. O que eu monto é diferente: domínio próprio (analuizaduarte.com.br ou similar), identidade visual TUA, método PROTAGONIZE em destaque, biografia + CRO + galeria antes/depois ÚNICA. Tu sai da plataforma, vira marca." Argumento estrutural — diferenciação contra padronização Vizzoone.',
    objecao: '"Já tenho site Vizzoone, pago mensalidade, funciona" — defesa do investimento atual.',
    resposta_objecao: 'Concordo que ter Vizzoone é melhor que não ter nada — e parabéns por já ter saído da fase amadora. MAS pensa: cada dentista do Vizzoone tem site IGUAL AO TEU, só com nome trocado. URL é "dra-analuizaduarte.vizzoone.com" — paciente que vê isso percebe na hora "isso é template de plataforma". Pra paciente que vai pagar R$3k+ em harmonização, o URL é parte da percepção de seriedade. Domínio próprio (analuizaduarte.com.br ou método.com.br) + identidade autoral + método PROTAGONIZE em destaque = vitrine que NÃO existe em outra dentista. Tu sai do template, vira marca. E o Vizzoone tu pode manter como agendamento secundário, não desliga. Topa ver?',
    nota_interna: 'CASO ÚNICO no banco — Lead que JÁ PAGA POR plataforma profissional. Pitch RADICAL: "domínio próprio + identidade autoral" — argumento de DIFERENCIAÇÃO, não de criação. CRO TO 3556 confirmado. Maps 5.0/99 reviews valida operação. Telefone NÃO veio direto — pegar via DM Insta ou Vizzoone. Pre-engajamento OBRIGATÓRIO (16.5k seg = volume gigante). Pitch "complexo" provável (R$899-1.197) pelo branding autoral + integração com Vizzoone como secundário.',
    abertura: `Doutora, boa noite

Vi que você tem método PROTAGONIZE + 16.5k seguidores + 99 reviews 5★ + site Vizzoone — autoridade construída
Toda dentista do Vizzoone tem site IGUAL ao seu, só com nome trocado — paciente que vai pagar R$3k em harmonização percebe na hora que é "template de plataforma", não marca autoral
Quanto dessa paciente premium recua nesse momento?`,
    followup_d3: `Ei doutora, voltei rapidinho — uma coisa que vejo em dentista com método autoral
Domínio próprio + identidade autoral + método em destaque diferencia de quem usa template de plataforma. Faz sentido pra você?`,
    followup_d7: `Tô parando por aqui pra não te incomodar, doutora
Minha porta fica aberta quando fizer sentido`,
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
    posicao_no_tier: 47,
    dor: 'Sabor da Terra Marmita Fit é o LEAD MAIS QUENTE DO PIPELINE INTEIRO até agora. Conta Insta VERIFICADA com 45.100 seguidores (público fitness Palmas qualificado), endereço Quadra 906 sul Av LO 23, telefone (63)99288-0204 confirmado. NICHO: marmita fit / comida saudável delivery com plano semanal recorrente. Site atual: sabordaterra.my.canva.site/cardapiodigital — Canva site é AMADOR (subdomínio plataforma + template genérico + zero checkout estruturado). 45k seg + recorrência semanal + Canva site = receita massiva escapando todo dia. Cada cliente que quer fechar plano semanal precisa pedir no WhatsApp, esperar resposta, mandar pix toda semana.',
    gancho: 'PITCH ESPECIAL — Sabor da Terra é seguida pelo @gabribarros10 (Gabriel, case ATIVO Impulso GB Nutrition). ENTRAR VIA INDICAÇÃO DO GABRIEL é atalho de fechamento (em cidade média, indicação cruzada vale ouro). Pitch: Shopify com plano semanal automatizado (assinatura recorrente Mercado Pago) + cardápio navegável por categoria + entrega motoboy Palmas + opção pacote 5/7/15 dias. Cliente paga uma vez, marmita chega toda semana sem ela precisar pedir. Mesma operação dela hoje, sem gargalo do WhatsApp.',
    objecao: '"Já tenho o site Canva, cliente pede pelo WhatsApp, dá certo" — operação ativa defendendo o status quo.',
    resposta_objecao: 'Concordo — 45k seg + Canva site mostra que tu construiu marca real. Mas pensa em assinatura semanal: hoje cliente que quer pacote 7 dias tem que mandar mensagem TODA SEGUNDA pra confirmar pedido + mandar pix. 60% das clientes desistem do plano semanal nessa fricção (todo final de semana volta a duvidar se vale a pena). Shopify resolve com assinatura recorrente: ela paga uma vez, marmita chega toda semana, ela só recebe. 1 cliente recorrente de R$300/sem = R$1.200/mês x 12 meses = R$14.400/ano que tu não captura hoje. Topa eu te mostrar como ficaria? E olha — vi que o Gabriel (GB Nutrition) te segue, tu conhece ele pessoalmente?',
    nota_interna: '⛔ BLOQUEIO HARD — AGUARDAR LANÇAMENTO DA LOJA DO GABRIEL (semana que vem, conteúdo por conta da Impulso). Disparar este lead ANTES = perde força máxima do pitch. APÓS o lançamento, Gabriel mencionando Impulso Digital publicamente vira "ele acabou de me citar" — argumento turbinado.\n\nLEAD MAIS QUENTE DO PIPELINE INTEIRO. Conta verified + 45.100 seg + Canva site + plano semanal = combinação ÓBVIA de Shopify. Telefone (63)99288-0204 confirmado. AÇÃO ESPECIAL CRÍTICA: APÓS lançamento Gabriel, pedir ele pra fazer indicação direta ("Sabor, te apresento o Eduardo que cuida do meu site"). Se Gabriel topar, fechamento dispara. Pre-engajamento Insta D-1 obrigatório. Pitch "complexo" provável (R$899-1.297) pelo plano de assinatura recorrente + integração Mercado Pago.',
    abertura: `Ei, passei pelo perfil de vocês agora

Vocês têm 45.100 seguidores Insta verified + plano semanal de marmita fit em Palmas — base que pouca marca aqui tem
Mas o link da bio é Canva site — cliente que quer plano semanal manda mensagem TODA SEGUNDA pra confirmar e mandar pix
Deixa eu te perguntar: quanto cliente desiste nessa fricção semanal?`,
    followup_d3: `Ei, voltei aqui rapidinho — uma coisa que vejo em marmita fit com plano semanal
1 cliente de R$300/sem = R$14.400/ano que escapa sem checkout recorrente. Faz sentido pra vocês?`,
    followup_d7: `Tô parando por aqui pra não encher
Minha porta fica aberta quando fizer sentido`,
    pre_engajamento_ig: 'D-1 OBRIGATÓRIO: seguir, curtir 2 posts (priorizar foto de marmita finalizada OU cliente fitness consumindo, NÃO foto pessoal). Comentar 1 com algo específico do prato ("essa marmita com batata-doce fit ficou impecável" ou referência ao plano semanal). Marca verified com 45k seg recebe muito comentário genérico — comentário ESPECÍFICO destaca.',
    razao_ranking: 'LEAD MAIS QUENTE DO PIPELINE (score 10!). Verified + 45.100 seg + Canva site + plano semanal recorrente + SEGUIDA PELO GABRIEL = atalho de fechamento via indicação. Pitch "complexo" R$899-1.297 (assinatura recorrente + cardápio + integração MP). 1 cliente recorrente paga 5x a LP em 1 ano.',
  },

  1142: {
    tier: 'A',
    posicao_no_tier: 48,
    dor: 'Nutri+ Suplementos é concorrente DIRETO do Gabriel (GB Nutrition) mas em escala MUITO maior: conta Insta VERIFICADA, 44.200 seguidores, Maps 5.0/855 reviews (número ABSURDO em Palmas — acima de 99% das lojas), endereço Q.104 Norte Av LO 2, cobertura regional Palmas + Porto Nacional + Paraíso + Gurupi + Taquaralto. Site atual: linktr.ee/nsuplementos (sinal de compra — ela JÁ entendeu que precisa de hub digital, escolheu o atalho). Cobertura regional declarada SEM checkout estruturado = ineficiência massiva. Cliente de Gurupi que viu post sobre creatina tem que mandar DM, esperar resposta, perguntar frete, mandar pix.',
    gancho: 'PITCH PARALELO — Nutri+ é seguida pelo @gabribarros10 mesmo sendo concorrente DIRETO. Networking fitness Palmas é fluido. Pitch: "Você já é referência regional no Tocantins, falta o checkout regional" — Shopify com cálculo de frete automático por cidade, integração motoboy Palmas + Correios pra Porto/Paraíso/Gurupi, catálogo navegável, conta única de cliente. Mesmo modelo do Gabriel (GB Nutrition) mas em escala maior. Linktr.ee como SINAL DE COMPRA: ela já investiu em hub digital, falta só evoluir pra Shopify real.',
    objecao: '"Já tenho linktr.ee, 855 reviews, cobertura regional consolidada — tá funcionando" — operação madura defendendo o status quo.',
    resposta_objecao: 'Total razão — 855 reviews 5★ é número que MUITO atacadista do Brasil leva 10 anos pra construir, e cobertura regional é capital social raro. Mas pensa: cliente novo de Gurupi que viu teu post de creatina pesquisa "Nutri+ suplementos Palmas" no Google às 23h. Cai no linktr.ee, vê 5 links sem hierarquia, sem cálculo de frete pra cidade dele, sem catálogo navegável. Recua. Shopify pega esse momento: ele entra, escolhe creatina, sistema calcula frete automático pra Gurupi, paga em 12x, recebe rastreio. Mesmo cliente que te conhece via Maps, conversão diferente. Topa ver caso? E vi que tu segue/é seguida pelo Gabriel (GB Nutrition) — vocês se conhecem?',
    nota_interna: '⛔ BLOQUEIO HARD — AGUARDAR LANÇAMENTO DA LOJA DO GABRIEL (semana que vem). Disparar antes do lançamento queima o vetor Gabriel. Após Gabriel mencionar Impulso Digital publicamente, prova social fica turbinada.\n\nCONCORRENTE DIRETO do Gabriel — DELICADO. SEGUIDA POR @gabribarros10 = networking fluido (não rivalidade aberta). APÓS lançamento, perguntar Gabriel se ele tem relação pessoal com ela. Se Gabriel autorizar, fica natural mencionar ele na 1ª mensagem. Telefone (63)99982-8285 confirmado bio. Pitch "complexo" R$899-1.197 (catálogo regional + cálculo frete por cidade + área cliente).',
    abertura: `Ei, passei pelo perfil de vocês agora

Vocês têm 855 reviews 5★ no Maps + cobertura Palmas/Porto/Paraíso/Gurupi — referência regional rara de suplemento no Tocantins
O link da bio é linktr.ee — cliente de Gurupi que viu post sobre creatina não tem cálculo de frete nem catálogo navegável
Hoje ele compra direto ou abandona no caminho?`,
    followup_d3: `Ei, voltei aqui rapidinho — uma coisa que vejo em loja com cobertura regional
Checkout com frete automático por cidade transforma cobertura em receita real. Faz sentido pra vocês?`,
    followup_d7: `Tô parando por aqui pra não encher
Minha porta fica aberta quando fizer sentido`,
    pre_engajamento_ig: 'D-1: seguir, curtir 2 posts (priorizar lançamento OU promoção regional, não foto pessoal). NÃO comentar (operação madura recebe muito genérico). Pre-warming via consumo do conteúdo.',
    razao_ranking: 'TIER S puríssimo (score 9.5). Verified + 44.2k seg + 855 reviews 5★ (recorde Maps suplemento Palmas) + linktr.ee + cobertura regional = combinação perfeita Shopify. Concorrente DIRETO Gabriel mas seguida por ele = abordagem com cuidado. Pitch enterprise/regional R$1.197-1.497.',
  },

  1143: {
    tier: 'A',
    posicao_no_tier: 37,
    dor: 'B K Moda Fitness é loja de varejo fitness em Taquaralto-Palmas com 20.100 seguidores Insta + 1.075 posts + LIVE COMO DESTAQUE PRINCIPAL no perfil. Endereço: Rua P4 frente feira Maria das Dores. Catálogo: LIVE, Bolha (calça), Micro canelado, Blusas tule, Flare Premium, ALO Yoga. Site atual: wa.me direto + Threads (ZERO web). Modelo de venda: Lives semanais. Problema: Live SÓ vende pra quem está online no momento exato. Cliente que viu story do produto 3 horas depois ou viu uma referência do produto numa amiga não consegue comprar — tem que mandar DM, esperar resposta, esperar próxima Live, etc.',
    gancho: 'PITCH ESPECIAL — "A LIVE VENDE, O SHOPIFY FECHA". Lives BK acontecem semanalmente. Shopify resolve a fila pós-Live: cliente assiste Live, separa peça mentalmente, finaliza checkout 24/7 (mesmo às 3h da manhã). Loja vende ENQUANTO ELA DORME. Não substitui Live (que é o motor de vendas), complementa: Live → demanda → fila no Shopify → conversão automática. Case-clone GB Nutrition (varejo + envio + Lives recorrentes).',
    objecao: '"As Lives já vendem demais, não preciso de site" — defesa do operacional atual que funciona.',
    resposta_objecao: 'Concordo — Live é o motor de vendas e isso não muda. Mas pensa: cliente que assistiu Live ontem mas não comprou na hora porque tava no trabalho, hoje volta no Insta e vê o produto. O que ela faz? Manda DM. Espera resposta. Pergunta tamanho. Confirma. Pix. 30 min. 60% desistem nesse caminho. Shopify pega EXATAMENTE esse momento: ela vê o produto, clica, paga em 12x, recebe rastreio. Mesma demanda da Live, conversão de 60% pra 95%. E motoboy de Taquaralto continua entregando — só agora ele recebe pedido pronto, sem 30 mensagens cruzadas. Topa ver?',
    nota_interna: 'MAIOR CLUSTER CLONE-GB IDENTIFICADO no batch #9: moda fitness com Lives + envio + motoboy. BK + DeLótus + PMW = 3 Tier S nesse padrão. Pitch dedicado "Live vende, Shopify fecha". Telefone (63)99267-2610 confirmado. Pre-engajamento Insta D-1 obrigatório (curtir 2 posts de Live OU produto, não foto pessoal). Pitch "complexo" R$899-999 (catálogo Live + integração com agenda de Live + motoboy).',
    abertura: `Ei, passei pelo perfil de vocês agora

Reparei que vocês têm 20.100 seguidores + Lives semanais como destaque do perfil — motor de venda raro
Cliente que assistiu Live ontem e não comprou na hora hoje volta, vê o produto e precisa mandar DM (30 mensagens cruzadas)
Deixa eu te perguntar: quantas desistem antes de fechar?`,
    followup_d3: `Ei, voltei aqui rapidinho — uma coisa que vejo em loja com Live ativa
"A Live vende, o Shopify fecha" — quem viu Live ontem fecha checkout 24/7 sem 30 mensagens cruzadas. Faz sentido pra vocês?`,
    followup_d7: `Oi, última mensagem. Live + motoboy + Taquaralto é sistema que funciona de verdade. Falta só o checkout que captura quem viu Live mas não comprou na hora. Se em algum momento isso bater, tu sabe onde me achar.`,
    pre_engajamento_ig: 'D-1 OBRIGATÓRIO: seguir, curtir 2 posts (priorizar foto de produto da Live OU cliente real usando peça, NÃO foto pessoal). Comentar 1 com algo específico ("essa flare premium com micro canelado tem caimento incrível mesmo" ou referência à peça). Loja varejo valoriza comentário sobre produto.',
    razao_ranking: 'TIER S (score 9). MAIOR CLUSTER CLONE-GB do batch #9 (Moda Fitness + Lives + Motoboy). Pitch dedicado "Live vende, Shopify fecha" — diferencial único. 20.1k seg + Lives semanais = volume de demanda alto sem captura. Pitch "complexo" R$899-999.',
  },

  1144: {
    tier: 'A',
    posicao_no_tier: 34,
    dor: 'DeLótus Moda Fitness é loja de varejo Palmas com NICHO ESPECÍFICO RARÍSSIMO: moda fitness pra mulheres reais (numeração 34 ao 60). Endereço Q.307 Sul Rua 5, 468. Maps 5.0/46 reviews. 4.866 seguidores Insta. CEO visível: @deisedadelotus (dona-marca, decisão direta). Envio nacional declarado. Site atual: bio.site/delotus (genérico — mesmo padrão amador, sem filtro por tamanho, sem destaque pro nicho 34-60). NICHO 34-60 é OURO (mulher 44-60 quase nunca encontra moda fitness premium na cidade dela), MAS o canal não comunica isso — bio.site mostra só links genéricos, sem destaque pra inclusão dimensional.',
    gancho: 'PITCH NICHO-ESPECÍFICO: Shopify com filtro de tamanho 34-60 explícito como categoria de primeira página + galeria de mulheres reais (NÃO modelos magras) + FAQ de medida + marca curada. Hoje a maior queixa da mulher 44+ é "tamanho não tem". A LP/Shopify da DeLótus pode ser a ÚNICA do Tocantins que abre com "Aqui tem do 34 ao 60, sem você precisar perguntar". Case-clone duplo: GB Nutrition (envio + marca + dona visível) + criativosdoceu (nicho específico + dona-marca pessoa pública).',
    objecao: '"Já tenho bio.site, cliente acha tudo lá" — defesa da solução amadora atual.',
    resposta_objecao: 'Faz sentido — bio.site centraliza link, e funciona como diretório. Mas pensa pelo lado da mulher 48 que viu uma calça tua num post compartilhado por amiga. Ela vai pesquisar "DeLótus moda fitness Palmas tamanho 48" antes de mandar DM (medo histórico de "tamanho não tem"). Cai no bio.site, vê 5 links sem destaque pro tamanho dela, sem confirmação que tem 48. Recua. Shopify dedicado: ela entra, filtra direto por "tamanho 48", vê 30 peças disponíveis, paga. Mesma cliente, conversão diferente. E o filtro de tamanho não é "feature escondida" — é a CATEGORIA principal da loja. Topa ver?',
    nota_interna: 'NICHO 34-60 é DIFERENCIAL ENORME — diferenciação rara em Palmas. CEO visível @deisedadelotus = decisão direta. Telefone (63)99218-3631 confirmado Maps. Pre-engajamento Insta D-1 obrigatório (curtir 2 posts de cliente real, NÃO modelo magra — DeLótus valoriza inclusão). Comentar 1 sobre acessibilidade dimensional. Pitch "complexo" R$899-1.197 (filtro tamanho como categoria + galeria mulheres reais + FAQ medida).',
    abertura: `Ei Deise, passei pelo perfil de vocês agora

Vocês são únicos em Palmas a vender "do 34 ao 60" — diferencial raro, capital social que muita marca não tem
O link da bio é bio.site — cliente 48+ que pesquisa "DeLótus tamanho 48" antes de mandar DM cai num link sem filtro, sem confirmação
Cliente 44+ recua nesse momento de incerteza ou segue?`,
    followup_d3: `Ei, voltei aqui rapidinho — uma coisa que vejo em moda inclusiva
"Do 34 ao 60" é diferencial ÚNICO em Palmas — mas precisa ser CATEGORIA principal, não filtro escondido. Faz sentido pra ti?`,
    followup_d7: `Tô parando por aqui pra não encher
Minha porta fica aberta quando fizer sentido`,
    pre_engajamento_ig: 'D-1: seguir, curtir 2 posts de cliente real (priorizar mulher 44+ usando peça em ambiente real, NÃO modelo magra). Comentar 1 sobre inclusão dimensional ("nicho 34-60 é capital social que muita marca esquece — bom ver com esse rigor"). Marca de inclusão valoriza comentário sobre o que ela representa.',
    razao_ranking: 'TIER S (score 9). NICHO 34-60 = diferenciação rara. CEO visível + envio nacional + Maps 5★. Pitch nicho-específico (filtro tamanho como categoria principal). Pitch "complexo" R$899-1.197.',
  },

  1146: {
    tier: 'A',
    posicao_no_tier: 36,
    dor: 'Sousa Fitness é loja de equipamentos esportivos em Palmas com TICKET ALTÍSSIMO (R$200-2.500 por equipamento — kettlebell, banco musculação, halteres, ergometria, esteiras, equipamentos Pilates/Yoga/Boxe/Muay Thai/Crossfit) + assistência técnica. Endereço 1503 sul Alameda 23, 02. Maps 5.0/39 reviews. 504 posts Insta + 3.264 seguidores. Site atual: abre.ai/hdl7 (canal amador — basicamente Linktr.ee renomeado). PROBLEMA CRÍTICO: ticket alto SEM checkout estruturado = gargalo MASSIVO de venda. Cliente que vai gastar R$1.500 num banco musculação precisa ver: ficha técnica completa, dimensões, peso, garantia, foto multi-ângulo, frete real calculado, parcelamento. abre.ai não entrega NADA disso.',
    gancho: 'PITCH TICKET ALTO: Shopify com ficha técnica visual de cada equipamento (especificações, peso, dimensões), galeria multi-ângulo, cálculo de frete automático (peso/volume importam pra equipamento), parcelamento 12x sem juros. Adicionar "ASSISTÊNCIA TÉCNICA AUTORIZADA" como prova social — diferencial que NENHUMA loja online de equipamento entrega. Case-clone duplo: GB Nutrition (loja Palmas + envio) + Mobiliare Móveis (ticket alto físico + galeria editorial).',
    objecao: '"Equipamento o cliente precisa ver antes, conversar, pegar entrega presencial" — defesa do modelo consultivo presencial.',
    resposta_objecao: 'Total razão — equipamento de R$1.500 cliente quer ver antes. Mas pensa: cliente novo que pesquisa "banco musculação Palmas" hoje cai no abre.ai teu, vê 5 links sem ficha técnica, sem dimensões, sem peso, sem garantia. Não dá pra ele decidir QUAL banco ele quer ANTES de te ligar. 80% nem chega a entrar em contato. Shopify resolve isso: ele entra, vê 12 modelos de banco com ficha técnica completa, dimensões, peso, garantia, foto multi-ângulo. Decide qual ele quer. Aí sim te liga pra confirmar entrega presencial. Mesma venda consultiva, cliente chega 80% pré-aquecida em vez de 0%. E "Assistência Movement e Matrix" vira destaque na home — diferencial QUE NENHUMA loja online de equipamento tem. Topa ver?',
    nota_interna: 'TICKET ALTÍSSIMO (R$200-2.500 por equipamento) = ROI Shopify rapidíssimo. 1 venda de R$1.500 paga 2.5x a LP. Telefone (63)99114-5676 confirmado. Pre-engajamento Insta D-1 obrigatório (curtir 2 posts de equipamento finalizado em ambiente real, NÃO foto promocional). Comentar 1 sobre especificação técnica. Pitch "complexo" R$899-1.197 (catálogo técnico + cálculo frete por peso/volume + integração assistência).',
    abertura: `Ei, passei pelo perfil de vocês agora

Vocês têm assistência autorizada Movement e Matrix + ticket R$200-2.500 por equipamento — diferencial técnico raro
O link da bio é abre.ai — cliente que vai gastar R$1.500 num banco musculação não vê ficha técnica, dimensões, peso, garantia
Quanto desse cliente recua antes mesmo de ligar?`,
    followup_d3: `Ei, voltei aqui rapidinho — uma coisa que vejo em loja de equipamento ticket alto
R$1.500+ exige cliente chegar pré-aquecido com ficha técnica e foto multi-ângulo. Faz sentido pra vocês?`,
    followup_d7: `Tô parando por aqui pra não encher
Minha porta fica aberta quando fizer sentido`,
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
    posicao_no_tier: 46,
    dor: 'Gabriel Santiago é Personal Trainer + Coach com nicho específico CrossFit + Atleta Híbrido em Palmas-TO. CREF 2094-GO/TO confirmado. 1.433 POSTS Insta em 3.905 seguidores (engagement altíssimo, raro de ver) — significa que ele entrega conteúdo CONSISTENTE há anos sem retorno proporcional em conversão de aluno. ZERO link externo, só Threads. Bio: "Coach CrossFit & Atleta Híbrido | Bacharel Educação Física | CREF 2094-GO/TO | Performance • Força • Resistência". 1.433 posts sem LP de captura = pelo menos 100 alunos perdidos ao longo do tempo por não ter onde mandar quem quer contratar.',
    gancho: 'CASE-CLONE QUASE PERFEITO do Gabriel Barros (case ATIVO Impulso) com nicho COMPLEMENTAR (CrossFit vs Bodybuilding clássico). Pitch: "Gabriel, vi que tu segue meu cliente Gabriel Barros (GB Nutrition) — vocês têm posicionamento similar mas em nichos complementares. Ele construiu LP profissional + loja Shopify, parou de perder aluno na falta de funil. Tu tem 1.433 posts sem onde mandar quem quer contratar — é como vender ingresso sem ter bilheteria. LP CrossFit Performance: formulário objetivo (ganho massa / atleta híbrido / preparação prova) + agendamento avaliação física + planos mensal/trimestral + depoimentos transformação. Posiciona como CrossFit Specialist Palmas (nicho não coberto pelo @gabribarros10)."',
    objecao: '"Já vendo aluno pelo Insta, tá funcionando" — operação ativa defendendo o que funciona.',
    resposta_objecao: 'Concordo — 3.9k seg + 1.433 posts mostra que tu construiu autoridade real. Mas pensa: cada post teu chega em 500-1000 pessoas. Quantas dessas tu acha que pensam "tô interessado, mas onde mando mensagem?" e depois esquecem? Sem LP, o aluno potencial perde ti por inércia (não mandou DM no momento certo). LP não substitui Insta — captura quem viu post, ficou interessado e teria perdido na fricção do "vou mandar DM depois". Mesmo aluno, conversão diferente. E olha — vi que tu segue o Gabriel (GB Nutrition). Ele é meu cliente. Topa eu te mostrar o que mudou na operação dele quando montei a LP?',
    nota_interna: '⛔ BLOQUEIO HARD — AGUARDAR LANÇAMENTO DA LOJA DO GABRIEL (semana que vem). Este é o CASE-CLONE QUASE PERFEITO do Gabriel — pitch sem mencionar Gabriel perde 80% da força. APÓS Gabriel mencionar Impulso publicamente, abertura fica matadora.\n\nMENCIONAR Gabriel na 1ª mensagem é vetor direto — eles se seguem. APÓS lançamento, falar com o Gabriel pra: (1) confirmar permissão usar nome dele (autorização Erlane já tem, Gabriel pendente), (2) checar se conhecem pessoalmente, (3) possível indicação direta. CREF 2094-GO/TO confirmado na bio. Pegar telefone via DM Insta antes. Pitch padrão R$499 ou complexo R$799-999 (formulário multi-step + área aluno online).',
    abertura: `Boa noite, Gabriel

Vi que tu tem 1.433 posts em 3.9k seguidores + CREF GO-TO + nicho CrossFit/Atleta Híbrido em Palmas — disciplina rara
Zero link externo — cada post chega em 500-1000 pessoas, e quem fica interessado some na fricção do "vou mandar DM depois"
Tu sente que aluno potencial te perde por essa inércia?`,
    followup_d3: `Ei Gabriel, voltei rapidinho — uma coisa que vejo em personal técnico
1.433 posts sem canal de captura = aluno que viu, ficou interessado e esqueceu de mandar mensagem. Faz sentido pra ti?`,
    followup_d7: `Tô parando por aqui pra não encher
Minha porta fica aberta quando fizer sentido`,
    pre_engajamento_ig: 'D-1 OBRIGATÓRIO: seguir, curtir 2 posts técnicos (priorizar conteúdo CrossFit ou Atleta Híbrido — NÃO foto pessoal). Comentar 1 com algo específico ("a abordagem de atleta híbrido com força + resistência é raro de ver com esse rigor"). Personal trainer técnico valoriza pre-engajamento técnico, não emoji.',
    razao_ranking: 'TIER S (score 10!) — RECORD do batch #10. CASE-CLONE Gabriel Barros + nicho complementar (CrossFit vs Bodybuilding) + 1.433 posts + ZERO web + CREF GO-TO. Pitch ESPELHO direto via Gabriel-mãe (eles se seguem — networking fitness Palmas). Pitch padrão R$499 ou complexo R$799-999 com formulário qualificador.',
  },

  1149: {
    tier: 'A',
    posicao_no_tier: 38,
    dor: 'Dafne Sixel é nutricionista funcional vinculada à Integral Clinic Palmas-TO (Q.104 Sul Av LO 1, N.10 - Plano Diretor Sul - clínica 4.8/731 reviews validada via Google Knowledge Panel). 4.805 seguidores Insta + 1.143 POSTS (consistência editorial MONUMENTAL — uma das maiores produções de conteúdo nutri em Palmas). Bio: "Flexibilidade metabólica, saúde intestinal e autonomia. Nutrição centrada em você – não em protocolos!". Site atual: msha.ke/dafneqnutri (ferramenta amador BR). 1.143 posts publicados + ALTA DEMANDA REPRIMIDA + canal de captura amador = receita massiva escapando. Atendimento online declarado.',
    gancho: 'PITCH UPGRADE pra LP nutri funcional co-branded com Integral Clinic. Estrutura: biografia + CRN em destaque + vínculo Integral Clinic (autoridade médica gigantesca — 731 reviews 4.8★) + 4 áreas (flexibilidade metabólica, saúde intestinal, autonomia, paciente "centrada em você") + formulário avaliação metabólica (objetivos / restrições alimentares / histórico) + escolha pacote (3/6/12 meses) + biblioteca de receitas exclusiva pra alunos + integração Calendly/WhatsApp Business + 3 artigos SEO ("dieta flexível", "saúde intestinal", "nutrição funcional Palmas"). Mantém msha.ke como redirect, LP vira destino oficial.',
    objecao: '"Tenho msha.ke + Integral Clinic, paciente acha" — defesa do operacional atual.',
    resposta_objecao: 'Faz total sentido — Integral Clinic com 731 reviews 4.8★ é canal de chegada principal pra paciente local. Mas pensa: paciente NOVO que viu teu post sobre flexibilidade metabólica, vai pesquisar "Dafne Sixel nutri Palmas" antes de marcar consulta. Cai no msha.ke, vê 5 links sem hierarquia, sem teu rosto profissional em destaque, sem vínculo Integral Clinic explícito, sem áreas de expertise estruturadas. 60% recua nesse momento. LP profissional pega exatamente isso: ela chega e vê biografia + CRN + INTEGRAL CLINIC em destaque (autoridade triplicada) + áreas + FAQ. Mesma paciente, conversão diferente. Topa ver?',
    nota_interna: 'AUTORIDADE GIGANTESCA via Integral Clinic (731 reviews 4.8★) — usar como ÂNCORA pesada na LP. Telefone NÃO veio direto (msha.ke) — abrir, capturar. CRN não validado no scrape — VALIDAR. Pre-engajamento OBRIGATÓRIO (curtir 2 posts técnicos sobre flexibilidade metabólica OU saúde intestinal — nutri funcional valoriza pre-engajamento técnico). Pitch "complexo" R$899-1.197 (4 áreas + biblioteca receitas + integração Calendly + co-branding Integral Clinic).',
    abertura: `Doutora, boa noite

Vi que tu tem 1.143 posts + vínculo com Integral Clinic (4.8★/731 reviews) — consistência rara em nutri Palmas
O link da bio é msha.ke — paciente nova que viu post sobre flexibilidade metabólica cai sem teu rosto, sem Integral Clinic em destaque
Hoje ela se sente segura pra marcar consulta, ou segue pesquisando?`,
    followup_d3: `Ei doutora, voltei rapidinho — uma coisa que vejo em nutri funcional
Vínculo com clínica gigante (Integral Clinic 731 reviews) + msha.ke amador não comunica autoridade. Faz sentido pra ti?`,
    followup_d7: `Tô parando por aqui pra não te incomodar, doutora
Minha porta fica aberta quando fizer sentido`,
    pre_engajamento_ig: 'D-1: seguir, curtir 2 posts técnicos (priorizar flexibilidade metabólica, saúde intestinal, dieta carnívora — temas técnicos dela). Comentar 1 com algo específico ("a abordagem de flexibilidade metabólica sem rigidez de protocolo é raro de ver mesmo"). Nutri funcional valoriza pre-engajamento técnico.',
    razao_ranking: 'TIER S (score 9.5). Vinculação Integral Clinic = autoridade gigantesca. 1.143 posts = consistência editorial monumental. msha.ke = sinal de compra. Pitch "complexo" R$899-1.197 (co-branding clínica + 4 áreas + biblioteca receitas + Calendly).',
  },

  1151: {
    tier: 'A',
    posicao_no_tier: 50,
    dor: 'Júnior Sá é Personal Coach com Insta VERIFICADO (raríssimo em personal trainer Palmas — sinal de operação consolidada). Bio: "Coach | Resultados que refletem em toda a sua vida! Avaliação Diagnóstica Clínica/Funcional | Espec. em Medicina do Exercício". 3.934 seg + 302 posts. Site atual: eksy.me/treinadorjrsa (ferramenta amador BR). Destaques: Fat Burn, Emagrecimento, Hipertrofia, Mind Set, Longevidade. Network direta: seguido por @gbnutritionn + @gabribarros10. Diferencial: "MEDICINA DO EXERCÍCIO" como especialização = nicho mais clínico, ticket potencialmente maior que personal padrão. Tem clientes online (eksy.me sugere) mas usa ferramenta amadora — falta LP médica de avaliação funcional com formulário qualificador.',
    gancho: 'LP MÉDICA Júnior Sá — biografia + Medicina do Exercício em destaque + formulário ANAMNESE pré-consulta (objetivos / restrições / disponibilidade / patologias prévias) + agendamento online + depoimentos especificamente de longevidade (área de destaque dele) + integração WhatsApp Business + área de membros pra alunos online. Posicionar como UM dos poucos coaches com Medicina do Exercício em Palmas — autoridade específica que personal padrão não tem.',
    objecao: '"Tenho eksy.me, alunos chegam, tá funcionando" — defesa da solução amadora atual.',
    resposta_objecao: 'Faz sentido — eksy.me cumpre o básico de redirecionar pro WhatsApp. Mas pensa: tu tem Insta verified (raríssimo em personal Palmas) + Medicina do Exercício (autoridade clínica). Aluno potencial que vê teu post, vai pesquisar antes de marcar — cai no eksy.me e vê só "AGENDAR" sem biografia, sem explicação do método, sem distinção do "Coach padrão" pro "Coach com Medicina do Exercício". Recua. LP médica pega esse momento: ele chega e vê biografia + especialização clínica + Avaliação Diagnóstica explicada + formulário anamnese. Mesmo aluno, conversão diferente. E vi que tu segue/é seguido pelo Gabriel (GB Nutrition) — ele é meu cliente. Topa ver caso?',
    nota_interna: '🟡 BLOQUEIO SOFT — preferível aguardar lançamento Gabriel (semana que vem) pra ter network como prova social. Pode disparar antes adaptando o pitch (sem mencionar Gabriel) — pitch ainda funciona pelo verified + Medicina do Exercício, só perde 1 vetor de prova social.\n\nINSTA VERIFICADO em personal Palmas é RARÍSSIMO — autoridade extra. Pegar telefone via eksy.me. Network direta com Gabriel-mãe = vetor de menção (usar APÓS lançamento). Pre-engajamento Insta D-1 obrigatório (curtir 2 posts técnicos longevidade ou avaliação funcional). Pitch padrão R$499 ou complexo R$799-999 (formulário anamnese + área membros + integração).',
    abertura: `Boa noite, Júnior

Vi que tu tem Insta verified (raríssimo em personal Palmas) + Medicina do Exercício como especialização — autoridade clínica rara
O link da bio é eksy.me — aluno premium que paga R$500+/mês pesquisa MUITO antes de fechar e não vê biografia clínica
Quanto desse aluno premium recua no eksy.me sem ver tua especialização?`,
    followup_d3: `Ei Júnior, voltei rapidinho — uma coisa que vejo em personal verified premium
Medicina do Exercício é diferencial clínico — eksy.me não comunica nem 10% disso. Faz sentido pra ti?`,
    followup_d7: `Tô parando por aqui pra não encher
Minha porta fica aberta quando fizer sentido`,
    pre_engajamento_ig: 'D-1: seguir, curtir 2 posts técnicos (priorizar longevidade ou avaliação diagnóstica, NÃO foto pessoal). NÃO comentar (verified recebe muito comentário genérico). Pre-warming via consumo do conteúdo.',
    razao_ranking: 'TIER S (score 9). VERIFIED Insta = autoridade extra. Medicina do Exercício = nicho clínico premium. eksy.me = sinal de compra. Network Gabriel-mãe direta. Pitch padrão R$499 ou complexo R$799-999.',
  },

  1152: {
    tier: 'A',
    posicao_no_tier: 51,
    dor: 'José Wilker é Personal Trainer com tese forte de COMUNIDADE: "+200 alunos transformados | teamJW". Bio: "Saúde e perfomance. Casado @gabriellasoza. Clica e faça parte do teamJW". CREF14/GO-TO Palmas confirmado via Google. 2.048 seg + 87 posts. Site atual: clique.ink/0xuta1 (amador BR). Network dupla GB+Gabriel. Diferencial vs Gabriel-mãe: ele vende COMUNIDADE/MOVIMENTO ("teamJW"), enquanto Gabriel-mãe vende método individual. Conceito "team" tem POTENCIAL DE MEMBERSHIP RECORRENTE — mas hoje tá jogado fora porque clique.ink não tem área de membros, tabela de planos, ranking de alunos.',
    gancho: 'LP TEAMJW MEMBERSHIP AREA — pivotar a tese "team" em produto recorrente real. Estrutura: biografia + +200 alunos transformados + área de membros (treinos progressivos + chat exclusivo + nutricionista parceira opcional + ranking de alunos com transformações) + assinatura mensal R$199-299/mês (premium pelo módulo membership) + planos trimestral/anual com desconto. Posicionar não como "personal solo" mas como "comunidade fitness com método" — alteração radical de produto que justifica ticket recorrente alto.',
    objecao: '"Tô conseguindo alunos pelo Insta, +200 transformados, tá funcionando" — defesa do operacional atual + autoridade construída.',
    resposta_objecao: 'Concordo — +200 alunos é número que poucos personal palmenses tem. Mas pensa: tu posiciona "teamJW" como comunidade, mas hoje teamJW é só HASHTAG. Não tem área onde aluno antigo conversa com aluno novo, não tem ranking de transformações pra inspirar quem entrou ontem, não tem treinos progressivos por nível. teamJW é tese sem produto. LP membership area transforma a tese em produto recorrente: aluno paga R$199-299/mês e tem comunidade + treinos + chat + ranking. Tu para de vender hora de personal e vende ASSINATURA. R$200/mês x 50 alunos = R$10k recorrente, sem precisar de novo aluno todo mês. Topa ver?',
    nota_interna: '🟡 BLOQUEIO SOFT — preferível aguardar lançamento Gabriel (semana que vem). Pode disparar antes adaptando (sem mencionar Gabriel-mãe) — pitch funciona pelo "+200 alunos transformados" + tese teamJW.\n\nPITCH MEMBERSHIP RECORRENTE — diferente do pitch padrão personal solo. R$499 setup + R$199-299/mês justifica pelo módulo membership area. Network dupla com Gabriel-mãe = vetor de menção (usar APÓS lançamento). Pegar telefone via clique.ink. Pre-engajamento Insta D-1 obrigatório.',
    abertura: `Boa noite, José

Vi que tu tem +200 alunos transformados + posicionamento "teamJW" como comunidade — autoridade construída em volume
Hoje "team" só vive como hashtag — não tem área de membros, ranking de transformações, treinos por nível
Tu sente que esse posicionamento de comunidade poderia render mais do que rende hoje?`,
    followup_d3: `Ei José, voltei rapidinho — uma coisa que vejo em personal com tese forte
"Team" como hashtag não vira receita — membership area transforma em assinatura recorrente real. Faz sentido pra ti?`,
    followup_d7: `Tô parando por aqui pra não encher
Minha porta fica aberta quando fizer sentido`,
    pre_engajamento_ig: 'D-1: seguir, curtir 2 posts (priorizar transformação de aluno OU conteúdo team — NÃO foto pessoal). Comentar 1 com algo específico ("a tese teamJW como comunidade é diferenciada — vejo poucos personal pensando em assinatura recorrente"). Personal valoriza pre-engajamento estratégico.',
    razao_ranking: 'TIER S (score 8). PITCH ESPECIAL membership area — diferente do pitch padrão personal solo. teamJW = tese forte que pode virar produto recorrente. R$499 setup + R$199-299/mês = ROI premium. CREF GO-TO + network Gabriel-mãe.',
  },

  1153: {
    tier: 'A',
    posicao_no_tier: 52,
    dor: 'Rodolpho Margonari é Personal Trainer entry-level: 925 seguidores (abaixo do sweet spot LP), 101 posts, CREF 002143-G/TO confirmado. Bio: "Instrutor de fitness | Te ajudo a chegar na sua melhor versão | Personal Trainer | Casado @mmargonari Palmas-To". ZERO link externo. Network tripla GB+Gabriel+Letícia. Volume baixo MAS qualidade maturidade compensa: bio explícita Palmas-TO + CREF + zero web = pacote "Tier A alto potencial" especialmente porque ticket de upsell é fácil (vai de R$300 pra R$500/mês com LP profissional).',
    gancho: 'LP ENTRY-LEVEL Rodolpho — pacote essencial R$499 setup + R$79-99/mês (tier econômico pela faixa <1k seg). Foco em formulário simples + agendamento + 5 depoimentos + biografia + CREF em destaque. Conforme ele cresce em seg, upgrade pra plano completo. Pitch: "comece a captura agora, antes de chegar em 3k seg — depois é só ampliar".',
    objecao: '"Não tenho volume Insta ainda, vou esperar crescer" — defesa do estágio atual.',
    resposta_objecao: 'Justamente porque tu tá começando, LP faz mais sentido AGORA — não depois. Personal com 5k seg que monta LP só captura quem JÁ segue. Tu, que tá com 925 e crescendo, monta LP agora e cada novo seguidor já cai num funil de captura — em vez de só ver post + esquecer. Em 6 meses, quando tu tiver 3k seg, já tá com 50-80 alunos capturados pela LP. Caso de personal que começou exatamente assim aqui em Palmas — quer ver?',
    nota_interna: '🟡 BLOQUEIO SOFT — preferível aguardar lançamento Gabriel (semana que vem). Network tripla é o vetor mais "fraco" entre os clones-Gabriel (vs case-clone direto). Pode disparar antes adaptando — pitch funciona pelo argumento "momento ÚNICO de crescimento + LP captura cada novo seguidor".\n\nTIER A entry-level. Pitch ECONÔMICO (R$79-99/mês manutenção). Network tripla com Gabriel-mãe = vetor de menção (usar APÓS lançamento). Pegar telefone via DM Insta. CREF confirmado bio. Pre-engajamento Insta D-1 obrigatório.',
    abertura: `Boa noite, Rodolpho

Vi que tu tem CREF GO-TO + bio explícita Palmas + posicionamento técnico ("melhor versão") — base bem montada
Tu tá num momento ÚNICO de crescimento, mas zero link externo — cada novo seguidor vê post e esquece
Deixa eu te perguntar: cada novo seguidor cai num funil que captura, ou só vê e some?`,
    followup_d3: `Ei Rodolpho, voltei rapidinho — uma coisa que vejo em personal entry-level
LP montada AGORA (no início) captura cada novo seguidor desde o zero — vs quem monta depois de 5k seg. Faz sentido pra ti?`,
    followup_d7: `Tô parando por aqui pra não encher
Minha porta fica aberta quando fizer sentido`,
    pre_engajamento_ig: 'D-1: seguir, curtir 2 posts (priorizar transformação OU método, não foto pessoal). Comentar 1 com algo do tipo "ver personal Palmas com CREF GO-TO consistente é raro mesmo" ou referência ao método.',
    razao_ranking: 'TIER A (score 7.5). Entry-level com alto potencial de upgrade. Pitch econômico R$499 + R$79-99/mês. CREF GO-TO + network Gabriel-mãe. Aluno em fase de construção é momento ÚNICO de montar funil.',
  },

  // ── TIER A (CIC #11 — 26/04 ed. física via Google IA Overview CREF) — 2 leads ──
  // Round usou método NOVO descoberto: Google IA Overview com query
  // "CREF GO-TO" entregou 7 personal trainers pré-validados em 1 query.
  // Mais eficiente que /following/. Atila Santos = SÓSIA PERFEITO Gabriel.

  1155: {
    tier: 'A',
    posicao_no_tier: 45,
    dor: 'Átila Santos é SÓSIA PERFEITO do Gabriel Barros (case-mãe ATIVO Impulso): Atleta Fisiculturista + Personal Trainer + Consultoria Online + Palmas-TO + CREF G/TO 0001962. 5.840 seguidores Insta + 354 posts. Bio com mesma estrutura do Gabriel ("Atleta + Personal + Consultoria Online"). DESTAQUE Insta "Relatos Online" = depoimentos de consultoria JÁ PRONTOS pra virar prova social na LP. Site atual: wa.me/5563984451564 direto (ZERO LP — sinal de compra puríssimo). 354 posts + 5.8k seg + Relatos Online cheio = DEMANDA COMPROVADA + zero infraestrutura de captura. Diferença vs Gabriel: nicho COMPLEMENTAR (Gabriel vende método/transformação corporal; Átila vende performance fisiculturismo/preparação palco), mercados não-competitivos.',
    gancho: 'PITCH ESPELHO direto via Gabriel-mãe: "Átila, vi que tu segue o Gabriel Barros (@gbnutritionn) — ele é meu cliente. Tu é o ÚNICO sósia perfeito dele que mapeei em Palmas: mesma estrutura de bio, mesmo nicho atleta-personal, mesmo modelo consultoria online. Diferença é que ele tem LP profissional captando aluno fora do horário, e tu tá com 354 posts + Relatos Online cheio caindo num wa.me direto." Pitch tem 2 alavancas:  (1) PROVA SOCIAL READY-TO-USE — "Relatos Online" vira galeria scrollable de transformações na LP, não precisa criar conteúdo novo; (2) NICHO COMPETIÇÃO/PALCO = ticket premium (R$300-800/mês) — LP com formulário "qual seu objetivo" (definição/hipertrofia/preparação palco) + checkout 3 planos + área de membros com vídeos posados/dieta/periodização.',
    objecao: '"Eu já vendo direto pelo wa.me, alunos chegam por indicação" — operação ativa defendendo o que funciona.',
    resposta_objecao: 'Concordo — 354 posts + 5.8k seg + Relatos Online cheio mostra que tu construiu autoridade e indicação real. Mas pensa: cada post teu de competição chega em 1.000-2.000 pessoas. Quantas dessas pensam "tô interessada nessa preparação de palco" e somem na fricção do "vou mandar mensagem depois"? Sem LP, esse aluno potencial perde ti por inércia — ele esqueceu de mandar DM no momento certo. LP não substitui Insta — captura quem viu post e teria perdido. E olha — vi que tu tem destaque "Relatos Online" cheio: isso vira galeria scrollable na LP em 1 dia de produção. Tu já tem o conteúdo, falta só a infraestrutura. Topa eu te mostrar o que mudou pro Gabriel quando ele montou a LP?',
    nota_interna: '⛔ BLOQUEIO HARD — AGUARDAR LANÇAMENTO DA LOJA DO GABRIEL (semana que vem). SÓSIA PERFEITO 1:1 do Gabriel — disparar sem mencionar Gabriel destrói o pitch único deste lead. Esse é o ÚNICO lead do banco com essa caracterização — vale esperar a janela certa.\n\nAPÓS lançamento Gabriel: falar com Gabriel pra (1) confirmar permissão usar nome dele, (2) checar se eles se conhecem pessoalmente (provável — networking fitness Palmas é fluido), (3) possível indicação direta. Telefone (63)98445-1564 confirmado wa.me. CREF G/TO 0001962 confirmado bio. Pre-engajamento Insta D-1 OBRIGATÓRIO (curtir 2 posts de competição/palco — NÃO foto pessoal genérica). Pitch "complexo" provável (R$799-999) — Plano LP Consultoria com área de membros + checkout 3 planos + galeria Relatos Online scrollable.',
    abertura: `Boa noite, Átila

Vi que tu é Atleta Fisiculturista + Personal + Consultoria Online + CREF G/TO em Palmas — combinação rara
Tem 354 posts + destaque "Relatos Online" cheio, mas o link da bio é wa.me direto — prova social não tá em galeria scrollable acessível
Tu sente que aluno novo recua sem ver os Relatos organizados?`,
    followup_d3: `Ei Átila, voltei rapidinho — uma coisa que vejo em atleta-personal premium
"Relatos Online" cheio é prova social pronta — só falta vitrine. Faz sentido pra ti?`,
    followup_d7: `Tô parando por aqui pra não encher
Minha porta fica aberta quando fizer sentido`,
    pre_engajamento_ig: 'D-1 OBRIGATÓRIO: seguir, curtir 2 posts (priorizar conteúdo de COMPETIÇÃO/PALCO ou Relato Online de aluno transformado — NÃO foto pessoal genérica). Comentar 1 com algo específico técnico ("a periodização pra preparação de palco com volume + cutting é raro de ver com esse rigor mesmo"). Atleta competidor valoriza pre-engajamento técnico.',
    razao_ranking: 'TIER S RECORD (score 10!). SÓSIA PERFEITO do Gabriel (único do banco com essa caracterização). "Relatos Online" cheio = prova social READY-TO-USE. Nicho COMPLEMENTAR (não compete com Gabriel-mãe). Pitch ESPELHO via Gabriel + pedir indicação. Plano LP Consultoria R$799-999 (galeria + área membros + checkout 3 planos).',
  },

  1156: {
    tier: 'A',
    posicao_no_tier: 53,
    dor: 'Adria Mota é Personal Trainer feminina solo Palmas-TO com CREF 002460 GO/TO. Bio EXPLÍCITA "Personal Trainer e Consultoria Online" — match PERFEITO com a direção que Eduardo apontou (sub-persona consultor online recorrente). 1.414 seg + 93 posts. SEGUIDA por @gabribarros10 (network direta Gabriel). PROBLEMA CRÍTICO identificado: link in bio redireciona pra @tebasconceito01 (academia/parceiro) — diluição de marca + ZERO captura própria. Aluno potencial cai no perfil do parceiro, não nela. Ela tem CREF próprio, declarou consultoria online em bio, mas o canal não comunica isso — vai pro parceiro.',
    gancho: 'PITCH ESPECIAL "saída da diluição": "Adria, vi que tu tem CREF próprio + bio declarando Consultoria Online + segue o Gabriel Barros. Mas o link da tua bio redireciona pra @tebasconceito01. O que isso significa pro aluno potencial: ele clica esperando achar TUA página, cai na do parceiro, e Tu perde a captura. LP profissional Adria Mota Consultoria Online resolve isso: domínio próprio + galeria de transformações + formulário triagem (objetivo/restrições/disponibilidade) + checkout planos online + área de membros simples. Tu mantém a parceria com Tebas Conceito (não desliga), mas separa TUA marca."',
    objecao: '"Tô tranquila com o link da Tebas, é parceria, dá certo" — defesa do operacional atual.',
    resposta_objecao: 'Faz sentido — parceria com academia é canal forte, e tu não precisa desligar isso. Mas pensa: tu DECLAROU "Consultoria Online" na tua bio. Aluno potencial que viu teu post e quer fechar consultoria online clica no link, esperando ver TEU método, TEUS planos, TUA galeria de transformações. Cai no perfil do Tebas Conceito (academia presencial). Recua. Ele queria TI, não a academia. LP profissional tua resolve isso sem desligar a parceria: link bio aponta pra adriamota.com.br (ou similar), tu vende consultoria online ali, e a Tebas Conceito continua sendo parceria de espaço físico. Mesma operação, marca separada. Topa ver?',
    nota_interna: '🟡 BLOQUEIO SOFT — preferível aguardar lançamento Gabriel (semana que vem). Pode disparar antes adaptando (sem mencionar Gabriel) — pitch funciona pelo argumento "saída da diluição de marca" (link bio aponta pra parceiro, não pra ela).\n\nCASO ÚNICO no banco — lead com bio explícita de consultoria online MAS link diluído em parceiro. Pitch RADICAL é "saída da diluição de marca". CREF 002460 GO/TO confirmado. Telefone NÃO veio direto — pegar via DM Insta. SEGUIDA POR Gabriel = mencionar é vetor APÓS lançamento dele. Pre-engajamento Insta D-1 obrigatório. Pitch padrão R$499 + R$99/mês ou complexo R$799 + R$199/mês com área de membros se ela topar plano premium.',
    abertura: `Boa noite, Adria

Vi que tu tem CREF GO/TO próprio + bio explícita "Personal Trainer e Consultoria Online" — posicionamento bem claro
O link da bio redireciona pra @tebasconceito01 — aluno que quer TUA consultoria cai no perfil do parceiro
Quanto aluno recua nesse momento de "ele queria TI, não a academia"?`,
    followup_d3: `Ei Adria, voltei rapidinho — uma coisa que vejo em personal com marca própria
Parceria com academia não desliga — só precisa separar TUA marca de consultoria online. Faz sentido pra ti?`,
    followup_d7: `Tô parando por aqui pra não encher
Minha porta fica aberta quando fizer sentido`,
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
    posicao_no_tier: 49,
    dor: 'Dr. Marcel Freitas é Médico do Esporte CRM-TO 3949 + RQE 3191. 7.085 seguidores Insta + 178 posts + 10 anos de experiência. ATENDE 2 PERFIS DE PACIENTE: (1) atletas/esportistas pra performance e recuperação, (2) procedimento alto-ticket de Transplante Capilar (R$8.000-15.000 por sessão). Site atual: bit.ly/AgendamentosNewLife (URL shortener amador). Destaques estruturados (Pacientes / Perguntas / Transplante Capilar) mostram que ele tem PROGRAMA de atendimento, mas falta funil que canalize/qualifique paciente premium. Cada post chega em milhares mas sem captura — paciente novo de transplante (que vai gastar R$10k+) precisa pesquisar e ver biografia + casos + processo, não cair em bit.ly genérico.',
    gancho: 'PONTE VERTICAL FITNESS — Marcel atende ATLETAS e o GB Nutrition (Gabriel) é nosso case ATIVO em Palmas que vende suplemento pra atletas. Bridge natural: "Dr. Marcel, vi teu trabalho de Médico do Esporte e o Gabriel Barros (@gbnutritionn) é meu cliente — ele atende atletas como tu e a gente trabalhou junto na LP profissional + Shopify dele. Vocês têm overlap de público (atletas Palmas)." LP New Life com formulário triagem (objetivo emagrecimento/performance/transplante capilar/longevidade) + agendamento Calendly + pacotes acompanhamento mensal + área de pacientes com vídeos de orientação + integração WhatsApp Business. Cross-sell: alunos do Júnior Sá / Marcel Freitas como bridge médico-treinador.',
    objecao: '"Tô bem com bit.ly, paciente acha pelo Insta" — defesa do operacional atual que parece funcionar.',
    resposta_objecao: 'Faz sentido — bit.ly cumpre o básico. Mas pensa pelo lado do paciente novo de transplante capilar: ele vai gastar R$10-15k. Pesquisa MUITO antes de marcar — quer ver biografia, casos antes/depois (com ética), processo, recuperação, garantia. Cai no bit.ly e vê só "AGENDAR" sem nada disso. 70% recua. LP profissional pega esse momento: ele chega e vê biografia + CRM/RQE + galeria casos com cuidado ético + FAQ ("dói?", "quanto tempo recuperação?", "qual o método?") + agendamento integrado. Mesmo paciente, conversão diferente. E olha — vi que tu tem network com o Gabriel Barros (GB Nutrition), ele é meu cliente. Vocês se conhecem?',
    nota_interna: '⛔ BLOQUEIO HARD — AGUARDAR LANÇAMENTO DA LOJA DO GABRIEL (semana que vem). Network confirmado com Gabriel é vetor central do pitch (@joaolabre videomaker GB segue Marcel). Disparar antes do Gabriel mencionar Impulso queima a oportunidade de apresentar Gabriel como case real.\n\nNÃO TEMOS case médico real ainda — proposta SHOWCASE R$200 desconto pra Marcel virar PRIMEIRO CASE médico esporte da Impulso. APÓS lançamento Gabriel: falar com Gabriel sobre Marcel (provavelmente conhece). Telefone NÃO veio direto (bit.ly) — abrir e capturar. RQE 3191 confirmado. Pre-engajamento Insta D-1 obrigatório. Pitch "complexo" R$799-999 (formulário multi-categoria + área pacientes + Calendly).',
    abertura: `Doutor, boa noite

Vi que você é Médico do Esporte CRM-TO 3949 + RQE com nicho duplo (atletas + transplante capilar) — combinação rara
O link da bio é bit.ly — paciente de transplante capilar vai gastar R$10-15k e cai num link sem biografia, casos, FAQ
Quanto desse paciente premium recua antes mesmo de marcar?`,
    followup_d3: `Ei doutor, voltei rapidinho — uma coisa que vejo em médico do esporte com nicho duplo
Ticket alto (transplante R$10k+) exige LP que canalize, não bit.ly genérico. Faz sentido pra você?`,
    followup_d7: `Tô parando por aqui pra não te incomodar, doutor
Minha porta fica aberta quando fizer sentido`,
    pre_engajamento_ig: 'D-1: seguir, curtir 2 posts (priorizar conteúdo técnico de medicina do esporte OU transplante capilar — NÃO foto pessoal). NÃO comentar (médico recebe muito comentário genérico). Pre-warming via consumo do conteúdo. Mencionar Gabriel na 1ª mensagem é vetor direto (eles têm network confirmado).',
    razao_ranking: 'TIER S (score 9.5). Médico do Esporte com nicho duplo (atleta + transplante capilar) = 2 funis de receita potencial. Network confirmado com Gabriel/GB Nutrition (case real Impulso). Bit.ly amador = sinal de compra. PROPOSTA: 1º case médico Impulso com R$200 desconto pra virar showcase. Pitch "complexo" R$799-999.',
  },

  1158: {
    tier: 'A',
    posicao_no_tier: 11,
    dor: 'Dr. Rudinei Brunetto é urologista CRM-TO 4856 + RQE 2183 com sub-especialização em Uro-oncologia + Cirurgia Robótica. Endereço Qd. 401 Sul Av Lo 11, Clínica Salus Palmas-TO. 293 posts + 1.000+ pacientes atendidos + 5 destaques cirúrgicos estruturados (Enuc.Próstata / Cir.Robótica / Hérnia VL / CA Próstata / Mídia). 2.644 seguidores. Site atual: linktr.ee/dr.rudineibrunetto. CASO PERFEITO de "autoridade clínica + still uses linktr.ee" = ponto IDEAL de upgrade. Ticket altíssimo: cirurgia robótica R$8.000-25.000 + consultas R$400-700 + acompanhamento pré/pós-cirúrgico.',
    gancho: 'ARGUMENTO ESTRUTURAL — urologista solo com 1.000+ pacientes operados + 5 destaques cirúrgicos estruturados + ZERO domínio profissional = combinação que paga LP profissional com 1 cirurgia robótica fechada. LP Dr. Rudinei Brunetto Uro-oncologia: hero com 1.000+ pacientes + galeria casos cirúrgicos (com cuidado ético CFM) + biblioteca orientações pré-cirúrgicas + formulário triagem (CA próstata / hérnia / incontinência / vasectomia / robótica) + agendamento integrado + área de pacientes pós-cirúrgicos com follow-up + 3 artigos SEO ("cirurgia robótica próstata Palmas", "vasectomia segura", "uro-oncologia Tocantins"). Pitch: "a cirurgia robótica de Palmas merece a primeira LP médica robótica do estado".',
    objecao: '"Já tenho linktr.ee, paciente do hospital me indica, tá funcionando" — defesa da indicação como canal principal.',
    resposta_objecao: 'Total razão — indicação médica é o canal mais nobre e tu tem 1.000+ pacientes que viraram boca-a-boca. Mas pensa: o paciente NOVO indicado pelo cunhado dele que ouviu falar do "urologista da robótica em Palmas" vai pesquisar "Dr. Rudinei Brunetto urologia Palmas" antes de marcar (decisão cirúrgica, alta confiança). Cai no linktr.ee e vê 5 links sem catálogo cirúrgico, sem CFM em destaque, sem casos. Recua. LP profissional pega exatamente esse momento: ele chega e vê biografia + RQE Uro-oncologia + 5 procedimentos catalogados com FAQ ético + galeria casos. Mesmo paciente indicado, conversão diferente. E posso te oferecer uma coisa: tu pode virar o primeiro case URO da Impulso com R$200 desconto — vira showcase pra outros urologistas de Palmas. Topa?',
    nota_interna: 'PROPOSTA SHOWCASE prioritária — Rudinei pode virar PRIMEIRO CASE URO da Impulso (R$200 desconto). Telefone (63)3322-3278 confirmado Maps (fixo Clínica Salus — VALIDAR celular WhatsApp via linktr.ee). RQE 2183 confirmado. Pre-engajamento Insta D-1 obrigatório (curtir 2 posts técnicos cirúrgicos, NÃO comentar). Pitch "complexo" R$899-1.297 (5 destaques + galeria + área pacientes + 3 artigos SEO premium).',
    abertura: `Doutor, boa noite

Vi que você é urologista CRM-TO 4856 com Cirurgia Robótica + Uro-oncologia + 1.000+ pacientes operados — autoridade rara
O link da bio é linktr.ee — paciente de cirurgia robótica (R$15-25k) cai sem ver catálogo cirúrgico, RQE, casos
Quanto desse paciente premium recua nesse momento?`,
    followup_d3: `Ei doutor, voltei rapidinho — uma coisa que vejo em cirurgião urológico premium
"Cirurgia robótica Palmas" no Google não tem dono — quem chegar primeiro com LP fica com a busca por anos. Faz sentido pra você?`,
    followup_d7: `Tô parando por aqui pra não te incomodar, doutor
Minha porta fica aberta quando fizer sentido`,
    pre_engajamento_ig: 'D-1: seguir, curtir 2 posts técnicos (priorizar conteúdo cirúrgico ou educativo sobre próstata/uro — NÃO foto pessoal). NÃO comentar (cirurgião recebe genérico).',
    razao_ranking: 'TIER S (score 9.5). Cirurgia robótica = ticket altíssimo (R$8-25k por procedimento). Linktree amador = oportunidade clara. PROPOSTA SHOWCASE pra virar 1º case URO Impulso. Volume 2.6k é OURO (autoridade clínica + ainda amador). Pitch "complexo" R$899-1.297.',
  },

  1159: {
    tier: 'A',
    posicao_no_tier: 24,
    dor: 'Dr. Tarcísio Andrade é urologista CRM-TO 7893 + RQE 3686 com sub-especialização Uro-oncologia + Robótica + Vasectomia. 116 posts + 1.403 seg. BIO COMEÇA COM "Empreendedor" — mindset de venda já pronto (raro em médico, geralmente é elemento de identidade). Membro Titular Sociedade Brasileira de Urologia. Destaques estruturados (Orientações / Robótica / TCG / Vasectomia / Próstata) já formam funil informacional. Site atual: linktr.ee/drtarcisioandrade.uro. Volume médio (em construção, recente) mas posicionamento já maduro — falta a página que CONVERTE essa autoridade.',
    gancho: 'ARGUMENTO DIRETO via mindset empreendedor explícito — "vi tua bio começa com EMPREENDEDOR. Urologistas que se posicionam como empreendedores faturam 3-5x mais que urologistas que se posicionam como médicos puros". LP Dr. Tarcísio Empreendedor: formulário "qual procedimento te interessa?" (vasectomia/cirurgia robótica/uro-oncologia/orientação) + checkout vasectomia online (procedimento de ticket previsível) + área pacientes pré/pós + integração SBU credibilidade + 3 artigos SEO ("vasectomia Palmas TO segura", "cirurgia robótica urológica", "uro-oncologia tratamento"). Diferencial vs Rudinei: foco em VASECTOMIA como produto-âncora de funil (procedimento de ticket previsível, decisão masculina racional, conversão alta com LP).',
    objecao: '"Tô construindo agora, prefiro investir em mais conteúdo Insta primeiro" — defesa do estágio inicial.',
    resposta_objecao: 'Faz sentido — conteúdo Insta é fundamental, e tu tá na fase certa. Mas pensa: tu posicionou "Empreendedor" na bio — isso é mindset de quem entende que precisa de funil agora, não depois. Urologista que monta LP enquanto cresce no Insta captura cada novo seguidor desde o zero (vai virando lead, não só folower). Quem só monta DEPOIS de chegar a 5k segue capturou zero ao longo da curva. Custo é o mesmo (R$499), retorno acumulado é dramaticamente diferente. Tu já é Membro SBU, tu já cresce — falta o canal que captura. Topa ver?',
    nota_interna: 'BIO COMEÇA COM "EMPREENDEDOR" = lead diferente da maioria dos médicos (mindset comercial pronto). PROPOSTA SHOWCASE válida — pode virar 2º case URO Impulso ou primeiro de "vasectomia Palmas". Telefone NÃO veio direto — pegar via linktr.ee. RQE 3686 confirmado. Pre-engajamento Insta D-1 obrigatório (curtir 2 posts educativos, NÃO comentar).',
    abertura: `Doutor, boa noite

Vi que sua bio começa com "Empreendedor" (raro em médico) + Membro SBU + Cirurgia Robótica + Vasectomia — mindset diferenciado
O link da bio é linktr.ee — médico empreendedor com mindset comercial deveria ter funil de captura, não link genérico
Cada novo seguidor seu cai num funil que captura, ou só vê e some?`,
    followup_d3: `Ei doutor, voltei rapidinho — uma coisa que vejo em urologista empreendedor
LP montada agora captura cada novo seguidor desde o zero — vs montar depois e capturar zero retroativo. Faz sentido pra você?`,
    followup_d7: `Tô parando por aqui pra não te incomodar, doutor
Minha porta fica aberta quando fizer sentido`,
    pre_engajamento_ig: 'D-1: seguir, curtir 2 posts (priorizar conteúdo de vasectomia OU empreendedorismo médico — bio dele declara "Empreendedor"). NÃO comentar.',
    razao_ranking: 'TIER S (score 8.5). Mindset "Empreendedor" explícito + Membro SBU + RQE robótica = perfil ideal. Volume crescendo = momento ÚNICO de montar LP. Pitch padrão R$499 + R$99/mês ou complexo R$799-999 com checkout vasectomia online.',
  },

  1160: {
    tier: 'A',
    posicao_no_tier: 20,
    dor: 'Dr. Hugo Rossoni é reumatologista CRM-TO 3873 + RQE 1688 e PROFESSOR Afya & UNIRG (autoridade ACADÊMICA além da clínica). 6.626 seguidores + 1.139 posts = autoridade máxima editorial. Atende em CERTO + CERTO Prime (clínica multi-prof, perfil próprio mantém solo). Site atual: wa.me/message/R74WM4PL7SOXH1 — WHATSAPP DIRETO ZERO web profissional. CASO ABSURDO: professor universitário de medicina perdendo TODO lead novo de paciente que pesquisa autoridade antes de marcar. Destaques formam biblioteca SEO pronta (fibromialgia / lupus / artrite / osteoporose / cisto sinovial) — basta extrair pra LP.',
    gancho: 'PITCH AUTORIDADE ACADÊMICA: "Professor da Afya e UNIRG perdendo paciente premium em wa.me direto é desperdício de capital social". LP Dr. Hugo Rossoni Reumatologia Palmas: biblioteca SEO de 5-10 artigos técnicos (fibromialgia / lupus / artrite / osteoporose / cisto sinovial — TODOS seus destaques!) + formulário avaliação inicial + agendamento clínica CERTO + área de pacientes com plano de acompanhamento crônico + Prof. Afya autoridade em destaque. Pitch específico: "professor de medicina da Afya merece SEO médico que canaliza pacientes em vez de wa.me direto".',
    objecao: '"Tô na clínica CERTO, eles divulgam, tô tranquilo" — defesa do canal institucional.',
    resposta_objecao: 'Concordo — clínica multi-prof tem força. Mas pensa: paciente novo de fibromialgia que viu teu post sobre "vivendo com fibromialgia" no Insta vai pesquisar "Dr. Hugo Rossoni reumatologista Palmas" antes de marcar (doença crônica, alta confiança). Cai no wa.me direto, vê só "Olá!" sem biografia, sem CRM, sem teu papel de professor da Afya destacado, sem os 5 temas de destaque dele. 70% recua. LP pessoal SUA (não da CERTO) destaca: "Reumatologista + Professor Afya & UNIRG" como diferencial absoluto. Mesmo paciente, conversão diferente. Mantém a CERTO como canal de agendamento, mas LP vira destino oficial da TUA marca pessoal.',
    nota_interna: 'PROFESSOR universitário de medicina = autoridade RARA em prospect Impulso. PROPOSTA SHOWCASE válida — Hugo pode virar PRIMEIRO CASE REUMATO Impulso (R$200 desconto). Telefone NÃO veio direto (wa.me/message) — abrir, capturar número. RQE 1688 confirmado. CRM-TO 3873 confirmado. Pre-engajamento Insta D-1 obrigatório (curtir 2 posts técnicos sobre fibromialgia/lupus). Pitch "complexo" R$899-1.197 (biblioteca SEO 5-10 artigos + área pacientes crônicos + Prof. Afya destaque).',
    abertura: `Doutor, boa noite

Vi que você é Professor Afya & UNIRG + reumatologista CRM-TO 3873 com RQE 1688 — autoridade acadêmica rara
O link da bio é wa.me direto — professor universitário de medicina perdendo paciente novo num "Olá!" sem biografia, sem teus 5 temas
Quanto paciente recua antes mesmo de saber do papel acadêmico?`,
    followup_d3: `Ei doutor, voltei rapidinho — uma coisa que vejo em médico professor
5 destaques (fibromialgia/lupus/artrite/osteoporose) = 5 artigos SEO prontos esperando virar página. Faz sentido pra você?`,
    followup_d7: `Tô parando por aqui pra não te incomodar, doutor
Minha porta fica aberta quando fizer sentido`,
    pre_engajamento_ig: 'D-1: seguir, curtir 2 posts técnicos sobre fibromialgia/lupus/artrite (priorizar conteúdo educativo, NÃO foto pessoal). NÃO comentar (médico recebe muito comentário paciente). Pre-warming via consumo do conteúdo.',
    razao_ranking: 'TIER S (score 8). Professor Afya = autoridade ACADÊMICA rara. wa.me direto = sinal de compra extremo. 5 destaques = 5 artigos SEO prontos. PROPOSTA SHOWCASE 1º case REUMATO Impulso. Pitch "complexo" R$899-1.197.',
  },

  1161: {
    tier: 'A',
    posicao_no_tier: 19,
    dor: 'Dr. Daniel Janczuk é cardiologista CRM-TO 4081 + RQE 1763 e EX-PRESIDENTE da Sociedade Brasileira de Cardiologia Tocantins 2024-2025 (autoridade MÁXIMA da cardiologia no estado — top 1-2). 1.955 posts + 10.300 seguidores. Atende Particular Prime - Certo Prime + Convênios. Telefone (63)99977-1541 confirmado bio. Site atual: linktr.ee/CardiologistaDanielJanczuk. CASO DESPROPORCIONAL: ex-presidente SBC-TO usando linktree é como Mercedes em estacionamento de bicicleta. Pacientes de classe A/B que pesquisam autoridade cardiológica antes de marcar consulta de R$500-700 NÃO encontram a página que ele merece.',
    gancho: 'PITCH PREMIUM AUTORIDADE-MÁXIMA: "Ex-Presidente SBC-TO 2024-2025 é autoridade RARÍSSIMA — pacientes premium pesquisam autoridade ANTES de qualquer marca/clínica. Linktree é desproporcional ao calibre". LP Dr. Daniel Janczuk Premium Cardiologia: hero com selo Ex-Presidente SBC-TO em destaque + biografia médica completa + biblioteca SEO técnica (HAS / dislipidemia / IAM prevenção / check-up cardiológico / risco cardiovascular) + agendamento Particular/Convênios diferenciado + área pacientes com exames + teleconsulta para retorno + tele-laudo. Pitch ESPECIAL: "autoridade SBC merece a primeira LP cardiologia premium do estado".',
    objecao: '"10k seguidores + linktree dá conta, paciente acha" — defesa de quem já tem volume.',
    resposta_objecao: 'Tu tem RAZÃO em parte — 10k seg + ex-presidente SBC = autoridade que poucos cardiologistas do Brasil têm. Mas pensa pelo perfil de paciente classe A/B que tu atende: ele pesquisa "Daniel Janczuk cardiologista Palmas" no Google, cai no linktree, vê 5 links sem hierarquia. Onde está o selo "Ex-Presidente SBC-TO"? Onde está a explicação de check-up cardiológico premium? Onde está o canal Particular vs Convênios distinto? Linktree planifica tudo. LP premium destaca tudo. Mesmo paciente, conversão diferente. PROPOSTA: tu pode virar 1º case CARDIO premium Impulso com R$200 desconto — vira showcase pra outros cardiologistas de prestígio em Palmas/Tocantins. Topa?',
    nota_interna: 'EX-PRESIDENTE SBC-TO = autoridade MÁXIMA do estado. PROPOSTA SHOWCASE prioritária — se Daniel fechar, vira case CARDIO PREMIUM da Impulso (resto dos cardiologistas Palmas vai querer). Telefone (63)99977-1541 confirmado bio. Pre-engajamento Insta D-1 obrigatório (curtir 2 posts técnicos cardiológicos, NÃO comentar — 10k seg recebe muito genérico). Pitch "complexo Premium" R$1.197-1.497 (autoridade SBC + Particular vs Convênios + biblioteca SEO + área pacientes + tele-laudo).',
    abertura: `Doutor, boa noite

Vi que você é Ex-Presidente SBC-TO 2024-2025 + cardiologista CRM-TO 4081 — autoridade máxima do estado, raríssima
O link da bio é linktr.ee — paciente classe A/B que pesquisa antes de marcar consulta R$500-700 cai num linktree genérico, sem selo Ex-Presidente SBC
Quanto desse paciente premium percebe a desproporção e recua?`,
    followup_d3: `Ei doutor, voltei rapidinho — uma coisa que vejo em médico de autoridade máxima
Linktree planifica autoridade — LP premium destaca selo SBC + Particular vs Convênios + tele-laudo. Faz sentido pra você?`,
    followup_d7: `Tô parando por aqui pra não te incomodar, doutor
Minha porta fica aberta quando fizer sentido`,
    pre_engajamento_ig: 'D-1: seguir, curtir 2 posts técnicos cardiológicos (priorizar conteúdo educativo de risco cardiovascular OU prevenção, NÃO foto pessoal). NÃO comentar (10k seg + verified-tier recebe muito genérico).',
    razao_ranking: 'TIER S (score 8). EX-PRESIDENTE SBC-TO = autoridade máxima cardiologia estado. 10k seg acima sweet spot mas autoridade compensa. PROPOSTA SHOWCASE PREMIUM — 1º case CARDIO Impulso. Pitch Premium R$1.197-1.497.',
  },

  1162: {
    tier: 'A',
    posicao_no_tier: 22,
    dor: 'Dr. Edson Pedroza é reumatologista CRM-TO 2799 com RQE 2054 TRIPLO (Reumatologia + Clínica Médica + Medicina do Trabalho). 2.342 POSTS — RECORDE editorial absoluto da rodada de prospecção (consistência monumental). 4.775 seguidores. Posicionamento humanizado "escuta e cuidado". Centro de Reumatologia Tocantins. Site atual: linktr.ee/Dredsonpedroza.reumato. OPORTUNIDADE DUPLA RARA: triplo RQE permite estratégia HIBRIDIZADA — (B2C) reumatologia humanizada + (B2B) Medicina do Trabalho com laudos PCMSO/PPRA pra empresas. Hoje tudo cai num linktr.ee linear que não capitaliza essa diferença.',
    gancho: 'LP DUPLA — explorar o RQE TRIPLO como vantagem competitiva única. (a) LP B2C reumatologia humanizada com calculadora de fibromialgia + biblioteca de orientações + agendamento + área pacientes crônicos; (b) Mini-site B2B Medicina do Trabalho com formulário PCMSO/PPRA empresas + casos corporativos + cotação online. Pitch único: "transformar 2.342 posts em 2 funis de receita simultâneos — paciente individual + empresa contratante". Diferencial vs outro reumato: ninguém em Palmas explora B2B Medicina do Trabalho por LP profissional ainda.',
    objecao: '"Linktree me serve, atendo direto, não preciso de complicação" — defesa do simples atual.',
    resposta_objecao: 'Faz sentido — linktree é simples e funciona. Mas pensa: tu tem RQE TRIPLO — Reumatologia + Clínica Médica + MEDICINA DO TRABALHO. O 3º RQE é canal B2B inteiro (laudos pra empresas, PCMSO, PPRA) que linktree não consegue separar do B2C. Empresa que precisa de PCMSO pesquisa "médico do trabalho Palmas TO" — e cai num linktr.ee genérico misturado com fibromialgia e lupus. Recua. LP estruturada permite SEPARAR os funis — paciente individual entra por uma porta, empresa entra por outra, ambos convertendo. Mesmo médico, 2x receita. Topa ver protótipo?',
    nota_interna: 'OPORTUNIDADE B2B+B2C ÚNICA no banco — explorar RQE TRIPLO como vantagem. Telefone NÃO veio direto (linktr.ee) — pegar antes. RQE 2054 confirmado. PROPOSTA SHOWCASE válida — pode virar 1º case "médico LP dupla B2C+B2B" da Impulso. Pre-engajamento Insta D-1 obrigatório.',
    abertura: `Doutor, boa noite

Vi que você tem 2.342 posts + RQE TRIPLO (Reumatologia + Clínica + Medicina do Trabalho) — recorde editorial e autoridade rara
O link da bio é linktr.ee — empresa que precisa de PCMSO/PPRA cai num link misturado com fibromialgia e lupus
Hoje empresa que busca laudo PCMSO te acha primeiro, ou cai em médico do trabalho genérico?`,
    followup_d3: `Ei doutor, voltei rapidinho — uma coisa que vejo em médico com RQE triplo
Linktree linear não separa B2C (paciente) de B2B (empresa) — LP estruturada vira 2 funis simultâneos. Faz sentido pra você?`,
    followup_d7: `Tô parando por aqui pra não te incomodar, doutor
Minha porta fica aberta quando fizer sentido`,
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
    abertura: `Ei, passei pelo perfil agora

Reparei que tu tem 4.9/73 em moda praia em Palmas — base fiel forte com verão chegando
Cliente que pesquisa biquíni online e não te conhece tem que mandar DM perguntando "tem M?", "aceita cartão?"
Quantas dessas mensagens tu responde por dia antes da cliente bater o martelo?`,
    followup_d3: `Ei, voltei aqui rapidinho — uma coisa que vejo em moda praia
Enquanto tu responde "tem M?" no WhatsApp, a cliente desistiu e foi pra Shein. Tá rolando esse buraco?`,
    followup_d7: `Tô parando por aqui pra não encher
Verão chega forte e Copa em 6 semanas — minha porta fica aberta quando fizer sentido`,
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
    abertura: `Ei, passei pelo perfil agora

Reparei que tu tem 91 avaliações com 4.6 em moda masculina em Palmas — base consolidada
Cliente que viu look teu no Insta lá do Plano Diretor Sul ou em Paraíso trava em "tem que ir presencial?" e some
Hoje tu atende esse cliente de longe ou ele se perde no caminho?`,
    followup_d3: `Ei, voltei aqui rapidinho — uma coisa que vejo em moda masculina
Cliente homem quer processo claro — tabela de medidas, troca garantida, retirada na loja OU entrega. Tá rolando essa fricção?`,
    followup_d7: `Tô parando por aqui pra não encher
Copa em 6 semanas, mês das festas em junho — minha porta fica aberta quando fizer sentido`,
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
    abertura: `Boa noite

Vi que vocês têm 144 avaliações no Google em Palmas — reputação que muito consultório novo não alcança em 5 anos
Mas paciente novo que pesquisa "dentista de confiança Palmas" compara — quem tem galeria + equipe + antes/depois fica na frente
Hoje vocês capturam esse paciente novo, ou ele cai em consultório menor que tem site?`,
    followup_d3: `Ei, voltei aqui rapidinho — uma coisa que vejo em consultório consolidado
Paciente de implante R$3-5k compara 4-5 consultórios antes de marcar. Tá rolando esse comparativo perdendo paciente?`,
    followup_d7: `Tô parando por aqui pra não encher
Minha porta fica aberta quando fizer sentido — análise digital do consultório de graça se quiser`,
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
    abertura: `Boa noite

Vi que vocês têm 4.8/112 em clínica focada em implante — autoridade rara que clínica nova leva 5 anos pra construir
Paciente que vai gastar R$3-5k pesquisa MUITO antes ("implante com garantia Palmas", "quanto custa implante")
Hoje ele te acha primeiro, ou cai em clínica menor que tem site bonito?`,
    followup_d3: `Ei, voltei aqui rapidinho — uma coisa que vejo em clínica de implante
Paciente de R$5k compara 4-6 clínicas antes de marcar. No Google, quem tem site fica na frente de quem tem só Maps. Tá acontecendo isso?`,
    followup_d7: `Tô parando por aqui pra não encher
Janela de SEO local não fecha — quem chegar primeiro domina por anos. Minha porta fica aberta`,
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
    abertura: `Boa noite

Reparei que no Google tu é Tatiane Souza, mas no Insta é @nutripridbarros — nota 5 com 63 aval mostra autoridade construída
Paciente novo que pesquisa "nutricionista Palmas" no Google vê dois nomes e fica confuso — não sabe pra qual canal vai
Como tu vê esse momento de transição de marca hoje?`,
    followup_d3: `Ei, voltei rapidinho — uma coisa que vejo em transição de marca
A confusão (nome no Google ≠ Insta) é exatamente o que LP com domínio próprio resolve. Faz sentido pra ti?`,
    followup_d7: `Tô parando por aqui pra não encher
Enquanto a confusão estiver aí, paciente novo escolhe quem tem clareza. Minha porta fica aberta`,
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
    abertura: `Ei, passei pelo perfil agora

Reparei que tu tem 5 com 63 avaliações em perfumaria/cosméticos em Palmas — base fiel forte
Cliente que pesquisa "onde comprar perfume O Boticário em Palmas" cai no site da matriz, não em ti como ponto de venda
Pra eu entender melhor: tu vende multimarcas ou é revendedora autorizada de uma só?`,
    followup_d3: `Ei, voltei aqui rapidinho — uma coisa que vejo em perfumaria multimarcas
Se tu vende várias, Shopify independente captura quem pesquisa "comprar [marca] Palmas". Se for revendedora exclusiva, a solução muda. Faz sentido pra ti?`,
    followup_d7: `Tô parando por aqui pra não encher
Mês das mães em 3 semanas — minha porta fica aberta quando fizer sentido`,
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
    abertura: `Ei, antes de qualquer coisa preciso confirmar uma parada

Falo com a equipe da Doxsen mesmo (Moda Praia, Fitness e Casual)? Vi vocês no Google com 161 avaliações 4.8 — número forte — mas o Instagram que apareceu aqui parece não ser de vocês
Não quero te tomar tempo com pitch errado, então me confirma rapidinho?`,
    followup_d3: `Ei, voltei só pra confirmar — é da Doxsen mesmo? Se sim, te mando rapidinho o que vi de oportunidade. Se não, abandono e desculpa o incômodo`,
    followup_d7: `Última tentativa — se enviei pro número errado, me ignora sem stress
Se for da Doxsen mesmo e não fizer sentido agora, minha porta fica aberta`,
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
    abertura: `Ei, antes de qualquer coisa preciso entender uma parada

Vi a Racco no Google com 5 com 63 avaliações — base fiel — mas a Racco tem regra de marketing pra revendedora
Pra eu te oferecer a coisa certa: tu é consultora autorizada Racco ou dona de um ponto físico independente?`,
    followup_d3: `Ei, voltei rapidinho — se tu é consultora autorizada, tem um ângulo legal (LP pessoal de consultora, não Shopify de produto Racco). Se for ponto físico independente, a coisa muda. Como tu vê?`,
    followup_d7: `Tô parando por aqui pra não encher
Se em algum momento quiser construir presença pessoal (consultora-marca, não a Racco), minha porta fica aberta`,
    pre_engajamento_ig: 'Pular pré-engajamento — qualifica primeiro o modelo de negócio.',
    razao_ranking: 'Qualificação duvidosa (revendedora vs. dona). Shopify provavelmente não cabe legalmente. Requer mudar oferta pra LP pessoal. Não perder tempo até esclarecer modelo de negócio.',
  },
}
