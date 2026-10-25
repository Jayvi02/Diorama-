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
          {/* TV static */}
          <div className="grain-static absolute inset-0 opacity-30 mix-blend-screen" />
          <div className="scanlines absolute inset-0 opacity-60" />
          <div className="absolute inset-0 grid place-items-center p-6 text-center">
            <div>
              <p className="glitch font-display text-5xl tracking-[0.15em] sm:text-7xl" data-text="NO SIGNAL">
                NO SIGNAL
              </p>
              <p className="mt-3 font-type text-[10px] uppercase tracking-[0.3em] text-muted sm:text-xs">
                Tape awaiting upload from the editing bay
              </p>
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
              data-cursor="PLAY"
              className="absolute inset-0 grid place-items-center bg-black/30 transition hover:bg-black/10"
            >
              <span className="grid h-24 w-24 place-items-center rounded-full border border-white/30 bg-black/50 backdrop-blur transition duration-500 group-hover:scale-110 group-hover:border-blood-bright group-hover:bg-blood/60">
                <svg viewBox="0 0 24 24" className="ml-1 h-9 w-9 fill-foreground">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </button>
          )}
        </>
      )}

      {/* camcorder HUD */}
      {!started && (
        <div className="pointer-events-none absolute inset-0 p-4 font-type text-[10px] uppercase tracking-[0.25em] text-foreground/70 sm:p-6 sm:text-xs">
          <span className="absolute left-4 top-4 flex items-center gap-2 sm:left-6 sm:top-6">
            <span className={`inline-block h-2 w-2 rounded-full bg-blood-bright ${pending ? "" : "blink"}`} />
            {pending ? "STBY" : "PLAY"}
          </span>
          {video.duration && <span className="absolute right-4 top-4 sm:right-6 sm:top-6">{video.duration}</span>}
          <span className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6">{video.label}</span>
        </div>
      )}
    </div>
  );
}
