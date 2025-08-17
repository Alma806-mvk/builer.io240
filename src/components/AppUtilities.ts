import {
  Platform,
  ContentType,
  GeneratedOutput,
  GeneratedTextOutput,
  GeneratedImageOutput,
  HistoryItem,
  ParsedChannelAnalysisSection,
  Source,
  TrendAnalysisOutput,
  TrendItem,
  ContentStrategyPlanOutput,
  EngagementFeedbackOutput,
} from "../../types";

// Constants
export const MAX_HISTORY_ITEMS = 50;
export const LOCAL_STORAGE_HISTORY_KEY = "socialContentAIStudio_history_v5";
export const LOCAL_STORAGE_TEMPLATES_KEY = "socialContentAIStudio_templates_v3";
export const LOCAL_STORAGE_CUSTOM_PERSONAS_KEY =
  "socialContentAIStudio_customPersonas_v1";
export const LOCAL_STORAGE_TREND_ANALYSIS_QUERIES_KEY =
  "socialContentAIStudio_trendQueries_v1";
export const LOCAL_STORAGE_CALENDAR_EVENTS_KEY =
  "socialContentAIStudio_calendarEvents_v1";
export const LOCAL_STORAGE_CANVAS_SNAPSHOTS_KEY =
  "socialContentAIStudio_canvasSnapshots_v1";
export const LOCAL_STORAGE_CANVAS_ITEMS_KEY =
  "socialContentAIStudio_canvasItems_v11";
export const LOCAL_STORAGE_CANVAS_VIEW_KEY =
  "socialContentAIStudio_canvasView_v1";
export const LOCAL_STORAGE_CANVAS_HISTORY_KEY =
  "socialContentAIStudio_canvasHistory_v1";

// Type guards
export const isGeneratedTextOutput = (
  output: any,
): output is GeneratedTextOutput => {
  return (
    output &&
    typeof output === "object" &&
    !Array.isArray(output) &&
    output.type === "text"
  );
};

export const isGeneratedImageOutput = (
  output: any,
): output is GeneratedImageOutput => {
  return (
    output &&
    typeof output === "object" &&
    !Array.isArray(output) &&
    output.type === "image"
  );
};

export const isContentStrategyPlanOutput = (
  output: any,
): output is ContentStrategyPlanOutput => {
  return (
    output &&
    typeof output === "object" &&
    "contentPillars" in output &&
    "keyThemes" in output
  );
};

export const isEngagementFeedbackOutput = (
  output: any,
): output is EngagementFeedbackOutput => {
  return (
    output &&
    typeof output === "object" &&
    output.type === "engagement_feedback"
  );
};

export const isTrendAnalysisOutput = (
  output: any,
): output is TrendAnalysisOutput => {
  return (
    output &&
    typeof output === "object" &&
    output.type === "trend_analysis" &&
    "query" in output &&
    Array.isArray((output as TrendAnalysisOutput).items)
  );
};

// JSON parsing utility
export const parseJsonSafely = <T>(jsonString: string): T | null => {
  let cleanJsonString = jsonString.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const matchResult = cleanJsonString.match(fenceRegex);
  if (matchResult && matchResult[2]) {
    cleanJsonString = matchResult[2].trim();
  }

  try {
    return JSON.parse(cleanJsonString) as T;
  } catch (parseError) {
    console.error(
      "Failed to parse JSON response:",
      parseError,
      "Original string:",
      jsonString.substring(0, 500) + (jsonString.length > 500 ? "..." : ""),
    );

    // Log additional details for debugging
    console.log("JSON string length:", jsonString.length);
    console.log("Clean JSON string length:", cleanJsonString.length);

    // Enhanced JSON fixing for various truncation scenarios
    console.log("Attempting to fix malformed/truncated JSON...");
    try {
      let fixedJson = cleanJsonString;

      // First, handle unterminated strings by finding the last complete string
      // Look for unterminated strings (strings that start with " but don't end with ")
      const stringPattern = /"[^"]*"?/g;
      let matches: RegExpMatchArray[] = [];
      let match;
      while ((match = stringPattern.exec(fixedJson)) !== null) {
        matches.push(match);
      }

      // Check if the last string is unterminated
      if (matches.length > 0) {
        const lastMatch = matches[matches.length - 1];
        const lastString = lastMatch[0];
        const lastIndex = lastMatch.index!;

        // If the last string doesn't end with a quote, it's unterminated
      if (!lastString.endsWith('"') && lastString.startsWith('"')) {
        console.log("Found unterminated string, truncating before it...");
        // Find the start of the property containing this unterminated string
        const beforeString = fixedJson.substring(0, lastIndex);
        const lastPropStart = beforeString.lastIndexOf(",");
        const lastObjStart = beforeString.lastIndexOf("{");

        // Truncate before the unterminated property or use the position before the unterminated string
        const truncateAt = Math.max(
          lastPropStart,
          lastObjStart,
          lastIndex - 1,
        );
        if (truncateAt > 0) {
          fixedJson = fixedJson.substring(0, truncateAt);
        }
      }

      // Also handle cases where JSON is cut mid-property name or mid-value
      // Look for incomplete patterns like: "propertyName": "value or "propertyName" without :
      const incompletePropertyPattern = /"[^"]*"(\s*:\s*"[^"]*)?$/;
      const incompleteMatch = fixedJson.match(incompletePropertyPattern);

      if (incompleteMatch) {
        console.log("Found incomplete property, truncating...");
        const matchIndex = fixedJson.lastIndexOf(incompleteMatch[0]);
        // Find the last complete property before this incomplete one
        const beforeIncomplete = fixedJson.substring(0, matchIndex);
        const lastComma = beforeIncomplete.lastIndexOf(",");
        const lastOpenBrace = beforeIncomplete.lastIndexOf("{");

        const truncateAt = Math.max(lastComma, lastOpenBrace);
        if (truncateAt >= 0) {
          fixedJson = fixedJson.substring(0, truncateAt === lastOpenBrace ? truncateAt + 1 : truncateAt);
        }
      }
      }

      // Remove any trailing incomplete content after the last complete field
      // Find the last complete property (ends with ", or } or ])
      const lastCompleteMatch = fixedJson.match(/.*[",}\]]\s*$/s);
      if (lastCompleteMatch) {
        fixedJson = lastCompleteMatch[0];
      }

      // Remove any trailing commas before closing braces
      fixedJson = fixedJson.replace(/,(\s*[}\]])/g, "$1");

      // Count open and close braces/brackets to balance them
      const openBraces = (fixedJson.match(/{/g) || []).length;
      const closeBraces = (fixedJson.match(/}/g) || []).length;
      const openBrackets = (fixedJson.match(/\[/g) || []).length;
      const closeBrackets = (fixedJson.match(/\]/g) || []).length;

      // Add missing close braces
      const missingCloseBraces = openBraces - closeBraces;
      for (let i = 0; i < missingCloseBraces; i++) {
        fixedJson += "}";
      }

      // Add missing close brackets
      const missingCloseBrackets = openBrackets - closeBrackets;
      for (let i = 0; i < missingCloseBrackets; i++) {
        fixedJson += "]";
      }

      console.log("Attempting to parse fixed JSON...");
      const parsed = JSON.parse(fixedJson) as T;
      console.log("✅ Successfully fixed and parsed truncated JSON");
      return parsed;
    } catch (fixError) {
      console.error("Failed to fix truncated JSON:", fixError);

      // Last resort: try to extract valid JSON from the beginning
      try {
        // Find the first complete object by matching balanced braces
        let braceCount = 0;
        let firstObjectEnd = -1;

        for (let i = 0; i < cleanJsonString.length; i++) {
          if (cleanJsonString[i] === "{") {
            braceCount++;
          } else if (cleanJsonString[i] === "}") {
            braceCount--;
            if (braceCount === 0) {
              firstObjectEnd = i;
              break;
            }
          }
        }

        if (firstObjectEnd > 0) {
          const extractedJson = cleanJsonString.substring(
            0,
            firstObjectEnd + 1,
          );
          console.log("Attempting to parse extracted complete object...");
          const parsed = JSON.parse(extractedJson) as T;
          console.log("✅ Successfully extracted and parsed partial JSON");
          return parsed;
        }
      } catch (extractError) {
        console.error("Failed to extract valid JSON:", extractError);
      }
    }

    return null;
  }
};

// Channel analysis utilities
export const CHANNEL_ANALYSIS_HEADINGS = [
  "**Overall Channel(s) Summary & Niche:**",
  "**Competitor Benchmarking Insights (if multiple channels provided):**",
  "**Audience Engagement Insights (Inferred from Search):**",
  "**Content Series & Playlist Recommendations:**",
  "**Format Diversification Suggestions:**",
  "**'Low-Hanging Fruit' Video Ideas (actionable & specific):**",
  "**Inferred Thumbnail & Title Optimization Patterns:**",
  "**Potential Content Gaps & Strategic Opportunities:**",
  "**Key SEO Keywords & Phrases (Tag Cloud Insights):**",
  "**Collaboration Theme Suggestions:**",
  "**Speculative Historical Content Evolution:**",
];

export const parseChannelAnalysisOutput = (
  text: string,
  groundingSources?: Source[],
): ParsedChannelAnalysisSection[] => {
  const sections: ParsedChannelAnalysisSection[] = [];

  // Safety check for undefined text
  if (!text) {
    return sections;
  }

  let fullText = text;

  for (let i = 0; i < CHANNEL_ANALYSIS_HEADINGS.length; i++) {
    const currentHeading = CHANNEL_ANALYSIS_HEADINGS[i];
    const startIndex = fullText.indexOf(currentHeading);

    if (startIndex === -1) continue;

    let endIndex = fullText.length;
    for (let j = i + 1; j < CHANNEL_ANALYSIS_HEADINGS.length; j++) {
      const nextHeadingCandidate = CHANNEL_ANALYSIS_HEADINGS[j];
      const nextHeadingIndex = fullText.indexOf(
        nextHeadingCandidate,
        startIndex + currentHeading.length,
      );
      if (nextHeadingIndex !== -1) {
        endIndex = nextHeadingIndex;
        break;
      }
    }

    const sectionTitle = currentHeading
      .replace(/\*\*/g, "")
      .replace(/:$/, "")
      .trim();
    let sectionContent = fullText
      .substring(startIndex + currentHeading.length, endIndex)
      .trim();

    const section: ParsedChannelAnalysisSection = {
      title: sectionTitle,
      content: sectionContent,
    };

    if (
      sectionTitle.includes("'Low-Hanging Fruit' Video Ideas") ||
      sectionTitle.includes("Potential Content Gaps & Strategic Opportunities")
    ) {
      section.ideas = sectionContent
        .split("\n")
        .map((line) => line.trim())
        .filter(
          (line) =>
            line.startsWith("- Video Idea:") ||
            line.startsWith("- Content Gap:"),
        )
        .map((line) => line.substring(line.indexOf(":") + 1).trim());
    }
    sections.push(section);
  }

  if (sections.length === 0 && text && text.trim().length > 0) {
    sections.push({ title: "General Analysis", content: text.trim() });
  }

  if (sections.length > 0 && groundingSources && groundingSources.length > 0) {
    let sourceAttached = false;
    const engagementSection = sections.find(
      (s) =>
        s.title.includes("Audience Engagement Insights") ||
        s.title.includes("Overall Channel(s) Summary"),
    );
    if (engagementSection) {
      engagementSection.sources = groundingSources;
      sourceAttached = true;
    }
    if (!sourceAttached && sections.length > 0) {
      sections[sections.length - 1].sources = groundingSources;
    }
  }
  return sections;
};

// Trend analysis utilities
export const parseTrendAnalysisText = (
  text: string,
  query: string,
  sources?: Source[],
): TrendAnalysisOutput => {
  // Extract executive summary
  const summaryMatch = text.match(
    /=== EXECUTIVE SUMMARY ===\s*([\s\S]*?)(?:=== TREND CARD|$)/i,
  );
  const executiveSummary = summaryMatch ? summaryMatch[1].trim() : "";

  // Extract trend cards
  const trendCards: any[] = [];
  const cardRegex =
    /=== TREND CARD (\d+) ===([\s\S]*?)(?:=== TREND CARD \d+|$)/gi;
  let cardMatch;

  while ((cardMatch = cardRegex.exec(text)) !== null) {
    const cardContent = cardMatch[2];

    // Parse trend name
    const nameMatch = cardContent.match(/📈 TREND NAME:\s*(.+)/i);
    const name = nameMatch ? nameMatch[1].trim() : `Trend ${cardMatch[1]}`;

    // Parse status
    const statusMatch = cardContent.match(/STATUS:\s*(.+)/i);
    const status = statusMatch
      ? statusMatch[1].replace(/[↗️⚡🔥↘️]/g, "").trim()
      : "Growing Fast";

    // Parse strategic insight
    const insightMatch = cardContent.match(
      /🧠 STRATEGIC INSIGHT:\s*([\s\S]*?)(?:\n🎯|$)/i,
    );
    const strategicInsight = insightMatch ? insightMatch[1].trim() : "";

    // Parse audience alignment
    const audienceMatch = cardContent.match(
      /🎯 AUDIENCE ALIGNMENT:\s*([\s\S]*?)(?:\n💡|$)/i,
    );
    const audienceAlignment = audienceMatch ? audienceMatch[1].trim() : "";

    // Parse content ideas
    const ideasMatch = cardContent.match(
      /💡 ACTIONABLE CONTENT IDEAS:\s*([\s\S]*?)(?:\n🔑|$)/i,
    );
    const contentIdeas: { type: string; title: string }[] = [];
    if (ideasMatch) {
      const ideaLines = ideasMatch[1]
        .split("\n")
        .filter((line) => line.trim().startsWith("-"));
      ideaLines.forEach((line) => {
        const ideaMatch = line.match(/-\s*(\w+(?:\/\w+)?):\s*(.+)/i);
        if (ideaMatch) {
          contentIdeas.push({
            type: ideaMatch[1].trim(),
            title: ideaMatch[2].trim(),
          });
        }
      });
    }

    // Parse keywords
    const keywordsMatch = cardContent.match(
      /Keywords:\s*([\s\S]*?)(?:\nHashtags|$)/i,
    );
    const keywords = keywordsMatch
      ? keywordsMatch[1]
          .split(",")
          .map((k) => k.trim())
          .filter((k) => k)
      : [];

    // Parse hashtags
    const hashtagsMatch = cardContent.match(
      /Hashtags:\s*([\s\S]*?)(?:\n🎬|$)/i,
    );
    const hashtags = hashtagsMatch
      ? hashtagsMatch[1]
          .split(/\s+/)
          .filter((h) => h.startsWith("#"))
          .map((h) => h.trim())
      : [];

    // Parse hook and angle
    const hookMatch = cardContent.match(
      /🎬 HOOK & ANGLE:\s*([\s\S]*?)(?:$|\n===)/i,
    );
    const hookAndAngle = hookMatch ? hookMatch[1].trim() : "";

    trendCards.push({
      id: `trend-${cardMatch[1]}`,
      name,
      status,
      strategicInsight,
      audienceAlignment,
      contentIdeas,
      keywords,
      hashtags,
      hookAndAngle,
    });
  }

  // Legacy support: try to parse old format if no cards found
  const items: TrendItem[] = [];
  if (trendCards.length === 0) {
    const itemRegex =
      /--- Trend Item Start ---\s*Title:\s*(.*?)\s*Snippet:\s*(.*?)\s*Source Type:\s*(news|discussion|topic|video)\s*(?:Link:\s*(.*?)\s*)?--- Trend Item End ---/gs;
    let match;
    while ((match = itemRegex.exec(text)) !== null) {
      items.push({
        title: match[1].trim(),
        snippet: match[2].trim(),
        sourceType: match[3].trim() as
          | "news"
          | "discussion"
          | "topic"
          | "video",
        link: match[4] ? match[4].trim() : undefined,
        volume: Math.floor(Math.random() * 1000) + 100,
        sentiment: Math.floor(Math.random() * 40) + 60,
      });
    }
  }

  // Calculate metrics
  const totalTrends = trendCards.length || items.length;
  const averageSentiment = 75; // Default for new format
  const growthRate = Math.random() * 20 - 5; // Random between -5% and 15%
  const totalReach = 2400000; // Default 2.4M
  const averageEngagement = Math.random() * 5 + 5; // Random between 5-10%

  // Generate basic competitor and region data
  const competitors =
    sources?.slice(0, 4).map((source, index) => ({
      name:
        new URL(source.uri).hostname.replace("www.", "").split(".")[0] ||
        `Competitor ${index + 1}`,
      mentions: Math.floor(Math.random() * 1000) + 200,
      sentiment: Math.floor(Math.random() * 20) + 65,
      marketShare: Math.floor(Math.random() * 30) + 10,
    })) || [];

  const regions = [
    {
      name: "North America",
      mentions: Math.floor(totalReach * 0.35),
      sentiment: averageSentiment + Math.random() * 10 - 5,
    },
    {
      name: "Europe",
      mentions: Math.floor(totalReach * 0.25),
      sentiment: averageSentiment + Math.random() * 10 - 5,
    },
    {
      name: "Asia Pacific",
      mentions: Math.floor(totalReach * 0.3),
      sentiment: averageSentiment + Math.random() * 10 - 5,
    },
    {
      name: "Other",
      mentions: Math.floor(totalReach * 0.1),
      sentiment: averageSentiment + Math.random() * 10 - 5,
    },
  ];

  return {
    type: "trend_analysis",
    query,
    items,
    groundingSources: sources,
    totalTrends,
    averageSentiment,
    growthRate,
    totalReach,
    averageEngagement,
    competitors,
    regions,
    // New trend card format
    executiveSummary,
    trendCards,
  };
};

// Content utilities
export const getContentPreview = (
  output: GeneratedOutput,
  maxLength: number = 100,
): string => {
  if (Array.isArray(output)) {
    return `${output.length} variations generated`;
  }

  if (typeof output === "object") {
    if (isGeneratedTextOutput(output)) {
      const content = output.content || "";
      return content.length > maxLength
        ? content.substring(0, maxLength) + "..."
        : content;
    }
    if (isGeneratedImageOutput(output)) {
      return "Generated image";
    }
    if (isContentStrategyPlanOutput(output)) {
      return `Strategy plan with ${output.contentPillars.length} pillars`;
    }
    if (isTrendAnalysisOutput(output)) {
      return `Trend analysis: ${output.items.length} trends found`;
    }
    if ("items" in output) {
      return `${(output as any).items.length} items`;
    }
  }

  return "Generated content";
};

// Date/time utilities
export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  } else if (diffMinutes > 0) {
    return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
  } else {
    return "Just now";
  }
};

export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString();
};

export const formatDateTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString();
};

// File utilities
export const downloadContent = (content: string, filename: string): void => {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadImage = (
  base64Data: string,
  mimeType: string,
  filename: string,
): void => {
  const link = document.createElement("a");
  link.href = `data:${mimeType};base64,${base64Data}`;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Clipboard utilities
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "absolute";
      textArea.style.left = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);
      return successful;
    }
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
};

// URL utilities
export const isValidUrl = (string: string): boolean => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

export const extractYouTubeChannelId = (input: string): string | null => {
  // Handle various YouTube URL formats and extract channel info
  const patterns = [
    /youtube\.com\/channel\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/c\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/user\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/@([a-zA-Z0-9_-]+)/,
    /^@([a-zA-Z0-9_-]+)$/,
  ];

  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
};

// Validation utilities
export const validateUserInput = (
  input: string,
  contentType: ContentType,
): string | null => {
  if (!input.trim()) {
    return "Please enter some content to generate.";
  }

  if (input.length < 3) {
    return "Please enter at least 3 characters.";
  }

  if (input.length > 5000) {
    return "Input is too long. Please keep it under 5000 characters.";
  }

  // Content type specific validations
  if (contentType === ContentType.ChannelAnalysis) {
    if (
      !input.includes("youtube") &&
      !input.includes("@") &&
      !input.includes("http")
    ) {
      return "Please enter a valid YouTube channel URL, handle, or name.";
    }
  }

  return null;
};

// Local storage utilities
export const saveToLocalStorage = (key: string, data: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Failed to save to localStorage (${key}):`, error);
  }
};

export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Failed to load from localStorage (${key}):`, error);
    return defaultValue;
  }
};

export const removeFromLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove from localStorage (${key}):`, error);
  }
};

// Array utilities
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const uniqueById = <T extends { id: string }>(array: T[]): T[] => {
  const seen = new Set<string>();
  return array.filter((item) => {
    if (seen.has(item.id)) {
      return false;
    }
    seen.add(item.id);
    return true;
  });
};

// Text utilities
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + "...";
};

export const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// Platform-specific utilities
export const getPlatformColor = (platform: Platform): string => {
  const colors: Record<Platform, string> = {
    Instagram: "#E4405F",
    Twitter: "#1DA1F2",
    Facebook: "#1877F2",
    LinkedIn: "#0A66C2",
    TikTok: "#FE2C55",
    YouTube: "#FF0000",
    Pinterest: "#BD081C",
    Snapchat: "#FFFC00",
    Reddit: "#FF4500",
    Discord: "#5865F2",
    Telegram: "#0088CC",
    WhatsApp: "#25D366",
  };
  return colors[platform] || "#6B7280";
};

export const getPlatformIcon = (platform: Platform): string => {
  const icons: Record<Platform, string> = {
    Instagram: "📷",
    Twitter: "🐦",
    Facebook: "📘",
    LinkedIn: "💼",
    TikTok: "🎵",
    YouTube: "📺",
    Pinterest: "📌",
    Snapchat: "👻",
    Reddit: "🤖",
    Discord: "💬",
    Telegram: "✈️",
    WhatsApp: "💚",
  };
  return icons[platform] || "📱";
};
