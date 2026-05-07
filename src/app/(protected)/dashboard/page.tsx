"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/auth";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { StatCard } from "@/components/ui/StatCard";
import { CourseCard } from "@/components/ui/CourseCard";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { Badge } from "@/components/ui/badge";

/**
 * Dashboard Page
 * 
 * Protected student dashboard showing:
 * - User profile summary
 * - Learning statistics
 * - Enrolled courses
 * - Quick actions
 * 
 * @author LexBlue Development Team
 * @since Dashboard v2.0
 */
export default function DashboardPage() {
  const { user, dbUser } = useAuth();
  const router = useRouter();

  // Handle user sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Demo stats - in production, these would come from Firestore
  const stats = [
    {
      title: "Courses Enrolled",
      value: 4,
      description: "Active enrollments",
      trend: { value: 2, label: "vs last month" },
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m0 0v3.675a55.378 55.378 0 01-5.325 2.037" />
        </svg>
      ),
    },
    {
      title: "Completed",
      value: 12,
      description: "Lessons finished",
      trend: { value: 5, label: "vs last week" },
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "Certificates",
      value: 2,
      description: "Earned badges",
      trend: { value: 1, label: "this month" },
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c.621 0 1.125.504 1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
    },
    {
      title: "Learning Hours",
      value: 24,
      description: "Total time spent",
      trend: { value: 8, label: "vs last week" },
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  // Demo enrolled courses - in production, these would come from Firestore
  const enrolledCourses = [
    {
      id: "1",
      title: "Complete Web Development Bootcamp",
      description: "Learn HTML, CSS, JavaScript, React, Node.js and more",
      category: "Development",
      level: "Beginner" as const,
      rating: 4.8,
      progress: 65,
      thumbnailUrl: "",
    },
    {
      id: "2",
      title: "Advanced React Patterns & Best Practices",
      description: "Master advanced React concepts and design patterns",
      category: "Development",
      level: "Advanced" as const,
      rating: 4.9,
      progress: 32,
      thumbnailUrl: "",
    },
    {
      id: "3",
      title: "UI/UX Design Fundamentals",
      description: "Learn design principles and create beautiful interfaces",
      category: "Design",
      level: "Beginner" as const,
      rating: 4.7,
      progress: 0,
      thumbnailUrl: "",
      isFree: true,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
            Welcome back, {dbUser?.email?.split("@")[0] || "Artisan"}.
          </h1>
          <p className="text-muted-foreground text-lg mt-1">
            Continue your learning journey.
          </p>
        </div>
        
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-headline font-bold py-2.5 px-5 rounded-xl text-sm shadow-[0_4px_14px_rgba(0,136,255,0.25)] hover:bg-primary/90 hover:-translate-y-0.5 transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            Browse Courses
          </Link>
          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 bg-secondary/60 text-muted-foreground font-headline font-bold py-2.5 px-5 rounded-xl text-sm hover:bg-secondary/80 hover:text-foreground transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            Sign Out
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Enrolled Courses */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-headline text-xl font-bold text-foreground tracking-tight">
              My Courses
            </h2>
            <Link
              href="/learn"
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              View All →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enrolledCourses.map((course) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>
        </div>

        {/* Progress & Profile Sidebar */}
        <div className="space-y-6">
          {/* Weekly Progress Card */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            <h3 className="font-headline text-lg font-bold text-foreground tracking-tight mb-4">
              Weekly Goal
            </h3>
            <div className="flex items-center justify-center">
              <ProgressRing progress={75} size={120} strokeWidth={8} label="Complete" />
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">
              3 of 4 lessons completed this week
            </p>
          </div>

          {/* Account Info */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            <h3 className="font-headline text-lg font-bold text-foreground tracking-tight mb-4">
              Account
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground/80 mb-1">
                  Email
                </p>
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.email}
                </p>
              </div>
              {dbUser && (
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground/80 mb-1">
                    Role
                  </p>
                  <Badge variant="secondary" className="text-xs font-bold">
                    {dbUser.role}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Recommended Courses */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            <h3 className="font-headline text-lg font-bold text-foreground tracking-tight mb-4">
              Recommended
            </h3>
            <div className="space-y-3">
              <Link
                href="/courses/4"
                className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.354-1.875-3.024-1.875C9.687 2.25 8.35 3.609 8.35 5.645v4.285c0 1.448-.61 2.775-1.614 3.388-1.04.64-2.276.947-3.569.947-.465 0-.91-.072-1.325-.19-.405-.117-.657-.318-.798-.498-.149-.19-.233-.382-.233-.565 0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.354-1.875-3.024-1.875-1.668 0-3.015.84-3.015 1.875v4.285c0 1.448-.61 2.775-1.614 3.388-1.04.64-2.276.947-3.569.947-.465 0-.91-.072-1.325-.19-.405-.117-.657-.318-.798-.498-.149-.19-.233-.382-.233-.565z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    TypeScript Mastery
                  </p>
                  <p className="text-xs text-muted-foreground">Development</p>
                </div>
              </Link>
              <Link
                href="/courses/5"
                className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    System Design
                  </p>
                  <p className="text-xs text-muted-foreground">Architecture</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
