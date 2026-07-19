import type { OriginResult } from "../git/types";
import { shortSha } from "../git/present";

export function formatResultAsText(result: OriginResult): string {
  const lines: string[] = [`Branch: ${result.branch}`, ""];

  if (!result.likelySource) {
    lines.push("Likely source branch : none found");
    lines.push("Reasons               :");
    lines.push("  No candidate branch shares history with this branch");
    return lines.join("\n");
  }

  lines.push(
    `Likely source branch : ${result.likelySource} (${result.confidence}%)`,
    `Branch point          : commit ${shortSha(result.branchPoint)}`,
    "Reasons               :",
    ...result.reasons.map((reason) => `  ${reason.detail}`),
  );

  return lines.join("\n");
}

export function formatResultsAsText(results: OriginResult[]): string {
  return results.map(formatResultAsText).join("\n\n");
}
