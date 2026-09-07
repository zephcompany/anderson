from pathlib import Path
import re
p=Path('index.html')
s=p.read_text(encoding='utf-8')
# remove referencias antigas se ja aplicadas
s=s.replace('<link rel="stylesheet" href="enhancements.css?v=3">\n','')
s=s.replace('<script src="enhancements.js?v=3" defer></script>\n','')
# injeta css/js
s=s.replace('</head>','<link rel="stylesheet" href="enhancements.css?v=3">\n</head>',1)
s=s.replace('</body>','<script src="enhancements.js?v=3" defer></script>\n</body>',1)
# troca avatares por imagens de projetos, independente de querystring
repls=['projeto-1.png','projeto-2.png','projeto-3.png','projeto-4.png','galeria-01.png']
for new in repls:
    s=re.sub(r'assets/avatar\.png(?:\?[^\"\']*)?',f'assets/{new}?v=3',s,count=1)
s=s.replace('<strong>Mais de 100 pessoas já entraram</strong> e transformaram constância em regra.','<strong>Projetos entregues no Brasil e no exterior.</strong> Arquitetura autoral, do conceito à obra.')
p.write_text(s,encoding='utf-8')
