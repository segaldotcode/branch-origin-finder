import type { SimpleGit } from "simple-git";

const INTEGRATION_BRANCH_NAMES = ["main", "master", "develop", "trunk"];
const RELEASE_BRANCH_PATTERN = /^release\//;

function isIntegrationBranch(branch: string): boolean {
  return (
    INTEGRATION_BRANCH_NAMES.includes(branch) ||
    RELEASE_BRANCH_PATTERN.test(branch)
  );
}

export async function listLocalBranches(git: SimpleGit): Promise<string[]> {
  const summary = await git.branchLocal();
  return summary.all;
}

/**
 * The remote's default branch is the most reliable signal for "the main
 * integration branch", regardless of what it happens to be named (main,
 * master, trunk, or a project-specific name). Only available when the repo
 * has a remote and its HEAD has been resolved locally (true after a normal
 * `git clone`), so callers should treat a null result as "unknown", not
 * "no default branch exists".
 */
export async function getRemoteDefaultBranch(git: SimpleGit): Promise<string | null> {
  try {
    const result = await git.raw(["symbolic-ref", "refs/remotes/origin/HEAD"]);
    const ref = result.trim();
    return ref.replace(/^refs\/remotes\/origin\//, "") || null;
  } catch {
    return null;
  }
}

export async function resolveCandidates(
  git: SimpleGit,
  targetBranch: string,
  explicitCandidates?: string[],
): Promise<string[]> {
  const allBranches = await listLocalBranches(git);
  const others = allBranches.filter((branch) => branch !== targetBranch);

  if (explicitCandidates && explicitCandidates.length > 0) {
    return explicitCandidates.filter((branch) => branch !== targetBranch);
  }

  const defaultBranch = await getRemoteDefaultBranch(git);
  const namedCandidates = new Set(others.filter(isIntegrationBranch));
  if (defaultBranch && others.includes(defaultBranch)) {
    namedCandidates.add(defaultBranch);
  }

  return namedCandidates.size > 0 ? [...namedCandidates] : others;
}
