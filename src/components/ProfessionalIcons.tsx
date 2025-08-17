import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  className?: string;
}

const sizeMap = {
  sm: 'w-4 h-4',
  base: 'w-5 h-5', 
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
  '2xl': 'w-12 h-12'
};

const BaseIcon: React.FC<IconProps & { children: React.ReactNode }> = ({ 
  size = 'base', 
  className = '', 
  children,
  ...props 
}) => (
  <svg 
    className={`${sizeMap[size]} ${className} transition-all duration-200`}
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24" 
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {children}
  </svg>
);

// CORE NAVIGATION ICONS - Premium Design System
export const LayersIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <path d="M7 7h10v10H7z" />
    <path d="M11 11h6v6h-6z" />
  </BaseIcon>
);

export const DocumentIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14,2 14,8 20,8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10,9 9,9 8,9" />
  </BaseIcon>
);

export const EditIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
  </BaseIcon>
);

// GENERATOR & CREATION ICONS
export const GeneratorIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M12 2l3.09 6.26L22 9l-5.91 5.09L17.18 22 12 19.27 6.82 22l1.09-7.91L2 9l6.91-.74L12 2z" />
  </BaseIcon>
);

export const CanvasIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <rect x="3" y="3" width="18" height="14" rx="2" />
    <path d="M3 21h18" />
    <path d="M9 17v4" />
    <path d="M15 17v4" />
  </BaseIcon>
);

export const ThumbnailIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
  </BaseIcon>
);

// INTELLIGENCE & ANALYTICS ICONS  
export const TrendsIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M3 3v18h18" />
    <path d="m19 9-5 5-4-4-3 3" />
    <circle cx="21" cy="8" r="2" />
  </BaseIcon>
);

export const AnalyticsIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M3 3v18h18" />
    <rect width="4" height="7" x="7" y="10" rx="1" />
    <rect width="4" height="12" x="15" y="5" rx="1" />
    <rect width="4" height="4" x="11" y="13" rx="1" />
  </BaseIcon>
);

export const StrategyIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M9 12l2 2 4-4" />
    <circle cx="12" cy="12" r="9" />
  </BaseIcon>
);

// PLANNING & ORGANIZATION ICONS
export const CalendarIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <path d="m9 16 2 2 4-4" />
  </BaseIcon>
);

export const HistoryIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="12" r="9" />
    <polyline points="12,6 12,12 16,14" />
  </BaseIcon>
);

export const StatsIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M12 20V10" />
    <path d="M18 20V4" />
    <path d="M6 20v-4" />
  </BaseIcon>
);

// UI & INTERACTION ICONS
export const CollapseIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="m15 18-6-6 6-6" />
  </BaseIcon>
);

export const ExpandIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="m9 18 6-6-6-6" />
  </BaseIcon>
);

export const SearchIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </BaseIcon>
);

export const PlayIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <polygon points="5,3 19,12 5,21" />
  </BaseIcon>
);

export const DownloadIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7,10 12,15 17,10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </BaseIcon>
);

export const UploadIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17,8 12,3 7,8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </BaseIcon>
);

export const CopyIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </BaseIcon>
);

export const ShareIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </BaseIcon>
);

// STATUS & FEEDBACK ICONS
export const CheckIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <polyline points="20,6 9,17 4,12" />
  </BaseIcon>
);

export const AlertIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="12" r="9" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </BaseIcon>
);

export const LoadingIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M21 12a9 9 0 11-6.219-8.56" />
  </BaseIcon>
);

// HEADER & USER INTERFACE ICONS
export const UserIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </BaseIcon>
);

export const SettingsIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v6m0 6v6M5.64 6.64L9.88 10.88m4.24 4.24L18.36 19.36M1 12h6m6 0h6M5.64 17.36L9.88 13.12m4.24-4.24L18.36 4.64" />
  </BaseIcon>
);

export const CreditCardIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </BaseIcon>
);

export const ChevronDownIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="m6 9 6 6 6-6" />
  </BaseIcon>
);

export const ChevronUpIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="m18 15-6-6-6 6" />
  </BaseIcon>
);

export const HelpIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </BaseIcon>
);

export const LogOutIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16,17 21,12 16,7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </BaseIcon>
);

export const NotificationIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </BaseIcon>
);

export const MenuIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="4" y1="18" x2="20" y2="18" />
  </BaseIcon>
);

export const CloseIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M18 6 6 18" />
    <path d="M6 6l12 12" />
  </BaseIcon>
);

export const RefreshIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M3 21v-5h5" />
  </BaseIcon>
);

export const DevToolsIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M9.3 4.3a4.5 4.5 0 0 0 0 6.4L12 7.9l2.7 2.8a4.5 4.5 0 0 0 0-6.4L12 1.5 9.3 4.3Z" />
    <path d="M9.3 13.3a4.5 4.5 0 0 1 0 6.4L12 16.1l2.7-2.8a4.5 4.5 0 0 1 0 6.4L12 22.5l-2.7-2.8Z" />
    <path d="M18.5 12H22" />
    <path d="M2 12h3.5" />
  </BaseIcon>
);

// PRIORITY ARROWS
export const ArrowDownIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M12 5v14" />
    <path d="m19 12-7 7-7-7" />
  </BaseIcon>
);

export const ArrowRightIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </BaseIcon>
);

export const ArrowUpIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M12 19V5" />
    <path d="m5 12 7-7 7 7" />
  </BaseIcon>
);

export const ArrowLeftIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M19 12H5" />
    <path d="m12 19-7-7 7-7" />
  </BaseIcon>
);

// PREMIUM FEATURES ICONS
export const PremiumIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M12 2l3.09 6.26L22 9l-5.91 5.09L17.18 22 12 19.27 6.82 22l1.09-7.91L2 9l6.91-.74L12 2z" />
    <circle cx="12" cy="12" r="3" />
  </BaseIcon>
);

export const AIIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </BaseIcon>
);

export const StudioIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
    <circle cx="12" cy="10" r="3" />
  </BaseIcon>
);

// PLATFORM ICONS - Professional versions of platform emojis
export const YouTubeIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75,15.02 15.5,11.75 9.75,8.48" />
  </BaseIcon>
);

export const TikTokIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M9 12a4 4 0 1 0 4 4V8a5 5 0 0 0 5-5" />
    <circle cx="9" cy="16" r="4" />
  </BaseIcon>
);

export const InstagramIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </BaseIcon>
);

export const TwitterIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
  </BaseIcon>
);

export const LinkedInIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </BaseIcon>
);

export const FacebookIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </BaseIcon>
);

// CONTENT TYPE ICONS - Professional versions of content emojis
export const MobileIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </BaseIcon>
);

export const VideoContentIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <polygon points="23,7 16,12 23,17" />
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </BaseIcon>
);

export const BlogPostIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14,2 14,8 20,8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10,9 9,9 8,9" />
  </BaseIcon>
);

export const TargetIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </BaseIcon>
);

export const EmailIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </BaseIcon>
);

// PREMIUM CONTENT TYPE ICONS
export const ChartIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M3 3v18h18" />
    <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
  </BaseIcon>
);

export const FilmStripIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </BaseIcon>
);

export const MicrophoneIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </BaseIcon>
);

export const WorkflowIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
    <path d="M22 12A10 10 0 0 0 12 2v10z" />
  </BaseIcon>
);

export const GraduationIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </BaseIcon>
);

export const RocketIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </BaseIcon>
);

export const BuildingIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
    <path d="M6 12H4a2 2 0 0 0-2 2v8h4" />
    <path d="M18 9h2a2 2 0 0 1 2 2v11h-4" />
    <path d="M10 6h4" />
    <path d="M10 10h4" />
    <path d="M10 14h4" />
    <path d="M10 18h4" />
  </BaseIcon>
);

export const TeamIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </BaseIcon>
);

export const HelpCircleIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </BaseIcon>
);

export const StarIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <polygon points="12,2 15.09,8.26 22,9 17,14.74 18.18,21.02 12,17.77 5.82,21.02 7,14.74 2,9 8.91,8.26 12,2" />
  </BaseIcon>
);

// ADDITIONAL ICONS FOR TEMPLATE MANAGER
export const ClockIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="12" r="9" />
    <polyline points="12,6 12,12 16,14" />
  </BaseIcon>
);

export const PlusIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </BaseIcon>
);

export const TrashIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <polyline points="3,6 5,6 21,6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </BaseIcon>
);

export const TagIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </BaseIcon>
);

export const FolderIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </BaseIcon>
);

export const FilterIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3" />
  </BaseIcon>
);

export const SparklesIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .962L15.5 14.064a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    <path d="M20 3v4" />
    <path d="M22 5h-4" />
    <path d="M4 17v2" />
    <path d="M5 18H3" />
  </BaseIcon>
);
