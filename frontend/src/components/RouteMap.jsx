import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getCityCoordinates } from '../data/indianCities';

// Fix Leaflet broken marker icons in bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

/**
 * OSRM: fetch route coordinates between waypoints.
 * from: [lat, lon], to: [lat, lon], stops: [[lat, lon], ...]
 */
async function fetchRouteWaypoints(waypoints) {
  if (!waypoints || waypoints.length < 2) return null;
  try {
    const coordsStr = waypoints.map(w => `${w[1]},${w[0]}`).join(';');
    const url = `https://router.project-osrm.org/route/v1/driving/${coordsStr}?overview=full&geometries=geojson&alternatives=true`;
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const r = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    const d = await r.json();
    if (d.code !== 'Ok' || !d.routes?.length) return null;
    return d.routes.map((rt) =>
      rt.geometry.coordinates.map(([lon, lat]) => [lat, lon])
    );
  } catch {
    return null;
  }
}

const PIN_COLORS = ['#7c3aed', '#4f46e5']; // purple pickup, indigo dropoff
const LINE_COLORS = ['#7c3aed', '#6366f1']; // purple route-0, indigo route-1

/** A clean pin with a city name badge below it */
const labeledPinIcon = (color, label) =>
  L.divIcon({
    className: '',
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;">
        <div style="
          width: 14px; height: 14px; border-radius: 50%;
          background: ${color}; border: 3px solid #fff;
          box-shadow: 0 2px 8px rgba(0,0,0,.45);
        "></div>
        <div style="
          margin-top: 3px;
          background: ${color};
          color: #fff;
          font-size: 11px;
          font-weight: 800;
          font-family: system-ui, -apple-system, sans-serif;
          padding: 2px 8px;
          border-radius: 999px;
          white-space: nowrap;
          box-shadow: 0 2px 6px rgba(0,0,0,.35);
          letter-spacing: 0.02em;
        ">${label}</div>
      </div>`,
    iconSize: [100, 42],
    iconAnchor: [50, 14], // anchor on the dot center
    popupAnchor: [0, -20],
  });

/**
 * RouteMap Props:
 *   pickup        – city name (string)
 *   dropoff       – city name (string)
 *   stops         – array of intermediate city names
 *   routeIndex    – selected card index (0 or 1)
 *   selectedRoute – label shown in bottom chip
 *   height        – map height in px (default 380)
 */
export default function RouteMap({
  pickup,
  dropoff,
  stops = [],
  routeIndex = 0,
  selectedRoute,
  height = 380,
}) {
  const containerRef = useRef(null);
  const mapRef       = useRef(null);
  const leafletRef   = useRef(null);
  const polysRef     = useRef([]);
  const markersRef   = useRef([]);

  const [status, setStatus] = useState('loading'); // loading | ok | error

  /* ── 1. Create/destroy Leaflet instance ─────────────────────────── */
  useEffect(() => {
    if (!mapRef.current || leafletRef.current) return;

    const map = L.map(mapRef.current, {
      zoomControl: true,
      scrollWheelZoom: false,
      attributionControl: false,
      center: [12.5, 78.5], // Default view on South/Central India
      zoom: 6,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
    }).addTo(map);

    leafletRef.current = map;

    // Refresh size when DOM is ready
    setTimeout(() => map.invalidateSize(), 80);
    setTimeout(() => map.invalidateSize(), 300);

    return () => {
      map.remove();
      leafletRef.current = null;
    };
  }, []);

  /* ── 2. Fetch + draw routes when pickup / dropoff / stops change ─────────── */
  useEffect(() => {
    const map = leafletRef.current;
    if (!map) return;
    if (!pickup || !dropoff) {
      setStatus('idle');
      return;
    }

    // Clear old layers
    polysRef.current.forEach((p) => map.removeLayer(p));
    polysRef.current = [];
    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];

    setStatus('loading');
    let dead = false;

    (async () => {
      // 1. Resolve coordinates using fast built-in dataset
      const [A, B] = await Promise.all([
        getCityCoordinates(pickup),
        getCityCoordinates(dropoff)
      ]);

      if (dead) return;
      if (!A || !B) {
        setStatus('error');
        return;
      }

      // 2. Place labeled pin markers
      const mA = L.marker(A, { icon: labeledPinIcon(PIN_COLORS[0], pickup) }).addTo(map);
      const mB = L.marker(B, { icon: labeledPinIcon(PIN_COLORS[1], dropoff) }).addTo(map);
      const newMarkers = [mA, mB];

      // 3. Resolve intermediate stop coordinates
      const stopPoints = [];
      if (stops && stops.length > 0) {
        const stopCoords = await Promise.all(stops.map((s) => getCityCoordinates(s)));
        if (!dead) {
          stopCoords.forEach((coord, idx) => {
            if (coord) {
              stopPoints.push(coord);
              const sm = L.marker(coord, { icon: labeledPinIcon('#f59e0b', stops[idx]) }).addTo(map);
              newMarkers.push(sm);
            }
          });
        }
      }

      markersRef.current = newMarkers;

      // 4. Fetch routes through all waypoints: [A, ...stops, B]
      const waypoints = [A, ...stopPoints, B];
      const routes = await fetchRouteWaypoints(waypoints);
      if (dead) return;

      const totalRoutes = routes?.length || 0;

      if (totalRoutes > 0) {
        // Draw real highway routes
        const polys = routes.map((pts, i) => {
          const active = i === routeIndex || totalRoutes === 1;
          return L.polyline(pts, {
            color: LINE_COLORS[i] ?? '#7c3aed',
            weight: active ? 5 : 3,
            opacity: active ? 0.92 : 0.35,
            lineJoin: 'round',
            lineCap: 'round',
          }).addTo(map);
        });
        polysRef.current = polys;

        const activePoly = polys[Math.min(routeIndex, polys.length - 1)];
        map.fitBounds(activePoly.getBounds(), { padding: [48, 48] });
      } else {
        // Smooth connected road line fallback
        const fb = L.polyline(waypoints, {
          color: '#7c3aed',
          weight: 4,
          dashArray: '8 6',
          opacity: 0.85,
        }).addTo(map);
        polysRef.current = [fb];
        map.fitBounds(waypoints, { padding: [56, 56] });
      }

      // Ensure proper tile rendering
      setTimeout(() => map.invalidateSize(), 50);
      setTimeout(() => map.invalidateSize(), 200);
      setStatus('ok');
    })();

    return () => {
      dead = true;
    };
  }, [pickup, dropoff, JSON.stringify(stops)]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── 3. Update polyline styles when routeIndex changes ────────────────── */
  useEffect(() => {
    const map = leafletRef.current;
    if (!map || !polysRef.current.length) return;

    const total = polysRef.current.length;
    polysRef.current.forEach((poly, i) => {
      const active = total === 1 ? true : i === routeIndex;
      poly.setStyle({
        weight: active ? 5 : 3,
        opacity: active ? 0.92 : 0.35,
        color: LINE_COLORS[i] ?? '#7c3aed',
      });
      if (active) {
        poly.bringToFront();
        map.fitBounds(poly.getBounds(), { padding: [48, 48], animate: true });
      }
    });
  }, [routeIndex]);

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-2xl overflow-hidden border border-purple-200/90 shadow-sm bg-slate-100"
      style={{ height }}
    >
      {/* Leaflet container */}
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

      {/* Loading overlay */}
      {status === 'loading' && (
        <div className="absolute inset-0 z-[9999] bg-white/70 backdrop-blur-xs flex flex-col items-center justify-center gap-2">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold text-purple-900">Drawing highway route…</span>
        </div>
      )}

      {/* Error state */}
      {status === 'error' && (
        <div className="absolute inset-0 z-[9999] bg-slate-50 flex flex-col items-center justify-center gap-2">
          <span className="text-4xl">🗺️</span>
          <span className="text-xs font-semibold text-slate-500 text-center px-4">
            Could not find "{pickup}" or "{dropoff}" on the map.
          </span>
        </div>
      )}

      {/* Route badge chip */}
      {status === 'ok' && selectedRoute && (
        <div className="absolute bottom-3 left-3 right-3 z-[9999] pointer-events-none">
          <div className="bg-white/95 backdrop-blur-sm border border-purple-100 rounded-xl px-3 py-2 shadow-md">
            <p className="text-[11px] font-bold text-purple-900 truncate">
              {selectedRoute}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
