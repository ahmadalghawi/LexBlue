# Project: LexBlue : E-Learning Platform (MVP)
# Role: Senior Full Stack & AI Engineer

## 1. Project Overview
Build a fast, scalable, SEO-friendly e-learning platform for students to discover and consume IT/programming courses. The system uses a headless architecture with Firebase handling all backend logic and database operations from the client and server.

## 2. Tech Stack & Guidelines
* **Framework:** Next.js 16 (App Router) + React 19
* **Language:** Strict TypeScript (Define interfaces for all data models and component props).
* **Styling:** Tailwind CSS + Radix UI / shadcn/ui.
* **Backend/Auth:** Firebase (Auth, Firestore).
* **Video:** Embedded YouTube/Vimeo links (no raw video hosting).
* **Coding Standards:** Use functional components, custom hooks, and Server Components where SEO is needed. Avoid unnecessary client-side rendering. Keep components modular.

## 3. Core Routing Architecture (Next.js App Router)
Map the following structure using Next.js file-system routing:

* `(public) /` - Landing page (Marketing, Hero, Featured Courses).
* `(public) /courses` - Course catalog with filtering capabilities.
* `(public) /courses/[courseId]` - Course detail page (Syllabus, pricing, SEO-optimized).
* `(auth) /login` & `/register` - Firebase Auth flows.
* `(protected) /dashboard` - Student dashboard (Active courses, progress tracking, profile settings).
* `(protected) /learn/[courseId]/[lessonId]` - The main video player UI, chapter navigation, and lesson notes.
* `(admin) /admin` - Hidden route protected by custom claims or role-based DB checks for course management.

## 4. Firestore Database Schema (Draft)

**Collection: `users`**
* `uid` (String, PK)
* `email` (String)
* `displayName` (String)
* `role` (String: "student" | "admin")
* `createdAt` (Timestamp)

**Collection: `courses`**
* `id` (String, PK)
* `title` (String)
* `description` (String)
* `category` (String)
* `thumbnailUrl` (String)
* `isPublished` (Boolean)
* `modules` (Array of Objects): `{ id, title, lessons: [{ id, title, videoUrl, duration }] }`

**Collection: `enrollments`**
* `id` (String, PK)
* `userId` (String, FK -> users)
* `courseId` (String, FK -> courses)
* `progress` (Number: 0-100)
* `completedLessons` (Array of Strings: lessonIds)

## 5. Implementation Phases for AI Agent

**Phase 1: Initialization & Global Setup**
* Initialize Next.js project with Tailwind and TypeScript.
* Set up Firebase Client SDK (`firebase/app`, `firebase/auth`, `firebase/firestore`).
* Implement standard shadcn/ui components (Button, Input, Card, Dialog).

**Phase 2: Authentication Flow**
* Create `useAuth` hook listening to Firebase `onAuthStateChanged`.
* Build `/login` and `/register` pages.
* Create a `<ProtectedRoute>` wrapper layout for the dashboard and learning interface.

**Phase 3: Public Views (Server Components)**
* Build the `/(public)/courses` directory.
* Fetch mock course data (later wired to Firestore) using Next.js Server Components for SEO optimization.
* Build the Course Detail page layout.

**Phase 4: Protected Learning UI**
* Build the `/dashboard` UI displaying enrolled courses.
* Build the complex `/learn/[courseId]` UI: Side navigation for modules/lessons, main area for video embed (`react-player`), and a button to mark lessons as complete (writing to Firestore `enrollments` collection).