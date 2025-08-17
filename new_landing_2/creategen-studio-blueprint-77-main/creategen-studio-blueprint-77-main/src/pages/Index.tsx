import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sparkles,
  LineChart,
  ClipboardList,
  Image as ImageIcon,
  Calendar as CalendarIcon,
  GitBranch,
  Quote,
  Check,
  ArrowRight,
  Star,
  Shield,
  Clock,
  CreditCard,
  Users,
  Zap,
  BarChart3,
  Palette,
  Calendar,
  MessageSquare,
  Database,
  Globe,
  Settings,
  Headphones,
} from "lucide-react";
import heroImage from "@/assets/creategen-hero.jpg";
import workflowImage from "@/assets/creategen-workflow.jpg";
import GlowField from "@/components/GlowField";
import InteractiveDemo from "@/components/InteractiveDemo";
import ValueProposition from "@/components/ValueProposition";
import MobileNavigation from "@/components/MobileNavigation";

const SocialProof = () => (
  <section aria-label="Early access metrics" className="py-8 md:py-12">
    <div className="container mx-auto px-4">
      <div className="flex flex-col items-center gap-6">
        <p className="text-sm text-muted-foreground">Early access metrics</p>
        <div className="grid grid-cols-3 gap-4 md:gap-8 text-center max-w-2xl">
          <div>
            <div className="font-display text-xl md:text-2xl text-[hsl(var(--accent-start))]">2,500+</div>
            <p className="text-xs md:text-sm text-muted-foreground">Beta signups</p>
          </div>
          <div>
            <div className="font-display text-xl md:text-2xl text-[hsl(var(--accent-start))]">15hrs</div>
            <p className="text-xs md:text-sm text-muted-foreground">Avg. weekly savings</p>
          </div>
          <div>
            <div className="font-display text-xl md:text-2xl text-[hsl(var(--accent-start))]">94%</div>
            <p className="text-xs md:text-sm text-muted-foreground">Would recommend</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const FeatureItem = ({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
}) => (
  <div className="flex items-start gap-4">
    <div className="mt-1 rounded-md border border-white/10 bg-gradient-to-br from-[hsl(var(--accent-start)/0.15)] to-[hsl(var(--accent-end)/0.15)] p-2">
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <h4 className="font-medium">{title}</h4>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  </div>
);

const Index = () => {
  // Canonical tag for SEO (overrides default)
  useEffect(() => {
    const link = document.querySelector<HTMLLinkElement>("link[rel='canonical']");
    if (link) {
      link.href = window.location.origin + "/";
    } else {
      const l = document.createElement("link");
      l.setAttribute("rel", "canonical");
      l.setAttribute("href", window.location.origin + "/");
      document.head.appendChild(l);
    }
  }, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "CreateGen Studio",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "CreateGen Studio is the confident co‑pilot for creator‑entrepreneurs: plan insights, generate content, and organize your studio in one AI command center.",
    offers: [
      {
        "@type": "Offer",
        name: "Free",
        price: "0",
        priceCurrency: "USD",
      },
      {
        "@type": "Offer",
        name: "Creator Pro",
        price: "29",
        priceCurrency: "USD",
      },
      {
        "@type": "Offer",
        name: "Agency Pro",
        price: "79",
        priceCurrency: "USD",
      },
    ],
    brand: {
      "@type": "Brand",
      name: "CreateGen Studio",
    },
    url: typeof window !== "undefined" ? window.location.href : "https://creategen.studio/",
    image: heroImage,
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-white/5">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-gradient-to-br from-[hsl(var(--accent-start))] to-[hsl(var(--accent-end))]" aria-hidden />
            <span className="font-display text-lg">CreateGen Studio</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">Stories</a>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="hero" className="hidden sm:inline-flex text-sm">Sign in</Button>
            <Button variant="brand" className="text-sm">Start free trial</Button>
            <MobileNavigation />
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--accent-start)/0.15),transparent_60%)]" aria-hidden />
          <div className="container mx-auto px-4 pt-16 pb-8 md:pt-24 md:pb-12 relative">
            <GlowField />
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="space-y-6">
                <h1 className="font-display text-3xl md:text-5xl lg:text-6xl leading-tight">
                  Stop juggling 8 tools.
                  <span className="block bg-gradient-to-r from-[hsl(var(--accent-start))] to-[hsl(var(--accent-end))] bg-clip-text text-transparent">Start creating faster.</span>
                </h1>
                <p className="text-base md:text-lg text-muted-foreground max-w-prose">
                  Replace Notion + Airtable + Canva + Buffer with one focused workspace. Save 15+ hours weekly and ship content with confidence.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="brand" size="lg" className="text-base">
                    Start free trial <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                  <Button variant="outline" size="lg" className="backdrop-blur text-base">
                    <Star className="h-4 w-4 mr-1" /> View live demo
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Shield className="h-4 w-4 text-green-500" /> 30-day money back guarantee
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-green-500" /> Setup in under 60 seconds
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <CreditCard className="h-4 w-4" /> No credit card required
                    </div>
                    <div className="flex items-center gap-1">
                      <Check className="h-4 w-4" /> Cancel anytime
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative order-first md:order-last">
                <div className="hidden md:block">
                  <InteractiveDemo />
                </div>
                <div className="md:hidden">
                  <Card className="border-white/10 bg-white/5 backdrop-blur supports-[backdrop-filter]:bg-white/5 shadow-xl">
                    <CardContent className="p-3">
                      <img
                        src={heroImage}
                        alt="CreateGen Studio dashboard demo with insights, generator, canvas and studio hub"
                        className="rounded-md shadow-2xl w-full h-auto"
                        loading="eager"
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile Interactive Demo */}
        <section className="md:hidden py-8">
          <div className="container mx-auto px-4">
            <InteractiveDemo />
          </div>
        </section>

        <SocialProof />

        <ValueProposition />

        {/* Problem / Solution */}
        <section id="problem" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-card/60 border-white/10">
                <CardHeader>
                  <CardTitle className="text-xl">Yesterday: chaos and context‑switching</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FeatureItem icon={GitBranch} title="Disconnected tools" desc="Charts, notes, prompts, and assets all live in different tabs." />
                  <FeatureItem icon={ClipboardList} title="Fragile workflows" desc="Manual copy‑paste between systems wastes time and breaks focus." />
                  <FeatureItem icon={ImageIcon} title="Design friction" desc="Visual production blocked by scattered assets and ad‑hoc file names." />
                </CardContent>
              </Card>

              <Card className="bg-card/60 border-white/10">
                <CardHeader>
                  <CardTitle className="text-xl">Today with CreateGen: unified mission control</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FeatureItem icon={LineChart} title="Insight & Strategy" desc="Trends, YouTube analysis, and a planner that turns data into direction." />
                  <FeatureItem icon={Sparkles} title="Creative Generation" desc="Generator + AI Assistant that helps you draft, iterate, and refine fast." />
                  <FeatureItem icon={CalendarIcon} title="Plan & Organize" desc="Studio Hub, Calendar, and History keep every asset and decision in one place." />
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How it works / Feature showcase */}
        <section id="features" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mb-8">
              <h2 className="font-display text-3xl md:text-4xl">From insight to publish — one flow</h2>
              <p className="text-muted-foreground mt-3">
                Strategy informs creation, creation feeds organization. Repeat with momentum.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <img
                  src={workflowImage}
                  alt="Workflow: Insight & Strategy → Creative Generation → Organization"
                  className="rounded-lg border border-white/10 shadow-xl w-full h-auto"
                  loading="lazy"
                />
              </div>
              <div className="grid gap-6">
                <FeatureItem icon={LineChart} title="Insight & Strategy" desc="Trends, YT analysis, and a focused planner keep you decisive." />
                <FeatureItem icon={Sparkles} title="Generate & Iterate" desc="Use the Generator and AI Assistant to explore variants quickly." />
                <FeatureItem icon={ImageIcon} title="Visual Workspace" desc="Canvas and Thumbnails bring ideas to life without leaving the flow." />
                <FeatureItem icon={CalendarIcon} title="Plan & Organize" desc="Studio Hub, Calendar, and History to manage releases end‑to‑end." />
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-16 md:py-24 bg-[radial-gradient(ellipse_at_center,hsl(var(--accent-start)/0.12),transparent_60%)]">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Quote className="mx-auto h-8 w-8 mb-6 text-muted-foreground" />
              <p className="text-xl md:text-2xl leading-relaxed">
                “CreateGen is my creative autopilot. I finally ship faster without sacrificing quality — everything I need lives in one clean place.”
              </p>
              <p className="mt-4 text-sm text-muted-foreground">Ava M., YouTube Creator & Studio Owner</p>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm mb-4">
                <Shield className="h-4 w-4" />
                30-day money back guarantee
              </div>
            </div>
            <div className="max-w-2xl mb-8 md:mb-12 text-center mx-auto">
              <h2 className="font-display text-2xl md:text-4xl">Choose your creative power level</h2>
              <p className="text-muted-foreground mt-3">Start free. Scale when ready. ROI guaranteed or money back.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {/* Free */}
              <Card className="bg-card/60 border-white/10 flex flex-col">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Free</CardTitle>
                  <p className="text-xs text-muted-foreground">Perfect for exploring</p>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="text-2xl md:text-3xl font-display">$0<span className="text-base font-normal text-muted-foreground">/mo</span></div>
                  <ul className="mt-4 space-y-3 text-sm">
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> <span><strong>50 AI generations/month</strong></span></li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> 5 content templates</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Basic trend insights</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Simple canvas tools</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Community support</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Mobile app access</li>
                  </ul>
                  <Button variant="brand" className="mt-6 text-sm">Start free trial</Button>
                </CardContent>
              </Card>

              {/* Creator Pro */}
              <Card className="relative bg-card/60 border-white/10 flex flex-col outline outline-2 outline-offset-0 outline-[hsl(var(--accent-start)/0.4)] scale-105">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-[hsl(var(--accent-start))] to-[hsl(var(--accent-end))] text-[11px] text-white border border-white/10">
                  Most Popular
                </div>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Creator Pro</CardTitle>
                  <p className="text-xs text-muted-foreground">For serious creators</p>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="flex items-baseline gap-2">
                    <div className="text-2xl md:text-3xl font-display">$29<span className="text-base font-normal text-muted-foreground">/mo</span></div>
                    <div className="text-xs text-muted-foreground line-through">$39</div>
                  </div>
                  <p className="text-xs text-[hsl(var(--accent-start))] mb-4">Save $120/year with annual plan</p>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> <span><strong>1,000 AI generations/month</strong></span></li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> <strong>Everything in Free</strong></li>
                    <li className="flex items-center gap-2"><BarChart3 className="h-4 w-4 text-green-500" /> Advanced analytics & insights</li>
                    <li className="flex items-center gap-2"><Palette className="h-4 w-4 text-green-500" /> Pro design templates (50+)</li>
                    <li className="flex items-center gap-2"><Calendar className="h-4 w-4 text-green-500" /> Content calendar & scheduling</li>
                    <li className="flex items-center gap-2"><MessageSquare className="h-4 w-4 text-green-500" /> AI assistant & chat support</li>
                    <li className="flex items-center gap-2"><Database className="h-4 w-4 text-green-500" /> Unlimited project storage</li>
                    <li className="flex items-center gap-2"><Globe className="h-4 w-4 text-green-500" /> YouTube & TikTok integration</li>
                    <li className="flex items-center gap-2"><Zap className="h-4 w-4 text-green-500" /> Priority processing (2x faster)</li>
                    <li className="flex items-center gap-2"><Shield className="h-4 w-4 text-green-500" /> <strong>ROI guarantee: Save 15+ hrs/week</strong></li>
                  </ul>
                  <Button variant="brand" className="mt-6 text-sm">Start 14-day trial</Button>
                  <p className="text-xs text-center text-muted-foreground mt-2">Then $29/month • Cancel anytime</p>
                </CardContent>
              </Card>

              {/* Agency Pro */}
              <Card className="bg-card/60 border-white/10 flex flex-col">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Agency Pro</CardTitle>
                  <p className="text-xs text-muted-foreground">For teams & agencies</p>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="flex items-baseline gap-2">
                    <div className="text-2xl md:text-3xl font-display">$79<span className="text-base font-normal text-muted-foreground">/mo</span></div>
                    <div className="text-xs text-muted-foreground line-through">$99</div>
                  </div>
                  <p className="text-xs text-[hsl(var(--accent-start))] mb-4">Save $240/year with annual plan</p>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> <span><strong>Unlimited generations</strong></span></li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> <strong>Everything in Creator Pro</strong></li>
                    <li className="flex items-center gap-2"><Users className="h-4 w-4 text-green-500" /> Team collaboration (up to 10 users)</li>
                    <li className="flex items-center gap-2"><Settings className="h-4 w-4 text-green-500" /> Advanced workflow automation</li>
                    <li className="flex items-center gap-2"><Database className="h-4 w-4 text-green-500" /> White-label options available</li>
                    <li className="flex items-center gap-2"><BarChart3 className="h-4 w-4 text-green-500" /> Team performance analytics</li>
                    <li className="flex items-center gap-2"><Globe className="h-4 w-4 text-green-500" /> API access & integrations</li>
                    <li className="flex items-center gap-2"><Headphones className="h-4 w-4 text-green-500" /> Dedicated account manager</li>
                    <li className="flex items-center gap-2"><Shield className="h-4 w-4 text-green-500" /> Priority support (1hr response)</li>
                    <li className="flex items-center gap-2"><Zap className="h-4 w-4 text-green-500" /> <strong>Custom training & onboarding</strong></li>
                  </ul>
                  <Button variant="outline" className="mt-6 text-sm">Schedule demo</Button>
                  <p className="text-xs text-center text-muted-foreground mt-2">Custom enterprise plans available</p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-8 md:mt-12">
              <p className="text-sm text-muted-foreground mb-4">All plans include 30-day money-back guarantee • No setup fees • Cancel anytime</p>
              <div className="flex flex-wrap justify-center gap-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Shield className="h-3 w-3" /> SSL secured
                </div>
                <div className="flex items-center gap-1">
                  <Database className="h-3 w-3" /> GDPR compliant
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="h-3 w-3" /> 99.9% uptime
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-r from-[hsl(var(--accent-start)/0.15)] to-[hsl(var(--accent-end)/0.15)] p-8 md:p-12 text-center">
              <h3 className="font-display text-xl md:text-3xl">Join 2,500+ creators building faster</h3>
              <p className="mt-2 text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
                Early access metrics: 15hrs saved weekly • 94% recommend • 3x faster content creation
              </p>
              <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
                <Button size="lg" variant="brand" className="text-base">
                  Start free trial <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Shield className="h-3 w-3 text-green-500" /> 30-day guarantee
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-green-500" /> Setup in 60 seconds
                </div>
                <div className="flex items-center gap-1">
                  <CreditCard className="h-3 w-3" /> No credit card required
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-10 border-t border-white/5">
        <div className="container mx-auto px-4 text-sm text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} CreateGen Studio</p>
          <nav className="flex gap-6">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#pricing" className="hover:text-foreground">Pricing</a>
            <a href="#" className="hover:text-foreground">Privacy</a>
          </nav>
        </div>
      </footer>

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-4 md:hidden bg-background/95 backdrop-blur border-t border-white/10">
        <Button variant="brand" size="lg" className="w-full text-base">
          Start free trial <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default Index;
