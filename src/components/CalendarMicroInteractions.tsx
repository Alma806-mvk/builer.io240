import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useAnimation, useInView, useSpring, useTransform, useScroll } from 'framer-motion';
import { cn } from '../lib/utils';

// ============================================
// MICRO-INTERACTIONS FOR 8-FIGURE CALENDAR
// ============================================

// Hover Effects
export const HoverEffects = {
  // Smooth scale and shadow on hover
  elevate: {
    whileHover: {
      scale: 1.02,
      y: -2,
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.12)',
      transition: { duration: 0.2, ease: 'easeOut' }
    },
    whileTap: {
      scale: 0.98,
      y: 0,
      transition: { duration: 0.1 }
    }
  },
  
  // Gentle glow effect
  glow: {
    whileHover: {
      boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
      borderColor: 'rgba(59, 130, 246, 0.4)',
      transition: { duration: 0.3 }
    }
  },
  
  // Sophisticated tilt effect
  tilt: {
    whileHover: {
      rotate: 1,
      scale: 1.05,
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  },
  
  // Premium shimmer effect
  shimmer: {
    whileHover: {
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 0.6s ease-in-out',
      transition: { duration: 0.6 }
    }
  }
};

// Loading Animations
export const LoadingAnimations = {
  // Elegant pulse for skeleton loading
  pulse: {
    animate: {
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  },
  
  // Professional spinner
  spinner: {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: 'linear'
      }
    }
  },
  
  // Sophisticated progress bar
  progressBar: (progress: number) => ({
    animate: {
      width: `${progress}%`,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  }),
  
  // Smooth dots animation
  dots: {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  }
};

// Page Transitions
export const PageTransitions = {
  // Fade with slide
  fadeSlide: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.4, ease: 'easeOut' }
  },
  
  // Scale with fade
  scaleFade: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 },
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  
  // Professional slide
  slide: (direction: 'left' | 'right' | 'up' | 'down' = 'right') => {
    const directions = {
      left: { x: -20 },
      right: { x: 20 },
      up: { y: -20 },
      down: { y: 20 }
    };
    
    return {
      initial: { opacity: 0, ...directions[direction] },
      animate: { opacity: 1, x: 0, y: 0 },
      exit: { opacity: 0, ...directions[direction] },
      transition: { duration: 0.4, ease: 'easeOut' }
    };
  }
};

// Stagger Animations for Lists
export const StaggerAnimations = {
  // Container for staggered children
  container: {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  },
  
  // Individual items
  item: {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' }
    }
  },
  
  // Fast stagger for cards
  cardStagger: {
    container: {
      animate: {
        transition: {
          staggerChildren: 0.05
        }
      }
    },
    item: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { 
        opacity: 1, 
        scale: 1,
        transition: { duration: 0.3, ease: 'easeOut' }
      }
    }
  }
};

// Scroll-based Animations
export const ScrollAnimations = {
  // Fade in on scroll
  fadeInOnScroll: {
    initial: { opacity: 0, y: 30 },
    whileInView: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    },
    viewport: { once: true, margin: '-50px' }
  },
  
  // Scale in on scroll
  scaleInOnScroll: {
    initial: { opacity: 0, scale: 0.8 },
    whileInView: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: 'easeOut' }
    },
    viewport: { once: true, margin: '-50px' }
  },
  
  // Slide from side on scroll
  slideInOnScroll: (direction: 'left' | 'right' = 'left') => ({
    initial: { opacity: 0, x: direction === 'left' ? -50 : 50 },
    whileInView: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    },
    viewport: { once: true, margin: '-50px' }
  })
};

// Interactive Components

// Enhanced Button with Micro-interactions
interface InteractiveButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'premium';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export const InteractiveButton: React.FC<InteractiveButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  onClick,
  className = ''
}) => {
  const [isPressed, setIsPressed] = useState(false);
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
    premium: 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:shadow-xl'
  };
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  return (
    <motion.button
      className={cn(
        'relative inline-flex items-center justify-center',
        'font-medium rounded-lg transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'overflow-hidden',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      onClick={onClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      animate={isPressed ? { scale: 0.96 } : { scale: 1 }}
      transition={{ duration: 0.1 }}
    >
      {/* Ripple effect overlay */}
      <motion.div
        className="absolute inset-0 bg-white opacity-0 rounded-lg"
        whileHover={{ opacity: 0.1 }}
        transition={{ duration: 0.2 }}
      />
      
      {/* Loading spinner */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <motion.div
              className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Button content */}
      <motion.span
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.span>
    </motion.button>
  );
};

// Enhanced Card with Hover Effects
interface InteractiveCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'glow' | 'premium';
  onClick?: () => void;
  isHoverable?: boolean;
}

export const InteractiveCard: React.FC<InteractiveCardProps> = ({
  children,
  className = '',
  variant = 'default',
  onClick,
  isHoverable = true
}) => {
  const variants = {
    default: 'bg-white border border-gray-200 shadow-sm hover:shadow-md',
    elevated: 'bg-white border border-gray-200 shadow-lg hover:shadow-xl',
    glow: 'bg-white border border-blue-200 shadow-lg shadow-blue-100/50 hover:shadow-blue-200/50 hover:shadow-xl',
    premium: 'bg-gradient-to-br from-white to-blue-50 border border-blue-200 shadow-lg hover:shadow-xl'
  };
  
  return (
    <motion.div
      className={cn(
        'rounded-xl transition-all duration-300 cursor-pointer overflow-hidden',
        variants[variant],
        className
      )}
      onClick={onClick}
      whileHover={isHoverable ? { y: -2, scale: 1.02 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      layout
    >
      {/* Shine effect on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        style={{ transform: 'skewX(-20deg)' }}
      />
      
      {children}
    </motion.div>
  );
};

// Progress Bar with Smooth Animation
interface ProgressBarProps {
  progress: number;
  className?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  className = '',
  color = 'blue',
  size = 'md',
  showLabel = false
}) => {
  const colors = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    purple: 'bg-purple-600',
    orange: 'bg-orange-600'
  };
  
  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };
  
  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
      )}
      
      <div className={cn('bg-gray-200 rounded-full overflow-hidden', sizes[size])}>
        <motion.div
          className={cn('rounded-full', colors[color])}
          initial={{ width: '0%' }}
          animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ height: '100%' }}
        />
      </div>
    </div>
  );
};

// Floating Action Button with Pulse
interface FloatingActionButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  hasPulse?: boolean;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  children,
  onClick,
  className = '',
  position = 'bottom-right',
  hasPulse = false
}) => {
  const positions = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  };
  
  return (
    <motion.div
      className={cn(
        'fixed z-50',
        positions[position]
      )}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Pulse effect */}
      {hasPulse && (
        <motion.div
          className="absolute inset-0 bg-blue-400 rounded-full"
          animate={{
            scale: [1, 1.5],
            opacity: [0.7, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeOut'
          }}
        />
      )}
      
      <motion.button
        className={cn(
          'relative w-14 h-14 bg-blue-600 hover:bg-blue-700',
          'text-white rounded-full shadow-lg hover:shadow-xl',
          'flex items-center justify-center',
          'transition-colors duration-200',
          className
        )}
        onClick={onClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {children}
      </motion.button>
    </motion.div>
  );
};

// Tooltip with Smooth Animation
interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 500
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
  };
  
  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };
  
  const positions = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };
  
  const arrows = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-transparent border-l-gray-900',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900'
  };
  
  return (
    <div
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg whitespace-nowrap',
              positions[position]
            )}
          >
            {content}
            <div className={cn('absolute w-0 h-0', arrows[position])} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Notification Toast with Smooth Slide
interface NotificationProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export const Notification: React.FC<NotificationProps> = ({
  message,
  type = 'info',
  isVisible,
  onClose,
  duration = 4000
}) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);
  
  const types = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-orange-500 text-white',
    info: 'bg-blue-500 text-white'
  };
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={cn(
            'fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg',
            'max-w-md flex items-center space-x-3',
            types[type]
          )}
        >
          <span className="flex-1">{message}</span>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Parallax Scroll Effect Hook
export const useParallax = (offset: number = 50) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, offset]);
  return y;
};

// Smooth Scroll Hook
export const useSmoothScroll = () => {
  const scrollToElement = useCallback((elementId: string, offset: number = 0) => {
    const element = document.getElementById(elementId);
    if (element) {
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  }, []);
  
  return { scrollToElement };
};

// Enhanced Page Wrapper with Micro-interactions
interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ children, className = '' }) => {
  return (
    <motion.div
      className={cn('min-h-screen', className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};

// All components are exported individually above
