import { 
  collection, 
  addDoc, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit as firestoreLimit, 
  getDocs,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export interface AIAssistantUsage {
  userId: string;
  questionsUsed: number;
  dailyQuestionLimit: number;
  lastResetDate: Date;
  currentPlan: string;
  currentPeriodStart: Date;
  lastUpdated: Date;
}

export interface AIQuestionLog {
  id?: string;
  userId: string;
  question: string;
  responseLength: number;
  timestamp: Date;
  plan: string;
  tool: string;
  sessionId?: string;
}

export interface UsageStats {
  questionsRemaining: number;
  questionsUsed: number;
  dailyLimit: number;
  isUnlimited: boolean;
  percentageUsed: number;
  resetsAt: Date;
  planLevel: string;
}

const PLAN_LIMITS = {
  free: 5,
  creator: 50,
  pro: 50,
  agency: -1, // unlimited
  'agency pro': -1, // unlimited  
  enterprise: -1, // unlimited
};

class AIAssistantUsageService {
  private static instance: AIAssistantUsageService;
  private usageCache: Map<string, AIAssistantUsage> = new Map();

  static getInstance(): AIAssistantUsageService {
    if (!AIAssistantUsageService.instance) {
      AIAssistantUsageService.instance = new AIAssistantUsageService();
    }
    return AIAssistantUsageService.instance;
  }

  private getPlanLimit(plan: string): number {
    return PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS] || PLAN_LIMITS.free;
  }

  private isNewDay(lastReset: Date): boolean {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastResetDay = new Date(lastReset.getFullYear(), lastReset.getMonth(), lastReset.getDate());
    return today.getTime() > lastResetDay.getTime();
  }

  async getUserUsage(userId: string, userPlan: string = 'free'): Promise<AIAssistantUsage> {
    try {
      // Check cache first
      const cached = this.usageCache.get(userId);
      if (cached && !this.isNewDay(cached.lastResetDate)) {
        return cached;
      }

      const usageRef = doc(db, 'ai_assistant_usage', userId);
      const usageDoc = await getDoc(usageRef);

      const dailyLimit = this.getPlanLimit(userPlan);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      if (!usageDoc.exists()) {
        // Initialize new user usage
        const newUsage: AIAssistantUsage = {
          userId,
          questionsUsed: 0,
          dailyQuestionLimit: dailyLimit,
          lastResetDate: today,
          currentPlan: userPlan,
          currentPeriodStart: today,
          lastUpdated: now,
        };

        await setDoc(usageRef, {
          ...newUsage,
          lastResetDate: Timestamp.fromDate(newUsage.lastResetDate),
          currentPeriodStart: Timestamp.fromDate(newUsage.currentPeriodStart),
          lastUpdated: serverTimestamp(),
        });

        this.usageCache.set(userId, newUsage);
        return newUsage;
      }

      const data = usageDoc.data();
      const usage: AIAssistantUsage = {
        userId: data.userId,
        questionsUsed: data.questionsUsed,
        dailyQuestionLimit: data.dailyQuestionLimit,
        lastResetDate: data.lastResetDate?.toDate() || today,
        currentPlan: data.currentPlan,
        currentPeriodStart: data.currentPeriodStart?.toDate() || today,
        lastUpdated: data.lastUpdated?.toDate() || now,
      };

      // Check if we need to reset daily usage
      if (this.isNewDay(usage.lastResetDate)) {
        usage.questionsUsed = 0;
        usage.lastResetDate = today;
        usage.dailyQuestionLimit = dailyLimit;
        usage.currentPlan = userPlan;
        usage.lastUpdated = now;

        await updateDoc(usageRef, {
          questionsUsed: 0,
          dailyQuestionLimit: dailyLimit,
          lastResetDate: Timestamp.fromDate(today),
          currentPlan: userPlan,
          lastUpdated: serverTimestamp(),
        });
      }

      this.usageCache.set(userId, usage);
      return usage;
    } catch (error) {
      console.error('Error getting AI assistant usage:', error);

      // Check if it's a permissions error
      if (error instanceof Error && error.message.includes('permissions')) {
        console.warn('Firestore permissions not set up for ai_assistant_usage collection. Using fallback data.');
      }
      
      // Return default usage in case of error
      const now = new Date();
      return {
        userId,
        questionsUsed: 0,
        dailyQuestionLimit: this.getPlanLimit(userPlan),
        lastResetDate: now,
        currentPlan: userPlan,
        currentPeriodStart: now,
        lastUpdated: now,
      };
    }
  }

  async canAskQuestion(userId: string, userPlan: string = 'free'): Promise<boolean> {
    const usage = await this.getUserUsage(userId, userPlan);
    
    // Unlimited plans
    if (usage.dailyQuestionLimit === -1) {
      return true;
    }

    return usage.questionsUsed < usage.dailyQuestionLimit;
  }

  async incrementUsage(
    userId: string, 
    question: string, 
    responseLength: number, 
    userPlan: string = 'free',
    currentTool: string = 'studioHub'
  ): Promise<boolean> {
    try {
      const usage = await this.getUserUsage(userId, userPlan);

      // Check if user can ask question
      if (usage.dailyQuestionLimit !== -1 && usage.questionsUsed >= usage.dailyQuestionLimit) {
        return false;
      }

      // Update usage
      const newUsage: AIAssistantUsage = {
        ...usage,
        questionsUsed: usage.questionsUsed + 1,
        lastUpdated: new Date(),
      };

      // Update Firestore
      const usageRef = doc(db, 'ai_assistant_usage', userId);
      await updateDoc(usageRef, {
        questionsUsed: newUsage.questionsUsed,
        lastUpdated: serverTimestamp(),
      });

      // Log the question
      await addDoc(collection(db, 'ai_assistant_logs'), {
        userId,
        question: question.substring(0, 500), // Limit stored question length
        responseLength,
        timestamp: serverTimestamp(),
        plan: userPlan,
        tool: currentTool,
        sessionId: this.generateSessionId(),
      });

      // Update cache
      this.usageCache.set(userId, newUsage);
      return true;
    } catch (error) {
      console.error('Error incrementing AI assistant usage:', error);
      return false;
    }
  }

  async getUsageStats(userId: string, userPlan: string = 'free'): Promise<UsageStats> {
    const usage = await this.getUserUsage(userId, userPlan);
    const isUnlimited = usage.dailyQuestionLimit === -1;
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    return {
      questionsRemaining: isUnlimited ? -1 : Math.max(0, usage.dailyQuestionLimit - usage.questionsUsed),
      questionsUsed: usage.questionsUsed,
      dailyLimit: usage.dailyQuestionLimit,
      isUnlimited,
      percentageUsed: isUnlimited ? 0 : (usage.questionsUsed / usage.dailyQuestionLimit) * 100,
      resetsAt: tomorrow,
      planLevel: usage.currentPlan,
    };
  }

  async getRecentQuestions(userId: string, limit: number = 10): Promise<AIQuestionLog[]> {
    try {
      const q = query(
        collection(db, 'ai_assistant_logs'),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc'),
        firestoreLimit(limit)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
      })) as AIQuestionLog[];
    } catch (error) {
      console.error('Error getting recent questions:', error);
      return [];
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Clear cache when user logs out
  clearCache(): void {
    this.usageCache.clear();
  }

  // Get usage analytics for admin/debugging
  async getUsageAnalytics(userId: string, days: number = 7): Promise<any> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const q = query(
        collection(db, 'ai_assistant_logs'),
        where('userId', '==', userId),
        where('timestamp', '>=', Timestamp.fromDate(startDate)),
        orderBy('timestamp', 'desc')
      );

      const snapshot = await getDocs(q);
      const logs = snapshot.docs.map(doc => ({
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
      }));

      // Group by day
      const dailyUsage = logs.reduce((acc, log) => {
        const day = log.timestamp.toDateString();
        acc[day] = (acc[day] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Group by tool
      const toolUsage = logs.reduce((acc, log) => {
        acc[log.tool] = (acc[log.tool] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        totalQuestions: logs.length,
        averagePerDay: logs.length / days,
        dailyBreakdown: dailyUsage,
        toolBreakdown: toolUsage,
        avgResponseLength: logs.reduce((sum, log) => sum + (log.responseLength || 0), 0) / logs.length,
      };
    } catch (error) {
      console.error('Error getting usage analytics:', error);
      return null;
    }
  }
}

export const aiAssistantUsageService = AIAssistantUsageService.getInstance();
