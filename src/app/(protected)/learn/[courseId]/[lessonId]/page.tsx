export const metadata = {
  title: "Lesson Viewer | LexBlue",
  description: "View course lessons.",
};

export default async function LessonViewerPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const { courseId, lessonId } = await params;
  return (
    <div className="container mx-auto p-8">
      <h1 className="font-headline text-headline-md text-primary mb-4">
        Course: {courseId} - Lesson: {lessonId}
      </h1>
      <p className="text-body-lg text-on-surface-variant">
        TODO: Build the main video player UI, chapter navigation, and lesson notes.
      </p>
    </div>
  );
}
