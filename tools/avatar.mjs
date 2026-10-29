// Generates the profile picture (assets/avatar.svg). Same palette and embedded fonts as the banner.
// GitHub crops avatars to a circle, so every design keeps its content inside the central circle.
import { readFileSync, writeFileSync } from 'fs';

const font = (file) => 'data:font/woff2;base64,' + readFileSync(new URL('./fonts/' + file, import.meta.url)).toString('base64');
const S = 512;
const BG = '#0c0e12', MINT = '#34d399', INK = '#eef1f6', DEEP = '#06281c';
const style = `<style>
  @font-face { font-family: 'BG'; font-weight: 800; src: url(${font('display.woff2')}) format('woff2'); }
  @font-face { font-family: 'JBM'; font-weight: 700; src: url(${font('monobold.woff2')}) format('woff2'); }
</style>`;
const sparkle = (x, y, s, fill, op = 1) =>
  `<path transform="translate(${x} ${y}) scale(${s})" opacity="${op}" fill="${fill}" d="M0-10C1.4-3.6 3.6-1.4 10 0 3.6 1.4 1.4 3.6 0 10-1.4 3.6-3.6 1.4-10 0-3.6-1.4-1.4-3.6 0-10Z"/>`;
const grid = `<pattern id="g" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="rgba(255,255,255,0.05)"/></pattern>
  <radialGradient id="fade" cx="0.5" cy="0.5" r="0.5"><stop offset="0.2" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
  <mask id="m"><rect width="${S}" height="${S}" fill="url(#fade)"/></mask>
  <radialGradient id="glow" cx="0.7" cy="0.28" r="0.6"><stop offset="0" stop-color="${MINT}" stop-opacity="0.28"/><stop offset="1" stop-color="${MINT}" stop-opacity="0"/></radialGradient>`;

const variants = {
  // A: monogram with a terminal caret, orbit ring and sparkle, straight from the banner.
  orbit: `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
  <defs>${style}${grid}</defs>
  <rect width="${S}" height="${S}" fill="${BG}"/>
  <rect width="${S}" height="${S}" fill="url(#g)" mask="url(#m)"/>
  <rect width="${S}" height="${S}" fill="url(#glow)"/>
  <circle cx="256" cy="256" r="168" fill="none" stroke="${MINT}" stroke-opacity=".35" stroke-width="3"/>
  <circle cx="256" cy="256" r="206" fill="none" stroke="${MINT}" stroke-opacity=".14" stroke-width="2"/>
  <circle cx="375" cy="137" r="13" fill="${MINT}"/>
  ${sparkle(150, 150, 2.2, MINT)}
  ${sparkle(372, 372, 1.2, MINT, .7)}
  <text x="236" y="300" text-anchor="middle" font-family="BG" font-weight="800" font-size="150" letter-spacing="-4" fill="${INK}">MF</text>
  <rect x="352" y="292" width="40" height="12" rx="3" fill="${MINT}"/>
</svg>`,

  // B: solid mint disc with deep-green monogram, the bold Dawsha/Nadfny icon look.
  mint: `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
  <defs>${style}${grid}</defs>
  <rect width="${S}" height="${S}" fill="${BG}"/>
  <rect width="${S}" height="${S}" fill="url(#g)" mask="url(#m)"/>
  <circle cx="256" cy="256" r="170" fill="${MINT}"/>
  <circle cx="256" cy="256" r="196" fill="none" stroke="${MINT}" stroke-opacity=".3" stroke-width="4"/>
  ${sparkle(392, 118, 2.4, MINT)}
  ${sparkle(118, 392, 1.3, MINT, .6)}
  <text x="256" y="304" text-anchor="middle" font-family="BG" font-weight="800" font-size="148" letter-spacing="-4" fill="${DEEP}">MF</text>
</svg>`,

  // C: terminal prompt "> mf_", the developer-console angle of the banner.
  prompt: `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
  <defs>${style}${grid}</defs>
  <rect width="${S}" height="${S}" fill="${BG}"/>
  <rect width="${S}" height="${S}" fill="url(#g)" mask="url(#m)"/>
  <rect width="${S}" height="${S}" fill="url(#glow)"/>
  <rect x="96" y="146" width="320" height="220" rx="34" fill="#11141a" stroke="${MINT}" stroke-opacity=".45" stroke-width="3"/>
  <circle cx="134" cy="182" r="8" fill="${MINT}" opacity=".9"/><circle cx="160" cy="182" r="8" fill="${MINT}" opacity=".5"/><circle cx="186" cy="182" r="8" fill="${MINT}" opacity=".25"/>
  <text x="128" y="306" font-family="JBM" font-weight="700" font-size="84" fill="${MINT}">&gt;</text>
  <text x="196" y="306" font-family="JBM" font-weight="700" font-size="84" fill="${INK}">mf</text>
  <rect x="318" y="290" width="44" height="12" rx="3" fill="${MINT}"/>
  ${sparkle(400, 112, 2, MINT)}
</svg>`,
};

// The chosen design is 'mint'; the others stay here for reference. Export avatar.png at 1024 px from this SVG.
writeFileSync(new URL('../assets/avatar.svg', import.meta.url), variants.mint);
console.log('wrote assets/avatar.svg');
