import simpleGit, { type SimpleGit } from "simple-git";

export function openRepository(cwd: string = process.cwd()): SimpleGit {
  return simpleGit({ baseDir: cwd });
}

export async function assertGitRepository(git: SimpleGit): Promise<void> {
  const isRepo = await git.checkIsRepo();
  if (!isRepo) {
    throw new Error("Not a git repository (or any of the parent directories).");
  }
}
