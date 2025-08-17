import React, { memo, useMemo, useCallback, useEffect, useState } from "react";
import { CanvasItem } from "../../types";
import { canvasWorkerService } from "../../services/canvasWorkerService";

interface OptimizedConnectorElementProps {
  item: CanvasItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onMouseDown: (e: React.MouseEvent, id: string) => void;
  resizeHandle?: React.ReactNode;
  itemSpecificControls?: React.ReactNode;
}

export const OptimizedConnectorElement = memo<OptimizedConnectorElementProps>(({
  item,
  isSelected,
  onSelect,
  onMouseDown,
  resizeHandle,
  itemSpecificControls,
}) => {
  const [bezierPath, setBezierPath] = useState<string>('');
  const [isCalculating, setIsCalculating] = useState(false);

  // Connector properties
  const connectorType = item.connectorType || "straight";
  const connectorStyle = item.connectorStyle || "solid";
  const thickness = item.connectorThickness || 2;
  const arrowStart = item.connectorArrowStart || false;
  const arrowEnd = item.connectorArrowEnd !== false;
  const showPoints = item.connectorShowPoints || false;
  const animation = item.connectorAnimation || "none";
  const color = item.backgroundColor || "#64748B";

  // Calculate Bezier curve using Web Worker for complex curves
  useEffect(() => {
    if (connectorType === "curved" || connectorType === "elbow") {
      setIsCalculating(true);
      
      const width = item.width || 150;
      const height = item.height || 8;
      
      canvasWorkerService.calculateBezierCurve({
        startX: 0,
        startY: height / 2,
        endX: width,
        endY: height / 2,
        controlPoints: connectorType === "curved" ? [{ x: width / 2, y: height / 4 }] : undefined,
        segments: Math.max(20, Math.min(100, width / 10)), // Adaptive segment count
      }).then(result => {
        setBezierPath(result.path);
        setIsCalculating(false);
      }).catch(error => {
        console.warn('Bezier calculation failed:', error);
        // Fallback to simple path
        setBezierPath(`M 0 ${height / 2} L ${width} ${height / 2}`);
        setIsCalculating(false);
      });
    }
  }, [connectorType, item.width, item.height]);

  // Memoize stroke style calculation
  const strokeDashArray = useMemo(() => {
    switch (connectorStyle) {
      case "dashed":
        return "8 4";
      case "dotted":
        return "2 2";
      default:
        return "none";
    }
  }, [connectorStyle]);

  // Memoize simple path calculation for straight lines
  const simplePath = useMemo(() => {
    if (connectorType === "straight") {
      const height = item.height || 8;
      return `M 0 ${height / 2} L ${item.width || 150} ${height / 2}`;
    }
    return bezierPath;
  }, [connectorType, item.width, item.height, bezierPath]);

  // Memoize animation keyframes
  const animationKeyframes = useMemo(() => {
    if (animation === "none") return "";
    
    switch (animation) {
      case "flow":
        return `
          @keyframes flow-${item.id} {
            0% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: -20; }
          }
        `;
      case "pulse":
        return `
          @keyframes pulse-${item.id} {
            0%, 100% { opacity: 1; stroke-width: ${thickness}; }
            50% { opacity: 0.6; stroke-width: ${thickness * 1.5}; }
          }
        `;
      case "dash":
        return `
          @keyframes dash-${item.id} {
            0% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: -10; }
          }
        `;
      case "glow":
        return `
          @keyframes glow-${item.id} {
            0%, 100% { filter: drop-shadow(0 0 2px ${color}); }
            50% { filter: drop-shadow(0 0 8px ${color}) drop-shadow(0 0 12px ${color}); }
          }
        `;
      default:
        return "";
    }
  }, [animation, item.id, thickness, color]);

  // Memoize animation style
  const animationStyle = useMemo(() => {
    switch (animation) {
      case "flow":
        return {
          animation: `flow-${item.id} 2s linear infinite`,
          strokeDasharray: "10 5",
        };
      case "pulse":
        return { animation: `pulse-${item.id} 1.5s ease-in-out infinite` };
      case "dash":
        return {
          animation: `dash-${item.id} 1s linear infinite`,
          strokeDasharray: "5 5",
        };
      case "glow":
        return { animation: `glow-${item.id} 2s ease-in-out infinite` };
      default:
        return {};
    }
  }, [animation, item.id]);

  // Memoize base style
  const baseStyle: React.CSSProperties = useMemo(() => ({
    position: "absolute",
    left: `${item.x}px`,
    top: `${item.y}px`,
    width: `${item.width || 150}px`,
    height: `${item.height || 8}px`,
    zIndex: item.zIndex,
    overflow: "visible",
    pointerEvents: "auto",
    cursor: "grab",
    boxShadow: isSelected
      ? "0 0 0 2.5px #38BDF8, 0 6px 12px rgba(0,0,0,0.3)"
      : "none",
    transition: "box-shadow 0.15s ease-in-out",
  }), [item.x, item.y, item.width, item.height, item.zIndex, isSelected]);

  // Memoize event handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    onMouseDown(e, item.id);
  }, [onMouseDown, item.id]);

  const handleClick = useCallback(() => {
    onSelect(item.id);
  }, [onSelect, item.id]);

  // Show loading state for complex calculations
  if (isCalculating && (connectorType === "curved" || connectorType === "elbow")) {
    return (
      <div style={baseStyle} onMouseDown={handleMouseDown} onClick={handleClick}>
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          fontSize: '10px',
          color: color,
          opacity: 0.6
        }}>
          Calculating...
        </div>
        {itemSpecificControls}
        {resizeHandle}
      </div>
    );
  }

  return (
    <>
      {/* Inject animation keyframes only when needed */}
      {animation !== "none" && <style>{animationKeyframes}</style>}

      <div style={baseStyle} onMouseDown={handleMouseDown} onClick={handleClick}>
        <svg width="100%" height="100%" style={{ overflow: "visible" }}>
          {/* Definitions for arrows and gradients */}
          <defs>
            {/* Arrow markers */}
            {arrowStart && (
              <marker
                id={`arrowStart-${item.id}`}
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <polygon points="0,0 0,6 9,3" fill={color} />
              </marker>
            )}
            {arrowEnd && (
              <marker
                id={`arrowEnd-${item.id}`}
                markerWidth="10"
                markerHeight="10"
                refX="1"
                refY="3"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <polygon points="0,3 9,0 9,6" fill={color} />
              </marker>
            )}

            {/* Flow gradient */}
            {animation === "flow" && (
              <linearGradient
                id={`flowGradient-${item.id}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                <stop offset="50%" stopColor={color} stopOpacity="1" />
                <stop offset="100%" stopColor={color} stopOpacity="0.3" />
                <animateTransform
                  attributeName="gradientTransform"
                  type="translate"
                  values="-100 0; 100 0; -100 0"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </linearGradient>
            )}
          </defs>

          {/* Main connector path */}
          <path
            d={simplePath}
            fill="none"
            stroke={animation === "flow" ? `url(#flowGradient-${item.id})` : color}
            strokeWidth={thickness}
            strokeDasharray={
              animation === "flow" || animation === "dash"
                ? animationStyle.strokeDasharray
                : strokeDashArray
            }
            markerStart={arrowStart ? `url(#arrowStart-${item.id})` : "none"}
            markerEnd={arrowEnd ? `url(#arrowEnd-${item.id})` : "none"}
            style={animationStyle}
          />

          {/* Double line for double style */}
          {connectorStyle === "double" && connectorType === "straight" && (
            <>
              <line
                x1="0"
                y1={(item.height || 8) / 2 - thickness * 0.75}
                x2={item.width || 150}
                y2={(item.height || 8) / 2 - thickness * 0.75}
                stroke={color}
                strokeWidth={thickness / 2}
                style={animationStyle}
              />
              <line
                x1="0"
                y1={(item.height || 8) / 2 + thickness * 0.75}
                x2={item.width || 150}
                y2={(item.height || 8) / 2 + thickness * 0.75}
                stroke={color}
                strokeWidth={thickness / 2}
                style={animationStyle}
              />
            </>
          )}

          {/* Connection points */}
          {showPoints && (
            <>
              <circle
                cx="0"
                cy={(item.height || 8) / 2}
                r="4"
                fill={color}
                opacity="0.8"
                stroke="white"
                strokeWidth="1"
              />
              <circle
                cx={item.width || 150}
                cy={(item.height || 8) / 2}
                r="4"
                fill={color}
                opacity="0.8"
                stroke="white"
                strokeWidth="1"
              />
            </>
          )}
        </svg>
        {itemSpecificControls}
        {resizeHandle}
      </div>
    </>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for better performance
  const prevItem = prevProps.item;
  const nextItem = nextProps.item;
  
  return (
    prevItem.id === nextItem.id &&
    prevItem.x === nextItem.x &&
    prevItem.y === nextItem.y &&
    prevItem.width === nextItem.width &&
    prevItem.height === nextItem.height &&
    prevItem.connectorType === nextItem.connectorType &&
    prevItem.connectorStyle === nextItem.connectorStyle &&
    prevItem.connectorThickness === nextItem.connectorThickness &&
    prevItem.connectorAnimation === nextItem.connectorAnimation &&
    prevItem.backgroundColor === nextItem.backgroundColor &&
    prevProps.isSelected === nextProps.isSelected
  );
});

OptimizedConnectorElement.displayName = 'OptimizedConnectorElement';

export default OptimizedConnectorElement;
