import React, { ReactNode } from 'react';
import useScreenSize from '../../hooks/useScreenSize';

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
  mobileClassName?: string;
  desktopClassName?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

interface ResponsiveGridProps {
  children: ReactNode;
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

interface ResponsiveStackProps {
  children: ReactNode;
  direction?: {
    mobile?: 'row' | 'column';
    desktop?: 'row' | 'column';
  };
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Main responsive container
export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className = '',
  mobileClassName = '',
  desktopClassName = '',
  padding = 'md',
}) => {
  const { isMobile } = useScreenSize();

  const paddingClasses = {
    none: '',
    sm: 'p-2 md:p-4',
    md: 'p-4 md:p-6',
    lg: 'p-6 md:p-8',
  };

  const baseClasses = `
    ${paddingClasses[padding]}
    ${className}
    ${isMobile ? mobileClassName : desktopClassName}
  `.trim();

  return (
    <div className={baseClasses}>
      {children}
    </div>
  );
};

// Responsive grid system
export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'md',
  className = '',
}) => {
  const gapClasses = {
    sm: 'gap-2 md:gap-3',
    md: 'gap-3 md:gap-4',
    lg: 'gap-4 md:gap-6',
  };

  const gridClasses = `
    grid
    grid-cols-${cols.mobile || 1}
    md:grid-cols-${cols.tablet || 2}
    lg:grid-cols-${cols.desktop || 3}
    ${gapClasses[gap]}
    ${className}
  `.trim();

  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
};

// Responsive stack (flex container)
export const ResponsiveStack: React.FC<ResponsiveStackProps> = ({
  children,
  direction = { mobile: 'column', desktop: 'row' },
  gap = 'md',
  className = '',
}) => {
  const gapClasses = {
    sm: 'gap-2 md:gap-3',
    md: 'gap-3 md:gap-4',
    lg: 'gap-4 md:gap-6',
  };

  const flexClasses = `
    flex
    ${direction.mobile === 'row' ? 'flex-row' : 'flex-col'}
    ${direction.desktop === 'row' ? 'md:flex-row' : 'md:flex-col'}
    ${gapClasses[gap]}
    ${className}
  `.trim();

  return (
    <div className={flexClasses}>
      {children}
    </div>
  );
};

// Mobile-optimized card component
interface MobileCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  compact?: boolean;
}

export const MobileCard: React.FC<MobileCardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false,
  compact = false,
}) => {
  const baseClasses = `
    ${compact ? 'mobile-card-compact' : 'mobile-card'}
    ${hoverable ? 'cursor-pointer hover:transform hover:scale-105' : ''}
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `.trim();

  const handleClick = () => {
    if (onClick) {
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
      onClick();
    }
  };

  return (
    <div className={baseClasses} onClick={handleClick}>
      {children}
    </div>
  );
};

// Mobile-optimized button
interface MobileButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  icon?: ReactNode;
}

export const MobileButton: React.FC<MobileButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  onClick,
  className = '',
  icon,
}) => {
  const variantClasses = {
    primary: 'mobile-btn-primary',
    secondary: 'mobile-btn-secondary',
    outline: 'border-2 border-sky-500 text-sky-400 bg-transparent hover:bg-sky-500/10',
    ghost: 'text-slate-300 hover:bg-slate-700/50',
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm min-h-[40px]',
    md: 'px-4 py-3 text-base min-h-[44px]',
    lg: 'px-6 py-4 text-lg min-h-[48px]',
  };

  const baseClasses = `
    mobile-btn
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${fullWidth ? 'w-full' : ''}
    ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `.trim();

  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
      onClick();
    }
  };

  return (
    <button 
      className={baseClasses} 
      onClick={handleClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
      ) : (
        <>
          {icon && <span className="flex-shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

// Mobile-optimized input
interface MobileInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  disabled?: boolean;
  error?: string;
  label?: string;
  className?: string;
}

export const MobileInput: React.FC<MobileInputProps> = ({
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled = false,
  error,
  label,
  className = '',
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`mobile-input ${error ? 'border-red-500 focus:border-red-500' : ''}`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
};

// Mobile-optimized modal/drawer
interface MobileModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  fullScreen?: boolean;
}

export const MobileModal: React.FC<MobileModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  fullScreen = false,
}) => {
  const { isMobile } = useScreenSize();

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (isMobile || fullScreen) {
    // Full screen modal on mobile
    return (
      <div className="fixed inset-0 z-1100 bg-slate-900">
        {title && (
          <header className="mobile-header">
            <div className="flex items-center justify-between w-full">
              <h2 className="text-lg font-semibold text-white">{title}</h2>
              <button
                onClick={onClose}
                className="mobile-btn-secondary p-2 min-h-0"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </header>
        )}
        <div className="mobile-main p-4">
          {children}
        </div>
      </div>
    );
  }

  // Regular modal on desktop
  return (
    <div 
      className="fixed inset-0 z-1100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-slate-800 rounded-2xl border border-slate-700/50 max-w-lg w-full max-h-[90vh] overflow-hidden">
        {title && (
          <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
