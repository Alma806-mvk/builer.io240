import React, { useState } from 'react';
import {
  HomeIcon,
  SparklesIcon,
  ChartBarIcon,
  PaintBrushIcon,
  UserCircleIcon,
  EllipsisHorizontalIcon,
  CameraIcon,
  PlayIcon,
  DocumentTextIcon,
  CalendarIcon,
  ClockIcon,
  TvIcon,
  LightBulbIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  SparklesIcon as SparklesIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  PaintBrushIcon as PaintBrushIconSolid,
  UserCircleIcon as UserCircleIconSolid,
  EllipsisHorizontalIcon as EllipsisHorizontalIconSolid,
  CameraIcon as CameraIconSolid,
  PlayIcon as PlayIconSolid,
  DocumentTextIcon as DocumentTextIconSolid,
  CalendarIcon as CalendarIconSolid,
  ClockIcon as ClockIconSolid,
  TvIcon as TvIconSolid,
  LightBulbIcon as LightBulbIconSolid,
} from '@heroicons/react/24/solid';

type ActiveTab = 'studioHub' | 'generator' | 'canvas' | 'thumbnailMaker' | 'trends' | 'channelAnalysis' | 'strategy' | 'calendar' | 'history' | 'youtubeStats' | 'account';

interface MobileBottomNavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  user: any;
  userPlan?: string;
  onSignOut?: () => void;
  onNavigateToBilling?: () => void;
  onNavigateToAccount?: () => void;
}

interface TabItem {
  id: ActiveTab;
  label: string;
  icon: React.ComponentType<any>;
  activeIcon: React.ComponentType<any>;
  badge?: string;
  group: 'main' | 'secondary';
}

const MobileBottomNavigation: React.FC<MobileBottomNavigationProps> = ({
  activeTab,
  setActiveTab,
  user,
  userPlan = 'free',
}) => {
  const [showMoreTabs, setShowMoreTabs] = useState(false);

  const allTabs: TabItem[] = [
    // Main tabs - always visible
    {
      id: 'studioHub',
      label: 'Hub',
      icon: HomeIcon,
      activeIcon: HomeIconSolid,
      group: 'main',
    },
    {
      id: 'generator',
      label: 'Create',
      icon: SparklesIcon,
      activeIcon: SparklesIconSolid,
      badge: 'AI',
      group: 'main',
    },
    {
      id: 'trends',
      label: 'Trends',
      icon: ChartBarIcon,
      activeIcon: ChartBarIconSolid,
      group: 'main',
    },
    {
      id: 'canvas',
      label: 'Design',
      icon: PaintBrushIcon,
      activeIcon: PaintBrushIconSolid,
      group: 'main',
    },
    // Secondary tabs - shown in overflow menu
    {
      id: 'thumbnailMaker',
      label: 'Thumbnails',
      icon: CameraIcon,
      activeIcon: CameraIconSolid,
      group: 'secondary',
    },
    {
      id: 'channelAnalysis',
      label: 'YT Analysis',
      icon: PlayIcon,
      activeIcon: PlayIconSolid,
      group: 'secondary',
    },
    {
      id: 'strategy',
      label: 'Strategy',
      icon: LightBulbIcon,
      activeIcon: LightBulbIconSolid,
      group: 'secondary',
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: CalendarIcon,
      activeIcon: CalendarIconSolid,
      group: 'secondary',
    },
    {
      id: 'history',
      label: 'History',
      icon: ClockIcon,
      activeIcon: ClockIconSolid,
      group: 'secondary',
    },
    {
      id: 'youtubeStats',
      label: 'YT Stats',
      icon: TvIcon,
      activeIcon: TvIconSolid,
      group: 'secondary',
    },
  ];

  const mainTabs = allTabs.filter(tab => tab.group === 'main');
  const secondaryTabs = allTabs.filter(tab => tab.group === 'secondary');
  
  // Check if active tab is in secondary tabs
  const activeIsSecondary = secondaryTabs.some(tab => tab.id === activeTab);
  
  // If active tab is secondary, show it in main area temporarily
  const displayTabs = activeIsSecondary 
    ? [...mainTabs.slice(0, 3), secondaryTabs.find(tab => tab.id === activeTab)!]
    : mainTabs;

  const handleTabPress = (tabId: ActiveTab) => {
    // Add haptic feedback simulation
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    setActiveTab(tabId);
    setShowMoreTabs(false);
  };

  const handleMorePress = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    setShowMoreTabs(!showMoreTabs);
  };

  return (
    <>
      {/* More Tabs Overlay */}
      {showMoreTabs && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-1000"
          onClick={() => setShowMoreTabs(false)}
        >
          <div className="absolute bottom-16 left-4 right-4 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 mobile-safe-area">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">All Features</h3>
              <button
                onClick={() => setShowMoreTabs(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/50"
              >
                ✕
              </button>
            </div>
            
            {/* Secondary tabs grid */}
            <div className="grid grid-cols-3 gap-3">
              {secondaryTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = isActive ? tab.activeIcon : tab.icon;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabPress(tab.id)}
                    className={`p-4 rounded-xl transition-all duration-200 flex flex-col items-center space-y-2 ${
                      isActive
                        ? 'bg-gradient-to-br from-sky-500/20 to-purple-500/20 border border-sky-500/30 text-sky-300'
                        : 'bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-xs font-medium text-center">{tab.label}</span>
                    {tab.badge && (
                      <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Profile section */}
            <div className="border-t border-slate-700/50 mt-4 pt-4">
              <button
                onClick={() => handleTabPress('account')}
                className={`w-full p-4 rounded-xl transition-all duration-200 flex items-center space-x-3 ${
                  activeTab === 'account'
                    ? 'bg-gradient-to-r from-sky-500/20 to-purple-500/20 border border-sky-500/30 text-sky-300'
                    : 'bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white'
                }`}
              >
                <UserCircleIcon className="w-6 h-6" />
                <div className="flex-1 text-left">
                  <div className="font-medium">Profile & Settings</div>
                  <div className="text-xs opacity-75">Account, billing, preferences</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="mobile-bottom-nav" role="navigation" aria-label="Main navigation">
        <div className="mobile-tab-bar">
          {displayTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = isActive ? tab.activeIcon : tab.icon;
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabPress(tab.id)}
                className={`mobile-tab ${
                  isActive ? 'mobile-tab-active' : 'mobile-tab-inactive'
                }`}
                aria-label={`Navigate to ${tab.label}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className="relative">
                  <Icon className="mobile-tab-icon" />
                  
                  {/* Badge for special tabs */}
                  {tab.badge && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center leading-none">
                      {tab.badge}
                    </span>
                  )}
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-sky-400 rounded-full" />
                  )}
                </div>
                
                <span className="mobile-tab-label">{tab.label}</span>
              </button>
            );
          })}
          
          {/* More button */}
          <button
            onClick={handleMorePress}
            className={`mobile-tab ${
              showMoreTabs || activeIsSecondary ? 'mobile-tab-active' : 'mobile-tab-inactive'
            }`}
            aria-label="More features"
          >
            <div className="relative">
              <EllipsisHorizontalIcon className="mobile-tab-icon" />
              
              {/* Active indicator for secondary tabs */}
              {activeIsSecondary && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-sky-400 rounded-full" />
              )}
            </div>
            <span className="mobile-tab-label">More</span>
          </button>
        </div>
        
        {/* Pro badge overlay */}
        {userPlan !== 'free' && (
          <div className="absolute top-2 right-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            PRO
          </div>
        )}
      </nav>
    </>
  );
};

export default MobileBottomNavigation;
