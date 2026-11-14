(function () {
  var css = document.createElement('style');
  css.textContent =
    /* gentle float wobble */
    '@keyframes k2l-tk-float{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-8px) rotate(1deg)}}' +
    /* hover slide up reveal */
    '@keyframes k2l-tk-peekup{0%{transform:translateY(0)}100%{transform:translateY(-6px)}}' +
    /* pulse dot */
    '@keyframes k2l-tk-dot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.7)}}' +

    /* widget link */
    '#k2l-tk{position:fixed;bottom:24px;right:40px;z-index:9999;text-decoration:none;cursor:pointer;-webkit-tap-highlight-color:transparent;animation:k2l-tk-float 3s ease-in-out infinite}' +
    '#k2l-tk:hover{animation:k2l-tk-peekup .3s ease-out forwards}' +

    /* the ticket card */
    '#k2l-tk-card{position:relative;width:66px;background:#F6D5DC;border:2px solid #23277A;box-shadow:3px 4px 0 rgba(35,39,122,.22);display:flex;flex-direction:column;overflow:hidden}' +

    /* perforation strip top */
    '#k2l-tk-perf{height:11px;background:radial-gradient(circle,#23277A 2px,transparent 2.5px) 0 50%/11px 11px repeat-x;border-bottom:1px dashed #23277A;flex-shrink:0}' +

    /* card body */
    '#k2l-tk-body{padding:6px 8px 8px;display:flex;flex-direction:column;align-items:center;gap:4px}' +

    /* whatsapp icon */
    '#k2l-tk-body svg{display:block;fill:#23277A;flex-shrink:0}' +

    /* "Chat" label */
    '#k2l-tk-label{font-family:"Barlow Condensed","Arial Narrow",sans-serif;font-weight:700;font-size:13px;letter-spacing:.1em;text-transform:uppercase;color:#23277A;line-height:1}' +

    /* handwritten note */
    '#k2l-tk-hw{font-family:"Caveat",cursive;font-size:13px;line-height:1;color:#1B1B1F;text-align:center}' +

    /* green online dot */
    '#k2l-tk-dot{position:absolute;top:15px;right:5px;width:7px;height:7px;background:#25D366;border-radius:50%;border:1.5px solid #F6D5DC;animation:k2l-tk-dot 2s ease-in-out infinite}' +


    /* mobile */
    '@media(max-width:480px){#k2l-tk{bottom:16px;right:16px}#k2l-tk-card{width:58px}#k2l-tk-label{font-size:12px}#k2l-tk-hw{font-size:11px}}';

  document.head.appendChild(css);

  var el = document.createElement('a');
  el.id = 'k2l-tk';
  el.href = 'https://wa.me/6587127012?text=Hi%20K2L%20Cool%2C%20I%20need%20help%20with%20my%20aircon.';
  el.target = '_blank';
  el.rel = 'noopener';
  el.setAttribute('aria-label', 'Chat with K2L Cool Aircon on WhatsApp');
  el.innerHTML =
    '<div id="k2l-tk-card">' +
      '<div id="k2l-tk-perf"></div>' +
      '<div id="k2l-tk-body">' +
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.019-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.119.553 4.11 1.519 5.838L.057 23.834l6.154-1.425A11.944 11.944 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.82c-1.907 0-3.72-.513-5.313-1.486l-.38-.227-3.654.847.888-3.529-.253-.399A9.793 9.793 0 0 1 2.18 12c0-5.422 4.398-9.82 9.82-9.82 5.422 0 9.82 4.398 9.82 9.82 0 5.422-4.398 9.82-9.82 9.82z"/></svg>' +
        '<div id="k2l-tk-label">Chat</div>' +
        '<div id="k2l-tk-hw">we\'re here</div>' +
      '</div>' +
      '<div id="k2l-tk-dot"></div>' +
    '</div>';

  document.body.appendChild(el);
})();
