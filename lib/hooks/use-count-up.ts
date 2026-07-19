"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animates a number from 0 to `target` over `durationMs`, driven by a single
 * requestAnimationFrame loop. Used to keep the confidence percentage and the
 * progress bar perfectly in sync: both read from this same value instead of
 * relying on independently-timed CSS transitions.
 *
 * Linear pacing is deliberate here, not an ease-out curve: an eased curve
 * front-loads most of the count within the first ~100ms, which reads fine
 * for a bar (a continuous shape) but makes the digits next to it appear to
 * jump straight to the final number, since a human eye cannot read rapidly
 * changing digits nearly as fast as it can perceive motion.
 */
export function useCountUp(target: number, durationMs = 900): number {
  const [value, setValue] = useState(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    startRef.current = null;
    let frame: number;

    function tick(timestamp: number) {
      if (startRef.current === null) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / durationMs, 1);
      setValue(Math.round(progress * target));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, durationMs]);

  return value;
}
