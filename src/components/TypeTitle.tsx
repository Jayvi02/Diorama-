"use client";

import { useEffect, useState } from "react";

// Typewriter title whose letters keep flipping between capitals and lowercase,
// with a faint double-strike ghost on the letter as it changes
// (the "gamEplaY" title treatment from the Resident Evil Requiem site).
export default function TypeTitle({ text, className = "" }: { text: string; className?: string }) {
  const letters = text.split("");
  const [upper, setUpper] = useState(() => letters.map((c) => c !== c.toLowerCase()));
  const [ghost, setGhost] = useState<number[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const base = letters.map((c) => c !== c.toLowerCase());
    const flippable = letters.map((c, i) => (c.toLowerCase() !== c.toUpperCase() ? i : -1)).filter((i) => i >= 0);

    const timer = window.setInterval(() => {
      if (Math.random() < 0.3) {
        setGhost([]);
        return;
      }
      const picks = Array.from({ length: Math.random() < 0.6 ? 1 : 2 }, () => flippable[Math.floor(Math.random() * flippable.length)]);
      setUpper((cur) => {
        const next = [...cur];
        for (const i of picks) next[i] = !next[i];
        // drift back towards the real spelling so the word stays readable
        const off = next.map((u, i) => (u !== base[i] ? i : -1)).filter((i) => i >= 0);
        if (off.length > 2 || Math.random() < 0.5) {
          const i = off[Math.floor(Math.random() * off.length)];
          if (i !== undefined) next[i] = base[i];
        }
        return next;
      });
      setGhost(picks);
    }, 190);
    return () => clearInterval(timer);
    // letters are derived from text
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <span className={className} aria-label={text} role="text">
      {letters.map((c, i) => (
        <span key={i} aria-hidden className={`type-letter ${ghost.includes(i) ? "ghost" : ""}`}>
          {upper[i] ? c.toUpperCase() : c.toLowerCase()}
        </span>
      ))}
    </span>
  );
}
