import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../lib/utils';

interface BreadcrumbItem {
  label: string;
  path: string;
  isActive?: boolean;
}

interface BreadcrumbsProps {
  className?: string;
  showHome?: boolean;
}

// Route mapping for better breadcrumb labels
const ROUTE_LABELS: Record<string, string> = {
  '': 'Dashboard',
  'dashboard': 'Dashboard',
  'generator': 'Generator',
  'canvas': 'Canvas',
  'creativity': 'Creativity',
  'thumbnails': 'Thumbnails',
  'trends': 'Trends',
  'youtube-analysis': 'YouTube Analysis',
  'strategy': 'Strategy',
  'calendar': 'Calendar',
  'history': 'History',
  'youtube-stats': 'YouTube Stats',
  'settings': 'Settings',
  'profile': 'Profile',
  'billing': 'Billing',
  'terms': 'Terms of Service',
  'privacy': 'Privacy Policy',
  'content-types': 'Content Types',
  'blog-posts': 'Blog Posts',
  'social-media': 'Social Media',
  'video-scripts': 'Video Scripts',
  'channel-reports': 'Channel Reports',
  'competitor-analysis': 'Competitor Analysis',
  'project-management': 'Project Management',
  'templates': 'Templates',
  'brand-kit': 'Brand Kit'
};

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ 
  className = '',
  showHome = true 
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Generate breadcrumb items from current path
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    // Add home/dashboard if requested
    if (showHome && pathSegments.length > 0) {
      breadcrumbs.push({
        label: 'Dashboard',
        path: '/dashboard',
        isActive: false
      });
    }

    // Build breadcrumbs from path segments
    let accumulatedPath = '';
    pathSegments.forEach((segment, index) => {
      accumulatedPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      
      breadcrumbs.push({
        label: ROUTE_LABELS[segment] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
        path: accumulatedPath,
        isActive: isLast
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumbs if we're on root/dashboard only
  if (breadcrumbs.length <= 1) {
    return null;
  }

  const handleBreadcrumbClick = (path: string) => {
    navigate(path);
  };

  return (
    <nav 
      className={cn(
        "flex items-center space-x-1 text-sm text-slate-400 mb-4",
        className
      )}
      aria-label="Breadcrumb"
    >
      {breadcrumbs.map((item, index) => (
        <React.Fragment key={item.path}>
          {index > 0 && (
            <ChevronRight className="h-4 w-4 text-slate-500" />
          )}
          
          {item.isActive ? (
            <span className="text-slate-200 font-medium">
              {item.label}
            </span>
          ) : (
            <button
              onClick={() => handleBreadcrumbClick(item.path)}
              className="hover:text-slate-200 transition-colors cursor-pointer flex items-center gap-1"
            >
              {index === 0 && showHome && (
                <Home className="h-3 w-3" />
              )}
              {item.label}
            </button>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
