"use client";

import { useAuth } from "@/context/AuthContext";

import { Topbar } from "@/components/layout/Topbar";
import { MobileNav } from "@/components/layout/MobileNav";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * Dashboard Layout
 *
 * Protected shell for dashboard routes (no sidebar).
 */
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <p className="text-sm text-muted-foreground font-headline tracking-widest uppercase">
              Loading...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Topbar />

      <main className="flex flex-col min-h-screen pb-20 lg:pb-0">
        <div className="h-16 lg:hidden" />
        <div className="flex-1 p-4 md:p-6 lg:p-8">{children}</div>
      </main>

      <MobileNav />
    </div>
  );
}

