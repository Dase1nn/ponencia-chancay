/**
 * ============================================================================
 * PONENCIA CIENCIA POLÍTICA: CASO CHANCAY (2024–2026)
 * Arquitectura Híbrida Scrollytelling: Reveal.js v5 + Mapbox GL JS v3 (3D)
 * + Sistema de Fallback Multimedia Sincronizado (Modo Offline de Alta Fidelidad)
 * ============================================================================
 */

// 1. TOKEN OFICIAL MAPBOX GL JS
const MAPBOX_TOKEN = 'pk.eyJ1IjoiZGFzZTFubiIsImEiOiJjbXc2cnV1eW4wY2kwMnlxdmVjbDlra2pzIn0.0b7H2sikoaR0BUtJv-eDeQ';
if (typeof mapboxgl !== 'undefined') {
  mapboxgl.accessToken = MAPBOX_TOKEN;
}

// 2. MAPA DE VIDEOCLIPS PARA MODO OFFLINE (SLIDES 4 A 9 Y SLIDE 13)
const OFFLINE_VIDEO_MAP = {
  3: 'assets/videos/slide4_distrital.webm',   // Slide 4 (0-based index: 3)
  4: 'assets/videos/slide5_puerto.webm',      // Slide 5 (0-based index: 4)
  5: 'assets/videos/slide6_peralvillo.webm',  // Slide 6 (0-based index: 5)
  6: 'assets/videos/slide7_evitamiento.webm', // Slide 7 (0-based index: 6)
  7: 'assets/videos/slide8_muni.webm',        // Slide 8 (0-based index: 7)
  8: 'assets/videos/slide9_culebra.webm',     // Slide 9 (0-based index: 8)
  12: 'assets/videos/slide13_nacional.webm'   // Slide 13 (0-based index: 12)
};

// Cache en memoria/Blob por si se graban en caliente con MediaRecorder
const recordedVideoBlobs = {};

// 3. DEFINICIÓN DE LAS 6 ZONAS ANCLA (MARCADORES INTERACTIVOS HTML/CSS)
const ANCHOR_POINTS = [
  {
    id: 1,
    slideIndex: 3, // Slide 4
    fileName: 'slide4_distrital.webm',
    title: '01 · Distrito de Chancay (Escala Distrital)',
    subtitle: 'Brechas: 30% sin agua · 27% sin desagüe · 65% vías sin pavimentar',
    coords: [-77.2680, -11.5700],
    colorClass: 'marker-cyan',
    hexColor: '#0284c7'
  },
  {
    id: 2,
    slideIndex: 4, // Slide 5
    fileName: 'slide5_puerto.webm',
    title: '02 · Terminal Portuario Multipropósito (CSPCP)',
    subtitle: 'Punta Chancay · Inversión > US$ 1,300M (Bloqueo de facto corporativo)',
    coords: [-77.2785, -11.5835],
    colorClass: 'marker-amber',
    hexColor: '#d97706'
  },
  {
    id: 3,
    slideIndex: 5, // Slide 6
    fileName: 'slide6_peralvillo.webm',
    title: '03 · Sector Peralvillo y Bahía El Cascajo',
    subtitle: 'Subsidencia túnel (mayo 2023) · Ausencia de PTAR (OEFA)',
    coords: [-77.2710, -11.5880],
    colorClass: 'marker-rose',
    hexColor: '#e11d48'
  },
  {
    id: 4,
    slideIndex: 6, // Slide 7
    fileName: 'slide7_evitamiento.webm',
    title: '04 · Controversia Vía de Evitamiento (MTC vs. PDU)',
    subtitle: '3,657 rechazos ciudadanos al trazo costero del MTC',
    coords: [-77.2755, -11.5475],
    colorClass: 'marker-amber',
    hexColor: '#d97706'
  },
  {
    id: 5,
    slideIndex: 7, // Slide 8
    fileName: 'slide8_muni.webm',
    title: '05 · Municipalidad Distrital de Chancay (MDCH)',
    subtitle: 'Plaza de Armas · 21 plazas CAP · PIM S/ 40.9M (7.1% ejec. T1)',
    coords: [-77.2669, -11.5633],
    colorClass: 'marker-cyan',
    hexColor: '#0284c7'
  },
  {
    id: 6,
    slideIndex: 8, // Slide 9
    fileName: 'slide9_culebra.webm',
    title: '06 · A.H. Cerro La Culebra (Periferia Este)',
    subtitle: 'Conflicto por obras de saneamiento paralizadas desde 2022',
    coords: [-77.2550, -11.5580],
    colorClass: 'marker-rose',
    hexColor: '#e11d48'
  }
];

// 3.b DEFINICIÓN DE LOS 10 NODOS ESTRATÉGICOS A ESCALA NACIONAL (SLIDE 13 - EPÍLOGO)
const NATIONAL_NODES = [
  // Eje Litoral / Portuario (Color Cian/Azul)
  {
    id: 'talara',
    title: 'Talara (Piura)',
    desc: 'Puerto Aeroespacial',
    coords: [-81.2719, -4.5772],
    category: 'litoral',
    colorClass: 'marker-cyan',
    hexColor: '#0284c7',
    placement: 'top-left'
  },
  {
    id: 'paita',
    title: 'Paita (Piura)',
    desc: 'Ampliación Portuaria y ZEE',
    coords: [-81.1144, -5.0892],
    category: 'litoral',
    colorClass: 'marker-cyan',
    hexColor: '#0284c7',
    placement: 'bottom-right'
  },
  {
    id: 'chancay',
    title: 'Chancay (Lima)',
    desc: 'Caso Testigo · Escala Máxima',
    coords: [-77.2785, -11.5835],
    category: 'litoral',
    colorClass: 'marker-cyan marker-highlight-hero',
    hexColor: '#0284c7',
    isHero: true,
    placement: 'left'
  },
  {
    id: 'ancon',
    title: 'Ancón (Lima)',
    desc: 'Ciudad Bicentenario / Parque Industrial',
    coords: [-77.1736, -11.7764],
    category: 'litoral',
    colorClass: 'marker-cyan',
    hexColor: '#0284c7',
    placement: 'bottom'
  },
  {
    id: 'marcona',
    title: 'Marcona (Ica)',
    desc: 'Terminal Portuario',
    coords: [-75.1619, -15.3622],
    category: 'litoral',
    colorClass: 'marker-cyan',
    hexColor: '#0284c7',
    placement: 'left'
  },
  {
    id: 'corio',
    title: 'Islay - Corio (Arequipa)',
    desc: 'Proyecto Megapuerto de Corio',
    coords: [-71.7925, -17.1700],
    category: 'litoral',
    colorClass: 'marker-cyan',
    hexColor: '#0284c7',
    placement: 'bottom-left'
  },

  // Eje Interior / Extractivo-Multimodal (Color Ámbar/Naranja)
  {
    id: 'chinchero',
    title: 'Chinchero (Cusco)',
    desc: 'Aeropuerto Internacional (AICC)',
    coords: [-72.0469, -13.3931],
    category: 'interior',
    colorClass: 'marker-amber',
    hexColor: '#d97706',
    placement: 'right'
  },
  {
    id: 'challhuahuacho',
    title: 'Challhuahuacho (Apurímac)',
    desc: 'Corredor Minero del Sur',
    coords: [-72.2483, -14.1228],
    category: 'interior',
    colorClass: 'marker-amber',
    hexColor: '#d97706',
    placement: 'bottom'
  },
  {
    id: 'yurimaguas',
    title: 'Yurimaguas (Loreto)',
    desc: 'Terminal Portuario Fluvial (IIRSA Norte)',
    coords: [-76.1036, -5.8969],
    category: 'interior',
    colorClass: 'marker-amber',
    hexColor: '#d97706',
    placement: 'right'
  },
  {
    id: 'puerto_maldonado',
    title: 'Puerto Maldonado (Madre de Dios)',
    desc: 'Corredor Interoceánico (IIRSA Sur)',
    coords: [-69.1892, -12.5933],
    category: 'interior',
    colorClass: 'marker-amber',
    hexColor: '#d97706',
    placement: 'top'
  }
];

// 4. CAPAS GEOJSON DE ALTA PRECISIÓN CARTOGRÁFICA (SEGÚN MAPA 3.5-7 DEL PDU CHANCAY P. 186)
const GEOJSON_MTC_COASTAL = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        name: 'Propuesta MTC (Trazo Costero Rechazado)',
        description: 'Corta hacia el borde litoral por La Calichera y Playa Acapulco hasta Chancayllo'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-77.2320, -11.6150],
          [-77.2435, -11.6015],
          [-77.2525, -11.5940],
          [-77.2585, -11.5855],
          [-77.2605, -11.5775],
          [-77.2618, -11.5695],
          [-77.2642, -11.5630],
          [-77.2695, -11.5565],
          [-77.2748, -11.5495],
          [-77.2768, -11.5465],
          [-77.2798, -11.5405],
          [-77.2835, -11.5335],
          [-77.2858, -11.5290],
          [-77.2882, -11.5220],
          [-77.2892, -11.5150],
          [-77.2885, -11.5095],
          [-77.2852, -11.5042],
          [-77.2965, -11.4910],
          [-77.3180, -11.4725]
        ]
      }
    }
  ]
};

const GEOJSON_PDU_EAST = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        name: 'Propuesta PDU Chancay (Vía Evitamiento Este)',
        description: 'Arco periférico oriental por Quepepampa, Cerro La Culebra y San Cayetano'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-77.2320, -11.6150],
          [-77.2435, -11.6015],
          [-77.2525, -11.5940],
          [-77.2572, -11.5855],
          [-77.2592, -11.5750],
          [-77.2582, -11.5655],
          [-77.2555, -11.5595],
          [-77.2505, -11.5535],
          [-77.2445, -11.5475],
          [-77.2392, -11.5415],
          [-77.2362, -11.5355],
          [-77.2358, -11.5310],
          [-77.2395, -11.5245],
          [-77.2455, -11.5175],
          [-77.2528, -11.5105],
          [-77.2605, -11.5038],
          [-77.2675, -11.5002],
          [-77.2755, -11.5012],
          [-77.2852, -11.5042]
        ]
      }
    }
  ]
};

const GEOJSON_PDU_LANDMARKS = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { label: 'LA CALICHERA (Trazo MTC)', category: 'mtc' },
      geometry: { type: 'Point', coordinates: [-77.2768, -11.5465] }
    },
    {
      type: 'Feature',
      properties: { label: 'PLAYA ACAPULCO (Trazo MTC)', category: 'mtc' },
      geometry: { type: 'Point', coordinates: [-77.2858, -11.5290] }
    },
    {
      type: 'Feature',
      properties: { label: 'CHANCAYLLO', category: 'neutral' },
      geometry: { type: 'Point', coordinates: [-77.2755, -11.5175] }
    },
    {
      type: 'Feature',
      properties: { label: 'QUEPEPAMPA (Trazo PDU)', category: 'pdu' },
      geometry: { type: 'Point', coordinates: [-77.2445, -11.5475] }
    },
    {
      type: 'Feature',
      properties: { label: 'VÉRTICE CERRO LA CULEBRA (Trazo PDU)', category: 'pdu' },
      geometry: { type: 'Point', coordinates: [-77.2360, -11.5330] }
    },
    {
      type: 'Feature',
      properties: { label: 'SAN CAYETANO (Empalme PDU)', category: 'pdu' },
      geometry: { type: 'Point', coordinates: [-77.2675, -11.5002] }
    },
    {
      type: 'Feature',
      properties: { label: 'PAMPA LIBRE', category: 'neutral' },
      geometry: { type: 'Point', coordinates: [-77.2630, -11.5240] }
    }
  ]
};

const GEOJSON_PORT_CORRIDOR = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        name: 'Túnel Viaducto Subterráneo (1.8 km) · Sector Peralvillo'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-77.2785, -11.5835],
          [-77.2710, -11.5880],
          [-77.2605, -11.5925]
        ]
      }
    }
  ]
};

// 5. ESTADO DE CONEXIÓN (ONLINE / OFFLINE) Y VARIABLES DE INSTANCIA
let isOfflineMode = !navigator.onLine;

// Estado de Resolución: Modo Proyector 1280x1024 (Relación 5:4 SXGA para Auditorios)
const urlParams = new URLSearchParams(window.location.search);
let is1280Mode = (
  urlParams.get('res') === '1280' ||
  urlParams.get('projector') === 'true' ||
  urlParams.get('mode') === '1280' ||
  localStorage.getItem('chancay_mode_1280x1024') === 'true' ||
  ((window.innerWidth <= 1300 && window.innerHeight >= 900) && localStorage.getItem('chancay_mode_1280x1024') !== 'false')
);

let map = null;
let mapReady = false;
let isFreeMapMode = false;
let currentVideoSrc = '';
let videoFadeTimer = null;
const markerElements = {};
const nationalMarkerElements = [];

// 6. INICIALIZACIÓN CONDICIONAL DE MAPBOX GL JS (OMITIDA SI INICIA EN MODO OFFLINE)
function initMapboxInstance() {
  if (map || isOfflineMode || typeof mapboxgl === 'undefined') return;

  map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/satellite-streets-v12',
    center: [-77.2680, -11.5700],
    zoom: 12.8,
    pitch: 45,
    bearing: -15,
    antialias: true,
    preserveDrawingBuffer: true, // Permite capturar videoclips .webm con MediaRecorder (canvas.captureStream)
    projection: 'globe'
  });

  map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'bottom-left');

  map.on('style.load', () => {
    const styleLayers = map.getStyle().layers || [];
    let firstVectorLayerId = undefined;
    let firstSymbolLayerId = undefined;

    for (const layer of styleLayers) {
      if (layer.type === 'fill') {
        map.setPaintProperty(layer.id, 'fill-opacity', 0);
      }
      if (!firstVectorLayerId && layer.id !== 'background' && layer.id !== 'satellite') {
        firstVectorLayerId = layer.id;
      }
      if (!firstSymbolLayerId && layer.type === 'symbol') {
        firstSymbolLayerId = layer.id;
      }
    }

    if (map.getLayer('satellite')) {
      map.setLayoutProperty('satellite', 'visibility', 'visible');
      map.setPaintProperty('satellite', 'raster-opacity', 1);
    }

    // Ortofoto satelital continua hasta zoom 19
    if (!map.getSource('chancay-ortho-satellite')) {
      map.addSource('chancay-ortho-satellite', {
        type: 'raster',
        tiles: [
          'https://mt0.google.com/vt/lyrs=s&hl=es&x={x}&y={y}&z={z}',
          'https://mt1.google.com/vt/lyrs=s&hl=es&x={x}&y={y}&z={z}',
          'https://mt2.google.com/vt/lyrs=s&hl=es&x={x}&y={y}&z={z}',
          'https://mt3.google.com/vt/lyrs=s&hl=es&x={x}&y={y}&z={z}'
        ],
        tileSize: 256,
        maxzoom: 19
      });

      map.addLayer(
        {
          id: 'chancay-ortho-satellite-layer',
          type: 'raster',
          source: 'chancay-ortho-satellite',
          paint: {
            'raster-opacity': 1,
            'raster-resampling': 'linear'
          }
        },
        firstVectorLayerId
      );
    }

    // 1. Separar las fuentes raster-dem (terreno 3D y sombreado independientes para evitar agujas/púas)
    if (!map.getSource('mapbox-dem')) {
      map.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14
      });
    }

    if (!map.getSource('mapbox-hillshade-source')) {
      map.addSource('mapbox-hillshade-source', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14
      });
    }

    // 2. Reducir la exageración del terreno a un valor natural (1.4)
    map.setTerrain({
      source: 'mapbox-dem',
      exaggeration: 1.4
    });

    // 3. Reconectar la capa hillshade a su propia fuente con exageración moderada (0.4)
    if (!map.getLayer('mapbox-hillshade-layer')) {
      map.addLayer(
        {
          id: 'mapbox-hillshade-layer',
          type: 'hillshade',
          source: 'mapbox-hillshade-source',
          layout: { visibility: 'visible' },
          paint: {
            'hillshade-exaggeration': 0.4
          }
        },
        firstVectorLayerId
      );
    } else {
      map.setPaintProperty('mapbox-hillshade-layer', 'hillshade-exaggeration', 0.4);
    }

    // Edificios 3D
    if (map.getSource('composite') && !map.getLayer('3d-buildings-chancay')) {
      map.addLayer(
        {
          id: '3d-buildings-chancay',
          source: 'composite',
          'source-layer': 'building',
          filter: ['==', 'extrude', 'true'],
          type: 'fill-extrusion',
          minzoom: 14,
          paint: {
            'fill-extrusion-color': '#cbd5e1',
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['zoom'],
              14,
              0,
              14.5,
              ['coalesce', ['get', 'height'], 8]
            ],
            'fill-extrusion-base': [
              'interpolate',
              ['linear'],
              ['zoom'],
              14,
              0,
              14.5,
              ['coalesce', ['get', 'min_height'], 0]
            ],
            'fill-extrusion-opacity': 0.75
          }
        },
        firstSymbolLayerId
      );
    }

    // Niebla atmosférica diurna
    map.setFog({
      'range': [2.0, 10],
      'color': '#e0f2fe',
      'high-color': '#bae6fd',
      'space-color': '#f8fafc',
      'horizon-blend': 0.06
    });

    // Fuentes y capas GeoJSON
    map.addSource('vias-mtc-source', { type: 'geojson', data: GEOJSON_MTC_COASTAL });
    map.addSource('vias-pdu-source', { type: 'geojson', data: GEOJSON_PDU_EAST });
    map.addSource('pdu-landmarks-source', { type: 'geojson', data: GEOJSON_PDU_LANDMARKS });
    map.addSource('port-corridor-source', { type: 'geojson', data: GEOJSON_PORT_CORRIDOR });

    map.addLayer({
      id: 'vias-mtc-glow',
      type: 'line',
      source: 'vias-mtc-source',
      minzoom: 10,
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: { 'line-color': '#ef4444', 'line-width': 12, 'line-opacity': 0.32, 'line-blur': 4 }
    });

    map.addLayer({
      id: 'vias-mtc-line',
      type: 'line',
      source: 'vias-mtc-source',
      minzoom: 10,
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: { 'line-color': '#ef4444', 'line-width': 4.5, 'line-dasharray': [2, 1.4], 'line-opacity': 0.98 }
    });

    map.addLayer({
      id: 'vias-pdu-glow',
      type: 'line',
      source: 'vias-pdu-source',
      minzoom: 10,
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: { 'line-color': '#0284c7', 'line-width': 12, 'line-opacity': 0.35, 'line-blur': 4 }
    });

    map.addLayer({
      id: 'vias-pdu-line',
      type: 'line',
      source: 'vias-pdu-source',
      minzoom: 10,
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: { 'line-color': '#22d3ee', 'line-width': 5, 'line-opacity': 0.98 }
    });

    map.addLayer({
      id: 'pdu-landmarks-circles',
      type: 'circle',
      source: 'pdu-landmarks-source',
      minzoom: 10,
      paint: {
        'circle-radius': 5.5,
        'circle-color': ['match', ['get', 'category'], 'mtc', '#ef4444', 'pdu', '#22d3ee', '#f59e0b'],
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff'
      }
    });

    map.addLayer({
      id: 'pdu-landmarks-labels',
      type: 'symbol',
      source: 'pdu-landmarks-source',
      minzoom: 10,
      layout: {
        'text-field': ['get', 'label'],
        'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
        'text-size': 11.5,
        'text-offset': [0, 1.3],
        'text-anchor': 'top'
      },
      paint: {
        'text-color': '#0f172a',
        'text-halo-color': 'rgba(255, 255, 255, 0.95)',
        'text-halo-width': 2.2
      }
    });

    map.addLayer({
      id: 'port-corridor-line',
      type: 'line',
      source: 'port-corridor-source',
      minzoom: 10,
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: { 'line-color': '#f59e0b', 'line-width': 4, 'line-dasharray': [1.2, 1.2], 'line-opacity': 0.95 }
    });

    // Marcadores HTML/CSS con pulso animado
    ANCHOR_POINTS.forEach((anchor) => {
      const el = document.createElement('div');
      el.className = `custom-marker ${anchor.colorClass}`;
      el.innerHTML = `
        <div class="marker-pin-wrap">
          <div class="marker-pulse"></div>
          <div class="marker-core"></div>
        </div>
        <div class="marker-label">${anchor.title}</div>
      `;

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        Reveal.slide(anchor.slideIndex);
      });

      new mapboxgl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat(anchor.coords)
        .addTo(map);

      markerElements[anchor.id] = el;
    });

    // Marcadores a Escala Nacional para Slide 13 (Epílogo)
    NATIONAL_NODES.forEach((node) => {
      const el = document.createElement('div');
      el.className = `national-marker ${node.colorClass} ${node.isHero ? 'is-hero' : ''} callout-${node.placement || 'bottom-left'}`;
      el.style.display = 'none'; // ocultos por defecto en slides 1 a 12
      el.innerHTML = `
        <div class="nat-pin-anchor">
          <div class="nat-pulse"></div>
          <div class="nat-core"></div>
        </div>
        <div class="nat-callout-wrap">
          <div class="nat-label-card">
            <span class="nat-title">${node.title}</span>
            <span class="nat-desc">${node.desc}</span>
          </div>
          <div class="nat-callout-arrow"></div>
        </div>
      `;

      if (node.isHero) {
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          Reveal.slide(4); // Permite hacer click para volver al detalle de Chancay
        });
      }

      new mapboxgl.Marker({ element: el, anchor: 'center' })
        .setLngLat(node.coords)
        .addTo(map);

      nationalMarkerElements.push(el);
    });

    mapReady = true;

    const currentSlide = Reveal.getCurrentSlide();
    if (currentSlide) {
      syncSlideWithMap(currentSlide, Reveal.getIndices().h);
    }

    // Si se solicitó autograbación por URL (?autorecord=true), iniciarla una vez cargado el mapa
    const params = new URLSearchParams(window.location.search);
    if (params.get('autorecord') === 'true') {
      setTimeout(() => {
        window.recordAllAnchorVideos();
      }, 2500);
    }
  });

  // Telemetría en tiempo real con requestAnimationFrame
  let telemetryRaf = null;
  map.on('move', () => {
    if (telemetryRaf || isOfflineMode) return;
    telemetryRaf = requestAnimationFrame(() => {
      const center = map.getCenter();
      const zoom = map.getZoom().toFixed(1);
      const pitch = Math.round(map.getPitch());

      const coordsEl = document.getElementById('tel-coords');
      const cameraEl = document.getElementById('tel-camera');

      if (coordsEl) {
        coordsEl.textContent = `${Math.abs(center.lng).toFixed(4)}°W, ${Math.abs(center.lat).toFixed(4)}°S`;
      }
      if (cameraEl) {
        cameraEl.textContent = `${zoom}x · ${pitch}°`;
      }
      telemetryRaf = null;
    });
  });
}

// 7. FUNCIONES MATEMÁTICAS DE CÁMARA SUAVE Y ENCUADRE SPLIT
function cinematicEasing(t) {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

function getSplitScreenCenter(coords, zoomLevel, bearingLevel) {
  const [lng, lat] = coords;
  // En modo 1280x1024, la tarjeta mide 495px con margen de 28px; el área libre izquierda va de 0 a 757px (centro en 378px).
  // Para centrar el marcador en 378px de la pantalla, desplazamos el centro de Mapbox 262px a la derecha.
  // En modo panorámico (16:9), el desplazamiento proporcional es del 21% del ancho.
  const activeWidth = is1280Mode ? Math.min(window.innerWidth, 1280) : window.innerWidth;
  const shiftPixelsRight = is1280Mode ? 262 : (activeWidth * 0.21);
  const worldSize = 512 * Math.pow(2, zoomLevel);
  const degPerPixel = 360 / worldSize;
  const rightAngleRad = ((bearingLevel + 90) * Math.PI) / 180;
  const latRad = (lat * Math.PI) / 180;

  const dLng = shiftPixelsRight * degPerPixel * Math.sin(rightAngleRad);
  const dLat = shiftPixelsRight * degPerPixel * Math.cos(rightAngleRad) * Math.cos(latRad);

  return [lng + dLng, lat + dLat];
}

// 8. SINCRONIZACIÓN Y REPRODUCCIÓN DEL VIDEO FALLBACK (MODO OFFLINE)
function updateOfflineVideoForSlide(slideElement, slideIndex) {
  const videoBackdrop = document.getElementById('video-backdrop');
  const player = document.getElementById('fallback-player');
  if (!videoBackdrop || !player) return;

  const isMapSlide = slideElement && slideElement.getAttribute('data-map') === 'true';
  const targetVideoPath = OFFLINE_VIDEO_MAP[slideIndex];

  // Si estamos en una slide convencional (1 a 3 y 10 a 12), pausar y ocultar el reproductor
  if (!isOfflineMode || !isMapSlide || !targetVideoPath) {
    player.pause();
    videoBackdrop.classList.remove('active');
    return;
  }

  videoBackdrop.classList.add('active');

  // Actualizar telemetría estática del HUD desde los atributos de la slide en modo offline
  const centerAttr = slideElement.getAttribute('data-center');
  const zoomAttr = slideElement.getAttribute('data-zoom') || '13.0';
  const pitchAttr = slideElement.getAttribute('data-pitch') || '50';
  if (centerAttr) {
    const [lng, lat] = centerAttr.split(',').map(Number);
    const coordsEl = document.getElementById('tel-coords');
    const cameraEl = document.getElementById('tel-camera');
    if (coordsEl) coordsEl.textContent = `${Math.abs(lng).toFixed(4)}°W, ${Math.abs(lat).toFixed(4)}°S`;
    if (cameraEl) cameraEl.textContent = `${parseFloat(zoomAttr).toFixed(1)}x · ${Math.round(parseFloat(pitchAttr))}°`;
  }

  // Usar blob en memoria si existe o ruta en assets/videos/
  const resolvedSrc = recordedVideoBlobs[slideIndex] || targetVideoPath;

  if (currentVideoSrc === resolvedSrc) {
    if (player.paused) {
      player.play().catch(() => {});
    }
    return;
  }

  // Transición suave de desvanecimiento (fade transition de 0.4s) entre cambios de video
  currentVideoSrc = resolvedSrc;
  player.classList.add('is-fading');

  if (videoFadeTimer) clearTimeout(videoFadeTimer);
  videoFadeTimer = setTimeout(() => {
    player.src = resolvedSrc;
    player.load();
    const playPromise = player.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          player.classList.remove('is-fading');
        })
        .catch(() => {
          player.classList.remove('is-fading');
        });
    } else {
      player.classList.remove('is-fading');
    }
  }, 220);
}

// 9. GESTIÓN DEL MODO ONLINE / OFFLINE (AUTOMÁTICO Y MANUAL)
function updateConnectionHUD() {
  const badge = document.getElementById('connection-badge');
  const toggleBtn = document.getElementById('toggle-offline-mode');
  const toggleLabel = document.getElementById('offline-toggle-label');
  const interactBtn = document.getElementById('toggle-map-interact');

  document.body.classList.toggle('is-offline-mode', isOfflineMode);

  if (badge) {
    badge.textContent = isOfflineMode ? 'OFFLINE · VIDEO FALLBACK' : 'ONLINE · MAPBOX 3D';
    badge.classList.toggle('status-offline', isOfflineMode);
    badge.classList.toggle('status-online', !isOfflineMode);
  }

  if (toggleBtn && toggleLabel) {
    toggleBtn.classList.toggle('offline-active', isOfflineMode);
    toggleLabel.textContent = isOfflineMode ? 'Volver a Mapbox 3D' : 'Modo Offline (Video)';
  }

  if (interactBtn) {
    interactBtn.style.display = isOfflineMode ? 'none' : 'inline-flex';
  }
}

function setOfflineMode(targetOfflineState) {
  isOfflineMode = Boolean(targetOfflineState);
  updateConnectionHUD();

  const currentSlide = Reveal.getCurrentSlide();
  const currentIndex = Reveal.getIndices().h;

  if (isOfflineMode) {
    if (isFreeMapMode) toggleFreeMapMode(false);
    updateOfflineVideoForSlide(currentSlide, currentIndex);
  } else {
    // Pausar video y activar/inicializar Mapbox 3D si no había sido inicializado
    const player = document.getElementById('fallback-player');
    const videoBackdrop = document.getElementById('video-backdrop');
    if (player) player.pause();
    if (videoBackdrop) videoBackdrop.classList.remove('active');

    if (!map) {
      initMapboxInstance();
    } else {
      setTimeout(() => {
        map.resize();
        syncSlideWithMap(currentSlide, currentIndex);
      }, 60);
    }
  }
}

// Escuchar eventos globales de red del navegador
window.addEventListener('offline', () => {
  setOfflineMode(true);
});

window.addEventListener('online', () => {
  setOfflineMode(false);
});

// 9.b GESTIÓN DEL MODO RESOLUCIÓN (1280x1024 · 5:4 PROYECTOR)
function updateResolutionHUD() {
  const badge = document.getElementById('resolution-badge');
  const toggleBtn = document.getElementById('toggle-resolution-mode');
  const toggleLabel = document.getElementById('resolution-toggle-label');

  document.body.classList.toggle('mode-1280x1024', is1280Mode);

  if (badge) {
    badge.textContent = is1280Mode ? 'PROYECTOR (1280x1024)' : 'PANORÁMICO (16:9)';
    badge.classList.toggle('status-res-54', is1280Mode);
    badge.classList.toggle('status-res-wide', !is1280Mode);
  }

  if (toggleBtn && toggleLabel) {
    toggleBtn.classList.toggle('res-active', is1280Mode);
    toggleLabel.textContent = is1280Mode ? 'Volver a 16:9' : 'Modo 1280x1024';
  }
}

function setResolutionMode(targetState) {
  is1280Mode = Boolean(targetState);
  try {
    localStorage.setItem('chancay_mode_1280x1024', is1280Mode ? 'true' : 'false');
  } catch (_) {}

  updateResolutionHUD();

  if (map && mapReady) {
    setTimeout(() => {
      map.resize();
      const currentSlide = Reveal.getCurrentSlide();
      const currentIndex = Reveal.getIndices().h;
      syncSlideWithMap(currentSlide, currentIndex);
    }, 120);
  }

  if (typeof Reveal !== 'undefined' && Reveal.layout) {
    Reveal.layout();
  }
}

// Detección automática al redimensionar la ventana (solo si no hay preferencia forzada en localStorage ni por URL)
window.addEventListener('resize', () => {
  const params = new URLSearchParams(window.location.search);
  if (!params.has('res') && !params.has('projector') && localStorage.getItem('chancay_mode_1280x1024') === null) {
    const isSXGA = (window.innerWidth <= 1300 && window.innerHeight >= 900) ||
                   (Math.abs(window.innerWidth / window.innerHeight - 1.25) < 0.08);
    if (isSXGA !== is1280Mode) {
      setResolutionMode(isSXGA);
    }
  }
});

// 10. INICIALIZACIÓN DE REVEAL.JS v5
Reveal.initialize({
  controls: true,
  progress: true,
  center: true,
  hash: true,
  transition: 'fade',
  transitionSpeed: 'slow',
  backgroundTransition: 'none',
  width: '100%',
  height: '100%',
  margin: 0,
  minScale: 1,
  maxScale: 1
});

// 11. FUNCIÓN CENTRAL DE SINCRONIZACIÓN DE DIAPOSITIVAS (MAPA 3D O VIDEO FALLBACK)
function syncSlideWithMap(slideElement, slideIndex) {
  if (!slideElement) return;

  const isMapSlide = slideElement.getAttribute('data-map') === 'true';
  const isNationalSlide = slideElement.getAttribute('data-slide-type') === 'national' || slideIndex === 12;
  const anchorId = parseInt(slideElement.getAttribute('data-anchor') || '0', 10);
  const backdrop = document.getElementById('map-backdrop');

  // Actualizar contador de diapositivas (01 / 13)
  const totalSlides = Reveal.getTotalSlides();
  const counterEl = document.getElementById('slide-counter');
  if (counterEl) {
    const formattedCurrent = String(slideIndex + 1).padStart(2, '0');
    const formattedTotal = String(totalSlides).padStart(2, '0');
    counterEl.textContent = `${formattedCurrent} / ${formattedTotal}`;
  }

  // Alternar modo visual del body y la capa de desenfoque
  document.body.classList.toggle('mode-slide-national', isNationalSlide);

  if (isMapSlide) {
    document.body.classList.remove('mode-conventional');
    document.body.classList.add('mode-map');
    if (backdrop) backdrop.classList.remove('active');
  } else {
    document.body.classList.remove('mode-map');
    document.body.classList.add('mode-conventional');
    if (backdrop) backdrop.classList.add('active');
    if (isFreeMapMode) toggleFreeMapMode(false);
  }

  // Resaltar chip activo en la barra inferior de Zonas Ancla
  document.querySelectorAll('.anchor-chip').forEach((chip) => {
    const targetSlide = parseInt(chip.getAttribute('data-slide'), 10);
    chip.classList.toggle('active', targetSlide === slideIndex);
  });

  // Si estamos en Modo Offline, sincronizar el videoclip .webm correspondiente y omitir Mapbox
  if (isOfflineMode) {
    updateOfflineVideoForSlide(slideElement, slideIndex);
    return;
  }

  // Asegurar que el contenedor de video esté pausado en Modo Online
  const player = document.getElementById('fallback-player');
  if (player && !player.paused) player.pause();

  // Gestión de marcadores locales vs. nacionales y optimización de terreno
  if (isNationalSlide) {
    // 1. Ocultar marcadores locales de Chancay
    Object.keys(markerElements).forEach((id) => {
      const el = markerElements[id];
      if (el) el.style.display = 'none';
    });

    // 2. Mostrar marcadores nacionales con suave escalonamiento fade-in
    nationalMarkerElements.forEach((el, idx) => {
      el.style.display = 'flex';
      el.style.animationDelay = `${idx * 60}ms`;
    });

    // 3. Optimización: reducir exageración de terreno a 1.0 en vista macro nacional
    if (map && map.setTerrain) {
      map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.0 });
    }
  } else {
    // 1. Ocultar marcadores nacionales
    nationalMarkerElements.forEach((el) => {
      el.style.display = 'none';
    });

    // 2. Restaurar marcadores locales si estamos en slide de mapa local
    Object.keys(markerElements).forEach((id) => {
      const el = markerElements[id];
      if (el) {
        el.style.display = isMapSlide ? 'flex' : 'none';
        el.classList.toggle('active-anchor', parseInt(id, 10) === anchorId);
      }
    });

    // 3. Restaurar exageración natural de relieve (1.4) para Chancay
    if (map && map.setTerrain) {
      map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.4 });
    }
  }

  // Ejecutar transición de cámara en Mapbox 3D
  const centerAttr = slideElement.getAttribute('data-center');
  if (centerAttr && map && mapReady) {
    const rawCoords = centerAttr.split(',').map(Number);
    const zoomLevel = parseFloat(slideElement.getAttribute('data-zoom') || '13.2');
    const pitchLevel = parseFloat(slideElement.getAttribute('data-pitch') || '50');
    const bearingLevel = parseFloat(slideElement.getAttribute('data-bearing') || '0');
    const duration = parseFloat(slideElement.getAttribute('data-duration') || '3400');
    const curve = parseFloat(slideElement.getAttribute('data-curve') || '1.25');

    if (isMapSlide) {
      if (isNationalSlide) {
        // Enfoque Macro Nacional: plano cenital ortogonal (90 grados, pitch: 0) centrado a la izquierda
        map.flyTo({
          center: rawCoords,
          zoom: is1280Mode ? 4.80 : 4.85,
          pitch: 0,
          bearing: 0,
          duration: duration,
          curve: curve,
          speed: parseFloat(slideElement.getAttribute('data-speed') || '0.6'),
          padding: { top: 0, bottom: 0, left: 0, right: 0 },
          easing: cinematicEasing,
          essential: true
        });
      } else {
        const targetCenter = getSplitScreenCenter(rawCoords, zoomLevel, bearingLevel);
        map.flyTo({
          center: targetCenter,
          zoom: zoomLevel,
          pitch: pitchLevel,
          bearing: bearingLevel,
          duration: duration,
          curve: curve,
          padding: { top: 0, bottom: 0, left: 0, right: 0 },
          easing: cinematicEasing,
          essential: true
        });
      }
    } else {
      map.easeTo({
        center: rawCoords,
        zoom: zoomLevel,
        pitch: pitchLevel,
        bearing: bearingLevel,
        duration: 2400,
        padding: { top: 0, bottom: 0, left: 0, right: 0 },
        easing: cinematicEasing,
        essential: true
      });
    }

    const isViasSlide = slideElement.getAttribute('data-geojson') === 'vias';
    if (map.getLayer('vias-mtc-line') && map.getLayer('vias-pdu-line')) {
      map.setPaintProperty('vias-mtc-line', 'line-width', isViasSlide ? 6 : 3.5);
      map.setPaintProperty('vias-pdu-line', 'line-width', isViasSlide ? 6.5 : 3.5);
      map.setPaintProperty('vias-mtc-glow', 'line-opacity', isViasSlide ? 0.5 : 0.18);
      map.setPaintProperty('vias-pdu-glow', 'line-opacity', isViasSlide ? 0.5 : 0.18);
    }
  }
}

Reveal.on('slidechanged', (event) => {
  syncSlideWithMap(event.currentSlide, event.indexh);
});

Reveal.on('ready', (event) => {
  updateConnectionHUD();
  updateResolutionHUD();
  if (isOfflineMode) {
    updateOfflineVideoForSlide(event.currentSlide, event.indexh);
  } else {
    initMapboxInstance();
  }
});

// 12. CONTROLES INTERACTIVOS DEL HUD Y NAVEGACIÓN DE ANCLAS
document.querySelectorAll('.anchor-chip').forEach((button) => {
  button.addEventListener('click', () => {
    const slideIdx = parseInt(button.getAttribute('data-slide'), 10);
    Reveal.slide(slideIdx);
  });
});

function toggleFreeMapMode(forceState) {
  if (isOfflineMode) return;
  isFreeMapMode = typeof forceState === 'boolean' ? forceState : !isFreeMapMode;
  document.body.classList.toggle('free-map-mode', isFreeMapMode);

  const btn = document.getElementById('toggle-map-interact');
  const label = document.getElementById('interact-label');
  if (btn && label) {
    btn.classList.toggle('active', isFreeMapMode);
    label.textContent = isFreeMapMode ? 'Volver a Tarjeta' : 'Explorar Mapa 3D';
  }
}

const interactBtn = document.getElementById('toggle-map-interact');
if (interactBtn) {
  interactBtn.addEventListener('click', () => {
    const currentSlide = Reveal.getCurrentSlide();
    if (currentSlide && currentSlide.getAttribute('data-map') !== 'true') {
      Reveal.slide(3);
      return;
    }
    toggleFreeMapMode();
  });
}

const offlineToggleBtn = document.getElementById('toggle-offline-mode');
if (offlineToggleBtn) {
  offlineToggleBtn.addEventListener('click', () => {
    setOfflineMode(!isOfflineMode);
  });
}

const resolutionToggleBtn = document.getElementById('toggle-resolution-mode');
if (resolutionToggleBtn) {
  resolutionToggleBtn.addEventListener('click', () => {
    setResolutionMode(!is1280Mode);
  });
}

// ============================================================================
// 13. GRABADOR AUTOMÁTICO DE VIDEOCLIPS (.WEBM, 60FPS) CON MEDIARECORDER API
// Captura el canvas de Mapbox + el marcador activo en la mitad izquierda
// ============================================================================
window.recordSingleAnchorClip = function (anchor, durationMs = 5500) {
  return new Promise((resolve, reject) => {
    if (!map || !mapReady) {
      reject(new Error('Mapbox no está inicializado.'));
      return;
    }

    const sourceCanvas = map.getCanvas();
    const compositeCanvas = document.createElement('canvas');
    compositeCanvas.width = 1280;
    compositeCanvas.height = 720;
    const ctx = compositeCanvas.getContext('2d');

    let isRecording = true;
    const startTime = performance.now();

    function renderCompositeFrame(now) {
      if (!isRecording) return;
      const elapsed = (now - startTime) / 1000;

      // 1. Dibujar el frame 3D actual del canvas de Mapbox
      ctx.drawImage(sourceCanvas, 0, 0, compositeCanvas.width, compositeCanvas.height);

      // 2. Proyectar la coordenada del punto ancla sobre el canvas 1280x720
      const projected = map.project(anchor.coords);
      const scaleX = compositeCanvas.width / sourceCanvas.clientWidth;
      const scaleY = compositeCanvas.height / sourceCanvas.clientHeight;
      const px = projected.x * scaleX;
      const py = projected.y * scaleY;

      // 3. Dibujar el pulso animado y el marcador protagonista sobre el punto focal izquierdo
      const pulsePhase = (elapsed % 1.75) / 1.75;
      const pulseRadius = 16 + pulsePhase * 38;
      const pulseAlpha = Math.max(0, (1 - pulsePhase) * 0.65);

      ctx.save();
      ctx.beginPath();
      ctx.arc(px, py, pulseRadius, 0, Math.PI * 2);
      ctx.fillStyle = anchor.hexColor;
      ctx.globalAlpha = pulseAlpha;
      ctx.fill();
      ctx.restore();

      // Núcleo del marcador
      ctx.save();
      ctx.beginPath();
      ctx.arc(px, py, 14, 0, Math.PI * 2);
      ctx.fillStyle = anchor.hexColor;
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();
      ctx.restore();

      // Etiqueta Liquid Glass del marcador activo
      ctx.save();
      ctx.font = '800 15px "Plus Jakarta Sans", sans-serif';
      const textWidth = ctx.measureText(anchor.title).width;
      const boxW = textWidth + 32;
      const boxH = 36;
      const boxX = px - boxW / 2;
      const boxY = py + 20;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.strokeStyle = anchor.hexColor;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(boxX, boxY, boxW, boxH, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#0f172a';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(anchor.title, px, boxY + boxH / 2);
      ctx.restore();

      requestAnimationFrame(renderCompositeFrame);
    }

    requestAnimationFrame(renderCompositeFrame);

    const stream = compositeCanvas.captureStream(60);
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : 'video/webm';

    const recorder = new MediaRecorder(stream, {
      mimeType: mimeType,
      videoBitsPerSecond: 4500000
    });

    const chunks = [];
    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = async () => {
      isRecording = false;
      const blob = new Blob(chunks, { type: 'video/webm' });
      recordedVideoBlobs[anchor.slideIndex] = URL.createObjectURL(blob);

      // Intentar guardar en el servidor local (/save-video) si está disponible
      try {
        await fetch(`/__save_video?name=${encodeURIComponent(anchor.fileName)}`, {
          method: 'POST',
          body: blob
        });
      } catch (_) {
        // Si no hay endpoint de guardado en servidor, descargar en el navegador si fue manual
      }
      resolve(blob);
    };

    recorder.start(200);
    setTimeout(() => {
      if (recorder.state !== 'inactive') recorder.stop();
    }, durationMs);
  });
};

window.recordAllAnchorVideos = async function () {
  if (!map || !mapReady) return;
  for (const anchor of ANCHOR_POINTS) {
    Reveal.slide(anchor.slideIndex);
    // Esperar un instante para capturar tanto la llegada del flyTo como la órbita suave
    await new Promise((r) => setTimeout(r, 800));
    await window.recordSingleAnchorClip(anchor, 5200);
  }
  window.__AUTOCAPTURE_DONE = true;
};
