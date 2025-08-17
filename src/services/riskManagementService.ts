import { db } from '../config/firebase';
import { collection, doc, addDoc, getDocs, deleteDoc, updateDoc, query, orderBy, onSnapshot, where } from 'firebase/firestore';

export interface RiskManagementItem {
  id: string;
  name: string;
  content: string;
  type: 'Content Backups' | 'Crisis Management' | 'Platform Changes' | 'Burnout Prevention';
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  priority?: 'low' | 'medium' | 'high' | 'critical';
  status?: 'draft' | 'active' | 'archived';
}

export interface LocalRiskManagementItem {
  id: string;
  name: string;
  content: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  priority?: string;
  status?: string;
}

class RiskManagementService {
  private readonly COLLECTION_NAME = 'riskManagementPlans';
  private readonly LOCAL_STORAGE_KEY = 'riskManagementItems';

  // Save risk management item to Firebase
  async saveRiskManagementItem(userId: string, itemData: Omit<RiskManagementItem, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized');
      }

      const newItem: Omit<RiskManagementItem, 'id'> = {
        ...itemData,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: itemData.status || 'active',
        priority: itemData.priority || 'medium'
      };

      const docRef = await addDoc(collection(db, this.COLLECTION_NAME), newItem);
      
      // Also save to local storage as backup
      this.saveToLocalStorage(itemData.name, itemData.content, itemData.type);
      
      console.log('✅ Risk Management item saved to Firebase with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.warn('⚠️ Firebase save failed, saving to local storage only:', error);
      return this.saveToLocalStorage(itemData.name, itemData.content, itemData.type);
    }
  }

  // Save to local storage as fallback
  private saveToLocalStorage(name: string, content: string, type: string): string {
    const id = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const item: LocalRiskManagementItem = {
      id,
      name,
      content,
      type,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active',
      priority: 'medium'
    };

    const existingItems = this.getLocalStorageItems();
    existingItems.push(item);
    localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(existingItems));
    
    console.log('✅ Risk Management item saved to local storage with ID:', id);
    return id;
  }

  // Get items from local storage
  private getLocalStorageItems(): LocalRiskManagementItem[] {
    try {
      const items = localStorage.getItem(this.LOCAL_STORAGE_KEY);
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error('Error reading from local storage:', error);
      return [];
    }
  }

  // Get all risk management items for a user
  async getRiskManagementItems(userId: string): Promise<RiskManagementItem[]> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized');
      }

      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const firebaseItems: RiskManagementItem[] = [];
      
      querySnapshot.forEach((doc) => {
        firebaseItems.push({
          id: doc.id,
          ...doc.data()
        } as RiskManagementItem);
      });

      console.log(`✅ Retrieved ${firebaseItems.length} risk management items from Firebase`);
      return firebaseItems;
    } catch (error) {
      console.warn('⚠️ Firebase fetch failed, using local storage:', error);
      return this.getLocalStorageItemsAsRiskItems();
    }
  }

  // Convert local storage items to RiskManagementItem format
  private getLocalStorageItemsAsRiskItems(): RiskManagementItem[] {
    const localItems = this.getLocalStorageItems();
    return localItems.map(item => ({
      id: item.id,
      name: item.name,
      content: item.content,
      type: item.type as RiskManagementItem['type'],
      userId: 'local',
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
      tags: item.tags,
      priority: item.priority as RiskManagementItem['priority'],
      status: item.status as RiskManagementItem['status']
    }));
  }

  // Delete risk management item
  async deleteRiskManagementItem(itemId: string, userId: string): Promise<void> {
    try {
      if (itemId.startsWith('local_')) {
        // Delete from local storage
        const items = this.getLocalStorageItems();
        const filteredItems = items.filter(item => item.id !== itemId);
        localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(filteredItems));
        console.log('✅ Risk Management item deleted from local storage');
        return;
      }

      if (!db) {
        throw new Error('Firebase not initialized');
      }

      await deleteDoc(doc(db, this.COLLECTION_NAME, itemId));
      console.log('✅ Risk Management item deleted from Firebase');
    } catch (error) {
      console.error('❌ Error deleting risk management item:', error);
      throw error;
    }
  }

  // Update risk management item
  async updateRiskManagementItem(itemId: string, userId: string, updates: Partial<RiskManagementItem>): Promise<void> {
    try {
      if (itemId.startsWith('local_')) {
        // Update in local storage
        const items = this.getLocalStorageItems();
        const itemIndex = items.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
          items[itemIndex] = {
            ...items[itemIndex],
            ...updates,
            updatedAt: new Date().toISOString()
          };
          localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(items));
          console.log('✅ Risk Management item updated in local storage');
        }
        return;
      }

      if (!db) {
        throw new Error('Firebase not initialized');
      }

      const updateData = {
        ...updates,
        updatedAt: new Date()
      };

      await updateDoc(doc(db, this.COLLECTION_NAME, itemId), updateData);
      console.log('✅ Risk Management item updated in Firebase');
    } catch (error) {
      console.error('❌ Error updating risk management item:', error);
      throw error;
    }
  }

  // Listen to real-time updates (Firebase only)
  subscribeToRiskManagementItems(userId: string, callback: (items: RiskManagementItem[]) => void): () => void {
    try {
      if (!db) {
        // Fallback to local storage
        const localItems = this.getLocalStorageItemsAsRiskItems();
        callback(localItems);
        return () => {}; // No cleanup needed for local storage
      }

      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      return onSnapshot(q, (querySnapshot) => {
        const items: RiskManagementItem[] = [];
        querySnapshot.forEach((doc) => {
          items.push({
            id: doc.id,
            ...doc.data()
          } as RiskManagementItem);
        });
        callback(items);
      });
    } catch (error) {
      console.warn('⚠️ Firebase subscription failed, using local storage:', error);
      const localItems = this.getLocalStorageItemsAsRiskItems();
      callback(localItems);
      return () => {};
    }
  }

  // Get items by type
  async getRiskManagementItemsByType(userId: string, type: RiskManagementItem['type']): Promise<RiskManagementItem[]> {
    const allItems = await this.getRiskManagementItems(userId);
    return allItems.filter(item => item.type === type);
  }

  // Clear all local storage items (for development/testing)
  clearLocalStorage(): void {
    localStorage.removeItem(this.LOCAL_STORAGE_KEY);
    console.log('🧹 Local risk management storage cleared');
  }
}

export const riskManagementService = new RiskManagementService();
