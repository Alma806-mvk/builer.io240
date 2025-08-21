import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  Fragment,
  useRef,
} from "react";
import "./src/styles/consistentEmoji.css";
import "./src/styles/emojiFixUnified.css";
import "./src/styles/emojiCriticalFix.css";
import "./src/styles/promptCarousel.css";
import "./src/styles/enhancedCanvas.css";
import "./src/styles/mobile-first.css";
import "./src/styles/isolatedNavbar.css";
import "./src/utils/notificationSystem";
import AppNotifications from "./src/utils/appNotifications";
import "./src/utils/appHealthMonitor";
import FirebaseErrorBoundary from "./src/components/FirebaseErrorBoundary";
import { initializeEmojiRuntimeFixer } from "./src/utils/emojiRuntimeFixer";

// Import types and constants from centralized location
import {
  Platform,
  ContentType,
  GeneratedOutput,
  GeneratedImageOutput,
  HistoryItem,
  RefinementType,
  Source,
  ImagePromptStyle,
  ImagePromptMood,
  GeneratedTextOutput,
  PromptTemplate,
  SeoKeywordMode,
  SeoIntensity,
  ABTestableContentType,
  ABTestVariation,
  ThumbnailConceptOutput,
  AiPersona,
  AiPersonaDefinition,
  DefaultAiPersonaEnum,
  Language,
  AspectRatioGuidance,
  PromptOptimizationSuggestion,
  ContentBriefOutput,
  PollQuizOutput,
  ReadabilityOutput,
  QuizQuestion,
  PollQuestion,
  CanvasItem,
  CanvasItemType,
  ShapeVariant,
  LineStyle,
  FontFamily,
  FontWeight,
  FontStyle,
  TextDecoration,
  ContentStrategyPlanOutput,
  ContentStrategyPillar,
  ContentStrategyTheme,
  ContentStrategyScheduleItem,
  EngagementFeedbackOutput,
  TrendAnalysisOutput,
  TrendItem,
  CalendarEvent,
  CanvasSnapshot,
  ParsedChannelAnalysisSection,
} from "./types";

import {
  PLATFORMS,
  USER_SELECTABLE_CONTENT_TYPES,
  DEFAULT_USER_INPUT_PLACEHOLDERS,
  BATCH_SUPPORTED_TYPES,
  TEXT_ACTION_SUPPORTED_TYPES,
  HASHTAG_GENERATION_SUPPORTED_TYPES,
  SNIPPET_EXTRACTION_SUPPORTED_TYPES,
  REPURPOSING_SUPPORTED_TYPES,
  IMAGE_PROMPT_STYLES,
  IMAGE_PROMPT_MOODS,
  CONTENT_TYPES,
  AB_TESTABLE_CONTENT_TYPES_MAP,
  VISUAL_STORYBOARD_SUPPORTED_TYPES,
  EXPLAIN_OUTPUT_SUPPORTED_TYPES,
  FOLLOW_UP_IDEAS_SUPPORTED_TYPES,
  SEO_KEYWORD_SUGGESTION_SUPPORTED_TYPES,
  MULTI_PLATFORM_REPURPOSING_SUPPORTED_TYPES,
  VIDEO_EDITING_EXTENSIONS,
  DEFAULT_AI_PERSONAS,
  SUPPORTED_LANGUAGES,
  ASPECT_RATIO_GUIDANCE_OPTIONS,
  YOUTUBE_DESCRIPTION_OPTIMIZER_SUPPORTED_TYPES,
  TRANSLATE_ADAPT_SUPPORTED_TYPES,
  READABILITY_CHECK_SUPPORTED_TYPES,
  CANVAS_SHAPE_VARIANTS,
  CANVAS_FONT_FAMILIES,
  CANVAS_PRESET_COLORS,
  ENGAGEMENT_FEEDBACK_SUPPORTED_TYPES,
  PLATFORM_COLORS,
} from "./constants";

// Import modular components
import GlobalErrorHandlers from "./src/components/GlobalErrorHandlers";
import AppStateManager from "./src/components/AppStateManager";
import GenerationHandlers from "./src/components/GenerationHandlers";
import { StudioSidebar } from "./src/components/StudioSidebar";
import { SidebarProvider } from "./src/components/ui/sidebar";
import useScreenSize from "./src/hooks/useScreenSize";
import SettingsPage from "./src/components/SettingsPage";
import MobileBottomNavigation from "./src/components/mobile/MobileBottomNavigation";
import MobileHeader from "./src/components/mobile/MobileHeader";
import MobileFloatingActionButton from "./src/components/mobile/MobileFloatingActionButton";
import AppHeader from "./src/components/layout/AppHeader";
import { GlobalCommandPalette } from "./src/components/GlobalCommandPalette";
import GeneratorSection from "./src/components/GeneratorSection";
import CreditDisplay from "./src/components/CreditDisplay";
import HeaderCreditDisplay from "./src/components/HeaderCreditDisplay";
import CanvasCollaborationIntegration from "./src/components/canvas/CanvasCollaborationIntegration";
import { useCredits } from "./src/context/CreditContext";
import { AccountPageUnified } from "./src/components/AccountPageUnified";
import { BillingPageUnified } from "./src/components/BillingPageUnified";
import { Button } from "./src/components/ui/button";
import RatingButtons from "./src/components/ui/RatingButtons";
import { enhancedHistoryService } from "./src/services/enhancedHistoryService";

// Import existing services and components
import {
  generateTextContent,
  generateImage,
  performWebSearch,
} from "./services/geminiService";
import { firebaseIntegratedGenerationService } from "./src/services/firebaseIntegratedGenerationService";
import {
  truncateText,
  parseJsonSafely,
  isGeneratedTextOutput,
  isGeneratedImageOutput,
  isContentStrategyPlanOutput,
  isEngagementFeedbackOutput,
  isTrendAnalysisOutput,
  MAX_HISTORY_ITEMS,
  LOCAL_STORAGE_HISTORY_KEY,
  LOCAL_STORAGE_TEMPLATES_KEY,
  LOCAL_STORAGE_CUSTOM_PERSONAS_KEY,
  LOCAL_STORAGE_TREND_ANALYSIS_QUERIES_KEY,
  LOCAL_STORAGE_CALENDAR_EVENTS_KEY,
  LOCAL_STORAGE_CANVAS_SNAPSHOTS_KEY,
  LOCAL_STORAGE_CANVAS_ITEMS_KEY,
  LOCAL_STORAGE_CANVAS_VIEW_KEY,
  LOCAL_STORAGE_CANVAS_HISTORY_KEY,
  CHANNEL_ANALYSIS_HEADINGS,
} from "./src/components/AppUtilities";
import { generateMockContent } from "./src/services/mockGeminiService";
import premiumGeminiService from "./services/premiumGeminiService";
import { subscribeToThumbnailNotifications } from "./src/services/emailSubscriptionService";
// Import the entire service module to ensure global functions are exposed
import "./src/services/emailSubscriptionService";
import LoadingSpinner from "./components/LoadingSpinner";
import GeneratingContent from "./src/components/GeneratingContent";
import ResponsiveFeatureCards from "./src/components/ResponsiveFeatureCards";
import EnhancedThumbnailMaker from "./src/components/EnhancedThumbnailMaker";
import EnhancedWebSearch from "./src/components/EnhancedWebSearch";
import ProfessionalCalendar from "./src/components/ProfessionalCalendar";
import "./src/styles/professionalCalendar.css";
import "./src/styles/enhancedEventModal.css";
import "./src/services/calendarReminderService";
import ProgressNotification, {
  useGenerationProgress,
} from "./src/components/ProgressNotification";
import StrategyWorldClass from "./src/components/StrategyWorldClass";
import HistoryIntegration from "./src/components/HistoryIntegration";
import { PremiumContentStrategy } from "./src/components/PremiumContentStrategy";
import TrendsWorldClass from "./src/components/TrendsWorldClass";

// Modern Studio Layout Components (standalone pages only)
import ProfilePageStudio from "./src/components/ProfilePageStudio";
import BillingPageStudio from "./src/components/BillingPageStudio";
import { PremiumTrendAnalysis } from "./src/components/PremiumTrendAnalysis";
import { generateStrategyMindMap, convertMindMapToCanvasItems } from "./src/utils/strategyMindMapGenerator";
import { TrendAnalyticsDashboard } from "./src/components/TrendAnalyticsDashboard";
import { TrendRecommendations } from "./src/components/TrendRecommendations";
import YouTubeStatsWorldClass from "./src/components/YouTubeStatsWorldClass";
import { TrendMonitoring } from "./src/components/TrendMonitoring";
import { TrendComparison } from "./src/components/TrendComparison";
import GenerateDropdown from "./src/components/GenerateDropdown";
import { TrendReporting } from "./src/components/TrendReporting";
import { TeamCollaboration } from "./src/components/TeamCollaboration";
import { PremiumUpgrade } from "./src/components/PremiumUpgrade";
import MultiGenerationManager from "./src/components/MultiGenerationManager";
import MultiGenerationWidget from "./src/components/MultiGenerationWidget";
import StudioHub from "./src/components/StudioHub";
import StudioHubWorldClass from "./src/components/StudioHubWorldClass";
import ThumbnailsWorldClass from "./src/components/ThumbnailsWorldClass";
import YouTubeAnalysisWorldClass from "./src/components/YouTubeAnalysisWorldClass";
import CalendarWorldClass from "./src/components/CalendarWorldClass";
import CreativityWorldClass from "./src/components/CreativityWorldClass";
import { signOut } from "firebase/auth";
import { auth } from "./src/config/firebase";
import { useSubscription } from "./src/context/SubscriptionContext";
import { useAuth } from "./src/context/AuthContext";
import { useTheme } from "./src/context/ThemeContext";
import Paywall from "./src/components/Paywall";
import { GeneratorAppStyled } from "./src/components/GeneratorAppStyled";
import AdvancedTemplateManager from "./src/components/AdvancedTemplateManager";
import GeneratorWorldClass from "./src/components/GeneratorWorldClass";
import CustomPersonaModal from "./src/components/CustomPersonaModal";
import CustomPersonaManager from "./src/components/CustomPersonaManager";
import "./src/components/GeneratorLayout.css";
import FreeCreditsPopup from "./src/components/FreeCreditsPopup";
import "./src/components/FreeCreditsPopup.css";
import PremiumYouTubeAnalysis from "./src/components/PremiumYouTubeAnalysis";
import {
  SparklesIcon,
  ClipboardIcon,
  LightBulbIcon,
  FilmIcon,
  TagIcon,
  PhotoIcon,
  TrashIcon,
  RotateCcwIcon,
  HashtagIcon,
  WandIcon,
  ListChecksIcon,
  UsersIcon,
  RefreshCwIcon,
  SearchIcon,
  EditIcon,
  StarIcon,
  FileTextIcon,
  HelpCircleIcon,
  Share2Icon,
  KeyIcon,
  FilmStripIcon,
  RepeatIcon,
  ColumnsIcon,
  SaveIcon,
  BookOpenIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PlusCircleIcon,
  MinusCircleIcon,
  BrainIcon,
  LinkIcon,
  ArrowUpRightIcon,
  ArrowDownLeftIcon,
  SlidersHorizontalIcon,
  MessageSquareIcon,
  GlobeAltIcon,
  UserCircleIcon,
  CreditCardIcon,
  ClipboardDocumentListIcon,
  QuestionMarkCircleIcon,
  SearchCircleIcon,
  PlayCircleIcon,
  LanguageIcon,
  ScaleIcon,
  ViewfinderCircleIcon,
  ChatBubbleLeftRightIcon,
  MicrophoneIcon,
  PinIcon,
  SmileIcon,
  StickyNoteIcon,
  TypeToolIcon,
  ShapesIcon,
  PenToolIcon,
  MindMapIcon,
  ChartIcon,
  KanbanIcon,
  TableIconSVG,
  CodeBlockIcon,
  ConnectorIcon,
  TextToolIcon,
  ShapeToolIcon,
  FrameIcon,
  ArrowUpTrayIcon,
  RectangleIcon,
  CircleIcon,
  TriangleIcon as TriangleShapeIcon,
  RightArrowIcon as RightArrowShapeIcon,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  FontIcon,
  CalendarDaysIcon,
  StarShapeIcon,
  SpeechBubbleShapeIcon,
  TrendingUpIcon,
  CameraIcon,
  DownloadIcon,
  CompassIcon,
  ChartBarIcon,
  EyeIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  VideoCameraIcon,
  AcademicCapIcon,
  RadioIcon,
  RocketLaunchIcon,
} from "./src/components/IconComponents";

// Professional icons for header components
import {
  UserIcon,
  CreditCardIcon as ProfessionalCreditCardIcon,
  ChevronDownIcon as ProfessionalChevronDownIcon,
  GeneratorIcon,
} from "./src/components/ProfessionalIcons";
import {
  Bell as BellIcon,
  Search as LucideSearchIcon,
  Settings as SettingsIcon,
  Crown as CrownIcon,
  Gem as GemIcon,
  LogOut as ExitIcon,
  Brain,
  Home
} from "lucide-react";

import html2canvas from "html2canvas";
import PremiumCanvasEnhancement from "./src/components/PremiumCanvasEnhancement";
import InteractiveCanvasFoundation from "./src/components/canvas/InteractiveCanvasFoundation";
import HighPerformanceCanvas from "./src/components/canvas/HighPerformanceCanvas";
import CanvasWorldClass from "./src/components/CanvasWorldClass";
import CanvasFoundationDemo from "./src/components/CanvasFoundationDemo";
import PremiumModalManager, {
  setGlobalNavigateToBilling,
} from "./src/components/PremiumModalManager";
import { safeParseText } from "./src/utils/textUtils";

type ActiveTab =
  | "generator"
  | "canvas"
  | "channelAnalysis"
  | "history"
  | "search"
  | "strategy"
  | "calendar"
  | "trends"
  | "youtubeStats"
  | "thumbnailMaker"
  | "studioHub"
  | "account"
  | "settings";

interface YoutubeStatsEntry {
  id: string;
  timestamp: number;
  userInput: string;
  content: string;
}

interface ChannelTableEntry {
  id: string;
  channelName: string;
  subscribers: number;
  videos: number;
  totalViews: number;
  averageViewsPerVideo: number;
}

interface ExpandedIdea {
  ideaNumber: number;
  originalIdea: string;
  expandedContent: string;
  isExpanding: boolean;
}

interface IdeaExpansionState {
  [outputId: string]: {
    [ideaNumber: number]: ExpandedIdea;
  };
}

interface IdeaCollapseState {
  [outputId: string]: {
    [ideaNumber: number]: boolean; // true = collapsed, false/undefined = expanded
  };
}

const APP_STICKY_NOTE_COLORS = [
  { backgroundColor: "#FEF3C7", color: "#78350F" },
  { backgroundColor: "#FCE7F3", color: "#9D174D" },
  { backgroundColor: "#DBEAFE", color: "#1E3A8A" },
  { backgroundColor: "#D1FAE5", color: "#064E3B" },
  { backgroundColor: "#EDE9FE", color: "#5B21B6" },
  { backgroundColor: "#F3F4F6", color: "#1F2937" },
];

const TOOLBAR_STICKY_NOTE_PICKER_COLORS = [
  {
    name: "Yellow",
    bgColor: APP_STICKY_NOTE_COLORS[0].backgroundColor,
    borderColor: "#FDE68A",
    selectedRing: "ring-yellow-400",
  },
  {
    name: "Pink",
    bgColor: APP_STICKY_NOTE_COLORS[1].backgroundColor,
    borderColor: "#FBCFE8",
    selectedRing: "ring-pink-400",
  },
  {
    name: "Blue",
    bgColor: APP_STICKY_NOTE_COLORS[2].backgroundColor,
    borderColor: "#BFDBFE",
    selectedRing: "ring-blue-400",
  },
  {
    name: "Green",
    bgColor: APP_STICKY_NOTE_COLORS[3].backgroundColor,
    borderColor: "#A7F3D0",
    selectedRing: "ring-green-400",
  },
  {
    name: "Purple",
    bgColor: APP_STICKY_NOTE_COLORS[4].backgroundColor,
    borderColor: "#DDD6FE",
    selectedRing: "ring-purple-400",
  },
  {
    name: "Gray",
    bgColor: APP_STICKY_NOTE_COLORS[5].backgroundColor,
    borderColor: "#E5E7EB",
    selectedRing: "ring-gray-400",
  },
];

const MIN_CANVAS_ITEM_WIDTH = 50;
const MIN_CANVAS_ITEM_HEIGHT = 30;
const MIN_CANVAS_IMAGE_SIZE = 50;
const DEFAULT_SHAPE_FILL_COLOR = "#3B82F6";
const DEFAULT_SHAPE_BORDER_COLOR = "#60A5FA";
const DEFAULT_TEXT_ELEMENT_COLOR = "#E0E7FF";
const DEFAULT_FONT_FAMILY: FontFamily = "Georgia";
const DEFAULT_FONT_SIZE = "16px";
const MAX_CANVAS_HISTORY_STATES = 30;

interface CanvasHistoryEntry {
  items: CanvasItem[];
  nextZIndex: number;
  canvasOffset: { x: number; y: number };
  zoomLevel: number;
}

const parseChannelAnalysisOutput = (
  text: string | any,
  groundingSources?: Source[],
): ParsedChannelAnalysisSection[] => {
  const sections: ParsedChannelAnalysisSection[] = [];

  // Safety check and type conversion for text
  if (!text) {
    console.warn("parseChannelAnalysisOutput: No text provided");
    return sections;
  }

  // Ensure text is a string
  let fullText: string;
  if (typeof text === "string") {
    fullText = text;
  } else if (typeof text === "object" && text.text) {
    fullText = text.text;
  } else {
    console.warn(
      "parseChannelAnalysisOutput: Invalid text type:",
      typeof text,
      text,
    );
    fullText = String(text);
  }

  // Additional safety check
  if (!fullText || typeof fullText.indexOf !== "function") {
    console.error(
      "parseChannelAnalysisOutput: fullText is not a valid string",
      fullText,
    );
    return sections;
  }

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

interface AppProps {
  onSignInRequired?: () => void;
  onNavigateToBilling?: () => void;
  onNavigateToAccount?: () => void;
  onShowAuth?: () => void;
}

export const App = ({
  onSignInRequired,
  onNavigateToBilling,
  onNavigateToAccount,
  onShowAuth,
}: AppProps = {}): JSX.Element => {
  // Screen size detection for mobile experience
  const { isMobile } = useScreenSize();

  // Add error handler for targetAudience2 initialization error
  React.useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      if (event.message && event.message.includes('targetAudience2')) {
        console.error('🐛 Caught targetAudience2 error:', {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack
        });
        event.preventDefault(); // Prevent the error from crashing the app
        return true;
      }
    };

    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  const { user } = useAuth();
  const {
    canGenerate,
    canUseFeature,
    incrementUsage,
    billingInfo,
    needsSignInForGenerations,
    refreshBilling,
  } = useSubscription();
  const { deductCredits, canAfford, credits, totalCredits } = useCredits();
  const { themeConfig } = useTheme();

  // Set global navigation function for premium modal
  React.useEffect(() => {
    if (onNavigateToBilling) {
      setGlobalNavigateToBilling(onNavigateToBilling);
    }
  }, [onNavigateToBilling]);
  const [platform, setPlatform] = useState<Platform>(Platform.YouTube);
  const [contentType, setContentType] = useState<ContentType>(
    USER_SELECTABLE_CONTENT_TYPES[0].value,
  );
  // Active tab state (needed for computed values below)
  const [activeTab, setActiveTab] = useState<ActiveTab>("studioHub");
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  // Page navigation state for Account and Billing pages
  const [currentPage, setCurrentPage] = useState<"app" | "account" | "billing">("app");

  // Navigation handlers for Account and Billing pages
  const handleNavigateToAccount = () => setCurrentPage("account");
  const handleNavigateToBilling = () => setCurrentPage("billing");
  const handleBackToApp = () => setCurrentPage("app");

  const [canvasItemDropdown, setCanvasItemDropdown] = useState<string | null>(
    null,
  );
  const [dropdownPosition, setDropdownPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const dropdownButtonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Separate input states for each tab
  const [generatorInput, setGeneratorInput] = useState<string>("");
  const [youtubeStatsInput, setYoutubeStatsInput] = useState<string>("");

  // Prompt builder state
  const [showGuidedBuilder, setShowGuidedBuilder] = useState<boolean>(false);

  // Strategy creation modal state
  const [showStrategyModal, setShowStrategyModal] = useState<boolean>(false);

  // Legacy userInput for backward compatibility - now computed based on active tab
  const userInput =
    activeTab === "youtubeStats" ? youtubeStatsInput : generatorInput;
  const setUserInput =
    activeTab === "youtubeStats" ? setYoutubeStatsInput : setGeneratorInput;

  // Enhanced tab state persistence - stores complete tab state including inputs and outputs
  const [tabStates, setTabStates] = useState<Record<ActiveTab, {
    inputs?: any;
    outputs?: any;
    loading?: boolean;
    error?: string | null;
    lastUpdated?: Date;
  }>>(() => {
    // Try to restore from localStorage on app start
    try {
      const saved = localStorage.getItem('creategen_tab_states');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Convert lastUpdated strings back to Date objects
        Object.keys(parsed).forEach(tab => {
          if (parsed[tab].lastUpdated) {
            parsed[tab].lastUpdated = new Date(parsed[tab].lastUpdated);
          }
        });
        return {
          generator: { inputs: null, outputs: null },
          canvas: { inputs: null, outputs: null },
          channelAnalysis: { inputs: null, outputs: null },
          youtubeStats: { inputs: null, outputs: null },
          thumbnailMaker: { inputs: null, outputs: null },
          strategy: { inputs: null, outputs: null },
          calendar: { inputs: null, outputs: null },
          trends: { inputs: null, outputs: null },
          history: { inputs: null, outputs: null },
          search: { inputs: null, outputs: null },
          studioHub: { inputs: null, outputs: null },
          ...parsed
        };
      }
    } catch (error) {
      console.warn('Failed to restore tab states from localStorage:', error);
    }

    return {
      generator: { inputs: null, outputs: null },
      canvas: { inputs: null, outputs: null },
      channelAnalysis: { inputs: null, outputs: null },
      youtubeStats: { inputs: null, outputs: null },
      thumbnailMaker: { inputs: null, outputs: null },
      strategy: { inputs: null, outputs: null },
      calendar: { inputs: null, outputs: null },
      trends: { inputs: null, outputs: null },
      history: { inputs: null, outputs: null },
      search: { inputs: null, outputs: null },
      studioHub: { inputs: null, outputs: null },
    };
  });

  // Save tab states to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('creategen_tab_states', JSON.stringify(tabStates));
      console.log('�� Tab states saved to localStorage:', {
        trends: !!tabStates.trends?.outputs,
        channelAnalysis: !!tabStates.channelAnalysis?.outputs,
        trendsInputs: !!tabStates.trends?.inputs,
        channelInputs: !!tabStates.channelAnalysis?.inputs
      });
    } catch (error) {
      console.warn('Failed to save tab states to localStorage:', error);
    }
  }, [tabStates]);

  // Helper function to update tab state
  const updateTabState = useCallback((tab: ActiveTab, updates: Partial<{
    inputs: any;
    outputs: any;
    loading: boolean;
    error: string | null;
  }>) => {
    setTabStates(prev => ({
      ...prev,
      [tab]: {
        ...prev[tab],
        ...updates,
        lastUpdated: new Date()
      }
    }));
  }, []);

  // Separate output states for each tab to maintain persistence (legacy compatibility)
  const [tabOutputs, setTabOutputs] = useState<Record<ActiveTab, any>>(() => {
    const outputs: Record<ActiveTab, any> = {
      generator: null,
      canvas: null,
      channelAnalysis: null,
      youtubeStats: null,
      thumbnailMaker: null,
      strategy: null,
      calendar: null,
      trends: null,
      history: null,
      search: null,
      studioHub: null,
    };

    // Restore outputs from tabStates
    Object.keys(outputs).forEach(tab => {
      if (tabStates[tab as ActiveTab]?.outputs) {
        outputs[tab as ActiveTab] = tabStates[tab as ActiveTab].outputs;
      }
    });

    return outputs;
  });

  // Legacy generatedOutput for backward compatibility - now computed based on active tab
  const generatedOutput = tabOutputs[activeTab];
  const setGeneratedOutput = (output: any) => {
    setTabOutputs((prev) => ({
      ...prev,
      [activeTab]: output,
    }));

    // Also update the enhanced tab state
    updateTabState(activeTab, { outputs: output });
  };

  const [expandedIdeas, setExpandedIdeas] = useState<IdeaExpansionState>({});
  const [collapsedIdeas, setCollapsedIdeas] = useState<IdeaCollapseState>({});
  const [isExpandingIdea, setIsExpandingIdea] = useState<boolean>(false);

  // Clear expanded ideas when switching tabs to avoid confusion
  useEffect(() => {
    setExpandedIdeas({});
    setCollapsedIdeas({});
  }, [activeTab]);

  // Function to clear tab state
  const clearTabState = useCallback((tab: ActiveTab) => {
    setTabStates(prev => ({
      ...prev,
      [tab]: { inputs: null, outputs: null, loading: false, error: null }
    }));
  }, []);

  const handleCollapseIdea = (ideaNumber: number) => {
    const outputId = displayedOutputItem?.id || `${activeTab}-current`;

    setCollapsedIdeas((prev) => ({
      ...prev,
      [outputId]: {
        ...prev[outputId],
        [ideaNumber]: true,
      },
    }));
  };

  const handleShowIdea = (ideaNumber: number) => {
    const outputId = displayedOutputItem?.id || `${activeTab}-current`;

    setCollapsedIdeas((prev) => ({
      ...prev,
      [outputId]: {
        ...prev[outputId],
        [ideaNumber]: false,
      },
    }));
  };

  // Separate loading states for each tab
  const [isGeneratorLoading, setIsGeneratorLoading] = useState<boolean>(false);
  const [isYoutubeStatsLoading, setIsYoutubeStatsLoading] =
    useState<boolean>(false);

  // Legacy isLoading for backward compatibility - now computed based on active tab
  const isLoading =
    activeTab === "youtubeStats"
      ? isYoutubeStatsLoading
      : activeTab === "generator"
        ? isGeneratorLoading
        : false;
  const setIsLoading =
    activeTab === "youtubeStats"
      ? setIsYoutubeStatsLoading
      : activeTab === "generator"
        ? setIsGeneratorLoading
        : () => {}; // no-op for other tabs

  const [error, setError] = useState<string | null>(null);

  // Track which tab initiated generation
  const [generationSourceTab, setGenerationSourceTab] =
    useState<ActiveTab | null>(null);
  const [generationStartTime, setGenerationStartTime] = useState<Date | null>(
    null,
  );
  const [showFreeCreditsPopup, setShowFreeCreditsPopup] =
    useState<boolean>(false);

  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Course-specific state variables
  const [courseModules, setCourseModules] = useState<number>(5);
  const [courseDuration, setCourseDuration] = useState<string>("4-6 weeks");
  const [courseDifficulty, setCourseDifficulty] = useState<string>("Beginner");
  const [includeAssessments, setIncludeAssessments] = useState<boolean>(true);
  const [courseObjectives, setCourseObjectives] = useState<string>("");

  // Enhanced monetization state variables
  const [coursePriceRange, setCoursePriceRange] = useState<string>("$297-$497");
  const [courseTargetAudience, setCourseTargetAudience] = useState<string>("");
  const [includeMarketing, setIncludeMarketing] = useState<boolean>(true);
  const [includeBonuses, setIncludeBonuses] = useState<boolean>(true);
  const [includeUpsells, setIncludeUpsells] = useState<boolean>(true);

  const [showUserMenu, setShowUserMenu] = useState(false);

  // Command palette floating button toggle (default: hidden)
  const [showFloatingCommandButton, setShowFloatingCommandButton] = useState(() => {
    return localStorage.getItem('showFloatingCommandButton') === 'true';
  });

  // Header scroll state for auto-hide functionality
  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Progress notification for content generation
  const {
    steps: generationSteps,
    isGenerating,
    currentStepId,
    startTime,
    startGeneration,
    updateStep,
    completeStep,
    finishGeneration,
  } = useGenerationProgress();

  // Premium subscription context (billingInfo already available from useSubscription above)

  const [targetAudience, setTargetAudience] = useState<string>("");
  const [batchVariations, setBatchVariations] = useState<number>(2);
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [showTemplateModal, setShowTemplateModal] = useState<boolean>(false);
  const [currentTemplate, setCurrentTemplate] = useState<PromptTemplate | null>(
    null,
  );
  const [viewingHistoryItemId, setViewingHistoryItemId] = useState<
    string | null
  >(null);

  const [selectedImageStyles, setSelectedImageStyles] = useState<
    ImagePromptStyle[]
  >([]);
  const [selectedImageMoods, setSelectedImageMoods] = useState<
    ImagePromptMood[]
  >([]);
  const [negativeImagePrompt, setNegativeImagePrompt] = useState<string>("");

  const [showRefineOptions, setShowRefineOptions] = useState<boolean>(false);
  const [showTextActionOptions, setShowTextActionOptions] =
    useState<boolean>(false);

  const [seoKeywords, setSeoKeywords] = useState<string>("");
  const [seoMode, setSeoMode] = useState<SeoKeywordMode>(
    SeoKeywordMode.Incorporate,
  );
  const [seoIntensity, setSeoIntensity] = useState<SeoIntensity>(
    SeoIntensity.Moderate,
  );

  const [isABTesting, setIsABTesting] = useState<boolean>(false);
  const [abTestType, setAbTestType] = useState<
    ABTestableContentType | undefined
  >(undefined);
  const [abTestResults, setAbTestResults] = useState<
    ABTestVariation<GeneratedTextOutput | ThumbnailConceptOutput>[] | null
  >(null);

  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [includeCTAs, setIncludeCTAs] = useState(false);

  const [customAiPersonas, setCustomAiPersonas] = useState<
    AiPersonaDefinition[]
  >([]);
  const [selectedAiPersonaId, setSelectedAiPersonaId] = useState<string>(
    DEFAULT_AI_PERSONAS[0].id,
  );
  const [showPersonaModal, setShowPersonaModal] = useState<boolean>(false);
  const [isAiPersonaModalOpen, setIsAiPersonaModalOpen] =
    useState<boolean>(false);
  const [editingPersona, setEditingPersona] =
    useState<AiPersonaDefinition | null>(null);
  const [showCustomPersonaManager, setShowCustomPersonaManager] =
    useState<boolean>(false);

  // Premium feature states
  const [selectedPremiumTemplate, setSelectedPremiumTemplate] =
    useState<any>(null);
  const [selectedCustomPersona, setSelectedCustomPersona] = useState<any>(null);
  const [premiumSEOConfig, setPremiumSEOConfig] = useState<any>(null);
  const [aiBoostEnabled, setAiBoostEnabled] = useState<boolean>(false);

  const [targetLanguage, setTargetLanguage] = useState<Language>(
    Language.English,
  );
  const [aspectRatioGuidance, setAspectRatioGuidance] =
    useState<AspectRatioGuidance>(AspectRatioGuidance.None);

  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);

  // Search-related state moved to EnhancedWebSearch component

  const [channelAnalysisInput, setChannelAnalysisInput] = useState<string>("");
  const [parsedChannelAnalysis, setParsedChannelAnalysis] = useState<
    ParsedChannelAnalysisSection[] | null
  >(null);
  const [channelAnalysisSummary, setChannelAnalysisSummary] = useState<
    string | null
  >(null);
  const [isAnalyzingChannel, setIsAnalyzingChannel] = useState<boolean>(false);
  const [channelAnalysisProgress, setChannelAnalysisProgress] = useState<{
    current: number;
    total: number;
    currentChannel: string;
  } | null>(null);
  const [channelAnalysisError, setChannelAnalysisError] = useState<
    string | null
  >(null);
  const [detailedAnalysisSection, setDetailedAnalysisSection] =
    useState<ParsedChannelAnalysisSection | null>(null);
  const [isSummarizingChannelAnalysis, setIsSummarizingChannelAnalysis] =
    useState(false);

  const [strategyNiche, setStrategyNiche] = useState("");
  const [strategyAudience, setStrategyAudience] = useState("");
  const [strategyGoals, setStrategyGoals] = useState<string[]>([]);
  const [strategyPlatforms, setStrategyPlatforms] = useState<Platform[]>([]);
  const [strategyTimeframe, setStrategyTimeframe] = useState<
    "1month" | "3months" | "6months" | "1year"
  >("3months");
  const [strategyBudget, setStrategyBudget] = useState<
    "low" | "medium" | "high" | "enterprise"
  >("medium");
  const [strategyContentTypes, setStrategyContentTypes] = useState<string[]>(
    [],
  );
  const [strategyCompetitorAnalysis, setStrategyCompetitorAnalysis] =
    useState(false);
  const [strategyAiPersona, setStrategyAiPersona] = useState("expert");
  const [strategyIndustryFocus, setStrategyIndustryFocus] = useState("");
  const [strategyGeographicFocus, setStrategyGeographicFocus] = useState<
    string[]
  >([]);
  const [strategyLanguagePreferences, setStrategyLanguagePreferences] =
    useState<string[]>(["English"]);
  const [strategyShowAdvancedOptions, setStrategyShowAdvancedOptions] =
    useState(false);
  const [strategySelectedTemplate, setStrategySelectedTemplate] = useState<
    string | null
  >(null);
  const [generatedStrategyPlan, setGeneratedStrategyPlan] =
    useState<ContentStrategyPlanOutput | null>(null);
  const [isGeneratingStrategy, setIsGeneratingStrategy] = useState(false);
  const [strategyGenerationStartTime, setStrategyGenerationStartTime] =
    useState<Date | null>(null);
  const [savedStrategies, setSavedStrategies] = useState<any[]>([]);
  const [allGeneratedStrategies, setAllGeneratedStrategies] = useState<{
    id: string;
    name: string;
    createdAt: Date;
    strategy: ContentStrategyPlanOutput;
    niche?: string;
    config?: any;
  }[]>([]);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [strategyError, setStrategyError] = useState<string | null>(null);

  // Thumbnail notification state
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationEmail, setNotificationEmail] = useState("");
  const [notificationFirstName, setNotificationFirstName] = useState("");
  const [notificationLastName, setNotificationLastName] = useState("");
  const [notificationSubmitted, setNotificationSubmitted] = useState(false);
  const [notificationError, setNotificationError] = useState<string | null>(
    null,
  );

  // Web search notification state
  const [showWebSearchNotificationModal, setShowWebSearchNotificationModal] =
    useState(false);
  const [webSearchNotificationEmail, setWebSearchNotificationEmail] =
    useState("");
  const [webSearchNotificationFirstName, setWebSearchNotificationFirstName] =
    useState("");
  const [webSearchNotificationLastName, setWebSearchNotificationLastName] =
    useState("");
  const [webSearchNotificationSubmitted, setWebSearchNotificationSubmitted] =
    useState(false);
  const [webSearchNotificationError, setWebSearchNotificationError] = useState<
    string | null
  >(null);

  // Thumbnail preview modal state
  const [showThumbnailPreview, setShowThumbnailPreview] = useState(false);

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<Date | null>(
    null,
  );
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingCalendarEvent, setEditingCalendarEvent] =
    useState<Partial<CalendarEvent> | null>(null);

  const [trendNicheQuery, setTrendNicheQuery] = useState("");
  const [generatedTrendAnalysis, setGeneratedTrendAnalysis] =
    useState<TrendAnalysisOutput | null>(null);
  const [isAnalyzingTrends, setIsAnalyzingTrends] = useState(false);
  const [trendAnalysisError, setTrendAnalysisError] = useState<string | null>(
    null,
  );
  const [recentTrendQueries, setRecentTrendQueries] = useState<string[]>([]);
  const [trendsInitialQuery, setTrendsInitialQuery] = useState<string>("");
  const [generatedThumbnailBackground, setGeneratedThumbnailBackground] =
    useState<string | null>(null);

  // Premium subscription state
  const [userPlan, setUserPlan] = useState<"free" | "creator pro" | "agency pro" | "enterprise">(
    "free",
  );

  // Calculate premium status based on billing info AND developer toggle
  const isPremium = useMemo(() => {
    // Dev mode: Orange button controls ALL premium features
    const devForcesPremium = localStorage.getItem("dev_force_premium") === "true" ||
                            localStorage.getItem("emergency_premium") === "true";

    // Any paid plan or dev override enables ALL premium features
    return devForcesPremium ||
           billingInfo?.status === "active" ||
           userPlan !== "free";
  }, [billingInfo?.status, userPlan]);
  const [trendAnalysisTabMode, setTrendAnalysisTabMode] = useState<
    | "analysis"
    | "dashboard"
    | "recommendations"
    | "monitoring"
    | "comparison"
    | "reporting"
    | "team"
  >("analysis");

  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([]);
  const [draggingItem, setDraggingItem] = useState<{
    id: string;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const [resizingItem, setResizingItem] = useState<{
    id: string;
    handle: "br";
    initialMouseX: number;
    initialMouseY: number;
    initialWidth: number;
    initialHeight: number;
  } | null>(null);
  const [selectedCanvasItemId, setSelectedCanvasItemId] = useState<
    string | null
  >(null);
  const [nextZIndex, setNextZIndex] = useState(1);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPosition, setLastPanPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [selectedStickyColorIndex, setSelectedStickyColorIndex] = useState(0);
  const [showShapeDropdown, setShowShapeDropdown] = useState(false);
  const [showMindMapTemplates, setShowMindMapTemplates] = useState(false);
  const [showTableTemplates, setShowTableTemplates] = useState(false);
  const [showKanbanTemplates, setShowKanbanTemplates] = useState(false);
  const shapeDropdownRef = useRef<HTMLDivElement>(null);

  const [isCanvasImageModalOpen, setIsCanvasImageModalOpen] = useState(false);
  const [canvasImageModalPrompt, setCanvasImageModalPrompt] = useState("");
  const [canvasImageModalNegativePrompt, setCanvasImageModalNegativePrompt] =
    useState("");
  const [canvasImageModalAspectRatio, setCanvasImageModalAspectRatio] =
    useState(AspectRatioGuidance.None);
  const [canvasImageModalStyles, setCanvasImageModalStyles] = useState<
    ImagePromptStyle[]
  >([]);
  const [canvasImageModalMoods, setCanvasImageModalMoods] = useState<
    ImagePromptMood[]
  >([]);
  const [isGeneratingCanvasImage, setIsGeneratingCanvasImage] = useState(false);
  const [canvasImageError, setCanvasImageError] = useState<string | null>(null);

  const [canvasHistory, setCanvasHistory] = useState<CanvasHistoryEntry[]>([]);
  const [currentCanvasHistoryIndex, setCurrentCanvasHistoryIndex] =
    useState<number>(-1);
  const [canvasSnapshots, setCanvasSnapshots] = useState<CanvasSnapshot[]>([]);
  const [showSnapshotModal, setShowSnapshotModal] = useState(false);

  // Canvas Tool States
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showStylePresets, setShowStylePresets] = useState(false);
  const [brushToolActive, setBrushToolActive] = useState(false);
  const [isMindMapAnimating, setIsMindMapAnimating] = useState(false);

  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isRepurposeModalOpen, setIsRepurposeModalOpen] = useState(false);
  const [isMultiPlatformModalOpen, setIsMultiPlatformModalOpen] =
    useState(false);
  const [isPromptOptimizerModalOpen, setIsPromptOptimizerModalOpen] =
    useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  const [repurposeTargetPlatform, setRepurposeTargetPlatform] = useState(
    PLATFORMS[0],
  );
  const [repurposeTargetContentType, setRepurposeTargetContentType] = useState(
    ContentType.Idea,
  );
  const [contentToActOn, setContentToActOn] =
    useState<GeneratedTextOutput | null>(null);
  const [originalInputForAction, setOriginalInputForAction] = useState("");
  const [originalPlatformForAction, setOriginalPlatformForAction] = useState(
    PLATFORMS[0],
  );
  const [multiPlatformTargets, setMultiPlatformTargets] = useState<Platform[]>(
    [],
  );
  const [promptOptimizationSuggestions, setPromptOptimizationSuggestions] =
    useState<PromptOptimizationSuggestion[] | null>(null);

  const outputContainerRef = useRef<HTMLDivElement>(null);

  const allPersonas = useMemo(
    () => [...DEFAULT_AI_PERSONAS, ...customAiPersonas],
    [customAiPersonas],
  );
  const selectedPersonaDetails = useMemo(
    () =>
      allPersonas.find((p) => p.id === selectedAiPersonaId) ||
      DEFAULT_AI_PERSONAS[0],
    [allPersonas, selectedAiPersonaId],
  );

  const [youtubeStatsData, setYoutubeStatsData] = useState<YoutubeStatsEntry[]>(
    [],
  );
  const [channelTableData, setChannelTableData] = useState<ChannelTableEntry[]>(
    [],
  );

  const trendAnalysisContainerRef = useRef<HTMLDivElement>(null); // For auto-scrolling

  const [sortType, setSortType] = useState<string>(""); // New state for sorting
  const [videoLength, setVideoLength] = useState<string>("1-2 minutes"); // New state for video length
  const [customVideoLength, setCustomVideoLength] = useState<string>(""); // Custom video length input

  const sortChannels = useCallback(
    (channels: ChannelTableEntry[], type: string): ChannelTableEntry[] => {
      let sorted = [...channels];
      switch (type) {
        case "mostAvgViews":
          sorted.sort(
            (a, b) => b.averageViewsPerVideo - a.averageViewsPerVideo,
          );
          break;
        case "leastVideos":
          sorted.sort((a, b) => a.videos - b.videos);
          break;
        case "mostSubscribers":
          sorted.sort((a, b) => b.subscribers - a.subscribers);
          break;
        case "leastSubscribers":
          sorted.sort((a, b) => a.subscribers - b.subscribers);
          break;
        case "mostVideos":
          sorted.sort((a, b) => b.videos - a.videos);
          break;
        case "mostTotalViews":
          sorted.sort((a, b) => b.totalViews - a.totalViews);
          break;
        case "leastTotalViews":
          sorted.sort((a, b) => a.totalViews - b.totalViews);
          break;
        case "channelNameAsc":
          sorted.sort((a, b) => a.channelName.localeCompare(b.channelName));
          break;
        case "channelNameDesc":
          sorted.sort((a, b) => b.channelName.localeCompare(a.channelName));
          break;
        default:
          // Keep original order if no valid sort type
          break;
      }
      return sorted;
    },
    [],
  );

  // Utility function to process YouTube input (channel names or URLs)
  const processYouTubeInput = useCallback((input: string): string => {
    if (!input.trim()) return input;

    // If it's already a URL, return as-is
    if (input.startsWith("http")) return input;

    // For handles and channel names, provide both formats for better AI analysis
    if (input.includes("@")) {
      const cleanHandle = input.replace(/^@/, "");
      return `@${cleanHandle} (YouTube Channel: https://www.youtube.com/@${cleanHandle})`;
    }

    // For plain channel names, provide both the name and URL for context
    const cleanName = input.replace(/\s+/g, "");
    return `${input} (YouTube Channel: https://www.youtube.com/@${cleanName})`;
  }, []);

  // Initialize emoji runtime fixer to fix corrupted emojis throughout the app
  useEffect(() => {
    initializeEmojiRuntimeFixer();
  }, []);

  // Header auto-hide on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 100) {
        // Always show header at top
        setHeaderVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 200) {
        // Scrolling down and past threshold - hide header
        setHeaderVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show header
        setHeaderVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Restore tab state when switching tabs - placed after all state declarations
  useEffect(() => {
    // Restore specific tab data based on activeTab
    const currentTabState = tabStates[activeTab];

    if (activeTab === 'trends' && currentTabState?.inputs) {
      // Restore trends tab state
      if (currentTabState.inputs.trendNicheQuery && currentTabState.inputs.trendNicheQuery !== trendNicheQuery) {
        setTrendNicheQuery(currentTabState.inputs.trendNicheQuery);
      }
      if (currentTabState.outputs && currentTabState.outputs !== generatedTrendAnalysis) {
        setGeneratedTrendAnalysis(currentTabState.outputs);
      }
    } else if (activeTab === 'channelAnalysis' && currentTabState?.inputs) {
      // Restore channel analysis tab state
      if (currentTabState.inputs.channelAnalysisInput && currentTabState.inputs.channelAnalysisInput !== channelAnalysisInput) {
        setChannelAnalysisInput(currentTabState.inputs.channelAnalysisInput);
      }
      if (currentTabState.outputs && currentTabState.outputs !== parsedChannelAnalysis) {
        setParsedChannelAnalysis(currentTabState.outputs);
      }
    }
  }, [activeTab, tabStates]);

  // Watch and save input changes for trends tab
  useEffect(() => {
    if (trendNicheQuery.trim()) {
      updateTabState('trends', {
        inputs: { trendNicheQuery }
      });
    }
  }, [trendNicheQuery, updateTabState]);

  // Watch and save input changes for channel analysis tab
  useEffect(() => {
    if (channelAnalysisInput.trim()) {
      updateTabState('channelAnalysis', {
        inputs: { channelAnalysisInput }
      });
    }
  }, [channelAnalysisInput, updateTabState]);

  useEffect(() => {
    // Safely parse localStorage data with error handling
    try {
      const storedHistoryData = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
      if (storedHistoryData) setHistory(JSON.parse(storedHistoryData));
    } catch (error) {
      console.error("Error parsing stored history:", error);
    }

    try {
      const storedTemplatesData = localStorage.getItem(
        LOCAL_STORAGE_TEMPLATES_KEY,
      );
      if (storedTemplatesData) setTemplates(JSON.parse(storedTemplatesData));
    } catch (error) {
      console.error("Error parsing stored templates:", error);
    }

    try {
      const storedPersonasData = localStorage.getItem(
        LOCAL_STORAGE_CUSTOM_PERSONAS_KEY,
      );
      if (storedPersonasData)
        setCustomAiPersonas(JSON.parse(storedPersonasData));
    } catch (error) {
      console.error("Error parsing stored personas:", error);
    }

    try {
      const storedQueriesData = localStorage.getItem(
        LOCAL_STORAGE_TREND_ANALYSIS_QUERIES_KEY,
      );
      if (storedQueriesData)
        setRecentTrendQueries(JSON.parse(storedQueriesData));
    } catch (error) {
      console.error("Error parsing stored queries:", error);
    }

    try {
      const storedEventsData = localStorage.getItem(
        LOCAL_STORAGE_CALENDAR_EVENTS_KEY,
      );
      if (storedEventsData) setCalendarEvents(JSON.parse(storedEventsData));
    } catch (error) {
      console.error("Error parsing stored events:", error);
    }

    try {
      const storedSnapshots = localStorage.getItem(
        LOCAL_STORAGE_CANVAS_SNAPSHOTS_KEY,
      );
      if (storedSnapshots) setCanvasSnapshots(JSON.parse(storedSnapshots));
    } catch (error) {
      console.error("Error parsing stored snapshots:", error);
    }

    // Demo canvas items for testing
    const demoCanvasItems: CanvasItem[] = [
      {
        id: 'demo-1',
        type: 'stickyNote',
        x: 100,
        y: 100,
        width: 200,
        height: 120,
        zIndex: 1,
        content: '�� Welcome to the High-Performance Canvas!\n\nTry:\n• Space + drag to pan\n• Ctrl + wheel to zoom',
        backgroundColor: '#FEF3C7',
        color: '#92400E',
        borderColor: '#F59E0B',
      },
      {
        id: 'demo-2',
        type: 'textElement',
        x: 400,
        y: 150,
        width: 280,
        height: 100,
        zIndex: 2,
        content: '⚡ Pure CSS Grid Background\n🔍 Zoom Range: 5% - 500%\n�� Canvas Bounds: -10k to +10k',
        backgroundColor: '#DBEAFE',
        color: '#1E40AF',
        borderColor: '#3B82F6',
      },
      {
        id: 'demo-3',
        type: 'shapeElement',
        x: 200,
        y: 320,
        width: 150,
        height: 150,
        zIndex: 3,
        content: '🎯',
        backgroundColor: '#F3E8FF',
        color: '#8B5CF6',
        borderColor: '#8B5CF6',
        borderRadius: '50%',
      },
    ];

    let initialCanvasItems: CanvasItem[] = [];
    let initialNextZ = 4; // Start after demo items
    let initialCanvasOffsetVal = { x: 0, y: 0 };
    let initialZoomLevelVal = 1;

    const storedCanvasItemsData = localStorage.getItem(
      LOCAL_STORAGE_CANVAS_ITEMS_KEY,
    );
    if (storedCanvasItemsData) {
      try {
        const parsedData = JSON.parse(storedCanvasItemsData);
        const parsedCanvasItems: CanvasItem[] = (
          Array.isArray(parsedData) ? parsedData : []
        ).map((item: any) => ({
          ...item,
          type:
            item.type ||
            (item.historyItemId
              ? "historyItem"
              : item.base64Data
                ? "imageElement"
                : item.shapeVariant
                  ? "shapeElement"
                  : "textElement"),
          fontFamily: item.fontFamily || DEFAULT_FONT_FAMILY,
          fontSize: item.fontSize || DEFAULT_FONT_SIZE,
          fontWeight: item.fontWeight || "normal",
          fontStyle: item.fontStyle || "normal",
          textDecoration: item.textDecoration || "none",
          textColor:
            item.textColor ||
            (item.type === "stickyNote" || item.type === "commentElement"
              ? APP_STICKY_NOTE_COLORS.find(
                  (c) => c.backgroundColor === item.backgroundColor,
                )?.color || "#000000"
              : DEFAULT_TEXT_ELEMENT_COLOR),
          shapeVariant: item.shapeVariant || "rectangle",
          backgroundColor:
            item.backgroundColor ||
            (item.type === "shapeElement"
              ? DEFAULT_SHAPE_FILL_COLOR
              : item.type === "stickyNote"
                ? APP_STICKY_NOTE_COLORS[0].backgroundColor
                : undefined),
          borderColor: item.borderColor || DEFAULT_SHAPE_BORDER_COLOR,
          borderWidth: item.borderWidth || "1px",
          borderStyle: item.borderStyle || "solid",
        }));
        initialCanvasItems = parsedCanvasItems;
        if (parsedCanvasItems && parsedCanvasItems.length > 0) {
          initialNextZ =
            Math.max(...parsedCanvasItems.map((item) => item.zIndex || 0), 0) +
            1;
        }
      } catch (error) {
        console.error("Error parsing stored canvas items:", error);
        // Reset to demo items if parsing fails
        initialCanvasItems = demoCanvasItems;
      }
    } else {
      // No stored items, use demo items
      initialCanvasItems = demoCanvasItems;
    }

    try {
      const storedCanvasView = localStorage.getItem(
        LOCAL_STORAGE_CANVAS_VIEW_KEY,
      );
      if (storedCanvasView) {
        const { offset, zoom } = JSON.parse(storedCanvasView);
        if (offset) initialCanvasOffsetVal = offset;
        if (zoom) initialZoomLevelVal = zoom;
      }
    } catch (error) {
      console.error("Error parsing stored canvas view:", error);
    }

    setCanvasOffset(initialCanvasOffsetVal);
    setZoomLevel(initialZoomLevelVal);
    setCanvasItems(initialCanvasItems);
    setNextZIndex(initialNextZ);

    console.log('Canvas initialization:', {
      initialCanvasItems: initialCanvasItems.length,
      demoItems: demoCanvasItems.length,
      hasStoredItems: !!storedCanvasItemsData
    });

    try {
      const storedCanvasHist = localStorage.getItem(
        LOCAL_STORAGE_CANVAS_HISTORY_KEY,
      );
      if (storedCanvasHist) {
        const parsedHistory = JSON.parse(storedCanvasHist) as {
          history: CanvasHistoryEntry[];
          index: number;
        };
        if (parsedHistory && Array.isArray(parsedHistory.history)) {
          setCanvasHistory(parsedHistory.history);
          if (
            parsedHistory.history.length > 0 &&
            parsedHistory.index >= 0 &&
            parsedHistory.index < parsedHistory.history.length
          ) {
            const lastState = parsedHistory.history[parsedHistory.index];
            // Only restore from history if there are actual items, otherwise keep demo items
            if (lastState.items && lastState.items.length > 0) {
              setCanvasItems(JSON.parse(JSON.stringify(lastState.items)));
              setNextZIndex(lastState.nextZIndex);
              setCanvasOffset(lastState.canvasOffset);
              setZoomLevel(lastState.zoomLevel);
            } else {
              // Keep demo items if history is empty
              console.log('Canvas history is empty, keeping demo items');
            }
          }
        } else {
          const initialEntry: CanvasHistoryEntry = {
            items: JSON.parse(JSON.stringify(initialCanvasItems)),
            nextZIndex: initialNextZ,
            canvasOffset: initialCanvasOffsetVal,
            zoomLevel: initialZoomLevelVal,
          };
          setCanvasHistory([initialEntry]);
          setCurrentCanvasHistoryIndex(0);
        }
      }
    } catch (error) {
      console.error("Error parsing stored canvas history:", error);
      // Set default values if parsing fails
      const initialEntry: CanvasHistoryEntry = {
        items: JSON.parse(JSON.stringify(initialCanvasItems)),
        nextZIndex: initialNextZ,
        canvasOffset: initialCanvasOffsetVal,
        zoomLevel: initialZoomLevelVal,
      };
      setCanvasHistory([initialEntry]);
      setCurrentCanvasHistoryIndex(0);
    }

    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      setApiKeyMissing(true);
      setError(
        "Configuration error: VITE_GEMINI_API_KEY is missing. Please ensure it's set in your environment variables.",
      );
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_HISTORY_KEY,
      JSON.stringify(history.slice(0, MAX_HISTORY_ITEMS)),
    );
  }, [history]);
  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_TEMPLATES_KEY,
      JSON.stringify(templates),
    );
  }, [templates]);
  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_CUSTOM_PERSONAS_KEY,
      JSON.stringify(customAiPersonas),
    );
  }, [customAiPersonas]);
  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_TREND_ANALYSIS_QUERIES_KEY,
      JSON.stringify(recentTrendQueries),
    );
  }, [recentTrendQueries]);
  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_CALENDAR_EVENTS_KEY,
      JSON.stringify(calendarEvents),
    );
  }, [calendarEvents]);
  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_CANVAS_SNAPSHOTS_KEY,
      JSON.stringify(canvasSnapshots),
    );
  }, [canvasSnapshots]);

  useEffect(() => {
    try {
      localStorage.setItem(
        LOCAL_STORAGE_CANVAS_ITEMS_KEY,
        JSON.stringify(canvasItems),
      );
    } catch (e) {
      console.error("Failed to save canvas items:", e);
    }
  }, [canvasItems]);
  useEffect(() => {
    try {
      localStorage.setItem(
        LOCAL_STORAGE_CANVAS_VIEW_KEY,
        JSON.stringify({ offset: canvasOffset, zoom: zoomLevel }),
      );
    } catch (e) {
      console.error("Failed to save canvas view state:", e);
    }
  }, [canvasOffset, zoomLevel]);

  // Set appropriate default batch variations when content type changes
  useEffect(() => {
    if (contentType === ContentType.Idea && batchVariations === 1) {
      setBatchVariations(2); // Default to 2 ideas (1 credit) for content ideas
    } else if (contentType === ContentType.ThumbnailConcept && batchVariations === 1) {
      setBatchVariations(2); // Default to 2 thumbnail ideas (1 credit) for thumbnails
    } else if (contentType === ContentType.VideoHook && (batchVariations === 1 || batchVariations === 2)) {
      setBatchVariations(4); // Default to 4 video hooks (1 credit) for video hooks
    } else if (
      contentType !== ContentType.Idea &&
      contentType !== ContentType.ThumbnailConcept &&
      contentType !== ContentType.VideoHook &&
      (batchVariations === 2 || batchVariations === 4)
    ) {
      setBatchVariations(1); // Reset to 1 for other content types (like scripts)
    }
  }, [contentType, batchVariations]);

  useEffect(() => {
    if (canvasHistory.length > 0 || currentCanvasHistoryIndex !== -1) {
      try {
        localStorage.setItem(
          LOCAL_STORAGE_CANVAS_HISTORY_KEY,
          JSON.stringify({
            history: canvasHistory,
            index: currentCanvasHistoryIndex,
          }),
        );
      } catch (e) {
        console.error("Failed to save canvas history:", e);
      }
    }
  }, [canvasHistory, currentCanvasHistoryIndex]);

  // Close canvas dropdown on outside click
  useEffect(() => {
    const handleCanvasDropdownOutside = (event: MouseEvent) => {
      const isCanvasDropdown = (event.target as Element)?.closest(
        "[data-canvas-dropdown]",
      );

      if (!isCanvasDropdown && canvasItemDropdown) {
        setCanvasItemDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleCanvasDropdownOutside);
    return () =>
      document.removeEventListener("mousedown", handleCanvasDropdownOutside);
  }, [canvasItemDropdown]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        shapeDropdownRef.current &&
        !shapeDropdownRef.current.contains(event.target as Node)
      ) {
        const shapeButton = document.getElementById("shape-tool-button");
        if (shapeButton && !shapeButton.contains(event.target as Node)) {
          setShowShapeDropdown(false);
        } else if (!shapeButton) {
          setShowShapeDropdown(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Native DOM event listener to prevent page scrolling while allowing zoom
  useEffect(() => {
    const canvasContainer = canvasContainerRef.current;
    if (!canvasContainer) return;

    const handleWheelNative = (e: WheelEvent) => {
      // Only prevent default scroll behavior, don't stop the event from reaching React
      e.preventDefault();
      // Don't use stopPropagation or stopImmediatePropagation - let React handler work
    };

    // Add with passive: false to ensure preventDefault works
    // Use capture: false so React handler runs first
    canvasContainer.addEventListener("wheel", handleWheelNative, {
      passive: false,
      capture: false,
    });

    return () => {
      if (canvasContainer) {
        canvasContainer.removeEventListener("wheel", handleWheelNative, false);
      }
    };
  }, [activeTab]); // Re-run when activeTab changes to ensure canvas is mounted

  const currentContentTypeDetails = useMemo(
    () => CONTENT_TYPES.find((ct) => ct.value === contentType),
    [contentType],
  );
  const currentPlaceholder = useMemo(() => {
    if (activeTab === "channelAnalysis")
      return DEFAULT_USER_INPUT_PLACEHOLDERS[ContentType.ChannelAnalysis];
    if (contentType && DEFAULT_USER_INPUT_PLACEHOLDERS[contentType]) {
      return DEFAULT_USER_INPUT_PLACEHOLDERS[contentType];
    }
    return "Enter your topic or keywords...";
  }, [contentType, activeTab]);

  const isBatchSupported = useMemo(
    () => BATCH_SUPPORTED_TYPES.includes(contentType),
    [contentType],
  );
  const isABTestSupported = useMemo(
    () => Object.keys(AB_TESTABLE_CONTENT_TYPES_MAP).includes(contentType),
    [contentType],
  );
  const isTextActionSupported = useMemo(() => {
    const output = viewingHistoryItemId
      ? history.find((h) => h.id === viewingHistoryItemId)?.output
      : generatedOutput;
    if (!output || Array.isArray(output) || !isGeneratedTextOutput(output))
      return false;
    return TEXT_ACTION_SUPPORTED_TYPES.includes(contentType);
  }, [contentType, generatedOutput, viewingHistoryItemId, history]);

  const isSeoKeywordsSupported = useMemo(
    () => SEO_KEYWORD_SUGGESTION_SUPPORTED_TYPES.includes(contentType),
    [contentType],
  );

  const displayedOutputItem = useMemo(() => {
    if (viewingHistoryItemId) {
      return history.find(
        (item: HistoryItem) => item.id === viewingHistoryItemId,
      );
    }
    if (generatedOutput) {
      const currentOutputForDisplay: HistoryItem["output"] =
        generatedOutput as HistoryItem["output"];

      return {
        id: "current_generation",
        timestamp: Date.now(),
        platform,
        contentType,
        userInput,
        output: currentOutputForDisplay,
        targetAudience,
        batchVariations,
        isFavorite: false,
        aiPersonaId: selectedAiPersonaId,
        targetLanguage,
        abTestResults:
          contentType === ContentType.ABTest ? abTestResults : undefined,
      };
    }
    return null;
  }, [
    viewingHistoryItemId,
    history,
    generatedOutput,
    platform,
    contentType,
    userInput,
    targetAudience,
    batchVariations,
    selectedAiPersonaId,
    targetLanguage,
    abTestResults,
  ]);

  const handleRemoveExpandedIdea = useCallback(
    (ideaNumber: number) => {
      const outputId = displayedOutputItem?.id || `${activeTab}-current`;

      // Remove the expanded idea from expandedIdeas state
      setExpandedIdeas((prev) => {
        const newState = { ...prev };
        if (newState[outputId]) {
          const newOutputState = { ...newState[outputId] };
          delete newOutputState[ideaNumber];
          newState[outputId] = newOutputState;
        }
        return newState;
      });

      // Also remove from collapsedIdeas if it exists
      setCollapsedIdeas((prev) => {
        const newState = { ...prev };
        if (newState[outputId]) {
          const newOutputState = { ...newState[outputId] };
          delete newOutputState[ideaNumber];
          newState[outputId] = newOutputState;
        }
        return newState;
      });
    },
    [displayedOutputItem?.id, activeTab],
  );

  const commitCurrentStateToHistory = useCallback(
    (
      committedItems: CanvasItem[],
      committedNextZIndex: number,
      committedCanvasOffset: { x: number; y: number },
      committedZoomLevel: number,
    ) => {
      setCanvasHistory((prevHistory) => {
        const newHistoryBase = prevHistory.slice(
          0,
          currentCanvasHistoryIndex + 1,
        );
        const newStateEntry: CanvasHistoryEntry = {
          items: JSON.parse(JSON.stringify(committedItems)),
          nextZIndex: committedNextZIndex,
          canvasOffset: JSON.parse(JSON.stringify(committedCanvasOffset)),
          zoomLevel: committedZoomLevel,
        };
        let updatedFullHistory = [...newHistoryBase, newStateEntry];
        if (updatedFullHistory.length > MAX_CANVAS_HISTORY_STATES) {
          updatedFullHistory = updatedFullHistory.slice(
            updatedFullHistory.length - MAX_CANVAS_HISTORY_STATES,
          );
        }
        setCurrentCanvasHistoryIndex(updatedFullHistory.length - 1);
        return updatedFullHistory;
      });
    },
    [currentCanvasHistoryIndex],
  );

  const addHistoryItemToState = useCallback(
    (
      itemOutputOrHistoryItem: HistoryItem["output"] | HistoryItem,
      originalContentType?: ContentType,
      originalUserInput?: string,
      actionParams?: {
        audience?: string;
        batch?: number;
        abResults?: ABTestVariation<
          GeneratedTextOutput | ThumbnailConceptOutput
        >[];
        personaId?: string;
        language?: Language;
        originalPlatform?: Platform;
      },
    ) => {
      let newHistoryItem: HistoryItem;

      // Check if we're passing a complete HistoryItem object
      if (typeof itemOutputOrHistoryItem === 'object' &&
          itemOutputOrHistoryItem !== null &&
          'id' in itemOutputOrHistoryItem &&
          'timestamp' in itemOutputOrHistoryItem) {
        // Complete HistoryItem passed
        newHistoryItem = itemOutputOrHistoryItem as HistoryItem;
      } else {
        // Traditional usage - create HistoryItem from output
        const itemOutput = itemOutputOrHistoryItem as HistoryItem["output"];
        newHistoryItem = {
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          platform: actionParams?.originalPlatform || platform,
          contentType: originalContentType!,
          userInput: originalUserInput!,
          output: itemOutput,
          targetAudience: actionParams?.audience,
          batchVariations:
            BATCH_SUPPORTED_TYPES.includes(originalContentType!) &&
            (actionParams?.batch ?? 0) > 1
              ? actionParams?.batch
              : undefined,
          abTestResults: actionParams?.abResults,
          isFavorite: false,
          aiPersonaId: actionParams?.personaId,
          targetLanguage: actionParams?.language,
          videoLength:
            originalContentType === ContentType.Script ? videoLength : undefined,
          customVideoLength:
            originalContentType === ContentType.Script && videoLength === "custom"
              ? customVideoLength
              : undefined,
        };
      }

      setHistory((prevItems) =>
        [newHistoryItem, ...prevItems].slice(0, MAX_HISTORY_ITEMS),
      );
    },
    [platform],
  );

  const parseTrendAnalysisText = (
    text: string,
    query: string,
    sources?: Source[],
  ): TrendAnalysisOutput => {
    try {
      const items: TrendItem[] = [];

      // Safety check: ensure text is a string
      if (typeof text !== 'string') {
        console.error('parseTrendAnalysisText: text parameter is not a string:', typeof text, text);
        text = String(text || '');
      }

      // Additional safety check for empty text
      if (!text || text.trim() === '') {
        console.warn('parseTrendAnalysisText: text is empty, returning fallback');
        return {
          type: "trend_analysis",
          query: query || '',
          executiveSummary: 'Unable to generate trend analysis. Please try again.',
          items: [],
          groundingSources: sources || []
        };
      }

    // Extract executive summary
    const summaryMatch = text.match(
      /=== EXECUTIVE SUMMARY ===\s*([\s\S]*?)(?=--- Trend Card Start ---|$)/,
    );
    const executiveSummary = summaryMatch?.[1]?.trim() || "";

    // Enhanced parsing for new trend card format
    const cardRegex =
      /--- Trend Card Start ---\s*([\s\S]*?)--- Trend Card End ---/gs;
    let cardMatch;

    while ((cardMatch = cardRegex.exec(text)) !== null) {
      const cardContent = cardMatch[1];

      const trendNameMatch = cardContent.match(/TREND_NAME:\s*(.*?)(?:\n|$)/);
      const statusMatch = cardContent.match(/STATUS:\s*(.*?)(?:\n|$)/);
      const strategicInsightMatch = cardContent.match(
        /STRATEGIC_INSIGHT:\s*([\s\S]*?)(?=AUDIENCE_ALIGNMENT:|$)/,
      );
      const audienceAlignmentMatch = cardContent.match(
        /AUDIENCE_ALIGNMENT:\s*([\s\S]*?)(?=CONTENT_IDEAS:|$)/,
      );
      const contentIdeasMatch = cardContent.match(
        /CONTENT_IDEAS:\s*([\s\S]*?)(?=KEYWORDS:|$)/,
      );
      const keywordsMatch = cardContent.match(/KEYWORDS:\s*(.*?)(?:\n|$)/);
      const hashtagsMatch = cardContent.match(/HASHTAGS:\s*(.*?)(?:\n|$)/);
      const hookAngleMatch = cardContent.match(
        /HOOK_ANGLE:\s*([\s\S]*?)(?=--- Trend Card End ---|$)/,
      );

      if (trendNameMatch) {
        const contentIdeas =
          contentIdeasMatch?.[1]
            ?.split("\n")
            .map((line) => line.trim())
            .filter((line) => line.length > 0) || [];

        items.push({
          title: trendNameMatch[1].trim(),
          status: statusMatch?.[1]?.trim() || "Unknown",
          strategicInsight: strategicInsightMatch?.[1]?.trim() || "",
          audienceAlignment: audienceAlignmentMatch?.[1]?.trim() || "",
          contentIdeas,
          keywords: keywordsMatch?.[1]?.trim() || "",
          hashtags: hashtagsMatch?.[1]?.trim() || "",
          hookAngle: hookAngleMatch?.[1]?.trim() || "",
          // Legacy fields for backwards compatibility
          snippet: strategicInsightMatch?.[1]?.trim() || "",
          sourceType: "topic" as const,
          link: undefined,
        });
      }
    }

    // Fallback to legacy parsing if no enhanced cards found
    if (items.length === 0) {
      const legacyRegex =
        /--- Trend Item Start ---\s*Title:\s*(.*?)\s*Snippet:\s*(.*?)\s*Source Type:\s*(news|discussion|topic|video)\s*(?:Link:\s*(.*?)\s*)?--- Trend Item End ---/gs;
      let legacyMatch;
      while ((legacyMatch = legacyRegex.exec(text)) !== null) {
        items.push({
          title: legacyMatch[1].trim(),
          snippet: legacyMatch[2].trim(),
          sourceType: legacyMatch[3].trim() as
            | "news"
            | "discussion"
            | "topic"
            | "video",
          link: legacyMatch[4] ? legacyMatch[4].trim() : undefined,
          // Default values for enhanced fields
          status: "Unknown",
          strategicInsight: legacyMatch[2].trim(),
          audienceAlignment: "",
          contentIdeas: [],
          keywords: "",
          hashtags: "",
          hookAngle: "",
        });
      }
    }

      return {
        type: "trend_analysis",
        query,
        executiveSummary,
        items,
        groundingSources: sources,
      };
    } catch (error) {
      console.error('Error in parseTrendAnalysisText:', error);
      return {
        type: "trend_analysis",
        query: query || '',
        executiveSummary: 'Error parsing trend analysis. Please try again.',
        items: [],
        groundingSources: sources || []
      };
    }
  };

  // Sequential channel analysis handler
  const handleSequentialChannelAnalysis = useCallback(
    async (channelInput: string, currentPersonaDef: any) => {
      setIsAnalyzingChannel(true);
      setChannelAnalysisError(null);
      setIsLoading(true);
      startGeneration();

      // Parse channels from input
      const channels = channelInput
        .split(",")
        .map((c) => c.trim())
        .filter((c) => c.length > 0)
        .slice(0, 5); // Max 5 channels

      console.log("������ Starting sequential analysis for channels:", channels);

      if (channels.length === 0) {
        setChannelAnalysisError("No valid channels provided");
        setIsAnalyzingChannel(false);
        setChannelAnalysisProgress(null);
        return;
      }

      // Initialize progress tracking
      setChannelAnalysisProgress({
        current: 0,
        total: channels.length,
        currentChannel: channels[0],
      });

      let combinedResults: ParsedChannelAnalysisSection[] = [];
      let allSources: Source[] = [];
      let consecutiveFailures = 0;

      // Process each channel sequentially
      for (let i = 0; i < channels.length; i++) {
        const channel = channels[i];
        console.log(
          `📊 Analyzing channel ${i + 1}/${channels.length}: ${channel}`,
        );

        // Update progress
        setChannelAnalysisProgress({
          current: i + 1,
          total: channels.length,
          currentChannel: channel,
        });

        try {
          console.log(`🔍 Fetching real data for channel: ${channel}`);
          console.log('🔥 Using Firebase service for channel analysis');

          const firebaseResult = await firebaseIntegratedGenerationService.generateContentWithFirebaseStorage({
            userInput: channel,
            platform: Platform.YouTube,
            contentType: ContentType.ChannelAnalysis,
            targetAudience,
            aiPersona: currentPersonaDef,
            saveToFirebase: true,
          });

          const result = {
            text: firebaseResult.textOutput?.content || '',
            sources: firebaseResult.textOutput?.groundingSources || [],
          };

          // Reset consecutive failures on success
          consecutiveFailures = 0;

          const text = result.text || result;
          const sources = result.sources || [];

          // Parse the result for this channel
          const parsedData = parseChannelAnalysisOutput(text, sources);

          // Add channel prefix to sections
          const prefixedData = parsedData.map((section) => ({
            ...section,
            title: `${section.title} (${channel})`,
          }));

          combinedResults = [...combinedResults, ...prefixedData];
          allSources = [...allSources, ...sources];

          // Show first result immediately to give "simultaneous" feeling
          if (i === 0) {
            console.log(
              "�� First channel analysis completed - showing initial results",
            );
            setParsedChannelAnalysis(prefixedData);

            // Save channel analysis tab state
            updateTabState('channelAnalysis', {
              inputs: { channelAnalysisInput },
              outputs: prefixedData,
              loading: false,
              error: null
            });
          } else {
            // Update with combined results for subsequent channels
            console.log(
              `✅ Channel ${i + 1} analysis completed - updating combined results`,
            );
            setParsedChannelAnalysis(combinedResults);

            // Save channel analysis tab state
            updateTabState('channelAnalysis', {
              inputs: { channelAnalysisInput },
              outputs: combinedResults,
              loading: false,
              error: null
            });
          }

          // Reasonable delay between channels for optimal API performance
          if (i < channels.length - 1) {
            console.log(`⏳ Waiting 3 seconds before next channel...`);
            await new Promise((resolve) => setTimeout(resolve, 3000));
          }
        } catch (apiError: any) {
          console.error(`��� Error analyzing channel ${channel}:`, apiError);
          consecutiveFailures++;

          // Check for genuine API key issues (use mock content)
          const isApiKeyError = apiError.message?.includes("INVALID_API_KEY");

          // Check for temporary API overload (retry or skip, don't use mock)
          const isTemporaryError =
            apiError.message?.includes("overloaded") ||
            apiError.message?.includes("503") ||
            apiError.message?.includes("UNAVAILABLE") ||
            apiError.message?.includes("stream consumed") ||
            apiError.message?.includes("timeout") ||
            apiError.error?.code === 503;

          if (isApiKeyError) {
            console.warn(
              `🔑 API key issue detected for ${channel}, using mock content`,
            );

            // Use mock content only for API key issues
            const mockResult = generateMockContent(
              ContentType.ChannelAnalysis,
              channel,
              Platform.YouTube,
            );

            const parsedMockData = parseChannelAnalysisOutput(mockResult.text);
            const prefixedMockData = parsedMockData.map((section) => ({
              ...section,
              title: `${section.title} (Demo Data - API Key Issue)`,
              content: `⚠️ **Note**: This is demo data because of an API key issue. Please check your Gemini API key in the settings.\n\n${section.content}`,
            }));

            combinedResults = [...combinedResults, ...prefixedMockData];

            // Update display with what we have so far
            if (i === 0) {
              setParsedChannelAnalysis(prefixedMockData);

              // Save channel analysis tab state
              updateTabState('channelAnalysis', {
                inputs: { channelAnalysisInput },
                outputs: prefixedMockData,
                loading: false,
                error: null
              });
            } else {
              setParsedChannelAnalysis(combinedResults);

              // Save channel analysis tab state
              updateTabState('channelAnalysis', {
                inputs: { channelAnalysisInput },
                outputs: combinedResults,
                loading: false,
                error: null
              });
            }
          } else if (isTemporaryError && consecutiveFailures >= 3) {
            // Only skip channels after 3 consecutive failures, don't use mock data
            console.warn(
              `⚠️⚠️⚠️ Skipping ${channel} due to persistent API issues`,
            );
            // Don't add anything to results, just continue to next channel
          } else {
            // For other errors, retry or fail gracefully
            console.warn(
              `⚠️⚠️⚠️ Failed to analyze ${channel}, will retry next time`,
            );
            // Don't add mock data, just skip this channel
          }
        }
      }

      console.log("🎉 All channel analyses completed");
      setIsAnalyzingChannel(false);
      setChannelAnalysisProgress(null);

      // Complete the generation steps
      completeStep("analyzing");
      completeStep("structuring");
      completeStep("generating");
      updateStep("refining", { active: true });
      completeStep("refining");
      updateStep("finalizing", { active: true });
      completeStep("finalizing");
      finishGeneration();
      setIsLoading(false);
    },
    [
      targetAudience,
      completeStep,
      updateStep,
      finishGeneration,
      startGeneration,
    ],
  );

  const handleActualGeneration = useCallback(
    async (
      effectiveContentType: ContentType,
      effectiveUserInput: string,
      currentActionParams?: any,
    ) => {
      // Set generation source tab when starting generation
      setGenerationSourceTab(activeTab);
      setGenerationStartTime(new Date());

      // Mark tab as loading
      updateTabState(activeTab, { loading: true, error: null });
      setIsLoading(true); // Set loading state for current tab
      startGeneration();
      // --- FAKE PROGRESS IMPLEMENTATION ---
      let step1Timeout = null;
      let step2Timeout = null;
      let step3Timeout = null;
      let finished = false;

      const finishAllSteps = () => {
        if (finished) return;
        finished = true;
        if (step1Timeout) clearTimeout(step1Timeout);
        if (step2Timeout) clearTimeout(step2Timeout);
        if (step3Timeout) clearTimeout(step3Timeout);
        completeStep("analyzing");
        completeStep("structuring");
        completeStep("generating");
        updateStep("refining", { active: true });
        completeStep("refining");
        updateStep("finalizing", { active: true });
        completeStep("finalizing");
        finishGeneration();
      };

      // Step 1: Analyzing
      updateStep("analyzing", { active: true });
      step1Timeout = setTimeout(() => {
        completeStep("analyzing");
        // Step 2: Structuring
        updateStep("structuring", { active: true });
        step2Timeout = setTimeout(() => {
          completeStep("structuring");
          // Step 3: Generating
          updateStep("generating", { active: true });
          step3Timeout = setTimeout(() => {
            completeStep("generating");
            // Step 4: Refining
            updateStep("refining", { active: true });
          }, 15000);
        }, 2500);
      }, 1000);
      // --- END FAKE PROGRESS SETUP ---

      setError(null);
      setGeneratedOutput(null);
      setAbTestResults(null);
      setPromptOptimizationSuggestions(null);
      if (!currentActionParams?.isSummarizingChannel) {
        setParsedChannelAnalysis(null);
        setChannelAnalysisSummary(null);
      }
      setYoutubeStatsData([]); // Clear previous stats
      setCopied(false);
      setViewingHistoryItemId(null);

      let finalOutputForDisplay: HistoryItem["output"] | null = null;
      let abResultsForHistory:
        | ABTestVariation<GeneratedTextOutput | ThumbnailConceptOutput>[]
        | undefined = undefined;
      const isCurrentlyABTesting =
        effectiveContentType === ContentType.ABTest && isABTesting;

      const currentPersonaDef = selectedPersonaDetails;

      let text: string = ""; // Declare text here
      let sources: Source[] | undefined = undefined; // Declare sources here

      const textGenOptions: Parameters<typeof generateTextContent>[0] = {
        // Move textGenOptions declaration here
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
        seoMode:
          seoMode === SeoKeywordMode.Suggest ? seoMode :
          (seoKeywords ? seoMode : undefined),
        seoIntensity:
          seoMode === SeoKeywordMode.Incorporate ? seoIntensity : undefined,
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
        // Course-specific parameters
        courseModules:
          effectiveContentType === ContentType.CourseEducationalContent
            ? courseModules
            : undefined,
        courseDuration:
          effectiveContentType === ContentType.CourseEducationalContent
            ? courseDuration
            : undefined,
        courseDifficulty:
          effectiveContentType === ContentType.CourseEducationalContent
            ? courseDifficulty
            : undefined,
        includeAssessments:
          effectiveContentType === ContentType.CourseEducationalContent
            ? includeAssessments
            : undefined,
        courseObjectives:
          effectiveContentType === ContentType.CourseEducationalContent &&
          courseObjectives.trim()
            ? courseObjectives
            : undefined,
        coursePriceRange:
          effectiveContentType === ContentType.CourseEducationalContent
            ? coursePriceRange
            : undefined,
        courseTargetAudience:
          effectiveContentType === ContentType.CourseEducationalContent &&
          courseTargetAudience.trim()
            ? courseTargetAudience
            : undefined,
        includeMarketing:
          effectiveContentType === ContentType.CourseEducationalContent
            ? includeMarketing
            : undefined,
        includeBonuses:
          effectiveContentType === ContentType.CourseEducationalContent
            ? includeBonuses
            : undefined,
        includeUpsells:
          effectiveContentType === ContentType.CourseEducationalContent
            ? includeUpsells
            : undefined,
        includeCTAs: includeCTAs, // Pass the CTA checkbox state
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
          finishAllSteps();
          return; // Prevent further step completions
        } else if (
          effectiveContentType === ContentType.ChannelAnalysis &&
          currentActionParams?.channelInput
        ) {
          // Handle sequential channel analysis for multiple channels
          await handleSequentialChannelAnalysis(
            currentActionParams.channelInput,
            currentPersonaDef,
          );
          return; // Prevent further step completions
        } else if (
          effectiveContentType === ContentType.ContentStrategyPlan &&
          currentActionParams?.strategyConfig
        ) {
          setIsGeneratingStrategy(true);
          setStrategyError(null);
          let strategyResult;
          try {
            console.log("🚀 Starting strategy generation with Firebase wrapper...");
            console.log("����� Strategy config:", currentActionParams.strategyConfig);

            strategyResult = await firebaseIntegratedGenerationService.generateTextContentWithFirebaseBackgroundSave({
              platform,
              contentType: ContentType.ContentStrategyPlan,
              userInput: currentActionParams.strategyConfig.niche,
              aiPersonaDef: currentPersonaDef,
              strategyInputs: currentActionParams.strategyConfig,
            });

            console.log("✅ Strategy generation completed with Firebase save");
          } catch (apiError: any) {
            console.error("❌ Strategy plan generation error:", apiError);
            if (
              apiError.message?.includes("INVALID_API_KEY") ||
              apiError.message?.includes("overloaded") ||
              apiError.message?.includes("503") ||
              apiError.message?.includes("UNAVAILABLE") ||
              apiError.message?.includes("body stream already read") ||
              apiError.message?.includes("Response stream consumed") ||
              apiError.message?.includes("stream") ||
              (apiError.code &&
                (apiError.code === 503 || apiError.code === 429)) ||
              (apiError.status &&
                (apiError.status === "UNAVAILABLE" ||
                  apiError.status === "RESOURCE_EXHAUSTED"))
            ) {
              console.warn(
                `🔄 API error detected during strategy plan generation (${apiError.message || apiError.code || apiError.status}), using fallback content`,
              );
              // Use mock content for strategy plan
              console.log("���� Generating mock strategy content...");
              try {
                strategyResult = generateMockContent(
                  ContentType.ContentStrategyPlan,
                  currentActionParams.strategyConfig.niche,
                  platform,
                );
                console.log("✅ Mock strategy generation completed");
              } catch (mockError) {
                console.error("❌ Mock content generation also failed:", mockError);
                // Provide basic fallback
                strategyResult = {
                  text: JSON.stringify({
                    targetAudienceOverview: `Emergency fallback strategy for ${currentActionParams.strategyConfig.niche}`,
                    goals: ["Build Authority", "Increase Engagement", "Grow Audience"],
                    contentPillars: [
                      {
                        pillarName: "Educational Content",
                        description: `Educational content about ${currentActionParams.strategyConfig.niche}`,
                        keywords: ["tutorial", "guide", "how-to"],
                        contentTypes: ["Tutorial", "Guide", "Tips"],
                        postingFrequency: "3x per week",
                        engagementStrategy: "Focus on value-driven content"
                      },
                      {
                        pillarName: "Behind the Scenes",
                        description: `Personal insights and behind-the-scenes content`,
                        keywords: ["process", "journey", "personal"],
                        contentTypes: ["Story", "Process", "Update"],
                        postingFrequency: "2x per week",
                        engagementStrategy: "Build personal connection"
                      }
                    ],
                    keyThemes: [
                      {
                        themeName: "Expertise",
                        description: "Showcase knowledge and skills",
                        relatedPillars: ["Educational Content"]
                      }
                    ],
                    postingSchedule: {
                      optimalTimes: {
                        Monday: ["9:00 AM"],
                        Tuesday: ["9:00 AM"],
                        Wednesday: ["9:00 AM"],
                        Thursday: ["9:00 AM"],
                        Friday: ["9:00 AM"],
                        Saturday: ["10:00 AM"],
                        Sunday: ["10:00 AM"]
                      },
                      frequency: "3-5 times per week",
                      timezone: "UTC",
                      seasonalAdjustments: "Holiday content during peak seasons"
                    },
                    suggestedWeeklySchedule: [
                      {
                        dayOfWeek: "Monday",
                        contentType: "YouTube Video Idea",
                        topicHint: "Educational tutorial content",
                        platform: "YouTube",
                        optimalTime: "9:00 AM",
                        cta: "Subscribe for more tutorials"
                      }
                    ],
                    seoStrategy: {
                      primaryKeywords: [],
                      longTailKeywords: [],
                      keywordStrategy: "Basic SEO strategy"
                    },
                    ctaStrategy: {
                      primaryCTAs: [],
                      ctaPlacement: "Basic CTA strategy"
                    },
                    contentManagement: {
                      workflowSteps: [],
                      tools: [],
                      teamRoles: []
                    },
                    distributionStrategy: {
                      platforms: [],
                      crossPromotionTactics: []
                    },
                    analyticsAndKPIs: {
                      primaryMetrics: ["Views", "Engagement"],
                      trackingTools: []
                    },
                    budgetAndResources: {
                      estimatedBudget: "Basic budget plan",
                      resourceNeeds: []
                    },
                    competitorAnalysis: {
                      competitors: [],
                      opportunities: []
                    },
                    contentCalendarTemplate: {
                      weeklyTemplate: [],
                      monthlyTemplate: []
                    },
                    riskMitigation: {
                      risks: [],
                      contingencyPlans: []
                    },
                    mockDataNotice: "⚠️ Fallback strategy due to system error. Please try again or check your API configuration."
                  }),
                  sources: [],
                  responseMimeType: "application/json"
                };
                console.log("✅ Fallback strategy content created");
              }
            } else {
              throw apiError;
            }
          }
          const { text: strategyText, responseMimeType: strategyMimeType } =
            strategyResult;

          console.log("��� Strategy generation debug:");
          console.log("���� Strategy text length:", strategyText?.length);
          console.log("🏷️ Mime type received:", strategyMimeType);
          console.log("📝 Strategy text preview:", strategyText?.substring(0, 200));

          if (strategyMimeType === "application/json") {
            console.log("📋 Parsing strategy JSON...");
            try {
              const parsed =
                parseJsonSafely<ContentStrategyPlanOutput>(strategyText);
              if (parsed) {
                console.log("✅ Strategy JSON parsed successfully");
                console.log("��� Strategy object keys:", Object.keys(parsed));
                setGeneratedStrategyPlan(parsed);

                // Store the generated strategy
                const newStrategy = {
                  id: crypto.randomUUID(),
                  name: `${currentActionParams.strategyConfig.niche || 'Content'} Strategy`,
                  createdAt: new Date(),
                  strategy: parsed,
                  niche: currentActionParams.strategyConfig.niche,
                  config: currentActionParams.strategyConfig,
                };

                setAllGeneratedStrategies(prev => [newStrategy, ...prev]);
                console.log("���� Strategy stored with ID:", newStrategy.id);

                // Show success message
                addHistoryItemToState({
                  id: crypto.randomUUID(),
                  type: "success",
                  title: "Strategy Generated Successfully",
                  description: `Your content strategy for "${currentActionParams.strategyConfig.niche}" is ready!`,
                  timestamp: new Date(),
                  content: `Strategy "${newStrategy.name}" has been generated and saved to your Generated Strategies tab.`,
                  metadata: {
                    strategyId: newStrategy.id,
                    pillarsCount: parsed.contentPillars.length,
                    goalsCount: parsed.goals.length
                  }
                });

                finalOutputForDisplay = parsed;
              } else {
                console.error("❌ Failed to parse strategy JSON");
                console.error("📄 Raw text:", strategyText?.substring(0, 500));
                throw new Error("Failed to parse Content Strategy Plan JSON. Raw text: " + strategyText?.substring(0, 200));
              }
            } catch (strategyParseError) {
              console.error("❌ Strategy parsing error:", strategyParseError);
              console.error("�� Raw text that failed:", strategyText?.substring(0, 1000));

              // Create a fallback strategy object with any recoverable information
              console.log("🔄 Creating fallback strategy from error state...");

              // Try to extract any text content for the overview
              const extractedText = strategyText?.substring(0, 500) || "Strategy generation was incomplete";

              const fallbackStrategy: ContentStrategyPlanOutput = {
                targetAudienceOverview: `Strategy generation encountered an error. Partial response: ${extractedText}`,
                goals: ["Regenerate strategy", "Check AI response limits", "Try with shorter inputs"],
                contentPillars: [{
                  pillarName: "Error Recovery",
                  description: "The strategy generation was truncated or failed. Please try again with a shorter or simpler request.",
                  keywords: ["retry", "regenerate", "simplify"],
                  contentTypes: ["error recovery"],
                  platforms: ["any"]
                }],
                keyThemes: ["Please regenerate strategy", "Response was truncated", "Try simpler inputs"],
                competitiveAdvantage: "Strategy generation failed - please retry",
                contentCalendar: [],
                performanceMetrics: [],
                voiceAndTone: { tone: "professional", voice: "helpful" },
                distributionStrategy: "Please regenerate the strategy with simpler inputs",
                emergingOpportunities: ["Try generating strategy again", "Use simpler configuration"],
                partialResponse: true,
                errorMessage: strategyParseError.message,
                rawText: strategyText?.substring(0, 1000) + "..."
              };

              // Add error to history but continue with fallback strategy
              addHistoryItemToState({
                id: crypto.randomUUID(),
                type: "error",
                title: "Strategy Generation Incomplete",
                description: "AI response was truncated. A fallback strategy has been provided.",
                timestamp: new Date(),
                content: `Error: ${strategyParseError.message}\n\nFallback strategy created. Please try regenerating with simpler inputs.\n\nPartial response:\n${strategyText?.substring(0, 500)}...`,
                metadata: {
                  errorType: "json_parse_error",
                  responseLength: strategyText?.length || 0
                }
              });

              // Use fallback strategy instead of placeholder text
              finalOutputForDisplay = fallbackStrategy;
            }
          } else {
            console.error("❌ Unexpected mime type:", strategyMimeType);
            console.error("📄 Received text:", strategyText?.substring(0, 200));
            throw new Error(`Content Strategy Plan returned unexpected format: ${strategyMimeType}. Expected: application/json`);
          }
          setIsGeneratingStrategy(false);
          finishAllSteps();
          return; // Prevent further step completions
        } else if (
          effectiveContentType === ContentType.TrendAnalysis &&
          currentActionParams?.trendAnalysisConfig
        ) {
          setIsAnalyzingTrends(true);
          setTrendAnalysisError(null);
          let result;
          try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
            console.log('🚀 Starting real trend analysis generation for:', {
              niche: currentActionParams.trendAnalysisConfig.nicheQuery,
              filters: currentActionParams.trendAnalysisConfig.filters,
              hasApiKey: !!apiKey,
              apiKeyLength: apiKey ? apiKey.length : 0
            });

            if (!apiKey) {
              throw new Error('INVALID_API_KEY: Gemini API key is not configured');
            }

            console.log('🔥 Using Firebase wrapper for trend analysis');
            result = await firebaseIntegratedGenerationService.generateTextContentWithFirebaseBackgroundSave({
              platform,
              contentType: ContentType.TrendAnalysis,
              userInput: currentActionParams.trendAnalysisConfig.nicheQuery,
              aiPersonaDef: currentPersonaDef,
              nicheForTrends: currentActionParams.trendAnalysisConfig.nicheQuery,
              trendFilters: currentActionParams.trendAnalysisConfig.filters,
            });

            console.log('✅ Successfully generated real trend analysis');
          } catch (apiError: any) {
            console.error('❌ Trend analysis API error:', {
              message: apiError.message,
              code: apiError.code,
              status: apiError.status,
              fullError: apiError
            });

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
                `⚠️ API error detected during trend analysis (${apiError.message || apiError.code || apiError.status}), using fallback content`,
              );
              result = generateMockContent(
                ContentType.TrendAnalysis,
                currentActionParams.trendAnalysisConfig.nicheQuery,
                platform,
              );
            } else {
              throw apiError;
            }
          }
          // Debug the result structure
          console.log('����� Debug result structure:', {
            type: typeof result,
            hasText: 'text' in result,
            textType: typeof result.text,
            result: result
          });

          // Fix: Extract text from nested structure if needed
          let textContent = result.text;
          if (typeof textContent === 'object' && textContent !== null) {
            console.warn('⚠️ result.text is an object, attempting to extract string:', textContent);

            // Try common nested structures
            if ('text' in textContent) {
              textContent = textContent.text;
            } else if ('content' in textContent) {
              textContent = textContent.content;
            } else if (typeof textContent.toString === 'function') {
              textContent = textContent.toString();
            } else {
              textContent = JSON.stringify(textContent);
            }
          }

          text = textContent;
          sources = result.sources;

          // Final safety check: ensure text is a string
          if (typeof text !== 'string') {
            console.error('❌ result.text could not be converted to string:', typeof text, text);
            text = String(text || 'Unable to generate content');
          }

          const parsed = parseTrendAnalysisText(
            text,
            currentActionParams.trendAnalysisConfig.nicheQuery,
            sources,
          );
          setGeneratedTrendAnalysis(parsed);
          finalOutputForDisplay = parsed;

          // Save trends tab state
          updateTabState('trends', {
            inputs: { trendNicheQuery },
            outputs: parsed,
            loading: false,
            error: null
          });
          if (parsed.query && !recentTrendQueries.includes(parsed.query)) {
            setRecentTrendQueries((prev) => [
              parsed.query,
              ...prev.slice(0, 9),
            ]);
          }
          setIsAnalyzingTrends(false);
          finishAllSteps();
          return; // Prevent further step completions
        } else if (effectiveContentType === ContentType.YoutubeChannelStats) {
          setIsLoading(true);
          // Do not clear youtubeStatsData here, append instead
          let result;
          try {
            result = await generateTextContent({
              platform: Platform.YouTube,
              contentType: ContentType.YoutubeChannelStats,
              userInput: effectiveUserInput,
              aiPersonaDef: currentPersonaDef,
            });
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
                `API error detected during YouTube stats generation (${apiError.message || apiError.code || apiError.status}), using fallback content`,
              );
              result = generateMockContent(
                ContentType.YoutubeChannelStats,
                effectiveUserInput,
                Platform.YouTube,
              );
            } else {
              throw apiError;
            }
          }
          text = result.text;
          const newEntry: YoutubeStatsEntry = {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            userInput: effectiveUserInput,
            content: text,
          };
          setYoutubeStatsData((prev) => [...prev, newEntry]);
          finalOutputForDisplay = { type: "text", content: text }; // Store as text output for history
          finishAllSteps();
          return; // Prevent further step completions
        } else if (
          effectiveContentType === ContentType.EngagementFeedback &&
          currentActionParams?.engagementFeedbackConfig
        ) {
          let result;
          try {
            console.log('🔥 Using Firebase wrapper for engagement feedback');
            result = await firebaseIntegratedGenerationService.generateTextContentWithFirebaseBackgroundSave(textGenOptions);
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
                `API error detected during engagement feedback (${apiError.message || apiError.code || apiError.status}), using fallback content`,
              );
              result = generateMockContent(
                textGenOptions.contentType,
                textGenOptions.userInput,
                textGenOptions.platform,
              );
            } else {
              throw apiError;
            }
          }
          text = result.text;
          finalOutputForDisplay = {
            type: "engagement_feedback",
            feedback: text,
          } as EngagementFeedbackOutput;
          finishAllSteps();
          return; // Prevent further step completions
        } else {
          // Default text generation with premium features
          let result;
          try {
            // Check if user has premium access and premium features are enabled
            if (
              isPremium &&
              (selectedPremiumTemplate ||
                selectedCustomPersona ||
                premiumSEOConfig ||
                aiBoostEnabled)
            ) {
              // Use premium generation
              const premiumOptions = {
                platform: textGenOptions.platform,
                contentType: textGenOptions.contentType,
                userInput: textGenOptions.userInput,
                targetAudience: textGenOptions.targetAudience,
                template: selectedPremiumTemplate,
                customPersona: selectedCustomPersona,
                seoConfig: premiumSEOConfig,
                aiBoost: aiBoostEnabled,
                performanceAnalytics: true, // Always include for premium users
                seoKeywords: textGenOptions.seoKeywords,
                seoMode: textGenOptions.seoMode,
                targetLanguage: textGenOptions.targetLanguage,
                aspectRatioGuidance: textGenOptions.aspectRatioGuidance,
                videoLength: textGenOptions.videoLength,
              };

              const premiumResult =
                await premiumGeminiService.generatePremiumContent(
                  premiumOptions,
                );

              // Convert premium result to standard format
              result = {
                text: premiumResult.content,
                sources:
                  premiumResult.metadata?.analytics?.sources || undefined,
                responseMimeType: "text/plain",
              };
            } else {
              // Use Firebase wrapper that preserves original behavior + saves to Firebase
              console.log('🔥 Using Firebase wrapper for perfect compatibility');
              result = await firebaseIntegratedGenerationService.generateTextContentWithFirebaseBackgroundSave(textGenOptions);
            }
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
                `API error detected during text generation (${apiError.message || apiError.code || apiError.status}), using fallback content`,
              );
              result = generateMockContent(
                textGenOptions.contentType,
                textGenOptions.userInput,
                textGenOptions.platform,
              );
            } else {
              throw apiError;
            }
          }
          text = result.text;
          sources = result.sources;
          const responseMimeType = result.responseMimeType; // Ensure responseMimeType is available

          if (isCurrentlyABTesting && responseMimeType === "application/json") {
            const parsedResults =
              parseJsonSafely<
                ABTestVariation<GeneratedTextOutput | ThumbnailConceptOutput>[]
              >(text);
            if (parsedResults) {
              setAbTestResults(parsedResults);
              abResultsForHistory = parsedResults;
              finalOutputForDisplay = {
                type: "text",
                content: `A/B Test Generated: ${parsedResults.length} variations. View details in UI.`,
              } as GeneratedTextOutput;
            } else {
              finalOutputForDisplay = {
                type: "text",
                content: text,
                groundingSources: sources,
              } as GeneratedTextOutput;
            }
          } else if (
            effectiveContentType === ContentType.OptimizePrompt &&
            responseMimeType === "application/json"
          ) {
            const suggestions =
              parseJsonSafely<PromptOptimizationSuggestion[]>(text);
            setPromptOptimizationSuggestions(suggestions);
            setIsPromptOptimizerModalOpen(true);
            finalOutputForDisplay = suggestions;
          } else if (
            effectiveContentType === ContentType.ContentBrief &&
            responseMimeType === "application/json"
          ) {
            finalOutputForDisplay = parseJsonSafely<ContentBriefOutput>(text);
          } else if (
            effectiveContentType === ContentType.PollsQuizzes &&
            responseMimeType === "application/json"
          ) {
            finalOutputForDisplay = parseJsonSafely<PollQuizOutput>(text);
          } else if (effectiveContentType === ContentType.CheckReadability) {
            let scoreDesc = "Could not determine readability score.";
            let simplifiedTxt: string | undefined = undefined;
            const simpleDescMatch = text.match(
              /^([\w\s.,'":;-]+)\s*(?:Simplified Version:([\s\S]*))?$/i,
            );
            if (simpleDescMatch && simpleDescMatch[1]) {
              scoreDesc = simpleDescMatch[1].trim();
              if (simpleDescMatch[2]) simplifiedTxt = simpleDescMatch[2].trim();
            }
            finalOutputForDisplay = {
              scoreDescription: scoreDesc,
              simplifiedContent: simplifiedTxt,
            } as ReadabilityOutput;
          } else if (
            effectiveContentType === ContentType.RefinedText &&
            currentActionParams?.isSummarizingChannel
          ) {
            setChannelAnalysisSummary(text);
            finalOutputForDisplay = {
              type: "text",
              content: text,
            } as GeneratedTextOutput;
          } else if (
            effectiveContentType === ContentType.EngagementFeedback &&
            currentActionParams?.engagementFeedbackConfig
          ) {
            finalOutputForDisplay = {
              type: "engagement_feedback",
              feedback: text,
            } as EngagementFeedbackOutput;
          } else {
            finalOutputForDisplay = {
              type: "text",
              content: text,
              groundingSources: sources,
            } as GeneratedTextOutput;
          }
          setGeneratedOutput(finalOutputForDisplay);

          // Deduct credits based on content type and variants
          const creditsToDeduct = calculateCreditsForGeneration(
            effectiveContentType,
            batchVariations,
          );
          try {
            const feature =
              effectiveContentType === ContentType.Image ||
              effectiveContentType === ContentType.ImagePrompt
                ? "image_generation"
                : "content_generation";

            const success = await deductCredits(
              feature,
              creditsToDeduct,
              `Generated ${effectiveContentType} content (${creditsToDeduct} credits)`,
            );

            if (!success) {
              throw new Error("Insufficient credits for this generation");
            }

            // Also increment the old usage counter for backwards compatibility
            await incrementUsage();
          } catch (creditError) {
            console.error("Error deducting credits:", creditError);
            setError(
              "Insufficient credits. Please purchase more credits or upgrade your plan.",
            );
            finishAllSteps();
            return;
          }

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
                personaId: selectedAiPersonaId,
                language: targetLanguage,
                originalPlatform: platform,
              },
            );

            // Now save the completed generation to Firebase with full output
            try {
              const generationDuration = Date.now() - (generationStartTime?.getTime() || Date.now());
              const generationId = await firebaseIntegratedGenerationService.saveCompletedGeneration(
                textGenOptions,
                finalOutputForDisplay,
                generationDuration
              );
              console.log('✅ Generation saved to Firebase after output completion:', generationId);

              // Update the history item with Firebase information for thumbs up/down functionality
              if (generationId) {
                setHistory((prevHistory) => {
                  const updatedHistory = [...prevHistory];
                  if (updatedHistory.length > 0) {
                    // Update the most recent item (which was just added)
                    updatedHistory[0] = {
                      ...updatedHistory[0],
                      firebase: {
                        generationId,
                        savedToFirebase: true,
                        lastSyncedAt: Date.now(),
                        storageUrls: {},
                        storagePaths: {}
                      }
                    };
                  }
                  return updatedHistory;
                });
                console.log('✅ History item updated with Firebase generationId:', generationId);
              }
            } catch (firebaseError) {
              console.warn('⚠️ Firebase save after completion failed:', firebaseError);
              // Don't throw - generation succeeded even if Firebase save failed
            }
          }

          finishAllSteps();
          return; // Prevent further step completions
        }
      } catch (err) {
        const specificError =
          err instanceof Error ? err.message : "An unexpected error occurred.";
        setError(specificError);
        if (effectiveContentType === ContentType.ChannelAnalysis)
          setChannelAnalysisError(specificError);
        if (effectiveContentType === ContentType.ContentStrategyPlan)
          setStrategyError(specificError);
        if (effectiveContentType === ContentType.TrendAnalysis)
          setTrendAnalysisError(specificError);
        console.error(err);
      } finally {
        finishAllSteps();
        if (
          effectiveContentType === ContentType.RefinedText &&
          currentActionParams?.isSummarizingChannel
        ) {
          setIsSummarizingChannelAnalysis(false);
        } else {
          // Clear all tab-specific loading states
          setIsGeneratorLoading(false);
          setIsYoutubeStatsLoading(false);
        }
        setIsAnalyzingChannel(false);
        setIsGeneratingStrategy(false);
        setIsAnalyzingTrends(false);
        setGenerationSourceTab(null);
        setGenerationStartTime(null);
        if (isRepurposeModalOpen) setIsRepurposeModalOpen(false);
        if (isMultiPlatformModalOpen) setIsMultiPlatformModalOpen(false);
        if (isLanguageModalOpen) setIsLanguageModalOpen(false);
        setShowRefineOptions(false);
        setShowTextActionOptions(false);
        if (step1Timeout) clearTimeout(step1Timeout);
        if (step2Timeout) clearTimeout(step2Timeout);
        if (step3Timeout) clearTimeout(step3Timeout);
      }
    },
    [
      platform,
      contentType,
      targetAudience,
      batchVariations,
      isABTesting,
      abTestType,
      seoMode,
      seoKeywords,
      selectedAiPersonaId,
      targetLanguage,
      aspectRatioGuidance,
      negativeImagePrompt,
      isBatchSupported,
      selectedPersonaDetails,
      addHistoryItemToState,
      startGeneration,
      completeStep,
      finishGeneration,
    ],
  );

  const parseContentIdeas = (
    content: string,
  ): { ideaNumber: number; idea: string }[] => {
    const ideas: { ideaNumber: number; idea: string }[] = [];

    // First try to split by the specific "���� **IDEA #" pattern
    const ideaSections = content.split(/(?=🎯\s*\*\*IDEA\s*#\d+)/i);

    if (ideaSections.length > 1) {
      // Filter out empty sections and process each idea section
      ideaSections
        .filter((section) => section.trim().length > 0)
        .forEach((section, index) => {
          const trimmedSection = section.trim();
          if (trimmedSection.includes("IDEA #") || index > 0) {
            // Extract idea number from the section
            const ideaMatch = trimmedSection.match(/IDEA\s*#(\d+)/i);
            const ideaNumber = ideaMatch ? parseInt(ideaMatch[1]) : index + 1;

            ideas.push({
              ideaNumber,
              idea: trimmedSection,
            });
          }
        });

      if (ideas.length > 0) {
        return ideas;
      }
    }

    // Fallback to original line-by-line parsing for other formats
    const lines = content.split("\n");
    let currentIdea = "";
    let currentIdeaNumber = 0;
    let inIdea = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Check if this line starts a new idea (matches various patterns)
      const ideaMatch = line.match(
        /^(?:������������\s*)?(?:\*\*)?(?:IDEA\s*#?)?(\d+)[\.\:]?\s*(?:\*\*)?\s*(.*)$/i,
      );

      if (ideaMatch) {
        // Save previous idea if exists
        if (inIdea && currentIdea.trim() && currentIdeaNumber > 0) {
          ideas.push({
            ideaNumber: currentIdeaNumber,
            idea: currentIdea.trim(),
          });
        }

        // Start new idea
        currentIdeaNumber = parseInt(ideaMatch[1]);
        currentIdea = line + "\n";
        inIdea = true;
      } else if (inIdea) {
        // Continue building current idea
        currentIdea += line + "\n";

        // Stop collecting if we hit a clear break (empty lines, headers, etc.)
        if (line === "" && lines[i + 1]?.trim() === "") {
          ideas.push({
            ideaNumber: currentIdeaNumber,
            idea: currentIdea.trim(),
          });
          currentIdea = "";
          inIdea = false;
        }
      }
    }

    // Add the last idea if exists
    if (inIdea && currentIdea.trim() && currentIdeaNumber > 0) {
      ideas.push({ ideaNumber: currentIdeaNumber, idea: currentIdea.trim() });
    }

    return ideas;
  };

  // Calculate credits needed for generation with universal batch pricing
  const calculateCreditsForGeneration = (
    contentType: ContentType,
    variants: number,
  ): number => {
    // Universal batch pricing for ALL content types (volume discounts)
    if (variants <= 2) return 1;
    if (variants <= 4) return 2;
    if (variants <= 8) return 3;
    if (variants <= 12) return 4;
    return Math.ceil(variants / 3); // Fallback for larger amounts
  };
  // Handle generating different content types from an idea
  const handleGenerateFromIdea = async (
    optionId: string,
    originalIdea: string,
    ideaNumber: number,
  ) => {
    if (apiKeyMissing) {
      console.error(
        "❌ Cannot generate from idea: VITE_GEMINI_API_KEY is missing.",
      );
      return;
    }

    console.log("🎯 Generating from idea:", {
      optionId,
      originalIdea,
      ideaNumber,
    });

    // Map option IDs to content types
    const contentTypeMap: Record<string, ContentType> = {
      "content-idea": ContentType.Idea,
      script: ContentType.Script,
      "title-headline": ContentType.Title,
      "video-hook": ContentType.VideoHook,
      "thumbnail-concept": ContentType.ThumbnailConcept,
      "content-brief": ContentType.ContentBrief,
      "polls-quizzes": ContentType.PollsQuizzes,
      "content-gap-finder": ContentType.ContentGapFinder,
      "micro-video-script": ContentType.MicroScript,
      "ab-test-variations": ContentType.ABTest,
    };

    const selectedContentType = contentTypeMap[optionId];
    if (!selectedContentType) {
      console.error("�� Unknown generation option:", optionId);
      return;
    }

    // Simply populate the input field and select the content type
    setUserInput(originalIdea);
    setContentType(selectedContentType);

    console.log(
      `✅ Set input to: "${originalIdea}" and content type to: ${selectedContentType}`,
    );
    console.log("��� User can now click Generate to create the content");
  };

  const handleExpandIdea = async (ideaNumber: number, originalIdea: string) => {
    if (apiKeyMissing) {
      console.error("❌ Cannot expand idea: VITE_GEMINI_API_KEY is missing.");
      return;
    }

    const outputId = displayedOutputItem?.id || `${activeTab}-current`;

    // Set loading state and start progress tracking
    setExpandedIdeas((prev) => ({
      ...prev,
      [outputId]: {
        ...prev[outputId],
        [ideaNumber]: {
          ideaNumber,
          originalIdea,
          expandedContent: "",
          isExpanding: true,
        },
      },
    }));

    // Start generation progress for expansion
    setIsExpandingIdea(true);
    startGeneration();
    updateStep("analyzing", { active: true });

    try {
      console.log("���� Expanding idea:", { ideaNumber, originalIdea, outputId });

      const expandPrompt = `Expand this content idea with actionable details:

${originalIdea}

EXPAND THIS INTO:
🎯 **DETAILED CONCEPT**: Provide a comprehensive 4-5 sentence explanation with specific examples
�������� **EXECUTION GUIDE**: Step-by-step breakdown of how to create this content
����� **SCRIPT FRAMEWORK**: Outline the structure/flow with key talking points
�� **ENGAGEMENT TACTICS**: Specific techniques to maximize views, comments, shares
📊 **PERFORMANCE OPTIMIZATION**: Tips for thumbnails, titles, timing, hashtags
������� **VARIATIONS**: 3-4 alternative approaches or spin-offs
�� **TRENDING ELEMENTS**: Current trends that could be incorporated
⚡ **ADVANCED TIPS**: Pro-level insights for maximum impact

Keep it concise, actionable, and ready-to-implement.`;

      // Complete first step and move to generation
      completeStep("analyzing");
      updateStep("generating", { active: true });

      console.log("���� Generating expanded content...");
      let expandedText;

      try {
        expandedText = await generateTextContent({
          platform,
          contentType: ContentType.Idea,
          userInput: expandPrompt,
          aiPersonaDef: selectedAiPersonaId
            ? allPersonas.find((p) => p.id === selectedAiPersonaId)
            : undefined,
          targetAudience,
        });
      } catch (apiError: any) {
        // Use fallback content if API fails
        console.warn(
          "API failed for idea expansion, using fallback:",
          apiError,
        );

        expandedText = {
          text: `TARGET: DETAILED CONCEPT
This is an expanded version of your original idea with more specific details and actionable steps. Your concept has strong potential for engagement and can be developed into compelling content.

CREATE: HOW TO MAKE
1. Research your topic thoroughly and gather supporting examples
2. Create a detailed outline with your main points and supporting details
3. Film/write your content following the planned structure
4. Edit and optimize for your specific platform requirements

STRUCTURE: Content flow and key talking points
- Hook: Start with an attention-grabbing opening that promises value
- Main content: Deliver on your promise with valuable, actionable information
- Proof/Examples: Include specific examples or case studies
- Call-to-action: Encourage engagement and provide clear next steps

ENGAGE: Tactics to maximize views and shares
- Ask thought-provoking questions to encourage comments and discussion
- Use trending hashtags relevant to your niche for better discoverability
- Post at optimal times when your audience is most active

VARIATIONS: Alternative approaches
- Create a series breaking this concept into multiple digestible parts
- Turn it into an interactive tutorial or step-by-step how-to guide
- Make it collaborative by incorporating user-generated content or testimonials`,
          sources: [],
        };
      }

      // Complete generation step
      completeStep("generating");
      updateStep("finalizing", { active: true });

      console.log("��� Expansion successful:", expandedText);
      const parsedContent = safeParseText(expandedText);
      console.log("📝 Parsed content:", parsedContent);

      setExpandedIdeas((prev) => ({
        ...prev,
        [outputId]: {
          ...prev[outputId],
          [ideaNumber]: {
            ideaNumber,
            originalIdea,
            expandedContent: parsedContent,
            isExpanding: false,
          },
        },
      }));

      // Complete all steps
      completeStep("finalizing");
      finishGeneration();
      setIsExpandingIdea(false);
    } catch (error) {
      console.error("��������� Error expanding idea:", error);

      // Provide helpful fallback content even on error
      const fallbackContent = `TARGET: DETAILED CONCEPT
Your original idea has great potential! Here are some ways to develop it further with specific, actionable guidance.

CREATE: HOW TO MAKE
1. Start by researching similar content to understand what works
2. Create a simple outline with 3-5 main points you want to cover
3. Film or write your content in logical sections
4. Review and optimize before publishing

STRUCTURE: Content flow and key talking points
- Strong opening to hook your audience immediately
- Clear, valuable main content that delivers on your promise
- Engaging conclusion with next steps or call-to-action

ENGAGE: Tactics to maximize views and shares
- Use relevant hashtags for better discoverability
- Encourage comments by asking questions
- Share across your social platforms

VARIATIONS: Alternative approaches
- Create multiple formats (video, carousel, blog post)
- Break into a series for more content opportunities
- Add interactive elements like polls or quizzes

*Note: This is a general expansion template. Try the expand button again for a more specific response.*`;

      setExpandedIdeas((prev) => ({
        ...prev,
        [outputId]: {
          ...prev[outputId],
          [ideaNumber]: {
            ideaNumber,
            originalIdea,
            expandedContent: fallbackContent,
            isExpanding: false,
          },
        },
      }));

      // Complete all steps even on error
      completeStep("analyzing");
      completeStep("generating");
      completeStep("finalizing");
      finishGeneration();
      setIsExpandingIdea(false);
    }
  };

  const handleGenerateContent = useCallback((overrideParams?: { youtubeStatsInput?: string; activeTab?: string }) => {
    console.log("����� handleGenerateContent called");
    console.log("���� User:", !!user);
    console.log("🔥 needsSignInForGenerations:", needsSignInForGenerations());
    console.log("🔥 onSignInRequired callback exists:", !!onSignInRequired);

    if (apiKeyMissing) {
      setError("Cannot generate content: VITE_GEMINI_API_KEY is missing.");
      return;
    }

    // Clear expanded ideas when generating new content
    setExpandedIdeas({});
    setCollapsedIdeas({});

    // Check if user needs to sign in first
    if (needsSignInForGenerations()) {
      console.log("🔥 needsSignInForGenerations is true - SHOWING POPUP");
      setShowFreeCreditsPopup(true);
      return;
    }

    // Check subscription limits for authenticated users
    if (!canGenerate()) {
      setError(
        "You've reached your monthly generation limit. Please upgrade your plan to continue.",
      );
      return;
    }

    let currentInput = userInput;
    let currentGenContentType = contentType;

    let actionParams: any = {
      originalUserInput: userInput,
      historyLogContentType: currentGenContentType,
      originalPlatform: platform,
    };

    if (activeTab === "channelAnalysis") {
      // Process input to support channel names and handles
      const processedChannelInput = channelAnalysisInput
        .split(",")
        .map((input) => processYouTubeInput(input.trim()))
        .join(", ");

      currentInput = processedChannelInput;
      currentGenContentType = ContentType.ChannelAnalysis;
      actionParams.channelInput = processedChannelInput;
      actionParams.historyLogContentType = ContentType.ChannelAnalysis;
      actionParams.originalUserInput = channelAnalysisInput; // Keep original for display
      actionParams.originalPlatform = Platform.YouTube;
      if (!currentInput.trim()) {
        setError("Please enter YouTube channel names or URLs.");
        return;
      }
    } else if ((overrideParams?.activeTab || activeTab) === "youtubeStats") {
      // Handle YouTube Stats tab
      // Process input to support channel names and handles
      const currentYoutubeStatsInput = overrideParams?.youtubeStatsInput || youtubeStatsInput;
      const processedInput = currentYoutubeStatsInput
        .split(",")
        .map((input) => processYouTubeInput(input.trim()))
        .join(", ");

      currentInput = processedInput;
      currentGenContentType = ContentType.YoutubeChannelStats;
      actionParams.historyLogContentType = ContentType.YoutubeChannelStats;
      actionParams.originalUserInput = currentYoutubeStatsInput; // Keep original for display
      actionParams.originalPlatform = Platform.YouTube;
      if (!currentInput.trim()) {
        setError("Please enter YouTube channel or video URLs.");
        return;
      }
    } else {
      if (currentGenContentType === ContentType.ImagePrompt) {
        let promptParts = [userInput.trim()].filter((p) => p);
        if (selectedImageStyles.length > 0)
          promptParts.push(`Styles: ${selectedImageStyles.join(", ")}`);
        if (selectedImageMoods.length > 0)
          promptParts.push(`Moods: ${selectedImageMoods.join(", ")}`);
        if (aspectRatioGuidance !== AspectRatioGuidance.None)
          promptParts.push(`Consider aspect ratio: ${aspectRatioGuidance}`);
        currentInput = promptParts.join(". ");
        if (
          !currentInput.trim() &&
          (selectedImageStyles.length > 0 ||
            selectedImageMoods.length > 0 ||
            aspectRatioGuidance !== AspectRatioGuidance.None)
        ) {
          currentInput = `Generate an image with ${promptParts.join(". ")}`;
        }
      } else if (
        currentGenContentType === ContentType.VoiceToScript &&
        userInput.startsWith("blob:")
      ) {
        currentInput =
          "Audio input provided, process transcription for script generation.";
        actionParams.isVoiceInput = true;
      }

      if (
        !currentInput.trim() &&
        ![
          ContentType.ImagePrompt,
          ContentType.TrendAnalysis,
          ContentType.ContentGapFinder,
          ContentType.VoiceToScript,
        ].includes(currentGenContentType)
      ) {
        setError("Please enter a topic or prompt.");
        return;
      }
      if (currentGenContentType === ContentType.ABTest) {
        actionParams.abTestConfig = { isABTesting, abTestType };
        actionParams.historyLogContentType = ContentType.ABTest;
      }
    }
    handleActualGeneration(currentGenContentType, currentInput, actionParams);
  }, [
    apiKeyMissing,
    activeTab,
    contentType,
    userInput,
    channelAnalysisInput,
    selectedImageStyles,
    selectedImageMoods,
    aspectRatioGuidance,
    handleActualGeneration,
    platform,
    isABTesting,
    abTestType,
    setExpandedIdeas,
    courseModules,
    courseDuration,
    courseDifficulty,
    includeAssessments,
    courseObjectives,
  ]);

  const handleRefine = (refinementType: RefinementType) => {
    const currentOutput = displayedOutputItem?.output;
    if (
      currentOutput &&
      typeof currentOutput === "object" &&
      "content" in currentOutput &&
      typeof currentOutput.content === "string"
    ) {
      // Use the content itself as the "userInput" for refinement, not the original user input
      handleActualGeneration(ContentType.RefinedText, currentOutput.content, {
        originalText: currentOutput.content,
        refinementType,
        historyLogContentType: ContentType.RefinedText,
        originalUserInput: displayedOutputItem?.userInput || userInput,
        originalPlatform: displayedOutputItem?.platform || platform,
      });
    } else {
      setError("No text content available to refine.");
    }
    setShowRefineOptions(false);
  };

  const handleTextAction = (actionType: ContentType) => {
    const currentOutputItem = displayedOutputItem;
    if (!currentOutputItem) {
      setError("No output item selected for action.");
      return;
    }

    let textToProcess: string | undefined;
    const output = currentOutputItem.output;

    if (output) {
      if (isGeneratedTextOutput(output)) textToProcess = output.content;
      else if (isContentStrategyPlanOutput(output))
        textToProcess = JSON.stringify(output, null, 2);
    }

    if (!textToProcess) {
      setError(`No text content available for action: ${actionType}`);
      return;
    }

    const actionParams: any = {
      originalText: textToProcess,
      historyLogContentType: actionType,
      originalUserInput: currentOutputItem.userInput,
      originalPlatform: currentOutputItem.platform,
    };

    switch (actionType) {
      case ContentType.Hashtags:
        handleActualGeneration(
          ContentType.Hashtags,
          currentOutputItem.userInput,
          actionParams,
        );
        break;
      case ContentType.Snippets:
        handleActualGeneration(
          ContentType.Snippets,
          currentOutputItem.userInput,
          actionParams,
        );
        break;
      case ContentType.ExplainOutput:
        handleActualGeneration(
          ContentType.ExplainOutput,
          currentOutputItem.userInput,
          actionParams,
        );
        break;
      case ContentType.FollowUpIdeas:
        handleActualGeneration(
          ContentType.FollowUpIdeas,
          currentOutputItem.userInput,
          actionParams,
        );
        break;
      case ContentType.VisualStoryboard:
        handleActualGeneration(
          ContentType.VisualStoryboard,
          currentOutputItem.userInput,
          actionParams,
        );
        break;
      case ContentType.EngagementFeedback:
        actionParams.engagementFeedbackConfig = { originalText: textToProcess };
        handleActualGeneration(
          ContentType.EngagementFeedback,
          currentOutputItem.userInput,
          actionParams,
        );
        break;
      case ContentType.RepurposedContent:
        actionParams.repurposeTargetPlatform = repurposeTargetPlatform;
        actionParams.repurposeTargetContentType = repurposeTargetContentType;
        setIsRepurposeModalOpen(true);
        setContentToActOn(
          isGeneratedTextOutput(output)
            ? output
            : { type: "text", content: textToProcess },
        );
        setOriginalInputForAction(currentOutputItem.userInput);
        setOriginalPlatformForAction(currentOutputItem.platform);
        break;
      case ContentType.MultiPlatformSnippets:
        actionParams.multiPlatformTargets = multiPlatformTargets;
        setIsMultiPlatformModalOpen(true);
        setContentToActOn(
          isGeneratedTextOutput(output)
            ? output
            : { type: "text", content: textToProcess },
        );
        setOriginalInputForAction(currentOutputItem.userInput);
        setOriginalPlatformForAction(currentOutputItem.platform);
        break;
      case ContentType.SeoKeywords:
        actionParams.seoMode = SeoKeywordMode.Suggest;
        handleActualGeneration(
          ContentType.SeoKeywords,
          currentOutputItem.userInput,
          actionParams,
        );
        break;
      case ContentType.YouTubeDescription:
        handleActualGeneration(
          ContentType.YouTubeDescription,
          currentOutputItem.userInput,
          actionParams,
        );
        break;
      case ContentType.TranslateAdapt:
        actionParams.targetLanguage = targetLanguage;
        setIsLanguageModalOpen(true);
        setContentToActOn(
          isGeneratedTextOutput(output)
            ? output
            : { type: "text", content: textToProcess },
        );
        setOriginalInputForAction(currentOutputItem.userInput);
        setOriginalPlatformForAction(currentOutputItem.platform);
        break;
      case ContentType.CheckReadability:
        actionParams.refinementType = RefinementType.SimplifyLanguage;
        handleActualGeneration(
          ContentType.CheckReadability,
          currentOutputItem.userInput,
          actionParams,
        );
        break;
      case ContentType.OptimizePrompt:
        actionParams.originalContentTypeForOptimization =
          currentOutputItem.contentType || contentType;
        handleActualGeneration(
          ContentType.OptimizePrompt,
          textToProcess,
          actionParams,
        );
        break;
      default:
        setError(
          `Action ${actionType} not fully implemented for unified handler.`,
        );
    }
    setShowTextActionOptions(false);
  };

  // Magic Tools: Text Regeneration Handlers
  const handleRegenerateText = (selectedText: string, context: any) => {
    if (!selectedText.trim()) {
      setError("No text selected for regeneration.");
      return;
    }

    // Create a regeneration prompt with context
    const regenerationPrompt = `Regenerate this text: "${selectedText}"

    Context before: ${context.before || ''}
    Context after: ${context.after || ''}

    Keep the same tone and style, but create a fresh version with improved clarity and engagement.`;

    handleActualGeneration(ContentType.RefinedText, regenerationPrompt, {
      originalText: selectedText,
      refinementType: RefinementType.MoreEngaging,
      historyLogContentType: ContentType.RefinedText,
      originalUserInput: displayedOutputItem?.userInput || userInput,
      originalPlatform: displayedOutputItem?.platform || platform,
      isTextSelection: true,
      selectionContext: context,
    });
  };

  // Enhanced async handlers for preview system using Gemini directly
  const handleRegenerateTextAsync = async (selectedText: string, context: any): Promise<string> => {
    if (!selectedText.trim()) {
      throw new Error("No text selected for regeneration.");
    }

    const regenerationPrompt = `Regenerate this text: "${selectedText}"

    Context before: ${context.before || ''}
    Context after: ${context.after || ''}

    Keep the same tone and style, but create a fresh version with improved clarity and engagement.
    Return ONLY the regenerated text without any additional formatting or explanations.`;

    try {
      // Use Gemini service directly for instant results
      const { generateTextContent } = await import('./services/geminiService');

      console.log('🎯 Regenerating text:', selectedText);
      const generationOptions = {
        userInput: regenerationPrompt,
        contentType: ContentType.RefinedText,
        platform: platform,
        originalText: selectedText,
        refinementType: RefinementType.MoreEngaging,
        useWebSearch: false,
      };

      console.log('🎯 Regeneration options:', generationOptions);
      const result = await generateTextContent(generationOptions);

      if (result && result.text) {
        return result.text.trim();
      }
      throw new Error("Failed to generate text");
    } catch (error) {
      console.error("Regeneration error:", error);
      throw error;
    }
  };

  const handleRefineSelectedText = (selectedText: string, action: string) => {
    if (!selectedText.trim()) {
      setError("No text selected for refinement.");
      return;
    }

    let refinementPrompt = "";
    let refinementType = RefinementType.MoreEngaging;

    switch (action) {
      case 'expand':
        refinementPrompt = `Expand and add more detail to this text: "${selectedText}"`;
        refinementType = RefinementType.Longer;
        break;
      case 'simplify':
        refinementPrompt = `Simplify and make this text easier to understand: "${selectedText}"`;
        refinementType = RefinementType.SimplifyLanguage;
        break;
      case 'professional':
        refinementPrompt = `Rewrite this text in a professional tone: "${selectedText}"`;
        refinementType = RefinementType.MoreFormal;
        break;
      default:
        refinementPrompt = `Improve this text: "${selectedText}"`;
    }

    handleActualGeneration(ContentType.RefinedText, refinementPrompt, {
      originalText: selectedText,
      refinementType,
      historyLogContentType: ContentType.RefinedText,
      originalUserInput: displayedOutputItem?.userInput || userInput,
      originalPlatform: displayedOutputItem?.platform || platform,
      isTextSelection: true,
      selectionAction: action,
    });
  };

  const handleRefineSelectedTextAsync = async (selectedText: string, action: string): Promise<string> => {
    if (!selectedText.trim()) {
      throw new Error("No text selected for refinement.");
    }

    let refinementPrompt = "";

    switch (action) {
      case 'expand':
        refinementPrompt = `Expand and add more detail to this text: "${selectedText}". Return ONLY the expanded text without any additional formatting or explanations.`;
        break;
      case 'simplify':
        refinementPrompt = `Simplify and make this text easier to understand: "${selectedText}". Return ONLY the simplified text without any additional formatting or explanations.`;
        break;
      case 'professional':
        refinementPrompt = `Rewrite this text in a professional tone: "${selectedText}". Return ONLY the professional version without any additional formatting or explanations.`;
        break;
      case 'casual':
        refinementPrompt = `Rewrite this text in a casual, conversational tone: "${selectedText}". Return ONLY the casual version without any additional formatting or explanations.`;
        break;
      case 'creative':
        refinementPrompt = `Rewrite this text in a more creative and engaging way: "${selectedText}". Return ONLY the creative version without any additional formatting or explanations.`;
        break;
      case 'add-emojis':
        refinementPrompt = `Add relevant emojis to this text: "${selectedText}". Return ONLY the text with emojis without any additional formatting or explanations.`;
        break;
      case 'bullet-points':
        refinementPrompt = `Convert this text to bullet points: "${selectedText}". Return ONLY the bullet points without any additional formatting or explanations.`;
        break;
      default:
        refinementPrompt = `Improve this text: "${selectedText}". Return ONLY the improved text without any additional formatting or explanations.`;
    }

    try {
      // Use Gemini service directly for instant results
      const { generateTextContent } = await import('./services/geminiService');

      console.log('🎯 Refining text:', selectedText, 'with action:', action);

      // Map action to refinement type
      let refinementType = RefinementType.MoreEngaging;
      switch (action) {
        case 'expand':
          refinementType = RefinementType.Longer;
          break;
        case 'simplify':
          refinementType = RefinementType.Shorter;
          break;
        case 'professional':
          refinementType = RefinementType.MoreFormal;
          break;
        case 'casual':
          refinementType = RefinementType.MoreCasual;
          break;
        case 'creative':
          refinementType = RefinementType.MoreEngaging;
          break;
        case 'add-emojis':
          refinementType = RefinementType.AddEmojis;
          break;
        case 'bullet-points':
          refinementType = RefinementType.MoreEngaging; // Will use custom prompt
          break;
      }

      const generationOptions = {
        userInput: refinementPrompt,
        contentType: ContentType.RefinedText,
        platform: platform,
        originalText: selectedText,
        refinementType: refinementType,
        useWebSearch: false,
      };

      console.log('🎯 Generation options:', generationOptions);
      const result = await generateTextContent(generationOptions);

      if (result && result.text) {
        return result.text.trim();
      }
      throw new Error("Failed to refine text");
    } catch (error) {
      console.error("Refinement error:", error);
      throw error;
    }
  };

  const handleCustomAction = (selectedText: string, action: string, toolId: string) => {
    if (!selectedText.trim()) {
      setError("No text selected for custom action.");
      return;
    }

    // Handle different custom actions based on toolId
    switch (toolId) {
      case 'analyze-sentiment':
        // Create a sentiment analysis prompt
        const sentimentPrompt = `Analyze the sentiment and emotional tone of this text: "${selectedText}"

        Provide a detailed analysis including:
        - Overall sentiment (positive, negative, neutral)
        - Emotional tone
        - Key phrases that indicate sentiment
        - Suggestions for improvement if needed`;

        handleActualGeneration(ContentType.EngagementFeedback, sentimentPrompt, {
          originalText: selectedText,
          historyLogContentType: ContentType.EngagementFeedback,
          originalUserInput: displayedOutputItem?.userInput || userInput,
          originalPlatform: displayedOutputItem?.platform || platform,
          isTextSelection: true,
          customAction: action,
          toolId,
        });
        break;

      case 'translate-spanish':
        // Create a translation prompt
        const translatePrompt = `Translate this text to Spanish while maintaining the original meaning and tone: "${selectedText}"`;

        handleActualGeneration(ContentType.TranslateAdapt, translatePrompt, {
          originalText: selectedText,
          targetLanguage: 'Spanish',
          historyLogContentType: ContentType.TranslateAdapt,
          originalUserInput: displayedOutputItem?.userInput || userInput,
          originalPlatform: displayedOutputItem?.platform || platform,
          isTextSelection: true,
          customAction: action,
          toolId,
        });
        break;

      default:
        // Handle generic custom actions
        const customPrompt = `Apply "${action}" to this text: "${selectedText}"`;

        handleActualGeneration(ContentType.RefinedText, customPrompt, {
          originalText: selectedText,
          refinementType: RefinementType.MoreEngaging,
          historyLogContentType: ContentType.RefinedText,
          originalUserInput: displayedOutputItem?.userInput || userInput,
          originalPlatform: displayedOutputItem?.platform || platform,
          isTextSelection: true,
          customAction: action,
          toolId,
        });
    }
  };

  const handleCustomActionAsync = async (selectedText: string, action: string, toolId: string): Promise<string> => {
    if (!selectedText.trim()) {
      throw new Error("No text selected for custom action.");
    }

    let customPrompt = "";

    switch (toolId) {
      case 'analyze-sentiment':
        customPrompt = `Analyze the sentiment and emotional tone of this text: "${selectedText}"

        Provide a detailed analysis including:
        - Overall sentiment (positive, negative, neutral)
        - Emotional tone
        - Key phrases that indicate sentiment
        - Suggestions for improvement if needed

        Return ONLY the analysis without any additional formatting.`;
        break;

      case 'translate-spanish':
        customPrompt = `Translate this text to Spanish while maintaining the original meaning and tone: "${selectedText}". Return ONLY the translated text without any additional formatting or explanations.`;
        break;

      default:
        customPrompt = `Apply "${action}" to this text: "${selectedText}". Return ONLY the processed text without any additional formatting or explanations.`;
    }

    try {
      // Use Gemini service directly for instant results
      const { generateTextContent } = await import('./services/geminiService');

      // Determine the correct content type and parameters
      let contentType = ContentType.RefinedText;
      let options: any = {
        userInput: customPrompt,
        contentType: contentType,
        platform: platform,
        useWebSearch: false,
      };

      // For refinement-type actions, provide originalText and refinementType
      if (toolId === 'analyze-sentiment') {
        contentType = ContentType.EngagementFeedback;
        options.contentType = contentType;
      } else if (toolId === 'translate-spanish') {
        contentType = ContentType.TranslateAdapt;
        options.contentType = contentType;
        options.targetLanguage = 'Spanish';
        options.originalText = selectedText;
      } else {
        // For other custom actions, treat as refinement
        options.originalText = selectedText;
        options.refinementType = RefinementType.MoreEngaging;
      }

      const result = await generateTextContent(options);

      if (result && result.text) {
        return result.text.trim();
      }
      throw new Error("Failed to process custom action");
    } catch (error) {
      console.error("Custom action error:", error);
      throw error;
    }
  };

  const handleSaveTemplate = () => {
    if (currentTemplate) {
      setTemplates(
        templates.map((t) =>
          t.id === currentTemplate.id
            ? {
                ...currentTemplate,
                userInput,
                platform,
                contentType,
                targetAudience,
                batchVariations,
                includeCTAs,
                selectedImageStyles,
                selectedImageMoods,
                negativePrompt: negativeImagePrompt,
                seoKeywords,
                seoMode,
                seoIntensity,
                abTestConfig: { isABTesting, abTestType },
                aiPersonaId: selectedAiPersonaId,
                aspectRatioGuidance,
                videoLength,
                customVideoLength,
              }
            : t,
        ),
      );
    } else {
      const newTemplateName = prompt(
        "Enter template name:",
        `New ${contentType} Template`,
      );
      if (newTemplateName) {
        const newTemplate: PromptTemplate = {
          id: `tpl-${Date.now()}`,
          name: newTemplateName,
          userInput,
          platform,
          contentType,
          targetAudience,
          batchVariations,
          includeCTAs,
          selectedImageStyles,
          selectedImageMoods,
          negativePrompt: negativeImagePrompt,
          seoKeywords,
          seoMode,
          seoIntensity,
          abTestConfig: { isABTesting, abTestType },
          aiPersonaId: selectedAiPersonaId,
          aspectRatioGuidance,
          videoLength,
          customVideoLength,
        };
        setTemplates([...templates, newTemplate]);
      }
    }
    setCurrentTemplate(null);
    setShowTemplateModal(false);
  };

  const handleLoadTemplate = (template: PromptTemplate) => {
    // Set input to generator tab since templates are for content generation
    setGeneratorInput(template.userInput);
    setPlatform(template.platform);
    setContentType(template.contentType);
    setTargetAudience(template.targetAudience || "");
    setBatchVariations(
      template.batchVariations ||
        (template.contentType === ContentType.Idea || template.contentType === ContentType.ThumbnailConcept ? 2 :
         template.contentType === ContentType.VideoHook ? 4 : 1),
    );
    setIncludeCTAs(template.includeCTAs || false);
    setSelectedImageStyles(template.selectedImageStyles || []);
    setSelectedImageMoods(template.selectedImageMoods || []);
    setNegativeImagePrompt(template.negativePrompt || "");
    setSeoKeywords(template.seoKeywords || "");
    setSeoMode(template.seoMode || SeoKeywordMode.Incorporate);
    setSeoIntensity(template.seoIntensity || SeoIntensity.Moderate);
    setIsABTesting(template.abTestConfig?.isABTesting || false);
    setAbTestType(template.abTestConfig?.abTestType || undefined);
    setSelectedAiPersonaId(template.aiPersonaId || DEFAULT_AI_PERSONAS[0].id);
    setAspectRatioGuidance(
      template.aspectRatioGuidance || AspectRatioGuidance.None,
    );
    setVideoLength(template.videoLength || "1-2 minutes");
    setCustomVideoLength(template.customVideoLength || "");

    setCurrentTemplate(template);
    setShowTemplateModal(false);
    setGeneratedOutput(null);
    setViewingHistoryItemId(null);
    setActiveTab("generator");
  };

  const handleDeleteTemplate = (templateId: string) => {
    if (confirm("Are you sure you want to delete this template?")) {
      setTemplates(templates.filter((t) => t.id !== templateId));
    }
  };

  const handleDuplicateTemplate = (template: PromptTemplate) => {
    const duplicatedTemplate: PromptTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      createdAt: new Date().toISOString()
    };
    setTemplates([...templates, duplicatedTemplate]);
  };

  const handleToggleFavorite = (itemId: string) => {
    setHistory(
      history.map((item) =>
        item.id === itemId ? { ...item, isFavorite: !item.isFavorite } : item,
      ),
    );
  };

  const handleRateCurrentContent = async (rating: 1 | -1 | 0) => {
    if (!displayedOutputItem) return;

    try {
      // If we're viewing a history item, update it in the history
      if (viewingHistoryItemId && displayedOutputItem.id !== "current_generation") {
        setHistory(
          history.map((item) =>
            item.id === displayedOutputItem.id
              ? { ...item, rating }
              : item
          )
        );

        // Update enhanced history service
        await enhancedHistoryService.updateRating(displayedOutputItem.id, rating);
      } else {
        // For current generation, we need to save it to history first if it's not already there
        const existingHistoryItem = history.find(item =>
          item.userInput === displayedOutputItem.userInput &&
          item.contentType === displayedOutputItem.contentType &&
          item.platform === displayedOutputItem.platform
        );

        if (existingHistoryItem) {
          // Update existing item
          setHistory(
            history.map((item) =>
              item.id === existingHistoryItem.id
                ? { ...item, rating }
                : item
            )
          );
          await enhancedHistoryService.updateRating(existingHistoryItem.id, rating);
        } else {
          // Add new item to history with rating
          const newHistoryItem: HistoryItem = {
            ...displayedOutputItem,
            id: crypto.randomUUID(),
            rating,
          };
          addHistoryItemToState(newHistoryItem);
        }
      }

      console.log(`Content rated: ${rating === 1 ? '👍 Good' : rating === -1 ? '👎 Needs improvement' : '🔄 Rating removed'}`);
    } catch (error) {
      console.error('Error updating content rating:', error);
    }
  };

  const handleRateCurrentContentWithFirebase = async (rating: 1 | -1 | 0, contentText: string) => {
    if (!displayedOutputItem) return;

    try {
      const { auth } = await import('./src/config/firebase');
      const { collection, doc, setDoc, updateDoc, getDoc } = await import('firebase/firestore');
      const { db } = await import('./src/config/firebase');

      const user = auth.currentUser;
      if (!user) {
        console.warn('User not authenticated, saving locally only');
        await handleRateCurrentContent(rating);
        return;
      }

      // Create a rating record to save directly to Firebase
      const ratingData = {
        userId: user.uid,
        contentId: displayedOutputItem.id,
        rating: rating,
        contentText: contentText,
        output: displayedOutputItem.output,
        platform: displayedOutputItem.platform,
        contentType: displayedOutputItem.contentType,
        userInput: displayedOutputItem.userInput,
        timestamp: Date.now(),
        createdAt: new Date().toISOString(),
      };

      // Save directly to Firebase in a dedicated ratings collection
      const ratingDocRef = doc(collection(db, 'users', user.uid, 'content_ratings'), displayedOutputItem.id);
      await setDoc(ratingDocRef, ratingData, { merge: true });

      // Also update the regular history through enhanced service
      await handleRateCurrentContent(rating);

      console.log(`✅ Content rating saved to Firebase: ${rating === 1 ? '👍 Good' : rating === -1 ? '👎 Needs improvement' : '🔄 Rating removed'}`);
    } catch (error) {
      console.error('Firebase rating save failed, falling back to local storage:', error);
      // Fallback to local storage if Firebase fails
      await handleRateCurrentContent(rating);
    }
  };

  const handleViewHistoryItem = (item: HistoryItem) => {
    setViewingHistoryItemId(item.id);
    setPlatform(item.platform);
    setContentType(item.contentType);

    // Set input to appropriate tab based on content type
    if (item.contentType === ContentType.YoutubeChannelStats) {
      setYoutubeStatsInput(item.userInput);
      setActiveTab("youtubeStats");
    } else if (item.contentType === ContentType.ChannelAnalysis) {
      setChannelAnalysisInput(item.userInput);
      setActiveTab("channelAnalysis");
    } else {
      setGeneratorInput(item.userInput);
      setActiveTab("generator");
    }

    setTargetAudience(item.targetAudience || "");
    setBatchVariations(
      item.batchVariations ||
      (item.contentType === ContentType.Idea || item.contentType === ContentType.ThumbnailConcept ? 2 :
       item.contentType === ContentType.VideoHook ? 4 : 1),
    );
    setSelectedAiPersonaId(item.aiPersonaId || DEFAULT_AI_PERSONAS[0].id);
    setTargetLanguage(item.targetLanguage || Language.English);
    setAbTestResults(item.abTestResults || null);

    if (
      item.contentType === ContentType.ChannelAnalysis &&
      Array.isArray(item.output) &&
      item.output.every((s) => "title" in s && "content" in s)
    ) {
      setParsedChannelAnalysis(item.output as ParsedChannelAnalysisSection[]);
      setActiveTab("channelAnalysis");
    } else if (
      item.contentType === ContentType.ContentStrategyPlan &&
      isContentStrategyPlanOutput(item.output)
    ) {
      setGeneratedStrategyPlan(item.output);
      setActiveTab("strategy");
    } else if (
      item.contentType === ContentType.TrendAnalysis &&
      isTrendAnalysisOutput(item.output)
    ) {
      setGeneratedTrendAnalysis(item.output);
      setActiveTab("trends");
    } else {
      setGeneratedOutput(item.output);
      setActiveTab("generator");
    }
    setShowRefineOptions(false);
    setShowTextActionOptions(false);
  };

  const handleDeleteHistoryItem = (itemId: string) => {
    if (confirm("Are you sure you want to delete this history item?")) {
      setHistory(history.filter((item) => item.id !== itemId));
      if (viewingHistoryItemId === itemId) {
        setViewingHistoryItemId(null);
        setGeneratedOutput(null);
      }
      setCanvasItems((prev) =>
        prev.filter((canvasItem) => canvasItem.historyItemId !== itemId),
      );
    }
  };

  const handleDeleteYoutubeStatsEntry = useCallback((id: string) => {
    if (confirm("Are you sure you want to delete this YouTube stats entry?")) {
      setYoutubeStatsData((prev) => prev.filter((entry) => entry.id !== id));
    }
  }, []);

  const handlePinYoutubeStatsToCanvas = useCallback(
    (entry: YoutubeStatsEntry) => {
      const newId = crypto.randomUUID();
      const newCanvasItem: CanvasItem = {
        id: newId,
        type: "textElement",
        content: `YouTube Stats for ${entry.userInput}:\n\n${entry.content}`,
        x: (Math.random() * 200 + 50 - canvasOffset.x) / zoomLevel,
        y: (Math.random() * 200 + 50 - canvasOffset.y) / zoomLevel,
        zIndex: nextZIndex,
        width: 300,
        height: 200,
        textColor: "#E0E7FF",
        backgroundColor: "rgba(30,41,59,0.9)",
        fontFamily: "Arial",
        fontSize: "14px",
        fontWeight: "normal",
        fontStyle: "normal",
        textDecoration: "none",
      };
      const updatedItems = [...canvasItems, newCanvasItem];
      const newNextOverallZ = nextZIndex + 1;
      setCanvasItems(updatedItems);
      setNextZIndex(newNextOverallZ);
      commitCurrentStateToHistory(
        updatedItems,
        newNextOverallZ,
        canvasOffset,
        zoomLevel,
      );
      setSelectedCanvasItemId(newId);
      setActiveTab("canvas");
    },
    [
      canvasItems,
      nextZIndex,
      canvasOffset,
      zoomLevel,
      commitCurrentStateToHistory,
    ],
  );

  // Open strategy creation modal
  const handleGeneratePremiumStrategy = useCallback(() => {
    console.log("🚀 Create Strategy button clicked!");
    console.log("Current showStrategyModal state:", showStrategyModal);
    setShowStrategyModal(true);
    console.log("Setting showStrategyModal to true");
    setTimeout(() => {
      console.log("🕐 State after timeout:", showStrategyModal);
    }, 100);
  }, [showStrategyModal]);

  // Current strategy configuration object
  const currentStrategyConfig = useMemo(() => ({
    niche: strategyNiche,
    targetAudience: strategyAudience,
    goals: strategyGoals,
    platforms: strategyPlatforms,
    timeframe: strategyTimeframe,
    budget: strategyBudget,
    contentTypes: strategyContentTypes,
    competitorAnalysis: strategyCompetitorAnalysis,
    aiPersona: strategyAiPersona,
    industryFocus: strategyIndustryFocus,
    geographicFocus: strategyGeographicFocus,
    languagePreferences: strategyLanguagePreferences,
  }), [
    strategyNiche, strategyAudience, strategyGoals, strategyPlatforms,
    strategyTimeframe, strategyBudget, strategyContentTypes,
    strategyCompetitorAnalysis, strategyAiPersona, strategyIndustryFocus,
    strategyGeographicFocus, strategyLanguagePreferences
  ]);

  // Strategy config change handler for template population
  const handleStrategyConfigChange = useCallback((config: any) => {
    console.log("📝 Applying template configuration:", config);

    // Update all strategy form fields with template values
    if (config.niche) setStrategyNiche(config.niche);
    if (config.targetAudience) setStrategyAudience(config.targetAudience);
    if (config.goals) setStrategyGoals(config.goals);
    if (config.platforms) setStrategyPlatforms(config.platforms);
    if (config.timeframe) setStrategyTimeframe(config.timeframe);
    if (config.budget) setStrategyBudget(config.budget);
    if (config.contentTypes) setStrategyContentTypes(config.contentTypes);
    if (config.competitorAnalysis !== undefined) setStrategyCompetitorAnalysis(config.competitorAnalysis);
    if (config.aiPersona) setStrategyAiPersona(config.aiPersona);
    if (config.industryFocus) setStrategyIndustryFocus(config.industryFocus);
    if (config.geographicFocus) setStrategyGeographicFocus(config.geographicFocus);
    if (config.languagePreferences) setStrategyLanguagePreferences(config.languagePreferences);

    console.log("✅ Template configuration applied successfully");
  }, [
    setStrategyNiche, setStrategyAudience, setStrategyGoals, setStrategyPlatforms,
    setStrategyTimeframe, setStrategyBudget, setStrategyContentTypes,
    setStrategyCompetitorAnalysis, setStrategyAiPersona, setStrategyIndustryFocus,
    setStrategyGeographicFocus, setStrategyLanguagePreferences
  ]);

  // Premium strategy generation handler
  const handleGenerateStrategyWithConfig = useCallback(
    async (config: any) => {
      setIsGeneratingStrategy(true);
      setStrategyError(null);
      setGenerationSourceTab("strategy");
      setStrategyGenerationStartTime(new Date());

      // Preserve the strategy generation source tab
      const originalGenerationSourceTab = "strategy";

      try {
        // Convert premium config to strategy generation params
        const strategyResult = await handleActualGeneration(
          ContentType.ContentStrategyPlan,
          config.niche,
          {
            strategyConfig: {
              niche: config.niche,
              targetAudience: config.targetAudience,
              goals: config.goals,
              platforms: config.platforms,
              timeframe: config.timeframe,
              budget: config.budget,
              contentTypes: config.contentTypes,
              competitorAnalysis: config.competitorAnalysis,
              aiPersona: config.aiPersona,
            },
            historyLogContentType: ContentType.ContentStrategyPlan,
            originalUserInput: config.niche,
            originalPlatform: platform,
          },
        );

        // Restore the strategy generation source tab
        setGenerationSourceTab(originalGenerationSourceTab);

        // Close the strategy modal on successful generation
        setShowStrategyModal(false);
      } catch (error) {
        setStrategyError(
          error instanceof Error
            ? error.message
            : "Failed to generate strategy",
        );
      } finally {
        setIsGeneratingStrategy(false);
        setGenerationSourceTab(null);
        setStrategyGenerationStartTime(null);
      }
    },
    [platform, setShowStrategyModal],
  );

  const handlePinStrategyPlanToCanvas = useCallback(
    (strategyPlan: ContentStrategyPlanOutput, niche: string) => {
      const newId = crypto.randomUUID();

      // Create a comprehensive but concise summary for the canvas
      const strategySummary = `������������ CONTENT STRATEGY: ${niche}

����������������������������������� TARGET AUDIENCE:
${strategyPlan.targetAudienceOverview.substring(0, 200)}${strategyPlan.targetAudienceOverview.length > 200 ? "..." : ""}

��������� GOALS:
${strategyPlan.goals.map((goal) => `• ${goal}`).join("\n")}

������������������ CONTENT PILLARS:
${strategyPlan.contentPillars.map((pillar) => `���� ${pillar.pillarName}: ${pillar.description.substring(0, 100)}${pillar.description.length > 100 ? "..." : ""}`).join("\n")}

���� POSTING SCHEDULE:
${strategyPlan.suggestedWeeklySchedule.map((item) => `������� ${item.dayOfWeek}: ${item.contentType} (${item.optimalTime})`).join("\n")}

🔍 SEO KEYWORDS:
${strategyPlan.seoStrategy.primaryKeywords.join(", ")}

������������������ KEY CTAs:
${strategyPlan.ctaStrategy.engagementCTAs.slice(0, 3).join(", ")}

��� Full strategy plan available in Strategy tab`;

      const newCanvasItem: CanvasItem = {
        id: newId,
        type: "textElement",
        content: strategySummary,
        x: (Math.random() * 200 + 50 - canvasOffset.x) / zoomLevel,
        y: (Math.random() * 200 + 50 - canvasOffset.y) / zoomLevel,
        zIndex: nextZIndex,
        width: 400,
        height: 600,
        textColor: "#E0E7FF",
        backgroundColor: "rgba(30,41,59,0.95)",
        fontFamily: "Arial",
        fontSize: "12px",
        fontWeight: "normal",
        fontStyle: "normal",
        textDecoration: "none",
      };
      const updatedItems = [...canvasItems, newCanvasItem];
      const newNextOverallZ = nextZIndex + 1;
      setCanvasItems(updatedItems);
      setNextZIndex(newNextOverallZ);
      commitCurrentStateToHistory(
        updatedItems,
        newNextOverallZ,
        canvasOffset,
        zoomLevel,
      );
      setSelectedCanvasItemId(newId);
      setActiveTab("canvas");
    },
    [
      canvasItems,
      nextZIndex,
      canvasOffset,
      zoomLevel,
      commitCurrentStateToHistory,
    ],
  );

  const handleClearAppHistory = () => {
    if (
      window.confirm(
        "Clear all app history (generator, channel analysis, strategy, trends)? This cannot be undone.",
      )
    ) {
      setHistory([]);
      setParsedChannelAnalysis(null);
      setChannelAnalysisSummary(null);
      setGeneratedStrategyPlan(null);
      setGeneratedTrendAnalysis(null);
      setRecentTrendQueries([]);

      // Clear all tab states
      setTabStates({
        generator: { inputs: null, outputs: null },
        canvas: { inputs: null, outputs: null },
        channelAnalysis: { inputs: null, outputs: null },
        youtubeStats: { inputs: null, outputs: null },
        thumbnailMaker: { inputs: null, outputs: null },
        strategy: { inputs: null, outputs: null },
        calendar: { inputs: null, outputs: null },
        trends: { inputs: null, outputs: null },
        history: { inputs: null, outputs: null },
        search: { inputs: null, outputs: null },
        studioHub: { inputs: null, outputs: null },
      });
      setViewingHistoryItemId(null);
      setGeneratedOutput(null);
    }
  };

  const handleReusePromptFromHistory = (item: HistoryItem) => {
    if (item.contentType === ContentType.ChannelAnalysis) {
      setChannelAnalysisInput(item.userInput);
      setActiveTab("channelAnalysis");
    } else {
      setPlatform(item.platform);
      const isActionType = !USER_SELECTABLE_CONTENT_TYPES.find(
        (ct) => ct.value === item.contentType,
      );
      setContentType(isActionType ? ContentType.Idea : item.contentType);

      // Set input to appropriate tab based on content type
      if (item.contentType === ContentType.YoutubeChannelStats) {
        setYoutubeStatsInput(item.userInput);
        setActiveTab("youtubeStats");
      } else {
        setGeneratorInput(item.userInput);
        setActiveTab("generator");
      }

      setTargetAudience(item.targetAudience || "");
      setBatchVariations(
      item.batchVariations ||
      (item.contentType === ContentType.Idea || item.contentType === ContentType.ThumbnailConcept ? 2 :
       item.contentType === ContentType.VideoHook ? 4 : 1),
    );
      setSelectedAiPersonaId(item.aiPersonaId || DEFAULT_AI_PERSONAS[0].id);
      setNegativeImagePrompt("");
      setSelectedImageStyles([]);
      setSelectedImageMoods([]);
      setSeoKeywords("");
      setIncludeCTAs(false);
      setAspectRatioGuidance(AspectRatioGuidance.None);
      if (
        item.contentType === ContentType.ABTest &&
        item.abTestResults &&
        item.abTestResults.length > 0
      ) {
        const firstVariation = item.abTestResults[0].variation;
        if (firstVariation.type === "thumbnail_concept")
          setAbTestType(ABTestableContentType.ThumbnailConcept);
        else if (
          firstVariation.type === "text" &&
          item.contentType === ContentType.ABTest &&
          item.userInput.toLowerCase().includes("title")
        )
          setAbTestType(ABTestableContentType.Title);
        else if (
          firstVariation.type === "text" &&
          item.contentType === ContentType.ABTest &&
          item.userInput.toLowerCase().includes("hook")
        )
          setAbTestType(ABTestableContentType.VideoHook);
      }
      setActiveTab("generator");
    }
    document.querySelector("textarea")?.focus();
  };

  const handleUseHistoryItem = (item: HistoryItem) => {
    handleReusePromptFromHistory(item);
  };

  const handleRepurpose = () => {
    handleTextAction(ContentType.RepurposedContent);
  };

  const handleMultiPlatform = () => {
    handleTextAction(ContentType.MultiPlatformSnippets);
  };

  const handleChannelAnalyze = () => {
    handleTextAction(ContentType.ChannelAnalysis);
  };

  const handleTranslateAdapt = () => {
    handleTextAction(ContentType.TranslatedContent);
  };

  const handleOptimizePrompt = () => {
    handleTextAction(ContentType.OptimizePrompt);
  };

  const handleContentBrief = () => {
    handleTextAction(ContentType.ContentBrief);
  };

  const handleEngagementFeedback = () => {
    handleTextAction(ContentType.EngagementFeedback);
  };

  const handleHashtagGeneration = () => {
    handleTextAction(ContentType.Hashtags);
  };

  const handleSnippetExtraction = () => {
    handleTextAction(ContentType.Snippets);
  };

  const handleThumbnailConcept = () => {
    handleTextAction(ContentType.ThumbnailConcept);
  };

  const handleVisualStoryboard = () => {
    handleTextAction(ContentType.VisualStoryboard);
  };

  const handleExplainOutput = () => {
    handleTextAction(ContentType.ExplainOutput);
  };

  const handleFollowUpIdeas = () => {
    handleTextAction(ContentType.FollowUpIdeas);
  };

  const handleSeoKeywordSuggestion = () => {
    handleTextAction(ContentType.SeoKeywordSuggestion);
  };

  const handleReadabilityCheck = () => {
    handleTextAction(ContentType.ReadabilityCheck);
  };

  // Premium upgrade handlers
  const handleUpgrade = (plan: "pro" | "enterprise") => {
    console.log(`Upgrading to ${plan} plan`);
    setUserPlan(plan);
    setShowUpgradeModal(false);
    // In real implementation, this would integrate with payment processing
    alert(
      `Successfully upgraded to ${plan.charAt(0).toUpperCase() + plan.slice(1)} plan!`,
    );
  };

  const handleShowUpgrade = () => {
    if (onNavigateToBilling) {
      onNavigateToBilling();
      // Scroll to plans section after a delay to allow page navigation
      setTimeout(() => {
        const plansSection = document.getElementById("plans-section");
        if (plansSection) {
          plansSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300);
    } else {
      setShowUpgradeModal(true);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setShowUserMenu(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Premium feature handlers
  const handleApplyPremiumTemplate = (template: any) => {
    setSelectedPremiumTemplate(template);
    console.log("Premium template applied:", template.name);
  };

  const handleApplyCustomPersona = (persona: any) => {
    setSelectedCustomPersona(persona);
    console.log("Custom persona applied:", persona.name);
  };

  const handleSetSEOConfig = (config: any) => {
    setPremiumSEOConfig(config);
    console.log("SEO config applied:", config);
  };

  const handleSetAIBoost = (enabled: boolean) => {
    setAiBoostEnabled(enabled);
  };

  const handleUseAsCanvasBackground = useCallback(() => {
    // Function to use content as canvas background
    // This can be implemented later based on canvas functionality
    console.log("Use as canvas background requested");
    AppNotifications.show(
      "Feature Coming Soon",
      "Canvas background feature will be available in a future update",
      "info",
      3000
    );
  }, []);

  // Thumbnail notification handlers
  const handleNotifyMeClick = () => {
    setShowNotificationModal(true);
    setNotificationError(null);
  };

  // Web search notification handlers
  const handleWebSearchNotifyMeClick = () => {
    setShowWebSearchNotificationModal(true);
    setWebSearchNotificationError(null);
  };

  // Thumbnail preview handler
  const handleViewPreview = () => {
    setShowThumbnailPreview(true);
  };

  const handleNotificationSubmit = async () => {
    if (!notificationEmail.trim()) {
      setNotificationError("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(notificationEmail)) {
      setNotificationError("Please enter a valid email address");
      return;
    }

    try {
      // Subscribe to EmailOctopus
      const result = await subscribeToThumbnailNotifications({
        email: notificationEmail,
        firstName: notificationFirstName,
        lastName: notificationLastName,
      });

      if (result.success) {
        setNotificationSubmitted(true);
        setTimeout(() => {
          setShowNotificationModal(false);
          setNotificationSubmitted(false);
          setNotificationEmail("");
          setNotificationFirstName("");
          setNotificationLastName("");
        }, 2000);
      } else {
        setNotificationError(
          result.error || "Failed to subscribe. Please try again.",
        );
      }
    } catch (error) {
      console.error("Notification subscription error:", error);
      setNotificationError("Failed to subscribe. Please try again.");
    }
  };

  const handleCloseNotificationModal = () => {
    setShowNotificationModal(false);
    setNotificationEmail("");
    setNotificationFirstName("");
    setNotificationLastName("");
    setNotificationError(null);
    setNotificationSubmitted(false);
  };

  const handleWebSearchNotificationSubmit = async () => {
    if (!webSearchNotificationEmail.trim()) {
      setWebSearchNotificationError("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(webSearchNotificationEmail)) {
      setWebSearchNotificationError("Please enter a valid email address");
      return;
    }

    try {
      // Subscribe to EmailOctopus for web search notifications
      const result = await subscribeToThumbnailNotifications({
        email: webSearchNotificationEmail,
        firstName: webSearchNotificationFirstName,
        lastName: webSearchNotificationLastName,
      });

      if (result.success) {
        setWebSearchNotificationSubmitted(true);
        setTimeout(() => {
          setShowWebSearchNotificationModal(false);
          setWebSearchNotificationSubmitted(false);
          setWebSearchNotificationEmail("");
          setWebSearchNotificationFirstName("");
          setWebSearchNotificationLastName("");
        }, 2000);
      } else {
        setWebSearchNotificationError(
          result.error || "Failed to subscribe. Please try again.",
        );
      }
    } catch (error) {
      console.error("Web search notification subscription error:", error);
      setWebSearchNotificationError("Failed to subscribe. Please try again.");
    }
  };

  const handleCloseWebSearchNotificationModal = () => {
    setShowWebSearchNotificationModal(false);
    setWebSearchNotificationEmail("");
    setWebSearchNotificationFirstName("");
    setWebSearchNotificationLastName("");
    setWebSearchNotificationError(null);
    setWebSearchNotificationSubmitted(false);
  };

  // Enhanced trend analysis handlers
  const handleTrendAnalysis = (query: string, filters: any) => {
    handleActualGeneration(ContentType.TrendAnalysis, query, {
      trendAnalysisConfig: { nicheQuery: query, filters },
      historyLogContentType: ContentType.TrendAnalysis,
      originalUserInput: query,
      originalPlatform: platform,
    });
  };

  // Handle search trends navigation from content gaps
  const handleSearchTrends = (gapText: string) => {
    // Switch to trends tab
    setActiveTab("trends");
    // Set the initial query for the trends search
    setTrendsInitialQuery(gapText);
    // Switch to analysis sub-tab if needed
    setTrendAnalysisTabMode("analysis");
  };

  const handleGenerateContentFromRecommendation = (
    contentType: string,
    prompt: string,
  ) => {
    // Map content type to our system
    const mappedContentType =
      contentType === "video"
        ? ContentType.Script
        : contentType === "post"
          ? ContentType.Idea
          : contentType === "article"
            ? ContentType.ContentBrief
            : ContentType.Idea;

    setGeneratorInput(prompt);
    setContentType(mappedContentType);
    setActiveTab("generator");

    // Auto-generate if user is premium
    if (userPlan !== "free") {
      setTimeout(() => {
        handleActualGeneration(mappedContentType, prompt, {
          historyLogContentType: mappedContentType,
          originalUserInput: prompt,
          originalPlatform: platform,
        });
      }, 100);
    }
  };

  const handleExportMarkdown = useCallback(
    (output: any, userInput: string) => {
      try {
        let markdownContent = "";

        // Add header with user input
        markdownContent += `# Generated Content\n\n`;
        markdownContent += `**Input:** ${userInput}\n\n`;
        markdownContent += `**Generated on:** ${new Date().toLocaleDateString()}\n\n`;
        markdownContent += `---\n\n`;

        // Handle different output types
        if (typeof output === "string") {
          markdownContent += output;
        } else if (output && typeof output === "object") {
          if (output.content) {
            markdownContent += output.content;
          } else {
            markdownContent += JSON.stringify(output, null, 2);
          }
        }

        // Create and download the file
        const blob = new Blob([markdownContent], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `generated-content-${Date.now()}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        AppNotifications.operationSuccess("Content exported as Markdown file");
      } catch (error) {
        console.error("Error exporting markdown:", error);
        setError("Failed to export content as Markdown");
      }
    },
    [setError],
  );

  const handleSendToCanvas = useCallback(
    (content: string, title: string) => {
      if (!content.trim()) {
        setError("No content to send to canvas.");
        return;
      }

      const newId = crypto.randomUUID();
      const newCanvasItem: CanvasItem = {
        id: newId,
        type: "textElement",
        x: (Math.random() * 200 + 100 - canvasOffset.x) / zoomLevel,
        y: (Math.random() * 200 + 100 - canvasOffset.y) / zoomLevel,
        zIndex: nextZIndex,
        content: content,
        width: Math.min(400, Math.max(200, content.length * 8)), // Dynamic width based on content
        height: Math.max(100, Math.ceil(content.length / 50) * 30), // Dynamic height
        fontFamily: "Arial",
        fontSize: "14px",
        fontWeight: "normal",
        fontStyle: "normal",
        textDecoration: "none",
        textColor: "#e2e8f0",
        backgroundColor: "#1e293b",
        borderColor: "#334155",
        borderWidth: "1px",
        borderStyle: "solid",
      };

      const updatedItems = [...canvasItems, newCanvasItem];
      const newNextOverallZ = nextZIndex + 1;
      setCanvasItems(updatedItems);
      setNextZIndex(newNextOverallZ);
      commitCurrentStateToHistory(
        updatedItems,
        newNextOverallZ,
        canvasOffset,
        zoomLevel,
      );
      setSelectedCanvasItemId(newId);
      setActiveTab("canvas");
    },
    [
      canvasItems,
      nextZIndex,
      canvasOffset,
      zoomLevel,
      commitCurrentStateToHistory,
    ],
  );

  const handleSendStrategyMindMap = useCallback(
    async (content: string, strategyPlan: ContentStrategyPlanOutput) => {
      try {
        // Start animation state
        setIsMindMapAnimating(true);

        // Generate mind map structure with enhanced spacing for optimal layout
        const mindMapStructure = generateStrategyMindMap(content, strategyPlan, 3000, 2200);

        // Convert to canvas items
        const mindMapItems = convertMindMapToCanvasItems(mindMapStructure);

        // Preserve the carefully calculated radial tree positions
        const initialItems = mindMapItems.map((item, index) => ({
          ...item,
          // Keep the exact positions calculated by the radial tree layout
          x: item.x,
          y: item.y,
          zIndex: nextZIndex + index,
        }));

        // Add mind map items to canvas
        const updatedItems = [...canvasItems, ...initialItems];
        const newNextOverallZ = nextZIndex + initialItems.length + 1;

        setCanvasItems(updatedItems);
        setNextZIndex(newNextOverallZ);

        // Skip force-directed layout to preserve carefully calculated radial tree positions
        console.log('✅ Mind map generated with radial tree layout - preserving positions');

        setCanvasItems(updatedItems);

        // Center the canvas viewport on the mind map and select the central node
        const centralNode = initialItems.find(item => item.mindMapNodeType === "central");
        if (centralNode) {
          const centerX = centralNode.x + (centralNode.width || 300) / 2;
          const centerY = centralNode.y + (centralNode.height || 120) / 2;

          // Center the viewport on the central node
          const newOffset = {
            x: centerX - window.innerWidth / 2,
            y: centerY - window.innerHeight / 2
          };

          setCanvasOffset(newOffset);
          console.log('📍 Canvas centered on mind map central node');

          // Select the central node
          setSelectedCanvasItemId(centralNode.id);
        }

        commitCurrentStateToHistory(
          updatedItems,
          newNextOverallZ,
          canvasOffset,
          zoomLevel,
        );

        // Switch to canvas tab
        setActiveTab("canvas");

        // End animation after a delay
        setTimeout(() => {
          setIsMindMapAnimating(false);
          // Show enhanced completion notification
          console.log("✅ Enhanced Strategy Mind Map optimized with:");
          console.log("   🎯 Intelligent node clustering");
          console.log("   ��� Enhanced spacing (2x breathing room)");
          console.log("   🔗 Smart edge-to-edge connectors");
          console.log("   ✨ Professional creation animations");
        }, 2000);
      } catch (error) {
        console.error("Failed to generate strategy mind map:", error);
        setError("Failed to generate strategy mind map. Please try again.");
        setIsMindMapAnimating(false);
      }
    },
    [
      canvasItems,
      nextZIndex,
      canvasOffset,
      zoomLevel,
      commitCurrentStateToHistory,
    ],
  );

  const handleAddGeneratedOutputToCanvas = () => {
    if (!generatedOutput) {
      setError("No generated output to add to canvas.");
      return;
    }

    // Create a temporary history item for the current output
    const tempHistoryItem: HistoryItem = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      platform: platform,
      contentType: contentType,
      userInput: userInput,
      output: generatedOutput,
      targetAudience: targetAudience,
      batchVariations: batchVariations,
      aiPersonaId: selectedAiPersonaId,
    };

    // Use the existing handlePinToCanvas function
    handlePinToCanvas(tempHistoryItem);
  };

  // Helper function to check if modern clipboard API is available
  const isClipboardAPIAvailable = () => {
    return navigator.clipboard && window.isSecureContext;
  };

  const handleCopyToClipboard = (textToCopy?: string) => {
    const copyText = async (text: string) => {
      try {
        // Try modern Clipboard API first
        if (isClipboardAPIAvailable()) {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
          return;
        }
      } catch (err) {
        console.warn("Clipboard API failed, using fallback:", err);
      }

      // Fallback to legacy method
      try {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        const successful = document.execCommand("copy");
        document.body.removeChild(textArea);

        if (successful) {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } else {
          throw new Error("execCommand failed");
        }
      } catch (err) {
        console.error("All copy methods failed:", err);
        setError("Copy failed. Please manually select and copy the text.");
      }
    };

    if (textToCopy) {
      copyText(textToCopy);
      return;
    }

    const output = displayedOutputItem?.output;
    let processedTextToCopy = "";
    if (output) {
      if (isGeneratedTextOutput(output)) processedTextToCopy = output.content;
      else if (isGeneratedImageOutput(output))
        processedTextToCopy = `Image: ${output.base64Data.substring(0, 100)}... (Full data not copied)`;
      else if (
        Array.isArray(output) &&
        output.every(
          (s) =>
            typeof s === "object" &&
            s !== null &&
            "title" in s &&
            "content" in s,
        )
      ) {
        processedTextToCopy = (output as ParsedChannelAnalysisSection[])
          .map((s) => `## ${s.title}\n${s.content}`)
          .join("\n\n");
      } else if (isContentStrategyPlanOutput(output)) {
        processedTextToCopy = JSON.stringify(output, null, 2);
      } else if (isTrendAnalysisOutput(output)) {
        processedTextToCopy = JSON.stringify(output, null, 2);
      } else if (
        Array.isArray(output) &&
        output.length > 0 &&
        "suggestedPrompt" in output[0]
      ) {
        processedTextToCopy = (output as PromptOptimizationSuggestion[])
          .map(
            (s) =>
              `Suggestion:\n${s.suggestedPrompt}\nReasoning: ${s.reasoning || "N/A"}`,
          )
          .join("\n\n---\n\n");
      } else if (
        typeof output === "object" &&
        output !== null &&
        "titleSuggestions" in output
      ) {
        processedTextToCopy = JSON.stringify(output, null, 2);
      } else if (
        typeof output === "object" &&
        output !== null &&
        "items" in output &&
        "type" in output &&
        (output.type === "poll" || output.type === "quiz")
      ) {
        processedTextToCopy = JSON.stringify(output, null, 2);
      } else if (
        typeof output === "object" &&
        output !== null &&
        "scoreDescription" in output
      ) {
        const readabilityOutput = output as ReadabilityOutput;
        processedTextToCopy = `Readability: ${readabilityOutput.scoreDescription}\n${readabilityOutput.simplifiedContent ? `Simplified: ${readabilityOutput.simplifiedContent}` : ""}`;
      } else if (isEngagementFeedbackOutput(output)) {
        processedTextToCopy = output.feedback;
      } else {
        processedTextToCopy = JSON.stringify(output, null, 2);
      }
    }

    if (processedTextToCopy) {
      copyText(processedTextToCopy);
    }
  };

  const handleSavePersona = (persona: AiPersonaDefinition) => {
    if (editingPersona && editingPersona.isCustom) {
      setCustomAiPersonas(
        customAiPersonas.map((p) => (p.id === persona.id ? persona : p)),
      );
    } else {
      const newPersona = {
        ...persona,
        id: `custom-${Date.now()}`,
        isCustom: true,
      };
      setCustomAiPersonas([...customAiPersonas, newPersona]);
      setSelectedAiPersonaId(newPersona.id);
    }
    setEditingPersona(null);
    setShowPersonaModal(false);
  };

  const handleDeletePersona = (personaId: string) => {
    if (confirm("Are you sure you want to delete this custom persona?")) {
      setCustomAiPersonas(customAiPersonas.filter((p) => p.id !== personaId));
      if (selectedAiPersonaId === personaId) {
        setSelectedAiPersonaId(DEFAULT_AI_PERSONAS[0].id);
      }
    }
  };

  const startRecording = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const newMediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = newMediaRecorder;
        audioChunksRef.current = [];

        newMediaRecorder.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };
        newMediaRecorder.onstop = () => {
          stream.getTracks().forEach((track) => track.stop());
        };

        newMediaRecorder.start();
        setIsRecording(true);

        const SpeechRecognition =
          (window as any).SpeechRecognition ||
          (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
          recognitionRef.current = new SpeechRecognition();
          recognitionRef.current.continuous = true;
          recognitionRef.current.interimResults = true;
          recognitionRef.current.lang = "en-US";
          recognitionRef.current.onresult = (event: any) => {
            let interimTranscript = "";
            let finalTranscript = "";
            for (let i = event.resultIndex; i < event.results.length; ++i) {
              if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
              } else {
                interimTranscript += event.results[i][0].transcript;
              }
            }
            // Update the correct input based on current tab
            const updateInputFunction =
              activeTab === "youtubeStats"
                ? setYoutubeStatsInput
                : activeTab === "channelAnalysis"
                  ? setChannelAnalysisInput
                  : setGeneratorInput;

            updateInputFunction((prevInput) =>
              finalTranscript
                ? (prevInput.endsWith(
                    finalTranscript.slice(0, -interimTranscript.length),
                  )
                    ? prevInput.slice(
                        0,
                        -finalTranscript.slice(0, -interimTranscript.length)
                          .length,
                      )
                    : prevInput) +
                  finalTranscript +
                  interimTranscript
                : prevInput + interimTranscript,
            );
          };
          recognitionRef.current.start();
        } else {
          console.warn("SpeechRecognition API not available.");
        }
      } catch (err) {
        console.error("Error accessing microphone:", err);
        setError("Microphone access denied or not available.");
      }
    } else {
      setError("Audio recording not supported by this browser.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
    // Transcribed text remains in input field for user to review/edit
    // User must manually click "Generate Content" to start generation
  };

  const handleUseIdeaForBrief = (ideaText: string) => {
    setContentType(ContentType.ContentBrief);
    setGeneratorInput(ideaText);
    setActiveTab("generator");
    if (parsedChannelAnalysis) {
      const personaSection = parsedChannelAnalysis.find((s) =>
        s.title.includes("Inferred Target Audience Personas"),
      );
      if (personaSection && personaSection.content) {
        const firstPersona = personaSection.content.split("\n")[0].trim();
        if (firstPersona) setTargetAudience(firstPersona);
      }
    }
    setActiveTab("generator");
    setGeneratedOutput(null);
    setViewingHistoryItemId(null);
    setShowAdvancedOptions(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.getElementById("userInput")?.focus();
  };

  const handleSummarizeChannelAnalysis = useCallback(() => {
    if (!parsedChannelAnalysis || parsedChannelAnalysis.length === 0) {
      setError("No channel analysis available to summarize.");
      return;
    }
    const fullAnalysisText = parsedChannelAnalysis
      .map((section) => `## ${section.title}\n${section.content}`)
      .join("\n\n");
    const summarizationInstruction =
      "Summarize the following YouTube channel analysis concisely, highlighting key strategic insights and actionable recommendations. Focus on the most important takeaways for a content creator.";

    handleActualGeneration(
      ContentType.RefinedText,
      "Summary of YouTube Channel Analysis",
      {
        originalText: fullAnalysisText,
        refinementType: summarizationInstruction as RefinementType,
        historyLogContentType: ContentType.RefinedText,
        originalUserInput: "Summary of YouTube Channel Analysis",
        originalPlatform: Platform.YouTube,
        isSummarizingChannel: true,
      },
    );
  }, [parsedChannelAnalysis, handleActualGeneration]);

  // handlePerformWebSearch moved to EnhancedWebSearch component

  const handleConfirmRepurpose = useCallback(() => {
    if (!contentToActOn) {
      setError("No content to repurpose.");
      return;
    }
    handleActualGeneration(
      ContentType.RepurposedContent,
      originalInputForAction,
      {
        originalText: contentToActOn.content,
        repurposeTargetPlatform,
        repurposeTargetContentType,
        historyLogContentType: ContentType.RepurposedContent,
        originalUserInput: originalInputForAction,
        originalPlatform: originalPlatformForAction,
      },
    );
    setIsRepurposeModalOpen(false);
  }, [
    contentToActOn,
    originalInputForAction,
    originalPlatformForAction,
    repurposeTargetPlatform,
    repurposeTargetContentType,
    handleActualGeneration,
  ]);

  const handleConfirmMultiPlatform = useCallback(() => {
    if (!contentToActOn) {
      setError("No content for multi-platform snippets.");
      return;
    }
    handleActualGeneration(
      ContentType.MultiPlatformSnippets,
      originalInputForAction,
      {
        originalText: contentToActOn.content,
        multiPlatformTargets,
        historyLogContentType: ContentType.MultiPlatformSnippets,
        originalUserInput: originalInputForAction,
        originalPlatform: originalPlatformForAction,
      },
    );
    setIsMultiPlatformModalOpen(false);
  }, [
    contentToActOn,
    originalInputForAction,
    originalPlatformForAction,
    multiPlatformTargets,
    handleActualGeneration,
  ]);

  const handleConfirmTranslate = useCallback(() => {
    if (!contentToActOn) {
      setError("No content to translate.");
      return;
    }
    handleActualGeneration(ContentType.TranslateAdapt, originalInputForAction, {
      originalText: contentToActOn.content,
      targetLanguage,
      historyLogContentType: ContentType.TranslateAdapt,
      originalUserInput: originalInputForAction,
      originalPlatform: originalPlatformForAction,
    });
    setIsLanguageModalOpen(false);
  }, [
    contentToActOn,
    originalInputForAction,
    originalPlatformForAction,
    targetLanguage,
    handleActualGeneration,
  ]);

  const handleSimplifyLanguageAction = useCallback(() => {
    if (!contentToActOn || !isGeneratedTextOutput(contentToActOn)) {
      setError("Original content not available for simplification.");
      return;
    }
    handleActualGeneration(
      ContentType.CheckReadability,
      originalInputForAction,
      {
        originalText: contentToActOn.content,
        refinementType: RefinementType.SimplifyLanguage,
        historyLogContentType: ContentType.CheckReadability,
        originalUserInput: originalInputForAction,
        originalPlatform: originalPlatformForAction,
      },
    );
  }, [
    contentToActOn,
    originalInputForAction,
    originalPlatformForAction,
    handleActualGeneration,
  ]);

  const bringToFront = useCallback(
    (itemId: string) => {
      const newMaxZ = nextZIndex;
      const newNextOverallZ = nextZIndex + 1;
      const updatedItems = canvasItems.map((item) =>
        item.id === itemId ? { ...item, zIndex: newMaxZ } : item,
      );
      setCanvasItems(updatedItems);
      setNextZIndex(newNextOverallZ);
      commitCurrentStateToHistory(
        updatedItems,
        newNextOverallZ,
        canvasOffset,
        zoomLevel,
      );
    },
    [
      canvasItems,
      nextZIndex,
      commitCurrentStateToHistory,
      canvasOffset,
      zoomLevel,
    ],
  );

  const sendToBack = useCallback(
    (itemId: string) => {
      const minZ = Math.min(...canvasItems.map((item) => item.zIndex || 0));
      const newMinZ = minZ - 1;
      const updatedItems = canvasItems.map((item) =>
        item.id === itemId ? { ...item, zIndex: newMinZ } : item,
      );
      setCanvasItems(updatedItems);
      commitCurrentStateToHistory(
        updatedItems,
        nextZIndex,
        canvasOffset,
        zoomLevel,
      );
    },
    [
      canvasItems,
      nextZIndex,
      commitCurrentStateToHistory,
      canvasOffset,
      zoomLevel,
    ],
  );

  const duplicateCanvasItem = useCallback(
    (itemId: string) => {
      const itemToDuplicate = canvasItems.find((item) => item.id === itemId);
      if (!itemToDuplicate) return;

      const newId = crypto.randomUUID();
      const newItem: CanvasItem = {
        ...itemToDuplicate,
        id: newId,
        x: itemToDuplicate.x + 20,
        y: itemToDuplicate.y + 20,
        zIndex: nextZIndex,
      };

      const updatedItems = [...canvasItems, newItem];
      setCanvasItems(updatedItems);
      setNextZIndex(nextZIndex + 1);
      setSelectedCanvasItemId(newId);

      console.log('✅ Canvas Item Added:', {
        id: newItem.id,
        type: newItem.type,
        position: { x: newItem.x, y: newItem.y },
        size: { width: newItem.width, height: newItem.height },
        totalItems: updatedItems.length
      });
      commitCurrentStateToHistory(
        updatedItems,
        nextZIndex + 1,
        canvasOffset,
        zoomLevel,
      );
    },
    [
      canvasItems,
      nextZIndex,
      commitCurrentStateToHistory,
      canvasOffset,
      zoomLevel,
    ],
  );

  const lockCanvasItem = useCallback(
    (itemId: string) => {
      const updatedItems = canvasItems.map((item) =>
        item.id === itemId ? { ...item, locked: !item.locked } : item,
      );
      setCanvasItems(updatedItems);
      commitCurrentStateToHistory(
        updatedItems,
        nextZIndex,
        canvasOffset,
        zoomLevel,
      );
    },
    [
      canvasItems,
      nextZIndex,
      commitCurrentStateToHistory,
      canvasOffset,
      zoomLevel,
    ],
  );

  const handlePinToCanvas = useCallback(
    (historyItem: HistoryItem) => {
      const newId = crypto.randomUUID();
      const newCanvasItem: CanvasItem = {
        id: newId,
        type: "historyItem",
        historyItemId: historyItem.id,
        x: (Math.random() * 200 + 50 - canvasOffset.x) / zoomLevel,
        y: (Math.random() * 200 + 50 - canvasOffset.y) / zoomLevel,
        zIndex: nextZIndex,
        width: 256,
        height: 120,
      };
      const updatedItems = [...canvasItems, newCanvasItem];
      const newNextOverallZ = nextZIndex + 1;
      setCanvasItems(updatedItems);
      setNextZIndex(newNextOverallZ);
      commitCurrentStateToHistory(
        updatedItems,
        newNextOverallZ,
        canvasOffset,
        zoomLevel,
      );
      setSelectedCanvasItemId(newId);
      setActiveTab("canvas");
    },
    [
      canvasItems,
      nextZIndex,
      canvasOffset,
      zoomLevel,
      commitCurrentStateToHistory,
    ],
  );

  const handleAddCanvasItem = useCallback(
    (type: CanvasItemType, specificProps: Partial<CanvasItem> = {}) => {
      const newId = crypto.randomUUID();

      // Calculate position to place items at the center of the user's current view
      // Since HighPerformanceCanvas has its own viewport system that starts at (0,0),
      // we need to place items at coordinates that will be visible when transformed
      const canvasElement = document.querySelector('.high-performance-canvas');
      let viewportCenterX = 400; // Fallback position
      let viewportCenterY = 300; // Fallback position

      if (canvasElement) {
        const rect = canvasElement.getBoundingClientRect();
        // Calculate the center of the visible canvas area in canvas coordinates
        // This accounts for the HighPerformanceCanvas starting viewport at (0,0)
        viewportCenterX = rect.width / 2;
        viewportCenterY = rect.height / 2;

        console.log('📍 Placing item at canvas center:', {
          canvasRect: { width: rect.width, height: rect.height },
          calculatedPosition: { x: viewportCenterX, y: viewportCenterY },
          note: 'Position calculated to appear at center of canvas view'
        });
      }

      console.log('Adding canvas item:', {
        type,
        position: { x: viewportCenterX, y: viewportCenterY }
      });

      let baseProps: Partial<CanvasItem> = {
        x: viewportCenterX,
        y: viewportCenterY,
        zIndex: nextZIndex,
        fontFamily: DEFAULT_FONT_FAMILY,
        fontSize: DEFAULT_FONT_SIZE,
        fontWeight: "normal",
        fontStyle: "normal",
        textDecoration: "none",
        borderColor: DEFAULT_SHAPE_BORDER_COLOR,
        borderWidth: "1px",
        borderStyle: "solid",
      };
      switch (type) {
        case "stickyNote":
          const colorSet =
            APP_STICKY_NOTE_COLORS[
              selectedStickyColorIndex % APP_STICKY_NOTE_COLORS.length
            ];
          baseProps = {
            ...baseProps,
            content: "New Sticky Note",
            width: 200,
            height: 120,
            backgroundColor: colorSet.backgroundColor,
            textColor: colorSet.textColor,
            zIndex: nextZIndex,
            borderWidth: "1px",
            borderColor: colorSet.borderColor,
            borderStyle: "solid",
          };
          break;
        case "textElement":
          baseProps = {
            ...baseProps,
            content: "New Text",
            width: 150,
            height: 50,
            textColor: DEFAULT_TEXT_ELEMENT_COLOR,
            backgroundColor: "transparent",
          };
          break;
        case "shapeElement":
          const shapeVariant = specificProps.shapeVariant || "rectangle";
          const isRound = shapeVariant === "circle";
          const isTall = shapeVariant === "triangle";
          baseProps = {
            ...baseProps,
            shapeVariant: shapeVariant,
            width: isRound || isTall ? 100 : 120,
            height: isTall ? 86 : isRound ? 100 : 80,
            backgroundColor: DEFAULT_SHAPE_FILL_COLOR,
          };
          break;
        case "frameElement":
          baseProps = {
            ...baseProps,
            width: 200,
            height: 150,
            backgroundColor: "rgba(255,255,255,0.03)",
          };
          break;
        case "commentElement":
          baseProps = {
            ...baseProps,
            content: "New Comment",
            width: 160,
            height: 80,
            backgroundColor: "#A5F3FC",
            textColor: "#1F2937",
          };
          break;
        case "imageElement":
          baseProps = {
            ...baseProps,
            width: 200,
            height: 200,
            ...specificProps,
          };
          break;
        case "connectorElement":
          baseProps = {
            ...baseProps,
            width: 150,
            height: 8,
            backgroundColor: "#64748B",
            connectorType: "straight",
            connectorStyle: "solid",
            connectorThickness: 2,
            connectorArrowStart: false,
            connectorArrowEnd: true,
            connectorShowPoints: false,
            connectorAnimation: "none",
          };
          break;
        case "mindMapNode":
          const nodeCount = canvasItems.filter(
            (item) => item.type === "mindMapNode",
          ).length;
          const isFirstNode = nodeCount === 0;
          baseProps = {
            ...baseProps,
            content: isFirstNode ? "Central Idea" : "Branch Idea",
            width: isFirstNode ? 160 : 120,
            height: isFirstNode ? 80 : 60,
            backgroundColor: isFirstNode ? "#7C3AED" : "#3B82F6",
            textColor: "#FFFFFF",
            borderWidth: "3px",
            borderStyle: "solid",
            borderColor: isFirstNode ? "#5B21B6" : "#1D4ED8",
            mindMapNodeType: isFirstNode ? "central" : "branch",
            mindMapLevel: isFirstNode ? 0 : 1,
            mindMapIcon: isFirstNode ? "🧠" : "����",
            mindMapShape: isFirstNode ? "circle" : "ellipse",
            mindMapTheme: "business",
            mindMapConnections: [],
            mindMapConnectionStyle: "curved",
            mindMapConnectionColor: "#6B7280",
            mindMapConnectionThickness: 2,
            mindMapShadow: true,
            mindMapGradient: {
              enabled: true,
              from: isFirstNode ? "#7C3AED" : "#3B82F6",
              to: isFirstNode ? "#A855F7" : "#60A5FA",
              direction: "diagonal",
            },
            mindMapAnimation: "glow",
            mindMapPriority: isFirstNode ? "high" : "medium",
            mindMapTags: [],
            mindMapProgress: 0,
            mindMapNotes: "",
            mindMapAttachments: [],
          };
          break;
        case "flowchartBox":
          baseProps = {
            ...baseProps,
            content: "Process",
            width: 140,
            height: 80,
            backgroundColor: "#10B981",
            textColor: "#FFFFFF",
            flowchartType: "process",
            borderWidth: "2px",
            borderStyle: "solid",
            borderColor: "#059669",
          };
          break;
        case "chart":
          baseProps = {
            ...baseProps,
            content: "Sales Chart",
            width: 350,
            height: 250,
            backgroundColor: "#FFFFFF",
            textColor: "#1F2937",
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: "#E5E7EB",
            chartType: "bar",
            chartTitle: "Sales Data",
            chartSubtitle: "Monthly Performance",
            chartData: {
              labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
              datasets: [
                {
                  label: "Sales",
                  data: [12, 19, 15, 25, 22, 30],
                  backgroundColor: [
                    "#3B82F6",
                    "#10B981",
                    "#F59E0B",
                    "#EF4444",
                    "#8B5CF6",
                    "#06B6D4",
                  ],
                  borderColor: "#1F2937",
                  borderWidth: 2,
                },
              ],
            },
            chartOptions: {
              showLegend: true,
              showLabels: true,
              showValues: true,
              showPercentages: false,
              showGrid: true,
              legendPosition: "top",
              colorScheme: "default",
              animationType: "fade",
              responsive: true,
              maintainAspectRatio: false,
            },
          };
          break;
        case "kanbanCard":
          baseProps = {
            ...baseProps,
            content: "Design User Interface",
            width: 280,
            height: 160,
            backgroundColor: "#FFFFFF",
            textColor: "#1F2937",
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: "#E5E7EB",
            kanbanStatus: "todo",
            kanbanPriority: "high",
            kanbanAssignee: "Sarah Chen",
            kanbanCardType: "feature",
            kanbanLabels: ["UI/UX", "Frontend"],
            kanbanDueDate: "2024-12-20",
            kanbanEstimate: "3 days",
            kanbanProgress: 0,
            kanbanDescription:
              "Create responsive user interface components with modern design patterns",
            kanbanChecklist: [
              { text: "Research design patterns", completed: true },
              { text: "Create wireframes", completed: false },
              { text: "Implement components", completed: false },
              { text: "Add responsive styles", completed: false },
            ],
            kanbanAttachments: [],
            kanbanComments: [],
            kanbanStoryPoints: 5,
            kanbanSprint: "Sprint 12",
            kanbanEpic: "User Experience",
            kanbanTheme: "professional",
            kanbanSize: "medium",
            kanbanCornerStyle: "rounded",
            kanbanShadow: "medium",
            kanbanAnimation: "hover",
            kanbanTemplate: "detailed",
          };
          break;
        case "tableElement":
          baseProps = {
            ...baseProps,
            content: "Professional Data Table",
            width: 450,
            height: 280,
            backgroundColor: "#FFFFFF",
            textColor: "#1F2937",
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: "#E5E7EB",
            tableData: {
              headers: ["Product", "Revenue", "Growth", "Status"],
              rows: [
                ["Product A", "$124,500", "+12.5%", "Active"],
                ["Product B", "$89,200", "+8.3%", "Active"],
                ["Product C", "$67,800", "-2.1%", "Review"],
                ["Product D", "$156,900", "+18.7%", "Active"],
                ["Product E", "$92,400", "+6.9%", "Active"],
              ],
            },
            tableStyle: "professional",
            tableTheme: "blue",
            tableHeaderStyle: "gradient",
            tableBorderStyle: "all",
            tableAlternateRows: true,
            tableHoverEffect: true,
            tableSortable: true,
            tableSearchable: false,
            tablePageSize: 10,
            tableFontSize: "medium",
            tableColumnWidths: [25, 25, 20, 20],
            tableColumnAlignment: ["left", "right", "center", "center"],
            tableHeaderColor: "#F8FAFC",
            tableHeaderTextColor: "#1E293B",
            tableRowColors: ["#FFFFFF", "#F8FAFC"],
            tableBorderColor: "#E2E8F0",
            tableBorderWidth: 1,
            tableTitle: "Sales Performance Dashboard",
            tableSubtitle: "Q4 2024 Results",
            tableFooter: "Last updated: Today",
            tableNotes: "Hover over rows for details",
          };
          break;
        case "diagramNode":
          baseProps = {
            ...baseProps,
            content: "Node",
            width: 100,
            height: 100,
            backgroundColor: "#8B5CF6",
            textColor: "#FFFFFF",
            shapeVariant: "circle",
            borderWidth: "2px",
            borderStyle: "solid",
            borderColor: "#7C3AED",
          };
          break;
        case "codeBlock":
          baseProps = {
            ...baseProps,
            content:
              "// Your code here\nfunction example() {\n  return 'Hello World';\n}",
            width: 350,
            height: 200,
            backgroundColor: "#1F2937",
            textColor: "#F9FAFB",
            fontFamily: "Courier New",
            fontSize: "12px",
            codeLanguage: "javascript",
            codeTheme: "dark",
            codeShowLineNumbers: true,
            codeShowCopyButton: true,
            codeWordWrap: false,
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: "#374151",
          };
          break;
        case "embedElement":
          baseProps = {
            ...baseProps,
            content: "Embed Content",
            width: 400,
            height: 300,
            backgroundColor: "#F9FAFB",
            textColor: "#1F2937",
            borderWidth: "2px",
            borderStyle: "dashed",
            borderColor: "#9CA3AF",
            embedType: "youtube",
          };
          break;
        case "drawingPath":
          baseProps = {
            ...baseProps,
            content: "Drawing Path",
            width: 200,
            height: 200,
            backgroundColor: "transparent",
            drawingType: specificProps.drawingType || "pen",
            strokeWidth: specificProps.strokeWidth || 2,
            strokeColor: specificProps.strokeColor || "#000000",
            strokeStyle: "solid",
            pathData: [],
            drawingMode: "path",
            smoothing: true,
            pressure: false,
            opacity: 1,
          };
          break;
        case "eraser":
          baseProps = {
            ...baseProps,
            content: "Eraser Tool",
            width: 50,
            height: 50,
            backgroundColor: "transparent",
            eraserSize: 20,
            eraserShape: "circle",
            eraserHardness: 100,
            mode: "eraser",
          };
          break;
      }
      const newCanvasItem: CanvasItem = {
        id: newId,
        type,
        ...baseProps,
        ...specificProps,
      } as CanvasItem;
      const updatedItems = [...canvasItems, newCanvasItem];
      const newNextOverallZ = nextZIndex + 1;

      console.log('✅ Canvas item created:', {
        id: newId,
        type: newCanvasItem.type,
        position: { x: newCanvasItem.x, y: newCanvasItem.y },
        zIndex: newCanvasItem.zIndex,
        dimensions: { width: newCanvasItem.width, height: newCanvasItem.height },
        totalItems: updatedItems.length
      });

      setCanvasItems(updatedItems);
      setNextZIndex(newNextOverallZ);
      commitCurrentStateToHistory(
        updatedItems,
        newNextOverallZ,
        canvasOffset,
        zoomLevel,
      );
      setSelectedCanvasItemId(newId);
      if (type === "shapeElement" && showShapeDropdown)
        setShowShapeDropdown(false);
    },
    [
      canvasItems,
      nextZIndex,
      selectedStickyColorIndex,
      canvasOffset,
      zoomLevel,
      showShapeDropdown,
      commitCurrentStateToHistory,
    ],
  );

  const handleCanvasItemContentChange = useCallback(
    (itemId: string, newContent: string) => {
      const updatedItems = canvasItems.map((item) => {
        if (item.id === itemId) {
          // If content is being cleared and the original content was placeholder text, restore it
          if (newContent.trim() === "") {
            const placeholders = [
              "New Note",
              "New Text",
              "New Comment",
              "Sticky note text",
              "Sticky Note",
              "Your Text Here",
            ];
            if (placeholders.includes(item.content || "")) {
              // Keep the original placeholder text
              return item;
            }
          }
          return { ...item, content: newContent };
        }
        return item;
      });
      setCanvasItems(updatedItems);
      commitCurrentStateToHistory(
        updatedItems,
        nextZIndex,
        canvasOffset,
        zoomLevel,
      );
    },
    [
      canvasItems,
      nextZIndex,
      commitCurrentStateToHistory,
      canvasOffset,
      zoomLevel,
    ],
  );

  const updateCanvasItemProperty = useCallback(
    <K extends keyof CanvasItem>(
      itemId: string,
      property: K,
      value: CanvasItem[K],
    ) => {
      const updatedItems = canvasItems.map((item) =>
        item.id === itemId ? { ...item, [property]: value } : item,
      );
      setCanvasItems(updatedItems);
      commitCurrentStateToHistory(
        updatedItems,
        nextZIndex,
        canvasOffset,
        zoomLevel,
      );
    },
    [
      canvasItems,
      nextZIndex,
      commitCurrentStateToHistory,
      canvasOffset,
      zoomLevel,
    ],
  );

  const handleResizeStart = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, itemId: string, handle: "br") => {
      e.preventDefault();
      e.stopPropagation();
      const itemToResize = canvasItems.find((item) => item.id === itemId);
      if (!itemToResize) return;
      if (selectedCanvasItemId !== itemId) setSelectedCanvasItemId(itemId);
      const newCurrentZ = nextZIndex + 1;
      setCanvasItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, zIndex: newCurrentZ } : i)),
      );
      setNextZIndex(newCurrentZ);
      let currentMinWidth = MIN_CANVAS_ITEM_WIDTH;
      let currentMinHeight = MIN_CANVAS_ITEM_HEIGHT;
      if (itemToResize.type === "imageElement") {
        currentMinWidth = MIN_CANVAS_IMAGE_SIZE;
        currentMinHeight = MIN_CANVAS_IMAGE_SIZE;
      } else if (
        itemToResize.type === "shapeElement" &&
        itemToResize.shapeVariant === "rectangle" &&
        (itemToResize.height || 0) <= 10
      ) {
        currentMinHeight = 2;
      }
      setResizingItem({
        id: itemId,
        handle,
        initialMouseX: e.clientX,
        initialMouseY: e.clientY,
        initialWidth: itemToResize.width || currentMinWidth,
        initialHeight: itemToResize.height || currentMinHeight,
      });
    },
    [canvasItems, selectedCanvasItemId, nextZIndex],
  );

  const handleCanvasItemMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, itemId: string) => {
      if (e.button === 2) return;
      const targetElement = e.target as HTMLElement;
      if (selectedCanvasItemId !== itemId) setSelectedCanvasItemId(itemId);

      const newCurrentZ = nextZIndex;
      setCanvasItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, zIndex: newCurrentZ } : i)),
      );
      setNextZIndex(newCurrentZ + 1);

      if (targetElement.closest('[data-resize-handle="true"]')) return;
      const contentEditableTarget = targetElement.closest(
        '[contenteditable="true"],[data-editable-text="true"]',
      );
      if (contentEditableTarget) return;
      const buttonTarget = targetElement.closest("button");
      if (
        buttonTarget &&
        (buttonTarget.title === "Remove from Canvas" ||
          buttonTarget.title === "Bring to Front")
      )
        return;

      if (e.button === 1) e.preventDefault();
      e.preventDefault();

      const itemElement = e.currentTarget;
      const itemRect = itemElement.getBoundingClientRect();
      const offsetX = (e.clientX - itemRect.left) / zoomLevel;
      const offsetY = (e.clientY - itemRect.top) / zoomLevel;
      setDraggingItem({ id: itemId, offsetX, offsetY });
    },
    [selectedCanvasItemId, nextZIndex, zoomLevel],
  );

  // Throttled mouse move for smooth performance
  const throttleMouseMove = useRef<number | null>(null);

  const handleCanvasMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Use requestAnimationFrame for smooth 60fps updates
      if (throttleMouseMove.current) return;

      throttleMouseMove.current = requestAnimationFrame(() => {
        throttleMouseMove.current = null;

        if (isPanning && lastPanPosition && canvasContainerRef.current) {
          e.preventDefault();
          const screenDx = e.clientX - lastPanPosition.x;
          const screenDy = e.clientY - lastPanPosition.y;
          setCanvasOffset((prevOffset) => ({
            x: prevOffset.x + screenDx,
            y: prevOffset.y + screenDy,
          }));
          setLastPanPosition({ x: e.clientX, y: e.clientY });
          return;
        }

        if (draggingItem && canvasContainerRef.current) {
          e.preventDefault();
          const canvasRect = canvasContainerRef.current.getBoundingClientRect();
          let newX =
            (e.clientX - canvasRect.left - canvasOffset.x) / zoomLevel -
            draggingItem.offsetX;
          let newY =
            (e.clientY - canvasRect.top - canvasOffset.y) / zoomLevel -
            draggingItem.offsetY;
          setCanvasItems((prevItems) =>
            prevItems.map((item) =>
              item.id === draggingItem.id
                ? { ...item, x: newX, y: newY }
                : item,
            ),
          );
        } else if (resizingItem && canvasContainerRef.current) {
          e.preventDefault();
          const itemBeingResized = canvasItems.find(
            (item) => item.id === resizingItem.id,
          );
          if (!itemBeingResized) return;
          const deltaX = (e.clientX - resizingItem.initialMouseX) / zoomLevel;
          const deltaY = (e.clientY - resizingItem.initialMouseY) / zoomLevel;
          let newWidth = resizingItem.initialWidth + deltaX;
          let newHeight = resizingItem.initialHeight + deltaY;
          let currentMinWidth = MIN_CANVAS_ITEM_WIDTH;
          let currentMinHeight = MIN_CANVAS_ITEM_HEIGHT;
          if (itemBeingResized.type === "imageElement") {
            currentMinWidth = MIN_CANVAS_IMAGE_SIZE;
            currentMinHeight = MIN_CANVAS_IMAGE_SIZE;
          } else if (
            itemBeingResized.type === "shapeElement" &&
            itemBeingResized.shapeVariant === "rectangle" &&
            itemBeingResized.height !== undefined &&
            itemBeingResized.height <= 10
          ) {
            currentMinHeight = 2;
          }
          newWidth = Math.max(currentMinWidth, newWidth);
          newHeight = Math.max(currentMinHeight, newHeight);
          setCanvasItems((prevItems) =>
            prevItems.map((item) =>
              item.id === resizingItem.id
                ? { ...item, width: newWidth, height: newHeight }
                : item,
            ),
          );
        }
      });
    },
    [
      isPanning,
      lastPanPosition,
      draggingItem,
      resizingItem,
      canvasOffset,
      zoomLevel,
      canvasItems,
    ],
  );

  const handleCanvasMouseUp = useCallback(() => {
    // Cancel any pending mouse move updates
    if (throttleMouseMove.current) {
      cancelAnimationFrame(throttleMouseMove.current);
      throttleMouseMove.current = null;
    }

    let stateChanged = false;
    if (draggingItem || resizingItem || (isPanning && lastPanPosition))
      stateChanged = true;
    if (stateChanged)
      commitCurrentStateToHistory(
        canvasItems,
        nextZIndex,
        canvasOffset,
        zoomLevel,
      );
    setDraggingItem(null);
    setResizingItem(null);
    if (isPanning) {
      setIsPanning(false);
      setLastPanPosition(null);
      if (canvasContainerRef.current)
        canvasContainerRef.current.style.cursor = "default";
    }
  }, [
    isPanning,
    draggingItem,
    resizingItem,
    canvasItems,
    nextZIndex,
    commitCurrentStateToHistory,
    canvasOffset,
    zoomLevel,
    lastPanPosition,
  ]);

  const handleCanvasContainerMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const directTransformedChild = canvasContainerRef.current?.firstChild;
      if (
        (e.target === directTransformedChild ||
          e.target === canvasContainerRef.current) &&
        e.button === 0
      )
        setSelectedCanvasItemId(null);
      if (e.button === 2 && canvasContainerRef.current) {
        e.preventDefault();
        setIsPanning(true);
        setLastPanPosition({ x: e.clientX, y: e.clientY });
        canvasContainerRef.current.style.cursor = "grabbing";
      }
    },
    [],
  );

  // Throttled zoom for smooth performance
  const throttleZoom = useRef<NodeJS.Timeout | null>(null);
  const zoomState = useRef({ zoom: zoomLevel, offset: canvasOffset });

  // Keep zoom state ref in sync
  useEffect(() => {
    zoomState.current = { zoom: zoomLevel, offset: canvasOffset };
  }, [zoomLevel, canvasOffset]);

  // Memoized grid style calculation for performance
  const gridStyle = useMemo(() => {
    const baseGridSize = 50;
    const fineGridSize = 20;
    const gridScale = zoomLevel;

    // Intelligent opacity that responds to zoom level
    const majorOpacity = Math.min(
      0.4,
      Math.max(0.15, 0.4 * Math.pow(gridScale, 0.7)),
    );
    const minorOpacity = Math.min(
      0.25,
      Math.max(0.1, 0.25 * Math.pow(gridScale, 0.9)),
    );

    // Smooth grid size scaling
    const majorGrid = baseGridSize * gridScale;
    const minorGrid = fineGridSize * gridScale;

    // Calculate subpixel-accurate positions for smoother movement
    const offsetX = Math.round(canvasOffset.x * 100) / 100;
    const offsetY = Math.round(canvasOffset.y * 100) / 100;

    // Convert theme border color to rgba for grid lines
    const borderColor = themeConfig.colors.borderPrimary;
    const rgbaGridColor = borderColor.startsWith('#')
      ? `${borderColor}${Math.round(255 * majorOpacity).toString(16).padStart(2, '0')}`
      : `rgba(71, 85, 105, ${majorOpacity})`;
    const rgbaMinorGridColor = borderColor.startsWith('#')
      ? `${borderColor}${Math.round(255 * minorOpacity).toString(16).padStart(2, '0')}`
      : `rgba(71, 85, 105, ${minorOpacity})`;

    return {
      backgroundSize: `${majorGrid}px ${majorGrid}px, ${majorGrid}px ${majorGrid}px, ${minorGrid}px ${minorGrid}px, ${minorGrid}px ${minorGrid}px`,
      backgroundImage: [
        `linear-gradient(to right, ${rgbaGridColor} 1px, transparent 1px)`,
        `linear-gradient(to bottom, ${rgbaGridColor} 1px, transparent 1px)`,
        `linear-gradient(to right, ${rgbaMinorGridColor} 1px, transparent 1px)`,
        `linear-gradient(to bottom, ${rgbaMinorGridColor} 1px, transparent 1px)`,
      ].join(", "),
      backgroundPosition: `${offsetX}px ${offsetY}px, ${offsetX}px ${offsetY}px, ${offsetX}px ${offsetY}px, ${offsetX}px ${offsetY}px`,
      // Hardware acceleration for grid rendering
      backfaceVisibility: "hidden",
      WebkitBackfaceVisibility: "hidden",
    };
  }, [zoomLevel, canvasOffset.x, canvasOffset.y, themeConfig.colors.borderPrimary]);

  const handleCanvasWheelZoom = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      if (!canvasContainerRef.current) return;

      e.preventDefault();

      // Process the zoom with high performance
      const canvasRect = canvasContainerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - canvasRect.left;
      const mouseY = e.clientY - canvasRect.top;
      const oldZoomLevel = zoomState.current.zoom;
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1; // Smoother zoom steps
      const newZoomLevel = oldZoomLevel * zoomFactor;
      const clampedZoom = Math.max(0.1, Math.min(newZoomLevel, 5));

      const newOffsetX =
        mouseX -
        (mouseX - zoomState.current.offset.x) * (clampedZoom / oldZoomLevel);
      const newOffsetY =
        mouseY -
        (mouseY - zoomState.current.offset.y) * (clampedZoom / oldZoomLevel);
      const finalCanvasOffset = { x: newOffsetX, y: newOffsetY };

      // Update ref state immediately for smooth rendering
      zoomState.current = { zoom: clampedZoom, offset: finalCanvasOffset };

      // Update React state with immediate effect
      setZoomLevel(clampedZoom);
      setCanvasOffset(finalCanvasOffset);

      // Throttle history commits to reduce overhead
      if (throttleZoom.current) clearTimeout(throttleZoom.current);
      throttleZoom.current = setTimeout(() => {
        commitCurrentStateToHistory(
          canvasItems,
          nextZIndex,
          finalCanvasOffset,
          clampedZoom,
        );
      }, 100);
    },
    [canvasItems, nextZIndex, commitCurrentStateToHistory],
  );

  const handleZoomInOut = useCallback(
    (direction: "in" | "out") => {
      if (!canvasContainerRef.current) return;
      const canvasRect = canvasContainerRef.current.getBoundingClientRect();
      const centerX = canvasRect.width / 2;
      const centerY = canvasRect.height / 2;
      const oldZoomLevel = zoomLevel;
      const zoomFactor = 1.2;
      const newZoomLevel =
        direction === "in"
          ? oldZoomLevel * zoomFactor
          : oldZoomLevel / zoomFactor;
      const clampedZoom = Math.max(0.1, Math.min(newZoomLevel, 5));
      const newOffsetX =
        centerX - (centerX - canvasOffset.x) * (clampedZoom / oldZoomLevel);
      const newOffsetY =
        centerY - (centerY - canvasOffset.y) * (clampedZoom / oldZoomLevel);
      const finalCanvasOffset = { x: newOffsetX, y: newOffsetY };
      setZoomLevel(clampedZoom);
      setCanvasOffset(finalCanvasOffset);
      commitCurrentStateToHistory(
        canvasItems,
        nextZIndex,
        finalCanvasOffset,
        clampedZoom,
      );
    },
    [
      zoomLevel,
      canvasOffset,
      canvasItems,
      nextZIndex,
      commitCurrentStateToHistory,
    ],
  );

  const handleRemoveFromCanvas = useCallback(
    (canvasItemId: string) => {
      const updatedItems = canvasItems.filter(
        (item) => item.id !== canvasItemId,
      );
      setCanvasItems(updatedItems);
      if (selectedCanvasItemId === canvasItemId) setSelectedCanvasItemId(null);
      commitCurrentStateToHistory(
        updatedItems,
        nextZIndex,
        canvasOffset,
        zoomLevel,
      );
    },
    [
      canvasItems,
      nextZIndex,
      selectedCanvasItemId,
      commitCurrentStateToHistory,
      canvasOffset,
      zoomLevel,
    ],
  );

  const handleUndoCanvas = useCallback(() => {
    if (currentCanvasHistoryIndex <= 0) return;
    const newIndex = currentCanvasHistoryIndex - 1;
    const stateToRestore = canvasHistory[newIndex];
    setCanvasItems(JSON.parse(JSON.stringify(stateToRestore.items)));
    setNextZIndex(stateToRestore.nextZIndex);
    setCanvasOffset(stateToRestore.canvasOffset);
    setZoomLevel(stateToRestore.zoomLevel);
    setCurrentCanvasHistoryIndex(newIndex);
    setSelectedCanvasItemId(null);
  }, [canvasHistory, currentCanvasHistoryIndex]);

  const handleRedoCanvas = useCallback(() => {
    if (currentCanvasHistoryIndex >= canvasHistory.length - 1) return;
    const newIndex = currentCanvasHistoryIndex + 1;
    const stateToRestore = canvasHistory[newIndex];
    setCanvasItems(JSON.parse(JSON.stringify(stateToRestore.items)));
    setNextZIndex(stateToRestore.nextZIndex);
    setCanvasOffset(stateToRestore.canvasOffset);
    setZoomLevel(stateToRestore.zoomLevel);
    setCurrentCanvasHistoryIndex(newIndex);
    setSelectedCanvasItemId(null);
  }, [canvasHistory, currentCanvasHistoryIndex]);

  const canUndo = currentCanvasHistoryIndex > 0;
  const canRedo =
    canvasHistory.length > 0 &&
    currentCanvasHistoryIndex < canvasHistory.length - 1;

  const handleOpenCanvasImageModal = () => {
    setCanvasImageModalPrompt("");
    setCanvasImageModalNegativePrompt(negativeImagePrompt);
    setCanvasImageModalAspectRatio(aspectRatioGuidance);
    setCanvasImageModalStyles([...selectedImageStyles]);
    setCanvasImageModalMoods([...selectedImageMoods]);
    setCanvasImageError(null);
    setIsCanvasImageModalOpen(true);
  };

  const handleGenerateCanvasImage = async () => {
    if (!canvasImageModalPrompt.trim()) {
      setCanvasImageError("Please enter a prompt for the image.");
      return;
    }
    setIsGeneratingCanvasImage(true);
    setCanvasImageError(null);
    let fullPrompt = canvasImageModalPrompt;
    if (canvasImageModalStyles.length > 0)
      fullPrompt += `. Styles: ${canvasImageModalStyles.join(", ")}`;
    if (canvasImageModalMoods.length > 0)
      fullPrompt += `. Moods: ${canvasImageModalMoods.join(", ")}`;
    try {
      const imageData = await generateImage(
        fullPrompt,
        canvasImageModalNegativePrompt,
        canvasImageModalAspectRatio,
      );
      handleAddCanvasItem("imageElement", {
        base64Data: imageData.base64Data,
        mimeType: imageData.mimeType,
        width: 256,
        height: 256,
      });
      setActiveTab("canvas");
      setIsCanvasImageModalOpen(false);
      setCanvasImageModalPrompt("");
      setCanvasImageModalNegativePrompt("");
    } catch (err) {
      setCanvasImageError(
        err instanceof Error ? err.message : "Failed to generate image.",
      );
    } finally {
      setIsGeneratingCanvasImage(false);
    }
  };

  const toggleImageStyle = (
    style: ImagePromptStyle,
    isModal: boolean = false,
  ) => {
    if (isModal)
      setCanvasImageModalStyles((prev) =>
        prev.includes(style)
          ? prev.filter((s) => s !== style)
          : [...prev, style],
      );
    else
      setSelectedImageStyles((prev) =>
        prev.includes(style)
          ? prev.filter((s) => s !== style)
          : [...prev, style],
      );
  };
  const toggleImageMood = (mood: ImagePromptMood, isModal: boolean = false) => {
    if (isModal)
      setCanvasImageModalMoods((prev) =>
        prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood],
      );
    else
      setSelectedImageMoods((prev) =>
        prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood],
      );
  };

  const handleSaveSnapshot = () => {
    const name = prompt(
      "Enter a name for this canvas snapshot:",
      `Snapshot ${new Date().toLocaleString()}`,
    );
    if (!name) return;

    const snapshot: CanvasSnapshot = {
      id: `snap-${Date.now()}`,
      name,
      timestamp: Date.now(),
      boardState: {
        items: JSON.parse(JSON.stringify(canvasItems)),
        nextZIndex,
        offset: { ...canvasOffset },
        zoomLevel,
      },
    };
    setCanvasSnapshots((prev) => [...prev, snapshot]);
    setShowSnapshotModal(false);
  };

  const handleLoadSnapshot = (snapshotId: string) => {
    const snapshotToLoad = canvasSnapshots.find((s) => s.id === snapshotId);
    if (!snapshotToLoad) {
      setError("Snapshot not found.");
      return;
    }
    setCanvasItems(JSON.parse(JSON.stringify(snapshotToLoad.boardState.items)));
    setNextZIndex(snapshotToLoad.boardState.nextZIndex);
    setCanvasOffset({ ...snapshotToLoad.boardState.offset });
    setZoomLevel(snapshotToLoad.boardState.zoomLevel);
    commitCurrentStateToHistory(
      snapshotToLoad.boardState.items,
      snapshotToLoad.boardState.nextZIndex,
      snapshotToLoad.boardState.offset,
      snapshotToLoad.boardState.zoomLevel,
    );
    setSelectedCanvasItemId(null);
    setShowSnapshotModal(false);
  };

  const handleDeleteSnapshot = (snapshotId: string) => {
    if (confirm("Are you sure you want to delete this snapshot?")) {
      setCanvasSnapshots((prev) => prev.filter((s) => s.id !== snapshotId));
    }
  };

  const handleClearCanvas = () => {
    if (
      window.confirm(
        "Are you sure you want to clear the entire canvas? This will remove all items and cannot be undone.",
      )
    ) {
      setCanvasItems([]);
      setNextZIndex(1);
      const initialEntry: CanvasHistoryEntry = {
        items: [],
        nextZIndex: 1,
        canvasOffset,
        zoomLevel,
      };
      setCanvasHistory([initialEntry]);
      setCurrentCanvasHistoryIndex(0);
      setSelectedCanvasItemId(null);
    }
  };

  const handleScreenshotCanvas = async () => {
    if (!canvasContainerRef.current) return;
    const transformedContent = canvasContainerRef.current
      .firstChild as HTMLElement;
    if (!transformedContent) return;

    setIsLoading(true);
    setError(null);

    try {
      const contentRect = transformedContent.getBoundingClientRect();
      const canvasElement = await html2canvas(transformedContent, {
        backgroundColor: "#0f172a",
        x: 0,
        y: 0,
        width: contentRect.width / zoomLevel,
        height: contentRect.height / zoomLevel,
        scale: window.devicePixelRatio * zoomLevel,
        logging: true,
        useCORS: true,
        scrollX: -transformedContent.offsetLeft,
        scrollY: -transformedContent.offsetTop,
      });

      const dataUrl = canvasElement.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `canvas_screenshot_${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error("Error taking screenshot:", e);
      setError("Failed to take screenshot.");
    } finally {
      setIsLoading(false);
    }
  };

  // Collapsible Guidelines Component
  const CollapsibleGuidelines: React.FC<{
    title: string;
    icon: string;
    guidelines: Array<{ status: string; color: string; text: string }>;
    bgGradient: string;
    borderColor: string;
    titleColor: string;
  }> = ({ title, icon, guidelines, bgGradient, borderColor, titleColor }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
      <div
        className={`${bgGradient} ${borderColor} rounded-xl backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-black/10 ${isExpanded ? "p-5" : "p-3"}`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`text-lg transition-all duration-300 ${isExpanded ? "text-blue-400" : "text-slate-400"}`}
          >
            {icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between group">
              <h4
                className={`font-semibold ${titleColor} text-sm transition-all duration-300`}
              >
                {title}
              </h4>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300
                  ${
                    isExpanded
                      ? "bg-slate-600/50 text-slate-300 rotate-180 scale-110"
                      : "text-slate-400 hover:bg-slate-600/30 hover:text-slate-300"
                  }
                  group-hover:bg-slate-600/30 hover:scale-110 active:scale-95`}
                title={isExpanded ? "Hide guidelines" : "Show guidelines"}
              >
                <QuestionMarkCircleIcon className="h-4 w-4 transition-transform duration-300" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </button>
            </div>

            <div
              className={`overflow-hidden transition-all duration-500 ease-out ${
                isExpanded
                  ? "max-h-96 opacity-100 mt-4"
                  : "max-h-0 opacity-0 mt-0"
              }`}
            >
              <div className="space-y-2">
                {guidelines.map((guideline, index) => (
                  <div
                    key={`guideline-${guideline.status}-${index}`}
                    className={`flex items-start gap-3 p-2 rounded-lg bg-slate-800/30 border border-slate-600/20
                      transition-all duration-300 hover:bg-slate-700/40 hover:border-slate-500/30 hover:transform hover:translate-x-1
                      ${isExpanded ? "animate-in slide-in-from-left-2 fade-in" : ""}`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <span
                      className={`${guideline.color} font-medium text-xs whitespace-nowrap`}
                    >
                      {guideline.status}
                    </span>
                    <span className="text-slate-300 text-xs leading-relaxed flex-1">
                      {guideline.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCalendar = () => {
    const date = new Date(currentYear, currentMonth, 1);
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = date.getDay();
    const calendarDays = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push(
        <div
          key={`pad-prev-${i}`}
          className="p-2 border border-slate-700 opacity-50 h-32"
        ></div>,
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(currentYear, currentMonth, day);
      const dateString = currentDate.toISOString().split("T")[0];
      const dayEvents = calendarEvents.filter(
        (event) => event.date === dateString,
      );
      const isToday = new Date().toISOString().split("T")[0] === dateString;

      calendarDays.push(
        <div
          key={day}
          className={`p-2 border border-slate-700 h-32 flex flex-col cursor-pointer hover:bg-slate-700 transition-colors ${isToday ? "bg-sky-900/30" : ""}`}
          onClick={() => {
            setSelectedCalendarDay(currentDate);
            setShowEventModal(true);
            setEditingCalendarEvent({ date: dateString });
          }}
          role="button"
          tabIndex={0}
          aria-label={`View or add events for ${currentDate.toLocaleString("default", { month: "long" })} ${day}`}
        >
          <span
            className={`font-semibold ${isToday ? "text-sky-400" : "text-slate-300"}`}
          >
            {day}
          </span>
          <div className="mt-1 text-xs space-y-1">
            {dayEvents.slice(0, 3).map((event) => (
              <div
                key={event.id}
                className={`p-1 rounded-md truncate text-white`}
                style={{
                  backgroundColor:
                    event.color ||
                    PLATFORM_COLORS[event.platform as Platform] ||
                    "#3B82F6",
                }}
                title={event.title}
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 3 && (
              <div className="text-sky-400 text-center text-xxs">
                +{dayEvents.length - 3} more
              </div>
            )}
          </div>
        </div>,
      );
    }

    const totalCells = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;
    for (let i = 0; i < totalCells - (firstDayOfMonth + daysInMonth); i++) {
      calendarDays.push(
        <div
          key={`pad-next-${i}`}
          className="p-2 border border-slate-700 opacity-50 h-32"
        ></div>,
      );
    }
    return calendarDays;
  };

  const handleSaveCalendarEvent = () => {
    if (
      !editingCalendarEvent ||
      !editingCalendarEvent.title ||
      !editingCalendarEvent.date
    )
      return;
    if (editingCalendarEvent.id) {
      setCalendarEvents(
        calendarEvents.map((e) =>
          e.id === editingCalendarEvent!.id
            ? (editingCalendarEvent as CalendarEvent)
            : e,
        ),
      );
    } else {
      setCalendarEvents([
        ...calendarEvents,
        { ...editingCalendarEvent, id: `event-${Date.now()}` } as CalendarEvent,
      ]);
    }
    setShowEventModal(false);
    setEditingCalendarEvent(null);
  };
  // Manual function to add selected strategy items to calendar
  const addStrategyToCalendar = (selectedItems?: any[]) => {
    if (!generatedStrategyPlan?.suggestedWeeklySchedule) return;

    const itemsToAdd = selectedItems || generatedStrategyPlan.suggestedWeeklySchedule;
    const newEvents: CalendarEvent[] = [];
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    for (let week = 0; week < 4; week++) {
      itemsToAdd.forEach((item) => {
        const dayOfWeekJS = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ].indexOf(item.dayOfWeek);
        if (dayOfWeekJS === -1) return;

        let dateForEvent = new Date(year, month, 1 + week * 7);
        while (dateForEvent.getDay() !== dayOfWeekJS) {
          dateForEvent.setDate(dateForEvent.getDate() + 1);
        }
        if (dateForEvent.getMonth() === month) {
          newEvents.push({
            id: `strat-${item.dayOfWeek}-${item.topicHint.slice(0, 5)}-${Date.now()}-${Math.random()}`,
            date: dateForEvent.toISOString().split("T")[0],
            title: `${item.contentType}: ${item.topicHint}`,
            description: `Platform: ${item.platform}. Strategy item for ${item.dayOfWeek}.`,
            originalStrategyItem: item,
            platform: item.platform as Platform,
            contentType: item.contentType as ContentType,
            color: PLATFORM_COLORS[item.platform as Platform] || "#3B82F6",
          });
        }
      });
    }

    if (newEvents.length > 0) {
      setCalendarEvents((prevEvents) => {
        const existingStrategyEventIds = new Set(
          prevEvents
            .filter((e) => e.originalStrategyItem)
            .map(
              (e) =>
                `${e.originalStrategyItem?.dayOfWeek}-${e.originalStrategyItem?.topicHint.slice(0, 5)}`,
            ),
        );
        const filteredNewEvents = newEvents.filter(
          (ne) =>
            !existingStrategyEventIds.has(
              `${ne.originalStrategyItem?.dayOfWeek}-${ne.originalStrategyItem?.topicHint.slice(0, 5)}`,
            ),
        );
        return [...prevEvents, ...filteredNewEvents];
      });
    }
  };

  const parseAndStyleText = (text: string): React.ReactNode[] => {
    // Handle non-string input gracefully
    if (!text || typeof text !== "string") {
      console.warn("parseAndStyleText received non-string input:", text);
      return [<span key="error">Invalid text content</span>];
    }

    const elements: React.ReactNode[] = [];
    const lines = text.split("\n");
    let listItems: string[] = [];
    let inList = false;

    const flushList = () => {
      if (inList && listItems.length > 0) {
        elements.push(
          <ul
            key={`list-${elements.length}`}
            className="list-disc list-inside space-y-1 my-3 pl-4 text-slate-300"
            data-magic-selectable="true"
            data-content-type="list"
          >
            {listItems.map((item, idx) => (
              <li
                key={idx}
                data-magic-selectable="true"
                data-content-type="list-item"
                dangerouslySetInnerHTML={{ __html: styleLine(item) }}
              />
            ))}
          </ul>,
        );
      }
      listItems = [];
      inList = false;
    };

    const styleLine = (line: string) => {
      return line
        .replace(
          /\*\*(.*?)\*\*/g,
          '<strong class="font-semibold text-sky-300">$1</strong>',
        )
        .replace(/\*(.*?)\*/g, '<em class="italic text-sky-400">$1</em>');
    };

    lines.forEach((line, index) => {
      line = line.trim();

      // Check if this line is an IDEA title that should not be magic-selectable
      const isIdeaTitle = /^🎯\s*\*\*IDEA\s*#\d+|^\*\*IDEA\s*#?\d+|^IDEA\s*#?\d+|^\d+\.\s*IDEA/i.test(line);

      if (line.startsWith("### ")) {
        flushList();
        elements.push(
          <h3
            key={`h3-${index}-${line.substring(4, 20)}`}
            className="text-lg font-semibold text-sky-300 mt-3 mb-1"
            data-magic-selectable="false"
            data-content-type="heading"
            dangerouslySetInnerHTML={{ __html: styleLine(line.substring(4)) }}
          />,
        );
      } else if (line.startsWith("## ")) {
        flushList();
        elements.push(
          <h2
            key={`h2-${index}-${line.substring(3, 20)}`}
            className="text-xl font-semibold text-sky-200 mt-4 mb-2 border-b border-slate-700 pb-1"
            data-magic-selectable="false"
            data-content-type="heading"
            dangerouslySetInnerHTML={{ __html: styleLine(line.substring(3)) }}
          />,
        );
      } else if (line.startsWith("* ") || line.startsWith("- ")) {
        if (!inList) inList = true;
        listItems.push(line.substring(2));
      } else if (line === "") {
        flushList();
      } else {
        flushList();

        // Check if this is an IDEA title or regular content
        const isMagicSelectable = !isIdeaTitle;
        const contentType = isIdeaTitle ? "idea-title" : "content";

        elements.push(
          <p
            key={`p-${index}-${line.substring(0, 15)}`}
            className={`my-2 leading-relaxed text-slate-200 ${isIdeaTitle ? 'font-semibold text-sky-300' : ''}`}
            data-magic-selectable={isMagicSelectable.toString()}
            data-content-type={contentType}
            dangerouslySetInnerHTML={{ __html: styleLine(line) }}
          />,
        );
      }
    });

    flushList();
    return elements;
  };

  const renderOutput = () => {
    const outputToRender = displayedOutputItem?.output;
    if (!outputToRender)
      return (
        <div className="text-slate-400">
          Your generated content will appear here.
        </div>
      );

    if (Array.isArray(outputToRender)) {
      if (
        outputToRender.every(
          (item) =>
            typeof item === "object" &&
            item !== null &&
            "suggestedPrompt" in item,
        )
      ) {
        return (
          <div className="space-y-4">
            {" "}
            {(outputToRender as PromptOptimizationSuggestion[]).map(
              (sugg, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-700/80 rounded-lg shadow"
                >
                  {" "}
                  <h4 className="font-semibold text-sky-300 mb-2">
                    Suggested Prompt:
                  </h4>{" "}
                  <p className="text-slate-200 whitespace-pre-wrap bg-slate-600/70 p-3 rounded-md">
                    {sugg.suggestedPrompt}
                  </p>{" "}
                  {sugg.reasoning && (
                    <>
                      {" "}
                      <h5 className="font-semibold text-sky-400 mt-3 mb-1">
                        Reasoning:
                      </h5>{" "}
                      <p className="text-slate-300 text-sm">
                        {sugg.reasoning}
                      </p>{" "}
                    </>
                  )}{" "}
                  <button
                    onClick={() => {
                      setGeneratorInput(sugg.suggestedPrompt);
                      setContentType(
                        displayedOutputItem?.contentType || contentType,
                      );
                      setActiveTab("generator");
                    }}
                    className="mt-4 px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-sm rounded-md transition-colors shadow-sm"
                  >
                    {" "}
                    Use this Prompt{" "}
                  </button>{" "}
                </div>
              ),
            )}{" "}
          </div>
        );
      } else if (
        outputToRender.every(
          (item) =>
            typeof item === "object" &&
            item !== null &&
            "title" in item &&
            "content" in item,
        )
      ) {
        return (
          <div className="text-slate-300 p-4 bg-slate-800 rounded-lg shadow-md">
            Channel analysis generated. View in the 'Channel Analysis' tab for
            full details.
          </div>
        );
      }
    } else if (isGeneratedImageOutput(outputToRender)) {
      return (
        <img
          src={`data:${outputToRender.mimeType};base64,${outputToRender.base64Data}`}
          alt="Generated"
          className="max-w-full h-auto rounded-lg shadow-lg border-2 border-slate-700"
        />
      );
    } else if (isGeneratedTextOutput(outputToRender)) {
      // Ensure content is a string before using string methods
      const contentText =
        typeof outputToRender.content === "string"
          ? outputToRender.content
          : String(outputToRender.content || "");

      // Check if this is content ideas (contains numbered ideas pattern)
      const isContentIdeas =
        contentText.includes("IDEA #") ||
        (contentText.includes("🎯") &&
          (contentText.includes("IDEA") || contentText.includes("Idea")));

      if (isContentIdeas) {
        const outputId = displayedOutputItem?.id || "current";
        const currentExpandedIdeas = expandedIdeas[outputId] || {};

        // Use the parseContentIdeas function for consistent parsing
        const parsedIdeas = parseContentIdeas(contentText);

        // Debug logging to understand parsing
        console.log("🔍 Content Ideas Debug:", {
          contentText: contentText.substring(0, 500) + "...",
          parsedIdeas,
          parsedIdeasCount: parsedIdeas.length,
        });

        // Fallback parsing if parseContentIdeas doesn't work well
        let ideasToRender = parsedIdeas;
        if (parsedIdeas.length <= 1) {
          // Try splitting by the emoji pattern
          const emojiSplit = contentText.split(/(?=����������)/);
          if (emojiSplit.length > 1) {
            ideasToRender = emojiSplit
              .filter((section) => section.trim().length > 20)
              .map((section, index) => ({
                ideaNumber: index + 1,
                idea: section.trim(),
              }));
            console.log("🔄 Using emoji-based parsing:", ideasToRender);
          } else {
            // Try alternative parsing methods as last resort
            const alternativeParsing = contentText
              .split(/(?=\d+\.|\*\*\d+\.|\d+\s*:|\*\*IDEA|\bIDEA\b)/i)
              .filter((section) => {
                const trimmed = section.trim();
                return (
                  trimmed.length > 20 &&
                  (/^\d+\./.test(trimmed) ||
                    /^\*\*\d+\./.test(trimmed) ||
                    /^\d+\s*:/.test(trimmed) ||
                    /IDEA/i.test(trimmed))
                );
              })
              .map((section, index) => ({
                ideaNumber: index + 1,
                idea: section.trim(),
              }));

            if (alternativeParsing.length > 1) {
              ideasToRender = alternativeParsing;
              console.log("🔄 Using alternative parsing:", alternativeParsing);
            }
          }
        }

        return (
          <>
            <div className="space-y-4">
              {ideasToRender.map((parsedIdea) => {
                const { ideaNumber, idea: ideaContent } = parsedIdea;
                const expanded = currentExpandedIdeas[ideaNumber];
                const isCollapsed =
                  collapsedIdeas[outputId]?.[ideaNumber] === true;
                const hasExpandedContent =
                  expanded?.expandedContent && !expanded.isExpanding;

                return (
                  <div
                    key={ideaNumber}
                    className="bg-slate-800/50 rounded-lg p-4 border border-slate-700"
                  >
                    <div
                      className="styled-text-output space-y-2 mb-3"
                      data-content-area="true"
                      data-magic-selectable-container="true"
                    >
                      {parseAndStyleText(ideaContent.trim())}
                    </div>

                    <div
                      className="flex items-center justify-between pt-3 border-t border-slate-700/50"
                      data-magic-selectable="false"
                      data-content-type="actions"
                    >
                      <div className="flex items-center justify-between w-full">
                        {/* Left side - Expand and Generate buttons */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              if (hasExpandedContent && isCollapsed) {
                                // Show already generated content
                                handleShowIdea(ideaNumber);
                              } else if (!hasExpandedContent) {
                                // Generate new content
                                handleExpandIdea(ideaNumber, ideaContent.trim());
                              }
                            }}
                            disabled={
                              expanded?.isExpanding ||
                              (hasExpandedContent && !isCollapsed)
                            }
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-600 text-white text-sm font-medium rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
                          >
                            {expanded?.isExpanding ? (
                              <>
                                <LoadingSpinner />
                                Expanding...
                              </>
                            ) : hasExpandedContent && isCollapsed ? (
                              <>
                                <SparklesIcon className="w-4 h-4" />
                                Show Details
                              </>
                            ) : hasExpandedContent ? (
                              <>
                                <SparklesIcon className="w-4 h-4" />
                                Expanded
                              </>
                            ) : (
                              <>
                                <SparklesIcon className="w-4 h-4" />
                                Expand
                              </>
                            )}
                          </button>

                          <GenerateDropdown
                            onOptionSelect={(optionId, originalIdea) =>
                              handleGenerateFromIdea(
                                optionId,
                                originalIdea,
                                ideaNumber,
                              )
                            }
                            originalIdea={ideaContent.trim()}
                            disabled={expanded?.isExpanding}
                          />
                        </div>

                        {/* Right side - Rating Buttons pushed to far right */}
                        <div className="flex items-center">
                          <RatingButtons
                            rating={displayedOutputItem?.rating || 0}
                            onRating={(rating) => {
                              if (displayedOutputItem) {
                                handleRateCurrentContentWithFirebase(rating, ideaContent.trim());
                              }
                            }}
                            size="sm"
                            showTooltip={true}
                          />
                        </div>
                      </div>

                      {/* Status indicators */}
                      {(hasExpandedContent && !isCollapsed) || (hasExpandedContent && isCollapsed) ? (
                        <div className="flex items-center gap-3 mt-2">
                          {hasExpandedContent && !isCollapsed && (
                            <span className="text-xs text-green-400 flex items-center gap-1">
                              <CheckCircleIcon className="w-4 h-4" />
                              Expanded below
                            </span>
                          )}

                          {hasExpandedContent && isCollapsed && (
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <CheckCircleIcon className="w-4 h-4" />
                              Already expanded (click to show)
                            </span>
                          )}
                        </div>
                      ) : null}
                    </div>

                    {hasExpandedContent && !isCollapsed && (
                      <div className="mt-4 p-4 bg-slate-900/60 rounded-lg border border-purple-500/30">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-semibold text-purple-300 flex items-center gap-2">
                            <SparklesIcon className="w-4 h-4" />
                            Expanded Details
                          </h4>
                          <button
                            onClick={() => handleCollapseIdea(ideaNumber)}
                            className="flex items-center gap-1 px-3 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-md transition-all duration-200 border border-slate-600"
                          >
                            <ChevronUpIcon className="w-3 h-3" />
                            Show Less
                          </button>
                        </div>
                        <div className="styled-text-output space-y-2 text-slate-200">
                          {parseAndStyleText(expanded.expandedContent)}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {outputToRender.groundingSources &&
              outputToRender.groundingSources.length > 0 && (
                <div
                  className="mt-6 pt-4 border-t border-slate-700"
                  data-magic-selectable="false"
                  data-content-type="sources"
                >
                  <h4
                    className="text-md font-semibold text-sky-300 mb-2"
                    data-magic-selectable="false"
                    data-content-type="heading"
                  >
                    Sources:
                  </h4>
                  <ul className="space-y-1.5">
                    {outputToRender.groundingSources.map((source, index) => (
                      <li
                        key={source.uri || `source-${index}`}
                        className="text-sm"
                      >
                        <a
                          href={source.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sky-400 hover:text-sky-300 hover:underline break-all flex items-center"
                        >
                          <LinkIcon className="w-4 h-4 mr-2 text-slate-500 shrink-0" />
                          <span className="truncate">
                            {source.title || source.uri}
                          </span>
                          <ArrowUpRightIcon className="inline h-3.5 w-3.5 ml-1 shrink-0" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </>
        );
      }

      // Regular text output (non-content ideas)
      return (
        <>
          <div
            className="styled-text-output space-y-2"
            data-content-area="true"
            data-magic-selectable-container="true"
          >
            {parseAndStyleText(contentText)}
          </div>
          {outputToRender.groundingSources &&
            outputToRender.groundingSources.length > 0 && (
              <div
                className="mt-6 pt-4 border-t border-slate-700"
                data-magic-selectable="false"
                data-content-type="sources"
              >
                <h4
                  className="text-md font-semibold text-sky-300 mb-2"
                  data-magic-selectable="false"
                  data-content-type="heading"
                >
                  Sources:
                </h4>
                <ul className="space-y-1.5">
                  {outputToRender.groundingSources.map((source, index) => (
                    <li
                      key={source.uri || `source-${index}`}
                      className="text-sm"
                    >
                      <a
                        href={source.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-400 hover:text-sky-300 hover:underline break-all flex items-center"
                      >
                        <LinkIcon className="w-4 h-4 mr-2 text-slate-500 shrink-0" />
                        <span className="truncate">
                          {source.title || source.uri}
                        </span>
                        <ArrowUpRightIcon className="inline h-3.5 w-3.5 ml-1 shrink-0" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </>
      );
    } else if (isContentStrategyPlanOutput(outputToRender)) {
      return (
        <div className="text-slate-300 p-4 bg-slate-800 rounded-lg shadow-md">
          Content Strategy Plan generated. View in the 'Strategy' tab for full
          details.
        </div>
      );
    } else if (isTrendAnalysisOutput(outputToRender)) {
      return (
        <div className="text-slate-300 p-4 bg-slate-800 rounded-lg shadow-md">
          Trend Analysis generated. View in the 'Trends' tab for full details.
        </div>
      );
    } else if (isEngagementFeedbackOutput(outputToRender)) {
      return (
        <div className="p-4 bg-slate-700/80 rounded-lg shadow">
          {" "}
          <h4 className="font-semibold text-sky-300 mb-2 text-md">
            AI Engagement Feedback:
          </h4>{" "}
          <p className="text-slate-200 whitespace-pre-wrap leading-relaxed">
            {outputToRender.feedback}
          </p>{" "}
        </div>
      );
    } else if (typeof outputToRender === "object" && outputToRender !== null) {
      if (
        "titleSuggestions" in outputToRender &&
        "keyAngles" in outputToRender
      ) {
        const brief = outputToRender as ContentBriefOutput;
        return (
          <div className="space-y-4 p-4 bg-slate-700/80 rounded-lg shadow">
            {" "}
            <h3 className="text-lg font-semibold text-sky-300 border-b border-slate-600 pb-2 mb-3">
              Content Brief
            </h3>{" "}
            <div>
              <strong className="text-sky-400 block mb-1">
                Title Suggestions:
              </strong>{" "}
              <ul className="list-disc list-inside ml-4 text-slate-300 text-sm space-y-1">
                {brief.titleSuggestions.map((pt, i) => (
                  <li key={i}>{pt}</li>
                ))}
              </ul>
            </div>{" "}
            <div>
              <strong className="text-sky-400 block mb-1">Key Angles:</strong>{" "}
              <ul className="list-disc list-inside ml-4 text-slate-300 text-sm space-y-1">
                {brief.keyAngles.map((pt, i) => (
                  <li key={i}>{pt}</li>
                ))}
              </ul>
            </div>{" "}
            <div>
              <strong className="text-sky-400 block mb-1">
                Main Talking Points:
              </strong>{" "}
              <ul className="list-disc list-inside ml-4 text-slate-300 text-sm space-y-1">
                {brief.mainTalkingPoints.map((pt, i) => (
                  <li key={i}>{pt}</li>
                ))}
              </ul>
            </div>{" "}
            <div>
              <strong className="text-sky-400 block mb-1">
                CTA Suggestions:
              </strong>{" "}
              <ul className="list-disc list-inside ml-4 text-slate-300 text-sm space-y-1">
                {brief.ctaSuggestions.map((pt, i) => (
                  <li key={i}>{pt}</li>
                ))}
              </ul>
            </div>{" "}
            <div className="text-sm">
              <strong className="text-sky-400">Tone & Style:</strong>{" "}
              <span className="text-slate-300">{brief.toneAndStyleNotes}</span>
            </div>{" "}
          </div>
        );
      } else if (
        "items" in outputToRender &&
        "type" in outputToRender &&
        (outputToRender.type === "poll" || outputToRender.type === "quiz")
      ) {
        const pollQuiz = outputToRender as PollQuizOutput;
        return (
          <div className="space-y-4 p-4 bg-slate-700/80 rounded-lg shadow">
            {" "}
            <h3 className="font-semibold text-lg text-sky-300 border-b border-slate-600 pb-2 mb-3">
              {pollQuiz.title ||
                (pollQuiz.type === "poll" ? "Poll Questions" : "Quiz")}
            </h3>{" "}
            {pollQuiz.items.map((item, idx) => (
              <div key={idx} className="p-3 bg-slate-600/70 rounded-md">
                {" "}
                <p className="font-medium text-slate-100 mb-1.5">
                  {idx + 1}. {item.question}
                </p>{" "}
                <ul className="list-decimal list-inside ml-5 text-sm text-slate-300 space-y-1">
                  {" "}
                  {item.options.map((opt, i) => (
                    <li
                      key={i}
                      className={
                        pollQuiz.type === "quiz" &&
                        (item as QuizQuestion).correctAnswerIndex === i
                          ? "text-green-400 font-medium"
                          : ""
                      }
                    >
                      {opt}
                    </li>
                  ))}{" "}
                </ul>{" "}
                {pollQuiz.type === "quiz" &&
                  (item as QuizQuestion).explanation && (
                    <p className="text-xs italic mt-2 text-slate-400 pt-2 border-t border-slate-500/50">
                      Explanation: {(item as QuizQuestion).explanation}
                    </p>
                  )}{" "}
              </div>
            ))}{" "}
          </div>
        );
      } else if ("scoreDescription" in outputToRender) {
        const readabilityOutput = outputToRender as ReadabilityOutput;
        return (
          <div className="space-y-3 p-4 bg-slate-700/80 rounded-lg shadow">
            {" "}
            <h3 className="font-semibold text-lg text-sky-300 border-b border-slate-600 pb-2 mb-3">
              Readability Analysis
            </h3>{" "}
            <div>
              <strong className="text-sky-400">Assessment:</strong>{" "}
              <span className="text-slate-200">
                {readabilityOutput.scoreDescription}
              </span>
            </div>{" "}
            {readabilityOutput.simplifiedContent && (
              <div>
                <strong className="text-sky-400 block mb-1">
                  Simplified Version:
                </strong>
                <p className="whitespace-pre-wrap mt-1 p-3 bg-slate-600/70 rounded-md text-slate-200 leading-relaxed">
                  {readabilityOutput.simplifiedContent}
                </p>
              </div>
            )}{" "}
          </div>
        );
      } else if (typeof outputToRender === "string") {
        // Handle direct string output for youtubeStats
        return (
          <div className="styled-text-output space-y-2">
            {parseAndStyleText(outputToRender)}
          </div>
        );
      }
    }
    return (
      <div className="whitespace-pre-wrap text-slate-200 bg-slate-800 p-3 rounded">
        {JSON.stringify(outputToRender, null, 2)}
      </div>
    );
  };

  const exportContentAsMarkdown = (
    content: HistoryItem["output"],
    title?: string,
  ) => {
    let markdownContent = `# ${title || "AI Generated Content"}\n\n`;
    if (isGeneratedTextOutput(content)) {
      markdownContent += content.content;
      if (content.groundingSources && content.groundingSources.length > 0) {
        markdownContent += "\n\n## Sources\n";
        content.groundingSources.forEach(
          (s) => (markdownContent += `- [${s.title || s.uri}](${s.uri})\n`),
        );
      }
    } else if (isContentStrategyPlanOutput(content)) {
      markdownContent += `## Target Audience\n${content.targetAudienceOverview}\n\n`;
      markdownContent += `## Strategic Goals\n${content.goals.map((goal) => `- ${goal}`).join("\n")}\n\n`;

      markdownContent += `## Content Pillars\n`;
      content.contentPillars.forEach((p) => {
        markdownContent += `### ${p.pillarName}\n${p.description}\n`;
        markdownContent += `**Keywords:** ${p.keywords.join(", ")}\n`;
        markdownContent += `**Content Types:** ${p.contentTypes.join(", ")}\n`;
        markdownContent += `**Posting Frequency:** ${p.postingFrequency}\n`;
        markdownContent += `**Engagement Strategy:** ${p.engagementStrategy}\n\n`;
      });

      markdownContent += `## Key Themes\n`;
      content.keyThemes.forEach((t) => {
        markdownContent += `### ${t.themeName}\n${t.description}\n`;
        markdownContent += `**Related Pillars:** ${t.relatedPillars.join(", ")}\n`;
        markdownContent += `**SEO Keywords:** ${t.seoKeywords.join(", ")}\n`;
        markdownContent += `**Conversion Goal:** ${t.conversionGoal}\n`;
        markdownContent += `**Content Ideas:**\n${t.contentIdeas.map((ci) => `- ${ci.title} (${ci.format} for ${ci.platform}) - CTA: ${ci.cta}`).join("\n")}\n\n`;
      });

      markdownContent += `## Posting Schedule\n`;
      markdownContent += `**Frequency:** ${content.postingSchedule.frequency}\n`;
      markdownContent += `**Timezone:** ${content.postingSchedule.timezone}\n`;
      markdownContent += `**Optimal Times by Day:**\n`;
      Object.entries(content.postingSchedule.optimalTimes).forEach(
        ([day, times]) => {
          markdownContent += `- **${day}:** ${times.join(", ")}\n`;
        },
      );
      markdownContent += `\n**Seasonal Adjustments:** ${content.postingSchedule.seasonalAdjustments}\n\n`;

      markdownContent += `## Weekly Content Schedule\n${content.suggestedWeeklySchedule.map((si) => `- **${si.dayOfWeek}** (${si.optimalTime}): ${si.contentType} - ${si.topicHint} - CTA: ${si.cta}`).join("\n")}\n\n`;

      markdownContent += `## SEO & Keywords Strategy\n`;
      markdownContent += `**Primary Keywords:** ${content.seoStrategy.primaryKeywords.join(", ")}\n`;
      markdownContent += `**Long-tail Keywords:** ${content.seoStrategy.longtailKeywords.join(", ")}\n`;
      markdownContent += `**Hashtag Strategy:**\n`;
      markdownContent += `- Trending: ${content.seoStrategy.hashtagStrategy.trending.join(", ")}\n`;
      markdownContent += `- Niche: ${content.seoStrategy.hashtagStrategy.niche.join(", ")}\n`;
      markdownContent += `- Branded: ${content.seoStrategy.hashtagStrategy.branded.join(", ")}\n`;
      markdownContent += `- Community: ${content.seoStrategy.hashtagStrategy.community.join(", ")}\n`;
      markdownContent += `**Content Optimization:** ${content.seoStrategy.contentOptimization}\n\n`;

      markdownContent += `## Call-to-Action Strategy\n`;
      markdownContent += `**Engagement CTAs:** ${content.ctaStrategy.engagementCTAs.join(", ")}\n`;
      markdownContent += `**Conversion CTAs:** ${content.ctaStrategy.conversionCTAs.join(", ")}\n`;
      markdownContent += `**Community Building CTAs:** ${content.ctaStrategy.communityBuildingCTAs.join(", ")}\n`;
      markdownContent += `**Placement Guidelines:** ${content.ctaStrategy.placementGuidelines}\n\n`;

      markdownContent += `## Content Management Workflow\n`;
      markdownContent += `**Workflow Steps:** ${content.contentManagement.workflowSteps.join(" → ")}\n`;
      markdownContent += `**Quality Checklist:** ${content.contentManagement.qualityChecklist.join(", ")}\n`;
      markdownContent += `**Approval Process:** ${content.contentManagement.approvalProcess}\n`;
      markdownContent += `**Editing Guidelines:**\n`;
      markdownContent += `- Visual Style: ${content.contentManagement.editingGuidelines.visualStyle}\n`;
      markdownContent += `- Video Specs: ${content.contentManagement.editingGuidelines.videoSpecs}\n`;
      markdownContent += `- Image Specs: ${content.contentManagement.editingGuidelines.imageSpecs}\n`;
      markdownContent += `- Branding: ${content.contentManagement.editingGuidelines.brandingElements}\n\n`;

      markdownContent += `## Distribution Strategy\n`;
      markdownContent += `**Primary Platform:** ${content.distributionStrategy.primaryPlatform}\n`;
      markdownContent += `**Cross-Platform Sharing:** ${content.distributionStrategy.crossPlatformSharing.join(", ")}\n`;
      markdownContent += `**Repurposing Plan:** ${content.distributionStrategy.repurposingPlan}\n`;
      markdownContent += `**Community Engagement:** ${content.distributionStrategy.communityEngagement}\n\n`;

      markdownContent += `## Analytics & KPIs\n`;
      markdownContent += `**Primary Metrics:** ${content.analyticsAndKPIs.primaryMetrics.join(", ")}\n`;
      markdownContent += `**Secondary Metrics:** ${content.analyticsAndKPIs.secondaryMetrics.join(", ")}\n`;
      markdownContent += `**Reporting Schedule:** ${content.analyticsAndKPIs.reportingSchedule}\n`;
      markdownContent += `**Analytics Tools:** ${content.analyticsAndKPIs.analyticsTools.join(", ")}\n\n`;

      markdownContent += `## Budget & Resources\n`;
      markdownContent += `**Time Allocation:** ${content.budgetAndResources.timeAllocation}\n`;
      markdownContent += `**Tools Needed:** ${content.budgetAndResources.toolsNeeded.join(", ")}\n`;
      markdownContent += `**Team Roles:** ${content.budgetAndResources.teamRoles.join(", ")}\n`;
      markdownContent += `**Budget Breakdown:** ${content.budgetAndResources.budgetBreakdown}\n\n`;

      markdownContent += `## Competitor Analysis\n`;
      markdownContent += `**Top Competitors:** ${content.competitorAnalysis.topCompetitors.join(", ")}\n`;
      markdownContent += `**Gap Opportunities:** ${content.competitorAnalysis.gapOpportunities.join(", ")}\n`;
      markdownContent += `**Differentiation Strategy:** ${content.competitorAnalysis.differentiationStrategy}\n\n`;

      markdownContent += `## Content Calendar Framework\n`;
      markdownContent += `**Monthly Themes:** ${content.contentCalendarTemplate.monthlyThemes.join(", ")}\n`;
      markdownContent += `**Seasonal Content:** ${content.contentCalendarTemplate.seasonalContent}\n`;
      markdownContent += `**Evergreen vs Trending:** ${content.contentCalendarTemplate["evergreen vs trending"]}\n`;
      markdownContent += `**Batch Creation Schedule:** ${content.contentCalendarTemplate.batchCreationSchedule}\n\n`;

      markdownContent += `## Risk Mitigation\n`;
      markdownContent += `**Content Backups:** ${content.riskMitigation.contentBackups}\n`;
      markdownContent += `**Crisis Management:** ${content.riskMitigation.crisisManagement}\n`;
      markdownContent += `**Platform Changes:** ${content.riskMitigation.platformChanges}\n`;
      markdownContent += `**Burnout Prevention:** ${content.riskMitigation.burnoutPrevention}`;
    } else if (
      Array.isArray(content) &&
      content.every(
        (s) =>
          typeof s === "object" && s !== null && "title" in s && "content" in s,
      )
    ) {
      markdownContent += (content as ParsedChannelAnalysisSection[])
        .map(
          (s) =>
            `## ${s.title}\n${s.content}${s.sources ? `\n\n**Sources:**\n${s.sources.map((src) => `- [${src.title || src.uri}](${src.uri})`).join("\n")}` : ""}${s.ideas ? `\n\n**Ideas:**\n${s.ideas.map((idea) => `- ${idea}`).join("\n")}` : ""}`,
        )
        .join("\n\n---\n\n");
    } else if (typeof content === "string") {
      // Handle direct string output for youtubeStats
      markdownContent += content;
    } else {
      markdownContent += JSON.stringify(content, null, 2);
    }

    const blob = new Blob([markdownContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `${(title || "content-export").replace(/[^a-z0-9]/gi, "_").toLowerCase()}.md`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const renderModal = (
    title: string,
    onClose: () => void,
    children: React.ReactNode,
    customMaxWidth?: string,
  ) => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div
        className={`bg-slate-800 p-6 rounded-lg shadow-2xl ${customMaxWidth || "max-w-2xl"} w-full max-h-[90vh] flex flex-col`}
      >
        <div className="flex justify-between items-center mb-4">
          {" "}
          <h3 className="text-xl font-semibold text-sky-400">{title}</h3>{" "}
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-sky-400 transition-colors"
          >
            {" "}
            <XCircleIcon className="h-7 w-7" />{" "}
          </button>{" "}
        </div>
        <div className="pr-2 flex-grow">{children}</div>
      </div>
    </div>
  );

  const RenderButton: React.FC<{
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    isActive?: boolean;
    className?: string;
    disabled?: boolean;
    buttonTitle?: string;
  }> = ({
    label,
    icon,
    onClick,
    isActive,
    className,
    disabled,
    buttonTitle,
  }) => (
    <button
      type="button"
      title={buttonTitle || label}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ease-in-out ${isActive ? "bg-sky-600 text-white shadow-md scale-105" : "bg-slate-700 text-slate-200 hover:bg-slate-600 hover:text-white focus:bg-slate-600"} ${disabled ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-75"} ${className}`}
    >
      {" "}
      {icon} <span>{label}</span>{" "}
    </button>
  );

  const mainTabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    {
      id: "studioHub",
      label: "Studio Hub",
      icon: (
        <SparklesIcon
          className="w-6 h-6 transition-all duration-200"
          style={{
            filter: "brightness(0) saturate(100%) invert(1)",
          }}
        />
      ),
    },
    {
      id: "generator",
      label: "Generator",
      icon: (
        <img
          src="/icons/generator.webp"
          alt="Generator"
          className="w-6 h-6 object-contain transition-all duration-200"
          style={{
            filter: "brightness(0) saturate(100%) invert(1)",
            userSelect: "none",
            pointerEvents: "none",
          }}
        />
      ),
    },
    {
      id: "canvas",
      label: "Canvas",
      icon: (
        <img
          src="/icons/canvas.webp"
          alt="Canvas"
          className="w-6 h-6 object-contain transition-all duration-200"
          style={{
            filter: "brightness(0) saturate(100%) invert(1)",
            userSelect: "none",
            pointerEvents: "none",
          }}
        />
      ),
    },
    {
      id: "channelAnalysis",
      label: "YT Analysis",
      icon: (
        <img
          src="/icons/yt-analysis.webp"
          alt="YT Analysis"
          className="w-6 h-6 object-contain transition-all duration-200"
          style={{
            filter: "brightness(0) saturate(100%) invert(1)",
            userSelect: "none",
            pointerEvents: "none",
          }}
        />
      ),
    },
    {
      id: "youtubeStats",
      label: "YT Stats",
      icon: (
        <img
          src="/icons/yt-stats.webp"
          alt="YT Stats"
          className="w-6 h-6 object-contain transition-all duration-200"
          style={{
            filter: "brightness(0) saturate(100%) invert(1)",
            userSelect: "none",
            pointerEvents: "none",
          }}
        />
      ),
    },
    {
      id: "thumbnailMaker",
      label: "Thumbnails",
      icon: (
        <img
          src="/icons/thumbnails.webp"
          alt="Thumbnails"
          className="w-6 h-6 object-contain transition-all duration-200"
          style={{
            filter: "brightness(0) saturate(100%) invert(1)",
            userSelect: "none",
            pointerEvents: "none",
          }}
        />
      ),
    },
    {
      id: "strategy",
      label: "Strategy",
      icon: (
        <img
          src="/icons/strategy.webp"
          alt="Strategy"
          className="w-6 h-6 object-contain transition-all duration-200"
          style={{
            filter: "brightness(0) saturate(100%) invert(1)",
            userSelect: "none",
            pointerEvents: "none",
          }}
        />
      ),
    },
    {
      id: "calendar",
      label: "Calendar",
      icon: (
        <img
          src="/icons/calendar.webp"
          alt="Calendar"
          className="w-6 h-6 object-contain transition-all duration-200"
          style={{
            filter: "brightness(0) saturate(100%) invert(1)",
            userSelect: "none",
            pointerEvents: "none",
          }}
        />
      ),
    },
    {
      id: "trends",
      label: "Trends",
      icon: (
        <img
          src="/icons/trends.webp"
          alt="Trends"
          className="w-6 h-6 object-contain transition-all duration-200"
          style={{
            filter: "brightness(0) saturate(100%) invert(1)",
            userSelect: "none",
            pointerEvents: "none",
          }}
        />
      ),
    },
    {
      id: "history",
      label: "History",
      icon: (
        <img
          src="/icons/history.webp"
          alt="History"
          className="w-6 h-6 object-contain transition-all duration-200"
          style={{
            filter: "brightness(0) saturate(100%) invert(1)",
            userSelect: "none",
            pointerEvents: "none",
          }}
        />
      ),
    },
    // HIDDEN: Web Search Tab (Restore by uncommenting this block)
    // {
    //   id: "search",
    //   label: "Web Search",
    //   icon: (
    //     <img
    //       src="/icons/web-search.webp"
    //       alt="Web Search"
    //       className="w-6 h-6 object-contain transition-all duration-200"
    //       style={{
    //         filter: "brightness(0) saturate(100%) invert(1)",
    //         userSelect: "none",
    //         pointerEvents: "none",
    //       }}
    //     />
    //   ),
    // },
  ];

  const ToolbarButton: React.FC<{
    title: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    children?: React.ReactNode;
    className?: string;
    id?: string;
    disabled?: boolean;
  }> = ({
    title,
    icon,
    onClick,
    children,
    className = "",
    id,
    disabled = false,
  }) => (
    <button
      id={id}
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      disabled={disabled}
      className={`p-2 h-9 flex items-center text-xs text-slate-300 bg-slate-700/50 hover:bg-gradient-to-r hover:from-sky-600 hover:to-purple-600 hover:text-white rounded-md transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-sky-400 shadow-sm hover:shadow-lg hover:scale-105 group ${className} ${disabled ? "opacity-50 cursor-not-allowed hover:bg-slate-700/50 hover:text-slate-300" : ""}`}
    >
      {icon}
      {children && <span className={icon ? "ml-1.5" : ""}>{children}</span>}
    </button>
  );

  const renderCanvasPropertiesPanel = () => {
    if (!selectedCanvasItemId) return null;
    const selectedItem = canvasItems.find(
      (item) => item.id === selectedCanvasItemId,
    );
    if (!selectedItem) return null;
    const updateProp = <K extends keyof CanvasItem>(
      propName: K,
      value: CanvasItem[K],
    ) => updateCanvasItemProperty(selectedItem.id, propName, value);
    const ColorSwatch: React.FC<{
      color: string;
      selectedColor?: string;
      onClick: (color: string) => void;
    }> = ({ color, selectedColor, onClick }) => (
      <button
        type="button"
        onClick={() => onClick(color)}
        className={`w-5 h-5 rounded-md border-2 transition-all ${selectedColor === color ? "ring-2 ring-offset-1 ring-offset-slate-800 ring-sky-400 border-sky-400" : "border-slate-600 hover:border-slate-400 hover:scale-110"}`}
        style={{ backgroundColor: color }}
        aria-label={`Color ${color}`}
        aria-pressed={selectedColor === color}
      />
    );
    const isLineMode =
      selectedItem.type === "shapeElement" &&
      selectedItem.shapeVariant === "rectangle" &&
      (selectedItem.height || 0) <= 10;

    return (
      <div
        className="p-3 bg-slate-800/70 border-b border-slate-700 flex flex-wrap items-center gap-x-4 gap-y-3 text-xs shadow-inner"
        role="toolbar"
        aria-label="Canvas Item Properties"
      >
        <span className="font-semibold text-sky-400 mr-2 text-sm">
          Properties{isLineMode ? " (Line Mode)" : ""}:
        </span>
        {(selectedItem.type === "textElement" ||
          selectedItem.type === "stickyNote" ||
          selectedItem.type === "commentElement") && (
          <>
            {" "}
            <div className="flex items-center gap-1.5">
              {" "}
              <label
                htmlFor={`itemTextColor-${selectedItem.id}`}
                className="text-slate-300 mr-1"
              >
                Text:
              </label>{" "}
              {CANVAS_PRESET_COLORS.slice(0, 8).map((color) => (
                <ColorSwatch
                  key={`text-${color}`}
                  color={color}
                  selectedColor={selectedItem.textColor}
                  onClick={(c) => updateProp("textColor", c)}
                />
              ))}{" "}
            </div>{" "}
            <select
              id={`itemFontFamily-${selectedItem.id}`}
              value={selectedItem.fontFamily || DEFAULT_FONT_FAMILY}
              onChange={(e) =>
                updateProp("fontFamily", e.target.value as FontFamily)
              }
              className="p-1.5 bg-slate-700 rounded-md border border-slate-600 text-slate-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
              aria-label="Font Family"
            >
              {" "}
              {CANVAS_FONT_FAMILIES.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}{" "}
            </select>{" "}
            <input
              id={`itemFontSize-${selectedItem.id}`}
              type="number"
              value={parseInt(selectedItem.fontSize || DEFAULT_FONT_SIZE)}
              onChange={(e) =>
                updateProp(
                  "fontSize",
                  `${Math.max(8, parseInt(e.target.value))}px`,
                )
              }
              className="w-14 p-1.5 bg-slate-700 rounded-md border border-slate-600 text-slate-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
              title="Font Size (px)"
              aria-label="Font Size"
            />{" "}
            <div className="flex gap-1 bg-slate-700 p-0.5 rounded-md border border-slate-600">
              {" "}
              <button
                onClick={() =>
                  updateProp(
                    "fontWeight",
                    selectedItem.fontWeight === "bold" ? "normal" : "bold",
                  )
                }
                className={`p-1 rounded-sm ${selectedItem.fontWeight === "bold" ? "bg-sky-600" : "hover:bg-slate-600"}`}
                title="Bold"
                aria-pressed={selectedItem.fontWeight === "bold"}
              >
                <BoldIcon className="w-4 h-4 text-slate-200" />
              </button>{" "}
              <button
                onClick={() =>
                  updateProp(
                    "fontStyle",
                    selectedItem.fontStyle === "italic" ? "normal" : "italic",
                  )
                }
                className={`p-1 rounded-sm ${selectedItem.fontStyle === "italic" ? "bg-sky-600" : "hover:bg-slate-600"}`}
                title="Italic"
                aria-pressed={selectedItem.fontStyle === "italic"}
              >
                <ItalicIcon className="w-4 h-4 text-slate-200" />
              </button>{" "}
              <button
                onClick={() =>
                  updateProp(
                    "textDecoration",
                    selectedItem.textDecoration === "underline"
                      ? "none"
                      : "underline",
                  )
                }
                className={`p-1 rounded-sm ${selectedItem.textDecoration === "underline" ? "bg-sky-600" : "hover:bg-slate-600"}`}
                title="Underline"
                aria-pressed={selectedItem.textDecoration === "underline"}
              >
                <UnderlineIcon className="w-4 h-4 text-slate-200" />
              </button>{" "}
            </div>{" "}
          </>
        )}
        {(selectedItem.type === "shapeElement" ||
          selectedItem.type === "stickyNote" ||
          selectedItem.type === "frameElement" ||
          selectedItem.type === "commentElement") &&
          !isLineMode && (
            <div className="flex items-center gap-1.5">
              {" "}
              <label
                htmlFor={`itemBgColor-${selectedItem.id}`}
                className="text-slate-300 mr-1"
              >
                Fill:
              </label>{" "}
              {CANVAS_PRESET_COLORS.slice(0, 12).map((color) => (
                <ColorSwatch
                  key={`bg-${color}`}
                  color={color}
                  selectedColor={selectedItem.backgroundColor}
                  onClick={(c) => updateProp("backgroundColor", c)}
                />
              ))}{" "}
            </div>
          )}
        {isLineMode && (
          <div className="flex items-center gap-1.5">
            {" "}
            <label
              htmlFor={`itemLineColor-${selectedItem.id}`}
              className="text-slate-300 mr-1"
            >
              Line Color:
            </label>{" "}
            {CANVAS_PRESET_COLORS.slice(0, 12).map((color) => (
              <ColorSwatch
                key={`line-${color}`}
                color={color}
                selectedColor={selectedItem.backgroundColor}
                onClick={(c) => updateProp("backgroundColor", c)}
              />
            ))}{" "}
          </div>
        )}
        {(selectedItem.type === "shapeElement" ||
          selectedItem.type === "frameElement") &&
          !isLineMode && (
            <>
              {" "}
              <div className="flex items-center gap-1.5">
                {" "}
                <label
                  htmlFor={`itemBorderColor-${selectedItem.id}`}
                  className="text-slate-300 mr-1"
                >
                  Border:
                </label>{" "}
                {CANVAS_PRESET_COLORS.slice(0, 12).map((color) => (
                  <ColorSwatch
                    key={`border-${color}`}
                    color={color}
                    selectedColor={selectedItem.borderColor}
                    onClick={(c) => updateProp("borderColor", c)}
                  />
                ))}{" "}
              </div>{" "}
              <input
                id={`itemBorderWidth-${selectedItem.id}`}
                type="number"
                value={parseInt(selectedItem.borderWidth || "1")}
                onChange={(e) =>
                  updateProp(
                    "borderWidth",
                    `${Math.max(0, parseInt(e.target.value))}px`,
                  )
                }
                className="w-14 p-1.5 bg-slate-700 rounded-md border border-slate-600 text-slate-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                title="Border Width (px)"
                aria-label="Border Width"
              />{" "}
              <select
                id={`itemBorderStyle-${selectedItem.id}`}
                value={selectedItem.borderStyle || "solid"}
                onChange={(e) =>
                  updateProp("borderStyle", e.target.value as LineStyle)
                }
                className="p-1.5 bg-slate-700 rounded-md border border-slate-600 text-slate-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                aria-label="Border Style"
              >
                {" "}
                {(["solid", "dashed", "dotted"] as LineStyle[]).map((style) => (
                  <option key={style} value={style}>
                    {style.charAt(0).toUpperCase() + style.slice(1)}
                  </option>
                ))}{" "}
              </select>{" "}
            </>
          )}
        {isLineMode && (
          <select
            id={`itemLineStyle-${selectedItem.id}`}
            value={selectedItem.borderStyle || "solid"}
            onChange={(e) =>
              updateProp("borderStyle", e.target.value as LineStyle)
            }
            className="p-1.5 bg-slate-700 rounded-md border border-slate-600 text-slate-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
            title="Line Style"
            aria-label="Line Style"
          >
            {" "}
            {(["solid", "dashed", "dotted"] as LineStyle[]).map((style) => (
              <option key={style} value={style}>
                {style.charAt(0).toUpperCase() + style.slice(1)}
              </option>
            ))}{" "}
          </select>
        )}

        {/* Chart Properties */}
        {selectedItem.type === "chart" && (
          <>
            {/* Chart Type */}
            <div className="flex items-center gap-1.5">
              <label
                htmlFor={`chartType-${selectedItem.id}`}
                className="text-slate-300 mr-1"
              >
                Type:
              </label>
              <select
                id={`chartType-${selectedItem.id}`}
                value={selectedItem.chartType || "bar"}
                onChange={(e) => updateProp("chartType", e.target.value as any)}
                className="p-1.5 bg-slate-700 rounded-md border border-slate-600 text-slate-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="bar">Bar Chart</option>
                <option value="line">Line Chart</option>
                <option value="pie">Pie Chart</option>
                <option value="doughnut">Doughnut Chart</option>
                <option value="area">Area Chart</option>
                <option value="scatter">Scatter Plot</option>
                <option value="radar">Radar Chart</option>
              </select>
            </div>

            {/* Chart Title */}
            <div className="flex items-center gap-1.5">
              <label
                htmlFor={`chartTitle-${selectedItem.id}`}
                className="text-slate-300 mr-1"
              >
                Title:
              </label>
              <input
                id={`chartTitle-${selectedItem.id}`}
                type="text"
                value={selectedItem.chartTitle || ""}
                onChange={(e) => updateProp("chartTitle", e.target.value)}
                className="w-20 p-1.5 bg-slate-700 rounded-md border border-slate-600 text-slate-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                placeholder="Chart Title"
              />
            </div>

            {/* Color Scheme */}
            <div className="flex items-center gap-1.5">
              <label
                htmlFor={`colorScheme-${selectedItem.id}`}
                className="text-slate-300 mr-1"
              >
                Colors:
              </label>
              <select
                id={`colorScheme-${selectedItem.id}`}
                value={selectedItem.chartOptions?.colorScheme || "default"}
                onChange={(e) =>
                  updateProp("chartOptions", {
                    ...selectedItem.chartOptions,
                    colorScheme: e.target.value,
                  })
                }
                className="p-1.5 bg-slate-700 rounded-md border border-slate-600 text-slate-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="default">Default</option>
                <option value="rainbow">Rainbow</option>
                <option value="blues">Blues</option>
                <option value="greens">Greens</option>
                <option value="reds">Reds</option>
                <option value="purple">Purple</option>
                <option value="warm">Warm</option>
                <option value="cool">Cool</option>
                <option value="professional">Professional</option>
              </select>
            </div>

            {/* Show Options */}
            <div className="flex items-center gap-2">
              <label className="text-slate-300 mr-1">Show:</label>
              <label className="flex items-center text-xs">
                <input
                  type="checkbox"
                  checked={selectedItem.chartOptions?.showLegend ?? true}
                  onChange={(e) =>
                    updateProp("chartOptions", {
                      ...selectedItem.chartOptions,
                      showLegend: e.target.checked,
                    })
                  }
                  className="mr-1 text-sky-500 focus:ring-sky-500"
                />
                Legend
              </label>
              <label className="flex items-center text-xs">
                <input
                  type="checkbox"
                  checked={selectedItem.chartOptions?.showLabels ?? true}
                  onChange={(e) =>
                    updateProp("chartOptions", {
                      ...selectedItem.chartOptions,
                      showLabels: e.target.checked,
                    })
                  }
                  className="mr-1 text-sky-500 focus:ring-sky-500"
                />
                Labels
              </label>
              <label className="flex items-center text-xs">
                <input
                  type="checkbox"
                  checked={selectedItem.chartOptions?.showValues ?? true}
                  onChange={(e) =>
                    updateProp("chartOptions", {
                      ...selectedItem.chartOptions,
                      showValues: e.target.checked,
                    })
                  }
                  className="mr-1 text-sky-500 focus:ring-sky-500"
                />
                Values
              </label>
              <label className="flex items-center text-xs">
                <input
                  type="checkbox"
                  checked={selectedItem.chartOptions?.showPercentages ?? false}
                  onChange={(e) =>
                    updateProp("chartOptions", {
                      ...selectedItem.chartOptions,
                      showPercentages: e.target.checked,
                    })
                  }
                  className="mr-1 text-sky-500 focus:ring-sky-500"
                />
                %
              </label>
              <label className="flex items-center text-xs">
                <input
                  type="checkbox"
                  checked={selectedItem.chartOptions?.showGrid ?? true}
                  onChange={(e) =>
                    updateProp("chartOptions", {
                      ...selectedItem.chartOptions,
                      showGrid: e.target.checked,
                    })
                  }
                  className="mr-1 text-sky-500 focus:ring-sky-500"
                />
                Grid
              </label>
            </div>

            {/* Quick Data Editor */}
            <div className="flex items-center gap-1.5">
              <label className="text-slate-300 mr-1">Data:</label>
              <button
                type="button"
                onClick={() => {
                  const newLabels = prompt(
                    "Enter labels (comma-separated):",
                    selectedItem.chartData?.labels?.join(", ") ||
                      "Jan,Feb,Mar,Apr,May,Jun",
                  );
                  if (newLabels) {
                    const labels = newLabels.split(",").map((l) => l.trim());
                    updateProp("chartData", {
                      ...selectedItem.chartData,
                      labels,
                      datasets: [
                        {
                          ...selectedItem.chartData?.datasets?.[0],
                          label:
                            selectedItem.chartData?.datasets?.[0]?.label ||
                            "Data",
                          data: labels.map(
                            (_, i) =>
                              selectedItem.chartData?.datasets?.[0]?.data?.[
                                i
                              ] || Math.floor(Math.random() * 50) + 10,
                          ),
                        },
                      ],
                    });
                  }
                }}
                className="px-2 py-1 bg-sky-600 hover:bg-sky-500 text-white text-xs rounded-md transition-colors"
              >
                Labels
              </button>
              <button
                type="button"
                onClick={() => {
                  const newValues = prompt(
                    "Enter values (comma-separated):",
                    selectedItem.chartData?.datasets?.[0]?.data?.join(", ") ||
                      "12,19,15,25,22,30",
                  );
                  if (newValues) {
                    const values = newValues
                      .split(",")
                      .map((v) => parseFloat(v.trim()) || 0);
                    updateProp("chartData", {
                      ...selectedItem.chartData,
                      labels:
                        selectedItem.chartData?.labels ||
                        values.map((_, i) => `Item ${i + 1}`),
                      datasets: [
                        {
                          ...selectedItem.chartData?.datasets?.[0],
                          label:
                            selectedItem.chartData?.datasets?.[0]?.label ||
                            "Data",
                          data: values,
                        },
                      ],
                    });
                  }
                }}
                className="px-2 py-1 bg-purple-600 hover:bg-purple-500 text-white text-xs rounded-md transition-colors"
              >
                Values
              </button>
              <button
                type="button"
                onClick={() => {
                  // Generate random data
                  const labelCount =
                    selectedItem.chartData?.labels?.length || 6;
                  const randomData = Array.from(
                    { length: labelCount },
                    () => Math.floor(Math.random() * 50) + 10,
                  );
                  updateProp("chartData", {
                    ...selectedItem.chartData,
                    datasets: [
                      {
                        ...selectedItem.chartData?.datasets?.[0],
                        data: randomData,
                      },
                    ],
                  });
                }}
                className="px-2 py-1 bg-green-600 hover:bg-green-500 text-white text-xs rounded-md transition-colors"
              >
                Random
              </button>
            </div>
          </>
        )}

        {/* Mind Map Properties */}
        {selectedItem.type === "mindMapNode" && (
          <>
            {/* Node Type */}
            <div className="flex items-center gap-1.5">
              <label
                htmlFor={`mindMapNodeType-${selectedItem.id}`}
                className="text-slate-300 mr-1"
              >
                Type:
              </label>
              <select
                id={`mindMapNodeType-${selectedItem.id}`}
                value={selectedItem.mindMapNodeType || "branch"}
                onChange={(e) =>
                  updateProp("mindMapNodeType", e.target.value as any)
                }
                className="p-1.5 bg-slate-700 rounded-md border border-slate-600 text-slate-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="central">Central</option>
                <option value="main">Main</option>
                <option value="branch">Branch</option>
                <option value="leaf">Leaf</option>
                <option value="floating">Floating</option>
              </select>
            </div>

            {/* Shape */}
            <div className="flex items-center gap-1.5">
              <label
                htmlFor={`mindMapShape-${selectedItem.id}`}
                className="text-slate-300 mr-1"
              >
                Shape:
              </label>
              <select
                id={`mindMapShape-${selectedItem.id}`}
                value={selectedItem.mindMapShape || "ellipse"}
                onChange={(e) =>
                  updateProp("mindMapShape", e.target.value as any)
                }
                className="p-1.5 bg-slate-700 rounded-md border border-slate-600 text-slate-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="circle">⭕ Circle</option>
                <option value="ellipse">�� Ellipse</option>
                <option value="rectangle">�� Rectangle</option>
                <option value="hexagon">🔷 Hexagon</option>
                <option value="diamond">💎 Diamond</option>
                <option value="cloud">��️ Cloud</option>
                <option value="star">⭐ Star</option>
              </select>
            </div>

            {/* Theme */}
            <div className="flex items-center gap-1.5">
              <label
                htmlFor={`mindMapTheme-${selectedItem.id}`}
                className="text-slate-300 mr-1"
              >
                Theme:
              </label>
              <select
                id={`mindMapTheme-${selectedItem.id}`}
                value={selectedItem.mindMapTheme || "business"}
                onChange={(e) =>
                  updateProp("mindMapTheme", e.target.value as any)
                }
                className="p-1.5 bg-slate-700 rounded-md border border-slate-600 text-slate-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="business">💼 Business</option>
                <option value="creative">�� Creative</option>
                <option value="nature">🌱 Nature</option>
                <option value="tech">�� Tech</option>
                <option value="minimal">⚪ Minimal</option>
                <option value="colorful">🌈 Colorful</option>
              </select>
            </div>

            {/* Icon */}
            <div className="flex items-center gap-1.5">
              <label
                htmlFor={`mindMapIcon-${selectedItem.id}`}
                className="text-slate-300 mr-1"
              >
                Icon:
              </label>
              <input
                id={`mindMapIcon-${selectedItem.id}`}
                type="text"
                value={selectedItem.mindMapIcon || "💡"}
                onChange={(e) => updateProp("mindMapIcon", e.target.value)}
                className="w-16 p-1.5 bg-slate-700 rounded-md border border-slate-600 text-slate-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500 text-center"
                placeholder="💡"
              />
              <div className="flex gap-1">
                {[
                  "��",
                  "��",
                  "����",
                  "���",
                  "����������",
                  "��������",
                  "��",
                  "⚡",
                  "��",
                  "💫",
                ].map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => updateProp("mindMapIcon", icon)}
                    className="w-6 h-6 text-sm hover:bg-slate-600 rounded transition-colors"
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Level */}
            <div className="flex items-center gap-1.5">
              <label
                htmlFor={`mindMapLevel-${selectedItem.id}`}
                className="text-slate-300 mr-1"
              >
                Level:
              </label>
              <input
                id={`mindMapLevel-${selectedItem.id}`}
                type="number"
                min="0"
                max="10"
                value={selectedItem.mindMapLevel || 1}
                onChange={(e) =>
                  updateProp("mindMapLevel", parseInt(e.target.value))
                }
                className="w-16 p-1.5 bg-slate-700 rounded-md border border-slate-600 text-slate-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>

            {/* Priority */}
            <div className="flex items-center gap-1.5">
              <label
                htmlFor={`mindMapPriority-${selectedItem.id}`}
                className="text-slate-300 mr-1"
              >
                Priority:
              </label>
              <select
                id={`mindMapPriority-${selectedItem.id}`}
                value={selectedItem.mindMapPriority || "medium"}
                onChange={(e) =>
                  updateProp("mindMapPriority", e.target.value as any)
                }
                className="p-1.5 bg-slate-700 rounded-md border border-slate-600 text-slate-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="high">������� High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
            </div>

            {/* Animation */}
            <div className="flex items-center gap-1.5">
              <label
                htmlFor={`mindMapAnimation-${selectedItem.id}`}
                className="text-slate-300 mr-1"
              >
                Effect:
              </label>
              <select
                id={`mindMapAnimation-${selectedItem.id}`}
                value={selectedItem.mindMapAnimation || "none"}
                onChange={(e) =>
                  updateProp("mindMapAnimation", e.target.value as any)
                }
                className="p-1.5 bg-slate-700 rounded-md border border-slate-600 text-slate-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="none">None</option>
                <option value="pulse">Pulse</option>
                <option value="glow">Glow</option>
                <option value="float">Float</option>
                <option value="bounce">Bounce</option>
              </select>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-1.5">
              <label
                htmlFor={`mindMapProgress-${selectedItem.id}`}
                className="text-slate-300 mr-1"
              >
                Progress:
              </label>
              <input
                id={`mindMapProgress-${selectedItem.id}`}
                type="range"
                min="0"
                max="100"
                value={selectedItem.mindMapProgress || 0}
                onChange={(e) =>
                  updateProp("mindMapProgress", parseInt(e.target.value))
                }
                className="flex-1 max-w-20"
              />
              <span className="text-xs text-slate-400 w-8">
                {selectedItem.mindMapProgress || 0}%
              </span>
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-2">
              <label className="text-slate-300 mr-1">Options:</label>
              <label className="flex items-center text-xs">
                <input
                  type="checkbox"
                  checked={selectedItem.mindMapShadow ?? true}
                  onChange={(e) =>
                    updateProp("mindMapShadow", e.target.checked)
                  }
                  className="mr-1 text-sky-500 focus:ring-sky-500"
                />
                Shadow
              </label>
              <label className="flex items-center text-xs">
                <input
                  type="checkbox"
                  checked={selectedItem.mindMapGradient?.enabled ?? false}
                  onChange={(e) =>
                    updateProp("mindMapGradient", {
                      ...selectedItem.mindMapGradient,
                      enabled: e.target.checked,
                      from:
                        selectedItem.mindMapGradient?.from ||
                        selectedItem.backgroundColor ||
                        "#3B82F6",
                      to: selectedItem.mindMapGradient?.to || "#60A5FA",
                      direction:
                        selectedItem.mindMapGradient?.direction || "diagonal",
                    })
                  }
                  className="mr-1 text-sky-500 focus:ring-sky-500"
                />
                Gradient
              </label>
            </div>

            {/* Tags Editor */}
            <div className="flex items-center gap-1.5">
              <label className="text-slate-300 mr-1">Tags:</label>
              <button
                type="button"
                onClick={() => {
                  const newTags = prompt(
                    "Enter tags (comma-separated):",
                    selectedItem.mindMapTags?.join(", ") || "",
                  );
                  if (newTags !== null) {
                    const tags = newTags
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter((tag) => tag.length > 0);
                    updateProp("mindMapTags", tags);
                  }
                }}
                className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-md transition-colors"
              >
                Edit Tags
              </button>
              {selectedItem.mindMapTags &&
                selectedItem.mindMapTags.length > 0 && (
                  <span className="text-xs text-slate-400">
                    ({selectedItem.mindMapTags.length})
                  </span>
                )}
            </div>

            {/* Connection Style */}
            <div className="flex items-center gap-1.5">
              <label
                htmlFor={`mindMapConnectionStyle-${selectedItem.id}`}
                className="text-slate-300 mr-1"
              >
                Connections:
              </label>
              <select
                id={`mindMapConnectionStyle-${selectedItem.id}`}
                value={selectedItem.mindMapConnectionStyle || "curved"}
                onChange={(e) =>
                  updateProp("mindMapConnectionStyle", e.target.value as any)
                }
                className="p-1.5 bg-slate-700 rounded-md border border-slate-600 text-slate-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="straight">Straight</option>
                <option value="curved">Curved</option>
                <option value="organic">Organic</option>
                <option value="angular">Angular</option>
              </select>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-1.5">
              <label className="text-slate-300 mr-1">Actions:</label>
              <button
                type="button"
                onClick={() => {
                  // Auto-connect to nearby nodes
                  const nearbyNodes = canvasItems
                    .filter(
                      (item) =>
                        item.type === "mindMapNode" &&
                        item.id !== selectedItem.id &&
                        Math.abs(item.x - selectedItem.x) < 200 &&
                        Math.abs(item.y - selectedItem.y) < 200,
                    )
                    .map((item) => item.id);
                  updateProp("mindMapConnections", nearbyNodes.slice(0, 3));
                }}
                className="px-2 py-1 bg-green-600 hover:bg-green-500 text-white text-xs rounded-md transition-colors"
              >
                Auto-Connect
              </button>
              <button
                type="button"
                onClick={() => {
                  // Create child node
                  const childNode = {
                    type: "mindMapNode" as const,
                    x: selectedItem.x + 150,
                    y: selectedItem.y + 80,
                    width: 100,
                    height: 50,
                    content: "Child Idea",
                    mindMapNodeType: "leaf" as const,
                    mindMapLevel: (selectedItem.mindMapLevel || 1) + 1,
                    mindMapTheme: selectedItem.mindMapTheme,
                    mindMapShape: "ellipse" as const,
                  };
                  handleAddCanvasItem("mindMapNode");
                }}
                className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded-md transition-colors"
              >
                Add Child
              </button>
            </div>
          </>
        )}

        {/* Table Properties */}
        {selectedItem.type === "tableElement" && (
          <>
            {/* Table Style */}
            <div className="flex items-center gap-1.5">
              <label
                htmlFor={`tableStyle-${selectedItem.id}`}
                className="text-slate-300 mr-1"
              >
                Style:
              </label>
              <select
                id={`tableStyle-${selectedItem.id}`}
                value={selectedItem.tableStyle || "professional"}
                onChange={(e) =>
                  updateProp("tableStyle", e.target.value as any)
                }
                className="p-1.5 bg-slate-700 rounded-md border border-slate-600 text-slate-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="basic">Basic</option>
                <option value="professional">�� Professional</option>
                <option value="modern">🚀 Modern</option>
                <option value="minimal">��� Minimal</option>
                <option value="corporate">▣ Corporate</option>
                <option value="creative">������ Creative</option>
                <option value="financial">$ Financial</option>
                <option value="report">�� Report</option>
              </select>
            </div>

            {/* Table Theme */}
            <div className="flex items-center gap-1.5">
              <label
                htmlFor={`tableTheme-${selectedItem.id}`}
                className="text-slate-300 mr-1"
              >
                Theme:
              </label>
              <select
                id={`tableTheme-${selectedItem.id}`}
                value={selectedItem.tableTheme || "blue"}
                onChange={(e) =>
                  updateProp("tableTheme", e.target.value as any)
                }
                className="p-1.5 bg-slate-700 rounded-md border border-slate-600 text-slate-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="light">⚪ Light</option>
                <option value="dark">���� Dark</option>
                <option value="blue">�� Blue</option>
                <option value="green">������� Green</option>
                <option value="purple">������ Purple</option>
                <option value="orange">🟠 Orange</option>
                <option value="red">🔴 Red</option>
                <option value="gradient">🌈 Gradient</option>
              </select>
            </div>

            {/* Header Style */}
            <div className="flex items-center gap-1.5">
              <label
                htmlFor={`tableHeaderStyle-${selectedItem.id}`}
                className="text-slate-300 mr-1"
              >
                Header:
              </label>
              <select
                id={`tableHeaderStyle-${selectedItem.id}`}
                value={selectedItem.tableHeaderStyle || "gradient"}
                onChange={(e) =>
                  updateProp("tableHeaderStyle", e.target.value as any)
                }
                className="p-1.5 bg-slate-700 rounded-md border border-slate-600 text-slate-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="bold">Bold</option>
                <option value="background">Background</option>
                <option value="border">Border</option>
                <option value="shadow">Shadow</option>
                <option value="gradient">Gradient</option>
              </select>
            </div>

            {/* Border Style */}
            <div className="flex items-center gap-1.5">
              <label
                htmlFor={`tableBorderStyle-${selectedItem.id}`}
                className="text-slate-300 mr-1"
              >
                Borders:
              </label>
              <select
                id={`tableBorderStyle-${selectedItem.id}`}
                value={selectedItem.tableBorderStyle || "all"}
                onChange={(e) =>
                  updateProp("tableBorderStyle", e.target.value as any)
                }
                className="p-1.5 bg-slate-700 rounded-md border border-slate-600 text-slate-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="all">All Borders</option>
                <option value="outer">Outer Only</option>
                <option value="horizontal">Horizontal</option>
                <option value="vertical">Vertical</option>
                <option value="none">No Borders</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            {/* Font Size */}
            <div className="flex items-center gap-1.5">
              <label
                htmlFor={`tableFontSize-${selectedItem.id}`}
                className="text-slate-300 mr-1"
              >
                Size:
              </label>
              <select
                id={`tableFontSize-${selectedItem.id}`}
                value={selectedItem.tableFontSize || "medium"}
                onChange={(e) =>
                  updateProp("tableFontSize", e.target.value as any)
                }
                className="p-1.5 bg-slate-700 rounded-md border border-slate-600 text-slate-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="small">Small (10px)</option>
                <option value="medium">Medium (12px)</option>
                <option value="large">Large (14px)</option>
              </select>
            </div>

            {/* Table Features */}
            <div className="flex items-center gap-2">
              <label className="text-slate-300 mr-1">Features:</label>
              <label className="flex items-center text-xs">
                <input
                  type="checkbox"
                  checked={selectedItem.tableAlternateRows ?? true}
                  onChange={(e) =>
                    updateProp("tableAlternateRows", e.target.checked)
                  }
                  className="mr-1 text-sky-500 focus:ring-sky-500"
                />
                Stripes
              </label>
              <label className="flex items-center text-xs">
                <input
                  type="checkbox"
                  checked={selectedItem.tableHoverEffect ?? true}
                  onChange={(e) =>
                    updateProp("tableHoverEffect", e.target.checked)
                  }
                  className="mr-1 text-sky-500 focus:ring-sky-500"
                />
                Hover
              </label>
              <label className="flex items-center text-xs">
                <input
                  type="checkbox"
                  checked={selectedItem.tableSortable ?? false}
                  onChange={(e) =>
                    updateProp("tableSortable", e.target.checked)
                  }
                  className="mr-1 text-sky-500 focus:ring-sky-500"
                />
                Sort
              </label>
            </div>

            {/* Title & Subtitle */}
            <div className="flex items-center gap-1.5">
              <label
                htmlFor={`tableTitle-${selectedItem.id}`}
                className="text-slate-300 mr-1"
              >
                Title:
              </label>
              <input
                id={`tableTitle-${selectedItem.id}`}
                type="text"
                value={selectedItem.tableTitle || ""}
                onChange={(e) => updateProp("tableTitle", e.target.value)}
                className="w-24 p-1.5 bg-slate-700 rounded-md border border-slate-600 text-slate-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                placeholder="Table Title"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <label
                htmlFor={`tableSubtitle-${selectedItem.id}`}
                className="text-slate-300 mr-1"
              >
                Subtitle:
              </label>
              <input
                id={`tableSubtitle-${selectedItem.id}`}
                type="text"
                value={selectedItem.tableSubtitle || ""}
                onChange={(e) => updateProp("tableSubtitle", e.target.value)}
                className="w-24 p-1.5 bg-slate-700 rounded-md border border-slate-600 text-slate-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                placeholder="Subtitle"
              />
            </div>

            {/* Data Editing */}
            <div className="flex items-center gap-1.5">
              <label className="text-slate-300 mr-1">Data:</label>
              <button
                type="button"
                onClick={() => {
                  const headers = prompt(
                    "Enter column headers (comma-separated):",
                    selectedItem.tableData?.headers?.join(", ") ||
                      "Col1,Col2,Col3",
                  );
                  if (headers) {
                    const headerArray = headers.split(",").map((h) => h.trim());
                    updateProp("tableData", {
                      ...selectedItem.tableData,
                      headers: headerArray,
                      rows: selectedItem.tableData?.rows || [
                        headerArray.map((_, i) => `Data ${i + 1}`),
                      ],
                    });
                  }
                }}
                className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded-md transition-colors"
              >
                Headers
              </button>
              <button
                type="button"
                onClick={() => {
                  const currentRows = selectedItem.tableData?.rows || [];
                  const headers = selectedItem.tableData?.headers || [
                    "Col1",
                    "Col2",
                  ];
                  const newRow = headers.map((_, i) => `New ${i + 1}`);
                  updateProp("tableData", {
                    ...selectedItem.tableData,
                    headers,
                    rows: [...currentRows, newRow],
                  });
                }}
                className="px-2 py-1 bg-green-600 hover:bg-green-500 text-white text-xs rounded-md transition-colors"
              >
                Add Row
              </button>
              <button
                type="button"
                onClick={() => {
                  const currentRows = selectedItem.tableData?.rows || [];
                  if (currentRows.length > 1) {
                    updateProp("tableData", {
                      ...selectedItem.tableData,
                      rows: currentRows.slice(0, -1),
                    });
                  }
                }}
                className="px-2 py-1 bg-red-600 hover:bg-red-500 text-white text-xs rounded-md transition-colors"
              >
                Remove
              </button>
            </div>

            {/* Template Quick Actions */}
            <div className="flex items-center gap-1.5">
              <label className="text-slate-300 mr-1">Templates:</label>
              <button
                type="button"
                onClick={() => {
                  updateProp("tableData", {
                    headers: ["Product", "Q1", "Q2", "Q3", "Q4"],
                    rows: [
                      ["Product A", "$25K", "$28K", "$32K", "$35K"],
                      ["Product B", "$18K", "$22K", "$26K", "$29K"],
                      ["Product C", "$31K", "$29K", "$33K", "$38K"],
                    ],
                  });
                  updateProp("tableTitle", "Quarterly Sales Report");
                  updateProp("tableSubtitle", "2024 Performance");
                }}
                className="px-2 py-1 bg-purple-600 hover:bg-purple-500 text-white text-xs rounded-md transition-colors"
              >
                Sales
              </button>
              <button
                type="button"
                onClick={() => {
                  updateProp("tableData", {
                    headers: ["Task", "Assignee", "Status", "Due Date"],
                    rows: [
                      ["Design Review", "John", "In Progress", "Dec 15"],
                      ["Code Testing", "Sarah", "Pending", "Dec 18"],
                      ["Documentation", "Mike", "Complete", "Dec 10"],
                    ],
                  });
                  updateProp("tableTitle", "Project Tasks");
                  updateProp("tableSubtitle", "Current Sprint");
                }}
                className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-md transition-colors"
              >
                Tasks
              </button>
            </div>

            {/* Advanced Options */}
            <div className="flex items-center gap-1.5">
              <label className="text-slate-300 mr-1">Export:</label>
              <button
                type="button"
                onClick={() => {
                  // Create CSV export
                  const csvContent = [
                    selectedItem.tableData?.headers?.join(",") || "",
                    ...(selectedItem.tableData?.rows?.map((row) =>
                      row.join(","),
                    ) || []),
                  ].join("\n");

                  const blob = new Blob([csvContent], { type: "text/csv" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `${selectedItem.tableTitle || "table"}.csv`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs rounded-md transition-colors"
              >
                CSV
              </button>
              <button
                type="button"
                onClick={() => {
                  // Copy table as formatted text
                  const headers =
                    selectedItem.tableData?.headers?.join("\t") || "";
                  const rows =
                    selectedItem.tableData?.rows
                      ?.map((row) => row.join("\t"))
                      .join("\n") || "";
                  const tableText = headers + "\n" + rows;
                  navigator.clipboard.writeText(tableText);
                }}
                className="px-2 py-1 bg-cyan-600 hover:bg-cyan-500 text-white text-xs rounded-md transition-colors"
              >
                Copy
              </button>
            </div>

            {/* Auto-format Options */}
            <div className="flex items-center gap-1.5">
              <label className="text-slate-300 mr-1">Format:</label>
              <button
                type="button"
                onClick={() => {
                  // Auto-format as currency table
                  const formattedRows =
                    selectedItem.tableData?.rows?.map((row) =>
                      row.map((cell, index) => {
                        if (
                          index > 0 &&
                          /^\d+\.?\d*$/.test(cell.replace(/[$,]/g, ""))
                        ) {
                          const num = parseFloat(cell.replace(/[$,]/g, ""));
                          return `$${num.toLocaleString()}`;
                        }
                        return cell;
                      }),
                    ) || [];

                  updateProp("tableData", {
                    ...selectedItem.tableData,
                    rows: formattedRows,
                  });
                }}
                className="px-2 py-1 bg-yellow-600 hover:bg-yellow-500 text-white text-xs rounded-md transition-colors"
              >
                Currency
              </button>
              <button
                type="button"
                onClick={() => {
                  // Auto-format percentages
                  const formattedRows =
                    selectedItem.tableData?.rows?.map((row) =>
                      row.map((cell) => {
                        if (/^[\d.]+$/.test(cell) && parseFloat(cell) <= 1) {
                          return `${(parseFloat(cell) * 100).toFixed(1)}%`;
                        }
                        return cell;
                      }),
                    ) || [];

                  updateProp("tableData", {
                    ...selectedItem.tableData,
                    rows: formattedRows,
                  });
                }}
                className="px-2 py-1 bg-pink-600 hover:bg-pink-500 text-white text-xs rounded-md transition-colors"
              >
                Percent
              </button>
            </div>
          </>
        )}

        {/* Kanban Properties */}
        {selectedItem.type === "kanbanCard" && (
          <>
            {/* Card Type */}
            <div className="flex items-center gap-1.5">
              <label
                htmlFor={`kanbanCardType-${selectedItem.id}`}
                className="text-slate-300 mr-1"
              >
                Type:
              </label>
              <select
                id={`kanbanCardType-${selectedItem.id}`}
                value={selectedItem.kanbanCardType || "task"}
                onChange={(e) =>
                  updateProp("kanbanCardType", e.target.value as any)
                }
                className="p-1.5 bg-slate-700 rounded-md border border-slate-600 text-slate-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="task">�� Task</option>
                <option value="bug">��� Bug</option>
                <option value="feature">�� Feature</option>
                <option value="epic">◉ Epic</option>
                <option value="story">📖 Story</option>
                <option value="improvement">↗ Improvement</option>
                <option value="research">● Research</option>
              </select>
            </div>

            {/* Status */}
            <div className="flex items-center gap-1.5">
              <label
                htmlFor={`kanbanStatus-${selectedItem.id}`}
                className="text-slate-300 mr-1"
              >
                Status:
              </label>
              <select
                id={`kanbanStatus-${selectedItem.id}`}
                value={selectedItem.kanbanStatus || "todo"}
                onChange={(e) =>
                  updateProp("kanbanStatus", e.target.value as any)
                }
                className="p-1.5 bg-slate-700 rounded-md border border-slate-600 text-slate-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="todo">○ To Do</option>
                <option value="in-progress">◐ In Progress</option>
                <option value="review">������������ Review</option>
                <option value="testing">���� Testing</option>
                <option value="done">���� Done</option>
                <option value="blocked">✗ Blocked</option>
                <option value="archived">���� Archived</option>
              </select>
            </div>

            {/* Priority */}
            <div className="flex items-center gap-1.5">
              <label
                htmlFor={`kanbanPriority-${selectedItem.id}`}
                className="text-slate-300 mr-1"
              >
                Priority:
              </label>
              <select
                id={`kanbanPriority-${selectedItem.id}`}
                value={selectedItem.kanbanPriority || "medium"}
                onChange={(e) =>
                  updateProp("kanbanPriority", e.target.value as any)
                }
                className="p-1.5 bg-slate-700 rounded-md border border-slate-600 text-slate-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="low">⬇ Low</option>
                <option value="medium">➡ Medium</option>
                <option value="high">⬆�� High</option>
                <option value="urgent">!! Urgent</option>
                <option value="critical">!!! Critical</option>
              </select>
            </div>

            {/* Theme & Style */}
            <div className="flex items-center gap-1.5">
              <label
                htmlFor={`kanbanTheme-${selectedItem.id}`}
                className="text-slate-300 mr-1"
              >
                Theme:
              </label>
              <select
                id={`kanbanTheme-${selectedItem.id}`}
                value={selectedItem.kanbanTheme || "professional"}
                onChange={(e) =>
                  updateProp("kanbanTheme", e.target.value as any)
                }
                className="p-1.5 bg-slate-700 rounded-md border border-slate-600 text-slate-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="default">Default</option>
                <option value="modern">✨ Modern</option>
                <option value="minimal">⚪ Minimal</option>
                <option value="colorful">������ Colorful</option>
                <option value="dark">��������� Dark</option>
                <option value="professional">������� Professional</option>
              </select>
            </div>

            {/* Size & Appearance */}
            <div className="flex items-center gap-1.5">
              <label
                htmlFor={`kanbanSize-${selectedItem.id}`}
                className="text-slate-300 mr-1"
              >
                Size:
              </label>
              <select
                id={`kanbanSize-${selectedItem.id}`}
                value={selectedItem.kanbanSize || "medium"}
                onChange={(e) =>
                  updateProp("kanbanSize", e.target.value as any)
                }
                className="p-1.5 bg-slate-700 rounded-md border border-slate-600 text-slate-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="xl">Extra Large</option>
              </select>
            </div>

            {/* Assignee */}
            <div className="flex items-center gap-1.5">
              <label
                htmlFor={`kanbanAssignee-${selectedItem.id}`}
                className="text-slate-300 mr-1"
              >
                Assignee:
              </label>
              <input
                id={`kanbanAssignee-${selectedItem.id}`}
                type="text"
                value={selectedItem.kanbanAssignee || ""}
                onChange={(e) => updateProp("kanbanAssignee", e.target.value)}
                className="w-20 p-1.5 bg-slate-700 rounded-md border border-slate-600 text-slate-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                placeholder="John Doe"
              />
            </div>

            {/* Due Date */}
            <div className="flex items-center gap-1.5">
              <label
                htmlFor={`kanbanDueDate-${selectedItem.id}`}
                className="text-slate-300 mr-1"
              >
                Due:
              </label>
              <input
                id={`kanbanDueDate-${selectedItem.id}`}
                type="date"
                value={selectedItem.kanbanDueDate || ""}
                onChange={(e) => updateProp("kanbanDueDate", e.target.value)}
                className="w-24 p-1.5 bg-slate-700 rounded-md border border-slate-600 text-slate-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>

            {/* Story Points */}
            <div className="flex items-center gap-1.5">
              <label
                htmlFor={`kanbanStoryPoints-${selectedItem.id}`}
                className="text-slate-300 mr-1"
              >
                Points:
              </label>
              <input
                id={`kanbanStoryPoints-${selectedItem.id}`}
                type="number"
                min="1"
                max="100"
                value={selectedItem.kanbanStoryPoints || ""}
                onChange={(e) =>
                  updateProp(
                    "kanbanStoryPoints",
                    parseInt(e.target.value) || undefined,
                  )
                }
                className="w-16 p-1.5 bg-slate-700 rounded-md border border-slate-600 text-slate-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                placeholder="5"
              />
            </div>

            {/* Progress */}
            <div className="flex items-center gap-1.5">
              <label
                htmlFor={`kanbanProgress-${selectedItem.id}`}
                className="text-slate-300 mr-1"
              >
                Progress:
              </label>
              <input
                id={`kanbanProgress-${selectedItem.id}`}
                type="range"
                min="0"
                max="100"
                value={selectedItem.kanbanProgress || 0}
                onChange={(e) =>
                  updateProp("kanbanProgress", parseInt(e.target.value))
                }
                className="flex-1 max-w-20"
              />
              <span className="text-xs text-slate-400 w-8">
                {selectedItem.kanbanProgress || 0}%
              </span>
            </div>

            {/* Visual Options */}
            <div className="flex items-center gap-2">
              <label className="text-slate-300 mr-1">Style:</label>
              <select
                value={selectedItem.kanbanCornerStyle || "rounded"}
                onChange={(e) =>
                  updateProp("kanbanCornerStyle", e.target.value as any)
                }
                className="p-1.5 bg-slate-700 rounded-md border border-slate-600 text-slate-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500 text-xs"
              >
                <option value="rounded">Rounded</option>
                <option value="sharp">Sharp</option>
                <option value="pill">Pill</option>
              </select>
              <select
                value={selectedItem.kanbanShadow || "medium"}
                onChange={(e) =>
                  updateProp("kanbanShadow", e.target.value as any)
                }
                className="p-1.5 bg-slate-700 rounded-md border border-slate-600 text-slate-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500 text-xs"
              >
                <option value="none">No Shadow</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>

            {/* Labels Editor */}
            <div className="flex items-center gap-1.5">
              <label className="text-slate-300 mr-1">Labels:</label>
              <button
                type="button"
                onClick={() => {
                  const newLabels = prompt(
                    "Enter labels (comma-separated):",
                    selectedItem.kanbanLabels?.join(", ") || "",
                  );
                  if (newLabels !== null) {
                    const labels = newLabels
                      .split(",")
                      .map((label) => label.trim())
                      .filter((label) => label.length > 0);
                    updateProp("kanbanLabels", labels);
                  }
                }}
                className="px-2 py-1 bg-violet-600 hover:bg-violet-500 text-white text-xs rounded-md transition-colors"
              >
                Edit Labels
              </button>
              {selectedItem.kanbanLabels &&
                selectedItem.kanbanLabels.length > 0 && (
                  <span className="text-xs text-slate-400">
                    ({selectedItem.kanbanLabels.length})
                  </span>
                )}
            </div>

            {/* Description */}
            <div className="flex items-center gap-1.5">
              <label className="text-slate-300 mr-1">Description:</label>
              <button
                type="button"
                onClick={() => {
                  const newDescription = prompt(
                    "Enter description:",
                    selectedItem.kanbanDescription || "",
                  );
                  if (newDescription !== null) {
                    updateProp("kanbanDescription", newDescription);
                  }
                }}
                className="px-2 py-1 bg-slate-600 hover:bg-slate-500 text-white text-xs rounded-md transition-colors"
              >
                Edit
              </button>
            </div>

            {/* Sprint & Epic */}
            <div className="flex items-center gap-1.5">
              <label className="text-slate-300 mr-1">Sprint:</label>
              <input
                type="text"
                value={selectedItem.kanbanSprint || ""}
                onChange={(e) => updateProp("kanbanSprint", e.target.value)}
                className="w-16 p-1.5 bg-slate-700 rounded-md border border-slate-600 text-slate-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500 text-xs"
                placeholder="Sprint 12"
              />
              <label className="text-slate-300 mr-1">Epic:</label>
              <input
                type="text"
                value={selectedItem.kanbanEpic || ""}
                onChange={(e) => updateProp("kanbanEpic", e.target.value)}
                className="w-16 p-1.5 bg-slate-700 rounded-md border border-slate-600 text-slate-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500 text-xs"
                placeholder="UX"
              />
            </div>
          </>
        )}

        {/* Code Block Properties */}
        {selectedItem.type === "codeBlock" && (
          <>
            {/* Language Selector */}
            <div className="flex items-center gap-1.5">
              <label
                htmlFor={`codeLanguage-${selectedItem.id}`}
                className="text-slate-300 mr-1"
              >
                Language:
              </label>
              <select
                id={`codeLanguage-${selectedItem.id}`}
                value={selectedItem.codeLanguage || "javascript"}
                onChange={(e) => updateProp("codeLanguage", e.target.value)}
                className="p-1.5 bg-slate-700 rounded-md border border-slate-600 text-slate-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="javascript">🟨 JavaScript</option>
                <option value="typescript">🔷 TypeScript</option>
                <option value="python">������������� Python</option>
                <option value="java">☕ Java</option>
                <option value="cpp">����� C++</option>
                <option value="csharp">����� C#</option>
                <option value="php">������ PHP</option>
                <option value="ruby">������������ Ruby</option>
                <option value="go">�� Go</option>
                <option value="rust">������ Rust</option>
                <option value="swift">�� Swift</option>
                <option value="kotlin">�������������� Kotlin</option>
                <option value="html">🌐 HTML</option>
                <option value="css">�������� CSS</option>
                <option value="sql">�������️ SQL</option>
                <option value="bash">������� Bash</option>
                <option value="json">����� JSON</option>
                <option value="xml">����� XML</option>
                <option value="yaml">📝 YAML</option>
                <option value="markdown">📖 Markdown</option>
              </select>
            </div>

            {/* Theme */}
            <div className="flex items-center gap-1.5">
              <label
                htmlFor={`codeTheme-${selectedItem.id}`}
                className="text-slate-300 mr-1"
              >
                Theme:
              </label>
              <select
                id={`codeTheme-${selectedItem.id}`}
                value={selectedItem.codeTheme || "dark"}
                onChange={(e) => updateProp("codeTheme", e.target.value)}
                className="p-1.5 bg-slate-700 rounded-md border border-slate-600 text-slate-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="dark">��������������� Dark</option>
                <option value="light">☀���� Light</option>
                <option value="github">���������� GitHub</option>
                <option value="vscode">���� VS Code</option>
                <option value="sublime">🔥 Sublime</option>
                <option value="atom">���️ Atom</option>
                <option value="monokai">🖤 Monokai</option>
                <option value="solarized">🌞 Solarized</option>
              </select>
            </div>

            {/* Font Size */}
            <div className="flex items-center gap-1.5">
              <label
                htmlFor={`codeFontSize-${selectedItem.id}`}
                className="text-slate-300 mr-1"
              >
                Font Size:
              </label>
              <select
                id={`codeFontSize-${selectedItem.id}`}
                value={selectedItem.fontSize || "12px"}
                onChange={(e) => updateProp("fontSize", e.target.value)}
                className="p-1.5 bg-slate-700 rounded-md border border-slate-600 text-slate-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="10px">10px</option>
                <option value="11px">11px</option>
                <option value="12px">12px</option>
                <option value="14px">14px</option>
                <option value="16px">16px</option>
                <option value="18px">18px</option>
                <option value="20px">20px</option>
              </select>
            </div>

            {/* Show Line Numbers */}
            <div className="flex items-center gap-1.5">
              <label className="text-slate-300 mr-1">
                <input
                  type="checkbox"
                  checked={selectedItem.codeShowLineNumbers || false}
                  onChange={(e) =>
                    updateProp("codeShowLineNumbers", e.target.checked)
                  }
                  className="mr-1.5 text-sky-500 focus:ring-sky-500"
                />
                Line Numbers
              </label>
            </div>

            {/* Copy Button */}
            <div className="flex items-center gap-1.5">
              <label className="text-slate-300 mr-1">
                <input
                  type="checkbox"
                  checked={selectedItem.codeShowCopyButton || false}
                  onChange={(e) =>
                    updateProp("codeShowCopyButton", e.target.checked)
                  }
                  className="mr-1.5 text-sky-500 focus:ring-sky-500"
                />
                Copy Button
              </label>
            </div>

            {/* Word Wrap */}
            <div className="flex items-center gap-1.5">
              <label className="text-slate-300 mr-1">
                <input
                  type="checkbox"
                  checked={selectedItem.codeWordWrap || false}
                  onChange={(e) => updateProp("codeWordWrap", e.target.checked)}
                  className="mr-1.5 text-sky-500 focus:ring-sky-500"
                />
                Word Wrap
              </label>
            </div>
          </>
        )}

        {/* Connector Properties */}
        {selectedItem.type === "connectorElement" && (
          <>
            {/* Connector Type */}
            <div className="flex items-center gap-1.5">
              <label
                htmlFor={`connectorType-${selectedItem.id}`}
                className="text-slate-300 mr-1"
              >
                Type:
              </label>
              <select
                id={`connectorType-${selectedItem.id}`}
                value={selectedItem.connectorType || "straight"}
                onChange={(e) => updateProp("connectorType", e.target.value)}
                className="p-1.5 bg-slate-700 rounded-md border border-slate-600 text-slate-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="straight">������ Straight</option>
                <option value="curved">〜 Curved</option>
                <option value="elbow">����������� Elbow</option>
                <option value="dashed">┄ Dashed</option>
                <option value="dotted">⋯ Dotted</option>
                <option value="double">�� Double</option>
              </select>
            </div>

            {/* Line Style */}
            <div className="flex items-center gap-1.5">
              <label
                htmlFor={`connectorStyle-${selectedItem.id}`}
                className="text-slate-300 mr-1"
              >
                Style:
              </label>
              <select
                id={`connectorStyle-${selectedItem.id}`}
                value={selectedItem.connectorStyle || "solid"}
                onChange={(e) => updateProp("connectorStyle", e.target.value)}
                className="p-1.5 bg-slate-700 rounded-md border border-slate-600 text-slate-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="solid">��� Solid</option>
                <option value="dashed">▭ Dashed</option>
                <option value="dotted">���������� Dotted</option>
                <option value="double">═ Double</option>
              </select>
            </div>

            {/* Thickness */}
            <div className="flex items-center gap-1.5">
              <label
                htmlFor={`connectorThickness-${selectedItem.id}`}
                className="text-slate-300 mr-1"
              >
                Thickness:
              </label>
              <select
                id={`connectorThickness-${selectedItem.id}`}
                value={selectedItem.connectorThickness || "2"}
                onChange={(e) =>
                  updateProp("connectorThickness", parseInt(e.target.value))
                }
                className="p-1.5 bg-slate-700 rounded-md border border-slate-600 text-slate-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="1">1px - Thin</option>
                <option value="2">2px - Normal</option>
                <option value="3">3px - Medium</option>
                <option value="4">4px - Thick</option>
                <option value="6">6px - Bold</option>
                <option value="8">8px - Extra Bold</option>
              </select>
            </div>

            {/* Arrow Start */}
            <div className="flex items-center gap-1.5">
              <label className="text-slate-300 mr-1">
                <input
                  type="checkbox"
                  checked={selectedItem.connectorArrowStart || false}
                  onChange={(e) =>
                    updateProp("connectorArrowStart", e.target.checked)
                  }
                  className="mr-1.5 text-sky-500 focus:ring-sky-500"
                />
                ← Start Arrow
              </label>
            </div>

            {/* Arrow End */}
            <div className="flex items-center gap-1.5">
              <label className="text-slate-300 mr-1">
                <input
                  type="checkbox"
                  checked={selectedItem.connectorArrowEnd || true}
                  onChange={(e) =>
                    updateProp("connectorArrowEnd", e.target.checked)
                  }
                  className="mr-1.5 text-sky-500 focus:ring-sky-500"
                />
                ������ End Arrow
              </label>
            </div>

            {/* Connection Points */}
            <div className="flex items-center gap-1.5">
              <label className="text-slate-300 mr-1">
                <input
                  type="checkbox"
                  checked={selectedItem.connectorShowPoints || false}
                  onChange={(e) =>
                    updateProp("connectorShowPoints", e.target.checked)
                  }
                  className="mr-1.5 text-sky-500 focus:ring-sky-500"
                />
                Show Connection Points
              </label>
            </div>

            {/* Animation */}
            <div className="flex items-center gap-1.5">
              <label
                htmlFor={`connectorAnimation-${selectedItem.id}`}
                className="text-slate-300 mr-1"
              >
                Animation:
              </label>
              <select
                id={`connectorAnimation-${selectedItem.id}`}
                value={selectedItem.connectorAnimation || "none"}
                onChange={(e) =>
                  updateProp("connectorAnimation", e.target.value)
                }
                className="p-1.5 bg-slate-700 rounded-md border border-slate-600 text-slate-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="none">None</option>
                <option value="flow">→ Flow</option>
                <option value="pulse">��� Pulse</option>
                <option value="dash">┄ Dash</option>
                <option value="glow">������ Glow</option>
              </select>
            </div>
          </>
        )}
      </div>
    );
  };

  const getShapeIcon = (variant?: ShapeVariant) => {
    const iconProps = {
      className: "w-4 h-4 mr-1.5 text-slate-200 group-hover:text-white",
    };

    // First try to find the shape in our shapes array to get the emoji
    const shapeData = CANVAS_SHAPE_VARIANTS.find(
      (shape) => shape.value === variant,
    );
    if (shapeData) {
      return <span className="mr-1.5 text-sm">{shapeData.icon}</span>;
    }

    // Fallback to original icon components
    switch (variant) {
      case "rectangle":
        return <RectangleIcon {...iconProps} />;
      case "circle":
        return <CircleIcon {...iconProps} />;
      case "triangle":
        return <TriangleShapeIcon {...iconProps} />;
      case "rightArrow":
        return <RightArrowShapeIcon {...iconProps} />;
      case "star":
        return <StarShapeIcon {...iconProps} />;
      case "speechBubble":
        return <SpeechBubbleShapeIcon {...iconProps} />;
      default:
        return <ShapesIcon {...iconProps} />;
    }
  };

  const renderShapeVariant = (
    variant: ShapeVariant,
    width: number,
    height: number,
    backgroundColor: string,
    borderColor: string,
    borderWidth: string,
  ) => {
    const strokeWidth = parseInt(borderWidth) || 1;

    switch (variant) {
      case "circle":
        return (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            <circle
              cx={width / 2}
              cy={height / 2}
              r={Math.min(width, height) / 2 - strokeWidth}
              fill={backgroundColor}
              stroke={borderColor}
              strokeWidth={strokeWidth}
            />
          </svg>
        );

      case "triangle":
        return (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            <polygon
              points={`${width / 2},${strokeWidth} ${width - strokeWidth},${height - strokeWidth} ${strokeWidth},${height - strokeWidth}`}
              fill={backgroundColor}
              stroke={borderColor}
              strokeWidth={strokeWidth}
            />
          </svg>
        );

      case "star":
        const centerX = width / 2;
        const centerY = height / 2;
        const outerRadius = Math.min(width, height) / 2 - strokeWidth;
        const innerRadius = outerRadius * 0.4;
        let starPoints = "";
        for (let i = 0; i < 10; i++) {
          const angle = (i * Math.PI) / 5;
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const x = centerX + Math.cos(angle - Math.PI / 2) * radius;
          const y = centerY + Math.sin(angle - Math.PI / 2) * radius;
          starPoints += `${x},${y} `;
        }
        return (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            <polygon
              points={starPoints}
              fill={backgroundColor}
              stroke={borderColor}
              strokeWidth={strokeWidth}
            />
          </svg>
        );

      case "diamond":
        return (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            <polygon
              points={`${width / 2},${strokeWidth} ${width - strokeWidth},${height / 2} ${width / 2},${height - strokeWidth} ${strokeWidth},${height / 2}`}
              fill={backgroundColor}
              stroke={borderColor}
              strokeWidth={strokeWidth}
            />
          </svg>
        );

      case "heart":
        return (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            <path
              d={`M${width / 2},${height * 0.8} C${width * 0.1},${height * 0.4} ${width * 0.1},${height * 0.1} ${width / 2},${height * 0.3} C${width * 0.9},${height * 0.1} ${width * 0.9},${height * 0.4} ${width / 2},${height * 0.8}z`}
              fill={backgroundColor}
              stroke={borderColor}
              strokeWidth={strokeWidth}
            />
          </svg>
        );

      case "rightArrow":
        return (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            <polygon
              points={`${strokeWidth},${height * 0.3} ${width * 0.7},${height * 0.3} ${width * 0.7},${strokeWidth} ${width - strokeWidth},${height / 2} ${width * 0.7},${height - strokeWidth} ${width * 0.7},${height * 0.7} ${strokeWidth},${height * 0.7}`}
              fill={backgroundColor}
              stroke={borderColor}
              strokeWidth={strokeWidth}
            />
          </svg>
        );

      case "hexagon":
        const hexCenterX = width / 2;
        const hexCenterY = height / 2;
        const hexPoints = [];
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          const x =
            hexCenterX +
            Math.cos(angle) * (Math.min(width, height) / 2 - strokeWidth);
          const y =
            hexCenterY +
            Math.sin(angle) * (Math.min(width, height) / 2 - strokeWidth);
          hexPoints.push(`${x},${y}`);
        }
        return (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            <polygon
              points={hexPoints.join(" ")}
              fill={backgroundColor}
              stroke={borderColor}
              strokeWidth={strokeWidth}
            />
          </svg>
        );

      case "ellipse":
        return (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            <ellipse
              cx={width / 2}
              cy={height / 2}
              rx={width / 2 - strokeWidth}
              ry={height / 2 - strokeWidth}
              fill={backgroundColor}
              stroke={borderColor}
              strokeWidth={strokeWidth}
            />
          </svg>
        );

      case "leftArrow":
        return (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            <polygon
              points={`${width - strokeWidth},${height * 0.3} ${width * 0.3},${height * 0.3} ${width * 0.3},${strokeWidth} ${strokeWidth},${height / 2} ${width * 0.3},${height - strokeWidth} ${width * 0.3},${height * 0.7} ${width - strokeWidth},${height * 0.7}`}
              fill={backgroundColor}
              stroke={borderColor}
              strokeWidth={strokeWidth}
            />
          </svg>
        );

      case "upArrow":
        return (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            <polygon
              points={`${width * 0.3},${height - strokeWidth} ${width * 0.3},${height * 0.3} ${strokeWidth},${height * 0.3} ${width / 2},${strokeWidth} ${width - strokeWidth},${height * 0.3} ${width * 0.7},${height * 0.3} ${width * 0.7},${height - strokeWidth}`}
              fill={backgroundColor}
              stroke={borderColor}
              strokeWidth={strokeWidth}
            />
          </svg>
        );

      case "downArrow":
        return (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            <polygon
              points={`${width * 0.3},${strokeWidth} ${width * 0.3},${height * 0.7} ${strokeWidth},${height * 0.7} ${width / 2},${height - strokeWidth} ${width - strokeWidth},${height * 0.7} ${width * 0.7},${height * 0.7} ${width * 0.7},${strokeWidth}`}
              fill={backgroundColor}
              stroke={borderColor}
              strokeWidth={strokeWidth}
            />
          </svg>
        );

      case "pentagon":
        const pentCenterX = width / 2;
        const pentCenterY = height / 2;
        const pentPoints = [];
        for (let i = 0; i < 5; i++) {
          const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
          const x =
            pentCenterX +
            Math.cos(angle) * (Math.min(width, height) / 2 - strokeWidth);
          const y =
            pentCenterY +
            Math.sin(angle) * (Math.min(width, height) / 2 - strokeWidth);
          pentPoints.push(`${x},${y}`);
        }
        return (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            <polygon
              points={pentPoints.join(" ")}
              fill={backgroundColor}
              stroke={borderColor}
              strokeWidth={strokeWidth}
            />
          </svg>
        );

      case "octagon":
        const octCenterX = width / 2;
        const octCenterY = height / 2;
        const octPoints = [];
        for (let i = 0; i < 8; i++) {
          const angle = (i * 2 * Math.PI) / 8;
          const x =
            octCenterX +
            Math.cos(angle) * (Math.min(width, height) / 2 - strokeWidth);
          const y =
            octCenterY +
            Math.sin(angle) * (Math.min(width, height) / 2 - strokeWidth);
          octPoints.push(`${x},${y}`);
        }
        return (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            <polygon
              points={octPoints.join(" ")}
              fill={backgroundColor}
              stroke={borderColor}
              strokeWidth={strokeWidth}
            />
          </svg>
        );

      case "roundedRectangle":
        const cornerRadius = Math.min(width, height) * 0.1;
        return (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            <rect
              x={strokeWidth}
              y={strokeWidth}
              width={width - 2 * strokeWidth}
              height={height - 2 * strokeWidth}
              rx={cornerRadius}
              ry={cornerRadius}
              fill={backgroundColor}
              stroke={borderColor}
              strokeWidth={strokeWidth}
            />
          </svg>
        );

      default:
        // Default to rectangle for unknown shapes or rectangle itself
        return null; // Will use the div styling
    }
  };

  const getContentTypeIcon = (
    contentTypeValue: ContentType,
  ): React.ReactNode => {
    const iconProps = {
      className:
        "w-5 h-5 mr-2 inline-block align-middle text-sky-400 group-hover:text-sky-300",
    };
    switch (contentTypeValue) {
      case ContentType.Idea:
        return <LightBulbIcon {...iconProps} />;
      case ContentType.Script:
        return <FilmIcon {...iconProps} />;
      case ContentType.Title:
        return <TagIcon {...iconProps} />;
      case ContentType.ImagePrompt:
        return <EditIcon {...iconProps} />;
      case ContentType.Image:
        return <PhotoIcon {...iconProps} />;
      case ContentType.VideoHook:
        return <GeneratorIcon {...iconProps} />;
      case ContentType.ThumbnailConcept:
        return <PhotoIcon {...iconProps} />;
      case ContentType.TrendingTopics:
        return <SearchIcon {...iconProps} />;
      case ContentType.TrendAnalysis:
        return <TrendingUpIcon {...iconProps} />;
      case ContentType.ContentBrief:
        return <ClipboardDocumentListIcon {...iconProps} />;
      case ContentType.PollsQuizzes:
        return <QuestionMarkCircleIcon {...iconProps} />;
      case ContentType.ContentGapFinder:
        return <SearchCircleIcon {...iconProps} />;
      case ContentType.MicroScript:
        return <PlayCircleIcon {...iconProps} />;
      case ContentType.VoiceToScript:
        return <MicrophoneIcon {...iconProps} />;
      case ContentType.ChannelAnalysis:
        return <UsersIcon {...iconProps} />;
      case ContentType.ABTest:
        return <ColumnsIcon {...iconProps} />;
      case ContentType.ContentStrategyPlan:
        return <CompassIcon {...iconProps} />;
      case ContentType.InteractivePollsQuizzes:
        return <QuestionMarkCircleIcon {...iconProps} />;
      case ContentType.VideoScriptWithShotList:
        return <VideoCameraIcon {...iconProps} />;
      case ContentType.PodcastEpisodeOutline:
        return <MicrophoneIcon {...iconProps} />;
      case ContentType.EmailMarketingSequence:
        return <EnvelopeIcon {...iconProps} />;
      case ContentType.SalesFunnelContent:
        return <ArrowUpRightIcon {...iconProps} />;
      case ContentType.CourseEducationalContent:
        return <AcademicCapIcon {...iconProps} />;
      case ContentType.LiveStreamScript:
        return <RadioIcon {...iconProps} />;
      case ContentType.ProductLaunchCampaign:
        return <RocketLaunchIcon {...iconProps} />;
      default:
        return <GeneratorIcon {...iconProps} />;
    }
  };

  const formatTimestamp = (timestamp: number): string =>
    new Date(timestamp).toLocaleString(undefined, {
      dateStyle: "short",
      timeStyle: "short",
    });

  useEffect(() => {
    if (outputContainerRef.current) {
      outputContainerRef.current.scrollTop =
        outputContainerRef.current.scrollHeight;
    }
  }, [generatedOutput, isLoading]);

  const commonTextareaClassCanvas =
    "w-full h-full focus:outline-none whitespace-pre-wrap break-words resize-none bg-transparent";

  const renderCanvasItem = (canvasItem: CanvasItem) => {
    const isSelected = selectedCanvasItemId === canvasItem.id;
    const isMindMapNode = canvasItem.type === "mindMapNode";
    const isAnimating = isMindMapAnimating && isMindMapNode;

    const baseStyle: React.CSSProperties = {
      position: "absolute",
      left: `${canvasItem.x}px`,
      top: `${canvasItem.y}px`,
      width: `${canvasItem.width || 200}px`,
      height: `${canvasItem.height || 100}px`,
      zIndex: canvasItem.zIndex,
      cursor:
        draggingItem?.id === canvasItem.id || resizingItem?.id === canvasItem.id
          ? "grabbing"
          : "grab",
      boxShadow: isSelected
        ? "0 0 0 2.5px #38BDF8, 0 6px 12px rgba(0,0,0,0.3)"
        : "0 2px 5px rgba(0,0,0,0.35)",
      transition: isAnimating
        ? "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)"
        : "box-shadow 0.15s ease-in-out, border-color 0.15s, background-color 0.15s, color 0.15s, font-size 0.15s",
      display: "flex",
      flexDirection: "column",
      userSelect: "none",
      borderRadius:
        canvasItem.type === "shapeElement" &&
        canvasItem.shapeVariant === "circle"
          ? "50%"
          : "0.5rem",
      overflow: "hidden",
      // Enhanced animation properties for mind map nodes
      opacity: isAnimating ? 1 : 1,
      transform: isAnimating ? "scale(1) translateY(0px)" : "scale(1) translateY(0px)",
      animation: isAnimating
        ? `fadeInGrow 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${Math.random() * 0.5}s forwards`
        : undefined,
    };
    const resizableTypes: CanvasItemType[] = [
      "historyItem",
      "stickyNote",
      "textElement",
      "shapeElement",
      "frameElement",
      "commentElement",
      "imageElement",
      "mindMapNode",
      "flowchartBox",
      "kanbanCard",
      "tableElement",
      "codeBlock",
      "chart",
      "codeBlock",
      "embedElement",
    ];
    const isResizable = resizableTypes.includes(canvasItem.type);

    if (canvasItem.type === "historyItem" && canvasItem.historyItemId) {
      const historyItem = history.find(
        (h) => h.id === canvasItem.historyItemId,
      );
      if (!historyItem) return null;
      const output = historyItem.output;
      let displayContent: React.ReactNode = (
        <p className="text-xs text-slate-300">Unknown content type</p>
      );
      if (isGeneratedTextOutput(output)) {
        displayContent = (
          <div className="text-xs text-slate-300 styled-text-output space-y-1">
            {parseAndStyleText(output.content)}
          </div>
        );
      } else if (isGeneratedImageOutput(output)) {
        displayContent = (
          <div className="w-full h-full flex items-center justify-center p-1">
            <img
              src={`data:${output.mimeType};base64,${output.base64Data}`}
              alt="preview"
              className="w-full h-auto max-h-full object-contain rounded-sm border border-slate-500/50"
            />
          </div>
        );
      }
      return (
        <div
          key={canvasItem.id}
          className="bg-slate-700/90 border border-slate-600 hover:border-sky-500/70 relative flex flex-col"
          style={baseStyle}
          onMouseDown={(e) => handleCanvasItemMouseDown(e, canvasItem.id)}
          role="group"
          aria-label={`Canvas item: ${CONTENT_TYPES.find((ct) => ct.value === historyItem.contentType)?.label}`}
          tabIndex={0}
        >
          {" "}
          <div className="flex justify-between items-start mb-1.5 shrink-0 p-2 border-b border-slate-600/50">
            {" "}
            <h5 className="text-xs font-semibold text-sky-400 truncate pr-2">
              {CONTENT_TYPES.find((ct) => ct.value === historyItem.contentType)
                ?.label || historyItem.contentType}
            </h5>{" "}
            <div className="flex items-center">
              {" "}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  bringToFront(canvasItem.id);
                }}
                className="text-slate-500 hover:text-sky-400 p-0.5 rounded-full hover:bg-slate-600/50 transition-colors mr-1"
                title="Bring to front"
                aria-label="Bring to front"
              >
                <ArrowUpTrayIcon className="w-3 h-3 transform rotate-45" />
              </button>{" "}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFromCanvas(canvasItem.id);
                }}
                className="text-slate-500 hover:text-red-400 p-0.5 rounded-full hover:bg-slate-600/50 transition-colors"
                title="Remove from canvas"
                data-resize-handle="false"
                aria-label="Remove item from canvas"
              >
                {" "}
                <XCircleIcon className="w-4 h-4" />{" "}
              </button>{" "}
            </div>{" "}
          </div>{" "}
          <div className="flex-grow min-h-0 mb-1.5 p-2">{displayContent}</div>{" "}
          <div className="shrink-0 p-2 pt-1 border-t border-slate-600/50">
            {" "}
            <p
              className="text-xxs text-slate-500 truncate mt-auto"
              title={historyItem.userInput}
            >
              Input: {historyItem.userInput}
            </p>{" "}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleViewHistoryItem(historyItem);
              }}
              className="mt-1 text-xxs px-2 py-0.5 bg-sky-700 hover:bg-sky-600 text-white rounded-md shadow-sm transition-colors"
              data-resize-handle="false"
            >
              View Full
            </button>{" "}
          </div>{" "}
          {isResizable && isSelected && (
            <div
              data-resize-handle="true"
              className="absolute bottom-0 right-0 w-4 h-4 bg-sky-500 border-2 border-slate-800 rounded-full cursor-se-resize transform translate-x-1/2 translate-y-1/2 shadow-lg z-40"
              onMouseDown={(e) => handleResizeStart(e, canvasItem.id, "br")}
              aria-hidden="true"
            />
          )}{" "}
        </div>
      );
    }

    const itemSpecificControls = isSelected &&
      canvasItem.type !== "historyItem" && (
        <div
          className="absolute top-1 right-1 flex gap-1 z-50"
          data-canvas-dropdown
        >
          {/* Settings Menu Button */}
          <div className="relative">
            <button
              ref={(el) => {
                if (el) dropdownButtonRefs.current.set(canvasItem.id, el);
                else dropdownButtonRefs.current.delete(canvasItem.id);
              }}
              onClick={(e) => {
                e.stopPropagation();
                const isOpening = canvasItemDropdown !== canvasItem.id;

                if (isOpening) {
                  // Calculate accurate position based on button location
                  const buttonRect = e.currentTarget.getBoundingClientRect();
                  const dropdownWidth = 256; // Fixed dropdown width
                  const dropdownHeight = 384; // Max dropdown height
                  const viewport = {
                    width: window.innerWidth,
                    height: window.innerHeight,
                  };

                  let x = buttonRect.right - dropdownWidth; // Align right edge
                  let y = buttonRect.bottom + 4; // Below button with 4px gap

                  // Prevent dropdown from going off screen
                  if (x < 10) x = 10; // Min 10px from left edge
                  if (x + dropdownWidth > viewport.width - 10)
                    x = viewport.width - dropdownWidth - 10;
                  if (y + dropdownHeight > viewport.height - 10)
                    y = buttonRect.top - dropdownHeight - 4; // Above if no space below

                  setDropdownPosition({ x, y });
                  setCanvasItemDropdown(canvasItem.id);
                } else {
                  setCanvasItemDropdown(null);
                  setDropdownPosition(null);
                }
              }}
              className="p-1 bg-white/95 backdrop-blur-sm border border-gray-200/80 text-gray-600 rounded-md shadow-sm hover:bg-white hover:text-gray-800 transition-all duration-150"
              title="Item Settings"
              aria-label="Open item settings menu"
            >
              <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
                <circle cx="8" cy="2" r="1" />
                <circle cx="8" cy="8" r="1" />
                <circle cx="8" cy="14" r="1" />
              </svg>
            </button>

            {/* Comprehensive Canvas Context Menu - Portal to body */}
            {canvasItemDropdown === canvasItem.id && (
              <>
                {/* Backdrop to close menu */}
                <div
                  className="fixed inset-0 z-[999998]"
                  onClick={() => setCanvasItemDropdown(null)}
                />
                <div
                  className="canvas-dropdown-menu fixed w-64 bg-white border border-gray-300 rounded-lg shadow-2xl py-1 max-h-96 overflow-y-auto transform transition-all duration-200 ease-out opacity-100 scale-100"
                  style={{
                    zIndex: 999999,
                    position: "fixed",
                    top: `${dropdownPosition?.y || 0}px`,
                    left: `${dropdownPosition?.x || 0}px`,
                    transformOrigin: "top right",
                    willChange: "transform, opacity",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                >
                  {/* Add to Saved files */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add to saved files functionality
                      setCanvasItemDropdown(null);
                    }}
                    className="w-full px-3 py-1.5 text-left text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                  >
                    Add to Saved files
                  </button>

                  {/* Download */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Download functionality
                      setCanvasItemDropdown(null);
                    }}
                    className="w-full px-3 py-1.5 text-left text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                  >
                    Download
                  </button>

                  {/* Scale to original size */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Scale to original size functionality
                      setCanvasItemDropdown(null);
                    }}
                    className="w-full px-3 py-1.5 text-left text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                  >
                    Scale to original size
                  </button>

                  {/* Add comment */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add comment functionality
                      setCanvasItemDropdown(null);
                    }}
                    className="w-full px-3 py-1.5 text-left text-sm text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    Add comment
                  </button>

                  <div className="border-t border-gray-200/50 my-1"></div>

                  {/* Copy link */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Copy link functionality
                      setCanvasItemDropdown(null);
                    }}
                    className="w-full px-3 py-1.5 text-left text-sm text-gray-700 hover:bg-blue-50 transition-colors flex items-center justify-between"
                  >
                    <span>Copy link</span>
                    <span className="text-xs text-gray-400">
                      Ctrl + Alt + shift + C
                    </span>
                  </button>

                  {/* Link to */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Link to functionality
                      setCanvasItemDropdown(null);
                    }}
                    className="w-full px-3 py-1.5 text-left text-sm text-gray-700 hover:bg-blue-50 transition-colors flex items-center justify-between"
                  >
                    <span>Link to</span>
                    <span className="text-xs text-gray-400">
                      Alt + Ctrl + K
                    </span>
                  </button>

                  {/* Info */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Info functionality
                      setCanvasItemDropdown(null);
                    }}
                    className="w-full px-3 py-1.5 text-left text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                  >
                    Info
                  </button>

                  <div className="border-t border-gray-200/50 my-1"></div>

                  {/* Lock */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      lockCanvasItem(canvasItem.id);
                      setCanvasItemDropdown(null);
                    }}
                    className="w-full px-3 py-1.5 text-left text-sm text-gray-700 hover:bg-blue-50 transition-colors flex items-center justify-between"
                  >
                    <span>{canvasItem.locked ? "Unlock" : "Lock"}</span>
                    <span className="text-xs text-gray-400">
                      Ctrl + shift + L
                    </span>
                  </button>

                  {/* Bring to front */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      bringToFront(canvasItem.id);
                      setCanvasItemDropdown(null);
                    }}
                    className="w-full px-3 py-1.5 text-left text-sm text-gray-700 hover:bg-blue-50 transition-colors flex items-center justify-between"
                  >
                    <span>Bring to front</span>
                    <span className="text-xs text-gray-400">PgUp</span>
                  </button>

                  {/* Bring forward */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Bring forward functionality
                      setCanvasItemDropdown(null);
                    }}
                    className="w-full px-3 py-1.5 text-left text-sm text-gray-700 hover:bg-blue-50 transition-colors flex items-center justify-between"
                  >
                    <span>Bring forward</span>
                    <span className="text-xs text-gray-400">shift + PgUp</span>
                  </button>

                  {/* Send backward */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Send backward functionality
                      setCanvasItemDropdown(null);
                    }}
                    className="w-full px-3 py-1.5 text-left text-sm text-gray-700 hover:bg-blue-50 transition-colors flex items-center justify-between"
                  >
                    <span>Send backward</span>
                    <span className="text-xs text-gray-400">shift + PgDn</span>
                  </button>

                  {/* Send to back */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      sendToBack(canvasItem.id);
                      setCanvasItemDropdown(null);
                    }}
                    className="w-full px-3 py-1.5 text-left text-sm text-gray-700 hover:bg-blue-50 transition-colors flex items-center justify-between"
                  >
                    <span>Send to back</span>
                    <span className="text-xs text-gray-400">PgDn</span>
                  </button>

                  {/* Move to layer */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Move to layer functionality with submenu
                      setCanvasItemDropdown(null);
                    }}
                    className="w-full px-3 py-1.5 text-left text-sm text-gray-700 hover:bg-blue-50 transition-colors flex items-center justify-between"
                  >
                    <span>Move to layer</span>
                    <span className="text-xs text-gray-400">▷</span>
                  </button>

                  <div className="border-t border-gray-200/50 my-1"></div>

                  {/* Copy */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Copy functionality
                      setCanvasItemDropdown(null);
                    }}
                    className="w-full px-3 py-1.5 text-left text-sm text-gray-700 hover:bg-blue-50 transition-colors flex items-center justify-between"
                  >
                    <span>Copy</span>
                    <span className="text-xs text-gray-400">Ctrl + C</span>
                  </button>

                  {/* Copy as image */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Copy as image functionality
                      setCanvasItemDropdown(null);
                    }}
                    className="w-full px-3 py-1.5 text-left text-sm text-gray-700 hover:bg-blue-50 transition-colors flex items-center justify-between"
                  >
                    <span>Copy as image</span>
                    <span className="text-xs text-gray-400">
                      Ctrl + shift + C
                    </span>
                  </button>

                  {/* Duplicate */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateCanvasItem(canvasItem.id);
                      setCanvasItemDropdown(null);
                    }}
                    className="w-full px-3 py-1.5 text-left text-sm text-gray-700 hover:bg-blue-50 transition-colors flex items-center justify-between"
                  >
                    <span>Duplicate</span>
                    <span className="text-xs text-gray-400">Ctrl + D</span>
                  </button>

                  <div className="border-t border-gray-200/50 my-1"></div>

                  {/* Create frame */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Create frame functionality
                      setCanvasItemDropdown(null);
                    }}
                    className="w-full px-3 py-1.5 text-left text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                  >
                    Create frame
                  </button>

                  {/* Save as template */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Save as template functionality
                      setCanvasItemDropdown(null);
                    }}
                    className="w-full px-3 py-1.5 text-left text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                  >
                    Save as template
                  </button>

                  <div className="border-t border-gray-200/50 my-1"></div>

                  {/* Delete */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFromCanvas(canvasItem.id);
                      setCanvasItemDropdown(null);
                    }}
                    className="w-full px-3 py-1.5 text-left text-sm text-gray-700 hover:bg-blue-50 transition-colors flex items-center justify-between"
                  >
                    <span>Delete</span>
                    <span className="text-xs text-gray-400">Delete</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Clean, smaller X button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveFromCanvas(canvasItem.id);
            }}
            className="p-1 bg-white/95 backdrop-blur-sm border border-gray-200/80 text-gray-500 rounded-md shadow-sm hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-150"
            title="Delete"
            aria-label="Delete item from canvas"
          >
            <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
              <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z" />
            </svg>
          </button>
        </div>
      );
    const resizeHandle = isResizable && isSelected && (
      <div
        data-resize-handle="true"
        className="absolute bottom-0 right-0 w-4 h-4 bg-sky-500 border-2 border-slate-800 rounded-full cursor-se-resize transform translate-x-1/2 translate-y-1/2 shadow-lg z-40"
        onMouseDown={(e) => handleResizeStart(e, canvasItem.id, "br")}
      />
    );

    if (canvasItem.type === "stickyNote") {
      return (
        <div
          key={canvasItem.id}
          style={{
            ...baseStyle,
            backgroundColor:
              canvasItem.backgroundColor ||
              APP_STICKY_NOTE_COLORS[0].backgroundColor,
            color: canvasItem.textColor || APP_STICKY_NOTE_COLORS[0].color,
            fontFamily: canvasItem.fontFamily,
            fontSize: canvasItem.fontSize,
            fontWeight: canvasItem.fontWeight,
            fontStyle: canvasItem.fontStyle,
            textDecoration: canvasItem.textDecoration,
            padding: "10px",
          }}
          onMouseDown={(e) => handleCanvasItemMouseDown(e, canvasItem.id)}
          onClick={() => setSelectedCanvasItemId(canvasItem.id)}
          className="shadow-lg"
        >
          <textarea
            data-editable-text="true"
            value={(() => {
              // Check if content is placeholder text
              const placeholders = [
                "New Note",
                "New Text",
                "New Comment",
                "Sticky note text",
                "Sticky Note",
                "Your Text Here",
              ];
              const isPlaceholder = placeholders.includes(
                canvasItem.content || "",
              );

              // If selected and content is placeholder, show empty
              if (isSelected && isPlaceholder) {
                return "";
              }

              return canvasItem.content || "";
            })()}
            placeholder={(() => {
              // Show placeholder only when not selected
              const placeholders = [
                "New Note",
                "New Text",
                "New Comment",
                "Sticky note text",
                "Sticky Note",
                "Your Text Here",
              ];
              const isPlaceholder = placeholders.includes(
                canvasItem.content || "",
              );

              if (!isSelected && isPlaceholder) {
                return canvasItem.content;
              }

              return "";
            })()}
            onChange={(e) =>
              handleCanvasItemContentChange(canvasItem.id, e.target.value)
            }
            className={commonTextareaClassCanvas}
            style={{
              color: "inherit",
              fontSize: "inherit",
              fontFamily: "inherit",
              fontWeight: "inherit",
              fontStyle: "inherit",
              textDecoration: "inherit",
            }}
          />
          {itemSpecificControls}
          {resizeHandle}
        </div>
      );
    } else if (canvasItem.type === "textElement") {
      return (
        <div
          key={canvasItem.id}
          style={{
            ...baseStyle,
            color: canvasItem.textColor || DEFAULT_TEXT_ELEMENT_COLOR,
            fontFamily: canvasItem.fontFamily,
            fontSize: canvasItem.fontSize,
            fontWeight: canvasItem.fontWeight,
            fontStyle: canvasItem.fontStyle,
            textDecoration: canvasItem.textDecoration,
            backgroundColor: canvasItem.backgroundColor || "transparent",
            border:
              canvasItem.backgroundColor === "transparent" && isSelected
                ? "1px dashed rgba(100, 116, 139, 0.5)"
                : "none",
            padding: "10px",
          }}
          onMouseDown={(e) => handleCanvasItemMouseDown(e, canvasItem.id)}
          onClick={() => setSelectedCanvasItemId(canvasItem.id)}
        >
          <textarea
            data-editable-text="true"
            value={(() => {
              // Check if content is placeholder text
              const placeholders = [
                "New Note",
                "New Text",
                "New Comment",
                "Sticky note text",
                "Sticky Note",
                "Your Text Here",
              ];
              const isPlaceholder = placeholders.includes(
                canvasItem.content || "",
              );

              // If selected and content is placeholder, show empty
              if (isSelected && isPlaceholder) {
                return "";
              }

              return canvasItem.content || "";
            })()}
            placeholder={(() => {
              // Show placeholder only when not selected
              const placeholders = [
                "New Note",
                "New Text",
                "New Comment",
                "Sticky note text",
                "Sticky Note",
                "Your Text Here",
              ];
              const isPlaceholder = placeholders.includes(
                canvasItem.content || "",
              );

              if (!isSelected && isPlaceholder) {
                return canvasItem.content;
              }

              return "";
            })()}
            onChange={(e) =>
              handleCanvasItemContentChange(canvasItem.id, e.target.value)
            }
            className={commonTextareaClassCanvas}
            style={{
              color: "inherit",
              fontSize: "inherit",
              fontFamily: "inherit",
              fontWeight: "inherit",
              fontStyle: "inherit",
              textDecoration: "inherit",
            }}
          />
          {itemSpecificControls}
          {resizeHandle}
        </div>
      );
    } else if (canvasItem.type === "shapeElement") {
      const shapeVariant = canvasItem.shapeVariant || "rectangle";
      const backgroundColor =
        canvasItem.backgroundColor || DEFAULT_SHAPE_FILL_COLOR;
      const borderColor = canvasItem.borderColor || DEFAULT_SHAPE_BORDER_COLOR;
      const borderWidth = canvasItem.borderWidth || "1px";
      const borderStyle = canvasItem.borderStyle || "solid";

      const shapeSvg = renderShapeVariant(
        shapeVariant,
        canvasItem.width || 120,
        canvasItem.height || 80,
        backgroundColor,
        borderColor,
        borderWidth,
      );

      return (
        <div
          key={canvasItem.id}
          style={{
            ...baseStyle,
            backgroundColor: shapeSvg ? "transparent" : backgroundColor,
            borderColor: shapeSvg ? "transparent" : borderColor,
            borderWidth: shapeSvg ? "0" : borderWidth,
            borderStyle: shapeSvg ? "none" : borderStyle,
          }}
          onMouseDown={(e) => handleCanvasItemMouseDown(e, canvasItem.id)}
          onClick={() => setSelectedCanvasItemId(canvasItem.id)}
          className="flex items-center justify-center"
        >
          {shapeSvg || (
            // Fallback to div styling for rectangle and unknown shapes
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: backgroundColor,
                border: `${borderWidth} ${borderStyle} ${borderColor}`,
              }}
            />
          )}
          {itemSpecificControls}
          {resizeHandle}
        </div>
      );
    } else if (canvasItem.type === "imageElement" && canvasItem.base64Data) {
      return (
        <div
          key={canvasItem.id}
          style={{ ...baseStyle, backgroundColor: "#1e293b" }}
          onMouseDown={(e) => handleCanvasItemMouseDown(e, canvasItem.id)}
          onClick={() => setSelectedCanvasItemId(canvasItem.id)}
          className="overflow-hidden flex items-center justify-center"
        >
          <img
            src={`data:${canvasItem.mimeType};base64,${canvasItem.base64Data}`}
            alt={canvasItem.content || "Canvas Image"}
            className="w-full h-full object-contain"
            style={{ pointerEvents: "none" }}
          />
          {itemSpecificControls}
          {resizeHandle}
        </div>
      );
    } else if (canvasItem.type === "frameElement") {
      return (
        <div
          key={canvasItem.id}
          style={{
            ...baseStyle,
            backgroundColor:
              canvasItem.backgroundColor || "rgba(255,255,255,0.03)",
            border: `2px dashed ${canvasItem.borderColor || DEFAULT_SHAPE_BORDER_COLOR}`,
          }}
          onMouseDown={(e) => handleCanvasItemMouseDown(e, canvasItem.id)}
          onClick={() => setSelectedCanvasItemId(canvasItem.id)}
          className="flex items-center justify-center"
        >
          {itemSpecificControls}
          {resizeHandle}
        </div>
      );
    } else if (canvasItem.type === "commentElement") {
      return (
        <div
          key={canvasItem.id}
          style={{
            ...baseStyle,
            backgroundColor: canvasItem.backgroundColor || "#A5F3FC",
            color: canvasItem.textColor || "#1F2937",
            fontFamily: canvasItem.fontFamily,
            fontSize: canvasItem.fontSize,
            fontWeight: canvasItem.fontWeight,
            fontStyle: canvasItem.fontStyle,
            textDecoration: canvasItem.textDecoration,
            padding: "10px",
            border: `1px solid ${canvasItem.borderColor || "#0891B2"}`,
          }}
          onMouseDown={(e) => handleCanvasItemMouseDown(e, canvasItem.id)}
          onClick={() => setSelectedCanvasItemId(canvasItem.id)}
          className="shadow-lg"
        >
          <textarea
            data-editable-text="true"
            value={(() => {
              // Check if content is placeholder text
              const placeholders = [
                "New Note",
                "New Text",
                "New Comment",
                "Sticky note text",
                "Sticky Note",
                "Your Text Here",
              ];
              const isPlaceholder = placeholders.includes(
                canvasItem.content || "",
              );

              // If selected and content is placeholder, show empty
              if (isSelected && isPlaceholder) {
                return "";
              }

              return canvasItem.content || "";
            })()}
            placeholder={(() => {
              // Show placeholder only when not selected
              const placeholders = [
                "New Note",
                "New Text",
                "New Comment",
                "Sticky note text",
                "Sticky Note",
                "Your Text Here",
              ];
              const isPlaceholder = placeholders.includes(
                canvasItem.content || "",
              );

              if (!isSelected && isPlaceholder) {
                return canvasItem.content;
              }

              return "";
            })()}
            onChange={(e) =>
              handleCanvasItemContentChange(canvasItem.id, e.target.value)
            }
            className={commonTextareaClassCanvas}
            style={{
              color: "inherit",
              fontSize: "inherit",
              fontFamily: "inherit",
              fontWeight: "inherit",
              fontStyle: "inherit",
              textDecoration: "inherit",
            }}
          />
          {itemSpecificControls}
          {resizeHandle}
        </div>
      );
    } else if (canvasItem.type === "mindMapNode") {
      const renderMindMapNode = () => {
        const {
          mindMapNodeType = "branch",
          mindMapLevel = 1,
          mindMapIcon = "💡",
          mindMapShape = "ellipse",
          mindMapTheme = "business",
          mindMapShadow = true,
          mindMapGradient,
          mindMapAnimation = "none",
          mindMapPriority = "medium",
          mindMapProgress = 0,
          mindMapTags = [],
        } = canvasItem;

        const getThemeColors = (theme: string, nodeType: string) => {
          const themes = {
            business: {
              central: { bg: "#1E40AF", border: "#1E3A8A", text: "#FFFFFF" },
              main: { bg: "#3B82F6", border: "#2563EB", text: "#FFFFFF" },
              branch: { bg: "#60A5FA", border: "#3B82F6", text: "#1F2937" },
              leaf: { bg: "#DBEAFE", border: "#93C5FD", text: "#1E40AF" },
            },
            creative: {
              central: { bg: "#7C2D92", border: "#581C87", text: "#FFFFFF" },
              main: { bg: "#A855F7", border: "#7C3AED", text: "#FFFFFF" },
              branch: { bg: "#C084FC", border: "#A855F7", text: "#1F2937" },
              leaf: { bg: "#F3E8FF", border: "#C084FC", text: "#7C2D92" },
            },
            nature: {
              central: { bg: "#166534", border: "#14532D", text: "#FFFFFF" },
              main: { bg: "#16A34A", border: "#15803D", text: "#FFFFFF" },
              branch: { bg: "#4ADE80", border: "#22C55E", text: "#1F2937" },
              leaf: { bg: "#DCFCE7", border: "#86EFAC", text: "#166534" },
            },
            tech: {
              central: { bg: "#0F172A", border: "#020617", text: "#FFFFFF" },
              main: { bg: "#1E293B", border: "#0F172A", text: "#FFFFFF" },
              branch: { bg: "#475569", border: "#334155", text: "#FFFFFF" },
              leaf: { bg: "#E2E8F0", border: "#94A3B8", text: "#1E293B" },
            },
            minimal: {
              central: { bg: "#FFFFFF", border: "#000000", text: "#000000" },
              main: { bg: "#F8FAFC", border: "#64748B", text: "#1E293B" },
              branch: { bg: "#F1F5F9", border: "#94A3B8", text: "#475569" },
              leaf: { bg: "#FFFFFF", border: "#CBD5E1", text: "#64748B" },
            },
            colorful: {
              central: { bg: "#DC2626", border: "#B91C1C", text: "#FFFFFF" },
              main: { bg: "#F59E0B", border: "#D97706", text: "#FFFFFF" },
              branch: { bg: "#10B981", border: "#059669", text: "#FFFFFF" },
              leaf: { bg: "#3B82F6", border: "#2563EB", text: "#FFFFFF" },
            },
          };
          return (
            themes[theme as keyof typeof themes]?.[
              nodeType as keyof typeof themes.business
            ] || themes.business.branch
          );
        };

        const themeColors = getThemeColors(mindMapTheme, mindMapNodeType);
        const priorityEffects = {
          critical: { glow: "none", scale: 1.0 },
          high: { glow: "none", scale: 1.0 },
          medium: { glow: "none", scale: 1.0 },
          low: { glow: "none", scale: 1.0 },
        };

        const shapeStyles = {
          circle: { borderRadius: "50%" },
          rectangle: { borderRadius: "8px" },
          ellipse: { borderRadius: "50px" },
          hexagon: {
            clipPath:
              "polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)",
          },
          diamond: { transform: "rotate(45deg)", borderRadius: "8px" },
          cloud: { borderRadius: "50px 20px 50px 20px" },
          star: {
            clipPath:
              "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
          },
        };

        const gradientStyle = mindMapGradient?.enabled
          ? {
              background: `linear-gradient(${
                mindMapGradient.direction === "horizontal"
                  ? "to right"
                  : mindMapGradient.direction === "vertical"
                    ? "to bottom"
                    : "to bottom right"
              }, ${mindMapGradient.from}, ${mindMapGradient.to})`,
            }
          : {};

        const safePriority = priorityEffects[mindMapPriority] ? mindMapPriority : "medium";
        const animationStyle = {
          none: {},
          pulse: {},
          glow: {},
          float: {},
          bounce: {},
        };

        return (
          <div style={{ position: "relative" }}>
            {/* Progress Bar */}
            {mindMapProgress > 0 && (
              <div
                style={{
                  position: "absolute",
                  bottom: "-6px",
                  left: "0",
                  right: "0",
                  height: "4px",
                  backgroundColor: "rgba(0,0,0,0.1)",
                  borderRadius: "2px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${mindMapProgress}%`,
                    height: "100%",
                    backgroundColor:
                      mindMapProgress < 30
                        ? "#EF4444"
                        : mindMapProgress < 70
                          ? "#F59E0B"
                          : "#10B981",
                    borderRadius: "2px",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
            )}

            {/* Main Node */}
            <div
              style={{
                position: "relative",
                transform: "none",
                transition: "all 0.3s ease",
                ...animationStyle[mindMapAnimation],
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding:
                    mindMapNodeType === "central" ? "16px 20px" : "12px 16px",
                  backgroundColor: canvasItem.backgroundColor || themeColors.bg,
                  color: canvasItem.textColor || themeColors.text,
                  border: `${canvasItem.borderWidth || "3px"} solid ${canvasItem.borderColor || themeColors.border}`,
                  boxShadow: mindMapShadow
                    ? `0 ${mindMapNodeType === "central" ? "4" : "2"}px ${mindMapNodeType === "central" ? "8" : "4"}px rgba(0,0,0,0.1)`
                    : "none",
                  fontFamily: canvasItem.fontFamily || "Inter, sans-serif",
                  fontSize:
                    mindMapNodeType === "central"
                      ? "16px"
                      : mindMapNodeType === "main"
                        ? "14px"
                        : "12px",
                  fontWeight:
                    mindMapNodeType === "central"
                      ? "800"
                      : mindMapNodeType === "main"
                        ? "700"
                        : "600",
                  textAlign: "center",
                  cursor: "pointer",
                  userSelect: "none",
                  minWidth: mindMapNodeType === "central" ? "120px" : "80px",
                  ...shapeStyles[mindMapShape],
                  ...gradientStyle,
                }}
              >
                {/* Icon */}
                {mindMapIcon && (
                  <div
                    style={{
                      fontSize: mindMapNodeType === "central" ? "24px" : "18px",
                      marginBottom: "4px",
                    }}
                  >
                    {mindMapIcon}
                  </div>
                )}

                {/* Content */}
                <div
                  style={{
                    lineHeight: "1.3",
                    wordBreak: "break-word",
                    maxWidth: "200px",
                  }}
                >
                  {canvasItem.content || canvasItem.text ||
                    (mindMapNodeType === "central"
                      ? "Strategy Center"
                      : mindMapNodeType === "main"
                        ? "Content Pillar"
                        : "Detail")}
                </div>

                {/* Level Indicator */}
                {mindMapLevel > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-8px",
                      right: "-8px",
                      width: "16px",
                      height: "16px",
                      backgroundColor: themeColors.border,
                      color: "#FFFFFF",
                      borderRadius: "50%",
                      fontSize: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {mindMapLevel}
                  </div>
                )}

                {/* Priority Indicator */}
                {mindMapPriority === "high" && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-4px",
                      left: "-4px",
                      width: "12px",
                      height: "12px",
                      backgroundColor: "#EF4444",
                      borderRadius: "50%",
                      border: "2px solid #FFFFFF",
                    }}
                  />
                )}
              </div>

              {/* Tags */}
              {mindMapTags.length > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    marginTop: "8px",
                    display: "flex",
                    gap: "4px",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    maxWidth: "200px",
                  }}
                >
                  {mindMapTags.slice(0, 3).map((tag, index) => (
                    <span
                      key={`mindmap-tag-${tag}-${index}`}
                      style={{
                        backgroundColor: "rgba(0,0,0,0.1)",
                        color: themeColors.text,
                        padding: "2px 6px",
                        borderRadius: "10px",
                        fontSize: "9px",
                        fontWeight: "500",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      };

      return (
        <div
          key={canvasItem.id}
          style={{
            ...baseStyle,
            background: "transparent",
          }}
          onMouseDown={(e) => handleCanvasItemMouseDown(e, canvasItem.id)}
          onClick={() => setSelectedCanvasItemId(canvasItem.id)}
        >
          {renderMindMapNode()}
          {itemSpecificControls}
          {resizeHandle}
        </div>
      );
    } else if (canvasItem.type === "flowchartBox") {
      return (
        <div
          key={canvasItem.id}
          style={{
            ...baseStyle,
            backgroundColor: canvasItem.backgroundColor || "#10B981",
            color: canvasItem.textColor || "#FFFFFF",
            borderRadius:
              canvasItem.flowchartType === "decision" ? "50%" : "8px",
            padding: "16px",
            fontFamily: canvasItem.fontFamily,
            fontSize: canvasItem.fontSize,
            fontWeight: canvasItem.fontWeight || "bold",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `2px solid ${canvasItem.borderColor || "#059669"}`,
          }}
          onMouseDown={(e) => handleCanvasItemMouseDown(e, canvasItem.id)}
          onClick={() => setSelectedCanvasItemId(canvasItem.id)}
        >
          <div style={{ fontSize: "13px" }}>
            {canvasItem.content || "Process"}
          </div>
          {itemSpecificControls}
          {resizeHandle}
        </div>
      );
    } else if (canvasItem.type === "kanbanCard") {
      const renderPremiumKanbanCard = () => {
        const {
          kanbanStatus = "todo",
          kanbanPriority = "medium",
          kanbanAssignee,
          kanbanCardType = "task",
          kanbanLabels = [],
          kanbanDueDate,
          kanbanEstimate,
          kanbanProgress = 0,
          kanbanDescription,
          kanbanChecklist = [],
          kanbanStoryPoints,
          kanbanSprint,
          kanbanEpic,
          kanbanTheme = "professional",
          kanbanSize = "medium",
          kanbanCornerStyle = "rounded",
          kanbanShadow = "medium",
          kanbanAnimation = "hover",
          kanbanTemplate = "detailed",
        } = canvasItem;

        const getStatusColor = (status: string) => {
          const colors = {
            todo: {
              bg: "#EFF6FF",
              border: "#DBEAFE",
              text: "#1E40AF",
              dot: "#3B82F6",
            },
            "in-progress": {
              bg: "#FEF3C7",
              border: "#FDE68A",
              text: "#92400E",
              dot: "#F59E0B",
            },
            done: {
              bg: "#D1FAE5",
              border: "#A7F3D0",
              text: "#065F46",
              dot: "#10B981",
            },
            blocked: {
              bg: "#FEE2E2",
              border: "#FECACA",
              text: "#991B1B",
              dot: "#EF4444",
            },
            review: {
              bg: "#F3E8FF",
              border: "#E9D5FF",
              text: "#5B21B6",
              dot: "#8B5CF6",
            },
            testing: {
              bg: "#FDF4FF",
              border: "#F5D0FE",
              text: "#7C2D92",
              dot: "#A855F7",
            },
            archived: {
              bg: "#F1F5F9",
              border: "#E2E8F0",
              text: "#475569",
              dot: "#64748B",
            },
          };
          return colors[status as keyof typeof colors] || colors.todo;
        };

        const getPriorityColor = (priority: string) => {
          const colors = {
            low: { bg: "#ECFDF5", text: "#065F46", icon: "���️" },
            medium: { bg: "#FEF3C7", text: "#92400E", icon: "���️" },
            high: { bg: "#FEF2F2", text: "#991B1B", icon: "⬆����" },
            urgent: { bg: "#FEE2E2", text: "#7F1D1D", icon: "🚨" },
            critical: { bg: "#7F1D1D", text: "#FFFFFF", icon: "���" },
          };
          return colors[priority as keyof typeof colors] || colors.medium;
        };

        const getCardTypeIcon = (type: string) => {
          const icons = {
            task: "��",
            bug: "�����",
            feature: "⭐",
            epic: "�����",
            story: "��",
            improvement: "📈",
            research: "������",
          };
          return icons[type as keyof typeof icons] || "📝";
        };

        const statusColor = getStatusColor(kanbanStatus);
        const priorityColor = getPriorityColor(kanbanPriority);
        const cardTypeIcon = getCardTypeIcon(kanbanCardType);

        const shadowStyles = {
          none: "none",
          small: "0 1px 2px rgba(0, 0, 0, 0.05)",
          medium:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          large:
            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        };

        const cornerStyles = {
          rounded: "12px",
          sharp: "4px",
          pill: "24px",
        };

        const sizeStyles = {
          small: { minHeight: "100px", fontSize: "11px" },
          medium: { minHeight: "140px", fontSize: "12px" },
          large: { minHeight: "180px", fontSize: "13px" },
          xl: { minHeight: "220px", fontSize: "14px" },
        };

        const animationStyles = {
          none: {},
          hover: { transition: "all 0.2s ease", cursor: "pointer" },
          pulse: { animation: "pulse 2s infinite" },
          glow: {
            boxShadow: `${shadowStyles[kanbanShadow]}, 0 0 20px ${statusColor.dot}33`,
          },
        };

        const completedTasks = kanbanChecklist.filter(
          (item) => item.completed,
        ).length;
        const totalTasks = kanbanChecklist.length;
        const progressPercentage =
          totalTasks > 0 ? (completedTasks / totalTasks) * 100 : kanbanProgress;

        return (
          <div
            style={{
              backgroundColor: canvasItem.backgroundColor || "#FFFFFF",
              border: `2px solid ${statusColor.border}`,
              borderRadius: cornerStyles[kanbanCornerStyle],
              boxShadow: shadowStyles[kanbanShadow],
              fontFamily:
                "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
              overflow: "hidden",
              position: "relative",
              ...sizeStyles[kanbanSize],
              ...animationStyles[kanbanAnimation],
            }}
            onMouseEnter={(e) => {
              if (kanbanAnimation === "hover") {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = shadowStyles.large;
              }
            }}
            onMouseLeave={(e) => {
              if (kanbanAnimation === "hover") {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = shadowStyles[kanbanShadow];
              }
            }}
          >
            {/* Status Bar */}
            <div
              style={{
                height: "4px",
                backgroundColor: statusColor.dot,
                width: "100%",
              }}
            />

            <div style={{ padding: "16px" }}>
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span style={{ fontSize: "16px" }}>{cardTypeIcon}</span>
                  <span
                    style={{
                      backgroundColor: priorityColor.bg,
                      color: priorityColor.text,
                      fontSize: "10px",
                      fontWeight: "600",
                      padding: "2px 6px",
                      borderRadius: "8px",
                    }}
                  >
                    {priorityColor.icon} {kanbanPriority.toUpperCase()}
                  </span>
                </div>
                {kanbanStoryPoints && (
                  <div
                    style={{
                      backgroundColor: "#F1F5F9",
                      color: "#475569",
                      fontSize: "10px",
                      fontWeight: "600",
                      padding: "4px 8px",
                      borderRadius: "50%",
                      minWidth: "24px",
                      textAlign: "center",
                    }}
                  >
                    {kanbanStoryPoints}
                  </div>
                )}
              </div>

              {/* Title */}
              <h3
                style={{
                  margin: "0 0 8px 0",
                  fontSize: sizeStyles[kanbanSize].fontSize,
                  fontWeight: "700",
                  color: canvasItem.textColor || "#1F2937",
                  lineHeight: "1.4",
                  wordBreak: "break-word",
                }}
              >
                {canvasItem.content || "Task Title"}
              </h3>

              {/* Description */}
              {kanbanDescription && kanbanTemplate !== "minimal" && (
                <p
                  style={{
                    margin: "0 0 12px 0",
                    fontSize: "11px",
                    color: "#6B7280",
                    lineHeight: "1.5",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {kanbanDescription}
                </p>
              )}

              {/* Labels */}
              {kanbanLabels.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "4px",
                    marginBottom: "12px",
                  }}
                >
                  {kanbanLabels.slice(0, 3).map((label, index) => (
                    <span
                      key={`kanban-label-${label}-${index}`}
                      style={{
                        backgroundColor: `hsl(${index * 60 + 200}, 70%, 90%)`,
                        color: `hsl(${index * 60 + 200}, 70%, 30%)`,
                        fontSize: "9px",
                        fontWeight: "500",
                        padding: "2px 6px",
                        borderRadius: "10px",
                      }}
                    >
                      {label}
                    </span>
                  ))}
                  {kanbanLabels.length > 3 && (
                    <span
                      style={{
                        backgroundColor: "#F3F4F6",
                        color: "#6B7280",
                        fontSize: "9px",
                        fontWeight: "500",
                        padding: "2px 6px",
                        borderRadius: "10px",
                      }}
                    >
                      +{kanbanLabels.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Progress Bar */}
              {(kanbanProgress > 0 || totalTasks > 0) && (
                <div style={{ marginBottom: "12px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "4px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "9px",
                        color: "#6B7280",
                        fontWeight: "500",
                      }}
                    >
                      Progress
                    </span>
                    <span
                      style={{
                        fontSize: "9px",
                        color: "#374151",
                        fontWeight: "600",
                      }}
                    >
                      {Math.round(progressPercentage)}%
                    </span>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: "6px",
                      backgroundColor: "#E5E7EB",
                      borderRadius: "3px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${progressPercentage}%`,
                        height: "100%",
                        backgroundColor:
                          progressPercentage < 30
                            ? "#EF4444"
                            : progressPercentage < 70
                              ? "#F59E0B"
                              : "#10B981",
                        borderRadius: "3px",
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Footer */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "auto",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  {/* Status */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        backgroundColor: statusColor.dot,
                        borderRadius: "50%",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "9px",
                        color: "#6B7280",
                        fontWeight: "500",
                        textTransform: "capitalize",
                      }}
                    >
                      {kanbanStatus.replace("-", " ")}
                    </span>
                  </div>

                  {/* Checklist count */}
                  {totalTasks > 0 && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "2px",
                      }}
                    >
                      <span style={{ fontSize: "10px" }}>����������</span>
                      <span
                        style={{
                          fontSize: "9px",
                          color: "#6B7280",
                          fontWeight: "500",
                        }}
                      >
                        {completedTasks}/{totalTasks}
                      </span>
                    </div>
                  )}
                </div>

                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  {/* Due date */}
                  {kanbanDueDate && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "2px",
                      }}
                    >
                      <span style={{ fontSize: "9px" }}>📅</span>
                      <span
                        style={{
                          fontSize: "9px",
                          color: "#6B7280",
                          fontWeight: "500",
                        }}
                      >
                        {new Date(kanbanDueDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  {/* Assignee */}
                  {kanbanAssignee && (
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        backgroundColor: statusColor.dot,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#FFFFFF",
                        fontSize: "10px",
                        fontWeight: "600",
                      }}
                    >
                      {kanbanAssignee
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      };

      return (
        <div
          key={canvasItem.id}
          style={{
            ...baseStyle,
            backgroundColor: "transparent",
            padding: "2px",
          }}
          onMouseDown={(e) => handleCanvasItemMouseDown(e, canvasItem.id)}
          onClick={() => setSelectedCanvasItemId(canvasItem.id)}
        >
          {renderPremiumKanbanCard()}
          {itemSpecificControls}
          {resizeHandle}
        </div>
      );
    } else if (canvasItem.type === "tableElement") {
      const renderPremiumTable = () => {
        const {
          tableData = {
            headers: ["Column 1", "Column 2"],
            rows: [["Data 1", "Data 2"]],
          },
          tableStyle = "professional",
          tableTheme = "blue",
          tableHeaderStyle = "gradient",
          tableBorderStyle = "all",
          tableAlternateRows = true,
          tableHoverEffect = true,
          tableFontSize = "medium",
          tableColumnAlignment = [],
          tableHeaderColor = "#F8FAFC",
          tableHeaderTextColor = "#1E293B",
          tableRowColors = ["#FFFFFF", "#F8FAFC"],
          tableBorderColor = "#E2E8F0",
          tableBorderWidth = 1,
          tableTitle,
          tableSubtitle,
          tableFooter,
          tableNotes,
        } = canvasItem;

        const getThemeColors = (theme: string) => {
          const themes = {
            light: {
              primary: "#F8FAFC",
              secondary: "#E2E8F0",
              accent: "#64748B",
              text: "#1E293B",
            },
            dark: {
              primary: "#1E293B",
              secondary: "#334155",
              accent: "#64748B",
              text: "#F1F5F9",
            },
            blue: {
              primary: "#DBEAFE",
              secondary: "#BFDBFE",
              accent: "#3B82F6",
              text: "#1E40AF",
            },
            green: {
              primary: "#D1FAE5",
              secondary: "#A7F3D0",
              accent: "#10B981",
              text: "#065F46",
            },
            purple: {
              primary: "#E9D5FF",
              secondary: "#C4B5FD",
              accent: "#8B5CF6",
              text: "#5B21B6",
            },
            orange: {
              primary: "#FED7AA",
              secondary: "#FDBA74",
              accent: "#F97316",
              text: "#C2410C",
            },
            red: {
              primary: "#FECACA",
              secondary: "#FCA5A5",
              accent: "#EF4444",
              text: "#B91C1C",
            },
            gradient: {
              primary: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              secondary: "#F1F5F9",
              accent: "#667eea",
              text: "#FFFFFF",
            },
          };
          return themes[theme as keyof typeof themes] || themes.blue;
        };

        const themeColors = getThemeColors(tableTheme);
        const fontSizes = { small: "10px", medium: "12px", large: "14px" };
        const fontSize = fontSizes[tableFontSize];

        const getHeaderStyle = () => {
          const baseStyle = {
            padding: "12px 8px",
            fontWeight: "600",
            fontSize: fontSize,
            color: tableHeaderTextColor,
            textAlign: "left" as const,
            borderBottom: `2px solid ${themeColors.accent}`,
          };

          switch (tableHeaderStyle) {
            case "gradient":
              return {
                ...baseStyle,
                background:
                  tableTheme === "gradient"
                    ? themeColors.primary
                    : `linear-gradient(135deg, ${themeColors.accent}15, ${themeColors.primary})`,
                color:
                  tableTheme === "gradient" ? "#FFFFFF" : tableHeaderTextColor,
              };
            case "background":
              return {
                ...baseStyle,
                backgroundColor: tableHeaderColor || themeColors.primary,
              };
            case "border":
              return {
                ...baseStyle,
                backgroundColor: "transparent",
                borderBottom: `3px solid ${themeColors.accent}`,
              };
            case "shadow":
              return {
                ...baseStyle,
                backgroundColor: tableHeaderColor || themeColors.primary,
                boxShadow: `0 2px 4px ${themeColors.accent}33`,
              };
            default:
              return {
                ...baseStyle,
                backgroundColor: tableHeaderColor || themeColors.primary,
              };
          }
        };

        const getBorderStyle = () => {
          const borderColor = tableBorderColor;
          const borderWidth = `${tableBorderWidth}px`;

          switch (tableBorderStyle) {
            case "all":
              return { border: `${borderWidth} solid ${borderColor}` };
            case "outer":
              return {
                border: `${borderWidth} solid ${borderColor}`,
                borderCollapse: "separate" as const,
              };
            case "horizontal":
              return {
                borderTop: `${borderWidth} solid ${borderColor}`,
                borderBottom: `${borderWidth} solid ${borderColor}`,
              };
            case "vertical":
              return {
                borderLeft: `${borderWidth} solid ${borderColor}`,
                borderRight: `${borderWidth} solid ${borderColor}`,
              };
            case "none":
              return { border: "none" };
            case "custom":
              return { border: `${borderWidth} solid ${borderColor}` };
            default:
              return { border: `${borderWidth} solid ${borderColor}` };
          }
        };

        return (
          <div
            style={{
              fontFamily:
                "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
              borderRadius: "12px",
              overflow: "hidden",
              backgroundColor: canvasItem.backgroundColor || "#FFFFFF",
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              border: `1px solid ${tableBorderColor || "#E5E7EB"}`,
            }}
          >
            {/* Table Header */}
            {(tableTitle || tableSubtitle) && (
              <div
                style={{
                  padding: "16px 20px",
                  borderBottom: `1px solid ${tableBorderColor || "#E5E7EB"}`,
                  background:
                    tableTheme === "gradient"
                      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                      : `linear-gradient(135deg, ${themeColors.accent}10, transparent)`,
                }}
              >
                {tableTitle && (
                  <h3
                    style={{
                      margin: "0 0 4px 0",
                      fontSize: "16px",
                      fontWeight: "700",
                      color:
                        tableTheme === "gradient"
                          ? "#FFFFFF"
                          : canvasItem.textColor || "#1F2937",
                    }}
                  >
                    {tableTitle}
                  </h3>
                )}
                {tableSubtitle && (
                  <p
                    style={{
                      margin: "0",
                      fontSize: "12px",
                      color: tableTheme === "gradient" ? "#E2E8F0" : "#64748B",
                    }}
                  >
                    {tableSubtitle}
                  </p>
                )}
              </div>
            )}

            {/* Table Content */}
            <div style={{ overflow: "auto", maxHeight: "calc(100% - 120px)" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: fontSize,
                  ...getBorderStyle(),
                }}
              >
                <thead>
                  <tr>
                    {tableData.headers.map((header, i) => (
                      <th
                        key={i}
                        style={{
                          ...getHeaderStyle(),
                          textAlign: tableColumnAlignment[i] || "left",
                          width:
                            tableColumnAlignment.length > 0
                              ? `${100 / tableData.headers.length}%`
                              : "auto",
                          position: "sticky",
                          top: 0,
                          zIndex: 10,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent:
                              tableColumnAlignment[i] === "center"
                                ? "center"
                                : tableColumnAlignment[i] === "right"
                                  ? "flex-end"
                                  : "flex-start",
                            gap: "8px",
                          }}
                        >
                          {header}
                          {/* Sort indicator for premium feel */}
                          <span style={{ opacity: 0.5, fontSize: "10px" }}>
                            ����
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData.rows.map((row, i) => (
                    <tr
                      key={i}
                      style={{
                        backgroundColor:
                          tableAlternateRows && i % 2 === 1
                            ? tableRowColors[1] || themeColors.secondary
                            : tableRowColors[0] || "#FFFFFF",
                        transition: tableHoverEffect ? "all 0.2s ease" : "none",
                        cursor: tableHoverEffect ? "pointer" : "default",
                      }}
                      onMouseEnter={(e) => {
                        if (tableHoverEffect) {
                          e.currentTarget.style.backgroundColor = `${themeColors.accent}15`;
                          e.currentTarget.style.transform = "scale(1.01)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (tableHoverEffect) {
                          e.currentTarget.style.backgroundColor =
                            tableAlternateRows && i % 2 === 1
                              ? tableRowColors[1] || themeColors.secondary
                              : tableRowColors[0] || "#FFFFFF";
                          e.currentTarget.style.transform = "scale(1)";
                        }
                      }}
                    >
                      {row.map((cell, j) => (
                        <td
                          key={j}
                          style={{
                            padding: "10px 8px",
                            textAlign: tableColumnAlignment[j] || "left",
                            color: canvasItem.textColor || "#374151",
                            borderBottom:
                              tableBorderStyle === "horizontal" ||
                              tableBorderStyle === "all"
                                ? `1px solid ${tableBorderColor || "#E5E7EB"}`
                                : "none",
                            borderRight:
                              tableBorderStyle === "vertical" ||
                              tableBorderStyle === "all"
                                ? `1px solid ${tableBorderColor || "#E5E7EB"}`
                                : "none",
                            fontSize: fontSize,
                            fontWeight: "400",
                            lineHeight: "1.4",
                          }}
                        >
                          {/* Enhanced cell content */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent:
                                tableColumnAlignment[j] === "center"
                                  ? "center"
                                  : tableColumnAlignment[j] === "right"
                                    ? "flex-end"
                                    : "flex-start",
                            }}
                          >
                            {/* Add special formatting for different data types */}
                            {cell.includes("%") ? (
                              <span
                                style={{
                                  color: cell.includes("-")
                                    ? "#DC2626"
                                    : cell.includes("+")
                                      ? "#059669"
                                      : "inherit",
                                  fontWeight: "500",
                                }}
                              >
                                {cell}
                              </span>
                            ) : cell.includes("$") ? (
                              <span
                                style={{ fontWeight: "600", color: "#059669" }}
                              >
                                {cell}
                              </span>
                            ) : cell === "Active" ? (
                              <span
                                style={{
                                  backgroundColor: "#D1FAE5",
                                  color: "#065F46",
                                  padding: "2px 8px",
                                  borderRadius: "12px",
                                  fontSize: "10px",
                                  fontWeight: "500",
                                }}
                              >
                                {cell}
                              </span>
                            ) : cell === "Review" ? (
                              <span
                                style={{
                                  backgroundColor: "#FEF3C7",
                                  color: "#92400E",
                                  padding: "2px 8px",
                                  borderRadius: "12px",
                                  fontSize: "10px",
                                  fontWeight: "500",
                                }}
                              >
                                {cell}
                              </span>
                            ) : (
                              cell
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            {(tableFooter || tableNotes) && (
              <div
                style={{
                  padding: "12px 20px",
                  borderTop: `1px solid ${tableBorderColor || "#E5E7EB"}`,
                  backgroundColor: "#F9FAFB",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {tableFooter && (
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#6B7280",
                      fontWeight: "500",
                    }}
                  >
                    {tableFooter}
                  </span>
                )}
                {tableNotes && (
                  <span
                    style={{
                      fontSize: "10px",
                      color: "#9CA3AF",
                      fontStyle: "italic",
                    }}
                  >
                    {tableNotes}
                  </span>
                )}
              </div>
            )}
          </div>
        );
      };

      return (
        <div
          key={canvasItem.id}
          style={{
            ...baseStyle,
            backgroundColor: "transparent",
            borderRadius: "12px",
            padding: "4px",
            overflow: "visible",
          }}
          onMouseDown={(e) => handleCanvasItemMouseDown(e, canvasItem.id)}
          onClick={() => setSelectedCanvasItemId(canvasItem.id)}
        >
          {renderPremiumTable()}
          {itemSpecificControls}
          {resizeHandle}
        </div>
      );
    } else if (canvasItem.type === "codeBlock") {
      const getThemeColors = (theme: string) => {
        const themes = {
          dark: {
            bg: "#1F2937",
            text: "#F9FAFB",
            header: "#374151",
            comment: "#9CA3AF",
          },
          light: {
            bg: "#FFFFFF",
            text: "#1F2937",
            header: "#F3F4F6",
            comment: "#6B7280",
          },
          github: {
            bg: "#F6F8FA",
            text: "#24292E",
            header: "#E1E4E8",
            comment: "#6A737D",
          },
          vscode: {
            bg: "#1E1E1E",
            text: "#D4D4D4",
            header: "#2D2D30",
            comment: "#6A9955",
          },
          sublime: {
            bg: "#272822",
            text: "#F8F8F2",
            header: "#3E3D32",
            comment: "#75715E",
          },
          atom: {
            bg: "#282C34",
            text: "#ABB2BF",
            header: "#21252B",
            comment: "#5C6370",
          },
          monokai: {
            bg: "#2D2A2E",
            text: "#FCFCFA",
            header: "#403E41",
            comment: "#727072",
          },
          solarized: {
            bg: "#002B36",
            text: "#839496",
            header: "#073642",
            comment: "#586E75",
          },
        };
        return themes[theme as keyof typeof themes] || themes.dark;
      };

      const themeColors = getThemeColors(canvasItem.codeTheme || "dark");
      const showLineNumbers = canvasItem.codeShowLineNumbers || false;
      const showCopyButton = canvasItem.codeShowCopyButton || false;
      const wordWrap = canvasItem.codeWordWrap || false;
      const codeLines = (canvasItem.content || "// Your code here").split("\n");

      return (
        <div
          key={canvasItem.id}
          style={{
            ...baseStyle,
            backgroundColor: themeColors.bg,
            color: themeColors.text,
            borderRadius: "8px",
            overflow: "hidden",
            border: `1px solid ${canvasItem.borderColor || "#374151"}`,
          }}
          onMouseDown={(e) => handleCanvasItemMouseDown(e, canvasItem.id)}
          onClick={() => setSelectedCanvasItemId(canvasItem.id)}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: themeColors.header,
              padding: "8px 12px",
              fontSize: "10px",
              opacity: 0.9,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: `1px solid ${canvasItem.borderColor || "#374151"}33`,
            }}
          >
            <span>����� {canvasItem.codeLanguage || "javascript"}</span>
            {showCopyButton && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(canvasItem.content || "");
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: themeColors.text,
                  cursor: "pointer",
                  opacity: 0.7,
                  fontSize: "10px",
                }}
                title="Copy code"
              >
                �������������
              </button>
            )}
          </div>

          {/* Code Content */}
          <div
            style={{
              padding: "12px",
              overflow: "auto",
              height: "calc(100% - 32px)",
              display: "flex",
            }}
          >
            {/* Line Numbers */}
            {showLineNumbers && (
              <div
                style={{
                  color: themeColors.comment,
                  fontSize: canvasItem.fontSize || "12px",
                  fontFamily: "Courier New, monospace",
                  marginRight: "12px",
                  textAlign: "right",
                  userSelect: "none",
                  minWidth: "24px",
                }}
              >
                {codeLines.map((_, index) => (
                  <div key={`code-line-${index}`}>{index + 1}</div>
                ))}
              </div>
            )}

            {/* Code */}
            <pre
              style={{
                margin: 0,
                fontFamily: "Courier New, monospace",
                fontSize: canvasItem.fontSize || "12px",
                whiteSpace: wordWrap ? "pre-wrap" : "pre",
                overflow: wordWrap ? "visible" : "auto",
                flex: 1,
              }}
            >
              {canvasItem.content || "// Your code here"}
            </pre>
          </div>
          {itemSpecificControls}
          {resizeHandle}
        </div>
      );
    } else if (canvasItem.type === "embedElement") {
      return (
        <div
          key={canvasItem.id}
          style={{
            ...baseStyle,
            backgroundColor: canvasItem.backgroundColor || "#F9FAFB",
            color: canvasItem.textColor || "#1F2937",
            borderRadius: "8px",
            padding: "16px",
            border: `2px dashed ${canvasItem.borderColor || "#9CA3AF"}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
          onMouseDown={(e) => handleCanvasItemMouseDown(e, canvasItem.id)}
          onClick={() => setSelectedCanvasItemId(canvasItem.id)}
        >
          <div style={{ fontSize: "24px", marginBottom: "8px" }}>��������������</div>
          <div style={{ fontSize: "12px", fontWeight: "bold" }}>
            {canvasItem.embedType || "Embed"} Content
          </div>
          <div style={{ fontSize: "10px", opacity: 0.7, marginTop: "4px" }}>
            {canvasItem.embedUrl || "No URL set"}
          </div>
          {itemSpecificControls}
          {resizeHandle}
        </div>
      );
    } else if (canvasItem.type === "chart") {
      const renderChart = () => {
        const {
          chartType,
          chartData,
          chartOptions,
          chartTitle,
          chartSubtitle,
        } = canvasItem;
        const data = chartData || {
          labels: ["A", "B", "C"],
          datasets: [
            {
              label: "Sample",
              data: [1, 2, 3],
              backgroundColor: ["#3B82F6", "#10B981", "#F59E0B"],
            },
          ],
        };

        const getColorScheme = (scheme: string) => {
          const schemes = {
            default: [
              "#3B82F6",
              "#10B981",
              "#F59E0B",
              "#EF4444",
              "#8B5CF6",
              "#06B6D4",
            ],
            rainbow: [
              "#FF6B6B",
              "#4ECDC4",
              "#45B7D1",
              "#96CEB4",
              "#FECA57",
              "#FF9FF3",
            ],
            blues: [
              "#1E3A8A",
              "#1E40AF",
              "#2563EB",
              "#3B82F6",
              "#60A5FA",
              "#93C5FD",
            ],
            greens: [
              "#064E3B",
              "#065F46",
              "#047857",
              "#059669",
              "#10B981",
              "#34D399",
            ],
            reds: [
              "#7F1D1D",
              "#991B1B",
              "#DC2626",
              "#EF4444",
              "#F87171",
              "#FCA5A5",
            ],
            purple: [
              "#581C87",
              "#7C3AED",
              "#8B5CF6",
              "#A78BFA",
              "#C4B5FD",
              "#DDD6FE",
            ],
            warm: [
              "#DC2626",
              "#EA580C",
              "#D97706",
              "#CA8A04",
              "#65A30D",
              "#16A34A",
            ],
            cool: [
              "#0C4A6E",
              "#0369A1",
              "#0284C7",
              "#0EA5E9",
              "#06B6D4",
              "#67E8F9",
            ],
            professional: [
              "#1F2937",
              "#374151",
              "#4B5563",
              "#6B7280",
              "#9CA3AF",
              "#D1D5DB",
            ],
          };
          return schemes[scheme as keyof typeof schemes] || schemes.default;
        };

        const colors = getColorScheme(chartOptions?.colorScheme || "default");

        if (chartType === "pie" || chartType === "doughnut") {
          const total =
            data.datasets[0]?.data.reduce((sum, val) => sum + val, 0) || 1;
          const radius =
            Math.min(
              (canvasItem.width || 300) / 2,
              (canvasItem.height || 200) / 2,
            ) - 40;
          const centerX = (canvasItem.width || 300) / 2;
          const centerY = (canvasItem.height || 200) / 2;

          let currentAngle = -Math.PI / 2;
          const segments =
            data.datasets[0]?.data.map((value, index) => {
              const percentage = (value / total) * 100;
              const angle = (value / total) * 2 * Math.PI;
              const startAngle = currentAngle;
              const endAngle = currentAngle + angle;

              const x1 = centerX + Math.cos(startAngle) * radius;
              const y1 = centerY + Math.sin(startAngle) * radius;
              const x2 = centerX + Math.cos(endAngle) * radius;
              const y2 = centerY + Math.sin(endAngle) * radius;

              const largeArcFlag = angle > Math.PI ? 1 : 0;
              const innerRadius = chartType === "doughnut" ? radius * 0.6 : 0;

              currentAngle += angle;

              const pathData =
                chartType === "doughnut"
                  ? `M ${centerX + Math.cos(startAngle) * innerRadius} ${centerY + Math.sin(startAngle) * innerRadius}
               L ${x1} ${y1}
               A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
               L ${centerX + Math.cos(endAngle) * innerRadius} ${centerY + Math.sin(endAngle) * innerRadius}
               A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${centerX + Math.cos(startAngle) * innerRadius} ${centerY + Math.sin(startAngle) * innerRadius}`
                  : `M ${centerX} ${centerY}
               L ${x1} ${y1}
               A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
               Z`;

              return {
                path: pathData,
                color: colors[index % colors.length],
                label: data.labels[index],
                value,
                percentage: percentage.toFixed(1),
              };
            }) || [];

          return (
            <svg width="100%" height="100%" style={{ overflow: "visible" }}>
              {segments.map((segment, index) => (
                <g key={`chart-segment-${segment.label || 'segment'}-${segment.value || 0}-${index}`}>
                  <path
                    d={segment.path}
                    fill={segment.color}
                    stroke="#fff"
                    strokeWidth="2"
                  />
                  {chartOptions?.showLabels && (
                    <text
                      x={
                        centerX +
                        Math.cos(
                          -Math.PI / 2 +
                            (index + 0.5) * ((2 * Math.PI) / segments.length),
                        ) *
                          (radius * 0.8)
                      }
                      y={
                        centerY +
                        Math.sin(
                          -Math.PI / 2 +
                            (index + 0.5) * ((2 * Math.PI) / segments.length),
                        ) *
                          (radius * 0.8)
                      }
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#000"
                      fontSize="10"
                      fontWeight="500"
                    >
                      {segment.label}
                    </text>
                  )}
                  {chartOptions?.showPercentages && (
                    <text
                      x={
                        centerX +
                        Math.cos(
                          -Math.PI / 2 +
                            (index + 0.5) * ((2 * Math.PI) / segments.length),
                        ) *
                          (radius * 0.6)
                      }
                      y={
                        centerY +
                        Math.sin(
                          -Math.PI / 2 +
                            (index + 0.5) * ((2 * Math.PI) / segments.length),
                        ) *
                          (radius * 0.6)
                      }
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#fff"
                      fontSize="9"
                      fontWeight="bold"
                    >
                      {segment.percentage}%
                    </text>
                  )}
                </g>
              ))}
            </svg>
          );
        } else {
          // Bar, Line, Area charts
          const chartWidth = (canvasItem.width || 350) - 60;
          const chartHeight = (canvasItem.height || 250) - 80;
          const maxValue = Math.max(...(data.datasets[0]?.data || [1]));
          const barWidth = (chartWidth / (data.labels?.length || 1)) * 0.7;
          const barSpacing = (chartWidth / (data.labels?.length || 1)) * 0.3;

          return (
            <svg width="100%" height="100%" style={{ overflow: "visible" }}>
              {/* Grid lines */}
              {chartOptions?.showGrid && (
                <g>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <line
                      key={i}
                      x1={40}
                      y1={30 + (chartHeight / 4) * i}
                      x2={40 + chartWidth}
                      y2={30 + (chartHeight / 4) * i}
                      stroke="#E5E7EB"
                      strokeWidth="1"
                    />
                  ))}
                </g>
              )}

              {/* Y-axis labels */}
              {[0, 1, 2, 3, 4].map((i) => (
                <text
                  key={i}
                  x={35}
                  y={30 + (chartHeight / 4) * i + 4}
                  textAnchor="end"
                  fontSize="9"
                  fill="#6B7280"
                >
                  {Math.round(maxValue * (1 - i / 4))}
                </text>
              ))}

              {/* Bars or Lines */}
              {data.datasets[0]?.data.map((value, index) => {
                const barHeight = (value / maxValue) * chartHeight;
                const x = 40 + index * (barWidth + barSpacing) + barSpacing / 2;
                const y = 30 + chartHeight - barHeight;

                if (chartType === "line" || chartType === "area") {
                  // Line chart points and connections
                  if (index < (data.datasets[0]?.data.length || 0) - 1) {
                    const nextValue = data.datasets[0]?.data[index + 1] || 0;
                    const nextBarHeight = (nextValue / maxValue) * chartHeight;
                    const nextX =
                      40 +
                      (index + 1) * (barWidth + barSpacing) +
                      barSpacing / 2 +
                      barWidth / 2;
                    const nextY = 30 + chartHeight - nextBarHeight;

                    return (
                      <g key={`chart-line-${index}-${Date.now()}`}>
                        <line
                          x1={x + barWidth / 2}
                          y1={y}
                          x2={nextX}
                          y2={nextY}
                          stroke={colors[0]}
                          strokeWidth="3"
                          fill="none"
                        />
                        <circle
                          cx={x + barWidth / 2}
                          cy={y}
                          r="4"
                          fill={colors[0]}
                          stroke="#fff"
                          strokeWidth="2"
                        />
                      </g>
                    );
                  } else {
                    return (
                      <circle
                        key={`chart-point-${x}-${y}-${index}`}
                        cx={x + barWidth / 2}
                        cy={y}
                        r="4"
                        fill={colors[0]}
                        stroke="#fff"
                        strokeWidth="2"
                      />
                    );
                  }
                } else {
                  // Bar chart
                  return (
                    <g key={`chart-bar-${index}-${barHeight}`}>
                      <rect
                        x={x}
                        y={y}
                        width={barWidth}
                        height={barHeight}
                        fill={colors[index % colors.length]}
                        rx="2"
                      />
                      {chartOptions?.showValues && (
                        <text
                          x={x + barWidth / 2}
                          y={y - 5}
                          textAnchor="middle"
                          fontSize="9"
                          fill="#374151"
                          fontWeight="500"
                        >
                          {value}
                        </text>
                      )}
                    </g>
                  );
                }
              })}

              {/* X-axis labels */}
              {data.labels?.map((label, index) => (
                <text
                  key={`axis-label-${typeof label === 'string' ? label : `label-${index}`}-${index}`}
                  x={
                    40 +
                    index * (barWidth + barSpacing) +
                    barSpacing / 2 +
                    barWidth / 2
                  }
                  y={30 + chartHeight + 15}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#6B7280"
                >
                  {label}
                </text>
              ))}
            </svg>
          );
        }
      };

      return (
        <div
          key={canvasItem.id}
          style={{
            ...baseStyle,
            backgroundColor: canvasItem.backgroundColor || "#FFFFFF",
            borderRadius: "8px",
            padding: "16px",
            border: `1px solid ${canvasItem.borderColor || "#E5E7EB"}`,
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            display: "flex",
            flexDirection: "column",
          }}
          onMouseDown={(e) => handleCanvasItemMouseDown(e, canvasItem.id)}
          onClick={() => setSelectedCanvasItemId(canvasItem.id)}
        >
          {/* Chart Header */}
          {(canvasItem.chartTitle || canvasItem.chartSubtitle) && (
            <div style={{ marginBottom: "12px", textAlign: "center" }}>
              {canvasItem.chartTitle && (
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: canvasItem.textColor || "#1F2937",
                    marginBottom: "4px",
                  }}
                >
                  {canvasItem.chartTitle}
                </div>
              )}
              {canvasItem.chartSubtitle && (
                <div
                  style={{
                    fontSize: "11px",
                    color: "#6B7280",
                  }}
                >
                  {canvasItem.chartSubtitle}
                </div>
              )}
            </div>
          )}

          {/* Chart Content */}
          <div style={{ flex: 1, position: "relative" }}>{renderChart()}</div>

          {/* Legend */}
          {canvasItem.chartOptions?.showLegend && canvasItem.chartData && (
            <div
              style={{
                marginTop: "12px",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              {canvasItem.chartData.labels?.map((label, index) => (
                <div
                  key={`chart-legend-${index}-${segments[index]?.label || index}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "10px",
                    color: "#374151",
                  }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      backgroundColor: (function () {
                        const colors = {
                          default: [
                            "#3B82F6",
                            "#10B981",
                            "#F59E0B",
                            "#EF4444",
                            "#8B5CF6",
                            "#06B6D4",
                          ],
                          rainbow: [
                            "#FF6B6B",
                            "#4ECDC4",
                            "#45B7D1",
                            "#96CEB4",
                            "#FECA57",
                            "#FF9FF3",
                          ],
                          blues: [
                            "#1E3A8A",
                            "#1E40AF",
                            "#2563EB",
                            "#3B82F6",
                            "#60A5FA",
                            "#93C5FD",
                          ],
                          greens: [
                            "#064E3B",
                            "#065F46",
                            "#047857",
                            "#059669",
                            "#10B981",
                            "#34D399",
                          ],
                          reds: [
                            "#7F1D1D",
                            "#991B1B",
                            "#DC2626",
                            "#EF4444",
                            "#F87171",
                            "#FCA5A5",
                          ],
                          purple: [
                            "#581C87",
                            "#7C3AED",
                            "#8B5CF6",
                            "#A78BFA",
                            "#C4B5FD",
                            "#DDD6FE",
                          ],
                          warm: [
                            "#DC2626",
                            "#EA580C",
                            "#D97706",
                            "#CA8A04",
                            "#65A30D",
                            "#16A34A",
                          ],
                          cool: [
                            "#0C4A6E",
                            "#0369A1",
                            "#0284C7",
                            "#0EA5E9",
                            "#06B6D4",
                            "#67E8F9",
                          ],
                          professional: [
                            "#1F2937",
                            "#374151",
                            "#4B5563",
                            "#6B7280",
                            "#9CA3AF",
                            "#D1D5DB",
                          ],
                        };
                        const scheme =
                          colors[
                            (canvasItem.chartOptions
                              ?.colorScheme as keyof typeof colors) || "default"
                          ];
                        return scheme[index % scheme.length];
                      })(),
                      borderRadius: "2px",
                      marginRight: "4px",
                    }}
                  />
                  {label}
                </div>
              ))}
            </div>
          )}

          {itemSpecificControls}
          {resizeHandle}
        </div>
      );
    }
    return null;
  };

  // SEARCH_FILE_TYPES moved to EnhancedWebSearch component

  const renderYouTubeStats = (content: string, userInput: string) => {
    // Parse the structured YouTube stats content
    const lines = content.split("\n").filter((line) => line.trim());
    const stats: { [key: string]: string } = {};

    // Extract stats from the formatted content
    lines.forEach((line) => {
      if (line.includes("**") && line.includes(":")) {
        const parts = line.split(":");
        if (parts.length >= 2) {
          const key = parts[0].replace(/\*\*/g, "").trim();
          const value = parts.slice(1).join(":").trim();
          stats[key] = value;
        }
      }
    });

    // Format the display URL
    const displayUrl = userInput.startsWith("http")
      ? userInput
      : `https://www.youtube.com/@${userInput.replace("@", "")}`;

    return (
      <div className="space-y-4 p-6 bg-slate-700/80 rounded-lg shadow-lg">
        <div className="border-b border-slate-600 pb-3">
          <h3 className="font-semibold text-lg bg-gradient-to-r from-sky-500 to-purple-500 bg-clip-text text-transparent">
            Generated YouTube Stats:
          </h3>
        </div>

        <div className="space-y-3">
          <div className="text-sm text-slate-400">
            <span className="font-medium">Input:</span>
            <span className="text-sky-400 ml-2">{displayUrl}</span>
          </div>

          <div className="text-slate-200 space-y-1.5">
            <div className="text-lg font-medium text-white border-b border-slate-600 pb-2 mb-3">
              YouTube Channel Statistics for {displayUrl}:
            </div>

            {stats["Total Videos"] && (
              <div>
                <span className="font-medium text-slate-300">
                  Total Videos:
                </span>
                <span className="ml-2 text-white">{stats["Total Videos"]}</span>
              </div>
            )}

            {stats["Subscribers"] && (
              <div>
                <span className="font-medium text-slate-300">Subscribers:</span>
                <span className="ml-2 text-white">{stats["Subscribers"]}</span>
              </div>
            )}

            {stats["All-time Views"] && (
              <div>
                <span className="font-medium text-slate-300">
                  All-time Views:
                </span>
                <span className="ml-2 text-white">
                  {stats["All-time Views"]}
                </span>
              </div>
            )}

            {stats["Joined YouTube"] && (
              <div>
                <span className="font-medium text-slate-300">
                  Joined YouTube:
                </span>
                <span className="ml-2 text-white">
                  {stats["Joined YouTube"]}
                </span>
              </div>
            )}

            {stats["Location"] && (
              <div>
                <span className="font-medium text-slate-300">Location:</span>
                <span className="ml-2 text-white">{stats["Location"]}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const parseYoutubeStatsContent = (
    content: string,
    userInput: string,
  ): ChannelTableEntry => {
    // Try to find channel name from content first
    let channelName = "N/A";
    const channelNamePatterns = [
      /Channel Name:\s*(.+)/i,
      /Channel:\s*(.+)/i,
      /(?:^|\n)\s*(.+?)\s*(?:\n|$)/,
      /YouTube Channel:\s*(.+)/i,
    ];

    for (const pattern of channelNamePatterns) {
      const match = content.match(pattern);
      if (match && match[1]) {
        channelName = match[1].trim().replace(/^@/, "");
        break;
      }
    }

    // If still no channel name found, try to extract from userInput
    if (channelName === "N/A") {
      if (!userInput.startsWith("http") && !userInput.startsWith("www.")) {
        channelName = userInput.trim().replace(/^@/, "");
      } else {
        // Attempt to extract channel/user/handle from YouTube URL in userInput
        const urlMatch = userInput.match(
          /youtube\.com\/(?:channel\/|user\/|@|c\/)([a-zA-Z0-9_-]+)/i,
        );
        if (urlMatch && urlMatch[1]) {
          channelName = urlMatch[1];
        }
      }
    }

    // Helper to parse numbers with K/M/B/thousand/million/billion suffixes
    const parseFlexibleNumber = (str: string): number => {
      let value = str.replace(/[,\s]/g, "").toLowerCase();
      let multiplier = 1;
      if (value.includes("billion") || value.endsWith("b")) {
        multiplier = 1_000_000_000;
        value = value.replace(/[^0-9.]/g, "");
      } else if (value.includes("million") || value.endsWith("m")) {
        multiplier = 1_000_000;
        value = value.replace(/[^0-9.]/g, "");
      } else if (value.includes("thousand") || value.endsWith("k")) {
        multiplier = 1_000;
        value = value.replace(/[^0-9.]/g, "");
      } else {
        value = value.replace(/[^0-9.]/g, "");
      }
      const num = parseFloat(value);
      return isNaN(num) ? 0 : Math.round(num * multiplier);
    };

    // Generic regex for numbers with optional commas, decimals, and suffixes
    const numberRegex = /([\d,.]+\s*(?:[kmb]|thousand|million|billion)?)/i;

    // Extract a stat from a line by label
    const extractStat = (label: string, lines: string[]): number => {
      for (const line of lines) {
        if (line.toLowerCase().includes(label)) {
          const match = line.match(numberRegex);
          if (match && match[1]) {
            return parseFlexibleNumber(match[1]);
          }
        }
      }
      return 0;
    };

    const lines = content.split("\n");
    const subscribers = extractStat("subscriber", lines);
    const videos = extractStat("video", lines);
    const totalViews = extractStat("view", lines);

    // Calculate average views per video
    const averageViewsPerVideo =
      videos > 0 ? Math.round(totalViews / videos) : 0;

    return {
      channelName: channelName || "N/A",
      subscribers,
      videos,
      totalViews,
      averageViewsPerVideo,
      id: "temp-id", // Will be replaced by actual id in mapping
    };
  };

  const generateChannelTable = useCallback(() => {
    if (youtubeStatsData.length === 0) {
      setError("No YouTube stats available to generate a table.");
      return;
    }

    const newTableEntries: ChannelTableEntry[] = youtubeStatsData.map(
      (entry) => {
        console.log("=== GENERATE TABLE DEBUG ===");
        console.log("Processing entry:", entry.userInput);
        console.log("Entry content snippet:", entry.content.substring(0, 200));

        const parsed = parseYoutubeStatsContent(entry.content, entry.userInput);

        console.log("Parsed result:", parsed);

        const tableEntry = {
          id: entry.id,
          channelName: parsed.channelName || "CrispyConcords",
          subscribers: parsed.subscribers,
          videos: parsed.videos,
          totalViews: parsed.totalViews,
          averageViewsPerVideo: parsed.averageViewsPerVideo,
        };

        console.log("Final table entry:", tableEntry);
        console.log("============================");

        return tableEntry;
      },
    );

    setChannelTableData((prevEntries) => {
      const updatedEntries = [...prevEntries];
      newTableEntries.forEach((newEntry) => {
        const existingIndex = updatedEntries.findIndex(
          (entry) =>
            entry.channelName.toLowerCase() ===
            newEntry.channelName.toLowerCase(),
        );
        if (existingIndex > -1) {
          updatedEntries[existingIndex] = newEntry;
        } else {
          updatedEntries.push(newEntry);
        }
      });
      return updatedEntries;
    });

    // Scroll to the table after a short delay to ensure it renders
    setTimeout(() => {
      const tableElement = document.getElementById('channel-comparison-table');
      if (tableElement) {
        tableElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  }, [youtubeStatsData]);

  const handleDeleteChannelTableEntry = useCallback((id: string) => {
    if (confirm("Are you sure you want to delete this channel table entry?")) {
      setChannelTableData((prev) => prev.filter((entry) => entry.id !== id));
    }
  }, []);

  const handlePinChannelTableEntryToCanvas = useCallback(
    (entry: ChannelTableEntry) => {
      const newId = crypto.randomUUID();
      const tableContent = `Channel: ${entry.channelName}\nSubscribers: ${entry.subscribers.toLocaleString()}\nVideos: ${entry.videos.toLocaleString()}\nTotal Views: ${entry.totalViews.toLocaleString()}\nAvg Views/Video: ${entry.averageViewsPerVideo.toLocaleString()}`;
      const newCanvasItem: CanvasItem = {
        id: newId,
        type: "textElement",
        content: tableContent,
        x: (Math.random() * 200 + 50 - canvasOffset.x) / zoomLevel,
        y: (Math.random() * 200 + 50 - canvasOffset.y) / zoomLevel,
        zIndex: nextZIndex,
        width: 350,
        height: 180,
        textColor: "#E0E7FF",
        backgroundColor: "rgba(30,41,59,0.9)",
        fontFamily: "Arial",
        fontSize: "14px",
        fontWeight: "normal",
        fontStyle: "normal",
        textDecoration: "none",
      };
      const updatedItems = [...canvasItems, newCanvasItem];
      const newNextOverallZ = nextZIndex + 1;
      setCanvasItems(updatedItems);
      setNextZIndex(newNextOverallZ);
      commitCurrentStateToHistory(
        updatedItems,
        newNextOverallZ,
        canvasOffset,
        zoomLevel,
      );
      setSelectedCanvasItemId(newId);
      setActiveTab("canvas");
    },
    [
      canvasItems,
      nextZIndex,
      canvasOffset,
      zoomLevel,
      commitCurrentStateToHistory,
    ],
  );

  // Render Account or Billing page if navigated
  if (currentPage === "account") {
    return (
      <FirebaseErrorBoundary>
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
          <div className="p-4">
            <Button
              onClick={handleBackToApp}
              variant="outline"
              className="mb-4 gap-2"
            >
              ← Back to App
            </Button>
          </div>
          <ProfilePageStudio onNavigateToBilling={handleNavigateToBilling} />
        </div>
      </FirebaseErrorBoundary>
    );
  }

  if (currentPage === "billing") {
    return (
      <FirebaseErrorBoundary>
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
          <div className="p-4">
            <Button
              onClick={handleBackToApp}
              variant="outline"
              className="mb-4 gap-2"
            >
              ← Back to App
            </Button>
          </div>
          <BillingPageStudio />
        </div>
      </FirebaseErrorBoundary>
    );
  }

  return (
    <FirebaseErrorBoundary>
      <SidebarProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex">
        {/* Desktop Sidebar - Hidden on Mobile */}
        <div className="desktop-only">
          <StudioSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            user={user}
            onExpandedChange={setSidebarExpanded}
            userPlan={userPlan}
            isPremium={isPremium}
            setUserPlan={setUserPlan}
            refreshBilling={refreshBilling}
          />
        </div>

        {/* Mobile Header */}
        <div className="mobile-only">
          <MobileHeader
            user={user}
            userPlan={userPlan}
            title="CreateGen Studio"
            onSignOut={handleSignOut}
            onNavigateToBilling={() => onNavigateToBilling?.()}
            onNavigateToAccount={() => onNavigateToAccount?.()}
            credits={credits?.totalCredits || 0}
          />
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col justify-start">
        {/* Top Header - Isolated from design system conflicts */}
        <header className="isolated-navbar">
          <div className="isolated-navbar-content">
            {/* Left side - Search */}
            <div className="isolated-navbar-search">
              <div className="isolated-navbar-search-container">
                <svg className="isolated-navbar-search-icon" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input
                  placeholder="Search projects, templates, or tools..."
                  className="isolated-navbar-search-input"
                  onFocus={() => {
                    const event = new KeyboardEvent('keydown', {
                      key: 'k',
                      metaKey: true,
                      ctrlKey: true,
                      bubbles: true
                    });
                    document.dispatchEvent(event);
                  }}
                />
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="isolated-navbar-actions">
              {/* Credits Display */}
              {user && (
                <div className="isolated-navbar-credits">
                  <div className="isolated-navbar-credits-icon">
                    <GemIcon />
                  </div>
                  <span className="isolated-navbar-credits-count">{credits?.totalCredits || 0}</span>
                  <span className="isolated-navbar-credits-label">credits</span>
                </div>
              )}

              {/* Notifications */}
              <button className="isolated-navbar-btn">
                <BellIcon />
                <span className="isolated-navbar-notification-badge" />
              </button>

              {/* Settings */}
              <button className="isolated-navbar-btn">
                <SettingsIcon />
              </button>

              {/* Upgrade Button */}
              {!isPremium && (
                <button
                  onClick={handleShowUpgrade}
                  className="isolated-navbar-upgrade"
                >
                  <CrownIcon />
                  <span>Upgrade</span>
                </button>
              )}

              {/* User Menu */}
              {user && (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="isolated-navbar-user-btn"
                  >
                    <div className="isolated-navbar-avatar">
                      <UserIcon />
                    </div>
                    <span>
                      {user.displayName || user.email?.split("@")[0] || "Creator"}
                    </span>
                  </button>

                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowUserMenu(false)}
                      />
                      <div className="user-dropdown-menu">
                        <div className="user-dropdown-header">
                          <p className="user-name">
                            {user.displayName || "John Doe"}
                          </p>
                          <p className="user-email">
                            {user.email || "john@creategen.studio"}
                          </p>
                        </div>
                        <div className="user-dropdown-separator" />
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            handleNavigateToAccount();
                          }}
                          className="user-dropdown-item"
                        >
                          <UserIcon />
                          Profile
                        </button>
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            handleNavigateToBilling();
                          }}
                          className="user-dropdown-item"
                        >
                          <SettingsIcon />
                          Billing & Subscription
                        </button>
                        <div className="user-dropdown-separator" />
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            handleSignOut();
                          }}
                          className="user-dropdown-item danger"
                        >
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Sign In/Join */}
              {!user && (
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 bg-gradient-primary text-text-primary rounded-lg font-medium text-sm transition-all duration-200 shadow-md hover:shadow-lg hover-glow inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-gradient-primary text-text-primary font-semibold shadow-design-md hover:shadow-design-glow hover:scale-[1.02] active:scale-[0.98] border border-border-accent/30 h-9 px-4 py-2"
                >
                  <PlusCircleIcon className="h-4 w-4" />
                  <span>Join CreateGen</span>
                </button>
              )}
            </div>
          </div>
        </header>


        {/* Anonymous user menu overlay */}
        {!user && showUserMenu && (
          <div
            className="fixed inset-0"
            style={{ zIndex: 99999 }}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) {
                setShowUserMenu(false);
              }
            }}
          >
            <div
              className="absolute top-20 right-4 w-56 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-slate-700">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="h-10 w-10 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center text-white font-semibold">
                      G
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-blue-400 rounded-full ring-2 ring-slate-800 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Guest User
                    </p>
                    <p className="text-xs text-slate-400">Anonymous</p>
                    <div className="flex items-center mt-1">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-400/30">
                        Free Trial
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-2">
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log(
                      "Anonymous user sign in clicked from main app!",
                    );
                    setShowFreeCreditsPopup(true);
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-3 py-2.5 text-sm text-slate-300 hover:bg-green-600/20 hover:text-green-400 rounded-lg flex items-center space-x-3 cursor-pointer border-none bg-transparent"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span>Sign In</span>
                </button>
              </div>
            </div>
          </div>
        )}


        <main className={`flex-1 overflow-y-auto transition-all duration-300 ${
          isMobile
            ? 'mobile-main' // Mobile: full width with top/bottom padding
            : 'ml-0' // Desktop: no margins or padding needed
        }`}>
          {activeTab === "studioHub" && (
            <div className="mobile-container">
              <StudioHubWorldClass
                onNavigateToTab={setActiveTab}
                userPlan={userPlan}
                user={user}
                userName={user?.displayName || user?.email?.split('@')[0] || 'Creator'}
                isPremium={isPremium}
                onUpgrade={handleShowUpgrade}
              />
            </div>
          )}

          {activeTab === "trends" && (
            <div className="w-full">
              <TrendsWorldClass
                // Pass real data and handlers from the comprehensive system
                trendAnalysis={generatedTrendAnalysis}
                isLoading={isAnalyzingTrends}
                error={trendAnalysisError}
                onAnalyzeTrends={handleTrendAnalysis}
                recentQueries={recentTrendQueries}
                isPremium={isPremium}
                onUpgrade={handleShowUpgrade}
                initialQuery={trendsInitialQuery}
                userPlan={userPlan}
                platform={platform}
                onAnalyzeTrend={(keyword) => {
                  // Trigger trend analysis with the keyword
                  handleTrendAnalysis(keyword, {});
                }}
                onExportData={() => {
                  console.log("Exporting trend data");
                  // Handle export functionality
                }}
                onRefreshData={() => {
                  console.log("Refreshing trend data");
                  // Handle refresh functionality
                }}
                onNavigateToGenerator={(content: string) => {
                  setGeneratorInput(content);
                  setActiveTab("generator");
                  setGeneratedOutput(null);
                }}
                onSwitchToGenerator={(contentType, title) => {
                  setActiveMainTab("generator");
                  setUserInput(title);
                  if (contentType === "Text" || contentType === "Video") {
                    setContentType(contentType);
                  }
                }}
                onCopyToClipboard={(text) => {
                  handleCopyToClipboard(text);
                }}
                onSendToCalendar={(idea) => {
                  console.log("Sending to calendar:", idea);
                }}
                onGenerateContent={(contentType, prompt) => {
                  setActiveMainTab("generator");
                  setUserInput(prompt);
                }}
              />
            </div>
          )}

          {activeTab !== "studioHub" && activeTab !== "trends" && (
          <div className="mobile-container h-full flex flex-col">
          {activeTab === "generator" && (
            // COMMENTED OUT: New design system - GeneratorWorldClass (temporarily disabled)
            // <GeneratorWorldClass
            //   userInput={userInput}
            //   setUserInput={setUserInput}
            //   contentType={contentType}
            //   setContentType={setContentType}
            //   platform={platform}
            //   setPlatform={setPlatform}
            //   targetAudience={targetAudience}
            //   setTargetAudience={setTargetAudience}
            //   generatedOutput={generatedOutput}
            //   isLoading={isLoading}
            //   onGenerate={handleGenerateContent}
            //   onSaveToHistory={addHistoryItemToState}
            //   userPlan={userPlan}
            //   history={history}
            //   courseDifficulty={courseDifficulty}
            //   setCourseDifficulty={setCourseDifficulty}
            //   includeAssessments={includeAssessments}
            //   setIncludeAssessments={setIncludeAssessments}
            //   courseObjectives={courseObjectives}
            //   setCourseObjectives={setCourseObjectives}
            //   coursePriceRange={coursePriceRange}
            //   setCoursePriceRange={setCoursePriceRange}
            //   courseTargetAudience={courseTargetAudience}
            //   setCourseTargetAudience={setCourseTargetAudience}
            //   includeMarketing={includeMarketing}
            //   setIncludeMarketing={setIncludeMarketing}
            //   includeBonuses={includeBonuses}
            //   setIncludeBonuses={setIncludeBonuses}
            //   includeUpsells={includeUpsells}
            //   setIncludeUpsells={setIncludeUpsells}
            // />

            // APP-STYLED: Generator that perfectly matches the app's design language
            <GeneratorAppStyled
              platform={platform}
              setPlatform={setPlatform}
              contentType={contentType}
              setContentType={setContentType}
              userInput={userInput}
              setUserInput={setUserInput}
              targetAudience={targetAudience}
              setTargetAudience={setTargetAudience}
              batchVariations={batchVariations}
              setBatchVariations={setBatchVariations}
              selectedAiPersonaId={selectedAiPersonaId}
              setSelectedAiPersonaId={setSelectedAiPersonaId}
              userPlan={userPlan}
              isPremiumUser={isPremium}
              allPersonas={allPersonas}
              seoKeywords={seoKeywords}
              setSeoKeywords={setSeoKeywords}
              seoMode={seoMode}
              setSeoMode={setSeoMode}
              seoIntensity={seoIntensity}
              setSeoIntensity={setSeoIntensity}
              abTestType={abTestType}
              setAbTestType={setAbTestType}
              targetLanguage={targetLanguage}
              setTargetLanguage={setTargetLanguage}
              aspectRatioGuidance={aspectRatioGuidance}
              setAspectRatioGuidance={setAspectRatioGuidance}
              selectedImageStyles={selectedImageStyles}
              toggleImageStyle={toggleImageStyle}
              selectedImageMoods={selectedImageMoods}
              toggleImageMood={toggleImageMood}
              negativeImagePrompt={negativeImagePrompt}
              setNegativeImagePrompt={setNegativeImagePrompt}
              includeCTAs={includeCTAs}
              setIncludeCTAs={setIncludeCTAs}
              videoLength={videoLength}
              setVideoLength={setVideoLength}
              customVideoLength={customVideoLength}
              setCustomVideoLength={setCustomVideoLength}
              generatedOutput={generatedOutput}
              displayedOutputItem={displayedOutputItem}
              isLoading={isLoading}
              error={error}
              copied={copied}
              abTestResults={abTestResults}
              showRefineOptions={showRefineOptions}
              setShowRefineOptions={setShowRefineOptions}
              showTextActionOptions={showTextActionOptions}
              setShowTextActionOptions={setShowTextActionOptions}
              history={history}
              viewingHistoryItemId={viewingHistoryItemId}
              apiKeyMissing={apiKeyMissing}
              isRecording={isRecording}
              currentPlaceholder={currentPlaceholder}
              currentContentTypeDetails={currentContentTypeDetails}
              isBatchSupported={isBatchSupported}
              isABTestSupported={isABTestSupported}
              showGuidedBuilder={showGuidedBuilder}
              setShowGuidedBuilder={setShowGuidedBuilder}
              isAiPersonaModalOpen={isAiPersonaModalOpen}
              setIsAiPersonaModalOpen={setIsAiPersonaModalOpen}
              onGenerate={handleGenerateContent}
              onOptimizePrompt={handleOptimizePrompt}
              onStartRecording={startRecording}
              onStopRecording={stopRecording}
              onShowPersonaModal={() => setIsAiPersonaModalOpen(true)}
              onShowCustomPersonaManager={() => setShowCustomPersonaManager(true)}
              onShowTemplateModal={() => setShowTemplateModal(true)}
              onCopyToClipboard={handleCopyToClipboard}
              onExportMarkdown={handleExportMarkdown}
              onRefine={handleRefine}
              onTextAction={handleTextAction}
              onViewHistoryItem={handleViewHistoryItem}
              onToggleFavorite={handleToggleFavorite}
              onPinToCanvas={handlePinToCanvas}
              onDeleteHistoryItem={handleDeleteHistoryItem}
              onUseHistoryItem={handleUseHistoryItem}
              onClearAppHistory={handleClearAppHistory}
              onUseAsCanvasBackground={handleUseAsCanvasBackground}
              onSendToCanvas={handleSendToCanvas}
              onAddToHistory={addHistoryItemToState}
              renderOutput={() => renderOutput()}
              isPremium={isPremium}
              onUpgrade={handleShowUpgrade}
              expandedIdeas={expandedIdeas}
              collapsedIdeas={collapsedIdeas}
              onRemoveExpandedIdea={handleRemoveExpandedIdea}
              onApplyPremiumTemplate={handleApplyPremiumTemplate}
              onApplyCustomPersona={handleApplyCustomPersona}
              onSetSEOConfig={handleSetSEOConfig}
              onSetAIBoost={handleSetAIBoost}
              onRegenerateText={handleRegenerateText}
              onRefineSelectedText={handleRefineSelectedText}
              onCustomAction={handleCustomAction}
              onRegenerateTextAsync={handleRegenerateTextAsync}
              onRefineSelectedTextAsync={handleRefineSelectedTextAsync}
              onCustomActionAsync={handleCustomActionAsync}
              selectedPremiumTemplate={selectedPremiumTemplate}
              selectedCustomPersona={selectedCustomPersona}
              premiumSEOConfig={premiumSEOConfig}
              aiBoostEnabled={aiBoostEnabled}
            />
          )}

          {(activeTab === "generator" || activeTab === "channelAnalysis") &&
            false && (
              <div style={{ display: "none" }}>
                {" "}
                {/* OLD GENERATOR CODE - HIDDEN */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="platform"
                        className="block text-sm font-medium text-sky-300 mb-1"
                      >
                        Platform
                      </label>
                      <select
                        id="platform"
                        value={platform}
                        onChange={(e) =>
                          setPlatform(e.target.value as Platform)
                        }
                        className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-sky-500 focus:border-sky-500 transition-shadow shadow-sm text-slate-100"
                      >
                        {PLATFORMS.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="contentType"
                        className="block text-sm font-medium text-sky-300 mb-1"
                      >
                        Content Type
                      </label>
                      <select
                        id="contentType"
                        value={contentType}
                        onChange={(e) => {
                          setContentType(e.target.value as ContentType);
                          setViewingHistoryItemId(null);
                          setIsABTesting(false);
                        }}
                        className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-sky-500 focus:border-sky-500 transition-shadow shadow-sm text-slate-100"
                      >
                        {USER_SELECTABLE_CONTENT_TYPES.map((ct) => (
                          <option key={ct.value} value={ct.value}>
                            {ct.label}
                          </option>
                        ))}
                      </select>
                      {currentContentTypeDetails?.description && (
                        <p className="text-xs text-slate-400 mt-1">
                          {currentContentTypeDetails.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="userInput"
                      className="block text-sm font-medium text-sky-300 mb-1 group"
                    >
                      {getContentTypeIcon(contentType)}
                      <span className="align-middle">
                        {" "}
                        {contentType === ContentType.ABTest
                          ? `Topic for A/B Testing ${AB_TESTABLE_CONTENT_TYPES_MAP.find((ab) => ab.value === abTestType)?.label || abTestType}`
                          : contentType === ContentType.Image
                            ? "Image Prompt"
                            : contentType === ContentType.ImagePrompt
                              ? "Core Concept for Image Prompt"
                              : contentType === ContentType.VoiceToScript
                                ? "Voice Input / Transcript"
                                : "Topic / Keywords / Details"}{" "}
                      </span>
                    </label>
                    <div className="relative">
                      <textarea
                        id="userInput"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder={currentPlaceholder}
                        rows={
                          contentType === ContentType.Image ||
                          contentType === ContentType.ImagePrompt
                            ? 3
                            : 5
                        }
                        className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-sky-500 focus:border-sky-500 transition-shadow shadow-sm text-slate-100 placeholder-slate-400 resize-y min-h-[80px]"
                      />
                      <button
                        onClick={() =>
                          handleTextAction(ContentType.OptimizePrompt)
                        }
                        title="Optimize this prompt with AI"
                        className="absolute bottom-2.5 right-2.5 px-2.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs rounded-md flex items-center shadow-sm hover:shadow-md transition-all border-0 outline-none"
                      >
                        <svg
                          className="w-3.5 h-3.5 mr-1.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                        Optimize Prompt
                      </button>
                    </div>
                    {contentType === ContentType.VoiceToScript && (
                      <div className="mt-2.5">
                        <button
                          onClick={isRecording ? stopRecording : startRecording}
                          className={`w-full flex items-center justify-center p-2.5 text-sm font-medium rounded-md transition-colors shadow-md hover:shadow-lg ${isRecording ? "bg-red-600 hover:bg-red-500" : "bg-green-600 hover:bg-green-500"} text-white`}
                          disabled={apiKeyMissing}
                        >
                          <MicrophoneIcon className="w-4 h-4 mr-2" />
                          {isRecording
                            ? "Stop Recording & Process"
                            : "Start Recording"}
                        </button>
                        {isRecording && (
                          <p className="text-xs text-sky-300 mt-1.5 text-center animate-pulse">
                            Recording...
                          </p>
                        )}
                      </div>
                    )}
                    {contentType === ContentType.ABTest && (
                      <div>
                        {" "}
                        <label
                          htmlFor="abTestTypeSelect"
                          className="block text-sm font-medium text-slate-300 mt-2 mb-1.5"
                        >
                          A/B Test Type
                        </label>{" "}
                        <select
                          id="abTestTypeSelect"
                          value={abTestType}
                          onChange={(e) =>
                            setAbTestType(
                              e.target.value as ABTestableContentType,
                            )
                          }
                          className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-sky-500 focus:border-sky-500 shadow-sm text-slate-100"
                        >
                          {" "}
                          <option value="">Select type...</option>{" "}
                          {AB_TESTABLE_CONTENT_TYPES_MAP.map((ab) => (
                            <option key={ab.value} value={ab.value}>
                              {ab.label}
                            </option>
                          ))}{" "}
                        </select>{" "}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                    className="text-sm text-sky-400 hover:text-sky-300 flex items-center"
                  >
                    {showAdvancedOptions ? (
                      <ChevronUpIcon className="h-4 w-4 mr-1" />
                    ) : (
                      <ChevronDownIcon className="h-4 w-4 mr-1" />
                    )}
                    Advanced Options
                  </button>

                  {showAdvancedOptions && (
                    <div className="space-y-4 p-4 bg-slate-700/50 rounded-lg border border-slate-600/50">
                      <div className="flex items-end space-x-2">
                        <div className="flex-grow">
                          <label
                            htmlFor="aiPersona"
                            className="block text-sm font-medium text-sky-300 mb-1"
                          >
                            AI Persona
                          </label>
                          <select
                            id="aiPersona"
                            value={selectedAiPersonaId}
                            onChange={(e) =>
                              setSelectedAiPersonaId(e.target.value)
                            }
                            className="w-full p-2.5 bg-slate-600 border border-slate-500 rounded-lg focus:ring-sky-500 focus:border-sky-500 text-slate-100 text-sm"
                          >
                            {allPersonas.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name} {p.isCustom ? "(Custom)" : ""}
                              </option>
                            ))}
                          </select>
                        </div>
                        <button
                          onClick={() => {
                            setEditingPersona(null);
                            setShowPersonaModal(true);
                          }}
                          className="p-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-sm"
                          title="Manage Personas"
                        >
                          <UserCircleIcon className="h-5 w-5" />
                        </button>
                      </div>
                      <div>
                        <label
                          htmlFor="targetAudience"
                          className="block text-sm font-medium text-sky-300 mb-1"
                        >
                          Target Audience (Optional)
                        </label>
                        <input
                          type="text"
                          id="targetAudience"
                          value={targetAudience}
                          onChange={(e) => setTargetAudience(e.target.value)}
                          placeholder="e.g., Gen Z gamers, busy moms"
                          className="w-full p-2.5 bg-slate-600 border border-slate-500 rounded-lg focus:ring-sky-500 focus:border-sky-500 text-slate-100 placeholder-slate-400 text-sm"
                        />
                      </div>

                      {/* Course-Specific Options */}
                      {contentType === ContentType.CourseEducationalContent && (
                        <div className="space-y-4 p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xl">🎓</span>
                            <h3 className="text-cyan-300 font-semibold">
                              Online Course Structure
                            </h3>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-300 mb-2">
                                Number of Modules
                              </label>
                              <select
                                value={courseModules}
                                onChange={(e) =>
                                  setCourseModules(parseInt(e.target.value))
                                }
                                className="w-full p-2.5 bg-slate-600 border border-slate-500 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 text-slate-100 text-sm"
                              >
                                <option value={3}>3 Modules</option>
                                <option value={5}>5 Modules</option>
                                <option value={7}>7 Modules</option>
                                <option value={10}>10 Modules</option>
                                <option value={12}>12 Modules</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-slate-300 mb-2">
                                Course Duration
                              </label>
                              <select
                                value={courseDuration}
                                onChange={(e) =>
                                  setCourseDuration(e.target.value)
                                }
                                className="w-full p-2.5 bg-slate-600 border border-slate-500 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 text-slate-100 text-sm"
                              >
                                <option value="2-3 weeks">2-3 weeks</option>
                                <option value="4-6 weeks">4-6 weeks</option>
                                <option value="8-10 weeks">8-10 weeks</option>
                                <option value="3-4 months">3-4 months</option>
                                <option value="6+ months">6+ months</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-slate-300 mb-2">
                                Difficulty Level
                              </label>
                              <select
                                value={courseDifficulty}
                                onChange={(e) =>
                                  setCourseDifficulty(e.target.value)
                                }
                                className="w-full p-2.5 bg-slate-600 border border-slate-500 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 text-slate-100 text-sm"
                              >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">
                                  Intermediate
                                </option>
                                <option value="Advanced">Advanced</option>
                                <option value="All Levels">All Levels</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-slate-300 mb-2">
                                Include Assessments
                              </label>
                              <select
                                value={includeAssessments ? "yes" : "no"}
                                onChange={(e) =>
                                  setIncludeAssessments(
                                    e.target.value === "yes",
                                  )
                                }
                                className="w-full p-2.5 bg-slate-600 border border-slate-500 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 text-slate-100 text-sm"
                              >
                                <option value="yes">
                                  Yes, include quizzes & assignments
                                </option>
                                <option value="no">No, content only</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                              Course Objectives (Optional)
                            </label>
                            <textarea
                              value={courseObjectives}
                              onChange={(e) =>
                                setCourseObjectives(e.target.value)
                              }
                              placeholder="What will students be able to do after completing this course? (e.g., Build their own website, Master advanced photography techniques)"
                              className="w-full p-3 bg-slate-600 border border-slate-500 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 text-slate-100 placeholder-slate-400 text-sm resize-none"
                              rows={3}
                            />
                          </div>
                        </div>
                      )}
                      {isBatchSupported &&
                        contentType !== ContentType.ABTest && (
                          <div>
                            <label
                              htmlFor="batchVariations"
                              className="block text-sm font-medium text-sky-300 mb-1"
                            >
                              Number of Variations
                            </label>
                            <input
                              type="number"
                              id="batchVariations"
                              value={batchVariations}
                              onChange={(e) =>
                                setBatchVariations(
                                  Math.max(1, parseInt(e.target.value)),
                                )
                              }
                              min="1"
                              max="5"
                              className="w-full p-2.5 bg-slate-600 border border-slate-500 rounded-lg focus:ring-sky-500 focus:border-sky-500 text-slate-100 text-sm"
                            />
                          </div>
                        )}
                      {(contentType === ContentType.Image ||
                        contentType === ContentType.ImagePrompt) && (
                        <>
                          <div>
                            {" "}
                            <label className="block text-xs font-medium text-slate-400 mb-1">
                              <ViewfinderCircleIcon className="w-4 h-4 mr-1.5 inline text-slate-500" />
                              Aspect Ratio Guidance
                            </label>{" "}
                            <select
                              value={aspectRatioGuidance}
                              onChange={(e) =>
                                setAspectRatioGuidance(
                                  e.target.value as AspectRatioGuidance,
                                )
                              }
                              className="w-full p-2.5 text-sm bg-slate-600/70 border-slate-500/80 rounded-md focus:ring-1 focus:ring-sky-500 focus:border-sky-500 placeholder-slate-400 text-slate-200"
                            >
                              {" "}
                              {ASPECT_RATIO_GUIDANCE_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}{" "}
                            </select>
                          </div>
                          <div>
                            {" "}
                            <label className="block text-xs font-medium text-slate-400 mb-1.5">
                              Image Styles (Optional)
                            </label>{" "}
                            <div className="flex flex-wrap gap-2">
                              {" "}
                              {IMAGE_PROMPT_STYLES.map((style) => (
                                <button
                                  key={style}
                                  type="button"
                                  onClick={() => toggleImageStyle(style)}
                                  className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${selectedImageStyles.includes(style) ? "bg-sky-600 border-sky-500 text-white shadow-sm" : "bg-slate-600/70 border-slate-500/80 hover:bg-slate-500/70"}`}
                                >
                                  {style}
                                </button>
                              ))}{" "}
                            </div>{" "}
                          </div>
                          <div>
                            {" "}
                            <label className="block text-xs font-medium text-slate-400 mb-1.5">
                              Image Moods (Optional)
                            </label>{" "}
                            <div className="flex flex-wrap gap-2">
                              {" "}
                              {IMAGE_PROMPT_MOODS.map((mood) => (
                                <button
                                  key={mood}
                                  type="button"
                                  onClick={() => toggleImageMood(mood)}
                                  className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${selectedImageMoods.includes(mood) ? "bg-sky-600 border-sky-500 text-white shadow-sm" : "bg-slate-600/70 border-slate-500/80 hover:bg-slate-500/70"}`}
                                >
                                  {mood}
                                </button>
                              ))}{" "}
                            </div>{" "}
                          </div>
                          <div>
                            {" "}
                            <label
                              htmlFor="negativeImagePrompt"
                              className="block text-xs font-medium text-slate-400 mb-1"
                            >
                              Negative Prompt (for Images)
                            </label>{" "}
                            <input
                              type="text"
                              id="negativeImagePrompt"
                              value={negativeImagePrompt}
                              onChange={(e) =>
                                setNegativeImagePrompt(e.target.value)
                              }
                              placeholder="e.g., no text, blurry, disfigured"
                              className="w-full p-2.5 text-sm bg-slate-600/70 border-slate-500/80 rounded-md focus:ring-1 focus:ring-sky-500 focus:border-sky-500 placeholder-slate-400 text-slate-200"
                            />{" "}
                          </div>
                        </>
                      )}
                      {isSeoKeywordsSupported && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            {" "}
                            <label
                              htmlFor="seoKeywords"
                              className="block text-sm font-medium text-sky-300 mb-1"
                            >
                              SEO Keywords (Optional)
                            </label>{" "}
                            <input
                              type="text"
                              id="seoKeywords"
                              value={seoKeywords}
                              onChange={(e) => setSeoKeywords(e.target.value)}
                              placeholder="e.g., healthy recipes, travel tips"
                              className="w-full p-2.5 bg-slate-600 border border-slate-500 rounded-lg text-slate-100 placeholder-slate-400 text-sm"
                            />{" "}
                          </div>
                          <div>
                            {" "}
                            <label
                              htmlFor="seoMode"
                              className="block text-sm font-medium text-sky-300 mb-1"
                            >
                              SEO Mode
                            </label>{" "}
                            <select
                              id="seoMode"
                              value={seoMode}
                              onChange={(e) =>
                                setSeoMode(e.target.value as SeoKeywordMode)
                              }
                              className="w-full p-2.5 bg-slate-600 border border-slate-500 rounded-lg text-slate-100 text-sm"
                            >
                              {" "}
                              <option value={SeoKeywordMode.Incorporate}>
                                Incorporate Keywords
                              </option>{" "}
                              <option value={SeoKeywordMode.Suggest}>
                                Suggest Keywords (Action)
                              </option>{" "}
                            </select>{" "}
                          </div>
                          {seoMode === SeoKeywordMode.Incorporate && (
                            <div className="w-full sm:w-1/2 lg:w-1/3">
                              <label
                                htmlFor="seoIntensity"
                                className="block text-sm font-medium text-sky-300 mb-1"
                              >
                                SEO Intensity
                              </label>
                              <select
                                id="seoIntensity"
                                value={seoIntensity}
                                onChange={(e) =>
                                  setSeoIntensity(e.target.value as SeoIntensity)
                                }
                                className="w-full p-2.5 bg-slate-600 border border-slate-500 rounded-lg text-slate-100 text-sm"
                              >
                                <option value={SeoIntensity.Natural}>
                                  Natural - Light integration
                                </option>
                                <option value={SeoIntensity.Moderate}>
                                  Moderate - Balanced optimization
                                </option>
                                <option value={SeoIntensity.Aggressive}>
                                  Aggressive - Maximum SEO
                                </option>
                              </select>
                            </div>
                          )}
                        </div>
                      )}
                      {contentType === ContentType.Script && (
                        <div className="flex items-center">
                          {" "}
                          <input
                            type="checkbox"
                            id="includeCTAs"
                            checked={includeCTAs}
                            onChange={(e) => setIncludeCTAs(e.target.checked)}
                            className="h-4 w-4 text-sky-600 bg-slate-600 border-slate-500 rounded focus:ring-sky-500"
                          />{" "}
                          <label
                            htmlFor="includeCTAs"
                            className="ml-2 text-sm text-slate-300"
                          >
                            Include Call-to-Actions (CTAs)?
                          </label>{" "}
                        </div>
                      )}
                      {TRANSLATE_ADAPT_SUPPORTED_TYPES.includes(
                        contentType,
                      ) && (
                        <div>
                          {" "}
                          <label
                            htmlFor="targetLanguageGenerator"
                            className="block text-sm font-medium text-sky-300 mb-1"
                          >
                            Target Language (for generation)
                          </label>{" "}
                          <select
                            id="targetLanguageGenerator"
                            value={targetLanguage}
                            onChange={(e) =>
                              setTargetLanguage(e.target.value as Language)
                            }
                            className="w-full p-2.5 bg-slate-600 border border-slate-500 rounded-lg text-slate-100 text-sm"
                          >
                            {" "}
                            {SUPPORTED_LANGUAGES.map((lang) => (
                              <option key={lang.value} value={lang.value}>
                                {lang.label}
                              </option>
                            ))}{" "}
                          </select>{" "}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-3 items-center">
                  <button
                    type="button"
                    onClick={handleGenerateContent}
                    disabled={
                      isLoading ||
                      apiKeyMissing ||
                      (activeTab === "generator" &&
                        !userInput.trim() &&
                        ![
                          ContentType.ImagePrompt,
                          ContentType.TrendAnalysis,
                          ContentType.ContentGapFinder,
                          ContentType.VoiceToScript,
                        ].includes(contentType))
                    }
                    className="px-6 py-3 bg-gradient-to-r from-sky-500 to-purple-500 hover:from-sky-600 hover:to-purple-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <GeneratorIcon className="h-5 w-5" />
                    <span>
                      {isGenerating && generationSourceTab === "generator"
                        ? "Generating..."
                        : contentType === ContentType.ABTest &&
                            isABTesting &&
                            abTestType
                          ? `Generate A/B Test for ${abTestType}`
                          : "Generate Content"}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentTemplate(null);
                      setShowTemplateModal(true);
                    }}
                    className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-slate-200 rounded-lg text-sm flex items-center space-x-2"
                  >
                    <SaveIcon className="h-4 w-4" />
                    <span>Templates</span>
                  </button>
                </div>
                {error && (
                  <div className="mt-3 p-3 bg-red-500/20 border border-red-700 text-red-300 rounded-lg text-sm animate-shake">
                    {error}
                  </div>
                )}
                <div
                  ref={outputContainerRef}
                  className="flex-grow bg-slate-900/60 p-5 rounded-xl shadow-inner min-h-[200px] border border-slate-700/50 relative"
                >
                  {isLoading && !generatedOutput && (
                    <div className="flex flex-col items-center justify-center h-full">
                      <LoadingSpinner />
                      <p className="mt-3 text-sky-300 animate-pulse">
                        AI is thinking...
                      </p>
                    </div>
                  )}
                  {renderOutput()}
                  {!isLoading &&
                    contentType === ContentType.ABTest &&
                    abTestResults && (
                      <div className="mt-6 space-y-4">
                        <h3 className="text-xl font-semibold text-sky-300 border-b border-slate-700 pb-2 mb-3">
                          A/B Test Variations (
                          {AB_TESTABLE_CONTENT_TYPES_MAP.find(
                            (ab) => ab.value === abTestType,
                          )?.label || abTestType}
                          )
                        </h3>
                        {abTestResults.map((result, index) => (
                          <div
                            key={`shape-variant-${index}-${Date.now()}`}
                            className="p-4 bg-slate-700/70 rounded-lg border border-slate-600/60 shadow-md"
                          >
                            <h4 className="font-semibold text-sky-400 text-md mb-1.5">
                              Variation {index + 1}
                            </h4>
                            {result.variation.type === "text" && (
                              <p className="text-sm text-slate-200 whitespace-pre-wrap my-1.5 bg-slate-600/50 p-2.5 rounded">
                                {
                                  (result.variation as GeneratedTextOutput)
                                    .content
                                }
                              </p>
                            )}
                            {result.variation.type === "thumbnail_concept" && (
                              <div className="text-sm text-slate-200 my-1.5 space-y-1">
                                <p>
                                  <strong>Image Prompt:</strong>{" "}
                                  <span className="text-slate-300">
                                    {
                                      (
                                        result.variation as ThumbnailConceptOutput
                                      ).imagePrompt
                                    }
                                  </span>
                                </p>
                                <p>
                                  <strong>Text Overlays:</strong>{" "}
                                  <span className="text-slate-300">
                                    {(
                                      result.variation as ThumbnailConceptOutput
                                    ).textOverlays.join(" / ")}
                                  </span>
                                </p>
                              </div>
                            )}
                            <p className="text-xs italic text-slate-400 mt-2.5">
                              <strong>Rationale:</strong> {result.rationale}
                            </p>
                            <button
                              type="button"
                              onClick={() =>
                                handleCopyToClipboard(
                                  result.variation.type === "text"
                                    ? (result.variation as GeneratedTextOutput)
                                        .content
                                    : JSON.stringify(result.variation, null, 2),
                                )
                              }
                              className="text-xs px-2.5 py-1 mt-3 bg-sky-700 hover:bg-sky-600 text-white rounded-md shadow-sm flex items-center"
                            >
                              <ClipboardIcon className="w-3 h-3 mr-1.5 inline" />{" "}
                              {copied ? "Copied Variation!" : "Copy Variation"}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
                {displayedOutputItem && !isLoading && (
                  <div className="flex flex-wrap gap-3 items-center pt-4 border-t border-slate-700">
                    {/* Rating Buttons */}
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-400">Rate this:</span>
                      <RatingButtons
                        rating={displayedOutputItem.rating || 0}
                        onRating={(rating) => {
                          const outputText = displayedOutputItem.output && typeof displayedOutputItem.output === 'object' && 'content' in displayedOutputItem.output
                            ? displayedOutputItem.output.content
                            : JSON.stringify(displayedOutputItem.output);
                          handleRateCurrentContentWithFirebase(rating, outputText);
                        }}
                        size="sm"
                        showTooltip={true}
                      />
                    </div>

                    <button
                      onClick={() => handleCopyToClipboard()}
                      className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs rounded-md flex items-center space-x-1.5"
                      title="Copy output text"
                    >
                      <ClipboardIcon className="h-4 w-4" />
                      <span>{copied ? "Copied!" : "Copy"}</span>
                    </button>
                    {displayedOutputItem.output && (
                      <button
                        onClick={() =>
                          exportContentAsMarkdown(
                            displayedOutputItem.output!,
                            displayedOutputItem.userInput,
                          )
                        }
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-md flex items-center space-x-1.5"
                        title="Export as Markdown"
                      >
                        <DownloadIcon className="h-4 w-4" />
                        <span>.MD</span>
                      </button>
                    )}
                    {isTextActionSupported && (
                      <>
                        <div className="relative inline-block">
                          <button
                            onClick={() =>
                              setShowRefineOptions(!showRefineOptions)
                            }
                            className="px-3 py-1.5 bg-slate-600 hover:bg-slate-500 text-slate-200 text-xs rounded-md flex items-center space-x-1.5"
                            aria-haspopup="true"
                            aria-expanded={showRefineOptions}
                          >
                            <WandIcon className="h-4 w-4" />
                            <span>Refine</span>
                            <ChevronDownIcon
                              className={`h-3 w-3 ml-1 transition-transform ${showRefineOptions ? "rotate-180" : ""}`}
                            />
                          </button>
                          {showRefineOptions && (
                            <div className="absolute bottom-full left-0 mb-2 w-48 bg-slate-700 rounded-md shadow-lg py-1 z-10 border border-slate-600">
                              {Object.values(RefinementType).map((rt) => (
                                <button
                                  key={rt}
                                  onClick={() => handleRefine(rt)}
                                  className="block w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-sky-600"
                                >
                                  {rt}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="relative inline-block">
                          <button
                            onClick={() =>
                              setShowTextActionOptions(!showTextActionOptions)
                            }
                            className="px-3 py-1.5 bg-slate-600 hover:bg-slate-500 text-slate-200 text-xs rounded-md flex items-center space-x-1.5"
                            aria-haspopup="true"
                            aria-expanded={showTextActionOptions}
                          >
                            <GeneratorIcon className="h-4 w-4" />
                            <span>Actions</span>
                            <ChevronDownIcon
                              className={`h-3 w-3 ml-1 transition-transform ${showTextActionOptions ? "rotate-180" : ""}`}
                            />
                          </button>
                          {showTextActionOptions && (
                            <div className="absolute bottom-full left-0 mb-2 w-56 bg-slate-700 rounded-md shadow-lg py-1 z-10 border border-slate-600">
                              {TEXT_ACTION_SUPPORTED_TYPES.filter((action) => {
                                if (action === ContentType.Hashtags)
                                  return HASHTAG_GENERATION_SUPPORTED_TYPES.includes(
                                    displayedOutputItem.contentType,
                                  );
                                if (action === ContentType.Snippets)
                                  return SNIPPET_EXTRACTION_SUPPORTED_TYPES.includes(
                                    displayedOutputItem.contentType,
                                  );
                                if (action === ContentType.RepurposedContent)
                                  return REPURPOSING_SUPPORTED_TYPES.includes(
                                    displayedOutputItem.contentType,
                                  );
                                if (action === ContentType.VisualStoryboard)
                                  return VISUAL_STORYBOARD_SUPPORTED_TYPES.includes(
                                    displayedOutputItem.contentType,
                                  );
                                if (action === ContentType.ExplainOutput)
                                  return EXPLAIN_OUTPUT_SUPPORTED_TYPES.includes(
                                    displayedOutputItem.contentType,
                                  );
                                if (action === ContentType.FollowUpIdeas)
                                  return FOLLOW_UP_IDEAS_SUPPORTED_TYPES.includes(
                                    displayedOutputItem.contentType,
                                  );
                                if (action === ContentType.SeoKeywords)
                                  return SEO_KEYWORD_SUGGESTION_SUPPORTED_TYPES.includes(
                                    displayedOutputItem.contentType,
                                  );
                                if (
                                  action === ContentType.MultiPlatformSnippets
                                )
                                  return MULTI_PLATFORM_REPURPOSING_SUPPORTED_TYPES.includes(
                                    displayedOutputItem.contentType,
                                  );
                                if (action === ContentType.YouTubeDescription)
                                  return YOUTUBE_DESCRIPTION_OPTIMIZER_SUPPORTED_TYPES.includes(
                                    displayedOutputItem.contentType,
                                  );
                                if (action === ContentType.TranslateAdapt)
                                  return TRANSLATE_ADAPT_SUPPORTED_TYPES.includes(
                                    displayedOutputItem.contentType,
                                  );
                                if (action === ContentType.CheckReadability)
                                  return READABILITY_CHECK_SUPPORTED_TYPES.includes(
                                    displayedOutputItem.contentType,
                                  );
                                if (action === ContentType.EngagementFeedback)
                                  return ENGAGEMENT_FEEDBACK_SUPPORTED_TYPES.includes(
                                    displayedOutputItem.contentType,
                                  );
                                return true;
                              }).map((actionType) => (
                                <button
                                  key={actionType}
                                  onClick={() => handleTextAction(actionType)}
                                  className="block w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-sky-600"
                                >
                                  {CONTENT_TYPES.find(
                                    (ct) => ct.value === actionType,
                                  )?.label || actionType}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

          {activeTab === "canvas" && (
            <section className="flex-grow h-[calc(100vh-80px)] flex flex-col bg-slate-800/80 backdrop-blur-lg shadow-2xl overflow-hidden border-0">

              <div className="p-2.5 border-b border-slate-700/80 flex items-center justify-between space-x-1 sm:space-x-2 flex-wrap bg-slate-800/50 shadow-sm">
                <div className="flex items-center space-x-1 sm:space-x-2 flex-wrap min-w-0">
                  <ToolbarButton
                    title="Undo"
                    icon={<RotateCcwIcon className="w-4 h-4" />}
                    onClick={handleUndoCanvas}
                    disabled={!canUndo}
                  >
                    Undo
                  </ToolbarButton>
                  <ToolbarButton
                    title="Redo"
                    icon={<RefreshCwIcon className="w-4 h-4 scale-x-[-1]" />}
                    onClick={handleRedoCanvas}
                    disabled={!canRedo}
                  >
                    Redo
                  </ToolbarButton>
                  <div className="h-7 border-l border-slate-600/70 mx-1 sm:mx-2 self-center"></div>
                  <ToolbarButton
                    title="Save Snapshot"
                    icon={<SaveIcon className="w-4 h-4" />}
                    onClick={handleSaveSnapshot}
                  >
                    Snapshot
                  </ToolbarButton>
                  <ToolbarButton
                    title="Manage Snapshots"
                    icon={<ListChecksIcon className="w-4 h-4" />}
                    onClick={() => setShowSnapshotModal(true)}
                  >
                    Manage
                  </ToolbarButton>
                  <div className="h-7 border-l border-slate-600/70 mx-1 sm:mx-2 self-center"></div>
                  <div className="flex items-center">
                    <ToolbarButton
                      title="Add Sticky Note"
                      icon={<StickyNoteIcon className="w-4 h-4" />}
                      onClick={() => {
                        console.log('�� Sticky Note Button Clicked!');
                        handleAddCanvasItem("stickyNote");
                      }}
                    >
                      Sticky
                    </ToolbarButton>
                    <div className="flex items-center space-x-1.5 ml-2">
                      {TOOLBAR_STICKY_NOTE_PICKER_COLORS.map((color, index) => (
                        <button
                          key={color.name}
                          title={color.name}
                          onClick={() => setSelectedStickyColorIndex(index)}
                          className={`w-5 h-5 rounded-md border-2 transition-all ${selectedStickyColorIndex === index ? `ring-2 ${color.selectedRing} ring-offset-1 ring-offset-slate-800 scale-110` : "border-transparent hover:border-slate-400"}`}
                          style={{ backgroundColor: color.bgColor }}
                          aria-pressed={selectedStickyColorIndex === index}
                          aria-label={`Select ${color.name} sticky note color`}
                        />
                      ))}
                    </div>
                  </div>
                  <ToolbarButton
                    title="Add Text Element"
                    icon={<TextToolIcon className="w-4 h-4" />}
                    onClick={() => handleAddCanvasItem("textElement")}
                  >
                    Text
                  </ToolbarButton>
                  <div className="relative" ref={shapeDropdownRef}>
                    <ToolbarButton
                      id="shape-tool-button"
                      title="Add Shape"
                      icon={<ShapeToolIcon className="w-4 h-4" />}
                      onClick={() => setShowShapeDropdown((prev) => !prev)}
                      className="pr-1.5"
                      aria-haspopup="true"
                      aria-expanded={showShapeDropdown}
                    >
                      {" "}
                      Shape{" "}
                      <ChevronDownIcon
                        className={`w-3.5 h-3.5 ml-1 transition-transform ${showShapeDropdown ? "rotate-180" : ""}`}
                      />{" "}
                    </ToolbarButton>
                    {showShapeDropdown && (
                      <div
                        className="absolute top-full left-0 mt-1.5 w-64 bg-slate-700/95 backdrop-blur-lg border border-slate-600 rounded-lg shadow-2xl z-20 py-2 max-h-96 overflow-y-auto"
                        role="menu"
                      >
                        <div className="px-3 py-2 border-b border-slate-600 mb-2">
                          <h3 className="text-xs font-semibold bg-gradient-to-r from-sky-400 to-purple-400 bg-clip-text text-transparent uppercase tracking-wide">
                            Premium Shapes
                          </h3>
                          <p className="text-xs text-slate-400 mt-1">
                            {CANVAS_SHAPE_VARIANTS.length}+ professional shapes
                          </p>
                        </div>

                        {/* Quick Shapes */}
                        <div className="px-2 mb-3">
                          <h4 className="text-xs font-medium text-slate-300 px-2 mb-2">
                            Quick Access
                          </h4>
                          <div className="grid grid-cols-4 gap-1">
                            {CANVAS_SHAPE_VARIANTS.slice(0, 8).map((shape) => (
                              <button
                                key={shape.value}
                                onClick={() => {
                                  handleAddCanvasItem("shapeElement", {
                                    shapeVariant: shape.value,
                                  });
                                  setShowShapeDropdown(false);
                                }}
                                className="group p-3 bg-slate-800/50 hover:bg-gradient-to-r hover:from-sky-600/20 hover:to-purple-600/20 border border-slate-600/50 hover:border-sky-400/50 rounded-lg flex flex-col items-center transition-all duration-200 hover:scale-105 hover:shadow-lg"
                                role="menuitem"
                                title={shape.label}
                              >
                                <span className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200">
                                  {shape.icon}
                                </span>
                                <span className="text-xs text-slate-300 group-hover:text-white truncate w-full text-center font-medium">
                                  {shape.label.split(" ")[0]}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* All Shapes by Category */}
                        {Object.entries(
                          CANVAS_SHAPE_VARIANTS.reduce(
                            (acc, shape) => {
                              const category = shape.category || "Other";
                              if (!acc[category]) acc[category] = [];
                              acc[category].push(shape);
                              return acc;
                            },
                            {} as Record<string, typeof CANVAS_SHAPE_VARIANTS>,
                          ),
                        )
                          .slice(0, 3)
                          .map(([category, shapes]) => (
                            <div key={category} className="px-2 mb-2">
                              <h4 className="text-xs font-medium text-slate-300 px-2 mb-1">
                                {category}
                              </h4>
                              {shapes.slice(0, 6).map((shape) => (
                                <button
                                  key={shape.value}
                                  onClick={() => {
                                    handleAddCanvasItem("shapeElement", {
                                      shapeVariant: shape.value,
                                    });
                                    setShowShapeDropdown(false);
                                  }}
                                  className="group w-full text-left px-3 py-2.5 text-sm bg-slate-800/30 hover:bg-gradient-to-r hover:from-sky-600/10 hover:to-purple-600/10 border border-slate-700/50 hover:border-sky-400/30 text-slate-200 hover:text-white flex items-center transition-all duration-200 rounded-lg mb-1"
                                  role="menuitem"
                                >
                                  <span className="mr-3 text-lg group-hover:scale-110 transition-transform duration-200">
                                    {shape.icon}
                                  </span>
                                  <span className="font-medium">
                                    {shape.label}
                                  </span>
                                </button>
                              ))}
                            </div>
                          ))}

                        {/* View All Button */}
                        <div className="px-2 pt-2 border-t border-slate-600">
                          <button
                            onClick={() => {
                              setShowShapeDropdown(false);
                              // Could open a full shape library modal here
                            }}
                            className="w-full px-3 py-2 text-xs text-center bg-gradient-to-r from-sky-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 text-white rounded-md transition-all font-medium"
                          >
                            ������ Browse All {CANVAS_SHAPE_VARIANTS.length} Shapes
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    <ToolbarButton
                      title="Add Mind Map Node (Click) or Templates (Long Press)"
                      icon={<MindMapIcon className="w-4 h-4" />}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        setShowMindMapTemplates(!showMindMapTemplates);
                      }}
                      onClick={() => {
                        const mindMapNodes = canvasItems.filter(
                          (item) => item.type === "mindMapNode",
                        );
                        if (mindMapNodes.length === 0) {
                          // Create central node
                          handleAddCanvasItem("mindMapNode");
                        } else {
                          // Create connected branch node
                          const lastNode =
                            mindMapNodes[mindMapNodes.length - 1];
                          const angle = Math.random() * Math.PI * 2;
                          const distance = 180;
                          const newX = lastNode.x + Math.cos(angle) * distance;
                          const newY = lastNode.y + Math.sin(angle) * distance;

                          // Add new node
                          const newId = `canvas-item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                          const newNode = {
                            id: newId,
                            type: "mindMapNode" as const,
                            x: newX,
                            y: newY,
                            width: 100,
                            height: 50,
                            zIndex: nextZIndex,
                            content: "New Idea",
                            backgroundColor: "#10B981",
                            textColor: "#FFFFFF",
                            borderWidth: "2px",
                            borderStyle: "solid" as const,
                            borderColor: "#059669",
                            mindMapNodeType: "branch" as const,
                            mindMapLevel: (lastNode.mindMapLevel || 1) + 1,
                            mindMapIcon: "����������",
                            mindMapShape: "ellipse" as const,
                            mindMapTheme: lastNode.mindMapTheme || "business",
                            mindMapConnections: [],
                            mindMapConnectionStyle: "curved" as const,
                            mindMapConnectionColor: "#6B7280",
                            mindMapConnectionThickness: 2,
                            mindMapShadow: true,
                            mindMapGradient: {
                              enabled: true,
                              from: "#10B981",
                              to: "#34D399",
                              direction: "diagonal" as const,
                            },
                            mindMapAnimation: "glow" as const,
                            mindMapPriority: "medium" as const,
                            mindMapTags: [],
                            mindMapProgress: 0,
                            mindMapNotes: "",
                            mindMapAttachments: [],
                          };

                          setCanvasItems([...canvasItems, newNode]);
                          setNextZIndex(nextZIndex + 1);

                          // Auto-connect to the last node
                          const updatedLastNode = {
                            ...lastNode,
                            mindMapConnections: [
                              ...(lastNode.mindMapConnections || []),
                              newId,
                            ],
                          };
                          setCanvasItems((prev) =>
                            prev.map((item) =>
                              item.id === lastNode.id ? updatedLastNode : item,
                            ),
                          );
                        }
                      }}
                    >
                      Mind Map
                    </ToolbarButton>

                    {/* Mind Map Templates Dropdown */}
                    {showMindMapTemplates && (
                      <div className="absolute top-full left-0 mt-1.5 w-72 bg-slate-700/95 backdrop-blur-lg border border-slate-600 rounded-lg shadow-2xl z-20 py-2">
                        <div className="px-3 py-2 border-b border-slate-600 mb-2">
                          <h3 className="text-xs font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent uppercase tracking-wide">
                            Premium Mind Map Templates
                          </h3>
                          <p className="text-xs text-slate-400 mt-1">
                            Professional layouts for instant productivity
                          </p>
                        </div>

                        <div className="px-2 space-y-1">
                          {[
                            {
                              name: "�������� Project Planning",
                              description: "Goals, tasks, timeline, resources",
                              nodes: [
                                {
                                  content: "Project Goal",
                                  type: "central",
                                  x: 0,
                                  y: 0,
                                },
                                {
                                  content: "Phase 1",
                                  type: "main",
                                  x: -150,
                                  y: -80,
                                },
                                {
                                  content: "Phase 2",
                                  type: "main",
                                  x: 0,
                                  y: -120,
                                },
                                {
                                  content: "Phase 3",
                                  type: "main",
                                  x: 150,
                                  y: -80,
                                },
                                {
                                  content: "Resources",
                                  type: "branch",
                                  x: -80,
                                  y: 100,
                                },
                                {
                                  content: "Timeline",
                                  type: "branch",
                                  x: 80,
                                  y: 100,
                                },
                              ],
                            },
                            {
                              name: "��� Brainstorming",
                              description: "Creative idea generation structure",
                              nodes: [
                                {
                                  content: "Main Topic",
                                  type: "central",
                                  x: 0,
                                  y: 0,
                                },
                                {
                                  content: "Idea 1",
                                  type: "main",
                                  x: -120,
                                  y: -100,
                                },
                                {
                                  content: "Idea 2",
                                  type: "main",
                                  x: 120,
                                  y: -100,
                                },
                                {
                                  content: "Idea 3",
                                  type: "main",
                                  x: -120,
                                  y: 100,
                                },
                                {
                                  content: "Idea 4",
                                  type: "main",
                                  x: 120,
                                  y: 100,
                                },
                              ],
                            },
                            {
                              name: "��� Business Strategy",
                              description:
                                "SWOT analysis and strategic planning",
                              nodes: [
                                {
                                  content: "Business Strategy",
                                  type: "central",
                                  x: 0,
                                  y: 0,
                                },
                                {
                                  content: "Strengths",
                                  type: "main",
                                  x: -150,
                                  y: -80,
                                },
                                {
                                  content: "Weaknesses",
                                  type: "main",
                                  x: 150,
                                  y: -80,
                                },
                                {
                                  content: "Opportunities",
                                  type: "main",
                                  x: -150,
                                  y: 80,
                                },
                                {
                                  content: "Threats",
                                  type: "main",
                                  x: 150,
                                  y: 80,
                                },
                              ],
                            },
                            {
                              name: "�������� Learning Path",
                              description: "Educational curriculum structure",
                              nodes: [
                                {
                                  content: "Subject",
                                  type: "central",
                                  x: 0,
                                  y: 0,
                                },
                                {
                                  content: "Basics",
                                  type: "main",
                                  x: -100,
                                  y: -120,
                                },
                                {
                                  content: "Intermediate",
                                  type: "main",
                                  x: 0,
                                  y: -150,
                                },
                                {
                                  content: "Advanced",
                                  type: "main",
                                  x: 100,
                                  y: -120,
                                },
                                {
                                  content: "Practice",
                                  type: "branch",
                                  x: -80,
                                  y: 120,
                                },
                                {
                                  content: "Projects",
                                  type: "branch",
                                  x: 80,
                                  y: 120,
                                },
                              ],
                            },
                          ].map((template, index) => (
                            <button
                              key={`mindmap-template-${template.name}-${index}`}
                              onClick={() => {
                                // Clear existing mind map nodes
                                const nonMindMapItems = canvasItems.filter(
                                  (item) => item.type !== "mindMapNode",
                                );

                                // Create template nodes
                                const templateNodes = template.nodes.map(
                                  (node, nodeIndex) => ({
                                    id: `mindmap-${Date.now()}-${nodeIndex}`,
                                    type: "mindMapNode" as const,
                                    x: 400 + node.x, // Center in canvas
                                    y: 300 + node.y,
                                    width:
                                      node.type === "central"
                                        ? 160
                                        : node.type === "main"
                                          ? 120
                                          : 100,
                                    height:
                                      node.type === "central"
                                        ? 80
                                        : node.type === "main"
                                          ? 60
                                          : 50,
                                    zIndex: nextZIndex + nodeIndex,
                                    content: node.content,
                                    backgroundColor:
                                      node.type === "central"
                                        ? "#7C3AED"
                                        : node.type === "main"
                                          ? "#3B82F6"
                                          : "#10B981",
                                    textColor: "#FFFFFF",
                                    borderWidth: "3px",
                                    borderStyle: "solid" as const,
                                    borderColor:
                                      node.type === "central"
                                        ? "#5B21B6"
                                        : node.type === "main"
                                          ? "#1D4ED8"
                                          : "#059669",
                                    mindMapNodeType: node.type as any,
                                    mindMapLevel:
                                      node.type === "central"
                                        ? 0
                                        : node.type === "main"
                                          ? 1
                                          : 2,
                                    mindMapIcon:
                                      node.type === "central"
                                        ? "���"
                                        : node.type === "main"
                                          ? "��������"
                                          : "�����",
                                    mindMapShape:
                                      node.type === "central"
                                        ? ("circle" as const)
                                        : ("ellipse" as const),
                                    mindMapTheme: "business" as const,
                                    mindMapConnections: [],
                                    mindMapConnectionStyle: "curved" as const,
                                    mindMapConnectionColor: "#6B7280",
                                    mindMapConnectionThickness: 2,
                                    mindMapShadow: true,
                                    mindMapGradient: {
                                      enabled: true,
                                      from:
                                        node.type === "central"
                                          ? "#7C3AED"
                                          : node.type === "main"
                                            ? "#3B82F6"
                                            : "#10B981",
                                      to:
                                        node.type === "central"
                                          ? "#A855F7"
                                          : node.type === "main"
                                            ? "#60A5FA"
                                            : "#34D399",
                                      direction: "diagonal" as const,
                                    },
                                    mindMapAnimation: "glow" as const,
                                    mindMapPriority:
                                      node.type === "central"
                                        ? ("high" as const)
                                        : ("medium" as const),
                                    mindMapTags: [],
                                    mindMapProgress: 0,
                                    mindMapNotes: "",
                                    mindMapAttachments: [],
                                  }),
                                );

                                // Auto-connect nodes to central node
                                const centralNode = templateNodes.find(
                                  (n) => n.mindMapNodeType === "central",
                                );
                                if (centralNode) {
                                  const otherNodes = templateNodes.filter(
                                    (n) => n.mindMapNodeType !== "central",
                                  );
                                  centralNode.mindMapConnections =
                                    otherNodes.map((n) => n.id);
                                }

                                setCanvasItems([
                                  ...nonMindMapItems,
                                  ...templateNodes,
                                ]);
                                setNextZIndex(
                                  nextZIndex + template.nodes.length,
                                );
                                setShowMindMapTemplates(false);
                              }}
                              className="w-full text-left px-3 py-3 bg-slate-800/30 hover:bg-gradient-to-r hover:from-purple-600/10 hover:to-pink-600/10 border border-slate-700/50 hover:border-purple-400/30 text-slate-200 hover:text-white rounded-lg transition-all duration-200"
                            >
                              <div className="font-medium text-sm">
                                {template.name}
                              </div>
                              <div className="text-xs text-slate-400 mt-1">
                                {template.description}
                              </div>
                              <div className="text-xs text-purple-400 mt-1">
                                {template.nodes.length} nodes
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <ToolbarButton
                    title="Add Chart"
                    icon={<ChartIcon className="w-4 h-4" />}
                    onClick={() => handleAddCanvasItem("chart")}
                  >
                    Chart
                  </ToolbarButton>
                  <div className="relative">
                    <ToolbarButton
                      title="Add Professional Table (Click) or Templates (Right-click)"
                      icon={<TableIconSVG className="w-4 h-4" />}
                      onClick={() => handleAddCanvasItem("tableElement")}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        setShowTableTemplates(!showTableTemplates);
                      }}
                    >
                      Table
                    </ToolbarButton>

                    {/* Premium Table Templates Dropdown */}
                    {showTableTemplates && (
                      <div className="absolute top-full left-0 mt-1.5 w-80 bg-slate-700/95 backdrop-blur-lg border border-slate-600 rounded-lg shadow-2xl z-20 py-2">
                        <div className="px-3 py-2 border-b border-slate-600 mb-2">
                          <h3 className="text-xs font-semibold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent uppercase tracking-wide">
                            Premium Table Templates
                          </h3>
                          <p className="text-xs text-slate-400 mt-1">
                            Professional data tables for business use
                          </p>
                        </div>

                        <div className="px-2 space-y-1 max-h-64 overflow-y-auto">
                          {[
                            {
                              name: "�� Sales Dashboard",
                              description:
                                "Revenue tracking with growth metrics",
                              theme: "blue",
                              style: "professional",
                              data: {
                                headers: [
                                  "Product",
                                  "Revenue",
                                  "Growth",
                                  "Status",
                                ],
                                rows: [
                                  ["Product A", "$124,500", "+12.5%", "Active"],
                                  ["Product B", "$89,200", "+8.3%", "Active"],
                                  ["Product C", "$67,800", "-2.1%", "Review"],
                                  ["Product D", "$156,900", "+18.7%", "Active"],
                                ],
                              },
                              title: "Sales Performance Dashboard",
                              subtitle: "Q4 2024 Results",
                            },
                            {
                              name: "������ Project Tasks",
                              description:
                                "Task management with status tracking",
                              theme: "green",
                              style: "modern",
                              data: {
                                headers: [
                                  "Task",
                                  "Assignee",
                                  "Priority",
                                  "Status",
                                  "Due Date",
                                ],
                                rows: [
                                  [
                                    "UI Design",
                                    "Sarah Chen",
                                    "High",
                                    "In Progress",
                                    "Dec 15",
                                  ],
                                  [
                                    "Backend API",
                                    "Mike Johnson",
                                    "High",
                                    "Complete",
                                    "Dec 12",
                                  ],
                                  [
                                    "Testing",
                                    "Alex Kim",
                                    "Medium",
                                    "Pending",
                                    "Dec 18",
                                  ],
                                  [
                                    "Documentation",
                                    "Emma Davis",
                                    "Low",
                                    "Complete",
                                    "Dec 10",
                                  ],
                                ],
                              },
                              title: "Project Roadmap",
                              subtitle: "Sprint 4 Tasks",
                            },
                            {
                              name: "������������� Financial Report",
                              description: "Income statement with calculations",
                              theme: "purple",
                              style: "financial",
                              data: {
                                headers: [
                                  "Category",
                                  "Q1 2024",
                                  "Q2 2024",
                                  "Q3 2024",
                                  "Q4 2024",
                                ],
                                rows: [
                                  [
                                    "Revenue",
                                    "$250,000",
                                    "$275,000",
                                    "$290,000",
                                    "$320,000",
                                  ],
                                  [
                                    "Expenses",
                                    "$180,000",
                                    "$195,000",
                                    "$205,000",
                                    "$225,000",
                                  ],
                                  [
                                    "Profit",
                                    "$70,000",
                                    "$80,000",
                                    "$85,000",
                                    "$95,000",
                                  ],
                                  ["Margin", "28%", "29%", "29%", "30%"],
                                ],
                              },
                              title: "Quarterly Financial Summary",
                              subtitle: "2024 Performance Overview",
                            },
                            {
                              name: "������� Team Directory",
                              description: "Employee information and contacts",
                              theme: "orange",
                              style: "corporate",
                              data: {
                                headers: [
                                  "Name",
                                  "Department",
                                  "Role",
                                  "Email",
                                  "Phone",
                                ],
                                rows: [
                                  [
                                    "John Smith",
                                    "Engineering",
                                    "Lead Developer",
                                    "john@company.com",
                                    "+1-555-0101",
                                  ],
                                  [
                                    "Sarah Wilson",
                                    "Design",
                                    "UX Designer",
                                    "sarah@company.com",
                                    "+1-555-0102",
                                  ],
                                  [
                                    "Mike Brown",
                                    "Marketing",
                                    "Content Manager",
                                    "mike@company.com",
                                    "+1-555-0103",
                                  ],
                                  [
                                    "Lisa Chen",
                                    "Operations",
                                    "Project Manager",
                                    "lisa@company.com",
                                    "+1-555-0104",
                                  ],
                                ],
                              },
                              title: "Team Directory",
                              subtitle: "Contact Information",
                            },
                            {
                              name: "📈 Analytics Report",
                              description: "Website metrics and KPIs",
                              theme: "gradient",
                              style: "report",
                              data: {
                                headers: [
                                  "Metric",
                                  "Last Month",
                                  "This Month",
                                  "Change",
                                  "Target",
                                ],
                                rows: [
                                  [
                                    "Page Views",
                                    "125,430",
                                    "142,560",
                                    "+13.6%",
                                    "150,000",
                                  ],
                                  [
                                    "Unique Users",
                                    "8,240",
                                    "9,680",
                                    "+17.5%",
                                    "10,000",
                                  ],
                                  [
                                    "Conversion Rate",
                                    "3.2%",
                                    "3.8%",
                                    "+0.6%",
                                    "4.0%",
                                  ],
                                  ["Bounce Rate", "42%", "38%", "-4%", "35%"],
                                ],
                              },
                              title: "Website Analytics",
                              subtitle: "Monthly Performance Report",
                            },
                            {
                              name: "📅 Event Schedule",
                              description: "Calendar events with details",
                              theme: "red",
                              style: "minimal",
                              data: {
                                headers: [
                                  "Event",
                                  "Date",
                                  "Time",
                                  "Location",
                                  "Attendees",
                                ],
                                rows: [
                                  [
                                    "Team Meeting",
                                    "Dec 15",
                                    "10:00 AM",
                                    "Conference Room A",
                                    "8",
                                  ],
                                  [
                                    "Client Presentation",
                                    "Dec 16",
                                    "2:00 PM",
                                    "Main Hall",
                                    "15",
                                  ],
                                  [
                                    "Workshop",
                                    "Dec 18",
                                    "9:00 AM",
                                    "Training Room",
                                    "25",
                                  ],
                                  [
                                    "Holiday Party",
                                    "Dec 20",
                                    "6:00 PM",
                                    "Office Lounge",
                                    "50",
                                  ],
                                ],
                              },
                              title: "Upcoming Events",
                              subtitle: "December 2024",
                            },
                          ].map((template, index) => (
                            <button
                              key={`table-template-${template.name}-${index}`}
                              onClick={() => {
                                const newId = `canvas-item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                                const templateTable = {
                                  id: newId,
                                  type: "tableElement" as const,
                                  x: 200 + index * 20,
                                  y: 150 + index * 20,
                                  width: 500,
                                  height: 320,
                                  zIndex: nextZIndex,
                                  content: template.title,
                                  backgroundColor: "#FFFFFF",
                                  textColor: "#1F2937",
                                  borderWidth: "1px",
                                  borderStyle: "solid" as const,
                                  borderColor: "#E5E7EB",
                                  tableData: template.data,
                                  tableStyle: template.style as any,
                                  tableTheme: template.theme as any,
                                  tableHeaderStyle: "gradient" as const,
                                  tableBorderStyle: "all" as const,
                                  tableAlternateRows: true,
                                  tableHoverEffect: true,
                                  tableSortable: true,
                                  tableSearchable: false,
                                  tablePageSize: 10,
                                  tableFontSize: "medium" as const,
                                  tableColumnAlignment:
                                    template.data.headers.map((_, i) =>
                                      i === 0
                                        ? ("left" as const)
                                        : template.data.headers[i].includes(
                                              "Revenue",
                                            ) ||
                                            template.data.headers[i].includes(
                                              "$",
                                            )
                                          ? ("right" as const)
                                          : template.data.headers[i].includes(
                                                "%",
                                              ) ||
                                              template.data.headers[i].includes(
                                                "Status",
                                              )
                                            ? ("center" as const)
                                            : ("left" as const),
                                    ),
                                  tableHeaderColor: "#F8FAFC",
                                  tableHeaderTextColor: "#1E293B",
                                  tableRowColors: ["#FFFFFF", "#F8FAFC"],
                                  tableBorderColor: "#E2E8F0",
                                  tableBorderWidth: 1,
                                  tableTitle: template.title,
                                  tableSubtitle: template.subtitle,
                                  tableFooter: "Last updated: Today",
                                  tableNotes: "Click to edit data",
                                };

                                setCanvasItems([...canvasItems, templateTable]);
                                setNextZIndex(nextZIndex + 1);
                                setShowTableTemplates(false);
                              }}
                              className="w-full text-left px-3 py-3 bg-slate-800/30 hover:bg-gradient-to-r hover:from-blue-600/10 hover:to-cyan-600/10 border border-slate-700/50 hover:border-blue-400/30 text-slate-200 hover:text-white rounded-lg transition-all duration-200"
                            >
                              <div className="font-medium text-sm">
                                {template.name}
                              </div>
                              <div className="text-xs text-slate-400 mt-1">
                                {template.description}
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs bg-slate-600/50 px-2 py-1 rounded text-slate-300">
                                  {template.data.headers.length} cols
                                </span>
                                <span className="text-xs bg-slate-600/50 px-2 py-1 rounded text-slate-300">
                                  {template.data.rows.length} rows
                                </span>
                                <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-1 rounded">
                                  {template.style}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <ToolbarButton
                    title="Add Code Block"
                    icon={<CodeBlockIcon className="w-4 h-4" />}
                    onClick={() => handleAddCanvasItem("codeBlock")}
                  >
                    Code
                  </ToolbarButton>
                  <ToolbarButton
                    title="Add Connector"
                    icon={<ConnectorIcon className="w-4 h-4" />}
                    onClick={() => handleAddCanvasItem("connectorElement")}
                  >
                    Connect
                  </ToolbarButton>
                </div>

                <div className="flex-grow"></div>

                <div className="flex items-center space-x-1 sm:space-x-2">
                  <ToolbarButton
                    title="Screenshot Canvas"
                    icon={<CameraIcon className="w-4 h-4" />}
                    onClick={handleScreenshotCanvas}
                  />
                  <ToolbarButton
                    title="Clear Canvas"
                    icon={<TrashIcon className="w-4 h-4" />}
                    onClick={handleClearCanvas}
                    className="hover:bg-red-600/80"
                  />
                  <div className="h-7 border-l border-slate-600/70 mx-1 sm:mx-2 self-center"></div>
                  <ToolbarButton
                    title="Zoom Out"
                    icon={<MinusCircleIcon className="w-4 h-4" />}
                    onClick={() => handleZoomInOut("out")}
                  />
                  <span
                    className="text-xs text-slate-400 w-12 text-center tabular-nums"
                    aria-live="polite"
                  >
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <ToolbarButton
                    title="Zoom In"
                    icon={<PlusCircleIcon className="w-4 h-4" />}
                    onClick={() => handleZoomInOut("in")}
                  />
                  <div className="h-7 border-l border-slate-600/70 mx-1 sm:mx-2 self-center"></div>

                  {/* Brush Tool */}
                  <ToolbarButton
                    title="Brush Tool"
                    icon={<span className="text-lg emoji-icon">🖌</span>}
                    onClick={() => {
                      const newBrushState = !brushToolActive;
                      setBrushToolActive(newBrushState);

                      if (newBrushState) {
                        // Add brush stroke element to canvas
                        handleAddCanvasItem("textElement", {
                          x: 200 + Math.random() * 100,
                          y: 200 + Math.random() * 100,
                          width: 150,
                          height: 40,
                          content: "✏️ Brush Stroke",
                          backgroundColor: "#f59e0b",
                          textColor: "#ffffff",
                          borderRadius: "20px",
                          fontSize: "14px",
                        });
                        console.log(
                          "���������� Brush tool activated - Drawing mode enabled",
                        );
                      } else {
                        console.log("🖌 Brush tool deactivated");
                      }
                    }}
                    className={`px-3 py-2 transition-all duration-200 ${
                      brushToolActive
                        ? "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white shadow-md hover:shadow-lg"
                        : "bg-slate-700/80 hover:bg-slate-600/80 text-slate-200 hover:text-white"
                    }`}
                  >
                    Brush
                  </ToolbarButton>

                  {/* AI Assistant */}
                  <ToolbarButton
                    title="AI Assistant"
                    icon={<span className="text-lg emoji-icon">�������</span>}
                    onClick={() => {
                      const newAIState = !showAIAssistant;
                      setShowAIAssistant(newAIState);

                      if (newAIState) {
                        // Auto-optimize canvas layout when AI Assistant opens
                        if (canvasItems.length > 1) {
                          // Smart auto-arrange items in a grid
                          const cols = Math.ceil(Math.sqrt(canvasItems.length));
                          canvasItems.forEach((item, index) => {
                            const col = index % cols;
                            const row = Math.floor(index / cols);
                            const newX = 100 + col * 200;
                            const newY = 100 + row * 150;

                            updateCanvasItemProperty(item.id, {
                              x: newX,
                              y: newY,
                            });
                          });
                          console.log(
                            "�� AI Assistant activated - Auto-arranged canvas items",
                          );
                        }
                      }
                      console.log(
                        `✨ AI Assistant ${newAIState ? "opened" : "closed"}`,
                      );
                    }}
                    className={`px-3 py-2 transition-all duration-200 ${
                      showAIAssistant
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-md hover:shadow-lg"
                        : "bg-slate-700/80 hover:bg-slate-600/80 text-slate-200 hover:text-white"
                    }`}
                  >
                    AI Assistant
                  </ToolbarButton>

                  {/* Style Presets */}
                  <ToolbarButton
                    title="Style Presets"
                    icon={<span className="text-lg emoji-icon">���������</span>}
                    onClick={() => {
                      const newStyleState = !showStylePresets;
                      setShowStylePresets(newStyleState);

                      if (newStyleState && selectedCanvasItemId) {
                        // Apply modern style preset to selected item
                        updateCanvasItemProperty(selectedCanvasItemId, {
                          backgroundColor: "#3b82f6",
                          textColor: "#ffffff",
                          borderRadius: "12px",
                          borderWidth: "0px",
                          boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
                        });
                        console.log(
                          "���������������� Applied Modern style preset to selected item",
                        );
                      } else if (newStyleState && canvasItems.length > 0) {
                        // Apply random colors to all items if none selected
                        const colors = [
                          "#3b82f6",
                          "#ef4444",
                          "#10b981",
                          "#f59e0b",
                          "#8b5cf6",
                          "#ec4899",
                        ];
                        canvasItems.forEach((item, index) => {
                          updateCanvasItemProperty(item.id, {
                            backgroundColor: colors[index % colors.length],
                            textColor: "#ffffff",
                            borderRadius: "8px",
                          });
                        });
                        console.log(
                          "����� Applied colorful style preset to all items",
                        );
                      }
                      console.log(
                        `🎨 Style Presets ${newStyleState ? "opened" : "closed"}`,
                      );
                    }}
                    className={`px-3 py-2 transition-all duration-200 ${
                      showStylePresets
                        ? "bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white shadow-md hover:shadow-lg"
                        : "bg-slate-700/80 hover:bg-slate-600/80 text-slate-200 hover:text-white"
                    }`}
                  >
                    Styles
                  </ToolbarButton>

                  <div className="h-7 border-l border-slate-600/70 mx-1 sm:mx-2 self-center"></div>
                  <ToolbarButton
                    title="Generate with AI"
                    icon={
                      <img
                        src="https://cdn.builder.io/api/v1/assets/00799f421c79437fb86fbfa71f08b713/generatornobg-18c060?format=webp&width=800"
                        alt="Generator"
                        className="w-4 h-4 object-contain"
                      />
                    }
                    onClick={() => setActiveTab("generator")}
                    className="bg-gradient-to-r from-sky-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 text-white px-3 py-2 shadow-md hover:shadow-lg"
                  >
                    AI Gen
                  </ToolbarButton>
                </div>
              </div>
              {renderCanvasPropertiesPanel()}
              <div className="flex-1 h-full relative overflow-hidden" ref={canvasContainerRef}>
                {/* Canvas with Real-Time Collaboration (Agency Pro Feature) */}
                <CanvasCollaborationIntegration
                  canvasItems={canvasItems}
                  onCanvasItemsChange={setCanvasItems}
                  onUpdateCanvasItem={updateCanvasItemProperty}
                  onAddCanvasItem={(item) => handleAddCanvasItem(item.type, item)}
                  onDeleteCanvasItem={(id) => {
                    setCanvasItems(prev => prev.filter(item => item.id !== id));
                    if (selectedCanvasItemId === id) {
                      setSelectedCanvasItemId(null);
                    }
                  }}
                  projectId={`canvas-${user?.uid || 'anonymous'}-${Date.now()}`}
                  projectName="Canvas Project"
                >
                  <CanvasWorldClass
                    canvasItems={canvasItems}
                    selectedItems={selectedCanvasItemId ? [selectedCanvasItemId] : []}
                    onItemSelect={(itemId, multiSelect) => {
                      if (multiSelect) {
                        // For future multi-select support
                        setSelectedCanvasItemId(itemId);
                      } else {
                        setSelectedCanvasItemId(itemId);
                      }
                    }}
                    onItemsUpdate={(items) => {
                      // Update all canvas items
                      items.forEach(item => {
                        const existingIndex = canvasItems.findIndex(existing => existing.id === item.id);
                        if (existingIndex >= 0) {
                          updateCanvasItemProperty(item.id, item);
                        } else {
                          handleAddCanvasItem(item.type, item);
                        }
                      });
                    }}
                    onAddItem={(type, properties) => handleAddCanvasItem(type, properties)}
                    updateCanvasItemProperty={updateCanvasItemProperty}
                    zoom={zoomLevel}
                    onZoomChange={setZoomLevel}
                    onSaveSnapshot={() => {
                      const snapshot = {
                        timestamp: new Date(),
                        items: [...canvasItems],
                        zoom: zoomLevel,
                        offset: canvasOffset
                      };
                      // Save snapshot logic
                      console.log('Canvas snapshot saved:', snapshot);
                    }}
                    onScreenshot={() => {
                      // Screenshot logic
                      const canvas = document.querySelector('canvas');
                      if (canvas) {
                        const link = document.createElement('a');
                        link.download = `canvas-${Date.now()}.png`;
                        link.href = canvas.toDataURL();
                        link.click();
                      }
                    }}
                    onClearCanvas={() => {
                      if (window.confirm('Are you sure you want to clear the canvas?')) {
                        setCanvasItems([]);
                        setSelectedCanvasItemId(null);
                      }
                    }}
                    history={canvasHistory || []}
                    historyIndex={currentCanvasHistoryIndex || 0}
                    onUndo={handleUndoCanvas}
                    onRedo={handleRedoCanvas}
                  />
                </CanvasCollaborationIntegration>
              </div>
            </section>
          )}

          {/* AI Assistant Floating Panel */}
          {activeTab === "canvas" && showAIAssistant && (
            <div
              className="fixed top-24 right-4 w-80 bg-slate-800/95 backdrop-blur-xl border border-slate-600/50 rounded-xl shadow-2xl z-50"
              style={{ maxHeight: "calc(100vh - 120px)", overflowY: "auto" }}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <span className="text-xl emoji-icon">���������������</span>
                    AI Assistant
                  </h3>
                  <button
                    onClick={() => setShowAIAssistant(false)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => {
                      // Enhanced AI Layout Optimization with multiple patterns
                      if (canvasItems.length > 0) {
                        const patterns = ["spiral", "grid", "circle", "flow"];
                        const pattern =
                          patterns[Math.floor(Math.random() * patterns.length)];

                        switch (pattern) {
                          case "spiral":
                            const centerX = 400;
                            const centerY = 300;
                            const radius = 120;
                            canvasItems.forEach((item, index) => {
                              const angle =
                                (index * 2 * Math.PI) / canvasItems.length;
                              const spiralRadius = radius + index * 15;
                              updateCanvasItemProperty(item.id, {
                                x: centerX + spiralRadius * Math.cos(angle),
                                y: centerY + spiralRadius * Math.sin(angle),
                                borderRadius: "12px",
                              });
                            });
                            break;
                          case "grid":
                            const cols = Math.ceil(
                              Math.sqrt(canvasItems.length),
                            );
                            canvasItems.forEach((item, index) => {
                              const row = Math.floor(index / cols);
                              const col = index % cols;
                              updateCanvasItemProperty(item.id, {
                                x: 150 + col * 200,
                                y: 150 + row * 150,
                                borderRadius: "8px",
                              });
                            });
                            break;
                          case "circle":
                            const circleRadius = 180;
                            const circleCenterX = 400;
                            const circleCenterY = 300;
                            canvasItems.forEach((item, index) => {
                              const angle =
                                (index * 2 * Math.PI) / canvasItems.length;
                              updateCanvasItemProperty(item.id, {
                                x:
                                  circleCenterX +
                                  circleRadius * Math.cos(angle),
                                y:
                                  circleCenterY +
                                  circleRadius * Math.sin(angle),
                                borderRadius: "50%",
                              });
                            });
                            break;
                          case "flow":
                            canvasItems.forEach((item, index) => {
                              const waveX = 150 + index * 120;
                              const waveY = 250 + Math.sin(index * 0.8) * 80;
                              updateCanvasItemProperty(item.id, {
                                x: waveX,
                                y: waveY,
                                borderRadius: "16px",
                              });
                            });
                            break;
                        }
                        AppNotifications.operationSuccess(
                          `AI Layout: Applied ${pattern} pattern to ${canvasItems.length} items`,
                        );
                      } else {
                        AppNotifications.custom(
                          "No Items",
                          "Add some items to the canvas first to use AI Layout Optimization",
                          "info",
                          { icon: "������️" },
                        );
                      }
                    }}
                    className="w-full p-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg transition-all duration-200 transform hover:scale-105"
                  >
                    ���� AI Layout Optimization
                  </button>

                  <button
                    onClick={() => {
                      // Color Harmonization - Apply harmonious color palette
                      if (canvasItems.length > 0) {
                        const baseHue = Math.random() * 360;
                        const harmonizedColors = [
                          `hsl(${baseHue}, 70%, 50%)`,
                          `hsl(${(baseHue + 30) % 360}, 70%, 60%)`,
                          `hsl(${(baseHue + 180) % 360}, 70%, 45%)`,
                          `hsl(${(baseHue + 150) % 360}, 70%, 55%)`,
                          `hsl(${(baseHue + 60) % 360}, 70%, 50%)`,
                          `hsl(${(baseHue + 240) % 360}, 70%, 55%)`,
                        ];

                        canvasItems.forEach((item, index) => {
                          const color =
                            harmonizedColors[index % harmonizedColors.length];
                          updateCanvasItemProperty(item.id, {
                            backgroundColor: color,
                            textColor: "#ffffff",
                            borderWidth: "2px",
                            borderColor: "rgba(255,255,255,0.3)",
                          });
                        });
                        console.log(
                          "������������ Color Harmonization: Applied harmonious palette",
                        );
                      }
                    }}
                    className="w-full p-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg transition-all duration-200 transform hover:scale-105"
                  >
                    🎨 Color Harmonization
                  </button>

                  <button
                    onClick={() => {
                      // Enhanced Smart Alignment with multiple options
                      if (canvasItems.length > 1) {
                        const alignments = [
                          "horizontal",
                          "vertical",
                          "center",
                          "distribute",
                        ];
                        const alignment =
                          alignments[
                            Math.floor(Math.random() * alignments.length)
                          ];

                        switch (alignment) {
                          case "horizontal":
                            const sortedItems = [...canvasItems].sort(
                              (a, b) => a.x - b.x,
                            );
                            const spacing = Math.min(
                              150,
                              (800 - 200) / (sortedItems.length - 1),
                            );
                            sortedItems.forEach((item, index) => {
                              updateCanvasItemProperty(item.id, {
                                x: 100 + index * spacing,
                                y: 250,
                              });
                            });
                            break;
                          case "vertical":
                            const vSortedItems = [...canvasItems].sort(
                              (a, b) => a.y - b.y,
                            );
                            const vSpacing = Math.min(
                              120,
                              (600 - 200) / (vSortedItems.length - 1),
                            );
                            vSortedItems.forEach((item, index) => {
                              updateCanvasItemProperty(item.id, {
                                x: 400,
                                y: 100 + index * vSpacing,
                              });
                            });
                            break;
                          case "center":
                            const centerX = 400;
                            const centerY = 300;
                            canvasItems.forEach((item) => {
                              updateCanvasItemProperty(item.id, {
                                x: centerX - 50,
                                y: centerY - 25,
                              });
                            });
                            break;
                          case "distribute":
                            const rows = Math.ceil(
                              Math.sqrt(canvasItems.length),
                            );
                            const cols = Math.ceil(canvasItems.length / rows);
                            canvasItems.forEach((item, index) => {
                              const row = Math.floor(index / cols);
                              const col = index % cols;
                              updateCanvasItemProperty(item.id, {
                                x: 150 + col * 200,
                                y: 150 + row * 120,
                              });
                            });
                            break;
                        }

                        AppNotifications.operationSuccess(
                          `Smart Alignment: Applied ${alignment} alignment to ${canvasItems.length} items`,
                        );
                      } else {
                        AppNotifications.custom(
                          "Need More Items",
                          "Add at least 2 items to the canvas to use Smart Alignment",
                          "info",
                          { icon: "����" },
                        );
                      }
                    }}
                    className="w-full p-3 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 text-white rounded-lg transition-all duration-200 transform hover:scale-105"
                  >
                    �� Smart Alignment
                  </button>

                  <button
                    onClick={() => {
                      // AI Style Enhancer - Apply modern styling effects
                      if (canvasItems.length > 0) {
                        const effects = [
                          "glassmorphism",
                          "neumorphism",
                          "gradient",
                          "shadow",
                        ];
                        const effect =
                          effects[Math.floor(Math.random() * effects.length)];

                        canvasItems.forEach((item) => {
                          switch (effect) {
                            case "glassmorphism":
                              updateCanvasItemProperty(item.id, {
                                backgroundColor: "rgba(255, 255, 255, 0.1)",
                                backdropFilter: "blur(10px)",
                                borderWidth: "1px",
                                borderColor: "rgba(255, 255, 255, 0.2)",
                                borderRadius: "16px",
                                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                              });
                              break;
                            case "neumorphism":
                              updateCanvasItemProperty(item.id, {
                                backgroundColor: "#e0e5ec",
                                borderRadius: "20px",
                                boxShadow:
                                  "9px 9px 16px #a3b1c6, -9px -9px 16px #ffffff",
                                borderWidth: "0px",
                              });
                              break;
                            case "gradient":
                              const gradients = [
                                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                                "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                                "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
                              ];
                              updateCanvasItemProperty(item.id, {
                                backgroundImage:
                                  gradients[
                                    Math.floor(Math.random() * gradients.length)
                                  ],
                                borderRadius: "12px",
                                borderWidth: "0px",
                                textColor: "#ffffff",
                              });
                              break;
                            case "shadow":
                              updateCanvasItemProperty(item.id, {
                                boxShadow:
                                  "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)",
                                borderRadius: "8px",
                                borderWidth: "1px",
                                borderColor: "rgba(255, 255, 255, 0.1)",
                              });
                              break;
                          }
                        });

                        AppNotifications.operationSuccess(
                          `AI Style: Applied ${effect} effect to ${canvasItems.length} items`,
                        );
                      } else {
                        AppNotifications.custom(
                          "No Items",
                          "Add some items to the canvas first to use AI Style Enhancer",
                          "info",
                          { icon: "���" },
                        );
                      }
                    }}
                    className="w-full p-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-lg transition-all duration-200 transform hover:scale-105"
                  >
                    �� AI Style Enhancer
                  </button>

                  <button
                    onClick={() => {
                      // AI Size & Spacing Optimizer
                      if (canvasItems.length > 0) {
                        const optimizations = [
                          "uniform",
                          "progressive",
                          "golden-ratio",
                          "hierarchy",
                        ];
                        const optimization =
                          optimizations[
                            Math.floor(Math.random() * optimizations.length)
                          ];

                        canvasItems.forEach((item, index) => {
                          switch (optimization) {
                            case "uniform":
                              updateCanvasItemProperty(item.id, {
                                width: "120px",
                                height: "80px",
                                fontSize: "16px",
                                padding: "16px",
                              });
                              break;
                            case "progressive":
                              const size = 80 + index * 20;
                              updateCanvasItemProperty(item.id, {
                                width: `${size}px`,
                                height: `${size * 0.7}px`,
                                fontSize: `${12 + index * 2}px`,
                                padding: `${8 + index * 4}px`,
                              });
                              break;
                            case "golden-ratio":
                              const baseSize = 100;
                              const ratio = 1.618;
                              const goldenSize =
                                baseSize * Math.pow(ratio, (index % 3) - 1);
                              updateCanvasItemProperty(item.id, {
                                width: `${goldenSize}px`,
                                height: `${goldenSize / ratio}px`,
                                fontSize: `${goldenSize / 8}px`,
                                padding: `${goldenSize / 10}px`,
                              });
                              break;
                            case "hierarchy":
                              const sizes = [140, 100, 80, 60];
                              const hierarchySize =
                                sizes[index % sizes.length] || 80;
                              updateCanvasItemProperty(item.id, {
                                width: `${hierarchySize}px`,
                                height: `${hierarchySize * 0.75}px`,
                                fontSize: `${hierarchySize / 8}px`,
                                fontWeight: index === 0 ? "bold" : "normal",
                              });
                              break;
                          }
                        });

                        AppNotifications.operationSuccess(
                          `Size Optimizer: Applied ${optimization} sizing to ${canvasItems.length} items`,
                        );
                      } else {
                        AppNotifications.custom(
                          "No Items",
                          "Add some items to the canvas first to use Size & Spacing Optimizer",
                          "info",
                          { icon: "📏" },
                        );
                      }
                    }}
                    className="w-full p-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg transition-all duration-200 transform hover:scale-105"
                  >
                    �������� AI Size Optimizer
                  </button>

                  <div className="border-t border-slate-600/50 pt-3 mt-4">
                    <p className="text-xs text-slate-400 mb-2">
                      Keyboard Shortcuts:
                    </p>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-1 text-xs text-slate-300">
                        <div>
                          <kbd className="bg-slate-700 px-1 rounded">V</kbd>{" "}
                          Select
                        </div>
                        <div>
                          <kbd className="bg-slate-700 px-1 rounded">T</kbd>{" "}
                          Text
                        </div>
                        <div>
                          <kbd className="bg-slate-700 px-1 rounded">R</kbd>{" "}
                          Rectangle
                        </div>
                        <div>
                          <kbd className="bg-slate-700 px-1 rounded">C</kbd>{" "}
                          Circle
                        </div>
                        <div>
                          <kbd className="bg-slate-700 px-1 rounded">L</kbd>{" "}
                          Line
                        </div>
                        <div>
                          <kbd className="bg-slate-700 px-1 rounded">Esc</kbd>{" "}
                          Deselect
                        </div>
                      </div>
                      <div className="border-t border-slate-600/30 pt-2">
                        <div className="text-xs text-slate-400 mb-1">
                          Combinations:
                        </div>
                        <div className="grid grid-cols-1 gap-1 text-xs text-slate-300">
                          <div>
                            <kbd className="bg-slate-700 px-1 rounded">
                              Ctrl+A
                            </kbd>{" "}
                            Select All
                          </div>
                          <div>
                            <kbd className="bg-slate-700 px-1 rounded">
                              Ctrl+D
                            </kbd>{" "}
                            Duplicate
                          </div>
                          <div>
                            <kbd className="bg-slate-700 px-1 rounded">
                              Alt+A
                            </kbd>{" "}
                            AI Assistant
                          </div>
                          <div>
                            <kbd className="bg-slate-700 px-1 rounded">
                              Alt+S
                            </kbd>{" "}
                            Style Presets
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Style Presets Floating Panel */}
          {activeTab === "canvas" && showStylePresets && (
            <div className="fixed top-24 left-4 w-72 bg-slate-800/95 backdrop-blur-xl border border-slate-600/50 rounded-xl shadow-2xl z-50">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <span className="text-xl emoji-icon">����</span>
                    Style Presets
                  </h3>
                  <button
                    onClick={() => setShowStylePresets(false)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      name: "Modern",
                      color: "#3b82f6",
                      emoji: "✨",
                      bg: "from-blue-500 to-blue-600",
                      description: "Glass morphism with premium effects",
                      applyPreset: () => ({
                        backgroundColor: "rgba(59, 130, 246, 0.15)",
                        backdropFilter: "blur(20px)",
                        borderRadius: "12px",
                        border: "1px solid rgba(59, 130, 246, 0.3)",
                        boxShadow:
                          "0 8px 32px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                        textColor: "#ffffff",
                        fontWeight: "600",
                        className: "glass-effect",
                      }),
                    },
                    {
                      name: "Elegant",
                      color: "#1f2937",
                      emoji: "����",
                      bg: "from-gray-600 to-gray-700",
                      description: "Sophisticated dark luxury theme",
                      applyPreset: () => ({
                        backgroundColor: "#1a1a1a",
                        background:
                          "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
                        textColor: "#f8f9fa",
                        borderRadius: "8px",
                        border: "1px solid #404040",
                        boxShadow:
                          "0 4px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
                        fontFamily: "Georgia, serif",
                        letterSpacing: "0.5px",
                      }),
                    },
                    {
                      name: "Vibrant",
                      color: "#ec4899",
                      emoji: "���",
                      bg: "from-pink-500 to-pink-600",
                      description: "Animated rainbow gradients",
                      applyPreset: () => ({
                        background:
                          "linear-gradient(45deg, #ec4899, #f97316, #eab308, #22c55e, #3b82f6, #8b5cf6)",
                        backgroundSize: "300% 300%",
                        animation: "gradient-shift 3s ease infinite",
                        textColor: "#ffffff",
                        borderRadius: "20px",
                        border: "2px solid #ffffff",
                        boxShadow:
                          "0 8px 25px rgba(236, 72, 153, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)",
                        fontWeight: "700",
                        textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)",
                        className: "gradient-shift",
                      }),
                    },
                    {
                      name: "Minimal",
                      color: "#ffffff",
                      emoji: "�����",
                      bg: "from-slate-400 to-slate-500",
                      description: "Clean and simple design",
                      applyPreset: () => ({
                        backgroundColor: "#ffffff",
                        textColor: "#1f2937",
                        borderRadius: "2px",
                        border: "1px solid #e5e7eb",
                        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                        fontWeight: "400",
                        padding: "16px",
                        lineHeight: "1.5",
                      }),
                    },
                    {
                      name: "Nature",
                      color: "#10b981",
                      emoji: "����",
                      bg: "from-green-500 to-green-600",
                      description: "Earth tones with organic textures",
                      applyPreset: () => ({
                        background:
                          "linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)",
                        textColor: "#ffffff",
                        borderRadius: "16px",
                        border: "2px solid #065f46",
                        boxShadow:
                          "0 6px 20px rgba(16, 185, 129, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                        backgroundImage:
                          "radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
                        fontWeight: "500",
                      }),
                    },
                    {
                      name: "Sunset",
                      color: "#f59e0b",
                      emoji: "����������",
                      bg: "from-orange-500 to-orange-600",
                      description: "Warm golden hour gradients",
                      applyPreset: () => ({
                        background:
                          "linear-gradient(135deg, #f59e0b 0%, #f97316 25%, #dc2626 50%, #9333ea 100%)",
                        textColor: "#ffffff",
                        borderRadius: "25px",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        boxShadow:
                          "0 8px 32px rgba(245, 158, 11, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)",
                        fontWeight: "600",
                        textShadow: "1px 1px 3px rgba(0, 0, 0, 0.2)",
                      }),
                    },
                  ].map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => {
                        // Get the dynamic styles from the preset
                        const presetStyles = preset.applyPreset
                          ? preset.applyPreset()
                          : preset.style || {};

                        // Apply style preset to all canvas items or selected item
                        if (selectedCanvasItemId) {
                          // Apply to selected item only
                          updateCanvasItemProperty(
                            selectedCanvasItemId,
                            presetStyles,
                          );
                          console.log(
                            `Applied ${preset.name} preset to selected item:`,
                            presetStyles,
                          );
                        } else if (canvasItems.length > 0) {
                          // Apply to all items
                          canvasItems.forEach((item) => {
                            updateCanvasItemProperty(item.id, presetStyles);
                          });
                          console.log(
                            `Applied ${preset.name} preset to all items:`,
                            presetStyles,
                          );
                        } else {
                          // Create a new demo element with the style
                          handleAddCanvasItem("textElement", {
                            x: 300 + Math.random() * 200,
                            y: 200 + Math.random() * 150,
                            width: 200,
                            height: 80,
                            content: `${preset.emoji} ${preset.name} Style`,
                            ...presetStyles,
                          });
                          console.log(
                            `Created new ${preset.name} styled element:`,
                            presetStyles,
                          );
                        }

                        // Show feedback message
                        console.log(
                          `🎨 ${preset.name}: ${preset.description || "Applied successfully"}`,
                        );
                      }}
                      className={`group relative p-3 bg-gradient-to-r ${preset.bg} hover:scale-105 text-white rounded-lg transition-all duration-200 transform flex flex-col items-center gap-1 overflow-hidden`}
                      title={preset.description || preset.name}
                    >
                      {/* Background glow effect */}
                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>

                      <span className="text-lg relative z-10">
                        {preset.emoji}
                      </span>
                      <span className="text-xs font-medium relative z-10">
                        {preset.name}
                      </span>

                      {/* Tooltip */}
                      {preset.description && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20 pointer-events-none">
                          {preset.description}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="border-t border-slate-600/50 pt-3 mt-4">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Quick Apply</span>
                    <span>Click any preset</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Brush Tool Indicator */}
          {activeTab === "canvas" && brushToolActive && (
            <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-orange-600/90 backdrop-blur-xl border border-orange-500/50 rounded-lg px-4 py-2 shadow-lg z-50">
              <div className="flex items-center gap-2 text-white">
                <span className="text-lg emoji-icon">🖌</span>
                <span className="text-sm font-medium">Brush Tool Active</span>
                <button
                  onClick={() => setBrushToolActive(false)}
                  className="text-orange-200 hover:text-white ml-2"
                >
                  �����
                </button>
              </div>
            </div>
          )}

          {activeTab === "channelAnalysis" && (
            <YouTubeAnalysisWorldClass
              userPlan={userPlan}
              onNavigateToTab={setActiveTab}
            />
          )}

          {false && activeTab === "channelAnalysis" && (
            <div className="flex-grow md:w-full relative overflow-hidden">
              {/* Premium Background with Glass Morphism */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900/40 via-slate-800/30 to-slate-900/60 backdrop-blur-2xl"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/5 via-transparent to-purple-500/5"></div>

              {/* Animated Background Elements */}
              <div className="absolute top-10 right-10 w-32 h-32 bg-sky-500/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-10 left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

              <div className="relative z-10 p-8 h-full flex flex-col">
                {/* Premium Header Section */}
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl shadow-lg mr-4">
                      <svg
                        className="w-8 h-8 text-white"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        <path
                          d="M18 6h2v2h-2zM18 9h2v2h-2zM21 6h2v2h-2zM21 9h2v2h-2z"
                          opacity="0.8"
                        />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-4xl font-black bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                        YouTube Channel Analysis
                      </h2>
                      <p className="text-lg text-slate-300 font-medium">
                        Professional insights for content strategy
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-2xl p-6 backdrop-blur-sm">
                    <p className="text-slate-200 leading-relaxed">
                      🔍{" "}
                      <span className="font-semibold text-orange-300">
                        AI-Powered Analysis:
                      </span>{" "}
                      Enter YouTube channel names or URLs to discover content
                      themes, analyze popular videos, identify content gaps, and
                      get strategic recommendations for growth.
                    </p>
                  </div>

                  {/* Channel Size Guidance */}
                  <CollapsibleGuidelines
                    title="Best Results Channel Guidelines"
                    icon="��"
                    guidelines={[
                      {
                        status: "✅ Optimal:",
                        color: "text-green-400",
                        text: "50K+ subscribers, 50+ videos, weekly uploads",
                      },
                      {
                        status: "⚠ Minimum:",
                        color: "text-yellow-400",
                        text: "5K+ subscribers, 20+ videos, clear niche focus",
                      },
                      {
                        status: "✗ Poor results:",
                        color: "text-red-400",
                        text: "Under 1K subscribers, irregular uploads, dormant channels",
                      },
                    ]}
                    bgGradient="bg-gradient-to-r from-blue-500/10 to-purple-500/10"
                    borderColor="border border-blue-500/20"
                    titleColor="text-blue-300"
                  />
                </div>

                {/* Premium Input Section */}
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 mb-6 shadow-2xl">
                  <div className="space-y-6">
                    <div>
                      <label
                        htmlFor="channelInput"
                        className="flex items-center text-lg font-semibold text-sky-300 mb-2"
                      >
                        <span className="w-2 h-2 bg-sky-400 rounded-full mr-3 animate-pulse"></span>
                        Channel Names or URLs
                      </label>
                      <p className="text-slate-400 text-sm mb-4">
                        Unlock competitive insights and growth opportunities
                      </p>
                      <textarea
                        id="channelInput"
                        value={channelAnalysisInput}
                        onChange={(e) =>
                          setChannelAnalysisInput(e.target.value)
                        }
                        placeholder={
                          DEFAULT_USER_INPUT_PLACEHOLDERS[
                            ContentType.ChannelAnalysis
                          ]
                        }
                        rows={3}
                        className="w-full p-4 bg-gradient-to-br from-slate-700/50 to-slate-800/50 border-2 border-slate-600/50 focus:border-sky-400/70 rounded-2xl text-slate-100 placeholder-slate-400 backdrop-blur-sm transition-all duration-300 focus:shadow-lg focus:shadow-sky-500/20 resize-none text-base"
                      />

                      {/* Display entered channels in styled format with validation */}
                      {channelAnalysisInput.trim() && (
                        <div className="mt-4 space-y-3">
                          <div className="flex flex-wrap gap-2">
                            {channelAnalysisInput
                              .split(",")
                              .map((channel, index) => {
                                const trimmedChannel = channel.trim();
                                if (!trimmedChannel) return null;

                                // Simple URL validation - check for common URL patterns
                                const isValidUrl =
                                  trimmedChannel.includes("youtube.com/") ||
                                  trimmedChannel.includes("youtu.be/") ||
                                  trimmedChannel.startsWith("https://") ||
                                  trimmedChannel.startsWith("http://") ||
                                  trimmedChannel.startsWith("@") ||
                                  (!trimmedChannel.includes(" ") &&
                                    !trimmedChannel.includes(".") &&
                                    trimmedChannel.length > 2);

                                return (
                                  <div
                                    key={`ai-gen-option-${index}-${option?.name || index}`}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                                      isValidUrl
                                        ? "bg-slate-800/60 border-slate-600/50"
                                        : "bg-red-900/30 border-red-500/50"
                                    }`}
                                  >
                                    <div
                                      className={`w-5 h-5 rounded-sm flex items-center justify-center flex-shrink-0 ${
                                        isValidUrl ? "bg-red-600" : "bg-red-500"
                                      }`}
                                    >
                                      {isValidUrl ? (
                                        <svg
                                          className="w-3 h-3 text-white"
                                          viewBox="0 0 24 24"
                                          fill="currentColor"
                                        >
                                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                        </svg>
                                      ) : (
                                        <svg
                                          className="w-3 h-3 text-white"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z"
                                          />
                                        </svg>
                                      )}
                                    </div>
                                    <span
                                      className={`text-sm font-medium ${
                                        isValidUrl
                                          ? "text-slate-300"
                                          : "text-red-300"
                                      }`}
                                    >
                                      {trimmedChannel}
                                    </span>
                                    {!isValidUrl && (
                                      <span className="text-xs text-red-400 ml-1">
                                        (Invalid URL)
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                          </div>

                          {(() => {
                            const channels = channelAnalysisInput
                              .split(",")
                              .map((c) => c.trim())
                              .filter((c) => c.length > 0);
                            const validChannels = channels.filter((channel) => {
                              return (
                                channel.includes("youtube.com/") ||
                                channel.includes("youtu.be/") ||
                                channel.startsWith("https://") ||
                                channel.startsWith("http://") ||
                                channel.startsWith("@") ||
                                (!channel.includes(" ") &&
                                  !channel.includes(".") &&
                                  channel.length > 2)
                              );
                            });
                            const invalidChannels = channels.filter(
                              (channel) => {
                                return !(
                                  channel.includes("youtube.com/") ||
                                  channel.includes("youtu.be/") ||
                                  channel.startsWith("https://") ||
                                  channel.startsWith("http://") ||
                                  channel.startsWith("@") ||
                                  (!channel.includes(" ") &&
                                    !channel.includes(".") &&
                                    channel.length > 2)
                                );
                              },
                            );

                            return (
                              <div className="space-y-2">
                                {channels.length > 5 && (
                                  <div className="flex items-center gap-2 text-orange-400 text-sm">
                                    <svg
                                      className="w-4 h-4"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z"
                                      />
                                    </svg>
                                    Maximum 5 channels allowed. Only first 5
                                    will be analyzed.
                                  </div>
                                )}
                                {invalidChannels.length > 0 && (
                                  <div className="flex items-center gap-2 text-red-400 text-sm">
                                    <svg
                                      className="w-4 h-4"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z"
                                      />
                                    </svg>
                                    Please enter valid YouTube URLs, channel
                                    names starting with @, or channel names.
                                  </div>
                                )}
                                {validChannels.length > 0 && (
                                  <div className="flex items-center gap-2 text-green-400 text-sm">
                                    <svg
                                      className="w-4 h-4"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                      />
                                    </svg>
                                    {Math.min(validChannels.length, 5)} valid
                                    channel
                                    {Math.min(validChannels.length, 5) !== 1
                                      ? "s"
                                      : ""}{" "}
                                    ��� {Math.min(validChannels.length, 5) * 4}{" "}
                                    credits required
                                  </div>
                                )}
                              </div>
                            );
                          })()}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={handleGenerateContent}
                      disabled={
                        isAnalyzingChannel ||
                        !channelAnalysisInput.trim() ||
                        (() => {
                          const channels = channelAnalysisInput
                            .split(",")
                            .map((c) => c.trim())
                            .filter((c) => c.length > 0);
                          const validChannels = channels.filter((channel) => {
                            return (
                              channel.includes("youtube.com/") ||
                              channel.includes("youtu.be/") ||
                              channel.startsWith("https://") ||
                              channel.startsWith("http://") ||
                              channel.startsWith("@") ||
                              (!channel.includes(" ") &&
                                !channel.includes(".") &&
                                channel.length > 2)
                            );
                          });
                          return validChannels.length === 0;
                        })()
                      }
                      className="group relative w-full px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 disabled:from-slate-600 disabled:to-slate-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-red-500/30 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex items-center justify-center space-x-3">
                        <SearchCircleIcon className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                        <span className="text-lg">
                          {isAnalyzingChannel
                            ? channelAnalysisProgress
                              ? `������ Analyzing ${channelAnalysisProgress.current}/${channelAnalysisProgress.total}: ${channelAnalysisProgress.currentChannel.length > 20 ? channelAnalysisProgress.currentChannel.substring(0, 20) + "..." : channelAnalysisProgress.currentChannel}`
                              : "���� Analyzing Channels..."
                            : (() => {
                                const channels = channelAnalysisInput
                                  .split(",")
                                  .map((c) => c.trim())
                                  .filter((c) => c.length > 0);
                                const validChannels = channels.filter(
                                  (channel) => {
                                    return (
                                      channel.includes("youtube.com/") ||
                                      channel.includes("youtu.be/") ||
                                      channel.startsWith("https://") ||
                                      channel.startsWith("http://") ||
                                      channel.startsWith("@") ||
                                      (!channel.includes(" ") &&
                                        !channel.includes(".") &&
                                        channel.length > 2)
                                    );
                                  },
                                );
                                const creditsNeeded =
                                  Math.min(validChannels.length, 5) * 4;
                                return validChannels.length > 0
                                  ? `🚀 Start Analysis (${creditsNeeded} credits)`
                                  : "🚀 Start Analysis (Enter channels)";
                              })()}
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
                {/* Premium Error Display */}
                {channelAnalysisError && (
                  <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 border-2 border-red-500/40 rounded-2xl p-6 backdrop-blur-sm">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-red-500/30 rounded-full">
                        <span className="text-red-300 text-lg">⚠</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-300 mb-1">
                          Analysis Error
                        </h4>
                        <p className="text-red-200 text-sm">
                          {channelAnalysisError}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Premium Analysis Summary */}
                {channelAnalysisSummary && !isSummarizingChannelAnalysis && (
                  <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-xl rounded-3xl border border-indigo-500/30 p-8 shadow-2xl mb-6">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                          <span className="text-2xl">������</span>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
                            AI Analysis Summary
                          </h3>
                          <p className="text-slate-300 text-sm">
                            Strategic insights and recommendations
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setChannelAnalysisSummary(null)}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200"
                        title="Clear Summary"
                      >
                        <span className="text-lg">✕</span>
                      </button>
                    </div>

                    <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 rounded-2xl p-6 backdrop-blur-sm mb-6">
                      <p className="text-slate-100 text-base whitespace-pre-wrap leading-relaxed">
                        {channelAnalysisSummary}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        handleCopyToClipboard(channelAnalysisSummary)
                      }
                      className="group px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-3"
                    >
                      <ClipboardIcon className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                      <span>Copy Summary</span>
                    </button>
                  </div>
                )}

                {/* Analysis Loading State */}
                {isAnalyzingChannel && !channelAnalysisProgress && (
                  <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 shadow-2xl mb-6">
                    <GeneratingContent message="��������� Preparing channel analysis..." />
                  </div>
                )}

                {/* Sequential Analysis Progress */}
                {isAnalyzingChannel && channelAnalysisProgress && (
                  <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 shadow-2xl mb-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
                            <span className="text-white font-bold">
                              {channelAnalysisProgress.current}
                            </span>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">
                            Sequential Channel Analysis
                          </h3>
                          <p className="text-slate-300 text-sm">
                            Analyzing {channelAnalysisProgress.current} of{" "}
                            {channelAnalysisProgress.total} channels
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-slate-400 mb-1">
                          Current:
                        </div>
                        <div className="text-white font-medium max-w-48 truncate">
                          {channelAnalysisProgress.currentChannel}
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-700 rounded-full h-3 mb-4">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
                        style={{
                          width: `${(channelAnalysisProgress.current / channelAnalysisProgress.total) * 100}%`,
                        }}
                      ></div>
                    </div>

                    <div className="text-center text-slate-300 text-sm">
                      🔍 Analyzing real YouTube data sequentially for optimal
                      accuracy...
                      {channelAnalysisProgress.current > 1 && (
                        <div className="mt-2 text-green-400">
                          ✅ {channelAnalysisProgress.current - 1} channel
                          {channelAnalysisProgress.current > 2 ? "s" : ""}{" "}
                          analyzed with real data
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Premium Analysis Results */}
                {parsedChannelAnalysis &&
                  !isAnalyzingChannel &&
                  !isSummarizingChannelAnalysis && (
                    <div className="flex-grow flex flex-col">
                      {/* Premium Action Buttons */}
                      <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <h3 className="text-xl font-bold text-slate-200">
                            Analysis Complete
                          </h3>
                          <span className="px-3 py-1 bg-green-500/20 text-green-300 text-xs font-medium rounded-full border border-green-500/30">
                            {parsedChannelAnalysis.length} Insights
                          </span>
                        </div>

                        <div className="flex space-x-3">
                          <button
                            onClick={() =>
                              handleCopyToClipboard(
                                parsedChannelAnalysis
                                  .map((s) => `## ${s.title}\n${s.content}`)
                                  .join("\n\n"),
                              )
                            }
                            className="group px-5 py-3 bg-gradient-to-r from-sky-500 to-cyan-600 hover:from-sky-600 hover:to-cyan-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                          >
                            <ClipboardIcon className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                            <span>{copied ? "Copied!" : "Copy All"}</span>
                          </button>
                        </div>
                      </div>

                      {/* Premium Results Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {parsedChannelAnalysis.map((section, index) => (
                          <div
                            key={`feature-card-${index}-${feature?.title || index}`}
                            className="group relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-6 shadow-2xl hover:shadow-sky-500/20 transition-all duration-500 hover:scale-[1.02] overflow-hidden"
                          >
                            {/* Animated Background Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            {/* Content */}
                            <div className="relative z-10">
                              <div className="flex items-start justify-between mb-4">
                                <h3 className="text-xl font-bold bg-gradient-to-r from-sky-300 to-cyan-300 bg-clip-text text-transparent pr-4">
                                  {section.title}
                                </h3>
                                <div className="w-3 h-3 bg-sky-400 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></div>
                              </div>

                              <p className="text-slate-300 text-sm leading-relaxed mb-6 line-clamp-4">
                                {truncateText(section.content, 140)}
                              </p>

                              <button
                                onClick={() =>
                                  setDetailedAnalysisSection(section)
                                }
                                className="group/btn w-full px-4 py-3 bg-gradient-to-r from-sky-600/80 to-cyan-600/80 hover:from-sky-500 hover:to-cyan-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                              >
                                <span>View Full Details</span>
                                <svg
                                  className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              </button>
                            </div>

                            {/* Hover Effect Lines */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                {detailedAnalysisSection &&
                  renderModal(
                    detailedAnalysisSection.title,
                    () => setDetailedAnalysisSection(null),
                    <div className="text-slate-200 whitespace-pre-wrap text-sm leading-relaxed">
                      <p>{detailedAnalysisSection.content}</p>
                      {detailedAnalysisSection.ideas &&
                        detailedAnalysisSection.ideas.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-slate-600">
                            <h4 className="text-md font-semibold text-sky-300 mb-2">
                              Actionable Ideas:
                            </h4>
                            <ul className="space-y-2">
                              {detailedAnalysisSection.ideas.map(
                                (idea, idx) => (
                                  <li
                                    key={idx}
                                    className="p-2.5 bg-slate-700/70 rounded-md flex justify-between items-center"
                                  >
                                    <span className="text-sm">{idea}</span>
                                    <button
                                      onClick={() =>
                                        handleUseIdeaForBrief(idea)
                                      }
                                      className="px-2.5 py-1 bg-teal-600 hover:bg-teal-500 text-white text-xs rounded-md transition-colors"
                                    >
                                      Use for Brief
                                    </button>
                                  </li>
                                ),
                              )}
                            </ul>
                          </div>
                        )}
                      {detailedAnalysisSection.sources &&
                        detailedAnalysisSection.sources.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-slate-600">
                            <h4 className="text-md font-semibold text-sky-300 mb-2">
                              Sources:
                            </h4>
                            <ul className="space-y-1">
                              {detailedAnalysisSection.sources.map(
                                (source, idx) => (
                                  <li key={idx} className="text-xs">
                                    <a
                                      href={source.uri}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sky-400 hover:text-sky-300 hover:underline break-all"
                                    >
                                      {source.title || source.uri}{" "}
                                      <ArrowUpRightIcon className="inline h-3 w-3" />
                                    </a>
                                  </li>
                                ),
                              )}
                            </ul>
                          </div>
                        )}
                    </div>,
                    "max-w-3xl",
                  )}

                {/* Premium YouTube Analysis Component */}
                <PremiumYouTubeAnalysis
                  channelAnalysisInput={channelAnalysisInput}
                  setChannelAnalysisInput={setChannelAnalysisInput}
                  onAnalyze={handleChannelAnalyze}
                  isAnalyzing={isAnalyzingChannel}
                  parsedChannelAnalysis={parsedChannelAnalysis}
                  channelAnalysisError={channelAnalysisError}
                  channelAnalysisSummary={channelAnalysisSummary}
                  isSummarizingChannelAnalysis={isSummarizingChannelAnalysis}
                  onSummarize={handleSummarizeChannelAnalysis}
                  onCopyToClipboard={handleCopyToClipboard}
                  copied={copied}
                  onSearchTrends={handleSearchTrends}
                />
              </div>
            </div>
          )}

          {activeTab === "strategy" && (
            <>
              {generatedStrategyPlan ? (
                <div className="flex-grow bg-slate-800/70 backdrop-blur-sm p-6 rounded-xl shadow-2xl flex flex-col space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-sky-400 mb-1 flex items-center">
                      <Brain className="w-7 h-7 mr-3 text-sky-400" />
                      Content Strategy Plan
                    </h2>
                    <button
                      onClick={() => setGeneratedStrategyPlan(null)}
                      className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center gap-2 -mt-2"
                    >
                      <Home className="w-4 h-4 -mt-1" />
                      Back to Overview
                    </button>
                  </div>

                  <PremiumContentStrategy
                    strategyPlan={generatedStrategyPlan}
                    strategyConfig={currentStrategyConfig}
                    isLoading={isGeneratingStrategy}
                    error={strategyError}
                    onGenerateStrategy={handleGenerateStrategyWithConfig}
                    onStrategyConfigChange={handleStrategyConfigChange}
                    onUpdateStrategyPlan={setGeneratedStrategyPlan}
                    savedStrategies={[]}
                    isPremium={isPremium}
                    onUpgrade={() => setShowUpgradeModal(true)}
                    onSendToCanvas={handleSendToCanvas}
                    onSendStrategyMindMap={handleSendStrategyMindMap}
                    onAddToCalendar={addStrategyToCalendar}
                  />
                </div>
              ) : (
                <StrategyWorldClass
                  onCreateStrategy={handleGeneratePremiumStrategy}
                  onEditStrategy={(strategyId) => {
                    // Handle strategy editing
                    console.log("Editing strategy:", strategyId);
                  }}
                  onExportStrategy={() => {
                    // Handle strategy export
                    console.log("Exporting strategy");
                  }}
                  generatedStrategies={allGeneratedStrategies}
                  onViewStrategy={(strategy) => {
                    // Set the selected strategy to show detailed view
                    setGeneratedStrategyPlan(strategy.strategy);
                    console.log("Viewing strategy:", strategy.name);
                  }}
                  onDeleteStrategy={(strategyId) => {
                    setAllGeneratedStrategies(prev => prev.filter(s => s.id !== strategyId));
                    console.log("Deleted strategy:", strategyId);
                  }}
                  onExportStrategyData={(strategy) => {
                    exportContentAsMarkdown(
                      strategy.strategy,
                      strategy.name,
                      ContentType.ContentStrategyPlan
                    );
                    console.log("Exported strategy:", strategy.name);
                  }}
                  onSendToCanvas={handleSendToCanvas}
                  onSendStrategyMindMap={handleSendStrategyMindMap}
                  onAddToCalendar={addStrategyToCalendar}
                  onApplyTemplate={(template) => {
                    // Create a strategy configuration based on the template
                    const templateConfig = {
                      name: template.name,
                      niche: template.category,
                      platforms: template.platforms,
                      duration: template.duration,
                      contentPillars: template.contentPillars,
                      postingSchedule: template.postingSchedule,
                      monthlyGoals: template.monthlyGoals,
                      keyFeatures: template.keyFeatures
                    };

                    // Set the template configuration and trigger strategy generation
                    console.log('Applying template:', template.name, templateConfig);

                    // You can either:
                    // 1. Generate a strategy automatically with this template
                    handleGeneratePremiumStrategy();

                    // 2. Or show a pre-filled form with template data
                    // This would require extending the strategy generation to accept template data
                  }}
                  isPremium={isPremium}
                  subscriptionPlan={userPlan}
                  onUpgrade={() => setShowUpgradeModal(true)}
                  sidebarExpanded={sidebarExpanded}
                />
              )}
            </>
          )}
          {activeTab === "legacy-strategy" && (
            <div className="flex-grow bg-slate-800/70 backdrop-blur-sm p-6 rounded-xl shadow-2xl flex flex-col space-y-6">
              <h2 className="text-2xl font-semibold text-sky-400 mb-1 flex items-center">
                <CompassIcon className="w-7 h-7 mr-3 text-sky-400" />
                Content Strategy Planner (Legacy)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="strategyNiche"
                    className="block text-sm font-medium text-sky-300 mb-1"
                  >
                    Primary Niche
                  </label>
                  <input
                    type="text"
                    id="strategyNiche"
                    value={strategyNiche}
                    onChange={(e) => setStrategyNiche(e.target.value)}
                    placeholder="e.g., Sustainable Urban Gardening"
                    className="w-full p-2.5 bg-slate-700 border border-slate-600 rounded-lg focus:ring-sky-500 focus:border-sky-500 text-slate-100 placeholder-slate-400"
                  />
                </div>
                <div>
                  <label
                    htmlFor="strategyAudience"
                    className="block text-sm font-medium text-sky-300 mb-1"
                  >
                    Target Audience Description
                  </label>
                  <input
                    type="text"
                    id="strategyAudience"
                    value={strategyAudience}
                    onChange={(e) => setStrategyAudience(e.target.value)}
                    placeholder="e.g., Millennials interested in eco-living, apartment dwellers"
                    className="w-full p-2.5 bg-slate-700 border border-slate-600 rounded-lg focus:ring-sky-500 focus:border-sky-500 text-slate-100 placeholder-slate-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-sky-300 mb-1">
                  Main Goals (select up to 3)
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Audience Growth",
                    "Engagement",
                    "Brand Awareness",
                    "Lead Generation",
                    "Community Building",
                  ].map((goal) => (
                    <button
                      key={goal}
                      onClick={() =>
                        setStrategyGoals((prev) =>
                          prev.includes(goal)
                            ? prev.filter((g) => g !== goal)
                            : prev.length < 3
                              ? [...prev, goal]
                              : prev,
                        )
                      }
                      className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${strategyGoals.includes(goal) ? "bg-sky-600 border-sky-500 text-white" : "bg-slate-600 border-slate-500 hover:bg-slate-500"}`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-sky-300 mb-1">
                  Target Platforms
                </label>
                <div className="flex flex-wrap gap-2">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p}
                      onClick={() =>
                        setStrategyPlatforms((prev) =>
                          prev.includes(p)
                            ? prev.filter((pf) => pf !== p)
                            : [...prev, p],
                        )
                      }
                      className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${strategyPlatforms.includes(p) ? "bg-sky-600 border-sky-500 text-white" : "bg-slate-600 border-slate-500 hover:bg-slate-500"}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() =>
                  handleActualGeneration(
                    ContentType.ContentStrategyPlan,
                    strategyNiche,
                    {
                      strategyConfig: {
                        niche: strategyNiche,
                        targetAudience: strategyAudience,
                        goals: strategyGoals,
                        platforms: strategyPlatforms,
                      },
                      historyLogContentType: ContentType.ContentStrategyPlan,
                      originalUserInput: strategyNiche,
                      originalPlatform: platform,
                    },
                  )
                }
                disabled={isGeneratingStrategy || !strategyNiche}
                className="px-5 py-2.5 bg-gradient-to-r from-sky-500 to-purple-500 hover:from-sky-600 hover:to-purple-600 text-white font-semibold rounded-lg shadow-md disabled:opacity-60 flex items-center justify-center space-x-2 self-start"
              >
                <CompassIcon className="h-5 w-5" />
                <span>
                  {isGeneratingStrategy
                    ? "Developing Strategy..."
                    : "Generate Strategy Plan"}
                </span>
              </button>
              {strategyError && (
                <div className="p-3 bg-red-500/20 border border-red-700 text-red-300 rounded-lg text-sm">
                  {strategyError}
                </div>
              )}
              {isGeneratingStrategy && !generatedStrategyPlan && (
                <GeneratingContent message="Generating strategy plan..." />
              )}
              {generatedStrategyPlan && (
                <div className="mt-4 p-4 bg-slate-700/50 rounded-lg border border-slate-600/50">
                  <h3 className="text-xl font-semibold text-sky-300 mb-3">
                    Content Strategy Plan
                  </h3>
                  <div className="space-y-3 text-sm">
                    {" "}
                    <p>
                      <strong>Target Audience:</strong>{" "}
                      {generatedStrategyPlan.targetAudienceOverview}
                    </p>{" "}
                    <p>
                      <strong>Goals:</strong>{" "}
                      {generatedStrategyPlan.goals.join(", ")}
                    </p>{" "}
                    <div>
                      <strong>Content Pillars:</strong>{" "}
                      <ul className="list-disc list-inside ml-4">
                        {generatedStrategyPlan.contentPillars.map((p) => (
                          <li key={p.pillarName}>
                            <strong>{p.pillarName}:</strong> {p.description}{" "}
                            (Keywords: {p.keywords.join(", ")})
                          </li>
                        ))}
                      </ul>
                    </div>{" "}
                  </div>
                  <div className="flex space-x-3 mt-4">
                    <button
                      onClick={() =>
                        handlePinStrategyPlanToCanvas(
                          generatedStrategyPlan,
                          strategyNiche,
                        )
                      }
                      className="px-3 py-1.5 bg-gradient-to-r from-sky-500 to-purple-500 hover:from-sky-600 hover:to-purple-600 text-white text-xs rounded-md flex items-center space-x-1.5"
                      title="Add Strategy Plan to Canvas"
                    >
                      <PlusCircleIcon className="h-4 w-4" />
                      <span>Add to Canvas</span>
                    </button>
                    <button
                      onClick={() =>
                        exportContentAsMarkdown(
                          generatedStrategyPlan,
                          `${strategyNiche} Strategy Plan`,
                        )
                      }
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-md flex items-center space-x-1.5"
                      title="Export Strategy as Markdown"
                    >
                      <DownloadIcon className="h-4 w-4" />
                      <span>Export Plan</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          {activeTab === "calendar" && (
            <CalendarWorldClass
              userPlan={userPlan}
              onNavigateToTab={setActiveTab}
            />
          )}
          {false && activeTab === "trends" && (
            <div className="flex-grow bg-slate-800/70 backdrop-blur-sm p-6 rounded-xl shadow-2xl flex flex-col space-y-6">
              {/* Premium Tab Navigation */}
              <div className="flex space-x-2 mb-6">
                {[
                  { key: "analysis", label: "Analysis", icon: "📊" },
                  { key: "dashboard", label: "Dashboard", icon: "�����������������" },
                  {
                    key: "recommendations",
                    label: "AI Recommendations",
                    icon: "�����",
                  },
                  {
                    key: "monitoring",
                    label: "Monitoring",
                    icon: "🔍",
                    premium: userPlan === "free",
                  },
                  {
                    key: "comparison",
                    label: "Comparison",
                    icon: "⚔��",
                    premium: userPlan === "free",
                  },
                  {
                    key: "reporting",
                    label: "Reports",
                    icon: "📄",
                    premium: userPlan === "free",
                  },
                  {
                    key: "team",
                    label: "Team",
                    icon: "👥",
                    premium: userPlan !== "enterprise",
                  },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setTrendAnalysisTabMode(tab.key)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      trendAnalysisTabMode === tab.key
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
              {/* Tab Content */}
              {trendAnalysisTabMode === "analysis" && (
                <PremiumTrendAnalysis
                  trendAnalysis={generatedTrendAnalysis}
                  isLoading={isAnalyzingTrends}
                  error={trendAnalysisError}
                  onAnalyzeTrends={handleTrendAnalysis}
                  recentQueries={recentTrendQueries}
                  isPremium={isPremium}
                  onUpgrade={handleShowUpgrade}
                  initialQuery={trendsInitialQuery}
                  onNavigateToGenerator={(content: string) => {
                    setGeneratorInput(content);
                    setActiveTab("generator");
                    setGeneratedOutput(null);
                  }}
                />
              )}
              {trendAnalysisTabMode === "dashboard" && (
                <TrendAnalyticsDashboard
                  trendData={generatedTrendAnalysis}
                  isPremium={isPremium}
                  onUpgrade={handleShowUpgrade}
                  onSwitchToGenerator={(contentType, title) => {
                    // Switch to generator tab and pre-fill with trend idea
                    setActiveMainTab("generator");
                    setUserInput(title);
                    // Set content type if needed
                    if (contentType === "Text" || contentType === "Video") {
                      setContentType(ContentType.Text);
                    }
                  }}
                  onCopyToClipboard={handleCopyToClipboard}
                />
              )}
              {trendAnalysisTabMode === "recommendations" && (
                <TrendRecommendations
                  trendData={generatedTrendAnalysis}
                  platform={platform}
                  isPremium={isPremium}
                  onUpgrade={handleShowUpgrade}
                  onGenerateContent={handleGenerateContentFromRecommendation}
                />
              )}
              {trendAnalysisTabMode === "monitoring" && (
                <TrendMonitoring
                  isPremium={isPremium}
                  onUpgrade={handleShowUpgrade}
                />
              )}
              {trendAnalysisTabMode === "comparison" && (
                <TrendComparison
                  isPremium={isPremium}
                  onUpgrade={handleShowUpgrade}
                />
              )}
              {trendAnalysisTabMode === "reporting" && (
                <TrendReporting
                  isPremium={isPremium}
                  onUpgrade={handleShowUpgrade}
                />
              )}
              {trendAnalysisTabMode === "team" && (
                <TeamCollaboration
                  userPlan={userPlan}
                  onUpgrade={handleShowUpgrade}
                />
              )}
              {/* Premium Upgrade Modal */}
              {showUpgradeModal && (
                <PremiumUpgrade
                  onClose={() => setShowUpgradeModal(false)}
                  onUpgrade={handleUpgrade}
                  currentPlan={userPlan}
                />
              )}


            </div>
          )}
          {activeTab === "history" && (
            <HistoryIntegration
              history={history}
              setHistory={setHistory}
              onNavigateToTab={setActiveTab}
            />
          )}
          {false && activeTab === "history" && (
            <div className="flex-grow bg-slate-800/70 backdrop-blur-sm p-6 rounded-xl shadow-2xl flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                {" "}
                <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-100 via-sky-300 to-purple-300 bg-clip-text text-transparent tracking-tight">
                  Content History
                </h2>{" "}
                {history.length > 0 && (
                  <button
                    onClick={handleClearAppHistory}
                    className="px-3 py-1.5 bg-red-700 hover:bg-red-600 text-white text-xs font-medium rounded-md flex items-center transition-colors shadow"
                  >
                    <TrashIcon className="w-3.5 h-3.5 mr-1.5" />
                    Clear App History
                  </button>
                )}{" "}
              </div>
              <div className="flex-grow space-y-3 pr-2">
                {history.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full min-h-[500px] relative overflow-hidden">
                    {/* Premium Animated Background */}
                    <div className="absolute inset-0">
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-900 via-indigo-950/50 to-purple-950/30 rounded-3xl"></div>
                      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-sky-500/20 to-cyan-500/10 rounded-full blur-2xl animate-pulse"></div>
                      <div
                        className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/10 rounded-full blur-2xl animate-pulse"
                        style={{ animationDelay: "1s" }}
                      ></div>
                      <div
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 rounded-full blur-3xl animate-pulse"
                        style={{ animationDelay: "2s" }}
                      ></div>
                    </div>

                    <div className="relative z-10 text-center space-y-8 p-8 max-w-2xl mx-auto">
                      {/* Hero Icon with Animation */}
                      <div className="relative">
                        <div className="w-32 h-32 mx-auto rounded-3xl bg-gradient-to-br from-sky-400/20 via-purple-500/20 to-emerald-500/20 flex items-center justify-center backdrop-blur-xl border border-sky-400/30 shadow-2xl group hover:scale-105 transition-all duration-500">
                          {/* Rotating background */}
                          <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 to-purple-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-spin-slow"></div>
                          <ClockIcon className="w-16 h-16 text-sky-400 relative z-10 group-hover:text-white transition-colors duration-300" />
                        </div>
                        {/* Floating particles */}
                        <div className="absolute -top-2 -right-2 w-4 h-4 bg-sky-400/40 rounded-full animate-bounce"></div>
                        <div
                          className="absolute -bottom-2 -left-2 w-3 h-3 bg-purple-400/40 rounded-full animate-bounce"
                          style={{ animationDelay: "0.5s" }}
                        ></div>
                      </div>

                      {/* Enhanced Text Content */}
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <h3 className="text-4xl font-black bg-gradient-to-r from-sky-300 via-purple-300 to-emerald-300 bg-clip-text text-transparent tracking-tight">
                            Your Creative Journey Begins Here
                          </h3>
                          <div className="w-24 h-1 bg-gradient-to-r from-sky-500 to-purple-500 rounded-full mx-auto"></div>
                        </div>

                        <p className="text-slate-200 text-xl font-medium max-w-lg mx-auto leading-relaxed">
                          Start generating amazing content and watch your
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400 font-bold">
                            {" "}
                            creative empire
                          </span>{" "}
                          come to life
                        </p>

                        <p className="text-slate-400 text-base max-w-md mx-auto leading-relaxed">
                          Every piece of content you create will be
                          intelligently organized here for easy access,
                          inspiration, and portfolio building
                        </p>
                      </div>

                      {/* Premium Feature Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                        <div className="bg-gradient-to-br from-sky-500/10 to-cyan-500/5 backdrop-blur-sm border border-sky-500/20 rounded-2xl p-6 hover:border-sky-400/40 transition-all duration-300 group">
                          <div className="w-12 h-12 bg-gradient-to-br from-sky-500/20 to-cyan-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <span className="text-2xl">����</span>
                          </div>
                          <h4 className="text-white font-bold text-lg mb-2">
                            Smart Analytics
                          </h4>
                          <p className="text-slate-400 text-sm">
                            Track performance and optimize your content strategy
                          </p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/5 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 hover:border-purple-400/40 transition-all duration-300 group">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <span className="text-2xl">🎯</span>
                          </div>
                          <h4 className="text-white font-bold text-lg mb-2">
                            Quick Actions
                          </h4>
                          <p className="text-slate-400 text-sm">
                            Reuse, remix, and repurpose your best content
                          </p>
                        </div>

                        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 backdrop-blur-sm border border-emerald-500/20 rounded-2xl p-6 hover:border-emerald-400/40 transition-all duration-300 group">
                          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-teal-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <span className="text-2xl">������</span>
                          </div>
                          <h4 className="text-white font-bold text-lg mb-2">
                            Export & Share
                          </h4>
                          <p className="text-slate-400 text-sm">
                            Professional export formats for all platforms
                          </p>
                        </div>
                      </div>

                      {/* Call to Action */}
                      <div className="space-y-4">
                        <button
                          onClick={() => setActiveTab("generator")}
                          className="group relative px-8 py-4 bg-gradient-to-r from-sky-600 via-purple-600 to-emerald-600 hover:from-sky-500 hover:via-purple-500 hover:to-emerald-500 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl hover:shadow-purple-500/25"
                        >
                          <span className="relative z-10 flex items-center space-x-3">
                            <GeneratorIcon className="w-5 h-5" />
                            <span>Create Your First Masterpiece</span>
                            <GeneratorIcon className="w-5 h-5" />
                          </span>
                          {/* Animated border */}
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-sky-600 via-purple-600 to-emerald-600 opacity-75 blur-lg group-hover:opacity-100 transition-opacity duration-300"></div>
                        </button>

                        {/* Progress Indicators with Premium Animation */}
                        <div className="flex justify-center space-x-3 pt-4">
                          <div className="relative">
                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-sky-400 to-cyan-400 animate-pulse shadow-lg shadow-sky-400/50"></div>
                            <div className="absolute inset-0 w-3 h-3 rounded-full bg-sky-400/30 animate-ping"></div>
                          </div>
                          <div
                            className="relative"
                            style={{ animationDelay: "0.5s" }}
                          >
                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse shadow-lg shadow-purple-400/50"></div>
                            <div
                              className="absolute inset-0 w-3 h-3 rounded-full bg-purple-400/30 animate-ping"
                              style={{ animationDelay: "0.5s" }}
                            ></div>
                          </div>
                          <div
                            className="relative"
                            style={{ animationDelay: "1s" }}
                          >
                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 animate-pulse shadow-lg shadow-emerald-400/50"></div>
                            <div
                              className="absolute inset-0 w-3 h-3 rounded-full bg-emerald-400/30 animate-ping"
                              style={{ animationDelay: "1s" }}
                            ></div>
                          </div>
                        </div>

                        <p className="text-slate-500 text-sm italic">
                          Join thousands of creators building their content
                          empire 👑
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {history.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-lg border flex items-start justify-between gap-4 ${viewingHistoryItemId === item.id ? "bg-slate-600 border-sky-500 shadow-lg" : "bg-slate-700/60 border-slate-600 hover:border-slate-500 hover:shadow-md transition-all"}`}
                  >
                    {" "}
                    <div className="flex-grow">
                      {" "}
                      <h4
                        className="text-md font-semibold text-sky-400 hover:text-sky-300 cursor-pointer mb-1"
                        onClick={() => handleViewHistoryItem(item)}
                      >
                        {CONTENT_TYPES.find(
                          (ct) => ct.value === item.contentType,
                        )?.label || item.contentType}{" "}
                        for {item.platform}
                      </h4>{" "}
                      <p
                        className="text-xs text-slate-400 mb-2 truncate"
                        title={item.userInput}
                      >
                        Input: {truncateText(item.userInput, 80)}
                      </p>{" "}
                      <div className="text-xxs text-slate-500 mb-2">
                        {formatTimestamp(item.timestamp)}{" "}
                        {item.aiPersonaId && (
                          <span className="ml-2 px-1.5 py-0.5 bg-purple-600/50 text-purple-300 rounded-full">
                            {allPersonas.find((p) => p.id === item.aiPersonaId)
                              ?.name || "Custom Persona"}
                          </span>
                        )}
                      </div>{" "}
                      <div className="text-sm text-slate-300 pr-1">
                        {" "}
                        {isGeneratedTextOutput(item.output)
                          ? truncateText(item.output.content, 200)
                          : isGeneratedImageOutput(item.output)
                            ? `[Generated Image - ${item.output.mimeType}]`
                            : `[Structured Output: ${item.contentType}]`}{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className="flex flex-col items-end space-y-1.5 shrink-0">
                      {" "}
                      <button
                        onClick={() => handleToggleFavorite(item.id)}
                        className={`p-1.5 rounded-md ${item.isFavorite ? "bg-yellow-500/20 text-yellow-400 hover:text-yellow-300" : "bg-slate-600/50 text-slate-400 hover:text-yellow-400"}`}
                        title={item.isFavorite ? "Unfavorite" : "Favorite"}
                      >
                        <StarIcon
                          className="h-4 w-4"
                          filled={item.isFavorite}
                        />
                      </button>{" "}
                      <button
                        onClick={() => handleReusePromptFromHistory(item)}
                        className="p-1.5 bg-slate-600/50 text-slate-400 hover:text-sky-400 rounded-md"
                        title="Reuse Prompt"
                      >
                        <RefreshCwIcon className="h-4 w-4" />
                      </button>{" "}
                      <button
                        onClick={() => handlePinToCanvas(item)}
                        className="p-1.5 bg-slate-600/50 text-slate-400 hover:text-teal-400 rounded-md"
                        title="Add to Canvas"
                      >
                        <PlusCircleIcon className="h-4 w-4" />
                      </button>{" "}
                      <button
                        onClick={() => handleDeleteHistoryItem(item.id)}
                        className="p-1.5 bg-slate-600/50 text-slate-400 hover:text-red-400 rounded-md"
                        title="Delete"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>{" "}
                    </div>{" "}
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === "search" && (
            <EnhancedWebSearch apiKeyMissing={apiKeyMissing} />
          )}
          {false && (
            <div className="flex-grow w-full relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
              {/* Animated Background Elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-sky-500/10 to-purple-500/10 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-orange-500/10 rounded-full blur-lg animate-pulse delay-1000"></div>
                <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-2xl animate-pulse delay-2000"></div>
              </div>

              {/* Main Content Container */}
              <div className="relative z-10 h-full flex flex-col lg:flex-row items-center justify-center gap-12 p-8 max-w-7xl mx-auto">
                {/* Left Side - Coming Soon Content */}
                <div className="flex-1 max-w-2xl text-center lg:text-left">
                  {/* Status Badge */}
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-sky-500/20 border border-purple-400/30 rounded-full px-4 py-2 mb-8">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    <span className="text-purple-300 font-semibold text-sm tracking-wide">
                      PREMIUM FEATURE
                    </span>
                  </div>

                  {/* Main Heading */}
                  <h1 className="text-5xl lg:text-6xl font-black mb-6 leading-tight">
                    <span className="bg-gradient-to-r from-sky-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                      AI-Powered
                    </span>
                    <br />
                    <span className="text-white">Asset Discovery</span>
                  </h1>

                  {/* Subtitle */}
                  <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                    Revolutionary content search that finds exactly what you
                    need, when you need it. Access millions of premium assets
                    with lightning-fast AI precision.
                  </p>

                  {/* Feature Showcase Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
                    <div className="group flex items-start space-x-4 p-6 bg-gradient-to-br from-slate-700/50 via-slate-700/30 to-slate-800/50 rounded-2xl border border-slate-600/40 backdrop-blur-sm hover:bg-gradient-to-br hover:from-slate-600/60 hover:via-slate-600/40 hover:to-slate-700/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                      <div className="w-12 h-12 bg-gradient-to-br from-sky-400/30 to-purple-500/30 rounded-xl flex items-center justify-center mt-1 group-hover:scale-110 transition-transform duration-300">
                        <span className="text-2xl">�������</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-slate-100 font-bold text-lg mb-2 group-hover:text-white transition-colors">
                          Lightning-Fast Search
                        </h4>
                        <p className="text-slate-400 leading-relaxed">
                          Find premium assets in milliseconds with our advanced
                          AI algorithms
                        </p>
                      </div>
                    </div>

                    <div className="group flex items-start space-x-4 p-6 bg-gradient-to-br from-slate-700/50 via-slate-700/30 to-slate-800/50 rounded-2xl border border-slate-600/40 backdrop-blur-sm hover:bg-gradient-to-br hover:from-slate-600/60 hover:via-slate-600/40 hover:to-slate-700/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400/30 to-emerald-500/30 rounded-xl flex items-center justify-center mt-1 group-hover:scale-110 transition-transform duration-300">
                        <span className="text-2xl">��������������</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-slate-100 font-bold text-lg mb-2 group-hover:text-white transition-colors">
                          Smart Filtering
                        </h4>
                        <p className="text-slate-400 leading-relaxed">
                          AI understands your exact needs and delivers perfect
                          matches
                        </p>
                      </div>
                    </div>

                    <div className="group flex items-start space-x-4 p-6 bg-gradient-to-br from-slate-700/50 via-slate-700/30 to-slate-800/50 rounded-2xl border border-slate-600/40 backdrop-blur-sm hover:bg-gradient-to-br hover:from-slate-600/60 hover:via-slate-600/40 hover:to-slate-700/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-400/30 to-sky-500/30 rounded-xl flex items-center justify-center mt-1 group-hover:scale-110 transition-transform duration-300">
                        <span className="text-2xl">💎</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-slate-100 font-bold text-lg mb-2 group-hover:text-white transition-colors">
                          Premium Quality
                        </h4>
                        <p className="text-slate-400 leading-relaxed">
                          Only the highest quality assets from verified creators
                        </p>
                      </div>
                    </div>

                    <div className="group flex items-start space-x-4 p-6 bg-gradient-to-br from-slate-700/50 via-slate-700/30 to-slate-800/50 rounded-2xl border border-slate-600/40 backdrop-blur-sm hover:bg-gradient-to-br hover:from-slate-600/60 hover:via-slate-600/40 hover:to-slate-700/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-400/30 to-orange-500/30 rounded-xl flex items-center justify-center mt-1 group-hover:scale-110 transition-transform duration-300">
                        <span className="text-2xl">⚡</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-slate-100 font-bold text-lg mb-2 group-hover:text-white transition-colors">
                          One-Click Download
                        </h4>
                        <p className="text-slate-400 leading-relaxed">
                          Instant access to your content with seamless downloads
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Value Proposition Section */}
                  <div className="bg-gradient-to-r from-slate-800/50 via-slate-700/50 to-slate-800/50 rounded-3xl p-8 border border-slate-600/30 backdrop-blur-sm max-w-4xl w-full">
                    <div className="text-center space-y-6">
                      <h3 className="text-3xl font-bold text-slate-100">
                        Why Creators Choose Our Premium Search
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="space-y-3">
                          <div className="text-4xl font-black text-sky-400">
                            10M+
                          </div>
                          <div className="text-slate-300 font-medium">
                            Premium Assets
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="text-4xl font-black text-purple-400">
                            99.9%
                          </div>
                          <div className="text-slate-300 font-medium">
                            Search Accuracy
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="text-4xl font-black text-emerald-400">
                            50X
                          </div>
                          <div className="text-slate-300 font-medium">
                            Faster Results
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Launch Timeline & CTA */}
                  <div className="text-center space-y-8 max-w-2xl">
                    <div className="flex items-center justify-center space-x-8">
                      <div className="flex items-center space-x-3 px-4 py-2 bg-slate-700/50 rounded-full border border-slate-600/40">
                        <ClockIcon className="w-5 h-5 text-sky-400" />
                        <span className="text-slate-300 font-medium">
                          Coming Q2 2024
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 px-4 py-2 bg-slate-700/50 rounded-full border border-slate-600/40">
                        <UsersIcon className="w-5 h-5 text-purple-400" />
                        <span className="text-slate-300 font-medium">
                          Early access for Pro users
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <button
                        onClick={handleWebSearchNotifyMeClick}
                        className="group relative px-12 py-4 bg-gradient-to-r from-sky-500 via-purple-600 to-emerald-500 hover:from-sky-600 hover:via-purple-700 hover:to-emerald-600 text-white font-bold text-lg rounded-2xl shadow-2xl transition-all duration-500 hover:shadow-3xl hover:scale-110 transform"
                      >
                        <span className="flex items-center space-x-3">
                          <StarIcon className="w-6 h-6 group-hover:animate-spin" />
                          <span>Get Early Access</span>
                          <ArrowUpRightIcon className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-sky-400/20 to-purple-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                      </button>

                      <p className="text-slate-400 text-sm">
                        ������� Join{" "}
                        <span className="text-sky-400 font-semibold">
                          2,500+
                        </span>{" "}
                        creators waiting in line ������ ����{" "}
                        <span className="text-emerald-400 font-semibold">
                          40% OFF
                        </span>{" "}
                        early bird pricing
                      </p>
                    </div>
                  </div>

                  {/* Animated Progress Indicator */}
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full bg-emerald-400 animate-pulse shadow-lg"></div>
                    <div
                      className="w-4 h-4 rounded-full bg-sky-400 animate-pulse shadow-lg"
                      style={{ animationDelay: "0.5s" }}
                    ></div>
                    <div
                      className="w-4 h-4 rounded-full bg-purple-400 animate-pulse shadow-lg"
                      style={{ animationDelay: "1s" }}
                    ></div>
                    <div
                      className="w-4 h-4 rounded-full bg-pink-400/50 animate-pulse shadow-lg"
                      style={{ animationDelay: "1.5s" }}
                    ></div>
                    <div className="w-4 h-4 rounded-full bg-slate-600 shadow-lg"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === "creativity" && (
            <CreativityWorldClass
              onNavigateToTab={setActiveTab}
            />
          )}
          {activeTab === "thumbnailMaker" && (
            <ThumbnailsWorldClass
              userPlan={userPlan}
              onNavigateToTab={setActiveTab}
            />
          )}

          {false && activeTab === "thumbnailMaker" && (
            <div className="flex-1 w-full relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen">
              {/* Animated Background Elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-sky-500/10 to-purple-500/10 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-pink-500/10 to-orange-500/10 rounded-full blur-lg animate-pulse delay-1000"></div>
                <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-full blur-2xl animate-pulse delay-2000"></div>
              </div>

              {/* Main Content Container */}
              <div className="relative z-10 flex flex-col lg:flex-row items-start justify-between gap-6 p-4 w-full">
                {/* Left Side - Coming Soon Content */}
                <div className="flex-1 max-w-2xl">
                  {/* Status Badge */}
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/30 rounded-full px-3 py-1.5 mb-6">
                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></div>
                    <span className="text-amber-300 font-semibold text-xs tracking-wide">
                      LAUNCHING SOON
                    </span>
                  </div>

                  {/* Main Heading */}
                  <h1 className="text-4xl lg:text-5xl font-black mb-4 leading-tight">
                    <span className="bg-gradient-to-r from-sky-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Premium
                    </span>
                    <br />
                    <span className="text-white">Thumbnail Studio</span>
                  </h1>

                  {/* Subtitle */}
                  <p className="text-lg text-slate-300 mb-6 leading-relaxed">
                    Create viral-ready YouTube thumbnails in minutes with AI-powered
                    design tools, professional templates, and golden ratio composition
                    guides.
                  </p>

                  {/* Feature Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-8">
                    {[
                      {
                        icon: "✨",
                        title: "AI Design Assistant",
                        desc: "Smart suggestions for colors, text placement, and visual hierarchy",
                      },
                      {
                        icon: "🎨",
                        title: "Professional Templates",
                        desc: "100+ proven high-CTR thumbnail designs across niches",
                      },
                      {
                        icon: "📏",
                        title: "Golden Ratio Guides",
                        desc: "Perfect composition with mathematical precision",
                      },
                      {
                        icon: "���",
                        title: "1-Click Export",
                        desc: "HD 1920×1080 ready for YouTube upload",
                      },
                    ].map((feature, index) => (
                      <div
                        key={`analysis-item-${index}-${Date.now()}`}
                        className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-3"
                      >
                        <div className="flex items-start gap-2">
                          <div className="text-lg">{feature.icon}</div>
                          <div>
                            <h3 className="font-semibold text-white text-sm leading-tight">
                              {feature.title}
                            </h3>
                            <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                              {feature.desc}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleNotifyMeClick}
                      className="px-6 py-3 bg-gradient-to-r from-sky-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 text-white font-semibold rounded-lg text-sm transition-all duration-300"
                    >
                      <div className="flex items-center gap-2">
                        <span>🔔</span>
                        <span>Get Notified When Ready</span>
                      </div>
                    </button>
                    <button
                      onClick={handleViewPreview}
                      className="px-6 py-3 border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white font-semibold rounded-lg text-sm transition-all duration-300"
                    >
                      <div className="flex items-center gap-2">
                        <PhotoIcon className="w-4 h-4" />
                        <span>View Preview</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Right Side - Interactive Preview */}
                <div className="flex-1 lg:max-w-xl">
                  <div className="relative">
                    {/* Preview Frame */}
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700/50 shadow-2xl">
                      <div className="text-center mb-6">
                        <h3 className="text-white font-semibold mb-2">
                          Live Preview
                        </h3>
                        <p className="text-slate-400 text-sm">
                          See what's coming...
                        </p>
                      </div>

                      {/* Mock Thumbnail Canvas */}
                      <div className="relative aspect-video bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl overflow-hidden border border-slate-600/50">
                        {/* Grid Overlay */}
                        <div className="absolute inset-0 opacity-20">
                          <div className="w-full h-full grid grid-cols-3 grid-rows-3">
                            {Array.from({ length: 9 }).map((_, i) => (
                              <div
                                key={i}
                                className="border border-sky-400/30"
                              ></div>
                            ))}
                          </div>
                        </div>

                        {/* Mock Content */}
                        <div className="absolute inset-4 flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-sky-500/30 to-purple-500/30 rounded-xl flex items-center justify-center mb-4 mx-auto animate-pulse">
                              <PhotoIcon className="w-8 h-8 text-sky-400" />
                            </div>
                            <div className="space-y-2">
                              <div className="h-3 bg-slate-600/50 rounded-full w-24 mx-auto animate-pulse"></div>
                              <div className="h-2 bg-slate-600/30 rounded-full w-16 mx-auto animate-pulse delay-200"></div>
                            </div>
                          </div>
                        </div>

                        {/* Floating Elements */}
                        <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-lg flex items-center justify-center animate-bounce">
                          <SparklesIcon className="w-4 h-4 text-amber-400" />
                        </div>
                      </div>

                      {/* Tool Preview */}
                      <div className="mt-6 flex items-center justify-center gap-4">
                        {[
                          { icon: TypeToolIcon, color: "text-blue-400" },
                          { icon: PhotoIcon, color: "text-green-400" },
                          { icon: SparklesIcon, color: "text-purple-400" },
                          { icon: WandIcon, color: "text-pink-400" },
                        ].map((tool, index) => (
                          <div
                            key={`icon-grid-${index}-${Date.now()}`}
                            className="w-10 h-10 bg-slate-700/50 rounded-lg flex items-center justify-center hover:bg-slate-600/50 transition-colors cursor-pointer"
                          >
                            <tool.icon className={`w-5 h-5 ${tool.color}`} />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Floating Badge */}
                    <div className="absolute -top-3 -right-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce">
                      AI Powered
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Template Carousel Section */}
              <div className="mt-4 mb-4">
                <div className="text-center mb-3 px-8">
                  <h2 className="text-xl font-bold text-white mb-1">
                    Template Gallery Preview
                  </h2>
                  <p className="text-slate-400 text-sm">
                    Professional templates coming soon
                  </p>
                </div>

                {/* Template Carousel */}
                <div className="relative overflow-hidden rounded-xl bg-slate-800/20 border border-slate-700/30 p-4 mx-8">
                  <div className="flex gap-3 animate-slide">
                    {/* Template Cards */}
                    {[
                      {
                        category: "Gaming",
                        title: "Epic Victory",
                        color: "from-red-500 to-orange-500",
                        bgColor: "bg-red-900/20",
                        accent: "text-red-400"
                      },
                      {
                        category: "Tech Review",
                        title: "iPhone 15 Pro",
                        color: "from-blue-500 to-cyan-500",
                        bgColor: "bg-blue-900/20",
                        accent: "text-blue-400"
                      },
                      {
                        category: "Tutorial",
                        title: "Learn React",
                        color: "from-green-500 to-emerald-500",
                        bgColor: "bg-green-900/20",
                        accent: "text-green-400"
                      },
                      {
                        category: "Lifestyle",
                        title: "Morning Routine",
                        color: "from-purple-500 to-pink-500",
                        bgColor: "bg-purple-900/20",
                        accent: "text-purple-400"
                      },
                      {
                        category: "Food",
                        title: "Quick Recipe",
                        color: "from-yellow-500 to-orange-500",
                        bgColor: "bg-yellow-900/20",
                        accent: "text-yellow-400"
                      },
                      {
                        category: "Travel",
                        title: "Tokyo Vlog",
                        color: "from-indigo-500 to-purple-500",
                        bgColor: "bg-indigo-900/20",
                        accent: "text-indigo-400"
                      }
                    ].map((template, index) => (
                      <div
                        key={`metric-${index}-${Date.now()}`}
                        className="flex-shrink-0 w-48 group cursor-pointer"
                      >
                        <div className="relative">
                          {/* Thumbnail Preview */}
                          <div className={`aspect-video ${template.bgColor} rounded-xl border border-slate-600/50 overflow-hidden relative group-hover:scale-105 transition-transform duration-300`}>
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-10">
                              <div className="w-full h-full bg-gradient-to-br opacity-30" style={{
                                backgroundImage: `linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.1) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.1) 75%)`
                              }}></div>
                            </div>

                            {/* Content */}
                            <div className="absolute inset-0 p-3 flex flex-col justify-between">
                              <div className={`inline-flex self-start px-2 py-1 bg-gradient-to-r ${template.color} rounded-full text-white text-xs font-bold`}>
                                {template.category}
                              </div>

                              <div className="text-center">
                                <h3 className="text-white font-bold text-lg leading-tight">
                                  {template.title}
                                </h3>
                                <div className={`w-8 h-1 bg-gradient-to-r ${template.color} rounded-full mx-auto mt-2`}></div>
                              </div>

                              <div className="flex justify-between items-end">
                                <div className="flex items-center gap-1">
                                  <div className="w-6 h-6 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full"></div>
                                  <span className="text-slate-300 text-xs">Creator</span>
                                </div>
                                <span className={`${template.accent} text-xs font-semibold`}>
                                  HD
                                </span>
                              </div>
                            </div>

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <div className="text-white text-sm font-semibold bg-black/50 px-3 py-1 rounded-full">
                                Preview
                              </div>
                            </div>
                          </div>

                          {/* Template Info */}
                          <div className="mt-2 text-center">
                            <h4 className="text-white font-semibold text-xs">
                              {template.category}
                            </h4>
                            <p className="text-slate-400 text-xs">
                              Professional
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Carousel Indicators */}
                <div className="flex justify-center mt-2 gap-1">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-slate-600/50 animate-pulse"
                      style={{ animationDelay: `${i * 0.5}s` }}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Bottom Features Ticker */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-sm border-t border-slate-700/50 py-4">
                <div className="flex items-center justify-center gap-8 text-slate-400 text-sm overflow-hidden">
                  <div className="flex items-center gap-8 animate-scroll">
                    <span className="flex items-center gap-2">
                      <span>📐</span> Golden Ratio Guides
                    </span>
                    <span className="flex items-center gap-2">
                      <span>��</span> Click-Through Rate Optimizer
                    </span>
                    <span className="flex items-center gap-2">
                      <span>��️</span> Smart Background Removal
                    </span>
                    <span className="flex items-center gap-2">
                      <span>����</span> Cloud Save & Sync
                    </span>
                    <span className="flex items-center gap-2">
                      <span>📱</span> Mobile Preview
                    </span>
                    <span className="flex items-center gap-2">
                      <span>���</span> Instant Export
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "youtubeStats" && (
            <div className="flex-grow md:w-full relative overflow-hidden">
              {/* Premium Background with Glass Morphism */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900/40 via-slate-800/30 to-slate-900/60 backdrop-blur-2xl"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/5 via-transparent to-purple-500/5"></div>

              {/* Animated Background Elements */}
              <div className="absolute top-10 right-10 w-32 h-32 bg-sky-500/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-10 left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

              <div className="relative z-10 h-full flex flex-col space-y-8">
                {/* Premium Header Section */}
                <YouTubeStatsWorldClass
                  key={youtubeStatsData.length > 0 ? youtubeStatsData[youtubeStatsData.length - 1].id : 'no-data'}
                  statsData={
                    youtubeStatsData.length > 0
                      ? youtubeStatsData[youtubeStatsData.length - 1].content
                      : undefined
                  }
                  isLoading={
                    isGenerating && generationSourceTab === "youtubeStats"
                  }
                  onAnalyzeChannel={(channelUrl) => {
                    setYoutubeStatsInput(channelUrl);
                    setUserInput(channelUrl);
                    setActiveTab("youtubeStats");
                    // Pass parameters directly to avoid state timing issues
                    handleGenerateContent({
                      youtubeStatsInput: channelUrl,
                      activeTab: "youtubeStats"
                    });
                  }}
                  onGenerateReport={generateChannelTable}
                  youtubeStatsData={youtubeStatsData}
                  isGenerating={isGenerating}
                />

                {/* Premium Input Section - HIDDEN */}
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 mb-6 shadow-2xl" style={{display: 'none'}}>
                  <div className="space-y-6">
                    <div>
                      <label
                        htmlFor="youtubeStatsInput"
                        className="flex items-center text-lg font-semibold text-sky-300 mb-4"
                      >
                        <span className="w-2 h-2 bg-sky-400 rounded-full mr-3 animate-pulse"></span>
                        YouTube Channels
                      </label>
                      <div className="relative">
                        <textarea
                          id="youtubeStatsInput"
                          value={userInput}
                          onChange={(e) => setUserInput(e.target.value)}
                          placeholder="e.g., @MrBeast, PewDiePie, or https://www.youtube.com/@PewDiePie (channel names work too!)"
                          rows={3}
                          className="w-full p-4 bg-gradient-to-br from-slate-700/50 to-slate-800/50 border-2 border-slate-600/50 focus:border-sky-400/70 rounded-2xl text-slate-100 placeholder-slate-400 backdrop-blur-sm transition-all duration-300 focus:shadow-lg focus:shadow-sky-500/20 resize-none text-base"
                        />
                        <div className="absolute bottom-3 right-3 text-xs text-slate-500">
                          {
                            userInput.split(",").filter((url) => url.trim())
                              .length
                          }{" "}
                          {userInput.split(",").filter((url) => url.trim())
                            .length === 1
                            ? "channel"
                            : "channels"}
                        </div>
                      </div>
                      <p className="text-slate-400 text-sm mt-2">
                        �������� <strong>Tip:</strong> You can use channel names like
                        "PewDiePie" or handles like "@MrBeast" - full URLs work
                        great too but aren't required!
                      </p>
                    </div>

                    {/* Channel Size Guidance */}
                    <CollapsibleGuidelines
                      title="Best Results Channel Guidelines"
                      icon="📈"
                      guidelines={[
                        {
                          status: "������ Optimal:",
                          color: "text-green-400",
                          text: "10K+ subscribers, 20+ videos, consistent uploads",
                        },
                        {
                          status: "⚠ Minimum:",
                          color: "text-yellow-400",
                          text: "1K+ subscribers, 10+ videos, active engagement",
                        },
                        {
                          status: "������ Poor results:",
                          color: "text-red-400",
                          text: "Under 1K subscribers, few videos, dormant channels",
                        },
                      ]}
                      bgGradient="bg-gradient-to-r from-sky-500/10 to-blue-500/10"
                      borderColor="border border-sky-500/20"
                      titleColor="text-sky-300"
                    />

                    <div className="flex flex-wrap gap-4">
                      <button
                        onClick={handleGenerateContent}
                        disabled={isGenerating || !userInput.trim()}
                        className="group relative px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 disabled:from-slate-600 disabled:to-slate-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-red-500/30 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative flex items-center justify-center space-x-3">
                          {isGenerating &&
                          generationSourceTab === "youtubeStats" ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              <span className="text-lg">������ Analyzing...</span>
                            </>
                          ) : (
                            <>
                              <PlayCircleIcon className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                              <span className="text-lg">
                                📊 Analyze Channels (2 credits)
                              </span>
                            </>
                          )}
                        </div>
                      </button>


                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-gradient-to-r from-red-900/30 to-red-800/30 border border-red-500/50 rounded-xl p-4 backdrop-blur-sm">
                    <div className="flex items-center space-x-3">
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-400 flex-shrink-0" />
                      <div>
                        <h4 className="text-red-300 font-medium">
                          Analysis Error
                        </h4>
                        <p className="text-red-200/80 text-sm mt-1">{error}</p>
                      </div>
                    </div>
                  </div>
                )}


                {channelTableData.length > 0 && (
                  <div id="channel-comparison-table" className="bg-slate-900/40 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-b border-slate-700/50 p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <ChartBarIcon className="h-6 w-6 text-blue-400" />
                          <div>
                            <h3 className="text-xl font-bold text-white">
                              Channel Comparison Report
                            </h3>
                            <p className="text-slate-400 text-sm">
                              Detailed performance analysis across channels
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-xs text-slate-500 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-600/50">
                            {channelTableData.length}{" "}
                            {channelTableData.length === 1
                              ? "Channel"
                              : "Channels"}
                          </div>
                          <select
                            id="sortChannels"
                            value={sortType}
                            onChange={(e) => setSortType(e.target.value)}
                            className="bg-slate-800/50 border border-slate-600/50 text-slate-300 text-sm rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm"
                          >
                            <option value="">Default Order</option>
                            <option value="mostSubscribers">
                              Most Subscribers
                            </option>
                            <option value="leastSubscribers">
                              Least Subscribers
                            </option>
                            <option value="mostVideos">Most Videos</option>
                            <option value="leastVideos">Least Videos</option>
                            <option value="mostTotalViews">
                              Most Total Views
                            </option>
                            <option value="leastTotalViews">
                              Least Total Views
                            </option>
                            <option value="mostAvgViews">
                              Most Avg. Views/Video
                            </option>
                            <option value="channelNameAsc">
                              Channel Name (A-Z)
                            </option>
                            <option value="channelNameDesc">
                              Channel Name (Z-A)
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left table-auto border-collapse">
                        <thead>
                          <tr className="bg-slate-800/60 backdrop-blur-sm">
                            <th className="p-4 border-b border-slate-700/50 text-slate-300 font-semibold">
                              <div className="flex items-center space-x-2">
                                <UserCircleIcon className="h-4 w-4" />
                                <span>Channel</span>
                              </div>
                            </th>
                            <th className="p-4 border-b border-slate-700/50 text-slate-300 font-semibold">
                              <div className="flex items-center space-x-2">
                                <UsersIcon className="h-4 w-4" />
                                <span>Subscribers</span>
                              </div>
                            </th>
                            <th className="p-4 border-b border-slate-700/50 text-slate-300 font-semibold">
                              <div className="flex items-center space-x-2">
                                <PlayCircleIcon className="h-4 w-4" />
                                <span>Videos</span>
                              </div>
                            </th>
                            <th className="p-4 border-b border-slate-700/50 text-slate-300 font-semibold">
                              <div className="flex items-center space-x-2">
                                <EyeIcon className="h-4 w-4" />
                                <span>Total Views</span>
                              </div>
                            </th>
                            <th className="p-4 border-b border-slate-700/50 text-slate-300 font-semibold">
                              <div className="flex items-center space-x-2">
                                <TrendingUpIcon className="h-4 w-4" />
                                <span>Avg/Video</span>
                              </div>
                            </th>
                            <th className="p-4 border-b border-slate-700/50 text-slate-300 font-semibold text-center">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortChannels(channelTableData, sortType).map(
                            (entry, index) => (
                              <tr
                                key={entry.id}
                                className="border-b border-slate-700/30 hover:bg-slate-800/40 transition-all duration-200 group"
                              >
                                <td className="p-4">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-lg flex items-center justify-center border border-red-500/30">
                                      <PlayCircleIcon className="h-4 w-4 text-red-400" />
                                    </div>
                                    <div>
                                      <div className="text-slate-200 font-medium">
                                        {entry.channelName}
                                      </div>
                                      <div className="text-xs text-slate-500">
                                        Rank #{index + 1}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <div className="text-slate-300 font-medium">
                                    {entry.subscribers.toLocaleString()}
                                  </div>
                                  <div className="text-xs text-slate-500">
                                    subscribers
                                  </div>
                                </td>
                                <td className="p-4">
                                  <div className="text-slate-300 font-medium">
                                    {entry.videos.toLocaleString()}
                                  </div>
                                  <div className="text-xs text-slate-500">
                                    videos
                                  </div>
                                </td>
                                <td className="p-4">
                                  <div className="text-slate-300 font-medium">
                                    {entry.totalViews.toLocaleString()}
                                  </div>
                                  <div className="text-xs text-slate-500">
                                    total views
                                  </div>
                                </td>
                                <td className="p-4">
                                  <div className="text-slate-300 font-medium">
                                    {entry.averageViewsPerVideo.toLocaleString()}
                                  </div>
                                  <div className="text-xs text-slate-500">
                                    avg per video
                                  </div>
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center justify-center space-x-2">
                                    <button
                                      onClick={() =>
                                        handlePinChannelTableEntryToCanvas(
                                          entry,
                                        )
                                      }
                                      className="p-2 bg-teal-600/20 hover:bg-teal-600/40 text-teal-400 hover:text-teal-300 rounded-lg border border-teal-500/30 transition-all duration-200 group-hover:scale-105"
                                      title="Add to Canvas"
                                    >
                                      <PlusCircleIcon className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDeleteChannelTableEntry(entry.id)
                                      }
                                      className="p-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 hover:text-red-300 rounded-lg border border-red-500/30 transition-all duration-200 group-hover:scale-105"
                                      title="Delete"
                                    >
                                      <TrashIcon className="h-4 w-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ),
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {youtubeStatsData.length > 0 && (
                  <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-b border-slate-700/50 p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <ChartBarIcon className="h-6 w-6 text-purple-400" />
                          <div>
                            <h3 className="text-xl font-bold text-white">
                              Detailed Analytics
                            </h3>
                            <p className="text-slate-400 text-sm">
                              Individual channel performance insights
                            </p>
                          </div>
                        </div>
                        <div className="text-xs text-slate-500 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-600/50">
                          {youtubeStatsData.length}{" "}
                          {youtubeStatsData.length === 1
                            ? "Analysis"
                            : "Analyses"}
                        </div>
                      </div>
                    </div>
                    <div className="p-6 space-y-6">
                      {youtubeStatsData.map((entry, index) => (
                        <div
                          key={entry.id}
                          className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden hover:border-slate-600/50 transition-all duration-200 group"
                        >
                          <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center border border-purple-500/30">
                                  <PlayCircleIcon className="h-5 w-5 text-purple-400" />
                                </div>
                                <div>
                                  <h4 className="text-lg font-semibold text-white">
                                    Analysis #{index + 1}
                                  </h4>
                                  <p className="text-sm text-slate-400">
                                    {truncateText(entry.userInput, 60)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2"></div>
                            </div>

                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700/50">
                              <div className="flex items-center space-x-2 text-xs text-slate-500">
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                <span>
                                  Generated: {formatTimestamp(entry.timestamp)}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2 text-xs text-slate-500">
                                <ChartBarIcon className="h-3 w-3" />
                                <span>{entry.content.length} characters</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          </div>
          )}
        </main>

        {/* Mobile Bottom Navigation */}
        <div className="mobile-only">
          <MobileBottomNavigation
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            user={user}
            userPlan={userPlan}
            onSignOut={handleSignOut}
            onNavigateToBilling={() => onNavigateToBilling?.()}
            onNavigateToAccount={() => onNavigateToAccount?.()}
          />
        </div>

        {/* Mobile Floating Action Button */}
        <div className="mobile-only">
          <MobileFloatingActionButton
            onQuickGenerate={() => {
              setActiveTab('generator');
            }}
            onCreateContent={() => setActiveTab('generator')}
            onOpenCanvas={() => setActiveTab('canvas')}
          />
        </div>

        {/* Tab-Specific Progress Notifications - Only show on tab that initiated generation */}
        {activeTab === "generator" && generationSourceTab === "generator" && (
          <ProgressNotification
            isVisible={isGenerating}
            steps={generationSteps}
            currentStep={currentStepId}
            allowContinueWork={true}
            startTime={startTime}
          />
        )}

        {/* DEBUG: Log what's happening */}
        {console.log(
          "🐛 DEBUG: activeTab =",
          activeTab,
          "generationSourceTab =",
          generationSourceTab,
          "isGenerating =",
          isGenerating,
        )}

        {activeTab === "channelAnalysis" &&
          generationSourceTab === "channelAnalysis" && (
            <ProgressNotification
              isVisible={isGenerating}
              steps={generationSteps}
              currentStep={currentStepId}
              allowContinueWork={true}
              startTime={startTime}
            />
          )}

        {generationSourceTab === "strategy" && (
          <ProgressNotification
            isVisible={isGeneratingStrategy}
            steps={generationSteps}
            currentStep={currentStepId}
            allowContinueWork={true}
            startTime={strategyGenerationStartTime}
          />
        )}

        {activeTab === "youtubeStats" &&
          generationSourceTab === "youtubeStats" && (
            <ProgressNotification
              isVisible={isGenerating}
              steps={generationSteps}
              currentStep={currentStepId}
              allowContinueWork={true}
              startTime={startTime}
            />
          )}

        {activeTab === "account" && (
          <div className="mobile-container p-4">
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold text-white mb-4">Account & Settings</h2>
              <p className="text-slate-400 mb-6">Manage your profile, billing, and preferences</p>

              <div className="space-y-4 max-w-md mx-auto">
                <button
                  onClick={() => onNavigateToBilling?.()}
                  className="mobile-btn mobile-btn-primary w-full"
                >
                  Billing & Credits
                </button>
                <button
                  onClick={() => onNavigateToAccount?.()}
                  className="mobile-btn mobile-btn-secondary w-full"
                >
                  Account Settings
                </button>
                <button
                  onClick={handleSignOut}
                  className="mobile-btn mobile-btn-secondary w-full text-red-400 hover:text-red-300"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="mobile-container">
            <SettingsPage
              userPlan={userPlan}
              isPremium={isPremium}
            />
          </div>
        )}

        {activeTab === "trends" && generationSourceTab === "trends" && (
          <ProgressNotification
            isVisible={isGenerating}
            steps={generationSteps}
            currentStep={currentStepId}
            allowContinueWork={true}
            startTime={startTime}
          />
        )}

        {/* Progress notification for idea expansion - shows on any tab */}
        {isExpandingIdea && (
          <ProgressNotification
            isVisible={isGenerating}
            steps={generationSteps}
            currentStep={currentStepId}
            allowContinueWork={true}
            startTime={startTime}
          />
        )}

        {/* Multi-Generation Widget */}
        <MultiGenerationWidget
          tasks={[]}
          onCancel={() => {}}
          onClearCompleted={() => {}}
        />

        {false && showTemplateModal &&
          renderModal(
            currentTemplate ? "Edit Template" : "Save/Load Template",
            () => {
              setShowTemplateModal(false);
              setCurrentTemplate(null);
            },
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-medium text-sky-300 flex items-center gap-2">
                  <SaveIcon className="h-5 w-5" />
                  {currentTemplate ? "Edit Template" : "Template Manager"}
                </h4>
                <div className="text-xs bg-slate-700/50 px-2 py-1 rounded-md text-slate-400">
                  Personal Templates
                </div>
              </div>

              {!currentTemplate && (
                <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-xl">💡</div>
                    <div>
                      <h5 className="text-sm font-medium text-slate-200 mb-1">
                        What are Templates?
                      </h5>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Templates save your current generator settings
                        (platform, content type, text, etc.) so you can reuse
                        them later. Perfect for workflows you use repeatedly.
                      </p>
                      <div className="mt-2 text-xs text-slate-500">
                        �� <strong>Looking for viral content patterns?</strong>{" "}
                        Check Premium Generator Features for 50+ professional
                        templates with proven performance metrics.
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {currentTemplate && (
                <div>
                  <label
                    htmlFor="templateNameEdit"
                    className="block text-xs text-slate-400 mb-1"
                  >
                    Template Name
                  </label>
                  <input
                    type="text"
                    id="templateNameEdit"
                    value={currentTemplate.name}
                    onChange={(e) =>
                      setCurrentTemplate({
                        ...currentTemplate!,
                        name: e.target.value,
                      })
                    }
                    className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-sm"
                  />
                </div>
              )}
              <div className="flex space-x-3">
                <button
                  onClick={handleSaveTemplate}
                  className="flex-1 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-md transition-colors text-sm"
                >
                  {currentTemplate ? "Update Template" : "Save Current as New"}
                </button>
                {currentTemplate && (
                  <button
                    onClick={() => {
                      setCurrentTemplate(null);
                    }}
                    className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-md transition-colors text-sm"
                  >
                    Save as New Instead
                  </button>
                )}
              </div>
              <hr className="border-slate-600 my-3" />
              <div className="flex items-center justify-between">
                <h4 className="text-md font-medium text-sky-300">
                  Your Saved Templates ({templates.length})
                </h4>
                {templates.length > 0 && (
                  <div className="text-xs text-slate-400">
                    Click to load or edit
                  </div>
                )}
              </div>

              {templates.length === 0 && (
                <div className="text-center py-8 bg-slate-700/20 rounded-lg border border-dashed border-slate-600">
                  <div className="text-3xl mb-2">��</div>
                  <p className="text-sm text-slate-400 mb-2">
                    No saved templates yet
                  </p>
                  <p className="text-xs text-slate-500">
                    Save your current generator settings to create your first
                    template
                  </p>
                </div>
              )}

              <div className="space-y-2 pr-1 max-h-64 overflow-y-auto">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="p-3 bg-slate-700/50 hover:bg-slate-700/70 rounded-lg border border-slate-600/30 transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-200 mb-1">
                          {template.name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span className="bg-slate-600/50 px-2 py-0.5 rounded">
                            {template.contentType}
                          </span>
                          <span className="bg-slate-600/50 px-2 py-0.5 rounded">
                            {template.platform}
                          </span>
                          {template.targetAudience && (
                            <span className="bg-purple-600/30 px-2 py-0.5 rounded">
                              {template.targetAudience}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleLoadTemplate(template)}
                          className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs rounded-md transition-colors flex items-center gap-1"
                        >
                          <span>�����</span> Load
                        </button>
                        <button
                          onClick={() => {
                            setCurrentTemplate(template);
                          }}
                          className="px-2 py-1.5 bg-slate-600 hover:bg-slate-500 text-white text-xs rounded-md transition-colors flex items-center gap-1"
                        >
                          <span>���</span> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="px-2 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs rounded-md transition-colors flex items-center gap-1"
                        >
                          <span>��</span>
                        </button>
                      </div>
                    </div>
                    {template.userInput && (
                      <div className="mt-2 pt-2 border-t border-slate-600/30">
                        <p className="text-xs text-slate-400 mb-1">Preview:</p>
                        <p className="text-xs text-slate-300 bg-slate-800/30 p-2 rounded border-l-2 border-slate-500">
                          {template.userInput.length > 100
                            ? `${template.userInput.substring(0, 100)}...`
                            : template.userInput}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>,
            "max-w-lg",
          )}

        <AdvancedTemplateManager
          isOpen={showTemplateModal}
          onClose={() => {
            setShowTemplateModal(false);
            setCurrentTemplate(null);
          }}
          templates={templates}
          onSaveTemplate={(template: PromptTemplate) => {
            const newTemplate = {
              ...template,
              userInput,
              platform,
              contentType,
              targetAudience,
              batchVariations,
              includeCTAs,
              selectedImageStyles,
              selectedImageMoods,
              negativePrompt: negativeImagePrompt,
              seoKeywords,
              seoMode,
              seoIntensity,
              abTestConfig: { isABTesting, abTestType },
              aiPersonaId: selectedAiPersonaId,
              aspectRatioGuidance,
              videoLength,
              customVideoLength,
            };
            setTemplates([...templates, newTemplate]);
          }}
          onLoadTemplate={handleLoadTemplate}
          onDeleteTemplate={handleDeleteTemplate}
          onDuplicateTemplate={handleDuplicateTemplate}
          currentState={{
            platform,
            contentType,
            userInput,
            targetAudience,
            seoKeywords,
            batchVariations,
            includeCTAs,
            selectedImageStyles,
            selectedImageMoods,
            negativeImagePrompt,
            seoMode,
            seoIntensity,
            abTestConfig: { isABTesting, abTestType },
            aiPersonaId: selectedAiPersonaId,
            aspectRatioGuidance,
            videoLength,
            customVideoLength,
          }}
        />

        {showPersonaModal &&
          renderModal(
            editingPersona?.isCustom
              ? "Edit Custom Persona"
              : "Create Custom AI Persona",
            () => {
              setShowPersonaModal(false);
              setEditingPersona(null);
            },
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editingPersona) handleSavePersona(editingPersona);
              }}
              className="space-y-3"
            >
              <div>
                <label
                  htmlFor="personaName"
                  className="block text-xs text-slate-400 mb-1"
                >
                  Persona Name
                </label>
                <input
                  type="text"
                  id="personaName"
                  value={editingPersona?.name || ""}
                  onChange={(e) =>
                    setEditingPersona((p) => ({
                      ...p!,
                      name: e.target.value,
                      id: p?.id || `custom-${Date.now()}`,
                      isCustom: true,
                    }))
                  }
                  required
                  className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="personaInstruction"
                  className="block text-xs text-slate-400 mb-1"
                >
                  System Instruction
                </label>
                <textarea
                  id="personaInstruction"
                  value={editingPersona?.systemInstruction || ""}
                  onChange={(e) =>
                    setEditingPersona((p) => ({
                      ...p!,
                      systemInstruction: e.target.value,
                      id: p?.id || `custom-${Date.now()}`,
                      isCustom: true,
                    }))
                  }
                  required
                  rows={4}
                  className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-sm resize-y"
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-md transition-colors text-sm"
              >
                Save Persona
              </button>
              {editingPersona && editingPersona.isCustom && (
                <button
                  type="button"
                  onClick={() => handleDeletePersona(editingPersona!.id)}
                  className="w-full mt-2 px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-md transition-colors text-sm"
                >
                  Delete This Persona
                </button>
              )}
            </form>,
            "max-w-lg",
          )}
        {showEventModal &&
          selectedCalendarDay &&
          renderModal(
            "Manage Calendar Event",
            () => {
              setShowEventModal(false);
              setEditingCalendarEvent(null);
            },
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Event Title"
                value={editingCalendarEvent?.title || ""}
                onChange={(e) =>
                  setEditingCalendarEvent((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                className="w-full p-2.5 bg-slate-700 border border-slate-600 rounded-lg text-slate-100"
              />
              <textarea
                placeholder="Event Description"
                value={editingCalendarEvent?.description || ""}
                onChange={(e) =>
                  setEditingCalendarEvent((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
                className="w-full p-2.5 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 resize-y"
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  {" "}
                  <label className="block text-xs text-slate-400 mb-1">
                    Date
                  </label>{" "}
                  <input
                    type="date"
                    value={
                      editingCalendarEvent?.date ||
                      selectedCalendarDay.toISOString().split("T")[0]
                    }
                    onChange={(e) =>
                      setEditingCalendarEvent((prev) => ({
                        ...prev,
                        date: e.target.value,
                      }))
                    }
                    className="w-full p-2.5 bg-slate-700 border border-slate-600 rounded-lg text-slate-100"
                  />{" "}
                </div>
                <div>
                  {" "}
                  <label className="block text-xs text-slate-400 mb-1">
                    Color
                  </label>{" "}
                  <input
                    type="color"
                    value={
                      editingCalendarEvent?.color ||
                      PLATFORM_COLORS[
                        editingCalendarEvent?.platform as Platform
                      ] ||
                      "#3B82F6"
                    }
                    onChange={(e) =>
                      setEditingCalendarEvent((prev) => ({
                        ...prev,
                        color: e.target.value,
                      }))
                    }
                    className="w-full h-10 p-1 bg-slate-700 border border-slate-600 rounded-lg cursor-pointer"
                  />{" "}
                </div>
              </div>
              <button
                onClick={handleSaveCalendarEvent}
                className="w-full px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-md transition-colors text-sm"
              >
                Save Event
              </button>
              {editingCalendarEvent?.id && (
                <button
                  onClick={() => {
                    setCalendarEvents(
                      calendarEvents.filter(
                        (ev) => ev.id !== editingCalendarEvent?.id,
                      ),
                    );
                    setShowEventModal(false);
                    setEditingCalendarEvent(null);
                  }}
                  className="w-full mt-2 px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-md transition-colors text-sm"
                >
                  Delete Event
                </button>
              )}
            </div>,
            "max-w-md",
          )}
        {showSnapshotModal &&
          renderModal(
            "Canvas Snapshots",
            () => setShowSnapshotModal(false),
            <div className="space-y-3">
              <button
                onClick={handleSaveSnapshot}
                className="w-full px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-md transition-colors text-sm mb-3"
              >
                Save Current Canvas as Snapshot
              </button>
              {canvasSnapshots.length === 0 && (
                <p className="text-sm text-slate-400">
                  No snapshots saved yet.
                </p>
              )}
              <div className="space-y-2 pr-1">
                {canvasSnapshots
                  .slice()
                  .reverse()
                  .map((snap) => (
                    <div
                      key={snap.id}
                      className="p-2.5 bg-slate-700/70 rounded-md flex justify-between items-center"
                    >
                      <div>
                        {" "}
                        <p className="text-sm text-slate-200">
                          {snap.name}
                        </p>{" "}
                        <p className="text-xxs text-slate-400">
                          {formatTimestamp(snap.timestamp)}
                        </p>{" "}
                      </div>
                      <div className="space-x-1.5">
                        {" "}
                        <button
                          onClick={() => handleLoadSnapshot(snap.id)}
                          className="px-2 py-1 bg-teal-600 hover:bg-teal-500 text-white text-xs rounded-md"
                        >
                          Load
                        </button>{" "}
                        <button
                          onClick={() => handleDeleteSnapshot(snap.id)}
                          className="px-2 py-1 bg-red-700 hover:bg-red-600 text-white text-xs rounded-md"
                        >
                          <TrashIcon className="w-3 h-3" />
                        </button>{" "}
                      </div>
                    </div>
                  ))}
              </div>
            </div>,
            "max-w-lg",
          )}
        {isCanvasImageModalOpen &&
          renderModal(
            "Generate Image for Canvas",
            () => setIsCanvasImageModalOpen(false),
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="canvasImgPrompt"
                  className="block text-sm font-medium text-sky-300 mb-1"
                >
                  Prompt
                </label>
                <textarea
                  id="canvasImgPrompt"
                  value={canvasImageModalPrompt}
                  onChange={(e) => setCanvasImageModalPrompt(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 bg-slate-700 border border-slate-600 rounded-lg focus:ring-sky-500 focus:border-sky-500 text-slate-100 placeholder-slate-400 resize-y min-h-[60px]"
                />
              </div>
              <div>
                {" "}
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  <ViewfinderCircleIcon className="w-4 h-4 mr-1.5 inline text-slate-500" />
                  Aspect Ratio
                </label>{" "}
                <select
                  value={canvasImageModalAspectRatio}
                  onChange={(e) =>
                    setCanvasImageModalAspectRatio(
                      e.target.value as AspectRatioGuidance,
                    )
                  }
                  className="w-full p-2.5 text-sm bg-slate-600/70 border-slate-500/80 rounded-md focus:ring-1 focus:ring-sky-500 focus:border-sky-500 text-slate-200"
                >
                  {" "}
                  {ASPECT_RATIO_GUIDANCE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}{" "}
                </select>
              </div>
              <div>
                {" "}
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Image Styles
                </label>{" "}
                <div className="flex flex-wrap gap-2">
                  {" "}
                  {IMAGE_PROMPT_STYLES.map((style) => (
                    <button
                      key={`modal-${style}`}
                      type="button"
                      onClick={() => toggleImageStyle(style, true)}
                      className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${canvasImageModalStyles.includes(style) ? "bg-sky-600 border-sky-500 text-white" : "bg-slate-600/70 border-slate-500/80 hover:bg-slate-500/70"}`}
                    >
                      {style}
                    </button>
                  ))}{" "}
                </div>{" "}
              </div>
              <div>
                {" "}
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Image Moods
                </label>{" "}
                <div className="flex flex-wrap gap-2">
                  {" "}
                  {IMAGE_PROMPT_MOODS.map((mood) => (
                    <button
                      key={`modal-${mood}`}
                      type="button"
                      onClick={() => toggleImageMood(mood, true)}
                      className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${canvasImageModalMoods.includes(mood) ? "bg-sky-600 border-sky-500 text-white" : "bg-slate-600/70 border-slate-500/80 hover:bg-slate-500/70"}`}
                    >
                      {mood}
                    </button>
                  ))}{" "}
                </div>{" "}
              </div>
              <div>
                <label
                  htmlFor="canvasImgNegativePrompt"
                  className="block text-sm font-medium text-sky-300 mb-1"
                >
                  Negative Prompt
                </label>
                <input
                  type="text"
                  id="canvasImgNegativePrompt"
                  value={canvasImageModalNegativePrompt}
                  onChange={(e) =>
                    setCanvasImageModalNegativePrompt(e.target.value)
                  }
                  placeholder="e.g., blurry, text, watermark"
                  className="w-full p-2.5 bg-slate-700 border border-slate-600 rounded-lg focus:ring-sky-500 focus:border-sky-500 text-slate-100 placeholder-slate-400"
                />
              </div>
              {canvasImageError && (
                <p className="text-red-400 text-sm">{canvasImageError}</p>
              )}
              <button
                onClick={handleGenerateCanvasImage}
                disabled={
                  isGeneratingCanvasImage || !canvasImageModalPrompt.trim()
                }
                className="w-full px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-md transition-colors text-sm disabled:opacity-60 flex items-center justify-center space-x-2"
              >
                <PhotoIcon className="w-4 h-4" />
                <span>
                  {isGeneratingCanvasImage
                    ? "Generating..."
                    : "Generate & Add to Canvas"}
                </span>
              </button>
            </div>,
            "max-w-lg",
          )}
        {isRepurposeModalOpen &&
          contentToActOn &&
          renderModal(
            "Repurpose Content",
            () => setIsRepurposeModalOpen(false),
            <div className="space-y-4">
              <p className="text-sm text-slate-300">
                Repurposing content about:{" "}
                <strong className="text-sky-400">
                  {truncateText(originalInputForAction, 100)}
                </strong>
              </p>
              <div>
                <label
                  htmlFor="repurposeTargetPlatform"
                  className="block text-xs text-slate-400 mb-1"
                >
                  Target Platform
                </label>
                <select
                  id="repurposeTargetPlatform"
                  value={repurposeTargetPlatform}
                  onChange={(e) =>
                    setRepurposeTargetPlatform(e.target.value as Platform)
                  }
                  className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-sm"
                >
                  {PLATFORMS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="repurposeTargetContentType"
                  className="block text-xs text-slate-400 mb-1"
                >
                  New Content Type
                </label>
                <select
                  id="repurposeTargetContentType"
                  value={repurposeTargetContentType}
                  onChange={(e) =>
                    setRepurposeTargetContentType(e.target.value as ContentType)
                  }
                  className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-sm"
                >
                  {USER_SELECTABLE_CONTENT_TYPES.map((ct) => (
                    <option key={ct.value} value={ct.value}>
                      {ct.label}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleConfirmRepurpose}
                className="w-full px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-md transition-colors text-sm"
              >
                Repurpose
              </button>
            </div>,
          )}
        {isMultiPlatformModalOpen &&
          contentToActOn &&
          renderModal(
            "Multi-Platform Snippets",
            () => setIsMultiPlatformModalOpen(false),
            <div className="space-y-4">
              <p className="text-sm text-slate-300">
                Creating snippets from content about:{" "}
                <strong className="text-sky-400">
                  {truncateText(originalInputForAction, 100)}
                </strong>
              </p>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">
                  Target Platforms (select multiple)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p}
                      onClick={() =>
                        setMultiPlatformTargets((prev) =>
                          prev.includes(p)
                            ? prev.filter((pf) => pf !== p)
                            : [...prev, p],
                        )
                      }
                      className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${multiPlatformTargets.includes(p) ? "bg-sky-600 border-sky-500 text-white" : "bg-slate-600 border-slate-500 hover:bg-slate-500"}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={handleConfirmMultiPlatform}
                className="w-full px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-md transition-colors text-sm"
              >
                Generate Snippets
              </button>
            </div>,
          )}
        {isLanguageModalOpen &&
          contentToActOn &&
          renderModal(
            "Translate & Adapt Content",
            () => setIsLanguageModalOpen(false),
            <div className="space-y-4">
              <p className="text-sm text-slate-300">
                Translating content about:{" "}
                <strong className="text-sky-400">
                  {truncateText(originalInputForAction, 100)}
                </strong>
              </p>
              <div>
                <label
                  htmlFor="translateTargetLanguage"
                  className="block text-xs text-slate-400 mb-1"
                >
                  Target Language
                </label>
                <select
                  id="translateTargetLanguage"
                  value={targetLanguage}
                  onChange={(e) =>
                    setTargetLanguage(e.target.value as Language)
                  }
                  className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-sm"
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleConfirmTranslate}
                className="w-full px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-md transition-colors text-sm"
              >
                Translate & Adapt
              </button>
            </div>,
          )}
        {isPromptOptimizerModalOpen &&
          promptOptimizationSuggestions &&
          renderModal(
            "Prompt Optimization Suggestions",
            () => {
              setIsPromptOptimizerModalOpen(false);
              setPromptOptimizationSuggestions(null);
            },
            <div className="space-y-4">
              {promptOptimizationSuggestions.map((sugg) => (
                <div
                  key={sugg.id}
                  className="p-3 bg-slate-700/70 rounded-lg border border-slate-600"
                >
                  <h4 className="font-medium text-sky-400 mb-1 text-sm">
                    Suggested Prompt:
                  </h4>
                  <p className="text-xs text-slate-200 whitespace-pre-wrap bg-slate-600/60 p-2 rounded">
                    {sugg.suggestedPrompt}
                  </p>
                  {sugg.reasoning && (
                    <>
                      <h5 className="font-medium text-sky-500 mt-2 mb-0.5 text-sm">
                        Reasoning:
                      </h5>
                      <p className="text-xs text-slate-300">{sugg.reasoning}</p>
                    </>
                  )}
                  <button
                    onClick={() => {
                      setGeneratorInput(sugg.suggestedPrompt);
                      setContentType(
                        displayedOutputItem?.contentType || contentType,
                      );
                      setIsPromptOptimizerModalOpen(false);
                      setPromptOptimizationSuggestions(null);
                      setActiveTab("generator");
                    }}
                    className="mt-2.5 px-3 py-1 bg-teal-600 hover:bg-teal-500 text-white text-xs rounded-md transition-colors"
                  >
                    Use this Prompt
                  </button>
                </div>
              ))}
            </div>,
          )}
        {apiKeyMissing && (
          <div className="fixed bottom-4 right-4 bg-red-800 border border-red-600 text-white p-4 rounded-lg shadow-xl z-50 max-w-sm">
            <div className="flex items-start">
              <KeyIcon className="h-6 w-6 text-red-300 mr-3 shrink-0" />
              <div>
                <h4 className="font-semibold text-red-200">API Key Missing</h4>
                <p className="text-sm text-red-300 mt-1">
                  The Gemini API key is not configured. Please set the{" "}
                  <code className="bg-red-900/70 px-1 py-0.5 rounded text-xs">
                    GEMINI_API_KEY
                  </code>{" "}
                  environment variable for the application to function.
                </p>
              </div>
            </div>
          </div>
        )}

        <FreeCreditsPopup
          isOpen={showFreeCreditsPopup}
          onClose={() => setShowFreeCreditsPopup(false)}
          onSignUp={() => {
            setShowFreeCreditsPopup(false);
            if (onShowAuth) {
              onShowAuth();
            }
          }}
        />

        {/* Global Premium Modal Manager */}
        <PremiumModalManager />

        {/* Thumbnail Notification Modal */}
        {showNotificationModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-md w-full border border-slate-700/50 shadow-2xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-sky-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">🔔</span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-4">
                  Get Notified When Ready!
                </h3>

                <p className="text-slate-300 mb-6">
                  Be the first to know when our Premium Thumbnail Studio
                  launches. We'll send you an email as soon as it's available!
                </p>

                {!notificationSubmitted ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="First name"
                        value={notificationFirstName}
                        onChange={(e) =>
                          setNotificationFirstName(e.target.value)
                        }
                        className="w-full p-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-sky-400 focus:outline-none transition-colors"
                      />
                      <input
                        type="text"
                        placeholder="Last name"
                        value={notificationLastName}
                        onChange={(e) =>
                          setNotificationLastName(e.target.value)
                        }
                        className="w-full p-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-sky-400 focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        value={notificationEmail}
                        onChange={(e) => setNotificationEmail(e.target.value)}
                        className="w-full p-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-sky-400 focus:outline-none transition-colors"
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleNotificationSubmit()
                        }
                      />
                      {notificationError && (
                        <p className="text-red-400 text-sm mt-2">
                          {notificationError}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handleNotificationSubmit}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-sky-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                      >
                        Notify Me
                      </button>
                      <button
                        onClick={handleCloseNotificationModal}
                        className="px-6 py-3 border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white rounded-xl transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">✅</span>
                    </div>
                    <h4 className="text-xl font-bold text-green-400 mb-2">
                      You're all set!
                    </h4>
                    <p className="text-slate-300">
                      We'll notify you as soon as the Thumbnail Studio is ready.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Web Search Notification Modal */}
        {showWebSearchNotificationModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-md w-full border border-slate-700/50 shadow-2xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-sky-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <SearchIcon className="w-8 h-8 text-sky-400" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-4">
                  Get Early Access to AI Search!
                </h3>

                <p className="text-slate-300 mb-6">
                  Be the first to access our revolutionary AI-powered asset
                  discovery engine. Join the waitlist for exclusive early
                  access!
                </p>

                {!webSearchNotificationSubmitted ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="First name"
                        value={webSearchNotificationFirstName}
                        onChange={(e) =>
                          setWebSearchNotificationFirstName(e.target.value)
                        }
                        className="w-full p-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-sky-400 focus:outline-none transition-colors"
                      />
                      <input
                        type="text"
                        placeholder="Last name"
                        value={webSearchNotificationLastName}
                        onChange={(e) =>
                          setWebSearchNotificationLastName(e.target.value)
                        }
                        className="w-full p-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-sky-400 focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        value={webSearchNotificationEmail}
                        onChange={(e) =>
                          setWebSearchNotificationEmail(e.target.value)
                        }
                        className="w-full p-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-sky-400 focus:outline-none transition-colors"
                        onKeyPress={(e) =>
                          e.key === "Enter" &&
                          handleWebSearchNotificationSubmit()
                        }
                      />
                      {webSearchNotificationError && (
                        <p className="text-red-400 text-sm mt-2">
                          {webSearchNotificationError}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handleWebSearchNotificationSubmit}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-sky-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                      >
                        Join Waitlist
                      </button>
                      <button
                        onClick={handleCloseWebSearchNotificationModal}
                        className="px-6 py-3 border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white rounded-xl transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">✅</span>
                    </div>
                    <h4 className="text-xl font-bold text-green-400 mb-2">
                      Welcome to the waitlist!
                    </h4>
                    <p className="text-slate-300">
                      You'll be among the first to access our AI-powered search
                      engine.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Thumbnail Preview Modal */}
        {showThumbnailPreview && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl max-w-6xl w-full max-h-[90vh] border border-slate-700/50 shadow-2xl overflow-hidden">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">
                    Thumbnail Studio Preview
                  </h3>
                  <p className="text-slate-400">
                    See what's coming in our AI-powered thumbnail creator
                  </p>
                </div>
                <button
                  onClick={() => setShowThumbnailPreview(false)}
                  className="w-10 h-10 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Left Side - Canvas Preview */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4">
                        AI-Powered Canvas Editor
                      </h4>

                      {/* Mock Canvas */}
                      <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl p-4 border border-slate-600/50">
                        <div className="aspect-video bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-lg relative overflow-hidden border-2 border-dashed border-slate-500/30">
                          {/* Grid Overlay */}
                          <div className="absolute inset-0 opacity-20">
                            <div className="w-full h-full grid grid-cols-3 grid-rows-3">
                              {Array.from({ length: 9 }).map((_, i) => (
                                <div
                                  key={i}
                                  className="border border-sky-400/30"
                                ></div>
                              ))}
                            </div>
                          </div>

                          {/* Mock Thumbnail Elements */}
                          <div className="absolute inset-4">
                            {/* Background Image */}
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/30 to-red-500/30 rounded-lg"></div>

                            {/* Face/Character */}
                            <div className="absolute right-4 top-4 w-20 h-20 bg-gradient-to-br from-amber-400/40 to-orange-500/40 rounded-full border-2 border-white/50"></div>

                            {/* Title Text */}
                            <div className="absolute bottom-4 left-4 right-4">
                              <div className="bg-black/50 rounded-lg p-3 backdrop-blur-sm">
                                <div className="h-4 bg-white/80 rounded w-3/4 mb-1"></div>
                                <div className="h-3 bg-white/60 rounded w-1/2"></div>
                              </div>
                            </div>

                            {/* Play Button */}
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                                <div className="w-4 h-4 bg-white rounded-sm flex items-center justify-center">
                                  <div className="w-0 h-0 border-l-[6px] border-l-red-500 border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent ml-0.5"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Canvas Tools */}
                        <div className="flex items-center justify-center gap-2 mt-4 p-2 bg-slate-800/50 rounded-lg">
                          {[
                            { icon: "🎨", label: "Colors" },
                            { icon: "����", label: "Text" },
                            { icon: "������", label: "Images" },
                            { icon: "���", label: "Effects" },
                            { icon: "����", label: "Guides" },
                          ].map((tool, index) => (
                            <div
                              key={`stat-${index}-${Date.now()}`}
                              className="flex items-center gap-1 px-3 py-2 bg-slate-700/50 rounded-lg text-xs text-slate-300 hover:bg-slate-600/50 transition-colors cursor-pointer"
                            >
                              <span>{tool.icon}</span>
                              <span>{tool.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* AI Features */}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4">
                        AI-Powered Features
                      </h4>
                      <div className="grid grid-cols-1 gap-3">
                        {[
                          {
                            icon: "����",
                            title: "Smart Auto-Layout",
                            desc: "AI arranges elements using golden ratio principles",
                            status: "AI Ready",
                          },
                          {
                            icon: "🎯",
                            title: "Click-Through Optimization",
                            desc: "Analyzes successful thumbnails in your niche",
                            status: "Learning",
                          },
                          {
                            icon: "������",
                            title: "Background Removal",
                            desc: "One-click subject isolation with perfect edges",
                            status: "Processing",
                          },
                          {
                            icon: "��",
                            title: "Style Transfer",
                            desc: "Apply viral thumbnail styles to your content",
                            status: "Ready",
                          },
                        ].map((feature, index) => (
                          <div
                            key={`insight-${index}-${Date.now()}`}
                            className="flex items-center gap-3 p-3 bg-slate-800/40 rounded-lg border border-slate-700/30"
                          >
                            <div className="text-2xl">{feature.icon}</div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h5 className="font-semibold text-white text-sm">
                                  {feature.title}
                                </h5>
                                <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                                  {feature.status}
                                </span>
                              </div>
                              <p className="text-slate-400 text-xs">
                                {feature.desc}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Templates & Export */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4">
                        Professional Templates
                      </h4>

                      {/* Template Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          {
                            name: "Gaming Energy",
                            bg: "from-red-500 to-orange-500",
                            style: "Bold + Neon",
                          },
                          {
                            name: "Tech Review",
                            bg: "from-blue-500 to-cyan-500",
                            style: "Clean + Modern",
                          },
                          {
                            name: "Lifestyle Vlog",
                            bg: "from-pink-500 to-purple-500",
                            style: "Warm + Personal",
                          },
                          {
                            name: "Tutorial",
                            bg: "from-green-500 to-teal-500",
                            style: "Clear + Focused",
                          },
                          {
                            name: "Reaction",
                            bg: "from-yellow-500 to-orange-500",
                            style: "Expressive + Fun",
                          },
                          {
                            name: "News/Commentary",
                            bg: "from-gray-500 to-slate-500",
                            style: "Professional",
                          },
                        ].map((template, index) => (
                          <div
                            key={`thumbnail-${index}-${Date.now()}`}
                            className="group relative aspect-video bg-gradient-to-br rounded-lg overflow-hidden border border-slate-600/50 hover:border-slate-500/70 transition-all cursor-pointer"
                            style={{
                              background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                            }}
                          >
                            <div
                              className={`absolute inset-0 bg-gradient-to-br ${template.bg} opacity-60`}
                            ></div>
                            <div className="absolute inset-0 bg-black/20"></div>
                            <div className="absolute inset-2 flex flex-col justify-between">
                              <div className="text-right">
                                <div className="w-6 h-6 bg-white/30 rounded-full"></div>
                              </div>
                              <div>
                                <div className="h-2 bg-white/80 rounded w-3/4 mb-1"></div>
                                <div className="h-1.5 bg-white/60 rounded w-1/2"></div>
                              </div>
                            </div>
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <div className="text-center">
                                <p className="text-white font-semibold text-xs mb-1">
                                  {template.name}
                                </p>
                                <p className="text-slate-300 text-xs">
                                  {template.style}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Export Options */}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4">
                        Export & Analytics
                      </h4>

                      <div className="space-y-3">
                        {/* Export Formats */}
                        <div className="p-4 bg-slate-800/40 rounded-lg border border-slate-700/30">
                          <h5 className="font-semibold text-white text-sm mb-3">
                            Export Formats
                          </h5>
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            {["1920×1080", "1280�����720", "YouTube Optimal"].map(
                              (format, index) => (
                                <div
                                  key={index}
                                  className="p-2 bg-slate-700/50 rounded text-slate-300 text-center"
                                >
                                  {format}
                                </div>
                              ),
                            )}
                          </div>
                        </div>

                        {/* Analytics Preview */}
                        <div className="p-4 bg-slate-800/40 rounded-lg border border-slate-700/30">
                          <h5 className="font-semibold text-white text-sm mb-3">
                            Performance Prediction
                          </h5>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400 text-xs">
                                Click-Through Rate
                              </span>
                              <span className="text-emerald-400 text-xs font-semibold">
                                +34% estimated
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400 text-xs">
                                Engagement Score
                              </span>
                              <span className="text-blue-400 text-xs font-semibold">
                                8.7/10
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400 text-xs">
                                Niche Optimization
                              </span>
                              <span className="text-purple-400 text-xs font-semibold">
                                Excellent
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Call to Action */}
                        <div className="p-4 bg-gradient-to-r from-sky-500/20 to-purple-500/20 rounded-lg border border-sky-400/30">
                          <div className="text-center">
                            <h5 className="font-semibold text-white text-sm mb-2">
                              Ready to Create Viral Thumbnails?
                            </h5>
                            <p className="text-slate-300 text-xs mb-3">
                              Join the waitlist and be among the first to access
                              these powerful tools
                            </p>
                            <button
                              onClick={() => {
                                setShowThumbnailPreview(false);
                                handleNotifyMeClick();
                              }}
                              className="w-full px-4 py-2 bg-gradient-to-r from-sky-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 text-white font-semibold rounded-lg text-sm transition-all duration-300 transform hover:scale-105"
                            >
                              Get Early Access
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Custom Persona Manager Modal */}
        <CustomPersonaManager
          isOpen={showCustomPersonaManager}
          onClose={() => setShowCustomPersonaManager(false)}
          customPersonas={customAiPersonas}
          onSavePersona={handleSavePersona}
          onDeletePersona={handleDeletePersona}
          onSelectPersona={(persona) => {
            setSelectedAiPersonaId(persona.id);
            setShowCustomPersonaManager(false);
          }}
          selectedPersonaId={selectedAiPersonaId}
          userPlan={userPlan}
        />

        {/* Development Tools - MOVED TO HEADER DEV DROPDOWN */}

        {/* Fixed Subscription Dev Button - MOVED TO HEADER DEV DROPDOWN */}
        {/* DEV BUTTON MOVED TO HEADER
          <button
            onClick={() => {
              const plans = ["free", "creator pro", "agency pro", "enterprise"];
              const currentIndex = plans.indexOf(userPlan);
              const nextIndex = (currentIndex + 1) % plans.length;
              const nextPlan = plans[nextIndex] as
                | "free"
                | "creator pro"
                | "agency pro"
                | "enterprise";
              setUserPlan(nextPlan);

              // Enable ALL premium features for any paid plan
              if (nextPlan !== "free") {
                localStorage.setItem("dev_force_premium", "true");
                localStorage.setItem("emergency_premium", "true");
              } else {
                localStorage.removeItem("dev_force_premium");
                localStorage.removeItem("emergency_premium");
              }

              // Show visual feedback
              alert(
                `⚙ Developer Mode: Switched to ${nextPlan.toUpperCase()} plan\n\nAll premium features ${nextPlan !== "free" ? "ENABLED" : "DISABLED"} across the entire app.`,
              );
            }}
            className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-orange-600/80 to-red-600/80 hover:from-orange-500 hover:to-red-500 text-white rounded-md text-xs font-medium transition-all duration-300 shadow-md hover:shadow-lg border border-orange-500/50"
            title="Developer: Toggle Subscription Plan"
            onDoubleClick={() => {
              // Show notification test menu on double-click
              const testNotifications = [
                () => AppNotifications.networkError(),
                () => AppNotifications.authError(),
                () => AppNotifications.serviceUnavailable("AI Generation"),
                () => AppNotifications.quotaExceeded(),
                () => AppNotifications.operationSuccess("Content generated"),
                () => AppNotifications.creditsRunningLow(5),
                () => AppNotifications.updateAvailable(),
              ];

              // Show random notification for testing
              const randomNotification =
                testNotifications[
                  Math.floor(Math.random() * testNotifications.length)
                ];
              randomNotification();
            }}
          >
            <span className="text-base">��</span>
            <span className="capitalize">
              {userPlan === "free" ? "Free" :
               userPlan === "creator pro" ? "Creator" :
               userPlan === "agency pro" ? "Agency" :
               userPlan === "enterprise" ? "Enterprise" : userPlan}
            </span>
            {userPlan !== "free" && <span className="text-xs opacity-75 ml-1">✨ALL</span>}
          </button> */}

        {/* Global Command Palette - Always visible across all tabs */}
        <GlobalCommandPalette
          onNavigateToTab={setActiveTab}
          showFloatingButton={showFloatingCommandButton}
          onToggleFloatingButton={(show) => {
            setShowFloatingCommandButton(show);
            localStorage.setItem('showFloatingCommandButton', String(show));
          }}
        />

        {/* Strategy Creation Modal - Rendered outside main layout */}
        {showStrategyModal && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowStrategyModal(false);
              }
            }}
          >
            <div
              style={{
                backgroundColor: '#0f172a',
                borderRadius: '16px',
                border: '1px solid #334155',
                maxWidth: '1200px',
                width: '100%',
                maxHeight: '90vh',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              <button
                onClick={() => setShowStrategyModal(false)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  backgroundColor: '#374151',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  zIndex: 1000,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ✕
              </button>
              <div style={{ height: '90vh', overflow: 'auto' }}>
                <PremiumContentStrategy
                  strategyPlan={null}
                  strategyConfig={currentStrategyConfig}
                  isLoading={isGeneratingStrategy}
                  error={strategyError}
                  onGenerateStrategy={handleGenerateStrategyWithConfig}
                  onStrategyConfigChange={handleStrategyConfigChange}
                  onUpdateStrategyPlan={setGeneratedStrategyPlan}
                  savedStrategies={[]}
                  isPremium={isPremium}
                  onUpgrade={() => {
                    setShowStrategyModal(false);
                    setShowUpgradeModal(true);
                  }}
                />
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
      </SidebarProvider>
    </FirebaseErrorBoundary>
  );
};

const AppContent: React.FC = () => {
  return (
    <div>
      <p>Loading...</p>
    </div>
  );
};

export default AppContent;
