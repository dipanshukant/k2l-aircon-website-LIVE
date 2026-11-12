// Writes cms/gallery-seed.sql: loads the original 38 gallery photos
// (listed in cms/gallery.json, files in assets/img/gallery) into D1.
// Usage: node cms/gallery-seed.mjs
//        npx wrangler d1 execute k2lcoolaircon-cms --remote --file cms/gallery-seed.sql
import { readFileSync, writeFileSync } from 'node:fs';

function webpSize(file) {
  const b = readFileSync(file);
  const c = b.toString('ascii', 12, 16);
  if (c === 'VP8 ') return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
  if (c === 'VP8L') { const v = b.readUInt32LE(21); return [(v & 0x3fff) + 1, ((v >> 14) & 0x3fff) + 1]; }
  if (c === 'VP8X') return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)];
  throw new Error('not a webp: ' + file);
}
const q = (s) => `'${String(s).replace(/'/g, "''")}'`;

const g = JSON.parse(readFileSync('cms/gallery.json', 'utf8'));
let sql = "-- Loads the original gallery photos. Safe to re-run: replaces only these rows.\nDELETE FROM gallery_photos WHERE src LIKE '/assets/img/gallery/%';\n";
let n = 0;
for (const s of g.sections) {
  s.items.forEach(([, file, alt, caption], i) => {
    const [w, h] = webpSize(`assets/img/gallery/${file}`);
    sql += `INSERT INTO gallery_photos (section, src, width, height, alt, caption, sort) VALUES (${q(s.id)}, ${q('/assets/img/gallery/' + file)}, ${w}, ${h}, ${q(alt)}, ${q(caption)}, ${i});\n`;
    n++;
  });
}
writeFileSync('cms/gallery-seed.sql', sql);
console.log('cms/gallery-seed.sql:', n, 'photos');
