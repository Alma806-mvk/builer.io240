import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ChartBarIcon,
  EyeIcon,
  HeartIcon,
  ShareIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

interface ContentMetrics {
  id: string;
  title: string;
  platform: string;
  publishedAt: Date;
  views: number;
  likes: number;
  shares: number;
  comments: number;
  engagement: number;
  trend: "up" | "down" | "stable";
  trendPercentage: number;
}

interface PlatformStats {
  platform: string;
  totalViews: number;
  totalEngagement: number;
  growthRate: number;
  topPerformer: string;
  color: string;
}

export const ContentPerformanceDashboard: React.FC = () => {
  const [contentMetrics, setContentMetrics] = useState<ContentMetrics[]>([]);
  const [platformStats, setPlatformStats] = useState<PlatformStats[]>([]);
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d">("7d");

  useEffect(() => {
    const mockContentMetrics: ContentMetrics[] = [
      {
        id: "1",
        title: "How to Build AI Apps in 2024",
        platform: "YouTube",
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        views: 15420,
        likes: 892,
        shares: 234,
        comments: 156,
        engagement: 8.3,
        trend: "up",
        trendPercentage: 23.5,
      },
      {
        id: "2",
        title: "Top 10 Productivity Tips",
        platform: "TikTok",
        publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        views: 8750,
        likes: 1205,
        shares: 89,
        comments: 203,
        engagement: 17.1,
        trend: "up",
        trendPercentage: 45.2,
      },
      {
        id: "3",
        title: "React vs Vue: Which to Choose?",
        platform: "LinkedIn",
        publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        views: 3240,
        likes: 267,
        shares: 45,
        comments: 89,
        engagement: 12.4,
        trend: "stable",
        trendPercentage: 2.1,
      },
      {
        id: "4",
        title: "Web Development Mistakes",
        platform: "Twitter",
        publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        views: 5680,
        likes: 456,
        shares: 123,
        comments: 78,
        engagement: 11.6,
        trend: "down",
        trendPercentage: -8.4,
      },
    ];

    const mockPlatformStats: PlatformStats[] = [
      {
        platform: "YouTube",
        totalViews: 45230,
        totalEngagement: 12.4,
        growthRate: 18.7,
        topPerformer: "How to Build AI Apps in 2024",
        color: "from-red-600 to-red-700",
      },
      {
        platform: "TikTok",
        totalViews: 32450,
        totalEngagement: 19.2,
        growthRate: 34.2,
        topPerformer: "Top 10 Productivity Tips",
        color: "from-pink-600 to-purple-700",
      },
      {
        platform: "LinkedIn",
        totalViews: 12890,
        totalEngagement: 8.9,
        growthRate: 12.3,
        topPerformer: "React vs Vue: Which to Choose?",
        color: "from-blue-600 to-blue-700",
      },
      {
        platform: "Twitter",
        totalViews: 18560,
        totalEngagement: 7.4,
        growthRate: -3.2,
        topPerformer: "Web Development Mistakes",
        color: "from-cyan-600 to-cyan-700",
      },
    ];

    setContentMetrics(mockContentMetrics);
    setPlatformStats(mockPlatformStats);
  }, [timeRange]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const getTrendIcon = (trend: string, percentage: number) => {
    if (trend === "up") return <ArrowTrendingUpIcon className="w-4 h-4 text-green-400" />;
    if (trend === "down") return <ArrowTrendingDownIcon className="w-4 h-4 text-red-400" />;
    return <ArrowUpIcon className="w-4 h-4 text-gray-400" />;
  };

  const getTrendColor = (trend: string) => {
    if (trend === "up") return "text-green-400";
    if (trend === "down") return "text-red-400";
    return "text-gray-400";
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-600/30 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <ChartBarIcon className="w-5 h-5 text-purple-400" />
          Content Performance Dashboard
        </h3>
        <div className="flex gap-2">
          {["24h", "7d", "30d"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range as any)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                timeRange === range
                  ? "bg-purple-600 text-white"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Platform Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {platformStats.map((platform) => (
          <motion.div
            key={platform.platform}
            whileHover={{ scale: 1.02 }}
            className={`bg-gradient-to-br ${platform.color} p-4 rounded-xl text-white`}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-sm">{platform.platform}</h4>
              <div className={`flex items-center gap-1 text-xs ${
                platform.growthRate >= 0 ? "text-green-200" : "text-red-200"
              }`}>
                {platform.growthRate >= 0 ? (
                  <ArrowUpIcon className="w-3 h-3" />
                ) : (
                  <ArrowDownIcon className="w-3 h-3" />
                )}
                {Math.abs(platform.growthRate)}%
              </div>
            </div>
            <div className="text-2xl font-bold mb-1">{formatNumber(platform.totalViews)}</div>
            <div className="text-xs opacity-90">Total Views</div>
            <div className="text-xs opacity-75 mt-1">
              {platform.totalEngagement}% engagement
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Content Performance */}
      <div>
        <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
          <ClockIcon className="w-4 h-4" />
          Recent Content Performance
        </h4>
        <div className="space-y-3">
          {contentMetrics.map((content) => (
            <motion.div
              key={content.id}
              whileHover={{ scale: 1.01 }}
              className="bg-slate-700/30 border border-slate-600/30 rounded-lg p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h5 className="font-medium text-white text-sm">{content.title}</h5>
                    <span className="bg-slate-600 text-slate-300 px-2 py-1 rounded text-xs">
                      {content.platform}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="w-3 h-3" />
                      {content.publishedAt.toLocaleDateString()}
                    </span>
                    <div className={`flex items-center gap-1 ${getTrendColor(content.trend)}`}>
                      {getTrendIcon(content.trend, content.trendPercentage)}
                      {Math.abs(content.trendPercentage)}%
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-blue-400 mb-1">
                    <EyeIcon className="w-4 h-4" />
                  </div>
                  <div className="text-white font-semibold text-sm">{formatNumber(content.views)}</div>
                  <div className="text-xs text-slate-400">Views</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-red-400 mb-1">
                    <HeartIcon className="w-4 h-4" />
                  </div>
                  <div className="text-white font-semibold text-sm">{formatNumber(content.likes)}</div>
                  <div className="text-xs text-slate-400">Likes</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-green-400 mb-1">
                    <ShareIcon className="w-4 h-4" />
                  </div>
                  <div className="text-white font-semibold text-sm">{formatNumber(content.shares)}</div>
                  <div className="text-xs text-slate-400">Shares</div>
                </div>
                <div className="text-center">
                  <div className="text-purple-400 font-semibold text-sm">{content.engagement}%</div>
                  <div className="text-xs text-slate-400">Engagement</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const QuickStatsWidget: React.FC = () => {
  const [stats, setStats] = useState({
    totalViews: 0,
    totalEngagement: 0,
    activeProjects: 0,
    completionRate: 0,
  });

  useEffect(() => {
    // Animate numbers counting up
    const targetStats = {
      totalViews: 127534,
      totalEngagement: 8.7,
      activeProjects: 12,
      completionRate: 89,
    };

    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setStats({
        totalViews: Math.floor(targetStats.totalViews * progress),
        totalEngagement: Number((targetStats.totalEngagement * progress).toFixed(1)),
        activeProjects: Math.floor(targetStats.activeProjects * progress),
        completionRate: Math.floor(targetStats.completionRate * progress),
      });

      if (currentStep >= steps) {
        clearInterval(interval);
        setStats(targetStats);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-600/30 rounded-2xl p-6 h-fit">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <ArrowTrendingUpIcon className="w-5 h-5 text-emerald-400" />
        Quick Stats
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-2xl font-bold text-cyan-400 mb-1"
          >
            {formatNumber(stats.totalViews)}
          </motion.div>
          <div className="text-xs text-slate-400">Total Views</div>
        </div>

        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-2xl font-bold text-green-400 mb-1"
          >
            {stats.totalEngagement}%
          </motion.div>
          <div className="text-xs text-slate-400">Avg Engagement</div>
        </div>

        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-2xl font-bold text-orange-400 mb-1"
          >
            {stats.activeProjects}
          </motion.div>
          <div className="text-xs text-slate-400">Active Projects</div>
        </div>

        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-2xl font-bold text-purple-400 mb-1"
          >
            {stats.completionRate}%
          </motion.div>
          <div className="text-xs text-slate-400">Success Rate</div>
        </div>
      </div>
    </div>
  );
};
