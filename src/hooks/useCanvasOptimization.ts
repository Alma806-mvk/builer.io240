import { useMemo, useRef, useCallback } from 'react';
import { CanvasItem } from '../types';

interface ViewportBounds {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

interface CanvasOptimizationProps {
  canvasItems: CanvasItem[];
  canvasOffset: { x: number; y: number };
  zoomLevel: number;
  containerWidth: number;
  containerHeight: number;
}

/**
 * Hook for implementing viewport-based virtualization
 * Only returns items that are visible in the current viewport
 */
export const useCanvasVirtualization = ({
  canvasItems,
  canvasOffset,
  zoomLevel,
  containerWidth,
  containerHeight,
}: CanvasOptimizationProps) => {
  const VIEWPORT_PADDING = 100; // Extra padding to render items slightly outside viewport

  const viewportBounds = useMemo((): ViewportBounds => {
    // Calculate the viewport bounds in canvas coordinates
    const left = (-canvasOffset.x) / zoomLevel - VIEWPORT_PADDING;
    const top = (-canvasOffset.y) / zoomLevel - VIEWPORT_PADDING;
    const right = left + (containerWidth / zoomLevel) + (VIEWPORT_PADDING * 2);
    const bottom = top + (containerHeight / zoomLevel) + (VIEWPORT_PADDING * 2);

    return { left, right, top, bottom };
  }, [canvasOffset.x, canvasOffset.y, zoomLevel, containerWidth, containerHeight]);

  const visibleItems = useMemo(() => {
    return canvasItems.filter((item) => {
      const itemLeft = item.x;
      const itemTop = item.y;
      const itemRight = item.x + (item.width || 200);
      const itemBottom = item.y + (item.height || 100);

      // Check if item intersects with viewport
      return !(
        itemRight < viewportBounds.left ||
        itemLeft > viewportBounds.right ||
        itemBottom < viewportBounds.top ||
        itemTop > viewportBounds.bottom
      );
    });
  }, [canvasItems, viewportBounds]);

  const stats = useMemo(() => ({
    totalItems: canvasItems.length,
    visibleItems: visibleItems.length,
    culledItems: canvasItems.length - visibleItems.length,
    cullingRatio: ((canvasItems.length - visibleItems.length) / canvasItems.length) * 100,
  }), [canvasItems.length, visibleItems.length]);

  return {
    visibleItems,
    viewportBounds,
    stats,
  };
};

/**
 * Hook for throttled event handling
 */
export const useThrottledEvents = () => {
  const throttleRef = useRef<number | null>(null);
  const lastCallTime = useRef<number>(0);

  const throttle = useCallback(<T extends (...args: any[]) => void>(
    func: T,
    delay: number = 16 // ~60fps
  ): T => {
    return ((...args: Parameters<T>) => {
      const now = Date.now();
      
      if (now - lastCallTime.current >= delay) {
        lastCallTime.current = now;
        func(...args);
      } else {
        if (throttleRef.current) {
          cancelAnimationFrame(throttleRef.current);
        }
        throttleRef.current = requestAnimationFrame(() => {
          lastCallTime.current = Date.now();
          func(...args);
        });
      }
    }) as T;
  }, []);

  const cleanup = useCallback(() => {
    if (throttleRef.current) {
      cancelAnimationFrame(throttleRef.current);
      throttleRef.current = null;
    }
  }, []);

  return { throttle, cleanup };
};

/**
 * Hook for optimized item lookups using Map instead of array.find()
 */
export const useCanvasItemMap = (canvasItems: CanvasItem[]) => {
  const itemsMap = useMemo(() => {
    const map = new Map<string, CanvasItem>();
    canvasItems.forEach(item => map.set(item.id, item));
    return map;
  }, [canvasItems]);

  const getItem = useCallback((id: string) => itemsMap.get(id), [itemsMap]);

  const getItems = useCallback((ids: string[]) => {
    return ids.map(id => itemsMap.get(id)).filter(Boolean) as CanvasItem[];
  }, [itemsMap]);

  return { itemsMap, getItem, getItems };
};
