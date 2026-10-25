export default function Tape({ text, className = "" }: { text: string; className?: string }) {
  const items = Array.from({ length: 12 }, (_, i) => (
    <span key={i} className="flex shrink-0 items-center gap-6 px-4">
      {text}
      <span aria-hidden>-</span>
    </span>
  ));
  return (
    <div
      className={`tape overflow-hidden py-1.5 font-display text-lg font-bold uppercase tracking-[0.2em] sm:text-xl ${className}`}
      aria-hidden
    >
      <div className="tape-track">
        {items}
        {items}
      </div>
    </div>
  );
}
