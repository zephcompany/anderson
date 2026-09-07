(() => {
  const init = () => {
    const proc = document.querySelector('.processo');
    const marquee = proc?.querySelector('.marquee');
    const track = proc?.querySelector('.marquee__track');
    const progress = proc?.querySelector('.zeph-timeline__progress');
    if (!proc || !marquee || !track) return;

    let start = 0;
    let end = 1;
    let maxX = 0;
    let raf = 0;

    const measure = () => {
      const prev = track.style.transform;
      track.style.transform = 'translate3d(0,0,0)';
      const rect = marquee.getBoundingClientRect();
      const pageTop = window.scrollY + rect.top;

      start = pageTop - innerHeight * 0.68;
      end = pageTop + Math.max(innerHeight * 1.1, marquee.offsetHeight * 1.15);

      // Usa a largura REAL do conteúdo. Assim o último projeto entra inteiro na tela.
      maxX = Math.max(0, track.scrollWidth - marquee.clientWidth);
      track.style.transform = prev;
      update();
    };

    const update = () => {
      raf = 0;
      const p = Math.max(0, Math.min(1, (window.scrollY - start) / Math.max(1, end - start)));
      const x = -maxX * p;
      track.style.transform = `translate3d(${x}px,0,0)`;
      if (progress) progress.style.width = `${p * 100}%`;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', measure, { passive: true });

    requestAnimationFrame(measure);
    setTimeout(measure, 250);
    setTimeout(measure, 900);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(init, 50));
  else setTimeout(init, 50);
})();
