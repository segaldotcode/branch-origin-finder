import type { CandidateResult, ConfidenceReason, OriginResult } from "./types";

export class InvalidOriginResultError extends Error {}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isNullableString(value: unknown): value is string | null {
  return value === null || isString(value);
}

function assertReason(value: unknown, context: string): ConfidenceReason {
  if (typeof value !== "object" || value === null) {
    throw new InvalidOriginResultError(`${context}: expected a reason object`);
  }
  const reason = value as Record<string, unknown>;
  if (!isString(reason.code) || !isString(reason.detail)) {
    throw new InvalidOriginResultError(`${context}: reason is missing "code" or "detail"`);
  }
  return { code: reason.code as ConfidenceReason["code"], detail: reason.detail };
}

function assertCandidate(value: unknown, context: string): CandidateResult {
  if (typeof value !== "object" || value === null) {
    throw new InvalidOriginResultError(`${context}: expected a candidate object`);
  }
  const candidate = value as Record<string, unknown>;

  if (!isString(candidate.branch)) {
    throw new InvalidOriginResultError(`${context}: candidate is missing "branch"`);
  }
  if (!isNumber(candidate.confidence)) {
    throw new InvalidOriginResultError(`${context}: candidate is missing "confidence"`);
  }
  if (!isNullableString(candidate.mergeBase)) {
    throw new InvalidOriginResultError(`${context}: candidate has an invalid "mergeBase"`);
  }
  if (!isNullableString(candidate.mergeBaseDate)) {
    throw new InvalidOriginResultError(`${context}: candidate has an invalid "mergeBaseDate"`);
  }
  if (!isNumber(candidate.aheadCount) || !isNumber(candidate.behindCount)) {
    throw new InvalidOriginResultError(`${context}: candidate has invalid ahead/behind counts`);
  }
  if (!Array.isArray(candidate.reasons)) {
    throw new InvalidOriginResultError(`${context}: candidate is missing "reasons"`);
  }

  return {
    branch: candidate.branch,
    confidence: candidate.confidence,
    mergeBase: candidate.mergeBase,
    mergeBaseDate: candidate.mergeBaseDate,
    aheadCount: candidate.aheadCount,
    behindCount: candidate.behindCount,
    reflogMatch: Boolean(candidate.reflogMatch),
    upstreamMatch: Boolean(candidate.upstreamMatch),
    reasons: candidate.reasons.map((r, i) => assertReason(r, `${context}.reasons[${i}]`)),
  };
}

export function parseOriginResult(value: unknown, context = "result"): OriginResult {
  if (typeof value !== "object" || value === null) {
    throw new InvalidOriginResultError("Expected a JSON object produced by `branch-origin --json`.");
  }
  const result = value as Record<string, unknown>;

  if (!isString(result.branch)) {
    throw new InvalidOriginResultError(`${context} is missing "branch"`);
  }
  if (!isNullableString(result.likelySource)) {
    throw new InvalidOriginResultError(`${context} has an invalid "likelySource"`);
  }
  if (!isNumber(result.confidence)) {
    throw new InvalidOriginResultError(`${context} is missing "confidence"`);
  }
  if (!isNullableString(result.branchPoint)) {
    throw new InvalidOriginResultError(`${context} has an invalid "branchPoint"`);
  }
  if (!Array.isArray(result.reasons)) {
    throw new InvalidOriginResultError(`${context} is missing "reasons"`);
  }
  if (!Array.isArray(result.candidates)) {
    throw new InvalidOriginResultError(`${context} is missing "candidates"`);
  }

  return {
    branch: result.branch,
    likelySource: result.likelySource,
    confidence: result.confidence,
    branchPoint: result.branchPoint,
    reasons: result.reasons.map((r, i) => assertReason(r, `${context}.reasons[${i}]`)),
    candidates: result.candidates.map((c, i) => assertCandidate(c, `${context}.candidates[${i}]`)),
  };
}

export function parseOriginResults(json: string): OriginResult[] {
  let value: unknown;
  try {
    value = JSON.parse(json);
  } catch {
    throw new InvalidOriginResultError("This is not valid JSON.");
  }

  if (Array.isArray(value)) {
    return value.map((item, i) => parseOriginResult(item, `result[${i}]`));
  }

  return [parseOriginResult(value)];
}
