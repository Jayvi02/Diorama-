"use client";

import { useRef } from "react";
import { coverImage, project } from "@/data/site";

// Full-screen opener: the diorama cover sits behind a "flashlight" that follows the cursor.
export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  const move = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--fx", `${e.clientX - r.left}px`);
    el.style.setProperty("--fy", `${e.clientY - r.top}px`);
  };

  return (
    <section
      ref={ref}
      onPointerMove={move}
      className="relative flex min-h-[100svh] items-end overflow-hidden"
      style={{ "--fx": "50%", "--fy": "40%" } as React.CSSProperties}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={coverImage}
        alt="The finished diorama: a derelict bathroom sealed with police tape, evidence markers 1–3 and a chalk outline on the tiles"
        fetchPriority="high"
        className="kenburns absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_380px_at_var(--fx)_var(--fy),transparent_0%,rgba(7,9,13,0.55)_55%,rgba(7,9,13,0.9)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

      <div className="relative mx-auto w-full max-w-6xl px-4 pb-24 sm:px-6 sm:pb-32">
        <p className="mb-4 font-type text-xs uppercase tracking-[0.3em] text-tape sm:text-sm">
          Case file {project.caseNo} · Scene sealed
        </p>
        <h1 className="flicker font-display text-[clamp(4rem,14vw,11rem)] leading-[0.85] tracking-wide">
          {project.title}
        </h1>
        <p className="mt-6 max-w-xl text-base text-foreground/80 sm:text-lg">{project.tagline}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href="#film"
            className="rounded-full bg-tape px-6 py-3 text-sm font-semibold text-black transition hover:brightness-110"
          >
            Watch the film
          </a>
          <a
            href="#evidence"
            className="rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold backdrop-blur transition hover:border-tape hover:text-tape"
          >
            Inspect the evidence
          </a>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-type text-[10px] uppercase tracking-[0.3em] text-muted sm:flex">
        Scroll
        <span className="h-10 w-px animate-pulse bg-gradient-to-b from-tape to-transparent" />
      </div>
    </section>
  );
}
