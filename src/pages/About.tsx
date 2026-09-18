import { Link } from 'react-router-dom';
import {
  Route as RouteIcon,
  Tag,
  Building2,
  GitBranch,
  ClipboardList,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

export default function About() {
  const features = [
    {
      icon: RouteIcon,
      title: 'Route information',
      desc: 'Browse active minibus taxi routes across Gauteng, with origin, destination, and route codes.',
    },
    {
      icon: Tag,
      title: 'Published fares',
      desc: 'View published fare information for each route, including effective dates and verification status.',
    },
    {
      icon: Building2,
      title: 'Taxi associations',
      desc: 'Routes are operated by registered taxi associations such as JMTTA, TATA, and JVTA.',
    },
    {
      icon: GitBranch,
      title: 'Connected journeys',
      desc: 'When no direct route exists, find connected journeys with up to 2 transfers and an estimated total cost.',
    },
    {
      icon: ClipboardList,
      title: 'Community reporting',
      desc: 'Spotted a fare change or route update? Submit a report to help keep information accurate.',
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-charcoal-900 sm:text-3xl">
        About TaxiRoute SA
      </h1>
      <p className="mt-3 text-base leading-relaxed text-charcoal-600">
        TaxiRoute SA is a commuter-focused information platform designed to make South African
        minibus taxi route and published fare information easier to find.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {features.map((f) => (
          <div key={f.title} className="card p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-3 text-base font-bold text-charcoal-900">{f.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-charcoal-500">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-4">
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <p className="text-sm leading-relaxed text-amber-800">
            TaxiRoute SA provides published fare information, not guaranteed live fares.
          </p>
        </div>
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <p className="text-sm leading-relaxed text-amber-800">
            Fares may change. Please confirm the fare before travelling.
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl bg-charcoal-900 p-6 text-center">
        <h3 className="text-lg font-bold text-white">Ready to find your route?</h3>
        <p className="mt-1 text-sm text-charcoal-300">
          Search for direct routes or connected journeys now.
        </p>
        <Link
          to="/"
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-brand-600"
        >
          Search Routes
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
