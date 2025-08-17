import React from "react";
import { Stage, Layer } from 'react-konva';
import { CanvasItem } from "../../types";
import { TextElement } from "./TextElement";
import { CodeElement } from "./CodeElement";
import { ConnectorElement } from "./ConnectorElement";
import { ChartElement } from "./ChartElement";
import { MindMapConnectorElement } from "./MindMapConnectorElement";
import ComprehensiveKonvaRenderer from "./ComprehensiveKonvaRenderer";

interface CanvasRendererProps {
  items: CanvasItem[];
  selectedItemId: string | null;
  onUpdateItem: (id: string, updates: Partial<CanvasItem>) => void;
  onSelectItem: (id: string) => void;
  onMouseDownItem: (e: React.MouseEvent, id: string) => void;
  renderResizeHandle: (item: CanvasItem) => React.ReactNode;
  renderItemControls: (item: CanvasItem) => React.ReactNode;
  width?: number;
  height?: number;
  useKonva?: boolean; // Toggle between Konva and DOM rendering
}

export const CanvasRenderer: React.FC<CanvasRendererProps> = ({
  items,
  selectedItemId,
  onUpdateItem,
  onSelectItem,
  onMouseDownItem,
  renderResizeHandle,
  renderItemControls,
  width = 800,
  height = 600,
  useKonva = true, // Use Konva by default
}) => {
  const renderCanvasItem = (item: CanvasItem) => {
    const isSelected = selectedItemId === item.id;
    const resizeHandle = renderResizeHandle(item);
    const itemControls = renderItemControls(item);

    const commonProps = {
      item,
      isSelected,
      onUpdate: onUpdateItem,
      onSelect: onSelectItem,
      onMouseDown: onMouseDownItem,
      resizeHandle,
      itemSpecificControls: itemControls,
    };

    switch (item.type) {
      case "textElement":
      case "stickyNote":
      case "commentElement":
        return <TextElement key={item.id} {...commonProps} />;

      case "codeBlock":
        return <CodeElement key={item.id} {...commonProps} />;

      case "connectorElement":
        // Use enhanced mind map connector for mind map connections
        if (item.startNodeId && item.endNodeId) {
          const startNode = items.find(n => n.id === item.startNodeId);
          const endNode = items.find(n => n.id === item.endNodeId);

          if (startNode?.type === "mindMapNode" && endNode?.type === "mindMapNode") {
            return (
              <MindMapConnectorElement
                key={item.id}
                {...commonProps}
                allItems={items}
              />
            );
          }
        }
        return <ConnectorElement key={item.id} {...commonProps} />;

      case "chart":
        return <ChartElement key={item.id} {...commonProps} />;

      // For other types, fall back to basic rendering
      default:
        return renderBasicCanvasItem(
          item,
          isSelected,
          resizeHandle,
          itemControls,
        );
    }
  };

  const renderBasicCanvasItem = (
    item: CanvasItem,
    isSelected: boolean,
    resizeHandle: React.ReactNode,
    itemControls: React.ReactNode,
  ) => {
    const baseStyle: React.CSSProperties = {
      position: "absolute",
      left: `${item.x}px`,
      top: `${item.y}px`,
      width: `${item.width || 200}px`,
      height: `${item.height || 100}px`,
      zIndex: item.zIndex,
      backgroundColor: item.backgroundColor || "#3B82F6",
      color: item.textColor || "#FFFFFF",
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
    };

    // Handle different item types with basic rendering
    let content = item.content || "Canvas Item";

    if (item.type === "historyItem") {
      content = item.content || "History Item";
    } else if (item.type === "shapeElement") {
      content = ""; // Shapes don't need text content
      if (item.shapeVariant === "circle") {
        baseStyle.borderRadius = "50%";
      }
    } else if (item.type === "frameElement") {
      content = item.content || "Frame";
      baseStyle.border = `2px dashed ${item.borderColor || "#9CA3AF"}`;
      baseStyle.backgroundColor = "transparent";
    } else if (item.type === "imageElement") {
      content = "🖼️ Image";
    } else if (item.type === "mindMapNode") {
      const nodeType = item.mindMapNodeType || "main";

      // Enhanced auto-sizing based on content length
      const textLength = (item.content || "").length;
      const autoWidth = Math.max(
        nodeType === "central" ? 300 : nodeType === "primary" ? 200 : 150,
        Math.min(
          nodeType === "central" ? 500 : nodeType === "primary" ? 350 : 250,
          textLength * (nodeType === "central" ? 12 : nodeType === "primary" ? 10 : 8) + 60
        )
      );
      const autoHeight = nodeType === "central" ? 120 : nodeType === "primary" ? 100 : 80;

      // Update item dimensions if not manually set
      if (!item.width || item.width < autoWidth) {
        baseStyle.width = `${autoWidth}px`;
      }
      if (!item.height || item.height < autoHeight) {
        baseStyle.height = `${autoHeight}px`;
      }

      // Enhanced shape styling
      baseStyle.borderRadius =
        item.mindMapShape === "circle" || item.mindMapShape === "ellipse"
          ? "50%"
          : item.mindMapShape === "rectangle"
            ? "8px"
            : "20px";

      // Dynamic font sizing based on content and node type
      const baseFontSize = nodeType === "central" ? 20 : nodeType === "primary" ? 16 : 14;
      const adjustedFontSize = Math.max(
        nodeType === "central" ? 16 : nodeType === "primary" ? 14 : 12,
        Math.min(baseFontSize, 300 / Math.max(textLength, 8))
      );

      baseStyle.fontWeight =
        nodeType === "central"
          ? "700"
          : nodeType === "primary"
            ? "600"
            : "500";
      baseStyle.fontSize = `${adjustedFontSize}px`;
      baseStyle.lineHeight = "1.3";
      baseStyle.wordWrap = "break-word";
      baseStyle.overflow = "hidden";
      baseStyle.textOverflow = "ellipsis";

      // Enhanced shadow and visual hierarchy
      const shadowIntensity = nodeType === "central" ? "0 8px 25px rgba(0, 0, 0, 0.15)" :
                             nodeType === "primary" ? "0 6px 15px rgba(0, 0, 0, 0.1)" :
                             "0 4px 10px rgba(0, 0, 0, 0.08)";

      if (!isSelected) {
        baseStyle.boxShadow = shadowIntensity;
      }

      // Better padding for text content
      baseStyle.padding = nodeType === "central" ? "16px 20px" :
                         nodeType === "primary" ? "12px 16px" : "8px 12px";
    } else if (item.type === "flowchartBox") {
      content = item.content || "Process";
    } else if (item.type === "kanbanCard") {
      const priority = item.kanbanPriority || "medium";
      const priorityColors = {
        low: "#10B981",
        medium: "#F59E0B",
        high: "#EF4444",
        critical: "#7F1D1D",
      };
      baseStyle.borderLeftColor =
        priorityColors[priority as keyof typeof priorityColors];
      baseStyle.borderLeftWidth = "4px";
      content = item.content || "Task";
    } else if (item.type === "tableElement") {
      content = "📊 Table";
    } else if (item.type === "embedElement") {
      content = "🔗 Embed";
      baseStyle.border = `2px dashed ${item.borderColor || "#9CA3AF"}`;
    }

    return (
      <div
        key={item.id}
        style={baseStyle}
        onMouseDown={(e) => onMouseDownItem(e, item.id)}
        onClick={() => onSelectItem(item.id)}
        title={item.type === "mindMapNode" ? item.content : undefined} // Tooltip for long content
      >
        {item.type === "mindMapNode" ? (
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center" as const,
            width: "100%",
            height: "100%",
            flexDirection: "column",
            gap: "4px"
          }}>
            {item.mindMapIcon && (
              <div style={{
                fontSize: `${Math.max(16, parseInt(baseStyle.fontSize as string) * 1.2)}px`,
                opacity: 0.8,
                lineHeight: 1
              }}>
                {item.mindMapIcon}
              </div>
            )}
            <div style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              wordBreak: "break-word",
              hyphens: "auto"
            }}>
              {content}
            </div>
          </div>
        ) : (
          content
        )}
        {itemControls}
        {resizeHandle}
      </div>
    );
  };

  // Use Konva renderer for high-performance rendering
  if (useKonva) {
    return (
      <div id="konva-canvas-container" style={{ width: '100%', height: '100%' }}>
        <ComprehensiveKonvaRenderer
          items={items}
          selectedItemId={selectedItemId}
          onUpdateItem={onUpdateItem}
          onSelectItem={onSelectItem}
          onMouseDownItem={onMouseDownItem}
          width={width}
          height={height}
        />
      </div>
    );
  }

  // Fallback to DOM-based rendering for specialized components
  return (
    <div id="canvas-container" style={{ position: 'relative', width: '100%', height: '100%' }}>
      {items.map(renderCanvasItem)}
    </div>
  );
};

export default CanvasRenderer;
