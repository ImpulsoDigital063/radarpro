# Ganchos de oferta por produto — para SYSTEM_PROMPT do Gemini

> Rascunho. Atualizar `lib/gemini.ts` quando LP e AgendaPRO estiverem completos.
> Objetivo: IA usa esses ganchos em abordagem, diagnóstico, follow-up e plano do dia.

---

## Loja Shopify — a partir de R$599

### Gancho de custo inicial
- **$1/mês nos primeiros 3 meses** (plano promocional Shopify)
- Cliente testa sem quase custo, depois decide manter

### Design
- Tema moderno, responsivo mobile-first
- Foco em conversão (não só "bonito")

### Logística / frete (diferencial regional forte)
- **Entrega expressa via motoboy na região do cliente** — selo "entrega hoje" no site = dispara compra por impulso
- **Frete nacional via Melhor Envio** — integração pronta, fretes até **80% mais baratos** que correios padrão
- Argumento: vendendo só por Instagram/WhatsApp, fica refém da negociação manual de frete a cada pedido

### Pagamento
- **Checkout transparente Yampi** — sem mensalidade, 2,5% sobre a venda
- Aceita: PIX, cartão em **12x**, boleto
- **Gateway Mercado Pago** como opção — um dos maiores, mais seguros, taxas competitivas
- Argumento: parcelar em 12x sem ter custo fixo mensal = loja nova não quebra no começo

### Público ideal (refino)
- Quem vende produto físico só por Instagram/WhatsApp
- Tem demanda local + potencial de vender pra fora de Palmas
- Perde venda por não conseguir fechar no impulso (cliente pede frete, pede foto, pede pix manual → esfria)

---

## Landing Page — R$499

### Bônus que ninguém dá
- **Hospedagem vitalícia inclusa** — sem mensalidade de host pra sempre
- Cliente paga uma vez e não volta a pagar hospedagem

### Tráfego orgânico de quebra (diferencial forte)
- **3 artigos de blog dentro da LP** com foco em SEO
- Cliente faz pesquisa no Google sobre o assunto → artigo do lead aparece → lead cai na LP
- Argumento: LP comum só converte quem você já trouxe. Com blog, o Google manda tráfego de graça todo mês

### Design e estrutura
- **Seções estratégicas** pensadas pra prender atenção do lead (hero, prova, oferta, CTA)
- Cliente pode **enviar site ou LP de inspiração** — usamos como referência visual
- Não é template engessado — é sob medida

### Pós-entrega
- **Suporte de 30 dias** após entrega

### Público ideal (refino)
- Profissional liberal ou pequeno negócio sem site profissional
- Quem quer ser encontrado no Google mas não tem tempo/grana pra contratar agência de SEO
- Quem já faz tráfego pago e precisa de página de alta conversão

---

## AgendaPRO — R$67/mês

### Teste sem risco
- **14 dias grátis** para o lead testar antes de pagar

### Telas personalizadas por segmento (diferencial forte)
- **Barbearia · Salão de Beleza · Nail Designer · Clínica Estética**
- Cada tela com layout e campos pensados para o nicho — não é sistema genérico

### Programa de fidelidade com pontuação
- Cliente acumula pontos a cada agendamento/avaliação
- **Link de indicação**: cliente chama outro cliente → quando o indicado agenda, ambos somam pontos
- Dono ganha máquina de indicação automática sem esforço

### Lista de espera automática (zero vaga desperdiçada)
- Cliente cancelou → próximo da fila recebe **e-mail automático na hora** e preenche a vaga
- Argumento: salão comum perde a vaga quando alguém desmarca de última hora — aqui a agenda se recompõe sozinha

### Badge Google Reviews (diferencial competitivo)
- Nota do Google aparece direto na **página pública de agendamento**
- Cliente que avalia ganha pontos de fidelidade
- **Ajuda a rankear no Google** — mais avaliações = mais visibilidade local

### Sistema de comissão e dashboard financeiro
- Dono acompanha **seus ganhos e os ganhos de cada profissional comissionado**
- Resolve a dor clássica de salão/barbearia: não saber quanto cada cadeira rende

### Experiência sem atrito para o cliente final
- Cliente **não baixa app** — só clica no link
- Cadastro uma vez, agendamentos ilimitados depois
- Dono tem acesso à **lista de clientes com telefone e e-mail** → base pronta para campanhas

### Lembretes automáticos
- Mensagem **D-1 e 1 hora antes** do atendimento
- Reduz no-show (a dor financeira nº1 de quem trabalha com hora marcada)

### Público ideal (refino)
- Barbearia, salão, nail designer, clínica estética (telas prontas)
- Qualquer profissional com hora marcada perdendo tempo no WhatsApp confirmando
- Dono que tem comissionados e não tem clareza de quanto cada um fatura

---

## Onde implementar

1. **`lib/gemini.ts` — SYSTEM_PROMPT** (linhas ~25-40 onde cada produto é descrito)
   - Expandir as seções dos 3 produtos com estes ganchos
   - A IA lerá em toda geração (abordagem, diagnóstico, etc)

2. **`lib/mensagens.ts`** — opcional
   - Mensagens base poderiam incluir 1 gancho por tipo
   - Mas a IA gera melhor, então talvez não precise

3. **Diagnóstico profundo (action `diagnostico`)**
   - Já retorna `produto_ideal` + `argumento_cirurgico`
   - Com os ganchos no prompt, o argumento fica muito mais específico
