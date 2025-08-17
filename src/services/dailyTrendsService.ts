import { collection, doc, getDoc, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface TrendItem {
  id: string;
  keyword: string;
  platform: string;
  volume: number;
  growth: number;
  difficulty: number;
  opportunity: number;
  category: string;
  trending: boolean;
  timeframe: string;
}

export interface PlatformTrend {
  platform: string;
  topTrends: string[];
  growth: number;
  engagement: number;
  color: string;
  activeCreators?: number;
  avgViews?: number;
  contentTypes?: string[];
  bestPostingTimes?: string[];
  audienceDemographics?: {
    primaryAge: string;
    genderSplit: string;
    topCountries: string[];
  };
}

export interface DailyTrendsData {
  trends: TrendItem[];
  platforms: PlatformTrend[];
  generatedAt: string;
  date: string;
  isFallback?: boolean;
  manualTrigger?: boolean;
}

/**
 * Get today's trending data from Firestore
 */
export async function getTodaysTrends(): Promise<DailyTrendsData | null> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const docRef = doc(db, 'dailyTrends', today);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as DailyTrendsData;
    }
    
    // If today's trends don't exist, get the most recent ones
    return await getMostRecentTrends();
    
  } catch (error) {
    console.error('Error fetching today\'s trends:', error);
    return null;
  }
}

/**
 * Get the most recent trends data available
 */
export async function getMostRecentTrends(): Promise<DailyTrendsData | null> {
  try {
    const trendsRef = collection(db, 'dailyTrends');
    const q = query(trendsRef, orderBy('date', 'desc'), limit(1));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return doc.data() as DailyTrendsData;
    }
    
    return null;
    
  } catch (error) {
    console.error('Error fetching most recent trends:', error);
    return null;
  }
}

/**
 * Get trends data for a specific date
 */
export async function getTrendsForDate(date: string): Promise<DailyTrendsData | null> {
  try {
    const docRef = doc(db, 'dailyTrends', date);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as DailyTrendsData;
    }
    
    return null;
    
  } catch (error) {
    console.error(`Error fetching trends for date ${date}:`, error);
    return null;
  }
}

/**
 * Get historical trends data (last N days)
 */
export async function getHistoricalTrends(days: number = 7): Promise<DailyTrendsData[]> {
  try {
    const trendsRef = collection(db, 'dailyTrends');
    const q = query(trendsRef, orderBy('date', 'desc'), limit(days));
    const querySnapshot = await getDocs(q);
    
    const trends: DailyTrendsData[] = [];
    querySnapshot.forEach((doc) => {
      trends.push(doc.data() as DailyTrendsData);
    });
    
    return trends;
    
  } catch (error) {
    console.error('Error fetching historical trends:', error);
    return [];
  }
}

/**
 * Check if trends data is fresh (within last 24 hours)
 */
export function isTrendsDataFresh(trendsData: DailyTrendsData): boolean {
  if (!trendsData.generatedAt) return false;
  
  const generatedTime = new Date(trendsData.generatedAt);
  const now = new Date();
  const hoursDiff = (now.getTime() - generatedTime.getTime()) / (1000 * 60 * 60);
  
  return hoursDiff < 24;
}

/**
 * Get trends by platform
 */
export function getTrendsByPlatform(trendsData: DailyTrendsData, platform: string): TrendItem[] {
  return trendsData.trends.filter(trend => 
    trend.platform.toLowerCase() === platform.toLowerCase()
  );
}

/**
 * Get top trending keywords by category
 */
export function getTopTrendsByCategory(trendsData: DailyTrendsData, category?: string): TrendItem[] {
  let filteredTrends = trendsData.trends;
  
  if (category) {
    filteredTrends = filteredTrends.filter(trend => 
      trend.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  return filteredTrends
    .sort((a, b) => b.opportunity - a.opportunity)
    .slice(0, 10);
}

/**
 * Get fallback trends data when Firestore is unavailable
 */
export function getFallbackTrendsData(): DailyTrendsData {
  return {
    trends: [
      {
        id: 'fallback_ai_content',
        keyword: 'AI content creation',
        platform: 'YouTube',
        volume: 89000,
        growth: 156,
        difficulty: 45,
        opportunity: 92,
        category: 'Technology',
        trending: true,
        timeframe: '24h'
      },
      {
        id: 'fallback_sustainable_fashion',
        keyword: 'sustainable fashion',
        platform: 'Instagram',
        volume: 67000,
        growth: 89,
        difficulty: 38,
        opportunity: 85,
        category: 'Lifestyle',
        trending: true,
        timeframe: '24h'
      },
      {
        id: 'fallback_productivity_hacks',
        keyword: 'productivity hacks',
        platform: 'TikTok',
        volume: 234000,
        growth: 278,
        difficulty: 72,
        opportunity: 88,
        category: 'Education',
        trending: true,
        timeframe: '24h'
      },
      {
        id: 'fallback_plant_recipes',
        keyword: 'plant-based recipes',
        platform: 'YouTube',
        volume: 145000,
        growth: 45,
        difficulty: 55,
        opportunity: 78,
        category: 'Food',
        trending: true,
        timeframe: '24h'
      },
      {
        id: 'fallback_crypto_explained',
        keyword: 'crypto explained',
        platform: 'YouTube',
        volume: 178000,
        growth: -23,
        difficulty: 89,
        opportunity: 65,
        category: 'Finance',
        trending: true,
        timeframe: '24h'
      }
    ],
    platforms: [
      {
        platform: 'TikTok',
        topTrends: ['productivity hacks', 'quick recipes', 'life tips', 'dance trends'],
        growth: 156,
        engagement: 78,
        color: '#ff0050',
        activeCreators: 285000,
        avgViews: 1200000,
        contentTypes: ['short_videos', 'trends', 'challenges'],
        bestPostingTimes: ['6-9AM', '7-9PM'],
        audienceDemographics: {
          primaryAge: '16-24',
          genderSplit: '60% female, 40% male',
          topCountries: ['US', 'UK', 'Canada']
        }
      },
      {
        platform: 'YouTube',
        topTrends: ['AI tutorials', 'investment guides', 'tech reviews', 'how-to content'],
        growth: 89,
        engagement: 65,
        color: '#ff0000',
        activeCreators: 425000,
        avgViews: 850000,
        contentTypes: ['long_form', 'tutorials', 'reviews'],
        bestPostingTimes: ['2-4PM', '8-10PM'],
        audienceDemographics: {
          primaryAge: '25-34',
          genderSplit: '55% male, 45% female',
          topCountries: ['US', 'India', 'UK']
        }
      },
      {
        platform: 'Instagram',
        topTrends: ['fashion trends', 'food photography', 'travel', 'reels content'],
        growth: 134,
        engagement: 72,
        color: '#e4405f',
        activeCreators: 375000,
        avgViews: 650000,
        contentTypes: ['reels', 'stories', 'posts'],
        bestPostingTimes: ['11AM-1PM', '7-9PM'],
        audienceDemographics: {
          primaryAge: '18-29',
          genderSplit: '65% female, 35% male',
          topCountries: ['US', 'Brazil', 'India']
        }
      },
      {
        platform: 'LinkedIn',
        topTrends: ['career advice', 'industry insights', 'networking', 'thought leadership'],
        growth: 67,
        engagement: 45,
        color: '#0077b5',
        activeCreators: 125000,
        avgViews: 125000,
        contentTypes: ['articles', 'posts', 'videos'],
        bestPostingTimes: ['8-10AM', '12-2PM'],
        audienceDemographics: {
          primaryAge: '30-49',
          genderSplit: '50% male, 50% female',
          topCountries: ['US', 'UK', 'Germany']
        }
      }
    ],
    generatedAt: new Date().toISOString(),
    date: new Date().toISOString().split('T')[0],
    isFallback: true
  };
}

/**
 * Hook for React components to use daily trends data
 */
export function useDailyTrends() {
  const [trendsData, setTrendsData] = React.useState<DailyTrendsData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  
  React.useEffect(() => {
    async function fetchTrends() {
      try {
        setLoading(true);
        setError(null);
        
        const data = await getTodaysTrends();
        
        if (data) {
          setTrendsData(data);
        } else {
          // Use fallback data if no trends available
          setTrendsData(getFallbackTrendsData());
        }
        
      } catch (err) {
        console.error('Error in useDailyTrends hook:', err);
        setError('Failed to load trends data');
        setTrendsData(getFallbackTrendsData());
      } finally {
        setLoading(false);
      }
    }
    
    fetchTrends();
  }, []);
  
  return { trendsData, loading, error, refetch: () => fetchTrends() };
}

// Import React for the hook
import * as React from 'react';
