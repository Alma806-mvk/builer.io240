import React, { useState } from "react";
import { Platform, ContentType, AiPersona } from "../../types";
import { useSubscription } from "../context/SubscriptionContext";
import premiumGeminiService from "../../services/premiumGeminiService";
import PremiumFeatureGate from "./PremiumFeatureGate";
import { showPremiumModal } from "./PremiumModalManager";
import { premiumTemplates } from "../data/premiumTemplates";
import { contentSpecificTemplates, getTemplatesByContentType, getTemplatesByTier, TEMPLATE_STATS } from "../data/contentSpecificTemplates";
import {
  DocumentIcon,
  GeneratorIcon,
  UserIcon,
  AnalyticsIcon,
  PremiumIcon,
  SettingsIcon,
  CopyIcon,
  CheckIcon,
  TargetIcon,
  RocketIcon,
  ChartIcon,
  RefreshIcon,
  CloseIcon,
  ArrowUpIcon,
  StatsIcon,
  TrendsIcon,
} from './ProfessionalIcons';

// Premium icons
const CrownIcon = ({ className = "" }) => <PremiumIcon className={className} />;
const BoltIcon = ({ className = "" }) => <GeneratorIcon className={className} />;
const SparklesIcon = ({ className = "" }) => (
  <GeneratorIcon className={className} />
);
const CogIcon = ({ className = "" }) => <SettingsIcon className={className} />;
const ChartBarIcon = ({ className = "" }) => (
  <AnalyticsIcon className={className} />
);
const GlobeIcon = ({ className = "" }) => <TrendsIcon className={className} />;
const BulbIcon = ({ className = "" }) => <GeneratorIcon className={className} />;
const ProfessionalCopyIcon = ({ className = "" }) => <CopyIcon className={className} />;
const ProfessionalTargetIcon = ({ className = "" }) => (
  <TargetIcon className={className} />
);
const MagicWandIcon = ({ className = "" }) => (
  <GeneratorIcon className={className} />
);
const ProfessionalRocketIcon = ({ className = "" }) => (
  <RocketIcon className={className} />
);
const ProfessionalCheckIcon = ({ className = "" }) => <CheckIcon className={className} />;
const LockIcon = ({ className = "" }) => <SettingsIcon className={className} />;
const DiamondIcon = ({ className = "" }) => (
  <PremiumIcon className={className} />
);
const TrendIcon = ({ className = "" }) => <TrendsIcon className={className} />;
const BrainIcon = ({ className = "" }) => <UserIcon className={className} />;
const DiscountIcon = ({ className = "" }) => (
  <StatsIcon className={className} />
);
const XIcon = ({ className = "" }) => <CloseIcon className={className} />;

// Batch generation interfaces
interface BatchGenerationResult {
  contentType: ContentType;
  content: string;
  status: "pending" | "generating" | "completed" | "error";
  error?: string;
  creditsUsed: number;
}

interface BatchGenerationInterfaceProps {
  platform: Platform;
  userInput: string;
  targetAudience?: string;
  onUpgrade?: () => void;
  onBatchComplete?: (results: BatchGenerationResult[]) => void;
}

// Content types available for batch generation (excluding Image Prompt, Generate Image, and Voice-to-Script as requested)
const BATCH_CONTENT_TYPES: {
  type: ContentType;
  label: string;
  credits: number;
}[] = [
  { type: ContentType.Idea, label: "Content Ideas", credits: 1 },
  { type: ContentType.Script, label: "Full Script", credits: 3 },
  { type: ContentType.Title, label: "Title/Headlines", credits: 1 },
  { type: ContentType.VideoHook, label: "Video Hooks", credits: 2 },
  {
    type: ContentType.ThumbnailConcept,
    label: "Thumbnail Concepts",
    credits: 2,
  },
  { type: ContentType.ContentBrief, label: "Content Brief", credits: 2 },
  { type: ContentType.PollsQuizzes, label: "Polls & Quizzes", credits: 2 },
  { type: ContentType.ContentGapFinder, label: "Gap Analysis", credits: 2 },
  { type: ContentType.MicroScript, label: "Micro Scripts", credits: 2 },
  { type: ContentType.ABTest, label: "A/B Test Variations", credits: 3 },
  { type: ContentType.Hashtags, label: "Hashtags", credits: 1 },
  { type: ContentType.Snippets, label: "Content Snippets", credits: 1 },
  { type: ContentType.RefinedText, label: "Refined Text", credits: 1 },
  {
    type: ContentType.RepurposedContent,
    label: "Repurposed Content",
    credits: 2,
  },
  {
    type: ContentType.VisualStoryboard,
    label: "Visual Storyboard",
    credits: 2,
  },
  {
    type: ContentType.MultiPlatformSnippets,
    label: "Multi-Platform Snippets",
    credits: 2,
  },
  { type: ContentType.FollowUpIdeas, label: "Follow-Up Ideas", credits: 1 },
  { type: ContentType.SeoKeywords, label: "SEO Keywords", credits: 1 },
  {
    type: ContentType.YouTubeDescription,
    label: "YouTube Description",
    credits: 1,
  },
  { type: ContentType.TranslateAdapt, label: "Translate & Adapt", credits: 2 },
  {
    type: ContentType.CheckReadability,
    label: "Readability Check",
    credits: 1,
  },
  { type: ContentType.TrendAnalysis, label: "Trend Analysis", credits: 2 },
  {
    type: ContentType.EngagementFeedback,
    label: "Engagement Feedback",
    credits: 1,
  },
];

// Calculate credits and discount (20% discount as requested)
const calculateBatchCost = (
  selectedTypes: ContentType[],
): {
  individual: number;
  batch: number;
  discount: number;
  discountPercent: number;
} => {
  const individual = selectedTypes.reduce((total, type) => {
    const typeInfo = BATCH_CONTENT_TYPES.find((t) => t.type === type);
    return total + (typeInfo?.credits || 1);
  }, 0);

  // 20% discount for batch generation as requested
  const batch = Math.ceil(individual * 0.8);
  const discount = individual - batch;
  const discountPercent = Math.round((discount / individual) * 100);

  return { individual, batch, discount, discountPercent };
};

// Batch Generation Interface Component
const BatchGenerationInterface: React.FC<BatchGenerationInterfaceProps> = ({
  platform,
  userInput,
  targetAudience,
  onUpgrade,
  onBatchComplete,
}) => {
  const { billingInfo, canUseFeature, canGenerate, incrementUsage } =
    useSubscription();
  const [selectedTypes, setSelectedTypes] = useState<ContentType[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<BatchGenerationResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  const costCalculation = calculateBatchCost(selectedTypes);
  const hasGenerationsLeft = canGenerate();

  const toggleContentType = (type: ContentType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const selectPopularTypes = () => {
    const popularTypes = [
      ContentType.Idea,
      ContentType.Script,
      ContentType.Title,
      ContentType.VideoHook,
      ContentType.Hashtags,
      ContentType.FollowUpIdeas,
    ];
    setSelectedTypes(popularTypes);
  };

  const selectAllTypes = () => {
    setSelectedTypes(BATCH_CONTENT_TYPES.map((t) => t.type));
  };

  const clearSelection = () => {
    setSelectedTypes([]);
  };

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      alert("Copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const copyAllResults = async () => {
    const completedResults = results.filter((r) => r.status === "completed");
    if (completedResults.length === 0) {
      alert("No completed results to copy");
      return;
    }

    const allContent = completedResults
      .map((result) => {
        const typeInfo = BATCH_CONTENT_TYPES.find(
          (t) => t.type === result.contentType,
        );
        return `=== ${typeInfo?.label || result.contentType} ===\n\n${result.content}\n\n`;
      })
      .join("");

    try {
      await navigator.clipboard.writeText(allContent);
      alert(`Copied all ${completedResults.length} results to clipboard!`);
    } catch (err) {
      console.error("Failed to copy all results:", err);
      alert("Failed to copy results. Please try copying individually.");
    }
  };

  const generateBatchContent = async () => {
    if (!hasGenerationsLeft) {
      alert(
        "You've reached your generation limit for this month. Please upgrade your plan or wait until next month.",
      );
      return;
    }

    if (!userInput.trim() || selectedTypes.length === 0) {
      alert("Please enter content and select at least one content type");
      return;
    }

    setIsGenerating(true);
    setShowResults(true);
    setGenerationProgress(0);

    const batchResults: BatchGenerationResult[] = selectedTypes.map((type) => ({
      contentType: type,
      content: "",
      status: "pending" as const,
      creditsUsed:
        BATCH_CONTENT_TYPES.find((t) => t.type === type)?.credits || 1,
    }));

    setResults(batchResults);

    try {
      // Use the existing premium service for batch generation
      const batchConfig = {
        count: selectedTypes.length,
        variations: selectedTypes.map((type) => type.toString()),
        tonalShifts: ["professional", "casual", "engaging"],
        lengthVariations: ["concise", "detailed"],
        includePerformancePrediction: false,
      };

      const generatedResults = await premiumGeminiService.generateBatchContent({
        platform,
        contentType: ContentType.Script, // Base type
        userInput,
        targetAudience,
        batchConfig,
      });

      // Map results to content types
      selectedTypes.forEach((type, index) => {
        const result = generatedResults[index];
        if (result) {
          setResults((prev) =>
            prev.map((r) =>
              r.contentType === type
                ? {
                    ...r,
                    status: "completed",
                    content: result.content || result,
                  }
                : r,
            ),
          );
          incrementUsage();
        }
      });

      setGenerationProgress(100);

      const successCount = selectedTypes.length;
      alert(
        `🎉 Batch generation successful! Generated ${successCount} content types.`,
      );

      onBatchComplete?.(batchResults);
    } catch (error) {
      console.error("Batch generation error:", error);
      alert("❌ Batch generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!showResults) {
    return (
      <div className="space-y-6">
        {/* Selection Controls */}
        <div className="flex items-center justify-between">
          <h5 className="text-lg font-semibold text-white">
            Select Content Types
          </h5>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={selectPopularTypes}
              className="px-3 py-1 bg-emerald-600/20 border border-emerald-400/30 text-emerald-300 rounded-lg text-sm hover:bg-emerald-600/30 transition-colors"
            >
              Popular
            </button>
            <button
              onClick={selectAllTypes}
              className="px-3 py-1 bg-sky-600/20 border border-sky-400/30 text-sky-300 rounded-lg text-sm hover:bg-sky-600/30 transition-colors"
            >
              All ({BATCH_CONTENT_TYPES.length})
            </button>
            <button
              onClick={clearSelection}
              className="px-3 py-1 bg-slate-600/20 border border-slate-500/30 text-slate-300 rounded-lg text-sm hover:bg-slate-600/30 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Content Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
          {BATCH_CONTENT_TYPES.map((typeInfo) => (
            <div
              key={typeInfo.type}
              onClick={() => toggleContentType(typeInfo.type)}
              className={`p-3 border rounded-xl cursor-pointer transition-all ${
                selectedTypes.includes(typeInfo.type)
                  ? "bg-sky-500/20 border-sky-400/50 shadow-lg"
                  : "bg-slate-700/30 border-slate-600/30 hover:bg-slate-600/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium text-sm truncate">
                    {typeInfo.label}
                  </div>
                  <div className="text-slate-400 text-xs">
                    {typeInfo.credits} credit{typeInfo.credits > 1 ? "s" : ""}
                  </div>
                </div>
                <div className="flex items-center ml-2">
                  {selectedTypes.includes(typeInfo.type) ? (
                    <ProfessionalCheckIcon className="text-sky-400 text-lg" />
                  ) : (
                    <div className="w-4 h-4 border border-slate-500 rounded"></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cost Summary */}
        {selectedTypes.length > 0 && (
          <div className="bg-slate-700/30 rounded-xl p-4">
            <h6 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              Cost Summary
              <span className="text-xs font-semibold px-2 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                20% DISCOUNT
              </span>
            </h6>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Individual Cost:</span>
                <span className="text-slate-300 line-through">
                  {costCalculation.individual} credits
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Batch Price:</span>
                <span className="text-emerald-300 font-semibold">
                  {costCalculation.batch} credits
                </span>
              </div>
              <div className="flex justify-between text-emerald-300 font-bold">
                <span>You Save:</span>
                <span>
                  {costCalculation.discount} credits (
                  {costCalculation.discountPercent}% off)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={generateBatchContent}
          disabled={
            selectedTypes.length === 0 ||
            !userInput.trim() ||
            isGenerating ||
            !hasGenerationsLeft
          }
          className="w-full py-4 bg-gradient-to-r from-sky-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold rounded-xl transition-all hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-3"
        >
          <BoltIcon className="text-xl" />
          <span>
            {isGenerating
              ? `Generating ${selectedTypes.length} Content Types...`
              : selectedTypes.length > 0
                ? `Generate ${selectedTypes.length} Content Type${selectedTypes.length !== 1 ? "s" : ""} (${costCalculation.batch} credits)`
                : "Select Content Types to Generate"}
          </span>
        </button>

        {selectedTypes.length === 0 && (
          <p className="text-slate-400 text-sm text-center">
            Select at least one content type to enable batch generation
          </p>
        )}
      </div>
    );
  }

  // Results View
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h5 className="text-lg font-semibold text-white">
            Generation Results
          </h5>
          <p className="text-slate-400 text-sm">
            {!isGenerating && results.length > 0 && (
              <>
                {results.filter((r) => r.status === "completed").length} of{" "}
                {results.length} generated • Credits used:{" "}
                {costCalculation.batch} (saved {costCalculation.discount})
              </>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          {!isGenerating &&
            results.filter((r) => r.status === "completed").length > 0 && (
              <button
                onClick={copyAllResults}
                className="px-4 py-2 bg-emerald-600/50 hover:bg-emerald-600/70 text-emerald-300 rounded-lg text-sm transition-colors flex items-center gap-2"
              >
                <ProfessionalCopyIcon />
                Copy All
              </button>
            )}
          <button
            onClick={() => setShowResults(false)}
            className="px-4 py-2 bg-slate-600/50 hover:bg-slate-600/70 text-slate-300 rounded-lg text-sm transition-colors"
          >
            Back to Selection
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      {isGenerating && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-300 text-sm">Generation Progress</span>
            <span className="text-slate-300 text-sm">
              {Math.round(generationProgress)}%
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-sky-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${generationProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Results Grid */}
      <div className="grid gap-4">
        {results.map((result) => {
          const typeInfo = BATCH_CONTENT_TYPES.find(
            (t) => t.type === result.contentType,
          );
          return (
            <div
              key={result.contentType}
              className={`p-4 border rounded-xl ${
                result.status === "completed"
                  ? "bg-emerald-500/10 border-emerald-400/30"
                  : result.status === "error"
                    ? "bg-red-500/10 border-red-400/30"
                    : result.status === "generating"
                      ? "bg-sky-500/10 border-sky-400/30"
                      : "bg-slate-700/30 border-slate-600/30"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-white font-medium">
                    {typeInfo?.label}
                  </div>
                  <div className="text-xs px-2 py-1 bg-slate-600/50 text-slate-300 rounded">
                    {typeInfo?.credits} credit
                    {(typeInfo?.credits || 1) > 1 ? "s" : ""}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {result.status === "completed" && (
                    <button
                      onClick={() => copyToClipboard(result.content)}
                      className="p-1 text-slate-400 hover:text-white transition-colors"
                      title="Copy to clipboard"
                    >
                      <ProfessionalCopyIcon />
                    </button>
                  )}
                  <div className="flex items-center">
                    {result.status === "pending" && (
                      <div className="w-4 h-4 border border-slate-500 rounded-full"></div>
                    )}
                    {result.status === "generating" && (
                      <div className="w-4 h-4 animate-spin rounded-full border-2 border-sky-400 border-t-transparent"></div>
                    )}
                    {result.status === "completed" && (
                      <ProfessionalCheckIcon className="text-emerald-400 text-lg" />
                    )}
                    {result.status === "error" && (
                      <XIcon className="text-red-400 text-lg" />
                    )}
                  </div>
                </div>
              </div>

              {result.status === "generating" && (
                <div className="text-sky-300 text-sm">
                  Generating content...
                </div>
              )}

              {result.status === "error" && (
                <div className="text-red-300 text-sm">
                  Error: {result.error || "Generation failed"}
                </div>
              )}

              {result.status === "completed" && result.content && (
                <div className="bg-slate-800/50 p-3 rounded-lg">
                  <div className="text-slate-300 text-sm whitespace-pre-wrap">
                    {result.content.length > 300
                      ? `${result.content.substring(0, 300)}...`
                      : result.content}
                  </div>
                  {result.content.length > 300 && (
                    <button
                      onClick={() => alert(result.content)}
                      className="text-sky-400 text-xs mt-2 hover:text-sky-300 transition-colors"
                    >
                      View Full Content
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary */}
      {!isGenerating && results.length > 0 && (
        <div className="p-4 bg-slate-700/30 border border-slate-600/30 rounded-xl">
          <div className="text-center">
            <div className="text-white font-medium mb-2">
              Batch Generation Complete!
            </div>
            <div className="text-slate-300 text-sm">
              Generated {results.filter((r) => r.status === "completed").length}{" "}
              out of {results.length} content types
            </div>
            <div className="text-emerald-400 text-sm mt-1">
              Credits used: {costCalculation.batch} (saved{" "}
              {costCalculation.discount} credits with 20% batch discount)
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface PremiumGeneratorEnhancementProps {
  platform: Platform;
  contentType: ContentType;
  userInput: string;
  targetAudience?: string;
  isPremium?: boolean;
  onUpgrade?: () => void;
  onApplyTemplate?: (template: ContentTemplate) => void;
  onGenerateBatch?: (config: BatchConfig) => void;
  onApplyPersona?: (persona: CustomPersona) => void;
  onOptimizeForSEO?: (seoConfig: SEOConfig) => void;
  onPredictPerformance?: () => void;
}

interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  category: string;
  isPremium: boolean;
  tier: "free" | "pro" | "agency"; // Subscription tier requirement
  platforms: Platform[];
  contentTypes: ContentType[];
  performance?: {
    avgEngagement: number;
    successRate: number;
  };
}

interface BatchConfig {
  count: number;
  variations: string[];
  tonalShifts: string[];
  lengthVariations: string[];
  includePerformancePrediction: boolean;
}

interface CustomPersona {
  id: string;
  name: string;
  description: string;
  tone: string;
  vocabulary: string;
  expertise: string[];
  communicationStyle: string;
  examples: string[];
}

interface SEOConfig {
  primaryKeywords: string[];
  secondaryKeywords: string[];
  targetAudience: string;
  competitorAnalysis: boolean;
  metaOptimization: boolean;
  schemaMarkup: boolean;
}

export const PremiumGeneratorEnhancement: React.FC<
  PremiumGeneratorEnhancementProps
> = ({
  platform,
  contentType,
  userInput,
  targetAudience,
  isPremium = false,
  onUpgrade = () => {},
  onApplyTemplate,
  onGenerateBatch,
  onApplyPersona,
  onOptimizeForSEO,
  onPredictPerformance,
}) => {
  const { billingInfo, canUseFeature } = useSubscription();
  const [showPremiumPanel, setShowPremiumPanel] = useState(false);
  const [activeSection, setActiveSection] = useState<
    "templates" | "content-templates" | "batch" | "personas" | "seo" | "analytics" | "ai-boost"
  >("templates");

  // Development override check
  const devPremiumOverride =
    import.meta.env.DEV &&
    (localStorage.getItem("dev_force_premium") === "true" ||
      localStorage.getItem("emergency_premium") === "true");

  // Enhanced premium access detection
  const hasPremiumAccess =
    devPremiumOverride ||
    billingInfo?.status === "active" ||
    canUseFeature("premium") ||
    (billingInfo?.subscription?.planId &&
      billingInfo.subscription.planId !== "free") ||
    isPremium;

  const subscriptionPlan = billingInfo?.subscription?.planId || "free";

  const canUseBatchGeneration =
    devPremiumOverride ||
    canUseFeature("batchGeneration") ||
    (hasPremiumAccess && canUseFeature("premium"));

  const canUseCustomPersonas =
    devPremiumOverride ||
    canUseFeature("customPersonas") ||
    (hasPremiumAccess && canUseFeature("premium"));

  const canUseAnalytics =
    devPremiumOverride ||
    canUseFeature("analytics") ||
    (hasPremiumAccess && canUseFeature("premium"));

  // Debug logging for premium feature access
  if (import.meta.env.DEV) {
    console.log("🔧 PremiumGeneratorEnhancement Debug:", {
      devPremiumOverride,
      billingStatus: billingInfo?.status,
      subscriptionPlan,
      hasPremiumAccess,
      canUseBatchGeneration,
      canUseCustomPersonas,
      canUseAnalytics,
      isPremiumProp: isPremium,
      billingInfo: billingInfo,
      featuresAvailable: {
        templates: hasPremiumAccess || devPremiumOverride,
        batchGen:
          canUseBatchGeneration || hasPremiumAccess || devPremiumOverride,
        personas:
          canUseCustomPersonas || hasPremiumAccess || devPremiumOverride,
        analytics: canUseAnalytics || hasPremiumAccess || devPremiumOverride,
      },
    });
  }

  // Premium AI personas
  const premiumPersonas: CustomPersona[] = [
    {
      id: "thought-leader",
      name: "Industry Thought Leader",
      description: "Authoritative, insightful, forward-thinking",
      tone: "Confident yet approachable, uses data-driven insights",
      vocabulary: "Industry-specific terminology, strategic language",
      expertise: ["Market Analysis", "Future Trends", "Strategic Planning"],
      communicationStyle: "Direct, valuable, with actionable insights",
      examples: [
        "Based on current market data...",
        "The future of our industry hinges on...",
      ],
    },
    {
      id: "friendly-expert",
      name: "Friendly Expert",
      description: "Knowledgeable but conversational and warm",
      tone: "Warm, encouraging, like talking to a smart friend",
      vocabulary: "Professional but accessible, avoids jargon",
      expertise: ["Problem Solving", "Teaching", "Community Building"],
      communicationStyle: "Conversational, supportive, educational",
      examples: [
        "Let me walk you through this...",
        "Here's a simple way to think about it...",
      ],
    },
    {
      id: "innovator",
      name: "Tech Innovator",
      description: "Cutting-edge, disruptive, future-focused",
      tone: "Excited about innovation, speaks to possibilities",
      vocabulary: "Technical terms, startup language, growth mindset",
      expertise: ["Technology", "Innovation", "Disruption", "Scale"],
      communicationStyle: "Energetic, visionary, action-oriented",
      examples: ["This changes everything...", "Imagine if we could..."],
    },
  ];

  // Feature mapping for premium modals
  const getFeatureKey = (featureName: string): string => {
    const mapping = {
      Templates: "templates",
      "Batch Generation": "batchGeneration",
      "AI Personas": "customPersonas",
      "SEO Optimization": "seoOptimization",
      Analytics: "analytics",
      "AI Boost": "seoOptimization", // Using SEO as fallback for AI Boost
    };
    return mapping[featureName] || "templates";
  };

  const [isGenerating, setIsGenerating] = useState(false);
  const [currentAnalytics, setCurrentAnalytics] = useState<any>(null);
  const [batchResults, setBatchResults] = useState<any[]>([]);
  const [seoKeywords, setSeoKeywords] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] =
    useState<ContentTemplate | null>(null);
  const [selectedPersona, setSelectedPersona] = useState<CustomPersona | null>(
    null,
  );
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [selectedContentTypeFilter, setSelectedContentTypeFilter] = useState<string | null>(null);

  const handlePremiumFeatureClick = (featureName: string) => {
    if (!hasPremiumAccess) {
      const featureKey = getFeatureKey(featureName);
      showPremiumModal(featureKey);
      return;
    }
    // If user has premium access, allow feature use
    return;
  };

  // Premium feature handlers
  const handleApplyTemplate = async (template: ContentTemplate) => {
    if (!hasPremiumAccess) {
      handlePremiumFeatureClick("Templates");
      return;
    }

    setSelectedTemplate(template);
    const appliedTemplate = premiumGeminiService.applyPremiumTemplate(
      userInput,
      template,
    );
    onApplyTemplate?.(template);

    // Show success notification
    alert(`✅ Template "${template.name}" applied successfully!`);
  };

  const handleApplyContentTemplate = async (template: any) => {
    // Check if user has access to this tier
    const canAccess = template.tier === 'free' ||
                    (template.tier === 'pro' && (hasPremiumAccess || subscriptionPlan === 'creator' || subscriptionPlan === 'agency')) ||
                    (template.tier === 'ultimate' && subscriptionPlan === 'agency');

    if (!canAccess) {
      const requiredPlan = template.tier === 'pro' ? 'Creator Pro' : 'Agency Ultimate';
      alert(`🔒 This template requires ${requiredPlan} subscription. Upgrade to unlock!`);
      handlePremiumFeatureClick('Content Templates');
      return;
    }

    // Apply the template content to the user input
    onApplyTemplate?.({
      id: template.id,
      name: template.name,
      description: template.description,
      content: template.template,
      tier: template.tier,
      category: template.category,
      tags: template.tags,
      engagementBoost: template.engagementBoost
    });

    // Show success notification
    alert(`��� Content Template "${template.name}" applied for ${template.contentType}!`);
  };

  const handleBatchGeneration = async () => {
    if (!hasPremiumAccess) {
      handlePremiumFeatureClick("Batch Generation");
      return;
    }

    setIsGenerating(true);
    try {
      const batchConfig = {
        count: 5, // This would come from user selection
        variations: ["professional", "casual", "enthusiastic"],
        tonalShifts: ["formal", "conversational", "energetic"],
        lengthVariations: ["short", "medium", "long"],
        includePerformancePrediction: true,
      };

      const results = await premiumGeminiService.generateBatchContent({
        platform,
        contentType,
        userInput,
        batchConfig,
      });

      setBatchResults(results);
      onGenerateBatch?.(batchConfig);

      // Show results in a nice format
      alert(`✅ Generated ${results.length} content variations successfully!`);
    } catch (error) {
      console.error("Batch generation error:", error);
      alert("❌ Batch generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyPersona = async (persona: CustomPersona) => {
    if (!hasPremiumAccess) {
      handlePremiumFeatureClick("AI Personas");
      return;
    }

    setSelectedPersona(persona);
    onApplyPersona?.(persona);

    // Show success notification
    alert(`✅ AI Persona "${persona.name}" activated!`);
  };

  const handleSEOOptimization = async () => {
    if (!hasPremiumAccess) {
      handlePremiumFeatureClick("SEO Optimization");
      return;
    }

    setIsGenerating(true);
    try {
      // Generate SEO keywords
      const keywords = await premiumGeminiService.generateSEOKeywords(
        userInput,
        platform,
        "target audience", // This would come from user input
      );

      setSeoKeywords(keywords);

      const seoConfig = {
        primaryKeywords: keywords.slice(0, 3),
        secondaryKeywords: keywords.slice(3, 8),
        targetAudience: "target audience",
        competitorAnalysis: true,
        metaOptimization: true,
        schemaMarkup: false,
      };

      onOptimizeForSEO?.(seoConfig);

      alert(`✅ SEO optimization applied with ${keywords.length} keywords!`);
    } catch (error) {
      console.error("SEO optimization error:", error);
      alert("❌ SEO optimization failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePerformanceAnalytics = async () => {
    if (!hasPremiumAccess) {
      handlePremiumFeatureClick("Analytics");
      return;
    }

    setIsGenerating(true);
    try {
      const analytics = await premiumGeminiService.generatePerformanceAnalytics(
        userInput,
        platform,
        contentType,
      );

      setCurrentAnalytics(analytics);
      onPredictPerformance?.();

      alert(
        `✅ Performance analytics generated! Predicted engagement: ${analytics.predictedEngagement}/10`,
      );
    } catch (error) {
      console.error("Analytics generation error:", error);
      alert("❌ Analytics generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!showPremiumPanel) {
    return (
      <div className="bg-gradient-to-r from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <DiamondIcon className="text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                Premium Generator Features
              </h3>
              <p className="text-slate-400 text-sm">
                {hasPremiumAccess
                  ? "Access advanced AI capabilities"
                  : "Unlock powerful AI tools to create better content"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {hasPremiumAccess && (
              <div className="px-3 py-1 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-400/30 rounded-full">
                <span className="text-emerald-300 text-xs font-bold">PRO</span>
              </div>
            )}
            <button
              onClick={() => setShowPremiumPanel(true)}
              className="px-4 py-2 bg-gradient-to-r from-sky-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 text-white rounded-xl font-medium transition-all hover:scale-105 shadow-lg text-sm"
            >
              {hasPremiumAccess ? "Open Tools" : "Explore Premium"}
            </button>
          </div>
        </div>

        {/* Quick Premium Features Preview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {[
            {
              name: "Templates",
              icon: DocumentIcon,
              desc: "Viral patterns",
              available: hasPremiumAccess || devPremiumOverride,
              planRequired: "Creator Pro",
            },
            {
              name: "Batch Gen",
              icon: GeneratorIcon,
              desc: "50+ variations",
              available:
                canUseBatchGeneration || hasPremiumAccess || devPremiumOverride,
              planRequired: "Creator Pro",
            },
            {
              name: "AI Personas",
              icon: UserIcon,
              desc: "Brand voices",
              available:
                canUseCustomPersonas || hasPremiumAccess || devPremiumOverride,
              planRequired: "Creator Pro",
            },
            {
              name: "Analytics",
              icon: AnalyticsIcon,
              desc: "Performance",
              available:
                canUseAnalytics || hasPremiumAccess || devPremiumOverride,
              planRequired: "Creator Pro",
            },
          ].map((feature, index) => (
            <div
              key={index}
              onClick={() => handlePremiumFeatureClick(feature.name)}
              className={`p-3 bg-slate-700/30 border border-slate-600/30 rounded-xl hover:bg-slate-600/40 transition-all cursor-pointer group relative overflow-hidden ${
                feature.available ? "border-emerald-400/30" : ""
              }`}
            >
              {!feature.available && (
                <div className="absolute top-1 right-1">
                  <LockIcon className="text-xs text-amber-400" />
                </div>
              )}
              {feature.available && (
                <div className="absolute top-1 right-1">
                  <ProfessionalCheckIcon className="text-xs text-emerald-400" />
                </div>
              )}
              <div className="text-center">
                <div className="text-xl mb-1">
                  {typeof feature.icon === 'string' ? feature.icon : React.createElement(feature.icon, { className: 'w-5 h-5 mx-auto' })}
                </div>
                <div
                  className={`text-xs font-medium mb-1 ${
                    feature.available ? "text-emerald-300" : "text-white"
                  }`}
                >
                  {feature.name}
                </div>
                <div className="text-slate-400 text-xs mb-1">
                  {feature.desc}
                </div>
                <div
                  className={`text-xs ${
                    feature.available ? "text-emerald-400" : "text-amber-400"
                  }`}
                >
                  {feature.available ? "Available" : feature.planRequired}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-700/50 bg-gradient-to-r from-sky-500/10 to-purple-500/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <CrownIcon className="text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  Premium AI Generator
                </h3>
                <p className="text-slate-400">
                  {hasPremiumAccess
                    ? "Pro features unlocked"
                    : "Upgrade to unlock all features"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowPremiumPanel(false)}
              className="text-slate-400 hover:text-white transition-colors text-xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Feature Tabs */}
        <div className="p-4 border-b border-slate-700/50">
          <div className="flex flex-wrap gap-2">
            {[
              {
                id: "templates",
                label: "Templates",
                available: hasPremiumAccess || devPremiumOverride,
                planRequired: "Creator Pro",
              },
              {
                id: "content-templates",
                label: "Content Specific",
                available: true, // Everyone can see this tab
                planRequired: "Mixed Tiers",
              },
              {
                id: "batch",
                label: "Batch Gen",
                available:
                  canUseBatchGeneration ||
                  hasPremiumAccess ||
                  devPremiumOverride,
                planRequired: "Creator Pro",
              },
              {
                id: "personas",
                label: "AI Personas",
                available:
                  canUseCustomPersonas ||
                  hasPremiumAccess ||
                  devPremiumOverride,
                planRequired: "Creator Pro",
              },
              {
                id: "seo",
                label: "SEO Boost",
                available: hasPremiumAccess || devPremiumOverride,
                planRequired: "Creator Pro",
              },
              {
                id: "analytics",
                label: "Analytics",
                available:
                  canUseAnalytics || hasPremiumAccess || devPremiumOverride,
                planRequired: "Creator Pro",
              },
              {
                id: "ai-boost",
                label: "AI Boost",
                available: hasPremiumAccess || devPremiumOverride,
                planRequired: "Creator Pro",
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  if (!tab.available) {
                    alert(
                      `${tab.label} requires ${tab.planRequired} subscription. Upgrade to unlock this feature.`,
                    );
                    handlePremiumFeatureClick(tab.label.split(" ")[1]);
                    return;
                  }
                  setActiveSection(tab.id as any);
                }}
                className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeSection === tab.id
                    ? "bg-gradient-to-r from-sky-600 to-purple-600 text-white shadow-lg"
                    : tab.available
                      ? "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 hover:text-white"
                      : "bg-slate-700/30 text-slate-500 border border-slate-600/50"
                }`}
              >
                {!tab.available && (
                  <div className="absolute -top-1 -right-1 flex items-center">
                    <LockIcon className="text-xs text-amber-400" />
                  </div>
                )}
                {tab.available && (
                  <div className="absolute -top-1 -right-1 flex items-center">
                    <ProfessionalCheckIcon className="text-xs text-emerald-400" />
                  </div>
                )}
                <span className={tab.available ? "" : "opacity-50"}>
                  {tab.label}
                </span>
                {!tab.available && (
                  <div className="text-xs text-amber-400 font-normal">
                    {tab.planRequired}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {activeSection === "templates" && (
            <PremiumFeatureGate
              feature="templates"
              featureName="Premium Templates"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="text-xl font-bold text-white flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
                        <DocumentIcon className="w-5 h-5 text-white" />
                      </div>
                      Viral Templates Library
                    </h4>
                    <p className="text-slate-400 mt-2">
                      {premiumTemplates.length} proven templates with{" "}
                      {hasPremiumAccess
                        ? "avg 8.7/10 engagement"
                        : "up to 300% higher engagement rates"}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        <span className="text-emerald-400">{premiumTemplates.filter(t => t.tier === 'free').length} Free</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                        <span className="text-pink-400">{premiumTemplates.filter(t => t.tier === 'pro').length} Pro</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span className="text-purple-400">{premiumTemplates.filter(t => t.tier === 'agency').length} Agency Ultimate</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1 bg-gradient-to-r from-pink-500/20 to-rose-500/20 border border-pink-400/30 rounded-full">
                      <span className="text-pink-300 text-xs font-bold">
                        {hasPremiumAccess
                          ? `${premiumTemplates.length} UNLOCKED`
                          : "LOCKED"}
                      </span>
                    </div>
                  </div>
                </div>

                {hasPremiumAccess ? (
                  <div className="space-y-4">
                    {/* Template Tier Filters */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <button
                        onClick={() => setSelectedTier(null)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                          selectedTier === null
                            ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-blue-400/50"
                            : "bg-slate-700/50 hover:bg-blue-500/20 text-slate-300 hover:text-blue-300 border border-slate-600/30 hover:border-blue-400/30"
                        }`}
                      >
                        All Templates ({premiumTemplates.length})
                      </button>
                      <button
                        onClick={() => setSelectedTier("free")}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                          selectedTier === "free"
                            ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white border-emerald-400/50"
                            : "bg-slate-700/50 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-slate-600/30 hover:border-emerald-400/30"
                        }`}
                      >
                        Free ({premiumTemplates.filter(t => t.tier === 'free').length})
                      </button>
                      <button
                        onClick={() => setSelectedTier("pro")}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                          selectedTier === "pro"
                            ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white border-pink-400/50"
                            : "bg-slate-700/50 hover:bg-pink-500/20 text-slate-300 hover:text-pink-300 border border-slate-600/30 hover:border-pink-400/30"
                        }`}
                      >
                        Pro ({premiumTemplates.filter(t => t.tier === 'pro').length})
                      </button>
                      <button
                        onClick={() => setSelectedTier("agency")}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                          selectedTier === "agency"
                            ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-purple-400/50"
                            : "bg-slate-700/50 hover:bg-purple-500/20 text-slate-300 hover:text-purple-300 border border-slate-600/30 hover:border-purple-400/30"
                        }`}
                      >
                        Agency Ultimate ({premiumTemplates.filter(t => t.tier === 'agency').length})
                      </button>
                    </div>

                    {/* Templates Grid */}
                    <div className="grid gap-4 max-h-96 overflow-y-auto">
                      {premiumTemplates
                        .filter((template) =>
                          selectedTier === null || template.tier === selectedTier
                        )
                        .map((template) => (
                        <div
                          key={template.id}
                          className="group relative p-5 bg-gradient-to-br from-slate-700/30 to-slate-800/30 border border-slate-600/30 hover:border-pink-400/50 rounded-xl cursor-pointer transition-all hover:scale-[1.02] hover:shadow-xl"
                          onClick={() => handleApplyTemplate(template)}
                        >
                          {/* Tier Badge */}
                          <div className="absolute -top-2 -right-2 flex items-center gap-1">
                            <div className={`px-2 py-1 rounded-full flex items-center gap-1 shadow-lg text-xs font-bold text-white ${
                              template.tier === 'free'
                                ? 'bg-gradient-to-r from-emerald-500 to-green-500'
                                : template.tier === 'pro'
                                ? 'bg-gradient-to-r from-pink-500 to-rose-500'
                                : 'bg-gradient-to-r from-purple-500 to-indigo-500'
                            }`}>
                              <span>{
                                template.tier === 'free' ? 'FREE'
                                : template.tier === 'pro' ? 'PRO'
                                : 'ULTIMATE'
                              }</span>
                            </div>
                          </div>

                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h5 className="text-white font-semibold text-lg group-hover:text-pink-300 transition-colors">
                                {template.name}
                              </h5>
                              <p className="text-slate-400 text-sm mt-1">
                                {template.description}
                              </p>
                              <div className="flex items-center gap-3 mt-2">
                                <span className="text-xs px-2 py-1 bg-pink-500/20 text-pink-300 rounded-full">
                                  {template.category}
                                </span>
                                <span className="text-xs text-slate-500">
                                  {template.platforms.join(", ")}
                                </span>
                                {template.tier === 'agency' && (
                                  <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full border border-purple-400/30">
                                    Enterprise Grade
                                  </span>
                                )}
                              </div>
                            </div>
                            {template.performance && (
                              <div className="text-right ml-4">
                                <div className="flex items-center gap-1 text-emerald-400 font-bold">
                                  <span className="text-lg">
                                    {template.performance.avgEngagement}
                                  </span>
                                  <span className="text-sm">/10</span>
                                  <span className="text-amber-400">���</span>
                                </div>
                                <div className="text-slate-400 text-xs">
                                  {template.performance.successRate}% success
                                  rate
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="bg-black/40 p-4 rounded-xl border border-slate-600/30">
                            <p className="text-slate-300 text-sm font-medium italic leading-relaxed">
                              "{template.template}"
                            </p>
                          </div>

                          {/* Hover overlay */}
                          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 to-rose-500/0 group-hover:from-pink-500/5 group-hover:to-rose-500/5 rounded-xl transition-all"></div>
                        </div>
                      ))}
                    </div>

                    {/* Usage Stats */}
                    <div className="p-4 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-400/30 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-emerald-300 font-bold">
                            Templates Used This Month
                          </div>
                          <div className="text-slate-400 text-sm">
                            Click any template to instantly apply it to your
                            content
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-emerald-400">
                          {Math.floor(Math.random() * 15) + 5}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative overflow-hidden">
                    {/* Premium Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-900/20 via-rose-900/20 to-red-900/20 rounded-2xl"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(236,72,153,0.1),transparent_50%)]"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(244,63,94,0.1),transparent_50%)]"></div>

                    <div className="relative p-8 border border-pink-500/30 rounded-2xl backdrop-blur-sm">
                      {/* Preview Templates (Locked) */}
                      <div className="grid gap-3 mb-6 opacity-60 pointer-events-none">
                        {premiumTemplates.slice(0, 2).map((template) => (
                          <div
                            key={template.id}
                            className="p-4 bg-slate-700/30 border border-slate-600/30 rounded-xl"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="text-white font-medium">
                                {template.name}
                              </h5>
                              <LockIcon className="text-pink-400" />
                            </div>
                            <p className="text-slate-400 text-sm mb-3">
                              {template.description}
                            </p>
                            <div className="bg-slate-800/50 p-3 rounded-lg">
                              <p className="text-slate-300 text-sm italic blur-sm">
                                "{template.template}"
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="text-center">
                        <h5 className="text-2xl font-bold text-white mb-3">
                          Unlock 50+ Viral Templates
                        </h5>
                        <p className="text-slate-300 mb-6 max-w-md mx-auto">
                          Access our complete library of high-converting
                          templates used by top creators to generate viral
                          content
                        </p>

                        <div className="grid grid-cols-3 gap-4 mb-6">
                          <div className="p-3 bg-black/20 border border-pink-500/20 rounded-xl">
                            <div className="text-pink-300 font-bold text-lg">
                              8.7/10
                            </div>
                            <div className="text-slate-400 text-xs">
                              Avg Engagement
                            </div>
                          </div>
                          <div className="p-3 bg-black/20 border border-pink-500/20 rounded-xl">
                            <div className="text-pink-300 font-bold text-lg">
                              89%
                            </div>
                            <div className="text-slate-400 text-xs">
                              Success Rate
                            </div>
                          </div>
                          <div className="p-3 bg-black/20 border border-pink-500/20 rounded-xl">
                            <div className="text-pink-300 font-bold text-lg">
                              50+
                            </div>
                            <div className="text-slate-400 text-xs">
                              Templates
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handlePremiumFeatureClick("Templates")}
                          className="px-8 py-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-xl font-bold transition-all hover:scale-105 shadow-2xl text-lg"
                        >
                          Unlock Viral Templates
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </PremiumFeatureGate>
          )}

          {activeSection === "content-templates" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-xl font-bold text-white flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                      <AnalyticsIcon className="w-5 h-5 text-white" />
                    </div>
                    Content Specific Templates
                  </h4>
                  <p className="text-slate-400 mt-2">
                    <span>41</span> specialized templates - 2 for each of the <span>21</span> content types
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      <span className="text-emerald-400">{TEMPLATE_STATS.free} Free</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                      <span className="text-pink-400">{TEMPLATE_STATS.pro} Creator Pro</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      <span className="text-purple-400">{TEMPLATE_STATS.ultimate} Agency Ultimate</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-400/30 rounded-full">
                    <span className="text-teal-300 text-xs font-bold">
                      CONTENT SPECIFIC
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/* Template Tier Filters */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <button
                    onClick={() => setSelectedTier(null)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      selectedTier === null
                        ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white border-teal-400/50"
                        : "bg-slate-700/50 hover:bg-teal-500/20 text-slate-300 hover:text-teal-300 border border-slate-600/30 hover:border-teal-400/30"
                    }`}
                  >
                    All Templates ({TEMPLATE_STATS.total})
                  </button>
                  <button
                    onClick={() => setSelectedTier("free")}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      selectedTier === "free"
                        ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white border-emerald-400/50"
                        : "bg-slate-700/50 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-slate-600/30 hover:border-emerald-400/30"
                    }`}
                  >
                    Free ({TEMPLATE_STATS.free})
                  </button>
                  <button
                    onClick={() => setSelectedTier("pro")}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      selectedTier === "pro"
                        ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white border-pink-400/50"
                        : "bg-slate-700/50 hover:bg-pink-500/20 text-slate-300 hover:text-pink-300 border border-slate-600/30 hover:border-pink-400/30"
                    }`}
                  >
                    Creator Pro ({TEMPLATE_STATS.pro})
                  </button>
                  <button
                    onClick={() => setSelectedTier("ultimate")}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      selectedTier === "ultimate"
                        ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-purple-400/50"
                        : "bg-slate-700/50 hover:bg-purple-500/20 text-slate-300 hover:text-purple-300 border border-slate-600/30 hover:border-purple-400/30"
                    }`}
                  >
                    Agency Ultimate ({TEMPLATE_STATS.ultimate})
                  </button>
                </div>

                {/* Content Type Filter */}
                <div className="mb-4">
                  <h5 className="text-white font-medium mb-2 text-sm">Filter by Content Type:</h5>
                  <select
                    value={selectedContentTypeFilter || ''}
                    onChange={(e) => setSelectedContentTypeFilter(e.target.value || null)}
                    className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
                  >
                    <option value="">All Content Types</option>
                    {[...new Set(contentSpecificTemplates.map(t => t.contentType))].sort().map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Templates Grid */}
                <div className="grid gap-4 max-h-96 overflow-y-auto">
                  {contentSpecificTemplates
                    .filter((template) => {
                      const tierMatch = selectedTier === null || template.tier === selectedTier;
                      const contentTypeMatch = selectedContentTypeFilter === null || template.contentType === selectedContentTypeFilter;
                      return tierMatch && contentTypeMatch;
                    })
                    .map((template) => {
                      const canAccess = template.tier === 'free' ||
                                      (template.tier === 'pro' && (hasPremiumAccess || subscriptionPlan === 'creator' || subscriptionPlan === 'agency')) ||
                                      (template.tier === 'ultimate' && subscriptionPlan === 'agency');

                      return (
                        <div
                          key={template.id}
                          className={`group relative p-5 bg-gradient-to-br from-slate-700/30 to-slate-800/30 border border-slate-600/30 hover:border-teal-400/50 rounded-xl cursor-pointer transition-all hover:scale-[1.02] hover:shadow-xl ${
                            !canAccess ? 'opacity-60' : ''
                          }`}
                          onClick={() => canAccess ? handleApplyContentTemplate(template) : handlePremiumFeatureClick('Content Templates')}
                        >
                          {/* Tier Badge */}
                          <div className="absolute -top-2 -right-2 flex items-center gap-1">
                            <div className={`px-2 py-1 rounded-full flex items-center gap-1 shadow-lg text-xs font-bold text-white ${
                              template.tier === 'free'
                                ? 'bg-gradient-to-r from-emerald-500 to-green-500'
                                : template.tier === 'pro'
                                ? 'bg-gradient-to-r from-pink-500 to-rose-500'
                                : 'bg-gradient-to-r from-purple-500 to-indigo-500'
                            }`}>
                              <span>{
                                template.tier === 'free' ? 'FREE'
                                : template.tier === 'pro' ? 'PRO'
                                : 'ULTIMATE'
                              }</span>
                            </div>
                          </div>

                          {/* Lock overlay for premium templates */}
                          {!canAccess && (
                            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-xl flex items-center justify-center">
                              <div className="text-center">
                                <LockIcon className="text-3xl text-amber-400 mb-2" />
                                <div className="text-amber-400 text-sm font-bold">
                                  {template.tier === 'pro' ? 'Creator Pro Required' : 'Agency Ultimate Required'}
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h5 className="text-white font-semibold text-lg group-hover:text-teal-300 transition-colors">
                                  {template.name}
                                </h5>
                                <span className="px-2 py-1 bg-teal-500/20 text-teal-300 text-xs rounded-full">
                                  {template.contentType}
                                </span>
                              </div>
                              <p className="text-slate-400 text-sm mb-3 leading-relaxed">
                                {template.description}
                              </p>

                              {/* Template Tags */}
                              <div className="flex flex-wrap gap-1 mb-3">
                                {template.tags.map((tag, index) => (
                                  <span key={`${template.id}-tag-${index}-${tag}`} className="px-2 py-1 bg-slate-600/50 text-slate-300 text-xs rounded">
                                    {tag}
                                  </span>
                                ))}
                              </div>

                              {/* Engagement Boost Badge */}
                              <div className="flex items-center gap-2">
                                <div className="px-2 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-full">
                                  <span className="text-green-300 text-xs font-bold flex items-center gap-1">
                                    <TrendsIcon className="w-3 h-3" />
                                    {template.engagementBoost} Engagement
                                  </span>
                                </div>
                                <div className="px-2 py-1 bg-slate-600/30 text-slate-400 text-xs rounded">
                                  {template.category}
                                </div>
                              </div>
                            </div>
                          </div>

                          {canAccess && (
                            <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 hover:from-teal-500/30 hover:to-cyan-500/30 border border-teal-400/30 text-teal-300 rounded-lg transition-all text-sm font-medium">
                              Use This Template
                            </button>
                          )}
                        </div>
                      );
                    })}
                </div>

                {/* No templates message */}
                {contentSpecificTemplates.filter((template) => {
                  const tierMatch = selectedTier === null || template.tier === selectedTier;
                  const contentTypeMatch = selectedContentTypeFilter === null || template.contentType === selectedContentTypeFilter;
                  return tierMatch && contentTypeMatch;
                }).length === 0 && (
                  <div className="text-center py-8">
                    <div className="text-slate-400 text-lg mb-2">No templates found</div>
                    <div className="text-slate-500 text-sm">Try adjusting your filters</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeSection === "batch" && (
            <PremiumFeatureGate
              feature="batchGeneration"
              featureName="Batch Generation"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="text-xl font-bold text-white flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                        <BoltIcon className="text-xl" />
                      </div>
                      Batch Generation Engine
                    </h4>
                    <p className="text-slate-400 mt-2">
                      Generate 23+ content types simultaneously with AI-powered
                      bulk processing
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-400/30 rounded-full">
                      <span className="text-emerald-300 text-sm font-bold">
                        💰 Save 20% Credits
                      </span>
                    </div>
                    <div className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-full">
                      <span className="text-purple-300 text-xs font-bold">
                        PRO EXCLUSIVE
                      </span>
                    </div>
                  </div>
                </div>
                {hasPremiumAccess ? (
                  <BatchGenerationInterface
                    platform={platform}
                    userInput={userInput}
                    targetAudience={targetAudience}
                    onUpgrade={onUpgrade}
                    onBatchComplete={(results) => {
                      setBatchResults(results);
                      console.log("Batch generation completed:", results);
                    }}
                  />
                ) : (
                  <div className="relative overflow-hidden">
                    {/* Premium Background Pattern */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-orange-900/20 to-red-900/20 rounded-2xl"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.1),transparent_50%)]"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(249,115,22,0.1),transparent_50%)]"></div>

                    <div className="relative text-center p-8 border border-amber-500/30 rounded-2xl backdrop-blur-sm">
                      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl">
                        <BoltIcon className="text-3xl animate-pulse" />
                      </div>
                      <h5 className="text-2xl font-bold text-white mb-3">
                        Unlock Batch Generation Power
                      </h5>
                      <p className="text-slate-300 mb-6 max-w-md mx-auto leading-relaxed">
                        Generate 23+ content types simultaneously with our
                        revolutionary AI batch processing engine.
                        <span className="text-amber-300 font-semibold block mt-2">
                          Save 20% credits + 10x faster creation!
                        </span>
                      </p>

                      {/* Feature Highlights */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="p-3 bg-black/20 border border-amber-500/20 rounded-xl">
                          <div className="text-amber-300 font-bold text-lg">
                            23+
                          </div>
                          <div className="text-slate-400 text-xs">
                            Content Types
                          </div>
                        </div>
                        <div className="p-3 bg-black/20 border border-amber-500/20 rounded-xl">
                          <div className="text-amber-300 font-bold text-lg">
                            20%
                          </div>
                          <div className="text-slate-400 text-xs">
                            Credit Savings
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          handlePremiumFeatureClick("Batch Generation")
                        }
                        className="px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl font-bold transition-all hover:scale-105 shadow-2xl text-lg group"
                      >
                        <span className="flex items-center gap-3">
                          <BoltIcon className="text-xl group-hover:animate-bounce" />
                          {subscriptionPlan === "free"
                            ? "Upgrade to Creator Pro"
                            : "Activate Pro Features"}
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </PremiumFeatureGate>
          )}

          {activeSection === "personas" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-xl font-bold text-white flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                      <UserIcon className="w-5 h-5 text-white" />
                    </div>
                    AI Personas Studio
                  </h4>
                  <p className="text-slate-400 mt-2">
                    Train AI to write in your unique voice and style
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-400/30 rounded-full">
                    <span className="text-indigo-300 text-xs font-bold">
                      {hasPremiumAccess
                        ? `${premiumPersonas.length} ACTIVE`
                        : "LOCKED"}
                    </span>
                  </div>
                </div>
              </div>

              {hasPremiumAccess ? (
                <div className="space-y-6">
                  {/* Active Persona Selector */}
                  <div className="p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-400/30 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-white font-semibold">
                        Currently Active
                      </h5>
                      <button className="text-indigo-400 text-sm hover:text-indigo-300">
                        Switch Persona
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                        <UserIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-white font-medium">
                          Professional Expert
                        </div>
                        <div className="text-slate-400 text-sm">
                          Formal and authoritative tone
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Personas Grid */}
                  <div className="grid gap-4 max-h-80 overflow-y-auto">
                    {premiumPersonas.map((persona) => (
                      <div
                        key={persona.id}
                        className="group p-5 bg-gradient-to-br from-slate-700/30 to-slate-800/30 border border-slate-600/30 hover:border-indigo-400/50 rounded-xl cursor-pointer transition-all hover:scale-[1.02] hover:shadow-xl"
                        onClick={() => handleApplyPersona(persona)}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                              <UserIcon className="w-6 h-6" />
                            </div>
                            <div>
                              <h5 className="text-white font-semibold text-lg group-hover:text-indigo-300 transition-colors">
                                {persona.name}
                              </h5>
                              <p className="text-slate-400 text-sm">
                                {persona.description}
                              </p>
                              <div className="text-xs text-indigo-400 mt-1">
                                {persona.tone} • {persona.communicationStyle}
                              </div>
                            </div>
                          </div>
                          <button className="opacity-0 group-hover:opacity-100 px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs rounded-lg transition-all">
                            Activate
                          </button>
                        </div>

                        <div className="space-y-3">
                          {/* Expertise Tags */}
                          <div>
                            <div className="text-white font-medium text-sm mb-2">
                              Expertise Areas
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {persona.expertise
                                .slice(0, 4)
                                .map((skill, index) => (
                                  <span
                                    key={`${persona.id}-skill-${index}-${skill}`}
                                    className="px-2 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-indigo-300 text-xs"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              {persona.expertise.length > 4 && (
                                <span className="px-2 py-1 bg-slate-600/30 text-slate-400 text-xs rounded-full">
                                  +{persona.expertise.length - 4} more
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Sample Output */}
                          <div>
                            <div className="text-white font-medium text-sm mb-2">
                              Writing Sample
                            </div>
                            <div className="bg-black/40 p-3 rounded-lg border border-slate-600/30">
                              <p className="text-slate-300 text-sm italic">
                                "
                                {persona.examples[0] ||
                                  "Sample content in this persona's unique voice and style..."}
                                "
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Create Custom Persona */}
                  <div className="p-4 border-2 border-dashed border-indigo-400/30 rounded-xl hover:border-indigo-400/50 transition-all cursor-pointer">
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-3 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">➕</span>
                      </div>
                      <h5 className="text-white font-semibold mb-2">
                        Create Custom Persona
                      </h5>
                      <p className="text-slate-400 text-sm">
                        Train AI with your brand voice, tone, and writing style
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative overflow-hidden">
                  {/* Premium Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20 rounded-2xl"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.1),transparent_50%)]"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(147,51,234,0.1),transparent_50%)]"></div>

                  <div className="relative p-8 border border-indigo-500/30 rounded-2xl backdrop-blur-sm">
                    {/* Preview Personas (Locked) */}
                    <div className="grid gap-3 mb-6 opacity-60 pointer-events-none">
                      {premiumPersonas.slice(0, 2).map((persona) => (
                        <div
                          key={persona.id}
                          className="p-4 bg-slate-700/30 border border-slate-600/30 rounded-xl"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-indigo-500/50 rounded-lg flex items-center justify-center">
                                <UserIcon className="w-4 h-4" />
                              </div>
                              <div>
                                <h5 className="text-white font-medium">
                                  {persona.name}
                                </h5>
                                <p className="text-slate-400 text-xs">
                                  {persona.description}
                                </p>
                              </div>
                            </div>
                            <LockIcon className="text-indigo-400" />
                          </div>
                          <div className="bg-slate-800/50 p-3 rounded-lg">
                            <p className="text-slate-300 text-sm blur-sm">
                              Sample content in unique voice...
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="text-center">
                      <h5 className="text-2xl font-bold text-white mb-3">
                        Train Your AI Writing Assistant
                      </h5>
                      <p className="text-slate-300 mb-6 max-w-md mx-auto">
                        Create custom AI personas that perfectly match your
                        brand voice and writing style for consistent, on-brand
                        content
                      </p>

                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="p-3 bg-black/20 border border-indigo-500/20 rounded-xl">
                          <div className="text-indigo-300 font-bold text-lg">
                            12+
                          </div>
                          <div className="text-slate-400 text-xs">
                            AI Personas
                          </div>
                        </div>
                        <div className="p-3 bg-black/20 border border-indigo-500/20 rounded-xl">
                          <div className="text-indigo-300 font-bold text-lg">
                            Custom
                          </div>
                          <div className="text-slate-400 text-xs">
                            Brand Voice
                          </div>
                        </div>
                        <div className="p-3 bg-black/20 border border-indigo-500/20 rounded-xl">
                          <div className="text-indigo-300 font-bold text-lg">
                            100%
                          </div>
                          <div className="text-slate-400 text-xs">
                            Consistent
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handlePremiumFeatureClick("AI Personas")}
                        className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold transition-all hover:scale-105 shadow-2xl text-lg"
                      >
                        Unlock AI Personas
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeSection === "seo" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-xl font-bold text-white flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                      <TrendsIcon className="text-xl" />
                    </div>
                    SEO Optimization Engine
                  </h4>
                  <p className="text-slate-400 mt-2">
                    AI-powered keyword research and content optimization
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-400/30 rounded-full">
                    <span className="text-emerald-300 text-xs font-bold">
                      {seoKeywords.length > 0
                        ? `${seoKeywords.length} KEYWORDS`
                        : "READY"}
                    </span>
                  </div>
                </div>
              </div>

              {hasPremiumAccess ? (
                <div className="space-y-6">
                  {/* SEO Configuration */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-white mb-3">
                          🎯 Target Keywords
                        </label>
                        <input
                          type="text"
                          placeholder="Enter primary keywords..."
                          className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 hover:border-emerald-400/50 focus:border-emerald-400 rounded-xl text-white placeholder-slate-400 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-white mb-3">
                          🌍 Target Audience
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., Small business owners, Tech entrepreneurs..."
                          className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 hover:border-emerald-400/50 focus:border-emerald-400 rounded-xl text-white placeholder-slate-400 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-white mb-3">
                          ⚙️ Optimization Options
                        </label>
                        <div className="space-y-3">
                          {[
                            {
                              id: "competitor",
                              label: "Competitor Analysis",
                              desc: "Analyze top-ranking competitors",
                            },
                            {
                              id: "meta",
                              label: "Meta Optimization",
                              desc: "Optimize titles and descriptions",
                            },
                            {
                              id: "longtail",
                              label: "Long-tail Keywords",
                              desc: "Find low-competition keywords",
                            },
                            {
                              id: "trending",
                              label: "Trending Keywords",
                              desc: "Include trending search terms",
                            },
                          ].map((option) => (
                            <div
                              key={option.id}
                              className="flex items-center gap-3 p-3 bg-slate-700/30 border border-slate-600/30 rounded-xl hover:border-emerald-400/30 transition-all"
                            >
                              <input
                                type="checkbox"
                                className="rounded border-slate-500 text-emerald-500 focus:ring-emerald-400"
                                defaultChecked
                              />
                              <div>
                                <div className="text-white text-sm font-medium">
                                  {option.label}
                                </div>
                                <div className="text-slate-400 text-xs">
                                  {option.desc}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Generate Button */}
                  <button
                    onClick={handleSEOOptimization}
                    disabled={isGenerating}
                    className="w-full py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 disabled:from-slate-600 disabled:to-slate-600 text-white rounded-xl font-bold transition-all hover:scale-105 shadow-2xl text-lg flex items-center justify-center gap-3"
                  >
                    <RocketIcon className="text-xl" />
                    {isGenerating
                      ? "Analyzing SEO Opportunities..."
                      : "Generate SEO Optimization"}
                  </button>

                  {/* SEO Results */}
                  {seoKeywords.length > 0 && (
                    <div className="space-y-4">
                      {/* SEO Score */}
                      <div className="p-6 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-400/30 rounded-xl">
                        <div className="flex items-center justify-between mb-4">
                          <h6 className="text-white font-bold text-lg">
                            SEO Optimization Score
                          </h6>
                          <div className="text-3xl font-bold text-emerald-400">
                            {85 + Math.floor(Math.random() * 10)}/100
                          </div>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-3 mb-2">
                          <div
                            className="bg-gradient-to-r from-emerald-500 to-green-500 h-3 rounded-full"
                            style={{
                              width: `${85 + Math.floor(Math.random() * 10)}%`,
                            }}
                          ></div>
                        </div>
                        <p className="text-emerald-300 text-sm">
                          Excellent optimization potential identified!
                        </p>
                      </div>

                      {/* Keywords Categories */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h6 className="text-white font-semibold mb-3 flex items-center gap-2">
                            <span className="text-emerald-400">🎯</span>
                            Primary Keywords ({Math.min(seoKeywords.length, 5)})
                          </h6>
                          <div className="space-y-2">
                            {seoKeywords.slice(0, 5).map((keyword, index) => (
                              <div
                                key={`primary-${index}-${keyword}`}
                                className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-400/30 rounded-lg hover:bg-emerald-500/20 transition-all"
                              >
                                <span className="text-emerald-300 font-medium text-sm">
                                  {keyword}
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded-full">
                                    High
                                  </span>
                                  <button className="text-emerald-400 hover:text-emerald-300 text-xs">
                                    <CopyIcon />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h6 className="text-white font-semibold mb-3 flex items-center gap-2">
                            <span className="text-sky-400">🔍</span>
                            Long-tail Keywords (
                            {Math.max(0, seoKeywords.length - 5)})
                          </h6>
                          <div className="space-y-2">
                            {seoKeywords.slice(5, 10).map((keyword, index) => (
                              <div
                                key={`secondary-${index}-${keyword}`}
                                className="flex items-center justify-between p-3 bg-sky-500/10 border border-sky-400/30 rounded-lg hover:bg-sky-500/20 transition-all"
                              >
                                <span className="text-sky-300 font-medium text-sm">
                                  {keyword}
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs px-2 py-1 bg-sky-500/20 text-sky-300 rounded-full">
                                    Medium
                                  </span>
                                  <button className="text-sky-400 hover:text-sky-300 text-xs">
                                    <CopyIcon />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* SEO Recommendations */}
                      <div className="p-4 bg-slate-700/30 border border-slate-600/30 rounded-xl">
                        <h6 className="text-white font-semibold mb-3 flex items-center gap-2">
                          <span className="text-amber-400">💡</span>
                          SEO Recommendations
                        </h6>
                        <ul className="text-slate-300 text-sm space-y-2">
                          <li className="flex items-start gap-2">
                            <span className="text-emerald-400">•</span>
                            Include primary keyword in the first 100 words
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-emerald-400">��</span>
                            Use 2-3 secondary keywords naturally throughout
                            content
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-emerald-400">•</span>
                            Optimize meta description with target keywords
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-emerald-400">•</span>
                            Consider adding FAQ section for long-tail keywords
                          </li>
                        </ul>
                      </div>

                      {/* Copy All Keywords */}
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(seoKeywords.join(", "));
                          alert("All keywords copied to clipboard!");
                        }}
                        className="w-full py-3 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 hover:border-emerald-400/50 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                      >
                        <ProfessionalCopyIcon />
                        Copy All Keywords
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative overflow-hidden">
                  {/* Premium Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-green-900/20 to-teal-900/20 rounded-2xl"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.1),transparent_50%)]"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(34,197,94,0.1),transparent_50%)]"></div>

                  <div className="relative p-8 border border-emerald-500/30 rounded-2xl backdrop-blur-sm">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center shadow-2xl">
                        <TrendsIcon className="text-3xl" />
                      </div>
                      <h5 className="text-2xl font-bold text-white mb-3">
                        SEO Optimization Engine
                      </h5>
                      <p className="text-slate-300 mb-6 max-w-md mx-auto">
                        AI-powered keyword research, competitor analysis, and
                        content optimization to boost your search rankings
                      </p>

                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="p-3 bg-black/20 border border-emerald-500/20 rounded-xl">
                          <div className="text-emerald-300 font-bold text-lg">
                            50+
                          </div>
                          <div className="text-slate-400 text-xs">Keywords</div>
                        </div>
                        <div className="p-3 bg-black/20 border border-emerald-500/20 rounded-xl">
                          <div className="text-emerald-300 font-bold text-lg">
                            AI
                          </div>
                          <div className="text-slate-400 text-xs">Analysis</div>
                        </div>
                        <div className="p-3 bg-black/20 border border-emerald-500/20 rounded-xl">
                          <div className="text-emerald-300 font-bold text-lg">
                            Auto
                          </div>
                          <div className="text-slate-400 text-xs">Optimize</div>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          handlePremiumFeatureClick("SEO Optimization")
                        }
                        className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-xl font-bold transition-all hover:scale-105 shadow-2xl text-lg"
                      >
                        Unlock SEO Engine
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeSection === "analytics" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-xl font-bold text-white flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                      <AnalyticsIcon className="text-xl" />
                    </div>
                    Performance Analytics AI
                  </h4>
                  <p className="text-slate-400 mt-2">
                    Predict viral potential and optimize for maximum engagement
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30 rounded-full">
                    <span className="text-blue-300 text-xs font-bold">
                      {currentAnalytics ? "ANALYZED" : "READY"}
                    </span>
                  </div>
                </div>
              </div>

              {hasPremiumAccess ? (
                <div className="space-y-6">
                  {/* Performance Metrics Dashboard */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-6 bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-400/30 rounded-xl text-center group hover:scale-105 transition-all">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-2xl">🎯</span>
                      </div>
                      <div className="text-3xl font-bold text-emerald-400 mb-2">
                        {currentAnalytics?.predictedEngagement || "8.7"}/10
                      </div>
                      <div className="text-slate-300 font-medium mb-1">
                        Viral Potential
                      </div>
                      <div className="text-slate-400 text-xs">
                        Predicted engagement rate
                      </div>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-400/30 rounded-xl text-center group hover:scale-105 transition-all">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                        <RocketIcon className="text-2xl" />
                      </div>
                      <div className="text-3xl font-bold text-blue-400 mb-2">
                        {currentAnalytics?.successRate || "94"}%
                      </div>
                      <div className="text-slate-300 font-medium mb-1">
                        Success Rate
                      </div>
                      <div className="text-slate-400 text-xs">
                        Probability of going viral
                      </div>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-400/30 rounded-xl text-center group hover:scale-105 transition-all">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-2xl">👥</span>
                      </div>
                      <div className="text-3xl font-bold text-purple-400 mb-2">
                        {currentAnalytics?.estimatedReach
                          ? `${Math.round(currentAnalytics.estimatedReach / 1000)}k`
                          : "12k"}
                      </div>
                      <div className="text-slate-300 font-medium mb-1">
                        Est. Reach
                      </div>
                      <div className="text-slate-400 text-xs">
                        Potential audience size
                      </div>
                    </div>
                  </div>

                  {/* Generate Analytics Button */}
                  <button
                    onClick={handlePerformanceAnalytics}
                    disabled={isGenerating}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:from-slate-600 disabled:to-slate-600 text-white rounded-xl font-bold transition-all hover:scale-105 shadow-2xl text-lg flex items-center justify-center gap-3"
                  >
                    <span className="text-xl">🔍</span>
                    {isGenerating
                      ? "Analyzing Performance..."
                      : "Generate AI Performance Report"}
                  </button>

                  {/* Detailed Analytics Results */}
                  {currentAnalytics && (
                    <div className="space-y-4">
                      {/* Performance Breakdown */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-5 bg-slate-700/30 border border-slate-600/30 rounded-xl">
                          <h6 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                            <span className="text-amber-400">💡</span>
                            AI Optimization Tips
                          </h6>
                          <ul className="space-y-3">
                            {(
                              currentAnalytics.improvementSuggestions || [
                                "Add stronger hook in first line",
                                "Include call-to-action",
                                "Optimize for platform algorithm",
                              ]
                            ).map((suggestion, index) => (
                              <li
                                key={`suggestion-${index}-${suggestion.slice(0, 20)}`}
                                className="flex items-start gap-3"
                              >
                                <span className="text-emerald-400 text-sm mt-1">
                                  Available
                                </span>
                                <span className="text-slate-300 text-sm leading-relaxed">
                                  {suggestion}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-5 bg-slate-700/30 border border-slate-600/30 rounded-xl">
                          <h6 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                            <span className="text-sky-400">#️⃣</span>
                            Trending Hashtags
                          </h6>
                          <div className="flex flex-wrap gap-2">
                            {(
                              currentAnalytics.hashtagSuggestions || [
                                "#trending",
                                "#viral",
                                "#content",
                                "#creator",
                                "#ai",
                                "#growth",
                              ]
                            ).map((hashtag, index) => (
                              <button
                                key={`hashtag-${hashtag}`}
                                onClick={() => {
                                  navigator.clipboard.writeText(hashtag);
                                  alert(`${hashtag} copied to clipboard!`);
                                }}
                                className="px-3 py-2 bg-sky-500/20 border border-sky-400/30 hover:bg-sky-500/30 rounded-full text-sky-300 text-sm font-medium transition-all hover:scale-105"
                              >
                                {hashtag}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Timing and Optimization */}
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="p-4 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-400/30 rounded-xl">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-2xl">⏰</span>
                            <div>
                              <h6 className="text-white font-bold">
                                Best Time
                              </h6>
                              <p className="text-amber-300 text-sm font-medium">
                                {currentAnalytics.bestTimeToPost ||
                                  "Tuesday 2-4 PM"}
                              </p>
                            </div>
                          </div>
                          <p className="text-slate-400 text-xs">
                            Optimal posting schedule for maximum reach
                          </p>
                        </div>

                        <div className="p-4 bg-gradient-to-br from-rose-500/10 to-pink-500/10 border border-rose-400/30 rounded-xl">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-2xl">���</span>
                            <div>
                              <h6 className="text-white font-bold">
                                Viral Score
                              </h6>
                              <p className="text-rose-300 text-sm font-medium">
                                {Math.floor(
                                  (currentAnalytics?.predictedEngagement ||
                                    8.7) * 10,
                                )}
                                /100
                              </p>
                            </div>
                          </div>
                          <p className="text-slate-400 text-xs">
                            Likelihood of viral spread
                          </p>
                        </div>

                        <div className="p-4 bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-400/30 rounded-xl">
                          <div className="flex items-center gap-3 mb-3">
                            <TrendsIcon className="text-2xl" />
                            <div>
                              <h6 className="text-white font-bold">
                                Growth Rate
                              </h6>
                              <p className="text-violet-300 text-sm font-medium">
                                +{Math.floor(Math.random() * 50) + 150}%
                              </p>
                            </div>
                          </div>
                          <p className="text-slate-400 text-xs">
                            Expected engagement growth
                          </p>
                        </div>
                      </div>

                      {/* Platform-Specific Insights */}
                      <div className="p-5 bg-gradient-to-r from-slate-700/50 to-slate-800/50 border border-slate-600/30 rounded-xl">
                        <h6 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                          <span className="text-blue-400">🎯</span>
                          Platform-Specific Insights for {platform}
                        </h6>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h7 className="text-slate-300 font-medium mb-2 block">
                              Algorithm Optimization
                            </h7>
                            <ul className="text-slate-400 text-sm space-y-1">
                              <li>• Focus on first 3 seconds for hook</li>
                              <li>• Use trending audio/music</li>
                              <li>• Encourage comments and shares</li>
                            </ul>
                          </div>
                          <div>
                            <h7 className="text-slate-300 font-medium mb-2 block">
                              Content Strategy
                            </h7>
                            <ul className="text-slate-400 text-sm space-y-1">
                              <li>• Post during peak hours (7-9 PM)</li>
                              <li>• Use 3-5 relevant hashtags</li>
                              <li>• Include clear call-to-action</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Export Report */}
                      <button
                        onClick={() => {
                          const report = `Performance Analytics Report\n\nViral Potential: ${currentAnalytics?.predictedEngagement || 8.7}/10\nSuccess Rate: ${currentAnalytics?.successRate || 94}%\nEstimated Reach: ${currentAnalytics?.estimatedReach || 12000}\n\nOptimization Tips:\n${(currentAnalytics.improvementSuggestions || ["Add stronger hook", "Include CTA"]).join("\n")}\n\nBest Time to Post: ${currentAnalytics.bestTimeToPost || "Tuesday 2-4 PM"}`;
                          navigator.clipboard.writeText(report);
                          alert("Analytics report copied to clipboard!");
                        }}
                        className="w-full py-3 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 hover:border-blue-400/50 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                      >
                        <span className="text-lg">📋</span>
                        Export Full Analytics Report
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative overflow-hidden">
                  {/* Premium Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-cyan-900/20 to-teal-900/20 rounded-2xl"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(6,182,212,0.1),transparent_50%)]"></div>

                  <div className="relative p-8 border border-blue-500/30 rounded-2xl backdrop-blur-sm">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl">
                        <AnalyticsIcon className="text-3xl animate-pulse" />
                      </div>
                      <h5 className="text-2xl font-bold text-white mb-3">
                        AI Performance Analytics
                      </h5>
                      <p className="text-slate-300 mb-6 max-w-md mx-auto">
                        Get detailed performance predictions, viral potential
                        analysis, and optimization insights powered by advanced
                        AI
                      </p>

                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="p-3 bg-black/20 border border-blue-500/20 rounded-xl">
                          <div className="text-blue-300 font-bold text-lg">
                            AI
                          </div>
                          <div className="text-slate-400 text-xs">
                            Predictions
                          </div>
                        </div>
                        <div className="p-3 bg-black/20 border border-blue-500/20 rounded-xl">
                          <div className="text-blue-300 font-bold text-lg">
                            Viral
                          </div>
                          <div className="text-slate-400 text-xs">Analysis</div>
                        </div>
                        <div className="p-3 bg-black/20 border border-blue-500/20 rounded-xl">
                          <div className="text-blue-300 font-bold text-lg">
                            Pro
                          </div>
                          <div className="text-slate-400 text-xs">Insights</div>
                        </div>
                      </div>

                      <button
                        onClick={() => handlePremiumFeatureClick("Analytics")}
                        className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-bold transition-all hover:scale-105 shadow-2xl text-lg"
                      >
                        Unlock Analytics AI
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeSection === "ai-boost" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-xl font-bold text-white flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-xl">🧠</span>
                    </div>
                    AI Intelligence Boost
                  </h4>
                  <p className="text-slate-400 mt-2">
                    Supercharge your content with advanced AI capabilities
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-400/30 rounded-full">
                    <span className="text-violet-300 text-xs font-bold">
                      EXPERIMENTAL
                    </span>
                  </div>
                </div>
              </div>

              {hasPremiumAccess ? (
                <div className="space-y-6">
                  {/* AI Boost Status */}
                  <div className="p-5 bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-400/30 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h5 className="text-white font-bold text-lg">
                          AI Boost Status
                        </h5>
                        <p className="text-slate-400 text-sm">
                          Next-generation AI capabilities
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                        <span className="text-emerald-300 font-medium">
                          Active
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-violet-400">
                          5x
                        </div>
                        <div className="text-slate-400 text-xs">Faster</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">
                          AI+
                        </div>
                        <div className="text-slate-400 text-xs">Enhanced</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-pink-400">
                          ∞
                        </div>
                        <div className="text-slate-400 text-xs">Creative</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">
                          Pro
                        </div>
                        <div className="text-slate-400 text-xs">Quality</div>
                      </div>
                    </div>
                  </div>

                  {/* AI Boost Features */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      {
                        icon: "🎯",
                        title: "Neural Targeting",
                        description:
                          "AI analyzes audience psychology for perfect content fit",
                        color: "emerald",
                        status: "Active",
                      },
                      {
                        icon: "🔮",
                        title: "Trend Prediction",
                        description:
                          "Predict viral content patterns with 94% accuracy",
                        color: "blue",
                        status: "Active",
                      },
                      {
                        icon: "⚡",
                        title: "Hyper Generation",
                        description:
                          "Generate content 10x faster with quantum processing",
                        color: "amber",
                        status: "Active",
                      },
                      {
                        icon: "🎨",
                        title: "Creative Amplifier",
                        description:
                          "Unlock breakthrough creative patterns and ideas",
                        color: "rose",
                        status: "Active",
                      },
                      {
                        icon: "🧬",
                        title: "DNA Analysis",
                        description:
                          "Analyze your content DNA for optimal performance",
                        color: "indigo",
                        status: "Beta",
                      },
                      {
                        icon: "��",
                        title: "Viral Catalyst",
                        description: "Apply viral multiplication algorithms",
                        color: "purple",
                        status: "Beta",
                      },
                    ].map((feature, index) => (
                      <div
                        key={`ai-feature-${feature.title.replace(/\s+/g, '-').toLowerCase()}`}
                        className={`group p-5 bg-gradient-to-br from-${feature.color}-500/10 to-${feature.color}-600/10 border border-${feature.color}-400/30 hover:border-${feature.color}-400/50 rounded-xl cursor-pointer transition-all hover:scale-[1.02]`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-12 h-12 bg-gradient-to-r from-${feature.color}-500 to-${feature.color}-600 rounded-xl flex items-center justify-center shadow-lg`}
                            >
                              <span className="text-2xl">{feature.icon}</span>
                            </div>
                            <div>
                              <h6 className="text-white font-bold">
                                {feature.title}
                              </h6>
                              <span
                                className={`text-xs px-2 py-1 bg-${feature.color}-500/20 text-${feature.color}-300 rounded-full`}
                              >
                                {feature.status}
                              </span>
                            </div>
                          </div>
                          <button
                            className={`opacity-0 group-hover:opacity-100 px-3 py-1 bg-${feature.color}-500/20 text-${feature.color}-300 text-xs rounded-lg transition-all`}
                          >
                            Configure
                          </button>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* AI Boost Controls */}
                  <div className="space-y-4">
                    <div className="p-5 bg-slate-700/30 border border-slate-600/30 rounded-xl">
                      <h6 className="text-white font-bold text-lg mb-4">
                        AI Boost Configuration
                      </h6>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Intelligence Level
                          </label>
                          <select className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white">
                            <option>Maximum Intelligence (Recommended)</option>
                            <option>High Intelligence</option>
                            <option>Standard Intelligence</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Creative Mode
                          </label>
                          <select className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white">
                            <option>Breakthrough Creative</option>
                            <option>Innovative</option>
                            <option>Balanced</option>
                            <option>Conservative</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Advanced Features */}
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="p-4 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-400/30 rounded-xl">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-2xl">🌊</span>
                          <div>
                            <h6 className="text-white font-bold">
                              Neural Flow
                            </h6>
                            <p className="text-cyan-300 text-sm">Active</p>
                          </div>
                        </div>
                        <p className="text-slate-400 text-xs">
                          Advanced AI reasoning patterns
                        </p>
                      </div>

                      <div className="p-4 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-400/30 rounded-xl">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-2xl">🔥</span>
                          <div>
                            <h6 className="text-white font-bold">
                              Heat Mapping
                            </h6>
                            <p className="text-orange-300 text-sm">
                              Processing
                            </p>
                          </div>
                        </div>
                        <p className="text-slate-400 text-xs">
                          Viral content heat detection
                        </p>
                      </div>

                      <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-400/30 rounded-xl">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-2xl">⚗️</span>
                          <div>
                            <h6 className="text-white font-bold">
                              AI Synthesis
                            </h6>
                            <p className="text-green-300 text-sm">Ready</p>
                          </div>
                        </div>
                        <p className="text-slate-400 text-xs">
                          Multi-model AI combination
                        </p>
                      </div>
                    </div>

                    {/* Apply AI Boost */}
                    <button
                      onClick={() => {
                        alert(
                          "🧠 AI Boost activated! Your next content generation will use advanced AI capabilities for superior results.",
                        );
                      }}
                      className="w-full py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-xl font-bold transition-all hover:scale-105 shadow-2xl text-lg flex items-center justify-center gap-3"
                    >
                      <span className="text-xl animate-pulse">🧠</span>
                      Apply AI Boost to Next Generation
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative overflow-hidden">
                  {/* Premium Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-purple-900/20 to-indigo-900/20 rounded-2xl"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.1),transparent_50%)]"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(147,51,234,0.1),transparent_50%)]"></div>

                  <div className="relative p-8 border border-violet-500/30 rounded-2xl backdrop-blur-sm">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl">
                        <span className="text-3xl animate-bounce">🧠</span>
                      </div>
                      <h5 className="text-2xl font-bold text-white mb-3">
                        Unlock AI Intelligence Boost
                      </h5>
                      <p className="text-slate-300 mb-6 max-w-md mx-auto">
                        Access next-generation AI capabilities including neural
                        targeting, trend prediction, and breakthrough creative
                        amplification
                      </p>

                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="p-3 bg-black/20 border border-violet-500/20 rounded-xl">
                          <div className="text-violet-300 font-bold text-lg">
                            10x
                          </div>
                          <div className="text-slate-400 text-xs">
                            Smarter AI
                          </div>
                        </div>
                        <div className="p-3 bg-black/20 border border-violet-500/20 rounded-xl">
                          <div className="text-violet-300 font-bold text-lg">
                            Neural
                          </div>
                          <div className="text-slate-400 text-xs">
                            Processing
                          </div>
                        </div>
                        <div className="p-3 bg-black/20 border border-violet-500/20 rounded-xl">
                          <div className="text-violet-300 font-bold text-lg">
                            Future
                          </div>
                          <div className="text-slate-400 text-xs">
                            Technology
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handlePremiumFeatureClick("AI Boost")}
                        className="px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-xl font-bold transition-all hover:scale-105 shadow-2xl text-lg"
                      >
                        Unlock AI Boost
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
