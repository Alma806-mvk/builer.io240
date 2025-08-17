import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Eye,
  Users,
  Clock,
  Heart,
  MessageSquare,
  Share2,
  ThumbsUp,
  PlayCircle,
  Calendar,
  Target,
  Award,
  Zap,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  MapPin,
  Lightbulb,
  Brain,
  Star,
  Filter,
  Download,
  RefreshCw,
  Settings,
  Search,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  Minus,
  Plus,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Info,
  Sparkles,
  Video,
  Music,
  Image,
  FileText,
  DollarSign,
  PieChart,
  Activity,
  Wifi,
  WifiOff,
} from "lucide-react";

// Import our world-class components
import {
  Button,
  Card,
  Badge,
  GradientText,
  StatCard,
  ProgressBar,
  Input,
  QuickActionCard,
  EmptyState,
  TabHeader,
} from "./ui/WorldClassComponents";

// Import analysis components
import PremiumYouTubeAnalysis from "./PremiumYouTubeAnalysis";
import YouTubeAnalyticsDashboard from "./YouTubeAnalyticsDashboard";
import ContentGapDetectionEngine from "./ContentGapDetectionEngine";

// Import services
import { youtubeService } from "../services/youtubeService";
import { generateTextContent } from "../../services/geminiService";
import { ParsedChannelAnalysisSection, ContentType, Platform } from "../types";

// Helper function to parse channel data from Google search results with improved accuracy
const parseChannelDataFromSearch = (searchText: string, channelInput: string) => {
  const lines = searchText.split('\n');
  let channelName = channelInput;
  let subscribers = '0';
  let totalViews = '0';
  let totalVideos = '0';
  let location = 'Unknown';
  let joinedDate = 'Unknown';

  lines.forEach(line => {
    const cleanLine = line.trim();

    // Enhanced Channel Name parsing
    if (/(?:Channel Name|Name):/i.test(cleanLine)) {
      channelName = cleanLine.split(':')[1]?.trim().replace(/\*/g, '') || channelInput;
    }
    // Also extract from @handle patterns
    if (cleanLine.includes('@') && channelName === channelInput) {
      const handleMatch = cleanLine.match(/@([a-zA-Z0-9_-]+)/);
      if (handleMatch) {
        channelName = handleMatch[1];
      }
    }
    // Extract from YouTube URLs
    if (cleanLine.includes('youtube.com/') && channelName === channelInput) {
      const urlMatch = cleanLine.match(/youtube\.com\/@?([a-zA-Z0-9_-]+)/);
      if (urlMatch) {
        channelName = urlMatch[1];
      }
    }
    
    // Enhanced Subscribers parsing with multiple patterns
    if (/Subscribers?:/i.test(cleanLine)) {
      const match = cleanLine.match(/Subscribers?:\s*([\d,KkMmBb.]+\s*(?:subscribers?)?)/i);
      subscribers = match
        ? match[1].replace(/\s*subscribers?/i, '').trim()
        : cleanLine.split(':')[1]?.trim().replace(/\*/g, '') || '0';
    }
    
    // Enhanced Views parsing
    if (/(?:All-time\s+Views|Total\s+Views|Views):/i.test(cleanLine)) {
      const match = cleanLine.match(/(?:All-time\s+Views|Total\s+Views|Views):\s*([\d,KkMmBb.]+)/i);
      totalViews = match
        ? match[1]
        : cleanLine.split(':')[1]?.trim().split(' ')[0].replace(/\*/g, '') || '0';
    }
    
    // Enhanced Videos parsing
    if (/(?:Total\s+Videos|All\s+Videos|Videos):/i.test(cleanLine)) {
      const match = cleanLine.match(/(?:Total\s+Videos|All\s+Videos|Videos):\s*([\d,KkMmBb.]+)/i);
      totalVideos = match
        ? match[1].replace(/[,]/g, '')
        : cleanLine.split(':')[1]?.trim().replace(/\*/g, '') || '0';
    }
    
    if (/Location:/i.test(cleanLine)) {
      location = cleanLine.split(':')[1]?.trim().replace(/\*/g, '') || 'Unknown';
    }
    if (/Joined YouTube:/i.test(cleanLine)) {
      joinedDate = cleanLine.split(':')[1]?.trim().replace(/\*/g, '') || 'Unknown';
    }
  });

  return {
    id: `search_${channelInput.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
    title: channelName,
    statistics: {
      subscriberCount: subscribers,
      videoCount: totalVideos,
      viewCount: totalViews
    },
    snippet: {
      title: channelName,
      description: `${channelName} is a popular YouTube channel.`,
      publishedAt: joinedDate,
      country: location
    }
  };
};

interface YouTubeAnalysisWorldClassProps {
  userPlan?: string;
  onNavigateToTab?: (tab: string) => void;
}

interface AnalysisProgress {
  current: number;
  total: number;
  currentChannel: string;
}

const YouTubeAnalysisWorldClass: React.FC<YouTubeAnalysisWorldClassProps> = ({
  userPlan = "free",
  onNavigateToTab,
}) => {
  const [channelUrl, setChannelUrl] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [timeRange, setTimeRange] = useState("30d");
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState<AnalysisProgress | null>(null);
  const [loadingPhase, setLoadingPhase] = useState('');
  const [dataTimestamp, setDataTimestamp] = useState<Date | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [parsedAnalysis, setParsedAnalysis] = useState<ParsedChannelAnalysisSection[] | null>(null);
  const [analysisSummary, setAnalysisSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [activeAnalysisTab, setActiveAnalysisTab] = useState("overview");
  const [copied, setCopied] = useState(false);
  const [detailedAnalysisSection, setDetailedAnalysisSection] = useState<ParsedChannelAnalysisSection | null>(null);
  const [currentTime, setCurrentTime] = useState<number | null>(null);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(true);

  // Fix hydration issue by setting current time on client only
  useEffect(() => {
    setCurrentTime(Date.now());
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // Helper to extract actionable ideas from content
  const extractIdeasFromContent = (content: string): string[] => {
    const ideas: string[] = [];
    const lines = content.split('\n');

    for (const line of lines) {
      if (line.match(/^[\s]*[-\*]\s+/) || line.includes('recommend') || line.includes('should') || line.includes('could')) {
        const idea = line.replace(/^[\s]*[-\*]\s+/, '').trim();
        if (idea.length > 10 && idea.length < 200) {
          ideas.push(idea);
        }
      }
    }

    return ideas.slice(0, 5); // Limit to 5 ideas per section
  };

  // Generate comprehensive professional analysis with individual API calls for each card
  const generateComprehensiveAnalysis = useCallback(async (channelData: any, channelInput: string): Promise<ParsedChannelAnalysisSection[]> => {
    const sections: ParsedChannelAnalysisSection[] = [];

    // Define the 12 specific analysis topics with improved search queries
    const analysisTopics = [
      {
        title: "Real-Time Channel Statistics & Performance Metrics",
        prompt: `Find the exact current statistics for the YouTube channel "${channelInput}". I need you to search the web and provide the ACTUAL numbers for:
- Current subscriber count (exact number)
- Total video views (exact number)
- Number of videos uploaded
- Channel creation date
- Recent performance metrics

Please search for this information and provide real, current data with specific numbers.`
      },
      {
        title: "Content Strategy & Video Performance Analysis",
        prompt: `Analyze the content strategy of YouTube channel "${channelInput}". Search for:
- Most popular videos and their view counts
- Video upload frequency and schedule
- Content themes and topics
- Video formats and styles
- Performance trends over time

Provide specific examples of successful videos with actual view counts and engagement numbers.`
      },
      {
        title: "Audience Demographics & Engagement Insights",
        prompt: `Research the audience and engagement data for "${channelInput}" YouTube channel:
- Average views per video
- Like-to-view ratio
- Comment engagement rates
- Subscriber demographics if available
- Geographic audience distribution

Find real engagement metrics and provide specific percentages and numbers.`
      },
      {
        title: "Revenue & Monetization Analysis",
        prompt: `Search for revenue and monetization information about "${channelInput}":
- Estimated monthly/yearly earnings
- Sponsorship deals and brand partnerships
- Merchandise sales
- Other revenue streams
- CPM rates for their niche

Provide specific dollar amounts and monetization strategies they use.`
      },
      {
        title: "Growth Trajectory & Subscriber Analytics",
        prompt: `Find growth data for "${channelInput}" YouTube channel:
- Subscriber growth over the past year
- Monthly subscriber gain/loss
- Growth milestones and dates
- Fastest growing periods
- Current growth rate

Provide specific numbers and timeframes for their growth.`
      },
      {
        title: "Competitive Analysis & Market Position",
        prompt: `Research "${channelInput}" compared to competitors:
- Similar channels in their niche
- Ranking within their category
- Unique competitive advantages
- Market share analysis
- Performance vs competitors

Provide specific competitor names and comparative metrics.`
      },
      {
        title: "SEO & Discoverability Optimization",
        prompt: `Analyze SEO and discoverability for "${channelInput}":
- Most effective keywords they use
- Video title optimization strategies
- Thumbnail click-through rates
- Search ranking performance
- Discovery traffic sources

Provide specific keywords and optimization tactics they employ.`
      },
      {
        title: "Brand Partnerships & Collaboration History",
        prompt: `Find brand partnerships and collaborations for "${channelInput}":
- Major brand sponsorships
- Collaboration videos with other creators
- Partnership deals and their values
- Brand ambassador roles
- Recent sponsored content

Provide specific brand names and partnership details.`
      },
      {
        title: "Technical Performance & Quality Metrics",
        prompt: `Research technical performance metrics for "${channelInput}":
- Average video retention rates
- Video quality and production value
- Upload consistency
- Watch time metrics
- Technical optimization strategies

Provide specific performance percentages and technical details.`
      },
      {
        title: "Social Media Integration & Cross-Platform Presence",
        prompt: `Find cross-platform presence for "${channelInput}":
- Instagram follower count and engagement
- TikTok presence and performance
- Twitter/X following and activity
- Other social media platforms
- Cross-platform promotion strategies

Provide actual follower counts and engagement metrics.`
      },
      {
        title: "Community Building & Fan Engagement Strategies",
        prompt: `Research community engagement for "${channelInput}":
- Community posts engagement
- Live stream performance
- Fan interaction strategies
- Comment response rates
- Community building tactics

Provide specific engagement metrics and community management strategies.`
      },
      {
        title: "Future Growth Opportunities & Strategic Recommendations",
        prompt: `Analyze growth opportunities for "${channelInput}":
- Emerging trends in their niche
- Untapped content opportunities
- Platform expansion possibilities
- Monetization growth potential
- Strategic recommendations

Provide actionable insights based on current market trends and their performance.`
      }
    ];

    // Process each analysis topic with individual API calls
    for (let i = 0; i < analysisTopics.length; i++) {
      const topic = analysisTopics[i];
      
      try {
        setLoadingPhase(`Researching ${topic.title} (${i + 1}/12)...`);
        
        // Make individual API call with Google search for this specific topic
        console.log(`🔍 Processing analysis topic ${i + 1}/12: ${topic.title}`);

        const searchResult = await generateTextContent({
          userInput: `${topic.prompt}\n\nIMPORTANT: Focus ONLY on "${topic.title}" analysis. Do not repeat information from other analysis sections.`,
          contentType: ContentType.YoutubeChannelStats,
          platform: Platform.YouTube,
          userPlan: userPlan,
          includeWebSearch: true
        });

        if (searchResult?.text) {
          // Extract specific insights and data from the search result
          const analysisContent = searchResult.text;

          // Add unique identifier to prevent content duplication
          const uniqueContent = `[Analysis ${i + 1}/12: ${topic.title}]\n\n${analysisContent}`;

          // Extract actionable ideas from the analysis
          const ideas = extractIdeasFromContent(analysisContent);

          console.log(`✅ Completed analysis ${i + 1}: ${topic.title} (${analysisContent.length} chars)`);

          sections.push({
            title: topic.title,
            content: uniqueContent,
            ideas: ideas
          });
        } else {
          // Fallback if API call fails
          console.warn(`❌ Failed to get data for analysis ${i + 1}: ${topic.title}`);
          sections.push({
            title: topic.title,
            content: `[Analysis ${i + 1}/12: ${topic.title}]\n\nUnable to retrieve specific data for ${topic.title}. This analysis requires real-time web search data. Please try again with a stable internet connection.`,
            ideas: ["Retry analysis with better internet connection", "Contact support if issue persists", "Check if the channel name or URL is correct"]
          });
        }
        
        // Small delay between API calls to avoid rate limiting
        if (i < analysisTopics.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
        
      } catch (error) {
        console.error(`Error analyzing ${topic.title}:`, error);
        sections.push({
          title: topic.title,
          content: `Error occurred while analyzing ${topic.title}: ${error.message}`,
          ideas: ["Retry this analysis", "Check internet connection"]
        });
      }
    }

    return sections;
  }, [userPlan]);

  const handleAnalyzeChannel = useCallback(async () => {
    if (!channelUrl.trim()) {
      setAnalysisError("Please enter a channel URL, handle, or name to analyze.");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);
    setParsedAnalysis(null);
    setAnalysisSummary(null);
    setLoadingPhase('Initializing analysis');
    setDataTimestamp(new Date());

    try {
      // Parse multiple channels if provided
      const channelInputs = channelUrl
        .split(",")
        .map((ch) => ch.trim())
        .filter((ch) => ch.length > 0)
        .slice(0, 5); // Limit to 5 channels

      // Validate channel inputs
      const validChannels = channelInputs.filter((channel) => {
        return (
          channel.includes("youtube.com/") ||
          channel.includes("youtu.be/") ||
          channel.startsWith("https://") ||
          channel.startsWith("http://") ||
          channel.startsWith("@") ||
          (!channel.includes(" ") && !channel.includes(".") && channel.length > 2)
        );
      });

      if (validChannels.length === 0) {
        throw new Error("Please enter valid YouTube URLs, channel names starting with @, or channel names.");
      }

      setAnalysisProgress({
        current: 0,
        total: validChannels.length,
        currentChannel: ""
      });
      setLoadingPhase('Connecting to YouTube API');

      // Simulate real API connection time
      await new Promise(resolve => setTimeout(resolve, 1500));

      const allAnalysisResults: ParsedChannelAnalysisSection[] = [];

      // Analyze each channel sequentially
      for (let i = 0; i < validChannels.length; i++) {
        const channelInput = validChannels[i];

        setAnalysisProgress({
          current: i + 1,
          total: validChannels.length,
          currentChannel: channelInput
        });
        setLoadingPhase(`Fetching real-time data for ${channelInput}`);

        try {
          setLoadingPhase(`Searching for ${channelInput} statistics...`);
          // Use Google search through Gemini API instead of YouTube API
          await new Promise(resolve => setTimeout(resolve, 800));

          const searchResult = await generateTextContent({
            userInput: channelInput,
            contentType: ContentType.YoutubeChannelStats,
            platform: Platform.YouTube,
            userPlan: userPlan,
            includeWebSearch: true
          });

          if (!searchResult?.text) {
            throw new Error(`No data found for channel: ${channelInput}`);
          }

          // Parse the channel statistics from the search result
          const channelData = parseChannelDataFromSearch(searchResult.text, channelInput);

          setLoadingPhase(`Processing comprehensive analytics...`);
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Generate comprehensive professional analysis sections with individual API calls
          const sections = await generateComprehensiveAnalysis(channelData, channelInput);

          // Add comprehensive analysis sections
          allAnalysisResults.push(...sections);

        } catch (channelError) {
          console.error(`Error analyzing channel ${channelInput}:`, channelError);
          // Continue with other channels but add error section
          allAnalysisResults.push({
            title: `Analysis Error - ${channelInput}`,
            content: `Failed to analyze channel: ${channelError.message}`,
            ideas: []
          });
        }

        // Small delay between channels to avoid rate limiting
        if (i < validChannels.length - 1) {
          setLoadingPhase(`Preparing next channel analysis...`);
          await new Promise(resolve => setTimeout(resolve, 1200));
        }
      }

      setLoadingPhase('Finalizing comprehensive analysis...');
      await new Promise(resolve => setTimeout(resolve, 800));

      setParsedAnalysis(allAnalysisResults);
      setHasAnalyzed(true);
      setDataTimestamp(new Date());

    } catch (error) {
      console.error("Channel analysis error:", error);
      setAnalysisError(error.message || "Failed to analyze channel");
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress(null);
      setLoadingPhase('');
    }
  }, [channelUrl, userPlan, generateComprehensiveAnalysis]);

  // Handle copying to clipboard with fallback methods
  const handleCopyToClipboard = useCallback((text: string) => {
    // Method 1: Try modern Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(err => {
        console.warn('Clipboard API failed, trying fallback:', err);
        // Fallback to legacy method
        fallbackCopyToClipboard(text);
      });
    } else {
      // Method 2: Fallback for environments where Clipboard API is not available
      fallbackCopyToClipboard(text);
    }
  }, []);

  // Fallback clipboard method
  const fallbackCopyToClipboard = useCallback((text: string) => {
    try {
      // Create a temporary textarea element
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);

      // Select and copy the text
      textArea.focus();
      textArea.select();

      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);

      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        console.log('Text copied successfully using fallback method');
      } else {
        throw new Error('Copy command failed');
      }
    } catch (err) {
      console.error('All copy methods failed:', err);
      // Show user a message to manually copy
      showManualCopyDialog(text);
    }
  }, []);

  // Show manual copy dialog as last resort
  const showManualCopyDialog = useCallback((text: string) => {
    const truncatedText = text.length > 200 ? text.substring(0, 200) + '...' : text;
    alert(`Copy failed. Please manually copy this text:\n\n${truncatedText}\n\n[Content has been downloaded as a file instead]`);

    // Automatically trigger download as alternative
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `youtube-analysis-copy-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  // Handle summarizing analysis
  const handleSummarizeAnalysis = useCallback(async () => {
    if (!parsedAnalysis || parsedAnalysis.length === 0) {
      setAnalysisError("No analysis available to summarize.");
      return;
    }

    setIsSummarizing(true);
    // Clear previous summary and expand new one
    setAnalysisSummary(null);
    setIsSummaryExpanded(true);

    try {
      const fullAnalysisText = parsedAnalysis
        .map((section) => `## ${section.title}\n${section.content}`)
        .join("\n\n");

      const summaryPrompt = `Please provide a comprehensive executive summary of this YouTube channel analysis:\n\n${fullAnalysisText}\n\nCreate a strategic summary that highlights:\n1. Key insights and opportunities\n2. Main strengths and weaknesses\n3. Priority recommendations\n4. Growth potential\n\nKeep it concise but comprehensive (300-500 words).`;

      const summaryResult = await generateTextContent({
        userInput: summaryPrompt,
        contentType: ContentType.ChannelAnalysis,
        platform: Platform.YouTube,
        userPlan: userPlan,
        includeWebSearch: false
      });

      if (summaryResult?.text) {
        setAnalysisSummary(summaryResult.text);
      }
    } catch (error) {
      console.error("Error generating summary:", error);
      setAnalysisError("Failed to generate analysis summary");
    } finally {
      setIsSummarizing(false);
    }
  }, [parsedAnalysis, userPlan]);

  // Show the initial search interface similar to YouTube Stats
  if (!hasAnalyzed && !isAnalyzing) {
    return (
      <div className="space-y-8">
        <TabHeader
          title="YouTube Channel Analysis"
          subtitle="Get comprehensive statistics and analysis for any YouTube channel"
          icon={<BarChart3 />}
          badge="Professional Analytics"
          actions={
            <Button variant="ghost" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          }
        />

        {/* Channel Input Section */}
        <Card variant="glow" className="relative overflow-hidden">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-red-600 text-white">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h3 className="heading-4 mb-1">Analyze Any YouTube Channel</h3>
              <p className="body-base">Enter channel URL, handle, or channel name to get started</p>
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <Input
                placeholder="e.g., @MrBeast, PewDiePie, or https://youtube.com/@channel"
                value={channelUrl}
                onChange={setChannelUrl}
                icon={<Search className="w-4 h-4" />}
              />
            </div>
            <Button
              variant="primary"
              onClick={handleAnalyzeChannel}
              disabled={!channelUrl.trim() || isAnalyzing}
              icon={isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            >
              {isAnalyzing ? "Analyzing..." : "Analyze Channel"}
            </Button>
          </div>

          {showAdvancedFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-[var(--border-primary)]"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Time Range
                  </label>
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="input-base"
                  >
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 3 months</option>
                    <option value="1y">Last year</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Analysis Focus
                  </label>
                  <select className="input-base">
                    <option value="all">All Metrics</option>
                    <option value="content">Content Analysis</option>
                    <option value="growth">Growth Analysis</option>
                    <option value="competitive">Competitive Intel</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Compare With
                  </label>
                  <select className="input-base">
                    <option value="none">No Comparison</option>
                    <option value="industry">Industry Average</option>
                    <option value="similar">Similar Channels</option>
                    <option value="competitors">Competitors</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <QuickActionCard
            title="Channel Guidelines"
            description="Best practices for YouTube success"
            icon={<Award />}
            color="#10b981"
            onClick={() => {}}
            badge="Free"
          />
          <QuickActionCard
            title="Competitor Analysis"
            description="Compare with similar channels"
            icon={<Target />}
            color="#6366f1"
            onClick={() => {}}
            badge="Pro"
          />
          <QuickActionCard
            title="Upload Templates"
            description="Download optimized video templates"
            icon={<Download />}
            color="#f59e0b"
            onClick={() => {}}
          />
        </div>

        {/* Empty State */}
        <EmptyState
          icon={<BarChart3 />}
          title="Ready to Analyze YouTube Channels"
          description="Enter any YouTube channel URL above to get comprehensive analytics, growth insights, and performance metrics."
          actionLabel="Try Sample Analysis"
          onAction={() => setChannelUrl("@MrBeast")}
        />
      </div>
    );
  }

  // Show analysis loading state with enhanced animations
  if (isAnalyzing) {
    return (
      <div className="space-y-8">
        <TabHeader
          title="YouTube Channel Analysis"
          subtitle="Analyzing your channels with AI-powered insights..."
          icon={<BarChart3 />}
          badge="Live Analysis"
        />

        <Card variant="glow" className="relative overflow-hidden bg-gradient-to-br from-[var(--surface-secondary)] to-[var(--surface-tertiary)]">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5 animate-pulse"></div>

          <div className="relative text-center py-16">
            {/* Enhanced Status Indicator with pulse animation */}
            <motion.div
              className="flex items-center justify-center mb-8"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative">
                <div className="w-4 h-4 bg-green-500 rounded-full animate-ping absolute"></div>
                <div className="w-4 h-4 bg-green-400 rounded-full mr-3"></div>
              </div>
              <Badge className="bg-gradient-to-r from-green-100 to-blue-100 text-green-800 border-green-200 shadow-lg">
                🔥 Live Real-Time Analysis
              </Badge>
            </motion.div>

            {/* Main loading animation */}
            <motion.div
              className="relative mb-8"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 mx-auto mb-4"
                >
                  <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-500 rounded-full"></div>
                </motion.div>
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-16 border-4 border-purple-200 border-b-purple-500 rounded-full"
                >
                </motion.div>
              </div>
            </motion.div>

            {/* Dynamic title with typewriter effect */}
            <motion.h3
              className="text-2xl font-bold text-[var(--text-primary)] mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              {analysisProgress ?
                `🚀 Processing ${analysisProgress.current}/12 Analysis Cards` :
                "🔍 Connecting to Real-Time YouTube Data"
              }
            </motion.h3>

            {/* Enhanced Loading Phase Indicator */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="bg-[var(--surface-tertiary)] rounded-xl p-4 mb-4 border border-[var(--border-primary)]">
                <div className="text-[var(--text-primary)] font-medium mb-2 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="mr-2"
                  >
                    🔎
                  </motion.div>
                  {loadingPhase || "Initializing AI-powered analysis engine..."}
                </div>
                {analysisProgress && (
                  <div className="text-sm text-[var(--text-secondary)] flex items-center justify-center">
                    📺 Channel: <span className="font-mono ml-1 text-blue-600">{analysisProgress.currentChannel}</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Enhanced Progress Bar */}
            {analysisProgress && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <div className="max-w-lg mx-auto">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-[var(--text-secondary)]">Analysis Progress</span>
                    <span className="text-sm font-bold text-[var(--brand-primary)]">
                      {Math.round((analysisProgress.current / 12) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-[var(--surface-quaternary)] rounded-full h-3 overflow-hidden">
                    <motion.div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full shadow-lg"
                      initial={{ width: 0 }}
                      animate={{ width: `${(analysisProgress.current / 12) * 100}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                  <div className="mt-2 text-center">
                    <span className="text-xs text-[var(--text-tertiary)]">
                      {analysisProgress.current} of 12 analysis cards completed
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Enhanced Processing Indicators */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.8 }}
            >
              {[
                { icon: Activity, label: "Live Data Extraction", color: "text-blue-500", bgColor: "bg-blue-100" },
                { icon: Wifi, label: "Real-time API Calls", color: "text-green-500", bgColor: "bg-green-100" },
                { icon: Brain, label: "AI-Powered Analysis", color: "text-purple-500", bgColor: "bg-purple-100" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center space-y-3 p-4 rounded-xl bg-[var(--surface-quaternary)] border border-[var(--border-primary)] hover:shadow-lg transition-all"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    className={`p-3 rounded-xl ${item.bgColor}`}
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.3
                    }}
                  >
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </motion.div>
                  <span className="text-sm font-medium text-[var(--text-secondary)] text-center">
                    {item.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* Fun loading messages */}
            <motion.div
              className="mt-8 text-sm text-[var(--text-tertiary)] italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
            >
              ✨ Gathering insights from across the web... This may take a moment for the best results!
            </motion.div>
          </div>
        </Card>
      </div>
    );
  }

  // Show error state
  if (analysisError) {
    return (
      <div className="space-y-8">
        <TabHeader
          title="YouTube Channel Analysis"
          subtitle="Analysis Error"
          icon={<BarChart3 />}
          badge="Error"
          actions={
            <Button variant="ghost" onClick={() => setHasAnalyzed(false)}>
              <ArrowLeft className="w-4 h-4" />
              Try Again
            </Button>
          }
        />

        <Card>
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
              Analysis Failed
            </h3>
            <p className="text-[var(--text-secondary)] mb-6">
              {analysisError}
            </p>
            <Button variant="primary" onClick={() => {
              setAnalysisError(null);
              setHasAnalyzed(false);
            }}>
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // After analysis is complete, show results using the premium components
  return (
    <div className="space-y-8">
      <TabHeader
        title="YouTube Channel Analysis"
        subtitle={`Analysis results for ${channelUrl}`}
        icon={<BarChart3 />}
        badge={`Analysis Complete • ${dataTimestamp ? 'Live Data' : 'Complete'}`}
        actions={
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={() => setHasAnalyzed(false)}>
              <ArrowLeft className="w-4 h-4" />
              New Analysis
            </Button>
            <Button variant="secondary" size="sm" onClick={() => {
              if (parsedAnalysis) {
                const timestamp = new Date().toLocaleString();
                const channelName = channelUrl || 'YouTube Channel';
                const fullText = `# Complete YouTube Analysis Export
## Channel: ${channelName}
## Export Date: ${timestamp}
## Total Sections: ${parsedAnalysis.length}

${parsedAnalysis
  .map((s, index) => `## Section ${index + 1}: ${s.title}

### Analysis Content:
${s.content}

${s.ideas && s.ideas.length > 0 ? `### Actionable Insights (${s.ideas.length} items):
${s.ideas.map((idea, i) => `${i + 1}. ${idea}`).join('\n')}
` : ''}
---

`)
  .join('')}

Total Analysis Cards Exported: ${parsedAnalysis.length}
Export completed successfully.`;

                // Primary action: Download file
                const blob = new Blob([fullText], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `complete-youtube-analysis-${channelName.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}.txt`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                // Secondary action: Try to copy to clipboard (with error handling)
                setTimeout(() => {
                  handleCopyToClipboard(fullText);
                }, 100);
              }
            }}>
              <Download className="w-4 h-4" />
              Export Results
            </Button>
          </div>
        }
      />

      {/* Comprehensive Analysis Results */}
      {parsedAnalysis && parsedAnalysis.length > 0 && (
        <div className="space-y-8">
          {/* Analysis Header with Design System */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-gradient-to-r from-[var(--accent-emerald)] to-[var(--accent-emerald-light)] rounded-full animate-pulse shadow-lg"></div>
              <h2 className="heading-2 mb-0 bg-gradient-to-r from-[var(--text-primary)] to-[var(--brand-primary-light)] bg-clip-text text-transparent">
                Professional Analysis Complete
              </h2>
              <div className="flex items-center space-x-3">
                <Badge className="bg-[var(--color-success-bg)] text-[var(--color-success-text)] border-[var(--color-success-border)]">
                  {parsedAnalysis.length} Strategic Insights
                </Badge>
                {dataTimestamp && (
                  <div className="flex items-center space-x-2 text-sm text-[var(--text-secondary)]">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Live data updated {currentTime ? Math.round((currentTime - dataTimestamp.getTime()) / 60000) : 0} minutes ago</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  const timestamp = new Date().toLocaleString();
                  const channelName = channelUrl || 'YouTube Channel';
                  const fullText = `# YouTube Channel Analysis Report
## Channel: ${channelName}
## Generated: ${timestamp}
## Total Analysis Cards: ${parsedAnalysis.length}

${parsedAnalysis
  .map((s, index) => `## ${index + 1}. ${s.title}

${s.content}

${s.ideas && s.ideas.length > 0 ? `### Strategic Action Items:
${s.ideas.map((idea, i) => `${i + 1}. ${idea}`).join('\n')}

` : ''}---
`)
  .join('\n')}

## Analysis Summary
This comprehensive analysis contains ${parsedAnalysis.length} detailed sections covering all aspects of YouTube channel performance, growth opportunities, and strategic recommendations.

Generated by CreateGen Studio - AI-Powered YouTube Analytics`;

                  // Primary action: Download file
                  const blob = new Blob([fullText], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `youtube-analysis-${channelName.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}.txt`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);

                  // Secondary action: Try to copy to clipboard (with fallbacks)
                  setTimeout(() => {
                    handleCopyToClipboard(fullText);
                  }, 100);
                }}
                icon={copied ? <CheckCircle className="w-4 h-4" /> : <Download className="w-4 h-4" />}
              >
                {copied ? "Analysis Downloaded & Copied!" : "Export Full Analysis"}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleSummarizeAnalysis}
                disabled={isSummarizing}
                icon={isSummarizing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              >
                {isSummarizing ? "Generating..." : "Executive Summary"}
              </Button>
            </div>
          </div>

          {/* Executive Summary Section */}
          {analysisSummary && (
            <Card variant="glow" className="bg-gradient-to-r from-[var(--color-info-bg)] to-[var(--surface-tertiary)] border-[var(--color-info-border)] shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <h3 className="heading-4 mb-0 text-[var(--color-info-text)] flex items-center">
                    <Sparkles className="h-6 w-6 mr-3 text-[var(--accent-cyan-light)]" />
                    Executive Summary
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
                    icon={isSummaryExpanded ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    className="ml-4"
                  >
                    {isSummaryExpanded ? "Collapse" : "Expand"}
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const timestamp = new Date().toLocaleString();
                    const channelName = channelUrl || 'YouTube Channel';
                    const summaryText = `# Executive Summary - ${channelName}
## Generated: ${timestamp}

${analysisSummary}

Generated by CreateGen Studio - AI-Powered YouTube Analytics`;

                    // Create downloadable file for summary
                    const blob = new Blob([summaryText], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `youtube-summary-${channelName.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}.txt`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);

                    // Try to copy with fallback
                    setTimeout(() => {
                      handleCopyToClipboard(summaryText);
                    }, 100);
                  }}
                  icon={<Download className="w-4 h-4" />}
                >
                  Download Summary
                </Button>
              </div>

              <AnimatePresence>
                {isSummaryExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="body-lg text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
                      {analysisSummary}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {!isSummaryExpanded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-[var(--text-tertiary)] italic"
                >
                  Click "Expand" to view the executive summary...
                </motion.div>
              )}
            </Card>
          )}

          {/* Professional Analysis Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {parsedAnalysis.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="group relative card-base p-0 overflow-hidden cursor-pointer bg-gradient-to-br from-[var(--surface-secondary)] to-[var(--surface-tertiary)] border-[var(--border-primary)] hover:border-[var(--brand-primary)] shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
                onClick={() => setDetailedAnalysisSection(section)}
              >
                {/* Brand Accent Line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-light)] opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Card Content */}
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="heading-4 mb-0 bg-gradient-to-r from-[var(--text-primary)] to-[var(--brand-primary-light)] bg-clip-text text-transparent pr-4 leading-tight">
                      {section.title}
                    </h3>
                    <div className="w-3 h-3 bg-[var(--brand-primary)] rounded-full opacity-70 group-hover:opacity-100 transition-opacity flex-shrink-0 group-hover:shadow-lg group-hover:shadow-[var(--brand-primary)]/50"></div>
                  </div>

                  {/* Content Preview */}
                  <div className="body-base text-[var(--text-secondary)] leading-relaxed mb-6 line-clamp-3">
                    {section.content.length > 160
                      ? section.content.substring(0, 160) + "..."
                      : section.content
                    }
                  </div>

                  {/* Actionable Ideas Preview */}
                  {section.ideas && section.ideas.length > 0 && (
                    <div className="mb-6 p-3 bg-[var(--color-warning-bg)] rounded-lg border border-[var(--color-warning-border)]">
                      <div className="flex items-center space-x-2 mb-2">
                        <Lightbulb className="h-4 w-4 text-[var(--color-warning-text)]" />
                        <span className="text-xs font-medium text-[var(--color-warning-text)]">
                          {section.ideas.length} Strategic Actions
                        </span>
                      </div>
                      <div className="text-xs text-[var(--text-tertiary)] leading-relaxed">
                        {section.ideas[0]?.substring(0, 80)}...
                      </div>
                    </div>
                  )}

                  {/* View Details Button */}
                  <Button
                    variant="primary"
                    size="sm"
                    fullWidth
                    className="group-hover:scale-105 transition-transform duration-200"
                    icon={<ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                  >
                    View Full Analysis
                  </Button>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-primary)]/3 to-[var(--brand-secondary)]/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Professional Analysis Modal */}
      <AnimatePresence>
        {detailedAnalysisSection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[var(--surface-overlay)] backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setDetailedAnalysisSection(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[var(--surface-primary)] backdrop-blur-xl rounded-2xl border border-[var(--border-primary)] max-w-4xl w-full max-h-[85vh] overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-8 border-b border-[var(--border-primary)] bg-gradient-to-r from-[var(--surface-secondary)] to-[var(--surface-tertiary)]">
                <h2 className="heading-2 mb-0 bg-gradient-to-r from-[var(--text-primary)] to-[var(--brand-primary-light)] bg-clip-text text-transparent">
                  {detailedAnalysisSection.title}
                </h2>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      const timestamp = new Date().toLocaleString();
                      const fullText = `# ${detailedAnalysisSection.title}
## Generated: ${timestamp}

${detailedAnalysisSection.content}

${detailedAnalysisSection.ideas && detailedAnalysisSection.ideas.length > 0 ? `
## Strategic Action Items:
${detailedAnalysisSection.ideas.map((idea, i) => `${i + 1}. ${idea}`).join('\n')}
` : ''}

Generated by CreateGen Studio - YouTube Analysis`;

                      // Create downloadable file for this section
                      const blob = new Blob([fullText], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${detailedAnalysisSection.title.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}.txt`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);

                      // Try to copy with fallback
                      setTimeout(() => {
                        handleCopyToClipboard(fullText);
                      }, 100);
                    }}
                    icon={<Download className="w-4 h-4" />}
                  >
                    Download & Copy
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDetailedAnalysisSection(null)}
                    icon={<ArrowLeft className="w-4 h-4" />}
                  >
                    Close
                  </Button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-8 overflow-y-auto max-h-[65vh]">
                <div className="max-w-none">
                  <div className="body-lg text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap mb-8">
                    {detailedAnalysisSection.content}
                  </div>

                  {/* Strategic Action Items */}
                  {detailedAnalysisSection.ideas && detailedAnalysisSection.ideas.length > 0 && (
                    <div className="mt-8 pt-8 border-t border-[var(--border-primary)]">
                      <h4 className="heading-4 mb-0 text-[var(--brand-primary-light)] mb-6 flex items-center">
                        <Lightbulb className="h-6 w-6 mr-3 text-[var(--color-warning-text)]" />
                        Strategic Action Items ({detailedAnalysisSection.ideas.length})
                      </h4>
                      <div className="space-y-4">
                        {detailedAnalysisSection.ideas.map((idea, ideaIndex) => (
                          <div
                            key={ideaIndex}
                            className="flex items-start space-x-4 p-4 bg-[var(--surface-tertiary)] rounded-xl border border-[var(--border-primary)] hover:border-[var(--brand-primary)] transition-colors group"
                          >
                            <CheckCircle className="h-5 w-5 text-[var(--accent-emerald)] mt-1 flex-shrink-0 group-hover:text-[var(--accent-emerald-light)] transition-colors" />
                            <span className="body-base text-[var(--text-secondary)] flex-1 leading-relaxed">
                              {idea}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                // For individual ideas, just try clipboard with fallback
                                handleCopyToClipboard(idea);
                              }}
                              icon={<Download className="w-3 h-3" />}
                            >
                              Copy
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default YouTubeAnalysisWorldClass;
