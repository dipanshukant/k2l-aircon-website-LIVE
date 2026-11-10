# K2L Aircon website: developer guide

This guide explains how the site is built, how to change it, and how to add new pages, blog pages and blog articles so they match the existing design, fonts and language.

The design idea: **every page is a technician's pink carbon-copy job sheet lying on a dark blue desk.** Printed form boxes, typewriter text, a few handwritten notes, one red rubber stamp. If a new page still looks like a job sheet, it is on brand.

## 1. What the site is

- Plain static HTML. No framework, no build step, no CMS.
- Hosted on Cloudflare Pages. Upload the folder as it is.
- The homepage has a tick-box WhatsApp script. All pages load two small widget scripts (WhatsApp chat and language switcher).

```
index.html                  Home
second-hand-aircon.html     Main sales page
aircon-repair.html
aircon-servicing.html
chemical-overhaul.html
aircon-installation.html
pricing.html
about.html
contact.html
blog.html                   Blog listing page
sitemap.xml
robots.txt
zh/                         Chinese (Simplified) translations
  index.html                Chinese home
  second-hand-aircon.html   Chinese second-hand page
  pricing.html              Chinese pricing
  contact.html              Chinese contact
assets/
  img/                      Photos and the K2L logo
  img/brands/               Brand logos
  fonts/                    Web fonts and fonts.css
  whatsapp-widget-ticket.js Floating WhatsApp chat widget (bottom-right)
  whatsapp-widget.js        Alternate dancing technician widget (not in use)
  lang-switcher.js          Language switcher widget (bottom-left)
```

Cloudflare Pages serves `aircon-repair.html` at `/aircon-repair`, so no redirects are needed.

### Two versions of the same site

| Version | Menu and text links | Use it for |
|---|---|---|
| LIVE | Clean addresses, for example `/aircon-repair` | Hosting |
| PREVIEW | File names, for example `aircon-repair.html` | Opening from a folder by double-click |

Edit the LIVE version. To check your work on your own computer, run a local server from the site folder (for example `npx serve`) or use a Cloudflare Pages preview deployment.

Images, fonts and the stylesheet use relative paths (`assets/img/...`), which work because all pages sit in the root folder. See section 7 for pages inside a subfolder such as `/blog/`.

## 2. Design rules

### Colours

| Use | Colour |
|---|---|
| Desk (page background) | `#1B1F5C` |
| Paper (the sheet) | `#F6D5DC` |
| Ink (all printed text, borders, buttons) | `#23277A` |
| Handwriting | `#1B1B1F` |
| Rubber stamp (homepage only) | `#C22B2B` |
| Photo prints and logo tiles | `#FFFFFF` |

Do not add new colours. Buttons are ink on paper reversed: ink background, paper text.

### Fonts

All three are hosted in `assets/fonts` and loaded by `assets/fonts/fonts.css`. Nothing loads from Google.

| Font | Weights | Used for |
|---|---|---|
| Barlow Condensed | 500, 600, 700 | Headlines, box headings, menu, buttons. Always uppercase. |
| Courier Prime | 400, 700 | All body text, prices, labels |
| Caveat | 500 | Handwritten notes only |

Rules:
- One `h1` per page, in Barlow Condensed 700.
- Body text is 17px Courier Prime with line height 1.5.
- Handwriting is for short notes of about 3 to 8 words, in lowercase, one or two per section at most. Never use it for body text, prices or links.
- Do not add a fourth font.

### Layout

- The sheet is 1060px wide at most, centred on the desk, with a dotted perforation strip on top.
- Content sits in numbered form boxes with 2px ink borders. Boxes are numbered 1, 2, 3 in order.
- No rounded cards, no shadows on boxes, no gradients, no icons, no emoji.
- Photos are shown as white "prints" with a small tilt of 1 to 2 degrees, usually with a handwritten caption.
- Photos are never cropped. Use `width: 100%; height: auto`.

## 3. The building blocks

Inner pages share one small stylesheet, written in a `<style>` block in each page's `<head>`. Copy it from `aircon-servicing.html` when you make a new page. The classes:

| Class | What it is |
|---|---|
| `.desk` | Dark blue page background and base font |
| `.sheet` | The pink paper |
| `.perf` | Perforation strip at the top of the sheet |
| `.in` | Inner padding of the sheet, stacks sections with a 28px gap |
| `.lb` | Small uppercase label (13px). Sits above the headline and above fields. |
| `.ttl` | The big headline (`h1`) |
| `.hw` | Handwritten note |
| `.bx` | The outer bordered form box that holds sections |
| `.sec` | One numbered section inside `.bx` |
| `.bh` | Section heading bar. `<b>` holds the number, `<span>` holds the title. |
| `.pad` | Padding inside a section |
| `.cols` | Auto-fitting columns that stack on phones |
| `.ln` | One ruled line with text on the left and a value on the right (price rows) |
| `.pr` | The price or value on the right of a `.ln` |
| `.ph` | White photo print. Put an `<img>` and an optional `.hw` caption inside. |
| `.btn` | Ink button. Use it on an `<a>`, never on a `<div>`. |

The homepage (`index.html`) was built first and uses inline styles in place of these classes. It looks the same. When editing it, change the inline styles directly.

### Section pattern

```html
<section class="sec">
  <h2 class="bh"><b>1</b><span>Section title</span></h2>
  <div class="pad">
    <p>Body text.</p>
  </div>
</section>
```

### Price rows

```html
<div class="pad" style="gap: 0">
  <div class="ln"><span><strong>General servicing,</strong> routine cleaning</span><span class="pr">from $50 a unit</span></div>
</div>
```

### Photo print

```html
<div class="ph" style="max-width: 720px; transform: rotate(-1deg)">
  <img src="assets/img/your-photo.jpg" alt="Describe what the photo shows" style="display: block; width: 100%; height: auto">
  <p class="hw" style="text-align: center">short handwritten caption</p>
</div>
```

## 4. Header, menu and footer

The letterhead (logo, company details, "Job sheet" box), the menu and the footer are **copied into every page**. There is no shared include.

- To change the menu, phone number, email or footer, change it in all pages. Use find and replace across the folder.
- The footer ends with the copyright line and "Built & Maintained by SerpEyes". Keep both.
- Menu order: Home, Second-hand, Repair, Servicing, Chemical overhaul, New aircon, Prices, About, Contact, Blog. Second-hand comes first after Home because it is the main business.
- Chinese pages have the same menu but in Chinese. Links point to `/zh/` versions where Chinese pages exist, and to English versions for untranslated pages.

## 5. Common changes

| Change | Where |
|---|---|
| A price | The service page, `pricing.html`, the homepage price table, and the page's meta description if it mentions the price |
| Phone or WhatsApp number | Every page: letterhead, footer, buttons (`wa.me/6587127012` and `tel:+6587127012`), and the JSON-LD block in `<head>` |
| A photo | Replace the file in `assets/img` with the same name, or add a new file and update the `src` and `alt` |
| A brand logo | `assets/img/brands`, used on `index.html` and `aircon-installation.html` |
| Google reviews | "Customers say" boxes on `index.html`, `second-hand-aircon.html` and `aircon-repair.html`. These are short summaries, not quotes. Only use exact quotes if copied word for word from Google. |
| Tick-box options on the homepage | See below. The Chinese homepage (`zh/index.html`) has its own translated script. |

### Homepage tick boxes

Each tick box is an `<input type="checkbox">` with `data-k2l="need"` or `data-k2l="place"` and a `value`. The script at the bottom of `index.html` turns the ticked boxes into proper sentences for WhatsApp.

To add an option:
1. Copy an existing `<label>` and change its `value` and visible text.
2. In the script, add the same `value` to the right list with the phrase it should produce:
   - `BUY` for things to buy: "I would like to buy **a second-hand aircon**."
   - `FAULT` for problems: "My aircon **is noisy**."
   - `PLACE` for locations: "This is for **a landed home**."
3. Tick it with a few other boxes and read the message. It must read as a normal sentence.

## 6. Adding a new page

1. Copy `aircon-servicing.html` and rename it using lowercase words joined by hyphens, for example `aircon-gas-top-up.html`.
2. Keep the whole `<head>`, the letterhead, the menu and the footer. Replace only the content between the menu and the footer.
3. Follow this order on every page:
   1. `.lb` label with the topic and "Singapore"
   2. `h1.ttl` headline
   3. One `.hw` handwritten note
   4. A short intro paragraph (`max-width: 44em`)
   5. One `.btn` WhatsApp button with a pre-filled message
   6. A `.bx` with 3 to 5 numbered sections
   7. The footer
4. Update the `<head>`: `<title>`, meta description, canonical, Open Graph title, description and URL, and the breadcrumb in the JSON-LD block.
5. Add the page to `sitemap.xml`.
6. Link to it from at least two existing pages, and link from it to at least two others. Add it to the menu only if it is a main service.
7. Check it at 1440px, 768px and 390px wide. Nothing may scroll sideways.

## 7. Blog pages and articles

Use the same sheet, fonts and boxes. A blog article is a job sheet too, so it must not look like a different website.

### Addresses and files

| Page | File | Address |
|---|---|---|
| Blog index | `blog.html` | `/blog` |
| Article | `blog/how-often-to-service-aircon.html` | `/blog/how-often-to-service-aircon` |

Files inside `blog/` are one folder down, so relative paths break. In those files, start every path with a slash: `/assets/fonts/fonts.css`, `/assets/img/...`, `/aircon-repair`. Also change the font paths check: `fonts.css` already uses paths relative to itself, so it needs no change.

The "Blog" link is already in the menu on every page.

### Blog index layout

- `.lb`: "Aircon tips and guides, Singapore"
- `h1.ttl`: a plain headline, for example "Aircon tips. No nonsense."
- One `.bx` with one `.sec` titled "Latest".
- Inside, one `.ln` row per article: the article title as a bold link on the left, the date on the right in `.pr`. Add a one-line summary under the title.
- Newest first.

```html
<div class="ln">
  <span><a href="/blog/how-often-to-service-aircon"><strong>How often should you service your aircon?</strong></a><br>What changes the answer, and what a normal service covers.</span>
  <span class="pr">12 Jan 2027</span>
</div>
```

### Article layout

1. `.lb`: "Aircon guide" and the date, for example "Aircon guide, 12 Jan 2027"
2. `h1.ttl`: the question or topic
3. One `.hw` note that gives the short answer
4. Intro paragraph of 2 to 3 sentences (`max-width: 44em`)
5. One `.bx`. Each `h2` of the article is one numbered `.sec`. Keep paragraphs inside `.pad` to `max-width: 46em` so lines stay readable.
6. Use `.ln` rows for any prices or comparisons, and a `.ph` print for any photo.
7. A last section titled "Need help?" that links to the matching service page and has one `.btn` WhatsApp button.
8. The footer.

Article `<head>`: add `Article` structured data (headline, datePublished, dateModified, author as K2L Aircon, image) next to the existing business data, and a three-step breadcrumb: Home, Blog, article title.

## 8. Chinese pages (zh/)

Four pages are translated into Simplified Chinese and live in the `zh/` folder. They follow the same job-sheet design.

### How Chinese pages work

- `lang="zh-Hans-SG"` on the `<html>` tag.
- All asset paths are absolute (`/assets/...`) because the files are one folder down.
- Nav links point to `/zh/` versions where a Chinese page exists, and to English for the rest.
- Each English-Chinese pair is linked with `hreflang` tags in `<head>` for SEO. Both the English page and the Chinese page must have both `hreflang` tags.
- Chinese pages use system fonts for Chinese characters: `'Microsoft YaHei'` (Windows), `'PingFang SC'` (Mac), `'Noto Sans SC'` (Android/Linux). These are added as fallbacks in the font-family stack. No extra font files are hosted.
- The homepage Chinese version (`zh/index.html`) has its own translated WhatsApp tick-box script that sends messages in Chinese.
- JSON-LD descriptions and breadcrumbs are in Chinese.

### Adding a new Chinese page

1. Copy an existing Chinese page from `zh/` as the template.
2. Translate all visible text. Keep brand names, addresses and phone numbers in English.
3. Add `hreflang` tags to both the new Chinese page and its English counterpart.
4. Add the page to `sitemap.xml` and `sitemap.html`.
5. Update `assets/lang-switcher.js`: add the path pair to the `zhPages` object.
6. Update nav links on all Chinese pages to include the new page.

### Chinese translation rules

- Use Simplified Chinese as used in Singapore.
- Singapore-specific terms: 组屋 (HDB), 公寓 (condo), 排屋 (landed), 冷气 (aircon), 雪种 (refrigerant gas).
- Area names in Chinese: 勿洛 (Bedok), 淡滨尼 (Tampines), 榜鹅 (Punggol), etc.
- Tone should match the English: friendly, honest, direct. Not formal or stiff.
- Prices stay in S$ with the same "from" phrasing: "$700起".

## 9. Floating widgets

Two floating widgets appear on every page, loaded via `<script>` tags before `</body>`.

| Widget | File | Position | What it does |
|---|---|---|---|
| WhatsApp chat | `assets/whatsapp-widget-ticket.js` | Bottom-right | Floating job-sheet ticket linking to WhatsApp. Green online dot, float animation. |
| Language switcher | `assets/lang-switcher.js` | Bottom-left | Shows "中文" on English pages, "English" on Chinese pages. Only appears on pages that have a translation. |

Both widgets are self-injecting: they create their own HTML and CSS. To change them, edit the JS file. No changes needed in the HTML pages.

An alternate WhatsApp widget (`assets/whatsapp-widget.js`, dancing technician stamp style) is kept but not in use. To switch, change the script filename in all pages.

## 10. Language and tone

Write the way a friendly, honest technician would talk to a customer.

- **Plain English.** Short sentences. No jargon without a quick explanation.
- **A light Singapore touch, not Singlish.** Good: HDB, condo, landed, BTO, resale, PUB bill, "all can" once in a while. Avoid: lah, leh, ah, wah, kena, spoil, "cannot on", "come down", "some more".
- **Second-hand first.** Selling second-hand aircon is the main business. Repair, servicing and new aircon come after.
- **Honest and specific.** Say what is included, say the price, say what happens next.
- **Prices** are always written as "from $40", never as a fixed price, and never invented. If a fact is not confirmed (a warranty length, a price, opening hours), leave it out.
- **Customers "WhatsApp" us.** That is the main call to action on every page. One primary button per page.
- **No em dashes or en dashes.** Use full stops and commas.
- **Handwritten notes** are short, lowercase and warm, for example "a proper wash, every time".
- Use "aircon" as the main word. Use "AC" now and then for search, mostly in labels, titles and intros.
- Spelling is British English: "colour", "centre".

### Headline style

Short, direct and benefit-led, often with a question:
- "Aircon broken? We come the same day and fix it."
- "Overdue for a service? From $50 a unit."
- "Why pay new price? Good second-hand aircon from $700, installed."

## 11. SEO checklist for every page

Focus keywords for the site: used aircon singapore, buy used aircon singapore, buy used ac singapore, second hand aircon singapore, second hand ac singapore, ac repair singapore, ac service singapore.

- [ ] `<title>` under about 65 characters, main keyword first, ends with "| K2L Aircon"
- [ ] Meta description of about 150 to 160 characters with the keyword and one clear benefit
- [ ] One `h1`. Section headings are `h2`. Sub-points are `h3`.
- [ ] The main keyword appears in the `.lb` label, in the first paragraph, and naturally once or twice more. Do not stuff.
- [ ] Canonical tag points to the clean address on `https://www.k2lairconsg.com`
- [ ] Open Graph title, description, URL and image are set
- [ ] JSON-LD: keep the business block, update the breadcrumb, add `Article` data on blog articles
- [ ] Every image has descriptive `alt` text and a descriptive file name
- [ ] At least two internal links in the body text, with descriptive link text (not "click here")
- [ ] One or two external links to trusted sources where they help the reader. Good sources: nea.gov.sg, hdb.gov.sg, bca.gov.sg. Use `target="_blank" rel="noopener"`. Do not link to competitors.
- [ ] The page is added to `sitemap.xml`
- [ ] Images are saved as JPEG (photos) or PNG (logos), no wider than 1400px

## 12. Before you publish

- [ ] The page still looks like the job sheet: pink paper, ink boxes, the three fonts
- [ ] No new colours, fonts, icons, emoji, gradients or rounded cards
- [ ] No sideways scrolling at 390px wide
- [ ] Buttons and links are at least 44px tall on phones
- [ ] Photos are not cropped
- [ ] The WhatsApp button opens with a sensible pre-filled message
- [ ] No placeholder text in square brackets is left on the page
- [ ] Menu and footer match the other pages
