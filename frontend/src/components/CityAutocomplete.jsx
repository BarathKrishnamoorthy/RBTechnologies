import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Loader2, X, Building, Navigation } from 'lucide-react';
import { searchIndianCities, INDIAN_CITIES } from '../data/indianCities';

// Popular top quick recommendations when input is empty
const POPULAR_RECOMMENDATIONS = [
  { name: 'Chennai', display: 'Chennai, Tamil Nadu', hubs: 'Koyambedu, Guindy, Airport' },
  { name: 'Salem', display: 'Salem, Tamil Nadu', hubs: 'New Bus Stand, Junction, Steel Plant' },
  { name: 'Bengaluru', display: 'Bengaluru, Karnataka', hubs: 'Silk Board, Majestic, Electronic City' },
  { name: 'Coimbatore', display: 'Coimbatore, Tamil Nadu', hubs: 'Gandhipuram, Hope College, Singanallur' },
  { name: 'Madurai', display: 'Madurai, Tamil Nadu', hubs: 'Mattuthavani, Periyar, Arapalayam' },
  { name: 'Tiruchirappalli', display: 'Tiruchirappalli, Tamil Nadu', hubs: 'Central Bus Stand, Chathiram' },
  { name: 'Mumbai', display: 'Mumbai, Maharashtra', hubs: 'Dadar, Borivali, Vashi, BKC' },
  { name: 'Pune', display: 'Pune, Maharashtra', hubs: 'Wakad, Shivajinagar, Hinjewadi' },
  { name: 'Hyderabad', display: 'Hyderabad, Telangana', hubs: 'Gachibowli, Hitec City, Ameerpet' }
];

export default function CityAutocomplete({
  value,
  onChange,
  placeholder = 'Enter city',
  icon,
  iconColor = 'text-purple-600',
  inputClass = '',
  wrapperClass = 'p-4 rounded-2xl',
}) {
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const wrapRef = useRef(null);
  const inputRef = useRef(null);

  // Sync controlled value -> internal query when parent changes it externally
  useEffect(() => {
    if (value !== query) {
      setQuery(value || '');
    }
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  // Instant local search as user types
  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    onChange(val);

    if (val.trim().length > 0) {
      const results = searchIndianCities(val, 8);
      setSuggestions(results);
      setOpen(results.length > 0);
    } else {
      setSuggestions(POPULAR_RECOMMENDATIONS);
      setOpen(true);
    }
    setActive(-1);
  };

  const handleFocus = () => {
    if (query.trim().length > 0) {
      const results = searchIndianCities(query, 8);
      setSuggestions(results);
    } else {
      setSuggestions(POPULAR_RECOMMENDATIONS);
    }
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
    setQuery(city.name);
    onChange(city.name);
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
    if (!open || suggestions.length === 0) return;
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
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const IconEl = icon || <MapPin className={`w-5 h-5 ${iconColor} flex-shrink-0`} />;

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
        {query && (
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
      {open && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-purple-200 rounded-2xl shadow-[0_16px_40px_rgba(124,58,237,0.18)] overflow-hidden z-[9999] max-h-80 overflow-y-auto">
          <div className="px-3.5 py-2 bg-purple-50/70 border-b border-purple-100 flex items-center justify-between text-[11px] font-bold text-purple-900 uppercase tracking-wider">
            <span>{query ? 'Matching Indian Cities' : 'Suggested Popular Cities'}</span>
            <span className="text-purple-600 font-semibold">{suggestions.length} found</span>
          </div>

          {suggestions.map((city, idx) => (
            <button
              key={`${city.name}-${idx}`}
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
                <MapPin className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <span>{city.name}</span>
                  {city.state && (
                    <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200/60">
                      {city.state}
                    </span>
                  )}
                </div>
                {city.hubs && (
                  <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                    Hubs: {city.hubs}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
