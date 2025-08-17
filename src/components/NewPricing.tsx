import React, { useState } from 'react';

// Completely hardcoded colors from new_secondary_pages dark theme - NO design system dependency
const colors = {
  background: 'hsl(222.2, 84%, 4.9%)',
  foreground: 'hsl(210, 40%, 98%)',
  card: 'hsl(222.2, 84%, 4.9%)',
  cardForeground: 'hsl(210, 40%, 98%)',
  primary: 'hsl(210, 40%, 98%)',
  primaryForeground: 'hsl(222.2, 47.4%, 11.2%)',
  muted: 'hsl(217.2, 32.6%, 17.5%)',
  mutedForeground: 'hsl(215, 20.2%, 65.1%)',
  border: 'hsl(217.2, 32.6%, 17.5%)',
  brandPurple: 'hsl(266, 85%, 60%)',
  brandCyan: 'hsl(188, 92%, 55%)',
  checkGreen: 'hsl(142, 76%, 56%)'
};

const gradients = {
  brand: `linear-gradient(135deg, ${colors.brandPurple}, ${colors.brandCyan})`,
  primary: `linear-gradient(135deg, ${colors.brandPurple}, ${colors.brandCyan})`,
  cardPopular: `linear-gradient(to bottom, hsl(266, 85%, 60%, 0.1), ${colors.card})`
};

const shadows = {
  glow: `0 0 30px hsl(266, 85%, 60%, 0.4)`,
  elevated: '0 10px 30px -10px rgba(0, 0, 0, 0.3)',
  glowPurple: '0 0 15px hsl(266, 85%, 60%, 0.6)'
};

// Completely isolated styling
const pricingStyles = {
  wrapper: {
    minHeight: '100vh',
    backgroundColor: colors.background,
    color: colors.foreground,
    paddingTop: '5rem',
    fontFamily: '"Inter", "system-ui", "-apple-system", "sans-serif"'
  },
  container: {
    maxWidth: '80rem',
    margin: '0 auto',
    padding: '0 1rem'
  },
  header: {
    padding: '4rem 0 6rem 0',
    textAlign: 'center' as const
  },
  title: {
    fontFamily: '"Space Grotesk", "Inter", "system-ui", "sans-serif"',
    fontSize: 'clamp(2.25rem, 5vw, 3rem)',
    lineHeight: '1.1',
    fontWeight: '600',
    color: colors.foreground
  },
  subtitle: {
    color: colors.mutedForeground,
    marginTop: '1rem',
    maxWidth: '32rem',
    margin: '1rem auto 0',
    fontSize: '1rem'
  },
  billingToggleWrapper: {
    marginTop: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  billingToggle: {
    display: 'inline-flex',
    borderRadius: '0.375rem',
    backgroundColor: colors.muted,
    padding: '0.25rem'
  },
  billingButton: {
    padding: '0.375rem 0.75rem',
    fontSize: '0.875rem',
    borderRadius: '0.125rem',
    transition: 'all 0.2s',
    cursor: 'pointer',
    border: 'none',
    backgroundColor: 'transparent'
  },
  billingButtonActive: {
    backgroundColor: colors.background,
    color: colors.foreground,
    boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
  },
  billingButtonActiveYearly: {
    backgroundColor: colors.primary,
    color: colors.primaryForeground,
    boxShadow: shadows.glow,
    animation: 'pulse 2s infinite'
  },
  billingButtonInactive: {
    color: colors.mutedForeground
  },
  section: {
    paddingBottom: '5rem'
  },
  grid: {
    display: 'grid',
    gap: '1.5rem',
    gridTemplateColumns: window.innerWidth >= 768 ? 'repeat(3, 1fr)' : '1fr'
  },
  card: {
    display: 'flex',
    flexDirection: 'column' as const,
    borderRadius: '0.75rem',
    border: `1px solid ${colors.border}`,
    backgroundColor: colors.card,
    transition: 'transform 0.2s',
    boxShadow: shadows.elevated,
    overflow: 'hidden'
  },
  cardHover: {
    transform: 'translateY(-2px) scale(1.02)'
  },
  cardPopular: {
    position: 'relative' as const,
    border: `2px solid hsl(266, 85%, 60%, 0.5)`,
    boxShadow: shadows.glow,
    background: gradients.cardPopular
  },
  popularBadge: {
    position: 'absolute' as const,
    top: '-0.75rem',
    left: '1rem',
    borderRadius: '9999px',
    padding: '0.25rem 0.75rem',
    fontSize: '0.75rem',
    background: gradients.brand,
    color: colors.foreground,
    boxShadow: shadows.glowPurple,
    animation: 'pulse 2s infinite',
    fontWeight: '500'
  },
  cardHeader: {
    padding: '1.5rem'
  },
  cardTitle: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    fontWeight: '600',
    marginBottom: '0.5rem'
  },
  planName: {
    color: colors.foreground,
    fontSize: '1rem'
  },
  priceContainer: {
    fontSize: '1.125rem',
    display: 'flex',
    alignItems: 'center'
  },
  priceNumber: {
    color: colors.foreground,
    fontWeight: '600'
  },
  priceUnit: {
    color: colors.mutedForeground
  },
  yearlyBadge: {
    marginLeft: '0.5rem',
    fontSize: '0.75rem',
    padding: '0.125rem 0.5rem',
    borderRadius: '9999px',
    backgroundColor: 'hsl(266, 85%, 60%, 0.1)',
    color: colors.brandPurple,
    border: '1px solid hsl(266, 85%, 60%, 0.2)',
    fontWeight: '500'
  },
  description: {
    fontSize: '0.875rem',
    color: colors.mutedForeground,
    marginTop: '0.5rem'
  },
  yearlyDescription: {
    fontSize: '0.75rem',
    color: colors.mutedForeground,
    marginTop: '0.25rem'
  },
  cardContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    padding: '0 1.5rem 1.5rem 1.5rem'
  },
  featureList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
    fontSize: '0.875rem'
  },
  featureListSpaced: {
    marginTop: '0.75rem',
    marginBottom: '1.5rem'
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  checkIcon: {
    width: '1rem',
    height: '1rem',
    color: colors.foreground,
    flexShrink: 0
  },
  xIcon: {
    width: '1rem',
    height: '1rem',
    color: colors.mutedForeground,
    flexShrink: 0
  },
  featureTextIncluded: {
    color: colors.foreground
  },
  featureTextExcluded: {
    color: colors.mutedForeground
  },
  button: {
    marginTop: 'auto',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '2.75rem',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'all 0.2s',
    cursor: 'pointer',
    textDecoration: 'none',
    border: 'none'
  },
  buttonHero: {
    border: `1px solid ${colors.border}`,
    backgroundColor: colors.background,
    color: colors.foreground
  },
  buttonHeroHover: {
    backgroundColor: colors.muted
  },
  buttonGradient: {
    background: gradients.brand,
    color: colors.foreground,
    border: 'none'
  },
  buttonGradientHover: {
    opacity: 0.9
  }
};

const features = [
  "Studio Hub",
  "Generator",
  "Canvas",
  "AI Assistant",
  "Trends (Opportunity Engine)",
  "YT Analysis",
  "Strategy Planner",
  "Calendar",
  "History",
  "Pro Templates",
  "Priority Support",
  "Team Collaboration",
];

const planMatrix: Record<string, boolean[]> = {
  Free:             [true, true, true, true, false, false, false, true, true, false, false, false],
  "Creator Pro":   [true, true, true, true, true, true, true, true, true, true, true, false],
  "Agency Pro":    [true, true, true, true, true, true, true, true, true, true, true, true],
};

const CheckIcon = () => (
  <svg style={pricingStyles.checkIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon = () => (
  <svg style={pricingStyles.xIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const NewPricing = ({ onStartFree }: { onStartFree: () => void }) => {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  
  const discount = 0.2;
  const pro = 29;
  const agency = 79;
  const display = (base: number) => billing === 'monthly' ? base : Math.round(base * (1 - discount));
  const annual = (base: number) => Math.round(base * 12 * (1 - discount));

  const Row = ({ label, value, included }: { label: string; value?: string; included: boolean }) => (
    <li style={pricingStyles.featureItem}>
      {included ? <CheckIcon /> : <XIcon />}
      <span style={included ? pricingStyles.featureTextIncluded : pricingStyles.featureTextExcluded}>
        {label}{value ? `: ${value}` : ""}
      </span>
    </li>
  );

  return (
    <div style={pricingStyles.wrapper}>
      {/* Add keyframes for animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
      `}</style>

      <header style={{...pricingStyles.container, ...pricingStyles.header}}>
        <h1 style={pricingStyles.title}>Pricing that scales with you</h1>
        <p style={pricingStyles.subtitle}>
          Transparent tiers. Powerful features. No surprises.
        </p>
        <div style={pricingStyles.billingToggleWrapper}>
          <div style={pricingStyles.billingToggle}>
            <button 
              onClick={() => setBilling('monthly')} 
              style={{
                ...pricingStyles.billingButton,
                ...(billing === 'monthly' ? pricingStyles.billingButtonActive : pricingStyles.billingButtonInactive)
              }}
            >
              Monthly
            </button>
            <button 
              onClick={() => setBilling('yearly')} 
              style={{
                ...pricingStyles.billingButton,
                ...(billing === 'yearly' ? pricingStyles.billingButtonActiveYearly : pricingStyles.billingButtonInactive)
              }}
            >
              Yearly <span style={{
                marginLeft: '0.25rem', 
                fontSize: '0.75rem', 
                color: billing === 'yearly' ? colors.primaryForeground : colors.brandPurple
              }}>
                (Save 20%)
              </span>
            </button>
          </div>
        </div>
      </header>

      <section style={{...pricingStyles.container, ...pricingStyles.section}}>
        <div style={pricingStyles.grid}>
          {/* Free */}
          <div 
            style={{
              ...pricingStyles.card,
              ...(hoveredCard === 'free' ? pricingStyles.cardHover : {})
            }}
            onMouseEnter={() => setHoveredCard('free')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div style={pricingStyles.cardHeader}>
              <div style={pricingStyles.cardTitle}>
                <span style={pricingStyles.planName}>Free — Starter Kit</span>
                <span style={pricingStyles.priceContainer}>
                  <span style={pricingStyles.priceNumber}>$0</span>
                  <span style={pricingStyles.priceUnit}>/mo</span>
                </span>
              </div>
              <p style={pricingStyles.description}>25 monthly generations. Core AI tools, basic project management, Canvas & History.</p>
            </div>
            <div style={pricingStyles.cardContent}>
              <ul style={pricingStyles.featureList}>
                <Row label="10 MB storage" included={true} />
                <Row label="Starter templates" included={true} />
                <Row label="Advanced content types" included={false} />
                <Row label="Up to 5 projects" included={true} />
                <Row label="YouTube Connect" included={false} />
                <Row label="AI Personas" included={false} />
                <Row label="Batch Generations" included={false} />
                <Row label="SEO Boost" included={false} />
                <Row label="AI Assistant — 5 questions/day" included={true} />
              </ul>
              <ul style={{...pricingStyles.featureList, ...pricingStyles.featureListSpaced}}>
                {features.map((f, i) => (
                  <li key={i} style={pricingStyles.featureItem}>
                    {planMatrix["Free"][i] ? <CheckIcon /> : <XIcon />}
                    <span style={planMatrix["Free"][i] ? pricingStyles.featureTextIncluded : pricingStyles.featureTextExcluded}>{f}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={onStartFree}
                style={{
                  ...pricingStyles.button, 
                  ...pricingStyles.buttonHero,
                  ...(hoveredButton === 'free' ? pricingStyles.buttonHeroHover : {})
                }}
                onMouseEnter={() => setHoveredButton('free')}
                onMouseLeave={() => setHoveredButton(null)}
              >
                Get started
              </button>
            </div>
          </div>

          {/* Creator Pro */}
          <div 
            style={{
              ...pricingStyles.card,
              ...pricingStyles.cardPopular,
              ...(hoveredCard === 'pro' ? pricingStyles.cardHover : {})
            }}
            onMouseEnter={() => setHoveredCard('pro')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div style={pricingStyles.popularBadge}>
              Most Popular
            </div>
            <div style={pricingStyles.cardHeader}>
              <div style={pricingStyles.cardTitle}>
                <span style={pricingStyles.planName}>Creator Pro — Growth Engine</span>
                <span style={pricingStyles.priceContainer}>
                  <span style={pricingStyles.priceNumber}>${display(pro)}</span>
                  <span style={pricingStyles.priceUnit}>/mo</span>
                  {billing === 'yearly' && (
                    <span style={pricingStyles.yearlyBadge}>Save 20%</span>
                  )}
                </span>
              </div>
              <p style={pricingStyles.description}>250 monthly generations, all Pro templates, YT Analysis & Trends, priority support.</p>
              {billing === 'yearly' && (
                <p style={pricingStyles.yearlyDescription}>Billed annually ${annual(pro)} (save 20%)</p>
              )}
            </div>
            <div style={pricingStyles.cardContent}>
              <ul style={pricingStyles.featureList}>
                <Row label="10 GB storage" included={true} />
                <Row label="Advanced content types" included={true} />
                <Row label="Unlimited projects" included={true} />
                <Row label="YouTube Connect" included={true} />
                <Row label="AI Personas" included={true} />
                <Row label="Batch Generations" included={true} />
                <Row label="SEO Boost" included={true} />
                <Row label="AI Assistant — 200 extra questions/month" included={true} />
              </ul>
              <ul style={{...pricingStyles.featureList, ...pricingStyles.featureListSpaced}}>
                {features.map((f, i) => (
                  <li key={i} style={pricingStyles.featureItem}>
                    {planMatrix["Creator Pro"][i] ? <CheckIcon /> : <XIcon />}
                    <span style={planMatrix["Creator Pro"][i] ? pricingStyles.featureTextIncluded : pricingStyles.featureTextExcluded}>{f}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={onStartFree}
                style={{
                  ...pricingStyles.button, 
                  ...pricingStyles.buttonGradient,
                  ...(hoveredButton === 'pro' ? pricingStyles.buttonGradientHover : {})
                }}
                onMouseEnter={() => setHoveredButton('pro')}
                onMouseLeave={() => setHoveredButton(null)}
              >
                Start Pro
              </button>
            </div>
          </div>

          {/* Agency Pro */}
          <div 
            style={{
              ...pricingStyles.card,
              ...(hoveredCard === 'agency' ? pricingStyles.cardHover : {})
            }}
            onMouseEnter={() => setHoveredCard('agency')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div style={pricingStyles.cardHeader}>
              <div style={pricingStyles.cardTitle}>
                <span style={pricingStyles.planName}>Agency Pro — Command Center</span>
                <span style={pricingStyles.priceContainer}>
                  <span style={pricingStyles.priceNumber}>${display(agency)}</span>
                  <span style={pricingStyles.priceUnit}>/mo</span>
                  {billing === 'yearly' && (
                    <span style={pricingStyles.yearlyBadge}>Save 20%</span>
                  )}
                </span>
              </div>
              <p style={pricingStyles.description}>1,000 monthly generations, team collaboration, all Ultimate enterprise templates.</p>
              {billing === 'yearly' && (
                <p style={pricingStyles.yearlyDescription}>Billed annually ${annual(agency)} (save 20%)</p>
              )}
            </div>
            <div style={pricingStyles.cardContent}>
              <ul style={pricingStyles.featureList}>
                <Row label="100 GB storage" included={true} />
                <Row label="Advanced content types" included={true} />
                <Row label="Unlimited projects" included={true} />
                <Row label="YouTube Connect" included={true} />
                <Row label="AI Personas" included={true} />
                <Row label="Batch Generations" included={true} />
                <Row label="SEO Boost" included={true} />
                <Row label="AI Assistant — Unlimited questions/day" included={true} />
              </ul>
              <ul style={{...pricingStyles.featureList, ...pricingStyles.featureListSpaced}}>
                {features.map((f, i) => (
                  <li key={i} style={pricingStyles.featureItem}>
                    {planMatrix["Agency Pro"][i] ? <CheckIcon /> : <XIcon />}
                    <span style={planMatrix["Agency Pro"][i] ? pricingStyles.featureTextIncluded : pricingStyles.featureTextExcluded}>
                      {f === "Pro Templates" ? "Ultimate templates" : f}
                    </span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={onStartFree}
                style={{
                  ...pricingStyles.button, 
                  ...pricingStyles.buttonHero,
                  ...(hoveredButton === 'agency' ? pricingStyles.buttonHeroHover : {})
                }}
                onMouseEnter={() => setHoveredButton('agency')}
                onMouseLeave={() => setHoveredButton(null)}
              >
                Scale with Agency Pro
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewPricing;
