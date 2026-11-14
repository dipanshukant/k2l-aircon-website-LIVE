// Gallery page: photos live in D1 (table gallery_photos), managed in /admin.
import { esc, SITE } from './util.js';

export const SECTIONS = [
  { id: 'second-hand', title: 'Second-hand aircon', intro: 'Used aircon units we have washed, tested and installed for customers across Singapore.', link: ['/second-hand-aircon', 'See second-hand aircon prices'] },
  { id: 'repair', title: 'Aircon repair', intro: 'Repair jobs from homes and offices. Units that would not cool, leaked water or would not turn on.', link: ['/aircon-repair', 'See aircon repair'] },
  { id: 'installation', title: 'New aircon installation', intro: 'New units supplied and installed, from single wall units to system 4 and ceiling cassettes.', link: ['/aircon-installation', 'See new aircon installation'] },
];
export const SECTION_IDS = SECTIONS.map((s) => s.id);

export const GALLERY_TITLE = 'Aircon Installation and Repair Photos Singapore | K2L Cool Aircon';
export const GALLERY_DESC = 'Real photos of K2L Cool Aircon jobs in Singapore: second-hand aircon installs, aircon repairs and new aircon installation in homes, offices and schools.';

export async function listPhotos(env) {
  const { results } = await env.DB.prepare('SELECT * FROM gallery_photos ORDER BY section, sort, id').all();
  return results;
}

export function galleryMain(photos) {
  let n = 0;
  const sections = SECTIONS.map((s) => ({ ...s, photos: photos.filter((p) => p.section === s.id) })).filter((s) => s.photos.length);
  const boxes = sections.map((s, si) => {
    const figs = s.photos.map((p, i) => {
      const eager = n++ < 4;
      const tilt = i % 3 === 0 ? -1 : i % 3 === 1 ? 1 : 0;
      return `<figure class="gp" style="transform: rotate(${tilt}deg)"><a href="${esc(p.src)}" data-lb><img src="${esc(p.src)}" alt="${esc(p.alt)}" width="${p.width}" height="${p.height}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></a>${p.caption ? `<figcaption>${esc(p.caption)}</figcaption>` : ''}</figure>`;
    }).join('\n');
    return `<section class="sec" id="${s.id}">
<h2 class="bh"><b>${si + 1}</b><span>${esc(s.title)}</span></h2>
<div class="pad">
<p style="max-width: 46em">${esc(s.intro)} <a href="${s.link[0]}" style="font-weight: 700">${esc(s.link[1])}</a>.</p>
<div class="gal">
${figs}
</div>
</div>
</section>`;
  }).join('\n\n');

  return `<div class="lb">Our work, aircon jobs across Singapore</div>
<h1 class="ttl">Real jobs. Real photos.</h1>
<div class="hw">every photo is one of ours</div>
<p style="max-width: 44em">Photos from our own aircon jobs in Singapore homes, offices and schools. ${photos.length} photos of <a href="/second-hand-aircon" style="font-weight: 700">second-hand aircon</a> installs, <a href="/aircon-repair" style="font-weight: 700">aircon repairs</a> and <a href="/aircon-installation" style="font-weight: 700">new aircon installation</a>.</p>

${boxes ? `<div class="bx">\n${boxes}\n</div>` : '<p>New photos are on the way.</p>'}

<a class="btn" href="https://wa.me/6587127012?text=${encodeURIComponent('Hi K2L Cool, I saw your gallery and need help with my aircon.')}">WhatsApp us</a>

<div class="lbx" id="lbx" role="dialog" aria-modal="true" aria-label="Photo viewer" hidden>
<button class="x" type="button" aria-label="Close">&times;</button>
<button class="pv" type="button" aria-label="Previous photo">&lsaquo;</button>
<img alt="">
<p></p>
<button class="nx" type="button" aria-label="Next photo">&rsaquo;</button>
</div>
<script>${LIGHTBOX_JS}</script>`;
}

// Click a thumbnail to see the full photo. Arrow keys / buttons step through, Esc closes.
const LIGHTBOX_JS = `(function(){var b=document.getElementById('lbx');if(!b)return;var links=[].slice.call(document.querySelectorAll('a[data-lb]')),img=b.querySelector('img'),cap=b.querySelector('p'),i=0,last=null;
function show(n){i=(n+links.length)%links.length;var a=links[i],t=a.querySelector('img'),f=a.closest('figure').querySelector('figcaption');img.src=a.href;img.alt=t.alt;cap.textContent=(f?f.textContent+'. ':'')+t.alt;}
function open(n){last=document.activeElement;show(n);b.hidden=false;document.body.style.overflow='hidden';b.querySelector('.x').focus();}
function close(){b.hidden=true;document.body.style.overflow='';if(last)last.focus();}
links.forEach(function(a,n){a.addEventListener('click',function(e){e.preventDefault();open(n);});});
b.querySelector('.x').onclick=close;b.querySelector('.pv').onclick=function(){show(i-1);};b.querySelector('.nx').onclick=function(){show(i+1);};
b.addEventListener('click',function(e){if(e.target===b)close();});
document.addEventListener('keydown',function(e){if(b.hidden)return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(i-1);if(e.key==='ArrowRight')show(i+1);});
var sx=0;b.addEventListener('touchstart',function(e){sx=e.touches[0].clientX;},{passive:true});b.addEventListener('touchend',function(e){var d=e.changedTouches[0].clientX-sx;if(Math.abs(d)>50)show(i+(d<0?1:-1));});})();`;

export function galleryLd(photos) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: 'K2L Cool Aircon job photos',
    description: GALLERY_DESC,
    url: SITE + '/gallery',
    associatedMedia: photos.map((p) => ({
      '@type': 'ImageObject',
      contentUrl: SITE + p.src,
      name: p.caption || p.alt,
      description: p.alt,
      width: p.width,
      height: p.height,
      creator: { '@type': 'Organization', name: 'K2L Cool Aircon' },
      copyrightNotice: 'K2L Engineering Pte. Ltd.',
    })),
  };
}
