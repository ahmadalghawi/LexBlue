"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";

interface CourseCardProps {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  category?: string;
  instructorName?: string;
  level?: "Beginner" | "Intermediate" | "Advanced";
  rating?: number;
  progress?: number;
  isFree?: boolean;
  price?: number;
  className?: string;
}

const levelColors = {
  Beginner: "bg-emerald-500/10 text-emerald-500",
  Intermediate: "bg-sky-500/10 text-sky-500",
  Advanced: "bg-violet-500/10 text-violet-500",
};

export function CourseCard({
  id,
  title,
  description,
  thumbnailUrl,
  category,
  instructorName,
  level,
  rating,
  progress,
  isFree,
  price,
  className,
}: CourseCardProps) {
  return (
    <Link
      href={`/courses/${id}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl bg-card border border-border",
        "transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
        className
      )}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-secondary/50">
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <svg
              className="w-12 h-12 text-muted-foreground/30"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m0 0v3.675a55.378 55.378 0 01-5.325 2.037"
              />
            </svg>
          </div>
        )}

        {/* Category Badge */}
        {category && (
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="backdrop-blur-md">
              {category}
            </Badge>
          </div>
        )}

        {/* Free Badge */}
        {isFree && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-emerald-500 hover:bg-emerald-600">Free</Badge>
          </div>
        )}

        {/* Progress Overlay */}
        {progress !== undefined && progress > 0 && (
          <div className="absolute inset-x-0 bottom-0 h-1.5 bg-background/60">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Title */}
        <h3 className="font-headline text-lg font-bold text-foreground tracking-tight mb-2 line-clamp-2">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {description}
          </p>
        )}

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-2 mt-auto">
          {level && (
            <span
              className={cn(
                "text-xs font-medium px-2 py-0.5 rounded-full",
                levelColors[level] || levelColors.Beginner
              )}
            >
              {level}
            </span>
          )}

          {instructorName && (
            <span className="text-xs text-muted-foreground">
              {instructorName}
            </span>
          )}

          {rating !== undefined && (
            <div className="flex items-center gap-1 ml-auto">
              <svg
                className="w-4 h-4 text-yellow-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-xs font-medium text-foreground">{rating}</span>
            </div>
          )}
        </div>

        {/* Price */}
        {!isFree && price !== undefined && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
            <span className="text-lg font-bold text-primary">
              ${price.toFixed(2)}
            </span>
          </div>
        )}

        {/* Progress Indicator */}
        {progress !== undefined && progress > 0 && (
          <div className="mt-3 pt-3 border-t border-border">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-primary">{progress}%</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
