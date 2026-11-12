import { loadTemplate, renderPostPage } from '../../lib/render.js';
import { SLUG_RE, todaySG } from '../../lib/util.js';
import { isAuthed } from '../../lib/auth.js';

export async function onRequestGet({ request, env, params }) {
  const slug = String(params.slug || '').toLowerCase();
  if (!SLUG_RE.test(slug)) return context404();

  const post = await env.DB.prepare('SELECT * FROM posts WHERE slug = ?').bind(slug).first();
  const live = post && post.status === 'published' && post.published_at <= todaySG();
  // Logged-in admins can preview drafts and scheduled posts.
  const preview = post && !live && (await isAuthed(request, env));
  if (!live && !preview) return context404();

  let html = renderPostPage(await loadTemplate(env, request), post);
  if (preview) {
    html = html
      .replace('<meta name="robots" content="index, follow">', '<meta name="robots" content="noindex">')
      .replace('<div class="desk">', '<div style="position:sticky;top:0;z-index:99;background:#C22B2B;color:#fff;font:700 15px/1.4 \'Courier Prime\',monospace;text-align:center;padding:8px">PREVIEW. Only you can see this. It is not published yet.</div><div class="desk">');
  }
  return new Response(html, {
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': preview ? 'no-store' : 'public, max-age=60' },
  });
}

function context404() {
  return new Response('<!doctype html><meta charset="utf-8"><title>Not found</title><p style="font-family:monospace;padding:40px">This guide does not exist. <a href="/blog">See all guides</a>.</p>', {
    status: 404,
    headers: { 'content-type': 'text/html; charset=utf-8' },
  });
}
