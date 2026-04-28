"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "@/lib/auth";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  // Use a local resolved state to avoid the race condition where:
  // - Page loads → onAuthStateChanged fires with null → loading: false, user: null
  // - User logs in → router.replace("/dashboard") fires immediately
  // - AuthGuard renders with stale state (loading:false, user:null) → kicks user out
  // Fix: also check auth.currentUser (synchronous from Firebase SDK)
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    // Wait until auth context has loaded AND Firebase has resolved
    if (!loading) {
      setResolved(true);
    }
  }, [loading]);

  useEffect(() => {
    if (resolved && !user && !auth.currentUser) {
      router.replace("/login");
    }
  }, [resolved, user, router]);

  // Still loading - show spinner
  if (!resolved || (loading && !user && !auth.currentUser)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground font-headline tracking-widest uppercase">
            Authenticating...
          </p>
        </div>
      </div>
    );
  }

  // Not authenticated - render nothing (redirect in progress)
  if (!user && !auth.currentUser) {
    return null;
  }

  return <>{children}</>;
}
