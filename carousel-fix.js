(() => {
  const ready = fn => document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn) : fn();

  ready(() => {
    /* =========================================================
       HOTFIX GLOBAL
       1) links "Ver projeto" sempre clicáveis
       2) troca PT/EN volta suavemente para a primeira dobra
       ========================================================= */

    const style = document.createElement('style');
    style.textContent = `
      html.az-lang-changing main,
      html.az-lang-changing .header{
        transition:opacity .32s ease, filter .32s ease!important;
        opacity:.72;
        filter:blur(1.5px);
      }
      #carousel-projetos .link-arrow{
        position:relative!important;
        z-index:20!important;
        pointer-events:auto!important;
        overflow:visible!important;
      }
      #carousel-projetos .card__info{
        position:relative!important;
        z-index:10!important;
        overflow:visible!important;
      }
    `;
    document.head.appendChild(style);

    /* ---------------------------------------------------------
       Troca de idioma: fade curto + scroll suave para o topo
       Funciona junto do i18n existente em enhancements.js.
       --------------------------------------------------------- */
    document.querySelectorAll('.lang__btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.documentElement.classList.add('az-lang-changing');

        const hero = document.querySelector('#topo');
        const goTop = () => {
          if (window.__lenis && hero) {
            window.__lenis.scrollTo(hero, {
              offset: 0,
              duration: 1.35,
              easing: t => 1 - Math.pow(1 - t, 4)
            });
          } else if (hero) {
            hero.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        };

        requestAnimationFrame(goTop);
        setTimeout(() => document.documentElement.classList.remove('az-lang-changing'), 360);
      }, true);
    });

    const root = document.querySelector('#carousel-projetos');
    if (!root) return;

    const viewport = root.querySelector('.carousel__viewport');
    const track = root.querySelector('.carousel__track');
    const cards = [...root.querySelectorAll('.card')];
    const prev = root.querySelector('[data-dir="-1"]');
    const next = root.querySelector('[data-dir="1"]');
    const dots = root.querySelector('.dots');
    if (!viewport || !track || !cards.length) return;

    track.style.transform = 'none';

    const padLeft = () => parseFloat(getComputedStyle(viewport).paddingLeft) || 0;
    const padRight = () => parseFloat(getComputedStyle(viewport).paddingRight) || 0;
    const maxScroll = () => Math.max(0, viewport.scrollWidth - viewport.clientWidth);

    let index = 0;

    function targetFor(i) {
      i = Math.max(0, Math.min(i, cards.length - 1));
      const card = cards[i];
      const left = card.offsetLeft - padLeft();
      if (i === cards.length - 1) {
        const rightAligned = card.offsetLeft + card.offsetWidth - viewport.clientWidth + padRight();
        return Math.max(0, Math.min(maxScroll(), rightAligned));
      }
      return Math.max(0, Math.min(maxScroll(), left));
    }

    function paint() {
      if (prev) prev.disabled = false;
      if (next) next.disabled = false;
      if (dots) [...dots.querySelectorAll('button')].forEach((d,i) => d.classList.toggle('is-active', i === index));
    }

    function go(i, smooth = true) {
      if (i < 0) i = cards.length - 1;
      if (i >= cards.length) i = 0;
      index = i;
      viewport.scrollTo({ left: targetFor(index), behavior: smooth ? 'smooth' : 'auto' });
      paint();
    }

    root.addEventListener('click', e => {
      const btn = e.target.closest('[data-dir]');
      if (!btn || !root.contains(btn)) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      go(index + Number(btn.dataset.dir || 0));
    }, true);

    if (dots) {
      dots.addEventListener('click', e => {
        const b = e.target.closest('button');
        if (!b) return;
        const all = [...dots.querySelectorAll('button')];
        const i = all.indexOf(b);
        if (i >= 0) {
          e.preventDefault();
          e.stopImmediatePropagation();
          go(i);
        }
      }, true);
    }

    let down = false;
    let sx = 0;
    let sl = 0;
    let moved = false;
    let pressedLink = null;

    viewport.addEventListener('pointerdown', e => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;

      pressedLink = e.target.closest('a.link-arrow');
      if (pressedLink) {
        down = false;
        moved = false;
        return;
      }

      down = true;
      moved = false;
      sx = e.clientX;
      sl = viewport.scrollLeft;
      viewport.setPointerCapture?.(e.pointerId);
    }, true);

    viewport.addEventListener('pointermove', e => {
      if (!down) return;
      const dx = e.clientX - sx;
      if (Math.abs(dx) > 4) moved = true;
      viewport.scrollLeft = sl - dx;
    }, true);

    const finish = () => {
      if (!down) return;
      down = false;
      const center = viewport.scrollLeft + viewport.clientWidth / 2;
      let best = 0, bestDist = Infinity;
      cards.forEach((c,i) => {
        const cc = c.offsetLeft + c.offsetWidth / 2;
        const d = Math.abs(cc - center);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      go(best);
    };

    viewport.addEventListener('pointerup', finish, true);
    viewport.addEventListener('pointercancel', finish, true);

    /* O listener antigo do carrossel usa preventDefault no mousedown.
       Bloqueamos esse listener somente quando o alvo é "Ver projeto". */
    viewport.addEventListener('mousedown', e => {
      if (e.target.closest('a.link-arrow')) e.stopImmediatePropagation();
    }, true);

    viewport.addEventListener('touchstart', e => {
      if (e.target.closest('a.link-arrow')) e.stopImmediatePropagation();
    }, { capture:true, passive:true });

    /* Navegação explícita para não depender do comportamento nativo
       que o drag antigo podia cancelar. */
    root.addEventListener('click', e => {
      const link = e.target.closest('a.link-arrow');
      if (!link || !root.contains(link)) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      const href = link.getAttribute('href');
      if (href) window.location.assign(href);
    }, true);

    const refresh = () => go(index, false);
    addEventListener('resize', refresh, { passive:true });
    addEventListener('load', refresh, { once:true });
    setTimeout(refresh, 400);
    paint();
  });
})();
