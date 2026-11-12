// Serves photos uploaded through the CMS.
export async function onRequestGet({ env, params }) {
  const name = String(params.name || '');
  if (!/^[a-z0-9-]+\.(jpg|png|webp)$/.test(name)) return new Response('Not found', { status: 404 });
  const { value, metadata } = await env.KV.getWithMetadata('img:' + name, { type: 'arrayBuffer', cacheTtl: 3600 });
  if (!value) return new Response('Not found', { status: 404 });
  return new Response(value, {
    headers: {
      'content-type': metadata?.type || 'image/jpeg',
      'cache-control': 'public, max-age=31536000, immutable',
    },
  });
}
