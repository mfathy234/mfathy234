// Generates assets/banner-dark.svg and assets/banner-light.svg: an animated header for the GitHub profile.
// Pure SVG + SMIL (GitHub renders it as an <img>, so no scripts or external fonts). Fonts are embedded as
// subset woff2 data URIs from tools/fonts (Bricolage Grotesque, JetBrains Mono, Figtree; SIL OFL). Run: node tools/banner.mjs
import { readFileSync, writeFileSync } from 'fs';

const font = (file) => 'data:font/woff2;base64,' + readFileSync(new URL('./fonts/' + file, import.meta.url)).toString('base64');
const FONTS = `
      @font-face { font-family: 'BG'; font-weight: 800; src: url(${font('display.woff2')}) format('woff2'); }
      @font-face { font-family: 'JBM'; font-weight: 500; src: url(${font('mono.woff2')}) format('woff2'); }
      @font-face { font-family: 'JBM'; font-weight: 700; src: url(${font('monobold.woff2')}) format('woff2'); }
      @font-face { font-family: 'FT'; font-weight: 500; src: url(${font('body.woff2')}) format('woff2'); }`;

const W = 1200, H = 300;
const phrases = ['.NET Tech Lead', 'Software architect', 'Multi-tenant SaaS · Microservices'];
const SLOT = 4;                 // seconds per phrase
const TOTAL = SLOT * phrases.length;
const TYPE = 1.5, HOLD_END = 3.5; // typing finishes at 1.5 s, text clears at 3.5 s within each slot
const CHAR = 15.6;              // per-character width; textLength pins it so every OS font lines up with the caret
const X = 102, Y = 205;         // where the typed text starts

const themes = {
  dark: { bg: '#0c0e12', grid: 'rgba(255,255,255,0.045)', name: '#eef1f6', muted: '#8a93a6', accent: '#34d399', glow: '52,211,153', prompt: '#34d399' },
  light: { bg: '#f6f8fa', grid: 'rgba(15,23,42,0.06)', name: '#0f172a', muted: '#57606a', accent: '#0f9d6e', glow: '15,157,110', prompt: '#0f9d6e' },
};

const kt = (...t) => t.map((s) => (s / TOTAL).toFixed(4)).join(';');

function phraseLayer(text, i, t) {
  const w = (text.length * CHAR).toFixed(1);
  const s = i * SLOT;
  // keyTimes are clamped into [0, 1]; the first slot starts at 0 so its leading pair collapses safely.
  const times = i === 0 ? kt(0, TYPE, HOLD_END, HOLD_END + 0.05, TOTAL) : kt(0, s, s + TYPE, s + HOLD_END, s + HOLD_END + 0.05, TOTAL);
  const vals = i === 0 ? `0;${w};${w};0;0` : `0;0;${w};${w};0;0`;
  const caretX = i === 0 ? `${X};${X + +w};${X + +w};${X};${X}` : `${X};${X};${X + +w};${X + +w};${X};${X}`;
  const on = i === 0 ? `1;1;1;0;0` : `0;1;1;1;0;0`;
  return `
  <clipPath id="clip${i}"><rect x="${X}" y="${Y - 30}" height="40" width="0">
    <animate attributeName="width" dur="${TOTAL}s" repeatCount="indefinite" keyTimes="${times}" values="${vals}" calcMode="linear"/>
  </rect></clipPath>
  <g clip-path="url(#clip${i})"><text x="${X}" y="${Y}" class="type" textLength="${w}" lengthAdjust="spacingAndGlyphs">${text.replace(/&/g, '&amp;')}</text></g>
  <rect y="${Y - 24}" width="3" height="30" rx="1.5" fill="${t.accent}" opacity="0">
    <animate attributeName="x" dur="${TOTAL}s" repeatCount="indefinite" keyTimes="${times}" values="${caretX}"/>
    <animate attributeName="opacity" dur="${TOTAL}s" repeatCount="indefinite" keyTimes="${times}" values="${on}" calcMode="discrete"/>
  </rect>`;
}

function sparkle(x, y, size, delay, t) {
  const s = size;
  return `<path transform="translate(${x} ${y}) scale(${s})" d="M0-10C1.4-3.6 3.6-1.4 10 0 3.6 1.4 1.4 3.6 0 10-1.4 3.6-3.6 1.4-10 0-3.6-1.4-1.4-3.6 0-10Z" fill="${t.accent}">
    <animate attributeName="opacity" values="0.25;1;0.25" dur="3.2s" begin="${delay}s" repeatCount="indefinite"/>
  </path>`;
}

function banner(t) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Mohamed Fathy: .NET Tech Lead and software architect for multi-tenant SaaS and microservices">
  <defs>
    <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="${t.grid}" stroke-width="1"/></pattern>
    <radialGradient id="glow" cx="0.82" cy="0.35" r="0.55"><stop offset="0" stop-color="rgb(${t.glow})" stop-opacity="0.22"/><stop offset="1" stop-color="rgb(${t.glow})" stop-opacity="0"/></radialGradient>
    <linearGradient id="fade" x1="0" x2="1"><stop offset="0.35" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity="1"/></linearGradient>
    <mask id="gridMask"><rect width="${W}" height="${H}" fill="url(#fade)"/></mask>
    <style>${FONTS}
      .name { font: 800 66px BG, "Segoe UI", sans-serif; fill: ${t.name}; letter-spacing: -0.4px; }
      .handle { font: 700 17px JBM, Consolas, monospace; fill: ${t.accent}; letter-spacing: 2px; }
      .type { font: 500 26px JBM, Consolas, monospace; fill: ${t.name}; }
      .prompt { font: 700 26px JBM, Consolas, monospace; fill: ${t.prompt}; }
      .meta { font: 500 17px FT, "Segoe UI", sans-serif; fill: ${t.muted}; }
    </style>
  </defs>
  <rect width="${W}" height="${H}" rx="18" fill="${t.bg}"/>
  <rect width="${W}" height="${H}" rx="18" fill="url(#grid)" mask="url(#gridMask)"/>
  <rect width="${W}" height="${H}" rx="18" fill="url(#glow)"/>
  <g opacity="0.55" fill="none" stroke="rgb(${t.glow})" stroke-opacity="0.35">
    <circle cx="1010" cy="110" r="150"/><circle cx="1010" cy="110" r="215" stroke-opacity="0.2"/><circle cx="1010" cy="110" r="285" stroke-opacity="0.1"/>
  </g>
  <circle r="7" fill="${t.accent}">
    <animateMotion dur="14s" repeatCount="indefinite" path="M1010,-40 A150,150 0 1,1 1009.9,-40"/>
  </circle>
  ${sparkle(1120, 62, 1.9, 0, t)}
  ${sparkle(905, 205, 1.1, 1.1, t)}
  ${sparkle(1150, 230, 0.8, 2.2, t)}

  <text x="72" y="72" class="handle">@MFATHY234</text>
  <text x="70" y="140" class="name">Mohamed Fathy</text>
  <text x="72" y="${Y}" class="prompt">&gt;</text>
  ${phrases.map((p, i) => phraseLayer(p, i, t)).join('')}
  <text x="72" y="258" class="meta">Cairo, Egypt  ·  9+ years in .NET  ·  Clean Architecture  ·  DDD  ·  CQRS  ·  Open to remote</text>
</svg>
`;
}

writeFileSync(new URL('../assets/banner-dark.svg', import.meta.url), banner(themes.dark));
writeFileSync(new URL('../assets/banner-light.svg', import.meta.url), banner(themes.light));
console.log('wrote assets/banner-dark.svg and assets/banner-light.svg');
