"use client";

import { cn } from "@/lib/utils";
import { Lightbulb, FileText, Download, ExternalLink } from "lucide-react";

interface InfoCardProps {
  type: "takeaway" | "resources";
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function InfoCard({
  type,
  title,
  description,
  actionLabel,
  onAction,
}: InfoCardProps) {
  const Icon = type === "takeaway" ? Lightbulb : FileText;
  const ActionIcon = type === "resources" ? Download : ExternalLink;

  return (
    <div
      className={cn(
        "rounded-xl border p-5 transition-all hover:shadow-md",
        type === "takeaway"
          ? "bg-amber-50/50 border-amber-200/50 dark:bg-amber-950/20 dark:border-amber-800/30"
          : "bg-card border-border"
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center",
            type === "takeaway"
              ? "bg-amber-100 dark:bg-amber-900/40"
              : "bg-primary/10"
          )}
        >
          <Icon
            className={cn(
              "w-5 h-5",
              type === "takeaway"
                ? "text-amber-600 dark:text-amber-400"
                : "text-primary"
            )}
          />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-2">
            {title}
          </h4>
          <p className="text-sm text-foreground leading-relaxed">
            {description}
          </p>

          {actionLabel && (
            <button
              onClick={onAction}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              <ActionIcon className="w-4 h-4" />
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
