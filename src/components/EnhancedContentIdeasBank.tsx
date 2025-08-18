import React, { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lightbulb,
  Plus,
  Search,
  Filter,
  Star,
  Tag,
  Calendar,
  Clock,
  Eye,
  Heart,
  MessageSquare,
  Share,
  TrendingUp,
  Brain,
  Sparkles,
  Users,
  Edit3,
  Copy,
  Trash2,
  ArrowRight,
  MoreHorizontal,
  Target,
  Zap,
  Layers,
  Grid3X3,
  List,
  Bookmark,
  Hash,
  Flame,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Circle,
  AlertCircle,
  Info,
  RefreshCw,
  Send,
  PlayCircle,
  PauseCircle,
  Upload,
  Download,
  Settings,
  Bell,
  BellOff,
  Globe,
  Smartphone,
  Monitor,
  Image as ImageIcon,
  Video,
  Mic,
  FileText,
  Camera,
  Megaphone,
  PenTool,
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

interface ContentIdea {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  category: string;
  platform: Platform;
  estimatedEngagement: number;
  status: "ideas" | "in-progress" | "ready" | "scheduled";
  dateAdded: string;
  dateModified: string;
  tags: string[];
  notes?: string;
  scheduledDate?: string;
  assignee?: string;
  contentType: "video" | "post" | "story" | "live" | "podcast" | "blog" | "thread" | "carousel";
  targetAudience?: string;
  keywords?: string[];
  inspiration?: {
    source: string;
    url?: string;
    notes?: string;
  };
  collaborators?: string[];
  aiGenerated?: boolean;
  trendingScore?: number;
  viralPotential?: number;
  difficulty?: "easy" | "medium" | "hard";
  estimatedTime?: number; // in minutes
  resources?: {
    images?: string[];
    videos?: string[];
    references?: string[];
  };
  analytics?: {
    views?: number;
    engagement?: number;
    likes?: number;
    shares?: number;
    saves?: number;
  };
}

interface EnhancedContentIdeasBankProps {
  ideas: ContentIdea[];
  onIdeaCreate?: (idea: Omit<ContentIdea, "id" | "dateAdded" | "dateModified">) => void;
  onIdeaUpdate?: (idea: ContentIdea) => void;
  onIdeaDelete?: (ideaId: string) => void;
  onPromoteToCalendar?: (idea: ContentIdea) => void;
  onGenerateAISuggestions?: () => Promise<ContentIdea[]>;
  className?: string;
}

// Platform configurations with content type recommendations
const PLATFORM_CONFIG = {
  [Platform.YouTube]: {
    name: "YouTube",
    color: "#FF0000",
    icon: YouTubeIcon,
    contentTypes: ["video", "live", "podcast"],
    trending: ["tutorials", "vlogs", "reviews", "gaming", "educational"],
    optimal: { engagement: "3.2%", bestTime: "2-3 PM, 8-9 PM" }
  },
  [Platform.TikTok]: {
    name: "TikTok",
    color: "#000000",
    icon: TikTokIcon,
    contentTypes: ["video", "live"],
    trending: ["challenges", "trends", "comedy", "dance", "educational"],
    optimal: { engagement: "5.8%", bestTime: "6-10 AM, 6-7 PM" }
  },
  [Platform.Instagram]: {
    name: "Instagram",
    color: "#E4405F",
    icon: InstagramIcon,
    contentTypes: ["post", "story", "video", "carousel", "live"],
    trending: ["lifestyle", "fashion", "food", "travel", "fitness"],
    optimal: { engagement: "4.1%", bestTime: "11 AM-1 PM, 5-7 PM" }
  },
  [Platform.Twitter]: {
    name: "Twitter",
    color: "#1DA1F2",
    icon: TwitterIcon,
    contentTypes: ["post", "thread", "live"],
    trending: ["news", "opinions", "threads", "tech", "business"],
    optimal: { engagement: "2.7%", bestTime: "8-9 AM, 12 PM, 6-7 PM" }
  },
  [Platform.LinkedIn]: {
    name: "LinkedIn",
    color: "#0077B5",
    icon: LinkedInIcon,
    contentTypes: ["post", "blog", "video", "carousel"],
    trending: ["professional", "industry", "career", "leadership", "insights"],
    optimal: { engagement: "3.9%", bestTime: "8-9 AM, 12 PM, 5-6 PM" }
  },
  [Platform.Facebook]: {
    name: "Facebook",
    color: "#1877F2",
    icon: FacebookIcon,
    contentTypes: ["post", "video", "story", "live"],
    trending: ["community", "events", "family", "local", "groups"],
    optimal: { engagement: "2.3%", bestTime: "9 AM, 1-3 PM" }
  },
};

const PRIORITY_CONFIG = {
  low: { color: "#10B981", label: "Low Priority", icon: Circle },
  medium: { color: "#F59E0B", label: "Medium Priority", icon: AlertCircle },
  high: { color: "#EF4444", label: "High Priority", icon: Star },
  urgent: { color: "#DC2626", label: "URGENT", icon: Flame }
};

const CATEGORY_CONFIG = {
  "Educational": { color: "#3B82F6", icon: Brain },
  "Entertainment": { color: "#8B5CF6", icon: PlayCircle },
  "Trending": { color: "#EF4444", icon: TrendingUp },
  "Promotional": { color: "#F59E0B", icon: Megaphone },
  "Behind the Scenes": { color: "#10B981", icon: Camera },
  "Tutorial": { color: "#06B6D4", icon: PenTool },
  "News & Updates": { color: "#6B7280", icon: Globe },
  "Community": { color: "#EC4899", icon: Users },
  "Personal": { color: "#84CC16", icon: Heart }
};

const CONTENT_TYPE_CONFIG = {
  video: { icon: Video, label: "Video", color: "#EF4444" },
  post: { icon: MessageSquare, label: "Post", color: "#3B82F6" },
  story: { icon: ImageIcon, label: "Story", color: "#8B5CF6" },
  live: { icon: PlayCircle, label: "Live", color: "#EF4444" },
  podcast: { icon: Mic, label: "Podcast", color: "#F59E0B" },
  blog: { icon: FileText, label: "Blog", color: "#10B981" },
  thread: { icon: Hash, label: "Thread", color: "#1DA1F2" },
  carousel: { icon: Layers, label: "Carousel", color: "#EC4899" }
};

const KANBAN_COLUMNS = [
  {
    id: "ideas" as const,
    title: "💡 Ideas",
    description: "Raw concepts and brainstorming",
    color: "#3B82F6",
    maxItems: null
  },
  {
    id: "in-progress" as const,
    title: "🔄 In Progress",
    description: "Being developed and refined",
    color: "#F59E0B",
    maxItems: 5
  },
  {
    id: "ready" as const,
    title: "✅ Ready",
    description: "Prepared for scheduling",
    color: "#10B981",
    maxItems: 10
  },
  {
    id: "scheduled" as const,
    title: "📅 Scheduled",
    description: "Added to calendar",
    color: "#8B5CF6",
    maxItems: null
  }
];

const EnhancedContentIdeasBank: React.FC<EnhancedContentIdeasBankProps> = ({
  ideas,
  onIdeaCreate,
  onIdeaUpdate,
  onIdeaDelete,
  onPromoteToCalendar,
  onGenerateAISuggestions,
  className = "",
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'grid' | 'list'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'engagement' | 'trending'>('date');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<ContentIdea | null>(null);
  const [draggedIdea, setDraggedIdea] = useState<ContentIdea | null>(null);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<ContentIdea[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // New idea form state
  const [newIdea, setNewIdea] = useState({
    title: '',
    description: '',
    category: 'Educational',
    platform: Platform.YouTube,
    priority: 'medium' as const,
    contentType: 'video' as const,
    tags: [] as string[],
    targetAudience: '',
    keywords: [] as string[],
    notes: '',
    estimatedTime: 60
  });

  // Filter and sort ideas
  const filteredIdeas = useMemo(() => {
    let filtered = ideas;

    // Apply filters
    if (searchQuery) {
      filtered = filtered.filter(idea =>
        idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (filterPlatform !== 'all') {
      filtered = filtered.filter(idea => idea.platform.toString() === filterPlatform);
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(idea => idea.category === filterCategory);
    }

    if (filterPriority !== 'all') {
      filtered = filtered.filter(idea => idea.priority === filterPriority);
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter(idea =>
        selectedTags.every(tag => idea.tags.includes(tag))
      );
    }

    // Sort ideas
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.dateModified).getTime() - new Date(a.dateModified).getTime();
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
        case 'engagement':
          return b.estimatedEngagement - a.estimatedEngagement;
        case 'trending':
          return (b.trendingScore || 0) - (a.trendingScore || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [ideas, searchQuery, filterPlatform, filterCategory, filterPriority, selectedTags, sortBy]);

  // Group ideas by status for Kanban view
  const groupedIdeas = useMemo(() => {
    const groups: Record<string, ContentIdea[]> = {};
    KANBAN_COLUMNS.forEach(column => {
      groups[column.id] = filteredIdeas.filter(idea => idea.status === column.id);
    });
    return groups;
  }, [filteredIdeas]);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    ideas.forEach(idea => idea.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, [ideas]);

  // Statistics
  const stats = useMemo(() => {
    const total = ideas.length;
    const byStatus = KANBAN_COLUMNS.reduce((acc, column) => {
      acc[column.id] = ideas.filter(idea => idea.status === column.id).length;
      return acc;
    }, {} as Record<string, number>);
    const avgEngagement = ideas.length > 0 
      ? Math.round(ideas.reduce((sum, idea) => sum + idea.estimatedEngagement, 0) / ideas.length)
      : 0;
    const aiGenerated = ideas.filter(idea => idea.aiGenerated).length;

    return { total, byStatus, avgEngagement, aiGenerated };
  }, [ideas]);

  // Handle drag and drop
  const handleDragStart = useCallback((idea: ContentIdea) => {
    setDraggedIdea(idea);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, newStatus: ContentIdea['status']) => {
    e.preventDefault();
    if (draggedIdea && draggedIdea.status !== newStatus) {
      const updatedIdea = { ...draggedIdea, status: newStatus, dateModified: new Date().toISOString() };
      onIdeaUpdate?.(updatedIdea);
    }
    setDraggedIdea(null);
  }, [draggedIdea, onIdeaUpdate]);

  // Handle idea actions
  const handleIdeaAction = useCallback((action: string, idea: ContentIdea) => {
    switch (action) {
      case 'edit':
        setSelectedIdea(idea);
        setShowCreateModal(true);
        break;
      case 'duplicate':
        if (onIdeaCreate) {
          const duplicatedIdea = {
            ...idea,
            title: `${idea.title} (Copy)`,
            status: 'ideas' as const,
          };
          delete (duplicatedIdea as any).id;
          delete (duplicatedIdea as any).dateAdded;
          delete (duplicatedIdea as any).dateModified;
          onIdeaCreate(duplicatedIdea);
        }
        break;
      case 'promote':
        if (onPromoteToCalendar) {
          onPromoteToCalendar(idea);
          // Update idea status to scheduled
          if (onIdeaUpdate) {
            onIdeaUpdate({ ...idea, status: 'scheduled', dateModified: new Date().toISOString() });
          }
        }
        break;
      case 'delete':
        if (onIdeaDelete) {
          onIdeaDelete(idea.id);
        }
        break;
      case 'move-to-progress':
        if (onIdeaUpdate) {
          onIdeaUpdate({ ...idea, status: 'in-progress', dateModified: new Date().toISOString() });
        }
        break;
      case 'move-to-ready':
        if (onIdeaUpdate) {
          onIdeaUpdate({ ...idea, status: 'ready', dateModified: new Date().toISOString() });
        }
        break;
    }
  }, [onIdeaCreate, onIdeaUpdate, onIdeaDelete, onPromoteToCalendar]);

  // Generate AI suggestions
  const generateAISuggestions = useCallback(async () => {
    setIsGeneratingSuggestions(true);
    try {
      if (onGenerateAISuggestions) {
        const suggestions = await onGenerateAISuggestions();
        setAiSuggestions(suggestions);
        setShowAISuggestions(true);
      } else {
        // Fallback: Generate mock AI suggestions
        const mockSuggestions: ContentIdea[] = [
          {
            id: `ai-${Date.now()}-1`,
            title: "10 Content Creation Hacks for 2024",
            description: "Share proven strategies that have helped creators grow their audience by 300% this year",
            priority: "high",
            category: "Educational",
            platform: Platform.YouTube,
            estimatedEngagement: 85,
            status: "ideas",
            dateAdded: new Date().toISOString(),
            dateModified: new Date().toISOString(),
            tags: ["tutorial", "growth", "2024", "tips"],
            contentType: "video",
            aiGenerated: true,
            trendingScore: 92,
            viralPotential: 78,
            difficulty: "medium",
            estimatedTime: 90,
            targetAudience: "Content creators, marketers",
            keywords: ["content creation", "growth hacks", "viral content", "social media tips"]
          },
          {
            id: `ai-${Date.now()}-2`,
            title: "Behind the Scenes: My Content Planning Process",
            description: "Take your audience through your actual planning workflow and tools",
            priority: "medium",
            category: "Behind the Scenes",
            platform: Platform.Instagram,
            estimatedEngagement: 72,
            status: "ideas",
            dateAdded: new Date().toISOString(),
            dateModified: new Date().toISOString(),
            tags: ["bts", "process", "planning", "authentic"],
            contentType: "story",
            aiGenerated: true,
            trendingScore: 68,
            viralPotential: 55,
            difficulty: "easy",
            estimatedTime: 30,
            targetAudience: "Aspiring creators",
            keywords: ["behind the scenes", "content planning", "workflow", "transparency"]
          },
          {
            id: `ai-${Date.now()}-3`,
            title: "React to Trending AI Tools for Creators",
            description: "Test and review the latest AI tools that are changing the content game",
            priority: "urgent",
            category: "Trending",
            platform: Platform.TikTok,
            estimatedEngagement: 95,
            status: "ideas",
            dateAdded: new Date().toISOString(),
            dateModified: new Date().toISOString(),
            tags: ["ai", "tools", "trending", "review"],
            contentType: "video",
            aiGenerated: true,
            trendingScore: 96,
            viralPotential: 89,
            difficulty: "medium",
            estimatedTime: 45,
            targetAudience: "Tech-savvy creators",
            keywords: ["AI tools", "creator tools", "trending tech", "reviews"]
          }
        ];
        setAiSuggestions(mockSuggestions);
        setShowAISuggestions(true);
      }
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
    } finally {
      setIsGeneratingSuggestions(false);
    }
  }, [onGenerateAISuggestions]);

  // Create new idea
  const handleCreateIdea = useCallback(() => {
    if (!newIdea.title.trim()) return;

    const idea = {
      ...newIdea,
      id: `idea-${Date.now()}`,
      status: 'ideas' as const,
      dateAdded: new Date().toISOString(),
      dateModified: new Date().toISOString(),
      estimatedEngagement: Math.floor(Math.random() * 100) + 1,
      aiGenerated: false
    };

    onIdeaCreate?.(idea);
    
    // Reset form
    setNewIdea({
      title: '',
      description: '',
      category: 'Educational',
      platform: Platform.YouTube,
      priority: 'medium',
      contentType: 'video',
      tags: [],
      targetAudience: '',
      keywords: [],
      notes: '',
      estimatedTime: 60
    });
    setShowCreateModal(false);
    setSelectedIdea(null);
  }, [newIdea, onIdeaCreate]);

  // Add AI suggestion to ideas
  const addSuggestionToIdeas = useCallback((suggestion: ContentIdea) => {
    onIdeaCreate?.(suggestion);
  }, [onIdeaCreate]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getViralPotentialColor = (score?: number) => {
    if (!score) return '#6B7280';
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const getTrendingBadge = (score?: number) => {
    if (!score) return null;
    if (score >= 90) return { label: '🔥 Viral', color: '#EF4444' };
    if (score >= 70) return { label: '📈 Trending', color: '#F59E0B' };
    if (score >= 50) return { label: '✨ Popular', color: '#3B82F6' };
    return null;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Enhanced Header */}
      <Card variant="glow" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg">
              <Lightbulb className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                <GradientText>Content Ideas Bank</GradientText>
              </h2>
              <p className="text-[var(--text-secondary)]">
                {stats.total} ideas • {stats.avgEngagement}% avg engagement • {stats.aiGenerated} AI-generated
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={generateAISuggestions}
              disabled={isGeneratingSuggestions}
            >
              <Brain className={`w-4 h-4 ${isGeneratingSuggestions ? 'animate-pulse' : ''}`} />
              {isGeneratingSuggestions ? 'Generating...' : 'AI Suggestions'}
            </Button>
            <Button variant="primary" size="sm" onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4" />
              Add Idea
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {KANBAN_COLUMNS.map((column) => (
            <StatCard
              key={column.id}
              title={column.title.replace(/^\p{Emoji}\s*/u, '')}
              value={stats.byStatus[column.id]?.toString() || '0'}
              icon={<Lightbulb />}
              description={column.description}
              variant="info"
            />
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-tertiary)] w-4 h-4" />
              <Input
                placeholder="Search ideas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>

            {/* Filters */}
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
              value={filterCategory} 
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 bg-[var(--surface-tertiary)] border border-[var(--border-primary)] rounded-lg text-sm"
            >
              <option value="all">All Categories</option>
              {Object.keys(CATEGORY_CONFIG).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-[var(--surface-tertiary)] border border-[var(--border-primary)] rounded-lg text-sm"
            >
              <option value="date">Sort by Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="engagement">Sort by Engagement</option>
              <option value="trending">Sort by Trending</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex border border-[var(--border-primary)] rounded-lg">
            {[
              { id: 'kanban', icon: <Grid3X3 className="w-4 h-4" />, label: 'Kanban' },
              { id: 'grid', icon: <Layers className="w-4 h-4" />, label: 'Grid' },
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

        {/* Tag Filter */}
        {allTags.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[var(--border-primary)]">
            <div className="flex items-center space-x-2 mb-2">
              <Tag className="w-4 h-4 text-[var(--text-secondary)]" />
              <span className="text-sm font-medium text-[var(--text-secondary)]">Filter by tags:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {allTags.slice(0, 15).map(tag => (
                <button
                  key={tag}
                  onClick={() => {
                    setSelectedTags(prev => 
                      prev.includes(tag) 
                        ? prev.filter(t => t !== tag)
                        : [...prev, tag]
                    );
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-[var(--brand-primary)] text-white'
                      : 'bg-[var(--surface-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--surface-quaternary)]'
                  }`}
                >
                  #{tag}
                </button>
              ))}
              {selectedTags.length > 0 && (
                <button
                  onClick={() => setSelectedTags([])}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* Content Display */}
      <AnimatePresence mode="wait">
        {filteredIdeas.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <EmptyState
              icon={<Lightbulb />}
              title="No ideas yet"
              description="Start brainstorming content ideas or generate AI suggestions"
              actionLabel="Generate AI Ideas"
              onAction={generateAISuggestions}
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
            {viewMode === 'kanban' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {KANBAN_COLUMNS.map((column, columnIndex) => (
                  <motion.div
                    key={column.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: columnIndex * 0.1 }}
                  >
                    <Card
                      variant="hover"
                      className="h-full"
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, column.id)}
                    >
                      {/* Column Header */}
                      <div className="p-4 border-b border-[var(--border-primary)]">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-[var(--text-primary)]">
                            {column.title}
                          </h3>
                          <Badge variant="neutral">
                            {groupedIdeas[column.id]?.length || 0}
                          </Badge>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)]">
                          {column.description}
                        </p>
                        {column.maxItems && groupedIdeas[column.id]?.length >= column.maxItems && (
                          <div className="mt-2 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">
                            At capacity ({column.maxItems} max)
                          </div>
                        )}
                      </div>

                      {/* Ideas in Column */}
                      <div className="p-4 space-y-3 min-h-96">
                        <AnimatePresence>
                          {groupedIdeas[column.id]?.map((idea, index) => {
                            const platform = PLATFORM_CONFIG[idea.platform];
                            const priority = PRIORITY_CONFIG[idea.priority];
                            const contentType = CONTENT_TYPE_CONFIG[idea.contentType];
                            const trendingBadge = getTrendingBadge(idea.trendingScore);
                            const IconComponent = platform.icon;
                            const ContentTypeIcon = contentType.icon;

                            return (
                              <motion.div
                                key={idea.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ delay: index * 0.05 }}
                                draggable
                                onDragStart={() => handleDragStart(idea)}
                                className="group cursor-move"
                              >
                                <Card variant="hover" className="p-4 transition-all duration-200 hover:shadow-md group-hover:scale-105">
                                  <div className="space-y-3">
                                    {/* Header */}
                                    <div className="flex items-start justify-between">
                                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                                        <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${platform.color}15` }}>
                                          <IconComponent className="w-4 h-4" style={{ color: platform.color }} />
                                        </div>
                                        <div className="p-1 rounded" style={{ backgroundColor: `${contentType.color}15` }}>
                                          <ContentTypeIcon className="w-3 h-3" style={{ color: contentType.color }} />
                                        </div>
                                      </div>
                                      <div className="relative">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => setSelectedIdea(selectedIdea?.id === idea.id ? null : idea)}
                                        >
                                          <MoreHorizontal className="w-4 h-4" />
                                        </Button>
                                        
                                        {/* Quick Actions Dropdown */}
                                        {selectedIdea?.id === idea.id && (
                                          <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            className="absolute right-0 top-full mt-2 w-48 bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-lg shadow-lg z-50"
                                          >
                                            <div className="p-2 space-y-1">
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleIdeaAction('edit', idea)}
                                                className="w-full justify-start"
                                              >
                                                <Edit3 className="w-4 h-4 mr-2" />
                                                Edit Idea
                                              </Button>
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleIdeaAction('duplicate', idea)}
                                                className="w-full justify-start"
                                              >
                                                <Copy className="w-4 h-4 mr-2" />
                                                Duplicate
                                              </Button>
                                              {idea.status !== 'scheduled' && (
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => handleIdeaAction('promote', idea)}
                                                  className="w-full justify-start"
                                                >
                                                  <Calendar className="w-4 h-4 mr-2" />
                                                  Schedule Now
                                                </Button>
                                              )}
                                              {idea.status === 'ideas' && (
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => handleIdeaAction('move-to-progress', idea)}
                                                  className="w-full justify-start"
                                                >
                                                  <ArrowRight className="w-4 h-4 mr-2" />
                                                  Move to Progress
                                                </Button>
                                              )}
                                              {idea.status === 'in-progress' && (
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => handleIdeaAction('move-to-ready', idea)}
                                                  className="w-full justify-start"
                                                >
                                                  <CheckCircle className="w-4 h-4 mr-2" />
                                                  Mark Ready
                                                </Button>
                                              )}
                                              <div className="border-t border-[var(--border-primary)] my-1"></div>
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleIdeaAction('delete', idea)}
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

                                    {/* Title and Priority */}
                                    <div className="space-y-2">
                                      <h4 className="font-medium text-[var(--text-primary)] line-clamp-2 text-sm">
                                        {idea.title}
                                      </h4>
                                      <div className="flex items-center space-x-2">
                                        <Badge 
                                          variant={priority.color === '#10B981' ? 'success' : priority.color === '#EF4444' ? 'error' : 'warning'}
                                          className="text-xs"
                                        >
                                          {priority.label}
                                        </Badge>
                                        {idea.aiGenerated && (
                                          <Badge variant="info" className="text-xs">
                                            <Sparkles className="w-3 h-3 mr-1" />
                                            AI
                                          </Badge>
                                        )}
                                        {trendingBadge && (
                                          <Badge variant="error" className="text-xs" style={{ backgroundColor: `${trendingBadge.color}20`, color: trendingBadge.color }}>
                                            {trendingBadge.label}
                                          </Badge>
                                        )}
                                      </div>
                                    </div>

                                    {/* Description */}
                                    {idea.description && (
                                      <p className="text-xs text-[var(--text-secondary)] line-clamp-3">
                                        {idea.description}
                                      </p>
                                    )}

                                    {/* Tags */}
                                    {idea.tags.length > 0 && (
                                      <div className="flex flex-wrap gap-1">
                                        {idea.tags.slice(0, 3).map(tag => (
                                          <span
                                            key={tag}
                                            className="px-2 py-1 bg-[var(--surface-tertiary)] text-[var(--text-secondary)] text-xs rounded"
                                          >
                                            #{tag}
                                          </span>
                                        ))}
                                        {idea.tags.length > 3 && (
                                          <span className="px-2 py-1 bg-[var(--surface-tertiary)] text-[var(--text-secondary)] text-xs rounded">
                                            +{idea.tags.length - 3}
                                          </span>
                                        )}
                                      </div>
                                    )}

                                    {/* Metrics */}
                                    <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                                      <div className="flex items-center space-x-2">
                                        <span className="flex items-center space-x-1">
                                          <TrendingUp className="w-3 h-3" />
                                          <span>{idea.estimatedEngagement}%</span>
                                        </span>
                                        {idea.viralPotential && (
                                          <span className="flex items-center space-x-1">
                                            <Flame className="w-3 h-3" style={{ color: getViralPotentialColor(idea.viralPotential) }} />
                                            <span>{idea.viralPotential}</span>
                                          </span>
                                        )}
                                      </div>
                                      <span>{formatDate(idea.dateModified)}</span>
                                    </div>

                                    {/* Quick Action Buttons */}
                                    <div className="flex space-x-2 pt-2">
                                      <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => handleIdeaAction('edit', idea)}
                                        className="flex-1 text-xs"
                                      >
                                        <Edit3 className="w-3 h-3 mr-1" />
                                        Edit
                                      </Button>
                                      {idea.status === 'ready' && (
                                        <Button
                                          variant="primary"
                                          size="sm"
                                          onClick={() => handleIdeaAction('promote', idea)}
                                          className="flex-1 text-xs"
                                        >
                                          <Calendar className="w-3 h-3 mr-1" />
                                          Schedule
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </Card>
                              </motion.div>
                            );
                          })}
                        </AnimatePresence>

                        {/* Add New Idea Button (only in Ideas column) */}
                        {column.id === 'ideas' && (
                          <button
                            onClick={() => setShowCreateModal(true)}
                            className="w-full p-4 border-2 border-dashed border-[var(--border-primary)] rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--brand-primary)] transition-colors"
                          >
                            <Plus className="w-5 h-5 mx-auto mb-2" />
                            <span className="text-sm">Add new idea</span>
                          </button>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Grid and List views would go here - simplified for now */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredIdeas.map((idea, index) => (
                  <motion.div
                    key={idea.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {/* Simplified grid card - same content as kanban but in grid layout */}
                    <Card variant="hover" className="p-4 h-full">
                      <div className="space-y-3">
                        <h4 className="font-medium text-[var(--text-primary)] line-clamp-2">
                          {idea.title}
                        </h4>
                        <p className="text-sm text-[var(--text-secondary)] line-clamp-3">
                          {idea.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant={PRIORITY_CONFIG[idea.priority].color === '#10B981' ? 'success' : 'warning'}>
                            {idea.status}
                          </Badge>
                          <span className="text-xs text-[var(--text-secondary)]">
                            {idea.estimatedEngagement}%
                          </span>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {viewMode === 'list' && (
              <Card>
                <div className="divide-y divide-[var(--border-primary)]">
                  {filteredIdeas.map((idea, index) => (
                    <motion.div
                      key={idea.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="p-4 hover:bg-[var(--surface-secondary)] transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-[var(--text-primary)] truncate">
                            {idea.title}
                          </h4>
                          <p className="text-sm text-[var(--text-secondary)] truncate">
                            {idea.description}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge variant="neutral">{idea.status}</Badge>
                          <span className="text-sm text-[var(--text-secondary)]">
                            {idea.estimatedEngagement}%
                          </span>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Suggestions Modal */}
      <AnimatePresence>
        {showAISuggestions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowAISuggestions(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[var(--surface-primary)] rounded-xl shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-[var(--border-primary)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      <Brain className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                        AI Content Suggestions
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)]">
                        {aiSuggestions.length} trending ideas based on your content strategy
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" onClick={() => setShowAISuggestions(false)}>
                    ✕
                  </Button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {aiSuggestions.map((suggestion, index) => {
                    const platform = PLATFORM_CONFIG[suggestion.platform];
                    const trendingBadge = getTrendingBadge(suggestion.trendingScore);
                    const IconComponent = platform.icon;

                    return (
                      <motion.div
                        key={suggestion.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card variant="hover" className="p-4 h-full">
                          <div className="space-y-4">
                            {/* Header */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${platform.color}15` }}>
                                  <IconComponent className="w-4 h-4" style={{ color: platform.color }} />
                                </div>
                                <Badge variant="info" className="text-xs">
                                  <Sparkles className="w-3 h-3 mr-1" />
                                  AI Generated
                                </Badge>
                              </div>
                              {trendingBadge && (
                                <Badge variant="error" className="text-xs" style={{ backgroundColor: `${trendingBadge.color}20`, color: trendingBadge.color }}>
                                  {trendingBadge.label}
                                </Badge>
                              )}
                            </div>

                            {/* Content */}
                            <div>
                              <h4 className="font-medium text-[var(--text-primary)] mb-2 line-clamp-2">
                                {suggestion.title}
                              </h4>
                              <p className="text-sm text-[var(--text-secondary)] line-clamp-3">
                                {suggestion.description}
                              </p>
                            </div>

                            {/* Metrics */}
                            <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                              <div className="flex items-center space-x-3">
                                <span className="flex items-center space-x-1">
                                  <TrendingUp className="w-3 h-3" />
                                  <span>{suggestion.estimatedEngagement}%</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <Flame className="w-3 h-3" style={{ color: getViralPotentialColor(suggestion.viralPotential) }} />
                                  <span>{suggestion.viralPotential}</span>
                                </span>
                              </div>
                              <span className="capitalize">{suggestion.difficulty}</span>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1">
                              {suggestion.tags?.slice(0, 3).map(tag => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 bg-[var(--surface-tertiary)] text-[var(--text-secondary)] text-xs rounded"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>

                            {/* Actions */}
                            <div className="flex space-x-2">
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => {
                                  addSuggestionToIdeas(suggestion);
                                  handleIdeaAction('promote', suggestion);
                                }}
                                className="flex-1 text-xs"
                              >
                                <Calendar className="w-3 h-3 mr-1" />
                                Schedule Now
                              </Button>
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => addSuggestionToIdeas(suggestion)}
                                className="flex-1 text-xs"
                              >
                                <Plus className="w-3 h-3 mr-1" />
                                Add to Ideas
                              </Button>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create/Edit Idea Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[var(--surface-primary)] rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-[var(--border-primary)]">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                    {selectedIdea ? 'Edit Idea' : 'Create New Idea'}
                  </h3>
                  <Button variant="ghost" onClick={() => setShowCreateModal(false)}>
                    ✕
                  </Button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                      Title *
                    </label>
                    <Input
                      value={newIdea.title}
                      onChange={(e) => setNewIdea(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter idea title..."
                      className="w-full"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                      Description
                    </label>
                    <textarea
                      value={newIdea.description}
                      onChange={(e) => setNewIdea(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your content idea..."
                      className="w-full px-3 py-2 bg-[var(--surface-tertiary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] resize-none"
                      rows={3}
                    />
                  </div>

                  {/* Platform and Content Type */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                        Platform
                      </label>
                      <select
                        value={newIdea.platform}
                        onChange={(e) => setNewIdea(prev => ({ ...prev, platform: e.target.value as Platform }))}
                        className="w-full px-3 py-2 bg-[var(--surface-tertiary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)]"
                      >
                        {Object.entries(PLATFORM_CONFIG).map(([key, config]) => (
                          <option key={key} value={key}>{config.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                        Content Type
                      </label>
                      <select
                        value={newIdea.contentType}
                        onChange={(e) => setNewIdea(prev => ({ ...prev, contentType: e.target.value as any }))}
                        className="w-full px-3 py-2 bg-[var(--surface-tertiary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)]"
                      >
                        {Object.entries(CONTENT_TYPE_CONFIG).map(([key, config]) => (
                          <option key={key} value={key}>{config.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Category and Priority */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                        Category
                      </label>
                      <select
                        value={newIdea.category}
                        onChange={(e) => setNewIdea(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3 py-2 bg-[var(--surface-tertiary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)]"
                      >
                        {Object.keys(CATEGORY_CONFIG).map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                        Priority
                      </label>
                      <select
                        value={newIdea.priority}
                        onChange={(e) => setNewIdea(prev => ({ ...prev, priority: e.target.value as any }))}
                        className="w-full px-3 py-2 bg-[var(--surface-tertiary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)]"
                      >
                        {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
                          <option key={key} value={key}>{config.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                      Tags
                    </label>
                    <Input
                      value={newIdea.tags.join(', ')}
                      onChange={(e) => setNewIdea(prev => ({ 
                        ...prev, 
                        tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                      }))}
                      placeholder="Enter tags separated by commas..."
                      className="w-full"
                    />
                  </div>

                  {/* Target Audience */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                      Target Audience
                    </label>
                    <Input
                      value={newIdea.targetAudience}
                      onChange={(e) => setNewIdea(prev => ({ ...prev, targetAudience: e.target.value }))}
                      placeholder="Who is this content for?"
                      className="w-full"
                    />
                  </div>

                  {/* Estimated Time */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                      Estimated Time (minutes)
                    </label>
                    <Input
                      type="number"
                      value={newIdea.estimatedTime}
                      onChange={(e) => setNewIdea(prev => ({ ...prev, estimatedTime: parseInt(e.target.value) || 60 }))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-[var(--border-primary)] flex justify-end space-x-3">
                <Button variant="ghost" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleCreateIdea}>
                  {selectedIdea ? 'Update Idea' : 'Create Idea'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedContentIdeasBank;
