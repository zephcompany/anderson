from pathlib import Path
import re

p=Path('index.html')
s=p.read_text(encoding='utf-8')
ver='20260907-0344'

# quebra cache e remove correções antigas
patterns=[
 r'<link rel="stylesheet" href="enhancements\.css\?v=[^"]+">\n?',
 r'<link rel="stylesheet" href="carousel-fix\.css\?v=[^"]+">\n?',
 r'<script src="enhancements\.js\?v=[^"]+" defer></script>\n?',
 r'<script src="carousel-scroll-fix\.js\?v=[^"]+" defer></script>\n?',
 r'<script src="carousel-fix\.js\?v=[^"]+" defer></script>\n?'
]
for pat in patterns:
    s=re.sub(pat,'',s)
s=re.sub(r'<style id="zeph-spacing-fix">.*?</style>\n?','',s,flags=re.S)

spacing='''<style id="zeph-spacing-fix">
.sec-head--center{gap:14px!important}
.sec-head--center .eyebrow{margin-bottom:0!important}
.depoimentos .sec-head,.faq .sec-head{gap:14px!important}
.depoimentos .sec-head .eyebrow,.faq .sec-head .eyebrow{margin-bottom:0!important}
@media(max-width:900px){.sec-head--center,.depoimentos .sec-head,.faq .sec-head{gap:10px!important}}
</style>'''

s=s.replace('</head>',f'{spacing}\n<link rel="stylesheet" href="enhancements.css?v={ver}">\n<link rel="stylesheet" href="carousel-fix.css?v={ver}">\n</head>',1)
s=s.replace('</body>',f'<script src="enhancements.js?v={ver}" defer></script>\n<script src="carousel-fix.js?v={ver}" defer></script>\n</body>',1)

# garante imagens de projetos na prova social
repls=['projeto-1.png','projeto-2.png','projeto-3.png','projeto-4.png','galeria-01.png']
for new in repls:
    s=re.sub(r'assets/avatar\.png(?:\?[^\"\']*)?',f'assets/{new}?v={ver}',s,count=1)

# texto final da prova social
s=s.replace('<strong>Mais de 100 pessoas já entraram</strong> e transformaram constância em regra.','+ de 50 <strong>Projetos entregues no Brasil e no exterior.</strong>')
s=s.replace('<strong>Projetos entregues no Brasil e no exterior.</strong> Arquitetura autoral, do conceito à obra.','+ de 50 <strong>Projetos entregues no Brasil e no exterior.</strong>')

# links individuais dos quatro projetos
for slug in ['rf-house','marea-house','casa-florenca','villa-vrabel']:
    s=s.replace('href="projeto.html">Ver projeto',f'href="projeto.html?slug={slug}">Ver projeto',1)

p.write_text(s,encoding='utf-8')
