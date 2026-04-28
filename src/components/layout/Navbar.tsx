"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/auth";
import { signOut } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";

export function Navbar() {
  const { user, dbUser, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isLoggedIn = !loading && !!user;
  const isAdmin = isLoggedIn && dbUser?.role === "admin";

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-[24px]">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-8">
          <Link href="/" className="font-headline text-2xl font-bold text-primary tracking-tight">
            LexBlue
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/courses"
              className={`text-lg font-medium transition-colors ${pathname === "/courses" ? "text-primary" : "text-foreground hover:text-primary"}`}
            >
              Courses
            </Link>
            {isLoggedIn && (
              <>
                <Link
                  href="/dashboard"
                  className={`text-lg font-medium transition-colors ${pathname === "/dashboard" ? "text-primary" : "text-foreground hover:text-primary"}`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/learn"
                  className={`text-lg font-medium transition-colors ${pathname.startsWith("/learn") ? "text-primary" : "text-foreground hover:text-primary"}`}
                >
                  My Learning
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className={`text-lg font-medium transition-colors ${pathname.startsWith("/admin") ? "text-primary" : "text-foreground hover:text-primary"}`}
                  >
                    Admin
                  </Link>
                )}
              </>
            )}
          </nav>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {loading ? (
            // Skeleton to prevent layout shift
            <div className="w-24 h-9 rounded-full bg-secondary/50 animate-pulse" />
          ) : isLoggedIn ? (
            <button
              onClick={handleSignOut}
              className="text-lg font-medium text-foreground hover:text-primary transition-colors"
            >
              Sign Out
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="text-lg font-medium text-foreground hover:text-primary transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-lg font-medium bg-primary text-primary-foreground px-6 py-2.5 rounded-full hover:shadow-lg hover:scale-105 transition-all"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
