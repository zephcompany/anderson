/* =========================================================
   Anderson Zawa — LP
   ========================================================= */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------------------------------------------------------
     1. Header — esconde ao descer, aparece ao subir
     --------------------------------------------------------- */
  (function header() {
    var el = $('#header');
    if (!el) return;
    var last = 0;

    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      if (y > last && y > 220 && !$('#nav').classList.contains('is-open')) {
        el.classList.add('is-hidden');
      } else {
        el.classList.remove('is-hidden');
      }
      last = y;
    }, { passive: true });
  })();

  /* ---------------------------------------------------------
     2. Menu mobile
     --------------------------------------------------------- */
  (function burger() {
    var btn = $('#burger'), nav = $('#nav');
    if (!btn || !nav) return;

    function close() {
      nav.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Abrir menu');
    }

    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });

    $$('a', nav).forEach(function (a) { a.addEventListener('click', close); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && !btn.contains(e.target)) close();
    });
  })();

  /* ---------------------------------------------------------
     3. Troca de idioma (visual — plugar i18n depois)
     --------------------------------------------------------- */
  $$('.lang__btn').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('.lang__btn').forEach(function (o) {
        o.classList.remove('is-active');
        o.setAttribute('aria-pressed', 'false');
      });
      b.classList.add('is-active');
      b.setAttribute('aria-pressed', 'true');
      document.dispatchEvent(new CustomEvent('langchange', { detail: b.dataset.lang }));
    });
  });

  /* ---------------------------------------------------------
     4. Marquees infinitos (ticker + galeria)
        Duplica o conteúdo para o loop não ter emenda.
     --------------------------------------------------------- */
  function loop(track) {
    if (!track || reduced) return;
    Array.prototype.slice.call(track.children).forEach(function (node) {
      var clone = node.cloneNode(true);
      clone.removeAttribute('id');
      clone.setAttribute('aria-hidden', 'true');
      $$('[id]', clone).forEach(function (n) { n.removeAttribute('id'); });
      $$('a, button', clone).forEach(function (n) { n.tabIndex = -1; });
      track.appendChild(clone);
    });
  }
  loop($('#ticker'));
  loop($('#marquee'));

  /* ---------------------------------------------------------
     5. Carrossel de projetos
     --------------------------------------------------------- */
  (function carousel() {
    var root = $('#carousel-projetos');
    if (!root) return;

    var viewport = $('.carousel__viewport', root);
    var track    = $('.carousel__track', root);
    var cards    = $$('.card', track);
    var dotsBox  = $('.dots', root);
    var prev     = $('[data-dir="-1"]', root);
    var next     = $('[data-dir="1"]', root);

    var index = 0, step = 0, maxIndex = 0;

    function perView() {
      var w = viewport.clientWidth;
      var cw = cards[0].getBoundingClientRect().width;
      return Math.max(1, Math.round(w / (cw + gap())));
    }
    function gap() {
      return parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 0;
    }

    function measure() {
      step = cards[0].getBoundingClientRect().width + gap();
      maxIndex = Math.max(0, cards.length - perView());
      index = Math.min(index, maxIndex);
      buildDots();
      apply(false);
    }

    function buildDots() {
      dotsBox.innerHTML = '';
      for (var i = 0; i <= maxIndex; i++) {
        var d = document.createElement('button');
        d.type = 'button';
        d.setAttribute('role', 'tab');
        d.setAttribute('aria-label', 'Ir para o projeto ' + (i + 1));
        d.dataset.i = i;
        d.addEventListener('click', function (e) { go(+e.currentTarget.dataset.i); });
        dotsBox.appendChild(d);
      }
    }

    function apply(animate) {
      track.classList.toggle('no-anim', animate === false);
      track.style.transform = 'translate3d(' + (-index * step) + 'px,0,0)';
      $$('button', dotsBox).forEach(function (d, i) { d.classList.toggle('is-active', i === index); });
      prev.disabled = index === 0;
      next.disabled = index >= maxIndex;
      if (animate === false) requestAnimationFrame(function () { track.classList.remove('no-anim'); });
    }

    function go(i) {
      index = Math.max(0, Math.min(i, maxIndex));
      apply(true);
    }

    prev.addEventListener('click', function () { go(index - 1); });
    next.addEventListener('click', function () { go(index + 1); });

    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { go(index + 1); }
      if (e.key === 'ArrowLeft')  { go(index - 1); }
    });

    /* arrastar com mouse / dedo */
    var down = false, startX = 0, delta = 0, dragged = false;

    function start(x) {
      down = true;
      startX = x;
      delta = 0;
      dragged = false;
      viewport.classList.add('is-dragging');
      track.classList.add('no-anim');
    }
    function move(x) {
      if (!down) return;
      delta = x - startX;
      if (Math.abs(delta) > 6) dragged = true;
      track.style.transform = 'translate3d(' + (-index * step + delta) + 'px,0,0)';
    }
    function end() {
      if (!down) return;
      down = false;
      viewport.classList.remove('is-dragging');
      track.classList.remove('no-anim');
      if (Math.abs(delta) > step * 0.18) go(index + (delta < 0 ? 1 : -1));
      else apply(true);
      setTimeout(function () { dragged = false; delta = 0; }, 0);
    }

    viewport.addEventListener('mousedown', function (e) {
      if (e.target.closest('a,button')) return;
      e.preventDefault();
      start(e.clientX);
    });
    window.addEventListener('mousemove', function (e) { move(e.clientX); });
    window.addEventListener('mouseup', end);

    viewport.addEventListener('touchstart', function (e) {
      if (e.target.closest('a,button')) return;
      start(e.touches[0].clientX);
    }, { passive: true });
    viewport.addEventListener('touchmove',  function (e) { move(e.touches[0].clientX); }, { passive: true });
    viewport.addEventListener('touchend', end);

    /* bloqueia o clique somente quando houve arraste de verdade */
    $$('a', track).forEach(function (a) {
      a.addEventListener('click', function (e) {
        if (dragged) e.preventDefault();
      });
    });

    measure();
    var t;
    window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(measure, 150); });
    window.addEventListener('load', measure);
  })();

  /* ---------------------------------------------------------
     6. Acordeão do FAQ
     --------------------------------------------------------- */
  (function accordion() {
    var accs = $$('#accordion .acc');

    function open(acc) {
      var panel = $('.acc__panel', acc);
      panel.style.height = panel.scrollHeight + 'px';
      $('.acc__head', acc).setAttribute('aria-expanded', 'true');
    }
    function close(acc) {
      var panel = $('.acc__panel', acc);
      panel.style.height = panel.scrollHeight + 'px';
      requestAnimationFrame(function () { panel.style.height = '0px'; });
      $('.acc__head', acc).setAttribute('aria-expanded', 'false');
    }

    accs.forEach(function (acc) {
      var head = $('.acc__head', acc);
      var panel = $('.acc__panel', acc);

      if (head.getAttribute('aria-expanded') === 'true') panel.style.height = 'auto';

      head.addEventListener('click', function () {
        var isOpen = head.getAttribute('aria-expanded') === 'true';
        accs.forEach(function (o) { if (o !== acc) close(o); });
        isOpen ? close(acc) : open(acc);
      });

      panel.addEventListener('transitionend', function (e) {
        if (e.propertyName === 'height' && head.getAttribute('aria-expanded') === 'true') {
          panel.style.height = 'auto';
        }
      });
    });

    window.addEventListener('resize', function () {
      accs.forEach(function (acc) {
        var head = $('.acc__head', acc), panel = $('.acc__panel', acc);
        if (head.getAttribute('aria-expanded') === 'true') panel.style.height = 'auto';
      });
    });
  })();

  /* ---------------------------------------------------------
     7. Reveal + contadores
     --------------------------------------------------------- */
  (function reveal() {
    var items = $$('.reveal');
    if (reduced || !('IntersectionObserver' in window)) {
      items.forEach(function (i) { i.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: .12 });
    items.forEach(function (i) { io.observe(i); });
  })();

  (function counters() {
    var nums = $$('[data-count]');
    if (!nums.length) return;
    if (reduced || !('IntersectionObserver' in window)) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        var el = e.target;
        var target = +el.dataset.count;
        var pre = el.dataset.prefix || '';
        var suf = el.dataset.suffix || '';
        var t0 = performance.now(), dur = 1200;

        (function tick(now) {
          var p = Math.min(1, (now - t0) / dur);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = pre + Math.round(target * eased) + suf;
          if (p < 1) requestAnimationFrame(tick);
        })(t0);
      });
    }, { threshold: .5 });

    nums.forEach(function (n) { io.observe(n); });
  })();

  /* ---------------------------------------------------------
     8. Modal — galeria e vídeos dos depoimentos
     --------------------------------------------------------- */
  (function modal() {
    var el = $('#modal'), box = $('#modal-box'), closeBtn = $('.modal__close', el);
    var lastFocus = null;

    function open(node) {
      lastFocus = document.activeElement;
      box.innerHTML = '';
      box.appendChild(node);
      el.hidden = false;
      requestAnimationFrame(function () { el.classList.add('is-open'); });
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    }

    function close() {
      el.classList.remove('is-open');
      document.body.style.overflow = '';
      setTimeout(function () { el.hidden = true; box.innerHTML = ''; }, 320);
      if (lastFocus) lastFocus.focus();
    }

    closeBtn.addEventListener('click', close);
    el.addEventListener('click', function (e) { if (e.target === el) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !el.hidden) close(); });

    document.addEventListener('click', function (e) {
      var shot = e.target.closest('.shot');
      if (shot && shot.dataset.full) {
        var img = new Image();
        img.src = shot.dataset.full;
        img.alt = $('img', shot) ? $('img', shot).alt : '';
        open(img);
        return;
      }

      var play = e.target.closest('.reel__play');
      if (play && play.dataset.video) {
        var v = document.createElement('video');
        v.src = play.dataset.video;
        v.controls = true;
        v.autoplay = true;
        v.playsInline = true;
        open(v);
      }
    });
  })();

  /* ---------------------------------------------------------
     9. Link ativo do menu conforme a rolagem
     --------------------------------------------------------- */
  (function spy() {
    var map = { topo: 'topo', projetos: 'projetos', contato: 'contato' };
    var sections = Object.keys(map).map(function (id) { return document.getElementById(id); }).filter(Boolean);
    if (!sections.length || !('IntersectionObserver' in window)) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        $$('.nav__link').forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (s) { io.observe(s); });
  })();

})();
