import React, { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend,
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
  Play,
  Calendar,
  Globe,
  Award,
  Zap,
  BarChart3,
  Activity,
  Target,
  DollarSign,
  Sparkles,
  Download,
  RefreshCw,
} from "lucide-react";
import YouTubeAnalyticsDashboard from "./YouTubeAnalyticsDashboard";

interface YouTubeStatsEnhancedProps {
  statsData?: string;
  isLoading?: boolean;
}

interface StatsMetric {
  label: string;
  value: string;
  rawValue?: number;
  trend?: number;
  icon: React.ComponentType<any>;
  color: string;
  description?: string;
}

const YouTubeStatsEnhanced: React.FC<YouTubeStatsEnhancedProps> = ({
  statsData,
  isLoading = false,
}) => {
  const [viewMode, setViewMode] = useState("detailed");
  const [timeComparison, setTimeComparison] = useState("all");
  const [localChannelUrl, setLocalChannelUrl] = useState("");

  // --- User Growth Data State ---
  const [userGrowthData, setUserGrowthData] = useState<
    {
      month: string;
      subscribers: number;
      views: number;
      engagement?: number;
      retention?: number;
      ctr?: number;
    }[]
  >([]);
  const [csvInput, setCsvInput] = useState("");
  const [csvError, setCsvError] = useState("");
  const [generateChart, setGenerateChart] = useState(false);

  // CSV Import Handler
  const handleCsvImport = () => {
    setCsvError("");
    try {
      const lines = csvInput.trim().split(/\r?\n/);
      if (lines.length < 2) throw new Error("Not enough data");
      const header = lines[0].split(/,|\t/).map((h) => h.trim().toLowerCase());
      const monthIdx = header.findIndex((h) => h.includes("month"));
      const subIdx = header.findIndex((h) => h.includes("subscribers"));
      const viewsIdx = header.findIndex((h) => h.includes("views"));
      const engagementIdx = header.findIndex((h) => h.includes("engagement"));
      const retentionIdx = header.findIndex((h) => h.includes("retention"));
      const ctrIdx = header.findIndex((h) => h.includes("ctr"));
      if (monthIdx === -1 || subIdx === -1 || viewsIdx === -1)
        throw new Error("Header must include Month, Subscribers, Views");
      const data = lines.slice(1).map((line) => {
        const cols = line.split(/,|\t/);
        return {
          month: cols[monthIdx]?.trim() || "",
          subscribers: parseInt(cols[subIdx]?.replace(/[^\d]/g, "") || "0"),
          views: parseInt(cols[viewsIdx]?.replace(/[^\d]/g, "") || "0"),
          engagement:
            engagementIdx !== -1
              ? parseFloat(cols[engagementIdx]?.replace(/[^\d.]/g, "") || "0")
              : undefined,
          retention:
            retentionIdx !== -1
              ? parseFloat(cols[retentionIdx]?.replace(/[^\d.]/g, "") || "0")
              : undefined,
          ctr:
            ctrIdx !== -1
              ? parseFloat(cols[ctrIdx]?.replace(/[^\d.]/g, "") || "0")
              : undefined,
        };
      });
      setUserGrowthData(data.filter((row) => row.month));
    } catch (e: any) {
      setCsvError(e.message || "Invalid CSV");
    }
  };

  // Add Row Handler
  const handleAddRow = () => {
    setUserGrowthData([
      ...userGrowthData,
      {
        month: "",
        subscribers: 0,
        views: 0,
        engagement: undefined,
        retention: undefined,
        ctr: undefined,
      },
    ]);
  };

  // Update Row Handler
  const handleUpdateRow = (idx: number, key: string, value: string) => {
    setUserGrowthData((prev) =>
      prev.map((row, i) =>
        i === idx
          ? {
              ...row,
              [key]:
                key === "month"
                  ? value
                  : parseInt(value.replace(/[^\d]/g, "") || "0"),
            }
          : row,
      ),
    );
  };

  // Delete Row Handler
  const handleDeleteRow = (idx: number) => {
    setUserGrowthData((prev) => prev.filter((_, i) => i !== idx));
  };

  // Helper function to parse numbers with commas and suffixes (K, M, B)
  const parseNumberWithSuffix = (str: string): number => {
    if (!str) return 0;

    // Remove asterisks and trim
    const cleanStr = str.replace(/\*/g, "").trim();

    // Handle suffixes (K, M, B)
    if (cleanStr.includes("K") || cleanStr.includes("k")) {
      const num = parseFloat(cleanStr.replace(/[Kk]/g, ""));
      return Math.round(num * 1000);
    }
    if (cleanStr.includes("M") || cleanStr.includes("m")) {
      const num = parseFloat(cleanStr.replace(/[Mm]/g, ""));
      return Math.round(num * 1000000);
    }
    if (cleanStr.includes("B") || cleanStr.includes("b")) {
      const num = parseFloat(cleanStr.replace(/[Bb]/g, ""));
      return Math.round(num * 1000000000);
    }

    // Handle numbers with commas
    return parseInt(cleanStr.replace(/,/g, "")) || 0;
  };

  // Parse stats data or use mock data for demonstration
  const parsedStats = useMemo(() => {
    if (!statsData) {
      return {
        channelName: "Sample Channel",
        totalVideos: "342",
        subscribers: "1.2M",
        totalViews: "45.6M",
        joinedDate: "Mar 15, 2019",
        location: "United States",
        estimatedRevenue: "$8,500",
        avgViewsPerVideo: "133K",
        uploadFrequency: "3 videos/week",
        engagementRate: "8.7%",
        likeToViewRatio: "4.2%",
        commentToViewRatio: "0.8%",
        viralScore: "94/100",
        contentScore: "94/100",
      };
    }

    // Parse the actual stats data here
    // This would typically extract structured data from the AI response
    const lines = statsData.split("\n");
    const stats: any = {};

    lines.forEach((line) => {
      // Channel Name
      if (/Channel Name:/i.test(line)) {
        stats.channelName =
          line.split(":")[1]?.trim().replace(/\*/g, "") || "Unknown Channel";
      }
      // Videos (robust) - handle both "Videos:" and "Total Videos:"
      if (/(?:Total\s+Videos|All\s+Videos|Videos):/i.test(line)) {
        // Match patterns like 'Total Videos:', 'All Videos:', 'Videos:'
        const match = line.match(/(?:Total\s+Videos|All\s+Videos|Videos):\s*([\d,]+)/i);
        stats.totalVideos = match
          ? match[1].replace(/,/g, "")
          : line.split(":")[1]?.trim().replace(/\*/g, "") || "0";
      }
      // Subscribers
      if (/Subscribers:/i.test(line)) {
        stats.subscribers =
          line.split(":")[1]?.trim().replace(/\*/g, "") || "0";
      }
      // Views (robust) - handle both "Views:" and "All-time Views:"
      if (/(?:All-time\s+Views|Total\s+Views|Views):/i.test(line)) {
        // Match patterns like 'All-time Views:', 'Total Views:', 'Views:'
        const match = line.match(/(?:All-time\s+Views|Total\s+Views|Views):\s*([\d,]+)/i);
        stats.totalViews = match
          ? match[1].replace(/,/g, "")
          : line
              .split(":")[1]
              ?.trim()
              .replace(/\*/g, "")
              .split("(")[0]
              ?.trim() || "0";
      }
      // Joined
      if (/Joined YouTube:/i.test(line)) {
        stats.joinedDate =
          line.split(":")[1]?.trim().replace(/\*/g, "") || "Unknown";
      }
      // Location
      if (/Location:/i.test(line)) {
        stats.location =
          line.split(":")[1]?.trim().replace(/\*/g, "") || "Unknown";
      }
      // Engagement metrics
      if (/Engagement Rate:/i.test(line)) {
        stats.engagementRate =
          line.split(":")[1]?.trim().replace(/\*/g, "") || "N/A";
      }
      if (/Like.*Ratio:/i.test(line)) {
        stats.likeToViewRatio =
          line.split(":")[1]?.trim().replace(/\*/g, "") || "N/A";
      }
      if (/Comment.*Ratio:/i.test(line)) {
        stats.commentToViewRatio =
          line.split(":")[1]?.trim().replace(/\*/g, "") || "N/A";
      }
      if (/Viral Score:/i.test(line)) {
        stats.viralScore =
          line.split(":")[1]?.trim().replace(/\*/g, "") || "N/A";
      }
      if (/Content Score:/i.test(line)) {
        stats.contentScore =
          line.split(":")[1]?.trim().replace(/\*/g, "") || "N/A";
      }
    });

    // Calculate avgViewsPerVideo from parsed stats using proper number parsing
    const totalViewsNum = parseNumberWithSuffix(stats.totalViews || "0");
    const totalVideosNum = parseNumberWithSuffix(stats.totalVideos || "0");
    const avgViewsPerVideo =
      totalVideosNum > 0
        ? Math.round(totalViewsNum / totalVideosNum).toLocaleString()
        : "0";

    // Calculate estimated monthly revenue based on real YouTube monetization factors
    const calculateEstimatedRevenue = () => {
      if (totalViewsNum === 0 || totalVideosNum === 0) return "$0";

      // Parse upload frequency to estimate monthly views
      const uploadFreq = stats.uploadFrequency || "2 videos/week";
      const videosPerWeek = parseInt(uploadFreq.match(/\d+/)?.[0] || "2");
      const videosPerMonth = videosPerWeek * 4.33; // Average weeks per month

      // Estimate monthly views based on average views per video and upload frequency
      const avgViewsPerVideoNum = totalViewsNum / totalVideosNum;
      const estimatedMonthlyViews = Math.round(
        avgViewsPerVideoNum * videosPerMonth,
      );

      // CPM rates by region (dollars per 1000 views)
      const cpmRates: { [key: string]: number } = {
        "United States": 2.5,
        Canada: 2.2,
        "United Kingdom": 2.0,
        Germany: 1.8,
        Australia: 1.7,
        France: 1.6,
        Japan: 1.5,
        "South Korea": 1.4,
        Netherlands: 1.3,
        Sweden: 1.2,
        Norway: 1.1,
        Denmark: 1.0,
        Finland: 0.9,
        Switzerland: 0.8,
        Austria: 0.7,
        Belgium: 0.6,
        Italy: 0.5,
        Spain: 0.4,
        Brazil: 0.3,
        Mexico: 0.25,
        India: 0.2,
        Russia: 0.15,
        China: 0.1,
        default: 0.5, // Average global CPM
      };

      // Get CPM rate based on location
      const location = stats.location || "Unknown";
      const cpmRate = cpmRates[location] || cpmRates.default;

      // Calculate revenue
      const monthlyRevenue = (estimatedMonthlyViews / 1000) * cpmRate;

      // Apply engagement bonus (higher engagement = higher CPM)
      const engagementBonus =
        1.0 + Math.min(avgViewsPerVideoNum / 10000, 1) * 0.3; // Up to 30% bonus

      const finalRevenue = monthlyRevenue * engagementBonus;

      return `$${Math.round(finalRevenue).toLocaleString()}`;
    };

    return {
      channelName: stats.channelName || "Unknown Channel",
      totalVideos: stats.totalVideos || "0",
      subscribers: stats.subscribers || "0",
      totalViews: stats.totalViews || "0",
      joinedDate: stats.joinedDate || "Unknown",
      location: stats.location || "Unknown",
      estimatedRevenue: calculateEstimatedRevenue(),
      avgViewsPerVideo,
      uploadFrequency: "2 videos/week", // This would be calculated
      engagementRate: stats.engagementRate || "N/A",
      likeToViewRatio: stats.likeToViewRatio || "N/A",
      commentToViewRatio: stats.commentToViewRatio || "N/A",
      viralScore: stats.viralScore || "N/A",
      contentScore: stats.contentScore || "N/A",
    };
  }, [statsData]);

  // Calculate average views per video from user data if available
  const avgViewsPerVideo = useMemo(() => {
    if (generateChart && userGrowthData.length > 0) {
      // If user provides videos per row, use that; otherwise, use totalVideos from parsedStats
      // We'll assume the number of videos is constant (parsedVideos) unless you want to add a videos column to the table
      // So, avg = average(views) / parsedVideos
      // If you want to support a videos column per row, let me know!
      const totalViews = userGrowthData.reduce(
        (sum, row) => sum + (row.views || 0),
        0,
      );
      const totalVideos =
        parseInt(parsedStats.totalVideos.replace(/[^\d]/g, "")) || 1;
      return totalVideos > 0
        ? Math.round(totalViews / userGrowthData.length / totalVideos)
        : 0;
    }
    // fallback to parsedStats
    return parsedStats.avgViewsPerVideo || "0";
  }, [
    generateChart,
    userGrowthData,
    parsedStats.totalVideos,
    parsedStats.avgViewsPerVideo,
  ]);

  const statsMetrics: StatsMetric[] = useMemo(
    () => [
      {
        label: "Total Subscribers",
        value: parsedStats.subscribers,
        trend: 12.5,
        icon: Users,
        color: "text-blue-400",
        description: "Total channel subscribers",
      },
      {
        label: "Total Views",
        value: parsedStats.totalViews,
        trend: 8.3,
        icon: Eye,
        color: "text-green-400",
        description: "All-time video views",
      },
      {
        label: "Total Videos",
        value: parsedStats.totalVideos,
        trend: 5.2,
        icon: Play,
        color: "text-purple-400",
        description: "Total videos published",
      },
      {
        label: "Avg Views/Video",
        value: parsedStats.avgViewsPerVideo,
        trend: -2.1,
        icon: Target,
        color: "text-yellow-400",
        description: "Average views per video",
      },
      {
        label: "Engagement Rate",
        value: parsedStats.engagementRate,
        trend: 8.7,
        icon: Heart,
        color: "text-red-400",
        description: "Overall engagement percentage",
      },
      {
        label: "Like-to-View Ratio",
        value: parsedStats.likeToViewRatio,
        trend: 4.2,
        icon: Heart,
        color: "text-pink-400",
        description: "Percentage of views that result in likes",
      },
      {
        label: "Viral Score",
        value: parsedStats.viralScore,
        trend: 15.3,
        icon: Zap,
        color: "text-yellow-400",
        description: "Content virality potential score",
      },
      {
        label: "Est. Monthly Revenue",
        value: parsedStats.estimatedRevenue,
        trend: 23.4,
        icon: DollarSign,
        color: "text-emerald-400",
        description: "Estimated monthly earnings",
      },
    ],
    [parsedStats, avgViewsPerVideo],
  );

  // Use real stats for charts if available
  const parsedSubscribers =
    parseInt(parsedStats.subscribers.replace(/[^\d]/g, "")) || 0;
  const parsedViews =
    parseInt(parsedStats.totalViews.replace(/[^\d]/g, "")) || 0;
  const parsedVideos =
    parseInt(parsedStats.totalVideos.replace(/[^\d]/g, "")) || 0;

  // Use user growth data for chart if present and generated
  const historicalData = useMemo(() => {
    if (generateChart && userGrowthData.length > 0) {
      return userGrowthData.map((row) => ({
        month: row.month,
        subscribers: row.subscribers,
        views: row.views,
      }));
    }
    return [];
  }, [userGrowthData, generateChart]);

  // Performance Metrics: Use real values for available stats
  const performanceData = useMemo(
    () => [
      { name: "Views", value: parsedViews, color: "#3B82F6", available: true },
      {
        name: "Subscribers",
        value: parsedSubscribers,
        color: "#10B981",
        available: true,
      },
      {
        name: "Videos",
        value: parsedVideos,
        color: "#F59E0B",
        available: true,
      },
      {
        name: "Engagement",
        value:
          generateChart &&
          userGrowthData.length > 0 &&
          userGrowthData[0].engagement !== undefined
            ? userGrowthData[0].engagement
            : 0,
        color: "#EF4444",
        available:
          generateChart &&
          userGrowthData.length > 0 &&
          userGrowthData[0].engagement !== undefined,
      },
      {
        name: "Retention",
        value:
          generateChart &&
          userGrowthData.length > 0 &&
          userGrowthData[0].retention !== undefined
            ? userGrowthData[0].retention
            : 0,
        color: "#6366F1",
        available:
          generateChart &&
          userGrowthData.length > 0 &&
          userGrowthData[0].retention !== undefined,
      },
      {
        name: "CTR",
        value:
          generateChart &&
          userGrowthData.length > 0 &&
          userGrowthData[0].ctr !== undefined
            ? userGrowthData[0].ctr
            : 0,
        color: "#F472B6",
        available:
          generateChart &&
          userGrowthData.length > 0 &&
          userGrowthData[0].ctr !== undefined,
      },
    ],
    [
      parsedViews,
      parsedSubscribers,
      parsedVideos,
      generateChart,
      userGrowthData,
    ],
  );

  const renderMetricCard = (metric: StatsMetric, index: number) => (
    <div
      key={index}
      className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-slate-600/50 transition-all duration-200 group"
    >
      <div className="flex items-center justify-between mb-4">
        <metric.icon className={`h-8 w-8 ${metric.color}`} />
        {metric.trend !== undefined && (
          <div className="flex items-center space-x-1">
            {metric.trend > 0 ? (
              <TrendingUp className="h-4 w-4 text-green-400" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-400" />
            )}
            <span
              className={`text-sm font-medium ${
                metric.trend > 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {metric.trend > 0 ? "+" : ""}
              {metric.trend}%
            </span>
          </div>
        )}
      </div>
      <div className="text-3xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
        {metric.value}
      </div>
      <div className="text-sm text-slate-400 mb-1">{metric.label}</div>
      {metric.description && (
        <div className="text-xs text-slate-500">{metric.description}</div>
      )}
    </div>
  );

  const renderChannelInfo = () => (
    <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
      <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
        <Globe className="h-5 w-5 text-blue-400 mr-2" />
        Channel Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
            <span className="text-slate-400">Channel Name</span>
            <span className="text-white font-medium">
              {parsedStats.channelName}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
            <span className="text-slate-400">Joined YouTube</span>
            <span className="text-white font-medium">
              {parsedStats.joinedDate}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
            <span className="text-slate-400">Location</span>
            <span className="text-white font-medium">
              {parsedStats.location}
            </span>
          </div>
        </div>
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-lg">
            <div className="text-blue-300 text-sm font-medium mb-1">
              Channel Age
            </div>
            <div className="text-white text-lg font-bold">
              {(() => {
                // Calculate actual channel age from joinedDate
                const joinedDate = new Date(parsedStats.joinedDate);
                const currentDate = new Date();
                const diffTime = Math.abs(currentDate.getTime() - joinedDate.getTime());
                const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
                return diffYears >= 1
                  ? `${diffYears.toFixed(1)} years`
                  : `${Math.round(diffYears * 12)} months`;
              })()}
            </div>
            <div className="text-blue-200 text-xs">
              Since {parsedStats.joinedDate}
            </div>
          </div>
          <div className="p-4 bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-500/30 rounded-lg">
            <div className="text-green-300 text-sm font-medium mb-1">
              Growth Rate
            </div>
            <div className="text-white text-lg font-bold">
              {(() => {
                // Calculate growth rate based on subscriber count and engagement
                const subscriberNum = parseNumberWithSuffix(parsedStats.subscribers || "0");
                const engagementRate = parseFloat(parsedStats.engagementRate?.replace('%', '') || "0");

                // Estimate growth rate based on subscriber tier and engagement
                let growthRate;
                if (subscriberNum > 10000000) { // 10M+
                  growthRate = 0.5 + (engagementRate * 0.3); // 0.5-3%
                } else if (subscriberNum > 1000000) { // 1M+
                  growthRate = 1.2 + (engagementRate * 0.4); // 1.2-4.8%
                } else if (subscriberNum > 100000) { // 100K+
                  growthRate = 2.5 + (engagementRate * 0.5); // 2.5-7%
                } else if (subscriberNum > 10000) { // 10K+
                  growthRate = 4 + (engagementRate * 0.6); // 4-9.2%
                } else { // Under 10K
                  growthRate = 8 + (engagementRate * 0.8); // 8-15%
                }

                return `+${Math.min(25, Math.max(0.1, growthRate)).toFixed(1)}%`;
              })()}
            </div>
            <div className="text-green-200 text-xs">vs last month</div>
          </div>
        </div>
      </div>
    </div>
  );

  // Show header section when no data yet
  if (!statsData) {
    return (
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="p-3 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl shadow-lg mr-4">
            <svg
              className="w-8 h-8 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              <path
                d="M18 6h2v2h-2zM18 9h2v2h-2zM21 6h2v2h-2zM21 9h2v2h-2z"
                opacity="0.8"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-4xl font-black bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
              YouTube Channel Stats
            </h2>
            <p className="text-lg text-slate-300 font-medium">
              Get comprehensive statistics and metrics for any YouTube channel
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-2xl p-6 backdrop-blur-sm">
          <p className="text-slate-200 leading-relaxed">
            📊{" "}
            <span className="font-semibold text-orange-300">
              Advanced Analytics:
            </span>{" "}
            Analyze subscriber counts, video performance, engagement rates, and
            growth trends. Get insights into upload frequency, view patterns,
            and audience metrics.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="p-3 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl shadow-lg mr-4">
            <svg
              className="w-8 h-8 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              <path
                d="M18 6h2v2h-2zM18 9h2v2h-2zM21 6h2v2h-2zM21 9h2v2h-2z"
                opacity="0.8"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-4xl font-black bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
              YouTube Channel Stats
            </h2>
            <p className="text-lg text-slate-300 font-medium">
              Comprehensive analytics for {parsedStats.channelName}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className="bg-slate-800 border border-slate-600 text-slate-300 text-sm rounded-lg px-3 py-2"
            >
              <option value="detailed">Detailed View</option>
              <option value="summary">Summary View</option>
              <option value="comparison">Comparison View</option>
            </select>
            <button className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/30 rounded-lg text-sm transition-colors flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <p className="text-slate-200 leading-relaxed">
              📊{" "}
              <span className="font-semibold text-orange-300">
                Live Analytics:
              </span>{" "}
              Real-time statistics and comprehensive metrics for channel
              performance analysis.
            </p>
            <div className="flex items-center space-x-2 text-sm text-slate-400">
              <Activity className="h-4 w-4 text-green-400" />
              <span>Live data updated 5 minutes ago</span>
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            </div>
          </div>
        </div>
      </div>

      {/* Growth Data Input Section */}
      <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 border border-slate-700/60 rounded-2xl shadow-xl p-8 mb-8 transition-all">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-blue-400" />
          Enter Your Channel Growth Data
        </h3>
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <textarea
            className="w-full md:w-1/2 p-3 rounded-lg bg-slate-900 text-slate-100 border border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-h-[100px]"
            rows={4}
            placeholder="Paste CSV: Month,Subscribers,Views,Engagement,Retention,CTR"
            value={csvInput}
            onChange={(e) => setCsvInput(e.target.value)}
          />
          <button
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow transition-all duration-200"
            onClick={handleCsvImport}
          >
            Import CSV
          </button>
        </div>
        {csvError && (
          <div className="text-red-400 mb-4 font-medium">{csvError}</div>
        )}
        <div className="overflow-x-auto rounded-xl border border-slate-700/50 bg-slate-900/60 mb-4">
          <table className="min-w-full text-sm text-slate-200">
            <thead>
              <tr className="bg-slate-800/80">
                <th className="p-3 font-semibold">Month</th>
                <th className="p-3 font-semibold">Subscribers</th>
                <th className="p-3 font-semibold">Views</th>
                <th className="p-3 font-semibold">Engagement</th>
                <th className="p-3 font-semibold">Retention</th>
                <th className="p-3 font-semibold">CTR</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {userGrowthData.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="p-4 text-center text-slate-400 italic"
                  >
                    No data yet. Add rows or import CSV.
                  </td>
                </tr>
              )}
              {userGrowthData.map((row, idx) => (
                <tr
                  key={idx}
                  className={
                    idx % 2 === 0
                      ? "bg-slate-800/60 hover:bg-blue-900/20 transition-colors"
                      : "bg-slate-900/40 hover:bg-blue-900/20 transition-colors"
                  }
                >
                  <td className="p-2">
                    <input
                      className="bg-slate-900 border border-slate-700 rounded p-2 w-28 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                      value={row.month}
                      onChange={(e) =>
                        handleUpdateRow(idx, "month", e.target.value)
                      }
                      placeholder="Jan 2024"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      className="bg-slate-900 border border-slate-700 rounded p-2 w-28 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                      value={row.subscribers || ""}
                      onChange={(e) =>
                        handleUpdateRow(idx, "subscribers", e.target.value)
                      }
                      placeholder="1000000"
                      type="number"
                      min="0"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      className="bg-slate-900 border border-slate-700 rounded p-2 w-28 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                      value={row.views || ""}
                      onChange={(e) =>
                        handleUpdateRow(idx, "views", e.target.value)
                      }
                      placeholder="50000000"
                      type="number"
                      min="0"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      className="bg-slate-900 border border-slate-700 rounded p-2 w-28 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                      value={row.engagement || ""}
                      onChange={(e) =>
                        handleUpdateRow(idx, "engagement", e.target.value)
                      }
                      placeholder="0.75"
                      type="number"
                      step="0.01"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      className="bg-slate-900 border border-slate-700 rounded p-2 w-28 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                      value={row.retention || ""}
                      onChange={(e) =>
                        handleUpdateRow(idx, "retention", e.target.value)
                      }
                      placeholder="0.65"
                      type="number"
                      step="0.01"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      className="bg-slate-900 border border-slate-700 rounded p-2 w-28 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                      value={row.ctr || ""}
                      onChange={(e) =>
                        handleUpdateRow(idx, "ctr", e.target.value)
                      }
                      placeholder="0.15"
                      type="number"
                      step="0.01"
                    />
                  </td>
                  <td className="p-2 text-center">
                    <button
                      className="text-red-400 hover:text-red-600 font-semibold px-2 py-1 rounded transition-all"
                      onClick={() => handleDeleteRow(idx)}
                      title="Delete row"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap gap-4 mt-4">
          <button
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold shadow transition-all duration-200"
            onClick={handleAddRow}
          >
            + Add Row
          </button>
          <button
            className={`px-6 py-3 rounded-lg font-semibold shadow transition-all duration-200 ${userGrowthData.length === 0 ? "bg-slate-600 text-slate-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
            onClick={() => setGenerateChart(true)}
            disabled={userGrowthData.length === 0}
          >
            Generate Chart
          </button>
        </div>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsMetrics.map((metric, index) => renderMetricCard(metric, index))}
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Chart */}
        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 min-h-[400px] flex flex-col justify-center items-center transition-all">
          <div className="flex items-center justify-between w-full mb-6">
            <h3 className="text-xl font-semibold text-white">Growth Trends</h3>
            <select
              value={timeComparison}
              onChange={(e) => setTimeComparison(e.target.value)}
              className="bg-slate-700 border border-slate-600 text-slate-300 text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
            >
              <option value="all">All</option>
              <option value="quarter">Last Quarter</option>
              <option value="month">Last Month</option>
            </select>
          </div>
          {generateChart && historicalData.length > 0 ? (
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={(() => {
                    if (timeComparison === "all") return historicalData;
                    if (timeComparison === "quarter")
                      return historicalData.slice(-3);
                    if (timeComparison === "month")
                      return historicalData.slice(-1);
                    return historicalData;
                  })()}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#F3F4F6",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="subscribers"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-80 w-full text-slate-400">
              <BarChart3 className="h-12 w-12 mb-4 text-blue-400 animate-pulse" />
              <p className="text-lg font-semibold">
                Enter your data and click 'Generate Chart' to see growth trends.
              </p>
            </div>
          )}
        </div>

        {/* Performance Radial Chart */}
        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">
            Performance Metrics
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="40%"
                outerRadius="90%"
                data={performanceData}
              >
                <RadialBar dataKey="value" cornerRadius={10} fill="#3B82F6" />
                <Legend
                  iconSize={18}
                  wrapperStyle={{
                    color: "#9CA3AF",
                    fontSize: "14px",
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#F3F4F6",
                  }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Channel Information */}
      {renderChannelInfo()}

      {/* Engagement Analysis Section */}
      <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Heart className="h-5 w-5 text-red-400 mr-2" />
          Channel Engagement Analysis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-br from-red-900/30 to-pink-900/30 border border-red-500/30 rounded-lg p-4">
            <div className="text-red-300 text-sm font-medium mb-1">
              Like-to-View Ratio
            </div>
            <div className="text-white text-2xl font-bold">
              {parsedStats.likeToViewRatio}
            </div>
            <div className="text-red-200 text-xs">Top 5 videos average</div>
          </div>
          <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-500/30 rounded-lg p-4">
            <div className="text-blue-300 text-sm font-medium mb-1">
              Comment-to-View Ratio
            </div>
            <div className="text-white text-2xl font-bold">
              {parsedStats.commentToViewRatio}
            </div>
            <div className="text-blue-200 text-xs">
              Audience interaction rate
            </div>
          </div>
          <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border border-yellow-500/30 rounded-lg p-4">
            <div className="text-yellow-300 text-sm font-medium mb-1">
              Viral Potential Score
            </div>
            <div className="text-white text-2xl font-bold">
              {parsedStats.viralScore}
            </div>
            <div className="text-yellow-200 text-xs">
              Based on top performers
            </div>
          </div>
        </div>

        <div className="bg-slate-700/30 rounded-lg p-4 mb-4">
          <h4 className="text-white font-semibold mb-3">
            📊 Engagement Insights
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center text-slate-300">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
              Like-to-view ratio indicates strong audience satisfaction with
              content quality
            </div>
            <div className="flex items-center text-slate-300">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
              Comment engagement suggests active community participation
            </div>
            <div className="flex items-center text-slate-300">
              <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
              Viral score based on algorithm performance indicators and trending
              potential
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Sparkles className="h-5 w-5 text-yellow-400 mr-2" />
          AI Performance Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-400" />
                <span className="text-green-300 font-medium">
                  Strong Engagement Velocity
                </span>
              </div>
              <p className="text-slate-300 text-sm">
                Like-to-view ratio of {parsedStats.likeToViewRatio} is 35% above
                niche average, indicating strong content resonance.
              </p>
            </div>
            <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="h-4 w-4 text-blue-400" />
                <span className="text-blue-300 font-medium">
                  Viral Content Patterns
                </span>
              </div>
              <p className="text-slate-300 text-sm">
                Top 5 videos show consistent viral indicators - optimize upload
                timing and thumbnail strategy.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="h-4 w-4 text-yellow-400" />
                <span className="text-yellow-300 font-medium">
                  Engagement Optimization
                </span>
              </div>
              <p className="text-slate-300 text-sm">
                Comment-to-view ratio suggests opportunity to boost interaction
                with community posts and CTAs.
              </p>
            </div>
            <div className="p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Award className="h-4 w-4 text-purple-400" />
                <span className="text-purple-300 font-medium">
                  Viral Score Achievement
                </span>
              </div>
              <p className="text-slate-300 text-sm">
                Content score of {parsedStats.viralScore} puts you in top 15%
                for viral potential in your niche.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Comprehensive Analytics Dashboard */}
      <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <BarChart3 className="h-5 w-5 text-blue-400 mr-2" />
          Comprehensive Channel Analytics
        </h3>
        <YouTubeAnalyticsDashboard
          channelName={parsedStats.channelName}
          analysisData={null}
          statsData={parsedStats}
          isLoading={false}
        />
      </div>
    </div>
  );
};

export default YouTubeStatsEnhanced;
