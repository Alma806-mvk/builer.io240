/**
 * Firebase Stream Manager
 * Prevents ReadableStreamDefaultReader conflicts by managing concurrent Firestore operations
 */

class FirestoreStreamManager {
  private activeStreams = new Set<string>();
  private pendingOperations = new Map<string, Promise<any>>();

  /**
   * Execute a Firestore operation with conflict prevention
   */
  async executeOperation<T>(
    operationId: string,
    operation: () => Promise<T>
  ): Promise<T> {
    // If operation is already running, return the existing promise
    if (this.pendingOperations.has(operationId)) {
      console.log(`⏳ Waiting for existing operation: ${operationId}`);
      return this.pendingOperations.get(operationId) as Promise<T>;
    }

    // Add small delay if there are concurrent operations
    if (this.activeStreams.size > 0) {
      await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
    }

    this.activeStreams.add(operationId);
    
    const operationPromise = operation()
      .finally(() => {
        this.activeStreams.delete(operationId);
        this.pendingOperations.delete(operationId);
      });

    this.pendingOperations.set(operationId, operationPromise);
    
    return operationPromise;
  }

  /**
   * Create a listener with conflict prevention
   */
  createListener(
    listenerId: string,
    setupListener: () => (() => void),
    delay: number = 100
  ): Promise<() => void> {
    return this.executeOperation(
      `listener_${listenerId}`,
      async () => {
        // Add delay to prevent race conditions
        await new Promise(resolve => setTimeout(resolve, delay));
        return setupListener();
      }
    );
  }

  /**
   * Check if there are active operations
   */
  hasActiveOperations(): boolean {
    return this.activeStreams.size > 0;
  }

  /**
   * Get count of active operations
   */
  getActiveOperationsCount(): number {
    return this.activeStreams.size;
  }

  /**
   * Clear all pending operations (use with caution)
   */
  clearPendingOperations(): void {
    this.pendingOperations.clear();
    this.activeStreams.clear();
  }
}

// Singleton instance
export const firestoreStreamManager = new FirestoreStreamManager();

/**
 * Wrapper for onSnapshot with conflict prevention
 */
export function createManagedListener<T>(
  listenerId: string,
  setupListener: () => (() => void),
  delay: number = 100
): Promise<() => void> {
  return firestoreStreamManager.createListener(listenerId, setupListener, delay);
}

/**
 * Wrapper for Firestore operations with conflict prevention
 */
export function executeFirestoreOperation<T>(
  operationId: string,
  operation: () => Promise<T>
): Promise<T> {
  return firestoreStreamManager.executeOperation(operationId, operation);
}

/**
 * Error handler for Firestore stream conflicts
 */
export function handleFirestoreStreamError(error: any, context: string): void {
  if (error.message?.includes('ReadableStreamDefaultReader') || 
      error.message?.includes('locked to a reader')) {
    console.warn(`🔄 Firestore stream conflict detected in ${context}. Retrying with delay...`);
    // The stream manager will handle retries automatically
  } else {
    console.error(`❌ Firestore error in ${context}:`, error);
  }
}

export default firestoreStreamManager;
