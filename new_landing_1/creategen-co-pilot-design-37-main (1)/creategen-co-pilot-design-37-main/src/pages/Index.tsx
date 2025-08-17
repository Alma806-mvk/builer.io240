import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import HowItWorks from "@/components/sections/HowItWorks";
import ProblemSolution from "@/components/sections/ProblemSolution";
import Pricing from "@/components/sections/Pricing";
import FAQ from "@/components/sections/FAQ";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";

const Index = () => {
  const productLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "CreateGen Studio",
    description:
      "CreateGen Studio is the confident co‑pilot for creators — strategy, generation, canvas, and planning in one AI workspace.",
    applicationCategory: "ProductivityApplication",
    operatingSystem: "Web",
    offers: [
      { "@type": "Offer", price: "0", priceCurrency: "USD", name: "Free" },
      { "@type": "Offer", price: "29", priceCurrency: "USD", name: "Creator Pro" },
      { "@type": "Offer", price: "79", priceCurrency: "USD", name: "Agency Pro" },
    ],
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do monthly credits work?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Each plan includes a monthly allowance of AI generations. Credits reset every billing cycle.",
        },
      },
      {
        "@type": "Question",
        name: "Can I collaborate with my team?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. Agency Pro includes team seats, collaboration, and role permissions.",
        },
      },
      {
        "@type": "Question",
        name: "Can I cancel anytime?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Absolutely. You can cancel at any time from your account settings.",
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <ProblemSolution />
        <section id="pricing"><Pricing /></section>
        <FAQ />
        <CTA />
      </main>
      <Footer />

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
    </div>
  );
};

export default Index;
