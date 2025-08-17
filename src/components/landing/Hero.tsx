import { useEffect, useRef } from "react";

interface HeroProps {
  onSignInClick?: () => void;
  onStartCreating?: () => void;
  onStartFree?: () => void;
}

const Hero = ({ onSignInClick, onStartCreating, onStartFree }: HeroProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty("--spot-x", `${x}%`);
      el.style.setProperty("--spot-y", `${y}%`);
    };
    const onLeave = () => {
      el.style.setProperty("--spot-x", `50%`);
      el.style.setProperty("--spot-y", `-10%`);
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    onLeave();
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <section ref={ref} style={{
      position: 'relative',
      isolation: 'isolate',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: -10
      }}>
        <img 
          src="https://cdn.builder.io/api/v1/image/assets%2F8447a8ac7faa47eead9cc80ec0c1bf7f%2F05f99ca9f747478f81bff826c1244a58?format=webp&width=800" 
          alt="CreateGen Studio gradient background" 
          style={{
            height: '100%',
            width: '100%',
            objectFit: 'cover',
            opacity: 0.7
          }} 
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, hsl(var(--background) / 0.1), hsl(var(--background) / 0.3), hsl(var(--background)))'
        }} />
        <div
          aria-hidden
          style={{
            pointerEvents: 'none',
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(600px 300px at var(--spot-x) var(--spot-y), hsl(var(--brand-2) / 0.18), transparent 60%)'
          }}
        />
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '5rem 1.5rem'
      }}>
        <div style={{
          maxWidth: '768px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <p style={{
            marginBottom: '1rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            borderRadius: '9999px',
            border: '1px solid hsl(var(--border) / 0.6)',
            backgroundColor: 'hsl(var(--background) / 0.5)',
            paddingLeft: '0.75rem',
            paddingRight: '0.75rem',
            paddingTop: '0.25rem',
            paddingBottom: '0.25rem',
            fontSize: '0.75rem',
            color: 'hsl(var(--muted-foreground))',
            backdropFilter: 'blur(8px)',
            animation: 'fade-in 0.3s ease-out forwards',
            animationDelay: '0ms'
          }}>
            Your Confident Co‑Pilot
          </p>
          <h1 style={{
            fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
            fontWeight: '600',
            letterSpacing: '-0.025em',
            lineHeight: 1.1,
            textAlign: 'center',
            animation: 'fade-in 0.3s ease-out forwards',
            animationDelay: '100ms',
            color: 'hsl(var(--foreground))'
          }}>
            CreateGen Studio — the AI command center for creators
          </h1>
          <p style={{
            marginTop: '1.25rem',
            fontSize: 'clamp(1.125rem, 2vw, 1.25rem)',
            color: 'hsl(var(--muted-foreground))',
            lineHeight: 1.6,
            textAlign: 'center',
            animation: 'fade-in 0.3s ease-out forwards',
            animationDelay: '200ms'
          }}>
            Strategy, generation, canvas, and planning — unified into one intelligent workspace so you can create more and stress less.
          </p>
          <div style={{
            marginTop: '2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            animation: 'fade-in 0.3s ease-out forwards',
            animationDelay: '300ms'
          }} className="hero-buttons">
            <button
              onClick={onStartFree || onStartCreating}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '44px',
                borderRadius: '6px',
                paddingLeft: '2rem',
                paddingRight: '2rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                background: 'var(--gradient-primary)',
                color: 'hsl(var(--brand-foreground))',
                border: 'none',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-glow)',
                transition: 'opacity 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.opacity = '0.95'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              Start free
            </button>
            <a href="#pricing" style={{ textDecoration: 'none' }}>
              <button style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '44px',
                borderRadius: '6px',
                paddingLeft: '2rem',
                paddingRight: '2rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                border: '1px solid hsl(var(--input))',
                backgroundColor: 'hsl(var(--background))',
                color: 'hsl(var(--accent-foreground))',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'hsl(var(--accent))';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'hsl(var(--background))';
              }}>
                See pricing
              </button>
            </a>
          </div>
          <p style={{
            marginTop: '0.75rem',
            fontSize: '0.75rem',
            color: 'hsl(var(--muted-foreground))'
          }}>
            No credit card required
          </p>
        </div>

        <div style={{
          marginTop: '4rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1.5rem',
          opacity: 0.9,
          animation: 'fade-in 0.3s ease-out forwards',
          animationDelay: '400ms'
        }} className="hero-features">
          {[
            "Trusted by creators",
            "Built for speed",
            "Privacy-first",
            "Made for teams",
          ].map((item) => (
            <div 
              key={item} 
              style={{
                borderRadius: '6px',
                border: '1px solid hsl(var(--border) / 0.5)',
                backgroundColor: 'hsl(var(--background) / 0.4)',
                padding: '0.75rem',
                textAlign: 'center',
                fontSize: '0.75rem',
                color: 'hsl(var(--muted-foreground))',
                backdropFilter: 'blur(8px)',
                transition: 'transform 0.2s',
                boxShadow: 'var(--shadow-elevated)',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = 'var(--shadow-glow)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = 'var(--shadow-elevated)';
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (min-width: 640px) {
          .hero-buttons {
            flex-direction: row !important;
          }
          .hero-features {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
