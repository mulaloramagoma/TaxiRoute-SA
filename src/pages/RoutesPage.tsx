import { useEffect, useState, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import { RouteCard } from '@/components/RouteCard';
import { LoadingSpinner, ErrorState, EmptyState } from '@/components/States';
import { getActiveRoutes, getFaresForRoutes, getAssociations } from '@/lib/queries';
import type { RouteWithDetails, Fare, Association } from '@/types';

export default function RoutesPage() {
  const [routes, setRoutes] = useState<RouteWithDetails[]>([]);
  const [fares, setFares] = useState<Map<string, Fare>>(new Map());
  const [associations, setAssociations] = useState<Association[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [filterAssociation, setFilterAssociation] = useState('');
  const [filterOrigin, setFilterOrigin] = useState('');
  const [filterDestination, setFilterDestination] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [routeData, assocData] = await Promise.all([
          getActiveRoutes(),
          getAssociations(),
        ]);
        setRoutes(routeData);
        setAssociations(assocData);
        const fareMap = await getFaresForRoutes(routeData.map((r) => r.id));
        setFares(fareMap);
      } catch {
        setError('Unable to load routes. Please try again later.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const origins = useMemo(() => {
    const set = new Set(routes.map((r) => r.origin_name));
    return Array.from(set).sort();
  }, [routes]);

  const destinations = useMemo(() => {
    const set = new Set(routes.map((r) => r.destination_name));
    return Array.from(set).sort();
  }, [routes]);

  const filteredRoutes = useMemo(() => {
    return routes.filter((r) => {
      if (filterAssociation && r.association?.name !== filterAssociation) return false;
      if (filterOrigin && r.origin_name !== filterOrigin) return false;
      if (filterDestination && r.destination_name !== filterDestination) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matches =
          r.route_code.toLowerCase().includes(q) ||
          r.origin_name.toLowerCase().includes(q) ||
          r.destination_name.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [routes, filterAssociation, filterOrigin, filterDestination, searchQuery]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <LoadingSpinner text="Loading taxi routes..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <ErrorState message={error} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-charcoal-900 sm:text-3xl">Taxi Routes</h1>
        <p className="mt-1 text-sm text-charcoal-500">
          Browse all {routes.length} active minibus taxi routes across Gauteng.
        </p>
      </div>

      {/* Filters */}
      <div className="card mb-6 p-4 sm:p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-charcoal-600">
          <Filter className="h-4 w-4" />
          Filter routes
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-400" />
            <input
              type="text"
              className="input-field pl-9 py-2.5 text-sm"
              placeholder="Search route code, origin, destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search routes"
            />
          </div>
          <select
            className="input-field py-2.5 text-sm"
            value={filterAssociation}
            onChange={(e) => setFilterAssociation(e.target.value)}
            aria-label="Filter by association"
          >
            <option value="">All associations</option>
            {associations.map((a) => (
              <option key={a.id} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>
          <select
            className="input-field py-2.5 text-sm"
            value={filterOrigin}
            onChange={(e) => setFilterOrigin(e.target.value)}
            aria-label="Filter by origin"
          >
            <option value="">All origins</option>
            {origins.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          <select
            className="input-field py-2.5 text-sm"
            value={filterDestination}
            onChange={(e) => setFilterDestination(e.target.value)}
            aria-label="Filter by destination"
          >
            <option value="">All destinations</option>
            {destinations.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="mb-4 text-sm text-charcoal-500">
        Showing {filteredRoutes.length} {filteredRoutes.length === 1 ? 'route' : 'routes'}
      </p>

      {filteredRoutes.length === 0 ? (
        <EmptyState
          message="No routes match your filters."
          hint="Try adjusting your search or filters."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRoutes.map((route) => (
            <RouteCard
              key={route.id}
              route={route}
              fare={fares.get(route.id) ?? null}
              associationName={route.association?.name ?? null}
            />
          ))}
        </div>
      )}
    </div>
  );
}
