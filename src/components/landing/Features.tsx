import { BrainCircuit, BarChart3, Sparkles, LayoutGrid, CalendarClock, MessageSquare } from "lucide-react";

const features = [
  {
    title: "Insight & Strategy",
    description: "Trends, YouTube analysis, and a strategy planner that turns signals into a clear plan.",
    icon: BarChart3,
    bullets: ["Trend radar", "YT channel deep-dive", "Strategy planner"],
  },
  {
    title: "Creative Generation",
    description: "From prompts to polished content with a generator and an on-call AI assistant.",
    icon: Sparkles,
    bullets: ["Multi-format generator", "AI assistant", "Reusable prompts"],
  },
  {
    title: "Visual Workspace",
    description: "A focused canvas for ideas, storyboards, and thumbnail iterations.",
    icon: LayoutGrid,
    bullets: ["Canvas", "Thumbnail studio", "Version history"],
  },
  {
    title: "Planning & Organization",
    description: "Organize work across Studio Hub, Calendar, and History so nothing gets lost.",
    icon: CalendarClock,
    bullets: ["Studio hub", "Calendar", "History & notes"],
  },
];

const Features = () => {
  return (
    <section id="features" style={{
      position: 'relative',
      backgroundColor: 'hsl(var(--background))',
      padding: '5rem 0'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1.5rem'
      }}>
        <div style={{
          maxWidth: '512px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: 'clamp(1.875rem, 4vw, 2.25rem)',
            fontWeight: '600',
            letterSpacing: '-0.025em',
            color: 'hsl(var(--foreground))'
          }}>
            Clarity, creation, and control — in one place
          </h2>
          <p style={{
            marginTop: '1rem',
            color: 'hsl(var(--muted-foreground))'
          }}>
            A single, intelligent command center built for the creator‑entrepreneur.
          </p>
        </div>

        <div style={{
          marginTop: '3rem',
          display: 'grid',
          gap: '1.5rem',
          gridTemplateColumns: '1fr'
        }} className="features-grid">
          {features.map((f) => (
            <article 
              key={f.title} 
              style={{
                position: 'relative',
                borderRadius: '12px',
                border: '1px solid hsl(var(--border) / 0.6)',
                backgroundColor: 'hsl(var(--background) / 0.6)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-elevated)',
                transition: 'transform 0.3s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                marginBottom: '1rem',
                display: 'inline-flex',
                width: '40px',
                height: '40px',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '6px',
                backgroundColor: 'hsl(var(--secondary) / 0.4)',
                color: 'hsl(var(--brand-foreground))'
              }}>
                <f.icon style={{ color: 'hsl(var(--brand-1))' }} />
              </div>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: 'hsl(var(--foreground))'
              }}>
                {f.title}
              </h3>
              <p style={{
                marginTop: '0.5rem',
                fontSize: '0.875rem',
                color: 'hsl(var(--muted-foreground))'
              }}>
                {f.description}
              </p>
              <ul style={{
                marginTop: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
                fontSize: '0.875rem',
                color: 'hsl(var(--muted-foreground))',
                listStyle: 'none',
                padding: 0
              }}>
                {f.bullets.map((b) => (
                  <li key={b} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{
                      height: '6px',
                      width: '6px',
                      borderRadius: '50%',
                      backgroundColor: 'hsl(var(--brand-alt))'
                    }} />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div style={{
          marginTop: '3rem',
          display: 'grid',
          alignItems: 'start',
          gap: '1.5rem',
          borderRadius: '12px',
          border: '1px solid hsl(var(--border) / 0.6)',
          backgroundColor: 'hsl(var(--background) / 0.6)',
          padding: '1.5rem',
          gridTemplateColumns: '1fr'
        }} className="features-bottom">
          {[BrainCircuit, MessageSquare, CalendarClock].map((Icon, i) => (
            <div key={i} style={{
              borderRadius: '8px',
              border: '1px solid hsl(var(--border) / 0.5)',
              backgroundColor: 'hsl(var(--background) / 0.5)',
              padding: '1.25rem'
            }}>
              <div style={{
                marginBottom: '0.75rem',
                display: 'inline-flex',
                width: '36px',
                height: '36px',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '6px',
                backgroundColor: 'hsl(var(--secondary) / 0.4)'
              }}>
                <Icon style={{ color: 'hsl(var(--brand-1))' }} />
              </div>
              <p style={{
                fontSize: '0.875rem',
                color: 'hsl(var(--muted-foreground))'
              }}>
                AI woven throughout: context-aware suggestions, faster prompts, and assistance that understands your workflow.
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (min-width: 640px) {
          .features-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .features-bottom {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (min-width: 1024px) {
          .features-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Features;
