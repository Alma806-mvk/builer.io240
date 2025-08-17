import React, { useState, useMemo } from "react";
import {
  SearchIcon,
  FilterIcon,
  XCircleIcon,
  ChevronDownIcon,
} from "../IconComponents";

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
  type: "single" | "multiple";
  defaultValue?: string | string[];
}

interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  searchPlaceholder?: string;

  // Filters
  filterGroups?: FilterGroup[];
  activeFilters: Record<string, string | string[]>;
  onFilterChange: (groupId: string, value: string | string[]) => void;

  // Quick filters
  quickFilters?: Array<{
    id: string;
    label: string;
    active: boolean;
    onClick: () => void;
  }>;

  // Results info
  totalResults?: number;
  filteredResults?: number;

  // Actions
  onClearAll?: () => void;

  // UI
  compact?: boolean;
  className?: string;
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Search...",
  filterGroups = [],
  activeFilters,
  onFilterChange,
  quickFilters = [],
  totalResults,
  filteredResults,
  onClearAll,
  compact = false,
  className = "",
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Count active filters
  const activeFilterCount = useMemo(() => {
    return Object.values(activeFilters).reduce((count, value) => {
      if (Array.isArray(value)) {
        return count + value.length;
      }
      return value ? count + 1 : count;
    }, 0);
  }, [activeFilters]);

  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const clearSearch = () => {
    onSearchChange("");
  };

  const handleFilterChange = (
    groupId: string,
    optionValue: string,
    type: "single" | "multiple",
  ) => {
    if (type === "single") {
      onFilterChange(groupId, optionValue);
    } else {
      const currentValues = (activeFilters[groupId] as string[]) || [];
      const newValues = currentValues.includes(optionValue)
        ? currentValues.filter((v) => v !== optionValue)
        : [...currentValues, optionValue];
      onFilterChange(groupId, newValues);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full pl-12 pr-12 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <XCircleIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Filter Toggle */}
          {filterGroups.length > 0 && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${
                showFilters || activeFilterCount > 0
                  ? "bg-sky-600/20 border-sky-500/50 text-sky-300"
                  : "bg-slate-700/50 border-slate-600/50 text-slate-400 hover:text-slate-200"
              }`}
            >
              <FilterIcon className="h-4 w-4" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="px-2 py-0.5 bg-sky-500 text-white text-xs rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>
          )}

          {/* Quick Filters */}
          {quickFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={filter.onClick}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${
                filter.active
                  ? "bg-purple-600/20 border-purple-500/50 text-purple-300"
                  : "bg-slate-700/50 border-slate-600/50 text-slate-400 hover:text-slate-200"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Results Count & Clear */}
        <div className="flex items-center space-x-4">
          {(totalResults !== undefined || filteredResults !== undefined) && (
            <div className="text-sm text-slate-400">
              {filteredResults !== undefined && totalResults !== undefined ? (
                <span>
                  {filteredResults.toLocaleString()} of{" "}
                  {totalResults.toLocaleString()} results
                </span>
              ) : filteredResults !== undefined ? (
                <span>{filteredResults.toLocaleString()} results</span>
              ) : (
                <span>{totalResults?.toLocaleString()} total</span>
              )}
            </div>
          )}

          {(activeFilterCount > 0 || searchTerm) && onClearAll && (
            <button
              onClick={onClearAll}
              className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && filterGroups.length > 0 && (
        <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30">
          <div
            className={`grid gap-4 ${compact ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}`}
          >
            {filterGroups.map((group) => (
              <div key={group.id} className="space-y-2">
                <button
                  onClick={() => toggleGroup(group.id)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <span className="text-sm font-medium text-slate-300">
                    {group.label}
                  </span>
                  <ChevronDownIcon
                    className={`h-4 w-4 text-slate-400 transition-transform ${
                      expandedGroups.has(group.id) ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {(!compact || expandedGroups.has(group.id)) && (
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {group.options.map((option) => {
                      const isActive =
                        group.type === "single"
                          ? activeFilters[group.id] === option.value
                          : (activeFilters[group.id] as string[])?.includes(
                              option.value,
                            ) || false;

                      return (
                        <label
                          key={option.value}
                          className="flex items-center space-x-2 text-sm cursor-pointer hover:bg-slate-700/30 rounded p-1"
                        >
                          <input
                            type={
                              group.type === "single" ? "radio" : "checkbox"
                            }
                            name={
                              group.type === "single" ? group.id : undefined
                            }
                            checked={isActive}
                            onChange={() =>
                              handleFilterChange(
                                group.id,
                                option.value,
                                group.type,
                              )
                            }
                            className="h-4 w-4 text-sky-500 bg-slate-700 border-slate-600 rounded focus:ring-sky-500 focus:ring-2"
                          />
                          <span className="text-slate-300 flex-grow">
                            {option.label}
                          </span>
                          {option.count !== undefined && (
                            <span className="text-xs text-slate-500">
                              ({option.count})
                            </span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-slate-400">Active filters:</span>
          {Object.entries(activeFilters).map(([groupId, value]) => {
            const group = filterGroups.find((g) => g.id === groupId);
            if (!group || !value) return null;

            const values = Array.isArray(value) ? value : [value];

            return values.map((val) => {
              const option = group.options.find((o) => o.value === val);
              if (!option) return null;

              return (
                <button
                  key={`${groupId}-${val}`}
                  onClick={() => {
                    if (group.type === "single") {
                      onFilterChange(groupId, "");
                    } else {
                      const currentValues =
                        (activeFilters[groupId] as string[]) || [];
                      const newValues = currentValues.filter((v) => v !== val);
                      onFilterChange(groupId, newValues);
                    }
                  }}
                  className="flex items-center space-x-1 px-2 py-1 bg-sky-600/20 text-sky-300 text-xs rounded-full border border-sky-500/30 hover:bg-sky-600/30 transition-colors"
                >
                  <span>
                    {group.label}: {option.label}
                  </span>
                  <XCircleIcon className="h-3 w-3" />
                </button>
              );
            });
          })}
        </div>
      )}
    </div>
  );
};

export default SearchAndFilter;
