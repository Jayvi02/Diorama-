import Hero from "@/components/Hero";
import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import VideoPlayer from "@/components/VideoPlayer";
import Viewer360 from "@/components/Viewer360";
import { evidence, gallery, process, project, team, videos } from "@/data/site";

function Tape({ text, reverse = false, className = "" }: { text: string; reverse?: boolean; className?: string }) {
  const items = Array.from({ length: 12 }, (_, i) => (
    <span key={i} className="flex shrink-0 items-center gap-6 px-3">
      {text}
      <span aria-hidden>■</span>
    </span>
  ));
  return (
    <div className={`tape overflow-hidden py-2 font-display text-lg tracking-[0.25em] sm:text-xl ${className}`} aria-hidden>
      <div className={`tape-track ${reverse ? "reverse" : ""}`}>
        {items}
        {items}
      </div>
    </div>
  );
}

function SectionHeader({ kicker, title, children }: { kicker: string; title: string; children?: React.ReactNode }) {
  return (
    <Reveal className="mb-12 max-w-2xl">
      <p className="mb-3 font-type text-xs uppercase tracking-[0.3em] text-tape">{kicker}</p>
      <h2 className="font-display text-5xl tracking-wide sm:text-6xl">{title}</h2>
      {children && <p className="mt-4 text-foreground/70">{children}</p>}
    </Reveal>
  );
}

function Marker({ n, className = "" }: { n: number; className?: string }) {
  return (
    <span
      className={`grid h-10 w-10 place-items-center bg-tape font-type text-lg text-black shadow-lg [clip-path:polygon(15%_0,85%_0,100%_100%,0_100%)] ${className}`}
    >
      {n}
    </span>
  );
}

export default function Home() {
  return (
    <main id="top" className="overflow-x-clip">
      <Nav />
      <Hero />

      <div className="relative z-10 -my-6 -rotate-2 sm:-my-8">
        <Tape text="Crime scene — do not cross" />
      </div>

      {/* Overview */}
      <section className="mx-auto max-w-6xl px-4 pt-28 pb-20 sm:px-6">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <Reveal>
            <p className="mb-3 font-type text-xs uppercase tracking-[0.3em] text-tape">Case summary</p>
            <h2 className="font-display text-5xl leading-none tracking-wide sm:text-6xl">
              A bathroom no one walked out of.
            </h2>
            <p className="mt-6 leading-relaxed text-foreground/75">{project.summary}</p>
            <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-line pt-6">
              {[
                ["3", "Main miniatures"],
                ["A4–A3", "Diorama scale"],
                ["360°", "Object views"],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="font-display text-3xl text-tape sm:text-4xl">{v}</dt>
                  <dd className="mt-1 text-xs text-muted">{l}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal delay={150} className="relative">
            <figure className="relative overflow-hidden rounded-2xl border border-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={gallery[0].src} alt={gallery[0].alt} className="aspect-[4/3] w-full object-cover" />
              <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 font-type text-xs text-foreground/80">
                Scene photograph · Markers 1–3 in place
              </figcaption>
            </figure>
            <div className="absolute -right-3 -top-3 rotate-6 bg-blood px-3 py-1 font-type text-xs uppercase tracking-widest text-white shadow-lg">
              Exhibit 01
            </div>
          </Reveal>
        </div>
      </section>

      {/* Final film */}
      <section id="film" className="border-y border-line bg-surface/60 py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeader kicker={`${videos.final.label} · Final cut`} title={videos.final.title}>
            {videos.final.description}
          </SectionHeader>
          <Reveal>
            <VideoPlayer video={videos.final} />
          </Reveal>
        </div>
      </section>

      {/* 360 evidence */}
      <section id="evidence" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <SectionHeader kicker="Evidence room · 360° object view" title="Inspect the evidence">
          Move your cursor (or drag a finger) across each object to turn it. Click and hold to magnify. Use the
          auto rotate button to spin it on its own.
        </SectionHeader>
        <div className="grid gap-6 md:grid-cols-3">
          {evidence.map((item, i) => (
            <Reveal key={item.marker} delay={i * 120}>
              <article className="group overflow-hidden rounded-2xl border border-line bg-surface transition hover:border-tape/60">
                <div className="relative">
                  <Viewer360
                    id={`evidence-${item.marker}`}
                    imageDir={item.imageDir}
                    imageExt={item.imageExt}
                    frames={item.frames}
                  />
                  <Marker n={item.marker} className="absolute left-3 top-3" />
                  {item.placeholder && (
                    <span className="absolute right-3 top-3 rounded-full border border-blood/60 bg-black/70 px-2 py-0.5 font-type text-[10px] uppercase tracking-widest text-red-300">
                      Sample frames
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <p className="font-type text-[11px] uppercase tracking-[0.25em] text-muted">
                    Evidence {String(item.marker).padStart(2, "0")}
                  </p>
                  <h3 className="mt-1 font-display text-3xl tracking-wide">{item.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/70">{item.description}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {item.details.map((d) => (
                      <li key={d} className="rounded-full border border-line px-3 py-1 text-xs text-foreground/70">
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <div className="rotate-1">
        <Tape text="Evidence — handle with care" reverse />
      </div>

      {/* Making of */}
      <section id="making" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="grid items-start gap-12 md:grid-cols-5">
          <div className="md:col-span-2">
            <SectionHeader kicker={`${videos.making.label} · Behind the scenes`} title={videos.making.title}>
              {videos.making.description}
            </SectionHeader>
          </div>
          <Reveal className="md:col-span-3">
            <VideoPlayer video={videos.making} />
          </Reveal>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="border-y border-line bg-surface/60 py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeader kicker="Investigation log" title="From sketch to screen" />
          <div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((p, i) => (
              <Reveal key={p.step} delay={(i % 4) * 100}>
                <div className="h-full rounded-2xl border border-line bg-background/60 p-6 transition hover:-translate-y-1 hover:border-tape/50">
                  <span className="font-type text-sm text-tape">{p.step}</span>
                  <h3 className="mt-3 font-display text-2xl tracking-wide">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/70">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <SectionHeader kicker="Investigators on file" title="The team" />
        <div className="grid gap-6 sm:grid-cols-3">
          {team.map((m, i) => (
            <Reveal key={i} delay={i * 120}>
              <div className="relative overflow-hidden rounded-2xl border border-line bg-surface p-6">
                <div className="absolute right-0 top-0 h-full w-1.5 bg-tape/80" />
                <p className="font-type text-[11px] uppercase tracking-[0.25em] text-muted">
                  Investigator {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 font-display text-3xl tracking-wide">{m.name}</h3>
                <p className="mt-1 font-type text-sm text-tape">{m.itNumber}</p>
                <p className="mt-4 text-sm text-foreground/70">{m.role}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            <span className="font-display text-lg tracking-wider text-foreground">{project.title}</span> ·{" "}
            {project.module}
          </p>
          <p className="font-type text-xs">
            {project.institution} · {project.year}
          </p>
        </div>
      </footer>
    </main>
  );
}
