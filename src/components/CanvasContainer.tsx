import React, { memo, useCallback } from 'react';
import { CanvasItem } from '../types';

interface CanvasContainerProps {
  canvasItems: CanvasItem[];
  canvasOffset: { x: number; y: number };
  zoomLevel: number;
  onMouseMove?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseUp?: () => void;
  onMouseLeave?: () => void;
  onMouseDown?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onWheel?: (e: React.WheelEvent<HTMLDivElement>) => void;
  onContextMenu?: (e: React.MouseEvent<HTMLDivElement>) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * High-performance canvas container component with React.memo optimization.
 * This component prevents unnecessary re-renders during mouse movements and hover events.
 * It only re-renders when canvas data, offset, or zoom level actually changes.
 */
export const CanvasContainer = memo<CanvasContainerProps>(({
  canvasItems,
  canvasOffset,
  zoomLevel,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
  onMouseDown,
  onWheel,
  onContextMenu,
  children,
  className,
  style,
}) => {
  // Optimized event handler that prevents unnecessary state updates
  const handleContextMenu = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    onContextMenu?.(e);
  }, [onContextMenu]);

  return (
    <div
      className={className}
      style={style}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onMouseDown={onMouseDown}
      onWheel={onWheel}
      onContextMenu={handleContextMenu}
      aria-label="Interactive Canvas Area"
    >
      {children}
    </div>
  );
}, (prevProps, nextProps) => {
  // Highly optimized comparison function to prevent re-renders
  // Only re-render if essential canvas data has actually changed
  return (
    prevProps.canvasItems === nextProps.canvasItems &&
    prevProps.canvasOffset.x === nextProps.canvasOffset.x &&
    prevProps.canvasOffset.y === nextProps.canvasOffset.y &&
    prevProps.zoomLevel === nextProps.zoomLevel &&
    prevProps.className === nextProps.className &&
    // Note: We don't compare event handlers to avoid re-renders on function reference changes
    // since they should be stable with useCallback
    prevProps.children === nextProps.children
  );
});

CanvasContainer.displayName = 'CanvasContainer';

export default CanvasContainer;
