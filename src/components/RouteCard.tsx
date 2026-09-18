import { Link } from 'react-router-dom';
import { ArrowRight, Building2 } from 'lucide-react';
import type { RouteLeg, RouteWithDetails, Fare } from '@/types';

interface RouteCardProps {
  route: RouteWithDetails;
  fare: Fare | null;
  associationName?: string | null;
}

export function RouteCard({ route, fare, associationName }: RouteCardProps) {
  return (
    <div className="card flex flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="badge bg-brand-100 text-brand-800">
          {route.route_code}
        </span>
        {associationName && (
          <span className="badge bg-forest-100 text-forest-700">
            <Building2 className="mr-1 h-3 w-3" />
            {associationName}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-charcoal-400">
            From
          </p>
          <p className="mt-0.5 text-sm font-semibold text-charcoal-900">
            {route.origin_name}
          </p>
        </div>
        <ArrowRight className="h-5 w-5 shrink-0 text-brand-500" />
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-charcoal-400">
            To
          </p>
          <p className="mt-0.5 text-sm font-semibold text-charcoal-900">
            {route.destination_name}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-4">
        <div>
          {fare ? (
            <p className="text-lg font-bold text-charcoal-900">
              R{Number(fare.fare_zar).toFixed(2)}
            </p>
          ) : (
            <p className="text-sm text-charcoal-400">Fare unavailable</p>
          )}
          {fare && (
            <p className="text-xs text-charcoal-400">
              Eff. {new Date(fare.effective_date).toLocaleDateString('en-ZA', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          )}
        </div>
        <Link
          to={`/routes/${route.id}`}
          className="text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}

interface DirectRouteResultProps {
  leg: RouteLeg;
}

export function DirectRouteResult({ leg }: DirectRouteResultProps) {
  return (
    <div className="card p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <span className="badge bg-brand-500 text-white">DIRECT ROUTE</span>
        <span className="badge bg-stone-100 text-charcoal-600">
          {leg.route.route_code}
        </span>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-charcoal-400">
            Origin
          </p>
          <p className="mt-1 text-base font-bold text-charcoal-900">
            {leg.route.origin_name}
          </p>
        </div>
        <div className="flex flex-col items-center text-brand-500">
          <ArrowRight className="hidden h-6 w-6 sm:block" />
          <div className="text-2xl sm:hidden">↓</div>
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-charcoal-400">
            Destination
          </p>
          <p className="mt-1 text-base font-bold text-charcoal-900">
            {leg.route.destination_name}
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 border-t border-stone-100 pt-4 sm:grid-cols-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-charcoal-400">
            Published fare
          </p>
          <p className="mt-1 text-lg font-bold text-charcoal-900">
            R{Number(leg.fare.fare_zar).toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-charcoal-400">
            Association
          </p>
          <p className="mt-1 text-sm font-semibold text-charcoal-700">
            {leg.association?.name ?? '—'}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-charcoal-400">
            Fare effective from
          </p>
          <p className="mt-1 text-sm font-semibold text-charcoal-700">
            {new Date(leg.fare.effective_date).toLocaleDateString('en-ZA', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-charcoal-400">
            Last verified
          </p>
          <p className="mt-1 text-sm font-semibold text-charcoal-700">
            {leg.fare.verification_date
              ? new Date(leg.fare.verification_date).toLocaleDateString('en-ZA', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              : '—'}
          </p>
        </div>
      </div>

      {leg.route.route_description && (
        <div className="mt-4 border-t border-stone-100 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-charcoal-400">
            Route description
          </p>
          <p className="mt-1 text-sm text-charcoal-600">
            {leg.route.route_description}
          </p>
        </div>
      )}

      <div className="mt-4">
        <Link to={`/routes/${leg.route.id}`} className="text-sm font-semibold text-brand-600 hover:text-brand-700">
          View full route details →
        </Link>
      </div>
    </div>
  );
}
