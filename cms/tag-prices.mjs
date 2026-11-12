// Wraps every visible service price in the page bodies with
// <span data-price="key">, so the CMS can change prices site-wide.
// Safe to run again: already-tagged prices no longer match.
// Usage: node cms/tag-prices.mjs
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const PRICES = { '1,350': 'newunit', '700': 'secondhand', '120': 'chemical', '80': 'gas', '50': 'servicing', '40': 'repair' };
const re = /\$(1,350|700|120|80|50|40)(?!\d|,\d)/g;

const files = [
  ...readdirSync('.').filter((f) => f.endsWith('.html')),
  ...readdirSync('zh').filter((f) => f.endsWith('.html')).map((f) => join('zh', f)),
];

for (const file of files) {
  const src = readFileSync(file, 'utf8');
  const start = src.indexOf('<body');
  if (start < 0) continue;
  const head = src.slice(0, start);
  // Leave <script> blocks (JSON-LD, widgets) untouched.
  let count = 0;
  const body = src.slice(start).split(/(<script[\s\S]*?<\/script>)/).map((part) =>
    part.startsWith('<script') ? part : part.replace(re, (_, n) => { count++; return `$<span data-price="${PRICES[n]}">${n}</span>`; })
  ).join('');
  if (count) { writeFileSync(file, head + body); console.log(`${file}: ${count}`); }
}
