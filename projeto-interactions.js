(()=>{
  const ready=fn=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn):fn();
  const load=src=>new Promise((ok,fail)=>{const s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=fail;document.head.appendChild(s)});
  ready(async()=>{
    try{await load('https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js')}catch(e){}

    let lenis=null;
    if(window.Lenis){
      if(window.__lenis&&typeof window.__lenis.destroy==='function') window.__lenis.destroy();
      lenis=new Lenis({
        lerp:.07,
        smoothWheel:true,
        wheelMultiplier:.72,
        touchMultiplier:1,
        syncTouch:false,
        infinite:false,
        overscroll:true
      });
      window.__lenis=lenis;
      const raf=t=>{lenis.raf(t);requestAnimationFrame(raf)};
      requestAnimationFrame(raf);
    }

    const header=document.querySelector('#header');let last=0;
    addEventListener('scroll',()=>{const y=scrollY,nav=document.querySelector('#nav');if(header){if(y>last&&y>220&&!nav?.classList.contains('is-open'))header.classList.add('is-hidden');else header.classList.remove('is-hidden')}last=y},{passive:true});

    const burger=document.querySelector('#burger'),nav=document.querySelector('#nav');
    if(burger&&nav){
      const close=()=>{nav.classList.remove('is-open');burger.setAttribute('aria-expanded','false')};
      burger.addEventListener('click',()=>{const open=nav.classList.toggle('is-open');burger.setAttribute('aria-expanded',String(open))});
      nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
    }

    const list=document.querySelector('.nav__list');
    if(list){const links=[...list.querySelectorAll('.nav__link')],hi=document.createElement('span');hi.className='nav-highlight';list.appendChild(hi);let active=list.querySelector('.nav__link.is-active')||links[0];const move=el=>{if(!el)return;const r=el.getBoundingClientRect(),m=list.getBoundingClientRect();hi.style.width=r.width+'px';hi.style.height=r.height+'px';hi.style.transform=`translate(${r.left-m.left}px,${r.top-m.top}px)`;hi.classList.add('is-visible')};move(active);links.forEach(a=>{a.addEventListener('mouseenter',()=>move(a));a.addEventListener('mouseleave',()=>move(active));a.addEventListener('click',()=>{links.forEach(x=>x.classList.remove('is-active'));a.classList.add('is-active');active=a;move(active)})});addEventListener('resize',()=>move(active))}

    if(matchMedia('(pointer:fine)').matches){const c=document.createElement('div');c.className='zeph-cursor';document.body.appendChild(c);let x=innerWidth/2,y=innerHeight/2,cx=x,cy=y;addEventListener('mousemove',e=>{x=e.clientX;y=e.clientY},{passive:true});addEventListener('mousedown',()=>c.classList.add('is-down'));addEventListener('mouseup',()=>c.classList.remove('is-down'));const tick=()=>{cx+=(x-cx)*.24;cy+=(y-cy)*.24;c.style.transform=`translate(${cx}px,${cy}px) translate(-50%,-50%)`;requestAnimationFrame(tick)};tick();document.querySelectorAll('a,button,.spec,.gallery-project figure,.faq-item').forEach(el=>{el.addEventListener('mouseenter',()=>c.classList.add('is-hover'));el.addEventListener('mouseleave',()=>c.classList.remove('is-hover'))})}
  });
})();
