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
   /zh/  /zh/about  /zh/second-hand-aircon  /zh/aircon-repair
   /zh/aircon-servicing  /zh/chemical-overhaul  /zh/aircon-installation
   /zh/pricing  /zh/contact  /zh/blog

Notes
- Menu links use clean addresses, so they only work once hosted.
  To look at the site on your own computer, run a local server (e.g. npx serve).
- The primary menu is enhanced by assets/nav-highlight.js on every page. It uses the
  shared AC artwork and stays sticky while scrolling on every page, on desktop,
  tablet and mobile. The menu order is Home, About, Second-hand, Repair, Servicing,
  Chemical overhaul, New aircon, Prices, Contact and Blog.
- Desktop and mobile use separate AC artwork with the same white casing. The blue
  airflow glow and the mobile logo have been removed. On mobile, the temperature
  control is transparent on the left and a transparent hamburger opens the links
  on the right. The temperature starts at 25 C after each page load; its guidance
  panel is playful Singaporean copy and does not claim an exact electricity use.
- The AC navigation styling and controls are shared in assets/nav-highlight.js.
  If you change that file, update its version in every page's script URL.
- Every page starts with a blank 40px pink spacer band, followed by the AC
  navigation. The old dotted strip, logo/contact letterhead and header card are
  removed.
- Fonts are hosted in assets/fonts. Nothing loads from Google Fonts.
- Chinese pages use system font fallbacks (Microsoft YaHei, PingFang SC) for
  Chinese characters. No extra font files needed.
- The contact page embeds a Google Map for 3018 Bedok North Street 5.
- sitemap.xml and robots.txt point at https://k2lcoolaircon.com. Change the domain
  in those two files and in each page's canonical tag if the live domain is different.
- English and Chinese page pairs are linked with hreflang tags for SEO.
- Floating widgets:
  - Bottom-right: WhatsApp chat ticket (assets/whatsapp-widget-ticket.js)
  - Bottom-left: Language switcher (assets/lang-switcher.js), only on pages
    that have a translation available.
- Files inside zh/ use absolute paths (/assets/...) since they are one folder down.
