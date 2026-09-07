#!/bin/bash
# =========================================================
#  BAIXAR IMAGENS  —  dê dois cliques neste arquivo
#
#  Ele cria a pasta "assets" ao lado do index.html
#  e baixa todas as imagens do site dentro dela.
# =========================================================

cd "$(dirname "$0")" || exit 1
mkdir -p assets

BASE="https://www.figma.com/api/mcp/asset"
ok=0
falhou=0

baixar () {
  printf '  %-20s' "$1"
  if curl -fsSL --retry 3 --max-time 90 -o "assets/$1" "$BASE/$2"; then
    echo "ok"
    ok=$((ok+1))
  else
    echo "FALHOU"
    rm -f "assets/$1"
    falhou=$((falhou+1))
  fi
}

echo ""
echo "Baixando as imagens do site..."
echo ""

baixar logo.png        46e3e3ac-ec69-4d60-88d2-3dc8ec4243b1.png
baixar avatar.png      3c349e87-15d1-451c-a0b3-dc99db071d67.png
baixar flag-pt.svg     8a7e0479-7027-459d-b455-4281b4277fd9.svg
baixar flag-en.svg     e84f3bde-5bbf-4c45-8380-9d9447074d19.svg
baixar btn-icon.svg    80720559-e738-4e2e-93d9-52162a08c5a9.svg
baixar sobre.png       b6aaa99b-7959-4092-ab9d-f4ca6e3fc4a1.png
baixar processo-bg.png 67d8d16a-5d19-4dee-9360-a96e5c09073f.png
baixar cta-bg.png      cf2c809d-a178-428b-b6fe-dceeb8cf35e8.png
baixar projeto-1.png   bd657686-c1e4-4d95-b1e0-808205a277b2.png
baixar projeto-2.png   c4e5e434-8a89-4c1a-90fb-a7cc31c30655.png
baixar projeto-3.png   363b7111-cf77-48c1-8569-83928d8ed994.png
baixar projeto-4.png   5dd338d1-cf5f-46bc-bf92-4b0611ca3e76.png
baixar galeria-01.png  166fcbb3-e88c-4e22-8a69-a853a4f2ff0c.png
baixar galeria-02.png  fc51ad44-dfd2-4cf0-a778-65ffddaa9e37.png
baixar galeria-03.png  e8a9dde7-ca57-40c4-b8aa-8fce301a935b.png
baixar galeria-04.png  97ae24be-585b-4d87-8280-af071b9a0c26.png
baixar galeria-05.png  a2cbd5b7-c4df-4e60-a9ea-4f50208582db.png
baixar galeria-06.png  5de33108-4e5c-4dfb-a088-40faa34dc9b4.png
baixar galeria-07.png  260114c2-d121-4b5a-a061-b11a000b90b2.png
baixar galeria-08.png  d48ff6d3-399c-4e73-a837-565333c7a18b.png
baixar galeria-09.png  9898b4de-2e17-4358-b4b2-140e230b2bfd.png
baixar galeria-10.png  7039830f-5b55-4a86-ae65-b687eaa71ccc.png
baixar galeria-11.png  16d10ad2-3318-4ccc-bcef-4dae3344d057.png
baixar galeria-12.png  26903cf0-5fd2-4be0-9567-b74c9937270d.png

echo ""
echo "-------------------------------------------"
echo "  Baixadas: $ok    Falharam: $falhou"
echo "-------------------------------------------"
echo ""

if [ "$falhou" -gt 0 ]; then
  echo "Os links do Figma expiram por volta de 13/09/2026."
  echo "Se falhou, reexporte no Figma (Export -> PNG 2x)"
  echo "e salve com o mesmo nome dentro da pasta assets."
  echo ""
fi

echo "Agora arraste a pasta 'assets' para dentro do repositorio no GitHub."
echo ""
echo "Pode fechar esta janela."
