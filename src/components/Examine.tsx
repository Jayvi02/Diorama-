"use client";

import { diorama360 } from "@/data/site";
import Cobweb from "./Cobweb";
import Heading from "./Heading";
import Viewer360 from "./Viewer360";

const steps = [
  ["Turn", "Move across the diorama (or drag a finger) to turn it."],
  ["Magnify", "Click and hold to look closer at any detail."],
  ["Auto rotate", "Let the turntable spin on its own."],
];

// The single 360° turntable capture of the whole diorama.
export default function Examine() {
  return (
    <section id="examine" className="relative overflow-hidden py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_60%_45%,rgba(40,52,48,0.35),transparent_65%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 sm:px-10 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-4">
          <Heading label="File 03 - 360° turntable" title="Examine the diorama" />
          <ol className="mt-10 space-y-6">
            {steps.map(([t, d], i) => (
              <li key={t} className="flex gap-4">
                <span className="font-type text-sm text-muted">0{i + 1}</span>
                <div>
                  <p className="font-type text-base">{t}</p>
                  <p className="mt-1 text-sm leading-snug text-foreground/65">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="relative lg:col-span-8">
          <div className="relative bg-black">
            <Viewer360
              id="diorama"
              imageDir={diorama360.imageDir}
              imageExt={diorama360.imageExt}
              frames={diorama360.frames}
              width={diorama360.width}
              height={diorama360.height}
            />
            <div className="rough-frame pointer-events-none absolute -inset-2" />
            <div className="rough-frame pointer-events-none absolute -inset-4 opacity-40" />
            <Cobweb corner="tl" seed={21} size={170} opacity={0.6} className="-left-4 -top-4 hidden sm:block" />
            <Cobweb corner="tl" seed={21} size={90} opacity={0.55} className="-left-3 -top-3 sm:hidden" />
            <Cobweb corner="br" seed={34} size={130} opacity={0.45} className="-bottom-4 -right-4" />
          </div>
        </div>
      </div>
    </section>
  );
}
