import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  updateDoc, 
  query, 
  orderBy, 
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface StrategyGoal {
  id: string;
  title: string;
  description: string;
  category: 'strategy' | 'content' | 'growth' | 'engagement';
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  progress: number;
  createdAt: string;
  updatedAt: string;
  dueDate?: string | null;
  deadline?: Date; // For compatibility with existing component
  source: string;
  userId: string;
}

class GoalsService {
  private getGoalsCollection(userId: string) {
    return collection(db, 'users', userId, 'goals');
  }

  private getGoalDoc(userId: string, goalId: string) {
    return doc(db, 'users', userId, 'goals', goalId);
  }

  // Save goal to Firebase
  async saveGoal(userId: string, goal: Omit<StrategyGoal, 'id' | 'userId'>): Promise<StrategyGoal> {
    try {
      const goalId = Date.now().toString();
      const newGoal: StrategyGoal = {
        ...goal,
        id: goalId,
        userId,
        updatedAt: new Date().toISOString(),
      };

      const goalRef = this.getGoalDoc(userId, goalId);
      await setDoc(goalRef, newGoal);

      // Also save to localStorage for development
      this.saveToLocalStorage(newGoal);

      return newGoal;
    } catch (error) {
      // Suppress Firebase permission errors in development
      if (error?.code === 'permission-denied' || error?.message?.includes('permission') || error?.message?.includes('Missing or insufficient permissions')) {
        console.warn('Firebase not configured for production - saving to localStorage only');
      } else {
        console.error('Error saving goal to Firebase:', error);
      }

      // Fallback to localStorage
      const localGoal: StrategyGoal = {
        ...goal,
        id: Date.now().toString(),
        userId,
        updatedAt: new Date().toISOString(),
      };
      this.saveToLocalStorage(localGoal);
      return localGoal;
    }
  }

  // Get all goals for a user
  async getUserGoals(userId: string): Promise<StrategyGoal[]> {
    try {
      const goalsCollection = this.getGoalsCollection(userId);
      const q = query(goalsCollection, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const goals: StrategyGoal[] = [];
      querySnapshot.forEach((doc) => {
        goals.push(doc.data() as StrategyGoal);
      });

      // Merge with localStorage goals for development
      const localGoals = this.getLocalStorageGoals();
      const mergedGoals = this.mergeGoals(goals, localGoals);

      return mergedGoals;
    } catch (error) {
      // Suppress Firebase permission errors in development
      if (error?.code === 'permission-denied' || error?.message?.includes('permission') || error?.message?.includes('Missing or insufficient permissions')) {
        console.warn('Firebase not configured for production - using localStorage fallback');
      } else {
        console.error('Error fetching goals from Firebase:', error);
      }

      // Fallback to localStorage
      return this.getLocalStorageGoals();
    }
  }

  // Update goal
  async updateGoal(userId: string, goalId: string, updates: Partial<StrategyGoal>): Promise<void> {
    try {
      const goalRef = this.getGoalDoc(userId, goalId);
      const updateData = {
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(goalRef, updateData);

      // Also update localStorage
      this.updateLocalStorageGoal(goalId, updateData);
    } catch (error) {
      // Suppress Firebase permission errors in development
      if (error?.code === 'permission-denied' || error?.message?.includes('permission') || error?.message?.includes('Missing or insufficient permissions')) {
        console.warn('Firebase not configured for production - updating localStorage only');
      } else {
        console.error('Error updating goal:', error);
      }

      // Fallback to localStorage
      this.updateLocalStorageGoal(goalId, updates);
    }
  }

  // Delete goal
  async deleteGoal(userId: string, goalId: string): Promise<void> {
    try {
      const goalRef = this.getGoalDoc(userId, goalId);
      await deleteDoc(goalRef);

      // Also remove from localStorage
      this.removeFromLocalStorage(goalId);
    } catch (error) {
      // Suppress Firebase permission errors in development
      if (error?.code === 'permission-denied' || error?.message?.includes('permission') || error?.message?.includes('Missing or insufficient permissions')) {
        console.warn('Firebase not configured for production - removing from localStorage only');
      } else {
        console.error('Error deleting goal:', error);
      }

      // Fallback to localStorage
      this.removeFromLocalStorage(goalId);
    }
  }

  // localStorage fallback methods
  private saveToLocalStorage(goal: StrategyGoal): void {
    try {
      const existingGoals = this.getLocalStorageGoals();
      const updatedGoals = [...existingGoals, goal];
      localStorage.setItem('studioHub:progressGoals', JSON.stringify(updatedGoals));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  private getLocalStorageGoals(): StrategyGoal[] {
    try {
      const stored = localStorage.getItem('studioHub:progressGoals');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  }

  private updateLocalStorageGoal(goalId: string, updates: Partial<StrategyGoal>): void {
    try {
      const goals = this.getLocalStorageGoals();
      const updatedGoals = goals.map(goal => 
        goal.id === goalId ? { ...goal, ...updates } : goal
      );
      localStorage.setItem('studioHub:progressGoals', JSON.stringify(updatedGoals));
    } catch (error) {
      console.error('Error updating localStorage goal:', error);
    }
  }

  private removeFromLocalStorage(goalId: string): void {
    try {
      const goals = this.getLocalStorageGoals();
      const filteredGoals = goals.filter(goal => goal.id !== goalId);
      localStorage.setItem('studioHub:progressGoals', JSON.stringify(filteredGoals));
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }

  private mergeGoals(firebaseGoals: StrategyGoal[], localGoals: StrategyGoal[]): StrategyGoal[] {
    const merged = [...firebaseGoals];
    
    // Add local goals that don't exist in Firebase
    localGoals.forEach(localGoal => {
      if (!merged.find(goal => goal.id === localGoal.id)) {
        merged.push(localGoal);
      }
    });

    // Sort by creation date (newest first)
    return merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

export const goalsService = new GoalsService();
