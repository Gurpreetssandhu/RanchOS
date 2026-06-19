import type { Map as MapLibreMap, StyleSpecification } from 'maplibre-gl';

// Esri World Street Map. The previous OpenStreetMap tile server (tile.openstreetmap.org)
// aborts/blocks our requests, leaving a blank base map. Esri serves both the street
// and satellite (see addSatelliteLayer) imagery reliably from this environment and
// needs no API key.
const FALLBACK_MAP_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    'esri-street': {
      type: 'raster',
      tiles: [
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
      ],
      tileSize: 256,
      attribution: 'Tiles &copy; Esri and the GIS user community',
    },
  },
  layers: [
    {
      id: 'esri-street-raster',
      type: 'raster',
      source: 'esri-street',
    },
  ],
};

export function getMapStyle() {
  const customStyleUrl = process.env.NEXT_PUBLIC_MAP_STYLE_URL?.trim();
  return customStyleUrl || FALLBACK_MAP_STYLE;
}

export type BaseMapMode = 'street' | 'satellite';

export const SATELLITE_SOURCE_ID = 'ranchos-satellite';
export const SATELLITE_LAYER_ID = 'ranchos-satellite-layer';

/**
 * Adds a satellite imagery layer (Esri World Imagery, no API key required).
 *
 * The raster is opaque, so it is inserted directly on top of the base street
 * map but BEFORE any data layers (blocks, boundaries, drawing tools) are added.
 * Toggling its visibility therefore swaps street <-> satellite while keeping all
 * overlays on top. Call this first inside the map's `load` handler.
 */
export function addSatelliteLayer(map: MapLibreMap) {
  if (map.getSource(SATELLITE_SOURCE_ID)) {
    return;
  }

  map.addSource(SATELLITE_SOURCE_ID, {
    type: 'raster',
    tiles: [
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    ],
    tileSize: 256,
    attribution: 'Imagery &copy; Esri, Maxar, Earthstar Geographics, and the GIS community',
  });

  map.addLayer({
    id: SATELLITE_LAYER_ID,
    type: 'raster',
    source: SATELLITE_SOURCE_ID,
    layout: { visibility: 'none' },
  });
}

/** Switches the visible base map between the street and satellite layers. */
export function setBaseMap(map: MapLibreMap, mode: BaseMapMode) {
  if (!map.getLayer(SATELLITE_LAYER_ID)) {
    return;
  }

  map.setLayoutProperty(
    SATELLITE_LAYER_ID,
    'visibility',
    mode === 'satellite' ? 'visible' : 'none',
  );
}
