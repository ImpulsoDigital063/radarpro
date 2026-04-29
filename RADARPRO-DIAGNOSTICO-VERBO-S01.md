# RadarPRO · Diagnóstico de Tom — Verbo s01

> **Data:** 29.04.2026 · ~04:30am
> **Solicitante:** Eduardo Barros
> **Frase-âncora:** *"Tão muito impessoais, sem educação. Quero que você conserte. Dê vida ao RadarPRO."*
>
> **O que este arquivo é:** diagnóstico estrutural antes da reescrita. Não tô consertando aqui — tô identificando **onde** consertar, **por que** tá errado, e **como** o padrão correto deve ficar. Verbo s02 ataca a reescrita amanhã com base nisto.

<!-- λ.diag -->

---

## Arquivos analisados

1. `lib/mensagens.ts` (508 linhas) — templates fallback genéricos + objeções universais + script estruturado 4-mensagens
2. `lib/disparo-analises.ts` (1.261 linhas) — 53 leads com playbook customizado completo (abertura, follow-up D+3, D+7, pré-engajamento Insta)
3. `lib/gemini.ts` (2.218 linhas) — system prompt + 11 ações de IA

## TL;DR — o que tá frio

A estrutura técnica do CORE_SYSTEM_V2 tá **boa** (3 linhas, dado real → consequência → pergunta direta). O problema **não é estrutural — é tonal**. As mensagens lêem como **scraper-bot que sabe muito**, não como **pessoa de Palmas que se importa**.

A "alma" que tá faltando é cortesia humana mínima e variedade de abertura. Eduardo cortou TODO sinal de saudação pra evitar spam — mas cortou demais, virou outro extremo: **frio-clínico-observatório**.

A correção não é voltar pro "Olá Carlos, tudo bem?". É achar o **meio-termo palmense**: cortesia rápida + dado real + tom de gente.

---

## Os 8 problemas estruturais

### Problema 1 — Aberturas começam SEMPRE com "Vi que..."
**Arquivos:** `disparo-analises.ts` — 53 de 53 leads.
**Por que tá errado:** padrão repetitivo total. Se um lead conversar com outro lead que recebeu RadarPRO, vão notar. Soa template. Soa scraper. **Mata a impressão de personalização cirúrgica que cada mensagem JÁ tem no conteúdo.**
**Como conserta:** rotação de 5-7 verbos de abertura sem perder o gancho específico:
- "Vi que..."
- "Reparei que..."
- "Tava aqui passando o olho em [contexto] e..."
- "Cheguei no teu perfil pelo Maps agora..."
- "Tava pesquisando [nicho] em Palmas e tu apareceu..."
- "Olhei rapidamente teu perfil e..."
- "Passei pelo teu Google Business hoje..."

A escolha do verbo deve casar com o **caminho real** que Eduardo usaria pra explicar como achou a pessoa. Variedade orgânica > template fixo.

---

### Problema 2 — Zero cortesia humana antes do dado frio
**Arquivos:** `disparo-analises.ts` (todos os leads), `mensagens.ts` (`gerarMensagemLP`, `gerarMensagemShopify`, `gerarMensagemAgendaPRO`).
**Por que tá errado:** mandar uma observação fria como primeira mensagem WhatsApp pra um stranger é **culturalmente agressivo no Brasil**. Não precisa ser "Olá Dr. Roberto, tudo bem?" — mas precisa de **algum sinal mínimo de que o remetente é gente, não bot**.
**Como conserta:** uma das duas opções, a depender do perfil:

**Opção A (lead informal — loja, brechó, esteta jovem):**
```
ei [opcional, breve]
[abertura nova com verbo rotacionado]
...
```

**Opção B (lead formal — médico, advogado, dentista, psi):**
```
[saudação cirúrgica curta — 2-4 palavras, contextual]
[abertura com verbo rotacionado]
...
```

Exemplos de saudação cirúrgica curta pra leads formais (sem "tudo bem?"):
- "doutora, boa noite"
- "uma coisa rápida, doutor"
- "boa noite, dra"
- "doutor, deixa eu ser objetivo"

A regra: NÃO peça resposta na saudação ("tudo bem?" obriga responder antes de ler). Use saudação **declarativa**, não interrogativa.

---

### Problema 3 — Pergunta final do trio é IMPOSITIVA, não CONVITE
**Arquivos:** todas as aberturas em `disparo-analises.ts`.
**Por que tá errado:** "quem te acha ali hoje agenda direto ou ainda fica em dúvida?" — sintática de imposição. Pra alguém que NUNCA falou contigo antes, parece interrogatório.
**Como conserta:** introduzir micro-conector que vira convite:
- ❌ *"hoje quem te acha ali agenda direto ou ainda fica em dúvida?"*
- ✅ *"queria te perguntar uma coisa: quem te acha ali agenda direto ou ainda fica em dúvida?"*
- ✅ *"se tu puder me dizer rapidinho — quem te acha hoje agenda direto ou fica em dúvida?"*
- ✅ *"se fizer sentido te perguntar: quem te acha agenda direto ou fica em dúvida?"*

A diferença é mínima na fala mas **enorme na recepção**. Convite > imposição.

---

### Problema 4 — Tom de "quanto isso te custa por mês" é direto demais pra cold open
**Arquivos:** `disparo-analises.ts` lead #9 (Izabela Nutri).
**Trecho problemático:**
```
quanto desse paciente novo tu acha que perde por mês?
```
**Por que tá errado:** pergunta financeira direta na **primeira** mensagem de cold outreach é puxar o tapete antes do lead ter dado um "OK, eu te escuto". Funciona em call, não em WhatsApp seco.
**Como conserta:** trocar a métrica financeira por métrica COMPORTAMENTAL na 1ª mensagem. Deixar a pergunta de R$ pro Diagnóstico (msg 2) ou Pitch (msg 3):
- ❌ *"quanto desse paciente novo tu acha que perde por mês?"*
- ✅ *"esse paciente novo que pesquisa às 23h — tu sente que tem chegado, ou tá indo pra outra nutri?"*

---

### Problema 5 — Follow-ups D+3 todos começam IDÊNTICOS
**Arquivos:** `disparo-analises.ts` — 50+ leads usam `"uma coisa que vejo aqui em Palmas"` ou `"uma coisa que vejo em [nicho]"`.
**Por que tá errado:** se um lead respondeu na D+3 e comparou com outro lead que recebeu também, **fica óbvio que é template**. RadarPRO perde toda a credibilidade de "personalização cirúrgica".
**Como conserta:** rotação de 5-6 frases-âncora pra D+3:
- "voltei rapidinho — uma coisa que percebi em [nicho]..."
- "ei, ainda tô pensando no que tu compartilhou — em [nicho] geralmente acontece que..."
- "amanhã quero finalizar uma proposta pra [nicho similar] e me lembrei de ti — tem isso aí?"
- "uma observação que faz diferença em [nicho]:"
- "passei na tua frente de novo e veio uma coisa: ..."
- "voltando aqui rapidinho — esse padrão eu vejo muito em [nicho]:"

---

### Problema 6 — Follow-up D+7 é literal-clichê
**Arquivos:** `disparo-analises.ts` — TODOS os 53 leads usam o mesmo D+7:
```
vou parar por aqui pra não encher
se fizer sentido depois, me chama
```
**Por que tá errado:** a frase é boa em isolamento, mas **quando 53 leads recebem a mesma frase exata**, vira assinatura-de-bot. Se 2 leads compararem, RadarPRO fica queimado.
**Como conserta:** 4-5 variações que mantêm a mesma intenção (respeito + porta aberta):
- "vou parar por aqui pra não encher / se fizer sentido depois, me chama"
- "fica frio com isso — quando virar prioridade, me chama"
- "tô parando por aqui pra não te incomodar / minha porta tá aberta quando der"
- "encerro a conversa por enquanto / quando fizer sentido, me responde"
- "vou te deixar em paz — se mudar de ideia, é só me chamar"

---

### Problema 7 — Templates GENÉRICOS em `mensagens.ts` são MAIS frios que os customizados
**Arquivos:** `mensagens.ts` — `gerarMensagemLP`, `gerarMensagemShopify`, `gerarMensagemAgendaPRO`.
**Trecho problemático:**
```
Vi que você atende ${especialidade} aqui em Palmas
hoje quem pesquisa isso no Google te acha direto ou cai em concorrente?
```
**Por que tá errado:** essas funções são **fallback genérico** pra quando o lead não tem playbook customizado. Mas elas servem como BASE pra outras instâncias serem geradas via Gemini. Se a base é fria, o ramo é frio.
**Como conserta:** reescrever as 3 funções base com:
1. Saudação cirúrgica condicional por categoria (formal vs informal)
2. Verbo de abertura rotacionado por hash
3. Pergunta com micro-conector convite
4. Pelo menos 2 variantes A/B pra cada categoria

---

### Problema 8 — System prompt do `gemini.ts` PROÍBE cortesia, não a CALIBRA
**Arquivos:** `gemini.ts` linhas 17-26 (REGRAS DURAS).
**Trecho problemático:**
```
### PROIBIDO ABSOLUTAMENTE na mensagem inicial
- "Olá [NOME]!" / "Oi [NOME], tudo bem?" / "Oi, beleza?" + apresentação...
- Emojis de saudação 👋 🙌 ✨
```
**Por que tá errado:** a proibição é total. Mas o problema nunca foi "Olá" — foi "Olá [NOME], tudo bem? Eduardo aqui, Impulso Digital, sou de Palmas, vi seu perfil...". A regra atual cortou junto com o ruim TODO sinal de educação. **Resultado: respostas geradas pelo Gemini saem secas demais, cumprindo a regra.**
**Como conserta:** trocar PROIBIDO ABSOLUTO por **PROIBIDO + EXCEÇÕES CALIBRADAS**:

```markdown
### Saudação — REGRA NUANCEADA
- ❌ NÃO usa: "Olá [NOME]!", "Oi [NOME], tudo bem?", "Posso fazer uma pergunta?"
- ❌ NÃO usa: emojis de saudação
- ❌ NÃO faz auto-identificação na 1ª msg ("Eduardo aqui, Impulso Digital...")
- ✅ PODE usar saudação cirúrgica curta (2-4 palavras, declarativa, não interrogativa):
   - Lead informal: "ei", "boa, [contexto]"
   - Lead formal (médico, advogado, dentista, psi): "doutor/dra, boa noite", "uma coisa rápida, doutor"
- ✅ PODE usar conector de cortesia antes da pergunta final:
   - "queria te perguntar uma coisa rápida"
   - "se tu puder me dizer rapidinho"
   - "se fizer sentido te perguntar"
```

---

## O padrão alvo — exemplos de "antes vs depois"

### Exemplo 1 — Lead psicólogo (#55 Gilson)

**ANTES (atual):**
```
Vi que você tem 135 avaliações no Google aí em Palmas
isso já mostra que você construiu uma base forte
quem te acha ali hoje agenda direto ou ainda fica em dúvida?
```

**DEPOIS (proposta Verbo):**
```
boa noite, doutor

reparei que tu tem 135 avaliações no Google aí em Palmas — base sólida pra quem ainda chega novo
queria te perguntar uma coisa: quem te acha ali hoje agenda direto, ou tu sente que muita gente fica em dúvida e some?
```

**Mudanças:**
- Saudação cirúrgica `"boa noite, doutor"` — declarativa, 3 palavras, não interrogativa, respeita o "Dr."
- Verbo rotacionado: `Vi` → `reparei`
- Micro-frase de validação inserida: `"base sólida pra quem ainda chega novo"` (reconhece a conquista do dado, não só observa)
- Conector de convite: `"queria te perguntar uma coisa"`
- Pergunta com texto humanizado: `"e some"` no fim cria empatia (não é só "fica em dúvida", é "fica em dúvida e some")

---

### Exemplo 2 — Lead loja Shopify informal (#1096 Brechó)

**ANTES (atual):**
```
Vi que tu tem 13.7k seguidores no Insta com 14% de engajamento — varejo bom fica em 1-3%
isso é volume gigante que vira DM (medida, frete, pix, comprovante)
quanto da tua semana vai só pra responder essas mensagens?
```

**DEPOIS (proposta Verbo):**
```
ei, passei pelo teu Insta agora

tu tem 13.7k seguidores com 14% de engajamento — varejo bom fica em 1-3%, isso é absurdamente alto
o lado B desse engajamento todo é o DM virando call center: medida, frete, pix, comprovante
deixa eu te perguntar uma coisa: quanto da tua semana vai só pra isso?
```

**Mudanças:**
- Saudação informal mínima: `"ei, passei pelo teu Insta agora"`
- Validação humana inserida: `"isso é absurdamente alto"` — reconhece o feito, não só registra
- Linguagem coloquial palmense mantida: `"o lado B"`, `"DM virando call center"` — tom de amigo que entende
- Micro-frase de transição: `"deixa eu te perguntar uma coisa"` antes da pergunta financeira

---

### Exemplo 3 — Genérico fallback `gerarMensagemLP`

**ANTES (atual):**
```ts
return `Vi que você atende ${especialidade} aqui em Palmas
hoje quem pesquisa isso no Google te acha direto ou cai em concorrente?`
```

**DEPOIS (proposta Verbo) — 2 variantes A/B:**
```ts
// Variante A — informal
function variantA(esp: string): string {
  return `ei, tava olhando ${esp} em Palmas e tu apareceu

queria te perguntar uma coisa rápida — quem pesquisa "${esp} em Palmas" no Google hoje, te acha ou cai em concorrente?`
}

// Variante B — formal (médico, dentista, advogado, psi)
function variantB(esp: string, tratamento: 'doutor' | 'dra' | 'profissional'): string {
  const trat = tratamento === 'profissional' ? '' : `, ${tratamento}`
  return `boa noite${trat}

reparei que tu atende ${esp} aqui em Palmas
se eu puder te perguntar uma coisa: quem pesquisa "${esp} em Palmas" no Google hoje, te acha ou cai em concorrente?`
}
```

---

## Plano de execução pra Verbo s02

### Ordem de ataque (pelo retorno por minuto)

1. **`gemini.ts` system prompt** (15-20 min) — a regra de cortesia calibrada vai cascatar pra TODA geração futura. Maior alavanca primeiro.
2. **`mensagens.ts` 3 funções base** (15 min) — fallbacks ficam quentes, mantêm coerência com o system prompt.
3. **`disparo-analises.ts` aberturas dos 6 Tier A** (40-60 min) — leads prioritários ganham tom novo primeiro. Eduardo dispara esses primeiro mesmo.
4. **`disparo-analises.ts` follow-ups D+3 e D+7** (rotação aplicada em massa via script ou edição em batch — 30 min)
5. **`disparo-analises.ts` aberturas dos 47 restantes** (90-120 min) — pode ser dividido em 2 sessões se Eduardo quiser validar Tier A primeiro.

### Critério de validação por Eduardo

Antes de aplicar em massa, Verbo s02 vai pedir Eduardo pra **olhar 3 exemplos reescritos** (1 informal, 1 formal médico, 1 formal advogado/psi) e dizer "tá no tom" ou "ajusta tal coisa". **Não aplica os 53 sem validação humana.** Risco de queimar leads é alto se o tom não ficou exato.

### Não-mexer

- A estrutura 3-linhas (observação → consequência → pergunta) — mantém
- O dado-âncora específico de cada lead — mantém
- A pergunta direta no fim — mantém (só adiciona convite)
- O critério "se serve pra qualquer lead, está errada" — mantém
- O pricing, cases reais, autoridade Eduardo — mantém

**O que muda:** **só o tom**. Estrutura é igual. Conteúdo é igual. **Calor é diferente.**

---

## Princípio que vai guiar a reescrita

> *"O lead tem que ler a mensagem e sentir que Eduardo se importou em escrever especificamente pra ele. Hoje, ele lê e sente que um sistema observou um dado e mandou uma observação. A diferença entre as duas leituras é o que separa **0% de resposta** de **15% de resposta**."*
>
> — Verbo, formulando o critério em 29.04.2026

---

## Métricas de sucesso (pra medir depois do disparo)

- **Reply rate baseline atual** (com tom frio): ?
- **Meta com tom corrigido:** dobrar reply rate
- **Sinal qualitativo:** lead que responde com "obrigado pelo contato" ou "tu é de Palmas mesmo?" — sinal de que o tom passou de bot pra gente
- **Sinal de fracasso:** lead respondendo "tá enviando essa mensagem pra quantos?" — significa que o tom continuou template

---

<!-- λ.assinatura-diag -->

```
═══════════════════════════════════
       Λ.verbo · diag · s01 · 29.04.2026
   "antes da reescrita, o mapa"
       diagnóstico ⊕ próximo passo
═══════════════════════════════════
```

— Verbo
*s01 · 29.04.2026 · ~04:50am · pronto pra s02 atacar*
