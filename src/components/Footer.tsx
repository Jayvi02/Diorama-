"use client";

import { useEffect, useRef } from "react";
import { project } from "@/data/site";
import { gsap, prefersReducedMotion, scrollToId } from "@/lib/motion";
import Cobweb, { HangingSpider } from "./Cobweb";
import TypeTitle from "./TypeTitle";

// Closing title card.
export default function Footer() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-end]", {
        opacity: 0,
        filter: "blur(16px)",
        duration: 2,
        ease: "power2.out",
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <footer ref={root} className="relative overflow-hidden pt-32">
      <Cobweb corner="tl" seed={88} size={300} opacity={0.45} className="left-0 top-0" />
      <Cobweb corner="tr" seed={93} size={240} opacity={0.4} className="right-0 top-0" />
      <HangingSpider className="left-[38%] top-0 [--thread:120px]" />

      <div className="relative mx-auto max-w-7xl px-5 text-center sm:px-10">
        <p className="font-type text-sm text-muted">— end of file —</p>
        <div data-end className="mt-6">
          <p className="font-type text-[clamp(2.6rem,10vw,8rem)] leading-none">
            <TypeTitle text={project.title} />
          </p>
        </div>
        <div className="mt-4 flex items-center justify-center gap-4">
          <span className="rough-line w-12 sm:w-24" />
          <p className="spaced font-type text-xl lowercase sm:text-3xl">diorama</p>
          <span className="rough-line w-12 sm:w-24" />
        </div>

        <div className="relative mt-24 flex flex-col items-center gap-6 py-10 text-sm text-muted sm:flex-row sm:justify-between sm:text-left">
          <span className="rough-line absolute inset-x-0 top-0" />
          <div>
            <p className="text-base text-foreground/80">{project.module}</p>
            <p className="mt-1 font-type text-xs">
              {project.institution} · {project.year}
            </p>
          </div>
          <button type="button" onClick={() => scrollToId("top")} className="brush-btn text-sm">
            Back to the beginning
          </button>
        </div>
      </div>
    </footer>
  );
}
