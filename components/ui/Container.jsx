import { cn } from "@/lib/cn";

// Responsive container that fills available width
// Use className to override max-width per page context:
//   max-w-2xl  -> narrow content pages (forms, lists)
//   max-w-4xl  -> medium dashboards
//   max-w-6xl  -> wide dashboards
//   max-w-none -> full-width pages
export function Container({ children, className }) {
  return (
    <div className={cn("w-full px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}
