import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// shadcn-style className combiner — used by the new ui/ components
// (aurora-background, scroll-reel-testimonials, display-cards, expandable-tabs)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const cx = (...c: (string|undefined|false|null)[]) => c.filter(Boolean).join(" ");
export const formatINR = (n: number) => new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(n);
export const truncate = (s: string, max: number) => s.length <= max ? s : s.slice(0,max).trimEnd()+"…";
