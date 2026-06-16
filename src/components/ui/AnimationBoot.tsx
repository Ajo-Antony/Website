"use client";
import { useGsapAnimations } from "@/hooks/useGsapAnimations";

// Mounted at root; boots all GSAP animations site-wide
export default function AnimationBoot() {
  useGsapAnimations();
  return null;
}
