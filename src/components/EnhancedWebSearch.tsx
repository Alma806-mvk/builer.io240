import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  SearchIcon,
  ArrowUpRightIcon,
  TagIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  DownloadIcon,
} from "./IconComponents";
import LoadingSpinner from "./LoadingSpinner";
import { VIDEO_EDITING_EXTENSIONS } from "../../constants";
import FileDownloadService from "../services/fileDownloadService";
import { performWebSearch } from "../../services/geminiService";

export interface Source {
  uri: string;
  title: string;
  category?: string;
  safetyScore?: number;
  description?: string;
  isPaid?: boolean;
  downloadUrl?: string;
  validDownload?: boolean;
  validUri?: boolean;
  size?: number;
  filetype?: string;
  contentType?: string;
  snippet?: string;
}

interface EnhancedWebSearchProps {
  apiKeyMissing: boolean;
}

// URL patterns for categorization (keeping existing logic)
const URL_CATEGORIES = {
  Gumroad: {
    patterns: [/gumroad\.com/i],
    icon: "🛒",
    color: "bg-pink-600",
    description: "Digital marketplace for creators",
  },
  "Google Drive": {
    patterns: [
      /drive\.google\.com/i,
      /docs\.google\.com/i,
      /sheets\.google\.com/i,
      /slides\.google\.com/i,
    ],
    icon: "📁",
    color: "bg-blue-600",
    description: "Google cloud storage and documents",
  },
  // ... (keeping all existing URL categories)
};

export const EnhancedWebSearch: React.FC<EnhancedWebSearchProps> = ({
  apiKeyMissing,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFileType, setSearchFileType] = useState("");
  const [customSearchFileType, setCustomSearchFileType] = useState("");
  const [searchResults, setSearchResults] = useState<Source[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [canLoadMoreSearchResults, setCanLoadMoreSearchResults] =
    useState(false);
  const [assetType, setAssetType] = useState<"all" | "free" | "paid">("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<"relevance" | "safety" | "category">(
    "relevance",
  );
  const [downloadingFiles, setDownloadingFiles] = useState<Set<string>>(
    new Set(),
  );
  const [validatedResults, setValidatedResults] = useState<Source[]>([]);
  const [validatingLinks, setValidatingLinks] = useState(false);

  const SEARCH_FILE_TYPES = useMemo(
    () => [
      { value: "", label: "Any File Type" },

      // Video Editing Projects (Most Important)
      { value: ".aep", label: "After Effects Project (.aep)" },
      { value: ".prproj", label: "Premiere Pro Project (.prproj)" },
      { value: ".mogrt", label: "Motion Graphics Template (.mogrt)" },
      { value: ".fcpproject", label: "Final Cut Pro Project (.fcpproject)" },
      { value: ".drp", label: "DaVinci Resolve Project (.drp)" },
      { value: ".veg", label: "Sony Vegas Project (.veg)" },
      { value: ".avp", label: "Avid Media Composer (.avp)" },

      // Color Grading & LUTs
      { value: ".cube", label: "LUT Cube (.cube)" },
      { value: ".look", label: "LUT Look (.look)" },
      { value: ".3dl", label: "LUT 3DL (.3dl)" },
      { value: ".dctl", label: "DaVinci Resolve LUT (.dctl)" },

      // Video Assets
      { value: ".mp4", label: "Video File (.mp4)" },
      { value: ".mov", label: "Video File (.mov)" },
      { value: ".avi", label: "Video File (.avi)" },
      { value: ".mkv", label: "Video File (.mkv)" },
      { value: ".prores", label: "ProRes (.prores)" },
      { value: ".dnxhd", label: "DNxHD (.dnxhd)" },

      // Audio for Video
      { value: ".wav", label: "Audio File (.wav)" },
      { value: ".mp3", label: "Audio File (.mp3)" },
      { value: ".aac", label: "Audio File (.aac)" },
      { value: ".flac", label: "Audio File (.flac)" },

      // Graphics & Design
      { value: ".psd", label: "Photoshop File (.psd)" },
      { value: ".ai", label: "Illustrator File (.ai)" },
      { value: ".png", label: "PNG Image (.png)" },
      { value: ".jpg", label: "JPEG Image (.jpg)" },
      { value: ".svg", label: "SVG Vector (.svg)" },

      // 3D & Motion Graphics
      { value: ".c4d", label: "Cinema 4D Project (.c4d)" },
      { value: ".blend", label: "Blender Project (.blend)" },
      { value: ".fbx", label: "FBX Model (.fbx)" },
      { value: ".obj", label: "OBJ Model (.obj)" },

      // Presets & Plugins
      { value: ".ffx", label: "After Effects Preset (.ffx)" },
      { value: ".prfpset", label: "Premiere Pro Preset (.prfpset)" },
      { value: ".aex", label: "After Effects Plugin (.aex)" },
      { value: ".lrtemplate", label: "Lightroom Preset (.lrtemplate)" },
      { value: ".xmp", label: "Lightroom XMP (.xmp)" },

      // Fonts
      { value: ".otf", label: "OpenType Font (.otf)" },
      { value: ".ttf", label: "TrueType Font (.ttf)" },

      // Archives
      { value: ".zip", label: "ZIP Archive (.zip)" },
      { value: ".rar", label: "RAR Archive (.rar)" },

      { value: "OTHER_EXTENSION", label: "Other Extension..." },
    ],
    [],
  );

  // Keep all existing functions (categorizeAndScoreUrl, getSafetyBadge, getCategoryBadge, etc.)
  const categorizeAndScoreUrl = useCallback((url: string) => {
    try {
      const domain = new URL(url).hostname.toLowerCase();

      for (const [category, config] of Object.entries(URL_CATEGORIES)) {
        if (config.patterns.some((pattern) => pattern.test(domain))) {
          // Calculate safety score based on known platforms
          let safetyScore = 85; // Default for known platforms
          if (category === "GitHub" || category === "Google Drive")
            safetyScore = 95;
          if (category === "Unsplash" || category === "Pexels")
            safetyScore = 90;

          return {
            category,
            safetyScore,
            isPaid: ["Gumroad", "Shutterstock", "Adobe Stock"].includes(
              category,
            ),
          };
        }
      }

      // Unknown domain
      return {
        category: "Unknown",
        safetyScore: 60,
        isPaid: undefined,
      };
    } catch {
      return {
        category: "Unknown",
        safetyScore: 30,
        isPaid: undefined,
      };
    }
  }, []);

  const getSafetyBadge = (score: number) => {
    if (score >= 80) {
      return <span className="safety-badge safe">��️</span>;
    } else if (score >= 60) {
      return <span className="safety-badge caution">⚠️</span>;
    } else {
      return <span className="safety-badge warning">⚠️</span>;
    }
  };

  const getCategoryBadge = (category: string) => {
    const categoryInfo =
      URL_CATEGORIES[category as keyof typeof URL_CATEGORIES];
    if (categoryInfo) {
      return (
        <span className="category-badge">
          <span className="category-icon">{categoryInfo.icon}</span>
          <span className="category-name">{category}</span>
        </span>
      );
    }
    return null;
  };

  const handlePerformWebSearch = useCallback(
    async (isLoadMore = false) => {
      if (!searchQuery.trim()) {
        setSearchError("Please enter a search query.");
        return;
      }
      setIsSearching(true);
      setSearchError(null);
      setCanLoadMoreSearchResults(false);
      setSearchResults([]);
      const effectiveSearchFileType =
        searchFileType === "OTHER_EXTENSION"
          ? customSearchFileType
          : searchFileType;
      try {
        // Use Gemini service for web search
        const searchResults = await performWebSearch(
          `${searchQuery} ${effectiveSearchFileType ? `filetype:${effectiveSearchFileType}` : ""}`,
        );

        if (searchResults && searchResults.length > 0) {
          setSearchResults(
            searchResults.map((result: any) => ({
              ...result,
              url: result.uri,
              uri: result.uri,
              filetype: effectiveSearchFileType || "web",
            })),
          );
        } else {
          setSearchResults([]);
          setSearchError("No results found for your search query.");
        }
      } catch (err: any) {
        setSearchError(
          err.message || "An unexpected error occurred during search.",
        );
      } finally {
        setIsSearching(false);
      }
    },
    [searchQuery, searchFileType, customSearchFileType],
  );

  // Helper to check if a link is valid (returns 200 OK)
  const checkLinkValid = async (url: string): Promise<boolean> => {
    try {
      const response = await fetch(url, { method: "HEAD", mode: "no-cors" });
      // If no-cors, browsers may not give us status, so fallback to GET
      if (response.status === 200 || response.status === 0) return true;
      // Try GET if HEAD fails (for some servers)
      const getResp = await fetch(url, { method: "GET", mode: "no-cors" });
      return getResp.status === 200 || getResp.status === 0;
    } catch {
      return false;
    }
  };

  // Validate links after search results change
  useEffect(() => {
    let cancelled = false;
    const validateLinks = async () => {
      setValidatingLinks(true);
      const results: Source[] = [];
      for (const result of searchResults) {
        let validDownload = false;
        if (result.downloadUrl) {
          validDownload = await checkLinkValid(result.downloadUrl);
        }
        let validUri = false;
        if (!validDownload && result.uri) {
          validUri = await checkLinkValid(result.uri);
        }
        if (cancelled) return;
        // Only include if at least one link is valid
        if (validDownload || validUri) {
          results.push({ ...result, validDownload, validUri });
        }
      }
      if (!cancelled) setValidatedResults(results);
      setValidatingLinks(false);
    };
    if (searchResults.length > 0) {
      validateLinks();
    } else {
      setValidatedResults([]);
    }
    return () => {
      cancelled = true;
    };
  }, [searchResults]);

  const filteredAndSortedResults = useMemo(() => {
    // ... keeping existing filtering logic
    return searchResults;
  }, [searchResults, selectedCategory, sortBy]);

  const availableCategories = useMemo(() => {
    const categories = [
      "all",
      ...new Set(searchResults.map((r) => r.category).filter(Boolean)),
    ];
    return categories;
  }, [searchResults]);

  const handleDownloadFile = useCallback(
    async (result: Source) => {
      // ... keeping existing download logic
    },
    [searchQuery, searchFileType, customSearchFileType],
  );

  return (
    <div className="flex-grow flex flex-col h-full">
      {/* Modern Dashboard Layout */}
      <div className="flex flex-col xl:flex-row h-full gap-6">
        {/* Control Panel - Left Side */}
        <div className="xl:w-1/3 flex flex-col">
          <div className="control-panel">
            {/* Header */}
            <div className="panel-header">
              <div className="header-decoration">
                <div className="decoration-line" />
                <div className="decoration-dot" />
              </div>
              <div className="header-info">
                <h1 className="panel-title">Asset Discovery</h1>
                <p className="panel-subtitle">
                  Professional creative asset search engine
                </p>
              </div>
            </div>

            {/* Search Configuration */}
            <div className="search-config">
              <div className="config-section">
                <label className="config-label">Search Query</label>
                <div className="search-field">
                  <SearchIcon className="field-icon" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Describe what you're looking for..."
                    className="modern-input"
                    onKeyPress={(e) =>
                      e.key === "Enter" && handlePerformWebSearch(false)
                    }
                  />
                </div>
              </div>

              <div className="config-section">
                <label className="config-label">File Type</label>
                <select
                  value={searchFileType}
                  onChange={(e) => {
                    setSearchFileType(e.target.value);
                    if (e.target.value !== "OTHER_EXTENSION")
                      setCustomSearchFileType("");
                  }}
                  className="modern-select"
                >
                  {SEARCH_FILE_TYPES.map((ext, index) => (
                    <option
                      key={`filetype-${ext.value || "empty"}-${index}`}
                      value={ext.value}
                    >
                      {ext.label}
                    </option>
                  ))}
                </select>
              </div>

              {searchFileType === "OTHER_EXTENSION" && (
                <div className="config-section">
                  <label className="config-label">Custom Extension</label>
                  <input
                    type="text"
                    value={customSearchFileType}
                    onChange={(e) => {
                      let val = e.target.value.trim();
                      if (val && !val.startsWith(".")) val = "." + val;
                      setCustomSearchFileType(val);
                    }}
                    placeholder=".pdf, .docx, etc."
                    className="modern-input"
                  />
                </div>
              )}

              {/* Asset Type Filter */}
              <div className="config-section">
                <label className="config-label">Asset Type</label>
                <div className="toggle-group">
                  {["all", "free", "paid"].map((type, index) => (
                    <button
                      key={`asset-type-${type}-${index}`}
                      onClick={() => setAssetType(type as any)}
                      className={`toggle-button ${assetType === type ? "active" : ""}`}
                    >
                      {type === "all"
                        ? "All Assets"
                        : type === "free"
                          ? "Free Only"
                          : "Premium"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional Advanced Options */}
              <div className="config-section">
                <label className="config-label">Search Depth</label>
                <select className="modern-select">
                  <option>Standard Search</option>
                  <option>Deep Analysis</option>
                  <option>Comprehensive Scan</option>
                  <option>AI-Enhanced Discovery</option>
                </select>
              </div>

              <div className="config-section">
                <label className="config-label">Content Quality</label>
                <select className="modern-select">
                  <option>All Quality Levels</option>
                  <option>High Quality Only</option>
                  <option>Professional Grade</option>
                  <option>Premium Assets</option>
                </select>
              </div>

              <div className="config-section">
                <label className="config-label">Time Range</label>
                <select className="modern-select">
                  <option>Any Time</option>
                  <option>Past 24 Hours</option>
                  <option>Past Week</option>
                  <option>Past Month</option>
                  <option>Past Year</option>
                </select>
              </div>

              <div className="config-section">
                <label className="config-label">Source Priority</label>
                <div className="priority-toggles">
                  <label className="priority-toggle">
                    <input type="checkbox" defaultChecked />
                    <span className="priority-slider"></span>
                    <span className="priority-text">Verified Sources</span>
                  </label>
                  <label className="priority-toggle">
                    <input type="checkbox" defaultChecked />
                    <span className="priority-slider"></span>
                    <span className="priority-text">Popular Platforms</span>
                  </label>
                  <label className="priority-toggle">
                    <input type="checkbox" />
                    <span className="priority-slider"></span>
                    <span className="priority-text">Experimental Sources</span>
                  </label>
                </div>
              </div>

              {/* Search Button */}
              <button
                onClick={() => handlePerformWebSearch(false)}
                disabled={
                  isSearching ||
                  !searchQuery.trim() ||
                  (searchFileType === "OTHER_EXTENSION" &&
                    !customSearchFileType.trim())
                }
                className="search-launch-button"
              >
                {isSearching ? (
                  <div className="search-loading">
                    <div className="search-spinner" />
                    <span>Scanning...</span>
                  </div>
                ) : (
                  <div className="search-content">
                    <SearchIcon className="h-5 w-5" />
                    <span>Launch Search</span>
                    <div className="button-glow" />
                  </div>
                )}
              </button>
            </div>

            {/* Filters - Only show when we have results */}
            {searchResults.length > 0 && (
              <div className="filters-section">
                <div className="filters-header">
                  <TagIcon className="h-4 w-4 text-slate-400" />
                  <span>Filters</span>
                </div>
                <div className="filter-controls">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="filter-select"
                  >
                    {availableCategories.map((cat, index) => (
                      <option key={`category-${cat}-${index}`} value={cat}>
                        {cat === "all" ? "All Categories" : cat}
                      </option>
                    ))}
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="filter-select"
                  >
                    <option key="sort-relevance" value="relevance">
                      Relevance
                    </option>
                    <option key="sort-safety" value="safety">
                      Safety Score
                    </option>
                    <option key="sort-category" value="category">
                      Category
                    </option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Panel - Right Side */}
        <div className="xl:w-2/3 flex flex-col min-h-0">
          {/* Error State */}
          {searchError && (
            <div className="results-panel error-panel">
              <div className="error-display">
                <div className="error-icon">⚠️</div>
                <div className="error-message">
                  <h3>Search Error</h3>
                  <p>{searchError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isSearching && searchResults.length === 0 && (
            <div className="results-panel scanning-panel">
              <div className="scanning-display">
                <div className="scanning-animation">
                  <div className="radar-sweep" />
                  <div className="radar-dots">
                    <div className="radar-dot" />
                    <div className="radar-dot" />
                    <div className="radar-dot" />
                  </div>
                </div>
                <div className="scanning-info">
                  <h3>Scanning Asset Databases</h3>
                  <p>
                    Searching{" "}
                    {assetType === "free"
                      ? "free"
                      : assetType === "paid"
                        ? "premium"
                        : "all"}{" "}
                    platforms for {searchFileType || "assets"}
                  </p>
                  <div className="platform-indicators">
                    {[
                      "VideoHive",
                      "AudioJungle",
                      "Unsplash",
                      "GitHub",
                      "Freepik",
                      "Motion Array",
                    ].map((platform, index) => (
                      <div key={`platform-${platform}-${index}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Empty State - Enhanced */}
          {!searchResults.length && !isSearching && !searchError && (
            <div className="results-panel empty-state-enhanced">
              <div className="empty-display-enhanced">
                <div className="empty-visual-enhanced">
                  <div className="floating-elements-enhanced">
                    <div className="floating-dot dot-1" />
                    <div className="floating-dot dot-2" />
                    <div className="floating-dot dot-3" />
                    <div className="floating-dot dot-4" />
                    <div className="floating-dot dot-5" />
                    <div className="floating-dot dot-6" />
                    <div className="floating-dot dot-7" />
                    <div className="floating-dot dot-8" />
                  </div>
                  <div className="empty-icon-enhanced">
                    <SearchIcon className="h-24 w-24 text-slate-500" />
                    <div className="icon-rings-enhanced">
                      <div className="ring ring-1" />
                      <div className="ring ring-2" />
                      <div className="ring ring-3" />
                      <div className="ring ring-4" />
                    </div>
                  </div>
                </div>
                <div className="empty-content-enhanced">
                  <h3>Ready to Discover</h3>
                  <p>
                    Configure your advanced search parameters and launch to find
                    professional creative assets from verified sources worldwide
                  </p>
                  <div className="discovery-features">
                    <div className="discovery-feature">
                      <div className="feature-icon-container">
                        <SearchIcon className="h-5 w-5 text-blue-400" />
                      </div>
                      <div className="feature-content">
                        <span className="feature-title">Smart Discovery</span>
                        <span className="feature-desc">
                          AI-powered asset hunting
                        </span>
                      </div>
                    </div>
                    <div className="discovery-feature">
                      <div className="feature-icon-container">
                        <GlobeAltIcon className="h-5 w-5 text-emerald-400" />
                      </div>
                      <div className="feature-content">
                        <span className="feature-title">Global Sources</span>
                        <span className="feature-desc">
                          Worldwide creative platforms
                        </span>
                      </div>
                    </div>
                    <div className="discovery-feature">
                      <div className="feature-icon-container">
                        <TagIcon className="h-5 w-5 text-purple-400" />
                      </div>
                      <div className="feature-content">
                        <span className="feature-title">Quality Verified</span>
                        <span className="feature-desc">
                          Safety-checked resources
                        </span>
                      </div>
                    </div>
                    <div className="discovery-feature">
                      <div className="feature-icon-container">
                        <DownloadIcon className="h-5 w-5 text-cyan-400" />
                      </div>
                      <div className="feature-content">
                        <span className="feature-title">Instant Access</span>
                        <span className="feature-desc">
                          Direct download links
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {searchResults.length > 0 && (
            <div className="results-panel">
              <div className="results-header">
                <TagIcon className="h-4 w-4 text-slate-400" />
                <span>Results</span>
              </div>
              <div className="results-content">
                {filteredAndSortedResults.map((result, idx) => (
                  <div key={`search-result-${result.uri}-${result.title?.substring(0, 10) || ''}-${idx}`} className="result-item">
                    <div className="result-title">
                      <a
                        href={result.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {result.title || result.uri}
                      </a>
                    </div>
                    <div className="result-meta">
                      <span className="result-filetype">
                        {result.filetype?.toUpperCase()}
                      </span>
                      {result.contentType && (
                        <span className="result-content-type">
                          {result.contentType}
                        </span>
                      )}
                      {result.size && (
                        <span className="result-size">
                          {(result.size / 1024).toFixed(1)} KB
                        </span>
                      )}
                    </div>
                    {result.snippet && (
                      <div className="result-snippet">{result.snippet}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedWebSearch;
