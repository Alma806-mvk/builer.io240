import { HistoryItem } from "../types";

export interface SmartFolder {
  id: string;
  name: string;
  description: string;
  color: string;
  rules: {
    keywords?: string[];
    platforms?: string[];
    contentTypes?: string[];
    tags?: string[];
    dateRange?: { start: Date; end: Date };
    performanceMin?: number;
  };
  autoOrganize: boolean;
  itemCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomCollection {
  id: string;
  name: string;
  description: string;
  color: string;
  items: string[]; // History item IDs
  campaign?: string;
  project?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
}

export interface DuplicateGroup {
  id: string;
  items: HistoryItem[];
  similarity: number;
  type: 'exact' | 'similar' | 'related';
  consolidationSuggestion?: {
    keepItem: string;
    reason: string;
    mergeContent?: boolean;
  };
}

export interface EnhancedHistoryItem extends HistoryItem {
  smartFolders: string[];
  collections: string[];
  duplicateGroupId?: string;
  aiTags: string[];
  similarityScore?: number;
  sentToCanvas?: boolean;
  canvasItemId?: string;
  analyticsData?: {
    views: number;
    engagement: number;
    performance: number;
    roi?: number;
    conversionRate?: number;
  };
  versions?: {
    id: string;
    content: string;
    timestamp: Date;
    changes: string[];
  }[];
}

class EnhancedHistoryService {
  private storageKey = 'creategen_enhanced_history';
  private foldersKey = 'creategen_smart_folders';
  private collectionsKey = 'creategen_custom_collections';
  private duplicatesKey = 'creategen_duplicate_groups';

  // Real-time sync listeners
  private listeners: Set<(data: EnhancedHistoryItem[]) => void> = new Set();

  constructor() {
    // Listen for storage changes from other tabs
    window.addEventListener('storage', this.handleStorageChange.bind(this));
  }

  // Enhanced History Data Management
  async getEnhancedHistory(): Promise<EnhancedHistoryItem[]> {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return [];

      const items = JSON.parse(stored);
      return items.map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp),
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(item.timestamp),
      }));
    } catch (error) {
      console.error('Error loading enhanced history:', error);
      return [];
    }
  }

  async addHistoryItem(item: HistoryItem): Promise<EnhancedHistoryItem> {
    try {
      // Validate input item
      if (!item) {
        throw new Error('Cannot add undefined item to history');
      }

      // Ensure item has required properties
      if (!item.id) {
        item.id = `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      }

      // Ensure content is defined
      if (item.content === undefined || item.content === null) {
        item.content = '';
        console.warn(`Item ${item.id} had undefined content, set to empty string`);
      }

      // Set default rating if not provided
      if (item.rating === undefined) {
        item.rating = 0;
      }

      // Check if item already exists to prevent duplicates
      const existingHistory = await this.getEnhancedHistory();
      const existingItem = existingHistory.find(existing => existing.id === item.id);

      if (existingItem) {
        console.log(`Item with ID ${item.id} already exists, skipping duplicate addition`);
        return existingItem;
      }

      const enhancedItem: EnhancedHistoryItem = {
        ...item,
        content: String(item.content || ''), // Ensure content is always a string
        rating: item.rating || 0, // Ensure rating is preserved
        smartFolders: [],
        collections: [],
        aiTags: await this.generateAITags(item),
        timestamp: new Date(item.timestamp || Date.now()),
        analyticsData: {
          views: item.views || 0,
          engagement: 0,
          performance: item.performance || 0,
        },
        versions: [{
          id: `v1_${Date.now()}`,
          content: String(item.content || ''),
          timestamp: new Date(),
          changes: ['Initial creation'],
        }],
      };

      // Auto-organize into smart folders
      await this.autoOrganizeItem(enhancedItem);

      // Check for duplicates
      await this.checkForDuplicates(enhancedItem);

      // Save to storage
      const history = await this.getEnhancedHistory();
      history.unshift(enhancedItem);

      await this.saveHistory(history);
      this.notifyListeners(history);

      return enhancedItem;
    } catch (error) {
      console.error('Error adding history item:', error);

      // Return a basic enhanced item even if there's an error
      const fallbackItem: EnhancedHistoryItem = {
        ...item,
        content: String(item?.content || ''),
        smartFolders: [],
        collections: [],
        aiTags: [],
        timestamp: new Date(item?.timestamp || Date.now()),
        analyticsData: {
          views: 0,
          engagement: 0,
          performance: 0,
        },
        versions: [],
      };
      return fallbackItem;
    }
  }

  async updateHistoryItem(id: string, updates: Partial<EnhancedHistoryItem>): Promise<void> {
    const history = await this.getEnhancedHistory();
    const index = history.findIndex(item => item.id === id);

    if (index !== -1) {
      history[index] = { ...history[index], ...updates };
      await this.saveHistory(history);
      this.notifyListeners(history);
    }
  }

  async updateRating(id: string, rating: 1 | -1 | 0): Promise<void> {
    try {
      const history = await this.getEnhancedHistory();
      const index = history.findIndex(item => item.id === id);

      if (index !== -1) {
        history[index] = { ...history[index], rating };
        await this.saveHistory(history);
        this.notifyListeners(history);
        console.log(`Updated rating for item ${id} to ${rating}`);
      } else {
        console.warn(`Item with id ${id} not found for rating update`);
      }
    } catch (error) {
      console.error('Error updating rating:', error);
    }
  }

  async deleteHistoryItem(id: string): Promise<void> {
    const history = await this.getEnhancedHistory();
    const filtered = history.filter(item => item.id !== id);
    await this.saveHistory(filtered);
    this.notifyListeners(filtered);
  }

  // Smart Folders Management
  async getSmartFolders(): Promise<SmartFolder[]> {
    try {
      const stored = localStorage.getItem(this.foldersKey);
      if (!stored) return this.createDefaultSmartFolders();

      const folders = JSON.parse(stored);
      return folders.map((folder: any) => ({
        ...folder,
        createdAt: new Date(folder.createdAt),
        updatedAt: new Date(folder.updatedAt),
      }));
    } catch (error) {
      console.error('Error loading smart folders:', error);
      return this.createDefaultSmartFolders();
    }
  }

  private async createDefaultSmartFolders(): Promise<SmartFolder[]> {
    const defaultFolders: SmartFolder[] = [
      {
        id: 'high-performance',
        name: '🚀 High Performance',
        description: 'Content with >80% performance score',
        color: '#10b981',
        rules: { performanceMin: 80 },
        autoOrganize: true,
        itemCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'video-content',
        name: '🎥 Video Content',
        description: 'All video-related content',
        color: '#f59e0b',
        rules: { contentTypes: ['video'] },
        autoOrganize: true,
        itemCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'recent-viral',
        name: '⭐ Recent Viral',
        description: 'Trending content from last 7 days',
        color: '#ef4444',
        rules: {
          keywords: ['viral', 'trending'],
          dateRange: {
            start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            end: new Date()
          }
        },
        autoOrganize: true,
        itemCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await this.saveSmartFolders(defaultFolders);
    return defaultFolders;
  }

  async createSmartFolder(folder: Omit<SmartFolder, 'id' | 'itemCount' | 'createdAt' | 'updatedAt'>): Promise<SmartFolder> {
    const newFolder: SmartFolder = {
      ...folder,
      id: `folder_${Date.now()}`,
      itemCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const folders = await this.getSmartFolders();
    folders.push(newFolder);
    await this.saveSmartFolders(folders);

    // Auto-organize existing items
    if (newFolder.autoOrganize) {
      await this.reorganizeAllItems();
    }

    return newFolder;
  }

  // Custom Collections Management
  async getCustomCollections(): Promise<CustomCollection[]> {
    try {
      const stored = localStorage.getItem(this.collectionsKey);
      if (!stored) return [];

      const collections = JSON.parse(stored);
      return collections.map((collection: any) => ({
        ...collection,
        createdAt: new Date(collection.createdAt),
        updatedAt: new Date(collection.updatedAt),
      }));
    } catch (error) {
      console.error('Error loading custom collections:', error);
      return [];
    }
  }

  async createCustomCollection(collection: Omit<CustomCollection, 'id' | 'createdAt' | 'updatedAt'>): Promise<CustomCollection> {
    const newCollection: CustomCollection = {
      ...collection,
      id: `collection_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const collections = await this.getCustomCollections();
    collections.push(newCollection);
    await this.saveCustomCollections(collections);

    return newCollection;
  }

  async addToCollection(collectionId: string, itemId: string): Promise<void> {
    const collections = await this.getCustomCollections();
    const collection = collections.find(c => c.id === collectionId);

    if (collection && !collection.items.includes(itemId)) {
      collection.items.push(itemId);
      collection.updatedAt = new Date();
      await this.saveCustomCollections(collections);
    }
  }

  // Duplicate Detection
  async checkForDuplicates(newItem: EnhancedHistoryItem): Promise<DuplicateGroup | null> {
    try {
      const history = await this.getEnhancedHistory();
      const duplicates: HistoryItem[] = [];

      // Ensure newItem has valid content
      if (!newItem || !newItem.content) {
        console.warn('checkForDuplicates: newItem or newItem.content is undefined');
        return null;
      }

      for (const item of history) {
        if (!item || item.id === newItem.id) continue;

        // Skip items without content
        if (!item.content) {
          continue;
        }

        const similarity = this.calculateContentSimilarity(newItem.content, item.content);

        if (similarity > 0.8) {
          duplicates.push(item);
        }
      }

      if (duplicates.length > 0) {
        const duplicateGroup: DuplicateGroup = {
          id: `dup_${Date.now()}`,
          items: [newItem, ...duplicates],
          similarity: Math.max(...duplicates.map(d => this.calculateContentSimilarity(newItem.content, d.content))),
          type: duplicates.some(d => d.content === newItem.content) ? 'exact' : 'similar',
          consolidationSuggestion: {
            keepItem: newItem.id,
            reason: 'Most recent version',
            mergeContent: true,
          },
        };

        await this.saveDuplicateGroup(duplicateGroup);
        return duplicateGroup;
      }

      return null;
    } catch (error) {
      console.error('Error checking for duplicates:', error);
      return null;
    }
  }

  // Canvas Integration
  async sendToCanvas(itemId: string, onSendToCanvas?: (item: EnhancedHistoryItem) => void): Promise<void> {
    const history = await this.getEnhancedHistory();
    const item = history.find(h => h.id === itemId);

    if (item) {
      // Mark as sent to canvas
      await this.updateHistoryItem(itemId, {
        sentToCanvas: true,
        canvasItemId: `canvas_${Date.now()}`,
      });

      // Call the callback to actually send to canvas
      if (onSendToCanvas) {
        onSendToCanvas(item);
      }
    }
  }

  // Real-time sync
  subscribe(listener: (data: EnhancedHistoryItem[]) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(data: EnhancedHistoryItem[]): void {
    this.listeners.forEach(listener => listener(data));
  }

  private handleStorageChange(event: StorageEvent): void {
    if (event.key === this.storageKey && event.newValue) {
      try {
        const data = JSON.parse(event.newValue);
        this.notifyListeners(data);
      } catch (error) {
        console.error('Error parsing storage change:', error);
      }
    }
  }

  // Helper methods
  private async generateAITags(item: HistoryItem): Promise<string[]> {
    try {
      // Simple keyword extraction for now - could be enhanced with AI
      const title = String(item?.title || '');
      const content = String(item?.content || '');
      const combinedContent = `${title} ${content}`.toLowerCase();

      if (!combinedContent.trim()) {
        return [];
      }

      const commonWords = ['and', 'or', 'but', 'the', 'a', 'an', 'to', 'for', 'of', 'with', 'by'];

      const words = combinedContent.split(/\s+/)
        .filter(word => word.length > 3 && !commonWords.includes(word))
        .slice(0, 10);

      return [...new Set(words)];
    } catch (error) {
      console.warn('Error generating AI tags:', error);
      return [];
    }
  }

  private async autoOrganizeItem(item: EnhancedHistoryItem): Promise<void> {
    const folders = await this.getSmartFolders();

    for (const folder of folders) {
      if (!folder.autoOrganize) continue;

      if (this.itemMatchesFolder(item, folder)) {
        item.smartFolders.push(folder.id);
      }
    }
  }

  private itemMatchesFolder(item: EnhancedHistoryItem, folder: SmartFolder): boolean {
    const rules = folder.rules;

    if (rules.performanceMin && (item.analyticsData?.performance || 0) < rules.performanceMin) {
      return false;
    }

    if (rules.contentTypes && !rules.contentTypes.includes(item.type)) {
      return false;
    }

    if (rules.platforms && !rules.platforms.includes(item.platform)) {
      return false;
    }

    if (rules.keywords) {
      const content = `${item.title} ${item.content}`.toLowerCase();
      const hasKeyword = rules.keywords.some(keyword => content.includes(keyword.toLowerCase()));
      if (!hasKeyword) return false;
    }

    if (rules.dateRange) {
      const itemDate = new Date(item.timestamp);
      if (itemDate < rules.dateRange.start || itemDate > rules.dateRange.end) {
        return false;
      }
    }

    return true;
  }

  private calculateContentSimilarity(content1: string, content2: string): number {
    // Handle undefined or null content
    if (!content1 || !content2) {
      return 0;
    }

    // Ensure both are strings
    const str1 = String(content1);
    const str2 = String(content2);

    // Handle empty strings
    if (str1.trim().length === 0 || str2.trim().length === 0) {
      return 0;
    }

    try {
      const words1 = new Set(str1.toLowerCase().split(/\s+/));
      const words2 = new Set(str2.toLowerCase().split(/\s+/));

      const intersection = new Set([...words1].filter(x => words2.has(x)));
      const union = new Set([...words1, ...words2]);

      // Avoid division by zero
      if (union.size === 0) {
        return 0;
      }

      return intersection.size / union.size;
    } catch (error) {
      console.warn('Error calculating content similarity:', error);
      return 0;
    }
  }

  private async reorganizeAllItems(): Promise<void> {
    const history = await this.getEnhancedHistory();

    for (const item of history) {
      item.smartFolders = [];
      await this.autoOrganizeItem(item);
    }

    await this.saveHistory(history);
  }

  // Storage helpers
  private async saveHistory(history: EnhancedHistoryItem[]): Promise<void> {
    localStorage.setItem(this.storageKey, JSON.stringify(history));
  }

  private async saveSmartFolders(folders: SmartFolder[]): Promise<void> {
    localStorage.setItem(this.foldersKey, JSON.stringify(folders));
  }

  private async saveCustomCollections(collections: CustomCollection[]): Promise<void> {
    localStorage.setItem(this.collectionsKey, JSON.stringify(collections));
  }

  private async saveDuplicateGroup(group: DuplicateGroup): Promise<void> {
    const stored = localStorage.getItem(this.duplicatesKey);
    const groups = stored ? JSON.parse(stored) : [];
    groups.push(group);
    localStorage.setItem(this.duplicatesKey, JSON.stringify(groups));
  }
}

export const enhancedHistoryService = new EnhancedHistoryService();
