/**
 * ============================================================================
 * PONENCIA CIENCIA POLÍTICA: CASO CHANCAY (2024–2026)
 * Arquitectura Híbrida Scrollytelling: Reveal.js v5 + Mapbox GL JS v3 (3D)
 * ============================================================================
 */

// 1. TOKEN OFICIAL MAPBOX GL JS
mapboxgl.accessToken = 'pk.eyJ1IjoiZGFzZTFubiIsImEiOiJjbXc2cnV1eW4wY2kwMnlxdmVjbDlra2pzIn0.0b7H2sikoaR0BUtJv-eDeQ';

// 2. DEFINICIÓN DE LAS 6 ZONAS ANCLA (MARCADORES INTERACTIVOS HTML/CSS)
const ANCHOR_POINTS = [
  {
    id: 1,
    slideIndex: 3, // Slide 4 (0-based index: 3)
    title: '01 · Distrito de Chancay (Escala Distrital)',
    subtitle: 'Brechas: 30% sin agua · 27% sin desagüe · 65% vías sin pavimentar',
    coords: [-77.2680, -11.5700],
    colorClass: 'marker-cyan'
  },
  {
    id: 2,
    slideIndex: 4, // Slide 5
    title: '02 · Terminal Portuario Multipropósito (CSPCP)',
    subtitle: 'Punta Chancay · Inversión > US$ 1,300M (Bloqueo de facto corporativo)',
    coords: [-77.2785, -11.5835],
    colorClass: 'marker-amber'
  },
  {
    id: 3,
    slideIndex: 5, // Slide 6
    title: '03 · Sector Peralvillo y Bahía El Cascajo',
    subtitle: 'Subsidencia túnel (mayo 2023) · Ausencia de PTAR (OEFA)',
    coords: [-77.2710, -11.5880],
    colorClass: 'marker-rose'
  },
  {
    id: 4,
    slideIndex: 6, // Slide 7
    title: '04 · Controversia Vía de Evitamiento (MTC vs. PDU)',
    subtitle: '3,657 rechazos ciudadanos al trazo costero del MTC',
    coords: [-77.2755, -11.5475], // Centrado en el quiebre costero de La Calichera
    colorClass: 'marker-amber'
  },
  {
    id: 5,
    slideIndex: 7, // Slide 8
    title: '05 · Municipalidad Distrital de Chancay (MDCH)',
    subtitle: 'Plaza de Armas · 21 plazas CAP · PIM S/ 40.9M (7.1% ejec. T1)',
    coords: [-77.2669, -11.5633],
    colorClass: 'marker-cyan'
  },
  {
    id: 6,
    slideIndex: 8, // Slide 9
    title: '06 · A.H. Cerro La Culebra (Periferia Este)',
    subtitle: 'Conflicto por obras de saneamiento paralizadas desde 2022',
    coords: [-77.2550, -11.5580],
    colorClass: 'marker-rose'
  }
];

// 3. CAPAS GEOJSON DE ALTA PRECISIÓN CARTOGRÁFICA (SEGÚN MAPA 3.5-7 DEL PDU CHANCAY P. 186)

// 3.1. Propuesta MTC (Trazo Costero Rechazado: Corta por La Calichera y Playa Acapulco hacia Chancayllo)
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
          [-77.2320, -11.6150], // Ingreso Sur (Panamericana Norte desde Ancón/Pasamayo)
          [-77.2435, -11.6015], // Cruce Río Chancay / Las Salinas Sur
          [-77.2525, -11.5940], // Las Salinas Norte
          [-77.2585, -11.5855], // Este de Peralvillo / Acceso al Puerto
          [-77.2605, -11.5775], // Eje Panamericana Sur de Chancay
          [-77.2618, -11.5695], // Borde Este del casco urbano de Chancay
          [-77.2642, -11.5630], // Salida Norte de Chancay (inicio del desvío al litoral)
          [-77.2695, -11.5565], // Diagonal hacia la costa (Las Salinas / Chorrillos Norte)
          [-77.2748, -11.5495], // Entrada al frente costero La Calichera
          [-77.2768, -11.5465], // La Calichera (Borde Litoral)
          [-77.2798, -11.5405], // Franja costera al Oeste de Los Laureles Sur y Norte
          [-77.2835, -11.5335], // Borde costero al Oeste de Ex Hacienda Chancayllo
          [-77.2858, -11.5290], // Playa Acapulco (separa expansión urbana del mar)
          [-77.2882, -11.5220], // Borde litoral al Oeste de Limoncillo y Los Álamos
          [-77.2892, -11.5150], // Extremo Noroeste Playa Acapulco
          [-77.2885, -11.5095], // Curva de retorno hacia la Panamericana al Norte de Chancayllo
          [-77.2852, -11.5042], // Empalme con Vía Panamericana Norte (San José / 4 de Junio)
          [-77.2965, -11.4910], // Continuación Panamericana Norte
          [-77.3180, -11.4725]  // Sector El Hatillo
        ]
      }
    }
  ]
};

// 3.2. Propuesta PDU Chancay (Trazo Alternativo Este: Quepepampa – Cerro La Culebra – Pampa Libre – San Cayetano)
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
          [-77.2320, -11.6150], // Ingreso Sur (Panamericana Norte)
          [-77.2435, -11.6015], // Cruce Río Chancay / Las Salinas
          [-77.2525, -11.5940], // Las Salinas Norte
          [-77.2572, -11.5855], // Borde Oriental de Peralvillo / Chancay Park
          [-77.2592, -11.5750], // Contorno Este de Chancay
          [-77.2582, -11.5655], // Buena Vista Baja / Los Tilos
          [-77.2555, -11.5595], // 28 de Julio / Buena Vista
          [-77.2505, -11.5535], // Torre Blanca (Apertura hacia el Este)
          [-77.2445, -11.5475], // Quepepampa
          [-77.2392, -11.5415], // Ascenso hacia Cerro La Culebra
          [-77.2362, -11.5355], // Vértice Este: Cerro La Culebra Sur
          [-77.2358, -11.5310], // Vértice Este: Cerro La Culebra Norte
          [-77.2395, -11.5245], // Arco Noreste (Exterior de Pampas Los Huacos)
          [-77.2455, -11.5175], // Contorno Este de Pampa Libre
          [-77.2528, -11.5105], // Diagonal Noroeste hacia San Cayetano
          [-77.2605, -11.5038], // Aproximación a San Cayetano
          [-77.2675, -11.5002], // San Cayetano (Norte de Chancayllo)
          [-77.2755, -11.5012], // Tramo transversal Norte de Chancayllo
          [-77.2852, -11.5042]  // Reingreso a Vía Panamericana Norte (San José / 4 de Junio)
        ]
      }
    }
  ]
};

// 3.3. Hitos Toponímicos del Mapa 3.5-7 del PDU Chancay para lectura cartográfica directa
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

// 3.4. Corredor Subterráneo del Túnel Viaducto (Punta Chancay – Peralvillo – Zona Operativa Sur)
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
          [-77.2785, -11.5835], // Complejo Operativo Punta Chancay
          [-77.2710, -11.5880], // Sector Peralvillo (Zona de subsidencia mayo 2023)
          [-77.2605, -11.5925]  // Zona Logística Portuaria / Empalme Sur
        ]
      }
    }
  ]
};

// 4. INICIALIZACIÓN DEL MAPA 3D CON ESTILO ESTRICTAMENTE SATELLITE-STREETS-V12
let mapReady = false;
let isFreeMapMode = false;
const markerElements = {};

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/satellite-streets-v12',
  center: [-77.2680, -11.5700],
  zoom: 12.8,
  pitch: 45,
  bearing: -15,
  antialias: true,
  projection: 'globe'
});

// Controles de navegación (zoom + brújula 3D) en la esquina inferior izquierda
map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'bottom-left');

map.on('style.load', () => {
  const styleLayers = map.getStyle().layers || [];

  // 1. Garantizar que ninguna capa de tipo 'fill' oculte la fotografía satelital
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

  // 2. Ortofoto satelital continua de alta resolución hasta zoom 19
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

  // 3. TERRENO 3D (mapbox-dem con exaggeration: 2.5)
  if (!map.getSource('mapbox-dem')) {
    map.addSource('mapbox-dem', {
      type: 'raster-dem',
      tiles: [
        'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'
      ],
      encoding: 'terrarium',
      tileSize: 256,
      maxzoom: 14
    });
  }

  map.setTerrain({
    source: 'mapbox-dem',
    exaggeration: 1.85
  });

  // 4. EXTRUSIÓN DE EDIFICIOS 3D (nacen directamente de la fotografía satelital)
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

  // 5. NIEBLA ATMOSFÉRICA DIURNA
  map.setFog({
    'range': [2.0, 10],
    'color': '#e0f2fe',
    'high-color': '#bae6fd',
    'space-color': '#f8fafc',
    'horizon-blend': 0.06
  });

  // 6. FUENTES Y CAPAS GEOJSON (Vía de Evitamiento MTC vs. PDU, Hitos y Corredor Túnel)
  map.addSource('vias-mtc-source', {
    type: 'geojson',
    data: GEOJSON_MTC_COASTAL
  });

  map.addSource('vias-pdu-source', {
    type: 'geojson',
    data: GEOJSON_PDU_EAST
  });

  map.addSource('pdu-landmarks-source', {
    type: 'geojson',
    data: GEOJSON_PDU_LANDMARKS
  });

  map.addSource('port-corridor-source', {
    type: 'geojson',
    data: GEOJSON_PORT_CORRIDOR
  });

  // Halo exterior para el trazo del MTC (Rojo)
  map.addLayer({
    id: 'vias-mtc-glow',
    type: 'line',
    source: 'vias-mtc-source',
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': '#ef4444',
      'line-width': 12,
      'line-opacity': 0.32,
      'line-blur': 4
    }
  });

  // Línea roja punteada por La Calichera y Playa Acapulco (Propuesta inicial del MTC)
  map.addLayer({
    id: 'vias-mtc-line',
    type: 'line',
    source: 'vias-mtc-source',
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': '#ef4444',
      'line-width': 4.5,
      'line-dasharray': [2, 1.4],
      'line-opacity': 0.98
    }
  });

  // Halo exterior para el trazo alternativo del PDU (Cian/Azul)
  map.addLayer({
    id: 'vias-pdu-glow',
    type: 'line',
    source: 'vias-pdu-source',
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': '#0284c7',
      'line-width': 12,
      'line-opacity': 0.35,
      'line-blur': 4
    }
  });

  // Línea verde/cian continua hacia el Este por Quepepampa y Cerro La Culebra (Propuesta PDU)
  map.addLayer({
    id: 'vias-pdu-line',
    type: 'line',
    source: 'vias-pdu-source',
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': '#22d3ee',
      'line-width': 5,
      'line-opacity': 0.98
    }
  });

  // Puntos y etiquetas de referencia del Mapa 3.5-7 (La Calichera, Playa Acapulco, Quepepampa, Cerro La Culebra, San Cayetano)
  map.addLayer({
    id: 'pdu-landmarks-circles',
    type: 'circle',
    source: 'pdu-landmarks-source',
    paint: {
      'circle-radius': 5.5,
      'circle-color': [
        'match',
        ['get', 'category'],
        'mtc', '#ef4444',
        'pdu', '#22d3ee',
        '#f59e0b'
      ],
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff'
    }
  });

  map.addLayer({
    id: 'pdu-landmarks-labels',
    type: 'symbol',
    source: 'pdu-landmarks-source',
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

  // Corredor del túnel viaducto (Punta Chancay - Peralvillo)
  map.addLayer({
    id: 'port-corridor-line',
    type: 'line',
    source: 'port-corridor-source',
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': '#f59e0b',
      'line-width': 4,
      'line-dasharray': [1.2, 1.2],
      'line-opacity': 0.95
    }
  });

  // 7. Crear Marcadores HTML/CSS con Pulso Animado para las 6 Zonas Ancla
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

  mapReady = true;

  // Sincronizar con la diapositiva activa actual
  const currentSlide = Reveal.getCurrentSlide();
  if (currentSlide) {
    syncSlideWithMap(currentSlide, Reveal.getIndices().h);
  }
});

// Actualizar telemetría en tiempo real durante el vuelo de helicóptero
// Actualizar telemetría con requestAnimationFrame para evitar micro-pausas de DOM durante el vuelo 60fps
let telemetryRaf = null;
map.on('move', () => {
  if (telemetryRaf) return;
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

// Función de suavizado sinusoidal (easeInOutSine): aceleración y frenado orgánicos sin tirones en zoom in / zoom out
function cinematicEasing(t) {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

// Calcula el centro geográfico desplazado hacia la derecha de la cámara (según zoom y bearing)
// para que el marcador quede en la mitad izquierda libre de la pantalla sin usar `offset` brusco sobre el terreno 3D
function getSplitScreenCenter(coords, zoomLevel, bearingLevel) {
  const [lng, lat] = coords;
  const shiftPixelsRight = window.innerWidth * 0.21;
  const worldSize = 512 * Math.pow(2, zoomLevel);
  const degPerPixel = 360 / worldSize;
  const rightAngleRad = ((bearingLevel + 90) * Math.PI) / 180;
  const latRad = (lat * Math.PI) / 180;

  const dLng = shiftPixelsRight * degPerPixel * Math.sin(rightAngleRad);
  const dLat = shiftPixelsRight * degPerPixel * Math.cos(rightAngleRad) * Math.cos(latRad);

  return [lng + dLng, lat + dLat];
}

// 5. INICIALIZACIÓN DE REVEAL.JS v5
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

// 6. FUNCIÓN DE SINCRONIZACIÓN DE CÁMARA ("EFECTO HELICÓPTERO" FLUIDO + ENCUADRE SPLIT BALANCEADO)
function syncSlideWithMap(slideElement, slideIndex) {
  if (!slideElement) return;

  const isMapSlide = slideElement.getAttribute('data-map') === 'true';
  const anchorId = parseInt(slideElement.getAttribute('data-anchor') || '0', 10);
  const backdrop = document.getElementById('map-backdrop');

  // Actualizar contador de diapositivas (01 / 12)
  const totalSlides = Reveal.getTotalSlides();
  const counterEl = document.getElementById('slide-counter');
  if (counterEl) {
    const formattedCurrent = String(slideIndex + 1).padStart(2, '0');
    const formattedTotal = String(totalSlides).padStart(2, '0');
    counterEl.textContent = `${formattedCurrent} / ${formattedTotal}`;
  }

  // Alternar modo visual del body y la capa de desenfoque
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

  // Resaltar marcador activo en el mapa 3D
  Object.keys(markerElements).forEach((id) => {
    const el = markerElements[id];
    if (el) {
      el.classList.toggle('active-anchor', parseInt(id, 10) === anchorId);
    }
  });

  // Leer atributos de cámara de la diapositiva y ejecutar transición cinemática ultra-suave
  const centerAttr = slideElement.getAttribute('data-center');
  if (centerAttr && mapReady) {
    const rawCoords = centerAttr.split(',').map(Number);
    const zoomLevel = parseFloat(slideElement.getAttribute('data-zoom') || '13.2');
    const pitchLevel = parseFloat(slideElement.getAttribute('data-pitch') || '50');
    const bearingLevel = parseFloat(slideElement.getAttribute('data-bearing') || '0');
    const duration = parseFloat(slideElement.getAttribute('data-duration') || '3400');
    const curve = parseFloat(slideElement.getAttribute('data-curve') || '1.25');

    // En las diapositivas de mapa (4 a 9), calculamos el centro geográfico compensado para ubicar el punto en la mitad izquierda
    const targetCenter = isMapSlide
      ? getSplitScreenCenter(rawCoords, zoomLevel, bearingLevel)
      : rawCoords;

    if (isMapSlide) {
      map.flyTo({
        center: targetCenter,
        zoom: zoomLevel,
        pitch: pitchLevel,
        bearing: bearingLevel,
        duration: duration,
        curve: curve,
        easing: cinematicEasing,
        essential: true
      });
    } else {
      map.easeTo({
        center: targetCenter,
        zoom: zoomLevel,
        pitch: pitchLevel,
        bearing: bearingLevel,
        duration: 2400,
        easing: cinematicEasing,
        essential: true
      });
    }

    // Ajustar intensidad de las capas GeoJSON cuando estamos en la Slide 7 (Ancla 4 - Vía de Evitamiento)
    const isViasSlide = slideElement.getAttribute('data-geojson') === 'vias';
    if (map.getLayer('vias-mtc-line') && map.getLayer('vias-pdu-line')) {
      map.setPaintProperty('vias-mtc-line', 'line-width', isViasSlide ? 6 : 3.5);
      map.setPaintProperty('vias-pdu-line', 'line-width', isViasSlide ? 6.5 : 3.5);
      map.setPaintProperty('vias-mtc-glow', 'line-opacity', isViasSlide ? 0.5 : 0.18);
      map.setPaintProperty('vias-pdu-glow', 'line-opacity', isViasSlide ? 0.5 : 0.18);
    }
  }
}

// Escuchar cambios de diapositiva en Reveal.js
Reveal.on('slidechanged', (event) => {
  syncSlideWithMap(event.currentSlide, event.indexh);
});

// 7. CONTROLES INTERACTIVOS DEL HUD Y NAVEGACIÓN DE ANCLAS
document.querySelectorAll('.anchor-chip').forEach((button) => {
  button.addEventListener('click', () => {
    const slideIdx = parseInt(button.getAttribute('data-slide'), 10);
    Reveal.slide(slideIdx);
  });
});

function toggleFreeMapMode(forceState) {
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
