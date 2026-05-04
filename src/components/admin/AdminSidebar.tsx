"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/auth";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: "Courses",
    href: "/admin/courses",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    label: "Preview",
    href: "/temp-preview",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { dbUser } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <aside className="w-64 min-h-screen bg-card border-r border-border flex flex-col sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/admin" className="font-headline text-xl font-extrabold text-primary tracking-tight">
          LexBlue
        </Link>
        <div className="mt-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/60 bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            Admin Panel
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-grow p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-headline font-bold text-sm transition-all duration-200 ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User info + Sign out */}
      <div className="p-4 border-t border-border">
        <div className="bg-secondary/40 rounded-2xl p-4 mb-3">
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground/60 mb-1">
            Signed in as
          </p>
          <p className="text-sm font-bold text-foreground truncate">{dbUser?.email}</p>
          <span className="inline-block mt-1 text-[10px] font-extrabold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            Admin
          </span>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full text-sm font-headline font-bold text-muted-foreground hover:text-foreground bg-secondary/40 hover:bg-secondary/60 py-2.5 rounded-xl transition-all duration-200"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
