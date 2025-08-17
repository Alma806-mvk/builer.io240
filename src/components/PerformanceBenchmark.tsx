import React, { memo, useState, useCallback, useEffect } from 'react';
import { useCanvasItems, useCanvasActions } from '../stores/canvasStore';

/**
 * Performance benchmark component to test Zustand optimization.
 * This component measures re-render performance and FPS.
 */
export const PerformanceBenchmark = memo(() => {
  const [renderCount, setRenderCount] = useState(0);
  const [fps, setFps] = useState(0);
  const [isStressTest, setIsStressTest] = useState(false);
  
  const canvasItems = useCanvasItems();
  const { addCanvasItem, clearCanvas } = useCanvasActions();

  // Count re-renders
  useEffect(() => {
    setRenderCount(prev => prev + 1);
  });

  // FPS counter
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    
    const updateFPS = () => {
      const currentTime = performance.now();
      frameCount++;
      
      if (currentTime - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(updateFPS);
    };
    
    const id = requestAnimationFrame(updateFPS);
    return () => cancelAnimationFrame(id);
  }, []);

  // Stress test - add many items rapidly
  const runStressTest = useCallback(() => {
    setIsStressTest(true);
    clearCanvas();
    
    // Add 100 items rapidly to test performance
    for (let i = 0; i < 100; i++) {
      setTimeout(() => {
        addCanvasItem({
          id: `stress-${i}-${Date.now()}`,
          type: 'textElement',
          x: Math.random() * 800,
          y: Math.random() * 600,
          width: 150,
          height: 50,
          zIndex: i,
          content: `Item ${i}`,
          backgroundColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
          textColor: '#FFFFFF',
        });
        
        if (i === 99) {
          setTimeout(() => setIsStressTest(false), 1000);
        }
      }, i * 10);
    }
  }, [addCanvasItem, clearCanvas]);

  return (
    <div className="fixed top-4 right-4 bg-black/80 text-white p-4 rounded-lg text-sm z-50">
      <div className="space-y-2">
        <div>
          <strong>Performance Monitor</strong>
        </div>
        <div>
          FPS: <span className={fps >= 55 ? 'text-green-400' : fps >= 30 ? 'text-yellow-400' : 'text-red-400'}>
            {fps}
          </span>
        </div>
        <div>
          Re-renders: <span className="text-blue-400">{renderCount}</span>
        </div>
        <div>
          Canvas Items: <span className="text-purple-400">{canvasItems.length}</span>
        </div>
        <div className="pt-2 border-t border-gray-600">
          <button
            onClick={runStressTest}
            disabled={isStressTest}
            className={`px-3 py-1 rounded text-xs ${
              isStressTest 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-red-600 hover:bg-red-500'
            }`}
          >
            {isStressTest ? 'Running...' : 'Stress Test'}
          </button>
        </div>
        <div className="text-xs text-gray-400">
          Zustand + React.memo
        </div>
      </div>
    </div>
  );
});

PerformanceBenchmark.displayName = 'PerformanceBenchmark';

export default PerformanceBenchmark;
