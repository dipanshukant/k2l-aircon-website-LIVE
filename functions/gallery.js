import { loadTemplate, page } from '../lib/render.js';
import { listPhotos, galleryMain, galleryLd, GALLERY_TITLE, GALLERY_DESC } from '../lib/gallery.js';
import { SITE } from '../lib/util.js';

export async function onRequestGet({ request, env }) {
  const photos = await listPhotos(env);
  const html = page(await loadTemplate(env, request), {
    title: GALLERY_TITLE,
    description: GALLERY_DESC,
    path: '/gallery',
    image: photos[0] ? SITE + photos[0].src : undefined,
    breadcrumb: [['Home', '/'], ['Gallery', '/gallery']],
    extraLd: photos.length ? [galleryLd(photos)] : [],
    main: galleryMain(photos),
  });
  return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=60' } });
}
