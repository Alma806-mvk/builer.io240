import { SEOHead } from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";

const Terms = () => {
  const canonical = typeof window !== 'undefined' ? window.location.href : undefined;
  return (
    <>
      <SEOHead
        title="Terms of Service — CreateGen Studio"
        description="The legal terms that govern the use of CreateGen Studio."
        canonical={canonical}
      />
      <main className="container py-16 md:py-24">
        <header className="mx-auto max-w-3xl text-center mb-10">
          <h1 className="font-display text-3xl md:text-4xl tracking-tight bg-gradient-to-r from-[hsl(var(--brand-start))] to-[hsl(var(--brand-end))] bg-clip-text text-transparent">Terms of Service</h1>
          <p className="text-muted-foreground mt-3">Clear, fair terms for using CreateGen Studio.</p>
          <p className="text-xs text-muted-foreground mt-1">Last updated: {new Date().toLocaleDateString()}</p>
        </header>

        <section className="grid lg:grid-cols-[240px_1fr] gap-8">
          <aside className="hidden lg:block">
            <nav className="sticky top-24 space-y-2 text-sm">
              <a href="#agreement" className="block text-muted-foreground hover:text-foreground">Agreement to Terms</a>
              <a href="#service" className="block text-muted-foreground hover:text-foreground">Description of Service</a>
              <a href="#accounts" className="block text-muted-foreground hover:text-foreground">Accounts & Eligibility</a>
              <a href="#acceptable-use" className="block text-muted-foreground hover:text-foreground">Acceptable Use</a>
              <a href="#user-content" className="block text-muted-foreground hover:text-foreground">User Content</a>
              <a href="#ai-content" className="block text-muted-foreground hover:text-foreground">AI-Generated Content</a>
              <a href="#billing" className="block text-muted-foreground hover:text-foreground">Billing & Subscriptions</a>
              <a href="#privacy" className="block text-muted-foreground hover:text-foreground">Privacy</a>
              <a href="#third-party" className="block text-muted-foreground hover:text-foreground">Third-Party Services</a>
              <a href="#ip" className="block text-muted-foreground hover:text-foreground">Intellectual Property</a>
              <a href="#disclaimers" className="block text-muted-foreground hover:text-foreground">Disclaimers</a>
              <a href="#liability" className="block text-muted-foreground hover:text-foreground">Limitation of Liability</a>
              <a href="#termination" className="block text-muted-foreground hover:text-foreground">Termination</a>
              <a href="#changes" className="block text-muted-foreground hover:text-foreground">Changes to Terms</a>
              <a href="#contact" className="block text-muted-foreground hover:text-foreground">Contact</a>
            </nav>
          </aside>

          <article>
            <Card className="bg-card/60 border border-border">
              <CardContent className="py-8 md:py-10 space-y-8">
                <section id="agreement">
                  <h2 className="text-xl font-semibold">1. Agreement to Terms</h2>
                  <p className="text-muted-foreground mt-2">By accessing or using CreateGen Studio (the “Service”), you agree to be bound by these Terms of Service (the “Terms”). If you do not agree to these Terms, you must not use the Service.</p>
                </section>

                <section id="service">
                  <h2 className="text-xl font-semibold">2. Description of Service</h2>
                  <p className="text-muted-foreground mt-2">CreateGen Studio is an AI-assisted content platform that provides research, planning, and creation tools. Certain features may connect to third-party services (e.g., YouTube API) and process user-generated content. Features may evolve over time.</p>
                </section>

                <section id="accounts">
                  <h2 className="text-xl font-semibold">3. Accounts & Eligibility</h2>
                  <p className="text-muted-foreground mt-2">You must be at least 13 years old (or the age of digital consent in your jurisdiction) to use the Service. You are responsible for safeguarding your account credentials and for all activity under your account.</p>
                </section>

                <section id="acceptable-use">
                  <h2 className="text-xl font-semibold">4. Acceptable Use</h2>
                  <p className="text-muted-foreground mt-2">You agree not to misuse the Service, including but not limited to: violating laws or third-party rights, uploading malicious code, attempting unauthorized access, or using automated systems to extract data without consent. You agree to comply with any third-party API policies when features are used (e.g., YouTube API Terms).</p>
                </section>

                <section id="user-content">
                  <h2 className="text-xl font-semibold">5. User Content</h2>
                  <p className="text-muted-foreground mt-2">You retain ownership of any content you create or upload (“User Content”). You grant us a limited, worldwide, non-exclusive license to process your User Content solely to provide and improve the Service. We do not use private User Content to train foundation models without explicit permission.</p>
                </section>

                <section id="ai-content">
                  <h2 className="text-xl font-semibold">6. AI-Generated Content</h2>
                  <p className="text-muted-foreground mt-2">Outputs generated by the Service may be subject to review or editing by you. You are responsible for verifying outputs for accuracy and compliance. We make no guarantees regarding the originality, legality, or suitability of AI outputs for your specific purposes.</p>
                </section>

                <section id="billing">
                  <h2 className="text-xl font-semibold">7. Billing & Subscriptions</h2>
                  <p className="text-muted-foreground mt-2">Paid plans renew automatically each billing cycle unless canceled. Taxes may apply depending on your location. Refunds are handled according to our refund policy where applicable. Usage-based features (e.g., AI credits) reset at the start of each billing period.</p>
                </section>

                <section id="privacy">
                  <h2 className="text-xl font-semibold">8. Privacy</h2>
                  <p className="text-muted-foreground mt-2">Your privacy is important to us. Please review our <a href="/privacy" className="underline underline-offset-4">Privacy Policy</a> for details on how we collect, use, and safeguard your data.</p>
                </section>

                <section id="third-party">
                  <h2 className="text-xl font-semibold">9. Third-Party Services</h2>
                  <p className="text-muted-foreground mt-2">Certain functionality may rely on third-party platforms (e.g., YouTube API). We are not responsible for third-party services and do not control their terms or policies. Your use of those services is subject to their respective terms.</p>
                </section>

                <section id="ip">
                  <h2 className="text-xl font-semibold">10. Intellectual Property</h2>
                  <p className="text-muted-foreground mt-2">All rights, title, and interest in the Service (excluding User Content) are owned by CreateGen Studio or its licensors. No rights are granted except as expressly set forth in these Terms.</p>
                </section>

                <section id="disclaimers">
                  <h2 className="text-xl font-semibold">11. Disclaimers</h2>
                  <p className="text-muted-foreground mt-2">The Service is provided “as is” and “as available.” We disclaim all warranties to the fullest extent permitted by law, including warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the Service will be uninterrupted or error-free.</p>
                </section>

                <section id="liability">
                  <h2 className="text-xl font-semibold">12. Limitation of Liability</h2>
                  <p className="text-muted-foreground mt-2">To the maximum extent permitted by law, CreateGen Studio shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or for lost profits or revenues. Our aggregate liability shall not exceed the amounts paid by you to us within the 12 months preceding the claim.</p>
                </section>

                <section id="termination">
                  <h2 className="text-xl font-semibold">13. Termination</h2>
                  <p className="text-muted-foreground mt-2">We may suspend or terminate access to the Service for any violation of these Terms. You may cancel at any time through your account settings.</p>
                </section>

                <section id="changes">
                  <h2 className="text-xl font-semibold">14. Changes to Terms</h2>
                  <p className="text-muted-foreground mt-2">We may modify these Terms from time to time. We will post the updated Terms with an updated “Last updated” date. Continued use of the Service after changes constitutes acceptance of the new Terms.</p>
                </section>

                <section id="contact">
                  <h2 className="text-xl font-semibold">15. Contact</h2>
                  <p className="text-muted-foreground mt-2">For questions regarding these Terms, contact us at <a href="mailto:legal@creategen.studio" className="underline underline-offset-4">legal@creategen.studio</a>.</p>
                </section>
              </CardContent>
            </Card>
          </article>
        </section>
      </main>
    </>
  );
};

export default Terms;
