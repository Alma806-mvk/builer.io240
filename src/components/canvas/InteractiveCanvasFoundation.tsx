import React, { useState, useCallback, useMemo } from "react";
import { CanvasItem, CanvasItemType } from "../../types";
import HighPerformanceCanvas from "./HighPerformanceCanvas";

interface InteractiveCanvasFoundationProps {
  className?: string;
  onAddItem?: (type: CanvasItemType) => void;
  enableToolbar?: boolean;
}

// Sample canvas items for demonstration
const DEMO_ITEMS: CanvasItem[] = [
  {
    id: '1',
    type: 'stickyNote',
    x: 100,
    y: 100,
    width: 200,
    height: 120,
    zIndex: 1,
    content: '🚀 Welcome to the High-Performance Canvas!',
    backgroundColor: '#FEF3C7',
    color: '#92400E',
    borderColor: '#F59E0B',
  },
  {
    id: '2',
    type: 'textElement',
    x: 400,
    y: 150,
    width: 280,
    height: 100,
    zIndex: 2,
    content: '⚡ Pure CSS Grid Background\n🔍 Zoom with Ctrl+Wheel\n🔲 Pan with Space+Drag',
    backgroundColor: '#DBEAFE',
    color: '#1E40AF',
    borderColor: '#3B82F6',
  },
  {
    id: '3',
    type: 'shapeElement',
    x: 200,
    y: 320,
    width: 150,
    height: 150,
    zIndex: 3,
    content: '🎯',
    backgroundColor: '#F3E8FF',
    color: '#8B5CF6',
    borderColor: '#8B5CF6',
    borderRadius: '50%',
  },
  {
    id: '4',
    type: 'textElement',
    x: 500,
    y: 320,
    width: 220,
    height: 80,
    zIndex: 4,
    content: '✨ Hover over items to see effects',
    backgroundColor: '#ECFDF5',
    color: '#065F46',
    borderColor: '#10B981',
  },
  {
    id: '5',
    type: 'stickyNote',
    x: 750,
    y: 200,
    width: 180,
    height: 120,
    zIndex: 5,
    content: 'Canvas Boundaries:\n-10k to +10k pixels\n\nZoom Range:\n5% to 500%',
    backgroundColor: '#FEE2E2',
    color: '#991B1B',
    borderColor: '#EF4444',
  },
];

export const InteractiveCanvasFoundation: React.FC<InteractiveCanvasFoundationProps> = ({
  className = "",
  onAddItem,
  enableToolbar = true,
}) => {
  const [items, setItems] = useState<CanvasItem[]>(DEMO_ITEMS);
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());

  // Handle item selection
  const handleSelectItem = useCallback((id: string) => {
    setSelectedItemIds(new Set([id]));
  }, []);

  // Handle multi-selection
  const handleMultiSelectItem = useCallback((id: string, isCtrlPressed: boolean) => {
    if (isCtrlPressed) {
      setSelectedItemIds(prev => {
        const newSelection = new Set(prev);
        if (newSelection.has(id)) {
          newSelection.delete(id);
        } else {
          newSelection.add(id);
        }
        return newSelection;
      });
    } else {
      setSelectedItemIds(new Set([id]));
    }
  }, []);

  // Handle canvas background click
  const handleCanvasClick = useCallback(() => {
    setSelectedItemIds(new Set());
  }, []);

  // Handle item updates
  const handleUpdateItem = useCallback((id: string, updates: Partial<CanvasItem>) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  }, []);

  // Add new items
  const addNewItem = useCallback((type: CanvasItemType) => {
    const newItem: CanvasItem = {
      id: `item-${Date.now()}`,
      type,
      x: Math.random() * 300 + 100,
      y: Math.random() * 200 + 100,
      width: 200,
      height: 100,
      zIndex: items.length + 1,
      content: `New ${type}`,
      backgroundColor: type === 'stickyNote' ? '#FEF3C7' : '#DBEAFE',
      color: type === 'stickyNote' ? '#92400E' : '#1E40AF',
      borderColor: type === 'stickyNote' ? '#F59E0B' : '#3B82F6',
    };

    setItems(prev => [...prev, newItem]);
    setSelectedItemIds(new Set([newItem.id]));
    onAddItem?.(type);
  }, [items.length, onAddItem]);

  // Delete selected items
  const deleteSelectedItems = useCallback(() => {
    setItems(prev => prev.filter(item => !selectedItemIds.has(item.id)));
    setSelectedItemIds(new Set());
  }, [selectedItemIds]);

  // Clear all items
  const clearCanvas = useCallback(() => {
    setItems([]);
    setSelectedItemIds(new Set());
  }, []);

  // Reset to demo
  const resetToDemo = useCallback(() => {
    setItems(DEMO_ITEMS);
    setSelectedItemIds(new Set());
  }, []);

  // Toolbar component
  const Toolbar = useMemo(() => {
    if (!enableToolbar) return null;

    return (
      <div className="canvas-toolbar">
        <div className="toolbar-section">
          <h3 className="toolbar-title">Canvas Foundation Demo</h3>
          <p className="toolbar-description">
            Pure CSS grid background with buttery smooth interactions
          </p>
        </div>

        <div className="toolbar-section">
          <div className="toolbar-group">
            <button
              onClick={() => addNewItem('textElement')}
              className="toolbar-button"
              title="Add Text Element"
            >
              <span className="toolbar-icon">📝</span>
              Text
            </button>
            <button
              onClick={() => addNewItem('stickyNote')}
              className="toolbar-button"
              title="Add Sticky Note"
            >
              <span className="toolbar-icon">📋</span>
              Note
            </button>
            <button
              onClick={() => addNewItem('shapeElement')}
              className="toolbar-button"
              title="Add Shape"
            >
              <span className="toolbar-icon">🔷</span>
              Shape
            </button>
          </div>

          <div className="toolbar-group">
            <button
              onClick={deleteSelectedItems}
              disabled={selectedItemIds.size === 0}
              className="toolbar-button danger"
              title="Delete Selected"
            >
              <span className="toolbar-icon">🗑️</span>
              Delete ({selectedItemIds.size})
            </button>
            <button
              onClick={clearCanvas}
              className="toolbar-button warning"
              title="Clear Canvas"
            >
              <span className="toolbar-icon">🧹</span>
              Clear
            </button>
            <button
              onClick={resetToDemo}
              className="toolbar-button"
              title="Reset to Demo"
            >
              <span className="toolbar-icon">🔄</span>
              Reset
            </button>
          </div>
        </div>

        <div className="toolbar-section">
          <div className="interaction-guide">
            <div className="guide-item">
              <span className="guide-key">Space + Drag</span>
              <span className="guide-action">Pan canvas</span>
            </div>
            <div className="guide-item">
              <span className="guide-key">Middle Click + Drag</span>
              <span className="guide-action">Pan canvas</span>
            </div>
            <div className="guide-item">
              <span className="guide-key">Ctrl + Wheel</span>
              <span className="guide-action">Zoom to cursor</span>
            </div>
            <div className="guide-item">
              <span className="guide-key">Ctrl + Click</span>
              <span className="guide-action">Multi-select</span>
            </div>
          </div>
        </div>
      </div>
    );
  }, [enableToolbar, selectedItemIds.size, addNewItem, deleteSelectedItems, clearCanvas, resetToDemo]);

  return (
    <div className={`interactive-canvas-foundation ${className}`}>
      {Toolbar}
      
      <div className="canvas-container">
        <HighPerformanceCanvas
          items={items}
          selectedItemIds={selectedItemIds}
          onUpdateItem={handleUpdateItem}
          onSelectItem={handleSelectItem}
          onMultiSelectItem={handleMultiSelectItem}
          onCanvasClick={handleCanvasClick}
          className="foundation-canvas"
        />
      </div>

      <style>{`
        .interactive-canvas-foundation {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
          color: white;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }

        .canvas-toolbar {
          background: rgba(30, 41, 59, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(148, 163, 184, 0.2);
          padding: 20px;
          display: flex;
          flex-wrap: wrap;
          gap: 24px;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
        }

        .toolbar-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .toolbar-title {
          font-size: 20px;
          font-weight: 700;
          margin: 0;
          background: linear-gradient(135deg, #38BDF8, #8B5CF6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .toolbar-description {
          font-size: 14px;
          color: rgba(148, 163, 184, 0.9);
          margin: 0;
        }

        .toolbar-group {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .toolbar-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 8px;
          color: #60A5FA;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          white-space: nowrap;
        }

        .toolbar-button:hover {
          background: rgba(59, 130, 246, 0.2);
          border-color: rgba(59, 130, 246, 0.5);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
        }

        .toolbar-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .toolbar-button.danger {
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.3);
          color: #F87171;
        }

        .toolbar-button.danger:hover:not(:disabled) {
          background: rgba(239, 68, 68, 0.2);
          border-color: rgba(239, 68, 68, 0.5);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
        }

        .toolbar-button.warning {
          background: rgba(245, 158, 11, 0.1);
          border-color: rgba(245, 158, 11, 0.3);
          color: #FBBF24;
        }

        .toolbar-button.warning:hover {
          background: rgba(245, 158, 11, 0.2);
          border-color: rgba(245, 158, 11, 0.5);
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);
        }

        .toolbar-icon {
          font-size: 16px;
        }

        .interaction-guide {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          font-size: 12px;
        }

        .guide-item {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 8px;
          background: rgba(15, 23, 42, 0.6);
          border-radius: 6px;
          border: 1px solid rgba(100, 116, 139, 0.2);
        }

        .guide-key {
          font-family: 'SF Mono', 'Monaco', 'Inconsolata', monospace;
          font-weight: 600;
          color: #38BDF8;
        }

        .guide-action {
          color: rgba(148, 163, 184, 0.9);
        }

        .canvas-container {
          flex: 1;
          position: relative;
          border-radius: 12px 12px 0 0;
          overflow: hidden;
          margin: 0 20px 20px 20px;
          box-shadow: 
            0 0 0 1px rgba(148, 163, 184, 0.1),
            0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .foundation-canvas {
          border-radius: 12px;
        }

        @media (max-width: 768px) {
          .canvas-toolbar {
            padding: 16px;
            gap: 16px;
          }

          .toolbar-section {
            width: 100%;
          }

          .toolbar-group {
            flex-wrap: wrap;
          }

          .interaction-guide {
            display: none;
          }

          .canvas-container {
            margin: 0 16px 16px 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default InteractiveCanvasFoundation;
