"use client";

import { useEffect, useRef, useState } from "react";
import { evidence } from "@/data/site";
import { gsap, SELECT_EVIDENCE } from "@/lib/motion";
import Scramble from "./Scramble";
import Viewer360 from "./Viewer360";

const EMPTY_SLOTS = 3;

// Survival-horror style inventory: pick an item, examine it in 360°.
export default function Evidence() {
  const root = useRef<HTMLElement>(null);
  const info = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState(evidence[0].marker);
  // Viewers stay mounted once opened so switching back doesn't reload their frames.
  const [opened, setOpened] = useState<number[]>([evidence[0].marker]);
  const inView = useRef(false);

  const select = (marker: number) => {
    setSelected(marker);
    setOpened((o) => (o.includes(marker) ? o : [...o, marker]));
  };

  useEffect(() => {
    const onSelect = (e: Event) => select((e as CustomEvent<number>).detail);
    window.addEventListener(SELECT_EVIDENCE, onSelect);

    const io = new IntersectionObserver(([e]) => (inView.current = e.isIntersecting), { threshold: 0.3 });
    if (root.current) io.observe(root.current);

    const onKey = (e: KeyboardEvent) => {
      if (!inView.current || (e.key !== "ArrowRight" && e.key !== "ArrowLeft")) return;
      setSelected((cur) => {
        const i = evidence.findIndex((x) => x.marker === cur);
        const next = evidence[(i + (e.key === "ArrowRight" ? 1 : evidence.length - 1)) % evidence.length].marker;
        setOpened((o) => (o.includes(next) ? o : [...o, next]));
        return next;
      });
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener(SELECT_EVIDENCE, onSelect);
      window.removeEventListener("keydown", onKey);
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!info.current) return;
    gsap.fromTo(
      info.current.children,
      { opacity: 0, x: 24 },
      { opacity: 1, x: 0, duration: 0.6, stagger: 0.06, ease: "power3.out" },
    );
  }, [selected]);

  const item = evidence.find((e) => e.marker === selected)!;
  const index = evidence.indexOf(item);

  return (
    <section id="evidence" ref={root} className="relative overflow-hidden border-y border-line bg-surface/50 py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,rgba(179,18,27,0.12),transparent_60%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-8">
        <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="mb-4 flex items-center gap-3 font-type text-[10px] uppercase tracking-[0.35em] text-blood-bright sm:text-xs">
              <span className="h-px w-10 bg-blood-bright" />
              03 · Evidence room
            </p>
            <Scramble as="h2" text="EXAMINE THE EVIDENCE" className="block font-display text-5xl tracking-wide sm:text-7xl" />
          </div>
          <p className="max-w-sm font-type text-xs leading-relaxed text-muted">
            Move across an object to turn it · hold to magnify
            <span className="hidden sm:inline"> · use ◀ ▶ keys to switch items</span>.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Examine panel */}
          <div className="lg:col-span-7">
            <div className="relative border border-line bg-background">
              <div className="flex items-center justify-between border-b border-line px-4 py-2.5 font-type text-[10px] uppercase tracking-[0.3em] text-muted">
                <span className="text-tape">▣ Examine</span>
                <span>
                  Item {String(index + 1).padStart(2, "0")} / {String(evidence.length).padStart(2, "0")}
                </span>
              </div>
              <div className="relative">
                {evidence
                  .filter((e) => opened.includes(e.marker))
                  .map((e) => (
                    <div key={e.marker} hidden={e.marker !== selected}>
                      <Viewer360 id={`evidence-${e.marker}`} imageDir={e.imageDir} imageExt={e.imageExt} frames={e.frames} />
                    </div>
                  ))}
                {[
                  "left-3 top-3 border-l border-t",
                  "right-3 top-3 border-r border-t",
                  "bottom-3 left-3 border-b border-l",
                  "bottom-3 right-3 border-b border-r",
                ].map((c) => (
                  <span key={c} className={`pointer-events-none absolute h-8 w-8 border-tape/70 ${c}`} />
                ))}
                {item.placeholder && (
                  <span className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 border border-blood-bright/60 bg-black/70 px-3 py-1 font-type text-[10px] uppercase tracking-[0.25em] text-red-300">
                    Sample frames · real capture pending
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Item file + slots */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            <div ref={info} key={selected} className="border border-line bg-background/60 p-6">
              <p className="font-type text-[10px] uppercase tracking-[0.35em] text-blood-bright">
                File 0{item.marker} · Logged
              </p>
              <h3 className="mt-2 font-display text-5xl tracking-wide sm:text-6xl">{item.name}</h3>
              <p className="mt-3 leading-relaxed text-foreground/70">{item.description}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {item.details.map((d) => (
                  <li key={d} className="border border-line px-3 py-1 font-type text-[11px] uppercase tracking-wider text-foreground/70">
                    {d}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {evidence.map((e) => {
                const on = e.marker === selected;
                return (
                  <button
                    key={e.marker}
                    type="button"
                    onClick={() => select(e.marker)}
                    aria-pressed={on}
                    data-cursor="SELECT"
                    className={`group relative aspect-square overflow-hidden border bg-black/60 transition ${
                      on ? "slot-active border-tape" : "border-line hover:border-foreground/40"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`${e.imageDir}/1.${e.imageExt}`}
                      alt=""
                      loading="lazy"
                      className={`absolute inset-0 h-full w-full object-contain p-3 transition duration-500 ${
                        on ? "scale-105 opacity-100" : "opacity-40 grayscale group-hover:opacity-70"
                      }`}
                    />
                    <span className="absolute left-2 top-2 font-type text-[10px] text-tape">0{e.marker}</span>
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent px-2 pb-2 pt-6 text-left font-display text-sm tracking-wider sm:text-base">
                      {e.name.replace("The ", "")}
                    </span>
                  </button>
                );
              })}
              {Array.from({ length: EMPTY_SLOTS }, (_, i) => (
                <div
                  key={i}
                  aria-hidden
                  className="grid aspect-square place-items-center border border-dashed border-line/70 font-type text-[10px] uppercase tracking-[0.25em] text-line"
                >
                  Empty
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
