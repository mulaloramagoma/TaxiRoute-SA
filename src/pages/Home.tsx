import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Route as RouteIcon,
  Tag,
  ArrowRight,
  Info,
  AlertCircle,
  ClipboardList,
  MapPin,
  ListChecks,
  Coins,
} from 'lucide-react';
import { SearchCard } from '@/components/SearchCard';
import { DirectRouteResult } from '@/components/RouteCard';
import { RouteCard } from '@/components/RouteCard';
import JourneyTimeline from '@/components/JourneyTimeline';
import { LoadingSpinner, ErrorState, EmptyState } from '@/components/States';
import { getAllLocations, searchJourneys, getActiveRoutes, getFaresForRoutes } from '@/lib/queries';
import type { SearchResult, RouteWithDetails, Fare } from '@/types';

export default function Home() {
  const [locations, setLocations] = useState<string[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<SearchResult | null>(null);
  const [searchError, setSearchError] = useState('');
  const [popularRoutes, setPopularRoutes] = useState<RouteWithDetails[]>([]);
  const [popularFares, setPopularFares] = useState<Map<string, Fare>>(new Map());

  useEffect(() => {
    (async () => {
      try {
        const [locs, routes] = await Promise.all([
          getAllLocations(),
          getActiveRoutes(),
        ]);
        setLocations(locs);
        const popular = routes.slice(0, 6);
        setPopularRoutes(popular);
        const fares = await getFaresForRoutes(popular.map((r) => r.id));
        setPopularFares(fares);
      } catch {
        setSearchError('Unable to load route data. Please try again later.');
      } finally {
        setLoadingLocations(false);
      }
    })();
  }, []);

  const handleSearch = useCallback(async (origin: string, destination: string) => {
    setSearching(true);
    setSearchError('');
    setResults(null);
    try {
      const res = await searchJourneys(origin, destination);
      setResults(res);
    } catch {
      setSearchError('Unable to search routes. Please try again.');
    } finally {
      setSearching(false);
    }
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-stone-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(249,127,15,0.08),transparent_70%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1.5 text-sm font-semibold text-brand-700">
              <MapPin className="h-4 w-4" />
              Gauteng Minibus Taxi Routes
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-charcoal-900 sm:text-4xl md:text-5xl">
              Find Your Taxi Route
            </h1>
            <p className="mt-3 text-base text-charcoal-600 sm:text-lg">
              Search South African minibus taxi routes and published fares.
            </p>
          </div>

          <div className="mx-auto mt-8 max-w-3xl">
            {loadingLocations ? (
              <div className="card p-6">
                <LoadingSpinner text="Loading locations..." />
              </div>
            ) : (
              <SearchCard onSearch={handleSearch} locations={locations} loading={searching} />
            )}
          </div>
        </div>
      </section>

      {/* Search Results */}
      {searching && (
        <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <LoadingSpinner text="Finding taxi routes..." />
        </section>
      )}

      {!searching && searchError && (
        <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <ErrorState message={searchError} />
        </section>
      )}

      {!searching && results && (
        <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="space-y-6">
            {results.directRoutes.length === 0 && results.connectedJourneys.length === 0 && (
              <EmptyState
                message="No taxi route found for this journey."
                hint="Try another origin or destination."
              />
            )}

            {results.directRoutes.length === 0 && results.connectedJourneys.length > 0 && (
              <div className="rounded-xl bg-forest-50 border border-forest-200 p-4">
                <p className="text-sm font-semibold text-forest-800">
                  No direct route found, but connected journeys are available.
                </p>
              </div>
            )}

            {results.directRoutes.length > 0 && (
              <div>
                <h2 className="mb-4 text-xl font-bold text-charcoal-900">Direct Routes</h2>
                <div className="space-y-4">
                  {results.directRoutes.map((leg) => (
                    <DirectRouteResult key={leg.route.id} leg={leg} />
                  ))}
                </div>
              </div>
            )}

            {results.connectedJourneys.length > 0 && (
              <div>
                <h2 className="mb-4 text-xl font-bold text-charcoal-900">
                  Connected Journeys
                </h2>
                <div className="space-y-4">
                  {results.connectedJourneys.map((journey, idx) => (
                    <JourneyTimeline key={idx} journey={journey} index={idx} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Popular Routes */}
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-charcoal-900 sm:text-2xl">Popular Routes</h2>
          <Link
            to="/routes"
            className="flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {popularRoutes.map((route) => (
            <RouteCard
              key={route.id}
              route={route}
              fare={popularFares.get(route.id) ?? null}
              associationName={route.association?.name ?? null}
            />
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-bold text-charcoal-900">How It Works</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: MapPin,
                step: 1,
                title: 'Enter your journey',
                desc: 'Choose your starting point and destination.',
              },
              {
                icon: RouteIcon,
                step: 2,
                title: 'Compare available routes',
                desc: 'See direct routes or connected journeys.',
              },
              {
                icon: Tag,
                step: 3,
                title: 'Check the fare',
                desc: 'See individual published fares and the estimated total for connected journeys.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                  <item.icon className="h-7 w-7" />
                </div>
                <div className="mt-3 text-xs font-bold uppercase tracking-wide text-brand-500">
                  Step {item.step}
                </div>
                <h3 className="mt-1 text-base font-bold text-charcoal-900">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-charcoal-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fare Information Card */}
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 h-6 w-6 shrink-0 text-amber-600" />
            <div>
              <h3 className="text-base font-bold text-amber-900">
                About published fares
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-amber-800">
                TaxiRoute SA displays published fare information stored in its database. Fares may change, so please confirm the current fare with the taxi rank or driver before travelling.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Report CTA */}
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="overflow-hidden rounded-2xl bg-charcoal-900 p-6 sm:p-8">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <ClipboardList className="h-6 w-6 text-brand-400" />
                <h3 className="text-xl font-bold text-white">
                  Spotted a fare change?
                </h3>
              </div>
              <p className="mt-2 max-w-lg text-sm text-charcoal-300">
                Help us keep TaxiRoute SA accurate. Submit a community report and our team will verify it.
              </p>
            </div>
            <Link
              to="/report"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-brand-600"
            >
              Report an Update
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
