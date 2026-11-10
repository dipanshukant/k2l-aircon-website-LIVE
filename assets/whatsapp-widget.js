(function () {
  var css = document.createElement('style');
  css.textContent =
    /* dancing: body sways left-right */
    '@keyframes k2l-sway{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}' +
    /* left arm waves */
    '@keyframes k2l-wave-l{0%,100%{transform:rotate(30deg)}50%{transform:rotate(-20deg)}}' +
    /* right arm waves (holds wrench) */
    '@keyframes k2l-wave-r{0%,100%{transform:rotate(-30deg)}50%{transform:rotate(20deg)}}' +
    /* legs shuffle */
    '@keyframes k2l-step-l{0%,100%{transform:rotate(10deg)}50%{transform:rotate(-15deg)}}' +
    '@keyframes k2l-step-r{0%,100%{transform:rotate(-10deg)}50%{transform:rotate(15deg)}}' +
    /* pulse ring */
    '@keyframes k2l-pulse{0%{transform:scale(1);opacity:.5}100%{transform:scale(2);opacity:0}}' +
    /* hover stamp slam */
    '@keyframes k2l-slam{0%{transform:scale(1) rotate(-5deg)}40%{transform:scale(1.15) rotate(0deg)}100%{transform:scale(1) rotate(-5deg)}}' +

    /* widget container */
    '#k2l-wa{position:fixed;bottom:24px;right:24px;z-index:9999;text-decoration:none;cursor:pointer;-webkit-tap-highlight-color:transparent;display:flex;flex-direction:column;align-items:center}' +

    /* stamp border frame */
    '#k2l-wa-frame{position:relative;border:4px solid #C22B2B;border-radius:10px;padding:12px 18px 8px;background:rgba(246,213,220,.94);transform:rotate(-5deg);transition:transform .2s}' +
    '#k2l-wa:hover #k2l-wa-frame{animation:k2l-slam .5s ease-in-out}' +

    /* pulse ring behind frame */
    '#k2l-wa-ring{position:absolute;inset:-4px;border:4px solid #C22B2B;border-radius:10px;animation:k2l-pulse 2.8s ease-out infinite;pointer-events:none}' +

    /* technician figure */
    '#k2l-guy{display:block;width:48px;height:64px;margin:0 auto 6px;position:relative}' +

    /* head */
    '#k2l-guy-head{position:absolute;top:0;left:50%;width:16px;height:16px;margin-left:-8px;background:#C22B2B;border-radius:50%}' +
    /* cap brim */
    '#k2l-guy-cap{position:absolute;top:-2px;left:50%;width:22px;height:6px;margin-left:-11px;background:#C22B2B;border-radius:3px 3px 0 0}' +

    /* body sways */
    '#k2l-guy-body{position:absolute;top:16px;left:50%;margin-left:-1.5px;width:3px;height:20px;background:#C22B2B;transform-origin:top center;animation:k2l-sway .8s ease-in-out infinite}' +

    /* arms */
    '#k2l-guy-arm-l,#k2l-guy-arm-r{position:absolute;top:18px;width:3px;height:16px;background:#C22B2B;border-radius:2px}' +
    '#k2l-guy-arm-l{left:13px;transform-origin:top center;animation:k2l-wave-l .8s ease-in-out infinite}' +
    '#k2l-guy-arm-r{right:10px;transform-origin:top center;animation:k2l-wave-r .8s ease-in-out infinite}' +

    /* wrench on right hand */
    '#k2l-guy-wrench{position:absolute;bottom:-2px;right:-6px;width:10px;height:10px;border:2.5px solid #C22B2B;border-radius:50%;background:transparent}' +
    '#k2l-guy-wrench::after{content:"";position:absolute;top:50%;left:-6px;width:6px;height:2.5px;background:#C22B2B}' +

    /* legs */
    '#k2l-guy-leg-l,#k2l-guy-leg-r{position:absolute;top:36px;width:3px;height:18px;background:#C22B2B;border-radius:2px}' +
    '#k2l-guy-leg-l{left:19px;transform-origin:top center;animation:k2l-step-l .4s ease-in-out infinite}' +
    '#k2l-guy-leg-r{left:26px;transform-origin:top center;animation:k2l-step-r .4s ease-in-out infinite}' +

    /* feet */
    '#k2l-guy-leg-l::after,#k2l-guy-leg-r::after{content:"";position:absolute;bottom:0;left:-2px;width:7px;height:3px;background:#C22B2B;border-radius:1px}' +

    /* text label */
    '#k2l-wa-label{color:#C22B2B;font-family:"Barlow Condensed","Arial Narrow",sans-serif;font-weight:700;font-size:14px;line-height:1;letter-spacing:.1em;text-transform:uppercase;text-align:center;white-space:nowrap}' +

    /* mobile */
    '@media(max-width:480px){#k2l-wa{bottom:16px;right:16px}#k2l-wa-frame{padding:10px 14px 6px}#k2l-guy{width:40px;height:54px}}';

  document.head.appendChild(css);

  var el = document.createElement('a');
  el.id = 'k2l-wa';
  el.href = 'https://wa.me/6587127012?text=Hi%20K2L%2C%20I%20need%20help%20with%20my%20aircon.';
  el.target = '_blank';
  el.rel = 'noopener';
  el.setAttribute('aria-label', 'Chat with K2L Aircon on WhatsApp');
  el.innerHTML =
    '<div id="k2l-wa-frame">' +
      '<div id="k2l-wa-ring"></div>' +
      '<div id="k2l-guy">' +
        '<div id="k2l-guy-cap"></div>' +
        '<div id="k2l-guy-head"></div>' +
        '<div id="k2l-guy-body"></div>' +
        '<div id="k2l-guy-arm-l"></div>' +
        '<div id="k2l-guy-arm-r"><div id="k2l-guy-wrench"></div></div>' +
        '<div id="k2l-guy-leg-l"></div>' +
        '<div id="k2l-guy-leg-r"></div>' +
      '</div>' +
      '<div id="k2l-wa-label">Chat now</div>' +
    '</div>';

  document.body.appendChild(el);
})();
