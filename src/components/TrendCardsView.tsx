import React, { useState } from "react";
import { TrendAnalysisOutput } from "../types";
import TrendCard, { TrendCardData } from "./TrendCard";
import {
  SparklesIcon,
  DocumentTextIcon,
  TrendingUpIcon,
  EyeIcon,
  ClipboardIcon,
  CheckIcon,
} from "./IconComponents";

interface TrendCardsViewProps {
  trendData: TrendAnalysisOutput | null;
  onSwitchToGenerator?: (contentType: string, title: string) => void;
  onCopyToClipboard?: (text: string) => void;
  onSendToCalendar?: (idea: { type: string; title: string; trend: string }) => void;
}

export const TrendCardsView: React.FC<TrendCardsViewProps> = ({
  trendData,
  onSwitchToGenerator,
  onCopyToClipboard,
  onSendToCalendar,
}) => {
  const [copiedSummary, setCopiedSummary] = useState(false);

  const copyExecutiveSummary = async () => {
    if (!trendData?.executiveSummary || !onCopyToClipboard) return;

    try {
      onCopyToClipboard(trendData.executiveSummary);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2000);
    } catch (err) {
      console.error("Failed to copy executive summary: ", err);
    }
  };

  if (!trendData) {
    return (
      <div className="min-h-[600px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto">
            <TrendingUpIcon className="h-10 w-10 text-slate-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No Trend Analysis Yet
            </h3>
            <p className="text-slate-400 max-w-md">
              Generate a trend analysis to see strategic insights, content
              opportunities, and actionable trend cards.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If we have trend cards, show the new format
  if (trendData.trendCards && trendData.trendCards.length > 0) {
    return (
      <div className="space-y-8">
        {/* Executive Summary */}
        {trendData.executiveSummary && (
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-2xl border border-blue-500/20 p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <DocumentTextIcon className="h-5 w-5 text-blue-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    📊 Executive Summary
                  </h2>
                </div>
                <p className="text-slate-200 leading-relaxed text-lg">
                  {trendData.executiveSummary}
                </p>
              </div>
              <button
                onClick={copyExecutiveSummary}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-blue-300 text-sm transition-colors"
              >
                {copiedSummary ? (
                  <CheckIcon className="h-4 w-4" />
                ) : (
                  <ClipboardIcon className="h-4 w-4" />
                )}
                {copiedSummary ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <TrendingUpIcon className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Trend Opportunities</p>
                <p className="text-2xl font-bold text-emerald-300">
                  {trendData.trendCards.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <SparklesIcon className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Content Ideas</p>
                <p className="text-2xl font-bold text-purple-300">
                  {trendData.trendCards.reduce(
                    (total, card) => total + (card.contentIdeas?.length || 0),
                    0,
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <EyeIcon className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Strategic Insights</p>
                <p className="text-2xl font-bold text-amber-300">
                  {
                    trendData.trendCards.filter((card) => card.strategicInsight)
                      .length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Trend Cards Grid */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg">
              <TrendingUpIcon className="h-5 w-5 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              🚀 Strategic Trend Opportunities
            </h2>
          </div>

          <div className="grid gap-6">
            {trendData.trendCards.map((card, index) => (
              <TrendCard
                key={card.id}
                trend={card as TrendCardData}
                onSwitchToGenerator={onSwitchToGenerator}
                onSendToCalendar={onSendToCalendar}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Fallback to old format if no trend cards
  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      {trendData.executiveSummary && (
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-2xl border border-blue-500/20 p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <DocumentTextIcon className="h-5 w-5 text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-white">
                  📊 Executive Summary
                </h2>
              </div>
              <p className="text-slate-200 leading-relaxed text-lg">
                {trendData.executiveSummary}
              </p>
            </div>
            <button
              onClick={copyExecutiveSummary}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-blue-300 text-sm transition-colors"
            >
              {copiedSummary ? (
                <CheckIcon className="h-4 w-4" />
              ) : (
                <ClipboardIcon className="h-4 w-4" />
              )}
              {copiedSummary ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      )}

      {/* Basic Trend Display */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">📈 Trends Analysis</h2>
        {trendData.items && trendData.items.length > 0 ? (
          <div className="grid gap-4">
            {trendData.items.map((item, index) => (
              <div
                key={index}
                className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-4 hover:border-slate-600/50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-white mb-2">
                  {item.title || `Trend ${index + 1}`}
                </h3>
                {item.description && (
                  <p className="text-slate-300 mb-3">{item.description}</p>
                )}
                {item.volume && (
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <span>Search Volume:</span>
                    <span className="text-emerald-400 font-medium">
                      {item.volume}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-400">No trend data available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendCardsView;
