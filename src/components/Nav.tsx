"use client";

import { useEffect, useRef, useState } from "react";
import { project } from "@/data/site";
import { createAmbient } from "@/lib/ambient";

const links = [
  { href: "#scene", label: "Scene" },
  { href: "#film", label: "Film" },
  { href: "#examine", label: "360° View" },
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
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color] duration-700 ${
        scrolled || open ? "bg-black/70 backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-10">
        <a href="#top" className="flex items-center gap-2 font-type text-lg leading-none">
          <span className="h-1.5 w-1.5 rounded-full bg-blood-bright" aria-hidden />
          {project.title}
        </a>

        <ul className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-link font-type text-sm text-foreground/75 [filter:drop-shadow(1px_1px_2px_rgba(0,0,0,0.8))] hover:text-foreground"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={toggleSound}
            aria-pressed={sound}
            className="flex items-center gap-2 font-type text-sm text-foreground/75 hover:text-foreground"
          >
            <span className="flex h-3 items-end gap-[2px]" aria-hidden>
              {[0.6, 1, 0.4, 0.8].map((h, i) => (
                <span
                  key={i}
                  className="w-px bg-current"
                  style={{
                    height: sound ? `${h * 100}%` : "25%",
                    animation: sound ? `blink ${0.5 + i * 0.17}s steps(2) infinite` : "none",
                  }}
                />
              ))}
            </span>
            <span className="hidden sm:inline">{sound ? "sound on" : "sound off"}</span>
          </button>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="grid h-10 w-10 place-items-center lg:hidden"
          >
            <span className="relative block h-3 w-6">
              <span className={`rough-line absolute left-0 w-6 opacity-100 transition ${open ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`rough-line absolute left-0 w-6 opacity-100 transition ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </nav>

      <div ref={bar} className="rough-line w-full origin-left scale-x-0 opacity-70" />

      {open && (
        <ul className="px-5 pb-6 pt-2 lg:hidden">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-2 font-display text-4xl font-semibold tracking-[-0.02em] text-foreground/90"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
