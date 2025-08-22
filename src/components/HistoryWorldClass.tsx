import React, { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Search,
  Filter,
  Download,
  Trash2,
  Star,
  Eye,
  Copy,
  Archive,
  Tags,
  Calendar,
  TrendingUp,
  BarChart3,
  FileText,
  Image,
  Video,
  Palette,
  MessageSquare,
  RefreshCw,
  SortAsc,
  Grid,
  List,
  Bookmark,
  FolderOpen,
  Plus,
  Settings,
  Layers,
  Share2,
  Send,
  Sparkles,
  Zap,
  AlertTriangle,
  CheckCircle,
  Folder,
  FolderPlus,
  GitBranch,
  ExternalLink,
  ArrowRight,
  Hash,
  Target,
  Users,
  Brain,
  Globe,
  Smartphone,
  MonitorPlay,
  Edit3,
  X,
  ChevronDown,
  ChevronRight,
  Activity,
} from "lucide-react";

// Import our world-class components
import {
  Button,
  Card,
  Input,
  Badge,
  EmptyState,
  TabHeader,
  GradientText,
  ProgressBar,
  StatCard,
  QuickActionCard,
} from "./ui/WorldClassComponents";

// Import the rating component
import RatingButtons from "./ui/RatingButtons";

// Import services
import {
  enhancedHistoryService,
  EnhancedHistoryItem,
  SmartFolder,
  CustomCollection,
  DuplicateGroup
} from "../services/enhancedHistoryService";
import { crossTabSyncService, TabContentEvent } from "../services/crossTabSyncService";

interface HistoryItem {
  id: string;
  title: string;
  type: 'text' | 'image' | 'video' | 'analytics' | 'strategy';
  content: string;
  platform: string;
  timestamp: Date | number;
  tags: string[];
  starred: boolean;
  views?: number;
  performance?: number;
  thumbnail?: string;
  rating?: 1 | -1 | 0;
  userInput?: string;
}

interface HistoryWorldClassProps {
  historyItems?: HistoryItem[];
  onViewItem?: (item: HistoryItem) => void;
  onDeleteItem?: (itemId: string) => void;
  onStarItem?: (itemId: string) => void;
  onExportItems?: (items: HistoryItem[]) => void;
  onSendToCanvas?: (item: HistoryItem) => void;
  onSendToCalendar?: (item: HistoryItem) => void;
  onSendToGenerator?: (item: HistoryItem) => void;
  onNavigateToTab?: (tabId: string) => void;
  updateItemRating?: (itemId: string, rating: 1 | -1 | 0) => void;
}

const HistoryWorldClass: React.FC<HistoryWorldClassProps> = ({
  historyItems = [],
  onViewItem,
  onDeleteItem,
  onStarItem,
  onExportItems,
  onSendToCanvas,
  onSendToCalendar,
  onSendToGenerator,
  onNavigateToTab,
  updateItemRating,
}) => {
  // Enhanced State
  const [enhancedItems, setEnhancedItems] = useState<EnhancedHistoryItem[]>([]);
  const [smartFolders, setSmartFolders] = useState<SmartFolder[]>([]);
  const [customCollections, setCustomCollections] = useState<CustomCollection[]>([]);
  const [duplicateGroups, setDuplicateGroups] = useState<DuplicateGroup[]>([]);
  const [recentActivity, setRecentActivity] = useState<TabContentEvent[]>([]);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const [selectedFolder, setSelectedFolder] = useState<string>("all");
  const [selectedCollection, setSelectedCollection] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showDuplicates, setShowDuplicates] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // UI State
  const [showFilters, setShowFilters] = useState(false);
  const [showSmartFolders, setShowSmartFolders] = useState(true);
  const [showCollections, setShowCollections] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const loadEnhancedData = async () => {
    setIsLoading(true);
    try {
      const [items, folders, collections] = await Promise.all([
        enhancedHistoryService.getEnhancedHistory(),
        enhancedHistoryService.getSmartFolders(),
        enhancedHistoryService.getCustomCollections(),
      ]);

      setEnhancedItems(items);
      setSmartFolders(folders);
      setCustomCollections(collections);
      setRecentActivity(crossTabSyncService.getRecentActivity());
    } catch (error) {
      console.error('Error loading enhanced history data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const migrateHistoryItems = async () => {
    try {
      const currentEnhanced = await enhancedHistoryService.getEnhancedHistory();

      for (const item of historyItems) {
        const existing = currentEnhanced.find(e => e.id === item.id);
        if (!existing) {
          await enhancedHistoryService.addHistoryItem(item);
        }
      }

      // Reload data after migration
      await loadEnhancedData();
    } catch (error) {
      console.error('Error migrating history items:', error);
    }
  };

  const setupRealtimeSync = useCallback(() => {
    try {
      // Subscribe to history changes
      const unsubscribeHistory = enhancedHistoryService.subscribe((items) => {
        // Deduplicate items before setting state
        const uniqueItems = items.reduce((acc, item) => {
          if (!acc.find(existing => existing.id === item.id)) {
            acc.push(item);
          }
          return acc;
        }, [] as EnhancedHistoryItem[]);

        setEnhancedItems(uniqueItems);
      });

      // Subscribe to cross-tab events
      const unsubscribeSync = crossTabSyncService.subscribe('*', (event) => {
        setRecentActivity(prev => {
          // Prevent duplicate events
          if (prev.find(e => e.id === event.id)) return prev;
          return [event, ...prev.slice(0, 9)];
        });
      });

      return () => {
        try {
          unsubscribeHistory();
          unsubscribeSync();
        } catch (error) {
          console.error('Error during sync cleanup:', error);
        }
      };
    } catch (error) {
      console.error('Error setting up real-time sync:', error);
      return () => {}; // Return empty cleanup function
    }
  }, []);

  // Load enhanced data on mount and when historyItems change
  useEffect(() => {
    loadEnhancedData();
    const cleanup = setupRealtimeSync();

    return cleanup;
  }, []);

  useEffect(() => {
    // Convert legacy historyItems to enhanced format
    if (historyItems.length > 0) {
      migrateHistoryItems();
    }
  }, [historyItems]);

  // Filter and sort enhanced items with deduplication
  const filteredItems = useMemo(() => {
    // First deduplicate items by ID to prevent React key conflicts
    const uniqueItems = enhancedItems.reduce((acc, item) => {
      const existingIndex = acc.findIndex(existing => existing.id === item.id);
      if (existingIndex === -1) {
        acc.push(item);
      } else {
        // Keep the most recent version (higher timestamp)
        if (new Date(item.timestamp).getTime() > new Date(acc[existingIndex].timestamp).getTime()) {
          acc[existingIndex] = item;
        }
      }
      return acc;
    }, [] as EnhancedHistoryItem[]);

    let filtered = uniqueItems.filter(item => {
      // Search filter
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
                           item.aiTags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      // Type filter
      const matchesType = selectedType === "all" || item.type === selectedType;

      // Platform filter
      const matchesPlatform = selectedPlatform === "all" || item.platform === selectedPlatform;

      // Folder filter
      const matchesFolder = selectedFolder === "all" ||
                           (selectedFolder === "unorganized" && (!item.smartFolders || item.smartFolders.length === 0)) ||
                           (item.smartFolders && item.smartFolders.includes(selectedFolder));

      // Collection filter
      const matchesCollection = selectedCollection === "all" ||
                               (item.collections && item.collections.includes(selectedCollection));

      // Duplicates filter
      const matchesDuplicates = !showDuplicates || item.duplicateGroupId;

      return matchesSearch && matchesType && matchesPlatform && matchesFolder && matchesCollection && matchesDuplicates;
    });

    // Sort items
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        break;
      case "performance":
        filtered.sort((a, b) => (b.analyticsData?.performance || b.performance || 0) - (a.analyticsData?.performance || a.performance || 0));
        break;
      case "views":
        filtered.sort((a, b) => (b.analyticsData?.views || b.views || 0) - (a.analyticsData?.views || a.views || 0));
        break;
      case "alphabetical":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return filtered;
  }, [enhancedItems, searchQuery, selectedType, selectedPlatform, selectedFolder, selectedCollection, sortBy, showDuplicates]);

  // Smart folder stats
  const folderStats = useMemo(() => {
    return smartFolders.map(folder => ({
      ...folder,
      itemCount: enhancedItems.filter(item =>
        item.smartFolders && item.smartFolders.includes(folder.id)
      ).length,
    }));
  }, [smartFolders, enhancedItems]);

  // Collection stats
  const collectionStats = useMemo(() => {
    return customCollections.map(collection => ({
      ...collection,
      itemCount: (collection.items || []).length,
    }));
  }, [customCollections]);

  // Enhanced Actions
  const handleSendToCanvas = async (item: EnhancedHistoryItem) => {
    try {
      await crossTabSyncService.sendToCanvas(item.id);
      await enhancedHistoryService.updateHistoryItem(item.id, { sentToCanvas: true });

      if (onSendToCanvas) {
        onSendToCanvas(item);
      }
    } catch (error) {
      console.error('Error sending to canvas:', error);
    }
  };

  const handleSendToCalendar = async (item: EnhancedHistoryItem) => {
    try {
      await crossTabSyncService.sendToCalendar({
        title: item.title,
        content: item.content,
        platform: item.platform,
      });

      if (onSendToCalendar) {
        onSendToCalendar(item);
      }
    } catch (error) {
      console.error('Error sending to calendar:', error);
    }
  };

  const handleSendToGenerator = async (item: EnhancedHistoryItem) => {
    try {
      await crossTabSyncService.sendToGenerator(item.content, item.type);

      if (onSendToGenerator) {
        onSendToGenerator(item);
      }
    } catch (error) {
      console.error('Error sending to generator:', error);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await enhancedHistoryService.deleteHistoryItem(itemId);
      if (onDeleteItem) {
        onDeleteItem(itemId);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleStarItem = async (itemId: string) => {
    try {
      const item = enhancedItems.find(i => i.id === itemId);
      if (item) {
        await enhancedHistoryService.updateHistoryItem(itemId, { starred: !item.starred });
        if (onStarItem) {
          onStarItem(itemId);
        }
      }
    } catch (error) {
      console.error('Error starring item:', error);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "text": return <FileText className="w-4 h-4" />;
      case "image": return <Image className="w-4 h-4" />;
      case "video": return <Video className="w-4 h-4" />;
      case "analytics": return <BarChart3 className="w-4 h-4" />;
      case "strategy": return <Palette className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "text": return "var(--brand-primary)";
      case "image": return "var(--brand-secondary)";
      case "video": return "#ef4444";
      case "analytics": return "var(--accent-cyan)";
      case "strategy": return "var(--color-success)";
      default: return "var(--text-tertiary)";
    }
  };

  const formatTimeAgo = (date: Date | number) => {
    const now = new Date();
    const targetDate = typeof date === 'number' ? new Date(date) : date;
    const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return targetDate.toLocaleDateString();
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const selectAllItems = () => {
    setSelectedItems(filteredItems.map(item => item.id));
  };

  const clearSelection = () => {
    setSelectedItems([]);
  };

  if (filteredItems.length === 0 && searchQuery === "" && selectedType === "all") {
    return (
      <div className="space-y-8">
        <TabHeader
          title="Content History"
          subtitle="Your AI-powered creative library"
          icon={<Sparkles />}
          badge="Smart Organization"
        />

        <div className="flex flex-col items-center justify-center min-h-[500px] space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-6 max-w-2xl">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] opacity-20 blur-3xl rounded-full"></div>
              <div className="relative p-6 rounded-full bg-gradient-to-br from-[var(--brand-primary)]20 to-[var(--brand-secondary)]20 border border-[var(--brand-primary)]30 w-fit mx-auto">
                <Archive className="w-16 h-16 text-[var(--brand-primary)]" />
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] bg-clip-text text-transparent">
                Your Creative Journey Starts Here
              </h1>
              <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                Create amazing content and watch it organize itself intelligently. Every piece will be tagged, categorized, and ready for reuse across all your projects.
              </p>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={() => onNavigateToTab?.('generator')}
              className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] hover:shadow-lg hover:shadow-[var(--brand-primary)]30 transition-all duration-300"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Create Your First Content
            </Button>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
            <Card variant="hover" className="text-center p-8 bg-gradient-to-br from-[var(--surface-secondary)] to-[var(--surface-tertiary)] border border-[var(--border-primary)] hover:border-[var(--brand-primary)]30 transition-all duration-300">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-[var(--brand-primary)] opacity-20 blur-xl rounded-full"></div>
                <div className="relative p-4 rounded-2xl bg-gradient-to-br from-[var(--brand-primary)]20 to-[var(--brand-primary)]10 border border-[var(--brand-primary)]30 mx-auto w-fit">
                  <Brain className="w-8 h-8 text-[var(--brand-primary)]" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[var(--text-primary)]">AI Smart Folders</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Content auto-organizes by themes, performance, and topics using advanced AI analysis
              </p>
            </Card>

            <Card variant="hover" className="text-center p-8 bg-gradient-to-br from-[var(--surface-secondary)] to-[var(--surface-tertiary)] border border-[var(--border-primary)] hover:border-[var(--color-success)]30 transition-all duration-300">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-[var(--color-success)] opacity-20 blur-xl rounded-full"></div>
                <div className="relative p-4 rounded-2xl bg-gradient-to-br from-[var(--color-success)]20 to-[var(--color-success)]10 border border-[var(--color-success)]30 mx-auto w-fit">
                  <Zap className="w-8 h-8 text-[var(--color-success)]" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[var(--text-primary)]">Real-time Sync</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Seamless updates across all tabs and creative tools for instant collaboration
              </p>
            </Card>

            <Card variant="hover" className="text-center p-8 bg-gradient-to-br from-[var(--surface-secondary)] to-[var(--surface-tertiary)] border border-[var(--border-primary)] hover:border-[var(--brand-secondary)]30 transition-all duration-300">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-[var(--brand-secondary)] opacity-20 blur-xl rounded-full"></div>
                <div className="relative p-4 rounded-2xl bg-gradient-to-br from-[var(--brand-secondary)]20 to-[var(--brand-secondary)]10 border border-[var(--brand-secondary)]30 mx-auto w-fit">
                  <Send className="w-8 h-8 text-[var(--brand-secondary)]" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[var(--text-primary)]">Send to Canvas</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                One-click content transfer to design tools for immediate visualization
              </p>
            </Card>
          </div>

          {/* Additional Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl">
            <div className="text-center space-y-3">
              <div className="p-3 rounded-xl bg-[var(--accent-cyan)]20 text-[var(--accent-cyan)] mx-auto w-fit">
                <BarChart3 className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-[var(--text-primary)]">Performance Analytics</p>
            </div>

            <div className="text-center space-y-3">
              <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400 mx-auto w-fit">
                <Layers className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-[var(--text-primary)]">Custom Collections</p>
            </div>

            <div className="text-center space-y-3">
              <div className="p-3 rounded-xl bg-orange-500/20 text-orange-400 mx-auto w-fit">
                <GitBranch className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-[var(--text-primary)]">Duplicate Detection</p>
            </div>

            <div className="text-center space-y-3">
              <div className="p-3 rounded-xl bg-pink-500/20 text-pink-400 mx-auto w-fit">
                <Calendar className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-[var(--text-primary)]">Content Scheduling</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[var(--brand-primary)]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <TabHeader
        title="Content History"
        subtitle={`${filteredItems.length} items • ${folderStats.reduce((acc, f) => acc + f.itemCount, 0)} organized • ${enhancedItems.filter(i => i.starred).length} starred`}
        icon={<Sparkles />}
        badge={`${recentActivity.length} recent updates`}
        actions={
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            >
              {viewMode === "grid" ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={selectedItems.length === 0}
              onClick={() => onExportItems?.(filteredItems.filter(item => selectedItems.includes(item.id)))}
            >
              <Download className="w-4 h-4" />
              Export ({selectedItems.length})
            </Button>
          </div>
        }
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Content"
          value={enhancedItems.length.toString()}
          subtitle="pieces created"
          icon={<FileText />}
          trend={12}
        />
        <StatCard
          title="Smart Folders"
          value={folderStats.length.toString()}
          subtitle="auto-organizing"
          icon={<FolderOpen />}
          trend={8}
        />
        <StatCard
          title="Collections"
          value={collectionStats.length.toString()}
          subtitle="custom groups"
          icon={<Layers />}
          trend={5}
        />
        <StatCard
          title="Canvas Sent"
          value={enhancedItems.filter(i => i.sentToCanvas).length.toString()}
          subtitle="items transferred"
          icon={<Send />}
          trend={15}
        />
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search content, tags, or AI insights..."
                value={searchQuery}
                onChange={setSearchQuery}
                icon={<Search className="w-4 h-4" />}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4" />
                Filters
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowDuplicates(!showDuplicates)}
                className={showDuplicates ? "bg-yellow-500/20 text-yellow-400" : ""}
              >
                <GitBranch className="w-4 h-4" />
                Duplicates
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-1 sm:grid-cols-5 gap-4 pt-4 border-t border-[var(--border-primary)]"
              >
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Content Type
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="input-base"
                  >
                    <option value="all">All Types</option>
                    <option value="text">Text Content</option>
                    <option value="image">Images</option>
                    <option value="video">Videos</option>
                    <option value="analytics">Analytics</option>
                    <option value="strategy">Strategy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Platform
                  </label>
                  <select
                    value={selectedPlatform}
                    onChange={(e) => setSelectedPlatform(e.target.value)}
                    className="input-base"
                  >
                    <option value="all">All Platforms</option>
                    <option value="YouTube">YouTube</option>
                    <option value="Instagram">Instagram</option>
                    <option value="TikTok">TikTok</option>
                    <option value="Multi-Platform">Multi-Platform</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Smart Folder
                  </label>
                  <select
                    value={selectedFolder}
                    onChange={(e) => setSelectedFolder(e.target.value)}
                    className="input-base"
                  >
                    <option value="all">All Folders</option>
                    <option value="unorganized">Unorganized</option>
                    {folderStats.map(folder => (
                      <option key={folder.id} value={folder.id}>
                        {folder.name} ({folder.itemCount})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Collection
                  </label>
                  <select
                    value={selectedCollection}
                    onChange={(e) => setSelectedCollection(e.target.value)}
                    className="input-base"
                  >
                    <option value="all">All Collections</option>
                    {collectionStats.map(collection => (
                      <option key={collection.id} value={collection.id}>
                        {collection.name} ({collection.itemCount})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="input-base"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="performance">Performance</option>
                    <option value="views">Most Views</option>
                    <option value="alphabetical">A-Z</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-4 bg-[var(--brand-primary)]20 border border-[var(--brand-primary)]30 rounded-xl"
        >
          <div className="flex items-center space-x-4">
            <span className="font-medium text-[var(--text-primary)]">
              {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
            </span>
            <button
              onClick={clearSelection}
              className="text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
            >
              Clear selection
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Archive className="w-4 h-4" />
              Archive
            </Button>
            <Button variant="ghost" size="sm">
              <Star className="w-4 h-4" />
              Star
            </Button>
            <Button variant="ghost" size="sm">
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </motion.div>
      )}

      {/* Content Grid/List */}
      <div className={
        viewMode === "grid" 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "space-y-4"
      }>
        {filteredItems.map((item, index) => (
          <motion.div
            key={`history-item-${item.id}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card 
              variant="hover"
              className={`relative cursor-pointer ${
                selectedItems.includes(item.id) 
                  ? "ring-2 ring-[var(--brand-primary)] bg-[var(--brand-primary)]10" 
                  : ""
              }`}
              onClick={() => onViewItem?.(item)}
            >
              {/* Selection Checkbox */}
              <div className="absolute top-4 left-4 z-10">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={(e) => {
                    e.stopPropagation();
                    toggleItemSelection(item.id);
                  }}
                  className="w-4 h-4 rounded border-[var(--border-primary)] bg-[var(--surface-tertiary)]"
                />
              </div>

              {/* Star Button */}
              <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
                <span className="text-xs text-[var(--text-tertiary)] bg-[var(--surface-tertiary)] px-2 py-1 rounded-md whitespace-nowrap">
                  Generator • {item.type === 'text' ? 'Content Idea' :
                             item.type === 'image' ? 'Image Idea' :
                             item.type === 'video' ? 'Video Idea' :
                             item.type === 'analytics' ? 'Analytics' :
                             item.type === 'strategy' ? 'Strategy' :
                             item.type.charAt(0).toUpperCase() + item.type.slice(1)} • {item.platform}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStarItem?.(item.id);
                  }}
                  className={`p-1.5 rounded-lg transition-colors ${
                    item.starred
                      ? "text-yellow-400 bg-yellow-400/20"
                      : "text-[var(--text-tertiary)] hover:text-yellow-400 hover:bg-yellow-400/20"
                  }`}
                >
                  <Star className="w-4 h-4" fill={item.starred ? "currentColor" : "none"} />
                </button>
              </div>

              <div className="pt-8">
                {/* Type Icon and Platform */}
                <div className="flex items-center justify-between mb-3">
                  <div 
                    className="p-2 rounded-lg flex items-center space-x-2"
                    style={{ backgroundColor: `${getTypeColor(item.type)}20`, color: getTypeColor(item.type) }}
                  >
                    {getTypeIcon(item.type)}
                    <span className="text-sm font-medium capitalize">{item.type}</span>
                  </div>
                  <Badge variant="neutral">{item.platform}</Badge>
                </div>

                {/* Title and Content */}
                <h3 className="heading-4 mb-2 line-clamp-2">
                  {item.type === 'text' ? 'Content Idea' :
                   item.type === 'image' ? 'Image Idea' :
                   item.type === 'video' ? 'Video Idea' :
                   item.type === 'analytics' ? 'Analytics' :
                   item.type === 'strategy' ? 'Strategy' :
                   item.type.charAt(0).toUpperCase() + item.type.slice(1)} for {item.platform}
                </h3>
                <p className="body-sm mb-4 line-clamp-3">{item.content}</p>

                {/* Tags */}
                {item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {item.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs bg-[var(--surface-tertiary)] text-[var(--text-tertiary)] rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                    {item.tags.length > 3 && (
                      <span className="px-2 py-1 text-xs text-[var(--text-tertiary)]">
                        +{item.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* AI Tags */}
                {item.aiTags && item.aiTags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    <Sparkles className="w-3 h-3 text-[var(--brand-primary)] mr-1" />
                    {item.aiTags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs bg-[var(--brand-primary)]20 text-[var(--brand-primary)] rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}


                {/* Action Buttons */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSendToCanvas(item);
                      }}
                      className="text-[var(--brand-primary)] hover:bg-[var(--brand-primary)]20"
                    >
                      <Send className="w-4 h-4" />
                      Canvas
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSendToCalendar(item);
                      }}
                    >
                      <Calendar className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSendToGenerator(item);
                      }}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Rating Buttons */}
                    {updateItemRating && (
                      <div onClick={(e) => e.stopPropagation()}>
                        <RatingButtons
                          rating={item.rating}
                          onRating={(rating) => updateItemRating(item.id, rating)}
                          size="sm"
                          showTooltip={true}
                        />
                      </div>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(item.content);
                      }}
                      className="p-1 hover:bg-[var(--surface-tertiary)] rounded"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteItem(item.id);
                      }}
                      className="p-1 hover:bg-red-500/20 hover:text-red-400 rounded"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)]">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatTimeAgo(item.timestamp)}</span>
                    </span>
                    {item.sentToCanvas && (
                      <span className="flex items-center space-x-1 text-[var(--brand-primary)]">
                        <Send className="w-3 h-3" />
                        <span>Canvas</span>
                      </span>
                    )}
                  </div>

                  {/* Smart Folder Indicators */}
                  <div className="flex items-center space-x-1">
                    {item.smartFolders?.slice(0, 2).map(folderId => {
                      const folder = smartFolders.find(f => f.id === folderId);
                      return folder ? (
                        <div
                          key={folderId}
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: folder.color }}
                          title={folder.name}
                        />
                      ) : null;
                    })}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Load More Button */}
      {filteredItems.length >= 20 && (
        <div className="text-center">
          <Button variant="ghost">
            <RefreshCw className="w-4 h-4" />
            Load More Items
          </Button>
        </div>
      )}
    </div>
  );
};

export default HistoryWorldClass;
