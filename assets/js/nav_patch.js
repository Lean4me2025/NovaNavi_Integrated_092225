(function () {
  function go(route) {
    if (!route) return;
    if (typeof window.navigateTo === 'function') {
      window.navigateTo(route);
    } else {
      location.hash = '#' + route.replace(/^#/, '');
      try {
        window.dispatchEvent(new HashChangeEvent('hashchange'));
      } catch (e) {
        // Older browsers fallback
        var evt = document.createEvent('HashChangeEvent');
        evt.initHashChangeEvent('hashchange', true, true, location.href, location.href);
        window.dispatchEvent(evt);
      }
    }
  }

  // Delegate: Start with NOVA button
  document.addEventListener('click', function (e) {
    var t = e.target.closest('#startWithNova');
    if (!t) return;
    e.preventDefault();
    go('discover');
  });

  // Delegate: Any data-route target
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-route]');
    if (!t) return;
    e.preventDefault();
    var route = t.getAttribute('data-route');
    go(route);
  });

  // Delegate: Any #hash link (keeps behavior consistent)
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var hash = a.getAttribute('href').slice(1);
    if (!hash) return;
    e.preventDefault();
    go(hash);
  });
})();