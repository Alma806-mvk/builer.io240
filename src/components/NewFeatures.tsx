import React from 'react';

// Isolated styling to prevent app design system overrides
const featurePageStyles = {
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
  grid: {
    display: 'grid',
    gap: '2.5rem',
    gridTemplateColumns: '1fr',
    alignItems: 'center'
  },
  gridMd: {
    '@media (min-width: 768px)': {
      gridTemplateColumns: '1fr 1fr'
    }
  },
  title: {
    fontSize: 'clamp(2rem, 5vw, 2.5rem)',
    fontWeight: '600',
    lineHeight: '1.2',
    letterSpacing: '-0.025em',
    color: 'hsl(210, 40%, 98%)',
    marginBottom: '1rem',
    fontFamily: '"Space Grotesk", Inter, system-ui, sans-serif'
  },
  titleLarge: {
    fontSize: 'clamp(2.5rem, 5vw, 3rem)',
    textAlign: 'center' as const,
    maxWidth: '48rem',
    margin: '0 auto'
  },
  subtitle: {
    color: 'hsl(215, 20.2%, 65.1%)',
    fontSize: '1rem',
    lineHeight: '1.6',
    marginBottom: '1.5rem'
  },
  subtitleLarge: {
    fontSize: '1.125rem',
    textAlign: 'center' as const,
    maxWidth: '32rem',
    margin: '0 auto 2rem'
  },
  list: {
    marginTop: '1.5rem',
    listStyle: 'none',
    padding: 0
  },
  listItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    marginBottom: '0.75rem',
    fontSize: '0.875rem',
    lineHeight: '1.5'
  },
  bullet: {
    marginTop: '0.25rem',
    height: '0.5rem',
    width: '0.5rem',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, hsl(266, 85%, 60%), hsl(188, 92%, 55%))',
    flexShrink: 0
  },
  listText: {
    color: 'hsl(210, 40%, 90%)'
  },
  imageContainer: {
    borderRadius: '0.75rem',
    overflow: 'hidden',
    border: '1px solid hsl(217.2, 32.6%, 17.5%)',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
  },
  image: {
    width: '100%',
    height: 'auto',
    display: 'block'
  },
  button: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '3rem',
    borderRadius: '0.5rem',
    paddingLeft: '2rem',
    paddingRight: '2rem',
    fontSize: '1rem',
    fontWeight: '500',
    background: 'linear-gradient(135deg, hsl(266, 85%, 60%), hsl(188, 92%, 55%))',
    color: 'hsl(0, 0%, 100%)',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'opacity 0.2s'
  }
};

const Section = ({ title, subtitle, image, bullets, reversed = false }: { 
  title: string; 
  subtitle: string; 
  image: string; 
  bullets: string[];
  reversed?: boolean;
}) => (
  <section style={featurePageStyles.section}>
    <div style={featurePageStyles.container}>
      <div style={{
        ...featurePageStyles.grid,
        gridTemplateColumns: window.innerWidth >= 768 ? '1fr 1fr' : '1fr',
        flexDirection: reversed && window.innerWidth >= 768 ? 'row-reverse' : 'initial'
      }}>
        <div style={{ order: reversed ? 2 : 1 }}>
          <h2 style={featurePageStyles.title}>{title}</h2>
          <p style={featurePageStyles.subtitle}>{subtitle}</p>
          <ul style={featurePageStyles.list}>
            {bullets.map((bullet, i) => (
              <li key={i} style={featurePageStyles.listItem}>
                <span style={featurePageStyles.bullet} />
                <span style={featurePageStyles.listText}>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
        <div style={{ order: reversed ? 1 : 2 }}>
          <div style={featurePageStyles.imageContainer}>
            <img 
              src={image} 
              alt={`${title} — CreateGen Studio`} 
              style={featurePageStyles.image}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
);

const NewFeatures = ({ onStartFree }: { onStartFree: () => void }) => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'hsl(222.2, 84%, 4.9%)',
      color: 'hsl(210, 40%, 98%)',
      paddingTop: '5rem' // Account for navbar
    }}>
      <header style={{
        ...featurePageStyles.container,
        ...featurePageStyles.sectionLarge,
        textAlign: 'center'
      }}>
        <h1 style={{
          ...featurePageStyles.title,
          ...featurePageStyles.titleLarge
        }}>
          Everything you need to build a world‑class content engine
        </h1>
        <p style={{
          ...featurePageStyles.subtitle,
          ...featurePageStyles.subtitleLarge
        }}>
          The confident co‑pilot for creator‑entrepreneurs. From opportunity discovery to final publish-ready assets — CreateGen Studio unifies the entire workflow.
        </p>
        <div style={{ marginTop: '2rem' }}>
          <button 
            onClick={onStartFree}
            style={featurePageStyles.button}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            Start free
          </button>
        </div>
      </header>

      <Section
        title="Pillar 1: Insight & Strategy"
        subtitle="Trends, YT Analysis, and Strategy Planner give you the unfair advantage — discover viral opportunities, deconstruct winners, and build a data-driven plan."
        image="https://cdn.builder.io/api/v1/image/assets%2F74e626ce7c2b455ebf01b3e2c7015061%2Fc6168819d113450b83ae33eb2e4e09b0?format=webp&width=800"
        bullets={[
          "Trends (Opportunity Engine): Spot rising topics before they peak.",
          "YT Analysis: Reverse-engineer high-performing channels and videos.",
          "Strategy Planner: Turn insights into a professional, actionable strategy.",
        ]}
      />

      <Section
        title="Pillar 2: Creation & Design"
        subtitle="From first spark to final cut — Generator, AI Assistant, Canvas, and Thumbnails (coming soon) remove friction and end creative block."
        image="https://cdn.builder.io/api/v1/image/assets%2F74e626ce7c2b455ebf01b3e2c7015061%2Fc6168819d113450b83ae33eb2e4e09b0?format=webp&width=800"
        bullets={[
          "Generator: Draft scripts, outlines, hooks, and titles in your brand voice.",
          "AI Assistant: A conversational co‑pilot that understands context everywhere.",
          "Canvas: Mind‑map, storyboard, and connect ideas visually.",
          "Thumbnails Studio (upcoming): High‑impact thumbnails with guided best practices.",
        ]}
        reversed={true}
      />

      <Section
        title="Pillar 3: Organization & Planning"
        subtitle="Studio Hub, Calendar, and History unify your workflow — keep projects organized, schedules clear, and versions under control."
        image="https://cdn.builder.io/api/v1/image/assets%2F74e626ce7c2b455ebf01b3e2c7015061%2Fc6168819d113450b83ae33eb2e4e09b0?format=webp&width=800"
        bullets={[
          "Studio Hub: Your central command center for projects and assets.",
          "Calendar: Plan, schedule, and collaborate with clarity.",
          "History: Versioned work you can revisit, compare, and restore.",
        ]}
      />
    </div>
  );
};

export default NewFeatures;
