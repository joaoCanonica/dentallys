#!/usr/bin/env node
// QA de cache e resiliência da abertura. Node puro + Playwright instalado FORA do repositório.
// Uso:
//   PLAYWRIGHT_CORE=/caminho/node_modules/playwright-core/index.mjs node scripts/qa-cache.mjs [--old=8f0cc52] [--preview=https://...vercel.app]
// Cenários: 1 visitante antigo (CSS/JS de um commit velho), 2 CSS bloqueado, 3 JS bloqueado,
// 4 cabeçalhos de cache no preview (se --preview), 5 abertura em contexto novo.
// Capturas em docs/qa/cache-*.png. Sai com código 1 se algum cenário falhar.
import http from 'node:http';
import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const arg = (k, d) => (process.argv.find((a) => a.startsWith(`--${k}=`)) || '').split('=').slice(1).join('=') || d;
const OLD = arg('old', '8f0cc52'), PREVIEW = arg('preview', '');
const PW = process.env.PLAYWRIGHT_CORE || 'playwright-core';
const { chromium } = await import(PW);
const EXE = process.env.CHROMIUM || (existsSync('/opt/pw-browsers/chromium-1194/chrome-linux/chrome') ? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' : undefined);
const OUT = join(ROOT, 'docs/qa'); mkdirSync(OUT, { recursive: true });

const oldFile = (p) => execFileSync('git', ['-C', ROOT, 'show', `${OLD}:${p}`]);
const OLDCSS = oldFile('css/site.css'), OLDJS = oldFile('js/site.js');
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain' };
let mode = 'atual';
const server = http.createServer((q, s) => {
  let p = decodeURIComponent(q.url.split('?')[0]);
  if (mode === 'antigo' && p === '/css/site.css') { s.writeHead(200, { 'content-type': TYPES['.css'] }); return s.end(OLDCSS); }
  if (mode === 'antigo' && p === '/js/site.js') { s.writeHead(200, { 'content-type': TYPES['.js'] }); return s.end(OLDJS); }
  if (p === '/') p = '/index.html'; else if (!extname(p)) p += '.html'; // emula cleanUrls
  const f = join(ROOT, p);
  if (!f.startsWith(ROOT) || !existsSync(f)) { s.writeHead(404, { 'content-type': TYPES['.html'] }); return s.end(readFileSync(join(ROOT, '404.html'))); }
  s.writeHead(200, { 'content-type': TYPES[extname(f)] || 'application/octet-stream' }); s.end(readFileSync(f));
}).listen(0);
const BASE = `http://localhost:${server.address().port}`;
const browser = await chromium.launch({ executablePath: EXE });
const fails = [], log = (ok, msg) => { console.log(`${ok ? '✓' : '✗'} ${msg}`); if (!ok) fails.push(msg); };

// Estado da página: SVG gigante, folha preta, abertura visível, conteúdo legível
const inspect = (p) => p.evaluate(() => {
  const intro = document.getElementById('intro');
  const iv = !!intro && getComputedStyle(intro).display !== 'none' && getComputedStyle(intro).visibility !== 'hidden' && +getComputedStyle(intro).opacity > 0 && intro.getBoundingClientRect().height > 0;
  // Folhas decorativas grandes são intencionais quando o CSS atual as posiciona (absolute, atrás do conteúdo)
  const big = [...document.querySelectorAll('svg')].filter((s) => { const r = s.getBoundingClientRect(); const lv = s.closest('.leaves');
    return r.width > 400 && r.height > 400 && !(lv && getComputedStyle(lv).position === 'absolute'); }).map((s) => s.getAttribute('class') || s.parentElement.className);
  const black = [...document.querySelectorAll('use[style*="--l"]')].filter((u) => getComputedStyle(u).fill === 'rgb(0, 0, 0)').length;
  const h1 = document.querySelector('h1'), r = h1 && h1.getBoundingClientRect();
  const img = document.querySelector('.hero-photo img'), clip = img ? getComputedStyle(img).clipPath : 'none';
  const photo = !img || (+getComputedStyle(img).opacity > .9 && !/100%/.test(clip));
  return { intro: iv, big, black, h1: !!r && r.height > 0 && getComputedStyle(h1).visibility !== 'hidden' && +getComputedStyle(h1).opacity > .9, photo };
});
const judge = async (p, name, w) => {
  await p.waitForTimeout(6000);
  const st = await inspect(p);
  await p.screenshot({ path: join(OUT, `cache-${name}-${w}.png`) });
  log(!st.intro && !st.big.length && !st.black && st.h1 && st.photo, `${name} ${w}px: abertura ${st.intro ? 'VISÍVEL' : 'oculta'} em 6 s, SVG > 400 px: ${st.big.length ? st.big.join(',') : 'nenhum'}, folhas pretas: ${st.black}, H1 visível: ${st.h1}, foto da hero visível: ${st.photo}`);
};
const VIEWS = [[1440, 900], [390, 844]];

// 1. Visitante antigo
mode = 'antigo';
for (const [w, h] of VIEWS) { const c = await browser.newContext({ viewport: { width: w, height: h } }); const p = await c.newPage(); await p.goto(BASE + '/'); await judge(p, 'visitante-antigo', w); await c.close(); }
mode = 'atual';
// 2. CSS bloqueado / 3. JS bloqueado
for (const [name, pat] of [['css-bloqueado', '**/css/**'], ['js-bloqueado', '**/js/**']]) {
  for (const [w, h] of VIEWS) { const c = await browser.newContext({ viewport: { width: w, height: h } }); await c.route(pat, (r) => r.abort()); const p = await c.newPage(); await p.goto(BASE + '/'); await judge(p, name, w); await c.close(); }
}
// 5. Contexto novo: abertura aparece, Pular abertura, Esc, ?sem-intro, uma vez por sessão
for (const [w, h] of VIEWS) {
  const c = await browser.newContext({ viewport: { width: w, height: h } }); let p = await c.newPage();
  await p.goto(BASE + '/'); await p.waitForTimeout(900); await p.screenshot({ path: join(OUT, `cache-abertura-${w}.png`) });
  const shown = (await inspect(p)).intro; log(shown, `abertura aparece em contexto novo (${w}px)`);
  await p.getByRole('button', { name: 'Pular abertura' }).click(); await p.waitForTimeout(700);
  log(!(await inspect(p)).intro && !(await p.evaluate(() => document.getElementById('conteudo').hasAttribute('inert'))), `"Pular abertura" fecha e remove inert (${w}px)`);
  await p.screenshot({ path: join(OUT, `cache-depois-de-pular-${w}.png`) });
  await p.goto(BASE + '/'); await p.waitForTimeout(400); log(!(await inspect(p)).intro, `não repete na mesma sessão (${w}px)`);
  await c.close();
}
{ const c = await browser.newContext(); const p = await c.newPage(); await p.goto(BASE + '/'); await p.waitForTimeout(500); await p.keyboard.press('Escape'); await p.waitForTimeout(700);
  log(!(await inspect(p)).intro, 'Esc fecha a abertura'); await c.close(); }
{ const c = await browser.newContext(); const p = await c.newPage(); await p.goto(BASE + '/?sem-intro'); await p.waitForTimeout(300);
  log(!(await inspect(p)).intro, '?sem-intro pula a abertura'); await c.close(); }

// 4. Cabeçalhos no preview
if (PREVIEW) {
  const html = await (await fetch(PREVIEW + '/')).text();
  const css = (html.match(/href="(\/css\/site\.css\?v=[^"]+)"/) || [])[1], js = (html.match(/src="(\/js\/site\.js\?v=[^"]+)"/) || [])[1];
  log(!!css && !!js, `HTML do preview com ?v= (${css}, ${js})`);
  for (const u of [css, js].filter(Boolean)) {
    const r = await fetch(PREVIEW + u, { method: 'HEAD' }); const cc = r.headers.get('cache-control') || '';
    log(r.ok && /max-age=0|no-cache/.test(cc), `${u}: ${r.status} cache-control: ${cc}`);
  }
} else console.log('· cenário 4 (cabeçalhos) pulado: passe --preview=https://... para testar no Vercel');

await browser.close(); server.close();
if (fails.length) { console.error(`\n${fails.length} falha(s).`); process.exit(1); }
console.log('\nTodos os cenários passaram.');
