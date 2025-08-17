import React, { useState, useEffect, useMemo } from "react";
import { CanvasItem } from "../../types";
import { useCanvasVirtualization, useCanvasItemMap } from "../../hooks/useCanvasOptimization";
import { canvasWorkerService } from "../../services/canvasWorkerService";
import { TextElement } from "./TextElement";
import { CodeElement } from "./CodeElement";
import { ChartElement } from "./ChartElement";

interface EnhancedCanvasRendererProps {
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
  isNewlyCreated?: boolean;
}

interface SmartConnector {
  id: string;
  from: string;
  to: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  controlX: number;
  controlY: number;
}

// Enhanced Canvas Item with creation animation
const AnimatedCanvasItem = React.memo<{
  item: CanvasItem;
  isSelected: boolean;
  isNewlyCreated: boolean;
  animationDelay: number;
  onUpdateItem: (id: string, updates: Partial<CanvasItem>) => void;
  onSelectItem: (id: string) => void;
  onMouseDownItem: (e: React.MouseEvent, id: string) => void;
  renderResizeHandle: (item: CanvasItem) => React.ReactNode;
  renderItemControls: (item: CanvasItem) => React.ReactNode;
}>(({
  item,
  isSelected,
  isNewlyCreated,
  animationDelay,
  onUpdateItem,
  onSelectItem,
  onMouseDownItem,
  renderResizeHandle,
  renderItemControls,
}) => {
  const [hasAnimated, setHasAnimated] = useState(!isNewlyCreated);

  useEffect(() => {
    if (isNewlyCreated && !hasAnimated) {
      const timer = setTimeout(() => {
        setHasAnimated(true);
      }, animationDelay);
      return () => clearTimeout(timer);
    }
  }, [isNewlyCreated, hasAnimated, animationDelay]);

  const animationStyle: React.CSSProperties = isNewlyCreated && !hasAnimated ? {
    opacity: 0,
    transform: 'scale(0.3) translateY(-20px)',
    transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
  } : {
    opacity: 1,
    transform: 'scale(1) translateY(0px)',
    transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
  };

  const commonProps = useMemo(() => ({
    item,
    isSelected,
    onUpdate: onUpdateItem,
    onSelect: onSelectItem,
    onMouseDown: onMouseDownItem,
    resizeHandle: renderResizeHandle(item),
    itemSpecificControls: renderItemControls(item),
  }), [item, isSelected, onUpdateItem, onSelectItem, onMouseDownItem, renderResizeHandle, renderItemControls]);

  const Component = (() => {
    switch (item.type) {
      case "textElement":
      case "stickyNote":
      case "commentElement":
        return TextElement;
      case "codeBlock":
        return CodeElement;
      case "chart":
        return ChartElement;
      default:
        return BasicCanvasItem;
    }
  })();

  return (
    <div style={animationStyle}>
      <Component {...commonProps} />
    </div>
  );
});

AnimatedCanvasItem.displayName = 'AnimatedCanvasItem';

// Enhanced smart connector component
const SmartConnectorLine = React.memo<{
  connector: SmartConnector;
  isNewlyCreated: boolean;
  animationDelay: number;
}>(({ connector, isNewlyCreated, animationDelay }) => {
  const [hasAnimated, setHasAnimated] = useState(!isNewlyCreated);

  useEffect(() => {
    if (isNewlyCreated && !hasAnimated) {
      const timer = setTimeout(() => {
        setHasAnimated(true);
      }, animationDelay);
      return () => clearTimeout(timer);
    }
  }, [isNewlyCreated, hasAnimated, animationDelay]);

  const pathLength = Math.sqrt(
    Math.pow(connector.endX - connector.startX, 2) + 
    Math.pow(connector.endY - connector.startY, 2)
  );

  const animationStyle: React.CSSProperties = isNewlyCreated && !hasAnimated ? {
    strokeDasharray: pathLength,
    strokeDashoffset: pathLength,
    transition: 'stroke-dashoffset 0.8s ease-in-out',
  } : {
    strokeDasharray: 'none',
    strokeDashoffset: 0,
    transition: 'stroke-dashoffset 0.8s ease-in-out',
  };

  // Create smooth curved path
  const path = `M ${connector.startX} ${connector.startY} Q ${connector.controlX} ${connector.controlY} ${connector.endX} ${connector.endY}`;

  return (
    <g>
      {/* Connection line with smooth curve */}
      <path
        d={path}
        fill="none"
        stroke="#64748B"
        strokeWidth="2"
        style={animationStyle}
        markerEnd="url(#arrowhead)"
      />
      
      {/* Connection points */}
      <circle
        cx={connector.startX}
        cy={connector.startY}
        r="3"
        fill="#64748B"
        opacity={hasAnimated ? 0.8 : 0}
        style={{ transition: 'opacity 0.3s ease-in-out' }}
      />
      <circle
        cx={connector.endX}
        cy={connector.endY}
        r="3"
        fill="#64748B"
        opacity={hasAnimated ? 0.8 : 0}
        style={{ transition: 'opacity 0.3s ease-in-out' }}
      />
    </g>
  );
});

SmartConnectorLine.displayName = 'SmartConnectorLine';

// Basic canvas item for fallback rendering
const BasicCanvasItem = React.memo<{
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
  const baseStyle: React.CSSProperties = {
    position: "absolute",
    left: `${item.x}px`,
    top: `${item.y}px`,
    width: `${item.width || 200}px`,
    height: `${item.height || 100}px`,
    backgroundColor: item.backgroundColor || "#3B82F6",
    color: item.color || "#FFFFFF",
    border: `${item.borderWidth || 2}px solid ${item.borderColor || "#60A5FA"}`,
    borderRadius: "8px",
    padding: "16px",
    zIndex: item.zIndex,
    cursor: "grab",
    boxShadow: isSelected
      ? "0 0 0 2.5px #38BDF8, 0 6px 12px rgba(0,0,0,0.3)"
      : "0 2px 8px rgba(0,0,0,0.1)",
    transition: "box-shadow 0.15s ease-in-out",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    fontWeight: "500",
  };

  return (
    <div
      style={baseStyle}
      onMouseDown={(e) => onMouseDown(e, item.id)}
      onClick={() => onSelect(item.id)}
    >
      {item.content || "Canvas Item"}
      {itemSpecificControls}
      {resizeHandle}
    </div>
  );
});

BasicCanvasItem.displayName = 'BasicCanvasItem';

export const EnhancedCanvasRenderer: React.FC<EnhancedCanvasRendererProps> = ({
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
  isNewlyCreated = false,
}) => {
  const [smartConnectors, setSmartConnectors] = useState<SmartConnector[]>([]);
  const [isCalculatingLayout, setIsCalculatingLayout] = useState(false);

  // Use existing optimization hooks
  const { visibleItems, stats } = useCanvasVirtualization({
    canvasItems: items,
    canvasOffset,
    zoomLevel,
    containerWidth,
    containerHeight,
  });

  const { getItem } = useCanvasItemMap(items);

  // Calculate smart connectors when items change
  useEffect(() => {
    const calculateConnectors = async () => {
      if (items.length < 2) {
        setSmartConnectors([]);
        return;
      }

      // Extract connections from connector elements
      const connections = items
        .filter(item => item.type === 'connectorElement')
        .map(connector => ({
          from: connector.connectorFrom || '',
          to: connector.connectorTo || '',
        }))
        .filter(conn => conn.from && conn.to);

      if (connections.length === 0) {
        setSmartConnectors([]);
        return;
      }

      // Prepare nodes for calculation
      const nodes = items
        .filter(item => item.type !== 'connectorElement')
        .map(item => ({
          id: item.id,
          x: item.x,
          y: item.y,
          width: item.width || 200,
          height: item.height || 100,
        }));

      try {
        const calculatedConnectors = await canvasWorkerService.calculateSmartConnectors(nodes, connections);
        setSmartConnectors(calculatedConnectors);
      } catch (error) {
        console.warn('Failed to calculate smart connectors:', error);
      }
    };

    calculateConnectors();
  }, [items]);

  // Enhanced layout calculation with clustering
  useEffect(() => {
    if (isNewlyCreated && items.length > 3) {
      setIsCalculatingLayout(true);

      const runEnhancedLayout = async () => {
        try {
          // Prepare data for force-directed layout
          const layoutItems = items.map(item => ({
            id: item.id,
            x: item.x,
            y: item.y,
            width: item.width || 200,
            height: item.height || 100,
          }));

          const connections = smartConnectors.map(conn => ({
            from: conn.from,
            to: conn.to,
          }));

          const layoutResult = await canvasWorkerService.calculateLayout({
            items: layoutItems,
            connections,
            canvasWidth: containerWidth,
            canvasHeight: containerHeight,
            iterations: 150,
          });

          // Apply layout results with gentle animation
          layoutResult.forEach((result) => {
            onUpdateItem(result.id, {
              x: result.x,
              y: result.y,
            });
          });
        } catch (error) {
          console.warn('Layout calculation failed:', error);
        } finally {
          setIsCalculatingLayout(false);
        }
      };

      // Delay layout calculation to allow for initial render
      const timer = setTimeout(runEnhancedLayout, 100);
      return () => clearTimeout(timer);
    }
  }, [isNewlyCreated, items.length, containerWidth, containerHeight, onUpdateItem, smartConnectors]);

  const svgStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 1,
  };

  return (
    <>
      {/* Smart connector lines */}
      <svg style={svgStyle}>
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill="#64748B"
            />
          </marker>
        </defs>
        
        {smartConnectors.map((connector, index) => (
          <SmartConnectorLine
            key={connector.id}
            connector={connector}
            isNewlyCreated={isNewlyCreated}
            animationDelay={300 + index * 100}
          />
        ))}
      </svg>

      {/* Render visible canvas items with animations */}
      {visibleItems.map((item, index) => (
        <AnimatedCanvasItem
          key={item.id}
          item={item}
          isSelected={selectedItemIds.has(item.id)}
          isNewlyCreated={isNewlyCreated}
          animationDelay={index * 50}
          onUpdateItem={onUpdateItem}
          onSelectItem={onSelectItem}
          onMouseDownItem={onMouseDownItem}
          renderResizeHandle={renderResizeHandle}
          renderItemControls={renderItemControls}
        />
      ))}

      {/* Debug information */}
      {showDebugInfo && (
        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '8px',
            borderRadius: '4px',
            fontSize: '12px',
            zIndex: 1000,
          }}
        >
          <div>Total Items: {stats.totalItems}</div>
          <div>Visible Items: {stats.visibleItems}</div>
          <div>Culled Items: {stats.culledItems}</div>
          <div>Culling Ratio: {stats.cullingRatio.toFixed(1)}%</div>
          <div>Smart Connectors: {smartConnectors.length}</div>
          <div>Layout Calculating: {isCalculatingLayout ? 'Yes' : 'No'}</div>
        </div>
      )}

      {/* Layout calculation indicator */}
      {isCalculatingLayout && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '16px 24px',
            borderRadius: '8px',
            fontSize: '14px',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '16px',
              height: '16px',
              border: '2px solid #ffffff40',
              borderTop: '2px solid #ffffff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
          Optimizing mind map layout...
        </div>
      )}
    </>
  );
};

export default EnhancedCanvasRenderer;
