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
}

interface EnhancedCalendarProps {
  events: CalendarEvent[];
  onEventCreate: (event: Omit<CalendarEvent, "id">) => void;
  onEventUpdate: (event: CalendarEvent) => void;
  onEventDelete: (eventId: string) => void;
}

const PLATFORM_COLORS = {
  [Platform.YouTube]: "bg-red-600",
  [Platform.TikTok]: "bg-black",
  [Platform.Instagram]: "bg-pink-600",
  [Platform.Twitter]: "bg-blue-500",
  [Platform.LinkedIn]: "bg-blue-700",
  [Platform.Facebook]: "bg-blue-600",
};

const PLATFORM_ICONS = {
  [Platform.YouTube]: "📺",
  [Platform.TikTok]: "🎵",
  [Platform.Instagram]: "📷",
  [Platform.Twitter]: "🐦",
  [Platform.LinkedIn]: "💼",
  [Platform.Facebook]: "👥",
};

const STATUS_COLORS = {
  draft: "bg-gray-500",
  scheduled: "bg-blue-500",
  published: "bg-green-500",
  failed: "bg-red-500",
};

const STATUS_ICONS = {
  draft: "📝",
  scheduled: "⏰",
  published: "✅",
  failed: "❌",
};

export const EnhancedCalendar: React.FC<EnhancedCalendarProps> = ({
  events,
  onEventCreate,
  onEventUpdate,
  onEventDelete,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [editingEvent, setEditingEvent] =
    useState<Partial<CalendarEvent> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);

  // Best Time Recommendations state
  const [showBestTimeModal, setShowBestTimeModal] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState("");
  const [userTimezone, setUserTimezone] = useState("");
  const [selectedPlatformForTiming, setSelectedPlatformForTiming] =
    useState<Platform>(Platform.Instagram);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

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
    setIsModalOpen(true);
  }, []);

  const handleEventClick = useCallback(
    (event: CalendarEvent, e: React.MouseEvent) => {
      e.stopPropagation();
      setEditingEvent(event);
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
    Russian: [
      { region: "Russia (Moscow)", timezone: "UTC+3", weight: 0.6 },
      { region: "Russia (St. Petersburg)", timezone: "UTC+3", weight: 0.2 },
      { region: "Ukraine", timezone: "UTC+2", weight: 0.2 },
    ],
    Dutch: [
      { region: "Netherlands", timezone: "UTC+1", weight: 0.7 },
      { region: "Belgium", timezone: "UTC+1", weight: 0.3 },
    ],
    Swedish: [{ region: "Sweden", timezone: "UTC+1", weight: 1.0 }],
    Norwegian: [{ region: "Norway", timezone: "UTC+1", weight: 1.0 }],
    Danish: [{ region: "Denmark", timezone: "UTC+1", weight: 1.0 }],
    Finnish: [{ region: "Finland", timezone: "UTC+2", weight: 1.0 }],
    Polish: [{ region: "Poland", timezone: "UTC+1", weight: 1.0 }],
    Turkish: [{ region: "Turkey", timezone: "UTC+3", weight: 1.0 }],
    Greek: [{ region: "Greece", timezone: "UTC+2", weight: 1.0 }],
    Hebrew: [{ region: "Israel", timezone: "UTC+2", weight: 1.0 }],
    Thai: [{ region: "Thailand", timezone: "UTC+7", weight: 1.0 }],
    Vietnamese: [{ region: "Vietnam", timezone: "UTC+7", weight: 1.0 }],
    Indonesian: [{ region: "Indonesia", timezone: "UTC+7", weight: 1.0 }],
    Malay: [
      { region: "Malaysia", timezone: "UTC+8", weight: 0.7 },
      { region: "Singapore", timezone: "UTC+8", weight: 0.3 },
    ],
    Tagalog: [{ region: "Philippines", timezone: "UTC+8", weight: 1.0 }],
    Urdu: [{ region: "Pakistan", timezone: "UTC+5", weight: 1.0 }],
    Bengali: [
      { region: "Bangladesh", timezone: "UTC+6", weight: 0.6 },
      { region: "West Bengal, India", timezone: "UTC+5:30", weight: 0.4 },
    ],
    Tamil: [
      { region: "Tamil Nadu, India", timezone: "UTC+5:30", weight: 0.7 },
      { region: "Sri Lanka", timezone: "UTC+5:30", weight: 0.3 },
    ],
    Czech: [{ region: "Czech Republic", timezone: "UTC+1", weight: 1.0 }],
    Hungarian: [{ region: "Hungary", timezone: "UTC+1", weight: 1.0 }],
    Romanian: [{ region: "Romania", timezone: "UTC+2", weight: 1.0 }],
    Bulgarian: [{ region: "Bulgaria", timezone: "UTC+2", weight: 1.0 }],
    Croatian: [{ region: "Croatia", timezone: "UTC+1", weight: 1.0 }],
    Serbian: [{ region: "Serbia", timezone: "UTC+1", weight: 1.0 }],
    Slovak: [{ region: "Slovakia", timezone: "UTC+1", weight: 1.0 }],
    Slovenian: [{ region: "Slovenia", timezone: "UTC+1", weight: 1.0 }],
    Estonian: [{ region: "Estonia", timezone: "UTC+2", weight: 1.0 }],
    Latvian: [{ region: "Latvia", timezone: "UTC+2", weight: 1.0 }],
    Lithuanian: [{ region: "Lithuania", timezone: "UTC+2", weight: 1.0 }],
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

  // Generate best time recommendations based on language regions and user timezone
  const generateBestTimeRecommendations = useCallback(() => {
    if (!targetLanguage || !userTimezone || !selectedPlatformForTiming) {
      return;
    }

    // Best posting times database based on research and analytics
    const platformTimingData = {
      [Platform.Instagram]: {
        English: {
          weekdays: ["11:00", "14:00", "17:00"],
          weekends: ["10:00", "13:00", "16:00"],
        },
        Spanish: {
          weekdays: ["12:00", "15:00", "19:00"],
          weekends: ["11:00", "14:00", "18:00"],
        },
        French: {
          weekdays: ["12:00", "15:00", "18:00"],
          weekends: ["10:00", "13:00", "17:00"],
        },
        German: {
          weekdays: ["11:00", "14:00", "18:00"],
          weekends: ["10:00", "13:00", "16:00"],
        },
        Portuguese: {
          weekdays: ["12:00", "15:00", "19:00"],
          weekends: ["11:00", "14:00", "18:00"],
        },
        Japanese: {
          weekdays: ["07:00", "12:00", "19:00"],
          weekends: ["09:00", "13:00", "18:00"],
        },
        Korean: {
          weekdays: ["07:00", "12:00", "18:00"],
          weekends: ["09:00", "13:00", "17:00"],
        },
        Chinese: {
          weekdays: ["08:00", "12:00", "19:00"],
          weekends: ["10:00", "14:00", "18:00"],
        },
        Arabic: {
          weekdays: ["14:00", "17:00", "21:00"],
          weekends: ["13:00", "16:00", "20:00"],
        },
        Hindi: {
          weekdays: ["10:00", "14:00", "18:00"],
          weekends: ["11:00", "15:00", "19:00"],
        },
        Italian: {
          weekdays: ["12:00", "15:00", "18:00"],
          weekends: ["10:00", "13:00", "17:00"],
        },
        Russian: {
          weekdays: ["10:00", "14:00", "18:00"],
          weekends: ["11:00", "15:00", "17:00"],
        },
        Dutch: {
          weekdays: ["11:00", "14:00", "18:00"],
          weekends: ["10:00", "13:00", "16:00"],
        },
        Swedish: {
          weekdays: ["11:00", "14:00", "17:00"],
          weekends: ["10:00", "13:00", "16:00"],
        },
        Norwegian: {
          weekdays: ["11:00", "14:00", "17:00"],
          weekends: ["10:00", "13:00", "16:00"],
        },
        Danish: {
          weekdays: ["11:00", "14:00", "17:00"],
          weekends: ["10:00", "13:00", "16:00"],
        },
        Finnish: {
          weekdays: ["11:00", "14:00", "18:00"],
          weekends: ["10:00", "13:00", "17:00"],
        },
        Polish: {
          weekdays: ["11:00", "14:00", "18:00"],
          weekends: ["10:00", "13:00", "17:00"],
        },
        Turkish: {
          weekdays: ["12:00", "15:00", "19:00"],
          weekends: ["11:00", "14:00", "18:00"],
        },
        Greek: {
          weekdays: ["12:00", "15:00", "18:00"],
          weekends: ["11:00", "14:00", "17:00"],
        },
        Hebrew: {
          weekdays: ["11:00", "15:00", "18:00"],
          weekends: ["10:00", "14:00", "17:00"],
        },
        Thai: {
          weekdays: ["09:00", "13:00", "18:00"],
          weekends: ["10:00", "14:00", "17:00"],
        },
        Vietnamese: {
          weekdays: ["09:00", "13:00", "18:00"],
          weekends: ["10:00", "14:00", "17:00"],
        },
        Indonesian: {
          weekdays: ["09:00", "13:00", "18:00"],
          weekends: ["10:00", "14:00", "17:00"],
        },
        Malay: {
          weekdays: ["09:00", "13:00", "18:00"],
          weekends: ["10:00", "14:00", "17:00"],
        },
        Tagalog: {
          weekdays: ["09:00", "13:00", "18:00"],
          weekends: ["10:00", "14:00", "17:00"],
        },
        Urdu: {
          weekdays: ["10:00", "14:00", "18:00"],
          weekends: ["11:00", "15:00", "19:00"],
        },
        Bengali: {
          weekdays: ["10:00", "14:00", "18:00"],
          weekends: ["11:00", "15:00", "19:00"],
        },
        Tamil: {
          weekdays: ["10:00", "14:00", "18:00"],
          weekends: ["11:00", "15:00", "19:00"],
        },
        Czech: {
          weekdays: ["11:00", "14:00", "18:00"],
          weekends: ["10:00", "13:00", "17:00"],
        },
        Hungarian: {
          weekdays: ["11:00", "14:00", "18:00"],
          weekends: ["10:00", "13:00", "17:00"],
        },
        Romanian: {
          weekdays: ["11:00", "15:00", "18:00"],
          weekends: ["10:00", "14:00", "17:00"],
        },
        Bulgarian: {
          weekdays: ["11:00", "15:00", "18:00"],
          weekends: ["10:00", "14:00", "17:00"],
        },
        Croatian: {
          weekdays: ["11:00", "14:00", "18:00"],
          weekends: ["10:00", "13:00", "17:00"],
        },
        Serbian: {
          weekdays: ["11:00", "14:00", "18:00"],
          weekends: ["10:00", "13:00", "17:00"],
        },
        Slovak: {
          weekdays: ["11:00", "14:00", "18:00"],
          weekends: ["10:00", "13:00", "17:00"],
        },
        Slovenian: {
          weekdays: ["11:00", "14:00", "18:00"],
          weekends: ["10:00", "13:00", "17:00"],
        },
        Estonian: {
          weekdays: ["11:00", "14:00", "18:00"],
          weekends: ["10:00", "13:00", "17:00"],
        },
        Latvian: {
          weekdays: ["11:00", "14:00", "18:00"],
          weekends: ["10:00", "13:00", "17:00"],
        },
        Lithuanian: {
          weekdays: ["11:00", "14:00", "18:00"],
          weekends: ["10:00", "13:00", "17:00"],
        },
      },
      [Platform.TikTok]: {
        English: {
          weekdays: ["06:00", "10:00", "19:00"],
          weekends: ["09:00", "12:00", "15:00"],
        },
        Spanish: {
          weekdays: ["07:00", "11:00", "20:00"],
          weekends: ["10:00", "13:00", "16:00"],
        },
        French: {
          weekdays: ["07:00", "11:00", "19:00"],
          weekends: ["09:00", "12:00", "15:00"],
        },
        German: {
          weekdays: ["06:00", "10:00", "18:00"],
          weekends: ["09:00", "12:00", "15:00"],
        },
        Portuguese: {
          weekdays: ["07:00", "11:00", "20:00"],
          weekends: ["10:00", "13:00", "16:00"],
        },
        Japanese: {
          weekdays: ["06:00", "11:00", "18:00"],
          weekends: ["08:00", "12:00", "17:00"],
        },
        Korean: {
          weekdays: ["06:00", "11:00", "17:00"],
          weekends: ["08:00", "12:00", "16:00"],
        },
        Chinese: {
          weekdays: ["07:00", "11:00", "18:00"],
          weekends: ["09:00", "13:00", "17:00"],
        },
        Arabic: {
          weekdays: ["13:00", "16:00", "20:00"],
          weekends: ["12:00", "15:00", "19:00"],
        },
        Hindi: {
          weekdays: ["09:00", "13:00", "17:00"],
          weekends: ["10:00", "14:00", "18:00"],
        },
      },
      [Platform.YouTube]: {
        English: {
          weekdays: ["14:00", "17:00", "20:00"],
          weekends: ["12:00", "15:00", "18:00"],
        },
        Spanish: {
          weekdays: ["15:00", "18:00", "21:00"],
          weekends: ["13:00", "16:00", "19:00"],
        },
        French: {
          weekdays: ["15:00", "18:00", "20:00"],
          weekends: ["12:00", "15:00", "18:00"],
        },
        German: {
          weekdays: ["14:00", "17:00", "19:00"],
          weekends: ["12:00", "15:00", "17:00"],
        },
        Portuguese: {
          weekdays: ["15:00", "18:00", "21:00"],
          weekends: ["13:00", "16:00", "19:00"],
        },
        Japanese: {
          weekdays: ["12:00", "17:00", "20:00"],
          weekends: ["14:00", "17:00", "19:00"],
        },
        Korean: {
          weekdays: ["12:00", "17:00", "19:00"],
          weekends: ["14:00", "17:00", "18:00"],
        },
        Chinese: {
          weekdays: ["13:00", "17:00", "20:00"],
          weekends: ["15:00", "17:00", "19:00"],
        },
        Arabic: {
          weekdays: ["16:00", "19:00", "22:00"],
          weekends: ["15:00", "18:00", "21:00"],
        },
        Hindi: {
          weekdays: ["13:00", "17:00", "19:00"],
          weekends: ["14:00", "18:00", "20:00"],
        },
      },
      [Platform.Twitter]: {
        English: {
          weekdays: ["09:00", "12:00", "17:00"],
          weekends: ["10:00", "13:00", "16:00"],
        },
        Spanish: {
          weekdays: ["10:00", "13:00", "18:00"],
          weekends: ["11:00", "14:00", "17:00"],
        },
        French: {
          weekdays: ["10:00", "13:00", "17:00"],
          weekends: ["10:00", "13:00", "16:00"],
        },
        German: {
          weekdays: ["09:00", "12:00", "17:00"],
          weekends: ["10:00", "13:00", "16:00"],
        },
        Portuguese: {
          weekdays: ["10:00", "13:00", "18:00"],
          weekends: ["11:00", "14:00", "17:00"],
        },
        Japanese: {
          weekdays: ["08:00", "12:00", "17:00"],
          weekends: ["09:00", "13:00", "16:00"],
        },
        Korean: {
          weekdays: ["08:00", "12:00", "16:00"],
          weekends: ["09:00", "13:00", "15:00"],
        },
        Chinese: {
          weekdays: ["09:00", "12:00", "17:00"],
          weekends: ["10:00", "14:00", "16:00"],
        },
        Arabic: {
          weekdays: ["12:00", "15:00", "19:00"],
          weekends: ["11:00", "14:00", "18:00"],
        },
        Hindi: {
          weekdays: ["11:00", "14:00", "17:00"],
          weekends: ["12:00", "15:00", "18:00"],
        },
      },
      [Platform.LinkedIn]: {
        English: {
          weekdays: ["08:00", "12:00", "17:00"],
          weekends: ["10:00", "14:00"],
        },
        Spanish: {
          weekdays: ["09:00", "13:00", "18:00"],
          weekends: ["11:00", "15:00"],
        },
        French: {
          weekdays: ["09:00", "13:00", "17:00"],
          weekends: ["10:00", "14:00"],
        },
        German: {
          weekdays: ["08:00", "12:00", "17:00"],
          weekends: ["10:00", "14:00"],
        },
        Portuguese: {
          weekdays: ["09:00", "13:00", "18:00"],
          weekends: ["11:00", "15:00"],
        },
        Japanese: {
          weekdays: ["07:00", "11:00", "16:00"],
          weekends: ["09:00", "13:00"],
        },
        Korean: {
          weekdays: ["07:00", "11:00", "15:00"],
          weekends: ["09:00", "13:00"],
        },
        Chinese: {
          weekdays: ["08:00", "11:00", "16:00"],
          weekends: ["10:00", "14:00"],
        },
        Arabic: {
          weekdays: ["11:00", "14:00", "18:00"],
          weekends: ["12:00", "16:00"],
        },
        Hindi: {
          weekdays: ["10:00", "13:00", "16:00"],
          weekends: ["11:00", "15:00"],
        },
      },
      [Platform.Facebook]: {
        English: {
          weekdays: ["13:00", "15:00", "19:00"],
          weekends: ["12:00", "14:00", "18:00"],
        },
        Spanish: {
          weekdays: ["14:00", "16:00", "20:00"],
          weekends: ["13:00", "15:00", "19:00"],
        },
        French: {
          weekdays: ["14:00", "16:00", "19:00"],
          weekends: ["12:00", "14:00", "18:00"],
        },
        German: {
          weekdays: ["13:00", "15:00", "18:00"],
          weekends: ["12:00", "14:00", "17:00"],
        },
        Portuguese: {
          weekdays: ["14:00", "16:00", "20:00"],
          weekends: ["13:00", "15:00", "19:00"],
        },
        Japanese: {
          weekdays: ["11:00", "15:00", "18:00"],
          weekends: ["13:00", "15:00", "17:00"],
        },
        Korean: {
          weekdays: ["11:00", "15:00", "17:00"],
          weekends: ["13:00", "15:00", "16:00"],
        },
        Chinese: {
          weekdays: ["12:00", "15:00", "18:00"],
          weekends: ["14:00", "15:00", "17:00"],
        },
        Arabic: {
          weekdays: ["15:00", "17:00", "21:00"],
          weekends: ["14:00", "16:00", "20:00"],
        },
        Hindi: {
          weekdays: ["12:00", "15:00", "18:00"],
          weekends: ["13:00", "16:00", "19:00"],
        },
      },
    };

    const platformData = platformTimingData[selectedPlatformForTiming];
    const languageData =
      platformData[targetLanguage] || platformData["English"];
    const regions =
      languageRegions[targetLanguage] || languageRegions["English"];

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

    // Generate day-specific recommendations with converted times
    const newRecommendations = [
      {
        day: "Monday",
        times: primaryRegion.weekdays,
        type: "weekday",
        targetRegions: regions
          .slice(0, 3)
          .map((r) => `${r.region} (${Math.round(r.weight * 100)}%)`),
      },
      {
        day: "Tuesday",
        times: primaryRegion.weekdays,
        type: "weekday",
        targetRegions: regions
          .slice(0, 3)
          .map((r) => `${r.region} (${Math.round(r.weight * 100)}%)`),
      },
      {
        day: "Wednesday",
        times: primaryRegion.weekdays,
        type: "weekday",
        targetRegions: regions
          .slice(0, 3)
          .map((r) => `${r.region} (${Math.round(r.weight * 100)}%)`),
      },
      {
        day: "Thursday",
        times: primaryRegion.weekdays,
        type: "weekday",
        targetRegions: regions
          .slice(0, 3)
          .map((r) => `${r.region} (${Math.round(r.weight * 100)}%)`),
      },
      {
        day: "Friday",
        times: primaryRegion.weekdays,
        type: "weekday",
        targetRegions: regions
          .slice(0, 3)
          .map((r) => `${r.region} (${Math.round(r.weight * 100)}%)`),
      },
      {
        day: "Saturday",
        times: primaryRegion.weekends,
        type: "weekend",
        targetRegions: regions
          .slice(0, 3)
          .map((r) => `${r.region} (${Math.round(r.weight * 100)}%)`),
      },
      {
        day: "Sunday",
        times: primaryRegion.weekends,
        type: "weekend",
        targetRegions: regions
          .slice(0, 3)
          .map((r) => `${r.region} (${Math.round(r.weight * 100)}%)`),
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
      color: PLATFORM_COLORS[editingEvent.platform as Platform],
    } as CalendarEvent;

    if (editingEvent.id) {
      onEventUpdate(eventData);
    } else {
      onEventCreate(eventData);
    }

    setEditingEvent(null);
    setIsModalOpen(false);
  }, [editingEvent, onEventCreate, onEventUpdate]);

  const handleDeleteEvent = useCallback(() => {
    if (editingEvent?.id) {
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
    <div className="flex-grow bg-slate-800/70 backdrop-blur-sm p-6 rounded-xl shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h2 className="text-2xl font-semibold text-sky-400 flex items-center">
          <CalendarDaysIcon className="h-7 w-7 mr-2" />
          Social Media Calendar
        </h2>

        <div className="flex items-center space-x-4">
          {/* Best Time Recommendations Button */}
          <button
            onClick={() => setShowBestTimeModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg"
          >
            <ClockIcon className="h-4 w-4" />
            <span>Best Time Tips</span>
          </button>

          {/* View Mode Selector */}
          <div className="flex items-center space-x-2">
            {(["month", "week", "day"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === mode
                    ? "bg-sky-600 text-white"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(STATUS_COLORS).map(([status, colorClass]) => (
          <div key={status} className="bg-slate-700/60 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">
                {STATUS_ICONS[status as keyof typeof STATUS_ICONS]}
              </span>
              <div>
                <p className="text-lg font-bold text-white">
                  {getEventCountByStatus(status as CalendarEvent["status"])}
                </p>
                <p className="text-sm text-slate-400 capitalize">{status}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Platform Filters */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-slate-400 mr-2">Filter by platform:</span>
        {Object.values(Platform).map((platform) => (
          <button
            key={platform}
            onClick={() => togglePlatformFilter(platform)}
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              selectedPlatforms.includes(platform)
                ? `${PLATFORM_COLORS[platform]} text-white`
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            <span className="mr-1">{PLATFORM_ICONS[platform]}</span>
            {platform}
          </button>
        ))}
        {selectedPlatforms.length > 0 && (
          <button
            onClick={() => setSelectedPlatforms([])}
            className="px-3 py-1 rounded-full text-xs font-medium bg-red-600 text-white hover:bg-red-700"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateMonth("prev")}
          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
        >
          <ChevronLeftIcon className="h-5 w-5 text-slate-400" />
        </button>

        <h3 className="text-xl font-semibold text-white">
          {currentDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h3>

        <button
          onClick={() => navigateMonth("next")}
          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
        >
          <ChevronRightIcon className="h-5 w-5 text-slate-400" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Day Headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="p-2 text-center text-sm font-medium text-slate-400"
          >
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {calendarDays.map((day, index) => (
          <div
            key={index}
            onClick={() => handleDateClick(day.date)}
            className={`min-h-[100px] p-2 border border-slate-600 rounded-lg cursor-pointer hover:bg-slate-700/50 transition-colors ${
              !day.isCurrentMonth ? "opacity-50" : ""
            } ${day.isToday ? "ring-2 ring-sky-500" : ""}`}
          >
            <div className="text-sm font-medium text-white mb-1">
              {day.date.getDate()}
            </div>

            {/* Events */}
            <div className="space-y-1">
              {day.events.slice(0, 3).map((event) => (
                <div
                  key={event.id}
                  onClick={(e) => handleEventClick(event, e)}
                  className={`text-xs p-1 rounded text-white truncate ${PLATFORM_COLORS[event.platform]} hover:opacity-80 transition-opacity`}
                  title={`${event.title} (${event.platform})`}
                >
                  <div className="flex items-center space-x-1">
                    <span>{PLATFORM_ICONS[event.platform]}</span>
                    <span className="truncate">{event.title}</span>
                    <span>{STATUS_ICONS[event.status]}</span>
                  </div>
                </div>
              ))}
              {day.events.length > 3 && (
                <div className="text-xs text-slate-400 text-center">
                  +{day.events.length - 3} more
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                {editingEvent?.id ? "Edit Event" : "Create Event"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={editingEvent?.title || ""}
                  onChange={(e) =>
                    setEditingEvent((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  placeholder="Enter event title..."
                />
              </div>

              {/* Platform */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Platform *
                </label>
                <select
                  value={editingEvent?.platform || Platform.Instagram}
                  onChange={(e) =>
                    setEditingEvent((prev) => ({
                      ...prev,
                      platform: e.target.value as Platform,
                    }))
                  }
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                >
                  {Object.values(Platform).map((platform) => (
                    <option key={platform} value={platform}>
                      {PLATFORM_ICONS[platform]} {platform}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={editingEvent?.date || ""}
                    onChange={(e) =>
                      setEditingEvent((prev) => ({
                        ...prev,
                        date: e.target.value,
                      }))
                    }
                    className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={editingEvent?.time || ""}
                    onChange={(e) =>
                      setEditingEvent((prev) => ({
                        ...prev,
                        time: e.target.value,
                      }))
                    }
                    className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  />
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Content
                </label>
                <textarea
                  value={editingEvent?.content || ""}
                  onChange={(e) =>
                    setEditingEvent((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white h-24 resize-none"
                  placeholder="Enter your content..."
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Status
                </label>
                <select
                  value={editingEvent?.status || "draft"}
                  onChange={(e) =>
                    setEditingEvent((prev) => ({
                      ...prev,
                      status: e.target.value as CalendarEvent["status"],
                    }))
                  }
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                >
                  <option value="draft">📝 Draft</option>
                  <option value="scheduled">⏰ Scheduled</option>
                  <option value="published">✅ Published</option>
                  <option value="failed">❌ Failed</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              <button
                onClick={handleSaveEvent}
                disabled={
                  !editingEvent?.title ||
                  !editingEvent?.date ||
                  !editingEvent?.platform
                }
                className="flex-1 px-4 py-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded-lg font-medium"
              >
                {editingEvent?.id ? "Update" : "Create"}
              </button>

              {editingEvent?.id && (
                <button
                  onClick={handleDeleteEvent}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              )}

              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Best Time Recommendations Modal */}
      {showBestTimeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white flex items-center">
                <ClockIcon className="h-6 w-6 text-green-400 mr-3" />
                Best Time Recommendations
              </h3>
              <button
                onClick={() => setShowBestTimeModal(false)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <span className="text-2xl text-slate-400">×</span>
              </button>
            </div>

            <div className="space-y-6">
              {/* Configuration Form */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-slate-700/50 rounded-xl">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Target Language / Audience
                  </label>
                  <select
                    value={targetLanguage}
                    onChange={(e) => setTargetLanguage(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Select Target Audience</option>
                    <optgroup label="Major Languages">
                      <option value="English">🇺🇸🇬🇧🇨🇦🇦🇺 English speakers</option>
                      <option value="Spanish">🇪🇸🇲🇽🇦🇷 Spanish speakers</option>
                      <option value="French">🇫🇷🇨🇦🇧🇪 French speakers</option>
                      <option value="German">🇩🇪🇦🇹🇨🇭 German speakers</option>
                      <option value="Portuguese">
                        🇧🇷🇵🇹 Portuguese speakers
                      </option>
                      <option value="Chinese">🇨🇳🇹🇼 Chinese speakers</option>
                      <option value="Arabic">🇸🇦🇦🇪🇪🇬 Arabic speakers</option>
                      <option value="Hindi">🇮🇳 Hindi speakers</option>
                    </optgroup>
                    <optgroup label="European Languages">
                      <option value="Italian">🇮🇹 Italian speakers</option>
                      <option value="Russian">🇷🇺 Russian speakers</option>
                      <option value="Dutch">🇳🇱 Dutch speakers</option>
                      <option value="Swedish">🇸🇪 Swedish speakers</option>
                      <option value="Norwegian">🇳🇴 Norwegian speakers</option>
                      <option value="Danish">🇩🇰 Danish speakers</option>
                      <option value="Finnish">🇫🇮 Finnish speakers</option>
                      <option value="Polish">🇵🇱 Polish speakers</option>
                      <option value="Turkish">🇹🇷 Turkish speakers</option>
                      <option value="Greek">🇬🇷 Greek speakers</option>
                      <option value="Czech">🇨🇿 Czech speakers</option>
                      <option value="Hungarian">🇭🇺 Hungarian speakers</option>
                      <option value="Romanian">🇷🇴 Romanian speakers</option>
                      <option value="Bulgarian">🇧🇬 Bulgarian speakers</option>
                      <option value="Croatian">🇭🇷 Croatian speakers</option>
                      <option value="Serbian">🇷🇸 Serbian speakers</option>
                      <option value="Slovak">🇸🇰 Slovak speakers</option>
                      <option value="Slovenian">🇸🇮 Slovenian speakers</option>
                      <option value="Estonian">🇪🇪 Estonian speakers</option>
                      <option value="Latvian">🇱🇻 Latvian speakers</option>
                      <option value="Lithuanian">🇱🇹 Lithuanian speakers</option>
                    </optgroup>
                    <optgroup label="Asian Languages">
                      <option value="Japanese">🇯🇵 Japanese speakers</option>
                      <option value="Korean">🇰🇷 Korean speakers</option>
                      <option value="Thai">🇹🇭 Thai speakers</option>
                      <option value="Vietnamese">🇻🇳 Vietnamese speakers</option>
                      <option value="Indonesian">🇮🇩 Indonesian speakers</option>
                      <option value="Malay">🇲🇾 Malay speakers</option>
                      <option value="Tagalog">🇵🇭 Tagalog speakers</option>
                      <option value="Urdu">🇵🇰 Urdu speakers</option>
                      <option value="Bengali">🇧🇩 Bengali speakers</option>
                      <option value="Tamil">🇱🇰 Tamil speakers</option>
                    </optgroup>
                    <optgroup label="Middle Eastern">
                      <option value="Hebrew">🇮🇱 Hebrew speakers</option>
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Your Timezone
                  </label>
                  <select
                    value={userTimezone}
                    onChange={(e) => setUserTimezone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Select Your Timezone</option>
                    <optgroup label="Americas">
                      <option value="UTC-10">🇺🇸 Hawaii (UTC-10)</option>
                      <option value="UTC-9">🇺🇸 Alaska (UTC-9)</option>
                      <option value="UTC-8">��🇸 Pacific Time (UTC-8)</option>
                      <option value="UTC-7">🇺🇸 Mountain Time (UTC-7)</option>
                      <option value="UTC-6">🇺🇸 Central Time (UTC-6)</option>
                      <option value="UTC-5">🇺🇸 Eastern Time (UTC-5)</option>
                      <option value="UTC-3">🇧🇷 Brazil (UTC-3)</option>
                      <option value="UTC-3">🇦🇷 Argentina (UTC-3)</option>
                    </optgroup>
                    <optgroup label="Europe & Africa">
                      <option value="UTC+0">🇬🇧 GMT/UTC (UTC+0)</option>
                      <option value="UTC+1">🇩🇪 Central Europe (UTC+1)</option>
                      <option value="UTC+1">🇫🇷 France (UTC+1)</option>
                      <option value="UTC+1">🇮🇹 Italy (UTC+1)</option>
                      <option value="UTC+1">🇪🇸 Spain (UTC+1)</option>
                      <option value="UTC+1">🇳🇱 Netherlands (UTC+1)</option>
                      <option value="UTC+1">🇵🇱 Poland (UTC+1)</option>
                      <option value="UTC+1">🇸🇪 Sweden (UTC+1)</option>
                      <option value="UTC+1">🇳🇴 Norway (UTC+1)</option>
                      <option value="UTC+1">🇩🇰 Denmark (UTC+1)</option>
                      <option value="UTC+2">🇫🇮 Finland (UTC+2)</option>
                      <option value="UTC+2">🇬🇷 Greece (UTC+2)</option>
                      <option value="UTC+2">🇪🇬 Egypt (UTC+2)</option>
                      <option value="UTC+2">🇿🇦 South Africa (UTC+2)</option>
                      <option value="UTC+2">🇷🇴 Romania (UTC+2)</option>
                      <option value="UTC+2">🇧🇬 Bulgaria (UTC+2)</option>
                      <option value="UTC+2">🇪🇪 Estonia (UTC+2)</option>
                      <option value="UTC+2">🇱🇻 Latvia (UTC+2)</option>
                      <option value="UTC+2">🇱🇹 Lithuania (UTC+2)</option>
                      <option value="UTC+2">🇮🇱 Israel (UTC+2)</option>
                      <option value="UTC+3">🇷🇺 Moscow (UTC+3)</option>
                      <option value="UTC+3">🇹🇷 Turkey (UTC+3)</option>
                      <option value="UTC+3">🇸🇦 Saudi Arabia (UTC+3)</option>
                    </optgroup>
                    <optgroup label="Asia & Oceania">
                      <option value="UTC+4">🇦🇪 UAE (UTC+4)</option>
                      <option value="UTC+5">🇵🇰 Pakistan (UTC+5)</option>
                      <option value="UTC+5:30">🇮🇳 India (UTC+5:30)</option>
                      <option value="UTC+6">🇧🇩 Bangladesh (UTC+6)</option>
                      <option value="UTC+7">🇹🇭 Thailand (UTC+7)</option>
                      <option value="UTC+7">🇻🇳 Vietnam (UTC+7)</option>
                      <option value="UTC+7">🇮🇩 Indonesia (UTC+7)</option>
                      <option value="UTC+8">🇨🇳 China (UTC+8)</option>
                      <option value="UTC+8">🇲🇾 Malaysia (UTC+8)</option>
                      <option value="UTC+8">🇸🇬 Singapore (UTC+8)</option>
                      <option value="UTC+8">🇵🇭 Philippines (UTC+8)</option>
                      <option value="UTC+8">🇹🇼 Taiwan (UTC+8)</option>
                      <option value="UTC+9">🇯🇵 Japan (UTC+9)</option>
                      <option value="UTC+9">🇰🇷 South Korea (UTC+9)</option>
                      <option value="UTC+10">🇦🇺 Australia East (UTC+10)</option>
                      <option value="UTC+12">🇳🇿 New Zealand (UTC+12)</option>
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Platform
                  </label>
                  <select
                    value={selectedPlatformForTiming}
                    onChange={(e) =>
                      setSelectedPlatformForTiming(e.target.value as Platform)
                    }
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    {Object.values(Platform).map((platform) => (
                      <option key={platform} value={platform}>
                        {PLATFORM_ICONS[platform]} {platform}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={generateBestTimeRecommendations}
                disabled={!targetLanguage || !userTimezone}
                className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg font-medium transition-all duration-200"
              >
                Generate Recommendations
              </button>

              {/* Recommendations Display */}
              {recommendations.length > 0 && (
                <div className="space-y-4">
                  <div className="bg-slate-700/30 rounded-xl p-4">
                    <h4 className="text-xl font-semibold text-white mb-2">
                      📅 Optimal Posting Times for {targetLanguage} Speakers
                    </h4>
                    <p className="text-slate-300 text-sm">
                      Times converted to your timezone ({userTimezone}) • Target
                      regions: {recommendations[0]?.targetRegions?.join(", ")}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recommendations.map((rec, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-xl border ${
                          rec.type === "weekend"
                            ? "bg-blue-900/30 border-blue-500/30"
                            : "bg-slate-700/50 border-slate-600/50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-semibold text-white">
                            {rec.day}
                          </h5>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              rec.type === "weekend"
                                ? "bg-blue-500/20 text-blue-300"
                                : "bg-slate-500/20 text-slate-300"
                            }`}
                          >
                            {rec.type}
                          </span>
                        </div>
                        <div className="space-y-2">
                          {rec.times.map((time, timeIndex) => (
                            <div
                              key={timeIndex}
                              className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg"
                            >
                              <span className="text-slate-300">{time}</span>
                              <span className="text-green-400 text-sm font-medium">
                                {timeIndex === 0
                                  ? "🔥 Peak"
                                  : timeIndex === 1
                                    ? "⭐ Good"
                                    : "📈 Fair"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-slate-700/30 rounded-xl p-6 mt-6">
                    <h5 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <span className="text-blue-400 mr-2">��</span>
                      Pro Tips for {
                        PLATFORM_ICONS[selectedPlatformForTiming]
                      }{" "}
                      {selectedPlatformForTiming}
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-300">
                      <div>
                        <p className="font-medium text-white mb-1">
                          🎯 Best Practices:
                        </p>
                        <ul className="space-y-1 list-disc list-inside">
                          <li>Post consistently at peak times</li>
                          <li>Test different time slots for your audience</li>
                          <li>
                            Consider time zone differences for global reach
                          </li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-white mb-1">
                          ⚡ Platform-Specific Tips:
                        </p>
                        <ul className="space-y-1 list-disc list-inside">
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
      <ContentCalendarExtensions events={events} className="mt-8" />
    </div>
  );
};

export default EnhancedCalendar;
