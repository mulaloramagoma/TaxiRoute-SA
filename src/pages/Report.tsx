import { useEffect, useState } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { getActiveRoutes, submitCommunityReport } from '@/lib/queries';
import type { RouteWithDetails } from '@/types';

const REPORT_TYPES = [
  'Fare changed',
  'Route changed',
  'Taxi rank changed',
  'Route unavailable',
  'Other',
];

export default function Report() {
  const [routes, setRoutes] = useState<RouteWithDetails[]>([]);
  const [loadingRoutes, setLoadingRoutes] = useState(true);

  const [routeId, setRouteId] = useState('');
  const [reportType, setReportType] = useState('');
  const [reportedFare, setReportedFare] = useState('');
  const [description, setDescription] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await getActiveRoutes();
        setRoutes(data);
      } catch {
        setError('Unable to load routes for selection.');
      } finally {
        setLoadingRoutes(false);
      }
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!reportType) {
      setError('Please select a report type.');
      return;
    }
    if (!description.trim()) {
      setError('Please provide a description.');
      return;
    }

    const fareValue = reportedFare ? parseFloat(reportedFare) : null;
    if (reportedFare && (isNaN(fareValue!) || fareValue! < 0)) {
      setError('Please enter a valid fare amount.');
      return;
    }

    setSubmitting(true);
    try {
      await submitCommunityReport({
        route_id: routeId || null,
        reported_fare: fareValue,
        report_type: reportType,
        description: description.trim(),
      });
      setSuccess(true);
      setRouteId('');
      setReportType('');
      setReportedFare('');
      setDescription('');
    } catch {
      setError('Unable to submit report. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-charcoal-900 sm:text-3xl">Report an Update</h1>
      <p className="mt-2 text-sm text-charcoal-500">
        Help us keep TaxiRoute SA information accurate.
      </p>

      {success ? (
        <div className="mt-6 rounded-2xl border border-forest-200 bg-forest-50 p-6 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-forest-600" />
          <p className="mt-3 text-base font-semibold text-forest-800">
            Thank you. Your report has been submitted for verification.
          </p>
          <button
            className="btn-secondary mt-4"
            onClick={() => setSuccess(false)}
          >
            Submit another report
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="card mt-6 p-5 sm:p-6">
          {/* Route selector */}
          <div className="mb-4">
            <label htmlFor="route" className="label-text">
              Route <span className="font-normal text-charcoal-400">(optional)</span>
            </label>
            {loadingRoutes ? (
              <p className="text-sm text-charcoal-400">Loading routes...</p>
            ) : (
              <select
                id="route"
                className="input-field"
                value={routeId}
                onChange={(e) => setRouteId(e.target.value)}
                aria-label="Select route"
              >
                <option value="">No specific route</option>
                {routes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.route_code} — {r.origin_name} → {r.destination_name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Report type */}
          <div className="mb-4">
            <label htmlFor="reportType" className="label-text">
              Report type <span className="text-red-500">*</span>
            </label>
            <select
              id="reportType"
              className="input-field"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              required
              aria-label="Select report type"
            >
              <option value="">Select report type...</option>
              {REPORT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Reported fare */}
          <div className="mb-4">
            <label htmlFor="reportedFare" className="label-text">
              Reported fare (R) <span className="font-normal text-charcoal-400">(optional)</span>
            </label>
            <input
              id="reportedFare"
              type="number"
              step="0.01"
              min="0"
              className="input-field"
              placeholder="e.g. 28.00"
              value={reportedFare}
              onChange={(e) => setReportedFare(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label htmlFor="description" className="label-text">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              rows={4}
              className="input-field resize-none"
              placeholder="Describe the change or issue you noticed..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="btn-primary w-full sm:w-auto"
            disabled={submitting}
          >
            <Send className="h-5 w-5" />
            {submitting ? 'Submitting...' : 'Submit Report'}
          </button>

          <p className="mt-4 text-xs leading-relaxed text-charcoal-400">
            Your report will be reviewed by our team. Reports do not automatically change official route or fare information.
          </p>
        </form>
      )}
    </div>
  );
}
