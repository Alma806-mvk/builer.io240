import React from "react";
import { XMarkIcon } from "./IconComponents";

interface TermsOfServiceProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsOfService: React.FC<TermsOfServiceProps> = ({ isOpen, onClose }) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Simple body scroll prevention
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Keyboard navigation support
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "Home" && scrollRef.current) {
        scrollRef.current.scrollTop = 0;
      } else if (e.key === "End" && scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-sm">
      <div className="flex items-center justify-center min-h-full p-4">
        <div className="relative w-full max-w-4xl bg-slate-800 rounded-3xl border border-slate-700/50 shadow-2xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700/50 flex-shrink-0">
            <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-700/50"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div
            ref={scrollRef}
            className="p-6 text-slate-300 space-y-6 overflow-y-auto flex-1 overscroll-contain modal-scrollbar"
            role="region"
            aria-label="Terms of Service content"
            tabIndex={0}
          >
            <div className="text-sm text-slate-400 mb-6">
              <p>Last updated: {new Date().toLocaleDateString()}</p>
            </div>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="leading-relaxed">
                By accessing or using CreateGen Studio ("Service"), you agree to
                be bound by these Terms of Service ("Terms"). If you disagree
                with any part of these terms, then you may not access the
                Service. These Terms constitute a legally binding agreement
                between you and CreateGen Studio.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                2. Description of Service
              </h2>
              <p className="leading-relaxed mb-3">
                CreateGen Studio is an AI-powered content creation platform that
                provides:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>AI-generated content creation tools</li>
                <li>Premium templates and design assets</li>
                <li>Content analytics and insights</li>
                <li>Cloud storage and collaboration features</li>
                <li>Integration with social media platforms</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                3. User Accounts
              </h2>
              <p className="leading-relaxed mb-3">
                To access certain features of the Service, you must create an
                account. You agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>
                  Accept responsibility for all activities under your account
                </li>
                <li>Notify us immediately of any unauthorized use</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                4. Subscription and Billing
              </h2>
              <p className="leading-relaxed mb-3">
                Our Service offers both free and paid subscription plans:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Free tier includes 25 AI generations per month</li>
                <li>
                  Paid subscriptions provide additional features and usage
                  limits
                </li>
                <li>
                  Billing occurs monthly or annually based on your chosen plan
                </li>
                <li>You may cancel your subscription at any time</li>
                <li>
                  Refunds are processed according to our 30-day money-back
                  guarantee
                </li>
                <li>We use Stripe for secure payment processing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                5. Acceptable Use Policy
              </h2>
              <p className="leading-relaxed mb-3">
                You agree not to use the Service to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  Create content that is illegal, harmful, or violates any law
                </li>
                <li>Infringe on intellectual property rights of others</li>
                <li>Generate spam, malware, or malicious content</li>
                <li>Create deepfakes or misleading media without disclosure</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Attempt to reverse engineer or exploit our AI models</li>
                <li>
                  Use the Service for commercial purposes beyond your
                  subscription tier
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                6. Intellectual Property
              </h2>
              <p className="leading-relaxed mb-3">Content and Ownership:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  You retain ownership of content you create using our Service
                </li>
                <li>
                  You grant us a license to process and store your content
                </li>
                <li>
                  Our AI models, software, and platform remain our intellectual
                  property
                </li>
                <li>
                  Premium templates and assets are licensed for your use per
                  your subscription
                </li>
                <li>
                  You may not redistribute or resell our proprietary assets
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                7. Content Moderation
              </h2>
              <p className="leading-relaxed">
                We reserve the right to review, moderate, or remove content that
                violates these Terms. Our AI safety systems automatically filter
                inappropriate content, but we may also conduct manual reviews
                when necessary. Repeated violations may result in account
                suspension or termination.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                8. Privacy and Data Protection
              </h2>
              <p className="leading-relaxed">
                Your privacy is important to us. Our Privacy Policy explains how
                we collect, use, and protect your information. By using the
                Service, you agree to our data practices as described in our
                Privacy Policy. We comply with GDPR, CCPA, and other applicable
                privacy regulations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                9. Disclaimers and Limitations
              </h2>
              <p className="leading-relaxed mb-3">
                The Service is provided "as is" without warranties. We disclaim
                all warranties including:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Accuracy or reliability of AI-generated content</li>
                <li>Uninterrupted or error-free operation</li>
                <li>Fitness for a particular purpose</li>
                <li>Non-infringement of third-party rights</li>
              </ul>
              <p className="leading-relaxed mt-3">
                Our liability is limited to the amount paid for the Service in
                the preceding 12 months.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                10. Account Termination
              </h2>
              <p className="leading-relaxed">
                Either party may terminate the agreement at any time. Upon
                termination, your access to paid features will cease, but you
                may retain access to free tier features. We may terminate
                accounts for violations of these Terms with or without notice.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                11. Changes to Terms
              </h2>
              <p className="leading-relaxed">
                We may update these Terms periodically. Material changes will be
                communicated via email or through the Service. Continued use of
                the Service after changes constitutes acceptance of the new
                Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                12. Governing Law
              </h2>
              <p className="leading-relaxed">
                These Terms are governed by the laws of the jurisdiction where
                CreateGen Studio is incorporated. Any disputes will be resolved
                through binding arbitration, except where prohibited by law.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                13. Contact Information
              </h2>
              <p className="leading-relaxed">
                If you have questions about these Terms, please contact us at:
                <br />
                Email: legal@creategen.studio
                <br />
                Address: [Your Business Address]
              </p>
            </section>

            <div className="bg-slate-900/50 rounded-xl p-6 mt-8">
              <p className="text-sm text-slate-400">
                These Terms of Service are effective as of{" "}
                {new Date().toLocaleDateString()} and supersede all prior
                agreements. By continuing to use CreateGen Studio, you
                acknowledge that you have read, understood, and agree to be
                bound by these Terms.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
