import { useState } from "react";
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
} from "lucide-react";

interface SettingsPageProps {
  userPlan?: string;
  isPremium?: boolean;
}

export default function SettingsPage({ userPlan, isPremium }: SettingsPageProps) {
  const [autoSave, setAutoSave] = useState(true);
  const [activeTab, setActiveTab] = useState("general");
  const [notifications, setNotifications] = useState({
    desktop: true,
    email: false,
    project: true,
    system: true
  });

  const TabButton = ({ id, label, icon: Icon, isActive, onClick }: any) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
        isActive 
          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  const SettingsCard = ({ title, description, icon: Icon, children }: any) => (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
          <Icon className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-slate-100">{title}</h3>
          <p className="text-slate-400 text-sm">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );

  const SettingsToggle = ({ label, description, checked, onChange, icon: Icon }: any) => (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        {Icon && <Icon className="w-4 h-4 text-slate-400" />}
        <div>
          <p className="font-medium text-slate-200">{label}</p>
          <p className="text-sm text-slate-400">{description}</p>
        </div>
      </div>
      <button
        onClick={() => onChange?.(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-slate-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  const InputField = ({ label, defaultValue, type = "text", placeholder }: any) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-300">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:border-indigo-500 focus:outline-none transition-colors"
      />
    </div>
  );

  const Button = ({ children, variant = "primary", size = "md", onClick, className = "" }: any) => {
    const baseClasses = "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200";
    const variants = {
      primary: "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg hover:shadow-xl",
      outline: "border border-slate-600 text-slate-300 hover:text-slate-100 hover:bg-slate-700/50",
      danger: "border border-red-500/30 text-red-400 hover:bg-red-500/10"
    };
    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2",
      lg: "px-6 py-3 text-lg"
    };
    
    return (
      <button
        onClick={onClick}
        className={`${baseClasses} ${variants[variant as keyof typeof variants]} ${sizes[size as keyof typeof sizes]} ${className}`}
      >
        {children}
      </button>
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-slate-400 mt-2">Manage your application preferences and configurations</p>
        </div>
        <Button variant="outline">
          <RefreshCw className="w-4 h-4" />
          Reset All
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 p-2 bg-slate-900/50 rounded-xl border border-slate-700/50">
        <TabButton
          id="general"
          label="General"
          icon={SettingsIcon}
          isActive={activeTab === "general"}
          onClick={setActiveTab}
        />
        <TabButton
          id="workspace"
          label="Workspace"
          icon={Zap}
          isActive={activeTab === "workspace"}
          onClick={setActiveTab}
        />
        <TabButton
          id="integrations"
          label="Integrations"
          icon={Code}
          isActive={activeTab === "integrations"}
          onClick={setActiveTab}
        />
        <TabButton
          id="storage"
          label="Storage"
          icon={HardDrive}
          isActive={activeTab === "storage"}
          onClick={setActiveTab}
        />
        <TabButton
          id="advanced"
          label="Advanced"
          icon={Shield}
          isActive={activeTab === "advanced"}
          onClick={setActiveTab}
        />
      </div>

      {/* Tab Content */}
      {activeTab === "general" && (
        <div className="space-y-6">
          <SettingsCard
            title="General Settings"
            description="Configure your basic application preferences"
            icon={SettingsIcon}
          >
            <div className="space-y-4">
              <div className="border-t border-slate-700/50 pt-4">
                <h4 className="font-semibold text-slate-200 mb-4">Application Behavior</h4>
                <div className="space-y-4">
                  <SettingsToggle
                    label="Auto-save Projects"
                    description="Automatically save changes every 30 seconds"
                    checked={autoSave}
                    onChange={setAutoSave}
                  />
                  <SettingsToggle
                    label="Smart Suggestions"
                    description="Show AI-powered content suggestions"
                    checked={true}
                    onChange={() => {}}
                  />
                  <SettingsToggle
                    label="Performance Mode"
                    description="Optimize for faster rendering"
                    checked={false}
                    onChange={() => {}}
                  />
                </div>
              </div>

              <div className="border-t border-slate-700/50 pt-4">
                <h4 className="font-semibold text-slate-200 mb-4">Notifications</h4>
                <div className="space-y-4">
                  <SettingsToggle
                    icon={Bell}
                    label="Desktop Notifications"
                    description="Show notifications on your desktop"
                    checked={notifications.desktop}
                    onChange={(checked: boolean) => setNotifications(prev => ({ ...prev, desktop: checked }))}
                  />
                  <SettingsToggle
                    icon={Activity}
                    label="Project Updates"
                    description="Notify when projects are updated"
                    checked={notifications.project}
                    onChange={(checked: boolean) => setNotifications(prev => ({ ...prev, project: checked }))}
                  />
                  <SettingsToggle
                    icon={AlertTriangle}
                    label="System Alerts"
                    description="Important system notifications"
                    checked={notifications.system}
                    onChange={(checked: boolean) => setNotifications(prev => ({ ...prev, system: checked }))}
                  />
                </div>
              </div>

              <div className="border-t border-slate-700/50 pt-4">
                <h4 className="font-semibold text-slate-200 mb-4">Language & Region</h4>
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Interface Language" defaultValue="English (US)" />
                  <InputField label="Date Format" defaultValue="MM/DD/YYYY" />
                </div>
              </div>
            </div>
          </SettingsCard>
        </div>
      )}

      {activeTab === "workspace" && (
        <div className="space-y-6">
          <SettingsCard
            title="Workspace Configuration"
            description="Customize your creative workspace and tools"
            icon={Zap}
          >
            <div className="space-y-4">
              <div className="border-t border-slate-700/50 pt-4">
                <h4 className="font-semibold text-slate-200 mb-4">Default Project Settings</h4>
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Default Export Format" defaultValue="PNG (High Quality)" />
                  <InputField label="Default Resolution" defaultValue="1920x1080" />
                </div>
                <div className="mt-4">
                  <InputField label="Default Workspace Template" defaultValue="Creative Studio" />
                </div>
              </div>

              <div className="border-t border-slate-700/50 pt-4">
                <h4 className="font-semibold text-slate-200 mb-4">Tool Preferences</h4>
                <div className="space-y-4">
                  <SettingsToggle
                    label="Show Grid by Default"
                    description="Display grid lines in new projects"
                    checked={true}
                    onChange={() => {}}
                  />
                  <SettingsToggle
                    label="Snap to Grid"
                    description="Automatically snap objects to grid"
                    checked={false}
                    onChange={() => {}}
                  />
                  <SettingsToggle
                    label="Show Rulers"
                    description="Display measurement rulers"
                    checked={true}
                    onChange={() => {}}
                  />
                </div>
              </div>

              <div className="border-t border-slate-700/50 pt-4">
                <h4 className="font-semibold text-slate-200 mb-4">Collaboration Settings</h4>
                <div className="space-y-4">
                  <SettingsToggle
                    label="Real-time Collaboration"
                    description="Enable live editing with team members"
                    checked={true}
                    onChange={() => {}}
                  />
                  <SettingsToggle
                    label="Share Anonymous Analytics"
                    description="Help improve the platform"
                    checked={false}
                    onChange={() => {}}
                  />
                </div>
              </div>
            </div>
          </SettingsCard>
        </div>
      )}

      {activeTab === "integrations" && (
        <div className="space-y-6">
          <SettingsCard
            title="Integrations & API"
            description="Manage external integrations and API connections"
            icon={Code}
          >
            <div className="space-y-4">
              <div className="border-t border-slate-700/50 pt-4">
                <h4 className="font-semibold text-slate-200 mb-4">API Configuration</h4>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <InputField label="API Key" type="password" defaultValue="sk-..." />
                    </div>
                    <button className="mt-7 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg hover:bg-slate-600 transition-colors">
                      <Key className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                  <InputField label="Webhook URL" placeholder="https://your-app.com/webhook" />
                </div>
              </div>

              <div className="border-t border-slate-700/50 pt-4">
                <h4 className="font-semibold text-slate-200 mb-4">Connected Services</h4>
                <div className="space-y-4">
                  {[
                    { name: "Google Drive", status: "Connected", connected: true, icon: Cloud },
                    { name: "Dropbox", status: "Not connected", connected: false, icon: Database },
                    { name: "Slack", status: "Not connected", connected: false, icon: Webhook }
                  ].map((service) => (
                    <div key={service.name} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          service.connected 
                            ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20' 
                            : 'bg-slate-600/50'
                        }`}>
                          <service.icon className={`w-5 h-5 ${service.connected ? 'text-indigo-400' : 'text-slate-400'}`} />
                        </div>
                        <div>
                          <p className="font-medium text-slate-200">{service.name}</p>
                          <p className="text-sm text-slate-400">{service.status}</p>
                        </div>
                      </div>
                      {service.connected ? (
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-sm">
                          Connected
                        </span>
                      ) : (
                        <Button variant="outline" size="sm">Connect</Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SettingsCard>
        </div>
      )}

      {activeTab === "storage" && (
        <div className="space-y-6">
          <SettingsCard
            title="Storage & Data Management"
            description="Manage your storage usage and data preferences"
            icon={HardDrive}
          >
            <div className="space-y-4">
              <div className="border-t border-slate-700/50 pt-4">
                <h4 className="font-semibold text-slate-200 mb-4">Storage Usage</h4>
                <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-slate-300">Used Storage</span>
                    <span className="text-slate-100 font-semibold">48.2 GB / 100 GB</span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full" style={{ width: '48%' }}></div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                    <div className="text-center">
                      <p className="text-slate-400">Projects</p>
                      <p className="text-slate-200 font-semibold">32.1 GB</p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-400">Assets</p>
                      <p className="text-slate-200 font-semibold">12.8 GB</p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-400">Exports</p>
                      <p className="text-slate-200 font-semibold">3.3 GB</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-700/50 pt-4">
                <h4 className="font-semibold text-slate-200 mb-4">Data Actions</h4>
                <div className="flex gap-4">
                  <Button variant="outline">
                    <Download className="w-4 h-4" />
                    Export All Data
                  </Button>
                  <Button variant="outline">
                    <Upload className="w-4 h-4" />
                    Import Data
                  </Button>
                  <Button variant="danger">
                    <Trash2 className="w-4 h-4" />
                    Clear Cache
                  </Button>
                </div>
              </div>
            </div>
          </SettingsCard>
        </div>
      )}

      {activeTab === "advanced" && (
        <div className="space-y-6">
          <SettingsCard
            title="Advanced Settings"
            description="Advanced configuration options for power users"
            icon={Shield}
          >
            <div className="space-y-4">
              <div className="border-t border-slate-700/50 pt-4">
                <h4 className="font-semibold text-slate-200 mb-4">Security Options</h4>
                <div className="space-y-4">
                  <SettingsToggle
                    label="Enhanced Security Mode"
                    description="Additional security checks and encryption"
                    checked={false}
                    onChange={() => {}}
                  />
                  <SettingsToggle
                    label="Session Timeout"
                    description="Automatically log out after inactivity"
                    checked={true}
                    onChange={() => {}}
                  />
                  <div className="ml-7">
                    <InputField label="Session Duration (minutes)" type="number" defaultValue="60" />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-700/50 pt-4">
                <h4 className="font-semibold text-slate-200 mb-4">Developer Options</h4>
                <div className="space-y-4">
                  <SettingsToggle
                    label="Debug Mode"
                    description="Show detailed error messages and logs"
                    checked={false}
                    onChange={() => {}}
                  />
                  <SettingsToggle
                    label="Beta Features"
                    description="Access experimental features"
                    checked={false}
                    onChange={() => {}}
                  />
                  <Button variant="outline">
                    <Activity className="w-4 h-4" />
                    View System Logs
                  </Button>
                </div>
              </div>

              <div className="border-t border-red-500/20 pt-4">
                <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
                  <h4 className="font-semibold text-red-400 flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5" />
                    Danger Zone
                  </h4>
                  <p className="text-sm text-slate-400 mb-4">
                    These actions cannot be undone. Please proceed with caution.
                  </p>
                  <div className="flex gap-4">
                    <Button variant="danger">
                      <Trash2 className="w-4 h-4" />
                      Reset All Settings
                    </Button>
                    <Button variant="danger">
                      <Lock className="w-4 h-4" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </SettingsCard>
        </div>
      )}
    </div>
  );
}
