import Link from "next/link";
import { ArrowRight, BookOpen, Users, Star } from "lucide-react";

export function TopHero() {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-background px-6 xl:px-16 py-20">
      {/* Background atmosphere */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-secondary/30 blur-[100px]" />
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)`,
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="w-full max-w-7xl mx-auto">
        <div className="flex flex-col xl:flex-row items-center gap-16 xl:gap-24">

          {/* ── Left Column ── */}
          <div className="xl:w-[55%] flex flex-col gap-8">

            {/* Badge */}
            <div className="flex items-center gap-2 w-fit">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
              </span>
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary/80">
                Engineering &amp; Tech
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <h1 className="font-headline text-[52px]/[1.05] sm:text-[68px]/[1.05] lg:text-[80px]/[1.05] font-extrabold text-foreground tracking-tight">
                Artisanal
                <br />
                <span className="text-primary relative inline-block">
                  Digital Craft
                  {/* Underline accent */}
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 300 8"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 6 Q75 0 150 5 Q225 10 300 4"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      className="text-primary/40"
                    />
                  </svg>
                </span>
              </h1>
              <h2 className="font-headline text-[36px]/[1.1] sm:text-[48px]/[1.1] font-bold text-foreground/60">
                Mastering the Tech Stack.
              </h2>
            </div>

            {/* Body */}
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
              Build your future with curated engineering paths. From system
              architecture to elegant code, we master the complexity of the
              modern IT landscape — deep-dive modules, real projects.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link href="/learn">
                <button className="group flex items-center gap-2 px-7 py-4 bg-primary text-background font-bold rounded-full hover:bg-primary/90 hover:shadow-[0_0_40px_-8px] hover:shadow-primary/60 transition-all duration-300 active:scale-[0.98]">
                  Start your journey
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/courses">
                <button className="flex items-center gap-2 px-7 py-4 bg-transparent text-foreground font-bold rounded-full ring-1 ring-border hover:ring-primary/50 hover:bg-secondary/40 transition-all duration-300">
                  <BookOpen className="w-4 h-4 text-primary" />
                  Browse Courses
                </button>
              </Link>
            </div>

            {/* Stat pills */}
            <div className="flex flex-wrap gap-4 pt-4">
              {[
                { icon: Users, label: "Active Learners", value: "10K+" },
                { icon: Star, label: "Avg. Rating", value: "4.9★" },
                { icon: BookOpen, label: "Courses", value: "50+" },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 px-4 py-2.5 bg-secondary/30 border border-border/50 rounded-full backdrop-blur-sm"
                >
                  <Icon className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground leading-none">
                      {label}
                    </p>
                    <p className="text-sm font-bold text-foreground">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right Column: Hero Image ── */}
          <div className="xl:w-[45%] relative flex items-center justify-center">
            {/* Glow behind image */}
            <div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full scale-75" />

            <div className="relative rounded-3xl overflow-hidden ring-1 ring-primary/20 shadow-2xl shadow-primary/10">
              <img
                src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1470&auto=format&fit=crop"
                alt="Engineering workspace"
                className="w-full max-w-[540px] object-cover aspect-[4/3]"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />

              {/* Floating badge on image */}
              <div className="absolute bottom-6 left-6 flex items-center gap-3 bg-background/80 backdrop-blur-md px-4 py-3 rounded-2xl border border-border/50">
                <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
                  <Star className="w-4 h-4 text-primary fill-primary" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                    Top Rated Platform
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    98% Job Placement
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}