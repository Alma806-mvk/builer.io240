import { useEffect } from "react";

type Props = { intensity?: number };

export const BackgroundGlow = ({ intensity = 0.12 }: Props) => {
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty("--mx", `${e.clientX}px`);
      document.documentElement.style.setProperty("--my", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
      style={{
        background:
          `radial-gradient(600px circle at var(--mx,50%) var(--my,50%), hsl(var(--brand-end) / ${intensity}), transparent 60%),` +
          `radial-gradient(500px circle at calc(var(--mx,50%) + 200px) calc(var(--my,50%) + 100px), hsl(var(--brand-start) / ${Math.max(
            intensity - 0.02,
            0
          )}), transparent 60%)`,
        filter: "blur(40px)",
      }}
    />
  );
};

export default BackgroundGlow;
