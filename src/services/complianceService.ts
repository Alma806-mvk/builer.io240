import { auth, db } from '../config/firebase';
import { collection, doc, addDoc, getDocs, deleteDoc, updateDoc, query, orderBy, onSnapshot } from 'firebase/firestore';

export interface PlatformGuideline {
  platform: string;
  guidelines: string[];
  lastUpdated: Date;
  complianceStatus: 'compliant' | 'needs-review' | 'non-compliant';
  notes: string;
}

export interface LegalTemplate {
  templateName: string;
  templateType: string;
  content: string;
  applicablePlatforms: string[];
  lastReviewed: Date;
  status: 'active' | 'draft' | 'deprecated';
}

export interface SavedCompliancePlan {
  id: string;
  planName: string;
  industry: string;
  applicableRegulations: string[];
  platformGuidelines: PlatformGuideline[];
  legalTemplates: LegalTemplate[];
  copyrightPolicies: string[];
  dataPrivacyMeasures: string[];
  disclosureRequirements: string[];
  contentReviewProcess: string[];
  crisisManagementPlan: string[];
  trainingRequirements: string[];
  auditSchedule: string;
  nextReviewDate: Date;
  source: string;
  savedAt: Date;
  userId: string;
  createdAt: string;
}

class ComplianceService {
  async saveCompliancePlan(userId: string, planData: any): Promise<string> {
    try {
      console.log('💾 Saving compliance plan for user:', userId);
      console.log('📊 Plan data:', planData);

      const compliancePlan: Omit<SavedCompliancePlan, 'id'> = {
        planName: planData.planName || 'Untitled Compliance Plan',
        industry: planData.industry || 'Not specified',
        applicableRegulations: planData.applicableRegulations || [],
        platformGuidelines: planData.platformGuidelines || [],
        legalTemplates: planData.legalTemplates || [],
        copyrightPolicies: planData.copyrightPolicies || [],
        dataPrivacyMeasures: planData.dataPrivacyMeasures || [],
        disclosureRequirements: planData.disclosureRequirements || [],
        contentReviewProcess: planData.contentReviewProcess || [],
        crisisManagementPlan: planData.crisisManagementPlan || [],
        trainingRequirements: planData.trainingRequirements || [],
        auditSchedule: planData.auditSchedule || 'Quarterly',
        nextReviewDate: planData.nextReviewDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
        source: planData.source || 'content-strategy-planner',
        savedAt: new Date(),
        userId,
        createdAt: new Date().toISOString()
      };

      // Try Firebase first
      try {
        const docRef = await addDoc(collection(db, 'compliancePlans'), compliancePlan);
        console.log('✅ Compliance plan saved to Firebase with ID:', docRef.id);
        
        // Also save to localStorage as backup
        this.saveToLocalStorage(userId, { ...compliancePlan, id: docRef.id });
        
        return docRef.id;
      } catch (firebaseError) {
        console.warn('⚠️ Firebase save failed, using localStorage:', firebaseError);
        return this.saveToLocalStorageOnly(userId, compliancePlan);
      }
    } catch (error) {
      console.error('❌ Failed to save compliance plan:', error);
      throw error;
    }
  }

  async getUserCompliancePlans(userId: string): Promise<SavedCompliancePlan[]> {
    try {
      console.log('📖 Loading compliance plans for user:', userId);

      // Try Firebase first
      try {
        const q = query(
          collection(db, 'compliancePlans'),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const firebasePlans: SavedCompliancePlan[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.userId === userId) {
            firebasePlans.push({
              id: doc.id,
              ...data,
              savedAt: data.savedAt?.toDate?.() || new Date(data.savedAt),
              nextReviewDate: data.nextReviewDate?.toDate?.() || new Date(data.nextReviewDate),
            } as SavedCompliancePlan);
          }
        });

        console.log('✅ Loaded compliance plans from Firebase:', firebasePlans.length);
        return firebasePlans;
      } catch (firebaseError) {
        console.warn('⚠️ Firebase load failed, using localStorage:', firebaseError);
        return this.getFromLocalStorage(userId);
      }
    } catch (error) {
      console.error('❌ Failed to load compliance plans:', error);
      return [];
    }
  }

  async updateComplianceStatus(userId: string, planId: string, platformIndex: number, status: 'compliant' | 'needs-review' | 'non-compliant'): Promise<void> {
    try {
      // Update compliance status for a specific platform in the plan
      // This would require a more complex update operation in Firebase
      console.log('Updating compliance status for platform', platformIndex, 'to', status);
      
      // For now, we'll handle this in localStorage
      this.updateComplianceStatusInLocalStorage(userId, planId, platformIndex, status);
    } catch (error) {
      console.error('❌ Failed to update compliance status:', error);
      throw error;
    }
  }

  async deleteCompliancePlan(userId: string, planId: string): Promise<void> {
    try {
      // Try Firebase first
      try {
        await deleteDoc(doc(db, 'compliancePlans', planId));
        console.log('✅ Compliance plan deleted from Firebase');
      } catch (firebaseError) {
        console.warn('⚠️ Firebase delete failed:', firebaseError);
      }

      // Also remove from localStorage
      this.removeFromLocalStorage(userId, planId);
    } catch (error) {
      console.error('❌ Failed to delete compliance plan:', error);
      throw error;
    }
  }

  async copyPlanText(plan: SavedCompliancePlan): Promise<void> {
    try {
      const planText = this.formatPlanForCopy(plan);
      await navigator.clipboard.writeText(planText);
      console.log('✅ Compliance plan text copied to clipboard');
    } catch (error) {
      console.error('❌ Failed to copy plan text:', error);
      throw new Error('Failed to copy text to clipboard');
    }
  }

  private formatPlanForCopy(plan: SavedCompliancePlan): string {
    const platformGuidelinesText = plan.platformGuidelines.map(pg => `
### ${pg.platform}
- **Status:** ${pg.complianceStatus}
- **Last Updated:** ${pg.lastUpdated.toLocaleDateString()}
- **Guidelines:** ${pg.guidelines.join(', ')}
- **Notes:** ${pg.notes}
`).join('\n');

    const legalTemplatesText = plan.legalTemplates.map(template => `
### ${template.templateName}
- **Type:** ${template.templateType}
- **Status:** ${template.status}
- **Platforms:** ${template.applicablePlatforms.join(', ')}
- **Last Reviewed:** ${template.lastReviewed.toLocaleDateString()}
- **Content:** ${template.content}
`).join('\n');

    return `# Compliance Plan: ${plan.planName}

**Industry:** ${plan.industry}
**Audit Schedule:** ${plan.auditSchedule}
**Next Review:** ${plan.nextReviewDate.toLocaleDateString()}

## Applicable Regulations
${plan.applicableRegulations.map(reg => `• ${reg}`).join('\n')}

## Platform Guidelines
${platformGuidelinesText}

## Legal Templates
${legalTemplatesText}

## Copyright Policies
${plan.copyrightPolicies.map(policy => `• ${policy}`).join('\n')}

## Data Privacy Measures
${plan.dataPrivacyMeasures.map(measure => `• ${measure}`).join('\n')}

## Disclosure Requirements
${plan.disclosureRequirements.map(req => `• ${req}`).join('\n')}

## Content Review Process
${plan.contentReviewProcess.map(step => `• ${step}`).join('\n')}

## Crisis Management Plan
${plan.crisisManagementPlan.map(step => `• ${step}`).join('\n')}

## Training Requirements
${plan.trainingRequirements.map(req => `• ${req}`).join('\n')}

**Source:** ${plan.source}
**Saved:** ${plan.savedAt.toLocaleDateString()}`;
  }

  private saveToLocalStorage(userId: string, plan: SavedCompliancePlan): void {
    try {
      const key = `compliancePlans_${userId}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      const updated = [...existing, plan];
      localStorage.setItem(key, JSON.stringify(updated));
      console.log('💾 Compliance plan saved to localStorage');
    } catch (error) {
      console.error('❌ Failed to save to localStorage:', error);
    }
  }

  private saveToLocalStorageOnly(userId: string, plan: Omit<SavedCompliancePlan, 'id'>): string {
    const id = Date.now().toString();
    const planWithId = { ...plan, id };
    this.saveToLocalStorage(userId, planWithId);
    return id;
  }

  private getFromLocalStorage(userId: string): SavedCompliancePlan[] {
    try {
      const key = `compliancePlans_${userId}`;
      const stored = localStorage.getItem(key);
      if (!stored) return [];

      const plans = JSON.parse(stored);
      return plans.map((plan: any) => ({
        ...plan,
        savedAt: new Date(plan.savedAt),
        nextReviewDate: new Date(plan.nextReviewDate),
      }));
    } catch (error) {
      console.error('❌ Failed to load from localStorage:', error);
      return [];
    }
  }

  private updateComplianceStatusInLocalStorage(userId: string, planId: string, platformIndex: number, status: string): void {
    try {
      const key = `compliancePlans_${userId}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      const updated = existing.map((plan: SavedCompliancePlan) => {
        if (plan.id === planId && plan.platformGuidelines[platformIndex]) {
          const updatedPlan = { ...plan };
          updatedPlan.platformGuidelines[platformIndex].complianceStatus = status as any;
          return updatedPlan;
        }
        return plan;
      });
      localStorage.setItem(key, JSON.stringify(updated));
      console.log('💾 Compliance status updated in localStorage');
    } catch (error) {
      console.error('❌ Failed to update status in localStorage:', error);
    }
  }

  private removeFromLocalStorage(userId: string, planId: string): void {
    try {
      const key = `compliancePlans_${userId}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      const updated = existing.filter((plan: SavedCompliancePlan) => plan.id !== planId);
      localStorage.setItem(key, JSON.stringify(updated));
      console.log('🗑️ Compliance plan removed from localStorage');
    } catch (error) {
      console.error('❌ Failed to remove from localStorage:', error);
    }
  }
}

export const complianceService = new ComplianceService();
