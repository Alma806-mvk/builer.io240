import React, { memo, useCallback } from 'react';
import { CanvasItem, CanvasItemType } from '../types';
import {
  TypeToolIcon,
  ShapesIcon,
  StickyNoteIcon,
  TrashIcon,
  RotateCcwIcon,
  RefreshCwIcon,
} from './IconComponents';

interface CanvasToolbarProps {
  canvasItems: CanvasItem[];
  selectedItems: string[];
  onAddItem: (type: CanvasItemType, properties?: any) => void;
  onDeleteItem: (itemId: string) => void;
  onClearCanvas: () => void;
}

/**
 * Canvas toolbar component that uses props for state management.
 * This component is optimized and only re-renders when necessary.
 */
export const CanvasToolbar = memo(({
  canvasItems,
  selectedItems,
  onAddItem,
  onDeleteItem,
  onClearCanvas
}: CanvasToolbarProps) => {

  // Optimized add canvas item handler
  const handleAddCanvasItem = useCallback(
    (itemType: CanvasItemType) => {
      onAddItem(itemType);
    },
    [onAddItem]
  );

  // Delete selected items
  const deleteSelected = useCallback(() => {
    selectedItems.forEach((itemId) => onDeleteItem(itemId));
  }, [selectedItems, onDeleteItem]);

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-4 shadow-xl mb-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Text Tool */}
        <button
          onClick={() => handleAddCanvasItem("textElement")}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
          title="Add Text Element"
        >
          <TypeToolIcon className="h-4 w-4" />
          <span>Text</span>
        </button>

        {/* Shape Tool */}
        <button
          onClick={() => handleAddCanvasItem("shapeElement")}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors"
          title="Add Shape Element"
        >
          <ShapesIcon className="h-4 w-4" />
          <span>Shape</span>
        </button>

        {/* Sticky Note */}
        <button
          onClick={() => handleAddCanvasItem("stickyNote")}
          className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg transition-colors"
          title="Add Sticky Note"
        >
          <StickyNoteIcon className="h-4 w-4" />
          <span>Note</span>
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-slate-600 mx-2" />

        {/* Delete Selected */}
        {selectedItems.length > 0 && (
          <button
            onClick={deleteSelected}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
            title={`Delete Selected (${selectedItems.length})`}
          >
            <TrashIcon className="h-4 w-4" />
            <span>Delete ({selectedItems.length})</span>
          </button>
        )}

        {/* Clear Canvas */}
        <button
          onClick={onClearCanvas}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
          title="Clear Canvas"
        >
          <TrashIcon className="h-4 w-4" />
          <span>Clear All</span>
        </button>

        {/* Canvas Info */}
        <div className="ml-auto text-slate-300 text-sm">
          {canvasItems.length} items • {selectedItems.length} selected
        </div>
      </div>
    </div>
  );
});

CanvasToolbar.displayName = 'CanvasToolbar';

export default CanvasToolbar;
