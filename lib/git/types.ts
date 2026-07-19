export type ReasonCode =
  | "reflog_checkout_found"
  | "nearest_common_ancestor"
  | "fewer_divergent_commits"
  | "upstream_tracking_match";

export interface ConfidenceReason {
  code: ReasonCode;
  detail: string;
}

export interface CandidateResult {
  branch: string;
  confidence: number;
  mergeBase: string | null;
  mergeBaseDate: string | null;
  aheadCount: number;
  behindCount: number;
  reflogMatch: boolean;
  upstreamMatch: boolean;
  reasons: ConfidenceReason[];
}

export interface OriginResult {
  branch: string;
  likelySource: string | null;
  confidence: number;
  branchPoint: string | null;
  reasons: ConfidenceReason[];
  candidates: CandidateResult[];
}

export interface InferOptions {
  candidates?: string[];
}
