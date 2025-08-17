import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface SavedMonetizationItem {
  id: string;
  title: string;
  description: string;
  type: 'revenue-stream' | 'pricing-strategy' | 'conversion-funnel';
  category: string;
  createdAt: string;
  updatedAt: string;
  source?: string;
  userId: string;
}

export interface MonetizationData {
  items: SavedMonetizationItem[];
  lastUpdated: string;
}

class MonetizationService {
  private getMonetizationCollection(userId: string) {
    return collection(db, 'users', userId, 'monetization');
  }

  private getMonetizationDoc(userId: string, itemId: string) {
    return doc(db, 'users', userId, 'monetization', itemId);
  }

  private getStorageKey(userId: string, type: string): string {
    return `monetization-${type}-${userId}`;
  }

  // Save monetization item to user's collection
  async saveMonetizationItem(userId: string, item: Omit<SavedMonetizationItem, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Promise<string> {
    try {
      const itemId = Date.now().toString();
      const newItem: SavedMonetizationItem = {
        ...item,
        id: itemId,
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Try Firebase first
      try {
        const itemDocRef = this.getMonetizationDoc(userId, itemId);
        await setDoc(itemDocRef, newItem);
        console.log('✅ Monetization item saved to Firebase:', itemId);
      } catch (firebaseError) {
        console.warn('⚠️ Firebase save failed, using localStorage fallback:', firebaseError);
        // Fallback to localStorage
        this.saveToLocalStorage(userId, newItem);
      }

      return itemId;
    } catch (error) {
      console.error('❌ Error saving monetization item:', error);
      throw error;
    }
  }

  // Get all monetization items for user
  async getMonetizationItems(userId: string): Promise<SavedMonetizationItem[]> {
    try {
      // Try Firebase first
      try {
        const monetizationCol = this.getMonetizationCollection(userId);
        const q = query(monetizationCol, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const items: SavedMonetizationItem[] = [];
        querySnapshot.forEach((doc) => {
          items.push(doc.data() as SavedMonetizationItem);
        });

        console.log('✅ Retrieved monetization items from Firebase:', items.length);
        return items;
      } catch (firebaseError) {
        console.warn('⚠️ Firebase get failed, using localStorage fallback:', firebaseError);
        // Fallback to localStorage
        return this.getFromLocalStorage(userId);
      }
    } catch (error) {
      console.error('❌ Error retrieving monetization items:', error);
      return [];
    }
  }

  // Get monetization items by type
  async getMonetizationItemsByType(userId: string, type: 'revenue-stream' | 'pricing-strategy' | 'conversion-funnel'): Promise<SavedMonetizationItem[]> {
    try {
      const allItems = await this.getMonetizationItems(userId);
      return allItems.filter(item => item.type === type);
    } catch (error) {
      console.error('❌ Error retrieving monetization items by type:', error);
      return [];
    }
  }

  // Update monetization item
  async updateMonetizationItem(userId: string, itemId: string, updates: Partial<SavedMonetizationItem>): Promise<void> {
    try {
      const updatedData = {
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      // Try Firebase first
      try {
        const itemDocRef = this.getMonetizationDoc(userId, itemId);
        await updateDoc(itemDocRef, updatedData);
        console.log('✅ Monetization item updated in Firebase:', itemId);
      } catch (firebaseError) {
        console.warn('⚠️ Firebase update failed, using localStorage fallback:', firebaseError);
        // Fallback to localStorage
        this.updateInLocalStorage(userId, itemId, updatedData);
      }
    } catch (error) {
      console.error('❌ Error updating monetization item:', error);
      throw error;
    }
  }

  // Delete monetization item
  async deleteMonetizationItem(userId: string, itemId: string): Promise<void> {
    try {
      // Try Firebase first
      try {
        const itemDocRef = this.getMonetizationDoc(userId, itemId);
        await deleteDoc(itemDocRef);
        console.log('✅ Monetization item deleted from Firebase:', itemId);
      } catch (firebaseError) {
        console.warn('⚠️ Firebase delete failed, using localStorage fallback:', firebaseError);
        // Fallback to localStorage
        this.deleteFromLocalStorage(userId, itemId);
      }
    } catch (error) {
      console.error('❌ Error deleting monetization item:', error);
      throw error;
    }
  }

  // Get single monetization item
  async getMonetizationItem(userId: string, itemId: string): Promise<SavedMonetizationItem | null> {
    try {
      // Try Firebase first
      try {
        const itemDocRef = this.getMonetizationDoc(userId, itemId);
        const docSnap = await getDoc(itemDocRef);
        
        if (docSnap.exists()) {
          console.log('✅ Retrieved monetization item from Firebase:', itemId);
          return docSnap.data() as SavedMonetizationItem;
        }
        return null;
      } catch (firebaseError) {
        console.warn('⚠️ Firebase get failed, using localStorage fallback:', firebaseError);
        // Fallback to localStorage
        const items = this.getFromLocalStorage(userId);
        return items.find(item => item.id === itemId) || null;
      }
    } catch (error) {
      console.error('❌ Error retrieving monetization item:', error);
      return null;
    }
  }

  // LocalStorage fallback methods
  private saveToLocalStorage(userId: string, item: SavedMonetizationItem): void {
    try {
      const storageKey = this.getStorageKey(userId, 'all');
      const existingData = localStorage.getItem(storageKey);
      const items: SavedMonetizationItem[] = existingData ? JSON.parse(existingData) : [];
      
      items.push(item);
      localStorage.setItem(storageKey, JSON.stringify(items));
      console.log('✅ Monetization item saved to localStorage');
    } catch (error) {
      console.error('❌ Error saving to localStorage:', error);
    }
  }

  private getFromLocalStorage(userId: string): SavedMonetizationItem[] {
    try {
      const storageKey = this.getStorageKey(userId, 'all');
      const data = localStorage.getItem(storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('❌ Error reading from localStorage:', error);
      return [];
    }
  }

  private updateInLocalStorage(userId: string, itemId: string, updates: Partial<SavedMonetizationItem>): void {
    try {
      const storageKey = this.getStorageKey(userId, 'all');
      const existingData = localStorage.getItem(storageKey);
      const items: SavedMonetizationItem[] = existingData ? JSON.parse(existingData) : [];
      
      const index = items.findIndex(item => item.id === itemId);
      if (index !== -1) {
        items[index] = { ...items[index], ...updates };
        localStorage.setItem(storageKey, JSON.stringify(items));
        console.log('✅ Monetization item updated in localStorage');
      }
    } catch (error) {
      console.error('❌ Error updating localStorage:', error);
    }
  }

  private deleteFromLocalStorage(userId: string, itemId: string): void {
    try {
      const storageKey = this.getStorageKey(userId, 'all');
      const existingData = localStorage.getItem(storageKey);
      const items: SavedMonetizationItem[] = existingData ? JSON.parse(existingData) : [];
      
      const filtered = items.filter(item => item.id !== itemId);
      localStorage.setItem(storageKey, JSON.stringify(filtered));
      console.log('✅ Monetization item deleted from localStorage');
    } catch (error) {
      console.error('❌ Error deleting from localStorage:', error);
    }
  }

  // Clear all monetization items for user
  async clearMonetizationData(userId: string): Promise<void> {
    try {
      const items = await this.getMonetizationItems(userId);
      for (const item of items) {
        await this.deleteMonetizationItem(userId, item.id);
      }
      
      // Also clear localStorage
      const storageKey = this.getStorageKey(userId, 'all');
      localStorage.removeItem(storageKey);
      
      console.log('✅ All monetization data cleared');
    } catch (error) {
      console.error('❌ Error clearing monetization data:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const monetizationService = new MonetizationService();
export default monetizationService;
