import React from 'react';

// Isolated styling to prevent app design system overrides
const privacyPageStyles = {
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
  sectionLg: {
    '@media (min-width: 1024px)': {
      gridTemplateColumns: '240px 1fr'
    }
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
  list: {
    listStyleType: 'disc',
    paddingLeft: '1.5rem',
    color: 'hsl(215, 20.2%, 65.1%)',
    lineHeight: '1.6',
    fontSize: '1rem'
  },
  listItem: {
    marginBottom: '0.25rem'
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

const NewPrivacy = () => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'hsl(222.2, 84%, 4.9%)',
      color: 'hsl(210, 40%, 98%)'
    }}>
      <main style={{ ...privacyPageStyles.container, ...privacyPageStyles.main }}>
        <header style={privacyPageStyles.header}>
          <h1 style={privacyPageStyles.title}>Privacy Policy</h1>
          <p style={privacyPageStyles.subtitle}>
            How we collect, use, and protect your data—written clearly and simply.
          </p>
          <p style={privacyPageStyles.lastUpdated}>
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </header>

        <section style={{
          ...privacyPageStyles.section,
          gridTemplateColumns: window.innerWidth >= 1024 ? '240px 1fr' : '1fr'
        }}>
          {/* Desktop Sidebar Navigation */}
          {window.innerWidth >= 1024 && (
            <aside>
              <nav style={privacyPageStyles.nav}>
                <a 
                  href="#overview" 
                  style={privacyPageStyles.navLink}
                  onMouseEnter={(e) => e.currentTarget.style.color = privacyPageStyles.navLinkHover.color}
                  onMouseLeave={(e) => e.currentTarget.style.color = privacyPageStyles.navLink.color}
                >
                  Overview
                </a>
                <a 
                  href="#collection" 
                  style={privacyPageStyles.navLink}
                  onMouseEnter={(e) => e.currentTarget.style.color = privacyPageStyles.navLinkHover.color}
                  onMouseLeave={(e) => e.currentTarget.style.color = privacyPageStyles.navLink.color}
                >
                  Information We Collect
                </a>
                <a 
                  href="#use" 
                  style={privacyPageStyles.navLink}
                  onMouseEnter={(e) => e.currentTarget.style.color = privacyPageStyles.navLinkHover.color}
                  onMouseLeave={(e) => e.currentTarget.style.color = privacyPageStyles.navLink.color}
                >
                  How We Use Information
                </a>
                <a 
                  href="#sharing" 
                  style={privacyPageStyles.navLink}
                  onMouseEnter={(e) => e.currentTarget.style.color = privacyPageStyles.navLinkHover.color}
                  onMouseLeave={(e) => e.currentTarget.style.color = privacyPageStyles.navLink.color}
                >
                  Data Sharing
                </a>
                <a 
                  href="#ai" 
                  style={privacyPageStyles.navLink}
                  onMouseEnter={(e) => e.currentTarget.style.color = privacyPageStyles.navLinkHover.color}
                  onMouseLeave={(e) => e.currentTarget.style.color = privacyPageStyles.navLink.color}
                >
                  AI & Model Use
                </a>
                <a 
                  href="#retention" 
                  style={privacyPageStyles.navLink}
                  onMouseEnter={(e) => e.currentTarget.style.color = privacyPageStyles.navLinkHover.color}
                  onMouseLeave={(e) => e.currentTarget.style.color = privacyPageStyles.navLink.color}
                >
                  Data Retention
                </a>
                <a 
                  href="#security" 
                  style={privacyPageStyles.navLink}
                  onMouseEnter={(e) => e.currentTarget.style.color = privacyPageStyles.navLinkHover.color}
                  onMouseLeave={(e) => e.currentTarget.style.color = privacyPageStyles.navLink.color}
                >
                  Security
                </a>
                <a 
                  href="#rights" 
                  style={privacyPageStyles.navLink}
                  onMouseEnter={(e) => e.currentTarget.style.color = privacyPageStyles.navLinkHover.color}
                  onMouseLeave={(e) => e.currentTarget.style.color = privacyPageStyles.navLink.color}
                >
                  Your Rights
                </a>
                <a 
                  href="#children" 
                  style={privacyPageStyles.navLink}
                  onMouseEnter={(e) => e.currentTarget.style.color = privacyPageStyles.navLinkHover.color}
                  onMouseLeave={(e) => e.currentTarget.style.color = privacyPageStyles.navLink.color}
                >
                  Children's Privacy
                </a>
                <a 
                  href="#changes" 
                  style={privacyPageStyles.navLink}
                  onMouseEnter={(e) => e.currentTarget.style.color = privacyPageStyles.navLinkHover.color}
                  onMouseLeave={(e) => e.currentTarget.style.color = privacyPageStyles.navLink.color}
                >
                  Changes
                </a>
                <a 
                  href="#contact" 
                  style={privacyPageStyles.navLink}
                  onMouseEnter={(e) => e.currentTarget.style.color = privacyPageStyles.navLinkHover.color}
                  onMouseLeave={(e) => e.currentTarget.style.color = privacyPageStyles.navLink.color}
                >
                  Contact
                </a>
              </nav>
            </aside>
          )}

          <article>
            <div style={privacyPageStyles.card}>
              <div style={privacyPageStyles.cardContent}>
                <section id="overview">
                  <h2 style={privacyPageStyles.sectionHeader}>1. Overview</h2>
                  <p style={privacyPageStyles.text}>
                    We respect your privacy. This Policy explains how we collect, use, disclose, and protect information when you use CreateGen Studio (the "Service").
                  </p>
                </section>

                <section id="collection">
                  <h2 style={privacyPageStyles.sectionHeader}>2. Information We Collect</h2>
                  <ul style={privacyPageStyles.list}>
                    <li style={privacyPageStyles.listItem}>Account Data: Name, email, and authentication details.</li>
                    <li style={privacyPageStyles.listItem}>Usage Data: Product interactions, feature usage, and device information.</li>
                    <li style={privacyPageStyles.listItem}>User Content: Content you create, upload, or process through the Service.</li>
                    <li style={privacyPageStyles.listItem}>Third-Party Data: Information received through integrations (e.g., YouTube API), subject to their terms.</li>
                  </ul>
                </section>

                <section id="use">
                  <h2 style={privacyPageStyles.sectionHeader}>3. How We Use Information</h2>
                  <ul style={privacyPageStyles.list}>
                    <li style={privacyPageStyles.listItem}>To provide, maintain, and improve the Service.</li>
                    <li style={privacyPageStyles.listItem}>To personalize your experience and power AI features.</li>
                    <li style={privacyPageStyles.listItem}>To communicate with you about updates, billing, and support.</li>
                    <li style={privacyPageStyles.listItem}>To ensure security, prevent abuse, and comply with legal obligations.</li>
                  </ul>
                </section>

                <section id="sharing">
                  <h2 style={privacyPageStyles.sectionHeader}>4. Data Sharing</h2>
                  <p style={privacyPageStyles.text}>
                    We do not sell your personal information. We may share information with trusted service providers and third-party integrations solely to provide the Service (e.g., infrastructure, analytics, payment processing). We require appropriate confidentiality and security commitments.
                  </p>
                </section>

                <section id="ai">
                  <h2 style={privacyPageStyles.sectionHeader}>5. AI & Model Use</h2>
                  <p style={privacyPageStyles.text}>
                    We do not train foundation models on your private User Content without explicit permission. We may use de-identified, aggregated usage analytics to improve product performance and reliability.
                  </p>
                </section>

                <section id="retention">
                  <h2 style={privacyPageStyles.sectionHeader}>6. Data Retention</h2>
                  <p style={privacyPageStyles.text}>
                    We retain information only as long as necessary to provide the Service and comply with legal obligations. You may request export or deletion of your data at any time, subject to applicable law.
                  </p>
                </section>

                <section id="security">
                  <h2 style={privacyPageStyles.sectionHeader}>7. Security</h2>
                  <p style={privacyPageStyles.text}>
                    We use industry-standard security measures, including encryption in transit and at rest where applicable. No method of transmission is 100% secure; please use strong passwords and enable additional protections where available.
                  </p>
                </section>

                <section id="rights">
                  <h2 style={privacyPageStyles.sectionHeader}>8. Your Rights</h2>
                  <p style={privacyPageStyles.text}>
                    Depending on your location, you may have rights to access, correct, delete, or port your data. Contact us at{' '}
                    <a 
                      href="mailto:privacy@creategen.studio" 
                      style={privacyPageStyles.link}
                      onMouseEnter={(e) => e.currentTarget.style.color = privacyPageStyles.linkHover.color}
                      onMouseLeave={(e) => e.currentTarget.style.color = privacyPageStyles.link.color}
                    >
                      privacy@creategen.studio
                    </a>{' '}
                    for requests.
                  </p>
                </section>

                <section id="children">
                  <h2 style={privacyPageStyles.sectionHeader}>9. Children's Privacy</h2>
                  <p style={privacyPageStyles.text}>
                    The Service is not directed to children under 13. If you believe a child has provided us information, contact us and we will take appropriate steps.
                  </p>
                </section>

                <section id="changes">
                  <h2 style={privacyPageStyles.sectionHeader}>10. Changes to this Policy</h2>
                  <p style={privacyPageStyles.text}>
                    We may update this Policy periodically. Material changes will be communicated through the Service. Continued use indicates acceptance.
                  </p>
                </section>

                <section id="contact">
                  <h2 style={privacyPageStyles.sectionHeader}>11. Contact</h2>
                  <p style={privacyPageStyles.text}>
                    For questions about this Policy, contact us at{' '}
                    <a 
                      href="mailto:privacy@creategen.studio" 
                      style={privacyPageStyles.link}
                      onMouseEnter={(e) => e.currentTarget.style.color = privacyPageStyles.linkHover.color}
                      onMouseLeave={(e) => e.currentTarget.style.color = privacyPageStyles.link.color}
                    >
                      privacy@creategen.studio
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

export default NewPrivacy;
