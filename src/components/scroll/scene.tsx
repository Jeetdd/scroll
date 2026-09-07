"use client";

import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { ScrollScene } from "./scroll-scene";
import { StaticScene } from "./static-scene";

export function Scene() {
  return usePrefersReducedMotion() ? <StaticScene /> : <ScrollScene />;
}
