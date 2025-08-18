import { useState } from 'react';
import AuthModal from './AuthModal';

interface LandingPage2Props {
  onSignInClick: () => void;
  onStartCreating: () => void;
  onNavigateToSecondary?: () => void;
}

const LandingPage2 = ({ onSignInClick, onStartCreating, onNavigateToSecondary }: LandingPage2Props) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'signin' | 'signup'>('signin');

  const handleStartFree = () => {
    setAuthModalTab('signup'); // Get started goes to signup
    setIsAuthModalOpen(true);
  };

  const handleSignIn = () => {
    setAuthModalTab('signin'); // Sign in goes to signin
    setIsAuthModalOpen(true);
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    // User is now authenticated, the auth context will handle the state change
  };
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      color: '#111827',
      fontFamily: '"Inter", system-ui, -apple-system, sans-serif'
    }}>
      {/* Sophisticated Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #f3f4f6'
      }}>
        <nav style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          height: '80px',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            fontWeight: '800',
            fontSize: '1.5rem',
            color: '#111827'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1rem',
              fontWeight: '700',
              boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)'
            }}>
              CS
            </div>
            CreateGen Studio
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '3rem'
          }}>
            <nav style={{
              display: 'none',
              alignItems: 'center',
              gap: '2.5rem'
            }} className="desktop-nav">
              <button onClick={() => onNavigateToSecondary && onNavigateToSecondary()} style={{
                textDecoration: 'none',
                color: '#6b7280',
                fontWeight: '500',
                fontSize: '1rem',
                transition: 'color 0.2s',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer'
              }}>Platform</button>
              <a href="#solutions" style={{
                textDecoration: 'none',
                color: '#6b7280',
                fontWeight: '500',
                fontSize: '1rem',
                transition: 'color 0.2s'
              }}>Solutions</a>
              <a href="#pricing" style={{
                textDecoration: 'none',
                color: '#6b7280',
                fontWeight: '500',
                fontSize: '1rem',
                transition: 'color 0.2s'
              }}>Pricing</a>
            </nav>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                onClick={handleSignIn}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: '#6b7280',
                  fontWeight: '500',
                  cursor: 'pointer',
                  padding: '0.75rem 1rem',
                  transition: 'color 0.2s',
                  fontSize: '1rem'
                }}
                onMouseEnter={(e) => e.target.style.color = '#111827'}
                onMouseLeave={(e) => e.target.style.color = '#6b7280'}
              >
                Sign In
              </button>
              <button
                onClick={handleStartFree}
                style={{
                  background: '#111827',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0.875rem 1.75rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontSize: '1rem',
                  boxShadow: '0 4px 14px rgba(17, 24, 39, 0.15)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#374151';
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(17, 24, 39, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#111827';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 14px rgba(17, 24, 39, 0.15)';
                }}
              >
                Get Started
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section - Completely Different Style */}
      <section style={{
        padding: '5rem 2rem',
        maxWidth: '1280px',
        margin: '0 auto',
        textAlign: 'center',
        position: 'relative'
      }}>
        {/* Floating Elements Background */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #ddd6fe, #c7d2fe)',
          opacity: 0.6,
          filter: 'blur(20px)'
        }} />
        <div style={{
          position: 'absolute',
          top: '20%',
          right: '15%',
          width: '150px',
          height: '150px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #fef3c7, #fed7aa)',
          opacity: 0.4,
          filter: 'blur(30px)',
          transform: 'rotate(45deg)'
        }} />
        
        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            backgroundColor: '#f3f4f6',
            border: '1px solid #e5e7eb',
            borderRadius: '50px',
            padding: '0.75rem 1.5rem',
            fontSize: '0.875rem',
            color: '#6b7280',
            marginBottom: '2.5rem',
            fontWeight: '500'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#22c55e',
              animation: 'pulse 2s infinite'
            }} />
            Trusted by 10,000+ creators worldwide
          </div>
          
          <h1 style={{
            fontSize: 'clamp(3.5rem, 8vw, 6rem)',
            fontWeight: '900',
            lineHeight: 1,
            letterSpacing: '-0.03em',
            marginBottom: '2rem',
            background: 'linear-gradient(135deg, #111827 0%, #4b5563 50%, #111827 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            The Creator's
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Command Center
            </span>
          </h1>
          
          <p style={{
            fontSize: '1.375rem',
            color: '#6b7280',
            lineHeight: 1.6,
            marginBottom: '3.5rem',
            maxWidth: '700px',
            margin: '0 auto 3.5rem',
            fontWeight: '400'
          }}>
            Transform your creative workflow with AI-powered insights, seamless collaboration, and intelligent automation that scales with your ambition.
          </p>
          
          <div style={{
            display: 'flex',
            gap: '1.5rem',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '4rem'
          }} className="hero-cta">
            <button
              onClick={handleStartFree}
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                padding: '1.25rem 2.5rem',
                fontSize: '1.125rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 12px 35px rgba(59, 130, 246, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.3)';
              }}
            >
              Start Creating Free
              <span style={{
                marginLeft: '0.5rem',
                fontSize: '1rem'
              }}>→</span>
            </button>
            <button style={{
              background: 'white',
              color: '#374151',
              border: '2px solid #e5e7eb',
              borderRadius: '16px',
              padding: '1.25rem 2.5rem',
              fontSize: '1.125rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.color = '#3b82f6';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = '#e5e7eb';
              e.target.style.color = '#374151';
              e.target.style.transform = 'translateY(0)';
            }}>
              See Demo
            </button>
          </div>
          
          {/* Trust Indicators */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '2rem',
            maxWidth: '600px',
            margin: '0 auto'
          }} className="trust-grid">
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: '800',
                color: '#111827',
                marginBottom: '0.5rem'
              }}>50K+</div>
              <div style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: '500' }}>Projects Created</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: '800',
                color: '#111827',
                marginBottom: '0.5rem'
              }}>99.9%</div>
              <div style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: '500' }}>Uptime</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: '800',
                color: '#111827',
                marginBottom: '0.5rem'
              }}>24/7</div>
              <div style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: '500' }}>Support</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: '800',
                color: '#111827',
                marginBottom: '0.5rem'
              }}>150+</div>
              <div style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: '500' }}>Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Card Grid Layout */}
      <section id="solutions" style={{
        padding: '6rem 2rem',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <h2 style={{
              fontSize: '3rem',
              fontWeight: '800',
              color: '#111827',
              marginBottom: '1.5rem',
              letterSpacing: '-0.02em'
            }}>
              Everything you need to succeed
            </h2>
            <p style={{
              color: '#6b7280',
              fontSize: '1.25rem',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: 1.6
            }}>
              From strategy to execution, we've built the complete toolkit for modern content creators
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '2rem'
          }} className="solutions-grid">
            {[
              {
                icon: '🎯',
                title: 'Strategic Intelligence',
                description: 'AI-powered market analysis and trend forecasting to keep you ahead of the curve',
                features: ['Market trend analysis', 'Competitor insights', 'Audience research', 'Content gap analysis']
              },
              {
                icon: '⚡',
                title: 'Rapid Content Creation',
                description: 'Generate high-quality content in minutes, not hours, with our advanced AI engine',
                features: ['Multi-format generation', 'Brand voice training', 'Content optimization', 'Quality assurance']
              },
              {
                icon: '��',
                title: 'Growth Acceleration',
                description: 'Scale your content operation with automation and intelligent workflow management',
                features: ['Automated workflows', 'Team collaboration', 'Performance tracking', 'Growth analytics']
              }
            ].map((solution, index) => (
              <div key={index} style={{
                backgroundColor: 'white',
                borderRadius: '20px',
                padding: '3rem',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: '1px solid #f3f4f6',
                transition: 'all 0.3s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-8px)';
                e.target.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
              }}>
                <div style={{
                  fontSize: '3rem',
                  marginBottom: '1.5rem'
                }}>
                  {solution.icon}
                </div>
                <h3 style={{
                  fontSize: '1.75rem',
                  fontWeight: '700',
                  color: '#111827',
                  marginBottom: '1rem'
                }}>
                  {solution.title}
                </h3>
                <p style={{
                  color: '#6b7280',
                  lineHeight: 1.6,
                  marginBottom: '2rem',
                  fontSize: '1.125rem'
                }}>
                  {solution.description}
                </p>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '0.75rem'
                }}>
                  {solution.features.map((feature, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.875rem',
                      color: '#6b7280'
                    }}>
                      <div style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: '#3b82f6'
                      }} />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '6rem 2rem',
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        color: 'white',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '3rem',
            fontWeight: '800',
            marginBottom: '1.5rem',
            letterSpacing: '-0.02em'
          }}>
            Ready to revolutionize your creative process?
          </h2>
          <p style={{
            fontSize: '1.25rem',
            marginBottom: '3rem',
            opacity: 0.9,
            lineHeight: 1.6
          }}>
            Join thousands of creators who've transformed their workflow with CreateGen Studio
          </p>
          <button
            onClick={handleStartFree}
            style={{
              background: 'white',
              color: '#1e293b',
              border: 'none',
              borderRadius: '16px',
              padding: '1.25rem 3rem',
              fontSize: '1.25rem',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 8px 25px rgba(255, 255, 255, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 12px 35px rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 8px 25px rgba(255, 255, 255, 0.2)';
            }}
          >
            Start Your Free Trial
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid #f3f4f6',
        padding: '4rem 2rem 3rem',
        backgroundColor: '#ffffff'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }} className="footer-content">
          <div style={{
            color: '#6b7280',
            fontSize: '0.875rem'
          }}>
            © {new Date().getFullYear()} CreateGen Studio. All rights reserved.
          </div>
          <div style={{
            display: 'flex',
            gap: '2rem'
          }}>
            <button onClick={() => onNavigateToSecondary && onNavigateToSecondary()} style={{
              color: '#6b7280',
              textDecoration: 'none',
              fontSize: '0.875rem',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer'
            }}>Platform</button>
            <a href="#solutions" style={{
              color: '#6b7280',
              textDecoration: 'none',
              fontSize: '0.875rem'
            }}>Solutions</a>
            <a href="#pricing" style={{
              color: '#6b7280',
              textDecoration: 'none',
              fontSize: '0.875rem'
            }}>Pricing</a>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
          .hero-cta {
            flex-direction: row !important;
          }
          .trust-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
          .solutions-grid {
            grid-template-columns: 1fr !important;
          }
          .footer-content {
            flex-direction: row !important;
          }
        }
        
        @media (max-width: 767px) {
          .hero-cta {
            flex-direction: column !important;
          }
          .trust-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 1rem !important;
          }
          .footer-content {
            flex-direction: column !important;
            gap: 1rem !important;
          }
        }
      `}</style>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={handleCloseAuthModal}
        onAuthSuccess={handleAuthSuccess}
        defaultTab={authModalTab}
        onNavigateToTerms={() => {
          const url = window.location.origin + '/terms';
          window.open(url, '_blank');
        }}
        onNavigateToPrivacy={() => {
          const url = window.location.origin + '/privacy';
          window.open(url, '_blank');
        }}
      />
    </div>
  );
};

export default LandingPage2;
