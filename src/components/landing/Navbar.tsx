interface NavbarProps {
  onSignInClick: () => void;
  onStartCreating: () => void;
  onNavigateToSecondary?: () => void;
}

const Navbar = ({ onSignInClick, onStartCreating, onNavigateToSecondary }: NavbarProps) => {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 40,
      width: '100%',
      borderBottom: '1px solid hsl(var(--border) / 0.6)',
      backgroundColor: 'hsl(var(--background) / 0.7)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)'
    }}>
      <nav style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        height: '64px',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem'
      }}>
        <a href="#" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontWeight: '600',
          letterSpacing: '-0.025em',
          textDecoration: 'none',
          color: 'hsl(var(--foreground))'
        }}>
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F74e626ce7c2b455ebf01b3e2c7015061%2F3600238236c24578ae83cf76fea4c34b?format=webp&width=800"
            alt="CreateGen Studio Logo"
            style={{
              height: '32px',
              width: '32px',
              flexShrink: 0
            }}
          />
          <span>CreateGen Studio</span>
        </a>
        <div style={{
          display: 'none',
          alignItems: 'center',
          gap: '1.5rem'
        }} className="landing-nav-links">
          <button onClick={() => onNavigateToSecondary && onNavigateToSecondary()} style={{
            fontSize: '0.875rem',
            color: 'hsl(var(--muted-foreground))',
            textDecoration: 'none',
            transition: 'color 0.3s',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.target.style.color = 'hsl(var(--foreground))'}
          onMouseLeave={(e) => e.target.style.color = 'hsl(var(--muted-foreground))'}>
            Features
          </button>
          <button onClick={() => onNavigateToSecondary && onNavigateToSecondary()} style={{
            fontSize: '0.875rem',
            color: 'hsl(var(--muted-foreground))',
            textDecoration: 'none',
            transition: 'color 0.3s',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.target.style.color = 'hsl(var(--foreground))'}
          onMouseLeave={(e) => e.target.style.color = 'hsl(var(--muted-foreground))'}>
            Pricing
          </button>
          <button onClick={() => onNavigateToSecondary && onNavigateToSecondary()} style={{
            fontSize: '0.875rem',
            color: 'hsl(var(--muted-foreground))',
            textDecoration: 'none',
            transition: 'color 0.3s',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.target.style.color = 'hsl(var(--foreground))'}
          onMouseLeave={(e) => e.target.style.color = 'hsl(var(--muted-foreground))'}>
            FAQ
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            onClick={onSignInClick} 
            style={{
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              height: '36px',
              borderRadius: '6px',
              paddingLeft: '12px',
              paddingRight: '12px',
              fontSize: '0.875rem',
              fontWeight: '500',
              border: '1px solid hsl(var(--input))',
              backgroundColor: 'hsl(var(--background))',
              color: 'hsl(var(--accent-foreground))',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            className="landing-btn-outline"
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'hsl(var(--accent))';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'hsl(var(--background))';
            }}
          >
            Sign In
          </button>
          <button 
            onClick={onStartCreating}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '36px',
              borderRadius: '6px',
              paddingLeft: '12px',
              paddingRight: '12px',
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
            Get started
          </button>
        </div>
      </nav>

      <style>{`
        @media (min-width: 768px) {
          .landing-nav-links {
            display: flex !important;
          }
          .landing-btn-outline {
            display: inline-flex !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
