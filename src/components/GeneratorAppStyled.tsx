import React, { useState, useRef, useEffect, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GeneratorForm } from "./GeneratorForm";
import { GeneratorOutput } from "./GeneratorOutput";
import { GeneratorSidebar } from "./GeneratorSidebar";
import { UsageWarning } from "./UsageWarning";
import { PremiumStatusIndicator } from "./PremiumStatusIndicator";
import { PremiumContentTypesShowcase } from "./PremiumContentTypesShowcase";
import { PremiumGeneratorEnhancement } from "./PremiumGeneratorEnhancement";
import { PremiumUpgradeModal } from "./PremiumUpgradeModal";
import { PromptExamplesCarousel } from "./PromptExamplesCarousel";
import { GuidedPromptBuilder } from "./GuidedPromptBuilder";
import {
  Button,
  Card,
  Input,
  Badge,
  StatCard,
  QuickActionCard,
  ProgressBar,
  EmptyState,
  TabHeader,
  GradientText
} from "./ui/WorldClassComponents";
import "../styles/premiumButton.css";
import "../styles/generatorAppStyled.css";
import {
  Platform,
  ContentType,
  ABTestableContentType,
  SeoKeywordMode,
  SeoIntensity,
  Language,
  AspectRatioGuidance,
  ImagePromptStyle,
  ImagePromptMood,
  AiPersona,
  HistoryItem,
  GeneratedOutput,
  ContentBriefOutput,
  PollQuizOutput,
  ReadabilityOutput,
  PromptOptimizationSuggestion,
  ParsedChannelAnalysisSection,
  ContentStrategyPlanOutput,
  EngagementFeedbackOutput,
  TrendAnalysisOutput,
  RefinementType,
  ABTestVariation,
} from "../../types";
import {
  PLATFORMS,
  USER_SELECTABLE_CONTENT_TYPES,
  isPremiumContentType,
  VIDEO_LENGTH_OPTIONS,
  SUPPORTED_LANGUAGES,
  IMAGE_PROMPT_STYLES,
  IMAGE_PROMPT_MOODS,
  ASPECT_RATIO_GUIDANCE_OPTIONS,
} from "../../constants";
import {
  SparklesIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MenuIcon,
  MicrophoneIcon,
  CogIcon,
  TemplateIcon,
  PersonIcon,
  LanguageIcon,
  ImageIcon,
  VideoIcon,
  SEOIcon,
  AnalyticsIcon,
  BulbIcon,
  PlayIcon,
  PauseIcon,
  RefreshIcon,
  DownloadIcon,
  ShareIcon,
  HeartIcon,
  BookmarkIcon,
  EyeIcon,
  FilterIcon,
  SearchIcon,
  AdjustmentsIcon,
  GlobeIcon,
  ColorPaletteIcon,
  SoundIcon,
  ResultsIcon,
  SmartTemplateIcon,
  AIPersonaIcon,
  VoiceInputIcon,
  OptimizePromptIcon
} from "./IconComponents";
import {
  RocketIcon,
  PremiumIcon,
  DocumentIcon,
  ArrowLeftIcon,
  MicrophoneIcon as ProfessionalMicrophoneIcon,
  EditIcon,
  LayersIcon
} from "./ProfessionalIcons";
import {
  WandIcon
} from "./IconComponents";
import {
  GeneratorIcon,
  ChevronDownIcon as ProfessionalChevronDownIcon,
  ChevronUpIcon as ProfessionalChevronUpIcon
} from "./ProfessionalIcons";

interface GeneratorAppStyledProps {
  platform: Platform;
  setPlatform: (platform: Platform) => void;
  contentType: ContentType;
  setContentType: (type: ContentType) => void;
  userInput: string;
  setUserInput: (input: string) => void;
  targetAudience: string;
  setTargetAudience: (audience: string) => void;
  batchVariations: number;
  setBatchVariations: (count: number) => void;
  selectedAiPersonaId: string;
  setSelectedAiPersonaId: (id: string) => void;

  // Premium features
  userPlan?: "free" | "pro" | "enterprise";
  isPremiumUser?: boolean;
  allPersonas: AiPersona[];
  seoKeywords: string;
  setSeoKeywords: (keywords: string) => void;
  seoMode: SeoKeywordMode;
  setSeoMode: (mode: SeoKeywordMode) => void;
  seoIntensity: SeoIntensity;
  setSeoIntensity: (intensity: SeoIntensity) => void;
  abTestType: ABTestableContentType;
  setAbTestType: (type: ABTestableContentType) => void;
  targetLanguage: Language;
  setTargetLanguage: (language: Language) => void;
  aspectRatioGuidance: AspectRatioGuidance;
  setAspectRatioGuidance: (guidance: AspectRatioGuidance) => void;
  selectedImageStyles: ImagePromptStyle[];
  toggleImageStyle: (style: ImagePromptStyle) => void;
  selectedImageMoods: ImagePromptMood[];
  toggleImageMood: (mood: ImagePromptMood) => void;
  negativeImagePrompt: string;
  setNegativeImagePrompt: (prompt: string) => void;
  includeCTAs: boolean;
  setIncludeCTAs: (include: boolean) => void;
  videoLength: string;
  setVideoLength: (length: string) => void;
  customVideoLength: string;
  setCustomVideoLength: (length: string) => void;
  generatedOutput:
    | GeneratedOutput
    | ContentBriefOutput
    | PollQuizOutput
    | ReadabilityOutput
    | PromptOptimizationSuggestion[]
    | ParsedChannelAnalysisSection[]
    | ContentStrategyPlanOutput
    | EngagementFeedbackOutput
    | TrendAnalysisOutput
    | null;
  displayedOutputItem: HistoryItem | null;
  isLoading: boolean;
  error: string | null;
  copied: boolean;
  abTestResults?: ABTestVariation[] | null;
  showRefineOptions: boolean;
  setShowRefineOptions: (show: boolean) => void;
  showTextActionOptions: boolean;
  setShowTextActionOptions: (show: boolean) => void;
  history: HistoryItem[];
  viewingHistoryItemId: string | null;
  apiKeyMissing: boolean;
  isRecording: boolean;
  currentPlaceholder: string;
  currentContentTypeDetails: any;
  isBatchSupported: boolean;
  isABTestSupported: boolean;

  // Prompt Builder State
  showGuidedBuilder?: boolean;
  setShowGuidedBuilder?: (show: boolean) => void;
  isAiPersonaModalOpen: boolean;
  setIsAiPersonaModalOpen: (open: boolean) => void;
  onGenerate: () => void;
  onOptimizePrompt: () => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onShowTemplateModal: () => void;
  onShowPersonaModal: () => void;
  onShowCustomPersonaManager: () => void;
  onShowTemplateModal: () => void;
  onCopyToClipboard: (text?: string) => void;
  onExportMarkdown: (output: any, userInput: string) => void;
  onRefine: (refinementType: RefinementType) => void;
  onTextAction: (actionType: ContentType) => void;
  onViewHistoryItem: (item: HistoryItem) => void;
  onToggleFavorite: (id: string) => void;
  onPinToCanvas: (item: HistoryItem) => void;
  onDeleteHistoryItem: (id: string) => void;
  onUseHistoryItem: (item: HistoryItem) => void;
  onClearAppHistory: () => void;
  onUseAsCanvasBackground: () => void;
  onSendToCanvas: (content: string, title: string) => void;
  onAddToHistory: (
    itemOutput: any,
    originalContentType: ContentType,
    originalUserInput: string,
    actionParams?: any,
  ) => void;
  renderOutput: () => React.ReactNode;
  isPremium?: boolean;
  onUpgrade?: () => void;
  expandedIdeas: { [outputId: string]: { [ideaNumber: number]: any } };
  collapsedIdeas: { [outputId: string]: { [ideaNumber: number]: boolean } };
  onRemoveExpandedIdea?: (ideaNumber: number) => void;
  onApplyPremiumTemplate?: (template: any) => void;
  onApplyCustomPersona?: (persona: any) => void;
  onSetSEOConfig?: (config: any) => void;
  onSetAIBoost?: (enabled: boolean) => void;
  selectedPremiumTemplate?: any;
  selectedCustomPersona?: any;
  premiumSEOConfig?: any;
  aiBoostEnabled?: boolean;
  onRegenerateText?: (selectedText: string, context: any) => void;
  onRefineSelectedText?: (selectedText: string, action: string) => void;
  onCustomAction?: (selectedText: string, action: string, toolId: string) => void;
  onRegenerateTextAsync?: (selectedText: string, context: any) => Promise<string>;
  onRefineSelectedTextAsync?: (selectedText: string, action: string) => Promise<string>;
  onCustomActionAsync?: (selectedText: string, action: string, toolId: string) => Promise<string>;
}

// Advanced Settings State
interface AdvancedSettings {
  tone: 'professional' | 'casual' | 'humorous' | 'educational' | 'inspirational';
  length: 'short' | 'medium' | 'long' | 'custom';
  customLength: string;
  includeHashtags: boolean;
  includeCTAs: boolean;
  enableSEO: boolean;
  creativityLevel: number;
  emotionalTone: string;
  writingStyle: string;
}

export const GeneratorAppStyled: React.FC<GeneratorAppStyledProps> = (props) => {
  const [currentView, setCurrentView] = useState<'config' | 'generate' | 'results'>('config');
  const [historyOpen, setHistoryOpen] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showPremiumShowcase, setShowPremiumShowcase] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeFeatureName, setUpgradeFeatureName] = useState('');
  const [upgradeFeatureDescription, setUpgradeFeatureDescription] = useState('');
  
  // Advanced Settings State
  const [advancedSettings, setAdvancedSettings] = useState<AdvancedSettings>({
    tone: 'professional',
    length: 'medium',
    customLength: '',
    includeHashtags: true,
    includeCTAs: props.includeCTAs,
    enableSEO: false,
    creativityLevel: 50,
    emotionalTone: 'neutral',
    writingStyle: 'clear'
  });

  const userPlan = props.userPlan || "free";
  const isPremiumUser = props.isPremiumUser || false;

  // Handle premium feature clicks
  const handlePremiumFeatureClick = (featureName: string, description?: string) => {
    if (!isPremiumUser) {
      setUpgradeFeatureName(featureName);
      setUpgradeFeatureDescription(description || `${featureName} is a premium feature designed to enhance your content creation with advanced AI capabilities.`);
      setShowUpgradeModal(true);
      return false;
    }
    return true;
  };

  // Quick Action Cards - memoized to prevent recreation on every render
  const quickActions = React.useMemo(() => [
    {
      id: "smart-templates",
      title: "Smart Templates",
      description: "Browse proven content templates",
      icon: <SmartTemplateIcon key="icon-template" className="w-6 h-6" />,
      color: "#2563eb",
      onClick: props.onShowTemplateModal,
      badge: isPremiumUser ? "50+" : "5"
    },
    {
      id: "ai-personas",
      title: "AI Personas",
      description: "Choose your brand voice",
      icon: <AIPersonaIcon key="icon-person" className="w-6 h-6" />,
      color: "#7c3aed",
      onClick: props.onShowPersonaModal,
      badge: props.allPersonas.length.toString()
    },
    {
      id: "voice-input",
      title: "Voice Input",
      description: "Speak your content idea",
      icon: <VoiceInputIcon key="icon-microphone" className="w-6 h-6" />,
      color: "#06b6d4",
      onClick: props.isRecording ? props.onStopRecording : props.onStartRecording,
      badge: props.isRecording ? "Recording" : "Ready"
    },
    {
      id: "optimize-prompt",
      title: "Optimize Prompt",
      description: "AI-powered prompt enhancement",
      icon: <OptimizePromptIcon key="icon-generator" className="w-6 h-6" />,
      color: "#ec4899",
      onClick: props.onOptimizePrompt,
      badge: "Smart"
    }
  ], [isPremiumUser, props.onShowTemplateModal, props.onShowPersonaModal, props.allPersonas.length, props.isRecording, props.onStopRecording, props.onStartRecording, props.onOptimizePrompt]);

  // Content Type Categories based on actual content types
  const contentCategories = [
    { id: 'all', label: 'All Types', icon: <GlobeIcon className="w-4 h-4" /> },
    { id: 'content-creation', label: 'Content Creation', icon: <BookmarkIcon className="w-4 h-4" /> },
    { id: 'visual', label: 'Visual Content', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'analysis', label: 'Analysis & Planning', icon: <AnalyticsIcon className="w-4 h-4" /> },
    { id: 'premium', label: 'Premium Only', icon: <SparklesIcon className="w-4 h-4" /> },
  ];

  const filteredContentTypes = USER_SELECTABLE_CONTENT_TYPES.filter(ct => {
    if (selectedCategory === 'all') return true;

    // Content Creation: Ideas, Scripts, Titles, Hooks, etc.
    if (selectedCategory === 'content-creation') {
      return [
        ContentType.Idea,
        ContentType.Script,
        ContentType.Title,
        ContentType.VideoHook,
        ContentType.ContentBrief,
        ContentType.MicroScript,
        ContentType.VoiceToScript
      ].includes(ct.value);
    }

    // Visual Content: Images, Thumbnails, etc.
    if (selectedCategory === 'visual') {
      return [
        ContentType.Image,
        ContentType.ImagePrompt,
        ContentType.ThumbnailConcept
      ].includes(ct.value);
    }

    // Analysis & Planning: Polls, Quizzes, Gap Finder, A/B Test
    if (selectedCategory === 'analysis') {
      return [
        ContentType.PollsQuizzes,
        ContentType.ContentGapFinder,
        ContentType.ABTest
      ].includes(ct.value);
    }

    // Premium content types
    if (selectedCategory === 'premium') {
      return isPremiumContentType(ct.value);
    }

    return true;
  });

  const renderConfigurationView = () => (
    <div className="space-y-8">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Credits Left"
          value="150"
          change="+25"
          changeType="positive"
          icon={<SparklesIcon className="w-6 h-6" />}
          description="Refills in 2 days"
        />
        <StatCard
          title="Premium Features"
          value={isPremiumUser ? "50+" : "8"}
          change={isPremiumUser ? "Unlocked" : "Available"}
          changeType={isPremiumUser ? "positive" : "neutral"}
          icon={<PremiumIcon className="w-6 h-6" />}
          description={isPremiumUser ? "All features active" : "Upgrade to unlock"}
        />
        <StatCard
          title="Content Created"
          value="1,247"
          change="+156"
          changeType="positive"
          icon={<DocumentIcon className="w-6 h-6" />}
          description="This month"
        />
      </div>

      {/* Quick Actions */}
      <Card variant="glow" className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <RocketIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="heading-4 mb-0">Quick Start</h2>
            <p className="body-sm">Get started with these powerful features</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3">
          {quickActions.map((action, index) => (
            <QuickActionCard
              key={`quick-action-${action.id}-${index}`}
              title={action.title}
              description={action.description}
              icon={action.icon}
              color={action.color}
              onClick={action.onClick}
              badge={action.badge}
            />
          ))}
        </div>
      </Card>

      {/* Platform & Content Type Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Platform Selection */}
        <Card className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <GlobeIcon className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="heading-4 mb-0">Platform</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {PLATFORMS.map((platform, index) => (
              <button
                key={`platform-${index}-${platform}`}
                onClick={() => props.setPlatform(platform)}
                className={`p-4 rounded-xl border text-sm font-medium transition-all flex items-center justify-center ${
                  props.platform === platform
                    ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]'
                    : 'border-[var(--border-primary)] bg-[var(--surface-tertiary)] text-[var(--text-secondary)] hover:border-[var(--border-secondary)]'
                }`}
              >
                {platform}
              </button>
            ))}
          </div>
        </Card>

        {/* Content Type Selection */}
        <Card className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <TemplateIcon className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="heading-4 mb-0">Content Type</h3>
            </div>
            <Badge variant="info" size="sm">{filteredContentTypes.length} types</Badge>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {contentCategories.map((category, index) => (
              <button
                key={`category-${index}-${category.id}`}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-[var(--brand-primary)]/20 text-[var(--brand-primary)] border border-[var(--brand-primary)]/30'
                    : 'bg-[var(--surface-tertiary)] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
                }`}
              >
                {category.icon}
                <span>{category.label}</span>
              </button>
            ))}
          </div>

          <select
            value={props.contentType}
            onChange={(e) => props.setContentType(e.target.value as ContentType)}
            className="w-full p-4 bg-[var(--surface-tertiary)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]/20 outline-none"
          >
            {filteredContentTypes.map((ct, index) => {
              const isPremium = isPremiumContentType(ct.value);
              const isAccessible = !isPremium || props.isPremiumUser;

              return (
                <option
                  key={`content-type-${index}-${ct.value}`}
                  value={ct.value}
                  style={{
                    color: isAccessible ? "inherit" : "#64748b",
                  }}
                >
                  {ct.label}
                  {isPremium && !props.isPremiumUser ? " 🔒 Pro" : ""}
                </option>
              );
            })}
          </select>
        </Card>
      </div>

      {/* Advanced Settings Panel */}
      <Card className="space-y-6">
        <button
          onClick={() => setAdvancedOpen(!advancedOpen)}
          className="w-full flex items-center justify-between p-4 bg-[var(--surface-tertiary)] rounded-xl hover:bg-[var(--surface-quaternary)] transition-colors"
        >
          <div className="flex items-center space-x-3">
            <AdjustmentsIcon className="w-5 h-5 text-[var(--brand-primary)]" />
            <span className="font-semibold text-[var(--text-primary)]">Advanced Settings</span>
            <Badge variant="info" size="sm">Pro</Badge>
          </div>
          {advancedOpen ? (
            <ProfessionalChevronUpIcon className="w-5 h-5 text-[var(--text-secondary)]" />
          ) : (
            <ProfessionalChevronDownIcon className="w-5 h-5 text-[var(--text-secondary)]" />
          )}
        </button>

        <AnimatePresence>
          {advancedOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Tone Selection */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-[var(--text-primary)]">
                    Tone & Style
                  </label>
                  <select
                    value={advancedSettings.tone}
                    onChange={(e) => setAdvancedSettings(prev => ({ ...prev, tone: e.target.value as any }))}
                    className="w-full p-3 bg-[var(--surface-tertiary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:border-[var(--brand-primary)] outline-none"
                  >
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="humorous">Humorous</option>
                    <option value="educational">Educational</option>
                    <option value="inspirational">Inspirational</option>
                  </select>
                </div>

                {/* Length Control - Only show for Script content type */}
                {props.contentType === 'Script' && (
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-[var(--text-primary)]">
                      Content Length
                    </label>
                    <select
                      value={advancedSettings.length}
                      onChange={(e) => setAdvancedSettings(prev => ({ ...prev, length: e.target.value as any }))}
                      className="w-full p-3 bg-[var(--surface-tertiary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:border-[var(--brand-primary)] outline-none"
                    >
                      <option value="short">Short (50-150 words)</option>
                      <option value="medium">Medium (150-300 words)</option>
                      <option value="long">Long (300-500 words)</option>
                      <option value="custom">Custom Length</option>
                    </select>
                  </div>
                )}

                {/* Language Selection */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-[var(--text-primary)]">
                    Language
                  </label>
                  <select
                    value={props.targetLanguage}
                    onChange={(e) => props.setTargetLanguage(e.target.value as Language)}
                    className="w-full p-3 bg-[var(--surface-tertiary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:border-[var(--brand-primary)] outline-none"
                  >
                    {SUPPORTED_LANGUAGES.map((lang, index) => (
                      <option key={`language-${index}-${lang.value}`} value={lang.value}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Target Audience */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-[var(--text-primary)]">
                    Target Audience
                  </label>
                  <Input
                    value={props.targetAudience}
                    onChange={props.setTargetAudience}
                    placeholder="e.g., Young entrepreneurs, Tech enthusiasts"
                    className="w-full"
                  />
                </div>

                {/* AI Persona */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-[var(--text-primary)]">
                    AI Persona
                  </label>
                  <select
                    value={props.selectedAiPersonaId}
                    onChange={(e) => props.setSelectedAiPersonaId(e.target.value)}
                    className="w-full p-3 bg-[var(--surface-tertiary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:border-[var(--brand-primary)] outline-none"
                  >
                    {props.allPersonas.map((persona, index) => (
                      <option key={`persona-${index}-${persona.id}`} value={persona.id}>
                        {persona.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Batch Variations */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-[var(--text-primary)]">
                    Variations
                  </label>
                  <select
                    value={props.batchVariations}
                    onChange={(e) => props.setBatchVariations(parseInt(e.target.value))}
                    className="w-full p-3 bg-[var(--surface-tertiary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:border-[var(--brand-primary)] outline-none"
                  >
                    <option key="variation-1" value={1}>1 variation</option>
                    {props.isPremiumUser && (
                      <React.Fragment key="premium-variations-fragment">
                        <option key="variations-3-premium" value={3}>3 variations</option>
                        <option key="variations-5-premium" value={5}>5 variations</option>
                        <option key="variations-10-premium" value={10}>10 variations (Pro)</option>
                      </React.Fragment>
                    )}
                  </select>
                </div>
              </div>

              {/* Feature Toggles */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <label className="flex items-center space-x-3 p-4 bg-[var(--surface-tertiary)] rounded-lg cursor-pointer hover:bg-[var(--surface-quaternary)] transition-colors">
                  <input
                    type="checkbox"
                    checked={advancedSettings.includeHashtags}
                    onChange={(e) => setAdvancedSettings(prev => ({ ...prev, includeHashtags: e.target.checked }))}
                    className="w-4 h-4 text-[var(--brand-primary)] rounded focus:ring-[var(--brand-primary)]"
                  />
                  <span className="text-sm text-[var(--text-primary)]">Include Hashtags</span>
                </label>

                <label className="flex items-center space-x-3 p-4 bg-[var(--surface-tertiary)] rounded-lg cursor-pointer hover:bg-[var(--surface-quaternary)] transition-colors">
                  <input
                    type="checkbox"
                    checked={props.includeCTAs}
                    onChange={(e) => props.setIncludeCTAs(e.target.checked)}
                    className="w-4 h-4 text-[var(--brand-primary)] rounded focus:ring-[var(--brand-primary)]"
                  />
                  <span className="text-sm text-[var(--text-primary)]">Include CTAs</span>
                </label>

                <label
                  className={`flex items-center space-x-3 p-4 bg-[var(--surface-tertiary)] rounded-lg cursor-pointer transition-colors ${
                    isPremiumUser
                      ? 'hover:bg-[var(--surface-quaternary)]'
                      : 'hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-pink-500/10 hover:border hover:border-purple-400/20'
                  }`}
                  title={!isPremiumUser ? 'Click to upgrade and unlock SEO Optimization' : ''}
                  onClick={(e) => {
                    if (!handlePremiumFeatureClick('SEO Optimization', 'Optimize your content for search engines with advanced keyword analysis, SERP insights, and ranking strategies.')) {
                      e.preventDefault();
                    }
                  }}
                >
                  <input
                    type="checkbox"
                    checked={advancedSettings.enableSEO}
                    onChange={(e) => {
                      if (isPremiumUser) {
                        setAdvancedSettings(prev => ({ ...prev, enableSEO: e.target.checked }));
                      }
                    }}
                    className="w-4 h-4 text-[var(--brand-primary)] rounded focus:ring-[var(--brand-primary)]"
                    disabled={!isPremiumUser}
                  />
                  <span className="text-sm text-[var(--text-primary)]">SEO Optimization</span>
                  {!isPremiumUser && <Badge variant="warning" size="sm">Pro</Badge>}
                </label>

                <label
                  className={`flex items-center space-x-3 p-4 bg-[var(--surface-tertiary)] rounded-lg cursor-pointer transition-colors ${
                    isPremiumUser
                      ? 'hover:bg-[var(--surface-quaternary)]'
                      : 'hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-pink-500/10 hover:border hover:border-purple-400/20'
                  }`}
                  title={!isPremiumUser ? 'Click to upgrade and unlock AI Boost' : ''}
                  onClick={(e) => {
                    if (!handlePremiumFeatureClick('AI Boost', 'Supercharge your content generation with advanced AI models, enhanced creativity, and superior output quality.')) {
                      e.preventDefault();
                    }
                  }}
                >
                  <input
                    type="checkbox"
                    checked={props.aiBoostEnabled}
                    onChange={(e) => {
                      if (isPremiumUser) {
                        props.onSetAIBoost?.(e.target.checked);
                      }
                    }}
                    className="w-4 h-4 text-[var(--brand-primary)] rounded focus:ring-[var(--brand-primary)]"
                    disabled={!isPremiumUser}
                  />
                  <span className="text-sm text-[var(--text-primary)]">AI Boost</span>
                  {!isPremiumUser && <Badge variant="warning" size="sm">Pro</Badge>}
                </label>
              </div>

              {/* SEO Options */}
              {advancedSettings.enableSEO && isPremiumUser && (
                <Card variant="base" className="space-y-4">
                  <h4 className="font-semibold text-[var(--text-primary)] flex items-center space-x-2">
                    <SEOIcon className="w-4 h-4" />
                    <span>SEO Optimization</span>
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="SEO Keywords"
                      value={props.seoKeywords}
                      onChange={props.setSeoKeywords}
                      placeholder="keyword1, keyword2, keyword3"
                    />
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-[var(--text-primary)]">
                        SEO Intensity
                      </label>
                      <select
                        value={props.seoIntensity}
                        onChange={(e) => props.setSeoIntensity(e.target.value as SeoIntensity)}
                        className="w-full p-3 bg-[var(--surface-tertiary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:border-[var(--brand-primary)] outline-none"
                      >
                        <option value="low">Low - Natural integration</option>
                        <option value="medium">Medium - Balanced approach</option>
                        <option value="high">High - Maximum optimization</option>
                      </select>
                    </div>
                  </div>
                </Card>
              )}

              {/* Image & Video Options */}
              {(props.contentType.includes('Image') || props.contentType.includes('Video')) && (
                <Card variant="base" className="space-y-4">
                  <h4 className="font-semibold text-[var(--text-primary)] flex items-center space-x-2">
                    {props.contentType.includes('Image') ? <ImageIcon className="w-4 h-4" /> : <VideoIcon className="w-4 h-4" />}
                    <span>{props.contentType.includes('Image') ? 'Image' : 'Video'} Options</span>
                  </h4>
                  
                  {props.contentType.includes('Image') && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-[var(--text-primary)]">
                          Aspect Ratio
                        </label>
                        <select
                          value={props.aspectRatioGuidance}
                          onChange={(e) => props.setAspectRatioGuidance(e.target.value as AspectRatioGuidance)}
                          className="w-full p-3 bg-[var(--surface-tertiary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:border-[var(--brand-primary)] outline-none"
                        >
                          {ASPECT_RATIO_GUIDANCE_OPTIONS.map((option, index) => (
                            <option key={`aspect-ratio-${index}-${option.value}`} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-[var(--text-primary)]">
                          Image Styles
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {IMAGE_PROMPT_STYLES.map((style, index) => (
                            <button
                              key={`image-style-${index}-${style}`}
                              onClick={() => props.toggleImageStyle(style)}
                              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                                props.selectedImageStyles.includes(style)
                                  ? 'bg-[var(--brand-primary)]/20 text-[var(--brand-primary)] border border-[var(--brand-primary)]/30'
                                  : 'bg-[var(--surface-tertiary)] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
                              }`}
                            >
                              {style}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-[var(--text-primary)]">
                          Image Moods
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {IMAGE_PROMPT_MOODS.map((mood, index) => (
                            <button
                              key={`image-mood-${index}-${mood}`}
                              onClick={() => props.toggleImageMood(mood)}
                              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                                props.selectedImageMoods.includes(mood)
                                  ? 'bg-[var(--brand-primary)]/20 text-[var(--brand-primary)] border border-[var(--brand-primary)]/30'
                                  : 'bg-[var(--surface-tertiary)] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
                              }`}
                            >
                              {mood}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {props.contentType.includes('Video') && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-[var(--text-primary)]">
                        Video Length
                      </label>
                      <select
                        value={props.videoLength}
                        onChange={(e) => props.setVideoLength(e.target.value)}
                        className="w-full p-3 bg-[var(--surface-tertiary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:border-[var(--brand-primary)] outline-none"
                      >
                        {VIDEO_LENGTH_OPTIONS.map((option, index) => (
                          <option key={`video-length-${index}-${option.value}`} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </Card>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <Button
          variant="secondary"
          onClick={() => setCurrentView('generate')}
          disabled={!props.platform || !props.contentType}
        >
          Continue to Generate
        </Button>
        
        <Button
          variant="ghost"
          onClick={() => setHistoryOpen(true)}
          icon={<BookmarkIcon className="w-4 h-4" />}
        >
          View History
        </Button>
      </div>
    </div>
  );

  const renderGenerateView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Input Area */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <SparklesIcon className="w-5 h-5 text-emerald-400" />
            </div>
            <h2 className="heading-4 mb-0">Create Your Content</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[var(--text-primary)]">
                Describe Your Content Idea
              </label>

              {/* Prompt Examples Carousel or Guided Builder */}
              {props.showGuidedBuilder ? (
                <GuidedPromptBuilder
                  onGeneratePrompt={(prompt) => props.setUserInput(prompt)}
                  onBackToExamples={() => props.setShowGuidedBuilder?.(false)}
                  className="mb-4"
                />
              ) : (
                <PromptExamplesCarousel
                  onSelectPrompt={(prompt) => props.setUserInput(prompt)}
                  onToggleGuided={() => props.setShowGuidedBuilder?.(true)}
                  className="mb-4"
                />
              )}

              <textarea
                value={props.userInput}
                onChange={(e) => props.setUserInput(e.target.value)}
                placeholder={props.currentPlaceholder}
                rows={8}
                className="w-full p-4 bg-[var(--surface-tertiary)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-tertiary)] resize-none focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]/20 outline-none"
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-[var(--text-tertiary)]">
                  {props.userInput.length}/2000 characters
                </span>
                <div className="flex space-x-1">
                  <button
                    onClick={props.onOptimizePrompt}
                    className="flex items-center space-x-1.5 px-3 py-1.5 text-xs bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-violet-300 hover:text-violet-200 font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-violet-500/30 hover:to-purple-500/30 rounded-lg backdrop-blur-sm"
                  >
                    <WandIcon className="w-3 h-3" />
                    <span>Optimize</span>
                  </button>
                  <button
                    onClick={props.onShowTemplateModal}
                    className="flex items-center space-x-1.5 px-3 py-1.5 text-xs bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 hover:text-emerald-200 font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-emerald-500/30 hover:to-teal-500/30 rounded-lg backdrop-blur-sm"
                  >
                    <TemplateIcon className="w-3 h-3" />
                    <span>Templates</span>
                  </button>
                  <button
                    onClick={props.isRecording ? props.onStopRecording : props.onStartRecording}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium transition-all duration-200 rounded-lg backdrop-blur-sm ${
                      props.isRecording
                        ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-300 hover:text-red-200 hover:bg-gradient-to-r hover:from-red-500/30 hover:to-pink-500/30'
                        : 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 hover:text-blue-200 hover:bg-gradient-to-r hover:from-blue-500/30 hover:to-cyan-500/30'
                    }`}
                  >
                    <ProfessionalMicrophoneIcon className="w-3 h-3" />
                    <span>{props.isRecording ? 'Stop' : 'Voice'}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="secondary"
                onClick={() => setCurrentView('config')}
                icon={<ArrowLeftIcon className="w-4 h-4" />}
              >
                Back to Config
              </Button>
              <Button
                variant="primary"
                loading={props.isLoading}
                disabled={props.apiKeyMissing || (!props.userInput.trim() && !['ImagePrompt', 'TrendAnalysis', 'ContentGapFinder', 'VoiceToScript'].includes(props.contentType))}
                onClick={() => {
                  props.onGenerate();
                  setCurrentView('results');
                }}
                fullWidth
                icon={<SparklesIcon className="w-4 h-4" />}
              >
                {props.isLoading ? 'Generating Content...' : 'Generate Content'}
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Sidebar with Tips & Preview */}
      <div className="space-y-6">
        <Card className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <BulbIcon className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="heading-4 mb-0">Pro Tips</h3>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-2">
              <span className="text-emerald-400 mt-0.5 text-xs">●</span>
              <span className="text-[var(--text-secondary)]">Be specific about your content goals and desired tone</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-emerald-400 mt-0.5 text-xs">●</span>
              <span className="text-[var(--text-secondary)]">Include relevant keywords or topics you want to cover</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-emerald-400 mt-0.5 text-xs">●</span>
              <span className="text-[var(--text-secondary)]">Mention your target audience's interests and pain points</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-emerald-400 mt-0.5 text-xs">●</span>
              <span className="text-[var(--text-secondary)]">Try different variations to find the perfect style</span>
            </div>
          </div>
        </Card>

        {/* Current Configuration Summary */}
        <Card className="space-y-4">
          <h3 className="heading-4 mb-0">Current Setup</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--text-tertiary)]">Platform:</span>
              <Badge variant="info" size="sm">{props.platform}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-tertiary)]">Type:</span>
              <Badge variant="neutral" size="sm">{props.contentType}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-tertiary)]">Variations:</span>
              <Badge variant="neutral" size="sm">{props.batchVariations}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-tertiary)]">Language:</span>
              <Badge variant="neutral" size="sm">{props.targetLanguage}</Badge>
            </div>
          </div>
        </Card>

        {/* Quick Stats */}
        <Card className="space-y-4">
          <h3 className="heading-4 mb-0">Today's Progress</h3>
          
          <div className="space-y-3">
            <ProgressBar
              label="Credits Used"
              value={35}
              max={150}
              color="var(--accent-emerald)"
            />
            <ProgressBar
              label="Daily Quota"
              value={8}
              max={25}
              color="var(--brand-primary)"
            />
          </div>
        </Card>
      </div>
    </div>
  );

  const renderResultsView = () => (
    <div className="space-y-6">
      <Card className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <ResultsIcon className="w-5 h-5 text-emerald-400" />
            </div>
            <h2 className="heading-4 mb-0">Generated Content</h2>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              onClick={() => setCurrentView('config')}
              size="sm"
            >
              New Content
            </Button>
            <Button
              variant="ghost"
              onClick={() => setHistoryOpen(true)}
              size="sm"
              icon={<BookmarkIcon className="w-4 h-4" />}
            >
              History
            </Button>
          </div>
        </div>

        <GeneratorOutput
          output={props.generatedOutput}
          displayedOutputItem={props.displayedOutputItem}
          isLoading={props.isLoading}
          error={props.error}
          copied={props.copied}
          abTestResults={props.abTestResults}
          abTestType={props.abTestType}
          showRefineOptions={props.showRefineOptions}
          setShowRefineOptions={props.setShowRefineOptions}
          showTextActionOptions={props.showTextActionOptions}
          setShowTextActionOptions={props.setShowTextActionOptions}
          onCopyToClipboard={props.onCopyToClipboard}
          onExportMarkdown={props.onExportMarkdown}
          onRefine={props.onRefine}
          onTextAction={props.onTextAction}
          onSendToCanvas={props.onSendToCanvas}
          renderOutput={props.renderOutput}
          expandedIdeas={props.expandedIdeas}
          collapsedIdeas={props.collapsedIdeas}
          onRegenerateText={props.onRegenerateText}
          onRefineSelectedText={props.onRefineSelectedText}
          onCustomAction={props.onCustomAction}
          onRegenerateTextAsync={props.onRegenerateTextAsync}
          onRefineSelectedTextAsync={props.onRefineSelectedTextAsync}
          onCustomActionAsync={props.onCustomActionAsync}
          isPremium={props.isPremium}
          onRemoveExpandedIdea={props.onRemoveExpandedIdea}
        />
      </Card>
    </div>
  );

  return (
    <div className="h-full bg-[var(--surface-primary)] text-[var(--text-primary)]">
      {/* Header */}
      <TabHeader
        title="AI Content Generator"
        subtitle="Create engaging content with advanced AI assistance"
        icon={<SparklesIcon className="w-6 h-6" />}
        badge={isPremiumUser ? "Pro" : "Free"}
        actions={
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPremiumShowcase(!showPremiumShowcase)}
              icon={<SparklesIcon className="w-4 h-4" />}
            >
              Premium Types
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setHistoryOpen(true)}
              icon={<BookmarkIcon className="w-4 h-4" />}
            >
              History
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={props.onUpgrade}
              icon={<SparklesIcon className="w-4 h-4" />}
            >
              {isPremiumUser ? "Manage Plan" : "Upgrade"}
            </Button>
          </div>
        }
      />

      {/* Navigation Tabs */}
      <div className="px-8 py-4 border-b border-[var(--border-primary)]">
        <div className="flex items-center space-x-6">
          {[
            { id: 'config', label: 'Configure', icon: <CogIcon className="w-4 h-4" /> },
            { id: 'generate', label: 'Generate', icon: <SparklesIcon className="w-4 h-4" /> },
            { id: 'results', label: 'Results', icon: <ResultsIcon className="w-4 h-4" /> }
          ].map((tab, index) => (
            <button
              key={`tab-${tab.id}-${index}`}
              onClick={() => setCurrentView(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                currentView === tab.id
                  ? 'bg-[var(--brand-primary)]/20 text-[var(--brand-primary)] border border-[var(--brand-primary)]/30'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-tertiary)]'
              }`}
            >
              {tab.icon}
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        {/* Main Generator Form - Moved to Top */}
        <div className="mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentView === 'config' && renderConfigurationView()}
              {currentView === 'generate' && renderGenerateView()}
              {currentView === 'results' && renderResultsView()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Usage Warning */}
        {props.onUpgrade && !isPremiumUser && (
          <div className="mb-6">
            <UsageWarning onUpgrade={props.onUpgrade} />
          </div>
        )}

        {/* Premium Status */}
        <div className="mb-6">
          <PremiumStatusIndicator
            isPremium={props.isPremium}
            selectedTemplate={props.selectedPremiumTemplate}
            selectedPersona={props.selectedCustomPersona}
            seoConfig={props.premiumSEOConfig}
            aiBoostEnabled={props.aiBoostEnabled}
          />
        </div>

        {/* Premium Content Types Showcase */}
        {showPremiumShowcase && (
          <div className="mb-6">
            <Card variant="glow" className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                    <SparklesIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="heading-4 mb-0">Premium Content Types</h2>
                    <p className="body-sm">Discover advanced AI-powered content generation</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPremiumShowcase(false)}
                  icon={<span className="text-lg">✕</span>}
                >
                  Close
                </Button>
              </div>

              <PremiumContentTypesShowcase
                userPlan={userPlan}
                isPremiumUser={isPremiumUser}
                onSelectContentType={(contentType) => {
                  props.setContentType(contentType);
                  setShowPremiumShowcase(false);
                }}
                onClose={() => setShowPremiumShowcase(false)}
                onUpgrade={props.onUpgrade}
              />
            </Card>
          </div>
        )}

        {/* Premium Generator Enhancement - Only show in config and generate phases */}
        {currentView !== 'results' && (
          <div className="mb-6">
            <PremiumGeneratorEnhancement
              platform={props.platform}
              contentType={props.contentType}
              userInput={props.userInput}
              targetAudience={props.targetAudience}
              isPremium={props.isPremiumUser}
              onUpgrade={props.onUpgrade}
              onApplyTemplate={props.onApplyPremiumTemplate}
              onGenerateBatch={(config) => {
                console.log('Batch generation config:', config);
                // Handle batch generation
              }}
              onApplyPersona={props.onApplyCustomPersona}
              onOptimizeForSEO={props.onSetSEOConfig}
              onPredictPerformance={() => {
                console.log('Performance prediction requested');
                // Handle performance prediction
              }}
            />
          </div>
        )}
      </div>

      {/* History Sidebar */}
      <AnimatePresence>
        {historyOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[var(--surface-overlay)] backdrop-blur-sm z-40"
              onClick={() => setHistoryOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 w-96 h-screen bg-[var(--surface-secondary)] backdrop-blur-xl border-l border-[var(--border-primary)] z-50"
            >
              <div className="p-6 border-b border-[var(--border-primary)]">
                <div className="flex items-center justify-between">
                  <h2 className="heading-4 mb-0">Content History</h2>
                  <button
                    onClick={() => setHistoryOpen(false)}
                    className="w-8 h-8 bg-[var(--surface-tertiary)] hover:bg-[var(--surface-quaternary)] rounded-lg flex items-center justify-center text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                <GeneratorSidebar
                  history={props.history}
                  viewingHistoryItemId={props.viewingHistoryItemId}
                  onViewHistoryItem={props.onViewHistoryItem}
                  onToggleFavorite={props.onToggleFavorite}
                  onPinToCanvas={props.onPinToCanvas}
                  onDeleteHistoryItem={props.onDeleteHistoryItem}
                  onClearAppHistory={props.onClearAppHistory}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Premium Upgrade Modal */}
      <PremiumUpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={() => {
          setShowUpgradeModal(false);
          props.onUpgrade?.();
        }}
        featureName={upgradeFeatureName}
        featureDescription={upgradeFeatureDescription}
      />
    </div>
  );
};
