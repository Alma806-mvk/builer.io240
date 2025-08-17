import { getFunctions, httpsCallable } from 'firebase/functions';
import { auth } from '../config/firebase';

export interface YouTubePulseData {
  views: number;
  newSubscribers: number;
  watchTimeHours: number;
  lastUpdated: Date | string;
}

export interface YouTubePulseResponse {
  hasData: boolean;
  data?: YouTubePulseData;
  message?: string;
}

class YouTubeChannelPulseService {
  private functions = getFunctions();

  /**
   * Get the current YouTube pulse data for the authenticated user
   */
  async getYouTubePulseData(): Promise<YouTubePulseResponse> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User must be authenticated to get YouTube pulse data');
      }

      const getYouTubePulseData = httpsCallable<any, YouTubePulseResponse>(
        this.functions,
        'getYouTubePulseData'
      );

      const result = await getYouTubePulseData();
      
      // Convert lastUpdated string back to Date if needed
      if (result.data.hasData && result.data.data?.lastUpdated) {
        result.data.data.lastUpdated = new Date(result.data.data.lastUpdated);
      }

      return result.data;
    } catch (error) {
      console.error('Error getting YouTube pulse data:', error);
      throw new Error('Failed to get YouTube pulse data');
    }
  }

  /**
   * Manually trigger a YouTube analytics sync (for testing or emergency use)
   */
  async triggerManualSync(): Promise<{ success: boolean; message: string }> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User must be authenticated to trigger sync');
      }

      const triggerYouTubeAnalyticsSync = httpsCallable<any, { success: boolean; message: string }>(
        this.functions,
        'triggerYouTubeAnalyticsSync'
      );

      const result = await triggerYouTubeAnalyticsSync();
      return result.data;
    } catch (error) {
      console.error('Error triggering manual sync:', error);
      throw new Error('Failed to trigger manual sync');
    }
  }

  /**
   * Get historical YouTube subscriber data for charts
   */
  async getYouTubeHistoricalData(): Promise<{hasData: boolean; data?: Array<{month: string, subscribers: number}>; message?: string}> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User must be authenticated to get YouTube historical data');
      }

      const getYouTubeHistoricalData = httpsCallable<any, {hasData: boolean; data?: Array<{month: string, subscribers: number}>; message?: string}>(
        this.functions,
        'getYouTubeHistoricalData'
      );

      const result = await getYouTubeHistoricalData();
      return result.data;
    } catch (error: any) {
      console.error('Error getting YouTube historical data:', error);

      // If function doesn't exist yet, return graceful fallback
      if (error?.code === 'functions/not-found' || error?.message?.includes('internal')) {
        console.warn('YouTube historical data function not available, using fallback data');
        return {
          hasData: false,
          message: 'Historical data function is being deployed. Using demo data for now.'
        };
      }

      throw new Error('Failed to get YouTube historical data');
    }
  }

  /**
   * Save YouTube refresh token to user's Firestore document
   * This should be called after successful OAuth flow
   */
  async saveYouTubeTokens(refreshToken: string, channelId?: string): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User must be authenticated to save YouTube tokens');
      }

      // Import Firestore dynamically to avoid circular dependencies
      const { doc, updateDoc, getFirestore } = await import('firebase/firestore');
      const db = getFirestore();

      const updateData: any = {
        youtube_refresh_token: refreshToken,
        youtube_connected_at: new Date()
      };

      if (channelId) {
        updateData.youtube_channel_id = channelId;
      }

      await updateDoc(doc(db, 'users', user.uid), updateData);
    } catch (error) {
      console.error('Error saving YouTube tokens:', error);
      throw new Error('Failed to save YouTube connection');
    }
  }

  /**
   * Check if the user has a YouTube connection
   */
  async hasYouTubeConnection(): Promise<boolean> {
    try {
      const user = auth.currentUser;
      if (!user) return false;

      // Import Firestore dynamically to avoid circular dependencies
      const { doc, getDoc, getFirestore } = await import('firebase/firestore');
      const db = getFirestore();

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) return false;

      const userData = userDoc.data();
      return !!userData.youtube_refresh_token;
    } catch (error) {
      console.error('Error checking YouTube connection:', error);
      return false;
    }
  }

  /**
   * Remove YouTube connection from user's Firestore document
   */
  async removeYouTubeConnection(): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User must be authenticated to remove YouTube connection');
      }

      // Import Firestore dynamically to avoid circular dependencies
      const { doc, updateDoc, deleteField, getFirestore } = await import('firebase/firestore');
      const db = getFirestore();

      await updateDoc(doc(db, 'users', user.uid), {
        youtube_refresh_token: deleteField(),
        youtube_channel_id: deleteField(),
        youtube_pulse_data: deleteField(),
        youtube_connected_at: deleteField()
      });
    } catch (error) {
      console.error('Error removing YouTube connection:', error);
      throw new Error('Failed to remove YouTube connection');
    }
  }

  /**
   * Format pulse data for display
   */
  formatPulseData(data: YouTubePulseData) {
    const formatNumber = (num: number): string => {
      if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
      if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
      return num.toString();
    };

    const formatWatchTime = (hours: number): string => {
      if (hours >= 24) return `${(hours / 24).toFixed(1)} days`;
      if (hours >= 1) return `${hours.toFixed(1)} hours`;
      return `${(hours * 60).toFixed(0)} minutes`;
    };

    const formatLastUpdated = (date: Date | string): string => {
      const lastUpdated = typeof date === 'string' ? new Date(date) : date;
      const now = new Date();
      const diffMs = now.getTime() - lastUpdated.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor(diffMs / (1000 * 60));

      if (diffHours >= 24) {
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      } else if (diffHours >= 1) {
        return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      } else if (diffMinutes >= 1) {
        return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
      } else {
        return 'Just now';
      }
    };

    return {
      views: {
        raw: data.views,
        formatted: formatNumber(data.views)
      },
      newSubscribers: {
        raw: data.newSubscribers,
        formatted: formatNumber(data.newSubscribers)
      },
      watchTimeHours: {
        raw: data.watchTimeHours,
        formatted: formatWatchTime(data.watchTimeHours)
      },
      lastUpdated: {
        raw: data.lastUpdated,
        formatted: formatLastUpdated(data.lastUpdated)
      }
    };
  }
}

export const youtubeChannelPulseService = new YouTubeChannelPulseService();
export default youtubeChannelPulseService;
