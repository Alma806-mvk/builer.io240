import { auth, db } from '../config/firebase';
import { collection, doc, addDoc, getDocs, deleteDoc, updateDoc, query, orderBy, onSnapshot } from 'firebase/firestore';

export interface SavedCompetitorAnalysis {
  id: string;
  competitorName: string;
  competitorType: string;
  industry: string;
  platforms: string[];
  audienceSize: string;
  engagementRate: string;
  contentStrategy: string;
  strengthsWeaknesses: string[];
  contentGaps: string[];
  opportunities: string[];
  keyTakeaways: string[];
  competitiveAdvantages: string[];
  monitoringFrequency: string;
  lastAnalyzed: Date;
  source: string;
  savedAt: Date;
  userId: string;
  createdAt: string;
}

class CompetitorAnalysisService {
  async saveCompetitorAnalysis(userId: string, analysisData: any): Promise<string> {
    try {
      console.log('💾 Saving competitor analysis for user:', userId);
      console.log('📊 Analysis data:', analysisData);

      const competitorAnalysis: Omit<SavedCompetitorAnalysis, 'id'> = {
        competitorName: analysisData.competitorName || 'Untitled Competitor',
        competitorType: analysisData.competitorType || 'Direct',
        industry: analysisData.industry || 'Not specified',
        platforms: analysisData.platforms || [],
        audienceSize: analysisData.audienceSize || 'Not specified',
        engagementRate: analysisData.engagementRate || 'Not specified',
        contentStrategy: analysisData.contentStrategy || 'Not specified',
        strengthsWeaknesses: analysisData.strengthsWeaknesses || [],
        contentGaps: analysisData.contentGaps || [],
        opportunities: analysisData.opportunities || [],
        keyTakeaways: analysisData.keyTakeaways || [],
        competitiveAdvantages: analysisData.competitiveAdvantages || [],
        monitoringFrequency: analysisData.monitoringFrequency || 'Monthly',
        lastAnalyzed: new Date(),
        source: analysisData.source || 'content-strategy-planner',
        savedAt: new Date(),
        userId,
        createdAt: new Date().toISOString()
      };

      // Try Firebase first
      try {
        const docRef = await addDoc(collection(db, 'competitorAnalyses'), competitorAnalysis);
        console.log('✅ Competitor analysis saved to Firebase with ID:', docRef.id);
        
        // Also save to localStorage as backup
        this.saveToLocalStorage(userId, { ...competitorAnalysis, id: docRef.id });
        
        return docRef.id;
      } catch (firebaseError) {
        console.warn('⚠️ Firebase save failed, using localStorage:', firebaseError);
        return this.saveToLocalStorageOnly(userId, competitorAnalysis);
      }
    } catch (error) {
      console.error('❌ Failed to save competitor analysis:', error);
      throw error;
    }
  }

  async getUserCompetitorAnalyses(userId: string): Promise<SavedCompetitorAnalysis[]> {
    try {
      console.log('📖 Loading competitor analyses for user:', userId);

      // Try Firebase first
      try {
        const q = query(
          collection(db, 'competitorAnalyses'),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const firebaseAnalyses: SavedCompetitorAnalysis[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.userId === userId) {
            firebaseAnalyses.push({
              id: doc.id,
              ...data,
              savedAt: data.savedAt?.toDate?.() || new Date(data.savedAt),
              lastAnalyzed: data.lastAnalyzed?.toDate?.() || new Date(data.lastAnalyzed),
            } as SavedCompetitorAnalysis);
          }
        });

        console.log('✅ Loaded competitor analyses from Firebase:', firebaseAnalyses.length);
        return firebaseAnalyses;
      } catch (firebaseError) {
        console.warn('⚠️ Firebase load failed, using localStorage:', firebaseError);
        return this.getFromLocalStorage(userId);
      }
    } catch (error) {
      console.error('❌ Failed to load competitor analyses:', error);
      return [];
    }
  }

  async updateAnalysisDate(userId: string, analysisId: string): Promise<void> {
    try {
      const newDate = new Date();
      
      // Try Firebase first
      try {
        await updateDoc(doc(db, 'competitorAnalyses', analysisId), { 
          lastAnalyzed: newDate 
        });
        console.log('✅ Analysis date updated in Firebase');
      } catch (firebaseError) {
        console.warn('⚠️ Firebase update failed:', firebaseError);
      }

      // Also update localStorage
      this.updateAnalysisDateInLocalStorage(userId, analysisId, newDate);
    } catch (error) {
      console.error('❌ Failed to update analysis date:', error);
      throw error;
    }
  }

  async deleteCompetitorAnalysis(userId: string, analysisId: string): Promise<void> {
    try {
      // Try Firebase first
      try {
        await deleteDoc(doc(db, 'competitorAnalyses', analysisId));
        console.log('✅ Competitor analysis deleted from Firebase');
      } catch (firebaseError) {
        console.warn('⚠️ Firebase delete failed:', firebaseError);
      }

      // Also remove from localStorage
      this.removeFromLocalStorage(userId, analysisId);
    } catch (error) {
      console.error('❌ Failed to delete competitor analysis:', error);
      throw error;
    }
  }

  async copyAnalysisText(analysis: SavedCompetitorAnalysis): Promise<void> {
    try {
      const analysisText = this.formatAnalysisForCopy(analysis);
      await navigator.clipboard.writeText(analysisText);
      console.log('✅ Competitor analysis text copied to clipboard');
    } catch (error) {
      console.error('❌ Failed to copy analysis text:', error);
      throw new Error('Failed to copy text to clipboard');
    }
  }

  private formatAnalysisForCopy(analysis: SavedCompetitorAnalysis): string {
    return `# Competitor Analysis: ${analysis.competitorName}

**Type:** ${analysis.competitorType}
**Industry:** ${analysis.industry}

**Platforms:** ${analysis.platforms.join(', ')}

**Audience Size:** ${analysis.audienceSize}
**Engagement Rate:** ${analysis.engagementRate}

**Content Strategy:** ${analysis.contentStrategy}

**Strengths & Weaknesses:**
${analysis.strengthsWeaknesses.map(item => `• ${item}`).join('\n')}

**Content Gaps:**
${analysis.contentGaps.map(gap => `• ${gap}`).join('\n')}

**Opportunities:**
${analysis.opportunities.map(opp => `• ${opp}`).join('\n')}

**Key Takeaways:**
${analysis.keyTakeaways.map(takeaway => `• ${takeaway}`).join('\n')}

**Competitive Advantages:**
${analysis.competitiveAdvantages.map(advantage => `• ${advantage}`).join('\n')}

**Monitoring:** ${analysis.monitoringFrequency}
**Last Analyzed:** ${analysis.lastAnalyzed.toLocaleDateString()}

**Source:** ${analysis.source}
**Saved:** ${analysis.savedAt.toLocaleDateString()}`;
  }

  private saveToLocalStorage(userId: string, analysis: SavedCompetitorAnalysis): void {
    try {
      const key = `competitorAnalyses_${userId}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      const updated = [...existing, analysis];
      localStorage.setItem(key, JSON.stringify(updated));
      console.log('💾 Competitor analysis saved to localStorage');
    } catch (error) {
      console.error('❌ Failed to save to localStorage:', error);
    }
  }

  private saveToLocalStorageOnly(userId: string, analysis: Omit<SavedCompetitorAnalysis, 'id'>): string {
    const id = Date.now().toString();
    const analysisWithId = { ...analysis, id };
    this.saveToLocalStorage(userId, analysisWithId);
    return id;
  }

  private getFromLocalStorage(userId: string): SavedCompetitorAnalysis[] {
    try {
      const key = `competitorAnalyses_${userId}`;
      const stored = localStorage.getItem(key);
      if (!stored) return [];

      const analyses = JSON.parse(stored);
      return analyses.map((analysis: any) => ({
        ...analysis,
        savedAt: new Date(analysis.savedAt),
        lastAnalyzed: new Date(analysis.lastAnalyzed),
      }));
    } catch (error) {
      console.error('❌ Failed to load from localStorage:', error);
      return [];
    }
  }

  private updateAnalysisDateInLocalStorage(userId: string, analysisId: string, newDate: Date): void {
    try {
      const key = `competitorAnalyses_${userId}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      const updated = existing.map((analysis: SavedCompetitorAnalysis) => 
        analysis.id === analysisId ? { ...analysis, lastAnalyzed: newDate } : analysis
      );
      localStorage.setItem(key, JSON.stringify(updated));
      console.log('💾 Analysis date updated in localStorage');
    } catch (error) {
      console.error('❌ Failed to update date in localStorage:', error);
    }
  }

  private removeFromLocalStorage(userId: string, analysisId: string): void {
    try {
      const key = `competitorAnalyses_${userId}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      const updated = existing.filter((analysis: SavedCompetitorAnalysis) => analysis.id !== analysisId);
      localStorage.setItem(key, JSON.stringify(updated));
      console.log('🗑️ Competitor analysis removed from localStorage');
    } catch (error) {
      console.error('❌ Failed to remove from localStorage:', error);
    }
  }
}

export const competitorAnalysisService = new CompetitorAnalysisService();
