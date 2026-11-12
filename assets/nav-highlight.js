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
    // One message per setting, 18 to 30 C.
    var TIPS_EN = [
      '18°C? This is not aircon, this is the drinks fridge at the hawker centre. Your SP bill is shivering too. Go up a few degrees.',
      'Penguins would feel at home. Your wallet, not so much. Colder settings usually use more power.',
      'Cinema-at-Jewel cold. Wearing a jacket indoors in Singapore? Something is not right.',
      'Wah, Arctic in Ang Mo Kio. Shiok for now, but the SP bill will remember.',
      'Shopping mall cold. Nice, but your aircon is doing OT with no OT pay.',
      'Two degrees below NEA’s 25°C tip. Comfy, yes. Cheaper, not really. Try one up?',
      'So close to NEA’s 25°C tip. One more tap and your aircon can stop chionging.',
      'NEA’s energy-saving pick. Steady pom pi pi: comfy and kinder to the bill.',
      'Eco champion. Add a fan and you won’t even notice the extra degree.',
      'Like a breezy morning at East Coast Park. Fan on, aircon relaxed, wallet smiling.',
      'Getting toasty. If you’re sweating like waiting for the bus at noon, go down a bit.',
      'This is basically outside weather with a remote control. A fan might do the same job.',
      '30°C? Might as well open the window. Your aircon is on holiday.'
    ];
    var TIPS_ZH = [
      '18°C？这不是冷气，是小贩中心饮料摊的冰柜了。电费单也在发抖，调高几度吧。',
      '企鹅住这里都会很满意，你的钱包就不一定了。温度越低，通常越耗电。',
      '冷得像星耀樟宜的电影院。在新加坡的家里还要穿外套？不太对吧。',
      '哇，宏茂桥变北极了。现在很爽，电费单会记得的。',
      '像商场一样冷。舒服是舒服，冷气在加班，还没有加班费。',
      '比 NEA 建议的 25°C 低两度。舒服是有，省钱就不一定。调高一度试试？',
      '离 NEA 的 25°C 只差一度。再按一下，冷气就不用那么拼了。',
      'NEA 推荐的节能温度。稳稳的，舒服又对电费单友好。',
      '节能冠军。开个风扇，多一度你都感觉不到。',
      '像东海岸公园的清晨微风。风扇一开，冷气轻松，钱包也开心。',
      '开始有点热了。如果流汗像中午等巴士，就调低一点吧。',
      '这基本是户外天气加个遥控器。开风扇可能效果一样。',
      '30°C？不如直接开窗吧。你的冷气在放假。'
    ];
    function messageForTemperature(t) {
      var tips = isChinese ? TIPS_ZH : TIPS_EN;
      return tips[Math.max(0, Math.min(tips.length - 1, t - 18))];
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
