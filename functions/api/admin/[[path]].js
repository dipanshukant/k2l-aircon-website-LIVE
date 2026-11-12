import { json, SLUG_RE, DATE_RE, todaySG } from '../../../lib/util.js';
import { isAuthed, login, logoutCookie, configured } from '../../../lib/auth.js';
import { getPrices, savePrices, PRICE_FIELDS } from '../../../lib/prices.js';
import { postMain } from '../../../lib/render.js';
import { SECTIONS, SECTION_IDS } from '../../../lib/gallery.js';

const MAX_IMAGE = 5 * 1024 * 1024;

export async function onRequest({ request, env, params }) {
  const parts = Array.isArray(params.path) ? params.path : params.path ? [params.path] : [];
  const route = parts.join('/');
  const method = request.method;

  // Writes must come from the admin page itself (custom header blocks cross-site forms).
  if (method !== 'GET' && request.headers.get('x-k2l-admin') !== '1') return json({ error: 'Bad request' }, 400);

  try {
    if (route === 'me' && method === 'GET') {
      return json({ authed: await isAuthed(request, env), configured: configured(env) });
    }
    if (route === 'login' && method === 'POST') {
      if (!configured(env)) return json({ error: 'Admin password is not set up yet.' }, 503);
      const { password } = await request.json().catch(() => ({}));
      const r = await login(request, env, password);
      if (!r.ok) return json({ error: r.error }, r.status);
      return json({ ok: true }, 200, { 'set-cookie': r.cookie });
    }
    if (route === 'logout' && method === 'POST') {
      return json({ ok: true }, 200, { 'set-cookie': logoutCookie(request) });
    }

    if (!(await isAuthed(request, env))) return json({ error: 'Please log in again.' }, 401);

    if (route === 'posts' && method === 'GET') {
      const { results } = await env.DB.prepare(
        'SELECT id, slug, title, status, published_at, updated_at FROM posts ORDER BY published_at DESC, id DESC'
      ).all();
      return json({ posts: results, today: todaySG() });
    }
    if (route === 'posts' && method === 'POST') {
      const p = validatePost(await request.json());
      await assertSlugFree(env, p.slug);
      const row = await env.DB.prepare(
        `INSERT INTO posts (slug, title, summary, note, body, cover, cover_alt, status, published_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`
      ).bind(p.slug, p.title, p.summary, p.note, p.body, p.cover, p.cover_alt, p.status, p.published_at).first();
      return json({ post: row }, 201);
    }

    const m = route.match(/^posts\/(\d+)$/);
    if (m) {
      const id = Number(m[1]);
      if (method === 'GET') {
        const post = await env.DB.prepare('SELECT * FROM posts WHERE id = ?').bind(id).first();
        return post ? json({ post }) : json({ error: 'Post not found.' }, 404);
      }
      if (method === 'PUT') {
        const p = validatePost(await request.json());
        await assertSlugFree(env, p.slug, id);
        const row = await env.DB.prepare(
          `UPDATE posts SET slug = ?, title = ?, summary = ?, note = ?, body = ?, cover = ?, cover_alt = ?,
           status = ?, published_at = ?, updated_at = datetime('now') WHERE id = ? RETURNING *`
        ).bind(p.slug, p.title, p.summary, p.note, p.body, p.cover, p.cover_alt, p.status, p.published_at, id).first();
        return row ? json({ post: row }) : json({ error: 'Post not found.' }, 404);
      }
      if (method === 'DELETE') {
        await env.DB.prepare('DELETE FROM posts WHERE id = ?').bind(id).run();
        return json({ ok: true });
      }
    }

    if (route === 'preview' && method === 'POST') {
      const b = await request.json();
      const post = {
        title: String(b.title || 'Untitled'), summary: String(b.summary || ''), note: String(b.note || ''),
        body: String(b.body || ''), cover: safeImage(b.cover), cover_alt: String(b.cover_alt || ''),
        published_at: DATE_RE.test(b.published_at) ? b.published_at : todaySG(),
      };
      return json({ html: postMain(post) });
    }

    if (route === 'upload' && method === 'POST') {
      const buf = await request.arrayBuffer();
      if (!buf.byteLength) return json({ error: 'No file received.' }, 400);
      if (buf.byteLength > MAX_IMAGE) return json({ error: 'Photo is too big (max 5 MB).' }, 413);
      const type = sniffImage(new Uint8Array(buf.slice(0, 12)));
      if (!type) return json({ error: 'Only JPG, PNG or WebP photos can be uploaded.' }, 415);
      const ext = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }[type];
      const id = [...crypto.getRandomValues(new Uint8Array(8))].map((b) => b.toString(16).padStart(2, '0')).join('');
      const name = `${todaySG()}-${id}.${ext}`;
      await env.KV.put('img:' + name, buf, { metadata: { type } });
      return json({ url: '/img/' + name });
    }

    if (route === 'prices' && method === 'GET') {
      return json({ prices: await getPrices(env, { fresh: true }), fields: PRICE_FIELDS });
    }
    if (route === 'prices' && method === 'PUT') {
      return json({ prices: await savePrices(env, await request.json()) });
    }

    // ----- gallery -----
    if (route === 'gallery' && method === 'GET') {
      const { results } = await env.DB.prepare('SELECT * FROM gallery_photos ORDER BY section, sort, id').all();
      return json({ photos: results, sections: SECTIONS.map(({ id, title }) => ({ id, title })) });
    }
    if (route === 'gallery' && method === 'POST') {
      const b = await request.json();
      const p = validatePhoto(b);
      const src = String(b.src || '');
      if (!/^\/img\/[a-z0-9-]+\.(jpg|png|webp)$/.test(src)) throw new UserError('Upload the photo first.');
      const w = Math.round(Number(b.width)), h = Math.round(Number(b.height));
      if (!(w > 0 && h > 0 && w <= 10000 && h <= 10000)) throw new UserError('Photo size is missing.');
      // New photos go to the top of their section.
      const top = await env.DB.prepare('SELECT MIN(sort) m FROM gallery_photos WHERE section = ?').bind(p.section).first();
      const row = await env.DB.prepare(
        'INSERT INTO gallery_photos (section, src, width, height, alt, caption, sort) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING *'
      ).bind(p.section, src, w, h, p.alt, p.caption, (top?.m ?? 1) - 1).first();
      return json({ photo: row }, 201);
    }
    const g = route.match(/^gallery\/(\d+)(\/move)?$/);
    if (g) {
      const id = Number(g[1]);
      const photo = await env.DB.prepare('SELECT * FROM gallery_photos WHERE id = ?').bind(id).first();
      if (!photo) return json({ error: 'Photo not found.' }, 404);
      if (g[2] && method === 'POST') {
        const { dir } = await request.json();
        const up = Number(dir) < 0;
        const other = await env.DB.prepare(
          up ? 'SELECT * FROM gallery_photos WHERE section = ? AND (sort < ? OR (sort = ? AND id < ?)) ORDER BY sort DESC, id DESC LIMIT 1'
             : 'SELECT * FROM gallery_photos WHERE section = ? AND (sort > ? OR (sort = ? AND id > ?)) ORDER BY sort ASC, id ASC LIMIT 1'
        ).bind(photo.section, photo.sort, photo.sort, photo.id).first();
        if (other) {
          // Swap positions; if both share a sort value, nudge apart.
          const a = other.sort === photo.sort ? (up ? photo.sort - 1 : photo.sort + 1) : other.sort;
          await env.DB.batch([
            env.DB.prepare('UPDATE gallery_photos SET sort = ? WHERE id = ?').bind(a, photo.id),
            env.DB.prepare('UPDATE gallery_photos SET sort = ? WHERE id = ?').bind(photo.sort, other.id),
          ]);
        }
        return json({ ok: true });
      }
      if (!g[2] && method === 'PUT') {
        const p = validatePhoto(await request.json());
        const row = await env.DB.prepare('UPDATE gallery_photos SET section = ?, alt = ?, caption = ? WHERE id = ? RETURNING *')
          .bind(p.section, p.alt, p.caption, id).first();
        return json({ photo: row });
      }
      if (!g[2] && method === 'DELETE') {
        await env.DB.prepare('DELETE FROM gallery_photos WHERE id = ?').bind(id).run();
        // Remove the uploaded file too, unless a blog post still uses it.
        if (photo.src.startsWith('/img/')) {
          const used = await env.DB.prepare('SELECT 1 FROM posts WHERE cover = ? OR instr(body, ?) > 0 LIMIT 1').bind(photo.src, photo.src).first();
          if (!used) await env.KV.delete('img:' + photo.src.slice(5));
        }
        return json({ ok: true });
      }
    }

    return json({ error: 'Not found' }, 404);
  } catch (err) {
    if (err instanceof UserError) return json({ error: err.message }, 400);
    if (err instanceof Error && /must be a number/.test(err.message)) return json({ error: err.message }, 400);
    console.error(err);
    return json({ error: 'Something went wrong. Please try again.' }, 500);
  }
}

class UserError extends Error {}

function safeImage(v) {
  const s = String(v || '').trim();
  return /^\/(img|assets)\/[\w./-]+$/.test(s) ? s : '';
}

function validatePost(b) {
  const str = (v, max, label) => {
    const s = String(v ?? '').trim();
    if (s.length > max) throw new UserError(`${label} is too long (max ${max} characters).`);
    return s;
  };
  const p = {
    title: str(b.title, 150, 'Title'),
    slug: str(b.slug, 100, 'Web address').toLowerCase(),
    summary: str(b.summary, 300, 'Summary'),
    note: str(b.note, 80, 'Handwritten note'),
    body: str(b.body, 100000, 'Article text'),
    cover: safeImage(b.cover),
    cover_alt: str(b.cover_alt, 200, 'Photo description'),
    status: b.status === 'published' ? 'published' : 'draft',
    published_at: String(b.published_at || todaySG()),
  };
  if (!p.title) throw new UserError('Please add a title.');
  if (!SLUG_RE.test(p.slug)) throw new UserError('Web address can only use small letters, numbers and dashes, e.g. how-to-clean-aircon.');
  if (!DATE_RE.test(p.published_at)) throw new UserError('Date must look like 2026-11-12.');
  if (p.status === 'published' && !p.body) throw new UserError('Add some article text before publishing.');
  return p;
}

function validatePhoto(b) {
  const section = String(b.section || '');
  if (!SECTION_IDS.includes(section)) throw new UserError('Pick a gallery section.');
  const alt = String(b.alt ?? '').trim();
  const caption = String(b.caption ?? '').trim();
  if (alt.length < 10) throw new UserError('Describe the photo in a short sentence (helps Google find it).');
  if (alt.length > 200) throw new UserError('Photo description is too long (max 200 characters).');
  if (caption.length > 60) throw new UserError('Caption is too long (max 60 characters).');
  return { section, alt, caption };
}

async function assertSlugFree(env, slug, exceptId = 0) {
  const row = await env.DB.prepare('SELECT id FROM posts WHERE slug = ? AND id != ?').bind(slug, exceptId).first();
  if (row) throw new UserError('Another post already uses this web address. Change it a little.');
}

function sniffImage(b) {
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'image/jpeg';
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return 'image/png';
  if (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return 'image/webp';
  return null;
}
