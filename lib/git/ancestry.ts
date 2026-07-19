import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

/**
 * simple-git's raw() does not reliably reject on a non-zero exit code when
 * the command produces no stderr output (as is the case for
 * `merge-base --is-ancestor`, which signals its answer purely through the
 * exit code). Shelling out directly keeps the exit code check explicit.
 */
export async function isAncestor(
  cwd: string,
  ancestorSha: string,
  descendantSha: string,
): Promise<boolean> {
  if (ancestorSha === descendantSha) {
    return false;
  }

  try {
    await execFileAsync("git", ["merge-base", "--is-ancestor", ancestorSha, descendantSha], {
      cwd,
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Ranks merge-base commits by recency in the commit graph: a merge-base that
 * is a descendant of another candidate's merge-base is the more direct,
 * more recent branch point. Falls back to commit date when neither commit
 * is an ancestor of the other (unrelated history).
 */
export async function findMostRecentMergeBase(
  cwd: string,
  candidates: { branch: string; mergeBase: string; mergeBaseDate: string | null }[],
): Promise<string | null> {
  if (candidates.length === 0) {
    return null;
  }

  let best = candidates[0];

  for (const contender of candidates.slice(1)) {
    if (contender.mergeBase === best.mergeBase) {
      continue;
    }

    const contenderIsMoreRecent = await isAncestor(cwd, best.mergeBase, contender.mergeBase);
    if (contenderIsMoreRecent) {
      best = contender;
      continue;
    }

    const bestIsMoreRecent = await isAncestor(cwd, contender.mergeBase, best.mergeBase);
    if (bestIsMoreRecent) {
      continue;
    }

    if (contender.mergeBaseDate && best.mergeBaseDate && contender.mergeBaseDate > best.mergeBaseDate) {
      best = contender;
    }
  }

  return best.branch;
}
