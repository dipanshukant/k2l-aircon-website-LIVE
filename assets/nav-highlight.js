(function () {
  var path = window.location.pathname.replace(/\.html$/, '').replace(/\/index$/, '/').replace(/\/$/, '') || '/';
  var navs = document.querySelectorAll('nav[aria-label]');

  var css = document.createElement('style');
  css.textContent =
    '.ac-nav-shell{position:relative;width:100%;aspect-ratio:6/1;margin:0 0 18px}' +
    '.ac-nav-shell:before{content:"";position:absolute;z-index:0;inset:0;background:url("/assets/img/ac-nav-unit-crop.png") center/100% 100% no-repeat;-webkit-mask-image:linear-gradient(to bottom,#000 0%,#000 82%,transparent 100%);mask-image:linear-gradient(to bottom,#000 0%,#000 82%,transparent 100%);pointer-events:none}' +
    '.ac-nav-shell nav[aria-label]{position:absolute!important;z-index:1;top:27%!important;left:3.5%!important;width:84%!important;height:35%!important;box-sizing:border-box!important;display:flex!important;flex-wrap:nowrap!important;align-items:center!important;gap:0!important;overflow-x:auto;scrollbar-width:none;border:0!important;background:transparent!important;padding:0 2px!important;font-family:"Barlow Condensed","Arial Narrow","Microsoft YaHei",sans-serif!important;font-size:clamp(12px,1.1vw,17px)!important;font-weight:700!important;letter-spacing:.015em!important;text-transform:uppercase;box-shadow:none!important}' +
    '.ac-nav-shell nav::-webkit-scrollbar{display:none}' +
    '.ac-nav-shell nav a{box-sizing:border-box!important;display:flex!important;flex:1 0 auto;align-items:center!important;justify-content:center;min-height:80%!important;padding:0 clamp(5px,.62vw,10px)!important;border-right:1px solid #c6c8d6;text-align:center;text-decoration:none!important;color:#19245f!important;white-space:nowrap;line-height:1!important;transition:background .15s,color .15s,box-shadow .15s}' +
    '.ac-nav-shell nav a:last-child{border-right:0}' +
    '.ac-nav-shell nav a:hover{background:#dbeaff!important;color:#151d63!important;opacity:1!important}' +
    '.ac-nav-shell nav a[aria-current="page"]{flex:0 0 auto!important;height:34px!important;min-height:34px!important;padding:0 12px!important;border-radius:5px;background:linear-gradient(180deg,#28388f,#121d69)!important;color:#fff!important;box-shadow:inset 0 1px 2px #8c9dff,0 2px 4px #19245f66}' +
    '.ac-nav-temp{position:absolute;z-index:1;right:3.5%;top:32%;width:8%;height:25%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;color:#8beaff;font:700 clamp(11px,1.15vw,18px)/1 "Courier Prime","Courier New",monospace;letter-spacing:-.06em;text-align:center;text-shadow:0 0 4px #00cfff,0 0 10px #00aaff}' +
    '.ac-nav-temp small{font:700 clamp(6px,.55vw,9px)/1 "Barlow Condensed",sans-serif;letter-spacing:.22em;color:#81eeff;text-shadow:0 0 5px #00cfff}' +
    '@media(min-width:721px){.ac-nav-shell{position:sticky;top:clamp(-50px,-2.65vw,-18px);z-index:100}}' +
    '@media(max-width:720px){.ac-nav-shell{margin-bottom:14px}.ac-nav-shell nav[aria-label]{left:3%!important;width:84%!important;font-size:9.5px!important}.ac-nav-shell nav a{padding:0 3px!important}.ac-nav-shell nav a[aria-current="page"]{height:26px!important;min-height:26px!important;padding:0 8px!important}.ac-nav-temp{right:3.5%;width:8%;font-size:9px}.ac-nav-temp small{font-size:5px}}' +
    '@media(max-width:420px){.ac-nav-shell nav[aria-label]{font-size:8.5px!important}.ac-nav-shell nav a{padding:0 1px!important}.ac-nav-shell nav a[aria-current="page"]{height:24px!important;min-height:24px!important;padding:0 6px!important}}' +
    '@media(prefers-reduced-motion:reduce){.ac-nav-shell nav a{transition:none}}';
  document.head.appendChild(css);

  for (var n = 0; n < navs.length; n++) {
    var nav = navs[n];
    var shell = document.createElement('div');
    shell.className = 'ac-nav-shell';
    nav.parentNode.insertBefore(shell, nav);
    shell.appendChild(nav);

    var temp = document.createElement('div');
    temp.className = 'ac-nav-temp';
    temp.setAttribute('aria-label', 'Air conditioner temperature setting: 24 degrees Celsius');
    temp.innerHTML = '24&deg;C<small>&#10052; &bull; &bull;</small>';
    shell.appendChild(temp);

    var links = nav.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
      links[i].setAttribute('data-full-label', links[i].textContent.trim());
      var href = links[i].getAttribute('href').replace(/\/$/, '') || '/';
      if (href === path) links[i].setAttribute('aria-current', 'page');
    }

    if (!document.documentElement.lang.toLowerCase().startsWith('zh')) {
      var mobileLabels = {
        'SECOND-HAND': 'USED AC',
        'SERVICING': 'SERVICE',
        'CHEMICAL OVERHAUL': 'OVERHAUL',
        'NEW AIRCON': 'NEW AC'
      };
      function updateMobileLabels() {
        var compact = window.innerWidth <= 420;
        for (var j = 0; j < links.length; j++) {
          var full = links[j].getAttribute('data-full-label');
          links[j].textContent = compact ? (mobileLabels[full.toUpperCase()] || full) : full;
          links[j].setAttribute('aria-label', full);
          links[j].title = full;
        }
      }
      updateMobileLabels();
      window.addEventListener('resize', updateMobileLabels);
    }
  }
})();
