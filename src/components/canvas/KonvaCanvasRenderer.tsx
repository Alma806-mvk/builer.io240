import React, { useRef, useEffect, useState } from "react";
import { Stage, Layer, Rect, Circle, Text, Line, Group, Star, Ring } from 'react-konva';
import { CanvasItem, ShapeVariant } from "../../types";

interface KonvaCanvasRendererProps {
  items: CanvasItem[];
  selectedItemId: string | null;
  onUpdateItem: (id: string, updates: Partial<CanvasItem>) => void;
  onSelectItem: (id: string) => void;
  width: number;
  height: number;
  scale?: number;
  offsetX?: number;
  offsetY?: number;
}

export const KonvaCanvasRenderer: React.FC<KonvaCanvasRendererProps> = ({
  items,
  selectedItemId,
  onUpdateItem,
  onSelectItem,
  width,
  height,
  scale = 1,
  offsetX = 0,
  offsetY = 0,
}) => {
  const stageRef = useRef<any>(null);

  // Render different shape variants
  const renderShape = (item: CanvasItem, isSelected: boolean) => {
    const baseProps = {
      x: item.x,
      y: item.y,
      fill: item.backgroundColor || "#3B82F6",
      stroke: item.borderColor || "#2563EB",
      strokeWidth: parseInt(item.borderWidth || "1"),
      draggable: true,
      onDragEnd: (e: any) => {
        onUpdateItem(item.id, {
          x: e.target.x(),
          y: e.target.y(),
        });
      },
      onClick: () => onSelectItem(item.id),
      onTap: () => onSelectItem(item.id),
    };

    const width = item.width || 200;
    const height = item.height || 100;

    // Add selection styling
    if (isSelected) {
      baseProps.stroke = "#38BDF8";
      baseProps.strokeWidth = 3;
    }

    switch (item.shapeVariant) {
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

      case "triangle":
        const trianglePoints = [
          width / 2, 0,
          0, height,
          width, height
        ];
        return (
          <Line
            key={item.id}
            {...baseProps}
            points={trianglePoints}
            closed={true}
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

      case "diamond":
        const diamondPoints = [
          width / 2, 0,
          width, height / 2,
          width / 2, height,
          0, height / 2
        ];
        return (
          <Line
            key={item.id}
            {...baseProps}
            points={diamondPoints}
            closed={true}
          />
        );

      case "hexagon":
        const hexPoints = [];
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          const x = Math.cos(angle) * (width / 2) + width / 2;
          const y = Math.sin(angle) * (height / 2) + height / 2;
          hexPoints.push(x, y);
        }
        return (
          <Line
            key={item.id}
            {...baseProps}
            points={hexPoints}
            closed={true}
          />
        );

      case "rightArrow":
        const arrowPoints = [
          0, height / 4,
          width * 0.7, height / 4,
          width * 0.7, 0,
          width, height / 2,
          width * 0.7, height,
          width * 0.7, height * 0.75,
          0, height * 0.75
        ];
        return (
          <Line
            key={item.id}
            {...baseProps}
            points={arrowPoints}
            closed={true}
          />
        );

      case "ellipse":
        return (
          <Ring
            key={item.id}
            {...baseProps}
            innerRadius={0}
            outerRadius={Math.min(width, height) / 2}
            x={item.x + width / 2}
            y={item.y + height / 2}
            scaleX={width / height}
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

      default: // rectangle
        return (
          <Rect
            key={item.id}
            {...baseProps}
            width={width}
            height={height}
            cornerRadius={item.shapeVariant === "roundedRectangle" ? 20 : 0}
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
      >
        <Rect
          width={width}
          height={height}
          fill={item.backgroundColor || "#FBBF24"}
          stroke={isSelected ? "#38BDF8" : item.borderColor || "#F59E0B"}
          strokeWidth={isSelected ? 3 : parseInt(item.borderWidth || "1")}
          cornerRadius={8}
          shadowColor="rgba(0,0,0,0.3)"
          shadowBlur={4}
          shadowOffset={{ x: 2, y: 2 }}
        />
        <Text
          x={8}
          y={8}
          width={width - 16}
          height={height - 16}
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
    const autoWidth = Math.max(
      nodeType === "central" ? 300 : nodeType === "primary" ? 200 : 150,
      Math.min(
        nodeType === "central" ? 500 : nodeType === "primary" ? 350 : 250,
        (item.content?.length || 0) * (nodeType === "central" ? 12 : nodeType === "primary" ? 10 : 8) + 60
      )
    );
    const autoHeight = nodeType === "central" ? 120 : nodeType === "primary" ? 100 : 80;
    
    const width = item.width || autoWidth;
    const height = item.height || autoHeight;
    const fontSize = nodeType === "central" ? 20 : nodeType === "primary" ? 16 : 14;
    
    const isCircle = item.mindMapShape === "circle" || item.mindMapShape === "ellipse";
    
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
      >
        {isCircle ? (
          <Circle
            radius={Math.min(width, height) / 2}
            x={width / 2}
            y={height / 2}
            fill={item.backgroundColor || (nodeType === "central" ? "#8B5CF6" : nodeType === "primary" ? "#3B82F6" : "#10B981")}
            stroke={isSelected ? "#38BDF8" : item.borderColor || "#6366F1"}
            strokeWidth={isSelected ? 3 : 2}
            shadowColor="rgba(0,0,0,0.2)"
            shadowBlur={6}
            shadowOffset={{ x: 2, y: 2 }}
          />
        ) : (
          <Rect
            width={width}
            height={height}
            fill={item.backgroundColor || (nodeType === "central" ? "#8B5CF6" : nodeType === "primary" ? "#3B82F6" : "#10B981")}
            stroke={isSelected ? "#38BDF8" : item.borderColor || "#6366F1"}
            strokeWidth={isSelected ? 3 : 2}
            cornerRadius={item.mindMapShape === "rectangle" ? 8 : 20}
            shadowColor="rgba(0,0,0,0.2)"
            shadowBlur={6}
            shadowOffset={{ x: 2, y: 2 }}
          />
        )}
        <Text
          x={8}
          y={height / 2}
          width={width - 16}
          text={item.content || "Mind Map Node"}
          fontSize={fontSize}
          fontFamily={item.fontFamily || "Inter, sans-serif"}
          fill={item.textColor || "#FFFFFF"}
          fontStyle={item.fontWeight === "bold" ? "bold" : "normal"}
          align="center"
          verticalAlign="middle"
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
      >
        <Rect
          width={width}
          height={height}
          fill={item.backgroundColor || "transparent"}
          stroke={isSelected ? "#38BDF8" : item.borderColor || "transparent"}
          strokeWidth={isSelected ? 2 : parseInt(item.borderWidth || "1")}
          cornerRadius={8}
        />
        <Text
          x={8}
          y={8}
          width={width - 16}
          height={height - 16}
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
    // Find connected items
    const startItem = items.find(i => i.id === item.connectorFrom);
    const endItem = items.find(i => i.id === item.connectorTo);
    
    if (!startItem || !endItem) {
      return null; // Don't render if connected items not found
    }
    
    const startX = startItem.x + (startItem.width || 200) / 2;
    const startY = startItem.y + (startItem.height || 100) / 2;
    const endX = endItem.x + (endItem.width || 200) / 2;
    const endY = endItem.y + (endItem.height || 100) / 2;
    
    const points = item.connectorType === "curved" 
      ? [startX, startY, (startX + endX) / 2, startY - 50, endX, endY]
      : [startX, startY, endX, endY];
    
    return (
      <Line
        key={item.id}
        points={points}
        stroke={isSelected ? "#38BDF8" : item.borderColor || "#374151"}
        strokeWidth={isSelected ? 3 : parseInt(item.strokeWidth?.toString() || "2")}
        tension={item.connectorType === "curved" ? 0.5 : 0}
        onClick={() => onSelectItem(item.id)}
        onTap={() => onSelectItem(item.id)}
      />
    );
  };

  // Main render function for canvas items
  const renderCanvasItem = (item: CanvasItem) => {
    const isSelected = selectedItemId === item.id;

    switch (item.type) {
      case "stickyNote":
        return renderStickyNote(item, isSelected);
      
      case "shapeElement":
        return renderShape(item, isSelected);
      
      case "mindMapNode":
        return renderMindMapNode(item, isSelected);
      
      case "textElement":
      case "commentElement":
        return renderTextElement(item, isSelected);
      
      case "connectorElement":
        return renderConnectorElement(item, isSelected);
      
      default:
        // Fallback to basic rectangle for unknown types
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
          >
            <Rect
              width={item.width || 200}
              height={item.height || 100}
              fill={item.backgroundColor || "#3B82F6"}
              stroke={isSelected ? "#38BDF8" : item.borderColor || "#2563EB"}
              strokeWidth={isSelected ? 3 : 1}
              cornerRadius={8}
            />
            <Text
              x={8}
              y={(item.height || 100) / 2 - 8}
              width={(item.width || 200) - 16}
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
  };

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

export default KonvaCanvasRenderer;
