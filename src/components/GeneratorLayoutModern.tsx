import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GeneratorIcon,
  DocumentIcon,
  HistoryIcon,
  AnalyticsIcon,
} from './ProfessionalIcons';
import { GeneratorForm } from "./GeneratorForm";
import { GeneratorOutput } from "./GeneratorOutput";
import { GeneratorSidebar } from "./GeneratorSidebar";
import { UsageWarning } from "./UsageWarning";
import { PremiumStatusIndicator } from "./PremiumStatusIndicator";
import { PremiumContentTypesShowcase } from "./PremiumContentTypesShowcase";
import "../styles/premiumButton.css";
import "../styles/generatorModern.css";
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
  SparklesIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  MenuIcon,
} from "./IconComponents";

interface GeneratorLayoutProps {
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

export const GeneratorLayoutModern: React.FC<GeneratorLayoutProps> = (props) => {
  // Ensure safe defaults for anonymous users
  const userPlan = props.userPlan || "free";
  const isPremiumUser = props.isPremiumUser || false;
  const [historyOpen, setHistoryOpen] = useState(false);
  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  const [showPremiumShowcase, setShowPremiumShowcase] = useState(false);
  const [activeView, setActiveView] = useState<'create' | 'templates' | 'history' | 'insights'>('create');

  return (
    <div className="generator-modern min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 min-h-screen">
        {/* Hero Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-slate-800/60 via-slate-900/60 to-slate-800/60 backdrop-blur-xl border-b border-slate-700/50"
        >
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Icon */}
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-sky-400 via-purple-500 to-emerald-400 rounded-2xl flex items-center justify-center shadow-lg">
                    <SparklesIcon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-black">✨</span>
                  </div>
                </div>
                
                {/* Title */}
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-300 via-purple-300 to-emerald-300 bg-clip-text text-transparent">
                    AI Content Studio
                  </h1>
                  <p className="text-xl text-slate-300 mt-1">
                    Transform ideas into viral content with intelligent AI assistance
                  </p>
                </div>
              </div>

              {/* Premium Features Toggle */}
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowPremiumShowcase(!showPremiumShowcase)}
                  className="flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <span className="text-lg">⭐</span>
                  <span>Premium Types</span>
                  <ChevronRightIcon className={`w-5 h-5 transition-transform ${showPremiumShowcase ? 'rotate-90' : ''}`} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setHistoryOpen(!historyOpen)}
                  className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 ${
                    historyOpen 
                      ? 'bg-gradient-to-r from-sky-500 to-blue-500 text-white' 
                      : 'bg-slate-700/60 hover:bg-slate-600/60 text-slate-200 border border-slate-600'
                  }`}
                >
                  <span className="text-lg">📚</span>
                  <span>History</span>
                </motion.button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="mt-8 flex space-x-2">
              {[
                { id: 'create', label: 'Create Content', icon: GeneratorIcon, desc: 'Generate new content' },
                { id: 'templates', label: 'Templates', icon: DocumentIcon, desc: 'Pre-built templates' },
                { id: 'history', label: 'My Content', icon: HistoryIcon, desc: 'Previous generations' },
                { id: 'insights', label: 'Analytics', icon: AnalyticsIcon, desc: 'Content insights' },
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveView(tab.id as any)}
                  className={`group relative px-6 py-4 rounded-xl transition-all duration-300 ${
                    activeView === tab.id
                      ? 'bg-gradient-to-r from-sky-500/20 to-purple-500/20 border border-sky-500/50 text-sky-300'
                      : 'bg-slate-800/40 hover:bg-slate-700/40 border border-slate-700/50 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-lg">
                      {React.createElement(tab.icon, { className: 'w-5 h-5' })}
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">{tab.label}</div>
                      <div className="text-xs opacity-75">{tab.desc}</div>
                    </div>
                  </div>
                  {activeView === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-sky-500/10 to-purple-500/10 rounded-xl border border-sky-500/30"
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Usage Warning */}
          {props.onUpgrade && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <UsageWarning onUpgrade={props.onUpgrade} />
            </motion.div>
          )}

          {/* Premium Status Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <PremiumStatusIndicator
              isPremium={props.isPremium}
              selectedTemplate={props.selectedPremiumTemplate}
              selectedPersona={props.selectedCustomPersona}
              seoConfig={props.premiumSEOConfig}
              aiBoostEnabled={props.aiBoostEnabled}
            />
          </motion.div>

          <AnimatePresence mode="wait">
            {activeView === 'create' && (
              <motion.div
                key="create"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Premium Showcase */}
                {showPremiumShowcase && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6"
                  >
                    <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 shadow-2xl">
                      <PremiumContentTypesShowcase
                        userPlan={userPlan}
                        isPremiumUser={isPremiumUser}
                        onSelectContentType={(contentType) => {
                          props.setContentType(contentType);
                        }}
                        onClose={() => setShowPremiumShowcase(false)}
                        onUpgrade={props.onUpgrade}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Panel - Form */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 shadow-2xl">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-purple-500 rounded-xl flex items-center justify-center">
                          <span className="text-white font-bold">⚡</span>
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-white">Content Creation</h2>
                          <p className="text-sm text-slate-400">Configure and generate your content</p>
                        </div>
                      </div>

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
                        onGenerate={props.onGenerate}
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

                  {/* Right Panel - Output */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 shadow-2xl min-h-[600px] flex flex-col">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
                          <span className="text-white font-bold">🎯</span>
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-white">Generated Content</h2>
                          <p className="text-sm text-slate-400">Your AI-powered results</p>
                        </div>
                      </div>

                      <div className="flex-1">
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
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Other views can be implemented similarly */}
            {activeView === 'templates' && (
              <motion.div
                key="templates"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-20"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">📋</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">Content Templates</h2>
                <p className="text-slate-400">Professional templates coming soon...</p>
              </motion.div>
            )}

            {activeView === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-20"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">📖</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">Content History</h2>
                <p className="text-slate-400">Your generated content history will appear here...</p>
              </motion.div>
            )}

            {activeView === 'insights' && (
              <motion.div
                key="insights"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-20"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">📊</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">Content Analytics</h2>
                <p className="text-slate-400">Content performance insights coming soon...</p>
              </motion.div>
            )}
          </AnimatePresence>
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
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold text-white">📚</span>
                    </div>
                    <h2 className="text-lg font-bold text-white">Content History</h2>
                  </div>
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
