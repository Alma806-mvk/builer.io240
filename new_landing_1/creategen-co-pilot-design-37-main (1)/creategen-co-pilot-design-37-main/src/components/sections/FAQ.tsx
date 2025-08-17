import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQ = () => {
  return (
    <section id="faq" className="relative bg-background py-20 sm:py-24">
      <div className="container mx-auto">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Frequently asked questions</h2>
          <p className="mt-4 text-muted-foreground">Everything you need to know about pricing and the product.</p>
        </div>

        <div className="mx-auto mt-10 max-w-3xl rounded-xl border border-border/60 bg-background/60 p-4 sm:p-6">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="credits">
              <AccordionTrigger>How do monthly credits work?</AccordionTrigger>
              <AccordionContent>
                Each plan includes a monthly allowance of AI generations. Credits reset every billing cycle.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="team">
              <AccordionTrigger>Can I collaborate with my team?</AccordionTrigger>
              <AccordionContent>
                Yes. Agency Pro includes team seats, collaboration, and role permissions.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="cancel">
              <AccordionTrigger>Can I cancel anytime?</AccordionTrigger>
              <AccordionContent>
                Absolutely. You can cancel at any time from your account settings.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
