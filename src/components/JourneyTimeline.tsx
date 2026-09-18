import { Link } from 'react-router-dom';
import { ArrowDown, Building2, Repeat } from 'lucide-react';
import type { ConnectedJourney } from '@/types';

interface JourneyTimelineProps {
  journey: ConnectedJourney;
  index: number;
}

export default function JourneyTimeline({ journey, index }: JourneyTimelineProps) {
  return (
    <div className="card p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="badge bg-forest-500 text-white">CONNECTED JOURNEY</span>
        <span className="badge bg-stone-100 text-charcoal-600">
          {journey.numberOfLegs} taxi trips
        </span>
        <span className="badge bg-stone-100 text-charcoal-600">
          {journey.transfers} {journey.transfers === 1 ? 'transfer' : 'transfers'}
        </span>
        <span className="ml-auto text-xs font-medium text-charcoal-400">
          Option {index + 1}
        </span>
      </div>

      {/* Vertical timeline */}
      <div className="mt-6">
        {journey.legs.map((leg, legIdx) => (
          <div key={leg.route.id}>
            {/* Origin node */}
            {legIdx === 0 && (
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-white ring-4 ring-brand-100">
                    <div className="h-2.5 w-2.5 rounded-full bg-white" />
                  </div>
                </div>
                <div className="pt-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-charcoal-400">
                    Origin
                  </p>
                  <p className="text-base font-bold text-charcoal-900">
                    {leg.route.origin_name}
                  </p>
                </div>
              </div>
            )}

            {/* Leg connector */}
            <div className="ml-4 flex items-center gap-2 border-l-2 border-dashed border-brand-300 py-3 pl-6">
              <div className="flex items-center gap-2">
                <span className="badge bg-brand-100 text-brand-800">
                  Taxi Leg {legIdx + 1}
                </span>
                <span className="badge bg-stone-100 text-charcoal-600">
                  {leg.route.route_code}
                </span>
                <span className="text-sm font-bold text-charcoal-900">
                  R{Number(leg.fare.fare_zar).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Destination / Transfer node */}
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ring-4 ${
                    legIdx < journey.legs.length - 1
                      ? 'bg-forest-500 text-white ring-forest-100'
                      : 'bg-brand-500 text-white ring-brand-100'
                  }`}
                >
                  {legIdx < journey.legs.length - 1 ? (
                    <Repeat className="h-4 w-4" />
                  ) : (
                    <div className="h-2.5 w-2.5 rounded-full bg-white" />
                  )}
                </div>
                {legIdx < journey.legs.length - 1 && (
                  <div className="h-full w-0.5 border-l-2 border-dashed border-brand-300" />
                )}
              </div>
              <div className="pt-1">
                <p
                  className={`text-xs font-semibold uppercase tracking-wide ${
                    legIdx < journey.legs.length - 1
                      ? 'text-forest-600'
                      : 'text-charcoal-400'
                  }`}
                >
                  {legIdx < journey.legs.length - 1 ? 'Transfer — Change Taxi' : 'Destination'}
                </p>
                <p className="text-base font-bold text-charcoal-900">
                  {leg.route.destination_name}
                </p>
                <div className="mt-1.5 flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-1 text-xs text-charcoal-500">
                    <Building2 className="h-3 w-3" />
                    {leg.association?.name ?? '—'}
                  </span>
                  <span className="text-xs text-charcoal-400">
                    Eff. {new Date(leg.fare.effective_date).toLocaleDateString('en-ZA', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                  <Link
                    to={`/routes/${leg.route.id}`}
                    className="text-xs font-semibold text-brand-600 hover:text-brand-700"
                  >
                    Details →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cost breakdown */}
      <div className="mt-6 rounded-xl bg-stone-50 p-4">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-charcoal-400">
          Individual trip cost
        </h4>
        <div className="mt-2 space-y-1">
          {journey.legs.map((leg, i) => (
            <div key={leg.route.id} className="flex justify-between text-sm">
              <span className="text-charcoal-600">
                Leg {i + 1}: {leg.route.route_code}
              </span>
              <span className="font-semibold text-charcoal-900">
                R{Number(leg.fare.fare_zar).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-stone-200 pt-3">
          <span className="text-sm font-bold text-charcoal-900">
            Estimated total cost
          </span>
          <span className="text-xl font-bold text-brand-600">
            R{journey.totalCost.toFixed(2)}
          </span>
        </div>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-charcoal-400">
        Estimated total cost is calculated by adding the published fares for each taxi leg. Actual fares may change. Confirm fares with the taxi rank or driver before travelling.
      </p>
    </div>
  );
}
