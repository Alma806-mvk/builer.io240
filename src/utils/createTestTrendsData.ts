import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export async function createTestTrendsData() {
  const today = new Date().toISOString().split('T')[0];
  
  const testData = {
    trends: [
      {
        id: 'test_1',
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
        id: 'test_2',
        keyword: 'sustainable living tips',
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
        id: 'test_3',
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
        id: 'test_4',
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
    platforms: [
      {
        platform: 'TikTok',
        topTrends: ['productivity hacks', 'life tips', 'quick recipes'],
        growth: 156,
        engagement: 78,
        color: '#ff0050'
      },
      {
        platform: 'YouTube',
        topTrends: ['AI tutorials', 'tech reviews', 'how-to guides'],
        growth: 89,
        engagement: 65,
        color: '#ff0000'
      },
      {
        platform: 'Instagram',
        topTrends: ['lifestyle content', 'visual stories', 'reels'],
        growth: 134,
        engagement: 72,
        color: '#e4405f'
      },
      {
        platform: 'LinkedIn',
        topTrends: ['career advice', 'industry insights', 'networking'],
        growth: 67,
        engagement: 45,
        color: '#0077b5'
      }
    ],
    generatedAt: new Date().toISOString(),
    date: today,
    manualTrigger: true
  };

  try {
    await setDoc(doc(db, 'dailyTrends', today), testData);
    console.log('✅ Test trends data created successfully!');
    return testData;
  } catch (error) {
    console.error('❌ Error creating test data:', error);
    throw error;
  }
}
