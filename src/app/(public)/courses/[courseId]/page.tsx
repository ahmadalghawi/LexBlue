export const metadata = {
  title: "Course Details | LexBlue",
  description: "Course syllabus and pricing.",
};

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  return (
    <div className="container mx-auto p-8">
      <h1 className="font-headline text-display-lg text-primary mb-4">Course Detail: {courseId}</h1>
      <p className="text-body-lg text-on-surface-variant">
        TODO: Build the Course detail page (Syllabus, pricing, SEO-optimized).
      </p>
    </div>
  );
}
