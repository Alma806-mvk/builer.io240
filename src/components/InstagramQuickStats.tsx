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
  Instagram,
  Share2,
  UserPlus,
  Camera,
  Image,
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

interface InstagramStats {
  followers: number;
  totalViews: number;
  totalPosts: number;
  avgViewsPerPost: number;
  monthlyRevenue: number;
  monthlyViews: number;
  engagementRate: number;
  followerGrowth: number;
  viewGrowth: number;
  revenueGrowth: number;
  topPostViews: number;
  likesReceived: number;
  commentsReceived: number;
  sharesReceived: number;
  storiesViews: number;
  reelsViews: number;
  uploadFrequency: string;
  lastUpdated: Date;
}

interface MetricSettings {
  followers: boolean;
  monthlyViews: boolean;
  monthlyRevenue: boolean;
  engagement: boolean;
  totalPosts: boolean;
  avgViews: boolean;
  topPost: boolean;
  overview: boolean;
  likes: boolean;
  comments: boolean;
  shares: boolean;
  stories: boolean;
  reels: boolean;
}

interface InstagramQuickStatsProps {
  userPlan?: string;
  isPremium?: boolean;
  onUpgrade?: () => void;
  enabled?: boolean;
  onToggle?: (enabled: boolean) => void;
}

const InstagramQuickStats: React.FC<InstagramQuickStatsProps> = ({
  userPlan = "free",
  isPremium = false,
  onUpgrade,
  enabled = false,
  onToggle,
}) => {
  const [statsEnabled, setStatsEnabled] = useState(enabled);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [dataSource, setDataSource] = useState<'mock' | 'manual'>('mock');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [manualData, setManualData] = useState<Partial<InstagramStats>>({});
  const [metricSettings, setMetricSettings] = useState<MetricSettings>({
    followers: true,
    monthlyViews: true,
    monthlyRevenue: true,
    engagement: true,
    totalPosts: true,
    avgViews: true,
    topPost: true,
    overview: true,
    likes: true,
    comments: true,
    shares: true,
    stories: true,
    reels: true,
  });

  // Mock Instagram stats
  const mockStats: InstagramStats = {
    followers: 89473,
    totalViews: 2847392,
    totalPosts: 156,
    avgViewsPerPost: 18253,
    monthlyRevenue: 2934,
    monthlyViews: 387294,
    engagementRate: 8.9,
    followerGrowth: 14.2,
    viewGrowth: 19.7,
    revenueGrowth: 22.8,
    topPostViews: 847392,
    likesReceived: 394728,
    commentsReceived: 67384,
    sharesReceived: 23847,
    storiesViews: 234756,
    reelsViews: 847392,
    uploadFrequency: "1-2x/day",
    lastUpdated: new Date(),
  };

  const [stats, setStats] = useState<InstagramStats>(mockStats);

  // Sync with parent enabled state
  useEffect(() => {
    setStatsEnabled(enabled);
  }, [enabled]);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('studioHub:instagramStatsSettings');
    if (savedSettings) {
      const { source, data, metrics } = JSON.parse(savedSettings);
      setDataSource(source);
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
      source: dataSource,
      data: dataSource === 'manual' ? manualData : null,
      metrics: metricSettings,
    };
    localStorage.setItem('studioHub:instagramStatsSettings', JSON.stringify(settings));
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const handleUploadData = (data: Partial<InstagramStats>) => {
    setManualData(data);
    setStats({ ...mockStats, ...data });
    setDataSource('manual');
    setShowUploadModal(false);
    saveSettings();
  };

  const handleToggleEnabled = (newEnabled: boolean) => {
    setStatsEnabled(newEnabled);
    onToggle?.(newEnabled);
  };

  // Render collapsed state if disabled
  if (!statsEnabled) {
    return (
      <Card className="bg-gradient-to-r from-purple-500/5 to-pink-600/5 border border-purple-500/20">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center opacity-50">
              <Instagram className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-[var(--text-primary)]">
                Instagram Analytics (Hidden)
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Click to show your Instagram dashboard
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleToggleEnabled(true)}
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
        {/* Experimental Badge */}
        <div className="absolute top-4 right-4 z-10">
          <Badge variant="warning" className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-orange-400/30 flex items-center space-x-1">
            <Sparkles className="w-4 h-4" />
            <span>Experimental</span>
          </Badge>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Instagram className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center space-x-2">
                <span>Instagram Analytics</span>
                <Badge variant="neutral" className="text-xs">
                  {Object.values(metricSettings).filter(Boolean).length}/13 metrics
                </Badge>
                <div className="flex items-center space-x-1">
                  <WifiOff className="w-4 h-4 text-[var(--text-tertiary)]" />
                  <span className="text-sm text-[var(--text-tertiary)]">Manual Data</span>
                </div>
              </h2>
              <p className="text-sm text-[var(--text-secondary)]">
                {dataSource === 'mock' && "Demo data for preview"}
                {dataSource === 'manual' && "Using uploaded data"}
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

        {/* API Disclaimer */}
        <div className="mb-6 p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-[var(--text-primary)] mb-1">
                Manual Data Upload Required
              </h4>
              <p className="text-sm text-[var(--text-secondary)]">
                Instagram doesn't offer an official public data API like YouTube. To use these analytics features,
                you'll need to manually upload your performance data from Instagram's Professional Dashboard
                or Meta Business Suite analytics.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        {(metricSettings.followers || metricSettings.monthlyViews || metricSettings.monthlyRevenue || metricSettings.engagement) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {metricSettings.followers && (
              <StatCard
                title="Followers"
                value={formatNumber(stats.followers)}
                change={`${stats.followerGrowth > 0 ? '+' : ''}${stats.followerGrowth}%`}
                icon={<Users className="w-5 h-5" />}
                trend={stats.followerGrowth > 0 ? 'up' : 'down'}
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

        {/* Content Overview */}
        {(metricSettings.totalPosts || metricSettings.avgViews || metricSettings.topPost) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {metricSettings.totalPosts && (
              <div className="bg-[var(--surface-secondary)] rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[var(--text-secondary)]">Total Posts</span>
                  <Image className="w-4 h-4 text-[var(--text-tertiary)]" />
                </div>
                <div className="text-2xl font-bold text-[var(--text-primary)]">
                  {stats.totalPosts}
                </div>
                <div className="text-xs text-[var(--text-secondary)]">
                  {stats.uploadFrequency} upload rate
                </div>
              </div>
            )}

            {metricSettings.avgViews && (
              <div className="bg-[var(--surface-secondary)] rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[var(--text-secondary)]">Avg Views/Post</span>
                  <BarChart3 className="w-4 h-4 text-[var(--text-tertiary)]" />
                </div>
                <div className="text-2xl font-bold text-[var(--text-primary)]">
                  {formatNumber(stats.avgViewsPerPost)}
                </div>
                <div className="text-xs text-[var(--text-secondary)]">
                  Per post average
                </div>
              </div>
            )}

            {metricSettings.topPost && (
              <div className="bg-[var(--surface-secondary)] rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[var(--text-secondary)]">Top Post</span>
                  <Star className="w-4 h-4 text-[var(--text-tertiary)]" />
                </div>
                <div className="text-2xl font-bold text-[var(--text-primary)]">
                  {formatNumber(stats.topPostViews)}
                </div>
                <div className="text-xs text-[var(--text-secondary)]">
                  Best performer
                </div>
              </div>
            )}
          </div>
        )}

        {/* Content Type Performance */}
        {(metricSettings.stories || metricSettings.reels) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {metricSettings.stories && (
              <div className="bg-[var(--surface-secondary)] rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[var(--text-secondary)]">Stories Views</span>
                  <Camera className="w-4 h-4 text-orange-400" />
                </div>
                <div className="text-2xl font-bold text-[var(--text-primary)]">
                  {formatNumber(stats.storiesViews)}
                </div>
                <div className="text-xs text-[var(--text-secondary)]">
                  24h content
                </div>
              </div>
            )}

            {metricSettings.reels && (
              <div className="bg-[var(--surface-secondary)] rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[var(--text-secondary)]">Reels Views</span>
                  <Play className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-bold text-[var(--text-primary)]">
                  {formatNumber(stats.reelsViews)}
                </div>
                <div className="text-xs text-[var(--text-secondary)]">
                  Short form video
                </div>
              </div>
            )}
          </div>
        )}

        {/* Engagement Breakdown */}
        {(metricSettings.likes || metricSettings.comments || metricSettings.shares) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {metricSettings.likes && (
              <div className="bg-[var(--surface-secondary)] rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[var(--text-secondary)]">Total Likes</span>
                  <Heart className="w-4 h-4 text-pink-400" />
                </div>
                <div className="text-2xl font-bold text-[var(--text-primary)]">
                  {formatNumber(stats.likesReceived)}
                </div>
                <div className="text-xs text-[var(--text-secondary)]">
                  Across all posts
                </div>
              </div>
            )}

            {metricSettings.comments && (
              <div className="bg-[var(--surface-secondary)] rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[var(--text-secondary)]">Comments</span>
                  <MessageSquare className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-[var(--text-primary)]">
                  {formatNumber(stats.commentsReceived)}
                </div>
                <div className="text-xs text-[var(--text-secondary)]">
                  Community engagement
                </div>
              </div>
            )}

            {metricSettings.shares && (
              <div className="bg-[var(--surface-secondary)] rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[var(--text-secondary)]">Shares</span>
                  <Share2 className="w-4 h-4 text-green-400" />
                </div>
                <div className="text-2xl font-bold text-[var(--text-primary)]">
                  {formatNumber(stats.sharesReceived)}
                </div>
                <div className="text-xs text-[var(--text-secondary)]">
                  Content virality
                </div>
              </div>
            )}
          </div>
        )}

        {/* Call to Action */}
        {metricSettings.overview && (
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-600/10 border border-purple-500/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <Upload className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">
                    {dataSource === 'manual' ? "Data Updated" : "Upload Your Instagram Data"}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {dataSource === 'manual' 
                      ? "Last updated " + new Date(stats.lastUpdated).toLocaleTimeString()
                      : "Import analytics from Instagram Professional Dashboard"
                    }
                  </p>
                </div>
              </div>
              <Button 
                variant="primary" 
                onClick={() => {
                  setShowUploadModal(true);
                }}
              >
                <Upload className="w-4 h-4 mr-2" />
                {dataSource === 'manual' ? 'Update Data' : 'Upload Data'}
              </Button>
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
              className="bg-[var(--surface-primary)] rounded-2xl border border-[var(--border-primary)] p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[var(--text-primary)]">
                  Instagram Stats Settings
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
                      Show Instagram Stats
                    </div>
                    <div className="text-sm text-[var(--text-secondary)]">
                      Display Instagram analytics in your dashboard
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleEnabled(!statsEnabled)}
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
                              followers: true,
                              monthlyViews: true,
                              monthlyRevenue: true,
                              engagement: true,
                              totalPosts: true,
                              avgViews: true,
                              topPost: true,
                              overview: true,
                              likes: true,
                              comments: true,
                              shares: true,
                              stories: true,
                              reels: true,
                            })}
                          >
                            Show All
                          </Button>
                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={() => setMetricSettings({
                              followers: false,
                              monthlyViews: false,
                              monthlyRevenue: false,
                              engagement: false,
                              totalPosts: false,
                              avgViews: false,
                              topPost: false,
                              overview: false,
                              likes: false,
                              comments: false,
                              shares: false,
                              stories: false,
                              reels: false,
                            })}
                          >
                            Hide All
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        {Object.entries({
                          followers: 'Followers',
                          monthlyViews: 'Monthly Views',
                          monthlyRevenue: 'Monthly Revenue',
                          engagement: 'Engagement Rate',
                          totalPosts: 'Total Posts',
                          avgViews: 'Avg Views/Post',
                          topPost: 'Top Post',
                          likes: 'Total Likes',
                          comments: 'Comments',
                          shares: 'Shares',
                          stories: 'Stories Views',
                          reels: 'Reels Views',
                          overview: 'Upload Overview'
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
                    </div>

                    {/* Action Button */}
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
                  Upload Instagram Data
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUploadModal(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="mb-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                <h4 className="font-semibold text-[var(--text-primary)] mb-2">
                  How to get your Instagram data:
                </h4>
                <ol className="text-sm text-[var(--text-secondary)] space-y-1">
                  <li>1. Go to Instagram Professional Dashboard</li>
                  <li>2. Or open Meta Business Suite</li>
                  <li>3. Navigate to Insights section</li>
                  <li>4. Copy the numbers from your overview</li>
                  <li>5. Enter them in the form below</li>
                </ol>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const data = {
                    followers: parseInt(formData.get('followers') as string) || mockStats.followers,
                    monthlyViews: parseInt(formData.get('monthlyViews') as string) || mockStats.monthlyViews,
                    monthlyRevenue: parseInt(formData.get('monthlyRevenue') as string) || mockStats.monthlyRevenue,
                    totalPosts: parseInt(formData.get('totalPosts') as string) || mockStats.totalPosts,
                    engagementRate: parseFloat(formData.get('engagementRate') as string) || mockStats.engagementRate,
                    likesReceived: parseInt(formData.get('likesReceived') as string) || mockStats.likesReceived,
                    commentsReceived: parseInt(formData.get('commentsReceived') as string) || mockStats.commentsReceived,
                    sharesReceived: parseInt(formData.get('sharesReceived') as string) || mockStats.sharesReceived,
                    storiesViews: parseInt(formData.get('storiesViews') as string) || mockStats.storiesViews,
                    reelsViews: parseInt(formData.get('reelsViews') as string) || mockStats.reelsViews,
                  };
                  handleUploadData(data);
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      Followers
                    </label>
                    <input
                      name="followers"
                      type="number"
                      defaultValue={stats.followers}
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
                      Total Posts
                    </label>
                    <input
                      name="totalPosts"
                      type="number"
                      defaultValue={stats.totalPosts}
                      className="w-full px-3 py-2 bg-[var(--surface-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)]"
                    />
                  </div>
                  <div>
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
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      Total Likes
                    </label>
                    <input
                      name="likesReceived"
                      type="number"
                      defaultValue={stats.likesReceived}
                      className="w-full px-3 py-2 bg-[var(--surface-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      Total Comments
                    </label>
                    <input
                      name="commentsReceived"
                      type="number"
                      defaultValue={stats.commentsReceived}
                      className="w-full px-3 py-2 bg-[var(--surface-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      Total Shares
                    </label>
                    <input
                      name="sharesReceived"
                      type="number"
                      defaultValue={stats.sharesReceived}
                      className="w-full px-3 py-2 bg-[var(--surface-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      Stories Views
                    </label>
                    <input
                      name="storiesViews"
                      type="number"
                      defaultValue={stats.storiesViews}
                      className="w-full px-3 py-2 bg-[var(--surface-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      Reels Views
                    </label>
                    <input
                      name="reelsViews"
                      type="number"
                      defaultValue={stats.reelsViews}
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

export default InstagramQuickStats;
