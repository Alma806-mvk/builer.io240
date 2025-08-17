import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  DollarSign,
  Play,
  Heart,
  MessageSquare,
  Settings,
  Upload,
  Zap,
  Star,
  Crown,
  Youtube,
  Globe,
  Calendar,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  X,
  CheckCircle,
  AlertCircle,
  Wifi,
  WifiOff,
  RefreshCw,
  Download,
  Edit3,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Music,
  Instagram,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

// Import our world-class components
import {
  Button,
  Card,
  Badge,
  StatCard,
  ProgressBar,
  GradientText,
} from "./ui/WorldClassComponents";
import TikTokQuickStats from "./TikTokQuickStats";
import InstagramQuickStats from "./InstagramQuickStats";

interface YouTubeStats {
  subscribers: number;
  totalViews: number;
  totalVideos: number;
  avgViewsPerVideo: number;
  monthlyRevenue: number;
  monthlyViews: number;
  engagementRate: number;
  subscriberGrowth: number;
  viewGrowth: number;
  revenueGrowth: number;
  topVideoViews: number;
  uploadFrequency: string;
  lastUpdated: Date;
}

interface MetricSettings {
  subscribers: boolean;
  monthlyViews: boolean;
  monthlyRevenue: boolean;
  engagement: boolean;
  totalVideos: boolean;
  avgViews: boolean;
  topVideo: boolean;
  overview: boolean;
  // Experimental features
  experimental: boolean;
  tiktokAnalytics: boolean;
  instagramAnalytics: boolean;
}

interface YouTubeQuickStatsProps {
  userPlan?: string;
  isPremium?: boolean;
  onUpgrade?: () => void;
}

const YouTubeQuickStats: React.FC<YouTubeQuickStatsProps> = ({
  userPlan = "free",
  isPremium = false,
  onUpgrade,
}) => {
  const [statsEnabled, setStatsEnabled] = useState(true);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [dataSource, setDataSource] = useState<'mock' | 'manual' | 'connected'>('mock');
  const [isConnected, setIsConnected] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [manualData, setManualData] = useState<Partial<YouTubeStats>>({});
  const [metricSettings, setMetricSettings] = useState<MetricSettings>({
    subscribers: true,
    monthlyViews: true,
    monthlyRevenue: true,
    engagement: true,
    totalVideos: true,
    avgViews: true,
    topVideo: true,
    overview: true,
    experimental: false,
    tiktokAnalytics: false,
    instagramAnalytics: false,
  });

  // Additional state for experimental features
  const [showExperimentalSection, setShowExperimentalSection] = useState(false);

  // YouTube connection state
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [connectedChannel, setConnectedChannel] = useState<string | null>(null);

  // Mock YouTube stats
  const mockStats: YouTubeStats = {
    subscribers: 47832,
    totalViews: 2847392,
    totalVideos: 124,
    avgViewsPerVideo: 22963,
    monthlyRevenue: 3245,
    monthlyViews: 456789,
    engagementRate: 7.8,
    subscriberGrowth: 12.4,
    viewGrowth: 8.7,
    revenueGrowth: 15.2,
    topVideoViews: 89453,
    uploadFrequency: "3x/week",
    lastUpdated: new Date(),
  };

  const [stats, setStats] = useState<YouTubeStats>(mockStats);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('studioHub:youtubeStatsSettings');
    if (savedSettings) {
      const { enabled, source, connected, data, metrics, connectedChannel } = JSON.parse(savedSettings);
      setStatsEnabled(enabled);
      setDataSource(source);
      setIsConnected(connected);
      setConnectedChannel(connectedChannel || null);
      if (metrics) {
        setMetricSettings(metrics);
      }
      if (data && source === 'manual') {
        setStats({ ...mockStats, ...data });
      }
    }
  }, []);

  // Save settings to localStorage
  const saveSettings = () => {
    const settings = {
      enabled: statsEnabled,
      source: dataSource,
      connected: isConnected,
      data: dataSource === 'manual' ? manualData : null,
      metrics: metricSettings,
      connectedChannel: connectedChannel,
    };
    localStorage.setItem('studioHub:youtubeStatsSettings', JSON.stringify(settings));
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getGrowthColor = (growth: number): string => {
    if (growth > 0) return "var(--color-success)";
    if (growth < 0) return "var(--color-error)";
    return "var(--text-tertiary)";
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <ArrowUpRight className="w-4 h-4" />;
    if (growth < 0) return <ArrowDownRight className="w-4 h-4" />;
    return null;
  };

  const handleConnectChannel = async () => {
    if (!isPremium) {
      onUpgrade?.();
      return;
    }

    setIsConnecting(true);
    setConnectionError(null);

    try {
      // YouTube OAuth flow for Pro users
      const response = await initiateYouTubeOAuth();

      if (response.success) {
        setIsConnected(true);
        setDataSource('connected');
        setConnectedChannel(response.channelName);

        // Update stats with real data
        if (response.channelData) {
          setStats({
            ...mockStats,
            subscribers: response.channelData.subscriberCount || mockStats.subscribers,
            totalViews: response.channelData.viewCount || mockStats.totalViews,
            totalVideos: response.channelData.videoCount || mockStats.totalVideos,
            monthlyViews: response.channelData.recentViews || mockStats.monthlyViews,
            engagementRate: response.channelData.engagementRate || mockStats.engagementRate,
            lastUpdated: new Date(),
          });
        }

        saveSettings();
      } else {
        setConnectionError(response.error || 'Failed to connect to YouTube');
      }
    } catch (error) {
      console.error('YouTube connection error:', error);
      setConnectionError('Failed to connect to YouTube. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  // YouTube OAuth implementation
  const initiateYouTubeOAuth = async (): Promise<{
    success: boolean;
    channelName?: string;
    channelData?: any;
    error?: string;
  }> => {
    return new Promise((resolve) => {
      // Simulate OAuth flow for now - in production this would use YouTube Data API v3
      // This would typically involve:
      // 1. Redirect to YouTube OAuth consent screen
      // 2. Handle callback with authorization code
      // 3. Exchange code for access token
      // 4. Fetch channel data using YouTube Data API

      // For now, simulate the flow with a realistic delay
      setTimeout(() => {
        // Simulate successful connection with realistic channel data
        const mockChannelData = {
          subscriberCount: Math.floor(Math.random() * 100000) + 10000,
          viewCount: Math.floor(Math.random() * 5000000) + 500000,
          videoCount: Math.floor(Math.random() * 200) + 50,
          recentViews: Math.floor(Math.random() * 500000) + 50000,
          engagementRate: Math.random() * 10 + 3, // 3-13% engagement
        };

        resolve({
          success: true,
          channelName: `@Creator_Official`,
          channelData: mockChannelData,
        });
      }, 2000); // Simulate API call delay
    });
  };

  const handleDisconnectChannel = () => {
    setIsConnected(false);
    setConnectedChannel(null);
    setDataSource('mock');
    setStats(mockStats);
    saveSettings();
  };

  const handleUploadData = (data: Partial<YouTubeStats>) => {
    setManualData(data);
    setStats({ ...mockStats, ...data });
    setDataSource('manual');
    setShowUploadModal(false);
    saveSettings();
  };

  // Render collapsed state if disabled
  if (!statsEnabled) {
    return (
      <Card className="bg-gradient-to-r from-red-500/5 to-red-600/5 border border-red-500/20">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center opacity-50">
              <Youtube className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-[var(--text-primary)]">
                YouTube Analytics (Hidden)
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Click to show your YouTube dashboard
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setStatsEnabled(true);
              saveSettings();
            }}
          >
            <Eye className="w-4 h-4 mr-2" />
            Show Dashboard
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="relative overflow-hidden">
        {/* Premium Badge */}
        {!isPremium && (
          <div className="absolute top-4 right-4 z-10">
            <Badge variant="warning" className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-yellow-400/30 flex items-center space-x-1">
              <Crown className="w-4 h-4" />
              <span>Premium</span>
            </Badge>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <Youtube className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center space-x-2">
                <span>YouTube Analytics</span>
                <Badge variant="neutral" className="text-xs">
                  {Object.values(metricSettings).filter(Boolean).length}/{Object.keys(metricSettings).length} metrics
                </Badge>
                {isConnecting && isPremium && (
                  <div className="flex items-center space-x-1">
                    <RefreshCw className="w-4 h-4 text-[var(--color-warning)] animate-spin" />
                    <span className="text-sm text-[var(--color-warning)]">Connecting...</span>
                  </div>
                )}
                {isConnected && isPremium && !isConnecting && (
                  <div className="flex items-center space-x-1">
                    <Wifi className="w-4 h-4 text-[var(--color-success)]" />
                    <span className="text-sm text-[var(--color-success)]">Connected</span>
                    {connectedChannel && (
                      <span className="text-xs text-[var(--text-secondary)]">({connectedChannel})</span>
                    )}
                  </div>
                )}
                {!isConnected && !isConnecting && dataSource === 'mock' && (
                  <div className="flex items-center space-x-1">
                    <WifiOff className="w-4 h-4 text-[var(--text-tertiary)]" />
                    <span className="text-sm text-[var(--text-tertiary)]">Demo Data</span>
                  </div>
                )}
              </h2>
              <p className="text-sm text-[var(--text-secondary)]">
                {isConnecting && "Connecting to your YouTube channel..."}
                {!isConnecting && dataSource === 'mock' && "Demo data for preview"}
                {!isConnecting && dataSource === 'manual' && "Using uploaded data"}
                {!isConnecting && dataSource === 'connected' && isPremium && isConnected && `Connected to ${connectedChannel || 'your channel'}`}
                {!isConnecting && dataSource === 'connected' && !isPremium && "Connect your channel (Premium required)"}
                {connectionError && `Connection failed: ${connectionError}`}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCustomizeModal(true)}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        {/* Quick Stats Grid */}
        {(metricSettings.subscribers || metricSettings.monthlyViews || metricSettings.monthlyRevenue || metricSettings.engagement) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {metricSettings.subscribers && (
              <StatCard
                title="Subscribers"
                value={formatNumber(stats.subscribers)}
                change={`${stats.subscriberGrowth > 0 ? '+' : ''}${stats.subscriberGrowth}%`}
                icon={<Users className="w-5 h-5" />}
                trend={stats.subscriberGrowth > 0 ? 'up' : 'down'}
                color="var(--brand-primary)"
              />
            )}
            {metricSettings.monthlyViews && (
              <StatCard
                title="Monthly Views"
                value={formatNumber(stats.monthlyViews)}
                change={`${stats.viewGrowth > 0 ? '+' : ''}${stats.viewGrowth}%`}
                icon={<Eye className="w-5 h-5" />}
                trend={stats.viewGrowth > 0 ? 'up' : 'down'}
                color="var(--accent-cyan)"
              />
            )}
            {metricSettings.monthlyRevenue && (
              <StatCard
                title="Monthly Revenue"
                value={`$${formatNumber(stats.monthlyRevenue)}`}
                change={`${stats.revenueGrowth > 0 ? '+' : ''}${stats.revenueGrowth}%`}
                icon={<DollarSign className="w-5 h-5" />}
                trend={stats.revenueGrowth > 0 ? 'up' : 'down'}
                color="var(--color-success)"
              />
            )}
            {metricSettings.engagement && (
              <StatCard
                title="Engagement"
                value={`${stats.engagementRate}%`}
                change="Avg rate"
                icon={<Heart className="w-5 h-5" />}
                trend="neutral"
                color="var(--brand-secondary)"
              />
            )}
          </div>
        )}

        {/* Channel Overview */}
        {(metricSettings.totalVideos || metricSettings.avgViews || metricSettings.topVideo) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {metricSettings.totalVideos && (
              <div className="bg-[var(--surface-secondary)] rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[var(--text-secondary)]">Total Videos</span>
                  <Play className="w-4 h-4 text-[var(--text-tertiary)]" />
                </div>
                <div className="text-2xl font-bold text-[var(--text-primary)]">
                  {stats.totalVideos}
                </div>
                <div className="text-xs text-[var(--text-secondary)]">
                  {stats.uploadFrequency} upload rate
                </div>
              </div>
            )}

            {metricSettings.avgViews && (
              <div className="bg-[var(--surface-secondary)] rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[var(--text-secondary)]">Avg Views/Video</span>
                  <BarChart3 className="w-4 h-4 text-[var(--text-tertiary)]" />
                </div>
                <div className="text-2xl font-bold text-[var(--text-primary)]">
                  {formatNumber(stats.avgViewsPerVideo)}
                </div>
                <div className="text-xs text-[var(--text-secondary)]">
                  Per video average
                </div>
              </div>
            )}

            {metricSettings.topVideo && (
              <div className="bg-[var(--surface-secondary)] rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[var(--text-secondary)]">Top Video</span>
                  <Star className="w-4 h-4 text-[var(--text-tertiary)]" />
                </div>
                <div className="text-2xl font-bold text-[var(--text-primary)]">
                  {formatNumber(stats.topVideoViews)}
                </div>
                <div className="text-xs text-[var(--text-secondary)]">
                  Best performer
                </div>
              </div>
            )}
          </div>
        )}

        {/* Call to Action */}
        {metricSettings.overview && (
          <div className="bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <Youtube className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text-primary)]">
                  {!isPremium ? "Unlock Real-Time Analytics" :
                   isConnecting ? "Connecting Channel..." :
                   !isConnected ? "Connect Your Channel" :
                   `Connected to ${connectedChannel || 'Your Channel'}`}
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  {!isPremium ? "Get live data, advanced insights, and automated reports" :
                   isConnecting ? "Authorizing access to your YouTube channel..." :
                   !isConnected ? "Access your real YouTube analytics with one click" :
                   "Last updated " + new Date(stats.lastUpdated).toLocaleTimeString()}
                  {connectionError && (
                    <span className="text-[var(--color-error)] block">
                      {connectionError}
                    </span>
                  )}
                </p>
              </div>
            </div>
            {!isPremium ? (
              <Button variant="primary" onClick={onUpgrade}>
                <Crown className="w-4 h-4 mr-2" />
                Upgrade
              </Button>
            ) : isConnecting ? (
              <Button variant="primary" disabled>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Connecting...
              </Button>
            ) : !isConnected ? (
              <div className="flex space-x-2">
                <Button variant="primary" onClick={handleConnectChannel}>
                  <Youtube className="w-4 h-4 mr-2" />
                  Connect YouTube
                </Button>
                {connectionError && (
                  <Button variant="ghost" size="sm" onClick={() => setConnectionError(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleDisconnectChannel}
                >
                  <X className="w-4 h-4 mr-2" />
                  Disconnect
                </Button>
              </div>
            )}
          </div>
        </div>
        )}

        {/* Last Updated */}
        <div className="mt-4 text-center">
          <p className="text-xs text-[var(--text-tertiary)]">
            <Clock className="w-3 h-3 inline mr-1" />
            Last updated: {stats.lastUpdated.toLocaleString()}
          </p>
        </div>
      </Card>

      {/* Experimental Analytics Section */}
      {metricSettings.experimental && (
        <div className="space-y-6 mt-6">
          {/* Section Header */}
          <div
            className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl cursor-pointer"
            onClick={() => setShowExperimentalSection(!showExperimentalSection)}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text-primary)] flex items-center space-x-2">
                  <span>Experimental Analytics</span>
                  <Badge variant="warning" className="bg-orange-500/20 text-orange-400 border-orange-400/30">
                    Beta
                  </Badge>
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  TikTok and Instagram analytics (manual data upload required)
                </p>
              </div>
            </div>
            <motion.div
              animate={{ rotate: showExperimentalSection ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="w-5 h-5 text-[var(--text-secondary)]" />
            </motion.div>
          </div>

          {/* Experimental Content */}
          <AnimatePresence>
            {showExperimentalSection && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-6 overflow-hidden"
              >
                {/* TikTok Analytics */}
                {metricSettings.tiktokAnalytics && (
                  <TikTokQuickStats
                    userPlan={userPlan}
                    isPremium={isPremium}
                    onUpgrade={onUpgrade}
                    enabled={metricSettings.tiktokAnalytics}
                    onToggle={(enabled) => setMetricSettings(prev => ({ ...prev, tiktokAnalytics: enabled }))}
                  />
                )}

                {/* Instagram Analytics */}
                {metricSettings.instagramAnalytics && (
                  <InstagramQuickStats
                    userPlan={userPlan}
                    isPremium={isPremium}
                    onUpgrade={onUpgrade}
                    enabled={metricSettings.instagramAnalytics}
                    onToggle={(enabled) => setMetricSettings(prev => ({ ...prev, instagramAnalytics: enabled }))}
                  />
                )}

                {/* Enable Options for disabled analytics */}
                {(!metricSettings.tiktokAnalytics || !metricSettings.instagramAnalytics) && (
                  <Card className="bg-gradient-to-r from-gray-500/5 to-gray-600/5 border border-gray-500/20">
                    <div className="p-4">
                      <h4 className="font-semibold text-[var(--text-primary)] mb-3 flex items-center space-x-2">
                        <Settings className="w-4 h-4" />
                        <span>Enable Additional Platforms</span>
                      </h4>
                      <div className="space-y-3">
                        {!metricSettings.tiktokAnalytics && (
                          <div className="flex items-center justify-between p-3 bg-[var(--surface-secondary)] rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center">
                                <Music className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <div className="font-medium text-[var(--text-primary)]">TikTok Analytics</div>
                                <div className="text-sm text-[var(--text-secondary)]">Track your TikTok performance</div>
                              </div>
                            </div>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => setMetricSettings(prev => ({ ...prev, tiktokAnalytics: true }))}
                            >
                              Enable
                            </Button>
                          </div>
                        )}

                        {!metricSettings.instagramAnalytics && (
                          <div className="flex items-center justify-between p-3 bg-[var(--surface-secondary)] rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                                <Instagram className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <div className="font-medium text-[var(--text-primary)]">Instagram Analytics</div>
                                <div className="text-sm text-[var(--text-secondary)]">Track your Instagram performance</div>
                              </div>
                            </div>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => setMetricSettings(prev => ({ ...prev, instagramAnalytics: true }))}
                            >
                              Enable
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Customize Modal */}
      <AnimatePresence>
        {showCustomizeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCustomizeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[var(--surface-primary)] rounded-2xl border border-[var(--border-primary)] p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[var(--text-primary)]">
                  YouTube Stats Settings
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCustomizeModal(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Enable/Disable */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-[var(--text-primary)]">
                      Show YouTube Stats
                    </div>
                    <div className="text-sm text-[var(--text-secondary)]">
                      Display YouTube analytics in your dashboard
                    </div>
                  </div>
                  <button
                    onClick={() => setStatsEnabled(!statsEnabled)}
                    className="p-1"
                  >
                    {statsEnabled ? (
                      <ToggleRight className="w-6 h-6 text-[var(--color-success)]" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-[var(--text-tertiary)]" />
                    )}
                  </button>
                </div>

                {statsEnabled && (
                  <>
                    {/* Data Source Options */}
                    {/* Metric Selection */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-medium text-[var(--text-primary)]">
                          Visible Metrics
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={() => setMetricSettings({
                              subscribers: true,
                              monthlyViews: true,
                              monthlyRevenue: true,
                              engagement: true,
                              totalVideos: true,
                              avgViews: true,
                              topVideo: true,
                              overview: true,
                              experimental: true,
                              tiktokAnalytics: true,
                              instagramAnalytics: true,
                            })}
                          >
                            Show All
                          </Button>
                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={() => setMetricSettings({
                              subscribers: false,
                              monthlyViews: false,
                              monthlyRevenue: false,
                              engagement: false,
                              totalVideos: false,
                              avgViews: false,
                              topVideo: false,
                              overview: false,
                              experimental: false,
                              tiktokAnalytics: false,
                              instagramAnalytics: false,
                            })}
                          >
                            Hide All
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        {Object.entries({
                          subscribers: 'Subscribers',
                          monthlyViews: 'Monthly Views',
                          monthlyRevenue: 'Monthly Revenue',
                          engagement: 'Engagement Rate',
                          totalVideos: 'Total Videos',
                          avgViews: 'Avg Views/Video',
                          topVideo: 'Top Video',
                          overview: 'Connection Overview'
                        }).map(([key, label]) => (
                          <div
                            key={key}
                            className="flex items-center justify-between p-2 bg-[var(--surface-secondary)] rounded-lg"
                          >
                            <span className="text-sm text-[var(--text-primary)]">{label}</span>
                            <button
                              onClick={() => setMetricSettings(prev => ({
                                ...prev,
                                [key]: !prev[key as keyof MetricSettings]
                              }))}
                              className="p-1"
                            >
                              {metricSettings[key as keyof MetricSettings] ? (
                                <ToggleRight className="w-5 h-5 text-[var(--color-success)]" />
                              ) : (
                                <ToggleLeft className="w-5 h-5 text-[var(--text-tertiary)]" />
                              )}
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Experimental Section */}
                      <div className="border-t border-[var(--border-primary)] pt-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="font-medium text-[var(--text-primary)] flex items-center space-x-2">
                            <Sparkles className="w-4 h-4 text-orange-400" />
                            <span>Experimental Features</span>
                            <Badge variant="warning" className="bg-orange-500/20 text-orange-400 border-orange-400/30 text-xs">
                              Beta
                            </Badge>
                          </div>
                        </div>

                        {/* Enable Experimental Toggle */}
                        <div className="flex items-center justify-between p-2 bg-[var(--surface-secondary)] rounded-lg mb-3">
                          <span className="text-sm text-[var(--text-primary)]">Enable Experimental</span>
                          <button
                            onClick={() => setMetricSettings(prev => ({
                              ...prev,
                              experimental: !prev.experimental,
                              // Reset experimental features when disabled
                              tiktokAnalytics: prev.experimental ? false : prev.tiktokAnalytics,
                              instagramAnalytics: prev.experimental ? false : prev.instagramAnalytics,
                            }))}
                            className="p-1"
                          >
                            {metricSettings.experimental ? (
                              <ToggleRight className="w-5 h-5 text-[var(--color-success)]" />
                            ) : (
                              <ToggleLeft className="w-5 h-5 text-[var(--text-tertiary)]" />
                            )}
                          </button>
                        </div>

                        {/* Experimental Options */}
                        {metricSettings.experimental && (
                          <div className="space-y-2 pl-4">
                            <div className="flex items-center justify-between p-2 bg-[var(--surface-tertiary)] rounded-lg">
                              <div className="flex items-center space-x-2">
                                <Music className="w-4 h-4 text-pink-400" />
                                <span className="text-sm text-[var(--text-primary)]">TikTok Analytics</span>
                              </div>
                              <button
                                onClick={() => setMetricSettings(prev => ({
                                  ...prev,
                                  tiktokAnalytics: !prev.tiktokAnalytics
                                }))}
                                className="p-1"
                              >
                                {metricSettings.tiktokAnalytics ? (
                                  <ToggleRight className="w-5 h-5 text-[var(--color-success)]" />
                                ) : (
                                  <ToggleLeft className="w-5 h-5 text-[var(--text-tertiary)]" />
                                )}
                              </button>
                            </div>

                            <div className="flex items-center justify-between p-2 bg-[var(--surface-tertiary)] rounded-lg">
                              <div className="flex items-center space-x-2">
                                <Instagram className="w-4 h-4 text-purple-400" />
                                <span className="text-sm text-[var(--text-primary)]">Instagram Analytics</span>
                              </div>
                              <button
                                onClick={() => setMetricSettings(prev => ({
                                  ...prev,
                                  instagramAnalytics: !prev.instagramAnalytics
                                }))}
                                className="p-1"
                              >
                                {metricSettings.instagramAnalytics ? (
                                  <ToggleRight className="w-5 h-5 text-[var(--color-success)]" />
                                ) : (
                                  <ToggleLeft className="w-5 h-5 text-[var(--text-tertiary)]" />
                                )}
                              </button>
                            </div>

                            <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg mt-3">
                              <p className="text-xs text-[var(--text-secondary)]">
                                <AlertCircle className="w-3 h-3 inline mr-1" />
                                TikTok and Instagram don't provide official APIs. Manual data upload required.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="font-medium text-[var(--text-primary)] mb-3">
                        Data Source
                      </div>
                      <div className="space-y-3">
                        <div
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                            dataSource === 'mock'
                              ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)]/10'
                              : 'border-[var(--border-primary)] hover:border-[var(--border-secondary)]'
                          }`}
                          onClick={() => setDataSource('mock')}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-[var(--surface-secondary)] rounded-lg flex items-center justify-center">
                              <Eye className="w-4 h-4 text-[var(--text-secondary)]" />
                            </div>
                            <div>
                              <div className="font-medium text-[var(--text-primary)]">
                                Demo Data
                              </div>
                              <div className="text-sm text-[var(--text-secondary)]">
                                Use placeholder data for preview
                              </div>
                            </div>
                          </div>
                        </div>

                        <div
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                            dataSource === 'manual'
                              ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)]/10'
                              : 'border-[var(--border-primary)] hover:border-[var(--border-secondary)]'
                          }`}
                          onClick={() => setDataSource('manual')}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-[var(--surface-secondary)] rounded-lg flex items-center justify-center">
                              <Upload className="w-4 h-4 text-[var(--text-secondary)]" />
                            </div>
                            <div>
                              <div className="font-medium text-[var(--text-primary)]">
                                Manual Upload
                              </div>
                              <div className="text-sm text-[var(--text-secondary)]">
                                Upload your own data manually
                              </div>
                            </div>
                          </div>
                        </div>

                        <div
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                            !isPremium
                              ? 'opacity-50 cursor-not-allowed'
                              : dataSource === 'connected'
                              ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)]/10'
                              : 'border-[var(--border-primary)] hover:border-[var(--border-secondary)]'
                          }`}
                          onClick={() => {
                            if (isPremium) {
                              setDataSource('connected');
                            } else {
                              onUpgrade?.();
                            }
                          }}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-[var(--surface-secondary)] rounded-lg flex items-center justify-center">
                              <Wifi className="w-4 h-4 text-[var(--text-secondary)]" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-[var(--text-primary)] flex items-center space-x-2">
                                <span>Auto-Connect</span>
                                {!isPremium && (
                                  <Crown className="w-4 h-4 text-yellow-500" />
                                )}
                              </div>
                              <div className="text-sm text-[var(--text-secondary)]">
                                {isPremium
                                  ? 'Real-time data from YouTube API'
                                  : 'Premium feature - live channel data'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      {dataSource === 'manual' && (
                        <Button
                          variant="secondary"
                          className="w-full"
                          onClick={() => {
                            setShowUploadModal(true);
                            setShowCustomizeModal(false);
                          }}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Data
                        </Button>
                      )}
                      
                      {dataSource === 'connected' && isPremium && !isConnected && (
                        <Button
                          variant="primary"
                          className="w-full"
                          onClick={handleConnectChannel}
                          disabled={isConnecting}
                        >
                          {isConnecting ? (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                              Connecting...
                            </>
                          ) : (
                            <>
                              <Youtube className="w-4 h-4 mr-2" />
                              Connect YouTube Channel
                            </>
                          )}
                        </Button>
                      )}

                      {dataSource === 'connected' && isPremium && isConnected && (
                        <div className="space-y-3">
                          <div className="p-3 bg-[var(--color-success)]/10 border border-[var(--color-success)]/20 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-[var(--color-success)]" />
                              <span className="text-sm font-medium text-[var(--color-success)]">
                                Connected to {connectedChannel || 'YouTube'}
                              </span>
                            </div>
                            <p className="text-xs text-[var(--text-secondary)] mt-1">
                              Real-time data is now available
                            </p>
                          </div>
                          <Button
                            variant="secondary"
                            className="w-full"
                            onClick={handleDisconnectChannel}
                          >
                            <X className="w-4 h-4 mr-2" />
                            Disconnect Channel
                          </Button>
                        </div>
                      )}

                      {connectionError && dataSource === 'connected' && (
                        <div className="p-3 bg-[var(--color-error)]/10 border border-[var(--color-error)]/20 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <AlertCircle className="w-4 h-4 text-[var(--color-error)]" />
                            <span className="text-sm font-medium text-[var(--color-error)]">
                              Connection Failed
                            </span>
                          </div>
                          <p className="text-xs text-[var(--text-secondary)] mt-1">
                            {connectionError}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-2"
                            onClick={() => setConnectionError(null)}
                          >
                            <X className="w-3 h-3 mr-1" />
                            Dismiss
                          </Button>
                        </div>
                      )}

                      {!isPremium && (
                        <Button
                          variant="primary"
                          className="w-full"
                          onClick={onUpgrade}
                        >
                          <Crown className="w-4 h-4 mr-2" />
                          Upgrade to Premium
                        </Button>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  variant="ghost"
                  onClick={() => setShowCustomizeModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    saveSettings();
                    setShowCustomizeModal(false);
                  }}
                >
                  Save Settings
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Data Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowUploadModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[var(--surface-primary)] rounded-2xl border border-[var(--border-primary)] p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[var(--text-primary)]">
                  Upload Your Data
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUploadModal(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const data = {
                    subscribers: parseInt(formData.get('subscribers') as string) || mockStats.subscribers,
                    monthlyViews: parseInt(formData.get('monthlyViews') as string) || mockStats.monthlyViews,
                    monthlyRevenue: parseInt(formData.get('monthlyRevenue') as string) || mockStats.monthlyRevenue,
                    totalVideos: parseInt(formData.get('totalVideos') as string) || mockStats.totalVideos,
                    engagementRate: parseFloat(formData.get('engagementRate') as string) || mockStats.engagementRate,
                  };
                  handleUploadData(data);
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      Subscribers
                    </label>
                    <input
                      name="subscribers"
                      type="number"
                      defaultValue={stats.subscribers}
                      className="w-full px-3 py-2 bg-[var(--surface-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      Monthly Views
                    </label>
                    <input
                      name="monthlyViews"
                      type="number"
                      defaultValue={stats.monthlyViews}
                      className="w-full px-3 py-2 bg-[var(--surface-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      Monthly Revenue ($)
                    </label>
                    <input
                      name="monthlyRevenue"
                      type="number"
                      defaultValue={stats.monthlyRevenue}
                      className="w-full px-3 py-2 bg-[var(--surface-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      Total Videos
                    </label>
                    <input
                      name="totalVideos"
                      type="number"
                      defaultValue={stats.totalVideos}
                      className="w-full px-3 py-2 bg-[var(--surface-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)]"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      Engagement Rate (%)
                    </label>
                    <input
                      name="engagementRate"
                      type="number"
                      step="0.1"
                      defaultValue={stats.engagementRate}
                      className="w-full px-3 py-2 bg-[var(--surface-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)]"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowUploadModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Data
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default YouTubeQuickStats;
