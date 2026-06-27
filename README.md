# TrensRJ GeoData Pages

Site estático para publicar dados georreferenciados da TrensRJ no GitHub Pages.

## O que este projeto entrega

- Página `index.html` com mapa Leaflet.
- Arquivos JSON para consumo como API estática.
- Arquivos GeoJSON para consumo direto no QGIS.
- Camadas separadas por ramal/extensão.

## Estrutura

```text
.
├── index.html
├── assets/
│   ├── css/style.css
│   └── js/app.js
├── data/
│   ├── json/
│   │   ├── estacoes.json
│   │   ├── ramais.json
│   │   ├── estacao_ramal.json
│   │   └── metadata.json
│   └── geojson/
│       ├── estacoes.geojson
│       ├── estacoes_deodoro.geojson
│       ├── estacoes_japeri.geojson
│       └── ...
├── api/
│   ├── estacoes.json
│   ├── ramais.json
│   ├── estacao_ramal.json
│   └── metadata.json
└── qgis/
    ├── estacoes.geojson
    └── estacoes/
        ├── deodoro.geojson
        ├── japeri.geojson
        └── ...
```

## Publicação no GitHub Pages

### Opção simples: publicar pela raiz

1. Crie um repositório no GitHub.
2. Envie todos os arquivos deste projeto para a branch `main`.
3. No GitHub, acesse `Settings > Pages`.
4. Em `Build and deployment`, selecione `Deploy from a branch`.
5. Escolha:
   - Branch: `main`
   - Folder: `/root`
6. Clique em `Save`.

A URL ficará assim:

```text
https://SEU_USUARIO.github.io/NOME_DO_REPOSITORIO/
```

## URLs úteis depois de publicado

Troque `SEU_USUARIO` e `NOME_DO_REPOSITORIO` pelos dados reais do seu repositório.

```text
https://SEU_USUARIO.github.io/NOME_DO_REPOSITORIO/
https://SEU_USUARIO.github.io/NOME_DO_REPOSITORIO/api/estacoes.json
https://SEU_USUARIO.github.io/NOME_DO_REPOSITORIO/api/ramais.json
https://SEU_USUARIO.github.io/NOME_DO_REPOSITORIO/qgis/estacoes.geojson
https://SEU_USUARIO.github.io/NOME_DO_REPOSITORIO/qgis/estacoes/santa_cruz.geojson
```

## Usando no QGIS

No QGIS:

1. `Camada > Adicionar Camada > Adicionar Camada Vetorial`
2. Em fonte, escolha `Protocolo: HTTP(S), cloud, etc.`
3. Informe a URL do GeoJSON publicado, por exemplo:

```text
https://SEU_USUARIO.github.io/NOME_DO_REPOSITORIO/qgis/estacoes.geojson
```

Para um ramal específico:

```text
https://SEU_USUARIO.github.io/NOME_DO_REPOSITORIO/qgis/estacoes/deodoro.geojson
```

## Observação sobre API estática

GitHub Pages não executa backend Go, Node, Python ou .NET. Por isso, esta versão funciona como uma API estática baseada em arquivos `.json` e `.geojson`.

Filtros como `?ramal=santa_cruz` não são processados no servidor. Para isso, use:

- arquivos separados por ramal em `/qgis/estacoes/{ramal}.geojson`; ou
- filtro no JavaScript do site; ou
- filtro no QGIS após carregar a camada.

## Licença dos dados

A base foi derivada de dados do OpenStreetMap/Overpass. Ao redistribuir dados derivados, respeite a licença ODbL.
