"use client";

import { useEffect, useRef } from "react";
import { coverImage, project } from "@/data/site";
import { gsap, onIntroDone, prefersReducedMotion, scrollToId } from "@/lib/motion";
import Cobweb, { HangingSpider } from "./Cobweb";
import Dust from "./Dust";
import TypeTitle from "./TypeTitle";

const caseInfo = [
  { value: project.caseNo, label: "Case no." },
  { value: "Bathroom 1F", label: "Location" },
  { value: "Sealed", label: "Status" },
];

// Opening title card over the diorama photo, lit by a torch that follows the cursor.
export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current!;
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const img = el.querySelector("[data-img]");
      gsap.set(img, { scale: 1.3, opacity: 0 });
      gsap.set("[data-logo]", { opacity: 0, filter: "blur(12px)" });
      gsap.set("[data-fade]", { opacity: 0, y: 16 });
      gsap.set("[data-rule]", { scaleX: 0 });

      const intro = () =>
        gsap
          .timeline()
          .to(img, { scale: 1.1, opacity: 1, duration: 3, ease: "power2.out" })
          .to("[data-logo]", { opacity: 1, filter: "blur(0px)", duration: 1.8, ease: "power2.out" }, 0.4)
          .to("[data-rule]", { scaleX: 1, duration: 1.2, stagger: 0.08, ease: "power3.inOut" }, 0.9)
          .to("[data-fade]", { opacity: 1, y: 0, duration: 1.1, stagger: 0.12, ease: "power2.out" }, 1.1);

      const px = gsap.quickTo(img, "x", { duration: 1.6, ease: "power3" });
      const py = gsap.quickTo(img, "y", { duration: 1.6, ease: "power3" });
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--fx", `${e.clientX - r.left}px`);
        el.style.setProperty("--fy", `${e.clientY - r.top}px`);
        px(((e.clientX - r.left) / r.width - 0.5) * -30);
        py(((e.clientY - r.top) / r.height - 0.5) * -18);
      };
      el.addEventListener("pointermove", move);

      gsap.to("[data-scroll-img]", {
        scale: 1.2,
        yPercent: 10,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to("[data-content]", {
        opacity: 0,
        yPercent: -20,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "65% top", scrub: true },
      });

      const off = onIntroDone(intro);
      return () => {
        off();
        el.removeEventListener("pointermove", move);
      };
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative flex h-[100svh] min-h-[640px] items-center overflow-hidden"
      style={{ "--fx": "65%", "--fy": "40%" } as React.CSSProperties}
    >
      <div data-scroll-img className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          data-img
          src={coverImage}
          alt="The finished diorama: a derelict bathroom sealed with police tape, evidence markers 1–3 and a chalk outline on the tiles"
          fetchPriority="high"
          className="graded absolute inset-0 h-full w-full scale-110 object-cover"
        />
        <div className="tint absolute inset-0" />
      </div>

      <Dust className="absolute inset-0" />
      {/* torch: darkness everywhere except a tight beam that follows the cursor */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_340px_at_var(--fx)_var(--fy),transparent_0%,rgba(8,8,8,0.55)_45%,rgba(8,8,8,0.95)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_180px_at_var(--fx)_var(--fy),rgba(255,236,205,0.09),transparent_70%)] mix-blend-screen" />
      <div className="light-flicker pointer-events-none absolute inset-0 bg-black" />
      <div className="vignette pointer-events-none absolute inset-0" />
      <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-black/80 via-black/30 to-transparent md:w-2/3" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background to-transparent" />

      <Cobweb corner="tl" seed={3} size={360} opacity={0.5} className="left-0 top-0 hidden sm:block" />
      <Cobweb corner="tl" seed={3} size={200} opacity={0.45} className="left-0 top-0 sm:hidden" />
      <Cobweb corner="tr" seed={8} size={300} opacity={0.55} className="right-0 top-0 hidden sm:block" />
      <Cobweb corner="tr" seed={8} size={160} opacity={0.5} className="right-0 top-0 sm:hidden" />
      <HangingSpider className="right-[110px] top-0 hidden sm:flex [--thread:190px]" />

      <div data-content className="relative mx-auto w-full max-w-7xl px-5 pt-16 sm:px-10">
        <div className="max-w-2xl">
          <div data-logo className="relative">
            <span className="absolute -left-4 top-[0.15em] h-2 w-2 rounded-full bg-blood-bright sm:-left-6 sm:h-2.5 sm:w-2.5" aria-hidden />
            <h1 className="w-max whitespace-nowrap font-type text-[clamp(2.25rem,7.5vw,5.25rem)] leading-none">
              <TypeTitle text={project.title} />
            </h1>
          </div>
          <div className="mt-3 flex items-center gap-4">
            <span data-rule className="rough-line w-8 origin-right sm:w-14" />
            <p data-fade className="spaced font-type text-2xl lowercase sm:text-4xl">
              diorama
            </p>
            <span data-rule className="rough-line flex-1 origin-left" />
          </div>

          <p data-fade className="mt-8 max-w-md text-lg leading-snug text-foreground/80">
            {project.tagline}
          </p>

          {/* Case details, drawn as a rough table like the Requiem age gate */}
          <div data-fade className="relative mt-10 grid max-w-lg grid-cols-3">
            <span data-rule className="rough-line absolute inset-x-0 top-0 origin-left" />
            <span data-rule className="rough-line absolute inset-x-0 bottom-0 origin-left" />
            {caseInfo.map((c, i) => (
              <div key={c.label} className="relative px-3 py-4 text-center">
                {i > 0 && <span className="rough-line-v absolute bottom-2 left-0 top-2" />}
                <p className="font-type text-base text-foreground sm:text-xl">{c.value}</p>
                <p className="mt-1 font-type text-[11px] text-muted">{c.label}</p>
              </div>
            ))}
          </div>

          <div data-fade className="mt-10 flex flex-wrap items-center gap-8">
            <button type="button" onClick={() => scrollToId("film")} className="brush-btn">
              Watch the film
            </button>
            <button type="button" onClick={() => scrollToId("scene")} className="text-link text-sm text-foreground/80">
              Investigate the scene →
            </button>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-type text-xs text-muted sm:flex">
        scroll
        <span className="relative h-12 w-px overflow-hidden bg-line">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2.2s_ease-in-out_infinite] bg-foreground/70" />
        </span>
      </div>
    </section>
  );
}
