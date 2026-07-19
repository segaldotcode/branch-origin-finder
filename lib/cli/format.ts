import type { OriginResult } from "../git/types";
import { shortSha } from "../git/present";

const LABEL_WIDTH = 21;

function label(text: string): string {
  return `${text.padEnd(LABEL_WIDTH)}:`;
}

export function formatResultAsText(result: OriginResult): string {
  const lines: string[] = [`Branch: ${result.branch}`, ""];

  if (!result.likelySource) {
    lines.push(`${label("Likely source branch")} none found`);
    lines.push(label("Reasons"));
    lines.push("  No candidate branch shares history with this branch");
    return lines.join("\n");
  }

  lines.push(
    `${label("Likely source branch")} ${result.likelySource} (${result.confidence}%)`,
    `${label("Branch point")} commit ${shortSha(result.branchPoint)}`,
    label("Reasons"),
    ...result.reasons.map((reason) => `  ${reason.detail}`),
  );

  return lines.join("\n");
}

export function formatResultsAsText(results: OriginResult[]): string {
  return results.map(formatResultAsText).join("\n\n");
}
