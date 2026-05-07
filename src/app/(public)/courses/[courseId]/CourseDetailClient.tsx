"use client";

import { useEffect, useState, useCallback } from "react";
import { doc, getDoc, collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firestore";
import type { Course, Enrollment } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { CheckCircle, Loader2 } from "lucide-react";

export default function CourseDetailClient({ courseId }: { courseId: string }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollSuccess, setEnrollSuccess] = useState(false);

  // Fetch course data
  useEffect(() => {
    async function fetchCourse() {
      try {
        const docRef = doc(db, "courses", courseId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() } as Course;
          if (data.isPublished) {
            setCourse(data);
          } else {
            setError(true);
          }
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Failed to fetch course:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchCourse();
  }, [courseId]);

  // Check if user is already enrolled
  const checkEnrollment = useCallback(async () => {
    if (!user) return;
    try {
      const q = query(
        collection(db, "enrollments"),
        where("userId", "==", user.uid),
        where("courseId", "==", courseId)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        setEnrollment({ id: snap.docs[0].id, ...snap.docs[0].data() } as Enrollment);
      }
    } catch (err) {
      console.error("Failed to check enrollment:", err);
    }
  }, [user, courseId]);

  useEffect(() => {
    if (!authLoading) {
      checkEnrollment();
    }
  }, [authLoading, checkEnrollment]);

  // Handle Enroll button click
  const handleEnroll = async () => {
    if (!user) {
      router.push(`/login?redirect=/courses/${courseId}`);
      return;
    }
    if (enrollment) {
      // Already enrolled — go to learn page
      router.push(`/mylearning`);
      return;
    }

    setEnrolling(true);
    try {
      const totalLessons = course?.modules?.reduce((acc, m) => acc + m.lessons.length, 0) ?? 0;
      const firstModule = course?.modules?.[0];
      const firstLesson = firstModule?.lessons?.[0];

      await addDoc(collection(db, "enrollments"), {
        userId: user.uid,
        courseId: courseId,
        progress: 0,
        completedLessons: [],
        lastLessonId: firstLesson?.id ?? null,
        lastModuleId: firstModule?.id ?? null,
        enrolledAt: serverTimestamp(),
        completedAt: null,
      });

      setEnrollSuccess(true);
      // Re-check enrollment to get the new doc
      await checkEnrollment();
    } catch (err) {
      console.error("Failed to enroll:", err);
    } finally {
      setEnrolling(false);
    }
  };

  // ── Render helpers ──────────────────────────────────────────

  const renderEnrollButton = () => {
    if (enrollSuccess || enrollment) {
      return (
        <div className="space-y-3">
          <div className="w-full flex items-center justify-center gap-2 bg-emerald-500/10 text-emerald-500 font-headline font-bold py-4 rounded-xl text-lg border border-emerald-500/30">
            <CheckCircle className="w-5 h-5" />
            You&apos;re Enrolled!
          </div>
          <Link
            href="/mylearning"
            className="w-full block text-center bg-primary text-primary-foreground font-headline font-bold py-3 rounded-xl hover:bg-primary/90 transition-all active:scale-[0.98]"
          >
            Go to My Learning →
          </Link>
        </div>
      );
    }

    return (
      <button
        onClick={handleEnroll}
        disabled={enrolling || authLoading}
        className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-headline font-bold py-4 rounded-xl text-lg shadow-lg hover:shadow-primary/25 hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {enrolling ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Enrolling...
          </>
        ) : !user ? (
          "Sign In to Enroll"
        ) : (
          course?.isFree ? "Enroll for Free" : `Enroll Now — $${course?.price}`
        )}
      </button>
    );
  };

  // ── Loading / Error states ──────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center p-6">
        <h1 className="text-4xl font-headline font-bold mb-4">Course Not Found</h1>
        <p className="text-muted-foreground mb-8">This course might have been removed or is not published yet.</p>
        <Link href="/courses" className="text-primary hover:underline">
          ← Back to Catalog
        </Link>
      </div>
    );
  }

  // ── Main render ─────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-20 pb-8 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -z-10" />
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-primary/20 blur-[120px] rounded-full -z-10" />

        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-[1fr_400px] gap-12 items-start">
            {/* Left Column: Info */}
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest rounded-full">
                  {course.category}
                </span>
                <span className={`px-3 py-1 font-bold text-xs uppercase tracking-widest rounded-full text-white ${
                  course.level === "Beginner" ? "bg-emerald-500" :
                  course.level === "Intermediate" ? "bg-amber-500" : "bg-rose-500"
                }`}>
                  {course.level}
                </span>
              </div>

              <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight">
                {course.title}
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                {course.description}
              </p>

              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center font-headline font-bold text-lg text-foreground uppercase">
                    {course.instructorName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Instructor</p>
                    <p className="font-bold text-foreground">{course.instructorName}</p>
                  </div>
                </div>
                {course.rating && (
                  <div>
                    <p className="text-sm text-muted-foreground">Rating</p>
                    <p className="font-bold text-foreground flex items-center gap-1">
                      ⭐ {course.rating.toFixed(1)}
                    </p>
                  </div>
                )}
                {course.totalStudents !== undefined && (
                  <div>
                    <p className="text-sm text-muted-foreground">Students</p>
                    <p className="font-bold text-foreground">{course.totalStudents}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Checkout Card */}
            <div className="bg-card border border-border rounded-3xl p-6 shadow-2xl sticky top-24">
              <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-6 relative">
                <Image
                  src={course.thumbnailUrl}
                  alt={course.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  priority
                  className="object-cover"
                />
              </div>

              <div className="space-y-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-headline font-extrabold text-foreground">
                    {course.isFree ? "Free" : `$${course.price}`}
                  </span>
                </div>

                {renderEnrollButton()}

                <div className="pt-6 border-t border-border space-y-4">
                  <h4 className="font-bold text-foreground">This course includes:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-muted-foreground">
                      <span className="text-primary">✓</span> Full lifetime access
                    </li>
                    <li className="flex items-center gap-3 text-muted-foreground">
                      <span className="text-primary">✓</span> Access on all devices
                    </li>
                    <li className="flex items-center gap-3 text-muted-foreground">
                      <span className="text-primary">✓</span> Certificate of completion
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="container mx-auto px-6 pt-4 pb-20">
        <div className="grid lg:grid-cols-[1fr_400px] gap-12">
          <div className="space-y-12">
            {/* About */}
            <div className="space-y-6">
              <h2 className="font-headline text-3xl font-extrabold text-foreground">
                About this course
              </h2>
              <div className="text-muted-foreground space-y-4">
                {course.longDescription?.split('\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                )) || <p>No detailed description provided.</p>}
              </div>
            </div>

            {/* Syllabus */}
            <div className="space-y-8">
              <div className="flex items-baseline justify-between">
                <h2 className="font-headline text-3xl font-extrabold text-foreground">
                  Course Syllabus
                </h2>
                <span className="text-muted-foreground font-medium">
                  {course.modules?.length || 0} Modules • {course.modules?.reduce((acc, m) => acc + m.lessons.length, 0) || 0} Lessons
                </span>
              </div>

              <div className="space-y-4">
                {course.modules?.map((module, mIdx) => (
                  <div key={module.id} className="bg-card border border-border rounded-2xl overflow-hidden">
                    <div className="bg-secondary/50 p-6 border-b border-border">
                      <h3 className="font-bold text-lg text-foreground">
                        Module {mIdx + 1}: {module.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {module.lessons.length} lessons
                      </p>
                    </div>
                    <div className="divide-y divide-border/50">
                      {module.lessons.map((lesson, lIdx) => (
                        <div key={lesson.id} className="p-4 px-6 flex items-start gap-4 hover:bg-secondary/30 transition-colors">
                          <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center flex-shrink-0 text-sm font-bold text-muted-foreground">
                            {lIdx + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-foreground">{lesson.title}</p>
                            {lesson.description && (
                              <p className="text-sm text-muted-foreground mt-1">{lesson.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            {lesson.isFree && (
                              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded">
                                Preview
                              </span>
                            )}
                            <span className="text-sm text-muted-foreground">
                              {Math.floor(lesson.duration / 60)}:{(lesson.duration % 60).toString().padStart(2, '0')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
