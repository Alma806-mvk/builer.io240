import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
  memo
} from "react";
import { Stage, Layer } from 'react-konva';
import {
  CanvasItem,
  CanvasItemType,
  ShapeVariant,
  LineStyle,
  FontFamily,
  FontWeight,
  FontStyle,
  TextDecoration,
} from "../types";

import {
  CANVAS_SHAPE_VARIANTS,
  CANVAS_FONT_FAMILIES,
  CANVAS_PRESET_COLORS,
} from "../constants";

import {
  ColumnsIcon,
  PlusCircleIcon,
  SaveIcon,
  RotateCcwIcon,
  RefreshCwIcon,
  TrashIcon,
  DownloadIcon,
  TypeToolIcon,
  ShapesIcon,
  PhotoIcon,
  StickyNoteIcon,
  PenToolIcon,
  FrameIcon,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
} from "./IconComponents";

import LoadingSpinner from "./LoadingSpinner";
import EnhancedCanvasRenderer from "./canvas/EnhancedCanvasRenderer";
import { useThrottledEvents, useCanvasItemMap } from "../hooks/useCanvasOptimization";
import { canvasWorkerService } from "../services/canvasWorkerService";

const MIN_CANVAS_ITEM_WIDTH = 50;
const MIN_CANVAS_ITEM_HEIGHT = 30;
const MIN_CANVAS_IMAGE_SIZE = 50;
const DEFAULT_SHAPE_FILL_COLOR = "#3B82F6";
const DEFAULT_SHAPE_BORDER_COLOR = "#60A5FA";
const DEFAULT_TEXT_ELEMENT_COLOR = "#E0E7FF";
const DEFAULT_FONT_FAMILY: FontFamily = "Georgia";
const DEFAULT_FONT_SIZE = "16px";

interface ColorSwatchProps {
  color: string;
  selectedColor?: string;
  onClick: (color: string) => void;
}

const ColorSwatch = memo<ColorSwatchProps>(({ color, selectedColor, onClick }) => (
  <button
    type="button"
    onClick={() => onClick(color)}
    className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 ${
      selectedColor === color
        ? "border-white shadow-lg scale-110"
        : "border-slate-600 hover:border-slate-400"
    }`}
    style={{ backgroundColor: color }}
    title={color}
    aria-label={`Select color ${color}`}
  />
));

ColorSwatch.displayName = 'ColorSwatch';

interface OptimizedCanvasSectionProps {
  // Canvas state
  canvasItems: CanvasItem[];
  selectedCanvasItems: Set<string>;
  canvasOffset: { x: number; y: number };
  zoomLevel: number;
  nextZIndex: number;

  // Canvas actions
  setCanvasItems: (items: CanvasItem[]) => void;
  addCanvasItem: (item: CanvasItem) => void;
  updateCanvasItem: (id: string, updates: Partial<CanvasItem>) => void;
  deleteCanvasItem: (id: string) => void;
  setSelectedCanvasItems: (items: Set<string>) => void;
  saveCanvasHistory: () => void;
  undoCanvas: () => void;
  redoCanvas: () => void;

  // UI state
  showImageModal: boolean;
  modalImageSrc: string | null;
  setShowImageModal: (show: boolean) => void;
  setModalImageSrc: (src: string | null) => void;

  // History state
  canvasHistoryIndex: number;
  canvasHistory: any[];

  // Performance options
  enableDebugMode?: boolean;
  enableWebWorkers?: boolean;

  // Animation options
  isNewMindMapCreated?: boolean;
}

export const OptimizedCanvasSection = memo<OptimizedCanvasSectionProps>(({
  // Canvas state
  canvasItems,
  selectedCanvasItems,
  canvasOffset,
  zoomLevel,
  nextZIndex,

  // Canvas actions
  setCanvasItems,
  addCanvasItem,
  updateCanvasItem,
  deleteCanvasItem,
  setSelectedCanvasItems,
  saveCanvasHistory,
  undoCanvas,
  redoCanvas,

  // UI state
  showImageModal,
  modalImageSrc,
  setShowImageModal,
  setModalImageSrc,

  // History state
  canvasHistoryIndex,
  canvasHistory,

  // Performance options
  enableDebugMode = false,
  enableWebWorkers = true,

  // Animation options
  isNewMindMapCreated = false,
}) => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showShapeDropdown, setShowShapeDropdown] = useState(false);
  const [containerDimensions, setContainerDimensions] = useState({ width: 800, height: 600 });
  const shapeDropdownRef = useRef<HTMLDivElement>(null);

  // Performance hooks
  const { throttle, cleanup } = useThrottledEvents();
  const { getItem, getItems } = useCanvasItemMap(canvasItems);

  // Cleanup throttled events on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  // Monitor container size for virtualization
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    const updateDimensions = () => {
      const rect = container.getBoundingClientRect();
      setContainerDimensions({ width: rect.width, height: rect.height });
    };

    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(container);
    updateDimensions(); // Initial size

    return () => resizeObserver.disconnect();
  }, []);

  // Optimized add canvas item handler
  const handleAddCanvasItem = useCallback(
    (itemType: CanvasItemType) => {
      const baseItem = {
        id: `${itemType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: itemType,
        x: 100 + Math.random() * 200,
        y: 100 + Math.random() * 200,
        width: itemType === "textElement" ? 200 : 150,
        height: itemType === "textElement" ? 50 : 100,
        zIndex: nextZIndex,
      };

      let newItem: CanvasItem;

      switch (itemType) {
        case "textElement":
          newItem = {
            ...baseItem,
            content: "New Text",
            color: DEFAULT_TEXT_ELEMENT_COLOR,
            fontFamily: DEFAULT_FONT_FAMILY,
            fontSize: DEFAULT_FONT_SIZE,
            fontWeight: "normal" as FontWeight,
            fontStyle: "normal" as FontStyle,
            textDecoration: "none" as TextDecoration,
          };
          break;

        case "shapeElement":
          newItem = {
            ...baseItem,
            shapeVariant: "rectangle" as ShapeVariant,
            backgroundColor: DEFAULT_SHAPE_FILL_COLOR,
            borderColor: DEFAULT_SHAPE_BORDER_COLOR,
            borderWidth: "2px",
            borderStyle: "solid" as LineStyle,
          };
          break;

        case "stickyNote":
          newItem = {
            ...baseItem,
            content: "Sticky note text",
            backgroundColor: "#FEF3C7",
            color: "#78350F",
            fontFamily: "Arial" as FontFamily,
            fontSize: "14px",
          };
          break;

        case "frameElement":
          newItem = {
            ...baseItem,
            backgroundColor: "transparent",
            borderColor: DEFAULT_SHAPE_BORDER_COLOR,
            borderWidth: "2px",
            borderStyle: "solid" as LineStyle,
            width: 200,
            height: 150,
          };
          break;

        default:
          newItem = baseItem as CanvasItem;
      }

      addCanvasItem(newItem);
      setShowShapeDropdown(false);
    },
    [nextZIndex, addCanvasItem],
  );

  // Throttled canvas item selection handler
  const handleCanvasItemClick = useCallback(
    throttle((itemId: string, event: React.MouseEvent) => {
      event.stopPropagation();

      if (event.ctrlKey || event.metaKey) {
        // Multi-select
        const newSelected = new Set(selectedCanvasItems);
        if (newSelected.has(itemId)) {
          newSelected.delete(itemId);
        } else {
          newSelected.add(itemId);
        }
        setSelectedCanvasItems(newSelected);
      } else {
        // Single select
        setSelectedCanvasItems(new Set([itemId]));
      }
    }, 16),
    [selectedCanvasItems, setSelectedCanvasItems, throttle],
  );

  // Optimized canvas background click
  const handleCanvasClick = useCallback(
    (event: React.MouseEvent) => {
      if (event.target === event.currentTarget) {
        setSelectedCanvasItems(new Set());
      }
    },
    [setSelectedCanvasItems],
  );

  // Memoized selected item
  const selectedItem = useMemo(() => {
    if (selectedCanvasItems.size === 1) {
      const itemId = Array.from(selectedCanvasItems)[0];
      return getItem(itemId);
    }
    return null;
  }, [selectedCanvasItems, getItem]);

  // Optimized property update
  const updateProp = useCallback(
    (prop: string, value: any) => {
      if (selectedItem) {
        updateCanvasItem(selectedItem.id, { [prop]: value });
      }
    },
    [selectedItem, updateCanvasItem],
  );

  // Batch delete selected items
  const deleteSelected = useCallback(() => {
    // Use batch operation for better performance
    const itemsToDelete = Array.from(selectedCanvasItems);
    itemsToDelete.forEach((itemId) => deleteCanvasItem(itemId));
    setSelectedCanvasItems(new Set());
    saveCanvasHistory(); // Save history after batch operation
  }, [selectedCanvasItems, deleteCanvasItem, setSelectedCanvasItems, saveCanvasHistory]);

  // Optimized clear canvas
  const clearCanvas = useCallback(() => {
    setCanvasItems([]);
    setSelectedCanvasItems(new Set());
    saveCanvasHistory();
  }, [setCanvasItems, setSelectedCanvasItems, saveCanvasHistory]);

  // AI Layout optimization using Web Worker
  const handleAILayout = useCallback(async () => {
    if (canvasItems.length === 0 || !enableWebWorkers) return;

    try {
      const layoutData = {
        items: canvasItems.map(item => ({
          id: item.id,
          x: item.x,
          y: item.y,
          width: item.width || 200,
          height: item.height || 100,
        })),
        connections: [], // Could be extracted from connector elements
        canvasWidth: containerDimensions.width,
        canvasHeight: containerDimensions.height,
        iterations: 50,
      };

      const optimizedPositions = await canvasWorkerService.calculateLayout(layoutData);
      
      // Apply optimized positions
      const updatedItems = canvasItems.map(item => {
        const newPos = optimizedPositions.find(pos => pos.id === item.id);
        return newPos ? { ...item, x: newPos.x, y: newPos.y } : item;
      });

      setCanvasItems(updatedItems);
      saveCanvasHistory();
    } catch (error) {
      console.warn('AI Layout optimization failed:', error);
    }
  }, [canvasItems, enableWebWorkers, containerDimensions, setCanvasItems, saveCanvasHistory]);

  // Memoized render functions for better performance
  const renderResizeHandle = useCallback((item: CanvasItem) => {
    if (!selectedCanvasItems.has(item.id)) return null;
    
    return (
      <div
        className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 border border-white cursor-se-resize"
        style={{ transform: 'translate(50%, 50%)' }}
      />
    );
  }, [selectedCanvasItems]);

  const renderItemControls = useCallback((item: CanvasItem) => {
    if (!selectedCanvasItems.has(item.id)) return null;
    
    return (
      <div className="absolute -top-8 left-0 bg-slate-800 text-white text-xs px-2 py-1 rounded">
        {item.type}
      </div>
    );
  }, [selectedCanvasItems]);

  // Throttled mouse down handler
  const handleMouseDownItem = useCallback(
    throttle((e: React.MouseEvent, itemId: string) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
      
      const item = getItem(itemId);
      if (item) {
        const rect = canvasContainerRef.current?.getBoundingClientRect();
        if (rect) {
          setDragOffset({
            x: e.clientX - rect.left - item.x * zoomLevel - canvasOffset.x,
            y: e.clientY - rect.top - item.y * zoomLevel - canvasOffset.y,
          });
        }
      }
      
      // Select item if not already selected
      if (!selectedCanvasItems.has(itemId)) {
        setSelectedCanvasItems(new Set([itemId]));
      }
    }, 16),
    [getItem, zoomLevel, canvasOffset, selectedCanvasItems, setSelectedCanvasItems, throttle],
  );

  return (
    <div className="flex-grow flex flex-col">
      {/* Canvas Header */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-6 shadow-2xl mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-lg">
              <ColumnsIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent">
                Optimized Canvas
              </h2>
              <p className="text-slate-300 text-lg">
                High-performance visual design workspace
              </p>
            </div>
          </div>

          {/* Canvas Actions */}
          <div className="flex items-center space-x-3">
            {enableWebWorkers && (
              <button
                onClick={handleAILayout}
                disabled={canvasItems.length === 0}
                className="p-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-white rounded-lg transition-colors"
                title="AI Layout Optimization"
              >
                🤖
              </button>
            )}
            <button
              onClick={undoCanvas}
              disabled={canvasHistoryIndex <= 0}
              className="p-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg transition-colors"
              title="Undo"
            >
              <RotateCcwIcon className="h-4 w-4" />
            </button>
            <button
              onClick={redoCanvas}
              disabled={canvasHistoryIndex >= canvasHistory.length - 1}
              className="p-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg transition-colors"
              title="Redo"
            >
              <RefreshCwIcon className="h-4 w-4" />
            </button>
            <button
              onClick={clearCanvas}
              className="p-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
              title="Clear Canvas"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Canvas Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <button
            onClick={() => handleAddCanvasItem("textElement")}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
          >
            <TypeToolIcon className="h-4 w-4" />
            <span>Text</span>
          </button>

          <div className="relative" ref={shapeDropdownRef}>
            <button
              id="shape-tool-button"
              onClick={() => setShowShapeDropdown(!showShapeDropdown)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors"
            >
              <ShapesIcon className="h-4 w-4" />
              <span>Shapes</span>
            </button>

            {showShapeDropdown && (
              <div className="absolute top-full left-0 mt-2 bg-slate-800 border border-slate-600 rounded-lg shadow-xl z-50 min-w-[200px]">
                <button
                  onClick={() => handleAddCanvasItem("shapeElement")}
                  className="w-full text-left px-4 py-2 hover:bg-slate-700 text-slate-200 transition-colors"
                >
                  Shape Element
                </button>
                <button
                  onClick={() => handleAddCanvasItem("frameElement")}
                  className="w-full text-left px-4 py-2 hover:bg-slate-700 text-slate-200 transition-colors"
                >
                  Frame
                </button>
                <button
                  onClick={() => handleAddCanvasItem("connectorElement")}
                  className="w-full text-left px-4 py-2 hover:bg-slate-700 text-slate-200 transition-colors"
                >
                  Connector
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => handleAddCanvasItem("stickyNote")}
            className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg transition-colors"
          >
            <StickyNoteIcon className="h-4 w-4" />
            <span>Sticky Note</span>
          </button>

          {selectedCanvasItems.size > 0 && (
            <button
              onClick={deleteSelected}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors ml-auto"
            >
              <TrashIcon className="h-4 w-4" />
              <span>Delete Selected ({selectedCanvasItems.size})</span>
            </button>
          )}
        </div>

        {/* Property Panel for Selected Item */}
        {selectedItem && (
          <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30">
            <h3 className="text-sm font-medium text-slate-300 mb-3">
              Properties: {selectedItem.type} (ID: {selectedItem.id.slice(-8)})
            </h3>

            <div className="flex flex-wrap items-center gap-3">
              {/* Common Properties */}
              <div className="flex items-center gap-1.5">
                <label className="text-slate-300 text-xs">X:</label>
                <input
                  type="number"
                  value={Math.round(selectedItem.x)}
                  onChange={(e) => updateProp("x", parseInt(e.target.value))}
                  className="w-16 p-1.5 bg-slate-700 rounded-md border border-slate-600 text-slate-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <label className="text-slate-300 text-xs">Y:</label>
                <input
                  type="number"
                  value={Math.round(selectedItem.y)}
                  onChange={(e) => updateProp("y", parseInt(e.target.value))}
                  className="w-16 p-1.5 bg-slate-700 rounded-md border border-slate-600 text-slate-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <label className="text-slate-300 text-xs">W:</label>
                <input
                  type="number"
                  value={Math.round(selectedItem.width)}
                  onChange={(e) =>
                    updateProp(
                      "width",
                      Math.max(MIN_CANVAS_ITEM_WIDTH, parseInt(e.target.value)),
                    )
                  }
                  className="w-16 p-1.5 bg-slate-700 rounded-md border border-slate-600 text-slate-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <label className="text-slate-300 text-xs">H:</label>
                <input
                  type="number"
                  value={Math.round(selectedItem.height)}
                  onChange={(e) =>
                    updateProp(
                      "height",
                      Math.max(
                        MIN_CANVAS_ITEM_HEIGHT,
                        parseInt(e.target.value),
                      ),
                    )
                  }
                  className="w-16 p-1.5 bg-slate-700 rounded-md border border-slate-600 text-slate-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                />
              </div>

              {/* Text Properties */}
              {(selectedItem.type === "textElement" ||
                selectedItem.type === "stickyNote") && (
                <>
                  <div className="flex items-center gap-1.5">
                    <label className="text-slate-300 text-xs">Text:</label>
                    <input
                      type="text"
                      value={selectedItem.content || ""}
                      onChange={(e) => updateProp("content", e.target.value)}
                      className="w-32 p-1.5 bg-slate-700 rounded-md border border-slate-600 text-slate-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                    />
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        updateProp(
                          "fontWeight",
                          selectedItem.fontWeight === "bold"
                            ? "normal"
                            : "bold",
                        )
                      }
                      className={`p-1 rounded-sm ${selectedItem.fontWeight === "bold" ? "bg-sky-600" : "hover:bg-slate-600"}`}
                      title="Bold"
                    >
                      <BoldIcon className="w-4 h-4 text-slate-200" />
                    </button>
                    <button
                      onClick={() =>
                        updateProp(
                          "fontStyle",
                          selectedItem.fontStyle === "italic"
                            ? "normal"
                            : "italic",
                        )
                      }
                      className={`p-1 rounded-sm ${selectedItem.fontStyle === "italic" ? "bg-sky-600" : "hover:bg-slate-600"}`}
                      title="Italic"
                    >
                      <ItalicIcon className="w-4 h-4 text-slate-200" />
                    </button>
                    <button
                      onClick={() =>
                        updateProp(
                          "textDecoration",
                          selectedItem.textDecoration === "underline"
                            ? "none"
                            : "underline",
                        )
                      }
                      className={`p-1 rounded-sm ${selectedItem.textDecoration === "underline" ? "bg-sky-600" : "hover:bg-slate-600"}`}
                      title="Underline"
                    >
                      <UnderlineIcon className="w-4 h-4 text-slate-200" />
                    </button>
                  </div>
                </>
              )}

              {/* Color Properties */}
              {selectedItem.backgroundColor && (
                <div className="flex items-center gap-1.5">
                  <label className="text-slate-300 mr-1">Fill:</label>
                  {CANVAS_PRESET_COLORS.slice(0, 8).map((color) => (
                    <ColorSwatch
                      key={`bg-${color}`}
                      color={color}
                      selectedColor={selectedItem.backgroundColor}
                      onClick={(c) => updateProp("backgroundColor", c)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Optimized Canvas Area */}
      <div className="flex-grow bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 overflow-hidden shadow-2xl">
        <div
          ref={canvasContainerRef}
          className="relative w-full h-full bg-white overflow-hidden cursor-grab active:cursor-grabbing"
          onClick={handleCanvasClick}
          style={{
            transform: `translate3d(${canvasOffset.x}px, ${canvasOffset.y}px, 0) scale(${zoomLevel})`,
            transformOrigin: "0 0",
          }}
        >
          {/* Konva Canvas Container - Ready for Stage and Layer upgrade */}
          <div id="konva-canvas-container">
            {/* Canvas will be upgraded to Konva.js Stage and Layer */}
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

      {/* Image Modal */}
      {showImageModal && modalImageSrc && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all z-10"
            >
              ✕
            </button>
            <img
              src={modalImageSrc}
              alt="Canvas item"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // Optimized comparison to prevent unnecessary re-renders
  return (
    prevProps.canvasItems === nextProps.canvasItems &&
    prevProps.selectedCanvasItems === nextProps.selectedCanvasItems &&
    prevProps.canvasOffset === nextProps.canvasOffset &&
    prevProps.zoomLevel === nextProps.zoomLevel &&
    prevProps.canvasHistoryIndex === nextProps.canvasHistoryIndex &&
    prevProps.enableDebugMode === nextProps.enableDebugMode &&
    prevProps.enableWebWorkers === nextProps.enableWebWorkers
  );
});

OptimizedCanvasSection.displayName = 'OptimizedCanvasSection';

export default OptimizedCanvasSection;
