import { getPrices, formatPrice } from '../lib/prices.js';

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // Send www.k2lcoolaircon.com to the bare domain with a permanent redirect,
  // keeping the path and query string, so search engines index one address.
  if (url.hostname === 'www.k2lcoolaircon.com') {
    url.hostname = 'k2lcoolaircon.com';
    return Response.redirect(url.toString(), 301);
  }

  // Internal files used by the blog functions are not public pages.
  if (/^\/(blog-template|sitemap-static)(\.html|\.xml)?$/.test(url.pathname)) {
    return new Response('Not found', { status: 404 });
  }

  const response = await context.next();

  if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/api/')) {
    const r = new Response(response.body, response);
    r.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return r;
  }

  // Fill in the prices saved in the CMS on every HTML page.
  if (!(response.headers.get('content-type') || '').includes('text/html')) return response;
  let prices;
  try { prices = await getPrices(env); } catch { return response; }
  return new HTMLRewriter()
    .on('[data-price]', {
      element(el) {
        const v = prices[el.getAttribute('data-price')];
        if (v != null) el.setInnerContent(formatPrice(v));
      },
    })
    .transform(response);
}
