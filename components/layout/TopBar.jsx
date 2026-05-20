"use client";

import { useRouter, usePathname } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

export function TopBar({ title, subtitle, right, backTo, onBack, backButton, noBack }) {
  const router = useRouter();
  const pathname = usePathname();
  const showBack = backButton !== false && !noBack && (!!backTo || !!onBack || pathname !== "/");

  return (
    <header className="sticky top-0 z-30 glass-strong">
      <div className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 lg:px-8 py-3">
        {showBack ? (
          backTo ? (
            <Link
              href={backTo}
              className="grid h-10 w-10 place-items-center rounded-full bg-white/5 hover:bg-white/10 transition shrink-0"
              aria-label="Back"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
          ) : onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="grid h-10 w-10 place-items-center rounded-full bg-white/5 hover:bg-white/10 transition shrink-0"
              aria-label="Back"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => router.back()}
              className="grid h-10 w-10 place-items-center rounded-full bg-white/5 hover:bg-white/10 transition shrink-0"
              aria-label="Back"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )
        ) : null}
        <div className="flex-1 min-w-0">
          {title && <h1 className="truncate text-base sm:text-lg font-semibold tracking-tight">{title}</h1>}
          {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {right}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
