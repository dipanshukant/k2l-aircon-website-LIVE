// Small, safe Markdown renderer for blog posts. All input is HTML-escaped
// first; only the patterns below become markup.
//
//   ## Heading        -> new numbered section on the job sheet
//   ### Subheading    -> h3 inside a section
//   **bold**  *italic*  [text](link)
//   - item / 1. item  -> lists
//   > short note      -> handwritten note
//   ![alt](/img/x.jpg) on its own line -> photo print
//   ![alt](/img/x.jpg "caption")       -> photo print with a short caption
import { esc } from './util.js';

const SAFE_URL = /^(https?:\/\/|\/|mailto:|tel:|#)/i;
const SAFE_IMG = /^(\/img\/|\/assets\/|https:\/\/)/i;

function inline(text) {
  let s = esc(text);
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, label, url) => {
    const raw = url.replace(/&amp;/g, '&');
    if (!SAFE_URL.test(raw)) return label;
    const ext = /^https?:\/\//i.test(raw) && !/^https?:\/\/(www\.)?k2lcoolaircon\.com/i.test(raw);
    return `<a href="${url}"${ext ? ' target="_blank" rel="noopener"' : ''}>${label}</a>`;
  });
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>');
  return s;
}

function photo(alt, src, tilt, caption) {
  const cap = caption === undefined ? alt : caption;
  return `<div class="ph" style="transform: rotate(${tilt}deg)"><img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" decoding="async">${cap ? `<p class="hw" style="text-align: center; font-size: 26px">${esc(cap.toLowerCase())}</p>` : ''}</div>`;
}

export function renderMarkdown(src) {
  const lines = String(src || '').replace(/\r\n?/g, '\n').split('\n');
  const intro = [];
  const sections = [];
  let out = intro;
  let para = [];
  let list = null; // { tag, items }
  let tilt = -1;

  const flushPara = () => { if (para.length) { out.push(`<p>${inline(para.join(' '))}</p>`); para = []; } };
  const flushList = () => { if (list) { out.push(`<${list.tag}>${list.items.map((i) => `<li>${inline(i)}</li>`).join('')}</${list.tag}>`); list = null; } };
  const flush = () => { flushPara(); flushList(); };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    let m;
    if (!line) { flush(); continue; }
    if ((m = line.match(/^##\s+(.+)$/)) && !line.startsWith('###')) {
      flush();
      const sec = { title: m[1].replace(/[#*]/g, '').trim(), blocks: [] };
      sections.push(sec);
      out = sec.blocks;
      continue;
    }
    if ((m = line.match(/^###\s+(.+)$/))) { flush(); out.push(`<h3>${inline(m[1])}</h3>`); continue; }
    if ((m = line.match(/^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)$/))) {
      flush();
      if (SAFE_IMG.test(m[2])) { out.push(photo(m[1], m[2], tilt, m[3])); tilt = -tilt; }
      continue;
    }
    if ((m = line.match(/^>\s?(.*)$/))) { flush(); out.push(`<p class="hw">${esc(m[1])}</p>`); continue; }
    if ((m = line.match(/^[-*]\s+(.+)$/))) {
      flushPara();
      if (!list || list.tag !== 'ul') { flushList(); list = { tag: 'ul', items: [] }; }
      list.items.push(m[1]);
      continue;
    }
    if ((m = line.match(/^\d+[.)]\s+(.+)$/))) {
      flushPara();
      if (!list || list.tag !== 'ol') { flushList(); list = { tag: 'ol', items: [] }; }
      list.items.push(m[1]);
      continue;
    }
    flushList();
    para.push(line);
  }
  flush();

  return {
    intro: intro.join('\n'),
    sections: sections.map((s) => ({ title: s.title, html: s.blocks.join('\n') })),
  };
}
