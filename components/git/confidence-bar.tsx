"use client";

import { Progress } from "@/components/ui/progress";
import { useCountUp } from "@/lib/hooks/use-count-up";
import { CONFIDENCE_TIER_STYLES, confidenceTier } from "@/lib/git/present";

export function ConfidenceBar({ confidence }: { confidence: number }) {
  const animated = useCountUp(confidence);
  const tier = confidenceTier(confidence);
  const styles = CONFIDENCE_TIER_STYLES[tier];

  return (
    <div className="flex flex-col gap-1.5">
      <Progress
        value={animated}
        indicatorClassName={`${styles.bar} transition-none`}
        aria-label="Confidence"
      />
      <span className={`self-end text-sm font-semibold tabular-nums ${styles.text}`}>
        {animated}%
      </span>
    </div>
  );
}
