import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Grid3X3,
  Move,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Save,
  Camera,
  Trash2,
  Type,
  Square,
  Circle,
  Triangle,
  StickyNote,
  Image,
  Code,
  Link,
  Table,
  BarChart3,
  Layers,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Copy,
  Clipboard,
  Undo,
  Redo,
  Download,
  Upload,
  Palette,
  Settings,
  Maximize,
  Minimize,
  Mouse,
  Hand,
  Pen,
  Eraser,
  Minus,
  Plus,
  MoreHorizontal,
  Sparkles,
  Wand2,
  Layers3,
  Group,
  Ungroup,
  AlignLeft,
  AlignCenter,
  AlignRight,
  GitBranch,
  Workflow,
} from "lucide-react";

// Import our world-class components
import {
  Button,
  Card,
  Badge,
  GradientText,
} from "./ui/WorldClassComponents";

// Import the high-performance canvas with advanced pan and zoom
import HighPerformanceCanvas from "./canvas/HighPerformanceCanvas";
import { CanvasItem } from "../types";

// Extend the imported CanvasItem interface for local use
interface ExtendedCanvasItem extends CanvasItem {
  locked?: boolean;
  visible?: boolean;
  groupId?: string;
}

interface CanvasGroup {
  id: string;
  name: string;
  itemIds: string[];
  visible: boolean;
  locked: boolean;
}

interface CanvasLayer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  opacity: number;
}

interface CanvasWorldClassProps {
  canvasItems: ExtendedCanvasItem[];
  selectedItems: string[];
  onItemSelect: (itemId: string, multiSelect?: boolean) => void;
  onItemsUpdate: (items: ExtendedCanvasItem[]) => void;
  onAddItem: (type: string, properties?: any) => void;
  updateCanvasItemProperty: (itemId: string, property: any) => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onSaveSnapshot: () => void;
  onScreenshot: () => void;
  onClearCanvas: () => void;
  history: any[];
  historyIndex: number;
  onUndo: () => void;
  onRedo: () => void;
}

const CanvasWorldClass: React.FC<CanvasWorldClassProps> = ({
  canvasItems,
  selectedItems,
  onItemSelect,
  onItemsUpdate,
  onAddItem,
  updateCanvasItemProperty,
  zoom,
  onZoomChange,
  onSaveSnapshot,
  onScreenshot,
  onClearCanvas,
  history,
  historyIndex,
  onUndo,
  onRedo,
}) => {
  // Debug canvas items
  React.useEffect(() => {
    console.log('🔍 CanvasWorldClass received items:', {
      itemCount: canvasItems.length,
      items: canvasItems.map(item => ({
        id: item.id,
        type: item.type,
        position: { x: item.x, y: item.y },
        size: { width: item.width, height: item.height }
      }))
    });
  }, [canvasItems]);
  const [activeTool, setActiveTool] = useState<'select' | 'pan' | 'draw' | 'text' | 'shape'>('select');
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [showLayers, setShowLayers] = useState(false);
  const [showProperties, setShowProperties] = useState(true);
  const [layers, setLayers] = useState<CanvasLayer[]>([
    { id: 'main', name: 'Main Layer', visible: true, locked: false, opacity: 1 }
  ]);
  const [groups, setGroups] = useState<CanvasGroup[]>([]);
  const [clipboard, setClipboard] = useState<ExtendedCanvasItem[]>([]);

  // Convert ExtendedCanvasItem to CanvasItem for HighPerformanceCanvas
  const highPerformanceCanvasItems = useMemo(() => {
    const converted = canvasItems.map(item => ({
      id: item.id,
      type: item.type as any,
      x: item.x,
      y: item.y,
      width: item.width || 150,
      height: item.height || 100,
      content: item.content,
      zIndex: item.zIndex || 1,
      backgroundColor: item.backgroundColor || '#DBEAFE',
      color: item.color || item.textColor || '#1E40AF',
      borderColor: item.borderColor || '#3B82F6',
      borderRadius: (item as any).borderRadius,
    }));

    console.log('🔄 CanvasWorldClass converted items for HighPerformanceCanvas:', {
      originalCount: canvasItems.length,
      convertedCount: converted.length,
      convertedItems: converted
    });

    return converted;
  }, [canvasItems]);

  // Selected item IDs as Set for HighPerformanceCanvas
  const selectedItemIds = useMemo(() => new Set(selectedItems), [selectedItems]);

  // Enhanced toolbar configuration
  const toolSections = [
    {
      title: "Selection",
      tools: [
        { id: 'select', icon: <Mouse className="w-4 h-4" />, label: 'Select', shortcut: 'V' },
        { id: 'pan', icon: <Hand className="w-4 h-4" />, label: 'Pan', shortcut: 'H' },
      ]
    },
    {
      title: "Content",
      tools: [
        { id: 'text', icon: <Type className="w-4 h-4" />, label: 'Text', shortcut: 'T' },
        { id: 'sticky', icon: <StickyNote className="w-4 h-4" />, label: 'Sticky Note', shortcut: 'N' },
        { id: 'image', icon: <Image className="w-4 h-4" />, label: 'Image', shortcut: 'I' },
        { id: 'code', icon: <Code className="w-4 h-4" />, label: 'Code Block', shortcut: 'C' },
      ]
    },
    {
      title: "Shapes",
      tools: [
        { id: 'rectangle', icon: <Square className="w-4 h-4" />, label: 'Rectangle', shortcut: 'R' },
        { id: 'circle', icon: <Circle className="w-4 h-4" />, label: 'Circle', shortcut: 'O' },
        { id: 'triangle', icon: <Triangle className="w-4 h-4" />, label: 'Triangle' },
      ]
    },
    {
      title: "Advanced",
      tools: [
        { id: 'connector', icon: <GitBranch className="w-4 h-4" />, label: 'Connector', shortcut: 'L' },
        { id: 'table', icon: <Table className="w-4 h-4" />, label: 'Table' },
        { id: 'chart', icon: <BarChart3 className="w-4 h-4" />, label: 'Chart' },
        { id: 'mindmap', icon: <Workflow className="w-4 h-4" />, label: 'Mind Map' },
      ]
    },
    {
      title: "Drawing",
      tools: [
        { id: 'pen', icon: <Pen className="w-4 h-4" />, label: 'Pen Tool', shortcut: 'P' },
        { id: 'brush', icon: <Pen className="w-4 h-4" />, label: 'Brush', shortcut: 'B' },
        { id: 'eraser', icon: <Eraser className="w-4 h-4" />, label: 'Eraser', shortcut: 'E' },
      ]
    }
  ];

  const actionButtons = [
    { id: 'undo', icon: <Undo className="w-4 h-4" />, label: 'Undo', onClick: onUndo, shortcut: 'Ctrl+Z', disabled: historyIndex <= 0 },
    { id: 'redo', icon: <Redo className="w-4 h-4" />, label: 'Redo', onClick: onRedo, shortcut: 'Ctrl+Y', disabled: historyIndex >= history.length - 1 },
    { id: 'copy', icon: <Copy className="w-4 h-4" />, label: 'Copy', onClick: handleCopy, shortcut: 'Ctrl+C', disabled: selectedItems.length === 0 },
    { id: 'paste', icon: <Clipboard className="w-4 h-4" />, label: 'Paste', onClick: handlePaste, shortcut: 'Ctrl+V', disabled: clipboard.length === 0 },
    { id: 'duplicate', icon: <Copy className="w-4 h-4" />, label: 'Duplicate', onClick: handleDuplicate, shortcut: 'Ctrl+D', disabled: selectedItems.length === 0 },
    { id: 'delete', icon: <Trash2 className="w-4 h-4" />, label: 'Delete', onClick: handleDelete, shortcut: 'Del', disabled: selectedItems.length === 0 },
    { id: 'group', icon: <Group className="w-4 h-4" />, label: 'Group', onClick: handleGroup, disabled: selectedItems.length < 2 },
    { id: 'ungroup', icon: <Ungroup className="w-4 h-4" />, label: 'Ungroup', onClick: handleUngroup },
  ];

  const alignmentButtons = [
    { id: 'align-left', icon: <AlignLeft className="w-4 h-4" />, label: 'Align Left', onClick: handleAlignLeft, disabled: selectedItems.length < 2 },
    { id: 'align-center', icon: <AlignCenter className="w-4 h-4" />, label: 'Align Center', onClick: handleAlignCenter, disabled: selectedItems.length < 2 },
    { id: 'align-right', icon: <AlignRight className="w-4 h-4" />, label: 'Align Right', onClick: handleAlignRight, disabled: selectedItems.length < 2 },
  ];

  const viewButtons = [
    { id: 'zoom-fit', icon: <Maximize className="w-4 h-4" />, label: 'Zoom to Fit', onClick: handleZoomToFit },
    { id: 'zoom-reset', icon: <RotateCcw className="w-4 h-4" />, label: 'Reset View', onClick: handleResetView },
    { id: 'bring-front', icon: <Layers3 className="w-4 h-4" />, label: 'Bring to Front', onClick: handleBringToFront, disabled: selectedItems.length === 0 },
    { id: 'send-back', icon: <Layers className="w-4 h-4" />, label: 'Send to Back', onClick: handleSendToBack, disabled: selectedItems.length === 0 },
  ];

  const aiTools = [
    {
      id: 'ai-arrange',
      icon: <Sparkles className="w-4 h-4" />,
      label: 'AI Arrange',
      color: '#38BDF8',
      onClick: () => handleAIArrange()
    },
    {
      id: 'ai-style',
      icon: <Wand2 className="w-4 h-4" />,
      label: 'AI Style',
      color: '#A855F7',
      onClick: () => handleAIStyle()
    },
    {
      id: 'ai-optimize',
      icon: <Sparkles className="w-4 h-4" />,
      label: 'AI Optimize',
      color: '#10B981',
      onClick: () => handleAIOptimize()
    },
  ];

  // AI functionality handlers
  function handleAIArrange() {
    if (canvasItems.length < 2) {
      console.log('Need at least 2 items to arrange');
      return;
    }

    // Smart arrangement algorithm
    const itemsToArrange = selectedItems.length > 1
      ? canvasItems.filter(item => selectedItems.includes(item.id))
      : canvasItems;

    const arranged = itemsToArrange.map((item, index) => {
      const cols = Math.ceil(Math.sqrt(itemsToArrange.length));
      const row = Math.floor(index / cols);
      const col = index % cols;
      const spacing = 50;
      const itemWidth = item.width || 200;
      const itemHeight = item.height || 100;

      return {
        ...item,
        x: 100 + col * (itemWidth + spacing),
        y: 100 + row * (itemHeight + spacing),
      };
    });

    const updatedItems = canvasItems.map(item => {
      const arrangedItem = arranged.find(a => a.id === item.id);
      return arrangedItem || item;
    });

    onItemsUpdate(updatedItems);
    console.log('✨ AI arranged items automatically');
  }

  function handleAIStyle() {
    if (selectedItems.length === 0) {
      console.log('Select items to apply AI styling');
      return;
    }

    // Apply modern design principles
    const styleTemplates = [
      { backgroundColor: '#3B82F6', textColor: '#FFFFFF', borderColor: '#1D4ED8' },
      { backgroundColor: '#10B981', textColor: '#FFFFFF', borderColor: '#059669' },
      { backgroundColor: '#F59E0B', textColor: '#FFFFFF', borderColor: '#D97706' },
      { backgroundColor: '#8B5CF6', textColor: '#FFFFFF', borderColor: '#7C3AED' },
      { backgroundColor: '#06B6D4', textColor: '#FFFFFF', borderColor: '#0891B2' },
    ];

    const updatedItems = canvasItems.map((item, index) => {
      if (selectedItems.includes(item.id)) {
        const template = styleTemplates[index % styleTemplates.length];
        return {
          ...item,
          backgroundColor: template.backgroundColor,
          textColor: template.textColor,
          borderColor: template.borderColor,
          borderWidth: '2px',
          borderRadius: '12px',
        };
      }
      return item;
    });

    onItemsUpdate(updatedItems);
    console.log('🎨 Applied AI styling to selected items');
  }

  function handleAIOptimize() {
    // Optimize canvas performance and layout
    const optimized = canvasItems.map(item => ({
      ...item,
      // Remove redundant properties
      ...(item.backgroundColor === 'transparent' && { backgroundColor: undefined }),
      ...(item.borderWidth === '0px' && { borderWidth: undefined }),
      // Snap to grid for better alignment
      x: Math.round(item.x / 10) * 10,
      y: Math.round(item.y / 10) * 10,
      // Optimize dimensions
      width: Math.round((item.width || 200) / 10) * 10,
      height: Math.round((item.height || 100) / 10) * 10,
    }));

    onItemsUpdate(optimized);
    console.log('⚡ Optimized canvas layout and performance');
  }

  // Event handlers
  function handleCopy() {
    const selectedItemsData = canvasItems.filter(item => selectedItems.includes(item.id));
    setClipboard([...selectedItemsData]);
    console.log('Copied items:', selectedItemsData.length);
  }

  function handlePaste() {
    if (clipboard.length > 0) {
      const newItems = clipboard.map(item => ({
        ...item,
        id: `item-${Date.now()}-${Math.random()}`,
        x: item.x + 20,
        y: item.y + 20,
      }));
      onItemsUpdate([...canvasItems, ...newItems]);
      console.log('Pasted items:', newItems.length);
    }
  }

  function handleDelete() {
    if (selectedItems.length > 0) {
      const remainingItems = canvasItems.filter(item => !selectedItems.includes(item.id));
      onItemsUpdate(remainingItems);
      console.log('Deleted items:', selectedItems.length);
    }
  }

  function handleDuplicate() {
    if (selectedItems.length > 0) {
      const selectedItemsData = canvasItems.filter(item => selectedItems.includes(item.id));
      const duplicatedItems = selectedItemsData.map(item => ({
        ...item,
        id: `item-${Date.now()}-${Math.random()}`,
        x: item.x + 30,
        y: item.y + 30,
      }));
      onItemsUpdate([...canvasItems, ...duplicatedItems]);
      console.log('Duplicated items:', duplicatedItems.length);
    }
  }

  function handleLockToggle() {
    if (selectedItems.length > 0) {
      const updatedItems = canvasItems.map(item => {
        if (selectedItems.includes(item.id)) {
          return { ...item, locked: !item.locked };
        }
        return item;
      });
      onItemsUpdate(updatedItems);
      console.log('Toggled lock for items:', selectedItems.length);
    }
  }

  function handleVisibilityToggle() {
    if (selectedItems.length > 0) {
      const updatedItems = canvasItems.map(item => {
        if (selectedItems.includes(item.id)) {
          return { ...item, visible: item.visible !== false ? false : true };
        }
        return item;
      });
      onItemsUpdate(updatedItems);
      console.log('Toggled visibility for items:', selectedItems.length);
    }
  }

  function handleZoomToFit() {
    if (canvasItems.length > 0) {
      // Calculate bounds of all items
      const bounds = canvasItems.reduce((acc, item) => {
        const right = item.x + (item.width || 200);
        const bottom = item.y + (item.height || 100);
        return {
          minX: Math.min(acc.minX, item.x),
          minY: Math.min(acc.minY, item.y),
          maxX: Math.max(acc.maxX, right),
          maxY: Math.max(acc.maxY, bottom),
        };
      }, { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity });

      // Set zoom to fit all items with padding
      const padding = 50;
      const contentWidth = bounds.maxX - bounds.minX + padding * 2;
      const contentHeight = bounds.maxY - bounds.minY + padding * 2;
      const containerWidth = 800; // Approximate canvas width
      const containerHeight = 600; // Approximate canvas height

      const zoomX = containerWidth / contentWidth;
      const zoomY = containerHeight / contentHeight;
      const newZoom = Math.min(zoomX, zoomY, 2); // Max zoom of 2x

      onZoomChange(newZoom);
      console.log('Zoomed to fit all items');
    }
  }

  function handleResetView() {
    onZoomChange(1);
    console.log('Reset view to 100%');
  }

  function handleBringToFront() {
    if (selectedItems.length > 0) {
      const maxZIndex = Math.max(...canvasItems.map(item => item.zIndex || 1));
      const updatedItems = canvasItems.map(item => {
        if (selectedItems.includes(item.id)) {
          return { ...item, zIndex: maxZIndex + 1 };
        }
        return item;
      });
      onItemsUpdate(updatedItems);
      console.log('Brought to front:', selectedItems.length);
    }
  }

  function handleSendToBack() {
    if (selectedItems.length > 0) {
      const minZIndex = Math.min(...canvasItems.map(item => item.zIndex || 1));
      const updatedItems = canvasItems.map(item => {
        if (selectedItems.includes(item.id)) {
          return { ...item, zIndex: Math.max(1, minZIndex - 1) };
        }
        return item;
      });
      onItemsUpdate(updatedItems);
      console.log('Sent to back:', selectedItems.length);
    }
  }

  function handleAlignLeft() {
    if (selectedItems.length > 1) {
      const selectedItemsData = canvasItems.filter(item => selectedItems.includes(item.id));
      const leftmostX = Math.min(...selectedItemsData.map(item => item.x));
      const updatedItems = canvasItems.map(item => {
        if (selectedItems.includes(item.id)) {
          return { ...item, x: leftmostX };
        }
        return item;
      });
      onItemsUpdate(updatedItems);
      console.log('Aligned left:', selectedItems.length);
    }
  }

  function handleAlignCenter() {
    if (selectedItems.length > 1) {
      const selectedItemsData = canvasItems.filter(item => selectedItems.includes(item.id));
      const leftmostX = Math.min(...selectedItemsData.map(item => item.x));
      const rightmostX = Math.max(...selectedItemsData.map(item => item.x + (item.width || 200)));
      const centerX = (leftmostX + rightmostX) / 2;

      const updatedItems = canvasItems.map(item => {
        if (selectedItems.includes(item.id)) {
          return { ...item, x: centerX - (item.width || 200) / 2 };
        }
        return item;
      });
      onItemsUpdate(updatedItems);
      console.log('Aligned center:', selectedItems.length);
    }
  }

  function handleAlignRight() {
    if (selectedItems.length > 1) {
      const selectedItemsData = canvasItems.filter(item => selectedItems.includes(item.id));
      const rightmostX = Math.max(...selectedItemsData.map(item => item.x + (item.width || 200)));
      const updatedItems = canvasItems.map(item => {
        if (selectedItems.includes(item.id)) {
          return { ...item, x: rightmostX - (item.width || 200) };
        }
        return item;
      });
      onItemsUpdate(updatedItems);
      console.log('Aligned right:', selectedItems.length);
    }
  }

  function handleGroup() {
    if (selectedItems.length >= 2) {
      const groupId = `group-${Date.now()}`;
      const newGroup: CanvasGroup = {
        id: groupId,
        name: `Group ${groups.length + 1}`,
        itemIds: [...selectedItems],
        visible: true,
        locked: false,
      };
      setGroups([...groups, newGroup]);
      
      // Update items with group reference
      const updatedItems = canvasItems.map(item => 
        selectedItems.includes(item.id) ? { ...item, groupId } : item
      );
      onItemsUpdate(updatedItems);
    }
  }

  function handleUngroup() {
    const selectedGroups = groups.filter(group => 
      group.itemIds.some(itemId => selectedItems.includes(itemId))
    );
    
    if (selectedGroups.length > 0) {
      // Remove group references from items
      const updatedItems = canvasItems.map(item => 
        selectedGroups.some(group => group.itemIds.includes(item.id))
          ? { ...item, groupId: undefined }
          : item
      );
      onItemsUpdate(updatedItems);
      
      // Remove groups
      const remainingGroups = groups.filter(group => 
        !selectedGroups.some(selectedGroup => selectedGroup.id === group.id)
      );
      setGroups(remainingGroups);
    }
  }

  // Handlers for HighPerformanceCanvas
  const handleCanvasItemSelect = useCallback((itemId: string) => {
    onItemSelect(itemId, false);
  }, [onItemSelect]);

  const handleCanvasItemMultiSelect = useCallback((itemId: string, isCtrlPressed: boolean) => {
    onItemSelect(itemId, isCtrlPressed);
  }, [onItemSelect]);

  const handleCanvasItemUpdate = useCallback((itemId: string, updates: Partial<CanvasItem>) => {
    // Find the item and update it
    const updatedItems = canvasItems.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          ...updates,
          style: {
            ...item.style,
            backgroundColor: updates.backgroundColor,
            color: updates.color,
            borderColor: updates.borderColor,
            borderRadius: updates.borderRadius,
          }
        };
      }
      return item;
    });
    onItemsUpdate(updatedItems);
  }, [canvasItems, onItemsUpdate]);

  const handleCanvasClick = useCallback(() => {
    // Clear selection when clicking on empty canvas
    if (selectedItems.length > 0) {
      selectedItems.forEach(itemId => onItemSelect(itemId, false));
    }
  }, [selectedItems, onItemSelect]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent shortcuts when typing in inputs
      if ((e.target as HTMLElement)?.tagName === 'INPUT' || (e.target as HTMLElement)?.tagName === 'TEXTAREA') {
        return;
      }

      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              onRedo();
            } else {
              onUndo();
            }
            break;
          case 'y':
            e.preventDefault();
            onRedo();
            break;
          case 'c':
            if (selectedItems.length > 0) {
              e.preventDefault();
              handleCopy();
            }
            break;
          case 'v':
            if (clipboard.length > 0) {
              e.preventDefault();
              handlePaste();
            }
            break;
          case 'd':
            if (selectedItems.length > 0) {
              e.preventDefault();
              handleDuplicate();
            }
            break;
          case 'g':
            if (selectedItems.length >= 2) {
              e.preventDefault();
              if (e.shiftKey) {
                handleUngroup();
              } else {
                handleGroup();
              }
            }
            break;
          case 'a':
            e.preventDefault();
            // Select all items
            const allItemIds = canvasItems.map(item => item.id);
            allItemIds.forEach(id => onItemSelect(id, true));
            break;
          case 's':
            e.preventDefault();
            onSaveSnapshot();
            break;
          case '1':
            e.preventDefault();
            handleResetView();
            break;
          case '0':
            e.preventDefault();
            handleZoomToFit();
            break;
          case ']':
            e.preventDefault();
            handleBringToFront();
            break;
          case '[':
            e.preventDefault();
            handleSendToBack();
            break;
        }
      } else {
        switch (e.key.toLowerCase()) {
          // Tool shortcuts
          case 'v': setActiveTool('select'); break;
          case 'h': setActiveTool('pan'); break;
          case 't':
            setActiveTool('text');
            onAddItem('textElement');
            break;
          case 'p': setActiveTool('draw'); break;
          case 'r': onAddItem('shapeElement', { shapeVariant: 'rectangle' }); break;
          case 'o': onAddItem('shapeElement', { shapeVariant: 'circle' }); break;
          case 'n': onAddItem('stickyNote'); break;
          case 'i': onAddItem('imageElement'); break;
          case 'c': onAddItem('codeBlock'); break;
          case 'l': onAddItem('connectorElement'); break;
          case 'm': onAddItem('mindMapNode'); break;
          case 'delete':
          case 'backspace':
            if (selectedItems.length > 0) {
              e.preventDefault();
              handleDelete();
            }
            break;
          case 'escape':
            // Clear selection
            if (selectedItems.length > 0) {
              selectedItems.forEach(id => onItemSelect(id, false));
            }
            setActiveTool('select');
            break;
          // Alignment shortcuts
          case 'arrowleft':
            if (e.shiftKey && selectedItems.length > 1) {
              e.preventDefault();
              handleAlignLeft();
            }
            break;
          case 'arrowright':
            if (e.shiftKey && selectedItems.length > 1) {
              e.preventDefault();
              handleAlignRight();
            }
            break;
          case 'arrowup':
            if (e.shiftKey && selectedItems.length > 1) {
              e.preventDefault();
              handleAlignCenter();
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItems, clipboard, onUndo, onRedo, canvasItems]);

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Enhanced Toolbar */}
      <div className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50 p-4 shadow-lg">
        <div className="flex items-center justify-between">
          {/* Left Side - Tool Sections */}
          <div className="flex items-center space-x-6">
            {toolSections.map((section) => (
              <div key={section.title} className="flex items-center space-x-1">
                <span className="text-xs text-slate-400 font-medium mr-2">
                  {section.title}
                </span>
                {section.tools.map((tool) => (
                  <Button
                    key={tool.id}
                    variant={activeTool === tool.id ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => {
                      console.log('Tool clicked:', tool.id);
                      if (['select', 'pan', 'draw', 'text'].includes(tool.id)) {
                        setActiveTool(tool.id as any);
                      } else {
                        // Map tool IDs to canvas item types
                        const toolMapping: Record<string, string> = {
                          'sticky': 'stickyNote',
                          'text': 'textElement',
                          'image': 'imageElement',
                          'code': 'codeBlock',
                          'rectangle': 'shapeElement',
                          'circle': 'shapeElement',
                          'triangle': 'shapeElement',
                          'connector': 'connectorElement',
                          'table': 'tableElement',
                          'chart': 'chart',
                          'mindmap': 'mindMapNode',
                          'pen': 'drawingPath',
                          'brush': 'drawingPath',
                          'eraser': 'eraser'
                        };

                        const itemType = toolMapping[tool.id] || tool.id;

                        // Add specific properties based on tool
                        let specificProps = {};
                        if (tool.id === 'rectangle') {
                          specificProps = { shapeVariant: 'rectangle' };
                        } else if (tool.id === 'circle') {
                          specificProps = { shapeVariant: 'circle' };
                        } else if (tool.id === 'triangle') {
                          specificProps = { shapeVariant: 'triangle' };
                        } else if (tool.id === 'pen' || tool.id === 'brush') {
                          specificProps = {
                            drawingType: tool.id,
                            strokeWidth: tool.id === 'brush' ? 5 : 2,
                            strokeColor: '#000000'
                          };
                        }

                        onAddItem(itemType, specificProps);
                      }
                    }}
                    title={`${tool.label}${tool.shortcut ? ` (${tool.shortcut})` : ''}`}
                  >
                    {tool.icon}
                  </Button>
                ))}
              </div>
            ))}
          </div>

          {/* Center - Actions */}
          <div className="flex items-center space-x-4">
            {/* Primary Actions */}
            <div className="flex items-center space-x-1">
              <span className="text-xs text-slate-400 font-medium mr-2">Actions</span>
              {actionButtons.map((action) => (
                <Button
                  key={action.id}
                  variant="ghost"
                  size="sm"
                  onClick={action.onClick}
                  disabled={action.disabled}
                  title={`${action.label}${action.shortcut ? ` (${action.shortcut})` : ''}`}
                >
                  {action.icon}
                </Button>
              ))}
            </div>

            {/* Alignment Tools */}
            <div className="flex items-center space-x-1">
              <span className="text-xs text-slate-400 font-medium mr-2">Align</span>
              {alignmentButtons.map((action) => (
                <Button
                  key={action.id}
                  variant="ghost"
                  size="sm"
                  onClick={action.onClick}
                  disabled={action.disabled}
                  title={action.label}
                >
                  {action.icon}
                </Button>
              ))}
            </div>

            {/* View Controls */}
            <div className="flex items-center space-x-1">
              <span className="text-xs text-slate-400 font-medium mr-2">View</span>
              {viewButtons.map((action) => (
                <Button
                  key={action.id}
                  variant="ghost"
                  size="sm"
                  onClick={action.onClick}
                  disabled={action.disabled}
                  title={action.label}
                >
                  {action.icon}
                </Button>
              ))}
            </div>
          </div>

          {/* Right Side - View Controls & AI Tools */}
          <div className="flex items-center space-x-4">
            {/* AI Tools */}
            <div className="flex items-center space-x-1">
              <span className="text-xs text-slate-400 font-medium mr-2">AI</span>
              {aiTools.map((tool) => (
                <Button
                  key={tool.id}
                  variant="ghost"
                  size="sm"
                  onClick={tool.onClick}
                  style={{ color: tool.color }}
                  title={tool.label}
                >
                  {tool.icon}
                </Button>
              ))}
            </div>

            {/* View Controls */}
            <div className="flex items-center space-x-1">
              <Button
                variant={showGrid ? "primary" : "ghost"}
                size="sm"
                onClick={() => setShowGrid(!showGrid)}
                title="Toggle Grid"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              
              <div className="flex items-center space-x-1 px-2">
                <Button variant="ghost" size="sm" onClick={() => onZoomChange(Math.max(0.1, zoom - 0.25))}>
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium min-w-12 text-center text-slate-200">
                  {Math.round(zoom * 100)}%
                </span>
                <Button variant="ghost" size="sm" onClick={() => onZoomChange(Math.min(5, zoom + 0.25))}>
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>

              <Button variant="ghost" size="sm" onClick={() => setShowLayers(!showLayers)}>
                <Layers className="w-4 h-4" />
              </Button>
              
              <Button variant="ghost" size="sm" onClick={onSaveSnapshot}>
                <Save className="w-4 h-4" />
              </Button>
              
              <Button variant="ghost" size="sm" onClick={onScreenshot}>
                <Camera className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex">
        {/* High-Performance Canvas with Advanced Pan & Zoom */}
        <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-xl rounded-lg border border-slate-700/50 shadow-2xl m-4">
          <HighPerformanceCanvas
            items={highPerformanceCanvasItems}
            selectedItemIds={selectedItemIds}
            onUpdateItem={handleCanvasItemUpdate}
            onSelectItem={handleCanvasItemSelect}
            onMultiSelectItem={handleCanvasItemMultiSelect}
            onCanvasClick={handleCanvasClick}
            enableInteractions={true}
            className="world-class-canvas"
          />

        </div>

        {/* Properties Panel */}
        <AnimatePresence>
          {showProperties && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="w-80 bg-slate-900/95 backdrop-blur-sm border-l border-slate-700/50 p-4 overflow-y-auto shadow-2xl"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-100">Properties</h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowProperties(false)}>
                    <Minimize className="w-4 h-4" />
                  </Button>
                </div>

                {selectedItems.length === 0 && (
                  <div className="text-center text-slate-400 py-8">
                    <Layers className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Select an item to edit properties</p>
                  </div>
                )}

                {selectedItems.length > 0 && (
                  <Card>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Selection</span>
                        <Badge variant="neutral">{selectedItems.length} items</Badge>
                      </div>
                      
                      {/* Quick Actions */}
                      <div className="grid grid-cols-2 gap-2">
                        <Button size="sm" variant="ghost" onClick={handleCopy}>
                          <Copy className="w-3 h-3 mr-1" />
                          Copy
                        </Button>
                        <Button size="sm" variant="ghost" onClick={handleDelete}>
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
                        <Button size="sm" variant="ghost" onClick={handleLockToggle}>
                          <Lock className="w-3 h-3 mr-1" />
                          Lock
                        </Button>
                        <Button size="sm" variant="ghost" onClick={handleVisibilityToggle}>
                          <EyeOff className="w-3 h-3 mr-1" />
                          Hide
                        </Button>
                        <Button size="sm" variant="ghost" onClick={handleDuplicate}>
                          <Copy className="w-3 h-3 mr-1" />
                          Duplicate
                        </Button>
                        <Button size="sm" variant="ghost" onClick={handleBringToFront}>
                          <Layers3 className="w-3 h-3 mr-1" />
                          To Front
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Layers Panel */}
                {showLayers && (
                  <Card>
                    <div className="space-y-4">
                      <h4 className="font-medium text-slate-100">Layers</h4>
                      
                      <div className="space-y-2">
                        {layers.map((layer) => (
                          <div key={layer.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50">
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="xs">
                                {layer.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                              </Button>
                              <span className="text-sm">{layer.name}</span>
                            </div>
                            <Button variant="ghost" size="xs">
                              {layer.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};

export default CanvasWorldClass;
