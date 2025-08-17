import React, { memo } from "react";
import CanvasSection from "./CanvasSection";
import type { CanvasSectionProps } from "./CanvasSection";

// Performance optimized wrapper for CanvasSection with React.memo
export const CanvasSectionOptimized = memo<CanvasSectionProps>((props) => {
  return <CanvasSection {...props} />;
}, (prevProps, nextProps) => {
  // Optimized comparison to prevent unnecessary re-renders
  return (
    prevProps.canvasItems === nextProps.canvasItems &&
    prevProps.selectedCanvasItems === nextProps.selectedCanvasItems &&
    prevProps.canvasOffset === nextProps.canvasOffset &&
    prevProps.zoomLevel === nextProps.zoomLevel &&
    prevProps.canvasHistoryIndex === nextProps.canvasHistoryIndex &&
    prevProps.nextZIndex === nextProps.nextZIndex &&
    prevProps.showImageModal === nextProps.showImageModal &&
    prevProps.modalImageSrc === nextProps.modalImageSrc
  );
});

CanvasSectionOptimized.displayName = 'CanvasSectionOptimized';

export default CanvasSectionOptimized;
