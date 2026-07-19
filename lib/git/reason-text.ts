import type { ReasonCode, ReasonParams } from "./types";

export function describeReasonEn(code: ReasonCode, params: ReasonParams = {}): string {
  switch (code) {
    case "reflog_checkout_found":
      return `Reflog checkout entry found from ${params.branch}`;
    case "nearest_common_ancestor":
      return "Nearest common ancestor found, more recent than other candidates";
    case "fewer_divergent_commits":
      return params.branches && params.branches.length > 0
        ? `Fewer divergent commits than ${params.branches.join(", ")}`
        : "Fewer divergent commits";
    case "upstream_tracking_match":
      return `Branch explicitly tracks ${params.branch}`;
  }
}
