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
} from "lucide-react";

// Import the rating component
import RatingButtons from "./ui/RatingButtons";

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

// Import services
import { 
  enhancedHistoryService, 
  EnhancedHistoryItem, 
  SmartFolder, 
  CustomCollection, 
  DuplicateGroup 
} from "../services/enhancedHistoryService";
import { crossTabSyncService, TabContentEvent } from "../services/crossTabSyncService";

interface EnhancedHistoryWorldClassProps {
  onViewItem?: (item: EnhancedHistoryItem) => void;
  onDeleteItem?: (itemId: string) => void;
  onStarItem?: (itemId: string) => void;
  onExportItems?: (items: EnhancedHistoryItem[]) => void;
  onSendToCanvas?: (item: EnhancedHistoryItem) => void;
  onSendToCalendar?: (item: EnhancedHistoryItem) => void;
  onSendToGenerator?: (item: EnhancedHistoryItem) => void;
}

const EnhancedHistoryWorldClass: React.FC<EnhancedHistoryWorldClassProps> = ({
  onViewItem,
  onDeleteItem,
  onStarItem,
  onExportItems,
  onSendToCanvas,
  onSendToCalendar,
  onSendToGenerator,
}) => {
  // State
  const [historyItems, setHistoryItems] = useState<EnhancedHistoryItem[]>([]);
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
  const [isLoading, setIsLoading] = useState(true);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [showNewCollectionModal, setShowNewCollectionModal] = useState(false);

  // Load data on mount
  useEffect(() => {
    loadData();
    setupRealtimeSync();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [items, folders, collections] = await Promise.all([
        enhancedHistoryService.getEnhancedHistory(),
        enhancedHistoryService.getSmartFolders(),
        enhancedHistoryService.getCustomCollections(),
      ]);
      
      setHistoryItems(items);
      setSmartFolders(folders);
      setCustomCollections(collections);
      setRecentActivity(crossTabSyncService.getRecentActivity());
    } catch (error) {
      console.error('Error loading history data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setupRealtimeSync = () => {
    // Subscribe to history changes
    const unsubscribeHistory = enhancedHistoryService.subscribe((items) => {
      setHistoryItems(items);
    });

    // Subscribe to cross-tab events
    const unsubscribeSync = crossTabSyncService.subscribe('*', (event) => {
      setRecentActivity(prev => [event, ...prev.slice(0, 9)]);
    });

    return () => {
      unsubscribeHistory();
      unsubscribeSync();
    };
  };

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let filtered = historyItems.filter(item => {
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
                           (selectedFolder === "unorganized" && item.smartFolders.length === 0) ||
                           item.smartFolders.includes(selectedFolder);
      
      // Collection filter
      const matchesCollection = selectedCollection === "all" || 
                               item.collections.includes(selectedCollection);
      
      // Duplicates filter
      const matchesDuplicates = !showDuplicates || item.duplicateGroupId;
      
      return matchesSearch && matchesType && matchesPlatform && matchesFolder && matchesCollection && matchesDuplicates;
    });

    // Sort items
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        break;
      case "oldest":
        filtered.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
        break;
      case "performance":
        filtered.sort((a, b) => (b.analyticsData?.performance || 0) - (a.analyticsData?.performance || 0));
        break;
      case "views":
        filtered.sort((a, b) => (b.analyticsData?.views || 0) - (a.analyticsData?.views || 0));
        break;
      case "alphabetical":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return filtered;
  }, [historyItems, searchQuery, selectedType, selectedPlatform, selectedFolder, selectedCollection, sortBy, showDuplicates]);

  // Smart folder stats
  const folderStats = useMemo(() => {
    return smartFolders.map(folder => ({
      ...folder,
      itemCount: historyItems.filter(item => item.smartFolders.includes(folder.id)).length,
    }));
  }, [smartFolders, historyItems]);

  // Collection stats
  const collectionStats = useMemo(() => {
    return customCollections.map(collection => ({
      ...collection,
      itemCount: collection.items.length,
    }));
  }, [customCollections]);

  // Actions
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

  const handleRating = async (itemId: string, rating: 1 | -1 | 0) => {
    try {
      await enhancedHistoryService.updateRating(itemId, rating);
      // Update local state to reflect the change immediately
      setHistoryItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId ? { ...item, rating } : item
        )
      );
    } catch (error) {
      console.error('Error updating rating:', error);
    }
  };

  const handleStarItem = async (itemId: string) => {
    try {
      const item = historyItems.find(i => i.id === itemId);
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

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const clearSelection = () => {
    setSelectedItems([]);
  };

  const handleBulkAction = async (action: string) => {
    const selectedItemsData = filteredItems.filter(item => selectedItems.includes(item.id));
    
    switch (action) {
      case 'delete':
        for (const item of selectedItemsData) {
          await handleDeleteItem(item.id);
        }
        break;
      case 'star':
        for (const item of selectedItemsData) {
          await enhancedHistoryService.updateHistoryItem(item.id, { starred: true });
        }
        break;
      case 'export':
        if (onExportItems) {
          onExportItems(selectedItemsData);
        }
        break;
    }
    
    clearSelection();
  };

  // Helper functions
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

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[var(--brand-primary)]"></div>
      </div>
    );
  }

  if (filteredItems.length === 0 && searchQuery === "" && selectedType === "all") {
    return (
      <div className="space-y-8">
        <TabHeader
          title="Enhanced Content History"
          subtitle="Your AI-powered creative library"
          icon={<Sparkles />}
          badge="Smart Organization"
        />

        <EmptyState
          icon={<Archive />}
          title="Your Creative Journey Starts Here"
          description="Create amazing content and watch it organize itself intelligently. Every piece will be tagged, categorized, and ready for reuse across all your projects."
          actionLabel="Create Your First Content"
          onAction={() => {}}
        />

        {/* Feature Preview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="hover" className="text-center">
            <div className="p-3 rounded-xl bg-[var(--brand-primary)]20 text-[var(--brand-primary)] mx-auto w-fit mb-4">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="heading-4 mb-2">AI Smart Folders</h3>
            <p className="body-sm">
              Content auto-organizes by themes, performance, and topics
            </p>
          </Card>
          
          <Card variant="hover" className="text-center">
            <div className="p-3 rounded-xl bg-[var(--color-success)]20 text-[var(--color-success)] mx-auto w-fit mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="heading-4 mb-2">Real-time Sync</h3>
            <p className="body-sm">
              Seamless updates across all tabs and creative tools
            </p>
          </Card>
          
          <Card variant="hover" className="text-center">
            <div className="p-3 rounded-xl bg-[var(--brand-secondary)]20 text-[var(--brand-secondary)] mx-auto w-fit mb-4">
              <Send className="w-6 h-6" />
            </div>
            <h3 className="heading-4 mb-2">Send to Canvas</h3>
            <p className="body-sm">
              One-click content transfer to design tools
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <TabHeader
        title="Enhanced Content History"
        subtitle={`${filteredItems.length} items • ${folderStats.reduce((acc, f) => acc + f.itemCount, 0)} organized • ${historyItems.filter(i => i.starred).length} starred`}
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
              onClick={() => handleBulkAction('export')}
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
          value={historyItems.length.toString()}
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
          value={historyItems.filter(i => i.sentToCanvas).length.toString()}
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

      {/* Sidebar with Smart Folders and Collections */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          {/* Smart Folders */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-[var(--brand-primary)]" />
                <h3 className="heading-5">Smart Folders</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSmartFolders(!showSmartFolders)}
              >
                {showSmartFolders ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </Button>
            </div>
            
            <AnimatePresence>
              {showSmartFolders && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  {folderStats.map(folder => (
                    <button
                      key={folder.id}
                      onClick={() => setSelectedFolder(folder.id)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors ${
                        selectedFolder === folder.id 
                          ? "bg-[var(--brand-primary)]20 text-[var(--brand-primary)]"
                          : "hover:bg-[var(--surface-tertiary)]"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: folder.color }}
                        />
                        <span className="text-sm">{folder.name}</span>
                      </div>
                      <Badge variant="neutral" size="sm">{folder.itemCount}</Badge>
                    </button>
                  ))}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => setShowNewFolderModal(true)}
                  >
                    <FolderPlus className="w-4 h-4" />
                    New Folder
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* Custom Collections */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Layers className="w-5 h-5 text-[var(--brand-secondary)]" />
                <h3 className="heading-5">Collections</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCollections(!showCollections)}
              >
                {showCollections ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </Button>
            </div>
            
            <AnimatePresence>
              {showCollections && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  {collectionStats.map(collection => (
                    <button
                      key={collection.id}
                      onClick={() => setSelectedCollection(collection.id)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors ${
                        selectedCollection === collection.id 
                          ? "bg-[var(--brand-secondary)]20 text-[var(--brand-secondary)]"
                          : "hover:bg-[var(--surface-tertiary)]"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: collection.color }}
                        />
                        <span className="text-sm">{collection.name}</span>
                      </div>
                      <Badge variant="neutral" size="sm">{collection.itemCount}</Badge>
                    </button>
                  ))}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => setShowNewCollectionModal(true)}
                  >
                    <Plus className="w-4 h-4" />
                    New Collection
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* Recent Activity */}
          <Card>
            <div className="flex items-center space-x-2 mb-4">
              <Activity className="w-5 h-5 text-[var(--accent-cyan)]" />
              <h3 className="heading-5">Recent Activity</h3>
            </div>
            
            <div className="space-y-2">
              {recentActivity.slice(0, 5).map(event => (
                <div key={event.id} className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-[var(--accent-cyan)] rounded-full" />
                  <span className="text-[var(--text-tertiary)]">
                    {event.type.replace('_', ' ')} • {formatTimeAgo(new Date(event.timestamp))}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          {/* Bulk Actions */}
          {selectedItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-4 bg-[var(--brand-primary)]20 border border-[var(--brand-primary)]30 rounded-xl mb-6"
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
                <Button variant="ghost" size="sm" onClick={() => handleBulkAction('star')}>
                  <Star className="w-4 h-4" />
                  Star
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleBulkAction('export')}>
                  <Download className="w-4 h-4" />
                  Export
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleBulkAction('delete')}>
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </motion.div>
          )}

          {/* Content Grid/List */}
          <div className={
            viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 gap-6"
              : "space-y-4"
          }>
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
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
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStarItem(item.id);
                    }}
                    className={`absolute top-4 right-4 z-10 p-1 rounded-lg transition-colors ${
                      item.starred 
                        ? "text-yellow-400 bg-yellow-400/20" 
                        : "text-[var(--text-tertiary)] hover:text-yellow-400 hover:bg-yellow-400/20"
                    }`}
                  >
                    <Star className="w-4 h-4" fill={item.starred ? "currentColor" : "none"} />
                  </button>

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
                      <div className="flex items-center space-x-2">
                        <Badge variant="neutral">{item.platform}</Badge>
                        {item.sentToCanvas && (
                          <Badge variant="success" size="sm">
                            <Send className="w-3 h-3" />
                            Canvas
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Title and Content */}
                    <h3 className="heading-4 mb-2 line-clamp-2">{item.title}</h3>
                    <p className="body-sm mb-4 line-clamp-3">{item.content}</p>

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

                    {/* Regular Tags */}
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

                    {/* Performance Metrics */}
                    {item.analyticsData?.performance && (
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-[var(--text-tertiary)]">Performance</span>
                          <span className="text-xs font-medium text-[var(--text-primary)]">{item.analyticsData.performance}%</span>
                        </div>
                        <ProgressBar 
                          value={item.analyticsData.performance} 
                          size="sm"
                          color={
                            item.analyticsData.performance >= 80 ? "var(--color-success)" :
                            item.analyticsData.performance >= 60 ? "var(--color-warning)" :
                            "var(--color-error)"
                          }
                        />
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
                        <div onClick={(e) => e.stopPropagation()}>
                          <RatingButtons
                            rating={item.rating}
                            onRating={(rating) => handleRating(item.id, rating)}
                            size="sm"
                          />
                        </div>

                        <div className="flex items-center space-x-1">
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
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)]">
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatTimeAgo(item.timestamp)}</span>
                        </span>
                        {item.analyticsData?.views && (
                          <span className="flex items-center space-x-1">
                            <Eye className="w-3 h-3" />
                            <span>{item.analyticsData.views}</span>
                          </span>
                        )}
                      </div>
                      
                      {/* Smart Folder Indicators */}
                      <div className="flex items-center space-x-1">
                        {item.smartFolders.slice(0, 2).map(folderId => {
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
            <div className="text-center mt-8">
              <Button variant="ghost">
                <RefreshCw className="w-4 h-4" />
                Load More Items
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedHistoryWorldClass;
