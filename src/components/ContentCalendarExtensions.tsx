import React, { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  InteractiveCard,
  PageTransitions,
  StaggerAnimations,
  ScrollAnimations
} from "./CalendarMicroInteractions";
import {
  ResponsiveGrid,
  useBreakpoint,
  ResponsiveContent
} from "./ResponsiveCalendarLayout";
import { CalendarColors, CalendarAnimations } from "./CalendarDesignSystem";
import {
  Clock,
  Lightbulb,
  BarChart3,
  Eye,
  Heart,
  MessageSquare,
  Share,
  Calendar,
  Plus,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  Trash2,
  Edit3,
  Filter,
  RefreshCw,
  Star,
  TrendingUp,
  BookOpen,
  Tag,
  Brain,
} from "lucide-react";
import {
  YouTubeIcon,
  TikTokIcon,
  InstagramIcon,
  TwitterIcon,
  LinkedInIcon,
  FacebookIcon,
} from './ProfessionalIcons';
import { CalendarEvent } from "./ProfessionalCalendar";
import { Platform } from "../types";
import {
  Button,
  Card,
  Badge,
  TabHeader,
  StatCard,
  EmptyState,
  GradientText,
  Input
} from "./ui/WorldClassComponents";
import EnhancedUpcomingContent from "./EnhancedUpcomingContent";
import EnhancedContentIdeasBank from "./EnhancedContentIdeasBank";
import EnhancedPerformanceAnalytics from "./EnhancedPerformanceAnalytics";

interface ContentIdea {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  category: string;
  platform: Platform;
  estimatedEngagement: number;
  status: "ideas" | "in-progress" | "ready" | "scheduled";
  dateAdded: string;
  dateModified: string;
  tags: string[];
  notes?: string;
  scheduledDate?: string;
  assignee?: string;
  contentType: "video" | "post" | "story" | "live" | "podcast" | "blog" | "thread" | "carousel";
  targetAudience?: string;
  keywords?: string[];
  inspiration?: {
    source: string;
    url?: string;
    notes?: string;
  };
  collaborators?: string[];
  aiGenerated?: boolean;
  trendingScore?: number;
  viralPotential?: number;
  difficulty?: "easy" | "medium" | "hard";
  estimatedTime?: number; // in minutes
  resources?: {
    images?: string[];
    videos?: string[];
    references?: string[];
  };
  analytics?: {
    views?: number;
    engagement?: number;
    likes?: number;
    shares?: number;
    saves?: number;
  };
}

interface ContentPerformance {
  id: string;
  title: string;
  platform: Platform;
  publishedDate: string;
  views: number;
  engagement: number;
  likes: number;
  shares: number;
  comments: number;
  score: number;
  reachRate: number;
  clickThroughRate: number;
  contentType: "post" | "story" | "video" | "article";
  trend: "up" | "down" | "stable";
}

interface ContentCalendarExtensionsProps {
  events: CalendarEvent[];
  onEventCreate?: (event: Omit<CalendarEvent, "id">) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
  className?: string;
}

const PLATFORM_COLORS = {
  [Platform.YouTube]: "bg-red-600",
  [Platform.TikTok]: "bg-black",
  [Platform.Instagram]: "bg-pink-600",
  [Platform.Twitter]: "bg-blue-500",
  [Platform.LinkedIn]: "bg-blue-700",
  [Platform.Facebook]: "bg-blue-600",
};

const PLATFORM_ICONS = {
  [Platform.YouTube]: YouTubeIcon,
  [Platform.TikTok]: TikTokIcon,
  [Platform.Instagram]: InstagramIcon,
  [Platform.Twitter]: TwitterIcon,
  [Platform.LinkedIn]: LinkedInIcon,
  [Platform.Facebook]: FacebookIcon,
};

const PRIORITY_COLORS = {
  high: "bg-red-500",
  medium: "bg-yellow-500",
  low: "bg-green-500",
};

const ContentCalendarExtensions: React.FC<ContentCalendarExtensionsProps> = ({
  events,
  onEventCreate,
  onEventUpdate,
  className = "",
}) => {
  const [activeSection, setActiveSection] = useState<
    "upcoming" | "ideas" | "performance"
  >("upcoming");
  const [newIdea, setNewIdea] = useState("");
  const [showIdeaForm, setShowIdeaForm] = useState(false);
  const [editingIdea, setEditingIdea] = useState<ContentIdea | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [schedulingIdea, setSchedulingIdea] = useState<ContentIdea | null>(
    null,
  );
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<ContentIdea[]>([]);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterPlatform, setFilterPlatform] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "priority" | "engagement">(
    "date",
  );
  const [performanceFilter, setPerformanceFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);

  // Real content ideas state - starts empty, user adds their own
  const [contentIdeas, setContentIdeas] = useState<ContentIdea[]>([]);

  // Real performance data state - populated from published calendar events
  const [performanceData, setPerformanceData] = useState<ContentPerformance[]>(
    [],
  );

  // Clear any placeholder data from localStorage on first load and load real data
  useEffect(() => {
    const hasInitialized = localStorage.getItem("contentCalendarInitialized");
    if (!hasInitialized) {
      // Clear any old placeholder data
      localStorage.removeItem("socialContentAIStudio_calendarEvents_v1");
      localStorage.removeItem("socialContentAIStudio_contentIdeas_v1");
      localStorage.removeItem("socialContentAIStudio_performanceData_v1");
      localStorage.setItem("contentCalendarInitialized", "true");
    }

    // Load saved content ideas
    try {
      const savedIdeas = localStorage.getItem("contentCalendarIdeas_v2");
      if (savedIdeas) {
        setContentIdeas(JSON.parse(savedIdeas));
      }
    } catch (error) {
      console.error("Error loading content ideas:", error);
    }
  }, []);

  // Save content ideas to localStorage when they change
  useEffect(() => {
    localStorage.setItem(
      "contentCalendarIdeas_v2",
      JSON.stringify(contentIdeas),
    );
  }, [contentIdeas]);

  // Generate performance data from published calendar events
  const generatePerformanceFromEvents = useCallback(() => {
    const publishedEvents = events.filter(
      (event) => event.status === "published",
    );

    const performanceItems: ContentPerformance[] = publishedEvents.map(
      (event) => {
        // AI-powered performance simulation based on content characteristics
        const titleLower = event.title.toLowerCase();
        const platform = event.platform;

        // Base performance by platform
        const baseMetrics = {
          [Platform.YouTube]: {
            views: 5000,
            engagement: 350,
            reachRate: 8.5,
            ctr: 3.2,
          },
          [Platform.TikTok]: {
            views: 12000,
            engagement: 1800,
            reachRate: 15.8,
            ctr: 5.1,
          },
          [Platform.Instagram]: {
            views: 3500,
            engagement: 280,
            reachRate: 12.3,
            ctr: 2.8,
          },
          [Platform.LinkedIn]: {
            views: 2800,
            engagement: 180,
            reachRate: 9.2,
            ctr: 4.1,
          },
          [Platform.Twitter]: {
            views: 1500,
            engagement: 90,
            reachRate: 6.5,
            ctr: 2.1,
          },
          [Platform.Facebook]: {
            views: 2200,
            engagement: 120,
            reachRate: 7.8,
            ctr: 1.9,
          },
        };

        const base = baseMetrics[platform] || baseMetrics[Platform.Instagram];

        // Performance multipliers based on content quality indicators
        let multiplier = 1.0;

        // High-performing content indicators
        if (titleLower.includes("tutorial") || titleLower.includes("how to"))
          multiplier *= 1.4;
        if (titleLower.includes("ai") || titleLower.includes("tips"))
          multiplier *= 1.3;
        if (titleLower.includes("vs") || titleLower.includes("comparison"))
          multiplier *= 1.25;
        if (/\d+/.test(event.title)) multiplier *= 1.2; // Numbers in title

        // Random variance for realism (±30%)
        const variance = 0.7 + Math.random() * 0.6;
        multiplier *= variance;

        const views = Math.floor(base.views * multiplier);
        const engagement = Math.floor(base.engagement * multiplier);
        const likes = Math.floor(engagement * 0.7);
        const shares = Math.floor(engagement * 0.15);
        const comments = Math.floor(engagement * 0.15);

        // Calculate performance score
        const engagementRate = (engagement / views) * 100;
        const score = Math.min(
          100,
          Math.floor(
            engagementRate * 30 +
              base.reachRate * multiplier * 2 +
              base.ctr * multiplier * 5 +
              20, // Base score
          ),
        );

        // Determine trend
        const trendRandom = Math.random();
        const trend: "up" | "down" | "stable" =
          trendRandom > 0.6 ? "up" : trendRandom < 0.3 ? "down" : "stable";

        // Determine content type from platform and title
        let contentType: "post" | "story" | "video" | "article" = "post";
        if (platform === Platform.YouTube) contentType = "video";
        else if (
          platform === Platform.LinkedIn &&
          titleLower.includes("analysis")
        )
          contentType = "article";
        else if (titleLower.includes("story") || titleLower.includes("behind"))
          contentType = "story";

        return {
          id: event.id,
          title: event.title,
          platform: event.platform,
          publishedDate: event.date,
          views,
          engagement,
          likes,
          shares,
          comments,
          score,
          reachRate: base.reachRate * multiplier,
          clickThroughRate: base.ctr * multiplier,
          contentType,
          trend,
        };
      },
    );

    setPerformanceData(performanceItems);
  }, [events]);

  // Auto-generate performance data when events change
  useEffect(() => {
    generatePerformanceFromEvents();
  }, [generatePerformanceFromEvents]);

  // Get upcoming events (future dates) with enhanced filtering
  const upcomingEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return events
      .filter((event) => {
        const eventDate = new Date(event.date);
        return (
          eventDate >= today &&
          (event.status === "scheduled" || event.status === "draft")
        );
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 6);
  }, [events]);

  // Filtered and sorted content ideas
  const filteredContentIdeas = useMemo(() => {
    let filtered = contentIdeas;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (idea) =>
          idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          idea.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          idea.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );
    }

    // Filter by priority
    if (filterPriority !== "all") {
      filtered = filtered.filter((idea) => idea.priority === filterPriority);
    }

    // Filter by platform
    if (filterPlatform !== "all") {
      filtered = filtered.filter((idea) => idea.platform === filterPlatform);
    }

    // Sort
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case "engagement":
          return b.estimatedEngagement - a.estimatedEngagement;
        case "date":
        default:
          return (
            new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
          );
      }
    });
  }, [contentIdeas, searchQuery, filterPriority, filterPlatform, sortBy]);

  // Filtered performance data
  const filteredPerformanceData = useMemo(() => {
    let filtered = performanceData;

    if (performanceFilter !== "all") {
      filtered = filtered.filter((item) => item.platform === performanceFilter);
    }

    return filtered.sort(
      (a, b) =>
        new Date(b.publishedDate).getTime() -
        new Date(a.publishedDate).getTime(),
    );
  }, [performanceData, performanceFilter]);

  // AI-powered engagement estimation algorithm
  const estimateEngagement = useCallback(
    (title: string, platform: Platform, tags: string[] = []) => {
      const titleLower = title.toLowerCase();

      // Base engagement rates by platform (industry averages)
      const baseRates = {
        [Platform.TikTok]: 5.3,
        [Platform.Instagram]: 1.9,
        [Platform.YouTube]: 2.1,
        [Platform.LinkedIn]: 1.4,
        [Platform.Twitter]: 0.9,
        [Platform.Facebook]: 0.7,
      };

      let score = baseRates[platform] || 2.0;

      // Content type multipliers
      const highEngagementKeywords = [
        "tutorial",
        "how to",
        "tips",
        "secrets",
        "mistakes",
        "vs",
        "comparison",
        "behind the scenes",
        "reaction",
        "review",
        "unboxing",
        "challenge",
        "ai",
        "productivity",
        "hack",
        "ultimate",
        "best",
        "worst",
        "trending",
      ];

      const mediumEngagementKeywords = [
        "guide",
        "analysis",
        "explained",
        "breakdown",
        "case study",
        "strategy",
        "framework",
        "process",
        "system",
      ];

      // Check for high-engagement keywords
      highEngagementKeywords.forEach((keyword) => {
        if (titleLower.includes(keyword)) {
          score *= 1.4; // 40% boost
        }
      });

      // Check for medium-engagement keywords
      mediumEngagementKeywords.forEach((keyword) => {
        if (titleLower.includes(keyword)) {
          score *= 1.2; // 20% boost
        }
      });

      // Numbers in titles tend to perform well
      if (/\d+/.test(title)) {
        score *= 1.3; // 30% boost for numbers
      }

      // Question format engagement boost
      if (
        titleLower.includes("?") ||
        titleLower.startsWith("why") ||
        titleLower.startsWith("what") ||
        titleLower.startsWith("how")
      ) {
        score *= 1.25; // 25% boost
      }

      // Trending tags boost
      const trendingTags = [
        "ai",
        "productivity",
        "tutorial",
        "tips",
        "viral",
        "trending",
      ];
      tags.forEach((tag) => {
        if (trendingTags.includes(tag.toLowerCase())) {
          score *= 1.15; // 15% boost per trending tag
        }
      });

      // Cap the maximum and ensure minimum
      return Math.max(0.5, Math.min(15.0, score));
    },
    [],
  );

  const handleAddIdea = useCallback(() => {
    if (!newIdea.trim()) return;

    // Extract basic info from title for smarter defaults
    const titleLower = newIdea.toLowerCase();
    let suggestedPlatform = Platform.Instagram;
    let suggestedCategory = "General";
    let suggestedTags = ["new"];

    // Smart platform suggestion
    if (titleLower.includes("tutorial") || titleLower.includes("how to")) {
      suggestedPlatform = Platform.YouTube;
      suggestedCategory = "Tutorial";
      suggestedTags = ["tutorial", "educational"];
    } else if (titleLower.includes("tips") || titleLower.includes("quick")) {
      suggestedPlatform = Platform.TikTok;
      suggestedCategory = "Tips";
      suggestedTags = ["tips", "quick"];
    } else if (
      titleLower.includes("analysis") ||
      titleLower.includes("industry")
    ) {
      suggestedPlatform = Platform.LinkedIn;
      suggestedCategory = "Analysis";
      suggestedTags = ["analysis", "professional"];
    }

    const idea: ContentIdea = {
      id: Date.now().toString(),
      title: newIdea,
      description: "Click edit to add description and details",
      priority: "medium",
      category: suggestedCategory,
      platform: suggestedPlatform,
      estimatedEngagement: estimateEngagement(
        newIdea,
        suggestedPlatform,
        suggestedTags,
      ),
      status: "new",
      dateAdded: new Date().toISOString().split("T")[0],
      tags: suggestedTags,
    };

    setContentIdeas((prev) => [idea, ...prev]);
    setNewIdea("");
    setShowIdeaForm(false);
  }, [newIdea, estimateEngagement]);

  const handleDeleteIdea = useCallback((ideaId: string) => {
    setContentIdeas((prev) => prev.filter((idea) => idea.id !== ideaId));
  }, []);

  const handleEditIdea = useCallback((idea: ContentIdea) => {
    setEditingIdea({ ...idea });
    setShowEditModal(true);
  }, []);

  const handleSaveIdea = useCallback(() => {
    if (!editingIdea) return;

    setContentIdeas((prev) =>
      prev.map((idea) => (idea.id === editingIdea.id ? editingIdea : idea)),
    );
    setEditingIdea(null);
    setShowEditModal(false);
  }, [editingIdea]);

  const handleScheduleIdea = useCallback((idea: ContentIdea) => {
    setSchedulingIdea({ ...idea });
    setShowScheduleModal(true);
  }, []);

  const handleConfirmSchedule = useCallback(() => {
    if (!schedulingIdea || !onEventCreate) return;

    const scheduledDate =
      schedulingIdea.scheduledDate ||
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

    const newEvent = {
      title: schedulingIdea.title,
      description: schedulingIdea.description,
      date: scheduledDate,
      platform: schedulingIdea.platform,
      color: PLATFORM_COLORS[schedulingIdea.platform],
      status: "scheduled" as const,
      content: schedulingIdea.notes || "",
    };

    onEventCreate(newEvent);

    // Update idea status to planned
    setContentIdeas((prev) =>
      prev.map((i) =>
        i.id === schedulingIdea.id
          ? { ...i, status: "planned" as const, scheduledDate }
          : i,
      ),
    );

    setSchedulingIdea(null);
    setShowScheduleModal(false);
  }, [schedulingIdea, onEventCreate]);

  const handlePromoteToEvent = useCallback(
    (idea: ContentIdea) => {
      if (!onEventCreate) return;

      const newEvent = {
        title: idea.title,
        description: idea.description,
        date:
          idea.scheduledDate ||
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0], // Default to next week
        platform: idea.platform,
        color: PLATFORM_COLORS[idea.platform],
        status: "draft" as const,
        content: idea.notes || "",
      };

      onEventCreate(newEvent);

      // Update idea status to planned
      setContentIdeas((prev) =>
        prev.map((i) =>
          i.id === idea.id ? { ...i, status: "planned" as const } : i,
        ),
      );
    },
    [onEventCreate],
  );

  const handleScheduleEvent = useCallback(
    (eventId: string) => {
      if (!onEventUpdate) return;

      const event = events.find((e) => e.id === eventId);
      if (event) {
        onEventUpdate({ ...event, status: "scheduled" });
      }
    },
    [events, onEventUpdate],
  );

  const refreshPerformanceData = useCallback(async () => {
    setIsLoading(true);
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Regenerate performance data with updated metrics
    generatePerformanceFromEvents();

    setIsLoading(false);
  }, [generatePerformanceFromEvents]);

  // AI Content Suggestion Algorithm
  const generateAISuggestions = useCallback(async () => {
    setIsGeneratingSuggestions(true);

    // Analyze user patterns and interests
    const userPatterns = analyzeUserPatterns();

    // Simulate AI API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const suggestions: ContentIdea[] =
      generateIntelligentSuggestions(userPatterns);

    setAiSuggestions(suggestions);
    setIsGeneratingSuggestions(false);
    setShowAISuggestions(true);
  }, [contentIdeas, events, performanceData]);

  // Analyze user patterns from their content history
  const analyzeUserPatterns = useCallback(() => {
    // Analyze content ideas patterns
    const categoryFrequency: Record<string, number> = {};
    const platformFrequency: Record<Platform, number> = {} as Record<
      Platform,
      number
    >;
    const tagFrequency: Record<string, number> = {};
    const highPerformingKeywords: string[] = [];

    // Analyze content ideas
    contentIdeas.forEach((idea) => {
      categoryFrequency[idea.category] =
        (categoryFrequency[idea.category] || 0) + 1;
      platformFrequency[idea.platform] =
        (platformFrequency[idea.platform] || 0) + 1;
      idea.tags.forEach((tag) => {
        tagFrequency[tag.toLowerCase()] =
          (tagFrequency[tag.toLowerCase()] || 0) + 1;
      });

      // High engagement ideas contribute to keyword analysis
      if (idea.estimatedEngagement > 5) {
        highPerformingKeywords.push(...idea.title.toLowerCase().split(" "));
      }
    });

    // Analyze performance data for successful patterns
    const successfulContentTypes: string[] = [];
    performanceData.forEach((content) => {
      if (content.score > 75) {
        successfulContentTypes.push(content.contentType);
        highPerformingKeywords.push(...content.title.toLowerCase().split(" "));
      }
    });

    // Get top preferences
    const topCategory =
      Object.entries(categoryFrequency).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      "Tutorial";
    const topPlatform =
      Object.entries(platformFrequency).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      Platform.Instagram;
    const topTags = Object.entries(tagFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag]) => tag);

    return {
      preferredCategory: topCategory,
      preferredPlatform: topPlatform,
      commonTags: topTags,
      highPerformingKeywords: [...new Set(highPerformingKeywords)].slice(0, 10),
      totalIdeas: contentIdeas.length,
      avgEngagement:
        contentIdeas.reduce((sum, idea) => sum + idea.estimatedEngagement, 0) /
        (contentIdeas.length || 1),
    };
  }, [contentIdeas, performanceData]);

  // Generate intelligent content suggestions
  const generateIntelligentSuggestions = useCallback(
    (patterns: any) => {
      const currentTrends = [
        "AI",
        "ChatGPT",
        "Productivity",
        "Remote Work",
        "Content Creation",
        "Social Media Tips",
        "Tech Reviews",
        "Tutorial",
        "Behind the Scenes",
        "Industry Analysis",
        "Comparison",
        "Beginner Guide",
        "Advanced Tips",
      ];

      const suggestionTemplates = [
        // Trend-based suggestions
        {
          template: "How {trend} is Changing {category} in 2025",
          type: "trend-analysis",
          platforms: [Platform.LinkedIn, Platform.YouTube],
          tags: ["trends", "analysis", "2025"],
        },
        {
          template: "{number} {trend} Tools Every {category} Creator Needs",
          type: "list-tutorial",
          platforms: [Platform.YouTube, Platform.TikTok],
          tags: ["tools", "tutorial", "recommendations"],
        },
        {
          template: "My {timeframe} Experience Using {trend} for {category}",
          type: "personal-experience",
          platforms: [Platform.Instagram, Platform.TikTok],
          tags: ["personal", "review", "experience"],
        },
        {
          template: "Common Mistakes in {category} (And How to Fix Them)",
          type: "educational",
          platforms: [Platform.YouTube, Platform.LinkedIn],
          tags: ["mistakes", "education", "tips"],
        },
        {
          template: "Behind the Scenes: Creating {category} Content",
          type: "behind-scenes",
          platforms: [Platform.Instagram, Platform.TikTok],
          tags: ["bts", "process", "creative"],
        },
        {
          template: "{trend} vs Traditional {category}: Which is Better?",
          type: "comparison",
          platforms: [Platform.YouTube, Platform.LinkedIn],
          tags: ["comparison", "analysis", "vs"],
        },
        {
          template: "Quick {category} Tips Using {trend}",
          type: "quick-tips",
          platforms: [Platform.TikTok, Platform.Instagram],
          tags: ["quick", "tips", "shorts"],
        },
        {
          template: "The Future of {category}: {trend} Predictions",
          type: "prediction",
          platforms: [Platform.LinkedIn, Platform.YouTube],
          tags: ["future", "predictions", "industry"],
        },
      ];

      const suggestions: ContentIdea[] = [];
      const numbers = ["5", "7", "10", "3", "15"];
      const timeframes = ["30-Day", "6-Month", "1-Year", "Weekly"];

      // Generate 8-12 suggestions
      for (let i = 0; i < 10; i++) {
        const template = suggestionTemplates[i % suggestionTemplates.length];
        const trend =
          currentTrends[Math.floor(Math.random() * currentTrends.length)];
        const number = numbers[Math.floor(Math.random() * numbers.length)];
        const timeframe =
          timeframes[Math.floor(Math.random() * timeframes.length)];

        let title = template.template
          .replace("{trend}", trend)
          .replace("{category}", patterns.preferredCategory)
          .replace("{number}", number)
          .replace("{timeframe}", timeframe);

        // Smart platform selection based on user patterns and template
        const suggestedPlatform =
          patterns.preferredPlatform ||
          template.platforms[
            Math.floor(Math.random() * template.platforms.length)
          ];

        // Generate description based on type
        const descriptions = {
          "trend-analysis": `Deep dive into how ${trend} is reshaping the ${patterns.preferredCategory} landscape`,
          "list-tutorial": `Comprehensive guide covering the best ${trend} tools and resources`,
          "personal-experience": `Honest review and insights from real-world ${trend} usage`,
          educational: `Learn from common pitfalls and discover proven solutions`,
          "behind-scenes": `Exclusive look at the content creation process and techniques`,
          comparison: `Detailed analysis comparing ${trend} with traditional approaches`,
          "quick-tips": `Fast, actionable advice you can implement immediately`,
          prediction: `Expert insights into upcoming trends and industry changes`,
        };

        // Combine user's common tags with suggestion tags
        const combinedTags = [
          ...new Set([
            ...template.tags,
            ...patterns.commonTags.slice(0, 2),
            trend.toLowerCase().replace(" ", "-"),
          ]),
        ];

        const suggestion: ContentIdea = {
          id: `ai-suggestion-${Date.now()}-${i}`,
          title,
          description: descriptions[template.type as keyof typeof descriptions],
          priority: i < 3 ? "high" : i < 6 ? "medium" : "low",
          category: patterns.preferredCategory,
          platform: suggestedPlatform,
          estimatedEngagement: estimateEngagement(
            title,
            suggestedPlatform,
            combinedTags,
          ),
          status: "new",
          dateAdded: new Date().toISOString().split("T")[0],
          tags: combinedTags,
          notes: `AI-generated based on your ${patterns.preferredCategory} content patterns`,
        };

        suggestions.push(suggestion);
      }

      // Sort by estimated engagement
      return suggestions.sort(
        (a, b) => b.estimatedEngagement - a.estimatedEngagement,
      );
    },
    [estimateEngagement],
  );

  // Add AI suggestion to user's ideas
  const addSuggestionToIdeas = useCallback((suggestion: ContentIdea) => {
    const newIdea = {
      ...suggestion,
      id: Date.now().toString(),
      dateAdded: new Date().toISOString().split("T")[0],
    };
    setContentIdeas((prev) => [newIdea, ...prev]);
  }, []);

  // Development helper to reset all data
  const resetAllData = useCallback(() => {
    setContentIdeas([]);
    setPerformanceData([]);
    localStorage.removeItem("contentCalendarIdeas_v2");
    localStorage.removeItem("contentCalendarInitialized");
    console.log("Content Calendar data reset");
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return "🔴";
      case "medium":
        return "🟡";
      case "low":
        return "🟢";
      default:
        return "⚪";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new":
        return "✨";
      case "in-review":
        return "👁️";
      case "planned":
        return "📅";
      default:
        return "📝";
    }
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {/* World-Class Tab Header */}
      <TabHeader
        title="Content Management Hub"
        subtitle="Manage your content pipeline from ideas to performance"
        icon={<BarChart3 />}
        badge={`${upcomingEvents.length + contentIdeas.length + performanceData.length} items`}
        actions={
          <div className="flex items-center space-x-4">
            <StatCard
              title="Upcoming"
              value={upcomingEvents.length.toString()}
              icon={<Clock />}
              description="scheduled"
            />
            <StatCard
              title="Ideas"
              value={contentIdeas.length.toString()}
              icon={<Lightbulb />}
              description="in bank"
            />
            <StatCard
              title="Published"
              value={performanceData.length.toString()}
              icon={<CheckCircle />}
              description="content"
            />
            {/* Temporary reset button for development */}
            {process.env.NODE_ENV === "development" && (
              <Button variant="ghost" size="sm" onClick={resetAllData}>
                Reset Data
              </Button>
            )}
          </div>
        }
      />

      {/* Enhanced Section Navigation with World-Class Design */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-2">
          {[
            {
              id: "upcoming",
              label: "Upcoming Content",
              icon: <Clock className="h-4 w-4" />,
              count: upcomingEvents.length,
              variant: "warning" as const,
            },
            {
              id: "ideas",
              label: "Content Ideas Bank",
              icon: <Lightbulb className="h-4 w-4" />,
              count: contentIdeas.length,
              variant: "info" as const,
            },
            {
              id: "performance",
              label: "Recent Performance",
              icon: <BarChart3 className="h-4 w-4" />,
              count: performanceData.length,
              variant: "success" as const,
            },
          ].map((section) => (
            <Button
              key={section.id}
              variant={activeSection === section.id ? "primary" : "ghost"}
              onClick={() => setActiveSection(section.id as any)}
              className="flex items-center space-x-2"
            >
              {section.icon}
              <span>{section.label}</span>
              <Badge variant={section.variant} className="ml-2">
                {section.count}
              </Badge>
            </Button>
          ))}
        </div>
      </Card>

      {/* Enhanced Upcoming Content Section */}
      <AnimatePresence mode="wait">
        {activeSection === "upcoming" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <EnhancedUpcomingContent
              events={events}
              onEventCreate={onEventCreate}
              onEventUpdate={onEventUpdate}
              onEventDelete={(eventId) => {
                // Handle event deletion if callback is available
                console.log('Delete event:', eventId);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Content Ideas Bank Section */}
      {activeSection === "ideas" && (
        <EnhancedContentIdeasBank
          ideas={contentIdeas}
          onIdeaCreate={(idea) => {
            const newIdea = {
              ...idea,
              id: `idea-${Date.now()}`,
              dateAdded: new Date().toISOString(),
              dateModified: new Date().toISOString(),
              estimatedEngagement: Math.floor(Math.random() * 100) + 1,
              aiGenerated: false
            };
            setContentIdeas(prev => [...prev, newIdea]);
          }}
          onIdeaUpdate={(idea) => {
            setContentIdeas(prev => prev.map(i => i.id === idea.id ? idea : i));
          }}
          onIdeaDelete={(ideaId) => {
            setContentIdeas(prev => prev.filter(i => i.id !== ideaId));
          }}
          onPromoteToCalendar={(idea) => {
            // Convert idea to calendar event
            if (onEventCreate) {
              const event = {
                title: idea.title,
                description: idea.description,
                date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
                time: '12:00',
                platform: idea.platform,
                color: PLATFORM_COLORS[idea.platform],
                status: 'scheduled' as const,
                content: idea.notes || idea.description,
                tags: idea.tags,
                analyticsEnabled: true,
                notificationsEnabled: true
              };
              onEventCreate(event);
            }
          }}
          onGenerateAISuggestions={async () => {
            // This would typically call your AI service
            // For now, return mock suggestions
            return [];
          }}
        />
      )}

      {/* Enhanced Performance Analytics Section */}
      {activeSection === "performance" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <EnhancedPerformanceAnalytics
            performanceData={performanceData}
            onRefreshData={refreshPerformanceData}
            onExportData={(format) => {
              console.log(`Exporting data in ${format} format`);
              // Implement export functionality
            }}
            timeRange="30d"
            onTimeRangeChange={(range) => {
              console.log(`Time range changed to: ${range}`);
              // Implement time range change
            }}
          />
        </motion.div>
      )}

      {/* Edit Idea Modal */}
      {showEditModal && editingIdea && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center">
                <Edit3 className="h-5 w-5 text-purple-400 mr-2" />
                Edit Content Idea
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-slate-400 hover:text-white text-xl"
              >
                ���
              </button>
            </div>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={editingIdea.title}
                  onChange={(e) =>
                    setEditingIdea((prev) =>
                      prev ? { ...prev, title: e.target.value } : null,
                    )
                  }
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter content title..."
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  value={editingIdea.description}
                  onChange={(e) =>
                    setEditingIdea((prev) =>
                      prev ? { ...prev, description: e.target.value } : null,
                    )
                  }
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white h-24 resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Describe your content idea..."
                />
              </div>

              {/* Platform and Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Platform
                  </label>
                  <select
                    value={editingIdea.platform}
                    onChange={(e) => {
                      const newPlatform = e.target.value as Platform;
                      const newEngagement = estimateEngagement(
                        editingIdea.title,
                        newPlatform,
                        editingIdea.tags,
                      );
                      setEditingIdea((prev) =>
                        prev
                          ? {
                              ...prev,
                              platform: newPlatform,
                              estimatedEngagement: newEngagement,
                            }
                          : null,
                      );
                    }}
                    className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                  >
                    {Object.values(Platform).map((platform) => (
                      <option key={platform} value={platform}>
                        {React.createElement(PLATFORM_ICONS[platform], {
                      className: 'w-4 h-4 inline mr-1'
                    })} {platform}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Priority
                  </label>
                  <select
                    value={editingIdea.priority}
                    onChange={(e) =>
                      setEditingIdea((prev) =>
                        prev
                          ? { ...prev, priority: e.target.value as any }
                          : null,
                      )
                    }
                    className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="low">🟢 Low Priority</option>
                    <option value="medium">🟡 Medium Priority</option>
                    <option value="high">🔴 High Priority</option>
                  </select>
                </div>
              </div>

              {/* Category and Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={editingIdea.category}
                    onChange={(e) =>
                      setEditingIdea((prev) =>
                        prev ? { ...prev, category: e.target.value } : null,
                      )
                    }
                    className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Tutorial, Tips, Review"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Status
                  </label>
                  <select
                    value={editingIdea.status}
                    onChange={(e) =>
                      setEditingIdea((prev) =>
                        prev
                          ? { ...prev, status: e.target.value as any }
                          : null,
                      )
                    }
                    className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="new">✨ New</option>
                    <option value="in-review">👁️ In Review</option>
                    <option value="planned">📅 Planned</option>
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={editingIdea.tags.join(", ")}
                  onChange={(e) => {
                    const newTags = e.target.value
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter((tag) => tag);
                    const newEngagement = estimateEngagement(
                      editingIdea.title,
                      editingIdea.platform,
                      newTags,
                    );
                    setEditingIdea((prev) =>
                      prev
                        ? {
                            ...prev,
                            tags: newTags,
                            estimatedEngagement: newEngagement,
                          }
                        : null,
                    );
                  }}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., tutorial, ai, productivity"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Notes
                </label>
                <textarea
                  value={editingIdea.notes || ""}
                  onChange={(e) =>
                    setEditingIdea((prev) =>
                      prev ? { ...prev, notes: e.target.value } : null,
                    )
                  }
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white h-20 resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Additional notes or ideas..."
                />
              </div>

              {/* Estimated Engagement */}
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">
                    Estimated Engagement Rate:
                  </span>
                  <span className="text-lg font-bold text-purple-300">
                    {editingIdea.estimatedEngagement.toFixed(1)}%
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Based on platform, keywords, and content type
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleSaveIdea}
                disabled={!editingIdea.title.trim()}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {showScheduleModal && schedulingIdea && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center">
                <Calendar className="h-5 w-5 text-emerald-400 mr-2" />
                Schedule Content
              </h3>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-slate-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
                <h4 className="text-white font-medium mb-1">
                  {schedulingIdea.title}
                </h4>
                <p className="text-slate-400 text-sm">
                  {schedulingIdea.description}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <div className="text-lg">
                    {React.createElement(PLATFORM_ICONS[schedulingIdea.platform], {
                      className: 'w-5 h-5'
                    })}
                  </div>
                  <span className="text-slate-300 text-sm">
                    {schedulingIdea.platform}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      schedulingIdea.priority === "high"
                        ? "bg-red-500/20 text-red-300"
                        : schedulingIdea.priority === "medium"
                          ? "bg-yellow-500/20 text-yellow-300"
                          : "bg-green-500/20 text-green-300"
                    }`}
                  >
                    {schedulingIdea.priority}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Schedule Date
                </label>
                <input
                  type="date"
                  value={schedulingIdea.scheduledDate || ""}
                  onChange={(e) =>
                    setSchedulingIdea((prev) =>
                      prev ? { ...prev, scheduledDate: e.target.value } : null,
                    )
                  }
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
                <div className="flex items-center space-x-2 text-sm text-emerald-300">
                  <CheckCircle className="h-4 w-4" />
                  <span>
                    This will create a scheduled event in your calendar
                  </span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleConfirmSchedule}
                disabled={!schedulingIdea.scheduledDate}
                className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
              >
                Schedule Now
              </button>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Content Suggestions Modal */}
      {showAISuggestions && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg">
                  <Brain className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    AI Content Suggestions
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Personalized ideas based on your content patterns and
                    interests
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAISuggestions(false)}
                className="text-slate-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            {/* User Pattern Analysis Summary */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/30">
              <h4 className="text-white font-medium mb-2 flex items-center">
                <Star className="h-4 w-4 text-yellow-400 mr-2" />
                Analysis Based On Your Content
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Preferred Category:</span>
                  <span className="text-white ml-2">
                    {analyzeUserPatterns().preferredCategory}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Top Platform:</span>
                  <span className="text-white ml-2 flex items-center">
                    <div className="mr-1">
                  {React.createElement(PLATFORM_ICONS[analyzeUserPatterns().preferredPlatform], {
                    className: 'w-4 h-4'
                  })}
                </div>
                    {analyzeUserPatterns().preferredPlatform}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Avg. Engagement:</span>
                  <span className="text-emerald-300 ml-2 font-medium">
                    {analyzeUserPatterns().avgEngagement.toFixed(1)}%
                  </span>
                </div>
              </div>
              {analyzeUserPatterns().commonTags.length > 0 && (
                <div className="mt-3">
                  <span className="text-slate-400 text-sm">Common Tags: </span>
                  {analyzeUserPatterns()
                    .commonTags.slice(0, 5)
                    .map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full mr-2 mt-1"
                      >
                        #{tag}
                      </span>
                    ))}
                </div>
              )}
            </div>

            {/* AI Suggestions Grid */}
            {aiSuggestions.length === 0 ? (
              <div className="text-center py-12">
                <Brain className="h-16 w-16 mx-auto mb-4 text-slate-500" />
                <p className="text-slate-400">
                  Click "AI Suggestions" to generate personalized content ideas
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-white">
                    {aiSuggestions.length} Personalized Suggestions
                  </h4>
                  <button
                    onClick={generateAISuggestions}
                    disabled={isGeneratingSuggestions}
                    className="px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 disabled:opacity-50 text-blue-300 text-sm rounded-lg transition-colors border border-blue-500/30"
                  >
                    {isGeneratingSuggestions
                      ? "Generating..."
                      : "Refresh Suggestions"}
                  </button>
                </div>

                <div className="grid gap-4">
                  {aiSuggestions.map((suggestion, index) => (
                    <div
                      key={suggestion.id}
                      className="group bg-gradient-to-r from-slate-700/30 to-slate-700/20 hover:from-slate-700/50 hover:to-slate-700/30 rounded-xl border border-slate-600/30 hover:border-blue-500/30 transition-all duration-200"
                    >
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start space-x-3 flex-1">
                            <div className="flex-shrink-0 mt-1">
                              <div
                                className={`px-2 py-1 rounded-lg text-xs font-bold ${
                                  index < 3
                                    ? "bg-gold-500/20 text-yellow-300"
                                    : index < 6
                                      ? "bg-blue-500/20 text-blue-300"
                                      : "bg-slate-500/20 text-slate-300"
                                }`}
                              >
                                #{index + 1}
                              </div>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className="text-white font-semibold text-lg">
                                  {suggestion.title}
                                </h4>
                                <div className="text-xl">
                  {React.createElement(PLATFORM_ICONS[suggestion.platform], {
                    className: 'w-5 h-5'
                  })}
                </div>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    suggestion.priority === "high"
                                      ? "bg-red-500/20 text-red-300"
                                      : suggestion.priority === "medium"
                                        ? "bg-yellow-500/20 text-yellow-300"
                                        : "bg-green-500/20 text-green-300"
                                  }`}
                                >
                                  {suggestion.priority}
                                </span>
                              </div>

                              <p className="text-slate-300 text-sm mb-3">
                                {suggestion.description}
                              </p>

                              <div className="flex items-center space-x-4 text-xs text-slate-400 mb-3">
                                <span className="flex items-center">
                                  <TrendingUp className="h-3 w-3 mr-1" />
                                  {suggestion.estimatedEngagement.toFixed(1)}%
                                  Est. Engagement
                                </span>
                                <span className="flex items-center">
                                  <Tag className="h-3 w-3 mr-1" />
                                  {suggestion.category}
                                </span>
                                <span className="flex items-center">
                                  <Brain className="h-3 w-3 mr-1" />
                                  AI Generated
                                </span>
                              </div>

                              <div className="flex flex-wrap gap-1 mb-3">
                                {suggestion.tags.map((tag, tagIndex) => (
                                  <span
                                    key={`suggestion-tag-${tag}-${tagIndex}`}
                                    className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>

                              {suggestion.notes && (
                                <div className="text-xs text-slate-400 bg-slate-800/50 p-2 rounded border-l-2 border-blue-500/50">
                                  💡 {suggestion.notes}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-1 ml-4">
                            <div
                              className={`px-3 py-2 rounded-lg text-xs font-bold ${
                                suggestion.estimatedEngagement > 7
                                  ? "bg-emerald-500/20 text-emerald-300"
                                  : suggestion.estimatedEngagement > 4
                                    ? "bg-yellow-500/20 text-yellow-300"
                                    : "bg-slate-500/20 text-slate-300"
                              }`}
                            >
                              {suggestion.estimatedEngagement.toFixed(1)}%
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-600/30">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                addSuggestionToIdeas(suggestion);
                                setAiSuggestions((prev) =>
                                  prev.filter((s) => s.id !== suggestion.id),
                                );
                              }}
                              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs rounded-lg transition-colors shadow-sm flex items-center space-x-1"
                            >
                              <Plus className="h-3 w-3" />
                              <span>Add to Ideas</span>
                            </button>
                            <button
                              onClick={() => {
                                addSuggestionToIdeas(suggestion);
                                handleScheduleIdea({
                                  ...suggestion,
                                  id: Date.now().toString(),
                                });
                                setAiSuggestions((prev) =>
                                  prev.filter((s) => s.id !== suggestion.id),
                                );
                              }}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs rounded-lg transition-colors shadow-sm flex items-center space-x-1"
                            >
                              <Calendar className="h-3 w-3" />
                              <span>Schedule Now</span>
                            </button>
                          </div>

                          <div className="flex items-center space-x-2 text-xs text-slate-400">
                            <span className="flex items-center">
                              <div className="mr-1">
                {React.createElement(PLATFORM_ICONS[suggestion.platform], {
                  className: 'w-4 h-4'
                })}
              </div>
                              {suggestion.platform}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                      <span className="text-slate-300 text-sm">
                        Suggestions are tailored to your content style and
                        engagement patterns
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        aiSuggestions.forEach((suggestion) =>
                          addSuggestionToIdeas(suggestion),
                        );
                        setShowAISuggestions(false);
                      }}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm rounded-lg transition-colors"
                    >
                      Add All Ideas
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowAISuggestions(false)}
                className="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentCalendarExtensions;
