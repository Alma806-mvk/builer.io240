import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendAnalyticsDashboard } from "./TrendAnalyticsDashboard";
import { PremiumTrendAnalysis } from "./PremiumTrendAnalysis";
import EnhancedTrendsSearch from "./EnhancedTrendsSearch";
import { TrendRecommendations } from "./TrendRecommendations";
import { TrendMonitoring } from "./TrendMonitoring";
import { TrendComparison } from "./TrendComparison";
import { TrendReporting } from "./TrendReporting";
import { PremiumUpgrade } from "./PremiumUpgrade";
import {
  TrendingUp,
  TrendingDown,
  Zap,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Calendar,
  Globe,
  Search,
  Filter,
  Download,
  RefreshCw,
  BarChart3,
  Target,
  Clock,
  Award,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Play,
  Hash,
  Star,
} from "lucide-react";

// Import our world-class components
import {
  Button,
  Card,
  Input,
  Badge,
  StatCard,
  QuickActionCard,
  ProgressBar,
  TabHeader,
  GradientText,
} from "./ui/WorldClassComponents";

// Import Deep Analysis hooks and services
import { useDeepAnalysis, useFormattedAnalysis } from "../hooks/useDeepAnalysis";
import { TrendSearchResult } from "../services/enhancedTrendSearchService";
import InteractiveAnalysisControls from "./InteractiveAnalysisControls";
import { useDailyTrends, DailyTrendsData } from "../services/dailyTrendsService";
import { TestDailyTrends } from "./TestDailyTrends";
import { AdvancedFiltersModal, FilterOptions } from "./AdvancedFiltersModal";

interface TrendData {
  id: string;
  keyword: string;
  platform: string;
  volume: number;
  growth: number;
  difficulty: number;
  opportunity: number;
  category: string;
  trending: boolean;
  timeframe: string;
}

interface PlatformTrend {
  platform: string;
  topTrends: string[];
  growth: number;
  engagement: number;
  color: string;
  activeCreators?: number;
  avgViews?: number;
  contentTypes?: string[];
  bestPostingTimes?: string[];
  audienceDemographics?: {
    primaryAge: string;
    genderSplit: string;
    topCountries: string[];
  };
}

interface TrendsWorldClassProps {
  onAnalyzeTrend?: (keyword: string) => void;
  onExportData?: () => void;
  onRefreshData?: () => void;
  // Comprehensive system props
  trendAnalysis?: any;
  isLoading?: boolean;
  error?: string | null;
  onAnalyzeTrends?: (query: string, filters: any) => void;
  recentQueries?: string[];
  isPremium?: boolean;
  onUpgrade?: () => void;
  initialQuery?: string;
  userPlan?: string;
  platform?: any;
  onNavigateToGenerator?: (content: string) => void;
  onSwitchToGenerator?: (contentType: string, title: string) => void;
  onCopyToClipboard?: (text: string) => void;
  onSendToCalendar?: (idea: any) => void;
  onGenerateContent?: (contentType: string, prompt: string) => void;
  searchResults?: TrendSearchResult[];
  searchQuery?: string;
}

const TrendsWorldClass: React.FC<TrendsWorldClassProps> = ({
  onAnalyzeTrend,
  onExportData,
  onRefreshData,
  // Comprehensive system props
  trendAnalysis,
  isLoading = false,
  error,
  onAnalyzeTrends,
  recentQueries = [],
  isPremium = false,
  onUpgrade,
  initialQuery = "",
  userPlan = "free",
  platform,
  onNavigateToGenerator,
  onSwitchToGenerator,
  onCopyToClipboard,
  onSendToCalendar,
  onGenerateContent,
  searchResults = [],
  searchQuery: propSearchQuery = "",
}) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };
  const [activeView, setActiveView] = useState<"analysis" | "dashboard" | "deep-analysis" | "recommendations" | "monitoring" | "comparison" | "reports" | "team">("analysis");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [timeRange, setTimeRange] = useState("24h");
  const [showTestModal, setShowTestModal] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    platforms: [],
    categories: [],
    volumeRange: [0, 1000000],
    growthRange: [-100, 500],
    opportunityRange: [0, 100],
    difficultyRange: [0, 100],
    timeframe: 'all',
    trendingOnly: false,
    sortBy: 'opportunity',
    sortOrder: 'desc'
  });

  // Deep Analysis Integration
  const deepAnalysis = useDeepAnalysis({ autoRefresh: true, refreshInterval: 5 * 60 * 1000 });
  const formattedAnalysis = useFormattedAnalysis(deepAnalysis.data);

  // Daily Trends Integration
  const { trendsData: dailyTrendsData, loading: trendsLoading, error: trendsError, refetch: refetchTrends } = useDailyTrends();

  // Auto-analyze when search results change
  useEffect(() => {
    if (searchResults.length > 0 && propSearchQuery) {
      deepAnalysis.analyze(searchResults, propSearchQuery);
    }
  }, [searchResults, propSearchQuery, deepAnalysis.analyze]);

  // Use real trending data from daily trends service or fallback to mock data
  const trendingData: TrendData[] = dailyTrendsData?.trends || [
    {
      id: "1",
      keyword: "AI content creation",
      platform: "YouTube",
      volume: 89000,
      growth: 156,
      difficulty: 45,
      opportunity: 92,
      category: "Technology",
      trending: true,
      timeframe: "Rising fast",
    },
    {
      id: "2",
      keyword: "sustainable fashion",
      platform: "Instagram",
      volume: 67000,
      growth: 89,
      difficulty: 38,
      opportunity: 85,
      category: "Lifestyle",
      trending: true,
      timeframe: "Steady growth",
    },
    {
      id: "3",
      keyword: "productivity hacks",
      platform: "TikTok",
      volume: 234000,
      growth: 278,
      difficulty: 72,
      opportunity: 88,
      category: "Education",
      trending: true,
      timeframe: "Viral",
    },
    {
      id: "4",
      keyword: "plant-based recipes",
      platform: "YouTube",
      volume: 145000,
      growth: 45,
      difficulty: 55,
      opportunity: 78,
      category: "Food",
      trending: false,
      timeframe: "Declining",
    },
    {
      id: "5",
      keyword: "crypto explained",
      platform: "YouTube",
      volume: 178000,
      growth: -23,
      difficulty: 89,
      opportunity: 45,
      category: "Finance",
      trending: false,
      timeframe: "Saturated",
    },
  ];

  const platformTrends: PlatformTrend[] = dailyTrendsData?.platforms || [
    {
      platform: "TikTok",
      topTrends: ["productivity hacks", "morning routine", "aesthetic room"],
      growth: 278,
      engagement: 12.4,
      color: "var(--brand-primary)",
    },
    {
      platform: "YouTube",
      topTrends: ["AI content creation", "plant-based recipes", "tech reviews"],
      growth: 156,
      engagement: 8.7,
      color: "#ef4444",
    },
    {
      platform: "Instagram",
      topTrends: ["sustainable fashion", "minimalist home", "wellness tips"],
      growth: 89,
      engagement: 6.2,
      color: "var(--brand-secondary)",
    },
    {
      platform: "LinkedIn",
      topTrends: ["remote work", "leadership skills", "career growth"],
      growth: 67,
      engagement: 4.1,
      color: "var(--accent-cyan)",
    },
  ];

  const filteredTrends = useMemo(() => {
    let filtered = trendingData.filter(trend => {
      // Basic search filter
      const matchesSearch = trend.keyword.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           trend.category.toLowerCase().includes(searchQuery.toLowerCase());

      // Basic dropdown filters
      const matchesPlatform = selectedPlatform === "all" || trend.platform === selectedPlatform;
      const matchesCategory = selectedCategory === "all" || trend.category === selectedCategory;

      // Advanced filters
      const matchesAdvancedPlatforms = activeFilters.platforms.length === 0 ||
                                       activeFilters.platforms.includes(trend.platform);
      const matchesAdvancedCategories = activeFilters.categories.length === 0 ||
                                        activeFilters.categories.includes(trend.category);
      const matchesVolume = trend.volume >= activeFilters.volumeRange[0] &&
                           trend.volume <= activeFilters.volumeRange[1];
      const matchesGrowth = trend.growth >= activeFilters.growthRange[0] &&
                           trend.growth <= activeFilters.growthRange[1];
      const matchesOpportunity = trend.opportunity >= activeFilters.opportunityRange[0] &&
                                trend.opportunity <= activeFilters.opportunityRange[1];
      const matchesDifficulty = trend.difficulty >= activeFilters.difficultyRange[0] &&
                               trend.difficulty <= activeFilters.difficultyRange[1];
      const matchesTrendingOnly = !activeFilters.trendingOnly || trend.trending;

      return matchesSearch && matchesPlatform && matchesCategory &&
             matchesAdvancedPlatforms && matchesAdvancedCategories &&
             matchesVolume && matchesGrowth && matchesOpportunity &&
             matchesDifficulty && matchesTrendingOnly;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      let aVal: any, bVal: any;

      switch (activeFilters.sortBy) {
        case 'opportunity':
          aVal = a.opportunity;
          bVal = b.opportunity;
          break;
        case 'volume':
          aVal = a.volume;
          bVal = b.volume;
          break;
        case 'growth':
          aVal = a.growth;
          bVal = b.growth;
          break;
        case 'difficulty':
          aVal = a.difficulty;
          bVal = b.difficulty;
          break;
        case 'keyword':
          aVal = a.keyword.toLowerCase();
          bVal = b.keyword.toLowerCase();
          break;
        default:
          aVal = a.opportunity;
          bVal = b.opportunity;
      }

      if (activeFilters.sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [trendingData, searchQuery, selectedPlatform, selectedCategory, activeFilters]);

  const getTrendIcon = (growth: number) => {
    if (growth > 100) return <TrendingUp className="w-4 h-4 text-[var(--color-success)]" />;
    if (growth > 0) return <ArrowUpRight className="w-4 h-4 text-[var(--color-success)]" />;
    return <ArrowDownRight className="w-4 h-4 text-[var(--color-error)]" />;
  };

  const getOpportunityColor = (score: number) => {
    if (score >= 80) return "var(--color-success)";
    if (score >= 60) return "var(--color-warning)";
    return "var(--color-error)";
  };

  return (
    <div className="space-y-4 relative">
      {/* Premium Floating Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-[var(--brand-primary)]/10 to-[var(--brand-secondary)]/5 rounded-full blur-2xl animate-pulse" />
        <div
          className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-br from-[var(--accent-cyan)]/10 to-[var(--brand-primary)]/5 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: '1s' }}
        />
        <div
          className="absolute top-1/2 left-1/3 w-40 h-40 bg-gradient-to-br from-[var(--brand-secondary)]/5 to-transparent rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '2s' }}
        />
      </div>

      <div className="relative">
        <TabHeader
          title="Trend Discovery"
          subtitle="AI-powered niche analysis with smart categorization"
          icon={<TrendingUp />}
          badge="Pro Search"
          actions={
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  refetchTrends();
                  onRefreshData?.();
                }}
                disabled={trendsLoading}
              >
                <RefreshCw className={`w-4 h-4 ${trendsLoading ? 'animate-spin' : ''}`} />
                {trendsLoading ? 'Loading...' : 'Refresh'}
              </Button>
              <Button variant="ghost" size="sm" onClick={onExportData}>
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTestModal(true)}
              >
                <Target className="w-4 h-4" />
                Test System
              </Button>
              <Button variant="primary" size="sm">
                <Sparkles className="w-4 h-4" />
                Discover Trends
              </Button>
            </div>
          }
        />
      </div>

      {/* Enhanced Navigation Tabs */}
      <div className="relative">
        <div className="inline-flex space-x-1 bg-[var(--surface-tertiary)] p-1 rounded-xl backdrop-blur-sm w-fit">
          {[
            { id: "analysis", label: "Analysis", icon: BarChart3, isPro: false },
            { id: "dashboard", label: "Dashboard", icon: Eye, isPro: false },
            { id: "deep-analysis", label: "Deep Analysis", icon: TrendingUp, isPro: true },
            { id: "recommendations", label: "AI Recommendations", icon: Sparkles, isPro: false },
            { id: "monitoring", label: "Monitoring", icon: RefreshCw, isPro: true },
            { id: "comparison", label: "Comparison", icon: Target, isPro: true },
            { id: "reports", label: "Reports", icon: Download, isPro: true },
            { id: "team", label: "Team", icon: Users, isPro: true },
          ].map(({ id, label, icon: Icon, isPro }) => (
            <motion.button
              key={id}
              onClick={() => setActiveView(id as any)}
              className={`relative flex items-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all duration-300 whitespace-nowrap overflow-hidden ${
                activeView === id
                  ? "bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] text-white shadow-lg"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-quaternary)]"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {activeView === id && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] rounded-lg"
                  layoutId="activeTab"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <div className="relative flex items-center space-x-2">
                <Icon className={`w-4 h-4 ${activeView === id ? 'animate-pulse' : ''}`} />
                <span className="flex items-center space-x-1">
                  <span>{label}</span>
                  {isPro && (
                    <Badge
                      variant="primary"
                      className={`text-xs ml-1 px-2 py-0.5 border-0 ${
                        activeView === id
                          ? "bg-white/20 text-white"
                          : "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                      }`}
                    >
                      Pro
                    </Badge>
                  )}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Content based on active view */}
      <AnimatePresence mode="wait">
        {activeView === "analysis" && (
          <motion.div
            key="analysis"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Enhanced Trend Discovery Integration */}
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-primary)]/5 via-transparent to-[var(--brand-secondary)]/5" />
              <div className="relative">
                <EnhancedTrendsSearch
                  onNavigateToGenerator={onNavigateToGenerator}
                />
              </div>
            </Card>

            {/* Old Premium Trend Analysis - Commented Out */}
            {/* <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-primary)]/5 via-transparent to-[var(--brand-secondary)]/5" />
              <div className="relative">
                <PremiumTrendAnalysis
                  trendAnalysis={trendAnalysis}
                  isLoading={isLoading}
                  error={error}
                  onAnalyzeTrends={onAnalyzeTrends || (() => {})}
                  recentQueries={recentQueries}
                  isPremium={isPremium}
                  onUpgrade={onUpgrade}
                  initialQuery={initialQuery}
                  onNavigateToGenerator={onNavigateToGenerator}
                />
              </div>
            </Card> */}

            {/* Enhanced Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Trending Topics"
                value="847"
                change="+24.5%"
                changeType="positive"
                icon={<Hash />}
                description="this week"
              />
              <StatCard
                title="High Opportunity"
                value="156"
                change="+12.8%"
                changeType="positive"
                icon={<Target />}
                description="low competition"
              />
              <StatCard
                title="Viral Potential"
                value="89"
                change="+67.3%"
                changeType="positive"
                icon={<Zap />}
                description="rising fast"
              />
              <StatCard
                title="Market Cap"
                value="$2.4M"
                change="+15.2%"
                changeType="positive"
                icon={<Award />}
                description="total volume"
              />
            </div>

            {/* Enhanced Platform Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="heading-4">Platform Performance</h3>
                  <Badge variant="primary" className="text-xs">
                    AI Generated
                  </Badge>
                </div>
                <div className="space-y-6">
                  {platformTrends.map((platform) => (
                    <div
                      key={platform.platform}
                      className="p-4 rounded-xl bg-[var(--surface-tertiary)] hover:bg-[var(--surface-quaternary)] transition-all duration-200"
                    >
                      {/* Platform Header */}
                      <div className="flex items-center space-x-4 mb-4">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: platform.color }}
                        >
                          <span className="text-white text-xs font-bold">
                            {platform.platform.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-[var(--text-primary)]">
                              {platform.platform}
                            </h4>
                            <div className="flex items-center space-x-2">
                              <Badge variant="success">+{platform.growth}%</Badge>
                              <span className="text-sm text-[var(--text-secondary)]">
                                {platform.engagement}% engagement
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Metrics */}
                      {(platform.activeCreators || platform.avgViews) && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                          {platform.activeCreators && (
                            <div>
                              <span className="text-[var(--text-secondary)]">Active Creators</span>
                              <div className="font-semibold text-[var(--text-primary)]">
                                {(platform.activeCreators / 1000).toFixed(0)}K
                              </div>
                            </div>
                          )}
                          {platform.avgViews && (
                            <div>
                              <span className="text-[var(--text-secondary)]">Avg Views</span>
                              <div className="font-semibold text-[var(--text-primary)]">
                                {(platform.avgViews / 1000000).toFixed(1)}M
                              </div>
                            </div>
                          )}
                          {platform.audienceDemographics && (
                            <>
                              <div>
                                <span className="text-[var(--text-secondary)]">Primary Age</span>
                                <div className="font-semibold text-[var(--text-primary)]">
                                  {platform.audienceDemographics.primaryAge}
                                </div>
                              </div>
                              <div>
                                <span className="text-[var(--text-secondary)]">Top Markets</span>
                                <div className="font-semibold text-[var(--text-primary)]">
                                  {platform.audienceDemographics.topCountries.slice(0, 2).join(', ')}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      )}

                      {/* Trending Topics */}
                      <div className="mb-4">
                        <span className="text-xs text-[var(--text-secondary)] mb-2 block">
                          Trending Topics:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {platform.topTrends.slice(0, 4).map((trend) => (
                            <span
                              key={trend}
                              className="px-2 py-1 text-xs bg-[var(--surface-quaternary)] text-[var(--text-tertiary)] rounded-md"
                            >
                              #{trend}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Content Types & Best Times */}
                      {(platform.contentTypes || platform.bestPostingTimes) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          {platform.contentTypes && (
                            <div>
                              <span className="text-[var(--text-secondary)]">Content Types:</span>
                              <div className="text-[var(--text-primary)] mt-1">
                                {platform.contentTypes.join(', ')}
                              </div>
                            </div>
                          )}
                          {platform.bestPostingTimes && (
                            <div>
                              <span className="text-[var(--text-secondary)]">Best Times:</span>
                              <div className="text-[var(--text-primary)] mt-1">
                                {platform.bestPostingTimes.join(', ')}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <h3 className="heading-4 mb-6">Quick Actions</h3>
                <div className="grid grid-cols-1 gap-4">
                  <QuickActionCard
                    title="Trend Analysis"
                    description="Deep dive into trending topics"
                    icon={<BarChart3 />}
                    color="var(--brand-primary)"
                    onClick={() => setActiveView("dashboard")}
                  />
                  <QuickActionCard
                    title="Competitor Monitoring"
                    description="Track competitor trends"
                    icon={<Eye />}
                    color="var(--brand-secondary)"
                    onClick={() => setActiveView("monitoring")}
                  />
                  <QuickActionCard
                    title="Trend Comparison"
                    description="Compare multiple trends"
                    icon={<Target />}
                    color="var(--accent-cyan)"
                    onClick={() => setActiveView("comparison")}
                  />
                </div>
              </Card>
            </div>

            {/* Enhanced Search and Filters */}
            <Card>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search trends, keywords, or topics..."
                      value={searchQuery}
                      onChange={setSearchQuery}
                      icon={<Search className="w-4 h-4" />}
                    />
                  </div>
                  <div className="flex space-x-3">
                    <select
                      value={selectedPlatform}
                      onChange={(e) => setSelectedPlatform(e.target.value)}
                      className="input-base min-w-[120px]"
                    >
                      <option value="all">All Platforms</option>
                      <option value="YouTube">YouTube</option>
                      <option value="TikTok">TikTok</option>
                      <option value="Instagram">Instagram</option>
                      <option value="LinkedIn">LinkedIn</option>
                    </select>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="input-base min-w-[120px]"
                    >
                      <option value="all">All Categories</option>
                      <option value="Technology">Technology</option>
                      <option value="Lifestyle">Lifestyle</option>
                      <option value="Education">Education</option>
                      <option value="Food">Food</option>
                      <option value="Finance">Finance</option>
                    </select>
                  </div>
                </div>
              </div>
            </Card>

            {/* Enhanced Trending Topics */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="heading-4 flex items-center space-x-2">
                    <span>Trending Now</span>
                    {dailyTrendsData?.isFallback && (
                      <Badge variant="warning" className="text-xs">Fallback Data</Badge>
                    )}
                    {trendsError && (
                      <Badge variant="error" className="text-xs">Error Loading</Badge>
                    )}
                    {dailyTrendsData?.manualTrigger && (
                      <Badge variant="primary" className="text-xs">Manual Update</Badge>
                    )}
                  </h3>
                  <p className="body-base">
                    High-opportunity keywords and topics
                    {dailyTrendsData?.date && (
                      <span className="text-xs text-[var(--text-tertiary)] ml-2">
                        • Updated {dailyTrendsData.date}
                      </span>
                    )}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdvancedFilters(true)}
                >
                  <Filter className="w-4 h-4" />
                  Advanced Filters
                  {(activeFilters.platforms.length > 0 ||
                    activeFilters.categories.length > 0 ||
                    activeFilters.trendingOnly) && (
                    <Badge variant="primary" className="ml-2 text-xs">
                      Active
                    </Badge>
                  )}
                </Button>
              </div>

              <div className="space-y-4">
                {filteredTrends.map((trend, index) => (
                  <motion.div
                    key={trend.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center space-x-4 p-4 rounded-xl bg-[var(--surface-tertiary)] hover:bg-[var(--surface-quaternary)] transition-all duration-200 cursor-pointer"
                    onClick={() => onAnalyzeTrend?.(trend.keyword)}
                  >
                    <div className="flex items-center space-x-3">
                      {getTrendIcon(trend.growth)}
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)] flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-[var(--text-primary)]">
                          {trend.keyword}
                        </h4>
                        <Badge variant="neutral">{trend.platform}</Badge>
                        <Badge
                          variant={trend.trending ? "success" : "neutral"}
                        >
                          {trend.timeframe}
                        </Badge>
                      </div>

                      <div className="flex items-center space-x-6 text-sm">
                        <span className="text-[var(--text-secondary)]">
                          <strong>{formatNumber(trend.volume)}</strong> volume
                        </span>
                        <span className={`font-medium ${
                          trend.growth > 0 ? "text-[var(--color-success)]" : "text-[var(--color-error)]"
                        }`}>
                          {trend.growth > 0 ? "+" : ""}{trend.growth}% growth
                        </span>
                        <span className="text-[var(--text-secondary)]">
                          {trend.difficulty}% difficulty
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-2">
                        <Star className="w-4 h-4 text-[var(--color-warning)]" />
                        <span className="font-bold text-[var(--text-primary)]">
                          {trend.opportunity}%
                        </span>
                      </div>
                      <ProgressBar
                        value={trend.opportunity}
                        size="sm"
                        color={getOpportunityColor(trend.opportunity)}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {false && activeView === "analysis" && (
          <motion.div
            key="analysis"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Trending Topics"
                value="847"
                change="+24.5%"
                changeType="positive"
                icon={<Hash />}
                description="this week"
              />
              <StatCard
                title="High Opportunity"
                value="156"
                change="+12.8%"
                changeType="positive"
                icon={<Target />}
                description="low competition"
              />
              <StatCard
                title="Viral Potential"
                value="89"
                change="+67.3%"
                changeType="positive"
                icon={<Zap />}
                description="rising fast"
              />
              <StatCard
                title="Market Cap"
                value="$2.4M"
                change="+15.2%"
                changeType="positive"
                icon={<Award />}
                description="total volume"
              />
            </div>

            {/* Platform Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <h3 className="heading-4 mb-6">Platform Performance</h3>
                <div className="space-y-4">
                  {platformTrends.map((platform) => (
                    <div
                      key={platform.platform}
                      className="flex items-center space-x-4 p-4 rounded-xl bg-[var(--surface-tertiary)] hover:bg-[var(--surface-quaternary)] transition-all duration-200"
                    >
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: platform.color }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-[var(--text-primary)]">
                            {platform.platform}
                          </h4>
                          <div className="flex items-center space-x-2">
                            <Badge variant="success">+{platform.growth}%</Badge>
                            <span className="text-sm text-[var(--text-secondary)]">
                              {platform.engagement}% engagement
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {platform.topTrends.slice(0, 3).map((trend) => (
                            <span
                              key={trend}
                              className="px-2 py-1 text-xs bg-[var(--surface-quaternary)] text-[var(--text-tertiary)] rounded-md"
                            >
                              #{trend}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <h3 className="heading-4 mb-6">Quick Actions</h3>
                <div className="grid grid-cols-1 gap-4">
                  <QuickActionCard
                    title="Trend Analysis"
                    description="Deep dive into trending topics"
                    icon={<BarChart3 />}
                    color="var(--brand-primary)"
                    onClick={() => setActiveView("analyze")}
                  />
                  <QuickActionCard
                    title="Competitor Monitoring"
                    description="Track competitor trends"
                    icon={<Eye />}
                    color="var(--brand-secondary)"
                    onClick={() => setActiveView("monitoring")}
                  />
                  <QuickActionCard
                    title="Trend Comparison"
                    description="Compare multiple trends"
                    icon={<Target />}
                    color="var(--accent-cyan)"
                    onClick={() => setActiveView("comparison")}
                  />
                </div>
              </Card>
            </div>

            {/* Search and Filters */}
            <Card>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search trends, keywords, or topics..."
                      value={searchQuery}
                      onChange={setSearchQuery}
                      icon={<Search className="w-4 h-4" />}
                    />
                  </div>
                  <div className="flex space-x-3">
                    <select
                      value={selectedPlatform}
                      onChange={(e) => setSelectedPlatform(e.target.value)}
                      className="input-base min-w-[120px]"
                    >
                      <option value="all">All Platforms</option>
                      <option value="YouTube">YouTube</option>
                      <option value="TikTok">TikTok</option>
                      <option value="Instagram">Instagram</option>
                      <option value="LinkedIn">LinkedIn</option>
                    </select>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="input-base min-w-[120px]"
                    >
                      <option value="all">All Categories</option>
                      <option value="Technology">Technology</option>
                      <option value="Lifestyle">Lifestyle</option>
                      <option value="Education">Education</option>
                      <option value="Food">Food</option>
                      <option value="Finance">Finance</option>
                    </select>
                  </div>
                </div>
              </div>
            </Card>

            {/* Trending Topics */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="heading-4">Trending Now</h3>
                  <p className="body-base">High-opportunity keywords and topics</p>
                </div>
                <Button variant="ghost" size="sm">
                  <Filter className="w-4 h-4" />
                  Advanced Filters
                </Button>
              </div>

              <div className="space-y-4">
                {filteredTrends.map((trend, index) => (
                  <motion.div
                    key={trend.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center space-x-4 p-4 rounded-xl bg-[var(--surface-tertiary)] hover:bg-[var(--surface-quaternary)] transition-all duration-200 cursor-pointer"
                    onClick={() => onAnalyzeTrend?.(trend.keyword)}
                  >
                    <div className="flex items-center space-x-3">
                      {getTrendIcon(trend.growth)}
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)] flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-[var(--text-primary)]">
                          {trend.keyword}
                        </h4>
                        <Badge variant="neutral">{trend.platform}</Badge>
                        <Badge 
                          variant={trend.trending ? "success" : "neutral"}
                        >
                          {trend.timeframe}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm">
                        <span className="text-[var(--text-secondary)]">
                          <strong>{formatNumber(trend.volume)}</strong> volume
                        </span>
                        <span className={`font-medium ${
                          trend.growth > 0 ? "text-[var(--color-success)]" : "text-[var(--color-error)]"
                        }`}>
                          {trend.growth > 0 ? "+" : ""}{trend.growth}% growth
                        </span>
                        <span className="text-[var(--text-secondary)]">
                          {trend.difficulty}% difficulty
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-2">
                        <Star className="w-4 h-4 text-[var(--color-warning)]" />
                        <span className="font-bold text-[var(--text-primary)]">
                          {trend.opportunity}%
                        </span>
                      </div>
                      <ProgressBar
                        value={trend.opportunity}
                        size="sm"
                        color={getOpportunityColor(trend.opportunity)}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {activeView === "dashboard" && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Enhanced Dashboard with Premium Styling */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-primary)]/10 via-transparent to-[var(--brand-secondary)]/10 rounded-xl" />
              <div className="relative bg-[var(--surface-secondary)]/50 backdrop-blur-sm rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)] bg-clip-text text-transparent">
                      Analytics Dashboard
                    </h2>
                    <p className="text-[var(--text-tertiary)] text-sm mt-1">
                      {trendAnalysis ? `Deep analysis for "${trendAnalysis.query}"` : "Comprehensive trend analytics"}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[var(--brand-primary)]/20 to-[var(--brand-secondary)]/20 rounded-full">
                    <span className="text-[var(--brand-primary)] text-xl">📊</span>
                    <span className="text-[var(--brand-primary)] text-sm font-semibold">
                      Advanced Analytics
                    </span>
                  </div>
                </div>

                <TrendAnalyticsDashboard
                  trendData={trendAnalysis}
                  isPremium={isPremium}
                  onUpgrade={onUpgrade || (() => {})}
                  onSwitchToGenerator={onSwitchToGenerator}
                  onCopyToClipboard={onCopyToClipboard}
                  onSendToCalendar={onSendToCalendar}
                />
              </div>
            </div>
          </motion.div>
        )}

        {activeView === "deep-analysis" && (
          <motion.div
            key="deep-analysis"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Deep Analysis Content */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-pink-500/10 rounded-xl" />
              <Card className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center mr-3">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-[var(--text-primary)]">Deep Analysis</h2>
                      <p className="text-[var(--text-secondary)] text-sm">
                        Advanced trend insights and predictive analytics
                        {deepAnalysis.lastUpdated && (
                          <span className="ml-2 text-xs">
                            • Updated {formattedAnalysis?.lastUpdated}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {deepAnalysis.data && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={deepAnalysis.refresh}
                        disabled={deepAnalysis.loading}
                        className="flex items-center space-x-1"
                      >
                        <RefreshCw className={`w-4 h-4 ${deepAnalysis.loading ? 'animate-spin' : ''}`} />
                        <span>Refresh</span>
                      </Button>
                    )}
                    <Badge variant="primary">Pro</Badge>
                  </div>
                </div>

                {!isPremium ? (
                  <PremiumUpgrade
                    onClose={() => {}}
                    onUpgrade={onUpgrade || (() => {})}
                    currentPlan={userPlan}
                  />
                ) : (
                  <div className="space-y-6">
                    {/* Status and Error Display */}
                    {deepAnalysis.error && (
                      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4 text-red-400" />
                          <span className="text-sm text-red-400">
                            Analysis Error: {deepAnalysis.error}
                          </span>
                        </div>
                      </div>
                    )}

                    {!deepAnalysis.data && !deepAnalysis.loading && !deepAnalysis.error && (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-400/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Search className="w-8 h-8 text-[var(--text-secondary)]" />
                        </div>
                        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No Analysis Available</h3>
                        <p className="text-[var(--text-secondary)] mb-4">
                          Search for trends in the search tab to generate deep analytics
                        </p>
                        <Button
                          variant="primary"
                          onClick={() => setActiveView("analysis")}
                          className="flex items-center space-x-2"
                        >
                          <Search className="w-4 h-4" />
                          <span>Start Search</span>
                        </Button>
                      </div>
                    )}
                    {/* Advanced Metrics */}
                    {deepAnalysis.loading ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1,2,3,4].map(i => (
                          <div key={i} className="h-24 bg-[var(--surface-secondary)] rounded-xl animate-pulse" />
                        ))}
                      </div>
                    ) : deepAnalysis.data ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                          title="Trend Velocity"
                          value={formattedAnalysis?.metrics?.trendVelocity?.formattedValue || "0%"}
                          change={formattedAnalysis?.metrics?.trendVelocity?.formattedChange || "0%"}
                          changeType={(deepAnalysis.data?.metrics?.trendVelocity?.change || 0) >= 0 ? "positive" : "negative"}
                          icon={<TrendingUp />}
                          description={deepAnalysis.data?.metrics?.trendVelocity?.description || 'No data'}
                        />
                        <StatCard
                          title="Market Saturation"
                          value={formattedAnalysis?.metrics?.marketSaturation?.formattedValue || "0%"}
                          change={formattedAnalysis?.metrics?.marketSaturation?.formattedChange || "0%"}
                          changeType={(deepAnalysis.data?.metrics?.marketSaturation?.change || 0) <= 0 ? "positive" : "negative"}
                          icon={<Target />}
                          description={deepAnalysis.data?.metrics?.marketSaturation?.description || 'No data'}
                        />
                        <StatCard
                          title="Viral Coefficient"
                          value={formattedAnalysis?.metrics?.viralCoefficient?.formattedValue || "0"}
                          change={formattedAnalysis?.metrics?.viralCoefficient?.formattedChange || "0"}
                          changeType={(deepAnalysis.data?.metrics?.viralCoefficient?.change || 0) >= 0 ? "positive" : "negative"}
                          icon={<Zap />}
                          description={deepAnalysis.data?.metrics?.viralCoefficient?.description || 'No data'}
                        />
                        <StatCard
                          title="Revenue Potential"
                          value={formattedAnalysis?.metrics?.revenuePotential?.formattedValue || "$0M"}
                          change={formattedAnalysis?.metrics?.revenuePotential?.formattedChange || "0%"}
                          changeType={(deepAnalysis.data?.metrics?.revenuePotential?.change || 0) >= 0 ? "positive" : "negative"}
                          icon={<Award />}
                          description={deepAnalysis.data?.metrics?.revenuePotential?.description || 'No data'}
                        />
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-[var(--text-secondary)]">Search for trends to see deep analysis</p>
                      </div>
                    )}

                    {/* Interactive Controls */}
                    <InteractiveAnalysisControls
                      data={deepAnalysis.data}
                      onExport={(format) => {
                        console.log(`Exporting analysis as ${format}`);
                        // TODO: Implement export functionality
                      }}
                      onShare={() => {
                        console.log('Sharing analysis');
                        // TODO: Implement share functionality
                      }}
                      onBookmark={() => {
                        console.log('Bookmarking analysis');
                        // TODO: Implement bookmark functionality
                      }}
                      onSchedule={() => {
                        console.log('Scheduling analysis');
                        // TODO: Implement schedule functionality
                      }}
                      onCopyInsights={() => {
                        if (deepAnalysis.data?.insights?.aiRecommendations?.contentStrategy) {
                          const insights = deepAnalysis.data.insights.aiRecommendations.contentStrategy.join('\n• ');
                          navigator.clipboard.writeText(`AI Content Strategy Recommendations:\n• ${insights}`);
                          console.log('Insights copied to clipboard');
                        }
                      }}
                    />

                    {/* Deep Analysis Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card>
                        <h3 className="heading-4 mb-6">Predictive Modeling</h3>
                        <div className="space-y-4">
                          <div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-[var(--text-primary)]">30-Day Forecast</span>
                              <Badge variant="success">+234% growth</Badge>
                            </div>
                            <ProgressBar value={85} color="var(--brand-primary)" />
                            <p className="text-sm text-[var(--text-secondary)] mt-2">High confidence prediction</p>
                          </div>

                          <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-[var(--text-primary)]">Peak Timing</span>
                              <Badge variant="warning">14 days</Badge>
                            </div>
                            <ProgressBar value={67} color="var(--color-success)" />
                            <p className="text-sm text-[var(--text-secondary)] mt-2">Optimal content window</p>
                          </div>

                          <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-[var(--text-primary)]">Sustainability</span>
                              <Badge variant="primary">Long-term</Badge>
                            </div>
                            <ProgressBar value={92} color="var(--brand-secondary)" />
                            <p className="text-sm text-[var(--text-secondary)] mt-2">Lasting trend potential</p>
                          </div>
                        </div>
                      </Card>

                        <Card>
                          <h3 className="heading-4 mb-6">Market Intelligence</h3>
                          <div className="space-y-4">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between p-3 bg-[var(--surface-tertiary)] rounded-lg">
                                <div>
                                  <span className="font-medium text-[var(--text-primary)]">Audience Sentiment</span>
                                  <div className="text-sm text-[var(--text-secondary)]">
                                    {deepAnalysis.data?.intelligence?.audienceSentiment?.description || 'No sentiment data'}
                                  </div>
                                </div>
                                <div className="text-2xl">{formattedAnalysis?.intelligence?.audienceSentiment?.emoji || '😐'}</div>
                              </div>

                              <div className="flex items-center justify-between p-3 bg-[var(--surface-tertiary)] rounded-lg">
                                <div>
                                  <span className="font-medium text-[var(--text-primary)]">Content Gaps</span>
                                  <div className="text-sm text-[var(--text-secondary)]">
                                    {deepAnalysis.data?.intelligence?.contentGaps?.count || 0} untapped opportunities
                                  </div>
                                </div>
                                <div className="text-2xl">🎯</div>
                              </div>

                              <div className="flex items-center justify-between p-3 bg-[var(--surface-tertiary)] rounded-lg">
                                <div>
                                  <span className="font-medium text-[var(--text-primary)]">Monetization Score</span>
                                  <div className="text-sm text-[var(--text-secondary)]">
                                    {deepAnalysis.data?.intelligence?.monetizationScore?.score || 0}/10 {deepAnalysis.data?.intelligence?.monetizationScore?.potential || 'Unknown potential'}
                                  </div>
                                </div>
                                <div className="text-2xl">{formattedAnalysis?.intelligence?.monetizationScore?.emoji || '💰'}</div>
                              </div>

                              <div className="flex items-center justify-between p-3 bg-[var(--surface-tertiary)] rounded-lg">
                                <div>
                                  <span className="font-medium text-[var(--text-primary)]">Risk Assessment</span>
                                  <div className="text-sm text-[var(--text-secondary)]">
                                    {deepAnalysis.data?.intelligence?.riskAssessment?.level || 'Unknown'} volatility detected
                                  </div>
                                </div>
                                <div className="text-2xl">{formattedAnalysis?.intelligence?.riskAssessment?.emoji || '🛡️'}</div>
                              </div>
                            </div>
                          </div>
                        </Card>
                    </div>

                    {/* Advanced Insights */}
                    <Card>
                      <h3 className="heading-4 mb-6">Strategic Insights</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="p-4 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl">
                            <div className="flex items-center space-x-2 mb-3">
                              <Clock className="w-4 h-4 text-orange-400" />
                              <span className="font-medium text-orange-300">Time-Critical</span>
                            </div>
                            <h4 className="font-semibold text-[var(--text-primary)] mb-2">Optimal Publishing Window</h4>
                            <p className="text-sm text-[var(--text-secondary)]">
                              Peak engagement expected between 2-4 PM EST during weekdays. Weekend performance shows 34% higher viral potential.
                            </p>
                          </div>

                          <div className="p-4 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-xl">
                            <div className="flex items-center space-x-2 mb-3">
                              <Globe className="w-4 h-4 text-blue-400" />
                              <span className="font-medium text-blue-300">Geographic Hotspots</span>
                            </div>
                            <h4 className="font-semibold text-[var(--text-primary)] mb-2">Regional Trend Analysis</h4>
                            <p className="text-sm text-[var(--text-secondary)]">
                              Highest traction in US West Coast, UK, and Australia. Emerging interest in Southeast Asian markets.
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="p-4 bg-gradient-to-br from-green-500/10 to-teal-500/10 rounded-xl">
                            <div className="flex items-center space-x-2 mb-3">
                              <Users className="w-4 h-4 text-green-400" />
                              <span className="font-medium text-green-300">Audience Insights</span>
                            </div>
                            <h4 className="font-semibold text-[var(--text-primary)] mb-2">Demographics & Behavior</h4>
                            <p className="text-sm text-[var(--text-secondary)]">
                              Primary audience: 25-34 age group with high disposable income. 68% mobile consumption, prefers video content.
                            </p>
                          </div>

                          <div className="p-4 bg-gradient-to-br from-purple-500/10 to-violet-500/10 rounded-xl">
                            <div className="flex items-center space-x-2 mb-3">
                              <Sparkles className="w-4 h-4 text-purple-400" />
                              <span className="font-medium text-purple-300">AI Recommendations</span>
                            </div>
                            <h4 className="font-semibold text-[var(--text-primary)] mb-2">Content Strategy</h4>
                            <p className="text-sm text-[var(--text-secondary)]">
                              Focus on tutorial-style content with practical applications. Cross-platform approach recommended for maximum reach.
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}
              </Card>
            </div>
          </motion.div>
        )}

        {false && activeView === "dashboard" && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Real-time Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard
                title="Trending Topics"
                value="142"
                change="+23%"
                changeType="positive"
                icon={<TrendingUp />}
                description="Active trends"
              />
              <StatCard
                title="Total Volume"
                value="2.4M"
                change="+12%"
                changeType="positive"
                icon={<Eye />}
                description="Mentions today"
              />
              <StatCard
                title="Avg Growth"
                value="89%"
                change="+5%"
                changeType="positive"
                icon={<ArrowUpRight />}
                description="Weekly increase"
              />
              <StatCard
                title="Opportunities"
                value="18"
                change="+7"
                changeType="positive"
                icon={<Target />}
                description="High potential"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <h3 className="heading-4 mb-6">Live Trend Monitor</h3>
                <div className="space-y-4">
                  {trendingData.slice(0, 5).map((trend) => (
                    <div key={trend.id} className="flex items-center justify-between p-4 bg-[var(--surface-tertiary)] rounded-xl">
                      <div>
                        <div className="font-medium text-[var(--text-primary)]">{trend.keyword}</div>
                        <div className="text-sm text-[var(--text-secondary)]">{trend.platform} • {formatNumber(trend.volume)} mentions</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={trend.growth > 50 ? "success" : "neutral"}>
                          {trend.growth}% ↗
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <h3 className="heading-4 mb-6">Platform Performance</h3>
                <div className="space-y-4">
                  {platformTrends.map((platform) => (
                    <div key={platform.platform} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-[var(--text-primary)]">{platform.platform}</span>
                        <span className="text-sm text-[var(--text-secondary)]">{platform.growth}% growth</span>
                      </div>
                      <ProgressBar value={platform.engagement} color={platform.color} />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </motion.div>
        )}

        {activeView === "recommendations" && (
          <motion.div
            key="recommendations"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Enhanced AI Recommendations with Premium Styling */}
            <div className="space-y-6">
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-orange-500/5 to-red-500/10 rounded-xl" />
                <Card className="relative">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mr-3">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-[var(--text-primary)]">AI-Powered Recommendations</h2>
                      <p className="text-[var(--text-secondary)] text-sm">Intelligent content suggestions based on trend analysis</p>
                    </div>
                  </div>

                  <TrendRecommendations
                    trendData={trendAnalysis}
                    platform={platform}
                    isPremium={isPremium}
                    onUpgrade={onUpgrade || (() => {})}
                    onGenerateContent={onGenerateContent || (() => {})}
                  />
                </Card>
              </div>
            </div>
          </motion.div>
        )}

        {false && activeView === "recommendations" && (
          <motion.div
            key="recommendations"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <Card>
              <div className="flex items-center mb-6">
                <Sparkles className="w-5 h-5 text-yellow-400 mr-2" />
                <h3 className="heading-4">AI-Powered Recommendations</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl">
                    <div className="flex items-center space-x-2 mb-3">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="font-medium text-green-300">High Opportunity</span>
                    </div>
                    <h4 className="font-semibold text-[var(--text-primary)] mb-2">Sustainable Tech</h4>
                    <p className="text-sm text-[var(--text-secondary)] mb-3">
                      Growing 156% weekly with low competition. Perfect timing for content creation.
                    </p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="success">92% match</Badge>
                      <Badge variant="neutral">Tech</Badge>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl">
                    <div className="flex items-center space-x-2 mb-3">
                      <Eye className="w-4 h-4 text-blue-400" />
                      <span className="font-medium text-blue-300">Viral Potential</span>
                    </div>
                    <h4 className="font-semibold text-[var(--text-primary)] mb-2">AI Art Generation</h4>
                    <p className="text-sm text-[var(--text-secondary)] mb-3">
                      Massive audience interest with 340K daily searches and rising engagement.
                    </p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="primary">88% match</Badge>
                      <Badge variant="neutral">Creative</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
                    <div className="flex items-center space-x-2 mb-3">
                      <Star className="w-4 h-4 text-purple-400" />
                      <span className="font-medium text-purple-300">Niche Goldmine</span>
                    </div>
                    <h4 className="font-semibold text-[var(--text-primary)] mb-2">Micro SaaS Tools</h4>
                    <p className="text-sm text-[var(--text-secondary)] mb-3">
                      Untapped niche with dedicated audience and monetization potential.
                    </p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">84% match</Badge>
                      <Badge variant="neutral">Business</Badge>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl">
                    <div className="flex items-center space-x-2 mb-3">
                      <Clock className="w-4 h-4 text-orange-400" />
                      <span className="font-medium text-orange-300">Time Sensitive</span>
                    </div>
                    <h4 className="font-semibold text-[var(--text-primary)] mb-2">Holiday Marketing</h4>
                    <p className="text-sm text-[var(--text-secondary)] mb-3">
                      Seasonal opportunity with 2 weeks left for optimal content timing.
                    </p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="warning">76% match</Badge>
                      <Badge variant="neutral">Marketing</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {activeView === "monitoring" && (
          <motion.div
            key="monitoring"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Enhanced Live Monitoring with Premium Styling */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-blue-500/5 to-purple-500/10 rounded-xl" />
              <Card className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center mr-3">
                      <RefreshCw className="w-5 h-5 text-white animate-spin" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-[var(--text-primary)]">Live Monitoring</h2>
                      <p className="text-[var(--text-secondary)] text-sm">Real-time trend tracking and alerts</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm text-[var(--text-secondary)]">Live</span>
                    </div>
                    {!isPremium && <Badge variant="primary">Pro</Badge>}
                  </div>
                </div>

                <TrendMonitoring
                  trendData={trendAnalysis}
                  isPremium={isPremium}
                  onUpgrade={onUpgrade || (() => {})}
                />
              </Card>
            </div>
          </motion.div>
        )}

        {false && activeView === "monitoring" && (
          <motion.div
            key="monitoring"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <Card>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <RefreshCw className="w-5 h-5 text-blue-400 mr-2" />
                  <h3 className="heading-4">Live Monitoring</h3>
                  <Badge variant="success" className="ml-2">Pro</Badge>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-[var(--text-secondary)]">Live</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-[var(--surface-tertiary)] rounded-xl">
                  <div className="text-3xl font-bold text-green-400 mb-2">89</div>
                  <div className="text-sm text-[var(--text-secondary)]">Active Monitors</div>
                </div>
                <div className="text-center p-6 bg-[var(--surface-tertiary)] rounded-xl">
                  <div className="text-3xl font-bold text-blue-400 mb-2">24/7</div>
                  <div className="text-sm text-[var(--text-secondary)]">Uptime</div>
                </div>
                <div className="text-center p-6 bg-[var(--surface-tertiary)] rounded-xl">
                  <div className="text-3xl font-bold text-purple-400 mb-2">2.1M</div>
                  <div className="text-sm text-[var(--text-secondary)]">Data Points</div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {activeView === "comparison" && (
          <motion.div
            key="comparison"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Enhanced Competitive Analysis with Premium Styling */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/5 to-red-500/10 rounded-xl" />
              <Card className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mr-3">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-[var(--text-primary)]">Competitive Analysis</h2>
                      <p className="text-[var(--text-secondary)] text-sm">Compare trends and market positioning</p>
                    </div>
                  </div>
                  {!isPremium && <Badge variant="primary">Pro</Badge>}
                </div>

                <TrendComparison
                  trendData={trendAnalysis}
                  isPremium={isPremium}
                  onUpgrade={onUpgrade || (() => {})}
                />
              </Card>
            </div>
          </motion.div>
        )}

        {false && activeView === "comparison" && (
          <motion.div
            key="comparison"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <Card>
              <div className="flex items-center mb-6">
                <Target className="w-5 h-5 text-green-400 mr-2" />
                <h3 className="heading-4">Trend Comparison</h3>
                <Badge variant="success" className="ml-2">Pro</Badge>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-[var(--text-primary)]">Comparison Matrix</h4>
                  <div className="space-y-3">
                    {trendingData.slice(0, 4).map((trend) => (
                      <div key={trend.id} className="grid grid-cols-4 gap-4 p-3 bg-[var(--surface-tertiary)] rounded-lg text-sm">
                        <div className="font-medium text-[var(--text-primary)]">{trend.keyword}</div>
                        <div className="text-center">{formatNumber(trend.volume)}</div>
                        <div className="text-center text-green-400">{trend.growth}%</div>
                        <div className="text-center">{trend.opportunity}/100</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-[var(--text-primary)]">Competitive Analysis</h4>
                  <div className="p-4 bg-[var(--surface-tertiary)] rounded-xl">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">Market Leader</span>
                        <span className="font-medium text-[var(--text-primary)]">AI Content Creation</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">Fastest Growing</span>
                        <span className="font-medium text-green-400">Sustainable Fashion</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">Best Opportunity</span>
                        <span className="font-medium text-blue-400">Remote Work Tools</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {(activeView === "reports" || activeView === "team") && !isPremium && (
          <motion.div
            key="premium-upgrade"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <PremiumUpgrade
              onClose={() => {}}
              onUpgrade={onUpgrade || (() => {})}
              currentPlan={userPlan}
            />
          </motion.div>
        )}

        {activeView === "reports" && isPremium && (
          <motion.div
            key="reports"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Enhanced Professional Reporting System */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-cyan-500/10 rounded-xl" />
              <Card className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center mr-3">
                      <Download className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-[var(--text-primary)]">Professional Reports</h2>
                      <p className="text-[var(--text-secondary)] text-sm">Generate comprehensive trend analysis reports</p>
                    </div>
                  </div>
                  <Badge variant="primary">Pro</Badge>
                </div>

                <TrendReporting
                  trendData={trendAnalysis}
                  platform={platform}
                  isPremium={isPremium}
                  onUpgrade={onUpgrade || (() => {})}
                />
              </Card>
            </div>
          </motion.div>
        )}

        {activeView === "team" && isPremium && (
          <motion.div
            key="team"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <Card>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-green-400 mr-2" />
                  <h3 className="heading-4">Team Collaboration</h3>
                  <Badge variant="success" className="ml-2">Pro</Badge>
                </div>
                <Button variant="primary" size="sm">
                  <Users className="w-4 h-4" />
                  Invite Members
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-[var(--text-primary)]">Team Activity</h4>
                  <div className="space-y-3">
                    {[
                      { name: "Sarah Chen", action: "analyzed AI trends", time: "2 minutes ago", avatar: "SC" },
                      { name: "Mike Johnson", action: "created monitoring alert", time: "15 minutes ago", avatar: "MJ" },
                      { name: "Lisa Wong", action: "exported weekly report", time: "1 hour ago", avatar: "LW" },
                      { name: "David Kim", action: "shared trend insights", time: "3 hours ago", avatar: "DK" },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-[var(--surface-tertiary)] rounded-lg">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                          {activity.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm">
                            <span className="font-medium text-[var(--text-primary)]">{activity.name}</span>
                            <span className="text-[var(--text-secondary)]"> {activity.action}</span>
                          </div>
                          <div className="text-xs text-[var(--text-tertiary)]">{activity.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-[var(--text-primary)]">Team Insights</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-[var(--surface-tertiary)] rounded-xl">
                      <div className="text-2xl font-bold text-blue-400 mb-1">4</div>
                      <div className="text-xs text-[var(--text-secondary)]">Active Members</div>
                    </div>
                    <div className="text-center p-4 bg-[var(--surface-tertiary)] rounded-xl">
                      <div className="text-2xl font-bold text-green-400 mb-1">23</div>
                      <div className="text-xs text-[var(--text-secondary)]">Shared Insights</div>
                    </div>
                    <div className="text-center p-4 bg-[var(--surface-tertiary)] rounded-xl">
                      <div className="text-2xl font-bold text-purple-400 mb-1">12</div>
                      <div className="text-xs text-[var(--text-secondary)]">Collaborations</div>
                    </div>
                    <div className="text-center p-4 bg-[var(--surface-tertiary)] rounded-xl">
                      <div className="text-2xl font-bold text-orange-400 mb-1">89%</div>
                      <div className="text-xs text-[var(--text-secondary)]">Productivity</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Test Modal */}
      {showTestModal && (
        <TestDailyTrends onClose={() => setShowTestModal(false)} />
      )}

      {/* Advanced Filters Modal */}
      <AdvancedFiltersModal
        isOpen={showAdvancedFilters}
        onClose={() => setShowAdvancedFilters(false)}
        onApplyFilters={setActiveFilters}
        currentFilters={activeFilters}
      />
    </div>
  );
};

export default TrendsWorldClass;
