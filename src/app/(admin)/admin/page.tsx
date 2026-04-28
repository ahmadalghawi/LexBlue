"use client";

import { useAuth } from "@/context/AuthContext";

export default function AdminPage() {
  const { dbUser } = useAuth();

  const stats = [
    { label: "Total Courses", value: "0", icon: "📚" },
    { label: "Total Students", value: "0", icon: "👥" },
    { label: "Published", value: "0", icon: "✅" },
    { label: "Drafts", value: "0", icon: "📝" },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-headline text-4xl font-extrabold text-foreground tracking-tight mb-2">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground text-lg">
          Welcome back, <span className="text-foreground font-semibold">{dbUser?.displayName ?? dbUser?.email}</span>
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card rounded-2xl p-6 shadow-xl shadow-foreground/5"
          >
            <div className="text-3xl mb-3">{stat.icon}</div>
            <p className="text-3xl font-headline font-extrabold text-foreground mb-1">
              {stat.value}
            </p>
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground/70">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-card rounded-[2rem] p-8 shadow-xl shadow-foreground/5">
        <h2 className="font-headline text-xl font-extrabold text-foreground mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Create New Course", href: "/admin/courses/new", desc: "Add a new course to the catalog" },
            { label: "Manage Users", href: "/admin/users", desc: "View and manage student accounts" },
          ].map((action) => (
            <a
              key={action.href}
              href={action.href}
              className="flex flex-col gap-1 p-5 bg-secondary/30 hover:bg-secondary/50 rounded-2xl transition-all duration-200 group"
            >
              <p className="font-headline font-bold text-foreground group-hover:text-primary transition-colors">
                {action.label}
              </p>
              <p className="text-sm text-muted-foreground">{action.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
