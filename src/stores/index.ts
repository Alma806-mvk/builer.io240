// Export all stores and utilities
export { useCanvasStore, useCanvasItems, useSelectedCanvasItems, useCanvasOffset, useCanvasZoom, useCanvasInteractionState, useCanvasActions } from './canvasStore';
export { useAppStore, useActiveTab, useLoadingState, useFormState, useHistory, useModalStates, useDropdownStates, useAppActions } from './appStore';

// Store integration utilities
export const withStoreSubscription = <T>(selector: (state: any) => T) => {
  return selector;
};

// Performance utilities for Zustand subscriptions
export const createShallowSelector = <T>(fn: (state: any) => T) => fn;
