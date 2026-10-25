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
    <div className="group relative aspect-video w-full overflow-hidden rounded-2xl border border-line bg-black shadow-2xl shadow-black/60">
      {pending ? (
        <>
          {video.poster && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={video.poster} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25 blur-sm" />
          )}
          <div className="absolute inset-0 grid place-items-center p-6 text-center">
            <div>
              <div className="mx-auto mb-4 w-fit -rotate-2 bg-tape px-4 py-1 font-display text-xl tracking-widest text-black">
                Evidence pending
              </div>
              <p className="font-type text-sm text-muted">Footage awaiting upload from the editing bay.</p>
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
              className="absolute inset-0 grid place-items-center bg-black/30 transition hover:bg-black/10"
            >
              <span className="grid h-20 w-20 place-items-center rounded-full border border-white/30 bg-black/50 backdrop-blur transition group-hover:scale-110 group-hover:border-tape">
                <svg viewBox="0 0 24 24" className="ml-1 h-8 w-8 fill-foreground group-hover:fill-tape">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </button>
          )}
        </>
      )}
      {video.duration && (
        <span className="pointer-events-none absolute right-3 top-3 rounded-md bg-black/70 px-2 py-1 font-type text-xs text-foreground">
          {video.duration}
        </span>
      )}
    </div>
  );
}
