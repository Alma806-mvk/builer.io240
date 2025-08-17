import { useState } from "react"
import { StudioLayout } from "@/components/layouts/StudioLayout"
import { Button } from "@/components/ui/button-enhanced"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Palette, 
  Zap,
  Globe,
  Download,
  Upload,
  Trash2,
  Key,
  Database,
  Webhook,
  Code,
  Users,
  Building,
  Activity,
  HardDrive,
  Cloud,
  Lock,
  AlertTriangle,
  RefreshCw
} from "lucide-react"

export default function Settings() {
  const [autoSave, setAutoSave] = useState(true)
  const [notifications, setNotifications] = useState({
    desktop: true,
    email: false,
    project: true,
    system: true
  })

  return (
    <StudioLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Settings</h1>
            <p className="text-text-secondary mt-2">Manage your application preferences and configurations</p>
          </div>
          <Button variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Reset All
          </Button>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="general" className="gap-2">
              <SettingsIcon className="w-4 h-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="workspace" className="gap-2">
              <Zap className="w-4 h-4" />
              Workspace
            </TabsTrigger>
            <TabsTrigger value="integrations" className="gap-2">
              <Code className="w-4 h-4" />
              Integrations
            </TabsTrigger>
            <TabsTrigger value="storage" className="gap-2">
              <HardDrive className="w-4 h-4" />
              Storage
            </TabsTrigger>
            <TabsTrigger value="advanced" className="gap-2">
              <Shield className="w-4 h-4" />
              Advanced
            </TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="w-5 h-5" />
                  General Settings
                </CardTitle>
                <CardDescription>
                  Configure your basic application preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Application Settings */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-text-primary">Application Behavior</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-text-secondary">Auto-save Projects</p>
                        <p className="text-sm text-text-tertiary">Automatically save changes every 30 seconds</p>
                      </div>
                      <Switch checked={autoSave} onCheckedChange={setAutoSave} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-text-secondary">Smart Suggestions</p>
                        <p className="text-sm text-text-tertiary">Show AI-powered content suggestions</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-text-secondary">Performance Mode</p>
                        <p className="text-sm text-text-tertiary">Optimize for faster rendering</p>
                      </div>
                      <Switch />
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
                        <Bell className="w-4 h-4 text-text-tertiary" />
                        <div>
                          <p className="font-medium text-text-secondary">Desktop Notifications</p>
                          <p className="text-sm text-text-tertiary">Show notifications on your desktop</p>
                        </div>
                      </div>
                      <Switch 
                        checked={notifications.desktop}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, desktop: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Activity className="w-4 h-4 text-text-tertiary" />
                        <div>
                          <p className="font-medium text-text-secondary">Project Updates</p>
                          <p className="text-sm text-text-tertiary">Notify when projects are updated</p>
                        </div>
                      </div>
                      <Switch 
                        checked={notifications.project}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, project: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-4 h-4 text-text-tertiary" />
                        <div>
                          <p className="font-medium text-text-secondary">System Alerts</p>
                          <p className="text-sm text-text-tertiary">Important system notifications</p>
                        </div>
                      </div>
                      <Switch 
                        checked={notifications.system}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, system: checked }))}
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
                      <Label htmlFor="language">Interface Language</Label>
                      <Input id="language" defaultValue="English (US)" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateFormat">Date Format</Label>
                      <Input id="dateFormat" defaultValue="MM/DD/YYYY" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Workspace Tab */}
          <TabsContent value="workspace" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Workspace Configuration
                </CardTitle>
                <CardDescription>
                  Customize your creative workspace and tools
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Default Settings */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-text-primary">Default Project Settings</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="defaultFormat">Default Export Format</Label>
                      <Input id="defaultFormat" defaultValue="PNG (High Quality)" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="defaultResolution">Default Resolution</Label>
                      <Input id="defaultResolution" defaultValue="1920x1080" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workspaceTemplate">Default Workspace Template</Label>
                    <Input id="workspaceTemplate" defaultValue="Creative Studio" />
                  </div>
                </div>

                <Separator className="bg-border-secondary" />

                {/* Tool Preferences */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-text-primary">Tool Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-text-secondary">Show Grid by Default</p>
                        <p className="text-sm text-text-tertiary">Display grid lines in new projects</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-text-secondary">Snap to Grid</p>
                        <p className="text-sm text-text-tertiary">Automatically snap objects to grid</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-text-secondary">Show Rulers</p>
                        <p className="text-sm text-text-tertiary">Display measurement rulers</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <Separator className="bg-border-secondary" />

                {/* Collaboration */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-text-primary">Collaboration Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-text-secondary">Real-time Collaboration</p>
                        <p className="text-sm text-text-tertiary">Enable live editing with team members</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-text-secondary">Share Anonymous Analytics</p>
                        <p className="text-sm text-text-tertiary">Help improve the platform</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Integrations & API
                </CardTitle>
                <CardDescription>
                  Manage external integrations and API connections
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* API Keys */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-text-primary">API Configuration</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="apiKey">API Key</Label>
                      <div className="flex gap-2">
                        <Input id="apiKey" type="password" defaultValue="sk-..." className="flex-1" />
                        <Button variant="outline" size="icon">
                          <Key className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="webhookUrl">Webhook URL</Label>
                      <Input id="webhookUrl" placeholder="https://your-app.com/webhook" />
                    </div>
                  </div>
                </div>

                <Separator className="bg-border-secondary" />

                {/* Connected Services */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-text-primary">Connected Services</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-bg-secondary rounded-lg border border-border-primary">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                          <Cloud className="w-5 h-5 text-text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-text-secondary">Google Drive</p>
                          <p className="text-sm text-text-tertiary">Connected • Auto-sync enabled</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-accent-success/20 text-accent-success border-accent-success/30">
                        Connected
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-bg-secondary rounded-lg border border-border-primary">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-border-primary rounded-lg flex items-center justify-center">
                          <Database className="w-5 h-5 text-text-tertiary" />
                        </div>
                        <div>
                          <p className="font-medium text-text-secondary">Dropbox</p>
                          <p className="text-sm text-text-tertiary">Not connected</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Connect</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-bg-secondary rounded-lg border border-border-primary">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-border-primary rounded-lg flex items-center justify-center">
                          <Webhook className="w-5 h-5 text-text-tertiary" />
                        </div>
                        <div>
                          <p className="font-medium text-text-secondary">Slack</p>
                          <p className="text-sm text-text-tertiary">Not connected</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Connect</Button>
                    </div>
                  </div>
                </div>

                <Separator className="bg-border-secondary" />

                {/* Webhooks */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-text-primary">Webhook Configuration</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="webhookEvents">Event Types</Label>
                      <Textarea 
                        id="webhookEvents" 
                        placeholder="project.created, project.updated, export.completed..."
                        className="min-h-[100px]"
                      />
                    </div>
                    <Button variant="outline" className="gap-2">
                      <Webhook className="w-4 h-4" />
                      Test Webhook
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Storage Tab */}
          <TabsContent value="storage" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HardDrive className="w-5 h-5" />
                  Storage & Data Management
                </CardTitle>
                <CardDescription>
                  Manage your storage usage and data preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Storage Usage */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-text-primary">Storage Usage</h3>
                  <div className="p-4 bg-bg-secondary rounded-lg border border-border-primary">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-text-secondary">Used Storage</span>
                      <span className="text-text-primary font-semibold">48.2 GB / 100 GB</span>
                    </div>
                    <div className="w-full bg-border-primary rounded-full h-2">
                      <div className="bg-gradient-primary h-2 rounded-full" style={{ width: '48%' }}></div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                      <div className="text-center">
                        <p className="text-text-tertiary">Projects</p>
                        <p className="text-text-primary font-semibold">32.1 GB</p>
                      </div>
                      <div className="text-center">
                        <p className="text-text-tertiary">Assets</p>
                        <p className="text-text-primary font-semibold">12.8 GB</p>
                      </div>
                      <div className="text-center">
                        <p className="text-text-tertiary">Exports</p>
                        <p className="text-text-primary font-semibold">3.3 GB</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="bg-border-secondary" />

                {/* Data Management */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-text-primary">Data Management</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-text-secondary">Auto-delete Old Exports</p>
                        <p className="text-sm text-text-tertiary">Delete exports older than 30 days</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-text-secondary">Compress Large Files</p>
                        <p className="text-sm text-text-tertiary">Automatically compress files over 10MB</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-text-secondary">Cloud Backup</p>
                        <p className="text-sm text-text-tertiary">Backup projects to cloud storage</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <Separator className="bg-border-secondary" />

                {/* Data Actions */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-text-primary">Data Actions</h3>
                  <div className="flex gap-4">
                    <Button variant="outline" className="gap-2">
                      <Download className="w-4 h-4" />
                      Export All Data
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <Upload className="w-4 h-4" />
                      Import Data
                    </Button>
                    <Button variant="outline" className="gap-2 text-accent-error border-accent-error/30 hover:bg-accent-error/10">
                      <Trash2 className="w-4 h-4" />
                      Clear Cache
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Advanced Settings
                </CardTitle>
                <CardDescription>
                  Advanced configuration options for power users
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Security */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-text-primary">Security Options</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-text-secondary">Enhanced Security Mode</p>
                        <p className="text-sm text-text-tertiary">Additional security checks and encryption</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-text-secondary">Session Timeout</p>
                        <p className="text-sm text-text-tertiary">Automatically log out after inactivity</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sessionDuration">Session Duration (minutes)</Label>
                      <Input id="sessionDuration" type="number" defaultValue="60" className="w-32" />
                    </div>
                  </div>
                </div>

                <Separator className="bg-border-secondary" />

                {/* Performance */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-text-primary">Performance Settings</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="memoryLimit">Memory Limit (MB)</Label>
                      <Input id="memoryLimit" type="number" defaultValue="2048" className="w-32" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="renderThreads">Render Threads</Label>
                      <Input id="renderThreads" type="number" defaultValue="4" className="w-32" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-text-secondary">Hardware Acceleration</p>
                        <p className="text-sm text-text-tertiary">Use GPU for rendering when available</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <Separator className="bg-border-secondary" />

                {/* Debug & Development */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-text-primary">Developer Options</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-text-secondary">Debug Mode</p>
                        <p className="text-sm text-text-tertiary">Show detailed error messages and logs</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-text-secondary">Beta Features</p>
                        <p className="text-sm text-text-tertiary">Access experimental features</p>
                      </div>
                      <Switch />
                    </div>
                    <Button variant="outline" className="gap-2">
                      <Activity className="w-4 h-4" />
                      View System Logs
                    </Button>
                  </div>
                </div>

                <Separator className="bg-border-secondary" />

                {/* Danger Zone */}
                <div className="space-y-4 p-4 bg-accent-error/5 border border-accent-error/20 rounded-lg">
                  <h3 className="font-semibold text-accent-error flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Danger Zone
                  </h3>
                  <p className="text-sm text-text-tertiary">
                    These actions cannot be undone. Please proceed with caution.
                  </p>
                  <div className="flex gap-4">
                    <Button variant="outline" className="gap-2 text-accent-error border-accent-error/30 hover:bg-accent-error/10">
                      <Trash2 className="w-4 h-4" />
                      Reset All Settings
                    </Button>
                    <Button variant="outline" className="gap-2 text-accent-error border-accent-error/30 hover:bg-accent-error/10">
                      <Lock className="w-4 h-4" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </StudioLayout>
  )
}