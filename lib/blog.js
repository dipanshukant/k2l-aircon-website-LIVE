// Blog list and post handlers, shared by /blog (English) and /zh/blog (Chinese).
import { loadTemplate, page, blogIndexMain, renderPostPage } from './render.js';
import { SLUG_RE, todaySG, blogPath } from './util.js';
import { isAuthed } from './auth.js';

const INDEX_META = {
  en: {
    title: 'Aircon Tips and Guides Singapore | K2L Cool Aircon',
    description: 'Aircon tips, servicing guides and honest advice from K2L Cool Aircon in Singapore. No jargon, just what you need to know about your AC.',
    breadcrumb: [['Home', '/'], ['Blog', '/blog']],
  },
  zh: {
    title: '冷气技巧与指南 新加坡 | K2L Cool Aircon',
    description: 'K2L Cool Aircon的冷气技巧、保养指南和诚实建议。没有专业术语，只有您需要知道的冷气知识。',
    breadcrumb: [['首页', '/zh/'], ['博客', '/zh/blog']],
  },
};

export async function blogIndex({ request, env }, lang) {
  const { results } = await env.DB.prepare(
    "SELECT slug, title, summary, cover, cover_alt, published_at FROM posts WHERE lang = ? AND status = 'published' AND published_at <= ? ORDER BY published_at DESC, id DESC"
  ).bind(lang, todaySG()).all();

  const m = INDEX_META[lang];
  const html = page(await loadTemplate(env, request, lang), {
    title: m.title,
    description: m.description,
    path: blogPath(lang),
    hreflang: true,
    breadcrumb: m.breadcrumb,
    main: blogIndexMain(results, lang),
  });
  return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=60' } });
}

export async function blogPost({ request, env, params }, lang) {
  const slug = String(params.slug || '').toLowerCase();
  if (!SLUG_RE.test(slug)) return notFound(lang);

  const today = todaySG();
  const post = await env.DB.prepare('SELECT * FROM posts WHERE slug = ? AND lang = ?').bind(slug, lang).first();
  const live = post && post.status === 'published' && post.published_at <= today;
  // Logged-in admins can preview drafts and scheduled posts.
  const preview = post && !live && (await isAuthed(request, env));
  if (!live && !preview) return notFound(lang);

  // The same article in the other language, linked with hreflang when it is live.
  const twin = lang === 'zh'
    ? post.translation_of && await env.DB.prepare("SELECT slug, lang FROM posts WHERE slug = ? AND lang = 'en' AND status = 'published' AND published_at <= ?").bind(post.translation_of, today).first()
    : await env.DB.prepare("SELECT slug, lang FROM posts WHERE translation_of = ? AND lang = 'zh' AND status = 'published' AND published_at <= ? LIMIT 1").bind(slug, today).first();

  let html = renderPostPage(await loadTemplate(env, request, lang), post, twin || null);
  if (preview) {
    html = html
      .replace('<meta name="robots" content="index, follow">', '<meta name="robots" content="noindex">')
      .replace('<div class="desk">', '<div style="position:sticky;top:0;z-index:99;background:#C22B2B;color:#fff;font:700 15px/1.4 \'Courier Prime\',monospace;text-align:center;padding:8px">PREVIEW. Only you can see this. It is not published yet.</div><div class="desk">');
  }
  return new Response(html, {
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': preview ? 'no-store' : 'public, max-age=60' },
  });
}

function notFound(lang) {
  const msg = lang === 'zh'
    ? '找不到这篇指南。<a href="/zh/blog">查看所有指南</a>。'
    : 'This guide does not exist. <a href="/blog">See all guides</a>.';
  return new Response(`<!doctype html><meta charset="utf-8"><meta name="robots" content="noindex"><title>Not found</title><p style="font-family:monospace;padding:40px">${msg}</p>`, {
    status: 404,
    headers: { 'content-type': 'text/html; charset=utf-8' },
  });
}
