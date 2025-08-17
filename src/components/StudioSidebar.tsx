import React from "react";
import {
  Home,
  Sparkles,
  Image,
  FileText,
  Video,
  Palette,
  Settings,
  Zap,
  TrendingUp,
  Youtube,
  Target,
  Calendar,
  History,
  BarChart3
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarRail,
  useSidebar,
} from "./ui/sidebar";
import { Button } from "./ui/button-enhanced";
import { cn } from "../lib/utils";

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
  | "creativity"
  | "settings";

interface StudioSidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  user?: any;
  onSignInRequired?: () => void;
  onExpandedChange?: (expanded: boolean) => void;
  userPlan?: string;
  isPremium?: boolean;
  setUserPlan?: (plan: string) => void;
  refreshBilling?: () => void;
}

const createItems = [
  { title: "Dashboard", tab: "studioHub", icon: Home },
  { title: "Generator", tab: "generator", icon: Sparkles },
  { title: "Canvas", tab: "canvas", icon: Image },
  { title: "Creativity", tab: "creativity", icon: Palette },
  { title: "Thumbnails", tab: "thumbnailMaker", icon: FileText },
];

const intelligenceItems = [
  { title: "Trends", tab: "trends", icon: TrendingUp },
  { title: "YT Analysis", tab: "channelAnalysis", icon: Youtube },
  { title: "Strategy", tab: "strategy", icon: Target },
];

const planningItems = [
  { title: "Calendar", tab: "calendar", icon: Calendar },
  { title: "History", tab: "history", icon: History },
  { title: "YT Stats", tab: "youtubeStats", icon: BarChart3 },
];

const settingsItems = [
  { title: "Settings", tab: "settings", icon: Settings },
];

export function StudioSidebar({
  activeTab,
  setActiveTab,
  user,
  onSignInRequired,
  onExpandedChange,
  userPlan = "free",
  isPremium = false,
  setUserPlan,
  refreshBilling,
}: StudioSidebarProps) {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";

  React.useEffect(() => {
    onExpandedChange?.(!collapsed);
  }, [collapsed, onExpandedChange]);

  const isActive = (tab: string) => {
    return activeTab === tab;
  };

  const handleTabClick = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    // Scroll to top when switching tabs
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
  };

  return (
    <Sidebar
      className={cn("border-none bg-bg-primary", collapsed ? "overflow-hidden" : "")}
      collapsible="icon"
    >
      {/* Header */}
      <div className={cn(
        "border-none bg-bg-primary",
        collapsed ? "p-3 flex flex-col items-center gap-2" : "p-4 flex items-center justify-between"
      )}>
        <div className={cn("flex items-center gap-2", collapsed ? "justify-center" : "")}> 
          <div className={cn(
            collapsed ? "w-10 h-10 rounded-xl" : "w-8 h-8 rounded-lg",
            "bg-gradient-primary flex items-center justify-center"
          )}>
            <Zap className={cn(collapsed ? "w-5 h-5" : "w-4 h-4", "text-text-primary")} />
          </div>
          {!collapsed && (
            <span className="font-bold text-lg gradient-text">CreateGen</span>
          )}
        </div>
        {collapsed ? (
          <SidebarTrigger className="hover-glow bg-bg-primary border border-border-primary shadow-design-md rounded-full" />
        ) : (
          <SidebarTrigger className="hover-glow" />
        )}
      </div>
      <SidebarRail />

      {/* Scrollable Content */}
      <SidebarContent className={cn(collapsed ? "overflow-hidden py-4" : "overflow-y-auto overflow-x-hidden p-4")}>        
        {/* CREATE Section */}
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-text-tertiary text-xs font-medium uppercase tracking-wider mb-3 px-0">
              Create
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className={cn(collapsed ? "space-y-3" : "space-y-2")}> 
              {createItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={isActive(item.tab)}
                    tooltip={item.title}
                    className={cn(
                      "w-full flex items-center rounded-lg transition-all duration-200 font-medium",
                      collapsed ? "justify-center p-2.5 h-10" : "justify-start gap-3 px-3 py-2.5 h-10",
                      isActive(item.tab) 
                        ? "bg-gradient-primary text-text-primary shadow-lg" 
                        : "text-text-secondary hover:text-text-primary hover:bg-hover-overlay"
                    )}
                    onClick={() => handleTabClick(item.tab as ActiveTab)}
                  >
                    <item.icon className={cn("flex-shrink-0", collapsed ? "w-6 h-6" : "w-5 h-5")} />
                    {!collapsed && <span className="text-sm font-medium">{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* INTELLIGENCE Section */}
        <SidebarGroup className="mt-8">
          {!collapsed && (
            <SidebarGroupLabel className="text-text-tertiary text-xs font-medium uppercase tracking-wider mb-3 px-0">
              Intelligence
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className={cn(collapsed ? "space-y-3" : "space-y-2")}> 
              {intelligenceItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={isActive(item.tab)}
                    tooltip={item.title}
                    className={cn(
                      "w-full flex items-center rounded-lg transition-all duration-200 font-medium",
                      collapsed ? "justify-center p-2.5 h-10" : "justify-start gap-3 px-3 py-2.5 h-10",
                      isActive(item.tab) 
                        ? "bg-gradient-primary text-text-primary shadow-lg" 
                        : "text-text-secondary hover:text-text-primary hover:bg-hover-overlay"
                    )}
                    onClick={() => handleTabClick(item.tab as ActiveTab)}
                  >
                    <item.icon className={cn("flex-shrink-0", collapsed ? "w-6 h-6" : "w-5 h-5")} />
                    {!collapsed && <span className="text-sm font-medium">{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* PLANNING Section */}
        <SidebarGroup className="mt-8">
          {!collapsed && (
            <SidebarGroupLabel className="text-text-tertiary text-xs font-medium uppercase tracking-wider mb-3 px-0">
              Planning
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className={cn(collapsed ? "space-y-3" : "space-y-2")}> 
              {planningItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={isActive(item.tab)}
                    tooltip={item.title}
                    className={cn(
                      "w-full flex items-center rounded-lg transition-all duration-200 font-medium",
                      collapsed ? "justify-center p-2.5 h-10" : "justify-start gap-3 px-3 py-2.5 h-10",
                      isActive(item.tab) 
                        ? "bg-gradient-primary text-text-primary shadow-lg" 
                        : "text-text-secondary hover:text-text-primary hover:bg-hover-overlay"
                    )}
                    onClick={() => handleTabClick(item.tab as ActiveTab)}
                  >
                    <item.icon className={cn("flex-shrink-0", collapsed ? "w-6 h-6" : "w-5 h-5")} />
                    {!collapsed && <span className="text-sm font-medium">{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* SETTINGS Section */}
        <SidebarGroup className="mt-8">
          {!collapsed && (
            <SidebarGroupLabel className="text-text-tertiary text-xs font-medium uppercase tracking-wider mb-3 px-0">
              Settings
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className={cn(collapsed ? "space-y-3" : "space-y-2")}> 
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={isActive(item.tab)}
                    tooltip={item.title}
                    className={cn(
                      "w-full flex items-center rounded-lg transition-all duration-200 font-medium",
                      collapsed ? "justify-center p-2.5 h-10" : "justify-start gap-3 px-3 py-2.5 h-10",
                      isActive(item.tab) 
                        ? "bg-gradient-primary text-text-primary shadow-lg" 
                        : "text-text-secondary hover:text-text-primary hover:bg-hover-overlay"
                    )}
                    onClick={() => handleTabClick(item.tab as ActiveTab)}
                  >
                    <item.icon className={cn("flex-shrink-0", collapsed ? "w-6 h-6" : "w-5 h-5")} />
                    {!collapsed && <span className="text-sm font-medium">{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Spacer to push footer to bottom */}
        <div className="flex-1 min-h-16"></div>
      </SidebarContent>

      {/* Footer - Fixed at Bottom */}
      {!collapsed && (
        <div className="p-4 border-none bg-bg-primary space-y-3">

          {/* Plan Info */}
          <div className="glass-card p-3 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-text-primary">CG</span>
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">Pro Plan</p>
                <p className="text-xs text-text-tertiary">Unlimited generations</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Sidebar>
  );
}
