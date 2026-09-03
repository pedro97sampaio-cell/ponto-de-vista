# Ponto de Vista — site

Site de uma página para uma produtora de fotografia e vídeo a dois (câmara + drone):
casamentos, batizados, comunhões e eventos de empresa.

## Correr

```
python -m http.server 8123
```
Depois abrir <http://127.0.0.1:8123/>. Nota: o `http.server` nao manda cabecalhos de
no-cache, por isso o browser servira `style.css` da cache mesmo com `?v=` no URL da pagina.
Ao alterar o CSS, recarregar com Ctrl+Shift+R. Não há build, não há dependências, não há `node_modules`.
São três ficheiros: `index.html`, `assets/css/style.css`, `assets/js/app.js`.

## Sistema visual

Registo: **galeria silenciosa**. A fotografia manda, a tipografia sussurra. Calibrado contra
sites de referência do género (KT Merry, entre outros), não inventado.

| Token | Valor | Papel |
|---|---|---|
| `--ground` | `#2b2a28` | carvão quente — o chão da página. Preto puro endurece a fotografia. |
| `--paper` | `#f3f1ec` | tinta sobre escuro **e** a inversão única (Serviços) |
| `--sand` | `#c9b79c` | único tom quente, a conta-gotas: `0 m`/`120 m`, itálicos de ênfase, foco |

- **Cormorant Garamond 300** (display) + **Jost 300/400** (caps utilitárias e corpo). Duas famílias.
- Caps a 12px com `letter-spacing` de 0.18–0.20em para tudo o que é utilitário.

### A regra que manda

> O display nunca leva tracking negativo e nunca passa de weight 300.

É daí que vem a elegância. A versão anterior usava Bodoni Moda weight 400 a 13.5rem com
`letter-spacing: -0.052em` — isso é registo de revista de moda, não de estúdio profissional.
Ler as referências do género confirmou-o: usam serifas extra-light com espacejamento **natural**,
display a 80–120px (não 200), e muito mais ar do que instinto nos diz.

### As decisões que importam

1. **O herói.** Fotografia à esquerda, painel escuro à direita com o lettering — a estrutura
   da referência. A cadência vem da alternância entre romana em caixa-alta e itálico: as linhas
   em itálico são menores, recuadas e em areia. Em mobile empilha (foto 50svh, painel por baixo).
2. **A troca de ponto de vista.** As peças marcadas `120 m` fazem crossfade para a aérea do mesmo
   momento no hover (`.fr__air`, CSS puro). Silenciosa: sem caixa, sem badge, sem timecode.
3. **Números que são informação.** `0 m` / `120 m`, não `01 / 02`. Nos Serviços não há numeração —
   não é uma sequência.
4. **Centrado e com ar.** Cabeçalhos de secção ao centro, medidas curtas, bandas altas.
5. **Subtração.** Foram cortados: a fita técnica, os quatro rótulos de secção, a barra do herói,
   as linhas de especificações, o botão da dupla, a pista sobre o hover, os links do rodapé,
   dois campos do formulário e três peças da grelha. As categorias apareciam quatro vezes na
   página; agora aparecem uma. Antes de acrescentar seja o que for, perguntar o que sai.

### Duas armadilhas já corrigidas — não reintroduzir

- **`text-transform: uppercase` come as unidades.** Dava `0 M`, `120 M`, `12 H`. Qualquer elemento
  que carregue uma unidade SI não pode herdar `uppercase`. Já reapareceu uma vez, quando o `<b>`
  que tinha a exceção foi removido numa simplificação — verificar depois de mexer nessas linhas.
- **A nav sobre fotografia clara.** A marca desaparecia contra o céu do herói. Tem um scrim em
  `.nav::before`, que se apaga quando a barra ganha fundo sólido. Não remover.
- **`backdrop-filter` por elemento repetido congela o renderer.** Estava em cada badge da grelha.
  Ficou só no `.nav`.

## Substituir por conteúdo real

### Imagens
Todas as fotografias são **placeholders do Unsplash** (licença Unsplash, uso livre) carregadas
por hotlink do CDN. Substituir os `src`/`srcset` em `index.html` por ficheiros próprios em
`assets/img/`. Manter os atributos `width`/`height` para não haver salto de layout (CLS), e
manter `loading="lazy"` em tudo o que está abaixo da dobra.

### Vídeo
- O herói tem um `<video autoplay muted loop playsinline>` a apontar para `assets/media/reel.mp4`.
  **O ficheiro ainda não existe** — sem ele o browser mostra o `poster` e a página fica correta.
  Basta pôr lá o reel para o herói passar a mexer.
- Cada peça de vídeo da grelha abre um `<dialog>` que carrega `assets/media/<slug>.mp4`.
  Slugs em uso: `ana-tiago`, `quinta`, `comunhao`, `conferencia`.

### Formulário
`app.js` valida com a API nativa e depois **não envia nada** — está marcado com um `TODO`.
Ligar a um endpoint (Formspree, Resend, API própria) antes de pôr no ar, ou os pedidos perdem-se.

## Conteúdo a confirmar antes de publicar

Escrevi copy realista para o site não parecer um wireframe. **Nada disto foi verificado convosco** —
confirmar ou corrigir cada linha:

- Nome da marca "Ponto de Vista" e domínio `pontodevista.pt`.
- `hello@pontodevista.pt` e `+351 900 000 000` — ambos inventados.
- "Porto — em todo o país" como base de operação.
- **"Drone certificado"** e **"a cento e vinte metros"** — em Portugal a operação de drones é
  regulada pela ANAC ao abrigo do Regulamento de Execução (UE) 2019/947. O limite geral de altura
  na categoria aberta é 120 m acima da superfície, e o operador tem de estar registado. A frase só
  se pode manter se o registo existir mesmo; caso contrário é uma afirmação falsa sobre licença.
- Prazos e âmbitos em "O que levam para casa": "6 a 10 minutos", "cortes para redes em 24 h",
  "resposta em 24 h", "a partir de 12 h". São compromissos comerciais — confirmar todos.
- Nomes dos trabalhos na grelha (Ana & Tiago, Marta & Rui, Quinta da Boeira, Alfândega…) e as
  durações dos vídeos.
- O testemunho não tem nome próprio precisamente por não ser real. Substituir por um verdadeiro,
  com autorização de quem o deu.

## Acessibilidade e desempenho

- `prefers-reduced-motion` desliga todas as animações e revelações.
- Ordem de cabeçalhos correta (um `h1`, `h2` por secção), `aria-pressed` nos filtros,
  link de salto, `:focus-visible` a areia.
- A troca de ponto de vista também dispara em `:focus-within`, para quem navega por teclado.
- Imagens com dimensões declaradas e `srcset` onde interessa; `preload` só na do herói.
- Contraste: `--paper` sobre `--ground` e o inverso, ambos acima de AA. O `--sand` aparece em texto
  pequeno sobre escuro — medir antes de publicar se for aplicado em mais sítios.

## Estrutura

```
index.html
assets/css/style.css
assets/js/app.js
assets/media/          (vazio — pôr aqui reel.mp4 e os vídeos das peças)
```
