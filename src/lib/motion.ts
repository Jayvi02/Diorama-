"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type Lenis from "lenis";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

// The Lenis instance created by <SmoothScroll />, so other components can scroll or pause the page.
let lenis: Lenis | null = null;
export const setLenis = (l: Lenis | null) => {
  lenis = l;
};
export const getLenis = () => lenis;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Fired once the intro loader has finished, so the hero can play its entrance.
export const INTRO_DONE = "intro:done";
let introDone = false;
export const markIntroDone = () => {
  introDone = true;
  window.dispatchEvent(new Event(INTRO_DONE));
};
export const onIntroDone = (cb: () => void) => {
  if (introDone) {
    cb();
    return () => {};
  }
  window.addEventListener(INTRO_DONE, cb, { once: true });
  return () => window.removeEventListener(INTRO_DONE, cb);
};

// Lets the scene hotspots tell the evidence inventory which item to open.
export const SELECT_EVIDENCE = "evidence:select";
export const selectEvidence = (marker: number) => {
  window.dispatchEvent(new CustomEvent(SELECT_EVIDENCE, { detail: marker }));
};

export const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { duration: 1.4 });
  else el.scrollIntoView({ behavior: "smooth" });
};
