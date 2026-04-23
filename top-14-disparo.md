# Playbook de disparo — 14 leads (2026-04-23 noite)

**Meta:** fechar 2 serviços nesta semana entre os 14.
**Filtros:** status='novo' · tem telefone · tem IG · categoria útil.
**Ordem:** num_avaliacoes DESC → nota DESC.

Cada lead tem: análise Gemini (diagnóstico + ângulo + urgência) · as 4 mensagens prontas (msg 1 cirúrgica, msg 2 diagnóstico A/B/C, msg 3 pitch se_so_ig + se_tem_site, msg 4 fechamento) · call_alinhamento como arma de travamento · link wa.me direto.

> ⚠️ **AVISO 23/04 noite:** a cota FREE do Gemini (20 req/dia) estourou ao gerar este md — **a análise cirúrgica por lead caiu em fallback genérico em todos os 14**. As 4 mensagens base estão prontas e usáveis (com value stacking + call de alinhamento). Pra encher as análises, rerodar amanhã com cota resetada: `npx tsx scripts/top-14-disparo.ts`. Ou ativar billing no Gemini.
>
> **Workflow sem análise Gemini:** abrir o link wa.me de cada lead → editar a msg 1 à mão inserindo algo ESPECÍFICO (nota Google, categoria, detalhe da bio) antes de mandar → seguir com msg 2/3/4 conforme a resposta dele.

---

## 7 leads — LP (R$499)

**Oferta:** Landing Page. Valor de mercado empilhado R$2.500. Preço R$499 uma vez. Hospedagem vitalícia + 3 artigos SEO grátis. Garantia 7d.

### LP 1. Palmas Bucal - Consultório Odontológico

**Ficha:** Dentista · Google 4.8 (144 aval) · IG @palmasbucal
**Bio IG:** —
**Site:** NÃO TEM · Agenda online: não
**Telefone:** `(63)3213-3091`

**Diagnóstico estratégico (Gemini):**
- Fallback: [GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash
- **Argumento de fechamento:** Usar script padrão
- **Urgência:** A definir

**Oferta que vai rodar:** `lp-solo`

#### Msg 1 — Abertura cirúrgica (Gemini, específica pro Palmas)
```
Olá Palmas! 👋

Vi seu perfil no Instagram — você tem um trabalho incrível com Dentista aqui em Palmas.

Posso te fazer uma pergunta rápida?
```

#### Msg 2 — Diagnóstico (variante B)
```
Último cliente novo que apareceu — veio de indicação, ou foi alguém que te achou sozinho pesquisando?

Pergunto porque a diferença aí é tudo.
```

#### Msg 3A — Pitch se ele disser "só tenho Instagram"
```
Entendi. É exatamente onde eu resolvo.

Antes de falar preço, deixa eu te mostrar o que você leva:

→ Página profissional de 8-10 seções (Hero, Dores, Serviços, Prova social, FAQ) — agência cobra R$1.500 por isso
→ SEO local configurado — você aparece quando alguém pesquisa "Dentista em Palmas" no Google (R$500)
→ Mobile-first de verdade — 80% do cliente abre no celular (R$300)
→ WhatsApp integrado em toda página — cliente fala com você em 1 clique (R$200)

*Valor de mercado: R$2.500.*

E GRÁTIS empilhado:
✓ Hospedagem VITALÍCIA — você NUNCA paga mensalidade (R$600-1.200/ano que você não desembolsa pra sempre)
✓ 3 artigos SEO no blog — tráfego orgânico sem depender de Meta Ads

Pra referência de mercado:
• Agência local Palmas: R$1.500-3.000 + mensalidade
• Freela Fiverr: R$800-1.200, sem SEO, sem blog, sem hospedagem

*Meu preço: R$499 uma vez.* 7 dias de garantia. Entrega em 7 dias.
```

#### Msg 3B — Pitch se ele disser "tenho site"
```
Que legal! Me manda o link — em 2 minutos eu te mostro o que ele tá deixando de fazer por você.
```

#### Msg 4 — Fechamento com 3 horários
```
Posso te mostrar como fica na prática em 20 minutos.

Qual é melhor pra você:
- Quinta (15h)?
- Sexta (14h)?
- Segunda (10h)?
```

#### Arma de fechamento — Call de alinhamento (se ele travar com "e o meu caso?")
```
Antes da gente fechar, tem uma etapa do processo: *call de alinhamento* (20 min) com a equipe Impulso.

Não é venda. É um briefing de 8 perguntas pra eu captar sua visão, valores e essência do trabalho com dentista.

Você sai da call com um *protótipo funcional* da sua LP rodando — não mockup estático, é Next.js no ar. Técnica que a equipe validou: fecha 10x mais do que quem mostra só mockup.

Essa call faz parte do processo — não começo a produção sem ela. É o que garante que a LP sai com a SUA cara, não genérica.
```

**→ Disparar direto no WhatsApp (msg 1 já pré-preenchida):** https://wa.me/556332133091?text=Ol%C3%A1%20Palmas!%20%F0%9F%91%8B%0A%0AVi%20seu%20perfil%20no%20Instagram%20%E2%80%94%20voc%C3%AA%20tem%20um%20trabalho%20incr%C3%ADvel%20com%20Dentista%20aqui%20em%20Palmas.%0A%0APosso%20te%20fazer%20uma%20pergunta%20r%C3%A1pida%3F

---

### LP 2. Gilson Afonso - Consultório de Psicologia

**Ficha:** Psicólogo · Google 4.9 (135 aval) · IG @gilsonpsicologo
**Bio IG:** —
**Site:** NÃO TEM · Agenda online: não
**Telefone:** `(63)98418-9311`

**Diagnóstico estratégico (Gemini):**
- Fallback: [GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash
- **Argumento de fechamento:** Usar script padrão
- **Urgência:** A definir

**Oferta que vai rodar:** `lp-solo`

#### Msg 1 — Abertura cirúrgica (Gemini, específica pro Gilson)
```
Olá Gilson! 👋

Vi seu perfil no Instagram — você tem um trabalho incrível com Psicólogo aqui em Palmas.

Posso te fazer uma pergunta rápida?
```

#### Msg 2 — Diagnóstico (variante C)
```
Quando o cliente pede "me manda seu site", o que você responde hoje?

Porque eu vejo muito psicólogo perder cliente só por não ter um link profissional pra mandar.
```

#### Msg 3A — Pitch se ele disser "só tenho Instagram"
```
Entendi. É exatamente onde eu resolvo.

Antes de falar preço, deixa eu te mostrar o que você leva:

→ Página profissional de 8-10 seções (Hero, Dores, Serviços, Prova social, FAQ) — agência cobra R$1.500 por isso
→ SEO local configurado — você aparece quando alguém pesquisa "Psicólogo em Palmas" no Google (R$500)
→ Mobile-first de verdade — 80% do cliente abre no celular (R$300)
→ WhatsApp integrado em toda página — cliente fala com você em 1 clique (R$200)

*Valor de mercado: R$2.500.*

E GRÁTIS empilhado:
✓ Hospedagem VITALÍCIA — você NUNCA paga mensalidade (R$600-1.200/ano que você não desembolsa pra sempre)
✓ 3 artigos SEO no blog — tráfego orgânico sem depender de Meta Ads

Pra referência de mercado:
• Agência local Palmas: R$1.500-3.000 + mensalidade
• Freela Fiverr: R$800-1.200, sem SEO, sem blog, sem hospedagem

*Meu preço: R$499 uma vez.* 7 dias de garantia. Entrega em 7 dias.
```

#### Msg 3B — Pitch se ele disser "tenho site"
```
Que legal! Me manda o link — em 2 minutos eu te mostro o que ele tá deixando de fazer por você.
```

#### Msg 4 — Fechamento com 3 horários
```
Posso te mostrar como fica na prática em 20 minutos.

Qual é melhor pra você:
- Quinta (15h)?
- Sexta (14h)?
- Segunda (10h)?
```

#### Arma de fechamento — Call de alinhamento (se ele travar com "e o meu caso?")
```
Antes da gente fechar, tem uma etapa do processo: *call de alinhamento* (20 min) com a equipe Impulso.

Não é venda. É um briefing de 8 perguntas pra eu captar sua visão, valores e essência do trabalho com psicólogo.

Você sai da call com um *protótipo funcional* da sua LP rodando — não mockup estático, é Next.js no ar. Técnica que a equipe validou: fecha 10x mais do que quem mostra só mockup.

Essa call faz parte do processo — não começo a produção sem ela. É o que garante que a LP sai com a SUA cara, não genérica.
```

**→ Disparar direto no WhatsApp (msg 1 já pré-preenchida):** https://wa.me/5563984189311?text=Ol%C3%A1%20Gilson!%20%F0%9F%91%8B%0A%0AVi%20seu%20perfil%20no%20Instagram%20%E2%80%94%20voc%C3%AA%20tem%20um%20trabalho%20incr%C3%ADvel%20com%20Psic%C3%B3logo%20aqui%20em%20Palmas.%0A%0APosso%20te%20fazer%20uma%20pergunta%20r%C3%A1pida%3F

---

### LP 3. Guilherme Morais Advocacia

**Ficha:** Advogado · Google 5 (120 aval) · IG @moraiseadvogados
**Bio IG:** —
**Site:** NÃO TEM · Agenda online: não
**Telefone:** `(63)99237-1484`

**Diagnóstico estratégico (Gemini):**
- Fallback: [GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash
- **Argumento de fechamento:** Usar script padrão
- **Urgência:** A definir

**Oferta que vai rodar:** `lp-solo`

#### Msg 1 — Abertura cirúrgica (Gemini, específica pro Guilherme)
```
Olá Guilherme! 👋

Vi seu perfil no Instagram — você tem um trabalho incrível com Advogado aqui em Palmas.

Posso te fazer uma pergunta rápida?
```

#### Msg 2 — Diagnóstico (variante C)
```
Quando o cliente pede "me manda seu site", o que você responde hoje?

Porque eu vejo muito advogado perder cliente só por não ter um link profissional pra mandar.
```

#### Msg 3A — Pitch se ele disser "só tenho Instagram"
```
Entendi. É exatamente onde eu resolvo.

Antes de falar preço, deixa eu te mostrar o que você leva:

→ Página profissional de 8-10 seções (Hero, Dores, Serviços, Prova social, FAQ) — agência cobra R$1.500 por isso
→ SEO local configurado — você aparece quando alguém pesquisa "Advogado em Palmas" no Google (R$500)
→ Mobile-first de verdade — 80% do cliente abre no celular (R$300)
→ WhatsApp integrado em toda página — cliente fala com você em 1 clique (R$200)

*Valor de mercado: R$2.500.*

E GRÁTIS empilhado:
✓ Hospedagem VITALÍCIA — você NUNCA paga mensalidade (R$600-1.200/ano que você não desembolsa pra sempre)
✓ 3 artigos SEO no blog — tráfego orgânico sem depender de Meta Ads

Pra referência de mercado:
• Agência local Palmas: R$1.500-3.000 + mensalidade
• Freela Fiverr: R$800-1.200, sem SEO, sem blog, sem hospedagem

*Meu preço: R$499 uma vez.* 7 dias de garantia. Entrega em 7 dias.
```

#### Msg 3B — Pitch se ele disser "tenho site"
```
Que legal! Me manda o link — em 2 minutos eu te mostro o que ele tá deixando de fazer por você.
```

#### Msg 4 — Fechamento com 3 horários
```
Posso te mostrar como fica na prática em 20 minutos.

Qual é melhor pra você:
- Quinta (15h)?
- Sexta (14h)?
- Segunda (10h)?
```

#### Arma de fechamento — Call de alinhamento (se ele travar com "e o meu caso?")
```
Antes da gente fechar, tem uma etapa do processo: *call de alinhamento* (20 min) com a equipe Impulso.

Não é venda. É um briefing de 8 perguntas pra eu captar sua visão, valores e essência do trabalho com advogado.

Você sai da call com um *protótipo funcional* da sua LP rodando — não mockup estático, é Next.js no ar. Técnica que a equipe validou: fecha 10x mais do que quem mostra só mockup.

Essa call faz parte do processo — não começo a produção sem ela. É o que garante que a LP sai com a SUA cara, não genérica.
```

**→ Disparar direto no WhatsApp (msg 1 já pré-preenchida):** https://wa.me/5563992371484?text=Ol%C3%A1%20Guilherme!%20%F0%9F%91%8B%0A%0AVi%20seu%20perfil%20no%20Instagram%20%E2%80%94%20voc%C3%AA%20tem%20um%20trabalho%20incr%C3%ADvel%20com%20Advogado%20aqui%20em%20Palmas.%0A%0APosso%20te%20fazer%20uma%20pergunta%20r%C3%A1pida%3F

---

### LP 4. Odonto Fama Implante

**Ficha:** Dentista · Google 4.8 (112 aval) · IG @odontofama63
**Bio IG:** —
**Site:** NÃO TEM · Agenda online: não
**Telefone:** `(63)3224-3954`

**Diagnóstico estratégico (Gemini):**
- Fallback: [GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash
- **Argumento de fechamento:** Usar script padrão
- **Urgência:** A definir

**Oferta que vai rodar:** `lp-solo`

#### Msg 1 — Abertura cirúrgica (Gemini, específica pro Odonto)
```
Olá Odonto! 👋

Vi seu perfil no Instagram — você tem um trabalho incrível com Dentista aqui em Palmas.

Posso te fazer uma pergunta rápida?
```

#### Msg 2 — Diagnóstico (variante C)
```
Quando o cliente pede "me manda seu site", o que você responde hoje?

Porque eu vejo muito dentista perder cliente só por não ter um link profissional pra mandar.
```

#### Msg 3A — Pitch se ele disser "só tenho Instagram"
```
Entendi. É exatamente onde eu resolvo.

Antes de falar preço, deixa eu te mostrar o que você leva:

→ Página profissional de 8-10 seções (Hero, Dores, Serviços, Prova social, FAQ) — agência cobra R$1.500 por isso
→ SEO local configurado — você aparece quando alguém pesquisa "Dentista em Palmas" no Google (R$500)
→ Mobile-first de verdade — 80% do cliente abre no celular (R$300)
→ WhatsApp integrado em toda página — cliente fala com você em 1 clique (R$200)

*Valor de mercado: R$2.500.*

E GRÁTIS empilhado:
✓ Hospedagem VITALÍCIA — você NUNCA paga mensalidade (R$600-1.200/ano que você não desembolsa pra sempre)
✓ 3 artigos SEO no blog — tráfego orgânico sem depender de Meta Ads

Pra referência de mercado:
• Agência local Palmas: R$1.500-3.000 + mensalidade
• Freela Fiverr: R$800-1.200, sem SEO, sem blog, sem hospedagem

*Meu preço: R$499 uma vez.* 7 dias de garantia. Entrega em 7 dias.
```

#### Msg 3B — Pitch se ele disser "tenho site"
```
Que legal! Me manda o link — em 2 minutos eu te mostro o que ele tá deixando de fazer por você.
```

#### Msg 4 — Fechamento com 3 horários
```
Posso te mostrar como fica na prática em 20 minutos.

Qual é melhor pra você:
- Quinta (15h)?
- Sexta (14h)?
- Segunda (10h)?
```

#### Arma de fechamento — Call de alinhamento (se ele travar com "e o meu caso?")
```
Antes da gente fechar, tem uma etapa do processo: *call de alinhamento* (20 min) com a equipe Impulso.

Não é venda. É um briefing de 8 perguntas pra eu captar sua visão, valores e essência do trabalho com dentista.

Você sai da call com um *protótipo funcional* da sua LP rodando — não mockup estático, é Next.js no ar. Técnica que a equipe validou: fecha 10x mais do que quem mostra só mockup.

Essa call faz parte do processo — não começo a produção sem ela. É o que garante que a LP sai com a SUA cara, não genérica.
```

**→ Disparar direto no WhatsApp (msg 1 já pré-preenchida):** https://wa.me/556332243954?text=Ol%C3%A1%20Odonto!%20%F0%9F%91%8B%0A%0AVi%20seu%20perfil%20no%20Instagram%20%E2%80%94%20voc%C3%AA%20tem%20um%20trabalho%20incr%C3%ADvel%20com%20Dentista%20aqui%20em%20Palmas.%0A%0APosso%20te%20fazer%20uma%20pergunta%20r%C3%A1pida%3F

---

### LP 5. Izabela Campos Nutricionista

**Ficha:** Nutricionista · Google 5 (63 aval) · IG @nutriizabelacampos
**Bio IG:** —
**Site:** NÃO TEM · Agenda online: não
**Telefone:** `(63)99133-2171`

**Diagnóstico estratégico (Gemini):**
- Fallback: [GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash
- **Argumento de fechamento:** Usar script padrão
- **Urgência:** A definir

**Oferta que vai rodar:** `lp-solo`

#### Msg 1 — Abertura cirúrgica (Gemini, específica pro Izabela)
```
Olá Izabela! 👋

Vi seu perfil no Instagram — você tem um trabalho incrível com Nutricionista aqui em Palmas.

Posso te fazer uma pergunta rápida?
```

#### Msg 2 — Diagnóstico (variante A)
```
Posso te perguntar uma coisa?

Agora, se alguém digitar "Nutricionista em Palmas" no Google, você aparece?

Ou só seu Insta, que o Google nem indexa direito?
```

#### Msg 3A — Pitch se ele disser "só tenho Instagram"
```
Entendi. É exatamente onde eu resolvo.

Antes de falar preço, deixa eu te mostrar o que você leva:

→ Página profissional de 8-10 seções (Hero, Dores, Serviços, Prova social, FAQ) — agência cobra R$1.500 por isso
→ SEO local configurado — você aparece quando alguém pesquisa "Nutricionista em Palmas" no Google (R$500)
→ Mobile-first de verdade — 80% do cliente abre no celular (R$300)
→ WhatsApp integrado em toda página — cliente fala com você em 1 clique (R$200)

*Valor de mercado: R$2.500.*

E GRÁTIS empilhado:
✓ Hospedagem VITALÍCIA — você NUNCA paga mensalidade (R$600-1.200/ano que você não desembolsa pra sempre)
✓ 3 artigos SEO no blog — tráfego orgânico sem depender de Meta Ads

Pra referência de mercado:
• Agência local Palmas: R$1.500-3.000 + mensalidade
• Freela Fiverr: R$800-1.200, sem SEO, sem blog, sem hospedagem

*Meu preço: R$499 uma vez.* 7 dias de garantia. Entrega em 7 dias.
```

#### Msg 3B — Pitch se ele disser "tenho site"
```
Que legal! Me manda o link — em 2 minutos eu te mostro o que ele tá deixando de fazer por você.
```

#### Msg 4 — Fechamento com 3 horários
```
Posso te mostrar como fica na prática em 20 minutos.

Qual é melhor pra você:
- Quinta (15h)?
- Sexta (14h)?
- Segunda (10h)?
```

#### Arma de fechamento — Call de alinhamento (se ele travar com "e o meu caso?")
```
Antes da gente fechar, tem uma etapa do processo: *call de alinhamento* (20 min) com a equipe Impulso.

Não é venda. É um briefing de 8 perguntas pra eu captar sua visão, valores e essência do trabalho com nutricionista.

Você sai da call com um *protótipo funcional* da sua LP rodando — não mockup estático, é Next.js no ar. Técnica que a equipe validou: fecha 10x mais do que quem mostra só mockup.

Essa call faz parte do processo — não começo a produção sem ela. É o que garante que a LP sai com a SUA cara, não genérica.
```

**→ Disparar direto no WhatsApp (msg 1 já pré-preenchida):** https://wa.me/5563991332171?text=Ol%C3%A1%20Izabela!%20%F0%9F%91%8B%0A%0AVi%20seu%20perfil%20no%20Instagram%20%E2%80%94%20voc%C3%AA%20tem%20um%20trabalho%20incr%C3%ADvel%20com%20Nutricionista%20aqui%20em%20Palmas.%0A%0APosso%20te%20fazer%20uma%20pergunta%20r%C3%A1pida%3F

---

### LP 6. Dra. Allana Karoline - Nutricionista Nefro

**Ficha:** Nutricionista · Google 5 (63 aval) · IG @draanacarolinaalmeida
**Bio IG:** —
**Site:** NÃO TEM · Agenda online: não
**Telefone:** `(63)99134-2546`

**Diagnóstico estratégico (Gemini):**
- Fallback: [GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash
- **Argumento de fechamento:** Usar script padrão
- **Urgência:** A definir

**Oferta que vai rodar:** `lp-solo`

#### Msg 1 — Abertura cirúrgica (Gemini, específica pro Dra.)
```
Olá Dra.! 👋

Vi seu perfil no Instagram — você tem um trabalho incrível com Nutricionista aqui em Palmas.

Posso te fazer uma pergunta rápida?
```

#### Msg 2 — Diagnóstico (variante B)
```
Último cliente novo que apareceu — veio de indicação, ou foi alguém que te achou sozinho pesquisando?

Pergunto porque a diferença aí é tudo.
```

#### Msg 3A — Pitch se ele disser "só tenho Instagram"
```
Entendi. É exatamente onde eu resolvo.

Antes de falar preço, deixa eu te mostrar o que você leva:

→ Página profissional de 8-10 seções (Hero, Dores, Serviços, Prova social, FAQ) — agência cobra R$1.500 por isso
→ SEO local configurado — você aparece quando alguém pesquisa "Nutricionista em Palmas" no Google (R$500)
→ Mobile-first de verdade — 80% do cliente abre no celular (R$300)
→ WhatsApp integrado em toda página — cliente fala com você em 1 clique (R$200)

*Valor de mercado: R$2.500.*

E GRÁTIS empilhado:
✓ Hospedagem VITALÍCIA — você NUNCA paga mensalidade (R$600-1.200/ano que você não desembolsa pra sempre)
✓ 3 artigos SEO no blog — tráfego orgânico sem depender de Meta Ads

Pra referência de mercado:
• Agência local Palmas: R$1.500-3.000 + mensalidade
• Freela Fiverr: R$800-1.200, sem SEO, sem blog, sem hospedagem

*Meu preço: R$499 uma vez.* 7 dias de garantia. Entrega em 7 dias.
```

#### Msg 3B — Pitch se ele disser "tenho site"
```
Que legal! Me manda o link — em 2 minutos eu te mostro o que ele tá deixando de fazer por você.
```

#### Msg 4 — Fechamento com 3 horários
```
Posso te mostrar como fica na prática em 20 minutos.

Qual é melhor pra você:
- Quinta (15h)?
- Sexta (14h)?
- Segunda (10h)?
```

#### Arma de fechamento — Call de alinhamento (se ele travar com "e o meu caso?")
```
Antes da gente fechar, tem uma etapa do processo: *call de alinhamento* (20 min) com a equipe Impulso.

Não é venda. É um briefing de 8 perguntas pra eu captar sua visão, valores e essência do trabalho com nutricionista.

Você sai da call com um *protótipo funcional* da sua LP rodando — não mockup estático, é Next.js no ar. Técnica que a equipe validou: fecha 10x mais do que quem mostra só mockup.

Essa call faz parte do processo — não começo a produção sem ela. É o que garante que a LP sai com a SUA cara, não genérica.
```

**→ Disparar direto no WhatsApp (msg 1 já pré-preenchida):** https://wa.me/5563991342546?text=Ol%C3%A1%20Dra.!%20%F0%9F%91%8B%0A%0AVi%20seu%20perfil%20no%20Instagram%20%E2%80%94%20voc%C3%AA%20tem%20um%20trabalho%20incr%C3%ADvel%20com%20Nutricionista%20aqui%20em%20Palmas.%0A%0APosso%20te%20fazer%20uma%20pergunta%20r%C3%A1pida%3F

---

### LP 7. Nutricionista - TATIANE SOUZA

**Ficha:** Nutricionista · Google 5 (63 aval) · IG @nutripridbarros
**Bio IG:** —
**Site:** NÃO TEM · Agenda online: não
**Telefone:** `(63)3233-6380`

**Diagnóstico estratégico (Gemini):**
- Fallback: [GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash
- **Argumento de fechamento:** Usar script padrão
- **Urgência:** A definir

**Oferta que vai rodar:** `lp-solo`

#### Msg 1 — Abertura cirúrgica (Gemini, específica pro Nutricionista)
```
Olá Nutricionista! 👋

Vi seu perfil no Instagram — você tem um trabalho incrível com Nutricionista aqui em Palmas.

Posso te fazer uma pergunta rápida?
```

#### Msg 2 — Diagnóstico (variante B)
```
Último cliente novo que apareceu — veio de indicação, ou foi alguém que te achou sozinho pesquisando?

Pergunto porque a diferença aí é tudo.
```

#### Msg 3A — Pitch se ele disser "só tenho Instagram"
```
Entendi. É exatamente onde eu resolvo.

Antes de falar preço, deixa eu te mostrar o que você leva:

→ Página profissional de 8-10 seções (Hero, Dores, Serviços, Prova social, FAQ) — agência cobra R$1.500 por isso
→ SEO local configurado — você aparece quando alguém pesquisa "Nutricionista em Palmas" no Google (R$500)
→ Mobile-first de verdade — 80% do cliente abre no celular (R$300)
→ WhatsApp integrado em toda página — cliente fala com você em 1 clique (R$200)

*Valor de mercado: R$2.500.*

E GRÁTIS empilhado:
✓ Hospedagem VITALÍCIA — você NUNCA paga mensalidade (R$600-1.200/ano que você não desembolsa pra sempre)
✓ 3 artigos SEO no blog — tráfego orgânico sem depender de Meta Ads

Pra referência de mercado:
• Agência local Palmas: R$1.500-3.000 + mensalidade
• Freela Fiverr: R$800-1.200, sem SEO, sem blog, sem hospedagem

*Meu preço: R$499 uma vez.* 7 dias de garantia. Entrega em 7 dias.
```

#### Msg 3B — Pitch se ele disser "tenho site"
```
Que legal! Me manda o link — em 2 minutos eu te mostro o que ele tá deixando de fazer por você.
```

#### Msg 4 — Fechamento com 3 horários
```
Posso te mostrar como fica na prática em 20 minutos.

Qual é melhor pra você:
- Quinta (15h)?
- Sexta (14h)?
- Segunda (10h)?
```

#### Arma de fechamento — Call de alinhamento (se ele travar com "e o meu caso?")
```
Antes da gente fechar, tem uma etapa do processo: *call de alinhamento* (20 min) com a equipe Impulso.

Não é venda. É um briefing de 8 perguntas pra eu captar sua visão, valores e essência do trabalho com nutricionista.

Você sai da call com um *protótipo funcional* da sua LP rodando — não mockup estático, é Next.js no ar. Técnica que a equipe validou: fecha 10x mais do que quem mostra só mockup.

Essa call faz parte do processo — não começo a produção sem ela. É o que garante que a LP sai com a SUA cara, não genérica.
```

**→ Disparar direto no WhatsApp (msg 1 já pré-preenchida):** https://wa.me/556332336380?text=Ol%C3%A1%20Nutricionista!%20%F0%9F%91%8B%0A%0AVi%20seu%20perfil%20no%20Instagram%20%E2%80%94%20voc%C3%AA%20tem%20um%20trabalho%20incr%C3%ADvel%20com%20Nutricionista%20aqui%20em%20Palmas.%0A%0APosso%20te%20fazer%20uma%20pergunta%20r%C3%A1pida%3F

---

## 7 leads — Shopify (R$599)

**Oferta:** Loja Shopify com tema MPN + 20 produtos + integrações. Valor de mercado R$3.200. Preço R$599 uma vez. Shopify $1/mês por 3m + fornecedores + scripts + call gravada grátis. Entrega 7-10d.

### SHOPIFY 1. Doxsen - Moda Praia, Fitness e Casual

**Ficha:** Loja de roupas · Google 4.8 (161 aval) · IG @startpage
**Bio IG:** —
**Site:** NÃO TEM · Agenda online: não
**Telefone:** `(63)99212-4974`

**Diagnóstico estratégico (Gemini):**
- Fallback: [GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash
- **Argumento de fechamento:** Usar script padrão
- **Urgência:** A definir

**Oferta que vai rodar:** `shopify-solo`

#### Msg 1 — Abertura cirúrgica (Gemini, específica pro Doxsen)
```
Olá Doxsen! 👋

Vi que você tem uma Loja de roupas bem legal aqui em Palmas.

Posso te fazer uma pergunta rápida?
```

#### Msg 2 — Diagnóstico (variante C)
```
Sábado de noite, domingo de manhã — cliente vê seu produto e quer comprar. Você tá lá pra responder, ou o pedido some até segunda?
```

#### Msg 3A — Pitch se ele disser "só tenho Instagram"
```
Entendi. Deixa eu te mostrar o que você leva antes de falar preço.

→ Setup Shopify completo — tema profissional, domínio, SSL, checkout otimizado (agência cobra R$1.500)
→ Tema MPN customizado — mesmo tema que a UrbanFeet e o Gabriel usam, não é template genérico (R$1.000)
→ Integrações prontas — Mercado Pago (PIX/cartão 12x), Melhor Envio (5+ transportadoras), WhatsApp (R$400)
→ 20 produtos cadastrados — fotos, descrição, preço, variação, estoque (R$300)

*Valor de mercado: R$3.200.*

E GRÁTIS empilhado:
✓ Shopify $1/mês nos primeiros 3 meses — programa promocional, quase de graça pra testar
✓ Lista de fornecedores do nicho que a Impulso mapeou
✓ Scripts de prospecção pra puxar os primeiros 10 clientes
✓ Call de entrega ao vivo gravada — *o vídeo fica seu*, esqueceu algo daqui a 6 meses você revê

Pra referência de mercado:
• Agência local Palmas: R$1.500-4.000 + mensalidade
• Freela Fiverr: R$1.200-2.000, sem tema custom, sem integração local, sem call

*Meu preço: R$599 uma vez.* Entrega em 7-10 dias.

Palmas recebe no dia (PIX 10h → em casa 14h via motoboy nos 2 horários fixos). Brasil todo via Melhor Envio até 80% mais barato que Correios.

Gancho de ticket médio grátis: "frete grátis a partir de R$250" faz cliente levar 2 pra fechar o valor. Você define a regra.

Case real: o *Gabriel* (GB Nutrition, personal trainer aqui em Palmas) vendia suplemento no WhatsApp — cada pedido ele confirmava PIX, combinava entrega, era gargalo. Hoje a loja dele tá automatizada. Palmas recebe no dia, Brasil todo no checkout. *O Gabriel parou de ser atendente. Voltou a ser personal.*
```

#### Msg 3B — Pitch se ele disser "tenho site"
```
Que legal! Qual é o link? Quero dar uma olhada.
```

#### Msg 4 — Fechamento com 3 horários
```
Posso te mostrar como fica na prática em 20 minutos.

Qual é melhor pra você:
- Quinta (15h)?
- Sexta (14h)?
- Segunda (10h)?
```

#### Arma de fechamento — Call de alinhamento (se ele travar com "e o meu caso?")
```
Antes da gente fechar, tem uma etapa obrigatória do processo: *call de alinhamento* (30 min) com a equipe Impulso.

Não é venda. É *diagnóstico operacional ao vivo* — a gente senta e mapeia: motoboy parceiro ou app, quais horários de corte, Mercado Pago no seu CNPJ, regra de frete grátis por ticket, fornecedores do seu nicho.

Você sai da call com a loja já alinhada pra rodar: não é mockup, é Shopify no ar com a sua cara. A GB Nutrition do Gabriel e a UrbanFeet só ficaram únicas porque a gente sentou antes de codar. *Não começo a produção sem essa call.*
```

**→ Disparar direto no WhatsApp (msg 1 já pré-preenchida):** https://wa.me/5563992124974?text=Ol%C3%A1%20Doxsen!%20%F0%9F%91%8B%0A%0AVi%20que%20voc%C3%AA%20tem%20uma%20Loja%20de%20roupas%20bem%20legal%20aqui%20em%20Palmas.%0A%0APosso%20te%20fazer%20uma%20pergunta%20r%C3%A1pida%3F

---

### SHOPIFY 2. Don Parfum – Perfumes Importados & Perfumaria | Palmas

**Ficha:** Perfumaria · Google 5 (109 aval) · IG @donparfumpalmas
**Bio IG:** —
**Site:** NÃO TEM · Agenda online: não
**Telefone:** `(63)99271-2424`

**Diagnóstico estratégico (Gemini):**
- Fallback: [GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash
- **Argumento de fechamento:** Usar script padrão
- **Urgência:** A definir

**Oferta que vai rodar:** `shopify-solo`

#### Msg 1 — Abertura cirúrgica (Gemini, específica pro Don)
```
Olá Don! 👋

Vi que você tem uma Perfumaria bem legal aqui em Palmas.

Posso te fazer uma pergunta rápida?
```

#### Msg 2 — Diagnóstico (variante B)
```
Hoje, quando cai um pedido, como funciona? Negocia frete, manda PIX, confirma recebimento tudo no WhatsApp na mão?

Quanto tempo isso come por semana?
```

#### Msg 3A — Pitch se ele disser "só tenho Instagram"
```
Entendi. Deixa eu te mostrar o que você leva antes de falar preço.

→ Setup Shopify completo — tema profissional, domínio, SSL, checkout otimizado (agência cobra R$1.500)
→ Tema MPN customizado — mesmo tema que a UrbanFeet e o Gabriel usam, não é template genérico (R$1.000)
→ Integrações prontas — Mercado Pago (PIX/cartão 12x), Melhor Envio (5+ transportadoras), WhatsApp (R$400)
→ 20 produtos cadastrados — fotos, descrição, preço, variação, estoque (R$300)

*Valor de mercado: R$3.200.*

E GRÁTIS empilhado:
✓ Shopify $1/mês nos primeiros 3 meses — programa promocional, quase de graça pra testar
✓ Lista de fornecedores do nicho que a Impulso mapeou
✓ Scripts de prospecção pra puxar os primeiros 10 clientes
✓ Call de entrega ao vivo gravada — *o vídeo fica seu*, esqueceu algo daqui a 6 meses você revê

Pra referência de mercado:
• Agência local Palmas: R$1.500-4.000 + mensalidade
• Freela Fiverr: R$1.200-2.000, sem tema custom, sem integração local, sem call

*Meu preço: R$599 uma vez.* Entrega em 7-10 dias.

Palmas recebe no dia (PIX 10h → em casa 14h via motoboy nos 2 horários fixos). Brasil todo via Melhor Envio até 80% mais barato que Correios.

Gancho de ticket médio grátis: "frete grátis a partir de R$250" faz cliente levar 2 pra fechar o valor. Você define a regra.

Case real: o *Gabriel* (GB Nutrition, personal trainer aqui em Palmas) vendia suplemento no WhatsApp — cada pedido ele confirmava PIX, combinava entrega, era gargalo. Hoje a loja dele tá automatizada. Palmas recebe no dia, Brasil todo no checkout. *O Gabriel parou de ser atendente. Voltou a ser personal.*
```

#### Msg 3B — Pitch se ele disser "tenho site"
```
Que legal! Qual é o link? Quero dar uma olhada.
```

#### Msg 4 — Fechamento com 3 horários
```
Posso te mostrar como fica na prática em 20 minutos.

Qual é melhor pra você:
- Quinta (15h)?
- Sexta (14h)?
- Segunda (10h)?
```

#### Arma de fechamento — Call de alinhamento (se ele travar com "e o meu caso?")
```
Antes da gente fechar, tem uma etapa obrigatória do processo: *call de alinhamento* (30 min) com a equipe Impulso.

Não é venda. É *diagnóstico operacional ao vivo* — a gente senta e mapeia: motoboy parceiro ou app, quais horários de corte, Mercado Pago no seu CNPJ, regra de frete grátis por ticket, fornecedores do seu nicho.

Você sai da call com a loja já alinhada pra rodar: não é mockup, é Shopify no ar com a sua cara. A GB Nutrition do Gabriel e a UrbanFeet só ficaram únicas porque a gente sentou antes de codar. *Não começo a produção sem essa call.*
```

**→ Disparar direto no WhatsApp (msg 1 já pré-preenchida):** https://wa.me/5563992712424?text=Ol%C3%A1%20Don!%20%F0%9F%91%8B%0A%0AVi%20que%20voc%C3%AA%20tem%20uma%20Perfumaria%20bem%20legal%20aqui%20em%20Palmas.%0A%0APosso%20te%20fazer%20uma%20pergunta%20r%C3%A1pida%3F

---

### SHOPIFY 3. San Remo Moda Masculina | Palmas

**Ficha:** Loja de roupas · Google 4.6 (91 aval) · IG @sanremopalmas
**Bio IG:** —
**Site:** NÃO TEM · Agenda online: não
**Telefone:** `(63)3028-0065`

**Diagnóstico estratégico (Gemini):**
- Fallback: [GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash
- **Argumento de fechamento:** Usar script padrão
- **Urgência:** A definir

**Oferta que vai rodar:** `shopify-solo`

#### Msg 1 — Abertura cirúrgica (Gemini, específica pro San)
```
Olá San! 👋

Vi que você tem uma Loja de roupas bem legal aqui em Palmas.

Posso te fazer uma pergunta rápida?
```

#### Msg 2 — Diagnóstico (variante A)
```
Deixa eu te perguntar: cliente de Palmas que quer receber HOJE — ele compra de você, ou compra de loja de SP/RJ que vende aqui pela internet?
```

#### Msg 3A — Pitch se ele disser "só tenho Instagram"
```
Entendi. Deixa eu te mostrar o que você leva antes de falar preço.

→ Setup Shopify completo — tema profissional, domínio, SSL, checkout otimizado (agência cobra R$1.500)
→ Tema MPN customizado — mesmo tema que a UrbanFeet e o Gabriel usam, não é template genérico (R$1.000)
→ Integrações prontas — Mercado Pago (PIX/cartão 12x), Melhor Envio (5+ transportadoras), WhatsApp (R$400)
→ 20 produtos cadastrados — fotos, descrição, preço, variação, estoque (R$300)

*Valor de mercado: R$3.200.*

E GRÁTIS empilhado:
✓ Shopify $1/mês nos primeiros 3 meses — programa promocional, quase de graça pra testar
✓ Lista de fornecedores do nicho que a Impulso mapeou
✓ Scripts de prospecção pra puxar os primeiros 10 clientes
✓ Call de entrega ao vivo gravada — *o vídeo fica seu*, esqueceu algo daqui a 6 meses você revê

Pra referência de mercado:
• Agência local Palmas: R$1.500-4.000 + mensalidade
• Freela Fiverr: R$1.200-2.000, sem tema custom, sem integração local, sem call

*Meu preço: R$599 uma vez.* Entrega em 7-10 dias.

Palmas recebe no dia (PIX 10h → em casa 14h via motoboy nos 2 horários fixos). Brasil todo via Melhor Envio até 80% mais barato que Correios.

Gancho de ticket médio grátis: "frete grátis a partir de R$250" faz cliente levar 2 pra fechar o valor. Você define a regra.

Case real: o *Gabriel* (GB Nutrition, personal trainer aqui em Palmas) vendia suplemento no WhatsApp — cada pedido ele confirmava PIX, combinava entrega, era gargalo. Hoje a loja dele tá automatizada. Palmas recebe no dia, Brasil todo no checkout. *O Gabriel parou de ser atendente. Voltou a ser personal.*
```

#### Msg 3B — Pitch se ele disser "tenho site"
```
Que legal! Qual é o link? Quero dar uma olhada.
```

#### Msg 4 — Fechamento com 3 horários
```
Posso te mostrar como fica na prática em 20 minutos.

Qual é melhor pra você:
- Quinta (15h)?
- Sexta (14h)?
- Segunda (10h)?
```

#### Arma de fechamento — Call de alinhamento (se ele travar com "e o meu caso?")
```
Antes da gente fechar, tem uma etapa obrigatória do processo: *call de alinhamento* (30 min) com a equipe Impulso.

Não é venda. É *diagnóstico operacional ao vivo* — a gente senta e mapeia: motoboy parceiro ou app, quais horários de corte, Mercado Pago no seu CNPJ, regra de frete grátis por ticket, fornecedores do seu nicho.

Você sai da call com a loja já alinhada pra rodar: não é mockup, é Shopify no ar com a sua cara. A GB Nutrition do Gabriel e a UrbanFeet só ficaram únicas porque a gente sentou antes de codar. *Não começo a produção sem essa call.*
```

**→ Disparar direto no WhatsApp (msg 1 já pré-preenchida):** https://wa.me/556330280065?text=Ol%C3%A1%20San!%20%F0%9F%91%8B%0A%0AVi%20que%20voc%C3%AA%20tem%20uma%20Loja%20de%20roupas%20bem%20legal%20aqui%20em%20Palmas.%0A%0APosso%20te%20fazer%20uma%20pergunta%20r%C3%A1pida%3F

---

### SHOPIFY 4. Cia do Verão Beach & Fashion - Avenida JK

**Ficha:** Loja de roupas · Google 4.9 (73 aval) · IG @ciadoverao_palmas
**Bio IG:** —
**Site:** NÃO TEM · Agenda online: não
**Telefone:** `(63)98419-9311`

**Diagnóstico estratégico (Gemini):**
- Fallback: [GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash
- **Argumento de fechamento:** Usar script padrão
- **Urgência:** A definir

**Oferta que vai rodar:** `shopify-solo`

#### Msg 1 — Abertura cirúrgica (Gemini, específica pro Cia)
```
Olá Cia! 👋

Vi que você tem uma Loja de roupas bem legal aqui em Palmas.

Posso te fazer uma pergunta rápida?
```

#### Msg 2 — Diagnóstico (variante A)
```
Deixa eu te perguntar: cliente de Palmas que quer receber HOJE — ele compra de você, ou compra de loja de SP/RJ que vende aqui pela internet?
```

#### Msg 3A — Pitch se ele disser "só tenho Instagram"
```
Entendi. Deixa eu te mostrar o que você leva antes de falar preço.

→ Setup Shopify completo — tema profissional, domínio, SSL, checkout otimizado (agência cobra R$1.500)
→ Tema MPN customizado — mesmo tema que a UrbanFeet e o Gabriel usam, não é template genérico (R$1.000)
→ Integrações prontas — Mercado Pago (PIX/cartão 12x), Melhor Envio (5+ transportadoras), WhatsApp (R$400)
→ 20 produtos cadastrados — fotos, descrição, preço, variação, estoque (R$300)

*Valor de mercado: R$3.200.*

E GRÁTIS empilhado:
✓ Shopify $1/mês nos primeiros 3 meses — programa promocional, quase de graça pra testar
✓ Lista de fornecedores do nicho que a Impulso mapeou
✓ Scripts de prospecção pra puxar os primeiros 10 clientes
✓ Call de entrega ao vivo gravada — *o vídeo fica seu*, esqueceu algo daqui a 6 meses você revê

Pra referência de mercado:
• Agência local Palmas: R$1.500-4.000 + mensalidade
• Freela Fiverr: R$1.200-2.000, sem tema custom, sem integração local, sem call

*Meu preço: R$599 uma vez.* Entrega em 7-10 dias.

Palmas recebe no dia (PIX 10h → em casa 14h via motoboy nos 2 horários fixos). Brasil todo via Melhor Envio até 80% mais barato que Correios.

Gancho de ticket médio grátis: "frete grátis a partir de R$250" faz cliente levar 2 pra fechar o valor. Você define a regra.

Case real: o *Gabriel* (GB Nutrition, personal trainer aqui em Palmas) vendia suplemento no WhatsApp — cada pedido ele confirmava PIX, combinava entrega, era gargalo. Hoje a loja dele tá automatizada. Palmas recebe no dia, Brasil todo no checkout. *O Gabriel parou de ser atendente. Voltou a ser personal.*
```

#### Msg 3B — Pitch se ele disser "tenho site"
```
Que legal! Qual é o link? Quero dar uma olhada.
```

#### Msg 4 — Fechamento com 3 horários
```
Posso te mostrar como fica na prática em 20 minutos.

Qual é melhor pra você:
- Quinta (15h)?
- Sexta (14h)?
- Segunda (10h)?
```

#### Arma de fechamento — Call de alinhamento (se ele travar com "e o meu caso?")
```
Antes da gente fechar, tem uma etapa obrigatória do processo: *call de alinhamento* (30 min) com a equipe Impulso.

Não é venda. É *diagnóstico operacional ao vivo* — a gente senta e mapeia: motoboy parceiro ou app, quais horários de corte, Mercado Pago no seu CNPJ, regra de frete grátis por ticket, fornecedores do seu nicho.

Você sai da call com a loja já alinhada pra rodar: não é mockup, é Shopify no ar com a sua cara. A GB Nutrition do Gabriel e a UrbanFeet só ficaram únicas porque a gente sentou antes de codar. *Não começo a produção sem essa call.*
```

**→ Disparar direto no WhatsApp (msg 1 já pré-preenchida):** https://wa.me/5563984199311?text=Ol%C3%A1%20Cia!%20%F0%9F%91%8B%0A%0AVi%20que%20voc%C3%AA%20tem%20uma%20Loja%20de%20roupas%20bem%20legal%20aqui%20em%20Palmas.%0A%0APosso%20te%20fazer%20uma%20pergunta%20r%C3%A1pida%3F

---

### SHOPIFY 5. DELY GUIMARÃES MODA EXECUTIVA FEMININA

**Ficha:** Loja de roupas · Google 5 (63 aval) · IG @dely.guimaraes
**Bio IG:** —
**Site:** NÃO TEM · Agenda online: não
**Telefone:** `(63)98437-9144`

**Diagnóstico estratégico (Gemini):**
- Fallback: [GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash
- **Argumento de fechamento:** Usar script padrão
- **Urgência:** A definir

**Oferta que vai rodar:** `shopify-solo`

#### Msg 1 — Abertura cirúrgica (Gemini, específica pro DELY)
```
Olá DELY! 👋

Vi que você tem uma Loja de roupas bem legal aqui em Palmas.

Posso te fazer uma pergunta rápida?
```

#### Msg 2 — Diagnóstico (variante B)
```
Hoje, quando cai um pedido, como funciona? Negocia frete, manda PIX, confirma recebimento tudo no WhatsApp na mão?

Quanto tempo isso come por semana?
```

#### Msg 3A — Pitch se ele disser "só tenho Instagram"
```
Entendi. Deixa eu te mostrar o que você leva antes de falar preço.

→ Setup Shopify completo — tema profissional, domínio, SSL, checkout otimizado (agência cobra R$1.500)
→ Tema MPN customizado — mesmo tema que a UrbanFeet e o Gabriel usam, não é template genérico (R$1.000)
→ Integrações prontas — Mercado Pago (PIX/cartão 12x), Melhor Envio (5+ transportadoras), WhatsApp (R$400)
→ 20 produtos cadastrados — fotos, descrição, preço, variação, estoque (R$300)

*Valor de mercado: R$3.200.*

E GRÁTIS empilhado:
✓ Shopify $1/mês nos primeiros 3 meses — programa promocional, quase de graça pra testar
✓ Lista de fornecedores do nicho que a Impulso mapeou
✓ Scripts de prospecção pra puxar os primeiros 10 clientes
✓ Call de entrega ao vivo gravada — *o vídeo fica seu*, esqueceu algo daqui a 6 meses você revê

Pra referência de mercado:
• Agência local Palmas: R$1.500-4.000 + mensalidade
• Freela Fiverr: R$1.200-2.000, sem tema custom, sem integração local, sem call

*Meu preço: R$599 uma vez.* Entrega em 7-10 dias.

Palmas recebe no dia (PIX 10h → em casa 14h via motoboy nos 2 horários fixos). Brasil todo via Melhor Envio até 80% mais barato que Correios.

Gancho de ticket médio grátis: "frete grátis a partir de R$250" faz cliente levar 2 pra fechar o valor. Você define a regra.

Case real: o *Gabriel* (GB Nutrition, personal trainer aqui em Palmas) vendia suplemento no WhatsApp — cada pedido ele confirmava PIX, combinava entrega, era gargalo. Hoje a loja dele tá automatizada. Palmas recebe no dia, Brasil todo no checkout. *O Gabriel parou de ser atendente. Voltou a ser personal.*
```

#### Msg 3B — Pitch se ele disser "tenho site"
```
Que legal! Qual é o link? Quero dar uma olhada.
```

#### Msg 4 — Fechamento com 3 horários
```
Posso te mostrar como fica na prática em 20 minutos.

Qual é melhor pra você:
- Quinta (15h)?
- Sexta (14h)?
- Segunda (10h)?
```

#### Arma de fechamento — Call de alinhamento (se ele travar com "e o meu caso?")
```
Antes da gente fechar, tem uma etapa obrigatória do processo: *call de alinhamento* (30 min) com a equipe Impulso.

Não é venda. É *diagnóstico operacional ao vivo* — a gente senta e mapeia: motoboy parceiro ou app, quais horários de corte, Mercado Pago no seu CNPJ, regra de frete grátis por ticket, fornecedores do seu nicho.

Você sai da call com a loja já alinhada pra rodar: não é mockup, é Shopify no ar com a sua cara. A GB Nutrition do Gabriel e a UrbanFeet só ficaram únicas porque a gente sentou antes de codar. *Não começo a produção sem essa call.*
```

**→ Disparar direto no WhatsApp (msg 1 já pré-preenchida):** https://wa.me/5563984379144?text=Ol%C3%A1%20DELY!%20%F0%9F%91%8B%0A%0AVi%20que%20voc%C3%AA%20tem%20uma%20Loja%20de%20roupas%20bem%20legal%20aqui%20em%20Palmas.%0A%0APosso%20te%20fazer%20uma%20pergunta%20r%C3%A1pida%3F

---

### SHOPIFY 6. Cheiro de Amor Cosméticos

**Ficha:** Loja de cosméticos · Google 5 (63 aval) · IG @cheirodeamor_perfumaria
**Bio IG:** —
**Site:** NÃO TEM · Agenda online: não
**Telefone:** `(63)99253-9472`

**Diagnóstico estratégico (Gemini):**
- Fallback: [GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash
- **Argumento de fechamento:** Usar script padrão
- **Urgência:** A definir

**Oferta que vai rodar:** `shopify-solo`

#### Msg 1 — Abertura cirúrgica (Gemini, específica pro Cheiro)
```
Olá Cheiro! 👋

Vi que você tem uma Loja de cosméticos bem legal aqui em Palmas.

Posso te fazer uma pergunta rápida?
```

#### Msg 2 — Diagnóstico (variante C)
```
Sábado de noite, domingo de manhã — cliente vê seu produto e quer comprar. Você tá lá pra responder, ou o pedido some até segunda?
```

#### Msg 3A — Pitch se ele disser "só tenho Instagram"
```
Entendi. Deixa eu te mostrar o que você leva antes de falar preço.

→ Setup Shopify completo — tema profissional, domínio, SSL, checkout otimizado (agência cobra R$1.500)
→ Tema MPN customizado — mesmo tema que a UrbanFeet e o Gabriel usam, não é template genérico (R$1.000)
→ Integrações prontas — Mercado Pago (PIX/cartão 12x), Melhor Envio (5+ transportadoras), WhatsApp (R$400)
→ 20 produtos cadastrados — fotos, descrição, preço, variação, estoque (R$300)

*Valor de mercado: R$3.200.*

E GRÁTIS empilhado:
✓ Shopify $1/mês nos primeiros 3 meses — programa promocional, quase de graça pra testar
✓ Lista de fornecedores do nicho que a Impulso mapeou
✓ Scripts de prospecção pra puxar os primeiros 10 clientes
✓ Call de entrega ao vivo gravada — *o vídeo fica seu*, esqueceu algo daqui a 6 meses você revê

Pra referência de mercado:
• Agência local Palmas: R$1.500-4.000 + mensalidade
• Freela Fiverr: R$1.200-2.000, sem tema custom, sem integração local, sem call

*Meu preço: R$599 uma vez.* Entrega em 7-10 dias.

Palmas recebe no dia (PIX 10h → em casa 14h via motoboy nos 2 horários fixos). Brasil todo via Melhor Envio até 80% mais barato que Correios.

Gancho de ticket médio grátis: "frete grátis a partir de R$250" faz cliente levar 2 pra fechar o valor. Você define a regra.

Case real: o *Gabriel* (GB Nutrition, personal trainer aqui em Palmas) vendia suplemento no WhatsApp — cada pedido ele confirmava PIX, combinava entrega, era gargalo. Hoje a loja dele tá automatizada. Palmas recebe no dia, Brasil todo no checkout. *O Gabriel parou de ser atendente. Voltou a ser personal.*
```

#### Msg 3B — Pitch se ele disser "tenho site"
```
Que legal! Qual é o link? Quero dar uma olhada.
```

#### Msg 4 — Fechamento com 3 horários
```
Posso te mostrar como fica na prática em 20 minutos.

Qual é melhor pra você:
- Quinta (15h)?
- Sexta (14h)?
- Segunda (10h)?
```

#### Arma de fechamento — Call de alinhamento (se ele travar com "e o meu caso?")
```
Antes da gente fechar, tem uma etapa obrigatória do processo: *call de alinhamento* (30 min) com a equipe Impulso.

Não é venda. É *diagnóstico operacional ao vivo* — a gente senta e mapeia: motoboy parceiro ou app, quais horários de corte, Mercado Pago no seu CNPJ, regra de frete grátis por ticket, fornecedores do seu nicho.

Você sai da call com a loja já alinhada pra rodar: não é mockup, é Shopify no ar com a sua cara. A GB Nutrition do Gabriel e a UrbanFeet só ficaram únicas porque a gente sentou antes de codar. *Não começo a produção sem essa call.*
```

**→ Disparar direto no WhatsApp (msg 1 já pré-preenchida):** https://wa.me/5563992539472?text=Ol%C3%A1%20Cheiro!%20%F0%9F%91%8B%0A%0AVi%20que%20voc%C3%AA%20tem%20uma%20Loja%20de%20cosm%C3%A9ticos%20bem%20legal%20aqui%20em%20Palmas.%0A%0APosso%20te%20fazer%20uma%20pergunta%20r%C3%A1pida%3F

---

### SHOPIFY 7. Racco Cosméticos

**Ficha:** Loja de cosméticos · Google 5 (63 aval) · IG @raccocosmeticos
**Bio IG:** —
**Site:** NÃO TEM · Agenda online: não
**Telefone:** `(63)3216-1401`

**Diagnóstico estratégico (Gemini):**
- Fallback: [GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash
- **Argumento de fechamento:** Usar script padrão
- **Urgência:** A definir

**Oferta que vai rodar:** `shopify-solo`

#### Msg 1 — Abertura cirúrgica (Gemini, específica pro Racco)
```
Olá Racco! 👋

Vi que você tem uma Loja de cosméticos bem legal aqui em Palmas.

Posso te fazer uma pergunta rápida?
```

#### Msg 2 — Diagnóstico (variante A)
```
Deixa eu te perguntar: cliente de Palmas que quer receber HOJE — ele compra de você, ou compra de loja de SP/RJ que vende aqui pela internet?
```

#### Msg 3A — Pitch se ele disser "só tenho Instagram"
```
Entendi. Deixa eu te mostrar o que você leva antes de falar preço.

→ Setup Shopify completo — tema profissional, domínio, SSL, checkout otimizado (agência cobra R$1.500)
→ Tema MPN customizado — mesmo tema que a UrbanFeet e o Gabriel usam, não é template genérico (R$1.000)
→ Integrações prontas — Mercado Pago (PIX/cartão 12x), Melhor Envio (5+ transportadoras), WhatsApp (R$400)
→ 20 produtos cadastrados — fotos, descrição, preço, variação, estoque (R$300)

*Valor de mercado: R$3.200.*

E GRÁTIS empilhado:
✓ Shopify $1/mês nos primeiros 3 meses — programa promocional, quase de graça pra testar
✓ Lista de fornecedores do nicho que a Impulso mapeou
✓ Scripts de prospecção pra puxar os primeiros 10 clientes
✓ Call de entrega ao vivo gravada — *o vídeo fica seu*, esqueceu algo daqui a 6 meses você revê

Pra referência de mercado:
• Agência local Palmas: R$1.500-4.000 + mensalidade
• Freela Fiverr: R$1.200-2.000, sem tema custom, sem integração local, sem call

*Meu preço: R$599 uma vez.* Entrega em 7-10 dias.

Palmas recebe no dia (PIX 10h → em casa 14h via motoboy nos 2 horários fixos). Brasil todo via Melhor Envio até 80% mais barato que Correios.

Gancho de ticket médio grátis: "frete grátis a partir de R$250" faz cliente levar 2 pra fechar o valor. Você define a regra.

Case real: o *Gabriel* (GB Nutrition, personal trainer aqui em Palmas) vendia suplemento no WhatsApp — cada pedido ele confirmava PIX, combinava entrega, era gargalo. Hoje a loja dele tá automatizada. Palmas recebe no dia, Brasil todo no checkout. *O Gabriel parou de ser atendente. Voltou a ser personal.*
```

#### Msg 3B — Pitch se ele disser "tenho site"
```
Que legal! Qual é o link? Quero dar uma olhada.
```

#### Msg 4 — Fechamento com 3 horários
```
Posso te mostrar como fica na prática em 20 minutos.

Qual é melhor pra você:
- Quinta (15h)?
- Sexta (14h)?
- Segunda (10h)?
```

#### Arma de fechamento — Call de alinhamento (se ele travar com "e o meu caso?")
```
Antes da gente fechar, tem uma etapa obrigatória do processo: *call de alinhamento* (30 min) com a equipe Impulso.

Não é venda. É *diagnóstico operacional ao vivo* — a gente senta e mapeia: motoboy parceiro ou app, quais horários de corte, Mercado Pago no seu CNPJ, regra de frete grátis por ticket, fornecedores do seu nicho.

Você sai da call com a loja já alinhada pra rodar: não é mockup, é Shopify no ar com a sua cara. A GB Nutrition do Gabriel e a UrbanFeet só ficaram únicas porque a gente sentou antes de codar. *Não começo a produção sem essa call.*
```

**→ Disparar direto no WhatsApp (msg 1 já pré-preenchida):** https://wa.me/556332161401?text=Ol%C3%A1%20Racco!%20%F0%9F%91%8B%0A%0AVi%20que%20voc%C3%AA%20tem%20uma%20Loja%20de%20cosm%C3%A9ticos%20bem%20legal%20aqui%20em%20Palmas.%0A%0APosso%20te%20fazer%20uma%20pergunta%20r%C3%A1pida%3F

---
