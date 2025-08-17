import { NavLink, useLocation } from "react-router-dom"
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
import { Button } from "@/components/ui/button-enhanced"
import { cn } from "@/lib/utils"

const createItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Generator", url: "/generate", icon: Sparkles },
  { title: "Canvas", url: "/canvas", icon: Image },
  { title: "Creativity", url: "/creativity", icon: Palette },
  { title: "Thumbnails", url: "/thumbnails", icon: FileText },
]

const intelligenceItems = [
  { title: "Trends", url: "/trends", icon: TrendingUp },
  { title: "YT Analysis", url: "/yt-analysis", icon: Youtube },
  { title: "Strategy", url: "/strategy", icon: Target },
]

const planningItems = [
  { title: "Calendar", url: "/calendar", icon: Calendar },
  { title: "History", url: "/history", icon: History },
  { title: "YT Stats", url: "/yt-stats", icon: BarChart3 },
]

const settingsItems = [
  { title: "Settings", url: "/settings", icon: Settings },
]

export function StudioSidebar() {
  const { state, toggleSidebar } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname
  const collapsed = state === "collapsed"

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/"
    }
    return currentPath.startsWith(path)
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
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                    className={cn(collapsed ? "justify-center" : "justify-start")}
                  >
                    <NavLink to={item.url}>
                      <item.icon className={cn("flex-shrink-0", collapsed ? "w-5 h-5" : "w-4 h-4")} />
                      {!collapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
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
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                    className={cn(collapsed ? "justify-center" : "justify-start")}
                  >
                    <NavLink to={item.url}>
                      <item.icon className={cn("flex-shrink-0", collapsed ? "w-5 h-5" : "w-4 h-4")} />
                      {!collapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
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
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                    className={cn(collapsed ? "justify-center" : "justify-start")}
                  >
                    <NavLink to={item.url}>
                      <item.icon className={cn("flex-shrink-0", collapsed ? "w-5 h-5" : "w-4 h-4")} />
                      {!collapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
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
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                    className={cn(collapsed ? "justify-center" : "justify-start")}
                  >
                    <NavLink to={item.url}>
                      <item.icon className={cn("flex-shrink-0", collapsed ? "w-5 h-5" : "w-4 h-4")} />
                      {!collapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
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