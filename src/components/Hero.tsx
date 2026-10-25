"use client";

import { useEffect, useRef } from "react";
import { coverImage, project } from "@/data/site";
import { gsap, onIntroDone, prefersReducedMotion, scrollToId } from "@/lib/motion";
import Dust from "./Dust";

const pad = (n: number, l = 2) => String(n).padStart(l, "0");

// Full-screen opener: the diorama cover as CCTV footage, lit by a flashlight that follows the cursor.
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const timecode = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current!;
    const reduce = prefersReducedMotion();

    // live CCTV timecode
    let raf = 0;
    const start = performance.now();
    const tickTc = () => {
      const t = (performance.now() - start) / 1000 + 3 * 3600 + 17 * 60;
      if (timecode.current) {
        timecode.current.textContent = `${pad(Math.floor(t / 3600))}:${pad(Math.floor(t / 60) % 60)}:${pad(
          Math.floor(t) % 60,
        )}:${pad(Math.floor((t % 1) * 25))}`;
      }
      raf = requestAnimationFrame(tickTc);
    };
    tickTc();

    const ctx = gsap.context(() => {
      const img = el.querySelector("[data-img]");
      const letters = el.querySelectorAll("[data-letter]");
      const fades = el.querySelectorAll("[data-fade]");

      if (reduce) return;

      gsap.set(img, { scale: 1.35, filter: "brightness(0) blur(8px)" });
      gsap.set(letters, { yPercent: 120, opacity: 0 });
      gsap.set(fades, { y: 30, opacity: 0 });

      const intro = () =>
        gsap
          .timeline()
          .to(img, { scale: 1.12, filter: "brightness(1) blur(0px)", duration: 2.4, ease: "expo.out" })
          .to(letters, { yPercent: 0, opacity: 1, duration: 1.1, stagger: 0.05, ease: "expo.out" }, 0.35)
          .to(fades, { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power3.out" }, 0.8);

      // mouse parallax on the cover
      const px = gsap.quickTo(img, "x", { duration: 1.2, ease: "power3" });
      const py = gsap.quickTo(img, "y", { duration: 1.2, ease: "power3" });
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--fx", `${e.clientX - r.left}px`);
        el.style.setProperty("--fy", `${e.clientY - r.top}px`);
        px(((e.clientX - r.left) / r.width - 0.5) * -40);
        py(((e.clientY - r.top) / r.height - 0.5) * -24);
      };
      el.addEventListener("pointermove", move);

      // scrolling away pushes into the room and fades the title
      gsap.to("[data-scroll-img]", {
        scale: 1.25,
        yPercent: 12,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to("[data-content]", {
        yPercent: -30,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "70% top", scrub: true },
      });

      const off = onIntroDone(intro);
      return () => {
        off();
        el.removeEventListener("pointermove", move);
      };
    }, el);

    return () => {
      cancelAnimationFrame(raf);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={root}
      className="relative flex h-[100svh] min-h-[560px] items-end overflow-hidden"
      style={{ "--fx": "50%", "--fy": "45%" } as React.CSSProperties}
    >
      <div data-scroll-img className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          data-img
          src={coverImage}
          alt="The finished diorama: a derelict bathroom sealed with police tape, evidence markers 1–3 and a chalk outline on the tiles"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full scale-110 object-cover"
        />
      </div>

      <Dust className="absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_420px_at_var(--fx)_var(--fy),transparent_0%,rgba(5,6,8,0.5)_50%,rgba(5,6,8,0.92)_100%)]" />
      <div className="light-flicker pointer-events-none absolute inset-0 bg-black" />
      <div className="scanlines pointer-events-none absolute inset-0 opacity-40" />
      <div className="vignette pointer-events-none absolute inset-0" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background to-transparent" />

      {/* CCTV overlay */}
      <div className="pointer-events-none absolute inset-4 top-20 font-type text-[10px] uppercase tracking-[0.25em] text-foreground/70 sm:inset-8 sm:top-24 sm:text-xs">
        <span className="absolute left-0 top-0 h-6 w-6 border-l border-t border-foreground/40" />
        <span className="absolute right-0 top-0 h-6 w-6 border-r border-t border-foreground/40" />
        <span className="absolute bottom-0 left-0 h-6 w-6 border-b border-l border-foreground/40" />
        <span className="absolute bottom-0 right-0 h-6 w-6 border-b border-r border-foreground/40" />
        <div className="absolute left-4 top-3">CAM 03 · Bathroom 1F</div>
        <div className="absolute right-4 top-3 flex items-center gap-2">
          <span className="blink inline-block h-2 w-2 rounded-full bg-blood-bright" />
          REC <span ref={timecode} className="tabular-nums">03:17:00:00</span>
        </div>
      </div>

      <div data-content className="relative mx-auto w-full max-w-7xl px-4 pb-20 sm:px-8 sm:pb-28">
        <p data-fade className="mb-5 flex items-center gap-3 font-type text-[10px] uppercase tracking-[0.35em] text-tape sm:text-xs">
          <span className="h-px w-10 bg-tape" />
          Case file {project.caseNo} · Scene sealed
        </p>
        <h1
          data-text={project.title.toUpperCase()}
          className="glitch font-display text-[clamp(4.2rem,15vw,13rem)] leading-[0.82] tracking-wide"
        >
          <span className="sr-only">{project.title}</span>
          <span aria-hidden className="block overflow-hidden pb-2">
            {project.title.toUpperCase().split("").map((c, i) => (
              <span key={i} data-letter className="inline-block whitespace-pre">
                {c}
              </span>
            ))}
          </span>
        </h1>
        <div className="mt-6 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <p data-fade className="max-w-md text-base text-foreground/75 sm:text-lg">
            {project.tagline}
          </p>
          <div data-fade className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => scrollToId("film")}
              data-cursor="PLAY"
              className="group relative overflow-hidden bg-blood px-7 py-4 font-type text-xs uppercase tracking-[0.25em] text-white"
            >
              <span className="absolute inset-0 -translate-x-full bg-blood-bright transition-transform duration-500 group-hover:translate-x-0" />
              <span className="relative">▶ Watch the film</span>
            </button>
            <button
              type="button"
              onClick={() => scrollToId("scene")}
              data-cursor="ENTER"
              className="border border-foreground/30 px-7 py-4 font-type text-xs uppercase tracking-[0.25em] backdrop-blur transition hover:border-tape hover:text-tape"
            >
              Investigate the scene
            </button>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-type text-[10px] uppercase tracking-[0.35em] text-muted sm:flex">
        Scroll
        <span className="relative h-12 w-px overflow-hidden bg-line">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_1.8s_ease-in-out_infinite] bg-blood-bright" />
        </span>
      </div>
    </section>
  );
}
