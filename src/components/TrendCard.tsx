import React, { useState } from "react";
import {
  TrendingUpIcon,
  TrendingDownIcon,
  SparklesIcon,
  LightBulbIcon,
  HashtagIcon,
  FilmIcon,
  ArrowRightIcon,
  CopyIcon,
  CheckIcon,
  CalendarDaysIcon,
} from "./IconComponents";

export interface TrendCardData {
  id: string;
  name: string;
  status: "Growing Fast" | "Emerging" | "At Peak" | "Fading";
  strategicInsight: string;
  audienceAlignment: string;
  contentIdeas: {
    type: string;
    title: string;
  }[];
  keywords: string[];
  hashtags: string[];
  hookAndAngle: string;
}

interface TrendCardProps {
  trend: TrendCardData;
  onGenerateScript?: (idea: { type: string; title: string }) => void;
  onSwitchToGenerator?: (contentType: string, title: string) => void;
  onSendToCalendar?: (idea: { type: string; title: string; trend: string }) => void;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Growing Fast":
      return <TrendingUpIcon className="h-4 w-4 text-emerald-400" />;
    case "Emerging":
      return <SparklesIcon className="h-4 w-4 text-blue-400" />;
    case "At Peak":
      return (
        <div className="h-4 w-4 bg-orange-400 rounded-full animate-pulse" />
      );
    case "Fading":
      return <TrendingDownIcon className="h-4 w-4 text-red-400" />;
    default:
      return <TrendingUpIcon className="h-4 w-4 text-gray-400" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Growing Fast":
      return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
    case "Emerging":
      return "text-blue-400 bg-blue-400/10 border-blue-400/20";
    case "At Peak":
      return "text-orange-400 bg-orange-400/10 border-orange-400/20";
    case "Fading":
      return "text-red-400 bg-red-400/10 border-red-400/20";
    default:
      return "text-gray-400 bg-gray-400/10 border-gray-400/20";
  }
};

const getStatusEmoji = (status: string) => {
  switch (status) {
    case "Growing Fast":
      return "↗️";
    case "Emerging":
      return "⚡";
    case "At Peak":
      return "🔥";
    case "Fading":
      return "↘️";
    default:
      return "📈";
  }
};

export const TrendCard: React.FC<TrendCardProps> = ({
  trend,
  onGenerateScript,
  onSwitchToGenerator,
  onSendToCalendar,
}) => {
  const [copiedKeywords, setCopiedKeywords] = useState(false);
  const [copiedHashtags, setCopiedHashtags] = useState(false);

  const copyToClipboard = async (
    text: string,
    type: "keywords" | "hashtags",
  ) => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "keywords") {
        setCopiedKeywords(true);
        setTimeout(() => setCopiedKeywords(false), 2000);
      } else {
        setCopiedHashtags(true);
        setTimeout(() => setCopiedHashtags(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/60 rounded-2xl border border-slate-700/50 backdrop-blur-sm hover:border-slate-600/50 transition-all duration-300 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-700/30">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-3 leading-tight">
              📈 {trend.name}
            </h3>
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(trend.status)}`}
            >
              {getStatusIcon(trend.status)}
              <span>
                Status: {trend.status} {getStatusEmoji(trend.status)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Strategic Insight */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-500/20 rounded-lg">
              <LightBulbIcon className="h-4 w-4 text-purple-400" />
            </div>
            <h4 className="font-semibold text-white">🧠 Strategic Insight</h4>
          </div>
          <p className="text-slate-300 leading-relaxed pl-7">
            {trend.strategicInsight}
          </p>
        </div>

        {/* Audience Alignment */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-500/20 rounded-lg">
              <span className="text-blue-400 text-sm">🎯</span>
            </div>
            <h4 className="font-semibold text-white">🎯 Audience Alignment</h4>
          </div>
          <p className="text-slate-300 leading-relaxed pl-7">
            {trend.audienceAlignment}
          </p>
        </div>

        {/* Content Ideas */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-500/20 rounded-lg">
              <FilmIcon className="h-4 w-4 text-emerald-400" />
            </div>
            <h4 className="font-semibold text-white">
              💡 Actionable Content Ideas
            </h4>
          </div>
          <div className="pl-7 space-y-2">
            {trend.contentIdeas.map((idea, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/30 hover:border-slate-600/50 transition-colors"
              >
                <div className="flex-1">
                  <span className="text-sm font-medium text-blue-400 uppercase tracking-wide">
                    {idea.type}:
                  </span>
                  <span className="text-white ml-2">{idea.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  {onSendToCalendar && (
                    <button
                      onClick={() => onSendToCalendar({ ...idea, trend: trend.name })}
                      className="flex items-center gap-1 px-2 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 rounded-lg text-emerald-300 text-xs font-medium transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/25"
                      title="Add to Calendar"
                    >
                      <CalendarDaysIcon className="h-3 w-3" />
                      Calendar
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (onGenerateScript) {
                        onGenerateScript(idea);
                      } else if (onSwitchToGenerator) {
                        // Map content types to actual ContentType enum values
                        const contentTypeMap: { [key: string]: string } = {
                          Video: "Text",
                          Shorts: "Text",
                          Reel: "Text",
                          "Social Post": "Text",
                          Post: "Text",
                          Article: "Text",
                          Blog: "Text",
                          Story: "Text",
                        };
                        const mappedType = contentTypeMap[idea.type] || "Text";
                        onSwitchToGenerator(mappedType, idea.title);
                      }
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg text-white text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25"
                  >
                    <SparklesIcon className="h-3 w-3" />
                    Generate Script
                    <ArrowRightIcon className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Keywords & Hashtags */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-500/20 rounded-lg">
              <HashtagIcon className="h-4 w-4 text-amber-400" />
            </div>
            <h4 className="font-semibold text-white">🔑 Keywords & Hashtags</h4>
          </div>

          <div className="pl-7 space-y-3">
            {/* Keywords */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-400">
                  Keywords (for YouTube/SEO):
                </span>
                <button
                  onClick={() =>
                    copyToClipboard(trend.keywords.join(", "), "keywords")
                  }
                  className="flex items-center gap-1 px-2 py-1 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  {copiedKeywords ? (
                    <CheckIcon className="h-3 w-3" />
                  ) : (
                    <CopyIcon className="h-3 w-3" />
                  )}
                  {copiedKeywords ? "Copied!" : "Copy"}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {trend.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded border border-slate-600/30"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            {/* Hashtags */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-400">
                  Hashtags (for Social):
                </span>
                <button
                  onClick={() =>
                    copyToClipboard(trend.hashtags.join(" "), "hashtags")
                  }
                  className="flex items-center gap-1 px-2 py-1 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  {copiedHashtags ? (
                    <CheckIcon className="h-3 w-3" />
                  ) : (
                    <CopyIcon className="h-3 w-3" />
                  )}
                  {copiedHashtags ? "Copied!" : "Copy"}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {trend.hashtags.map((hashtag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded border border-blue-500/30"
                  >
                    {hashtag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Hook & Angle */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-pink-500/20 rounded-lg">
              <span className="text-pink-400 text-sm">🎬</span>
            </div>
            <h4 className="font-semibold text-white">
              🎬 Hook & Angle Suggestions
            </h4>
          </div>
          <div className="pl-7 p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-lg border border-pink-500/20">
            <p className="text-slate-300 leading-relaxed">
              {trend.hookAndAngle}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendCard;
