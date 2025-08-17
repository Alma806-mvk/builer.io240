import { TrendSearchResult } from './enhancedTrendSearchService';

export interface DeepAnalysisMetrics {
  trendVelocity: {
    value: number;
    change: number;
    description: string;
  };
  marketSaturation: {
    value: number;
    change: number;
    description: string;
  };
  viralCoefficient: {
    value: number;
    change: number;
    description: string;
  };
  revenuePotential: {
    value: number;
    change: number;
    description: string;
  };
}

export interface PredictiveMetrics {
  thirtyDayForecast: {
    growthPrediction: number;
    confidence: number;
    description: string;
  };
  peakTiming: {
    daysToOptimal: number;
    confidence: number;
    description: string;
  };
  sustainability: {
    longTermScore: number;
    timeframe: string;
    description: string;
  };
}

export interface MarketIntelligence {
  audienceSentiment: {
    positivity: number;
    description: string;
  };
  contentGaps: {
    count: number;
    opportunities: string[];
  };
  monetizationScore: {
    score: number;
    potential: string;
  };
  riskAssessment: {
    level: 'low' | 'medium' | 'high';
    factors: string[];
  };
}

export interface StrategicInsights {
  timeOptimal: {
    bestTimes: string[];
    timezone: string;
    confidence: number;
  };
  geographic: {
    hotspots: string[];
    emerging: string[];
  };
  demographics: {
    primaryAge: string;
    income: string;
    preferences: string[];
  };
  aiRecommendations: {
    contentStrategy: string[];
    platforms: string[];
    timing: string;
  };
}

export interface DeepAnalysisData {
  metrics: DeepAnalysisMetrics;
  predictive: PredictiveMetrics;
  intelligence: MarketIntelligence;
  insights: StrategicInsights;
  lastUpdated: Date;
}

class DeepAnalysisService {
  private static instance: DeepAnalysisService;
  private cache: Map<string, { data: DeepAnalysisData; expires: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static getInstance(): DeepAnalysisService {
    if (!DeepAnalysisService.instance) {
      DeepAnalysisService.instance = new DeepAnalysisService();
    }
    return DeepAnalysisService.instance;
  }

  async analyzeSearchResults(searchResults: TrendSearchResult[], query: string): Promise<DeepAnalysisData> {
    const cacheKey = `${query}_${searchResults.length}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && cached.expires > Date.now()) {
      return cached.data;
    }

    const analysis = this.performDeepAnalysis(searchResults, query);
    
    this.cache.set(cacheKey, {
      data: analysis,
      expires: Date.now() + this.CACHE_DURATION
    });

    return analysis;
  }

  private performDeepAnalysis(results: TrendSearchResult[], query: string): DeepAnalysisData {
    if (results.length === 0) {
      return this.getEmptyAnalysis();
    }

    return {
      metrics: this.calculateMetrics(results),
      predictive: this.calculatePredictive(results),
      intelligence: this.calculateIntelligence(results),
      insights: this.generateInsights(results, query),
      lastUpdated: new Date()
    };
  }

  private calculateMetrics(results: TrendSearchResult[]): DeepAnalysisMetrics {
    const totalResults = results.length;
    const avgGrowth = results.reduce((sum, r) => sum + r.metrics.growth, 0) / totalResults;
    const avgCompetition = results.reduce((sum, r) => sum + r.metrics.competitionLevel, 0) / totalResults;
    const avgViral = results.reduce((sum, r) => sum + r.metrics.viralPotential, 0) / totalResults;
    const avgMonetization = results.reduce((sum, r) => sum + r.metrics.monetizationScore, 0) / totalResults;

    // Calculate trend velocity based on growth patterns
    const recentGrowth = results.slice(0, 5).reduce((sum, r) => sum + r.metrics.growth, 0) / Math.min(5, totalResults);
    const trendVelocity = Math.max(50, Math.min(500, recentGrowth * 3.5));

    // Market saturation inverse of competition
    const marketSaturation = Math.max(10, Math.min(80, avgCompetition * 8));

    // Viral coefficient based on viral potential and engagement
    const avgEngagement = results.reduce((sum, r) => sum + r.metrics.engagement, 0) / totalResults;
    const viralCoefficient = Math.max(0.5, Math.min(3.0, (avgViral + avgEngagement) / 50));

    // Revenue potential based on monetization scores and volume
    const avgVolume = results.reduce((sum, r) => sum + r.metrics.volume, 0) / totalResults;
    const revenuePotential = Math.max(100000, Math.min(10000000, avgMonetization * avgVolume * 100));

    return {
      trendVelocity: {
        value: Math.round(trendVelocity),
        change: Math.round((trendVelocity - 200) / 2),
        description: 'acceleration rate'
      },
      marketSaturation: {
        value: Math.round(marketSaturation * 10) / 10,
        change: Math.round((50 - marketSaturation) / 5),
        description: 'competition level'
      },
      viralCoefficient: {
        value: Math.round(viralCoefficient * 100) / 100,
        change: Math.round((viralCoefficient - 1.5) * 100) / 100,
        description: 'spread factor'
      },
      revenuePotential: {
        value: Math.round(revenuePotential / 100000) / 10,
        change: Math.round((revenuePotential - 2000000) / 50000),
        description: 'estimated value'
      }
    };
  }

  private calculatePredictive(results: TrendSearchResult[]): PredictiveMetrics {
    const avgTrendScore = results.reduce((sum, r) => sum + r.metrics.trendScore, 0) / results.length;
    const avgGrowth = results.reduce((sum, r) => sum + r.metrics.growth, 0) / results.length;
    const avgViralPotential = results.reduce((sum, r) => sum + r.metrics.viralPotential, 0) / results.length;

    // 30-day forecast based on trend scores and growth
    const forecastGrowth = Math.max(50, Math.min(400, avgTrendScore * 4 + avgGrowth * 2));
    const confidence = Math.max(60, Math.min(95, avgTrendScore + avgViralPotential));

    // Peak timing based on viral potential and current momentum
    const momentum = (avgGrowth + avgViralPotential) / 2;
    const daysToOptimal = Math.max(3, Math.min(30, 20 - momentum / 5));

    // Sustainability based on trend quality and competition
    const avgCompetition = results.reduce((sum, r) => sum + r.metrics.competitionLevel, 0) / results.length;
    const sustainability = Math.max(40, Math.min(95, avgTrendScore + (100 - avgCompetition)));

    return {
      thirtyDayForecast: {
        growthPrediction: Math.round(forecastGrowth),
        confidence: Math.round(confidence),
        description: confidence > 80 ? 'High confidence prediction' : confidence > 65 ? 'Medium confidence prediction' : 'Moderate confidence prediction'
      },
      peakTiming: {
        daysToOptimal: Math.round(daysToOptimal),
        confidence: Math.round((momentum + avgTrendScore) / 2),
        description: 'Optimal content window'
      },
      sustainability: {
        longTermScore: Math.round(sustainability),
        timeframe: sustainability > 80 ? 'Long-term' : sustainability > 60 ? 'Medium-term' : 'Short-term',
        description: 'Lasting trend potential'
      }
    };
  }

  private calculateIntelligence(results: TrendSearchResult[]): MarketIntelligence {
    const avgEngagement = results.reduce((sum, r) => sum + r.metrics.engagement, 0) / results.length;
    const avgCompetition = results.reduce((sum, r) => sum + r.metrics.competitionLevel, 0) / results.length;
    const avgMonetization = results.reduce((sum, r) => sum + r.metrics.monetizationScore, 0) / results.length;

    // Audience sentiment based on engagement
    const audienceSentiment = Math.max(70, Math.min(98, avgEngagement + 20));

    // Content gaps based on competition levels
    const gapCount = Math.max(5, Math.min(50, Math.round((100 - avgCompetition) / 3)));
    
    // Generate opportunity examples
    const opportunities = this.generateOpportunities(results, gapCount);

    // Risk assessment
    const volatility = results.reduce((sum, r) => {
      const variance = Math.abs(r.metrics.growth - avgEngagement);
      return sum + variance;
    }, 0) / results.length;

    const riskLevel = volatility > 30 ? 'high' : volatility > 15 ? 'medium' : 'low';

    return {
      audienceSentiment: {
        positivity: Math.round(audienceSentiment),
        description: `${Math.round(audienceSentiment)}% positive engagement`
      },
      contentGaps: {
        count: gapCount,
        opportunities: opportunities.slice(0, 5)
      },
      monetizationScore: {
        score: Math.round(avgMonetization * 10) / 10,
        potential: avgMonetization > 8 ? 'High commercial potential' : avgMonetization > 6 ? 'Medium commercial potential' : 'Moderate commercial potential'
      },
      riskAssessment: {
        level: riskLevel,
        factors: this.generateRiskFactors(riskLevel, avgCompetition, volatility)
      }
    };
  }

  private generateInsights(results: TrendSearchResult[], query: string): StrategicInsights {
    const platforms = results.reduce((acc, r) => {
      acc[r.platform] = (acc[r.platform] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topPlatforms = Object.entries(platforms)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([platform]) => platform);

    // Analyze content types for recommendations
    const contentTypes = results.map(r => r.category).filter((v, i, a) => a.indexOf(v) === i);
    
    return {
      timeOptimal: {
        bestTimes: ['2-4 PM EST', '7-9 PM EST', '10 AM - 12 PM EST'],
        timezone: 'EST',
        confidence: 75
      },
      geographic: {
        hotspots: ['US West Coast', 'UK', 'Australia', 'Canada'],
        emerging: ['Southeast Asia', 'Brazil', 'Germany']
      },
      demographics: {
        primaryAge: '25-34',
        income: 'Medium to High',
        preferences: ['Video content', 'Interactive content', 'Educational content']
      },
      aiRecommendations: {
        contentStrategy: this.generateContentStrategy(results, query),
        platforms: topPlatforms,
        timing: 'Peak engagement during weekday afternoons and weekend mornings'
      }
    };
  }

  private generateOpportunities(results: TrendSearchResult[], count: number): string[] {
    const categories = [...new Set(results.map(r => r.category))];
    const niches = [...new Set(results.map(r => r.niche))];
    
    const opportunities = [
      `Untapped ${categories[0]} content in emerging markets`,
      `Cross-platform ${niches[0]} content strategy`,
      `Interactive ${categories[1] || 'educational'} content formats`,
      `Long-form content in ${niches[1] || 'trending'} niches`,
      `Mobile-first ${categories[2] || 'entertainment'} content`,
      `Community-driven content initiatives`,
      `AI-assisted content personalization`,
      `Live streaming opportunities`,
      `User-generated content campaigns`,
      `Seasonal content optimization`
    ];

    return opportunities.slice(0, Math.min(count, opportunities.length));
  }

  private generateRiskFactors(level: string, competition: number, volatility: number): string[] {
    if (level === 'low') {
      return ['Stable market conditions', 'Low competition detected', 'Consistent engagement patterns'];
    } else if (level === 'medium') {
      return ['Moderate market fluctuations', 'Increasing competition', 'Variable engagement rates'];
    } else {
      return ['High market volatility', 'Saturated competition', 'Unpredictable engagement patterns'];
    }
  }

  private generateContentStrategy(results: TrendSearchResult[], query: string): string[] {
    const avgEngagement = results.reduce((sum, r) => sum + r.metrics.engagement, 0) / results.length;
    const topCategories = [...new Set(results.map(r => r.category))].slice(0, 3);
    
    const strategies = [
      `Focus on ${topCategories[0]} content with practical applications`,
      'Implement cross-platform distribution strategy',
      'Create tutorial-style content for maximum engagement',
      'Develop series-based content for audience retention',
      'Optimize for mobile consumption patterns'
    ];

    if (avgEngagement > 70) {
      strategies.push('Leverage high engagement for viral potential');
    }

    if (query.toLowerCase().includes('ai') || query.toLowerCase().includes('tech')) {
      strategies.push('Incorporate trending technology topics');
    }

    return strategies.slice(0, 4);
  }

  private getEmptyAnalysis(): DeepAnalysisData {
    return {
      metrics: {
        trendVelocity: { value: 0, change: 0, description: 'No data available' },
        marketSaturation: { value: 0, change: 0, description: 'No data available' },
        viralCoefficient: { value: 0, change: 0, description: 'No data available' },
        revenuePotential: { value: 0, change: 0, description: 'No data available' }
      },
      predictive: {
        thirtyDayForecast: { growthPrediction: 0, confidence: 0, description: 'Insufficient data' },
        peakTiming: { daysToOptimal: 0, confidence: 0, description: 'No timing data' },
        sustainability: { longTermScore: 0, timeframe: 'Unknown', description: 'No sustainability data' }
      },
      intelligence: {
        audienceSentiment: { positivity: 0, description: 'No sentiment data' },
        contentGaps: { count: 0, opportunities: [] },
        monetizationScore: { score: 0, potential: 'Unknown potential' },
        riskAssessment: { level: 'medium', factors: ['Insufficient data for assessment'] }
      },
      insights: {
        timeOptimal: { bestTimes: [], timezone: 'UTC', confidence: 0 },
        geographic: { hotspots: [], emerging: [] },
        demographics: { primaryAge: 'Unknown', income: 'Unknown', preferences: [] },
        aiRecommendations: { contentStrategy: ['Search for trends to get recommendations'], platforms: [], timing: 'No timing data' }
      },
      lastUpdated: new Date()
    };
  }
}

export const deepAnalysisService = DeepAnalysisService.getInstance();
