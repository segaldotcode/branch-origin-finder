import type { SimpleGit } from "simple-git";

export interface MergeBaseInfo {
  mergeBase: string | null;
  mergeBaseDate: string | null;
  aheadCount: number;
  behindCount: number;
}

async function findMergeBase(
  git: SimpleGit,
  targetBranch: string,
  candidateBranch: string,
): Promise<string | null> {
  try {
    const result = await git.raw(["merge-base", candidateBranch, targetBranch]);
    return result.trim() || null;
  } catch {
    return null;
  }
}

async function getCommitDate(git: SimpleGit, sha: string): Promise<string | null> {
  try {
    const result = await git.raw(["show", "-s", "--format=%cI", sha]);
    return result.trim() || null;
  } catch {
    return null;
  }
}

async function countCommits(
  git: SimpleGit,
  fromRef: string,
  toRef: string,
): Promise<number> {
  try {
    const result = await git.raw(["rev-list", "--count", `${fromRef}..${toRef}`]);
    return Number.parseInt(result.trim(), 10) || 0;
  } catch {
    return 0;
  }
}

export async function getMergeBaseInfo(
  git: SimpleGit,
  targetBranch: string,
  candidateBranch: string,
): Promise<MergeBaseInfo> {
  const mergeBase = await findMergeBase(git, targetBranch, candidateBranch);

  if (!mergeBase) {
    return { mergeBase: null, mergeBaseDate: null, aheadCount: 0, behindCount: 0 };
  }

  const [mergeBaseDate, aheadCount, behindCount] = await Promise.all([
    getCommitDate(git, mergeBase),
    countCommits(git, candidateBranch, targetBranch),
    countCommits(git, targetBranch, candidateBranch),
  ]);

  return { mergeBase, mergeBaseDate, aheadCount, behindCount };
}
