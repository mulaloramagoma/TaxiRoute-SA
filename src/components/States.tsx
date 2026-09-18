import { Loader2 } from 'lucide-react';

export function LoadingSpinner({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      <p className="text-sm font-medium text-charcoal-500">{text}</p>
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
      <p className="text-sm font-medium text-red-700">{message}</p>
    </div>
  );
}

export function EmptyState({ message, hint }: { message: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-6 text-center">
      <p className="text-base font-semibold text-charcoal-700">{message}</p>
      {hint && <p className="mt-1 text-sm text-charcoal-400">{hint}</p>}
    </div>
  );
}
