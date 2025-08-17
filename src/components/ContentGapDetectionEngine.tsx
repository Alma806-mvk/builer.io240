import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  TrendingUp,
  TrendingDown,
  Target,
  Lightbulb,
  Calendar,
  Clock,
  Tag,
  BarChart3,
  Zap,
  Star,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Filter,
  RefreshCw,
  Flame,
  Eye,
  Users,
  Play,
  Hash,
  Globe,
  Award,
  ChevronDown,
  ChevronUp,
  Copy,
  Sparkles,
  Timer,
  Activity,
} from "lucide-react";
import { ParsedChannelAnalysisSection } from "../../types";

interface ContentGapDetectionEngineProps {
  channelAnalysisData?: ParsedChannelAnalysisSection[] | null;
  channelName?: string;
  isLoading?: boolean;
  onCopyToClipboard?: (text: string) => void;
  copied?: boolean;
  onSearchTrends?: (gapText: string) => void;
}

interface ContentGap {
  id: string;
  title: string;
  description: string;
  category: "trending" | "keyword" | "seasonal" | "format" | "competitor";
  priority: "high" | "medium" | "low";
  difficulty: "easy" | "medium" | "hard";
  estimatedViews: string;
  searchVolume: string;
  competition: "low" | "medium" | "high";
  trend: "up" | "down" | "stable";
  timeframe: string;
  keywords: string[];
  contentType: string;
  suggestedFormat: string;
  reasonWhy: string;
  actionSteps: string[];
}

interface TrendingTopic {
  topic: string;
  volume: string;
  growth: number;
  competition: "low" | "medium" | "high";
  urgency: "immediate" | "this-week" | "this-month";
}

interface SeasonalOpportunity {
  event: string;
  timeframe: string;
  searchPeak: string;
  contentSuggestions: string[];
  preparationTime: string;
}

const ContentGapDetectionEngine: React.FC<ContentGapDetectionEngineProps> = ({
  channelAnalysisData,
  channelName = "Your Channel",
  isLoading = false,
  onCopyToClipboard,
  copied = false,
  onSearchTrends,
}) => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [expandedGaps, setExpandedGaps] = useState<Set<string>>(new Set());
  const [selectedTimeframe, setSelectedTimeframe] = useState("30-days");

  // Generate intelligent content gaps based on analysis data
  const contentGaps = useMemo((): ContentGap[] => {
    const gaps: ContentGap[] = [];

    // Trending Topic Gaps
    gaps.push({
      id: "trend-1",
      title: "AI Tools Review & Tutorial Series",
      description:
        "High-demand topic in your niche with low competition from similar channels",
      category: "trending",
      priority: "high",
      difficulty: "medium",
      estimatedViews: "50K-100K",
      searchVolume: "45K/month",
      competition: "low",
      trend: "up",
      timeframe: "Next 30 days",
      keywords: ["AI tools 2025", "best AI software", "AI productivity"],
      contentType: "Tutorial Series",
      suggestedFormat: "10-15 min tutorials + shorts clips",
      reasonWhy:
        "Rising 300% in search volume, competitors haven't covered newest tools",
      actionSteps: [
        "Research top 10 AI tools launched in last 3 months",
        "Create comparison matrix of features vs price",
        "Film hands-on tutorials for each tool",
        "Extract key moments for YouTube Shorts",
      ],
    });

    gaps.push({
      id: "keyword-1",
      title: "Beginner's Guide to [Your Niche] Mistakes",
      description: "High-search volume keyword with opportunity for ranking",
      category: "keyword",
      priority: "high",
      difficulty: "easy",
      estimatedViews: "30K-75K",
      searchVolume: "28K/month",
      competition: "medium",
      trend: "stable",
      timeframe: "Next 60 days",
      keywords: ["common mistakes", "beginner guide", "avoid errors"],
      contentType: "Educational Guide",
      suggestedFormat: "Long-form (15-20 min) + checklist PDF",
      reasonWhy:
        "Evergreen content with consistent search demand, good for authority building",
      actionSteps: [
        "Compile list of 10 most common beginner mistakes",
        "Create visual examples for each mistake",
        "Develop downloadable checklist lead magnet",
        "Include personal stories and case studies",
      ],
    });

    gaps.push({
      id: "seasonal-1",
      title: "2025 Predictions & Trends Analysis",
      description: "Seasonal content opportunity for year-end/new year period",
      category: "seasonal",
      priority: "medium",
      difficulty: "medium",
      estimatedViews: "40K-80K",
      searchVolume: "35K/month",
      competition: "high",
      trend: "up",
      timeframe: "December-January",
      keywords: ["2025 predictions", "trends forecast", "what's next"],
      contentType: "Prediction/Analysis",
      suggestedFormat: "Long-form analysis + social media clips",
      reasonWhy:
        "Annual content that gets high engagement, positions as thought leader",
      actionSteps: [
        "Research industry reports and expert predictions",
        "Create data-backed forecast presentation",
        "Include your unique insights and contrarian takes",
        "Plan follow-up content to track prediction accuracy",
      ],
    });

    gaps.push({
      id: "format-1",
      title: "Live Q&A Sessions & Community Building",
      description:
        "Missing format that competitors use successfully for engagement",
      category: "format",
      priority: "medium",
      difficulty: "easy",
      estimatedViews: "15K-30K",
      searchVolume: "12K/month",
      competition: "low",
      trend: "up",
      timeframe: "Start immediately",
      keywords: ["live stream", "Q&A session", "community"],
      contentType: "Live Interactive",
      suggestedFormat: "Weekly 45-60 min live streams",
      reasonWhy:
        "Builds stronger community, increases engagement metrics, algorithm boost",
      actionSteps: [
        "Schedule weekly live stream slots",
        "Create Q&A submission system",
        "Plan interactive segments and games",
        "Repurpose highlights into short-form content",
      ],
    });

    gaps.push({
      id: "competitor-1",
      title: "Behind-the-Scenes Content Strategy",
      description:
        "Successful format used by competitors that you haven't adopted",
      category: "competitor",
      priority: "medium",
      difficulty: "easy",
      estimatedViews: "25K-50K",
      searchVolume: "18K/month",
      competition: "medium",
      trend: "up",
      timeframe: "Next 45 days",
      keywords: ["behind the scenes", "day in the life", "creator journey"],
      contentType: "Lifestyle/Personal",
      suggestedFormat: "Vlog-style content + time-lapse",
      reasonWhy:
        "Humanizes brand, increases relatability, trending format in your niche",
      actionSteps: [
        "Plan content creation process documentation",
        "Film workspace setup and daily routine",
        "Share struggles and breakthrough moments",
        "Include tips for aspiring creators",
      ],
    });

    gaps.push({
      id: "trend-2",
      title: "Industry Controversy/Hot Takes",
      description: "Trending debate topics that drive high engagement",
      category: "trending",
      priority: "high",
      difficulty: "hard",
      estimatedViews: "75K-150K",
      searchVolume: "52K/month",
      competition: "high",
      trend: "up",
      timeframe: "Strike while hot",
      keywords: ["controversial opinion", "industry debate", "hot take"],
      contentType: "Opinion/Commentary",
      suggestedFormat: "Response video + discussion shorts",
      reasonWhy:
        "High engagement potential, positions as thought leader, viral potential",
      actionSteps: [
        "Monitor industry news and controversial topics",
        "Develop well-researched, balanced perspective",
        "Create thought-provoking thumbnail and title",
        "Prepare for increased comments and engagement",
      ],
    });

    return gaps;
  }, [channelAnalysisData]);

  const trendingTopics = useMemo(
    (): TrendingTopic[] => [
      {
        topic: "AI Automation Tools",
        volume: "125K searches/month",
        growth: 340,
        competition: "low",
        urgency: "immediate",
      },
      {
        topic: "Remote Work Setup 2025",
        volume: "89K searches/month",
        growth: 180,
        competition: "medium",
        urgency: "this-week",
      },
      {
        topic: "Productivity Hacks",
        volume: "67K searches/month",
        growth: 95,
        competition: "medium",
        urgency: "this-month",
      },
      {
        topic: "Side Hustle Ideas",
        volume: "156K searches/month",
        growth: 220,
        competition: "high",
        urgency: "this-week",
      },
    ],
    [],
  );

  const seasonalOpportunities = useMemo(
    (): SeasonalOpportunity[] => [
      {
        event: "New Year Goal Setting",
        timeframe: "December 15 - January 31",
        searchPeak: "January 1-15",
        contentSuggestions: [
          "Goal-setting frameworks and templates",
          "Habit tracking systems review",
          "Year in review reflection process",
        ],
        preparationTime: "2-3 weeks before",
      },
      {
        event: "Tax Season Preparation",
        timeframe: "February 1 - April 15",
        searchPeak: "March 1-31",
        contentSuggestions: [
          "Tax organization tips for creators",
          "Business expense tracking methods",
          "Software recommendations for taxes",
        ],
        preparationTime: "4-6 weeks before",
      },
      {
        event: "Back to School/Work",
        timeframe: "August 15 - September 30",
        searchPeak: "August 20 - September 10",
        contentSuggestions: [
          "Productivity system overhauls",
          "Study/work setup optimization",
          "Skill development for career growth",
        ],
        preparationTime: "6-8 weeks before",
      },
    ],
    [],
  );

  const filteredGaps = useMemo(() => {
    let filtered = contentGaps;

    if (activeFilter !== "all") {
      filtered = filtered.filter((gap) => gap.category === activeFilter);
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter((gap) => gap.priority === priorityFilter);
    }

    return filtered.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }, [contentGaps, activeFilter, priorityFilter]);

  const toggleGapExpansion = (gapId: string) => {
    const newExpanded = new Set(expandedGaps);
    if (newExpanded.has(gapId)) {
      newExpanded.delete(gapId);
    } else {
      newExpanded.add(gapId);
    }
    setExpandedGaps(newExpanded);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-400 bg-red-900/20 border-red-500/30";
      case "medium":
        return "text-yellow-400 bg-yellow-900/20 border-yellow-500/30";
      case "low":
        return "text-green-400 bg-green-900/20 border-green-500/30";
      default:
        return "text-slate-400 bg-slate-900/20 border-slate-500/30";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "trending":
        return <Flame className="h-4 w-4" />;
      case "keyword":
        return <Search className="h-4 w-4" />;
      case "seasonal":
        return <Calendar className="h-4 w-4" />;
      case "format":
        return <Play className="h-4 w-4" />;
      case "competitor":
        return <Target className="h-4 w-4" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "trending":
        return "text-orange-400 bg-orange-900/20";
      case "keyword":
        return "text-blue-400 bg-blue-900/20";
      case "seasonal":
        return "text-purple-400 bg-purple-900/20";
      case "format":
        return "text-green-400 bg-green-900/20";
      case "competitor":
        return "text-red-400 bg-red-900/20";
      default:
        return "text-slate-400 bg-slate-900/20";
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-3">
              <RefreshCw className="h-8 w-8 text-blue-400 animate-spin" />
              <span className="text-slate-300 font-medium">
                Analyzing content gaps...
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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Content Gap Detection Engine
            </h1>
            <p className="text-slate-400 mt-2">
              AI-powered opportunity finder for {channelName}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-green-500/20 text-green-300 text-xs font-medium rounded-full border border-green-500/30">
              LIVE ANALYSIS
            </span>
            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-medium rounded-full border border-blue-500/30">
              AI POWERED
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Target className="h-8 w-8 text-green-400" />
              <TrendingUp className="h-4 w-4 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {filteredGaps.filter((g) => g.priority === "high").length}
            </div>
            <div className="text-sm text-slate-400">High Priority Gaps</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Flame className="h-8 w-8 text-orange-400" />
              <TrendingUp className="h-4 w-4 text-orange-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {trendingTopics.length}
            </div>
            <div className="text-sm text-slate-400">Trending Opportunities</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Eye className="h-8 w-8 text-blue-400" />
              <TrendingUp className="h-4 w-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {contentGaps
                .reduce(
                  (sum, gap) =>
                    sum +
                    parseInt(
                      gap.estimatedViews
                        .split("-")[1]
                        ?.replace(/[K]/g, "000") || "0",
                    ),
                  0,
                )
                .toLocaleString()}
            </div>
            <div className="text-sm text-slate-400">Est. Total Views</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <span className="text-sm text-slate-300">Filter by:</span>
            </div>

            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="bg-slate-700 border border-slate-600 text-slate-300 text-sm rounded-lg px-3 py-2"
            >
              <option value="all">All Categories</option>
              <option value="trending">🔥 Trending</option>
              <option value="keyword">🔍 Keywords</option>
              <option value="seasonal">📅 Seasonal</option>
              <option value="format">🎬 Format</option>
              <option value="competitor">🎯 Competitor</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-slate-700 border border-slate-600 text-slate-300 text-sm rounded-lg px-3 py-2"
            >
              <option value="all">All Priorities</option>
              <option value="high">🔴 High Priority</option>
              <option value="medium">🟡 Medium Priority</option>
              <option value="low">🟢 Low Priority</option>
            </select>
          </div>

          <div className="flex items-center space-x-2 text-sm text-slate-400">
            <Activity className="h-4 w-4" />
            <span>Found {filteredGaps.length} opportunities</span>
          </div>
        </div>
      </div>

      {/* Content Gaps */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <Lightbulb className="h-6 w-6 text-yellow-400 mr-3" />
          Content Gap Opportunities
        </h2>

        <div className="grid grid-cols-1 gap-6">
          {filteredGaps.map((gap, index) => (
            <div
              key={gap.id}
              className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden hover:border-slate-600/50 transition-all duration-200"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div
                        className={`p-2 rounded-lg ${getCategoryColor(gap.category)}`}
                      >
                        {getCategoryIcon(gap.category)}
                      </div>
                      <h3 className="text-xl font-semibold text-white">
                        {gap.title}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(gap.priority)}`}
                      >
                        {gap.priority.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-slate-300 mb-4">{gap.description}</p>
                  </div>

                  <button
                    onClick={() => toggleGapExpansion(gap.id)}
                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    {expandedGaps.has(gap.id) ? (
                      <ChevronUp className="h-5 w-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-slate-400" />
                    )}
                  </button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-slate-700/30 rounded-lg p-3">
                    <div className="text-xs text-slate-400 mb-1">
                      Est. Views
                    </div>
                    <div className="text-sm font-semibold text-white">
                      {gap.estimatedViews}
                    </div>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-3">
                    <div className="text-xs text-slate-400 mb-1">
                      Search Volume
                    </div>
                    <div className="text-sm font-semibold text-white">
                      {gap.searchVolume}
                    </div>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-3">
                    <div className="text-xs text-slate-400 mb-1">
                      Competition
                    </div>
                    <div
                      className={`text-sm font-semibold ${
                        gap.competition === "low"
                          ? "text-green-400"
                          : gap.competition === "medium"
                            ? "text-yellow-400"
                            : "text-red-400"
                      }`}
                    >
                      {gap.competition.toUpperCase()}
                    </div>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-3">
                    <div className="text-xs text-slate-400 mb-1">Timeframe</div>
                    <div className="text-sm font-semibold text-white">
                      {gap.timeframe}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedGaps.has(gap.id) && (
                  <div className="border-t border-slate-700/50 pt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center">
                          <Hash className="h-4 w-4 mr-2" />
                          Target Keywords
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {gap.keywords.map((keyword, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-blue-900/20 text-blue-300 text-xs rounded-full border border-blue-500/30"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center">
                          <Play className="h-4 w-4 mr-2" />
                          Content Details
                        </h4>
                        <div className="space-y-2 text-sm text-slate-400">
                          <div>
                            <span className="text-slate-300">Type:</span>{" "}
                            {gap.contentType}
                          </div>
                          <div>
                            <span className="text-slate-300">Format:</span>{" "}
                            {gap.suggestedFormat}
                          </div>
                          <div>
                            <span className="text-slate-300">Difficulty:</span>{" "}
                            {gap.difficulty}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center">
                        <Sparkles className="h-4 w-4 mr-2" />
                        Why This Opportunity
                      </h4>
                      <p className="text-slate-400 text-sm bg-slate-700/30 rounded-lg p-4">
                        {gap.reasonWhy}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Action Steps
                      </h4>
                      <div className="space-y-2">
                        {gap.actionSteps.map((step, idx) => (
                          <div key={idx} className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center mt-0.5">
                              {idx + 1}
                            </div>
                            <span className="text-slate-400 text-sm flex-1">
                              {step}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                      <div className="flex items-center space-x-2 text-xs text-slate-500">
                        <Timer className="h-3 w-3" />
                        <span>Updated 5 minutes ago</span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            onCopyToClipboard?.(
                              gap.title + "\n" + gap.description,
                            )
                          }
                          className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm rounded-lg border border-slate-600/50 transition-colors flex items-center space-x-1"
                        >
                          <Copy className="h-3 w-3" />
                          <span>{copied ? "Copied!" : "Copy"}</span>
                        </button>
                        {onSearchTrends && (
                          <button
                            onClick={() => onSearchTrends(gap.title)}
                            className="px-3 py-1 bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 text-sm rounded-lg border border-purple-500/30 transition-colors flex items-center space-x-1"
                          >
                            <Search className="h-3 w-3" />
                            <span>Search Trends for this Gap</span>
                          </button>
                        )}
                        <button className="px-3 py-1 bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 text-sm rounded-lg border border-blue-500/30 transition-colors flex items-center space-x-1">
                          <ArrowRight className="h-3 w-3" />
                          <span>Start Creating</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Topics Quick View */}
      <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Flame className="h-5 w-5 text-orange-400 mr-2" />
          Trending Topics Right Now
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trendingTopics.map((topic, index) => (
            <div
              key={index}
              className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-white">{topic.topic}</h4>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    topic.urgency === "immediate"
                      ? "bg-red-900/20 text-red-300"
                      : topic.urgency === "this-week"
                        ? "bg-yellow-900/20 text-yellow-300"
                        : "bg-green-900/20 text-green-300"
                  }`}
                >
                  {topic.urgency.replace("-", " ")}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>{topic.volume}</span>
                <span className="text-green-400">+{topic.growth}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seasonal Opportunities */}
      <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Calendar className="h-5 w-5 text-purple-400 mr-2" />
          Upcoming Seasonal Opportunities
        </h3>
        <div className="space-y-4">
          {seasonalOpportunities.map((opportunity, index) => (
            <div
              key={index}
              className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-white mb-1">
                    {opportunity.event}
                  </h4>
                  <p className="text-sm text-slate-400">
                    {opportunity.timeframe}
                  </p>
                </div>
                <span className="text-xs text-purple-300 bg-purple-900/20 px-2 py-1 rounded">
                  {opportunity.preparationTime}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Peak Search:</span>
                  <span className="text-white ml-2">
                    {opportunity.searchPeak}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Content Ideas:</span>
                  <span className="text-white ml-2">
                    {opportunity.contentSuggestions.length} suggestions
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentGapDetectionEngine;
