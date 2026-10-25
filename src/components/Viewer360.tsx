"use client";

import { useEffect, useRef, useState } from "react";
import { loadTikslus } from "@/lib/loadTikslus";

type Props = {
  id: string;
  imageDir: string;
  imageExt: string;
  frames: number;
};

// React wrapper around the tikslus360 plugin from the lecture sample.
// The plugin is only started once the viewer scrolls into view, so the
// frames for all three objects are not downloaded on first page load.
export default function Viewer360({ id, imageDir, imageExt, frames }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"idle" | "loading" | "ready" | "error">("idle");

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let cancelled = false;

    const start = async () => {
      setState("loading");
      try {
        const $ = await loadTikslus();
        if (cancelled) return;
        // The plugin owns this element, so React never renders inside it.
        const host = document.createElement("div");
        host.className = "viewer360-host";
        host.innerHTML = '<a href="#" class="autorotate">Auto rotate</a>';
        mount.replaceChildren(host);
        $(host).tikslus360({
          imageDir,
          imageCount: frames,
          imageExt,
          canvasID: `canvas-${id}`,
          canvasWidth: 960,
          canvasHeight: 960,
          autoRotate: true,
        });
        setState("ready");
      } catch {
        setState("error");
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          start();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(mount);

    return () => {
      cancelled = true;
      io.disconnect();
      mount.replaceChildren();
    };
  }, [id, imageDir, imageExt, frames]);

  return (
    <div className="relative aspect-square w-full overflow-hidden bg-[radial-gradient(circle_at_50%_40%,#1b2230_0%,#07090d_75%)]">
      <div ref={mountRef} className="absolute inset-0" />
      {state !== "ready" && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center font-type text-xs uppercase tracking-[0.2em] text-muted">
          {state === "error" ? "Could not load 360° viewer" : "Loading frames…"}
        </div>
      )}
    </div>
  );
}
