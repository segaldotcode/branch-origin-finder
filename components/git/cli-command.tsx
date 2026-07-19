"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

export function CliCommand({ dict }: { dict: Dictionary }) {
  const [manager, setManager] = useState<PackageManager>("pnpm");
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(COMMANDS[manager]);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Tabs
      value={manager}
      onValueChange={(value) => setManager(value as PackageManager)}
      className="gap-0 rounded-lg border"
    >
      <TabsList variant="line" className="border-b px-2 pt-1">
        {PACKAGE_MANAGERS.map((pm) => (
          <TabsTrigger key={pm} value={pm} data-cuelume-press data-cuelume-release>
            {pm}
          </TabsTrigger>
        ))}
      </TabsList>

      {PACKAGE_MANAGERS.map((pm) => (
        <TabsContent key={pm} value={pm} className="flex items-center justify-between gap-2 p-4">
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
                  aria-label={dict.cli.copy}
                />
              }
            >
              {copied ? <Check className="text-emerald-500" /> : <Copy />}
            </TooltipTrigger>
            <TooltipContent>{copied ? dict.cli.copied : dict.cli.copy}</TooltipContent>
          </Tooltip>
        </TabsContent>
      ))}
    </Tabs>
  );
}
