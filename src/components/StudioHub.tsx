import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/blinkingFix.css";
import {
  SparklesIcon,
  PlayCircleIcon,
  PhotoIcon,
  CalendarDaysIcon,
  ArrowTrendingUpIcon,
  ClipboardDocumentListIcon,
  GlobeAltIcon,
  PlusIcon,
  ArrowRightIcon,
  EyeIcon,
  ChartBarIcon,
  BoltIcon,
  LinkIcon,
  StarIcon,
  ClockIcon,
  UserGroupIcon,
  DocumentDuplicateIcon,
  CogIcon,
  RocketLaunchIcon,
  FireIcon,
  LightBulbIcon,
  BeakerIcon,
  AcademicCapIcon,
  PresentationChartLineIcon,
  VideoCameraIcon,
  MegaphoneIcon,
  HashtagIcon,
  ChatBubbleLeftRightIcon,
  PencilIcon,
  ArrowUpOnSquareIcon,
  FolderPlusIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
  TagIcon,
  FolderIcon,
  UserIcon,
  CalendarIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

import { ColumnsIcon, CompassIcon, SearchCircleIcon } from "./IconComponents";

import {
  NotificationCenter,
  AchievementSystem,
  CollaborationHub,
  ProductivityTimer,
} from "./StudioHubEnhancements";

import WorkflowAutomation from "./WorkflowAutomation";

import {
  ContentPerformanceDashboard,
  QuickStatsWidget,
} from "./StudioHubDashboard";

// Command palette is now handled globally
import { initializeGlobalKeyboardShortcuts } from "../utils/globalKeyboardShortcuts";

import YouTubeChannelConnection from "./YouTubeChannelConnection";
import {
  YouTubeStatsWidget,
  YouTubeQuickActions,
  YouTubeRecentVideos,
  YouTubeInsights,
  YouTubeChannelPulse,
} from "./YouTubeStudioWidgets";
import { YouTubeChannel } from "../services/youtubeService";
import QuickNotesPanel from "./QuickNotesPanel";
import ProgressRings from "./ProgressRings";
import InspirationGallery from "./InspirationGallery";
import SidebarAIAssistant from "./SidebarAIAssistant";
import { UserContext } from "../services/intelligentAIAssistantService";

interface StudioHubProps {
  onNavigateToTab: (tab: string) => void;
  userPlan?: string;
  user?: any;
  isActive?: boolean; // To detect when this tab becomes active
}

interface Project {
  id: string;
  title: string;
  type: "content" | "campaign" | "analysis" | "design";
  status: "planning" | "in_progress" | "review" | "completed";
  progress: number;
  tools: string[];
  lastUpdated: Date;
  priority: "low" | "medium" | "high";
  description: string;
  thumbnail?: string;
  collaborators?: number;
  deadline?: Date;
}

interface Activity {
  id: string;
  type: "creation" | "analysis" | "export" | "collaboration";
  title: string;
  description: string;
  timestamp: Date;
  tool: string;
  impact?: "positive" | "negative" | "neutral";
  metrics?: {
    views?: number;
    engagement?: number;
    completion?: number;
  };
}

interface Insight {
  id: string;
  type: "performance" | "trend" | "optimization" | "recommendation";
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  tool: string;
  impact: "high" | "medium" | "low";
}

const StudioHub: React.FC<StudioHubProps> = ({ onNavigateToTab, userPlan, user, isActive = true }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"dashboard" | "projects" | "analytics">("dashboard");
  const [showQuickCreate, setShowQuickCreate] = useState(false);
  // Command palette state removed - now handled globally
  const [showWorkflowAutomation, setShowWorkflowAutomation] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  // Beautiful animations that play once and never re-trigger
  const animationsPlayed = useRef(false);
  const [enableAnimations, setEnableAnimations] = useState(false);

  // Play beautiful animations once on mount, then lock them forever
  useEffect(() => {
    if (!animationsPlayed.current) {
      setEnableAnimations(true);
      animationsPlayed.current = true;

      // Keep animations enabled long enough to complete, then lock forever
      const timer = setTimeout(() => {
        setEnableAnimations(false);
      }, 4000); // Extended time for all animations to complete beautifully

      return () => clearTimeout(timer);
    }
  }, []);

  // New Project Form State
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    type: 'content' as 'content' | 'campaign' | 'analysis' | 'design',
    priority: 'medium' as 'low' | 'medium' | 'high',
    tools: [] as string[],
    deadline: '',
    collaborators: [] as string[],
    tags: [] as string[],
    template: 'blank' as 'blank' | 'youtube-video' | 'social-campaign' | 'content-series' | 'brand-strategy'
  });

  // Initialize global keyboard shortcuts that work from any tab
  useEffect(() => {
    initializeGlobalKeyboardShortcuts(onNavigateToTab, () => {}); // Global command palette handles this now
  }, [onNavigateToTab]);



  // Helper function for project thumbnails (defined first to avoid hoisting issues)
  const getProjectThumbnail = useCallback((type: string) => {
    switch (type) {
      case 'content': return 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop&crop=center';
      case 'campaign': return 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=100&h=100&fit=crop&crop=center';
      case 'analysis': return 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop&crop=center';
      case 'design': return 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=100&h=100&fit=crop&crop=center';
      default: return 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop&crop=center';
    }
  }, []);

  // Create new project function (memoized to prevent re-renders)
  const createNewProject = useCallback(() => {
    if (!newProject.title.trim()) {
      alert('Please enter a project title');
      return;
    }

    const project: Project = {
      id: Date.now().toString(),
      title: newProject.title,
      description: newProject.description,
      type: newProject.type,
      status: 'planning',
      progress: 0,
      tools: newProject.tools,
      lastUpdated: new Date(),
      priority: newProject.priority,
      deadline: newProject.deadline ? new Date(newProject.deadline) : undefined,
      collaborators: newProject.collaborators.length,
      thumbnail: getProjectThumbnail(newProject.type)
    };

    // Add the new project to the list
    setProjects(prev => {
      const updated = [project, ...prev];
      localStorage.setItem('studioHub:projects', JSON.stringify(updated));
      return updated;
    });

    // Add activity
    const activity: Activity = {
      id: Date.now().toString() + '_activity',
      type: 'creation',
      title: 'New Project Created',
      description: `Created "${newProject.title}" project`,
      timestamp: new Date(),
      tool: 'Studio Hub',
      impact: 'positive'
    };
    setActivities(prev => {
      const updated = [activity, ...prev];
      localStorage.setItem('studioHub:activities', JSON.stringify(updated));
      return updated;
    });

    // Reset form
    setNewProject({
      title: '',
      description: '',
      type: 'content',
      priority: 'medium',
      tools: [],
      deadline: '',
      collaborators: [],
      tags: [],
      template: 'blank'
    });

    // Close modal
    setShowQuickCreate(false);

    // Show success message
    setTimeout(() => {
      alert(`�� Project "${project.title}" created successfully!`);
    }, 100);
  }, [newProject, getProjectThumbnail]);
  const [connectedYouTubeChannel, setConnectedYouTubeChannel] = useState<YouTubeChannel | null>(null);

  // Memoize filtered data to prevent unnecessary recalculations on interactions
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      if (viewMode === "projects") return true;
      if (viewMode === "analytics") return project.status === "completed";
      return project.status === "in_progress" || project.status === "planning";
    });
  }, [projects, viewMode]);

  const recentActivities = useMemo(() => {
    return activities.slice(0, 5);
  }, [activities]);

  const topInsights = useMemo(() => {
    return insights.filter(insight => insight.impact === "high").slice(0, 3);
  }, [insights]);

  // Development helper to clear cached data (accessible from console)
  useEffect(() => {
    (window as any).clearStudioHubCache = () => {
      localStorage.removeItem('studioHub:projects');
      localStorage.removeItem('studioHub:activities');
      localStorage.removeItem('studioHub:insights');
      window.location.reload();
    };

    return () => {
      delete (window as any).clearStudioHubCache;
    };
  }, []);

  // Prevent scroll events from causing re-renders
  useEffect(() => {
    let scrollTimer: NodeJS.Timeout;

    const handleScroll = () => {
      // Debounce scroll events to prevent excessive re-renders
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        // Only perform necessary scroll-related updates here
      }, 100);
    };

    // Add passive scroll listener for better performance
    document.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      document.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimer);
    };
  }, []);

  // Workspace action handlers
  const handleBatchExport = async () => {
    try {
      console.log("🚀 Starting batch export of all projects...");

      // Create a comprehensive report of all projects
      const exportData = {
        exportDate: new Date().toISOString(),
        totalProjects: projects.length,
        projects: projects.map(project => ({
          ...project,
          lastUpdated: project.lastUpdated.toISOString()
        })),
        activities: activities.map(activity => ({
          ...activity,
          timestamp: activity.timestamp.toISOString()
        })),
        insights: insights,
        summary: {
          completedProjects: projects.filter(p => p.status === 'completed').length,
          inProgressProjects: projects.filter(p => p.status === 'in_progress').length,
          highPriorityProjects: projects.filter(p => p.priority === 'high').length,
          averageProgress: projects.reduce((sum, p) => sum + p.progress, 0) / projects.length || 0
        }
      };

      // Convert to formatted JSON
      const jsonString = JSON.stringify(exportData, null, 2);

      // Create and download file
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `studio-hub-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      alert(`✅ Successfully exported ${projects.length} projects and ${activities.length} activities!`);
    } catch (error) {
      console.error("Export error:", error);
      alert("❌ Export failed. Please try again.");
    }
  };

  const handleQuickShare = async () => {
    try {
      console.log("🔗 Generating workspace share link...");

      // Create shareable workspace summary
      const shareData = {
        workspaceName: `${user?.displayName || 'User'}'s Studio`,
        totalProjects: projects.length,
        completedProjects: projects.filter(p => p.status === 'completed').length,
        recentActivity: activities.slice(0, 5),
        topTools: [...new Set(projects.flatMap(p => p.tools))].slice(0, 5),
        timestamp: new Date().toISOString()
      };

      // Generate shareable content
      const shareText = `🚀 Check out my CreateGen Studio workspace!\n\n📊 ${shareData.totalProjects} Total Projects\n✅ ${shareData.completedProjects} Completed\n🛠️ Top Tools: ${shareData.topTools.join(', ')}\n\nCreated with CreateGen Studio - AI-powered content creation platform`;

      // Try to use Web Share API if available
      if (navigator.share) {
        await navigator.share({
          title: 'My CreateGen Studio Workspace',
          text: shareText,
          url: window.location.href
        });
        alert("✅ Workspace shared successfully!");
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareText);
        alert("✅ Workspace summary copied to clipboard! You can now share it anywhere.");
      }
    } catch (error) {
      console.error("Share error:", error);
      alert("❌ Sharing failed. Please try again.");
    }
  };

  const handleAnalytics = () => {
    try {
      console.log("📊 Opening Analytics Dashboard...");

      // Generate comprehensive analytics
      const analytics = {
        overview: {
          totalProjects: projects.length,
          completedProjects: projects.filter(p => p.status === 'completed').length,
          averageProgress: Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length || 0),
          productivity: Math.round((activities.length / 7) * 100) / 100 // activities per day
        },
        performance: {
          highPriorityCompleted: projects.filter(p => p.priority === 'high' && p.status === 'completed').length,
          onTimeProjects: projects.filter(p => p.status === 'completed').length,
          toolsUsage: [...new Set(projects.flatMap(p => p.tools))].map(tool => ({
            tool,
            count: projects.filter(p => p.tools.includes(tool)).length
          })).sort((a, b) => b.count - a.count)
        },
        trends: {
          recentActivity: activities.length,
          growthRate: "+15%", // Mock data
          efficiency: "94%"
        }
      };

      // Create analytics modal
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4';
      modal.innerHTML = `
        <div class="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-slate-700">
            <div class="flex justify-between items-center">
              <h2 class="text-2xl font-bold text-white flex items-center gap-2">
                ����� Workspace Analytics
              </h2>
              <button onclick="this.closest('.fixed').remove()" class="text-slate-400 hover:text-white">✕</button>
            </div>
          </div>
          <div class="p-6 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div class="bg-slate-800 p-4 rounded-xl text-center">
                <div class="text-3xl font-bold text-blue-400">${analytics.overview.totalProjects}</div>
                <div class="text-slate-400 text-sm">Total Projects</div>
              </div>
              <div class="bg-slate-800 p-4 rounded-xl text-center">
                <div class="text-3xl font-bold text-green-400">${analytics.overview.completedProjects}</div>
                <div class="text-slate-400 text-sm">Completed</div>
              </div>
              <div class="bg-slate-800 p-4 rounded-xl text-center">
                <div class="text-3xl font-bold text-purple-400">${analytics.overview.averageProgress}%</div>
                <div class="text-slate-400 text-sm">Avg Progress</div>
              </div>
              <div class="bg-slate-800 p-4 rounded-xl text-center">
                <div class="text-3xl font-bold text-orange-400">${analytics.overview.productivity}</div>
                <div class="text-slate-400 text-sm">Activities/Day</div>
              </div>
            </div>

            <div class="bg-slate-800 p-4 rounded-xl">
              <h3 class="text-lg font-bold text-white mb-4">����️ Most Used Tools</h3>
              <div class="space-y-2">
                ${analytics.performance.toolsUsage.slice(0, 5).map(tool => `
                  <div class="flex justify-between items-center">
                    <span class="text-slate-300">${tool.tool}</span>
                    <div class="flex items-center gap-2">
                      <div class="w-20 bg-slate-700 rounded-full h-2">
                        <div class="bg-blue-500 h-2 rounded-full" style="width: ${(tool.count / projects.length) * 100}%"></div>
                      </div>
                      <span class="text-slate-400 text-sm">${tool.count}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="bg-slate-800 p-4 rounded-xl text-center">
                <div class="text-xl font-bold text-emerald-400">${analytics.trends.growthRate}</div>
                <div class="text-slate-400 text-sm">Growth Rate</div>
              </div>
              <div class="bg-slate-800 p-4 rounded-xl text-center">
                <div class="text-xl font-bold text-cyan-400">${analytics.trends.efficiency}</div>
                <div class="text-slate-400 text-sm">Efficiency</div>
              </div>
              <div class="bg-slate-800 p-4 rounded-xl text-center">
                <div class="text-xl font-bold text-yellow-400">${analytics.trends.recentActivity}</div>
                <div class="text-slate-400 text-sm">Recent Activities</div>
              </div>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(modal);
      console.log("✅ Analytics dashboard opened");
    } catch (error) {
      console.error("Analytics error:", error);
      alert("❌ Failed to load analytics. Please try again.");
    }
  };

  const handleAutomation = () => {
    console.log("⚙️ Opening Workflow Automation...");
    setShowWorkflowAutomation(true);
  };

  // Legacy automation function (kept for reference)
  const handleAutomationLegacy = () => {
    try {
      console.log("⚙️ Opening Automation Setup...");

      // Create automation setup modal
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4';
      modal.innerHTML = `
        <div class="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-slate-700">
            <div class="flex justify-between items-center">
              <h2 class="text-2xl font-bold text-white flex items-center gap-2">
                ⚙️ Workflow Automation
              </h2>
              <button onclick="this.closest('.fixed').remove()" class="text-slate-400 hover:text-white">✕</button>
            </div>
          </div>
          <div class="p-6 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-slate-800 p-4 rounded-xl border border-slate-700 hover:border-blue-500 cursor-pointer transition-colors">
                <div class="flex items-center gap-3 mb-3">
                  <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">📅</div>
                  <div>
                    <h3 class="font-bold text-white">Content Scheduling</h3>
                    <p class="text-slate-400 text-sm">Auto-schedule content</p>
                  </div>
                </div>
                <p class="text-slate-300 text-sm mb-3">Automatically schedule generated content across platforms</p>
                <div class="space-y-2 mb-3">
                  <select id="scheduleFrequency" class="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white text-sm">
                    <option value="daily">Daily at 9:00 AM</option>
                    <option value="mwf">Mon/Wed/Fri at 2:00 PM</option>
                    <option value="weekly">Weekly on Tuesday</option>
                  </select>
                </div>
                <button onclick="window.setupContentScheduling?.()" class="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-medium transition-colors">
                  Setup Schedule Automation
                </button>
              </div>

              <div class="bg-slate-800 p-4 rounded-xl border border-slate-700 hover:border-green-500 cursor-pointer transition-colors">
                <div class="flex items-center gap-3 mb-3">
                  <div class="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">🔄</div>
                  <div>
                    <h3 class="font-bold text-white">Auto-Export</h3>
                    <p class="text-slate-400 text-sm">Export on completion</p>
                  </div>
                </div>
                <p class="text-slate-300 text-sm mb-3">Automatically export projects when they reach 100%</p>
                <div class="space-y-2 mb-3">
                  <select id="exportFormat" class="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white text-sm">
                    <option value="pdf">PDF Document</option>
                    <option value="json">JSON Data</option>
                    <option value="csv">CSV Spreadsheet</option>
                  </select>
                </div>
                <button onclick="window.setupAutoExport?.()" class="w-full py-2 bg-green-600 hover:bg-green-500 rounded-lg text-white font-medium transition-colors">
                  Enable Auto-Export
                </button>
              </div>

              <div class="bg-slate-800 p-4 rounded-xl border border-slate-700 hover:border-purple-500 cursor-pointer transition-colors">
                <div class="flex items-center gap-3 mb-3">
                  <div class="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">📊</div>
                  <div>
                    <h3 class="font-bold text-white">Analytics Reports</h3>
                    <p class="text-slate-400 text-sm">Weekly summaries</p>
                  </div>
                </div>
                <p class="text-slate-300 text-sm mb-3">Receive automated weekly performance reports</p>
                <div class="space-y-2 mb-3">
                  <select id="reportFrequency" class="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white text-sm">
                    <option value="weekly">Weekly on Monday</option>
                    <option value="monthly">Monthly</option>
                  </select>
                  <input type="email" placeholder="your@email.com" class="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white text-sm">
                </div>
                <button onclick="window.setupAnalyticsReports?.()" class="w-full py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white font-medium transition-colors">
                  Setup Weekly Reports
                </button>
              </div>

              <div class="bg-slate-800 p-4 rounded-xl border border-slate-700 hover:border-orange-500 cursor-pointer transition-colors">
                <div class="flex items-center gap-3 mb-3">
                  <div class="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">🚨</div>
                  <div>
                    <h3 class="font-bold text-white">Smart Alerts</h3>
                    <p class="text-slate-400 text-sm">Deadline reminders</p>
                  </div>
                </div>
                <p class="text-slate-300 text-sm mb-3">Get notified about project deadlines and milestones</p>
                <div class="space-y-2 mb-3">
                  <div class="grid grid-cols-2 gap-2 text-xs">
                    <label class="flex items-center gap-1">
                      <input type="checkbox" checked class="w-3 h-3">
                      <span class="text-slate-300">24h before</span>
                    </label>
                    <label class="flex items-center gap-1">
                      <input type="checkbox" checked class="w-3 h-3">
                      <span class="text-slate-300">1 week before</span>
                    </label>
                  </div>
                </div>
                <button onclick="window.setupSmartAlerts?.()" class="w-full py-2 bg-orange-600 hover:bg-orange-500 rounded-lg text-white font-medium transition-colors">
                  Configure Alerts
                </button>
              </div>
            </div>

            <div class="bg-slate-800 p-4 rounded-xl">
              <h3 class="text-lg font-bold text-white mb-4">🤖 AI-Powered Automations</h3>
              <div class="space-y-3">
                <label class="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" class="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded" checked>
                  <span class="text-slate-300">Auto-generate project titles based on content</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" class="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded" checked>
                  <span class="text-slate-300">Smart priority assignment for new projects</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" class="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded">
                  <span class="text-slate-300">Auto-tag projects based on content analysis</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" class="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded">
                  <span class="text-slate-300">Suggest optimal collaboration assignments</span>
                </label>
              </div>
            </div>

            <div class="flex justify-end gap-3">
              <button onclick="this.closest('.fixed').remove()" class="px-6 py-2 text-slate-400 hover:text-white transition-colors">
                Cancel
              </button>
              <button onclick="alert('✅ Automation workflows saved successfully!'); this.closest('.fixed').remove();" class="px-6 py-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white rounded-lg font-medium transition-colors">
                Save Automation Settings
              </button>
            </div>
          </div>
        </div>
      `;

      // Add working automation functions
      window.setupContentScheduling = () => {
        const frequency = modal.querySelector('#scheduleFrequency')?.value || 'daily';
        localStorage.setItem('contentScheduling', JSON.stringify({
          enabled: true, frequency, setupDate: new Date().toISOString()
        }));
        alert('✅ Content scheduling activated! Frequency: ' + frequency);
        console.log('�� Content scheduling automation activated:', {frequency});
      };

      window.setupAutoExport = () => {
        const format = modal.querySelector('#exportFormat')?.value || 'pdf';
        localStorage.setItem('autoExport', JSON.stringify({
          enabled: true, format, setupDate: new Date().toISOString()
        }));
        alert('✅ Auto-export enabled! Format: ' + format.toUpperCase());
        console.log('🔄 Auto-export automation activated:', {format});
      };

      window.setupAnalyticsReports = () => {
        const frequency = modal.querySelector('#reportFrequency')?.value || 'weekly';
        const email = modal.querySelector('input[type="email"]')?.value;
        if (!email) {
          alert('Please enter your email address');
          return;
        }
        localStorage.setItem('analyticsReports', JSON.stringify({
          enabled: true, frequency, email, setupDate: new Date().toISOString()
        }));
        alert('✅ Analytics reports activated! Frequency: ' + frequency + ', Email: ' + email);
        console.log('📊 Analytics reports automation activated:', {frequency, email});
      };

      window.setupSmartAlerts = () => {
        const settings = {
          before24h: modal.querySelector('input[type="checkbox"]:nth-of-type(1)')?.checked,
          before1week: modal.querySelector('input[type="checkbox"]:nth-of-type(2)')?.checked
        };
        localStorage.setItem('smartAlerts', JSON.stringify({
          enabled: true, ...settings, setupDate: new Date().toISOString()
        }));
        alert('✅ Smart alerts configured! Active notifications: ' +
          Object.entries(settings).filter(([_, v]) => v).map(([k]) => k).join(', '));
        console.log('🚨 Smart alerts automation activated:', settings);
      };

      document.body.appendChild(modal);
      console.log("✅ Automation setup opened with working functionality");
    } catch (error) {
      console.error("Automation error:", error);
      alert("❌ Failed to load automation setup. Please try again.");
    }
  };

  // Load and persist data using localStorage
  useEffect(() => {
    // Try to load existing data from localStorage first
    const savedProjects = localStorage.getItem('studioHub:projects');
    const savedActivities = localStorage.getItem('studioHub:activities');
    const savedInsights = localStorage.getItem('studioHub:insights');

    if (savedProjects && savedActivities && savedInsights) {
      // Load existing data
      setProjects(JSON.parse(savedProjects).map((p: any) => ({
        ...p,
        lastUpdated: new Date(p.lastUpdated),
        deadline: p.deadline ? new Date(p.deadline) : undefined
      })));
      setActivities(JSON.parse(savedActivities).map((a: any) => ({
        ...a,
        timestamp: new Date(a.timestamp)
      })));
      setInsights(JSON.parse(savedInsights));
      return; // Don't regenerate if data exists
    }

    // Only generate mock data if no saved data exists
    const mockProjects: Project[] = [
      {
        id: "1",
        title: "YouTube Growth Campaign Q1",
        type: "campaign",
        status: "in_progress",
        progress: 67,
        tools: ["Generator", "Thumbnails", "Strategy", "Calendar"],
        lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000),
        priority: "high",
        description: "Complete content strategy for Q1 YouTube growth focusing on tech tutorials",
        collaborators: 3,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        id: "2",
        title: "Blog Content Redesign",
        type: "content",
        status: "planning",
        progress: 23,
        tools: ["Generator", "Canvas", "Web Search"],
        lastUpdated: new Date(Date.now() - 4 * 60 * 60 * 1000),
        priority: "medium",
        description: "Redesigning blog content structure and visual identity",
        collaborators: 2,
      },
      {
        id: "3",
        title: "Competitor Analysis Report",
        type: "analysis",
        status: "review",
        progress: 89,
        tools: ["YT Analysis", "YT Stats", "Trends"],
        lastUpdated: new Date(Date.now() - 1 * 60 * 60 * 1000),
        priority: "high",
        description: "Comprehensive analysis of top 10 competitors in the space",
      },
      {
        id: "4",
        title: "Brand Guidelines Update",
        type: "design",
        status: "completed",
        progress: 100,
        tools: ["Canvas", "Thumbnails"],
        lastUpdated: new Date(Date.now() - 6 * 60 * 60 * 1000),
        priority: "low",
        description: "Updated brand guidelines with new color palette and typography",
      },
    ];

    const mockActivities: Activity[] = [
      {
        id: "1",
        type: "creation",
        title: "Generated 5 YouTube titles",
        description: "Created optimized titles for tech tutorial series",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        tool: "Generator",
        impact: "positive",
        metrics: { engagement: 85 },
      },
      {
        id: "2",
        type: "analysis",
        title: "Analyzed competitor channel",
        description: "Deep dive into TechCrunch's content strategy",
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        tool: "YT Analysis",
        impact: "neutral",
      },
      {
        id: "3",
        type: "export",
        title: "Exported calendar to Google",
        description: "Synced Q1 content calendar with Google Calendar",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        tool: "Calendar",
        impact: "positive",
      },
      {
        id: "4",
        type: "creation",
        title: "Designed 3 thumbnail variants",
        description: "A/B testing thumbnails for upcoming video",
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        tool: "Thumbnails",
        impact: "positive",
        metrics: { views: 1250 },
      },
    ];

    const mockInsights: Insight[] = [
      {
        id: "1",
        type: "performance",
        title: "Thumbnail CTR improved 23%",
        description: "Your recent thumbnail designs show significantly higher click-through rates compared to previous versions",
        confidence: 94,
        actionable: true,
        tool: "Thumbnails",
        impact: "high",
      },
      {
        id: "2",
        type: "trend",
        title: "AI content trending up 156%",
        description: "AI-related content is seeing massive growth. Consider incorporating more AI topics into your strategy",
        confidence: 87,
        actionable: true,
        tool: "Trends",
        impact: "high",
      },
      {
        id: "3",
        type: "optimization",
        title: "Post timing optimization",
        description: "Your audience is most active on Tuesdays at 2PM EST. Schedule content accordingly",
        confidence: 76,
        actionable: true,
        tool: "Calendar",
        impact: "medium",
      },
      {
        id: "4",
        type: "recommendation",
        title: "Cross-platform opportunities",
        description: "Your YouTube content could be repurposed for LinkedIn with 78% efficiency",
        confidence: 82,
        actionable: true,
        tool: "Strategy",
        impact: "medium",
      },
    ];

    setProjects(mockProjects);
    setActivities(mockActivities);
    setInsights(mockInsights);

    // Save to localStorage for persistence
    localStorage.setItem('studioHub:projects', JSON.stringify(mockProjects));
    localStorage.setItem('studioHub:activities', JSON.stringify(mockActivities));
    localStorage.setItem('studioHub:insights', JSON.stringify(mockInsights));
  }, []);

  const toolIcons = {
    Generator: SparklesIcon,
    Canvas: ColumnsIcon,
    "YT Analysis": SearchCircleIcon,
    "YT Stats": PlayCircleIcon,
    Thumbnails: PhotoIcon,
    Strategy: CompassIcon,
    Calendar: CalendarDaysIcon,
    Trends: ArrowTrendingUpIcon,
    History: ClipboardDocumentListIcon,
    "Web Search": GlobeAltIcon,
  };

  const statusColors = {
    planning: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    in_progress: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    review: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    completed: "bg-green-500/20 text-green-300 border-green-500/30",
  };

  const priorityColors = {
    low: "bg-gray-500/20 text-gray-300",
    medium: "bg-yellow-500/20 text-yellow-300",
    high: "bg-red-500/20 text-red-300",
  };

  const QuickLaunchBar = () => (
    <div
      className="bg-gradient-to-r from-slate-800/60 to-slate-700/60 backdrop-blur-xl border border-slate-600/40 rounded-2xl p-6 mb-8 hover:shadow-2xl no-transition"
      style={{ boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.3)" }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white mb-2">🚀 Quick Launch</h2>
          <p className="text-slate-300 text-sm">Create content across all your tools</p>
        </div>
        <motion.button
          initial={enableAnimations ? { opacity: 0, x: 20 } : false}
          animate={enableAnimations ? { opacity: 1, x: 0 } : false}
          transition={enableAnimations ? { delay: 0.3, duration: 0.4 } : false}
          whileHover={{
            scale: 1.08,
            y: -2,
            boxShadow: "0 8px 25px -8px rgba(14, 165, 233, 0.4)",
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.95, y: 0 }}
          onClick={() => setShowQuickCreate(!showQuickCreate)}
          className="bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-300 shadow-lg font-semibold"
        >
          <PlusIcon className="w-4 h-4" />
          New Project
        </motion.button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { name: "Generator", icon: SparklesIcon, tab: "generator", color: "from-blue-500 to-cyan-400" },
          { name: "Canvas", icon: ColumnsIcon, tab: "canvas", color: "from-purple-500 to-pink-400" },
          { name: "Thumbnails", icon: PhotoIcon, tab: "thumbnailMaker", color: "from-green-500 to-emerald-400" },
          { name: "Strategy", icon: CompassIcon, tab: "strategy", color: "from-orange-500 to-red-400" },
          { name: "Trends", icon: ArrowTrendingUpIcon, tab: "trends", color: "from-indigo-500 to-purple-400" },
        ].map((tool) => {
          const IconComponent = tool.icon;
          return (
            <motion.button
              key={tool.name}
              initial={enableAnimations ? { opacity: 0, y: 20, scale: 0.9 } : false}
              animate={enableAnimations ? { opacity: 1, y: 0, scale: 1 } : false}
              transition={enableAnimations ? {
                delay: 0.1 * (tool.name.length % 5),
                duration: 0.6,
                type: "spring",
                stiffness: 120,
                damping: 15
              } : false}
              whileHover={{
                scale: 1.08,
                y: -4,
                rotateY: 5,
                boxShadow: "0 15px 35px -10px rgba(0, 0, 0, 0.3)",
                transition: { duration: 0.2 }
              }}
              whileTap={{
                scale: 0.95,
                y: 0,
                rotateY: 0,
                transition: { duration: 0.1 }
              }}
              onClick={() => onNavigateToTab(tool.tab)}
              className={`bg-gradient-to-br ${tool.color} p-4 rounded-xl text-white font-semibold flex flex-col items-center gap-2 hover:shadow-2xl transition-all duration-300 relative overflow-hidden`}
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
              >
                <IconComponent className="w-6 h-6" />
              </motion.div>
              <span className="text-sm relative z-10">{tool.name}</span>
              <motion.div
                className="absolute inset-0 bg-white/10 rounded-xl"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-slate-700/30 rounded-xl">
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
          <LightBulbIcon className="w-5 h-5 text-yellow-400" />
          Smart Suggestions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-slate-600/50 p-3 rounded-lg">
            <span className="text-sm text-slate-300">Based on trending topics: Create AI tutorial series</span>
          </div>
          <div className="bg-slate-600/50 p-3 rounded-lg">
            <span className="text-sm text-slate-300">Optimize your Tuesday posts for better engagement</span>
          </div>
          <div className="bg-slate-600/50 p-3 rounded-lg">
            <span className="text-sm text-slate-300">Repurpose your top video into 5 social posts</span>
          </div>
        </div>
      </div>
    </div>
  );

  const ProjectPipeline = () => (
    <motion.div
      initial={enableAnimations ? { opacity: 0, x: -30 } : false}
      animate={enableAnimations ? { opacity: 1, x: 0 } : false}
      transition={enableAnimations ? { duration: 0.8, delay: 0.7, type: "spring", stiffness: 80 } : false}
      className="bg-slate-800/50 backdrop-blur-xl border border-slate-600/30 rounded-2xl p-6 h-fit"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <RocketLaunchIcon className="w-5 h-5 text-orange-400" />
          Project Pipeline
        </h3>
        <div className="flex gap-2">
          {["dashboard", "projects", "analytics"].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode as any)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
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

      <div className="space-y-4">
        {filteredProjects.slice(0, 6).map((project) => (
          <motion.div
            key={project.id}
            layout
            whileHover={{ scale: 1.02 }}
            className={`bg-slate-700/50 border border-slate-600/30 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
              selectedProject === project.id ? "ring-2 ring-sky-400 bg-slate-700/70" : ""
            }`}
            onClick={() => setSelectedProject(selectedProject === project.id ? null : project.id)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-white text-sm">{project.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs border ${priorityColors[project.priority]}`}>
                    {project.priority}
                  </span>
                </div>
                <p className="text-slate-400 text-xs mb-2">{project.description}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs border ${statusColors[project.status]}`}>
                {project.status.replace("_", " ")}
              </span>
            </div>

            <div className="mb-3">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <div className="w-full bg-slate-600 rounded-full h-2">
                <motion.div
                  initial={enableAnimations ? { width: 0 } : false}
                  animate={enableAnimations ? { width: `${project.progress}%` } : false}
                  transition={enableAnimations ? { duration: 1.5, delay: 1.2, ease: "easeOut" } : false}
                  style={!enableAnimations ? { width: `${project.progress}%` } : {}}
                  className="bg-gradient-to-r from-sky-500 to-cyan-400 h-2 rounded-full"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {project.tools.slice(0, 3).map((tool, index) => {
                  const IconComponent = toolIcons[tool as keyof typeof toolIcons] || CogIcon;
                  return (
                    <div
                      key={index}
                      className="w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center"
                      title={tool}
                    >
                      <IconComponent className="w-3 h-3 text-slate-300" />
                    </div>
                  );
                })}
                {project.tools.length > 3 && (
                  <span className="text-xs text-slate-400 ml-1">+{project.tools.length - 3}</span>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                {project.collaborators && (
                  <span className="flex items-center gap-1">
                    <UserGroupIcon className="w-3 h-3" />
                    {project.collaborators}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <ClockIcon className="w-3 h-3" />
                  {new Date(project.lastUpdated).toLocaleDateString()}
                </span>
              </div>
            </div>

            <AnimatePresence>
              {selectedProject === project.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 pt-4 border-t border-slate-600/30 space-y-3"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <button className="bg-sky-600 hover:bg-sky-500 text-white px-3 py-2 rounded-lg text-xs flex items-center gap-1 transition-colors">
                      <EyeIcon className="w-3 h-3" />
                      View Details
                    </button>
                    <button className="bg-slate-600 hover:bg-slate-500 text-white px-3 py-2 rounded-lg text-xs flex items-center gap-1 transition-colors">
                      <PencilIcon className="w-3 h-3" />
                      Edit Project
                    </button>
                  </div>
                  {project.deadline && (
                    <div className="text-xs text-orange-300 flex items-center gap-1">
                      <ExclamationTriangleIcon className="w-3 h-3" />
                      Due: {new Date(project.deadline).toLocaleDateString()}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-4 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/30 hover:border-slate-500 text-slate-300 py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200"
      >
        <FolderPlusIcon className="w-4 h-4" />
        Create New Project
      </motion.button>
    </motion.div>
  );

  const ActivityFeed = () => (
    <motion.div
      initial={enableAnimations ? { opacity: 0, y: 30 } : false}
      animate={enableAnimations ? { opacity: 1, y: 0 } : false}
      transition={enableAnimations ? { duration: 0.8, delay: 0.9, type: "spring", stiffness: 90 } : false}
      className="bg-slate-800/50 backdrop-blur-xl border border-slate-600/30 rounded-2xl p-6"
    >
      <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
        <FireIcon className="w-5 h-5 text-orange-400" />
        Activity Feed & Insights
      </h3>

      <div className="space-y-4 mb-6">
        <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">Recent Activity</h4>
        {recentActivities.map((activity) => (
          <div key={activity.id} className="bg-slate-700/30 rounded-lg p-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h5 className="font-medium text-white text-sm">{activity.title}</h5>
                  <span className="text-xs bg-slate-600 text-slate-300 px-2 py-1 rounded">{activity.tool}</span>
                </div>
                <p className="text-slate-400 text-xs mb-2">{activity.description}</p>
                {activity.metrics && (
                  <div className="flex gap-3 text-xs">
                    {activity.metrics.views && (
                      <span className="text-green-400">👁�� {activity.metrics.views} views</span>
                    )}
                    {activity.metrics.engagement && (
                      <span className="text-blue-400">💪 {activity.metrics.engagement}% engagement</span>
                    )}
                  </div>
                )}
              </div>
              <span className="text-xs text-slate-500">
                {new Date(activity.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">AI Insights</h4>
        {topInsights.map((insight) => (
          <motion.div
            key={insight.id}
            whileHover={{ scale: 1.01 }}
            className="bg-gradient-to-r from-slate-700/40 to-slate-600/40 border border-slate-500/30 rounded-lg p-4"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  insight.impact === "high" ? "bg-red-400" : insight.impact === "medium" ? "bg-yellow-400" : "bg-green-400"
                }`} />
                <h5 className="font-semibold text-white text-sm">{insight.title}</h5>
              </div>
              <span className="text-xs bg-slate-600 text-slate-300 px-2 py-1 rounded">{insight.tool}</span>
            </div>
            <p className="text-slate-300 text-xs mb-3">{insight.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span>Confidence: {insight.confidence}%</span>
                <span className={`px-2 py-1 rounded ${insight.actionable ? "bg-green-500/20 text-green-300" : "bg-gray-500/20 text-gray-300"}`}>
                  {insight.actionable ? "Actionable" : "Informational"}
                </span>
              </div>
              {insight.actionable && (
                <button className="text-sky-400 hover:text-sky-300 text-xs flex items-center gap-1 transition-colors">
                  Take Action <ArrowRightIcon className="w-3 h-3" />
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const ToolsIntegrationHub = () => (
    <motion.div
      initial={enableAnimations ? { opacity: 0, x: 30 } : false}
      animate={enableAnimations ? { opacity: 1, x: 0 } : false}
      transition={enableAnimations ? { duration: 0.8, delay: 1.1, type: "spring", stiffness: 85 } : false}
      className="bg-slate-800/50 backdrop-blur-xl border border-slate-600/30 rounded-2xl p-6 h-fit"
    >
      <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
        <BeakerIcon className="w-5 h-5 text-purple-400" />
        Tools Integration Hub
      </h3>

      <div className="space-y-4">
        {[
          { name: "Generator", status: "active", usage: 89, tab: "generator" },
          { name: "Canvas", status: "active", usage: 67, tab: "canvas" },
          { name: "Thumbnails", status: "idle", usage: 34, tab: "thumbnailMaker" },
          { name: "Strategy", status: "active", usage: 78, tab: "strategy" },
          { name: "Trends", status: "active", usage: 92, tab: "trends" },
          { name: "Calendar", status: "idle", usage: 23, tab: "calendar" },
        ].map((tool) => (
          <motion.div
            key={tool.name}
            whileHover={{ scale: 1.02 }}
            className="bg-slate-700/30 border border-slate-600/30 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:bg-slate-700/50"
            onClick={() => onNavigateToTab(tool.tab)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  tool.status === "active" ? "bg-green-400 animate-pulse" : "bg-gray-400"
                }`} />
                <h4 className="font-medium text-white">{tool.name}</h4>
              </div>
              <ArrowRightIcon className="w-4 h-4 text-slate-400" />
            </div>
            <div className="mb-2">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Usage Today</span>
                <span>{tool.usage}%</span>
              </div>
              <div className="w-full bg-slate-600 rounded-full h-1.5">
                <motion.div
                  initial={enableAnimations ? { width: 0 } : false}
                  animate={enableAnimations ? { width: `${tool.usage}%` } : false}
                  transition={enableAnimations ? { duration: 1.2, delay: 1.8, ease: "easeOut" } : false}
                  style={!enableAnimations ? { width: `${tool.usage}%` } : {}}
                  className={`h-1.5 rounded-full ${
                    tool.usage > 70 ? "bg-green-400" : tool.usage > 40 ? "bg-yellow-400" : "bg-slate-400"
                  }`}
                />
              </div>
            </div>
            <div className="text-xs text-slate-500">
              {tool.status === "active" ? "Currently in use" : "Last used 2h ago"}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl">
        <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
          <LinkIcon className="w-4 h-4" />
          Smart Connections
        </h4>
        <div className="space-y-2 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-sky-400 rounded-full" />
            <span>Generator ↔ Thumbnails: Auto-generate thumbnails from titles</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full" />
            <span>Strategy ��� Calendar: Sync content plans automatically</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full" />
            <span>Canvas ↔ Generator: Import content to visual layouts</span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Memoize project templates to prevent recreating on every render
  const projectTemplates = useMemo(() => [
    {
      id: 'blank',
      name: 'Blank Project',
      description: 'Start from scratch with a clean slate',
      icon: FolderIcon,
      color: 'from-slate-500 to-slate-600'
    },
    {
      id: 'youtube-video',
      name: 'YouTube Video',
      description: 'Complete video production workflow',
      icon: VideoCameraIcon,
      color: 'from-red-500 to-red-600',
      tools: ['Generator', 'Thumbnails', 'YT Analysis']
    },
    {
      id: 'social-campaign',
      name: 'Social Campaign',
      description: 'Multi-platform social media campaign',
      icon: MegaphoneIcon,
      color: 'from-blue-500 to-blue-600',
      tools: ['Generator', 'Canvas', 'Strategy']
    },
    {
      id: 'content-series',
      name: 'Content Series',
      description: 'Multi-part content creation project',
      icon: DocumentDuplicateIcon,
      color: 'from-purple-500 to-purple-600',
      tools: ['Generator', 'Calendar', 'Strategy']
    },
    {
      id: 'brand-strategy',
      name: 'Brand Strategy',
      description: 'Comprehensive brand development',
      icon: CompassIcon,
      color: 'from-orange-500 to-orange-600',
      tools: ['Strategy', 'Trends', 'Canvas']
    }
  ], []);

  // Memoize available tools array
  const availableTools = useMemo(() => [
    'Generator', 'Canvas', 'Thumbnails', 'Strategy', 'Calendar',
    'Trends', 'YT Analysis', 'YT Stats', 'Web Search', 'History'
  ], []);

  // Memoize handler functions to prevent recreating on every render
  const handleTemplateSelect = useCallback((template: any) => {
    setNewProject(prev => ({
      ...prev,
      template: template.id,
      tools: template.tools || [],
      type: template.id.includes('youtube') ? 'content' :
            template.id.includes('campaign') ? 'campaign' :
            template.id.includes('strategy') ? 'design' : 'content'
    }));
  }, []);

  const addTag = useCallback((tag: string) => {
    if (tag.trim() && !newProject.tags.includes(tag.trim())) {
      setNewProject(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }));
    }
  }, [newProject.tags]);

  const removeTag = useCallback((tagToRemove: string) => {
    setNewProject(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  }, []);

  const toggleTool = useCallback((tool: string) => {
    setNewProject(prev => ({
      ...prev,
      tools: prev.tools.includes(tool)
        ? prev.tools.filter(t => t !== tool)
        : [...prev.tools, tool]
    }));
  }, []);

  const QuickCreateModal = React.memo(() => {
    if (!showQuickCreate) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
           onClick={() => setShowQuickCreate(false)}>
        <div onClick={(e) => e.stopPropagation()}
             className="bg-slate-800 border border-slate-600 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <FolderPlusIcon className="w-8 h-8 text-sky-400" />
                    Create New Project
                  </h2>
                  <p className="text-slate-400 mt-1">Choose a template and customize your project</p>
                </div>
                <button
                  onClick={() => setShowQuickCreate(false)}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-6 h-6 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Project Templates */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <BeakerIcon className="w-5 h-5 text-purple-400" />
                  Choose Template
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projectTemplates.map((template) => {
                    const IconComponent = template.icon;
                    const isSelected = newProject.template === template.id;

                    return (
                      <button
                        key={template.id}
                        onClick={() => handleTemplateSelect(template)}
                        className={`p-4 rounded-xl border transition-all text-left hover:scale-[1.02] active:scale-[0.98] ${
                          isSelected
                            ? 'border-sky-500 bg-sky-500/10 ring-2 ring-sky-500/20'
                            : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${template.color} flex items-center justify-center mb-3`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="font-semibold text-white mb-1">{template.name}</h4>
                        <p className="text-sm text-slate-400 mb-2">{template.description}</p>
                        {template.tools && (
                          <div className="flex flex-wrap gap-1">
                            {template.tools.map((tool) => (
                              <span key={tool} className="text-xs bg-slate-600 text-slate-300 px-2 py-1 rounded">
                                {tool}
                              </span>
                            ))}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Project Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Project Title */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      value={newProject.title}
                      onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter project title..."
                      className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-colors"
                    />
                  </div>

                  {/* Project Description */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Description
                    </label>
                    <textarea
                      value={newProject.description}
                      onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your project..."
                      rows={3}
                      className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-colors resize-none"
                    />
                  </div>

                  {/* Project Type & Priority */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Type
                      </label>
                      <select
                        value={newProject.type}
                        onChange={(e) => setNewProject(prev => ({ ...prev, type: e.target.value as any }))}
                        className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-colors"
                      >
                        <option value="content">Content</option>
                        <option value="campaign">Campaign</option>
                        <option value="analysis">Analysis</option>
                        <option value="design">Design</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Priority
                      </label>
                      <select
                        value={newProject.priority}
                        onChange={(e) => setNewProject(prev => ({ ...prev, priority: e.target.value as any }))}
                        className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-colors"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>

                  {/* Deadline */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Deadline (Optional)
                    </label>
                    <input
                      type="date"
                      value={newProject.deadline}
                      onChange={(e) => setNewProject(prev => ({ ...prev, deadline: e.target.value }))}
                      className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Tools Selection */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Tools & Features
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {availableTools.map((tool) => (
                        <button
                          key={tool}
                          onClick={() => toggleTool(tool)}
                          className={`p-2 rounded-lg border text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98] ${
                            newProject.tools.includes(tool)
                              ? 'border-sky-500 bg-sky-500/20 text-sky-300'
                              : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500'
                          }`}
                        >
                          {tool}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Tags
                    </label>
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Add tags (press Enter)"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addTag(e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                        className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-colors"
                      />
                      {newProject.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {newProject.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center gap-1 bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full text-sm"
                            >
                              <TagIcon className="w-3 h-3" />
                              {tag}
                              <button
                                onClick={() => removeTag(tag)}
                                className="hover:text-white transition-colors"
                              >
                                <XMarkIcon className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                      <RocketLaunchIcon className="w-4 h-4 text-orange-400" />
                      Quick Actions
                    </h4>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-sky-600 bg-slate-700 border-slate-600 rounded focus:ring-sky-500"
                        />
                        <span className="text-sm text-slate-300">Set up project workspace</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-sky-600 bg-slate-700 border-slate-600 rounded focus:ring-sky-500"
                        />
                        <span className="text-sm text-slate-300">Create initial timeline</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-sky-600 bg-slate-700 border-slate-600 rounded focus:ring-sky-500"
                        />
                        <span className="text-sm text-slate-300">Generate starter content ideas</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                <div className="text-sm text-slate-400">
                  {newProject.title ? `Creating: ${newProject.title}` : 'Enter project details above'}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowQuickCreate(false)}
                    className="px-6 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createNewProject}
                    disabled={!newProject.title.trim()}
                    className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] ${
                      newProject.title.trim()
                        ? 'bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white'
                        : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <FolderPlusIcon className="w-4 h-4" />
                    Create Project
                  </button>
                </div>
              </div>
            </div>
        </div>
      </div>
    );
  });

  const WorkspaceActions = () => (
    <motion.div
      initial={enableAnimations ? { opacity: 0, y: 30 } : false}
      animate={enableAnimations ? { opacity: 1, y: 0 } : false}
      transition={enableAnimations ? { duration: 0.8, delay: 1.3, type: "spring", stiffness: 80 } : false}
      className="bg-slate-800/50 backdrop-blur-xl border border-slate-600/30 rounded-2xl p-6 mt-8"
    >
      <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
        <BoltIcon className="w-5 h-5 text-yellow-400" />
        Workspace Actions
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleBatchExport()}
          className="bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white p-4 rounded-xl flex flex-col items-center gap-2 transition-all duration-200"
        >
          <DocumentDuplicateIcon className="w-6 h-6" />
          <span className="font-semibold text-sm">Batch Export</span>
          <span className="text-xs text-blue-200">Export all projects</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleQuickShare()}
          className="bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white p-4 rounded-xl flex flex-col items-center gap-2 transition-all duration-200"
        >
          <ArrowUpOnSquareIcon className="w-6 h-6" />
          <span className="font-semibold text-sm">Quick Share</span>
          <span className="text-xs text-green-200">Share workspace</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleAnalytics()}
          className="bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white p-4 rounded-xl flex flex-col items-center gap-2 transition-all duration-200"
        >
          <ChartBarIcon className="w-6 h-6" />
          <span className="font-semibold text-sm">Analytics</span>
          <span className="text-xs text-purple-200">Performance report</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleAutomation()}
          className="bg-gradient-to-br from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600 text-white p-4 rounded-xl flex flex-col items-center gap-2 transition-all duration-200"
        >
          <CogIcon className="w-6 h-6" />
          <span className="font-semibold text-sm">Automation</span>
          <span className="text-xs text-orange-200">Setup workflows</span>
        </motion.button>
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-slate-700/50 to-slate-600/50 rounded-xl">
        <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
          <AcademicCapIcon className="w-5 h-5 text-cyan-400" />
          Quick Stats Overview
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-400">127</div>
            <div className="text-xs text-slate-400">Content Pieces</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">89%</div>
            <div className="text-xs text-slate-400">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">4.2K</div>
            <div className="text-xs text-slate-400">Total Views</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">23</div>
            <div className="text-xs text-slate-400">Active Projects</div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const handleYouTubeChannelConnected = (channel: YouTubeChannel) => {
    setConnectedYouTubeChannel(channel);
  };

  const handleYouTubeChannelDisconnected = () => {
    setConnectedYouTubeChannel(null);
  };

  const handleGenerateContent = (type: string, context: string) => {
    // Navigate to generator with pre-selected content type
    onNavigateToTab('generator');
    // You could pass additional context here
    console.log(`Generating ${type} ${context}`);
  };

  // Build user context for AI assistant
  const buildUserContext = useCallback((): UserContext => {
    return {
      projects: projects.map(p => ({
        id: p.id,
        title: p.title,
        type: p.type,
        status: p.status,
        progress: p.progress,
        tools: p.tools,
        lastUpdated: p.lastUpdated,
      })),
      currentTool: 'studioHub',
      recentActivity: activities.slice(0, 5).map(a => ({
        id: a.id,
        type: a.type,
        title: a.title,
        timestamp: a.timestamp,
        tool: a.tool,
      })),
      performance: {
        totalGenerations: activities.filter(a => a.type === 'creation').length,
        averageEngagement: 75, // Mock data - could be calculated from real metrics
        topPerformingContent: projects.filter(p => p.status === 'completed').map(p => p.title),
        recentMetrics: {
          views: 1250,
          engagement: 8.5,
          followers: 2340,
        },
      },
      goals: ['Increase engagement', 'Create viral content', 'Build audience'],
      userPlan: userPlan || 'free',
      preferences: {
        contentTypes: ['video', 'social'],
        platforms: ['youtube', 'instagram'],
      },
    };
  }, [projects, activities, userPlan]);

  return (
    <div className="studio-hub-container h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="flex h-full">
        {/* Left Sidebar */}
        <div className="w-80 bg-slate-800/30 border-r border-slate-700 p-4 overflow-y-auto space-y-4">
          <div data-youtube-connection>
            <YouTubeChannelConnection
              onChannelConnected={handleYouTubeChannelConnected}
              onChannelDisconnected={handleYouTubeChannelDisconnected}
            />
          </div>

          <YouTubeQuickActions
            channel={connectedYouTubeChannel}
            onGenerateContent={handleGenerateContent}
          />

          <YouTubeRecentVideos
            channel={connectedYouTubeChannel}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">

        <motion.div
          initial={enableAnimations ? { opacity: 0, y: -30, scale: 0.95 } : false}
          animate={enableAnimations ? { opacity: 1, y: 0, scale: 1 } : false}
          transition={enableAnimations ? {
            duration: 0.8,
            type: "spring",
            stiffness: 100,
            damping: 15
          } : false}
          className="mb-8"
        >
          <motion.h1
            className="text-3xl font-bold text-white mb-2"
            initial={enableAnimations ? { opacity: 0, y: 20 } : false}
            animate={enableAnimations ? { opacity: 1, y: 0 } : false}
            transition={enableAnimations ? { delay: 0.3, duration: 0.6, type: "spring", stiffness: 120 } : false}
          >
            <span className="inline-block">
              ��
            </span>
            {" Studio Hub"}
          </motion.h1>
          <motion.p
            className="text-slate-300"
            initial={enableAnimations ? { opacity: 0, y: 10 } : false}
            animate={enableAnimations ? { opacity: 1, y: 0 } : false}
            transition={enableAnimations ? { delay: 0.5, duration: 0.5, type: "spring", stiffness: 100 } : false}
          >
            Your ultimate workspace - where all your creative tools come together
          </motion.p>
        </motion.div>

        <QuickLaunchBar />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            <ProjectPipeline />
          </div>
          <div className="lg:col-span-1">
            <ActivityFeed />
          </div>
          <div className="lg:col-span-1">
            <ToolsIntegrationHub />
          </div>
        </div>

        {/* Performance Dashboard */}
        <div className="mb-8">
          <ContentPerformanceDashboard />
        </div>

        {/* Enhanced Features Row - Premium Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Left Column - Quick Stats */}
          <div className="lg:col-span-3">
            <QuickStatsWidget />
          </div>

          {/* Center Column - Focus Timer (spotlight position) */}
          <div className="lg:col-span-4">
            <ProductivityTimer />
          </div>

          {/* Right Column - Collaboration Hub with Notifications below */}
          <div className="lg:col-span-5 space-y-6">
            <CollaborationHub />
            <NotificationCenter />
          </div>
        </div>

        {/* Inspiration & Discovery Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            <InspirationGallery />
          </div>
          <div className="lg:col-span-1">
            {/* Space reserved for future features */}
            <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 border-dashed p-6 h-full flex flex-col items-center justify-center text-slate-500">
              <div className="w-12 h-12 bg-slate-700/50 rounded-xl flex items-center justify-center mb-3">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <p className="text-sm font-medium">Feature Coming Soon</p>
              <p className="text-xs text-center mt-1">This space is reserved for your next enhancement</p>
            </div>
          </div>
          <div className="lg:col-span-1">
            {/* Space reserved for future features */}
            <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 border-dashed p-6 h-full flex flex-col items-center justify-center text-slate-500">
              <div className="w-12 h-12 bg-slate-700/50 rounded-xl flex items-center justify-center mb-3">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <p className="text-sm font-medium">Feature Coming Soon</p>
              <p className="text-xs text-center mt-1">This space is reserved for your next enhancement</p>
            </div>
          </div>
        </div>

        {/* Achievements Row */}
        <div className="mb-8">
          <AchievementSystem />
        </div>

        <WorkspaceActions />

        {/* Quick Create Modal */}
        <QuickCreateModal key="quick-create-modal" />

        {/* Command Palette - Now handled globally */}
        </div>

        {/* Right Sidebar */}
        <div className="w-80 bg-slate-800/30 border-l border-slate-700 p-4 overflow-y-auto space-y-4">
          {/* AI Assistant Toggle */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-200">AI Consultant</h3>
            <button
              onClick={() => setShowAIAssistant(!showAIAssistant)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                showAIAssistant
                  ? "bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-300 border border-purple-500/40 shadow-lg"
                  : "bg-slate-700/50 text-slate-400 border border-slate-600 hover:bg-gradient-to-r hover:from-purple-600/10 hover:to-blue-600/10 hover:text-purple-300 hover:border-purple-500/30"
              }`}
              title="Toggle AI Content Strategy Consultant"
            >
              <SparklesIcon className="h-4 w-4" />
              <span className="text-sm font-medium">
                {showAIAssistant ? "Hide Consultant" : "AI Consultant"}
              </span>
            </button>
          </div>

          {/* Intelligent AI Studio Assistant */}
          {showAIAssistant && (
            <div className="mb-6 bg-slate-800/40 border border-slate-700/50 rounded-xl p-4">
              <SidebarAIAssistant
                userContext={buildUserContext()}
                onNavigateToTab={onNavigateToTab}
                userPlan={userPlan}
              />
            </div>
          )}

          {/* Progress Rings */}
          <ProgressRings />

          {/* Quick Notes Panel */}
          <QuickNotesPanel />

          <YouTubeChannelPulse
            isConnected={!!connectedYouTubeChannel}
            onConnect={() => {
              // Scroll to left sidebar YouTube connection
              const connectionElement = document.querySelector('[data-youtube-connection]');
              if (connectionElement) {
                connectionElement.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          />

          <YouTubeStatsWidget
            channel={connectedYouTubeChannel}
          />

          <YouTubeInsights
            channel={connectedYouTubeChannel}
          />
        </div>
      </div>

      {/* Workflow Automation Modal */}
      <WorkflowAutomation
        isOpen={showWorkflowAutomation}
        onClose={() => setShowWorkflowAutomation(false)}
      />
    </div>
  );
};

export default StudioHub;
