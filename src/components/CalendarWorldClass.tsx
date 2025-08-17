import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/professionalCalendar.css";
import {
  Calendar,
  Clock,
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  Settings,
  Download,
  Upload,
  Share2,
  Bell,
  BellOff,
  MapPin,
  Users,
  Video,
  Image,
  FileText,
  Mic,
  Camera,
  Sparkles,
  Target,
  TrendingUp,
  BarChart3,
  Zap,
  Globe,
  Smartphone,
  Monitor,
  Copy,
  Check,
  AlertCircle,
  CheckCircle,
  Info,
  Star,
  Heart,
  MessageSquare,
  Hash,
  Tag,
  Layers,
  Grid3X3,
  List,
  Maximize,
  Minimize,
  RefreshCw,
  Save,
} from "lucide-react";

// Import our world-class components
import {
  Button,
  Card,
  Badge,
  TabHeader,
  StatCard,
  ProgressBar,
  Input,
} from "./ui/WorldClassComponents";
import ContentCalendarExtensions from "./ContentCalendarExtensions";
import { Platform } from "../types";
import { CalendarEvent } from "./ProfessionalCalendar";

interface ContentEvent {
  id: string;
  title: string;
  description?: string;
  type: 'video' | 'post' | 'story' | 'live' | 'podcast' | 'blog';
  platform: string[];
  startDate: Date;
  endDate?: Date;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags: string[];
  assignee?: string;
  color: string;
  reminder?: number; // minutes before
  recurring?: {
    type: 'daily' | 'weekly' | 'monthly';
    interval: number;
    endDate?: Date;
  };
  // Content creation stages
  stages?: {
    ideation: { completed: boolean; completedAt?: Date; notes?: string; };
    scripting: { completed: boolean; completedAt?: Date; notes?: string; };
    filming: { completed: boolean; completedAt?: Date; notes?: string; };
    editing: { completed: boolean; completedAt?: Date; notes?: string; };
    publishing: { completed: boolean; completedAt?: Date; notes?: string; };
  };
  dependencies?: string[]; // IDs of events this depends on
  batchId?: string; // For batch content planning
  metadata?: {
    estimatedViews?: number;
    targetAudience?: string;
    contentPillar?: string;
    campaign?: string;
    audienceDemographics?: {
      ageGroup: string;
      location: string;
      interests: string[];
      platform: string;
    };
    bestTimes?: {
      platform: string;
      recommendedHours: number[];
      confidence: number;
      reason: string;
    }[];
  };
}

interface CalendarStats {
  totalEvents: number;
  completedThisWeek: number;
  upcomingEvents: number;
  overdueTasks: number;
  completionRate: number;
  avgPostsPerWeek: number;
}

interface CalendarWorldClassProps {
  userPlan?: string;
  onNavigateToTab?: (tab: string) => void;
}

// Helper function to convert ContentEvent to CalendarEvent format for ContentCalendarExtensions
const convertToCalendarEvent = (contentEvent: ContentEvent): CalendarEvent => {
  // Map the first platform from the array to Platform enum
  const platformName = contentEvent.platform[0];
  let platform = Platform.YouTube; // default

  // Map platform names to Platform enum values
  switch (platformName?.toLowerCase()) {
    case 'youtube':
      platform = Platform.YouTube;
      break;
    case 'tiktok':
      platform = Platform.TikTok;
      break;
    case 'instagram':
      platform = Platform.Instagram;
      break;
    case 'twitter':
    case 'twitter x':
      platform = Platform.Twitter;
      break;
    case 'linkedin':
      platform = Platform.LinkedIn;
      break;
    case 'facebook':
      platform = Platform.Facebook;
      break;
    default:
      platform = Platform.YouTube;
  }

  // Map status to CalendarEvent status format
  const statusMap: Record<ContentEvent['status'], CalendarEvent['status']> = {
    'planned': 'draft',
    'in_progress': 'scheduled',
    'completed': 'published',
    'cancelled': 'failed'
  };

  return {
    id: contentEvent.id,
    title: contentEvent.title,
    description: contentEvent.description,
    date: contentEvent.startDate.toISOString().split('T')[0], // Convert Date to string
    time: contentEvent.startDate.toTimeString().split(' ')[0], // Extract time
    platform: platform,
    color: contentEvent.color,
    content: contentEvent.description,
    status: statusMap[contentEvent.status],
    tags: contentEvent.tags,
    analyticsEnabled: true,
    notificationsEnabled: !!contentEvent.reminder
  };
};

const CalendarWorldClass: React.FC<CalendarWorldClassProps> = ({
  userPlan = "free",
  onNavigateToTab,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day' | 'agenda'>('month');
  const [events, setEvents] = useState<ContentEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<ContentEvent | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showEventOverview, setShowEventOverview] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [calendarStats, setCalendarStats] = useState<CalendarStats | null>(null);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // New event form state
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    type: 'video' as ContentEvent['type'],
    platform: [] as string[],
    startDate: '',
    startTime: '',
    endTime: '',
    status: 'planned' as ContentEvent['status'],
    priority: 'medium' as ContentEvent['priority'],
    tags: [] as string[],
    color: '#3b82f6',
    reminder: 15,
    recurring: null as ContentEvent['recurring'] | null,
  });

  // Settings state
  // Real research-based social media demographics (2024 data)
  const getAudienceDemographics = (language: string, timezone: string) => {
    // Base data from Hootsuite, Sprout Social, and Buffer 2024 research
    const baseData = {
      youtube: {
        ageGroups: { '18-24': 15, '25-34': 30, '35-44': 26, '45-54': 16, '55+': 13 },
        peakHours: [14, 15, 20, 21], // 2-3 PM, 8-9 PM
        peakDays: ['Wednesday', 'Thursday', 'Friday', 'Saturday'],
        timezone: 'UTC'
      },
      tiktok: {
        ageGroups: { '16-24': 25, '25-34': 22.4, '35-44': 21.7, '45-54': 20.3, '55+': 11 },
        peakHours: [6, 10, 18, 19], // 6-10 AM, 6-7 PM
        peakDays: ['Tuesday', 'Thursday', 'Sunday'],
        timezone: 'UTC'
      },
      instagram: {
        ageGroups: { '18-24': 30.8, '25-34': 31.2, '35-44': 15.7, '45-54': 11.2, '55+': 11.1 },
        peakHours: [11, 13, 17, 19], // 11 AM-1 PM, 5-7 PM
        peakDays: ['Tuesday', 'Wednesday', 'Thursday'],
        timezone: 'UTC'
      },
      linkedin: {
        ageGroups: { '25-34': 59.1, '35-44': 20.4, '45-54': 11.2, '55+': 6.3, '18-24': 3 },
        peakHours: [8, 9, 12, 17, 18], // 8-9 AM, 12 PM, 5-6 PM
        peakDays: ['Tuesday', 'Wednesday', 'Thursday'],
        timezone: 'UTC'
      },
      twitter: {
        ageGroups: { '25-34': 38.5, '35-44': 20.7, '45-54': 17.1, '18-24': 17.1, '55+': 6.6 },
        peakHours: [8, 9, 12, 18, 19], // 8-9 AM, 12 PM, 6-7 PM
        peakDays: ['Monday', 'Tuesday', 'Wednesday'],
        timezone: 'UTC'
      },
      facebook: {
        ageGroups: { '25-34': 23.8, '35-44': 19.3, '45-54': 16.9, '55+': 25.1, '18-24': 14.9 },
        peakHours: [9, 13, 15], // 9 AM, 1-3 PM
        peakDays: ['Tuesday', 'Wednesday', 'Thursday'],
        timezone: 'UTC'
      }
    };

    // Adjust for language/region with comprehensive timezone support
    const adjustHoursForTimezone = (hours: number[], fromTz: string, toTz: string) => {
      const timezoneOffsets = {
        'UTC-12': -12, 'UTC-11': -11, 'UTC-10': -10, 'UTC-9': -9, 'UTC-8': -8,
        'UTC-7': -7, 'UTC-6': -6, 'UTC-5': -5, 'UTC-4': -4, 'UTC-3': -3,
        'UTC-2': -2, 'UTC-1': -1, 'UTC': 0, 'UTC+1': 1, 'UTC+2': 2,
        'UTC+3': 3, 'UTC+4': 4, 'UTC+4.5': 4.5, 'UTC+5': 5, 'UTC+5.5': 5.5,
        'UTC+5.75': 5.75, 'UTC+6': 6, 'UTC+6.5': 6.5, 'UTC+7': 7, 'UTC+8': 8,
        'UTC+9': 9, 'UTC+9.5': 9.5, 'UTC+10': 10, 'UTC+10.5': 10.5, 'UTC+11': 11,
        'UTC+12': 12, 'UTC+12.75': 12.75, 'UTC+13': 13, 'UTC+14': 14
      };

      const offset = timezoneOffsets[toTz] - timezoneOffsets[fromTz];
      return hours.map(h => {
        const adjusted = h + offset;
        return adjusted < 0 ? adjusted + 24 : adjusted >= 24 ? adjusted - 24 : adjusted;
      });
    };

    // Language-specific adjustments based on regional usage patterns
    const languageAdjustments = {
      'English': { factor: 1.0 },
      'Spanish': { factor: 1.1, hourShift: 1 },
      'French': { factor: 0.9, hourShift: 2 },
      'German': { factor: 0.95, hourShift: 1 },
      'Portuguese': { factor: 1.05, hourShift: -1 },
      'Japanese': { factor: 0.8, hourShift: -3 },
      'Korean': { factor: 0.85, hourShift: -2 },
      'Chinese': { factor: 0.9, hourShift: -4 },
      'Arabic': { factor: 1.2, hourShift: 3 },
      'Hindi': { factor: 1.1, hourShift: 2 }
    };

    const adjustment = languageAdjustments[language] || languageAdjustments['English'];

    const adjustedData = {};
    Object.entries(baseData).forEach(([platform, data]) => {
      const adjustedHours = adjustHoursForTimezone(data.peakHours, 'UTC', timezone);
      const shiftedHours = adjustedHours.map(h => {
        const shifted = h + (adjustment.hourShift || 0);
        return shifted < 0 ? shifted + 24 : shifted >= 24 ? shifted - 24 : shifted;
      });

      adjustedData[platform] = {
        ...data,
        peakHours: shiftedHours,
        timezone: timezone,
        language: language,
        confidence: Math.min(0.95, 0.7 + (adjustment.factor - 1) * 0.3)
      };
    });

    return adjustedData;
  };

  // Export functionality
  const generateCalendarCSV = () => {
    // Sort events by date for better organization
    const sortedEvents = [...filteredEvents].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

    // Clean, professional CSV without emojis for better compatibility
    const csvRows = [];

    // Add clean title and explanation
    csvRows.push('MY CONTENT CALENDAR EXPORT');
    csvRows.push(`Exported on: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`);
    csvRows.push(`Total Events: ${sortedEvents.length}`);
    csvRows.push('');
    csvRows.push('====================================');
    csvRows.push('CONTENT SCHEDULE');
    csvRows.push('====================================');
    csvRows.push(''); // Empty row

    // Clean, professional headers
    const headers = [
      'Content Title',
      'Description',
      'Content Type',
      'Social Platforms',
      'Publish Date',
      'Publish Time',
      'Estimated Duration',
      'Current Status',
      'Priority Level',
      'Tags and Keywords',
      'Reminder Set',
      'Week Number',
      'Month',
      'Quarter'
    ];

    csvRows.push(headers.join(','));

    sortedEvents.forEach(event => {
      const startDate = event.startDate;
      const endDate = event.endDate;
      const duration = endDate ? (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60) : 0;

      // Clean status text without symbols
      const statusText = {
        'planned': 'Ready to Post',
        'in_progress': 'In Progress',
        'completed': 'Published',
        'cancelled': 'Cancelled'
      };

      const priorityText = {
        'low': 'Low Priority',
        'medium': 'Normal Priority',
        'high': 'High Priority',
        'urgent': 'URGENT'
      };

      // Calculate additional metadata
      const weekNumber = Math.ceil(((startDate.getTime() - new Date(startDate.getFullYear(), 0, 1).getTime()) / 86400000 + new Date(startDate.getFullYear(), 0, 1).getDay() + 1) / 7);
      const quarter = Math.ceil((startDate.getMonth() + 1) / 3);
      const reminderText = event.reminder ? `${event.reminder} minutes before` : 'No reminder';
      const durationText = duration > 0 ? `${duration.toFixed(1)} hours` : 'Not specified';

      const row = [
        `"${event.title.replace(/"/g, '""')}"`,
        `"${(event.description || 'No description provided').replace(/"/g, '""')}"`,
        event.type.charAt(0).toUpperCase() + event.type.slice(1),
        `"${event.platform.join(', ')}"`,
        startDate.toLocaleDateString('en-US'),
        formatEventTime(startDate),
        durationText,
        statusText[event.status] || event.status,
        priorityText[event.priority] || event.priority,
        `"${event.tags.length > 0 ? event.tags.join(', ') : 'No tags'}"`,
        reminderText,
        weekNumber,
        startDate.toLocaleDateString('en-US', { month: 'long' }),
        `Q${quarter} ${startDate.getFullYear()}`
      ];
      csvRows.push(row.join(','));
    });

    // Clean summary section
    csvRows.push('');
    csvRows.push('====================================');
    csvRows.push('SUMMARY STATISTICS');
    csvRows.push('====================================');
    csvRows.push('');

    csvRows.push('CONTENT OVERVIEW');
    csvRows.push(`Total content pieces planned,${sortedEvents.length}`);
    csvRows.push(`Already posted,${sortedEvents.filter(e => e.status === 'completed').length}`);
    csvRows.push(`Still need to post,${sortedEvents.filter(e => e.status === 'planned').length}`);
    csvRows.push(`Currently working on,${sortedEvents.filter(e => e.status === 'in_progress').length}`);
    csvRows.push(`High priority items,${sortedEvents.filter(e => e.priority === 'high' || e.priority === 'urgent').length}`);
    csvRows.push('');

    // Clean platform breakdown
    csvRows.push('PLATFORM BREAKDOWN');
    const platformCounts = {};

    sortedEvents.forEach(event => {
      event.platform.forEach(platform => {
        platformCounts[platform] = (platformCounts[platform] || 0) + 1;
      });
    });

    Object.entries(platformCounts)
      .sort(([,a], [,b]) => b - a)
      .forEach(([platform, count]) => {
        csvRows.push(`${platform},${count} posts`);
      });

    csvRows.push('');
    csvRows.push('====================================');
    csvRows.push('USAGE TIPS');
    csvRows.push('====================================');
    csvRows.push('TIP: Open this file in Excel or Google Sheets');
    csvRows.push('TIP: Sort by Publish Date column to see upcoming content');
    csvRows.push('TIP: Filter by Platform to see content for specific channels');
    csvRows.push('TIP: Use Priority Level column to focus on important tasks');

    return csvRows.join('\n');
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getBestTimeRecommendations = (platform: string, contentType: string, language: string = userLanguage, timezone: string = userTimezone) => {
    const audienceData = getAudienceDemographics(language, timezone);
    const platformData = audienceData[platform.toLowerCase()];
    if (!platformData) return [];

    const recommendations = [];

    // Research-based content type adjustments
    const typeAdjustments = {
      video: {
        boost: [14, 15, 19, 20, 21], // Afternoon and evening viewing
        confidence: 0.92,
        description: 'Video content performs best during leisure hours when users have time to watch'
      },
      live: {
        boost: [19, 20, 21, 22], // Prime time for live engagement
        confidence: 0.88,
        description: 'Live content needs maximum concurrent audience availability'
      },
      story: {
        boost: [8, 9, 12, 18, 19], // Morning commute, lunch, evening commute
        confidence: 0.85,
        description: 'Stories are consumed during transition periods and quick breaks'
      },
      post: {
        boost: [11, 12, 17, 18], // Lunch and after-work hours
        confidence: 0.82,
        description: 'Standard posts work well during natural social media check times'
      },
      podcast: {
        boost: [7, 8, 16, 17, 18], // Commute and workout times
        confidence: 0.86,
        description: 'Podcasts are often consumed during commutes and exercise'
      },
      blog: {
        boost: [9, 10, 14, 15], // Work breaks and afternoon reading
        confidence: 0.79,
        description: 'Long-form content needs focused attention during calmer periods'
      }
    };

    const typeData = typeAdjustments[contentType] || typeAdjustments.post;

    platformData.peakHours.forEach(hour => {
      const isTypeBoosted = typeData.boost.includes(hour);
      const baseConfidence = platformData.confidence || 0.8;
      const confidence = isTypeBoosted ?
        Math.min(0.98, baseConfidence * typeData.confidence) :
        baseConfidence * typeData.confidence * 0.75;

      const formatHour = (h) => {
        const period = h >= 12 ? 'PM' : 'AM';
        const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
        return `${displayHour}:00 ${period}`;
      };

      recommendations.push({
        platform: platform.charAt(0).toUpperCase() + platform.slice(1),
        recommendedHours: [hour],
        confidence,
        timeDisplay: formatHour(hour),
        reason: isTypeBoosted
          ? `Optimal ${contentType} engagement time for ${language} ${platform} audience`
          : `Good general engagement time for ${platform} in ${timezone}`,
        description: typeData.description,
        dayRecommendation: platformData.peakDays ? platformData.peakDays.slice(0, 3).join(', ') : 'Tuesday - Thursday'
      });
    });

    return recommendations.sort((a, b) => b.confidence - a.confidence);
  };

  const [showBestTimes, setShowBestTimes] = useState(false);
  const [showContentPipeline, setShowContentPipeline] = useState(false);
  const [showBatchPlanning, setShowBatchPlanning] = useState(false);
  const [userTimezone, setUserTimezone] = useState('UTC-5');
  const [userLanguage, setUserLanguage] = useState('English');

  const [settings, setSettings] = useState({
    notifications: true,
    autoArchive: false,
    defaultView: 'month' as 'month' | 'week' | 'day' | 'agenda',
    workingHours: {
      start: '09:00',
      end: '17:00',
      weekends: false
    },
    timeZone: 'UTC',
    language: 'en',
    theme: 'auto' as 'light' | 'dark' | 'auto',
    defaultEventDuration: 60,
    reminderDefault: 15,
    weekStartsOn: 0 as 0 | 1, // 0 = Sunday, 1 = Monday
  });

  // Event templates state
  const [eventTemplates, setEventTemplates] = useState<ContentEvent[]>([]);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ContentEvent | null>(null);

  // Initialize empty calendar - users create their own events
  useEffect(() => {
    // Load saved events from localStorage if available
    try {
      const savedEvents = localStorage.getItem('calendarEvents_v2');
      if (savedEvents) {
        const parsedEvents = JSON.parse(savedEvents);
        // Convert date strings back to Date objects
        const eventsWithDates = parsedEvents.map((event: any) => ({
          ...event,
          startDate: new Date(event.startDate),
          endDate: event.endDate ? new Date(event.endDate) : undefined,
          stages: event.stages ? {
            ...event.stages,
            ideation: { ...event.stages.ideation, completedAt: event.stages.ideation.completedAt ? new Date(event.stages.ideation.completedAt) : undefined },
            scripting: { ...event.stages.scripting, completedAt: event.stages.scripting.completedAt ? new Date(event.stages.scripting.completedAt) : undefined },
            filming: { ...event.stages.filming, completedAt: event.stages.filming.completedAt ? new Date(event.stages.filming.completedAt) : undefined },
            editing: { ...event.stages.editing, completedAt: event.stages.editing.completedAt ? new Date(event.stages.editing.completedAt) : undefined },
            publishing: { ...event.stages.publishing, completedAt: event.stages.publishing.completedAt ? new Date(event.stages.publishing.completedAt) : undefined }
          } : undefined
        }));
        setEvents(eventsWithDates);
      }
    } catch (error) {
      console.error('Error loading calendar events:', error);
      setEvents([]);
    }
  }, []);

  // Save events to localStorage when they change
  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem('calendarEvents_v2', JSON.stringify(events));
    }
  }, [events]);

  // Update calendar stats based on actual events
  useEffect(() => {
    const now = new Date();
    setCalendarStats({
      totalEvents: events.length,
      completedThisWeek: events.filter(e => e.status === 'completed').length,
      upcomingEvents: events.filter(e => e.status === 'planned' || e.status === 'in_progress').length,
      overdueTasks: events.filter(e => e.startDate < now && e.status !== 'completed').length,
      completionRate: events.length > 0 ? (events.filter(e => e.status === 'completed').length / events.length) * 100 : 0,
      avgPostsPerWeek: events.length > 0 ? (events.length / Math.max(1, Math.ceil((Date.now() - Math.min(...events.map(e => e.startDate.getTime()))) / (7 * 24 * 60 * 60 * 1000)))) : 0
    });
  }, [events]);

  const platforms = [
    { id: 'youtube', name: 'YouTube', color: '#FF0000', icon: <Video className="w-4 h-4" /> },
    { id: 'tiktok', name: 'TikTok', color: '#000000', icon: <Mic className="w-4 h-4" /> },
    { id: 'instagram', name: 'Instagram', color: '#E4405F', icon: <Camera className="w-4 h-4" /> },
    { id: 'twitter', name: 'Twitter', color: '#1DA1F2', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'linkedin', name: 'LinkedIn', color: '#0077B5', icon: <Users className="w-4 h-4" /> },
    { id: 'blog', name: 'Blog', color: '#6B46C1', icon: <FileText className="w-4 h-4" /> },
  ];

  const contentTypes = [
    { id: 'video', name: 'Video', icon: <Video className="w-4 h-4" />, color: '#3b82f6' },
    { id: 'post', name: 'Post', icon: <MessageSquare className="w-4 h-4" />, color: '#10b981' },
    { id: 'story', name: 'Story', icon: <Image className="w-4 h-4" />, color: '#f59e0b' },
    { id: 'live', name: 'Live', icon: <Video className="w-4 h-4" />, color: '#ef4444' },
    { id: 'podcast', name: 'Podcast', icon: <Mic className="w-4 h-4" />, color: '#8b5cf6' },
    { id: 'blog', name: 'Blog', icon: <FileText className="w-4 h-4" />, color: '#06b6d4' },
  ];

  const getEventsForDate = (date: Date) => {
    return filteredEvents.filter(event =>
      event.startDate.toDateString() === date.toDateString()
    );
  };

  const getUpcomingEvents = () => {
    const now = new Date();
    return filteredEvents
      .filter(event => event.startDate > now && event.status !== 'cancelled')
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
      .slice(0, 5);
  };

  const getOverdueEvents = () => {
    const now = new Date();
    return filteredEvents.filter(event =>
      event.startDate < now &&
      event.status !== 'completed' &&
      event.status !== 'cancelled'
    );
  };

  const filteredEvents = events.filter(event => {
    if (filterPlatform !== 'all' && !event.platform.some(p => p.toLowerCase().includes(filterPlatform))) return false;
    if (filterType !== 'all' && event.type !== filterType) return false;
    if (filterStatus !== 'all' && event.status !== filterStatus) return false;
    return true;
  });

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentDay = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }

    return days;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'var(--color-success)';
      case 'in_progress': return 'var(--color-warning)';
      case 'planned': return 'var(--brand-primary)';
      case 'cancelled': return 'var(--text-tertiary)';
      default: return 'var(--text-tertiary)';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#3b82f6';
      case 'low': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const formatEventTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleDayClick = (day: Date, dayEvents: ContentEvent[]) => {
    setSelectedDate(day);

    // If the day has no events, show create event option
    if (dayEvents.length === 0) {
      setIsCreatingEvent(true);
      setSelectedEvent(null);
      // Fix timezone issue - get local date string
      const year = day.getFullYear();
      const month = String(day.getMonth() + 1).padStart(2, '0');
      const dayNum = String(day.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${dayNum}`;
      setNewEvent({
        title: '',
        description: '',
        type: 'video' as ContentEvent['type'],
        platform: [] as string[],
        startDate: dateStr,
        startTime: '09:00',
        endTime: '10:00',
        status: 'planned' as ContentEvent['status'],
        priority: 'medium' as ContentEvent['priority'],
        tags: [] as string[],
        color: '#3b82f6',
        reminder: 15,
        recurring: null as ContentEvent['recurring'] | null,
      });
      setShowEventModal(true);
    }
  };

  const handleCreateEvent = () => {
    setIsCreatingEvent(true);
    setSelectedEvent(null);
    // Initialize with selected date if available - fix timezone issue
    const date = selectedDate || new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const dayNum = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${dayNum}`;
    setNewEvent({
      title: '',
      description: '',
      type: 'video' as ContentEvent['type'],
      platform: [] as string[],
      startDate: dateStr,
      startTime: '09:00',
      endTime: '10:00',
      status: 'planned' as ContentEvent['status'],
      priority: 'medium' as ContentEvent['priority'],
      tags: [] as string[],
      color: '#3b82f6',
      reminder: 15,
      recurring: null as ContentEvent['recurring'] | null,
    });
    setShowEventModal(true);
  };

  const handleSaveEvent = () => {
    if (!newEvent.title || !newEvent.startDate) return;

    const startDateTime = new Date(`${newEvent.startDate}T${newEvent.startTime}`);
    const endDateTime = newEvent.endTime ? new Date(`${newEvent.startDate}T${newEvent.endTime}`) : undefined;

    const baseEvent: ContentEvent = {
      id: isCreatingEvent ? Date.now().toString() : selectedEvent!.id,
      title: newEvent.title,
      description: newEvent.description,
      type: newEvent.type,
      platform: newEvent.platform,
      startDate: startDateTime,
      endDate: endDateTime,
      status: newEvent.status,
      priority: newEvent.priority,
      tags: newEvent.tags,
      color: newEvent.color,
      reminder: newEvent.reminder,
      recurring: newEvent.recurring,
    };

    // Handle recurring events
    if (newEvent.recurring && isCreatingEvent) {
      const recurringEvents = generateRecurringEvents(baseEvent);
      setEvents(prev => [...prev, ...recurringEvents]);
    } else {
      if (isCreatingEvent) {
        setEvents(prev => [...prev, baseEvent]);
      } else {
        setEvents(prev => prev.map(e => e.id === baseEvent.id ? baseEvent : e));
      }
    }

    setShowEventModal(false);
    setSelectedEvent(null);
    setIsCreatingEvent(false);
  };

  // Generate recurring events
  const generateRecurringEvents = (baseEvent: ContentEvent): ContentEvent[] => {
    if (!baseEvent.recurring) return [baseEvent];

    const events: ContentEvent[] = [baseEvent];
    const { type, interval, endDate } = baseEvent.recurring;
    let currentDate = new Date(baseEvent.startDate);
    let counter = 1;

    while (events.length < 52 && (!endDate || currentDate <= endDate)) { // Max 52 occurrences (1 year)
      const nextDate = new Date(currentDate);

      switch (type) {
        case 'weekly':
          nextDate.setDate(currentDate.getDate() + (7 * interval));
          break;
        case 'monthly':
          nextDate.setMonth(currentDate.getMonth() + interval);
          break;
        case 'daily':
          nextDate.setDate(currentDate.getDate() + interval);
          break;
      }

      if (endDate && nextDate > endDate) break;

      const nextEndDate = baseEvent.endDate ? new Date(nextDate.getTime() + (baseEvent.endDate.getTime() - baseEvent.startDate.getTime())) : undefined;

      const recurringEvent: ContentEvent = {
        ...baseEvent,
        id: `${baseEvent.id}_${counter}`,
        startDate: nextDate,
        endDate: nextEndDate,
      };

      events.push(recurringEvent);
      currentDate = nextDate;
      counter++;
    }

    return events;
  };

  // Event template functions
  const saveAsTemplate = (event: ContentEvent) => {
    const template: ContentEvent = {
      ...event,
      id: `template_${Date.now()}`,
      title: `${event.title} (Template)`,
      startDate: new Date(), // Reset dates for templates
      endDate: undefined,
    };

    setEventTemplates(prev => [...prev, template]);

    // Save to localStorage
    try {
      const updatedTemplates = [...eventTemplates, template];
      localStorage.setItem('eventTemplates', JSON.stringify(updatedTemplates));
    } catch (error) {
      console.error('Failed to save template:', error);
    }
  };

  const loadFromTemplate = (template: ContentEvent) => {
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const dayNum = String(selectedDate.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${dayNum}`;

    setNewEvent({
      title: template.title.replace(' (Template)', ''),
      description: template.description || '',
      type: template.type,
      platform: template.platform,
      startDate: dateStr,
      startTime: '09:00',
      endTime: '10:00',
      status: template.status,
      priority: template.priority,
      tags: template.tags,
      color: template.color,
      reminder: template.reminder || 15,
      recurring: null,
    });

    setShowTemplatesModal(false);
    setShowEventModal(true);
    setIsCreatingEvent(true);
  };

  const deleteTemplate = (templateId: string) => {
    setEventTemplates(prev => prev.filter(t => t.id !== templateId));

    // Update localStorage
    try {
      const updatedTemplates = eventTemplates.filter(t => t.id !== templateId);
      localStorage.setItem('eventTemplates', JSON.stringify(updatedTemplates));
    } catch (error) {
      console.error('Failed to delete template:', error);
    }
  };

  // Load templates from localStorage on component mount
  useEffect(() => {
    try {
      const savedTemplates = localStorage.getItem('eventTemplates');
      if (savedTemplates) {
        setEventTemplates(JSON.parse(savedTemplates));
      }
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  }, []);

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
    setShowEventModal(false);
    setSelectedEvent(null);
  };

  const handleEventClick = (event: ContentEvent) => {
    setSelectedEvent(event);
    setShowEventOverview(true);
  };

  const handleEditEvent = (event: ContentEvent) => {
    setSelectedEvent(event);
    setIsCreatingEvent(false);

    // Populate form with event data
    setNewEvent({
      title: event.title,
      description: event.description || '',
      type: event.type,
      platform: event.platform,
      startDate: event.startDate.toISOString().split('T')[0],
      startTime: event.startDate.toTimeString().split(':').slice(0, 2).join(':'),
      endTime: event.endDate ? event.endDate.toTimeString().split(':').slice(0, 2).join(':') : '',
      status: event.status,
      priority: event.priority,
      tags: event.tags,
      color: event.color,
      reminder: event.reminder || 15,
      recurring: event.recurring || null,
    });

    setShowEventOverview(false);
    setShowEventModal(true);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="h-full flex flex-col bg-[var(--surface-primary)]">
      <TabHeader
        title="Content Calendar"
        subtitle="Plan, schedule, and track your content strategy"
        icon={<Calendar />}
        badge="Smart Planning"
        actions={
          <div className="flex items-center space-x-4">
            {calendarStats && (
              <>
                <div className="text-center">
                  <div className="text-2xl font-bold">{calendarStats.upcomingEvents}</div>
                  <div className="text-sm opacity-75">Upcoming</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{calendarStats.completedThisWeek}</div>
                  <div className="text-sm opacity-75">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{calendarStats.completionRate}%</div>
                  <div className="text-sm opacity-75">Success Rate</div>
                </div>
              </>
            )}
            <Button variant="ghost" size="sm" onClick={() => setShowBestTimes(true)}>
              <TrendingUp className="w-4 h-4" />
              Best Times
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowContentPipeline(true)}>
              <Layers className="w-4 h-4" />
              Pipeline
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setShowSettings(true)}>
              <Settings className="w-4 h-4" />
              Settings
            </Button>
            <Button variant="primary" size="sm" onClick={handleCreateEvent}>
              <Plus className="w-4 h-4" />
              Add Event
            </Button>
          </div>
        }
      />

      {/* Controls */}
      <div className="bg-[var(--surface-secondary)] border-b border-[var(--border-primary)] p-4">
        <div className="flex items-center justify-between">
          {/* Calendar Navigation */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <h2 className="text-xl font-semibold text-[var(--text-primary)] min-w-48 text-center">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              
              <Button variant="ghost" size="sm" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <Button variant="ghost" size="sm" onClick={() => setCurrentDate(new Date())}>
              Today
            </Button>
          </div>

          {/* View Mode & Actions */}
          <div className="flex items-center space-x-3">
            <div className="flex border border-[var(--border-primary)] rounded-lg">
              {[
                { id: 'month', label: 'Month', icon: <Grid3X3 className="w-4 h-4" /> },
                { id: 'week', label: 'Week', icon: <Calendar className="w-4 h-4" /> },
                { id: 'day', label: 'Day', icon: <Clock className="w-4 h-4" /> },
                { id: 'agenda', label: 'Agenda', icon: <List className="w-4 h-4" /> },
              ].map((mode) => (
                <Button
                  key={mode.id}
                  variant={viewMode === mode.id ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => {
                    setViewMode(mode.id as any);
                    // Ensure we maintain current context when switching views
                    if (mode.id === 'day' && selectedDate.toDateString() !== currentDate.toDateString()) {
                      setSelectedDate(currentDate);
                    }
                  }}
                  className="rounded-none first:rounded-l-lg last:rounded-r-lg"
                >
                  {mode.icon}
                  <span className="ml-1 hidden sm:inline">{mode.label}</span>
                </Button>
              ))}
            </div>

            <Button variant="ghost" size="sm" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="w-4 h-4" />
              Filters
            </Button>

            <Button variant="ghost" size="sm" onClick={() => {
              // Export calendar events as beginner-friendly CSV
              const csvContent = generateCalendarCSV();
              const today = new Date();
              const dateStr = today.toLocaleDateString('en-US').replace(/\//g, '-');
              const eventCount = filteredEvents.length;
              downloadCSV(csvContent, `My Content Calendar - ${eventCount} Events - ${dateStr}.csv`);
            }}>
              <Download className="w-4 h-4" />
              Export
            </Button>

            <Button variant="primary" onClick={handleCreateEvent}>
              <Plus className="w-4 h-4" />
              New Event
            </Button>
          </div>
        </div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 pt-4 border-t border-[var(--border-primary)]"
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium">Platform:</label>
                  <select 
                    value={filterPlatform} 
                    onChange={(e) => setFilterPlatform(e.target.value)}
                    className="px-3 py-1 bg-[var(--surface-tertiary)] border border-[var(--border-primary)] rounded-lg text-sm"
                  >
                    <option value="all">All Platforms</option>
                    {platforms.map(platform => (
                      <option key={platform.id} value={platform.id}>{platform.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium">Type:</label>
                  <select 
                    value={filterType} 
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-3 py-1 bg-[var(--surface-tertiary)] border border-[var(--border-primary)] rounded-lg text-sm"
                  >
                    <option value="all">All Types</option>
                    {contentTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium">Status:</label>
                  <select 
                    value={filterStatus} 
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-1 bg-[var(--surface-tertiary)] border border-[var(--border-primary)] rounded-lg text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="planned">Planned</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <Button variant="ghost" size="sm" onClick={() => {
                  setFilterPlatform('all');
                  setFilterType('all');
                  setFilterStatus('all');
                }}>
                  Clear Filters
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {viewMode === 'month' && (
            <motion.div
              key="month"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-6 h-full overflow-y-auto"
            >
              <div className="grid grid-cols-7 gap-1 mb-4">
                {dayNames.map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-[var(--text-secondary)] bg-[var(--surface-tertiary)] rounded-lg">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1 h-[calc(100%-60px)]">
                {generateCalendarDays().map((day, index) => {
                  const dayEvents = getEventsForDate(day);
                  const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                  const isToday = day.toDateString() === new Date().toDateString();
                  const isSelected = day.toDateString() === selectedDate.toDateString();

                  return (
                    <div
                      key={index}
                      onClick={() => handleDayClick(day, dayEvents)}
                      className={`
                        p-2 border border-[var(--border-primary)] rounded-lg cursor-pointer transition-all duration-200 min-h-24
                        ${isCurrentMonth ? 'bg-[var(--surface-secondary)]' : 'bg-[var(--surface-tertiary)] opacity-50'}
                        ${isToday ? 'ring-2 ring-[var(--brand-primary)]' : ''}
                        ${isSelected ? 'bg-[var(--brand-primary)]10 border-[var(--brand-primary)]' : ''}
                        hover:bg-[var(--surface-quaternary)]
                        ${dayEvents.length === 0 ? 'hover:border-[var(--brand-primary)] hover:border-dashed' : ''}
                      `}
                    >
                      <div className={`text-sm font-medium mb-1 ${isToday ? 'text-[var(--brand-primary)]' : 'text-[var(--text-primary)]'}`}>
                        {day.getDate()}
                      </div>
                      
                      <div className="space-y-1">
                        {dayEvents.length === 0 ? (
                          <div className="text-xs text-[var(--text-secondary)] p-1 text-center opacity-0 hover:opacity-60 transition-opacity duration-200 flex items-center justify-center h-8 border border-dashed border-[var(--border-primary)] rounded">
                            + Add Event
                          </div>
                        ) : (
                          <>
                            {dayEvents.slice(0, 3).map(event => (
                              <div
                                key={event.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEventClick(event);
                                }}
                                className="text-xs p-1 rounded truncate cursor-pointer hover:shadow-sm transition-shadow"
                                style={{
                                  backgroundColor: `${event.color}20`,
                                  borderLeft: `3px solid ${event.color}`,
                                  color: event.color
                                }}
                              >
                                {event.title}
                              </div>
                            ))}
                            {dayEvents.length > 3 && (
                              <div className="text-xs text-[var(--text-secondary)] p-1">
                                +{dayEvents.length - 3} more
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {viewMode === 'week' && (
            <motion.div
              key="week"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 h-full overflow-y-auto"
            >
              <div className="space-y-4">
                {/* Week header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                    Week starting {currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </h3>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => {
                      const newDate = new Date(currentDate);
                      newDate.setDate(newDate.getDate() - 7);
                      setCurrentDate(newDate);
                    }}>
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => {
                      const newDate = new Date(currentDate);
                      newDate.setDate(currentDate.getDate() + 7);
                      setCurrentDate(newDate);
                    }}>
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Week grid */}
                <div className="grid grid-cols-8 gap-2 text-sm">
                  {/* Time column header */}
                  <div className="p-2 text-center font-medium text-[var(--text-secondary)]">Time</div>

                  {/* Day headers */}
                  {Array.from({ length: 7 }, (_, i) => {
                    // Start week with current date (today) as the first day
                    const day = new Date(currentDate);
                    day.setDate(currentDate.getDate() + i);
                    const isToday = day.toDateString() === new Date().toDateString();
                    const dayOfWeek = day.getDay();
                    const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayOfWeek];

                    return (
                      <div key={i} className={`p-2 text-center font-medium border-b border-[var(--border-primary)] ${isToday ? 'text-[var(--brand-primary)] bg-[var(--brand-primary)]/5' : 'text-[var(--text-secondary)]'}`}>
                        <div className="text-xs">{dayName}</div>
                        <div className={`text-lg ${isToday ? 'font-bold' : ''}`}>{day.getDate()}</div>
                      </div>
                    );
                  })}

                  {/* Time slots */}
                  {Array.from({ length: 24 }, (_, hour) => (
                    <React.Fragment key={hour}>
                      {/* Time label */}
                      <div className="p-2 text-xs text-[var(--text-tertiary)] border-t border-[var(--border-primary)]">
                        {hour.toString().padStart(2, '0')}:00
                      </div>

                      {/* Day columns */}
                      {Array.from({ length: 7 }, (_, dayIndex) => {
                        // Start with current date and add days sequentially
                        const day = new Date(currentDate);
                        day.setDate(currentDate.getDate() + dayIndex);

                        const dayEvents = getEventsForDate(day).filter(event => {
                          const eventHour = event.startDate.getHours();
                          return eventHour === hour;
                        });

                        return (
                          <div
                            key={dayIndex}
                            className="min-h-16 p-1 border-t border-[var(--border-primary)] hover:bg-[var(--surface-tertiary)] cursor-pointer transition-colors"
                            onClick={() => {
                              // Could open event creation modal for this time slot
                              setSelectedDate(day);
                            }}
                          >
                            {dayEvents.map(event => (
                              <div
                                key={event.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEventClick(event);
                                }}
                                className="text-xs p-1 mb-1 rounded cursor-pointer hover:shadow-sm transition-shadow"
                                style={{
                                  backgroundColor: `${event.color}20`,
                                  borderLeft: `3px solid ${event.color}`,
                                  color: event.color
                                }}
                              >
                                <div className="font-medium truncate">{event.title}</div>
                                <div className="text-xs opacity-75">{formatEventTime(event.startDate)}</div>
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {viewMode === 'day' && (
            <motion.div
              key="day"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 h-full overflow-y-auto"
            >
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Day header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-[var(--text-primary)]">
                      {selectedDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </h3>
                    <p className="text-[var(--text-secondary)]">
                      {getEventsForDate(selectedDate).length} events scheduled
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => {
                      const newDate = new Date(selectedDate);
                      newDate.setDate(selectedDate.getDate() - 1);
                      setSelectedDate(newDate);
                    }}>
                      <ChevronLeft className="w-4 h-4" />
                      Previous Day
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => {
                      const newDate = new Date(selectedDate);
                      newDate.setDate(selectedDate.getDate() + 1);
                      setSelectedDate(newDate);
                    }}>
                      Next Day
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Day schedule */}
                <Card>
                  <div className="space-y-2">
                    {Array.from({ length: 24 }, (_, hour) => {
                      const hourEvents = getEventsForDate(selectedDate).filter(event => {
                        const eventHour = event.startDate.getHours();
                        return eventHour === hour;
                      });

                      const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
                      const isWorkingHour = hour >= 9 && hour < 17; // Working hours highlight

                      return (
                        <div
                          key={hour}
                          className={`flex border-b border-[var(--border-primary)] last:border-b-0 ${isWorkingHour ? 'bg-[var(--surface-tertiary)]/30' : ''}`}
                        >
                          {/* Time column */}
                          <div className="w-20 p-4 text-sm font-medium text-[var(--text-secondary)] border-r border-[var(--border-primary)]">
                            {timeSlot}
                          </div>

                          {/* Events column */}
                          <div className="flex-1 p-2 min-h-16">
                            {hourEvents.length === 0 ? (
                              <div
                                className="h-full w-full hover:bg-[var(--surface-tertiary)] rounded cursor-pointer transition-colors flex items-center justify-center text-[var(--text-tertiary)] text-sm"
                                onClick={() => {
                                  // Could open event creation modal for this time
                                  const newDate = new Date(selectedDate);
                                  newDate.setHours(hour, 0, 0, 0);
                                  setSelectedDate(newDate);
                                  handleCreateEvent();
                                }}
                              >
                                Click to add event
                              </div>
                            ) : (
                              <div className="space-y-2">
                                {hourEvents.map(event => (
                                  <div
                                    key={event.id}
                                    onClick={() => handleEventClick(event)}
                                    className="p-3 rounded-lg cursor-pointer hover:shadow-md transition-all border-l-4"
                                    style={{
                                      backgroundColor: `${event.color}10`,
                                      borderColor: event.color
                                    }}
                                  >
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <h4 className="font-medium text-[var(--text-primary)] mb-1">{event.title}</h4>
                                        <div className="flex items-center space-x-3 text-sm text-[var(--text-secondary)]">
                                          <span className="flex items-center space-x-1">
                                            <Clock className="w-3 h-3" />
                                            {formatEventTime(event.startDate)}
                                            {event.endDate && ` - ${formatEventTime(event.endDate)}`}
                                          </span>
                                          <span className="flex items-center space-x-1">
                                            <Globe className="w-3 h-3" />
                                            {event.platform.join(', ')}
                                          </span>
                                        </div>
                                        {event.description && (
                                          <p className="text-sm text-[var(--text-secondary)] mt-2 line-clamp-2">
                                            {event.description}
                                          </p>
                                        )}
                                      </div>
                                      <div className="flex items-center space-x-2 ml-4">
                                        <Badge variant={event.priority === 'high' || event.priority === 'urgent' ? 'warning' : 'neutral'}>
                                          {event.priority}
                                        </Badge>
                                        <Badge variant={event.status === 'completed' ? 'success' : event.status === 'in_progress' ? 'warning' : 'neutral'}>
                                          {event.status}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>

                {/* Quick actions for the day */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card variant="hover" onClick={handleCreateEvent} className="cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-[var(--brand-primary)]/10">
                        <Plus className="w-5 h-5 text-[var(--brand-primary)]" />
                      </div>
                      <div>
                        <h4 className="font-medium text-[var(--text-primary)]">Add Event</h4>
                        <p className="text-sm text-[var(--text-secondary)]">Schedule new content</p>
                      </div>
                    </div>
                  </Card>

                  <Card variant="hover" className="cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-[var(--color-info)]/10">
                        <BarChart3 className="w-5 h-5 text-[var(--color-info)]" />
                      </div>
                      <div>
                        <h4 className="font-medium text-[var(--text-primary)]">View Analytics</h4>
                        <p className="text-sm text-[var(--text-secondary)]">Check performance</p>
                      </div>
                    </div>
                  </Card>

                  <Card variant="hover" className="cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-[var(--color-success)]/10">
                        <Copy className="w-5 h-5 text-[var(--color-success)]" />
                      </div>
                      <div>
                        <h4 className="font-medium text-[var(--text-primary)]">Duplicate Day</h4>
                        <p className="text-sm text-[var(--text-secondary)]">Copy to another date</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </motion.div>
          )}

          {viewMode === 'agenda' && (
            <motion.div
              key="agenda"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-6 h-full overflow-y-auto"
            >
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <StatCard
                    title="Upcoming Events"
                    value={getUpcomingEvents().length.toString()}
                    icon={<Calendar />}
                    description="next 7 days"
                  />
                  <StatCard
                    title="Overdue Tasks"
                    value={getOverdueEvents().length.toString()}
                    icon={<AlertCircle />}
                    description="need attention"
                    changeType={getOverdueEvents().length > 0 ? "negative" : "positive"}
                  />
                  <StatCard
                    title="This Week"
                    value={calendarStats?.completedThisWeek.toString() || "0"}
                    icon={<CheckCircle />}
                    description="completed"
                  />
                  <StatCard
                    title="Success Rate"
                    value={`${calendarStats?.completionRate || 0}%`}
                    icon={<TrendingUp />}
                    description="completion rate"
                  />
                </div>

                {/* Overdue Events */}
                {getOverdueEvents().length > 0 && (
                  <Card>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <h3 className="heading-4 text-red-600">Overdue Tasks</h3>
                        <Badge variant="danger">{getOverdueEvents().length}</Badge>
                      </div>
                      
                      <div className="space-y-3">
                        {getOverdueEvents().map(event => (
                          <div
                            key={event.id}
                            className="flex items-center space-x-4 p-3 bg-red-50 border border-red-200 rounded-lg cursor-pointer hover:bg-red-100 transition-colors"
                            onClick={() => handleEventClick(event)}
                          >
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: event.color }} />
                            <div className="flex-1">
                              <h4 className="font-medium text-red-900">{event.title}</h4>
                              <p className="text-sm text-red-700">
                                Due: {event.startDate.toLocaleDateString()} at {formatEventTime(event.startDate)}
                              </p>
                            </div>
                            <Badge variant="danger">{event.priority}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                )}

                {/* Upcoming Events */}
                <Card>
                  <div className="space-y-4">
                    <h3 className="heading-4">Upcoming Events</h3>
                    
                    <div className="space-y-3">
                      {getUpcomingEvents().map(event => (
                        <div
                          key={event.id}
                          className="flex items-center space-x-4 p-4 bg-[var(--surface-tertiary)] rounded-lg cursor-pointer hover:bg-[var(--surface-quaternary)] transition-colors"
                          onClick={() => handleEventClick(event)}
                        >
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: event.color }} />
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-medium text-[var(--text-primary)]">{event.title}</h4>
                              <Badge variant="neutral">{event.type}</Badge>
                              {event.priority === 'high' || event.priority === 'urgent' ? (
                                <Badge variant="warning">{event.priority}</Badge>
                              ) : null}
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-[var(--text-secondary)]">
                              <span className="flex items-center space-x-1">
                                <Calendar className="w-3 h-3" />
                                {event.startDate.toLocaleDateString()}
                              </span>
                              <span className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                {formatEventTime(event.startDate)}
                              </span>
                              <span className="flex items-center space-x-1">
                                <Globe className="w-3 h-3" />
                                {event.platform.join(', ')}
                              </span>
                            </div>
                            
                            {event.description && (
                              <p className="text-sm text-[var(--text-secondary)] mt-1 line-clamp-1">
                                {event.description}
                              </p>
                            )}
                          </div>
                          
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="xs">
                              <Edit3 className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="xs">
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {getUpcomingEvents().length === 0 && (
                      <div className="text-center py-8 text-[var(--text-secondary)]">
                        <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No upcoming events scheduled</p>
                        <Button variant="primary" onClick={handleCreateEvent} className="mt-4">
                          <Plus className="w-4 h-4 mr-2" />
                          Create Your First Event
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Content Type Distribution */}
                <Card>
                  <div className="space-y-4">
                    <h3 className="heading-4">Content Distribution</h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {contentTypes.map(type => {
                        const count = events.filter(e => e.type === type.id).length;
                        const percentage = events.length > 0 ? (count / events.length) * 100 : 0;
                        
                        return (
                          <div key={type.id} className="text-center">
                            <div className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: `${type.color}20`, color: type.color }}>
                              {type.icon}
                            </div>
                            <div className="font-medium text-[var(--text-primary)]">{count}</div>
                            <div className="text-sm text-[var(--text-secondary)]">{type.name}</div>
                            <div className="text-xs text-[var(--text-tertiary)]">{percentage.toFixed(1)}%</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content Management Hub */}
      <ContentCalendarExtensions
        events={events.map(convertToCalendarEvent)}
        className="calendar-extensions"
      />

      {/* Event Overview Modal */}
      <AnimatePresence>
        {showEventOverview && selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowEventOverview(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[var(--surface-secondary)] rounded-2xl border border-[var(--border-primary)] shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden"
            >
              {/* Overview Header */}
              <div className="flex items-center justify-between p-6 border-b border-[var(--border-primary)]">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: selectedEvent.color }} />
                  <div>
                    <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                      {selectedEvent.title}
                    </h2>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {selectedEvent.type} • {selectedEvent.platform.join(', ')}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" onClick={() => setShowEventOverview(false)}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>

              {/* Overview Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh] space-y-5">
                {/* Main Event Info */}
                <div className="bg-[var(--surface-tertiary)] rounded-xl p-4 border border-[var(--border-primary)]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left Column */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-4 h-4 text-[var(--brand-primary)]" />
                        <div>
                          <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wide">Date</p>
                          <p className="text-sm font-medium text-[var(--text-primary)]">
                            {selectedEvent.startDate.toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Clock className="w-4 h-4 text-[var(--brand-primary)]" />
                        <div>
                          <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wide">Time</p>
                          <p className="text-sm font-medium text-[var(--text-primary)]">
                            {formatEventTime(selectedEvent.startDate)}
                            {selectedEvent.endDate && ` - ${formatEventTime(selectedEvent.endDate)}`}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        {contentTypes.find(t => t.id === selectedEvent.type)?.icon}
                        <div>
                          <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wide">Content Type</p>
                          <p className="text-sm font-medium text-[var(--text-primary)] capitalize">{selectedEvent.type}</p>
                        </div>
                      </div>

                      {selectedEvent.reminder && selectedEvent.reminder > 0 && (
                        <div className="flex items-center space-x-3">
                          <Bell className="w-4 h-4 text-[var(--brand-primary)]" />
                          <div>
                            <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wide">Reminder</p>
                            <p className="text-sm font-medium text-[var(--text-primary)]">
                              {selectedEvent.reminder >= 1440 ? `${selectedEvent.reminder / 1440} day(s) before` :
                               selectedEvent.reminder >= 60 ? `${Math.round(selectedEvent.reminder / 60)} hour(s) before` :
                               `${selectedEvent.reminder} minutes before`}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status & Priority Row */}
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-[var(--border-primary)]">
                    <div className="flex space-x-2">
                      <Badge variant={selectedEvent.status === 'completed' ? 'success' : selectedEvent.status === 'in_progress' ? 'warning' : 'neutral'}>
                        {selectedEvent.status.replace('_', ' ')}
                      </Badge>
                      <Badge variant={selectedEvent.priority === 'high' || selectedEvent.priority === 'urgent' ? 'warning' : 'neutral'}>
                        {selectedEvent.priority} priority
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Platforms */}
                <div>
                  <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-3 uppercase tracking-wide">Platforms</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedEvent.platform.map((platform, index) => {
                      const platformData = platforms.find(p => p.name.toLowerCase() === platform.toLowerCase());
                      return (
                        <div key={index} className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-[var(--surface-tertiary)] border border-[var(--border-primary)] hover:bg-[var(--surface-quaternary)] transition-colors">
                          {platformData?.icon}
                          <span className="text-sm text-[var(--text-primary)] font-medium">{platform}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Description */}
                {selectedEvent.description && (
                  <div>
                    <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-3 uppercase tracking-wide">Description</h3>
                    <div className="bg-[var(--surface-tertiary)] rounded-lg p-4 border border-[var(--border-primary)]">
                      <p className="text-[var(--text-primary)] text-sm leading-relaxed">
                        {selectedEvent.description}
                      </p>
                    </div>
                  </div>
                )}

                {/* Tags */}
                {selectedEvent.tags.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-3 uppercase tracking-wide">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedEvent.tags.map((tag, index) => (
                        <Badge key={index} variant="neutral" className="text-xs px-2 py-1">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Overview Footer */}
              <div className="flex items-center justify-between p-6 border-t border-[var(--border-primary)]">
                <div className="flex space-x-3">
                  <Button variant="ghost" onClick={() => handleDeleteEvent(selectedEvent.id)}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                  <Button variant="ghost" onClick={() => {
                    const duplicatedEvent: ContentEvent = {
                      ...selectedEvent,
                      id: Date.now().toString(),
                      title: `${selectedEvent.title} (Copy)`,
                      startDate: new Date(selectedEvent.startDate.getTime() + 24 * 60 * 60 * 1000), // Next day
                      endDate: selectedEvent.endDate ? new Date(selectedEvent.endDate.getTime() + 24 * 60 * 60 * 1000) : undefined,
                      status: 'planned' // Reset to planned
                    };
                    setEvents(prev => [...prev, duplicatedEvent]);
                    setShowEventOverview(false);
                  }}>
                    <Copy className="w-4 h-4 mr-2" />
                    Duplicate
                  </Button>
                </div>
                <div className="flex space-x-3">
                  <Button variant="ghost" onClick={() => setShowEventOverview(false)}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={() => handleEditEvent(selectedEvent)}>
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Event
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Event Modal */}
      <AnimatePresence>
        {showEventModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowEventModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[var(--surface-secondary)] rounded-2xl border border-[var(--border-primary)] shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden"
            >
              {/* Event Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-[var(--border-primary)]">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)] text-white">
                    {isCreatingEvent ? <Plus className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                      {isCreatingEvent ? 'Create New Event' : 'Edit Event'}
                    </h2>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {isCreatingEvent ? 'Schedule your content creation' : 'Update event details'}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" onClick={() => setShowEventModal(false)}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>

              {/* Event Form */}
              <div className="p-6 overflow-y-auto max-h-[65vh] space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    {/* Basic Info */}
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Event Title *</label>
                      <input
                        type="text"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter event title..."
                        className="w-full px-3 py-2 bg-[var(--surface-tertiary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:border-[var(--brand-primary)] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Description</label>
                      <textarea
                        value={newEvent.description}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe your content..."
                        rows={3}
                        className="w-full px-3 py-2 bg-[var(--surface-tertiary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:border-[var(--brand-primary)] focus:outline-none resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Content Type</label>
                        <select
                          value={newEvent.type}
                          onChange={(e) => setNewEvent(prev => ({ ...prev, type: e.target.value as any }))}
                          className="w-full px-3 py-2 bg-[var(--surface-tertiary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:border-[var(--brand-primary)] focus:outline-none"
                        >
                          {contentTypes.map(type => (
                            <option key={type.id} value={type.id}>{type.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Priority</label>
                        <select
                          value={newEvent.priority}
                          onChange={(e) => setNewEvent(prev => ({ ...prev, priority: e.target.value as any }))}
                          className="w-full px-3 py-2 bg-[var(--surface-tertiary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:border-[var(--brand-primary)] focus:outline-none"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </div>
                    </div>

                    {/* Platforms */}
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Platforms</label>
                      <div className="grid grid-cols-2 gap-2">
                        {platforms.map(platform => (
                          <label key={platform.id} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={newEvent.platform.includes(platform.name)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewEvent(prev => ({ ...prev, platform: [...prev.platform, platform.name] }));
                                } else {
                                  setNewEvent(prev => ({ ...prev, platform: prev.platform.filter(p => p !== platform.name) }));
                                }
                              }}
                              className="w-4 h-4 text-[var(--brand-primary)] bg-[var(--surface-tertiary)] border-[var(--border-primary)] rounded focus:ring-[var(--brand-primary)]"
                            />
                            <span className="text-sm text-[var(--text-primary)]">{platform.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    {/* Date & Time */}
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Date *</label>
                      <input
                        type="date"
                        value={newEvent.startDate}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, startDate: e.target.value }))}
                        className="w-full px-3 py-2 bg-[var(--surface-tertiary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:border-[var(--brand-primary)] focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Start Time</label>
                        <input
                          type="time"
                          value={newEvent.startTime}
                          onChange={(e) => setNewEvent(prev => ({ ...prev, startTime: e.target.value }))}
                          className="w-full px-3 py-2 bg-[var(--surface-tertiary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:border-[var(--brand-primary)] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">End Time</label>
                        <input
                          type="time"
                          value={newEvent.endTime}
                          onChange={(e) => setNewEvent(prev => ({ ...prev, endTime: e.target.value }))}
                          className="w-full px-3 py-2 bg-[var(--surface-tertiary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:border-[var(--brand-primary)] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Status</label>
                        <select
                          value={newEvent.status}
                          onChange={(e) => setNewEvent(prev => ({ ...prev, status: e.target.value as any }))}
                          className="w-full px-3 py-2 bg-[var(--surface-tertiary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:border-[var(--brand-primary)] focus:outline-none"
                        >
                          <option value="planned">Planned</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Color</label>
                        <div className="flex space-x-2">
                          {['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#e91e63'].map(color => (
                            <button
                              key={color}
                              onClick={() => setNewEvent(prev => ({ ...prev, color }))}
                              className={`w-8 h-8 rounded-full border-2 transition-all ${newEvent.color === color ? 'border-[var(--text-primary)] scale-110' : 'border-transparent'}`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Reminder</label>
                      <select
                        value={newEvent.reminder}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, reminder: parseInt(e.target.value) }))}
                        className="w-full px-3 py-2 bg-[var(--surface-tertiary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:border-[var(--brand-primary)] focus:outline-none"
                      >
                        <option value={0}>No reminder</option>
                        <option value={5}>5 minutes before</option>
                        <option value={15}>15 minutes before</option>
                        <option value={30}>30 minutes before</option>
                        <option value={60}>1 hour before</option>
                        <option value={120}>2 hours before</option>
                        <option value={1440}>1 day before</option>
                      </select>
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Tags</label>
                      <input
                        type="text"
                        placeholder="Add tags (comma separated)..."
                        value={newEvent.tags.join(', ')}
                        onChange={(e) => setNewEvent(prev => ({
                          ...prev,
                          tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                        }))}
                        className="w-full px-3 py-2 bg-[var(--surface-tertiary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:border-[var(--brand-primary)] focus:outline-none"
                      />
                      <div className="flex flex-wrap gap-1 mt-2">
                        {newEvent.tags.map((tag, index) => (
                          <Badge key={index} variant="neutral" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Recurring Events */}
                    {isCreatingEvent && (
                      <div className="border-t border-[var(--border-primary)] pt-4">
                        <div className="flex items-center justify-between mb-4">
                          <label className="text-sm font-medium text-[var(--text-primary)]">Recurring Event</label>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={!!newEvent.recurring}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewEvent(prev => ({
                                    ...prev,
                                    recurring: {
                                      type: 'weekly',
                                      interval: 1,
                                    }
                                  }));
                                } else {
                                  setNewEvent(prev => ({ ...prev, recurring: null }));
                                }
                              }}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-[var(--surface-tertiary)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--brand-primary)]"></div>
                          </label>
                        </div>

                        {newEvent.recurring && (
                          <div className="space-y-4 bg-[var(--surface-tertiary)] p-4 rounded-lg">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Repeat</label>
                                <select
                                  value={newEvent.recurring.type}
                                  onChange={(e) => setNewEvent(prev => ({
                                    ...prev,
                                    recurring: {
                                      ...prev.recurring!,
                                      type: e.target.value as 'daily' | 'weekly' | 'monthly'
                                    }
                                  }))}
                                  className="w-full px-3 py-2 bg-[var(--surface-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:border-[var(--brand-primary)] focus:outline-none"
                                >
                                  <option value="daily">Daily</option>
                                  <option value="weekly">Weekly</option>
                                  <option value="monthly">Monthly</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Every</label>
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="number"
                                    min="1"
                                    max="12"
                                    value={newEvent.recurring.interval}
                                    onChange={(e) => setNewEvent(prev => ({
                                      ...prev,
                                      recurring: {
                                        ...prev.recurring!,
                                        interval: parseInt(e.target.value) || 1
                                      }
                                    }))}
                                    className="w-full px-3 py-2 bg-[var(--surface-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:border-[var(--brand-primary)] focus:outline-none"
                                  />
                                  <span className="text-sm text-[var(--text-secondary)] whitespace-nowrap">
                                    {newEvent.recurring.type.replace('ly', '')}(s)
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">End Date (Optional)</label>
                              <input
                                type="date"
                                value={newEvent.recurring.endDate ? newEvent.recurring.endDate.toISOString().split('T')[0] : ''}
                                onChange={(e) => setNewEvent(prev => ({
                                  ...prev,
                                  recurring: {
                                    ...prev.recurring!,
                                    endDate: e.target.value ? new Date(e.target.value) : undefined
                                  }
                                }))}
                                className="w-full px-3 py-2 bg-[var(--surface-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:border-[var(--brand-primary)] focus:outline-none"
                              />
                              <p className="text-xs text-[var(--text-secondary)] mt-1">
                                Leave empty to create up to 52 occurrences
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Event Modal Footer */}
              <div className="flex items-center justify-between p-6 border-t border-[var(--border-primary)]">
                <div className="flex space-x-3">
                  {!isCreatingEvent && (
                    <Button variant="ghost" onClick={() => handleDeleteEvent(selectedEvent!.id)}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Event
                    </Button>
                  )}
                  {!isCreatingEvent && selectedEvent && (
                    <Button
                      variant="secondary"
                      onClick={() => {
                        saveAsTemplate(selectedEvent);
                        // Show confirmation
                        // You could add a toast notification here
                      }}
                    >
                      <Grid3X3 className="w-4 h-4 mr-2" />
                      Save as Template
                    </Button>
                  )}
                </div>
                <div className="flex space-x-3">
                  {eventTemplates.length > 0 && (
                    <Button
                      variant="outline"
                      onClick={() => setShowTemplatesModal(true)}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Use Template
                    </Button>
                  )}
                  <Button variant="ghost" onClick={() => setShowEventModal(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSaveEvent}
                    disabled={!newEvent.title || !newEvent.startDate}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isCreatingEvent ? 'Create Event' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Best Time Recommendations Modal */}
      <AnimatePresence>
        {showBestTimes && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowBestTimes(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[var(--surface-secondary)] rounded-2xl border border-[var(--border-primary)] shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
            >
              {/* Best Times Header */}
              <div className="flex items-center justify-between p-6 border-b border-[var(--border-primary)]">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)] text-white">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-[var(--text-primary)]">Best Time Recommendations</h2>
                    <p className="text-sm text-[var(--text-secondary)]">AI-powered optimal posting times based on your audience</p>
                  </div>
                </div>
                <Button variant="ghost" onClick={() => setShowBestTimes(false)}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>

              {/* Best Times Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6">
                {/* User Settings */}
                <Card>
                  <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">Customize Your Recommendations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Target Language</label>
                      <select
                        value={userLanguage}
                        onChange={(e) => setUserLanguage(e.target.value)}
                        className="w-full px-3 py-2 bg-[var(--surface-tertiary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:border-[var(--brand-primary)] focus:outline-none"
                      >
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                        <option value="German">German</option>
                        <option value="Portuguese">Portuguese</option>
                        <option value="Japanese">Japanese</option>
                        <option value="Korean">Korean</option>
                        <option value="Chinese">Chinese</option>
                        <option value="Arabic">Arabic</option>
                        <option value="Hindi">Hindi</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Your Timezone</label>
                      <select
                        value={userTimezone}
                        onChange={(e) => setUserTimezone(e.target.value)}
                        className="w-full px-3 py-2 bg-[var(--surface-tertiary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:border-[var(--brand-primary)] focus:outline-none"
                      >
                        <optgroup label="🌍 Americas">
                          <option value="UTC-12">🇺🇸 Baker Island (UTC-12)</option>
                          <option value="UTC-11">🇺🇸 American Samoa (UTC-11)</option>
                          <option value="UTC-10">🇺🇸 Hawaii (UTC-10)</option>
                          <option value="UTC-9">🇺🇸 Alaska (UTC-9)</option>
                          <option value="UTC-8">🇺🇸 Los Angeles, Vancouver (UTC-8)</option>
                          <option value="UTC-7">🇺🇸 Denver, Phoenix (UTC-7)</option>
                          <option value="UTC-6">🇺🇸 Chicago, Mexico City (UTC-6)</option>
                          <option value="UTC-5">🇺🇸 New York, Toronto (UTC-5)</option>
                          <option value="UTC-4">🇨🇦 Atlantic Canada (UTC-4)</option>
                          <option value="UTC-3">🇧🇷 São Paulo, Buenos Aires (UTC-3)</option>
                          <option value="UTC-2">🇧🇷 Fernando de Noronha (UTC-2)</option>
                        </optgroup>

                        <optgroup label="🌍 Europe & Africa">
                          <option value="UTC-1">🇵🇹 Azores (UTC-1)</option>
                          <option value="UTC">🇬🇧 London, Dublin, Lisbon (UTC)</option>
                          <option value="UTC+1">🇩🇪 Berlin, Paris, Rome, Madrid (UTC+1)</option>
                          <option value="UTC+2">🇬🇷 Athens, Cairo, Helsinki (UTC+2)</option>
                          <option value="UTC+3">🇷🇺 Moscow, Istanbul, Nairobi (UTC+3)</option>
                          <option value="UTC+4">🇦🇪 Dubai, Baku (UTC+4)</option>
                        </optgroup>

                        <optgroup label="🌏 Asia">
                          <option value="UTC+4.5">🇦🇫 Kabul (UTC+4:30)</option>
                          <option value="UTC+5">🇵🇰 Karachi, Tashkent (UTC+5)</option>
                          <option value="UTC+5.5">🇮🇳 Mumbai, Delhi, Kolkata (UTC+5:30)</option>
                          <option value="UTC+5.75">🇳🇵 Kathmandu (UTC+5:45)</option>
                          <option value="UTC+6">🇧🇩 Dhaka, Almaty (UTC+6)</option>
                          <option value="UTC+6.5">🇲🇲 Yangon (UTC+6:30)</option>
                          <option value="UTC+7">🇹🇭 Bangkok, Jakarta, Ho Chi Minh (UTC+7)</option>
                          <option value="UTC+8">🇨🇳 Beijing, Singapore, Manila (UTC+8)</option>
                          <option value="UTC+9">🇯🇵 Tokyo, Seoul, Pyongyang (UTC+9)</option>
                          <option value="UTC+9.5">🇦🇺 Adelaide, Darwin (UTC+9:30)</option>
                          <option value="UTC+10">🇦🇺 Sydney, Melbourne, Brisbane (UTC+10)</option>
                          <option value="UTC+10.5">🇦🇺 Lord Howe Island (UTC+10:30)</option>
                          <option value="UTC+11">🇸🇧 Solomon Islands, Vanuatu (UTC+11)</option>
                          <option value="UTC+12">🇳🇿 Auckland, Fiji, Marshall Islands (UTC+12)</option>
                          <option value="UTC+12.75">🇳🇿 Chatham Islands (UTC+12:45)</option>
                          <option value="UTC+13">🇹🇴 Nuku'alofa, Samoa (UTC+13)</option>
                          <option value="UTC+14">🇰🇮 Line Islands (UTC+14)</option>
                        </optgroup>

                        <optgroup label="🕐 Major Business Hubs">
                          <option value="UTC-5">🏙️ New York (Eastern Time)</option>
                          <option value="UTC-8">🏙️ San Francisco (Pacific Time)</option>
                          <option value="UTC">🏙️ London (Greenwich Time)</option>
                          <option value="UTC+1">🏙️ Frankfurt (Central European)</option>
                          <option value="UTC+3">🏙️ Dubai (Gulf Standard Time)</option>
                          <option value="UTC+5.5">🏙��� Mumbai (India Standard Time)</option>
                          <option value="UTC+8">🏙️ Singapore (Singapore Time)</option>
                          <option value="UTC+9">🏙️ Tokyo (Japan Standard Time)</option>
                          <option value="UTC+10">🏙️ Sydney (Australian Eastern)</option>
                        </optgroup>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-[var(--color-info)]/10 border border-[var(--color-info)]/20 rounded-lg">
                    <p className="text-sm text-[var(--text-primary)]">
                      <strong>Current Settings:</strong> Optimized for {userLanguage} audience in {userTimezone} timezone
                    </p>
                  </div>
                </Card>

                {/* Audience Overview */}
                <Card>
                  <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">Demographics for {userLanguage} Audience</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(getAudienceDemographics(userLanguage, userTimezone)).map(([platform, data]) => (
                      <div key={platform} className="space-y-3">
                        <h4 className="font-medium text-[var(--text-primary)] capitalize flex items-center space-x-2">
                          <span>{platform}</span>
                          <Badge variant="info" className="text-xs">
                            {Math.round((data.confidence || 0.8) * 100)}% accuracy
                          </Badge>
                        </h4>

                        {/* Age Groups */}
                        <div>
                          <p className="text-sm text-[var(--text-secondary)] mb-2">Age Distribution (2024 Research)</p>
                          <div className="space-y-1">
                            {Object.entries(data.ageGroups).map(([age, percentage]) => (
                              <div key={age} className="flex items-center justify-between text-sm">
                                <span className="text-[var(--text-secondary)]">{age}</span>
                                <div className="flex items-center space-x-2">
                                  <div className="w-20 h-2 bg-[var(--surface-tertiary)] rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-[var(--brand-primary)]"
                                      style={{ width: `${percentage}%` }}
                                    />
                                  </div>
                                  <span className="text-[var(--text-primary)] font-medium">{percentage}%</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Peak Hours */}
                        <div>
                          <p className="text-sm text-[var(--text-secondary)] mb-2">Peak Hours ({userTimezone})</p>
                          <div className="flex flex-wrap gap-2">
                            {data.peakHours.map(hour => {
                              const period = hour >= 12 ? 'PM' : 'AM';
                              const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                              return (
                                <Badge key={hour} variant="success" className="text-xs">
                                  {displayHour}:00 {period}
                                </Badge>
                              );
                            })}
                          </div>
                        </div>

                        {/* Best Days */}
                        <div>
                          <p className="text-sm text-[var(--text-secondary)] mb-2">Best Days</p>
                          <div className="flex flex-wrap gap-1">
                            {data.peakDays.map(day => (
                              <Badge key={day} variant="neutral" className="text-xs">
                                {day}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Content Type Recommendations */}
                <Card>
                  <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">
                    Optimal Times by Content Type
                    <span className="text-sm text-[var(--text-secondary)] font-normal ml-2">
                      (Customized for {userLanguage} in {userTimezone})
                    </span>
                  </h3>
                  <div className="space-y-4">
                    {contentTypes.map(type => (
                      <div key={type.id} className="border border-[var(--border-primary)] rounded-lg p-4 hover:border-[var(--brand-primary)]/50 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-lg" style={{ backgroundColor: `${type.color}20`, color: type.color }}>
                              {type.icon}
                            </div>
                            <h4 className="font-medium text-[var(--text-primary)]">{type.name} Content</h4>
                          </div>
                          <Badge variant="info" className="text-xs">
                            Research-based
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {platforms.slice(0, 4).map(platform => {
                            const recommendations = getBestTimeRecommendations(platform.id, type.id, userLanguage, userTimezone);
                            const topRec = recommendations[0];

                            return (
                              <div key={platform.id} className="bg-[var(--surface-tertiary)] rounded-lg p-3 space-y-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: platform.color }} />
                                    <span className="text-sm font-medium text-[var(--text-primary)]">{platform.name}</span>
                                  </div>
                                  {topRec && (
                                    <Badge variant="success" className="text-xs">
                                      {Math.round(topRec.confidence * 100)}% accuracy
                                    </Badge>
                                  )}
                                </div>

                                {topRec ? (
                                  <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                      <Badge variant="primary" size="sm" className="px-2 py-1">
                                        {topRec.timeDisplay}
                                      </Badge>
                                      <span className="text-xs text-[var(--text-secondary)]">
                                        Best time
                                      </span>
                                    </div>

                                    <div className="text-xs text-[var(--text-tertiary)] space-y-1">
                                      <p className="font-medium">{topRec.reason}</p>
                                      <p>{topRec.description}</p>
                                      <p><strong>Best days:</strong> {topRec.dayRecommendation}</p>
                                    </div>

                                    {recommendations.length > 1 && (
                                      <div className="pt-2 border-t border-[var(--border-primary)]">
                                        <p className="text-xs text-[var(--text-secondary)] mb-1">Alternative times:</p>
                                        <div className="flex flex-wrap gap-1">
                                          {recommendations.slice(1, 4).map((rec, idx) => (
                                            <Badge key={idx} variant="neutral" className="text-xs">
                                              {rec.timeDisplay}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <p className="text-xs text-[var(--text-secondary)]">
                                    No specific data available for this combination
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Quick Schedule Button */}
                <Card className="bg-gradient-to-r from-[var(--brand-primary)]/5 to-[var(--brand-secondary)]/5 border-[var(--brand-primary)]/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-[var(--text-primary)] mb-1">Auto-Schedule Content</h4>
                      <p className="text-sm text-[var(--text-secondary)]">Let AI schedule your content at optimal times</p>
                    </div>
                    <Button variant="primary" onClick={() => {
                      setShowBestTimes(false);
                      handleCreateEvent();
                    }}>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Smart Schedule
                    </Button>
                  </div>
                </Card>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content Pipeline Modal */}
      <AnimatePresence>
        {showContentPipeline && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowContentPipeline(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[var(--surface-secondary)] rounded-2xl border border-[var(--border-primary)] shadow-2xl max-w-6xl w-full max-h-[85vh] overflow-hidden"
            >
              {/* Pipeline Header */}
              <div className="flex items-center justify-between p-6 border-b border-[var(--border-primary)]">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)] text-white">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-[var(--text-primary)]">Content Creation Pipeline</h2>
                    <p className="text-sm text-[var(--text-secondary)]">Track progress through all stages of content creation</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Button variant="ghost" size="sm" onClick={() => setShowBatchPlanning(true)}>
                    <Copy className="w-4 h-4" />
                    Batch Plan
                  </Button>
                  <Button variant="ghost" onClick={() => setShowContentPipeline(false)}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </Button>
                </div>
              </div>

              {/* Pipeline Content */}
              <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
                {/* Pipeline Overview */}
                <div className="grid grid-cols-5 gap-4 mb-6">
                  {[
                    { stage: 'ideation', icon: <Star />, label: 'Ideation', color: '#3b82f6' },
                    { stage: 'scripting', icon: <FileText />, label: 'Scripting', color: '#10b981' },
                    { stage: 'filming', icon: <Camera />, label: 'Filming', color: '#f59e0b' },
                    { stage: 'editing', icon: <Edit3 />, label: 'Editing', color: '#8b5cf6' },
                    { stage: 'publishing', icon: <Upload />, label: 'Publishing', color: '#ef4444' }
                  ].map(({ stage, icon, label, color }) => {
                    const stageEvents = events.filter(e => e.stages && e.stages[stage].completed);
                    const totalEvents = events.filter(e => e.stages).length;
                    const percentage = totalEvents > 0 ? (stageEvents.length / totalEvents) * 100 : 0;

                    return (
                      <Card key={stage} className="text-center">
                        <div className="p-3 rounded-xl mx-auto mb-3 w-12 h-12 flex items-center justify-center" style={{ backgroundColor: `${color}20`, color }}>
                          {icon}
                        </div>
                        <h4 className="font-medium text-[var(--text-primary)] mb-1">{label}</h4>
                        <div className="text-2xl font-bold text-[var(--text-primary)] mb-1">{stageEvents.length}</div>
                        <div className="text-xs text-[var(--text-secondary)]">{Math.round(percentage)}% complete</div>
                        <div className="w-full h-2 bg-[var(--surface-tertiary)] rounded-full mt-2 overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${percentage}%`, backgroundColor: color }} />
                        </div>
                      </Card>
                    );
                  })}
                </div>

                {/* Content Items with Stages */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-[var(--text-primary)]">Content Pipeline</h3>
                  {events.filter(e => e.stages).map(event => {
                    const stages = [
                      { key: 'ideation', icon: <Star className="w-4 h-4" />, label: 'Ideation', color: '#3b82f6' },
                      { key: 'scripting', icon: <FileText className="w-4 h-4" />, label: 'Scripting', color: '#10b981' },
                      { key: 'filming', icon: <Camera className="w-4 h-4" />, label: 'Filming', color: '#f59e0b' },
                      { key: 'editing', icon: <Edit3 className="w-4 h-4" />, label: 'Editing', color: '#8b5cf6' },
                      { key: 'publishing', icon: <Upload className="w-4 h-4" />, label: 'Publishing', color: '#ef4444' }
                    ];

                    const completedStages = stages.filter(stage => event.stages[stage.key].completed).length;
                    const progressPercentage = (completedStages / stages.length) * 100;

                    return (
                      <Card key={event.id} className="space-y-4">
                        {/* Event Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: event.color }} />
                            <div>
                              <h4 className="font-medium text-[var(--text-primary)]">{event.title}</h4>
                              <div className="flex items-center space-x-2 text-sm text-[var(--text-secondary)]">
                                <span>{event.platform.join(', ')}</span>
                                <span>•</span>
                                <span>{event.startDate.toLocaleDateString()}</span>
                                {event.dependencies && event.dependencies.length > 0 && (
                                  <>
                                    <span>•</span>
                                    <span className="flex items-center space-x-1">
                                      <AlertCircle className="w-3 h-3" />
                                      <span>{event.dependencies.length} dependencies</span>
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={event.status === 'completed' ? 'success' : event.status === 'in_progress' ? 'warning' : 'neutral'}>
                              {event.status}
                            </Badge>
                            <div className="text-right">
                              <div className="text-sm font-medium text-[var(--text-primary)]">{completedStages}/5</div>
                              <div className="text-xs text-[var(--text-secondary)]">{Math.round(progressPercentage)}%</div>
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-2 bg-[var(--surface-tertiary)] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] rounded-full transition-all duration-500"
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>

                        {/* Stages Timeline */}
                        <div className="flex items-center justify-between">
                          {stages.map((stage, index) => {
                            const stageData = event.stages[stage.key];
                            const isCompleted = stageData.completed;
                            const isCurrent = !isCompleted && (index === 0 || stages[index - 1] && event.stages[stages[index - 1].key].completed);

                            return (
                              <div key={stage.key} className="flex flex-col items-center space-y-2 flex-1">
                                <div className={`
                                  w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                                  ${isCompleted
                                    ? 'bg-gradient-to-r from-[var(--color-success)] to-[var(--color-success)]/80 text-white shadow-lg'
                                    : isCurrent
                                    ? 'bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] text-white shadow-lg animate-pulse'
                                    : 'bg-[var(--surface-tertiary)] text-[var(--text-tertiary)]'
                                  }
                                `}>
                                  {isCompleted ? <CheckCircle className="w-5 h-5" /> : stage.icon}
                                </div>
                                <div className="text-center">
                                  <div className={`text-xs font-medium ${isCompleted ? 'text-[var(--color-success)]' : isCurrent ? 'text-[var(--brand-primary)]' : 'text-[var(--text-tertiary)]'}`}>
                                    {stage.label}
                                  </div>
                                  {stageData.completedAt && (
                                    <div className="text-xs text-[var(--text-tertiary)]">
                                      {stageData.completedAt.toLocaleDateString()}
                                    </div>
                                  )}
                                  {stageData.notes && (
                                    <div className="text-xs text-[var(--text-secondary)] mt-1 max-w-20 truncate" title={stageData.notes}>
                                      {stageData.notes}
                                    </div>
                                  )}
                                </div>
                                {index < stages.length - 1 && (
                                  <div className={`absolute w-full h-0.5 top-5 left-1/2 transform translate-x-1/2 ${isCompleted ? 'bg-[var(--color-success)]' : 'bg-[var(--surface-tertiary)]'}`}
                                       style={{ width: '100%', zIndex: -1 }} />
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Quick Actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-[var(--border-primary)]">
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEventClick(event)}>
                              <Edit3 className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Copy className="w-3 h-3 mr-1" />
                              Duplicate
                            </Button>
                          </div>

                          <Button variant="ghost" size="sm">
                            <Eye className="w-3 h-3 mr-1" />
                            View Details
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Batch Planning Modal */}
      <AnimatePresence>
        {showBatchPlanning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowBatchPlanning(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[var(--surface-secondary)] rounded-2xl border border-[var(--border-primary)] shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
            >
              {/* Batch Planning Header */}
              <div className="flex items-center justify-between p-6 border-b border-[var(--border-primary)]">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)] text-white">
                    <Copy className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-[var(--text-primary)]">Batch Content Planning</h2>
                    <p className="text-sm text-[var(--text-secondary)]">Create and manage content series efficiently</p>
                  </div>
                </div>
                <Button variant="ghost" onClick={() => setShowBatchPlanning(false)}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>

              {/* Batch Planning Content */}
              <div className="p-6 overflow-y-auto max-h-[65vh] space-y-6">
                {/* Current Batches */}
                <div>
                  <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">Active Content Batches</h3>

                  {/* Tech Series 2024 Batch */}
                  <Card className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-[var(--brand-primary)]/10">
                          <Layers className="w-5 h-5 text-[var(--brand-primary)]" />
                        </div>
                        <div>
                          <h4 className="font-medium text-[var(--text-primary)]">Tech Series 2024</h4>
                          <p className="text-sm text-[var(--text-secondary)]">Educational content about technology trends</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="info">2 items</Badge>
                        <Button variant="ghost" size="sm">
                          <Edit3 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Batch Items */}
                    <div className="space-y-2 pl-4 border-l-2 border-[var(--brand-primary)]/20">
                      {events.filter(e => e.batchId === 'tech-series-2024').map(event => (
                        <div key={event.id} className="flex items-center justify-between p-3 bg-[var(--surface-tertiary)] rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: event.color }} />
                            <div>
                              <span className="text-sm font-medium text-[var(--text-primary)]">{event.title}</span>
                              <div className="text-xs text-[var(--text-secondary)]">
                                {event.startDate.toLocaleDateString()} • {event.platform.join(', ')}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {event.dependencies && event.dependencies.length > 0 && (
                              <Badge variant="warning" size="sm">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                Dependent
                              </Badge>
                            )}
                            <Badge variant={event.status === 'completed' ? 'success' : event.status === 'in_progress' ? 'warning' : 'neutral'} size="sm">
                              {event.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Batch Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-[var(--border-primary)]">
                      <div className="text-sm text-[var(--text-secondary)]">
                        Estimated completion: {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Plus className="w-3 h-3 mr-1" />
                          Add Content
                        </Button>
                        <Button variant="primary" size="sm">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Auto-Schedule
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Batch Templates */}
                <div>
                  <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">Batch Templates</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        name: 'Weekly Series',
                        description: 'Create a weekly content series',
                        icon: <Calendar className="w-5 h-5" />,
                        items: 4,
                        duration: '1 month'
                      },
                      {
                        name: 'Product Launch',
                        description: 'Complete product launch campaign',
                        icon: <Zap className="w-5 h-5" />,
                        items: 8,
                        duration: '6 weeks'
                      },
                      {
                        name: 'Educational Course',
                        description: 'Multi-part educational content',
                        icon: <Target className="w-5 h-5" />,
                        items: 12,
                        duration: '3 months'
                      },
                      {
                        name: 'Event Coverage',
                        description: 'Pre, during, and post event content',
                        icon: <Camera className="w-5 h-5" />,
                        items: 6,
                        duration: '2 weeks'
                      }
                    ].map(template => (
                      <Card key={template.name} variant="hover" className="cursor-pointer">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 rounded-lg bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]">
                            {template.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-[var(--text-primary)] mb-1">{template.name}</h4>
                            <p className="text-sm text-[var(--text-secondary)] mb-2">{template.description}</p>
                            <div className="flex items-center space-x-3 text-xs text-[var(--text-tertiary)]">
                              <span>{template.items} items</span>
                              <span>•</span>
                              <span>{template.duration}</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Quick Batch Creator */}
                <Card className="bg-gradient-to-r from-[var(--brand-primary)]/5 to-[var(--brand-secondary)]/5 border-[var(--brand-primary)]/20">
                  <div className="space-y-4">
                    <h4 className="font-medium text-[var(--text-primary)]">Quick Batch Creator</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Batch Name</label>
                        <input
                          type="text"
                          placeholder="e.g., Summer Campaign 2024"
                          className="w-full px-3 py-2 bg-[var(--surface-tertiary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:border-[var(--brand-primary)] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Content Count</label>
                        <select className="w-full px-3 py-2 bg-[var(--surface-tertiary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:border-[var(--brand-primary)] focus:outline-none">
                          <option value="4">4 pieces</option>
                          <option value="6">6 pieces</option>
                          <option value="8">8 pieces</option>
                          <option value="12">12 pieces</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-[var(--text-secondary)]">
                        Auto-generate content ideas and optimal scheduling
                      </div>
                      <Button variant="primary">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Create Batch
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[var(--surface-secondary)] rounded-2xl border border-[var(--border-primary)] shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            >
              {/* Settings Header */}
              <div className="flex items-center justify-between p-6 border-b border-[var(--border-primary)]">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)] text-white">
                    <Settings className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-[var(--text-primary)]">Calendar Settings</h2>
                    <p className="text-sm text-[var(--text-secondary)]">Customize your calendar experience</p>
                  </div>
                </div>
                <Button variant="ghost" onClick={() => setShowSettings(false)}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>

              {/* Settings Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6">
                {/* General Settings */}
                <div>
                  <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">General</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-[var(--text-primary)]">Enable Notifications</label>
                        <p className="text-xs text-[var(--text-secondary)]">Get reminders for upcoming events</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications}
                          onChange={(e) => setSettings(prev => ({ ...prev, notifications: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[var(--surface-tertiary)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--brand-primary)]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-[var(--text-primary)]">Auto-archive Completed Events</label>
                        <p className="text-xs text-[var(--text-secondary)]">Automatically move completed events to archive</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.autoArchive}
                          onChange={(e) => setSettings(prev => ({ ...prev, autoArchive: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[var(--surface-tertiary)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--brand-primary)]"></div>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Default View</label>
                      <select
                        value={settings.defaultView}
                        onChange={(e) => setSettings(prev => ({ ...prev, defaultView: e.target.value as any }))}
                        className="w-full px-3 py-2 bg-[var(--surface-tertiary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:border-[var(--brand-primary)] focus:outline-none"
                      >
                        <option value="month">Month View</option>
                        <option value="week">Week View</option>
                        <option value="day">Day View</option>
                        <option value="agenda">Agenda View</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Week Starts On</label>
                      <select
                        value={settings.weekStartsOn}
                        onChange={(e) => setSettings(prev => ({ ...prev, weekStartsOn: parseInt(e.target.value) as 0 | 1 }))}
                        className="w-full px-3 py-2 bg-[var(--surface-tertiary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:border-[var(--brand-primary)] focus:outline-none"
                      >
                        <option value={0}>Sunday</option>
                        <option value={1}>Monday</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Working Hours */}
                <div>
                  <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">Working Hours</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Start Time</label>
                        <input
                          type="time"
                          value={settings.workingHours.start}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            workingHours: { ...prev.workingHours, start: e.target.value }
                          }))}
                          className="w-full px-3 py-2 bg-[var(--surface-tertiary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:border-[var(--brand-primary)] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">End Time</label>
                        <input
                          type="time"
                          value={settings.workingHours.end}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            workingHours: { ...prev.workingHours, end: e.target.value }
                          }))}
                          className="w-full px-3 py-2 bg-[var(--surface-tertiary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:border-[var(--brand-primary)] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-[var(--text-primary)]">Include Weekends</label>
                        <p className="text-xs text-[var(--text-secondary)]">Allow scheduling on weekends</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.workingHours.weekends}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            workingHours: { ...prev.workingHours, weekends: e.target.checked }
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[var(--surface-tertiary)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--brand-primary)]"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Defaults */}
                <div>
                  <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">Defaults</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Default Event Duration (minutes)</label>
                      <input
                        type="number"
                        min="15"
                        max="480"
                        step="15"
                        value={settings.defaultEventDuration}
                        onChange={(e) => setSettings(prev => ({ ...prev, defaultEventDuration: parseInt(e.target.value) }))}
                        className="w-full px-3 py-2 bg-[var(--surface-tertiary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:border-[var(--brand-primary)] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Default Reminder (minutes before)</label>
                      <select
                        value={settings.reminderDefault}
                        onChange={(e) => setSettings(prev => ({ ...prev, reminderDefault: parseInt(e.target.value) }))}
                        className="w-full px-3 py-2 bg-[var(--surface-tertiary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:border-[var(--brand-primary)] focus:outline-none"
                      >
                        <option value={0}>No reminder</option>
                        <option value={5}>5 minutes</option>
                        <option value={15}>15 minutes</option>
                        <option value={30}>30 minutes</option>
                        <option value={60}>1 hour</option>
                        <option value={120}>2 hours</option>
                        <option value={1440}>1 day</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Event Templates */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-[var(--text-primary)]">Event Templates</h3>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setShowTemplatesModal(true)}
                    >
                      <Grid3X3 className="w-4 h-4 mr-2" />
                      Manage Templates
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm text-[var(--text-secondary)]">
                      Save frequently used event formats as templates for quick creation.
                    </p>

                    {eventTemplates.length > 0 ? (
                      <div className="grid grid-cols-1 gap-2">
                        {eventTemplates.slice(0, 3).map(template => (
                          <div
                            key={template.id}
                            className="flex items-center justify-between p-3 bg-[var(--surface-tertiary)] rounded-lg border border-[var(--border-primary)]"
                          >
                            <div className="flex items-center space-x-3">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: template.color }}
                              />
                              <div>
                                <p className="text-sm font-medium text-[var(--text-primary)]">
                                  {template.title}
                                </p>
                                <p className="text-xs text-[var(--text-secondary)]">
                                  {template.type} • {template.platform.join(', ')}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => loadFromTemplate(template)}
                            >
                              Use
                            </Button>
                          </div>
                        ))}
                        {eventTemplates.length > 3 && (
                          <p className="text-xs text-[var(--text-secondary)] text-center">
                            +{eventTemplates.length - 3} more templates available
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="text-center p-6 bg-[var(--surface-tertiary)] rounded-lg border border-[var(--border-primary)]">
                        <Grid3X3 className="w-8 h-8 text-[var(--text-tertiary)] mx-auto mb-2" />
                        <p className="text-sm text-[var(--text-secondary)]">No templates saved yet</p>
                        <p className="text-xs text-[var(--text-tertiary)]">Create an event and save it as a template</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Data Management */}
                <div>
                  <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">Data Management</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-[var(--surface-tertiary)] rounded-lg border border-[var(--border-primary)]">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-[var(--text-primary)] mb-1">Clear Calendar</h4>
                          <p className="text-xs text-[var(--text-secondary)] mb-3">
                            Remove all events from your calendar. This action cannot be undone.
                          </p>
                          <p className="text-xs text-[var(--text-tertiary)]">
                            Current events: {events.length}
                          </p>
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          disabled={events.length === 0}
                          onClick={() => {
                            if (window.confirm('Are you sure you want to clear all calendar events? This action cannot be undone.')) {
                              setEvents([]);
                              // Clear from localStorage as well
                              try {
                                localStorage.removeItem('calendarEvents_v2');
                              } catch (error) {
                                console.error('Failed to clear calendar from storage:', error);
                              }
                            }
                          }}
                          className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Clear Calendar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Settings Footer */}
              <div className="flex items-center justify-between p-6 border-t border-[var(--border-primary)]">
                <Button variant="ghost" onClick={() => setShowSettings(false)}>
                  Cancel
                </Button>
                <div className="flex space-x-3">
                  <Button variant="secondary" onClick={() => {
                    // Reset to defaults
                    setSettings({
                      notifications: true,
                      autoArchive: false,
                      defaultView: 'month',
                      workingHours: { start: '09:00', end: '17:00', weekends: false },
                      timeZone: 'UTC',
                      language: 'en',
                      theme: 'auto',
                      defaultEventDuration: 60,
                      reminderDefault: 15,
                      weekStartsOn: 0,
                    });
                  }}>
                    Reset to Defaults
                  </Button>
                  <Button variant="primary" onClick={() => {
                    // Apply settings
                    setViewMode(settings.defaultView);
                    setShowSettings(false);
                    // Here you would typically save to localStorage or backend
                    console.log('Settings saved:', settings);
                  }}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Settings
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Event Templates Modal */}
      <AnimatePresence>
        {showTemplatesModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowTemplatesModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[var(--surface-secondary)] rounded-2xl border border-[var(--border-primary)] shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
            >
              {/* Templates Header */}
              <div className="flex items-center justify-between p-6 border-b border-[var(--border-primary)]">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)] text-white">
                    <Grid3X3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-[var(--text-primary)]">Event Templates</h2>
                    <p className="text-sm text-[var(--text-secondary)]">Manage your saved event templates</p>
                  </div>
                </div>
                <Button variant="ghost" onClick={() => setShowTemplatesModal(false)}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>

              {/* Templates Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {eventTemplates.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {eventTemplates.map(template => (
                      <Card key={template.id} className="relative">
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div
                                className="w-4 h-4 rounded-full flex-shrink-0"
                                style={{ backgroundColor: template.color }}
                              />
                              <div>
                                <h3 className="font-medium text-[var(--text-primary)]">
                                  {template.title}
                                </h3>
                                <p className="text-sm text-[var(--text-secondary)]">
                                  {template.type}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteTemplate(template.id)}
                              className="text-red-500 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          {template.description && (
                            <p className="text-sm text-[var(--text-secondary)] mb-3">
                              {template.description}
                            </p>
                          )}

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {template.priority}
                              </Badge>
                              <Badge variant="neutral" className="text-xs">
                                {template.status}
                              </Badge>
                            </div>

                            <div className="flex flex-wrap gap-1">
                              {template.platform.map(platform => (
                                <Badge key={platform} variant="secondary" className="text-xs">
                                  {platform}
                                </Badge>
                              ))}
                            </div>

                            {template.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {template.tags.slice(0, 3).map(tag => (
                                  <Badge key={tag} variant="neutral" className="text-xs">
                                    #{tag}
                                  </Badge>
                                ))}
                                {template.tags.length > 3 && (
                                  <span className="text-xs text-[var(--text-secondary)]">
                                    +{template.tags.length - 3} more
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          <Button
                            variant="primary"
                            size="sm"
                            className="w-full"
                            onClick={() => loadFromTemplate(template)}
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Use Template
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Grid3X3 className="w-16 h-16 text-[var(--text-tertiary)] mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
                      No Templates Yet
                    </h3>
                    <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
                      Create your first event template by saving an event. Templates help you quickly create similar events.
                    </p>
                    <Button
                      variant="primary"
                      onClick={() => {
                        setShowTemplatesModal(false);
                        handleCreateEvent();
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Event
                    </Button>
                  </div>
                )}
              </div>

              {/* Templates Footer */}
              <div className="flex items-center justify-between p-6 border-t border-[var(--border-primary)]">
                <div className="text-sm text-[var(--text-secondary)]">
                  {eventTemplates.length} template{eventTemplates.length !== 1 ? 's' : ''} saved
                </div>
                <Button variant="primary" onClick={() => setShowTemplatesModal(false)}>
                  Done
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CalendarWorldClass;
