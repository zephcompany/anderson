# Anderson Zawa — Landing page

Site estático em HTML, CSS e JavaScript puro. Sem build, sem dependência, sem framework.
Convertido a partir do arquivo Figma `Anderson-LP`, frame `PAGE`.

---

## Estrutura

```
.
├── index.html              página principal
├── 404.html                página de erro (independente, CSS inline)
├── css/style.css           tokens do Figma em :root + estilos
├── js/main.js              menu, carrossel, marquees, acordeão, contadores, lightbox
├── assets/                 imagens e ícones (ver "Assets" abaixo)
├── baixar-assets.sh        baixa os exports do Figma pra assets/
├── robots.txt
├── sitemap.xml
├── .github/workflows/      deploy automático no GitHub Pages
├── .gitignore
├── .gitattributes
└── .editorconfig
```

---

## Subir no GitHub

**Passo 1 — baixe as imagens antes de commitar.** Sem isso o site vai pro ar
sem foto nenhuma.

```bash
bash baixar-assets.sh
```

**Passo 2 — inicialize e envie.**

```bash
git init
git add .
git commit -m "Landing page do estúdio"
git branch -M main
git remote add origin git@github.com:SEU-USUARIO/anderson-zawa.git
git push -u origin main
```

Se preferir HTTPS, troque a linha do `remote` por
`https://github.com/SEU-USUARIO/anderson-zawa.git`.

**Passo 3 — ligue o GitHub Pages.**
No repositório: **Settings → Pages → Source → GitHub Actions**.
O workflow em `.github/workflows/pages.yml` já está pronto: todo push na `main`
republica o site. O endereço sai como
`https://SEU-USUARIO.github.io/anderson-zawa/`.

**Domínio próprio.** Em **Settings → Pages → Custom domain**, coloque o domínio.
O GitHub cria um arquivo `CNAME` no repositório. No seu provedor de DNS, aponte
um `CNAME` de `www` para `SEU-USUARIO.github.io`.

### Alternativas ao Pages

Vercel, Netlify e Cloudflare Pages funcionam sem nenhuma configuração: conecte
o repositório, deixe o comando de build vazio e o diretório de saída como `/`.

---

## Rodar local

```bash
python3 -m http.server 8000    # ou: npx serve .
```

Abre em `http://localhost:8000`. Dá pra abrir o `index.html` com dois cliques,
mas use um servidor pra testar direito.

---

## Assets

A pasta `assets/` **entra no Git** — as imagens fazem parte do site. Só vídeos
(`.mp4`, `.mov`, `.webm`) estão no `.gitignore`, porque o Git não lida bem com
arquivo pesado; hospede em Vimeo, YouTube ou num bucket.

Os links do `baixar-assets.sh` são exports temporários do Figma e **expiram por
volta de 13/09/2026**. Se algum falhar, reexporte no Figma (selecionar a camada
→ Export → PNG 2x) e salve com o mesmo nome dentro de `assets/`. Nada no código
muda.

Antes de publicar, vale comprimir — as imagens vêm grandes:

```bash
npx @squoosh/cli --webp auto assets/*.png
```

---

## O que está funcionando

| | |
|---|---|
| Header | fixo, esconde ao descer e volta ao subir, hambúrguer no mobile |
| Idioma PT/EN | troca o estado visual e dispara o evento `langchange` — **falta plugar a tradução** |
| Faixa de tags | marquee infinito, pausa no hover |
| Sobre | contadores animam (+53, +44, 12, 100%) ao entrar na tela |
| Projetos | carrossel com setas, dots, arrasto no mouse, swipe no dedo, teclado (← →); 3 cards no desktop, 2 no tablet, 1 no mobile |
| Galeria | marquee infinito de 12 fotos, pausa no hover, clique abre em tela cheia |
| Depoimentos | botão play abre o vídeo num modal |
| FAQ | acordeão com altura animada, abre um por vez |
| Geral | reveal no scroll, foco visível no teclado, `prefers-reduced-motion` respeitado |

---

## Pendências

**Fonte Visby.** O projeto usa Visby CF, que é paga (Connary Fagen). O CSS
procura por ela primeiro e cai na **Outfit** (Google Fonts, geométrica, bem
parecida) se não achar. Com a licença em mãos, coloque os `.woff2` em
`assets/fonts/` e adicione um `@font-face` no topo do `style.css`.

**Vídeos dos depoimentos.** Coloque `depoimento-1.mp4` até `-3.mp4` em
`assets/`. Se forem posts do Instagram ou YouTube, o modal precisa virar embed.

**Link do WhatsApp.** Está com número fake. Procure `wa.me/5500000000000` no
`index.html`.

**Página de projeto.** Os links "Ver projeto →" apontam pra `projeto.html`, que
ainda não existe — é o segundo frame do Figma (`PROJETO`).

**Domínio.** Troque `SEU-DOMINIO.com.br` no `robots.txt` e no `sitemap.xml`.

**Texto do card Villa Vrabel.** Foi escrito fora do Figma porque o card estava
solto no canvas. Revise.

---

## Fidelidade ao Figma

O desktop segue o arquivo de perto. Tablet e mobile foram criados aqui, porque
o Figma só tem o frame de 1920px.

Diferenças conscientes:

- O grid de fundo virou CSS em vez do SVG de 1930px, pra escalar em qualquer largura.
- Linhas divisórias e o divisor com a logo viraram CSS.
- Os quatro cards de projeto, que no Figma ficam lado a lado passando da tela,
  viraram carrossel — que era a intenção do layout.
