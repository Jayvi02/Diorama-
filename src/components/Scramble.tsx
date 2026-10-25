"use client";

import { useEffect, useRef } from "react";

const glyphs = "!<>-_\\/[]{}—=+*^?#░▒▓█";

// Text that "decrypts" from random glyphs the first time it scrolls into view.
export default function Scramble({
  text,
  className = "",
  as: Tag = "span",
  delay = 0,
}: {
  text: string;
  className?: string;
  as?: "span" | "p" | "h2" | "h3";
  delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let raf = 0;
    let timer = 0;
    const total = 28;

    const run = () => {
      frame = 0;
      const step = () => {
        const revealed = Math.floor((frame / total) * text.length);
        el.textContent = text
          .split("")
          .map((c, i) => (i < revealed || c === " " ? c : glyphs[Math.floor(Math.random() * glyphs.length)]))
          .join("");
        frame++;
        if (frame <= total) raf = requestAnimationFrame(step);
        else el.textContent = text;
      };
      step();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          io.disconnect();
          timer = window.setTimeout(run, delay);
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [text, delay]);

  return (
    <Tag ref={ref as never} className={className} aria-label={text}>
      {text}
    </Tag>
  );
}
