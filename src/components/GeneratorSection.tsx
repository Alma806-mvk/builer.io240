import React, { useState } from "react";
import {
  Platform,
  ContentType,
  Language,
  AiPersona,
  ImagePromptStyle,
  ImagePromptMood,
  AspectRatioGuidance,
  SeoKeywordMode,
} from "../../types";

import {
  PLATFORMS,
  USER_SELECTABLE_CONTENT_TYPES,
  DEFAULT_USER_INPUT_PLACEHOLDERS,
  IMAGE_PROMPT_STYLES,
  IMAGE_PROMPT_MOODS,
  SUPPORTED_LANGUAGES,
  DEFAULT_AI_PERSONAS,
  ASPECT_RATIO_GUIDANCE_OPTIONS,
} from "../../constants";

import {
  SparklesIcon,
  ViewfinderCircleIcon,
  RefreshCwIcon,
  WandIcon,
} from "../IconComponents";

import LoadingSpinner from "../../components/LoadingSpinner";
import GeneratingContent from "./GeneratingContent";
import {
  SmartLimitedSlider,
  SmartLimitedSelect,
  PremiumFeatureWrapper,
} from "../ui/SmartLimitedInput";
import { useSubscription } from "../../context/SubscriptionContext";
import { useFeatureLimits } from "../../services/featureLimitsService";

interface GeneratorSectionProps {
  // State
  selectedPlatform: Platform;
  selectedContentType: ContentType;
  selectedLanguage: Language;
  selectedAiPersona: AiPersona;
  targetAudience: string;
  batchVariations: number;
  isLoading: boolean;
  error: string | null;

  // Premium features
  userPlan?: "free" | "pro" | "enterprise";
  isPremiumUser?: boolean;

  // Image generation
  selectedImageStyles: ImagePromptStyle[];
  selectedImageMoods: ImagePromptMood[];
  negativeImagePrompt: string;
  aspectRatioGuidance: AspectRatioGuidance;

  // SEO
  seoKeywords: string;
  seoKeywordMode: SeoKeywordMode;

  // UI state
  showAdvancedOptions: boolean;

  // Course-specific options
  courseModules?: number;
  courseDuration?: string;
  courseDifficulty?: string;
  includeAssessments?: boolean;
  courseObjectives?: string;

  // Actions
  setSelectedPlatform: (platform: Platform) => void;
  setSelectedContentType: (type: ContentType) => void;
  setSelectedLanguage: (language: Language) => void;
  setSelectedAiPersona: (persona: AiPersona) => void;
  setTargetAudience: (audience: string) => void;
  setBatchVariations: (batch: number) => void;
  toggleImageStyle: (style: ImagePromptStyle) => void;
  toggleImageMood: (mood: ImagePromptMood) => void;
  setNegativeImagePrompt: (prompt: string) => void;
  setAspectRatioGuidance: (guidance: AspectRatioGuidance) => void;
  setSeoKeywords: (keywords: string) => void;
  setSeoKeywordMode: (mode: SeoKeywordMode) => void;
  setShowAdvancedOptions: (show: boolean) => void;

  // Course-specific setters
  setCourseModules?: (modules: number) => void;
  setCourseDuration?: (duration: string) => void;
  setCourseDifficulty?: (difficulty: string) => void;
  setIncludeAssessments?: (include: boolean) => void;
  setCourseObjectives?: (objectives: string) => void;

  onGenerate: () => void;

  // Computed values
  currentPlaceholder: string;
  isBatchSupported: boolean;
  isSeoKeywordsSupported: boolean;
}

export const GeneratorSection: React.FC<GeneratorSectionProps> = (props) => {
  const [localUserInput, setLocalUserInput] = useState("");
  const { billingInfo } = useSubscription();
  const featureLimits = useFeatureLimits(billingInfo);
  const isImageGeneration =
    props.selectedContentType === ContentType.Image ||
    props.selectedContentType === ContentType.ImagePrompt;

  // Check if advanced options should be shown based on subscription
  const shouldShowAdvancedOptions = featureLimits.shouldShowAdvancedOptions();

  return (
    <div className="flex-grow flex flex-col">
      {/* Generation Form */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 shadow-2xl mb-6">
        <div className="flex items-center space-x-4 mb-8">
          <div className="p-3 bg-gradient-to-br from-sky-500 to-purple-600 rounded-2xl shadow-lg">
            <SparklesIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-300 to-purple-300 bg-clip-text text-transparent">
              AI Content Generator
            </h2>
            <p className="text-slate-300 text-lg">
              Create engaging content for any platform
            </p>
          </div>
        </div>

        {/* Main Input */}
        <div className="mb-6">
          <label
            htmlFor="userInput"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            What would you like to create?
          </label>
          <textarea
            id="userInput"
            value={localUserInput}
            onChange={(e) => setLocalUserInput(e.target.value)}
            placeholder={props.currentPlaceholder}
            className="w-full h-32 p-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-400 resize-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
            disabled={props.isLoading}
          />
        </div>

        {/* Platform and Content Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label
              htmlFor="platform"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Platform
            </label>
            <select
              id="platform"
              value={props.selectedPlatform}
              onChange={(e) =>
                props.setSelectedPlatform(e.target.value as Platform)
              }
              className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              disabled={props.isLoading}
            >
              {PLATFORMS.map((platform) => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="contentType"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Content Type
            </label>
            <select
              id="contentType"
              value={props.selectedContentType}
              onChange={(e) =>
                props.setSelectedContentType(e.target.value as ContentType)
              }
              className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              disabled={props.isLoading}
            >
              {USER_SELECTABLE_CONTENT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Advanced Options Toggle */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                if (shouldShowAdvancedOptions) {
                  props.setShowAdvancedOptions(!props.showAdvancedOptions);
                }
              }}
              className={`flex items-center space-x-2 transition-colors ${
                shouldShowAdvancedOptions
                  ? "text-slate-300 hover:text-white cursor-pointer"
                  : "text-slate-500 cursor-not-allowed"
              }`}
              disabled={!shouldShowAdvancedOptions}
            >
              <WandIcon className="h-4 w-4" />
              <span>Advanced Options</span>
              {shouldShowAdvancedOptions ? (
                <span
                  className={`transform transition-transform ${props.showAdvancedOptions ? "rotate-180" : ""}`}
                >
                  ▼
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 ml-2">
                  Premium
                </span>
              )}
            </button>

            {!shouldShowAdvancedOptions && (
              <button
                onClick={() => (window.location.href = "/billing")}
                className="text-xs bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white px-3 py-1 rounded-lg font-medium transition-all"
              >
                Upgrade
              </button>
            )}
          </div>
        </div>

        {/* Advanced Options */}
        {props.showAdvancedOptions && shouldShowAdvancedOptions && (
          <div className="space-y-6 mb-6 p-6 bg-slate-800/30 rounded-xl border border-slate-700/30">
            {/* Plan Status and Limits Info */}
            <div className="bg-gradient-to-r from-slate-800/40 to-slate-700/40 border border-slate-600/50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      featureLimits.getCurrentPlan().name === "Creator Free"
                        ? "bg-slate-600/50 text-slate-300"
                        : "bg-gradient-to-r from-sky-500/20 to-purple-500/20 text-sky-300"
                    }`}
                  >
                    {featureLimits.getCurrentPlan().name === "Creator Free"
                      ? "🆓"
                      : "⭐"}
                  </div>
                  <div>
                    <h3 className="text-slate-200 font-semibold text-sm">
                      Current Plan: {featureLimits.getCurrentPlan().name}
                    </h3>
                    <p className="text-slate-400 text-xs">
                      {featureLimits.getCurrentPlan().description}
                    </p>
                  </div>
                </div>

                {featureLimits.getCurrentPlan().name === "Creator Free" && (
                  <button
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white px-4 py-2 rounded-lg text-xs font-medium transition-all"
                    onClick={() => (window.location.href = "/billing")}
                  >
                    Upgrade
                  </button>
                )}
              </div>
            </div>
            {/* Language and AI Persona */}
            <PremiumFeatureWrapper feature="customPersonas">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="language"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    Language
                  </label>
                  <select
                    id="language"
                    value={props.selectedLanguage}
                    onChange={(e) =>
                      props.setSelectedLanguage(e.target.value as Language)
                    }
                    className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    disabled={props.isLoading}
                  >
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <option key={lang.value} value={lang.value}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="aiPersona"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    AI Persona
                  </label>
                  <select
                    id="aiPersona"
                    value={props.selectedAiPersona.id}
                    onChange={(e) => {
                      const persona = DEFAULT_AI_PERSONAS.find(
                        (p) => p.id === e.target.value,
                      );
                      if (persona) props.setSelectedAiPersona(persona);
                    }}
                    className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    disabled={props.isLoading}
                  >
                    {DEFAULT_AI_PERSONAS.map((persona) => (
                      <option key={persona.id} value={persona.id}>
                        {persona.name} - {persona.description}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </PremiumFeatureWrapper>

            {/* Target Audience */}
            <div>
              <label
                htmlFor="targetAudience"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Target Audience (Optional)
              </label>
              <input
                id="targetAudience"
                type="text"
                value={props.targetAudience}
                onChange={(e) => props.setTargetAudience(e.target.value)}
                placeholder="e.g., Young entrepreneurs, fitness enthusiasts"
                className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                disabled={props.isLoading}
              />
            </div>

            {/* Course-Specific Options */}
            {props.selectedContentType ===
              ContentType.CourseEducationalContent && (
              <div className="space-y-4 p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">🎓</span>
                  <h3 className="text-cyan-300 font-semibold">
                    Online Course Structure
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SmartLimitedSelect
                    label="Number of Modules"
                    value={props.courseModules || 5}
                    onChange={(value) => props.setCourseModules?.(value)}
                    feature="courseModules"
                    disabled={props.isLoading}
                  />

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Course Duration
                    </label>
                    <select
                      value={props.courseDuration || "4-6 weeks"}
                      onChange={(e) =>
                        props.setCourseDuration?.(e.target.value)
                      }
                      className="w-full p-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-100 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                      disabled={props.isLoading}
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
                      value={props.courseDifficulty || "Beginner"}
                      onChange={(e) =>
                        props.setCourseDifficulty?.(e.target.value)
                      }
                      className="w-full p-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-100 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                      disabled={props.isLoading}
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="All Levels">All Levels</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Include Assessments
                    </label>
                    <select
                      value={props.includeAssessments ? "yes" : "no"}
                      onChange={(e) =>
                        props.setIncludeAssessments?.(e.target.value === "yes")
                      }
                      className="w-full p-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-100 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                      disabled={props.isLoading}
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
                    value={props.courseObjectives || ""}
                    onChange={(e) =>
                      props.setCourseObjectives?.(e.target.value)
                    }
                    placeholder="What will students be able to do after completing this course? (e.g., Build their own website, Master advanced photography techniques)"
                    className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 resize-none"
                    rows={3}
                    disabled={props.isLoading}
                  />
                </div>

                {/* Monetization Features Section */}
                <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-600/30">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">💎</span>
                    <h4 className="text-yellow-300 font-medium">Monetization Features</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Target Price Range
                      </label>
                      <select
                        value={props.coursePriceRange || "$297-$497"}
                        onChange={(e) =>
                          props.setCoursePriceRange?.(e.target.value)
                        }
                        className="w-full p-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-100 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                        disabled={props.isLoading}
                      >
                        <option value="$97-$197">$97-$197 (Entry Level)</option>
                        <option value="$297-$497">$297-$497 (Premium)</option>
                        <option value="$597-$997">$597-$997 (High-Value)</option>
                        <option value="$1,297-$1,997">$1,297-$1,997 (Expert)</option>
                        <option value="$2,997+">$2,997+ (Masterclass)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Target Audience
                      </label>
                      <input
                        type="text"
                        value={props.courseTargetAudience || ""}
                        onChange={(e) =>
                          props.setCourseTargetAudience?.(e.target.value)
                        }
                        placeholder="e.g., Busy entrepreneurs, Marketing professionals"
                        className="w-full p-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-100 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 placeholder-slate-400"
                        disabled={props.isLoading}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600/20">
                      <div>
                        <span className="text-green-300 font-medium text-sm">Include Marketing Materials</span>
                        <p className="text-slate-400 text-xs">Sales pages, email sequences, ads</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={props.includeMarketing !== false}
                        onChange={(e) => props.setIncludeMarketing?.(e.target.checked)}
                        className="h-4 w-4 text-cyan-500 focus:ring-cyan-500 border-slate-600 rounded bg-slate-700"
                        disabled={props.isLoading}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600/20">
                      <div>
                        <span className="text-purple-300 font-medium text-sm">Include Bonus Content</span>
                        <p className="text-slate-400 text-xs">Templates, tools, exclusive resources</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={props.includeBonuses !== false}
                        onChange={(e) => props.setIncludeBonuses?.(e.target.checked)}
                        className="h-4 w-4 text-cyan-500 focus:ring-cyan-500 border-slate-600 rounded bg-slate-700"
                        disabled={props.isLoading}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600/20">
                      <div>
                        <span className="text-orange-300 font-medium text-sm">Include Upsell Strategy</span>
                        <p className="text-slate-400 text-xs">Coaching, advanced programs, tools</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={props.includeUpsells !== false}
                        onChange={(e) => props.setIncludeUpsells?.(e.target.checked)}
                        className="h-4 w-4 text-cyan-500 focus:ring-cyan-500 border-slate-600 rounded bg-slate-700"
                        disabled={props.isLoading}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Batch Variations with Smart Limits */}
            {props.isBatchSupported && (
              <SmartLimitedSlider
                label="Number of Variations"
                value={props.batchVariations}
                onChange={props.setBatchVariations}
                feature="batchVariations"
                disabled={props.isLoading}
              />
            )}

            {/* Image Generation Options */}
            <PremiumFeatureWrapper feature="imageGeneration">
              {isImageGeneration && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      <ViewfinderCircleIcon className="w-4 h-4 mr-1.5 inline text-slate-500" />
                      Aspect Ratio Guidance
                    </label>
                    <select
                      value={props.aspectRatioGuidance}
                      onChange={(e) =>
                        props.setAspectRatioGuidance(
                          e.target.value as AspectRatioGuidance,
                        )
                      }
                      className="w-full p-2.5 text-sm bg-slate-600/70 border-slate-500/80 rounded-md focus:ring-1 focus:ring-sky-500 focus:border-sky-500 placeholder-slate-400 text-slate-200"
                    >
                      {ASPECT_RATIO_GUIDANCE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">
                      Image Styles (Optional)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {IMAGE_PROMPT_STYLES.map((style) => (
                        <button
                          key={style}
                          type="button"
                          onClick={() => props.toggleImageStyle(style)}
                          className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                            props.selectedImageStyles.includes(style)
                              ? "bg-sky-600 border-sky-500 text-white shadow-sm"
                              : "bg-slate-600/70 border-slate-500/80 hover:bg-slate-500/70"
                          }`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">
                      Image Moods (Optional)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {IMAGE_PROMPT_MOODS.map((mood) => (
                        <button
                          key={mood}
                          type="button"
                          onClick={() => props.toggleImageMood(mood)}
                          className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                            props.selectedImageMoods.includes(mood)
                              ? "bg-sky-600 border-sky-500 text-white shadow-sm"
                              : "bg-slate-600/70 border-slate-500/80 hover:bg-slate-500/70"
                          }`}
                        >
                          {mood}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="negativeImagePrompt"
                      className="block text-xs font-medium text-slate-400 mb-1"
                    >
                      Negative Prompt (for Images)
                    </label>
                    <input
                      type="text"
                      id="negativeImagePrompt"
                      value={props.negativeImagePrompt}
                      onChange={(e) =>
                        props.setNegativeImagePrompt(e.target.value)
                      }
                      placeholder="e.g., no text, blurry, disfigured"
                      className="w-full p-2.5 text-sm bg-slate-600/70 border-slate-500/80 rounded-md focus:ring-1 focus:ring-sky-500 focus:border-sky-500 placeholder-slate-400 text-slate-200"
                    />
                  </div>
                </>
              )}
            </PremiumFeatureWrapper>

            {/* SEO Keywords */}
            <PremiumFeatureWrapper feature="seoOptimization">
              {props.isSeoKeywordsSupported && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="seoKeywords"
                      className="block text-sm font-medium text-sky-300 mb-1"
                    >
                      SEO Keywords (Optional)
                    </label>
                    <input
                      type="text"
                      id="seoKeywords"
                      value={props.seoKeywords}
                      onChange={(e) => props.setSeoKeywords(e.target.value)}
                      placeholder="e.g., healthy recipes, travel tips"
                      className="w-full p-2.5 bg-slate-600 border border-slate-500 rounded-lg text-slate-100 placeholder-slate-400 text-sm"
                      disabled={props.isLoading}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="seoMode"
                      className="block text-sm font-medium text-sky-300 mb-1"
                    >
                      SEO Mode
                    </label>
                    <select
                      id="seoMode"
                      value={props.seoKeywordMode}
                      onChange={(e) =>
                        props.setSeoKeywordMode(
                          e.target.value as SeoKeywordMode,
                        )
                      }
                      className="w-full p-2.5 bg-slate-600 border border-slate-500 rounded-lg text-slate-100 text-sm focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                      disabled={props.isLoading}
                    >
                      <option value="include">Include keywords</option>
                      <option value="incorporate">Naturally incorporate</option>
                      <option value="optimize">SEO optimize around</option>
                    </select>
                  </div>
                </div>
              )}
            </PremiumFeatureWrapper>
          </div>
        )}

        {/* Generate Button */}
        <div className="flex justify-center">
          <button
            onClick={props.onGenerate}
            disabled={props.isLoading || !localUserInput.trim()}
            className="group relative px-8 py-4 bg-gradient-to-r from-sky-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl disabled:shadow-none transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center space-x-3"
          >
            {props.isLoading ? (
              <>
                <LoadingSpinner />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <SparklesIcon className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                <span>Generate Content</span>
              </>
            )}
          </button>
        </div>

        {/* Error Display */}
        {props.error && (
          <div className="mt-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-red-300 text-sm">{props.error}</p>
          </div>
        )}
      </div>

      {/* Loading State */}
      {props.isLoading && (
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 shadow-2xl">
          <GeneratingContent message="🎨 Creating your content..." />
        </div>
      )}
    </div>
  );
};

export default GeneratorSection;
