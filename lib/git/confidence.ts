import type { ConfidenceReason } from "./types";
import type { MergeBaseInfo } from "./merge-base";
import { describeReasonEn } from "./reason-text";

export const WEIGHTS = {
  reflogMatch: 50,
  mostRecentMergeBase: 30,
  fewestDivergentCommits: 15,
  upstreamMatch: 5,
} as const;

export interface CandidateSignals {
  branch: string;
  mergeBaseInfo: MergeBaseInfo;
  reflogMatch: boolean;
  upstreamMatch: boolean;
}

export interface ScoredCandidate extends CandidateSignals {
  confidence: number;
  reasons: ConfidenceReason[];
}

function totalDivergence(info: MergeBaseInfo): number {
  return info.aheadCount + info.behindCount;
}

/**
 * A candidate can only be the source of the target branch if the target has
 * at least a chance of having branched off it. If the target has zero
 * commits of its own relative to the candidate while the candidate has
 * commits the target lacks, the target's tip is itself an ancestor of the
 * candidate: the target predates the candidate, so the relationship can only
 * run the other way.
 */
export function isPlausibleSource(info: MergeBaseInfo): boolean {
  return info.mergeBase !== null && !(info.aheadCount === 0 && info.behindCount > 0);
}

export function scoreCandidates(
  signals: CandidateSignals[],
  mostRecentBranch: string | null,
): ScoredCandidate[] {
  const plausible = signals.filter((s) => isPlausibleSource(s.mergeBaseInfo));

  const smallestDivergence = plausible.reduce<number | null>((smallest, s) => {
    const divergence = totalDivergence(s.mergeBaseInfo);
    if (smallest === null || divergence < smallest) return divergence;
    return smallest;
  }, null);

  return signals.map((signal) => {
    if (!isPlausibleSource(signal.mergeBaseInfo)) {
      return { ...signal, confidence: 0, reasons: [] };
    }

    const reasons: ConfidenceReason[] = [];
    let confidence = 0;

    if (signal.reflogMatch) {
      confidence += WEIGHTS.reflogMatch;
      const params = { branch: signal.branch };
      reasons.push({
        code: "reflog_checkout_found",
        params,
        detail: describeReasonEn("reflog_checkout_found", params),
      });
    }

    if (mostRecentBranch && signal.branch === mostRecentBranch) {
      confidence += WEIGHTS.mostRecentMergeBase;
      reasons.push({
        code: "nearest_common_ancestor",
        detail: describeReasonEn("nearest_common_ancestor"),
      });
    }

    const divergence = totalDivergence(signal.mergeBaseInfo);
    if (smallestDivergence !== null && divergence === smallestDivergence) {
      const otherBranches = plausible
        .filter((s) => s.branch !== signal.branch)
        .map((s) => s.branch);
      confidence += WEIGHTS.fewestDivergentCommits;
      const params = { branches: otherBranches };
      reasons.push({
        code: "fewer_divergent_commits",
        params,
        detail: describeReasonEn("fewer_divergent_commits", params),
      });
    }

    if (signal.upstreamMatch) {
      confidence += WEIGHTS.upstreamMatch;
      const params = { branch: signal.branch };
      reasons.push({
        code: "upstream_tracking_match",
        params,
        detail: describeReasonEn("upstream_tracking_match", params),
      });
    }

    return { ...signal, confidence, reasons };
  });
}
