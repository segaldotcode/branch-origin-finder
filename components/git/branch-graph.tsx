import { GitBranch, GitCommitHorizontal } from "lucide-react";
import { shortSha } from "@/lib/git/present";

interface BranchGraphProps {
  sourceBranch: string;
  targetBranch: string;
  aheadCount: number;
  behindCount: number;
  branchPoint: string | null;
}

function Connector({ count }: { count: number }) {
  return (
    <div className="flex min-w-16 flex-1 flex-col items-center gap-1 px-1">
      <span className="text-muted-foreground text-xs tabular-nums whitespace-nowrap">
        {count} {count === 1 ? "commit" : "commits"}
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
}: BranchGraphProps) {
  return (
    <div className="flex items-center overflow-x-auto rounded-lg border p-4">
      <div className="flex shrink-0 flex-col items-center gap-1.5">
        <GitBranch className="text-muted-foreground size-4" />
        <span className="max-w-32 truncate text-sm font-medium" title={sourceBranch}>
          {sourceBranch}
        </span>
      </div>

      <Connector count={behindCount} />

      <div className="flex shrink-0 flex-col items-center gap-1.5">
        <GitCommitHorizontal className="text-primary size-4" />
        <span className="text-muted-foreground font-mono text-xs">
          {shortSha(branchPoint) ?? "unknown"}
        </span>
      </div>

      <Connector count={aheadCount} />

      <div className="flex shrink-0 flex-col items-center gap-1.5">
        <GitBranch className="size-4" />
        <span className="max-w-32 truncate text-sm font-medium" title={targetBranch}>
          {targetBranch}
        </span>
      </div>
    </div>
  );
}
