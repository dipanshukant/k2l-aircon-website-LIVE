// Builds blog pages from the static blog page (published as /blog-template),
// so posts always share the live site's menu, styles, scripts and footer.
import { esc, SITE, prettyDate } from './util.js';
import { renderMarkdown } from './markdown.js';

const WA = 'https://wa.me/6587127012?text=';

const EXTRA_CSS = `<style>
.ph{background:#fff;padding:10px 10px 14px;box-shadow:4px 5px 0 rgba(35,39,122,.25);max-width:720px;display:flex;flex-direction:column;gap:8px;margin:8px 0}
.ph img{display:block;width:100%;height:auto}
.post .pad{max-width:46em}
.post .pad h3{margin:8px 0 0;font:700 22px/1.2 'Barlow Condensed','Arial Narrow',sans-serif;letter-spacing:.06em;text-transform:uppercase}
.post .pad ul,.post .pad ol{margin:0;padding-left:1.4em;display:flex;flex-direction:column;gap:6px}
.post .pad a{font-weight:700}
.cover{max-width:860px}
</style>`;

export async function loadTemplate(env, request) {
  const res = await env.ASSETS.fetch(new URL('/blog-template', request.url));
  if (!res.ok) throw new Error('blog template missing');
  return res.text();
}

function setMeta(html, attr, name, value) {
  const re = new RegExp(`(<meta ${attr}="${name}" content=")[^"]*(")`);
  return html.replace(re, `$1${esc(value)}$2`);
}

export function page(tpl, { title, description, path, ogType = 'website', image, breadcrumb, extraLd = [], hreflang = false, main }) {
  const url = SITE + path;
  let html = tpl.replace(/(href|src)="assets\//g, '$1="/assets/');
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`);
  html = setMeta(html, 'name', 'description', description);
  html = setMeta(html, 'property', 'og:title', title);
  html = setMeta(html, 'property', 'og:description', description);
  html = setMeta(html, 'property', 'og:url', url);
  html = setMeta(html, 'property', 'og:type', ogType);
  if (image) html = setMeta(html, 'property', 'og:image', image);
  html = html.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`);
  if (!hreflang) html = html.replace(/<link rel="alternate" hreflang="[^"]*" href="[^"]*">\n?/g, '');

  // Keep the business block, replace the breadcrumb, add any extra data.
  html = html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/, (m, body) => {
    let business = [];
    try { business = JSON.parse(body).filter((x) => x['@type'] !== 'BreadcrumbList'); } catch {}
    const crumbs = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumb.map(([name, p], i) => ({ '@type': 'ListItem', position: i + 1, name, item: SITE + p })),
    };
    const data = JSON.stringify([...business, crumbs, ...extraLd]).replace(/</g, '\\u003c');
    return `<script type="application/ld+json">${data}</script>`;
  });
  html = html.replace('</head>', EXTRA_CSS + '\n</head>');

  const navEnd = html.indexOf('</nav>') + '</nav>'.length;
  const footStart = html.indexOf('<footer', navEnd);
  return html.slice(0, navEnd) + '\n\n' + main + '\n\n' + html.slice(footStart);
}

function waButton(text, label = 'WhatsApp us') {
  return `<a class="btn" href="${WA}${encodeURIComponent(text)}">${esc(label)}</a>`;
}

export function blogIndexMain(posts) {
  const rows = posts.length
    ? posts.map((p) => `<div class="ln">
<span><a href="/blog/${esc(p.slug)}"><strong>${esc(p.title)}</strong></a>${p.summary ? `<br>${esc(p.summary)}` : ''}</span>
<span class="pr">${esc(prettyDate(p.published_at))}</span>
</div>`).join('\n')
    : `<div class="ln"><span>First guides are on the way. Check back soon.</span></div>`;
  return `<div class="lb">Aircon tips and guides, Singapore</div>
<h1 class="ttl">Aircon tips. No nonsense.</h1>
<div class="hw">straight talk from our technicians</div>
<p style="max-width: 44em">Honest guides on aircon servicing, repair and buying in Singapore. Written by the people who actually do the work.</p>

<div class="bx">
<section class="sec">
<h2 class="bh"><b>1</b><span>Latest</span></h2>
<div class="pad" style="gap: 0">
${rows}
</div>
</section>
</div>

${waButton('Hi K2L, I need help with my aircon.')}`;
}

export function postMain(post) {
  const md = renderMarkdown(post.body);
  const sections = [...md.sections];
  sections.push({
    title: 'Need help?',
    html: `<p>Our technicians handle <a href="/second-hand-aircon">second-hand aircon</a>, <a href="/aircon-repair">aircon repair</a> and <a href="/aircon-servicing">servicing</a> across Singapore. Message us and we will tell you the price first.</p>
${waButton(`Hi K2L, I read "${post.title}" on your blog and need help with my aircon.`)}`,
  });
  const box = sections.map((s, i) => `<section class="sec">
<h2 class="bh"><b>${i + 1}</b><span>${esc(s.title)}</span></h2>
<div class="pad">
${s.html}
</div>
</section>`).join('\n');

  return `<article class="post" style="display: flex; flex-direction: column; gap: 28px">
<div class="lb">Aircon guide, ${esc(prettyDate(post.published_at))}</div>
<h1 class="ttl">${esc(post.title)}</h1>
${post.note ? `<div class="hw">${esc(post.note)}</div>` : ''}
${post.cover ? `<div class="ph cover" style="transform: rotate(-1deg)"><img src="${esc(post.cover)}" alt="${esc(post.cover_alt || post.title)}"></div>` : ''}
${post.summary ? `<p style="max-width: 44em">${esc(post.summary)}</p>` : ''}
${md.intro ? `<div style="max-width: 44em; display: flex; flex-direction: column; gap: 16px">${md.intro}</div>` : ''}
<div class="bx">
${box}
</div>
<p><a href="/blog" style="font-weight: 700">Back to all guides</a></p>
</article>`;
}

export function renderPostPage(tpl, post) {
  const image = post.cover ? (post.cover.startsWith('http') ? post.cover : SITE + post.cover) : undefined;
  return page(tpl, {
    title: `${post.title} | K2L Aircon`,
    description: post.summary || post.title,
    path: `/blog/${post.slug}`,
    ogType: 'article',
    image,
    breadcrumb: [['Home', '/'], ['Blog', '/blog'], [post.title, `/blog/${post.slug}`]],
    extraLd: [{
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.summary || undefined,
      datePublished: post.published_at,
      dateModified: (post.updated_at || post.published_at).slice(0, 10),
      author: { '@type': 'Organization', name: 'K2L Aircon' },
      publisher: { '@id': SITE + '/#business' },
      image: image || SITE + '/assets/img/k2l-aircon-van.jpg',
      mainEntityOfPage: SITE + `/blog/${post.slug}`,
    }],
    main: postMain(post),
  });
}
