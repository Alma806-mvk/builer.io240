import { auth } from '../config/firebase';
import { httpsCallable, getFunctions } from 'firebase/functions';

// Environment variables for YouTube API
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const YOUTUBE_CLIENT_ID = import.meta.env.VITE_YOUTUBE_CLIENT_ID;
const YOUTUBE_CLIENT_SECRET = import.meta.env.VITE_YOUTUBE_CLIENT_SECRET;

export interface YouTubeChannel {
  id: string;
  title: string;
  description: string;
  customUrl: string;
  thumbnails: {
    default: string;
    medium: string;
    high: string;
  };
  statistics: {
    subscriberCount: string;
    videoCount: string;
    viewCount: string;
  };
  connectedAt: Date;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnails: {
    default: string;
    medium: string;
    high: string;
  };
  statistics: {
    viewCount: string;
    likeCount: string;
    commentCount: string;
  };
  duration: string;
}

export interface YouTubeAnalytics {
  channel: YouTubeChannel;
  recentVideos: YouTubeVideo[];
  analytics: {
    views: number;
    subscribers: number;
    engagement: number;
    avgViewDuration: number;
    impressions: number;
    clickThroughRate: number;
  };
  topKeywords: string[];
  contentGaps: string[];
}

class YouTubeService {
  private isInitialized = false;
  private accessToken: string | null = null;

  constructor() {
    this.initializeService();
    this.debugEnvironmentVariables();
  }

  private debugEnvironmentVariables() {
    console.group('🔍 YouTube Service Environment Variables');
    console.log('VITE_YOUTUBE_API_KEY:', YOUTUBE_API_KEY ? '✅ Set' : '❌ Missing');
    console.log('VITE_YOUTUBE_CLIENT_ID:', YOUTUBE_CLIENT_ID ? `✅ Set (${YOUTUBE_CLIENT_ID.substring(0, 15)}...)` : '❌ Missing');
    console.log('VITE_YOUTUBE_CLIENT_SECRET:', YOUTUBE_CLIENT_SECRET ? '✅ Set' : '❌ Missing');
    console.log('All VITE env vars:', Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')));
    console.groupEnd();
  }

  private initializeService() {
    if (!YOUTUBE_API_KEY) {
      console.info('🎭 YouTube API key not found. Running in mock mode with sample data.');
      console.info('📝 To use real YouTube data, add VITE_YOUTUBE_API_KEY to your environment variables.');
      this.isInitialized = true; // Still initialize for mock mode
      return;
    }
    console.info('✅ YouTube service initialized with API key.');
    this.isInitialized = true;
  }

  // Generate OAuth URL for user authorization using Firebase Cloud Function
  async getAuthUrl(): Promise<string> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User must be authenticated to connect YouTube channel');
    }

    try {
      const functions = getFunctions();
      const getAuthUrlFunction = httpsCallable(functions, 'getAuthUrl');

      console.log('Calling Firebase function getAuthUrl with user ID:', user.uid);
      const result = await getAuthUrlFunction({ uid: user.uid });
      const data = result.data as { authUrl: string };

      console.log('Successfully got OAuth URL from Firebase function');
      return data.authUrl;
    } catch (error) {
      const firebaseError = error as any;

      // Check if this is the expected "function not found" error
      if (firebaseError?.code === 'functions/internal' || firebaseError?.code === 'functions/not-found') {
        console.log('ℹ️  Firebase function not deployed (expected). Using fallback OAuth flow.');
      } else {
        console.error('Unexpected Firebase function error:', error);
        console.error('Firebase Error Details:', JSON.stringify({
          code: firebaseError?.code,
          message: firebaseError?.message,
          details: firebaseError?.details,
          customData: firebaseError?.customData,
          name: firebaseError?.name
        }, null, 2));
      }

      // Fallback to client-side OAuth URL generation for testing
      console.log('🔄 Using fallback OAuth flow for testing.');
      console.log('📋 Deploy Firebase functions for production use.');

      try {
        return this.generateClientSideAuthUrl(user.uid);
      } catch (fallbackError) {
        console.error('❌ Fallback OAuth generation failed:', fallbackError);
        throw new Error('OAuth configuration error. Please check VITE_YOUTUBE_CLIENT_ID environment variable.');
      }
    }
  }

  // Fallback client-side OAuth URL generation (for testing when functions aren't deployed)
  private generateClientSideAuthUrl(uid: string): string {
    console.log('🔍 Checking environment variables...');
    console.log('VITE_YOUTUBE_CLIENT_ID:', YOUTUBE_CLIENT_ID ? `✅ Found (${YOUTUBE_CLIENT_ID.substring(0, 10)}...)` : '❌ Missing');
    console.log('VITE_YOUTUBE_CLIENT_SECRET:', YOUTUBE_CLIENT_SECRET ? '✅ Found' : '❌ Missing');
    console.log('All available env vars:', Object.keys(import.meta.env).filter(key => key.includes('YOUTUBE')));

    if (!YOUTUBE_CLIENT_ID) {
      console.error('❌ VITE_YOUTUBE_CLIENT_ID is not set!');
      throw new Error('YouTube OAuth not configured. Please set VITE_YOUTUBE_CLIENT_ID.');
    }

    // Generate a simple state parameter for testing
    const state = btoa(JSON.stringify({
      uid,
      timestamp: Date.now(),
      fallback: true
    }));

    const scopes = [
      'https://www.googleapis.com/auth/youtube.readonly',
      'https://www.googleapis.com/auth/yt-analytics.readonly'
    ].join(' ');

    // Use the current domain for redirect URI
    const redirectUri = `${window.location.origin}/youtube-oauth-test`;
    console.log('🔗 Using redirect URI:', redirectUri);
    console.log('🔧 Current domain:', window.location.origin);
    console.log('🔧 Add these to Google Console:');
    console.log('   📋 Authorized JavaScript origins:', window.location.origin);
    console.log('   📋 Authorized redirect URIs:', redirectUri);

    const params = new URLSearchParams({
      client_id: YOUTUBE_CLIENT_ID,
      redirect_uri: redirectUri,
      scope: scopes,
      response_type: 'code',
      access_type: 'offline',
      prompt: 'consent',
      state: state
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  // Check OAuth connection status
  async checkOAuthConnection(): Promise<boolean> {
    const user = auth.currentUser;
    if (!user) return false;

    try {
      // Check if user has a refresh token saved in Firestore
      const { youtubeChannelPulseService } = await import('./youtubeChannelPulseService');
      const hasConnection = await youtubeChannelPulseService.hasYouTubeConnection();
      return hasConnection;
    } catch (error) {
      console.error('Error checking OAuth connection:', error);
      return false;
    }
  }

  // Set access token for authenticated requests
  setAccessToken(token: string) {
    this.accessToken = token;
  }

  // Get channel information by URL or handle
  async getChannelByUrl(channelUrl: string): Promise<YouTubeChannel | null> {
    if (!this.isInitialized) {
      throw new Error('YouTube service not initialized');
    }

    // If no API key, return mock data
    if (!YOUTUBE_API_KEY) {
      console.info(`🎭 Using mock data for channel: ${channelUrl}`);
      return this.getMockChannelData(channelUrl);
    }

    try {
      let channelId = '';
      
      // Extract channel ID from various URL formats
      if (channelUrl.includes('/channel/')) {
        channelId = channelUrl.split('/channel/')[1].split(/[?&]/)[0];
      } else if (channelUrl.includes('/@')) {
        const handle = channelUrl.split('/@')[1].split(/[?&]/)[0];
        channelId = await this.getChannelIdByHandle(handle);
      } else if (channelUrl.startsWith('@')) {
        const handle = channelUrl.substring(1);
        channelId = await this.getChannelIdByHandle(handle);
      } else {
        // Try searching by name
        channelId = await this.getChannelIdBySearch(channelUrl);
      }

      if (!channelId) {
        return null;
      }

      return await this.getChannelById(channelId);
    } catch (error) {
      console.error('Error fetching YouTube channel:', error);
      throw new Error('Failed to fetch channel information');
    }
  }

  // Generate mock channel data for development
  private getMockChannelData(channelInput: string): YouTubeChannel {
    // Extract channel name from input
    let channelName = channelInput.trim();
    if (channelName.startsWith('@')) {
      channelName = channelName.substring(1);
    } else if (channelName.includes('youtube.com/')) {
      const parts = channelName.split('/');
      channelName = parts[parts.length - 1] || channelInput;
      // Handle @username in URL
      if (channelName.startsWith('@')) {
        channelName = channelName.substring(1);
      }
    } else if (channelName.includes('youtu.be/')) {
      const parts = channelName.split('/');
      channelName = parts[parts.length - 1] || channelInput;
    }

    // Clean up any query parameters
    channelName = channelName.split('?')[0];

    // Fallback to a default name if empty
    if (!channelName || channelName.length === 0) {
      channelName = 'UnknownChannel';
    }

    // Generate mock data based on popular channels - updated to real current stats
    const mockChannels = {
      'mrbeast': {
        title: 'MrBeast',
        subscriberCount: '418000000', // Updated to match YT Stats current count
        videoCount: '741',
        viewCount: '30600000000', // Updated to match YT Stats (306M*100 = 30.6B total estimated)
        description: 'I want to make the world a better place before I die.'
      },
      'pewdiepie': {
        title: 'PewDiePie',
        subscriberCount: '111000000',
        videoCount: '4563',
        viewCount: '29100000000',
        description: 'Videos, everyday!'
      },
      'markiplier': {
        title: 'Markiplier',
        subscriberCount: '35400000',
        videoCount: '5892',
        viewCount: '19800000000',
        description: 'Hello everybody, my name is Markiplier!'
      }
    };

    const mockData = mockChannels[channelName.toLowerCase()] || {
      title: channelName,
      subscriberCount: Math.floor(Math.random() * 10000000 + 100000).toString(),
      videoCount: Math.floor(Math.random() * 1000 + 50).toString(),
      viewCount: Math.floor(Math.random() * 1000000000 + 10000000).toString(),
      description: `${channelName} is a popular YouTube channel with engaging content.`
    };

    return {
      id: `mock_${channelName.toLowerCase()}`,
      title: mockData.title,
      description: mockData.description,
      customUrl: `@${channelName}`,
      thumbnails: {
        default: `https://picsum.photos/88/88?random=${channelName}`,
        medium: `https://picsum.photos/240/240?random=${channelName}`,
        high: `https://picsum.photos/800/800?random=${channelName}`
      },
      statistics: {
        subscriberCount: mockData.subscriberCount,
        videoCount: mockData.videoCount,
        viewCount: mockData.viewCount
      },
      connectedAt: new Date()
    };
  }

  // Helper method to get channel ID by handle
  private async getChannelIdByHandle(handle: string): Promise<string> {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(handle)}&type=channel&maxResults=1&key=${YOUTUBE_API_KEY}`
    );
    
    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      return data.items[0].snippet.channelId;
    }
    
    return '';
  }

  // Helper method to get channel ID by search
  private async getChannelIdBySearch(query: string): Promise<string> {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=channel&maxResults=1&key=${YOUTUBE_API_KEY}`
    );
    
    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      return data.items[0].snippet.channelId;
    }
    
    return '';
  }

  // Get channel details by ID
  private async getChannelById(channelId: string): Promise<YouTubeChannel | null> {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${YOUTUBE_API_KEY}`
    );

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return null;
    }

    const channel = data.items[0];
    
    return {
      id: channel.id,
      title: channel.snippet.title,
      description: channel.snippet.description,
      customUrl: channel.snippet.customUrl || '',
      thumbnails: {
        default: channel.snippet.thumbnails?.default?.url || '',
        medium: channel.snippet.thumbnails?.medium?.url || '',
        high: channel.snippet.thumbnails?.high?.url || ''
      },
      statistics: {
        subscriberCount: channel.statistics?.subscriberCount || '0',
        videoCount: channel.statistics?.videoCount || '0',
        viewCount: channel.statistics?.viewCount || '0'
      },
      connectedAt: new Date()
    };
  }

  // Get user's own channel (requires OAuth)
  async getMyChannel(): Promise<YouTubeChannel | null> {
    if (!this.accessToken) {
      throw new Error('User not authenticated with YouTube');
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        }
      );

      const data = await response.json();

      if (!data.items || data.items.length === 0) {
        return null;
      }

      const channel = data.items[0];
      
      return {
        id: channel.id,
        title: channel.snippet.title,
        description: channel.snippet.description,
        customUrl: channel.snippet.customUrl || '',
        thumbnails: {
          default: channel.snippet.thumbnails?.default?.url || '',
          medium: channel.snippet.thumbnails?.medium?.url || '',
          high: channel.snippet.thumbnails?.high?.url || ''
        },
        statistics: {
          subscriberCount: channel.statistics?.subscriberCount || '0',
          videoCount: channel.statistics?.videoCount || '0',
          viewCount: channel.statistics?.viewCount || '0'
        },
        connectedAt: new Date()
      };
    } catch (error) {
      console.error('Error fetching my YouTube channel:', error);
      throw new Error('Failed to fetch your channel information');
    }
  }

  // Get recent videos from a channel
  async getChannelVideos(channelId: string, maxResults: number = 10): Promise<YouTubeVideo[]> {
    if (!this.isInitialized) {
      throw new Error('YouTube service not initialized');
    }

    // If no API key, return mock data
    if (!YOUTUBE_API_KEY) {
      console.info(`🎭 Using mock video data for channel: ${channelId}`);
      return this.getMockChannelVideos(channelId, maxResults);
    }

    try {
      // Get recent uploads
      const searchResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&order=date&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`
      );

      const searchData = await searchResponse.json();

      if (!searchData.items) {
        return [];
      }

      const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');
      
      // Get detailed video information
      const videosResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${YOUTUBE_API_KEY}`
      );

      const videosData = await videosResponse.json();

      return videosData.items?.map((video: any) => ({
        id: video.id,
        title: video.snippet.title,
        description: video.snippet.description,
        publishedAt: video.snippet.publishedAt,
        thumbnails: {
          default: video.snippet.thumbnails?.default?.url || '',
          medium: video.snippet.thumbnails?.medium?.url || '',
          high: video.snippet.thumbnails?.high?.url || ''
        },
        statistics: {
          viewCount: video.statistics?.viewCount || '0',
          likeCount: video.statistics?.likeCount || '0',
          commentCount: video.statistics?.commentCount || '0'
        },
        duration: video.contentDetails?.duration || ''
      })) || [];
    } catch (error) {
      console.error('Error fetching channel videos:', error);
      throw new Error('Failed to fetch channel videos');
    }
  }

  // Generate mock videos for development
  private getMockChannelVideos(channelId: string, maxResults: number): YouTubeVideo[] {
    const videoTitles = [
      "I Gave $1,000,000 To Random People",
      "Last To Leave Circle Wins $500,000",
      "I Built 100 Wells In Africa",
      "World's Largest Cereal Bowl",
      "I Bought Everything In A Store",
      "Last Person To Stop Dancing Wins $20,000",
      "I Survived 50 Hours In Antarctica",
      "World's Most Expensive Vacation",
      "I Gave A Homeless Man A House",
      "Last To Stop Running Wins $20,000",
      "I Built The World's Largest Lego Tower",
      "Anything You Can Carry, I'll Pay For",
      "I Recreated Squid Game In Real Life",
      "World's Largest Pizza",
      "I Gave Away A Private Island"
    ];

    const videos: YouTubeVideo[] = [];
    const now = new Date();

    for (let i = 0; i < Math.min(maxResults, videoTitles.length); i++) {
      const publishDate = new Date(now.getTime() - (i * 7 * 24 * 60 * 60 * 1000)); // Each video a week apart
      const views = Math.floor(Math.random() * 100000000 + 1000000); // 1M to 100M views
      const likes = Math.floor(views * (Math.random() * 0.05 + 0.02)); // 2-7% like rate
      const comments = Math.floor(views * (Math.random() * 0.002 + 0.001)); // 0.1-0.3% comment rate

      videos.push({
        id: `mock_video_${i}`,
        title: videoTitles[i],
        description: `${videoTitles[i]} - An amazing video with incredible content that you won't believe!`,
        publishedAt: publishDate.toISOString(),
        thumbnails: {
          default: `https://picsum.photos/120/90?random=video${i}`,
          medium: `https://picsum.photos/320/180?random=video${i}`,
          high: `https://picsum.photos/480/360?random=video${i}`
        },
        statistics: {
          viewCount: views.toString(),
          likeCount: likes.toString(),
          commentCount: comments.toString()
        },
        duration: `PT${Math.floor(Math.random() * 15 + 5)}M${Math.floor(Math.random() * 60)}S` // 5-20 minutes
      });
    }

    return videos;
  }

  // Get comprehensive analytics for a channel
  async getChannelAnalytics(channelId: string): Promise<YouTubeAnalytics | null> {
    try {
      const channel = await this.getChannelById(channelId);
      if (!channel) return null;

      const recentVideos = await this.getChannelVideos(channel.id, 10);
      
      // Calculate basic analytics from available data
      const totalViews = recentVideos.reduce((sum, video) => 
        sum + parseInt(video.statistics.viewCount || '0'), 0);
      
      const totalLikes = recentVideos.reduce((sum, video) => 
        sum + parseInt(video.statistics.likeCount || '0'), 0);
      
      const totalComments = recentVideos.reduce((sum, video) => 
        sum + parseInt(video.statistics.commentCount || '0'), 0);

      const engagement = totalViews > 0 ? ((totalLikes + totalComments) / totalViews) * 100 : 0;

      // Extract keywords from recent video titles
      const topKeywords = this.extractKeywords(recentVideos.map(v => v.title));

      return {
        channel,
        recentVideos,
        analytics: {
          views: totalViews,
          subscribers: parseInt(channel.statistics.subscriberCount),
          engagement: Math.round(engagement * 100) / 100,
          avgViewDuration: 0, // Would need YouTube Analytics API for this
          impressions: 0, // Would need YouTube Analytics API for this
          clickThroughRate: 0 // Would need YouTube Analytics API for this
        },
        topKeywords,
        contentGaps: [] // Could be enhanced with AI analysis
      };
    } catch (error) {
      console.error('Error getting channel analytics:', error);
      return null;
    }
  }

  // Extract keywords from video titles
  private extractKeywords(titles: string[]): string[] {
    const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'how', 'what', 'why', 'when', 'where', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'cant', 'wont', 'dont', 'doesnt', 'didnt', 'hasnt', 'havent', 'hadnt', 'isnt', 'arent', 'wasnt', 'werent', 'you', 'your', 'my', 'i', 'me', 'we', 'us', 'they', 'them', 'their', 'this', 'that', 'these', 'those']);
    
    const wordCount = new Map<string, number>();
    
    titles.forEach(title => {
      const words = title.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 2 && !commonWords.has(word));
      
      words.forEach(word => {
        wordCount.set(word, (wordCount.get(word) || 0) + 1);
      });
    });
    
    return Array.from(wordCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);
  }

  // Check if YouTube API is available
  isAvailable(): boolean {
    return this.isInitialized; // Available with either real API or mock data
  }

  // Save channel connection to localStorage and Firestore for pulse data
  async saveChannelConnection(channel: YouTubeChannel, tokens?: any): Promise<void> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User must be authenticated to save channel connection');
    }

    try {
      const channelData = {
        ...channel,
        userId: user.uid,
        tokens: tokens // Store encrypted in production
      };

      // Save to localStorage for immediate access
      localStorage.setItem(`youtube_channel_${user.uid}`, JSON.stringify(channelData));

      // If we have tokens with refresh_token, save to Firestore for pulse data
      if (tokens?.refresh_token) {
        try {
          const { youtubeChannelPulseService } = await import('./youtubeChannelPulseService');
          await youtubeChannelPulseService.saveYouTubeTokens(tokens.refresh_token, channel.id);
        } catch (error) {
          console.warn('Failed to save tokens for pulse data:', error);
          // Don't throw here as the main connection still succeeded
        }
      }
    } catch (error) {
      console.error('Error saving channel connection:', error);
      throw new Error('Failed to save channel connection');
    }
  }

  // Get saved channel connection
  async getSavedChannelConnection(): Promise<YouTubeChannel | null> {
    const user = auth.currentUser;
    if (!user) return null;

    try {
      const saved = localStorage.getItem(`youtube_channel_${user.uid}`);
      if (!saved) return null;

      const channelData = JSON.parse(saved);
      
      // Restore access token if available
      if (channelData.tokens?.access_token) {
        this.setAccessToken(channelData.tokens.access_token);
      }
      
      return {
        ...channelData,
        connectedAt: new Date(channelData.connectedAt)
      };
    } catch (error) {
      console.error('Error getting saved channel connection:', error);
      return null;
    }
  }

  // Remove channel connection
  async removeChannelConnection(): Promise<void> {
    const user = auth.currentUser;
    if (!user) return;

    try {
      localStorage.removeItem(`youtube_channel_${user.uid}`);
      this.accessToken = null;

      // Also remove from Firestore for pulse data
      try {
        const { youtubeChannelPulseService } = await import('./youtubeChannelPulseService');
        await youtubeChannelPulseService.removeYouTubeConnection();
      } catch (error) {
        console.warn('Failed to remove Firestore connection data:', error);
        // Don't throw here as the main disconnection still succeeded
      }
    } catch (error) {
      console.error('Error removing channel connection:', error);
      throw new Error('Failed to remove channel connection');
    }
  }
}

export const youtubeService = new YouTubeService();
export default youtubeService;
