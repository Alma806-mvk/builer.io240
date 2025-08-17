import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GeneratorForm } from "./GeneratorForm";
import { GeneratorOutput } from "./GeneratorOutput";
import { GeneratorSidebar } from "./GeneratorSidebar";
import { UsageWarning } from "./UsageWarning";
import { PremiumStatusIndicator } from "./PremiumStatusIndicator";
import { PremiumContentTypesShowcase } from "./PremiumContentTypesShowcase";
import "../styles/premiumButton.css";
import "../styles/generatorModern.css";
import "../styles/timelineWizard.css";
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
} from "../../constants";
import {
  SparklesIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  MenuIcon,
} from "./IconComponents";

interface GeneratorTimelineWizardProps {
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
  isAiPersonaModalOpen: boolean;
  setIsAiPersonaModalOpen: (open: boolean) => void;
  onGenerate: () => void;
  onOptimizePrompt: () => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
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
}

type WizardStep = 'type' | 'config' | 'create' | 'results';

export const GeneratorTimelineWizard: React.FC<GeneratorTimelineWizardProps> = (props) => {
  const [currentStep, setCurrentStep] = useState<WizardStep>('type');
  const [historyOpen, setHistoryOpen] = useState(false);
  const [showPremiumShowcase, setShowPremiumShowcase] = useState(false);
  
  const userPlan = props.userPlan || "free";
  const isPremiumUser = props.isPremiumUser || false;

  const steps = [
    {
      id: 'type' as WizardStep,
      title: 'Content Type',
      description: 'Choose what to create',
      icon: '🎯',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'config' as WizardStep,
      title: 'Configuration',
      description: 'Set up parameters',
      icon: '⚙️',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'create' as WizardStep,
      title: 'Create',
      description: 'Input your ideas',
      icon: '🚀',
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      id: 'results' as WizardStep,
      title: 'Results',
      description: 'View & refine',
      icon: '✨',
      color: 'from-amber-500 to-amber-600'
    }
  ];

  const getCurrentStepIndex = () => steps.findIndex(step => step.id === currentStep);
  const canProceedToNext = () => {
    switch (currentStep) {
      case 'type':
        return props.platform && props.contentType;
      case 'config':
        return true; // Config is optional
      case 'create':
        return props.userInput.trim() || ['ImagePrompt', 'TrendAnalysis', 'ContentGapFinder', 'VoiceToScript'].includes(props.contentType);
      case 'results':
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex < steps.length - 1 && canProceedToNext()) {
      setCurrentStep(steps[currentIndex + 1].id);
    }
  };

  const prevStep = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  const jumpToStep = (stepId: WizardStep) => {
    setCurrentStep(stepId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900/80 via-slate-800/80 to-slate-900/80 backdrop-blur-xl border-b border-slate-700/30">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  AI Content Generator
                </h1>
                <p className="text-slate-300 text-lg">
                  Create professional content with advanced AI
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-sm font-medium border border-emerald-500/30">
                  FREE
                </span>
                <button 
                  onClick={() => props.onUpgrade?.()}
                  className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Upgrade
                </button>
                <button
                  onClick={() => setHistoryOpen(!historyOpen)}
                  className="p-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white rounded-lg transition-colors"
                >
                  📚
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Navigation */}
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute top-8 left-0 right-0 h-0.5 bg-slate-700/50"></div>
            <div 
              className="absolute top-8 left-0 h-0.5 bg-gradient-to-r from-sky-500 to-blue-500 transition-all duration-500 ease-out"
              style={{ width: `${(getCurrentStepIndex() / (steps.length - 1)) * 100}%` }}
            ></div>
            
            {/* Timeline Steps */}
            <div className="relative flex justify-between">
              {steps.map((step, index) => {
                const isActive = step.id === currentStep;
                const isCompleted = getCurrentStepIndex() > index;
                const isAccessible = index <= getCurrentStepIndex() || (getCurrentStepIndex() === index - 1 && canProceedToNext());
                
                return (
                  <motion.button
                    key={step.id}
                    onClick={() => isAccessible && jumpToStep(step.id)}
                    disabled={!isAccessible}
                    className={`group relative flex flex-col items-center ${isAccessible ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                    whileHover={isAccessible ? { scale: 1.05 } : {}}
                    whileTap={isAccessible ? { scale: 0.95 } : {}}
                  >
                    {/* Step Circle */}
                    <div className={`relative w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold transition-all duration-300 ${
                      isActive 
                        ? `bg-gradient-to-r ${step.color} text-white shadow-lg shadow-blue-500/25` 
                        : isCompleted
                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
                        : 'bg-slate-700/50 text-slate-400 border-2 border-slate-600/50'
                    }`}>
                      {isCompleted ? '✓' : step.icon}
                      
                      {/* Active pulse effect */}
                      {isActive && (
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-500/30 to-blue-500/30 animate-ping"></div>
                      )}
                    </div>
                    
                    {/* Step Info */}
                    <div className="mt-3 text-center">
                      <div className={`font-semibold transition-colors ${
                        isActive ? 'text-white' : isCompleted ? 'text-emerald-300' : 'text-slate-400'
                      }`}>
                        {step.title}
                      </div>
                      <div className={`text-sm transition-colors ${
                        isActive ? 'text-slate-300' : 'text-slate-500'
                      }`}>
                        {step.description}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-6xl mx-auto px-6 pb-8">
          {/* Usage Warning */}
          {props.onUpgrade && (
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

          {/* Step Content */}
          <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl rounded-2xl border border-slate-700/30 p-8 shadow-2xl">
            <AnimatePresence mode="wait">
              {/* Step 1: Content Type */}
              {currentStep === 'type' && (
                <motion.div
                  key="type"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">Choose Your Content Type</h2>
                    <p className="text-slate-400">Select the platform and type of content you want to create</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Platform Selection */}
                    <div className="space-y-4">
                      <label className="block text-lg font-semibold text-white mb-4">Platform *</label>
                      <div className="grid grid-cols-2 gap-3">
                        {PLATFORMS.map((p) => (
                          <motion.button
                            key={p}
                            onClick={() => props.setPlatform(p)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                              props.platform === p
                                ? 'border-sky-500 bg-sky-500/10 text-sky-300'
                                : 'border-slate-600 bg-slate-700/30 text-slate-300 hover:border-slate-500 hover:bg-slate-600/30'
                            }`}
                          >
                            <div className="font-medium">{p}</div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Content Type Selection */}
                    <div className="space-y-4">
                      <label className="block text-lg font-semibold text-white mb-4">Content Type *</label>
                      <select
                        value={props.contentType}
                        onChange={(e) => props.setContentType(e.target.value as ContentType)}
                        className="w-full p-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white text-lg focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all"
                      >
                        {USER_SELECTABLE_CONTENT_TYPES.filter(
                          (ct) => ct.value !== ContentType.ChannelAnalysis,
                        ).map((ct) => {
                          const isPremium = isPremiumContentType(ct.value);
                          const isAccessible = !isPremium || props.isPremiumUser;

                          return (
                            <option
                              key={ct.value}
                              value={ct.value}
                              style={{
                                color: isAccessible ? "inherit" : "#64748b",
                                fontStyle: isPremium && !props.isPremiumUser ? "italic" : "normal",
                              }}
                            >
                              {ct.label}
                              {isPremium && !props.isPremiumUser ? " 🔒 Pro" : ""}
                            </option>
                          );
                        })}
                      </select>
                      
                      {props.currentContentTypeDetails?.description && (
                        <p className="text-sm text-slate-400 mt-2">
                          {props.currentContentTypeDetails.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Premium Showcase */}
                  {showPremiumShowcase && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-8 p-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl border border-amber-500/30"
                    >
                      <PremiumContentTypesShowcase
                        userPlan={userPlan}
                        isPremiumUser={isPremiumUser}
                        onSelectContentType={(contentType) => {
                          props.setContentType(contentType);
                        }}
                        onClose={() => setShowPremiumShowcase(false)}
                        onUpgrade={props.onUpgrade}
                      />
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Step 2: Configuration */}
              {currentStep === 'config' && (
                <motion.div
                  key="config"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">Configure Your Content</h2>
                    <p className="text-slate-400">Set up advanced parameters and preferences</p>
                  </div>

                  <div className="bg-slate-800/30 rounded-xl p-6">
                    <GeneratorForm
                      platform={props.platform}
                      setPlatform={props.setPlatform}
                      contentType={props.contentType}
                      setContentType={props.setContentType}
                      userInput={props.userInput}
                      setUserInput={props.setUserInput}
                      targetAudience={props.targetAudience}
                      setTargetAudience={props.setTargetAudience}
                      batchVariations={props.batchVariations}
                      setBatchVariations={props.setBatchVariations}
                      userPlan={props.userPlan}
                      isPremiumUser={props.isPremiumUser}
                      selectedAiPersonaId={props.selectedAiPersonaId}
                      setSelectedAiPersonaId={props.setSelectedAiPersonaId}
                      allPersonas={props.allPersonas}
                      seoKeywords={props.seoKeywords}
                      setSeoKeywords={props.setSeoKeywords}
                      seoMode={props.seoMode}
                      setSeoMode={props.setSeoMode}
                      seoIntensity={props.seoIntensity}
                      setSeoIntensity={props.setSeoIntensity}
                      abTestType={props.abTestType}
                      setAbTestType={props.setAbTestType}
                      targetLanguage={props.targetLanguage}
                      setTargetLanguage={props.setTargetLanguage}
                      aspectRatioGuidance={props.aspectRatioGuidance}
                      setAspectRatioGuidance={props.setAspectRatioGuidance}
                      selectedImageStyles={props.selectedImageStyles}
                      toggleImageStyle={props.toggleImageStyle}
                      selectedImageMoods={props.selectedImageMoods}
                      toggleImageMood={props.toggleImageMood}
                      negativeImagePrompt={props.negativeImagePrompt}
                      setNegativeImagePrompt={props.setNegativeImagePrompt}
                      includeCTAs={props.includeCTAs}
                      setIncludeCTAs={props.setIncludeCTAs}
                      videoLength={props.videoLength}
                      setVideoLength={props.setVideoLength}
                      customVideoLength={props.customVideoLength}
                      setCustomVideoLength={props.setCustomVideoLength}
                      isLoading={props.isLoading}
                      apiKeyMissing={props.apiKeyMissing}
                      isRecording={props.isRecording}
                      onGenerate={() => {}} // Disabled in config step
                      onOptimizePrompt={props.onOptimizePrompt}
                      onStartRecording={props.onStartRecording}
                      onStopRecording={props.onStopRecording}
                      onShowPersonaModal={props.onShowPersonaModal}
                      onShowCustomPersonaManager={props.onShowCustomPersonaManager}
                      onShowTemplateModal={props.onShowTemplateModal}
                      currentPlaceholder={props.currentPlaceholder}
                      currentContentTypeDetails={props.currentContentTypeDetails}
                      isPremium={props.isPremium}
                      onUpgrade={props.onUpgrade}
                      onApplyPremiumTemplate={props.onApplyPremiumTemplate}
                      onApplyCustomPersona={props.onApplyCustomPersona}
                      onSetSEOConfig={props.onSetSEOConfig}
                      onSetAIBoost={props.onSetAIBoost}
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 3: Create */}
              {currentStep === 'create' && (
                <motion.div
                  key="create"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">Create Your Content</h2>
                    <p className="text-slate-400">Input your ideas and let AI generate amazing content</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Input Area */}
                    <div className="space-y-6">
                      <div>
                        <label className="block text-lg font-semibold text-white mb-4">
                          Describe Your Content
                        </label>
                        <textarea
                          value={props.userInput}
                          onChange={(e) => props.setUserInput(e.target.value)}
                          placeholder={props.currentPlaceholder}
                          className="w-full h-40 p-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white resize-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-lg font-semibold text-white mb-4">
                          Target Audience
                        </label>
                        <input
                          type="text"
                          value={props.targetAudience}
                          onChange={(e) => props.setTargetAudience(e.target.value)}
                          placeholder="e.g., Young entrepreneurs, Tech enthusiasts..."
                          className="w-full p-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all"
                        />
                      </div>

                      <motion.button
                        onClick={() => {
                          props.onGenerate();
                          setCurrentStep('results');
                        }}
                        disabled={props.isLoading || props.apiKeyMissing || (!props.userInput.trim() && !['ImagePrompt', 'TrendAnalysis', 'ContentGapFinder', 'VoiceToScript'].includes(props.contentType))}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-4 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {props.isLoading ? (
                          <span className="flex items-center justify-center">
                            <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                            Generating...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center">
                            <SparklesIcon className="w-5 h-5 mr-2" />
                            Generate Content
                          </span>
                        )}
                      </motion.button>
                    </div>

                    {/* Preview/Tips */}
                    <div className="bg-slate-800/30 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">💡 Tips for Better Results</h3>
                      <ul className="space-y-3 text-slate-300">
                        <li className="flex items-start">
                          <span className="text-emerald-400 mr-2">•</span>
                          Be specific about your content goals and desired tone
                        </li>
                        <li className="flex items-start">
                          <span className="text-emerald-400 mr-2">•</span>
                          Include relevant keywords or topics you want to cover
                        </li>
                        <li className="flex items-start">
                          <span className="text-emerald-400 mr-2">•</span>
                          Mention your target audience's interests and pain points
                        </li>
                        <li className="flex items-start">
                          <span className="text-emerald-400 mr-2">•</span>
                          Try different variations to find the perfect style
                        </li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Results */}
              {currentStep === 'results' && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">Your Generated Content</h2>
                    <p className="text-slate-400">Review, refine, and export your AI-generated content</p>
                  </div>

                  <div className="bg-slate-800/30 rounded-xl p-6 min-h-[400px]">
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
                      onRemoveExpandedIdea={props.onRemoveExpandedIdea}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-700/30">
              <motion.button
                onClick={prevStep}
                disabled={getCurrentStepIndex() === 0}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center px-6 py-3 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeftIcon className="w-5 h-5 mr-2" />
                Previous
              </motion.button>

              <div className="text-sm text-slate-400">
                Step {getCurrentStepIndex() + 1} of {steps.length}
              </div>

              {getCurrentStepIndex() < steps.length - 1 ? (
                <motion.button
                  onClick={nextStep}
                  disabled={!canProceedToNext()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  Continue
                  <ChevronRightIcon className="w-5 h-5 ml-2" />
                </motion.button>
              ) : (
                <motion.button
                  onClick={() => setCurrentStep('type')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Create New
                  <SparklesIcon className="w-5 h-5 ml-2" />
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* History Sidebar */}
      <AnimatePresence>
        {historyOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setHistoryOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 w-96 h-screen bg-gradient-to-b from-slate-800/95 to-slate-900/95 backdrop-blur-xl border-l border-slate-700/50 z-50 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-700/50">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white">Content History</h2>
                  <button
                    onClick={() => setHistoryOpen(false)}
                    className="w-8 h-8 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors"
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
    </div>
  );
};
