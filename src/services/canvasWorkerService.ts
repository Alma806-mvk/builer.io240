import { WorkerMessage, LayoutCalculationRequest, BezierCalculationRequest } from '../workers/canvasWorker';

class CanvasWorkerService {
  private worker: Worker | null = null;
  private pendingTasks = new Map<string, {
    resolve: (value: any) => void;
    reject: (error: Error) => void;
  }>();

  constructor() {
    this.initializeWorker();
  }

  private initializeWorker() {
    try {
      // Create worker from the TypeScript file
      this.worker = new Worker(
        new URL('../workers/canvasWorker.ts', import.meta.url),
        { type: 'module' }
      );

      this.worker.onmessage = (e: MessageEvent<WorkerMessage>) => {
        const { type, payload, id } = e.data;
        const task = this.pendingTasks.get(id);

        if (task) {
          this.pendingTasks.delete(id);
          
          if (type.endsWith('_ERROR')) {
            task.reject(new Error(payload.error));
          } else {
            task.resolve(payload);
          }
        }
      };

      this.worker.onerror = (error) => {
        console.error('Canvas Worker error:', error);
        // Reject all pending tasks
        this.pendingTasks.forEach(task => {
          task.reject(new Error('Worker error'));
        });
        this.pendingTasks.clear();
      };
    } catch (error) {
      console.warn('Canvas Worker not available, falling back to main thread calculations');
    }
  }

  private generateTaskId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private sendMessage(type: string, payload: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.worker) {
        reject(new Error('Worker not available'));
        return;
      }

      const id = this.generateTaskId();
      this.pendingTasks.set(id, { resolve, reject });

      this.worker.postMessage({
        type,
        payload,
        id,
      });

      // Set timeout for worker tasks
      setTimeout(() => {
        if (this.pendingTasks.has(id)) {
          this.pendingTasks.delete(id);
          reject(new Error('Worker task timeout'));
        }
      }, 10000); // 10 second timeout
    });
  }

  async calculateLayout(request: LayoutCalculationRequest): Promise<Array<{id: string; x: number; y: number}>> {
    try {
      return await this.sendMessage('CALCULATE_LAYOUT', request);
    } catch (error) {
      // Fallback to main thread calculation
      console.warn('Worker layout calculation failed, using fallback');
      return this.fallbackLayoutCalculation(request);
    }
  }

  async calculateBezierCurve(request: BezierCalculationRequest): Promise<{points: Array<{x: number; y: number}>; path: string}> {
    try {
      return await this.sendMessage('CALCULATE_BEZIER', request);
    } catch (error) {
      // Fallback to main thread calculation
      console.warn('Worker bezier calculation failed, using fallback');
      return this.fallbackBezierCalculation(request);
    }
  }

  async calculateSmartConnectors(
    nodes: Array<{ id: string; x: number; y: number; width?: number; height?: number }>,
    connections: Array<{ from: string; to: string }>
  ): Promise<Array<{ id: string; from: string; to: string; startX: number; startY: number; endX: number; endY: number; controlX: number; controlY: number }>> {
    try {
      return await this.sendMessage('CALCULATE_SMART_CONNECTORS', { nodes, connections });
    } catch (error) {
      // Fallback to main thread calculation
      console.warn('Worker smart connector calculation failed, using fallback');
      return this.fallbackSmartConnectorCalculation(nodes, connections);
    }
  }

  // Fallback calculations for when worker is not available
  private fallbackLayoutCalculation(request: LayoutCalculationRequest): Array<{id: string; x: number; y: number}> {
    // Simple grid layout fallback
    const { items, canvasWidth, canvasHeight } = request;
    const cols = Math.ceil(Math.sqrt(items.length));
    const spacing = Math.min(canvasWidth / cols, canvasHeight / cols) * 0.8;
    
    return items.map((item, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      return {
        id: item.id,
        x: 100 + col * spacing,
        y: 100 + row * spacing,
      };
    });
  }

  private fallbackBezierCalculation(request: BezierCalculationRequest): {points: Array<{x: number; y: number}>; path: string} {
    const { startX, startY, endX, endY } = request;

    // Simple straight line fallback
    const points = [
      { x: startX, y: startY },
      { x: endX, y: endY }
    ];

    const path = `M ${startX} ${startY} L ${endX} ${endY}`;

    return { points, path };
  }

  private fallbackSmartConnectorCalculation(
    nodes: Array<{ id: string; x: number; y: number; width?: number; height?: number }>,
    connections: Array<{ from: string; to: string }>
  ): Array<{ id: string; from: string; to: string; startX: number; startY: number; endX: number; endY: number; controlX: number; controlY: number }> {
    return connections.map(conn => {
      const sourceNode = nodes.find(n => n.id === conn.from);
      const targetNode = nodes.find(n => n.id === conn.to);

      if (!sourceNode || !targetNode) {
        return null;
      }

      // Simple center-to-center fallback
      const sourceCenterX = sourceNode.x + (sourceNode.width || 200) / 2;
      const sourceCenterY = sourceNode.y + (sourceNode.height || 100) / 2;
      const targetCenterX = targetNode.x + (targetNode.width || 200) / 2;
      const targetCenterY = targetNode.y + (targetNode.height || 100) / 2;

      return {
        id: `${conn.from}-${conn.to}`,
        from: conn.from,
        to: conn.to,
        startX: sourceCenterX,
        startY: sourceCenterY,
        endX: targetCenterX,
        endY: targetCenterY,
        controlX: (sourceCenterX + targetCenterX) / 2,
        controlY: (sourceCenterY + targetCenterY) / 2 - 50,
      };
    }).filter(Boolean) as Array<{ id: string; from: string; to: string; startX: number; startY: number; endX: number; endY: number; controlX: number; controlY: number }>;
  }

  destroy() {
    if (this.worker) {
      // Cancel all pending tasks
      this.pendingTasks.forEach(task => {
        task.reject(new Error('Worker destroyed'));
      });
      this.pendingTasks.clear();
      
      this.worker.terminate();
      this.worker = null;
    }
  }
}

// Singleton instance
export const canvasWorkerService = new CanvasWorkerService();
