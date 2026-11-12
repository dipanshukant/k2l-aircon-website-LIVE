import { SITE, todaySG } from '../lib/util.js';

// Static pages come from sitemap-static.xml (the repo's sitemap.xml);
// published blog posts are added from the database.
export async function onRequestGet({ request, env }) {
  const res = await env.ASSETS.fetch(new URL('/sitemap-static.xml', request.url));
  let xml = await res.text();
  const { results } = await env.DB.prepare(
    "SELECT slug, updated_at FROM posts WHERE status = 'published' AND published_at <= ? ORDER BY published_at DESC"
  ).bind(todaySG()).all();
  const extra = results.map((p) => `  <url><loc>${SITE}/blog/${p.slug}</loc><lastmod>${p.updated_at.slice(0, 10)}</lastmod></url>`).join('\n');
  if (extra) xml = xml.replace('</urlset>', extra + '\n</urlset>');
  return new Response(xml, { headers: { 'content-type': 'application/xml; charset=utf-8', 'cache-control': 'public, max-age=300' } });
}
