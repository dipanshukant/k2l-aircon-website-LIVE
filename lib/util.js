export const SITE = 'https://k2lcoolaircon.com';

export function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers },
  });
}

export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export function prettyDate(iso, lang = 'en') {
  const [y, m, d] = String(iso).split('-').map(Number);
  if (!(y && m && d)) return '';
  return lang === 'zh' ? `${y}年${m}月${d}日` : `${d} ${MONTHS[m - 1]} ${y}`;
}

// URL path of a blog post or the blog index in the given language.
export const blogPath = (lang, slug = '') => `${lang === 'zh' ? '/zh' : ''}/blog${slug ? '/' + slug : ''}`;

export function todaySG() {
  return new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 10);
}
