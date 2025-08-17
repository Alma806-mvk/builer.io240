import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircleIcon, ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

// Test OAuth callback handler (for development when Firebase functions aren't deployed)
const YouTubeOAuthTest: React.FC = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Processing OAuth callback...');

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const error = urlParams.get('error');

        if (error) {
          setStatus('error');
          setMessage(`OAuth error: ${error}`);
          return;
        }

        if (!code || !state) {
          setStatus('error');
          setMessage('Missing authorization code or state parameter');
          return;
        }

        // Decode state to get user info
        let stateData;
        try {
          stateData = JSON.parse(atob(state));
        } catch (err) {
          setStatus('error');
          setMessage('Invalid state parameter');
          return;
        }

        if (!user || user.uid !== stateData.uid) {
          setStatus('error');
          setMessage('User mismatch or not authenticated');
          return;
        }

        // For testing, we'll just save a test connection to localStorage
        // In production, this would be handled by the Firebase function
        const testChannelData = {
          id: 'test-channel-id',
          title: 'Test YouTube Channel',
          description: 'Test channel for OAuth flow',
          customUrl: '@testchannel',
          thumbnails: {
            default: '',
            medium: '',
            high: ''
          },
          statistics: {
            subscriberCount: '1000',
            videoCount: '50',
            viewCount: '100000'
          },
          connectedAt: new Date(),
          userId: user.uid,
          oauthTest: true
        };

        localStorage.setItem(`youtube_channel_${user.uid}`, JSON.stringify(testChannelData));

        setStatus('success');
        setMessage('YouTube channel connected successfully (test mode)!');

        // Send success message to parent window
        if (window.opener) {
          window.opener.postMessage({
            type: 'YOUTUBE_OAUTH_SUCCESS',
            uid: user.uid
          }, '*');
        }

        // Close window after delay
        setTimeout(() => {
          window.close();
        }, 3000);

      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        setMessage('An unexpected error occurred during authorization');
      }
    };

    handleOAuthCallback();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 max-w-md w-full text-center">
        {status === 'processing' && (
          <>
            <ArrowPathIcon className="w-16 h-16 text-blue-400 mx-auto mb-4 animate-spin" />
            <h1 className="text-2xl font-bold text-white mb-2">Processing...</h1>
            <p className="text-gray-300">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircleIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Success!</h1>
            <p className="text-gray-300 mb-4">{message}</p>
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3">
              <p className="text-green-300 text-sm">
                This is a test connection. Deploy Firebase functions for full OAuth flow.
              </p>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <ExclamationTriangleIcon className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Error</h1>
            <p className="text-gray-300 mb-4">{message}</p>
            <button
              onClick={() => window.close()}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Close Window
            </button>
          </>
        )}

        <p className="text-gray-400 text-xs mt-4">
          This window will close automatically in a few seconds.
        </p>
      </div>
    </div>
  );
};

export default YouTubeOAuthTest;
