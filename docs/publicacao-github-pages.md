# Publicação no GitHub Pages

## Comandos Git

```bash
git init
git add .
git commit -m "feat: publica geodados da SuperVia no GitHub Pages"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/supervia-geodata-pages.git
git push -u origin main
```

## Configuração no GitHub

```text
Settings
Pages
Build and deployment
Source: Deploy from a branch
Branch: main
Folder: /root
Save
```

## Testes rápidos

Depois de publicado, abra:

```text
https://SEU_USUARIO.github.io/supervia-geodata-pages/
https://SEU_USUARIO.github.io/supervia-geodata-pages/api/estacoes.json
https://SEU_USUARIO.github.io/supervia-geodata-pages/qgis/estacoes.geojson
```
