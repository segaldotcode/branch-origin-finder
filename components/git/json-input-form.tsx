"use client";

import { useState } from "react";
import { ChevronDown, CircleAlert, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { parseOriginResults, InvalidOriginResultError } from "@/lib/git/validate";
import { EXAMPLE_RESULT_JSON } from "@/lib/git/example-result";
import type { OriginResult } from "@/lib/git/types";
import type { Dictionary } from "@/lib/i18n";

interface JsonInputFormProps {
  dict: Dictionary;
  isAnalyzing: boolean;
  onParsed: (results: OriginResult[]) => void;
}

export function JsonInputForm({ dict, isAnalyzing, onParsed }: JsonInputFormProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(true);

  function analyze(json: string) {
    try {
      const results = parseOriginResults(json);
      setError(null);
      onParsed(results);
      setIsOpen(false);
    } catch (err) {
      setError(err instanceof InvalidOriginResultError ? err.message : dict.form.genericError);
    }
  }

  function loadExample() {
    setValue(EXAMPLE_RESULT_JSON);
    analyze(EXAMPLE_RESULT_JSON);
  }

  const preview = value.trim().split("\n")[0]?.slice(0, 60) ?? "";

  return (
    <div className="flex flex-col gap-3">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between gap-2">
          <CollapsibleTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                size="sm"
                data-cuelume-press
                data-cuelume-release
                className="text-muted-foreground hover:text-foreground h-auto gap-1 px-1 py-0.5 text-xs font-medium"
              />
            }
          >
            <ChevronDown className={`size-3.5 transition-transform ${isOpen ? "" : "-rotate-90"}`} />
            {dict.form.inputLabel}
          </CollapsibleTrigger>
          {!isOpen && value && (
            <span className="text-muted-foreground truncate font-mono text-xs">{preview}...</span>
          )}
        </div>

        <CollapsibleContent>
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={dict.form.placeholder}
            disabled={isAnalyzing}
            className="mt-2 min-h-40 font-mono text-xs"
          />
        </CollapsibleContent>
      </Collapsible>

      {error && (
        <Alert variant="destructive">
          <CircleAlert />
          <AlertTitle>{dict.form.errorTitle}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2">
        <Button
          data-cuelume-press
          data-cuelume-release
          onClick={() => analyze(value)}
          disabled={isAnalyzing || value.trim().length === 0}
        >
          {isAnalyzing && <Loader2 className="animate-spin" />}
          {dict.form.analyze}
        </Button>
        <Button
          variant="outline"
          data-cuelume-press
          data-cuelume-release
          onClick={loadExample}
          disabled={isAnalyzing || value === EXAMPLE_RESULT_JSON}
        >
          {dict.form.loadExample}
        </Button>
      </div>
    </div>
  );
}
