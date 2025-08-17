import React, { useState, useEffect } from "react";
import { Platform, ContentType } from "../../types";

// ============================================================================
// CONTENT ANALYTICS & INSIGHTS SYSTEM
// ============================================================================

interface ContentMetrics {
  engagement_rate: number;
  reach_potential: number;
  virality_score: number;
  monetization_score: number;
  competition_level: "low" | "medium" | "high";
  optimal_posting_time: string;
  trending_keywords: string[];
  content_gaps: string[];
  audience_sentiment: "positive" | "neutral" | "negative";
  performance_prediction: {
    views: number;
    likes: number;
    shares: number;
    comments: number;
  };
}

interface TrendAnalysis {
  rising_topics: string[];
  declining_topics: string[];
  seasonal_opportunities: string[];
  competitor_insights: string[];
  content_format_trends: string[];
}

interface AudienceInsights {
  primary_demographics: string[];
  interests: string[];
  pain_points: string[];
  content_preferences: string[];
  engagement_patterns: string[];
}

interface ContentInsightsPanelProps {
  userInput: string;
  platform: Platform;
  contentType: ContentType;
  isVisible: boolean;
  onClose: () => void;
}

// ============================================================================
// ADVANCED ANALYTICS ENGINE
// ============================================================================

class ContentAnalyticsEngine {
  // Analyze content for performance metrics
  analyzeContent(
    input: string,
    platform: Platform,
    contentType: ContentType,
  ): ContentMetrics {
    const words = input.toLowerCase().split(" ");
    const wordCount = words.length;

    // Calculate engagement rate based on content characteristics
    let engagement_rate = 0.5; // Base rate

    // Boost for trending keywords
    const trendingKeywords = [
      "ai",
      "productivity",
      "growth",
      "success",
      "tips",
      "secrets",
      "hacks",
    ];
    const foundTrendingWords = words.filter((word) =>
      trendingKeywords.includes(word),
    );
    engagement_rate += foundTrendingWords.length * 0.1;

    // Platform-specific adjustments
    const platformMultipliers = {
      [Platform.TikTok]: 1.5,
      [Platform.Instagram]: 1.2,
      [Platform.YouTube]: 1.0,
      [Platform.LinkedIn]: 0.8,
      [Platform.Twitter]: 1.1,
      [Platform.Facebook]: 0.9,
    };
    engagement_rate *= platformMultipliers[platform];

    // Content type adjustments
    if (contentType === ContentType.Idea) {
      engagement_rate += 0.1;
    }

    // Word count optimization
    const optimalLength = {
      [Platform.TikTok]: 10,
      [Platform.Instagram]: 15,
      [Platform.YouTube]: 20,
      [Platform.LinkedIn]: 25,
      [Platform.Twitter]: 12,
      [Platform.Facebook]: 18,
    };

    const lengthScore = Math.max(
      0,
      1 -
        Math.abs(wordCount - optimalLength[platform]) / optimalLength[platform],
    );
    engagement_rate = Math.min(1, engagement_rate * (0.5 + lengthScore * 0.5));

    // Calculate other metrics
    const reach_potential = Math.min(
      1,
      engagement_rate * 1.2 + Math.random() * 0.2,
    );
    const virality_score =
      engagement_rate * 0.8 + (foundTrendingWords.length > 0 ? 0.3 : 0);
    const monetization_score = this.calculateMonetizationScore(input, platform);

    // Determine competition level
    const competition_level =
      foundTrendingWords.length > 2
        ? "high"
        : foundTrendingWords.length > 0
          ? "medium"
          : "low";

    // Calculate optimal posting time
    const optimal_posting_time = this.getOptimalPostingTime(platform);

    // Generate trending keywords
    const trending_keywords = this.getTrendingKeywords(input, platform);

    // Identify content gaps
    const content_gaps = this.identifyContentGaps(input, platform);

    // Analyze sentiment
    const audience_sentiment = this.analyzeSentiment(input);

    // Predict performance
    const performance_prediction = this.predictPerformance(
      engagement_rate,
      reach_potential,
      platform,
    );

    return {
      engagement_rate,
      reach_potential,
      virality_score,
      monetization_score,
      competition_level,
      optimal_posting_time,
      trending_keywords,
      content_gaps,
      audience_sentiment,
      performance_prediction,
    };
  }

  // Calculate monetization potential
  private calculateMonetizationScore(
    input: string,
    platform: Platform,
  ): number {
    const words = input.toLowerCase().split(" ");
    const monetizableKeywords = [
      "course",
      "coaching",
      "consulting",
      "product",
      "service",
      "tool",
      "software",
      "book",
      "guide",
      "template",
      "system",
      "method",
      "strategy",
      "blueprint",
    ];

    const foundMonetizableWords = words.filter((word) =>
      monetizableKeywords.includes(word),
    );
    let score = foundMonetizableWords.length * 0.2;

    // Platform-specific monetization potential
    const platformMonetization = {
      [Platform.YouTube]: 0.9,
      [Platform.LinkedIn]: 0.8,
      [Platform.Instagram]: 0.7,
      [Platform.TikTok]: 0.6,
      [Platform.Twitter]: 0.5,
      [Platform.Facebook]: 0.4,
    };

    return Math.min(1, score * platformMonetization[platform]);
  }

  // Get optimal posting time for platform
  private getOptimalPostingTime(platform: Platform): string {
    const optimalTimes = {
      [Platform.TikTok]: "6-10 PM weekdays, 9 AM-12 PM weekends",
      [Platform.Instagram]: "11 AM-1 PM, 5-7 PM weekdays",
      [Platform.YouTube]: "2-4 PM, 8-11 PM weekdays",
      [Platform.LinkedIn]: "8-10 AM, 12-2 PM, 5-6 PM weekdays",
      [Platform.Twitter]: "8-10 AM, 7-9 PM weekdays",
      [Platform.Facebook]: "9 AM-10 AM, 3-4 PM weekdays",
    };

    return optimalTimes[platform];
  }

  // Get trending keywords for content
  private getTrendingKeywords(input: string, platform: Platform): string[] {
    const words = input.toLowerCase().split(" ");
    const trendingByPlatform = {
      [Platform.TikTok]: [
        "viral",
        "aesthetic",
        "transformation",
        "challenge",
        "trend",
      ],
      [Platform.Instagram]: [
        "inspiration",
        "lifestyle",
        "brand",
        "creative",
        "authentic",
      ],
      [Platform.YouTube]: ["tutorial", "guide", "review", "tips", "strategy"],
      [Platform.LinkedIn]: [
        "professional",
        "leadership",
        "growth",
        "innovation",
        "success",
      ],
      [Platform.Twitter]: [
        "breaking",
        "thread",
        "opinion",
        "insight",
        "discussion",
      ],
      [Platform.Facebook]: [
        "community",
        "local",
        "family",
        "event",
        "celebration",
      ],
    };

    const relevant = trendingByPlatform[platform].filter(
      (keyword) => !words.includes(keyword) && Math.random() > 0.7,
    );

    return relevant.slice(0, 3);
  }

  // Identify content gaps and opportunities
  private identifyContentGaps(input: string, platform: Platform): string[] {
    const gaps = [
      "Behind-the-scenes content",
      "User-generated content campaigns",
      "Interactive polls and Q&As",
      "Educational series content",
      "Collaboration opportunities",
      "Trending hashtag integration",
      "Seasonal content opportunities",
      "Cross-platform repurposing",
      "Community engagement initiatives",
      "Influencer partnership content",
    ];

    // Return random gaps that might be relevant
    return gaps.sort(() => Math.random() - 0.5).slice(0, 3);
  }

  // Analyze sentiment of content
  private analyzeSentiment(input: string): "positive" | "neutral" | "negative" {
    const words = input.toLowerCase().split(" ");
    const positiveWords = [
      "amazing",
      "great",
      "best",
      "awesome",
      "incredible",
      "fantastic",
      "love",
      "excellent",
    ];
    const negativeWords = [
      "terrible",
      "worst",
      "hate",
      "awful",
      "bad",
      "horrible",
      "fail",
      "wrong",
    ];

    const positiveCount = words.filter((word) =>
      positiveWords.includes(word),
    ).length;
    const negativeCount = words.filter((word) =>
      negativeWords.includes(word),
    ).length;

    if (positiveCount > negativeCount) return "positive";
    if (negativeCount > positiveCount) return "negative";
    return "neutral";
  }

  // Predict content performance
  private predictPerformance(
    engagementRate: number,
    reachPotential: number,
    platform: Platform,
  ) {
    const baseMetrics = {
      [Platform.TikTok]: {
        views: 50000,
        likes: 5000,
        shares: 500,
        comments: 300,
      },
      [Platform.Instagram]: {
        views: 10000,
        likes: 1000,
        shares: 100,
        comments: 150,
      },
      [Platform.YouTube]: {
        views: 25000,
        likes: 2500,
        shares: 250,
        comments: 200,
      },
      [Platform.LinkedIn]: {
        views: 5000,
        likes: 500,
        shares: 50,
        comments: 100,
      },
      [Platform.Twitter]: {
        views: 15000,
        likes: 1500,
        shares: 300,
        comments: 100,
      },
      [Platform.Facebook]: {
        views: 8000,
        likes: 800,
        shares: 80,
        comments: 120,
      },
    };

    const base = baseMetrics[platform];
    const multiplier = (engagementRate + reachPotential) / 2;

    return {
      views: Math.round(base.views * multiplier),
      likes: Math.round(base.likes * multiplier),
      shares: Math.round(base.shares * multiplier),
      comments: Math.round(base.comments * multiplier),
    };
  }

  // Generate trend analysis
  generateTrendAnalysis(platform: Platform): TrendAnalysis {
    const trends = {
      [Platform.TikTok]: {
        rising_topics: [
          "AI automation",
          "productivity hacks",
          "aesthetic lifestyle",
          "mental health",
          "sustainability",
        ],
        declining_topics: [
          "dance challenges",
          "food trends",
          "celebrity gossip",
        ],
        seasonal_opportunities: [
          "back to school content",
          "holiday preparation",
          "new year resolutions",
        ],
        competitor_insights: [
          "Short-form educational content",
          "Behind-the-scenes content",
          "Trend participation",
        ],
        content_format_trends: [
          "carousel posts",
          "voice-over tutorials",
          "transformation videos",
        ],
      },
      [Platform.Instagram]: {
        rising_topics: [
          "personal branding",
          "entrepreneurship",
          "wellness",
          "creative processes",
          "sustainability",
        ],
        declining_topics: [
          "heavily filtered content",
          "overly promotional posts",
        ],
        seasonal_opportunities: [
          "spring cleaning content",
          "summer travel",
          "holiday gift guides",
        ],
        competitor_insights: [
          "Authentic storytelling",
          "Educational carousels",
          "Reels with trending audio",
        ],
        content_format_trends: [
          "photo carousels",
          "educational reels",
          "story highlights",
        ],
      },
      [Platform.YouTube]: {
        rising_topics: [
          "AI tools reviews",
          "productivity systems",
          "financial literacy",
          "skill development",
          "remote work",
        ],
        declining_topics: [
          "overly long intros",
          "clickbait thumbnails",
          "generic content",
        ],
        seasonal_opportunities: [
          "year-end reviews",
          "goal setting content",
          "skill learning series",
        ],
        competitor_insights: [
          "In-depth tutorials",
          "Series content",
          "Community engagement",
        ],
        content_format_trends: [
          "educational series",
          "reaction videos",
          "collaboration content",
        ],
      },
      [Platform.LinkedIn]: {
        rising_topics: [
          "AI in workplace",
          "leadership development",
          "remote work culture",
          "professional growth",
          "industry insights",
        ],
        declining_topics: [
          "generic motivational quotes",
          "excessive self-promotion",
        ],
        seasonal_opportunities: [
          "quarterly business reviews",
          "annual planning content",
          "conference insights",
        ],
        competitor_insights: [
          "Thought leadership posts",
          "Industry analysis",
          "Professional storytelling",
        ],
        content_format_trends: [
          "carousel posts",
          "video content",
          "poll engagement",
        ],
      },
      [Platform.Twitter]: {
        rising_topics: [
          "AI discussions",
          "industry hot takes",
          "thread tutorials",
          "real-time insights",
          "community building",
        ],
        declining_topics: [
          "excessive threading",
          "controversial takes without value",
        ],
        seasonal_opportunities: [
          "live event commentary",
          "trending topic participation",
          "year-end insights",
        ],
        competitor_insights: [
          "Threaded educational content",
          "Real-time commentary",
          "Community engagement",
        ],
        content_format_trends: [
          "educational threads",
          "poll discussions",
          "quote tweet insights",
        ],
      },
      [Platform.Facebook]: {
        rising_topics: [
          "community events",
          "local business support",
          "family content",
          "educational content",
          "group discussions",
        ],
        declining_topics: [
          "personal oversharing",
          "political content",
          "spam-like posts",
        ],
        seasonal_opportunities: [
          "local events promotion",
          "holiday community content",
          "seasonal business tips",
        ],
        competitor_insights: [
          "Community-focused content",
          "Local business features",
          "Group participation",
        ],
        content_format_trends: [
          "community posts",
          "event promotion",
          "group discussions",
        ],
      },
    };

    return trends[platform];
  }

  // Generate audience insights
  generateAudienceInsights(platform: Platform): AudienceInsights {
    const insights = {
      [Platform.TikTok]: {
        primary_demographics: ["Gen Z", "Millennials", "Mobile-first users"],
        interests: [
          "Entertainment",
          "Education",
          "Trends",
          "Lifestyle",
          "Technology",
        ],
        pain_points: [
          "Information overload",
          "Authenticity concerns",
          "Time management",
        ],
        content_preferences: [
          "Short-form video",
          "Authentic content",
          "Educational entertainment",
        ],
        engagement_patterns: [
          "Peak evening hours",
          "Weekend mornings",
          "Trend participation",
        ],
      },
      [Platform.Instagram]: {
        primary_demographics: ["Millennials", "Gen Z", "Visual-oriented users"],
        interests: [
          "Lifestyle",
          "Creativity",
          "Business",
          "Wellness",
          "Fashion",
        ],
        pain_points: [
          "Content saturation",
          "Algorithm changes",
          "Authenticity vs aesthetics",
        ],
        content_preferences: [
          "Visual storytelling",
          "Behind-the-scenes",
          "Educational carousels",
        ],
        engagement_patterns: [
          "Lunch hours",
          "Evening scroll",
          "Weekend browsing",
        ],
      },
      [Platform.YouTube]: {
        primary_demographics: [
          "All age groups",
          "Learners",
          "Entertainment seekers",
        ],
        interests: [
          "Education",
          "Entertainment",
          "How-to content",
          "Reviews",
          "Tutorials",
        ],
        pain_points: [
          "Content discovery",
          "Time commitment",
          "Information quality",
        ],
        content_preferences: [
          "In-depth tutorials",
          "Series content",
          "Educational entertainment",
        ],
        engagement_patterns: [
          "Evening watching",
          "Weekend binge",
          "Commute listening",
        ],
      },
      [Platform.LinkedIn]: {
        primary_demographics: [
          "Professionals",
          "Business owners",
          "Industry experts",
        ],
        interests: [
          "Career growth",
          "Industry trends",
          "Professional development",
          "Networking",
        ],
        pain_points: [
          "Industry competition",
          "Skill gaps",
          "Professional visibility",
        ],
        content_preferences: [
          "Thought leadership",
          "Industry insights",
          "Professional stories",
        ],
        engagement_patterns: [
          "Weekday mornings",
          "Lunch breaks",
          "Commute hours",
        ],
      },
      [Platform.Twitter]: {
        primary_demographics: [
          "News consumers",
          "Industry professionals",
          "Thought leaders",
        ],
        interests: [
          "Real-time updates",
          "Industry discussions",
          "Trending topics",
          "News",
        ],
        pain_points: [
          "Information overload",
          "Echo chambers",
          "Misinformation",
        ],
        content_preferences: [
          "Real-time insights",
          "Thread education",
          "Industry commentary",
        ],
        engagement_patterns: [
          "Morning news check",
          "Lunch updates",
          "Evening discussions",
        ],
      },
      [Platform.Facebook]: {
        primary_demographics: [
          "Millennials",
          "Gen X",
          "Community-focused users",
        ],
        interests: [
          "Community",
          "Local events",
          "Family",
          "Hobbies",
          "Local business",
        ],
        pain_points: [
          "Privacy concerns",
          "Content relevance",
          "Community fragmentation",
        ],
        content_preferences: [
          "Community content",
          "Event information",
          "Local business features",
        ],
        engagement_patterns: [
          "Evening family time",
          "Weekend planning",
          "Community events",
        ],
      },
    };

    return insights[platform];
  }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const ContentInsightsPanel: React.FC<ContentInsightsPanelProps> = ({
  userInput,
  platform,
  contentType,
  isVisible,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<
    "metrics" | "trends" | "audience" | "optimization"
  >("metrics");
  const [metrics, setMetrics] = useState<ContentMetrics | null>(null);
  const [trends, setTrends] = useState<TrendAnalysis | null>(null);
  const [audience, setAudience] = useState<AudienceInsights | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const analyticsEngine = new ContentAnalyticsEngine();

  // Generate insights when input changes
  useEffect(() => {
    if (isVisible && userInput.trim().length > 0) {
      setIsLoading(true);

      // Simulate API delay for realistic feel
      setTimeout(() => {
        setMetrics(
          analyticsEngine.analyzeContent(userInput, platform, contentType),
        );
        setTrends(analyticsEngine.generateTrendAnalysis(platform));
        setAudience(analyticsEngine.generateAudienceInsights(platform));
        setIsLoading(false);
      }, 800);
    }
  }, [userInput, platform, contentType, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800/95 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-700 bg-gradient-to-r from-slate-700/30 to-slate-800/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                📊 Content Intelligence Dashboard
              </h3>
              <p className="text-slate-400 text-sm mt-1">
                AI-powered insights for "{userInput.slice(0, 50)}..." on{" "}
                {platform}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors p-2"
            >
              ✕
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1 mt-4">
            {[
              { id: "metrics", label: "📈 Performance", icon: "📈" },
              { id: "trends", label: "🔥 Trends", icon: "🔥" },
              { id: "audience", label: "👥 Audience", icon: "👥" },
              { id: "optimization", label: "⚡ Optimize", icon: "⚡" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-indigo-500 text-white shadow-lg"
                    : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <div className="text-slate-400">
                  Analyzing content with AI...
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Performance Metrics Tab */}
              {activeTab === "metrics" && metrics && (
                <div className="space-y-6">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4">
                      <div className="text-green-300 text-sm font-medium mb-1">
                        Engagement Rate
                      </div>
                      <div className="text-2xl font-bold text-white">
                        {Math.round(metrics.engagement_rate * 100)}%
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl p-4">
                      <div className="text-blue-300 text-sm font-medium mb-1">
                        Reach Potential
                      </div>
                      <div className="text-2xl font-bold text-white">
                        {Math.round(metrics.reach_potential * 100)}%
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-4">
                      <div className="text-purple-300 text-sm font-medium mb-1">
                        Virality Score
                      </div>
                      <div className="text-2xl font-bold text-white">
                        {Math.round(metrics.virality_score * 100)}%
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-4">
                      <div className="text-yellow-300 text-sm font-medium mb-1">
                        Monetization
                      </div>
                      <div className="text-2xl font-bold text-white">
                        {Math.round(metrics.monetization_score * 100)}%
                      </div>
                    </div>
                  </div>

                  {/* Performance Prediction */}
                  <div className="bg-slate-700/30 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-white mb-4">
                      📊 Predicted Performance
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-300">
                          {metrics.performance_prediction.views.toLocaleString()}
                        </div>
                        <div className="text-sm text-slate-400">Views</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-300">
                          {metrics.performance_prediction.likes.toLocaleString()}
                        </div>
                        <div className="text-sm text-slate-400">Likes</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-300">
                          {metrics.performance_prediction.shares.toLocaleString()}
                        </div>
                        <div className="text-sm text-slate-400">Shares</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-300">
                          {metrics.performance_prediction.comments.toLocaleString()}
                        </div>
                        <div className="text-sm text-slate-400">Comments</div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Metrics */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-slate-700/30 rounded-xl p-4">
                      <h5 className="font-semibold text-white mb-3">
                        ⏰ Optimal Timing
                      </h5>
                      <p className="text-slate-300 text-sm">
                        {metrics.optimal_posting_time}
                      </p>
                    </div>
                    <div className="bg-slate-700/30 rounded-xl p-4">
                      <h5 className="font-semibold text-white mb-3">
                        🏁 Competition Level
                      </h5>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          metrics.competition_level === "high"
                            ? "bg-red-500/20 text-red-300"
                            : metrics.competition_level === "medium"
                              ? "bg-yellow-500/20 text-yellow-300"
                              : "bg-green-500/20 text-green-300"
                        }`}
                      >
                        {metrics.competition_level.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Trends Tab */}
              {activeTab === "trends" && trends && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-4">
                      <h5 className="font-semibold text-green-300 mb-3 flex items-center gap-2">
                        📈 Rising Topics
                      </h5>
                      <div className="space-y-2">
                        {trends.rising_topics.map((topic, index) => (
                          <div
                            key={index}
                            className="text-sm text-slate-300 bg-green-500/10 px-3 py-1 rounded-full"
                          >
                            {topic}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-red-500/10 to-pink-500/10 border border-red-500/30 rounded-xl p-4">
                      <h5 className="font-semibold text-red-300 mb-3 flex items-center gap-2">
                        📉 Declining Topics
                      </h5>
                      <div className="space-y-2">
                        {trends.declining_topics.map((topic, index) => (
                          <div
                            key={index}
                            className="text-sm text-slate-300 bg-red-500/10 px-3 py-1 rounded-full"
                          >
                            {topic}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-700/30 rounded-xl p-4">
                    <h5 className="font-semibold text-white mb-3">
                      🎯 Content Format Trends
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {trends.content_format_trends.map((format, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-sm"
                        >
                          {format}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-700/30 rounded-xl p-4">
                    <h5 className="font-semibold text-white mb-3">
                      🌟 Seasonal Opportunities
                    </h5>
                    <div className="grid gap-2">
                      {trends.seasonal_opportunities.map(
                        (opportunity, index) => (
                          <div
                            key={index}
                            className="text-sm text-slate-300 flex items-center gap-2"
                          >
                            <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                            {opportunity}
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Audience Tab */}
              {activeTab === "audience" && audience && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-slate-700/30 rounded-xl p-4">
                      <h5 className="font-semibold text-white mb-3">
                        👥 Primary Demographics
                      </h5>
                      <div className="space-y-2">
                        {audience.primary_demographics.map((demo, index) => (
                          <div
                            key={index}
                            className="text-sm text-slate-300 bg-blue-500/10 px-3 py-1 rounded-full"
                          >
                            {demo}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-700/30 rounded-xl p-4">
                      <h5 className="font-semibold text-white mb-3">
                        ❤️ Core Interests
                      </h5>
                      <div className="space-y-2">
                        {audience.interests.map((interest, index) => (
                          <div
                            key={index}
                            className="text-sm text-slate-300 bg-purple-500/10 px-3 py-1 rounded-full"
                          >
                            {interest}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-700/30 rounded-xl p-4">
                    <h5 className="font-semibold text-white mb-3">
                      😰 Pain Points to Address
                    </h5>
                    <div className="grid gap-2">
                      {audience.pain_points.map((pain, index) => (
                        <div
                          key={index}
                          className="text-sm text-slate-300 flex items-center gap-2"
                        >
                          <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                          {pain}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-700/30 rounded-xl p-4">
                    <h5 className="font-semibold text-white mb-3">
                      ⏰ Engagement Patterns
                    </h5>
                    <div className="grid gap-2">
                      {audience.engagement_patterns.map((pattern, index) => (
                        <div
                          key={index}
                          className="text-sm text-slate-300 flex items-center gap-2"
                        >
                          <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                          {pattern}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Optimization Tab */}
              {activeTab === "optimization" && metrics && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-white mb-4">
                      ⚡ Optimization Recommendations
                    </h4>

                    <div className="space-y-4">
                      <div className="bg-slate-700/30 rounded-lg p-4">
                        <h5 className="font-medium text-green-300 mb-2">
                          🎯 Content Optimization
                        </h5>
                        <ul className="text-sm text-slate-300 space-y-1">
                          <li>
                            • Add trending keywords:{" "}
                            {metrics.trending_keywords.join(", ")}
                          </li>
                          <li>
                            • Optimize for {platform} algorithm with engagement
                            hooks
                          </li>
                          <li>
                            • Include clear call-to-action for better conversion
                          </li>
                        </ul>
                      </div>

                      <div className="bg-slate-700/30 rounded-lg p-4">
                        <h5 className="font-medium text-blue-300 mb-2">
                          📊 Performance Boost
                        </h5>
                        <ul className="text-sm text-slate-300 space-y-1">
                          <li>
                            • Post during optimal time:{" "}
                            {metrics.optimal_posting_time}
                          </li>
                          <li>
                            • Use {platform}-specific formatting best practices
                          </li>
                          <li>
                            • Engage with comments within first hour for
                            algorithm boost
                          </li>
                        </ul>
                      </div>

                      <div className="bg-slate-700/30 rounded-lg p-4">
                        <h5 className="font-medium text-purple-300 mb-2">
                          🚀 Growth Opportunities
                        </h5>
                        <ul className="text-sm text-slate-300 space-y-1">
                          {metrics.content_gaps.map((gap, index) => (
                            <li key={index}>• {gap}</li>
                          ))}
                        </ul>
                      </div>

                      {metrics.monetization_score > 0.3 && (
                        <div className="bg-slate-700/30 rounded-lg p-4">
                          <h5 className="font-medium text-yellow-300 mb-2">
                            💰 Monetization Ideas
                          </h5>
                          <ul className="text-sm text-slate-300 space-y-1">
                            <li>• Create a detailed course on this topic</li>
                            <li>• Offer consultation services</li>
                            <li>• Develop a related digital product</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentInsightsPanel;
