import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusCircleIcon,
  ClockIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  TrashIcon,
  EditIcon,
} from "./IconComponents";
import { Platform } from "../types";
import ContentCalendarExtensions from "./ContentCalendarExtensions";
import calendarReminderService from "../services/calendarReminderService";

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  platform: Platform;
  color: string;
  content?: string;
  status: "draft" | "scheduled" | "published" | "failed";
  mediaFiles?: string[];
  tags?: string[];
  reminders?: {type: string, time: string}[];
  analyticsEnabled?: boolean;
  notificationsEnabled?: boolean;
}

interface ProfessionalCalendarProps {
  events: CalendarEvent[];
  onEventCreate: (event: Omit<CalendarEvent, "id">) => void;
  onEventUpdate: (event: CalendarEvent) => void;
  onEventDelete: (eventId: string) => void;
}

const PLATFORM_CONFIG = {
  [Platform.YouTube]: {
    color: "bg-red-500",
    lightColor: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-700",
    icon: "📺",
    gradient: "from-red-500 to-red-600",
  },
  [Platform.TikTok]: {
    color: "bg-gray-900",
    lightColor: "bg-gray-50",
    borderColor: "border-gray-200", 
    textColor: "text-gray-700",
    icon: "🎵",
    gradient: "from-gray-800 to-gray-900",
  },
  [Platform.Instagram]: {
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
    lightColor: "bg-pink-50",
    borderColor: "border-pink-200",
    textColor: "text-pink-700",
    icon: "📷",
    gradient: "from-purple-500 to-pink-500",
  },
  [Platform.Twitter]: {
    color: "bg-blue-500",
    lightColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-700", 
    icon: "🐦",
    gradient: "from-blue-500 to-blue-600",
  },
  [Platform.LinkedIn]: {
    color: "bg-blue-700",
    lightColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-800",
    icon: "💼",
    gradient: "from-blue-700 to-blue-800",
  },
  [Platform.Facebook]: {
    color: "bg-blue-600",
    lightColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-700",
    icon: "👥",
    gradient: "from-blue-600 to-blue-700",
  },
};

const STATUS_CONFIG = {
  draft: {
    color: "bg-amber-500",
    lightColor: "bg-amber-50",
    borderColor: "border-amber-200",
    textColor: "text-amber-700",
    icon: "📝",
    label: "Draft",
  },
  scheduled: {
    color: "bg-blue-500", 
    lightColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-700",
    icon: "⏰",
    label: "Scheduled",
  },
  published: {
    color: "bg-emerald-500",
    lightColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    textColor: "text-emerald-700",
    icon: "✅",
    label: "Published",
  },
  failed: {
    color: "bg-red-500",
    lightColor: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-700",
    icon: "❌",
    label: "Failed",
  },
};

export const ProfessionalCalendar: React.FC<ProfessionalCalendarProps> = ({
  events,
  onEventCreate,
  onEventUpdate,
  onEventDelete,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [editingEvent, setEditingEvent] = useState<Partial<CalendarEvent> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);

  // Best Time Recommendations state
  const [showBestTimeModal, setShowBestTimeModal] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState("");
  const [userTimezone, setUserTimezone] = useState("");
  const [selectedPlatformForTiming, setSelectedPlatformForTiming] = useState<Platform>(Platform.Instagram);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  // Advanced Options state
  const [showTagsModal, setShowTagsModal] = useState(false);
  const [showRemindersModal, setShowRemindersModal] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [eventTags, setEventTags] = useState<string[]>([]);
  const [eventReminders, setEventReminders] = useState<{type: string, time: string}[]>([]);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Initialize reminders when events change
  useEffect(() => {
    calendarReminderService.initializeReminders(events);
  }, [events]);

  // Initialize toggle visual states when modal opens
  useEffect(() => {
    if (isModalOpen) {
      // Set analytics toggle visual state
      setTimeout(() => {
        const analyticsCard = document.querySelector('#analytics-toggle')?.closest('.option-card');
        if (analyticsCard) {
          if (analyticsEnabled) {
            analyticsCard.classList.add('toggle-enabled');
          } else {
            analyticsCard.classList.remove('toggle-enabled');
          }
        }

        // Set notifications toggle visual state
        const notificationsCard = document.querySelector('#notifications-toggle')?.closest('.option-card');
        if (notificationsCard) {
          if (notificationsEnabled) {
            notificationsCard.classList.add('toggle-enabled');
          } else {
            notificationsCard.classList.remove('toggle-enabled');
          }
        }
      }, 100);
    }
  }, [isModalOpen, analyticsEnabled, notificationsEnabled]);

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const dateString = date.toISOString().split("T")[0];
      const dayEvents = events.filter((event) => event.date === dateString);

      days.push({
        date,
        isCurrentMonth: date.getMonth() === currentMonth,
        isToday: date.toDateString() === new Date().toDateString(),
        events: dayEvents,
      });
    }

    return days;
  }, [currentYear, currentMonth, events]);

  // Filter events by selected platforms
  const filteredEvents = useMemo(() => {
    if (selectedPlatforms.length === 0) return events;
    return events.filter((event) => selectedPlatforms.includes(event.platform));
  }, [events, selectedPlatforms]);

  const handleDateClick = useCallback((date: Date) => {
    setSelectedDate(date);
    setEditingEvent({
      date: date.toISOString().split("T")[0],
      platform: Platform.Instagram,
      status: "draft",
    });
    // Reset advanced options for new event
    setEventTags([]);
    setEventReminders([]);
    setAnalyticsEnabled(true);
    setNotificationsEnabled(true);
    setIsModalOpen(true);
  }, []);

  const handleEventClick = useCallback(
    (event: CalendarEvent, e: React.MouseEvent) => {
      e.stopPropagation();
      setEditingEvent(event);
      // Load existing advanced options
      setEventTags(event.tags || []);
      setEventReminders(event.reminders || []);
      setAnalyticsEnabled(event.analyticsEnabled ?? true);
      setNotificationsEnabled(event.notificationsEnabled ?? true);
      setIsModalOpen(true);
    },
    [],
  );

  // Language to region/timezone mapping
  const languageRegions = {
    English: [
      { region: "United States", timezone: "UTC-5", weight: 0.4 },
      { region: "United Kingdom", timezone: "UTC+0", weight: 0.2 },
      { region: "Canada", timezone: "UTC-5", weight: 0.15 },
      { region: "Australia", timezone: "UTC+10", weight: 0.15 },
      { region: "India", timezone: "UTC+5:30", weight: 0.1 },
    ],
    Spanish: [
      { region: "Mexico", timezone: "UTC-6", weight: 0.3 },
      { region: "Spain", timezone: "UTC+1", weight: 0.25 },
      { region: "Argentina", timezone: "UTC-3", weight: 0.2 },
      { region: "Colombia", timezone: "UTC-5", weight: 0.15 },
      { region: "Chile", timezone: "UTC-3", weight: 0.1 },
    ],
    French: [
      { region: "France", timezone: "UTC+1", weight: 0.5 },
      { region: "Canada (Quebec)", timezone: "UTC-5", weight: 0.3 },
      { region: "Belgium", timezone: "UTC+1", weight: 0.1 },
      { region: "Switzerland", timezone: "UTC+1", weight: 0.1 },
    ],
    German: [
      { region: "Germany", timezone: "UTC+1", weight: 0.6 },
      { region: "Austria", timezone: "UTC+1", weight: 0.25 },
      { region: "Switzerland", timezone: "UTC+1", weight: 0.15 },
    ],
    Portuguese: [
      { region: "Brazil", timezone: "UTC-3", weight: 0.7 },
      { region: "Portugal", timezone: "UTC+0", weight: 0.3 },
    ],
    Japanese: [{ region: "Japan", timezone: "UTC+9", weight: 1.0 }],
    Korean: [{ region: "South Korea", timezone: "UTC+9", weight: 1.0 }],
    Chinese: [
      { region: "China", timezone: "UTC+8", weight: 0.8 },
      { region: "Taiwan", timezone: "UTC+8", weight: 0.2 },
    ],
    Arabic: [
      { region: "Saudi Arabia", timezone: "UTC+3", weight: 0.3 },
      { region: "UAE", timezone: "UTC+4", weight: 0.25 },
      { region: "Egypt", timezone: "UTC+2", weight: 0.2 },
      { region: "Morocco", timezone: "UTC+1", weight: 0.15 },
      { region: "Jordan", timezone: "UTC+3", weight: 0.1 },
    ],
    Hindi: [{ region: "India", timezone: "UTC+5:30", weight: 1.0 }],
    Italian: [
      { region: "Italy", timezone: "UTC+1", weight: 0.9 },
      { region: "Switzerland", timezone: "UTC+1", weight: 0.1 },
    ],
  };

  // Convert timezone string to UTC offset in hours
  const getUtcOffset = (timezoneStr: string): number => {
    const match = timezoneStr.match(/UTC([+-]?\d+(?::\d+)?)/);
    if (!match) return 0;

    const [, offset] = match;
    if (offset.includes(":")) {
      const [hours, minutes] = offset.split(":").map(Number);
      return hours + (minutes / 60) * (hours >= 0 ? 1 : -1);
    }
    return Number(offset);
  };

  // Convert time from one timezone to another
  const convertTime = (
    time: string,
    fromTimezone: string,
    toTimezone: string,
  ): string => {
    const [hours, minutes] = time.split(":").map(Number);
    const fromOffset = getUtcOffset(fromTimezone);
    const toOffset = getUtcOffset(toTimezone);

    const utcHours = hours - fromOffset;
    const targetHours = utcHours + toOffset;

    let finalHours = targetHours % 24;
    if (finalHours < 0) finalHours += 24;

    return `${finalHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  };

  // Generate best time recommendations
  const generateBestTimeRecommendations = useCallback(() => {
    if (!targetLanguage || !userTimezone || !selectedPlatformForTiming) {
      return;
    }

    // Platform timing data (simplified for brevity)
    const platformTimingData = {
      [Platform.Instagram]: {
        English: { weekdays: ["11:00", "14:00", "17:00"], weekends: ["10:00", "13:00", "16:00"] },
        Spanish: { weekdays: ["12:00", "15:00", "19:00"], weekends: ["11:00", "14:00", "18:00"] },
        // Add more languages as needed
      },
      [Platform.TikTok]: {
        English: { weekdays: ["06:00", "10:00", "19:00"], weekends: ["09:00", "12:00", "15:00"] },
        Spanish: { weekdays: ["07:00", "11:00", "20:00"], weekends: ["10:00", "13:00", "16:00"] },
      },
      // Add other platforms...
    };

    const platformData = platformTimingData[selectedPlatformForTiming];
    const languageData = platformData?.[targetLanguage] || platformData?.["English"];
    const regions = languageRegions[targetLanguage] || languageRegions["English"];

    if (!languageData) return;

    // Generate recommendations for each region and convert to user timezone
    const regionalRecommendations = regions.map((region) => {
      const convertedWeekdayTimes = languageData.weekdays.map((time) =>
        convertTime(time, region.timezone, userTimezone),
      );
      const convertedWeekendTimes = languageData.weekends.map((time) =>
        convertTime(time, region.timezone, userTimezone),
      );

      return {
        region: region.region,
        weight: region.weight,
        weekdays: convertedWeekdayTimes,
        weekends: convertedWeekendTimes,
      };
    });

    // Use primary region's times (highest weight)
    const primaryRegion = regionalRecommendations[0];

    // Generate day-specific recommendations
    const newRecommendations = [
      {
        day: "Monday",
        times: primaryRegion.weekdays,
        type: "weekday",
        targetRegions: regions.slice(0, 3).map((r) => `${r.region} (${Math.round(r.weight * 100)}%)`),
      },
      {
        day: "Tuesday", 
        times: primaryRegion.weekdays,
        type: "weekday",
        targetRegions: regions.slice(0, 3).map((r) => `${r.region} (${Math.round(r.weight * 100)}%)`),
      },
      {
        day: "Wednesday",
        times: primaryRegion.weekdays,
        type: "weekday", 
        targetRegions: regions.slice(0, 3).map((r) => `${r.region} (${Math.round(r.weight * 100)}%)`),
      },
      {
        day: "Thursday",
        times: primaryRegion.weekdays,
        type: "weekday",
        targetRegions: regions.slice(0, 3).map((r) => `${r.region} (${Math.round(r.weight * 100)}%)`),
      },
      {
        day: "Friday",
        times: primaryRegion.weekdays,
        type: "weekday",
        targetRegions: regions.slice(0, 3).map((r) => `${r.region} (${Math.round(r.weight * 100)}%)`),
      },
      {
        day: "Saturday",
        times: primaryRegion.weekends,
        type: "weekend",
        targetRegions: regions.slice(0, 3).map((r) => `${r.region} (${Math.round(r.weight * 100)}%)`),
      },
      {
        day: "Sunday",
        times: primaryRegion.weekends,
        type: "weekend",
        targetRegions: regions.slice(0, 3).map((r) => `${r.region} (${Math.round(r.weight * 100)}%)`),
      },
    ];

    setRecommendations(newRecommendations);
  }, [targetLanguage, userTimezone, selectedPlatformForTiming]);

  const handleSaveEvent = useCallback(() => {
    if (
      !editingEvent ||
      !editingEvent.title ||
      !editingEvent.date ||
      !editingEvent.platform
    ) {
      return;
    }

    const eventData = {
      ...editingEvent,
      color: PLATFORM_CONFIG[editingEvent.platform as Platform].color,
      tags: eventTags,
      reminders: eventReminders,
      analyticsEnabled,
      notificationsEnabled,
    } as CalendarEvent;

    // Manage reminders
    if (editingEvent.id) {
      // Cancel existing reminders for this event
      calendarReminderService.cancelEventReminders(editingEvent.id);
      onEventUpdate(eventData);
    } else {
      onEventCreate(eventData);
    }

    // Schedule new reminders if notifications are enabled
    if (notificationsEnabled && eventReminders.length > 0) {
      eventReminders.forEach(reminder => {
        calendarReminderService.scheduleReminder(
          eventData.id || `temp-${Date.now()}`,
          eventData.title || 'Untitled Event',
          eventData.date || '',
          eventData.time,
          eventData.platform || Platform.Instagram,
          reminder.type,
          reminder.time
        );
      });
    }

    setEditingEvent(null);
    setIsModalOpen(false);
  }, [editingEvent, onEventCreate, onEventUpdate]);

  const handleDeleteEvent = useCallback(() => {
    if (editingEvent?.id) {
      // Cancel all reminders for this event
      calendarReminderService.cancelEventReminders(editingEvent.id);
      onEventDelete(editingEvent.id);
      setEditingEvent(null);
      setIsModalOpen(false);
    }
  }, [editingEvent, onEventDelete]);

  const navigateMonth = useCallback((direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  }, []);

  const togglePlatformFilter = useCallback((platform: Platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform],
    );
  }, []);

  const getEventCountByStatus = useCallback(
    (status: CalendarEvent["status"]) => {
      return filteredEvents.filter((event) => event.status === status).length;
    },
    [filteredEvents],
  );

  return (
    <div className="content-calendar-container">
      {/* Header */}
      <div className="calendar-header">
        <div className="header-title-section">
          <h2 className="calendar-title">
            <CalendarDaysIcon className="title-icon" />
            Content Calendar
          </h2>
          <p className="title-subtitle">
            Plan, schedule, and track your social media content across all platforms
          </p>
        </div>

        <div className="header-actions">
          {/* Best Time Tips Button */}
          <button
            onClick={() => setShowBestTimeModal(true)}
            className="action-button best-time-button"
          >
            <ClockIcon className="button-icon" />
            <span>Best Time Tips</span>
          </button>

          {/* View Mode Selector */}
          <div className="view-mode-selector">
            {(["month", "week", "day"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`view-mode-button ${viewMode === mode ? "active" : ""}`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-overview-grid">
        {Object.entries(STATUS_CONFIG).map(([status, config]) => (
          <div key={status} className="stats-card">
            <div className="stats-card-content">
              <div className="stats-icon-wrapper">
                <span className="stats-icon">{config.icon}</span>
              </div>
              <div className="stats-details">
                <div className="stats-value">
                  {getEventCountByStatus(status as CalendarEvent["status"])}
                </div>
                <div className="stats-label">{config.label}</div>
              </div>
            </div>
            <div className={`stats-card-accent ${config.color}`}></div>
          </div>
        ))}
      </div>

      {/* Platform Filters */}
      <div className="platform-filters-section">
        <div className="filters-header">
          <span className="filters-label">Filter by platform:</span>
          {selectedPlatforms.length > 0 && (
            <button
              onClick={() => setSelectedPlatforms([])}
              className="clear-filters-button"
            >
              Clear All
            </button>
          )}
        </div>
        <div className="platform-filters-grid">
          {Object.values(Platform).map((platform) => (
            <button
              key={platform}
              onClick={() => togglePlatformFilter(platform)}
              className={`platform-filter-button ${
                selectedPlatforms.includes(platform) ? "active" : ""
              }`}
              style={{
                backgroundColor: selectedPlatforms.includes(platform) 
                  ? PLATFORM_CONFIG[platform].color.includes('gradient') 
                    ? '#6366f1' 
                    : PLATFORM_CONFIG[platform].color.replace('bg-', '#')
                  : undefined
              }}
            >
              <span className="platform-icon">{PLATFORM_CONFIG[platform].icon}</span>
              <span className="platform-name">{platform}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="calendar-navigation">
        <button
          onClick={() => navigateMonth("prev")}
          className="nav-button"
        >
          <ChevronLeftIcon className="nav-icon" />
        </button>

        <h3 className="current-month">
          {currentDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h3>

        <button
          onClick={() => navigateMonth("next")}
          className="nav-button"
        >
          <ChevronRightIcon className="nav-icon" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid">
        {/* Day Headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="day-header">
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {calendarDays.map((day, index) => (
          <div
            key={index}
            onClick={() => handleDateClick(day.date)}
            className={`calendar-day ${!day.isCurrentMonth ? "other-month" : ""} ${
              day.isToday ? "today" : ""
            }`}
          >
            <div className="day-number">
              {day.date.getDate()}
            </div>

            {/* Events */}
            <div className="day-events">
              {day.events.slice(0, 3).map((event) => (
                <div
                  key={event.id}
                  onClick={(e) => handleEventClick(event, e)}
                  className="calendar-event"
                  style={{
                    backgroundColor: PLATFORM_CONFIG[event.platform].lightColor.replace('bg-', '#'),
                    borderLeftColor: PLATFORM_CONFIG[event.platform].color.includes('gradient') 
                      ? '#6366f1' 
                      : PLATFORM_CONFIG[event.platform].color.replace('bg-', '#'),
                  }}
                  title={`${event.title} (${event.platform})`}
                >
                  <div className="event-content">
                    <span className="event-platform-icon">
                      {PLATFORM_CONFIG[event.platform].icon}
                    </span>
                    <span className="event-title">{event.title}</span>
                    <span className="event-status-icon">
                      {STATUS_CONFIG[event.status].icon}
                    </span>
                  </div>
                </div>
              ))}
              {day.events.length > 3 && (
                <div className="more-events-indicator">
                  +{day.events.length - 3} more
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Event Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="enhanced-event-modal">
            {/* Modal Header */}
            <div className="enhanced-modal-header">
              <div className="header-content">
                <div className="header-icon">
                  <span className="icon-wrapper">
                    ✨
                  </span>
                </div>
                <div className="header-text">
                  <h3 className="modal-title">
                    {editingEvent?.id ? "Edit Content Event" : "Create New Content Event"}
                  </h3>
                  <p className="modal-subtitle">
                    {editingEvent?.id
                      ? "Update your scheduled content with advanced options"
                      : "Plan and schedule your content with AI-powered insights"
                    }
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="enhanced-close-button"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="enhanced-modal-content">
              {/* Platform Selection */}
              <div className="section-group">
                <div className="section-header">
                  <span className="section-icon">🎯</span>
                  <div>
                    <h4 className="section-title">Platform & Type</h4>
                    <p className="section-subtitle">Choose your target platform and content type</p>
                  </div>
                </div>

                <div className="platform-grid">
                  {Object.values(Platform).map((platform) => (
                    <button
                      key={platform}
                      onClick={() =>
                        setEditingEvent((prev) => ({
                          ...prev,
                          platform: platform,
                        }))
                      }
                      className={`platform-card ${
                        editingEvent?.platform === platform ? "selected" : ""
                      }`}
                    >
                      <span className="platform-card-icon">
                        {PLATFORM_CONFIG[platform].icon}
                      </span>
                      <span className="platform-card-name">{platform}</span>
                      {editingEvent?.platform === platform && (
                        <span className="selected-indicator">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Details */}
              <div className="section-group">
                <div className="section-header">
                  <span className="section-icon">📝</span>
                  <div>
                    <h4 className="section-title">Content Details</h4>
                    <p className="section-subtitle">Define your content title and description</p>
                  </div>
                </div>

                <div className="enhanced-form-grid">
                  <div className="form-field-enhanced">
                    <label className="enhanced-label">
                      <span className="label-text">Title *</span>
                      <span className="label-badge">Required</span>
                    </label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        value={editingEvent?.title || ""}
                        onChange={(e) =>
                          setEditingEvent((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        className="enhanced-input"
                        placeholder="Enter a compelling title for your content..."
                        maxLength={100}
                      />
                      <div className="input-footer">
                        <span className="character-count">
                          {editingEvent?.title?.length || 0}/100
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="form-field-enhanced">
                    <label className="enhanced-label">
                      <span className="label-text">Content Description</span>
                      <span className="label-badge optional">Optional</span>
                    </label>
                    <div className="input-wrapper">
                      <textarea
                        value={editingEvent?.content || ""}
                        onChange={(e) =>
                          setEditingEvent((prev) => ({
                            ...prev,
                            content: e.target.value,
                          }))
                        }
                        className="enhanced-textarea"
                        placeholder="Describe your content, add hashtags, mentions, or detailed notes..."
                        rows={4}
                        maxLength={2000}
                      />
                      <div className="input-footer">
                        <div className="footer-left">
                          <button className="ai-assist-btn" type="button">
                            <span className="ai-icon">🤖</span>
                            AI Assist
                          </button>
                          <button className="template-btn" type="button">
                            <span className="template-icon">📋</span>
                            Templates
                          </button>
                        </div>
                        <span className="character-count">
                          {editingEvent?.content?.length || 0}/2000
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scheduling */}
              <div className="section-group">
                <div className="section-header">
                  <span className="section-icon">⏰</span>
                  <div>
                    <h4 className="section-title">Schedule & Timing</h4>
                    <p className="section-subtitle">Set the perfect time for maximum engagement</p>
                  </div>
                </div>

                <div className="scheduling-grid">
                  <div className="form-field-enhanced">
                    <label className="enhanced-label">
                      <span className="label-text">Date *</span>
                    </label>
                    <div className="input-wrapper">
                      <input
                        type="date"
                        value={editingEvent?.date || ""}
                        onChange={(e) =>
                          setEditingEvent((prev) => ({
                            ...prev,
                            date: e.target.value,
                          }))
                        }
                        className="enhanced-input"
                      />
                    </div>
                  </div>

                  <div className="form-field-enhanced">
                    <label className="enhanced-label">
                      <span className="label-text">Time</span>
                      <span className="label-badge optional">Optional</span>
                    </label>
                    <div className="input-wrapper">
                      <input
                        type="time"
                        value={editingEvent?.time || ""}
                        onChange={(e) =>
                          setEditingEvent((prev) => ({
                            ...prev,
                            time: e.target.value,
                          }))
                        }
                        className="enhanced-input"
                      />
                    </div>
                  </div>

                  <div className="form-field-enhanced">
                    <label className="enhanced-label">
                      <span className="label-text">Status</span>
                    </label>
                    <div className="status-selector">
                      {Object.entries(STATUS_CONFIG).map(([status, config]) => (
                        <button
                          key={status}
                          onClick={() =>
                            setEditingEvent((prev) => ({
                              ...prev,
                              status: status as CalendarEvent["status"],
                            }))
                          }
                          className={`status-option ${
                            editingEvent?.status === status ? "selected" : ""
                          }`}
                        >
                          <span className="status-icon">{config.icon}</span>
                          <span className="status-label">{config.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Optimal Time Suggestions */}
                <div className="time-suggestions">
                  <div className="suggestions-header">
                    <span className="suggestions-icon">💡</span>
                    <span className="suggestions-title">Optimal Time Suggestions</span>
                  </div>
                  <div className="suggestions-grid">
                    <button className="suggestion-card" type="button">
                      <span className="suggestion-time">2:00 PM</span>
                      <span className="suggestion-label">Peak Engagement</span>
                      <span className="suggestion-boost">+47% reach</span>
                    </button>
                    <button className="suggestion-card" type="button">
                      <span className="suggestion-time">7:30 PM</span>
                      <span className="suggestion-label">Evening Prime</span>
                      <span className="suggestion-boost">+32% reach</span>
                    </button>
                    <button className="suggestion-card" type="button">
                      <span className="suggestion-time">11:00 AM</span>
                      <span className="suggestion-label">Morning Rush</span>
                      <span className="suggestion-boost">+28% reach</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Advanced Options */}
              <div className="section-group">
                <div className="section-header">
                  <span className="section-icon">⚡</span>
                  <div>
                    <h4 className="section-title">Advanced Options</h4>
                    <p className="section-subtitle">Enhance your content with additional features</p>
                  </div>
                </div>

                <div className="advanced-options-grid">
                  <div className="option-card">
                    <div className="option-header">
                      <span className="option-icon">⏰</span>
                      <span className="option-title">Content Reminders</span>
                    </div>
                    <button
                      className="option-button"
                      onClick={() => setShowRemindersModal(true)}
                    >
                      <span>Set Reminders</span>
                      <span className="option-arrow">→</span>
                    </button>
                  </div>

                  <div className="option-card">
                    <div className="option-header">
                      <span className="option-icon">🏷️</span>
                      <span className="option-title">Tags & Categories</span>
                    </div>
                    <button
                      className="option-button"
                      onClick={() => setShowTagsModal(true)}
                    >
                      <span>Manage Tags</span>
                      <span className="option-arrow">→</span>
                    </button>
                  </div>

                  <div className="option-card">
                    <div className="option-header">
                      <span className="option-icon">📊</span>
                      <span className="option-title">Analytics Tracking</span>
                    </div>
                    <div className="option-toggle">
                      <input
                        type="checkbox"
                        id="analytics-toggle"
                        checked={analyticsEnabled}
                        onChange={(e) => {
                          setAnalyticsEnabled(e.target.checked);

                          // Add visual feedback animation
                          const toggleSwitch = document.querySelector('#analytics-toggle + .toggle-switch');
                          if (toggleSwitch) {
                            toggleSwitch.classList.add('state-changed');
                            setTimeout(() => toggleSwitch.classList.remove('state-changed'), 300);
                          }

                          // Update option card visual state
                          const optionCard = document.querySelector('#analytics-toggle').closest('.option-card');
                          if (optionCard) {
                            if (e.target.checked) {
                              optionCard.classList.add('toggle-enabled');
                            } else {
                              optionCard.classList.remove('toggle-enabled');
                            }
                          }

                          // Show feedback about analytics tracking
                          const message = e.target.checked
                            ? "Analytics tracking enabled for this event"
                            : "Analytics tracking disabled for this event";

                          setTimeout(() => {
                            window.notificationManager?.show({
                              type: e.target.checked ? "success" : "info",
                              title: "Analytics " + (e.target.checked ? "Enabled" : "Disabled"),
                              message,
                              duration: 2000,
                              icon: e.target.checked ? "📊✅" : "📊",
                              position: "bottom-right"
                            });
                          }, 300);
                        }}
                      />
                      <label htmlFor="analytics-toggle" className="toggle-switch">
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>

                  <div className="option-card">
                    <div className="option-header">
                      <span className="option-icon">🔔</span>
                      <span className="option-title">Notifications</span>
                    </div>
                    <div className="option-toggle">
                      <input
                        type="checkbox"
                        id="notifications-toggle"
                        checked={notificationsEnabled}
                        onChange={(e) => {
                          setNotificationsEnabled(e.target.checked);

                          // Add visual feedback animation
                          const toggleSwitch = document.querySelector('#notifications-toggle + .toggle-switch');
                          if (toggleSwitch) {
                            toggleSwitch.classList.add('state-changed');
                            setTimeout(() => toggleSwitch.classList.remove('state-changed'), 300);
                          }

                          // Update option card visual state
                          const optionCard = document.querySelector('#notifications-toggle').closest('.option-card');
                          if (optionCard) {
                            if (e.target.checked) {
                              optionCard.classList.add('toggle-enabled');
                            } else {
                              optionCard.classList.remove('toggle-enabled');
                            }
                          }

                          // Update the reminder service enabled state
                          calendarReminderService.setEnabled(e.target.checked);

                          // Show feedback about notifications
                          const message = e.target.checked
                            ? "Content reminders and notifications enabled"
                            : "Content reminders and notifications disabled";

                          setTimeout(() => {
                            window.notificationManager?.show({
                              type: e.target.checked ? "success" : "warning",
                              title: "Notifications " + (e.target.checked ? "Enabled" : "Disabled"),
                              message,
                              duration: 3000,
                              icon: e.target.checked ? "🔔✅" : "🔕",
                              position: "bottom-right"
                            });
                          }, 300);
                        }}
                      />
                      <label htmlFor="notifications-toggle" className="toggle-switch">
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Modal Actions */}
            <div className="enhanced-modal-actions">
              <div className="actions-left">
                {editingEvent?.id && (
                  <button
                    onClick={handleDeleteEvent}
                    className="delete-button"
                  >
                    <TrashIcon className="button-icon" />
                    Delete Event
                  </button>
                )}
              </div>

              <div className="actions-right">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="cancel-button"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSaveEvent}
                  disabled={
                    !editingEvent?.title ||
                    !editingEvent?.date ||
                    !editingEvent?.platform
                  }
                  className="save-button"
                >
                  <span className="save-icon">
                    {editingEvent?.id ? "📝" : "✨"}
                  </span>
                  {editingEvent?.id ? "Update Event" : "Create Event"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tags & Categories Modal */}
      {showTagsModal && (
        <div className="modal-overlay">
          <div className="feature-modal">
            <div className="modal-header">
              <h3 className="modal-title">
                🏷️ Tags & Categories
              </h3>
              <button
                onClick={() => setShowTagsModal(false)}
                className="modal-close-button"
              >
                ✕
              </button>
            </div>

            <div className="feature-modal-content">
              <div className="tags-section">
                <h4 className="feature-section-title">Available Tags</h4>
                <div className="tags-grid">
                  {["Marketing", "Viral", "Educational", "Behind the Scenes", "Product", "Tutorial", "Trending", "Seasonal"].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        if (eventTags.includes(tag)) {
                          setEventTags(eventTags.filter(t => t !== tag));
                        } else {
                          setEventTags([...eventTags, tag]);
                        }
                      }}
                      className={`tag-button ${eventTags.includes(tag) ? "selected" : ""}`}
                    >
                      <span className="tag-text">{tag}</span>
                      {eventTags.includes(tag) && <span className="tag-check">✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              <div className="custom-tags-section">
                <h4 className="feature-section-title">Custom Tags</h4>
                <div className="custom-tag-input">
                  <input
                    type="text"
                    placeholder="Add custom tag..."
                    className="tag-input"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const value = e.target.value.trim();
                        if (value && !eventTags.includes(value)) {
                          setEventTags([...eventTags, value]);
                          e.target.value = '';
                        }
                      }
                    }}
                  />
                  <button className="add-tag-button">Add Tag</button>
                </div>
              </div>

              <div className="selected-tags-section">
                <h4 className="feature-section-title">Selected Tags ({eventTags.length})</h4>
                <div className="selected-tags">
                  {eventTags.map((tag, index) => (
                    <span key={index} className="selected-tag">
                      {tag}
                      <button
                        onClick={() => setEventTags(eventTags.filter(t => t !== tag))}
                        className="remove-tag"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {eventTags.length === 0 && (
                    <p className="no-tags-message">No tags selected</p>
                  )}
                </div>
              </div>
            </div>

            <div className="feature-modal-actions">
              <button
                onClick={() => setShowTagsModal(false)}
                className="secondary-button"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowTagsModal(false);
                  // Update editing event with tags
                  setEditingEvent(prev => ({
                    ...prev,
                    tags: eventTags
                  }));
                }}
                className="primary-button"
              >
                Apply Tags
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content Reminders Modal */}
      {showRemindersModal && (
        <div className="modal-overlay">
          <div className="feature-modal">
            <div className="modal-header">
              <h3 className="modal-title">
                ⏰ Content Reminders
              </h3>
              <button
                onClick={() => setShowRemindersModal(false)}
                className="modal-close-button"
              >
                ✕
              </button>
            </div>

            <div className="feature-modal-content">
              <div className="reminders-section">
                <h4 className="feature-section-title">Smart Reminder Settings</h4>
                <p className="feature-description">
                  Get notified at the perfect time to prepare and publish your content
                </p>

                <div className="reminder-options">
                  {[
                    { type: "Preparation", time: "24 hours before", icon: "📝", description: "Prepare content and gather materials" },
                    { type: "Review", time: "2 hours before", icon: "👀", description: "Final review and optimization" },
                    { type: "Publish", time: "15 minutes before", icon: "🚀", description: "Ready to publish reminder" },
                    { type: "Follow-up", time: "1 hour after", icon: "📊", description: "Check engagement and respond" }
                  ].map((reminder) => (
                    <div key={reminder.type} className="reminder-option">
                      <div className="reminder-info">
                        <div className="reminder-header">
                          <span className="reminder-icon">{reminder.icon}</span>
                          <span className="reminder-type">{reminder.type} Reminder</span>
                          <span className="reminder-time">{reminder.time}</span>
                        </div>
                        <p className="reminder-description">{reminder.description}</p>
                      </div>
                      <div className="reminder-toggle">
                        <input
                          type="checkbox"
                          id={`reminder-${reminder.type}`}
                          checked={eventReminders.some(r => r.type === reminder.type)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEventReminders([...eventReminders, { type: reminder.type, time: reminder.time }]);
                            } else {
                              setEventReminders(eventReminders.filter(r => r.type !== reminder.type));
                            }
                          }}
                        />
                        <label htmlFor={`reminder-${reminder.type}`} className="toggle-switch">
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="custom-reminder-section">
                  <h4 className="feature-section-title">Custom Reminder</h4>
                  <div className="custom-reminder-form">
                    <select className="reminder-select">
                      <option value="5">5 minutes before</option>
                      <option value="15">15 minutes before</option>
                      <option value="30">30 minutes before</option>
                      <option value="60">1 hour before</option>
                      <option value="120">2 hours before</option>
                      <option value="1440">24 hours before</option>
                    </select>
                    <button className="add-reminder-button">Add Custom</button>
                  </div>

                  {/* Test Reminder Feature */}
                  <div className="test-reminder-section">
                    <h4 className="feature-section-title">Test Notifications</h4>
                    <p className="feature-description">
                      Test your notification system to ensure it's working properly
                    </p>
                    <button
                      className="test-reminder-button"
                      onClick={() => {
                        // Show a test notification immediately
                        window.notificationManager?.show({
                          type: "success",
                          title: "🔔 Test Notification",
                          message: "Calendar reminder system is working perfectly! You'll receive notifications like this for your scheduled content.",
                          duration: 8000,
                          icon: "🚀",
                          position: "top-center",
                          actionText: "Awesome!",
                          onAction: () => {
                            window.notificationManager?.show({
                              type: "info",
                              title: "System Ready",
                              message: "Your content reminders are all set up and ready to go!",
                              duration: 3000,
                              icon: "✅",
                              position: "bottom-right"
                            });
                          }
                        });

                        // Also schedule a test reminder for 5 seconds from now
                        const testEventId = `test-${Date.now()}`;
                        const testDate = new Date();
                        testDate.setSeconds(testDate.getSeconds() + 5);

                        calendarReminderService.scheduleReminder(
                          testEventId,
                          "Test Content Reminder",
                          testDate.toISOString().split('T')[0],
                          testDate.toTimeString().split(' ')[0].substring(0, 5),
                          "Instagram",
                          "Test",
                          "5 seconds before"
                        );

                        // Show confirmation
                        setTimeout(() => {
                          window.notificationManager?.show({
                            type: "info",
                            title: "⏱️ Test Reminder Scheduled",
                            message: "A test reminder has been scheduled for 5 seconds from now. Watch for it!",
                            duration: 4000,
                            icon: "⏰",
                            position: "bottom-right"
                          });
                        }, 1000);
                      }}
                    >
                      <span className="test-icon">🧪</span>
                      Test Reminder System
                    </button>
                  </div>
                </div>

                <div className="active-reminders">
                  <h4 className="feature-section-title">Active Reminders ({eventReminders.length})</h4>
                  {eventReminders.length > 0 ? (
                    <div className="reminders-list">
                      {eventReminders.map((reminder, index) => (
                        <div key={index} className="active-reminder">
                          <span className="reminder-text">{reminder.type} - {reminder.time}</span>
                          <button
                            onClick={() => setEventReminders(eventReminders.filter((_, i) => i !== index))}
                            className="remove-reminder"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-reminders-message">No reminders set</p>
                  )}
                </div>
              </div>
            </div>

            <div className="feature-modal-actions">
              <button
                onClick={() => setShowRemindersModal(false)}
                className="secondary-button"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowRemindersModal(false);
                  // Update editing event with reminders
                  setEditingEvent(prev => ({
                    ...prev,
                    reminders: eventReminders
                  }));
                }}
                className="primary-button"
              >
                Save Reminders
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Best Time Recommendations Modal */}
      {showBestTimeModal && (
        <div className="modal-overlay">
          <div className="best-time-modal">
            <div className="modal-header">
              <h3 className="modal-title">
                <ClockIcon className="title-icon" />
                Best Time Recommendations
              </h3>
              <button
                onClick={() => setShowBestTimeModal(false)}
                className="modal-close-button"
              >
                ✕
              </button>
            </div>

            <div className="best-time-content">
              {/* Configuration Form */}
              <div className="configuration-section">
                <div className="config-form">
                  <div className="form-field">
                    <label className="field-label">
                      Target Language / Audience
                    </label>
                    <select
                      value={targetLanguage}
                      onChange={(e) => setTargetLanguage(e.target.value)}
                      className="field-select"
                    >
                      <option value="">Select Target Audience</option>
                      <optgroup label="Major Languages">
                        <option value="English">🇺🇸🇬🇧🇨🇦🇦🇺 English speakers</option>
                        <option value="Spanish">🇪🇸🇲🇽🇦🇷 Spanish speakers</option>
                        <option value="French">🇫🇷🇨🇦🇧🇪 French speakers</option>
                        <option value="German">🇩🇪🇦🇹🇨🇭 German speakers</option>
                        <option value="Portuguese">🇧🇷🇵🇹 Portuguese speakers</option>
                        <option value="Chinese">🇨🇳🇹🇼 Chinese speakers</option>
                        <option value="Arabic">🇸🇦🇦���🇪��� Arabic speakers</option>
                        <option value="Hindi">🇮🇳 Hindi speakers</option>
                      </optgroup>
                    </select>
                  </div>

                  <div className="form-field">
                    <label className="field-label">
                      Your Timezone
                    </label>
                    <select
                      value={userTimezone}
                      onChange={(e) => setUserTimezone(e.target.value)}
                      className="field-select"
                    >
                      <option value="">Select Your Timezone</option>
                      <optgroup label="Americas">
                        <option value="UTC-10">🇺🇸 Hawaii (UTC-10)</option>
                        <option value="UTC-9">🇺🇸 Alaska (UTC-9)</option>
                        <option value="UTC-8">🇺🇸 Pacific Time (UTC-8)</option>
                        <option value="UTC-7">🇺🇸 Mountain Time (UTC-7)</option>
                        <option value="UTC-6">🇺🇸 Central Time (UTC-6)</option>
                        <option value="UTC-5">🇺🇸 Eastern Time (UTC-5)</option>
                        <option value="UTC-3">🇧🇷 Brazil (UTC-3)</option>
                        <option value="UTC-3">🇦🇷 Argentina (UTC-3)</option>
                      </optgroup>
                      <optgroup label="Europe & Africa">
                        <option value="UTC+0">��🇧 GMT/UTC (UTC+0)</option>
                        <option value="UTC+1">🇩🇪 Central Europe (UTC+1)</option>
                        <option value="UTC+1">🇫🇷 France (UTC+1)</option>
                        <option value="UTC+1">🇮🇹 Italy (UTC+1)</option>
                        <option value="UTC+1">🇪🇸 Spain (UTC+1)</option>
                        <option value="UTC+2">🇫🇮 Finland (UTC+2)</option>
                        <option value="UTC+2">🇬🇷 Greece (UTC+2)</option>
                        <option value="UTC+3">🇷🇺 Moscow (UTC+3)</option>
                        <option value="UTC+3">🇹🇷 Turkey (UTC+3)</option>
                      </optgroup>
                      <optgroup label="Asia & Oceania">
                        <option value="UTC+5:30">🇮🇳 India (UTC+5:30)</option>
                        <option value="UTC+8">🇨🇳 China (UTC+8)</option>
                        <option value="UTC+9">🇯🇵 Japan (UTC+9)</option>
                        <option value="UTC+9">🇰🇷 South Korea (UTC+9)</option>
                        <option value="UTC+10">🇦🇺 Australia East (UTC+10)</option>
                      </optgroup>
                    </select>
                  </div>

                  <div className="form-field">
                    <label className="field-label">
                      Platform
                    </label>
                    <select
                      value={selectedPlatformForTiming}
                      onChange={(e) =>
                        setSelectedPlatformForTiming(e.target.value as Platform)
                      }
                      className="field-select"
                    >
                      {Object.values(Platform).map((platform) => (
                        <option key={platform} value={platform}>
                          {PLATFORM_CONFIG[platform].icon} {platform}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={generateBestTimeRecommendations}
                  disabled={!targetLanguage || !userTimezone}
                  className="generate-button"
                >
                  Generate Recommendations
                </button>
              </div>

              {/* Recommendations Display */}
              {recommendations.length > 0 && (
                <div className="recommendations-section">
                  <div className="recommendations-header">
                    <h4 className="recommendations-title">
                      📅 Optimal Posting Times for {targetLanguage} Speakers
                    </h4>
                    <p className="recommendations-subtitle">
                      Times converted to your timezone ({userTimezone}) • Target regions: {recommendations[0]?.targetRegions?.join(", ")}
                    </p>
                  </div>

                  <div className="recommendations-grid">
                    {recommendations.map((rec, index) => (
                      <div
                        key={index}
                        className={`recommendation-card ${rec.type === "weekend" ? "weekend" : "weekday"}`}
                      >
                        <div className="recommendation-header">
                          <h5 className="day-name">{rec.day}</h5>
                          <span className="day-type">{rec.type}</span>
                        </div>
                        <div className="time-slots">
                          {rec.times.map((time, timeIndex) => (
                            <div key={timeIndex} className="time-slot">
                              <span className="time">{time}</span>
                              <span className="priority">
                                {timeIndex === 0 ? "🔥 Peak" : timeIndex === 1 ? "⭐ Good" : "📈 Fair"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pro-tips-section">
                    <h5 className="pro-tips-title">
                      <span className="tips-icon">💡</span>
                      Pro Tips for {PLATFORM_CONFIG[selectedPlatformForTiming].icon} {selectedPlatformForTiming}
                    </h5>
                    <div className="tips-grid">
                      <div className="tips-column">
                        <p className="tips-category">🎯 Best Practices:</p>
                        <ul className="tips-list">
                          <li>Post consistently at peak times</li>
                          <li>Test different time slots for your audience</li>
                          <li>Consider time zone differences for global reach</li>
                        </ul>
                      </div>
                      <div className="tips-column">
                        <p className="tips-category">⚡ Platform-Specific Tips:</p>
                        <ul className="tips-list">
                          {selectedPlatformForTiming === Platform.Instagram && (
                            <>
                              <li>Stories perform best in the morning</li>
                              <li>Reels get most engagement in evening</li>
                              <li>Carousels work well during lunch hours</li>
                            </>
                          )}
                          {selectedPlatformForTiming === Platform.TikTok && (
                            <>
                              <li>Early morning catches commuters</li>
                              <li>Evening posts get shared more</li>
                              <li>Weekend content has longer lifespan</li>
                            </>
                          )}
                          {selectedPlatformForTiming === Platform.YouTube && (
                            <>
                              <li>Weekends are best for longer videos</li>
                              <li>Afternoon uploads get better visibility</li>
                              <li>Consistent schedule builds anticipation</li>
                            </>
                          )}
                          {selectedPlatformForTiming === Platform.Twitter && (
                            <>
                              <li>Business hours for professional content</li>
                              <li>Evening for casual conversations</li>
                              <li>Breaking news gets instant engagement</li>
                            </>
                          )}
                          {selectedPlatformForTiming === Platform.LinkedIn && (
                            <>
                              <li>Tuesday-Thursday are most active</li>
                              <li>Avoid weekends for business content</li>
                              <li>Morning posts get professional attention</li>
                            </>
                          )}
                          {selectedPlatformForTiming === Platform.Facebook && (
                            <>
                              <li>Mid-week posts perform best</li>
                              <li>Visual content gets more engagement</li>
                              <li>Evening posts reach more people</li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content Calendar Extensions */}
      <ContentCalendarExtensions events={events} className="calendar-extensions" />
    </div>
  );
};

export default ProfessionalCalendar;
