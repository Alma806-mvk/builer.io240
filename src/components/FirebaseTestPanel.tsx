import React, { useState } from 'react';
import { testFirebaseSaving, testNumericalRatings, logTestResults } from '../utils/testFirebaseSaving';
import { auth } from '../config/firebase';

interface TestResult {
  success: boolean;
  message: string;
  details?: any;
}

export const FirebaseTestPanel: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult | null>(null);
  const [testType, setTestType] = useState<'full' | 'ratings'>('full');

  const runTest = async () => {
    if (!auth.currentUser) {
      setResults({
        success: false,
        message: 'Please sign in first to test Firebase functionality',
      });
      return;
    }

    setIsRunning(true);
    setResults(null);

    try {
      let testResults: TestResult;
      
      if (testType === 'full') {
        testResults = await testFirebaseSaving();
      } else {
        testResults = await testNumericalRatings();
      }

      setResults(testResults);
      logTestResults(testResults);
    } catch (error: any) {
      const errorResult = {
        success: false,
        message: `Test execution failed: ${error.message}`,
        details: { error: error.message },
      };
      setResults(errorResult);
      logTestResults(errorResult);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: '#1e293b',
      border: '1px solid #334155',
      borderRadius: '8px',
      padding: '16px',
      minWidth: '300px',
      maxWidth: '400px',
      zIndex: 1000,
      color: '#f1f5f9',
      fontSize: '14px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
    }}>
      <h3 style={{ 
        margin: '0 0 12px 0', 
        fontSize: '16px', 
        fontWeight: '600',
        color: '#3b82f6',
      }}>
        🧪 Firebase Test Panel
      </h3>

      <div style={{ marginBottom: '12px' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#94a3b8' }}>
          Test Type:
        </p>
        <select
          value={testType}
          onChange={(e) => setTestType(e.target.value as 'full' | 'ratings')}
          style={{
            width: '100%',
            padding: '6px 8px',
            borderRadius: '4px',
            border: '1px solid #374151',
            background: '#0f172a',
            color: '#f1f5f9',
            fontSize: '12px',
          }}
        >
          <option value="full">Full Test (Generation + Saving + Ratings)</option>
          <option value="ratings">Ratings Test Only</option>
        </select>
      </div>

      <button
        onClick={runTest}
        disabled={isRunning}
        style={{
          width: '100%',
          padding: '8px 12px',
          borderRadius: '4px',
          border: 'none',
          background: isRunning ? '#6b7280' : '#3b82f6',
          color: 'white',
          cursor: isRunning ? 'not-allowed' : 'pointer',
          fontSize: '12px',
          fontWeight: '500',
          marginBottom: '12px',
        }}
      >
        {isRunning ? '🔄 Running Test...' : '▶️ Run Test'}
      </button>

      {!auth.currentUser && (
        <div style={{
          padding: '8px',
          background: '#dc2626',
          borderRadius: '4px',
          marginBottom: '12px',
          fontSize: '12px',
        }}>
          ⚠️ Please sign in to run tests
        </div>
      )}

      {auth.currentUser && (
        <div style={{
          padding: '6px 8px',
          background: '#059669',
          borderRadius: '4px',
          marginBottom: '12px',
          fontSize: '11px',
        }}>
          ✅ Signed in as: {auth.currentUser.email}
        </div>
      )}

      {results && (
        <div style={{
          padding: '8px',
          borderRadius: '4px',
          background: results.success ? '#059669' : '#dc2626',
          marginBottom: '8px',
        }}>
          <div style={{
            fontWeight: '600',
            marginBottom: '4px',
            fontSize: '12px',
          }}>
            {results.success ? '✅ Test Passed' : '❌ Test Failed'}
          </div>
          <div style={{ fontSize: '11px', lineHeight: '1.4' }}>
            {results.message}
          </div>
          {results.details && (
            <details style={{ marginTop: '8px' }}>
              <summary style={{ 
                cursor: 'pointer', 
                fontSize: '11px',
                opacity: 0.8,
              }}>
                View Details
              </summary>
              <pre style={{
                background: 'rgba(0,0,0,0.3)',
                padding: '8px',
                borderRadius: '4px',
                fontSize: '10px',
                margin: '4px 0 0 0',
                overflow: 'auto',
                maxHeight: '150px',
              }}>
                {JSON.stringify(results.details, null, 2)}
              </pre>
            </details>
          )}
        </div>
      )}

      <div style={{
        fontSize: '10px',
        color: '#64748b',
        textAlign: 'center',
      }}>
        Check browser console for detailed logs
      </div>
    </div>
  );
};
