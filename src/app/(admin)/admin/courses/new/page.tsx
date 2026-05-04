"use client";

import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Course } from "@/types";
import CourseForm from "@/components/admin/CourseForm";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewCoursePage() {
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: Omit<Course, "id" | "createdAt" | "updatedAt">) => {
    setSubmitting(true);
    try {
      await addDoc(collection(db, "courses"), {
        ...data,
        totalStudents: 0,
        rating: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      router.push("/admin/courses");
    } catch (e) {
      console.error("Failed to create course:", e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/courses"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back
        </Link>
        <h1 className="font-headline text-3xl font-extrabold text-foreground tracking-tight">
          New Course
        </h1>
      </div>
      <CourseForm onSubmit={handleSubmit} submitting={submitting} />
    </div>
  );
}
