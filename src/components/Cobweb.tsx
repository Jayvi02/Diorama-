// Procedural corner cobweb, aged and dusty rather than a neat Halloween web.
// Seeded so server and client render the same web.
// Drawn for the top-left corner of a 100×100 box, then mirrored for other corners.

type Corner = "tl" | "tr" | "bl" | "br";

type Strand = { d: string; o: number; w: number };

function rng(seed: number) {
  let a = seed * 9973;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const f = (n: number) => n.toFixed(2);

function buildWeb(seed: number) {
  const r = rng(seed);
  const between = (a: number, b: number) => a + r() * (b - a);
  const strands: Strand[] = [];
  const clumps: { x: number; y: number; s: number; o: number }[] = [];

  // Spokes at uneven angles; some stop short where the web has torn.
  const count = Math.floor(between(7, 11));
  const angles = Array.from({ length: count }, () => between(3, 87)).sort((a, b) => a - b);
  const spokes = angles.map((deg) => {
    const angle = (deg * Math.PI) / 180;
    const toEdge = Math.min(100 / Math.max(Math.cos(angle), 0.01), 100 / Math.max(Math.sin(angle), 0.01));
    const len = Math.min(toEdge, 130) * (r() < 0.25 ? between(0.35, 0.6) : between(0.7, 0.97));
    return { angle, len };
  });

  for (const { angle, len } of spokes) {
    const ex = Math.cos(angle) * len;
    const ey = Math.sin(angle) * len;
    // spokes sag a little under their own weight
    const cx = ex / 2 + between(-3, 3);
    const cy = ey / 2 + between(0, 4);
    strands.push({ d: `M0 0Q${f(cx)} ${f(cy)} ${f(ex)} ${f(ey)}`, o: between(0.35, 0.8), w: between(0.5, 0.9) });
  }

  // Capture threads: irregular rings, patchy and torn, with heavy uneven sag.
  let ring = between(5, 9);
  while (ring < 88) {
    const ringFade = between(0.15, 0.55);
    for (let i = 0; i < spokes.length - 1; i++) {
      const a = spokes[i];
      const b = spokes[i + 1];
      if (a.len < ring || b.len < ring) continue;
      if (r() < 0.3) continue; // missing
      const ra = ring * between(0.9, 1.1);
      const rb = ring * between(0.9, 1.1);
      const ax = Math.cos(a.angle) * ra;
      const ay = Math.sin(a.angle) * ra;
      const bx = Math.cos(b.angle) * rb;
      const by = Math.sin(b.angle) * rb;
      const sag = between(0.05, 0.3);
      const mx = ((ax + bx) / 2) * (1 - sag) + between(-1, 1);
      const my = ((ay + by) / 2) * (1 - sag) + between(0, 3);
      if (r() < 0.12) {
        // snapped: one end hangs loose
        strands.push({
          d: `M${f(ax)} ${f(ay)}q${f(between(-2, 2))} ${f(between(4, 8))} ${f(between(-4, 4))} ${f(between(8, 18))}`,
          o: ringFade * 0.8,
          w: 0.4,
        });
        continue;
      }
      strands.push({ d: `M${f(ax)} ${f(ay)}Q${f(mx)} ${f(my)} ${f(bx)} ${f(by)}`, o: ringFade, w: between(0.35, 0.6) });
      if (r() < 0.08) clumps.push({ x: (ax + bx) / 2, y: (ay + by) / 2 + 1, s: between(0.5, 1.6), o: between(0.2, 0.5) });
    }
    ring += between(4, 9) + ring * 0.08;
  }

  // Old tangled "sheet" silk filling the corner: random criss-crossing wisps.
  const wisps = Math.floor(between(28, 45));
  for (let i = 0; i < wisps; i++) {
    const d1 = between(2, 55);
    const d2 = between(10, 75);
    const a1 = between(0, Math.PI / 2);
    const a2 = between(0, Math.PI / 2);
    const x1 = Math.cos(a1) * d1;
    const y1 = Math.sin(a1) * d1;
    const x2 = Math.cos(a2) * d2;
    const y2 = Math.sin(a2) * d2;
    strands.push({
      d: `M${f(x1)} ${f(y1)}Q${f((x1 + x2) / 2 + between(-4, 4))} ${f((y1 + y2) / 2 + between(0, 6))} ${f(x2)} ${f(y2)}`,
      o: between(0.06, 0.22),
      w: between(0.3, 0.5),
    });
  }

  // Long drooping strands and a couple of threads anchoring out to the walls.
  for (let i = 0; i < 3; i++) {
    const a = spokes[Math.floor(between(0, spokes.length))];
    const b = spokes[Math.floor(between(0, spokes.length))];
    const ra = Math.min(a.len, b.len) * between(0.5, 0.9);
    const ax = Math.cos(a.angle) * ra;
    const ay = Math.sin(a.angle) * ra;
    const bx = Math.cos(b.angle) * ra * between(0.8, 1.1);
    const by = Math.sin(b.angle) * ra * between(0.8, 1.1);
    strands.push({
      d: `M${f(ax)} ${f(ay)}Q${f((ax + bx) / 2 + between(4, 14))} ${f((ay + by) / 2 + between(8, 20))} ${f(bx)} ${f(by)}`,
      o: between(0.2, 0.45),
      w: 0.45,
    });
  }

  // dust caught near the corner where silk is thickest
  for (let i = 0; i < 6; i++) {
    const d = between(2, 22);
    const a = between(0, Math.PI / 2);
    clumps.push({ x: Math.cos(a) * d, y: Math.sin(a) * d, s: between(0.8, 2.4), o: between(0.08, 0.25) });
  }

  return { strands, clumps };
}

const flips: Record<Corner, string> = {
  tl: "",
  tr: "translate(100 0) scale(-1 1)",
  bl: "translate(0 100) scale(1 -1)",
  br: "translate(100 100) scale(-1 -1)",
};

const origins: Record<Corner, string> = {
  tl: "top left",
  tr: "top right",
  bl: "bottom left",
  br: "bottom right",
};

export default function Cobweb({
  corner = "tl",
  seed = 1,
  size = 260,
  opacity = 0.55,
  className = "",
}: {
  corner?: Corner;
  seed?: number;
  size?: number;
  opacity?: number;
  className?: string;
}) {
  const web = buildWeb(seed);
  const blurId = `web-blur-${seed}`;
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={`cobweb pointer-events-none ${className}`}
      style={{ opacity, transformOrigin: origins[corner], animationDelay: `${-seed * 1.3}s` }}
    >
      <defs>
        <filter id={blurId} x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="0.6" />
        </filter>
      </defs>
      <g transform={flips[corner]} fill="none" stroke="#dcd9cd" strokeLinecap="round">
        {web.strands.map((s, i) => (
          <path key={i} d={s.d} strokeOpacity={f(s.o)} strokeWidth={f(s.w)} vectorEffect="non-scaling-stroke" />
        ))}
        <g fill="#cfcbbe" stroke="none" filter={`url(#${blurId})`}>
          {web.clumps.map((c, i) => (
            <circle key={i} cx={f(c.x)} cy={f(c.y)} r={f(c.s)} opacity={f(c.o)} />
          ))}
        </g>
      </g>
    </svg>
  );
}

// A small spider slowly lowering itself on a thread, then climbing back up.
export function HangingSpider({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`spider pointer-events-none ${className}`}>
      <span className="spider-thread" />
      <svg viewBox="0 0 40 40" className="spider-body h-7 w-7">
        <g stroke="#1c1916" strokeWidth="1.3" fill="none" strokeLinecap="round">
          <path d="M17 18 L9 12 L4 14 M17 20 L7 19 L2 23 M17 22 L8 26 L5 32 M18 23 L12 30 L11 36" />
          <path d="M23 18 L31 12 L36 14 M23 20 L33 19 L38 23 M23 22 L32 26 L35 32 M22 23 L28 30 L29 36" />
        </g>
        <ellipse cx="20" cy="23" rx="4.5" ry="5.5" fill="#1c1916" />
        <circle cx="20" cy="16.5" r="3" fill="#1c1916" />
        <ellipse cx="20" cy="22" rx="1.4" ry="2" fill="#5a0d10" />
      </svg>
    </div>
  );
}
