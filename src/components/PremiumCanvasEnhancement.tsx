import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import {
  AdjustmentsHorizontalIcon as Settings,
  SwatchIcon as Palette,
  PaintBrushIcon as Paintbrush,
  CursorArrowRaysIcon as MousePointer,
  BoldIcon as Bold,
  ItalicIcon as Italic,
  UnderlineIcon as Underline,
  PlusCircleIcon as Plus,
  MinusCircleIcon as Minus,
  ClipboardIcon as Copy,
  SparklesIcon as Sparkles,
  StarShapeIcon as Star,
  RightArrowIcon as ArrowRight,
  EyeIcon as Eye,
  EyeSlashIcon as EyeOff,
  PlayCircleIcon as Play,
  ChevronDownIcon as ChevronDown,
  RectangleIcon as Square,
  CircleIcon as Circle,
  TriangleIcon as Triangle,
  TypeToolIcon as Type,
  StickyNoteIcon,
  PhotoIcon as ImagePlus,
  FrameIcon as Frame,
  MessageSquareIcon as MessageSquare,
  TableIcon as Layers,
  RefreshIcon as RotateCw,
} from "./IconComponents";
import { CanvasItem, CanvasItemType, ShapeVariant } from "../../types";

// Create simple icon components for missing icons
const Move: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <span style={{ fontSize: `${size}px` }}>↔️</span>
);

interface PremiumCanvasEnhancementProps {
  canvasItems: CanvasItem[];
  selectedCanvasItemId: string | null;
  setSelectedCanvasItemId: React.Dispatch<React.SetStateAction<string | null>>;
  onUpdateCanvasItem: (id: string, updates: Partial<CanvasItem>) => void;
  onAddCanvasItem: (type: CanvasItemType, props?: Partial<CanvasItem>) => void;
  onDeleteCanvasItem: (id: string) => void;
  zoomLevel: number;
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
  canvasOffset: { x: number; y: number };
  setCanvasOffset: React.Dispatch<
    React.SetStateAction<{ x: number; y: number }>
  >;
}

interface PremiumCanvasTool {
  id: string;
  name: string;
  icon: React.ComponentType<{ size?: number }>;
  cursor: string;
  category: "select" | "draw" | "shape" | "text" | "media";
  shortcut?: string;
}

const PremiumCanvasEnhancement: React.FC<PremiumCanvasEnhancementProps> = ({
  canvasItems,
  selectedCanvasItemId,
  setSelectedCanvasItemId,
  onUpdateCanvasItem,
  onAddCanvasItem,
  onDeleteCanvasItem,
  zoomLevel,
  setZoomLevel,
  canvasOffset,
  setCanvasOffset,
}) => {
  // Enhanced State
  const [currentTool, setCurrentTool] = useState("select");
  const [showLayers, setShowLayers] = useState(false);
  const [showProperties, setShowProperties] = useState(false);
  const [showAdvancedTools, setShowAdvancedTools] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showStylePresets, setShowStylePresets] = useState(false);
  const [currentColor, setCurrentColor] = useState("#3b82f6");
  const [showColorPicker, setShowColorPicker] = useState(false);

  const colorPickerRef = useRef<HTMLDivElement>(null);

  // Premium Tools Configuration
  const premiumTools: PremiumCanvasTool[] = useMemo(
    () => [
      {
        id: "select",
        name: "Select",
        icon: MousePointer,
        cursor: "default",
        category: "select",
        shortcut: "V",
      },
      {
        id: "move",
        name: "Move",
        icon: Move,
        cursor: "move",
        category: "select",
        shortcut: "M",
      },
      {
        id: "brush",
        name: "Brush",
        icon: Paintbrush,
        cursor: "crosshair",
        category: "draw",
        shortcut: "B",
      },
      {
        id: "text",
        name: "Text",
        icon: Type,
        cursor: "text",
        category: "text",
        shortcut: "T",
      },
      {
        id: "rectangle",
        name: "Rectangle",
        icon: Square,
        cursor: "crosshair",
        category: "shape",
        shortcut: "R",
      },
      {
        id: "circle",
        name: "Circle",
        icon: Circle,
        cursor: "crosshair",
        category: "shape",
        shortcut: "C",
      },
    ],
    [],
  );

  // Theme Configuration
  const currentTheme = {
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    textColor: "#f1f5f9",
    panelBg: "#1e293b",
    borderColor: "#334155",
  };

  // Tool Functions
  const handleSelectTool = useCallback(() => {
    setCurrentTool("select");
    console.log("🔹 Select tool activated");
  }, []);

  const handleAddTextElement = useCallback(() => {
    onAddCanvasItem("textElement", {
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200,
      width: 200,
      height: 50,
      content: "New Text",
      fontSize: "16px",
      textColor: "#ffffff",
      backgroundColor: "#3b82f6",
    });
    console.log("📝 Text element added");
  }, [onAddCanvasItem]);

  const handleAddShape = useCallback(
    (shapeVariant: ShapeVariant) => {
      onAddCanvasItem("shapeElement", {
        x: 150 + Math.random() * 200,
        y: 150 + Math.random() * 200,
        width: 100,
        height: 100,
        shapeVariant,
        backgroundColor: "#3b82f6",
        borderColor: "#2563eb",
        borderWidth: "2px",
      });
      console.log(`🔷 ${shapeVariant} shape added`);
    },
    [onAddCanvasItem],
  );

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.target as HTMLElement).tagName === "INPUT" ||
        (e.target as HTMLElement).tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "d":
            e.preventDefault();
            if (selectedIds.length > 0) {
              const itemsToDuplicate = canvasItems.filter((item) =>
                selectedIds.includes(item.id),
              );
              itemsToDuplicate.forEach((item) => {
                const newItem = {
                  ...item,
                  id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                  x: item.x + 20,
                  y: item.y + 20,
                };
                onAddCanvasItem(item.type, {
                  x: item.x + 20,
                  y: item.y + 20,
                  width: item.width,
                  height: item.height,
                  backgroundColor: item.backgroundColor,
                  textColor: item.textColor,
                  text: item.text,
                  fontSize: item.fontSize,
                  borderRadius: item.borderRadius,
                  borderWidth: item.borderWidth,
                  borderColor: item.borderColor,
                });
              });
              console.log(
                `Duplicated ${itemsToDuplicate.length} item${itemsToDuplicate.length > 1 ? "s" : ""}`,
              );
            } else {
              console.log("No items selected for duplication");
            }
            break;
          case "a":
            e.preventDefault();
            setSelectedIds(canvasItems.map((item) => item.id));
            break;
        }
      } else if (e.altKey) {
        switch (e.key.toLowerCase()) {
          case "a":
            e.preventDefault();
            setShowAIAssistant(!showAIAssistant);
            break;
          case "s":
            e.preventDefault();
            setShowStylePresets(!showStylePresets);
            break;
        }
      } else {
        switch (e.key.toLowerCase()) {
          case "v":
            e.preventDefault();
            setCurrentTool("select");
            setSelectedIds([]);
            break;
          case "t":
            e.preventDefault();
            setCurrentTool("text");
            onAddCanvasItem("text", {
              x: 300,
              y: 200,
              width: 200,
              height: 50,
              text: "Text",
              fontSize: "16px",
              textColor: "#000000",
              backgroundColor: "transparent",
            });
            break;
          case "r":
            e.preventDefault();
            setCurrentTool("rectangle");
            onAddCanvasItem("shape", {
              x: 300,
              y: 200,
              width: 120,
              height: 80,
              backgroundColor: currentColor,
              borderRadius: "8px",
            });
            break;
          // Removed Ctrl+C shortcut
          // case "c":
          //   e.preventDefault();
          //   setCurrentTool("circle");
          //   onAddCanvasItem("shape", {
          //     x: 300,
          //     y: 200,
          //     width: 100,
          //     height: 100,
          //     backgroundColor: currentColor,
          //     borderRadius: "50%",
          //   });
          //   break;
          case "l":
            e.preventDefault();
            setCurrentTool("line");
            onAddCanvasItem("connector", {
              x: 300,
              y: 200,
              width: 100,
              height: 2,
              backgroundColor: currentColor,
            });
            break;
          case "escape":
            e.preventDefault();
            setSelectedIds([]);
            setCurrentTool("select");
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    selectedIds,
    canvasItems,
    showAIAssistant,
    showStylePresets,
    handleSelectTool,
    handleAddTextElement,
    handleAddShape,
  ]);

  // If not showing any enhancements, return null
  if (!showLayers && !showProperties && !showAdvancedTools) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: "none",
        zIndex: 1000,
      }}
    >
      {/* Advanced Tools Panel */}
      {showAdvancedTools && (
        <div
          style={{
            position: "absolute",
            top: "16px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 16px",
            backgroundColor: currentTheme.panelBg,
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            border: `1px solid ${currentTheme.borderColor}`,
            backdropFilter: "blur(20px)",
            pointerEvents: "auto",
            color: currentTheme.textColor,
            fontSize: "12px",
          }}
        >
          {/* Premium Tools */}
          <div style={{ display: "flex", gap: "4px" }}>
            {premiumTools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => {
                  setCurrentTool(tool.id);

                  switch (tool.id) {
                    case "select":
                      handleSelectTool();
                      break;
                    case "text":
                      handleAddTextElement();
                      break;
                    case "rectangle":
                      handleAddShape("rectangle" as ShapeVariant);
                      break;
                    case "circle":
                      handleAddShape("circle" as ShapeVariant);
                      break;
                    default:
                      console.log(`🔧 ${tool.name} tool activated`);
                  }
                }}
                style={{
                  padding: "8px",
                  backgroundColor:
                    currentTool === tool.id ? "#3b82f6" : "transparent",
                  color: currentTool === tool.id ? "#ffffff" : "inherit",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                }}
                title={`${tool.name} (${tool.shortcut})`}
              >
                <tool.icon size={16} />
              </button>
            ))}
          </div>

          <div
            style={{
              width: "1px",
              height: "24px",
              backgroundColor: "currentColor",
              opacity: 0.2,
            }}
          />

          {/* Panel Controls */}
          <div style={{ display: "flex", gap: "4px" }}>
            <button
              onClick={() => setShowAIAssistant(!showAIAssistant)}
              style={{
                padding: "8px",
                backgroundColor: showAIAssistant ? "#3b82f6" : "transparent",
                color: showAIAssistant ? "#ffffff" : "inherit",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
              title="AI Assistant (Alt+A)"
            >
              <Sparkles size={16} />
            </button>
            <button
              onClick={() => setShowStylePresets(!showStylePresets)}
              style={{
                padding: "8px",
                backgroundColor: showStylePresets ? "#8b5cf6" : "transparent",
                color: showStylePresets ? "#ffffff" : "inherit",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
              title="Style Presets (Alt+S)"
            >
              <Palette size={16} />
            </button>
          </div>

          <div
            style={{
              width: "1px",
              height: "24px",
              backgroundColor: "currentColor",
              opacity: 0.2,
            }}
          />

          {/* Close Button */}
          <button
            onClick={() => setShowAdvancedTools(false)}
            style={{
              padding: "6px",
              backgroundColor: "transparent",
              border: "1px solid currentColor",
              borderRadius: "4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
              color: "inherit",
              opacity: 0.8,
            }}
            title="Close Tools"
          >
            ✕
          </button>

          {/* Selection Info */}
          <span style={{ fontSize: "11px", opacity: 0.7, marginLeft: "8px" }}>
            {selectedIds.length > 0
              ? `${selectedIds.length} selected`
              : `${currentTool.toUpperCase()}`}
          </span>
        </div>
      )}

      {/* AI Assistant Panel */}
      {showAIAssistant && (
        <div
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            width: "320px",
            backgroundColor: currentTheme.panelBg,
            border: `1px solid ${currentTheme.borderColor}`,
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            backdropFilter: "blur(20px)",
            pointerEvents: "auto",
            color: currentTheme.textColor,
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "16px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "14px",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Sparkles size={16} style={{ color: "#3b82f6" }} />
                AI Assistant
              </h3>
              <button
                onClick={() => setShowAIAssistant(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "inherit",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                ✕
              </button>
            </div>

            <p
              style={{
                fontSize: "12px",
                color: "#94a3b8",
                margin: "0 0 16px 0",
              }}
            >
              Use keyboard shortcuts to quickly access tools and features:
            </p>

            <div style={{ fontSize: "11px", lineHeight: "1.6" }}>
              <div style={{ marginBottom: "12px", fontWeight: 600 }}>
                🛠️ Tools
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "4px",
                  marginBottom: "12px",
                }}
              >
                <div>
                  <strong>V</strong> Select
                </div>
                <div>
                  <strong>T</strong> Text
                </div>
                <div>
                  <strong>R</strong> Rectangle
                </div>
                <div>
                  <strong>C</strong> Circle
                </div>
              </div>

              <div style={{ marginBottom: "12px", fontWeight: 600 }}>
                ⌨️ Commands
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "4px",
                  marginBottom: "12px",
                }}
              >
                <div>
                  <strong>Ctrl+D</strong> Duplicate
                </div>
                <div>
                  <strong>Ctrl+A</strong> Select All
                </div>
                <div>
                  <strong>Esc</strong> Deselect
                </div>
                <div>
                  <strong>Alt+A</strong> AI Panel
                </div>
              </div>

              <div
                style={{
                  marginTop: "12px",
                  padding: "8px",
                  backgroundColor: `${currentTheme.borderColor}30`,
                  borderRadius: "4px",
                  fontSize: "10px",
                }}
              >
                💡 Active Tool: <strong>{currentTool.toUpperCase()}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Style Presets Panel */}
      {showStylePresets && (
        <div
          style={{
            position: "absolute",
            bottom: "80px",
            left: "16px",
            width: "280px",
            backgroundColor: currentTheme.panelBg,
            border: `1px solid ${currentTheme.borderColor}`,
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            backdropFilter: "blur(20px)",
            pointerEvents: "auto",
            color: currentTheme.textColor,
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "16px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 600 }}>
                Style Presets
              </h3>
              <button
                onClick={() => setShowStylePresets(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "inherit",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                ✕
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px",
              }}
            >
              {[
                {
                  name: "modern",
                  label: "Modern",
                  color: "#3b82f6",
                  emoji: "✨",
                },
                {
                  name: "elegant",
                  label: "Elegant",
                  color: "#1f2937",
                  emoji: "🎭",
                },
                {
                  name: "vibrant",
                  label: "Vibrant",
                  color: "#ec4899",
                  emoji: "🌈",
                },
                {
                  name: "minimal",
                  label: "Minimal",
                  color: "#ffffff",
                  emoji: "⚪",
                },
              ].map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => {
                    console.log(`Applied ${preset.name} style preset`);
                    selectedIds.forEach((id) => {
                      onUpdateCanvasItem(id, { backgroundColor: preset.color });
                    });
                  }}
                  style={{
                    padding: "12px",
                    backgroundColor: currentTheme.borderColor,
                    color: currentTheme.textColor,
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: 600,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "4px",
                    transition: "all 0.2s",
                  }}
                >
                  <span style={{ fontSize: "16px" }}>{preset.emoji}</span>
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PremiumCanvasEnhancement;
