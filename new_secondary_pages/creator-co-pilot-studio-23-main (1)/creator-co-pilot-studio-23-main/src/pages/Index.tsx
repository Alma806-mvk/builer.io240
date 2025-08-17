import { SEOHead } from "@/components/SEO";
import { Button } from "@/components/ui/button";

const Index = () => {
  const canonical = typeof window !== 'undefined' ? window.location.href : undefined;
  return (
    <>
      <SEOHead
        title="CreateGen Studio — The confident co‑pilot for creator‑entrepreneurs"
        description="Plan, create, and grow with a unified AI studio: Trends, YT Analysis, Generator, Canvas, Strategy Planner, Calendar, and more."
        canonical={canonical}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "CreateGen Studio",
          applicationCategory: "BusinessApplication",
          offers: { "@type": "Offer", price: 0, priceCurrency: "USD" },
        }}
      />

      <section className="container py-20 md:py-28 text-center">
        <h1 className="font-display text-5xl md:text-6xl leading-tight max-w-5xl mx-auto">
          Build a world‑class content engine with your AI co‑pilot
        </h1>
        <p className="text-muted-foreground mt-5 max-w-2xl mx-auto text-lg">
          One streamlined workspace for insight, creation, and planning. Trusted by modern creator‑entrepreneurs.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button variant="gradient" size="lg" asChild>
            <a href="/pricing">Start free</a>
          </Button>
          <Button variant="hero" size="lg" asChild>
            <a href="/features">Explore features</a>
          </Button>
        </div>
        <div className="mt-8 text-sm text-muted-foreground">
          No credit card required. Free plan included.
        </div>
      </section>

      <section className="container pb-24 grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border p-6 glass hover-scale">
          <h3 className="font-display text-xl">Insight & Strategy</h3>
          <p className="text-muted-foreground mt-2">Trends, YT Analysis, and Strategy Planner to find opportunities and plan with data.</p>
        </div>
        <div className="rounded-xl border p-6 glass hover-scale">
          <h3 className="font-display text-xl">Creation & Design</h3>
          <p className="text-muted-foreground mt-2">Generator, AI Assistant, Canvas, and Thumbnails (coming soon) to move from idea to asset.</p>
        </div>
        <div className="rounded-xl border p-6 glass hover-scale">
          <h3 className="font-display text-xl">Organization & Planning</h3>
          <p className="text-muted-foreground mt-2">Studio Hub, Calendar, and History unify your workflow and keep you in control.</p>
        </div>
      </section>
    </>
  );
};

export default Index;
