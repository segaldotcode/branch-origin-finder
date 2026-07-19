import type { OriginResult } from "./types";

export const EXAMPLE_RESULT: OriginResult = {
  branch: "feature/payment-refactor",
  likelySource: "develop",
  confidence: 92,
  branchPoint: "8af32cd1e9b7c4f6a2d0e5b1c3f7a9d2e4b6c8f0",
  reasons: [
    {
      code: "reflog_checkout_found",
      params: { branch: "develop" },
      detail: "Reflog checkout entry found from develop",
    },
    {
      code: "nearest_common_ancestor",
      detail: "Nearest common ancestor found, more recent than other candidates",
    },
    {
      code: "fewer_divergent_commits",
      params: { branches: ["main"] },
      detail: "Fewer divergent commits than main",
    },
  ],
  candidates: [
    {
      branch: "develop",
      confidence: 92,
      mergeBase: "8af32cd1e9b7c4f6a2d0e5b1c3f7a9d2e4b6c8f0",
      mergeBaseDate: "2026-07-14T09:12:00+01:00",
      aheadCount: 4,
      behindCount: 11,
      reflogMatch: true,
      upstreamMatch: false,
      reasons: [
        {
          code: "reflog_checkout_found",
          params: { branch: "develop" },
          detail: "Reflog checkout entry found from develop",
        },
        {
          code: "nearest_common_ancestor",
          detail: "Nearest common ancestor found, more recent than other candidates",
        },
        {
          code: "fewer_divergent_commits",
          params: { branches: ["main"] },
          detail: "Fewer divergent commits than main",
        },
      ],
    },
    {
      branch: "main",
      confidence: 0,
      mergeBase: "1c4a7e3f8b2d6a0c9e5f3b7d1a4c8e2f6b0d4a8c",
      mergeBaseDate: "2026-06-02T17:40:00+01:00",
      aheadCount: 15,
      behindCount: 3,
      reflogMatch: false,
      upstreamMatch: false,
      reasons: [],
    },
  ],
};

export const EXAMPLE_RESULT_JSON = JSON.stringify(EXAMPLE_RESULT, null, 2);
