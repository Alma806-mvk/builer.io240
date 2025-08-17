import { auth, db } from '../config/firebase';
import { collection, doc, addDoc, getDocs, deleteDoc, updateDoc, query, orderBy, onSnapshot } from 'firebase/firestore';

export interface TeamMember {
  role: string;
  skillLevel: string;
  responsibilities: string[];
  timeAllocation: string;
  hirePriority: string;
}

export interface BudgetAllocation {
  category: string;
  budgetAmount: string;
  percentage: number;
  priority: string;
  notes: string;
}

export interface ToolRecommendation {
  toolName: string;
  category: string;
  purpose: string;
  cost: string;
  alternatives: string[];
  priority: string;
}

export interface SavedResourcePlan {
  id: string;
  planName: string;
  projectScope: string;
  timeline: string;
  totalBudget: string;
  teamStructure: TeamMember[];
  budgetAllocations: BudgetAllocation[];
  toolStack: ToolRecommendation[];
  skillGaps: string[];
  trainingNeeds: string[];
  milestones: string[];
  riskFactors: string[];
  scalingConsiderations: string[];
  source: string;
  savedAt: Date;
  userId: string;
  createdAt: string;
}

class ResourcePlanningService {
  async saveResourcePlan(userId: string, planData: any): Promise<string> {
    try {
      console.log('💾 Saving resource plan for user:', userId);
      console.log('📊 Plan data:', planData);

      const resourcePlan: Omit<SavedResourcePlan, 'id'> = {
        planName: planData.planName || 'Untitled Resource Plan',
        projectScope: planData.projectScope || 'Not specified',
        timeline: planData.timeline || 'Not specified',
        totalBudget: planData.totalBudget || 'Not specified',
        teamStructure: planData.teamStructure || [],
        budgetAllocations: planData.budgetAllocations || [],
        toolStack: planData.toolStack || [],
        skillGaps: planData.skillGaps || [],
        trainingNeeds: planData.trainingNeeds || [],
        milestones: planData.milestones || [],
        riskFactors: planData.riskFactors || [],
        scalingConsiderations: planData.scalingConsiderations || [],
        source: planData.source || 'content-strategy-planner',
        savedAt: new Date(),
        userId,
        createdAt: new Date().toISOString()
      };

      // Try Firebase first
      try {
        const docRef = await addDoc(collection(db, 'resourcePlans'), resourcePlan);
        console.log('✅ Resource plan saved to Firebase with ID:', docRef.id);
        
        // Also save to localStorage as backup
        this.saveToLocalStorage(userId, { ...resourcePlan, id: docRef.id });
        
        return docRef.id;
      } catch (firebaseError) {
        console.warn('⚠️ Firebase save failed, using localStorage:', firebaseError);
        return this.saveToLocalStorageOnly(userId, resourcePlan);
      }
    } catch (error) {
      console.error('❌ Failed to save resource plan:', error);
      throw error;
    }
  }

  async getUserResourcePlans(userId: string): Promise<SavedResourcePlan[]> {
    try {
      console.log('📖 Loading resource plans for user:', userId);

      // Try Firebase first
      try {
        const q = query(
          collection(db, 'resourcePlans'),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const firebasePlans: SavedResourcePlan[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.userId === userId) {
            firebasePlans.push({
              id: doc.id,
              ...data,
              savedAt: data.savedAt?.toDate?.() || new Date(data.savedAt),
            } as SavedResourcePlan);
          }
        });

        console.log('✅ Loaded resource plans from Firebase:', firebasePlans.length);
        return firebasePlans;
      } catch (firebaseError) {
        console.warn('⚠️ Firebase load failed, using localStorage:', firebaseError);
        return this.getFromLocalStorage(userId);
      }
    } catch (error) {
      console.error('❌ Failed to load resource plans:', error);
      return [];
    }
  }

  async deleteResourcePlan(userId: string, planId: string): Promise<void> {
    try {
      // Try Firebase first
      try {
        await deleteDoc(doc(db, 'resourcePlans', planId));
        console.log('✅ Resource plan deleted from Firebase');
      } catch (firebaseError) {
        console.warn('⚠️ Firebase delete failed:', firebaseError);
      }

      // Also remove from localStorage
      this.removeFromLocalStorage(userId, planId);
    } catch (error) {
      console.error('❌ Failed to delete resource plan:', error);
      throw error;
    }
  }

  async copyPlanText(plan: SavedResourcePlan): Promise<void> {
    try {
      const planText = this.formatPlanForCopy(plan);
      await navigator.clipboard.writeText(planText);
      console.log('✅ Resource plan text copied to clipboard');
    } catch (error) {
      console.error('❌ Failed to copy plan text:', error);
      throw new Error('Failed to copy text to clipboard');
    }
  }

  private formatPlanForCopy(plan: SavedResourcePlan): string {
    const teamText = plan.teamStructure.map(member => `
### ${member.role}
- **Skill Level:** ${member.skillLevel}
- **Time Allocation:** ${member.timeAllocation}
- **Hire Priority:** ${member.hirePriority}
- **Responsibilities:** ${member.responsibilities.join(', ')}
`).join('\n');

    const budgetText = plan.budgetAllocations.map(budget => `
### ${budget.category}
- **Amount:** ${budget.budgetAmount} (${budget.percentage}%)
- **Priority:** ${budget.priority}
- **Notes:** ${budget.notes}
`).join('\n');

    const toolsText = plan.toolStack.map(tool => `
### ${tool.toolName}
- **Category:** ${tool.category}
- **Purpose:** ${tool.purpose}
- **Cost:** ${tool.cost}
- **Priority:** ${tool.priority}
- **Alternatives:** ${tool.alternatives.join(', ')}
`).join('\n');

    return `# Resource Plan: ${plan.planName}

**Project Scope:** ${plan.projectScope}
**Timeline:** ${plan.timeline}
**Total Budget:** ${plan.totalBudget}

## Team Structure
${teamText}

## Budget Allocations
${budgetText}

## Tool Stack
${toolsText}

## Skill Gaps
${plan.skillGaps.map(gap => `• ${gap}`).join('\n')}

## Training Needs
${plan.trainingNeeds.map(need => `• ${need}`).join('\n')}

## Milestones
${plan.milestones.map(milestone => `• ${milestone}`).join('\n')}

## Risk Factors
${plan.riskFactors.map(risk => `• ${risk}`).join('\n')}

## Scaling Considerations
${plan.scalingConsiderations.map(consideration => `• ${consideration}`).join('\n')}

**Source:** ${plan.source}
**Saved:** ${plan.savedAt.toLocaleDateString()}`;
  }

  private saveToLocalStorage(userId: string, plan: SavedResourcePlan): void {
    try {
      const key = `resourcePlans_${userId}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      const updated = [...existing, plan];
      localStorage.setItem(key, JSON.stringify(updated));
      console.log('💾 Resource plan saved to localStorage');
    } catch (error) {
      console.error('❌ Failed to save to localStorage:', error);
    }
  }

  private saveToLocalStorageOnly(userId: string, plan: Omit<SavedResourcePlan, 'id'>): string {
    const id = Date.now().toString();
    const planWithId = { ...plan, id };
    this.saveToLocalStorage(userId, planWithId);
    return id;
  }

  private getFromLocalStorage(userId: string): SavedResourcePlan[] {
    try {
      const key = `resourcePlans_${userId}`;
      const stored = localStorage.getItem(key);
      if (!stored) return [];

      const plans = JSON.parse(stored);
      return plans.map((plan: any) => ({
        ...plan,
        savedAt: new Date(plan.savedAt),
      }));
    } catch (error) {
      console.error('❌ Failed to load from localStorage:', error);
      return [];
    }
  }

  private removeFromLocalStorage(userId: string, planId: string): void {
    try {
      const key = `resourcePlans_${userId}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      const updated = existing.filter((plan: SavedResourcePlan) => plan.id !== planId);
      localStorage.setItem(key, JSON.stringify(updated));
      console.log('🗑️ Resource plan removed from localStorage');
    } catch (error) {
      console.error('❌ Failed to remove from localStorage:', error);
    }
  }
}

export const resourcePlanningService = new ResourcePlanningService();
