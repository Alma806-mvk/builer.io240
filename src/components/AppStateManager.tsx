import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import {
  Platform,
  ContentType,
  GeneratedOutput,
  HistoryItem,
  RefinementType,
  Source,
  ImagePromptStyle,
  ImagePromptMood,
  PromptTemplate,
  SeoKeywordMode,
  ABTestableContentType,
  ABTestVariation,
  AiPersona,
  DefaultAiPersonaEnum,
  Language,
  AspectRatioGuidance,
  PromptOptimizationSuggestion,
  CanvasItem,
  CanvasSnapshot,
  ParsedChannelAnalysisSection,
  CalendarEvent,
  TrendAnalysisOutput,
  YoutubeStatsEntry,
  ChannelTableEntry,
  CanvasHistoryEntry,
} from "../../types";

import {
  PLATFORMS,
  USER_SELECTABLE_CONTENT_TYPES,
  DEFAULT_USER_INPUT_PLACEHOLDERS,
  SUPPORTED_LANGUAGES,
  DEFAULT_AI_PERSONAS,
} from "../../constants";

// Local storage keys
const MAX_HISTORY_ITEMS = 50;
const LOCAL_STORAGE_HISTORY_KEY = "socialContentAIStudio_history_v5";
const LOCAL_STORAGE_TEMPLATES_KEY = "socialContentAIStudio_templates_v3";
const LOCAL_STORAGE_CUSTOM_PERSONAS_KEY =
  "socialContentAIStudio_customPersonas_v1";
const LOCAL_STORAGE_TREND_ANALYSIS_QUERIES_KEY =
  "socialContentAIStudio_trendQueries_v1";
const LOCAL_STORAGE_CALENDAR_EVENTS_KEY =
  "socialContentAIStudio_calendarEvents_v1";
const LOCAL_STORAGE_CANVAS_SNAPSHOTS_KEY =
  "socialContentAIStudio_canvasSnapshots_v1";
const LOCAL_STORAGE_CANVAS_ITEMS_KEY = "socialContentAIStudio_canvasItems_v11";
const LOCAL_STORAGE_CANVAS_VIEW_KEY = "socialContentAIStudio_canvasView_v1";
const LOCAL_STORAGE_CANVAS_HISTORY_KEY =
  "socialContentAIStudio_canvasHistory_v1";

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
  | "thumbnailMaker";

interface AppStateManagerProps {
  user: any;
  children: (state: AppState, actions: AppActions) => React.ReactNode;
}

interface AppState {
  // Main UI state
  activeTab: ActiveTab;
  userInput: string;
  selectedPlatform: Platform;
  selectedContentType: ContentType;
  selectedLanguage: Language;
  selectedAiPersona: AiPersona;
  isLoading: boolean;
  error: string | null;

  // Generation state
  generatedOutput: GeneratedOutput | null;
  history: HistoryItem[];

  // Image generation
  selectedImageStyles: ImagePromptStyle[];
  selectedImageMoods: ImagePromptMood[];
  negativeImagePrompt: string;
  aspectRatioGuidance: AspectRatioGuidance;

  // SEO and optimization
  seoKeywords: string;
  seoKeywordMode: SeoKeywordMode;
  promptOptimizationSuggestions: PromptOptimizationSuggestion[];

  // A/B Testing
  abTestableContentType: ABTestableContentType | null;
  abTestVariations: ABTestVariation[];

  // Templates and personas
  customTemplates: PromptTemplate[];
  customAiPersonas: AiPersona[];

  // Canvas state
  canvasItems: CanvasItem[];
  selectedCanvasItems: Set<string>;
  canvasHistory: CanvasHistoryEntry[];
  canvasHistoryIndex: number;
  nextZIndex: number;
  canvasOffset: { x: number; y: number };
  zoomLevel: number;

  // Channel analysis
  channelAnalysisInput: string;
  parsedChannelAnalysis: ParsedChannelAnalysisSection[] | null;
  channelAnalysisError: string | null;
  channelAnalysisSummary: string | null;
  isAnalyzingChannel: boolean;
  isSummarizingChannelAnalysis: boolean;

  // YouTube stats
  youtubeStats: YoutubeStatsEntry[];
  channelTable: ChannelTableEntry[];

  // Trends
  trendAnalysisOutput: TrendAnalysisOutput | null;
  trendAnalysisQueries: string[];

  // Calendar
  calendarEvents: CalendarEvent[];

  // Canvas snapshots
  canvasSnapshots: CanvasSnapshot[];

  // UI state
  copied: boolean;
  showTemplateModal: boolean;
  showPersonaModal: boolean;
  editingTemplate: PromptTemplate | null;
  editingPersona: AiPersona | null;
  showImageModal: boolean;
  modalImageSrc: string | null;
  showAdvancedOptions: boolean;
  showAbTestModal: boolean;
  showOptimizationModal: boolean;
}

interface AppActions {
  // Main actions
  setActiveTab: (tab: ActiveTab) => void;
  setUserInput: (input: string) => void;
  setSelectedPlatform: (platform: Platform) => void;
  setSelectedContentType: (type: ContentType) => void;
  setSelectedLanguage: (language: Language) => void;
  setSelectedAiPersona: (persona: AiPersona) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Generation actions
  setGeneratedOutput: (output: GeneratedOutput | null) => void;
  addToHistory: (item: HistoryItem) => void;
  clearHistory: () => void;
  deleteHistoryItem: (id: string) => void;

  // Image generation actions
  toggleImageStyle: (style: ImagePromptStyle) => void;
  toggleImageMood: (mood: ImagePromptMood) => void;
  setNegativeImagePrompt: (prompt: string) => void;
  setAspectRatioGuidance: (guidance: AspectRatioGuidance) => void;

  // SEO actions
  setSeoKeywords: (keywords: string) => void;
  setSeoKeywordMode: (mode: SeoKeywordMode) => void;
  setPromptOptimizationSuggestions: (
    suggestions: PromptOptimizationSuggestion[],
  ) => void;

  // A/B Testing actions
  setAbTestableContentType: (type: ABTestableContentType | null) => void;
  setAbTestVariations: (variations: ABTestVariation[]) => void;

  // Template actions
  saveTemplate: (template: PromptTemplate) => void;
  deleteTemplate: (id: string) => void;

  // Persona actions
  saveCustomPersona: (persona: AiPersona) => void;
  deleteCustomPersona: (id: string) => void;

  // Canvas actions
  setCanvasItems: (items: CanvasItem[]) => void;
  addCanvasItem: (item: CanvasItem) => void;
  updateCanvasItem: (id: string, updates: Partial<CanvasItem>) => void;
  deleteCanvasItem: (id: string) => void;
  setSelectedCanvasItems: (items: Set<string>) => void;
  saveCanvasHistory: () => void;
  undoCanvas: () => void;
  redoCanvas: () => void;

  // Channel analysis actions
  setChannelAnalysisInput: (input: string) => void;
  setParsedChannelAnalysis: (
    analysis: ParsedChannelAnalysisSection[] | null,
  ) => void;
  setChannelAnalysisError: (error: string | null) => void;
  setChannelAnalysisSummary: (summary: string | null) => void;
  setIsAnalyzingChannel: (analyzing: boolean) => void;
  setIsSummarizingChannelAnalysis: (summarizing: boolean) => void;

  // YouTube stats actions
  setYoutubeStats: (stats: YoutubeStatsEntry[]) => void;
  setChannelTable: (table: ChannelTableEntry[]) => void;

  // Trends actions
  setTrendAnalysisOutput: (output: TrendAnalysisOutput | null) => void;
  addTrendQuery: (query: string) => void;

  // Calendar actions
  setCalendarEvents: (events: CalendarEvent[]) => void;
  addCalendarEvent: (event: CalendarEvent) => void;

  // Canvas snapshots actions
  saveCanvasSnapshot: (snapshot: CanvasSnapshot) => void;
  loadCanvasSnapshot: (snapshotId: string) => void;
  deleteCanvasSnapshot: (snapshotId: string) => void;

  // UI actions
  setCopied: (copied: boolean) => void;
  setShowTemplateModal: (show: boolean) => void;
  setShowPersonaModal: (show: boolean) => void;
  setEditingTemplate: (template: PromptTemplate | null) => void;
  setEditingPersona: (persona: AiPersona | null) => void;
  setShowImageModal: (show: boolean) => void;
  setModalImageSrc: (src: string | null) => void;
  setShowAdvancedOptions: (show: boolean) => void;
  setShowAbTestModal: (show: boolean) => void;
  setShowOptimizationModal: (show: boolean) => void;
}

export const AppStateManager: React.FC<AppStateManagerProps> = ({
  user,
  children,
}) => {
  // Initialize state with defaults
  const [activeTab, setActiveTab] = useState<ActiveTab>("generator");
  const [userInput, setUserInput] = useState("");
  const [selectedPlatform, setSelectedPlatform] =
    useState<Platform>("Instagram");
  const [selectedContentType, setSelectedContentType] =
    useState<ContentType>("Post");
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("English");
  const [selectedAiPersona, setSelectedAiPersona] = useState<AiPersona>(
    DEFAULT_AI_PERSONAS[0],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generation state
  const [generatedOutput, setGeneratedOutput] =
    useState<GeneratedOutput | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Image generation
  const [selectedImageStyles, setSelectedImageStyles] = useState<
    ImagePromptStyle[]
  >([]);
  const [selectedImageMoods, setSelectedImageMoods] = useState<
    ImagePromptMood[]
  >([]);
  const [negativeImagePrompt, setNegativeImagePrompt] = useState("");
  const [aspectRatioGuidance, setAspectRatioGuidance] =
    useState<AspectRatioGuidance>("1:1");

  // SEO and optimization
  const [seoKeywords, setSeoKeywords] = useState("");
  const [seoKeywordMode, setSeoKeywordMode] =
    useState<SeoKeywordMode>("include");
  const [promptOptimizationSuggestions, setPromptOptimizationSuggestions] =
    useState<PromptOptimizationSuggestion[]>([]);

  // A/B Testing
  const [abTestableContentType, setAbTestableContentType] =
    useState<ABTestableContentType | null>(null);
  const [abTestVariations, setAbTestVariations] = useState<ABTestVariation[]>(
    [],
  );

  // Templates and personas
  const [customTemplates, setCustomTemplates] = useState<PromptTemplate[]>([]);
  const [customAiPersonas, setCustomAiPersonas] = useState<AiPersona[]>([]);

  // Canvas state
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([]);
  const [selectedCanvasItems, setSelectedCanvasItems] = useState<Set<string>>(
    new Set(),
  );
  const [canvasHistory, setCanvasHistory] = useState<CanvasHistoryEntry[]>([]);
  const [canvasHistoryIndex, setCanvasHistoryIndex] = useState(-1);
  const [nextZIndex, setNextZIndex] = useState(1);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(1);

  // Channel analysis
  const [channelAnalysisInput, setChannelAnalysisInput] = useState("");
  const [parsedChannelAnalysis, setParsedChannelAnalysis] = useState<
    ParsedChannelAnalysisSection[] | null
  >(null);
  const [channelAnalysisError, setChannelAnalysisError] = useState<
    string | null
  >(null);
  const [channelAnalysisSummary, setChannelAnalysisSummary] = useState<
    string | null
  >(null);
  const [isAnalyzingChannel, setIsAnalyzingChannel] = useState(false);
  const [isSummarizingChannelAnalysis, setIsSummarizingChannelAnalysis] =
    useState(false);

  // YouTube stats
  const [youtubeStats, setYoutubeStats] = useState<YoutubeStatsEntry[]>([]);
  const [channelTable, setChannelTable] = useState<ChannelTableEntry[]>([]);

  // Trends
  const [trendAnalysisOutput, setTrendAnalysisOutput] =
    useState<TrendAnalysisOutput | null>(null);
  const [trendAnalysisQueries, setTrendAnalysisQueries] = useState<string[]>(
    [],
  );

  // Calendar
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);

  // Canvas snapshots
  const [canvasSnapshots, setCanvasSnapshots] = useState<CanvasSnapshot[]>([]);

  // UI state
  const [copied, setCopied] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showPersonaModal, setShowPersonaModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<PromptTemplate | null>(
    null,
  );
  const [editingPersona, setEditingPersona] = useState<AiPersona | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState<string | null>(null);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [showAbTestModal, setShowAbTestModal] = useState(false);
  const [showOptimizationModal, setShowOptimizationModal] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }

      const savedTemplates = localStorage.getItem(LOCAL_STORAGE_TEMPLATES_KEY);
      if (savedTemplates) {
        setCustomTemplates(JSON.parse(savedTemplates));
      }

      const savedPersonas = localStorage.getItem(
        LOCAL_STORAGE_CUSTOM_PERSONAS_KEY,
      );
      if (savedPersonas) {
        setCustomAiPersonas(JSON.parse(savedPersonas));
      }

      // Load other localStorage data...
    } catch (error) {
      console.error("Error loading saved data:", error);
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_TEMPLATES_KEY,
      JSON.stringify(customTemplates),
    );
  }, [customTemplates]);

  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_CUSTOM_PERSONAS_KEY,
      JSON.stringify(customAiPersonas),
    );
  }, [customAiPersonas]);

  // Action implementations
  const toggleImageStyle = useCallback((style: ImagePromptStyle) => {
    setSelectedImageStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style],
    );
  }, []);

  const toggleImageMood = useCallback((mood: ImagePromptMood) => {
    setSelectedImageMoods((prev) =>
      prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood],
    );
  }, []);

  const addToHistory = useCallback((item: HistoryItem) => {
    setHistory((prev) => {
      const newHistory = [item, ...prev.filter((h) => h.id !== item.id)];
      return newHistory.slice(0, MAX_HISTORY_ITEMS);
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const deleteHistoryItem = useCallback((id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const saveTemplate = useCallback((template: PromptTemplate) => {
    setCustomTemplates((prev) => {
      const existing = prev.find((t) => t.id === template.id);
      if (existing) {
        return prev.map((t) => (t.id === template.id ? template : t));
      }
      return [...prev, template];
    });
  }, []);

  const deleteTemplate = useCallback((id: string) => {
    setCustomTemplates((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const saveCustomPersona = useCallback((persona: AiPersona) => {
    setCustomAiPersonas((prev) => {
      const existing = prev.find((p) => p.id === persona.id);
      if (existing) {
        return prev.map((p) => (p.id === persona.id ? persona : p));
      }
      return [...prev, persona];
    });
  }, []);

  const deleteCustomPersona = useCallback((id: string) => {
    setCustomAiPersonas((prev) => prev.filter((p) => p.id !== id));
  }, []);

  // Canvas actions
  const addCanvasItem = useCallback((item: CanvasItem) => {
    setCanvasItems((prev) => [...prev, item]);
    setNextZIndex((prev) => prev + 1);
  }, []);

  const updateCanvasItem = useCallback(
    (id: string, updates: Partial<CanvasItem>) => {
      setCanvasItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updates } : item)),
      );
    },
    [],
  );

  const deleteCanvasItem = useCallback((id: string) => {
    setCanvasItems((prev) => prev.filter((item) => item.id !== id));
    setSelectedCanvasItems((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  }, []);

  const saveCanvasHistory = useCallback(() => {
    const entry: CanvasHistoryEntry = {
      items: canvasItems,
      nextZIndex,
      canvasOffset,
      zoomLevel,
    };

    setCanvasHistory((prev) => {
      const newHistory = prev.slice(0, canvasHistoryIndex + 1);
      newHistory.push(entry);
      return newHistory.slice(-30); // Keep last 30 states
    });

    setCanvasHistoryIndex((prev) => prev + 1);
  }, [canvasItems, nextZIndex, canvasOffset, zoomLevel, canvasHistoryIndex]);

  const undoCanvas = useCallback(() => {
    if (canvasHistoryIndex > 0) {
      const prevState = canvasHistory[canvasHistoryIndex - 1];
      setCanvasItems(prevState.items);
      setNextZIndex(prevState.nextZIndex);
      setCanvasOffset(prevState.canvasOffset);
      setZoomLevel(prevState.zoomLevel);
      setCanvasHistoryIndex((prev) => prev - 1);
    }
  }, [canvasHistory, canvasHistoryIndex]);

  const redoCanvas = useCallback(() => {
    if (canvasHistoryIndex < canvasHistory.length - 1) {
      const nextState = canvasHistory[canvasHistoryIndex + 1];
      setCanvasItems(nextState.items);
      setNextZIndex(nextState.nextZIndex);
      setCanvasOffset(nextState.canvasOffset);
      setZoomLevel(nextState.zoomLevel);
      setCanvasHistoryIndex((prev) => prev + 1);
    }
  }, [canvasHistory, canvasHistoryIndex]);

  const addTrendQuery = useCallback((query: string) => {
    setTrendAnalysisQueries((prev) => {
      if (!prev.includes(query)) {
        return [query, ...prev].slice(0, 10); // Keep last 10 queries
      }
      return prev;
    });
  }, []);

  const addCalendarEvent = useCallback((event: CalendarEvent) => {
    setCalendarEvents((prev) => [...prev, event]);
  }, []);

  const saveCanvasSnapshot = useCallback((snapshot: CanvasSnapshot) => {
    setCanvasSnapshots((prev) => [...prev, snapshot]);
  }, []);

  const loadCanvasSnapshot = useCallback(
    (snapshotId: string) => {
      const snapshot = canvasSnapshots.find((s) => s.id === snapshotId);
      if (snapshot) {
        setCanvasItems(snapshot.items);
        // Could also restore other canvas state if stored in snapshot
      }
    },
    [canvasSnapshots],
  );

  const deleteCanvasSnapshot = useCallback((snapshotId: string) => {
    setCanvasSnapshots((prev) => prev.filter((s) => s.id !== snapshotId));
  }, []);

  // Compile state and actions
  const state: AppState = {
    activeTab,
    userInput,
    selectedPlatform,
    selectedContentType,
    selectedLanguage,
    selectedAiPersona,
    isLoading,
    error,
    generatedOutput,
    history,
    selectedImageStyles,
    selectedImageMoods,
    negativeImagePrompt,
    aspectRatioGuidance,
    seoKeywords,
    seoKeywordMode,
    promptOptimizationSuggestions,
    abTestableContentType,
    abTestVariations,
    customTemplates,
    customAiPersonas,
    canvasItems,
    selectedCanvasItems,
    canvasHistory,
    canvasHistoryIndex,
    nextZIndex,
    canvasOffset,
    zoomLevel,
    channelAnalysisInput,
    parsedChannelAnalysis,
    channelAnalysisError,
    channelAnalysisSummary,
    isAnalyzingChannel,
    isSummarizingChannelAnalysis,
    youtubeStats,
    channelTable,
    trendAnalysisOutput,
    trendAnalysisQueries,
    calendarEvents,
    canvasSnapshots,
    copied,
    showTemplateModal,
    showPersonaModal,
    editingTemplate,
    editingPersona,
    showImageModal,
    modalImageSrc,
    showAdvancedOptions,
    showAbTestModal,
    showOptimizationModal,
  };

  const actions: AppActions = {
    setActiveTab,
    setUserInput,
    setSelectedPlatform,
    setSelectedContentType,
    setSelectedLanguage,
    setSelectedAiPersona,
    setIsLoading,
    setError,
    setGeneratedOutput,
    addToHistory,
    clearHistory,
    deleteHistoryItem,
    toggleImageStyle,
    toggleImageMood,
    setNegativeImagePrompt,
    setAspectRatioGuidance,
    setSeoKeywords,
    setSeoKeywordMode,
    setPromptOptimizationSuggestions,
    setAbTestableContentType,
    setAbTestVariations,
    saveTemplate,
    deleteTemplate,
    saveCustomPersona,
    deleteCustomPersona,
    setCanvasItems,
    addCanvasItem,
    updateCanvasItem,
    deleteCanvasItem,
    setSelectedCanvasItems,
    saveCanvasHistory,
    undoCanvas,
    redoCanvas,
    setChannelAnalysisInput,
    setParsedChannelAnalysis,
    setChannelAnalysisError,
    setChannelAnalysisSummary,
    setIsAnalyzingChannel,
    setIsSummarizingChannelAnalysis,
    setYoutubeStats,
    setChannelTable,
    setTrendAnalysisOutput,
    addTrendQuery,
    setCalendarEvents,
    addCalendarEvent,
    saveCanvasSnapshot,
    loadCanvasSnapshot,
    deleteCanvasSnapshot,
    setCopied,
    setShowTemplateModal,
    setShowPersonaModal,
    setEditingTemplate,
    setEditingPersona,
    setShowImageModal,
    setModalImageSrc,
    setShowAdvancedOptions,
    setShowAbTestModal,
    setShowOptimizationModal,
  };

  return children(state, actions);
};

export default AppStateManager;
