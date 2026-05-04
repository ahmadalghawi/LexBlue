import { Timestamp } from "firebase/firestore";

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  role: "student" | "admin";
  createdAt: Timestamp;
}

export interface Lesson {
  id: string;
  title: string;
  order: number;
  videoUrl: string;      // YouTube embed URL: https://www.youtube.com/embed/{VIDEO_ID}
  duration: number;      // seconds
  isFree?: boolean;
  description?: string;
}

export interface Module {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  thumbnailUrl: string;
  instructorName: string;
  instructorId?: string;
  price: number;
  isFree: boolean;
  isPublished: boolean;
  rating?: number;
  totalStudents?: number;
  totalDuration?: number;
  tags?: string[];
  modules: Module[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  progress: number;           // 0–100
  completedLessons: string[]; // lessonIds
  lastLessonId?: string | null;
  lastModuleId?: string | null;
  enrolledAt: Timestamp;
  completedAt?: Timestamp | null;
}
