import { collection, addDoc, setDoc, doc, getDocs, query, where, serverTimestamp, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firestore";

// ============================================================
// TEST COURSE WITH FIXED IDs
// ============================================================
export const TEST_COURSE_ID = "test-course-cloud";

export const testCourseData = {
  title: "Advanced Cloud Architecture",
  description: "Master cloud deployment with Docker, Kubernetes, and CI/CD.",
  longDescription: "In this course, you'll learn to deploy production-grade applications to the cloud using modern DevOps practices.",
  category: "DevOps",
  level: "Advanced" as const,
  thumbnailUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
  instructorName: "Cloud Expert",
  price: 0,
  isFree: true,
  isPublished: true,
  rating: 4.9,
  totalStudents: 50,
  tags: ["cloud", "docker", "kubernetes"],
  modules: [
    {
      id: "mod-1",
      title: "Module 1: Environment Setup",
      order: 0,
      lessons: [
        {
          id: "les-1",
          title: "Environment Setup",
          order: 0,
          videoUrl: "https://www.youtube.com/embed/3c-iBn73dDE",
          duration: 560,
          isFree: true,
          description: "Setting up your development environment."
        },
        {
          id: "les-2",
          title: "Deploying to the Cloud",
          order: 1,
          videoUrl: "https://www.youtube.com/embed/PGyhBwLyK2U",
          duration: 2060,
          isFree: false,
          description: "Transition from local to production-grade cloud environments."
        }
      ]
    }
  ]
};

// Clear existing courses
export const clearCourses = async () => {
  const querySnapshot = await getDocs(collection(db, "courses"));
  const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
  console.log("Cleared all courses from Firestore.");
};

// Create test course
export const seedTestCourse = async (): Promise<string> => {
  await setDoc(doc(db, "courses", TEST_COURSE_ID), {
    ...testCourseData,
    id: TEST_COURSE_ID,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return TEST_COURSE_ID;
};

// Create enrollment for a user
export const seedTestEnrollment = async (userId: string): Promise<string> => {
  const existing = await getDocs(
    query(
      collection(db, "enrollments"),
      where("userId", "==", userId),
      where("courseId", "==", TEST_COURSE_ID)
    )
  );

  if (!existing.empty) {
    return existing.docs[0].id;
  }

  const docRef = await addDoc(collection(db, "enrollments"), {
    userId,
    courseId: TEST_COURSE_ID,
    progress: 20,
    completedLessons: ["les-1"],
    lastLessonId: "les-2",
    lastModuleId: "mod-1",
    enrolledAt: serverTimestamp(),
    completedAt: null,
  });

  return docRef.id;
};

export const seedMyLearningData = async (userId: string) => {
  const courseId = await seedTestCourse();
  const enrollmentId = await seedTestEnrollment(userId);
  return { courseId, enrollmentId };
};

export const seedDemoCourses = async () => {
  await clearCourses();

  const demoCourses = [
    {
      title: "JavaScript for Beginners",
      description: "Learn JS from scratch with practical projects.",
      longDescription: "A complete guide to modern JavaScript covering variables, data types, functions, and the DOM.",
      category: "JavaScript",
      level: "Beginner",
      thumbnailUrl: "https://images.unsplash.com/photo-1627398240309-08a9a2165a27?w=800&q=80",
      instructorName: "Ahmad Alghawi",
      price: 0,
      isFree: true,
      isPublished: true,
      rating: 4.8,
      totalStudents: 125,
      tags: ["javascript", "web"],
      modules: [
        {
          id: crypto.randomUUID(), title: "Module 1: Basics", order: 0,
          lessons: [{ id: crypto.randomUUID(), title: "Intro", order: 0, videoUrl: "https://www.youtube.com/embed/W6NZfCO5SIk", duration: 600, isFree: true, description: "Intro to JS." }]
        }
      ]
    },
    {
      title: "React Masterclass",
      description: "Build scalable frontend applications with React 19.",
      longDescription: "Dive deep into React hooks, context API, and Server Components.",
      category: "React",
      level: "Intermediate",
      thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
      instructorName: "Ahmad Alghawi",
      price: 49.99,
      isFree: false,
      isPublished: true,
      rating: 4.9,
      totalStudents: 85,
      tags: ["react", "frontend"],
      modules: [
        {
          id: crypto.randomUUID(), title: "Module 1: Fundamentals", order: 0,
          lessons: [{ id: crypto.randomUUID(), title: "Thinking in React", order: 0, videoUrl: "https://www.youtube.com/embed/dpw9EHDh2bM", duration: 900, isFree: true, description: "Mental models." }]
        }
      ]
    },
    {
      title: "Fullstack Next.js with App Router",
      description: "The ultimate guide to Next.js 15.",
      longDescription: "Master the App Router, Server Actions, and database integration.",
      category: "Next.js",
      level: "Advanced",
      thumbnailUrl: "https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?w=800&q=80",
      instructorName: "Ahmad Alghawi",
      price: 79.99,
      isFree: false,
      isPublished: true,
      rating: 5.0,
      totalStudents: 42,
      tags: ["nextjs", "fullstack"],
      modules: [
        {
          id: crypto.randomUUID(), title: "Module 1: Routing", order: 0,
          lessons: [{ id: crypto.randomUUID(), title: "App Router Basics", order: 0, videoUrl: "https://www.youtube.com/embed/ZjAqacIC_3c", duration: 1200, isFree: true, description: "Next.js routing." }]
        }
      ]
    },
    {
      title: "Cybersecurity Fundamentals",
      description: "Protect systems and networks from digital attacks.",
      longDescription: "Learn core concepts of cybersecurity, network security, and cryptography.",
      category: "Security",
      level: "Beginner",
      thumbnailUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
      instructorName: "SecOps Academy",
      price: 59.99,
      isFree: false,
      isPublished: true,
      rating: 4.8,
      totalStudents: 156,
      tags: ["security", "cyber"],
      modules: [
        {
          id: crypto.randomUUID(), title: "Module 1: Landscape", order: 0,
          lessons: [{ id: crypto.randomUUID(), title: "The Security Landscape", order: 0, videoUrl: "https://www.youtube.com/embed/z5nc9MDbvkw", duration: 900, isFree: true, description: "Threats overview." }]
        },
        {
          id: crypto.randomUUID(), title: "Module 2: Network", order: 1,
          lessons: [{ id: crypto.randomUUID(), title: "Firewalls & VPNs", order: 0, videoUrl: "https://www.youtube.com/embed/gzSnhWvll9k", duration: 1200, isFree: false, description: "Edge security." }]
        }
      ]
    },
    {
      title: "AWS Cloud Architect",
      description: "Design resilient cloud architectures.",
      longDescription: "Complete preparation for the SAA-C03 exam.",
      category: "Cloud",
      level: "Advanced",
      thumbnailUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
      instructorName: "Cloud Academy",
      price: 129.99,
      isFree: false,
      isPublished: true,
      rating: 5.0,
      totalStudents: 34,
      tags: ["aws", "cloud"],
      modules: [
        {
          id: crypto.randomUUID(), title: "Module 1: Compute", order: 0,
          lessons: [{ id: crypto.randomUUID(), title: "EC2 Basics", order: 0, videoUrl: "https://www.youtube.com/embed/3c-iBn73dDE", duration: 1200, isFree: true, description: "AWS servers." }]
        },
        {
          id: crypto.randomUUID(), title: "Module 2: Storage", order: 1,
          lessons: [{ id: crypto.randomUUID(), title: "S3 Mastery", order: 0, videoUrl: "https://www.youtube.com/embed/77lMCiiMIFk", duration: 950, isFree: false, description: "Object storage." }]
        }
      ]
    },
    {
      title: "UI/UX Design Essentials",
      description: "Design beautiful interfaces with Figma.",
      longDescription: "Learn principles of design, color theory, and prototyping.",
      category: "Design",
      level: "Beginner",
      thumbnailUrl: "https://images.unsplash.com/photo-1586717791821-3f44a563dc4c?w=800&q=80",
      instructorName: "Sarah Chen",
      price: 29.99,
      isFree: false,
      isPublished: true,
      rating: 4.6,
      totalStudents: 340,
      tags: ["design", "figma"],
      modules: [
        {
          id: crypto.randomUUID(), title: "Module 1: Principles", order: 0,
          lessons: [{ id: crypto.randomUUID(), title: "Intro to UI/UX", order: 0, videoUrl: "https://www.youtube.com/embed/zHAa-m16NGk", duration: 800, isFree: true, description: "Design fundamentals." }]
        }
      ]
    },
    {
      title: "Python for Data Science",
      description: "Analyze and visualize data with Python.",
      longDescription: "Master NumPy, Pandas, and Matplotlib.",
      category: "Python",
      level: "Beginner",
      thumbnailUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80",
      instructorName: "Ahmad Alghawi",
      price: 0,
      isFree: true,
      isPublished: true,
      rating: 4.7,
      totalStudents: 210,
      tags: ["python", "data science"],
      modules: [
        {
          id: crypto.randomUUID(), title: "Module 1: Intro", order: 0,
          lessons: [{ id: crypto.randomUUID(), title: "Setup", order: 0, videoUrl: "https://www.youtube.com/embed/YYXdXT2l-Gg", duration: 450, isFree: true, description: "Environment setup." }]
        }
      ]
    },
    {
      title: "Flutter Mobile Development",
      description: "Build native apps with a single codebase.",
      longDescription: "Learn Dart and Flutter for iOS and Android development.",
      category: "Mobile",
      level: "Intermediate",
      thumbnailUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
      instructorName: "Dart Guru",
      price: 39.99,
      isFree: false,
      isPublished: true,
      rating: 4.7,
      totalStudents: 412,
      tags: ["flutter", "dart"],
      modules: [
        {
          id: crypto.randomUUID(), title: "Module 1: Dart", order: 0,
          lessons: [{ id: crypto.randomUUID(), title: "Syntax Basics", order: 0, videoUrl: "https://www.youtube.com/embed/5flXf8nuq60", duration: 1000, isFree: true, description: "Language intro." }]
        }
      ]
    },
    {
      title: "Node.js Backend Mastery",
      description: "Build scalable backends with Node.js and Express.",
      longDescription: "Learn REST APIs, Authentication, and Database modeling with MongoDB.",
      category: "Backend",
      level: "Intermediate",
      thumbnailUrl: "https://images.unsplash.com/photo-1533709752231-3bc35fbc4a78?w=800&q=80",
      instructorName: "Server Side Pro",
      price: 45.00,
      isFree: false,
      isPublished: true,
      rating: 4.9,
      totalStudents: 220,
      tags: ["nodejs", "express", "mongodb"],
      modules: [
        {
          id: crypto.randomUUID(), title: "Module 1: Express Basics", order: 0,
          lessons: [{ id: crypto.randomUUID(), title: "Setting up Server", order: 0, videoUrl: "https://www.youtube.com/embed/Oe421EPjeBE", duration: 900, isFree: true, description: "Starting with Express." }]
        },
        {
          id: crypto.randomUUID(), title: "Module 2: Auth", order: 1,
          lessons: [{ id: crypto.randomUUID(), title: "JWT Auth", order: 0, videoUrl: "https://www.youtube.com/embed/7nafaH9SddU", duration: 1500, isFree: false, description: "Securing routes." }]
        }
      ]
    },
    {
      title: "AI & Machine Learning Foundations",
      description: "Understand the future with AI and ML.",
      longDescription: "Deep dive into Transformers and Generative models.",
      category: "AI",
      level: "Advanced",
      thumbnailUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
      instructorName: "AI Research Lab",
      price: 99.99,
      isFree: false,
      isPublished: true,
      rating: 4.9,
      totalStudents: 56,
      tags: ["ai", "ml"],
      modules: [
        {
          id: crypto.randomUUID(), title: "Module 1: Deep Learning", order: 0,
          lessons: [{ id: crypto.randomUUID(), title: "Neural Networks", order: 0, videoUrl: "https://www.youtube.com/embed/aircAruvnKk", duration: 1500, isFree: true, description: "Logic of AI." }]
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
