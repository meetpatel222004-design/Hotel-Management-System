"use client";

import { cn } from "@/lib/cn";

export function ResponsiveGrid({ children, className }) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4", className)}>
      {children}
    </div>
  );
}

export function StatCard({ label, value, icon: Icon, color, onClick }) {
  const Comp = onClick ? "button" : "div";
  return (
    <Comp
      onClick={onClick}
      className={`relative rounded-2xl glass-strong p-4 md:p-5 overflow-hidden ring-glow ${onClick ? "hover:ring-primary/50 cursor-pointer transition-all" : ""}`}
    >
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${color || "from-primary/30 via-primary/10 to-transparent"}`} />
      <div className="relative">
        {Icon && <Icon className="h-5 w-5 mb-2 text-muted-foreground" />}
        <div className="text-2xl md:text-3xl font-bold">{value}</div>
        <div className="text-xs text-muted-foreground mt-1">{label}</div>
      </div>
    </Comp>
  );
}

export function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="text-center py-12 md:py-16">
      {Icon && <Icon className="h-12 w-12 mx-auto text-muted-foreground mb-3" />}
      <p className="text-lg font-semibold text-muted-foreground">{title}</p>
      {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
    </div>
  );
}
