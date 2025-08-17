import { BrainCircuit, BarChart3, Sparkles, LayoutGrid, CalendarClock, MessageSquare } from "lucide-react";

const features = [
  {
    title: "Insight & Strategy",
    description: "Trends, YouTube analysis, and a strategy planner that turns signals into a clear plan.",
    icon: BarChart3,
    bullets: ["Trend radar", "YT channel deep-dive", "Strategy planner"],
  },
  {
    title: "Creative Generation",
    description: "From prompts to polished content with a generator and an on-call AI assistant.",
    icon: Sparkles,
    bullets: ["Multi-format generator", "AI assistant", "Reusable prompts"],
  },
  {
    title: "Visual Workspace",
    description: "A focused canvas for ideas, storyboards, and thumbnail iterations.",
    icon: LayoutGrid,
    bullets: ["Canvas", "Thumbnail studio", "Version history"],
  },
  {
    title: "Planning & Organization",
    description: "Organize work across Studio Hub, Calendar, and History so nothing gets lost.",
    icon: CalendarClock,
    bullets: ["Studio hub", "Calendar", "History & notes"],
  },
];

const Features = () => {
  return (
    <section id="features" className="relative bg-background py-20 sm:py-24">
      <div className="container mx-auto">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Clarity, creation, and control — in one place</h2>
          <p className="mt-4 text-muted-foreground">A single, intelligent command center built for the creator‑entrepreneur.</p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <article key={f.title} className="group relative rounded-xl border border-border/60 bg-background/60 p-6 shadow-elevated transition-transform duration-300 hover:-translate-y-0.5">
              <div className="mb-4 inline-flex size-10 items-center justify-center rounded-md bg-secondary/40 text-brand-foreground">
                <f.icon className="text-brand" />
              </div>
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>
              <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
                {f.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-alt" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-12 grid items-start gap-6 rounded-xl border border-border/60 bg-background/60 p-6 sm:grid-cols-3">
          {[BrainCircuit, MessageSquare, CalendarClock].map((Icon, i) => (
            <div key={i} className="rounded-lg border border-border/50 bg-background/50 p-5">
              <div className="mb-3 inline-flex size-9 items-center justify-center rounded-md bg-secondary/40">
                <Icon className="text-brand" />
              </div>
              <p className="text-sm text-muted-foreground">
                AI woven throughout: context-aware suggestions, faster prompts, and assistance that understands your workflow.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
