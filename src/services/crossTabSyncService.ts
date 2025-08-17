import { HistoryItem } from "../types";
import { enhancedHistoryService, EnhancedHistoryItem } from "./enhancedHistoryService";

export interface TabContentEvent {
  id: string;
  type: 'content_generated' | 'content_edited' | 'content_deleted' | 'canvas_updated' | 'export_completed';
  sourceTab: string;
  targetTab?: string;
  timestamp: Date;
  payload: {
    content?: string;
    title?: string;
    contentType?: string;
    platform?: string;
    metadata?: any;
    historyItemId?: string;
    canvasItemId?: string;
  };
}

export interface CrossTabState {
  activeGenerations: Map<string, any>;
  recentExports: any[];
  canvasItems: any[];
  pendingSync: TabContentEvent[];
}

class CrossTabSyncService {
  private storageKey = 'creategen_cross_tab_sync';
  private eventListeners: Map<string, Set<(event: TabContentEvent) => void>> = new Map();
  private state: CrossTabState = {
    activeGenerations: new Map(),
    recentExports: [],
    canvasItems: [],
    pendingSync: [],
  };

  constructor() {
    this.initializeSync();
    this.setupStorageListener();
  }

  // Initialize real-time sync with existing systems
  private initializeSync(): void {
    // Subscribe to history service changes
    enhancedHistoryService.subscribe((items: EnhancedHistoryItem[]) => {
      this.handleHistoryUpdate(items);
    });

    // Setup periodic sync check
    setInterval(() => {
      this.processPendingSync();
    }, 1000);
  }

  // Content tracking from different tabs
  async trackContentGeneration(sourceTab: string, content: {
    title: string;
    content: string;
    type: string;
    platform: string;
    metadata?: any;
  }): Promise<string> {
    const historyItem: HistoryItem = {
      id: `${sourceTab}_${Date.now()}`,
      title: content.title,
      type: content.type as any,
      content: content.content,
      platform: content.platform,
      timestamp: new Date(),
      tags: this.extractTags(content.content),
      starred: false,
    };

    // Add to enhanced history
    const enhancedItem = await enhancedHistoryService.addHistoryItem(historyItem);

    // Create sync event
    const event: TabContentEvent = {
      id: `event_${Date.now()}`,
      type: 'content_generated',
      sourceTab,
      timestamp: new Date(),
      payload: {
        content: content.content,
        title: content.title,
        contentType: content.type,
        platform: content.platform,
        metadata: content.metadata,
        historyItemId: enhancedItem.id,
      },
    };

    await this.broadcastEvent(event);
    return enhancedItem.id;
  }

  async trackCanvasUpdate(canvasItemId: string, historyItemId?: string): Promise<void> {
    const event: TabContentEvent = {
      id: `canvas_${Date.now()}`,
      type: 'canvas_updated',
      sourceTab: 'canvas',
      timestamp: new Date(),
      payload: {
        canvasItemId,
        historyItemId,
      },
    };

    // Update canvas state
    this.state.canvasItems.push({
      id: canvasItemId,
      historyItemId,
      timestamp: new Date(),
    });

    await this.broadcastEvent(event);
  }

  async trackExport(sourceTab: string, exportData: {
    format: string;
    items: string[];
    destination?: string;
  }): Promise<void> {
    const event: TabContentEvent = {
      id: `export_${Date.now()}`,
      type: 'export_completed',
      sourceTab,
      timestamp: new Date(),
      payload: {
        metadata: exportData,
      },
    };

    this.state.recentExports.push({
      ...exportData,
      timestamp: new Date(),
      id: event.id,
    });

    await this.broadcastEvent(event);
  }

  // Send content to specific tab
  async sendToCanvas(historyItemId: string): Promise<void> {
    const event: TabContentEvent = {
      id: `send_canvas_${Date.now()}`,
      type: 'content_generated',
      sourceTab: 'history',
      targetTab: 'canvas',
      timestamp: new Date(),
      payload: {
        historyItemId,
      },
    };

    await this.broadcastEvent(event);
  }

  async sendToGenerator(prompt: string, contentType?: string): Promise<void> {
    const event: TabContentEvent = {
      id: `send_generator_${Date.now()}`,
      type: 'content_generated',
      sourceTab: 'history',
      targetTab: 'generator',
      timestamp: new Date(),
      payload: {
        content: prompt,
        contentType,
      },
    };

    await this.broadcastEvent(event);
  }

  async sendToCalendar(contentData: {
    title: string;
    content: string;
    scheduledDate?: Date;
    platform?: string;
  }): Promise<void> {
    const event: TabContentEvent = {
      id: `send_calendar_${Date.now()}`,
      type: 'content_generated',
      sourceTab: 'history',
      targetTab: 'calendar',
      timestamp: new Date(),
      payload: {
        title: contentData.title,
        content: contentData.content,
        metadata: {
          scheduledDate: contentData.scheduledDate,
          platform: contentData.platform,
        },
      },
    };

    await this.broadcastEvent(event);
  }

  // Event subscription system
  subscribe(eventType: string, listener: (event: TabContentEvent) => void): () => void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, new Set());
    }
    
    const listeners = this.eventListeners.get(eventType)!;
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
      if (listeners.size === 0) {
        this.eventListeners.delete(eventType);
      }
    };
  }

  // Get sync state for components
  getSyncState(): CrossTabState {
    return { ...this.state };
  }

  getRecentActivity(limit: number = 10): TabContentEvent[] {
    return this.state.pendingSync
      .slice(-limit)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Integration helpers
  async getHistoryItemForCanvas(historyItemId: string): Promise<EnhancedHistoryItem | null> {
    const history = await enhancedHistoryService.getEnhancedHistory();
    return history.find(item => item.id === historyItemId) || null;
  }

  async markAsSentToCanvas(historyItemId: string, canvasItemId: string): Promise<void> {
    await enhancedHistoryService.updateHistoryItem(historyItemId, {
      sentToCanvas: true,
      canvasItemId,
    });
  }

  // Private methods
  private async broadcastEvent(event: TabContentEvent): Promise<void> {
    // Add to pending sync
    this.state.pendingSync.push(event);
    
    // Persist to localStorage for cross-tab communication
    await this.persistSyncState();
    
    // Notify local listeners
    this.notifyListeners(event);
  }

  private notifyListeners(event: TabContentEvent): void {
    // Notify type-specific listeners
    const typeListeners = this.eventListeners.get(event.type);
    if (typeListeners) {
      typeListeners.forEach(listener => listener(event));
    }

    // Notify all-event listeners
    const allListeners = this.eventListeners.get('*');
    if (allListeners) {
      allListeners.forEach(listener => listener(event));
    }
  }

  private setupStorageListener(): void {
    window.addEventListener('storage', (event) => {
      if (event.key === this.storageKey && event.newValue) {
        try {
          const syncData = JSON.parse(event.newValue);
          this.handleCrossTabUpdate(syncData);
        } catch (error) {
          console.error('Error parsing cross-tab sync data:', error);
        }
      }
    });
  }

  private handleCrossTabUpdate(syncData: any): void {
    // Process events from other tabs
    const newEvents = syncData.pendingSync || [];
    
    for (const event of newEvents) {
      if (!this.state.pendingSync.find(e => e.id === event.id)) {
        // Convert string dates back to Date objects
        event.timestamp = new Date(event.timestamp);
        this.state.pendingSync.push(event);
        this.notifyListeners(event);
      }
    }
  }

  private handleHistoryUpdate(items: EnhancedHistoryItem[]): void {
    // Create events for new history items
    const recentItems = items.filter(item => {
      const age = Date.now() - new Date(item.timestamp).getTime();
      return age < 5000; // Within last 5 seconds
    });

    for (const item of recentItems) {
      const event: TabContentEvent = {
        id: `history_${item.id}`,
        type: 'content_generated',
        sourceTab: 'history',
        timestamp: new Date(item.timestamp),
        payload: {
          historyItemId: item.id,
          title: item.title,
          content: item.content,
          contentType: item.type,
          platform: item.platform,
        },
      };

      this.notifyListeners(event);
    }
  }

  private async processPendingSync(): Promise<void> {
    // Clean up old events (older than 1 hour)
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    this.state.pendingSync = this.state.pendingSync.filter(event => {
      return new Date(event.timestamp).getTime() > oneHourAgo;
    });

    // Persist cleaned state
    await this.persistSyncState();
  }

  private async persistSyncState(): Promise<void> {
    try {
      const persistData = {
        pendingSync: this.state.pendingSync,
        recentExports: this.state.recentExports,
        canvasItems: this.state.canvasItems,
        timestamp: new Date().toISOString(),
      };
      
      localStorage.setItem(this.storageKey, JSON.stringify(persistData));
    } catch (error) {
      console.error('Error persisting sync state:', error);
    }
  }

  private extractTags(content: string): string[] {
    // Extract hashtags
    const hashtagRegex = /#[\w]+/g;
    const hashtags = content.match(hashtagRegex) || [];
    
    // Extract keywords (simple implementation)
    const words = content.toLowerCase().split(/\s+/)
      .filter(word => word.length > 3)
      .slice(0, 5);
    
    return [...hashtags.map(tag => tag.slice(1)), ...words];
  }
}

export const crossTabSyncService = new CrossTabSyncService();
