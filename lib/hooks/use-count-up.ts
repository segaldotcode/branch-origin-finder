"use client";

import { useEffect, useRef, useState } from "react";

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Animates a number from 0 to `target` over `durationMs`, driven by a single
 * requestAnimationFrame loop. Used to keep the confidence percentage and the
 * progress bar perfectly in sync: both read from this same value instead of
 * relying on independently-timed CSS transitions.
 */
export function useCountUp(target: number, durationMs = 700): number {
  const [value, setValue] = useState(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    startRef.current = null;
    let frame: number;

    function tick(timestamp: number) {
      if (startRef.current === null) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / durationMs, 1);
      setValue(Math.round(easeOutCubic(progress) * target));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, durationMs]);

  return value;
}
