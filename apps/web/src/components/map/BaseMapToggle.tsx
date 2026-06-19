'use client';

import type { BaseMapMode } from '@/lib/map-style';

type BaseMapToggleProps = {
  mode: BaseMapMode;
  onChange: (mode: BaseMapMode) => void;
  className?: string;
};

const OPTIONS: { value: BaseMapMode; label: string }[] = [
  { value: 'street', label: 'Street' },
  { value: 'satellite', label: 'Satellite' },
];

/** Compact Street/Satellite base-map switcher overlaid on a map. */
export default function BaseMapToggle({ mode, onChange, className = '' }: BaseMapToggleProps) {
  return (
    <div
      className={`pointer-events-auto z-10 inline-flex overflow-hidden rounded-lg border border-white/70 bg-white/90 p-1 shadow-lg backdrop-blur ${className}`}
    >
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          aria-pressed={mode === option.value}
          className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
            mode === option.value
              ? 'bg-green-600 text-white'
              : 'text-stone-700 hover:bg-stone-100'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
