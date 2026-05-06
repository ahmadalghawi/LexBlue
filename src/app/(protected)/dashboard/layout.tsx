"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/auth";
import { signOut } from "firebase/auth";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * Dashboard Layout
 * 
 * Provides the shell structure for all protected dashboard routes.
 * - Desktop: Fixed sidebar on left, content area on right
 * - Mobile: Topbar with hamburger menu, bottom navigation
 * - Integrates with AuthContext for user data
 * 
 * @author LexBlue Development Team
 * @since Dashboard v2.0
 */
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, dbUser, loading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /**
   * Handle user sign out
   * Clears Firebase auth state and redirects to login
   */
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  /**
   * Toggle mobile sidebar visibility
   */
  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  /**
   * Close mobile sidebar
   */
  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Loading state - show skeleton
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

  // No user - shouldn't happen if AuthGuard is working, but safety check
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <Sidebar isOpen={true} />

      {/* Mobile Topbar */}
      <Topbar onMenuClick={toggleSidebar} />

      {/* Mobile Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Main Content Area */}
      <main
        className={cn(
          "flex flex-col min-h-screen",
          "lg:pl-72", // Offset for desktop sidebar
          "pb-20 lg:pb-0" // Bottom nav padding on mobile
        )}
      >
        {/* Spacer for fixed topbar on mobile */}
        <div className="h-16 lg:hidden" />

        {/* Page Content */}
        <div className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
}
