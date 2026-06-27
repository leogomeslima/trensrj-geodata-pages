const paths = {
  estacoesJson: 'data/json/estacoes.json',
  ramaisJson: 'data/json/ramais.json',
  estacoesGeojson: 'data/geojson/estacoes.geojson',
  ativosJson: 'data/json/ativos.json'
};

let estacoes = [];
let ramais = [];
let geojsonOriginal = null;
let stationLayer = null;
let ativosMetadata = null;

const map = L.map('map').setView([-22.86, -43.35], 10);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

async function loadJson(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Erro ao carregar ${path}`);
  return response.json();
}

function renderCards(metadata) {
  const cards = document.getElementById('cards');
  const totalAtivos = ativosMetadata?.total_registros ?? '-';
  const totalAtivosGeo = ativosMetadata?.total_georreferenciados ?? '-';

  cards.innerHTML = `
    <div class="card"><strong>${metadata.total_estacoes || estacoes.length}</strong><span>estações/pontos</span></div>
    <div class="card"><strong>${ramais.length}</strong><span>ramais/extensões</span></div>
    <div class="card"><strong>${totalAtivos}</strong><span>ativos publicados</span></div>
    <div class="card"><strong>${totalAtivosGeo}</strong><span>ativos com coordenadas</span></div>
  `;
}

function renderBranchFilter() {
  const select = document.getElementById('branchFilter');
  ramais.forEach(ramal => {
    const option = document.createElement('option');
    option.value = ramal.id;
    option.textContent = ramal.nome;
    select.appendChild(option);
  });
}

function renderQgisLinks() {
  const container = document.getElementById('qgisLinks');
  container.innerHTML = '<a href="qgis/estacoes.geojson">/qgis/estacoes.geojson</a>';

  ramais.forEach(ramal => {
    const link = document.createElement('a');
    link.href = `qgis/estacoes/${ramal.id}.geojson`;
    link.textContent = `/qgis/estacoes/${ramal.id}.geojson`;
    container.appendChild(link);
  });
}

function stationMatchesFilters(station, search, branchId) {
  const name = normalizeText(station.nome);
  const matchesSearch = !search || name.includes(normalizeText(search));
  const matchesBranch = !branchId || (station.ramais || []).includes(branchId);
  return matchesSearch && matchesBranch;
}

function getFilteredStations() {
  const search = document.getElementById('search').value;
  const branchId = document.getElementById('branchFilter').value;
  return estacoes.filter(station => stationMatchesFilters(station, search, branchId));
}

function renderTable() {
  const tbody = document.getElementById('stationTable');
  const filtered = getFilteredStations();

  tbody.innerHTML = filtered.map(station => {
    const lat = station.coordenadas?.latitude ?? '';
    const lon = station.coordenadas?.longitude ?? '';
    const ramaisText = (station.ramais || []).join(', ') || '-';
    const osm = station.osm?.id || '-';
    const status = station.validacao?.status || '-';

    return `
      <tr>
        <td>${station.nome}</td>
        <td>${ramaisText}</td>
        <td>${lat}</td>
        <td>${lon}</td>
        <td>${osm}</td>
        <td>${status}</td>
      </tr>
    `;
  }).join('');
}

function renderMap() {
  const filteredIds = new Set(getFilteredStations().map(station => station.id));

  if (stationLayer) {
    map.removeLayer(stationLayer);
  }

  const filteredGeojson = {
    ...geojsonOriginal,
    features: geojsonOriginal.features.filter(feature => filteredIds.has(feature.properties.id))
  };

  stationLayer = L.geoJSON(filteredGeojson, {
    pointToLayer: (feature, latlng) => L.circleMarker(latlng, { radius: 6, weight: 2, fillOpacity: 0.75 }),
    onEachFeature: (feature, layer) => {
      const p = feature.properties;
      layer.bindPopup(`
        <strong>${p.nome}</strong><br>
        Ramais: ${(p.ramais || []).join(', ') || '-'}<br>
        Latitude: ${p.latitude}<br>
        Longitude: ${p.longitude}<br>
        OSM: ${p.osm_id || '-'}
      `);
    }
  }).addTo(map);

  if (filteredGeojson.features.length > 0) {
    map.fitBounds(stationLayer.getBounds(), { padding: [20, 20] });
  }
}

function applyFilters() {
  renderTable();
  renderMap();
}

async function init() {
  const [stationsResponse, branchesResponse, geojson, ativosResponse] = await Promise.all([
    loadJson(paths.estacoesJson),
    loadJson(paths.ramaisJson),
    loadJson(paths.estacoesGeojson),
    loadJson(paths.ativosJson)
  ]);

  estacoes = stationsResponse.data || [];
  ramais = branchesResponse.data || [];
  geojsonOriginal = geojson;
  ativosMetadata = ativosResponse.metadata || null;

  renderCards(stationsResponse.metadata || {});
  renderBranchFilter();
  renderQgisLinks();
  renderTable();
  renderMap();

  document.getElementById('search').addEventListener('input', applyFilters);
  document.getElementById('branchFilter').addEventListener('change', applyFilters);
}

init().catch(error => {
  console.error(error);
  alert('Não foi possível carregar os dados estáticos. Confira os caminhos dos arquivos JSON/GeoJSON.');
});
