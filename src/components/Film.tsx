"use client";

import { useEffect, useRef } from "react";
import { videos } from "@/data/site";
import { gsap, prefersReducedMotion } from "@/lib/motion";
import Scramble from "./Scramble";
import VideoPlayer from "./VideoPlayer";

// Exhibit A: the final cut, revealed through opening cinema letterbox bars.
export function Film() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-screen]",
        { clipPath: "inset(42% 12% 42% 12%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "power2.inOut",
          scrollTrigger: { trigger: "[data-screen]", start: "top 85%", end: "center 55%", scrub: 1 },
        },
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="film" ref={root} className="relative py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="mb-12 grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="mb-4 flex items-center gap-3 font-type text-[10px] uppercase tracking-[0.35em] text-blood-bright sm:text-xs">
              <span className="h-px w-10 bg-blood-bright" />
              02 · {videos.final.label}
            </p>
            <Scramble as="h2" text="THE FINAL FILM" className="block font-display text-5xl tracking-wide sm:text-7xl" />
          </div>
          <p className="leading-relaxed text-foreground/70 lg:col-span-5">{videos.final.description}</p>
        </div>
        <div data-screen className="border border-line shadow-[0_40px_120px_-30px_rgba(179,18,27,0.45)]">
          <VideoPlayer video={videos.final} />
        </div>
      </div>
    </section>
  );
}

// Exhibit B: behind the scenes.
export function MakingOf() {
  return (
    <section id="making" className="relative py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="mb-4 flex items-center gap-3 font-type text-[10px] uppercase tracking-[0.35em] text-blood-bright sm:text-xs">
            <span className="h-px w-10 bg-blood-bright" />
            04 · {videos.making.label}
          </p>
          <Scramble as="h2" text="MAKING OF" className="block font-display text-5xl tracking-wide sm:text-7xl" />
          <p className="mt-6 leading-relaxed text-foreground/70">{videos.making.description}</p>
        </div>
        <div className="border border-line lg:col-span-8">
          <VideoPlayer video={videos.making} />
        </div>
      </div>
    </section>
  );
}
