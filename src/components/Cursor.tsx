"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/motion";

// Crosshair cursor for mouse users. Elements with data-cursor="LABEL" grow the ring and show the label.
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const d = dot.current!;
    const r = ring.current!;
    const l = label.current!;
    document.documentElement.classList.add("has-cursor");
    gsap.set([d, r], { xPercent: -50, yPercent: -50, opacity: 1 });

    const dx = gsap.quickTo(d, "x", { duration: 0.08 });
    const dy = gsap.quickTo(d, "y", { duration: 0.08 });
    const rx = gsap.quickTo(r, "x", { duration: 0.45, ease: "power3" });
    const ry = gsap.quickTo(r, "y", { duration: 0.45, ease: "power3" });

    const move = (e: PointerEvent) => {
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };

    const over = (e: PointerEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor], a, button, canvas");
      const text = t?.dataset.cursor ?? (t?.tagName === "CANVAS" ? "DRAG" : "");
      l.textContent = text;
      gsap.to(r, {
        width: t ? (text ? 96 : 56) : 36,
        height: t ? (text ? 96 : 56) : 36,
        borderColor: t ? "rgba(242,194,48,0.9)" : "rgba(232,227,214,0.5)",
        backgroundColor: text ? "rgba(242,194,48,0.12)" : "rgba(0,0,0,0)",
        duration: 0.3,
      });
      gsap.to(l, { opacity: text ? 1 : 0, duration: 0.2 });
    };

    const down = () => gsap.to(r, { scale: 0.8, duration: 0.15 });
    const up = () => gsap.to(r, { scale: 1, duration: 0.3 });
    const leave = () => gsap.to([d, r], { opacity: 0, duration: 0.2 });
    const enter = () => gsap.to([d, r], { opacity: 1, duration: 0.2 });

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.addEventListener("pointerleave", leave);
    document.addEventListener("pointerenter", enter);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.removeEventListener("pointerleave", leave);
      document.removeEventListener("pointerenter", enter);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[95] hidden [@media(pointer:fine)]:block">
      <div ref={dot} className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-blood-bright opacity-0" />
      <div
        ref={ring}
        className="fixed left-0 top-0 grid h-9 w-9 place-items-center rounded-full border border-foreground/50 opacity-0"
      >
        <span ref={label} className="font-type text-[9px] uppercase tracking-[0.2em] text-tape opacity-0" />
      </div>
    </div>
  );
}
