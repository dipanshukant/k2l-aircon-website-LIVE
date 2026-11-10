(function () {
  var path = window.location.pathname.replace(/\.html$/, '').replace(/\/index$/, '/').replace(/\/$/, '') || '/';
  var links = document.querySelectorAll('nav[aria-label] a');
  for (var i = 0; i < links.length; i++) {
    var href = links[i].getAttribute('href').replace(/\/$/, '') || '/';
    if (href === path) {
      links[i].style.background = '#23277A';
      links[i].style.color = '#F6D5DC';
      links[i].style.padding = '0 10px';
      links[i].setAttribute('aria-current', 'page');
      break;
    }
  }
})();
