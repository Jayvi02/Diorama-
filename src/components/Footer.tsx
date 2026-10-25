"use client";

import { useEffect, useRef } from "react";
import { project } from "@/data/site";
import { gsap, prefersReducedMotion, scrollToId } from "@/lib/motion";

// Closing credits: the title fills with red as you reach the end of the file.
export default function Footer() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-fill]",
        { clipPath: "inset(100% 0 0 0)" },
        {
          clipPath: "inset(0% 0 0 0)",
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top 85%", end: "bottom bottom", scrub: true },
        },
      );
    }, root);
    return () => ctx.revert();
  }, []);

  const title = project.title.toUpperCase();

  return (
    <footer ref={root} className="relative overflow-hidden border-t border-line pt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <p className="font-type text-[10px] uppercase tracking-[0.35em] text-muted sm:text-xs">— End of file —</p>
        <div className="relative mt-6 select-none font-display text-[clamp(4rem,17vw,16rem)] leading-[0.8] tracking-wide">
          <span className="text-outline block">{title}</span>
          <span data-fill aria-hidden className="absolute inset-0 block text-blood">
            {title}
          </span>
        </div>
        <div className="mt-16 flex flex-col gap-6 border-t border-line py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-foreground/80">{project.module}</p>
            <p className="mt-1 font-type text-xs">
              {project.institution} · {project.year}
            </p>
          </div>
          <button
            type="button"
            onClick={() => scrollToId("top")}
            data-cursor="UP"
            className="w-fit border border-line px-5 py-3 font-type text-[11px] uppercase tracking-[0.25em] text-foreground/80 transition hover:border-tape hover:text-tape"
          >
            ▲ Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}
