import type { SimpleGit } from "simple-git";
import { assertGitRepository } from "./repository";
import { resolveCandidates } from "./branches";
import { getMergeBaseInfo } from "./merge-base";
import { hasReflogCheckoutEntry } from "./reflog";
import { tracksUpstreamBranch } from "./upstream";
import { findMostRecentMergeBase } from "./ancestry";
import { scoreCandidates, isPlausibleSource, type CandidateSignals } from "./confidence";
import type { CandidateResult, InferOptions, OriginResult } from "./types";

export async function findLikelyOrigin(
  git: SimpleGit,
  cwd: string,
  targetBranch: string,
  options: InferOptions = {},
): Promise<OriginResult> {
  await assertGitRepository(git);

  const candidateBranches = await resolveCandidates(git, targetBranch, options.candidates);

  const signals: CandidateSignals[] = await Promise.all(
    candidateBranches.map(async (branch) => {
      const [mergeBaseInfo, reflogMatch, upstreamMatch] = await Promise.all([
        getMergeBaseInfo(git, targetBranch, branch),
        hasReflogCheckoutEntry(git, targetBranch, branch),
        tracksUpstreamBranch(git, targetBranch, branch),
      ]);

      return { branch, mergeBaseInfo, reflogMatch, upstreamMatch };
    }),
  );

  const withMergeBase = signals
    .filter(
      (s): s is CandidateSignals & { mergeBaseInfo: { mergeBase: string } } =>
        isPlausibleSource(s.mergeBaseInfo),
    )
    .map((s) => ({
      branch: s.branch,
      mergeBase: s.mergeBaseInfo.mergeBase,
      mergeBaseDate: s.mergeBaseInfo.mergeBaseDate,
    }));

  const mostRecentBranch = await findMostRecentMergeBase(cwd, withMergeBase);

  const scored = scoreCandidates(signals, mostRecentBranch).sort(
    (a, b) => b.confidence - a.confidence,
  );

  const candidates: CandidateResult[] = scored.map((candidate) => ({
    branch: candidate.branch,
    confidence: candidate.confidence,
    mergeBase: candidate.mergeBaseInfo.mergeBase,
    mergeBaseDate: candidate.mergeBaseInfo.mergeBaseDate,
    aheadCount: candidate.mergeBaseInfo.aheadCount,
    behindCount: candidate.mergeBaseInfo.behindCount,
    reflogMatch: candidate.reflogMatch,
    upstreamMatch: candidate.upstreamMatch,
    reasons: candidate.reasons,
  }));

  const winner = candidates.find((c) => c.confidence > 0) ?? null;

  return {
    branch: targetBranch,
    likelySource: winner?.branch ?? null,
    confidence: winner?.confidence ?? 0,
    branchPoint: winner?.mergeBase ?? null,
    reasons: winner?.reasons ?? [],
    candidates,
  };
}
