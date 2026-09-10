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
      lenis=new Lenis({lerp:0.085,smoothWheel:true,wheelMultiplier:0.86,touchMultiplier:1,syncTouch:false,infinite:false,overscroll:true});
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
    }

    const proc=document.querySelector('.processo'),marquee=proc?.querySelector('.marquee'),track=proc?.querySelector('.marquee__track');
    if(proc&&marquee&&track){
      proc.querySelector('.zeph-timeline')?.remove();
      const tl=document.createElement('div');tl.className='zeph-timeline';tl.innerHTML='<span data-timeline-start>Projetos</span><div class="zeph-timeline__line"><div class="zeph-timeline__progress"></div></div><span data-timeline-end>Brasil + exterior</span>';
      marquee.appendChild(tl);
      const progressBar=tl.querySelector('.zeph-timeline__progress');
      let start=0,end=1,maxX=0;
      const measure=()=>{
        track.style.transform='translate3d(0,0,0)';
        const rect=marquee.getBoundingClientRect();
        const top=window.scrollY+rect.top;
        start=top-innerHeight*.72;
        end=top+Math.max(innerHeight*.9,marquee.offsetHeight*.85);
        maxX=Math.max(0,Math.min(track.scrollWidth-innerWidth+40,innerWidth*1.45));
        updateHorizontal();
      };
      const updateHorizontal=()=>{
        const p=Math.max(0,Math.min(1,(window.scrollY-start)/Math.max(1,end-start)));
        track.style.transform=`translate3d(${-maxX*p}px,0,0)`;
        progressBar.style.width=`${p*100}%`;
      };
      addEventListener('scroll',updateHorizontal,{passive:true});
      addEventListener('resize',measure,{passive:true});
      requestAnimationFrame(measure);
      setTimeout(measure,300);
    }

    const copy = [
      ['.skip','Ir para o conteúdo','Skip to content'],
      ['.nav__link[href="#topo"]','Home','Home'],
      ['.nav__link[href="#projetos"]','Projetos','Projects'],
      ['.nav__link[href="#contato"]','Contato','Contact'],
      ['.nav__cta','Agendar uma demonstração','Schedule a consultation'],
      ['.header__cta','Agendar uma demonstração','Schedule a consultation'],
      ['.hero__title h1','Casas que só existem <em>uma vez.</em>','Homes that exist <em>only once.</em>'],
      ['.hero__lead','Arquitetura autoral para quem não quer morar em um projeto repetido. <strong>Do conceito à obra, cada residência nasce de uma ideia nova.</strong>','Signature architecture for those who do not want to live in a repeated design. <strong>From concept to construction, every residence begins with a new idea.</strong>'],
      ['.hero .btn--lg','<img class="btn__icon" src="https://zephcompany.github.io/anderson/assets/btn-icon.svg?v=20260907-0247" alt="" width="39" height="21"> Quero um projeto exclusivo','<img class="btn__icon" src="https://zephcompany.github.io/anderson/assets/btn-icon.svg?v=20260907-0247" alt="" width="39" height="21"> I want an exclusive project'],
      ['.proof__text','+ de 50 <strong>Projetos entregues no Brasil e no exterior.</strong>','50+ <strong>Projects delivered in Brazil and abroad.</strong>'],
      ['.ticker .pill:nth-of-type(1)','CONCEITO','CONCEPT'],
      ['.ticker .pill:nth-of-type(2)','PRECISÃO','PRECISION'],
      ['.ticker .pill:nth-of-type(3)','ATEMPORAL','TIMELESS'],
      ['.ticker__phrase','<b>Nenhuma fachada se repete,</b> porque nenhuma história se repete.','<b>No facade is repeated,</b> because no story is repeated.'],
      ['.ticker .pill:nth-of-type(4)','ARQUITETURA AUTORAL','SIGNATURE ARCHITECTURE'],
      ['.ticker .pill:nth-of-type(5)','IDENTIDADE','IDENTITY'],
      ['.ticker .pill:nth-of-type(6)','EXCLUSIVIDADE','EXCLUSIVITY'],
      ['.sobre .eyebrow','// SOBRE MIM','// ABOUT ME'],
      ['.sobre h2','O <em>estúdio</em>','The <em>studio</em>'],
      ['.sobre__copy p:nth-child(1)','Anderson Zawa projeta residências de médio e alto padrão para quem busca mais do que uma casa bonita: <strong>busca uma casa com identidade.</strong>','Anderson Zawa designs mid to high-end residences for people looking for more than a beautiful house: <strong>they want a home with identity.</strong>'],
      ['.sobre__copy p:nth-child(2)','Projeto arquitetônico e de interiores, imagens 3D realistas para você enxergar a casa antes dela existir, e projeto executivo completo para o canteiro de obra.','Architectural and interior design, realistic 3D imagery so you can see the house before it exists, and a complete construction package for the job site.'],
      ['.stat:nth-child(1) .stat__label','Projetos autorais entregues','Signature projects delivered'],
      ['.stat:nth-child(2) .stat__label','Estados atendidos no Brasil','Brazilian states served'],
      ['.stat:nth-child(3) .stat__label','Países atendidos','Countries served'],
      ['.stat:nth-child(4) .stat__label','Projetos com conceito exclusivo','Projects with an exclusive concept'],
      ['.projetos .eyebrow','// PROJETOS SELECIONADOS','// SELECTED PROJECTS'],
      ['.projetos h2','Cada projeto, um <em>conceito novo.</em>','Every project, a <em>new concept.</em>'],
      ['.projetos .sec-head__desc','Uma seleção de residências autorais entre 3D realistas e obras entregues.','A selection of signature residences, from realistic 3D visuals to completed works.'],
      ['.card:nth-child(1) .card__info p','Com uma fachada surpreendente e espaços generosos para lazer e convivência, esta residência traduz o equilíbrio perfeito entre luxo, conforto e personalidade.','With a striking facade and generous spaces for leisure and gathering, this residence captures the perfect balance between luxury, comfort and personality.'],
      ['.card:nth-child(2) .card__info p','Pensada para quem valoriza exclusividade e bem-estar, esta residência traduz a essência do alto padrão por meio de uma arquitetura marcante, ambientes amplos e uma conexão harmoniosa entre design, natureza e qualidade de vida.','Designed for those who value exclusivity and well-being, this residence expresses the essence of high-end living through bold architecture, spacious interiors and a harmonious connection between design, nature and quality of life.'],
      ['.card:nth-child(3) .card__info p','Uma fachada de personalidade marcante e linguagem contemporânea, criada para transformar a identidade do cliente em arquitetura. O terceiro projeto desenvolvido para uma parceria construída com confiança e exclusividade.','A facade with a strong personality and contemporary language, created to turn the client’s identity into architecture. The third project developed within a partnership built on trust and exclusivity.'],
      ['.card:nth-child(4) .card__info p','Projeto internacional que leva a linguagem do estúdio para fora do Brasil, com volumes contidos, materiais nobres e uma implantação que responde ao clima e à paisagem local.','An international project that brings the studio’s design language beyond Brazil, with restrained volumes, refined materials and a layout that responds to the local climate and landscape.'],
      ['.processo .eyebrow','// DO PRIMEIRO TRAÇO AO CANTEIRO DE OBRA','// FROM THE FIRST SKETCH TO THE JOB SITE'],
      ['.processo h2','Um processo claro, <em>perto ou longe.</em>','A clear process, <em>near or far.</em>'],
      ['.step:nth-child(1) h3','Imersão','Discovery'],
      ['.step:nth-child(1) p','Conversa online ou presencial para entender terreno, rotina e estilo de vida da família.','An online or in-person conversation to understand the site, routine and the family’s lifestyle.'],
      ['.step:nth-child(2) h3','Conceito','Concept'],
      ['.step:nth-child(2) p','Estudo preliminar e imagens 3D realistas. Você enxerga sua casa antes dela existir.','Preliminary design and realistic 3D imagery. You see your home before it exists.'],
      ['.step:nth-child(3) h3','Executivo','Construction documents'],
      ['.step:nth-child(3) p','Detalhamento completo para a obra: plantas, cortes, especificações e interiores.','Complete construction detailing: plans, sections, specifications and interiors.'],
      ['.step:nth-child(4) h3','Obra','Construction'],
      ['.step:nth-child(4) p','Suporte à equipe de execução, em qualquer cidade do Brasil, do início ao fim.','Support for the construction team, anywhere in Brazil, from start to finish.'],
      ['.processo__note','<strong>Atendimento em todo o Brasil.</strong> O processo é o mesmo, perto ou longe: reuniões marcadas, etapas claras e tudo registrado em contrato.','<strong>Available throughout Brazil.</strong> The process is the same, near or far: scheduled meetings, clear stages and everything documented in the contract.'],
      ['.depoimentos .eyebrow','// QUEM JÁ CONSTRUIU COM O ESTÚDIO','// CLIENTS WHO HAVE BUILT WITH THE STUDIO'],
      ['.depoimentos h2','Confiança à <em>distância.</em>','Trust from <em>anywhere.</em>'],
      ['.reel:nth-child(1) .reel__meta p','Depoimento em vídeo','Video testimonial'],
      ['.reel:nth-child(2) .reel__meta p','Recebendo o 3D','Receiving the 3D design'],
      ['.reel:nth-child(3) .reel__meta p','Tour da obra pronta','Completed home tour'],
      ['.cta .eyebrow','// evite prejuízo','// AVOID WASTE'],
      ['.cta h2','Um bom projeto não é custo.<br>É o que <em>evita desperdício</em> na obra e valoriza cada metro construído.','A good design is not a cost.<br>It is what <em>prevents waste</em> during construction and adds value to every built square meter.'],
      ['.cta__note','Contrato claro, com etapas, prazos e entregas definidas por escrito. Você sabe exatamente o que recebe em cada fase.','A clear contract with stages, deadlines and deliverables defined in writing. You know exactly what you receive at every phase.'],
      ['.cta .btn--lg','<img class="btn__icon" src="https://zephcompany.github.io/anderson/assets/btn-icon.svg?v=20260907-0247" alt="" width="39" height="21"> Quero um projeto exclusivo','<img class="btn__icon" src="https://zephcompany.github.io/anderson/assets/btn-icon.svg?v=20260907-0247" alt="" width="39" height="21"> I want an exclusive project'],
      ['.faq .eyebrow','// PERGUNTAS FREQUENTES','// FREQUENTLY ASKED QUESTIONS'],
      ['.faq h2','Ainda em <em>dúvida?</em>','Still have <em>questions?</em>'],
      ['.acc:nth-child(1) .acc__head span','Vocês atendem minha cidade?','Do you work in my city?'],
      ['.acc:nth-child(1) .acc__panel p','Sim. O estúdio atende em todo o Brasil, com reuniões online, imagens 3D realistas e projeto executivo completo para a equipe de obra local.','Yes. The studio works throughout Brazil, with online meetings, realistic 3D imagery and a complete construction package for the local building team.'],
      ['.acc:nth-child(2) .acc__head span','O que está incluso no projeto?','What is included in the project?'],
      ['.acc:nth-child(2) .acc__panel p','Projeto arquitetônico completo, projeto de interiores, imagens 3D realistas e projeto executivo com plantas, cortes, detalhamentos e especificações para o canteiro de obra.','Complete architectural design, interior design, realistic 3D imagery and construction documents with plans, sections, details and specifications for the job site.'],
      ['.acc:nth-child(3) .acc__head span','Como funciona o contrato?','How does the contract work?'],
      ['.acc:nth-child(3) .acc__panel p','Contrato assinado antes do início, com etapas, prazos e entregas definidas por escrito. Você sabe exatamente o que recebe em cada fase e quando.','The contract is signed before work begins, with stages, deadlines and deliverables defined in writing. You know exactly what you receive at each phase and when.'],
      ['.acc:nth-child(4) .acc__head span','Quanto custa um projeto?','How much does a project cost?'],
      ['.acc:nth-child(4) .acc__panel p','O valor depende da área construída, do escopo e do nível de detalhamento. A proposta é enviada após a primeira conversa, já com as etapas e o cronograma.','The fee depends on the built area, scope and level of detail. A proposal is sent after the first conversation, including the project stages and schedule.'],
      ['.footer p','TODOS OS DIREITOS RESERVADOS','ALL RIGHTS RESERVED'],
      ['[data-timeline-start]','Projetos','Projects'],
      ['[data-timeline-end]','Brasil + exterior','Brazil + abroad']
    ];

    const linkArrowPT = 'Ver projeto <span aria-hidden="true">→</span>';
    const linkArrowEN = 'View project <span aria-hidden="true">→</span>';

    const attrs = [
      ['#nav','aria-label','Navegação principal','Main navigation'],
      ['.lang','aria-label','Idioma','Language'],
      ['#burger','aria-label','Abrir menu','Open menu'],
      ['.ticker','aria-label','Valores do estúdio','Studio values'],
      ['.dots','aria-label','Escolher projeto','Choose project'],
      ['[data-dir="-1"]','aria-label','Projeto anterior','Previous project'],
      ['[data-dir="1"]','aria-label','Próximo projeto','Next project'],
      ['.marquee','aria-label','Galeria de projetos','Project gallery'],
      ['.reel:nth-child(1) .reel__play','aria-label','Assistir: depoimento em vídeo','Watch: video testimonial'],
      ['.reel:nth-child(2) .reel__play','aria-label','Assistir: recebendo o 3D','Watch: receiving the 3D design'],
      ['.reel:nth-child(3) .reel__play','aria-label','Assistir: tour da obra pronta','Watch: completed home tour'],
      ['.modal__close','aria-label','Fechar','Close']
    ];

    const meta = {
      pt: {
        title:'Anderson Zawa — Arquitetura autoral',
        description:'Arquitetura autoral para quem não quer morar em um projeto repetido. Do conceito à obra, cada residência nasce de uma ideia nova. Atendimento em todo o Brasil.',
        ogTitle:'Anderson Zawa — Casas que só existem uma vez.',
        ogDescription:'Arquitetura autoral para quem não quer morar em um projeto repetido.'
      },
      en: {
        title:'Anderson Zawa — Signature Architecture',
        description:'Signature architecture for those who do not want to live in a repeated design. From concept to construction, every residence begins with a new idea. Available throughout Brazil.',
        ogTitle:'Anderson Zawa — Homes that exist only once.',
        ogDescription:'Signature architecture for those who do not want to live in a repeated design.'
      }
    };

    const setHTML=(selector,html)=>document.querySelectorAll(selector).forEach(el=>{el.innerHTML=html});
    const scrollToHero=()=>{
      const hero=document.querySelector('#topo');
      if(!hero)return;
      if(lenis){
        lenis.scrollTo(hero,{offset:0,duration:1.35,easing:t=>1-Math.pow(1-t,4)});
      }else{
        hero.scrollIntoView({behavior:'smooth',block:'start'});
      }
    };

    const apply=(lang,opts={})=>{
      lang=lang==='en'?'en':'pt';
      document.documentElement.lang=lang==='en'?'en':'pt-BR';
      copy.forEach(([selector,pt,en])=>{
        if(window.AZ_CMS_PRESENT && selector.startsWith('.card')) return;
        setHTML(selector,lang==='en'?en:pt);
      });
      document.querySelectorAll('.link-arrow').forEach(el=>el.innerHTML=lang==='en'?linkArrowEN:linkArrowPT);
      attrs.forEach(([selector,attr,pt,en])=>document.querySelectorAll(selector).forEach(el=>el.setAttribute(attr,lang==='en'?en:pt)));
      document.querySelectorAll('.shot img').forEach((img,i)=>img.alt=lang==='en'?`Signature project ${i+1}`:`Projeto autoral ${i+1}`);
      document.querySelectorAll('.lang__btn').forEach(b=>{
        const on=b.dataset.lang===lang;
        b.classList.toggle('is-active',on);
        b.setAttribute('aria-pressed',on?'true':'false');
      });
      const m=meta[lang];
      document.title=m.title;
      const desc=document.querySelector('meta[name="description"]');if(desc)desc.content=m.description;
      const ogTitle=document.querySelector('meta[property="og:title"]');if(ogTitle)ogTitle.content=m.ogTitle;
      const ogDesc=document.querySelector('meta[property="og:description"]');if(ogDesc)ogDesc.content=m.ogDescription;
      localStorage.setItem('az-lang',lang);
      document.dispatchEvent(new CustomEvent('az:language-applied',{detail:{lang}}));
      if(opts.scrollTop){requestAnimationFrame(()=>scrollToHero());}
    };

    document.querySelectorAll('.lang__btn').forEach(b=>b.addEventListener('click',()=>apply(b.dataset.lang,{scrollTop:true})));
    apply(localStorage.getItem('az-lang')||'pt');
  });
})();
