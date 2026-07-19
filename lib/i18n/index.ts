import en from "@/lib/i18n/en.json";
import fr from "@/lib/i18n/fr.json";
import type { ConfidenceReason } from "@/lib/git/types";

export type Locale = "en" | "fr";

export const dictionaries = { en, fr } satisfies Record<Locale, typeof en>;

export type Dictionary = typeof en;

export function getDictionary(locale: string | undefined): Dictionary {
  return locale === "fr" ? dictionaries.fr : dictionaries.en;
}

export function localizeReason(reason: ConfidenceReason, dict: Dictionary): string {
  const params = reason.params;

  switch (reason.code) {
    case "reflog_checkout_found":
      return params?.branch
        ? dict.reasons.reflog_checkout_found.replace("{branch}", params.branch)
        : reason.detail;
    case "nearest_common_ancestor":
      return dict.reasons.nearest_common_ancestor;
    case "fewer_divergent_commits":
      return params?.branches && params.branches.length > 0
        ? dict.reasons.fewer_divergent_commits.replace("{branches}", params.branches.join(", "))
        : dict.reasons.fewer_divergent_commits_generic;
    case "upstream_tracking_match":
      return params?.branch
        ? dict.reasons.upstream_tracking_match.replace("{branch}", params.branch)
        : reason.detail;
    default:
      return reason.detail;
  }
}
