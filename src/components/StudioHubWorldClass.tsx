import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Sparkles,
  TrendingUp,
  Users,
  Eye,
  Calendar,
  BarChart3,
  Zap,
  Target,
  Award,
  Clock,
  Plus,
  Play,
  Image,
  MessageSquare,
  Share2,
  Palette,
  Search,
  Bell,
  Settings,
  HelpCircle,
  Rocket,
  Star,
  ArrowRight,
  Activity,
  Globe,
  Timer,
  Edit3,
  CheckCircle,
  User,
  Heart,
  Video,
  Mic,
  Coffee,
  PauseCircle,
  SkipForward,
  RotateCcw,
  StickyNote,
  Trash2,
  CheckSquare,
  Square,
  BookOpen,
  Lightbulb,
  Flame,
  Brain,
  Workflow,
  ChevronRight,
  ChevronDown,
  FileText,
  PlayCircle,
  Upload,
  RefreshCw,
  AlertCircle,
  Filter,
  MoreHorizontal,
  Archive,
  GitBranch,
  Layers,
  X,
  Monitor,
  Moon,
  Sliders,
  Grid3X3,
  List,
  Gauge,
  Volume2,
  HardDrive,
  Music,
  Image as ImageIcon,
  Shield,
  Lock,
  Copy,
  Send,
} from "lucide-react";

// Import our world-class components
import {
  Button,
  Card,
  StatCard,
  QuickActionCard,
  ProgressBar,
  TabHeader,
  GradientText,
  Badge,
} from "./ui/WorldClassComponents";
import NewProjectModal, { NewProjectData } from "./NewProjectModal";
import ProjectTemplatesModal from "./ProjectTemplatesModal";
import ProjectFileUpload from "./ProjectFileUpload";
import AddTextContentModal from "./AddTextContentModal";
import {
  uploadFile,
  downloadFile,
  deleteFile,
  getFileContent,
  getUserFiles,
  isTextFile as isTextFileUtil,
  storageService,
  UploadedFile,
  UploadProgress
} from '../services/storageService';
import { auth } from '../config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { NicheTemplate } from "../data/nicheProjectTemplates";
import { ProjectTemplate } from "../data/projectTemplates";
import { ComprehensiveNicheTemplate } from "../data/comprehensiveNicheTemplates";
// Import enhanced Pro components
import FocusTimerPro from "./enhanced/FocusTimerPro";
import DailyGoalsPro from "./enhanced/DailyGoalsPro";
import QuickNotesPro from "./enhanced/QuickNotesPro";
import NotificationsPro from "./enhanced/NotificationsPro";
import YouTubeQuickStats from "./YouTubeQuickStats";
import CreativeBlockBreaker from "./CreativeBlockBreaker";

interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  completedToday: number;
  totalViews: number;
  engagement: number;
  growth: number;
}

interface RecentActivity {
  id: string;
  type: "content" | "analytics" | "strategy" | "thumbnail";
  title: string;
  timestamp: Date;
  platform: string;
  status: "completed" | "in_progress" | "draft";
  performance?: number;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  action: () => void;
  badge?: string;
  popular?: boolean;
}

interface TimerSession {
  type: 'focus' | 'break';
  duration: number;
  label: string;
}

interface DailyGoal {
  id: string;
  title: string;
  current: number;
  target: number;
  color: string;
  icon: React.ReactNode;
}

interface QuickNote {
  id: string;
  text: string;
  timestamp: Date;
  color: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  category: string;
  unlocked: boolean;
  icon: React.ReactNode;
}

interface NotificationItem {
  id: string;
  type: 'success' | 'warning' | 'info' | 'trend';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: () => void;
}

interface PipelineProject {
  id: string;
  title: string;
  type: 'video' | 'thumbnail' | 'strategy' | 'analytics' | 'content';
  stage: 'planning' | 'in_progress' | 'review' | 'completed' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee?: string;
  dueDate?: Date;
  progress: number;
  description: string;
  platform: string;
  tags: string[];
  created: Date;
  lastUpdated: Date;
  estimatedHours?: number;
  actualHours?: number;
  dependencies?: string[];
  attachments?: number;
  comments?: number;
}

interface PipelineFilters {
  stage?: string;
  type?: string;
  priority?: string;
  assignee?: string;
  platform?: string;
}

interface PipelineStats {
  totalProjects: number;
  inProgress: number;
  completedThisWeek: number;
  overdue: number;
  averageCompletionTime: number;
  productivityScore: number;
}

interface StudioHubWorldClassProps {
  onNavigateToTab?: (tab: string) => void;
  onCreateContent?: (type: string) => void;
  userPlan?: string;
  userName?: string;
  user?: any;
  isPremium?: boolean;
  onUpgrade?: () => void;
}

const StudioHubWorldClass: React.FC<StudioHubWorldClassProps> = ({
  onNavigateToTab,
  onCreateContent,
  userPlan = "free",
  userName = "Creator",
  user,
  isPremium = false,
  onUpgrade,
}) => {
  const [activeInsight, setActiveInsight] = useState<"overview" | "performance" | "trends" | "goals">("overview");

  // Pipeline state
  const [pipelineProjects, setPipelineProjects] = useState<PipelineProject[]>([]);
  const [pipelineFilters, setPipelineFilters] = useState<PipelineFilters>({});
  const [pipelineView, setPipelineView] = useState<'kanban' | 'list' | 'timeline'>('kanban');
  const [showPipelineFilters, setShowPipelineFilters] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [showProjectFilesModal, setShowProjectFilesModal] = useState(false);
  const [showFileUploadModal, setShowFileUploadModal] = useState(false);
  const [showArchiveConfirmModal, setShowArchiveConfirmModal] = useState(false);
  const [projectToArchive, setProjectToArchive] = useState<string | null>(null);
  const [projectFiles, setProjectFiles] = useState<Record<string, UploadedFile[]>>({});
  const [authUser, loading, authError] = useAuthState(auth);
  const [totalUsedStorage, setTotalUsedStorage] = useState(0); // Will be calculated from actual files
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [showAddTextContentModal, setShowAddTextContentModal] = useState(false);
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  // File action states
  const [filePreviewModal, setFilePreviewModal] = useState<{ show: boolean; file: any | null }>({ show: false, file: null });
  const [fileActionMenus, setFileActionMenus] = useState<Record<string, boolean>>({});
  const [projectActionMenus, setProjectActionMenus] = useState<Record<string, boolean>>({});
  const [shareFileModal, setShareFileModal] = useState<{ show: boolean; file: any | null }>({ show: false, file: null });
  const [fileContent, setFileContent] = useState<string>('');
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [contentError, setContentError] = useState<string>('');

  // Customization settings state
  const [customSettings, setCustomSettings] = useState({
    quickActions: {
      enabled: true,
      layout: 'grid' as 'grid' | 'list',
      showDescriptions: true
    },
    insights: {
      enabled: true,
      defaultView: 'overview' as 'overview' | 'performance' | 'trends' | 'goals',
      autoRefresh: true
    },
    pipeline: {
      enabled: true,
      defaultView: 'kanban' as 'kanban' | 'list' | 'timeline',
      showFilters: false
    },
    notifications: {
      enabled: true,
      autoShow: false,
      maxCount: 5
    },
    focusTimer: {
      enabled: true,
      defaultPreset: 'pomodoro' as 'pomodoro' | 'deep' | 'quick' | 'flow',
      autoStart: false
    },
    theme: {
      compactMode: false,
      animations: true,
      highContrast: false
    }
  });

  // Focus Timer State
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [currentSession, setCurrentSession] = useState<TimerSession>({ type: 'focus', duration: 25, label: 'Focus Time' });
  const [timerPreset, setTimerPreset] = useState<'pomodoro' | 'deep' | 'quick' | 'flow'>('pomodoro');

  // Quick Notes State
  const [quickNotes, setQuickNotes] = useState<QuickNote[]>([]);
  const [newNoteText, setNewNoteText] = useState('');
  const [showNotesPanel, setShowNotesPanel] = useState(false);

  // Daily Goals State
  const [dailyGoals, setDailyGoals] = useState<DailyGoal[]>([]);

  // Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Placeholder projects state - force to show examples
  const [showPlaceholderProjects, setShowPlaceholderProjects] = useState(true);

  // Achievements State
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  // Initialize total storage calculation
  useEffect(() => {
    const calculateInitialStorage = () => {
      let totalSize = 0;
      Object.values(projectFiles).forEach(files => {
        files.forEach(file => {
          totalSize += file.size || 0;
        });
      });
      setTotalUsedStorage(totalSize);
    };

    calculateInitialStorage();
  }, []); // Run once on component mount

  // Mock project stats
  const projectStats: ProjectStats = {
    totalProjects: 127,
    activeProjects: 8,
    completedToday: 3,
    totalViews: 284000,
    engagement: 6.8,
    growth: 24.5,
  };

  // Mock recent activity
  const recentActivity: RecentActivity[] = [
    {
      id: "1",
      type: "content",
      title: "10 AI Tools for Content Creation",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      platform: "YouTube",
      status: "completed",
      performance: 92,
    },
    {
      id: "2",
      type: "analytics",
      title: "Channel Performance Analysis",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      platform: "Multi-Platform",
      status: "completed",
      performance: 88,
    },
    {
      id: "3",
      type: "thumbnail",
      title: "Tech Review Thumbnail Set",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      platform: "YouTube",
      status: "in_progress",
    },
    {
      id: "4",
      type: "strategy",
      title: "Q2 Content Strategy",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      platform: "Multi-Platform",
      status: "draft",
    },
    {
      id: "5",
      type: "content",
      title: "Instagram Reel: 'Quick Productivity Tips'",
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      platform: "Instagram",
      status: "completed",
      performance: 95,
    },
    {
      id: "6",
      type: "thumbnail",
      title: "Gaming Video Thumbnail Pack",
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      platform: "YouTube",
      status: "completed",
      performance: 78,
    },
  ];

  // Initialize preserved features
  useEffect(() => {
    // Load saved data from localStorage
    const savedNotes = localStorage.getItem('studioHub:quickNotes');
    if (savedNotes) {
      setQuickNotes(JSON.parse(savedNotes));
    }

    const savedGoals = localStorage.getItem('studioHub:progressGoals');
    if (savedGoals) {
      setDailyGoals(JSON.parse(savedGoals));
    } else {
      // Initialize default goals
      setDailyGoals([
        { id: '1', title: 'Content Created', current: 2, target: 5, color: 'var(--brand-primary)', icon: <MessageSquare className="w-4 h-4" /> },
        { id: '2', title: 'Focus Sessions', current: 3, target: 8, color: 'var(--color-success)', icon: <Timer className="w-4 h-4" /> },
        { id: '3', title: 'Analytics Reviews', current: 1, target: 3, color: 'var(--brand-secondary)', icon: <BarChart3 className="w-4 h-4" /> },
        { id: '4', title: 'Strategy Updates', current: 0, target: 2, color: 'var(--color-warning)', icon: <Target className="w-4 h-4" /> },
      ]);
    }

    // Load pipeline projects
    const savedPipeline = localStorage.getItem('studioHub:pipelineProjects');
    const hasRealProjects = localStorage.getItem('studioHub:hasRealProjects') === 'true';

    // Always initialize sample pipeline projects for demo
    const sampleProjects: PipelineProject[] = [
        {
          id: '1',
          title: 'AI Tools Video Series',
          type: 'video',
          stage: 'in_progress',
          priority: 'high',
          assignee: 'You',
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          progress: 65,
          description: 'Create comprehensive video series about AI productivity tools',
          platform: 'YouTube',
          tags: ['AI', 'Productivity', 'Tools'],
          created: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000),
          estimatedHours: 20,
          actualHours: 13,
          attachments: 5,
          comments: 3
        },
        {
          id: '2',
          title: 'Thumbnail A/B Testing',
          type: 'thumbnail',
          stage: 'review',
          priority: 'medium',
          assignee: 'You',
          dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          progress: 90,
          description: 'Test different thumbnail designs for tech content',
          platform: 'YouTube',
          tags: ['Thumbnails', 'Testing', 'Design'],
          created: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          lastUpdated: new Date(Date.now() - 30 * 60 * 1000),
          estimatedHours: 8,
          actualHours: 7,
          attachments: 12,
          comments: 2
        },
        {
          id: '3',
          title: 'Q2 Content Strategy',
          type: 'strategy',
          stage: 'planning',
          priority: 'high',
          assignee: 'You',
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          progress: 25,
          description: 'Plan content strategy for Q2 across all platforms',
          platform: 'Multi-Platform',
          tags: ['Strategy', 'Planning', 'Growth'],
          created: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          estimatedHours: 15,
          actualHours: 4,
          attachments: 3,
          comments: 1
        },
        {
          id: '4',
          title: 'YouTube Analytics Deep Dive',
          type: 'analytics',
          stage: 'completed',
          priority: 'low',
          assignee: 'You',
          dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          progress: 100,
          description: 'Analyze channel performance and identify growth opportunities',
          platform: 'YouTube',
          tags: ['Analytics', 'Performance', 'Growth'],
          created: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          estimatedHours: 6,
          actualHours: 5,
          attachments: 8,
          comments: 4
        }
    ];
    setPipelineProjects(sampleProjects);

    // If user has saved projects, we could merge them here
    if (savedPipeline && hasRealProjects) {
      try {
        const savedProjects = JSON.parse(savedPipeline);
        // Merge saved projects with sample projects
        setPipelineProjects([...sampleProjects, ...savedProjects]);
      } catch (error) {
        console.warn('Failed to parse saved projects:', error);
      }
    }

    // Initialize achievements
    setAchievements([
      { id: '1', title: 'Content Creator', description: 'Create 100 pieces of content', progress: 67, target: 100, category: 'productivity', unlocked: false, icon: <Edit3 className="w-4 h-4" /> },
      { id: '2', title: 'Focus Master', description: 'Complete 50 focus sessions', progress: 32, target: 50, category: 'productivity', unlocked: false, icon: <Timer className="w-4 h-4" /> },
      { id: '3', title: 'Analytics Pro', description: 'Analyze 25 performance reports', progress: 18, target: 25, category: 'analytics', unlocked: false, icon: <BarChart3 className="w-4 h-4" /> },
      { id: '4', title: 'Viral Content', description: 'Reach 1M total views', progress: 284000, target: 1000000, category: 'growth', unlocked: false, icon: <TrendingUp className="w-4 h-4" /> },
    ]);

    // Initialize sample notifications
    setNotifications([
      { id: '1', type: 'success', title: 'Content Performance', message: 'Your latest video gained 15K views in 24 hours!', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), read: false },
      { id: '2', type: 'trend', title: 'Trending Topic', message: '"AI productivity" is trending +156% this week', timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), read: false },
      { id: '3', type: 'warning', title: 'Credits Low', message: 'You have 5 credits remaining', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), read: true },
    ]);
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('studioHub:quickNotes', JSON.stringify(quickNotes));
  }, [quickNotes]);

  useEffect(() => {
    localStorage.setItem('studioHub:progressGoals', JSON.stringify(dailyGoals));
  }, [dailyGoals]);

  useEffect(() => {
    localStorage.setItem('studioHub:pipelineProjects', JSON.stringify(pipelineProjects));
  }, [pipelineProjects]);

  // Load saved custom settings
  useEffect(() => {
    const savedSettings = localStorage.getItem('studioHub:customSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setCustomSettings(parsed);

        // Apply settings to current state
        if (parsed.insights?.defaultView) {
          setActiveInsight(parsed.insights.defaultView);
        }
        if (parsed.pipeline?.defaultView) {
          setPipelineView(parsed.pipeline.defaultView);
        }
        if (parsed.pipeline?.showFilters) {
          setShowPipelineFilters(parsed.pipeline.showFilters);
        }
        if (parsed.focusTimer?.defaultPreset) {
          setTimerPreset(parsed.focusTimer.defaultPreset);
        }
      } catch (error) {
        console.log('Error loading custom settings:', error);
      }
    }
  }, []);

  // Auto-show notifications effect
  useEffect(() => {
    if (customSettings.notifications.enabled && customSettings.notifications.autoShow && notifications.length > 0) {
      const unreadCount = notifications.filter(n => !n.read).length;
      if (unreadCount > 0) {
        setShowNotifications(true);
      }
    }
  }, [notifications, customSettings.notifications.enabled, customSettings.notifications.autoShow]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isTimerActive) {
      interval = setInterval(() => {
        if (timerSeconds > 0) {
          setTimerSeconds(timerSeconds - 1);
        } else if (timerMinutes > 0) {
          setTimerMinutes(timerMinutes - 1);
          setTimerSeconds(59);
        } else {
          // Timer completed
          setIsTimerActive(false);
          setTimerMinutes(currentSession.duration);
          setTimerSeconds(0);

          // Switch session type
          if (currentSession.type === 'focus') {
            setCurrentSession({ type: 'break', duration: 5, label: 'Break Time' });
            setTimerMinutes(5);
          } else {
            setCurrentSession({ type: 'focus', duration: 25, label: 'Focus Time' });
            setTimerMinutes(25);
          }
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, timerMinutes, timerSeconds, currentSession]);

  // Quick actions configuration
  const quickActions: QuickAction[] = [
    {
      id: "generator",
      title: "AI Content Generator",
      description: "Create engaging content with AI assistance",
      icon: <Sparkles />,
      color: "var(--brand-primary)",
      action: () => onNavigateToTab?.("generator"),
      badge: "Most Popular",
      popular: true,
    },
    {
      id: "thumbnails",
      title: "Thumbnail Studio",
      description: "Design eye-catching video thumbnails",
      icon: <Image />,
      color: "var(--brand-secondary)",
      action: () => onNavigateToTab?.("thumbnailMaker"),
      badge: "New Features",
    },
    {
      id: "trends",
      title: "Trend Analysis",
      description: "Discover trending topics and opportunities",
      icon: <TrendingUp />,
      color: "var(--color-success)",
      action: () => onNavigateToTab?.("trends"),
    },
    {
      id: "analytics",
      title: "YouTube Analytics",
      description: "Deep dive into channel performance",
      icon: <BarChart3 />,
      color: "#ef4444",
      action: () => onNavigateToTab?.("youtubeStats"),
    },
    {
      id: "strategy",
      title: "Content Strategy",
      description: "Plan your content roadmap",
      icon: <Target />,
      color: "var(--accent-cyan)",
      action: () => onNavigateToTab?.("strategy"),
    },
    {
      id: "calendar",
      title: "Content Calendar",
      description: "Schedule and organize your content",
      icon: <Calendar />,
      color: "var(--color-warning)",
      action: () => onNavigateToTab?.("calendar"),
    },
  ];

  const formatTimeAgo = (date: Date) => {
    const diffInHours = Math.floor((Date.now() - date.getTime()) / (60 * 60 * 1000));
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "var(--color-success)";
      case "in_progress": return "var(--color-warning)";
      case "draft": return "var(--text-tertiary)";
      default: return "var(--text-tertiary)";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video": return <PlayCircle className="w-4 h-4" />;
      case "content": return <FileText className="w-4 h-4" />;
      case "analytics": return <BarChart3 className="w-4 h-4" />;
      case "strategy": return <Target className="w-4 h-4" />;
      case "thumbnail": return <Image className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  // Helper functions for preserved features
  const addQuickNote = () => {
    if (newNoteText.trim()) {
      const newNote: QuickNote = {
        id: Date.now().toString(),
        text: newNoteText.trim(),
        timestamp: new Date(),
        color: '#3b82f6'
      };
      setQuickNotes([newNote, ...quickNotes]);
      setNewNoteText('');
    }
  };

  const deleteNote = (id: string) => {
    setQuickNotes(quickNotes.filter(note => note.id !== id));
  };

  const updateGoalProgress = (goalId: string, increment: number) => {
    setDailyGoals(goals => goals.map(goal =>
      goal.id === goalId
        ? { ...goal, current: Math.max(0, Math.min(goal.target, goal.current + increment)) }
        : goal
    ));
  };

  const startTimer = (preset: typeof timerPreset) => {
    const presets = {
      pomodoro: { type: 'focus' as const, duration: 25, label: 'Pomodoro Focus' },
      deep: { type: 'focus' as const, duration: 90, label: 'Deep Work' },
      quick: { type: 'focus' as const, duration: 15, label: 'Quick Session' },
      flow: { type: 'focus' as const, duration: 45, label: 'Flow State' }
    };

    const session = presets[preset];
    setCurrentSession(session);
    setTimerMinutes(session.duration);
    setTimerSeconds(0);
    setTimerPreset(preset);
    setIsTimerActive(true);
  };

  const toggleTimer = () => {
    setIsTimerActive(!isTimerActive);
  };

  const resetTimer = () => {
    setIsTimerActive(false);
    setTimerMinutes(currentSession.duration);
    setTimerSeconds(0);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  // Pipeline helper functions
  const filteredProjects = useMemo(() => {
    // Sample project IDs to identify them
    const sampleProjectIds = ['1', '2', '3', '4', '5'];

    return pipelineProjects.filter(project => {
      // Filter out sample projects if showPlaceholderProjects is false
      if (!showPlaceholderProjects && sampleProjectIds.includes(project.id)) {
        return false;
      }

      // Apply other filters
      if (pipelineFilters.stage && project.stage !== pipelineFilters.stage) return false;
      if (pipelineFilters.type && project.type !== pipelineFilters.type) return false;
      if (pipelineFilters.priority && project.priority !== pipelineFilters.priority) return false;
      if (pipelineFilters.platform && project.platform !== pipelineFilters.platform) return false;
      return true;
    });
  }, [pipelineProjects, pipelineFilters, showPlaceholderProjects]);

  const pipelineStats: PipelineStats = useMemo(() => {
    const now = Date.now();
    const weekAgo = now - 7 * 24 * 60 * 60 * 1000;

    return {
      totalProjects: filteredProjects.length,
      inProgress: filteredProjects.filter(p => p.stage === 'in_progress').length,
      completedThisWeek: filteredProjects.filter(p =>
        p.stage === 'completed' && p.lastUpdated.getTime() > weekAgo
      ).length,
      overdue: filteredProjects.filter(p =>
        p.dueDate && p.dueDate.getTime() < now && p.stage !== 'completed'
      ).length,
      averageCompletionTime: filteredProjects.length > 0 ? 5.2 : 0, // Mock data
      productivityScore: filteredProjects.length > 0 ? 87 : 0 // Mock data
    };
  }, [filteredProjects]);

  const updateProjectStage = (projectId: string, newStage: PipelineProject['stage']) => {
    setPipelineProjects(projects =>
      projects.map(project =>
        project.id === projectId
          ? { ...project, stage: newStage, lastUpdated: new Date() }
          : project
      )
    );
  };

  const updateProjectProgress = (projectId: string, progress: number) => {
    setPipelineProjects(projects =>
      projects.map(project =>
        project.id === projectId
          ? { ...project, progress, lastUpdated: new Date() }
          : project
      )
    );
  };

  const duplicateProject = (projectId: string) => {
    const project = pipelineProjects.find(p => p.id === projectId);
    if (project) {
      const newProject: PipelineProject = {
        ...project,
        id: Date.now().toString(),
        title: `${project.title} (Copy)`,
        stage: 'planning',
        progress: 0,
        created: new Date(),
        lastUpdated: new Date(),
        actualHours: 0
      };
      setPipelineProjects(projects => [newProject, ...projects]);
    }
  };

  const getStageProjects = (stage: PipelineProject['stage']) => {
    return filteredProjects.filter(project => project.stage === stage);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#eab308';
      case 'low': return '#22c55e';
      default: return 'var(--text-tertiary)';
    }
  };



  const formatDueDate = (date: Date | undefined) => {
    if (!date) return 'No due date';

    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return `${Math.abs(diffDays)}d overdue`;
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays <= 7) return `${diffDays}d left`;
    return date.toLocaleDateString();
  };

  const isDueSoon = (date: Date | undefined) => {
    if (!date) return false;

    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  };

  const isOverdue = (date: Date | undefined) => {
    if (!date) return false;
    return date.getTime() < new Date().getTime();
  };

  const editProject = (projectId: string, updatedData: Partial<PipelineProject>) => {
    setPipelineProjects(projects =>
      projects.map(project =>
        project.id === projectId
          ? { ...project, ...updatedData, lastUpdated: new Date() }
          : project
      )
    );

    // Add notification
    const notification = {
      id: Date.now().toString(),
      type: 'success' as const,
      title: 'Project Updated',
      message: `Project "${updatedData.title || pipelineProjects.find(p => p.id === projectId)?.title}" has been updated`,
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [notification, ...prev]);
  };

  const archiveProject = (projectId: string) => {
    const project = pipelineProjects.find(p => p.id === projectId);
    if (!project) return;

    setPipelineProjects(projects => projects.filter(p => p.id !== projectId));

    // Add notification
    const notification = {
      id: Date.now().toString(),
      type: 'info' as const,
      title: 'Project Archived',
      message: `"${project.title}" has been moved to archive`,
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [notification, ...prev]);

    setSelectedProject(null);
    setShowArchiveConfirmModal(false);
    setProjectToArchive(null);
  };

  const handleArchiveProject = (projectId: string) => {
    setProjectToArchive(projectId);
    setShowArchiveConfirmModal(true);
  };

  const createNewProject = (projectData: NewProjectData) => {
    const newProject: PipelineProject = {
      id: Date.now().toString(),
      title: projectData.title,
      type: projectData.type,
      stage: 'planning',
      priority: projectData.priority,
      assignee: projectData.assignee,
      dueDate: projectData.dueDate,
      progress: 0,
      description: projectData.description,
      platform: projectData.platform,
      tags: projectData.tags,
      created: new Date(),
      lastUpdated: new Date(),
      estimatedHours: projectData.estimatedHours,
      actualHours: 0,
      attachments: 0,
      comments: 0
    };

    setPipelineProjects(projects => [newProject, ...projects]);

    // Mark that user has created real projects
    setShowPlaceholderProjects(false);
    localStorage.setItem('studioHub:hasRealProjects', 'true');

    // Update daily goals if applicable
    if (projectData.type === 'content') {
      updateGoalProgress('1', 1); // Content Created goal
    }
    if (projectData.type === 'strategy') {
      updateGoalProgress('4', 1); // Strategy Updates goal
    }

    // Add success notification
    const successNotification = {
      id: Date.now().toString(),
      type: 'success' as const,
      title: 'Project Created',
      message: `"${projectData.title}" has been added to your pipeline`,
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [successNotification, ...prev]);
  };

  const handleTemplateSelect = (template: NicheTemplate | ProjectTemplate | ComprehensiveNicheTemplate | any) => {
    setShowTemplatesModal(false);

    // Check if this is a configured comprehensive template
    if ('customConfiguration' in template && template.customConfiguration) {
      const nicheTemplate = template as ComprehensiveNicheTemplate;
      const config = template.customConfiguration;

      // Create customized projects based on user configuration
      config.customizedRoadmap.forEach((phase: any, phaseIndex: number) => {
        // Create a project for each phase
        const phaseProject: PipelineProject = {
          id: (Date.now() + phaseIndex * 1000).toString(),
          title: `${phase.name} - ${nicheTemplate.name}`,
          type: 'strategy',
          stage: 'planning',
          priority: phase.priority === 'high' ? 'high' : phase.priority === 'medium' ? 'medium' : 'low',
          assignee: 'You',
          dueDate: new Date(Date.now() + phaseIndex * phase.duration * 24 * 60 * 60 * 1000),
          progress: 0,
          description: `${phase.name}: ${phase.milestones.join(', ')}. Duration: ${phase.duration} days. Estimated cost: $${phase.estimatedCost}/month.`,
          platform: 'Multi-Platform',
          tags: [nicheTemplate.category, 'roadmap', phase.name.toLowerCase()],
          created: new Date(),
          lastUpdated: new Date(),
          estimatedHours: Math.round(phase.duration * (config.userProfile.timeCommitment / 7)), // Convert daily time to phase total
          actualHours: 0,
          attachments: 0,
          comments: 0
        };

        setPipelineProjects(projects => [phaseProject, ...projects]);
      });

      // Create projects for recommended tools setup
      config.recommendedTools.slice(0, 5).forEach((tool: any, toolIndex: number) => {
        const toolProject: PipelineProject = {
          id: (Date.now() + (toolIndex + 10) * 1000).toString(),
          title: `Setup ${tool.name}`,
          type: 'content',
          stage: 'planning',
          priority: tool.priority === 'essential' ? 'high' : 'medium',
          assignee: 'You',
          dueDate: new Date(Date.now() + (toolIndex + 1) * 24 * 60 * 60 * 1000), // Setup tools first
          progress: 0,
          description: `Set up ${tool.name} for ${tool.category}. Monthly cost: $${tool.cost}. ${tool.reason}`,
          platform: 'Multi-Platform',
          tags: [nicheTemplate.category, 'tools', tool.category.toLowerCase()],
          created: new Date(),
          lastUpdated: new Date(),
          estimatedHours: 2, // Assume 2 hours to setup each tool
          actualHours: 0,
          attachments: 0,
          comments: 0
        };

        setPipelineProjects(projects => [toolProject, ...projects]);
      });

      // Create content projects based on original blueprint but customized
      nicheTemplate.blueprint.preBuiltProjects.forEach((projectData, index) => {
        const customizedProject: PipelineProject = {
          id: (Date.now() + (index + 20) * 1000).toString(),
          title: projectData.title || `${nicheTemplate.name} Project ${index + 1}`,
          type: projectData.type || 'content',
          stage: 'planning',
          priority: config.userProfile.primaryGoal === 'growth' && projectData.type === 'content' ? 'high' :
                   config.userProfile.primaryGoal === 'monetization' && projectData.type === 'strategy' ? 'high' :
                   projectData.priority || 'medium',
          assignee: config.userProfile.hasTeam ? 'Team' : 'You',
          dueDate: new Date(Date.now() + (index + config.customizedRoadmap.length + 7) * 24 * 60 * 60 * 1000),
          progress: 0,
          description: `${projectData.description} | Customized for ${config.userProfile.experienceLevel} level with ${config.userProfile.timeCommitment}h/week commitment.`,
          platform: projectData.platform || 'Multi-Platform',
          tags: [...(projectData.tags || []), nicheTemplate.category, `${config.userProfile.experienceLevel}-level`],
          created: new Date(),
          lastUpdated: new Date(),
          estimatedHours: Math.round((projectData.estimatedHours || 5) *
            (config.userProfile.experienceLevel === 'beginner' ? 1.5 :
             config.userProfile.experienceLevel === 'advanced' ? 0.7 : 1.0)),
          actualHours: 0,
          attachments: 0,
          comments: 0
        };

        setPipelineProjects(projects => [customizedProject, ...projects]);
      });

      // Add customized success notifications
      const configNotification = {
        id: Date.now().toString(),
        type: 'success' as const,
        title: `🎯 Smart Template Applied! (${config.successProbability}% Success Rate)`,
        message: `${nicheTemplate.name} customized for ${config.userProfile.experienceLevel} level with $${config.estimatedCost}/month budget. ${config.customizedRoadmap.length} phases, ${config.recommendedTools.length} tools, ${nicheTemplate.blueprint.preBuiltProjects.length} content projects created.`,
        timestamp: new Date(),
        read: false
      };
      setNotifications(prev => [configNotification, ...prev]);

      // Add projected outcomes notification
      const outcomeNotification = {
        id: (Date.now() + 1).toString(),
        type: 'info' as const,
        title: '📊 Your Projected Success',
        message: `Based on your profile: ${config.projectedOutcomes[0]?.value.toLocaleString()} subscribers and $${config.projectedOutcomes[1]?.value.toLocaleString()}/month revenue in 6 months (${config.projectedOutcomes[0]?.confidence}% confidence)`,
        timestamp: new Date(),
        read: false
      };
      setNotifications(prev => [outcomeNotification, ...prev]);

      // Add timeline notification
      const timelineNotification = {
        id: (Date.now() + 2).toString(),
        type: 'info' as const,
        title: '⏰ Your Customized Timeline',
        message: `${config.estimatedTimeline} days total implementation (${Math.round(config.estimatedTimeline / 30)} months). Optimized for ${config.userProfile.timeCommitment}h/week schedule.`,
        timestamp: new Date(),
        read: false
      };
      setNotifications(prev => [timelineNotification, ...prev]);

    } else if ('blueprint' in template) {
      // Regular comprehensive template without configuration
      const nicheTemplate = template as ComprehensiveNicheTemplate;

      // Create projects from the blueprint
      nicheTemplate.blueprint.preBuiltProjects.forEach((projectData, index) => {
        const newProject: PipelineProject = {
          id: (Date.now() + index).toString(),
          title: projectData.title || `${nicheTemplate.name} Project ${index + 1}`,
          type: projectData.type || 'content',
          stage: 'planning',
          priority: projectData.priority || 'medium',
          assignee: projectData.assignee || 'You',
          dueDate: projectData.dueDate,
          progress: 0,
          description: projectData.description || '',
          platform: projectData.platform || 'Multi-Platform',
          tags: [...(projectData.tags || []), nicheTemplate.category],
          created: new Date(),
          lastUpdated: new Date(),
          estimatedHours: projectData.estimatedHours || 5,
          actualHours: 0,
          attachments: 0,
          comments: 0
        };

        setPipelineProjects(projects => [newProject, ...projects]);
      });

      // Add success notification for comprehensive template
      const successNotification = {
        id: Date.now().toString(),
        type: 'success' as const,
        title: 'A++ Blueprint Applied! 🚀',
        message: `${nicheTemplate.name} comprehensive blueprint created with ${nicheTemplate.blueprint.preBuiltProjects.length} projects, roadmap, tools, and automation workflows`,
        timestamp: new Date(),
        read: false
      };
      setNotifications(prev => [successNotification, ...prev]);

      // Add additional notification for comprehensive features
      const featuresNotification = {
        id: (Date.now() + 1).toString(),
        type: 'info' as const,
        title: 'Complete Business Blueprint Ready! 📋',
        message: `90-day roadmap, content templates, financial projections, and automation workflows are now available in your projects`,
        timestamp: new Date(),
        read: false
      };
      setNotifications(prev => [featuresNotification, ...prev]);
    } else {
      // Quick template - open modal with pre-filled data
      const quickTemplate = template as ProjectTemplate;
      const projectData: NewProjectData = {
        title: quickTemplate.name,
        type: quickTemplate.data.type || 'content',
        platform: quickTemplate.data.platform || 'Multi-Platform',
        priority: quickTemplate.data.priority || 'medium',
        description: quickTemplate.data.description || '',
        tags: quickTemplate.data.tags || [],
        estimatedHours: quickTemplate.data.estimatedHours || 5,
        assignee: 'You',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 week from now
      };

      createNewProject(projectData);
    }
  };

  const handleCreateFromScratch = () => {
    setShowTemplatesModal(false);
    setShowNewProjectModal(true);
  };

  // File handling functions
  const handleFilesUploaded = async (files: UploadedFile[]) => {
    if (!selectedProject) return;

    // Add files to specific project
    setProjectFiles(prev => {
      const updatedFiles = {
        ...prev,
        [selectedProject]: [...(prev[selectedProject] || []), ...files]
      };

      // Calculate new total storage across all projects
      let newTotalStorage = 0;
      Object.values(updatedFiles).forEach(projectFileList => {
        projectFileList.forEach(file => {
          newTotalStorage += file.size || 0;
        });
      });

      // Update total used storage with calculated value
      setTotalUsedStorage(newTotalStorage);

      return updatedFiles;
    });

    setShowFileUploadModal(false);

    // Add success notification
    const uploadNotification = {
      id: Date.now().toString(),
      type: 'success' as const,
      title: 'Files Uploaded',
      message: `${files.length} file(s) uploaded successfully`,
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [uploadNotification, ...prev]);
  };

  const getCurrentProjectFiles = () => {
    return selectedProject ? projectFiles[selectedProject] || [] : [];
  };

  // Load project files from Firebase when project is selected
  const loadProjectFiles = async (projectId: string) => {
    if (!authUser) {
      console.log('No authenticated user, skipping file load');
      return;
    }

    console.log('Loading project files for:', projectId, 'user:', authUser.uid);

    try {
      const files = await getUserFiles(projectId);
      console.log('Loaded', files.length, 'files for project', projectId);

      setProjectFiles(prev => ({
        ...prev,
        [projectId]: files
      }));

      // Update total storage
      const totalSize = files.reduce((sum, file) => sum + file.size, 0);
      setTotalUsedStorage(totalSize);

      if (files.length > 0) {
        const successNotification = {
          id: Date.now().toString(),
          type: 'success' as const,
          title: 'Files Loaded',
          message: `Loaded ${files.length} file(s) from project`,
          timestamp: new Date(),
          read: false
        };
        setNotifications(prev => [successNotification, ...prev]);
      }
    } catch (error: any) {
      console.error('Error loading project files:', error);

      let errorMessage = 'Could not load project files. Please try again.';
      if (error.message.includes('Access denied')) {
        errorMessage = 'Access denied. Please check your login status and try again.';
      } else if (error.message.includes('unauthorized')) {
        errorMessage = 'Unauthorized access. Please log out and log back in.';
      }

      const errorNotification = {
        id: Date.now().toString(),
        type: 'warning' as const,
        title: 'Failed to Load Files',
        message: errorMessage,
        timestamp: new Date(),
        read: false
      };
      setNotifications(prev => [errorNotification, ...prev]);
    }
  };

  // Load files when project is selected
  React.useEffect(() => {
    if (selectedProject && authUser) {
      loadProjectFiles(selectedProject);
    }
  }, [selectedProject, authUser]);

  // Debug authentication state
  React.useEffect(() => {
    console.log('Auth state changed:', {
      authUser: authUser ? { uid: authUser.uid, email: authUser.email } : null,
      loading,
      authError,
      storageMode: storageService.getCurrentMode()
    });
  }, [authUser, loading, authError]);

  // Click outside handler for project action menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close all project action menus when clicking outside
      if (Object.values(projectActionMenus).some(isOpen => isOpen)) {
        setProjectActionMenus({});
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [projectActionMenus]);

  const getStorageLimits = () => {
    const userPlanKey = userPlan === 'creator-pro' ? 'creator-pro' :
                       userPlan === 'agency-pro' ? 'agency-pro' : 'free';
    return userPlanKey as 'free' | 'creator-pro' | 'agency-pro';
  };

  // Calculate total storage across all projects
  const calculateTotalStorageUsed = () => {
    let totalSize = 0;
    Object.values(projectFiles).forEach(files => {
      files.forEach(file => {
        totalSize += file.size || 0;
      });
    });
    return totalSize;
  };

  // Get current project storage usage
  const getCurrentProjectStorageUsed = () => {
    const currentFiles = getCurrentProjectFiles();
    return currentFiles.reduce((total, file) => total + (file.size || 0), 0);
  };



  // Safely read text file content
  const readTextFileContent = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Security: Limit file size for text preview (max 1MB)
      if (file.size > 1024 * 1024) {
        reject(new Error('File too large for preview. Maximum size for text preview is 1MB.'));
        return;
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          let content = e.target?.result as string;

          // Security: Sanitize content - remove potentially dangerous patterns
          content = content
            .replace(/<script[^>]*>.*?<\/script>/gis, '[SCRIPT REMOVED FOR SECURITY]')
            .replace(/<iframe[^>]*>.*?<\/iframe>/gis, '[IFRAME REMOVED FOR SECURITY]')
            .replace(/javascript:/gi, 'javascript-removed:')
            .replace(/data:text\/html/gi, 'data-html-removed:')
            .replace(/vbscript:/gi, 'vbscript-removed:');

          // Limit content length for display (max 50KB)
          if (content.length > 50000) {
            content = content.substring(0, 50000) + '\n\n[Content truncated - file too large for full preview]';
          }

          resolve(content);
        } catch (error) {
          reject(new Error('Failed to read file content.'));
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file.'));
      };

      // Use readAsText for better encoding handling
      reader.readAsText(file, 'UTF-8');
    });
  };

  // File action handlers
  const handleViewFile = async (file: UploadedFile) => {
    setFilePreviewModal({ show: true, file });
    setFileContent('');
    setContentError('');

    // If it's a text file, try to load content
    if (isTextFileUtil(file.name, file.type)) {
      setIsLoadingContent(true);
      try {
        const content = await getFileContent(file);
        setFileContent(content);
      } catch (error) {
        setContentError(error instanceof Error ? error.message : 'Failed to load file content');
      } finally {
        setIsLoadingContent(false);
      }
    }
  };


  const handleShareFile = (file: any) => {
    setShareFileModal({ show: true, file });
  };

  const toggleFileActionMenu = (fileId: string) => {
    setFileActionMenus(prev => ({
      ...prev,
      [fileId]: !prev[fileId]
    }));
  };

  const toggleProjectActionMenu = (projectId: string) => {
    setProjectActionMenus(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  const handleEditProject = (project: any) => {
    // Close menu
    setProjectActionMenus(prev => ({ ...prev, [project.id]: false }));

    const newTitle = prompt('Enter new project title:', project.title);
    if (newTitle && newTitle.trim()) {
      setProjects(prev => prev.map(p =>
        p.id === project.id ? { ...p, title: newTitle.trim() } : p
      ));

      const notification = {
        id: Date.now().toString(),
        type: 'success' as const,
        title: 'Project Updated',
        message: `Project "${newTitle}" has been updated`,
        timestamp: new Date(),
        read: false
      };
      setNotifications(prev => [notification, ...prev]);
    }
  };

  const handleDuplicateProject = (project: any) => {
    // Close menu
    setProjectActionMenus(prev => ({ ...prev, [project.id]: false }));

    const duplicatedProject = {
      ...project,
      id: `project-${Date.now()}`,
      title: `${project.title} (Copy)`,
      stage: 'planning',
      progress: 0,
      createdAt: new Date(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    };

    setProjects(prev => [duplicatedProject, ...prev]);

    const notification = {
      id: Date.now().toString(),
      type: 'success' as const,
      title: 'Project Duplicated',
      message: `Project "${duplicatedProject.title}" has been created`,
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [notification, ...prev]);
  };

  const handleDeleteProject = (project: any) => {
    // Close menu
    setProjectActionMenus(prev => ({ ...prev, [project.id]: false }));

    if (confirm(`Are you sure you want to delete "${project.title}"?`)) {
      setProjects(prev => prev.filter(p => p.id !== project.id));

      const notification = {
        id: Date.now().toString(),
        type: 'info' as const,
        title: 'Project Deleted',
        message: `Project "${project.title}" has been deleted`,
        timestamp: new Date(),
        read: false
      };
      setNotifications(prev => [notification, ...prev]);
    }
  };

  const handleShareProject = (project: any) => {
    // Close menu
    setProjectActionMenus(prev => ({ ...prev, [project.id]: false }));

    const shareUrl = `${window.location.origin}/project/${project.id}`;
    navigator.clipboard.writeText(shareUrl);

    const notification = {
      id: Date.now().toString(),
      type: 'success' as const,
      title: 'Project Link Copied',
      message: 'Project sharing link copied to clipboard',
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [notification, ...prev]);
  };

  const handleSendToCanvas = (project: any) => {
    // Close menu
    setProjectActionMenus(prev => ({ ...prev, [project.id]: false }));

    // Navigate to canvas view with project data
    setActiveView('canvas');

    const notification = {
      id: Date.now().toString(),
      type: 'success' as const,
      title: 'Project Sent to Canvas',
      message: `"${project.title}" opened in Canvas`,
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [notification, ...prev]);
  };

  const handleDownloadFile = async (file: UploadedFile) => {
    try {
      await downloadFile(file);

      // Add notification
      const downloadNotification = {
        id: Date.now().toString(),
        type: 'success' as const,
        title: 'File Downloaded',
        message: `${file.name} has been downloaded successfully`,
        timestamp: new Date(),
        read: false
      };
      setNotifications(prev => [downloadNotification, ...prev]);
    } catch (error) {
      const errorNotification = {
        id: Date.now().toString(),
        type: 'warning' as const,
        title: 'Download Failed',
        message: `Failed to download ${file.name}`,
        timestamp: new Date(),
        read: false
      };
      setNotifications(prev => [errorNotification, ...prev]);
    }
  };

  const handleDeleteFile = async (file: UploadedFile) => {
    if (!selectedProject) return;

    try {
      // Delete from Firebase Storage
      await deleteFile(file);

      // Remove file from project files
      setProjectFiles(prev => ({
        ...prev,
        [selectedProject]: (prev[selectedProject] || []).filter(f => f.id !== file.id)
      }));

      // Recalculate total storage
      setTimeout(() => {
        const newTotal = calculateTotalStorageUsed();
        setTotalUsedStorage(newTotal);
      }, 100);

      // Close menu
      setFileActionMenus(prev => ({ ...prev, [file.id]: false }));

      // Add notification
      const deleteNotification = {
        id: Date.now().toString(),
        type: 'info' as const,
        title: 'File Deleted',
        message: `${file.name} has been removed from the project`,
        timestamp: new Date(),
        read: false
      };
      setNotifications(prev => [deleteNotification, ...prev]);
    } catch (error) {
      const errorNotification = {
        id: Date.now().toString(),
        type: 'warning' as const,
        title: 'Delete Failed',
        message: `Failed to delete ${file.name}`,
        timestamp: new Date(),
        read: false
      };
      setNotifications(prev => [errorNotification, ...prev]);
    }
  };

  const handleRenameFile = (file: UploadedFile, newName: string) => {
    if (!selectedProject || !newName.trim()) return;

    // Note: Firebase Storage doesn't support direct file renaming
    // In a production app, you'd need to download, re-upload with new name, and delete old file
    // For now, we'll just update the local display name

    // Update file name in project files (local only)
    setProjectFiles(prev => ({
      ...prev,
      [selectedProject]: (prev[selectedProject] || []).map(f =>
        f.id === file.id ? { ...f, name: newName.trim() } : f
      )
    }));

    // Close menu
    setFileActionMenus(prev => ({ ...prev, [file.id]: false }));

    // Add notification with caveat
    const renameNotification = {
      id: Date.now().toString(),
      type: 'info' as const,
      title: 'Display Name Updated',
      message: `Display name changed to ${newName.trim()} (original file unchanged)`,
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [renameNotification, ...prev]);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };


  return (
    <div
      className="space-y-8"
      style={{
        gap: customSettings.theme.compactMode ? '1rem' : '2rem',
        filter: customSettings.theme.highContrast ? 'contrast(1.2) brightness(1.1)' : 'none'
      }}
    >
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)] p-8 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Welcome back, <span className="text-yellow-300">{userName}</span>! 👋
              </h1>
              <p className="text-lg opacity-90 mb-4">
                Your ultimate workspace • where all your creative tools come together
              </p>
              <div className="flex items-center space-x-6">
                <Badge variant="success" className="bg-white/20 text-white border-white/30">
                  {userPlan === "free" ? "Free Plan" : "Pro Account"}
                </Badge>
                <span className="text-sm opacity-75">
                  {projectStats.activeProjects} active projects
                </span>
                {/* Debug Info */}
                {authUser && (
                  <span className="text-xs opacity-60">
                    User: {authUser.email || authUser.uid.substring(0, 8)}... | Storage: {storageService.getCurrentMode()}
                  </span>
                )}
                {!authUser && loading && (
                  <span className="text-xs opacity-60">
                    Loading auth...
                  </span>
                )}
                {!authUser && !loading && (
                  <span className="text-xs opacity-60 text-yellow-300">
                    Not authenticated | Storage: {storageService.getCurrentMode()}
                  </span>
                )}
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Home className="w-16 h-16" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Projects"
          value={projectStats.totalProjects.toString()}
          change="+12"
          changeType="positive"
          icon={<Rocket />}
          description="all time"
        />
        <StatCard
          title="Total Views"
          value={`${Math.floor(projectStats.totalViews / 1000)}K`}
          change={`+${projectStats.growth}%`}
          changeType="positive"
          icon={<Eye />}
          description="this month"
        />
        <StatCard
          title="Engagement Rate"
          value={`${projectStats.engagement}%`}
          change="+0.8%"
          changeType="positive"
          icon={<Heart />}
          description="avg across platforms"
        />
        <StatCard
          title="Completed Today"
          value={projectStats.completedToday.toString()}
          change="+2"
          changeType="positive"
          icon={<Award />}
          description="keep it up!"
        />
      </div>

      {/* Project Pipeline */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="heading-3">
              <GradientText>Project Pipeline</GradientText>
            </h2>
            <p className="body-base">Manage your content workflow efficiently</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 bg-[var(--surface-secondary)] rounded-lg p-1">
              <Button
                variant={pipelineView === 'kanban' ? 'primary' : 'ghost'}
                size="xs"
                onClick={() => setPipelineView('kanban')}
              >
                <Layers className="w-4 h-4" />
              </Button>
              <Button
                variant={pipelineView === 'list' ? 'primary' : 'ghost'}
                size="xs"
                onClick={() => setPipelineView('list')}
              >
                <FileText className="w-4 h-4" />
              </Button>
              <Button
                variant={pipelineView === 'timeline' ? 'primary' : 'ghost'}
                size="xs"
                onClick={() => setPipelineView('timeline')}
              >
                <GitBranch className="w-4 h-4" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPipelineFilters(!showPipelineFilters)}
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowNewProjectModal(true)}
            >
              <Plus className="w-4 h-4" />
              New Project
            </Button>
          </div>
        </div>

        {/* Placeholder Projects Banner */}
        {showPlaceholderProjects && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-4 mb-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--text-primary)]">
                    👋 Welcome! These are example projects
                  </h4>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Get inspired by these sample workflows. Create your first project to get started!
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowNewProjectModal(true)}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Create First Project
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPlaceholderProjects(false)}
                >
                  <X className="w-4 h-4" />
                  Hide Examples
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Pipeline Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-[var(--surface-secondary)] rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-[var(--brand-primary)] mb-1">
              {pipelineStats.totalProjects}
            </div>
            <div className="text-sm text-[var(--text-secondary)]">Total Projects</div>
          </div>
          <div className="bg-[var(--surface-secondary)] rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-[var(--color-warning)] mb-1">
              {pipelineStats.inProgress}
            </div>
            <div className="text-sm text-[var(--text-secondary)]">In Progress</div>
          </div>
          <div className="bg-[var(--surface-secondary)] rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-[var(--color-success)] mb-1">
              {pipelineStats.completedThisWeek}
            </div>
            <div className="text-sm text-[var(--text-secondary)]">Completed</div>
          </div>
          <div className="bg-[var(--surface-secondary)] rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-red-500 mb-1">
              {pipelineStats.overdue}
            </div>
            <div className="text-sm text-[var(--text-secondary)]">Overdue</div>
          </div>
          <div className="bg-[var(--surface-secondary)] rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-[var(--accent-cyan)] mb-1">
              {pipelineStats.averageCompletionTime}d
            </div>
            <div className="text-sm text-[var(--text-secondary)]">Avg. Time</div>
          </div>
          <div className="bg-[var(--surface-secondary)] rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-[var(--brand-secondary)] mb-1">
              {pipelineStats.productivityScore}%
            </div>
            <div className="text-sm text-[var(--text-secondary)]">Productivity</div>
          </div>
        </div>

        {/* Pipeline Filters */}
        <AnimatePresence>
          {(customSettings.pipeline.showFilters || showPipelineFilters) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-[var(--surface-secondary)] rounded-xl p-4 mb-6"
            >
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">Stage</label>
                  <select
                    value={pipelineFilters.stage || ''}
                    onChange={(e) => setPipelineFilters({...pipelineFilters, stage: e.target.value || undefined})}
                    className="w-full px-3 py-2 bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-lg text-sm"
                  >
                    <option value="">All Stages</option>
                    <option value="planning">Planning</option>
                    <option value="in_progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">Type</label>
                  <select
                    value={pipelineFilters.type || ''}
                    onChange={(e) => setPipelineFilters({...pipelineFilters, type: e.target.value || undefined})}
                    className="w-full px-3 py-2 bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-lg text-sm"
                  >
                    <option value="">All Types</option>
                    <option value="video">Video</option>
                    <option value="thumbnail">Thumbnail</option>
                    <option value="strategy">Strategy</option>
                    <option value="analytics">Analytics</option>
                    <option value="content">Content</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">Priority</label>
                  <select
                    value={pipelineFilters.priority || ''}
                    onChange={(e) => setPipelineFilters({...pipelineFilters, priority: e.target.value || undefined})}
                    className="w-full px-3 py-2 bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-lg text-sm"
                  >
                    <option value="">All Priorities</option>
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">Platform</label>
                  <select
                    value={pipelineFilters.platform || ''}
                    onChange={(e) => setPipelineFilters({...pipelineFilters, platform: e.target.value || undefined})}
                    className="w-full px-3 py-2 bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-lg text-sm"
                  >
                    <option value="">All Platforms</option>
                    <option value="YouTube">YouTube</option>
                    <option value="Instagram">Instagram</option>
                    <option value="TikTok">TikTok</option>
                    <option value="Multi-Platform">Multi-Platform</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPipelineFilters({})}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Kanban View */}
        {pipelineView === 'kanban' && (
          <>
            {filteredProjects.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-[var(--surface-secondary)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Archive className="w-8 h-8 text-[var(--text-tertiary)]" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No Projects Yet</h3>
                <p className="text-[var(--text-secondary)] mb-6">
                  {!showPlaceholderProjects ? 'Examples are hidden. Create your first project to get started!' : 'Create your first project to begin organizing your workflow.'}
                </p>
                <Button
                  variant="primary"
                  onClick={() => setShowNewProjectModal(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Project
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {(['planning', 'in_progress', 'review', 'completed'] as const).map((stage) => {
                  const stageProjects = getStageProjects(stage);
                  const stageColors = {
                    planning: 'var(--text-tertiary)',
                    in_progress: 'var(--color-warning)',
                    review: 'var(--brand-primary)',
                    completed: 'var(--color-success)'
                  };

              return (
                <div key={stage} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: stageColors[stage] }}
                      />
                      <h3 className="font-semibold text-[var(--text-primary)] capitalize">
                        {stage.replace('_', ' ')}
                      </h3>
                      <Badge variant="neutral" className="text-xs">
                        {stageProjects.length}
                      </Badge>
                    </div>

                    {/* Add expand/collapse button when more than 1 item */}
                    {stageProjects.length > 1 && (
                      <motion.button
                        onClick={() => setCollapsedCategories(prev => ({
                          ...prev,
                          [stage]: !prev[stage]
                        }))}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="hover:bg-[var(--surface-tertiary)] p-2 rounded-md flex items-center justify-center transition-colors"
                      >
                        <motion.div
                          animate={{ rotate: collapsedCategories[stage] ? 0 : 90 }}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                        >
                          <ChevronRight className="w-4 h-4 text-[var(--text-secondary)]" />
                        </motion.div>
                      </motion.button>
                    )}
                  </div>

                  <div className="space-y-3 min-h-[200px]">
                    {/* Show first item when collapsed, all items when expanded */}
                    {(collapsedCategories[stage] ? stageProjects.slice(0, 1) : stageProjects).map((project) => (
                      <motion.div
                        key={project.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ y: -2 }}
                        className={`rounded-xl p-4 cursor-pointer hover:bg-[var(--surface-tertiary)] transition-all duration-200 border ${
                          showPlaceholderProjects
                            ? 'bg-[var(--surface-secondary)] border-blue-500/20 relative'
                            : 'bg-[var(--surface-secondary)] border-[var(--border-primary)]'
                        }`}
                        onClick={() => setSelectedProject(project.id)}
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-2">
                              <div style={{ color: getPriorityColor(project.priority) }}>
                                {getTypeIcon(project.type)}
                              </div>
                              <h4 className="font-medium text-[var(--text-primary)] text-sm leading-tight">
                                {project.title}
                              </h4>
                            </div>
                            <div className="flex items-center space-x-1">
                              {showPlaceholderProjects && (
                                <Badge variant="neutral" className="text-xs bg-blue-500/10 text-blue-400">
                                  Example
                                </Badge>
                              )}
                              <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: getPriorityColor(project.priority) }}
                              />
                            </div>
                          </div>

                          <p className="text-xs text-[var(--text-secondary)] line-clamp-2">
                            {project.description}
                          </p>

                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-[var(--text-tertiary)]">
                                Progress
                              </span>
                              <span className="text-xs font-medium text-[var(--text-primary)]">
                                {project.progress}%
                              </span>
                            </div>
                            <ProgressBar
                              value={project.progress}
                              color={stageColors[stage]}
                              size="xs"
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Badge variant="neutral" className="text-xs">
                                {project.platform}
                              </Badge>
                              {project.attachments && project.attachments > 0 && (
                                <div className="flex items-center space-x-1">
                                  <Upload className="w-3 h-3 text-[var(--text-tertiary)]" />
                                  <span className="text-xs text-[var(--text-tertiary)]">
                                    {project.attachments}
                                  </span>
                                </div>
                              )}
                              {project.comments && project.comments > 0 && (
                                <div className="flex items-center space-x-1">
                                  <MessageSquare className="w-3 h-3 text-[var(--text-tertiary)]" />
                                  <span className="text-xs text-[var(--text-tertiary)]">
                                    {project.comments}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {project.dueDate && (
                            <div className="flex items-center justify-between">
                              <div className={`flex items-center space-x-1 text-xs ${
                                isOverdue(project.dueDate) ? 'text-red-500' :
                                isDueSoon(project.dueDate) ? 'text-[var(--color-warning)]' :
                                'text-[var(--text-tertiary)]'
                              }`}>
                                <Clock className="w-3 h-3" />
                                <span>{formatDueDate(project.dueDate)}</span>
                                {isOverdue(project.dueDate) && (
                                  <AlertCircle className="w-3 h-3" />
                                )}
                              </div>
                            </div>
                          )}

                          {project.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {project.tags.slice(0, 2).map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 bg-[var(--brand-primary)]10 text-[var(--brand-primary)] text-xs rounded-md"
                                >
                                  {tag}
                                </span>
                              ))}
                              {project.tags.length > 2 && (
                                <span className="px-2 py-1 bg-[var(--surface-tertiary)] text-[var(--text-tertiary)] text-xs rounded-md">
                                  +{project.tags.length - 2}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                          </motion.div>
                    ))}
                  </div>
                </div>
              );
              })}
              </div>
            )}
          </>
        )}

        {/* List View */}
        {pipelineView === 'list' && (
          <Card>
            {filteredProjects.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-[var(--surface-secondary)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Archive className="w-8 h-8 text-[var(--text-tertiary)]" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No Projects Yet</h3>
                <p className="text-[var(--text-secondary)] mb-6">
                  {!showPlaceholderProjects ? 'Examples are hidden. Create your first project to get started!' : 'Create your first project to begin organizing your workflow.'}
                </p>
                <Button
                  variant="primary"
                  onClick={() => setShowNewProjectModal(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Project
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--border-primary)]">
                      <th className="text-left py-3 px-4 font-medium text-[var(--text-secondary)] text-sm">Project</th>
                      <th className="text-left py-3 px-4 font-medium text-[var(--text-secondary)] text-sm">Type</th>
                      <th className="text-left py-3 px-4 font-medium text-[var(--text-secondary)] text-sm">Stage</th>
                      <th className="text-left py-3 px-4 font-medium text-[var(--text-secondary)] text-sm">Priority</th>
                      <th className="text-left py-3 px-4 font-medium text-[var(--text-secondary)] text-sm">Progress</th>
                      <th className="text-left py-3 px-4 font-medium text-[var(--text-secondary)] text-sm">Due Date</th>
                      <th className="text-left py-3 px-4 font-medium text-[var(--text-secondary)] text-sm">Platform</th>
                      <th className="text-right py-3 px-4 font-medium text-[var(--text-secondary)] text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                  {filteredProjects.map((project, index) => (
                    <motion.tr
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-[var(--border-primary)] hover:bg-[var(--surface-secondary)] transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div style={{ color: getPriorityColor(project.priority) }}>
                            {getTypeIcon(project.type)}
                          </div>
                          <div>
                            <div className="font-medium text-[var(--text-primary)] text-sm">
                              {project.title}
                            </div>
                            <div className="text-xs text-[var(--text-secondary)] line-clamp-1">
                              {project.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="neutral" className="text-xs capitalize">
                          {project.type}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            project.stage === 'completed' ? 'success' :
                            project.stage === 'in_progress' ? 'warning' :
                            project.stage === 'review' ? 'primary' : 'neutral'
                          }
                          className="text-xs capitalize"
                        >
                          {project.stage.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: getPriorityColor(project.priority) }}
                          />
                          <span className="text-sm text-[var(--text-primary)] capitalize">
                            {project.priority}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-16">
                            <ProgressBar
                              value={project.progress}
                              color="var(--brand-primary)"
                              size="xs"
                            />
                          </div>
                          <span className="text-xs text-[var(--text-primary)] w-8">
                            {project.progress}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {project.dueDate && (
                          <div className={`flex items-center space-x-1 text-xs ${
                            isOverdue(project.dueDate) ? 'text-red-500' :
                            isDueSoon(project.dueDate) ? 'text-[var(--color-warning)]' :
                            'text-[var(--text-primary)]'
                          }`}>
                            <Clock className="w-3 h-3" />
                            <span>{formatDueDate(project.dueDate)}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-[var(--text-primary)]">
                          {project.platform}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end space-x-1">
                          <div className="relative">
                            <Button
                              variant="ghost"
                              size="xs"
                              onClick={() => toggleProjectActionMenu(project.id)}
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>

                            {/* Project Action Menu */}
                            <AnimatePresence>
                              {projectActionMenus[project.id] && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                  className="absolute right-0 top-full mt-2 w-48 bg-[var(--surface-secondary)] border border-[var(--border-primary)] rounded-lg shadow-xl z-10 overflow-hidden"
                                >
                                  <div className="py-1">
                                    <button
                                      onClick={() => handleEditProject(project)}
                                      className="w-full text-left px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--surface-tertiary)] flex items-center space-x-2"
                                    >
                                      <Edit3 className="w-4 h-4" />
                                      <span>Edit Project</span>
                                    </button>
                                    <button
                                      onClick={() => handleDuplicateProject(project)}
                                      className="w-full text-left px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--surface-tertiary)] flex items-center space-x-2"
                                    >
                                      <Copy className="w-4 h-4" />
                                      <span>Duplicate</span>
                                    </button>
                                    <button
                                      onClick={() => handleSendToCanvas(project)}
                                      className="w-full text-left px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--surface-tertiary)] flex items-center space-x-2"
                                    >
                                      <Send className="w-4 h-4" />
                                      <span>Send to Canvas</span>
                                    </button>
                                    <button
                                      onClick={() => handleShareProject(project)}
                                      className="w-full text-left px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--surface-tertiary)] flex items-center space-x-2"
                                    >
                                      <Share2 className="w-4 h-4" />
                                      <span>Share Project</span>
                                    </button>
                                    <div className="border-t border-[var(--border-primary)] my-1"></div>
                                    <button
                                      onClick={() => handleDeleteProject(project)}
                                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[var(--surface-tertiary)] flex items-center space-x-2"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                      <span>Delete</span>
                                    </button>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}

        {/* Timeline View */}
        {pipelineView === 'timeline' && (
          <Card>
            {filteredProjects.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-[var(--surface-secondary)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Archive className="w-8 h-8 text-[var(--text-tertiary)]" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No Projects Yet</h3>
                <p className="text-[var(--text-secondary)] mb-6">
                  {!showPlaceholderProjects ? 'Examples are hidden. Create your first project to get started!' : 'Create your first project to begin organizing your workflow.'}
                </p>
                <Button
                  variant="primary"
                  onClick={() => setShowNewProjectModal(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Project
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <h3 className="font-semibold text-[var(--text-primary)]">Project Timeline</h3>
                <div className="space-y-4">
                  {filteredProjects
                    .sort((a, b) => (a.dueDate?.getTime() || 0) - (b.dueDate?.getTime() || 0))
                    .map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-4 p-4 bg-[var(--surface-secondary)] rounded-xl"
                    >
                      <div className="flex-shrink-0">
                        <div
                          className="w-4 h-4 rounded-full border-2 border-white"
                          style={{ backgroundColor: getPriorityColor(project.priority) }}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-[var(--text-primary)]">
                              {project.title}
                            </h4>
                            <p className="text-sm text-[var(--text-secondary)]">
                              {project.description}
                            </p>
                          </div>
                          <div className="text-right">
                            {project.dueDate && (
                              <div className={`text-sm ${
                                isOverdue(project.dueDate) ? 'text-red-500' :
                                isDueSoon(project.dueDate) ? 'text-[var(--color-warning)]' :
                                'text-[var(--text-primary)]'
                              }`}>
                                {formatDueDate(project.dueDate)}
                              </div>
                            )}
                            <div className="text-xs text-[var(--text-tertiary)]">
                              {project.progress}% complete
                            </div>
                          </div>
                        </div>
                        <div className="mt-2">
                          <ProgressBar
                            value={project.progress}
                            color={getPriorityColor(project.priority)}
                            size="sm"
                          />
                        </div>
                      </div>
                    </motion.div>
                    ))
                  }
                </div>
              </div>
            )}
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      {customSettings.quickActions.enabled && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="heading-3">
                <GradientText>Quick Launch</GradientText>
              </h2>
              <p className="body-base">Jump into your most-used tools</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowCustomizeModal(true)}>
              <Settings className="w-4 h-4" />
              Customize
            </Button>
          </div>

          <div className={
            customSettings.quickActions.layout === 'grid'
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }>
            {quickActions.map((action) => (
              customSettings.quickActions.layout === 'grid' ? (
                <QuickActionCard
                  key={action.id}
                  title={action.title}
                  description={customSettings.quickActions.showDescriptions ? action.description : undefined}
                  icon={action.icon}
                  color={action.color}
                  onClick={action.action}
                  badge={action.badge}
                />
              ) : (
                <div
                  key={action.id}
                  className="flex items-center gap-4 p-4 bg-[var(--surface-secondary)] rounded-xl border border-[var(--border-primary)] hover:border-[var(--brand-primary)] transition-colors cursor-pointer"
                  onClick={action.action}
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${action.color}`}>
                    {action.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-[var(--text-primary)]">{action.title}</h3>
                    {customSettings.quickActions.showDescriptions && (
                      <p className="text-sm text-[var(--text-secondary)] mt-1">{action.description}</p>
                    )}
                  </div>
                  {action.badge && (
                    <Badge variant="primary">{action.badge}</Badge>
                  )}
                  <ArrowRight className="w-4 h-4 text-[var(--text-secondary)]" />
                </div>
              )
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Pro Components */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 mb-8">
        {/* Focus Timer Pro */}
        {customSettings.focusTimer.enabled && (
          <FocusTimerPro
            defaultPreset={customSettings.focusTimer.defaultPreset}
            autoStart={customSettings.focusTimer.autoStart}
            onSessionComplete={(session) => {
              // Handle session completion
              console.log('Session completed:', session);
            }}
            onProductivityUpdate={(minutes) => {
              // Update productivity tracking
              console.log('Productivity updated:', minutes);
            }}
          />
        )}

        {/* Daily Goals Pro */}
        <DailyGoalsPro
          onGoalComplete={(goal) => {
            // Handle goal completion
            console.log('Goal completed:', goal);
          }}
          onStreakMilestone={(streak) => {
            // Handle streak milestone
            console.log('Streak milestone:', streak);
          }}
        />

        {/* Quick Notes Pro */}
        <QuickNotesPro
          onNoteCreate={(note) => {
            // Handle note creation
            console.log('Note created:', note);
          }}
          onNoteUpdate={(note) => {
            // Handle note update
            console.log('Note updated:', note);
          }}
          onNoteDelete={(noteId) => {
            // Handle note deletion
            console.log('Note deleted:', noteId);
          }}
        />

        {/* Notifications Pro */}
        {customSettings.notifications.enabled && (
          <NotificationsPro
            notifications={notifications.slice(0, customSettings.notifications.maxCount)}
            autoShow={customSettings.notifications.autoShow}
            onNotificationAction={(notification) => {
              // Handle notification action
              console.log('Notification action:', notification);
            }}
            onMarkAllRead={() => {
              // Handle mark all as read
              setNotifications(notifications.map(n => ({ ...n, read: true })));
              console.log('All notifications marked as read');
            }}
            onSettingsChange={(settings) => {
              // Handle settings change
              console.log('Settings changed:', settings);
            }}
          />
        )}
      </div>

      {/* YouTube Quick Stats - Premium Feature */}
      <YouTubeQuickStats
        userPlan={userPlan}
        isPremium={isPremium}
        onUpgrade={onUpgrade}
      />

      {/* Project Templates Coming Soon */}
      <div className="bg-gradient-to-br from-[var(--surface-secondary)] to-[var(--surface-tertiary)] rounded-2xl p-8 border border-[var(--border-primary)] relative overflow-hidden">
        {/* Coming Soon Badge */}
        <div className="absolute top-4 right-4">
          <Badge variant="warning" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-400/30 flex items-center space-x-1">
            <Rocket className="w-4 h-4" />
            <span>Coming Soon</span>
          </Badge>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="heading-3 mb-2">
              <GradientText>🚀 Project Templates Library</GradientText>
            </h2>
            <p className="body-base">Complete niche blueprints to launch your content empire in minutes</p>
            <p className="text-sm text-[var(--text-tertiary)] mt-2">
              ⏰ Launching soon with 50+ professional templates
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="ghost" onClick={() => setShowTemplatesModal(true)}>
              <Eye className="w-4 h-4" />
              Preview
            </Button>
            <Button variant="primary" onClick={() => setShowTemplatesModal(true)} disabled>
              <Sparkles className="w-4 h-4" />
              Browse All Templates
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative">
          {/* Coming Soon Overlay */}
          <div className="absolute inset-0 bg-[var(--surface-primary)]/70 backdrop-blur-[2px] rounded-xl z-10 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-[var(--text-primary)] mb-2">Templates Coming Soon!</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-4 max-w-xs">
                Professional templates launching with advanced AI customization
              </p>
              <Button variant="primary" size="sm" onClick={() => setShowTemplatesModal(true)}>
                <Eye className="w-4 h-4 mr-2" />
                Preview Available
              </Button>
            </div>
          </div>
          {/* Faceless Channel Template Preview - Featured */}
          <motion.div
            className="bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl p-6 text-white relative overflow-hidden opacity-40 pointer-events-none"
          >
            <div className="absolute top-2 right-2">
              <Badge variant="neutral" className="bg-yellow-400/20 text-yellow-300 border-yellow-400/30 text-xs">
                ���� HOT
              </Badge>
            </div>
            <div className="text-3xl mb-3">🤖</div>
            <h3 className="font-bold mb-2">Faceless Channel Empire</h3>
            <p className="text-sm text-white/80 mb-3">AI-powered automated content creation</p>
            <div className="flex items-center space-x-2 text-xs">
              <Badge variant="neutral" className="bg-white/20 text-white border-white/30">
                Advanced
              </Badge>
              <span>4-6h setup</span>
            </div>
            <div className="absolute -bottom-4 -right-4 text-6xl opacity-20">⚡</div>
          </motion.div>

          {/* Gaming Template Preview */}
          <motion.div
            className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 text-white opacity-40 pointer-events-none"
          >
            <div className="text-3xl mb-3">🎮</div>
            <h3 className="font-bold mb-2">Gaming Channel</h3>
            <p className="text-sm text-white/80 mb-3">Complete setup with streaming workflows</p>
            <div className="flex items-center space-x-2 text-xs">
              <Badge variant="neutral" className="bg-white/20 text-white border-white/30">
                Popular
              </Badge>
              <span>2-3h setup</span>
            </div>
          </motion.div>

          {/* Tech Template Preview */}
          <motion.div
            className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-6 text-white opacity-40 pointer-events-none"
          >
            <div className="text-3xl mb-3">���</div>
            <h3 className="font-bold mb-2">Tech Reviews</h3>
            <p className="text-sm text-white/80 mb-3">Professional product review channel</p>
            <div className="flex items-center space-x-2 text-xs">
              <Badge variant="neutral" className="bg-white/20 text-white border-white/30">
                Popular
              </Badge>
              <span>2-4h setup</span>
            </div>
          </motion.div>

          {/* More Templates Card */}
          <motion.div
            className="bg-[var(--surface-primary)] border-2 border-dashed border-[var(--border-secondary)] rounded-xl p-6 flex flex-col items-center justify-center text-center opacity-40 pointer-events-none"
          >
            <Plus className="w-8 h-8 text-[var(--text-tertiary)] mb-2" />
            <h3 className="font-semibold text-[var(--text-primary)] mb-1">6+ More Templates</h3>
            <p className="text-sm text-[var(--text-secondary)]">Lifestyle, Business, Fitness & more</p>
          </motion.div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            Each template includes: Content strategy ���� Brand assets • Analytics setup �� Pre-built projects • Automation workflows
          </p>
          <div className="flex justify-center space-x-4 text-xs text-[var(--text-tertiary)]">
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-4 h-4 text-[var(--color-success)]" />
              <span>Complete blueprints</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-4 h-4 text-[var(--color-success)]" />
              <span>Proven strategies</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-4 h-4 text-[var(--color-success)]" />
              <span>Ready-to-use projects</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="heading-4">Recent Activity</h3>
                <p className="body-base">Your latest projects and achievements</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => onNavigateToTab?.("history")}>
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center space-x-4 p-4 rounded-xl bg-[var(--surface-tertiary)] hover:bg-[var(--surface-quaternary)] transition-all duration-200 cursor-pointer"
                >
                  <div 
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${getStatusColor(activity.status)}20`, color: getStatusColor(activity.status) }}
                  >
                    {getTypeIcon(activity.type)}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-semibold text-[var(--text-primary)] mb-1">
                      {activity.title}
                    </h4>
                    <div className="flex items-center space-x-3 text-sm">
                      <span className="text-[var(--text-secondary)]">
                        {activity.platform}
                      </span>
                      <span className="text-[var(--text-tertiary)]">
                        {formatTimeAgo(activity.timestamp)}
                      </span>
                      {activity.performance && (
                        <span className="text-[var(--color-success)]">
                          {activity.performance}% performance
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Badge
                      variant={
                        activity.status === "completed" ? "success" :
                        activity.status === "in_progress" ? "warning" : "neutral"
                      }
                    >
                      {activity.status.replace("_", " ")}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        {/* Creative Block Breaker Panel */}
        {customSettings.insights.enabled && (
          <div>
            <CreativeBlockBreaker
              onNavigateToTab={onNavigateToTab}
              onSendToGenerator={(idea) => {
                // Store the idea and navigate to generator
                localStorage.setItem('generatorPrefill', idea);
                onNavigateToTab?.('generator');
              }}
            />
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <Card variant="glow" className="text-center">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)] rounded-2xl flex items-center justify-center text-white mx-auto">
            <Star className="w-8 h-8" />
          </div>
          <div>
            <h3 className="heading-4 mb-2">
              <GradientText>Ready to Create Something Amazing?</GradientText>
            </h3>
            <p className="body-base max-w-md mx-auto">
              Use AI-powered tools to generate content that engages your audience and grows your brand.
            </p>
          </div>
          <div className="flex justify-center space-x-3">
            <Button variant="primary" onClick={() => setShowTemplatesModal(true)}>
              <Rocket className="w-4 h-4" />
              Browse Templates
            </Button>
            <Button variant="secondary" onClick={() => onNavigateToTab?.("generator")}>
              <Plus className="w-4 h-4" />
              Start Creating
            </Button>
            <Button variant="ghost" onClick={() => onNavigateToTab?.("trends")}>
              <Search className="w-4 h-4" />
              Explore Trends
            </Button>
          </div>
        </div>
      </Card>

      {/* Customize Modal */}
      <AnimatePresence>
        {showCustomizeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCustomizeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[var(--surface-primary)] rounded-2xl border border-[var(--border-primary)] p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                    <Settings className="w-6 h-6 text-[var(--brand-primary)]" />
                    Customize Studio Hub
                  </h2>
                  <p className="text-[var(--text-secondary)] mt-1">
                    Personalize your workspace to match your workflow
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCustomizeModal(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Actions Settings */}
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-5 h-5 text-[var(--brand-primary)]" />
                    <h3 className="font-semibold text-[var(--text-primary)]">Quick Actions</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--text-secondary)]">Enable quick actions</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={customSettings.quickActions.enabled}
                          onChange={(e) => setCustomSettings(prev => ({
                            ...prev,
                            quickActions: { ...prev.quickActions, enabled: e.target.checked }
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[var(--surface-secondary)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--brand-primary)]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--text-secondary)]">Layout style</span>
                      <div className="flex gap-2">
                        <Button
                          variant={customSettings.quickActions.layout === 'grid' ? 'primary' : 'ghost'}
                          size="sm"
                          onClick={() => setCustomSettings(prev => ({
                            ...prev,
                            quickActions: { ...prev.quickActions, layout: 'grid' }
                          }))}
                        >
                          <Grid3X3 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant={customSettings.quickActions.layout === 'list' ? 'primary' : 'ghost'}
                          size="sm"
                          onClick={() => setCustomSettings(prev => ({
                            ...prev,
                            quickActions: { ...prev.quickActions, layout: 'list' }
                          }))}
                        >
                          <List className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--text-secondary)]">Show descriptions</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={customSettings.quickActions.showDescriptions}
                          onChange={(e) => setCustomSettings(prev => ({
                            ...prev,
                            quickActions: { ...prev.quickActions, showDescriptions: e.target.checked }
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[var(--surface-secondary)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--brand-primary)]"></div>
                      </label>
                    </div>
                  </div>
                </Card>

                {/* Insights Settings */}
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="w-5 h-5 text-[var(--brand-primary)]" />
                    <h3 className="font-semibold text-[var(--text-primary)]">Insights Dashboard</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--text-secondary)]">Enable insights</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={customSettings.insights.enabled}
                          onChange={(e) => setCustomSettings(prev => ({
                            ...prev,
                            insights: { ...prev.insights, enabled: e.target.checked }
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[var(--surface-secondary)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--brand-primary)]"></div>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm text-[var(--text-secondary)] mb-2">Default view</label>
                      <select
                        value={customSettings.insights.defaultView}
                        onChange={(e) => setCustomSettings(prev => ({
                          ...prev,
                          insights: { ...prev.insights, defaultView: e.target.value as any }
                        }))}
                        className="w-full px-3 py-2 bg-[var(--surface-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] text-sm"
                      >
                        <option value="overview">Overview</option>
                        <option value="performance">Performance</option>
                        <option value="trends">Trends</option>
                        <option value="goals">Goals</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--text-secondary)]">Auto refresh data</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={customSettings.insights.autoRefresh}
                          onChange={(e) => setCustomSettings(prev => ({
                            ...prev,
                            insights: { ...prev.insights, autoRefresh: e.target.checked }
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[var(--surface-secondary)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--brand-primary)]"></div>
                      </label>
                    </div>
                  </div>
                </Card>

                {/* Pipeline Settings */}
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Workflow className="w-5 h-5 text-[var(--brand-primary)]" />
                    <h3 className="font-semibold text-[var(--text-primary)]">Project Pipeline</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--text-secondary)]">Enable pipeline</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={customSettings.pipeline.enabled}
                          onChange={(e) => setCustomSettings(prev => ({
                            ...prev,
                            pipeline: { ...prev.pipeline, enabled: e.target.checked }
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[var(--surface-secondary)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--brand-primary)]"></div>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm text-[var(--text-secondary)] mb-2">Default view</label>
                      <select
                        value={customSettings.pipeline.defaultView}
                        onChange={(e) => setCustomSettings(prev => ({
                          ...prev,
                          pipeline: { ...prev.pipeline, defaultView: e.target.value as any }
                        }))}
                        className="w-full px-3 py-2 bg-[var(--surface-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] text-sm"
                      >
                        <option value="kanban">Kanban Board</option>
                        <option value="list">List View</option>
                        <option value="timeline">Timeline View</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--text-secondary)]">Show filters by default</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={customSettings.pipeline.showFilters}
                          onChange={(e) => setCustomSettings(prev => ({
                            ...prev,
                            pipeline: { ...prev.pipeline, showFilters: e.target.checked }
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[var(--surface-secondary)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--brand-primary)]"></div>
                      </label>
                    </div>
                  </div>
                </Card>

                {/* Focus Timer Settings */}
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Timer className="w-5 h-5 text-[var(--brand-primary)]" />
                    <h3 className="font-semibold text-[var(--text-primary)]">Focus Timer</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--text-secondary)]">Enable focus timer</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={customSettings.focusTimer.enabled}
                          onChange={(e) => setCustomSettings(prev => ({
                            ...prev,
                            focusTimer: { ...prev.focusTimer, enabled: e.target.checked }
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[var(--surface-secondary)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--brand-primary)]"></div>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm text-[var(--text-secondary)] mb-2">Default preset</label>
                      <select
                        value={customSettings.focusTimer.defaultPreset}
                        onChange={(e) => setCustomSettings(prev => ({
                          ...prev,
                          focusTimer: { ...prev.focusTimer, defaultPreset: e.target.value as any }
                        }))}
                        className="w-full px-3 py-2 bg-[var(--surface-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] text-sm"
                      >
                        <option value="pomodoro">Pomodoro (25 min)</option>
                        <option value="deep">Deep Work (90 min)</option>
                        <option value="quick">Quick Sprint (15 min)</option>
                        <option value="flow">Flow State (45 min)</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--text-secondary)]">Auto-start sessions</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={customSettings.focusTimer.autoStart}
                          onChange={(e) => setCustomSettings(prev => ({
                            ...prev,
                            focusTimer: { ...prev.focusTimer, autoStart: e.target.checked }
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[var(--surface-secondary)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--brand-primary)]"></div>
                      </label>
                    </div>
                  </div>
                </Card>

                {/* Theme Settings */}
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Palette className="w-5 h-5 text-[var(--brand-primary)]" />
                    <h3 className="font-semibold text-[var(--text-primary)]">Appearance</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--text-secondary)]">Compact mode</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={customSettings.theme.compactMode}
                          onChange={(e) => setCustomSettings(prev => ({
                            ...prev,
                            theme: { ...prev.theme, compactMode: e.target.checked }
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[var(--surface-secondary)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--brand-primary)]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--text-secondary)]">Enable animations</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={customSettings.theme.animations}
                          onChange={(e) => setCustomSettings(prev => ({
                            ...prev,
                            theme: { ...prev.theme, animations: e.target.checked }
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[var(--surface-secondary)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--brand-primary)]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--text-secondary)]">High contrast mode</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={customSettings.theme.highContrast}
                          onChange={(e) => setCustomSettings(prev => ({
                            ...prev,
                            theme: { ...prev.theme, highContrast: e.target.checked }
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[var(--surface-secondary)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--brand-primary)]"></div>
                      </label>
                    </div>
                  </div>
                </Card>

                {/* Notifications Settings */}
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Bell className="w-5 h-5 text-[var(--brand-primary)]" />
                    <h3 className="font-semibold text-[var(--text-primary)]">Notifications</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--text-secondary)]">Enable notifications</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={customSettings.notifications.enabled}
                          onChange={(e) => setCustomSettings(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, enabled: e.target.checked }
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[var(--surface-secondary)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--brand-primary)]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--text-secondary)]">Auto-show panel</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={customSettings.notifications.autoShow}
                          onChange={(e) => setCustomSettings(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, autoShow: e.target.checked }
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[var(--surface-secondary)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--brand-primary)]"></div>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm text-[var(--text-secondary)] mb-2">Max notifications</label>
                      <input
                        type="range"
                        min="3"
                        max="10"
                        value={customSettings.notifications.maxCount}
                        onChange={(e) => setCustomSettings(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, maxCount: parseInt(e.target.value) }
                        }))}
                        className="w-full"
                      />
                      <div className="text-xs text-[var(--text-secondary)] text-center mt-1">
                        {customSettings.notifications.maxCount} notifications
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-6 mt-6 border-t border-[var(--border-primary)]">
                <Button
                  variant="ghost"
                  onClick={() => {
                    // Reset to defaults
                    setCustomSettings({
                      quickActions: { enabled: true, layout: 'grid', showDescriptions: true },
                      insights: { enabled: true, defaultView: 'overview', autoRefresh: true },
                      pipeline: { enabled: true, defaultView: 'kanban', showFilters: false },
                      notifications: { enabled: true, autoShow: false, maxCount: 5 },
                      focusTimer: { enabled: true, defaultPreset: 'pomodoro', autoStart: false },
                      theme: { compactMode: false, animations: true, highContrast: false }
                    });
                  }}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset to Defaults
                </Button>

                <div className="flex gap-3">
                  <Button
                    variant="ghost"
                    onClick={() => setShowCustomizeModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      // Save settings to localStorage
                      localStorage.setItem('studioHub:customSettings', JSON.stringify(customSettings));
                      setShowCustomizeModal(false);

                      // Show success notification
                      setNotifications(prev => [{
                        id: Date.now().toString(),
                        type: 'success',
                        title: 'Settings Saved',
                        message: 'Your customizations have been applied successfully!',
                        timestamp: new Date(),
                      }, ...prev.slice(0, 4)]);
                    }}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[var(--surface-primary)] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const project = pipelineProjects.find(p => p.id === selectedProject);
                if (!project) return null;

                return (
                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6 border-b border-[var(--border-primary)]">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div style={{ color: getPriorityColor(project.priority) }}>
                            {getTypeIcon(project.type)}
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-[var(--text-primary)]">{project.title}</h2>
                            <p className="text-[var(--text-secondary)] mt-1">{project.description}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedProject(null)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 overflow-y-auto">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Project Info */}
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-semibold text-[var(--text-primary)] mb-3">Project Details</h3>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-[var(--text-secondary)]">Status:</span>
                                <Badge variant="neutral" className="capitalize">
                                  {project.stage.replace('_', ' ')}
                                </Badge>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-[var(--text-secondary)]">Priority:</span>
                                <Badge
                                  variant={project.priority === 'high' ? 'danger' : project.priority === 'medium' ? 'warning' : 'neutral'}
                                  className="capitalize"
                                >
                                  {project.priority}
                                </Badge>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-[var(--text-secondary)]">Platform:</span>
                                <span className="text-[var(--text-primary)]">{project.platform}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-[var(--text-secondary)]">Due Date:</span>
                                <span className="text-[var(--text-primary)]">
                                  {project.dueDate ? project.dueDate.toLocaleDateString() : 'Not set'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Progress */}
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-[var(--text-secondary)]">Progress</span>
                              <span className="text-[var(--text-primary)] font-medium">{project.progress}%</span>
                            </div>
                            <ProgressBar
                              value={project.progress}
                              color="var(--brand-primary)"
                              size="md"
                            />
                          </div>
                        </div>

                        {/* Activity & Stats */}
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-semibold text-[var(--text-primary)] mb-3">Activity</h3>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-[var(--text-secondary)]">Created:</span>
                                <span className="text-[var(--text-primary)]">
                                  {project.created ? project.created.toLocaleDateString() : 'Unknown'}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-[var(--text-secondary)]">Last Updated:</span>
                                <span className="text-[var(--text-primary)]">
                                  {project.lastUpdated ? project.lastUpdated.toLocaleDateString() : 'Unknown'}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-[var(--text-secondary)]">Time Spent:</span>
                                <span className="text-[var(--text-primary)]">
                                  {project.actualHours}h / {project.estimatedHours}h
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-[var(--text-secondary)]">Attachments:</span>
                                <span className="text-[var(--text-primary)]">{project.attachments}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-[var(--text-secondary)]">Comments:</span>
                                <span className="text-[var(--text-primary)]">{project.comments}</span>
                              </div>
                            </div>
                          </div>

                          {/* Tags */}
                          {project.tags && project.tags.length > 0 && (
                            <div>
                              <h3 className="font-semibold text-[var(--text-primary)] mb-3">Tags</h3>
                              <div className="flex flex-wrap gap-2">
                                {project.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="px-2 py-1 bg-[var(--brand-primary)]10 text-[var(--brand-primary)] text-xs rounded-md"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-6 border-t border-[var(--border-primary)]">
                      <div className="flex justify-between">
                        <div className="flex space-x-2">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => {
                              setShowEditProjectModal(true);
                            }}
                          >
                            <Edit3 className="w-4 h-4 mr-2" />
                            Edit Project
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              setShowProjectFilesModal(true);
                            }}
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            View Files
                          </Button>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleArchiveProject(project.id)}
                          >
                            <Archive className="w-4 h-4 mr-2" />
                            Archive
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              // TODO: Check for unsaved changes before closing
                              setSelectedProject(null);
                            }}
                          >
                            <X className="w-4 h-4 mr-2" />
                            Close
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project Templates Modal */}
      <ProjectTemplatesModal
        isOpen={showTemplatesModal}
        onClose={() => setShowTemplatesModal(false)}
        onSelectTemplate={handleTemplateSelect}
        onCreateFromScratch={handleCreateFromScratch}
      />

      {/* New Project Modal */}
      <NewProjectModal
        isOpen={showNewProjectModal}
        onClose={() => setShowNewProjectModal(false)}
        onSubmit={createNewProject}
        userPlan={userPlan}
      />

      {/* Edit Project Modal */}
      <AnimatePresence>
        {showEditProjectModal && selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowEditProjectModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[var(--surface-primary)] rounded-2xl border border-[var(--border-primary)] p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {(() => {
                const project = pipelineProjects.find(p => p.id === selectedProject);
                if (!project) return null;

                return (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-[var(--text-primary)]">
                        Edit Project
                      </h2>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowEditProjectModal(false)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const updatedData = {
                        title: formData.get('title') as string,
                        description: formData.get('description') as string,
                        priority: formData.get('priority') as 'low' | 'medium' | 'high' | 'urgent',
                        stage: formData.get('stage') as 'planning' | 'in_progress' | 'review' | 'completed',
                        platform: formData.get('platform') as string,
                        progress: parseInt(formData.get('progress') as string),
                      };
                      editProject(project.id, updatedData);
                      setShowEditProjectModal(false);
                    }} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                          Project Title
                        </label>
                        <input
                          name="title"
                          type="text"
                          defaultValue={project.title}
                          className="w-full px-3 py-2 bg-[var(--surface-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)]"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                          Description
                        </label>
                        <textarea
                          name="description"
                          defaultValue={project.description}
                          rows={3}
                          className="w-full px-3 py-2 bg-[var(--surface-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                            Priority
                          </label>
                          <select
                            name="priority"
                            defaultValue={project.priority}
                            className="w-full px-3 py-2 bg-[var(--surface-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)]"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                            Stage
                          </label>
                          <select
                            name="stage"
                            defaultValue={project.stage}
                            className="w-full px-3 py-2 bg-[var(--surface-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)]"
                          >
                            <option value="planning">Planning</option>
                            <option value="in_progress">In Progress</option>
                            <option value="review">Review</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                          Platform
                        </label>
                        <input
                          name="platform"
                          type="text"
                          defaultValue={project.platform}
                          className="w-full px-3 py-2 bg-[var(--surface-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                          Progress ({project.progress}%)
                        </label>
                        <input
                          name="progress"
                          type="range"
                          min="0"
                          max="100"
                          defaultValue={project.progress}
                          className="w-full"
                        />
                      </div>

                      <div className="flex justify-end space-x-3 pt-4">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setShowEditProjectModal(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" variant="primary">
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  </div>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project Files Modal */}
      <AnimatePresence>
        {showProjectFilesModal && selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowProjectFilesModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[var(--surface-primary)] rounded-2xl border border-[var(--border-primary)] p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              {(() => {
                const project = pipelineProjects.find(p => p.id === selectedProject);
                if (!project) return null;

                const currentProjectFiles = getCurrentProjectFiles();
                const currentProjectStorage = getCurrentProjectStorageUsed();
                const totalGlobalStorage = calculateTotalStorageUsed();

                // Show actual project files (project-specific)
                const mockFiles = currentProjectFiles.length > 0 ? currentProjectFiles : [];

                // Format file size helper
                const formatFileSize = (bytes: number): string => {
                  if (bytes === 0) return '0 B';
                  const k = 1024;
                  const sizes = ['B', 'KB', 'MB', 'GB'];
                  const i = Math.floor(Math.log(bytes) / Math.log(k));
                  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
                };

                return (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-xl font-bold text-[var(--text-primary)]">
                          Project Files
                        </h2>
                        <p className="text-[var(--text-secondary)] mt-1">
                          {project.title} - {mockFiles.length} files ({formatFileSize(currentProjectStorage)})
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-2">
                            <HardDrive className="w-4 h-4 text-slate-400" />
                            <span className="text-xs text-slate-500">
                              Global: {formatFileSize(totalGlobalStorage)} / {userPlan === 'free' ? '10 MB' : userPlan === 'creator-pro' ? '10 GB' : '100 GB'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-blue-500/30 rounded-full"></div>
                            <span className="text-xs text-slate-500">
                              This project: {formatFileSize(currentProjectStorage)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowProjectFilesModal(false)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="mb-4 flex space-x-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setShowFileUploadModal(true)}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Files
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowAddTextContentModal(true)}
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Add Text
                  </Button>
                </div>

                    <div className="space-y-2">
                      {mockFiles.length === 0 ? (
                        <div className="text-center py-12 bg-[var(--surface-secondary)] rounded-lg border border-dashed border-[var(--border-primary)]">
                          <FileText className="w-12 h-12 text-[var(--text-tertiary)] mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">No files yet</h3>
                          <p className="text-[var(--text-secondary)] mb-4">
                            Upload files to this project to get started
                          </p>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => setShowFileUploadModal(true)}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload First File
                          </Button>
                        </div>
                      ) : (
                        mockFiles.map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center justify-between p-4 bg-[var(--surface-secondary)] rounded-lg border border-[var(--border-primary)] hover:bg-[var(--surface-tertiary)] transition-colors"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-[var(--brand-primary)]20 rounded-lg flex items-center justify-center">
                                <FileText className="w-5 h-5 text-[var(--brand-primary)]" />
                              </div>
                              <div>
                                <div className="font-medium text-[var(--text-primary)]">
                                  {file.name}
                                </div>
                                <div className="text-sm text-[var(--text-secondary)]">
                                  {typeof file.size === 'number' ? formatFileSize(file.size) : file.size} • Modified {file.lastModified}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="xs"
                                onClick={() => handleViewFile(file)}
                                className="hover:bg-blue-500/10 hover:text-blue-400"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="xs"
                                onClick={() => handleShareFile(file)}
                                className="hover:bg-green-500/10 hover:text-green-400"
                              >
                                <Share2 className="w-4 h-4" />
                              </Button>
                              <div className="relative">
                                <Button
                                  variant="ghost"
                                  size="xs"
                                  onClick={() => toggleFileActionMenu(file.id)}
                                  className="hover:bg-purple-500/10 hover:text-purple-400"
                                >
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>

                                {/* File Action Menu */}
                                <AnimatePresence>
                                  {fileActionMenus[file.id] && (
                                    <motion.div
                                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                      animate={{ opacity: 1, scale: 1, y: 0 }}
                                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                      className="absolute right-0 top-full mt-2 w-48 bg-[var(--surface-secondary)] border border-[var(--border-primary)] rounded-lg shadow-xl z-10 overflow-hidden"
                                    >
                                      <div className="py-1">
                                        <button
                                          onClick={() => {
                                            handleDownloadFile(file);
                                            setFileActionMenus(prev => ({ ...prev, [file.id]: false }));
                                          }}
                                          className="w-full text-left px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--surface-tertiary)] flex items-center space-x-2"
                                        >
                                          <Upload className="w-4 h-4" />
                                          <span>Download</span>
                                        </button>
                                        <button
                                          onClick={() => {
                                            const newName = prompt('Enter new filename:', file.name);
                                            if (newName) handleRenameFile(file, newName);
                                          }}
                                          className="w-full text-left px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--surface-tertiary)] flex items-center space-x-2"
                                        >
                                          <Edit3 className="w-4 h-4" />
                                          <span>Rename</span>
                                        </button>
                                        <button
                                          onClick={() => {
                                            navigator.clipboard.writeText(file.downloadUrl || '#');
                                            const copyNotification = {
                                              id: Date.now().toString(),
                                              type: 'success' as const,
                                              title: 'Link Copied',
                                              message: 'File link copied to clipboard',
                                              timestamp: new Date(),
                                              read: false
                                            };
                                            setNotifications(prev => [copyNotification, ...prev]);
                                            setFileActionMenus(prev => ({ ...prev, [file.id]: false }));
                                          }}
                                          className="w-full text-left px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--surface-tertiary)] flex items-center space-x-2"
                                        >
                                          <Share2 className="w-4 h-4" />
                                          <span>Copy Link</span>
                                        </button>
                                        <div className="border-t border-[var(--border-primary)] my-1"></div>
                                        <button
                                          onClick={() => {
                                            if (confirm(`Are you sure you want to delete ${file.name}?`)) {
                                              handleDeleteFile(file);
                                            }
                                          }}
                                          className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 flex items-center space-x-2"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                          <span>Delete</span>
                                        </button>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button
                        variant="ghost"
                        onClick={() => setShowProjectFilesModal(false)}
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Archive Confirmation Modal */}
      <AnimatePresence>
        {showArchiveConfirmModal && projectToArchive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowArchiveConfirmModal(false);
              setProjectToArchive(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[var(--surface-primary)] rounded-2xl border border-[var(--border-primary)] p-6 max-w-md w-full"
            >
              {(() => {
                const project = pipelineProjects.find(p => p.id === projectToArchive);
                if (!project) return null;

                return (
                  <div>
                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-orange-100 rounded-full">
                      <AlertCircle className="w-6 h-6 text-orange-600" />
                    </div>

                    <h2 className="text-lg font-bold text-[var(--text-primary)] text-center mb-2">
                      Archive Project?
                    </h2>

                    <p className="text-[var(--text-secondary)] text-center mb-6">
                      Are you sure you want to archive "{project.title}"? This will remove it from your active projects.
                    </p>

                    <div className="flex justify-center space-x-3">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setShowArchiveConfirmModal(false);
                          setProjectToArchive(null);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => archiveProject(projectToArchive)}
                      >
                        <Archive className="w-4 h-4 mr-2" />
                        Archive Project
                      </Button>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* File Upload Modal */}
      <ProjectFileUpload
        isOpen={showFileUploadModal}
        onClose={() => setShowFileUploadModal(false)}
        projectId={selectedProject || ''}
        userPlan={getStorageLimits()}
        existingFiles={getCurrentProjectFiles()}
        totalUsedStorage={calculateTotalStorageUsed()}
        onFilesUploaded={handleFilesUploaded}
        onUpgrade={onUpgrade}
      />

      {/* Add Text Content Modal */}
      <AddTextContentModal
        isOpen={showAddTextContentModal}
        onClose={() => setShowAddTextContentModal(false)}
        projectId={selectedProject || ''}
        onTextUploaded={(file) => {
          // Add the new text file to the project
          const projectId = selectedProject;
          if (projectId) {
            setProjectFiles(prev => ({
              ...prev,
              [projectId]: [...(prev[projectId] || []), file]
            }));
          }
        }}
      />

      {/* File Preview Modal */}
      <AnimatePresence>
        {filePreviewModal.show && filePreviewModal.file && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setFilePreviewModal({ show: false, file: null })}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[var(--surface-primary)] rounded-2xl border border-[var(--border-primary)] overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-[var(--border-primary)] bg-[var(--surface-secondary)]">
                <div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">File Preview</h2>
                  <p className="text-[var(--text-secondary)] text-sm mt-1">
                    {filePreviewModal.file.name}
                  </p>
                </div>
                <button
                  onClick={() => setFilePreviewModal({ show: false, file: null })}
                  className="p-2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors rounded-lg hover:bg-[var(--surface-tertiary)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                {/* File Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-[var(--brand-primary)]/20 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-[var(--brand-primary)]" />
                      </div>
                      <div>
                        <h3 className="font-medium text-[var(--text-primary)]">{filePreviewModal.file.name}</h3>
                        <p className="text-sm text-[var(--text-secondary)]">
                          {typeof filePreviewModal.file.size === 'number'
                            ? formatFileSize(filePreviewModal.file.size)
                            : filePreviewModal.file.size}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-[var(--text-secondary)]">Type:</span>
                        <p className="text-[var(--text-primary)] font-medium mt-1">
                          {filePreviewModal.file.type || 'Unknown'}
                        </p>
                      </div>
                      <div>
                        <span className="text-[var(--text-secondary)]">Modified:</span>
                        <p className="text-[var(--text-primary)] font-medium mt-1">
                          {filePreviewModal.file.lastModified}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      variant="primary"
                      onClick={() => handleDownloadFile(filePreviewModal.file)}
                      className="w-full"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Download File
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => handleShareFile(filePreviewModal.file)}
                      className="w-full"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share File
                    </Button>
                  </div>
                </div>

                {/* Preview Area */}
                <div className="bg-[var(--surface-secondary)] rounded-lg border border-[var(--border-primary)] overflow-hidden">
                  {isTextFileUtil(filePreviewModal.file.name, filePreviewModal.file.type) ? (
                    <div>
                      <div className="flex items-center justify-between p-4 border-b border-[var(--border-primary)] bg-[var(--surface-tertiary)]">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-5 h-5 text-[var(--brand-primary)]" />
                          <span className="font-medium text-[var(--text-primary)]">Text Preview</span>
                        </div>
                      </div>
                      <div className="p-4">
                        {isLoadingContent ? (
                          <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--brand-primary)]"></div>
                            <span className="ml-3 text-[var(--text-secondary)]">Loading content...</span>
                          </div>
                        ) : contentError ? (
                          <div className="text-center py-8">
                            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-red-400 mb-2">Error Loading Content</h3>
                            <p className="text-[var(--text-secondary)] text-sm">{contentError}</p>
                          </div>
                        ) : (
                          <div className="max-h-96 overflow-y-auto">
                            <pre className="whitespace-pre-wrap text-sm text-[var(--text-primary)] bg-[var(--surface-primary)] p-4 rounded-lg border border-[var(--border-primary)] font-mono">
                              {fileContent || 'No content to display'}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <div className="w-24 h-24 bg-[var(--surface-tertiary)] rounded-lg flex items-center justify-center mx-auto mb-4">
                        {filePreviewModal.file.type?.startsWith('image/') ? (
                          <ImageIcon className="w-12 h-12 text-[var(--text-tertiary)]" />
                        ) : filePreviewModal.file.type?.startsWith('video/') ? (
                          <Video className="w-12 h-12 text-[var(--text-tertiary)]" />
                        ) : filePreviewModal.file.type?.startsWith('audio/') ? (
                          <Music className="w-12 h-12 text-[var(--text-tertiary)]" />
                        ) : filePreviewModal.file.name?.toLowerCase().includes('zip') || filePreviewModal.file.name?.toLowerCase().includes('rar') ? (
                          <Archive className="w-12 h-12 text-[var(--text-tertiary)]" />
                        ) : (
                          <FileText className="w-12 h-12 text-[var(--text-tertiary)]" />
                        )}
                      </div>
                      <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
                        {filePreviewModal.file.type?.startsWith('image/') ? 'Image File' :
                         filePreviewModal.file.type?.startsWith('video/') ? 'Video File' :
                         filePreviewModal.file.type?.startsWith('audio/') ? 'Audio File' :
                         'File Preview'}
                      </h3>
                      <p className="text-[var(--text-secondary)] text-sm">
                        {filePreviewModal.file.type?.startsWith('image/') ? 'Image preview will be available soon.' :
                         filePreviewModal.file.type?.startsWith('video/') ? 'Video preview will be available soon.' :
                         filePreviewModal.file.type?.startsWith('audio/') ? 'Audio preview will be available soon.' :
                         'Preview not available for this file type. Download to view contents.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* File Share Modal */}
      <AnimatePresence>
        {shareFileModal.show && shareFileModal.file && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShareFileModal({ show: false, file: null })}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[var(--surface-primary)] rounded-2xl border border-[var(--border-primary)] overflow-hidden max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-[var(--border-primary)] bg-[var(--surface-secondary)]">
                <div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">Share File</h2>
                  <p className="text-[var(--text-secondary)] text-sm mt-1">
                    {shareFileModal.file.name}
                  </p>
                </div>
                <button
                  onClick={() => setShareFileModal({ show: false, file: null })}
                  className="p-2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors rounded-lg hover:bg-[var(--surface-tertiary)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* File Info */}
                <div className="flex items-center space-x-3 p-3 bg-[var(--surface-secondary)] rounded-lg">
                  <div className="w-10 h-10 bg-[var(--brand-primary)]/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-[var(--brand-primary)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[var(--text-primary)] truncate">{shareFileModal.file.name}</p>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {typeof shareFileModal.file.size === 'number'
                        ? formatFileSize(shareFileModal.file.size)
                        : shareFileModal.file.size}
                    </p>
                  </div>
                </div>

                {/* Share Options */}
                <div className="space-y-3">
                  <Button
                    variant="primary"
                    onClick={() => {
                      navigator.clipboard.writeText(shareFileModal.file.url || window.location.href + '?file=' + shareFileModal.file.id);
                      const copyNotification = {
                        id: Date.now().toString(),
                        type: 'success' as const,
                        title: 'Link Copied',
                        message: 'File sharing link copied to clipboard',
                        timestamp: new Date(),
                        read: false
                      };
                      setNotifications(prev => [copyNotification, ...prev]);
                      setShareFileModal({ show: false, file: null });
                    }}
                    className="w-full"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Copy Sharing Link
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => {
                      const emailBody = `Check out this file: ${shareFileModal.file.name}\\n\\nDownload link: ${shareFileModal.file.url || '#'}`;
                      window.open(`mailto:?subject=File Share: ${shareFileModal.file.name}&body=${encodeURIComponent(emailBody)}`, '_blank');
                    }}
                    className="w-full"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Share via Email
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => handleDownloadFile(shareFileModal.file)}
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Download File
                  </Button>
                </div>

                <div className="text-xs text-[var(--text-tertiary)] text-center pt-2 border-t border-[var(--border-primary)]">
                  Files are private by default. Only people with the link can access this file.
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudioHubWorldClass;
