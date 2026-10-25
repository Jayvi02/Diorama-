"use client";

import { useEffect, useRef } from "react";
import { project, team } from "@/data/site";
import { gsap, prefersReducedMotion } from "@/lib/motion";
import Cobweb from "./Cobweb";
import Heading from "./Heading";

const tilts = [-2.2, 1.4, -1];

// Personnel files: typed on aged paper, like the documents you pick up in the games.
export default function Team() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-file]", {
        y: 120,
        opacity: 0,
        rotate: 0,
        duration: 1.3,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-files]", start: "top 80%" },
      });
      gsap.from("[data-stamp]", {
        scale: 2.6,
        opacity: 0,
        duration: 0.3,
        stagger: 0.2,
        delay: 1.1,
        ease: "power4.in",
        scrollTrigger: { trigger: "[data-files]", start: "top 80%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="team" ref={root} className="relative mx-auto max-w-7xl px-5 py-28 sm:px-10">
      <Cobweb corner="tr" seed={71} size={260} opacity={0.4} className="right-0 top-0" />
      <Heading label="File 06 - Personnel" title="Investigators on file" className="mb-16" />

      <div data-files className="grid gap-10 md:grid-cols-3 md:gap-8">
        {team.map((m, i) => (
          <article
            key={m.itNumber}
            data-file
            className="paper relative px-6 pb-8 pt-6"
            style={{ transform: `rotate(${tilts[i % tilts.length]}deg)` }}
          >
            {/* paper clip */}
            <span className="absolute -top-4 left-8 h-12 w-4 rounded-full border-2 border-[#8d8a80] border-b-transparent" />
            <div className="flex items-baseline justify-between border-b border-ink/40 pb-2 font-type text-xs">
              <span>Personnel file</span>
              <span>No. 0{i + 1}</span>
            </div>
            <dl className="mt-5 space-y-4 font-type">
              <div>
                <dt className="text-xs text-ink/60">Name</dt>
                <dd className="text-xl leading-tight">{m.name}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink/60">Student ID</dt>
                <dd className="text-xl tracking-wider">{m.itNumber}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink/60">Assigned case</dt>
                <dd className="text-base">
                  {project.caseNo} - {project.title}
                </dd>
              </div>
            </dl>
            <p className="mt-6 font-type text-[11px] leading-relaxed text-ink/70">
              {project.institution}
              <br />
              {project.year}
            </p>
            <span
              data-stamp
              className="stamp absolute bottom-6 right-5 -rotate-12 px-2 py-0.5 font-display text-2xl font-bold uppercase tracking-[0.15em]"
            >
              Cleared
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}
