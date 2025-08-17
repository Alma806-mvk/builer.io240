import { LineChart, Sparkles, CalendarCheck } from "lucide-react";

const steps = [
  {
    title: "Insight & Strategy",
    description:
      "Surface trends, analyze YouTube channels, and craft a clear content strategy.",
    Icon: LineChart,
  },
  {
    title: "Create & Iterate",
    description:
      "Generate scripts, ideas, and thumbnails with an AI assistant built for speed.",
    Icon: Sparkles,
  },
  {
    title: "Organize & Launch",
    description:
      "Plan in the Studio Hub, manage assets on the canvas, and go live on schedule.",
    Icon: CalendarCheck,
  },
];

const HowItWorks = () => (
  <section id="how-it-works" className="py-20 md:py-28">
    <div className="container">
      <header className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight animate-fade-in">How it works</h2>
        <p
          className="mt-3 text-muted-foreground animate-fade-in"
          style={{ animationDelay: "100ms" }}
        >
          From insight to creation to organization—your entire workflow in one intelligent command center.
        </p>
      </header>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((s, i) => (
          <article
            key={s.title}
            className="group rounded-xl border border-border bg-background/60 p-6 shadow-elevated backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-glow animate-fade-in"
            style={{ animationDelay: `${150 + i * 100}ms` }}
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-full border border-border bg-background/80 ring-1 ring-sidebar-ring">
                <s.Icon className="text-foreground" size={22} aria-hidden />
              </div>
              <span className="text-xs text-muted-foreground">Step {i + 1}</span>
            </div>
            <h3 className="text-lg font-medium">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
