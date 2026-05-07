"use client";

import { useState } from "react";
import { LessonPlayer } from "./LessonPlayer";
import type { Chapter } from "./ChapterList";

const mockChapters: Chapter[] = [
  { id: 1, title: "Environment Setup", duration: "09:20", isCompleted: true },
  {
    id: 2,
    title: "Deploying to the Cloud",
    duration: "",
    isActive: true,
    isLive: true,
  },
  { id: 3, title: "Containerization with Docker", duration: "12:15" },
  { id: 4, title: "Continuous Integration", duration: "8:45" },
  { id: 5, title: "Monitoring & Observability", duration: "4:00" },
];

export function MyLearningContent() {
  const [chapters, setChapters] = useState(mockChapters);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(1);

  const handleNextLesson = () => {
    if (currentChapterIndex < chapters.length - 1) {
      const updatedChapters = chapters.map((chapter, index) => ({
        ...chapter,
        isActive: index === currentChapterIndex + 1,
        isCompleted: index <= currentChapterIndex ? true : chapter.isCompleted,
        isLive: index === currentChapterIndex + 1,
      }));
      setChapters(updatedChapters);
      setCurrentChapterIndex(currentChapterIndex + 1);
    }
  };

  const completedCount = chapters.filter((c) => c.isCompleted).length;

  return (
    <div className="min-h-screen bg-background pt-8">
      <LessonPlayer
        title="Deploying to the Cloud"
        breadcrumb={["MY LEARNING", "ADVANCED CLOUD ARCHITECTURE"]}
        currentTime="12:45"
        totalTime="34:20"
        moduleNumber={4}
        totalModules={12}
        remainingTime="45 MIN"
        description="In this technical module, we transition from local development to production-grade cloud environments. You will learn to orchestrate scalable infrastructure using automated deployment pipelines and state-of-the-art container management."
        chapters={chapters}
        currentChapter={completedCount}
        totalChapters={chapters.length}
        keyTakeaway="Infrastructure as Code (IaC) ensures environment parity and reliable rollbacks."
        resourceTitle="Resources"
        resourceDescription="Download the Terraform Configuration Boilerplate."
        onNextLesson={handleNextLesson}
      />
    </div>
  );
}
