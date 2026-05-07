"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firestore";
import Link from "next/link";
import { BookOpen, Users, CheckCircle, FileEdit, ArrowRight } from "lucide-react";

export default function AdminPage() {
  const { dbUser } = useAuth();
  
  const [totalCourses, setTotalCourses] = useState(0);
  const [publishedCourses, setPublishedCourses] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [draftCourses, setDraftCourses] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch total courses
        const coursesSnap = await getDocs(collection(db, "courses"));
        setTotalCourses(coursesSnap.size);

        // Fetch published courses
        const publishedQuery = query(collection(db, "courses"), where("isPublished", "==", true));
        const publishedSnap = await getDocs(publishedQuery);
        setPublishedCourses(publishedSnap.size);
        
        // Drafts is total - published
        setDraftCourses(coursesSnap.size - publishedSnap.size);

        // Fetch total users (students)
        const usersSnap = await getDocs(collection(db, "users"));
        setTotalStudents(usersSnap.size);

      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const stats = [
    { label: "Total Courses", value: loading ? "-" : totalCourses, icon: <BookOpen className="w-6 h-6 text-primary" />, color: "bg-primary/10 border-primary/20" },
    { label: "Total Students", value: loading ? "-" : totalStudents, icon: <Users className="w-6 h-6 text-blue-500" />, color: "bg-blue-500/10 border-blue-500/20" },
    { label: "Published", value: loading ? "-" : publishedCourses, icon: <CheckCircle className="w-6 h-6 text-emerald-500" />, color: "bg-emerald-500/10 border-emerald-500/20" },
    { label: "Drafts", value: loading ? "-" : draftCourses, icon: <FileEdit className="w-6 h-6 text-amber-500" />, color: "bg-amber-500/10 border-amber-500/20" },
  ];

  return (
    <div className="max-w-6xl mx-auto py-8">
      {/* Header */}
      <div className="mb-10 bg-gradient-to-r from-primary/10 to-transparent p-8 rounded-3xl border border-primary/10">
        <h1 className="font-headline text-4xl font-extrabold text-foreground tracking-tight mb-2">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground text-lg">
          Welcome back, <span className="text-foreground font-semibold">{dbUser?.displayName ?? dbUser?.email}</span>
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-3xl p-6 border shadow-sm transition-all hover:shadow-md ${stat.color} bg-card/50 backdrop-blur-sm relative overflow-hidden`}
          >
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-background/40 rounded-full blur-2xl -z-10" />
            
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-background rounded-2xl shadow-sm border border-border/50">
                {stat.icon}
              </div>
            </div>
            
            <p className="text-4xl font-headline font-extrabold text-foreground mb-2">
              {stat.value}
            </p>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
        <h2 className="font-headline text-2xl font-extrabold text-foreground mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Create New Course", href: "/admin/courses/new", desc: "Build a new course from scratch", icon: <BookOpen className="w-5 h-5" /> },
            { label: "Manage Catalog", href: "/admin/courses", desc: "Edit or publish existing courses", icon: <FileEdit className="w-5 h-5" /> },
            { label: "Manage Users", href: "/admin/users", desc: "View students and roles", icon: <Users className="w-5 h-5" /> },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex flex-col gap-3 p-6 bg-background border border-border hover:border-primary/50 hover:bg-primary/5 rounded-2xl transition-all duration-300 group"
            >
              <div className="flex items-center justify-between text-foreground group-hover:text-primary transition-colors">
                <div className="p-2 bg-secondary rounded-lg group-hover:bg-primary/10">
                  {action.icon}
                </div>
                <ArrowRight className="w-5 h-5 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </div>
              <div>
                <p className="font-headline text-lg font-bold text-foreground mb-1">
                  {action.label}
                </p>
                <p className="text-sm text-muted-foreground">{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
