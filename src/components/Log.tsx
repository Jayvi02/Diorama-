"use client";

import { useEffect, useRef } from "react";
import { process } from "@/data/site";
import { gsap } from "@/lib/motion";
import Scramble from "./Scramble";

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
        const tween = gsap.to(t, {
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
        gsap.utils.toArray<HTMLElement>("[data-entry]").forEach((card) => {
          gsap.from(card.querySelector("[data-num]"), {
            yPercent: 60,
            opacity: 0,
            ease: "none",
            scrollTrigger: { trigger: card, containerAnimation: tween, start: "left 95%", end: "left 55%", scrub: true },
          });
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="log" ref={root} className="relative overflow-hidden border-y border-line bg-surface/50 lg:h-screen">
      <div className="flex h-full flex-col justify-center py-28 lg:py-0">
        <div className="mx-auto mb-12 w-full max-w-7xl px-4 sm:px-8">
          <p className="mb-4 flex items-center gap-3 font-type text-[10px] uppercase tracking-[0.35em] text-blood-bright sm:text-xs">
            <span className="h-px w-10 bg-blood-bright" />
            05 · Investigation log
          </p>
          <Scramble as="h2" text="FROM SKETCH TO SCREEN" className="block font-display text-5xl tracking-wide sm:text-7xl" />
        </div>

        <div
          ref={track}
          className="flex flex-col gap-4 px-4 sm:px-8 lg:w-max lg:flex-row lg:gap-6 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))] lg:pr-[20vw]"
        >
          {process.map((p) => (
            <article
              key={p.step}
              data-entry
              className="group relative overflow-hidden border border-line bg-background/70 p-6 transition hover:border-blood-bright/60 sm:p-8 lg:h-[52vh] lg:w-[30rem] lg:shrink-0"
            >
              <div className="flex items-center justify-between font-type text-[10px] uppercase tracking-[0.3em] text-muted">
                <span>Entry {p.step}</span>
                <span className="text-blood-bright opacity-0 transition group-hover:opacity-100">● Filed</span>
              </div>
              <span
                data-num
                className="text-outline pointer-events-none absolute -bottom-6 -right-2 font-display text-[9rem] leading-none transition group-hover:[-webkit-text-stroke-color:rgba(227,36,43,0.6)] lg:text-[14rem]"
              >
                {p.step}
              </span>
              <h3 className="relative mt-6 font-display text-4xl tracking-wide lg:mt-10 lg:text-5xl">{p.title}</h3>
              <p className="relative mt-3 max-w-sm leading-relaxed text-foreground/70">{p.text}</p>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-10 hidden w-full max-w-7xl px-8 lg:block">
          <div className="h-px w-full bg-line">
            <div data-log-progress className="h-px origin-left scale-x-0 bg-blood-bright" />
          </div>
        </div>
      </div>
    </section>
  );
}
