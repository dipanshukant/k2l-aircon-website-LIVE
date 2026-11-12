import { SITE, todaySG } from '../lib/util.js';

// Static pages come from sitemap-static.xml (the repo's sitemap.xml);
// published blog posts and gallery images are added from the database.
export async function onRequestGet({ request, env }) {
  const res = await env.ASSETS.fetch(new URL('/sitemap-static.xml', request.url));
  let xml = await res.text();

  const [posts, photos] = await Promise.all([
    env.DB.prepare("SELECT slug, updated_at FROM posts WHERE status = 'published' AND published_at <= ? ORDER BY published_at DESC").bind(todaySG()).all(),
    env.DB.prepare('SELECT src FROM gallery_photos ORDER BY section, sort, id').all(),
  ]);

  if (photos.results.length) {
    if (!xml.includes('xmlns:image')) {
      xml = xml.replace('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">');
    }
    const imgs = photos.results.map((p) => `    <image:image><image:loc>${SITE}${p.src}</image:loc></image:image>`).join('\n');
    xml = xml.replace(`<url><loc>${SITE}/gallery</loc></url>`, `<url><loc>${SITE}/gallery</loc>\n${imgs}\n  </url>`);
  }

  const extra = posts.results.map((p) => `  <url><loc>${SITE}/blog/${p.slug}</loc><lastmod>${p.updated_at.slice(0, 10)}</lastmod></url>`).join('\n');
  if (extra) xml = xml.replace('</urlset>', extra + '\n</urlset>');
  return new Response(xml, { headers: { 'content-type': 'application/xml; charset=utf-8', 'cache-control': 'public, max-age=300' } });
}
