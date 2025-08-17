import React, { useEffect, useState } from 'react';
import youtubeService from '../services/youtubeService';

const YouTubeCallback: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing YouTube authorization...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the authorization code from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');

        if (error) {
          throw new Error(`Authorization failed: ${error}`);
        }

        if (!code) {
          throw new Error('No authorization code received');
        }

        setMessage('Exchanging authorization code for access token...');

        // Exchange the code for tokens
        const tokens = await youtubeService.exchangeCodeForTokens(code);
        
        setMessage('Getting your channel information...');

        // Get the user's channel
        const channel = await youtubeService.getMyChannel();
        
        if (!channel) {
          throw new Error('Could not retrieve channel information');
        }

        // Save the connection
        await youtubeService.saveChannelConnection(channel, tokens);

        setStatus('success');
        setMessage(`Successfully connected ${channel.title}!`);

        // Close the popup window and notify the parent
        if (window.opener) {
          window.opener.postMessage({
            type: 'youtube-auth-success',
            channel: channel
          }, window.location.origin);
          window.close();
        } else {
          // If not in popup, redirect to Studio Hub
          setTimeout(() => {
            window.location.href = '/#studioHub';
          }, 2000);
        }

      } catch (error) {
        console.error('YouTube callback error:', error);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Failed to connect YouTube channel');
        
        // Close popup on error too
        if (window.opener) {
          window.opener.postMessage({
            type: 'youtube-auth-error',
            error: error instanceof Error ? error.message : 'Unknown error'
          }, window.location.origin);
          setTimeout(() => window.close(), 3000);
        }
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-6">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          {status === 'loading' && (
            <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          )}
          {status === 'success' && (
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
          {status === 'error' && (
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}
        </div>

        <h2 className="text-xl font-bold text-white mb-3">
          {status === 'loading' && 'Connecting YouTube Channel'}
          {status === 'success' && 'YouTube Connected!'}
          {status === 'error' && 'Connection Failed'}
        </h2>

        <p className="text-slate-300 text-sm mb-6">
          {message}
        </p>

        {status === 'success' && !window.opener && (
          <p className="text-slate-400 text-xs">
            Redirecting to Studio Hub...
          </p>
        )}

        {status === 'error' && (
          <button
            onClick={() => window.close()}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors"
          >
            Close Window
          </button>
        )}
      </div>
    </div>
  );
};

export default YouTubeCallback;
