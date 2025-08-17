import React, { memo, useCallback, useEffect, useRef } from 'react';
import { Stage, Layer } from 'react-konva';
import { 
  useCanvasItems, 
  useSelectedCanvasItems, 
  useCanvasOffset, 
  useCanvasZoom,
  useCanvasInteractionState,
  useCanvasActions 
} from '../stores/canvasStore';
import { useThrottledEvents } from '../hooks/useCanvasOptimization';

/**
 * High-performance Canvas component using Zustand for state management.
 * This component is "dumb" - it only receives data from the store and renders it.
 * All state management logic is handled in the centralized Zustand store.
 */
export const OptimizedCanvasWithZustand = memo(() => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const throttleMouseMove = useRef<number | null>(null);
  
  // Subscribe to specific pieces of store state (prevents unnecessary re-renders)
  const canvasItems = useCanvasItems();
  const selectedCanvasItems = useSelectedCanvasItems();
  const canvasOffset = useCanvasOffset();
  const zoomLevel = useCanvasZoom();
  const { isDragging, draggingItem, resizingItem, isPanning } = useCanvasInteractionState();
  
  // Get actions from store
  const {
    updateCanvasItem,
    selectCanvasItem,
    deselectAllCanvasItems,
    updateCanvasOffset,
    setZoomLevel
  } = useCanvasActions();

  // Performance optimization hooks
  const { throttle } = useThrottledEvents();

  // Optimized mouse move handler using store state
  const handleCanvasMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Use requestAnimationFrame for smooth 60fps updates
      if (throttleMouseMove.current) return;

      throttleMouseMove.current = requestAnimationFrame(() => {
        throttleMouseMove.current = null;

        if (!canvasContainerRef.current) return;

        // Handle dragging using store state
        if (draggingItem) {
          e.preventDefault();
          const canvasRect = canvasContainerRef.current.getBoundingClientRect();
          const newX = (e.clientX - canvasRect.left - canvasOffset.x) / zoomLevel - draggingItem.offsetX;
          const newY = (e.clientY - canvasRect.top - canvasOffset.y) / zoomLevel - draggingItem.offsetY;
          
          // Update item position in store
          updateCanvasItem(draggingItem.id, { x: newX, y: newY });
        }
      });
    },
    [draggingItem, canvasOffset, zoomLevel, updateCanvasItem]
  );

  // Optimized click handler
  const handleCanvasClick = useCallback(
    (event: React.MouseEvent) => {
      if (event.target === event.currentTarget) {
        deselectAllCanvasItems();
      }
    },
    [deselectAllCanvasItems]
  );

  // Optimized item click handler
  const handleCanvasItemClick = useCallback(
    throttle((itemId: string, event: React.MouseEvent) => {
      event.stopPropagation();
      const isMultiSelect = event.ctrlKey || event.metaKey;
      selectCanvasItem(itemId, isMultiSelect);
    }, 16),
    [selectCanvasItem, throttle]
  );

  // Optimized wheel zoom handler
  const handleCanvasWheelZoom = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      e.preventDefault();
      const zoomSpeed = 0.1;
      const newZoom = e.deltaY > 0 ? zoomLevel - zoomSpeed : zoomLevel + zoomSpeed;
      setZoomLevel(Math.max(0.1, Math.min(5, newZoom)));
    },
    [zoomLevel, setZoomLevel]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (throttleMouseMove.current) {
        cancelAnimationFrame(throttleMouseMove.current);
      }
    };
  }, []);

  return (
    <div className="flex-grow flex flex-col">
      {/* Canvas Header - Simplified */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-4 shadow-2xl mb-4">
        <h2 className="text-xl font-bold bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent">
          High-Performance Canvas
        </h2>
        <p className="text-slate-300">
          Powered by Zustand - {canvasItems.length} items
        </p>
      </div>

      {/* Optimized Canvas Area */}
      <div className="flex-grow bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 overflow-hidden shadow-2xl">
        <div
          ref={canvasContainerRef}
          className="relative w-full h-full bg-white overflow-hidden cursor-grab active:cursor-grabbing"
          onClick={handleCanvasClick}
          onMouseMove={handleCanvasMouseMove}
          onWheel={handleCanvasWheelZoom}
          style={{
            transform: `translate3d(${canvasOffset.x}px, ${canvasOffset.y}px, 0) scale(${zoomLevel})`,
            transformOrigin: "0 0",
          }}
        >
          {/* Konva Canvas Container - Future Integration Point */}
          <div id="konva-canvas-container">
            {/* Temporary div-based rendering for transition */}
            {canvasItems.map((item) => (
              <div
                key={item.id}
                className={`absolute border-2 transition-all cursor-move ${
                  selectedCanvasItems.has(item.id)
                    ? "border-sky-400 shadow-lg"
                    : "border-transparent hover:border-sky-200"
                }`}
                style={{
                  left: item.x,
                  top: item.y,
                  width: item.width || 200,
                  height: item.height || 100,
                  zIndex: item.zIndex,
                  backgroundColor: item.backgroundColor || '#3B82F6',
                  color: item.textColor || '#FFFFFF',
                  padding: '8px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onClick={(e) => handleCanvasItemClick(item.id, e)}
              >
                {item.content || 'Canvas Item'}
              </div>
            ))}
          </div>

          {/* Canvas Grid */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
              `,
              backgroundSize: "20px 20px",
            }}
          />
        </div>
      </div>
    </div>
  );
});

OptimizedCanvasWithZustand.displayName = 'OptimizedCanvasWithZustand';

export default OptimizedCanvasWithZustand;
