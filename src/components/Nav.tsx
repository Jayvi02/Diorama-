"use client";

import { useEffect, useRef, useState } from "react";
import { project } from "@/data/site";
import { createAmbient } from "@/lib/ambient";

const links = [
  { href: "#scene", label: "Scene" },
  { href: "#film", label: "Film" },
  { href: "#evidence", label: "Evidence" },
  { href: "#making", label: "Making Of" },
  { href: "#log", label: "Log" },
  { href: "#team", label: "Team" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [sound, setSound] = useState(false);
  const bar = useRef<HTMLDivElement>(null);
  const ambient = useRef<ReturnType<typeof createAmbient> | null>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      ambient.current?.close();
    };
  }, []);

  const toggleSound = async () => {
    ambient.current ??= createAmbient();
    await ambient.current.resume();
    ambient.current.fadeTo(sound ? 0 : 0.9);
    setSound(!sound);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled || open ? "bg-background/75 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="group flex items-center gap-3" data-cursor="TOP">
          <span className="grid h-8 w-8 place-items-center bg-blood font-display text-xl text-white transition group-hover:bg-blood-bright">
            {project.title.charAt(0)}
          </span>
          <span className="font-type text-xs uppercase tracking-[0.25em] text-foreground/80">{project.caseNo}</span>
        </a>

        <ul className="hidden items-center gap-7 lg:flex">
          {links.map((l, i) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="group relative font-type text-[11px] uppercase tracking-[0.2em] text-foreground/60 transition hover:text-foreground"
              >
                <span className="mr-1 text-blood-bright">0{i + 1}</span>
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-tape transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleSound}
            aria-pressed={sound}
            data-cursor={sound ? "MUTE" : "SOUND"}
            className="flex h-10 items-center gap-2 rounded-full border border-line px-3 font-type text-[10px] uppercase tracking-[0.2em] text-foreground/70 transition hover:border-tape hover:text-tape"
          >
            <span className="flex h-3 items-end gap-[2px]">
              {[0.6, 1, 0.4, 0.8].map((h, i) => (
                <span
                  key={i}
                  className="w-[2px] bg-current transition-all"
                  style={{
                    height: sound ? `${h * 100}%` : "20%",
                    animation: sound ? `blink ${0.5 + i * 0.17}s steps(2) infinite` : "none",
                  }}
                />
              ))}
            </span>
            <span className="hidden sm:inline">{sound ? "Sound on" : "Sound off"}</span>
          </button>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="grid h-10 w-10 place-items-center rounded-full border border-line lg:hidden"
          >
            <span className="relative block h-3 w-4">
              <span className={`absolute left-0 h-px w-4 bg-foreground transition ${open ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 h-px w-4 bg-foreground transition ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </nav>

      <div className="h-px w-full bg-transparent">
        <div ref={bar} className="h-px origin-left scale-x-0 bg-blood-bright shadow-[0_0_8px_#e3242b]" />
      </div>

      {open && (
        <ul className="border-t border-line px-4 py-4 lg:hidden">
          {links.map((l, i) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-baseline gap-3 py-3 font-display text-3xl tracking-wider text-foreground/90"
              >
                <span className="font-type text-xs text-blood-bright">0{i + 1}</span>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
