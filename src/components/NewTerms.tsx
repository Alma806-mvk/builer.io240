import React from 'react';

// Isolated styling to prevent app design system overrides
const termsPageStyles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1.5rem'
  },
  main: {
    paddingTop: '5rem', // Account for navbar
    paddingBottom: '4rem'
  },
  header: {
    maxWidth: '48rem',
    margin: '0 auto',
    textAlign: 'center' as const,
    marginBottom: '2.5rem'
  },
  title: {
    fontSize: 'clamp(2rem, 5vw, 2.5rem)',
    fontWeight: '600',
    lineHeight: '1.2',
    letterSpacing: '-0.025em',
    background: 'linear-gradient(135deg, hsl(266, 85%, 60%), hsl(188, 92%, 55%))',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    fontFamily: '"Space Grotesk", Inter, system-ui, sans-serif',
    marginBottom: '0.75rem'
  },
  subtitle: {
    color: 'hsl(215, 20.2%, 65.1%)',
    fontSize: '1.125rem',
    lineHeight: '1.6',
    marginBottom: '0.25rem'
  },
  lastUpdated: {
    fontSize: '0.75rem',
    color: 'hsl(215, 20.2%, 65.1%)'
  },
  section: {
    display: 'grid',
    gap: '2rem',
    gridTemplateColumns: '1fr'
  },
  sidebar: {
    display: 'none',
    '@media (min-width: 1024px)': {
      display: 'block'
    }
  },
  nav: {
    position: 'sticky' as const,
    top: '6rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
    fontSize: '0.875rem'
  },
  navLink: {
    display: 'block',
    color: 'hsl(215, 20.2%, 65.1%)',
    textDecoration: 'none',
    transition: 'color 0.2s',
    padding: '0.25rem 0'
  },
  navLinkHover: {
    color: 'hsl(210, 40%, 98%)'
  },
  card: {
    borderRadius: '0.75rem',
    border: '1px solid hsl(217.2, 32.6%, 17.5%)',
    backgroundColor: 'hsl(222.2, 84%, 4.9% / 0.6)',
    backdropFilter: 'blur(10px)'
  },
  cardContent: {
    padding: '2rem 2.5rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2rem'
  },
  sectionHeader: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: 'hsl(210, 40%, 98%)',
    marginBottom: '0.5rem'
  },
  text: {
    color: 'hsl(215, 20.2%, 65.1%)',
    lineHeight: '1.6',
    fontSize: '1rem'
  },
  link: {
    color: 'hsl(188, 92%, 55%)',
    textDecoration: 'underline',
    textUnderlineOffset: '4px',
    transition: 'color 0.2s'
  },
  linkHover: {
    color: 'hsl(266, 85%, 60%)'
  }
};

const NewTerms = () => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'hsl(222.2, 84%, 4.9%)',
      color: 'hsl(210, 40%, 98%)'
    }}>
      <main style={{ ...termsPageStyles.container, ...termsPageStyles.main }}>
        <header style={termsPageStyles.header}>
          <h1 style={termsPageStyles.title}>Terms of Service</h1>
          <p style={termsPageStyles.subtitle}>
            Clear, fair terms for using CreateGen Studio.
          </p>
          <p style={termsPageStyles.lastUpdated}>
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </header>

        <section style={{
          ...termsPageStyles.section,
          gridTemplateColumns: window.innerWidth >= 1024 ? '240px 1fr' : '1fr'
        }}>
          {/* Desktop Sidebar Navigation */}
          {window.innerWidth >= 1024 && (
            <aside>
              <nav style={termsPageStyles.nav}>
                <a 
                  href="#agreement" 
                  style={termsPageStyles.navLink}
                  onMouseEnter={(e) => e.currentTarget.style.color = termsPageStyles.navLinkHover.color}
                  onMouseLeave={(e) => e.currentTarget.style.color = termsPageStyles.navLink.color}
                >
                  Agreement to Terms
                </a>
                <a 
                  href="#service" 
                  style={termsPageStyles.navLink}
                  onMouseEnter={(e) => e.currentTarget.style.color = termsPageStyles.navLinkHover.color}
                  onMouseLeave={(e) => e.currentTarget.style.color = termsPageStyles.navLink.color}
                >
                  Description of Service
                </a>
                <a 
                  href="#accounts" 
                  style={termsPageStyles.navLink}
                  onMouseEnter={(e) => e.currentTarget.style.color = termsPageStyles.navLinkHover.color}
                  onMouseLeave={(e) => e.currentTarget.style.color = termsPageStyles.navLink.color}
                >
                  Accounts & Eligibility
                </a>
                <a 
                  href="#acceptable-use" 
                  style={termsPageStyles.navLink}
                  onMouseEnter={(e) => e.currentTarget.style.color = termsPageStyles.navLinkHover.color}
                  onMouseLeave={(e) => e.currentTarget.style.color = termsPageStyles.navLink.color}
                >
                  Acceptable Use
                </a>
                <a 
                  href="#user-content" 
                  style={termsPageStyles.navLink}
                  onMouseEnter={(e) => e.currentTarget.style.color = termsPageStyles.navLinkHover.color}
                  onMouseLeave={(e) => e.currentTarget.style.color = termsPageStyles.navLink.color}
                >
                  User Content
                </a>
                <a 
                  href="#ai-content" 
                  style={termsPageStyles.navLink}
                  onMouseEnter={(e) => e.currentTarget.style.color = termsPageStyles.navLinkHover.color}
                  onMouseLeave={(e) => e.currentTarget.style.color = termsPageStyles.navLink.color}
                >
                  AI-Generated Content
                </a>
                <a 
                  href="#billing" 
                  style={termsPageStyles.navLink}
                  onMouseEnter={(e) => e.currentTarget.style.color = termsPageStyles.navLinkHover.color}
                  onMouseLeave={(e) => e.currentTarget.style.color = termsPageStyles.navLink.color}
                >
                  Billing & Subscriptions
                </a>
                <a 
                  href="#privacy" 
                  style={termsPageStyles.navLink}
                  onMouseEnter={(e) => e.currentTarget.style.color = termsPageStyles.navLinkHover.color}
                  onMouseLeave={(e) => e.currentTarget.style.color = termsPageStyles.navLink.color}
                >
                  Privacy
                </a>
                <a 
                  href="#third-party" 
                  style={termsPageStyles.navLink}
                  onMouseEnter={(e) => e.currentTarget.style.color = termsPageStyles.navLinkHover.color}
                  onMouseLeave={(e) => e.currentTarget.style.color = termsPageStyles.navLink.color}
                >
                  Third-Party Services
                </a>
                <a 
                  href="#ip" 
                  style={termsPageStyles.navLink}
                  onMouseEnter={(e) => e.currentTarget.style.color = termsPageStyles.navLinkHover.color}
                  onMouseLeave={(e) => e.currentTarget.style.color = termsPageStyles.navLink.color}
                >
                  Intellectual Property
                </a>
                <a 
                  href="#disclaimers" 
                  style={termsPageStyles.navLink}
                  onMouseEnter={(e) => e.currentTarget.style.color = termsPageStyles.navLinkHover.color}
                  onMouseLeave={(e) => e.currentTarget.style.color = termsPageStyles.navLink.color}
                >
                  Disclaimers
                </a>
                <a 
                  href="#liability" 
                  style={termsPageStyles.navLink}
                  onMouseEnter={(e) => e.currentTarget.style.color = termsPageStyles.navLinkHover.color}
                  onMouseLeave={(e) => e.currentTarget.style.color = termsPageStyles.navLink.color}
                >
                  Limitation of Liability
                </a>
                <a 
                  href="#termination" 
                  style={termsPageStyles.navLink}
                  onMouseEnter={(e) => e.currentTarget.style.color = termsPageStyles.navLinkHover.color}
                  onMouseLeave={(e) => e.currentTarget.style.color = termsPageStyles.navLink.color}
                >
                  Termination
                </a>
                <a 
                  href="#changes" 
                  style={termsPageStyles.navLink}
                  onMouseEnter={(e) => e.currentTarget.style.color = termsPageStyles.navLinkHover.color}
                  onMouseLeave={(e) => e.currentTarget.style.color = termsPageStyles.navLink.color}
                >
                  Changes to Terms
                </a>
                <a 
                  href="#contact" 
                  style={termsPageStyles.navLink}
                  onMouseEnter={(e) => e.currentTarget.style.color = termsPageStyles.navLinkHover.color}
                  onMouseLeave={(e) => e.currentTarget.style.color = termsPageStyles.navLink.color}
                >
                  Contact
                </a>
              </nav>
            </aside>
          )}

          <article>
            <div style={termsPageStyles.card}>
              <div style={termsPageStyles.cardContent}>
                <section id="agreement">
                  <h2 style={termsPageStyles.sectionHeader}>1. Agreement to Terms</h2>
                  <p style={termsPageStyles.text}>
                    By accessing or using CreateGen Studio (the "Service"), you agree to be bound by these Terms of Service (the "Terms"). If you do not agree to these Terms, you must not use the Service.
                  </p>
                </section>

                <section id="service">
                  <h2 style={termsPageStyles.sectionHeader}>2. Description of Service</h2>
                  <p style={termsPageStyles.text}>
                    CreateGen Studio is an AI-assisted content platform that provides research, planning, and creation tools. Certain features may connect to third-party services (e.g., YouTube API) and process user-generated content. Features may evolve over time.
                  </p>
                </section>

                <section id="accounts">
                  <h2 style={termsPageStyles.sectionHeader}>3. Accounts & Eligibility</h2>
                  <p style={termsPageStyles.text}>
                    You must be at least 13 years old (or the age of digital consent in your jurisdiction) to use the Service. You are responsible for safeguarding your account credentials and for all activity under your account.
                  </p>
                </section>

                <section id="acceptable-use">
                  <h2 style={termsPageStyles.sectionHeader}>4. Acceptable Use</h2>
                  <p style={termsPageStyles.text}>
                    You agree not to misuse the Service, including but not limited to: violating laws or third-party rights, uploading malicious code, attempting unauthorized access, or using automated systems to extract data without consent. You agree to comply with any third-party API policies when features are used (e.g., YouTube API Terms).
                  </p>
                </section>

                <section id="user-content">
                  <h2 style={termsPageStyles.sectionHeader}>5. User Content</h2>
                  <p style={termsPageStyles.text}>
                    You retain ownership of any content you create or upload ("User Content"). You grant us a limited, worldwide, non-exclusive license to process your User Content solely to provide and improve the Service. We do not use private User Content to train foundation models without explicit permission.
                  </p>
                </section>

                <section id="ai-content">
                  <h2 style={termsPageStyles.sectionHeader}>6. AI-Generated Content</h2>
                  <p style={termsPageStyles.text}>
                    Outputs generated by the Service may be subject to review or editing by you. You are responsible for verifying outputs for accuracy and compliance. We make no guarantees regarding the originality, legality, or suitability of AI outputs for your specific purposes.
                  </p>
                </section>

                <section id="billing">
                  <h2 style={termsPageStyles.sectionHeader}>7. Billing & Subscriptions</h2>
                  <p style={termsPageStyles.text}>
                    Paid plans renew automatically each billing cycle unless canceled. Taxes may apply depending on your location. Refunds are handled according to our refund policy where applicable. Usage-based features (e.g., AI credits) reset at the start of each billing period.
                  </p>
                </section>

                <section id="privacy">
                  <h2 style={termsPageStyles.sectionHeader}>8. Privacy</h2>
                  <p style={termsPageStyles.text}>
                    Your privacy is important to us. Please review our{' '}
                    <a 
                      href="/privacy" 
                      style={termsPageStyles.link}
                      onMouseEnter={(e) => e.currentTarget.style.color = termsPageStyles.linkHover.color}
                      onMouseLeave={(e) => e.currentTarget.style.color = termsPageStyles.link.color}
                    >
                      Privacy Policy
                    </a>{' '}
                    for details on how we collect, use, and safeguard your data.
                  </p>
                </section>

                <section id="third-party">
                  <h2 style={termsPageStyles.sectionHeader}>9. Third-Party Services</h2>
                  <p style={termsPageStyles.text}>
                    Certain functionality may rely on third-party platforms (e.g., YouTube API). We are not responsible for third-party services and do not control their terms or policies. Your use of those services is subject to their respective terms.
                  </p>
                </section>

                <section id="ip">
                  <h2 style={termsPageStyles.sectionHeader}>10. Intellectual Property</h2>
                  <p style={termsPageStyles.text}>
                    All rights, title, and interest in the Service (excluding User Content) are owned by CreateGen Studio or its licensors. No rights are granted except as expressly set forth in these Terms.
                  </p>
                </section>

                <section id="disclaimers">
                  <h2 style={termsPageStyles.sectionHeader}>11. Disclaimers</h2>
                  <p style={termsPageStyles.text}>
                    The Service is provided "as is" and "as available." We disclaim all warranties to the fullest extent permitted by law, including warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the Service will be uninterrupted or error-free.
                  </p>
                </section>

                <section id="liability">
                  <h2 style={termsPageStyles.sectionHeader}>12. Limitation of Liability</h2>
                  <p style={termsPageStyles.text}>
                    To the maximum extent permitted by law, CreateGen Studio shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or for lost profits or revenues. Our aggregate liability shall not exceed the amounts paid by you to us within the 12 months preceding the claim.
                  </p>
                </section>

                <section id="termination">
                  <h2 style={termsPageStyles.sectionHeader}>13. Termination</h2>
                  <p style={termsPageStyles.text}>
                    We may suspend or terminate access to the Service for any violation of these Terms. You may cancel at any time through your account settings.
                  </p>
                </section>

                <section id="changes">
                  <h2 style={termsPageStyles.sectionHeader}>14. Changes to Terms</h2>
                  <p style={termsPageStyles.text}>
                    We may modify these Terms from time to time. We will post the updated Terms with an updated "Last updated" date. Continued use of the Service after changes constitutes acceptance of the new Terms.
                  </p>
                </section>

                <section id="contact">
                  <h2 style={termsPageStyles.sectionHeader}>15. Contact</h2>
                  <p style={termsPageStyles.text}>
                    For questions regarding these Terms, contact us at{' '}
                    <a 
                      href="mailto:legal@creategen.studio" 
                      style={termsPageStyles.link}
                      onMouseEnter={(e) => e.currentTarget.style.color = termsPageStyles.linkHover.color}
                      onMouseLeave={(e) => e.currentTarget.style.color = termsPageStyles.link.color}
                    >
                      legal@creategen.studio
                    </a>.
                  </p>
                </section>
              </div>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
};

export default NewTerms;
