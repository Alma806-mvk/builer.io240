import { User } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, collection, query, orderBy, limit, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface NotificationData {
  id: string;
  type: 'success' | 'warning' | 'achievement' | 'info' | 'welcome';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionable?: boolean;
  actionUrl?: string;
  userId: string;
  metadata?: Record<string, any>;
}

export class NotificationService {
  private static instance: NotificationService;
  private isFirestoreAvailable: boolean = true;
  private hasLoggedFallback: boolean = false;

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Create a notification with local storage fallback
  async createNotification(
    userId: string,
    type: NotificationData['type'],
    title: string,
    message: string,
    actionable = false,
    actionUrl?: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    const notificationId = `${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const notificationData: NotificationData = {
      id: notificationId,
      type,
      title,
      message,
      timestamp: new Date(),
      read: false,
      actionable,
      actionUrl,
      userId,
      metadata,
    };

    try {
      await setDoc(doc(db, 'notifications', notificationId), {
        ...notificationData,
        timestamp: serverTimestamp(),
      });
      // If successful, mark Firestore as available
      this.isFirestoreAvailable = true;
    } catch (error: any) {
      // Only log if it's not a permission error and we haven't logged the fallback yet
      if (!error?.message?.includes('Missing or insufficient permissions')) {
        console.error('Error creating notification:', error);
      } else if (!this.hasLoggedFallback) {
        console.info('💾 Notifications using local storage (Deploy Firestore rules to enable cloud sync)');
        this.hasLoggedFallback = true;
      }

      // Fallback to local storage
      this.isFirestoreAvailable = false;
      const existing = this.getLocalNotifications(userId, 50);
      existing.unshift(notificationData);
      this.saveLocalNotifications(userId, existing.slice(0, 50)); // Keep last 50
    }
  }

  // Get user notifications with local storage fallback
  async getUserNotifications(userId: string, limitCount = 10): Promise<NotificationData[]> {
    try {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const firestoreNotifications = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
      })) as NotificationData[];

      // If successful, mark Firestore as available
      this.isFirestoreAvailable = true;
      return firestoreNotifications;
    } catch (error: any) {
      // Only log if it's not a permission error (which is expected during fallback)
      if (!error?.message?.includes('Missing or insufficient permissions')) {
        console.error('Error fetching notifications:', error);
      } else {
        console.info('📱 Using local storage for notifications (Firestore rules pending deployment)');
      }

      // Fallback to local storage while Firestore rules are being deployed
      this.isFirestoreAvailable = false;
      return this.getLocalNotifications(userId, limitCount);
    }
  }

  // Local storage fallback methods
  private getLocalNotifications(userId: string, limitCount = 10): NotificationData[] {
    try {
      const stored = localStorage.getItem(`notifications_${userId}`);
      if (!stored) return [];

      const notifications: NotificationData[] = JSON.parse(stored);
      return notifications
        .map(n => ({ ...n, timestamp: new Date(n.timestamp) }))
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, limitCount);
    } catch (error) {
      console.error('Error reading local notifications:', error);
      return [];
    }
  }

  private saveLocalNotifications(userId: string, notifications: NotificationData[]): void {
    try {
      localStorage.setItem(`notifications_${userId}`, JSON.stringify(notifications));
    } catch (error) {
      console.error('Error saving local notifications:', error);
    }
  }

  // Mark notification as read with local storage fallback
  async markAsRead(notificationId: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'notifications', notificationId), {
        read: true,
      });
      // If successful, mark Firestore as available
      this.isFirestoreAvailable = true;
    } catch (error: any) {
      // Only log if it's not a permission error
      if (!error?.message?.includes('Missing or insufficient permissions')) {
        console.error('Error marking notification as read:', error);
      }

      // Fallback to local storage
      this.isFirestoreAvailable = false;
      const userId = notificationId.split('_')[0];
      const notifications = this.getLocalNotifications(userId, 50);
      const updated = notifications.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      );
      this.saveLocalNotifications(userId, updated);
    }
  }

  // Welcome notification for new users
  async createWelcomeNotification(user: User): Promise<void> {
    await this.createNotification(
      user.uid,
      'welcome',
      'Welcome to CreateGen Studio!',
      'Enjoy your 25 free credits to get started creating amazing content! 🎉',
      true,
      '/dashboard',
      { credits: 25, newUser: true }
    );
  }

  // Activity streak notification
  async createActivityStreakNotification(
    userId: string,
    streakDays: number
  ): Promise<void> {
    const streakEmoji = streakDays >= 30 ? '🔥' : streakDays >= 14 ? '⚡' : '🌟';
    
    await this.createNotification(
      userId,
      'achievement',
      'Streak Master!',
      `Amazing! You've maintained a ${streakDays}-day activity streak ${streakEmoji}`,
      false,
      undefined,
      { streakDays, type: 'activity_streak' }
    );
  }

  // Content performance notification
  async createPerformanceNotification(
    userId: string,
    contentTitle: string,
    metric: string,
    value: number
  ): Promise<void> {
    await this.createNotification(
      userId,
      'success',
      'Content Performance',
      `Your "${contentTitle}" has reached ${value.toLocaleString()} ${metric}! 🎉`,
      true,
      '/analytics',
      { contentTitle, metric, value, type: 'performance' }
    );
  }

  // Upcoming content reminder
  async createUpcomingContentNotification(
    userId: string,
    contentCount: number,
    timeframe: string
  ): Promise<void> {
    await this.createNotification(
      userId,
      'warning',
      'Upload Schedule',
      `You have ${contentCount} video${contentCount > 1 ? 's' : ''} scheduled for ${timeframe}`,
      true,
      '/calendar',
      { contentCount, timeframe, type: 'schedule_reminder' }
    );
  }

  // Credit milestone notification
  async createCreditMilestoneNotification(
    userId: string,
    creditsUsed: number,
    milestone: number
  ): Promise<void> {
    await this.createNotification(
      userId,
      'info',
      'Milestone Reached!',
      `Congratulations! You've successfully used ${creditsUsed} credits. You're creating amazing content! 🚀`,
      false,
      undefined,
      { creditsUsed, milestone, type: 'credit_milestone' }
    );
  }

  // Trend alert notification
  async createTrendAlertNotification(
    userId: string,
    trendTopic: string,
    percentage: number
  ): Promise<void> {
    await this.createNotification(
      userId,
      'info',
      'Trend Alert',
      `${trendTopic} is trending ${percentage}% higher this week. Perfect timing for new content!`,
      true,
      '/trending',
      { trendTopic, percentage, type: 'trend_alert' }
    );
  }

  // Low credits warning
  async createLowCreditsNotification(
    userId: string,
    remainingCredits: number
  ): Promise<void> {
    await this.createNotification(
      userId,
      'warning',
      'Low Credits Alert',
      `You have ${remainingCredits} credits remaining. Consider upgrading to continue creating!`,
      true,
      '/upgrade',
      { remainingCredits, type: 'low_credits' }
    );
  }

  // Check if user needs activity streak notification
  async checkActivityStreak(userId: string): Promise<void> {
    try {
      // Check user's activity history (this would need actual implementation based on your data structure)
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const lastActivity = userData.lastActivity?.toDate();
        const loginStreak = userData.loginStreak || 0;
        
        if (lastActivity && this.isConsecutiveDay(lastActivity)) {
          const newStreak = loginStreak + 1;
          
          // Update user streak
          await updateDoc(userDocRef, {
            loginStreak: newStreak,
            lastActivity: serverTimestamp(),
          });
          
          // Create streak notification for milestones
          if ([7, 14, 30, 60, 100].includes(newStreak)) {
            await this.createActivityStreakNotification(userId, newStreak);
          }
        }
      }
    } catch (error) {
      console.error('Error checking activity streak:', error);
    }
  }

  private isConsecutiveDay(lastActivity: Date): boolean {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    return lastActivity >= yesterday;
  }

  // Check if Firestore is available for notifications
  public getFirestoreStatus(): { available: boolean; message: string } {
    if (this.isFirestoreAvailable) {
      return {
        available: true,
        message: 'Cloud sync enabled'
      };
    } else {
      return {
        available: false,
        message: 'Using local storage - Deploy Firestore rules to enable cloud sync'
      };
    }
  }

  // Initialize notifications for new user
  async initializeUserNotifications(user: User): Promise<void> {
    try {
      // Check if user is truly new (no existing notifications)
      const existingNotifications = await this.getUserNotifications(user.uid, 1);

      if (existingNotifications.length === 0) {
        await this.createWelcomeNotification(user);

        // Create some demo notifications for immediate display
        setTimeout(async () => {
          await this.createNotification(
            user.uid,
            'info',
            'Pro Tip!',
            'Try our AI-powered content suggestions to create trending videos that engage your audience.',
            true,
            '/suggestions',
            { type: 'tip', category: 'content_creation' }
          );

          await this.createPerformanceNotification(
            user.uid,
            'AI Marketing Video',
            'views',
            12500
          );

          await this.createTrendAlertNotification(
            user.uid,
            'AI Content Creation',
            156
          );
        }, 2000); // 2 seconds delay
      }
    } catch (error) {
      console.error('Error initializing user notifications:', error);
    }
  }
}

export const notificationService = NotificationService.getInstance();
