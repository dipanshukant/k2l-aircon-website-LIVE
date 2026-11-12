// Send www.k2lcoolaircon.com to the bare domain with a permanent redirect,
// keeping the path and query string, so search engines index one address.
export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (url.hostname === 'www.k2lcoolaircon.com') {
    url.hostname = 'k2lcoolaircon.com';
    return Response.redirect(url.toString(), 301);
  }
  return context.next();
}
