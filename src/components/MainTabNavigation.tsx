import React from "react";
import {
  SparklesIcon,
  ColumnsIcon,
  SearchCircleIcon,
  PlayCircleIcon,
  PhotoIcon,
  CompassIcon,
  CalendarDaysIcon,
  TrendingUpIcon,
  ListChecksIcon,
  GlobeAltIcon,
} from "../IconComponents";

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
  | "studioHub";

interface MainTabNavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  user: any;
  onSignInRequired?: () => void;
}

export const MainTabNavigation: React.FC<MainTabNavigationProps> = ({
  activeTab,
  setActiveTab,
  user,
  onSignInRequired,
}) => {
  const mainTabs = [
    {
      id: "studioHub" as const,
      label: "Studio Hub",
      icon: (
        <SparklesIcon className="h-4-25 w-4-25" />
      ),
      requiresAuth: false,
    },
    {
      id: "generator" as const,
      label: "Generator",
      icon: (
        <img
          src="https://cdn.builder.io/api/v1/assets/6450717158d74a07a2ffe087bff747e7/generatornobg-a424b1?format=webp&width=800"
          alt="Generator"
          className="w-4-25 h-4-25 object-contain transition-all duration-200"
          style={{
            filter: "brightness(0) saturate(100%) invert(100%)",
          }}
        />
      ),
      requiresAuth: false,
    },
    {
      id: "canvas" as const,
      label: "Canvas",
      icon: <ColumnsIcon className="h-4-25 w-4-25" />,
      requiresAuth: false,
    },
    {
      id: "trends" as const,
      label: "Trends",
      icon: <TrendingUpIcon className="h-4-25 w-4-25" />,
      requiresAuth: false,
    },
    {
      id: "strategy" as const,
      label: "Strategy",
      icon: <CompassIcon className="h-4-25 w-4-25" />,
      requiresAuth: false,
    },
    {
      id: "calendar" as const,
      label: "Calendar",
      icon: <CalendarDaysIcon className="h-4-25 w-4-25" />,
      requiresAuth: false,
    },
    {
      id: "thumbnailMaker" as const,
      label: "Thumbnails",
      icon: <PhotoIcon className="h-4-25 w-4-25" />,
      requiresAuth: false,
    },
    {
      id: "channelAnalysis" as const,
      label: "YT Analysis",
      icon: <SearchCircleIcon className="h-4-25 w-4-25" />,
      requiresAuth: false,
    },
    {
      id: "youtubeStats" as const,
      label: "YT Stats",
      icon: <PlayCircleIcon className="h-4-25 w-4-25" />,
      requiresAuth: false,
    },
    {
      id: "history" as const,
      label: "History",
      icon: <ListChecksIcon className="h-4-25 w-4-25" />,
      requiresAuth: false,
    },
    // HIDDEN: Web Search tab - See WEB_SEARCH_RESTORATION_GUIDE.md for re-enabling instructions
    // {
    //   id: "search" as const,
    //   label: "Web Search",
    //   icon: <GlobeAltIcon className="h-4-25 w-4-25" />,
    //   requiresAuth: false,
    // },
  ];

  const handleTabClick = (tabId: ActiveTab, requiresAuth: boolean) => {
    if (requiresAuth && !user && onSignInRequired) {
      onSignInRequired();
      return;
    }
    setActiveTab(tabId);
  };

  return (
    <div className="border-b border-slate-700/50">
      <div className="container mx-auto px-4-25">
        <nav
          className="flex space-x-0 overflow-x-auto scrollbar-hide"
          data-tour="main-navigation"
        >
          {mainTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id, tab.requiresAuth)}
              data-tab={tab.id}
              data-tour={`${tab.id}-tab`}
              className={`flex items-center space-x-2 px-4-25 py-3-25 border-b-2 whitespace-nowrap transition-all duration-200 ${
                activeTab === tab.id
                  ? "border-sky-400 text-sky-300 bg-sky-600/10"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600"
              }`}
            >
              {tab.icon}
              <span className="font-medium text-sm-25">{tab.label}</span>
              {tab.requiresAuth && !user && (
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              )}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default MainTabNavigation;
