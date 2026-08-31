import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet broken marker icons in bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

/** Nominatim geocode: city string → [lat, lon] */
async function geocode(city) {
  try {
    const r = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}&limit=1`,
      { headers: { 'Accept-Language': 'en' } }
    );
    const d = await r.json();
    if (!d.length) return null;
    return [parseFloat(d[0].lat), parseFloat(d[0].lon)];
  } catch { return null; }
}

/**
 * OSRM: fetch up to 2 route alternatives.
 * Returns array of [lat,lon][] polylines (at least 1, at most 2).
 */
async function fetchRoutes(from, to) {
  try {
    const url =
      `https://router.project-osrm.org/route/v1/driving/` +
      `${from[1]},${from[0]};${to[1]},${to[0]}` +
      `?overview=full&geometries=geojson&alternatives=true`;
    const r = await fetch(url);
    const d = await r.json();
    if (d.code !== 'Ok' || !d.routes?.length) return null;
    return d.routes.map((rt) =>
      rt.geometry.coordinates.map(([lon, lat]) => [lat, lon])
    );
  } catch { return null; }
}

const PIN_COLORS = ['#06b6d4', '#3b82f6']; // cyan pickup, blue dropoff
const LINE_COLORS = ['#2563eb', '#0d9488']; // blue route-0, teal route-1

/** A pin with a city name label below it */
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
          font-size: 10px;
          font-weight: 700;
          font-family: system-ui, sans-serif;
          padding: 1px 6px;
          border-radius: 999px;
          white-space: nowrap;
          box-shadow: 0 1px 4px rgba(0,0,0,.3);
          letter-spacing: 0.02em;
        ">${label}</div>
      </div>`,
    iconSize: [80, 38],
    iconAnchor: [40, 14],   // anchor on the dot centre
    popupAnchor: [0, -20],
  });

/**
 * Props:
 *   pickup        – city name (string)
 *   dropoff       – city name (string)
 *   routeIndex    – selected card index (0 or 1)
 *   selectedRoute – label shown in bottom chip
 *   height        – map height in px (default 400)
 */
export default function RouteMap({
  pickup,
  dropoff,
  routeIndex = 0,
  selectedRoute,
  height = 400,
}) {
  const containerRef = useRef(null);
  const mapRef       = useRef(null);  // actual map div
  const leafletRef   = useRef(null);  // L.Map instance
  const polysRef     = useRef([]);    // L.Polyline[]
  const markersRef   = useRef([]);

  const [status, setStatus] = useState('idle'); // idle | loading | ok | error

  /* ── 1. Create/destroy Leaflet instance ─────────────────────────── */
  useEffect(() => {
    if (!mapRef.current || leafletRef.current) return;

    const map = L.map(mapRef.current, {
      zoomControl: true,
      scrollWheelZoom: false,   // avoid hijacking page scroll
      attributionControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
    }).addTo(map);

    leafletRef.current = map;

    // Give Leaflet a moment to detect real container size
    setTimeout(() => map.invalidateSize(), 50);

    return () => {
      map.remove();
      leafletRef.current = null;
    };
  }, []);

  /* ── 2. Fetch + draw routes when pickup / dropoff change ─────────── */
  useEffect(() => {
    const map = leafletRef.current;
    if (!map || !pickup || !dropoff) return;

    // Clear old layers
    polysRef.current.forEach((p) => map.removeLayer(p));
    polysRef.current = [];
    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];

    setStatus('loading');
    let dead = false;

    (async () => {
      const [A, B] = await Promise.all([geocode(pickup), geocode(dropoff)]);
      if (dead) return;
      if (!A || !B) { setStatus('error'); return; }

      // Place labeled pin markers
      const mA = L.marker(A, { icon: labeledPinIcon(PIN_COLORS[0], pickup) })
                  .addTo(map);
      const mB = L.marker(B, { icon: labeledPinIcon(PIN_COLORS[1], dropoff) })
                  .addTo(map);
      markersRef.current = [mA, mB];

      // Fetch routes
      const routes = await fetchRoutes(A, B);
      if (dead) return;

      const totalRoutes = routes?.length || 0;

      if (totalRoutes > 0) {
        // Draw all available routes; style based on current routeIndex
        const polys = routes.map((pts, i) => {
          const active = i === routeIndex || (totalRoutes === 1); // if only 1 route, always active
          return L.polyline(pts, {
            color:   LINE_COLORS[i] ?? '#64748b',
            weight:  active ? 5 : 3,
            opacity: active ? 0.88 : 0.25,
            lineJoin: 'round',
            lineCap:  'round',
          }).addTo(map);
        });
        polysRef.current = polys;

        // Fit map to active route
        const activePoly = polys[Math.min(routeIndex, polys.length - 1)];
        map.fitBounds(activePoly.getBounds(), { padding: [48, 48] });
      } else {
        // Fallback dashed straight line
        const fb = L.polyline([A, B], {
          color: '#2563eb', weight: 4, dashArray: '8 6', opacity: 0.65,
        }).addTo(map);
        polysRef.current = [fb];
        map.fitBounds([A, B], { padding: [64, 64] });
      }

      // Force Leaflet to recalculate layout after render
      setTimeout(() => map.invalidateSize(), 10);
      setStatus('ok');
    })();

    return () => { dead = true; };
  }, [pickup, dropoff]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── 3. Update polyline styles when routeIndex changes (no re-fetch) */
  useEffect(() => {
    const map = leafletRef.current;
    if (!map || !polysRef.current.length) return;

    const total = polysRef.current.length;

    polysRef.current.forEach((poly, i) => {
      // If OSRM returned only 1 route → always keep it bold for both cards
      const active = total === 1 ? true : i === routeIndex;
      poly.setStyle({
        weight:  active ? 5 : 3,
        opacity: active ? 0.88 : 0.25,
        color:   LINE_COLORS[i] ?? '#64748b',
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
      className="relative w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm"
      style={{ height }}
    >
      {/* Leaflet renders here — must have explicit px height */}
      <div
        ref={mapRef}
        style={{ width: '100%', height: '100%' }}
      />

      {/* Loading spinner */}
      {status === 'loading' && (
        <div className="absolute inset-0 z-[9999] bg-white/80 backdrop-blur-sm
                        flex flex-col items-center justify-center gap-2">
          <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent
                          rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-600">Loading route…</span>
        </div>
      )}

      {/* Error state */}
      {status === 'error' && (
        <div className="absolute inset-0 z-[9999] bg-slate-50
                        flex flex-col items-center justify-center gap-2">
          <span className="text-4xl">🗺️</span>
          <span className="text-xs font-semibold text-slate-500 text-center px-4">
            Could not find "{pickup}" or "{dropoff}" on the map
          </span>
        </div>
      )}

      {/* Route label chip */}
      {status === 'ok' && selectedRoute && (
        <div className="absolute bottom-3 left-3 right-3 z-[9999] pointer-events-none">
          <div className="bg-white/95 backdrop-blur-sm border border-slate-200
                          rounded-xl px-3 py-2 shadow-sm">
            <p className="text-[11px] font-semibold text-slate-700 truncate">
              {selectedRoute}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
