"use client";

import { useEffect, useRef, useState } from "react";
import { loadTikslus } from "@/lib/loadTikslus";

type Props = {
  id: string;
  imageDir: string;
  imageExt: string;
  frames: number;
  // Frame size in pixels; the canvas and the viewer keep this aspect ratio.
  width: number;
  height: number;
};

// React wrapper around the tikslus360 plugin from the lecture sample.
// The plugin is only started once the viewer scrolls into view, so the
// frames are not downloaded on first page load.
export default function Viewer360({ id, imageDir, imageExt, frames, width, height }: Props) {
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
        host.style.aspectRatio = `${width} / ${height}`;
        host.innerHTML = '<a href="#" class="autorotate">Auto rotate</a>';
        mount.replaceChildren(host);
        $(host).tikslus360({
          imageDir,
          imageCount: frames,
          imageExt,
          canvasID: `canvas-${id}`,
          canvasWidth: width,
          canvasHeight: height,
          // starts still; the "Auto rotate" button spins it
          autoRotate: false,
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
  }, [id, imageDir, imageExt, frames, width, height]);

  return (
    <div
      className="relative w-full overflow-hidden bg-[radial-gradient(circle_at_50%_40%,#22231f_0%,#0a0a09_75%)]"
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      <div ref={mountRef} className="absolute inset-0" />
      {state !== "ready" && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center font-type text-sm text-muted">
          {state === "error" ? "Could not load 360° viewer" : "Loading frames…"}
        </div>
      )}
    </div>
  );
}
