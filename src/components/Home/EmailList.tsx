"use client";

import { useState } from "react";
import { Send, Zap } from "lucide-react";

export function EmailList() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <section className="w-full px-6 xl:px-16 py-24 bg-background relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-3xl mx-auto text-center space-y-8">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 mx-auto">
          <Zap className="w-7 h-7 text-primary" />
        </div>

        {/* Headline */}
        <div className="space-y-4">
          <h2 className="font-headline text-4xl sm:text-5xl font-extrabold text-foreground">
            Join the{" "}
            <span className="text-primary">LexBlue Stack</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Weekly deep-dives into engineering culture, emerging stacks, and IT
            strategy. Minimal noise, maximum technical signal.
          </p>
        </div>

        {/* Form or Success */}
        {submitted ? (
          <div className="inline-flex items-center gap-3 px-8 py-5 bg-primary/10 border border-primary/30 rounded-2xl text-primary font-bold">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
            </span>
            You&apos;re on the list! Welcome to the Stack.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 px-5 py-4 bg-secondary/30 border border-border/50 rounded-full text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:bg-secondary/50 transition-all duration-200"
            />
            <button
              type="submit"
              className="group flex items-center justify-center gap-2 px-7 py-4 bg-primary text-background font-bold rounded-full hover:bg-primary/90 hover:shadow-[0_0_40px_-8px] hover:shadow-primary/60 transition-all duration-300 whitespace-nowrap"
            >
              Sign up
              <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </form>
        )}

        {/* Trust note */}
        <p className="text-xs text-muted-foreground/60">
          No spam, ever. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}