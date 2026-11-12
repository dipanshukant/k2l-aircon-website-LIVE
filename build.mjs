// Copies the public site into dist/ for Cloudflare Pages.
// The blog list and posts are rendered by functions/, so blog.html ships as
// the internal template, and sitemap.xml becomes the static part of the sitemap.
// Usage: node build.mjs
import { cpSync, rmSync, mkdirSync, readdirSync, copyFileSync } from 'node:fs';

const OUT = 'dist';
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT + '/zh', { recursive: true });

for (const f of readdirSync('.').filter((f) => f.endsWith('.html'))) {
  copyFileSync(f, `${OUT}/${f === 'blog.html' ? 'blog-template.html' : f}`);
}
for (const f of readdirSync('zh').filter((f) => f.endsWith('.html'))) copyFileSync(`zh/${f}`, `${OUT}/zh/${f}`);
cpSync('assets', `${OUT}/assets`, { recursive: true });
cpSync('admin', `${OUT}/admin`, { recursive: true });
copyFileSync('robots.txt', `${OUT}/robots.txt`);
copyFileSync('sitemap.xml', `${OUT}/sitemap-static.xml`);

console.log('Built', OUT);
