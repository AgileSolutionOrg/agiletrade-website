# agiletrade-website

Landing page estatica da Agile Trade (agiletrade.com.br, GitHub Pages).

Abra `index.html` no navegador para visualizar o site.

## CSS e fontes sao gerados — e commitados

O site nao carrega nada de terceiros ao abrir: o Tailwind e compilado e as
fontes ficam em `assets/fonts`. O GitHub Pages serve o repositorio como esta,
sem passo de build, entao o resultado vai no commit.

```
npm install
npm run build:css   # mexeu em classe de algum HTML/JS -> regenera assets/css/tailwind.css
npm run fontes      # so se mudar fonte, peso ou icone do Material Symbols
```

**Icone novo:** acrescente o nome em `ICONES`, em `scripts/baixar-fontes.mjs`,
e rode `npm run fontes`. Icone fora da lista aparece como texto.

## Cookies

O Google Analytics so carrega depois do "Aceitar" (`consentimento.js`). O link
"Preferencias de cookies" do rodape (`data-preferencias-cookies`) reabre o
aviso; recusar depois de ter aceitado apaga os cookies `_ga` e recarrega a
pagina. Toda pagina nova precisa do `<script src="consentimento.js">` e desse
link no rodape.
