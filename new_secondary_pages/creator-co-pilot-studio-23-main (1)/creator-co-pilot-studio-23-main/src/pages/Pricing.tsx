import { SEOHead } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useState } from "react";

const features = [
  "Studio Hub",
  "Generator",
  "Canvas",
  "AI Assistant",
  "Trends (Opportunity Engine)",
  "YT Analysis",
  "Strategy Planner",
  "Calendar",
  "History",
  "Pro Templates",
  "Priority Support",
  "Team Collaboration",
];

const planMatrix: Record<string, boolean[]> = {
  Free:             [true, true, true, true, false, false, false, true, true, false, false, false],
  "Creator Pro":   [true, true, true, true, true, true, true, true, true, true, true, false],
  "Agency Pro":    [true, true, true, true, true, true, true, true, true, true, true, true],
};

const Pricing = () => {
  const canonical = typeof window !== 'undefined' ? window.location.href : undefined;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "CreateGen Studio",
    description: "AI-powered content operating system for creator-entrepreneurs.",
    offers: [
      { "@type": "Offer", name: "Free — Starter Kit", price: 0, priceCurrency: "USD" },
      { "@type": "Offer", name: "Creator Pro — Growth Engine", price: 29, priceCurrency: "USD" },
      { "@type": "Offer", name: "Agency Pro — Command Center", price: 79, priceCurrency: "USD" },
    ],
  };

  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const discount = 0.2;
  const pro = 29; const agency = 79;
  const display = (base: number) => billing === 'monthly' ? base : Math.round(base * (1 - discount));
  const annual = (base: number) => Math.round(base * 12 * (1 - discount));

  const Row = ({ label, value, included }: { label: string; value?: string; included: boolean }) => (
    <li className="flex items-center gap-2">
      {included ? <Check className="h-4 w-4 text-foreground" /> : <X className="h-4 w-4 text-muted-foreground" />}
      <span className={included ? "" : "text-muted-foreground"}>
        {label}{value ? `: ${value}` : ""}
      </span>
    </li>
  );

  return (
    <>
      <SEOHead
        title="Pricing — CreateGen Studio"
        description="Simple plans built for growth. Start free, upgrade when you’re ready."
        canonical={canonical}
        jsonLd={jsonLd}
      />

      <header className="container py-16 md:py-24 text-center animate-fade-in">
        <h1 className="font-display text-4xl md:text-5xl leading-tight">Pricing that scales with you</h1>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
          Transparent tiers. Powerful features. No surprises.
        </p>
        <div className="mt-6 flex items-center justify-center">
          <div className="inline-flex rounded-md bg-muted p-1" role="tablist" aria-label="Billing period">
            <button onClick={() => setBilling('monthly')} className={`px-3 py-1.5 text-sm rounded-sm transition-colors ${billing === 'monthly' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>Monthly</button>
            <button onClick={() => setBilling('yearly')} className={`px-3 py-1.5 text-sm rounded-sm transition-colors ${billing === 'yearly' ? 'bg-primary text-primary-foreground shadow-glow pulse' : 'text-muted-foreground hover:text-foreground'}`}>Yearly <span className={`ml-1 text-xs ${billing === 'yearly' ? 'text-primary-foreground' : 'text-primary'}`}>(Save 20%)</span></button>
          </div>
        </div>
      </header>

      <section className="container pb-20 animate-fade-in">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Free */}
          <Card className="flex flex-col hover-scale animate-enter">
            <CardHeader>
              <CardTitle className="flex items-baseline justify-between">
                <span>Free — Starter Kit</span>
                <span className="text-lg">$0<span className="text-muted-foreground">/mo</span></span>
              </CardTitle>
              <p className="text-sm text-muted-foreground">25 monthly generations. Core AI tools, basic project management, Canvas & History.</p>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <ul className="space-y-2 text-sm">
                <Row label="10 MB storage" included={true} />
                <Row label="Starter templates" included={true} />
                <Row label="Advanced content types" included={false} />
                <Row label="Up to 5 projects" included={true} />
                <Row label="YouTube Connect" included={false} />
                <Row label="AI Personas" included={false} />
                <Row label="Batch Generations" included={false} />
                <Row label="SEO Boost" included={false} />
                <Row label="AI Assistant — 5 questions/day" included={true} />
              </ul>
               <ul className="space-y-2 text-sm mt-3 mb-6">
                {features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    {planMatrix["Free"][i] ? (
                      <Check className="h-4 w-4 text-foreground" />
                    ) : (
                      <X className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className={planMatrix["Free"][i] ? "" : "text-muted-foreground"}>{f}</span>
                  </li>
                ))}
              </ul>
              <Button variant="hero" className="mt-auto" asChild>
                <a href="/auth">Get started</a>
              </Button>
            </CardContent>
          </Card>

          {/* Creator Pro */}
          <Card className="relative flex flex-col ring-2 ring-primary/50 shadow-glow hover-scale animate-enter bg-gradient-to-b from-primary/10 to-card">
            <div className="absolute -top-3 left-4 rounded-full px-3 py-1 text-xs bg-gradient-brand text-foreground shadow-glow pulse">
              Most Popular
            </div>
            <CardHeader>
              <CardTitle className="flex items-baseline justify-between">
                <span>Creator Pro — Growth Engine</span>
                <span className="text-lg flex items-center">${display(pro)}<span className="text-muted-foreground">/mo</span>{billing === 'yearly' && (<span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 animate-enter">Save 20%</span>)}</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground">250 monthly generations, all Pro templates, YT Analysis & Trends, priority support.</p>
              {billing === 'yearly' && (
                <p className="text-xs text-muted-foreground mt-1">Billed annually ${annual(pro)} (save 20%)</p>
              )}
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
               <ul className="space-y-2 text-sm">
                <Row label="10 GB storage" included={true} />
                
                <Row label="Advanced content types" included={true} />
                <Row label="Unlimited projects" included={true} />
                <Row label="YouTube Connect" included={true} />
                <Row label="AI Personas" included={true} />
                <Row label="Batch Generations" included={true} />
                <Row label="SEO Boost" included={true} />
                <Row label="AI Assistant — 200 extra questions/month" included={true} />
              </ul>
               <ul className="space-y-2 text-sm mt-3 mb-6">
                {features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    {planMatrix["Creator Pro"][i] ? (
                      <Check className="h-4 w-4 text-foreground" />
                    ) : (
                      <X className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className={planMatrix["Creator Pro"][i] ? "" : "text-muted-foreground"}>{f}</span>
                  </li>
                ))}
              </ul>
              <Button variant="gradient" className="mt-auto" asChild>
                <a href="/auth">Start Pro</a>
              </Button>
            </CardContent>
          </Card>

          {/* Agency Pro */}
          <Card className="flex flex-col hover-scale animate-enter">
            <CardHeader>
              <CardTitle className="flex items-baseline justify-between">
                <span>Agency Pro — Command Center</span>
                <span className="text-lg flex items-center">${display(agency)}<span className="text-muted-foreground">/mo</span>{billing === 'yearly' && (<span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 animate-enter">Save 20%</span>)}</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground">1,000 monthly generations, team collaboration, all Ultimate enterprise templates.</p>
              {billing === 'yearly' && (
                <p className="text-xs text-muted-foreground mt-1">Billed annually ${annual(agency)} (save 20%)</p>
              )}
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
               <ul className="space-y-2 text-sm">
                <Row label="100 GB storage" included={true} />
                
                <Row label="Advanced content types" included={true} />
                <Row label="Unlimited projects" included={true} />
                <Row label="YouTube Connect" included={true} />
                <Row label="AI Personas" included={true} />
                <Row label="Batch Generations" included={true} />
                <Row label="SEO Boost" included={true} />
                <Row label="AI Assistant — Unlimited questions/day" included={true} />
              </ul>
              <ul className="space-y-2 text-sm mt-3 mb-6">
                {features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    {planMatrix["Agency Pro"][i] ? (
                      <Check className="h-4 w-4 text-foreground" />
                    ) : (
                      <X className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className={planMatrix["Agency Pro"][i] ? "" : "text-muted-foreground"}>{f === "Pro Templates" ? "Ultimate templates" : f}</span>
                  </li>
                ))}
              </ul>
              <Button variant="hero" className="mt-auto" asChild>
                <a href="/auth">Scale with Agency Pro</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
};

export default Pricing;
