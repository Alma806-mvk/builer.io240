import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HistoryItem, ContentType } from "../../types";
import { CONTENT_TYPES } from "../../constants";
import {
  TrashIcon,
  StarIcon,
  PlusCircleIcon,
  ClockIcon,
  TagIcon,
} from "./IconComponents";
import {
  Button,
  Card,
  Input,
  Badge,
  EmptyState,
  GradientText,
  LoadingSpinner
} from "./ui/WorldClassComponents";
import "../styles/generatorSidebarEnhancements.css";

// Simple search icon component since SearchIcon might not exist
const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

interface GeneratorSidebarProps {
  history: HistoryItem[];
  viewingHistoryItemId: string | null;
  onViewHistoryItem: (item: HistoryItem) => void;
  onToggleFavorite: (id: string) => void;
  onPinToCanvas: (item: HistoryItem) => void;
  onDeleteHistoryItem: (id: string) => void;
  onClearAppHistory: () => void;
}

export const GeneratorSidebar: React.FC<GeneratorSidebarProps> = ({
  history,
  viewingHistoryItemId,
  onViewHistoryItem,
  onToggleFavorite,
  onPinToCanvas,
  onDeleteHistoryItem,
  onClearAppHistory,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "favorites" | "recent">("all");

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      ...(diffDays > 365 ? { year: "numeric" } : {}),
    });
  };

  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Filter and search history
  const filteredHistory = React.useMemo(() => {
    let filtered = history.filter((item) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesInput = item.userInput.toLowerCase().includes(query);
        const matchesType = item.contentType.toLowerCase().includes(query);
        const matchesPlatform = item.platform.toLowerCase().includes(query);
        if (!matchesInput && !matchesType && !matchesPlatform) return false;
      }

      // Category filter
      switch (filter) {
        case "favorites":
          return item.isFavorite;
        case "recent":
          const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
          return item.timestamp > dayAgo;
        default:
          return true;
      }
    });

    // Sort by newest first
    return filtered.sort((a, b) => b.timestamp - a.timestamp);
  }, [history, searchQuery, filter]);

  const favoriteCount = history.filter((item) => item.isFavorite).length;
  const recentCount = history.filter((item) => {
    const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
    return item.timestamp > dayAgo;
  }).length;

  const FilterButton = ({ 
    isActive, 
    onClick, 
    children, 
    variant = "secondary",
    icon 
  }: { 
    isActive: boolean;
    onClick: () => void;
    children: React.ReactNode;
    variant?: "primary" | "secondary" | "warning";
    icon?: React.ReactNode;
  }) => (
    <motion.button
      onClick={onClick}
      className={`
        btn-base flex-1 text-xs relative overflow-hidden
        ${isActive 
          ? variant === "primary" 
            ? "bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] text-white border-[var(--brand-primary)] glow-primary" 
            : variant === "warning"
            ? "bg-gradient-to-r from-[var(--color-warning)] to-[#ea580c] text-white border-[var(--color-warning)]"
            : "bg-[var(--surface-tertiary)] text-[var(--text-primary)] border-[var(--border-secondary)]"
          : "bg-[var(--surface-secondary)] text-[var(--text-tertiary)] border-[var(--border-primary)]"
        }
      `}
      whileHover={!isActive ? { 
        backgroundColor: "var(--surface-tertiary)",
        borderColor: "var(--border-secondary)",
        color: "var(--text-secondary)",
        scale: 1.02
      } : { scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
    >
      <div className="flex items-center gap-1.5">
        {icon && <span className="w-3 h-3">{icon}</span>}
        {children}
      </div>
    </motion.button>
  );

  return (
    <div className="flex flex-col h-full sidebar-backdrop generator-sidebar-mobile">
      {/* Header */}
      <div className="p-6 border-b border-[var(--border-primary)] bg-gradient-to-br from-[var(--surface-secondary)] to-[var(--surface-tertiary)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)] text-white shadow-lg glow-primary">
              📚
            </div>
            <div>
              <h3 className="heading-4 mb-0">
                <GradientText>Content History</GradientText>
              </h3>
            </div>
          </div>
          <Badge variant="info" className="px-3 py-1">
            {history.length}
          </Badge>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-[var(--border-primary)]">
        <Input
          placeholder="Search history..."
          value={searchQuery}
          onChange={setSearchQuery}
          icon={<SearchIcon />}
          className="search-input-enhanced bg-[var(--surface-tertiary)] border-[var(--border-primary)] focus:border-[var(--brand-primary)]"
        />
      </div>

      {/* Filters */}
      <div className="p-4 border-b border-[var(--border-primary)] bg-[var(--surface-secondary)]">
        <div className="flex gap-2 filter-buttons-mobile">
          <FilterButton
            isActive={filter === "all"}
            onClick={() => setFilter("all")}
            variant="primary"
          >
            All ({history.length})
          </FilterButton>
          
          <FilterButton
            isActive={filter === "favorites"}
            onClick={() => setFilter("favorites")}
            variant="warning"
            icon={<StarIcon />}
          >
            {favoriteCount}
          </FilterButton>
          
          <FilterButton
            isActive={filter === "recent"}
            onClick={() => setFilter("recent")}
            variant="secondary"
            icon={<ClockIcon />}
          >
            {recentCount}
          </FilterButton>
        </div>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 generator-sidebar-scroll history-list-container">
        <AnimatePresence mode="popLayout">
          {filteredHistory.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <EmptyState
                icon={searchQuery || filter !== "all" ? <SearchIcon /> : <ClockIcon />}
                title={searchQuery || filter !== "all" ? "No matches found" : "No history yet"}
                description={
                  searchQuery || filter !== "all" 
                    ? "Try adjusting your search or filters"
                    : "Generated content will appear here"
                }
                actionLabel={searchQuery || filter !== "all" ? "Clear filters" : undefined}
                onAction={
                  searchQuery || filter !== "all" 
                    ? () => {
                        setSearchQuery("");
                        setFilter("all");
                      }
                    : undefined
                }
                className="py-12"
              />
            </motion.div>
          ) : (
            <>
              {filteredHistory.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2, delay: index * 0.02 }}
                  layout
                >
                  <Card
                    variant={viewingHistoryItemId === item.id ? "glow" : "hover"}
                    padding="sm"
                    onClick={() => onViewHistoryItem(item)}
                    className={`
                      cursor-pointer relative overflow-hidden history-item-mobile
                      ${viewingHistoryItemId === item.id
                        ? "history-item-active"
                        : "hover:border-[var(--border-secondary)]"
                      }
                    `}
                  >
                    {/* Header with type and platform */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <TagIcon className="w-3 h-3 text-[var(--text-tertiary)] flex-shrink-0" />
                        <span className="text-xs font-medium text-[var(--text-secondary)] truncate">
                          {CONTENT_TYPES.find((ct) => ct.value === item.contentType)?.label || item.contentType}
                        </span>
                      </div>
                      <Badge
                        variant="neutral"
                        size="sm"
                        className="text-xs px-2 py-0.5 bg-[var(--surface-quaternary)] text-[var(--text-tertiary)] badge-enhanced"
                      >
                        {item.platform}
                      </Badge>
                    </div>

                    {/* Content preview */}
                    <div className="mb-3">
                      <p
                        className="text-sm text-[var(--text-primary)] leading-relaxed"
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {truncateText(item.userInput, 100)}
                      </p>
                    </div>

                    {/* Footer with timestamp and actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
                        <ClockIcon className="w-3 h-3" />
                        {formatTimestamp(item.timestamp)}
                      </div>

                      <div className="flex items-center gap-1 action-buttons-mobile">
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(item.id);
                          }}
                          className={`
                            p-1.5 rounded-lg action-button-favorite
                            ${item.isFavorite
                              ? "bg-gradient-to-r from-[var(--color-warning)] to-[#ea580c] text-white shadow-md"
                              : "bg-[var(--surface-tertiary)] text-[var(--text-tertiary)] hover:bg-[var(--color-warning)]/10 hover:text-[var(--color-warning)]"
                            }
                          `}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <StarIcon className="w-3.5 h-3.5" />
                        </motion.button>

                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            onPinToCanvas(item);
                          }}
                          className="p-1.5 rounded-lg action-button-canvas text-white shadow-md"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <PlusCircleIcon className="w-3.5 h-3.5" />
                        </motion.button>

                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteHistoryItem(item.id);
                          }}
                          className="p-1.5 rounded-lg bg-[var(--surface-tertiary)] text-[var(--text-tertiary)] action-button-delete"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <TrashIcon className="w-3.5 h-3.5" />
                        </motion.button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Footer - Clear All */}
      {history.length > 0 && (
        <div className="p-4 border-t border-[var(--border-primary)] bg-[var(--surface-secondary)]">
          <Button
            variant="ghost"
            fullWidth
            onClick={onClearAppHistory}
            icon={<TrashIcon />}
            className="text-[var(--color-error)] border-[var(--color-error)]/20 hover:bg-[var(--color-error)]/10 hover:border-[var(--color-error)]/40"
          >
            Clear All History
          </Button>
        </div>
      )}
    </div>
  );
};
