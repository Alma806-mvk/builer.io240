import React, { useState } from 'react';

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

export const SimpleTrendsTest: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [testData, setTestData] = useState<TrendItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const createTestData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockTrendsData: TrendItem[] = [
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
        }
      ];
      
      setTestData(mockTrendsData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Trends Analysis</h1>
        <p className="text-text-secondary mb-4">Daily trending content analysis</p>
        
        <button
          onClick={createTestData}
          disabled={loading}
          className="px-4 py-2 bg-accent-purple text-white rounded-lg hover:bg-accent-purple/80 disabled:opacity-50"
        >
          {loading ? 'Creating Test Data...' : 'Create Test Trends Data'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      )}

      {testData && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-text-primary">Generated Trends:</h2>
          {testData.map((trend, index) => (
            <div key={trend.id} className="bg-bg-secondary rounded-lg p-4 border border-border-primary">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-text-primary">#{index + 1} {trend.keyword}</h3>
                <span className="text-sm bg-accent-purple text-white px-2 py-1 rounded">
                  {trend.platform}
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-text-secondary">Volume:</span>
                  <div className="font-semibold text-text-primary">
                    {trend.volume.toLocaleString()}
                  </div>
                </div>
                <div>
                  <span className="text-text-secondary">Growth:</span>
                  <div className={`font-semibold ${trend.growth > 0 ? 'text-accent-success' : 'text-accent-error'}`}>
                    {trend.growth > 0 ? '+' : ''}{trend.growth}%
                  </div>
                </div>
                <div>
                  <span className="text-text-secondary">Difficulty:</span>
                  <div className="font-semibold text-text-primary">{trend.difficulty}%</div>
                </div>
                <div>
                  <span className="text-text-secondary">Opportunity:</span>
                  <div className="font-semibold text-accent-success">{trend.opportunity}%</div>
                </div>
              </div>
              
              <div className="mt-2 flex items-center space-x-4 text-sm">
                <span className="text-text-secondary">Category: <span className="text-text-primary">{trend.category}</span></span>
                <span className="text-text-secondary">Timeframe: <span className="text-text-primary">{trend.timeframe}</span></span>
                <span className={`px-2 py-1 rounded text-xs ${trend.trending ? 'bg-accent-success text-white' : 'bg-border-secondary text-text-secondary'}`}>
                  {trend.trending ? 'Trending' : 'Stable'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 p-4 bg-bg-tertiary rounded-lg border border-border-secondary">
        <h3 className="font-semibold text-text-primary mb-2">About Daily Trends System</h3>
        <div className="text-sm text-text-secondary space-y-1">
          <p>🤖 <strong>Automated Generation:</strong> Cloud Function runs daily at 0:00 UTC</p>
          <p>📊 <strong>Shared Data:</strong> One API call serves all users</p>
          <p>💾 <strong>Storage:</strong> Trends stored in Firestore database</p>
          <p>🔄 <strong>Fallback:</strong> Mock data when API unavailable</p>
        </div>
      </div>
    </div>
  );
};
