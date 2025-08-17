import { SEOHead } from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";

const Privacy = () => {
  const canonical = typeof window !== 'undefined' ? window.location.href : undefined;
  return (
    <>
      <SEOHead
        title="Privacy Policy — CreateGen Studio"
        description="How CreateGen Studio collects, uses, and protects your data."
        canonical={canonical}
      />
      <main className="container py-16 md:py-24">
        <header className="mx-auto max-w-3xl text-center mb-10">
          <h1 className="font-display text-3xl md:text-4xl tracking-tight bg-gradient-to-r from-[hsl(var(--brand-start))] to-[hsl(var(--brand-end))] bg-clip-text text-transparent">Privacy Policy</h1>
          <p className="text-muted-foreground mt-3">How we collect, use, and protect your data—written clearly and simply.</p>
          <p className="text-xs text-muted-foreground mt-1">Last updated: {new Date().toLocaleDateString()}</p>
        </header>

        <section className="grid lg:grid-cols-[240px_1fr] gap-8">
          <aside className="hidden lg:block">
            <nav className="sticky top-24 space-y-2 text-sm">
              <a href="#overview" className="block text-muted-foreground hover:text-foreground">Overview</a>
              <a href="#collection" className="block text-muted-foreground hover:text-foreground">Information We Collect</a>
              <a href="#use" className="block text-muted-foreground hover:text-foreground">How We Use Information</a>
              <a href="#sharing" className="block text-muted-foreground hover:text-foreground">Data Sharing</a>
              <a href="#ai" className="block text-muted-foreground hover:text-foreground">AI & Model Use</a>
              <a href="#retention" className="block text-muted-foreground hover:text-foreground">Data Retention</a>
              <a href="#security" className="block text-muted-foreground hover:text-foreground">Security</a>
              <a href="#rights" className="block text-muted-foreground hover:text-foreground">Your Rights</a>
              <a href="#children" className="block text-muted-foreground hover:text-foreground">Children’s Privacy</a>
              <a href="#changes" className="block text-muted-foreground hover:text-foreground">Changes</a>
              <a href="#contact" className="block text-muted-foreground hover:text-foreground">Contact</a>
            </nav>
          </aside>

          <article>
            <Card className="bg-card/60 border border-border">
              <CardContent className="py-8 md:py-10 space-y-8">
                <section id="overview">
                  <h2 className="text-xl font-semibold">1. Overview</h2>
                  <p className="text-muted-foreground mt-2">We respect your privacy. This Policy explains how we collect, use, disclose, and protect information when you use CreateGen Studio (the “Service”).</p>
                </section>

                <section id="collection">
                  <h2 className="text-xl font-semibold">2. Information We Collect</h2>
                  <ul className="list-disc pl-6 text-muted-foreground mt-2 space-y-1">
                    <li>Account Data: Name, email, and authentication details.</li>
                    <li>Usage Data: Product interactions, feature usage, and device information.</li>
                    <li>User Content: Content you create, upload, or process through the Service.</li>
                    <li>Third-Party Data: Information received through integrations (e.g., YouTube API), subject to their terms.</li>
                  </ul>
                </section>

                <section id="use">
                  <h2 className="text-xl font-semibold">3. How We Use Information</h2>
                  <ul className="list-disc pl-6 text-muted-foreground mt-2 space-y-1">
                    <li>To provide, maintain, and improve the Service.</li>
                    <li>To personalize your experience and power AI features.</li>
                    <li>To communicate with you about updates, billing, and support.</li>
                    <li>To ensure security, prevent abuse, and comply with legal obligations.</li>
                  </ul>
                </section>

                <section id="sharing">
                  <h2 className="text-xl font-semibold">4. Data Sharing</h2>
                  <p className="text-muted-foreground mt-2">We do not sell your personal information. We may share information with trusted service providers and third-party integrations solely to provide the Service (e.g., infrastructure, analytics, payment processing). We require appropriate confidentiality and security commitments.</p>
                </section>

                <section id="ai">
                  <h2 className="text-xl font-semibold">5. AI & Model Use</h2>
                  <p className="text-muted-foreground mt-2">We do not train foundation models on your private User Content without explicit permission. We may use de-identified, aggregated usage analytics to improve product performance and reliability.</p>
                </section>

                <section id="retention">
                  <h2 className="text-xl font-semibold">6. Data Retention</h2>
                  <p className="text-muted-foreground mt-2">We retain information only as long as necessary to provide the Service and comply with legal obligations. You may request export or deletion of your data at any time, subject to applicable law.</p>
                </section>

                <section id="security">
                  <h2 className="text-xl font-semibold">7. Security</h2>
                  <p className="text-muted-foreground mt-2">We use industry-standard security measures, including encryption in transit and at rest where applicable. No method of transmission is 100% secure; please use strong passwords and enable additional protections where available.</p>
                </section>

                <section id="rights">
                  <h2 className="text-xl font-semibold">8. Your Rights</h2>
                  <p className="text-muted-foreground mt-2">Depending on your location, you may have rights to access, correct, delete, or port your data. Contact us at <a href="mailto:privacy@creategen.studio" className="underline underline-offset-4">privacy@creategen.studio</a> for requests.</p>
                </section>

                <section id="children">
                  <h2 className="text-xl font-semibold">9. Children’s Privacy</h2>
                  <p className="text-muted-foreground mt-2">The Service is not directed to children under 13. If you believe a child has provided us information, contact us and we will take appropriate steps.</p>
                </section>

                <section id="changes">
                  <h2 className="text-xl font-semibold">10. Changes to this Policy</h2>
                  <p className="text-muted-foreground mt-2">We may update this Policy periodically. Material changes will be communicated through the Service. Continued use indicates acceptance.</p>
                </section>

                <section id="contact">
                  <h2 className="text-xl font-semibold">11. Contact</h2>
                  <p className="text-muted-foreground mt-2">For questions about this Policy, contact us at <a href="mailto:privacy@creategen.studio" className="underline underline-offset-4">privacy@creategen.studio</a>.</p>
                </section>
              </CardContent>
            </Card>
          </article>
        </section>
      </main>
    </>
  );
};

export default Privacy;
