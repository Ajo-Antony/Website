"use client";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/Theme/ThemeProvider";
import { cn } from "@/lib/utils";

export default function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={cn(
        "relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors",
        "border-[var(--border)] bg-[var(--glass-bg)] text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)]",
        className
      )}
    >
      <Sun
        className={cn(
          "absolute size-4 transition-all duration-300",
          isDark ? "scale-0 -rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
        )}
      />
      <Moon
        className={cn(
          "absolute size-4 transition-all duration-300",
          isDark ? "scale-100 rotate-0 opacity-100" : "scale-0 rotate-90 opacity-0"
        )}
      />
    </button>
  );
}
