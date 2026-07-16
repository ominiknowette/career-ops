export function HeroGlow() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-brand/45" />
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(90deg, transparent 0, transparent 31px, var(--border) 32px), linear-gradient(180deg, transparent 0, transparent 31px, var(--border) 32px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "linear-gradient(180deg, color-mix(in srgb, var(--color-brand) 10%, transparent), transparent 42%)",
        }}
      />
    </div>
  );
}
