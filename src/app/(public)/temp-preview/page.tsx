"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Course, Lesson } from "@/types";
import Link from "next/link";

export default function TempStudentPreview() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const q = query(
          collection(db, "courses"),
          where("isPublished", "==", true),
          orderBy("createdAt", "desc")
        );
        const snap = await getDocs(q);
        const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Course));
        setCourses(data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    // Auto-select first lesson of first module if available
    if (course.modules?.[0]?.lessons?.[0]) {
      setActiveLesson(course.modules[0].lessons[0]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Course Content / Player View
  if (selectedCourse) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-md flex items-center px-6 sticky top-0 z-50 justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSelectedCourse(null)}
              className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="font-headline font-bold text-lg truncate max-w-[300px]">
              {selectedCourse.title}
            </h1>
          </div>
          <div className="hidden md:block">
            <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
              Student Preview Mode
            </span>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
          {/* Main Content: Video Player */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-secondary/20">
            <div className="max-w-5xl mx-auto space-y-6">
              {activeLesson ? (
                <div className="space-y-6">
                  {/* Aspect Ratio Container for Video */}
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl ring-1 ring-white/10">
                    <iframe
                      src={activeLesson.videoUrl}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <h2 className="text-2xl font-headline font-bold">{activeLesson.title}</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {activeLesson.description || "In this lesson, we'll dive deep into the core concepts and practical applications."}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-[50vh] flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-3xl">📺</div>
                  <h3 className="text-xl font-bold">Select a lesson to start learning</h3>
                  <p className="text-muted-foreground">Pick a lesson from the sidebar to begin your journey.</p>
                </div>
              )}

              {/* Course Info Below Video */}
              <div className="border-t border-border pt-8 mt-8 grid md:grid-cols-3 gap-8 text-sm">
                <div className="space-y-1">
                  <p className="text-muted-foreground font-medium uppercase tracking-tight text-[10px]">Instructor</p>
                  <p className="font-bold">{selectedCourse.instructorName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground font-medium uppercase tracking-tight text-[10px]">Level</p>
                  <p className="font-bold">{selectedCourse.level}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground font-medium uppercase tracking-tight text-[10px]">Category</p>
                  <p className="font-bold">{selectedCourse.category}</p>
                </div>
              </div>
            </div>
          </main>

          {/* Sidebar: Curriculum */}
          <aside className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-border bg-card flex flex-col h-[50vh] lg:h-auto">
            <div className="p-6 border-b border-border">
              <h3 className="font-headline font-bold text-lg">Course Content</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {selectedCourse.modules.reduce((acc, m) => acc + m.lessons.length, 0)} total lessons
              </p>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {selectedCourse.modules.map((module, mIdx) => (
                <div key={module.id} className="border-b border-border/50">
                  <div className="bg-secondary/30 px-6 py-3 flex items-center justify-between">
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground">
                      Module {mIdx + 1}: {module.title}
                    </span>
                  </div>
                  <div className="divide-y divide-border/30">
                    {module.lessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        onClick={() => setActiveLesson(lesson)}
                        className={`w-full px-6 py-4 flex items-start gap-4 transition-all hover:bg-primary/5 text-left ${
                          activeLesson?.id === lesson.id ? "bg-primary/10 border-l-4 border-primary" : "border-l-4 border-transparent"
                        }`}
                      >
                        <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          activeLesson?.id === lesson.id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                        }`}>
                          {lesson.order + 1}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-semibold leading-snug ${activeLesson?.id === lesson.id ? "text-primary" : "text-foreground"}`}>
                            {lesson.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {Math.floor(lesson.duration / 60)}m {lesson.duration % 60}s
                            </span>
                            {lesson.isFree && (
                              <span className="text-[9px] font-bold bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded uppercase tracking-tighter">Free</span>
                            )}
                          </div>
                        </div>
                        {activeLesson?.id === lesson.id && (
                          <div className="text-primary">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    );
  }

  // Course Grid View
  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Hero Header */}
      <section className="relative pt-20 pb-16 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-primary/10 to-transparent -z-10 blur-3xl opacity-50" />
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <span className="text-primary font-bold tracking-widest uppercase text-xs">Student Interface Preview</span>
          <h1 className="text-4xl md:text-6xl font-headline font-extrabold tracking-tight">
            Review Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Premium Courses</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            This is a temporary page to preview how students will see and interact with the courses you've created.
          </p>
        </div>
      </section>

      {/* Course Cards Grid */}
      <section className="max-w-6xl mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-card/50 rounded-3xl border border-dashed border-border">
            <p className="text-muted-foreground italic">No published courses found. Go to Admin &gt; Seed Demo Data to populate this list.</p>
          </div>
        ) : (
          courses.map((course) => (
            <div 
              key={course.id}
              className="group relative bg-card border border-border rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 flex flex-col cursor-pointer"
              onClick={() => handleSelectCourse(course)}
            >
              {/* Thumbnail */}
              <div className="relative aspect-[16/9] overflow-hidden">
                <img 
                  src={course.thumbnailUrl} 
                  alt={course.title}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-4 left-4">
                  <span className={`text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-md shadow-lg ${
                    course.level === "Beginner" ? "bg-emerald-500/80 text-white" : 
                    course.level === "Intermediate" ? "bg-amber-500/80 text-white" : "bg-rose-500/80 text-white"
                  }`}>
                    {course.level}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4 flex-1 flex flex-col text-left">
                <div className="space-y-2 flex-1">
                  <h3 className="text-xl font-headline font-bold leading-tight group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {course.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground uppercase">
                      {course.instructorName.charAt(0)}
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">By {course.instructorName}</span>
                  </div>
                  <span className="font-headline font-bold text-primary">
                    {course.price === 0 ? "FREE" : `$${course.price}`}
                  </span>
                </div>

                <button className="w-full bg-primary text-primary-foreground font-headline font-bold py-3 rounded-2xl text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors">
                  View & Learn
                </button>
              </div>
            </div>
          ))
        )}
      </section>

      {/* Footer Nav Hint */}
      <div className="mt-20 text-center">
        <Link href="/admin/courses" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
          Back to Admin Dashboard
        </Link>
      </div>
    </div>
  );
}
