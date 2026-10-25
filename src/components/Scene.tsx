"use client";

import { useEffect, useRef, useState } from "react";
import { coverImage, coverSize, evidence, project } from "@/data/site";
import { gsap, prefersReducedMotion } from "@/lib/motion";
import Cobweb from "./Cobweb";
import Heading from "./Heading";

// The diorama photo as a crime scene: markers on the three main objects open their notes.
export default function Scene() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const st = { trigger: "[data-frame]", start: "top 90%", end: "top 25%", scrub: true };
      gsap.fromTo("[data-frame]", { clipPath: "inset(14% 18% 14% 18%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: st });
      gsap.fromTo("[data-frame-img]", { scale: 1.3 }, { scale: 1, ease: "none", scrollTrigger: st });
      gsap.fromTo("[data-frame-dark]", { opacity: 0.75 }, { opacity: 0, ease: "none", scrollTrigger: st });
      gsap.from("[data-spot]", {
        opacity: 0,
        duration: 1.2,
        stagger: 0.3,
        ease: "power2.out",
        scrollTrigger: { trigger: "[data-frame]", start: "top 30%" },
      });
      gsap.from("[data-stat]", {
        opacity: 0,
        y: 20,
        duration: 1,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: { trigger: "[data-stats]", start: "top 85%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="scene" ref={root} className="relative mx-auto max-w-7xl px-5 pb-28 pt-36 sm:px-10">
      <Cobweb corner="tr" seed={12} size={220} opacity={0.35} className="right-0 top-10" />

      <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
        <Heading label="File 01 - Case summary" title="No one walked out" className="lg:col-span-7" />
        <p className="text-lg leading-relaxed text-foreground/70 lg:col-span-5">{project.summary}</p>
      </div>

      <dl data-stats className="relative mt-14 grid grid-cols-3">
        <span className="rough-line absolute inset-x-0 top-0" />
        <span className="rough-line absolute inset-x-0 bottom-0" />
        {[
          ["03", "main miniatures"],
          ["A4-A3", "diorama scale"],
          ["360°", "turntable view"],
        ].map(([v, l], i) => (
          <div key={l} data-stat className="relative px-4 py-6 sm:px-8">
            {i > 0 && <span className="rough-line-v absolute bottom-3 left-0 top-3" />}
            <dt className="font-display text-4xl font-semibold tracking-[-0.02em] sm:text-6xl">{v}</dt>
            <dd className="mt-1 font-type text-xs text-muted sm:text-sm">{l}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-16">
        <div className="mb-4 flex items-center justify-between font-type text-sm text-muted">
          <span>Exhibit 01 - scene photograph</span>
          <span className="hidden sm:inline">select a marker</span>
          <span className="sm:hidden">tap a marker</span>
        </div>
        <div
          data-frame
          className="relative w-full overflow-hidden bg-black"
          style={{ aspectRatio: `${coverSize.width} / ${coverSize.height}` }}
          onPointerLeave={() => setActive(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            data-frame-img
            src={coverImage}
            alt="The diorama with markers on the bathtub, toilet and sink"
            loading="lazy"
            className="graded absolute inset-0 h-full w-full object-cover"
          />
          <div className="tint pointer-events-none absolute inset-0" />
          <div data-frame-dark className="pointer-events-none absolute inset-0 bg-black opacity-0" />
          <div className="vignette pointer-events-none absolute inset-0 opacity-60" />
          <div
            className={`pointer-events-none absolute inset-0 bg-black/60 transition-opacity duration-700 ${
              active ? "opacity-100" : "opacity-0"
            }`}
          />
          <div className="rough-frame pointer-events-none absolute inset-0" />

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
                  aria-label={`Show notes on ${item.name}`}
                  aria-expanded={on}
                  onPointerEnter={(e) => e.pointerType === "mouse" && setActive(item.marker)}
                  onClick={() => setActive(on ? null : item.marker)}
                  className="relative grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center sm:h-12 sm:w-12"
                >
                  <span className="hotspot-ring absolute inset-0 rounded-full border border-foreground/70" />
                  <span className="hotspot-ring delay absolute inset-0 rounded-full border border-foreground/70" />
                  <span
                    className={`relative grid h-6 w-6 place-items-center rounded-full font-type text-sm transition duration-500 sm:h-8 sm:w-8 sm:text-base ${
                      on ? "bg-blood-bright text-white" : "bg-foreground text-black"
                    }`}
                  >
                    {item.marker}
                  </span>
                </button>

                <div
                  className={`absolute top-0 w-56 bg-black/85 p-4 transition-all duration-500 sm:w-72 sm:p-5 ${
                    flip ? "right-7 sm:right-9" : "left-7 sm:left-9"
                  } ${on ? "pointer-events-auto -translate-y-1/2 opacity-100" : "pointer-events-none -translate-y-[45%] opacity-0"}`}
                >
                  <div className="rough-frame pointer-events-none absolute inset-0" />
                  <p className="font-type text-xs text-muted">Evidence 0{item.marker}</p>
                  <p className="mt-1 font-display text-2xl font-semibold leading-none tracking-[-0.01em] sm:text-3xl">
                    {item.name}
                  </p>
                  <p className="mt-2 hidden text-sm leading-snug text-foreground/75 sm:block">{item.description}</p>
                  <p className="mt-3 font-type text-[11px] text-muted">{item.details.join(" · ")}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
