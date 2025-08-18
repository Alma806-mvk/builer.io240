import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import {
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  List,
  Calendar as CalendarIcon,
  Filter,
  Settings,
  Bell,
  Search,
  Plus,
  MoreHorizontal
} from 'lucide-react';

// ============================================
// RESPONSIVE DESIGN SYSTEM FOR CALENDAR
// ============================================

// Breakpoint Hook
export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'>('lg');
  
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 480) setBreakpoint('xs');
      else if (width < 640) setBreakpoint('sm');
      else if (width < 768) setBreakpoint('md');
      else if (width < 1024) setBreakpoint('lg');
      else if (width < 1280) setBreakpoint('xl');
      else setBreakpoint('2xl');
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return {
    breakpoint,
    isMobile: ['xs', 'sm'].includes(breakpoint),
    isTablet: breakpoint === 'md',
    isDesktop: ['lg', 'xl', '2xl'].includes(breakpoint),
    isLarge: ['xl', '2xl'].includes(breakpoint)
  };
};

// Responsive Grid System
interface ResponsiveGridProps {
  children: React.ReactNode;
  columns?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  gap?: number;
  className?: string;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  columns = { xs: 1, sm: 2, md: 3, lg: 4, xl: 5, '2xl': 6 },
  gap = 4,
  className = ''
}) => {
  const { breakpoint } = useBreakpoint();
  const currentColumns = columns[breakpoint] || columns.lg || 3;
  
  return (
    <div 
      className={cn(
        'grid',
        `grid-cols-${currentColumns}`,
        `gap-${gap}`,
        className
      )}
      style={{
        gridTemplateColumns: `repeat(${currentColumns}, minmax(0, 1fr))`
      }}
    >
      {children}
    </div>
  );
};

// Mobile Navigation
interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
          
          {/* Navigation Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 lg:hidden"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto h-full">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Responsive Calendar Header
interface ResponsiveHeaderProps {
  title: string;
  onMenuClick?: () => void;
  actions?: React.ReactNode;
  showMobileMenu?: boolean;
}

export const ResponsiveHeader: React.FC<ResponsiveHeaderProps> = ({
  title,
  onMenuClick,
  actions,
  showMobileMenu = true
}) => {
  const { isMobile, isTablet } = useBreakpoint();
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            {(isMobile || isTablet) && showMobileMenu && (
              <button
                onClick={onMenuClick}
                className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            
            {/* Title */}
            <h1 className={cn(
              'font-bold text-gray-900',
              isMobile ? 'text-lg' : 'text-xl lg:text-2xl'
            )}>
              {title}
            </h1>
          </div>
          
          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            {actions}
          </div>
        </div>
      </div>
    </header>
  );
};

// Responsive Sidebar
interface ResponsiveSidebarProps {
  children: React.ReactNode;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
}

export const ResponsiveSidebar: React.FC<ResponsiveSidebarProps> = ({
  children,
  isCollapsed = false,
  onToggleCollapse,
  className = ''
}) => {
  const { isDesktop } = useBreakpoint();
  
  if (!isDesktop) return null;
  
  return (
    <motion.aside
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        'bg-white border-r border-gray-200 flex-shrink-0 overflow-hidden',
        className
      )}
    >
      {/* Collapse toggle */}
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && (
          <h2 className="font-semibold text-gray-900">Navigation</h2>
        )}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
      
      {/* Sidebar content */}
      <div className="p-4 overflow-y-auto">
        {children}
      </div>
    </motion.aside>
  );
};

// Responsive Content Area
interface ResponsiveContentProps {
  children: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  maxWidth?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  className?: string;
}

export const ResponsiveContent: React.FC<ResponsiveContentProps> = ({
  children,
  padding = 'md',
  maxWidth = 'none',
  className = ''
}) => {
  const { isMobile, isTablet } = useBreakpoint();
  
  const paddingClasses = {
    none: '',
    sm: isMobile ? 'p-2' : 'p-4',
    md: isMobile ? 'p-4' : 'p-6',
    lg: isMobile ? 'p-4' : isTablet ? 'p-6' : 'p-8'
  };
  
  const maxWidthClasses = {
    none: '',
    sm: 'max-w-sm mx-auto',
    md: 'max-w-md mx-auto',
    lg: 'max-w-lg mx-auto',
    xl: 'max-w-xl mx-auto',
    '2xl': 'max-w-2xl mx-auto',
    full: 'w-full'
  };
  
  return (
    <main className={cn(
      'flex-1 overflow-auto',
      paddingClasses[padding],
      maxWidthClasses[maxWidth],
      className
    )}>
      {children}
    </main>
  );
};

// Responsive Card Grid
interface ResponsiveCardGridProps {
  children: React.ReactNode;
  minCardWidth?: number;
  gap?: number;
  className?: string;
}

export const ResponsiveCardGrid: React.FC<ResponsiveCardGridProps> = ({
  children,
  minCardWidth = 300,
  gap = 24,
  className = ''
}) => {
  return (
    <div 
      className={cn('grid', className)}
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(${minCardWidth}px, 1fr))`,
        gap: `${gap}px`
      }}
    >
      {children}
    </div>
  );
};

// Mobile-First Calendar View Switcher
interface ViewSwitcherProps {
  currentView: 'month' | 'week' | 'day' | 'list';
  onViewChange: (view: 'month' | 'week' | 'day' | 'list') => void;
  compact?: boolean;
}

export const ResponsiveViewSwitcher: React.FC<ViewSwitcherProps> = ({
  currentView,
  onViewChange,
  compact = false
}) => {
  const { isMobile } = useBreakpoint();
  
  const views = [
    { id: 'month', label: 'Month', icon: CalendarIcon },
    { id: 'week', label: 'Week', icon: Grid3X3 },
    { id: 'day', label: 'Day', icon: List },
    { id: 'list', label: 'List', icon: List }
  ] as const;
  
  if (isMobile && !compact) {
    // Mobile: Dropdown style
    return (
      <select
        value={currentView}
        onChange={(e) => onViewChange(e.target.value as any)}
        className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
      >
        {views.map(view => (
          <option key={view.id} value={view.id}>
            {view.label}
          </option>
        ))}
      </select>
    );
  }
  
  // Desktop: Button group
  return (
    <div className="flex bg-gray-100 rounded-lg p-1">
      {views.map((view) => {
        const Icon = view.icon;
        return (
          <button
            key={view.id}
            onClick={() => onViewChange(view.id)}
            className={cn(
              'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
              currentView === view.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            )}
          >
            <Icon className="w-4 h-4 mr-2" />
            {!compact && <span>{view.label}</span>}
          </button>
        );
      })}
    </div>
  );
};

// Mobile Action Sheet
interface MobileActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const MobileActionSheet: React.FC<MobileActionSheetProps> = ({
  isOpen,
  onClose,
  title,
  children
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          
          {/* Action Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 max-h-[80vh] overflow-hidden"
          >
            {title && (
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold">{title}</h3>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
            
            <div className="p-4 overflow-y-auto max-h-[calc(80vh-4rem)]">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Responsive Calendar Layout
interface ResponsiveCalendarLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  mobileNav?: React.ReactNode;
}

export const ResponsiveCalendarLayout: React.FC<ResponsiveCalendarLayoutProps> = ({
  children,
  sidebar,
  header,
  mobileNav
}) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      {header || (
        <ResponsiveHeader
          title="Calendar"
          onMenuClick={() => setIsMobileNavOpen(true)}
          actions={
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-lg hover:bg-gray-100">
                <Search className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100">
                <Bell className="w-5 h-5" />
              </button>
              {!isMobile && (
                <button className="p-2 rounded-lg hover:bg-gray-100">
                  <Settings className="w-5 h-5" />
                </button>
              )}
            </div>
          }
        />
      )}
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar for desktop */}
        {isDesktop && sidebar && (
          <ResponsiveSidebar
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          >
            {sidebar}
          </ResponsiveSidebar>
        )}
        
        {/* Main content */}
        <ResponsiveContent>
          {children}
        </ResponsiveContent>
      </div>
      
      {/* Mobile navigation */}
      {(isMobile || isTablet) && (
        <MobileNav
          isOpen={isMobileNavOpen}
          onClose={() => setIsMobileNavOpen(false)}
        >
          {mobileNav || sidebar}
        </MobileNav>
      )}
    </div>
  );
};

// Responsive Modal
interface ResponsiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const ResponsiveModal: React.FC<ResponsiveModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}) => {
  const { isMobile } = useBreakpoint();
  
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full'
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ 
              opacity: 0, 
              scale: isMobile ? 1 : 0.95,
              y: isMobile ? '100%' : 0
            }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: 0
            }}
            exit={{ 
              opacity: 0, 
              scale: isMobile ? 1 : 0.95,
              y: isMobile ? '100%' : 0
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={cn(
              'fixed z-50 bg-white rounded-lg shadow-xl',
              isMobile 
                ? 'bottom-0 left-0 right-0 rounded-b-none max-h-[90vh]'
                : `top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${sizes[size]} w-full mx-4`
            )}
          >
            {title && (
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold">{title}</h3>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
            
            <div className={cn(
              'overflow-y-auto',
              isMobile ? 'max-h-[calc(90vh-4rem)]' : 'max-h-[80vh]'
            )}>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Responsive Bottom Navigation (Mobile)
interface BottomNavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

interface ResponsiveBottomNavProps {
  items: BottomNavItem[];
  activeItem: string;
  onItemClick: (itemId: string) => void;
}

export const ResponsiveBottomNav: React.FC<ResponsiveBottomNavProps> = ({
  items,
  activeItem,
  onItemClick
}) => {
  const { isMobile } = useBreakpoint();
  
  if (!isMobile) return null;
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="flex">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={cn(
                'flex-1 flex flex-col items-center py-2 px-1 text-xs transition-colors',
                activeItem === item.id
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              <div className="relative">
                <Icon className="w-6 h-6 mb-1" />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

// Responsive Floating Action Button
interface ResponsiveFABProps {
  onClick: () => void;
  icon?: React.ComponentType<{ className?: string }>;
  label?: string;
  extended?: boolean;
}

export const ResponsiveFloatingActionButton: React.FC<ResponsiveFABProps> = ({
  onClick,
  icon: Icon = Plus,
  label = 'Add',
  extended = false
}) => {
  const { isMobile } = useBreakpoint();
  
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        'fixed z-40 bg-blue-600 hover:bg-blue-700 text-white shadow-lg rounded-full',
        'flex items-center justify-center transition-colors',
        isMobile ? 'bottom-20 right-4' : 'bottom-6 right-6',
        extended ? 'px-4 py-3' : 'w-14 h-14'
      )}
    >
      <Icon className="w-6 h-6" />
      {extended && <span className="ml-2 font-medium">{label}</span>}
    </motion.button>
  );
};

export {
  useBreakpoint,
  ResponsiveGrid,
  MobileNav,
  ResponsiveHeader,
  ResponsiveSidebar,
  ResponsiveContent,
  ResponsiveCardGrid,
  ResponsiveViewSwitcher,
  MobileActionSheet,
  ResponsiveCalendarLayout,
  ResponsiveModal,
  ResponsiveBottomNav,
  ResponsiveFloatingActionButton
};
