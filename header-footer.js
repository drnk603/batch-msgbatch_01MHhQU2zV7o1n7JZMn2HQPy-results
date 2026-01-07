(function () {
  var header = document.querySelector('.hf-header');
  if (!header) return;

  var toggle = header.querySelector('.hf-nav-toggle');
  var nav = header.querySelector('.hf-nav');
  var subToggle = header.querySelector('.hf-nav-item--has-sub .hf-nav-link-button');
  var subItem = header.querySelector('.hf-nav-item--has-sub');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = header.classList.toggle('hf-header--nav-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  if (subToggle && subItem) {
    subToggle.addEventListener('click', function () {
      var isOpen = subItem.classList.toggle('hf-nav-sub-open');
      subToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  document.addEventListener('click', function (event) {
    if (!header.classList.contains('hf-header--nav-open')) return;
    if (!header.contains(event.target)) {
      header.classList.remove('hf-header--nav-open');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    }
  });

  var yearEl = document.querySelector('.hf-footer-year');
  if (yearEl) {
    var year = new Date().getFullYear();
    yearEl.textContent = String(year);
  }
})();
