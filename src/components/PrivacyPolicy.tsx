import React from "react";
import { XMarkIcon } from "./IconComponents";

interface PrivacyPolicyProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ isOpen, onClose }) => {
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
            <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
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
            aria-label="Privacy Policy content"
            tabIndex={0}
          >
            <div className="text-sm text-slate-400 mb-6">
              <p>Last updated: {new Date().toLocaleDateString()}</p>
            </div>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                1. Introduction
              </h2>
              <p className="leading-relaxed">
                At CreateGen Studio, we respect your privacy and are committed
                to protecting your personal data. This Privacy Policy explains
                how we collect, use, process, and safeguard your information
                when you use our AI-powered content creation platform. We comply
                with GDPR, CCPA, and other applicable privacy regulations
                worldwide.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                2. Information We Collect
              </h2>

              <h3 className="text-lg font-medium text-white mb-3">
                2.1 Information You Provide
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li>Account information (email, password, profile details)</li>
                <li>Payment information (processed securely through Stripe)</li>
                <li>
                  Content you create, upload, or generate using our Service
                </li>
                <li>Communications with our support team</li>
                <li>Feedback, surveys, and user research participation</li>
              </ul>

              <h3 className="text-lg font-medium text-white mb-3">
                2.2 Information We Collect Automatically
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li>Usage data (features used, time spent, content created)</li>
                <li>
                  Device information (browser type, operating system, IP
                  address)
                </li>
                <li>Performance analytics and error logs</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>

              <h3 className="text-lg font-medium text-white mb-3">
                2.3 Information from Third Parties
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Social media authentication data (Google, etc.)</li>
                <li>Payment processing information from Stripe</li>
                <li>Analytics data from Firebase and Google Analytics</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                3. How We Use Your Information
              </h2>
              <p className="leading-relaxed mb-3">
                We use your information to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide and improve our AI content generation services</li>
                <li>Process payments and manage your subscription</li>
                <li>Personalize your experience and recommendations</li>
                <li>Train and improve our AI models (using anonymized data)</li>
                <li>Send important updates and security notifications</li>
                <li>Provide customer support and respond to inquiries</li>
                <li>Analyze usage patterns to enhance our platform</li>
                <li>Comply with legal obligations and prevent fraud</li>
                <li>Send marketing communications (with your consent)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                4. AI Model Training and Content Processing
              </h2>
              <p className="leading-relaxed mb-3">
                Important information about how we handle your content:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  We may use anonymized and aggregated content data to improve
                  our AI models
                </li>
                <li>
                  Personal information is removed before any training data use
                </li>
                <li>
                  You can opt out of AI training data usage in your account
                  settings
                </li>
                <li>Your private content is never shared with other users</li>
                <li>
                  We implement strict access controls for content processing
                </li>
                <li>Content is processed using industry-standard encryption</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                5. Information Sharing and Disclosure
              </h2>
              <p className="leading-relaxed mb-3">
                We do not sell your personal information. We may share
                information in these circumstances:
              </p>

              <h3 className="text-lg font-medium text-white mb-3">
                5.1 Service Providers
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li>Google/Firebase for authentication and analytics</li>
                <li>Stripe for payment processing</li>
                <li>Cloud infrastructure providers (AWS, Google Cloud)</li>
                <li>Email service providers for communications</li>
              </ul>

              <h3 className="text-lg font-medium text-white mb-3">
                5.2 Legal Requirements
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li>When required by law or legal process</li>
                <li>To protect our rights and prevent fraud</li>
                <li>In connection with business transfers or acquisitions</li>
                <li>With your explicit consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                6. Data Security
              </h2>
              <p className="leading-relaxed mb-3">
                We implement comprehensive security measures including:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>End-to-end encryption for data transmission</li>
                <li>Advanced encryption for data storage</li>
                <li>Regular security audits and penetration testing</li>
                <li>Multi-factor authentication options</li>
                <li>SOC 2 Type II compliance</li>
                <li>Employee security training and access controls</li>
                <li>Incident response and breach notification procedures</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                7. Data Retention
              </h2>
              <p className="leading-relaxed mb-3">
                We retain your information for different periods based on type
                and purpose:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  Account data: Until account deletion or legal requirements
                </li>
                <li>
                  Content data: Until deletion by user or account termination
                </li>
                <li>Analytics data: Up to 26 months in anonymized form</li>
                <li>Payment records: 7 years for tax and legal compliance</li>
                <li>Support communications: 3 years from last interaction</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                8. Your Privacy Rights
              </h2>
              <p className="leading-relaxed mb-3">
                Depending on your location, you may have the following rights:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Access:</strong> Request copies of your personal data
                </li>
                <li>
                  <strong>Rectification:</strong> Correct inaccurate personal
                  data
                </li>
                <li>
                  <strong>Erasure:</strong> Request deletion of your personal
                  data
                </li>
                <li>
                  <strong>Restriction:</strong> Limit how we process your data
                </li>
                <li>
                  <strong>Portability:</strong> Transfer your data to another
                  service
                </li>
                <li>
                  <strong>Objection:</strong> Object to certain types of
                  processing
                </li>
                <li>
                  <strong>Withdrawal:</strong> Withdraw consent for data
                  processing
                </li>
              </ul>
              <p className="leading-relaxed mt-3">
                To exercise these rights, contact us at privacy@creategen.studio
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                9. Cookies and Tracking
              </h2>
              <p className="leading-relaxed mb-3">
                We use cookies and similar technologies for:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Essential site functionality and security</li>
                <li>Analytics and performance monitoring</li>
                <li>Personalization and user preferences</li>
                <li>Marketing and advertising (with consent)</li>
              </ul>
              <p className="leading-relaxed mt-3">
                You can manage cookie preferences in your browser settings or
                our cookie preference center.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                10. International Data Transfers
              </h2>
              <p className="leading-relaxed">
                We may transfer your data outside your country of residence. We
                ensure adequate protection through approved transfer mechanisms
                such as Standard Contractual Clauses, adequacy decisions, or
                other legally approved methods. Data processing occurs in secure
                data centers with appropriate safeguards.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                11. Children's Privacy
              </h2>
              <p className="leading-relaxed">
                Our Service is not intended for children under 13 (or 16 in the
                EU). We do not knowingly collect personal information from
                children. If we become aware that we have collected information
                from a child, we will take steps to delete it promptly.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                12. California Privacy Rights (CCPA)
              </h2>
              <p className="leading-relaxed mb-3">
                California residents have additional rights including:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Right to know what personal information is collected</li>
                <li>Right to delete personal information</li>
                <li>
                  Right to opt out of sale (we don't sell personal information)
                </li>
                <li>
                  Right to non-discrimination for exercising privacy rights
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                13. Changes to This Policy
              </h2>
              <p className="leading-relaxed">
                We may update this Privacy Policy to reflect changes in our
                practices or applicable law. Material changes will be
                communicated via email or prominent notice in our Service. The
                updated policy will be effective when posted.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                14. Contact Us
              </h2>
              <p className="leading-relaxed">
                For privacy-related questions or to exercise your rights,
                contact us at:
                <br />
                Email: privacy@creategen.studio
                <br />
                Data Protection Officer: dpo@creategen.studio
                <br />
                Address: [Your Business Address]
              </p>
            </section>

            <div className="bg-slate-900/50 rounded-xl p-6 mt-8">
              <p className="text-sm text-slate-400">
                This Privacy Policy is effective as of{" "}
                {new Date().toLocaleDateString()} and governs our collection and
                use of your information. By using CreateGen Studio, you consent
                to the collection and use of information in accordance with this
                policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
