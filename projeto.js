(() => {
  const qs = new URLSearchParams(location.search);
  const slug = qs.get('slug') || 'rf-house';

  const projects = {
    'rf-house': {
      titleA:'RF', titleB:'House', location:'Brasília DF', image:'assets/projeto-1.png',
      tagline:'Com uma fachada surpreendente e espaços generosos para lazer e convivência.',
      description:'Com uma fachada surpreendente e espaços generosos para lazer e convivência, esta residência traduz o equilíbrio perfeito entre luxo, conforto e personalidade.',
      gallery:['assets/projeto-1.png','assets/galeria-01.png','assets/galeria-02.png','assets/galeria-03.png','assets/galeria-04.png','assets/galeria-05.png','assets/galeria-06.png','assets/galeria-07.png','assets/galeria-08.png'],
      area:'Sob consulta', land:'Residencial', status:'Projeto autoral'
    },
    'marea-house': {
      titleA:'Marea', titleB:'House', location:'Balneário Camboriú SC', image:'assets/projeto-2.png',
      tagline:'Arquitetura marcante, ambientes amplos e conexão entre design, natureza e qualidade de vida.',
      description:'Pensada para quem valoriza exclusividade e bem-estar, esta residência traduz a essência do alto padrão por meio de uma arquitetura marcante, ambientes amplos e uma conexão harmoniosa entre design, natureza e qualidade de vida.',
      gallery:['assets/projeto-2.png','assets/galeria-03.png','assets/galeria-04.png','assets/galeria-05.png','assets/galeria-06.png','assets/galeria-07.png','assets/galeria-08.png','assets/galeria-09.png','assets/galeria-10.png'],
      area:'Sob consulta', land:'Residencial', status:'Projeto autoral'
    },
    'casa-florenca': {
      titleA:'Casa', titleB:'Florença', location:'Uberlândia MG', image:'assets/projeto-3.png',
      tagline:'Uma fachada de personalidade marcante e linguagem contemporânea.',
      description:'Uma fachada de personalidade marcante e linguagem contemporânea, criada para transformar a identidade do cliente em arquitetura. O terceiro projeto desenvolvido para uma parceria construída com confiança e exclusividade.',
      gallery:['assets/projeto-3.png','assets/galeria-05.png','assets/galeria-06.png','assets/galeria-07.png','assets/galeria-08.png','assets/galeria-09.png','assets/galeria-10.png','assets/galeria-11.png','assets/galeria-12.png'],
      area:'Sob consulta', land:'Residencial', status:'Projeto autoral'
    },
    'villa-vrabel': {
      titleA:'Villa', titleB:'Vrabel', location:'Eslováquia', image:'assets/projeto-4.png',
      tagline:'Um projeto internacional que leva a linguagem do estúdio para fora do Brasil.',
      description:'Projeto internacional que leva a linguagem do estúdio para fora do Brasil, com volumes contidos, materiais nobres e uma implantação que responde ao clima e à paisagem local.',
      gallery:['assets/projeto-4.png','assets/galeria-07.png','assets/galeria-08.png','assets/galeria-09.png','assets/galeria-10.png','assets/galeria-11.png','assets/galeria-12.png','assets/galeria-01.png','assets/galeria-02.png'],
      area:'Sob consulta', land:'Residencial', status:'Projeto internacional'
    }
  };

  const p = projects[slug] || projects['rf-house'];
  document.title = `${p.titleA} ${p.titleB} — Anderson Zawa`;
  const setText=(sel,val)=>{const el=document.querySelector(sel);if(el)el.textContent=val};
  setText('[data-title-a]',p.titleA);setText('[data-title-b]',p.titleB);setText('[data-location]',p.location);setText('[data-tagline]',p.tagline);setText('[data-description]',p.description);setText('[data-area]',p.area);setText('[data-land]',p.land);setText('[data-status]',p.status);
  const hero=document.querySelector('[data-hero]'); if(hero) hero.src=p.image;
  document.querySelectorAll('[data-gallery]').forEach((img,i)=>img.src=p.gallery[i%p.gallery.length]);

  document.querySelectorAll('.faq-item').forEach(item=>{
    item.querySelector('.faq-q')?.addEventListener('click',()=>{
      const was=item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(x=>{x.classList.remove('open');const a=x.querySelector('.faq-a');if(a)a.style.maxHeight='0px'});
      if(!was){item.classList.add('open');const a=item.querySelector('.faq-a');if(a)a.style.maxHeight=a.scrollHeight+'px'}
    });
  });

  const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
})();
