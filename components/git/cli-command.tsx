"use client";

import { useState } from "react";
import { Check, Copy, X } from "lucide-react";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Dictionary } from "@/lib/i18n";

const PACKAGE_MANAGERS = ["pnpm", "npm", "yarn", "bun"] as const;
type PackageManager = (typeof PACKAGE_MANAGERS)[number];

const COMMANDS: Record<PackageManager, string> = {
  pnpm: "pnpm branch-origin <branch-name> --json",
  npm: "npm run branch-origin -- <branch-name> --json",
  yarn: "yarn branch-origin <branch-name> --json",
  bun: "bun run branch-origin <branch-name> --json",
};

type CopyStatus = "idle" | "copied" | "failed";

function copyWithFallback(text: string): boolean {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const succeeded = document.execCommand("copy");
  document.body.removeChild(textarea);
  return succeeded;
}

export function CliCommand({ dict }: { dict: Dictionary }) {
  const [manager, setManager] = useState<PackageManager>("pnpm");
  const [status, setStatus] = useState<CopyStatus>("idle");

  async function copy() {
    let succeeded: boolean;
    try {
      await navigator.clipboard.writeText(COMMANDS[manager]);
      succeeded = true;
    } catch {
      succeeded = copyWithFallback(COMMANDS[manager]);
    }

    setStatus(succeeded ? "copied" : "failed");
    window.setTimeout(() => setStatus("idle"), 1500);
  }

  const label =
    status === "copied" ? dict.cli.copied : status === "failed" ? dict.cli.copyFailed : dict.cli.copy;

  return (
    <Tabs
      value={manager}
      onValueChange={(value) => setManager(value as PackageManager)}
      className="rounded-lg border"
    >
      <div className="border-b px-2">
        <TabsList variant="underline">
          {PACKAGE_MANAGERS.map((pm) => (
            <TabsTab key={pm} value={pm} data-cuelume-press data-cuelume-release>
              {pm}
            </TabsTab>
          ))}
        </TabsList>
      </div>

      {PACKAGE_MANAGERS.map((pm) => (
        <TabsPanel key={pm} value={pm} className="flex items-center justify-between gap-2 p-4">
          <code className="overflow-x-auto font-mono text-xs whitespace-pre">{COMMANDS[pm]}</code>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0"
                  data-cuelume-press
                  data-cuelume-release
                  onClick={copy}
                  disabled={status !== "idle"}
                  aria-label={label}
                />
              }
            >
              {status === "copied" && <Check className="text-emerald-500" />}
              {status === "failed" && <X className="text-rose-500" />}
              {status === "idle" && <Copy />}
            </TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
          </Tooltip>
        </TabsPanel>
      ))}
    </Tabs>
  );
}
