(() => {
  const qs = new URLSearchParams(location.search);
  const slug = qs.get('slug') || 'rf-house';

  const projects = {
    'rf-house': {
      titleA:'RF', titleB:'House', location:'Brasília DF', image:'https://zephcompany.github.io/anderson/assets/projeto-1.png',
      tagline:'Com uma fachada surpreendente e espaços generosos para lazer e convivência.',
      description:'Com uma fachada surpreendente e espaços generosos para lazer e convivência, esta residência traduz o equilíbrio perfeito entre luxo, conforto e personalidade.',
      gallery:['https://zephcompany.github.io/anderson/assets/projeto-1.png','https://zephcompany.github.io/anderson/assets/galeria-01.png','https://zephcompany.github.io/anderson/assets/galeria-02.png','https://zephcompany.github.io/anderson/assets/galeria-03.png','https://zephcompany.github.io/anderson/assets/galeria-04.png','https://zephcompany.github.io/anderson/assets/galeria-05.png','https://zephcompany.github.io/anderson/assets/galeria-06.png','https://zephcompany.github.io/anderson/assets/galeria-07.png','https://zephcompany.github.io/anderson/assets/galeria-08.png'],
      area:'Sob consulta', land:'Residencial', status:'Projeto autoral'
    },
    'marea-house': {
      titleA:'Marea', titleB:'House', location:'Balneário Camboriú SC', image:'https://zephcompany.github.io/anderson/assets/projeto-2.png',
      tagline:'Arquitetura marcante, ambientes amplos e conexão entre design, natureza e qualidade de vida.',
      description:'Pensada para quem valoriza exclusividade e bem-estar, esta residência traduz a essência do alto padrão por meio de uma arquitetura marcante, ambientes amplos e uma conexão harmoniosa entre design, natureza e qualidade de vida.',
      gallery:['https://zephcompany.github.io/anderson/assets/projeto-2.png','https://zephcompany.github.io/anderson/assets/galeria-03.png','https://zephcompany.github.io/anderson/assets/galeria-04.png','https://zephcompany.github.io/anderson/assets/galeria-05.png','https://zephcompany.github.io/anderson/assets/galeria-06.png','https://zephcompany.github.io/anderson/assets/galeria-07.png','https://zephcompany.github.io/anderson/assets/galeria-08.png','https://zephcompany.github.io/anderson/assets/galeria-09.png','https://zephcompany.github.io/anderson/assets/galeria-10.png'],
      area:'Sob consulta', land:'Residencial', status:'Projeto autoral'
    },
    'casa-florenca': {
      titleA:'Casa', titleB:'Florença', location:'Uberlândia MG', image:'https://zephcompany.github.io/anderson/assets/projeto-3.png',
      tagline:'Uma fachada de personalidade marcante e linguagem contemporânea.',
      description:'Uma fachada de personalidade marcante e linguagem contemporânea, criada para transformar a identidade do cliente em arquitetura. O terceiro projeto desenvolvido para uma parceria construída com confiança e exclusividade.',
      gallery:['https://zephcompany.github.io/anderson/assets/projeto-3.png','https://zephcompany.github.io/anderson/assets/galeria-05.png','https://zephcompany.github.io/anderson/assets/galeria-06.png','https://zephcompany.github.io/anderson/assets/galeria-07.png','https://zephcompany.github.io/anderson/assets/galeria-08.png','https://zephcompany.github.io/anderson/assets/galeria-09.png','https://zephcompany.github.io/anderson/assets/galeria-10.png','https://zephcompany.github.io/anderson/assets/galeria-11.png','https://zephcompany.github.io/anderson/assets/galeria-12.png'],
      area:'Sob consulta', land:'Residencial', status:'Projeto autoral'
    },
    'villa-vrabel': {
      titleA:'Villa', titleB:'Vrabel', location:'Eslováquia', image:'https://zephcompany.github.io/anderson/assets/projeto-4.png',
      tagline:'Um projeto internacional que leva a linguagem do estúdio para fora do Brasil.',
      description:'Projeto internacional que leva a linguagem do estúdio para fora do Brasil, com volumes contidos, materiais nobres e uma implantação que responde ao clima e à paisagem local.',
      gallery:['https://zephcompany.github.io/anderson/assets/projeto-4.png','https://zephcompany.github.io/anderson/assets/galeria-07.png','https://zephcompany.github.io/anderson/assets/galeria-08.png','https://zephcompany.github.io/anderson/assets/galeria-09.png','https://zephcompany.github.io/anderson/assets/galeria-10.png','https://zephcompany.github.io/anderson/assets/galeria-11.png','https://zephcompany.github.io/anderson/assets/galeria-12.png','https://zephcompany.github.io/anderson/assets/galeria-01.png','https://zephcompany.github.io/anderson/assets/galeria-02.png'],
      area:'Sob consulta', land:'Residencial', status:'Projeto internacional'
    }
  };

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

  const originalProject = {...(projects[slug] || projects['rf-house'])};
  originalProject.title = originalProject.titleA + ' ' + originalProject.titleB;
  const setText = (selector, value) => document.querySelectorAll(selector).forEach(el => el.textContent = value);
  const copy = [
    ['.nav__list li:nth-child(2) a','Projetos','Projects'],
    ['.nav__list li:nth-child(3) a','Contato','Contact'],
    ['.nav__cta,.header__cta','Agendar uma demonstração','Schedule a consultation'],
    ['.concept h2','O <em>conceito</em>','The <em>concept</em>'],
    ['.concept__copy > p:nth-child(2)','<strong>O resultado é uma residência com identidade própria, desenhada para não se repetir.</strong>','<strong>The result is a residence with its own identity, designed to be one of a kind.</strong>'],
    ['.spec:nth-child(1) .spec__label','Área construída','Built area'],
    ['.spec:nth-child(2) .spec__label','Terreno','Plot'],
    ['.spec:nth-child(3) .spec__label','Localização','Location'],
    ['.spec:nth-child(4) .spec__label','Status','Status'],
    ['.ticker-project .phrase','<b>Nenhuma fachada se repete,</b> porque nenhuma história se repete.','<b>No facade is repeated,</b> because no story is repeated.'],
    ['.faq-project__eyebrow','// PERGUNTAS FREQUENTES','// FREQUENTLY ASKED QUESTIONS'],
    ['.faq-project h2','Ainda em <em>dúvida?</em>','Any <em>questions?</em>'],
    ['.faq-item:nth-child(1) .faq-q','Vocês atendem minha cidade?<span class="faq-plus">+</span>','Do you work in my city?<span class="faq-plus">+</span>'],
    ['.faq-item:nth-child(1) .faq-a p','Sim. O estúdio atende em todo o Brasil, com reuniões online, imagens 3D realistas e projeto executivo completo para a equipe de obra local.','Yes. The studio works throughout Brazil, with online meetings, realistic 3D images and a complete set of construction drawings for the local building team.'],
    ['.faq-item:nth-child(2) .faq-q','O que está incluso no projeto?<span class="faq-plus">+</span>','What does the project include?<span class="faq-plus">+</span>'],
    ['.faq-item:nth-child(2) .faq-a p','O escopo é apresentado de forma clara em contrato, com etapas, entregas e prazos definidos.','The scope is clearly set out in the contract, with defined stages, deliverables and deadlines.'],
    ['.faq-item:nth-child(3) .faq-q','Como funciona o contrato?<span class="faq-plus">+</span>','How does the contract work?<span class="faq-plus">+</span>'],
    ['.faq-item:nth-child(3) .faq-a p','O contrato organiza cronograma, escopo, responsabilidades e entregas de cada etapa do projeto.','The contract sets out the schedule, scope, responsibilities and deliverables for each stage of the project.'],
    ['.faq-item:nth-child(4) .faq-q','Quanto custa um projeto?<span class="faq-plus">+</span>','How much does a project cost?<span class="faq-plus">+</span>'],
    ['.faq-item:nth-child(4) .faq-a p','O investimento varia conforme área, complexidade e escopo. O orçamento é apresentado após o briefing inicial.','The investment depends on the size, complexity and scope. A quote is provided after the initial briefing.'],
    ['.rights','TODOS OS DIREITOS RESERVADOS','ALL RIGHTS RESERVED']
  ];
  const pills = [
    ['CONCEITO','CONCEPT'],['PRECISÃO','PRECISION'],['ATEMPORAL','TIMELESS'],
    ['ARQUITETURA AUTORAL','SIGNATURE ARCHITECTURE'],['IDENTIDADE','IDENTITY'],['EXCLUSIVIDADE','EXCLUSIVITY']
  ];
  const attrs = [
    ['.logo','aria-label','Anderson Zawa — início','Anderson Zawa — home'],
    ['.nav','aria-label','Navegação principal','Main navigation'],
    ['.lang','aria-label','Idioma','Language'],
    ['.burger','aria-label','Abrir menu','Open menu'],
    ['.gallery-project','aria-label','Galeria do projeto','Project gallery'],
    ['.ticker-project','aria-label','Valores do estúdio','Studio values']
  ];
  function apply(language) {
    language = language === 'en' ? 'en' : 'pt';
    document.documentElement.lang = language === 'en' ? 'en' : 'pt-BR';
    const column = language === 'en' ? 2 : 1;
    copy.forEach(row => document.querySelectorAll(row[0]).forEach(el => el.innerHTML = row[column]));
    document.querySelectorAll('.ticker-project .pill').forEach((el,i) => el.textContent = pills[i % pills.length][column-1]);
    attrs.forEach(([selector,attribute,pt,en]) => document.querySelectorAll(selector).forEach(el => el.setAttribute(attribute,language === 'en' ? en : pt)));
    if (!window.AZ_CMS_PRESENT) {
      const p = localizeProject(originalProject, language);
      document.title = p.title + ' — Anderson Zawa';
      const mapping = {'[data-title-a]':p.titleA,'[data-title-b]':p.titleB,'[data-location]':p.location,'[data-tagline]':p.tagline,'[data-description]':p.description,'[data-area]':p.area,'[data-land]':p.land,'[data-status]':p.status};
      Object.entries(mapping).forEach(([selector,value]) => setText(selector,value));
      const hero = document.querySelector('[data-hero]');
      if (hero) { hero.src = p.image; hero.alt = p.title; }
      document.querySelectorAll('[data-gallery]').forEach((img,i) => {
        img.src = p.gallery[i % p.gallery.length];
        img.alt = p.title + (language === 'en' ? ' — image ' : ' — imagem ') + (i+1);
      });
    }
    document.querySelectorAll('.lang__btn').forEach(button => {
      const active = button.dataset.lang === language;
      button.classList.toggle('is-active',active);
      button.setAttribute('aria-pressed',String(active));
    });
    try { localStorage.setItem('az-lang',language); } catch {}
    // Keep explicit language links consistent after switching the language.
    if (qs.has('lang')) {
      const url = new URL(location.href); url.searchParams.set('lang',language);
      history.replaceState(history.state,'',url);
    }
    document.querySelectorAll('.faq-item.open .faq-a').forEach(answer => answer.style.maxHeight = answer.scrollHeight + 'px');
    document.dispatchEvent(new CustomEvent('az:language-applied',{detail:{lang:language}}));
  }
  window.azProjectI18n = {apply,localizeProject};
  document.querySelectorAll('.lang__btn').forEach(button => button.addEventListener('click',() => apply(button.dataset.lang)));
  let initialLanguage = qs.get('lang');
  if (!['pt','en'].includes(initialLanguage)) {
    try { initialLanguage = localStorage.getItem('az-lang'); } catch {}
  }
  apply(initialLanguage);

  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-q')?.addEventListener('click',() => {
      const was = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(x => {
        x.classList.remove('open'); const answer = x.querySelector('.faq-a');
        if (answer) answer.style.maxHeight = '0px';
      });
      if (!was) {
        item.classList.add('open'); const answer = item.querySelector('.faq-a');
        if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('in'); observer.unobserve(entry.target); }
  }),{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();
