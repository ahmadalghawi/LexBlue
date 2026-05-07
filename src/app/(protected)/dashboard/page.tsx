"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firestore";
import type { Enrollment, Course } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { 
  BookOpen, 
  Award, 
  Clock, 
  TrendingUp, 
  PlayCircle,
  CheckCircle,
  BarChart3,
  User as UserIcon,
  Mail,
  Shield
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface EnrolledCourse {
  enrollment: Enrollment;
  course: Course | null;
}

export default function DashboardPage() {
  const { user, dbUser, loading: authLoading } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setLoading(false); return; }

    async function fetchDashboardData() {
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
        
        // Sort by most recently updated/progressed if possible, or just default
        setEnrolledCourses(results);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, [user, authLoading]);

  // Derived Statistics
  const totalEnrolled = enrolledCourses.length;
  
  // Calculate true progress
  const coursesWithProgress = enrolledCourses.map(({ enrollment, course }) => {
    const totalLessons = course?.modules?.reduce((acc, m) => acc + m.lessons.length, 0) ?? 0;
    const completedCount = enrollment.completedLessons?.length ?? 0;
    const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : enrollment.progress;
    return { enrollment, course, progress, totalLessons, completedCount };
  });

  const completedCourses = coursesWithProgress.filter(c => c.progress === 100);
  const inProgressCourses = coursesWithProgress.filter(c => c.progress > 0 && c.progress < 100);
  const notStartedCourses = coursesWithProgress.filter(c => c.progress === 0);

  // Overall completion rate
  const overallProgress = coursesWithProgress.length > 0 
    ? Math.round(coursesWithProgress.reduce((acc, c) => acc + c.progress, 0) / coursesWithProgress.length)
    : 0;

  if (authLoading || loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground font-headline font-bold tracking-widest uppercase text-sm">Loading Dashboard</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6">
        <h1 className="text-3xl font-headline font-bold mb-4">Please sign in</h1>
        <Link href="/login" className="text-primary hover:underline">Go to Login →</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 pb-24 space-y-10">
      
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-card border border-border p-8 rounded-3xl relative overflow-hidden">
        {/* Decorative background blur */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-bold tracking-wider uppercase text-primary bg-primary/10 px-3 py-1 rounded-full">
              Student Dashboard
            </span>
          </div>
          <h1 className="font-headline text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight mb-2">
            Welcome back, <span className="text-primary">{dbUser?.email?.split("@")[0] || "Student"}</span>.
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl">
            Here is an overview of your learning journey and recent progress.
          </p>
        </div>
        
        <div className="relative z-10 flex gap-3">
          <Link
            href="/courses"
            className="flex items-center gap-2 bg-secondary text-foreground font-headline font-bold py-3 px-6 rounded-xl text-sm hover:bg-secondary/80 transition-all"
          >
            Browse Catalog
          </Link>
          <Link
            href="/mylearning"
            className="flex items-center gap-2 bg-primary text-primary-foreground font-headline font-bold py-3 px-6 rounded-xl text-sm shadow-[0_4px_14px_rgba(0,136,255,0.25)] hover:bg-primary/90 hover:-translate-y-0.5 transition-all"
          >
            Go to My Learning
          </Link>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { label: "Enrolled Courses", value: totalEnrolled, icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "In Progress", value: inProgressCourses.length, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Completed", value: completedCourses.length, icon: Award, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Overall Progress", value: `${overallProgress}%`, icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-500/10" },
        ].map((stat, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-between hover:border-primary/30 transition-colors">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-4xl font-headline font-extrabold text-foreground mb-1">{stat.value}</p>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Dashboard Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Larger) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Learning Analysis / Progress Chart */}
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-headline text-xl font-bold text-foreground">Learning Analysis</h2>
                <p className="text-sm text-muted-foreground">Your progress across all enrolled courses</p>
              </div>
            </div>

            {coursesWithProgress.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-border rounded-2xl">
                <p className="text-muted-foreground font-medium">No courses enrolled yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {coursesWithProgress.map((c) => (
                  <div key={c.enrollment.id} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <div className="min-w-0 pr-4">
                        <Link href={c.course ? `/courses/${c.course.id}` : "#"} className="font-bold text-sm text-foreground hover:text-primary truncate block">
                          {c.course?.title || "Unknown Course"}
                        </Link>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {c.completedCount} of {c.totalLessons} lessons completed
                        </p>
                      </div>
                      <span className="text-sm font-bold text-foreground tabular-nums">{c.progress}%</span>
                    </div>
                    {/* Custom Progress Bar */}
                    <div className="w-full h-3 bg-secondary rounded-full overflow-hidden flex">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${c.progress === 100 ? 'bg-emerald-500' : 'bg-primary'}`}
                        style={{ width: `${c.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Continue Learning (In Progress) */}
          {inProgressCourses.length > 0 && (
            <div className="space-y-4">
              <h2 className="font-headline text-xl font-bold text-foreground px-2">Continue Learning</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {inProgressCourses.slice(0, 4).map((c) => {
                  const firstLesson = c.course?.modules?.[0]?.lessons?.[0];
                  const resumeLessonId = c.enrollment.lastLessonId ?? firstLesson?.id;
                  const lessonUrl = resumeLessonId && c.course ? `/mylearning/${c.course.id}/${resumeLessonId}` : `/mylearning`;

                  return (
                    <Link key={c.enrollment.id} href={lessonUrl} className="group bg-card border border-border rounded-2xl p-4 flex gap-4 hover:border-primary/50 transition-all hover:shadow-lg">
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-secondary">
                        {c.course?.thumbnailUrl && (
                          <Image src={c.course.thumbnailUrl} alt={c.course.title} fill className="object-cover group-hover:scale-105 transition-transform" sizes="96px" />
                        )}
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <PlayCircle className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <div className="flex flex-col justify-center min-w-0 flex-1">
                        <h3 className="font-bold text-sm text-foreground line-clamp-2 mb-1">{c.course?.title}</h3>
                        <p className="text-xs text-muted-foreground mb-3">{c.progress}% Completed</p>
                        <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${c.progress}%` }} />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Right Column (Sidebar replacement) */}
        <div className="space-y-8">
          
          {/* User Profile Card */}
          <div className="bg-card border border-border rounded-3xl p-6">
            <h2 className="font-headline text-lg font-bold text-foreground mb-6 flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-primary" /> Profile Info
            </h2>
            <div className="space-y-5">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground mb-1">Email</p>
                <div className="flex items-center gap-3 bg-secondary/50 p-3 rounded-xl">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground truncate">{user.email}</span>
                </div>
              </div>
              {dbUser?.role && (
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground mb-1">Account Role</p>
                  <div className="flex items-center gap-3 bg-secondary/50 p-3 rounded-xl">
                    <Shield className="w-4 h-4 text-primary" />
                    <Badge variant="default" className="text-xs font-bold uppercase tracking-wider">{dbUser.role}</Badge>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Completed Courses */}
          <div className="bg-card border border-border rounded-3xl p-6">
            <h2 className="font-headline text-lg font-bold text-foreground mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-500" /> Completed
            </h2>
            
            {completedCourses.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No completed courses yet. Keep going!</p>
            ) : (
              <div className="space-y-4">
                {completedCourses.map((c) => (
                  <div key={c.enrollment.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">{c.course?.title}</p>
                      <p className="text-xs text-muted-foreground">Completed successfully</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
