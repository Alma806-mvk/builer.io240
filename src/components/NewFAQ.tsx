import React, { useState } from 'react';

// Isolated styling to prevent app design system overrides
const faqPageStyles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1.5rem'
  },
  section: {
    padding: '4rem 0'
  },
  sectionLarge: {
    padding: '6rem 0'
  },
  title: {
    fontSize: 'clamp(2.5rem, 5vw, 3rem)',
    fontWeight: '600',
    lineHeight: '1.2',
    letterSpacing: '-0.025em',
    color: 'hsl(210, 40%, 98%)',
    textAlign: 'center' as const,
    fontFamily: '"Space Grotesk", Inter, system-ui, sans-serif'
  },
  subtitle: {
    color: 'hsl(215, 20.2%, 65.1%)',
    fontSize: '1.125rem',
    lineHeight: '1.6',
    textAlign: 'center' as const,
    maxWidth: '32rem',
    margin: '1rem auto 0'
  },
  accordion: {
    maxWidth: '48rem',
    margin: '0 auto'
  },
  accordionItem: {
    borderBottom: '1px solid hsl(217.2, 32.6%, 17.5%)'
  },
  accordionTrigger: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '1.5rem 0',
    fontSize: '1.125rem',
    fontWeight: '500',
    color: 'hsl(210, 40%, 98%)',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left' as const,
    transition: 'color 0.2s'
  },
  accordionTriggerHover: {
    color: 'hsl(188, 92%, 55%)'
  },
  accordionContent: {
    paddingBottom: '1.5rem',
    color: 'hsl(215, 20.2%, 65.1%)',
    lineHeight: '1.6',
    fontSize: '1rem'
  },
  chevronIcon: {
    width: '1rem',
    height: '1rem',
    transition: 'transform 0.2s',
    color: 'hsl(215, 20.2%, 65.1%)',
    flexShrink: 0,
    marginLeft: '1rem'
  },
  chevronOpen: {
    transform: 'rotate(180deg)'
  }
};

const faqs = [
  {
    q: "How do the AI generation credits work?",
    a: "Each time you generate content (scripts, ideas, outlines, etc.), a credit is used. Your plan includes a monthly credit allowance that resets every billing cycle. We show your live balance in-app, and larger operations may consume more credits depending on complexity.",
  },
  {
    q: "Can I cancel my subscription at any time?",
    a: "Yes. You can cancel anytime from your billing settings. Your plan will remain active until the end of the current billing period, and you won't be charged again.",
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
    a: "You'll receive a notification in-app. You can upgrade your plan, add on credits, or wait until your credits reset at the start of the next billing cycle.",
  },
];

const ChevronDownIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg 
    style={{
      ...faqPageStyles.chevronIcon,
      ...(isOpen ? faqPageStyles.chevronOpen : {})
    }} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const AccordionItem = ({ question, answer, isOpen, onToggle }: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div style={faqPageStyles.accordionItem}>
      <button
        onClick={onToggle}
        style={{
          ...faqPageStyles.accordionTrigger,
          ...(isHovered ? faqPageStyles.accordionTriggerHover : {})
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span>{question}</span>
        <ChevronDownIcon isOpen={isOpen} />
      </button>
      {isOpen && (
        <div style={faqPageStyles.accordionContent}>
          {answer}
        </div>
      )}
    </div>
  );
};

const NewFAQ = () => {
  const [openItem, setOpenItem] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'hsl(222.2, 84%, 4.9%)',
      color: 'hsl(210, 40%, 98%)',
      paddingTop: '5rem' // Account for navbar
    }}>
      <header style={{
        ...faqPageStyles.container,
        ...faqPageStyles.sectionLarge,
        textAlign: 'center'
      }}>
        <h1 style={faqPageStyles.title}>Frequently Asked Questions</h1>
        <p style={faqPageStyles.subtitle}>
          Clear, direct answers so you can move forward with confidence.
        </p>
      </header>

      <section style={{
        ...faqPageStyles.container,
        paddingBottom: '5rem'
      }}>
        <div style={faqPageStyles.accordion}>
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              question={faq.q}
              answer={faq.a}
              isOpen={openItem === index}
              onToggle={() => toggleItem(index)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default NewFAQ;
