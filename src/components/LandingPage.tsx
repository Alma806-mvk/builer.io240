import { useState } from 'react';
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import ProblemSolution from "@/components/landing/ProblemSolution";
import Pricing from "@/components/landing/Pricing";
import FAQ from "@/components/landing/FAQ";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";
import AuthModal from "@/components/AuthModal";

interface LandingPageProps {
  onSignInClick: () => void;
  onStartCreating: () => void;
  onNavigateToSecondary?: () => void;
}

const LandingPage = ({ onSignInClick, onStartCreating, onNavigateToSecondary }: LandingPageProps) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'signin' | 'signup'>('signin');

  const handleStartFree = () => {
    setAuthModalTab('signup'); // Get started goes to signup
    setIsAuthModalOpen(true);
  };

  const handleSignIn = () => {
    setAuthModalTab('signin'); // Sign in goes to signin
    setIsAuthModalOpen(true);
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    // User is now authenticated, the auth context will handle the state change
  };

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
    <div className="landing-page min-h-screen bg-background text-foreground">
      <Navbar onSignInClick={handleSignIn} onStartCreating={handleStartFree} onNavigateToSecondary={onNavigateToSecondary} />
      <main>
        <Hero onSignInClick={handleSignIn} onStartCreating={handleStartFree} onStartFree={handleStartFree} />
        <Features />
        <HowItWorks />
        <ProblemSolution />
        <section id="pricing"><Pricing /></section>
        <FAQ />
        <CTA onStartCreating={handleStartFree} />
      </main>
      <Footer onNavigateToSecondary={onNavigateToSecondary} />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={handleCloseAuthModal}
        onAuthSuccess={handleAuthSuccess}
        defaultTab={authModalTab}
        onNavigateToTerms={() => {
          const url = window.location.origin + '/terms';
          window.open(url, '_blank');
        }}
        onNavigateToPrivacy={() => {
          const url = window.location.origin + '/privacy';
          window.open(url, '_blank');
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
    </div>
  );
};

export default LandingPage;
