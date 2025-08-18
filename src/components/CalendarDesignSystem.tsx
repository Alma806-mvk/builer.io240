import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

// ============================================
// 8-FIGURE APP DESIGN SYSTEM FOR CALENDAR
// ============================================

// Color Palette for Professional Calendar Apps
export const CalendarColors = {
  // Primary Brand Colors
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  
  // Secondary/Accent Colors
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  
  // Success Colors (Performance Metrics)
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  
  // Warning Colors (Attention Items)
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  
  // Error Colors (Critical Issues)
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  
  // Platform-Specific Colors
  platforms: {
    youtube: '#FF0000',
    tiktok: '#000000',
    instagram: '#E4405F',
    twitter: '#1DA1F2',
    linkedin: '#0077B5',
    facebook: '#1877F2',
  },
  
  // Gradient Definitions
  gradients: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    success: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    warning: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    premium: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    dark: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
    glow: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  }
};

// Typography Scale
export const CalendarTypography = {
  fonts: {
    primary: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
    display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'Monaco', 'Consolas', 'monospace'],
  },
  
  sizes: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
  },
  
  weights: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  
  lineHeights: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  }
};

// Spacing System (8px base unit)
export const CalendarSpacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
  36: '9rem',       // 144px
  40: '10rem',      // 160px
  44: '11rem',      // 176px
  48: '12rem',      // 192px
  52: '13rem',      // 208px
  56: '14rem',      // 224px
  60: '15rem',      // 240px
  64: '16rem',      // 256px
  72: '18rem',      // 288px
  80: '20rem',      // 320px
  96: '24rem',      // 384px
};

// Border Radius System
export const CalendarBorderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  default: '0.25rem', // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
};

// Shadow System
export const CalendarShadows = {
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  
  // Custom calendar shadows
  glow: '0 0 20px rgba(102, 126, 234, 0.4)',
  premium: '0 8px 32px rgba(102, 126, 234, 0.2)',
  elevated: '0 20px 40px rgba(0, 0, 0, 0.1)',
  soft: '0 2px 8px rgba(0, 0, 0, 0.08)',
};

// Animation Presets
export const CalendarAnimations = {
  durations: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  
  easings: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
  
  presets: {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.3 }
    },
    
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3 }
    },
    
    slideDown: {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3 }
    },
    
    slideLeft: {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: 0.3 }
    },
    
    slideRight: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: 0.3 }
    },
    
    scale: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.3 }
    },
    
    stagger: {
      animate: {
        transition: {
          staggerChildren: 0.1
        }
      }
    }
  }
};

// Component Variants System
export const CalendarComponents = {
  // Button Variants
  button: {
    base: `
      inline-flex items-center justify-center
      font-medium transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
    `,
    
    variants: {
      primary: `
        bg-blue-600 hover:bg-blue-700 text-white
        shadow-md hover:shadow-lg
        focus:ring-blue-500
      `,
      secondary: `
        bg-gray-100 hover:bg-gray-200 text-gray-900
        border border-gray-300
        focus:ring-gray-500
      `,
      ghost: `
        bg-transparent hover:bg-gray-100 text-gray-700
        focus:ring-gray-500
      `,
      outline: `
        bg-transparent border-2 border-blue-600
        text-blue-600 hover:bg-blue-50
        focus:ring-blue-500
      `,
      premium: `
        bg-gradient-to-r from-purple-600 to-blue-600
        hover:from-purple-700 hover:to-blue-700
        text-white shadow-lg hover:shadow-xl
        focus:ring-purple-500
      `
    },
    
    sizes: {
      xs: 'px-2.5 py-1.5 text-xs rounded',
      sm: 'px-3 py-2 text-sm rounded-md',
      md: 'px-4 py-2 text-sm rounded-lg',
      lg: 'px-6 py-3 text-base rounded-lg',
      xl: 'px-8 py-4 text-lg rounded-xl'
    }
  },
  
  // Card Variants
  card: {
    base: `
      bg-white border border-gray-200 rounded-xl
      shadow-sm transition-all duration-200
    `,
    
    variants: {
      default: 'hover:shadow-md',
      elevated: 'shadow-lg hover:shadow-xl',
      premium: `
        bg-gradient-to-br from-white to-blue-50
        border-blue-200 shadow-lg hover:shadow-xl
      `,
      glass: `
        bg-white/80 backdrop-blur-sm border-white/20
        shadow-xl
      `,
      glow: `
        border-blue-200 shadow-blue-100/50 shadow-lg
        hover:shadow-blue-200/50 hover:shadow-xl
      `
    }
  },
  
  // Badge Variants
  badge: {
    base: `
      inline-flex items-center px-2.5 py-0.5
      text-xs font-medium rounded-full
    `,
    
    variants: {
      primary: 'bg-blue-100 text-blue-800',
      secondary: 'bg-gray-100 text-gray-800',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
      info: 'bg-cyan-100 text-cyan-800',
      premium: 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800'
    }
  },
  
  // Input Variants
  input: {
    base: `
      block w-full border border-gray-300 rounded-lg
      px-3 py-2 text-sm placeholder-gray-500
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
      transition-colors duration-200
    `,
    
    variants: {
      default: 'bg-white',
      filled: 'bg-gray-50 border-gray-200 focus:bg-white',
      premium: `
        bg-gradient-to-r from-white to-blue-50
        border-blue-200 focus:border-blue-400
      `
    },
    
    states: {
      error: 'border-red-300 focus:ring-red-500',
      success: 'border-green-300 focus:ring-green-500',
      disabled: 'bg-gray-100 cursor-not-allowed opacity-60'
    }
  }
};

// Theme Configuration
export const CalendarTheme = {
  light: {
    background: {
      primary: '#ffffff',
      secondary: '#f8fafc',
      tertiary: '#f1f5f9',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
      tertiary: '#94a3b8',
      quaternary: '#cbd5e1',
    },
    border: {
      primary: '#e2e8f0',
      secondary: '#cbd5e1',
      accent: '#3b82f6',
    }
  },
  
  dark: {
    background: {
      primary: '#0f172a',
      secondary: '#1e293b',
      tertiary: '#334155',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#cbd5e1',
      tertiary: '#94a3b8',
      quaternary: '#64748b',
    },
    border: {
      primary: '#334155',
      secondary: '#475569',
      accent: '#3b82f6',
    }
  }
};

// Utility Functions for Design System
export const CalendarUtils = {
  // Generate consistent spacing
  spacing: (multiplier: number) => `${multiplier * 0.25}rem`,
  
  // Generate consistent typography
  typography: (size: keyof typeof CalendarTypography.sizes, weight?: keyof typeof CalendarTypography.weights) => ({
    fontSize: CalendarTypography.sizes[size],
    fontWeight: weight ? CalendarTypography.weights[weight] : CalendarTypography.weights.normal,
    fontFamily: CalendarTypography.fonts.primary.join(', '),
  }),
  
  // Generate consistent colors with opacity
  color: (color: string, opacity?: number) => 
    opacity ? `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}` : color,
  
  // Generate responsive breakpoints
  breakpoint: (size: 'sm' | 'md' | 'lg' | 'xl' | '2xl') => {
    const breakpoints = {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    };
    return `@media (min-width: ${breakpoints[size]})`;
  },
  
  // Generate consistent border styles
  border: (width: number = 1, style: string = 'solid', color: string = CalendarColors.secondary[200]) =>
    `${width}px ${style} ${color}`,
};

// Professional Calendar Component Styles
export const ProfessionalCalendarStyles = {
  // Calendar Grid Styles
  grid: {
    container: `
      grid grid-cols-7 gap-px bg-gray-200
      rounded-xl overflow-hidden shadow-lg
    `,
    
    header: `
      bg-gradient-to-r from-blue-600 to-purple-600
      text-white text-center py-3 font-semibold
      text-sm uppercase tracking-wide
    `,
    
    cell: `
      bg-white hover:bg-blue-50 transition-colors
      min-h-[120px] p-2 border-r border-b border-gray-100
      relative cursor-pointer
    `,
    
    today: `
      bg-blue-50 border-2 border-blue-300
      shadow-inner
    `,
    
    selected: `
      bg-blue-100 border-2 border-blue-500
      shadow-md
    `,
    
    otherMonth: `
      bg-gray-50 text-gray-400
      opacity-60
    `
  },
  
  // Event Styles
  event: {
    base: `
      text-xs px-2 py-1 rounded-md mb-1
      font-medium cursor-pointer
      transition-all duration-200
      hover:scale-105 hover:shadow-md
    `,
    
    platforms: {
      youtube: 'bg-red-100 text-red-800 border-l-2 border-red-500',
      tiktok: 'bg-gray-100 text-gray-800 border-l-2 border-gray-500',
      instagram: 'bg-pink-100 text-pink-800 border-l-2 border-pink-500',
      twitter: 'bg-blue-100 text-blue-800 border-l-2 border-blue-500',
      linkedin: 'bg-blue-100 text-blue-900 border-l-2 border-blue-700',
      facebook: 'bg-blue-100 text-blue-800 border-l-2 border-blue-600',
    },
    
    statuses: {
      draft: 'opacity-70 border-dashed',
      scheduled: 'border-solid',
      published: 'bg-green-100 text-green-800 border-l-2 border-green-500',
      failed: 'bg-red-100 text-red-800 border-l-2 border-red-500',
    }
  },
  
  // Performance Metrics Styles
  metrics: {
    card: `
      bg-white rounded-xl shadow-lg p-6
      border border-gray-200
      hover:shadow-xl transition-shadow duration-300
    `,
    
    chart: `
      bg-gradient-to-br from-white to-blue-50
      rounded-xl p-6 shadow-lg border border-blue-100
    `,
    
    stat: `
      text-center p-4 rounded-lg
      bg-gradient-to-br from-white to-gray-50
      border border-gray-200
    `,
    
    trend: {
      up: 'text-green-600',
      down: 'text-red-600',
      stable: 'text-gray-600',
    }
  }
};

// Export Design System Components
export const DesignSystemComponents = {
  CalendarColors,
  CalendarTypography,
  CalendarSpacing,
  CalendarBorderRadius,
  CalendarShadows,
  CalendarAnimations,
  CalendarComponents,
  CalendarTheme,
  CalendarUtils,
  ProfessionalCalendarStyles,
};

// Design System Hook for React Components
export const useCalendarDesignSystem = () => {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');
  
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  
  const getThemeClasses = (component: string, variant?: string) => {
    // Implementation for getting theme-specific classes
    return '';
  };
  
  return {
    theme,
    toggleTheme,
    getThemeClasses,
    colors: CalendarColors,
    typography: CalendarTypography,
    spacing: CalendarSpacing,
    animations: CalendarAnimations,
    utils: CalendarUtils,
  };
};

export default DesignSystemComponents;
