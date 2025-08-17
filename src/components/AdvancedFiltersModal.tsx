import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Badge } from './ui/WorldClassComponents';
import { X, Filter, Calendar, TrendingUp, Target, Zap, Users } from 'lucide-react';

interface AdvancedFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
}

export interface FilterOptions {
  platforms: string[];
  categories: string[];
  volumeRange: [number, number];
  growthRange: [number, number];
  opportunityRange: [number, number];
  difficultyRange: [number, number];
  timeframe: string;
  trendingOnly: boolean;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

const DEFAULT_FILTERS: FilterOptions = {
  platforms: [],
  categories: [],
  volumeRange: [0, 1000000],
  growthRange: [-100, 500],
  opportunityRange: [0, 100],
  difficultyRange: [0, 100],
  timeframe: 'all',
  trendingOnly: false,
  sortBy: 'opportunity',
  sortOrder: 'desc'
};

export const AdvancedFiltersModal: React.FC<AdvancedFiltersProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  currentFilters
}) => {
  const [filters, setFilters] = useState<FilterOptions>(currentFilters);

  const platforms = ['YouTube', 'TikTok', 'Instagram', 'LinkedIn', 'Twitter', 'Facebook'];
  const categories = ['Technology', 'Lifestyle', 'Education', 'Entertainment', 'Business', 'Health', 'Fashion', 'Food', 'Finance', 'Gaming', 'Sports', 'News'];
  const timeframes = [
    { value: 'all', label: 'All Time' },
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' }
  ];
  const sortOptions = [
    { value: 'opportunity', label: 'Opportunity Score' },
    { value: 'volume', label: 'Search Volume' },
    { value: 'growth', label: 'Growth Rate' },
    { value: 'difficulty', label: 'Difficulty' },
    { value: 'keyword', label: 'Keyword A-Z' }
  ];

  const togglePlatform = (platform: string) => {
    setFilters(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  const toggleCategory = (category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleRangeChange = (
    type: 'volumeRange' | 'growthRange' | 'opportunityRange' | 'difficultyRange',
    index: 0 | 1,
    value: number
  ) => {
    setFilters(prev => ({
      ...prev,
      [type]: index === 0 
        ? [value, prev[type][1]]
        : [prev[type][0], value]
    }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const applyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.platforms.length > 0) count++;
    if (filters.categories.length > 0) count++;
    if (filters.volumeRange[0] > 0 || filters.volumeRange[1] < 1000000) count++;
    if (filters.growthRange[0] > -100 || filters.growthRange[1] < 500) count++;
    if (filters.opportunityRange[0] > 0 || filters.opportunityRange[1] < 100) count++;
    if (filters.difficultyRange[0] > 0 || filters.difficultyRange[1] < 100) count++;
    if (filters.timeframe !== 'all') count++;
    if (filters.trendingOnly) count++;
    if (filters.sortBy !== 'opportunity' || filters.sortOrder !== 'desc') count++;
    return count;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border-secondary)]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)] rounded-lg flex items-center justify-center">
              <Filter className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Advanced Filters</h2>
              <p className="text-sm text-[var(--text-secondary)]">
                Fine-tune your trending analysis
                {getActiveFiltersCount() > 0 && (
                  <Badge variant="primary" className="ml-2">
                    {getActiveFiltersCount()} active
                  </Badge>
                )}
              </p>
            </div>
          </div>
          <Button variant="ghost" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 space-y-8">
          {/* Platforms */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-3">
              Platforms
            </label>
            <div className="flex flex-wrap gap-2">
              {platforms.map(platform => (
                <button
                  key={platform}
                  onClick={() => togglePlatform(platform)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    filters.platforms.includes(platform)
                      ? 'bg-[var(--brand-primary)] text-white'
                      : 'bg-[var(--surface-secondary)] text-[var(--text-secondary)] hover:bg-[var(--surface-tertiary)]'
                  }`}
                >
                  {platform}
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-3">
              Categories
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    filters.categories.includes(category)
                      ? 'bg-[var(--brand-secondary)] text-white'
                      : 'bg-[var(--surface-secondary)] text-[var(--text-secondary)] hover:bg-[var(--surface-tertiary)]'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Ranges */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Volume Range */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-3">
                Search Volume
              </label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={filters.volumeRange[0]}
                    onChange={(e) => handleRangeChange('volumeRange', 0, parseInt(e.target.value) || 0)}
                    className="flex-1 px-3 py-2 bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg text-[var(--text-primary)] text-sm"
                    placeholder="Min"
                  />
                  <span className="text-[var(--text-secondary)]">to</span>
                  <input
                    type="number"
                    value={filters.volumeRange[1]}
                    onChange={(e) => handleRangeChange('volumeRange', 1, parseInt(e.target.value) || 1000000)}
                    className="flex-1 px-3 py-2 bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg text-[var(--text-primary)] text-sm"
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>

            {/* Growth Range */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-3">
                Growth Rate (%)
              </label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={filters.growthRange[0]}
                    onChange={(e) => handleRangeChange('growthRange', 0, parseInt(e.target.value) || -100)}
                    className="flex-1 px-3 py-2 bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg text-[var(--text-primary)] text-sm"
                    placeholder="Min"
                  />
                  <span className="text-[var(--text-secondary)]">to</span>
                  <input
                    type="number"
                    value={filters.growthRange[1]}
                    onChange={(e) => handleRangeChange('growthRange', 1, parseInt(e.target.value) || 500)}
                    className="flex-1 px-3 py-2 bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg text-[var(--text-primary)] text-sm"
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>

            {/* Opportunity Range */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-3">
                Opportunity Score (%)
              </label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={filters.opportunityRange[0]}
                    onChange={(e) => handleRangeChange('opportunityRange', 0, parseInt(e.target.value) || 0)}
                    className="flex-1 px-3 py-2 bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg text-[var(--text-primary)] text-sm"
                    placeholder="Min"
                    min="0"
                    max="100"
                  />
                  <span className="text-[var(--text-secondary)]">to</span>
                  <input
                    type="number"
                    value={filters.opportunityRange[1]}
                    onChange={(e) => handleRangeChange('opportunityRange', 1, parseInt(e.target.value) || 100)}
                    className="flex-1 px-3 py-2 bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg text-[var(--text-primary)] text-sm"
                    placeholder="Max"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </div>

            {/* Difficulty Range */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-3">
                Difficulty Score (%)
              </label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={filters.difficultyRange[0]}
                    onChange={(e) => handleRangeChange('difficultyRange', 0, parseInt(e.target.value) || 0)}
                    className="flex-1 px-3 py-2 bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg text-[var(--text-primary)] text-sm"
                    placeholder="Min"
                    min="0"
                    max="100"
                  />
                  <span className="text-[var(--text-secondary)]">to</span>
                  <input
                    type="number"
                    value={filters.difficultyRange[1]}
                    onChange={(e) => handleRangeChange('difficultyRange', 1, parseInt(e.target.value) || 100)}
                    className="flex-1 px-3 py-2 bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg text-[var(--text-primary)] text-sm"
                    placeholder="Max"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Timeframe and Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-3">
                Timeframe
              </label>
              <select
                value={filters.timeframe}
                onChange={(e) => setFilters(prev => ({ ...prev, timeframe: e.target.value }))}
                className="w-full px-3 py-2 bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg text-[var(--text-primary)] text-sm"
              >
                {timeframes.map(tf => (
                  <option key={tf.value} value={tf.value}>{tf.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-3">
                Sort By
              </label>
              <div className="flex space-x-2">
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                  className="flex-1 px-3 py-2 bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg text-[var(--text-primary)] text-sm"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <button
                  onClick={() => setFilters(prev => ({ 
                    ...prev, 
                    sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc' 
                  }))}
                  className="px-3 py-2 bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg text-[var(--text-primary)] hover:bg-[var(--surface-tertiary)]"
                >
                  {filters.sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>
            </div>
          </div>

          {/* Toggle Options */}
          <div>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.trendingOnly}
                onChange={(e) => setFilters(prev => ({ ...prev, trendingOnly: e.target.checked }))}
                className="w-4 h-4 text-[var(--brand-primary)] bg-[var(--surface-secondary)] border-[var(--border-secondary)] rounded focus:ring-[var(--brand-primary)]"
              />
              <span className="text-sm font-medium text-[var(--text-primary)]">
                Show only trending topics
              </span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-[var(--border-secondary)]">
          <Button variant="ghost" onClick={resetFilters}>
            Reset All
          </Button>
          <div className="flex space-x-3">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={applyFilters}>
              Apply Filters ({getActiveFiltersCount()})
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
