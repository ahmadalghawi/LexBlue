import Image from "next/image";
import Link from "next/link";
import type { Course } from "@/types";

// This component receives one course object and displays it as a card.
type CourseCardProps = {
  course: Course;
};

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <article
      className="group overflow-hidden rounded-2xl  bg-card shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-primary 
    hover:shadow-md dark:border-primary dark:hover:border-primary"
    >
      {/* Course image */}
      <div className="relative h-44 w-full">
        <Image
          src={course.thumbnailUrl || "/course-js.jpg"}
          alt={course.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Course content */}
      <div className="p-5">
        {/* Category and level */}
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {course.category}
          </span>

          <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
            {course.level}
          </span>
        </div>

        {/* Course title */}
        <h3 className="text-lg font-bold text-foreground">{course.title}</h3>

        {/* Course short description */}
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {course.description}
        </p>

        {/* Instructor name */}
        <p className="mt-4 text-sm text-muted-foreground">
          Instructor:{" "}
          <span className="font-semibold text-foreground">
            {course.instructorName}
          </span>
        </p>

        {/* Rating and students */}
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>⭐ {course.rating ?? 0}</span>
          <span>{course.totalStudents ?? 0} students</span>
        </div>

        {/* Price and details button */}
        <div className="mt-5 flex items-center justify-between">
          <span className="text-lg font-bold text-primary">
            {course.isFree ? "Free" : `$${course.price}`}
          </span>

          <Link
            href={`/courses/${course.id}`}
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold 
            text-primary-foreground transition-all duration-300 hover:bg-secondary
             hover:text-secondary-foreground hover:shadow-lg hover:shadow-primary/30"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
