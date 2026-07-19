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
