import React, { useState, useRef, useEffect } from "react";
import { GeneratorForm } from "./GeneratorForm";
import { GeneratorOutput } from "./GeneratorOutput";
import { GeneratorSidebar } from "./GeneratorSidebar";
import { UsageWarning } from "./UsageWarning";
import { PremiumStatusIndicator } from "./PremiumStatusIndicator";
import { PremiumContentTypesShowcase } from "./PremiumContentTypesShowcase";
import "../styles/premiumButton.css";
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

export const GeneratorLayout: React.FC<GeneratorLayoutProps> = (props) => {
  // Ensure safe defaults for anonymous users
  const userPlan = props.userPlan || "free";
  const isPremiumUser = props.isPremiumUser || false;
  const [historyOpen, setHistoryOpen] = useState(false);
  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  const [showPremiumShowcase, setShowPremiumShowcase] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        color: "#e2e8f0",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        position: "relative",
        maxWidth: "none",
      }}
    >
      {/* Main Content Area */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1.5rem 2rem",
            borderBottom: "1px solid #1e293b",
            backgroundColor: "rgba(15, 23, 42, 0.9)",
            position: "static",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                width: "2.5rem",
                height: "2.5rem",
                background:
                  "linear-gradient(135deg, #10b981, #0ea5e9, #a855f7)",
                borderRadius: "0.75rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SparklesIcon
                style={{ width: "1.25rem", height: "1.25rem", color: "white" }}
              />
            </div>
            <div>
              <h1
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  margin: 0,
                  color: "var(--theme-text-primary)",
                }}
              >
                Content Generator
              </h1>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "var(--theme-text-tertiary)",
                  margin: 0,
                }}
              >
                Create engaging content with AI
              </p>
            </div>
          </div>

          {/* Premium Content Types Button */}
          <button
            onClick={() => setShowPremiumShowcase(!showPremiumShowcase)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.75rem 1.25rem",
              background: showPremiumShowcase
                ? "linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #ea580c 100%)"
                : "linear-gradient(135deg, rgba(245, 158, 11, 0.9) 0%, rgba(249, 115, 22, 0.8) 50%, rgba(234, 88, 12, 0.7) 100%)",
              border: showPremiumShowcase
                ? "2px solid #f59e0b"
                : "1px solid rgba(245, 158, 11, 0.3)",
              borderRadius: "1rem",
              color: "white",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: "600",
              letterSpacing: "0.025em",
              transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              boxShadow: showPremiumShowcase
                ? "0 20px 40px rgba(245, 158, 11, 0.4), 0 8px 16px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
                : "0 8px 24px rgba(245, 158, 11, 0.25), 0 4px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
              position: "relative",
              overflow: "hidden",
              backdropFilter: "blur(12px)",
              transform: showPremiumShowcase ? "scale(1.02)" : "scale(1)",
              marginRight: "1rem",
            }}
            onMouseEnter={(e) => {
              if (!showPremiumShowcase) {
                e.currentTarget.style.background =
                  "linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #ea580c 100%)";
                e.currentTarget.style.borderColor = "#f59e0b";
                e.currentTarget.style.transform =
                  "translateY(-3px) scale(1.05)";
                e.currentTarget.style.boxShadow =
                  "0 16px 32px rgba(245, 158, 11, 0.35), 0 8px 16px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.15)";
              } else {
                e.currentTarget.style.transform =
                  "translateY(-2px) scale(1.05)";
                e.currentTarget.style.boxShadow =
                  "0 28px 56px rgba(245, 158, 11, 0.5), 0 12px 24px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)";
              }
            }}
            onMouseLeave={(e) => {
              if (!showPremiumShowcase) {
                e.currentTarget.style.background =
                  "linear-gradient(135deg, rgba(245, 158, 11, 0.9) 0%, rgba(249, 115, 22, 0.8) 50%, rgba(234, 88, 12, 0.7) 100%)";
                e.currentTarget.style.borderColor = "rgba(245, 158, 11, 0.3)";
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 8px 24px rgba(245, 158, 11, 0.25), 0 4px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)";
              } else {
                e.currentTarget.style.transform = "translateY(0) scale(1.02)";
                e.currentTarget.style.boxShadow =
                  "0 20px 40px rgba(245, 158, 11, 0.4), 0 8px 16px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)";
              }
            }}
          >
            {/* Shine effect overlay */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "-100%",
                width: "100%",
                height: "100%",
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                animation: showPremiumShowcase ? "none" : "shine 2s infinite",
                pointerEvents: "none",
              }}
            />

            {/* Icon with glow effect */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "1.5rem",
                height: "1.5rem",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(4px)",
                position: "relative",
              }}
            >
              <span
                style={{
                  fontSize: "0.875rem",
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
                }}
              >
                ⭐
              </span>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <span
                style={{
                  fontSize: "0.875rem",
                  fontWeight: "700",
                  textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                  letterSpacing: "0.025em",
                }}
              >
                Premium Types
              </span>
              {!isPremiumUser && (
                <span
                  style={{
                    fontSize: "0.625rem",
                    opacity: "0.9",
                    fontWeight: "500",
                    textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                  }}
                >
                  8 Advanced Content Types
                </span>
              )}
            </div>

            {!isPremiumUser && (
              <div
                style={{
                  background: "rgba(255,255,255,0.2)",
                  padding: "0.25rem 0.5rem",
                  borderRadius: "0.375rem",
                  fontSize: "0.625rem",
                  fontWeight: "700",
                  border: "1px solid rgba(255,255,255,0.3)",
                  backdropFilter: "blur(4px)",
                  textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                }}
              >
                PRO
              </div>
            )}

            {/* Arrow indicator */}
            <div
              style={{
                fontSize: "0.75rem",
                transition: "transform 0.3s ease",
                transform: showPremiumShowcase
                  ? "rotate(180deg)"
                  : "rotate(0deg)",
                opacity: "0.8",
              }}
            >
              ▼
            </div>
          </button>

          {/* History Toggle Button */}
          <button
            onClick={() => setHistoryOpen(!historyOpen)}
            style={{
              gap: "0.625rem",
              padding: "1rem 1.5rem",
              background: historyOpen
                ? "linear-gradient(135deg, #3b82f6 0%, #1e40af 50%, #1d4ed8 100%)"
                : "linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.9) 50%, rgba(30, 41, 59, 0.85) 100%)",
              border: historyOpen
                ? "2px solid #3b82f6"
                : "1px solid rgba(51, 65, 85, 0.8)",
              borderRadius: "1rem",
              color: historyOpen ? "white" : "#e2e8f0",
              cursor: "pointer",
              fontSize: "0.95rem",
              fontWeight: "600",
              letterSpacing: "0.025em",
              transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              boxShadow: historyOpen
                ? "0 20px 40px rgba(59, 130, 246, 0.4), 0 8px 16px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
                : "0 8px 24px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
              position: "relative",
              overflow: "hidden",
              backdropFilter: "blur(12px)",
              transform: historyOpen ? "scale(1.02)" : "scale(1)",
            }}
            onMouseEnter={(e) => {
              if (!e.currentTarget) return;
              if (!historyOpen) {
                e.currentTarget.style.background =
                  "linear-gradient(135deg, rgba(52, 73, 94, 0.95) 0%, rgba(30, 41, 59, 0.9) 50%, rgba(59, 130, 246, 0.15) 100%)";
                e.currentTarget.style.borderColor = "#64748b";
                e.currentTarget.style.color = "#f8fafc";
                e.currentTarget.style.transform =
                  "translateY(-3px) scale(1.05)";
                e.currentTarget.style.boxShadow =
                  "0 16px 32px rgba(0, 0, 0, 0.2), 0 8px 16px rgba(59, 130, 246, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.12)";
              } else {
                e.currentTarget.style.transform =
                  "translateY(-2px) scale(1.05)";
                e.currentTarget.style.boxShadow =
                  "0 28px 56px rgba(59, 130, 246, 0.5), 0 12px 24px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)";
                e.currentTarget.style.background =
                  "linear-gradient(135deg, #2563eb 0%, #1e40af 50%, #1d4ed8 100%)";
              }
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget) return;
              if (!historyOpen) {
                e.currentTarget.style.background =
                  "linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.9) 50%, rgba(30, 41, 59, 0.85) 100%)";
                e.currentTarget.style.borderColor = "rgba(51, 65, 85, 0.8)";
                e.currentTarget.style.color = "#e2e8f0";
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 8px 24px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.08)";
              } else {
                e.currentTarget.style.transform = "translateY(0) scale(1.02)";
                e.currentTarget.style.boxShadow =
                  "0 20px 40px rgba(59, 130, 246, 0.4), 0 8px 16px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)";
                e.currentTarget.style.background =
                  "linear-gradient(135deg, #3b82f6 0%, #1e40af 50%, #1d4ed8 100%)";
              }
            }}
            onMouseDown={(e) => {
              if (!e.currentTarget) return;
              e.currentTarget.style.transform = "translateY(1px) scale(0.98)";
              e.currentTarget.style.transition = "all 0.1s ease";
            }}
            onMouseUp={(e) => {
              if (!e.currentTarget) return;
              e.currentTarget.style.transition =
                "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
              setTimeout(() => {
                if (!e.currentTarget) return;
                if (historyOpen) {
                  e.currentTarget.style.transform =
                    "translateY(-2px) scale(1.05)";
                } else {
                  e.currentTarget.style.transform =
                    "translateY(-3px) scale(1.05)";
                }
              }, 50);
            }}
          >
            History
          </button>
        </div>

        {/* Content Grid */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
            padding: "2rem",
            flex: 1,
            overflow: "auto",
            minHeight: "calc(100vh - 120px)",
            width: "100vw",
            maxWidth: "none",
          }}
        >
          {/* Usage Warning */}
          {props.onUpgrade && <UsageWarning onUpgrade={props.onUpgrade} />}

          {/* Premium Status Indicator */}
          <PremiumStatusIndicator
            isPremium={props.isPremium}
            selectedTemplate={props.selectedPremiumTemplate}
            selectedPersona={props.selectedCustomPersona}
            seoConfig={props.premiumSEOConfig}
            aiBoostEnabled={props.aiBoostEnabled}
          />

          {/* Form and Output Layout */}
          {showPremiumShowcase ? (
            /* When premium showcase is open: Premium sidebar + Form on top, Output below */
            <>
              {/* Top Section: Premium Showcase + Form Side by Side */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "550px 1fr",
                  gap: "2rem",
                  marginBottom: "2rem",
                }}
              >
                {/* Premium Content Types Showcase */}
                <div>
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

                {/* Form Section */}
                <div
                  style={{
                    background: "var(--theme-bg-secondary)",
                    borderRadius: "1rem",
                    padding: "1.5rem",
                    border: `1px solid var(--theme-border-primary)`,
                    height: "fit-content",
                  }}
                >
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
                    userPlan={userPlan}
                    isPremiumUser={isPremiumUser}
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
                    onShowCustomPersonaManager={
                      props.onShowCustomPersonaManager
                    }
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
              </div>

              {/* Full Width Output Section Below */}
              <div
                style={{
                  background: "var(--theme-bg-secondary)",
                  borderRadius: "1rem",
                  padding: "1.5rem",
                  border: `1px solid var(--theme-border-primary)`,
                  minHeight: "600px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
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
            </>
          ) : (
            /* Normal grid layout when premium showcase is closed */
            <div
              style={{
                display: "grid",
                gridTemplateColumns: sidebarMinimized
                  ? "300px 1fr"
                  : "1fr 1.5fr",
                gap: "2rem",
                alignItems: "stretch",
                minHeight: "600px",
              }}
            >
              {/* Form Section */}
              <div
                style={{
                  background: "var(--theme-bg-secondary)",
                  borderRadius: "1rem",
                  padding: "1.5rem",
                  border: `1px solid var(--theme-border-primary)`,
                  height: "fit-content",
                }}
              >
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

              {/* Output Section */}
              <div
                style={{
                  background: "var(--theme-bg-secondary)",
                  borderRadius: "1rem",
                  padding: "1.5rem",
                  border: `1px solid var(--theme-border-primary)`,
                  height: "100%",
                  minHeight: "600px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
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
          )}
        </div>
      </div>

      {/* History Sidebar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "400px",
          height: "100vh",
          background: "var(--theme-bg-primary)",
          borderLeft: `1px solid var(--theme-border-primary)`,
          transform: `translateX(${historyOpen && !sidebarMinimized ? "0" : "100%"})`,
          transition: "transform 0.3s ease",
          zIndex: 50,
          overflow: "hidden",
        }}
      >
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

      {/* Overlay */}
      {historyOpen && !sidebarMinimized && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.3)",
            zIndex: 40,
          }}
          onClick={() => setHistoryOpen(false)}
        />
      )}
    </div>
  );
};
