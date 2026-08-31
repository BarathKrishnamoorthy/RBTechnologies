import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Loader2, X } from 'lucide-react';

/**
 * CityAutocomplete
 * Props:
 *   value       – controlled string value
 *   onChange    – (cityName: string) => void
 *   placeholder – input placeholder
 *   icon        – optional Lucide icon element (defaults to MapPin)
 *   iconColor   – tailwind class e.g. "text-cyan-500"
 *   inputClass  – extra classes for the input element
 */

// Debounce helper
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// Nominatim city search — returns [{name, display, lat, lon}]
async function searchCities(query) {
  try {
    const url =
      `https://nominatim.openstreetmap.org/search?format=json` +
      `&q=${encodeURIComponent(query)}` +
      `&countrycodes=in&limit=6&addressdetails=1` +
      `&featuretype=settlement`;
    const r = await fetch(url, { headers: { 'Accept-Language': 'en' } });
    const d = await r.json();
    return d
      .filter(item => item.address)
      .map(item => {
        const addr = item.address;
        const city =
          addr.city || addr.town || addr.village || addr.county || item.display_name.split(',')[0];
        const state = addr.state || '';
        return {
          name: city,
          display: state ? `${city}, ${state}` : city,
          lat: item.lat,
          lon: item.lon,
        };
      })
      // de-duplicate by name
      .filter((v, i, a) => a.findIndex(x => x.name.toLowerCase() === v.name.toLowerCase()) === i);
  } catch {
    return [];
  }
}

export default function CityAutocomplete({
  value,
  onChange,
  placeholder = 'Enter city',
  icon,
  iconColor = 'text-cyan-500',
  inputClass = '',
  wrapperClass = 'p-4 rounded-2xl',
}) {
  const [query, setQuery]           = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen]             = useState(false);
  const [loading, setLoading]       = useState(false);
  const [active, setActive]         = useState(-1);   // keyboard nav index
  const wrapRef                     = useRef(null);
  const inputRef                    = useRef(null);

  const debouncedQuery = useDebounce(query, 320);

  // Sync controlled value → internal query when parent changes it externally
  useEffect(() => {
    if (value !== query) setQuery(value || '');
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch suggestions
  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    searchCities(debouncedQuery).then(results => {
      if (cancelled) return;
      setSuggestions(results);
      setOpen(results.length > 0);
      setActive(-1);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [debouncedQuery]);

  // Close on outside click
  useEffect(() => {
    const handler = e => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const select = useCallback((city) => {
    setQuery(city.name);
    onChange(city.name);
    setSuggestions([]);
    setOpen(false);
    setActive(-1);
    inputRef.current?.blur();
  }, [onChange]);

  const clear = useCallback(() => {
    setQuery('');
    onChange('');
    setSuggestions([]);
    setOpen(false);
    inputRef.current?.focus();
  }, [onChange]);

  const handleKeyDown = (e) => {
    if (!open) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(a + 1, suggestions.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActive(a => Math.max(a - 1, 0)); }
    if (e.key === 'Enter' && active >= 0) { e.preventDefault(); select(suggestions[active]); }
    if (e.key === 'Escape') { setOpen(false); }
  };

  const IconEl = icon || <MapPin className={`w-5 h-5 ${iconColor} flex-shrink-0`} />;

  return (
    <div ref={wrapRef} className="relative w-full z-50">
      {/* Input row */}
      <div className={`bg-slate-50 border border-slate-200 flex items-center gap-3 focus-within:border-cyan-400 transition-colors ${wrapperClass}`}>
        {IconEl}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); onChange(e.target.value); }}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          className={`flex-1 bg-transparent text-lg font-bold text-slate-900 focus:outline-none placeholder:font-normal placeholder:text-slate-400 ${inputClass}`}
        />
        {loading && <Loader2 className="w-4 h-4 text-slate-400 animate-spin flex-shrink-0" />}
        {!loading && query && (
          <button
            type="button"
            onClick={clear}
            className="text-slate-300 hover:text-slate-500 flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1.5 w-full bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
          {suggestions.map((city, i) => (
            <button
              key={`${city.name}-${i}`}
              type="button"
              onMouseDown={e => { e.preventDefault(); select(city); }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
                ${i === active ? 'bg-cyan-50' : 'hover:bg-slate-50'}
                ${i !== 0 ? 'border-t border-slate-100' : ''}
              `}
            >
              <MapPin className="w-4 h-4 text-slate-300 flex-shrink-0" />
              <div>
                <div className="text-sm font-bold text-slate-900">{city.name}</div>
                {city.display !== city.name && (
                  <div className="text-xs text-slate-400">{city.display}</div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
