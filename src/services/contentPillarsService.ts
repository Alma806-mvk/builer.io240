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

export interface SavedContentPillar {
  id: string;
  pillarName: string;
  description: string;
  keywords: string[];
  contentTypes: string[];
  postingFrequency: string;
  engagementStrategy: string;
  createdAt: string;
  updatedAt: string;
  source?: string; // Strategy plan source
  userId: string;
}

export interface ContentPillarsData {
  pillars: SavedContentPillar[];
  lastUpdated: string;
}

class ContentPillarsService {
  private getContentPillarsCollection(userId: string) {
    return collection(db, 'users', userId, 'contentPillars');
  }

  private getContentPillarDoc(userId: string, pillarId: string) {
    return doc(db, 'users', userId, 'contentPillars', pillarId);
  }

  private getStorageKey(userId: string): string {
    return `content-pillars-${userId}`;
  }

  // Save content pillar to user's collection
  async saveContentPillar(userId: string, pillar: Omit<SavedContentPillar, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Promise<string> {
    try {
      const pillarId = Date.now().toString();
      const newPillar: SavedContentPillar = {
        ...pillar,
        id: pillarId,
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log('💾 Attempting to save content pillar:', newPillar);

      const pillarRef = this.getContentPillarDoc(userId, pillarId);
      await setDoc(pillarRef, newPillar);

      // Also save to localStorage for development
      this.saveToLocalStorage(newPillar);

      console.log('✅ Content pillar saved successfully');
      return pillarId;
    } catch (error: any) {
      // Suppress Firebase permission errors in development
      if (error?.code === 'permission-denied' || error?.message?.includes('permission') || error?.message?.includes('Missing or insufficient permissions')) {
        console.warn('Firebase not configured for production - saving to localStorage only');
      } else {
        console.error('Error saving content pillar to Firebase:', error);
      }

      // Fallback to localStorage
      const localPillar: SavedContentPillar = {
        ...pillar,
        id: Date.now().toString(),
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.saveToLocalStorage(localPillar);
      console.log('✅ Content pillar saved to localStorage');
      return localPillar.id;
    }
  }

  // Get all content pillars for user
  async getUserContentPillars(userId: string): Promise<SavedContentPillar[]> {
    try {
      const pillarsCollection = this.getContentPillarsCollection(userId);
      const q = query(pillarsCollection, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const pillars: SavedContentPillar[] = [];
      querySnapshot.forEach((doc) => {
        pillars.push(doc.data() as SavedContentPillar);
      });

      // Merge with localStorage pillars for development
      const localPillars = this.getLocalStoragePillars();
      const mergedPillars = this.mergePillars(pillars, localPillars);

      console.log('✅ Retrieved content pillars:', mergedPillars.length);
      return mergedPillars;
    } catch (error: any) {
      // Suppress Firebase permission errors in development
      if (error?.code === 'permission-denied' || error?.message?.includes('permission') || error?.message?.includes('Missing or insufficient permissions')) {
        console.warn('Firebase not configured for production - using localStorage fallback');
      } else {
        console.error('Error fetching content pillars from Firebase:', error);
      }

      // Fallback to localStorage
      return this.getLocalStoragePillars();
    }
  }

  // Delete content pillar
  async deleteContentPillar(userId: string, pillarId: string): Promise<void> {
    try {
      const pillarRef = this.getContentPillarDoc(userId, pillarId);
      await deleteDoc(pillarRef);

      // Also remove from localStorage
      this.removeFromLocalStorage(pillarId);
    } catch (error: any) {
      // Suppress Firebase permission errors in development
      if (error?.code === 'permission-denied' || error?.message?.includes('permission') || error?.message?.includes('Missing or insufficient permissions')) {
        console.warn('Firebase not configured for production - removing from localStorage only');
      } else {
        console.error('Error deleting content pillar:', error);
      }

      // Fallback to localStorage
      this.removeFromLocalStorage(pillarId);
    }
  }

  // Update content pillar
  async updateContentPillar(userId: string, pillarId: string, updates: Partial<SavedContentPillar>): Promise<void> {
    try {
      const pillarRef = this.getContentPillarDoc(userId, pillarId);
      const updateData = {
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(pillarRef, updateData);

      // Also update localStorage
      this.updateLocalStoragePillar(pillarId, updateData);
    } catch (error: any) {
      // Suppress Firebase permission errors in development
      if (error?.code === 'permission-denied' || error?.message?.includes('permission') || error?.message?.includes('Missing or insufficient permissions')) {
        console.warn('Firebase not configured for production - updating localStorage only');
      } else {
        console.error('Error updating content pillar:', error);
      }

      // Fallback to localStorage
      this.updateLocalStoragePillar(pillarId, updates);
    }
  }

  // localStorage fallback methods
  private saveToLocalStorage(pillar: SavedContentPillar): void {
    try {
      const existingPillars = this.getLocalStoragePillars();
      const updatedPillars = [...existingPillars, pillar];
      localStorage.setItem('studioHub:contentPillars', JSON.stringify(updatedPillars));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  private getLocalStoragePillars(): SavedContentPillar[] {
    try {
      const stored = localStorage.getItem('studioHub:contentPillars');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  }

  private updateLocalStoragePillar(pillarId: string, updates: Partial<SavedContentPillar>): void {
    try {
      const pillars = this.getLocalStoragePillars();
      const updatedPillars = pillars.map(pillar =>
        pillar.id === pillarId ? { ...pillar, ...updates } : pillar
      );
      localStorage.setItem('studioHub:contentPillars', JSON.stringify(updatedPillars));
    } catch (error) {
      console.error('Error updating localStorage pillar:', error);
    }
  }

  private removeFromLocalStorage(pillarId: string): void {
    try {
      const pillars = this.getLocalStoragePillars();
      const filteredPillars = pillars.filter(pillar => pillar.id !== pillarId);
      localStorage.setItem('studioHub:contentPillars', JSON.stringify(filteredPillars));
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }

  private mergePillars(firebasePillars: SavedContentPillar[], localPillars: SavedContentPillar[]): SavedContentPillar[] {
    const merged = [...firebasePillars];

    // Add local pillars that don't exist in Firebase
    localPillars.forEach(localPillar => {
      if (!merged.find(pillar => pillar.id === localPillar.id)) {
        merged.push(localPillar);
      }
    });

    // Sort by creation date (newest first)
    return merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Copy pillar text to clipboard
  async copyPillarText(pillar: any): Promise<void> {
    const text = `# ${pillar.pillarName}

${pillar.description}

**Keywords:** ${pillar.keywords.join(', ')}
**Content Types:** ${pillar.contentTypes.join(', ')}
**Posting Frequency:** ${pillar.postingFrequency}
**Engagement Strategy:** ${pillar.engagementStrategy}`;

    try {
      await navigator.clipboard.writeText(text);
      return Promise.resolve();
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return Promise.resolve();
    }
  }
}

export const contentPillarsService = new ContentPillarsService();
