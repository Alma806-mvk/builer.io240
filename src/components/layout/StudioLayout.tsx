import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { StudioSidebar } from "@/components/studio/StudioSidebar"
import { Button } from "@/components/ui/button-enhanced"
import { 
  Bell, 
  Search, 
  Settings,
  User,
  Menu,
  Crown,
  Gem
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

interface StudioLayoutProps {
  children: React.ReactNode
  onNavigate?: (page: string) => void
}

export function StudioLayout({ children, onNavigate }: StudioLayoutProps) {
  const handleNavigation = (page: string) => {
    if (onNavigate) {
      onNavigate(page)
    }
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-bg-primary">
        <StudioSidebar />
        
        <SidebarInset className="flex-1">
          {/* Top Header */}
          <header className="sticky top-0 z-50 border-b border-border-secondary bg-bg-primary/80 backdrop-blur-xl">
            <div className="flex h-16 items-center justify-between px-6">
              {/* Left side - Search */}
              <div className="flex items-center gap-4 flex-1 max-w-md">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-quaternary" />
                  <Input 
                    placeholder="Search projects, templates, or tools..."
                    className="pl-10 bg-bg-secondary border-border-primary focus:border-border-accent transition-colors"
                  />
                </div>
              </div>
              
              {/* Right side - Actions */}
              <div className="flex items-center gap-3">
                {/* Credits Display - Now with gradient background */}
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-bg-secondary via-bg-tertiary to-bg-secondary border border-border-accent/30 rounded-xl shadow-design-sm">
                  <div className="w-5 h-5 bg-gradient-primary rounded-full flex items-center justify-center">
                    <Gem className="w-3 h-3 text-text-primary" />
                  </div>
                  <span className="text-sm font-bold text-text-primary">1,247</span>
                  <span className="text-xs text-text-tertiary font-medium">credits</span>
                </div>
                
                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative hover-glow">
                  <Bell className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent-error rounded-full" />
                </Button>
                
                {/* Settings */}
                <Button variant="ghost" size="icon" className="hover-glow" onClick={() => handleNavigation('settings')}>
                  <Settings className="w-4 h-4" />
                </Button>
                
                {/* Upgrade Button */}
                <Button variant="premium" size="sm" className="gap-2">
                  <Crown className="w-4 h-4" />
                  <span className="font-medium">Upgrade</span>
                </Button>
                
                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-2 hover-glow">
                      <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-text-primary" />
                      </div>
                      <span className="text-text-secondary font-medium">Creator</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 glass-card border-border-primary">
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium text-text-primary">John Doe</p>
                      <p className="text-xs text-text-tertiary">john@creategen.studio</p>
                    </div>
                    <DropdownMenuSeparator className="bg-border-secondary" />
                    <DropdownMenuItem className="gap-2 text-text-secondary hover:text-text-primary" onClick={() => handleNavigation('account')}>
                      <User className="w-4 h-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 text-text-secondary hover:text-text-primary" onClick={() => handleNavigation('billing')}>
                      <Settings className="w-4 h-4" />
                      Billing & Subscription
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border-secondary" />
                    <DropdownMenuItem className="gap-2 text-accent-error">
                      <Menu className="w-4 h-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>
          
          {/* Main Content */}
          <main className="flex-1 p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
