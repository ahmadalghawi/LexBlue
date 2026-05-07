import LessonViewerClient from "./LessonViewerClient";

export const metadata = {
  title: "Lesson Viewer | LexBlue",
  description: "Watch your course lesson and track your progress.",
};

export default async function LessonViewerPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const { courseId, lessonId } = await params;
  return <LessonViewerClient courseId={courseId} lessonId={lessonId} />;
}
