import { useState } from 'react';
import LandingPage from './LandingPage';
import LandingPage2 from './LandingPage2';
import NewLandingPage2 from './NewLandingPage2';
import NewLandingPage3 from './NewLandingPage3';
import SecondaryPagesRouter from './SecondaryPagesRouter';

interface LandingPageSwitcherProps {
  onSignInClick: () => void;
  onStartCreating: () => void;
}

const LandingPageSwitcher = ({ onSignInClick, onStartCreating }: LandingPageSwitcherProps) => {
  const [currentPage, setCurrentPage] = useState<'landing1' | 'landing2' | 'landing3' | 'secondary'>('landing1');
  const [showSecondaryPages, setShowSecondaryPages] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      {/* Floating Switch Button */}
      <div style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        alignItems: 'flex-end'
      }}>
        <div style={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          fontSize: '0.75rem',
          fontWeight: '500',
          whiteSpace: 'nowrap',
          opacity: 0.9
        }}>
          Switch Landing Page Design
        </div>
        
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '0.5rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
          border: '1px solid #e5e7eb',
          display: 'flex',
          gap: '0.25rem'
        }}>
          <button
            onClick={() => setCurrentPage('landing1')}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s',
              backgroundColor: currentPage === 'landing1' ? '#1f2937' : 'transparent',
              color: currentPage === 'landing1' ? 'white' : '#6b7280'
            }}
            onMouseEnter={(e) => {
              if (currentPage !== 'landing1') {
                e.target.style.backgroundColor = '#f9fafb';
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== 'landing1') {
                e.target.style.backgroundColor = 'transparent';
              }
            }}
          >
            Design 1
          </button>
          
          <button
            onClick={() => setCurrentPage('landing2')}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s',
              backgroundColor: currentPage === 'landing2' ? '#1f2937' : 'transparent',
              color: currentPage === 'landing2' ? 'white' : '#6b7280'
            }}
            onMouseEnter={(e) => {
              if (currentPage !== 'landing2') {
                e.target.style.backgroundColor = '#f9fafb';
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== 'landing2') {
                e.target.style.backgroundColor = 'transparent';
              }
            }}
          >
            Design 2
          </button>

          <button
            onClick={() => setCurrentPage('landing3')}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s',
              backgroundColor: currentPage === 'landing3' ? '#1f2937' : 'transparent',
              color: currentPage === 'landing3' ? 'white' : '#6b7280'
            }}
            onMouseEnter={(e) => {
              if (currentPage !== 'landing3') {
                e.target.style.backgroundColor = '#f9fafb';
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== 'landing3') {
                e.target.style.backgroundColor = 'transparent';
              }
            }}
          >
            Design 3
          </button>
        </div>
        
        <div style={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          fontSize: '0.75rem',
          textAlign: 'center',
          maxWidth: '200px',
          opacity: 0.9,
          lineHeight: 1.4
        }}>
          {currentPage === 'landing1'
            ? 'Premium gradient design with advanced animations'
            : currentPage === 'landing2'
            ? 'Modern blueprint design with comprehensive features'
            : 'Luxury magic design with premium aesthetics'
          }
        </div>
      </div>

      {/* Landing Page Content */}
      {showSecondaryPages ? (
        <SecondaryPagesRouter
          onSignInClick={onSignInClick}
          onStartCreating={onStartCreating}
          onGoHome={() => setShowSecondaryPages(false)}
        />
      ) : currentPage === 'landing1' ? (
        <LandingPage
          onSignInClick={onSignInClick}
          onStartCreating={onStartCreating}
          onNavigateToSecondary={() => setShowSecondaryPages(true)}
        />
      ) : currentPage === 'landing2' ? (
        <NewLandingPage2
          onSignInClick={onSignInClick}
          onStartCreating={onStartCreating}
          onNavigateToSecondary={() => setShowSecondaryPages(true)}
        />
      ) : (
        <NewLandingPage3
          onSignInClick={onSignInClick}
          onStartCreating={onStartCreating}
          onNavigateToSecondary={() => setShowSecondaryPages(true)}
        />
      )}
      
      {/* Page Indicator */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '1rem',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        zIndex: 900
      }}>
        <div
          style={{
            width: '4px',
            height: '32px',
            borderRadius: '2px',
            backgroundColor: currentPage === 'landing1' ? '#8b5cf6' : '#e5e7eb',
            transition: 'background-color 0.3s'
          }}
        />
        <div
          style={{
            width: '4px',
            height: '32px',
            borderRadius: '2px',
            backgroundColor: currentPage === 'landing2' ? '#1f2937' : '#e5e7eb',
            transition: 'background-color 0.3s'
          }}
        />
        <div
          style={{
            width: '4px',
            height: '32px',
            borderRadius: '2px',
            backgroundColor: currentPage === 'landing3' ? '#8b5cf6' : '#e5e7eb',
            transition: 'background-color 0.3s'
          }}
        />
      </div>
    </div>
  );
};

export default LandingPageSwitcher;
