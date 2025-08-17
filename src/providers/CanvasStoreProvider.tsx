import React, { memo, useEffect } from 'react';
import { useCanvasStore } from '../stores/canvasStore';

/**
 * Canvas Store Provider with performance optimizations.
 * This component handles store initialization and cleanup.
 */
export const CanvasStoreProvider = memo<{ children: React.ReactNode }>(({ children }) => {
  // Initialize store on mount
  useEffect(() => {
    const store = useCanvasStore.getState();
    
    // Save initial state to history
    store.saveCanvasHistory();
    
    // Cleanup function
    return () => {
      // Clear any pending timeouts
      if ((window as any)._canvasHistoryTimeout) {
        clearTimeout((window as any)._canvasHistoryTimeout);
      }
    };
  }, []);

  return <>{children}</>;
});

CanvasStoreProvider.displayName = 'CanvasStoreProvider';

export default CanvasStoreProvider;
