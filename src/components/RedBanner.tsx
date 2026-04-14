import { TriangleAlert as AlertTriangle } from 'lucide-react';

export function RedBanner() {
  return (
    <div className="w-full bg-red-700 text-white text-center py-2 px-4 text-xs sm:text-sm font-semibold tracking-wide flex items-center justify-center gap-2 z-50">
      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
      <span>
        RESEARCH USE ONLY — Not for human consumption. For in-vitro laboratory research purposes only.
      </span>
      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
    </div>
  );
}
