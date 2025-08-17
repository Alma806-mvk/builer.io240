import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  EyeIcon,
  UserGroupIcon,
  VideoCameraIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  PlayCircleIcon,
  ArrowTopRightOnSquareIcon,
  SparklesIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
import youtubeService, { YouTubeChannel, YouTubeVideo, YouTubeAnalytics } from '../services/youtubeService';
import YouTubeChannelPulse from './YouTubeChannelPulse';

interface YouTubeStatsWidgetProps {
  channel: YouTubeChannel | null;
  className?: string;
}

interface YouTubeQuickActionsProps {
  channel: YouTubeChannel | null;
  onGenerateContent?: (type: string, context: string) => void;
  className?: string;
}

interface YouTubeRecentVideosProps {
  channel: YouTubeChannel | null;
  className?: string;
}

interface YouTubeInsightsProps {
  channel: YouTubeChannel | null;
  className?: string;
}

// Main stats widget for right sidebar
export const YouTubeStatsWidget: React.FC<YouTubeStatsWidgetProps> = ({ 
  channel, 
  className = "" 
}) => {
  const [analytics, setAnalytics] = useState<YouTubeAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (channel) {
      loadAnalytics();
    }
  }, [channel]);

  const loadAnalytics = async () => {
    if (!channel) return;
    
    setIsLoading(true);
    try {
      const data = await youtubeService.getChannelAnalytics(channel.id);
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num: string | number): string => {
    const n = typeof num === 'string' ? parseInt(num) : num;
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return n.toString();
  };

  if (!channel) {
    return (
      <div className={`bg-slate-800/50 border border-slate-700 rounded-xl p-4 ${className}`}>
        <div className="text-center py-8">
          <PlayCircleIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-slate-400 text-sm">Connect YouTube channel to view stats</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-red-900/20 to-pink-900/20 border border-red-500/30 rounded-xl p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-sm">YouTube Analytics</h3>
        <button
          onClick={loadAnalytics}
          disabled={isLoading}
          className="text-red-400 hover:text-red-300 transition-colors"
        >
          <ChartBarIcon className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <UserGroupIcon className="w-4 h-4 text-red-400" />
            <span className="text-slate-300 text-sm">Subscribers</span>
          </div>
          <span className="text-white font-semibold text-sm">
            {formatNumber(channel.statistics.subscriberCount)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <EyeIcon className="w-4 h-4 text-red-400" />
            <span className="text-slate-300 text-sm">Total Views</span>
          </div>
          <span className="text-white font-semibold text-sm">
            {formatNumber(channel.statistics.viewCount)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <VideoCameraIcon className="w-4 h-4 text-red-400" />
            <span className="text-slate-300 text-sm">Videos</span>
          </div>
          <span className="text-white font-semibold text-sm">
            {formatNumber(channel.statistics.videoCount)}
          </span>
        </div>

        {analytics && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ArrowTrendingUpIcon className="w-4 h-4 text-green-400" />
              <span className="text-slate-300 text-sm">Engagement</span>
            </div>
            <span className="text-green-400 font-semibold text-sm">
              {analytics.analytics.engagement.toFixed(1)}%
            </span>
          </div>
        )}
      </div>

      {channel.customUrl && (
        <div className="mt-4 pt-3 border-t border-slate-700">
          <a
            href={`https://youtube.com/${channel.customUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-red-400 hover:text-red-300 text-xs transition-colors"
          >
            View Channel
            <ArrowTopRightOnSquareIcon className="w-3 h-3 ml-1" />
          </a>
        </div>
      )}
    </div>
  );
};

// Quick actions widget for left sidebar
export const YouTubeQuickActions: React.FC<YouTubeQuickActionsProps> = ({ 
  channel, 
  onGenerateContent,
  className = "" 
}) => {
  const quickActions = [
    {
      id: 'title-generator',
      label: 'YouTube Title',
      icon: SparklesIcon,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30'
    },
    {
      id: 'thumbnail-concept',
      label: 'Thumbnail Idea',
      icon: EyeIcon,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30'
    },
    {
      id: 'script-generator',
      label: 'Video Script',
      icon: PlayCircleIcon,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'border-green-500/30'
    },
    {
      id: 'trend-analysis',
      label: 'Trend Topics',
      icon: ArrowTrendingUpIcon,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/30'
    }
  ];

  const handleAction = (actionId: string) => {
    // Create prompt text for AI assistant based on action
    const prompts = {
      'title-generator': 'Create YouTube titles',
      'thumbnail-concept': 'Generate thumbnail ideas',
      'script-generator': 'Write a video script',
      'trend-analysis': 'Find trending topics'
    };

    const promptText = prompts[actionId as keyof typeof prompts] || 'Generate content';
    const channelContext = channel ? ` for ${channel.title}` : '';
    const fullPrompt = `${promptText}${channelContext}`;

    // Input text into AI assistant if function is available
    if ((window as any).setAIAssistantInput) {
      (window as any).setAIAssistantInput(fullPrompt);
    }

    // Keep original functionality as fallback
    const context = channel ? `for YouTube channel: ${channel.title}` : 'for YouTube';
    onGenerateContent?.(actionId, context);
  };

  return (
    <div className={`bg-slate-800/50 border border-slate-700 rounded-xl p-4 ${className}`}>
      <h3 className="text-white font-semibold text-sm mb-4">Quick Create</h3>
      
      <div className="space-y-2">
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleAction(action.id)}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 hover:scale-[1.02] ${action.bg} ${action.border} border hover:shadow-lg`}
          >
            <action.icon className={`w-4 h-4 ${action.color}`} />
            <span className="text-slate-300 text-sm font-medium">{action.label}</span>
          </button>
        ))}
      </div>

      {!channel && (
        <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
          <p className="text-amber-300 text-xs">
            Connect your YouTube channel for personalized content suggestions
          </p>
        </div>
      )}
    </div>
  );
};

// Recent videos widget
export const YouTubeRecentVideos: React.FC<YouTubeRecentVideosProps> = ({ 
  channel, 
  className = "" 
}) => {
  const [recentVideos, setRecentVideos] = useState<YouTubeVideo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (channel) {
      loadRecentVideos();
    }
  }, [channel]);

  const loadRecentVideos = async () => {
    if (!channel) return;
    
    setIsLoading(true);
    try {
      const videos = await youtubeService.getChannelVideos(channel.id, 5);
      setRecentVideos(videos);
    } catch (error) {
      console.error('Error loading recent videos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num: string): string => {
    const n = parseInt(num);
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return n.toString();
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  if (!channel) {
    return (
      <div className={`bg-slate-800/50 border border-slate-700 rounded-xl p-4 ${className}`}>
        <div className="text-center py-6">
          <VideoCameraIcon className="w-6 h-6 text-slate-400 mx-auto mb-2" />
          <p className="text-slate-400 text-sm">Connect channel to view recent videos</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-slate-800/50 border border-slate-700 rounded-xl p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-sm">Recent Videos</h3>
        <button
          onClick={loadRecentVideos}
          disabled={isLoading}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <VideoCameraIcon className="w-4 h-4" />
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-slate-700 h-12 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {recentVideos.slice(0, 5).map((video) => (
            <div key={video.id} className="bg-slate-700/50 rounded-lg p-3 hover:bg-slate-700 transition-colors">
              <h4 className="text-white text-xs font-medium mb-1 line-clamp-2">
                {video.title}
              </h4>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center space-x-2">
                  <EyeIcon className="w-3 h-3" />
                  <span>{formatNumber(video.statistics.viewCount)}</span>
                </div>
                <span>{formatDate(video.publishedAt)}</span>
              </div>
            </div>
          ))}
          
          {recentVideos.length === 0 && !isLoading && (
            <p className="text-slate-400 text-sm text-center py-4">
              No recent videos found
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// Export the Channel Pulse widget
export { default as YouTubeChannelPulse } from './YouTubeChannelPulse';

// YouTube insights widget
export const YouTubeInsights: React.FC<YouTubeInsightsProps> = ({ 
  channel, 
  className = "" 
}) => {
  const [analytics, setAnalytics] = useState<YouTubeAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (channel) {
      loadAnalytics();
    }
  }, [channel]);

  const loadAnalytics = async () => {
    if (!channel) return;
    
    setIsLoading(true);
    try {
      const data = await youtubeService.getChannelAnalytics(channel.id);
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!channel) {
    return (
      <div className={`bg-slate-800/50 border border-slate-700 rounded-xl p-4 ${className}`}>
        <div className="text-center py-6">
          <BoltIcon className="w-6 h-6 text-slate-400 mx-auto mb-2" />
          <p className="text-slate-400 text-sm">Connect channel for AI insights</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border border-purple-500/30 rounded-xl p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-sm">AI Insights</h3>
        <BoltIcon className="w-4 h-4 text-purple-400" />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse bg-slate-700 h-12 rounded-lg"></div>
          ))}
        </div>
      ) : analytics ? (
        <div className="space-y-4">
          {analytics.topKeywords.length > 0 && (
            <div>
              <h4 className="text-purple-300 text-xs font-medium mb-2">Top Keywords</h4>
              <div className="flex flex-wrap gap-1">
                {analytics.topKeywords.slice(0, 6).map((keyword, index) => (
                  <span 
                    key={index}
                    className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
            <h4 className="text-purple-300 text-xs font-medium mb-1">Performance Tip</h4>
            <p className="text-slate-300 text-xs">
              Your engagement rate is {analytics.analytics.engagement.toFixed(1)}%. 
              {analytics.analytics.engagement > 3 
                ? " Excellent! Keep creating engaging content." 
                : " Try adding more calls-to-action to boost engagement."}
            </p>
          </div>

          <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-3">
            <h4 className="text-indigo-300 text-xs font-medium mb-1">Content Suggestion</h4>
            <p className="text-slate-300 text-xs">
              Based on your top keywords, consider creating content about: 
              {analytics.topKeywords.slice(0, 2).join(', ')}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-slate-400 text-sm">Loading insights...</p>
        </div>
      )}
    </div>
  );
};
