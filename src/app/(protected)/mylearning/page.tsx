"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firestore";
import type { Enrollment, Course } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Clock, Award, ArrowRight, PlayCircle } from "lucide-react";

interface EnrolledCourse {
  enrollment: Enrollment;
  course: Course | null;
}

export default function MyLearningPage() {
  const { user, loading: authLoading } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setLoading(false); return; }

    async function fetchEnrollments() {
      try {
        const q = query(collection(db, "enrollments"), where("userId", "==", user!.uid));
        const snap = await getDocs(q);
        const enrollments = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Enrollment[];

        const results: EnrolledCourse[] = await Promise.all(
          enrollments.map(async (enrollment) => {
            try {
              const courseSnap = await getDoc(doc(db, "courses", enrollment.courseId));
              const course = courseSnap.exists()
                ? ({ id: courseSnap.id, ...courseSnap.data() } as Course)
                : null;
              return { enrollment, course };
            } catch {
              return { enrollment, course: null };
            }
          })
        );
        setEnrolledCourses(results);
      } catch (err) {
        console.error("Failed to fetch enrollments:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchEnrollments();
  }, [user, authLoading]);

  const totalEnrolled = enrolledCourses.length;
  const totalCompleted = enrolledCourses.filter((e) => e.enrollment.progress === 100).length;
  const totalInProgress = enrolledCourses.filter(
    (e) => e.enrollment.progress > 0 && e.enrollment.progress < 100
  ).length;

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center p-6">
        <h1 className="text-3xl font-headline font-bold mb-4">Sign in to see your courses</h1>
        <Link href="/login" className="text-primary hover:underline">Go to Login →</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 pt-24 pb-20">
      {/* Header */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-headline text-4xl font-extrabold text-foreground tracking-tight mb-3">My Learning</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">Track your progress and continue where you left off.</p>
        </div>
        <Link href="/courses" className="flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors whitespace-nowrap">
          Browse more courses <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
        {[
          { label: "Enrolled", value: totalEnrolled, icon: BookOpen },
          { label: "Completed", value: totalCompleted, icon: Award },
          { label: "In Progress", value: totalInProgress, icon: Clock },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-card rounded-2xl p-6 shadow-xl shadow-foreground/5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-3xl font-headline font-extrabold text-foreground leading-none mb-1">{value}</p>
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground/70">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {enrolledCourses.length === 0 ? (
        <div className="bg-card rounded-[2rem] p-12 text-center shadow-xl shadow-foreground/5">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-headline text-2xl font-extrabold text-foreground mb-3">No courses yet</h2>
          <p className="text-muted-foreground text-base max-w-sm mx-auto mb-8 leading-relaxed">
            You haven&apos;t enrolled in any courses yet. Browse our catalog to get started.
          </p>
          <Link href="/courses" className="inline-block bg-primary text-primary-foreground font-headline font-bold py-3 px-8 rounded-xl text-sm hover:bg-primary/90 hover:-translate-y-0.5 transition-all duration-300">
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="font-headline text-xl font-bold text-foreground">Your Courses</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map(({ enrollment, course }) => {
              if (!course) return null;

              const totalLessons = course.modules?.reduce((acc, m) => acc + m.lessons.length, 0) ?? 0;
              const completedCount = enrollment.completedLessons?.length ?? 0;
              const progress = totalLessons > 0
                ? Math.round((completedCount / totalLessons) * 100)
                : enrollment.progress;

              const firstLesson = course.modules?.[0]?.lessons?.[0];
              const resumeLessonId = enrollment.lastLessonId ?? firstLesson?.id;
              // ✅ Updated to use /mylearning route
              const lessonUrl = resumeLessonId
                ? `/mylearning/${course.id}/${resumeLessonId}`
                : `/courses/${course.id}`;

              return (
                <div key={enrollment.id} className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-colors duration-300 flex flex-col group">
                  {/* Thumbnail */}
                  <div className="relative h-44 w-full overflow-hidden">
                    <Image
                      src={course.thumbnailUrl}
                      alt={course.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center shadow-lg">
                        <PlayCircle className="w-7 h-7 text-background" />
                      </div>
                    </div>
                    {progress === 100 ? (
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                        <Award className="w-3 h-3" /> Completed
                      </div>
                    ) : progress > 0 ? (
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-primary/90 text-background text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                        <Clock className="w-3 h-3" /> In Progress
                      </div>
                    ) : null}
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="mb-2 flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{course.category}</span>
                      <span className="text-xs text-muted-foreground">{course.level}</span>
                    </div>
                    <h3 className="font-bold text-foreground text-base leading-snug mb-1 line-clamp-2">{course.title}</h3>
                    <p className="text-xs text-muted-foreground mb-4">by {course.instructorName}</p>

                    <div className="mt-auto space-y-2">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{completedCount} / {totalLessons} lessons done</span>
                        <span className="font-bold text-foreground">{progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                      </div>
                    </div>

                    <Link href={lessonUrl} className="mt-5 w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold text-sm py-2.5 rounded-xl hover:bg-primary/90 transition-all active:scale-[0.98]">
                      <PlayCircle className="w-4 h-4" />
                      {progress === 0 ? "Start Course" : progress === 100 ? "Review Course" : "Continue Learning"}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link href={`/courses/${course.id}`} className="mt-2 w-full text-center text-xs text-muted-foreground hover:text-primary transition-colors py-1">
                      View course details →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
