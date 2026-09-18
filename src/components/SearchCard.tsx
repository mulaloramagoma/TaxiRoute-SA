import { useEffect, useRef, useState } from 'react';
import { MapPin, ChevronDown, Search } from 'lucide-react';

interface LocationSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  locations: string[];
  placeholder: string;
  id: string;
}

export default function LocationSelect({
  label,
  value,
  onChange,
  locations,
  placeholder,
  id,
}: LocationSelectProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = locations.filter((loc) =>
    loc.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex flex-col" ref={containerRef}>
      <label htmlFor={id} className="label-text">
        {label}
      </label>
      <div className="relative">
        <div
          className="relative flex items-center"
          onClick={() => setOpen(true)}
        >
          <MapPin className="pointer-events-none absolute left-3 h-5 w-5 text-brand-500" />
          <input
            id={id}
            type="text"
            className="input-field pl-10 pr-8"
            placeholder={placeholder}
            value={open ? query : value}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => {
              setOpen(true);
              setQuery('');
            }}
            autoComplete="off"
            role="combobox"
            aria-expanded={open}
            aria-controls={`${id}-listbox`}
            aria-autocomplete="list"
          />
          <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-charcoal-400" />
        </div>

        {open && filtered.length > 0 && (
          <ul
            id={`${id}-listbox`}
            role="listbox"
            className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-stone-200 bg-white py-1 shadow-lg"
          >
            {filtered.map((loc) => (
              <li
                key={loc}
                role="option"
                aria-selected={loc === value}
                className="cursor-pointer px-4 py-2.5 text-sm text-charcoal-700 hover:bg-brand-50 hover:text-brand-700"
                onClick={() => {
                  onChange(loc);
                  setQuery('');
                  setOpen(false);
                }}
              >
                {loc}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

interface SearchCardProps {
  onSearch: (origin: string, destination: string) => void;
  locations: string[];
  loading?: boolean;
}

export function SearchCard({ onSearch, locations, loading }: SearchCardProps) {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin || !destination) {
      setError('Please select both an origin and a destination.');
      return;
    }
    if (origin === destination) {
      setError('Origin and destination must be different.');
      return;
    }
    setError('');
    onSearch(origin, destination);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card p-5 sm:p-6"
      aria-label="Route search form"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <LocationSelect
          id="origin"
          label="FROM"
          value={origin}
          onChange={setOrigin}
          locations={locations}
          placeholder="Search/select origin"
        />
        <LocationSelect
          id="destination"
          label="TO"
          value={destination}
          onChange={setDestination}
          locations={locations}
          placeholder="Search/select destination"
        />
      </div>

      {error && (
        <p className="mt-3 text-sm font-medium text-red-600" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="btn-primary mt-4 w-full sm:w-auto"
        disabled={loading}
      >
        <Search className="h-5 w-5" />
        {loading ? 'Finding Route...' : 'Find Route'}
      </button>
    </form>
  );
}
