(() => {
  const ready = fn => document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn) : fn();
  const load = src => new Promise((ok,fail)=>{const s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=fail;document.head.appendChild(s)});

  ready(async()=>{
    try{
      await load('https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/dist/lenis.min.js');
      await load('https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js');
      await load('https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js');
    }catch(e){console.warn('libs',e)}

    /* texto/prova social */
    const proofText = document.querySelector('.proof__text');
    if(proofText) proofText.innerHTML = '+ de 50 <strong>Projetos entregues no Brasil e no exterior.</strong>';

    /* Lenis integrado ao ticker do GSAP para evitar travadas/double RAF */
    let lenis = null;
    if(window.Lenis){
      lenis = new Lenis({
        lerp:0.085,
        smoothWheel:true,
        wheelMultiplier:0.9,
        touchMultiplier:1,
        syncTouch:false
      });
      window.__lenis = lenis;

      if(window.gsap){
        gsap.ticker.add(time => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
      }else{
        const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
        requestAnimationFrame(raf);
      }

      if(window.ScrollTrigger) lenis.on('scroll', ScrollTrigger.update);

      document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
        const href = a.getAttribute('href');
        if(!href || href === '#') return;
        const el = document.querySelector(href);
        if(el){e.preventDefault();lenis.scrollTo(el,{offset:-110});}
      }));
    }

    /* cursor */
    if(matchMedia('(pointer:fine)').matches){
      const c=document.createElement('div');c.className='zeph-cursor';document.body.appendChild(c);
      let x=innerWidth/2,y=innerHeight/2,cx=x,cy=y;
      addEventListener('mousemove',e=>{x=e.clientX;y=e.clientY});
      const tick=()=>{cx+=(x-cx)*.18;cy+=(y-cy)*.18;c.style.transform=`translate(${cx}px,${cy}px) translate(-50%,-50%)`;requestAnimationFrame(tick)};tick();
      document.querySelectorAll('a,button,.shot,.card').forEach(el=>{el.addEventListener('mouseenter',()=>c.classList.add('is-hover'));el.addEventListener('mouseleave',()=>c.classList.remove('is-hover'))});
    }

    /* menu highlight */
    const list=document.querySelector('.nav__list');
    if(list){
      const links=[...list.querySelectorAll('.nav__link')],hi=document.createElement('span');
      hi.className='nav-highlight';list.appendChild(hi);
      let active=list.querySelector('.nav__link.is-active')||links[0];
      const move=el=>{if(!el)return;const r=el.getBoundingClientRect(),m=list.getBoundingClientRect();hi.style.width=r.width+'px';hi.style.height=r.height+'px';hi.style.transform=`translate(${r.left-m.left}px,${r.top-m.top}px)`;hi.classList.add('is-visible')};
      move(active);
      links.forEach(a=>{a.addEventListener('mouseenter',()=>move(a));a.addEventListener('click',()=>{links.forEach(x=>x.classList.remove('is-active'));a.classList.add('is-active');active=a;move(active)})});
      list.addEventListener('mouseleave',()=>move(active));addEventListener('resize',()=>move(active));
      const sections=links.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
      const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){const a=links.find(x=>x.getAttribute('href')==='#'+e.target.id);if(a){links.forEach(x=>x.classList.remove('is-active'));a.classList.add('is-active');active=a;move(a)}}}),{rootMargin:'-42% 0px -50% 0px'});
      sections.forEach(s=>io.observe(s));
    }

    /* GSAP */
    if(window.gsap&&window.ScrollTrigger){
      gsap.registerPlugin(ScrollTrigger);
      document.querySelectorAll('.reveal').forEach(el=>gsap.fromTo(el,{autoAlpha:0,y:44,filter:'blur(8px)',scale:.985},{autoAlpha:1,y:0,filter:'blur(0px)',scale:1,duration:.95,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%',once:true}}));
      document.querySelectorAll('h1,h2,.eyebrow').forEach(el=>{if(!el.closest('.reveal'))gsap.from(el,{autoAlpha:0,y:28,filter:'blur(6px)',duration:.85,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 90%',once:true}})});

      const proc=document.querySelector('.processo'),marquee=proc?.querySelector('.marquee'),track=proc?.querySelector('.marquee__track');
      if(proc&&marquee&&track){
        const oldTimeline = proc.querySelector('.zeph-timeline');
        if(oldTimeline) oldTimeline.remove();
        const tl=document.createElement('div');tl.className='zeph-timeline';tl.innerHTML='<span>Projetos</span><div class="zeph-timeline__line"><div class="zeph-timeline__progress"></div></div><span>Brasil + exterior</span>';
        marquee.insertAdjacentElement('afterend',tl);
        const progress=tl.querySelector('.zeph-timeline__progress'),dist=()=>Math.max(0,track.scrollWidth-innerWidth+80);
        gsap.to(track,{x:()=>-dist(),ease:'none',scrollTrigger:{trigger:marquee,start:'center center',end:()=>'+='+(dist()+innerHeight*.35),scrub:0.65,pin:true,anticipatePin:1,invalidateOnRefresh:true,onUpdate:self=>progress.style.width=(self.progress*100)+'%'}});
        requestAnimationFrame(()=>ScrollTrigger.refresh());
      }
    }

    /* idioma */
    const dict={'Sobre':'About','Projetos':'Projects','Processo':'Process','Depoimentos':'Testimonials','Contato':'Contact','Quero um projeto exclusivo':'I want an exclusive project','Agendar uma demonstração':'Schedule a consultation','// SOBRE MIM':'// ABOUT ME','O estúdio':'The studio','// PROJETOS':'// PROJECTS','Projetos selecionados':'Selected projects','// DO PRIMEIRO TRAÇO AO CANTEIRO DE OBRA':'// FROM FIRST SKETCH TO CONSTRUCTION','Um processo claro, perto ou longe.':'A clear process, near or far.','Atendimento em todo o Brasil.':'Service throughout Brazil.','Confiança à distância.':'Trust from anywhere.','// evite prejuízo':'// avoid waste','+ de 50':'50+','Projetos entregues no Brasil e no exterior.':'Projects delivered in Brazil and abroad.'};
    const els=[...document.querySelectorAll('a,button,h1,h2,h3,p,.eyebrow,.stat__label,.proof__text')],orig=new WeakMap();
    els.forEach(el=>orig.set(el,el.innerHTML));
    const apply=lang=>{
      document.documentElement.lang=lang==='en'?'en':'pt-BR';
      els.forEach(el=>{
        if(lang==='pt'){el.innerHTML=orig.get(el);return}
        let h=orig.get(el);
        Object.entries(dict).forEach(([pt,en])=>h=h.split(pt).join(en));
        h=h.replace('Arquitetura autoral para quem não quer morar em um projeto repetido.','Signature architecture for those who refuse a repeated design.').replace('Do conceito à obra, cada residência nasce de uma ideia nova.','From concept to construction, every residence begins with a new idea.').replace('O processo é o mesmo, perto ou longe: reuniões marcadas, etapas claras e tudo registrado em contrato.','The process is the same, near or far: scheduled meetings, clear stages and everything documented in contract.').replace('Um bom projeto não é custo.','A great project is not a cost.').replace('É o que <em>evita desperdício</em> na obra e valoriza cada metro construído.','It <em>prevents waste</em> during construction and adds value to every built square meter.');
        el.innerHTML=h;
      });
      document.querySelectorAll('.lang__btn').forEach(b=>{const on=b.dataset.lang===lang;b.classList.toggle('is-active',on);b.setAttribute('aria-pressed',on?'true':'false')});
      localStorage.setItem('az-lang',lang);
    };
    document.querySelectorAll('.lang__btn').forEach(b=>b.addEventListener('click',()=>apply(b.dataset.lang)));
    apply(localStorage.getItem('az-lang')||'pt');
  });
})();
