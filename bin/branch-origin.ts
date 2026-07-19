#!/usr/bin/env node
import { Command } from "commander";
import { openRepository } from "../lib/git/repository";
import { listLocalBranches } from "../lib/git/branches";
import { findLikelyOrigin } from "../lib/git/infer-origin";
import { formatResultsAsText } from "../lib/cli/format";
import type { OriginResult } from "../lib/git/types";

const program = new Command();

program
  .name("branch-origin")
  .description("Infer the most likely parent branch of a Git branch")
  .argument("[branch-name]", "branch to analyze (defaults to the current branch)")
  .option("--all", "analyze every local branch")
  .option("--json", "output structured JSON instead of plain text")
  .option("-C, --cwd <path>", "path to the git repository to analyze", process.cwd())
  .action(async (branchName: string | undefined, opts: { all?: boolean; json?: boolean; cwd: string }) => {
    const git = openRepository(opts.cwd);

    const targets = opts.all
      ? await listLocalBranches(git)
      : [branchName ?? (await git.revparse(["--abbrev-ref", "HEAD"])).trim()];

    const results: OriginResult[] = [];
    for (const target of targets) {
      results.push(
        await findLikelyOrigin(git, opts.cwd, target, { candidates: opts.all ? targets : undefined }),
      );
    }

    if (opts.json) {
      console.log(JSON.stringify(opts.all ? results : results[0], null, 2));
      return;
    }

    console.log(formatResultsAsText(results));
  });

program.parseAsync(process.argv).catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
