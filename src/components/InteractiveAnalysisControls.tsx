import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  Share2, 
  Bookmark, 
  Calendar,
  Copy,
  ExternalLink,
  Filter,
  Settings,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import { Button, Card, Badge } from './ui/WorldClassComponents';
import { DeepAnalysisData } from '../services/deepAnalysisService';

interface InteractiveAnalysisControlsProps {
  data: DeepAnalysisData | null;
  onExport?: (format: 'pdf' | 'csv' | 'json') => void;
  onShare?: () => void;
  onBookmark?: () => void;
  onSchedule?: () => void;
  onCopyInsights?: () => void;
}

export const InteractiveAnalysisControls: React.FC<InteractiveAnalysisControlsProps> = ({
  data,
  onExport,
  onShare,
  onBookmark,
  onSchedule,
  onCopyInsights
}) => {
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'metrics' | 'predictive' | 'intelligence'>('all');

  if (!data) return null;

  const exportOptions = [
    { format: 'pdf' as const, label: 'PDF Report', icon: <Download className="w-4 h-4" /> },
    { format: 'csv' as const, label: 'CSV Data', icon: <BarChart3 className="w-4 h-4" /> },
    { format: 'json' as const, label: 'JSON Export', icon: <ExternalLink className="w-4 h-4" /> }
  ];

  const quickActions = [
    {
      icon: <Share2 className="w-4 h-4" />,
      label: 'Share Analysis',
      onClick: onShare,
      variant: 'secondary' as const
    },
    {
      icon: <Bookmark className="w-4 h-4" />,
      label: 'Save',
      onClick: onBookmark,
      variant: 'secondary' as const
    },
    {
      icon: <Calendar className="w-4 h-4" />,
      label: 'Schedule',
      onClick: onSchedule,
      variant: 'secondary' as const
    },
    {
      icon: <Copy className="w-4 h-4" />,
      label: 'Copy Insights',
      onClick: onCopyInsights,
      variant: 'ghost' as const
    }
  ];

  const filterOptions = [
    { key: 'all' as const, label: 'All Data', count: 4 },
    { key: 'metrics' as const, label: 'Metrics', count: 4 },
    { key: 'predictive' as const, label: 'Predictive', count: 3 },
    { key: 'intelligence' as const, label: 'Intelligence', count: 4 }
  ];

  return (
    <Card className="p-4 bg-gradient-to-r from-slate-50/50 to-white/50 border-[var(--border-secondary)]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left Side - Filters */}
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-[var(--text-secondary)]" />
          <span className="text-sm font-medium text-[var(--text-secondary)]">View:</span>
          <div className="flex space-x-1">
            {filterOptions.map((option) => (
              <Button
                key={option.key}
                variant={activeFilter === option.key ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setActiveFilter(option.key)}
                className="relative"
              >
                {option.label}
                <Badge 
                  variant="secondary" 
                  className="ml-1 text-xs"
                >
                  {option.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center space-x-2">
          {/* Quick Actions */}
          <div className="flex space-x-1">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant}
                size="sm"
                onClick={action.onClick}
                className="flex items-center space-x-1"
              >
                {action.icon}
                <span className="hidden sm:inline">{action.label}</span>
              </Button>
            ))}
          </div>

          {/* Export Dropdown */}
          <div className="relative">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowExportOptions(!showExportOptions)}
              className="flex items-center space-x-1"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </Button>

            {showExportOptions && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-[var(--border-primary)] z-50"
              >
                <div className="p-2">
                  {exportOptions.map((option) => (
                    <button
                      key={option.format}
                      onClick={() => {
                        onExport?.(option.format);
                        setShowExportOptions(false);
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] rounded-md transition-colors"
                    >
                      {option.icon}
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Analysis Summary */}
      <div className="mt-4 pt-4 border-t border-[var(--border-secondary)]">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-[var(--text-secondary)]">
                Trend Score: <strong className="text-[var(--text-primary)]">{data.metrics.trendVelocity.value}%</strong>
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <BarChart3 className="w-4 h-4 text-blue-500" />
              <span className="text-[var(--text-secondary)]">
                Confidence: <strong className="text-[var(--text-primary)]">{data.predictive.thirtyDayForecast.confidence}%</strong>
              </span>
            </div>
          </div>
          <div className="text-xs text-[var(--text-tertiary)]">
            Last updated: {data.lastUpdated.toLocaleTimeString()}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default InteractiveAnalysisControls;
