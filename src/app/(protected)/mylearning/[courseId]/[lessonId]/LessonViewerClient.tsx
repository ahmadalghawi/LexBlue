"use client";

import { useEffect, useState, useCallback } from "react";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firestore";
import type { Course, Lesson, Enrollment } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Circle,
  PlayCircle,
  Clock,
  BookOpen,
  ArrowLeft,
  Menu,
  X,
} from "lucide-react";

interface LessonViewerProps {
  courseId: string;
  lessonId: string;
}

export default function LessonViewerClient({ courseId, lessonId }: LessonViewerProps) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [markingComplete, setMarkingComplete] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      // ✅ Updated redirect to use /mylearning
      router.replace(`/login?redirect=/mylearning/${courseId}/${lessonId}`);
      return;
    }

    async function fetchData() {
      try {
        const courseSnap = await getDoc(doc(db, "courses", courseId));
        if (!courseSnap.exists()) { setLoading(false); return; }
        const courseData = { id: courseSnap.id, ...courseSnap.data() } as Course;
        setCourse(courseData);

        for (const mod of courseData.modules) {
          const found = mod.lessons.find((l) => l.id === lessonId);
          if (found) { setActiveLesson(found); break; }
        }

        const q = query(
          collection(db, "enrollments"),
          where("userId", "==", user!.uid),
          where("courseId", "==", courseId)
        );
        const enrollSnap = await getDocs(q);
        if (!enrollSnap.empty) {
          setEnrollment({ id: enrollSnap.docs[0].id, ...enrollSnap.docs[0].data() } as Enrollment);
        }
      } catch (err) {
        console.error("Failed to load lesson:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [courseId, lessonId, user, authLoading, router]);

  const allLessons: { lesson: Lesson; moduleTitle: string }[] =
    course?.modules?.flatMap((m) => m.lessons.map((l) => ({ lesson: l, moduleTitle: m.title }))) ?? [];

  const currentIndex = allLessons.findIndex((x) => x.lesson.id === lessonId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1].lesson : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1].lesson : null;

  const isCompleted = (lId: string) => enrollment?.completedLessons?.includes(lId) ?? false;

  const totalLessons = allLessons.length;
  const completedCount = enrollment?.completedLessons?.length ?? 0;
  const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const handleMarkComplete = useCallback(async () => {
    if (!enrollment || !activeLesson || isCompleted(activeLesson.id)) return;
    setMarkingComplete(true);
    try {
      const newCompleted = [...(enrollment.completedLessons ?? []), activeLesson.id];
      const newProgress = Math.round((newCompleted.length / totalLessons) * 100);

      await updateDoc(doc(db, "enrollments", enrollment.id), {
        completedLessons: arrayUnion(activeLesson.id),
        lastLessonId: activeLesson.id,
        progress: newProgress,
        ...(newProgress === 100 ? { completedAt: new Date() } : {}),
      });

      setEnrollment((prev) =>
        prev ? { ...prev, completedLessons: newCompleted, lastLessonId: activeLesson.id, progress: newProgress } : prev
      );

      if (nextLesson) {
        setTimeout(() => {
          // ✅ Updated to use /mylearning
          router.push(`/mylearning/${courseId}/${nextLesson.id}`);
        }, 800);
      }
    } catch (err) {
      console.error("Failed to mark complete:", err);
    } finally {
      setMarkingComplete(false);
    }
  }, [enrollment, activeLesson, totalLessons, nextLesson, courseId, router, isCompleted]);

  const formatDuration = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!course || !activeLesson) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center p-6">
        <h1 className="text-3xl font-headline font-bold mb-4">Lesson not found</h1>
        {/* ✅ Back link updated */}
        <Link href="/mylearning" className="text-primary hover:underline">← Back to My Learning</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* ── Top Bar ── */}
      <header className="h-16 border-b border-border bg-card/70 backdrop-blur-md flex items-center px-4 sm:px-6 sticky top-0 z-50 gap-4">
        {/* ✅ Back arrow updated */}
        <Link
          href="/mylearning"
          className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground flex-shrink-0"
          aria-label="Back to My Learning"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground leading-none mb-0.5">{course.title}</p>
          <h1 className="font-bold text-sm text-foreground truncate">{activeLesson.title}</h1>
        </div>

        <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
          <div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-xs font-bold text-foreground whitespace-nowrap">{progress}%</span>
        </div>

        <button
          onClick={() => setSidebarOpen((o) => !o)}
          className="lg:hidden p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground flex-shrink-0"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* ── Main: Video + Info ── */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto p-4 sm:p-8 space-y-8">

            {/* Video Player */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl ring-1 ring-white/10">
              <iframe
                src={activeLesson.videoUrl}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={activeLesson.title}
              />
            </div>

            {/* Lesson info + actions */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-6">
              <div className="flex-1 space-y-3">
                <h2 className="font-headline text-2xl sm:text-3xl font-extrabold text-foreground">{activeLesson.title}</h2>
                {activeLesson.description && (
                  <p className="text-muted-foreground leading-relaxed">{activeLesson.description}</p>
                )}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{formatDuration(activeLesson.duration)}</span>
                  <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" />Lesson {currentIndex + 1} of {totalLessons}</span>
                </div>
              </div>

              <div className="flex-shrink-0">
                {isCompleted(activeLesson.id) ? (
                  <div className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 rounded-xl font-bold text-sm">
                    <CheckCircle className="w-4 h-4" /> Completed
                  </div>
                ) : (
                  <button
                    onClick={handleMarkComplete}
                    disabled={markingComplete}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-60"
                  >
                    {markingComplete
                      ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      : <CheckCircle className="w-4 h-4" />
                    }
                    Mark as Complete
                  </button>
                )}
              </div>
            </div>

            {/* Prev / Next navigation */}
            <div className="flex gap-4 pt-4 border-t border-border">
              {prevLesson ? (
                // ✅ Updated
                <Link href={`/mylearning/${courseId}/${prevLesson.id}`} className="flex items-center gap-2 px-5 py-3 bg-secondary hover:bg-secondary/80 text-foreground font-bold text-sm rounded-xl transition-all">
                  <ChevronLeft className="w-4 h-4" /> Previous
                </Link>
              ) : <div />}

              {nextLesson && (
                // ✅ Updated
                <Link href={`/mylearning/${courseId}/${nextLesson.id}`} className="ml-auto flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground font-bold text-sm rounded-xl hover:bg-primary/90 transition-all">
                  Next Lesson <ChevronRight className="w-4 h-4" />
                </Link>
              )}
              {!nextLesson && progress === 100 && (
                // ✅ Updated
                <Link href="/mylearning" className="ml-auto flex items-center gap-2 px-5 py-3 bg-emerald-500 text-white font-bold text-sm rounded-xl hover:bg-emerald-500/90 transition-all">
                  🎉 Back to My Learning
                </Link>
              )}
            </div>
          </div>
        </main>

        {/* ── Sidebar: Curriculum ── */}
        <aside className={`
          ${sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
          fixed lg:relative right-0 top-16 bottom-0 z-40
          w-80 xl:w-96 border-l border-border bg-card
          flex flex-col transition-transform duration-300 ease-in-out overflow-hidden
        `}>
          <div className="p-5 border-b border-border flex-shrink-0">
            <h3 className="font-headline font-bold text-base text-foreground">Course Content</h3>
            <div className="flex items-center gap-3 mt-3">
              <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
              <span className="text-xs font-bold text-foreground whitespace-nowrap">{completedCount}/{totalLessons}</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {course.modules.map((module, mIdx) => (
              <div key={module.id} className="border-b border-border/50">
                <div className="px-5 py-3 bg-secondary/30">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">Module {mIdx + 1}</p>
                  <p className="text-sm font-bold text-foreground mt-0.5">{module.title}</p>
                </div>
                <div className="divide-y divide-border/30">
                  {module.lessons.map((lesson) => {
                    const isActive = lesson.id === lessonId;
                    const done = isCompleted(lesson.id);
                    return (
                      // ✅ Updated all sidebar lesson links
                      <Link
                        key={lesson.id}
                        href={`/mylearning/${courseId}/${lesson.id}`}
                        className={`flex items-start gap-3 px-5 py-4 transition-all hover:bg-primary/5 ${isActive ? "bg-primary/10 border-l-2 border-primary" : "border-l-2 border-transparent"}`}
                      >
                        <div className="mt-0.5 flex-shrink-0">
                          {done ? <CheckCircle className="w-5 h-5 text-emerald-500" />
                            : isActive ? <PlayCircle className="w-5 h-5 text-primary" />
                            : <Circle className="w-5 h-5 text-muted-foreground/40" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold leading-snug truncate ${isActive ? "text-primary" : done ? "text-muted-foreground" : "text-foreground"}`}>
                            {lesson.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />{formatDuration(lesson.duration)}
                            </span>
                            {lesson.isFree && (
                              <span className="text-[9px] font-bold bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded uppercase">Free</span>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 bg-black/50 z-30 top-16" onClick={() => setSidebarOpen(false)} />
        )}
      </div>
    </div>
  );
}
