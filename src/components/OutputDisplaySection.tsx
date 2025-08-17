import React, { useState } from "react";
import {
  GeneratedOutput,
  GeneratedTextOutput,
  GeneratedImageOutput,
  ContentStrategyPlanOutput,
  TrendAnalysisOutput,
  EngagementFeedbackOutput,
  HistoryItem,
  Platform,
  ContentType,
} from "../../types";

import {
  ClipboardIcon,
  StarIcon,
  EyeIcon,
  DownloadIcon,
  ShareIcon,
  CheckCircleIcon,
  PhotoIcon,
  FileTextIcon,
  TrendingUpIcon,
  ChartBarIcon,
} from "../IconComponents";

interface OutputDisplaySectionProps {
  displayedOutputItem: HistoryItem | null;
  generatedOutput: GeneratedOutput | null;
  copied: boolean;

  // Actions
  handleCopyToClipboard: (text: string) => void;
  handleDownloadContent: (content: string, filename: string) => void;
  onAddToHistory?: (item: HistoryItem) => void;

  // UI
  setShowImageModal?: (show: boolean) => void;
  setModalImageSrc?: (src: string | null) => void;
}

const isGeneratedTextOutput = (output: any): output is GeneratedTextOutput => {
  return (
    output &&
    typeof output === "object" &&
    !Array.isArray(output) &&
    output.type === "text"
  );
};

const isGeneratedImageOutput = (
  output: any,
): output is GeneratedImageOutput => {
  return (
    output &&
    typeof output === "object" &&
    !Array.isArray(output) &&
    output.type === "image"
  );
};

const isContentStrategyPlanOutput = (
  output: any,
): output is ContentStrategyPlanOutput => {
  return (
    output &&
    typeof output === "object" &&
    "contentPillars" in output &&
    "keyThemes" in output
  );
};

const isTrendAnalysisOutput = (output: any): output is TrendAnalysisOutput => {
  return (
    output &&
    typeof output === "object" &&
    output.type === "trend_analysis" &&
    "query" in output &&
    Array.isArray((output as TrendAnalysisOutput).items)
  );
};

const isEngagementFeedbackOutput = (
  output: any,
): output is EngagementFeedbackOutput => {
  return (
    output &&
    typeof output === "object" &&
    output.type === "engagement_feedback"
  );
};

export const OutputDisplaySection: React.FC<OutputDisplaySectionProps> = ({
  displayedOutputItem,
  generatedOutput,
  copied,
  handleCopyToClipboard,
  handleDownloadContent,
  onAddToHistory,
  setShowImageModal,
  setModalImageSrc,
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(),
  );

  if (!displayedOutputItem && !generatedOutput) {
    return null;
  }

  const output = displayedOutputItem?.output || generatedOutput;
  const isFromHistory = !!displayedOutputItem;

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const getOutputIcon = () => {
    if (isGeneratedImageOutput(output)) {
      return <PhotoIcon className="h-8 w-8 text-white" />;
    }
    if (isContentStrategyPlanOutput(output)) {
      return <ChartBarIcon className="h-8 w-8 text-white" />;
    }
    if (isTrendAnalysisOutput(output)) {
      return <TrendingUpIcon className="h-8 w-8 text-white" />;
    }
    return <FileTextIcon className="h-8 w-8 text-white" />;
  };

  const getOutputTitle = () => {
    if (isGeneratedImageOutput(output)) {
      return "Generated Image";
    }
    if (isContentStrategyPlanOutput(output)) {
      return "Content Strategy Plan";
    }
    if (isTrendAnalysisOutput(output)) {
      return "Trend Analysis";
    }
    if (isEngagementFeedbackOutput(output)) {
      return "Engagement Feedback";
    }
    if (Array.isArray(output)) {
      return `Generated Content (${output.length} variations)`;
    }
    return "Generated Content";
  };

  const getOutputContent = () => {
    if (isGeneratedTextOutput(output)) {
      return output.content || "";
    }
    if (Array.isArray(output)) {
      return output
        .map(
          (item, index) =>
            `=== Variation ${index + 1} ===\n${
              typeof item === "object" && "content" in item
                ? item.content
                : JSON.stringify(item)
            }`,
        )
        .join("\n\n");
    }
    return JSON.stringify(output, null, 2);
  };

  const downloadFilename = `content_${Date.now()}.txt`;

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg">
            {getOutputIcon()}
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
              {getOutputTitle()}
            </h2>
            {displayedOutputItem && (
              <p className="text-slate-300 text-sm">
                {displayedOutputItem.platform} •{" "}
                {displayedOutputItem.contentType}
                {displayedOutputItem.targetAudience &&
                  ` • ${displayedOutputItem.targetAudience}`}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          {!isFromHistory && onAddToHistory && (
            <button
              onClick={() => {
                // This would be handled by the parent component
                console.log("Add to history");
              }}
              className="p-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl transition-colors"
              title="Save to History"
            >
              <StarIcon className="h-5 w-5" />
            </button>
          )}

          <button
            onClick={() => handleCopyToClipboard(getOutputContent())}
            className="group p-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl transition-all duration-300 transform hover:scale-105"
            title="Copy Content"
          >
            <ClipboardIcon className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
          </button>

          <button
            onClick={() =>
              handleDownloadContent(getOutputContent(), downloadFilename)
            }
            className="p-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-colors"
            title="Download Content"
          >
            <DownloadIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Content Display */}
      <div className="space-y-6">
        {/* Text Content */}
        {isGeneratedTextOutput(output) && (
          <div className="bg-slate-800/30 rounded-2xl p-6 backdrop-blur-sm">
            <div className="prose prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-slate-200 leading-relaxed">
                {output.content}
              </div>
            </div>

            {/* Grounding Sources */}
            {output.groundingSources && output.groundingSources.length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-700/50">
                <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center space-x-2">
                  <EyeIcon className="h-4 w-4" />
                  <span>Sources</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {output.groundingSources.map((source, index) => (
                    <a
                      key={source.uri || `source-${index}`}
                      href={source.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-slate-700/30 rounded-lg border border-slate-600/30 hover:border-slate-500/50 transition-all duration-200 group"
                    >
                      <h5 className="text-sm font-medium text-slate-200 group-hover:text-sky-300 transition-colors line-clamp-2">
                        {source.title}
                      </h5>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                        {source.snippet}
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Image Content */}
        {isGeneratedImageOutput(output) && (
          <div className="bg-slate-800/30 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex justify-center">
              <div className="relative group">
                <img
                  src={`data:${output.mimeType};base64,${output.base64Data}`}
                  alt="Generated content"
                  className="max-w-full max-h-96 rounded-xl shadow-lg cursor-pointer transition-transform duration-300 group-hover:scale-105"
                  onClick={() => {
                    if (setShowImageModal && setModalImageSrc) {
                      setModalImageSrc(
                        `data:${output.mimeType};base64,${output.base64Data}`,
                      );
                      setShowImageModal(true);
                    }
                  }}
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
                  <EyeIcon className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Strategy Plan */}
        {isContentStrategyPlanOutput(output) && (
          <div className="space-y-6">
            {/* Content Pillars */}
            <div className="bg-slate-800/30 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-slate-200 mb-4">
                Content Pillars
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {output.contentPillars.map((pillar, index) => (
                  <div
                    key={pillar.name || `pillar-${index}`}
                    className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30"
                  >
                    <h4 className="font-medium text-slate-200 mb-2">
                      {pillar.name}
                    </h4>
                    <p className="text-sm text-slate-400">
                      {pillar.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {pillar.topics.slice(0, 3).map((topic, topicIndex) => (
                        <span
                          key={`${pillar.name}-topic-${topicIndex}`}
                          className="px-2 py-1 bg-sky-500/20 text-sky-300 text-xs rounded-full"
                        >
                          {topic}
                        </span>
                      ))}
                      {pillar.topics.length > 3 && (
                        <span className="px-2 py-1 bg-slate-600/50 text-slate-400 text-xs rounded-full">
                          +{pillar.topics.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Themes */}
            <div className="bg-slate-800/30 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-slate-200 mb-4">
                Key Themes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {output.keyThemes.map((theme, index) => (
                  <div
                    key={theme.name || `theme-${index}`}
                    className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30"
                  >
                    <h4 className="font-medium text-slate-200 mb-2">
                      {theme.name}
                    </h4>
                    <p className="text-sm text-slate-400 mb-3">
                      {theme.description}
                    </p>
                    <div className="space-y-2">
                      {theme.contentIdeas.slice(0, 3).map((idea, ideaIndex) => (
                        <div
                          key={`${theme.name}-idea-${ideaIndex}`}
                          className="text-xs text-slate-400 flex items-start space-x-2"
                        >
                          <span className="text-emerald-400 mt-1">•</span>
                          <span>{idea}</span>
                        </div>
                      ))}
                      {theme.contentIdeas.length > 3 && (
                        <div className="text-xs text-slate-500">
                          +{theme.contentIdeas.length - 3} more ideas
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Trend Analysis */}
        {isTrendAnalysisOutput(output) && (
          <div className="bg-slate-800/30 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-200">
                Trend Analysis: {output.query}
              </h3>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-medium rounded-full border border-emerald-500/30">
                {output.items.length} trends found
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {output.items.map((item, index) => (
                <div
                  key={item.url || item.title || `item-${index}`}
                  className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-slate-200 line-clamp-2 flex-grow">
                      {item.title}
                    </h4>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ml-2 ${
                        item.sourceType === "news"
                          ? "bg-red-500/20 text-red-300"
                          : item.sourceType === "video"
                            ? "bg-purple-500/20 text-purple-300"
                            : item.sourceType === "discussion"
                              ? "bg-blue-500/20 text-blue-300"
                              : "bg-green-500/20 text-green-300"
                      }`}
                    >
                      {item.sourceType}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mb-3 line-clamp-3">
                    {item.snippet}
                  </p>
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-sky-400 hover:text-sky-300 transition-colors"
                    >
                      View source →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Array Output (Multiple Variations) */}
        {Array.isArray(output) && (
          <div className="space-y-4">
            {output.map((item, index) => (
              <div
                key={`variation-${index}`}
                className="bg-slate-800/30 rounded-2xl p-6 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-200">
                    Variation {index + 1}
                  </h3>
                  <button
                    onClick={() => {
                      const content =
                        typeof item === "object" && "content" in item
                          ? item.content || ""
                          : JSON.stringify(item);
                      handleCopyToClipboard(content);
                    }}
                    className="p-2 text-slate-400 hover:text-slate-200 rounded-lg transition-colors"
                    title="Copy this variation"
                  >
                    <ClipboardIcon className="h-4 w-4" />
                  </button>
                </div>

                <div className="prose prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-slate-200 leading-relaxed">
                    {typeof item === "object" && "content" in item
                      ? item.content
                      : JSON.stringify(item, null, 2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Success Message */}
        {copied && (
          <div className="flex items-center justify-center space-x-2 text-emerald-400 bg-emerald-500/10 rounded-lg p-3 border border-emerald-500/20">
            <CheckCircleIcon className="h-5 w-5" />
            <span className="font-medium">Content copied to clipboard!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputDisplaySection;
