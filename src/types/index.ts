export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: "student" | "admin";
  createdAt: any; // Firebase Timestamp
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnailUrl: string;
  isPublished: boolean;
  modules: Module[];
  instructorName?: string;
  price?: number;
  isFree?: boolean;
  level?: string;
  rating?: number;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  videoUrl: string;
  duration: number; // in seconds
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  progress: number; // 0-100
  completedLessons: string[]; // array of lessonIds
  lastLessonId?: string;
  enrolledAt: any; // Firebase Timestamp
}
