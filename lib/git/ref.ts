/**
 * Fully-qualifies a branch name before it is used as a git command
 * argument. A branch name is arbitrary user/repository input and, in rare
 * cases, can start with a dash (git's own ref-format rules allow it even
 * though most porcelain commands used to create one refuse it). Passed
 * as-is, such a name can be misread as a flag instead of a ref by git
 * subcommands, silently producing wrong results instead of an error.
 * Prefixing with `refs/heads/` removes the ambiguity entirely.
 */
export function qualifyBranchRef(branch: string): string {
  return `refs/heads/${branch}`;
}
