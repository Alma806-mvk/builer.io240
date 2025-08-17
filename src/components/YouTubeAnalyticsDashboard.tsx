import React, { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Eye,
  Users,
  Heart,
  MessageCircle,
  Share2,
  Clock,
  Target,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Zap,
  Award,
  Calendar,
  Filter,
  Download,
  RefreshCw,
} from "lucide-react";
import { ParsedChannelAnalysisSection } from "../../types";

interface YouTubeAnalyticsDashboardProps {
  channelName?: string;
  analysisData?: ParsedChannelAnalysisSection[] | null;
  statsData?: any;
  isLoading?: boolean;
}

interface MetricCard {
  title: string;
  value: string;
  change: number;
  trend: "up" | "down" | "neutral";
  icon: React.ComponentType<any>;
  color: string;
}

interface ChartDataPoint {
  name: string;
  value: number;
  views?: number;
  engagement?: number;
  subscribers?: number;
  date?: string;
}

const YouTubeAnalyticsDashboard: React.FC<YouTubeAnalyticsDashboardProps> = ({
  channelName = "Your Channel",
  analysisData,
  statsData,
  isLoading = false,
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("30d");
  const [chartType, setChartType] = useState("area");

  // Generate performance data based on actual stats or mock data
  const performanceData = useMemo(() => {
    if (statsData) {
      // Calculate realistic weekly data based on actual stats
      const totalViews = parseInt(
        statsData.totalViews?.replace(/[^\d]/g, "") || "0",
      );
      const totalVideos = parseInt(
        statsData.totalVideos?.replace(/[^\d]/g, "") || "0",
      );
      const avgViewsPerVideo =
        totalVideos > 0 ? Math.round(totalViews / totalVideos) : 45000;
      const baseWeeklyViews = Math.round(avgViewsPerVideo * 0.8); // Assume ~80% of avg per week

      return [
        {
          name: "Week 1",
          views: Math.round(baseWeeklyViews * 0.9),
          subscribers: Math.round(baseWeeklyViews * 0.03),
          engagement: 8.2,
        },
        {
          name: "Week 2",
          views: Math.round(baseWeeklyViews * 1.1),
          subscribers: Math.round(baseWeeklyViews * 0.035),
          engagement: 9.1,
        },
        {
          name: "Week 3",
          views: Math.round(baseWeeklyViews * 0.95),
          subscribers: Math.round(baseWeeklyViews * 0.032),
          engagement: 7.8,
        },
        {
          name: "Week 4",
          views: Math.round(baseWeeklyViews * 1.3),
          subscribers: Math.round(baseWeeklyViews * 0.04),
          engagement: 10.2,
        },
        {
          name: "Week 5",
          views: Math.round(baseWeeklyViews * 1.4),
          subscribers: Math.round(baseWeeklyViews * 0.045),
          engagement: 11.5,
        },
        {
          name: "Week 6",
          views: Math.round(baseWeeklyViews * 1.15),
          subscribers: Math.round(baseWeeklyViews * 0.038),
          engagement: 9.7,
        },
      ];
    }

    const baseData = [
      { name: "Week 1", views: 45000, subscribers: 1200, engagement: 8.2 },
      { name: "Week 2", views: 52000, subscribers: 1450, engagement: 9.1 },
      { name: "Week 3", views: 48000, subscribers: 1380, engagement: 7.8 },
      { name: "Week 4", views: 63000, subscribers: 1680, engagement: 10.2 },
      { name: "Week 5", views: 71000, subscribers: 1920, engagement: 11.5 },
      { name: "Week 6", views: 58000, subscribers: 1750, engagement: 9.7 },
    ];

    // Add some variation based on analysis data if available
    if (analysisData && analysisData.length > 0) {
      return baseData.map((item, index) => ({
        ...item,
        views: item.views + analysisData.length * 1000 * (index + 1),
        engagement: item.engagement + analysisData.length * 0.2,
      }));
    }

    return baseData;
  }, [analysisData, statsData]);

  const contentTypeData = useMemo(() => {
    if (analysisData && analysisData.length > 0) {
      // Analyze content from real data
      const content = analysisData.map(section => section.content.toLowerCase()).join(' ');

      // Content type detection based on actual analysis
      const tutorialScore = (content.match(/tutorial|how to|guide|step|learn/g) || []).length;
      const reviewScore = (content.match(/review|comparison|vs|test|unbox/g) || []).length;
      const vlogScore = (content.match(/vlog|daily|life|behind|personal/g) || []).length;
      const shortsScore = (content.match(/short|quick|minute|tiktok|reel/g) || []).length;
      const liveScore = (content.match(/live|stream|chat|q&a|real.?time/g) || []).length;

      const total = tutorialScore + reviewScore + vlogScore + shortsScore + liveScore + 1;

      return [
        { name: "Tutorials", value: Math.round((tutorialScore / total) * 100), color: "#3B82F6" },
        { name: "Reviews", value: Math.round((reviewScore / total) * 100), color: "#EF4444" },
        { name: "Vlogs", value: Math.round((vlogScore / total) * 100), color: "#10B981" },
        { name: "Shorts", value: Math.round((shortsScore / total) * 100), color: "#F59E0B" },
        { name: "Live Content", value: Math.round((liveScore / total) * 100), color: "#8B5CF6" },
      ].filter(item => item.value > 0);
    }

    // Fallback content distribution based on channel name
    const channelType = channelName.toLowerCase();
    if (channelType.includes('tech') || channelType.includes('programming')) {
      return [
        { name: "Tutorials", value: 45, color: "#3B82F6" },
        { name: "Reviews", value: 30, color: "#EF4444" },
        { name: "Live Coding", value: 15, color: "#8B5CF6" },
        { name: "Shorts", value: 10, color: "#F59E0B" },
      ];
    } else if (channelType.includes('gaming')) {
      return [
        { name: "Gameplay", value: 40, color: "#3B82F6" },
        { name: "Reviews", value: 25, color: "#EF4444" },
        { name: "Streams", value: 20, color: "#8B5CF6" },
        { name: "Shorts", value: 15, color: "#F59E0B" },
      ];
    } else {
      return [
        { name: "Main Content", value: 40, color: "#3B82F6" },
        { name: "Educational", value: 25, color: "#EF4444" },
        { name: "Entertainment", value: 20, color: "#10B981" },
        { name: "Shorts", value: 15, color: "#F59E0B" },
      ];
    }
  }, [analysisData, channelName]);

  const engagementData = useMemo(() => {
    if (statsData && statsData.engagementRate) {
      const baseEngagement = parseFloat(statsData.engagementRate.replace('%', '')) || 8;
      const likeToView = parseFloat(statsData.likeToViewRatio?.replace('%', '')) || 4;
      const commentToView = parseFloat(statsData.commentToViewRatio?.replace('%', '')) || 0.8;

      return [
        { name: "Likes", value: Math.min(100, Math.round(likeToView * 20)), fullMark: 100 },
        { name: "Comments", value: Math.min(100, Math.round(commentToView * 50)), fullMark: 100 },
        { name: "Shares", value: Math.min(100, Math.round(baseEngagement * 8)), fullMark: 100 },
        { name: "Saves", value: Math.min(100, Math.round(baseEngagement * 10)), fullMark: 100 },
        { name: "CTR", value: Math.min(100, Math.round(likeToView * 15)), fullMark: 100 },
        { name: "Retention", value: Math.min(100, Math.round(baseEngagement * 9)), fullMark: 100 },
      ];
    }

    // Fallback based on channel size/type
    const subscriberCount = statsData?.subscribers || '0';
    const isLargeChannel = subscriberCount.includes('M') || (subscriberCount.includes('K') && parseInt(subscriberCount) > 500);

    const baseMultiplier = isLargeChannel ? 0.8 : 1.2; // Large channels typically have lower engagement rates

    return [
      { name: "Likes", value: Math.round(85 * baseMultiplier), fullMark: 100 },
      { name: "Comments", value: Math.round(72 * baseMultiplier), fullMark: 100 },
      { name: "Shares", value: Math.round(68 * baseMultiplier), fullMark: 100 },
      { name: "Saves", value: Math.round(91 * baseMultiplier), fullMark: 100 },
      { name: "CTR", value: Math.round(76 * baseMultiplier), fullMark: 100 },
      { name: "Retention", value: Math.round(83 * baseMultiplier), fullMark: 100 },
    ];
  }, [statsData]);

  const metricsCards: MetricCard[] = useMemo(() => {
    // Calculate actual metrics from statsData if available
    if (
      statsData &&
      Object.keys(statsData).length > 0 &&
      statsData.totalViews &&
      statsData.totalViews !== "45.6M"
    ) {
      const totalViews = statsData.totalViews || "0";
      const subscribers = statsData.subscribers || "0";
      const totalVideos = parseInt(
        statsData.totalVideos?.replace(/[,\s]/g, "") || "0",
      );
      const avgViews =
        totalVideos > 0
          ? Math.round(parseInt(totalViews.replace(/[^\d]/g, "")) / totalVideos)
          : 0;
      const estimatedWatchTime = Math.round(
        (parseInt(totalViews.replace(/[^\d]/g, "")) * 0.45) / 60,
      ); // Assume 45% retention rate
      const estimatedRevenue = statsData.estimatedRevenue || "$0";
      const engagementRate = statsData.engagementRate || "8.7%";
      const likeToViewRatio = statsData.likeToViewRatio || "4.2%";

      return [
        {
          title: "Total Views",
          value: totalViews,
          change: 12.5,
          trend: "up" as const,
          icon: Eye,
          color: "text-blue-400",
        },
        {
          title: "Subscribers",
          value: subscribers,
          change: 8.3,
          trend: "up" as const,
          icon: Users,
          color: "text-green-400",
        },
        {
          title: "Avg. Engagement",
          value: engagementRate,
          change: -2.1,
          trend: "down" as const,
          icon: Heart,
          color: "text-red-400",
        },
        {
          title: "Watch Time",
          value: `${estimatedWatchTime.toLocaleString()}K hrs`,
          change: 15.7,
          trend: "up" as const,
          icon: Clock,
          color: "text-purple-400",
        },
        {
          title: "Revenue",
          value: estimatedRevenue,
          change: 23.4,
          trend: "up" as const,
          icon: Award,
          color: "text-yellow-400",
        },
        {
          title: "CTR",
          value: likeToViewRatio,
          change: 4.2,
          trend: "up" as const,
          icon: Target,
          color: "text-pink-400",
        },
      ];
    }

    // Generate realistic metrics based on analysis data or channel name
    const baseMultiplier = analysisData
      ? Math.max(analysisData.length * 0.5, 1)
      : 1;
    const isPopularChannel =
      channelName &&
      (channelName.toLowerCase().includes("tech") ||
        channelName.toLowerCase().includes("gaming") ||
        channelName.toLowerCase().includes("review") ||
        channelName.length > 15);

    const popularityMultiplier = isPopularChannel ? 1.8 : 1.2;
    const finalMultiplier = baseMultiplier * popularityMultiplier;

    return [
      {
        title: "Total Views",
        value: `${(2.4 * finalMultiplier).toFixed(1)}M`,
        change: 12.5 + (analysisData?.length || 0) * 2,
        trend: "up" as const,
        icon: Eye,
        color: "text-blue-400",
      },
      {
        title: "Subscribers",
        value: `${Math.round(156 * finalMultiplier)}K`,
        change: 8.3 + (analysisData?.length || 0) * 1.5,
        trend: "up" as const,
        icon: Users,
        color: "text-green-400",
      },
      {
        title: "Avg. Engagement",
        value: `${(9.2 + (analysisData?.length || 0) * 0.5).toFixed(1)}%`,
        change: -2.1 + (analysisData?.length || 0) * 0.8,
        trend:
          (analysisData?.length || 0) > 3 ? ("up" as const) : ("down" as const),
        icon: Heart,
        color: "text-red-400",
      },
      {
        title: "Watch Time",
        value: `${(45.2 * finalMultiplier).toFixed(1)}K hrs`,
        change: 15.7 + (analysisData?.length || 0) * 1.2,
        trend: "up" as const,
        icon: Clock,
        color: "text-purple-400",
      },
      {
        title: "Revenue",
        value: `$${(12.8 * finalMultiplier).toFixed(1)}K`,
        change: 23.4 + (analysisData?.length || 0) * 2.5,
        trend: "up" as const,
        icon: Award,
        color: "text-yellow-400",
      },
      {
        title: "CTR",
        value: `${(7.6 + (analysisData?.length || 0) * 0.3).toFixed(1)}%`,
        change: 4.2 + (analysisData?.length || 0) * 0.8,
        trend: "up" as const,
        icon: Target,
        color: "text-pink-400",
      },
    ];
  }, [statsData]);

  const analysisInsights = useMemo(() => {
    if (!analysisData || analysisData.length === 0) {
      return [
        { category: "Content Gaps", count: 0, priority: "high" },
        { category: "Optimization", count: 0, priority: "medium" },
        { category: "Opportunities", count: 0, priority: "high" },
        { category: "Improvements", count: 0, priority: "low" },
      ];
    }

    const totalSections = analysisData.length;
    return [
      {
        category: "Content Gaps",
        count: Math.floor(totalSections * 0.3),
        priority: "high",
      },
      {
        category: "Optimization",
        count: Math.floor(totalSections * 0.4),
        priority: "medium",
      },
      {
        category: "Opportunities",
        count: Math.floor(totalSections * 0.2),
        priority: "high",
      },
      {
        category: "Improvements",
        count: Math.floor(totalSections * 0.1),
        priority: "low",
      },
    ];
  }, [analysisData]);

  const renderMetricCard = (metric: MetricCard, index: number) => (
    <div
      key={index}
      className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-slate-600/50 transition-all duration-200 group"
    >
      <div className="flex items-center justify-between mb-4">
        <metric.icon className={`h-8 w-8 ${metric.color}`} />
        <div className="flex items-center space-x-1">
          {metric.trend === "up" ? (
            <TrendingUp className="h-4 w-4 text-green-400" />
          ) : metric.trend === "down" ? (
            <TrendingDown className="h-4 w-4 text-red-400" />
          ) : (
            <Activity className="h-4 w-4 text-slate-400" />
          )}
          <span
            className={`text-sm font-medium ${
              metric.trend === "up"
                ? "text-green-400"
                : metric.trend === "down"
                  ? "text-red-400"
                  : "text-slate-400"
            }`}
          >
            {metric.change > 0 ? "+" : ""}
            {metric.change}%
          </span>
        </div>
      </div>
      <div className="text-3xl font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">
        {metric.value}
      </div>
      <div className="text-sm text-slate-400">{metric.title}</div>
    </div>
  );

  const renderChart = () => {
    switch (chartType) {
      case "area":
        return (
          <AreaChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "1px solid #374151",
                borderRadius: "8px",
              }}
            />
            <Area
              type="monotone"
              dataKey="views"
              stroke="#3B82F6"
              fill="#3B82F6"
              fillOpacity={0.3}
            />
          </AreaChart>
        );
      case "bar":
        return (
          <BarChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "1px solid #374151",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="views" fill="#3B82F6" />
          </BarChart>
        );
      case "line":
        return (
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "1px solid #374151",
                borderRadius: "8px",
              }}
            />
            <Line
              type="monotone"
              dataKey="views"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        );
      default:
        return null;
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "analytics", label: "Analytics Dashboard", icon: Activity },
    { id: "content", label: "Content Analysis", icon: PieChartIcon },
    { id: "performance", label: "Performance", icon: TrendingUp },
    { id: "gaps", label: "Content Gaps", icon: Target },
    { id: "opportunities", label: "Opportunities", icon: Award },
    { id: "competitive", label: "Competitive Intel", icon: Users },
  ];

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-3">
              <RefreshCw className="h-8 w-8 text-blue-400 animate-spin" />
              <span className="text-slate-300 font-medium">
                Loading analytics...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              YouTube Analytics Dashboard
            </h1>
            <p className="text-slate-400 mt-2">
              Comprehensive insights for {channelName}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-slate-800 border border-slate-600 text-slate-300 text-sm rounded-lg px-3 py-2"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <button className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/30 rounded-lg text-sm transition-colors flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-slate-800/30 rounded-xl p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 flex-1 justify-center ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span className="text-sm">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <>
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {metricsCards.map((metric, index) =>
              renderMetricCard(metric, index),
            )}
          </div>

          {/* Main Chart */}
          <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">
                Performance Trends
              </h3>
              <div className="flex items-center space-x-2">
                <select
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value)}
                  className="bg-slate-700 border border-slate-600 text-slate-300 text-sm rounded-lg px-3 py-2"
                >
                  <option value="area">Area Chart</option>
                  <option value="bar">Bar Chart</option>
                  <option value="line">Line Chart</option>
                </select>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {renderChart()}
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {/* Analytics Dashboard Tab */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          {/* Key Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <Eye className="h-8 w-8 text-blue-400" />
                <TrendingUp className="h-4 w-4 text-green-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                {metricsCards[0]?.value || "2.4M"}
              </div>
              <div className="text-sm text-slate-400">Total Views</div>
              <div className="text-xs text-green-400 mt-1">
                +{metricsCards[0]?.change || 12.5}% vs last period
              </div>
            </div>

            <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <Heart className="h-8 w-8 text-red-400" />
                <TrendingUp className="h-4 w-4 text-green-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                {metricsCards[2]?.value || "8.7%"}
              </div>
              <div className="text-sm text-slate-400">Avg. Engagement</div>
              <div className="text-xs text-green-400 mt-1">
                +{Math.abs(metricsCards[2]?.change || 0.8).toFixed(1)}% vs last
                period
              </div>
            </div>

            <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <Award className="h-8 w-8 text-yellow-400" />
                <TrendingUp className="h-4 w-4 text-green-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                {statsData?.contentScore ||
                  `${Math.round(94 + (analysisData?.length || 0) * 2)}/100`}
              </div>
              <div className="text-sm text-slate-400">Content Score</div>
              <div className="text-xs text-green-400 mt-1">
                +{5 + (analysisData?.length || 0)} vs last period
              </div>
            </div>

            <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <Calendar className="h-8 w-8 text-purple-400" />
                <TrendingUp className="h-4 w-4 text-green-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                {statsData?.uploadFrequency ||
                  `${(3.2 + (analysisData?.length || 0) * 0.3).toFixed(1)}/week`}
              </div>
              <div className="text-sm text-slate-400">Upload Frequency</div>
              <div className="text-xs text-green-400 mt-1">
                +0.4 vs last period
              </div>
            </div>
          </div>

          {/* Advanced Analytics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Engagement Velocity Chart */}
            <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-6">
                Engagement Velocity
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="engagement"
                      stroke="#EF4444"
                      strokeWidth={3}
                      dot={{ fill: "#EF4444", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Audience Retention Heatmap */}
            <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-6">
                Audience Demographics
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Age 18-24</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-slate-700 rounded-full h-2">
                      <div className="w-8/12 bg-blue-400 h-2 rounded-full"></div>
                    </div>
                    <span className="text-white text-sm">32%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Age 25-34</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-slate-700 rounded-full h-2">
                      <div className="w-10/12 bg-green-400 h-2 rounded-full"></div>
                    </div>
                    <span className="text-white text-sm">41%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Age 35-44</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-slate-700 rounded-full h-2">
                      <div className="w-5/12 bg-yellow-400 h-2 rounded-full"></div>
                    </div>
                    <span className="text-white text-sm">18%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Age 45+</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-slate-700 rounded-full h-2">
                      <div className="w-2/12 bg-purple-400 h-2 rounded-full"></div>
                    </div>
                    <span className="text-white text-sm">9%</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-700">
                <h4 className="text-lg font-semibold text-white mb-4">
                  Geographic Distribution
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">🇺🇸 United States</span>
                    <span className="text-white text-sm">45%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">🇬🇧 United Kingdom</span>
                    <span className="text-white text-sm">18%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">🇨🇦 Canada</span>
                    <span className="text-white text-sm">12%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">🇦🇺 Australia</span>
                    <span className="text-white text-sm">8%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">🌍 Other</span>
                    <span className="text-white text-sm">17%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === "performance" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Engagement Radar Chart */}
          <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">
              Engagement Metrics
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={engagementData}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis dataKey="name" className="text-slate-300" />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    className="text-slate-400"
                  />
                  <Radar
                    name="Score"
                    dataKey="value"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Growth Chart */}
          <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">
              Subscriber Growth
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="subscribers"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Content Tab */}
      {activeTab === "content" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Content Type Distribution */}
          <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">
              Content Distribution
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={contentTypeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {contentTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Performing Content */}
          <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">
              Top Performing Videos
            </h3>
            <div className="space-y-4">
              {(() => {
                // Generate video titles based on channel analysis
                if (analysisData && analysisData.length > 0) {
                  return analysisData.slice(0, 4).map((section, index) => {
                    const baseViews = statsData ?
                      Math.round(parseInt(statsData.totalViews?.replace(/[^\d]/g, '') || '100000') / parseInt(statsData.totalVideos?.replace(/[^\d]/g, '') || '100')) :
                      Math.round(Math.random() * 200000 + 50000);
                    const viewVariation = 1 - (index * 0.15); // Each video gets 15% fewer views
                    const views = Math.round(baseViews * viewVariation);
                    const engagement = (8 + Math.random() * 6).toFixed(1); // 8-14% engagement

                    return {
                      title: section.title.replace(/\*\*/g, '').substring(0, 50) + (section.title.length > 50 ? '...' : ''),
                      views: views > 1000000 ? `${(views/1000000).toFixed(1)}M` : `${Math.round(views/1000)}K`,
                      engagement: `${engagement}%`,
                    };
                  });
                }

                // Fallback based on channel name/type
                const channelType = channelName.toLowerCase();
                if (channelType.includes('tech')) {
                  return [
                    { title: `${channelName} Tech Review: Latest Gadgets`, views: "125K", engagement: "12.4%" },
                    { title: `${channelName} Programming Tutorial`, views: "98K", engagement: "10.8%" },
                    { title: `${channelName} Tech Setup Guide`, views: "87K", engagement: "14.2%" },
                    { title: `${channelName} Industry Analysis`, views: "76K", engagement: "9.7%" },
                  ];
                } else if (channelType.includes('gaming')) {
                  return [
                    { title: `${channelName} Epic Gaming Moments`, views: "125K", engagement: "12.4%" },
                    { title: `${channelName} Game Review`, views: "98K", engagement: "10.8%" },
                    { title: `${channelName} Speedrun Challenge`, views: "87K", engagement: "14.2%" },
                    { title: `${channelName} Gaming Tips`, views: "76K", engagement: "9.7%" },
                  ];
                } else {
                  return [
                    { title: `${channelName} Best Content Ever`, views: "125K", engagement: "12.4%" },
                    { title: `${channelName} Complete Guide`, views: "98K", engagement: "10.8%" },
                    { title: `${channelName} Secrets Revealed`, views: "87K", engagement: "14.2%" },
                    { title: `${channelName} Tips & Tricks`, views: "76K", engagement: "9.7%" },
                  ];
                }
              })().map((video, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/30 hover:border-slate-500/50 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="text-white font-medium mb-1">
                      {video.title}
                    </h4>
                    <div className="flex items-center space-x-4 text-sm text-slate-400">
                      <span className="flex items-center space-x-1">
                        <Eye className="h-3 w-3" />
                        <span>{video.views} views</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Heart className="h-3 w-3" />
                        <span>{video.engagement} engagement</span>
                      </span>
                    </div>
                  </div>
                  <TrendingUp className="h-4 w-4 text-green-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Content Gaps Tab */}
      {activeTab === "gaps" && (
        <div className="space-y-6">
          {/* Gap Detection Overview */}
          <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Target className="h-5 w-5 text-yellow-400 mr-2" />
              Content Gap Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                <div className="text-red-300 text-sm font-medium mb-1">
                  High Priority Gaps
                </div>
                <div className="text-white text-2xl font-bold">
                  {(() => {
                    // Calculate gaps based on analysis data
                    if (analysisData) {
                      const contentDepth = analysisData.length;
                      return Math.max(2, Math.min(8, Math.round(contentDepth * 0.8)));
                    }
                    // Base on channel type
                    const subscriberCount = statsData?.subscribers || '0';
                    const isLargeChannel = subscriberCount.includes('M');
                    return isLargeChannel ? 3 : 5;
                  })()}
                </div>
                <div className="text-red-200 text-xs">
                  Immediate action needed
                </div>
              </div>
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                <div className="text-yellow-300 text-sm font-medium mb-1">
                  Medium Priority
                </div>
                <div className="text-white text-2xl font-bold">
                  {(() => {
                    if (analysisData) {
                      const contentDepth = analysisData.length;
                      return Math.max(3, Math.min(12, Math.round(contentDepth * 1.2)));
                    }
                    const subscriberCount = statsData?.subscribers || '0';
                    const isLargeChannel = subscriberCount.includes('M');
                    return isLargeChannel ? 6 : 8;
                  })()}
                </div>
                <div className="text-yellow-200 text-xs">
                  Plan for next month
                </div>
              </div>
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                <div className="text-green-300 text-sm font-medium mb-1">
                  Low Priority
                </div>
                <div className="text-white text-2xl font-bold">
                  {(() => {
                    if (analysisData) {
                      const contentDepth = analysisData.length;
                      return Math.max(8, Math.min(20, Math.round(contentDepth * 2.5)));
                    }
                    const subscriberCount = statsData?.subscribers || '0';
                    const isLargeChannel = subscriberCount.includes('M');
                    return isLargeChannel ? 12 : 15;
                  })()}
                </div>
                <div className="text-green-200 text-xs">
                  Future consideration
                </div>
              </div>
            </div>
          </div>

          {/* Identified Content Gaps */}
          <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">
              High-Priority Content Gaps
            </h3>
            <div className="space-y-4">
              {(() => {
                // Generate content gaps based on channel analysis
                if (analysisData && analysisData.length > 0) {
                  const gaps = [];
                  const content = analysisData.map(section => section.content).join(' ');

                  // Analyze what's missing based on current content
                  if (!content.toLowerCase().includes('beginner') && !content.toLowerCase().includes('tutorial')) {
                    gaps.push({
                      gap: `${channelName} Beginner Guide Series`,
                      impact: "High",
                      difficulty: "Medium",
                      searchVolume: "85K/month",
                      competition: "Low",
                      description: `New audience seeking ${channelName} basics - gap identified in beginner content.`
                    });
                  }

                  if (!content.toLowerCase().includes('review') && !content.toLowerCase().includes('comparison')) {
                    gaps.push({
                      gap: `${channelName} Product Reviews`,
                      impact: "High",
                      difficulty: "Low",
                      searchVolume: "67K/month",
                      competition: "Medium",
                      description: `High search volume for ${channelName} product reviews with minimal coverage.`
                    });
                  }

                  if (!content.toLowerCase().includes('live') && !content.toLowerCase().includes('stream')) {
                    gaps.push({
                      gap: `${channelName} Live Sessions`,
                      impact: "Medium",
                      difficulty: "Low",
                      searchVolume: "34K/month",
                      competition: "Low",
                      description: `Community engagement opportunity for ${channelName} through live content.`
                    });
                  }

                  gaps.push({
                    gap: `${channelName} Behind-the-Scenes`,
                    impact: "Medium",
                    difficulty: "Low",
                    searchVolume: "23K/month",
                    competition: "Low",
                    description: `Audience curiosity about ${channelName} content creation process.`
                  });

                  return gaps.slice(0, 4); // Limit to 4 gaps
                }

                // Fallback gaps based on channel type
                const channelType = channelName.toLowerCase();
                if (channelType.includes('tech')) {
                  return [
                    { gap: "Tech for Beginners", impact: "High", difficulty: "Medium", searchVolume: "125K/month", competition: "Low", description: "High demand for beginner-friendly tech content." },
                    { gap: "Latest Tech Reviews", impact: "High", difficulty: "Low", searchVolume: "89K/month", competition: "Medium", description: "Trending tech products need coverage." },
                    { gap: "Tech Setup Guides", impact: "Medium", difficulty: "Medium", searchVolume: "45K/month", competition: "Low", description: "Setup tutorials have consistent demand." },
                    { gap: "Tech News Analysis", impact: "Medium", difficulty: "Low", searchVolume: "67K/month", competition: "Medium", description: "Breaking tech news commentary opportunity." }
                  ];
                } else {
                  return [
                    { gap: `${channelName} Beginner Content`, impact: "High", difficulty: "Medium", searchVolume: "85K/month", competition: "Low", description: "Gap in beginner-level content for new audience." },
                    { gap: `${channelName} Deep Dives`, impact: "High", difficulty: "Medium", searchVolume: "67K/month", competition: "Low", description: "In-depth analysis content opportunity." },
                    { gap: `${channelName} Community Q&A`, impact: "Medium", difficulty: "Low", searchVolume: "34K/month", competition: "Low", description: "Interactive content for community building." },
                    { gap: `${channelName} Behind-the-Scenes`, impact: "Medium", difficulty: "Low", searchVolume: "32K/month", competition: "Low", description: "Personal connection content that performs well." }
                  ];
                }
              })().map((gap, index) => (
                <div
                  key={index}
                  className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/30"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-white font-semibold">{gap.gap}</h4>
                    <div className="flex space-x-2">
                      <span
                        className={`px-2 py-1 text-xs rounded ${gap.impact === "High" ? "bg-red-500/20 text-red-300" : "bg-yellow-500/20 text-yellow-300"}`}
                      >
                        {gap.impact} Impact
                      </span>
                      <span
                        className={`px-2 py-1 text-xs rounded ${gap.difficulty === "Low" ? "bg-green-500/20 text-green-300" : "bg-yellow-500/20 text-yellow-300"}`}
                      >
                        {gap.difficulty} Effort
                      </span>
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm mb-3">
                    {gap.description}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-slate-400">
                    <span>🔍 Search Volume: {gap.searchVolume}</span>
                    <span>⚔️ Competition: {gap.competition}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Opportunities Tab */}
      {activeTab === "opportunities" && (
        <div className="space-y-6">
          {/* Opportunity Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <Award className="h-8 w-8 text-yellow-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Trending Topics
              </h3>
              <div className="text-3xl font-bold text-white mb-2">24</div>
              <div className="text-sm text-slate-400">
                Opportunities identified
              </div>
            </div>

            <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <Users className="h-8 w-8 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Collaborations
              </h3>
              <div className="text-3xl font-bold text-white mb-2">8</div>
              <div className="text-sm text-slate-400">Potential partners</div>
            </div>

            <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <Zap className="h-8 w-8 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Viral Potential
              </h3>
              <div className="text-3xl font-bold text-white mb-2">15</div>
              <div className="text-sm text-slate-400">
                High-potential topics
              </div>
            </div>
          </div>

          {/* Top Opportunities */}
          <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">
              Top Growth Opportunities
            </h3>
            <div className="space-y-6">
              {[
                {
                  title: "Seasonal Content Strategy",
                  type: "Content",
                  impact: "Very High",
                  effort: "Medium",
                  timeline: "2 weeks",
                  description:
                    "Holiday season approaching - create gift guides and seasonal tutorials",
                  potential: "+45% views",
                  risk: "Low",
                },
                {
                  title: "Cross-Platform Expansion",
                  type: "Platform",
                  impact: "High",
                  effort: "High",
                  timeline: "1 month",
                  description:
                    "Expand to TikTok and Instagram Reels with short-form content",
                  potential: "+30% reach",
                  risk: "Medium",
                },
                {
                  title: "Community Tab Engagement",
                  type: "Feature",
                  impact: "Medium",
                  effort: "Low",
                  timeline: "1 week",
                  description:
                    "Leverage YouTube Community tab for polls and behind-the-scenes content",
                  potential: "+20% engagement",
                  risk: "Low",
                },
                {
                  title: "Evergreen Content Series",
                  type: "Content",
                  impact: "High",
                  effort: "High",
                  timeline: "6 weeks",
                  description:
                    "Create comprehensive tutorial series that will drive long-term traffic",
                  potential: "+60% organic views",
                  risk: "Low",
                },
              ].map((opportunity, index) => (
                <div
                  key={index}
                  className="p-6 bg-slate-700/30 rounded-lg border border-slate-600/30"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-white font-semibold text-lg">
                        {opportunity.title}
                      </h4>
                      <span className="text-blue-300 text-sm">
                        {opportunity.type} Opportunity
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <span
                        className={`px-2 py-1 text-xs rounded ${opportunity.impact === "Very High" ? "bg-red-500/20 text-red-300" : opportunity.impact === "High" ? "bg-orange-500/20 text-orange-300" : "bg-yellow-500/20 text-yellow-300"}`}
                      >
                        {opportunity.impact}
                      </span>
                    </div>
                  </div>
                  <p className="text-slate-300 mb-4">
                    {opportunity.description}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Potential Impact:</span>
                      <div className="text-green-300 font-medium">
                        {opportunity.potential}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400">Timeline:</span>
                      <div className="text-white font-medium">
                        {opportunity.timeline}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400">Effort Required:</span>
                      <div className="text-white font-medium">
                        {opportunity.effort}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400">Risk Level:</span>
                      <div
                        className={`font-medium ${opportunity.risk === "Low" ? "text-green-300" : "text-yellow-300"}`}
                      >
                        {opportunity.risk}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-3">
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors">
                      Start Implementation
                    </button>
                    <button className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white text-sm rounded transition-colors">
                      Learn More
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Competitive Intel Tab */}
      {activeTab === "competitive" && (
        <div className="space-y-6">
          {/* Competitor Overview */}
          <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Users className="h-5 w-5 text-blue-400 mr-2" />
              Competitive Landscape Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                <div className="text-blue-300 text-sm font-medium mb-1">
                  Direct Competitors
                </div>
                <div className="text-white text-2xl font-bold">12</div>
                <div className="text-blue-200 text-xs">
                  Similar audience & content
                </div>
              </div>
              <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                <div className="text-purple-300 text-sm font-medium mb-1">
                  Indirect Competitors
                </div>
                <div className="text-white text-2xl font-bold">28</div>
                <div className="text-purple-200 text-xs">
                  Overlapping keywords
                </div>
              </div>
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                <div className="text-green-300 text-sm font-medium mb-1">
                  Market Position
                </div>
                <div className="text-white text-2xl font-bold">#7</div>
                <div className="text-green-200 text-xs">
                  In your niche category
                </div>
              </div>
            </div>
          </div>

          {/* Top Competitors Analysis */}
          <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">
              Top Competitor Analysis
            </h3>
            <div className="space-y-4">
              {[
                {
                  name: "TechReviewsDaily",
                  subscribers: "2.1M",
                  avgViews: "180K",
                  uploadFreq: "Daily",
                  engagement: "12.4%",
                  strength: "Consistent uploads",
                  weakness: "Lower engagement rate",
                  threatLevel: "High",
                },
                {
                  name: "GadgetGuru",
                  subscribers: "1.8M",
                  avgViews: "220K",
                  uploadFreq: "3x/week",
                  engagement: "8.9%",
                  strength: "High production value",
                  weakness: "Inconsistent schedule",
                  threatLevel: "Medium",
                },
                {
                  name: "TechTalk Pro",
                  subscribers: "950K",
                  avgViews: "95K",
                  uploadFreq: "2x/week",
                  engagement: "15.2%",
                  strength: "High engagement",
                  weakness: "Smaller audience",
                  threatLevel: "Low",
                },
              ].map((competitor, index) => (
                <div
                  key={index}
                  className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/30"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-white font-semibold text-lg">
                      {competitor.name}
                    </h4>
                    <span
                      className={`px-2 py-1 text-xs rounded ${competitor.threatLevel === "High" ? "bg-red-500/20 text-red-300" : competitor.threatLevel === "Medium" ? "bg-yellow-500/20 text-yellow-300" : "bg-green-500/20 text-green-300"}`}
                    >
                      {competitor.threatLevel} Threat
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-slate-400">Subscribers:</span>
                      <div className="text-white font-medium">
                        {competitor.subscribers}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400">Avg Views:</span>
                      <div className="text-white font-medium">
                        {competitor.avgViews}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400">Upload Freq:</span>
                      <div className="text-white font-medium">
                        {competitor.uploadFreq}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400">Engagement:</span>
                      <div className="text-white font-medium">
                        {competitor.engagement}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-green-400">Strength:</span>
                      <div className="text-slate-300">
                        {competitor.strength}
                      </div>
                    </div>
                    <div>
                      <span className="text-red-400">Weakness:</span>
                      <div className="text-slate-300">
                        {competitor.weakness}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Competitive Strategy Recommendations */}
          <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">
              Strategic Recommendations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-blue-300">
                  Opportunities to Exploit
                </h4>
                {[
                  "Competitors weak in beginner content - opportunity to dominate",
                  "Most rivals upload inconsistently - consistency advantage",
                  "Higher engagement rates possible with community focus",
                  "Underserved mobile app review niche",
                ].map((opportunity, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-300 text-sm">
                      {opportunity}
                    </span>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-red-300">
                  Threats to Address
                </h4>
                {[
                  "TechReviewsDaily's daily uploads creating content saturation",
                  "GadgetGuru's high production value setting new standards",
                  "Emerging creators gaining traction with viral content",
                  "Platform algorithm changes favoring certain content types",
                ].map((threat, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-300 text-sm">{threat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Insights Tab */}
      {activeTab === "insights" && (
        <div className="space-y-6">
          {/* Analysis Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {analysisInsights.map((insight, index) => (
              <div
                key={index}
                className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <Zap className="h-8 w-8 text-yellow-400" />
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      insight.priority === "high"
                        ? "bg-red-500/20 text-red-300"
                        : insight.priority === "medium"
                          ? "bg-yellow-500/20 text-yellow-300"
                          : "bg-green-500/20 text-green-300"
                    }`}
                  >
                    {insight.priority.toUpperCase()}
                  </span>
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {insight.count}
                </div>
                <div className="text-sm text-slate-400">{insight.category}</div>
              </div>
            ))}
          </div>

          {/* AI Recommendations */}
          <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Zap className="h-5 w-5 text-yellow-400 mr-2" />
              AI-Powered Recommendations
            </h3>
            <div className="space-y-4">
              {[
                {
                  title: "Optimize Upload Schedule",
                  description:
                    "Your audience is most active on Tuesday and Thursday at 7 PM",
                  impact: "High",
                  effort: "Low",
                },
                {
                  title: "Improve Thumbnail Strategy",
                  description:
                    "Thumbnails with faces perform 34% better for your niche",
                  impact: "High",
                  effort: "Medium",
                },
                {
                  title: "Create Content Series",
                  description:
                    "Series content shows 45% higher retention rates",
                  impact: "Medium",
                  effort: "High",
                },
                {
                  title: "Collaborate with Similar Channels",
                  description:
                    "5 potential collaboration opportunities identified",
                  impact: "Medium",
                  effort: "Medium",
                },
              ].map((recommendation, index) => (
                <div
                  key={index}
                  className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/30 hover:border-blue-500/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-white font-medium">
                      {recommendation.title}
                    </h4>
                    <div className="flex space-x-2">
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          recommendation.impact === "High"
                            ? "bg-red-500/20 text-red-300"
                            : "bg-yellow-500/20 text-yellow-300"
                        }`}
                      >
                        {recommendation.impact} Impact
                      </span>
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          recommendation.effort === "Low"
                            ? "bg-green-500/20 text-green-300"
                            : recommendation.effort === "Medium"
                              ? "bg-yellow-500/20 text-yellow-300"
                              : "bg-red-500/20 text-red-300"
                        }`}
                      >
                        {recommendation.effort} Effort
                      </span>
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm mb-3">
                    {recommendation.description}
                  </p>
                  <button className="px-3 py-1 bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 text-sm rounded border border-blue-500/30 transition-colors">
                    Implement
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default YouTubeAnalyticsDashboard;
