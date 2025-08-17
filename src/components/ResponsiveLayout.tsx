import React, { ReactNode, useEffect, useState } from 'react';

interface ResponsiveLayoutProps {
  children: ReactNode;
  className?: string;
  mobileLayout?: 'stack' | 'preserve' | 'custom';
  mobileClass?: string;
  desktopClass?: string;
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  className = '',
  mobileLayout = 'stack',
  mobileClass = '',
  desktopClass = ''
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getMobileLayoutClass = () => {
    switch (mobileLayout) {
      case 'stack':
        return 'desktop-two-column desktop-three-column desktop-four-column';
      case 'preserve':
        return '';
      case 'custom':
        return mobileClass;
      default:
        return '';
    }
  };

  const finalClassName = `
    ${className}
    ${isMobile ? getMobileLayoutClass() : desktopClass}
    ${isMobile ? 'mobile-responsive' : 'desktop-responsive'}
  `.trim();

  return (
    <div className={finalClassName}>
      {children}
    </div>
  );
};

export default ResponsiveLayout;

// Utility component for common responsive patterns
export const ResponsiveGrid: React.FC<{
  children: ReactNode;
  cols: number;
  gap?: string;
  className?: string;
}> = ({ children, cols, gap = 'gap-6', className = '' }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const gridClass = isMobile 
    ? 'grid grid-cols-1' 
    : `grid grid-cols-1 md:grid-cols-${Math.min(cols, 2)} lg:grid-cols-${cols}`;

  return (
    <div className={`${gridClass} ${gap} ${className}`}>
      {children}
    </div>
  );
};

// Component for responsive text sizing
export const ResponsiveText: React.FC<{
  children: ReactNode;
  size: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  className?: string;
  mobileSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
}> = ({ children, size, className = '', mobileSize }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const effectiveSize = isMobile && mobileSize ? mobileSize : size;
  const responsiveClass = `responsive-text-${effectiveSize}`;

  return (
    <div className={`${responsiveClass} ${className}`} style={{
      fontSize: `var(--text-${effectiveSize})`
    }}>
      {children}
    </div>
  );
};

// Component for responsive spacing
export const ResponsiveSpacing: React.FC<{
  children: ReactNode;
  padding?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  margin?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}> = ({ children, padding, margin, className = '' }) => {
  const paddingClass = padding ? `responsive-p-${padding}` : '';
  const marginClass = margin ? `responsive-m-${margin}` : '';

  return (
    <div 
      className={`${paddingClass} ${marginClass} ${className}`}
      style={{
        ...(padding && { padding: `var(--space-${padding})` }),
        ...(margin && { margin: `var(--space-${margin})` })
      }}
    >
      {children}
    </div>
  );
};
