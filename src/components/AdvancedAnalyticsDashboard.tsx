import React, { useState, useEffect } from "react";
import {
  ChartBarIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  EyeIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  ShareIcon,
  StarIcon,
  CalendarDaysIcon,
  ClockIcon,
  FireIcon,
  LightBulbIcon,
  UsersIcon,
  GlobeAltIcon,
} from "./IconComponents";

interface AnalyticsData {
  totalReach: number;
  totalEngagement: number;
  avgEngagementRate: number;
  totalContent: number;
  topPerformingContent: ContentMetric[];
  engagementTrends: TrendData[];
  audienceInsights: AudienceData;
  contentRecommendations: Recommendation[];
}

interface ContentMetric {
  id: string;
  title: string;
  platform: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagementRate: number;
  createdAt: string;
}

interface TrendData {
  date: string;
  views: number;
  engagement: number;
  reach: number;
}

interface AudienceData {
  demographics: {
    age: { range: string; percentage: number }[];
    gender: { type: string; percentage: number }[];
    location: { country: string; percentage: number }[];
  };
  activeHours: { hour: number; activity: number }[];
  interests: { topic: string; score: number }[];
}

interface Recommendation {
  id: string;
  type: "content" | "timing" | "hashtag" | "format";
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  actionUrl?: string;
}

const AdvancedAnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");
  const [selectedPlatform, setSelectedPlatform] = useState<
    "all" | "instagram" | "tiktok" | "youtube"
  >("all");
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  // Mock data - replace with real API calls
  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const mockData: AnalyticsData = {
          totalReach: 125000,
          totalEngagement: 15600,
          avgEngagementRate: 4.8,
          totalContent: 24,
          topPerformingContent: [
            {
              id: "1",
              title: "5 AI Tools That Will Change Everything",
              platform: "Instagram",
              views: 45000,
              likes: 3200,
              comments: 180,
              shares: 95,
              engagementRate: 7.2,
              createdAt: "2024-01-15",
            },
            {
              id: "2",
              title: "Quick Content Creation Hacks",
              platform: "TikTok",
              views: 38000,
              likes: 2800,
              comments: 120,
              shares: 65,
              engagementRate: 6.8,
              createdAt: "2024-01-12",
            },
          ],
          engagementTrends: [
            {
              date: "2024-01-01",
              views: 12000,
              engagement: 1200,
              reach: 15000,
            },
            {
              date: "2024-01-08",
              views: 18000,
              engagement: 1800,
              reach: 22000,
            },
            {
              date: "2024-01-15",
              views: 25000,
              engagement: 2500,
              reach: 30000,
            },
            {
              date: "2024-01-22",
              views: 22000,
              engagement: 2200,
              reach: 28000,
            },
          ],
          audienceInsights: {
            demographics: {
              age: [
                { range: "18-24", percentage: 35 },
                { range: "25-34", percentage: 40 },
                { range: "35-44", percentage: 20 },
                { range: "45+", percentage: 5 },
              ],
              gender: [
                { type: "Female", percentage: 58 },
                { type: "Male", percentage: 40 },
                { type: "Other", percentage: 2 },
              ],
              location: [
                { country: "United States", percentage: 45 },
                { country: "United Kingdom", percentage: 20 },
                { country: "Canada", percentage: 15 },
                { country: "Australia", percentage: 10 },
                { country: "Other", percentage: 10 },
              ],
            },
            activeHours: [
              { hour: 0, activity: 10 },
              { hour: 6, activity: 20 },
              { hour: 9, activity: 60 },
              { hour: 12, activity: 80 },
              { hour: 15, activity: 90 },
              { hour: 18, activity: 100 },
              { hour: 21, activity: 85 },
              { hour: 23, activity: 40 },
            ],
            interests: [
              { topic: "Technology", score: 95 },
              { topic: "Business", score: 88 },
              { topic: "Marketing", score: 82 },
              { topic: "Design", score: 76 },
              { topic: "AI/ML", score: 91 },
            ],
          },
          contentRecommendations: [
            {
              id: "1",
              type: "content",
              title: "Create Tutorial Content",
              description:
                "Your audience shows 75% higher engagement with how-to content",
              impact: "high",
            },
            {
              id: "2",
              type: "timing",
              title: "Post at 6 PM",
              description: "Your audience is most active between 6-8 PM",
              impact: "medium",
            },
            {
              id: "3",
              type: "hashtag",
              title: "Use #TechTips",
              description: "This hashtag could increase reach by 40%",
              impact: "high",
            },
          ],
        };
        setAnalyticsData(mockData);
        setLoading(false);
      }, 1500);
    };

    fetchAnalytics();
  }, [timeRange, selectedPlatform]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "text-green-400 bg-green-500/10";
      case "medium":
        return "text-yellow-400 bg-yellow-500/10";
      case "low":
        return "text-blue-400 bg-blue-500/10";
      default:
        return "text-slate-400 bg-slate-500/10";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300">
            Analyzing your content performance...
          </p>
        </div>
      </div>
    );
  }

  if (!analyticsData) return null;

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-slate-400">
              Track your content performance and get AI-powered insights
            </p>
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <select
              value={timeRange}
              onChange={(e) =>
                setTimeRange(e.target.value as "7d" | "30d" | "90d")
              }
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value as any)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
            >
              <option value="all">All Platforms</option>
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
              <option value="youtube">YouTube</option>
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <EyeIcon className="h-8 w-8 text-sky-400" />
              <TrendingUpIcon className="h-5 w-5 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-white">
              {formatNumber(analyticsData.totalReach)}
            </h3>
            <p className="text-slate-400 text-sm">Total Reach</p>
            <p className="text-green-400 text-xs mt-2">+12% vs last period</p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <HeartIcon className="h-8 w-8 text-pink-400" />
              <TrendingUpIcon className="h-5 w-5 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-white">
              {formatNumber(analyticsData.totalEngagement)}
            </h3>
            <p className="text-slate-400 text-sm">Total Engagement</p>
            <p className="text-green-400 text-xs mt-2">+18% vs last period</p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <ChartBarIcon className="h-8 w-8 text-purple-400" />
              <TrendingUpIcon className="h-5 w-5 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-white">
              {analyticsData.avgEngagementRate}%
            </h3>
            <p className="text-slate-400 text-sm">Avg Engagement Rate</p>
            <p className="text-green-400 text-xs mt-2">+0.8% vs last period</p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <FireIcon className="h-8 w-8 text-orange-400" />
              <TrendingUpIcon className="h-5 w-5 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-white">
              {analyticsData.totalContent}
            </h3>
            <p className="text-slate-400 text-sm">Content Created</p>
            <p className="text-green-400 text-xs mt-2">+6 vs last period</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Performing Content */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <StarIcon className="h-6 w-6 text-yellow-400 mr-3" />
              Top Performing Content
            </h3>
            <div className="space-y-4">
              {analyticsData.topPerformingContent.map((content) => (
                <div key={content.id} className="p-4 bg-slate-900 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-white text-sm">
                      {content.title}
                    </h4>
                    <span className="text-xs text-slate-400">
                      {content.platform}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div className="text-center">
                      <p className="text-sky-400 font-semibold">
                        {formatNumber(content.views)}
                      </p>
                      <p className="text-slate-500">Views</p>
                    </div>
                    <div className="text-center">
                      <p className="text-pink-400 font-semibold">
                        {formatNumber(content.likes)}
                      </p>
                      <p className="text-slate-500">Likes</p>
                    </div>
                    <div className="text-center">
                      <p className="text-green-400 font-semibold">
                        {content.comments}
                      </p>
                      <p className="text-slate-500">Comments</p>
                    </div>
                    <div className="text-center">
                      <p className="text-purple-400 font-semibold">
                        {content.engagementRate}%
                      </p>
                      <p className="text-slate-500">Rate</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <LightBulbIcon className="h-6 w-6 text-yellow-400 mr-3" />
              AI Recommendations
            </h3>
            <div className="space-y-4">
              {analyticsData.contentRecommendations.map((rec) => (
                <div key={rec.id} className="p-4 bg-slate-900 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-white text-sm">
                      {rec.title}
                    </h4>
                    <span
                      className={`text-xs px-2 py-1 rounded ${getImpactColor(rec.impact)}`}
                    >
                      {rec.impact} impact
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm">{rec.description}</p>
                  {rec.actionUrl && (
                    <button className="mt-2 text-sky-400 text-xs hover:text-sky-300 transition-colors">
                      Apply Recommendation →
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Audience Insights */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <UsersIcon className="h-6 w-6 text-blue-400 mr-3" />
            Audience Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Demographics */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">
                Demographics
              </h4>
              <div className="space-y-3">
                <div>
                  <p className="text-slate-400 text-sm mb-2">Age Groups</p>
                  {analyticsData.audienceInsights.demographics.age.map(
                    (age) => (
                      <div
                        key={age.range}
                        className="flex justify-between items-center mb-1"
                      >
                        <span className="text-slate-300 text-sm">
                          {age.range}
                        </span>
                        <span className="text-sky-400 text-sm">
                          {age.percentage}%
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>

            {/* Top Interests */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">
                Top Interests
              </h4>
              <div className="space-y-2">
                {analyticsData.audienceInsights.interests.map((interest) => (
                  <div
                    key={interest.topic}
                    className="flex justify-between items-center"
                  >
                    <span className="text-slate-300 text-sm">
                      {interest.topic}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-sky-500 to-indigo-500 h-2 rounded-full"
                          style={{ width: `${interest.score}%` }}
                        ></div>
                      </div>
                      <span className="text-sky-400 text-sm">
                        {interest.score}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Best Posting Times */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">
                Best Posting Times
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">Peak Activity</span>
                  <span className="text-green-400">6:00 PM - 8:00 PM</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">Secondary Peak</span>
                  <span className="text-yellow-400">12:00 PM - 2:00 PM</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">Low Activity</span>
                  <span className="text-red-400">2:00 AM - 6:00 AM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalyticsDashboard;
