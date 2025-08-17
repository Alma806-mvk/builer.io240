import { useState, useEffect, useCallback } from 'react';
import { deepAnalysisService, DeepAnalysisData } from '../services/deepAnalysisService';
import { TrendSearchResult } from '../services/enhancedTrendSearchService';

interface UseDeepAnalysisOptions {
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
}

interface UseDeepAnalysisReturn {
  data: DeepAnalysisData | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  analyze: (results: TrendSearchResult[], query: string) => Promise<void>;
  refresh: () => Promise<void>;
  clearCache: () => void;
}

export function useDeepAnalysis(options: UseDeepAnalysisOptions = {}): UseDeepAnalysisReturn {
  const {
    autoRefresh = false,
    refreshInterval = 5 * 60 * 1000 // 5 minutes default
  } = options;

  const [data, setData] = useState<DeepAnalysisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [currentResults, setCurrentResults] = useState<TrendSearchResult[]>([]);
  const [currentQuery, setCurrentQuery] = useState<string>('');

  const analyze = useCallback(async (results: TrendSearchResult[], query: string) => {
    if (results.length === 0) {
      setData(null);
      setError('No trend data available for analysis');
      return;
    }

    setLoading(true);
    setError(null);
    setCurrentResults(results);
    setCurrentQuery(query);

    try {
      const analysisData = await deepAnalysisService.analyzeSearchResults(results, query);
      setData(analysisData);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze trend data');
      console.error('Deep analysis error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    if (currentResults.length > 0 && currentQuery) {
      await analyze(currentResults, currentQuery);
    }
  }, [analyze, currentResults, currentQuery]);

  const clearCache = useCallback(() => {
    // Clear service cache by creating a new service instance
    setData(null);
    setLastUpdated(null);
    setError(null);
    setCurrentResults([]);
    setCurrentQuery('');
  }, []);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh || !data || currentResults.length === 0) {
      return;
    }

    const interval = setInterval(() => {
      refresh();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, data, refresh, currentResults.length]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    analyze,
    refresh,
    clearCache
  };
}

// Utility hook for formatting analysis data for display
export function useFormattedAnalysis(data: DeepAnalysisData | null) {
  return {
    metrics: data ? {
      trendVelocity: {
        ...data.metrics.trendVelocity,
        formattedValue: `${data.metrics.trendVelocity.value}%`,
        formattedChange: `${data.metrics.trendVelocity.change > 0 ? '+' : ''}${data.metrics.trendVelocity.change}%`
      },
      marketSaturation: {
        ...data.metrics.marketSaturation,
        formattedValue: `${data.metrics.marketSaturation.value}%`,
        formattedChange: `${data.metrics.marketSaturation.change > 0 ? '+' : ''}${data.metrics.marketSaturation.change}%`
      },
      viralCoefficient: {
        ...data.metrics.viralCoefficient,
        formattedValue: `${data.metrics.viralCoefficient.value}`,
        formattedChange: `${data.metrics.viralCoefficient.change > 0 ? '+' : ''}${data.metrics.viralCoefficient.change}`
      },
      revenuePotential: {
        ...data.metrics.revenuePotential,
        formattedValue: `$${data.metrics.revenuePotential.value}M`,
        formattedChange: `${data.metrics.revenuePotential.change > 0 ? '+' : ''}${data.metrics.revenuePotential.change}%`
      }
    } : null,
    
    predictive: data ? {
      thirtyDayForecast: {
        ...data.predictive.thirtyDayForecast,
        formattedGrowth: `+${data.predictive.thirtyDayForecast.growthPrediction}% growth`,
        confidenceLevel: data.predictive.thirtyDayForecast.confidence > 80 ? 'high' : 
                         data.predictive.thirtyDayForecast.confidence > 65 ? 'medium' : 'low'
      },
      peakTiming: {
        ...data.predictive.peakTiming,
        formattedTiming: `${data.predictive.peakTiming.daysToOptimal} days`,
        urgency: data.predictive.peakTiming.daysToOptimal <= 7 ? 'urgent' : 
                 data.predictive.peakTiming.daysToOptimal <= 14 ? 'moderate' : 'relaxed'
      },
      sustainability: {
        ...data.predictive.sustainability,
        formattedScore: `${data.predictive.sustainability.longTermScore}%`,
        rating: data.predictive.sustainability.longTermScore > 80 ? 'excellent' :
                data.predictive.sustainability.longTermScore > 60 ? 'good' : 'fair'
      }
    } : null,

    intelligence: data ? {
      audienceSentiment: {
        ...data.intelligence.audienceSentiment,
        emoji: data.intelligence.audienceSentiment.positivity > 90 ? '😍' :
               data.intelligence.audienceSentiment.positivity > 75 ? '😊' :
               data.intelligence.audienceSentiment.positivity > 60 ? '🙂' : '😐'
      },
      contentGaps: {
        ...data.intelligence.contentGaps,
        priority: data.intelligence.contentGaps.count > 20 ? 'high' :
                  data.intelligence.contentGaps.count > 10 ? 'medium' : 'low'
      },
      monetizationScore: {
        ...data.intelligence.monetizationScore,
        rating: data.intelligence.monetizationScore.score > 8 ? 'excellent' :
                data.intelligence.monetizationScore.score > 6 ? 'good' :
                data.intelligence.monetizationScore.score > 4 ? 'fair' : 'poor',
        emoji: '💰'
      },
      riskAssessment: {
        ...data.intelligence.riskAssessment,
        emoji: data.intelligence.riskAssessment.level === 'low' ? '🛡️' :
               data.intelligence.riskAssessment.level === 'medium' ? '⚠️' : '🚨',
        color: data.intelligence.riskAssessment.level === 'low' ? 'green' :
               data.intelligence.riskAssessment.level === 'medium' ? 'yellow' : 'red'
      }
    } : null,

    lastUpdated: data ? data.lastUpdated.toLocaleString() : null
  };
}

// Hook for specific metric tracking
export function useMetricTracking(metricName: keyof DeepAnalysisData['metrics']) {
  const [history, setHistory] = useState<Array<{ value: number; timestamp: Date }>>([]);

  const addDataPoint = useCallback((data: DeepAnalysisData | null) => {
    if (!data) return;

    const metric = data.metrics[metricName];
    const newPoint = {
      value: metric.value,
      timestamp: data.lastUpdated
    };

    setHistory(prev => {
      const updated = [...prev, newPoint];
      // Keep only last 20 data points
      return updated.slice(-20);
    });
  }, [metricName]);

  const getTrend = useCallback(() => {
    if (history.length < 2) return 'neutral';
    
    const recent = history.slice(-3);
    const isIncreasing = recent.every((point, i) => 
      i === 0 || point.value >= recent[i - 1].value
    );
    const isDecreasing = recent.every((point, i) => 
      i === 0 || point.value <= recent[i - 1].value
    );

    return isIncreasing ? 'up' : isDecreasing ? 'down' : 'neutral';
  }, [history]);

  return {
    history,
    addDataPoint,
    trend: getTrend(),
    hasData: history.length > 0
  };
}
