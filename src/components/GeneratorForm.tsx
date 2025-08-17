import React, { useState } from "react";
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
} from "../../types";
import {
  PLATFORMS,
  USER_SELECTABLE_CONTENT_TYPES,
  AB_TESTABLE_CONTENT_TYPES_MAP,
  SUPPORTED_LANGUAGES,
  ASPECT_RATIO_GUIDANCE_OPTIONS,
  IMAGE_PROMPT_STYLES,
  IMAGE_PROMPT_MOODS,
  BATCH_SUPPORTED_TYPES,
  TRANSLATE_ADAPT_SUPPORTED_TYPES,
  VIDEO_LENGTH_OPTIONS,
  PREMIUM_CONTENT_TYPES,
  isPremiumContentType,
} from "../../constants";
import {
  SparklesIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MicrophoneIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  SaveIcon,
} from "./IconComponents";
import { PremiumGeneratorEnhancement } from "./PremiumGeneratorEnhancement";
import { SubscriptionUpgradeHint } from "./SubscriptionUpgradeHint";
import { useSubscription } from "../context/SubscriptionContext";
import { useCredits } from "../context/CreditContext";
import { useAuth } from "../context/AuthContext";
import CreditDisplay from "./CreditDisplay";
import SmartInput from "./SmartInput";
import ContentInsightsPanel from "./ContentInsightsPanel";
import AppNotifications from "../utils/appNotifications";

interface GeneratorFormProps {
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

  // Premium features
  userPlan?: "free" | "pro" | "enterprise";
  isPremiumUser?: boolean;
  selectedAiPersonaId: string;
  setSelectedAiPersonaId: (id: string) => void;
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
  isLoading: boolean;
  apiKeyMissing: boolean;
  isRecording: boolean;
  onGenerate: () => void;
  onOptimizePrompt: () => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onShowPersonaModal: () => void;
  onShowCustomPersonaManager: () => void;
  onShowTemplateModal: () => void;
  currentPlaceholder: string;
  currentContentTypeDetails: any;
  isPremium?: boolean;
  onUpgrade?: () => void;
  onApplyPremiumTemplate?: (template: any) => void;
  onApplyCustomPersona?: (persona: any) => void;
  onSetSEOConfig?: (config: any) => void;
  onSetAIBoost?: (enabled: boolean) => void;
}

const inputStyle = {
  width: "100%",
  padding: "0.75rem",
  background: "#0f172a",
  border: "1px solid #334155",
  borderRadius: "0.5rem",
  color: "#e2e8f0",
  fontSize: "0.875rem",
  fontFamily: "inherit",
};

const buttonStyle = {
  background: "#3b82f6",
  color: "white",
  border: "none",
  borderRadius: "0.5rem",
  padding: "0.75rem 1rem",
  fontSize: "0.875rem",
  cursor: "pointer",
  fontFamily: "inherit",
};

export const GeneratorForm: React.FC<GeneratorFormProps> = (props) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showBatchGenerator, setShowBatchGenerator] = useState(false);
  const [smartSuggestionsEnabled, setSmartSuggestionsEnabled] = useState(true);
  const [showContentInsights, setShowContentInsights] = useState(false);
  const { billingInfo, canUseFeature } = useSubscription();
  const { canAfford, hasCredits } = useCredits();
  const { user } = useAuth();

  // Calculate total credits needed with volume discount pricing
  const calculateCreditsNeeded = (): number => {
    // Thumbnail-specific pricing
    if (props.contentType === ContentType.ThumbnailConcept) {
      if (props.batchVariations <= 2) return 1;
      if (props.batchVariations <= 4) return 2;
      if (props.batchVariations <= 8) return 3;
      if (props.batchVariations <= 12) return 4;
      if (props.batchVariations <= 16) return 5;
      if (props.batchVariations <= 20) return 6;
      return Math.ceil(props.batchVariations / 4); // Fallback for larger amounts
    }

    // Video Hook-specific pricing
    if (props.contentType === ContentType.VideoHook) {
      if (props.batchVariations <= 4) return 1;
      if (props.batchVariations <= 8) return 2;
      if (props.batchVariations <= 12) return 3;
      if (props.batchVariations <= 20) return 4;
      return Math.ceil(props.batchVariations / 5); // Fallback for larger amounts
    }

    // Universal batch pricing for ALL other content types (volume discounts)
    if (props.batchVariations <= 2) return 1;
    if (props.batchVariations <= 4) return 2;
    if (props.batchVariations <= 8) return 3;
    if (props.batchVariations <= 12) return 4;
    return Math.ceil(props.batchVariations / 3); // Fallback for larger amounts
  };

  const creditsNeeded = calculateCreditsNeeded();

  // Development override check
  const devPremiumOverride =
    import.meta.env.DEV &&
    (localStorage.getItem("dev_force_premium") === "true" ||
      localStorage.getItem("emergency_premium") === "true");

  // Enhanced premium access detection
  const hasPremiumAccess =
    devPremiumOverride ||
    billingInfo?.status === "active" ||
    (billingInfo?.subscription?.planId &&
      billingInfo.subscription.planId !== "free");

  const canUseBatchGeneration =
    devPremiumOverride ||
    canUseFeature("batchGeneration") ||
    (hasPremiumAccess && canUseFeature("premium"));

  const subscriptionPlan = billingInfo?.subscription?.planId || "free";

  // Debug logging for premium feature access
  if (import.meta.env.DEV) {
    console.log("🔧 GeneratorForm Premium Debug:", {
      devPremiumOverride,
      billingStatus: billingInfo?.status,
      subscriptionPlan,
      hasPremiumAccess,
      canUseBatchGeneration,
      billingInfo: billingInfo,
    });
  }

  // Debug: Log user state for anonymous vs authenticated users
  if (import.meta.env.DEV) {
    console.log("👤 GeneratorForm User State:", {
      hasUser: !!user,
      userEmail: user?.email || "anonymous",
      shouldShowPremium: !!user,
      shouldShowBatchHint:
        !!user && !canUseBatchGeneration && !hasPremiumAccess,
    });
  }

  const isBatchSupported = BATCH_SUPPORTED_TYPES.includes(props.contentType);

  // Debug logging for content ideas selector
  if (import.meta.env.DEV) {
    console.log("🎯 Content Ideas Selector Debug:", {
      contentType: props.contentType,
      isIdeaType: props.contentType === ContentType.Idea,
      batchVariations: props.batchVariations,
    });
  }
  const isImageContent =
    props.contentType === ContentType.Image ||
    props.contentType === ContentType.ImagePrompt;
  const isVoiceContent = props.contentType === ContentType.VoiceToScript;
  const isABTestContent = props.contentType === ContentType.ABTest;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Configuration */}
      <div>
        <h3
          style={{
            fontSize: "1rem",
            fontWeight: "600",
            color: "#f1f5f9",
            margin: "0 0 1rem 0",
            paddingBottom: "0.5rem",
            borderBottom: "1px solid #334155",
          }}
        >
          Configuration
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#cbd5e1",
                marginBottom: "0.5rem",
              }}
            >
              Platform
            </label>
            <select
              value={props.platform}
              onChange={(e) => props.setPlatform(e.target.value as Platform)}
              style={inputStyle}
              data-tour="platform-selector"
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
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#cbd5e1",
                marginBottom: "0.5rem",
              }}
            >
              Content Type
            </label>
            <select
              value={props.contentType}
              data-tour="content-type"
              onChange={(e) => {
                const newContentType = e.target.value as ContentType;

                // Check if it's a premium content type and user is not premium
                if (
                  isPremiumContentType(newContentType) &&
                  !props.isPremiumUser
                ) {
                  AppNotifications.custom(
                    "Premium Content Type",
                    `${USER_SELECTABLE_CONTENT_TYPES.find((ct) => ct.value === newContentType)?.label} is available in Creator Pro and Enterprise plans. Upgrade to access advanced content generation.`,
                    "warning",
                    {
                      icon: "⭐",
                      duration: 8000,
                      actionText: "Upgrade Now",
                      onAction: () => (window.location.href = "/pricing"),
                    },
                  );
                  return; // Don't change the content type
                }

                props.setContentType(newContentType);
              }}
              style={inputStyle}
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
                      fontStyle:
                        isPremium && !props.isPremiumUser ? "italic" : "normal",
                    }}
                  >
                    {ct.label}
                    {isPremium && !props.isPremiumUser ? " 🔒 Pro" : ""}
                  </option>
                );
              })}
            </select>
            {props.currentContentTypeDetails?.description && (
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "#64748b",
                  marginTop: "0.25rem",
                }}
              >
                {props.currentContentTypeDetails.description}
              </p>
            )}

            {/* Premium Content Type Notice */}
            {isPremiumContentType(props.contentType) &&
              !props.isPremiumUser && (
                <div
                  style={{
                    marginTop: "0.75rem",
                    padding: "0.75rem",
                    background:
                      "linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(249, 115, 22, 0.2))",
                    border: "1px solid rgba(245, 158, 11, 0.3)",
                    borderRadius: "0.5rem",
                    fontSize: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <span style={{ fontSize: "1rem" }}>���</span>
                    <div>
                      <div
                        style={{
                          color: "#fbbf24",
                          fontWeight: "600",
                          marginBottom: "0.25rem",
                        }}
                      >
                        Premium Content Type
                      </div>
                      <div
                        style={{
                          color: "rgba(251, 191, 36, 0.8)",
                          lineHeight: "1.4",
                        }}
                      >
                        This advanced content type is available in Creator Pro
                        and Enterprise plans.
                        <button
                          onClick={() => (window.location.href = "/pricing")}
                          style={{
                            color: "#fbbf24",
                            textDecoration: "underline",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: "0",
                            marginLeft: "0.25rem",
                          }}
                        >
                          Upgrade to unlock
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>

        {/* Video Length Selection - Only show for Script content type */}
        {props.contentType === ContentType.Script && (
          <div style={{ marginTop: "1rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#cbd5e1",
                marginBottom: "0.5rem",
              }}
            >
              Desired Video Length
            </label>
            <select
              value={props.videoLength}
              onChange={(e) => props.setVideoLength(e.target.value)}
              style={inputStyle}
            >
              {VIDEO_LENGTH_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Custom length input when "custom" is selected */}
            {props.videoLength === "custom" && (
              <input
                type="text"
                placeholder="e.g., 2.5 minutes, 45 seconds, 8 minutes"
                value={props.customVideoLength}
                onChange={(e) => props.setCustomVideoLength(e.target.value)}
                style={{
                  ...inputStyle,
                  marginTop: "0.5rem",
                }}
              />
            )}

            <p
              style={{
                fontSize: "0.75rem",
                color: "#64748b",
                marginTop: "0.25rem",
              }}
            >
              The AI will generate a script that matches approximately this
              duration
            </p>
          </div>
        )}
      </div>

      {/* Content Input */}
      <div>
        <h3
          style={{
            fontSize: "1rem",
            fontWeight: "600",
            color: "#f1f5f9",
            margin: "0 0 1rem 0",
            paddingBottom: "0.5rem",
            borderBottom: "1px solid #334155",
          }}
        >
          Content Input
        </h3>

        <div>
          <label
            style={{
              display: "block",
              fontSize: "0.875rem",
              fontWeight: "500",
              color: "#cbd5e1",
              marginBottom: "0.5rem",
            }}
          >
            {isABTestContent
              ? `Topic for A/B Testing ${AB_TESTABLE_CONTENT_TYPES_MAP.find((ab) => ab.value === props.abTestType)?.label || props.abTestType}`
              : isImageContent
                ? "Image Description"
                : isVoiceContent
                  ? "Voice Input / Transcript"
                  : "Topic / Keywords / Details"}
          </label>

          <div>
            <SmartInput
              value={props.userInput}
              onChange={props.setUserInput}
              placeholder={props.currentPlaceholder}
              platform={props.platform}
              contentType={props.contentType}
              targetAudience={props.targetAudience}
              smartSuggestionsEnabled={smartSuggestionsEnabled}
              hasPremiumAccess={hasPremiumAccess}
              rows={4}
              style={{
                ...inputStyle,
                minHeight: "100px",
                resize: "vertical",
              }}
            />

            {/* Optimize Button - Now below the input */}
            <button
              onClick={props.onOptimizePrompt}
              style={{
                marginTop: "0.75rem",
                background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                color: "white",
                border: "none",
                borderRadius: "0.5rem",
                padding: "0.75rem 1rem",
                fontSize: "0.875rem",
                fontWeight: "500",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                width: "100%",
                boxShadow:
                  "0 4px 12px rgba(59, 130, 246, 0.3), 0 2px 4px rgba(0, 0, 0, 0.1)",
                transition: "all 0.2s ease",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 20px rgba(59, 130, 246, 0.4), 0 4px 8px rgba(0, 0, 0, 0.15)";
                e.currentTarget.style.background =
                  "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(59, 130, 246, 0.3), 0 2px 4px rgba(0, 0, 0, 0.1)";
                e.currentTarget.style.background =
                  "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)";
              }}
            >
              <ChatBubbleLeftRightIcon
                style={{ width: "1rem", height: "1rem" }}
              />
              Optimize Prompt
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: "-100%",
                  width: "100%",
                  height: "100%",
                  background:
                    "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
                  transition: "left 0.5s ease",
                }}
                className="shine-effect"
              />
            </button>
          </div>

          {/* Voice Recording */}
          {/* Voice Recording - Only for Voice-to-Script content type */}
          {isVoiceContent && (
            <>
              <button
                onClick={
                  props.isRecording
                    ? props.onStopRecording
                    : props.onStartRecording
                }
                disabled={props.apiKeyMissing}
                style={{
                  ...buttonStyle,
                  background: props.isRecording ? "#dc2626" : "#059669",
                  width: "100%",
                  marginTop: "1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
                title={
                  props.isRecording
                    ? "Stop voice recording and transcribe to text"
                    : "Start voice recording to speak your content idea"
                }
              >
                <MicrophoneIcon style={{ width: "1rem", height: "1rem" }} />
                {props.isRecording ? "Stop Recording" : "Start Recording"}
              </button>
              {props.isRecording && (
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "#38bdf8",
                    marginTop: "0.5rem",
                    textAlign: "center",
                    animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                  }}
                >
                  🎤 Recording... Speak your content idea
                </p>
              )}
            </>
          )}

          {/* A/B Test Type */}
          {isABTestContent && (
            <div style={{ marginTop: "1rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#cbd5e1",
                  marginBottom: "0.5rem",
                }}
              >
                A/B Test Type
              </label>
              <select
                value={props.abTestType}
                onChange={(e) =>
                  props.setAbTestType(e.target.value as ABTestableContentType)
                }
                style={inputStyle}
              >
                <option key="ab-empty" value="">
                  Select type...
                </option>
                {AB_TESTABLE_CONTENT_TYPES_MAP.map((ab) => (
                  <option key={ab.value} value={ab.value}>
                    {ab.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Advanced Options */}
      <div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          style={{
            background: "transparent",
            color: "#94a3b8",
            border: "1px solid #334155",
            borderRadius: "0.5rem",
            padding: "0.75rem 1rem",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
            fontSize: "0.875rem",
            fontFamily: "inherit",
          }}
        >
          <span>Advanced Options</span>
          {showAdvanced ? (
            <ChevronUpIcon style={{ width: "1rem", height: "1rem" }} />
          ) : (
            <ChevronDownIcon style={{ width: "1rem", height: "1rem" }} />
          )}
        </button>

        {showAdvanced && (
          <div
            style={{
              marginTop: "1rem",
              padding: "1rem",
              border: "1px solid #334155",
              borderRadius: "0.5rem",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                marginBottom: "1rem",
              }}
            >
              {/* AI Persona */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#cbd5e1",
                    marginBottom: "0.5rem",
                  }}
                >
                  AI Persona
                </label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <select
                    value={props.selectedAiPersonaId}
                    onChange={(e) =>
                      props.setSelectedAiPersonaId(e.target.value)
                    }
                    style={{ ...inputStyle, flex: 1 }}
                  >
                    {props.allPersonas.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} {p.isCustom ? "(Custom)" : ""}
                      </option>
                    ))}
                  </select>
                  {/* Combined AI Persona Management Button */}
                  {props.userPlan === "pro" ||
                  props.userPlan === "enterprise" ||
                  props.isPremiumUser ? (
                    <button
                      onClick={props.onShowCustomPersonaManager}
                      style={{
                        ...buttonStyle,
                        background: "#4f46e5",
                        padding: "0.75rem",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                      title="Manage Custom AI Personas"
                    >
                      🎭 Manage
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        alert(
                          "🔒 Custom AI Personas are available in Pro and Enterprise plans. Create unlimited custom personas that match your brand voice perfectly.\n\nUpgrade to unlock this feature!",
                        );
                        // Optional: Add redirect to pricing
                        // window.location.href = "/pricing";
                      }}
                      style={{
                        ...buttonStyle,
                        background: "#6b7280",
                        padding: "0.75rem",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        opacity: 0.7,
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                      title="Custom AI Personas (Pro Feature)"
                    >
                      🎭 Pro
                    </button>
                  )}
                </div>
              </div>

              {/* Target Audience */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#cbd5e1",
                    marginBottom: "0.5rem",
                  }}
                >
                  Target Audience
                </label>
                <input
                  type="text"
                  value={props.targetAudience}
                  onChange={(e) => props.setTargetAudience(e.target.value)}
                  placeholder="e.g., Gen Z gamers, busy professionals"
                  style={inputStyle}
                />
              </div>

              {/* Content Ideas Variant Selector with Credit Costs */}
              {props.contentType === ContentType.Idea && (
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "#cbd5e1",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Number of Content Ideas
                  </label>
                  <select
                    value={props.batchVariations}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (props.isPremiumUser || value <= 2) {
                        props.setBatchVariations(value);
                      } else {
                        AppNotifications.custom(
                          "Premium Feature Required",
                          "Generate more than 2 ideas with Pro or Enterprise plans for enhanced creativity and options.",
                          "warning",
                          {
                            icon: "💡",
                            duration: 6000,
                            actionText: "Upgrade",
                            onAction: () => (window.location.href = "/pricing"),
                          },
                        );
                      }
                    }}
                    style={{
                      ...inputStyle,
                      opacity: props.isPremiumUser ? 1 : 0.8,
                    }}
                  >
                    <option key="ideas-2" value={2}>
                      2 ideas (1 credit)
                    </option>
                    {props.isPremiumUser ? (
                      <>
                        <option key="ideas-4" value={4}>
                          4 ideas (2 credits)
                        </option>
                        <option key="ideas-8" value={8}>
                          8 ideas (3 credits)
                        </option>
                        <option key="ideas-12" value={12}>
                          12 ideas (4 credits)
                        </option>
                      </>
                    ) : (
                      <option disabled key="ideas-premium">
                        🔒 4-12 ideas (Premium)
                      </option>
                    )}
                  </select>
                </div>
              )}

              {/* Thumbnail Ideas Batch Selector with Custom Credit Costs */}
              {props.contentType === ContentType.ThumbnailConcept && (
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "#cbd5e1",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Number of Thumbnail Ideas
                  </label>
                  <select
                    value={props.batchVariations}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      props.setBatchVariations(value);
                    }}
                    style={inputStyle}
                  >
                    <option key="thumbnails-2" value={2}>
                      2 ideas (1 credit)
                    </option>
                    <option key="thumbnails-4" value={4}>
                      4 ideas (2 credits)
                    </option>
                    <option key="thumbnails-8" value={8}>
                      8 ideas (3 credits)
                    </option>
                    <option key="thumbnails-12" value={12}>
                      12 ideas (4 credits)
                    </option>
                    <option key="thumbnails-16" value={16}>
                      16 ideas (5 credits)
                    </option>
                    <option key="thumbnails-20" value={20}>
                      20 ideas (6 credits)
                    </option>
                  </select>
                </div>
              )}

              {/* Video Hook Ideas Batch Selector with Custom Credit Costs */}
              {props.contentType === ContentType.VideoHook && (
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "#cbd5e1",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Number of Video Hook Variations
                  </label>
                  <select
                    value={props.batchVariations}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      props.setBatchVariations(value);
                    }}
                    style={inputStyle}
                  >
                    <option key="hooks-4" value={4}>
                      4 hooks (1 credit)
                    </option>
                    <option key="hooks-8" value={8}>
                      8 hooks (2 credits)
                    </option>
                    <option key="hooks-12" value={12}>
                      12 hooks (3 credits)
                    </option>
                    <option key="hooks-20" value={20}>
                      20 hooks (4 credits)
                    </option>
                  </select>
                </div>
              )}

              {/* Number of Variations for Other Content Types */}
              {isBatchSupported &&
               props.contentType !== ContentType.Idea &&
               props.contentType !== ContentType.ThumbnailConcept &&
               props.contentType !== ContentType.VideoHook && (
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "#cbd5e1",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Number of Variations
                  </label>
                  <select
                    value={props.isPremiumUser ? props.batchVariations : 1}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (props.isPremiumUser || value === 1) {
                        props.setBatchVariations(value);
                      } else {
                        AppNotifications.custom(
                          "Premium Feature Required",
                          "Multiple content variations are available in Pro and Enterprise plans. Save time by generating multiple options at once.",
                          "warning",
                          {
                            icon: "⚡",
                            duration: 6000,
                            actionText: "Upgrade Now",
                            onAction: () => (window.location.href = "/pricing"),
                          },
                        );
                      }
                    }}
                    style={{
                      ...inputStyle,
                      opacity: props.isPremiumUser ? 1 : 0.7,
                    }}
                  >
                    <option key="var-1" value={1}>
                      1 variation
                    </option>
                    {props.isPremiumUser ? (
                      <>
                        <option key="var-2" value={2}>
                          2 variations
                        </option>
                        <option key="var-3" value={3}>
                          3 variations
                        </option>
                        <option key="var-5" value={5}>
                          5 variations
                        </option>
                      </>
                    ) : (
                      <option disabled key="var-premium">
                        �� 2-5 variations (Premium)
                      </option>
                    )}
                  </select>
                </div>
              )}
              {/* Target Language */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#cbd5e1",
                    marginBottom: "0.5rem",
                  }}
                >
                  Target Language
                </label>
                <select
                  value={props.targetLanguage}
                  onChange={(e) =>
                    props.setTargetLanguage(e.target.value as Language)
                  }
                  style={inputStyle}
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* SEO Options */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr",
                gap: "1rem",
                marginBottom: "1rem",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#cbd5e1",
                    marginBottom: "0.5rem",
                  }}
                >
                  SEO Keywords
                </label>
                <input
                  type="text"
                  value={props.seoKeywords}
                  onChange={(e) => props.setSeoKeywords(e.target.value)}
                  placeholder="e.g., social media marketing, content strategy"
                  style={inputStyle}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#cbd5e1",
                    marginBottom: "0.5rem",
                  }}
                >
                  SEO Mode
                </label>
                <select
                  value={props.seoMode}
                  onChange={(e) =>
                    props.setSeoMode(e.target.value as SeoKeywordMode)
                  }
                  style={inputStyle}
                >
                  <option key="seo-incorporate" value="Incorporate Keywords">
                    Incorporate Keywords
                  </option>
                  <option key="seo-suggest" value="Suggest Keywords">
                    Suggest Keywords (Action)
                  </option>
                </select>
                {props.seoMode === SeoKeywordMode.Incorporate && (
                  <div style={{ marginTop: "1rem" }}>
                    <label
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        color: "#7dd3fc",
                        marginBottom: "0.5rem",
                        display: "block",
                      }}
                    >
                      SEO Intensity
                    </label>
                    <select
                      value={props.seoIntensity}
                      onChange={(e) =>
                        props.setSeoIntensity(e.target.value as SeoIntensity)
                      }
                      style={inputStyle}
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
            </div>

            {/* Image-specific options */}
            {isImageContent && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: "1rem",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "#cbd5e1",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Aspect Ratio
                  </label>
                  <select
                    value={props.aspectRatioGuidance}
                    onChange={(e) =>
                      props.setAspectRatioGuidance(
                        e.target.value as AspectRatioGuidance,
                      )
                    }
                    style={inputStyle}
                  >
                    {ASPECT_RATIO_GUIDANCE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "#cbd5e1",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Image Styles
                  </label>
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
                  >
                    {IMAGE_PROMPT_STYLES.map((style) => (
                      <button
                        key={style}
                        onClick={() => props.toggleImageStyle(style)}
                        style={{
                          padding: "0.5rem 0.75rem",
                          background: props.selectedImageStyles.includes(style)
                            ? "#3b82f6"
                            : "#1e293b",
                          color: props.selectedImageStyles.includes(style)
                            ? "white"
                            : "#cbd5e1",
                          border: `1px solid ${props.selectedImageStyles.includes(style) ? "#3b82f6" : "#334155"}`,
                          borderRadius: "0.375rem",
                          cursor: "pointer",
                          fontSize: "0.75rem",
                          fontFamily: "inherit",
                        }}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "#cbd5e1",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Image Moods
                  </label>
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
                  >
                    {IMAGE_PROMPT_MOODS.map((mood) => (
                      <button
                        key={mood}
                        onClick={() => props.toggleImageMood(mood)}
                        style={{
                          padding: "0.5rem 0.75rem",
                          background: props.selectedImageMoods.includes(mood)
                            ? "#3b82f6"
                            : "#1e293b",
                          color: props.selectedImageMoods.includes(mood)
                            ? "white"
                            : "#cbd5e1",
                          border: `1px solid ${props.selectedImageMoods.includes(mood) ? "#3b82f6" : "#334155"}`,
                          borderRadius: "0.375rem",
                          cursor: "pointer",
                          fontSize: "0.75rem",
                          fontFamily: "inherit",
                        }}
                      >
                        {mood}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "#cbd5e1",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Negative Prompt (What to avoid)
                  </label>
                  <input
                    type="text"
                    value={props.negativeImagePrompt}
                    onChange={(e) =>
                      props.setNegativeImagePrompt(e.target.value)
                    }
                    placeholder="e.g., blurry, low quality, text"
                    style={inputStyle}
                  />
                </div>
              </div>
            )}

            {/* Other content options */}
            <div style={{ marginTop: "1rem" }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={props.includeCTAs}
                  onChange={(e) => props.setIncludeCTAs(e.target.checked)}
                  style={{ marginRight: "0.5rem" }}
                />
                <span style={{ fontSize: "0.875rem", color: "#cbd5e1" }}>
                  Include Call-to-Actions (CTAs)
                </span>
              </label>
            </div>

            {/* Smart Suggestions Toggle - Only for Content Ideas and Premium Users */}
            {props.contentType === ContentType.Idea && (
              <div style={{ marginTop: "1rem" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: hasPremiumAccess ? "pointer" : "not-allowed",
                    padding: "0.75rem",
                    border: "1px solid #475569",
                    borderRadius: "0.5rem",
                    background: hasPremiumAccess
                      ? smartSuggestionsEnabled
                        ? "rgba(59, 130, 246, 0.1)"
                        : "rgba(30, 41, 59, 0.3)"
                      : "rgba(30, 41, 59, 0.2)",
                    transition: "all 0.2s ease",
                    opacity: hasPremiumAccess ? 1 : 0.6,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={hasPremiumAccess && smartSuggestionsEnabled}
                    onChange={(e) => {
                      if (hasPremiumAccess) {
                        setSmartSuggestionsEnabled(e.target.checked);
                      } else {
                        AppNotifications.show(
                          "Premium Feature",
                          "Smart Topic Suggestions require Creator Pro or higher. Upgrade to unlock AI-powered content suggestions.",
                          "warning",
                          5000,
                        );
                        if (props.onUpgrade) {
                          props.onUpgrade();
                        }
                      }
                    }}
                    disabled={!hasPremiumAccess}
                    style={{
                      marginRight: "0.75rem",
                      transform: "scale(1.2)",
                    }}
                  />
                  <div>
                    <div
                      style={{
                        fontSize: "0.875rem",
                        color: hasPremiumAccess ? "#cbd5e1" : "#64748b",
                        fontWeight: "500",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <span>🧠</span>
                      <span>Smart Topic Suggestions</span>
                      {!hasPremiumAccess && (
                        <span
                          style={{
                            fontSize: "0.75rem",
                            color: "#f59e0b",
                            background: "rgba(245, 158, 11, 0.2)",
                            padding: "0.25rem 0.5rem",
                            borderRadius: "0.25rem",
                            fontWeight: "600",
                          }}
                        >
                          👑 PRO
                        </span>
                      )}
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "#3b82f6",
                          background: "rgba(59, 130, 246, 0.2)",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "0.25rem",
                          fontWeight: "600",
                        }}
                      >
                        AI
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: hasPremiumAccess ? "#94a3b8" : "#64748b",
                        marginTop: "0.25rem",
                      }}
                    >
                      {hasPremiumAccess
                        ? "Real-time suggestions as you type with trending topics and proven templates"
                        : "Creator Pro feature: Get AI-powered content suggestions and trending topics"}
                    </div>
                  </div>
                </label>
              </div>
            )}

            {/* Content Intelligence Button - Only for Content Ideas */}
            {props.contentType === ContentType.Idea &&
              props.userInput.trim().length > 0 && (
                <div style={{ marginTop: "1rem" }}>
                  <button
                    onClick={() => setShowContentInsights(true)}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "1px solid #475569",
                      borderRadius: "0.5rem",
                      background:
                        "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                      color: "white",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-1px)";
                      e.currentTarget.style.boxShadow =
                        "0 10px 25px rgba(59, 130, 246, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <span>📊</span>
                    <span>Analyze Content Intelligence</span>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        background: "rgba(255, 255, 255, 0.2)",
                        padding: "0.25rem 0.5rem",
                        borderRadius: "0.25rem",
                        fontWeight: "700",
                      }}
                    >
                      AI
                    </span>
                  </button>
                </div>
              )}
          </div>
        )}
      </div>

      <div />

      {/* Premium Generator Enhancement - Show for all users */}
      {
        <PremiumGeneratorEnhancement
          platform={props.platform}
          contentType={props.contentType}
          userInput={props.userInput}
          targetAudience={props.targetAudience}
          isPremium={hasPremiumAccess}
          onUpgrade={props.onUpgrade}
          onApplyTemplate={async (template) => {
            try {
              // Import the premium service for proper template application
              const { applyPremiumTemplate } = await import('../../services/premiumGeminiService');

              // Apply template with user context
              const appliedTemplate = applyPremiumTemplate(
                props.userInput,
                template,
                {
                  targetAudience: props.targetAudience,
                  platform: props.platform,
                  // Add more context based on user inputs
                }
              );

              // Set the applied template as user input
              props.setUserInput(appliedTemplate);
              props.onApplyPremiumTemplate?.(template);

              // Show success notification
              console.log(`✅ Template "${template.name}" applied successfully!`);
            } catch (error) {
              console.error('Template application error:', error);
              // Fallback to basic replacement if service fails
              const templateText = template.template.replace(
                /{[^}]+}/g,
                (match) => {
                  const placeholder = match.slice(1, -1);
                  return `[${placeholder}]`;
                },
              );
              props.setUserInput(templateText);
              props.onApplyPremiumTemplate?.(template);
            }
          }}
          onGenerateBatch={(config) => {
            // Trigger batch generation
            console.log("Batch generation:", config);
            props.onGenerate();
          }}
          onApplyPersona={(persona) => {
            // Apply persona to generation context
            console.log("Applying persona:", persona);
            props.onApplyCustomPersona?.(persona);
          }}
          onOptimizeForSEO={(seoConfig) => {
            // Apply SEO optimization
            console.log("SEO optimization:", seoConfig);
            props.onSetSEOConfig?.(seoConfig);
          }}
          onPredictPerformance={() => {
            // Generate performance prediction
            console.log("Performance prediction requested");
          }}
        />
      }

      {/* Credit Display */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "1rem",
          padding: "0.75rem",
          background: "rgba(30, 41, 59, 0.5)",
          borderRadius: "0.75rem",
          border: "1px solid rgba(100, 116, 139, 0.3)",
        }}
      >
        <div style={{ color: "#cbd5e1", fontSize: "0.875rem" }}>
          Available Credits
        </div>
        <CreditDisplay size="small" />
      </div>

      {/* Generate Button */}
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          marginTop: "1.5rem",
        }}
      >
        <button
          onClick={props.onShowTemplateModal}
          style={{
            ...buttonStyle,
            background: "#6366f1",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <SaveIcon style={{ width: "1rem", height: "1rem" }} />
          Templates
        </button>

        {/* Creator Pro Batch Generation Hint for free users - HIDE for anonymous */}
        {user && !canUseBatchGeneration && !hasPremiumAccess && (
          <SubscriptionUpgradeHint
            feature="Batch Generation"
            requiredPlan="pro"
            featureDescription="Generate up to 50 content types simultaneously. Save time and get 25% credit discount on bulk operations."
            onUpgrade={props.onUpgrade}
            className="mb-4"
          />
        )}

        <button
          data-tour="generate-button"
          onClick={() => {
            // Check if trying to use premium content type without premium access
            if (
              isPremiumContentType(props.contentType) &&
              !props.isPremiumUser
            ) {
              AppNotifications.custom(
                "Premium Content Type Required",
                `${USER_SELECTABLE_CONTENT_TYPES.find((ct) => ct.value === props.contentType)?.label} is available in Creator Pro and Enterprise plans. Upgrade to unlock advanced content generation capabilities.`,
                "warning",
                {
                  icon: "⭐",
                  duration: 8000,
                  actionText: "Upgrade Now",
                  onAction: () => (window.location.href = "/pricing"),
                },
              );
              return;
            }

            // Check credits before generating using calculated amount
            const feature =
              props.contentType === ContentType.Image ||
              props.contentType === ContentType.ImagePrompt
                ? "image_generation"
                : "content_generation";

            if (!canAfford(feature, props.batchVariations)) {
              alert(
                `Insufficient credits! You need ${creditsNeeded} credits for this generation. Please purchase more credits or upgrade your plan.`,
              );
              return;
            }

            props.onGenerate();
          }}
          disabled={
            props.isLoading ||
            props.apiKeyMissing ||
            (!props.userInput.trim() &&
              ![
                ContentType.ImagePrompt,
                ContentType.TrendAnalysis,
                ContentType.ContentGapFinder,
                ContentType.VoiceToScript,
              ].includes(props.contentType)) ||
            !canAfford(
              props.contentType === ContentType.Image ||
                props.contentType === ContentType.ImagePrompt
                ? "image_generation"
                : "content_generation",
              props.batchVariations,
            )
          }
          style={{
            ...buttonStyle,
            background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            fontWeight: "600",
            opacity: props.isLoading || props.apiKeyMissing ? 0.5 : 1,
            cursor:
              props.isLoading || props.apiKeyMissing
                ? "not-allowed"
                : "pointer",
          }}
        >
          <SparklesIcon style={{ width: "1.125rem", height: "1.125rem" }} />
          {props.isLoading
            ? "Generating..."
            : props.contentType === ContentType.ABTest && props.abTestType
              ? `Generate A/B Test (${creditsNeeded} ${creditsNeeded === 1 ? "credit" : "credits"})`
              : `Generate Content (${creditsNeeded} ${creditsNeeded === 1 ? "credit" : "credits"})`}
        </button>
      </div>

      {/* Content Intelligence Panel */}
      <ContentInsightsPanel
        userInput={props.userInput}
        platform={props.platform}
        contentType={props.contentType}
        isVisible={showContentInsights}
        onClose={() => setShowContentInsights(false)}
      />
    </div>
  );
};
