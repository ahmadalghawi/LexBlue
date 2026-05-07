"use client";

import { ArrowRight, Monitor, CloudCheck, Star, TrendingUp } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Course } from "@/types";
import { useEffect, useState } from "react";

export function HomeCourseHighlight() {
  const [highlightedCourse, setHighlightedCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);
      try {
        const sentQuery = query(
          collection(db, "courses"),
          where("rating", ">=", 4)
        );
        const snap = await getDocs(sentQuery);
        const courses = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Course));
        const picked = courses[Math.floor(Math.random() * courses.length)];
        setHighlightedCourse(picked ?? null);
      } catch (e) {
        console.error("Homepage: Failed to load courses", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, []);

  return (
    <section className="w-full px-6 xl:px-16 py-24 bg-secondary/10">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-3">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary/70">
              Featured Learning
            </span>
            <h2 className="font-headline text-4xl sm:text-5xl font-extrabold text-foreground leading-tight">
              Master the Digital
              <br />
              <span className="text-primary">Infrastructure</span>
            </h2>
          </div>
          <Link href="/courses">
            <button className="group flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors">
              View all courses
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>

        {/* Cards Grid */}
        <div className="grid xl:grid-cols-[1fr_340px] gap-6">

          {/* ── Featured Course Card ── */}
          <div className="bg-card border border-border/50 rounded-3xl p-8 flex flex-col min-h-[380px] group hover:border-primary/30 transition-colors duration-300">
            {isLoading ? (
              <div className="flex-1 space-y-4 animate-pulse">
                <div className="h-4 w-32 bg-muted rounded-full" />
                <div className="h-8 w-3/4 bg-muted rounded-full" />
                <div className="h-4 w-full bg-muted rounded-full" />
                <div className="h-4 w-2/3 bg-muted rounded-full" />
              </div>
            ) : highlightedCourse ? (
              <>
                {/* Top section */}
                <div className="flex items-start justify-between gap-6 flex-1">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      <Monitor className="w-3.5 h-3.5 text-primary" />
                      Highlighted Course
                    </div>
                    <h3 className="font-headline text-3xl sm:text-4xl font-extrabold text-foreground leading-tight">
                      {highlightedCourse.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed line-clamp-3 max-w-xl">
                      {highlightedCourse.longDescription || highlightedCourse.description}
                    </p>
                    <div className="flex flex-wrap gap-3 pt-2">
                      <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
                        {highlightedCourse.category}
                      </span>
                      <span className="px-3 py-1 bg-secondary/50 text-foreground/70 text-xs font-bold rounded-full">
                        {highlightedCourse.level}
                      </span>
                    </div>
                  </div>

                  {/* Thumbnail */}
                  <div className="hidden lg:block flex-shrink-0">
                    <img
                      src={highlightedCourse.thumbnailUrl}
                      alt={highlightedCourse.title}
                      className="w-48 h-36 object-cover rounded-2xl ring-1 ring-primary/20"
                    />
                  </div>
                </div>

                {/* Bottom section */}
                <div className="flex items-center justify-between pt-8 mt-auto border-t border-border/40">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center font-bold text-sm text-foreground">
                      {highlightedCourse.instructorName?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Instructor</p>
                      <p className="text-sm font-bold text-foreground">{highlightedCourse.instructorName}</p>
                    </div>
                  </div>
                  <Link href={`/courses/${highlightedCourse.id}`}>
                    <button className="group/btn flex items-center gap-2 px-5 py-2.5 bg-primary text-background font-bold text-sm rounded-full hover:bg-primary/90 hover:shadow-[0_0_30px_-8px] hover:shadow-primary/60 transition-all duration-300">
                      View Course
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                  </Link>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <p>No featured courses available.</p>
              </div>
            )}
          </div>

          {/* ── Right Stats Column ── */}
          <div className="flex flex-col gap-6">

            {/* Stat card: Rating */}
            <div className="flex-1 bg-primary rounded-3xl p-8 text-background flex flex-col justify-between min-h-[176px] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <CloudCheck className="w-8 h-8 relative z-10" />
              <div className="relative z-10">
                <div className="flex items-baseline gap-2">
                  <span className="font-headline text-5xl font-extrabold">
                    {isLoading ? "—" : highlightedCourse?.rating?.toFixed(1) ?? "4.9"}
                  </span>
                  <Star className="w-6 h-6 fill-current" />
                </div>
                <p className="text-background/70 text-xs font-bold uppercase tracking-widest mt-1">
                  Course Rating
                </p>
              </div>
            </div>

            {/* Stat card: Job Placement */}
            <div className="flex-1 bg-card border border-border/50 rounded-3xl p-8 flex flex-col justify-between min-h-[176px] relative overflow-hidden group hover:border-primary/30 transition-colors duration-300">
              <TrendingUp className="w-8 h-8 text-primary" />
              <div>
                <div className="font-headline text-5xl font-extrabold text-foreground">98%</div>
                <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mt-1">
                  Job Placement
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}