(() => {
  const ready = fn => document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn) : fn();

  ready(() => {
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

      #topo .hero__title .rule{display:none!important}

      /* Processo: suaviza a entrada da imagem para não criar corte seco */
      .processo__hero{position:relative!important}
      .processo__hero::before{
        content:"";
        position:absolute;
        inset:0 0 auto 0;
        height:clamp(110px,14vw,210px);
        z-index:2;
        pointer-events:none;
        background:linear-gradient(to bottom,#000 0%,rgba(0,0,0,.92) 16%,rgba(0,0,0,.62) 44%,rgba(0,0,0,.22) 72%,rgba(0,0,0,0) 100%);
      }

      /* Processo: ignora completamente qualquer transform ligado ao scroll */
      .processo .marquee__track{
        animation:none!important;
        display:flex!important;
        width:max-content!important;
        will-change:transform!important;
        transform:translate3d(var(--process-loop-x,0px),0,0)!important;
      }
      .processo .marquee__group,
      .processo .marquee__group:nth-child(n+2){display:flex!important}
      .processo .marquee__group .shot:nth-child(n+9){display:none!important}
      .processo .zeph-timeline{display:none!important}
      @media(max-width:900px){
        .processo .marquee__group .shot:nth-child(n+7){display:none!important}
        .processo__hero::before{height:120px}
      }

      #topo.hero{
        position:relative!important;
        min-height:100svh;
        overflow:hidden!important;
        isolation:isolate;
        background:#000;
      }
      #topo.hero > .wrap{position:relative;z-index:3}
      .az-hero-video-layer{position:absolute;inset:0;z-index:0;pointer-events:none;overflow:hidden;background:#000}
      .az-hero-video{position:absolute;inset:0;width:100%!important;height:100%!important;max-width:none!important;object-fit:cover;object-position:center center;opacity:0;transform:scale(1.025);filter:saturate(.85) contrast(1.04);transition:opacity 1.2s ease}
      .az-hero-video.is-ready{opacity:.50}
      .az-hero-video-layer::before{content:"";position:absolute;inset:0;z-index:2;pointer-events:none;background:linear-gradient(to bottom,rgba(0,0,0,.92) 0%,rgba(0,0,0,.18) 21%,rgba(0,0,0,.08) 48%,rgba(0,0,0,.22) 72%,#000 100%),linear-gradient(to right,#000 0%,rgba(0,0,0,.35) 14%,rgba(0,0,0,.06) 34%,rgba(0,0,0,.06) 66%,rgba(0,0,0,.35) 86%,#000 100%),radial-gradient(ellipse at center,rgba(0,0,0,0) 0%,rgba(0,0,0,.06) 28%,rgba(0,0,0,.36) 62%,rgba(0,0,0,.92) 100%)}
      .az-hero-video-layer::after{content:"";position:absolute;inset:0;z-index:3;pointer-events:none;box-shadow:inset 0 0 180px 80px rgba(0,0,0,.82)}
      @media(max-width:900px){#topo.hero{min-height:auto}.az-hero-video{transform:scale(1.08)}.az-hero-video-layer::after{box-shadow:inset 0 0 110px 42px rgba(0,0,0,.86)}}
    `;
    document.head.appendChild(style);

    document.querySelectorAll('img').forEach(img => {
      if (!img.closest('#topo') && !img.closest('.header')) {
        img.loading = 'lazy'; img.decoding = 'async';
        try { img.fetchPriority = 'low'; } catch(e) {}
      } else img.decoding = 'async';
    });

    const HERO_VIDEO_URL = 'https://andersonzawa.com.br/wp-content/uploads/2026/09/Video-dobra-1.mp4';
    const hero = document.querySelector('#topo.hero');
    if (hero && !hero.querySelector('.az-hero-video-layer')) {
      const layer = document.createElement('div'); layer.className = 'az-hero-video-layer'; layer.setAttribute('aria-hidden','true');
      const video = document.createElement('video'); video.className = 'az-hero-video';
      video.autoplay = true; video.muted = true; video.defaultMuted = true; video.loop = true; video.playsInline = true; video.preload = 'metadata';
      video.setAttribute('autoplay',''); video.setAttribute('muted',''); video.setAttribute('loop',''); video.setAttribute('playsinline',''); video.setAttribute('webkit-playsinline','');
      video.tabIndex = -1; video.src = HERO_VIDEO_URL;
      const startVideo = () => { video.muted = true; video.defaultMuted = true; const p = video.play(); if (p && typeof p.catch === 'function') p.catch(() => {}); };
      video.addEventListener('loadeddata',() => { video.classList.add('is-ready'); startVideo(); },{once:true});
      video.addEventListener('canplay',() => { video.classList.add('is-ready'); startVideo(); },{once:true});
      layer.appendChild(video); hero.prepend(layer); requestAnimationFrame(startVideo);
      if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(entries => { const visible = entries[0]?.isIntersecting; if (visible) startVideo(); else video.pause(); },{threshold:.05});
        io.observe(hero);
      }
      document.addEventListener('visibilitychange',() => { if (!document.hidden && hero.getBoundingClientRect().bottom > 0) startVideo(); });
    }

    const whatsappMessage = 'Olá, Anderson! Vi seu site e gostaria de conversar sobre um projeto exclusivo para minha residência.';
    const whatsappUrl = 'https://wa.me/5514991324895?text=' + encodeURIComponent(whatsappMessage);
    document.querySelectorAll('.hero .btn--lg, .cta .btn--lg, .header__cta, .nav__cta').forEach(link => { link.href = whatsappUrl; link.target = '_blank'; link.rel = 'noopener noreferrer'; });

    document.querySelectorAll('.lang__btn').forEach(btn => {
      btn.addEventListener('click',() => {
        document.documentElement.classList.add('az-lang-changing');
        const heroEl = document.querySelector('#topo');
        const goTop = () => {
          if (window.__lenis && heroEl) window.__lenis.scrollTo(heroEl,{offset:0,duration:1.35,easing:t=>1-Math.pow(1-t,4)});
          else if (heroEl) heroEl.scrollIntoView({behavior:'smooth',block:'start'});
          else window.scrollTo({top:0,behavior:'smooth'});
        };
        requestAnimationFrame(goTop);
        setTimeout(() => document.documentElement.classList.remove('az-lang-changing'),360);
      },true);
    });

    /* Processo: loop automático independente do scroll */
    const processMarquee = document.querySelector('.processo .marquee');
    const processTrack = processMarquee?.querySelector('.marquee__track');
    if (processMarquee && processTrack) {
      const groups = [...processTrack.querySelectorAll('.marquee__group')];
      if (groups.length === 1) processTrack.appendChild(groups[0].cloneNode(true));
      processTrack.querySelectorAll('.marquee__group').forEach(g => { g.style.display = 'flex'; });
      let x = 0, speed = 36, targetSpeed = 36, last = performance.now(), loopWidth = 1;
      const measureLoop = () => { const first = processTrack.querySelector('.marquee__group'); if (!first) return; loopWidth = first.getBoundingClientRect().width; };
      const animateLoop = now => {
        const dt = Math.min(.05,(now-last)/1000); last = now;
        speed += (targetSpeed-speed) * Math.min(1,dt*5.5);
        x -= speed * dt;
        if (loopWidth > 1 && x <= -loopWidth) x += loopWidth;
        processTrack.style.setProperty('--process-loop-x', x + 'px');
        requestAnimationFrame(animateLoop);
      };
      processMarquee.addEventListener('mouseenter',() => { targetSpeed = 0; });
      processMarquee.addEventListener('mouseleave',() => { targetSpeed = 36; });
      processMarquee.addEventListener('focusin',() => { targetSpeed = 0; });
      processMarquee.addEventListener('focusout',() => { targetSpeed = 36; });
      addEventListener('resize',measureLoop,{passive:true});
      requestAnimationFrame(() => { measureLoop(); last = performance.now(); requestAnimationFrame(animateLoop); });
      setTimeout(measureLoop,500);
    }

    /* Projetos: inicia visualmente centralizado na sequência */
    const root = document.querySelector('#carousel-projetos');
    if (!root) return;
    const viewport = root.querySelector('.carousel__viewport');
    const track = root.querySelector('.carousel__track');
    const cards = [...root.querySelectorAll('.card')];
    const prev = root.querySelector('[data-dir="-1"]');
    const next = root.querySelector('[data-dir="1"]');
    const dots = root.querySelector('.dots');
    if (!viewport || !track || !cards.length) return;

    viewport.style.setProperty('padding-left','0','important');
    viewport.style.setProperty('padding-right','0','important');
    track.style.transform = 'none';

    const maxScroll = () => Math.max(0,viewport.scrollWidth-viewport.clientWidth);
    const applyCenterPadding = () => {
      const side = Math.max(18,(viewport.clientWidth-cards[0].offsetWidth)/2);
      track.style.setProperty('padding-left',side+'px','important');
      track.style.setProperty('padding-right',side+'px','important');
    };
    const initialIndex = Math.max(0,Math.floor((cards.length-1)/2));
    let index = initialIndex;
    function targetFor(i){
      i=Math.max(0,Math.min(i,cards.length-1));
      const card=cards[i];
      const target=card.offsetLeft-(viewport.clientWidth-card.offsetWidth)/2;
      return Math.max(0,Math.min(maxScroll(),target));
    }
    function paint(){if(prev)prev.disabled=false;if(next)next.disabled=false;if(dots)[...dots.querySelectorAll('button')].forEach((d,i)=>d.classList.toggle('is-active',i===index));}
    function go(i,smooth=true){if(i<0)i=cards.length-1;if(i>=cards.length)i=0;index=i;viewport.scrollTo({left:targetFor(index),behavior:smooth?'smooth':'auto'});paint();}
    root.addEventListener('click',e=>{const btn=e.target.closest('[data-dir]');if(!btn||!root.contains(btn))return;e.preventDefault();e.stopImmediatePropagation();go(index+Number(btn.dataset.dir||0));},true);
    if(dots)dots.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const all=[...dots.querySelectorAll('button')],i=all.indexOf(b);if(i>=0){e.preventDefault();e.stopImmediatePropagation();go(i);}},true);
    let down=false,sx=0,sl=0,moved=false;
    viewport.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0)return;if(e.target.closest('a.link-arrow')){down=false;moved=false;return;}down=true;moved=false;sx=e.clientX;sl=viewport.scrollLeft;viewport.setPointerCapture?.(e.pointerId);},true);
    viewport.addEventListener('pointermove',e=>{if(!down)return;const dx=e.clientX-sx;if(Math.abs(dx)>4)moved=true;viewport.scrollLeft=sl-dx;},true);
    const finish=()=>{if(!down)return;down=false;const center=viewport.scrollLeft+viewport.clientWidth/2;let best=0,bestDist=Infinity;cards.forEach((c,i)=>{const cc=c.offsetLeft+c.offsetWidth/2,d=Math.abs(cc-center);if(d<bestDist){bestDist=d;best=i;}});go(best);};
    viewport.addEventListener('pointerup',finish,true);viewport.addEventListener('pointercancel',finish,true);
    viewport.addEventListener('mousedown',e=>{if(e.target.closest('a.link-arrow'))e.stopImmediatePropagation();},true);
    viewport.addEventListener('touchstart',e=>{if(e.target.closest('a.link-arrow'))e.stopImmediatePropagation();},{capture:true,passive:true});
    root.addEventListener('click',e=>{const link=e.target.closest('a.link-arrow');if(!link||!root.contains(link))return;e.preventDefault();e.stopImmediatePropagation();const href=link.getAttribute('href');if(href)window.location.assign(href);},true);

    const centerInitial = () => {
      applyCenterPadding();
      index = initialIndex;
      viewport.scrollLeft = targetFor(initialIndex);
      paint();
    };
    addEventListener('resize',centerInitial,{passive:true});
    addEventListener('load',centerInitial,{once:true});
    requestAnimationFrame(() => requestAnimationFrame(centerInitial));
    setTimeout(centerInitial,250);
    setTimeout(centerInitial,800);
  });
})();
