import {
  IMAGE_PROMPT_STYLES,
  IMAGE_PROMPT_MOODS,
  TEXT_ACTION_SUPPORTED_TYPES,
  AI_PERSONAS,
} from "./constants";

// Copy the contents of types.ts here

// String union type for AiPersona to allow custom persona names
export type AiPersona =
  | "Default AI"
  | "Professional Expert"
  | "Casual & Witty Friend"
  | "Creative Storyteller"
  | "Data-Driven Analyst"
  | "Sarcastic Commentator"
  | string; // Allows for custom persona names

export enum Platform {
  YouTube = "YouTube",
  TikTok = "TikTok",
  Instagram = "Instagram",
  Twitter = "Twitter X",
  LinkedIn = "LinkedIn",
  Facebook = "Facebook",
}

export enum ContentType {
  Script = "Script",
  Idea = "Content Idea",
  Title = "Title/Headline",
  ImagePrompt = "Image Prompt (for AI)",
  Image = "Generate Image",
  TrendingTopics = "Trending Topics (via Search)", // Will be superseded by TrendAnalysis
  VideoHook = "Engaging Video Hook",
  ThumbnailConcept = "Thumbnail Concept (Visuals & Text)",

  ContentBrief = "Content Brief",
  PollsQuizzes = "Polls & Quizzes",
  ContentGapFinder = "Content Gap Finder (via Search)",
  MicroScript = "Micro-Video Script (Hook+Points+CTA)",
  VoiceToScript = "Voice-to-Script (AI Enhanced)",
  ChannelAnalysis = "YouTube Channel Analysis (Suggest Gaps)",
  ContentStrategyPlan = "Content Strategy Plan",

  ABTest = "A/B Test Variations",

  Hashtags = "Hashtags",
  Snippets = "Snippets",
  RefinedText = "Refined Text",
  RepurposedContent = "Repurposed Content",
  VisualStoryboard = "Visual Storyboard Points",
  MultiPlatformSnippets = "Multi-Platform Snippet Pack",
  ExplainOutput = "Explain This Output",
  FollowUpIdeas = "Follow-Up Content Ideas",
  SeoKeywords = "SEO Keywords",

  OptimizePrompt = "Optimize Prompt (Suggestions)",
  YouTubeDescription = "YouTube Description Optimizer",
  TranslateAdapt = "Translate & Adapt Content",
  CheckReadability = "Check Readability & Simplify",

  // New ContentTypes
  TrendAnalysis = "Trend Analysis (via Search)", // Replaces TrendingTopics for more focused feature
  EngagementFeedback = "AI Engagement Feedback (Experimental)",
  YoutubeChannelStats = "YouTube Channel Stats",
}

export enum ABTestableContentType {
  Title = "Title/Headline",
  VideoHook = "Engaging VideoHook",
  ThumbnailConcept = "Thumbnail Concept",
}

export enum RefinementType {
  Shorter = "Make it Shorter",
  Longer = "Make it Longer",
  MoreFormal = "Make it More Formal",
  SlightlyMoreFormal = "Make it Slightly More Formal",
  MuchMoreFormal = "Make it Much More Formal",
  MoreCasual = "Make it More Casual",
  SlightlyMoreCasual = "Make it Slightly More Casual",
  MuchMoreCasual = "Make it Much More Casual",
  AddEmojis = "Add Emojis",
  MoreEngaging = "Make it More Engaging",
  ExpandKeyPoints = "Expand on Key Points",
  CondenseMainIdea = "Condense to Main Idea",
  SimplifyLanguage = "Simplify Language for Readability",
}

export enum SeoKeywordMode {
  Incorporate = "Incorporate Keywords",
  Suggest = "Suggest Keywords",
}

export enum SeoIntensity {
  Natural = "Natural",
  Moderate = "Moderate",
  Aggressive = "Aggressive",
}

// Represents the built-in persona identifiers
export enum DefaultAiPersonaEnum {
  Default = "Default AI",
  ProfessionalExpert = "Professional Expert",
  CasualFriend = "Casual & Witty Friend",
  CreativeStoryteller = "Creative Storyteller",
  DataDrivenAnalyst = "Data-Driven Analyst",
  SarcasticCommentator = "Sarcastic Commentator",
}

export interface AiPersonaDefinition {
  id: string; // UUID for custom, or DefaultAiPersonaEnum value for built-in
  name: string;
  systemInstruction: string;
  isCustom: boolean;
  description?: string; // Description for UI, especially for built-in ones
}

export enum Language {
  English = "English",
  Spanish = "Spanish",
  French = "French",
  German = "German",
  MandarinChinese = "Mandarin Chinese",
  Hindi = "Hindi",
  Japanese = "Japanese",
  Portuguese = "Portuguese",
  Russian = "Russian",
  Arabic = "Arabic",
}

export enum AspectRatioGuidance {
  None = "None / Default",
  SixteenNine = "16:9 (Wide Landscape)",
  NineSixteen = "9:16 (Tall Portrait)",
  OneOne = "1:1 (Square)",
  FourFive = "4:5 (Portrait)",
  ThreeTwo = "3:2 (Landscape Photo)",
  TwoThree = "2:3 (Portrait Photo)",
}

export interface Source {
  uri: string;
  title: string;
}

export interface GeneratedTextOutput {
  type: "text";
  content: string;
  groundingSources?: Source[];
}

export interface GeneratedImageOutput {
  type: "image";
  base64Data: string;
  mimeType: string;
}

export interface ThumbnailConceptOutput {
  type: "thumbnail_concept";
  imagePrompt: string;
  textOverlays: string[];
}

export interface ABTestVariation<
  T = GeneratedTextOutput | ThumbnailConceptOutput,
> {
  variation: T;
  rationale: string;
}

export interface PromptOptimizationSuggestion {
  id: string;
  suggestedPrompt: string;
  reasoning?: string;
}

export interface ContentBriefOutput {
  titleSuggestions: string[];
  keyAngles: string[];
  mainTalkingPoints: string[];
  ctaSuggestions: string[];
  toneAndStyleNotes: string;
}

export interface PollQuestion {
  question: string;
  options: string[];
}
export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation?: string;
}
export interface PollQuizOutput {
  type: "poll" | "quiz";
  items: PollQuestion[] | QuizQuestion[];
  title?: string;
}

export interface ReadabilityOutput {
  scoreDescription: string;
  simplifiedContent?: string;
}

export interface ContentStrategyPillar {
  pillarName: string;
  description: string;
  keywords: string[];
  contentTypes: string[];
  postingFrequency: string;
  engagementStrategy: string;
}

export interface ContentIdeaItem {
  title: string;
  format: string;
  platform: string;
  cta: string;
  hashtags: string[];
}

export interface ContentStrategyTheme {
  themeName: string;
  description: string;
  relatedPillars: string[]; // Names of pillars
  contentIdeas: ContentIdeaItem[];
  seoKeywords: string[];
  conversionGoal: string;
}

export interface PostingSchedule {
  optimalTimes: {
    Monday: string[];
    Tuesday: string[];
    Wednesday: string[];
    Thursday: string[];
    Friday: string[];
    Saturday: string[];
    Sunday: string[];
  };
  frequency: string;
  timezone: string;
  seasonalAdjustments: string;
}

export interface ContentStrategyScheduleItem {
  dayOfWeek: string; // e.g., "Monday"
  contentType: string; // e.g., "YouTube Video Idea"
  topicHint: string;
  platform: string;
  optimalTime: string;
  cta: string;
}

export interface SEOStrategy {
  primaryKeywords: string[];
  longtailKeywords: string[];
  hashtagStrategy: {
    trending: string[];
    niche: string[];
    branded: string[];
    community: string[];
  };
  contentOptimization: string;
}

export interface CTAStrategy {
  engagementCTAs: string[];
  conversionCTAs: string[];
  communityBuildingCTAs: string[];
  placementGuidelines: string;
}

export interface EditingGuidelines {
  visualStyle: string;
  videoSpecs: string;
  imageSpecs: string;
  brandingElements: string;
}

export interface ContentManagement {
  workflowSteps: string[];
  editingGuidelines: EditingGuidelines;
  qualityChecklist: string[];
  approvalProcess: string;
}

export interface DistributionStrategy {
  primaryPlatform: string;
  crossPlatformSharing: string[];
  repurposingPlan: string;
  communityEngagement: string;
}

export interface AnalyticsAndKPIs {
  primaryMetrics: string[];
  secondaryMetrics: string[];
  reportingSchedule: string;
  analyticsTools: string[];
}

export interface BudgetAndResources {
  timeAllocation: string;
  toolsNeeded: string[];
  teamRoles: string[];
  budgetBreakdown: string;
}

export interface CompetitorAnalysis {
  topCompetitors: string[];
  gapOpportunities: string[];
  differentiationStrategy: string;
}

export interface ContentCalendarTemplate {
  monthlyThemes: string[];
  seasonalContent: string;
  "evergreen vs trending": string;
  batchCreationSchedule: string;
}

export interface RiskMitigation {
  contentBackups: string;
  crisisManagement: string;
  platformChanges: string;
  burnoutPrevention: string;
}

export interface ContentStrategyPlanOutput {
  targetAudienceOverview: string;
  goals: string[];
  contentPillars: ContentStrategyPillar[];
  keyThemes: ContentStrategyTheme[];
  postingSchedule: PostingSchedule;
  suggestedWeeklySchedule: ContentStrategyScheduleItem[];
  seoStrategy: SEOStrategy;
  ctaStrategy: CTAStrategy;
  contentManagement: ContentManagement;
  distributionStrategy: DistributionStrategy;
  analyticsAndKPIs: AnalyticsAndKPIs;
  budgetAndResources: BudgetAndResources;
  competitorAnalysis: CompetitorAnalysis;
  contentCalendarTemplate: ContentCalendarTemplate;
  riskMitigation: RiskMitigation;
  monetizationStrategy?: MonetizationStrategy;
  scalabilityPlanning?: ScalabilityPlanning;
}

export interface MonetizationStrategy {
  revenueStreams?: string | string[] | Record<string, any>;
  pricingStrategy?: string;
  conversionFunnels?: string;
  partnershipStrategy?: string;
  contentToMonetization?: string;
}

export interface ScalabilityPlanning {
  growthPhases?: string | string[] | Record<string, any>;
  teamStructure?: string;
  technologyStack?: string;
}

export interface EngagementFeedbackOutput {
  // New
  type: "engagement_feedback";
  feedback: string; // Qualitative textual feedback
}

export interface TrendItem {
  // Enhanced trend card structure
  title: string;
  status: string; // e.g., "Growing Fast ↗️", "Emerging ⚡", "At Peak 🔥", "Fading ↘️"
  strategicInsight: string;
  audienceAlignment: string;
  contentIdeas: string[];
  keywords: string;
  hashtags: string;
  hookAngle: string;
  // Legacy fields for backwards compatibility
  link?: string;
  snippet: string;
  sourceType: "news" | "discussion" | "topic" | "video";
}
export interface TrendAnalysisOutput {
  // New
  type: "trend_analysis";
  query: string;
  executiveSummary?: string;
  items: TrendItem[];
  groundingSources?: Source[];
}

export interface ParsedChannelAnalysisSection {
  // Moved from App.tsx
  title: string;
  content: string;
  sources?: Source[];
  ideas?: string[];
}

export type GeneratedOutput = GeneratedTextOutput | GeneratedImageOutput | null;

export interface HistoryItem {
  id: string;
  timestamp: number;
  contentType: ContentType;
  userInput: string;
  // Updated to include new structured output types for history storage
  output:
    | GeneratedTextOutput
    | GeneratedImageOutput
    | ContentBriefOutput
    | PollQuizOutput
    | ReadabilityOutput
    | PromptOptimizationSuggestion[]
    | ParsedChannelAnalysisSection[]
    | ContentStrategyPlanOutput
    | EngagementFeedbackOutput
    | TrendAnalysisOutput;
  abTestResults?: ABTestVariation<
    GeneratedTextOutput | ThumbnailConceptOutput
  >[];
  targetAudience?: string;
  batchVariations?: number;
  isFavorite?: boolean;
  aiPersona?: AiPersona;
  aiPersonaId?: string; // ID of the AiPersonaDefinition used
  targetLanguage?: Language;
  videoLength?: string; // For script generation
  customVideoLength?: string; // Custom video length input

  // Firebase Storage Integration
  firebase?: {
    generationId?: string; // Reference to GenerationRecord in Firestore
    storageUrls?: {
      textContent?: string;
      imageContent?: string;
      thumbnailContent?: string;
    };
    storagePaths?: {
      textContent?: string;
      imageContent?: string;
      thumbnailContent?: string;
    };
    userFeedback?: {
      rating: -1 | 0 | 1; // -1 = negative, 0 = neutral/no rating, 1 = positive
      timestamp: number;
      comment?: string;
    };
    savedToFirebase?: boolean;
    lastSyncedAt?: number;
  };
}

export interface PromptTemplate {
  id: string;
  name: string;
  platform: Platform;
  contentType: ContentType;
  userInput: string;
  targetAudience?: string;
  batchVariations?: number;
  includeCTAs?: boolean;
  selectedImageStyles?: ImagePromptStyle[];
  selectedImageMoods?: ImagePromptMood[];
  negativePrompt?: string;
  seoKeywords?: string;
  seoMode?: SeoKeywordMode;
  seoIntensity?: SeoIntensity;
  abTestConfig?: {
    isABTesting: boolean;
    abTestType?: ABTestableContentType;
  };
  aiPersona?: AiPersona;
  aiPersonaId?: string; // ID of the AiPersonaDefinition used
  aspectRatioGuidance?: AspectRatioGuidance;
  videoLength?: string; // For script generation
  customVideoLength?: string; // Custom video length input
}

export type CanvasItemType =
  | "historyItem"
  | "stickyNote"
  | "textElement"
  | "shapeElement"
  | "frameElement"
  | "commentElement"
  | "imageElement";

export type ShapeVariant =
  | "rectangle"
  | "circle"
  | "triangle"
  | "rightArrow"
  | "star"
  | "speechBubble"
  | "diamond"
  | "hexagon"
  | "pentagon"
  | "octagon"
  | "heart"
  | "cloud"
  | "leftArrow"
  | "upArrow"
  | "downArrow"
  | "doubleArrow"
  | "roundedRectangle"
  | "ellipse"
  | "parallelogram"
  | "trapezoid"
  | "plus"
  | "cross"
  | "lightning"
  | "shield"
  | "gear"
  | "bell"
  | "location"
  | "home"
  | "user"
  | "checkmark"
  | "x"
  | "info"
  | "warning"
  | "folder"
  | "file"
  | "link"
  | "eye"
  | "lock"
  | "key"
  | "mail"
  | "phone"
  | "calendar"
  | "clock"
  | "search"
  | "settings"
  | "camera"
  | "image"
  | "video"
  | "music"
  | "volume"
  | "wifi"
  | "battery"
  | "download"
  | "upload"
  | "refresh"
  | "bookmark"
  | "tag"
  | "paperclip";

export type LineStyle = "solid" | "dashed" | "dotted" | "none";
export type FontWeight = "normal" | "bold";
export type FontStyle = "normal" | "italic";
export type TextDecoration = "none" | "underline";
export type FontFamily =
  | "Arial"
  | "Verdana"
  | "Georgia"
  | "Times New Roman"
  | "Courier New"
  | "Impact";

export interface CanvasItem {
  id: string;
  type: CanvasItemType;
  historyItemId?: string;
  x: number;
  y: number;
  zIndex: number;
  content?: string;
  color?: string;
  width?: number;
  height?: number;

  fontFamily?: FontFamily;
  fontSize?: string;
  fontWeight?: FontWeight;
  fontStyle?: FontStyle;
  textDecoration?: TextDecoration;
  textColor?: string;

  shapeVariant?: ShapeVariant;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: string;
  borderStyle?: LineStyle;

  // lineStyle?: LineStyle; // Duplicates borderStyle for shapes, consider removing if not distinct
  strokeWidth?: number; // Used by SVG shapes, potentially different from CSS border width

  base64Data?: string;
  mimeType?: string;
  // For AI-generated images on canvas, to allow regeneration
  originalGenerationParams?: {
    prompt: string;
    negativePrompt?: string;
    aspectRatioGuidance?: AspectRatioGuidance;
    styles?: ImagePromptStyle[];
    moods?: ImagePromptMood[];
    aiPersonaId?: string;
  };
}

export interface CanvasHistoryEntry {
  items: CanvasItem[];
  // These were previously part of App state, now per-board history entry
  // nextZIndex: number;
  // canvasOffset: { x: number; y: number };
  // zoomLevel: number;
}

export interface CanvasBoard {
  id: string;
  name: string;
  items: CanvasItem[];
  history: CanvasHistoryEntry[]; // Each board has its own undo/redo history
  currentHistoryIndex: number;
  nextZIndex: number;
  offset: { x: number; y: number };
  zoomLevel: number;
  snapshots?: CanvasSnapshot[]; // Snapshots are per-board
}

export interface CanvasSnapshot {
  // New
  id: string;
  name: string;
  timestamp: number;
  boardState: {
    // Captures the full state of items and view for restoration
    items: CanvasItem[];
    nextZIndex: number;
    offset: { x: number; y: number };
    zoomLevel: number;
  };
  previewDataUrl?: string; // Optional: base64 preview image of the canvas at snapshot time
}

export interface CalendarEvent {
  // New
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  description: string;
  color?: string; // For visual distinction
  contentType?: ContentType | string; // From strategy or manual entry
  platform?: Platform;
  originalStrategyItem?: ContentStrategyScheduleItem; // Link back if from strategy
}

export type ImagePromptStyle = (typeof IMAGE_PROMPT_STYLES)[number];
export type ImagePromptMood = (typeof IMAGE_PROMPT_MOODS)[number];

export const getNextStickyNoteColorIndex = () => {
  // Implementation here
};

// Add missing types
export type SEO_KEYWORD_SUGGESTION_SUPPORTED_TYPES =
  typeof TEXT_ACTION_SUPPORTED_TYPES;
export type MULTI_PLATFORM_REPURPOSING_SUPPORTED_TYPES =
  typeof TEXT_ACTION_SUPPORTED_TYPES;
export type VIDEO_EDITING_EXTENSIONS = string[];
export type DEFAULT_AI_PERSONAS = typeof AI_PERSONAS;
export type SUPPORTED_LANGUAGES = typeof Language;
export type ASPECT_RATIO_GUIDANCE_OPTIONS = typeof AspectRatioGuidance;
export type YOUTUBE_DESCRIPTION_OPTIMIZER_SUPPORTED_TYPES =
  typeof TEXT_ACTION_SUPPORTED_TYPES;
export type TRANSLATE_ADAPT_SUPPORTED_TYPES =
  typeof TEXT_ACTION_SUPPORTED_TYPES;
export type READABILITY_CHECK_SUPPORTED_TYPES =
  typeof TEXT_ACTION_SUPPORTED_TYPES;
export type CANVAS_SHAPE_VARIANTS = ShapeVariant;
export type CANVAS_FONT_FAMILIES = FontFamily;
export type CANVAS_PRESET_COLORS = string[];
export type ENGAGEMENT_FEEDBACK_SUPPORTED_TYPES =
  typeof TEXT_ACTION_SUPPORTED_TYPES;
export type PLATFORM_COLORS = Record<string, string>;
