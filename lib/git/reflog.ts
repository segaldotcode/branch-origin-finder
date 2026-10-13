import type { SimpleGit } from "simple-git";
import { qualifyBranchRef } from "./ref";

async function getReflogSubjects(git: SimpleGit, ref: string): Promise<string[]> {
  try {
    const result = await git.raw(["log", "-g", "--format=%gs", ref]);
    return result.split("\n").filter(Boolean);
  } catch {
    return [];
  }
}

function matchesCheckoutFrom(subject: string, candidateBranch: string, targetBranch: string): boolean {
  const checkoutPattern = new RegExp(
    `^checkout: moving from ${escapeRegExp(candidateBranch)} to ${escapeRegExp(targetBranch)}$`,
  );
  return checkoutPattern.test(subject.trim());
}

function matchesCreatedFrom(subject: string, candidateBranch: string): boolean {
  const createdPattern = new RegExp(`^branch: Created from ${escapeRegExp(candidateBranch)}$`);
  return createdPattern.test(subject.trim());
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Branches the reflog says `targetBranch` came from, whatever they are named.
 * `hasReflogCheckoutEntry` can only confirm a candidate it is handed, so
 * without this a source branch with an unconventional name (anything but
 * main/develop/...) is never examined and its reflog evidence is lost. Only
 * existing local branches are returned: the reflog also records commit
 * hashes, `HEAD` and remote refs, none of which can be a candidate here.
 */
export async function findReflogSourceBranches(
  git: SimpleGit,
  targetBranch: string,
  localBranches: string[],
): Promise<string[]> {
  const [headSubjects, branchSubjects] = await Promise.all([
    getReflogSubjects(git, "HEAD"),
    getReflogSubjects(git, qualifyBranchRef(targetBranch)),
  ]);

  const checkoutPattern = new RegExp(
    `^checkout: moving from (.+) to ${escapeRegExp(targetBranch)}$`,
  );
  const createdPattern = /^branch: Created from (.+)$/;

  const sources = new Set<string>();
  for (const subject of headSubjects) {
    const match = checkoutPattern.exec(subject.trim());
    if (match) sources.add(match[1]);
  }
  for (const subject of branchSubjects) {
    const match = createdPattern.exec(subject.trim());
    if (match) sources.add(match[1].replace(/^refs\/heads\//, ""));
  }

  return [...sources].filter((name) => name !== targetBranch && localBranches.includes(name));
}

export async function hasReflogCheckoutEntry(
  git: SimpleGit,
  targetBranch: string,
  candidateBranch: string,
): Promise<boolean> {
  const [headSubjects, branchSubjects] = await Promise.all([
    getReflogSubjects(git, "HEAD"),
    getReflogSubjects(git, qualifyBranchRef(targetBranch)),
  ]);

  const headMatch = headSubjects.some((subject) =>
    matchesCheckoutFrom(subject, candidateBranch, targetBranch),
  );
  const branchMatch = branchSubjects.some((subject) => matchesCreatedFrom(subject, candidateBranch));

  return headMatch || branchMatch;
}
