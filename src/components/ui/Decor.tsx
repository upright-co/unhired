/** Background decoration: faint grid + drifting glow orbs. Purely visual. */

export function GridBackground({ dark = false }: { dark?: boolean }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${dark ? "bg-grid-dark" : "bg-grid"}`}
    />
  );
}

type Orb = { color: "coral" | "violet"; className: string; slow?: boolean };

export function GlowOrbs({
  orbs,
  intensity = 1,
  fade = false,
}: {
  orbs: Orb[];
  intensity?: number;
  /** Fade out toward the bottom so orbs clipped by the section don't leave a hard edge. */
  fade?: boolean;
}) {
  const mask = fade ? "linear-gradient(to bottom, #000 55%, transparent 100%)" : undefined;
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ maskImage: mask, WebkitMaskImage: mask }}
    >
      {orbs.map((o, i) => (
        <div
          key={i}
          className={`absolute rounded-full blur-[90px] ${o.slow ? "animate-drift-slow" : "animate-drift"} ${o.className}`}
          style={{
            background: o.color === "coral" ? "#F65663" : "#9452F2",
            opacity: 0.28 * intensity,
          }}
        />
      ))}
    </div>
  );
}

export function StatusDot({ className = "" }: { className?: string }) {
  return <span aria-hidden className={`status-dot ${className}`} />;
}
