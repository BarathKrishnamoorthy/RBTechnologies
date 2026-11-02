import AsyncStorage from '@react-native-async-storage/async-storage';

// Popular starter hubs for instant quick picks before user types
export const POPULAR_CITIES = [
  { name: 'Chennai', state: 'Tamil Nadu', hubs: 'Koyambedu, Guindy, Airport', coords: [13.0827, 80.2707] },
  { name: 'Bengaluru', state: 'Karnataka', hubs: 'Silk Board, Majestic, Electronic City', coords: [12.9716, 77.5946] },
  { name: 'Salem', state: 'Tamil Nadu', hubs: 'New Bus Stand, Junction, Steel Plant', coords: [11.6643, 78.1460] },
  { name: 'Coimbatore', state: 'Tamil Nadu', hubs: 'Gandhipuram, Hope College, Singanallur', coords: [11.0168, 76.9558] },
  { name: 'Madurai', state: 'Tamil Nadu', hubs: 'Mattuthavani, Periyar, Arapalayam', coords: [9.9252, 78.1198] },
  { name: 'Tiruchirappalli', state: 'Tamil Nadu', hubs: 'Central Bus Stand, Chathiram', coords: [10.7905, 78.7047] },
  { name: 'Mumbai', state: 'Maharashtra', hubs: 'Dadar, Borivali, Vashi, BKC', coords: [19.0760, 72.8777] },
  { name: 'Pune', state: 'Maharashtra', hubs: 'Wakad, Shivajinagar, Hinjewadi', coords: [18.5204, 73.8567] },
  { name: 'Hyderabad', state: 'Telangana', hubs: 'Gachibowli, Hitec City, Ameerpet', coords: [17.3850, 78.4867] },
  { name: 'Delhi', state: 'NCR', hubs: 'Connaught Place, Kashmere Gate, Noida', coords: [28.6139, 77.2090] },
  { name: 'Jaipur', state: 'Rajasthan', hubs: 'Sindhi Camp, Malviya Nagar', coords: [26.9124, 75.7873] },
  { name: 'Kochi', state: 'Kerala', hubs: 'Vyttila Hub, Kakkanad, Aluva', coords: [9.9312, 76.2673] }
];

const MEMORY_CACHE = new Map();

// Initialize memory cache
POPULAR_CITIES.forEach((c) => {
  MEMORY_CACHE.set(c.name.toLowerCase(), c.coords);
  MEMORY_CACHE.set(`${c.name.toLowerCase()}, ${c.state.toLowerCase()}`, c.coords);
});

/**
 * Live external map typeahead search for React Native (iOS & Android)
 * Powered by OpenStreetMap Photon with Nominatim fallback.
 */
export async function searchCities(query, limit = 8) {
  if (!query || !query.trim()) {
    return POPULAR_CITIES.slice(0, limit).map((c) => ({
      name: c.name,
      display: `${c.name}, ${c.state}`,
      state: c.state,
      country: 'India',
      coords: c.coords,
      hubs: c.hubs,
      type: 'popular',
    }));
  }

  const clean = query.trim().toLowerCase();

  // Try Memory Cache
  if (MEMORY_CACHE.has(`search:${clean}`)) {
    return MEMORY_CACHE.get(`search:${clean}`);
  }

  let results = [];

  // 1. External Map API: Photon (Komoot OSM)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);
    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(clean)}&limit=${Math.max(10, limit * 2)}&lat=20.5937&lon=78.9629`;
    
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (response.ok) {
      const data = await response.json();
      const seen = new Set();

      for (const f of data.features || []) {
        const p = f.properties || {};
        if (p.countrycode && p.countrycode.toUpperCase() !== 'IN') continue;
        if (p.type === 'street') continue;

        const name = p.name;
        if (!name) continue;
        const state = p.state || '';
        const key = `${name}|${state}`.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);

        const coords = f.geometry?.coordinates
          ? [f.geometry.coordinates[1], f.geometry.coordinates[0]] // [lat, lon]
          : null;

        if (coords) {
          MEMORY_CACHE.set(name.toLowerCase(), coords);
          if (state) MEMORY_CACHE.set(`${name.toLowerCase()}, ${state.toLowerCase()}`, coords);
        }

        let placeType = 'city';
        if (p.osm_value === 'town') placeType = 'town';
        else if (p.osm_value === 'village') placeType = 'village';
        else if (p.osm_key === 'aeroway' || name.toLowerCase().includes('airport')) placeType = 'airport';
        else if (p.osm_key === 'railway' || name.toLowerCase().includes('station') || name.toLowerCase().includes('junction')) placeType = 'station';
        else if (p.type === 'county') placeType = 'district';

        results.push({
          name,
          display: state ? `${name}, ${state}` : name,
          state,
          country: p.country || 'India',
          coords,
          type: placeType,
        });

        if (results.length >= limit) break;
      }
    }
  } catch {
    // Continue to fallback
  }

  // 2. Nominatim Fallback
  if (results.length === 0) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3500);
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(clean)}&countrycodes=in&limit=${limit}&addressdetails=1`;
      
      const response = await fetch(url, {
        headers: { 'User-Agent': 'RBRidesMobile/1.0', 'Accept-Language': 'en' },
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (response.ok) {
        const data = await response.json();
        const seen = new Set();

        results = (data || []).map((item) => {
          const addr = item.address || {};
          const name = addr.city || addr.town || addr.village || addr.county || item.name || item.display_name.split(',')[0];
          const state = addr.state || '';
          const key = `${name}|${state}`.toLowerCase();
          if (seen.has(key)) return null;
          seen.add(key);

          const coords = [parseFloat(item.lat), parseFloat(item.lon)];
          MEMORY_CACHE.set(name.toLowerCase(), coords);

          return {
            name,
            display: state ? `${name}, ${state}` : name,
            state,
            country: addr.country || 'India',
            coords,
            type: item.type || 'city',
          };
        }).filter(Boolean);
      }
    } catch {
      // Offline fallback
    }
  }

  // 3. Offline fallback to starter hubs
  if (results.length === 0) {
    results = POPULAR_CITIES.filter((c) =>
      c.name.toLowerCase().includes(clean) || c.state.toLowerCase().includes(clean)
    ).map((c) => ({
      name: c.name,
      display: `${c.name}, ${c.state}`,
      state: c.state,
      country: 'India',
      coords: c.coords,
      type: 'popular',
    })).slice(0, limit);
  }

  MEMORY_CACHE.set(`search:${clean}`, results);
  return results;
}

/**
 * Dynamic Geocoding function: Resolves city string to [lat, lon]
 */
export async function getCityCoordinates(cityStr) {
  if (!cityStr || typeof cityStr !== 'string') return null;

  const raw = cityStr.trim();
  const lower = raw.toLowerCase();

  if (MEMORY_CACHE.has(lower)) return MEMORY_CACHE.get(lower);

  const primary = lower.split(',')[0].trim();
  if (MEMORY_CACHE.has(primary)) return MEMORY_CACHE.get(primary);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(raw + ', India')}&limit=1&lat=20.5937&lon=78.9629`;
    
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (response.ok) {
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        const coords = [
          data.features[0].geometry.coordinates[1],
          data.features[0].geometry.coordinates[0],
        ];
        MEMORY_CACHE.set(lower, coords);
        MEMORY_CACHE.set(primary, coords);
        return coords;
      }
    }
  } catch {}

  return null;
}

/**
 * Haversine road distance calculation with Indian highway winding factor (1.22x)
 */
export function calculateRoadDistanceKm(coord1, coord2) {
  if (!coord1 || !coord2) return 300;
  const [lat1, lon1] = coord1;
  const [lat2, lon2] = coord2;

  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const airDistance = R * c;

  return Math.round(airDistance * 1.22);
}
