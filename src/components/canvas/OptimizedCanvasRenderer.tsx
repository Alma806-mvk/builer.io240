import React, { memo, useMemo, useCallback, useEffect, useRef } from "react";
import { CanvasItem } from "../../types";
import { useCanvasVirtualization, useCanvasItemMap } from "../../hooks/useCanvasOptimization";
import { TextElement } from "./TextElement";
import { CodeElement } from "./CodeElement";
import { ConnectorElement } from "./ConnectorElement";
import { ChartElement } from "./ChartElement";

interface OptimizedCanvasRendererProps {
  items: CanvasItem[];
  selectedItemIds: Set<string>;
  canvasOffset: { x: number; y: number };
  zoomLevel: number;
  containerWidth: number;
  containerHeight: number;
  onUpdateItem: (id: string, updates: Partial<CanvasItem>) => void;
  onSelectItem: (id: string) => void;
  onMouseDownItem: (e: React.MouseEvent, id: string) => void;
  renderResizeHandle: (item: CanvasItem) => React.ReactNode;
  renderItemControls: (item: CanvasItem) => React.ReactNode;
  showDebugInfo?: boolean;
}

// Memoized individual canvas item component
const MemoizedCanvasItem = memo<{
  item: CanvasItem;
  isSelected: boolean;
  onUpdateItem: (id: string, updates: Partial<CanvasItem>) => void;
  onSelectItem: (id: string) => void;
  onMouseDownItem: (e: React.MouseEvent, id: string) => void;
  renderResizeHandle: (item: CanvasItem) => React.ReactNode;
  renderItemControls: (item: CanvasItem) => React.ReactNode;
}>(({
  item,
  isSelected,
  onUpdateItem,
  onSelectItem,
  onMouseDownItem,
  renderResizeHandle,
  renderItemControls,
}) => {
  const resizeHandle = renderResizeHandle(item);
  const itemControls = renderItemControls(item);

  const commonProps = useMemo(() => ({
    item,
    isSelected,
    onUpdate: onUpdateItem,
    onSelect: onSelectItem,
    onMouseDown: onMouseDownItem,
    resizeHandle,
    itemSpecificControls: itemControls,
  }), [item, isSelected, onUpdateItem, onSelectItem, onMouseDownItem, resizeHandle, itemControls]);

  // Render specific component based on item type
  switch (item.type) {
    case "textElement":
    case "stickyNote":
    case "commentElement":
      return <TextElement {...commonProps} />;

    case "codeBlock":
      return <CodeElement {...commonProps} />;

    case "connectorElement":
      return <ConnectorElement {...commonProps} />;

    case "chart":
      return <ChartElement {...commonProps} />;

    default:
      return <BasicCanvasItem {...commonProps} />;
  }
}, (prevProps, nextProps) => {
  // Custom comparison function for better memoization
  const prevItem = prevProps.item;
  const nextItem = nextProps.item;
  
  // Check if essential properties have changed
  return (
    prevItem.id === nextItem.id &&
    prevItem.x === nextItem.x &&
    prevItem.y === nextItem.y &&
    prevItem.width === nextItem.width &&
    prevItem.height === nextItem.height &&
    prevItem.zIndex === nextItem.zIndex &&
    prevItem.content === nextItem.content &&
    prevItem.backgroundColor === nextItem.backgroundColor &&
    prevItem.color === nextItem.color &&
    prevItem.borderColor === nextItem.borderColor &&
    prevItem.borderWidth === nextItem.borderWidth &&
    prevProps.isSelected === nextProps.isSelected &&
    JSON.stringify(prevItem) === JSON.stringify(nextItem) // Fallback for other props
  );
});

MemoizedCanvasItem.displayName = 'MemoizedCanvasItem';

// Basic canvas item for fallback rendering
const BasicCanvasItem = memo<{
  item: CanvasItem;
  isSelected: boolean;
  onUpdate: (id: string, updates: Partial<CanvasItem>) => void;
  onSelect: (id: string) => void;
  onMouseDown: (e: React.MouseEvent, id: string) => void;
  resizeHandle: React.ReactNode;
  itemSpecificControls: React.ReactNode;
}>(({
  item,
  isSelected,
  onUpdate,
  onSelect,
  onMouseDown,
  resizeHandle,
  itemSpecificControls,
}) => {
  const baseStyle: React.CSSProperties = useMemo(() => ({
    position: "absolute",
    left: `${item.x}px`,
    top: `${item.y}px`,
    width: `${item.width || 200}px`,
    height: `${item.height || 100}px`,
    zIndex: item.zIndex,
    backgroundColor: item.backgroundColor || "#3B82F6",
    color: item.color || "#FFFFFF",
    border: `${item.borderWidth || "1px"} ${item.borderStyle || "solid"} ${item.borderColor || "#2563EB"}`,
    borderRadius: item.borderRadius || "4px",
    padding: "8px",
    cursor: "grab",
    boxShadow: isSelected
      ? "0 0 0 2.5px #38BDF8, 0 6px 12px rgba(0,0,0,0.3)"
      : "0 2px 5px rgba(0,0,0,0.35)",
    transition: "box-shadow 0.15s ease-in-out",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: item.fontSize || "14px",
    fontFamily: item.fontFamily || "Inter, sans-serif",
    fontWeight: item.fontWeight || "normal",
    textAlign: (item.textAlign as any) || "center",
    opacity: item.opacity || 1,
    transform: `rotate(${item.rotation || 0}deg)`,
  }), [item, isSelected]);

  // Handle different item types with basic rendering
  const content = useMemo(() => {
    let content = item.content || "Canvas Item";

    if (item.type === "historyItem") {
      content = item.content || "History Item";
    } else if (item.type === "shapeElement") {
      content = ""; // Shapes don't need text content
    } else if (item.type === "frameElement") {
      content = item.content || "Frame";
    } else if (item.type === "imageElement") {
      content = "🖼️ Image";
    } else if (item.type === "mindMapNode") {
      content = item.content || "Mind Map Node";
    } else if (item.type === "flowchartBox") {
      content = item.content || "Process";
    } else if (item.type === "kanbanCard") {
      content = item.content || "Task";
    } else if (item.type === "tableElement") {
      content = "📊 Table";
    } else if (item.type === "embedElement") {
      content = "🔗 Embed";
    }

    return content;
  }, [item.content, item.type]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    onMouseDown(e, item.id);
  }, [onMouseDown, item.id]);

  const handleClick = useCallback(() => {
    onSelect(item.id);
  }, [onSelect, item.id]);

  return (
    <div
      style={baseStyle}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      {content}
      {itemSpecificControls}
      {resizeHandle}
    </div>
  );
});

BasicCanvasItem.displayName = 'BasicCanvasItem';

// Debug info component
const DebugInfo = memo<{
  stats: {
    totalItems: number;
    visibleItems: number;
    culledItems: number;
    cullingRatio: number;
  };
}>(({ stats }) => (
  <div
    style={{
      position: 'absolute',
      top: 10,
      right: 10,
      background: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '8px 12px',
      borderRadius: '8px',
      fontSize: '12px',
      fontFamily: 'monospace',
      zIndex: 10000,
      pointerEvents: 'none',
    }}
  >
    <div>Total: {stats.totalItems}</div>
    <div>Visible: {stats.visibleItems}</div>
    <div>Culled: {stats.culledItems}</div>
    <div>Ratio: {stats.cullingRatio.toFixed(1)}%</div>
  </div>
));

DebugInfo.displayName = 'DebugInfo';

export const OptimizedCanvasRenderer = memo<OptimizedCanvasRendererProps>(({
  items,
  selectedItemIds,
  canvasOffset,
  zoomLevel,
  containerWidth,
  containerHeight,
  onUpdateItem,
  onSelectItem,
  onMouseDownItem,
  renderResizeHandle,
  renderItemControls,
  showDebugInfo = false,
}) => {
  // Use virtualization to only render visible items
  const { visibleItems, stats } = useCanvasVirtualization({
    canvasItems: items,
    canvasOffset,
    zoomLevel,
    containerWidth,
    containerHeight,
  });

  // Use optimized item map for faster lookups
  const { getItem } = useCanvasItemMap(items);

  // Memoize the rendered items array
  const renderedItems = useMemo(() => {
    return visibleItems.map((item) => (
      <MemoizedCanvasItem
        key={item.id}
        item={item}
        isSelected={selectedItemIds.has(item.id)}
        onUpdateItem={onUpdateItem}
        onSelectItem={onSelectItem}
        onMouseDownItem={onMouseDownItem}
        renderResizeHandle={renderResizeHandle}
        renderItemControls={renderItemControls}
      />
    ));
  }, [
    visibleItems,
    selectedItemIds,
    onUpdateItem,
    onSelectItem,
    onMouseDownItem,
    renderResizeHandle,
    renderItemControls,
  ]);

  // Performance monitoring
  const renderCount = useRef(0);
  useEffect(() => {
    renderCount.current++;
    if (showDebugInfo && renderCount.current % 60 === 0) {
      console.log(`Canvas rendered ${renderCount.current} times. Current stats:`, stats);
    }
  });

  return (
    <>
      {renderedItems}
      {showDebugInfo && <DebugInfo stats={stats} />}
    </>
  );
}, (prevProps, nextProps) => {
  // Custom comparison to prevent unnecessary re-renders
  return (
    prevProps.items === nextProps.items &&
    prevProps.selectedItemIds === nextProps.selectedItemIds &&
    prevProps.canvasOffset.x === nextProps.canvasOffset.x &&
    prevProps.canvasOffset.y === nextProps.canvasOffset.y &&
    prevProps.zoomLevel === nextProps.zoomLevel &&
    prevProps.containerWidth === nextProps.containerWidth &&
    prevProps.containerHeight === nextProps.containerHeight
  );
});

OptimizedCanvasRenderer.displayName = 'OptimizedCanvasRenderer';

export default OptimizedCanvasRenderer;
