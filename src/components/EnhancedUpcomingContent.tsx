import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Calendar,
  Plus,
  Edit3,
  Copy,
  Trash2,
  Play,
  Pause,
  MoreHorizontal,
  ArrowRight,
  Eye,
  Star,
  Tag,
  MapPin,
  Users,
  Target,
  TrendingUp,
  Zap,
  CheckCircle,
  AlertCircle,
  Info,
  Share2,
  Download,
  Upload,
  Settings,
  Filter,
  Search,
  Grid3X3,
  List,
  Calendar as CalendarIcon,
  BarChart3,
  Bell,
  BellOff,
  Globe,
  Smartphone,
  Monitor,
  Hash,
  MessageSquare,
  Heart,
  RefreshCw,
} from "lucide-react";
import {
  YouTubeIcon,
  TikTokIcon,
  InstagramIcon,
  TwitterIcon,
  LinkedInIcon,
  FacebookIcon,
} from './ProfessionalIcons';
import { CalendarEvent } from "./ProfessionalCalendar";
import { Platform } from "../types";
import {
  Button,
  Card,
  Badge,
  TabHeader,
  StatCard,
  EmptyState,
  GradientText,
  Input,
  ProgressBar
} from "./ui/WorldClassComponents";

interface EnhancedUpcomingContentProps {
  events: CalendarEvent[];
  onEventCreate?: (event: Omit<CalendarEvent, "id">) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
  onEventDelete?: (eventId: string) => void;
  className?: string;
}

// Platform configurations with modern colors and AI-powered scheduling insights
const PLATFORM_CONFIG = {
  [Platform.YouTube]: {
    name: "YouTube",
    color: "#FF0000",
    icon: YouTubeIcon,
    bestTimes: ["14:00", "15:00", "20:00", "21:00"],
    avgEngagement: "3.2%",
    peakDays: ["Thu", "Fri", "Sat"],
    contentTypes: ["Long-form", "Shorts", "Live", "Tutorials"],
    insights: "Video content performs 40% better in afternoon and evening slots"
  },
  [Platform.TikTok]: {
    name: "TikTok",
    color: "#000000",
    icon: TikTokIcon,
    bestTimes: ["06:00", "10:00", "18:00", "19:00"],
    avgEngagement: "5.8%",
    peakDays: ["Tue", "Thu", "Sun"],
    contentTypes: ["Short-form", "Trends", "Challenges", "Educational"],
    insights: "Peak engagement occurs during commute hours and evening scroll sessions"
  },
  [Platform.Instagram]: {
    name: "Instagram",
    color: "#E4405F",
    icon: InstagramIcon,
    bestTimes: ["11:00", "13:00", "17:00", "19:00"],
    avgEngagement: "4.1%",
    peakDays: ["Tue", "Wed", "Thu"],
    contentTypes: ["Posts", "Stories", "Reels", "IGTV"],
    insights: "Visual content performs best during lunch breaks and evening leisure time"
  },
  [Platform.Twitter]: {
    name: "Twitter",
    color: "#1DA1F2",
    icon: TwitterIcon,
    bestTimes: ["08:00", "09:00", "12:00", "18:00"],
    avgEngagement: "2.7%",
    peakDays: ["Mon", "Tue", "Wed"],
    contentTypes: ["Tweets", "Threads", "Spaces", "News"],
    insights: "Real-time engagement peaks during work breaks and news cycles"
  },
  [Platform.LinkedIn]: {
    name: "LinkedIn",
    color: "#0077B5",
    icon: LinkedInIcon,
    bestTimes: ["08:00", "09:00", "12:00", "17:00"],
    avgEngagement: "3.9%",
    peakDays: ["Tue", "Wed", "Thu"],
    contentTypes: ["Professional", "Articles", "Updates", "Events"],
    insights: "B2B content performs optimally during business hours and lunch periods"
  },
  [Platform.Facebook]: {
    name: "Facebook",
    color: "#1877F2",
    icon: FacebookIcon,
    bestTimes: ["09:00", "13:00", "15:00"],
    avgEngagement: "2.3%",
    peakDays: ["Tue", "Wed", "Thu"],
    contentTypes: ["Posts", "Videos", "Events", "Groups"],
    insights: "Community-focused content thrives during mid-day and afternoon hours"
  },
};

const STATUS_CONFIG = {
  draft: {
    color: "#6B7280",
    label: "Draft",
    icon: Edit3,
    description: "Content being prepared"
  },
  scheduled: {
    color: "#3B82F6",
    label: "Scheduled",
    icon: Clock,
    description: "Ready to publish"
  },
  published: {
    color: "#10B981",
    label: "Published",
    icon: CheckCircle,
    description: "Live content"
  },
  failed: {
    color: "#EF4444",
    label: "Failed",
    icon: AlertCircle,
    description: "Publishing error"
  }
};

const PRIORITY_CONFIG = {
  low: { color: "#10B981", label: "Low Priority" },
  medium: { color: "#F59E0B", label: "Medium Priority" },
  high: { color: "#EF4444", label: "High Priority" }
};

const EnhancedUpcomingContent: React.FC<EnhancedUpcomingContentProps> = ({
  events,
  onEventCreate,
  onEventUpdate,
  onEventDelete,
  className = "",
}) => {
  const [viewMode, setViewMode] = useState<'timeline' | 'grid' | 'list'>('timeline');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'platform'>('date');
  const [selectedEvents, setSelectedEvents] = useState<Set<string>>(new Set());
  const [showBatchActions, setShowBatchActions] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState<string | null>(null);

  // Filter and sort upcoming events
  const upcomingEvents = useMemo(() => {
    const now = new Date();
    let filtered = events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= now || event.status === 'scheduled' || event.status === 'draft';
    });

    // Apply filters
    if (filterStatus !== 'all') {
      filtered = filtered.filter(event => event.status === filterStatus);
    }
    if (filterPlatform !== 'all') {
      filtered = filtered.filter(event => event.platform.toString() === filterPlatform);
    }
    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort events
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) - 
                 (priorityOrder[a.priority as keyof typeof priorityOrder] || 0);
        case 'platform':
          return PLATFORM_CONFIG[a.platform].name.localeCompare(PLATFORM_CONFIG[b.platform].name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [events, filterStatus, filterPlatform, searchQuery, sortBy]);

  // Group events by date for timeline view
  const groupedEvents = useMemo(() => {
    const groups: Record<string, CalendarEvent[]> = {};
    upcomingEvents.forEach(event => {
      const dateKey = new Date(event.date).toDateString();
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(event);
    });
    return groups;
  }, [upcomingEvents]);

  // Statistics
  const stats = useMemo(() => {
    const total = upcomingEvents.length;
    const scheduled = upcomingEvents.filter(e => e.status === 'scheduled').length;
    const drafts = upcomingEvents.filter(e => e.status === 'draft').length;
    const thisWeek = upcomingEvents.filter(e => {
      const eventDate = new Date(e.date);
      const weekFromNow = new Date();
      weekFromNow.setDate(weekFromNow.getDate() + 7);
      return eventDate <= weekFromNow;
    }).length;

    return { total, scheduled, drafts, thisWeek };
  }, [upcomingEvents]);

  // Event actions
  const handleEventAction = useCallback((action: string, event: CalendarEvent) => {
    switch (action) {
      case 'edit':
        // Trigger edit modal/form
        break;
      case 'duplicate':
        if (onEventCreate) {
          const duplicatedEvent = {
            ...event,
            title: `${event.title} (Copy)`,
            date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
          };
          delete (duplicatedEvent as any).id;
          onEventCreate(duplicatedEvent);
        }
        break;
      case 'reschedule':
        // Open reschedule modal
        break;
      case 'delete':
        if (onEventDelete) {
          onEventDelete(event.id);
        }
        break;
      case 'publish-now':
        if (onEventUpdate) {
          onEventUpdate({ ...event, status: 'published' });
        }
        break;
    }
    setShowQuickActions(null);
  }, [onEventCreate, onEventUpdate, onEventDelete]);

  // Batch operations
  const handleBatchAction = useCallback((action: string) => {
    const selectedEventsList = upcomingEvents.filter(e => selectedEvents.has(e.id));
    
    switch (action) {
      case 'delete':
        if (onEventDelete) {
          selectedEventsList.forEach(event => onEventDelete(event.id));
        }
        break;
      case 'reschedule':
        // Open batch reschedule modal
        break;
      case 'change-status':
        // Open batch status change modal
        break;
    }
    
    setSelectedEvents(new Set());
    setShowBatchActions(false);
  }, [selectedEvents, upcomingEvents, onEventDelete]);

  // Smart scheduling recommendations
  const getSchedulingRecommendation = (event: CalendarEvent) => {
    const platform = PLATFORM_CONFIG[event.platform];
    const eventDate = new Date(event.date);
    const eventTime = event.time || '12:00';
    const [hours] = eventTime.split(':');
    const isOptimalTime = platform.bestTimes.some(time => time.startsWith(hours));
    const dayOfWeek = eventDate.toLocaleDateString('en-US', { weekday: 'short' });
    const isOptimalDay = platform.peakDays.includes(dayOfWeek);

    if (isOptimalTime && isOptimalDay) {
      return { type: 'excellent', message: 'Excellent timing for maximum engagement' };
    } else if (isOptimalTime || isOptimalDay) {
      return { type: 'good', message: 'Good timing, consider optimizing further' };
    } else {
      return { type: 'suggestion', message: `Consider ${platform.bestTimes[0]} on ${platform.peakDays[0]} for better reach` };
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time?: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const isToday = (date: string) => {
    return new Date(date).toDateString() === new Date().toDateString();
  };

  const isTomorrow = (date: string) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return new Date(date).toDateString() === tomorrow.toDateString();
  };

  const getRelativeDate = (date: string) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    
    const eventDate = new Date(date);
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 7) {
      return `In ${diffDays} day${diffDays > 1 ? 's' : ''}`;
    }
    
    return eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Enhanced Header with Smart Insights */}
      <Card variant="glow" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
              <CalendarIcon className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                <GradientText>Upcoming Content</GradientText>
              </h2>
              <p className="text-[var(--text-secondary)]">
                {stats.total} scheduled posts • {stats.thisWeek} this week
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={() => setShowBatchActions(true)}>
              <Settings className="w-4 h-4" />
              Batch Actions
            </Button>
            <Button variant="secondary" size="sm" onClick={() => onEventCreate?.({
              title: '',
              description: '',
              date: new Date().toISOString().split('T')[0],
              platform: Platform.YouTube,
              color: PLATFORM_CONFIG[Platform.YouTube].color,
              status: 'draft',
              content: '',
              analyticsEnabled: true,
              notificationsEnabled: true
            })}>
              <Plus className="w-4 h-4" />
              Schedule New
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total Upcoming"
            value={stats.total.toString()}
            icon={<CalendarIcon />}
            description="content pieces"
            variant="info"
          />
          <StatCard
            title="Ready to Publish"
            value={stats.scheduled.toString()}
            icon={<CheckCircle />}
            description="scheduled posts"
            variant="success"
          />
          <StatCard
            title="In Draft"
            value={stats.drafts.toString()}
            icon={<Edit3 />}
            description="being prepared"
            variant="warning"
          />
          <StatCard
            title="This Week"
            value={stats.thisWeek.toString()}
            icon={<TrendingUp />}
            description="going live"
            variant="primary"
          />
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-tertiary)] w-4 h-4" />
              <Input
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>

            {/* Filters */}
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-[var(--surface-tertiary)] border border-[var(--border-primary)] rounded-lg text-sm"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="published">Published</option>
            </select>

            <select 
              value={filterPlatform} 
              onChange={(e) => setFilterPlatform(e.target.value)}
              className="px-3 py-2 bg-[var(--surface-tertiary)] border border-[var(--border-primary)] rounded-lg text-sm"
            >
              <option value="all">All Platforms</option>
              {Object.entries(PLATFORM_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>{config.name}</option>
              ))}
            </select>

            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-[var(--surface-tertiary)] border border-[var(--border-primary)] rounded-lg text-sm"
            >
              <option value="date">Sort by Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="platform">Sort by Platform</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex border border-[var(--border-primary)] rounded-lg">
            {[
              { id: 'timeline', icon: <Calendar className="w-4 h-4" />, label: 'Timeline' },
              { id: 'grid', icon: <Grid3X3 className="w-4 h-4" />, label: 'Grid' },
              { id: 'list', icon: <List className="w-4 h-4" />, label: 'List' },
            ].map((mode) => (
              <Button
                key={mode.id}
                variant={viewMode === mode.id ? "primary" : "ghost"}
                size="sm"
                onClick={() => setViewMode(mode.id as any)}
                className="rounded-none first:rounded-l-lg last:rounded-r-lg"
              >
                {mode.icon}
                <span className="ml-1 hidden sm:inline">{mode.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Content Display */}
      <AnimatePresence mode="wait">
        {upcomingEvents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <EmptyState
              icon={<CalendarIcon />}
              title="No upcoming content"
              description="Start by scheduling some content or promoting ideas to events"
              actionLabel="Schedule First Post"
              onAction={() => onEventCreate?.({
                title: '',
                description: '',
                date: new Date().toISOString().split('T')[0],
                platform: Platform.YouTube,
                color: PLATFORM_CONFIG[Platform.YouTube].color,
                status: 'draft',
                content: '',
                analyticsEnabled: true,
                notificationsEnabled: true
              })}
            />
          </motion.div>
        ) : (
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {viewMode === 'timeline' && (
              <div className="space-y-8">
                {Object.entries(groupedEvents).map(([dateString, dayEvents], dateIndex) => (
                  <motion.div
                    key={dateString}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: dateIndex * 0.1 }}
                    className="relative"
                  >
                    {/* Date Header */}
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="flex-shrink-0">
                        <div className={`px-4 py-2 rounded-xl text-sm font-medium ${
                          isToday(dayEvents[0].date) 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                            : isTomorrow(dayEvents[0].date)
                            ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-lg'
                            : 'bg-[var(--surface-tertiary)] text-[var(--text-secondary)]'
                        }`}>
                          {getRelativeDate(dayEvents[0].date)}
                        </div>
                      </div>
                      <div className="flex-1 h-px bg-gradient-to-r from-[var(--border-primary)] to-transparent"></div>
                      <div className="text-sm text-[var(--text-secondary)]">
                        {formatDate(dayEvents[0].date)}
                      </div>
                    </div>

                    {/* Events for this date */}
                    <div className="space-y-4 ml-8">
                      {dayEvents.map((event, eventIndex) => {
                        const platform = PLATFORM_CONFIG[event.platform];
                        const status = STATUS_CONFIG[event.status];
                        const recommendation = getSchedulingRecommendation(event);
                        const IconComponent = platform.icon;

                        return (
                          <motion.div
                            key={event.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: (dateIndex * 0.1) + (eventIndex * 0.05) }}
                            className="relative"
                          >
                            {/* Timeline connector */}
                            <div className="absolute -left-8 top-6 w-4 h-4 rounded-full border-4 border-[var(--surface-primary)] shadow-lg"
                                 style={{ backgroundColor: platform.color }}>
                            </div>
                            {eventIndex < dayEvents.length - 1 && (
                              <div className="absolute -left-6 top-10 w-px h-20 bg-[var(--border-primary)]"></div>
                            )}

                            <Card variant="hover" className="p-6 transition-all duration-200 hover:shadow-lg">
                              <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-4 flex-1">
                                  {/* Platform Icon */}
                                  <div className="flex-shrink-0 p-3 rounded-xl shadow-md"
                                       style={{ backgroundColor: `${platform.color}15`, border: `2px solid ${platform.color}20` }}>
                                    <IconComponent className="w-6 h-6" style={{ color: platform.color }} />
                                  </div>

                                  {/* Content Info */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-3 mb-2">
                                      <h3 className="text-lg font-semibold text-[var(--text-primary)] truncate">
                                        {event.title}
                                      </h3>
                                      <Badge 
                                        variant={status.color === '#10B981' ? 'success' : status.color === '#3B82F6' ? 'info' : 'warning'}
                                        className="flex items-center space-x-1"
                                      >
                                        <status.icon className="w-3 h-3" />
                                        <span>{status.label}</span>
                                      </Badge>
                                      {event.priority && (
                                        <Badge variant={event.priority === 'high' ? 'error' : event.priority === 'medium' ? 'warning' : 'neutral'}>
                                          {PRIORITY_CONFIG[event.priority as keyof typeof PRIORITY_CONFIG]?.label}
                                        </Badge>
                                      )}
                                    </div>

                                    {event.description && (
                                      <p className="text-[var(--text-secondary)] mb-3 line-clamp-2">
                                        {event.description}
                                      </p>
                                    )}

                                    <div className="flex items-center space-x-6 text-sm text-[var(--text-secondary)]">
                                      <div className="flex items-center space-x-1">
                                        <Clock className="w-4 h-4" />
                                        <span>{formatTime(event.time) || 'Time not set'}</span>
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        <Globe className="w-4 h-4" />
                                        <span>{platform.name}</span>
                                      </div>
                                      {event.tags && event.tags.length > 0 && (
                                        <div className="flex items-center space-x-1">
                                          <Tag className="w-4 h-4" />
                                          <span>{event.tags.slice(0, 2).join(', ')}</span>
                                          {event.tags.length > 2 && <span>+{event.tags.length - 2}</span>}
                                        </div>
                                      )}
                                    </div>

                                    {/* Smart Scheduling Recommendation */}
                                    <div className={`mt-3 px-3 py-2 rounded-lg text-sm ${
                                      recommendation.type === 'excellent' 
                                        ? 'bg-green-50 text-green-700 border border-green-200' 
                                        : recommendation.type === 'good'
                                        ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                                    }`}>
                                      <div className="flex items-center space-x-2">
                                        {recommendation.type === 'excellent' ? 
                                          <Star className="w-4 h-4" /> : 
                                          recommendation.type === 'good' ? 
                                          <TrendingUp className="w-4 h-4" /> : 
                                          <Info className="w-4 h-4" />
                                        }
                                        <span>{recommendation.message}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="flex items-center space-x-2 ml-4">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEventAction('edit', event)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEventAction('duplicate', event)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <Copy className="w-4 h-4" />
                                  </Button>
                                  <div className="relative">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setShowQuickActions(showQuickActions === event.id ? null : event.id)}
                                    >
                                      <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                    
                                    {/* Quick Actions Dropdown */}
                                    {showQuickActions === event.id && (
                                      <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        className="absolute right-0 top-full mt-2 w-48 bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-lg shadow-lg z-50"
                                      >
                                        <div className="p-2 space-y-1">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleEventAction('edit', event)}
                                            className="w-full justify-start"
                                          >
                                            <Edit3 className="w-4 h-4 mr-2" />
                                            Edit Content
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleEventAction('duplicate', event)}
                                            className="w-full justify-start"
                                          >
                                            <Copy className="w-4 h-4 mr-2" />
                                            Duplicate
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleEventAction('reschedule', event)}
                                            className="w-full justify-start"
                                          >
                                            <Clock className="w-4 h-4 mr-2" />
                                            Reschedule
                                          </Button>
                                          {event.status === 'scheduled' && (
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => handleEventAction('publish-now', event)}
                                              className="w-full justify-start"
                                            >
                                              <Play className="w-4 h-4 mr-2" />
                                              Publish Now
                                            </Button>
                                          )}
                                          <div className="border-t border-[var(--border-primary)] my-1"></div>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleEventAction('delete', event)}
                                            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                                          >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete
                                          </Button>
                                        </div>
                                      </motion.div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </Card>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map((event, index) => {
                  const platform = PLATFORM_CONFIG[event.platform];
                  const status = STATUS_CONFIG[event.status];
                  const IconComponent = platform.icon;

                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card variant="hover" className="p-4 h-full transition-all duration-200 hover:shadow-lg group">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-lg" style={{ backgroundColor: `${platform.color}15` }}>
                              <IconComponent className="w-5 h-5" style={{ color: platform.color }} />
                            </div>
                            <Badge variant={status.color === '#10B981' ? 'success' : 'info'}>
                              {status.label}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowQuickActions(showQuickActions === event.id ? null : event.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>

                        <h3 className="font-semibold text-[var(--text-primary)] mb-2 line-clamp-2">
                          {event.title}
                        </h3>

                        {event.description && (
                          <p className="text-sm text-[var(--text-secondary)] mb-3 line-clamp-3">
                            {event.description}
                          </p>
                        )}

                        <div className="space-y-2 text-sm text-[var(--text-secondary)]">
                          <div className="flex items-center space-x-2">
                            <CalendarIcon className="w-4 h-4" />
                            <span>{getRelativeDate(event.date)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span>{formatTime(event.time) || 'Time not set'}</span>
                          </div>
                        </div>

                        <div className="mt-4 flex space-x-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleEventAction('edit', event)}
                            className="flex-1"
                          >
                            <Edit3 className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEventAction('duplicate', event)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {viewMode === 'list' && (
              <Card>
                <div className="divide-y divide-[var(--border-primary)]">
                  {upcomingEvents.map((event, index) => {
                    const platform = PLATFORM_CONFIG[event.platform];
                    const status = STATUS_CONFIG[event.status];
                    const IconComponent = platform.icon;

                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="p-4 hover:bg-[var(--surface-secondary)] transition-colors group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 flex-1 min-w-0">
                            <div className="flex-shrink-0">
                              <input
                                type="checkbox"
                                checked={selectedEvents.has(event.id)}
                                onChange={(e) => {
                                  const newSelected = new Set(selectedEvents);
                                  if (e.target.checked) {
                                    newSelected.add(event.id);
                                  } else {
                                    newSelected.delete(event.id);
                                  }
                                  setSelectedEvents(newSelected);
                                }}
                                className="rounded border-[var(--border-primary)]"
                              />
                            </div>
                            
                            <div className="flex-shrink-0 p-2 rounded-lg" style={{ backgroundColor: `${platform.color}15` }}>
                              <IconComponent className="w-5 h-5" style={{ color: platform.color }} />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-3 mb-1">
                                <h3 className="font-medium text-[var(--text-primary)] truncate">
                                  {event.title}
                                </h3>
                                <Badge variant={status.color === '#10B981' ? 'success' : 'info'}>
                                  {status.label}
                                </Badge>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-[var(--text-secondary)]">
                                <span>{getRelativeDate(event.date)}</span>
                                <span>{formatTime(event.time) || 'No time set'}</span>
                                <span>{platform.name}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEventAction('edit', event)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEventAction('duplicate', event)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowQuickActions(showQuickActions === event.id ? null : event.id)}
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Batch Actions Panel */}
      {showBatchActions && selectedEvents.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
        >
          <Card className="p-4 shadow-lg border border-[var(--border-primary)]">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-[var(--text-primary)]">
                {selectedEvents.size} selected
              </span>
              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleBatchAction('reschedule')}
                >
                  <Clock className="w-4 h-4 mr-1" />
                  Reschedule
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleBatchAction('change-status')}
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Change Status
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleBatchAction('delete')}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedEvents(new Set());
                  setShowBatchActions(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default EnhancedUpcomingContent;
