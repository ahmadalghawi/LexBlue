"use client";

import { useState, useEffect } from "react";
import { ChevronRight, Clock, ArrowRight } from "lucide-react";
import { VideoPlayer } from "./VideoPlayer";
import { ChapterList, Chapter } from "./ChapterList";
import { InfoCard } from "./InfoCard";
import { cn } from "@/lib/utils";

interface LessonPlayerProps {
  title: string;
  breadcrumb: string[];
  currentTime: string;
  totalTime: string;
  videoUrl?: string;  // YouTube embed URL
  moduleNumber: number;
  totalModules: number;
  remainingTime: string;
  description: string;
  chapters: Chapter[];
  currentChapter: number;
  totalChapters: number;
  keyTakeaway: string;
  resourceTitle: string;
  resourceDescription: string;
  onNextLesson?: () => void;
  onChapterSelect?: (chapterIndex: number) => void;  // Callback when chapter is selected
}

export function LessonPlayer({
  title,
  breadcrumb,
  currentTime,
  totalTime,
  videoUrl,
  moduleNumber,
  totalModules,
  remainingTime,
  description,
  chapters,
  currentChapter,
  totalChapters,
  keyTakeaway,
  resourceTitle,
  resourceDescription,
  onNextLesson,
  onChapterSelect,
}: LessonPlayerProps) {
  const [activeChapterId, setActiveChapterId] = useState<number>(
    chapters.find((c) => c.isActive)?.id || 1
  );
  const [videoProgress, setVideoProgress] = useState(0);

  // Sync activeChapterId when chapters change (e.g., from parent via Next Lesson)
  useEffect(() => {
    const activeChapter = chapters.find((c) => c.isActive);
    if (activeChapter && activeChapter.id !== activeChapterId) {
      setActiveChapterId(activeChapter.id);
    }
  }, [chapters, activeChapterId]);

  const handleChapterSelect = (chapterId: number) => {
    setActiveChapterId(chapterId);
    setVideoProgress(0);
    // Notify parent to change the lesson (chapterId is 1-indexed, so subtract 1)
    onChapterSelect?.(chapterId - 1);
  };

  const chaptersWithActiveState = chapters.map((chapter) => ({
    ...chapter,
    isActive: chapter.id === activeChapterId,
  }));

  return (
    <div className="container mx-auto px-4 pb-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        {breadcrumb.map((item, index) => (
          <span key={index} className="flex items-center gap-2">
            {index > 0 && <ChevronRight className="w-4 h-4" />}
            <span
              className={cn(
                "uppercase tracking-wide font-medium",
                index === 0 ? "text-primary cursor-pointer hover:underline" : ""
              )}
            >
              {item}
            </span>
          </span>
        ))}
      </nav>

      {/* Title */}
      <h1 className="text-3xl font-bold text-foreground mb-6">{title}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player */}
          <VideoPlayer
            currentTime={currentTime}
            totalTime={totalTime}
            videoUrl={videoUrl}
            onProgressChange={setVideoProgress}
          />

          {/* Module info */}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <span className="font-semibold uppercase">
                Module {moduleNumber} Part {currentChapter}
              </span>
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{remainingTime} Remaining</span>
            </span>
          </div>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed">{description}</p>

          {/* Info cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard
              type="takeaway"
              title="Key Takeaway"
              description={keyTakeaway}
            />
            <InfoCard
              type="resources"
              title={resourceTitle}
              description={resourceDescription}
              actionLabel="Download"
              onAction={() => console.log("Download resource")}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <ChapterList
            chapters={chaptersWithActiveState}
            onChapterSelect={handleChapterSelect}
          />

          {/* Next Lesson Button */}
          <button
            onClick={onNextLesson}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-3.5 px-6 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all"
          >
            <span>Next Lesson</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Progress indicator */}
          <div className="text-center text-sm text-muted-foreground space-y-1">
            <div>
              Viewing <span className="font-medium">{activeChapterId} of {totalChapters}</span>
            </div>
            <div>
              <span className="font-medium">{currentChapter}</span> chapters completed
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
