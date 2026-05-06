"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "@/components/theme-toggle";

interface TopbarProps {
  onMenuClick?: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const { dbUser } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-card/80 backdrop-blur-md lg:hidden">
      <div className="flex flex-1 items-center gap-4 px-4">
        {/* Hamburger Menu */}
        <button
          onClick={onMenuClick}
          className="flex items-center justify-center p-2 -ml-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        {/* Logo */}
        <Link href="/dashboard" className="font-headline text-xl font-bold text-primary tracking-tight">
          LexBlue
        </Link>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 pr-4">
        <ThemeToggle />
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="text-xs font-bold text-primary">
            {dbUser?.email?.charAt(0).toUpperCase() || "U"}
          </span>
        </div>
      </div>
    </header>
  );
}
