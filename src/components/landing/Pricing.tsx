import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free",
    price: "$0",
    tagline: "Starter Kit",
    description: "A generous taste of core AI tools with limited monthly generations.",
    features: [
      "Limited monthly generations",
      "Core generator + assistant",
      "Canvas & basic templates",
    ],
    cta: "Start free",
    popular: false,
  },
  {
    name: "Creator Pro",
    price: "$29",
    tagline: "Growth Engine",
    description: "Unlock pro templates, advanced features, and a higher credit allowance.",
    features: [
      "High monthly credits",
      "All Pro templates",
      "Advanced generator controls",
      "Priority support",
    ],
    cta: "Choose Pro",
    popular: true,
  },
  {
    name: "Agency Pro",
    price: "$79",
    tagline: "Command Center",
    description: "For teams and agencies: highest limits, collaboration, and ultimate templates.",
    features: [
      "Highest monthly credits",
      "Team collaboration",
      "Ultimate templates",
      "Role permissions",
    ],
    cta: "Scale with Agency",
    popular: false,
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="relative bg-background py-20 sm:py-24">
      <div className="container mx-auto">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Simple pricing for serious creators</h2>
          <p className="mt-4 text-muted-foreground">Start free. Upgrade when you need more power.</p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((p) => (
            <article
              key={p.name}
              className={`relative rounded-xl border border-border/60 bg-background/70 p-6 transition-transform hover:-translate-y-0.5 ${
                p.popular ? "shadow-glow" : "shadow-elevated"
              }`}
            >
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-border/60 bg-background/90 px-3 py-1 text-xs text-muted-foreground">
                  Most popular
                </div>
              )}
              <h3 className="text-lg font-semibold">{p.name} <span className="text-xs text-muted-foreground">• {p.tagline}</span></h3>
              <p className="mt-2 text-3xl font-semibold">{p.price}<span className="text-sm font-normal text-muted-foreground">/month</span></p>
              <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
              <ul className="mt-5 space-y-2 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-alt" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Button variant={p.popular ? "gradient" : "outline"} className="w-full">{p.cta}</Button>
              </div>
              <p className="mt-2 text-center text-xs text-muted-foreground">Cancel anytime</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
