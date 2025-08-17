import AppNotifications from "../utils/appNotifications";

export interface ScheduledReminder {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime?: string;
  platform: string;
  reminderType: string;
  reminderTime: string;
  scheduledAt: Date;
  triggered: boolean;
}

class CalendarReminderService {
  private scheduledReminders: Map<string, ScheduledReminder> = new Map();
  private timers: Map<string, NodeJS.Timeout> = new Map();
  private isEnabled: boolean = true;

  // Schedule a reminder for a calendar event
  scheduleReminder(
    eventId: string,
    eventTitle: string,
    eventDate: string,
    eventTime: string | undefined,
    platform: string,
    reminderType: string,
    reminderTime: string,
  ): string {
    const reminderId = `${eventId}-${reminderType}-${Date.now()}`;
    
    // Parse the event date and time
    const eventDateTime = this.parseEventDateTime(eventDate, eventTime);
    const reminderDateTime = this.calculateReminderTime(eventDateTime, reminderTime);
    
    // Only schedule if the reminder time is in the future
    if (reminderDateTime > new Date()) {
      const reminder: ScheduledReminder = {
        id: reminderId,
        eventId,
        eventTitle,
        eventDate,
        eventTime,
        platform,
        reminderType,
        reminderTime,
        scheduledAt: reminderDateTime,
        triggered: false,
      };

      this.scheduledReminders.set(reminderId, reminder);
      this.setReminderTimer(reminder);
      
      console.log(`✅ Reminder scheduled: ${reminderType} for "${eventTitle}" at ${reminderDateTime.toLocaleString()}`);
    } else {
      console.warn(`⚠️ Reminder time is in the past, skipping: ${reminderType} for "${eventTitle}"`);
    }

    return reminderId;
  }

  // Remove a specific reminder
  cancelReminder(reminderId: string): void {
    const timer = this.timers.get(reminderId);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(reminderId);
    }
    this.scheduledReminders.delete(reminderId);
    console.log(`🗑️ Reminder cancelled: ${reminderId}`);
  }

  // Remove all reminders for an event
  cancelEventReminders(eventId: string): void {
    const eventReminders = Array.from(this.scheduledReminders.values())
      .filter(reminder => reminder.eventId === eventId);
    
    eventReminders.forEach(reminder => {
      this.cancelReminder(reminder.id);
    });
    
    console.log(`🗑️ All reminders cancelled for event: ${eventId}`);
  }

  // Get all scheduled reminders
  getScheduledReminders(): ScheduledReminder[] {
    return Array.from(this.scheduledReminders.values());
  }

  // Get reminders for a specific event
  getEventReminders(eventId: string): ScheduledReminder[] {
    return Array.from(this.scheduledReminders.values())
      .filter(reminder => reminder.eventId === eventId);
  }

  // Enable/disable reminder notifications
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    console.log(`🔔 Calendar reminders ${enabled ? 'enabled' : 'disabled'}`);
  }

  // Check if reminders are enabled
  isRemindersEnabled(): boolean {
    return this.isEnabled;
  }

  private parseEventDateTime(eventDate: string, eventTime?: string): Date {
    const date = new Date(eventDate);
    
    if (eventTime) {
      const [hours, minutes] = eventTime.split(':').map(Number);
      date.setHours(hours, minutes, 0, 0);
    } else {
      // Default to 9 AM if no time specified
      date.setHours(9, 0, 0, 0);
    }
    
    return date;
  }

  private calculateReminderTime(eventDateTime: Date, reminderTime: string): Date {
    const reminderDate = new Date(eventDateTime);
    
    // Parse reminder time (e.g., "24 hours before", "2 hours before", "15 minutes before")
    const timeMatch = reminderTime.match(/(\d+)\s*(minutes?|hours?|days?)\s*before/i);
    
    if (timeMatch) {
      const amount = parseInt(timeMatch[1]);
      const unit = timeMatch[2].toLowerCase();
      
      switch (unit) {
        case 'minute':
        case 'minutes':
          reminderDate.setMinutes(reminderDate.getMinutes() - amount);
          break;
        case 'hour':
        case 'hours':
          reminderDate.setHours(reminderDate.getHours() - amount);
          break;
        case 'day':
        case 'days':
          reminderDate.setDate(reminderDate.getDate() - amount);
          break;
      }
    }
    
    return reminderDate;
  }

  private setReminderTimer(reminder: ScheduledReminder): void {
    const now = new Date();
    const timeUntilReminder = reminder.scheduledAt.getTime() - now.getTime();
    
    if (timeUntilReminder > 0) {
      const timer = setTimeout(() => {
        this.triggerReminder(reminder);
      }, timeUntilReminder);
      
      this.timers.set(reminder.id, timer);
    }
  }

  private triggerReminder(reminder: ScheduledReminder): void {
    if (!this.isEnabled || reminder.triggered) {
      return;
    }

    // Mark as triggered
    reminder.triggered = true;
    
    // Get reminder-specific configuration
    const reminderConfig = this.getReminderConfig(reminder.reminderType);
    
    // Show notification
    AppNotifications.custom(
      reminderConfig.title,
      `${reminderConfig.message} "${reminder.eventTitle}" on ${reminder.platform}`,
      "info",
      {
        icon: reminderConfig.icon,
        duration: 0, // Don't auto-dismiss reminders
        position: "top-center",
        actionText: reminderConfig.actionText,
        onAction: () => {
          // Navigate to calendar tab
          const event = new CustomEvent('navigateToTab', { detail: { tab: 'calendar' } });
          window.dispatchEvent(event);
          
          // Show success notification
          AppNotifications.custom(
            "Calendar Opened",
            "Navigate to your scheduled event to take action.",
            "success",
            { duration: 3000 }
          );
        }
      }
    );

    // Send browser notification if permission granted
    this.sendBrowserNotification(reminder, reminderConfig);
    
    // Remove from active timers
    this.timers.delete(reminder.id);
    
    console.log(`🔔 Reminder triggered: ${reminder.reminderType} for "${reminder.eventTitle}"`);
  }

  private getReminderConfig(reminderType: string) {
    const configs = {
      'Preparation': {
        title: '📝 Content Preparation Reminder',
        message: 'Time to start preparing your content for',
        icon: '📝',
        actionText: 'Open Calendar'
      },
      'Review': {
        title: '👀 Content Review Reminder',
        message: 'Time for final review and optimization of',
        icon: '👀',
        actionText: 'Review Content'
      },
      'Publish': {
        title: '🚀 Ready to Publish',
        message: 'It\'s time to publish your content:',
        icon: '🚀',
        actionText: 'Publish Now'
      },
      'Follow-up': {
        title: '📊 Engagement Follow-up',
        message: 'Check engagement and respond to comments for',
        icon: '📊',
        actionText: 'Check Analytics'
      }
    };

    return configs[reminderType] || {
      title: '🔔 Content Reminder',
      message: 'Reminder for your scheduled content:',
      icon: '🔔',
      actionText: 'View Event'
    };
  }

  private sendBrowserNotification(reminder: ScheduledReminder, config: any): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(config.title, {
        body: `${config.message} "${reminder.eventTitle}" on ${reminder.platform}`,
        icon: '/favicon.ico',
        tag: `calendar-reminder-${reminder.id}`,
        requireInteraction: true,
      });

      notification.onclick = () => {
        window.focus();
        // Navigate to calendar
        const event = new CustomEvent('navigateToTab', { detail: { tab: 'calendar' } });
        window.dispatchEvent(event);
        notification.close();
      };
    }
  }

  // Initialize reminders from stored events (call this when app loads)
  initializeReminders(events: any[]): void {
    console.log('🔄 Initializing calendar reminders...');
    
    // Clear existing reminders
    this.clearAllReminders();
    
    // Schedule reminders for all events
    events.forEach(event => {
      if (event.reminders && event.notificationsEnabled) {
        event.reminders.forEach((reminder: any) => {
          this.scheduleReminder(
            event.id,
            event.title,
            event.date,
            event.time,
            event.platform,
            reminder.type,
            reminder.time
          );
        });
      }
    });
    
    console.log(`✅ Initialized ${this.scheduledReminders.size} calendar reminders`);
  }

  // Clear all reminders
  clearAllReminders(): void {
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();
    this.scheduledReminders.clear();
    console.log('🗑️ All calendar reminders cleared');
  }
}

// Create global instance
export const calendarReminderService = new CalendarReminderService();

// Make it globally accessible
declare global {
  interface Window {
    calendarReminderService: CalendarReminderService;
  }
}
window.calendarReminderService = calendarReminderService;

export default calendarReminderService;
