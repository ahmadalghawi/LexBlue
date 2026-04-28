"use client";

import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/auth";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, dbUser } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 pt-24">
      <div className="bg-card rounded-[2rem] p-8 sm:p-12 shadow-xl shadow-foreground/5 border-none">
        <h1 className="font-headline text-4xl font-extrabold text-foreground tracking-tight mb-4">
          Welcome back, Artisan.
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mb-8 leading-relaxed">
          You are successfully authenticated. This is your protected student dashboard.
        </p>

        <div className="bg-secondary/30 rounded-2xl p-6 mb-8">
          <div className="space-y-4">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground/80 mb-1">
                Account Email
              </p>
              <p className="font-medium text-foreground">{user?.email}</p>
            </div>
            {dbUser && (
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground/80 mb-1">
                  Assigned Role
                </p>
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary font-bold text-xs rounded-full uppercase tracking-wider">
                  {dbUser.role}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            className="bg-primary text-primary-foreground font-headline font-bold py-3 px-8 rounded-xl text-sm shadow-[0_4px_14px_rgba(0,136,255,0.25)] hover:bg-primary/90 hover:-translate-y-0.5 transition-all duration-300"
          >
            Browse Courses
          </button>
          <button 
            onClick={handleSignOut}
            className="bg-secondary/60 text-muted-foreground font-headline font-bold py-3 px-8 rounded-xl text-sm hover:bg-secondary/80 hover:text-foreground transition-all duration-300"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
