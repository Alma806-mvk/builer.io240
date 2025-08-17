import React, { useState, useEffect, useMemo } from "react";
import { TrendAnalysisOutput } from "../types";
import {
  Button,
  Card,
  Badge,
  StatCard,
  TabHeader,
  GradientText,
} from "./ui/WorldClassComponents";

interface TrendAnalyticsDashboardProps {
  trendData: TrendAnalysisOutput | null;
  isPremium: boolean;
  onUpgrade: () => void;
  onSwitchToGenerator?: (contentType: string, title: string) => void;
  onCopyToClipboard?: (text: string) => void;
  onSendToCalendar?: (idea: { type: string; title: string; trend: string }) => void;
}

interface Insight {
  id: string;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  category: "opportunity" | "threat" | "neutral";
  actionable: boolean;
  source: string;
  confidence: number;
}

interface MetricData {
  label: string;
  value: number;
  change: number;
  trend: "up" | "down" | "stable";
  unit: string;
}

export const TrendAnalyticsDashboard: React.FC<TrendAnalyticsDashboardProps> = ({
  trendData,
  isPremium,
  onUpgrade,
  onSwitchToGenerator,
  onCopyToClipboard,
  onSendToCalendar,
}) => {
  const [activeView, setActiveView] = useState<"overview" | "insights" | "metrics" | "timeline" | "competitors">("overview");
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d" | "90d">("30d");
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [favoriteInsights, setFavoriteInsights] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    impact: [] as string[],
    category: [] as string[],
    source: [] as string[]
  });

  // Live data simulation
  useEffect(() => {
    if (!isLiveMode) return;
    
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [isLiveMode]);

  // Generate insights from trend data
  const insights = useMemo((): Insight[] => {
    if (!trendData) return [];

    const generated: Insight[] = [];

    // Volume-based insights
    if (trendData.volume) {
      if (trendData.volume > 1000000) {
        generated.push({
          id: "volume-high",
          title: "High Volume Trend Detected",
          description: `${trendData.query} has exceptionally high search volume (${trendData.volume.toLocaleString()}). This presents a major opportunity for viral content.`,
          impact: "high",
          category: "opportunity",
          actionable: true,
          source: "Volume Analysis",
          confidence: 95
        });
      } else if (trendData.volume < 10000) {
        generated.push({
          id: "volume-niche",
          title: "Niche Market Opportunity",
          description: `Lower competition for "${trendData.query}" creates opportunity for targeted content with high conversion potential.`,
          impact: "medium",
          category: "opportunity",
          actionable: true,
          source: "Volume Analysis",
          confidence: 78
        });
      }
    }

    // Sentiment-based insights
    if (trendData.sentiment && trendData.sentiment > 70) {
      generated.push({
        id: "sentiment-positive",
        title: "Positive Market Sentiment",
        description: `Strong positive sentiment (${trendData.sentiment}%) around "${trendData.query}" indicates high audience receptivity.`,
        impact: "high",
        category: "opportunity",
        actionable: true,
        source: "Sentiment Analysis",
        confidence: 88
      });
    } else if (trendData.sentiment && trendData.sentiment < 40) {
      generated.push({
        id: "sentiment-negative",
        title: "Sentiment Concerns",
        description: `Negative sentiment (${trendData.sentiment}%) requires careful messaging approach for "${trendData.query}".`,
        impact: "medium",
        category: "threat",
        actionable: true,
        source: "Sentiment Analysis",
        confidence: 82
      });
    }

    // Geographic insights
    if (trendData.regional_interest && trendData.regional_interest.length > 0) {
      const topRegion = trendData.regional_interest[0];
      generated.push({
        id: "geo-concentration",
        title: "Geographic Concentration",
        description: `Highest interest in ${topRegion.region} (${topRegion.value}% relative interest). Consider region-specific content strategies.`,
        impact: "medium",
        category: "opportunity",
        actionable: true,
        source: "Geographic Analysis",
        confidence: 85
      });
    }

    // Competition insights
    if (trendData.related_queries && trendData.related_queries.length > 5) {
      generated.push({
        id: "competition-high",
        title: "High Competition Space",
        description: `${trendData.related_queries.length} related queries indicate competitive landscape. Focus on unique angles and long-tail keywords.`,
        impact: "medium",
        category: "threat",
        actionable: true,
        source: "Competition Analysis",
        confidence: 76
      });
    }

    // Timing insights
    const currentHour = new Date().getHours();
    if (currentHour >= 9 && currentHour <= 17) {
      generated.push({
        id: "timing-optimal",
        title: "Optimal Posting Window",
        description: "Current time falls within peak engagement hours (9 AM - 5 PM). Consider publishing content now for maximum reach.",
        impact: "medium",
        category: "opportunity",
        actionable: true,
        source: "Timing Analysis",
        confidence: 72
      });
    }

    return generated;
  }, [trendData]);

  // Filter insights based on selected filters
  const filteredInsights = useMemo(() => {
    return insights.filter(insight => {
      if (selectedFilters.impact.length > 0 && !selectedFilters.impact.includes(insight.impact)) return false;
      if (selectedFilters.category.length > 0 && !selectedFilters.category.includes(insight.category)) return false;
      if (selectedFilters.source.length > 0 && !selectedFilters.source.includes(insight.source)) return false;
      return true;
    });
  }, [insights, selectedFilters]);

  // Generate metrics from trend data
  const metrics = useMemo((): MetricData[] => {
    if (!trendData) return [];

    return [
      {
        label: "Search Volume",
        value: trendData.volume || 0,
        change: Math.floor(Math.random() * 40) - 20,
        trend: Math.random() > 0.5 ? "up" : "down",
        unit: "searches"
      },
      {
        label: "Interest Score",
        value: trendData.score || 0,
        change: Math.floor(Math.random() * 30) - 15,
        trend: Math.random() > 0.4 ? "up" : "down",
        unit: "points"
      },
      {
        label: "Sentiment",
        value: trendData.sentiment || 50,
        change: Math.floor(Math.random() * 20) - 10,
        trend: Math.random() > 0.6 ? "up" : "stable",
        unit: "%"
      },
      {
        label: "Regions Active",
        value: trendData.regional_interest?.length || 0,
        change: Math.floor(Math.random() * 10) - 5,
        trend: "up",
        unit: "regions"
      },
      {
        label: "Related Keywords",
        value: trendData.related_queries?.length || 0,
        change: Math.floor(Math.random() * 15) - 7,
        trend: Math.random() > 0.3 ? "up" : "stable",
        unit: "keywords"
      },
      {
        label: "Opportunity Score",
        value: Math.floor((trendData.score || 50) * 1.2),
        change: Math.floor(Math.random() * 25) - 12,
        trend: Math.random() > 0.5 ? "up" : "down",
        unit: "points"
      }
    ];
  }, [trendData]);

  const toggleInsightFavorite = (insightId: string) => {
    setFavoriteInsights(prev => 
      prev.includes(insightId) 
        ? prev.filter(id => id !== insightId)
        : [...prev, insightId]
    );
  };

  const toggleFilter = (category: 'impact' | 'category' | 'source', value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(v => v !== value)
        : [...prev[category], value]
    }));
  };

  const generateContentIdea = (insight: Insight) => {
    const ideas = [
      `How ${trendData?.query} is changing the game`,
      `5 things you need to know about ${trendData?.query}`,
      `The future of ${trendData?.query}: Expert predictions`,
      `Why ${trendData?.query} matters for your business`,
      `${trendData?.query} explained in simple terms`
    ];
    
    const randomIdea = ideas[Math.floor(Math.random() * ideas.length)];
    
    if (onSwitchToGenerator) {
      onSwitchToGenerator("Text", randomIdea);
    }
  };

  const exportInsight = (insight: Insight) => {
    const exportData = {
      title: insight.title,
      description: insight.description,
      impact: insight.impact,
      category: insight.category,
      confidence: insight.confidence,
      source: insight.source,
      exportedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `insight-${insight.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.slice(0, 6).map((metric, index) => (
          <StatCard
            key={`metric-${index}`}
            title={metric.label}
            value={metric.value.toLocaleString()}
            change={`${metric.change > 0 ? "+" : ""}${metric.change}%`}
            changeType={metric.change > 0 ? "positive" : metric.change < 0 ? "negative" : "neutral"}
            icon={<span>{metric.trend === "up" ? "📈" : metric.trend === "down" ? "📉" : "➡️"}</span>}
            description={`vs ${timeRange}`}
          />
        ))}
      </div>

      {/* Quick Insights Preview */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="heading-4">Top Insights</h3>
          <Button variant="ghost" size="sm" onClick={() => setActiveView("insights")}>
            View All →
          </Button>
        </div>
        <div className="space-y-3">
          {insights.slice(0, 3).map((insight) => (
            <div key={insight.id} className="p-3 bg-[var(--surface-tertiary)] rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-[var(--text-primary)] mb-1">{insight.title}</h4>
                  <p className="text-[var(--text-secondary)] text-sm">{insight.description}</p>
                </div>
                <Badge
                  variant={
                    insight.impact === "high" ? "error" :
                    insight.impact === "medium" ? "warning" : "success"
                  }
                >
                  {insight.impact}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Trend Summary */}
      {trendData && (
        <Card>
          <h3 className="heading-4 mb-4">Trend Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-[var(--text-primary)] mb-2">Search Query</h4>
              <p className="text-[var(--text-secondary)] mb-4">"{trendData.query}"</p>

              <h4 className="font-medium text-[var(--text-primary)] mb-2">Description</h4>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                {trendData.description || "This trend represents current market interest and search behavior patterns."}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-[var(--text-primary)] mb-2">Key Statistics</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Volume:</span>
                  <span className="text-[var(--text-primary)] font-medium">{trendData.volume?.toLocaleString() || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Score:</span>
                  <span className="text-[var(--text-primary)] font-medium">{trendData.score || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Sentiment:</span>
                  <span className="text-[var(--text-primary)] font-medium">{trendData.sentiment}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Related Terms:</span>
                  <span className="text-[var(--text-primary)] font-medium">{trendData.related_queries?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );

  const renderInsights = () => (
    <div className="space-y-6">
      {/* Filters and Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-white">AI Insights</h3>
          <span className="px-3 py-1 bg-purple-600/20 text-purple-300 text-sm rounded-full">
            {filteredInsights.length} insights
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white text-sm"
          >
            🔍 Filters
          </button>
          <button
            onClick={() => setIsLiveMode(!isLiveMode)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              isLiveMode 
                ? "bg-green-600 hover:bg-green-700 text-white" 
                : "bg-slate-700 hover:bg-slate-600 text-white"
            }`}
          >
            {isLiveMode ? "🟢 Live" : "⚪ Static"}
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium text-white mb-2">Impact Level</h4>
              <div className="space-y-2">
                {["high", "medium", "low"].map(impact => (
                  <label key={impact} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedFilters.impact.includes(impact)}
                      onChange={() => toggleFilter("impact", impact)}
                      className="rounded bg-slate-700 border-slate-600"
                    />
                    <span className="text-slate-300 capitalize">{impact}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">Category</h4>
              <div className="space-y-2">
                {["opportunity", "threat", "neutral"].map(category => (
                  <label key={category} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedFilters.category.includes(category)}
                      onChange={() => toggleFilter("category", category)}
                      className="rounded bg-slate-700 border-slate-600"
                    />
                    <span className="text-slate-300 capitalize">{category}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">Source</h4>
              <div className="space-y-2">
                {Array.from(new Set(insights.map(i => i.source))).map(source => (
                  <label key={source} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedFilters.source.includes(source)}
                      onChange={() => toggleFilter("source", source)}
                      className="rounded bg-slate-700 border-slate-600"
                    />
                    <span className="text-slate-300">{source}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Insights List */}
      <div className="space-y-4">
        {filteredInsights.map((insight) => (
          <div key={insight.id} className="p-6 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-semibold text-white">{insight.title}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    insight.impact === "high" ? "bg-red-500/20 text-red-400" :
                    insight.impact === "medium" ? "bg-yellow-500/20 text-yellow-400" :
                    "bg-green-500/20 text-green-400"
                  }`}>
                    {insight.impact.toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    insight.category === "opportunity" ? "bg-green-500/20 text-green-400" :
                    insight.category === "threat" ? "bg-red-500/20 text-red-400" :
                    "bg-slate-500/20 text-slate-400"
                  }`}>
                    {insight.category === "opportunity" ? "📈" : insight.category === "threat" ? "⚠️" : "ℹ️"} {insight.category}
                  </span>
                </div>
                <p className="text-slate-300 mb-3">{insight.description}</p>
                <div className="flex items-center space-x-4 text-sm text-slate-400">
                  <span>📊 {insight.source}</span>
                  <span>🎯 {insight.confidence}% confidence</span>
                  {insight.actionable && <span>✅ Actionable</span>}
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => toggleInsightFavorite(insight.id)}
                  className={`p-2 rounded-lg ${
                    favoriteInsights.includes(insight.id)
                      ? "bg-yellow-600/20 text-yellow-400"
                      : "bg-slate-700 text-slate-400 hover:text-white"
                  }`}
                >
                  ⭐
                </button>
                <button
                  onClick={() => generateContentIdea(insight)}
                  className="px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-sm"
                >
                  Generate Content
                </button>
                <button
                  onClick={() => exportInsight(insight)}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm"
                >
                  Export
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredInsights.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔍</span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No Insights Found</h3>
          <p className="text-slate-400">Try adjusting your filters or run a new trend analysis.</p>
        </div>
      )}
    </div>
  );

  const renderMetrics = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Performance Metrics</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-400">Last updated:</span>
          <span className="text-sm text-slate-300">{lastUpdate.toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Detailed Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {metrics.map((metric, index) => (
          <div key={`detailed-metric-${index}`} className="p-6 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-white">{metric.label}</h4>
              <span className={`text-sm px-3 py-1 rounded-full ${
                metric.trend === "up" ? "bg-green-500/20 text-green-400" :
                metric.trend === "down" ? "bg-red-500/20 text-red-400" :
                "bg-slate-500/20 text-slate-400"
              }`}>
                {metric.trend === "up" ? "📈 Rising" : metric.trend === "down" ? "📉 Falling" : "➡️ Stable"}
              </span>
            </div>
            
            <div className="flex items-baseline space-x-2 mb-3">
              <span className="text-3xl font-bold text-white">
                {metric.value.toLocaleString()}
              </span>
              <span className="text-slate-400">{metric.unit}</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${
                metric.change > 0 ? "text-green-400" : 
                metric.change < 0 ? "text-red-400" : "text-slate-400"
              }`}>
                {metric.change > 0 ? "+" : ""}{metric.change}%
              </span>
              <span className="text-slate-400 text-sm">vs {timeRange}</span>
            </div>

            {/* Mini progress bar */}
            <div className="mt-4">
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    metric.trend === "up" ? "bg-green-500" :
                    metric.trend === "down" ? "bg-red-500" : "bg-slate-500"
                  }`}
                  style={{ width: `${Math.min(100, Math.max(5, metric.value / 10))}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Performance Summary */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
        <h4 className="font-semibold text-white mb-4">Performance Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {metrics.filter(m => m.trend === "up").length}
            </div>
            <div className="text-sm text-slate-400">Improving Metrics</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400 mb-1">
              {metrics.filter(m => m.trend === "down").length}
            </div>
            <div className="text-sm text-slate-400">Declining Metrics</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-400 mb-1">
              {metrics.filter(m => m.trend === "stable").length}
            </div>
            <div className="text-sm text-slate-400">Stable Metrics</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTimeline = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Trend Timeline</h3>
        <div className="flex items-center space-x-2">
          {(["24h", "7d", "30d", "90d"] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-lg text-sm ${
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

      {/* Timeline Chart Placeholder */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
        <h4 className="font-semibold text-white mb-4">Interest Over Time</h4>
        <div className="h-64 flex items-end space-x-2">
          {Array.from({ length: 30 }, (_, i) => (
            <div
              key={`chart-bar-${i}`}
              className="flex-1 bg-gradient-to-t from-purple-600 to-blue-500 rounded-t"
              style={{ height: `${Math.random() * 100}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-4 text-sm text-slate-400">
          <span>{timeRange} ago</span>
          <span>Now</span>
        </div>
      </div>

      {/* Key Events */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
        <h4 className="font-semibold text-white mb-4">Key Events</h4>
        <div className="space-y-4">
          {[
            { date: "2025-07-20", event: "Peak interest detected", impact: "high" },
            { date: "2025-07-18", event: "Social media spike", impact: "medium" },
            { date: "2025-07-15", event: "News coverage increase", impact: "medium" },
            { date: "2025-07-12", event: "Influencer mention", impact: "low" }
          ].map((event, index) => (
            <div key={`event-${index}`} className="flex items-center space-x-4 p-3 bg-slate-700/30 rounded-lg">
              <div className={`w-3 h-3 rounded-full ${
                event.impact === "high" ? "bg-red-500" :
                event.impact === "medium" ? "bg-yellow-500" : "bg-green-500"
              }`} />
              <div className="flex-1">
                <p className="text-white font-medium">{event.event}</p>
                <p className="text-slate-400 text-sm">{event.date}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                event.impact === "high" ? "bg-red-500/20 text-red-400" :
                event.impact === "medium" ? "bg-yellow-500/20 text-yellow-400" :
                "bg-green-500/20 text-green-400"
              }`}>
                {event.impact}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCompetitors = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Competitive Analysis</h3>
      
      {!isPremium ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔒</span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Premium Feature</h3>
          <p className="text-slate-400 mb-4">Unlock competitor analysis and market intelligence</p>
          <button
            onClick={onUpgrade}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg text-white font-semibold"
          >
            Upgrade to Premium
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Competitor comparison would go here */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
            <h4 className="font-semibold text-white mb-4">Top Competitors</h4>
            <div className="space-y-4">
              {[
                { name: "Competitor A", score: 85, trend: "up" },
                { name: "Competitor B", score: 72, trend: "down" },
                { name: "Competitor C", score: 68, trend: "stable" }
              ].map((comp, index) => (
                <div key={`competitor-${index}`} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <span className="text-white font-medium">{comp.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-white">{comp.score}</span>
                    <span className={`text-sm ${
                      comp.trend === "up" ? "text-green-400" :
                      comp.trend === "down" ? "text-red-400" : "text-slate-400"
                    }`}>
                      {comp.trend === "up" ? "↗" : comp.trend === "down" ? "↘" : "→"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <TabHeader
        title="Analytics Dashboard"
        subtitle={trendData ? `Analysis for "${trendData.query}"` : "No trend data available"}
        icon={<span className="text-xl">📊</span>}
        badge="Advanced Analytics"
      />

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-[var(--surface-tertiary)] p-1 rounded-xl overflow-x-auto mb-6">
        {[
          { key: "overview", label: "Overview", icon: "📊" },
          { key: "insights", label: "AI Insights", icon: "🧠" },
          { key: "metrics", label: "Metrics", icon: "📈" },
          { key: "timeline", label: "Timeline", icon: "⏰" },
          { key: "competitors", label: "Competitors", icon: "⚔️", premium: !isPremium }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveView(tab.key as any)}
            className={`flex items-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
              activeView === tab.key
                ? "bg-[var(--brand-primary)] text-white shadow-lg"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-quaternary)]"
            }`}
          >
            <span>{tab.icon}</span>
            <span className="flex items-center space-x-1">
              <span>{tab.label}</span>
              {tab.premium && (
                <Badge variant="primary" className="text-xs ml-1 px-2 py-0.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">Pro</Badge>
              )}
            </span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="p-6 overflow-auto">
        {!trendData ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No Trend Data Available</h3>
            <p className="text-slate-400">Run a trend analysis first to view analytics dashboard</p>
          </div>
        ) : (
          <>
            {activeView === "overview" && renderOverview()}
            {activeView === "insights" && renderInsights()}
            {activeView === "metrics" && renderMetrics()}
            {activeView === "timeline" && renderTimeline()}
            {activeView === "competitors" && renderCompetitors()}
          </>
        )}
      </div>

      {/* Selected Insight Modal */}
      {selectedInsight && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Insight Details</h3>
              <button
                onClick={() => setSelectedInsight(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-white mb-2">{selectedInsight.title}</h4>
                <p className="text-slate-300">{selectedInsight.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 text-sm">Impact:</span>
                  <p className="text-white font-medium">{selectedInsight.impact}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-sm">Confidence:</span>
                  <p className="text-white font-medium">{selectedInsight.confidence}%</p>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedInsight(null)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white"
                >
                  Close
                </button>
                <button
                  onClick={() => generateContentIdea(selectedInsight)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white"
                >
                  Generate Content
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
