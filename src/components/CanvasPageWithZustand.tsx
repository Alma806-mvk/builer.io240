import React, { memo } from 'react';
import OptimizedCanvasWithZustand from './OptimizedCanvasWithZustand';

/**
 * Complete Canvas page implementation using Zustand for state management.
 * This component achieves buttery-smooth performance by:
 * 1. Using Zustand for centralized state management
 * 2. Selective subscriptions to prevent unnecessary re-renders
 * 3. Optimized event handling with throttling
 * 4. React.memo for component-level optimization
 */
export const CanvasPageWithZustand = memo(() => {
  return (
    <div className="flex flex-col h-full p-6 bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 min-h-screen">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          High-Performance Canvas
        </h1>
        <p className="text-gray-300">
          Powered by Zustand state management for buttery-smooth performance
        </p>
      </div>


      {/* Main Canvas Area */}
      <div className="flex-grow">
        <OptimizedCanvasWithZustand />
      </div>
    </div>
  );
});

CanvasPageWithZustand.displayName = 'CanvasPageWithZustand';

export default CanvasPageWithZustand;
