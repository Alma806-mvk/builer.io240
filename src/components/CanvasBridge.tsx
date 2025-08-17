import React, { useEffect } from 'react';
import { useCanvasStore, useCanvasActions, ExtendedCanvasItem } from '../stores/canvasStore';
import CanvasWorldClass from './CanvasWorldClass';
import { CanvasItem } from '../types';

interface CanvasBridgeProps {
  canvasItems: CanvasItem[];
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

export const CanvasBridge: React.FC<CanvasBridgeProps> = (props) => {
  const zustandItems = useCanvasStore((state) => state.items);
  const zustandSelectedItems = useCanvasStore((state) => state.selectedItems);
  const { setItems, selectCanvasItem } = useCanvasActions();

  // Sync App.tsx canvas items to Zustand store
  useEffect(() => {
    const extendedItems: ExtendedCanvasItem[] = props.canvasItems.map(item => ({
      ...item,
      locked: false,
      visible: true,
      rotation: 0,
      opacity: 1,
    }));
    
    // Only update if items are actually different
    if (JSON.stringify(extendedItems) !== JSON.stringify(zustandItems)) {
      setItems(extendedItems);
    }
  }, [props.canvasItems, setItems, zustandItems]);

  // Sync selected items from App.tsx to Zustand
  useEffect(() => {
    if (props.selectedItems.length > 0 && props.selectedItems[0] !== zustandSelectedItems[0]) {
      selectCanvasItem(props.selectedItems[0]);
    }
  }, [props.selectedItems, selectCanvasItem, zustandSelectedItems]);

  // Create handlers that update both App.tsx state and Zustand store
  const handleItemsUpdate = (items: ExtendedCanvasItem[]) => {
    // Update App.tsx state
    props.onItemsUpdate(items);
    
    // Update Zustand store
    setItems(items);
  };

  const handleItemSelect = (itemId: string, multiSelect?: boolean) => {
    // Update App.tsx state
    props.onItemSelect(itemId, multiSelect);
    
    // Update Zustand store
    selectCanvasItem(itemId, multiSelect);
  };

  return (
    <CanvasWorldClass
      canvasItems={zustandItems}
      selectedItems={zustandSelectedItems}
      onItemSelect={handleItemSelect}
      onItemsUpdate={handleItemsUpdate}
      onAddItem={props.onAddItem}
      updateCanvasItemProperty={props.updateCanvasItemProperty}
      zoom={props.zoom}
      onZoomChange={props.onZoomChange}
      onSaveSnapshot={props.onSaveSnapshot}
      onScreenshot={props.onScreenshot}
      onClearCanvas={props.onClearCanvas}
      history={props.history}
      historyIndex={props.historyIndex}
      onUndo={props.onUndo}
      onRedo={props.onRedo}
    />
  );
};

export default CanvasBridge;
