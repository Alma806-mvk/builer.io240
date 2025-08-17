import React, { useRef, useCallback } from "react";
import { Stage, Layer, Rect, Circle, Text, Line, Group, Star, Ring, Image } from 'react-konva';
import { CanvasItem, ShapeVariant } from "../../types";

interface ComprehensiveKonvaRendererProps {
  items: CanvasItem[];
  selectedItemId: string | null;
  onUpdateItem: (id: string, updates: Partial<CanvasItem>) => void;
  onSelectItem: (id: string) => void;
  onMouseDownItem: (e: any, id: string) => void;
  width: number;
  height: number;
  scale?: number;
  offsetX?: number;
  offsetY?: number;
}

export const ComprehensiveKonvaRenderer: React.FC<ComprehensiveKonvaRendererProps> = ({
  items,
  selectedItemId,
  onUpdateItem,
  onSelectItem,
  onMouseDownItem,
  width,
  height,
  scale = 1,
  offsetX = 0,
  offsetY = 0,
}) => {
  const stageRef = useRef<any>(null);

  // Helper function to get shape points for complex shapes
  const getShapePoints = (shapeVariant: ShapeVariant, width: number, height: number) => {
    switch (shapeVariant) {
      case "triangle":
        return [width / 2, 0, 0, height, width, height];
      
      case "diamond":
        return [width / 2, 0, width, height / 2, width / 2, height, 0, height / 2];
      
      case "hexagon":
        const hexPoints = [];
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          const x = Math.cos(angle) * (width / 2) + width / 2;
          const y = Math.sin(angle) * (height / 2) + height / 2;
          hexPoints.push(x, y);
        }
        return hexPoints;
      
      case "pentagon":
        const pentPoints = [];
        for (let i = 0; i < 5; i++) {
          const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
          const x = Math.cos(angle) * (width / 2) + width / 2;
          const y = Math.sin(angle) * (height / 2) + height / 2;
          pentPoints.push(x, y);
        }
        return pentPoints;
      
      case "octagon":
        const octPoints = [];
        for (let i = 0; i < 8; i++) {
          const angle = (i * Math.PI) / 4;
          const x = Math.cos(angle) * (width / 2) + width / 2;
          const y = Math.sin(angle) * (height / 2) + height / 2;
          octPoints.push(x, y);
        }
        return octPoints;
      
      case "rightArrow":
        return [
          0, height / 4,
          width * 0.7, height / 4,
          width * 0.7, 0,
          width, height / 2,
          width * 0.7, height,
          width * 0.7, height * 0.75,
          0, height * 0.75
        ];
      
      case "leftArrow":
        return [
          width, height / 4,
          width * 0.3, height / 4,
          width * 0.3, 0,
          0, height / 2,
          width * 0.3, height,
          width * 0.3, height * 0.75,
          width, height * 0.75
        ];
      
      case "upArrow":
        return [
          width / 4, height,
          width / 4, height * 0.3,
          0, height * 0.3,
          width / 2, 0,
          width, height * 0.3,
          width * 0.75, height * 0.3,
          width * 0.75, height
        ];
      
      case "downArrow":
        return [
          width / 4, 0,
          width / 4, height * 0.7,
          0, height * 0.7,
          width / 2, height,
          width, height * 0.7,
          width * 0.75, height * 0.7,
          width * 0.75, 0
        ];
      
      case "heart":
        // Simplified heart shape using line points
        return [
          width / 2, height * 0.8,
          width * 0.2, height * 0.4,
          width * 0.2, height * 0.2,
          width * 0.4, height * 0.1,
          width / 2, height * 0.3,
          width * 0.6, height * 0.1,
          width * 0.8, height * 0.2,
          width * 0.8, height * 0.4
        ];
      
      default:
        return [];
    }
  };

  // Render shape elements
  const renderShapeElement = (item: CanvasItem, isSelected: boolean) => {
    const width = item.width || 200;
    const height = item.height || 100;
    const shapeVariant = item.shapeVariant || "rectangle";
    
    const baseProps = {
      x: item.x,
      y: item.y,
      fill: item.backgroundColor || "#3B82F6",
      stroke: isSelected ? "#38BDF8" : (item.borderColor || "#2563EB"),
      strokeWidth: isSelected ? 3 : parseInt(item.borderWidth || "1"),
      draggable: true,
      onDragEnd: (e: any) => {
        onUpdateItem(item.id, {
          x: e.target.x(),
          y: e.target.y(),
        });
      },
      onClick: () => onSelectItem(item.id),
      onTap: () => onSelectItem(item.id),
      onMouseDown: (e: any) => onMouseDownItem(e, item.id),
    };

    // Handle specific shape types
    switch (shapeVariant) {
      case "circle":
        return (
          <Circle
            key={item.id}
            {...baseProps}
            radius={Math.min(width, height) / 2}
            x={item.x + width / 2}
            y={item.y + height / 2}
          />
        );
      
      case "ellipse":
        return (
          <Rect
            key={item.id}
            {...baseProps}
            width={width}
            height={height}
            cornerRadius={[width / 2, height / 2]}
          />
        );
      
      case "star":
        return (
          <Star
            key={item.id}
            {...baseProps}
            numPoints={5}
            innerRadius={Math.min(width, height) / 4}
            outerRadius={Math.min(width, height) / 2}
            x={item.x + width / 2}
            y={item.y + height / 2}
          />
        );
      
      case "roundedRectangle":
        return (
          <Rect
            key={item.id}
            {...baseProps}
            width={width}
            height={height}
            cornerRadius={20}
          />
        );
      
      case "triangle":
      case "diamond":
      case "hexagon":
      case "pentagon":
      case "octagon":
      case "rightArrow":
      case "leftArrow":
      case "upArrow":
      case "downArrow":
      case "heart":
        const points = getShapePoints(shapeVariant, width, height);
        return (
          <Line
            key={item.id}
            {...baseProps}
            points={points}
            closed={true}
          />
        );
      
      default: // rectangle
        return (
          <Rect
            key={item.id}
            {...baseProps}
            width={width}
            height={height}
          />
        );
    }
  };

  // Render sticky note
  const renderStickyNote = (item: CanvasItem, isSelected: boolean) => {
    const width = item.width || 200;
    const height = item.height || 100;
    
    return (
      <Group
        key={item.id}
        x={item.x}
        y={item.y}
        draggable={true}
        onDragEnd={(e) => {
          onUpdateItem(item.id, {
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onClick={() => onSelectItem(item.id)}
        onTap={() => onSelectItem(item.id)}
        onMouseDown={(e) => onMouseDownItem(e, item.id)}
      >
        <Rect
          width={width}
          height={height}
          fill={item.backgroundColor || "#FBBF24"}
          stroke={isSelected ? "#38BDF8" : (item.borderColor || "#F59E0B")}
          strokeWidth={isSelected ? 3 : parseInt(item.borderWidth || "1")}
          cornerRadius={8}
          shadowColor="rgba(0,0,0,0.3)"
          shadowBlur={4}
          shadowOffset={{ x: 2, y: 2 }}
        />
        <Text
          x={12}
          y={12}
          width={width - 24}
          height={height - 24}
          text={item.content || "Sticky Note"}
          fontSize={parseInt(item.fontSize || "14")}
          fontFamily={item.fontFamily || "Inter, sans-serif"}
          fill={item.textColor || "#000000"}
          fontStyle={item.fontStyle === "italic" ? "italic" : "normal"}
          fontVariant={item.fontWeight === "bold" ? "bold" : "normal"}
          align="left"
          verticalAlign="top"
          wrap="word"
        />
      </Group>
    );
  };

  // Render mind map node
  const renderMindMapNode = (item: CanvasItem, isSelected: boolean) => {
    const nodeType = item.mindMapNodeType || "primary";
    const textLength = (item.content || "").length;
    
    // Enhanced auto-sizing based on content length and node type
    const autoWidth = Math.max(
      nodeType === "central" ? 300 : nodeType === "primary" ? 200 : 150,
      Math.min(
        nodeType === "central" ? 500 : nodeType === "primary" ? 350 : 250,
        textLength * (nodeType === "central" ? 12 : nodeType === "primary" ? 10 : 8) + 60
      )
    );
    const autoHeight = nodeType === "central" ? 120 : nodeType === "primary" ? 100 : 80;
    
    const width = item.width || autoWidth;
    const height = item.height || autoHeight;
    
    // Dynamic font sizing
    const baseFontSize = nodeType === "central" ? 20 : nodeType === "primary" ? 16 : 14;
    const adjustedFontSize = Math.max(
      nodeType === "central" ? 16 : nodeType === "primary" ? 14 : 12,
      Math.min(baseFontSize, 300 / Math.max(textLength, 8))
    );
    
    const isCircle = item.mindMapShape === "circle" || item.mindMapShape === "ellipse";
    
    // Default colors based on node type
    const defaultColor = nodeType === "central" ? "#8B5CF6" : 
                        nodeType === "primary" ? "#3B82F6" : "#10B981";
    
    return (
      <Group
        key={item.id}
        x={item.x}
        y={item.y}
        draggable={true}
        onDragEnd={(e) => {
          onUpdateItem(item.id, {
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onClick={() => onSelectItem(item.id)}
        onTap={() => onSelectItem(item.id)}
        onMouseDown={(e) => onMouseDownItem(e, item.id)}
      >
        {isCircle ? (
          <Circle
            radius={Math.min(width, height) / 2}
            x={width / 2}
            y={height / 2}
            fill={item.backgroundColor || defaultColor}
            stroke={isSelected ? "#38BDF8" : (item.borderColor || "#6366F1")}
            strokeWidth={isSelected ? 3 : 2}
            shadowColor="rgba(0,0,0,0.2)"
            shadowBlur={nodeType === "central" ? 8 : nodeType === "primary" ? 6 : 4}
            shadowOffset={{ x: 2, y: 2 }}
          />
        ) : (
          <Rect
            width={width}
            height={height}
            fill={item.backgroundColor || defaultColor}
            stroke={isSelected ? "#38BDF8" : (item.borderColor || "#6366F1")}
            strokeWidth={isSelected ? 3 : 2}
            cornerRadius={item.mindMapShape === "rectangle" ? 8 : 20}
            shadowColor="rgba(0,0,0,0.2)"
            shadowBlur={nodeType === "central" ? 8 : nodeType === "primary" ? 6 : 4}
            shadowOffset={{ x: 2, y: 2 }}
          />
        )}
        
        {/* Mind map icon if present */}
        {item.mindMapIcon && (
          <Text
            x={width / 2}
            y={height / 2 - adjustedFontSize}
            text={item.mindMapIcon}
            fontSize={Math.max(16, adjustedFontSize * 1.2)}
            fontFamily="Arial, sans-serif"
            fill={item.textColor || "#FFFFFF"}
            align="center"
            offsetX={0}
            offsetY={0}
          />
        )}
        
        <Text
          x={12}
          y={item.mindMapIcon ? height / 2 + 4 : height / 2}
          width={width - 24}
          text={item.content || "Mind Map Node"}
          fontSize={adjustedFontSize}
          fontFamily={item.fontFamily || "Inter, sans-serif"}
          fill={item.textColor || "#FFFFFF"}
          fontStyle={item.fontWeight === "bold" ? "bold" : (nodeType === "central" ? "bold" : nodeType === "primary" ? "600" : "normal")}
          align="center"
          verticalAlign={item.mindMapIcon ? "top" : "middle"}
          wrap="word"
        />
      </Group>
    );
  };

  // Render text element
  const renderTextElement = (item: CanvasItem, isSelected: boolean) => {
    const width = item.width || 200;
    const height = item.height || 100;
    
    return (
      <Group
        key={item.id}
        x={item.x}
        y={item.y}
        draggable={true}
        onDragEnd={(e) => {
          onUpdateItem(item.id, {
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onClick={() => onSelectItem(item.id)}
        onTap={() => onSelectItem(item.id)}
        onMouseDown={(e) => onMouseDownItem(e, item.id)}
      >
        <Rect
          width={width}
          height={height}
          fill={item.backgroundColor || "transparent"}
          stroke={isSelected ? "#38BDF8" : (item.borderColor || "transparent")}
          strokeWidth={isSelected ? 2 : parseInt(item.borderWidth || "1")}
          cornerRadius={8}
        />
        <Text
          x={12}
          y={12}
          width={width - 24}
          height={height - 24}
          text={item.content || "Text Element"}
          fontSize={parseInt(item.fontSize || "16")}
          fontFamily={item.fontFamily || "Inter, sans-serif"}
          fill={item.textColor || "#000000"}
          fontStyle={item.fontStyle === "italic" ? "italic" : "normal"}
          fontVariant={item.fontWeight === "bold" ? "bold" : "normal"}
          align="left"
          verticalAlign="top"
          wrap="word"
        />
      </Group>
    );
  };

  // Render connector element
  const renderConnectorElement = (item: CanvasItem, isSelected: boolean) => {
    // Find connected items using either new or legacy property names
    const startItem = items.find(i => i.id === (item.connectorFrom || item.startNodeId));
    const endItem = items.find(i => i.id === (item.connectorTo || item.endNodeId));
    
    if (!startItem || !endItem) {
      return null; // Don't render if connected items not found
    }
    
    const startX = startItem.x + (startItem.width || 200) / 2;
    const startY = startItem.y + (startItem.height || 100) / 2;
    const endX = endItem.x + (endItem.width || 200) / 2;
    const endY = endItem.y + (endItem.height || 100) / 2;
    
    let points: number[];
    
    switch (item.connectorType) {
      case "curved":
        const midX = (startX + endX) / 2;
        const midY = Math.min(startY, endY) - 50;
        points = [startX, startY, midX, midY, endX, endY];
        break;
      case "elbow":
        const elbowX = startX + (endX - startX) * 0.7;
        points = [startX, startY, elbowX, startY, elbowX, endY, endX, endY];
        break;
      default: // straight
        points = [startX, startY, endX, endY];
    }
    
    return (
      <Line
        key={item.id}
        points={points}
        stroke={isSelected ? "#38BDF8" : (item.borderColor || "#374151")}
        strokeWidth={isSelected ? 3 : parseInt(item.strokeWidth?.toString() || "2")}
        tension={item.connectorType === "curved" ? 0.5 : 0}
        onClick={() => onSelectItem(item.id)}
        onTap={() => onSelectItem(item.id)}
        onMouseDown={(e) => onMouseDownItem(e, item.id)}
      />
    );
  };

  // Render frame element
  const renderFrameElement = (item: CanvasItem, isSelected: boolean) => {
    const width = item.width || 300;
    const height = item.height || 200;
    
    return (
      <Group
        key={item.id}
        x={item.x}
        y={item.y}
        draggable={true}
        onDragEnd={(e) => {
          onUpdateItem(item.id, {
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onClick={() => onSelectItem(item.id)}
        onTap={() => onSelectItem(item.id)}
        onMouseDown={(e) => onMouseDownItem(e, item.id)}
      >
        <Rect
          width={width}
          height={height}
          fill="transparent"
          stroke={isSelected ? "#38BDF8" : (item.borderColor || "#9CA3AF")}
          strokeWidth={isSelected ? 3 : 2}
          dash={[10, 5]}
          cornerRadius={8}
        />
        <Text
          x={12}
          y={12}
          text={item.content || "Frame"}
          fontSize={parseInt(item.fontSize || "14")}
          fontFamily={item.fontFamily || "Inter, sans-serif"}
          fill={item.textColor || "#6B7280"}
          fontStyle={item.fontWeight === "bold" ? "bold" : "normal"}
        />
      </Group>
    );
  };

  // Main render function for canvas items
  const renderCanvasItem = useCallback((item: CanvasItem) => {
    const isSelected = selectedItemId === item.id;

    switch (item.type) {
      case "stickyNote":
        return renderStickyNote(item, isSelected);
      
      case "shapeElement":
        return renderShapeElement(item, isSelected);
      
      case "mindMapNode":
        return renderMindMapNode(item, isSelected);
      
      case "textElement":
      case "commentElement":
        return renderTextElement(item, isSelected);
      
      case "connectorElement":
        return renderConnectorElement(item, isSelected);
      
      case "frameElement":
        return renderFrameElement(item, isSelected);
      
      default:
        // Fallback rendering for other types
        return (
          <Group
            key={item.id}
            x={item.x}
            y={item.y}
            draggable={true}
            onDragEnd={(e) => {
              onUpdateItem(item.id, {
                x: e.target.x(),
                y: e.target.y(),
              });
            }}
            onClick={() => onSelectItem(item.id)}
            onTap={() => onSelectItem(item.id)}
            onMouseDown={(e) => onMouseDownItem(e, item.id)}
          >
            <Rect
              width={item.width || 200}
              height={item.height || 100}
              fill={item.backgroundColor || "#3B82F6"}
              stroke={isSelected ? "#38BDF8" : (item.borderColor || "#2563EB")}
              strokeWidth={isSelected ? 3 : 1}
              cornerRadius={8}
            />
            <Text
              x={12}
              y={(item.height || 100) / 2 - 8}
              width={(item.width || 200) - 24}
              text={item.content || `${item.type}`}
              fontSize={14}
              fontFamily="Inter, sans-serif"
              fill={item.textColor || "#FFFFFF"}
              align="center"
              wrap="word"
            />
          </Group>
        );
    }
  }, [selectedItemId, onUpdateItem, onSelectItem, onMouseDownItem, items]);

  // Sort items by zIndex for proper layering
  const sortedItems = [...items].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

  return (
    <Stage
      ref={stageRef}
      width={width}
      height={height}
      scaleX={scale}
      scaleY={scale}
      x={offsetX}
      y={offsetY}
      draggable={false}
    >
      <Layer>
        {sortedItems.map(renderCanvasItem)}
      </Layer>
    </Stage>
  );
};

export default ComprehensiveKonvaRenderer;
