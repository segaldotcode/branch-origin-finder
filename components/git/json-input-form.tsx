"use client";

import { useState } from "react";
import { CircleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { parseOriginResults, InvalidOriginResultError } from "@/lib/git/validate";
import { EXAMPLE_RESULT_JSON } from "@/lib/git/example-result";
import type { OriginResult } from "@/lib/git/types";

interface JsonInputFormProps {
  onParsed: (results: OriginResult[]) => void;
}

export function JsonInputForm({ onParsed }: JsonInputFormProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  function analyze(json: string) {
    try {
      const results = parseOriginResults(json);
      setError(null);
      onParsed(results);
    } catch (err) {
      setError(err instanceof InvalidOriginResultError ? err.message : "Could not parse this JSON.");
    }
  }

  function loadExample() {
    setValue(EXAMPLE_RESULT_JSON);
    analyze(EXAMPLE_RESULT_JSON);
  }

  return (
    <div className="flex flex-col gap-3">
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={`Paste the output of\nbranch-origin <branch-name> --json`}
        className="min-h-40 font-mono text-xs"
      />

      {error && (
        <Alert variant="destructive">
          <CircleAlert />
          <AlertTitle>Could not read this JSON</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2">
        <Button onClick={() => analyze(value)} disabled={value.trim().length === 0}>
          Analyze
        </Button>
        <Button variant="outline" onClick={loadExample}>
          Load example
        </Button>
      </div>
    </div>
  );
}
