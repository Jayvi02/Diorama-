"use client";

import { useEffect, useRef } from "react";
import { process } from "@/data/site";
import { gsap } from "@/lib/motion";
import Cobweb from "./Cobweb";
import Heading from "./Heading";

// Investigation log: on large screens the section pins and the entries slide past horizontally.
export default function Log() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const t = track.current!;
        const distance = () => t.scrollWidth - window.innerWidth;
        gsap.to(t, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
        gsap.to("[data-log-progress]", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${distance()}`, scrub: true },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="log" ref={root} className="relative overflow-hidden lg:h-screen">
      <Cobweb corner="tl" seed={63} size={230} opacity={0.4} className="left-0 top-0" />
      <div className="flex h-full flex-col justify-center py-28 lg:py-0">
        <div className="mx-auto mb-12 w-full max-w-7xl px-5 sm:px-10">
          <Heading label="File 05 — Investigation log" title="From sketch to screen" />
        </div>

        <div
          ref={track}
          className="flex flex-col gap-5 px-5 sm:px-10 lg:w-max lg:flex-row lg:gap-8 lg:pl-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))] lg:pr-[20vw]"
        >
          {process.map((p) => (
            <article
              key={p.step}
              className="group relative bg-surface/70 p-7 sm:p-9 lg:flex lg:h-[50vh] lg:w-[28rem] lg:shrink-0 lg:flex-col lg:justify-between"
            >
              <div className="rough-frame pointer-events-none absolute inset-0 transition-opacity group-hover:opacity-100 lg:opacity-60" />
              <p className="font-type text-sm text-muted">Entry no. {p.step}</p>
              <div>
                <h3 className="eroded mt-6 font-display text-5xl font-extrabold uppercase leading-[0.9] lg:text-6xl">
                  {p.title}
                </h3>
                <div className="rough-line mt-4 w-24" />
                <p className="mt-4 max-w-sm text-lg leading-snug text-foreground/70">{p.text}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-12 hidden w-full max-w-7xl px-10 lg:block">
          <div className="relative h-px">
            <div className="rough-line absolute inset-0 opacity-20" />
            <div data-log-progress className="rough-line absolute inset-0 origin-left scale-x-0 opacity-90" />
          </div>
        </div>
      </div>
    </section>
  );
}
