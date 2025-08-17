import React, { useRef, useEffect, useState, memo, useCallback } from "react";
import {
  CanvasItem,
  CanvasItemType,
  ShapeVariant,
  LineStyle,
  FontFamily,
  FontWeight,
  FontStyle,
  TextDecoration,
} from "../../types";

import {
  CANVAS_SHAPE_VARIANTS,
  CANVAS_FONT_FAMILIES,
  CANVAS_PRESET_COLORS,
} from "../../constants";

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
} from "../IconComponents";

import LoadingSpinner from "../../components/LoadingSpinner";

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

const ColorSwatch: React.FC<ColorSwatchProps> = ({
  color,
  selectedColor,
  onClick,
}) => (
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
);

interface CanvasSectionProps {
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
}

export const CanvasSection: React.FC<CanvasSectionProps> = ({
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
}) => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showShapeDropdown, setShowShapeDropdown] = useState(false);
  const shapeDropdownRef = useRef<HTMLDivElement>(null);

  // Handle adding new canvas items
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

  // Handle canvas item selection
  const handleCanvasItemClick = useCallback(
    (itemId: string, event: React.MouseEvent) => {
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
    },
    [selectedCanvasItems, setSelectedCanvasItems],
  );

  // Handle canvas background click (deselect all)
  const handleCanvasClick = useCallback(
    (event: React.MouseEvent) => {
      if (event.target === event.currentTarget) {
        setSelectedCanvasItems(new Set());
      }
    },
    [setSelectedCanvasItems],
  );

  // Get selected item for property editing
  const selectedItem = useMemo(() => {
    if (selectedCanvasItems.size === 1) {
      const itemId = Array.from(selectedCanvasItems)[0];
      return canvasItems.find((item) => item.id === itemId);
    }
    return null;
  }, [selectedCanvasItems, canvasItems]);

  // Update canvas item properties
  const updateProp = useCallback(
    (prop: string, value: any) => {
      if (selectedItem) {
        updateCanvasItem(selectedItem.id, { [prop]: value });
      }
    },
    [selectedItem, updateCanvasItem],
  );

  // Delete selected items
  const deleteSelected = useCallback(() => {
    selectedCanvasItems.forEach((itemId) => deleteCanvasItem(itemId));
    setSelectedCanvasItems(new Set());
  }, [selectedCanvasItems, deleteCanvasItem, setSelectedCanvasItems]);

  // Clear canvas
  const clearCanvas = useCallback(() => {
    setCanvasItems([]);
    setSelectedCanvasItems(new Set());
  }, [setCanvasItems, setSelectedCanvasItems]);

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
                Creative Canvas
              </h2>
              <p className="text-slate-300 text-lg">
                Design and layout your content visually
              </p>
            </div>
          </div>

          {/* Canvas Actions */}
          <div className="flex items-center space-x-3">
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
              <span>Delete Selected</span>
            </button>
          )}
        </div>

        {/* Property Panel for Selected Item */}
        {selectedItem && (
          <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30">
            <h3 className="text-sm font-medium text-slate-300 mb-3">
              Properties: {selectedItem.type}
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

      {/* Canvas Area */}
      <div className="flex-grow bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 overflow-hidden shadow-2xl">
        <div
          ref={canvasContainerRef}
          className="relative w-full h-full bg-white overflow-hidden cursor-grab active:cursor-grabbing"
          onClick={handleCanvasClick}
          style={{
            transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${zoomLevel})`,
            transformOrigin: "0 0",
          }}
        >
          {/* Konva Canvas Container */}
          <div id="konva-canvas-container">
            {/* Canvas will be upgraded to Konva.js Stage and Layer */}
          </div>

          {/* Canvas Grid (optional) */}
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
};

export default CanvasSection;
