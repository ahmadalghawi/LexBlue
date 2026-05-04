"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Course } from "@/types";
import Link from "next/link";
import { seedDemoCourses } from "@/lib/seed";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "courses"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setCourses(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Course)));
    } catch (e) {
      console.error("Failed to load courses:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleTogglePublish = async (course: Course) => {
    setTogglingId(course.id);
    try {
      await updateDoc(doc(db, "courses", course.id), {
        isPublished: !course.isPublished,
      });
      setCourses((prev) =>
        prev.map((c) =>
          c.id === course.id ? { ...c, isPublished: !c.isPublished } : c
        )
      );
    } catch (e) {
      console.error("Failed to toggle publish:", e);
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await deleteDoc(doc(db, "courses", id));
      setCourses((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      console.error("Failed to delete course:", e);
    } finally {
      setDeletingId(null);
    }
  };

  const [isSeeding, setIsSeeding] = useState(false);
  const handleSeedCourses = async () => {
    if (!confirm("This will add demo courses to your database. Continue?")) return;
    setIsSeeding(true);
    try {
      await seedDemoCourses();
      await fetchCourses(); // reload the table
    } catch (e) {
      console.error("Failed to seed courses:", e);
    } finally {
      setIsSeeding(false);
    }
  };

  const levelColor = {
    Beginner: "bg-emerald-500/10 text-emerald-400",
    Intermediate: "bg-amber-500/10 text-amber-400",
    Advanced: "bg-rose-500/10 text-rose-400",
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-headline text-3xl font-extrabold text-foreground tracking-tight">
            Courses
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {courses.length} course{courses.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSeedCourses}
            disabled={isSeeding}
            className="inline-flex items-center gap-2 bg-secondary/60 text-foreground font-headline font-bold py-2.5 px-5 rounded-xl text-sm hover:bg-secondary transition-all duration-200 disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            {isSeeding ? "Seeding..." : "Seed Demo Data"}
          </button>
          <Link
            href="/admin/courses/new"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-headline font-bold py-2.5 px-5 rounded-xl text-sm shadow-[0_4px_14px_rgba(0,136,255,0.25)] hover:bg-primary/90 hover:-translate-y-0.5 transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Course
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl shadow-xl shadow-foreground/5 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-7 h-7 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">📚</p>
            <p className="font-headline font-bold text-foreground mb-2">No courses yet</p>
            <p className="text-sm text-muted-foreground mb-6">Create your first course to get started.</p>
            <Link
              href="/admin/courses/new"
              className="inline-block bg-primary text-primary-foreground font-headline font-bold py-2.5 px-6 rounded-xl text-sm"
            >
              Create Course
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground/70">Course</th>
                <th className="px-4 py-4 text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground/70">Category</th>
                <th className="px-4 py-4 text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground/70">Level</th>
                <th className="px-4 py-4 text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground/70">Price</th>
                <th className="px-4 py-4 text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground/70">Status</th>
                <th className="px-4 py-4 text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground/70">Modules</th>
                <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground/70 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {course.thumbnailUrl ? (
                        <img
                          src={course.thumbnailUrl}
                          alt={course.title}
                          className="w-10 h-10 rounded-lg object-cover flex-shrink-0 bg-secondary"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-lg">📚</span>
                        </div>
                      )}
                      <div>
                        <p className="font-headline font-bold text-foreground text-sm leading-tight">
                          {course.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[180px]">
                          {course.instructorName}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-muted-foreground">{course.category}</span>
                  </td>
                  <td className="px-4 py-4">
                    {course.level && (
                      <span className={`text-[11px] font-extrabold uppercase tracking-wider px-2 py-1 rounded-full ${levelColor[course.level] ?? "bg-secondary text-muted-foreground"}`}>
                        {course.level}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm font-bold text-foreground">
                      {course.isFree || course.price === 0 ? (
                        <span className="text-emerald-400">Free</span>
                      ) : (
                        `$${course.price}`
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => handleTogglePublish(course)}
                      disabled={togglingId === course.id}
                      className={`text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full transition-all ${
                        course.isPublished
                          ? "bg-primary/10 text-primary hover:bg-primary/20"
                          : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                      } disabled:opacity-50`}
                    >
                      {togglingId === course.id ? "..." : course.isPublished ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-muted-foreground">
                      {course.modules?.length ?? 0} modules
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/courses/${course.id}/edit`}
                        className="text-xs font-bold text-muted-foreground hover:text-foreground bg-secondary/60 hover:bg-secondary px-3 py-1.5 rounded-lg transition-all"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(course.id)}
                        disabled={deletingId === course.id}
                        className="text-xs font-bold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
                      >
                        {deletingId === course.id ? "..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
