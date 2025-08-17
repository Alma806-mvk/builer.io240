import heroBg from "@/assets/hero-gradient.jpg";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";

const Hero = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty("--spot-x", `${x}%`);
      el.style.setProperty("--spot-y", `${y}%`);
    };
    const onLeave = () => {
      el.style.setProperty("--spot-x", `50%`);
      el.style.setProperty("--spot-y", `-10%`);
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    onLeave();
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <section ref={ref} className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img src={heroBg} alt="CreateGen Studio gradient background" className="h-full w-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/30 to-background" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(600px 300px at var(--spot-x) var(--spot-y), hsl(var(--brand-2) / 0.18), transparent 60%)",
          }}
        />
      </div>

      <div className="container mx-auto py-20 md:py-28 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/50 px-3 py-1 text-xs text-muted-foreground backdrop-blur animate-fade-in" style={{ animationDelay: "0ms" }}>
            Your Confident Co‑Pilot
          </p>
          <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-6xl animate-fade-in" style={{ animationDelay: "100ms" }}>
            CreateGen Studio — the AI command center for creators
          </h1>
          <p className="mt-5 text-balance text-lg text-muted-foreground md:text-xl animate-fade-in" style={{ animationDelay: "200ms" }}>
            Strategy, generation, canvas, and planning — unified into one intelligent workspace so you can create more and stress less.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row animate-fade-in" style={{ animationDelay: "300ms" }}>
            <Button variant="gradient" size="lg">Start free</Button>
            <a href="#pricing"><Button variant="outline" size="lg">See pricing</Button></a>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">No credit card required</p>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-6 opacity-90 sm:grid-cols-4 animate-fade-in" style={{ animationDelay: "400ms" }}>
          {[
            "Trusted by creators",
            "Built for speed",
            "Privacy-first",
            "Made for teams",
          ].map((item) => (
            <div key={item} className="rounded-md border border-border/50 bg-background/40 p-3 text-center text-xs text-muted-foreground backdrop-blur transition-transform duration-200 hover:scale-105 shadow-elevated hover:shadow-glow">
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
