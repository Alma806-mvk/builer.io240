import { auth, db } from '../config/firebase';
import { collection, doc, addDoc, getDocs, deleteDoc, updateDoc, query, orderBy, onSnapshot } from 'firebase/firestore';

export interface SavedCampaign {
  id: string;
  campaignType: 'launch' | 'seasonal' | 'engagement' | 'growth';
  campaignData: any;
  savedAt: Date;
  status: 'planned' | 'active' | 'completed' | 'paused';
  userId: string;
  createdAt: string;
}

export interface SavedCampaignStrategy {
  id: string;
  campaignName: string;
  campaignType: string;
  objective: string;
  targetAudience: string;
  timeline: string;
  platforms: string[];
  contentTypes: string[];
  keyMessages: string[];
  callsToAction: string[];
  successMetrics: string[];
  budget: string;
  launchStrategy: string;
  engagementTactics: string[];
  source: string;
  savedAt: Date;
  userId: string;
  createdAt: string;
  status: 'planned' | 'active' | 'completed' | 'paused';
}

class CampaignStrategiesService {
  async saveCampaignStrategy(userId: string, strategyData: any): Promise<string> {
    try {
      console.log('💾 Saving campaign strategy for user:', userId);
      console.log('📊 Strategy data:', strategyData);

      const campaignStrategy: Omit<SavedCampaignStrategy, 'id'> = {
        campaignName: strategyData.campaignName || 'Untitled Campaign',
        campaignType: strategyData.campaignType || 'general',
        objective: strategyData.objective || 'Not specified',
        targetAudience: strategyData.targetAudience || 'Not specified',
        timeline: strategyData.timeline || 'Not specified',
        platforms: strategyData.platforms || [],
        contentTypes: strategyData.contentTypes || [],
        keyMessages: strategyData.keyMessages || [],
        callsToAction: strategyData.callsToAction || [],
        successMetrics: strategyData.successMetrics || [],
        budget: strategyData.budget || 'Not specified',
        launchStrategy: strategyData.launchStrategy || 'Not specified',
        engagementTactics: strategyData.engagementTactics || [],
        source: strategyData.source || 'content-strategy-planner',
        savedAt: new Date(),
        userId,
        createdAt: new Date().toISOString(),
        status: strategyData.status || 'planned'
      };

      // Try Firebase first
      try {
        const docRef = await addDoc(collection(db, 'campaignStrategies'), campaignStrategy);
        console.log('✅ Campaign strategy saved to Firebase with ID:', docRef.id);
        
        // Also save to localStorage as backup
        this.saveToLocalStorage(userId, { ...campaignStrategy, id: docRef.id });
        
        return docRef.id;
      } catch (firebaseError) {
        console.warn('⚠️ Firebase save failed, using localStorage:', firebaseError);
        return this.saveToLocalStorageOnly(userId, campaignStrategy);
      }
    } catch (error) {
      console.error('❌ Failed to save campaign strategy:', error);
      throw error;
    }
  }

  async getUserCampaignStrategies(userId: string): Promise<SavedCampaignStrategy[]> {
    try {
      console.log('📖 Loading campaign strategies for user:', userId);

      // Try Firebase first
      try {
        const q = query(
          collection(db, 'campaignStrategies'),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const firebaseStrategies: SavedCampaignStrategy[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.userId === userId) {
            firebaseStrategies.push({
              id: doc.id,
              ...data,
              savedAt: data.savedAt?.toDate?.() || new Date(data.savedAt),
            } as SavedCampaignStrategy);
          }
        });

        console.log('✅ Loaded campaign strategies from Firebase:', firebaseStrategies.length);
        return firebaseStrategies;
      } catch (firebaseError) {
        console.warn('⚠️ Firebase load failed, using localStorage:', firebaseError);
        return this.getFromLocalStorage(userId);
      }
    } catch (error) {
      console.error('❌ Failed to load campaign strategies:', error);
      return [];
    }
  }

  async updateCampaignStatus(userId: string, strategyId: string, status: 'planned' | 'active' | 'completed' | 'paused'): Promise<void> {
    try {
      // Try Firebase first
      try {
        await updateDoc(doc(db, 'campaignStrategies', strategyId), { status });
        console.log('✅ Campaign status updated in Firebase');
      } catch (firebaseError) {
        console.warn('⚠️ Firebase update failed:', firebaseError);
      }

      // Also update localStorage
      this.updateStatusInLocalStorage(userId, strategyId, status);
    } catch (error) {
      console.error('❌ Failed to update campaign status:', error);
      throw error;
    }
  }

  async deleteCampaignStrategy(userId: string, strategyId: string): Promise<void> {
    try {
      // Try Firebase first
      try {
        await deleteDoc(doc(db, 'campaignStrategies', strategyId));
        console.log('✅ Campaign strategy deleted from Firebase');
      } catch (firebaseError) {
        console.warn('⚠️ Firebase delete failed:', firebaseError);
      }

      // Also remove from localStorage
      this.removeFromLocalStorage(userId, strategyId);
    } catch (error) {
      console.error('❌ Failed to delete campaign strategy:', error);
      throw error;
    }
  }

  async copyCampaignText(campaign: SavedCampaignStrategy): Promise<void> {
    try {
      const campaignText = this.formatCampaignForCopy(campaign);
      await navigator.clipboard.writeText(campaignText);
      console.log('✅ Campaign strategy text copied to clipboard');
    } catch (error) {
      console.error('❌ Failed to copy campaign text:', error);
      throw new Error('Failed to copy text to clipboard');
    }
  }

  private formatCampaignForCopy(campaign: SavedCampaignStrategy): string {
    return `# ${campaign.campaignName}

**Type:** ${campaign.campaignType}
**Status:** ${campaign.status}

**Objective:** ${campaign.objective}

**Target Audience:** ${campaign.targetAudience}

**Timeline:** ${campaign.timeline}

**Platforms:** ${campaign.platforms.join(', ')}

**Content Types:** ${campaign.contentTypes.join(', ')}

**Key Messages:**
${campaign.keyMessages.map(msg => `• ${msg}`).join('\n')}

**Calls to Action:**
${campaign.callsToAction.map(cta => `• ${cta}`).join('\n')}

**Engagement Tactics:**
${campaign.engagementTactics.map(tactic => `• ${tactic}`).join('\n')}

**Success Metrics:** ${campaign.successMetrics.join(', ')}

**Budget:** ${campaign.budget}

**Launch Strategy:** ${campaign.launchStrategy}

**Source:** ${campaign.source}
**Saved:** ${campaign.savedAt.toLocaleDateString()}`;
  }

  private saveToLocalStorage(userId: string, campaign: SavedCampaignStrategy): void {
    try {
      const key = `campaignStrategies_${userId}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      const updated = [...existing, campaign];
      localStorage.setItem(key, JSON.stringify(updated));
      console.log('💾 Campaign strategy saved to localStorage');
    } catch (error) {
      console.error('❌ Failed to save to localStorage:', error);
    }
  }

  private saveToLocalStorageOnly(userId: string, campaign: Omit<SavedCampaignStrategy, 'id'>): string {
    const id = Date.now().toString();
    const campaignWithId = { ...campaign, id };
    this.saveToLocalStorage(userId, campaignWithId);
    return id;
  }

  private getFromLocalStorage(userId: string): SavedCampaignStrategy[] {
    try {
      const key = `campaignStrategies_${userId}`;
      const stored = localStorage.getItem(key);
      if (!stored) return [];

      const campaigns = JSON.parse(stored);
      return campaigns.map((campaign: any) => ({
        ...campaign,
        savedAt: new Date(campaign.savedAt),
      }));
    } catch (error) {
      console.error('❌ Failed to load from localStorage:', error);
      return [];
    }
  }

  private updateStatusInLocalStorage(userId: string, strategyId: string, status: string): void {
    try {
      const key = `campaignStrategies_${userId}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      const updated = existing.map((campaign: SavedCampaignStrategy) => 
        campaign.id === strategyId ? { ...campaign, status } : campaign
      );
      localStorage.setItem(key, JSON.stringify(updated));
      console.log('💾 Campaign status updated in localStorage');
    } catch (error) {
      console.error('❌ Failed to update status in localStorage:', error);
    }
  }

  private removeFromLocalStorage(userId: string, strategyId: string): void {
    try {
      const key = `campaignStrategies_${userId}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      const updated = existing.filter((campaign: SavedCampaignStrategy) => campaign.id !== strategyId);
      localStorage.setItem(key, JSON.stringify(updated));
      console.log('🗑️ Campaign strategy removed from localStorage');
    } catch (error) {
      console.error('❌ Failed to remove from localStorage:', error);
    }
  }
}

export const campaignStrategiesService = new CampaignStrategiesService();
