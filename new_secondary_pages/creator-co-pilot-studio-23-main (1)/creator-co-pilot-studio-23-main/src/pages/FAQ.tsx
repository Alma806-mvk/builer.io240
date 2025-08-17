import { SEOHead } from "@/components/SEO";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    q: "How do the AI generation credits work?",
    a: "Each time you generate content (scripts, ideas, outlines, etc.), a credit is used. Your plan includes a monthly credit allowance that resets every billing cycle. We show your live balance in-app, and larger operations may consume more credits depending on complexity.",
  },
  {
    q: "Can I cancel my subscription at any time?",
    a: "Yes. You can cancel anytime from your billing settings. Your plan will remain active until the end of the current billing period, and you won’t be charged again.",
  },
  {
    q: "What is the difference between the Creator Pro and Agency Pro plans?",
    a: "Creator Pro is optimized for individual creators who need advanced research tools (YT Analysis, Trends) and higher generation limits. Agency Pro adds team collaboration, the highest credit limits, and access to all Ultimate enterprise-level templates for multi-brand execution.",
  },
  {
    q: "Is my data and content secure?",
    a: "Absolutely. We follow industry best practices for encryption in transit and at rest. You control your content and can export or delete it at any time. We do not train models on your private data without explicit consent.",
  },
  {
    q: "Does CreateGen Studio work on mobile devices?",
    a: "Yes. While the desktop experience is most powerful, our responsive design ensures you can review, comment, and manage key workflows from mobile and tablet.",
  },
  {
    q: "What happens if I go over my monthly credit limit?",
    a: "You’ll receive a notification in-app. You can upgrade your plan, add on credits, or wait until your credits reset at the start of the next billing cycle.",
  },
];

const FAQ = () => {
  const canonical = typeof window !== 'undefined' ? window.location.href : undefined;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <>
      <SEOHead
        title="FAQ — CreateGen Studio"
        description="Answers to the most common questions about plans, credits, and security."
        canonical={canonical}
        jsonLd={jsonLd}
      />
      <header className="container py-16 md:py-24 text-center">
        <h1 className="font-display text-4xl md:text-5xl leading-tight">Frequently Asked Questions</h1>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
          Clear, direct answers so you can move forward with confidence.
        </p>
      </header>

      <section className="container pb-20">
        <Accordion type="single" collapsible className="mx-auto max-w-3xl">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </>
  );
};

export default FAQ;
