"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { auth } from "@/lib/auth";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, dbUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // Not logged in at all
    if (!user && !auth.currentUser) {
      router.replace("/login");
      return;
    }

    // Logged in but not an admin — send to student dashboard
    if (dbUser && dbUser.role !== "admin") {
      router.replace("/dashboard");
      return;
    }
  }, [user, dbUser, loading, router]);

  // Show loading spinner while resolving auth + Firestore role
  if (loading || !dbUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground font-headline tracking-widest uppercase">
            Verifying Access...
          </p>
        </div>
      </div>
    );
  }

  // Role confirmed as admin — render children
  if (dbUser.role !== "admin") {
    return null; // Redirect in progress
  }

  return <>{children}</>;
}
