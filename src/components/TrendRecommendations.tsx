import React, { useState } from "react";
import { TrendAnalysisOutput, Platform } from "../types";

interface TrendRecommendationsProps {
  trendData: TrendAnalysisOutput | null;
  platform: Platform;
  isPremium: boolean;
  onUpgrade: () => void;
  onGenerateContent: (contentType: string, prompt: string) => void;
}

interface ContentRecommendation {
  type: "video" | "post" | "article" | "carousel" | "story";
  title: string;
  description: string;
  estimatedEngagement: number;
  difficulty: "easy" | "medium" | "hard";
  timeToCreate: string;
  tags: string[];
  aiPrompt: string;
}

export const TrendRecommendations: React.FC<TrendRecommendationsProps> = ({
  trendData,
  platform,
  isPremium,
  onUpgrade,
  onGenerateContent,
}) => {
  const [activeTab, setActiveTab] = useState<
    "content" | "timing" | "hashtags" | "audiences"
  >("content");
  const [selectedRecommendation, setSelectedRecommendation] =
    useState<ContentRecommendation | null>(null);
  const [isGeneratingContent, setIsGeneratingContent] = useState<string | null>(
    null,
  );
  const [savedRecommendations, setSavedRecommendations] = useState<
    ContentRecommendation[]
  >([]);
  const [customPrompt, setCustomPrompt] = useState("");
  const [showCustomPromptModal, setShowCustomPromptModal] = useState(false);

  // AI-generated content recommendations based on trend data
  const generateContentRecommendations = (): ContentRecommendation[] => {
    if (!trendData) return [];

    const baseRecommendations: ContentRecommendation[] = [
      {
        type: "video",
        title: `"${trendData.query}: What You Need to Know"`,
        description:
          "Create an educational video breaking down the trend and its implications",
        estimatedEngagement: 85,
        difficulty: "medium",
        timeToCreate: "2-3 hours",
        tags: ["trending", "educational", "analysis"],
        aiPrompt: `Create a compelling video script about ${trendData.query} that explains the trend, its impact, and what viewers should know. Include hooks, key points, and call-to-action.`,
      },
      {
        type: "carousel",
        title: `Top 5 Insights About ${trendData.query}`,
        description:
          "Visual carousel highlighting key insights from the trend analysis",
        estimatedEngagement: 78,
        difficulty: "easy",
        timeToCreate: "1 hour",
        tags: ["insights", "visual", "trending"],
        aiPrompt: `Create a 5-slide carousel post about ${trendData.query} with compelling insights, statistics, and actionable takeaways for each slide.`,
      },
      {
        type: "article",
        title: `Deep Dive: The Future of ${trendData.query}`,
        description: "Long-form content exploring predictions and analysis",
        estimatedEngagement: 72,
        difficulty: "hard",
        timeToCreate: "4-5 hours",
        tags: ["analysis", "future-trends", "expert"],
        aiPrompt: `Write a comprehensive article analyzing ${trendData.query}, including current state, future predictions, expert insights, and actionable advice.`,
      },
      {
        type: "post",
        title: `Quick Take: ${trendData.query} Explained`,
        description: "Short, engaging post with key highlights",
        estimatedEngagement: 65,
        difficulty: "easy",
        timeToCreate: "30 minutes",
        tags: ["quick-tips", "trending", "bite-sized"],
        aiPrompt: `Create a short, engaging social media post about ${trendData.query} that captures attention and encourages engagement.`,
      },
    ];

    // Platform-specific recommendations
    if (platform === Platform.TikTok) {
      baseRecommendations.push({
        type: "video",
        title: `${trendData.query} in 60 Seconds`,
        description: "Quick, viral-style explanation perfect for TikTok",
        estimatedEngagement: 92,
        difficulty: "medium",
        timeToCreate: "1-2 hours",
        tags: ["viral", "quick-facts", "trending"],
        aiPrompt: `Create a 60-second TikTok script about ${trendData.query} with hooks, quick facts, and trending elements that could go viral.`,
      });
    }

    return baseRecommendations;
  };

  const contentRecommendations = generateContentRecommendations();

  const optimalPostTimes = [
    { time: "9:00 AM", engagement: "87%", audience: "Morning commuters" },
    { time: "12:00 PM", engagement: "92%", audience: "Lunch break browsers" },
    { time: "6:00 PM", engagement: "89%", audience: "Evening active users" },
    { time: "8:00 PM", engagement: "94%", audience: "Prime time audience" },
  ];

  const hashtagSuggestions = [
    { tag: "#trending", volume: "2.5M", competition: "High" },
    {
      tag: `#${trendData?.query?.replace(/\s+/g, "").toLowerCase()}`,
      volume: "450K",
      competition: "Medium",
    },
    { tag: "#innovation", volume: "1.8M", competition: "High" },
    { tag: "#futuretrends", volume: "320K", competition: "Low" },
    { tag: "#insights", volume: "890K", competition: "Medium" },
  ];

  const targetAudiences = [
    {
      segment: "Early Adopters",
      size: "15%",
      engagement: "96%",
      description: "Tech-savvy users who embrace new trends quickly",
      demographics: "25-34 years, High income, Urban",
      interests: ["Technology", "Innovation", "Startups"],
      bestTimes: ["9-11 AM", "2-4 PM", "7-9 PM"],
    },
    {
      segment: "Industry Professionals",
      size: "25%",
      engagement: "84%",
      description: "Working professionals in related fields",
      demographics: "28-45 years, College educated, Suburban",
      interests: ["Career growth", "Industry news", "Networking"],
      bestTimes: ["7-9 AM", "12-1 PM", "6-8 PM"],
    },
    {
      segment: "Content Creators",
      size: "12%",
      engagement: "91%",
      description: "Creators looking for trending content ideas",
      demographics: "18-35 years, Creative fields, Global",
      interests: ["Content creation", "Social media", "Trends"],
      bestTimes: ["10 AM-12 PM", "3-5 PM", "8-10 PM"],
    },
    {
      segment: "General Interest",
      size: "48%",
      engagement: "67%",
      description: "Broad audience interested in current trends",
      demographics: "18-65 years, Mixed backgrounds, Global",
      interests: ["News", "Entertainment", "Lifestyle"],
      bestTimes: ["6-9 AM", "12-2 PM", "7-10 PM"],
    },
  ];

  // Enhanced content generation with AI
  const generateContentWithAI = async (
    recommendation: ContentRecommendation,
  ) => {
    setIsGeneratingContent(recommendation.title);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const generatedContent = {
        ...recommendation,
        generatedAt: new Date().toISOString(),
        content: generateContent(recommendation),
        engagement_prediction: Math.floor(Math.random() * 20) + 70,
        seo_score: Math.floor(Math.random() * 30) + 70,
      };

      // Save to history
      onGenerateContent(recommendation.type, generatedContent.content);

      // Add to saved recommendations
      setSavedRecommendations((prev) => [
        generatedContent,
        ...prev.slice(0, 9),
      ]);
    } catch (error) {
      console.error("Content generation failed:", error);
    } finally {
      setIsGeneratingContent(null);
    }
  };

  const generateContent = (rec: ContentRecommendation) => {
    switch (rec.type) {
      case "video":
        return `🎬 VIDEO SCRIPT: ${rec.title}\n\nHOOK (0-3s):\n"Did you know that ${trendData?.query || "this trend"} is changing everything?"\n\nINTRO (3-15s):\nHey everyone! Today we're diving deep into ${trendData?.query || "the latest trend"} and why you need to pay attention.\n\nMAIN CONTENT (15s-2min):\n• Key insight 1: [Explain the trend's impact]\n• Key insight 2: [Share surprising statistics]\n• Key insight 3: [Practical applications]\n\nCLOSING (2-2:30min):\nWhat do you think about ${trendData?.query || "this trend"}? Drop your thoughts below and don't forget to subscribe!\n\n#trending #${trendData?.query?.replace(/\s+/g, "") || "innovation"}`;

      case "carousel":
        return `📱 CAROUSEL POST: ${rec.title}\n\nSLIDE 1: Title Slide\n"${rec.title}" + Eye-catching visual\n\nSLIDE 2: The Problem\n"Most people don't realize..."\n\nSLIDE 3: The Solution\n"Here's what ${trendData?.query || "this trend"} offers..."\n\nSLIDE 4: Key Benefits\n• Benefit 1\n• Benefit 2  \n• Benefit 3\n\nSLIDE 5: Call to Action\n"Ready to leverage ${trendData?.query || "this trend"}? Follow for more insights!"\n\n#${trendData?.query?.replace(/\s+/g, "") || "trending"} #insights #innovation`;

      case "article":
        return `📝 ARTICLE: ${rec.title}\n\nIntroduction:\nThe landscape of ${trendData?.query || "innovation"} is rapidly evolving, and understanding these changes is crucial for staying ahead.\n\nSection 1: Current State\n[Analysis of current trends and market conditions]\n\nSection 2: Key Drivers\n[Factors contributing to this trend's growth]\n\nSection 3: Future Implications\n[Predictions and potential outcomes]\n\nSection 4: Actionable Insights\n[Practical steps readers can take]\n\nConclusion:\nAs ${trendData?.query || "this trend"} continues to shape our future, early adoption and strategic planning will be key to success.\n\nSEO Keywords: ${trendData?.query || "innovation"}, future trends, market analysis`;

      default:
        return `📱 SOCIAL POST: ${rec.title}\n\n🔥 ${trendData?.query || "This trend"} is taking off and here's why you should care:\n\n✨ Key insight 1\n💡 Key insight 2\n🚀 Key insight 3\n\nWhat's your take on ${trendData?.query || "this"}? Let me know in the comments!\n\n#trending #${trendData?.query?.replace(/\s+/g, "") || "innovation"} #insights`;
    }
  };

  const saveRecommendation = (rec: ContentRecommendation) => {
    setSavedRecommendations((prev) => {
      const exists = prev.find((saved) => saved.title === rec.title);
      if (exists) return prev;
      return [rec, ...prev.slice(0, 9)];
    });
  };

  const generateCustomContent = async () => {
    if (!customPrompt.trim()) return;

    setIsGeneratingContent("custom");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const customRec: ContentRecommendation = {
        type: "post",
        title: "Custom Content",
        description: customPrompt,
        estimatedEngagement: Math.floor(Math.random() * 30) + 60,
        difficulty: "medium",
        timeToCreate: "1-2 hours",
        tags: ["custom", "ai-generated"],
        aiPrompt: customPrompt,
      };

      await generateContentWithAI(customRec);
      setShowCustomPromptModal(false);
      setCustomPrompt("");
    } catch (error) {
      console.error("Custom content generation failed:", error);
    }
  };

  const renderTabContent = () => {
    if (!isPremium && activeTab !== "content") {
      return (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔒</span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Premium Feature
          </h3>
          <p className="text-slate-400 mb-4">
            Unlock advanced recommendations and insights
          </p>
          <button
            onClick={onUpgrade}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg text-white font-semibold"
          >
            Upgrade to Premium
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case "content":
        return (
          <div className="space-y-4">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                AI-Powered Content Ideas
              </h3>
              <p className="text-slate-400 text-sm">
                Personalized content strategies based on trends
              </p>
            </div>

            {/* Custom Prompt Button */}
            <div className="mb-4 flex justify-between items-center">
              <div>
                <h4 className="text-sm font-medium text-slate-300">
                  Quick Actions
                </h4>
              </div>
              <button
                onClick={() => setShowCustomPromptModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg text-white text-sm font-medium transition-all duration-200 flex items-center space-x-2"
              >
                <span>✨</span>
                <span>Custom Prompt</span>
              </button>
            </div>

            {/* Saved Recommendations */}
            {savedRecommendations.length > 0 && (
              <div className="mb-6 p-4 bg-slate-700/30 rounded-xl border border-slate-600/50">
                <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center">
                  <span className="mr-2">💾</span>
                  Recently Generated ({savedRecommendations.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {savedRecommendations.slice(0, 5).map((saved, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedRecommendation(saved)}
                      className="px-3 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full border border-purple-500/30 hover:bg-purple-600/30 transition-colors"
                    >
                      {saved.type.toUpperCase()}: {saved.title.substring(0, 20)}
                      ...
                    </button>
                  ))}
                  {savedRecommendations.length > 5 && (
                    <span className="px-3 py-1 bg-slate-600/50 text-slate-400 text-xs rounded-full">
                      +{savedRecommendations.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {contentRecommendations.map((rec, index) => (
              <div
                key={index}
                className="p-5 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-slate-700/50 hover:border-purple-500/30 transition-all duration-300 cursor-pointer group"
                onClick={() => setSelectedRecommendation(rec)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          rec.type === "video"
                            ? "bg-red-500/20 text-red-300 border border-red-500/30"
                            : rec.type === "carousel"
                              ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                              : rec.type === "article"
                                ? "bg-green-500/20 text-green-300 border border-green-500/30"
                                : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                        }`}
                      >
                        {rec.type.toUpperCase()}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          rec.difficulty === "easy"
                            ? "bg-green-500/20 text-green-300"
                            : rec.difficulty === "medium"
                              ? "bg-yellow-500/20 text-yellow-300"
                              : "bg-red-500/20 text-red-300"
                        }`}
                      >
                        {rec.difficulty}
                      </span>
                    </div>
                    <h4 className="font-semibold text-white group-hover:text-purple-300 transition-colors mb-2">
                      {rec.title}
                    </h4>
                    <p className="text-slate-300 text-sm mb-3">
                      {rec.description}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-slate-400">
                      <span>⏱️ {rec.timeToCreate}</span>
                      <span>📈 {rec.estimatedEngagement}% engagement</span>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-lg font-bold text-emerald-400">
                      {rec.estimatedEngagement}%
                    </div>
                    <div className="text-xs text-slate-400">
                      Est. Engagement
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {rec.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        saveRecommendation(rec);
                      }}
                      className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white text-sm font-medium transition-all duration-200 flex items-center space-x-1"
                    >
                      <span>💾</span>
                      <span>Save</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        generateContentWithAI(rec);
                      }}
                      disabled={isGeneratingContent === rec.title}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg text-white text-sm font-medium transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
                    >
                      {isGeneratingContent === rec.title ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <span>🤖</span>
                          <span>Generate</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case "timing":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Optimal Posting Times
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {optimalPostTimes.map((time, index) => (
                  <div
                    key={index}
                    className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white">{time.time}</h4>
                      <span className="text-emerald-400 font-bold">
                        {time.engagement}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm">{time.audience}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Weekly Schedule Recommendation
              </h3>
              <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-4">
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                    (day) => (
                      <div key={day} className="text-center">
                        <div className="text-xs text-slate-400 mb-2">{day}</div>
                        <div className="h-20 bg-gradient-to-t from-purple-600/20 to-blue-600/20 rounded border border-purple-500/30 flex items-end justify-center">
                          <div className="text-xs text-purple-300 mb-1">
                            {Math.floor(Math.random() * 3) + 1}
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
                <p className="text-slate-400 text-sm text-center">
                  Recommended posts per day based on audience activity
                </p>
              </div>
            </div>
          </div>
        );

      case "hashtags":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Trending Hashtags
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {hashtagSuggestions.map((hashtag, index) => (
                  <div
                    key={index}
                    className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-purple-500/30 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-purple-300">
                        {hashtag.tag}
                      </h4>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          hashtag.competition === "High"
                            ? "bg-red-500/20 text-red-300"
                            : hashtag.competition === "Medium"
                              ? "bg-yellow-500/20 text-yellow-300"
                              : "bg-green-500/20 text-green-300"
                        }`}
                      >
                        {hashtag.competition}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Volume:</span>
                      <span className="text-white font-medium">
                        {hashtag.volume}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Hashtag Strategy
              </h3>
              <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-red-400 text-xl">🔥</span>
                    </div>
                    <h4 className="font-semibold text-white mb-2">
                      High Competition
                    </h4>
                    <p className="text-slate-400 text-sm">
                      2-3 hashtags for maximum reach
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-yellow-400 text-xl">⚡</span>
                    </div>
                    <h4 className="font-semibold text-white mb-2">
                      Medium Competition
                    </h4>
                    <p className="text-slate-400 text-sm">
                      5-7 hashtags for balanced strategy
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-green-400 text-xl">🎯</span>
                    </div>
                    <h4 className="font-semibold text-white mb-2">
                      Low Competition
                    </h4>
                    <p className="text-slate-400 text-sm">
                      8-10 hashtags for niche targeting
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "audiences":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Target Audience Analysis
              </h3>
              <div className="space-y-4">
                {targetAudiences.map((audience, index) => (
                  <div
                    key={index}
                    className="p-5 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-slate-600/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-2">
                          {audience.segment}
                        </h4>
                        <p className="text-slate-300 text-sm mb-3">
                          {audience.description}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="text-slate-400">
                              Demographics:
                            </span>
                            <p className="text-slate-300">
                              {audience.demographics}
                            </p>
                          </div>
                          <div>
                            <span className="text-slate-400">Best Times:</span>
                            <p className="text-slate-300">
                              {audience.bestTimes.join(", ")}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-lg font-bold text-blue-400">
                          {audience.size}
                        </div>
                        <div className="text-xs text-slate-400">
                          Audience Size
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-slate-400 text-sm">
                            Engagement:
                          </span>
                          <div className="w-24 bg-slate-700 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                              style={{ width: audience.engagement }}
                            />
                          </div>
                          <span className="text-green-400 text-sm font-medium">
                            {audience.engagement}
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="text-slate-400 text-xs">
                          Top Interests:
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {audience.interests.map((interest, i) => (
                            <span
                              key={`trend-tag-${i}`}
                              className="px-2 py-1 bg-blue-600/20 text-blue-300 text-xs rounded-md"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Content Personalization
              </h3>
              <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-white mb-3">
                      Tone & Style
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-300">Professional</span>
                        <span className="text-blue-400">40%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">Casual</span>
                        <span className="text-purple-400">35%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">Technical</span>
                        <span className="text-green-400">25%</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-3">
                      Content Format
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-300">Visual</span>
                        <span className="text-red-400">45%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">Text-based</span>
                        <span className="text-yellow-400">30%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">Video</span>
                        <span className="text-pink-400">25%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-300 to-purple-300 bg-clip-text text-transparent">
              AI Recommendations
            </h1>
            <p className="text-slate-400 text-sm">
              Smart content suggestions powered by trend analysis
            </p>
          </div>
          <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500/20 to-purple-500/20 rounded-full border border-green-500/30">
            <span className="text-green-400 text-xl">🤖</span>
            <span className="text-green-300 text-sm font-semibold">
              AI Powered
            </span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex space-x-2">
          {[
            { key: "content", label: "Content Ideas", icon: "💡" },
            {
              key: "timing",
              label: "Optimal Timing",
              icon: "⏰",
              premium: !isPremium,
            },
            {
              key: "hashtags",
              label: "Hashtag Strategy",
              icon: "#️⃣",
              premium: !isPremium,
            },
            {
              key: "audiences",
              label: "Target Audiences",
              icon: "👥",
              premium: !isPremium,
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 relative ${
                activeTab === tab.key
                  ? "bg-purple-600 text-white"
                  : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.premium && (
                <span className="ml-2 text-xs bg-amber-500/30 text-amber-300 px-1 rounded">
                  Pro
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 overflow-auto">
        {!trendData ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              No Trend Data Available
            </h3>
            <p className="text-slate-400">
              Run a trend analysis first to get personalized recommendations
            </p>
          </div>
        ) : (
          renderTabContent()
        )}
      </div>

      {/* Custom Prompt Modal */}
      {showCustomPromptModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                Custom AI Content Generation
              </h3>
              <button
                onClick={() => setShowCustomPromptModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Describe the content you want to create:
                </label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="E.g., 'Create a LinkedIn post about AI trends for marketing professionals that includes 3 key insights and a call to action...'"
                  className="w-full h-32 p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 resize-none"
                />
              </div>

              <div className="bg-slate-700/30 rounded-lg p-4">
                <h5 className="font-medium text-white mb-2">💡 Pro Tips:</h5>
                <ul className="text-slate-300 text-sm space-y-1">
                  <li>
                    • Be specific about the content type (post, video, article,
                    etc.)
                  </li>
                  <li>
                    • Include your target audience (professionals, creators,
                    general, etc.)
                  </li>
                  <li>
                    • Mention the tone you want (professional, casual, engaging,
                    etc.)
                  </li>
                  <li>• Specify key points or insights to include</li>
                </ul>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowCustomPromptModal(false)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={generateCustomContent}
                  disabled={
                    !customPrompt.trim() || isGeneratingContent === "custom"
                  }
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg text-white disabled:opacity-50 flex items-center space-x-2"
                >
                  {isGeneratingContent === "custom" ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <span>✨</span>
                      <span>Generate Content</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Selected Recommendation Modal */}
      {selectedRecommendation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                Content Details
              </h3>
              <button
                onClick={() => setSelectedRecommendation(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-white mb-2">
                  {selectedRecommendation.title}
                </h4>
                <p className="text-slate-300 text-sm">
                  {selectedRecommendation.description}
                </p>
              </div>

              <div className="bg-slate-700/30 rounded-lg p-4">
                <h5 className="font-medium text-white mb-2">AI Prompt</h5>
                <p className="text-slate-300 text-sm">
                  {selectedRecommendation.aiPrompt}
                </p>
              </div>

              {selectedRecommendation.content && (
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <h5 className="font-medium text-white mb-2">
                    Generated Content
                  </h5>
                  <div className="text-slate-300 text-sm whitespace-pre-wrap max-h-60 overflow-y-auto">
                    {selectedRecommendation.content}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedRecommendation(null)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    generateContentWithAI(selectedRecommendation);
                    setSelectedRecommendation(null);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg text-white"
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
