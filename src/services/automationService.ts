import { User } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, collection, query, orderBy, limit, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { notificationService } from './notificationService';

export interface AutomationSettings {
  contentScheduling: {
    enabled: boolean;
    frequency: 'daily' | 'mwf' | 'weekly';
    time: string;
    platforms: string[];
    setupDate: Date;
  };
  autoExport: {
    enabled: boolean;
    format: 'pdf' | 'json' | 'csv';
    triggerAt: number; // percentage
    destination: string;
    setupDate: Date;
  };
  analyticsReports: {
    enabled: boolean;
    frequency: 'weekly' | 'monthly';
    email: string;
    nextSend: Date;
    setupDate: Date;
  };
  smartAlerts: {
    enabled: boolean;
    before24h: boolean;
    before1week: boolean;
    channels: string[];
    setupDate: Date;
  };
  aiAutomations: {
    autoGenerateTitles: boolean;
    smartPriority: boolean;
    autoTagging: boolean;
    collaborationSuggestions: boolean;
  };
}

export interface AutomationJob {
  id: string;
  type: 'content_schedule' | 'auto_export' | 'analytics_report' | 'smart_alert';
  status: 'pending' | 'running' | 'completed' | 'failed';
  scheduledFor: Date;
  completedAt?: Date;
  data: any;
  userId: string;
}

export class AutomationService {
  private static instance: AutomationService;
  
  public static getInstance(): AutomationService {
    if (!AutomationService.instance) {
      AutomationService.instance = new AutomationService();
    }
    return AutomationService.instance;
  }

  // Get user automation settings
  async getAutomationSettings(userId: string): Promise<AutomationSettings | null> {
    try {
      const settingsDoc = await getDoc(doc(db, 'automation_settings', userId));
      if (settingsDoc.exists()) {
        const data = settingsDoc.data();
        return {
          ...data,
          contentScheduling: {
            ...data.contentScheduling,
            setupDate: data.contentScheduling?.setupDate?.toDate() || new Date(),
          },
          autoExport: {
            ...data.autoExport,
            setupDate: data.autoExport?.setupDate?.toDate() || new Date(),
          },
          analyticsReports: {
            ...data.analyticsReports,
            nextSend: data.analyticsReports?.nextSend?.toDate() || new Date(),
            setupDate: data.analyticsReports?.setupDate?.toDate() || new Date(),
          },
          smartAlerts: {
            ...data.smartAlerts,
            setupDate: data.smartAlerts?.setupDate?.toDate() || new Date(),
          },
        } as AutomationSettings;
      }
      return null;
    } catch (error) {
      console.error('Error fetching automation settings:', error);
      // Fallback to localStorage
      return this.getLocalAutomationSettings(userId);
    }
  }

  // Save automation settings
  async saveAutomationSettings(userId: string, settings: Partial<AutomationSettings>): Promise<void> {
    try {
      await setDoc(doc(db, 'automation_settings', userId), {
        ...settings,
        updatedAt: serverTimestamp(),
      }, { merge: true });

      // Create notification for successful setup
      await notificationService.createNotification(
        userId,
        'success',
        'Automation Settings Updated',
        'Your workflow automation settings have been successfully configured.',
        false
      );
    } catch (error) {
      console.error('Error saving automation settings:', error);
      // Fallback to localStorage
      this.saveLocalAutomationSettings(userId, settings);
    }
  }

  // Setup content scheduling automation
  async setupContentScheduling(userId: string, frequency: string): Promise<void> {
    const settings = {
      contentScheduling: {
        enabled: true,
        frequency: frequency as AutomationSettings['contentScheduling']['frequency'],
        time: this.getScheduleTime(frequency),
        platforms: ['youtube', 'twitter', 'linkedin'],
        setupDate: new Date(),
      }
    };

    await this.saveAutomationSettings(userId, settings);
    
    // Schedule the first job
    await this.createAutomationJob(userId, 'content_schedule', this.getNextScheduleDate(frequency), {
      frequency,
      platforms: settings.contentScheduling.platforms
    });

    // Create notification
    await notificationService.createNotification(
      userId,
      'success',
      'Content Scheduling Activated',
      `Your content will now be automatically scheduled ${frequency} across all platforms.`,
      true,
      '/calendar'
    );
  }

  // Setup auto-export automation
  async setupAutoExport(userId: string, format: string): Promise<void> {
    const settings = {
      autoExport: {
        enabled: true,
        format: format as AutomationSettings['autoExport']['format'],
        triggerAt: 100,
        destination: 'downloads',
        setupDate: new Date(),
      }
    };

    await this.saveAutomationSettings(userId, settings);

    // Create notification
    await notificationService.createNotification(
      userId,
      'success',
      'Auto-Export Enabled',
      `Projects will now automatically export as ${format.toUpperCase()} when completed.`,
      false
    );
  }

  // Setup analytics reports
  async setupAnalyticsReports(userId: string, frequency: string, email: string): Promise<void> {
    if (!email || !this.isValidEmail(email)) {
      throw new Error('Please provide a valid email address');
    }

    const nextSend = this.getNextReportDate(frequency);
    const settings = {
      analyticsReports: {
        enabled: true,
        frequency: frequency as AutomationSettings['analyticsReports']['frequency'],
        email,
        nextSend,
        setupDate: new Date(),
      }
    };

    await this.saveAutomationSettings(userId, settings);

    // Schedule the first report
    await this.createAutomationJob(userId, 'analytics_report', nextSend, {
      frequency,
      email,
      reportType: 'performance_summary'
    });

    // Create notification
    await notificationService.createNotification(
      userId,
      'success',
      'Analytics Reports Activated',
      `You'll receive ${frequency} performance reports at ${email}.`,
      true,
      '/analytics'
    );
  }

  // Setup smart alerts
  async setupSmartAlerts(userId: string, before24h: boolean, before1week: boolean): Promise<void> {
    const settings = {
      smartAlerts: {
        enabled: true,
        before24h,
        before1week,
        channels: ['notification', 'email'],
        setupDate: new Date(),
      }
    };

    await this.saveAutomationSettings(userId, settings);

    // Create notification
    const alertTypes = [];
    if (before24h) alertTypes.push('24 hours');
    if (before1week) alertTypes.push('1 week');

    await notificationService.createNotification(
      userId,
      'success',
      'Smart Alerts Configured',
      `You'll be notified ${alertTypes.join(' and ')} before project deadlines.`,
      false
    );
  }

  // Update AI automation settings
  async updateAiAutomations(userId: string, aiSettings: AutomationSettings['aiAutomations']): Promise<void> {
    const settings = { aiAutomations: aiSettings };
    await this.saveAutomationSettings(userId, settings);

    const enabledFeatures = Object.entries(aiSettings)
      .filter(([_, enabled]) => enabled)
      .map(([feature, _]) => this.formatFeatureName(feature));

    if (enabledFeatures.length > 0) {
      await notificationService.createNotification(
        userId,
        'info',
        'AI Automations Updated',
        `Enabled: ${enabledFeatures.join(', ')}. AI will now help optimize your workflow.`,
        false
      );
    }
  }

  // Create automation job
  private async createAutomationJob(userId: string, type: AutomationJob['type'], scheduledFor: Date, data: any): Promise<void> {
    try {
      const jobId = `${userId}_${type}_${Date.now()}`;
      await setDoc(doc(db, 'automation_jobs', jobId), {
        id: jobId,
        type,
        status: 'pending',
        scheduledFor: serverTimestamp(),
        data,
        userId,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error creating automation job:', error);
    }
  }

  // Helper methods
  private getScheduleTime(frequency: string): string {
    switch (frequency) {
      case 'daily': return '09:00';
      case 'mwf': return '14:00';
      case 'weekly': return '10:00';
      default: return '09:00';
    }
  }

  private getNextScheduleDate(frequency: string): Date {
    const now = new Date();
    switch (frequency) {
      case 'daily':
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
      case 'mwf':
        // Next Monday, Wednesday, or Friday
        const nextMWF = new Date(now);
        nextMWF.setHours(14, 0, 0, 0);
        while (![1, 3, 5].includes(nextMWF.getDay())) {
          nextMWF.setDate(nextMWF.getDate() + 1);
        }
        return nextMWF;
      case 'weekly':
        // Next Tuesday
        const nextTuesday = new Date(now);
        nextTuesday.setHours(10, 0, 0, 0);
        nextTuesday.setDate(now.getDate() + (2 - now.getDay() + 7) % 7);
        return nextTuesday;
      default:
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    }
  }

  private getNextReportDate(frequency: string): Date {
    const now = new Date();
    if (frequency === 'weekly') {
      // Next Monday
      const nextMonday = new Date(now);
      nextMonday.setHours(9, 0, 0, 0);
      nextMonday.setDate(now.getDate() + (1 - now.getDay() + 7) % 7);
      return nextMonday;
    } else {
      // Next month, first day
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1, 9, 0, 0);
      return nextMonth;
    }
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private formatFeatureName(feature: string): string {
    switch (feature) {
      case 'autoGenerateTitles': return 'Auto-generate titles';
      case 'smartPriority': return 'Smart priority assignment';
      case 'autoTagging': return 'Auto-tagging';
      case 'collaborationSuggestions': return 'Collaboration suggestions';
      default: return feature;
    }
  }

  // Local storage fallback methods
  private getLocalAutomationSettings(userId: string): AutomationSettings | null {
    try {
      const stored = localStorage.getItem(`automation_settings_${userId}`);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error reading local automation settings:', error);
      return null;
    }
  }

  private saveLocalAutomationSettings(userId: string, settings: Partial<AutomationSettings>): void {
    try {
      const existing = this.getLocalAutomationSettings(userId) || {} as AutomationSettings;
      const updated = { ...existing, ...settings };
      localStorage.setItem(`automation_settings_${userId}`, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving local automation settings:', error);
    }
  }

  // Process automation jobs (this would run on a server in production)
  async processAutomationJobs(userId: string): Promise<void> {
    try {
      const jobs = await getDocs(
        query(
          collection(db, 'automation_jobs'),
          where('userId', '==', userId),
          where('status', '==', 'pending'),
          orderBy('scheduledFor', 'asc'),
          limit(10)
        )
      );

      for (const jobDoc of jobs.docs) {
        const job = jobDoc.data() as AutomationJob;
        const scheduledTime = job.scheduledFor?.toDate() || new Date();
        
        if (scheduledTime <= new Date()) {
          await this.executeAutomationJob(job);
          await updateDoc(jobDoc.ref, {
            status: 'completed',
            completedAt: serverTimestamp(),
          });
        }
      }
    } catch (error) {
      console.error('Error processing automation jobs:', error);
    }
  }

  private async executeAutomationJob(job: AutomationJob): Promise<void> {
    switch (job.type) {
      case 'content_schedule':
        await this.executeContentScheduling(job);
        break;
      case 'analytics_report':
        await this.executeAnalyticsReport(job);
        break;
      case 'smart_alert':
        await this.executeSmartAlert(job);
        break;
    }
  }

  private async executeContentScheduling(job: AutomationJob): Promise<void> {
    // In a real implementation, this would integrate with social media APIs
    await notificationService.createNotification(
      job.userId,
      'success',
      'Content Scheduled',
      `Your content has been automatically scheduled across ${job.data.platforms.length} platforms.`,
      true,
      '/calendar'
    );
  }

  private async executeAnalyticsReport(job: AutomationJob): Promise<void> {
    // In a real implementation, this would generate and email a report
    await notificationService.createNotification(
      job.userId,
      'info',
      'Analytics Report Sent',
      `Your ${job.data.frequency} performance report has been sent to ${job.data.email}.`,
      true,
      '/analytics'
    );
  }

  private async executeSmartAlert(job: AutomationJob): Promise<void> {
    await notificationService.createNotification(
      job.userId,
      'warning',
      'Project Deadline Alert',
      `Project "${job.data.projectName}" deadline is approaching in ${job.data.timeRemaining}.`,
      true,
      '/projects'
    );
  }
}

export const automationService = AutomationService.getInstance();
