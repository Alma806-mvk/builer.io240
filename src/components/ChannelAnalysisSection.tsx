import React, { useState } from "react";
import { ParsedChannelAnalysisSection } from "../../types";

import {
  SearchCircleIcon,
  ClipboardIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  TrendingUpIcon,
  UsersIcon,
  PlayCircleIcon,
} from "../IconComponents";

import LoadingSpinner from "../../components/LoadingSpinner";
import GeneratingContent from "./GeneratingContent";

interface ChannelAnalysisSectionProps {
  // Input state
  // (removed: channelAnalysisInput, setChannelAnalysisInput)

  // Analysis state
  parsedChannelAnalysis: ParsedChannelAnalysisSection[] | null;
  channelAnalysisError: string | null;
  channelAnalysisSummary: string | null;
  isAnalyzingChannel: boolean;
  isSummarizingChannelAnalysis: boolean;

  // Actions
  onAnalyzeChannel: (channelInput: string) => void;
  onSummarizeAnalysis: () => void;
  handleCopyToClipboard: (text: string) => void;
  setChannelAnalysisSummary: (summary: string | null) => void;

  // UI state
  copied: boolean;
  user: any;
  onSignInRequired?: () => void;
}

export const ChannelAnalysisSection: React.FC<ChannelAnalysisSectionProps> = ({
  // Input state
  // (removed: channelAnalysisInput, setChannelAnalysisInput)

  // Analysis state
  parsedChannelAnalysis,
  channelAnalysisError,
  channelAnalysisSummary,
  isAnalyzingChannel,
  isSummarizingChannelAnalysis,

  // Actions
  onAnalyzeChannel,
  onSummarizeAnalysis,
  handleCopyToClipboard,
  setChannelAnalysisSummary,

  // UI state
  copied,
  user,
  onSignInRequired,
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(),
  );
  const [localChannelInput, setLocalChannelInput] = useState("");

  const toggleSection = (sectionTitle: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionTitle)) {
      newExpanded.delete(sectionTitle);
    } else {
      newExpanded.add(sectionTitle);
    }
    setExpandedSections(newExpanded);
  };

  const handleAnalyze = () => {
    if (!user && onSignInRequired) {
      onSignInRequired();
      return;
    }
    onAnalyzeChannel(localChannelInput);
  };

  const getSectionIcon = (title: string) => {
    if (title.includes("Summary") || title.includes("Niche")) {
      return <TrendingUpIcon className="h-5 w-5" />;
    }
    if (title.includes("Audience") || title.includes("Engagement")) {
      return <UsersIcon className="h-5 w-5" />;
    }
    if (title.includes("Ideas") || title.includes("Opportunities")) {
      return <LightBulbIcon className="h-5 w-5" />;
    }
    if (title.includes("Video") || title.includes("Content")) {
      return <PlayCircleIcon className="h-5 w-5" />;
    }
    return <SearchCircleIcon className="h-5 w-5" />;
  };

  return (
    <div className="flex-grow flex flex-col">
      {/* Channel Analysis Header */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 shadow-2xl mb-6">
        <div className="flex items-center space-x-4 mb-8">
          <div className="p-3 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl shadow-lg">
            <SearchCircleIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-red-300 to-pink-300 bg-clip-text text-transparent">
              YouTube Channel Analysis
            </h2>
            <p className="text-slate-300 text-lg">
              Analyze YouTube channels for insights and opportunities
            </p>
          </div>
        </div>

        {/* Input Form */}
        <div className="space-y-6">
          <div>
            <label
              htmlFor="channelInput"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              YouTube Channel URL(s) or Handle(s)
            </label>
            <textarea
              id="channelInput"
              value={localChannelInput}
              onChange={(e) => setLocalChannelInput(e.target.value)}
              placeholder="Enter YouTube channel URLs, handles (@username), or channel names. You can add multiple channels separated by commas for comparison analysis."
              className="w-full h-32 p-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-400 resize-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
              disabled={isAnalyzingChannel}
            />
            <p className="text-slate-500 text-xs mt-2">
              Examples: @MrBeast, https://youtube.com/@channel, "Tech Review
              Channel"
            </p>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzingChannel || !localChannelInput.trim()}
              className="group relative px-8 py-4 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl disabled:shadow-none transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center space-x-3"
            >
              {isAnalyzingChannel ? (
                <>
                  <LoadingSpinner />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <SearchCircleIcon className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                  <span>
                    Analyze Channel
                    {localChannelInput.includes(",") ? "s" : ""}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isAnalyzingChannel && !parsedChannelAnalysis && (
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 shadow-2xl mb-6">
          <GeneratingContent message="🔍 Analyzing channels and gathering insights..." />
        </div>
      )}

      {/* Error State */}
      {channelAnalysisError && (
        <div className="bg-gradient-to-br from-red-500/20 to-pink-500/20 backdrop-blur-xl rounded-3xl border border-red-500/30 p-8 shadow-2xl mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-red-500/20 rounded-2xl">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-400" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-red-300 mb-2">
                Analysis Error
              </h4>
              <p className="text-red-200 text-sm">{channelAnalysisError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Summary */}
      {channelAnalysisSummary && !isSummarizingChannelAnalysis && (
        <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-xl rounded-3xl border border-indigo-500/30 p-8 shadow-2xl mb-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                <SparklesIcon className="h-8 w-8 text-white" />
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
            onClick={() => handleCopyToClipboard(channelAnalysisSummary)}
            className="group px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-3"
          >
            <ClipboardIcon className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            <span>Copy Summary</span>
          </button>
        </div>
      )}

      {/* Analysis Results */}
      {parsedChannelAnalysis &&
        !isAnalyzingChannel &&
        !isSummarizingChannelAnalysis && (
          <div className="flex-grow flex flex-col">
            {/* Action Buttons */}
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
                  onClick={onSummarizeAnalysis}
                  disabled={isSummarizingChannelAnalysis}
                  className="group px-5 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                >
                  {isSummarizingChannelAnalysis ? (
                    <>
                      <LoadingSpinner />
                      <span>Summarizing...</span>
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                      <span>AI Summary</span>
                    </>
                  )}
                </button>

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

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {parsedChannelAnalysis.map((section, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-slate-600/50"
                >
                  <div className="p-6">
                    {/* Section Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-br from-sky-500/20 to-cyan-500/20 rounded-lg">
                          {getSectionIcon(section.title)}
                        </div>
                        <h3 className="text-lg font-bold text-slate-200 line-clamp-2">
                          {section.title}
                        </h3>
                      </div>

                      <button
                        onClick={() => toggleSection(section.title)}
                        className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
                      >
                        <span
                          className={`transform transition-transform ${
                            expandedSections.has(section.title)
                              ? "rotate-180"
                              : ""
                          }`}
                        >
                          ▼
                        </span>
                      </button>
                    </div>

                    {/* Section Content */}
                    <div
                      className={`transition-all duration-300 ${
                        expandedSections.has(section.title)
                          ? ""
                          : "max-h-24 overflow-hidden"
                      }`}
                    >
                      <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                        {section.content}
                      </div>
                    </div>

                    {!expandedSections.has(section.title) &&
                      section.content.length > 150 && (
                        <div className="mt-2">
                          <button
                            onClick={() => toggleSection(section.title)}
                            className="text-sky-400 hover:text-sky-300 text-xs font-medium transition-colors"
                          >
                            Read more...
                          </button>
                        </div>
                      )}

                    {/* Ideas */}
                    {section.ideas && section.ideas.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-700/50">
                        <h4 className="text-sm font-semibold text-slate-300 mb-2 flex items-center space-x-2">
                          <LightBulbIcon className="h-4 w-4 text-yellow-400" />
                          <span>Action Items</span>
                        </h4>
                        <ul className="space-y-1">
                          {section.ideas.slice(0, 3).map((idea, ideaIndex) => (
                            <li
                              key={ideaIndex}
                              className="text-xs text-slate-400 flex items-start space-x-2"
                            >
                              <span className="text-sky-400 mt-1">•</span>
                              <span className="line-clamp-2">{idea}</span>
                            </li>
                          ))}
                          {section.ideas.length > 3 && (
                            <li className="text-xs text-slate-500">
                              +{section.ideas.length - 3} more ideas...
                            </li>
                          )}
                        </ul>
                      </div>
                    )}

                    {/* Sources */}
                    {section.sources && section.sources.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-700/50">
                        <h4 className="text-sm font-semibold text-slate-300 mb-2">
                          Sources
                        </h4>
                        <div className="space-y-1">
                          {section.sources
                            .slice(0, 2)
                            .map((source, sourceIndex) => (
                              <div
                                key={sourceIndex}
                                className="text-xs text-slate-400"
                              >
                                <a
                                  href={source.uri}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:text-sky-400 transition-colors line-clamp-1"
                                >
                                  {source.title}
                                </a>
                              </div>
                            ))}
                          {section.sources.length > 2 && (
                            <div className="text-xs text-slate-500">
                              +{section.sources.length - 2} more sources
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  );
};

export default ChannelAnalysisSection;
