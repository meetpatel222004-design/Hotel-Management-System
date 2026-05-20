import { cn } from "@/lib/cn";

export function Container({ children, className }) {
  return (
    <div className={cn("w-full px-4 sm:px-6 lg:px-8 xl:px-10", className)}>
      {children}
    </div>
  );
}
