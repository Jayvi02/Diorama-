"use client";

import { useEffect, useRef } from "react";
import { videos } from "@/data/site";
import { gsap, prefersReducedMotion } from "@/lib/motion";
import Cobweb from "./Cobweb";
import Heading from "./Heading";
import VideoPlayer from "./VideoPlayer";

// Exhibit A: the final cut, revealed as the black bars open.
export function Film() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-screen]",
        { clipPath: "inset(40% 10% 40% 10%)" },
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
      <div className="mx-auto max-w-7xl px-5 sm:px-10">
        <div className="mb-12 grid gap-8 lg:grid-cols-12 lg:items-end">
          <Heading label={`File 02 — ${videos.final.label}`} title={videos.final.title} className="lg:col-span-7" />
          <p className="text-lg leading-relaxed text-foreground/70 lg:col-span-5">{videos.final.description}</p>
        </div>
        <div className="relative">
          <div data-screen className="relative">
            <VideoPlayer video={videos.final} />
            <div className="rough-frame pointer-events-none absolute inset-0" />
          </div>
          <Cobweb corner="tr" seed={44} size={190} opacity={0.5} className="-right-3 -top-3" />
        </div>
      </div>
    </section>
  );
}

// Exhibit B: behind the scenes.
export function MakingOf() {
  return (
    <section id="making" className="relative py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Heading label={`File 04 — ${videos.making.label}`} title={videos.making.title} />
          <p className="mt-8 text-lg leading-relaxed text-foreground/70">{videos.making.description}</p>
        </div>
        <div className="relative lg:col-span-8">
          <VideoPlayer video={videos.making} />
          <div className="rough-frame pointer-events-none absolute inset-0" />
          <Cobweb corner="bl" seed={57} size={150} opacity={0.4} className="-bottom-3 -left-3" />
        </div>
      </div>
    </section>
  );
}
