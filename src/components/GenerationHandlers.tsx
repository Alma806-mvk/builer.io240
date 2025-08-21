import { useCallback } from "react";
import {
  ContentType,
  Platform,
  GeneratedOutput,
  GeneratedImageOutput,
  GeneratedTextOutput,
  HistoryItem,
  ABTestVariation,
  ThumbnailConceptOutput,
  ContentStrategyPlanOutput,
  TrendAnalysisOutput,
  TrendItem,
  Source,
  Language,
  ParsedChannelAnalysisSection,
  SeoKeywordMode,
  AspectRatioGuidance,
  RefinementType,
} from "../../types";

import {
  generateTextContent,
  generateImage,
  performWebSearch,
} from "../../services/geminiService";

import { generateMockContent } from "../services/mockGeminiService";
import { firebaseIntegratedGenerationService } from "../services/firebaseIntegratedGenerationService";
import { auth } from "../config/firebase";
import { useSubscription } from "../context/SubscriptionContext";
import {
  BATCH_SUPPORTED_TYPES,
  AB_TESTABLE_CONTENT_TYPES_MAP,
} from "../../constants";

const MAX_HISTORY_ITEMS = 50;

// Utility functions
const parseJsonSafely = <T,>(jsonString: string): T | null => {
  let cleanJsonString = jsonString.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const matchResult = cleanJsonString.match(fenceRegex);
  if (matchResult && matchResult[2]) {
    cleanJsonString = matchResult[2].trim();
  }
  try {
    return JSON.parse(cleanJsonString) as T;
  } catch (parseError) {
    console.error(
      "Failed to parse JSON response:",
      parseError,
      "Original string:",
      jsonString,
    );
    return null;
  }
};

const isGeneratedTextOutput = (output: any): output is GeneratedTextOutput => {
  return (
    output &&
    typeof output === "object" &&
    !Array.isArray(output) &&
    output.type === "text"
  );
};

const isGeneratedImageOutput = (
  output: any,
): output is GeneratedImageOutput => {
  return (
    output &&
    typeof output === "object" &&
    !Array.isArray(output) &&
    output.type === "image"
  );
};

const isContentStrategyPlanOutput = (
  output: any,
): output is ContentStrategyPlanOutput => {
  return (
    output &&
    typeof output === "object" &&
    "contentPillars" in output &&
    "keyThemes" in output
  );
};

const isTrendAnalysisOutput = (output: any): output is TrendAnalysisOutput => {
  return (
    output &&
    typeof output === "object" &&
    output.type === "trend_analysis" &&
    "query" in output &&
    Array.isArray((output as TrendAnalysisOutput).items)
  );
};

// Channel analysis headings for parsing
const CHANNEL_ANALYSIS_HEADINGS = [
  "**Overall Channel(s) Summary & Niche:**",
  "**Competitor Benchmarking Insights (if multiple channels provided):**",
  "**Audience Engagement Insights (Inferred from Search):**",
  "**Content Series & Playlist Recommendations:**",
  "**Format Diversification Suggestions:**",
  "**'Low-Hanging Fruit' Video Ideas (actionable & specific):**",
  "**Inferred Thumbnail & Title Optimization Patterns:**",
  "**Potential Content Gaps & Strategic Opportunities:**",
  "**Key SEO Keywords & Phrases (Tag Cloud Insights):**",
  "**Collaboration Theme Suggestions:**",
  "**Speculative Historical Content Evolution:**",
];

const parseChannelAnalysisOutput = (
  text: string,
  groundingSources?: Source[],
): ParsedChannelAnalysisSection[] => {
  const sections: ParsedChannelAnalysisSection[] = [];

  // Safety check for undefined text
  if (!text) {
    return sections;
  }

  let fullText = text;

  for (let i = 0; i < CHANNEL_ANALYSIS_HEADINGS.length; i++) {
    const currentHeading = CHANNEL_ANALYSIS_HEADINGS[i];
    const startIndex = fullText.indexOf(currentHeading);

    if (startIndex === -1) continue;

    let endIndex = fullText.length;
    for (let j = i + 1; j < CHANNEL_ANALYSIS_HEADINGS.length; j++) {
      const nextHeadingCandidate = CHANNEL_ANALYSIS_HEADINGS[j];
      const nextHeadingIndex = fullText.indexOf(
        nextHeadingCandidate,
        startIndex + currentHeading.length,
      );
      if (nextHeadingIndex !== -1) {
        endIndex = nextHeadingIndex;
        break;
      }
    }

    const sectionTitle = currentHeading
      .replace(/\*\*/g, "")
      .replace(/:$/, "")
      .trim();
    let sectionContent = fullText
      .substring(startIndex + currentHeading.length, endIndex)
      .trim();

    const section: ParsedChannelAnalysisSection = {
      title: sectionTitle,
      content: sectionContent,
    };

    if (
      sectionTitle.includes("'Low-Hanging Fruit' Video Ideas") ||
      sectionTitle.includes("Potential Content Gaps & Strategic Opportunities")
    ) {
      section.ideas = sectionContent
        .split("\n")
        .map((line) => line.trim())
        .filter(
          (line) =>
            line.startsWith("- Video Idea:") ||
            line.startsWith("- Content Gap:"),
        )
        .map((line) => line.substring(line.indexOf(":") + 1).trim());
    }
    sections.push(section);
  }

  if (sections.length === 0 && text && text.trim().length > 0) {
    sections.push({ title: "General Analysis", content: text.trim() });
  }

  if (sections.length > 0 && groundingSources && groundingSources.length > 0) {
    let sourceAttached = false;
    const engagementSection = sections.find(
      (s) =>
        s.title.includes("Audience Engagement Insights") ||
        s.title.includes("Overall Channel(s) Summary"),
    );
    if (engagementSection) {
      engagementSection.sources = groundingSources;
      sourceAttached = true;
    }
    if (!sourceAttached && sections.length > 0) {
      sections[sections.length - 1].sources = groundingSources;
    }
  }
  return sections;
};

const parseTrendAnalysisText = (
  text: string,
  query: string,
  sources?: Source[],
): TrendAnalysisOutput => {
  const items: TrendItem[] = [];
  const itemRegex =
    /--- Trend Item Start ---\s*Title:\s*(.*?)\s*Snippet:\s*(.*?)\s*Source Type:\s*(news|discussion|topic|video)\s*(?:Link:\s*(.*?)\s*)?--- Trend Item End ---/gs;
  let match;
  while ((match = itemRegex.exec(text)) !== null) {
    items.push({
      title: match[1].trim(),
      snippet: match[2].trim(),
      sourceType: match[3].trim() as "news" | "discussion" | "topic" | "video",
      link: match[4] ? match[4].trim() : undefined,
    });
  }
  return { type: "trend_analysis", query, items, groundingSources: sources };
};

interface GenerationHandlersProps {
  // State
  platform: Platform;
  contentType: ContentType;
  userInput: string;
  targetAudience: string;
  batchVariations: number;
  selectedAiPersona: any;
  targetLanguage: Language;
  seoKeywords: string;
  seoMode: SeoKeywordMode;
  aspectRatioGuidance: AspectRatioGuidance;
  negativeImagePrompt: string;
  videoLength: string;
  customVideoLength: string;
  isABTesting: boolean;
  abTestType: string;

  // State setters
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setGeneratedOutput: (output: GeneratedOutput | null) => void;
  setAbTestResults: (
    results:
      | ABTestVariation<GeneratedTextOutput | ThumbnailConceptOutput>[]
      | null,
  ) => void;
  setPromptOptimizationSuggestions: (suggestions: any) => void;
  setParsedChannelAnalysis: (
    analysis: ParsedChannelAnalysisSection[] | null,
  ) => void;
  setChannelAnalysisSummary: (summary: string | null) => void;
  setYoutubeStatsData: (data: any[]) => void;
  setCopied: (copied: boolean) => void;
  setViewingHistoryItemId: (id: string | null) => void;
  setIsAnalyzingChannel: (analyzing: boolean) => void;
  setIsSummarizingChannelAnalysis: (summarizing: boolean) => void;
  setChannelAnalysisError: (error: string | null) => void;
  setIsGeneratingStrategy: (generating: boolean) => void;
  setStrategyError: (error: string | null) => void;
  setGeneratedStrategyPlan: (plan: ContentStrategyPlanOutput | null) => void;

  // History management
  addHistoryItemToState: (
    itemOutput: HistoryItem["output"],
    originalContentType: ContentType,
    originalUserInput: string,
    actionParams?: any,
  ) => void;

  children: (handlers: GenerationHandlers) => React.ReactNode;
}

interface GenerationHandlers {
  handleActualGeneration: (
    effectiveContentType: ContentType,
    effectiveUserInput: string,
    currentActionParams?: any,
  ) => Promise<void>;
  handleImageGeneration: (prompt: string) => Promise<void>;
  handleChannelAnalysis: (channelInput: string) => Promise<void>;
  handleTrendAnalysis: (query: string) => Promise<void>;
  handleWebSearch: (query: string) => Promise<void>;
}

export const GenerationHandlers: React.FC<GenerationHandlersProps> = ({
  // State
  platform,
  contentType,
  userInput,
  targetAudience,
  batchVariations,
  selectedAiPersona,
  targetLanguage,
  seoKeywords,
  seoMode,
  aspectRatioGuidance,
  negativeImagePrompt,
  videoLength,
  customVideoLength,
  isABTesting,
  abTestType,

  // State setters
  setIsLoading,
  setError,
  setGeneratedOutput,
  setAbTestResults,
  setPromptOptimizationSuggestions,
  setParsedChannelAnalysis,
  setChannelAnalysisSummary,
  setYoutubeStatsData,
  setCopied,
  setViewingHistoryItemId,
  setIsAnalyzingChannel,
  setIsSummarizingChannelAnalysis,
  setChannelAnalysisError,
  setIsGeneratingStrategy,
  setStrategyError,
  setGeneratedStrategyPlan,

  // History management
  addHistoryItemToState,

  children,
}) => {
  const { billingInfo } = useSubscription(); // Get subscription info
  const isBatchSupported = BATCH_SUPPORTED_TYPES.includes(contentType);
  const selectedPersonaDetails = selectedAiPersona;

  const handleActualGeneration = useCallback(
    async (
      effectiveContentType: ContentType,
      effectiveUserInput: string,
      currentActionParams?: any,
    ) => {
      if (
        effectiveContentType === ContentType.RefinedText &&
        currentActionParams?.isSummarizingChannel
      ) {
        setIsSummarizingChannelAnalysis(true);
      } else {
        setIsLoading(true);
      }
      setError(null);
      setGeneratedOutput(null);
      setAbTestResults(null);
      setPromptOptimizationSuggestions(null);
      if (!currentActionParams?.isSummarizingChannel) {
        setParsedChannelAnalysis(null);
        setChannelAnalysisSummary(null);
      }
      setYoutubeStatsData([]);
      setCopied(false);
      setViewingHistoryItemId(null);

      let finalOutputForDisplay: HistoryItem["output"] | null = null;
      let abResultsForHistory:
        | ABTestVariation<GeneratedTextOutput | ThumbnailConceptOutput>[]
        | undefined = undefined;
      const isCurrentlyABTesting =
        effectiveContentType === ContentType.ABTest && isABTesting;

      const currentPersonaDef = selectedPersonaDetails;

      let text: string = "";
      let sources: Source[] | undefined = undefined;

      const textGenOptions: Parameters<typeof generateTextContent>[0] = {
        platform: currentActionParams?.originalPlatform || platform,
        contentType: effectiveContentType,
        userInput: effectiveUserInput,
        targetAudience: targetAudience || undefined,
        batchVariations:
          isBatchSupported && batchVariations > 1 && !isCurrentlyABTesting
            ? batchVariations
            : undefined,
        originalText: currentActionParams?.originalText,
        refinementType: currentActionParams?.refinementType,
        repurposeTargetPlatform: currentActionParams?.repurposeTargetPlatform,
        repurposeTargetContentType:
          currentActionParams?.repurposeTargetContentType,
        isABTesting: isCurrentlyABTesting,
        abTestType: isCurrentlyABTesting ? abTestType : undefined,
        multiPlatformTargets: currentActionParams?.multiPlatformTargets,
        seoKeywords:
          seoMode === SeoKeywordMode.Incorporate ? seoKeywords : undefined,
        seoMode: seoKeywords ? seoMode : undefined,
        aiPersonaDef: currentPersonaDef,
        targetLanguage: currentActionParams?.targetLanguage || targetLanguage,
        aspectRatioGuidance:
          effectiveContentType === ContentType.ImagePrompt
            ? aspectRatioGuidance
            : undefined,
        originalContentTypeForOptimization:
          currentActionParams?.originalContentTypeForOptimization,
        isVoiceInput: currentActionParams?.isVoiceInput || false,
        strategyInputs: currentActionParams?.strategyInputs,
        nicheForTrends: currentActionParams?.nicheForTrends,
        videoLength:
          effectiveContentType === ContentType.Script
            ? videoLength === "custom"
              ? customVideoLength
              : videoLength
            : undefined,
        userSubscriptionPlanId: billingInfo?.subscription?.planId, // Pass subscription level for tiered prompts
      };

      try {
        if (effectiveContentType === ContentType.Image) {
          const imageData = await generateImage(
            effectiveUserInput,
            negativeImagePrompt,
            aspectRatioGuidance,
          );
          finalOutputForDisplay = {
            type: "image",
            base64Data: imageData.base64Data,
            mimeType: imageData.mimeType,
          } as GeneratedImageOutput;
        } else if (
          effectiveContentType === ContentType.ChannelAnalysis &&
          currentActionParams?.channelInput
        ) {
          setIsAnalyzingChannel(true);
          setChannelAnalysisError(null);
          let result;
          try {
            console.log('🔥 Using Firebase service for channel analysis');
            const firebaseResult = await firebaseIntegratedGenerationService.generateContentWithFirebaseStorage({
              userInput: currentActionParams.channelInput,
              platform: Platform.YouTube,
              contentType: ContentType.ChannelAnalysis,
              targetAudience,
              aiPersona: currentPersonaDef,
              saveToFirebase: true,
            });
            result = {
              text: firebaseResult.textOutput?.content || '',
              sources: firebaseResult.textOutput?.groundingSources,
            };
          } catch (apiError: any) {
            if (
              apiError.message?.includes("INVALID_API_KEY") ||
              apiError.message?.includes("overloaded") ||
              apiError.message?.includes("503") ||
              apiError.message?.includes("UNAVAILABLE") ||
              apiError.message?.includes("body stream already read") ||
              (apiError.code &&
                (apiError.code === 503 || apiError.code === 429)) ||
              (apiError.status &&
                (apiError.status === "UNAVAILABLE" ||
                  apiError.status === "RESOURCE_EXHAUSTED"))
            ) {
              console.warn(
                `API error detected (${apiError.message || apiError.code || apiError.status}), using fallback content`,
              );
              result = generateMockContent(
                ContentType.ChannelAnalysis,
                currentActionParams.channelInput,
                Platform.YouTube,
              );
            } else {
              throw apiError;
            }
          }
          text = result.text;
          sources = result.sources;
          const parsedData = parseChannelAnalysisOutput(text, sources);
          setParsedChannelAnalysis(parsedData);
          finalOutputForDisplay = parsedData;
          setIsAnalyzingChannel(false);
        } else if (
          effectiveContentType === ContentType.ContentStrategyPlan &&
          currentActionParams?.strategyConfig
        ) {
          setIsGeneratingStrategy(true);
          setStrategyError(null);
          let strategyResult;
          try {
            console.log('🔥 Using Firebase service for strategy plan');
            const firebaseResult = await firebaseIntegratedGenerationService.generateContentWithFirebaseStorage({
              userInput: currentActionParams.strategyConfig.niche,
              platform,
              contentType: ContentType.ContentStrategyPlan,
              aiPersona: currentPersonaDef,
              saveToFirebase: true,
            });
            strategyResult = {
              text: firebaseResult.textOutput?.content || '',
              responseMimeType: 'application/json',
            };
          } catch (apiError: any) {
            if (
              apiError.message?.includes("INVALID_API_KEY") ||
              apiError.message?.includes("overloaded") ||
              apiError.message?.includes("503") ||
              apiError.message?.includes("UNAVAILABLE") ||
              apiError.message?.includes("body stream already read") ||
              (apiError.code &&
                (apiError.code === 503 || apiError.code === 429)) ||
              (apiError.status &&
                (apiError.status === "UNAVAILABLE" ||
                  apiError.status === "RESOURCE_EXHAUSTED"))
            ) {
              console.warn(
                `API error detected during strategy plan generation (${apiError.message || apiError.code || apiError.status}), using fallback content`,
              );
              strategyResult = generateMockContent(
                ContentType.ContentStrategyPlan,
                currentActionParams.strategyConfig.niche,
                platform,
              );
            } else {
              throw apiError;
            }
          }
          const { text: strategyText, responseMimeType: strategyMimeType } =
            strategyResult;
          if (strategyMimeType === "application/json") {
            const parsed =
              parseJsonSafely<ContentStrategyPlanOutput>(strategyText);
            if (parsed) {
              setGeneratedStrategyPlan(parsed);
              finalOutputForDisplay = parsed;
            }
          }
          setIsGeneratingStrategy(false);
        } else {
          // Handle other content types using Firebase integrated service
          try {
            console.log('🔥 Using Firebase integrated generation service');

            // Convert textGenOptions to Firebase service format
            const firebaseOptions = {
              userInput: textGenOptions.userInput,
              platform: textGenOptions.platform,
              contentType: textGenOptions.contentType,
              targetAudience: textGenOptions.targetAudience,
              batchVariations: textGenOptions.batchVariations,
              aiPersona: textGenOptions.aiPersonaDef,
              aiPersonaId: selectedAiPersona?.id,
              targetLanguage: textGenOptions.targetLanguage,
              videoLength: textGenOptions.videoLength,
              seoKeywords: textGenOptions.seoKeywords,
              seoMode: textGenOptions.seoMode,
              aspectRatioGuidance: textGenOptions.aspectRatioGuidance,
              saveToFirebase: true, // Enable Firebase storage
            };

            const firebaseResult = await firebaseIntegratedGenerationService.generateContentWithFirebaseStorage(firebaseOptions);

            // Extract the generated content from Firebase result
            if (firebaseResult.textOutput) {
              finalOutputForDisplay = firebaseResult.textOutput;
            } else if (firebaseResult.imageOutput) {
              finalOutputForDisplay = firebaseResult.imageOutput;
            }

            // Log Firebase storage status
            if (firebaseResult.savedToFirebase) {
              console.log('✅ Content saved to Firebase with ID:', firebaseResult.generationId);
            } else {
              console.log('⚠️ Content generated but not saved to Firebase');
            }

          } catch (apiError: any) {
            console.warn('❌ Firebase integrated generation failed, falling back to direct service:', apiError);

            // Fallback to direct service call
            let result;
            try {
              result = await generateTextContent(textGenOptions);
            } catch (fallbackError: any) {
              if (
                fallbackError.message?.includes("INVALID_API_KEY") ||
                fallbackError.message?.includes("overloaded") ||
                fallbackError.message?.includes("503") ||
                fallbackError.message?.includes("UNAVAILABLE") ||
                fallbackError.message?.includes("body stream already read") ||
                (fallbackError.code &&
                  (fallbackError.code === 503 || fallbackError.code === 429)) ||
                (fallbackError.status &&
                  (fallbackError.status === "UNAVAILABLE" ||
                    fallbackError.status === "RESOURCE_EXHAUSTED"))
              ) {
                console.warn(
                  `API error detected (${fallbackError.message || fallbackError.code || fallbackError.status}), using fallback content`,
                );
                result = generateMockContent(
                  effectiveContentType,
                  effectiveUserInput,
                  platform,
                );
              } else {
                throw fallbackError;
              }
            }

            text = result.text;
            sources = result.sources;

            // Parse different response types
            if (result.responseMimeType === "application/json") {
              // Handle JSON responses
              const parsed = parseJsonSafely(text);
              if (parsed) {
                finalOutputForDisplay = parsed;
              }
            } else {
              // Handle text responses
              finalOutputForDisplay = {
                type: "text",
                content: text,
                groundingSources: sources,
              } as GeneratedTextOutput;
            }
          }
        }

        // Set the generated output
        if (finalOutputForDisplay) {
          setGeneratedOutput(finalOutputForDisplay);

          // Add to history if it's a main generation (not a sub-action)
          if (!currentActionParams?.skipHistory) {
            addHistoryItemToState(
              finalOutputForDisplay,
              effectiveContentType,
              effectiveUserInput,
              {
                audience: targetAudience,
                batch: batchVariations > 1 ? batchVariations : undefined,
                abResults: abResultsForHistory,
                personaId: selectedAiPersona?.id,
                language: targetLanguage,
                originalPlatform: platform,
              },
            );
          }
        }
      } catch (error: any) {
        console.error("Generation error:", error);
        setError(error.message || "An error occurred during generation");
      } finally {
        setIsLoading(false);
        setIsAnalyzingChannel(false);
        setIsSummarizingChannelAnalysis(false);
        setIsGeneratingStrategy(false);
      }
    },
    [
      platform,
      contentType,
      userInput,
      targetAudience,
      batchVariations,
      selectedPersonaDetails,
      targetLanguage,
      seoKeywords,
      seoMode,
      aspectRatioGuidance,
      negativeImagePrompt,
      videoLength,
      customVideoLength,
      isABTesting,
      abTestType,
      isBatchSupported,
    ],
  );

  const handleImageGeneration = useCallback(
    async (prompt: string) => {
      try {
        setIsLoading(true);
        setError(null);

        const imageData = await generateImage(
          prompt,
          negativeImagePrompt,
          aspectRatioGuidance,
        );

        const output: GeneratedImageOutput = {
          type: "image",
          base64Data: imageData.base64Data,
          mimeType: imageData.mimeType,
        };

        setGeneratedOutput(output);

        addHistoryItemToState(output, ContentType.Image, prompt, {
          personaId: selectedAiPersona?.id,
          language: targetLanguage,
          originalPlatform: platform,
        });
      } catch (error: any) {
        console.error("Image generation error:", error);
        setError(error.message || "An error occurred during image generation");
      } finally {
        setIsLoading(false);
      }
    },
    [
      negativeImagePrompt,
      aspectRatioGuidance,
      selectedAiPersona,
      targetLanguage,
      platform,
    ],
  );

  const handleChannelAnalysis = useCallback(
    async (channelInput: string) => {
      await handleActualGeneration(ContentType.ChannelAnalysis, channelInput, {
        channelInput,
      });
    },
    [handleActualGeneration],
  );

  const handleTrendAnalysis = useCallback(
    async (query: string) => {
      try {
        setIsLoading(true);
        setError(null);

        console.log('🔥 Using Firebase service for trend analysis');
        const firebaseResult = await firebaseIntegratedGenerationService.generateContentWithFirebaseStorage({
          userInput: query,
          platform,
          contentType: ContentType.TrendAnalysis,
          aiPersona: selectedPersonaDetails,
          saveToFirebase: true,
        });

        const result = {
          text: firebaseResult.textOutput?.content || '',
          sources: firebaseResult.textOutput?.groundingSources,
        };

        const trendOutput = parseTrendAnalysisText(
          result.text,
          query,
          result.sources,
        );
        setGeneratedOutput(trendOutput);

        addHistoryItemToState(trendOutput, ContentType.TrendAnalysis, query, {
          personaId: selectedAiPersona?.id,
          language: targetLanguage,
          originalPlatform: platform,
        });
      } catch (error: any) {
        console.error("Trend analysis error:", error);
        setError(error.message || "An error occurred during trend analysis");
      } finally {
        setIsLoading(false);
      }
    },
    [platform, selectedPersonaDetails, selectedAiPersona, targetLanguage],
  );

  const handleWebSearch = useCallback(
    async (query: string) => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await performWebSearch(query);

        const searchOutput: GeneratedTextOutput = {
          type: "text",
          content: result.text,
          groundingSources: result.sources,
        };

        setGeneratedOutput(searchOutput);

        addHistoryItemToState(searchOutput, ContentType.WebSearch, query, {
          personaId: selectedAiPersona?.id,
          language: targetLanguage,
          originalPlatform: platform,
        });
      } catch (error: any) {
        console.error("Web search error:", error);
        setError(error.message || "An error occurred during web search");
      } finally {
        setIsLoading(false);
      }
    },
    [selectedAiPersona, targetLanguage, platform],
  );

  const handlers: GenerationHandlers = {
    handleActualGeneration,
    handleImageGeneration,
    handleChannelAnalysis,
    handleTrendAnalysis,
    handleWebSearch,
  };

  return <>{children(handlers)}</>;
};

export default GenerationHandlers;
