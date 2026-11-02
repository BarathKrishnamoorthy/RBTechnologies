import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Loader2, X, Navigation, Building2, Plane, Train } from 'lucide-react';
import { searchIndianCities, INDIAN_CITIES } from '../data/indianCities';

// Popular top quick recommendations when input is empty
const POPULAR_RECOMMENDATIONS = INDIAN_CITIES.slice(0, 8).map((c) => ({
  name: c.name,
  display: `${c.name}, ${c.state}`,
  state: c.state,
  hubs: c.hubs,
  coords: c.coords,
  type: 'popular'
}));

export default function CityAutocomplete({
  value,
  onChange,
  placeholder = 'Enter city or town',
  icon,
  iconColor = 'text-purple-600',
  inputClass = '',
  wrapperClass = 'p-4 rounded-2xl',
}) {
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState(POPULAR_RECOMMENDATIONS);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(-1);
  const wrapRef = useRef(null);
  const inputRef = useRef(null);

  // Sync controlled value -> internal query when parent changes it externally
  useEffect(() => {
    if (value !== query) {
      setQuery(value || '');
    }
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  // Dynamic search with debouncing (240ms) against external map API
  useEffect(() => {
    const trimmed = query.trim();

    if (!trimmed) {
      setSuggestions(POPULAR_RECOMMENDATIONS);
      setLoading(false);
      return;
    }

    let isCancelled = false;
    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        const results = await searchIndianCities(trimmed, 8);
        if (!isCancelled) {
          setSuggestions(results);
          setOpen(true);
          setActive(-1);
        }
      } catch {
        if (!isCancelled) {
          setSuggestions([]);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }, 240);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  // Handle typing in input
  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    onChange(val);
    setOpen(true);
  };

  const handleFocus = () => {
    setOpen(true);
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selectCity = useCallback((city) => {
    const chosenName = typeof city === 'string' ? city : city.name;
    setQuery(chosenName);
    onChange(chosenName, city);
    setOpen(false);
    setActive(-1);
    inputRef.current?.blur();
  }, [onChange]);

  const clearInput = useCallback(() => {
    setQuery('');
    onChange('');
    setSuggestions(POPULAR_RECOMMENDATIONS);
    setOpen(true);
    inputRef.current?.focus();
  }, [onChange]);

  const handleKeyDown = (e) => {
    if (!open) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (active >= 0 && suggestions[active]) {
        selectCity(suggestions[active]);
      } else if (suggestions.length > 0) {
        selectCity(suggestions[0]);
      } else if (query.trim()) {
        selectCity(query.trim());
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const IconEl = icon || <MapPin className={`w-5 h-5 ${iconColor} flex-shrink-0`} />;

  // Render type icon badge
  const renderTypeIcon = (type) => {
    if (type === 'airport') return <Plane className="w-3.5 h-3.5 text-blue-600" />;
    if (type === 'station') return <Train className="w-3.5 h-3.5 text-amber-600" />;
    if (type === 'district') return <Building2 className="w-3.5 h-3.5 text-indigo-600" />;
    return <MapPin className="w-3.5 h-3.5 text-purple-600" />;
  };

  return (
    <div ref={wrapRef} className="relative w-full z-40">
      {/* Input container */}
      <div className={`bg-slate-50 border border-slate-200 flex items-center gap-3 focus-within:border-purple-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-purple-200 transition-all ${wrapperClass}`}>
        {IconEl}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          className={`flex-1 bg-transparent text-base sm:text-lg font-bold text-slate-900 focus:outline-none placeholder:font-medium placeholder:text-slate-400 ${inputClass}`}
        />
        {loading && (
          <Loader2 className="w-4 h-4 text-purple-600 animate-spin flex-shrink-0" />
        )}
        {!loading && query && (
          <button
            type="button"
            onClick={clearInput}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200/50 flex-shrink-0 cursor-pointer"
            title="Clear"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown List */}
      {open && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-purple-200 rounded-2xl shadow-[0_16px_40px_rgba(124,58,237,0.18)] overflow-hidden z-[9999] max-h-80 overflow-y-auto">
          <div className="px-3.5 py-2 bg-purple-50/70 border-b border-purple-100 flex items-center justify-between text-[11px] font-bold text-purple-900 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Navigation className="w-3 h-3 text-purple-600" />
              {query ? 'Live Map Search Results' : 'Suggested Popular Cities'}
            </span>
            <span className="text-purple-600 font-semibold">
              {loading ? 'Searching Map...' : `${suggestions.length} found`}
            </span>
          </div>

          {suggestions.length > 0 ? (
            suggestions.map((city, idx) => (
              <button
                key={`${city.name}-${city.state || ''}-${idx}`}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault(); // Prevents input blur before selection
                  selectCity(city);
                }}
                className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors cursor-pointer ${
                  idx === active
                    ? 'bg-purple-100/80 text-purple-950 font-bold'
                    : 'hover:bg-purple-50 text-slate-800'
                } ${idx !== 0 ? 'border-t border-slate-100' : ''}`}
              >
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center flex-shrink-0 mt-0.5 border border-purple-100">
                  {renderTypeIcon(city.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-extrabold text-slate-900 flex items-center gap-2 flex-wrap">
                    <span>{city.name}</span>
                    {city.state && (
                      <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200/60">
                        {city.state}
                      </span>
                    )}
                    {city.type && city.type !== 'city' && city.type !== 'popular' && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {city.type}
                      </span>
                    )}
                  </div>
                  {city.hubs && (
                    <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                      Hubs: {city.hubs}
                    </div>
                  )}
                  {!city.hubs && city.country && (
                    <div className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                      {city.display}
                    </div>
                  )}
                </div>
              </button>
            ))
          ) : !loading && query.trim() ? (
            <div className="p-4 text-center">
              <p className="text-sm font-semibold text-slate-700">No locations found on live map.</p>
              <p className="text-xs text-slate-400 mt-1">Press Enter or click below to use custom place:</p>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  selectCity(query.trim());
                }}
                className="mt-2.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-purple-700" />
                Use &ldquo;{query.trim()}&rdquo;
              </button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
