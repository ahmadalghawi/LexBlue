"use client";

import { LessonPlayer } from "@/components/learning/LessonPlayer";

const mockChapters = [
  { id: 1, title: "Environment Setup", duration: "09:20" },
  { id: 2, title: "Deploying to the Cloud", duration: "", isActive: true, isLive: true },
  { id: 3, title: "Containerization with Docker", duration: "12:15" },
  { id: 4, title: "Continuous Integration", duration: "8:45" },
  { id: 5, title: "Monitoring & Observability", duration: "4:00" },
];

export default function LearningPage() {
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
        chapters={mockChapters}
        currentChapter={3}
        totalChapters={5}
        keyTakeaway="Infrastructure as Code (IaC) ensures environment parity and reliable rollbacks."
        resourceTitle="Resources"
        resourceDescription="Download the Terraform Configuration Boilerplate."
      />
    </div>
  );
}
