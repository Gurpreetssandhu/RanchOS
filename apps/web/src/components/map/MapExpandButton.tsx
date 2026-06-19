'use client';

import { Maximize2, Minimize2 } from 'lucide-react';

type MapExpandButtonProps = {
  isExpanded: boolean;
  onToggle: () => void;
  className?: string;
};

/** Toggles the in-app full-screen pop-over for a map. */
export default function MapExpandButton({ isExpanded, onToggle, className = '' }: MapExpandButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isExpanded ? 'Exit full screen' : 'View map full screen'}
      title={isExpanded ? 'Exit full screen (Esc)' : 'View map full screen'}
      className={`pointer-events-auto z-10 inline-flex items-center gap-1.5 rounded-lg border border-white/70 bg-white/90 px-3 py-1.5 text-xs font-semibold text-stone-700 shadow-lg backdrop-blur transition hover:bg-stone-100 ${className}`}
    >
      {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
      {isExpanded ? 'Exit' : 'Full screen'}
    </button>
  );
}
