"use client";

import { useState } from "react";
import { JsonInputForm } from "@/components/git/json-input-form";
import { OriginResultCard } from "@/components/git/origin-result-card";
import { AnalyzingSkeleton } from "@/components/git/analyzing-skeleton";
import type { OriginResult } from "@/lib/git/types";
import type { Dictionary } from "@/lib/i18n";

const ANALYZE_DELAY_MS = 550;

export function Analyzer({ dict }: { dict: Dictionary }) {
  const [results, setResults] = useState<OriginResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  function handleParsed(parsed: OriginResult[]) {
    setIsAnalyzing(true);
    window.setTimeout(() => {
      setResults(parsed);
      setIsAnalyzing(false);
    }, ANALYZE_DELAY_MS);
  }

  return (
    <div className="flex flex-col gap-6">
      <JsonInputForm dict={dict} onParsed={handleParsed} isAnalyzing={isAnalyzing} />

      {isAnalyzing && (
        <div className="flex flex-col gap-4">
          <AnalyzingSkeleton />
        </div>
      )}

      {!isAnalyzing && results.length > 0 && (
        <div className="flex flex-col gap-4">
          {results.map((result) => (
            <OriginResultCard key={result.branch} result={result} dict={dict} />
          ))}
        </div>
      )}
    </div>
  );
}
