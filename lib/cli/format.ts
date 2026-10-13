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
    ...(result.tiedWith.length > 0
      ? [`${label("Also equally likely")} ${result.tiedWith.join(", ")}`]
      : []),
    label("Reasons"),
    ...result.reasons.map((reason) => `  ${reason.detail}`),
  );

  return lines.join("\n");
}

/**
 * One line per result: `source (confidence%)`. Meant for quick reads and
 * shell substitution, so a single result carries no branch prefix.
 */
export function formatResultsAsShortText(results: OriginResult[]): string {
  const showBranch = results.length > 1;

  return results
    .map((result) => {
      const answer = result.likelySource
        ? `${result.likelySource} (${result.confidence}%)${
            result.tiedWith.length > 0 ? ` | tied with: ${result.tiedWith.join(", ")}` : ""
          }`
        : "none found";
      return showBranch ? `${result.branch} -> ${answer}` : answer;
    })
    .join("\n");
}

export function formatResultsAsText(results: OriginResult[]): string {
  return results.map(formatResultAsText).join("\n\n");
}
