export type ReasonCode =
  | "reflog_checkout_found"
  | "nearest_common_ancestor"
  | "fewer_divergent_commits"
  | "upstream_tracking_match";

export interface ReasonParams {
  branch?: string;
  branches?: string[];
}

export interface ConfidenceReason {
  code: ReasonCode;
  /** English, human-readable rendering, produced by the CLI. */
  detail: string;
  /** Structured data behind `detail`, so other locales can re-render it. */
  params?: ReasonParams;
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
