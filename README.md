<div align="center">
  <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80" alt="LexBlue Banner" width="100%" style="border-radius: 12px; margin-bottom: 20px; object-fit: cover; height: 300px;" />
  
  <h1>LexBlue | Modern Learning Management System</h1>
  <p>A premium, full-stack online learning platform built with Next.js 15, Firebase, and Stripe.</p>

  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#project-structure">Project Structure</a> •
    <a href="#presentation-guide">Presentation Guide</a>
  </p>
</div>

---

## 🌟 Overview

LexBlue is a state-of-the-art online learning platform designed to deliver premium educational experiences. It features a stunning, highly responsive user interface inspired by modern design systems, offering dynamic course catalogs, secure payment processing, and in-depth student progress analytics.

Whether for free tutorials or premium masterclasses, LexBlue provides instructors with the tools to manage their curriculum and gives students a frictionless, engaging learning environment.

---

## ✨ Key Features

### 🎓 For Students
*   **Dynamic Course Catalog**: Browse courses with real-time filtering by Category, Price (Free/Paid), and Difficulty level.
*   **Student Dashboard**: A personalized hub featuring visual learning analytics, progress tracking, and quick access to in-progress and completed courses.
*   **Immersive Lesson Viewer**: A distraction-free video player with integrated curriculum sidebar, auto-progress tracking, and next-lesson routing.
*   **Secure Enrollments**: Instant access to free courses and secure, 1-click checkout for paid courses via Stripe integration.

### ⚙️ For Administrators
*   **Admin Dashboard**: A high-level analytics view showing Total Courses, Total Students, Published Courses, and Drafts connected directly to the database.
*   **Content Management**: Tools to draft, structure (Modules & Lessons), and publish new courses.
*   **User Management**: Monitor user enrollments and roles across the platform.

---

## 🛠️ Tech Stack

*   **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server Components, Turbopack)
*   **Language**: TypeScript
*   **Styling**: Vanilla CSS with modern utilities (Flexbox, Grid, Glassmorphism, CSS variables) + Tailwind CSS concepts.
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Database & Auth**: [Firebase](https://firebase.google.com/) (Firestore & Firebase Authentication)
*   **Payments**: [Stripe](https://stripe.com/) (Checkout Sessions)

---

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js 18+ and npm installed.

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/lexblue.git
cd lexblue
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory and add your Firebase and Stripe keys:

```env
# Firebase Client Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

### 3. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) (or 3001 if port is in use) to view the application.

### 4. Seed the Database
To quickly populate your local database with high-quality demo courses:
1. Navigate to `/seed` in your browser.
2. Click **"Seed Demo Courses (Wipe & Reload Catalog)"**.

---

## 📂 Project Structure

```text
LexBlue/
├── src/
│   ├── app/                 # Next.js 15 App Router
│   │   ├── (public)/        # Public routes (Home, Catalog, Course Details, Seed)
│   │   ├── (protected)/     # Authenticated routes (My Learning, Dashboard, Lesson Viewer)
│   │   ├── (admin)/         # Admin dashboard and management tools
│   │   └── api/             # Next.js API Routes (Stripe Checkout)
│   ├── components/          # Reusable UI components (Cards, Navbar, Player)
│   ├── context/             # React Context (AuthContext)
│   ├── lib/                 # Utilities (Firebase init, Firestore helpers, Seed scripts)
│   └── types/               # TypeScript interfaces (Course, User, Enrollment)
├── doc/                     # Internal documentation and database schemas
├── public/                  # Static assets
└── package.json             # Project dependencies
```

---

## 🔒 Security & Architecture

*   **Route Protection**: Middleware and higher-order components (`AuthGuard`) ensure that learning materials and admin tools are strictly gated to authorized users.
*   **Firestore Rules**: Secure database rules prevent unauthorized reads/writes to user enrollment data and ensure course content integrity.
*   **Payment Flow**: Stripe sessions are generated server-side via API routes, ensuring secret keys are never exposed to the client.

---
<div align="center">
  <p>Built with ❤️ by the LexBlue Team.</p>
</div>
