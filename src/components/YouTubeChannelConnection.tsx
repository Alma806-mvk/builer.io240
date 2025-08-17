import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlayCircleIcon,
  LinkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowTopRightOnSquareIcon,
  EyeIcon,
  UserGroupIcon,
  VideoCameraIcon,
  XMarkIcon,
  ArrowPathIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import youtubeService, { YouTubeChannel } from '../services/youtubeService';

interface YouTubeChannelConnectionProps {
  onChannelConnected?: (channel: YouTubeChannel) => void;
  onChannelDisconnected?: () => void;
  className?: string;
}

const YouTubeChannelConnection: React.FC<YouTubeChannelConnectionProps> = ({
  onChannelConnected,
  onChannelDisconnected,
  className = ""
}) => {
  const { user } = useAuth();
  const [connectedChannel, setConnectedChannel] = useState<YouTubeChannel | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionMethod, setConnectionMethod] = useState<'oauth' | 'url' | null>(null);
  const [channelUrl, setChannelUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check for existing connection on mount
  useEffect(() => {
    checkExistingConnection();
  }, [user]);

  const checkExistingConnection = async () => {
    if (!user) return;
    
    try {
      const savedChannel = await youtubeService.getSavedChannelConnection();
      if (savedChannel) {
        setConnectedChannel(savedChannel);
        onChannelConnected?.(savedChannel);
      }
    } catch (error) {
      console.error('Error checking existing connection:', error);
    }
  };

  const handleOAuthConnection = async () => {
    if (!user) {
      setError('Please sign in to connect your YouTube channel.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Get OAuth URL from Firebase function
      const authUrl = await youtubeService.getAuthUrl();

      // Open in popup
      const popup = window.open(
        authUrl,
        'youtube-auth',
        'width=600,height=700,scrollbars=yes,resizable=yes'
      );

      if (!popup) {
        setError('Popup blocked. Please allow popups and try again.');
        setIsLoading(false);
        return;
      }

      // Listen for success message from popup
      const messageListener = (event: MessageEvent) => {
        if (event.data.type === 'YOUTUBE_OAUTH_SUCCESS' && event.data.uid === user.uid) {
          window.removeEventListener('message', messageListener);
          setIsLoading(false);
          setConnectionMethod(null);
          // Check if connection was successful
          setTimeout(checkExistingConnection, 2000);
        }
      };

      window.addEventListener('message', messageListener);

      // Also check if popup was closed manually
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', messageListener);
          setIsLoading(false);
        }
      }, 1000);

    } catch (error) {
      console.error('OAuth connection error:', error);
      setError(error instanceof Error ? error.message : 'Failed to start YouTube authentication');
      setIsLoading(false);
    }
  };

  const handleUrlConnection = async () => {
    if (!channelUrl.trim()) {
      setError('Please enter a YouTube channel URL or handle');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const channel = await youtubeService.getChannelByUrl(channelUrl.trim());
      
      if (!channel) {
        setError('Channel not found. Please check the URL or handle and try again.');
        return;
      }

      // Save the connection
      await youtubeService.saveChannelConnection(channel);
      setConnectedChannel(channel);
      setConnectionMethod(null);
      setChannelUrl('');
      onChannelConnected?.(channel);
      
    } catch (error) {
      console.error('URL connection error:', error);
      setError('Failed to connect to YouTube channel. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await youtubeService.removeChannelConnection();
      setConnectedChannel(null);
      onChannelDisconnected?.();
    } catch (error) {
      console.error('Disconnect error:', error);
      setError('Failed to disconnect channel');
    }
  };

  const formatNumber = (num: string | number): string => {
    const n = typeof num === 'string' ? parseInt(num) : num;
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return n.toString();
  };

  if (!user) {
    return (
      <div className={`bg-slate-800/50 border border-slate-700 rounded-xl p-6 ${className}`}>
        <div className="text-center">
          <InformationCircleIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-300 mb-2">Sign in Required</h3>
          <p className="text-slate-400 text-sm">
            Please sign in to connect your YouTube channel
          </p>
        </div>
      </div>
    );
  }

  if (connectedChannel) {
    return (
      <div className={`bg-gradient-to-br from-red-900/20 to-pink-900/20 border border-red-500/30 rounded-xl p-6 ${className}`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-700">
              {connectedChannel.thumbnails.medium ? (
                <img 
                  src={connectedChannel.thumbnails.medium} 
                  alt={connectedChannel.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <PlayCircleIcon className="w-full h-full p-2 text-red-400" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{connectedChannel.title}</h3>
              <p className="text-green-400 text-sm flex items-center">
                <CheckCircleIcon className="w-4 h-4 mr-1" />
                Connected
              </p>
            </div>
          </div>
          <button
            onClick={handleDisconnect}
            className="text-slate-400 hover:text-red-400 transition-colors"
            title="Disconnect channel"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center text-red-400 mb-1">
              <UserGroupIcon className="w-4 h-4 mr-1" />
            </div>
            <div className="text-white font-semibold">{formatNumber(connectedChannel.statistics.subscriberCount)}</div>
            <div className="text-slate-400 text-xs">Subscribers</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center text-red-400 mb-1">
              <EyeIcon className="w-4 h-4 mr-1" />
            </div>
            <div className="text-white font-semibold">{formatNumber(connectedChannel.statistics.viewCount)}</div>
            <div className="text-slate-400 text-xs">Total Views</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center text-red-400 mb-1">
              <VideoCameraIcon className="w-4 h-4 mr-1" />
            </div>
            <div className="text-white font-semibold">{formatNumber(connectedChannel.statistics.videoCount)}</div>
            <div className="text-slate-400 text-xs">Videos</div>
          </div>
        </div>

        {connectedChannel.customUrl && (
          <a
            href={`https://youtube.com/${connectedChannel.customUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-red-400 hover:text-red-300 text-sm transition-colors"
          >
            View Channel
            <ArrowTopRightOnSquareIcon className="w-4 h-4 ml-1" />
          </a>
        )}

        <div className="mt-4 pt-4 border-t border-slate-700">
          <p className="text-slate-400 text-xs">
            Connected on {connectedChannel.connectedAt.toLocaleDateString()}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-slate-800/50 border border-slate-700 rounded-xl p-6 ${className}`}>
      <div className="text-center mb-6">
        <PlayCircleIcon className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Connect Your YouTube Channel</h3>
        <p className="text-slate-400 text-sm">
          Connect your channel to unlock powerful analytics and optimization features
        </p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4"
        >
          <div className="flex items-center text-red-400 text-sm">
            <ExclamationTriangleIcon className="w-4 h-4 mr-2 flex-shrink-0" />
            {error}
          </div>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {!connectionMethod ? (
          <motion.div
            key="method-selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            <button
              onClick={() => setConnectionMethod('oauth')}
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center"
            >
              <LinkIcon className="w-5 h-5 mr-2" />
              Connect with OAuth (Recommended)
            </button>
            
            <div className="text-center text-slate-400 text-xs">or</div>
            
            <button
              onClick={() => setConnectionMethod('url')}
              disabled={isLoading}
              className="w-full bg-slate-700 hover:bg-slate-600 disabled:bg-slate-700/50 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center"
            >
              <PlayCircleIcon className="w-5 h-5 mr-2" />
              Connect by URL/Handle
            </button>

            <p className="text-slate-500 text-xs text-center mt-4">
              OAuth provides full analytics access, while URL connection provides basic channel information
            </p>
          </motion.div>
        ) : connectionMethod === 'oauth' ? (
          <motion.div
            key="oauth-method"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
              <InformationCircleIcon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <p className="text-blue-300 text-sm mb-2">
                OAuth connection provides full access to your YouTube Analytics data for comprehensive insights
              </p>
              <div className="bg-amber-500/10 border border-amber-500/30 rounded p-2 space-y-2">
                <p className="text-amber-300 text-xs">
                  🧪 Development Mode: Using fallback OAuth flow
                </p>
                <div className="text-amber-200/80 text-xs">
                  <p className="mb-1">If you get "redirect_uri_mismatch", add these to Google Console:</p>
                  <div className="space-y-1">
                    <div>
                      <span className="text-amber-300">JavaScript origins:</span>
                      <p className="text-amber-100 text-xs font-mono bg-amber-500/10 px-1 rounded">
                        {window.location.origin}
                      </p>
                    </div>
                    <div>
                      <span className="text-amber-300">Redirect URIs:</span>
                      <p className="text-amber-100 text-xs font-mono bg-amber-500/10 px-1 rounded">
                        {window.location.origin}/youtube-oauth-test
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleOAuthConnection}
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center mb-3"
            >
              {isLoading ? (
                <ArrowPathIcon className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <LinkIcon className="w-5 h-5 mr-2" />
              )}
              {isLoading ? 'Connecting...' : 'Authorize with YouTube'}
            </button>
            
            <button
              onClick={() => setConnectionMethod(null)}
              className="text-slate-400 hover:text-white text-sm"
            >
              Back to connection options
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="url-method"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                YouTube Channel URL or Handle
              </label>
              <input
                type="text"
                value={channelUrl}
                onChange={(e) => setChannelUrl(e.target.value)}
                placeholder="@channelhandle or https://youtube.com/@channel"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                onKeyPress={(e) => e.key === 'Enter' && handleUrlConnection()}
              />
              <p className="text-slate-500 text-xs mt-1">
                Examples: @MrBeast, https://youtube.com/@channel, or channel name
              </p>
            </div>
            
            <button
              onClick={handleUrlConnection}
              disabled={isLoading || !channelUrl.trim()}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <ArrowPathIcon className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <LinkIcon className="w-5 h-5 mr-2" />
              )}
              {isLoading ? 'Connecting...' : 'Connect Channel'}
            </button>
            
            <button
              onClick={() => setConnectionMethod(null)}
              className="w-full text-slate-400 hover:text-white text-sm"
            >
              Back to connection options
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default YouTubeChannelConnection;
