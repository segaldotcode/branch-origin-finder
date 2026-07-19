import type { SimpleGit } from "simple-git";

async function getConfigValue(git: SimpleGit, key: string): Promise<string | null> {
  try {
    const result = await git.raw(["config", "--get", key]);
    return result.trim() || null;
  } catch {
    return null;
  }
}

function branchNameFromRef(ref: string): string {
  return ref.replace(/^refs\/heads\//, "");
}

export async function tracksUpstreamBranch(
  git: SimpleGit,
  targetBranch: string,
  candidateBranch: string,
): Promise<boolean> {
  const mergeRef = await getConfigValue(git, `branch.${targetBranch}.merge`);
  if (!mergeRef) {
    return false;
  }

  return branchNameFromRef(mergeRef) === candidateBranch;
}
