import React, { useState } from "react";
import {
  FolderOpen,
  Sparkles,
  Square,
  Layers,
  Palette,
  Image,
  TrendingUp,
  BarChart3,
  Target,
  Calendar,
  Clock,
  BarChart2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { AIIcon, CollapseIcon, ExpandIcon } from "./ProfessionalIcons";

type ActiveTab =
  | "generator"
  | "canvas"
  | "channelAnalysis"
  | "history"
  | "search"
  | "strategy"
  | "calendar"
  | "trends"
  | "youtubeStats"
  | "thumbnailMaker"
  | "studioHub"
  | "creativity";

interface SidebarNavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  user: any;
  onSignInRequired?: () => void;
  onExpandedChange?: (expanded: boolean) => void;
  tabStates?: Record<ActiveTab, {
    inputs?: any;
    outputs?: any;
    loading?: boolean;
    error?: string | null;
    lastUpdated?: Date;
  }>;
  userPlan?: string;
  isPremium?: boolean;
  recentlyUsed?: Array<{
    id: ActiveTab;
    label: string;
    lastUsed: Date;
  }>;
}

interface NavigationItem {
  id: ActiveTab;
  label: string;
  icon: React.ReactNode;
  requiresAuth: boolean;
  group: "create" | "intelligence" | "planning";
  isPremium?: boolean;
  userLevel?: "beginner" | "intermediate" | "advanced" | "all";
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  activeTab,
  setActiveTab,
  user,
  onSignInRequired,
  onExpandedChange,
  tabStates,
  userPlan = "free",
  isPremium = false,
  recentlyUsed = [],
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleToggleExpanded = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    onExpandedChange?.(newExpanded);
  };

  const navigationItems: NavigationItem[] = [
    // CREATE
    {
      id: "studioHub",
      label: "Studio Hub",
      icon: <FolderOpen className="w-5 h-5 transition-all duration-200" />,
      requiresAuth: false,
      group: "create",
      userLevel: "all",
    },
    {
      id: "generator",
      label: "Generator",
      icon: <Sparkles className="w-5 h-5 transition-all duration-200" />,
      requiresAuth: false,
      group: "create",
      userLevel: "all",
    },
    {
      id: "canvas",
      label: "Canvas",
      icon: <Layers className="w-5 h-5 transition-all duration-200" />,
      requiresAuth: false,
      group: "create",
      userLevel: "intermediate",
    },
    {
      id: "creativity",
      label: "Creativity",
      icon: <Palette className="w-5 h-5 transition-all duration-200" />,
      requiresAuth: false,
      group: "create",
      isPremium: true,
      userLevel: "intermediate",
    },
    {
      id: "thumbnailMaker",
      label: "Thumbnails",
      icon: <Image className="w-5 h-5 transition-all duration-200" />,
      requiresAuth: false,
      group: "create",
      userLevel: "beginner",
    },
    // INTELLIGENCE
    {
      id: "trends",
      label: "Trends",
      icon: <TrendingUp className="w-5 h-5 transition-all duration-200" />,
      requiresAuth: false,
      group: "intelligence",
      userLevel: "all",
    },
    {
      id: "channelAnalysis",
      label: "YT Analysis",
      icon: <BarChart3 className="w-5 h-5 transition-all duration-200" />,
      requiresAuth: false,
      group: "intelligence",
      isPremium: true,
      userLevel: "advanced",
    },
    {
      id: "strategy",
      label: "Strategy",
      icon: <Target className="w-5 h-5 transition-all duration-200" />,
      requiresAuth: false,
      group: "intelligence",
      isPremium: true,
      userLevel: "intermediate",
    },
    // PLANNING
    {
      id: "calendar",
      label: "Calendar",
      icon: <Calendar className="w-5 h-5 transition-all duration-200" />,
      requiresAuth: false,
      group: "planning",
    },
    {
      id: "history",
      label: "History",
      icon: <Clock className="w-5 h-5 transition-all duration-200" />,
      requiresAuth: false,
      group: "planning",
    },
    {
      id: "youtubeStats",
      label: "YT Stats",
      icon: <BarChart2 className="w-5 h-5 transition-all duration-200" />,
      requiresAuth: false,
      group: "planning",
    },
    // HIDDEN: Web Search tab - See WEB_SEARCH_RESTORATION_GUIDE.md for re-enabling instructions
    // {
    //   id: "search",
    //   label: "Web Search",
    //   icon: (
    //     <img
    //       src="/public/icons/web-search.webp"
    //       alt="Web Search"
    //       className="w-5 h-5 object-contain transition-all duration-200"
    //       style={{ filter: "brightness(0) saturate(100%) invert(100%)" }}
    //     />
    //   ),
    //   requiresAuth: false,
    //   group: "planning",
    // },
  ];

  // Progressive disclosure: Show core features always, with premium indicators
  const shouldShowItem = (item: NavigationItem) => {
    // Always show these core features regardless of user status
    const coreFeatures = ["studioHub", "generator", "canvas", "thumbnailMaker", "trends", "channelAnalysis", "creativity", "calendar", "history", "youtubeStats"];
    if (coreFeatures.includes(item.id)) return true;

    // For other features, apply progressive disclosure
    if (item.userLevel === "all") return true;

    // For new users (no user), show beginner and some intermediate items
    if (!user && item.userLevel === "advanced") return false;

    return true;
  };

  const groupedItems = {
    create: navigationItems.filter((item) => item.group === "create" && shouldShowItem(item)),
    intelligence: navigationItems.filter((item) => item.group === "intelligence" && shouldShowItem(item)),
    planning: navigationItems.filter((item) => item.group === "planning" && shouldShowItem(item)),
  };

  const handleTabClick = (tabId: ActiveTab, requiresAuth: boolean) => {
    if (requiresAuth && !user && onSignInRequired) {
      onSignInRequired();
      return;
    }
    setActiveTab(tabId);

    // Scroll to top when switching tabs
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
  };

  const GroupHeader: React.FC<{ title: string; icon?: React.ReactNode }> = ({ title, icon }) => (
    <div className={`px-4 py-3 ${isExpanded ? 'block' : 'hidden'}`}>
      <div className="flex items-center space-x-2">
        {icon && <div className="text-slate-500">{icon}</div>}
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          {title}
        </h3>
      </div>
      <div className="h-px bg-gradient-to-r from-slate-600/60 to-transparent mt-2" />
    </div>
  );

  const NavigationGroup: React.FC<{
    title: string;
    items: NavigationItem[];
    showDivider?: boolean;
    icon?: React.ReactNode;
  }> = ({ title, items, showDivider = true, icon }) => (
    <div className="mb-6">
      <GroupHeader title={title} icon={icon} />
      <div className="space-y-1 px-3">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => handleTabClick(item.id, item.requiresAuth)}
            data-tab={item.id}
            data-tour={`${item.id}-tab`}
            className={`
              w-full 
              flex 
              items-center 
              ${isExpanded ? 'px-3 py-2.5' : 'px-3 py-3 justify-center'} 
              rounded-lg 
              transition-all 
              duration-200 
              group
              relative
              ${
                activeTab === item.id
                  ? "bg-gradient-to-r from-sky-600/20 to-blue-600/20 text-sky-300 shadow-lg border border-sky-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }
            `}
            title={!isExpanded ? item.label : undefined}
          >
            {activeTab === item.id && (
              <div className="absolute left-0 w-1 h-8 bg-gradient-to-b from-sky-400 to-blue-500 rounded-r-full" />
            )}
            <div className={`flex-shrink-0 ${activeTab === item.id ? 'text-sky-300' : 'text-slate-400 group-hover:text-slate-200'} transition-colors`}>
              {item.icon}
            </div>
            {isExpanded && (
              <>
                <span className="ml-3 font-medium text-sm truncate">
                  {item.label}
                </span>
                <div className="ml-auto flex items-center space-x-2" />
              </>
            )}
          </button>
        ))}
      </div>
      {showDivider && <div className="my-6 mx-4">
        <div className="h-px bg-gradient-to-r from-transparent via-slate-600/40 to-transparent" />
      </div>}
    </div>
  );

  return (
    <>

      {/* Sidebar */}
      <div
        className={`
          ${isExpanded ? 'w-64' : 'w-16'}
          min-h-screen
          bg-slate-900/95
          backdrop-blur-sm
          border-r
          border-slate-700/50
          transition-all
          duration-300
          ease-in-out
          shadow-2xl
          flex-shrink-0
          fixed
          top-0
          left-0
          z-50
          block
        `}
      >
        {/* Header */}
        <div className="p-3 border-b border-slate-700/50">
          {/* Toggle Button - Positioned below fixed header */}
          <div className="flex justify-end mt-16">
            <button
              onClick={handleToggleExpanded}
              className="group flex items-center justify-center w-8 h-8 rounded-md hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 transition-all duration-200 hover:scale-105 active:scale-95"
              title={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
            >
              <div className="transition-transform duration-200">
                {isExpanded ? (
                  <ChevronLeft className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-6 overflow-y-auto">
          {/* Recently Used Section */}
          {recentlyUsed.length > 0 && user && (
            <div className="mb-6">
              <div className="px-4 py-3">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    RECENT
                  </h3>
                </div>
                <div className="h-px bg-gradient-to-r from-slate-600/60 to-transparent mt-2" />
              </div>
              <div className="space-y-1 px-3">
                {recentlyUsed.slice(0, 3).map((recent) => {
                  const item = navigationItems.find(nav => nav.id === recent.id);
                  if (!item) return null;

                  return (
                    <button
                      key={recent.id}
                      onClick={() => handleTabClick(recent.id, item.requiresAuth)}
                      className={`w-full flex items-center px-3 py-2 rounded-lg transition-all duration-200 group relative ${
                        activeTab === recent.id
                          ? "bg-gradient-to-r from-sky-600/20 to-blue-600/20 text-sky-300 shadow-lg border border-sky-500/30"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                      }`}
                      title={`${recent.label} - Last used ${recent.lastUsed.toLocaleDateString()}`}
                    >
                      {activeTab === recent.id && (
                        <div className="absolute left-0 w-1 h-6 bg-gradient-to-b from-sky-400 to-blue-500 rounded-r-full" />
                      )}
                      <div className={`flex-shrink-0 ${activeTab === recent.id ? 'text-sky-300' : 'text-slate-400 group-hover:text-slate-200'} transition-colors`}>
                        {item.icon}
                      </div>
                      {isExpanded && (
                        <span className="ml-3 font-medium text-sm truncate">{recent.label}</span>
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="my-6 mx-4">
                <div className="h-px bg-gradient-to-r from-transparent via-slate-600/40 to-transparent" />
              </div>
            </div>
          )}

          <NavigationGroup
            title="CREATE"
            items={groupedItems.create}
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>}
          />
          <NavigationGroup
            title="INTELLIGENCE"
            items={groupedItems.intelligence}
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}
          />
          <NavigationGroup
            title="PLANNING"
            items={groupedItems.planning}
            showDivider={false}
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
          />
        </div>
      </div>
    </>
  );
};

export default SidebarNavigation;
