"use client";

import { CircleHelp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/lib/i18n";

export function ScoreDocsDialog({ dict }: { dict: Dictionary }) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            data-cuelume-press
            data-cuelume-release
            aria-label={dict.docs.buttonLabel}
          />
        }
      >
        <CircleHelp />
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{dict.docs.title}</DialogTitle>
          <DialogDescription>{dict.docs.description}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          {dict.docs.signals.map((signal) => (
            <div key={signal.name} className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">{signal.name}</span>
              <span className="text-muted-foreground text-sm">{signal.detail}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-0.5 border-t pt-3">
          <span className="text-sm font-medium">{dict.docs.zeroScoreTitle}</span>
          <span className="text-muted-foreground text-sm">{dict.docs.zeroScoreDetail}</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
