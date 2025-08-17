import React, { useState, useMemo } from "react";

interface TrendComparisonData {
  id: string;
  keyword: string;
  color: string;
  data: {
    date: string;
    score: number;
    mentions: number;
    sentiment: number;
    volume: number;
  }[];
  metadata: {
    averageScore: number;
    peakScore: number;
    peakDate: string;
    totalMentions: number;
    growthRate: number;
    averageSentiment: number;
    category: string;
    sourceConfidence: number;
  };
  isActive: boolean;
}

interface ComparisonInsight {
  type: "leader" | "rising" | "declining" | "opportunity" | "threat";
  title: string;
  description: string;
  confidence: number;
  relatedTrends: string[];
}

interface TrendComparisonProps {
  isPremium: boolean;
  onUpgrade: () => void;
}

export const TrendComparison: React.FC<TrendComparisonProps> = ({
  isPremium,
  onUpgrade,
}) => {
  const [comparedTrends, setComparedTrends] = useState<TrendComparisonData[]>([]);
  const [activeView, setActiveView] = useState<"overview" | "detailed" | "insights" | "export">("overview");
  const [selectedMetric, setSelectedMetric] = useState<"score" | "mentions" | "sentiment" | "volume">("score");
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y">("30d");
  const [showAddTrendModal, setShowAddTrendModal] = useState(false);
  const [newTrendKeyword, setNewTrendKeyword] = useState("");
  const [isGeneratingData, setIsGeneratingData] = useState(false);
  const [comparisonMode, setComparisonMode] = useState<"side-by-side" | "overlay" | "correlation">("overlay");
  const [selectedTrends, setSelectedTrends] = useState<string[]>([]);

  const trendColors = [
    "#8b5cf6", "#ef4444", "#22c55e", "#f59e0b", "#06b6d4", 
    "#ec4899", "#8b5a2b", "#6366f1", "#84cc16", "#f97316"
  ];

  // Generate sample data for a trend
  const generateTrendData = (keyword: string, colorIndex: number): TrendComparisonData => {
    const now = new Date();
    const daysBack = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : timeRange === "90d" ? 90 : 365;
    
    const data = Array.from({ length: daysBack }, (_, i) => {
      const date = new Date(now.getTime() - (daysBack - 1 - i) * 24 * 60 * 60 * 1000);
      const baseScore = 30 + Math.random() * 40;
      const trend = Math.sin((i / daysBack) * Math.PI * 2) * 15;
      const noise = (Math.random() - 0.5) * 10;
      
      return {
        date: date.toISOString().split('T')[0],
        score: Math.max(0, Math.min(100, baseScore + trend + noise)),
        mentions: Math.floor(Math.random() * 2000) + 500,
        sentiment: Math.floor(Math.random() * 40) + 50,
        volume: Math.floor(Math.random() * 10000) + 1000
      };
    });

    const scores = data.map(d => d.score);
    const mentions = data.map(d => d.mentions);
    const sentiments = data.map(d => d.sentiment);
    
    return {
      id: Date.now().toString() + Math.random(),
      keyword,
      color: trendColors[colorIndex % trendColors.length],
      data,
      metadata: {
        averageScore: scores.reduce((a, b) => a + b, 0) / scores.length,
        peakScore: Math.max(...scores),
        peakDate: data[scores.indexOf(Math.max(...scores))].date,
        totalMentions: mentions.reduce((a, b) => a + b, 0),
        growthRate: ((scores[scores.length - 1] - scores[0]) / scores[0]) * 100,
        averageSentiment: sentiments.reduce((a, b) => a + b, 0) / sentiments.length,
        category: ["Technology", "Business", "Entertainment", "Health", "Science"][Math.floor(Math.random() * 5)],
        sourceConfidence: Math.floor(Math.random() * 30) + 70
      },
      isActive: true
    };
  };

  // Initialize with demo data for non-premium users
  React.useEffect(() => {
    if (!isPremium && comparedTrends.length === 0) {
      const demoTrends = [
        generateTrendData("AI automation", 0),
        generateTrendData("sustainable energy", 1),
        generateTrendData("remote work", 2)
      ];
      setComparedTrends(demoTrends);
    }
  }, [isPremium]);

  const addTrend = async () => {
    if (!newTrendKeyword.trim() || comparedTrends.length >= 5) return;
    
    setIsGeneratingData(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newTrend = generateTrendData(newTrendKeyword, comparedTrends.length);
    setComparedTrends(prev => [...prev, newTrend]);
    setNewTrendKeyword("");
    setShowAddTrendModal(false);
    setIsGeneratingData(false);
  };

  const removeTrend = (trendId: string) => {
    setComparedTrends(prev => prev.filter(trend => trend.id !== trendId));
    setSelectedTrends(prev => prev.filter(id => id !== trendId));
  };

  const toggleTrendVisibility = (trendId: string) => {
    setComparedTrends(prev => prev.map(trend => 
      trend.id === trendId ? { ...trend, isActive: !trend.isActive } : trend
    ));
  };

  const clearAllTrends = () => {
    setComparedTrends([]);
    setSelectedTrends([]);
  };

  // Generate comparison insights
  const insights = useMemo((): ComparisonInsight[] => {
    if (comparedTrends.length < 2) return [];

    const activeTrends = comparedTrends.filter(t => t.isActive);
    if (activeTrends.length < 2) return [];

    const insights: ComparisonInsight[] = [];

    // Find leader
    const leader = activeTrends.reduce((max, trend) => 
      trend.metadata.averageScore > max.metadata.averageScore ? trend : max
    );
    
    insights.push({
      type: "leader",
      title: `"${leader.keyword}" is the Performance Leader`,
      description: `With an average score of ${leader.metadata.averageScore.toFixed(1)}, "${leader.keyword}" consistently outperforms other tracked trends.`,
      confidence: 92,
      relatedTrends: [leader.keyword]
    });

    // Find fastest growing
    const fastestGrowing = activeTrends.reduce((max, trend) => 
      trend.metadata.growthRate > max.metadata.growthRate ? trend : max
    );

    if (fastestGrowing.metadata.growthRate > 10) {
      insights.push({
        type: "rising",
        title: `"${fastestGrowing.keyword}" Shows Strongest Growth`,
        description: `Growing at ${fastestGrowing.metadata.growthRate.toFixed(1)}% over the selected period, this trend shows the most momentum.`,
        confidence: 88,
        relatedTrends: [fastestGrowing.keyword]
      });
    }

    // Find declining trend
    const declining = activeTrends.find(trend => trend.metadata.growthRate < -10);
    if (declining) {
      insights.push({
        type: "declining",
        title: `"${declining.keyword}" Losing Momentum`,
        description: `With a ${Math.abs(declining.metadata.growthRate).toFixed(1)}% decline, this trend may be losing audience interest.`,
        confidence: 85,
        relatedTrends: [declining.keyword]
      });
    }

    // Find correlation opportunities
    if (activeTrends.length >= 3) {
      const highSentimentTrends = activeTrends.filter(t => t.metadata.averageSentiment > 70);
      if (highSentimentTrends.length >= 2) {
        insights.push({
          type: "opportunity",
          title: "High Sentiment Correlation Detected",
          description: `Multiple trends show positive sentiment (>70%), indicating potential content cross-pollination opportunities.`,
          confidence: 76,
          relatedTrends: highSentimentTrends.map(t => t.keyword)
        });
      }
    }

    return insights;
  }, [comparedTrends]);

  const exportData = () => {
    const exportData = {
      comparedTrends: comparedTrends.map(trend => ({
        keyword: trend.keyword,
        metadata: trend.metadata,
        dataPoints: trend.data.length
      })),
      insights,
      analysisDate: new Date().toISOString(),
      timeRange,
      selectedMetric
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `trend-comparison-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const renderChart = () => {
    if (comparedTrends.length === 0) {
      return (
        <div className="h-64 flex items-center justify-center text-slate-400">
          Add trends to see comparison chart
        </div>
      );
    }

    const activeTrends = comparedTrends.filter(t => t.isActive);
    if (activeTrends.length === 0) {
      return (
        <div className="h-64 flex items-center justify-center text-slate-400">
          Enable at least one trend to view chart
        </div>
      );
    }

    return (
      <div className="h-64 relative">
        {comparisonMode === "overlay" && (
          <div className="h-full flex items-end space-x-1">
            {activeTrends[0]?.data.map((_, index) => (
              <div key={index} className="flex-1 relative">
                {activeTrends.map((trend, trendIndex) => {
                  const value = trend.data[index]?.[selectedMetric] || 0;
                  const height = selectedMetric === "score" || selectedMetric === "sentiment" 
                    ? (value / 100) * 100 
                    : (value / Math.max(...activeTrends.flatMap(t => t.data.map(d => d[selectedMetric])))) * 100;
                  
                  return (
                    <div
                      key={`${trend.id}-${index}`}
                      className="absolute bottom-0 w-full opacity-70 hover:opacity-100 transition-opacity rounded-t"
                      style={{ 
                        background: trend.color,
                        height: `${height}%`,
                        transform: `translateX(${trendIndex * 2}px)`,
                        zIndex: activeTrends.length - trendIndex
                      }}
                      title={`${trend.keyword}: ${value.toFixed(1)}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {comparisonMode === "side-by-side" && (
          <div className="h-full grid gap-2" style={{ gridTemplateColumns: `repeat(${activeTrends.length}, 1fr)` }}>
            {activeTrends.map((trend) => (
              <div key={trend.id} className="flex flex-col">
                <div className="text-xs text-center mb-2 text-slate-300 truncate">{trend.keyword}</div>
                <div className="flex-1 flex items-end space-x-1">
                  {trend.data.map((data, index) => {
                    const value = data[selectedMetric];
                    const height = selectedMetric === "score" || selectedMetric === "sentiment" 
                      ? (value / 100) * 100 
                      : (value / Math.max(...trend.data.map(d => d[selectedMetric]))) * 100;
                    
                    return (
                      <div
                        key={index}
                        className="flex-1 rounded-t transition-all hover:opacity-80"
                        style={{ 
                          background: trend.color,
                          height: `${height}%`
                        }}
                        title={`${data.date}: ${value.toFixed(1)}`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Chart Section */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Trend Comparison Chart</h3>
          <div className="flex items-center space-x-3">
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value as any)}
              className="px-3 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm"
            >
              <option value="score">Score</option>
              <option value="mentions">Mentions</option>
              <option value="sentiment">Sentiment</option>
              <option value="volume">Volume</option>
            </select>
            <select
              value={comparisonMode}
              onChange={(e) => setComparisonMode(e.target.value as any)}
              className="px-3 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm"
            >
              <option value="overlay">Overlay</option>
              <option value="side-by-side">Side by Side</option>
            </select>
          </div>
        </div>
        
        {renderChart()}
        
        <div className="flex justify-between mt-4 text-sm text-slate-400">
          <span>{timeRange} ago</span>
          <span>Now</span>
        </div>
      </div>

      {/* Trend Legend and Controls */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Active Trends</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAddTrendModal(true)}
              disabled={comparedTrends.length >= 5}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg text-white text-sm font-medium"
            >
              + Add Trend
            </button>
            {comparedTrends.length > 0 && (
              <button
                onClick={clearAllTrends}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm font-medium"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {comparedTrends.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No Trends to Compare</h3>
            <p className="text-slate-400 mb-4">Add 2 or more trends to start comparing performance</p>
            <button
              onClick={() => setShowAddTrendModal(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium"
            >
              Add Your First Trend
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {comparedTrends.map((trend) => (
              <div key={trend.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: trend.color }}
                  />
                  <div>
                    <h4 className="font-medium text-white">{trend.keyword}</h4>
                    <div className="flex items-center space-x-4 text-xs text-slate-400">
                      <span>Avg: {trend.metadata.averageScore.toFixed(1)}</span>
                      <span>Peak: {trend.metadata.peakScore.toFixed(1)}</span>
                      <span className={`${
                        trend.metadata.growthRate > 0 ? "text-green-400" : "text-red-400"
                      }`}>
                        {trend.metadata.growthRate > 0 ? "+" : ""}{trend.metadata.growthRate.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleTrendVisibility(trend.id)}
                    className={`px-3 py-1 rounded text-sm ${
                      trend.isActive
                        ? "bg-green-600/20 text-green-400 border border-green-500/30"
                        : "bg-slate-600/20 text-slate-400 border border-slate-500/30"
                    }`}
                  >
                    {trend.isActive ? "👁️ Visible" : "🚫 Hidden"}
                  </button>
                  <button
                    onClick={() => removeTrend(trend.id)}
                    className="px-3 py-1 bg-red-600/20 text-red-400 border border-red-500/30 rounded text-sm hover:bg-red-600/30"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      {comparedTrends.length > 1 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <h4 className="font-medium text-white mb-2">Best Performer</h4>
            <p className="text-lg font-bold text-green-400">
              {comparedTrends.reduce((max, trend) => 
                trend.metadata.averageScore > max.metadata.averageScore ? trend : max
              ).keyword}
            </p>
            <p className="text-sm text-slate-400">
              Avg score: {comparedTrends.reduce((max, trend) => 
                trend.metadata.averageScore > max.metadata.averageScore ? trend : max
              ).metadata.averageScore.toFixed(1)}
            </p>
          </div>

          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <h4 className="font-medium text-white mb-2">Fastest Growing</h4>
            <p className="text-lg font-bold text-blue-400">
              {comparedTrends.reduce((max, trend) => 
                trend.metadata.growthRate > max.metadata.growthRate ? trend : max
              ).keyword}
            </p>
            <p className="text-sm text-slate-400">
              Growth: +{comparedTrends.reduce((max, trend) => 
                trend.metadata.growthRate > max.metadata.growthRate ? trend : max
              ).metadata.growthRate.toFixed(1)}%
            </p>
          </div>

          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <h4 className="font-medium text-white mb-2">Most Mentioned</h4>
            <p className="text-lg font-bold text-purple-400">
              {comparedTrends.reduce((max, trend) => 
                trend.metadata.totalMentions > max.metadata.totalMentions ? trend : max
              ).keyword}
            </p>
            <p className="text-sm text-slate-400">
              {comparedTrends.reduce((max, trend) => 
                trend.metadata.totalMentions > max.metadata.totalMentions ? trend : max
              ).metadata.totalMentions.toLocaleString()} mentions
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const renderDetailed = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Detailed Analysis</h3>
      
      {comparedTrends.map((trend) => (
        <div key={trend.id} className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div
              className="w-6 h-6 rounded-full"
              style={{ backgroundColor: trend.color }}
            />
            <h4 className="text-xl font-semibold text-white">{trend.keyword}</h4>
            <span className="px-3 py-1 bg-slate-700 text-slate-300 text-sm rounded-full">
              {trend.metadata.category}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <div>
              <p className="text-slate-400 text-sm">Average Score</p>
              <p className="text-2xl font-bold text-white">{trend.metadata.averageScore.toFixed(1)}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Peak Score</p>
              <p className="text-2xl font-bold text-white">{trend.metadata.peakScore.toFixed(1)}</p>
              <p className="text-slate-500 text-xs">{trend.metadata.peakDate}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Growth Rate</p>
              <p className={`text-2xl font-bold ${
                trend.metadata.growthRate > 0 ? "text-green-400" : "text-red-400"
              }`}>
                {trend.metadata.growthRate > 0 ? "+" : ""}{trend.metadata.growthRate.toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Total Mentions</p>
              <p className="text-2xl font-bold text-white">{trend.metadata.totalMentions.toLocaleString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium text-white mb-2">Sentiment Analysis</h5>
              <div className="flex items-center space-x-3">
                <div className="flex-1 bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full"
                    style={{ width: `${trend.metadata.averageSentiment}%` }}
                  />
                </div>
                <span className="text-white font-medium">{trend.metadata.averageSentiment.toFixed(1)}%</span>
              </div>
            </div>

            <div>
              <h5 className="font-medium text-white mb-2">Data Confidence</h5>
              <div className="flex items-center space-x-3">
                <div className="flex-1 bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${trend.metadata.sourceConfidence}%` }}
                  />
                </div>
                <span className="text-white font-medium">{trend.metadata.sourceConfidence}%</span>
              </div>
            </div>
          </div>

          {/* Mini trend line */}
          <div className="mt-6">
            <h5 className="font-medium text-white mb-2">Performance Timeline</h5>
            <div className="h-12 flex items-end space-x-1">
              {trend.data.slice(-30).map((data, index) => (
                <div
                  key={index}
                  className="flex-1 rounded-t transition-all hover:opacity-80"
                  style={{ 
                    background: trend.color,
                    height: `${(data[selectedMetric] / 100) * 100}%`
                  }}
                  title={`${data.date}: ${data[selectedMetric].toFixed(1)}`}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderInsights = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Comparison Insights</h3>
      
      {insights.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🧠</span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No Insights Available</h3>
          <p className="text-slate-400">Add at least 2 trends to generate comparison insights</p>
        </div>
      ) : (
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div key={index} className="p-6 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className={`text-2xl ${
                    insight.type === "leader" ? "🏆" :
                    insight.type === "rising" ? "📈" :
                    insight.type === "declining" ? "📉" :
                    insight.type === "opportunity" ? "💡" : "⚠️"
                  }`}>
                    {insight.type === "leader" ? "🏆" :
                     insight.type === "rising" ? "📈" :
                     insight.type === "declining" ? "📉" :
                     insight.type === "opportunity" ? "💡" : "⚠️"}
                  </span>
                  <div>
                    <h4 className="font-semibold text-white">{insight.title}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                        {insight.confidence}% confidence
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        insight.type === "leader" ? "bg-yellow-500/20 text-yellow-300" :
                        insight.type === "rising" ? "bg-green-500/20 text-green-300" :
                        insight.type === "declining" ? "bg-red-500/20 text-red-300" :
                        insight.type === "opportunity" ? "bg-blue-500/20 text-blue-300" :
                        "bg-orange-500/20 text-orange-300"
                      }`}>
                        {insight.type}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-slate-300 mb-3">{insight.description}</p>
              
              <div>
                <span className="text-slate-400 text-sm">Related trends: </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {insight.relatedTrends.map((trendName, i) => (
                    <span key={`related-trend-${i}`} className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded">
                      {trendName}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderExport = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Export & Share</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
          <h4 className="font-semibold text-white mb-4">Export Options</h4>
          <div className="space-y-3">
            <button
              onClick={exportData}
              className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-left flex items-center space-x-3"
            >
              <span>📊</span>
              <span>Export as JSON</span>
            </button>
            <button className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white text-left flex items-center space-x-3">
              <span>📄</span>
              <span>Generate PDF Report</span>
            </button>
            <button className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-left flex items-center space-x-3">
              <span>📈</span>
              <span>Export to Excel</span>
            </button>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
          <h4 className="font-semibold text-white mb-4">Share Settings</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Include Raw Data</span>
              <input type="checkbox" defaultChecked className="rounded bg-slate-700 border-slate-600" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Include Insights</span>
              <input type="checkbox" defaultChecked className="rounded bg-slate-700 border-slate-600" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Watermark</span>
              <input type="checkbox" className="rounded bg-slate-700 border-slate-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
        <h4 className="font-semibold text-white mb-4">Comparison Summary</h4>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-slate-400">Trends Compared:</span>
            <span className="text-white font-medium">{comparedTrends.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Time Range:</span>
            <span className="text-white font-medium">{timeRange}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Data Points:</span>
            <span className="text-white font-medium">
              {comparedTrends.length > 0 ? comparedTrends[0].data.length : 0} per trend
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Generated Insights:</span>
            <span className="text-white font-medium">{insights.length}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
              Trend Comparison
            </h1>
            <p className="text-slate-400 text-sm">
              Compare multiple trends side by side
            </p>
          </div>
          <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full border border-cyan-500/30">
            <span className="text-cyan-400 text-xl">⚔️</span>
            <span className="text-cyan-300 text-sm font-semibold">
              Competitive Analysis
            </span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {[
              { key: "overview", label: "Overview", icon: "📊" },
              { key: "detailed", label: "Detailed", icon: "🔍" },
              { key: "insights", label: "Insights", icon: "🧠" },
              { key: "export", label: "Export", icon: "📤" }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveView(tab.key as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeView === tab.key
                    ? "bg-cyan-600 text-white"
                    : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-2">
            {(["7d", "30d", "90d", "1y"] as const).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded text-sm ${
                  timeRange === range
                    ? "bg-cyan-600 text-white"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 overflow-auto">
        {!isPremium && comparedTrends.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Premium Feature</h3>
            <p className="text-slate-400 mb-4">Unlock trend comparison and competitive analysis</p>
            <button
              onClick={onUpgrade}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg text-white font-semibold"
            >
              Upgrade to Premium
            </button>
          </div>
        ) : (
          <>
            {activeView === "overview" && renderOverview()}
            {activeView === "detailed" && renderDetailed()}
            {activeView === "insights" && renderInsights()}
            {activeView === "export" && renderExport()}
          </>
        )}
      </div>

      {/* Add Trend Modal */}
      {showAddTrendModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Add Trend to Comparison</h3>
              <button
                onClick={() => setShowAddTrendModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Keyword or Phrase
                </label>
                <input
                  type="text"
                  value={newTrendKeyword}
                  onChange={(e) => setNewTrendKeyword(e.target.value)}
                  placeholder="e.g., sustainable fashion, AI chatbots"
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400"
                />
              </div>

              <div className="bg-slate-700/30 rounded-lg p-3">
                <p className="text-slate-300 text-sm">
                  💡 <strong>Tip:</strong> Compare trends in similar categories for best insights.
                  You can add up to 5 trends for comparison.
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddTrendModal(false)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white"
                  disabled={isGeneratingData}
                >
                  Cancel
                </button>
                <button
                  onClick={addTrend}
                  disabled={!newTrendKeyword.trim() || isGeneratingData}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white disabled:opacity-50 flex items-center space-x-2"
                >
                  {isGeneratingData ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Adding...</span>
                    </>
                  ) : (
                    <span>Add Trend</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
