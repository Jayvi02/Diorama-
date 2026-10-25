"use client";

import { useEffect, useRef, useState } from "react";
import { project } from "@/data/site";
import { getLenis, gsap, markIntroDone, prefersReducedMotion } from "@/lib/motion";
import TypeTitle from "./TypeTitle";

// Title-card intro shown once per browser session. Click or press any key to skip.
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
    const q = gsap.utils.selector(el);
    const tl = gsap.timeline({ onComplete: finish });
    tl.from(q("[data-logo]"), { opacity: 0, filter: "blur(14px)", scale: 1.06, duration: 1.6, ease: "power2.out" }, 0.2)
      // bulb struggling to turn on
      .to(q("[data-logo]"), { opacity: 0.2, duration: 0.05 }, 0.9)
      .to(q("[data-logo]"), { opacity: 1, duration: 0.05 }, 0.97)
      .to(q("[data-logo]"), { opacity: 0.4, duration: 0.05 }, 1.1)
      .to(q("[data-logo]"), { opacity: 1, duration: 0.08 }, 1.18)
      .from(q("[data-rule]"), { scaleX: 0, duration: 1, ease: "power3.inOut", stagger: 0.1 }, 0.8)
      .from(q("[data-sub] span"), { opacity: 0, duration: 0.01, stagger: 0.09 }, 1.1)
      .to(q("[data-progress]"), { scaleX: 1, duration: 2.2, ease: "power1.inOut" }, 0.3)
      .from(q("[data-note]"), { opacity: 0, duration: 0.6 }, 1.4)
      .to(el, { opacity: 0, duration: 0.9, ease: "power2.in" }, 2.8);

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
    <div
      ref={root}
      className="fixed inset-0 z-[100] flex cursor-pointer select-none flex-col items-center justify-center bg-[#070707] px-6"
      aria-hidden
    >
      <div className="vignette absolute inset-0" />
      <div className="relative text-center">
        <div data-logo>
          <p className="font-type text-[clamp(2.6rem,9vw,6.5rem)] leading-none">
            <TypeTitle text={project.title} />
          </p>
        </div>
        <div className="mt-4 flex items-center justify-center gap-4">
          <span data-rule className="rough-line w-10 origin-right sm:w-20" />
          <p data-sub className="spaced font-type text-xl lowercase sm:text-3xl">
            {"diorama".split("").map((c, i) => (
              <span key={i}>{c}</span>
            ))}
          </p>
          <span data-rule className="rough-line w-10 origin-left sm:w-20" />
        </div>
      </div>

      <div className="absolute inset-x-6 bottom-10 mx-auto max-w-md sm:bottom-16">
        <p data-note className="mb-3 text-center font-type text-sm text-muted">Opening case file {project.caseNo}…</p>
        <div className="relative h-px">
          <div className="rough-line absolute inset-0 opacity-20" />
          <div data-progress className="rough-line absolute inset-0 origin-left scale-x-0 opacity-90" />
        </div>
      </div>
    </div>
  );
}
