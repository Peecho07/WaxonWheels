/* Wax On Wheels — shared behaviour. No dependencies. */

(function () {
  'use strict';

  var body = document.body;

  /* ---- Mobile navigation ------------------------------------------------ */
  var toggle = document.querySelector('.nav-toggle');
  var list = document.getElementById('primary-nav');

  function setMenu(open) {
    if (!list || !toggle) { return; }
    list.setAttribute('data-open', String(open));
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    body.classList.toggle('is-locked', open);
  }

  if (toggle && list) {
    toggle.addEventListener('click', function () {
      setMenu(list.getAttribute('data-open') !== 'true');
    });

    /* Close after choosing a destination. Without this, tapping an anchor
       link scrolls the page behind a menu that is still covering it. */
    list.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setMenu(false); });
    });

    /* Tap outside the header to dismiss. */
    document.addEventListener('click', function (e) {
      if (list.getAttribute('data-open') !== 'true') { return; }
      if (!e.target.closest('.masthead')) { setMenu(false); }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && list.getAttribute('data-open') === 'true') {
        setMenu(false);
        toggle.focus();
      }
    });

    /* Reset state if the viewport crosses the breakpoint while open. */
    var wide = window.matchMedia('(min-width: 901px)');
    var onChange = function (mq) { if (mq.matches) { setMenu(false); } };
    if (wide.addEventListener) { wide.addEventListener('change', onChange); }
    else if (wide.addListener) { wide.addListener(onChange); }
  }

  /* ---- Collapsible submenus --------------------------------------------- */
  document.querySelectorAll('.nav__expand').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var item = btn.closest('.nav__item');
      var open = item.getAttribute('data-open') === 'true';

      /* One open submenu at a time keeps the menu short enough to scan. */
      document.querySelectorAll('.nav__item[data-open="true"]').forEach(function (other) {
        if (other !== item) {
          other.setAttribute('data-open', 'false');
          var b = other.querySelector('.nav__expand');
          if (b) { b.setAttribute('aria-expanded', 'false'); }
        }
      });

      item.setAttribute('data-open', String(!open));
      btn.setAttribute('aria-expanded', String(!open));
    });
  });

  /* ---- FAQ accordions --------------------------------------------------- */
  document.querySelectorAll('.faq__q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq__item');
      var open = item.getAttribute('data-open') === 'true';
      item.setAttribute('data-open', String(!open));
      btn.setAttribute('aria-expanded', String(!open));
      btn.querySelector('.faq__sign').textContent = open ? '+' : '\u2013';
    });
  });

  /* ---- Sticky call bar --------------------------------------------------- */
  var callbar = document.querySelector('.callbar');
  var hero = document.querySelector('.hero');

  if (callbar && hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      callbar.setAttribute('data-visible', String(!entries[0].isIntersecting));
    }, { rootMargin: '-120px 0px 0px 0px' }).observe(hero);
  } else if (callbar) {
    callbar.setAttribute('data-visible', 'true');
  }

  /* ---- Gallery lightbox -------------------------------------------------- */
  var box = document.querySelector('.lightbox');

  if (box) {
    var boxImg = box.querySelector('img');
    var lastFocus = null;
    var touchStartY = 0;

    function openBox(src, alt) {
      boxImg.src = src;
      boxImg.alt = alt || '';
      box.setAttribute('data-open', 'true');
      body.classList.add('is-locked');
      box.querySelector('.lightbox__close').focus();
    }

    function closeBox() {
      box.setAttribute('data-open', 'false');
      boxImg.removeAttribute('src');
      body.classList.remove('is-locked');
      if (lastFocus) { lastFocus.focus(); }
    }

    document.querySelectorAll('[data-full]').forEach(function (el) {
      el.addEventListener('click', function () {
        lastFocus = el;
        var img = el.querySelector('img');
        openBox(el.getAttribute('data-full'), img ? img.alt : '');
      });
    });

    box.addEventListener('click', function (e) {
      if (e.target === box || e.target.classList.contains('lightbox__close')) { closeBox(); }
    });

    /* Swipe down to dismiss, which is what people expect on a phone. */
    box.addEventListener('touchstart', function (e) {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    box.addEventListener('touchend', function (e) {
      if (e.changedTouches[0].clientY - touchStartY > 90) { closeBox(); }
    }, { passive: true });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && box.getAttribute('data-open') === 'true') { closeBox(); }
    });
  }

  /* ---- Forms -------------------------------------------------------------
     No backend is wired up yet. Until one is, the form hands off to the
     visitor's own mail client so no enquiry is silently lost.            */
  document.querySelectorAll('form[data-mailto]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var lines = [];
      data.forEach(function (value, key) {
        if (String(value).trim()) { lines.push(key + ': ' + value); }
      });
      var subject = data.get('Subject') || 'Website enquiry';
      window.location.href =
        'mailto:' + form.getAttribute('data-mailto') +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(lines.join('\n'));
      var status = form.querySelector('.form-status');
      if (status) { status.textContent = 'Opening your email app with these details filled in.'; }
    });
  });
})();
