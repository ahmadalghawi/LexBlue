import { Metadata } from "next";
import CourseDetailClient from "./CourseDetailClient";

// Generate SEO metadata using REST API to avoid Firebase Server SDK issues
export async function generateMetadata({ params }: { params: Promise<{ courseId: string }> }): Promise<Metadata> {
  const { courseId } = await params;
  
  try {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const res = await fetch(`https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/courses/${courseId}`);
    
    if (res.ok) {
      const data = await res.json();
      const title = data.fields?.title?.stringValue;
      const description = data.fields?.description?.stringValue;

      return {
        title: title ? `${title} | LexBlue` : "Course Details | LexBlue",
        description: description || "Course syllabus and pricing.",
      };
    }
  } catch (error) {
    console.error("Metadata fetch error:", error);
  }

  return { title: "Course Details | LexBlue" };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;

  return <CourseDetailClient courseId={courseId} />;
}
