"use client";

import { useEffect, useRef } from "react";
import { project, team } from "@/data/site";
import { gsap, prefersReducedMotion } from "@/lib/motion";
import Scramble from "./Scramble";

// Barcode stripes derived from the IT number, so each badge is unique.
function Barcode({ code }: { code: string }) {
  const bars = code.split("").flatMap((c, i) => {
    const n = c.charCodeAt(0) + i;
    return [1 + (n % 3), 1 + ((n >> 2) % 2)];
  });
  return (
    <div className="flex h-8 items-stretch gap-[2px]" aria-hidden>
      {bars.map((w, i) => (
        <span key={i} className={i % 2 ? "bg-transparent" : "bg-foreground/70"} style={{ width: w * 2 }} />
      ))}
    </div>
  );
}

function Fingerprint() {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
      {[26, 22, 18, 14, 10, 6].map((r, i) => (
        <path key={r} d={`M${32 - r} ${36 + i} a${r} ${r + 4} 0 0 1 ${r * 2} 0`} strokeDasharray={i % 2 ? "6 3" : "14 4"} />
      ))}
      <path d="M32 36v14M26 40c0 6 1 10 3 14M38 40c0 6-1 10-3 14" />
    </svg>
  );
}

export default function Team() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduce = prefersReducedMotion();
    const ctx = gsap.context(() => {
      if (!reduce) {
        gsap.from("[data-badge]", {
          y: 80,
          rotateX: -25,
          opacity: 0,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: "[data-badges]", start: "top 80%" },
        });
        gsap.from("[data-stamp]", {
          scale: 3,
          opacity: 0,
          duration: 0.35,
          stagger: 0.15,
          delay: 0.9,
          ease: "power4.in",
          scrollTrigger: { trigger: "[data-badges]", start: "top 80%" },
        });
      }
    }, root);

    // 3D tilt on hover (mouse only)
    const cards = root.current!.querySelectorAll<HTMLElement>("[data-badge]");
    const handlers: [HTMLElement, (e: PointerEvent) => void, () => void][] = [];
    if (!reduce && window.matchMedia("(pointer: fine)").matches) {
      cards.forEach((card) => {
        const rx = gsap.quickTo(card, "rotateX", { duration: 0.5, ease: "power3" });
        const ry = gsap.quickTo(card, "rotateY", { duration: 0.5, ease: "power3" });
        const move = (e: PointerEvent) => {
          const r = card.getBoundingClientRect();
          ry(((e.clientX - r.left) / r.width - 0.5) * 16);
          rx(((e.clientY - r.top) / r.height - 0.5) * -16);
          card.style.setProperty("--gx", `${((e.clientX - r.left) / r.width) * 100}%`);
          card.style.setProperty("--gy", `${((e.clientY - r.top) / r.height) * 100}%`);
        };
        const leave = () => {
          rx(0);
          ry(0);
        };
        card.addEventListener("pointermove", move);
        card.addEventListener("pointerleave", leave);
        handlers.push([card, move, leave]);
      });
    }

    return () => {
      ctx.revert();
      handlers.forEach(([c, m, l]) => {
        c.removeEventListener("pointermove", m);
        c.removeEventListener("pointerleave", l);
      });
    };
  }, []);

  return (
    <section id="team" ref={root} className="relative mx-auto max-w-7xl px-4 py-28 sm:px-8">
      <div className="mb-14">
        <p className="mb-4 flex items-center gap-3 font-type text-[10px] uppercase tracking-[0.35em] text-blood-bright sm:text-xs">
          <span className="h-px w-10 bg-blood-bright" />
          06 · Personnel
        </p>
        <Scramble as="h2" text="INVESTIGATORS ON FILE" className="block font-display text-5xl tracking-wide sm:text-7xl" />
      </div>

      <div data-badges className="grid gap-6 [perspective:1200px] md:grid-cols-3">
        {team.map((m, i) => (
          <article
            key={m.itNumber}
            data-badge
            data-cursor="ID"
            className="relative overflow-hidden border border-line bg-gradient-to-br from-surface-2 to-background [transform-style:preserve-3d]"
            style={{ "--gx": "50%", "--gy": "0%" } as React.CSSProperties}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_var(--gx)_var(--gy),rgba(255,255,255,0.08),transparent_55%)]" />
            <div className="flex items-center justify-between bg-blood px-5 py-2 font-type text-[10px] uppercase tracking-[0.3em] text-white">
              <span>Investigator</span>
              <span>No. 0{i + 1}</span>
            </div>
            <div className="flex gap-5 p-5">
              <div className="grid h-24 w-20 shrink-0 place-items-center border border-line bg-black/40 p-3 text-foreground/40">
                <Fingerprint />
              </div>
              <div className="min-w-0">
                <p className="font-type text-[10px] uppercase tracking-[0.3em] text-muted">Name</p>
                <h3 className="font-display text-3xl leading-none tracking-wide">{m.name}</h3>
                <p className="mt-4 font-type text-[10px] uppercase tracking-[0.3em] text-muted">IT number</p>
                <p className="font-type text-xl tracking-[0.15em] text-tape">{m.itNumber}</p>
              </div>
            </div>
            <div className="flex items-end justify-between border-t border-dashed border-line px-5 py-4">
              <Barcode code={m.itNumber} />
              <span className="font-type text-[9px] uppercase tracking-[0.2em] text-muted">{project.caseNo}</span>
            </div>
            <span
              data-stamp
              className="pointer-events-none absolute bottom-14 right-4 -rotate-12 border-2 border-blood-bright px-2 py-0.5 font-display text-2xl tracking-[0.2em] text-blood-bright opacity-80 mix-blend-screen"
            >
              Cleared
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}
