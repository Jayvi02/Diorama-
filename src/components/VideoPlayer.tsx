"use client";

import { useRef, useState } from "react";
import type { VideoItem } from "@/data/site";

export default function VideoPlayer({ video }: { video: VideoItem }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const pending = !video.src;

  const play = () => {
    setStarted(true);
    ref.current?.play();
  };

  return (
    <div className="group relative aspect-video w-full overflow-hidden bg-black">
      {pending ? (
        <>
          {video.poster && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={video.poster} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20 grayscale" />
          )}
          <div className="grain-static absolute inset-0 opacity-25 mix-blend-screen" />
          <div className="vignette absolute inset-0" />
          <div className="absolute inset-0 grid place-items-center p-6 text-center">
            <div>
              <p className="eroded font-display text-5xl font-black uppercase sm:text-7xl">No signal</p>
              <div className="rough-line mx-auto mt-3 w-40" />
              <p className="mt-3 font-type text-sm text-muted">tape awaiting upload from the editing bay</p>
            </div>
          </div>
        </>
      ) : (
        <>
          <video
            ref={ref}
            src={video.src}
            poster={video.poster}
            controls={started}
            playsInline
            preload="metadata"
            className="h-full w-full object-contain"
          />
          {!started && (
            <button
              type="button"
              onClick={play}
              aria-label={`Play ${video.title}`}
              className="absolute inset-0 grid place-items-center bg-black/40 transition duration-700 hover:bg-black/20"
            >
              <span className="brush-btn">▶ Play</span>
            </button>
          )}
        </>
      )}

      {!started && (
        <div className="pointer-events-none absolute inset-0 font-type text-xs text-foreground/70 sm:text-sm">
          <span className="absolute left-4 top-3 sm:left-6 sm:top-5">{video.label}</span>
          {video.duration && <span className="absolute right-4 top-3 sm:right-6 sm:top-5">{video.duration}</span>}
        </div>
      )}
    </div>
  );
}
