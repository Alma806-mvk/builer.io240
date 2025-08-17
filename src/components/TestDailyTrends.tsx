import React, { useState } from 'react';
import { Button } from './ui/WorldClassComponents';
import { RefreshCw, Zap, Database, Clock } from 'lucide-react';
import { getTodaysTrends, getMostRecentTrends, getHistoricalTrends } from '../services/dailyTrendsService';
import { createTestTrendsData } from '../utils/createTestTrendsData';

interface TestDailyTrendsProps {
  onClose?: () => void;
}

export const TestDailyTrends: React.FC<TestDailyTrendsProps> = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testGetTodaysTrends = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTodaysTrends();
      setResult({ type: 'Today\'s Trends', data });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testGetMostRecentTrends = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMostRecentTrends();
      setResult({ type: 'Most Recent Trends', data });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testGetHistoricalTrends = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getHistoricalTrends(3);
      setResult({ type: 'Historical Trends (3 days)', data });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testCreateData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await createTestTrendsData();
      setResult({ type: 'Test Data Created', data });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testManualTrigger = async () => {
    setLoading(true);
    setError(null);
    try {
      // Call the manual trigger Cloud Function
      const response = await fetch('/api/trigger-daily-trends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setResult({ type: 'Manual Trigger Result', data });
    } catch (err) {
      // If direct API call fails, show instruction for manual testing
      setError('Manual trigger requires deploying Cloud Functions. Use the Firebase Console to test.');
      setResult({ 
        type: 'Manual Testing Instructions', 
        data: {
          instruction: 'To test manual trigger:',
          steps: [
            '1. Deploy Cloud Functions: npm run deploy (in functions folder)',
            '2. Go to Firebase Console > Functions',
            '3. Find triggerDailyTrends function',
            '4. Click "Test" to manually trigger trend generation',
            '5. Check Firestore > dailyTrends collection for results'
          ]
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Test Daily Trends System</h2>
          <Button variant="ghost" onClick={onClose}>✕</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Button
            onClick={testCreateData}
            disabled={loading}
            variant="primary"
            className="flex items-center space-x-2"
          >
            <Database className="w-4 h-4" />
            <span>Create Test Data</span>
          </Button>
          <Button 
            onClick={testGetTodaysTrends}
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <Clock className="w-4 h-4" />
            <span>Get Today's Trends</span>
          </Button>

          <Button 
            onClick={testGetMostRecentTrends}
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <Database className="w-4 h-4" />
            <span>Get Most Recent</span>
          </Button>

          <Button 
            onClick={testGetHistoricalTrends}
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Get Historical (3 days)</span>
          </Button>

          <Button 
            onClick={testManualTrigger}
            disabled={loading}
            variant="primary"
            className="flex items-center space-x-2"
          >
            <Zap className="w-4 h-4" />
            <span>Manual Trigger</span>
          </Button>
        </div>

        {loading && (
          <div className="text-center py-4">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
            <p>Testing...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <h3 className="font-semibold mb-2">{result.type}</h3>
            <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold mb-2">System Architecture</h3>
          <div className="text-sm space-y-2">
            <p><strong>Scheduled Function:</strong> Runs daily at 0:00 UTC</p>
            <p><strong>Storage:</strong> Firestore collection "dailyTrends"</p>
            <p><strong>API:</strong> Gemini API for trend generation</p>
            <p><strong>Fallback:</strong> Mock data when API unavailable</p>
            <p><strong>Sharing:</strong> Same data displayed to all users</p>
          </div>
        </div>
      </div>
    </div>
  );
};
