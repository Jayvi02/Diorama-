export default function Tape({ text, reverse = false, className = "" }: { text: string; reverse?: boolean; className?: string }) {
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
