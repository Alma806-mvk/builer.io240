import { auth, db } from '../config/firebase';
import { collection, doc, addDoc, getDocs, deleteDoc, updateDoc, query, orderBy, onSnapshot } from 'firebase/firestore';

export interface PlatformStrategy {
  id: string;
  platform: string;
  strategy: any;
  savedAt: Date;
  sourceStrategyId?: string;
  userId: string;
  createdAt: string;
}

export interface SavedPlatformStrategy {
  id: string;
  platform: string;
  focus: string;
  contentTypes: string[];
  postingFrequency: string;
  bestTimes: string[];
  engagementStrategy: string;
  monetizationApproach: string;
  keyMetrics: string[];
  audienceTargeting: string;
  contentMix: any;
  source: string;
  savedAt: Date;
  userId: string;
  createdAt: string;
  group?: string;
  tags?: string[];
}

class PlatformStrategiesService {
  async savePlatformStrategy(userId: string, strategyData: any): Promise<string> {
    try {
      console.log('💾 Saving platform strategy for user:', userId);
      console.log('📊 Strategy data:', strategyData);

      const platformStrategy: Omit<SavedPlatformStrategy, 'id'> = {
        platform: strategyData.platform || 'Multi-platform',
        focus: strategyData.focus || 'Not specified',
        contentTypes: strategyData.contentTypes || [],
        postingFrequency: strategyData.postingFrequency || 'Not specified',
        bestTimes: strategyData.bestTimes || [],
        engagementStrategy: strategyData.engagementStrategy || 'Not specified',
        monetizationApproach: strategyData.monetizationApproach || 'Not specified',
        keyMetrics: strategyData.keyMetrics || [],
        audienceTargeting: strategyData.audienceTargeting || 'Not specified',
        contentMix: strategyData.contentMix || {},
        source: strategyData.source || 'content-strategy-planner',
        savedAt: new Date(),
        userId,
        createdAt: new Date().toISOString(),
        group: strategyData.group || 'Ungrouped',
        tags: strategyData.tags || []
      };

      // Try Firebase first
      try {
        const docRef = await addDoc(collection(db, 'platformStrategies'), platformStrategy);
        console.log('✅ Platform strategy saved to Firebase with ID:', docRef.id);
        
        // Also save to localStorage as backup
        this.saveToLocalStorage(userId, { ...platformStrategy, id: docRef.id });
        
        return docRef.id;
      } catch (firebaseError) {
        console.warn('⚠️ Firebase save failed, using localStorage:', firebaseError);
        return this.saveToLocalStorageOnly(userId, platformStrategy);
      }
    } catch (error) {
      console.error('❌ Failed to save platform strategy:', error);
      throw error;
    }
  }

  async getUserPlatformStrategies(userId: string): Promise<SavedPlatformStrategy[]> {
    try {
      console.log('📖 Loading platform strategies for user:', userId);

      // Try Firebase first
      try {
        const q = query(
          collection(db, 'platformStrategies'),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const firebaseStrategies: SavedPlatformStrategy[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.userId === userId) {
            firebaseStrategies.push({
              id: doc.id,
              ...data,
              savedAt: data.savedAt?.toDate?.() || new Date(data.savedAt),
            } as SavedPlatformStrategy);
          }
        });

        console.log('✅ Loaded platform strategies from Firebase:', firebaseStrategies.length);
        return firebaseStrategies;
      } catch (firebaseError) {
        console.warn('⚠️ Firebase load failed, using localStorage:', firebaseError);
        return this.getFromLocalStorage(userId);
      }
    } catch (error) {
      console.error('❌ Failed to load platform strategies:', error);
      return [];
    }
  }

  async deletePlatformStrategy(userId: string, strategyId: string): Promise<void> {
    try {
      // Try Firebase first
      try {
        await deleteDoc(doc(db, 'platformStrategies', strategyId));
        console.log('✅ Platform strategy deleted from Firebase');
      } catch (firebaseError) {
        console.warn('⚠️ Firebase delete failed:', firebaseError);
      }

      // Also remove from localStorage
      this.removeFromLocalStorage(userId, strategyId);
    } catch (error) {
      console.error('❌ Failed to delete platform strategy:', error);
      throw error;
    }
  }

  async copyStrategyText(strategy: SavedPlatformStrategy): Promise<void> {
    try {
      const strategyText = this.formatStrategyForCopy(strategy);
      await navigator.clipboard.writeText(strategyText);
      console.log('✅ Platform strategy text copied to clipboard');
    } catch (error) {
      console.error('❌ Failed to copy strategy text:', error);
      throw new Error('Failed to copy text to clipboard');
    }
  }

  private formatStrategyForCopy(strategy: SavedPlatformStrategy): string {
    return `# ${strategy.platform} Strategy

**Focus:** ${strategy.focus}

**Content Types:** ${strategy.contentTypes.join(', ')}

**Posting Frequency:** ${strategy.postingFrequency}

**Best Times:** ${strategy.bestTimes.join(', ')}

**Engagement Strategy:** ${strategy.engagementStrategy}

**Monetization Approach:** ${strategy.monetizationApproach}

**Key Metrics:** ${strategy.keyMetrics.join(', ')}

**Audience Targeting:** ${strategy.audienceTargeting}

**Source:** ${strategy.source}
**Saved:** ${strategy.savedAt.toLocaleDateString()}`;
  }

  private saveToLocalStorage(userId: string, strategy: SavedPlatformStrategy): void {
    try {
      const key = `platformStrategies_${userId}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      const updated = [...existing, strategy];
      localStorage.setItem(key, JSON.stringify(updated));
      console.log('💾 Platform strategy saved to localStorage');
    } catch (error) {
      console.error('❌ Failed to save to localStorage:', error);
    }
  }

  private saveToLocalStorageOnly(userId: string, strategy: Omit<SavedPlatformStrategy, 'id'>): string {
    const id = Date.now().toString();
    const strategyWithId = { ...strategy, id };
    this.saveToLocalStorage(userId, strategyWithId);
    return id;
  }

  private getFromLocalStorage(userId: string): SavedPlatformStrategy[] {
    try {
      const key = `platformStrategies_${userId}`;
      const stored = localStorage.getItem(key);
      if (!stored) return [];

      const strategies = JSON.parse(stored);
      return strategies.map((strategy: any) => ({
        ...strategy,
        savedAt: new Date(strategy.savedAt),
      }));
    } catch (error) {
      console.error('❌ Failed to load from localStorage:', error);
      return [];
    }
  }

  private removeFromLocalStorage(userId: string, strategyId: string): void {
    try {
      const key = `platformStrategies_${userId}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      const updated = existing.filter((strategy: SavedPlatformStrategy) => strategy.id !== strategyId);
      localStorage.setItem(key, JSON.stringify(updated));
      console.log('🗑️ Platform strategy removed from localStorage');
    } catch (error) {
      console.error('❌ Failed to remove from localStorage:', error);
    }
  }

  async updateStrategyGroup(strategyId: string, userId: string, group: string): Promise<void> {
    try {
      // Try Firebase first
      const strategyDoc = doc(db, 'platformStrategies', strategyId);
      await updateDoc(strategyDoc, { group });
      console.log('✅ Platform strategy group updated in Firebase');
    } catch (error) {
      console.warn('⚠️ Firebase update failed, updating localStorage only:', error);

      // Update localStorage
      try {
        const key = `platformStrategies_${userId}`;
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        const updated = existing.map((strategy: SavedPlatformStrategy) =>
          strategy.id === strategyId ? { ...strategy, group } : strategy
        );
        localStorage.setItem(key, JSON.stringify(updated));
        console.log('💾 Platform strategy group updated in localStorage');
      } catch (localError) {
        console.error('❌ Failed to update group in localStorage:', localError);
        throw localError;
      }
    }
  }

  async getUserPlatformStrategiesByGroup(userId: string, group?: string): Promise<SavedPlatformStrategy[]> {
    try {
      const strategies = await this.getUserPlatformStrategies(userId);
      if (!group || group === 'All') {
        return strategies;
      }
      return strategies.filter(strategy => strategy.group === group);
    } catch (error) {
      console.error('❌ Failed to get platform strategies by group:', error);
      return [];
    }
  }
}

export const platformStrategiesService = new PlatformStrategiesService();
