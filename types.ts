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

  // Premium Content Types (Creator Pro+)
  InteractivePollsQuizzes = "Interactive Polls & Quizzes",
  VideoScriptWithShotList = "Video Script with Shot List",
  PodcastEpisodeOutline = "Podcast Episode Outline",
  EmailMarketingSequence = "Email Marketing Sequence",
  SalesFunnelContent = "Sales Funnel Content",
  CourseEducationalContent = "Course/Educational Content",
  LiveStreamScript = "Live Stream Script",
  ProductLaunchCampaign = "Product Launch Campaign",
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
}
export interface ContentStrategyTheme {
  themeName: string;
  description: string;
  relatedPillars: string[]; // Names of pillars
  contentIdeas: { title: string; format: string; platform: string }[];
}
export interface ContentStrategyScheduleItem {
  dayOfWeek: string; // e.g., "Monday"
  contentType: string; // e.g., "YouTube Video Idea"
  topicHint: string;
  platform: string;
}
export interface ContentStrategyPlanOutput {
  targetAudienceOverview: string;
  goals: string[];
  contentPillars: ContentStrategyPillar[];
  keyThemes: ContentStrategyTheme[];
  suggestedWeeklySchedule: ContentStrategyScheduleItem[];
  kpiSuggestions: string[];
}

export interface EngagementFeedbackOutput {
  // New
  type: "engagement_feedback";
  feedback: string; // Qualitative textual feedback
}

export interface TrendItem {
  // New
  title: string;
  link?: string;
  snippet: string;
  sourceType: "news" | "discussion" | "topic" | "video";

  // Dashboard metrics
  volume?: number;
  sentiment?: number; // Simple sentiment score 0-100

  // Premium fields
  impactScore?: number;
  engagementMetrics?: {
    views: number;
    shares: number;
    comments: number;
    likes: number;
  };
  sentimentDetails?: {
    score: number; // -100 to 100
    confidence: number;
    keywords: string[];
  };
  publishedDate?: string;
  author?: string;
  competitorMentions?: string[];
  predictedGrowth?: number;
  relatedTopics?: string[];
}

export interface TrendAnalysisOutput {
  // New
  type: "trend_analysis";
  query: string;
  items: TrendItem[];
  groundingSources?: Source[];

  // Dashboard metrics
  totalTrends?: number;
  averageSentiment?: number;
  growthRate?: number;
  totalReach?: number;
  averageEngagement?: number;
  competitors?: {
    name: string;
    mentions: number;
    sentiment: number;
    marketShare: number;
  }[];
  regions?: {
    name: string;
    mentions: number;
    sentiment: number;
  }[];

  // New trend card format
  executiveSummary?: string;
  trendCards?: {
    id: string;
    name: string;
    status: string;
    strategicInsight: string;
    audienceAlignment: string;
    contentIdeas: {
      type: string;
      title: string;
    }[];
    keywords: string[];
    hashtags: string[];
    hookAndAngle: string;
  }[];

  // Premium analytics
  summary?: {
    totalMentions: number;
    trendScore: number;
    velocityChange: number;
    peakDate: string;
    sentimentScore: number;
    competitorActivity: number;
    predictedTrend: "rising" | "stable" | "declining";
    keyInsights: string[];
  };
  timelineData?: {
    date: string;
    mentions: number;
    sentiment: number;
  }[];
  competitorAnalysis?: {
    competitor: string;
    mentionCount: number;
    sentiment: number;
    marketShare: number;
  }[];
  recommendations?: {
    contentOpportunities: string[];
    targetAudiences: string[];
    optimalPostTimes: string[];
    hashtagSuggestions: string[];
  };
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
  platform: Platform;
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
  rating?: 1 | -1 | 0; // 1=thumbs up, -1=thumbs down, 0=unrated
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
}

export type CanvasItemType =
  | "historyItem"
  | "stickyNote"
  | "textElement"
  | "shapeElement"
  | "frameElement"
  | "commentElement"
  | "imageElement"
  | "connectorElement"
  | "mindMapNode"
  | "flowchartBox"
  | "kanbanCard"
  | "tableElement"
  | "diagramNode"
  | "codeBlock"
  | "embedElement"
  | "chart";

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
  | "lightbulb"
  | "checkmark"
  | "cross"
  | "plus"
  | "minus"
  | "leftArrow"
  | "upArrow"
  | "downArrow"
  | "doubleArrow"
  | "roundedRectangle"
  | "ellipse";

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

  // New properties for enhanced elements
  connectorFrom?: string; // ID of connected element
  connectorTo?: string; // ID of connected element
  connectorType?: "straight" | "curved" | "elbow";

  // Mind map specific
  parentNodeId?: string;
  isRootNode?: boolean;

  // Flowchart specific
  flowchartType?: "process" | "decision" | "terminator" | "data" | "connector";

  // Chart specific
  chartType?:
    | "bar"
    | "line"
    | "pie"
    | "doughnut"
    | "area"
    | "scatter"
    | "bubble"
    | "radar"
    | "polar";
  chartData?: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string | string[];
      borderWidth?: number;
      fill?: boolean;
      tension?: number;
      pointRadius?: number;
      pointHoverRadius?: number;
    }[];
  };
  chartOptions?: {
    showLegend?: boolean;
    showLabels?: boolean;
    showValues?: boolean;
    showPercentages?: boolean;
    showGrid?: boolean;
    legendPosition?: "top" | "bottom" | "left" | "right";
    colorScheme?:
      | "default"
      | "rainbow"
      | "blues"
      | "greens"
      | "reds"
      | "purple"
      | "warm"
      | "cool"
      | "professional";
    animationType?: "none" | "fade" | "slide" | "bounce" | "elastic";
    responsive?: boolean;
    maintainAspectRatio?: boolean;
  };
  chartTitle?: string;
  chartSubtitle?: string;

  // Mind Map specific
  mindMapNodeType?: "central" | "main" | "branch" | "leaf" | "floating";
  mindMapLevel?: number;
  mindMapIcon?: string;
  mindMapShape?:
    | "circle"
    | "rectangle"
    | "ellipse"
    | "hexagon"
    | "diamond"
    | "cloud"
    | "star";
  mindMapTheme?:
    | "default"
    | "business"
    | "creative"
    | "nature"
    | "tech"
    | "minimal"
    | "colorful";
  mindMapConnections?: string[]; // IDs of connected nodes
  mindMapConnectionStyle?: "straight" | "curved" | "organic" | "angular";
  mindMapConnectionColor?: string;
  mindMapConnectionThickness?: number;
  mindMapShadow?: boolean;
  mindMapGradient?: {
    enabled: boolean;
    from: string;
    to: string;
    direction: "horizontal" | "vertical" | "diagonal";
  };
  mindMapAnimation?: "none" | "pulse" | "glow" | "float" | "bounce";
  mindMapPriority?: "high" | "medium" | "low";
  mindMapTags?: string[];
  mindMapProgress?: number; // 0-100
  mindMapNotes?: string;
  mindMapAttachments?: string[];

  // Kanban specific
  kanbanStatus?:
    | "todo"
    | "in-progress"
    | "done"
    | "blocked"
    | "review"
    | "testing"
    | "archived";
  kanbanPriority?: "low" | "medium" | "high" | "urgent" | "critical";
  kanbanAssignee?: string;
  kanbanCardType?:
    | "task"
    | "bug"
    | "feature"
    | "epic"
    | "story"
    | "improvement"
    | "research";
  kanbanLabels?: string[];
  kanbanDueDate?: string;
  kanbanEstimate?: string;
  kanbanProgress?: number; // 0-100
  kanbanDescription?: string;
  kanbanChecklist?: { text: string; completed: boolean }[];
  kanbanAttachments?: string[];
  kanbanComments?: { author: string; text: string; timestamp: string }[];
  kanbanStoryPoints?: number;
  kanbanSprint?: string;
  kanbanEpic?: string;
  kanbanTheme?:
    | "default"
    | "modern"
    | "minimal"
    | "colorful"
    | "dark"
    | "professional";
  kanbanSize?: "small" | "medium" | "large" | "xl";
  kanbanCornerStyle?: "rounded" | "sharp" | "pill";
  kanbanShadow?: "none" | "small" | "medium" | "large";
  kanbanAnimation?: "none" | "hover" | "pulse" | "glow";
  kanbanTemplate?: "basic" | "detailed" | "minimal" | "professional";

  // Table specific
  tableData?: {
    headers: string[];
    rows: string[][];
  };
  tableStyle?:
    | "basic"
    | "professional"
    | "modern"
    | "minimal"
    | "corporate"
    | "creative"
    | "financial"
    | "report";
  tableTheme?:
    | "light"
    | "dark"
    | "blue"
    | "green"
    | "purple"
    | "orange"
    | "red"
    | "gradient";
  tableHeaderStyle?: "bold" | "background" | "border" | "shadow" | "gradient";
  tableBorderStyle?:
    | "all"
    | "outer"
    | "horizontal"
    | "vertical"
    | "none"
    | "custom";
  tableAlternateRows?: boolean;
  tableHoverEffect?: boolean;
  tableSortable?: boolean;
  tableSearchable?: boolean;
  tablePageSize?: number;
  tableFontSize?: "small" | "medium" | "large";
  tableColumnWidths?: number[];
  tableColumnAlignment?: ("left" | "center" | "right")[];
  tableHeaderColor?: string;
  tableHeaderTextColor?: string;
  tableRowColors?: string[];
  tableBorderColor?: string;
  tableBorderWidth?: number;
  tableTitle?: string;
  tableSubtitle?: string;
  tableFooter?: string;
  tableNotes?: string;

  // Code block specific
  codeLanguage?: "javascript" | "python" | "html" | "css" | "json" | "markdown";

  // Embed specific
  embedUrl?: string;
  embedType?: "youtube" | "twitter" | "figma" | "miro" | "notion";
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

export const IMAGE_PROMPT_STYLES = [
  "Photorealistic",
  "Cartoon",
  "Abstract",
  "Watercolor",
  "Pixel Art",
  "Sci-Fi",
  "Fantasy",
  "Minimalist",
  "Impressionistic",
] as const;
export const IMAGE_PROMPT_MOODS = [
  "Dramatic",
  "Whimsical",
  "Serene",
  "Energetic",
  "Mysterious",
  "Futuristic",
  "Nostalgic",
  "Humorous",
] as const;
export type ImagePromptStyle = (typeof IMAGE_PROMPT_STYLES)[number];
export type ImagePromptMood = (typeof IMAGE_PROMPT_MOODS)[number];

export let nextStickyNoteColorIndex = 0;
export const getNextStickyNoteColorIndex = () => {
  const currentIndex = nextStickyNoteColorIndex;
  nextStickyNoteColorIndex = (nextStickyNoteColorIndex + 1) % 4;
  return currentIndex;
};
