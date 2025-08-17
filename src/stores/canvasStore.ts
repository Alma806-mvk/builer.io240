import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { CanvasItem, CanvasItemType } from '../types';

// Extended canvas item interface
export interface ExtendedCanvasItem extends CanvasItem {
  locked?: boolean;
  visible?: boolean;
  groupId?: string;
  rotation?: number;
  opacity?: number;
}

// Canvas state interface
interface CanvasState {
  // Items state
  items: ExtendedCanvasItem[];
  selectedItems: string[];
  
  // Viewport state
  offset: { x: number; y: number };
  zoom: number;
  
  // Interaction state
  isDragging: boolean;
  isPanning: boolean;
  tool: string;
  
  // Actions
  addCanvasItem: (item: Partial<ExtendedCanvasItem>) => void;
  updateCanvasItem: (itemId: string, updates: Partial<ExtendedCanvasItem>) => void;
  deleteCanvasItem: (itemId: string) => void;
  selectCanvasItem: (itemId: string, multiSelect?: boolean) => void;
  clearSelection: () => void;
  clearCanvas: () => void;
  
  // Viewport actions
  setOffset: (offset: { x: number; y: number }) => void;
  setZoom: (zoom: number) => void;
  
  // Interaction actions
  setTool: (tool: string) => void;
  setDragging: (dragging: boolean) => void;
  setPanning: (panning: boolean) => void;
  
  // Bulk operations
  setItems: (items: ExtendedCanvasItem[]) => void;
  duplicateItem: (itemId: string) => void;
  groupItems: (itemIds: string[]) => void;
  ungroupItems: (groupId: string) => void;
}

// Create the Zustand store
export const useCanvasStore = create<CanvasState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    items: [],
    selectedItems: [],
    offset: { x: 0, y: 0 },
    zoom: 1,
    isDragging: false,
    isPanning: false,
    tool: 'select',

    // Item actions
    addCanvasItem: (item) => {
      const newItem: ExtendedCanvasItem = {
        id: item.id || `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: item.type || 'textElement',
        x: item.x || 100,
        y: item.y || 100,
        width: item.width || 150,
        height: item.height || 100,
        content: item.content || 'New Item',
        backgroundColor: item.backgroundColor || '#3B82F6',
        textColor: item.textColor || '#FFFFFF',
        zIndex: item.zIndex || Date.now(),
        locked: false,
        visible: true,
        rotation: 0,
        opacity: 1,
        ...item,
      };
      
      set((state) => ({
        items: [...state.items, newItem],
        selectedItems: [newItem.id],
      }));
    },

    updateCanvasItem: (itemId, updates) => {
      set((state) => ({
        items: state.items.map((item) =>
          item.id === itemId ? { ...item, ...updates } : item
        ),
      }));
    },

    deleteCanvasItem: (itemId) => {
      set((state) => ({
        items: state.items.filter((item) => item.id !== itemId),
        selectedItems: state.selectedItems.filter((id) => id !== itemId),
      }));
    },

    selectCanvasItem: (itemId, multiSelect = false) => {
      set((state) => {
        if (multiSelect) {
          const isSelected = state.selectedItems.includes(itemId);
          return {
            selectedItems: isSelected
              ? state.selectedItems.filter((id) => id !== itemId)
              : [...state.selectedItems, itemId],
          };
        } else {
          return {
            selectedItems: [itemId],
          };
        }
      });
    },

    clearSelection: () => {
      set({ selectedItems: [] });
    },

    clearCanvas: () => {
      set({ items: [], selectedItems: [] });
    },

    // Viewport actions
    setOffset: (offset) => {
      set({ offset });
    },

    setZoom: (zoom) => {
      set({ zoom: Math.max(0.1, Math.min(5, zoom)) });
    },

    // Interaction actions
    setTool: (tool) => {
      set({ tool });
    },

    setDragging: (isDragging) => {
      set({ isDragging });
    },

    setPanning: (isPanning) => {
      set({ isPanning });
    },

    // Bulk operations
    setItems: (items) => {
      set({ items, selectedItems: [] });
    },

    duplicateItem: (itemId) => {
      const state = get();
      const item = state.items.find((i) => i.id === itemId);
      if (item) {
        const duplicatedItem: ExtendedCanvasItem = {
          ...item,
          id: `${item.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          x: item.x + 20,
          y: item.y + 20,
          zIndex: Date.now(),
        };
        
        set((state) => ({
          items: [...state.items, duplicatedItem],
          selectedItems: [duplicatedItem.id],
        }));
      }
    },

    groupItems: (itemIds) => {
      const groupId = `group-${Date.now()}`;
      set((state) => ({
        items: state.items.map((item) =>
          itemIds.includes(item.id) ? { ...item, groupId } : item
        ),
      }));
    },

    ungroupItems: (groupId) => {
      set((state) => ({
        items: state.items.map((item) =>
          item.groupId === groupId ? { ...item, groupId: undefined } : item
        ),
      }));
    },
  }))
);

// Selector hooks for performance
export const useCanvasItems = () => useCanvasStore((state) => state.items);
export const useSelectedCanvasItems = () => useCanvasStore((state) => state.selectedItems);
export const useCanvasOffset = () => useCanvasStore((state) => state.offset);
export const useCanvasZoom = () => useCanvasStore((state) => state.zoom);
export const useCanvasInteractionState = () => useCanvasStore((state) => ({
  isDragging: state.isDragging,
  isPanning: state.isPanning,
  tool: state.tool,
}));

export const useCanvasActions = () => useCanvasStore((state) => ({
  addCanvasItem: state.addCanvasItem,
  updateCanvasItem: state.updateCanvasItem,
  deleteCanvasItem: state.deleteCanvasItem,
  selectCanvasItem: state.selectCanvasItem,
  clearSelection: state.clearSelection,
  clearCanvas: state.clearCanvas,
  setOffset: state.setOffset,
  setZoom: state.setZoom,
  setTool: state.setTool,
  setDragging: state.setDragging,
  setPanning: state.setPanning,
  setItems: state.setItems,
  duplicateItem: state.duplicateItem,
  groupItems: state.groupItems,
  ungroupItems: state.ungroupItems,
}));
