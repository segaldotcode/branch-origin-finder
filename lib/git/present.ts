export type ConfidenceTier = "high" | "medium" | "low";

export function shortSha(sha: string | null): string | null {
  return sha ? sha.slice(0, 7) : null;
}

export function confidenceTier(confidence: number): ConfidenceTier {
  if (confidence >= 70) return "high";
  if (confidence >= 40) return "medium";
  return "low";
}

export const CONFIDENCE_TIER_STYLES: Record<
  ConfidenceTier,
  { text: string; bar: string; badge: string }
> = {
  high: {
    text: "text-emerald-600 dark:text-emerald-400",
    bar: "bg-emerald-500",
    badge: "border-transparent bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  },
  medium: {
    text: "text-amber-600 dark:text-amber-400",
    bar: "bg-amber-500",
    badge: "border-transparent bg-amber-500/15 text-amber-600 dark:text-amber-400",
  },
  low: {
    text: "text-rose-600 dark:text-rose-400",
    bar: "bg-rose-500",
    badge: "border-transparent bg-rose-500/15 text-rose-600 dark:text-rose-400",
  },
};

export const BRANCH_NAME_CLASS = "text-blue-600 dark:text-blue-400";
