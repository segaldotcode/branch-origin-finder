import { CircleAlert, CircleCheck, GitBranch } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BranchGraph } from "@/components/git/branch-graph";
import { ConfidenceBar } from "@/components/git/confidence-bar";
import { BRANCH_NAME_CLASS, CONFIDENCE_TIER_STYLES, confidenceTier, shortSha } from "@/lib/git/present";
import type { OriginResult } from "@/lib/git/types";
import { localizeReason, type Dictionary } from "@/lib/i18n";

export function OriginResultCard({ result, dict }: { result: OriginResult; dict: Dictionary }) {
  const winner = result.candidates.find((c) => c.branch === result.likelySource);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="text-muted-foreground size-4" />
          <span className={BRANCH_NAME_CLASS}>{result.branch}</span>
        </CardTitle>
        {result.likelySource && (
          <CardDescription>
            {dict.result.likelyFrom}{" "}
            <span className={`font-medium ${BRANCH_NAME_CLASS}`}>{result.likelySource}</span>
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {!result.likelySource || !winner ? (
          <Alert>
            <CircleAlert />
            <AlertTitle>{dict.result.noSourceTitle}</AlertTitle>
            <AlertDescription>{dict.result.noSourceDescription}</AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{dict.result.confidence}</span>
                <span className="text-muted-foreground font-mono text-xs">
                  {dict.result.commit} {shortSha(result.branchPoint)}
                </span>
              </div>
              <ConfidenceBar confidence={result.confidence} />
            </div>

            <BranchGraph
              sourceBranch={result.likelySource}
              targetBranch={result.branch}
              aheadCount={winner.aheadCount}
              behindCount={winner.behindCount}
              branchPoint={result.branchPoint}
              dict={dict}
            />

            <ul className="flex flex-col gap-1.5">
              {result.reasons.map((reason) => (
                <li key={reason.code} className="flex items-start gap-2 text-sm">
                  <CircleCheck className="text-primary mt-0.5 size-4 shrink-0" />
                  {localizeReason(reason, dict)}
                </li>
              ))}
            </ul>
          </>
        )}

        {result.candidates.length > 1 && (
          <Accordion>
            <AccordionItem value="candidates">
              <AccordionTrigger className="text-sm" data-cuelume-press data-cuelume-release>
                {dict.result.allCandidates} ({result.candidates.length})
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-3">
                {result.candidates.map((candidate) => (
                  <div
                    key={candidate.branch}
                    data-cuelume-hover="tick"
                    className="flex flex-col gap-1 rounded-md border p-3 text-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-medium ${BRANCH_NAME_CLASS}`}>{candidate.branch}</span>
                      <Badge
                        variant="outline"
                        className={CONFIDENCE_TIER_STYLES[confidenceTier(candidate.confidence)].badge}
                      >
                        {candidate.confidence}%
                      </Badge>
                    </div>
                    <span className="text-muted-foreground">
                      {candidate.aheadCount} {dict.result.ahead}, {candidate.behindCount}{" "}
                      {dict.result.behind}
                      {candidate.mergeBase
                        ? ` ${dict.result.fromCommit} ${shortSha(candidate.mergeBase)}`
                        : ""}
                    </span>
                    {candidate.reasons.length > 0 && (
                      <ul className="text-muted-foreground mt-1 flex flex-col gap-0.5">
                        {candidate.reasons.map((reason) => (
                          <li key={reason.code}>- {localizeReason(reason, dict)}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}
