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
} from "lucide-react"
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
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

const createItems = [
  { title: "Dashboard", value: "app", icon: Home },
  { title: "Generator", value: "generator", icon: Sparkles },
  { title: "Canvas", value: "canvas", icon: Image },
  { title: "Creativity", value: "creativity", icon: Palette },
  { title: "Thumbnails", value: "thumbnails", icon: FileText },
]

const intelligenceItems = [
  { title: "Trends", value: "trends", icon: TrendingUp },
  { title: "YT Analysis", value: "channelAnalysis", icon: Youtube },
  { title: "Strategy", value: "strategy", icon: Target },
]

const planningItems = [
  { title: "Calendar", value: "calendar", icon: Calendar },
  { title: "History", value: "history", icon: History },
  { title: "YT Stats", value: "yt-stats", icon: BarChart3 },
]

const settingsItems = [
  { title: "Settings", value: "settings", icon: Settings },
]

interface StudioSidebarProps {
  activeTab?: string
  onTabChange?: (tab: string) => void
}

export function StudioSidebar({ activeTab = "app", onTabChange }: StudioSidebarProps) {
  const { state, toggleSidebar } = useSidebar()
  const collapsed = state === "collapsed"

  const isActive = (value: string) => {
    if (value === "app") {
      return activeTab === "app"
    }
    return activeTab === value
  }

  const handleItemClick = (value: string) => {
    if (onTabChange) {
      onTabChange(value)
    }
  }

  return (
    <Sidebar
      className={cn("border-r border-border-secondary")}
      collapsible="icon"
    >
      {/* Header */}
      <div className={cn(
        "border-b border-border-secondary",
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

      <SidebarContent className={cn(collapsed ? "py-4" : "p-2")}>        
        {/* CREATE Section */}
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-text-tertiary text-xs font-medium uppercase tracking-wider mb-2">
              Create
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className={cn(collapsed ? "space-y-2" : "space-y-1")}> 
              {createItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={isActive(item.value)}
                    tooltip={item.title}
                    className={cn(collapsed ? "justify-center" : "justify-start")}
                    onClick={() => handleItemClick(item.value)}
                  >
                    <item.icon className={cn("flex-shrink-0", collapsed ? "w-5 h-5" : "w-4 h-4")} />
                    {!collapsed && <span className="font-medium">{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* INTELLIGENCE Section */}
        <SidebarGroup className="mt-6">
          {!collapsed && (
            <SidebarGroupLabel className="text-text-tertiary text-xs font-medium uppercase tracking-wider mb-2">
              Intelligence
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className={cn(collapsed ? "space-y-2" : "space-y-1")}> 
              {intelligenceItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={isActive(item.value)}
                    tooltip={item.title}
                    className={cn(collapsed ? "justify-center" : "justify-start")}
                    onClick={() => handleItemClick(item.value)}
                  >
                    <item.icon className={cn("flex-shrink-0", collapsed ? "w-5 h-5" : "w-4 h-4")} />
                    {!collapsed && <span className="font-medium">{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* PLANNING Section */}
        <SidebarGroup className="mt-6">
          {!collapsed && (
            <SidebarGroupLabel className="text-text-tertiary text-xs font-medium uppercase tracking-wider mb-2">
              Planning
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className={cn(collapsed ? "space-y-2" : "space-y-1")}> 
              {planningItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={isActive(item.value)}
                    tooltip={item.title}
                    className={cn(collapsed ? "justify-center" : "justify-start")}
                    onClick={() => handleItemClick(item.value)}
                  >
                    <item.icon className={cn("flex-shrink-0", collapsed ? "w-5 h-5" : "w-4 h-4")} />
                    {!collapsed && <span className="font-medium">{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* SETTINGS Section */}
        <SidebarGroup className="mt-6">
          {!collapsed && (
            <SidebarGroupLabel className="text-text-tertiary text-xs font-medium uppercase tracking-wider mb-2">
              Settings
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className={cn(collapsed ? "space-y-2" : "space-y-1")}> 
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={isActive(item.value)}
                    tooltip={item.title}
                    className={cn(collapsed ? "justify-center" : "justify-start")}
                    onClick={() => handleItemClick(item.value)}
                  >
                    <item.icon className={cn("flex-shrink-0", collapsed ? "w-5 h-5" : "w-4 h-4")} />
                    {!collapsed && <span className="font-medium">{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-border-secondary">
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
  )
}
