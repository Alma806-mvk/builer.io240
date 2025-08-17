import { useEffect, useRef } from "react";

/**
 * Subtle radial gradient glow that follows the cursor.
 * Respects prefers-reduced-motion and relies on design tokens.
 */
export default function GlowField() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const onMove = (e: MouseEvent) => {
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      node.style.setProperty("--gx", `${x}px`);
      node.style.setProperty("--gy", `${y}px`);
    };

    if (!prefersReduced) window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(200px_200px_at_var(--gx)_var(--gy),#000,transparent_70%)]"
      style={{
        background:
          "radial-gradient(600px 600px at var(--gx) var(--gy), hsl(var(--accent-start) / 0.15), transparent 60%)",
      }}
    />
  );
}
