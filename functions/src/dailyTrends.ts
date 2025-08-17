import * as functions from 'firebase-functions';
import { GoogleGenerativeAI } from '@google/genai';
import { getFirestore } from 'firebase-admin/firestore';

interface TrendItem {
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

interface DailyTrendsData {
  trends: TrendItem[];
  generatedAt: string;
  date: string;
  platforms: {
    platform: string;
    topTrends: string[];
    growth: number;
    engagement: number;
    color: string;
  }[];
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

// Scheduled function to run daily at midnight UTC
export const fetchDailyTrends = functions.pubsub.schedule('0 0 * * *')
  .timeZone('UTC')
  .onRun(async (context) => {
    console.log('Starting daily trends fetch...');
    
    try {
      const db = getFirestore();
      const today = new Date().toISOString().split('T')[0];
      
      // Check if trends for today already exist
      const existingDoc = await db.collection('dailyTrends').doc(today).get();
      if (existingDoc.exists) {
        console.log(`Trends for ${today} already exist. Skipping fetch.`);
        return null;
      }

      // Generate trends using Gemini API
      const trendsData = await generateDailyTrends();
      
      // Store in Firestore with today's date as document ID
      await db.collection('dailyTrends').doc(today).set({
        ...trendsData,
        generatedAt: new Date().toISOString(),
        date: today
      });

      console.log(`Successfully stored daily trends for ${today}`);
      return { success: true, date: today, trendsCount: trendsData.trends.length };
      
    } catch (error) {
      console.error('Error fetching daily trends:', error);
      
      // Store fallback data if API fails
      const fallbackData = getFallbackTrends();
      const today = new Date().toISOString().split('T')[0];
      
      const db = getFirestore();
      await db.collection('dailyTrends').doc(today).set({
        ...fallbackData,
        generatedAt: new Date().toISOString(),
        date: today,
        isFallback: true
      });
      
      return { error: error.message, fallbackUsed: true };
    }
  });

async function generateDailyTrends(): Promise<DailyTrendsData> {
  const prompt = `
Generate comprehensive trending data for content creators across major social media platforms. Provide realistic trending data for today's date.

Return a JSON response with this exact structure:
{
  "trends": [
    {
      "id": "unique_id",
      "keyword": "trending topic",
      "platform": "YouTube|Instagram|TikTok|LinkedIn|Twitter",
      "volume": number_between_10000_300000,
      "growth": percentage_between_-50_500,
      "difficulty": percentage_between_20_95,
      "opportunity": percentage_between_40_98,
      "category": "Technology|Lifestyle|Education|Entertainment|Business|Health|Fashion|Food|Finance|Gaming|Sports|News",
      "trending": true,
      "timeframe": "24h"
    }
  ],
  "platforms": [
    {
      "platform": "TikTok",
      "topTrends": ["trend1", "trend2", "trend3"],
      "growth": percentage_number,
      "engagement": percentage_number,
      "color": "#ff0050",
      "activeCreators": number_between_50000_500000,
      "avgViews": number_between_100000_2000000,
      "contentTypes": ["short_videos", "trends", "challenges"],
      "bestPostingTimes": ["6-9AM", "7-9PM"],
      "audienceDemographics": {
        "primaryAge": "16-24",
        "genderSplit": "60% female, 40% male",
        "topCountries": ["US", "UK", "Canada"]
      }
    }
  ]
}

Include:
- 8-12 trending topics across different platforms
- Mix of evergreen and timely trending content
- Realistic metrics based on current social media trends
- Enhanced platform data with creator metrics, audience insights, and optimal posting times
- 4-5 platform summaries (TikTok, YouTube, Instagram, LinkedIn, Twitter)
- Focus on content creation opportunities
- Consider seasonal trends, current events, and emerging technologies
- Include platform-specific performance metrics and audience data

Make the data realistic and useful for content creators looking for trending opportunities and platform optimization.
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  // Clean and parse JSON response
  const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
  
  try {
    const parsedData = JSON.parse(cleanedText);
    
    // Validate and ensure required structure
    if (!parsedData.trends || !Array.isArray(parsedData.trends)) {
      throw new Error('Invalid trends data structure');
    }
    
    // Add IDs if missing and validate structure
    parsedData.trends = parsedData.trends.map((trend: any, index: number) => ({
      id: trend.id || `trend_${Date.now()}_${index}`,
      keyword: trend.keyword || `Trending Topic ${index + 1}`,
      platform: trend.platform || 'YouTube',
      volume: Number(trend.volume) || Math.floor(Math.random() * 200000) + 50000,
      growth: Number(trend.growth) || Math.floor(Math.random() * 300) + 20,
      difficulty: Number(trend.difficulty) || Math.floor(Math.random() * 40) + 30,
      opportunity: Number(trend.opportunity) || Math.floor(Math.random() * 40) + 60,
      category: trend.category || 'Technology',
      trending: true,
      timeframe: '24h'
    }));
    
    // Ensure platforms data exists
    if (!parsedData.platforms || !Array.isArray(parsedData.platforms)) {
      parsedData.platforms = getDefaultPlatforms();
    }
    
    return parsedData;
    
  } catch (parseError) {
    console.error('Error parsing Gemini response:', parseError);
    throw new Error('Failed to parse AI response');
  }
}

function getDefaultPlatforms() {
  return [
    {
      platform: 'TikTok',
      topTrends: ['viral dances', 'life hacks', 'comedy skits'],
      growth: 156,
      engagement: 78,
      color: '#ff0050'
    },
    {
      platform: 'YouTube',
      topTrends: ['tutorials', 'reviews', 'vlogs'],
      growth: 89,
      engagement: 65,
      color: '#ff0000'
    },
    {
      platform: 'Instagram',
      topTrends: ['reels', 'stories', 'IGTV'],
      growth: 134,
      engagement: 72,
      color: '#e4405f'
    },
    {
      platform: 'LinkedIn',
      topTrends: ['thought leadership', 'industry insights', 'career tips'],
      growth: 67,
      engagement: 45,
      color: '#0077b5'
    }
  ];
}

function getFallbackTrends(): DailyTrendsData {
  return {
    trends: [
      {
        id: 'fallback_1',
        keyword: 'AI productivity tools',
        platform: 'YouTube',
        volume: 125000,
        growth: 180,
        difficulty: 65,
        opportunity: 85,
        category: 'Technology',
        trending: true,
        timeframe: '24h'
      },
      {
        id: 'fallback_2',
        keyword: 'sustainable living',
        platform: 'Instagram',
        volume: 89000,
        growth: 95,
        difficulty: 45,
        opportunity: 78,
        category: 'Lifestyle',
        trending: true,
        timeframe: '24h'
      },
      {
        id: 'fallback_3',
        keyword: 'remote work setup',
        platform: 'TikTok',
        volume: 156000,
        growth: 145,
        difficulty: 55,
        opportunity: 82,
        category: 'Business',
        trending: true,
        timeframe: '24h'
      },
      {
        id: 'fallback_4',
        keyword: 'healthy meal prep',
        platform: 'YouTube',
        volume: 78000,
        growth: 67,
        difficulty: 40,
        opportunity: 75,
        category: 'Health',
        trending: true,
        timeframe: '24h'
      }
    ],
    platforms: getDefaultPlatforms()
  };
}

// Manual trigger function for testing
export const triggerDailyTrends = functions.https.onRequest(async (req, res) => {
  console.log('Manual trigger for daily trends fetch...');
  
  try {
    const db = getFirestore();
    const today = new Date().toISOString().split('T')[0];
    
    // Generate trends using Gemini API
    const trendsData = await generateDailyTrends();
    
    // Store in Firestore with today's date as document ID
    await db.collection('dailyTrends').doc(today).set({
      ...trendsData,
      generatedAt: new Date().toISOString(),
      date: today,
      manualTrigger: true
    });

    res.json({ 
      success: true, 
      date: today, 
      trendsCount: trendsData.trends.length,
      message: 'Daily trends manually generated and stored'
    });
    
  } catch (error) {
    console.error('Error in manual trigger:', error);
    res.status(500).json({ error: error.message });
  }
});
