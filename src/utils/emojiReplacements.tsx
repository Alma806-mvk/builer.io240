import React from "react";
import {
  EmojiIcons,
  StatusIndicators,
  TextEmoji,
} from "../components/ConsistentIcons";

// Comprehensive emoji to consistent component mapping
export const emojiMap = {
  // Business & Professional
  "💼": ({ size = 16, className = "" }) => (
    <EmojiIcons.briefcase size={size} className={className} />
  ),
  "✨": ({ size = 16, className = "" }) => (
    <EmojiIcons.sparkles size={size} className={className} />
  ),
  "🏢": ({ size = 16, className = "" }) => (
    <EmojiIcons.building size={size} className={className} />
  ),
  "🎨": ({ size = 16, className = "" }) => (
    <EmojiIcons.palette size={size} className={className} />
  ),
  "📊": ({ size = 16, className = "" }) => (
    <EmojiIcons.chart size={size} className={className} />
  ),
  "💰": ({ size = 16, className = "" }) => (
    <EmojiIcons.dollar size={size} className={className} />
  ),
  "📈": ({ size = 16, className = "" }) => (
    <EmojiIcons.trendingUp size={size} className={className} />
  ),
  "🚀": ({ size = 16, className = "" }) => (
    <EmojiIcons.rocket size={size} className={className} />
  ),

  // Development & Technology
  "🐛": ({ size = 16, className = "" }) => (
    <EmojiIcons.bug size={size} className={className} />
  ),
  "⭐": ({ size = 16, className = "" }) => (
    <EmojiIcons.star size={size} className={className} />
  ),
  "🎯": ({ size = 16, className = "" }) => (
    <EmojiIcons.target size={size} className={className} />
  ),
  "🔥": ({ size = 16, className = "" }) => (
    <EmojiIcons.fire size={size} className={className} />
  ),
  "⚡": ({ size = 16, className = "" }) => (
    <EmojiIcons.bolt size={size} className={className} />
  ),
  "☕": ({ size = 16, className = "" }) => (
    <EmojiIcons.coffee size={size} className={className} />
  ),
  "💎": ({ size = 16, className = "" }) => (
    <EmojiIcons.diamond size={size} className={className} />
  ),
  "🔧": ({ size = 16, className = "" }) => (
    <EmojiIcons.wrench size={size} className={className} />
  ),

  // Documents & Content
  "📝": ({ size = 16, className = "" }) => (
    <EmojiIcons.pen size={size} className={className} />
  ),
  "📄": ({ size = 16, className = "" }) => (
    <EmojiIcons.document size={size} className={className} />
  ),
  "📖": ({ size = 16, className = "" }) => (
    <EmojiIcons.book size={size} className={className} />
  ),
  "📋": ({ size = 16, className = "" }) => (
    <EmojiIcons.document size={size} className={className} />
  ),
  "🖌️": ({ size = 16, className = "" }) => (
    <EmojiIcons.brush size={size} className={className} />
  ),

  // Status & Priority Indicators
  "✅": ({ className = "" }) => (
    <StatusIndicators.status.done className={className} />
  ),
  "❌": ({ className = "" }) => <TextEmoji.cross className={className} />,
  "⚠️": ({ size = 16, className = "" }) => (
    <EmojiIcons.warning size={size} className={className} />
  ),
  "🚨": ({ className = "" }) => (
    <StatusIndicators.priority.urgent className={className} />
  ),

  // Arrows & Directions
  "⬆️": ({ className = "" }) => (
    <TextEmoji.arrow direction="up" className={className} />
  ),
  "⬇️": ({ className = "" }) => (
    <TextEmoji.arrow direction="down" className={className} />
  ),
  "➡️": ({ className = "" }) => (
    <TextEmoji.arrow direction="right" className={className} />
  ),
  "⬅️": ({ className = "" }) => (
    <TextEmoji.arrow direction="left" className={className} />
  ),

  // Devices & Technology
  "📱": ({ size = 16, className = "" }) => (
    <EmojiIcons.mobile size={size} className={className} />
  ),
  "💻": ({ className = "" }) => (
    <span className={`emoji-icon ${className}`}>💻</span>
  ),
  "🗄️": ({ size = 16, className = "" }) => (
    <EmojiIcons.database size={size} className={className} />
  ),
  "🛡️": ({ size = 16, className = "" }) => (
    <EmojiIcons.shield size={size} className={className} />
  ),

  // Common UI Elements with fallback to styled spans
  "🔍": ({ className = "" }) => (
    <span className={`emoji-icon ${className}`}>🔍</span>
  ),
  "⚙️": ({ className = "" }) => (
    <span className={`emoji-icon ${className}`}>⚙️</span>
  ),
  "💳": ({ className = "" }) => (
    <span className={`emoji-icon ${className}`}>💳</span>
  ),
  "📷": ({ className = "" }) => (
    <span className={`emoji-icon ${className}`}>📷</span>
  ),
  "🌐": ({ className = "" }) => (
    <span className={`emoji-icon ${className}`}>🌐</span>
  ),
  "📅": ({ className = "" }) => (
    <span className={`emoji-icon ${className}`}>📅</span>
  ),
};

// Priority level mappings
export const priorityMap = {
  "⬇️": "low",
  "➡️": "medium",
  "⬆️": "high",
  "🚨": "urgent",
  "🔥": "critical",
};

// Status mappings
export const statusMap = {
  "📝": "todo",
  "⚡": "in-progress",
  "👀": "review",
  "🧪": "testing",
  "✅": "done",
  "🚫": "blocked",
};

// Type mappings
export const typeMap = {
  "✅": "task",
  "🐛": "bug",
  "⭐": "feature",
  "🎯": "epic",
  "📖": "story",
  "📈": "improvement",
  "🔍": "research",
};

// React component for rendering individual emojis consistently
export const ConsistentEmoji: React.FC<{
  emoji: string;
  size?: number;
  className?: string;
}> = ({ emoji, size = 16, className = "" }) => {
  const EmojiComponent = emojiMap[emoji as keyof typeof emojiMap];

  if (EmojiComponent) {
    return <EmojiComponent size={size} className={className} />;
  }

  // Fallback to styled emoji span
  return <span className={`emoji-icon ${className}`}>{emoji}</span>;
};

// Priority component renderer
export const PriorityIndicator: React.FC<{
  priority: "low" | "medium" | "high" | "urgent" | "critical";
  className?: string;
}> = ({ priority, className = "" }) => {
  const Component = StatusIndicators.priority[priority];
  return <Component className={className} />;
};

// Status component renderer
export const StatusIndicator: React.FC<{
  status: "todo" | "inProgress" | "review" | "done" | "blocked";
  className?: string;
}> = ({ status, className = "" }) => {
  const Component =
    StatusIndicators.status[status === "inProgress" ? "inProgress" : status];
  return <Component className={className} />;
};

// Helper function to get consistent emoji replacement
export const getConsistentEmoji = (
  emoji: string,
  options: { size?: number; className?: string } = {},
) => {
  const { size = 16, className = "" } = options;
  return <ConsistentEmoji emoji={emoji} size={size} className={className} />;
};
