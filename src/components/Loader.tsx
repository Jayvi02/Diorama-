"use client";

import { useEffect, useRef, useState } from "react";
import { project } from "@/data/site";
import { getLenis, gsap, markIntroDone, prefersReducedMotion } from "@/lib/motion";

const lines = [
  `> ACCESSING CASE FILE ${project.caseNo}`,
  "> LOCATION: BATHROOM 1F — SCENE SEALED",
  "> EVIDENCE ITEMS LOGGED: 03",
  "> DECRYPTING SURVEILLANCE ARCHIVE",
];

// Terminal-style intro shown once per browser session. Click or press any key to skip.
export default function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    let seen = false;
    try {
      seen = sessionStorage.getItem("intro-seen") === "1";
      sessionStorage.setItem("intro-seen", "1");
    } catch {}

    const finish = () => {
      setVisible(false);
      getLenis()?.start();
      markIntroDone();
    };

    if (seen || prefersReducedMotion()) {
      finish();
      return;
    }

    getLenis()?.stop();
    const count = { v: 0 };
    const counter = el.querySelector<HTMLElement>("[data-count]")!;
    const bar = el.querySelector<HTMLElement>("[data-bar]")!;
    const rows = el.querySelectorAll<HTMLElement>("[data-line]");

    const tl = gsap.timeline({ onComplete: finish });
    tl.to(rows, { opacity: 1, duration: 0.05, stagger: 0.38 }, 0.15)
      .to(
        count,
        {
          v: 100,
          duration: 1.9,
          ease: "power2.inOut",
          onUpdate: () => {
            counter.textContent = String(Math.round(count.v)).padStart(3, "0");
            bar.style.transform = `scaleX(${count.v / 100})`;
          },
        },
        0.1,
      )
      // fluorescent tube kicking in
      .to(el, { opacity: 0.2, duration: 0.04 }, 2.15)
      .to(el, { opacity: 1, duration: 0.04 })
      .to(el, { opacity: 0.4, duration: 0.05 })
      .to(el, { opacity: 1, duration: 0.05 })
      .to(el.querySelector("[data-top]"), { yPercent: -100, duration: 0.9, ease: "expo.inOut" }, 2.45)
      .to(el.querySelector("[data-bottom]"), { yPercent: 100, duration: 0.9, ease: "expo.inOut" }, 2.45)
      .to(el.querySelector("[data-content]"), { opacity: 0, duration: 0.25 }, 2.4);

    const skip = () => tl.progress(1);
    window.addEventListener("keydown", skip, { once: true });
    el.addEventListener("click", skip, { once: true });
    return () => {
      window.removeEventListener("keydown", skip);
      tl.kill();
    };
  }, []);

  if (!visible) return null;

  return (
    <div ref={root} className="fixed inset-0 z-[100] cursor-pointer select-none" aria-hidden>
      <div data-top className="absolute inset-x-0 top-0 h-1/2 bg-[#030304]" />
      <div data-bottom className="absolute inset-x-0 bottom-0 h-1/2 bg-[#030304]" />
      <div data-content className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10">
        <div className="flex items-center justify-between font-type text-[10px] uppercase tracking-[0.3em] text-muted sm:text-xs">
          <span>
            <span className="blink mr-2 inline-block h-2 w-2 rounded-full bg-blood-bright align-middle" />
            REC
          </span>
          <span>{project.institution}</span>
        </div>

        <div className="mx-auto w-full max-w-xl font-type text-xs leading-relaxed text-foreground/80 sm:text-sm">
          {lines.map((l) => (
            <p key={l} data-line className="opacity-0">
              {l}
            </p>
          ))}
          <span className="blink text-tape">█</span>
        </div>

        <div>
          <div className="flex items-end justify-between">
            <span className="font-type text-[10px] uppercase tracking-[0.3em] text-muted sm:text-xs">
              Loading evidence
            </span>
            <span data-count className="font-display text-7xl leading-none text-foreground sm:text-9xl">
              000
            </span>
          </div>
          <div className="mt-4 h-px w-full bg-line">
            <div data-bar className="h-full origin-left scale-x-0 bg-blood-bright" />
          </div>
        </div>
      </div>
    </div>
  );
}
