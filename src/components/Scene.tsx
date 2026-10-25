"use client";

import { useEffect, useRef, useState } from "react";
import { coverImage, coverSize, evidence, project } from "@/data/site";
import { gsap, prefersReducedMotion, scrollToId, selectEvidence } from "@/lib/motion";
import Scramble from "./Scramble";

// The diorama photo as an interactive crime scene: hotspots on the three main objects.
export default function Scene() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-frame]",
        { clipPath: "inset(18% 22% 18% 22%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "none",
          scrollTrigger: { trigger: "[data-frame]", start: "top 90%", end: "top 25%", scrub: true },
        },
      );
      gsap.fromTo(
        "[data-frame-img]",
        { scale: 1.35 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: "[data-frame]", start: "top 90%", end: "top 25%", scrub: true },
        },
      );
      gsap.from("[data-spot]", {
        scale: 0,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: "back.out(2)",
        scrollTrigger: { trigger: "[data-frame]", start: "top 30%" },
      });
      gsap.from("[data-stat]", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-stats]", start: "top 85%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const examine = (marker: number) => {
    selectEvidence(marker);
    scrollToId("evidence");
  };

  return (
    <section id="scene" ref={root} className="relative mx-auto max-w-7xl px-4 pb-28 pt-32 sm:px-8">
      <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <p className="mb-4 flex items-center gap-3 font-type text-[10px] uppercase tracking-[0.35em] text-blood-bright sm:text-xs">
            <span className="h-px w-10 bg-blood-bright" />
            01 · Case summary
          </p>
          <Scramble
            as="h2"
            text="A BATHROOM NO ONE WALKED OUT OF."
            className="block font-display text-5xl leading-[0.9] tracking-wide sm:text-7xl"
          />
        </div>
        <p className="leading-relaxed text-foreground/70 lg:col-span-5">{project.summary}</p>
      </div>

      <dl data-stats className="mt-12 grid grid-cols-3 border-y border-line">
        {[
          ["03", "Main miniatures"],
          ["A4–A3", "Diorama scale"],
          ["360°", "Object views"],
        ].map(([v, l], i) => (
          <div key={l} data-stat className={`py-6 ${i ? "border-l border-line pl-4 sm:pl-8" : ""}`}>
            <dt className="font-display text-4xl text-foreground sm:text-6xl">{v}</dt>
            <dd className="mt-1 font-type text-[10px] uppercase tracking-[0.2em] text-muted sm:text-xs">{l}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-16">
        <div className="mb-4 flex items-center justify-between font-type text-[10px] uppercase tracking-[0.3em] text-muted sm:text-xs">
          <span>Scene photograph · Exhibit 01</span>
          <span className="hidden sm:inline">Select a marker to examine</span>
          <span className="sm:hidden">Tap a marker</span>
        </div>
        <div
          data-frame
          className="relative w-full overflow-hidden border border-line bg-black"
          style={{ aspectRatio: `${coverSize.width} / ${coverSize.height}` }}
          onPointerLeave={() => setActive(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            data-frame-img
            src={coverImage}
            alt="The diorama with hotspots on the bathtub, toilet and sink"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="scanlines pointer-events-none absolute inset-0 opacity-30" />
          <div
            className={`pointer-events-none absolute inset-0 bg-black/55 transition-opacity duration-500 ${
              active ? "opacity-100" : "opacity-0"
            }`}
          />

          {evidence.map((item) => {
            const on = active === item.marker;
            const flip = item.spot.x > 60;
            return (
              <div
                key={item.marker}
                data-spot
                className="absolute z-10"
                style={{ left: `${item.spot.x}%`, top: `${item.spot.y}%` }}
              >
                <button
                  type="button"
                  aria-label={`Examine ${item.name}`}
                  data-cursor="EXAMINE"
                  onPointerEnter={(e) => e.pointerType === "mouse" && setActive(item.marker)}
                  onClick={() => (on ? examine(item.marker) : setActive(item.marker))}
                  className="relative grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center sm:h-12 sm:w-12"
                >
                  <span className="hotspot-ring absolute inset-0 rounded-full border border-tape" />
                  <span className="hotspot-ring delay absolute inset-0 rounded-full border border-tape" />
                  <span
                    className={`relative grid h-6 w-6 place-items-center rounded-full font-type text-xs text-black transition sm:h-8 sm:w-8 sm:text-sm ${
                      on ? "scale-110 bg-blood-bright text-white" : "bg-tape"
                    }`}
                  >
                    {item.marker}
                  </span>
                </button>

                <div
                  className={`absolute top-0 w-56 border border-tape/60 bg-background/90 p-4 backdrop-blur-md transition-all duration-300 sm:w-64 ${
                    flip ? "right-8 sm:right-10" : "left-8 sm:left-10"
                  } ${on ? "pointer-events-auto translate-y-[-50%] opacity-100" : "pointer-events-none translate-y-[-40%] opacity-0"}`}
                >
                  <p className="font-type text-[10px] uppercase tracking-[0.3em] text-blood-bright">
                    Evidence 0{item.marker}
                  </p>
                  <p className="mt-1 font-display text-2xl tracking-wide sm:text-3xl">{item.name}</p>
                  <p className="mt-2 hidden text-xs leading-relaxed text-foreground/70 sm:block">{item.description}</p>
                  <button
                    type="button"
                    onClick={() => examine(item.marker)}
                    className="mt-3 font-type text-[11px] uppercase tracking-[0.25em] text-tape hover:underline"
                  >
                    Examine 360° ▸
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
