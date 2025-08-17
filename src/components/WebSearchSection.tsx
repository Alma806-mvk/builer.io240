import React, { useState } from "react";
import { GeneratedTextOutput, Source } from "../../types";

import {
  GlobeAltIcon,
  SearchIcon,
  ClipboardIcon,
  ExternalLinkIcon,
  ClockIcon,
  SparklesIcon,
} from "../IconComponents";

import LoadingSpinner from "../../components/LoadingSpinner";
import GeneratingContent from "./GeneratingContent";

interface WebSearchSectionProps {
  // State
  isLoading: boolean;
  error: string | null;
  searchResults: GeneratedTextOutput | null;

  // Actions
  onWebSearch: (query: string) => Promise<void>;
  handleCopyToClipboard: (text: string) => void;

  // UI state
  copied: boolean;
  user: any;
  onSignInRequired?: () => void;
}

export const WebSearchSection: React.FC<WebSearchSectionProps> = ({
  // State
  isLoading,
  error,
  searchResults,

  // Actions
  onWebSearch,
  handleCopyToClipboard,

  // UI state
  copied,
  user,
  onSignInRequired,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const handleSearch = async () => {
    if (!user && onSignInRequired) {
      onSignInRequired();
      return;
    }

    if (!searchQuery.trim()) return;

    // Add to recent searches
    setRecentSearches((prev) => {
      const updated = [searchQuery, ...prev.filter((q) => q !== searchQuery)];
      return updated.slice(0, 5); // Keep only last 5 searches
    });

    await onWebSearch(searchQuery);
  };

  const handleRecentSearchClick = (query: string) => {
    setSearchQuery(query);
  };

  const formatSearchTime = () => {
    return new Date().toLocaleTimeString();
  };

  return (
    <div className="w-full h-screen flex flex-col">
      {/* Full-Screen Split Layout */}
      <div className="flex flex-col lg:flex-row flex-1 gap-6 p-6 min-h-0">
        {/* Left Panel - Search Interface */}
        <div className="lg:w-2/5 flex flex-col min-h-0">
          {/* Floating Search Card */}
          <div className="modern-search-card h-full flex flex-col">
            {/* Header */}
            <div className="modern-header">
              <div className="pulse-dot" />
              <div className="header-content">
                <h1 className="modern-title">Web Intelligence</h1>
                <p className="modern-subtitle">
                  AI-powered web search and analysis
                </p>
              </div>
            </div>

            {/* Search Input */}
            <div className="search-container">
              <div className="search-input-wrapper">
                <SearchIcon className="search-icon" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="What would you like to discover?"
                  className="modern-search-input"
                  disabled={isLoading}
                />
                <div className="search-glow" />
              </div>

              <button
                onClick={handleSearch}
                disabled={isLoading || !searchQuery.trim()}
                className="modern-search-button"
              >
                {isLoading ? (
                  <div className="loading-animation">
                    <div className="spinner" />
                  </div>
                ) : (
                  <div className="button-content">
                    <span>Search</span>
                    <SparklesIcon className="h-4 w-4" />
                  </div>
                )}
              </button>
            </div>

            {/* Advanced Search Controls */}
            <div className="advanced-controls-section">
              <div className="controls-header">
                <GlobeAltIcon className="h-4 w-4 text-slate-500" />
                <span>Search Parameters</span>
              </div>

              <div className="controls-grid">
                <div className="control-item">
                  <label className="control-label">Search Depth</label>
                  <select className="control-select">
                    <option value="standard">Standard</option>
                    <option value="deep">Deep Analysis</option>
                    <option value="comprehensive">Comprehensive</option>
                  </select>
                </div>

                <div className="control-item">
                  <label className="control-label">Time Range</label>
                  <select className="control-select">
                    <option value="any">Any Time</option>
                    <option value="day">24 Hours</option>
                    <option value="week">Past Week</option>
                    <option value="month">Past Month</option>
                  </select>
                </div>

                <div className="control-item">
                  <label className="control-label">Content Type</label>
                  <select className="control-select">
                    <option value="all">All Content</option>
                    <option value="news">News</option>
                    <option value="academic">Academic</option>
                    <option value="social">Social Media</option>
                  </select>
                </div>

                <div className="control-item">
                  <label className="control-label">Language</label>
                  <select className="control-select">
                    <option value="any">Any Language</option>
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>

                <div className="control-item">
                  <label className="control-label">Region</label>
                  <select className="control-select">
                    <option value="global">Global</option>
                    <option value="us">United States</option>
                    <option value="eu">Europe</option>
                    <option value="asia">Asia</option>
                  </select>
                </div>

                <div className="control-item">
                  <label className="control-label">Quality Filter</label>
                  <select className="control-select">
                    <option value="all">All Results</option>
                    <option value="high">High Quality</option>
                    <option value="verified">Verified Only</option>
                  </select>
                </div>
              </div>

              {/* AI Search Options */}
              <div className="ai-options">
                <div className="ai-header">
                  <SparklesIcon className="h-4 w-4 text-purple-400" />
                  <span>AI Enhancement</span>
                </div>
                <div className="ai-toggles">
                  <label className="toggle-option">
                    <input
                      type="checkbox"
                      className="toggle-checkbox"
                      defaultChecked
                    />
                    <span className="toggle-label">Smart Summarization</span>
                  </label>
                  <label className="toggle-option">
                    <input
                      type="checkbox"
                      className="toggle-checkbox"
                      defaultChecked
                    />
                    <span className="toggle-label">Fact Verification</span>
                  </label>
                  <label className="toggle-option">
                    <input type="checkbox" className="toggle-checkbox" />
                    <span className="toggle-label">Sentiment Analysis</span>
                  </label>
                  <label className="toggle-option">
                    <input type="checkbox" className="toggle-checkbox" />
                    <span className="toggle-label">Related Topics</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Recent Searches - Modern Pills */}
            {recentSearches.length > 0 && (
              <div className="recent-section">
                <div className="recent-header">
                  <ClockIcon className="h-3 w-3 text-slate-500" />
                  <span>Recent</span>
                </div>
                <div className="recent-pills">
                  {recentSearches.map((search, index) => (
                    <button
                      key={`recent-${search}-${index}`}
                      onClick={() => handleRecentSearchClick(search)}
                      className="recent-pill"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Advanced Search Options */}
            {!searchResults && !isLoading && !error && (
              <div className="advanced-search-section">
                <div className="advanced-header">
                  <GlobeAltIcon className="h-4 w-4 text-slate-500" />
                  <span>Advanced Search Options</span>
                </div>

                <div className="advanced-options-grid">
                  {/* Search Filters */}
                  <div className="option-group">
                    <label className="option-label">Search Depth</label>
                    <select className="advanced-select">
                      <option value="standard">Standard Search</option>
                      <option value="deep">Deep Web Search</option>
                      <option value="comprehensive">
                        Comprehensive Analysis
                      </option>
                    </select>
                  </div>

                  <div className="option-group">
                    <label className="option-label">Time Filter</label>
                    <select className="advanced-select">
                      <option value="any">Any Time</option>
                      <option value="day">Past 24 Hours</option>
                      <option value="week">Past Week</option>
                      <option value="month">Past Month</option>
                      <option value="year">Past Year</option>
                    </select>
                  </div>

                  <div className="option-group">
                    <label className="option-label">Language</label>
                    <select className="advanced-select">
                      <option value="any">Any Language</option>
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>

                  <div className="option-group">
                    <label className="option-label">Source Type</label>
                    <select className="advanced-select">
                      <option value="all">All Sources</option>
                      <option value="news">News Articles</option>
                      <option value="academic">Academic Papers</option>
                      <option value="blogs">Blog Posts</option>
                      <option value="forums">Forums</option>
                    </select>
                  </div>
                </div>

                {/* Search Suggestions */}
                <div className="suggestions-section">
                  <div className="suggestions-header">
                    <SparklesIcon className="h-3 w-3 text-slate-500" />
                    <span>Popular Searches</span>
                  </div>
                  <div className="suggestions-grid">
                    {[
                      { text: "Latest AI developments", icon: "🤖" },
                      { text: "Climate tech innovations", icon: "🌱" },
                      { text: "Space exploration news", icon: "🚀" },
                      { text: "Web3 trends 2025", icon: "⛓️" },
                      { text: "Quantum computing breakthroughs", icon: "⚛️" },
                      { text: "Renewable energy solutions", icon: "🔋" },
                      { text: "Blockchain technology", icon: "🔗" },
                      { text: "Machine learning applications", icon: "🧠" },
                    ].map((suggestion, index) => (
                      <button
                        key={`suggestion-${suggestion.text.replace(/\s+/g, "-")}-${index}`}
                        onClick={() => setSearchQuery(suggestion.text)}
                        className="suggestion-card"
                      >
                        <span className="suggestion-icon">
                          {suggestion.icon}
                        </span>
                        <span className="suggestion-text">
                          {suggestion.text}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Results */}
        <div className="lg:w-3/5 flex flex-col min-h-0 flex-1">
          {/* Loading State */}
          {isLoading && (
            <div className="results-panel loading-panel">
              <div className="loading-content">
                <div className="loading-visual">
                  <div className="scanning-lines">
                    <div className="scan-line" />
                    <div className="scan-line" />
                    <div className="scan-line" />
                  </div>
                  <GlobeAltIcon className="h-8 w-8 text-sky-400 animate-pulse" />
                </div>
                <div className="loading-text">
                  <h3>Analyzing the web...</h3>
                  <p>Processing real-time information from multiple sources</p>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="results-panel error-panel">
              <div className="error-content">
                <div className="error-icon">
                  <ExternalLinkIcon className="h-6 w-6 text-red-400" />
                </div>
                <div className="error-text">
                  <h3>Search encountered an issue</h3>
                  <p>{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Search Results */}
          {searchResults && !isLoading && (
            <div className="results-panel">
              {/* Results Header */}
              <div className="results-header">
                <div className="results-info">
                  <div className="results-icon">
                    <SparklesIcon className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div className="results-meta">
                    <h3>Analysis Complete</h3>
                    <div className="results-stats">
                      <span>{formatSearchTime()}</span>
                      {searchResults.groundingSources && (
                        <>
                          <span>•</span>
                          <span>
                            {searchResults.groundingSources.length} sources
                            analyzed
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() =>
                    handleCopyToClipboard(searchResults.content || "")
                  }
                  className="copy-button"
                >
                  <ClipboardIcon className="h-4 w-4" />
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>

              {/* Main Content */}
              <div className="results-content">
                <div className="content-card">
                  <div className="content-text">{searchResults.content}</div>
                </div>

                {/* Sources Grid */}
                {searchResults.groundingSources &&
                  searchResults.groundingSources.length > 0 && (
                    <div className="sources-section">
                      <div className="sources-header">
                        <GlobeAltIcon className="h-4 w-4 text-sky-400" />
                        <span>Sources</span>
                      </div>
                      <div className="sources-grid">
                        {searchResults.groundingSources.map((source, index) => (
                          <div
                            key={`source-${source.uri}-${index}`}
                            className="source-card"
                          >
                            <div className="source-header">
                              <h4>{source.title}</h4>
                              <div className="source-actions">
                                <button
                                  onClick={() =>
                                    handleCopyToClipboard(source.uri)
                                  }
                                  className="source-copy"
                                >
                                  <ClipboardIcon className="h-3 w-3" />
                                </button>
                                <a
                                  href={source.uri}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="source-link"
                                >
                                  <ExternalLinkIcon className="h-3 w-3" />
                                </a>
                              </div>
                            </div>
                            <p className="source-snippet">{source.snippet}</p>
                            <div className="source-domain">
                              {new URL(source.uri).hostname}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          )}

          {/* Empty State - Enhanced Full Height */}
          {!searchResults && !isLoading && !error && (
            <div className="results-panel empty-panel-enhanced">
              <div className="empty-layout-enhanced">
                {/* Left Side - Advanced Options */}
                <div className="empty-advanced-sidebar">
                  <div className="advanced-options-panel">
                    <div className="panel-header">
                      <div className="pulse-dot-small" />
                      <h4>Advanced Options</h4>
                    </div>

                    <div className="advanced-option-group">
                      <label className="advanced-label">
                        <SparklesIcon className="h-4 w-4 text-blue-400" />
                        AI Processing Mode
                      </label>
                      <select className="advanced-option-select">
                        <option>Standard Analysis</option>
                        <option>Deep Learning</option>
                        <option>Neural Processing</option>
                        <option>Cognitive Analysis</option>
                      </select>
                    </div>

                    <div className="advanced-option-group">
                      <label className="advanced-label">
                        <GlobeAltIcon className="h-4 w-4 text-emerald-400" />
                        Search Scope
                      </label>
                      <select className="advanced-option-select">
                        <option>Global Web</option>
                        <option>Academic Sources</option>
                        <option>News & Media</option>
                        <option>Professional Networks</option>
                      </select>
                    </div>

                    <div className="advanced-option-group">
                      <label className="advanced-label">
                        <ClockIcon className="h-4 w-4 text-purple-400" />
                        Content Freshness
                      </label>
                      <select className="advanced-option-select">
                        <option>Any Time</option>
                        <option>Last 24 Hours</option>
                        <option>Past Week</option>
                        <option>Past Month</option>
                      </select>
                    </div>

                    <div className="advanced-option-group">
                      <label className="advanced-label">
                        <SearchIcon className="h-4 w-4 text-cyan-400" />
                        Result Quality
                      </label>
                      <select className="advanced-option-select">
                        <option>Balanced</option>
                        <option>High Accuracy</option>
                        <option>Maximum Coverage</option>
                        <option>Speed Optimized</option>
                      </select>
                    </div>

                    <div className="advanced-option-group">
                      <label className="advanced-label">
                        <ExternalLinkIcon className="h-4 w-4 text-pink-400" />
                        Content Format
                      </label>
                      <select className="advanced-option-select">
                        <option>All Formats</option>
                        <option>Text Only</option>
                        <option>Rich Media</option>
                        <option>Interactive Content</option>
                      </select>
                    </div>

                    <div className="advanced-toggles">
                      <label className="advanced-toggle">
                        <input type="checkbox" defaultChecked />
                        <span className="toggle-slider"></span>
                        <span className="toggle-text">Real-time Updates</span>
                      </label>
                      <label className="advanced-toggle">
                        <input type="checkbox" defaultChecked />
                        <span className="toggle-slider"></span>
                        <span className="toggle-text">Auto-summarization</span>
                      </label>
                      <label className="advanced-toggle">
                        <input type="checkbox" />
                        <span className="toggle-slider"></span>
                        <span className="toggle-text">Expert Analysis</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Right Side - Main Empty Content */}
                <div className="empty-main-content">
                  <div className="empty-visual-massive-enhanced">
                    <div className="floating-elements-massive">
                      <div className="floating-dot dot-1" />
                      <div className="floating-dot dot-2" />
                      <div className="floating-dot dot-3" />
                      <div className="floating-dot dot-4" />
                      <div className="floating-dot dot-5" />
                      <div className="floating-dot dot-6" />
                      <div className="floating-dot dot-7" />
                      <div className="floating-dot dot-8" />
                      <div className="floating-dot dot-9" />
                    </div>
                    <div className="empty-icon-container-large">
                      <GlobeAltIcon className="h-40 w-40 text-slate-400" />
                      <div className="icon-rings-large">
                        <div className="ring ring-1" />
                        <div className="ring ring-2" />
                        <div className="ring ring-3" />
                        <div className="ring ring-4" />
                        <div className="ring ring-5" />
                      </div>
                    </div>
                  </div>
                  <div className="empty-text-massive-enhanced">
                    <h3>Ready to Discover</h3>
                    <p>
                      Configure your search parameters and enter your query to
                      start discovering insights from across the web with
                      advanced AI-powered analysis and real-time processing
                    </p>
                    <div className="empty-features-grid-enhanced">
                      <div className="feature-card">
                        <SparklesIcon className="h-6 w-6 text-sky-400" />
                        <span className="feature-title">
                          Real-time Analysis
                        </span>
                        <span className="feature-desc">
                          Live web data processing with instant insights
                        </span>
                      </div>
                      <div className="feature-card">
                        <GlobeAltIcon className="h-6 w-6 text-emerald-400" />
                        <span className="feature-title">
                          Source Verification
                        </span>
                        <span className="feature-desc">
                          Multiple source cross-checking for accuracy
                        </span>
                      </div>
                      <div className="feature-card">
                        <ClockIcon className="h-6 w-6 text-purple-400" />
                        <span className="feature-title">Instant Results</span>
                        <span className="feature-desc">
                          Sub-second response times globally
                        </span>
                      </div>
                      <div className="feature-card">
                        <SparklesIcon className="h-6 w-6 text-pink-400" />
                        <span className="feature-title">AI Enhancement</span>
                        <span className="feature-desc">
                          Smart summarization & trend insights
                        </span>
                      </div>
                      <div className="feature-card">
                        <SearchIcon className="h-6 w-6 text-cyan-400" />
                        <span className="feature-title">Deep Search</span>
                        <span className="feature-desc">
                          Advanced algorithms for comprehensive results
                        </span>
                      </div>
                      <div className="feature-card">
                        <ExternalLinkIcon className="h-6 w-6 text-orange-400" />
                        <span className="feature-title">Global Reach</span>
                        <span className="feature-desc">
                          Worldwide data sources and perspectives
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebSearchSection;
