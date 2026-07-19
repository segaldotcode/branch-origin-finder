import { GitBranch, GitCommitHorizontal } from "lucide-react";
import { BRANCH_NAME_CLASS, shortSha } from "@/lib/git/present";
import type { Dictionary } from "@/lib/i18n";

interface BranchGraphProps {
  sourceBranch: string;
  targetBranch: string;
  aheadCount: number;
  behindCount: number;
  branchPoint: string | null;
  dict: Dictionary;
}

function Connector({ count, dict }: { count: number; dict: Dictionary }) {
  return (
    <div className="flex min-w-16 flex-1 flex-col items-center gap-1 px-1">
      <span className="text-muted-foreground text-xs tabular-nums whitespace-nowrap">
        {count} {count === 1 ? dict.graph.commit : dict.graph.commits}
      </span>
      <div className="bg-border h-px w-full" />
    </div>
  );
}

export function BranchGraph({
  sourceBranch,
  targetBranch,
  aheadCount,
  behindCount,
  branchPoint,
  dict,
}: BranchGraphProps) {
  return (
    <div className="flex items-center overflow-x-auto rounded-lg border p-4">
      <div className="flex shrink-0 flex-col items-center gap-1.5">
        <GitBranch className="text-muted-foreground size-4" />
        <span className={`max-w-32 truncate text-sm font-medium ${BRANCH_NAME_CLASS}`} title={sourceBranch}>
          {sourceBranch}
        </span>
      </div>

      <Connector count={behindCount} dict={dict} />

      <div className="flex shrink-0 flex-col items-center gap-1.5">
        <GitCommitHorizontal className="text-primary size-4" />
        <span className="text-muted-foreground font-mono text-xs">
          {shortSha(branchPoint) ?? dict.graph.unknown}
        </span>
      </div>

      <Connector count={aheadCount} dict={dict} />

      <div className="flex shrink-0 flex-col items-center gap-1.5">
        <GitBranch className="size-4" />
        <span className={`max-w-32 truncate text-sm font-medium ${BRANCH_NAME_CLASS}`} title={targetBranch}>
          {targetBranch}
        </span>
      </div>
    </div>
  );
}
