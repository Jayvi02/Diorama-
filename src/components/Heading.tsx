"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/motion";

// Typewriter text: characters strike in one by one when scrolled into view (no layout shift).
export function Typed({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const chars = el.querySelectorAll("[data-c]");
    gsap.set(chars, { opacity: 0 });
    const tween = gsap.to(chars, {
      opacity: 1,
      duration: 0.01,
      stagger: 0.035,
      delay: delay / 1000,
      ease: "none",
      scrollTrigger: { trigger: el, start: "top 92%" },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [delay]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      {text.split("").map((c, i) => (
        <span key={i} data-c aria-hidden>
          {c}
        </span>
      ))}
    </span>
  );
}

// Section heading: typed label, worn condensed title, and a rough line that draws itself in.
export default function Heading({
  label,
  title,
  className = "",
}: {
  label: string;
  title: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-title]", {
        opacity: 0,
        filter: "blur(10px)",
        y: 20,
        duration: 1.4,
        ease: "power2.out",
        scrollTrigger: { trigger: ref.current, start: "top 85%" },
      });
      gsap.from("[data-rule]", {
        scaleX: 0,
        duration: 1.6,
        ease: "power3.inOut",
        scrollTrigger: { trigger: ref.current, start: "top 85%" },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className={className}>
      <Typed text={label} className="font-type text-sm text-muted sm:text-base" />
      {/* blur animates on the h2; the worn-edge filter lives on the inner span so they don't clash */}
      <h2 data-title className="mt-3 font-display text-6xl font-extrabold uppercase leading-[0.85] sm:text-8xl">
        <span className="eroded block">{title}</span>
      </h2>
      <div data-rule className="rough-line mt-6 w-full max-w-md origin-left" />
    </div>
  );
}
