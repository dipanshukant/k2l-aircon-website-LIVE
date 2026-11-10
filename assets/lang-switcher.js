(function () {
  /* Language switcher widget — bottom-left corner, matches WhatsApp ticket style */
  var zhPages = {
    '/': '/zh/',
    '/second-hand-aircon': '/zh/second-hand-aircon',
    '/aircon-repair': '/zh/aircon-repair',
    '/aircon-servicing': '/zh/aircon-servicing',
    '/chemical-overhaul': '/zh/chemical-overhaul',
    '/aircon-installation': '/zh/aircon-installation',
    '/pricing': '/zh/pricing',
    '/about': '/zh/about',
    '/contact': '/zh/contact',
    '/blog': '/zh/blog',
    '/sitemap': '/zh/sitemap'
  };
  var enPages = {};
  for (var en in zhPages) { enPages[zhPages[en]] = en; }

  var path = window.location.pathname.replace(/\.html$/, '').replace(/\/index$/, '/').replace(/\/$/, '') || '/';
  var isZh = path.indexOf('/zh') === 0;
  var altPath = isZh ? (enPages[path] || '/') : (zhPages[path] || null);

  var css = document.createElement('style');
  css.textContent =
    '@keyframes k2l-lang-float{0%,100%{transform:translateY(0) rotate(2deg)}50%{transform:translateY(-8px) rotate(-1deg)}}' +

    '#k2l-lang{position:fixed;bottom:24px;left:40px;z-index:9999;text-decoration:none;cursor:pointer;-webkit-tap-highlight-color:transparent;animation:k2l-lang-float 3s ease-in-out infinite}' +

    '#k2l-lang-card{position:relative;width:66px;background:#F6D5DC;border:2px solid #23277A;box-shadow:3px 4px 0 rgba(35,39,122,.22);display:flex;flex-direction:column;overflow:hidden}' +

    '#k2l-lang-perf{height:11px;background:radial-gradient(circle,#23277A 2px,transparent 2.5px) 0 50%/11px 11px repeat-x;border-bottom:1px dashed #23277A;flex-shrink:0}' +

    '#k2l-lang-body{padding:6px 8px 8px;display:flex;flex-direction:column;align-items:center;gap:4px}' +

    '#k2l-lang-icon{font-style:normal;font-size:22px;line-height:1;color:#23277A;font-family:"Barlow Condensed","Arial Narrow","Microsoft YaHei",sans-serif;font-weight:700}' +

    '#k2l-lang-label{font-family:"Barlow Condensed","Arial Narrow","Microsoft YaHei",sans-serif;font-weight:700;font-size:13px;letter-spacing:.1em;text-transform:uppercase;color:#23277A;line-height:1}' +

    '#k2l-lang-hw{font-family:"Caveat","Microsoft YaHei",cursive;font-size:13px;line-height:1;color:#1B1B1F;text-align:center}' +

    '#k2l-lang:hover #k2l-lang-card{opacity:.85}' +

    '@media(max-width:480px){#k2l-lang{bottom:16px;left:16px}#k2l-lang-card{width:58px}#k2l-lang-label{font-size:12px}#k2l-lang-hw{font-size:11px}}';

  document.head.appendChild(css);

  if (!altPath && !isZh) return;
  if (!altPath) altPath = '/';

  var el = document.createElement('a');
  el.id = 'k2l-lang';
  el.href = altPath;

  if (isZh) {
    el.setAttribute('aria-label', 'Switch to English');
    el.innerHTML =
      '<div id="k2l-lang-card">' +
        '<div id="k2l-lang-perf"></div>' +
        '<div id="k2l-lang-body">' +
          '<em id="k2l-lang-icon">EN</em>' +
          '<div id="k2l-lang-label">English</div>' +
          '<div id="k2l-lang-hw">read in English</div>' +
        '</div>' +
      '</div>';
  } else {
    el.setAttribute('aria-label', '切换到中文');
    el.innerHTML =
      '<div id="k2l-lang-card">' +
        '<div id="k2l-lang-perf"></div>' +
        '<div id="k2l-lang-body">' +
          '<em id="k2l-lang-icon">中</em>' +
          '<div id="k2l-lang-label">中文</div>' +
          '<div id="k2l-lang-hw">看中文版</div>' +
        '</div>' +
      '</div>';
  }

  document.body.appendChild(el);
})();
