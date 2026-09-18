import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  ArrowRight,
  Calendar,
  Tag,
  FileText,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { getRouteById, getFareForRoute } from '@/lib/queries';
import { LoadingSpinner, ErrorState } from '@/components/States';
import type { RouteWithDetails, Fare } from '@/types';

export default function RouteDetails() {
  const { routeId } = useParams<{ routeId: string }>();
  const [route, setRoute] = useState<RouteWithDetails | null>(null);
  const [fare, setFare] = useState<Fare | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!routeId) return;
    (async () => {
      try {
        const [routeData, fareData] = await Promise.all([
          getRouteById(routeId),
          getFareForRoute(routeId),
        ]);
        if (!routeData) {
          setError('Route not found.');
          return;
        }
        setRoute(routeData);
        setFare(fareData);
      } catch {
        setError('Unable to load route details. Please try again.');
      } finally {
        setLoading(false);
      }
    })();
  }, [routeId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <LoadingSpinner text="Loading route details..." />
      </div>
    );
  }

  if (error || !route) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <Link
          to="/routes"
          className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Routes
        </Link>
        <ErrorState message={error || 'Route not found.'} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Link
        to="/routes"
        className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Routes
      </Link>

      <div className="card p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="badge bg-brand-500 text-white">{route.route_code}</span>
          {route.association && (
            <span className="badge bg-forest-100 text-forest-700">
              <Building2 className="mr-1 h-3 w-3" />
              {route.association.name}
            </span>
          )}
          <span className={`badge ${route.active ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-500'}`}>
            {route.active ? 'Active' : 'Inactive'}
          </span>
        </div>

        {/* Origin → Destination */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-charcoal-400">Origin</p>
            <p className="mt-1 text-lg font-bold text-charcoal-900">{route.origin_name}</p>
            {route.origin_rank && (
              <p className="text-xs text-charcoal-400">
                {route.origin_rank.suburb ? `${route.origin_rank.suburb}, ` : ''}
                {route.origin_rank.province}
              </p>
            )}
          </div>
          <ArrowRight className="hidden h-6 w-6 text-brand-500 sm:block" />
          <div className="text-2xl text-brand-500 sm:hidden">↓</div>
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-charcoal-400">Destination</p>
            <p className="mt-1 text-lg font-bold text-charcoal-900">{route.destination_name}</p>
            {route.destination_rank && (
              <p className="text-xs text-charcoal-400">
                {route.destination_rank.suburb ? `${route.destination_rank.suburb}, ` : ''}
                {route.destination_rank.province}
              </p>
            )}
          </div>
        </div>

        {/* Fare details */}
        {fare ? (
          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-stone-100 pt-6 sm:grid-cols-3">
            <div>
              <div className="flex items-center gap-1.5">
                <Tag className="h-4 w-4 text-brand-500" />
                <p className="text-xs font-semibold uppercase tracking-wide text-charcoal-400">Published Fare</p>
              </div>
              <p className="mt-1 text-2xl font-bold text-charcoal-900">
                R{Number(fare.fare_zar).toFixed(2)}
              </p>
              <p className="text-xs text-charcoal-400">{fare.currency}</p>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-brand-500" />
                <p className="text-xs font-semibold uppercase tracking-wide text-charcoal-400">Fare Effective From</p>
              </div>
              <p className="mt-1 text-sm font-semibold text-charcoal-700">
                {new Date(fare.effective_date).toLocaleDateString('en-ZA', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-brand-500" />
                <p className="text-xs font-semibold uppercase tracking-wide text-charcoal-400">Last Verified</p>
              </div>
              <p className="mt-1 text-sm font-semibold text-charcoal-700">
                {fare.verification_date
                  ? new Date(fare.verification_date).toLocaleDateString('en-ZA', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })
                  : '—'}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-brand-500" />
                <p className="text-xs font-semibold uppercase tracking-wide text-charcoal-400">Source</p>
              </div>
              <p className="mt-1 text-sm text-charcoal-600">{fare.source ?? '—'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-charcoal-400">Source Type</p>
              <p className="mt-1 text-sm text-charcoal-600">
                {fare.source_type?.replace(/_/g, ' ') ?? '—'}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-charcoal-400">Status</p>
              <p className="mt-1">
                <span className="badge bg-green-100 text-green-700 capitalize">
                  {fare.status}
                </span>
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-6 border-t border-stone-100 pt-6">
            <p className="text-sm text-charcoal-400">No published fare available for this route.</p>
          </div>
        )}

        {/* Route description */}
        {route.route_description && (
          <div className="mt-6 border-t border-stone-100 pt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-charcoal-400">Route Description</p>
            <p className="mt-1 text-sm leading-relaxed text-charcoal-600">
              {route.route_description}
            </p>
          </div>
        )}

        {/* Notice */}
        <div className="mt-6 flex items-start gap-2 rounded-xl bg-amber-50 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <p className="text-sm leading-relaxed text-amber-800">
            Published fares may change. Please confirm the current fare with the taxi rank or driver before travelling.
          </p>
        </div>
      </div>
    </div>
  );
}
