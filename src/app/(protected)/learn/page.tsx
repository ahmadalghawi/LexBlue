"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function MyLearningPage() {
  const { user, dbUser } = useAuth();

  return (
    <div className="max-w-5xl mx-auto p-8 pt-24">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-headline text-4xl font-extrabold text-foreground tracking-tight mb-3">
          My Learning
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Track your progress and continue where you left off.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
        {[
          { label: "Enrolled", value: "0" },
          { label: "Completed", value: "0" },
          { label: "In Progress", value: "0" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-card rounded-2xl p-6 shadow-xl shadow-foreground/5"
          >
            <p className="text-3xl font-headline font-extrabold text-foreground mb-1">
              {stat.value}
            </p>
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground/70">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Empty State */}
      <div className="bg-card rounded-[2rem] p-12 text-center shadow-xl shadow-foreground/5">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
        <h2 className="font-headline text-2xl font-extrabold text-foreground mb-3">
          No courses yet
        </h2>
        <p className="text-muted-foreground text-base max-w-sm mx-auto mb-8 leading-relaxed">
          You haven&apos;t enrolled in any courses yet. Browse our catalog to get started on your learning journey.
        </p>
        <Link
          href="/courses"
          className="inline-block bg-primary text-primary-foreground font-headline font-bold py-3 px-8 rounded-xl text-sm shadow-[0_4px_14px_rgba(0,136,255,0.25)] hover:bg-primary/90 hover:-translate-y-0.5 transition-all duration-300"
        >
          Browse Courses
        </Link>
      </div>
    </div>
  );
}
