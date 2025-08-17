import React, { useState, useCallback, useMemo } from 'react';
import { CanvasItem } from '../types';
import CanvasSection from './CanvasSection';
import OptimizedCanvasSection from './OptimizedCanvasSection';

interface CanvasPerformanceDemoProps {
  initialItems?: CanvasItem[];
}

export const CanvasPerformanceDemo: React.FC<CanvasPerformanceDemoProps> = ({
  initialItems = []
}) => {
  const [useOptimized, setUseOptimized] = useState(true);
  const [enableDebugMode, setEnableDebugMode] = useState(false);
  const [enableWebWorkers, setEnableWebWorkers] = useState(true);
  
  // Shared canvas state
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>(initialItems);
  const [selectedCanvasItems, setSelectedCanvasItems] = useState<Set<string>>(new Set());
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(1);
  const [nextZIndex, setNextZIndex] = useState(1);
  
  // UI state
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState<string | null>(null);
  
  // History state
  const [canvasHistory, setCanvasHistory] = useState<any[]>([]);
  const [canvasHistoryIndex, setCanvasHistoryIndex] = useState(-1);

  // Shared functions
  const addCanvasItem = useCallback((item: CanvasItem) => {
    setCanvasItems(prev => [...prev, item]);
    setNextZIndex(prev => prev + 1);
  }, []);

  const updateCanvasItem = useCallback((id: string, updates: Partial<CanvasItem>) => {
    setCanvasItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    );
  }, []);

  const deleteCanvasItem = useCallback((id: string) => {
    setCanvasItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const saveCanvasHistory = useCallback(() => {
    // Simple history implementation
    setCanvasHistory(prev => [...prev.slice(0, canvasHistoryIndex + 1), { items: canvasItems }]);
    setCanvasHistoryIndex(prev => prev + 1);
  }, [canvasItems, canvasHistoryIndex]);

  const undoCanvas = useCallback(() => {
    if (canvasHistoryIndex > 0) {
      const prevState = canvasHistory[canvasHistoryIndex - 1];
      setCanvasItems(prevState.items);
      setCanvasHistoryIndex(prev => prev - 1);
    }
  }, [canvasHistory, canvasHistoryIndex]);

  const redoCanvas = useCallback(() => {
    if (canvasHistoryIndex < canvasHistory.length - 1) {
      const nextState = canvasHistory[canvasHistoryIndex + 1];
      setCanvasItems(nextState.items);
      setCanvasHistoryIndex(prev => prev + 1);
    }
  }, [canvasHistory, canvasHistoryIndex]);

  // Generate test items for performance testing
  const generateTestItems = useCallback((count: number) => {
    const items: CanvasItem[] = [];
    for (let i = 0; i < count; i++) {
      items.push({
        id: `test-item-${i}`,
        type: i % 4 === 0 ? 'textElement' : i % 4 === 1 ? 'shapeElement' : i % 4 === 2 ? 'stickyNote' : 'connectorElement',
        x: Math.random() * 2000,
        y: Math.random() * 2000,
        width: 100 + Math.random() * 100,
        height: 50 + Math.random() * 50,
        zIndex: i,
        content: `Item ${i}`,
        backgroundColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
        color: '#FFFFFF',
      });
    }
    setCanvasItems(items);
    setNextZIndex(count + 1);
  }, []);

  const performanceMetrics = useMemo(() => {
    return {
      totalItems: canvasItems.length,
      selectedItems: selectedCanvasItems.size,
      memoryUsage: (performance as any).memory ? 
        Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024) : 'N/A',
    };
  }, [canvasItems.length, selectedCanvasItems.size]);

  const CanvasComponent = useOptimized ? OptimizedCanvasSection : CanvasSection;

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Performance Controls */}
      <div className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700/50 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-white">Canvas Performance Demo</h1>
            
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-300">Canvas Type:</label>
              <select
                value={useOptimized ? 'optimized' : 'original'}
                onChange={(e) => setUseOptimized(e.target.value === 'optimized')}
                className="px-3 py-1 bg-slate-700 text-white rounded border border-slate-600"
              >
                <option value="optimized">Optimized Canvas</option>
                <option value="original">Original Canvas</option>
              </select>
            </div>

            {useOptimized && (
              <>
                <label className="flex items-center gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={enableDebugMode}
                    onChange={(e) => setEnableDebugMode(e.target.checked)}
                    className="rounded"
                  />
                  Debug Mode
                </label>

                <label className="flex items-center gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={enableWebWorkers}
                    onChange={(e) => setEnableWebWorkers(e.target.checked)}
                    className="rounded"
                  />
                  Web Workers
                </label>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-300">
              Items: {performanceMetrics.totalItems} | 
              Selected: {performanceMetrics.selectedItems} | 
              Memory: {performanceMetrics.memoryUsage}MB
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => generateTestItems(10)}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm"
              >
                Add 10 Items
              </button>
              <button
                onClick={() => generateTestItems(100)}
                className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white rounded text-sm"
              >
                Add 100 Items
              </button>
              <button
                onClick={() => generateTestItems(500)}
                className="px-3 py-1 bg-orange-600 hover:bg-orange-500 text-white rounded text-sm"
              >
                Add 500 Items
              </button>
              <button
                onClick={() => setCanvasItems([])}
                className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-sm"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 p-4">
        {useOptimized ? (
          <OptimizedCanvasSection
            canvasItems={canvasItems}
            selectedCanvasItems={selectedCanvasItems}
            canvasOffset={canvasOffset}
            zoomLevel={zoomLevel}
            nextZIndex={nextZIndex}
            setCanvasItems={setCanvasItems}
            addCanvasItem={addCanvasItem}
            updateCanvasItem={updateCanvasItem}
            deleteCanvasItem={deleteCanvasItem}
            setSelectedCanvasItems={setSelectedCanvasItems}
            saveCanvasHistory={saveCanvasHistory}
            undoCanvas={undoCanvas}
            redoCanvas={redoCanvas}
            showImageModal={showImageModal}
            modalImageSrc={modalImageSrc}
            setShowImageModal={setShowImageModal}
            setModalImageSrc={setModalImageSrc}
            canvasHistoryIndex={canvasHistoryIndex}
            canvasHistory={canvasHistory}
            enableDebugMode={enableDebugMode}
            enableWebWorkers={enableWebWorkers}
          />
        ) : (
          <CanvasSection
            canvasItems={canvasItems}
            selectedCanvasItems={selectedCanvasItems}
            canvasOffset={canvasOffset}
            zoomLevel={zoomLevel}
            nextZIndex={nextZIndex}
            setCanvasItems={setCanvasItems}
            addCanvasItem={addCanvasItem}
            updateCanvasItem={updateCanvasItem}
            deleteCanvasItem={deleteCanvasItem}
            setSelectedCanvasItems={setSelectedCanvasItems}
            saveCanvasHistory={saveCanvasHistory}
            undoCanvas={undoCanvas}
            redoCanvas={redoCanvas}
            showImageModal={showImageModal}
            modalImageSrc={modalImageSrc}
            setShowImageModal={setShowImageModal}
            setModalImageSrc={setModalImageSrc}
            canvasHistoryIndex={canvasHistoryIndex}
            canvasHistory={canvasHistory}
          />
        )}
      </div>

      {/* Performance Tips */}
      <div className="bg-slate-800/30 border-t border-slate-700/50 p-3 text-xs text-slate-400">
        <div className="flex flex-wrap gap-4">
          <span>💡 <strong>Optimizations:</strong></span>
          <span>✓ Viewport-based rendering (virtualization)</span>
          <span>✓ Web Worker for complex calculations</span>
          <span>✓ Memoized components</span>
          <span>✓ Throttled event handling</span>
          <span>✓ Optimized item lookups with Map</span>
          <span>✓ Hardware-accelerated transforms</span>
        </div>
      </div>
    </div>
  );
};

export default CanvasPerformanceDemo;
