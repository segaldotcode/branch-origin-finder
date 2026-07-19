"use client";

import { useState } from "react";
import { JsonInputForm } from "@/components/git/json-input-form";
import { OriginResultCard } from "@/components/git/origin-result-card";
import type { OriginResult } from "@/lib/git/types";
import type { Dictionary } from "@/lib/i18n";

export function Analyzer({ dict }: { dict: Dictionary }) {
  const [results, setResults] = useState<OriginResult[]>([]);

  return (
    <div className="flex flex-col gap-6">
      <JsonInputForm dict={dict} onParsed={setResults} />

      {results.length > 0 && (
        <div className="flex flex-col gap-4">
          {results.map((result) => (
            <OriginResultCard key={result.branch} result={result} dict={dict} />
          ))}
        </div>
      )}
    </div>
  );
}
