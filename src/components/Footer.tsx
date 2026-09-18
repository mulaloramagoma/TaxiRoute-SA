import { Link } from 'react-router-dom';
import { Route as RouteIcon, AlertCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-stone-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white">
                <RouteIcon className="h-4 w-4" />
              </div>
              <span className="text-base font-bold text-charcoal-900">
                TaxiRoute <span className="text-brand-600">SA</span>
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-charcoal-500">
              Helping commuters find published taxi routes and fares.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-charcoal-900">Links</h3>
            <ul className="mt-3 space-y-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/routes', label: 'Routes' },
                { to: '/about', label: 'About' },
                { to: '/report', label: 'Report an Update' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-charcoal-500 transition-colors hover:text-brand-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex items-start gap-2 rounded-xl bg-amber-50 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <p className="text-sm leading-relaxed text-amber-800">
            Published fares may change. Please confirm the current fare with the taxi rank or driver before travelling.
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-charcoal-400">
          &copy; 2026 TaxiRoute SA
        </p>
      </div>
    </footer>
  );
}
