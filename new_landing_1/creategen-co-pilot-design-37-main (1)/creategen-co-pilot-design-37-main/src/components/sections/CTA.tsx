import { Button } from "@/components/ui/button";

const CTA = () => (
  <section id="cta" className="py-20 md:py-28">
    <div className="container">
      <article className="relative overflow-hidden rounded-2xl border border-border bg-background/60 p-10 text-center shadow-glow backdrop-blur">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-primary opacity-20" />
        <h2
          className="text-balance text-3xl font-semibold tracking-tight md:text-4xl animate-fade-in"
          style={{ animationDelay: "100ms" }}
        >
          Ready to create with confidence?
        </h2>
        <p
          className="mt-3 text-muted-foreground md:text-lg animate-fade-in"
          style={{ animationDelay: "200ms" }}
        >
          Get started in minutes. No credit card required.
        </p>
        <div className="mt-8 flex justify-center animate-fade-in" style={{ animationDelay: "300ms" }}>
          <a href="#pricing" aria-label="Get started for free">
            <Button variant="gradient" size="lg">Get Started for Free</Button>
          </a>
        </div>
      </article>
    </div>
  </section>
);

export default CTA;
