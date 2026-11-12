(function () {
  var path = window.location.pathname.replace(/\.html$/, '').replace(/\/index$/, '/').replace(/\/$/, '') || '/';
  var navs = document.querySelectorAll('nav[aria-label]');

  var css = document.createElement('style');
  css.textContent =
    '.ac-nav-shell{position:relative;width:100%;aspect-ratio:6/1;margin:0 0 18px}' +
    '.ac-nav-shell:before{content:"";position:absolute;z-index:0;inset:0;background:url("/assets/img/ac-nav-unit-noglow.png?v=35") center/100% 100% no-repeat;-webkit-mask-image:none;mask-image:none;pointer-events:none}' +
    '.ac-nav-shell nav[aria-label]{position:absolute!important;z-index:1;top:27%!important;left:3.5%!important;width:84%!important;height:35%!important;box-sizing:border-box!important;display:flex!important;flex-wrap:nowrap!important;align-items:center!important;gap:0!important;overflow-x:auto;scrollbar-width:none;border:0!important;background:transparent!important;padding:0 2px!important;font-family:"Barlow Condensed","Arial Narrow","Microsoft YaHei",sans-serif!important;font-size:clamp(12px,1.1vw,17px)!important;font-weight:700!important;letter-spacing:.015em!important;text-transform:uppercase;box-shadow:none!important}' +
    '.ac-nav-shell nav::-webkit-scrollbar{display:none}' +
    '.ac-nav-shell nav a{box-sizing:border-box!important;display:flex!important;flex:1 0 auto;align-items:center!important;justify-content:center;min-height:80%!important;padding:0 clamp(5px,.62vw,10px)!important;border-right:1px solid #c6c8d6;text-align:center;text-decoration:none!important;color:#19245f!important;white-space:nowrap;line-height:1!important;transition:background .15s,color .15s,box-shadow .15s}' +
    '.ac-nav-shell nav a:last-child{border-right:0}' +
    '.ac-nav-shell nav a:hover{background:#dbeaff!important;color:#151d63!important;opacity:1!important}' +
    '.ac-nav-shell nav a[aria-current="page"]{flex:0 0 auto!important;height:34px!important;min-height:34px!important;padding:0 12px!important;border-radius:5px;background:linear-gradient(180deg,#28388f,#121d69)!important;color:#fff!important;box-shadow:inset 0 1px 2px #8c9dff,0 2px 4px #19245f66}' +
    '.ac-nav-temp{position:absolute;z-index:2;right:3.5%;top:32%;width:8%;height:25%;color:#8beaff;text-shadow:0 0 4px #00cfff,0 0 10px #00aaff}' +
    '.ac-nav-temp-toggle{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;padding:0;border:0;background:transparent;color:inherit;font:700 clamp(11px,1.15vw,18px)/1 "Courier Prime","Courier New",monospace;letter-spacing:-.06em;text-align:center;cursor:pointer}' +
    '.ac-nav-temp-toggle small{font:700 clamp(6px,.55vw,9px)/1 "Barlow Condensed",sans-serif;letter-spacing:.22em;color:#81eeff;text-shadow:0 0 5px #00cfff}' +
    '.ac-nav-temp-toggle:focus-visible{outline:2px solid #fff;outline-offset:2px;border-radius:3px}' +
    '.ac-temp-bubble{position:absolute;z-index:5;top:calc(100% - 16px);right:2.5%;box-sizing:border-box;width:min(320px,calc(100vw - 32px));padding:14px 16px 12px;border:2px solid #23277A;background:#F6D5DC;color:#23277A;box-shadow:5px 6px 0 rgba(27,31,92,.2);font:14px/1.4 "Courier Prime","Courier New",monospace}' +
    '.ac-temp-bubble[hidden]{display:none!important}' +
    '.ac-temp-bubble:not([hidden]){display:block;animation:ac-temp-pop .18s ease-out both}' +
    '@keyframes ac-temp-pop{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}' +
    '.ac-temp-bubble:before{content:"";position:absolute;right:24px;top:-9px;width:14px;height:14px;transform:rotate(45deg);background:#F6D5DC;border-top:2px solid #23277A;border-left:2px solid #23277A}' +
    '.ac-temp-title{margin:0 0 8px;font:700 18px/1.1 "Barlow Condensed","Arial Narrow",sans-serif;letter-spacing:.06em;text-transform:uppercase}' +
    '.ac-temp-controls{display:flex;align-items:center;justify-content:center;gap:14px;margin:0 0 8px}' +
    '.ac-temp-step{width:42px;height:36px;border:1px solid #23277A;background:#23277A;color:#F6D5DC;font:700 22px/1 "Barlow Condensed",sans-serif;cursor:pointer}' +
    '.ac-temp-step:hover:not(:disabled){background:#1B1F5C}.ac-temp-step:disabled{opacity:.42;cursor:default}.ac-temp-controls output{min-width:68px;text-align:center;font-size:18px;font-weight:700}' +
    '.ac-temp-copy{margin:0 0 8px;color:#1B1B1F}.ac-temp-note{margin:0;font-size:11px;line-height:1.35}.ac-temp-source{display:inline-block;margin-top:5px;font-size:11px;font-weight:700}' +
    '.ac-mobile-menu-toggle{display:none}' +
    '.ac-mobile-menu-toggle{width:44px;height:44px;place-items:center;padding:0;border:1px solid #23277A;border-radius:7px;background:#23277A;color:#F6D5DC;cursor:pointer}' +
    '.ac-mobile-menu-toggle svg{width:22px;height:22px;stroke:currentColor;stroke-width:2;stroke-linecap:round}' +
    '.ac-mobile-menu-toggle:focus-visible{outline:2px solid #23277A;outline-offset:3px}' +
    '@media(min-width:901px){.ac-nav-shell{position:sticky;top:clamp(-50px,-2.65vw,-18px);z-index:100}}' +
    '.ac-nav-mobile-brand{display:none}' +
    '@media(max-width:900px){.ac-nav-shell{display:block;position:sticky;top:0;z-index:100;aspect-ratio:6/1;margin:0 0 14px;padding:0;border:0;border-radius:0;background:none;box-shadow:none}.ac-nav-shell:before{display:block;inset:0;background:url("/assets/img/ac-nav-mobile-noglow.png?v=35") center/128% 100% no-repeat;-webkit-mask-image:none;mask-image:none;opacity:1}.ac-nav-mobile-brand{position:absolute;z-index:2;left:50%;top:48%;display:block;width:clamp(58px,11vw,92px);transform:translate(-50%,-50%);line-height:0}.ac-nav-mobile-brand img{display:block;width:100%;height:auto;filter:drop-shadow(0 1px 1px #fff8)}.ac-nav-temp{position:absolute;z-index:2;left:9%;right:auto;top:48%;width:auto;height:auto;transform:translateY(-50%);color:#087b9f;text-shadow:0 0 3px #72eaff99}.ac-nav-temp-toggle{width:auto;height:auto;display:flex;flex-direction:row;align-items:center;justify-content:center;gap:3px;padding:5px 0;border:0;background:transparent;color:inherit;font-size:clamp(11px,2vw,15px);letter-spacing:-.06em}.ac-nav-temp-toggle small{font-size:7px;color:#0ba9c9;text-shadow:0 0 3px #47dfff88}.ac-mobile-menu-toggle{position:absolute;z-index:2;right:8.5%;top:48%;display:grid;width:42px;height:42px;transform:translateY(-50%);border:0;border-radius:0;background:transparent;color:#19245f}.ac-mobile-menu-toggle svg{width:25px;height:25px;stroke-width:2.4}.ac-mobile-menu-toggle:focus-visible{outline:2px solid #19245f;outline-offset:2px}.ac-nav-shell nav[aria-label]{position:absolute!important;z-index:5;top:calc(100% - 8px)!important;left:0!important;right:0!important;width:100%!important;height:auto!important;max-height:min(65vh,420px);overflow-y:auto!important;overflow-x:hidden!important;display:none!important;flex-direction:column!important;align-items:stretch!important;gap:0!important;padding:6px!important;border:2px solid #23277A!important;border-radius:7px;background:#F6D5DC!important;box-shadow:0 5px 12px #19245f22!important;font-size:17px!important}.ac-nav-shell.is-menu-open nav[aria-label]{display:flex!important}.ac-nav-shell nav a{flex:0 0 auto!important;width:100%;min-height:44px!important;height:auto!important;justify-content:flex-start!important;padding:0 12px!important;border-right:0!important;border-bottom:1px solid #c6c8d6;text-align:left}.ac-nav-shell nav a:last-child{border-bottom:0}.ac-nav-shell nav a[aria-current="page"]{align-self:flex-start;width:fit-content!important;height:40px!important;min-height:40px!important;padding:0 12px!important}.ac-temp-bubble{position:absolute;z-index:6;top:calc(100% - 8px);left:0;right:auto;width:min(320px,calc(100vw - 32px));margin:0;padding:12px 14px 10px;font-size:13px}.ac-temp-bubble:before{left:calc(9% + 12px);right:auto}.ac-temp-title{font-size:17px}.ac-temp-step{width:44px;height:40px}}' +
    '@media(max-width:600px){.ac-nav-shell{aspect-ratio:4.6/1}.ac-nav-mobile-brand{width:clamp(42px,12vw,58px)}.ac-nav-temp{left:8%}.ac-mobile-menu-toggle{right:7%;width:38px;height:38px}}' +
    '@media(prefers-reduced-motion:reduce){.ac-nav-shell nav a,.ac-temp-bubble:not([hidden]){transition:none;animation:none}}';
  document.head.appendChild(css);

  for (var n = 0; n < navs.length; n++) {
    var nav = navs[n];
    var shell = document.createElement('div');
    shell.className = 'ac-nav-shell';
    nav.parentNode.insertBefore(shell, nav);
    shell.appendChild(nav);
    var stickyContainer = nav.closest('.in');
    if (stickyContainer && shell.parentNode !== stickyContainer && shell.parentNode.parentNode === stickyContainer) {
      shell.parentNode.insertAdjacentElement('afterend', shell);
    }
    var isChinese = document.documentElement.lang.toLowerCase().startsWith('zh');
    var navId = 'ac-mobile-nav-' + n;
    nav.id = navId;

    var temp = document.createElement('div');
    temp.className = 'ac-nav-temp';
    var value = 25;
    temp.innerHTML = '<button type="button" class="ac-nav-temp-toggle" aria-expanded="false"><span class="ac-temp-screen-value"></span><small>&#10052; &bull; &bull;</small></button>';
    shell.appendChild(temp);

    var tempToggle = temp.querySelector('.ac-nav-temp-toggle');
    var bubble = document.createElement('div');
    var bubbleId = 'ac-temp-bubble-' + n;
    bubble.id = bubbleId;
    bubble.className = 'ac-temp-bubble';
    bubble.hidden = true;
    bubble.setAttribute('role', 'region');
    bubble.setAttribute('aria-label', 'Air conditioner temperature and energy guide');
    bubble.innerHTML = '<h2 class="ac-temp-title">Set the aircon temp, lah</h2><div class="ac-temp-controls"><button type="button" class="ac-temp-step" data-temp-step="-1" aria-label="Lower temperature">−</button><output aria-live="polite"></output><button type="button" class="ac-temp-step" data-temp-step="1" aria-label="Raise temperature">+</button></div><p class="ac-temp-copy" aria-live="polite"></p><p class="ac-temp-note">Guidance only, not a kWh estimate. Actual use varies by model, room and run time.</p><a class="ac-temp-source" href="https://www.nea.gov.sg/our-services/climate-change-energy-efficiency/energy-efficiency/household-sector/energy-saving-tips" target="_blank" rel="noopener">See NEA energy-saving tips</a>';
    shell.appendChild(bubble);
    tempToggle.setAttribute('aria-controls', bubbleId);

    var menuToggle = document.createElement('button');
    menuToggle.className = 'ac-mobile-menu-toggle';
    menuToggle.type = 'button';
    menuToggle.setAttribute('aria-controls', navId);
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', isChinese ? '打开菜单' : 'Open menu');
    menuToggle.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"></path></svg>';
    shell.appendChild(menuToggle);

    function setMenuOpen(open) {
      shell.classList.toggle('is-menu-open', open);
      menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuToggle.setAttribute('aria-label', isChinese ? (open ? '关闭菜单' : '打开菜单') : (open ? 'Close menu' : 'Open menu'));
    }
    menuToggle.addEventListener('click', function () {
      setBubbleOpen(false);
      setMenuOpen(!shell.classList.contains('is-menu-open'));
    });
    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) setMenuOpen(false);
    });

    var screenValue = temp.querySelector('.ac-temp-screen-value');
    var bubbleOutput = bubble.querySelector('output');
    var bubbleCopy = bubble.querySelector('.ac-temp-copy');
    var stepButtons = bubble.querySelectorAll('[data-temp-step]');
    if (isChinese) {
      bubble.querySelector('.ac-temp-title').textContent = '空调温度调节';
      bubble.querySelector('.ac-temp-note').textContent = '节能提示仅供参考，并非实际 kWh 估算。实际用电量取决于机型、房间条件和运行时间。';
      bubble.querySelector('.ac-temp-source').textContent = '查看 NEA 节能建议';
      stepButtons[0].setAttribute('aria-label', '调低温度');
      stepButtons[1].setAttribute('aria-label', '调高温度');
    }
    function messageForTemperature(t) {
      if (isChinese) {
        if (t <= 21) return '哇，冷气开到像去北海道了。温度设得越低，通常越耗电；还舒服的话，调高一点啦。';
        if (t <= 23) return '很凉爽，不过比 NEA 建议的 25\u00B0C 还低。调高一度，说不定一样舒服，省电一点 lah。';
        if (t === 24) return '只比 NEA 的 25\u00B0C 节能建议低一度。觉得舒服的话，试试 25\u00B0C，让冷气也休息一下。';
        if (t === 25) return 'NEA 的节能建议是 25\u00B0C。舒服又省心，电费也不用那么 shiong。';
        return '冷气轻松一点 lah。觉得热的话，可以开风扇，不用马上调低温度。';
      }
      if (t <= 21) return 'Wah, Arctic in Ang Mo Kio. Cooler settings generally use more electricity. Bump it up if you’re still shiok.';
      if (t <= 23) return 'Shiok, but this is cooler than NEA’s 25\u00B0C energy-saving tip. One degree up might still be shiok, lah.';
      if (t === 24) return 'Just one degree below NEA’s 25\u00B0C tip. Try 25\u00B0C if you’re comfy. Your aircon can relax a bit too.';
      if (t === 25) return 'NEA’s energy-saving tip is 25\u00B0C. Steady lah: comfy without asking the aircon to work extra hard.';
      return 'Easy on the aircon, lah. If the room feels warm, a fan can bring the breeze without lowering the setpoint.';
    }
    function updateTemperature() {
      screenValue.textContent = value + '\u00B0C';
      tempToggle.setAttribute('aria-label', isChinese ? ('当前温度 ' + value + ' 摄氏度，打开温度调节') : ('Temperature is ' + value + ' degrees Celsius. Open temperature controls.'));
      bubbleOutput.textContent = value + '\u00B0C';
      bubbleCopy.textContent = messageForTemperature(value);
      for (var k = 0; k < stepButtons.length; k++) {
        var delta = parseInt(stepButtons[k].getAttribute('data-temp-step'), 10);
        stepButtons[k].disabled = value + delta < 18 || value + delta > 30;
      }
    }
    function setBubbleOpen(open) {
      bubble.hidden = !open;
      tempToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    updateTemperature();
    tempToggle.addEventListener('click', function () {
      setMenuOpen(false);
      setBubbleOpen(bubble.hidden);
    });
    for (var k = 0; k < stepButtons.length; k++) {
      stepButtons[k].addEventListener('click', function () {
        value += parseInt(this.getAttribute('data-temp-step'), 10);
        updateTemperature();
      });
    }
    document.addEventListener('click', function (event) {
      if (!shell.contains(event.target)) {
        setBubbleOpen(false);
        setMenuOpen(false);
      }
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        if (!bubble.hidden) {
          setBubbleOpen(false);
          tempToggle.focus();
        }
        if (shell.classList.contains('is-menu-open')) {
          setMenuOpen(false);
          menuToggle.focus();
        }
      }
    });

    var links = nav.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
      links[i].setAttribute('data-full-label', links[i].textContent.trim());
      var href = links[i].getAttribute('href').replace(/\/$/, '') || '/';
      if (href === path) links[i].setAttribute('aria-current', 'page');
    }

    for (var j = 0; j < links.length; j++) {
      var full = links[j].getAttribute('data-full-label');
      links[j].setAttribute('aria-label', full);
      links[j].title = full;
    }
  }
})();
