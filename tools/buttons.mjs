// Generates the profile's link buttons as SVGs (assets/buttons/*-dark.svg and *-light.svg), styled like the banner.
// Labels use the embedded JetBrains Mono, so each button's width is exact: 0.6 em per character.
// Run: node tools/buttons.mjs
import { mkdirSync, readFileSync, writeFileSync } from 'fs';

const read = (p) => readFileSync(new URL(p, import.meta.url)).toString('base64');
const fontFaces = `<style>
  @font-face { font-family: 'JBM'; font-weight: 500; src: url(data:font/woff2;base64,${read('./fonts/mono.woff2')}) format('woff2'); }
  @font-face { font-family: 'JBM'; font-weight: 700; src: url(data:font/woff2;base64,${read('./fonts/monobold.woff2')}) format('woff2'); }
</style>`;
const icon = (name) => `data:image/png;base64,${read(`./button-icons/${name}-64.png`)}`;

const themes = {
  dark: { surface: '#11141a', border: '#232833', outline: 'rgba(52,211,153,0.5)', ink: '#eef1f6', muted: '#8a93a6', accent: '#34d399', onAccent: '#06281c' },
  light: { surface: '#ffffff', border: '#d0d7de', outline: 'rgba(15,157,110,0.55)', ink: '#0f172a', muted: '#57606a', accent: '#0f9d6e', onAccent: '#06281c' },
};
const mono = (chars, size) => chars * size * 0.6;
const esc = (s) => s.replace(/&/g, '&amp;');

// Simple line icons drawn on a 24-unit grid.
const glyph = {
  download: 'M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19h14',
  mail: 'M4 6.5h16v11H4zM4.5 7l7.5 6 7.5-6',
};

function action({ label, glyphName, primary }, t) {
  const size = 15, h = 44, padX = 16, iconW = 20, gap = 10;
  const w = Math.ceil(padX + iconW + gap + mono(label.length, size) + padX);
  const fill = primary ? t.accent === '#0f9d6e' ? '#34d399' : t.accent : t.surface;
  const stroke = primary ? 'none' : t.outline;
  const fg = primary ? t.onAccent : t.ink;
  const ic = primary ? t.onAccent : t.accent;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}">${fontFaces}
  <rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" rx="11" fill="${fill}" stroke="${stroke}"/>
  <g transform="translate(${padX - 2} ${(h - 24) / 2})" fill="none" stroke="${ic}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${glyph[glyphName]}"/></g>
  <text x="${padX + iconW + gap}" y="${h / 2 + 5.5}" font-family="JBM" font-weight="700" font-size="${size}" fill="${fg}">${esc(label)}</text>
</svg>`;
}

function project({ name, tagline, img }, t) {
  const h = 54, pad = 12, iconSize = 30, gap = 12, nameSize = 15, tagSize = 12;
  const textW = Math.max(mono(name.length, nameSize), mono(tagline.length, tagSize));
  const w = Math.ceil(pad + iconSize + gap + textW + 18);
  const x = pad + iconSize + gap;
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(`${name}: ${tagline}`)}">${fontFaces}
  <rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" rx="13" fill="${t.surface}" stroke="${t.border}"/>
  <image x="${pad}" y="${(h - iconSize) / 2}" width="${iconSize}" height="${iconSize}" href="${img}" xlink:href="${img}"/>
  <text x="${x}" y="24" font-family="JBM" font-weight="700" font-size="${nameSize}" fill="${t.ink}">${esc(name)}</text>
  <text x="${x}" y="41" font-family="JBM" font-weight="500" font-size="${tagSize}" fill="${t.muted}">${esc(tagline)}</text>
</svg>`;
}

const buttons = {
  cv: (t) => action({ label: 'Download CV', glyphName: 'download', primary: true }, t),
  email: (t) => action({ label: 'Email me', glyphName: 'mail', primary: false }, t),
  mirsad: (t) => project({ name: 'Mirsad', tagline: 'AI data assistant', img: icon('mirsad') }, t),
  dawsha: (t) => project({ name: 'Dawsha', tagline: 'AI agents, one window', img: icon('dawsha') }, t),
  nadfny: (t) => project({ name: 'Nadfny', tagline: 'Disk cleaner for devs', img: icon('nadfny') }, t),
};

const outDir = new URL('../assets/buttons/', import.meta.url);
mkdirSync(outDir, { recursive: true });
for (const [name, make] of Object.entries(buttons)) {
  for (const [mode, t] of Object.entries(themes)) writeFileSync(new URL(`${name}-${mode}.svg`, outDir), make(t));
}
console.log('wrote', Object.keys(buttons).length * 2, 'buttons to assets/buttons/');
