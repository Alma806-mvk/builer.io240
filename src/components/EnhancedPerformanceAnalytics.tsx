import React, { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  MessageSquare,
  Share,
  Calendar,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Download,
  Upload,
  Filter,
  Search,
  Star,
  Target,
  DollarSign,
  Users,
  Clock,
  Zap,
  Award,
  Activity,
  PieChart,
  LineChart,
  Settings,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Info,
  Maximize2,
  MinusCircle,
  PlusCircle,
  Copy,
} from "lucide-react";
import {
  YouTubeIcon,
  TikTokIcon,
  InstagramIcon,
  TwitterIcon,
  LinkedInIcon,
  FacebookIcon,
} from './ProfessionalIcons';
import { Platform } from "../types";
import {
  Button,
  Card,
  Badge,
  TabHeader,
  StatCard,
  GradientText,
  Input
} from "./ui/WorldClassComponents";
import { ProgressBar } from "./CalendarMicroInteractions";
import {
  LineChart as RechartsLineChart,
  BarChart,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  ComposedChart,
  Bar,
  Line,
  RadialBarChart,
  RadialBar,
} from "recharts";

interface ContentPerformance {
  id: string;
  title: string;
  platform: Platform;
  publishedDate: string;
  views: number;
  engagement: number;
  likes: number;
  shares: number;
  comments: number;
  saves?: number;
  score: number;
  reachRate: number;
  clickThroughRate: number;
  conversionRate?: number;
  revenue?: number;
  cost?: number;
  contentType: "post" | "story" | "video" | "article" | "live" | "reel" | "short";
  trend: "up" | "down" | "stable";
  tags?: string[];
  duration?: number; // For videos in seconds
  thumbnailScore?: number;
  hooks?: {
    opening: number;
    middle: number;
    ending: number;
  };
  demographics?: {
    ageGroup: string;
    gender: string;
    location: string;
    percentage: number;
  }[];
  timeMetrics?: {
    avgWatchTime: number;
    retention30s: number;
    retention60s: number;
    completion: number;
  };
}

interface PerformanceMetrics {
  totalViews: number;
  totalEngagement: number;
  avgEngagementRate: number;
  totalRevenue?: number;
  totalCost?: number;
  roi?: number;
  bestPerformingPlatform: Platform;
  bestPerformingContentType: string;
  growthRate: number;
  consistencyScore: number;
}

interface EnhancedPerformanceAnalyticsProps {
  performanceData: ContentPerformance[];
  onRefreshData?: () => Promise<void>;
  onExportData?: (format: 'csv' | 'pdf' | 'excel') => void;
  className?: string;
  timeRange?: '7d' | '30d' | '90d' | '1y' | 'all';
  onTimeRangeChange?: (range: '7d' | '30d' | '90d' | '1y' | 'all') => void;
}

// Platform configurations
const PLATFORM_CONFIG = {
  [Platform.YouTube]: {
    name: "YouTube",
    color: "#FF0000",
    icon: YouTubeIcon,
    gradient: "from-red-500 to-red-700",
  },
  [Platform.TikTok]: {
    name: "TikTok",
    color: "#000000",
    icon: TikTokIcon,
    gradient: "from-gray-800 to-black",
  },
  [Platform.Instagram]: {
    name: "Instagram",
    color: "#E4405F",
    icon: InstagramIcon,
    gradient: "from-pink-500 to-purple-600",
  },
  [Platform.Twitter]: {
    name: "Twitter",
    color: "#1DA1F2",
    icon: TwitterIcon,
    gradient: "from-blue-400 to-blue-600",
  },
  [Platform.LinkedIn]: {
    name: "LinkedIn",
    color: "#0077B5",
    icon: LinkedInIcon,
    gradient: "from-blue-600 to-blue-800",
  },
  [Platform.Facebook]: {
    name: "Facebook",
    color: "#1877F2",
    icon: FacebookIcon,
    gradient: "from-blue-500 to-blue-700",
  },
};

const EnhancedPerformanceAnalytics: React.FC<EnhancedPerformanceAnalyticsProps> = ({
  performanceData,
  onRefreshData,
  onExportData,
  className = "",
  timeRange = '30d',
  onTimeRangeChange,
}) => {
  const [selectedMetric, setSelectedMetric] = useState<'views' | 'engagement' | 'revenue' | 'roi'>('engagement');
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('area');
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [filterContentType, setFilterContentType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'views' | 'engagement' | 'score'>('engagement');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedContent, setSelectedContent] = useState<ContentPerformance | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<Set<string>>(new Set());

  // Filter and process performance data
  const filteredData = useMemo(() => {
    let filtered = [...performanceData];

    // Apply filters
    if (filterPlatform !== 'all') {
      filtered = filtered.filter(item => item.platform.toString() === filterPlatform);
    }
    if (filterContentType !== 'all') {
      filtered = filtered.filter(item => item.contentType === filterContentType);
    }
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply time range filter
    const now = new Date();
    const timeRangeMs = {
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
      '90d': 90 * 24 * 60 * 60 * 1000,
      '1y': 365 * 24 * 60 * 60 * 1000,
      'all': Infinity,
    };

    if (timeRange !== 'all') {
      const cutoffDate = new Date(now.getTime() - timeRangeMs[timeRange]);
      filtered = filtered.filter(item => new Date(item.publishedDate) >= cutoffDate);
    }

    // Sort data
    filtered.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.publishedDate).getTime();
          bValue = new Date(b.publishedDate).getTime();
          break;
        case 'views':
          aValue = a.views;
          bValue = b.views;
          break;
        case 'engagement':
          aValue = a.engagement;
          bValue = b.engagement;
          break;
        case 'score':
          aValue = a.score;
          bValue = b.score;
          break;
        default:
          return 0;
      }
      
      return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
    });

    return filtered;
  }, [performanceData, filterPlatform, filterContentType, searchQuery, timeRange, sortBy, sortOrder]);

  // Calculate comprehensive metrics
  const metrics = useMemo((): PerformanceMetrics => {
    if (filteredData.length === 0) {
      return {
        totalViews: 0,
        totalEngagement: 0,
        avgEngagementRate: 0,
        totalRevenue: 0,
        totalCost: 0,
        roi: 0,
        bestPerformingPlatform: Platform.YouTube,
        bestPerformingContentType: 'video',
        growthRate: 0,
        consistencyScore: 0,
      };
    }

    const totalViews = filteredData.reduce((sum, item) => sum + item.views, 0);
    const totalEngagement = filteredData.reduce((sum, item) => sum + item.engagement, 0);
    const avgEngagementRate = (totalEngagement / totalViews) * 100;
    
    const totalRevenue = filteredData.reduce((sum, item) => sum + (item.revenue || 0), 0);
    const totalCost = filteredData.reduce((sum, item) => sum + (item.cost || 0), 0);
    const roi = totalCost > 0 ? ((totalRevenue - totalCost) / totalCost) * 100 : 0;

    // Find best performing platform
    const platformMetrics = Object.values(Platform).map(platform => {
      const platformData = filteredData.filter(item => item.platform === platform);
      const avgEngagement = platformData.length > 0 
        ? platformData.reduce((sum, item) => sum + item.engagement, 0) / platformData.length 
        : 0;
      return { platform, avgEngagement };
    });
    const bestPerformingPlatform = platformMetrics.reduce((best, current) => 
      current.avgEngagement > best.avgEngagement ? current : best
    ).platform;

    // Find best performing content type
    const contentTypes = ['video', 'post', 'story', 'article', 'live', 'reel', 'short'];
    const contentTypeMetrics = contentTypes.map(type => {
      const typeData = filteredData.filter(item => item.contentType === type);
      const avgEngagement = typeData.length > 0 
        ? typeData.reduce((sum, item) => sum + item.engagement, 0) / typeData.length 
        : 0;
      return { type, avgEngagement };
    });
    const bestPerformingContentType = contentTypeMetrics.reduce((best, current) => 
      current.avgEngagement > best.avgEngagement ? current : best
    ).type;

    // Calculate growth rate (comparing first half vs second half of data)
    const sortedByDate = [...filteredData].sort((a, b) => 
      new Date(a.publishedDate).getTime() - new Date(b.publishedDate).getTime()
    );
    const midPoint = Math.floor(sortedByDate.length / 2);
    const firstHalf = sortedByDate.slice(0, midPoint);
    const secondHalf = sortedByDate.slice(midPoint);
    
    const firstHalfAvg = firstHalf.length > 0 
      ? firstHalf.reduce((sum, item) => sum + item.engagement, 0) / firstHalf.length 
      : 0;
    const secondHalfAvg = secondHalf.length > 0 
      ? secondHalf.reduce((sum, item) => sum + item.engagement, 0) / secondHalf.length 
      : 0;
    
    const growthRate = firstHalfAvg > 0 ? ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100 : 0;

    // Calculate consistency score (based on standard deviation of engagement rates)
    const engagementRates = filteredData.map(item => (item.engagement / item.views) * 100);
    const meanEngagementRate = engagementRates.reduce((sum, rate) => sum + rate, 0) / engagementRates.length;
    const variance = engagementRates.reduce((sum, rate) => sum + Math.pow(rate - meanEngagementRate, 2), 0) / engagementRates.length;
    const standardDeviation = Math.sqrt(variance);
    const consistencyScore = Math.max(0, 100 - (standardDeviation / meanEngagementRate) * 100);

    return {
      totalViews,
      totalEngagement,
      avgEngagementRate,
      totalRevenue,
      totalCost,
      roi,
      bestPerformingPlatform,
      bestPerformingContentType,
      growthRate,
      consistencyScore,
    };
  }, [filteredData]);

  // Prepare chart data
  const chartData = useMemo(() => {
    // Group data by date for time series
    const groupedByDate = filteredData.reduce((acc, item) => {
      const date = item.publishedDate.split('T')[0]; // Get just the date part
      if (!acc[date]) {
        acc[date] = {
          date,
          views: 0,
          engagement: 0,
          revenue: 0,
          count: 0,
        };
      }
      acc[date].views += item.views;
      acc[date].engagement += item.engagement;
      acc[date].revenue += item.revenue || 0;
      acc[date].count += 1;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(groupedByDate).sort((a: any, b: any) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [filteredData]);

  // Platform performance data for pie chart
  const platformData = useMemo(() => {
    const platformStats = Object.values(Platform).map(platform => {
      const platformItems = filteredData.filter(item => item.platform === platform);
      const totalEngagement = platformItems.reduce((sum, item) => sum + item.engagement, 0);
      const totalViews = platformItems.reduce((sum, item) => sum + item.views, 0);
      
      return {
        name: PLATFORM_CONFIG[platform].name,
        value: totalEngagement,
        views: totalViews,
        count: platformItems.length,
        color: PLATFORM_CONFIG[platform].color,
        platform,
      };
    }).filter(item => item.count > 0);

    return platformStats;
  }, [filteredData]);

  // Content type performance data
  const contentTypeData = useMemo(() => {
    const contentTypes = ['video', 'post', 'story', 'article', 'live', 'reel', 'short'];
    const contentTypeStats = contentTypes.map(type => {
      const typeItems = filteredData.filter(item => item.contentType === type);
      const avgEngagement = typeItems.length > 0 
        ? typeItems.reduce((sum, item) => sum + item.engagement, 0) / typeItems.length 
        : 0;
      const totalViews = typeItems.reduce((sum, item) => sum + item.views, 0);
      
      return {
        name: type.charAt(0).toUpperCase() + type.slice(1),
        engagement: Math.round(avgEngagement),
        views: totalViews,
        count: typeItems.length,
      };
    }).filter(item => item.count > 0);

    return contentTypeStats;
  }, [filteredData]);

  // Top performing content
  const topContent = useMemo(() => {
    return [...filteredData]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }, [filteredData]);

  // Refresh data handler
  const handleRefresh = useCallback(async () => {
    if (!onRefreshData) return;
    
    setIsLoading(true);
    try {
      await onRefreshData();
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [onRefreshData]);

  // Export data handler
  const handleExport = useCallback((format: 'csv' | 'pdf' | 'excel') => {
    if (onExportData) {
      onExportData(format);
    }
  }, [onExportData]);

  // Format number helper
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // Format percentage helper
  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`;
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-lg p-3 shadow-lg">
          <p className="text-[var(--text-primary)] font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-[var(--text-secondary)]" style={{ color: entry.color }}>
              {entry.name}: {formatNumber(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Enhanced Header */}
      <Card variant="glow" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                <GradientText>Performance Analytics</GradientText>
              </h2>
              <p className="text-[var(--text-secondary)]">
                {filteredData.length} content pieces • {timeRange === 'all' ? 'All time' : timeRange} analysis
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={timeRange}
              onChange={(e) => onTimeRangeChange?.(e.target.value as any)}
              className="px-3 py-2 bg-[var(--surface-tertiary)] border border-[var(--border-primary)] rounded-lg text-sm"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
              <option value="all">All time</option>
            </select>

            <div className="flex border border-[var(--border-primary)] rounded-lg">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleExport('csv')}
                className="rounded-none rounded-l-lg"
              >
                <Download className="w-4 h-4 mr-1" />
                CSV
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleExport('excel')}
                className="rounded-none border-x border-[var(--border-primary)]"
              >
                Excel
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleExport('pdf')}
                className="rounded-none rounded-r-lg"
              >
                PDF
              </Button>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Updating...' : 'Refresh'}
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <StatCard
            title="Total Views"
            value={formatNumber(metrics.totalViews)}
            icon={<Eye />}
            description="across all content"
            variant="info"
          />
          <StatCard
            title="Engagement"
            value={formatNumber(metrics.totalEngagement)}
            icon={<Heart />}
            description={`${formatPercentage(metrics.avgEngagementRate)} rate`}
            variant="success"
          />
          <StatCard
            title="Revenue"
            value={`$${formatNumber(metrics.totalRevenue || 0)}`}
            icon={<DollarSign />}
            description={`${formatPercentage(metrics.roi || 0)} ROI`}
            variant="primary"
          />
          <StatCard
            title="Growth"
            value={formatPercentage(metrics.growthRate)}
            icon={metrics.growthRate >= 0 ? <TrendingUp /> : <TrendingDown />}
            description="vs previous period"
            variant={metrics.growthRate >= 0 ? "success" : "error"}
          />
          <StatCard
            title="Consistency"
            value={formatPercentage(metrics.consistencyScore)}
            icon={<Target />}
            description="performance stability"
            variant="warning"
          />
          <StatCard
            title="Best Platform"
            value={PLATFORM_CONFIG[metrics.bestPerformingPlatform].name}
            icon={React.createElement(PLATFORM_CONFIG[metrics.bestPerformingPlatform].icon, { className: 'w-5 h-5' })}
            description="top performer"
            variant="neutral"
          />
        </div>
      </Card>

      {/* Controls and Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-tertiary)] w-4 h-4" />
              <Input
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>

            {/* Filters */}
            <select 
              value={filterPlatform} 
              onChange={(e) => setFilterPlatform(e.target.value)}
              className="px-3 py-2 bg-[var(--surface-tertiary)] border border-[var(--border-primary)] rounded-lg text-sm"
            >
              <option value="all">All Platforms</option>
              {Object.entries(PLATFORM_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>{config.name}</option>
              ))}
            </select>

            <select 
              value={filterContentType} 
              onChange={(e) => setFilterContentType(e.target.value)}
              className="px-3 py-2 bg-[var(--surface-tertiary)] border border-[var(--border-primary)] rounded-lg text-sm"
            >
              <option value="all">All Types</option>
              <option value="video">Video</option>
              <option value="post">Post</option>
              <option value="story">Story</option>
              <option value="article">Article</option>
              <option value="live">Live</option>
              <option value="reel">Reel</option>
              <option value="short">Short</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            {/* Chart Controls */}
            <div className="flex border border-[var(--border-primary)] rounded-lg">
              {[
                { id: 'line', icon: <Activity /> },
                { id: 'bar', icon: <BarChart3 /> },
                { id: 'area', icon: <TrendingUp /> },
              ].map((type) => (
                <Button
                  key={type.id}
                  variant={chartType === type.id ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setChartType(type.id as any)}
                  className="rounded-none first:rounded-l-lg last:rounded-r-lg"
                >
                  {type.icon}
                </Button>
              ))}
            </div>

            {/* Metric Selection */}
            <div className="flex border border-[var(--border-primary)] rounded-lg">
              {[
                { id: 'views', label: 'Views', icon: <Eye /> },
                { id: 'engagement', label: 'Engagement', icon: <Heart /> },
                { id: 'revenue', label: 'Revenue', icon: <DollarSign /> },
                { id: 'roi', label: 'ROI', icon: <TrendingUp /> },
              ].map((metric) => (
                <Button
                  key={metric.id}
                  variant={selectedMetric === metric.id ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedMetric(metric.id as any)}
                  className="rounded-none first:rounded-l-lg last:rounded-r-lg"
                >
                  {metric.icon}
                  <span className="ml-1 hidden sm:inline">{metric.label}</span>
                </Button>
              ))}
            </div>

            <Button
              variant={comparisonMode ? "primary" : "ghost"}
              size="sm"
              onClick={() => setComparisonMode(!comparisonMode)}
            >
              <PlusCircle className="w-4 h-4 mr-1" />
              Compare
            </Button>
          </div>
        </div>
      </Card>

      {/* Main Analytics Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Time Series Chart */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              Performance Over Time
            </h3>
            <div className="flex items-center space-x-2">
              <Badge variant="info">{chartData.length} data points</Badge>
            </div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'line' && (
                <RechartsLineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="var(--text-secondary)"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="var(--text-secondary)"
                    tick={{ fontSize: 12 }}
                    tickFormatter={formatNumber}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey={selectedMetric} 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                  />
                </RechartsLineChart>
              )}
              
              {chartType === 'bar' && (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="var(--text-secondary)"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="var(--text-secondary)"
                    tick={{ fontSize: 12 }}
                    tickFormatter={formatNumber}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar 
                    dataKey={selectedMetric} 
                    fill="#3B82F6"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              )}
              
              {chartType === 'area' && (
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="var(--text-secondary)"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="var(--text-secondary)"
                    tick={{ fontSize: 12 }}
                    tickFormatter={formatNumber}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <defs>
                    <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey={selectedMetric} 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    fill="url(#colorMetric)"
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Platform Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
            Platform Performance
          </h3>
          
          <div className="h-64 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={platformData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2">
            {platformData.map((platform) => {
              const IconComponent = PLATFORM_CONFIG[platform.platform].icon;
              return (
                <div key={platform.name} className="flex items-center justify-between p-2 rounded-lg bg-[var(--surface-secondary)]">
                  <div className="flex items-center space-x-3">
                    <IconComponent className="w-5 h-5" style={{ color: platform.color }} />
                    <span className="text-sm font-medium text-[var(--text-primary)]">
                      {platform.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-[var(--text-primary)]">
                      {formatNumber(platform.value)}
                    </div>
                    <div className="text-xs text-[var(--text-secondary)]">
                      {platform.count} posts
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Content Type Performance */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          Content Type Performance
        </h3>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={contentTypeData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
              <XAxis 
                type="number"
                stroke="var(--text-secondary)"
                tick={{ fontSize: 12 }}
                tickFormatter={formatNumber}
              />
              <YAxis 
                type="category"
                dataKey="name"
                stroke="var(--text-secondary)"
                tick={{ fontSize: 12 }}
                width={80}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="engagement" 
                fill="#10B981"
                radius={[0, 2, 2, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Top Performing Content */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            Top Performing Content
          </h3>
          <div className="flex items-center space-x-2">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1 bg-[var(--surface-tertiary)] border border-[var(--border-primary)] rounded text-sm"
            >
              <option value="score">Sort by Score</option>
              <option value="views">Sort by Views</option>
              <option value="engagement">Sort by Engagement</option>
              <option value="date">Sort by Date</option>
            </select>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            >
              {sortOrder === 'desc' ? <ArrowDown className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {topContent.slice(0, 8).map((content, index) => {
            const platform = PLATFORM_CONFIG[content.platform];
            const IconComponent = platform.icon;
            const engagementRate = (content.engagement / content.views) * 100;
            
            return (
              <motion.div
                key={content.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 rounded-xl bg-[var(--surface-secondary)] hover:bg-[var(--surface-tertiary)] transition-colors cursor-pointer group"
                onClick={() => {
                  setSelectedContent(content);
                  setShowDetailModal(true);
                }}
              >
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div className="flex-shrink-0 text-lg font-bold text-[var(--text-secondary)] w-8">
                    #{index + 1}
                  </div>
                  
                  <div className="flex-shrink-0 p-2 rounded-lg" style={{ backgroundColor: `${platform.color}15` }}>
                    <IconComponent className="w-5 h-5" style={{ color: platform.color }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-[var(--text-primary)] truncate group-hover:text-blue-600 transition-colors">
                      {content.title}
                    </h4>
                    <div className="flex items-center space-x-4 text-sm text-[var(--text-secondary)] mt-1">
                      <span className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{formatNumber(content.views)}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>{formatNumber(content.engagement)}</span>
                      </span>
                      <span>{formatPercentage(engagementRate)}</span>
                      <span>{new Date(content.publishedDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      content.score >= 80 ? 'text-green-600' : 
                      content.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {content.score}
                    </div>
                    <div className="text-xs text-[var(--text-secondary)]">Score</div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    {content.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-600" />}
                    {content.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-600" />}
                    {content.trend === 'stable' && <MinusCircle className="w-4 h-4 text-gray-600" />}
                  </div>

                  {comparisonMode && (
                    <input
                      type="checkbox"
                      checked={selectedForComparison.has(content.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        const newSelected = new Set(selectedForComparison);
                        if (e.target.checked) {
                          newSelected.add(content.id);
                        } else {
                          newSelected.delete(content.id);
                        }
                        setSelectedForComparison(newSelected);
                      }}
                      className="rounded border-[var(--border-primary)]"
                    />
                  )}

                  <ExternalLink className="w-4 h-4 text-[var(--text-tertiary)] group-hover:text-blue-600 transition-colors" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredData.length > 8 && (
          <div className="text-center mt-4">
            <Button variant="ghost" size="sm">
              View All {filteredData.length} Items
            </Button>
          </div>
        )}
      </Card>

      {/* Comparison Mode Panel */}
      {comparisonMode && selectedForComparison.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
        >
          <Card className="p-4 shadow-lg border border-[var(--border-primary)]">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-[var(--text-primary)]">
                {selectedForComparison.size} selected for comparison
              </span>
              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    // Open comparison modal/view
                    console.log('Compare selected items:', Array.from(selectedForComparison));
                  }}
                >
                  <BarChart3 className="w-4 h-4 mr-1" />
                  Compare
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedForComparison(new Set());
                    setComparisonMode(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Content Detail Modal */}
      {showDetailModal && selectedContent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[var(--surface-primary)] rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[var(--text-primary)]">
                Content Performance Details
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetailModal(false)}
              >
                ✕
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Content Info */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-[var(--text-primary)] mb-2">
                    {selectedContent.title}
                  </h4>
                  <div className="flex items-center space-x-3 mb-4">
                    <Badge variant="info">
                      {PLATFORM_CONFIG[selectedContent.platform].name}
                    </Badge>
                    <Badge variant="neutral">
                      {selectedContent.contentType}
                    </Badge>
                    <Badge variant={selectedContent.score >= 80 ? 'success' : selectedContent.score >= 60 ? 'warning' : 'error'}>
                      Score: {selectedContent.score}
                    </Badge>
                  </div>
                  <p className="text-[var(--text-secondary)] text-sm">
                    Published: {new Date(selectedContent.publishedDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <StatCard
                    title="Views"
                    value={formatNumber(selectedContent.views)}
                    icon={<Eye />}
                    variant="info"
                  />
                  <StatCard
                    title="Engagement"
                    value={formatNumber(selectedContent.engagement)}
                    icon={<Heart />}
                    variant="success"
                  />
                  <StatCard
                    title="Engagement Rate"
                    value={formatPercentage((selectedContent.engagement / selectedContent.views) * 100)}
                    icon={<TrendingUp />}
                    variant="primary"
                  />
                  <StatCard
                    title="Reach Rate"
                    value={formatPercentage(selectedContent.reachRate)}
                    icon={<Target />}
                    variant="warning"
                  />
                </div>

                {/* Additional Metrics */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--text-secondary)]">Likes</span>
                    <span className="font-medium text-[var(--text-primary)]">{formatNumber(selectedContent.likes)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--text-secondary)]">Comments</span>
                    <span className="font-medium text-[var(--text-primary)]">{formatNumber(selectedContent.comments)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--text-secondary)]">Shares</span>
                    <span className="font-medium text-[var(--text-primary)]">{formatNumber(selectedContent.shares)}</span>
                  </div>
                  {selectedContent.saves && (
                    <div className="flex justify-between items-center">
                      <span className="text-[var(--text-secondary)]">Saves</span>
                      <span className="font-medium text-[var(--text-primary)]">{formatNumber(selectedContent.saves)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--text-secondary)]">CTR</span>
                    <span className="font-medium text-[var(--text-primary)]">{formatPercentage(selectedContent.clickThroughRate)}</span>
                  </div>
                </div>
              </div>

              {/* Performance Visualization */}
              <div className="space-y-4">
                {/* Engagement Breakdown */}
                <div>
                  <h5 className="font-medium text-[var(--text-primary)] mb-3">Engagement Breakdown</h5>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--text-secondary)]">Likes</span>
                      <div className="flex-1 mx-3">
                        <ProgressBar 
                          progress={(selectedContent.likes / selectedContent.engagement) * 100} 
                          variant="success"
                        />
                      </div>
                      <span className="text-sm font-medium">{((selectedContent.likes / selectedContent.engagement) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--text-secondary)]">Comments</span>
                      <div className="flex-1 mx-3">
                        <ProgressBar 
                          progress={(selectedContent.comments / selectedContent.engagement) * 100} 
                          variant="info"
                        />
                      </div>
                      <span className="text-sm font-medium">{((selectedContent.comments / selectedContent.engagement) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--text-secondary)]">Shares</span>
                      <div className="flex-1 mx-3">
                        <ProgressBar 
                          progress={(selectedContent.shares / selectedContent.engagement) * 100} 
                          variant="warning"
                        />
                      </div>
                      <span className="text-sm font-medium">{((selectedContent.shares / selectedContent.engagement) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {selectedContent.tags && selectedContent.tags.length > 0 && (
                  <div>
                    <h5 className="font-medium text-[var(--text-primary)] mb-2">Tags</h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedContent.tags.map((tag, index) => (
                        <Badge key={index} variant="neutral" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Performance Score Breakdown */}
                <div>
                  <h5 className="font-medium text-[var(--text-primary)] mb-3">Performance Score</h5>
                  <div className="text-center">
                    <div className={`text-4xl font-bold mb-2 ${
                      selectedContent.score >= 80 ? 'text-green-600' : 
                      selectedContent.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {selectedContent.score}
                    </div>
                    <div className="text-sm text-[var(--text-secondary)]">
                      {selectedContent.score >= 80 ? 'Excellent Performance' : 
                       selectedContent.score >= 60 ? 'Good Performance' : 
                       selectedContent.score >= 40 ? 'Average Performance' : 'Needs Improvement'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-[var(--border-primary)]">
              <Button variant="ghost" onClick={() => setShowDetailModal(false)}>
                Close
              </Button>
              <Button variant="secondary">
                <ExternalLink className="w-4 h-4 mr-1" />
                View on Platform
              </Button>
              <Button variant="primary">
                <Copy className="w-4 h-4 mr-1" />
                Recreate Similar
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default EnhancedPerformanceAnalytics;
