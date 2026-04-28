import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-[24px]">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-headline text-2xl font-bold text-primary tracking-tight">
            LexBlue
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/courses" className="text-lg font-medium text-foreground hover:text-primary transition-colors">
              Courses
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <ThemeToggle />
          <Link href="/login" className="text-lg font-medium text-foreground hover:text-primary transition-colors">
            Login
          </Link>
          <Link href="/register" className="text-lg font-medium bg-primary text-primary-foreground px-6 py-2.5 rounded-full hover:shadow-lg hover:scale-105 transition-all">
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
