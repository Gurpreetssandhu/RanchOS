'use client';

import { useEffect, useState, type RefObject } from 'react';
import type maplibregl from 'maplibre-gl';

/**
 * Drives an in-app "full screen" pop-over for a maplibre map. The map instance
 * is not re-created — the container is resized — so drawn geometry and the
 * chosen base map are preserved when expanding/collapsing.
 *
 * Consumers apply `fixed inset-0 z-[60]` styling to the map's root element when
 * `isExpanded` is true; this hook handles resizing, Escape-to-close, and locking
 * page scroll while expanded.
 */
export function useMapExpand(map: RefObject<maplibregl.Map | null>) {
  const [isExpanded, setExpanded] = useState(false);

  useEffect(() => {
    // Resize once the container has taken its new size (immediately + after the
    // CSS transition window) so the canvas fills the pop-over without artifacts.
    const raf = requestAnimationFrame(() => map.current?.resize());
    const timer = setTimeout(() => map.current?.resize(), 220);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [isExpanded, map]);

  useEffect(() => {
    if (!isExpanded) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setExpanded(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isExpanded]);

  return { isExpanded, setExpanded };
}
