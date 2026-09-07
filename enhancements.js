(() => {
  const ready = fn => document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn) : fn();
  const load = src => new Promise((ok,fail)=>{const s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=fail;document.head.appendChild(s)});

  ready(async()=>{
    try{
      await load('https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js');
      await load('https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js');
      await load('https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js');
    }catch(e){console.warn('libs',e)}

    const proofText=document.querySelector('.proof__text');
    if(proofText) proofText.innerHTML='+ de 50 <strong>Projetos entregues no Brasil e no exterior.</strong>';

    let lenis=null;
    if(window.Lenis){
      lenis=new Lenis({lerp:0.075,smoothWheel:true,wheelMultiplier:0.82,touchMultiplier:1,syncTouch:false,infinite:false,overscroll:true});
      window.__lenis=lenis;
      if(window.gsap){gsap.ticker.add(time=>lenis.raf(time*1000));gsap.ticker.lagSmoothing(0)}
      else{const raf=time=>{lenis.raf(time);requestAnimationFrame(raf)};requestAnimationFrame(raf)}
      if(window.ScrollTrigger) lenis.on('scroll',ScrollTrigger.update);
    }

    document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
      const href=a.getAttribute('href');if(!href||href==='#')return;const el=document.querySelector(href);if(el){e.preventDefault();if(lenis)lenis.scrollTo(el,{offset:-110,duration:1.15});else window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY-110,behavior:'smooth'})}
    }));

    if(matchMedia('(pointer:fine)').matches){
      const c=document.createElement('div');c.className='zeph-cursor';document.body.appendChild(c);let x=innerWidth/2,y=innerHeight/2,cx=x,cy=y;
      addEventListener('mousemove',e=>{x=e.clientX;y=e.clientY},{passive:true});addEventListener('mousedown',()=>c.classList.add('is-down'));addEventListener('mouseup',()=>c.classList.remove('is-down'));
      const tick=()=>{cx+=(x-cx)*.24;cy+=(y-cy)*.24;c.style.transform=`translate(${cx}px,${cy}px) translate(-50%,-50%)`;requestAnimationFrame(tick)};tick();
      document.querySelectorAll('a,button,.shot,.card,.stat,.reel,.faq__item').forEach(el=>{el.addEventListener('mouseenter',()=>c.classList.add('is-hover'));el.addEventListener('mouseleave',()=>c.classList.remove('is-hover'))});
    }

    const list=document.querySelector('.nav__list');
    if(list){const links=[...list.querySelectorAll('.nav__link')],hi=document.createElement('span');hi.className='nav-highlight';list.appendChild(hi);let active=list.querySelector('.nav__link.is-active')||links[0];const move=el=>{if(!el)return;const r=el.getBoundingClientRect(),m=list.getBoundingClientRect();hi.style.width=r.width+'px';hi.style.height=r.height+'px';hi.style.transform=`translate(${r.left-m.left}px,${r.top-m.top}px)`;hi.classList.add('is-visible')};move(active);links.forEach(a=>{a.addEventListener('mouseenter',()=>move(a));a.addEventListener('click',()=>{links.forEach(x=>x.classList.remove('is-active'));a.classList.add('is-active');active=a;move(active)})});list.addEventListener('mouseleave',()=>move(active));addEventListener('resize',()=>move(active))}

    if(window.gsap&&window.ScrollTrigger){
      gsap.registerPlugin(ScrollTrigger);
      document.querySelectorAll('.reveal').forEach(el=>gsap.fromTo(el,{autoAlpha:0,y:36,filter:'blur(6px)',scale:.99},{autoAlpha:1,y:0,filter:'blur(0px)',scale:1,duration:.82,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 90%',once:true}}));
      const extraSelectors=['.ticker','.sobre__media','.sobre__text','.stat','.sec-head','.project-card','.project','.step','.processo__note','.reel','.cta__card','.faq__item','.footer__inner','.footer__bottom'];
      const animated=new Set();extraSelectors.forEach(sel=>document.querySelectorAll(sel).forEach((el,i)=>{if(animated.has(el)||el.classList.contains('reveal'))return;animated.add(el);el.classList.add('zeph-enter');gsap.from(el,{autoAlpha:0,y:34,filter:'blur(7px)',scale:.985,duration:.9,delay:Math.min(i*.035,.14),ease:'power3.out',scrollTrigger:{trigger:el,start:'top 91%',once:true}})}));
      document.querySelectorAll('section').forEach(section=>{const targets=[...section.querySelectorAll(':scope > .wrap > h1,:scope > .wrap > h2,:scope > .wrap > p,:scope > .wrap > .eyebrow')];targets.forEach((el,i)=>{if(animated.has(el)||el.classList.contains('reveal'))return;animated.add(el);gsap.from(el,{autoAlpha:0,y:28,filter:'blur(6px)',duration:.82,delay:i*.04,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 92%',once:true}})})});

      const proc=document.querySelector('.processo'),marquee=proc?.querySelector('.marquee'),track=proc?.querySelector('.marquee__track');
      if(proc&&marquee&&track){
        proc.querySelector('.zeph-timeline')?.remove();
        const tl=document.createElement('div');tl.className='zeph-timeline';tl.innerHTML='<span>Projetos</span><div class="zeph-timeline__line"><div class="zeph-timeline__progress"></div></div><span>Brasil + exterior</span>';
        marquee.appendChild(tl);
        const progress=tl.querySelector('.zeph-timeline__progress');
        const dist=()=>Math.max(0,track.scrollWidth-innerWidth+80);
        gsap.to(track,{x:()=>-dist(),ease:'none',scrollTrigger:{trigger:marquee,start:'center center',end:()=>'+='+(dist()+innerHeight*.18),scrub:.4,pin:true,anticipatePin:1,invalidateOnRefresh:true,onUpdate:self=>{progress.style.width=(self.progress*100)+'%'}}});
      }
      requestAnimationFrame(()=>ScrollTrigger.refresh());
    }

    const dict={'Sobre':'About','Projetos':'Projects','Processo':'Process','Depoimentos':'Testimonials','Contato':'Contact','Quero um projeto exclusivo':'I want an exclusive project','Agendar uma demonstração':'Schedule a consultation','// SOBRE MIM':'// ABOUT ME','O estúdio':'The studio','// PROJETOS':'// PROJECTS','Projetos selecionados':'Selected projects','// DO PRIMEIRO TRAÇO AO CANTEIRO DE OBRA':'// FROM FIRST SKETCH TO CONSTRUCTION','Um processo claro, perto ou longe.':'A clear process, near or far.','Atendimento em todo o Brasil.':'Service throughout Brazil.','Confiança à distância.':'Trust from anywhere.','// evite prejuízo':'// avoid waste','+ de 50':'50+','Projetos entregues no Brasil e no exterior.':'Projects delivered in Brazil and abroad.'};
    const els=[...document.querySelectorAll('a,button,h1,h2,h3,p,.eyebrow,.stat__label,.proof__text')],orig=new WeakMap();els.forEach(el=>orig.set(el,el.innerHTML));
    const apply=lang=>{document.documentElement.lang=lang==='en'?'en':'pt-BR';els.forEach(el=>{if(lang==='pt'){el.innerHTML=orig.get(el);return}let h=orig.get(el);Object.entries(dict).forEach(([pt,en])=>h=h.split(pt).join(en));el.innerHTML=h});document.querySelectorAll('.lang__btn').forEach(b=>{const on=b.dataset.lang===lang;b.classList.toggle('is-active',on);b.setAttribute('aria-pressed',on?'true':'false')});localStorage.setItem('az-lang',lang)};
    document.querySelectorAll('.lang__btn').forEach(b=>b.addEventListener('click',()=>apply(b.dataset.lang)));apply(localStorage.getItem('az-lang')||'pt');
  });
})();
