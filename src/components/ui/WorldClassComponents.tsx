import React, { ReactNode, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../../styles/worldClassDesignSystem.css';

// ============================================
// 🎨 BUTTON COMPONENTS
// ============================================

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  className?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  className = '',
  ...props
}, ref) => {
  const baseClass = 'btn-base';
  const variantClass = variant === 'primary' ? 'btn-primary' :
                     variant === 'secondary' ? 'btn-secondary' :
                     variant === 'ghost' ? 'btn-ghost' :
                     'btn-error';
  
  const sizeClass = size === 'sm' ? 'text-xs px-3 py-2' :
                   size === 'lg' ? 'text-base px-6 py-4' :
                   'text-sm px-4 py-3';

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <motion.button
      ref={ref}
      className={`${baseClass} ${variantClass} ${sizeClass} ${widthClass} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ duration: 0.15 }}
      {...props}
    >
      {loading ? (
        <motion.div
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="w-4 h-4">{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && <span className="w-4 h-4">{icon}</span>}
        </>
      )}
    </motion.button>
  );
});

// ============================================
// 🃏 CARD COMPONENTS
// ============================================

interface CardProps {
  children: ReactNode;
  variant?: 'base' | 'hover' | 'glow';
  padding?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'base',
  padding = 'md',
  className = '',
  onClick
}) => {
  const baseClass = 'card-base';
  const variantClass = variant === 'hover' ? 'card-hover cursor-pointer' :
                      variant === 'glow' ? 'card-glow' : '';
  
  const paddingClass = padding === 'sm' ? 'p-4' :
                      padding === 'lg' ? 'p-8' :
                      'p-6';

  return (
    <motion.div
      className={`${baseClass} ${variantClass} ${paddingClass} ${className}`}
      onClick={onClick}
      whileHover={onClick ? { y: -4 } : undefined}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
};

// ============================================
// 📝 INPUT COMPONENTS
// ============================================

interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'number';
  error?: string;
  icon?: ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  error,
  icon,
  disabled = false,
  fullWidth = true,
  className = ''
}) => {
  return (
    <div className={`space-y-2 ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="block text-sm font-medium text-[var(--text-primary)]">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`input-base ${icon ? 'pl-10' : ''} ${error ? 'border-[var(--color-error)]' : ''} ${className}`}
        />
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-[var(--color-error-text)]"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

// ============================================
// 🏷️ BADGE COMPONENTS
// ============================================

interface BadgeProps {
  children: ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  icon?: ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  icon,
  className = ''
}) => {
  const variantClass = variant === 'success' ? 'badge-success' :
                      variant === 'warning' ? 'badge-warning' :
                      variant === 'error' ? 'badge-error' :
                      variant === 'info' ? 'badge-info' :
                      'badge-neutral';
  
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1';

  return (
    <span className={`${variantClass} ${sizeClass} ${className}`}>
      {icon && <span className="w-3 h-3">{icon}</span>}
      {children}
    </span>
  );
};

// ============================================
// 📊 STAT CARD COMPONENT
// ============================================

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: ReactNode;
  description?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  description
}) => {
  const changeColor = changeType === 'positive' ? 'text-[var(--color-success-text)]' :
                     changeType === 'negative' ? 'text-[var(--color-error-text)]' :
                     'text-[var(--text-tertiary)]';

  return (
    <Card variant="hover" className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-[var(--text-secondary)]">{title}</p>
          <div className="flex items-baseline space-x-2">
            <h3 className="text-2xl font-bold text-[var(--text-primary)]">{value}</h3>
            {change && (
              <span className={`text-sm font-medium ${changeColor}`}>
                {change}
              </span>
            )}
          </div>
          {description && (
            <p className="text-xs text-[var(--text-tertiary)]">{description}</p>
          )}
        </div>
        {icon && (
          <div className="p-3 rounded-xl bg-[var(--surface-tertiary)] text-[var(--brand-primary)]">
            <div className="w-6 h-6">{icon}</div>
          </div>
        )}
      </div>
    </Card>
  );
};

// ============================================
// 🎯 QUICK ACTION CARD
// ============================================

interface QuickActionProps {
  title: string;
  description: string;
  icon: ReactNode;
  color: string;
  onClick: () => void;
  badge?: string;
}

export const QuickActionCard: React.FC<QuickActionProps> = ({
  title,
  description,
  icon,
  color,
  onClick,
  badge
}) => {
  return (
    <motion.div
      className="card-base card-hover cursor-pointer relative overflow-hidden group"
      onClick={onClick}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {/* Background Gradient */}
      <div 
        className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300"
        style={{ background: `linear-gradient(135deg, ${color}, transparent)` }}
      />
      
      {/* Content */}
      <div className="relative z-10 flex items-start space-x-4">
        <div 
          className="p-3 rounded-xl flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: `${color}20`, color }}
        >
          <div className="w-6 h-6">{icon}</div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors">
              {title}
            </h3>
            {badge && (
              <Badge variant="info" size="sm">{badge}</Badge>
            )}
          </div>
          <p className="text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================
// 📈 PROGRESS BAR
// ============================================

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  showLabel?: boolean;
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  size = 'md',
  color = 'var(--brand-primary)',
  showLabel = false,
  label
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const heightClass = size === 'sm' ? 'h-2' :
                     size === 'lg' ? 'h-4' :
                     'h-3';

  return (
    <div className="space-y-2">
      {(showLabel || label) && (
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-[var(--text-primary)]">
            {label || 'Progress'}
          </span>
          <span className="text-sm text-[var(--text-secondary)]">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div className={`w-full bg-[var(--surface-tertiary)] rounded-full ${heightClass} overflow-hidden`}>
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

// ============================================
// 🚀 EMPTY STATE COMPONENT
// ============================================

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionIcon?: ReactNode;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  actionIcon,
  onAction,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center py-16 px-8 ${className}`}>
      <motion.div
        className="relative mb-6"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Animated Rings */}
        <div className="absolute inset-0 -m-8">
          <div className="absolute inset-0 border-2 border-[var(--brand-primary)] rounded-full opacity-20 animate-ping" />
          <div className="absolute inset-2 border-2 border-[var(--brand-secondary)] rounded-full opacity-15 animate-ping" style={{ animationDelay: '0.5s' }} />
        </div>
        
        {/* Icon Container */}
        <div className="relative w-16 h-16 bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)] rounded-2xl flex items-center justify-center text-white shadow-xl">
          <div className="w-8 h-8">{icon}</div>
        </div>
      </motion.div>
      
      <motion.div
        className="space-y-4 max-w-md"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="heading-3 mb-2">{title}</h3>
        <p className="body-base">{description}</p>
        
        {actionLabel && onAction && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button variant="primary" onClick={onAction}>
              {actionIcon && <span className="mr-2">{actionIcon}</span>}
              {actionLabel}
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

// ============================================
// 🎊 LOADING SPINNER
// ============================================

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = ''
}) => {
  const sizeClass = size === 'sm' ? 'w-4 h-4' :
                   size === 'lg' ? 'w-8 h-8' :
                   'w-6 h-6';

  return (
    <motion.div
      className={`${sizeClass} border-2 border-[var(--border-primary)] border-t-[var(--brand-primary)] rounded-full ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );
};

// ============================================
// 🎨 GRADIENT TEXT
// ============================================

interface GradientTextProps {
  children: ReactNode;
  gradient?: string;
  className?: string;
}

export const GradientText: React.FC<GradientTextProps> = ({
  children,
  gradient = 'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))',
  className = ''
}) => {
  return (
    <span
      className={`bg-clip-text text-transparent font-bold ${className}`}
      style={{ background: gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
    >
      {children}
    </span>
  );
};

// ============================================
// 🎯 TAB HEADER COMPONENT
// ============================================

interface TabHeaderProps {
  title: string;
  subtitle: string;
  icon: ReactNode;
  badge?: string;
  actions?: ReactNode;
}

export const TabHeader: React.FC<TabHeaderProps> = ({
  title,
  subtitle,
  icon,
  badge,
  actions
}) => {
  return (
    <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--border-primary)]">
      <div className="flex items-center space-x-4">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)] text-white shadow-lg">
          <div className="w-6 h-6">{icon}</div>
        </div>
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="heading-2 mb-1">
              <GradientText>{title}</GradientText>
            </h1>
            {badge && <Badge variant="info">{badge}</Badge>}
          </div>
          <p className="body-base">{subtitle}</p>
        </div>
      </div>
      {actions && <div className="flex items-center space-x-3">{actions}</div>}
    </div>
  );
};

// ============================================
// 🪟 MODAL COMPONENT
// ============================================

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  size = 'md',
  className = ''
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={`
            relative w-full ${sizeClasses[size]}
            bg-[var(--surface-primary)]
            border border-[var(--border-primary)]
            rounded-xl shadow-2xl
            ${className}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between p-4 border-b border-[var(--border-primary)]">
              <h3 className="heading-4">{title}</h3>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-[var(--surface-secondary)] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* Body */}
          <div className="p-4">
            {children}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
