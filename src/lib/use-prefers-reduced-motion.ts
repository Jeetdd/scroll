"use client";

import { useMediaQuery } from "@/lib/use-media-query";

/**
 * Starts as `false` so the first client render matches the server's, then
 * corrects itself after mount.
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
