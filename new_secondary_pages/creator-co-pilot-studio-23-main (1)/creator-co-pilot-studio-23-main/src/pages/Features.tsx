import { SEOHead } from "@/components/SEO";
import insightImg from "@/assets/features-insight.jpg";
import creationImg from "@/assets/features-creation.jpg";
import orgImg from "@/assets/features-organization.jpg";
import { Button } from "@/components/ui/button";

const Section = ({ title, subtitle, image, bullets }: { title: string; subtitle: string; image: string; bullets: string[] }) => (
  <section className="container py-16 md:py-24">
    <div className="grid gap-10 md:grid-cols-2 items-center">
      <div className="space-y-4">
        <h2 className="font-display text-3xl md:text-4xl leading-tight">{title}</h2>
        <p className="text-muted-foreground text-base md:text-lg">{subtitle}</p>
        <ul className="mt-6 space-y-3 text-sm md:text-base">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-gradient-brand" />
              <span className="text-foreground/90">{b}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl overflow-hidden border shadow-glow">
        <img src={image} alt={`${title} — CreateGen Studio`} loading="lazy" className="w-full h-auto" />
      </div>
    </div>
  </section>
);

const Features = () => {
  const canonical = typeof window !== 'undefined' ? window.location.href : undefined;
  return (
    <>
      <SEOHead
        title="Features — CreateGen Studio"
        description="Explore the unified toolkit for insight, creation, and planning — all in one AI-powered studio."
        canonical={canonical}
      />

      <header className="container py-16 md:py-24 text-center">
        <h1 className="font-display text-4xl md:text-5xl leading-tight max-w-3xl mx-auto">
          Everything you need to build a world‑class content engine
        </h1>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
          The confident co‑pilot for creator‑entrepreneurs. From opportunity discovery to final publish-ready assets — CreateGen Studio unifies the entire workflow.
        </p>
        <div className="mt-8">
          <Button variant="gradient" size="lg" asChild>
            <a href="/pricing">Start free</a>
          </Button>
        </div>
      </header>

      <Section
        title="Pillar 1: Insight & Strategy"
        subtitle="Trends, YT Analysis, and Strategy Planner give you the unfair advantage — discover viral opportunities, deconstruct winners, and build a data-driven plan."
        image={insightImg}
        bullets={[
          "Trends (Opportunity Engine): Spot rising topics before they peak.",
          "YT Analysis: Reverse-engineer high-performing channels and videos.",
          "Strategy Planner: Turn insights into a professional, actionable strategy.",
        ]}
      />

      <Section
        title="Pillar 2: Creation & Design"
        subtitle="From first spark to final cut — Generator, AI Assistant, Canvas, and Thumbnails (coming soon) remove friction and end creative block."
        image={creationImg}
        bullets={[
          "Generator: Draft scripts, outlines, hooks, and titles in your brand voice.",
          "AI Assistant: A conversational co‑pilot that understands context everywhere.",
          "Canvas: Mind‑map, storyboard, and connect ideas visually.",
          "Thumbnails Studio (upcoming): High‑impact thumbnails with guided best practices.",
        ]}
      />

      <Section
        title="Pillar 3: Organization & Planning"
        subtitle="Studio Hub, Calendar, and History unify your workflow — keep projects organized, schedules clear, and versions under control."
        image={orgImg}
        bullets={[
          "Studio Hub: Your central command center for projects and assets.",
          "Calendar: Plan, schedule, and collaborate with clarity.",
          "History: Versioned work you can revisit, compare, and restore.",
        ]}
      />
    </>
  );
};

export default Features;
