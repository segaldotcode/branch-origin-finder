export type ConfidenceTier = "high" | "medium" | "low";

export function shortSha(sha: string | null): string | null {
  return sha ? sha.slice(0, 7) : null;
}

export function confidenceTier(confidence: number): ConfidenceTier {
  if (confidence >= 70) return "high";
  if (confidence >= 40) return "medium";
  return "low";
}
