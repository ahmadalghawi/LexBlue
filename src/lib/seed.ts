import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const seedDemoCourses = async () => {
  const demoCourses = [
    {
      title: "JavaScript for Beginners",
      description: "Learn JS from scratch with practical projects.",
      longDescription: "A complete guide to modern JavaScript covering variables, data types, functions, and the DOM. By the end of this course, you will be able to build interactive web applications.",
      category: "JavaScript",
      level: "Beginner",
      thumbnailUrl: "https://images.unsplash.com/photo-1627398240309-08a9a2165a27?w=800&q=80",
      instructorName: "Ahmad Alghawi",
      price: 0,
      isFree: true,
      isPublished: true,
      rating: 4.8,
      totalStudents: 125,
      tags: ["javascript", "web", "beginner"],
      modules: [
        {
          id: crypto.randomUUID(),
          title: "Module 1: Getting Started",
          order: 0,
          lessons: [
            {
              id: crypto.randomUUID(),
              title: "What is JavaScript?",
              order: 0,
              videoUrl: "https://www.youtube.com/embed/W6NZfCO5SIk",
              duration: 600,
              isFree: true,
              description: "Introduction to the JavaScript language."
            },
            {
              id: crypto.randomUUID(),
              title: "Variables and Data Types",
              order: 1,
              videoUrl: "https://www.youtube.com/embed/edlFjlzxkSI",
              duration: 780,
              isFree: false,
              description: "Learn about let, const, and basic data types."
            }
          ]
        },
        {
          id: crypto.randomUUID(),
          title: "Module 2: DOM Manipulation",
          order: 1,
          lessons: [
            {
              id: crypto.randomUUID(),
              title: "Selecting Elements",
              order: 0,
              videoUrl: "https://www.youtube.com/embed/0X6ZqY4m7qM",
              duration: 540,
              isFree: false,
              description: "How to find elements in the DOM."
            },
            {
              id: crypto.randomUUID(),
              title: "Event Listeners",
              order: 1,
              videoUrl: "https://www.youtube.com/embed/G_mY1xGZg-c",
              duration: 920,
              isFree: false,
              description: "Making your web pages interactive."
            }
          ]
        }
      ]
    },
    {
      title: "React Masterclass",
      description: "Build scalable frontend applications with React 19.",
      longDescription: "Dive deep into React hooks, context API, state management, and Server Components. Ideal for developers who already know JavaScript.",
      category: "React",
      level: "Intermediate",
      thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
      instructorName: "Ahmad Alghawi",
      price: 49.99,
      isFree: false,
      isPublished: true,
      rating: 4.9,
      totalStudents: 85,
      tags: ["react", "frontend", "hooks", "nextjs"],
      modules: [
        {
          id: crypto.randomUUID(),
          title: "Module 1: React Fundamentals",
          order: 0,
          lessons: [
            {
              id: crypto.randomUUID(),
              title: "Thinking in React",
              order: 0,
              videoUrl: "https://www.youtube.com/embed/dpw9EHDh2bM",
              duration: 900,
              isFree: true,
              description: "How to approach building UIs with components."
            }
          ]
        },
        {
          id: crypto.randomUUID(),
          title: "Module 2: Advanced Hooks",
          order: 1,
          lessons: [
            {
              id: crypto.randomUUID(),
              title: "useMemo and useCallback",
              order: 0,
              videoUrl: "https://www.youtube.com/embed/NWjZ5M6FfW8",
              duration: 1100,
              isFree: false,
              description: "Optimizing component performance."
            },
            {
              id: crypto.randomUUID(),
              title: "Custom Hooks",
              order: 1,
              videoUrl: "https://www.youtube.com/embed/6ThXaZrtPR4",
              duration: 950,
              isFree: false,
              description: "Extracting reusable logic from components."
            }
          ]
        }
      ]
    },
    {
      title: "Fullstack Next.js with App Router",
      description: "The ultimate guide to Next.js 15 and Server Components.",
      longDescription: "Master the App Router, Server Actions, and database integration with Prisma and Supabase. Build a real-world production app from scratch.",
      category: "Next.js",
      level: "Advanced",
      thumbnailUrl: "https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?w=800&q=80",
      instructorName: "Ahmad Alghawi",
      price: 79.99,
      isFree: false,
      isPublished: true,
      rating: 5.0,
      totalStudents: 42,
      tags: ["nextjs", "fullstack", "typescript", "prisma"],
      modules: [
        {
          id: crypto.randomUUID(),
          title: "Module 1: App Router Basics",
          order: 0,
          lessons: [
            {
              id: crypto.randomUUID(),
              title: "Routing and Layouts",
              order: 0,
              videoUrl: "https://www.youtube.com/embed/ZjAqacIC_3c",
              duration: 1200,
              isFree: true,
              description: "Understanding the new file-based routing system."
            }
          ]
        },
        {
          id: crypto.randomUUID(),
          title: "Module 2: Data Fetching",
          order: 1,
          lessons: [
            {
              id: crypto.randomUUID(),
              title: "Server vs Client Components",
              order: 0,
              videoUrl: "https://www.youtube.com/embed/843nec-IvW0",
              duration: 1050,
              isFree: false,
              description: "When to use use client and when to stay on the server."
            }
          ]
        }
      ]
    },
    {
      title: "Python for Data Science",
      description: "Master Python for data analysis and visualization.",
      longDescription: "Learn Python from the ground up and master libraries like NumPy, Pandas, and Matplotlib to analyze and visualize complex datasets.",
      category: "Python",
      level: "Beginner",
      thumbnailUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80",
      instructorName: "Ahmad Alghawi",
      price: 0,
      isFree: true,
      isPublished: true,
      rating: 4.7,
      totalStudents: 210,
      tags: ["python", "data science", "pandas"],
      modules: [
        {
          id: crypto.randomUUID(),
          title: "Module 1: Python Basics",
          order: 0,
          lessons: [
            {
              id: crypto.randomUUID(),
              title: "Installation and Setup",
              order: 0,
              videoUrl: "https://www.youtube.com/embed/YYXdXT2l-Gg",
              duration: 450,
              isFree: true,
              description: "Setting up your Python environment."
            }
          ]
        }
      ]
    }
  ];

  const results = [];
  for (const course of demoCourses) {
    try {
      const docRef = await addDoc(collection(db, "courses"), {
        ...course,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      results.push(docRef.id);
    } catch (e) {
      console.error("Failed to add seed course:", e);
    }
  }
  return results;
};
