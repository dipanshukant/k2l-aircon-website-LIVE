K2L Aircon website, LIVE version (static HTML, no build step)

Deploy on Cloudflare Pages
1. Upload this whole folder as the site root (or push it to the connected Git repo).
2. No build command. Output directory is the folder itself.
3. Cloudflare Pages serves aircon-repair.html at /aircon-repair automatically, so the
   page addresses match the old site.

English pages
   /  /second-hand-aircon  /aircon-repair  /aircon-servicing  /chemical-overhaul
   /aircon-installation  /pricing  /about  /contact  /blog

Chinese (Simplified) pages
   /zh/  /zh/second-hand-aircon  /zh/pricing  /zh/contact

Notes
- Menu links use clean addresses, so they only work once hosted.
  To look at the site on your own computer, run a local server (e.g. npx serve).
- Fonts are hosted in assets/fonts. Nothing loads from Google Fonts.
- Chinese pages use system font fallbacks (Microsoft YaHei, PingFang SC) for
  Chinese characters. No extra font files needed.
- The contact page embeds a Google Map for 3018 Bedok North Street 5.
- sitemap.xml and robots.txt point at https://www.k2lairconsg.com. Change the domain
  in those two files and in each page's canonical tag if the live domain is different.
- English and Chinese page pairs are linked with hreflang tags for SEO.
- Two floating widgets appear on every page:
  - Bottom-right: WhatsApp chat ticket (assets/whatsapp-widget-ticket.js)
  - Bottom-left: Language switcher (assets/lang-switcher.js), only on pages
    that have a translation available.
- Files inside zh/ use absolute paths (/assets/...) since they are one folder down.
