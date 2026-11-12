// Password login with an HMAC-signed session cookie.
// Secrets (set with `wrangler pages secret put`): ADMIN_PASSWORD, SESSION_SECRET.

const COOKIE = 'k2l_admin';
const SESSION_SECONDS = 7 * 24 * 3600;
const MAX_FAILS = 8;
const LOCK_SECONDS = 15 * 60;
const enc = new TextEncoder();

async function hmac(secret, data) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Compare via HMAC digests so timing does not leak the password.
async function safeEqual(a, b, secret) {
  const [x, y] = await Promise.all([hmac(secret, 'cmp:' + a), hmac(secret, 'cmp:' + b)]);
  return x === y;
}

function readCookie(request, name) {
  const m = (request.headers.get('cookie') || '').match(new RegExp('(?:^|;\\s*)' + name + '=([^;]+)'));
  return m ? m[1] : null;
}

export function configured(env) {
  return Boolean(env.ADMIN_PASSWORD && env.SESSION_SECRET && env.SESSION_SECRET.length >= 32);
}

export async function isAuthed(request, env) {
  if (!configured(env)) return false;
  const raw = readCookie(request, COOKIE);
  if (!raw) return false;
  const [exp, sig] = raw.split('.');
  if (!exp || !sig || Number(exp) < Date.now() / 1000) return false;
  return sig === (await hmac(env.SESSION_SECRET, 'session:' + exp));
}

export async function login(request, env, password) {
  const ip = request.headers.get('cf-connecting-ip') || 'local';
  const failKey = 'fail:' + ip;
  const fails = Number((await env.KV.get(failKey)) || 0);
  if (fails >= MAX_FAILS) return { ok: false, status: 429, error: 'Too many wrong tries. Wait 15 minutes and try again.' };

  if (!(await safeEqual(String(password || ''), env.ADMIN_PASSWORD, env.SESSION_SECRET))) {
    await env.KV.put(failKey, String(fails + 1), { expirationTtl: LOCK_SECONDS });
    return { ok: false, status: 401, error: 'Wrong password.' };
  }
  await env.KV.delete(failKey);
  const exp = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const value = `${exp}.${await hmac(env.SESSION_SECRET, 'session:' + exp)}`;
  return { ok: true, cookie: sessionCookie(request, value, SESSION_SECONDS) };
}

export function logoutCookie(request) {
  return sessionCookie(request, '', 0);
}

function sessionCookie(request, value, maxAge) {
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
  return `${COOKIE}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure}`;
}
