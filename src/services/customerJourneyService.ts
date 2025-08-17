import { auth, db } from '../config/firebase';
import { collection, doc, addDoc, getDocs, deleteDoc, updateDoc, query, orderBy, onSnapshot } from 'firebase/firestore';

export interface JourneyStage {
  stage: string;
  touchpoints: string[];
  content: string[];
  goals: string[];
  metrics: string[];
  challenges: string[];
  solutions: string[];
}

export interface SavedCustomerJourney {
  id: string;
  journeyName: string;
  targetPersona: string;
  industry: string;
  overallObjective: string;
  stages: JourneyStage[];
  conversionPath: string[];
  keyTouchpoints: string[];
  contentRequirements: string[];
  automationOpportunities: string[];
  optimizationRecommendations: string[];
  expectedTimeline: string;
  successMetrics: string[];
  source: string;
  savedAt: Date;
  userId: string;
  createdAt: string;
}

class CustomerJourneyService {
  async saveCustomerJourney(userId: string, journeyData: any): Promise<string> {
    try {
      console.log('💾 Saving customer journey for user:', userId);
      console.log('📊 Journey data:', journeyData);

      const customerJourney: Omit<SavedCustomerJourney, 'id'> = {
        journeyName: journeyData.journeyName || 'Untitled Journey',
        targetPersona: journeyData.targetPersona || 'Not specified',
        industry: journeyData.industry || 'Not specified',
        overallObjective: journeyData.overallObjective || 'Not specified',
        stages: journeyData.stages || [],
        conversionPath: journeyData.conversionPath || [],
        keyTouchpoints: journeyData.keyTouchpoints || [],
        contentRequirements: journeyData.contentRequirements || [],
        automationOpportunities: journeyData.automationOpportunities || [],
        optimizationRecommendations: journeyData.optimizationRecommendations || [],
        expectedTimeline: journeyData.expectedTimeline || 'Not specified',
        successMetrics: journeyData.successMetrics || [],
        source: journeyData.source || 'content-strategy-planner',
        savedAt: new Date(),
        userId,
        createdAt: new Date().toISOString()
      };

      // Try Firebase first
      try {
        const docRef = await addDoc(collection(db, 'customerJourneys'), customerJourney);
        console.log('�� Customer journey saved to Firebase with ID:', docRef.id);
        
        // Also save to localStorage as backup
        this.saveToLocalStorage(userId, { ...customerJourney, id: docRef.id });
        
        return docRef.id;
      } catch (firebaseError) {
        console.warn('⚠️ Firebase save failed, using localStorage:', firebaseError);
        return this.saveToLocalStorageOnly(userId, customerJourney);
      }
    } catch (error) {
      console.error('❌ Failed to save customer journey:', error);
      throw error;
    }
  }

  async getUserCustomerJourneys(userId: string): Promise<SavedCustomerJourney[]> {
    try {
      console.log('📖 Loading customer journeys for user:', userId);

      // Try Firebase first
      try {
        const q = query(
          collection(db, 'customerJourneys'),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const firebaseJourneys: SavedCustomerJourney[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.userId === userId) {
            firebaseJourneys.push({
              id: doc.id,
              ...data,
              savedAt: data.savedAt?.toDate?.() || new Date(data.savedAt),
            } as SavedCustomerJourney);
          }
        });

        console.log('✅ Loaded customer journeys from Firebase:', firebaseJourneys.length);
        return firebaseJourneys;
      } catch (firebaseError) {
        console.warn('⚠️ Firebase load failed, using localStorage:', firebaseError);
        return this.getFromLocalStorage(userId);
      }
    } catch (error) {
      console.error('❌ Failed to load customer journeys:', error);
      return [];
    }
  }

  async deleteCustomerJourney(userId: string, journeyId: string): Promise<void> {
    try {
      // Try Firebase first
      try {
        await deleteDoc(doc(db, 'customerJourneys', journeyId));
        console.log('✅ Customer journey deleted from Firebase');
      } catch (firebaseError) {
        console.warn('⚠️ Firebase delete failed:', firebaseError);
      }

      // Also remove from localStorage
      this.removeFromLocalStorage(userId, journeyId);
    } catch (error) {
      console.error('❌ Failed to delete customer journey:', error);
      throw error;
    }
  }

  async copyJourneyText(journey: SavedCustomerJourney): Promise<void> {
    try {
      const journeyText = this.formatJourneyForCopy(journey);
      await navigator.clipboard.writeText(journeyText);
      console.log('✅ Customer journey text copied to clipboard');
    } catch (error) {
      console.error('❌ Failed to copy journey text:', error);
      throw new Error('Failed to copy text to clipboard');
    }
  }

  private formatJourneyForCopy(journey: SavedCustomerJourney): string {
    const stagesText = journey.stages.map(stage => `
## ${stage.stage}

**Touchpoints:** ${stage.touchpoints.join(', ')}
**Content:** ${stage.content.join(', ')}
**Goals:** ${stage.goals.join(', ')}
**Metrics:** ${stage.metrics.join(', ')}
**Challenges:** ${stage.challenges.join(', ')}
**Solutions:** ${stage.solutions.join(', ')}
`).join('\n');

    return `# Customer Journey: ${journey.journeyName}

**Target Persona:** ${journey.targetPersona}
**Industry:** ${journey.industry}
**Overall Objective:** ${journey.overallObjective}

# Journey Stages
${stagesText}

**Conversion Path:** ${journey.conversionPath.join(' → ')}

**Key Touchpoints:** ${journey.keyTouchpoints.join(', ')}

**Content Requirements:**
${journey.contentRequirements.map(req => `• ${req}`).join('\n')}

**Automation Opportunities:**
${journey.automationOpportunities.map(opp => `• ${opp}`).join('\n')}

**Optimization Recommendations:**
${journey.optimizationRecommendations.map(rec => `• ${rec}`).join('\n')}

**Expected Timeline:** ${journey.expectedTimeline}

**Success Metrics:** ${journey.successMetrics.join(', ')}

**Source:** ${journey.source}
**Saved:** ${journey.savedAt.toLocaleDateString()}`;
  }

  private saveToLocalStorage(userId: string, journey: SavedCustomerJourney): void {
    try {
      const key = `customerJourneys_${userId}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      const updated = [...existing, journey];
      localStorage.setItem(key, JSON.stringify(updated));
      console.log('💾 Customer journey saved to localStorage');
    } catch (error) {
      console.error('❌ Failed to save to localStorage:', error);
    }
  }

  private saveToLocalStorageOnly(userId: string, journey: Omit<SavedCustomerJourney, 'id'>): string {
    const id = Date.now().toString();
    const journeyWithId = { ...journey, id };
    this.saveToLocalStorage(userId, journeyWithId);
    return id;
  }

  private getFromLocalStorage(userId: string): SavedCustomerJourney[] {
    try {
      const key = `customerJourneys_${userId}`;
      const stored = localStorage.getItem(key);
      if (!stored) return [];

      const journeys = JSON.parse(stored);
      return journeys.map((journey: any) => ({
        ...journey,
        savedAt: new Date(journey.savedAt),
      }));
    } catch (error) {
      console.error('❌ Failed to load from localStorage:', error);
      return [];
    }
  }

  private removeFromLocalStorage(userId: string, journeyId: string): void {
    try {
      const key = `customerJourneys_${userId}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      const updated = existing.filter((journey: SavedCustomerJourney) => journey.id !== journeyId);
      localStorage.setItem(key, JSON.stringify(updated));
      console.log('🗑️ Customer journey removed from localStorage');
    } catch (error) {
      console.error('❌ Failed to remove from localStorage:', error);
    }
  }
}

export const customerJourneyService = new CustomerJourneyService();
