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

export interface SavedAnalyticsMetric {
  id: string;
  title: string;
  description: string;
  type: 'primary' | 'advanced';
  category: string;
  value?: string | number;
  target?: string | number;
  createdAt: string;
  updatedAt: string;
  source?: string; // Strategy plan source
  userId: string;
  group?: string;
  tags?: string[];
}

export interface AnalyticsData {
  metrics: SavedAnalyticsMetric[];
  lastUpdated: string;
}

class AnalyticsService {
  private getAnalyticsCollection(userId: string) {
    return collection(db, 'users', userId, 'analytics');
  }

  private getAnalyticsDoc(userId: string, metricId: string) {
    return doc(db, 'users', userId, 'analytics', metricId);
  }

  private getStorageKey(userId: string): string {
    return `analytics-metrics-${userId}`;
  }

  // Save analytics metric to user's collection
  async saveAnalyticsMetric(userId: string, metric: Omit<SavedAnalyticsMetric, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Promise<string> {
    try {
      const metricId = Date.now().toString();
      const newMetric: SavedAnalyticsMetric = {
        ...metric,
        id: metricId,
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Try Firebase first
      try {
        const metricDocRef = this.getAnalyticsDoc(userId, metricId);
        await setDoc(metricDocRef, newMetric);
        console.log('✅ Analytics metric saved to Firebase:', metricId);
      } catch (firebaseError) {
        console.warn('⚠️ Firebase save failed, using localStorage fallback:', firebaseError);
        // Fallback to localStorage
        this.saveToLocalStorage(userId, newMetric);
      }

      return metricId;
    } catch (error) {
      console.error('❌ Error saving analytics metric:', error);
      throw error;
    }
  }

  // Get all analytics metrics for user
  async getAnalyticsMetrics(userId: string): Promise<SavedAnalyticsMetric[]> {
    try {
      // Try Firebase first
      try {
        const analyticsCol = this.getAnalyticsCollection(userId);
        const q = query(analyticsCol, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const metrics: SavedAnalyticsMetric[] = [];
        querySnapshot.forEach((doc) => {
          metrics.push(doc.data() as SavedAnalyticsMetric);
        });

        console.log('✅ Retrieved analytics metrics from Firebase:', metrics.length);
        return metrics;
      } catch (firebaseError) {
        console.warn('⚠️ Firebase get failed, using localStorage fallback:', firebaseError);
        // Fallback to localStorage
        return this.getFromLocalStorage(userId);
      }
    } catch (error) {
      console.error('❌ Error retrieving analytics metrics:', error);
      return [];
    }
  }

  // Update analytics metric
  async updateAnalyticsMetric(userId: string, metricId: string, updates: Partial<SavedAnalyticsMetric>): Promise<void> {
    try {
      const updatedData = {
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      // Try Firebase first
      try {
        const metricDocRef = this.getAnalyticsDoc(userId, metricId);
        await updateDoc(metricDocRef, updatedData);
        console.log('✅ Analytics metric updated in Firebase:', metricId);
      } catch (firebaseError) {
        console.warn('⚠️ Firebase update failed, using localStorage fallback:', firebaseError);
        // Fallback to localStorage
        this.updateInLocalStorage(userId, metricId, updatedData);
      }
    } catch (error) {
      console.error('❌ Error updating analytics metric:', error);
      throw error;
    }
  }

  // Delete analytics metric
  async deleteAnalyticsMetric(userId: string, metricId: string): Promise<void> {
    try {
      // Try Firebase first
      try {
        const metricDocRef = this.getAnalyticsDoc(userId, metricId);
        await deleteDoc(metricDocRef);
        console.log('✅ Analytics metric deleted from Firebase:', metricId);
      } catch (firebaseError) {
        console.warn('⚠️ Firebase delete failed, using localStorage fallback:', firebaseError);
        // Fallback to localStorage
        this.deleteFromLocalStorage(userId, metricId);
      }
    } catch (error) {
      console.error('❌ Error deleting analytics metric:', error);
      throw error;
    }
  }

  // Get single analytics metric
  async getAnalyticsMetric(userId: string, metricId: string): Promise<SavedAnalyticsMetric | null> {
    try {
      // Try Firebase first
      try {
        const metricDocRef = this.getAnalyticsDoc(userId, metricId);
        const docSnap = await getDoc(metricDocRef);
        
        if (docSnap.exists()) {
          console.log('✅ Retrieved analytics metric from Firebase:', metricId);
          return docSnap.data() as SavedAnalyticsMetric;
        }
        return null;
      } catch (firebaseError) {
        console.warn('⚠️ Firebase get failed, using localStorage fallback:', firebaseError);
        // Fallback to localStorage
        const metrics = this.getFromLocalStorage(userId);
        return metrics.find(metric => metric.id === metricId) || null;
      }
    } catch (error) {
      console.error('❌ Error retrieving analytics metric:', error);
      return null;
    }
  }

  // LocalStorage fallback methods
  private saveToLocalStorage(userId: string, metric: SavedAnalyticsMetric): void {
    try {
      const storageKey = this.getStorageKey(userId);
      const existingData = localStorage.getItem(storageKey);
      const analytics: SavedAnalyticsMetric[] = existingData ? JSON.parse(existingData) : [];
      
      analytics.push(metric);
      localStorage.setItem(storageKey, JSON.stringify(analytics));
      console.log('✅ Analytics metric saved to localStorage');
    } catch (error) {
      console.error('❌ Error saving to localStorage:', error);
    }
  }

  private getFromLocalStorage(userId: string): SavedAnalyticsMetric[] {
    try {
      const storageKey = this.getStorageKey(userId);
      const data = localStorage.getItem(storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('❌ Error reading from localStorage:', error);
      return [];
    }
  }

  private updateInLocalStorage(userId: string, metricId: string, updates: Partial<SavedAnalyticsMetric>): void {
    try {
      const storageKey = this.getStorageKey(userId);
      const existingData = localStorage.getItem(storageKey);
      const analytics: SavedAnalyticsMetric[] = existingData ? JSON.parse(existingData) : [];
      
      const index = analytics.findIndex(metric => metric.id === metricId);
      if (index !== -1) {
        analytics[index] = { ...analytics[index], ...updates };
        localStorage.setItem(storageKey, JSON.stringify(analytics));
        console.log('✅ Analytics metric updated in localStorage');
      }
    } catch (error) {
      console.error('❌ Error updating localStorage:', error);
    }
  }

  private deleteFromLocalStorage(userId: string, metricId: string): void {
    try {
      const storageKey = this.getStorageKey(userId);
      const existingData = localStorage.getItem(storageKey);
      const analytics: SavedAnalyticsMetric[] = existingData ? JSON.parse(existingData) : [];
      
      const filtered = analytics.filter(metric => metric.id !== metricId);
      localStorage.setItem(storageKey, JSON.stringify(filtered));
      console.log('✅ Analytics metric deleted from localStorage');
    } catch (error) {
      console.error('❌ Error deleting from localStorage:', error);
    }
  }

  // Bulk operations for analytics data
  async saveAnalyticsData(userId: string, analytics: AnalyticsData): Promise<void> {
    try {
      // Save each metric individually
      for (const metric of analytics.metrics) {
        await this.saveAnalyticsMetric(userId, metric);
      }
      console.log('✅ Bulk analytics data saved successfully');
    } catch (error) {
      console.error('❌ Error saving bulk analytics data:', error);
      throw error;
    }
  }

  // Clear all analytics metrics for user
  async clearAnalyticsData(userId: string): Promise<void> {
    try {
      const metrics = await this.getAnalyticsMetrics(userId);
      for (const metric of metrics) {
        await this.deleteAnalyticsMetric(userId, metric.id);
      }
      
      // Also clear localStorage
      const storageKey = this.getStorageKey(userId);
      localStorage.removeItem(storageKey);
      
      console.log('✅ All analytics data cleared');
    } catch (error) {
      console.error('❌ Error clearing analytics data:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService();
export default analyticsService;
