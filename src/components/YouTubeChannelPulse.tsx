import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  EyeIcon,
  PlusCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  CalendarDaysIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  PlayCircleIcon,
  ChartBarIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
import { 
  youtubeChannelPulseService, 
  YouTubePulseData 
} from '../services/youtubeChannelPulseService';

interface YouTubeChannelPulseProps {
  className?: string;
  onConnect?: () => void;
  isConnected?: boolean;
}

interface FormattedPulseData {
  views: { raw: number; formatted: string };
  newSubscribers: { raw: number; formatted: string };
  watchTimeHours: { raw: number; formatted: string };
  lastUpdated: { raw: Date | string; formatted: string };
}

const YouTubeChannelPulse: React.FC<YouTubeChannelPulseProps> = ({ 
  className = "",
  onConnect,
  isConnected = false
}) => {
  const [pulseData, setPulseData] = useState<FormattedPulseData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasData, setHasData] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load pulse data when component mounts or when connection status changes
  useEffect(() => {
    if (isConnected) {
      loadPulseData();
    } else {
      setPulseData(null);
      setHasData(false);
      setError(null);
    }
  }, [isConnected]);

  const loadPulseData = async () => {
    if (!isConnected) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await youtubeChannelPulseService.getYouTubePulseData();
      
      if (response.hasData && response.data) {
        const formatted = youtubeChannelPulseService.formatPulseData(response.data);
        setPulseData(formatted);
        setHasData(true);
      } else {
        setHasData(false);
        setPulseData(null);
        setError(response.message || 'No data available');
      }
    } catch (err) {
      setError('Failed to load YouTube pulse data');
      setHasData(false);
      setPulseData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualRefresh = async () => {
    if (!isConnected || isRefreshing) return;

    setIsRefreshing(true);
    try {
      await youtubeChannelPulseService.triggerManualSync();
      // Wait a moment for the sync to complete, then reload data
      setTimeout(() => {
        loadPulseData();
        setIsRefreshing(false);
      }, 3000);
    } catch (err) {
      setError('Failed to trigger data refresh');
      setIsRefreshing(false);
    }
  };

  // Not connected state
  if (!isConnected) {
    return (
      <div className={`bg-slate-800/50 border border-slate-700 rounded-xl p-4 ${className}`}>
        <div className="text-center py-8">
          <PlayCircleIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-white font-semibold text-lg mb-2">Your Channel Pulse</h3>
          <p className="text-slate-400 text-sm mb-4">
            Connect your YouTube channel to see yesterday's performance metrics updated daily
          </p>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <InformationCircleIcon className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-blue-300 text-sm font-medium mb-1">Connect Required</p>
                <p className="text-blue-200/80 text-xs">
                  Use the YouTube connection panel on the left to connect your channel and unlock daily performance insights.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className={`bg-gradient-to-br from-red-900/20 to-pink-900/20 border border-red-500/30 rounded-xl p-4 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold text-lg">Your Channel Pulse</h3>
          <div className="animate-spin">
            <ArrowPathIcon className="w-5 h-5 text-red-400" />
          </div>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-slate-700 h-12 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error && !hasData) {
    return (
      <div className={`bg-gradient-to-br from-red-900/20 to-pink-900/20 border border-red-500/30 rounded-xl p-4 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold text-lg">Your Channel Pulse</h3>
          <button
            onClick={loadPulseData}
            disabled={isLoading}
            className="text-red-400 hover:text-red-300 transition-colors"
          >
            <ArrowPathIcon className="w-5 h-5" />
          </button>
        </div>
        
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <InformationCircleIcon className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-300 text-sm font-medium mb-1">No Data Available</p>
              <p className="text-amber-200/80 text-xs">
                {error}
              </p>
              <p className="text-amber-200/60 text-xs mt-2">
                Data syncs automatically daily at 1:00 AM UTC. Manual refresh available below.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleManualRefresh}
          disabled={isRefreshing}
          className="w-full mt-4 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-300 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
        >
          <BoltIcon className={`w-4 h-4 ${isRefreshing ? 'animate-pulse' : ''}`} />
          {isRefreshing ? 'Syncing...' : 'Trigger Manual Sync'}
        </button>
      </div>
    );
  }

  // Data display state
  return (
    <div className={`bg-gradient-to-br from-red-900/20 to-pink-900/20 border border-red-500/30 rounded-xl p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-lg">Your Channel Pulse</h3>
        <button
          onClick={loadPulseData}
          disabled={isLoading}
          className="text-red-400 hover:text-red-300 transition-colors"
          title="Refresh data"
        >
          <ArrowPathIcon className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {pulseData && (
        <div className="space-y-4">
          {/* Yesterday's Performance Metrics */}
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center justify-between bg-slate-800/50 rounded-lg p-3"
            >
              <div className="flex items-center gap-3">
                <div className="bg-red-500/20 p-2 rounded-lg">
                  <EyeIcon className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <p className="text-slate-300 text-sm">Views Yesterday</p>
                  <p className="text-white font-semibold">{pulseData.views.formatted}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-xs">Total</p>
                <p className="text-slate-300 text-sm">{pulseData.views.raw.toLocaleString()}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-between bg-slate-800/50 rounded-lg p-3"
            >
              <div className="flex items-center gap-3">
                <div className="bg-green-500/20 p-2 rounded-lg">
                  <PlusCircleIcon className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-slate-300 text-sm">New Subscribers</p>
                  <p className="text-white font-semibold">{pulseData.newSubscribers.formatted}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-xs">
                  {pulseData.newSubscribers.raw >= 0 ? 'Gained' : 'Lost'}
                </p>
                <p className={`text-sm font-medium ${
                  pulseData.newSubscribers.raw >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {pulseData.newSubscribers.raw >= 0 ? '+' : ''}{pulseData.newSubscribers.raw}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-between bg-slate-800/50 rounded-lg p-3"
            >
              <div className="flex items-center gap-3">
                <div className="bg-purple-500/20 p-2 rounded-lg">
                  <ClockIcon className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-slate-300 text-sm">Watch Time</p>
                  <p className="text-white font-semibold">{pulseData.watchTimeHours.formatted}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-xs">Hours</p>
                <p className="text-slate-300 text-sm">{pulseData.watchTimeHours.raw.toFixed(1)}</p>
              </div>
            </motion.div>
          </div>

          {/* Last Updated Info */}
          <div className="pt-3 border-t border-slate-700">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-400">
                <CalendarDaysIcon className="w-3 h-3" />
                <span>Last updated: {pulseData.lastUpdated.formatted}</span>
              </div>
              <button
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                className="text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                title="Trigger manual sync"
              >
                <BoltIcon className={`w-3 h-3 ${isRefreshing ? 'animate-pulse' : ''}`} />
              </button>
            </div>
          </div>

          {/* Info about daily sync */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <InformationCircleIcon className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-blue-300 text-xs font-medium">Smart Caching Active</p>
                <p className="text-blue-200/80 text-xs">
                  Data automatically syncs daily at 1:00 AM UTC with yesterday's performance metrics.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && hasData && (
        <div className="mt-3 bg-amber-500/10 border border-amber-500/30 rounded-lg p-2">
          <div className="flex items-center gap-2">
            <ExclamationTriangleIcon className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <p className="text-amber-300 text-xs">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default YouTubeChannelPulse;
