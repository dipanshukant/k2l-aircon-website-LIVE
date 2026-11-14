import { loadTemplate, page, blogIndexMain } from '../../lib/render.js';
import { todaySG } from '../../lib/util.js';

export async function onRequestGet({ request, env }) {
  const { results } = await env.DB.prepare(
    "SELECT slug, title, summary, cover, cover_alt, published_at FROM posts WHERE status = 'published' AND published_at <= ? ORDER BY published_at DESC, id DESC"
  ).bind(todaySG()).all();

  const html = page(await loadTemplate(env, request), {
    title: 'Aircon Tips and Guides Singapore | K2L Cool Aircon',
    description: 'Aircon tips, servicing guides and honest advice from K2L Cool Aircon in Singapore. No jargon, just what you need to know about your AC.',
    path: '/blog',
    hreflang: true,
    breadcrumb: [['Home', '/'], ['Blog', '/blog']],
    main: blogIndexMain(results),
  });
  return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=60' } });
}
