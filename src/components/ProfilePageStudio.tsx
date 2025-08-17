import { useState } from "react"
import "../styles/modernDesignSystem.css"
import { Button } from "@/components/ui/button-enhanced"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  User, 
  Settings, 
  Shield, 
  Palette, 
  Crown, 
  Gem,
  Calendar,
  CreditCard,
  Bell,
  Globe,
  Lock,
  Eye,
  Smartphone,
  Mail,
  Camera,
  Edit
} from "lucide-react"

interface ProfilePageStudioProps {
  onNavigateToBilling?: () => void
}

export default function ProfilePageStudio({ onNavigateToBilling }: ProfilePageStudioProps) {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("dark")
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: true,
    updates: true
  })

  return (
    <div className="modern-design-scope">
      <div className="max-w-4xl mx-auto space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Profile Settings</h1>
          <p className="text-text-secondary mt-2">Manage your account preferences and settings</p>
        </div>
        <Button variant="premium" className="gap-2">
          <Crown className="w-4 h-4" />
          Upgrade Plan
        </Button>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="profile" className="gap-2">
            <User className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="preferences" className="gap-2">
            <Settings className="w-4 h-4" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="subscription" className="gap-2">
            <Crown className="w-4 h-4" />
            Subscription
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Update your personal details and profile information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center">
                    <User className="w-12 h-12 text-text-primary" />
                  </div>
                  <Button size="icon" variant="ghost" className="absolute -bottom-2 -right-2 rounded-full bg-bg-secondary border border-border-primary">
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">Profile Picture</h3>
                  <p className="text-sm text-text-tertiary mb-3">JPG, GIF or PNG. 1MB max.</p>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Camera className="w-4 h-4" />
                    Upload Photo
                  </Button>
                </div>
              </div>

              <Separator className="bg-border-secondary" />

              {/* Form Fields */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Doe" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue="john@creategen.studio" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" defaultValue="@johndoe" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input id="bio" placeholder="Tell us about yourself..." />
              </div>

              <Button className="gap-2">
                <Edit className="w-4 h-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security & Privacy
              </CardTitle>
              <CardDescription>
                Manage your security settings and privacy preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Password Section */}
              <div className="space-y-4">
                <h3 className="font-semibold text-text-primary">Password</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Lock className="w-4 h-4" />
                    Update Password
                  </Button>
                </div>
              </div>

              <Separator className="bg-border-secondary" />

              {/* Two-Factor Authentication */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-text-primary">Two-Factor Authentication</h3>
                    <p className="text-sm text-text-tertiary">Add an extra layer of security to your account</p>
                  </div>
                  <Switch />
                </div>
                <Button variant="outline" className="gap-2">
                  <Smartphone className="w-4 h-4" />
                  Setup Authenticator App
                </Button>
              </div>

              <Separator className="bg-border-secondary" />

              {/* Privacy Settings */}
              <div className="space-y-4">
                <h3 className="font-semibold text-text-primary">Privacy Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-text-secondary">Profile Visibility</p>
                      <p className="text-sm text-text-tertiary">Control who can see your profile</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-text-secondary">Activity Status</p>
                      <p className="text-sm text-text-tertiary">Show when you're online</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-text-secondary">Data Analytics</p>
                      <p className="text-sm text-text-tertiary">Help improve our services</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Appearance & Preferences
              </CardTitle>
              <CardDescription>
                Customize your experience and interface preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme Selection */}
              <div className="space-y-4">
                <h3 className="font-semibold text-text-primary">Theme</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div 
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      theme === "light" 
                        ? "border-border-accent bg-gradient-primary-muted" 
                        : "border-border-secondary hover:border-border-primary"
                    }`}
                    onClick={() => setTheme("light")}
                  >
                    <div className="w-full h-12 bg-white rounded-md mb-2"></div>
                    <p className="text-sm font-medium text-text-secondary">Light</p>
                  </div>
                  <div 
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      theme === "dark" 
                        ? "border-border-accent bg-gradient-primary-muted" 
                        : "border-border-secondary hover:border-border-primary"
                    }`}
                    onClick={() => setTheme("dark")}
                  >
                    <div className="w-full h-12 bg-gray-900 rounded-md mb-2"></div>
                    <p className="text-sm font-medium text-text-secondary">Dark</p>
                  </div>
                  <div 
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      theme === "system" 
                        ? "border-border-accent bg-gradient-primary-muted" 
                        : "border-border-secondary hover:border-border-primary"
                    }`}
                    onClick={() => setTheme("system")}
                  >
                    <div className="w-full h-12 bg-gradient-to-r from-white to-gray-900 rounded-md mb-2"></div>
                    <p className="text-sm font-medium text-text-secondary">System</p>
                  </div>
                </div>
              </div>

              <Separator className="bg-border-secondary" />

              {/* Notifications */}
              <div className="space-y-4">
                <h3 className="font-semibold text-text-primary">Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-text-tertiary" />
                      <div>
                        <p className="font-medium text-text-secondary">Email Notifications</p>
                        <p className="text-sm text-text-tertiary">Receive updates via email</p>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications.email}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="w-4 h-4 text-text-tertiary" />
                      <div>
                        <p className="font-medium text-text-secondary">Push Notifications</p>
                        <p className="text-sm text-text-tertiary">Get notified on your device</p>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications.push}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, push: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-text-tertiary" />
                      <div>
                        <p className="font-medium text-text-secondary">Marketing Updates</p>
                        <p className="text-sm text-text-tertiary">Receive news and promotions</p>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications.marketing}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, marketing: checked }))}
                    />
                  </div>
                </div>
              </div>

              <Separator className="bg-border-secondary" />

              {/* Language & Region */}
              <div className="space-y-4">
                <h3 className="font-semibold text-text-primary">Language & Region</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Input id="language" defaultValue="English (US)" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Input id="timezone" defaultValue="UTC-5 (Eastern Time)" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subscription Tab */}
        <TabsContent value="subscription" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5" />
                Subscription & Billing
              </CardTitle>
              <CardDescription>
                Manage your subscription plan and billing information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Plan */}
              <div className="p-6 bg-gradient-primary-muted rounded-lg border border-border-accent/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                      <Crown className="w-6 h-6 text-text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-text-primary">Creator Pro</h3>
                      <p className="text-text-tertiary">$29/month • Billed monthly</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-accent-success/20 text-accent-success border-accent-success/30">
                    Active
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-tertiary">Next billing date</span>
                    <span className="text-text-secondary">March 15, 2024</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-tertiary">Renewal amount</span>
                    <span className="text-text-secondary">$29.00</span>
                  </div>
                </div>
              </div>

              {/* Credits Management */}
              <div className="space-y-4">
                <h3 className="font-semibold text-text-primary">Credits Management</h3>
                <div className="p-4 bg-bg-secondary rounded-lg border border-border-primary">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                        <Gem className="w-5 h-5 text-text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-text-primary">1,247 Credits</p>
                        <p className="text-sm text-text-tertiary">Available balance</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Buy More
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-text-tertiary">Used this month</span>
                      <span className="text-text-secondary">753 credits</span>
                    </div>
                    <Progress value={60} className="h-2" />
                    <p className="text-xs text-text-tertiary">Your plan includes 2,000 credits per month</p>
                  </div>
                </div>
              </div>

              {/* Usage Stats */}
              <div className="space-y-4">
                <h3 className="font-semibold text-text-primary">Usage Statistics</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-bg-secondary rounded-lg border border-border-primary text-center">
                    <p className="text-2xl font-bold text-text-primary">324</p>
                    <p className="text-sm text-text-tertiary">Generations</p>
                  </div>
                  <div className="p-4 bg-bg-secondary rounded-lg border border-border-primary text-center">
                    <p className="text-2xl font-bold text-text-primary">12</p>
                    <p className="text-sm text-text-tertiary">Projects</p>
                  </div>
                  <div className="p-4 bg-bg-secondary rounded-lg border border-border-primary text-center">
                    <p className="text-2xl font-bold text-text-primary">48GB</p>
                    <p className="text-sm text-text-tertiary">Storage Used</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-4">
                <Button variant="premium" className="gap-2">
                  <Crown className="w-4 h-4" />
                  Upgrade Plan
                </Button>
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={onNavigateToBilling}
                >
                  <CreditCard className="w-4 h-4" />
                  Billing History
                </Button>
                <Button variant="outline" className="gap-2">
                  <Calendar className="w-4 h-4" />
                  Cancel Subscription
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  )
}
