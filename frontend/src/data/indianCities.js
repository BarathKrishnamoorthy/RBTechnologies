/**
 * Dynamic Indian Cities, Towns & Geocoding via External Map APIs
 * Powered by OpenStreetMap Photon & Nominatim APIs with fast in-memory caching
 */

// Popular starter hubs for instant 1-click recommendations and offline resilience
export const INDIAN_CITIES = [
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
  { name: 'Kolkata', state: 'West Bengal', hubs: 'Esplanade, Howrah, Salt Lake', coords: [22.5726, 88.3639] },
  { name: 'Kochi', state: 'Kerala', hubs: 'Vyttila Hub, Edappally, Kakkanad', coords: [9.9312, 76.2673] },
  { name: 'Ahmedabad', state: 'Gujarat', hubs: 'Geeta Mandir, SG Highway, ISKCON', coords: [23.0225, 72.5714] }
];

export const POPULAR_CITIES = INDIAN_CITIES;

/** In-memory caches for instantaneous lookups */
const COORDS_CACHE = new Map();
const SEARCH_CACHE = new Map();

// Pre-seed caches with popular starter hubs
INDIAN_CITIES.forEach((c) => {
  const clean = c.name.toLowerCase().trim();
  COORDS_CACHE.set(clean, c.coords);
  COORDS_CACHE.set(`${clean}, ${c.state.toLowerCase()}`, c.coords);
  COORDS_CACHE.set(`${clean}, india`, c.coords);
});

/** Fast lookup map for backward compatibility */
export const CITY_COORDS_MAP = new Proxy({}, {
  get: (_, prop) => {
    if (typeof prop !== 'string') return undefined;
    return COORDS_CACHE.get(prop.toLowerCase().trim());
  },
  has: (_, prop) => {
    if (typeof prop !== 'string') return false;
    return COORDS_CACHE.has(prop.toLowerCase().trim());
  }
});

/**
 * Dynamically search Indian cities, towns, and transport hubs using external Map API.
 * Uses Photon OSM (ultra-fast typeahead geocoding) with automatic fallback to OSM Nominatim.
 *
 * @param {string} query - The search query typed by the user (e.g. "Salem", "Kallakurichi")
 * @param {number} maxResults - Max suggestions to return (default: 8)
 * @returns {Promise<Array<{ name: string, display: string, state: string, country: string, coords: [number, number], type: string }>>}
 */
export async function searchIndianCities(query, maxResults = 8) {
  if (!query || typeof query !== 'string' || !query.trim()) {
    return INDIAN_CITIES.slice(0, maxResults).map((c) => ({
      name: c.name,
      display: `${c.name}, ${c.state}`,
      state: c.state,
      country: 'India',
      coords: c.coords,
      hubs: c.hubs,
      type: 'popular'
    }));
  }

  const clean = query.trim().toLowerCase();

  // Return from search cache if available
  if (SEARCH_CACHE.has(clean)) {
    return SEARCH_CACHE.get(clean);
  }

  let results = [];

  // 1. Try Photon (Komoot OSM Geocoding Engine) biased toward India [lat: 20.5937, lon: 78.9629]
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(clean)}&limit=${Math.max(12, maxResults * 2)}&lat=20.5937&lon=78.9629`;
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const seen = new Set();

      for (const feature of data.features || []) {
        const p = feature.properties || {};
        
        // Filter out non-India results if countrycode is specified
        if (p.countrycode && p.countrycode.toUpperCase() !== 'IN') continue;
        // Skip pure streets to keep suggestions focused on cities, towns, hubs & districts
        if (p.type === 'street') continue;

        const name = p.name;
        if (!name) continue;

        const state = p.state || '';
        const key = `${name}|${state}`.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);

        const coords = feature.geometry?.coordinates
          ? [feature.geometry.coordinates[1], feature.geometry.coordinates[0]] // GeoJSON [lon, lat] -> [lat, lon]
          : null;

        if (coords) {
          COORDS_CACHE.set(name.toLowerCase(), coords);
          if (state) {
            COORDS_CACHE.set(`${name.toLowerCase()}, ${state.toLowerCase()}`, coords);
          }
        }

        const display = state ? `${name}, ${state}` : name;

        // Friendly label for type
        let placeType = 'city';
        if (p.osm_value === 'town') placeType = 'town';
        else if (p.osm_value === 'village') placeType = 'village';
        else if (p.osm_key === 'aeroway' || name.toLowerCase().includes('airport')) placeType = 'airport';
        else if (p.osm_key === 'railway' || name.toLowerCase().includes('station') || name.toLowerCase().includes('junction')) placeType = 'station';
        else if (p.type === 'county') placeType = 'district';

        results.push({
          name,
          display,
          state,
          country: p.country || 'India',
          coords,
          type: placeType
        });

        if (results.length >= maxResults) break;
      }
    }
  } catch {
    // Graceful fallback to Nominatim
  }

  // 2. Fallback to OpenStreetMap Nominatim if Photon fails or returns zero results
  if (results.length === 0) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3500);

      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(clean)}&countrycodes=in&limit=${maxResults}&addressdetails=1`;
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'BlaCarPooling/1.0',
          'Accept-Language': 'en'
        },
        signal: controller.signal
      });
      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        const seen = new Set();

        results = (data || [])
          .map((item) => {
            const addr = item.address || {};
            const name = addr.city || addr.town || addr.village || addr.county || item.name || item.display_name.split(',')[0];
            const state = addr.state || '';
            const key = `${name}|${state}`.toLowerCase();
            if (seen.has(key)) return null;
            seen.add(key);

            const coords = [parseFloat(item.lat), parseFloat(item.lon)];
            COORDS_CACHE.set(name.toLowerCase(), coords);
            if (state) {
              COORDS_CACHE.set(`${name.toLowerCase()}, ${state.toLowerCase()}`, coords);
            }

            return {
              name,
              display: state ? `${name}, ${state}` : name,
              state,
              country: addr.country || 'India',
              coords,
              type: item.type || 'city'
            };
          })
          .filter(Boolean);
      }
    } catch {
      // Offline fallback
    }
  }

  // 3. Fallback to local filtering of starter cities if network is completely unreachable
  if (results.length === 0) {
    const localMatches = INDIAN_CITIES.filter((c) =>
      c.name.toLowerCase().includes(clean) || c.state.toLowerCase().includes(clean)
    ).map((c) => ({
      name: c.name,
      display: `${c.name}, ${c.state}`,
      state: c.state,
      country: 'India',
      coords: c.coords,
      hubs: c.hubs,
      type: 'city'
    }));

    if (localMatches.length > 0) {
      results = localMatches.slice(0, maxResults);
    }
  }

  // Cache up to 100 recent searches
  if (SEARCH_CACHE.size > 100) {
    const firstKey = SEARCH_CACHE.keys().next().value;
    SEARCH_CACHE.delete(firstKey);
  }
  SEARCH_CACHE.set(clean, results);

  return results;
}

/**
 * Dynamic Geocoding function: Resolves city/place string to [lat, lon] coordinates.
 * Checks in-memory cache first, then queries the external map API.
 *
 * @param {string} cityStr - City or place name (e.g. "Salem", "Chennai, Tamil Nadu")
 * @returns {Promise<[number, number] | null>} - [latitude, longitude] or null
 */
export async function getCityCoordinates(cityStr) {
  if (!cityStr || typeof cityStr !== 'string') return null;

  const raw = cityStr.trim();
  const lower = raw.toLowerCase();

  // 1. Direct cache lookup
  if (COORDS_CACHE.has(lower)) {
    return COORDS_CACHE.get(lower);
  }

  // 2. Primary city part (before comma) cache lookup
  const primaryPart = lower.split(',')[0].trim();
  if (COORDS_CACHE.has(primaryPart)) {
    return COORDS_CACHE.get(primaryPart);
  }

  // 3. Dynamic lookup via Photon External Map API
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const queryUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(raw + ', India')}&limit=1&lat=20.5937&lon=78.9629`;
    const res = await fetch(queryUrl, { signal: controller.signal });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data.features && data.features.length > 0) {
        const coords = [
          data.features[0].geometry.coordinates[1],
          data.features[0].geometry.coordinates[0]
        ];
        COORDS_CACHE.set(lower, coords);
        COORDS_CACHE.set(primaryPart, coords);
        return coords;
      }
    }
  } catch {
    // Continue to Nominatim fallback
  }

  // 4. Fallback to OpenStreetMap Nominatim
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(raw)}&countrycodes=in&limit=1`;
    const res = await fetch(nominatimUrl, {
      headers: {
        'User-Agent': 'BlaCarPooling/1.0',
        'Accept-Language': 'en'
      },
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data && data.length > 0) {
        const coords = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        COORDS_CACHE.set(lower, coords);
        COORDS_CACHE.set(primaryPart, coords);
        return coords;
      }
    }
  } catch {
    // Fail gracefully
  }

  return null;
}

/**
 * Calculates Haversine road distance in km between two [lat, lon] points,
 * multiplied by an Indian road winding factor (1.22x) for realistic highway travel km.
 *
 * @param {[number, number]} coord1 - [lat, lon] of start
 * @param {[number, number]} coord2 - [lat, lon] of destination
 * @returns {number | null} - Distance in kilometers
 */
export function calculateRoadDistanceKm(coord1, coord2) {
  if (!coord1 || !coord2) return null;
  const [lat1, lon1] = coord1;
  const [lat2, lon2] = coord2;

  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const airDistance = R * c;

  // Indian national highway factor is typically 1.22 - 1.25x air distance
  return Math.round(airDistance * 1.22);
}

/** Clear in-memory caches */
export function clearMapCache() {
  COORDS_CACHE.clear();
  SEARCH_CACHE.clear();
}
