/**
 * Baixa as fontes do site para assets/fonts e escreve assets/css/fontes.css.
 *
 * Antes, cada visita buscava as fontes no Google (fonts.googleapis.com e
 * fonts.gstatic.com) ANTES de qualquer consentimento — o IP do visitante ia
 * para um terceiro que nem constava na Politica de Privacidade. Servidas daqui,
 * nenhum terceiro e contatado so por abrir a pagina.
 *
 * Roda uma vez (e de novo so se mudar fonte, peso ou icone):
 *
 *   npm run fontes
 *
 * Material Symbols: so os icones listados em ICONES, no eixo que o site usa
 * (FILL 0, wght 400) — a fonte inteira passa de 3 MB. Usou icone novo no HTML?
 * Acrescente aqui e rode de novo; icone fora da lista aparece como texto.
 *
 * Licencas: Inter e Montserrat sao SIL Open Font License; Material Symbols e
 * Apache 2.0. As duas permitem hospedar os arquivos.
 */

import { mkdirSync, writeFileSync } from 'node:fs';

const ICONES = [
  'bolt', 'chat', 'check', 'compare_arrows', 'expand_more', 'forward_to_inbox', 'handshake',
  'lock', 'login', 'mail', 'neurology', 'picture_as_pdf', 'play_circle', 'trending_flat',
];

const FOLHAS = [
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@600;700;800&display=swap',
  // icon_names exige ordem alfabetica.
  `https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=${[...ICONES].sort().join(',')}&display=block`,
];

// Com user-agent de navegador moderno o Google devolve woff2.
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

mkdirSync('assets/fonts', { recursive: true });
mkdirSync('assets/css', { recursive: true });

let css = '/* Gerado por scripts/baixar-fontes.mjs — nao editar a mao. */\n';
let n = 0;
// Inter e Montserrat vem como fonte variavel: o Google aponta todos os pesos
// para o MESMO arquivo. Baixar uma vez por URL evita commitar copias iguais.
const baixados = new Map();
for (const url of FOLHAS) {
  const folha = await (await fetch(url, { headers: { 'User-Agent': UA } })).text();
  // Cada @font-face vem precedido de um comentario com o subset (latin,
  // latin-ext...); a folha do Material Symbols vem sem comentario.
  const blocos = folha.includes('/* ') ? folha.split('/* ').slice(1) : [`icones */\n${folha}`];
  for (const bloco of blocos) {
    const subset = bloco.slice(0, bloco.indexOf(' */'));
    // Cirilico, grego e vietnamita nao aparecem num site em portugues.
    if (!['latin', 'latin-ext', 'icones'].includes(subset)) continue;
    const familia = /font-family: '([^']+)'/.exec(bloco)[1];
    const fonte = /url\((https:[^)]+)\)/.exec(bloco)[1];
    let arquivo = baixados.get(fonte);
    if (!arquivo) {
      arquivo = `${familia.toLowerCase().replace(/\s+/g, '-')}-${subset}.woff2`;
      const bytes = Buffer.from(await (await fetch(fonte, { headers: { 'User-Agent': UA } })).arrayBuffer());
      writeFileSync(`assets/fonts/${arquivo}`, bytes);
      baixados.set(fonte, arquivo);
      n += 1;
      console.log(`${arquivo}  ${(bytes.length / 1024).toFixed(1)} KB`);
    }
    css += `/* ${subset} */\n${bloco.slice(bloco.indexOf('@font-face')).replace(fonte, `../fonts/${arquivo}`)}`;
  }
}
writeFileSync('assets/css/fontes.css', css);
console.log(`${n} arquivos; assets/css/fontes.css escrito`);
