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

  const integrationBranches = others.filter(isIntegrationBranch);
  return integrationBranches.length > 0 ? integrationBranches : others;
}
