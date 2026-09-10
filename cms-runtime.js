(() => {
  if(window.AZ_CMS_FALLBACK)return;
  window.AZ_CMS_STARTED=true;
  const script=document.currentScript;
  const origin=script.dataset.cmsApi||new URL(script.src).origin;
  const editing=new URLSearchParams(location.search).get('editor')==='1'&&location.origin===origin&&parent!==window;
  const previewOnly=new URLSearchParams(location.search).get('preview')==='1';
  const base='https://zephcompany.github.io/anderson/';
  const asset=p=>/^https:\/\//.test(p)?p:base+p.replace(/^\//,'');
  let content,lang='pt';
  const projectTranslations = {
  "Sob consulta": "On request",
  "Residencial": "Residential",
  "Projeto autoral": "Signature design",
  "Projeto internacional": "International project",
  "Eslováquia": "Slovakia",
  "Com uma fachada surpreendente e espaços generosos para lazer e convivência.": "With a striking facade and generous spaces for leisure and gathering.",
  "Com uma fachada surpreendente e espaços generosos para lazer e convivência, esta residência traduz o equilíbrio perfeito entre luxo, conforto e personalidade.": "With a striking facade and generous spaces for leisure and gathering, this residence captures the perfect balance between luxury, comfort and personality.",
  "Arquitetura marcante, ambientes amplos e conexão entre design, natureza e qualidade de vida.": "Distinctive architecture, spacious interiors, and a connection between design, nature and quality of life.",
  "Pensada para quem valoriza exclusividade e bem-estar, esta residência traduz a essência do alto padrão por meio de uma arquitetura marcante, ambientes amplos e uma conexão harmoniosa entre design, natureza e qualidade de vida.": "Designed for those who value exclusivity and well-being, this residence expresses the essence of high-end living through bold architecture, spacious interiors and a harmonious connection between design, nature and quality of life.",
  "Uma fachada de personalidade marcante e linguagem contemporânea.": "A facade with a strong personality and contemporary design.",
  "Uma fachada de personalidade marcante e linguagem contemporânea, criada para transformar a identidade do cliente em arquitetura. O terceiro projeto desenvolvido para uma parceria construída com confiança e exclusividade.": "A facade with a strong personality and contemporary design, created to turn the client’s identity into architecture. The third project developed within a partnership built on trust and exclusivity.",
  "Um projeto internacional que leva a linguagem do estúdio para fora do Brasil.": "An international project that brings the studio’s design approach beyond Brazil.",
  "Projeto internacional que leva a linguagem do estúdio para fora do Brasil, com volumes contidos, materiais nobres e uma implantação que responde ao clima e à paisagem local.": "An international project that brings the studio’s design approach beyond Brazil, with restrained volumes, refined materials and a layout that responds to the local climate and landscape."
};
  const localizeProject = (project, language) => {
    if (language !== 'en') return project;
    const translated = {...project};
    ['title','location','tagline','description','area','land','status'].forEach(key => {
      translated[key] = project.en?.[key] || projectTranslations[project[key]] || project[key];
    });
    return translated;
  };

  const notify=data=>{if(editing)parent.postMessage(data,location.origin)};
  const clean=html=>{const t=document.createElement('template');t.innerHTML=html;const visit=root=>[...root.children].forEach(el=>{visit(el);if(!['EM','STRONG','B','I','BR'].includes(el.tagName))el.replaceWith(...el.childNodes);else [...el.attributes].forEach(a=>el.removeAttribute(a.name))});visit(t.content);return t.innerHTML};
  const text=(tag,value,className)=>{const e=document.createElement(tag);e.textContent=value;if(className)e.className=className;return e};
  const image=(src,alt='')=>{const e=document.createElement('img');e.src=asset(src);e.alt=alt;e.loading='lazy';return e};
  function render(c,collections=true){
    content=c;
    c.fields.forEach(f=>document.querySelectorAll(f.selector).forEach(el=>{
      const value=lang==='en'?f.en:f.pt;
      if((lang==='pt'||value) && document.activeElement!==el)el.innerHTML=clean(value);
      if(editing){el.dataset.cmsField=f.id;el.title='Clique para editar o texto'}
    }));
    c.images.forEach(i=>document.querySelectorAll(i.selector).forEach(el=>{
      if(i.background){el.style.setProperty('background-image',`url("${asset(i.src).replace(/["\\]/g,'')}")`,'important')}
      else el.src=asset(i.src);
      if(editing)el.dataset.cmsImage=i.id;
    }));
    const video=document.querySelector('.az-hero-video');if(video&&video.src!==asset(c.settings.heroVideo)){video.src=asset(c.settings.heroVideo);video.load()}
    document.querySelectorAll('.hero .btn--lg,.cta .btn--lg,.header__cta,.nav__cta').forEach(a=>{a.href='https://wa.me/'+c.settings.whatsapp});
    document.title=c.settings.title;
    const description=document.querySelector('meta[name="description"]');if(description)description.content=c.settings.description;
    c.sections.forEach(s=>{const el=document.getElementById(s.id);if(el)el.hidden=!s.visible});
    const main=document.querySelector('main#conteudo');
    if(main){const existing=c.sections.map(s=>document.getElementById(s.id)).filter(Boolean);const anchor=document.createComment('cms-order');if(existing.length){main.insertBefore(anchor,existing[0]);existing.forEach(e=>{main.insertBefore(e,anchor);if(e.id==='topo'){const ticker=main.querySelector('.ticker');if(ticker)main.insertBefore(ticker,anchor)}if(e.id==='processo'){const divider=main.querySelector('.divisor');if(divider)main.insertBefore(divider,anchor)}});anchor.remove()}}
    if(collections){
      const track=document.querySelector('#carousel-projetos .carousel__track');
      if(track){track.replaceChildren(...c.projects.map(p=>{
        const card=text('li','','card');card.dataset.cmsProject=p.id;
        const media=text('div','','card__media');media.append(image(p.image,p.title));
        const info=text('div','','glass card__info');const h=text('h3',p.title+' ');h.append(text('span','— '+p.location));
        const link=text('a','Ver projeto →','link-arrow');link.href='projeto.html?slug='+encodeURIComponent(p.slug);
        info.append(h,text('p',p.description),link);card.append(media,info);return card;
      }))}
      const gallery=document.querySelector('.processo .marquee__track');
      if(gallery){const group=text('div','','marquee__group');group.append(...c.gallery.map(g=>{const b=text('button','','shot');b.type='button';b.dataset.full=asset(g.src);b.dataset.cmsGallery=g.id;b.append(image(g.src,g.alt));return b}));gallery.replaceChildren(group)}
      const reels=document.querySelector('.depoimentos .reels');
      if(reels){reels.replaceChildren(...c.testimonials.map(t=>{const item=text('li','','glass reel');const frame=document.createElement('iframe');let url=t.video;try{const u=new URL(url);if(u.hostname==='youtu.be')url='https://www.youtube.com/embed/'+u.pathname.slice(1);else if(u.searchParams.get('v'))url='https://www.youtube.com/embed/'+u.searchParams.get('v');else if(u.hostname==='vimeo.com')url='https://player.vimeo.com/video/'+u.pathname.slice(1)}catch{}frame.src=url;frame.title=t.title;frame.loading='lazy';frame.allowFullscreen=true;item.append(frame);return item}))}
    }
    document.querySelectorAll('[data-cms-project]').forEach(card=>{
      const original=c.projects.find(p=>p.id===card.dataset.cmsProject);if(!original)return;
      const p=localizeProject(original,lang);
      const heading=card.querySelector('h3');if(heading){heading.textContent=p.title+' ';heading.append(text('span','— '+p.location))}
      const description=card.querySelector('.card__info p');if(description)description.textContent=p.description;
      const link=card.querySelector('.link-arrow');if(link)link.textContent=lang==='en'?'View project →':'Ver projeto →';
    });
    const projectPage=document.querySelector('.project-page');
    if(projectPage){
      const slug=new URLSearchParams(location.search).get('slug');const p=localizeProject(c.projects.find(p=>p.slug===slug)||c.projects[0],lang);
      const parts=p.title.split(' ');const a=parts.shift();const b=parts.join(' ');
      const mapping={'[data-title-a]':a,'[data-title-b]':b,'[data-location]':p.location,'[data-area]':p.area,'[data-land]':p.land,'[data-status]':p.status,'[data-tagline]':p.tagline,'[data-description]':p.description};
      Object.entries(mapping).forEach(([selector,value])=>document.querySelectorAll(selector).forEach(el=>el.textContent=value));
      const hero=document.querySelector('[data-hero]');if(hero)hero.src=asset(p.image);
      const gallery=document.querySelector('.gallery-project');if(gallery){gallery.replaceChildren(...p.gallery.map(src=>{const fig=document.createElement('figure');const img=image(src,p.title);img.dataset.gallery='';fig.append(img);return fig}))}
      document.title=p.title+' — Anderson Zawa';
    }
  }
  async function legacy(){
    for(const old of document.querySelectorAll('script[type="text/anderson"]')){
      await new Promise(resolve=>{const el=document.createElement('script');if(old.src){el.src=old.src;el.onload=el.onerror=resolve}else{el.textContent=old.textContent}document.body.append(el);if(!old.src)resolve()});
    }
  }
  document.addEventListener('az:language-applied',event=>{lang=event.detail.lang;if(content)render(content,false)});
  const hiddenStyle=document.createElement('style');hiddenStyle.textContent='[hidden]{display:none!important}#processo .marquee__group .shot:nth-child(n){display:block!important}';document.head.append(hiddenStyle);
  window.AZ_CMS_PRESENT=true;
  async function start(){
    try{const r=await fetch(origin+(editing?'/api/draft':'/api/content'),{credentials:editing?'same-origin':'omit',cache:'no-store',signal:AbortSignal.timeout(7000)});if(r.ok){const data=await r.json();render(data.content)}}catch(e){console.warn('O conteúdo original continua disponível.',e)}
    if(!content)window.AZ_CMS_PRESENT=false;
    await legacy();
    if(content)render(content,false);
    if(editing){
      const style=document.createElement('style');style.textContent=`.zeph-cursor{display:none!important}body,a,button{cursor:auto!important}.reveal,.zeph-enter{opacity:1!important;transform:none!important;filter:none!important;visibility:visible!important}[data-cms-field]:hover,[data-cms-image]:hover,[data-cms-project]:hover,[data-cms-gallery]:hover{outline:2px solid #c5e886!important;outline-offset:4px;cursor:pointer!important}[contenteditable=true]{outline:2px solid #c5e886!important;cursor:text!important}.header{position:absolute!important}.processo .marquee__track{transform:none!important}.processo .marquee__group:nth-child(n+2){display:none!important}.processo .marquee__group .shot:nth-child(n){display:block!important}.marquee{overflow-x:auto!important}[hidden]{display:none!important}`;if(previewOnly)style.textContent=style.textContent.replace(/\[data-cms-field\]:hover[\s\S]*?\[contenteditable=true\][^}]+}/,'');document.head.append(style);
      document.addEventListener('click',e=>{
        if(previewOnly)return;
        const field=e.target.closest('[data-cms-field]');if(field){e.preventDefault();e.stopImmediatePropagation();notify({type:'cms:select',kind:'field',id:field.dataset.cmsField});field.contentEditable='true';field.focus();return}
        const img=e.target.closest('[data-cms-image]');const project=e.target.closest('[data-cms-project]');const gallery=e.target.closest('[data-cms-gallery]');
        if(img||project||gallery){e.preventDefault();e.stopImmediatePropagation();notify({type:'cms:select',kind:img?'image':project?'project':'gallery',id:img?.dataset.cmsImage||project?.dataset.cmsProject||gallery?.dataset.cmsGallery});return}
        if(e.target.closest('a,button')){e.preventDefault();e.stopImmediatePropagation()}
      },true);
      document.addEventListener('focusout',e=>{const el=e.target;if(el.dataset?.cmsField){el.contentEditable='false';notify({type:'cms:edit',id:el.dataset.cmsField,value:clean(el.innerHTML)})}});
      document.addEventListener('paste',e=>{if(!e.target.dataset?.cmsField)return;e.preventDefault();document.execCommand('insertText',false,e.clipboardData.getData('text/plain'))});
      window.addEventListener('message',e=>{if(e.origin!==location.origin||e.source!==parent)return;if(e.data?.type==='cms:content'){lang=e.data.lang==='en'?'en':'pt';if(window.azProjectI18n)window.azProjectI18n.apply(lang);render(e.data.content,true);window.dispatchEvent(new Event('resize'))}if(e.data?.type==='cms:scroll'){document.getElementById(e.data.id)?.scrollIntoView({behavior:'smooth',block:'start'})}});
      notify({type:'cms:ready'});
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
