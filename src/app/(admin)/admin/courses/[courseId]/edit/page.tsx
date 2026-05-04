"use client";

import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Course } from "@/types";
import CourseForm from "@/components/admin/CourseForm";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EditCoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = React.use(params);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const snap = await getDoc(doc(db, "courses", courseId));
      if (snap.exists()) {
        setCourse({ id: snap.id, ...snap.data() } as Course);
      }
      setLoading(false);
    };
    load();
  }, [courseId]);

  const handleSubmit = async (data: Omit<Course, "id" | "createdAt" | "updatedAt">) => {
    setSubmitting(true);
    try {
      await updateDoc(doc(db, "courses", courseId), {
        ...data,
        updatedAt: serverTimestamp(),
      });
      router.push("/admin/courses");
    } catch (e) {
      console.error("Failed to update course:", e);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-7 h-7 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Course not found.</p>
        <Link href="/admin/courses" className="text-primary mt-4 inline-block">← Back to courses</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/courses" className="text-muted-foreground hover:text-foreground transition-colors">
          ← Back
        </Link>
        <h1 className="font-headline text-3xl font-extrabold text-foreground tracking-tight">
          Edit Course
        </h1>
      </div>
      <CourseForm initialData={course} onSubmit={handleSubmit} submitting={submitting} />
    </div>
  );
}
