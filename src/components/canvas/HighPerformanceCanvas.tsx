import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { CanvasItem } from "../../types";

interface HighPerformanceCanvasProps {
  items: CanvasItem[];
  selectedItemIds: Set<string>;
  onUpdateItem: (id: string, updates: Partial<CanvasItem>) => void;
  onSelectItem: (id: string) => void;
  onMultiSelectItem?: (id: string, isCtrlPressed: boolean) => void;
  onCanvasClick?: () => void;
  enableInteractions?: boolean;
  className?: string;
}

interface ViewportState {
  x: number;
  y: number;
  scale: number;
}

// Dynamic canvas boundaries that scale with zoom
const BASE_CANVAS_BOUNDS = {
  minX: -10000,
  maxX: 10000,
  minY: -10000,
  maxY: 10000,
};

// Calculate viewport bounds that prevent going beyond canvas boundaries
const calculateViewportBounds = (scale: number, containerWidth: number, containerHeight: number) => {
  // Convert world boundaries to viewport boundaries
  // When zoomed out, we need to restrict viewport movement more
  // When zoomed in, we can allow more viewport movement

  const worldWidth = BASE_CANVAS_BOUNDS.maxX - BASE_CANVAS_BOUNDS.minX;
  const worldHeight = BASE_CANVAS_BOUNDS.maxY - BASE_CANVAS_BOUNDS.minY;

  // Calculate the maximum viewport offset that still shows the boundary
  const maxViewportOffsetX = (worldWidth * scale - containerWidth) / 2;
  const maxViewportOffsetY = (worldHeight * scale - containerHeight) / 2;

  return {
    minX: -maxViewportOffsetX,
    maxX: maxViewportOffsetX,
    minY: -maxViewportOffsetY,
    maxY: maxViewportOffsetY,
  };
};

// Check if position is near barrier edge
const isNearBarrier = (x: number, y: number, bounds: typeof BASE_CANVAS_BOUNDS, threshold = 100) => {
  return (
    x <= bounds.minX + threshold ||
    x >= bounds.maxX - threshold ||
    y <= bounds.minY + threshold ||
    y >= bounds.maxY - threshold
  );
};

// Hard boundaries - no elastic barriers, hard stop at edges

const ZOOM_LIMITS = {
  min: 0.25,  // 25% zoom out (increased from 5%)
  max: 5,     // 500% zoom in
};

// Grid settings for snapping
const GRID_SIZE = 20; // pixels at 100% zoom
const SNAP_THRESHOLD = 10; // pixels

interface InteractionState {
  isPanning: boolean;
  isSpacePressed: boolean;
  lastMousePosition: { x: number; y: number } | null;
  panStartPosition: { x: number; y: number } | null;
}

export const HighPerformanceCanvas: React.FC<HighPerformanceCanvasProps> = ({
  items,
  selectedItemIds,
  onUpdateItem,
  onSelectItem,
  onMultiSelectItem,
  onCanvasClick,
  enableInteractions = true,
  className = "",
}) => {
  // Refs for canvas interaction
  const canvasRef = useRef<HTMLDivElement>(null);
  const contentLayerRef = useRef<HTMLDivElement>(null);

  // Container dimensions for dynamic bounds calculation
  const [containerDimensions, setContainerDimensions] = useState({ width: 800, height: 600 });

  // Track if user is near barrier for visual feedback
  const [isNearBarrierEdge, setIsNearBarrierEdge] = useState(false);
  
  // Viewport state - center the viewport to show the area where items are typically placed
  const [viewport, setViewport] = useState<ViewportState>({
    x: 0, // Start at origin
    y: 0, // Start at origin
    scale: 1,
  });

  // Interaction state
  const [interaction, setInteraction] = useState<InteractionState>({
    isPanning: false,
    isSpacePressed: false,
    lastMousePosition: null,
    panStartPosition: null,
  });

  // Pan functionality with spacebar + drag, middle mouse, or right-click drag
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!enableInteractions) return;

    const isSpacePan = interaction.isSpacePressed && e.button === 0;
    const isMiddleMousePan = e.button === 1;
    const isRightClickPan = e.button === 2;

    // Canvas interaction handling

    if (isSpacePan || isMiddleMousePan || isRightClickPan) {
      e.preventDefault();
      e.stopPropagation();

      setInteraction(prev => ({
        ...prev,
        isPanning: true,
        lastMousePosition: { x: e.clientX, y: e.clientY },
        panStartPosition: { x: e.clientX, y: e.clientY },
      }));

      // Change cursor to grabbing
      if (canvasRef.current) {
        canvasRef.current.style.cursor = 'grabbing';
      }

      // Debug: Started panning
    } else if (e.target === e.currentTarget) {
      // Canvas background click
      onCanvasClick?.();
    }
  }, [enableInteractions, interaction.isSpacePressed, onCanvasClick]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!enableInteractions || !interaction.isPanning || !interaction.lastMousePosition) return;

    e.preventDefault();
    e.stopPropagation();

    const deltaX = e.clientX - interaction.lastMousePosition.x;
    const deltaY = e.clientY - interaction.lastMousePosition.y;

    // Apply panning with viewport boundaries
    setViewport(prev => {
      const viewportBounds = calculateViewportBounds(prev.scale, containerDimensions.width, containerDimensions.height);

      // Calculate proposed new position
      const proposedX = prev.x + deltaX;
      const proposedY = prev.y + deltaY;

      // Clamp viewport position to calculated bounds
      const newX = Math.max(viewportBounds.minX, Math.min(viewportBounds.maxX, proposedX));
      const newY = Math.max(viewportBounds.minY, Math.min(viewportBounds.maxY, proposedY));

      return {
        ...prev,
        x: newX,
        y: newY,
      };
    });

    setInteraction(prev => ({
      ...prev,
      lastMousePosition: { x: e.clientX, y: e.clientY },
    }));

    // Check if we're near barrier edge and update state
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const canvasX = (e.clientX - rect.left - viewport.x) / viewport.scale;
      const canvasY = (e.clientY - rect.top - viewport.y) / viewport.scale;
      const nearBarrier = isNearBarrier(canvasX, canvasY, BASE_CANVAS_BOUNDS, 200 / viewport.scale);
      setIsNearBarrierEdge(nearBarrier);
    }
  }, [enableInteractions, interaction.isPanning, interaction.lastMousePosition, viewport.x, viewport.y, viewport.scale]);

  const handleMouseUp = useCallback(() => {
    if (!enableInteractions) return;

    // Debug: Canvas mouseup - stopping pan

    setInteraction(prev => ({
      ...prev,
      isPanning: false,
      lastMousePosition: null,
      panStartPosition: null,
    }));

    // Reset cursor
    if (canvasRef.current) {
      canvasRef.current.style.cursor = interaction.isSpacePressed ? 'grab' : 'default';
    }
  }, [enableInteractions, interaction.isSpacePressed]);

  // Zoom functionality with wheel (optionally with Ctrl/Cmd for precision)
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (!enableInteractions) return;

    // Prevent page scroll and only zoom canvas when cursor is over canvas
    e.preventDefault();
    e.stopPropagation();

    // Allow both simple wheel and Ctrl/Cmd + wheel for zooming
    const isPrecisionZoom = e.ctrlKey || e.metaKey;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Get mouse position relative to canvas
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate zoom delta with smooth easing
    // Use more precise zoom when modifier keys are pressed
    const zoomIntensity = isPrecisionZoom ? 0.02 : 0.05; // Reduced for smoother zoom
    const zoomDirection = e.deltaY > 0 ? -1 : 1;
    const zoomFactor = 1 + (zoomDirection * zoomIntensity);

    setViewport(prev => {
      const newScale = Math.max(ZOOM_LIMITS.min, Math.min(ZOOM_LIMITS.max, prev.scale * zoomFactor));

      // Calculate zoom origin offset to zoom towards cursor
      const scaleDiff = newScale - prev.scale;
      const proposedX = prev.x - (mouseX - prev.x) * (scaleDiff / prev.scale);
      const proposedY = prev.y - (mouseY - prev.y) * (scaleDiff / prev.scale);

      // Apply viewport bounds for zoom positioning
      const viewportBounds = calculateViewportBounds(newScale, containerDimensions.width, containerDimensions.height);

      // Clamp viewport position to calculated bounds
      const newX = Math.max(viewportBounds.minX, Math.min(viewportBounds.maxX, proposedX));
      const newY = Math.max(viewportBounds.minY, Math.min(viewportBounds.maxY, proposedY));

      return {
        x: newX,
        y: newY,
        scale: newScale,
      };
    });
  }, [enableInteractions]);

  // Keyboard interaction for spacebar
  useEffect(() => {
    if (!enableInteractions) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !interaction.isSpacePressed) {
        e.preventDefault();
        console.log('Spacebar pressed');
        setInteraction(prev => ({ ...prev, isSpacePressed: true }));
        if (canvasRef.current && !interaction.isPanning) {
          canvasRef.current.style.cursor = 'grab';
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        // Debug: Spacebar released
        setInteraction(prev => ({ ...prev, isSpacePressed: false }));
        if (canvasRef.current && !interaction.isPanning) {
          canvasRef.current.style.cursor = 'default';
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [enableInteractions, interaction.isSpacePressed, interaction.isPanning]);

  // Global mouse event handling for better panning
  useEffect(() => {
    if (!enableInteractions || !interaction.isPanning) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!interaction.lastMousePosition) return;

      const deltaX = e.clientX - interaction.lastMousePosition.x;
      const deltaY = e.clientY - interaction.lastMousePosition.y;

      setViewport(prev => {
        const viewportBounds = calculateViewportBounds(prev.scale, containerDimensions.width, containerDimensions.height);

        // Calculate proposed new position
        const proposedX = prev.x + deltaX;
        const proposedY = prev.y + deltaY;

        // Clamp viewport position to calculated bounds
        const newX = Math.max(viewportBounds.minX, Math.min(viewportBounds.maxX, proposedX));
        const newY = Math.max(viewportBounds.minY, Math.min(viewportBounds.maxY, proposedY));

        return {
          ...prev,
          x: newX,
          y: newY,
        };
      });

      setInteraction(prev => ({
        ...prev,
        lastMousePosition: { x: e.clientX, y: e.clientY },
      }));

      // Check if we're near barrier edge and update state
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const currentViewport = canvasRef.current?.dataset;
        // We need to access current viewport state, but it's in closure
        // For now, we'll update this in the viewport state update
      }
    };

    const handleGlobalMouseUp = () => {
      // Debug: Global mouseup - stopping pan
      setInteraction(prev => ({
        ...prev,
        isPanning: false,
        lastMousePosition: null,
        panStartPosition: null,
      }));

      if (canvasRef.current) {
        canvasRef.current.style.cursor = interaction.isSpacePressed ? 'grab' : 'default';
      }
    };

    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [enableInteractions, interaction.isPanning, interaction.lastMousePosition, interaction.isSpacePressed]);

  // Track container dimensions for dynamic bounds calculation
  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setContainerDimensions({
          width: rect.width,
          height: rect.height,
        });
      }
    };

    // Initial measurement
    updateDimensions();

    // Set up resize observer
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (canvasRef.current) {
      resizeObserver.observe(canvasRef.current);
    }

    // Also listen to window resize as backup
    window.addEventListener('resize', updateDimensions);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  // Prevent middle mouse scroll only - let wheel zoom work
  useEffect(() => {
    if (!enableInteractions) return;

    const preventMiddleMouseScroll = (e: Event) => {
      if ((e as any).button === 1) {
        e.preventDefault();
      }
    };

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('mousedown', preventMiddleMouseScroll);
      return () => {
        canvas.removeEventListener('mousedown', preventMiddleMouseScroll);
      };
    }
  }, [enableInteractions]);

  // Grid snapping function
  const snapToGrid = useCallback((value: number, scale: number) => {
    const gridSize = GRID_SIZE * scale;
    return Math.round(value / gridSize) * gridSize;
  }, []);

  // Render canvas items with hover and selection effects
  const renderCanvasItems = useMemo(() => {

    return items.map((item) => {
      const isSelected = selectedItemIds.has(item.id);

      return (
        <div
          key={item.id}
          className={`canvas-item ${isSelected ? 'selected' : ''}`}
          style={{
            position: 'absolute',
            left: `${snapToGrid(item.x, viewport.scale)}px`,
            top: `${snapToGrid(item.y, viewport.scale)}px`,
            width: `${item.width || 200}px`,
            height: `${item.height || 100}px`,
            zIndex: item.zIndex || 1,
            backgroundColor: item.backgroundColor || '#3B82F6',
            color: item.color || '#FFFFFF',
            border: isSelected ? '2px solid #38BDF8' : `1px solid ${item.borderColor || '#60A5FA'}`,
            borderRadius: '8px',
            padding: '12px',
            cursor: 'pointer',
            boxShadow: isSelected
              ? '0 0 0 2px #38BDF8, 0 8px 24px rgba(56, 189, 248, 0.3)'
              : '0 2px 8px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: '500',
            userSelect: 'none',
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            if (onMultiSelectItem) {
              onMultiSelectItem(item.id, e.ctrlKey || e.metaKey);
            } else {
              onSelectItem(item.id);
            }
          }}
        >
          {item.content || 'Canvas Item'}
        </div>
      );
    });
  }, [items, selectedItemIds, onSelectItem, onMultiSelectItem, snapToGrid, viewport.scale]);

  // Zoom-responsive grid configuration that maintains visual consistency
  const gridConfig = useMemo(() => {
    // Base grid sizes that look good at 100% zoom
    const baseGridSize = 60;
    const baseSubGridSize = 20;

    // Scale grid to maintain visual appearance across zoom levels
    const effectiveScale = Math.max(0.5, Math.min(2, viewport.scale));

    return {
      gridSize: baseGridSize / effectiveScale,
      subGridSize: baseSubGridSize / effectiveScale,
    };
  }, [viewport.scale]);

  // Background style for the canvas base
  const canvasBackgroundStyle = useMemo(() => ({
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0F172A', // Dark futuristic blue
    zIndex: 0,
  }), []);

  // Content layer transform with improved smooth zoom transitions
  const contentTransform = useMemo(() => ({
    transform: `translate3d(${viewport.x}px, ${viewport.y}px, 0) scale(${viewport.scale})`,
    transformOrigin: '0 0',
    transition: interaction.isPanning ? 'none' : 'transform 0.2s cubic-bezier(0.23, 1, 0.32, 1)',
    willChange: interaction.isPanning ? 'transform' : 'auto',
  }), [viewport.x, viewport.y, viewport.scale, interaction.isPanning]);

  // No edge proximity needed with hard boundaries

  return (
    <div
      ref={canvasRef}
      className={`high-performance-canvas ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        cursor: isNearBarrierEdge ? 'not-allowed' : (interaction.isSpacePressed ? 'grab' : 'default'),
        userSelect: 'none',
        touchAction: 'none', // Prevent default touch behaviors
        border: 'none',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Canvas Background */}
      <div style={canvasBackgroundStyle} />

      {/* Dynamic Infinite SVG Grid */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0,
          ...contentTransform,
        }}
        overflow="visible"
      >
        <defs>
          {/* Define grid patterns */}
          <pattern
            id="minorGrid"
            width={gridConfig.subGridSize}
            height={gridConfig.subGridSize}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${gridConfig.subGridSize} 0 L 0 0 0 ${gridConfig.subGridSize}`}
              fill="none"
              stroke="rgba(100, 116, 139, 0.15)"
              strokeWidth="1"
            />
          </pattern>
          <pattern
            id="majorGrid"
            width={gridConfig.gridSize}
            height={gridConfig.gridSize}
            patternUnits="userSpaceOnUse"
          >
            <rect
              width={gridConfig.gridSize}
              height={gridConfig.gridSize}
              fill="url(#minorGrid)"
            />
            <path
              d={`M ${gridConfig.gridSize} 0 L 0 0 0 ${gridConfig.gridSize}`}
              fill="none"
              stroke="rgba(148, 163, 184, 0.3)"
              strokeWidth="1"
            />
          </pattern>
        </defs>

        {/* Dynamic grid rectangle covering the entire canvas bounds */}
        <rect
          x={BASE_CANVAS_BOUNDS.minX}
          y={BASE_CANVAS_BOUNDS.minY}
          width={BASE_CANVAS_BOUNDS.maxX - BASE_CANVAS_BOUNDS.minX}
          height={BASE_CANVAS_BOUNDS.maxY - BASE_CANVAS_BOUNDS.minY}
          fill="url(#majorGrid)"
        />

        {/* Barrier visual indicators - animated when near edge */}
        <rect
          x={BASE_CANVAS_BOUNDS.minX}
          y={BASE_CANVAS_BOUNDS.minY}
          width={BASE_CANVAS_BOUNDS.maxX - BASE_CANVAS_BOUNDS.minX}
          height={BASE_CANVAS_BOUNDS.maxY - BASE_CANVAS_BOUNDS.minY}
          fill="none"
          stroke={isNearBarrierEdge ? "rgba(255, 100, 100, 0.8)" : "rgba(255, 0, 0, 0.3)"}
          strokeWidth={isNearBarrierEdge ? "8" : "4"}
          strokeDasharray="20,10"
        >
          {isNearBarrierEdge && (
            <animate
              attributeName="stroke-opacity"
              values="0.3;0.8;0.3"
              dur="1s"
              repeatCount="indefinite"
            />
          )}
        </rect>

        {/* Warning zone indicator */}
        {isNearBarrierEdge && (
          <rect
            x={BASE_CANVAS_BOUNDS.minX + 100}
            y={BASE_CANVAS_BOUNDS.minY + 100}
            width={(BASE_CANVAS_BOUNDS.maxX - BASE_CANVAS_BOUNDS.minX) - 200}
            height={(BASE_CANVAS_BOUNDS.maxY - BASE_CANVAS_BOUNDS.minY) - 200}
            fill="none"
            stroke="rgba(255, 255, 0, 0.4)"
            strokeWidth="2"
            strokeDasharray="10,5"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="0;15"
              dur="0.5s"
              repeatCount="indefinite"
            />
          </rect>
        )}
      </svg>



      {/* Interactive Content Layer */}
      <div
        ref={contentLayerRef}
        className="canvas-content-layer"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          ...contentTransform,
        }}
      >
        {renderCanvasItems}
      </div>

    </div>
  );
};

export default HighPerformanceCanvas;
