"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";

import CourseCard from "@/components/courses/CourseCard";
import { db } from "@/lib/firestore";
import type { Course } from "@/types";

const categories = ["React", "Python", "JavaScript"];
const levels = ["Beginner", "Intermediate", "Advanced"];

// This component handles:
// 1. Fetching courses from Firestore
// 2. Showing filters
// 3. Filtering courses
// 4. Displaying course cards
export default function CourseCatalog() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");

  useEffect(() => {
    async function fetchCourses() {
      try {
        const coursesRef = collection(db, "courses");

        const coursesQuery = query(
          coursesRef,
          where("isPublished", "==", true),
        );

        const snapshot = await getDocs(coursesQuery);

        const coursesData = snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          } as Course;
        });

        setCourses(coursesData);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, []);

  // This creates a filtered list based on selected filters.
  const filteredCourses = courses.filter((course) => {
    const matchesCategory =
      selectedCategory === "" || course.category === selectedCategory;

    const matchesLevel = selectedLevel === "" || course.level === selectedLevel;

    return matchesCategory && matchesLevel;
  });

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
      {/* Filters sidebar */}
      <aside>
        <h2 className="mb-6 text-2xl font-bold text-foreground">
          Course Filters
        </h2>

        {/* Category filter */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-muted-foreground">
            Category
          </h3>

          <div className="space-y-4">
            {categories.map((category) => {
              const isSelected = selectedCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    setSelectedCategory(isSelected ? "" : category)
                  }
                  className="flex items-center gap-3"
                >
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-lg border-2 ${
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background"
                    }`}
                  >
                    {isSelected ? "✓" : ""}
                  </span>

                  <span
                    className={`font-medium ${
                      isSelected ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {category}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Difficulty filter */}
        <div className="mt-5 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-muted-foreground">
            Difficulty
          </h3>

          <div className="space-y-4">
            {levels.map((level) => {
              const isSelected = selectedLevel === level;

              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => setSelectedLevel(isSelected ? "" : level)}
                  className="flex items-center gap-3"
                >
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-lg border-2 ${
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background"
                    }`}
                  >
                    {isSelected ? "✓" : ""}
                  </span>

                  <span
                    className={`font-medium ${
                      isSelected ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {level}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Clear filters button */}
        {(selectedCategory || selectedLevel) && (
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("");
              setSelectedLevel("");
            }}
            className="mt-5 w-full rounded-full border border-border bg-card px-5 py-2 text-sm font-semibold text-foreground hover:bg-muted"
          >
            Clear Filters
          </button>
        )}
      </aside>

      {/* Courses section */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            Available Courses
          </h2>

          <p className="mt-1 text-muted-foreground">
            Showing {filteredCourses.length} courses
          </p>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <p className="text-muted-foreground">Loading courses...</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
            <h2 className="text-xl font-bold text-foreground">
              No courses found
            </h2>

            <p className="mt-2 text-muted-foreground">
              Try changing the selected filters.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
