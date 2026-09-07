(() => {
  const ready = fn => document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn) : fn();
  ready(() => {
    const root = document.querySelector('#carousel-projetos');
    if (!root) return;
    const viewport = root.querySelector('.carousel__viewport');
    const track = root.querySelector('.carousel__track');
    const cards = [...root.querySelectorAll('.card')];
    const prev = root.querySelector('[data-dir="-1"]');
    const next = root.querySelector('[data-dir="1"]');
    const dots = root.querySelector('.dots');
    if (!viewport || !track || !cards.length) return;

    // neutraliza o carrossel antigo baseado em transform sem remover a estrutura visual
    track.style.transform = 'none';

    const padLeft = () => parseFloat(getComputedStyle(viewport).paddingLeft) || 0;
    const padRight = () => parseFloat(getComputedStyle(viewport).paddingRight) || 0;
    const maxScroll = () => Math.max(0, viewport.scrollWidth - viewport.clientWidth);

    let index = 0;

    function targetFor(i) {
      i = Math.max(0, Math.min(i, cards.length - 1));
      const card = cards[i];
      const left = card.offsetLeft - padLeft();
      const last = i === cards.length - 1;
      if (last) {
        const rightAligned = card.offsetLeft + card.offsetWidth - viewport.clientWidth + padRight();
        return Math.max(0, Math.min(maxScroll(), rightAligned));
      }
      return Math.max(0, Math.min(maxScroll(), left));
    }

    function paint() {
      if (prev) prev.disabled = false;
      if (next) next.disabled = false;
      if (dots) [...dots.querySelectorAll('button')].forEach((d,i)=>d.classList.toggle('is-active', i === index));
    }

    function go(i, smooth = true) {
      if (i < 0) i = cards.length - 1;
      if (i >= cards.length) i = 0;
      index = i;
      viewport.scrollTo({ left: targetFor(index), behavior: smooth ? 'smooth' : 'auto' });
      paint();
    }

    // captura antes dos listeners antigos e transforma as setas em loop infinito
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

    let down = false, sx = 0, sl = 0, moved = false;
    viewport.addEventListener('pointerdown', e => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      down = true; moved = false; sx = e.clientX; sl = viewport.scrollLeft;
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

    viewport.addEventListener('click', e => {
      if (moved && e.target.closest('a')) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    }, true);

    // garante que o último card realmente entre inteiro após resize/font/image load
    const refresh = () => go(index, false);
    addEventListener('resize', refresh, {passive:true});
    addEventListener('load', refresh, {once:true});
    setTimeout(refresh, 400);
    paint();
  });
})();
