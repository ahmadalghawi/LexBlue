"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface Chapter {
  id: number;
  title: string;
  duration: string;
  isActive?: boolean;
  isLive?: boolean;
  isCompleted?: boolean;
}

interface ChapterListProps {
  chapters: Chapter[];
  onChapterSelect?: (chapterId: number) => void;
}

export function ChapterList({ chapters, onChapterSelect }: ChapterListProps) {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Lesson Chapters
        </h3>
      </div>

      <div className="divide-y divide-border/50">
        {chapters.map((chapter) => (
          <button
            key={chapter.id}
            onClick={() => onChapterSelect?.(chapter.id)}
            className={cn(
              "w-full text-left p-4 transition-all hover:bg-muted/50 group",
              chapter.isActive && "bg-primary/5 border-l-4 border-l-primary"
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-muted-foreground font-medium uppercase">
                    Chapter {chapter.id}
                  </span>
                  {chapter.isCompleted && (
                    <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </span>
                  )}
                </div>
                <h4
                  className={cn(
                    "text-sm font-medium truncate",
                    chapter.isActive ? "text-primary" : "text-foreground"
                  )}
                >
                  {chapter.title}
                </h4>
              </div>

              <div className="flex-shrink-0">
                {chapter.isLive ? (
                  <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                    Live
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    {chapter.duration}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
