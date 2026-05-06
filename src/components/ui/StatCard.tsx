"use client";

import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
}: StatCardProps) {
  const isPositiveTrend = trend && trend.value > 0;
  const isNegativeTrend = trend && trend.value < 0;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-card p-6 border border-border",
        "transition-all duration-300 hover:border-primary/30",
        className
      )}
    >
      {/* Background Gradient Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="p-2 rounded-xl bg-secondary/50">
            {icon || (
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                />
              </svg>
            )}
          </div>

          {trend && (
            <div
              className={cn(
                "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                isPositiveTrend && "text-emerald-500 bg-emerald-500/10",
                isNegativeTrend && "text-red-500 bg-red-500/10",
                !isPositiveTrend && !isNegativeTrend && "text-muted-foreground bg-secondary/50"
              )}
            >
              {isPositiveTrend && (
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                  />
                </svg>
              )}
              {isNegativeTrend && (
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25"
                  />
                </svg>
              )}
              {Math.abs(trend.value)}%
            </div>
          )}
        </div>

        {/* Value */}
        <p className="text-3xl font-bold text-foreground tracking-tight mb-1">
          {value}
        </p>

        {/* Title */}
        <p className="text-sm font-medium text-muted-foreground">{title}</p>

        {/* Description */}
        {description && (
          <p className="text-xs text-muted-foreground/70 mt-2">{description}</p>
        )}

        {/* Trend Label */}
        {trend && (
          <p className="text-xs text-muted-foreground/60 mt-1">{trend.label}</p>
        )}
      </div>
    </div>
  );
}
