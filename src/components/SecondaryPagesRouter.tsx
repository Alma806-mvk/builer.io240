import React, { useState } from 'react';
import NewFeatures from './NewFeatures';
import NewPricing from './NewPricing';
import NewFAQ from './NewFAQ';
import NewPrivacy from './NewPrivacy';
import NewTerms from './NewTerms';

interface SecondaryPagesRouterProps {
  onSignInClick: () => void;
  onStartCreating: () => void;
  onGoHome: () => void;
}

const SecondaryPagesRouter = ({ onSignInClick, onStartCreating, onGoHome }: SecondaryPagesRouterProps) => {
  const [currentPage, setCurrentPage] = useState<'features' | 'pricing' | 'faq' | 'privacy' | 'terms'>('features');

  // Navbar styles that won't be overridden by app design system
  const navStyles = {
    navbar: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      backgroundColor: 'hsl(222.2, 84%, 4.9% / 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid hsl(217.2, 32.6%, 17.5%)'
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      height: '4rem',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.5rem'
    },
    logo: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontWeight: '600',
      letterSpacing: '-0.025em',
      textDecoration: 'none',
      color: 'hsl(210, 40%, 98%)',
      cursor: 'pointer'
    },
    logoImage: {
      height: '2rem',
      width: '2rem',
      flexShrink: 0
    },
    navLinks: {
      display: 'flex',
      alignItems: 'center',
      gap: '2rem'
    },
    navLink: {
      fontSize: '0.875rem',
      color: 'hsl(215, 20.2%, 65.1%)',
      textDecoration: 'none',
      transition: 'color 0.3s',
      cursor: 'pointer',
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      borderBottomWidth: '2px',
      borderBottomStyle: 'solid',
      borderBottomColor: 'transparent',
      background: 'transparent',
      padding: '0.5rem 0'
    },
    navLinkActive: {
      color: 'hsl(210, 40%, 98%)',
      borderBottomColor: 'hsl(188, 92%, 55%)'
    },
    navLinkHover: {
      color: 'hsl(210, 40%, 98%)'
    },
    buttonGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    },
    signInBtn: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '2.25rem',
      borderRadius: '0.375rem',
      paddingLeft: '0.75rem',
      paddingRight: '0.75rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      border: '1px solid hsl(217.2, 32.6%, 17.5%)',
      backgroundColor: 'transparent',
      color: 'hsl(210, 40%, 98%)',
      cursor: 'pointer',
      transition: 'all 0.3s',
      textDecoration: 'none'
    },
    getStartedBtn: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '2.25rem',
      borderRadius: '0.375rem',
      paddingLeft: '0.75rem',
      paddingRight: '0.75rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      background: 'linear-gradient(135deg, hsl(266, 85%, 60%), hsl(188, 92%, 55%))',
      color: 'hsl(0, 0%, 100%)',
      border: 'none',
      cursor: 'pointer',
      boxShadow: '0 0 10px hsl(266, 85%, 60% / 0.3)',
      transition: 'opacity 0.3s',
      textDecoration: 'none'
    }
  };

  const handleNavLinkClick = (page: 'features' | 'pricing' | 'faq' | 'privacy' | 'terms') => {
    setCurrentPage(page);
    // Smooth scroll to top when switching pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {/* Custom Navbar */}
      <header style={navStyles.navbar}>
        <nav style={navStyles.container}>
          <div
            onClick={onGoHome}
            style={navStyles.logo}
          >
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F74e626ce7c2b455ebf01b3e2c7015061%2F3600238236c24578ae83cf76fea4c34b?format=webp&width=800"
              alt="CreateGen Studio Logo"
              style={navStyles.logoImage}
            />
            <span>CreateGen Studio</span>
          </div>
          
          <div style={navStyles.navLinks}>
            <button
              onClick={() => handleNavLinkClick('features')}
              style={{
                ...navStyles.navLink,
                ...(currentPage === 'features' ? navStyles.navLinkActive : {})
              }}
              onMouseEnter={(e) => {
                if (currentPage !== 'features') {
                  e.currentTarget.style.color = navStyles.navLinkHover.color;
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== 'features') {
                  e.currentTarget.style.color = navStyles.navLink.color;
                }
              }}
            >
              Features
            </button>
            <button
              onClick={() => handleNavLinkClick('pricing')}
              style={{
                ...navStyles.navLink,
                ...(currentPage === 'pricing' ? navStyles.navLinkActive : {})
              }}
              onMouseEnter={(e) => {
                if (currentPage !== 'pricing') {
                  e.currentTarget.style.color = navStyles.navLinkHover.color;
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== 'pricing') {
                  e.currentTarget.style.color = navStyles.navLink.color;
                }
              }}
            >
              Pricing
            </button>
            <button
              onClick={() => handleNavLinkClick('faq')}
              style={{
                ...navStyles.navLink,
                ...(currentPage === 'faq' ? navStyles.navLinkActive : {})
              }}
              onMouseEnter={(e) => {
                if (currentPage !== 'faq') {
                  e.currentTarget.style.color = navStyles.navLinkHover.color;
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== 'faq') {
                  e.currentTarget.style.color = navStyles.navLink.color;
                }
              }}
            >
              FAQ
            </button>
            <button
              onClick={() => handleNavLinkClick('privacy')}
              style={{
                ...navStyles.navLink,
                ...(currentPage === 'privacy' ? navStyles.navLinkActive : {})
              }}
              onMouseEnter={(e) => {
                if (currentPage !== 'privacy') {
                  e.currentTarget.style.color = navStyles.navLinkHover.color;
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== 'privacy') {
                  e.currentTarget.style.color = navStyles.navLink.color;
                }
              }}
            >
              Privacy
            </button>
            <button
              onClick={() => handleNavLinkClick('terms')}
              style={{
                ...navStyles.navLink,
                ...(currentPage === 'terms' ? navStyles.navLinkActive : {})
              }}
              onMouseEnter={(e) => {
                if (currentPage !== 'terms') {
                  e.currentTarget.style.color = navStyles.navLinkHover.color;
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== 'terms') {
                  e.currentTarget.style.color = navStyles.navLink.color;
                }
              }}
            >
              Terms
            </button>
          </div>
          
          <div style={navStyles.buttonGroup}>
            <button 
              onClick={onSignInClick}
              style={navStyles.signInBtn}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'hsl(217.2, 32.6%, 17.5%)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Sign In
            </button>
            <button 
              onClick={onStartCreating}
              style={navStyles.getStartedBtn}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.95'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              Get started
            </button>
          </div>
        </nav>
      </header>

      {/* Page Content */}
      {currentPage === 'features' && <NewFeatures onStartFree={onStartCreating} />}
      {currentPage === 'pricing' && <NewPricing onStartFree={onStartCreating} />}
      {currentPage === 'faq' && <NewFAQ />}
      {currentPage === 'privacy' && <NewPrivacy />}
      {currentPage === 'terms' && <NewTerms />}
    </div>
  );
};

export default SecondaryPagesRouter;
