import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  TrendingUp,
  Target,
  Globe,
  Calendar,
  Users,
  Zap,
  Star,
  ArrowUpRight,
  BookOpen,
  Eye,
  Hash,
  Sparkles,
  RefreshCw,
  Download,
  Copy,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  BarChart3,
  DollarSign,
  Clock,
  AlertTriangle
} from "lucide-react";
import { 
  EnhancedTrendSearchService, 
  TrendSearchFilters, 
  TrendSearchResult,
  NICHE_DATABASE,
  NicheDefinition
} from "../services/enhancedTrendSearchService";

interface EnhancedTrendsSearchProps {
  onNavigateToGenerator?: (content: string) => void;
  onExportResults?: (results: TrendSearchResult[]) => void;
  className?: string;
}

const EnhancedTrendsSearch: React.FC<EnhancedTrendsSearchProps> = ({
  onNavigateToGenerator,
  onExportResults,
  className = ""
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<TrendSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedNiche, setSelectedNiche] = useState<string>("all");
  const [expandedTrend, setExpandedTrend] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const [filters, setFilters] = useState<TrendSearchFilters>({
    timeRange: "7d",
    region: "global",
    language: "en",
    category: "all",
    niche: "all",
    platform: ["YouTube", "TikTok", "Instagram"],
    contentType: ["video", "image", "text"],
    audienceSize: "all",
    engagementRate: "all",
    competitionLevel: "all",
    monetizationPotential: "all"
  });

  const searchService = EnhancedTrendSearchService.getInstance();

  // Suggested search queries based on trending topics
  const suggestedQueries = [
    "AI content creation tools 2024",
    "Sustainable living hacks",
    "Remote work productivity",
    "Personal finance for Gen Z",
    "Smart home automation",
    "Minimalist lifestyle",
    "Pet care technology",
    "Micro SaaS ideas",
    "Mindfulness and wellness",
    "Social media marketing"
  ];

  // Handle search execution
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a search query");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const results = await searchService.searchTrends(searchQuery, filters);

      // Validate results
      if (!results || !Array.isArray(results)) {
        console.error("Invalid search results:", results);
        setError("Invalid search results received");
        setSearchResults([]);
        return;
      }

      setSearchResults(results);

      // Add to search history
      if (!searchHistory.includes(searchQuery)) {
        setSearchHistory(prev => [searchQuery, ...prev.slice(0, 4)]);
      }

      setError(null);
    } catch (err: any) {
      console.error("Search error:", err);
      setError(err.message || "Failed to search trends");
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle filter updates
  const updateFilter = (key: keyof TrendSearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Handle niche selection
  const handleNicheSelect = (nicheId: string) => {
    setSelectedNiche(nicheId);
    updateFilter("niche", nicheId);
    
    // Auto-populate query suggestions for the niche
    if (nicheId !== "all") {
      const niche = NICHE_DATABASE.find(n => n.id === nicheId);
      if (niche && !searchQuery) {
        setSearchQuery(niche.commonKeywords.slice(0, 2).join(" "));
      }
    }
  };

  // Get platform color
  const getPlatformColor = (platform: string) => {
    const colors = {
      YouTube: "bg-red-500",
      TikTok: "bg-black",
      Instagram: "bg-gradient-to-r from-pink-500 to-purple-500",
      LinkedIn: "bg-blue-600",
      Twitter: "bg-blue-400",
      Facebook: "bg-blue-700"
    };
    return colors[platform as keyof typeof colors] || "bg-gray-500";
  };

  // Get metric color based on value
  const getMetricColor = (value: number, isGood: boolean = true) => {
    if (isGood) {
      if (value >= 80) return "text-green-400";
      if (value >= 60) return "text-yellow-400";
      return "text-red-400";
    } else {
      if (value <= 30) return "text-green-400";
      if (value <= 60) return "text-yellow-400";
      return "text-red-400";
    }
  };

  // Copy trend data to clipboard
  const copyTrendData = async (trend: TrendSearchResult) => {
    const data = `${trend.title}\n\n${trend.description}\n\nKeywords: ${trend.keywords.join(", ")}\nHashtags: ${trend.hashtags.join(" ")}\n\nInsights: ${trend.insights.why}`;
    
    try {
      await navigator.clipboard.writeText(data);
      // Show success feedback (you can implement a toast notification here)
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className={`w-full space-y-6 ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-2xl p-6 backdrop-blur-sm border border-purple-500/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 pl-2">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Trend Discovery</h2>
              <p className="text-purple-200">AI-powered niche analysis with smart categorization</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full border border-emerald-500/30">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-300 text-sm font-semibold">Pro Search</span>
          </div>
        </div>

        {/* Search Input */}
        <div className="space-y-4">
          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter topic, niche, or trend to discover opportunities..."
                className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-400"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`px-4 py-3 rounded-xl border transition-all duration-200 ${
                showAdvancedFilters
                  ? "bg-purple-600 border-purple-500 text-white"
                  : "bg-slate-700/50 border-slate-600/50 text-slate-300 hover:bg-slate-600/50"
              }`}
            >
              <Filter className="w-5 h-5" />
            </button>
            <button
              onClick={handleSearch}
              disabled={isLoading || !searchQuery.trim()}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl font-semibold text-white shadow-lg transition-all duration-200 disabled:opacity-50 flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Discover Trends</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Search Suggestions */}
          <div className="flex flex-wrap gap-2">
            <span className="text-slate-400 text-sm">Quick searches:</span>
            {suggestedQueries.slice(0, 4).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setSearchQuery(suggestion)}
                className="px-3 py-1 bg-slate-700/30 hover:bg-slate-600/50 rounded-full text-xs text-slate-300 transition-all duration-200"
              >
                {suggestion}
              </button>
            ))}
          </div>

          {/* Search History */}
          {searchHistory.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-slate-400 text-sm">Recent:</span>
              {searchHistory.map((query, index) => (
                <button
                  key={index}
                  onClick={() => setSearchQuery(query)}
                  className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 rounded-full text-xs text-blue-300 transition-all duration-200"
                >
                  {query}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Search Description */}
      <div className="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm border border-slate-700/50">
        <div className="flex items-center space-x-2 mb-4">
          <Lightbulb className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">AI-Powered Trend Discovery</h3>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed mb-4">
          Enter any niche, topic, or industry to discover comprehensive trending opportunities. Our AI analyzes real-time data across platforms to provide actionable insights for content creators.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
            <div className="text-purple-300 font-medium text-sm">Strategic Insights</div>
            <div className="text-slate-400 text-xs">Why trends are emerging</div>
          </div>
          <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
            <div className="text-blue-300 font-medium text-sm">Content Ideas</div>
            <div className="text-slate-400 text-xs">Ready-to-use concepts</div>
          </div>
          <div className="bg-emerald-500/10 rounded-lg p-3 border border-emerald-500/20">
            <div className="text-emerald-300 font-medium text-sm">Audience Analysis</div>
            <div className="text-slate-400 text-xs">Demographics & interests</div>
          </div>
          <div className="bg-amber-500/10 rounded-lg p-3 border border-amber-500/20">
            <div className="text-amber-300 font-medium text-sm">Monetization</div>
            <div className="text-slate-400 text-xs">Revenue opportunities</div>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {showAdvancedFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm border border-slate-700/50"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Filter className="w-5 h-5 text-purple-400 mr-2" />
              Advanced Filters
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Niche Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <Target className="w-4 h-4 inline mr-1" />
                  Niche Focus
                </label>
                <select
                  value={selectedNiche}
                  onChange={(e) => handleNicheSelect(e.target.value)}
                  className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
                >
                  <option value="all">All Niches</option>
                  {NICHE_DATABASE.map((niche) => (
                    <option key={niche.id} value={niche.id}>
                      {niche.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Time Range */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Time Range
                </label>
                <select
                  value={filters.timeRange}
                  onChange={(e) => updateFilter("timeRange", e.target.value)}
                  className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
                >
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last Week</option>
                  <option value="30d">Last Month</option>
                  <option value="90d">Last 3 Months</option>
                  <option value="1y">Last Year</option>
                </select>
              </div>

              {/* Region */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <Globe className="w-4 h-4 inline mr-1" />
                  Region
                </label>
                <select
                  value={filters.region}
                  onChange={(e) => updateFilter("region", e.target.value)}
                  className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
                >
                  <option value="global">Global</option>
                  <option value="us">United States</option>
                  <option value="eu">Europe</option>
                  <option value="asia">Asia Pacific</option>
                  <option value="latam">Latin America</option>
                  <option value="africa">Africa</option>
                </select>
              </div>

              {/* Audience Size */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <Users className="w-4 h-4 inline mr-1" />
                  Audience Size
                </label>
                <select
                  value={filters.audienceSize}
                  onChange={(e) => updateFilter("audienceSize", e.target.value)}
                  className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
                >
                  <option value="all">All Sizes</option>
                  <option value="micro">Micro (1K-10K)</option>
                  <option value="medium">Medium (10K-50K)</option>
                  <option value="large">Large (50K+)</option>
                </select>
              </div>

              {/* Competition Level */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <Target className="w-4 h-4 inline mr-1" />
                  Competition
                </label>
                <select
                  value={filters.competitionLevel}
                  onChange={(e) => updateFilter("competitionLevel", e.target.value)}
                  className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
                >
                  <option value="all">All Levels</option>
                  <option value="low">Low Competition</option>
                  <option value="medium">Medium Competition</option>
                  <option value="high">High Competition</option>
                </select>
              </div>
            </div>

            {/* Platform Selection */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-300 mb-3">
                <Zap className="w-4 h-4 inline mr-1" />
                Target Platforms
              </label>
              <div className="flex flex-wrap gap-2">
                {["YouTube", "TikTok", "Instagram", "LinkedIn", "Twitter", "Facebook"].map((platform) => (
                  <button
                    key={platform}
                    onClick={() => {
                      const currentPlatforms = filters.platform;
                      const newPlatforms = currentPlatforms.includes(platform)
                        ? currentPlatforms.filter(p => p !== platform)
                        : [...currentPlatforms, platform];
                      updateFilter("platform", newPlatforms);
                    }}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      filters.platform.includes(platform)
                        ? `${getPlatformColor(platform)} text-white`
                        : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
                    }`}
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Engagement Rate
                </label>
                <select
                  value={filters.engagementRate}
                  onChange={(e) => updateFilter("engagementRate", e.target.value)}
                  className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
                >
                  <option value="all">All Rates</option>
                  <option value="low">Low (0-5%)</option>
                  <option value="medium">Medium (5-10%)</option>
                  <option value="high">High (10-15%)</option>
                  <option value="viral">Viral (15%+)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Monetization Potential
                </label>
                <select
                  value={filters.monetizationPotential}
                  onChange={(e) => updateFilter("monetizationPotential", e.target.value)}
                  className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
                >
                  <option value="all">All Potential</option>
                  <option value="low">Low Potential</option>
                  <option value="medium">Medium Potential</option>
                  <option value="high">High Potential</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Language
                </label>
                <select
                  value={filters.language}
                  onChange={(e) => updateFilter("language", e.target.value)}
                  className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="pt">Portuguese</option>
                  <option value="zh">Chinese</option>
                  <option value="ja">Japanese</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/20 border border-red-700/50 rounded-xl p-4 text-red-300">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="bg-slate-800/50 rounded-xl p-8 backdrop-blur-sm border border-slate-700/50">
          <div className="text-center">
            <div className="inline-flex items-center space-x-3">
              <RefreshCw className="w-8 h-8 animate-spin text-purple-500" />
              <div>
                <div className="text-lg font-semibold text-white">Analyzing Trends</div>
                <div className="text-slate-400">Scanning platforms for emerging opportunities...</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white flex items-center">
              <BarChart3 className="w-5 h-5 text-purple-400 mr-2" />
              Trend Analysis Results
              <span className="ml-2 px-2 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full">
                {searchResults.length} trends found
              </span>
            </h3>
            {onExportResults && (
              <button
                onClick={() => onExportResults(searchResults)}
                className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 rounded-lg text-sm flex items-center space-x-2 transition-all duration-200"
              >
                <Download className="w-4 h-4" />
                <span>Export Results</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6">
            {searchResults.map((trend, index) => (
              <motion.div
                key={trend.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-600/30 p-6 shadow-2xl hover:shadow-purple-500/10 transition-all duration-500"
              >
                {/* Trend Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-xl font-bold text-white">{trend.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPlatformColor(trend.platform)} text-white`}>
                        {trend.platform}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 font-semibold">{trend.metrics.trendScore}/100</span>
                      </div>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{trend.description}</p>
                  </div>
                  <button
                    onClick={() => setExpandedTrend(expandedTrend === trend.id ? null : trend.id)}
                    className="p-2 hover:bg-slate-700/50 rounded-lg transition-all duration-200"
                  >
                    {expandedTrend === trend.id ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </button>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-slate-700/30 rounded-lg p-3">
                    <div className="text-slate-400 text-xs">Growth</div>
                    <div className={`text-lg font-bold ${getMetricColor(trend.metrics.growth)}`}>
                      +{trend.metrics.growth}%
                    </div>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-3">
                    <div className="text-slate-400 text-xs">Volume</div>
                    <div className="text-lg font-bold text-blue-400">
                      {(trend.metrics.volume / 1000).toFixed(1)}K
                    </div>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-3">
                    <div className="text-slate-400 text-xs">Competition</div>
                    <div className={`text-lg font-bold ${getMetricColor(trend.metrics.competitionLevel, false)}`}>
                      {trend.metrics.competitionLevel}%
                    </div>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-3">
                    <div className="text-slate-400 text-xs">Viral Potential</div>
                    <div className={`text-lg font-bold ${getMetricColor(trend.metrics.viralPotential)}`}>
                      {trend.metrics.viralPotential}%
                    </div>
                  </div>
                </div>

                {/* Keywords and Hashtags */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm font-medium text-slate-300 mb-2 flex items-center">
                      <Hash className="w-4 h-4 mr-1" />
                      Keywords
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {(trend.keywords?.primary || trend.keywords || []).slice(0, 6).map((keyword, i) => (
                        <span key={i} className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-300 mb-2 flex items-center">
                      <Hash className="w-4 h-4 mr-1" />
                      Hashtags
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {(trend.hashtags?.viral || trend.hashtags || []).slice(0, 6).map((hashtag, i) => (
                        <span key={i} className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
                          {hashtag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {expandedTrend === trend.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-6 mt-6 pt-6 border-t border-slate-700/50"
                    >
                      {/* Strategic Insight */}
                      <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl p-6 border border-purple-500/20">
                        <div className="text-lg font-semibold text-purple-300 mb-4 flex items-center">
                          <span className="mr-2">🎯</span>
                          Strategic Insight
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed mb-4">{trend.strategicInsight?.why}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <div className="text-xs text-purple-400 font-medium mb-2">Market Forces</div>
                            <ul className="text-xs text-slate-400 space-y-1">
                              {(trend.strategicInsight?.marketForces || []).slice(0, 3).map((force, i) => (
                                <li key={i}>• {force}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <div className="text-xs text-purple-400 font-medium mb-2">Emotional Drivers</div>
                            <ul className="text-xs text-slate-400 space-y-1">
                              {(trend.strategicInsight?.emotionalDrivers || []).slice(0, 3).map((driver, i) => (
                                <li key={i}>• {driver}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <div className="text-xs text-purple-400 font-medium mb-2">Catalysts</div>
                            <ul className="text-xs text-slate-400 space-y-1">
                              {(trend.strategicInsight?.catalysts || []).slice(0, 3).map((catalyst, i) => (
                                <li key={i}>• {catalyst}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Audience Alignment */}
                      <div className="bg-gradient-to-r from-emerald-900/20 to-teal-900/20 rounded-xl p-6 border border-emerald-500/20">
                        <div className="text-lg font-semibold text-emerald-300 mb-4 flex items-center">
                          <span className="mr-2">👥</span>
                          Audience Alignment
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-emerald-400 font-medium mb-2">Demographics</div>
                            <p className="text-slate-300 text-sm mb-3">{trend.audienceAlignment?.primaryDemographics || "General audience across age groups"}</p>
                            <div className="text-sm text-emerald-400 font-medium mb-2">Pain Points</div>
                            <ul className="text-xs text-slate-400 space-y-1">
                              {(trend.audienceAlignment?.painPoints || []).slice(0, 3).map((point, i) => (
                                <li key={i}>• {point}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <div className="text-sm text-emerald-400 font-medium mb-2">Consumption Patterns</div>
                            <p className="text-slate-300 text-xs mb-3">{trend.audienceAlignment?.contentConsumptionPatterns || "Mixed content consumption patterns"}</p>
                            <div className="text-sm text-emerald-400 font-medium mb-2">Platform Preferences</div>
                            <div className="flex flex-wrap gap-1">
                              {(trend.audienceAlignment?.platformPreferences || []).map((platform, i) => (
                                <span key={i} className="px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded text-xs">
                                  {platform}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actionable Content Ideas */}
                      <div className="bg-gradient-to-r from-amber-900/20 to-orange-900/20 rounded-xl p-6 border border-amber-500/20">
                        <div className="text-lg font-semibold text-amber-300 mb-4 flex items-center">
                          <span className="mr-2">💡</span>
                          Actionable Content Ideas
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(trend.actionableContentIdeas || []).slice(0, 6).map((idea, i) => (
                            <div key={i} className="bg-slate-800/50 rounded-lg p-4 border border-amber-500/10">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-amber-300 text-sm">{idea.type}</span>
                                <div className="flex items-center space-x-1">
                                  <Star className="w-3 h-3 text-yellow-400" />
                                  <span className="text-xs text-yellow-400">{idea.potential}/10</span>
                                </div>
                              </div>
                              <div className="text-slate-300 text-sm font-medium mb-1">{idea.title}</div>
                              <div className="text-slate-400 text-xs mb-2">{idea.description}</div>
                              <div className="text-amber-400 text-xs">{idea.format}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Keywords & Hashtags - Enhanced */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 rounded-xl p-6 border border-blue-500/20">
                          <div className="text-lg font-semibold text-blue-300 mb-4 flex items-center">
                            <span className="mr-2">🔤</span>
                            Keywords
                          </div>
                          <div className="space-y-3">
                            <div>
                              <div className="text-sm text-blue-400 font-medium mb-2">Primary Keywords</div>
                              <div className="flex flex-wrap gap-1">
                                {trend.keywords?.primary?.slice(0, 5).map((keyword, i) => (
                                  <span key={i} className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
                                    {keyword}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-blue-400 font-medium mb-2">Long-tail Keywords</div>
                              <div className="flex flex-wrap gap-1">
                                {trend.keywords?.longTail?.slice(0, 4).map((keyword, i) => (
                                  <span key={i} className="px-2 py-1 bg-blue-500/15 text-blue-300 rounded text-xs">
                                    {keyword}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-cyan-900/20 to-teal-900/20 rounded-xl p-6 border border-cyan-500/20">
                          <div className="text-lg font-semibold text-cyan-300 mb-4 flex items-center">
                            <span className="mr-2">#️⃣</span>
                            Hashtags
                          </div>
                          <div className="space-y-3">
                            <div>
                              <div className="text-sm text-cyan-400 font-medium mb-2">Viral Hashtags</div>
                              <div className="flex flex-wrap gap-1">
                                {trend.hashtags?.viral?.slice(0, 5).map((hashtag, i) => (
                                  <span key={i} className="px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded text-xs">
                                    {hashtag}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-cyan-400 font-medium mb-2">Niche Hashtags</div>
                              <div className="flex flex-wrap gap-1">
                                {trend.hashtags?.niche?.slice(0, 4).map((hashtag, i) => (
                                  <span key={i} className="px-2 py-1 bg-cyan-500/15 text-cyan-300 rounded text-xs">
                                    {hashtag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Hook & Angle Suggestions */}
                      <div className="bg-gradient-to-r from-pink-900/20 to-rose-900/20 rounded-xl p-6 border border-pink-500/20">
                        <div className="text-lg font-semibold text-pink-300 mb-4 flex items-center">
                          <span className="mr-2">🎬</span>
                          Hook & Angle Suggestions
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(trend.hookAndAngles || []).slice(0, 4).map((hook, i) => (
                            <div key={i} className="bg-slate-800/50 rounded-lg p-4 border border-pink-500/10">
                              <div className="text-pink-300 text-sm font-medium mb-2">{hook.hook}</div>
                              <div className="text-slate-400 text-xs mb-1">Angle: {hook.angle}</div>
                              <div className="text-slate-400 text-xs">Framework: {hook.framework}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Monetization Strategies */}
                      <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded-xl p-6 border border-green-500/20">
                        <div className="text-lg font-semibold text-green-300 mb-4 flex items-center">
                          <span className="mr-2">💰</span>
                          Monetization Strategies
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-green-400 font-medium mb-2">Direct Revenue</div>
                            <ul className="text-xs text-slate-400 space-y-1">
                              {(trend.monetizationStrategies?.direct || []).slice(0, 3).map((strategy, i) => (
                                <li key={i}>• {strategy}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <div className="text-sm text-green-400 font-medium mb-2">Affiliate Opportunities</div>
                            <ul className="text-xs text-slate-400 space-y-1">
                              {(trend.monetizationStrategies?.affiliate || []).slice(0, 3).map((strategy, i) => (
                                <li key={i}>• {strategy}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Viral Factors & Risks */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-r from-yellow-900/20 to-amber-900/20 rounded-xl p-6 border border-yellow-500/20">
                          <div className="text-lg font-semibold text-yellow-300 mb-4 flex items-center">
                            <span className="mr-2">🚀</span>
                            Viral Factors
                          </div>
                          <div className="space-y-3">
                            <div>
                              <div className="text-sm text-yellow-400 font-medium mb-2">Shareability Elements</div>
                              <ul className="text-xs text-slate-400 space-y-1">
                                {(trend.viralFactors?.shareabilityElements || []).slice(0, 3).map((element, i) => (
                                  <li key={i}>• {element}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <div className="text-sm text-yellow-400 font-medium mb-2">Emotional Triggers</div>
                              <ul className="text-xs text-slate-400 space-y-1">
                                {(trend.viralFactors?.emotionalTriggers || []).slice(0, 3).map((trigger, i) => (
                                  <li key={i}>• {trigger}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 rounded-xl p-6 border border-red-500/20">
                          <div className="text-lg font-semibold text-red-300 mb-4 flex items-center">
                            <span className="mr-2">⚠️</span>
                            Risks & Considerations
                          </div>
                          <div className="space-y-3">
                            <div>
                              <div className="text-sm text-red-400 font-medium mb-2">Potential Risks</div>
                              <ul className="text-xs text-slate-400 space-y-1">
                                {(trend.risksAndConsiderations?.backlashRisks || []).slice(0, 2).map((risk, i) => (
                                  <li key={i}>• {risk}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <div className="text-sm text-red-400 font-medium mb-2">Investment Required</div>
                              <ul className="text-xs text-slate-400 space-y-1">
                                {(trend.risksAndConsiderations?.investmentRequirements || []).slice(0, 2).map((req, i) => (
                                  <li key={i}>• {req}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-700/30">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => copyTrendData(trend)}
                      className="px-3 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 rounded-lg text-sm flex items-center space-x-1 transition-all duration-200"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </button>
                    <button className="px-3 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 rounded-lg text-sm flex items-center space-x-1 transition-all duration-200">
                      <ExternalLink className="w-4 h-4" />
                      <span>Research</span>
                    </button>
                  </div>
                  <button
                    onClick={() => onNavigateToGenerator?.(trend.title)}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 flex items-center space-x-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Content</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && searchResults.length === 0 && searchQuery && (
        <div className="bg-slate-800/50 rounded-xl p-8 backdrop-blur-sm border border-slate-700/50 text-center">
          <Search className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No trends found</h3>
          <p className="text-slate-400 mb-4">Try adjusting your search query or filters for better results.</p>
          <div className="flex justify-center space-x-3">
            <button
              onClick={() => setSearchQuery("")}
              className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 rounded-lg text-sm"
            >
              Clear Search
            </button>
            <button
              onClick={() => setShowAdvancedFilters(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm"
            >
              Adjust Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedTrendsSearch;
