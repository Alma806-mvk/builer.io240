import React, { useState, useMemo } from "react";
import {
  HistoryItem,
  Platform,
  ContentType,
  GeneratedOutput,
} from "../../types";

import {
  ListChecksIcon,
  TrashIcon,
  StarIcon,
  ClipboardIcon,
  SearchIcon,
  FilterIcon,
  ClockIcon,
  EyeIcon,
} from "../IconComponents";

import RatingButtons from "./ui/RatingButtons";

interface HistorySectionProps {
  history: HistoryItem[];
  viewingHistoryItemId: string | null;
  copied: boolean;

  // Actions
  deleteHistoryItem: (id: string) => void;
  clearHistory: () => void;
  setViewingHistoryItemId: (id: string | null) => void;
  setCopied: (copied: boolean) => void;
  handleCopyToClipboard: (text: string) => void;
  toggleHistoryItemFavorite: (id: string) => void;
  updateItemRating?: (id: string, rating: 1 | -1 | 0) => void;
}

export const HistorySection: React.FC<HistorySectionProps> = ({
  history,
  viewingHistoryItemId,
  copied,
  deleteHistoryItem,
  clearHistory,
  setViewingHistoryItemId,
  setCopied,
  handleCopyToClipboard,
  toggleHistoryItemFavorite,
  updateItemRating,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlatformFilter, setSelectedPlatformFilter] = useState<
    Platform | "all"
  >("all");
  const [selectedContentTypeFilter, setSelectedContentTypeFilter] = useState<
    ContentType | "all"
  >("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Filter and search history
  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
          item.userInput.toLowerCase().includes(searchLower) ||
          (typeof item.output === "object" &&
            "content" in item.output &&
            item.output.content?.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      // Platform filter
      if (
        selectedPlatformFilter !== "all" &&
        item.platform !== selectedPlatformFilter
      ) {
        return false;
      }

      // Content type filter
      if (
        selectedContentTypeFilter !== "all" &&
        item.contentType !== selectedContentTypeFilter
      ) {
        return false;
      }

      // Favorites filter
      if (showFavoritesOnly && !item.isFavorite) {
        return false;
      }

      return true;
    });
  }, [
    history,
    searchTerm,
    selectedPlatformFilter,
    selectedContentTypeFilter,
    showFavoritesOnly,
  ]);

  // Get unique platforms and content types for filters
  const availablePlatforms = useMemo(() => {
    const platforms = new Set(history.map((item) => item.platform));
    return Array.from(platforms);
  }, [history]);

  const availableContentTypes = useMemo(() => {
    const types = new Set(history.map((item) => item.contentType));
    return Array.from(types);
  }, [history]);

  const formatTimestamp = (timestamp: number) => {
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

  const getOutputPreview = (output: GeneratedOutput): string => {
    if (Array.isArray(output)) {
      return `${output.length} variations generated`;
    }

    if (typeof output === "object") {
      if ("content" in output) {
        return (
          output.content?.substring(0, 100) +
            (output.content?.length > 100 ? "..." : "") || ""
        );
      }
      if ("type" in output && output.type === "image") {
        return "Generated image";
      }
      if ("items" in output) {
        return `${(output as any).items.length} items`;
      }
    }

    return "Generated content";
  };

  if (history.length === 0) {
    return (
      <div className="flex-grow flex flex-col">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 shadow-2xl">
          <div className="flex items-center space-x-4 mb-8">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-lg">
              <ListChecksIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
                Content History
              </h2>
              <p className="text-slate-300 text-lg">
                Your generated content will appear here
              </p>
            </div>
          </div>

          <div className="text-center py-16">
            <div className="mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-slate-700 to-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <ListChecksIcon className="h-12 w-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-300 mb-4">
                No Content Yet
              </h3>
              <p className="text-slate-400 max-w-md mx-auto leading-relaxed">
                Start creating content with the Generator tab and your generated
                content will be saved here for easy access.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col">
      {/* History Header */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 shadow-2xl mb-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-lg">
              <ListChecksIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
                Content History
              </h2>
              <p className="text-slate-300 text-lg">
                {filteredHistory.length} of {history.length} items
              </p>
            </div>
          </div>

          <button
            onClick={clearHistory}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
          >
            <TrashIcon className="h-4 w-4" />
            <span>Clear All</span>
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Search */}
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          {/* Platform Filter */}
          <select
            value={selectedPlatformFilter}
            onChange={(e) =>
              setSelectedPlatformFilter(e.target.value as Platform | "all")
            }
            className="w-full p-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          >
            <option value="all">All Platforms</option>
            {availablePlatforms.map((platform) => (
              <option key={platform} value={platform}>
                {platform}
              </option>
            ))}
          </select>

          {/* Content Type Filter */}
          <select
            value={selectedContentTypeFilter}
            onChange={(e) =>
              setSelectedContentTypeFilter(
                e.target.value as ContentType | "all",
              )
            }
            className="w-full p-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          >
            <option value="all">All Types</option>
            {availableContentTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          {/* Favorites Toggle */}
          <label className="flex items-center space-x-2 text-slate-300">
            <input
              type="checkbox"
              checked={showFavoritesOnly}
              onChange={(e) => setShowFavoritesOnly(e.target.checked)}
              className="rounded border-slate-600 bg-slate-700 text-amber-500 focus:ring-amber-500"
            />
            <StarIcon className="h-4 w-4" />
            <span>Favorites Only</span>
          </label>
        </div>
      </div>

      {/* History List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredHistory.map((item) => (
          <div
            key={item.id}
            className={`bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl border shadow-xl transition-all duration-300 hover:shadow-2xl ${
              viewingHistoryItemId === item.id
                ? "border-amber-500/50 ring-2 ring-amber-500/20"
                : "border-slate-700/50 hover:border-slate-600/50"
            }`}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-grow">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="px-3 py-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 text-xs font-medium rounded-full border border-amber-500/30">
                      {item.platform}
                    </span>
                    <span className="px-3 py-1 bg-slate-700/50 text-slate-300 text-xs font-medium rounded-full">
                      {item.contentType}
                    </span>
                    {item.isFavorite && (
                      <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-slate-200 mb-2 line-clamp-2">
                    {item.userInput}
                  </h3>

                  <p className="text-slate-400 text-sm line-clamp-3">
                    {getOutputPreview(item.output)}
                  </p>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {/* Rating Buttons */}
                  {updateItemRating && (
                    <RatingButtons
                      rating={item.rating}
                      onRating={(rating) => updateItemRating(item.id, rating)}
                      size="sm"
                      showTooltip={true}
                    />
                  )}

                  <button
                    onClick={() => toggleHistoryItemFavorite(item.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      item.isFavorite
                        ? "text-yellow-400 hover:text-yellow-300"
                        : "text-slate-400 hover:text-yellow-400"
                    }`}
                    title={
                      item.isFavorite
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                  >
                    <StarIcon
                      className={`h-4 w-4 ${item.isFavorite ? "fill-current" : ""}`}
                    />
                  </button>

                  <button
                    onClick={() =>
                      setViewingHistoryItemId(
                        viewingHistoryItemId === item.id ? null : item.id,
                      )
                    }
                    className="p-2 text-slate-400 hover:text-slate-200 rounded-lg transition-colors"
                    title="View details"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => deleteHistoryItem(item.id)}
                    className="p-2 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                    title="Delete item"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Metadata */}
              <div className="flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <ClockIcon className="h-3 w-3" />
                    <span>{formatTimestamp(item.timestamp)}</span>
                  </div>

                  {item.targetAudience && (
                    <span>Target: {item.targetAudience}</span>
                  )}

                  {item.batchVariations && (
                    <span>{item.batchVariations} variations</span>
                  )}
                </div>

                <button
                  onClick={() => {
                    const textContent =
                      typeof item.output === "object" &&
                      "content" in item.output
                        ? item.output.content || ""
                        : JSON.stringify(item.output);
                    handleCopyToClipboard(textContent);
                  }}
                  className="flex items-center space-x-1 px-2 py-1 text-slate-400 hover:text-slate-200 transition-colors"
                  title="Copy content"
                >
                  <ClipboardIcon className="h-3 w-3" />
                  <span>{copied ? "Copied!" : "Copy"}</span>
                </button>
              </div>

              {/* Expanded View */}
              {viewingHistoryItemId === item.id && (
                <div className="mt-6 pt-6 border-t border-slate-700/50">
                  <div className="bg-slate-800/30 rounded-xl p-4">
                    {typeof item.output === "object" &&
                    "content" in item.output ? (
                      <div className="prose prose-invert max-w-none">
                        <div className="whitespace-pre-wrap text-slate-200 leading-relaxed">
                          {item.output.content}
                        </div>
                      </div>
                    ) : (
                      <pre className="text-slate-200 text-sm overflow-x-auto">
                        {JSON.stringify(item.output, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredHistory.length === 0 && history.length > 0 && (
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 shadow-2xl text-center">
          <div className="w-16 h-16 bg-slate-700/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FilterIcon className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-300 mb-2">
            No Results Found
          </h3>
          <p className="text-slate-400">
            Try adjusting your filters or search terms to find what you're
            looking for.
          </p>
        </div>
      )}
    </div>
  );
};

export default HistorySection;
