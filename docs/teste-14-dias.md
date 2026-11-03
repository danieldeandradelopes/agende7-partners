# Teste de 14 dias — parceria Instagram

Hipótese: perfil de **gestão** gera trial; perfil de **corte** não.
Oferta na LP oficial: 30 dias grátis sem cartão. Pagamento só entra na leitura do **dia 45**.

## Critérios

| Janela | Mata se |
|--------|---------|
| 14 dias | Menos de 2 respostas positivas ao DM, ou 0 trials entre quem postou |
| Dia 45 | Trials > 0 e pagamentos = 0 → problema de ativação do produto, não do parceiro |

Guarda: no máximo 8 DMs; zero fee fixo.

## Passo a passo

1. **Dia 1–2** — Liste 12 contas. Separe em 2 pilhas de 6 (gestão vs corte). Preencha a planilha.
2. **Dia 2–4** — Envie o DM abaixo para 4 de cada pilha.
3. **Dia 5–14** — Quem topar: crie o código no admin (ou ative o cadastro do portal), mande o link `https://agende7.com/?ref=CODIGO`, o texto de story e a resposta a “é caro?”.
4. **Dia 14** — Conte respostas, cliques e trials. Aplique o critério de mata.
5. **Dia 45** — Conte quantas lojas do trial pagaram.

## Script de DM

```
Oi {nome}! Sou o Daniel do Agende7 — agenda online pra barbearia (cliente marca pelo link, lembrete automático, menos furo no WhatsApp).

Teu conteúdo fala com dono de loja. Queria te oferecer indicação: tu posta o link uma vez (story/bio), e se a barbearia assinar pelo teu link, tu fica com o valor do 1º mês depois que ela pagar.

É 30 dias grátis pra quem clicar, sem cartão. Te mando o link e o texto pronto. Se em 14 dias não entrar loja, a gente encerra sem compromisso.

Topa eu te mandar o material?
```

## Texto de story (após aceite)

```
Dono de barbearia: se tua agenda ainda vive no WhatsApp, testa o Agende7 — 30 dias grátis, sem cartão.
Cliente marca pelo link. Tu recebe lembrete automático.
Link na bio.
```

## Resposta a “é caro?”

```
O teste é grátis por 30 dias. Depois o plano mensal fica em torno de R$ 50. Se não fizer sentido pra operação, cancela — sem fidelidade.
```

## Planilha

Use [tracking-14-dias.csv](./tracking-14-dias.csv). Colunas:

- `pilha` — gestao | corte
- `perfil` — @handle
- `seguidores`
- `conteudo_gestao` — sim | nao
- `bio_vende` — sim | nao
- `dm_enviado_em` — AAAA-MM-DD
- `resposta` — positiva | negativa | nenhuma
- `codigo_ref`
- `story_em` — AAAA-MM-DD
- `cliques`
- `trials`
- `pagou_dia_45` — sim | nao | pendente
- `notas`
