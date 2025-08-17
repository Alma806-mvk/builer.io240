import { AlertCircle, CheckCircle2 } from "lucide-react";

const problems = [
  "Endless tabs, docs, and tools that don't talk to each other",
  "Ideas scattered across notes with no clear next step",
  "Inconsistent brand visuals and last‑minute content scramble",
];

const solutions = [
  "One unified workspace—insights, creation, canvas, and planning",
  "AI-powered generation with strategy baked into every step",
  "Operational clarity: calendars, assets, and history all connected",
];

const ProblemSolution = () => (
  <section id="problem-solution" className="py-20 md:py-28">
    <div className="container">
      <header className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight animate-fade-in">From chaos to command</h2>
        <p
          className="mt-3 text-muted-foreground animate-fade-in"
          style={{ animationDelay: "100ms" }}
        >
          Leave the disconnected past behind. Move into a seamless mission control.
        </p>
      </header>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <article
          className="rounded-xl border border-destructive/30 bg-background/60 p-6 backdrop-blur animate-fade-in"
          style={{ animationDelay: "150ms" }}
        >
          <h3 className="text-lg font-medium">The old way</h3>
          <ul className="mt-4 space-y-3">
            {problems.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 text-destructive" size={18} aria-hidden />
                <span className="text-sm text-muted-foreground">{p}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="relative rounded-xl p-[1px] bg-gradient-primary animate-fade-in" style={{ animationDelay: "200ms" }}>
          <div className="rounded-[inherit] border border-border bg-background/70 p-6 backdrop-blur">
            <h3 className="text-lg font-medium">The new way</h3>
            <ul className="mt-4 space-y-3">
              {solutions.map((s) => (
                <li key={s} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 text-primary" size={18} aria-hidden />
                  <span className="text-sm text-muted-foreground">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </article>
      </div>
    </div>
  </section>
);

export default ProblemSolution;
