import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  BellRing,
  CheckCircle,
  AlertCircle,
  Info,
  TrendingUp,
  Zap,
  Star,
  Heart,
  MessageSquare,
  Users,
  Calendar,
  DollarSign,
  Shield,
  Settings,
  X,
  Archive,
  MarkAsUnread,
  Filter,
  Search,
  Eye,
  EyeOff,
  MoreHorizontal,
  ChevronDown,
  Clock,
  Pin,
  Share2,
  ExternalLink,
  Volume2,
  VolumeX,
  Smartphone
} from "lucide-react";
import { Button, Card, Badge } from "../ui/WorldClassComponents";

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'trend' | 'achievement' | 'social' | 'system' | 'reminder';
  category: 'content' | 'analytics' | 'social' | 'system' | 'monetization' | 'achievements';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  pinned: boolean;
  archived: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl?: string;
  actionLabel?: string;
  avatar?: string;
  metadata?: {
    views?: number;
    engagement?: number;
    revenue?: number;
    platform?: string;
    user?: string;
  };
}

interface NotificationGroup {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  notifications: Notification[];
  enabled: boolean;
  sound: boolean;
  push: boolean;
}

interface NotificationsProProps {
  onNotificationAction?: (notification: Notification) => void;
  onMarkAllRead?: () => void;
  onSettingsChange?: (settings: any) => void;
}

const NotificationsPro: React.FC<NotificationsProProps> = ({
  onNotificationAction,
  onMarkAllRead,
  onSettingsChange
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    // Mock notifications commented out for clean user experience
    /*
    {
      id: '1',
      type: 'success',
      category: 'content',
      title: 'Video Performance',
      message: 'Your latest video gained 15K views in 24 hours! 🚀',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
      pinned: true,
      archived: false,
      priority: 'high',
      actionUrl: '/analytics',
      actionLabel: 'View Analytics',
      metadata: { views: 15000, platform: 'YouTube' }
    },
    {
      id: '2',
      type: 'trend',
      category: 'analytics',
      title: 'Trending Topic',
      message: '"AI productivity" is trending +156% this week',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      read: false,
      pinned: false,
      archived: false,
      priority: 'medium',
      actionLabel: 'Explore Trend',
      metadata: { engagement: 156 }
    },
    {
      id: '3',
      type: 'achievement',
      category: 'achievements',
      title: 'Milestone Reached!',
      message: 'Congratulations! You\'ve reached 10K subscribers',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      read: true,
      pinned: false,
      archived: false,
      priority: 'high',
      actionLabel: 'Celebrate',
      metadata: { views: 10000 }
    },
    {
      id: '4',
      type: 'warning',
      category: 'system',
      title: 'Credits Low',
      message: 'You have 5 credits remaining. Consider upgrading to Pro.',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      read: true,
      pinned: false,
      archived: false,
      priority: 'medium',
      actionUrl: '/upgrade',
      actionLabel: 'Upgrade Now'
    },
    {
      id: '5',
      type: 'social',
      category: 'social',
      title: 'New Comment',
      message: 'Sarah Martinez commented on your video: "This is amazing!"',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      read: false,
      pinned: false,
      archived: false,
      priority: 'low',
      actionLabel: 'Reply',
      metadata: { user: 'Sarah Martinez' }
    },
    {
      id: '6',
      type: 'info',
      category: 'monetization',
      title: 'Revenue Update',
      message: 'Your monthly revenue increased by 23% this month',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      read: false,
      pinned: false,
      archived: false,
      priority: 'medium',
      actionLabel: 'View Report',
      metadata: { revenue: 23 }
    }
    */
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showSettings, setShowSettings] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'timestamp' | 'priority' | 'category'>('timestamp');
  const [viewMode, setViewMode] = useState<'compact' | 'detailed'>('detailed');

  const notificationGroups: NotificationGroup[] = [
    {
      id: 'content',
      name: 'Content',
      icon: <MessageSquare className="w-4 h-4" />,
      color: '#3b82f6',
      notifications: notifications.filter(n => n.category === 'content'),
      enabled: true,
      sound: true,
      push: true
    },
    {
      id: 'analytics',
      name: 'Analytics',
      icon: <TrendingUp className="w-4 h-4" />,
      color: '#10b981',
      notifications: notifications.filter(n => n.category === 'analytics'),
      enabled: true,
      sound: false,
      push: true
    },
    {
      id: 'social',
      name: 'Social',
      icon: <Users className="w-4 h-4" />,
      color: '#f59e0b',
      notifications: notifications.filter(n => n.category === 'social'),
      enabled: true,
      sound: true,
      push: false
    },
    {
      id: 'achievements',
      name: 'Achievements',
      icon: <Star className="w-4 h-4" />,
      color: '#8b5cf6',
      notifications: notifications.filter(n => n.category === 'achievements'),
      enabled: true,
      sound: true,
      push: true
    },
    {
      id: 'system',
      name: 'System',
      icon: <Settings className="w-4 h-4" />,
      color: '#6b7280',
      notifications: notifications.filter(n => n.category === 'system'),
      enabled: true,
      sound: false,
      push: true
    },
    {
      id: 'monetization',
      name: 'Revenue',
      icon: <DollarSign className="w-4 h-4" />,
      color: '#ef4444',
      notifications: notifications.filter(n => n.category === 'monetization'),
      enabled: true,
      sound: false,
      push: true
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'info': return <Info className="w-4 h-4 text-blue-500" />;
      case 'trend': return <TrendingUp className="w-4 h-4 text-purple-500" />;
      case 'achievement': return <Star className="w-4 h-4 text-yellow-500" />;
      case 'social': return <Heart className="w-4 h-4 text-pink-500" />;
      case 'system': return <Settings className="w-4 h-4 text-gray-500" />;
      case 'reminder': return <Clock className="w-4 h-4 text-orange-500" />;
      default: return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#eab308';
      case 'low': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const filteredNotifications = notifications
    .filter(notification => {
      if (notification.archived) return false;
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!notification.title.toLowerCase().includes(query) && 
            !notification.message.toLowerCase().includes(query)) {
          return false;
        }
      }
      
      if (selectedCategory !== 'all' && notification.category !== selectedCategory) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'timestamp') {
        return b.timestamp.getTime() - a.timestamp.getTime();
      } else if (sortBy === 'priority') {
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      } else {
        return a.category.localeCompare(b.category);
      }
    });

  const unreadCount = notifications.filter(n => !n.read && !n.archived).length;
  const pinnedNotifications = filteredNotifications.filter(n => n.pinned);
  const regularNotifications = filteredNotifications.filter(n => !n.pinned);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ));
  };

  const markAsUnread = (notificationId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, read: false } : n
    ));
  };

  const togglePin = (notificationId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, pinned: !n.pinned } : n
    ));
  };

  const archiveNotification = (notificationId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, archived: true } : n
    ));
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    onMarkAllRead?.();
  };

  const formatTimeAgo = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const NotificationCard = ({ notification }: { notification: Notification }) => (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      whileHover={{ scale: 1.02 }}
      className={`relative p-4 rounded-xl border transition-all cursor-pointer group ${
        notification.read 
          ? 'bg-[var(--surface-secondary)] border-[var(--border-primary)]' 
          : 'bg-[var(--brand-primary)]08 border-[var(--brand-primary)]30'
      }`}
      onClick={() => markAsRead(notification.id)}
    >
      {/* Priority indicator */}
      <div
        className="absolute top-0 left-0 w-1 h-full rounded-l-xl"
        style={{ backgroundColor: getPriorityColor(notification.priority) }}
      />

      <div className="flex items-start space-x-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-1">
          {getTypeIcon(notification.type)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className={`font-medium text-sm ${
                  notification.read ? 'text-[var(--text-primary)]' : 'text-[var(--text-primary)]'
                }`}>
                  {notification.title}
                </h4>
                {notification.pinned && (
                  <Pin className="w-3 h-3 text-[var(--brand-primary)]" />
                )}
                {!notification.read && (
                  <div className="w-2 h-2 bg-[var(--brand-primary)] rounded-full" />
                )}
              </div>
              
              <p className="text-sm text-[var(--text-secondary)] mb-2 line-clamp-2">
                {notification.message}
              </p>

              {/* Metadata */}
              {notification.metadata && (
                <div className="flex items-center space-x-3 text-xs text-[var(--text-tertiary)] mb-2">
                  {notification.metadata.views && (
                    <div className="flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>{notification.metadata.views.toLocaleString()}</span>
                    </div>
                  )}
                  {notification.metadata.engagement && (
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>+{notification.metadata.engagement}%</span>
                    </div>
                  )}
                  {notification.metadata.revenue && (
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-3 h-3" />
                      <span>+{notification.metadata.revenue}%</span>
                    </div>
                  )}
                  {notification.metadata.platform && (
                    <Badge variant="neutral" className="text-xs">
                      {notification.metadata.platform}
                    </Badge>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-[var(--text-tertiary)]">
                    {formatTimeAgo(notification.timestamp)}
                  </span>
                  <Badge variant="neutral" className="text-xs capitalize">
                    {notification.category}
                  </Badge>
                </div>
                
                {notification.actionLabel && (
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNotificationAction?.(notification);
                    }}
                  >
                    {notification.actionLabel}
                    {notification.actionUrl && (
                      <ExternalLink className="w-3 h-3 ml-1" />
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="xs"
                onClick={(e) => {
                  e.stopPropagation();
                  notification.read ? markAsUnread(notification.id) : markAsRead(notification.id);
                }}
                title={notification.read ? 'Mark as unread' : 'Mark as read'}
              >
                {notification.read ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              </Button>
              <Button
                variant="ghost"
                size="xs"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePin(notification.id);
                }}
                title={notification.pinned ? 'Unpin' : 'Pin'}
              >
                <Pin className={`w-3 h-3 ${notification.pinned ? 'text-[var(--brand-primary)]' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="xs"
                onClick={(e) => {
                  e.stopPropagation();
                  archiveNotification(notification.id);
                }}
                title="Archive"
              >
                <Archive className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="xs"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNotification(notification.id);
                }}
                title="Delete"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <Card className="relative overflow-hidden">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-pink-500 text-white">
                <Bell className="w-4 h-4" />
              </div>
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </motion.span>
              )}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-sm text-[var(--text-primary)] truncate">Notifications</h3>
              <p className="text-xs text-[var(--text-secondary)] truncate">
                {unreadCount} unread • {pinnedNotifications.length} pinned
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="xs"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="xs"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="w-4 h-4" />
            </Button>
            {unreadCount > 0 && (
              <Button
                variant="primary"
                size="xs"
                onClick={markAllAsRead}
              >
                Mark All Read
              </Button>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-[var(--brand-primary)]">{unreadCount}</div>
            <div className="text-xs text-[var(--text-secondary)]">Unread</div>
          </div>
          <div>
            <div className="text-lg font-bold text-[var(--color-success)]">{pinnedNotifications.length}</div>
            <div className="text-xs text-[var(--text-secondary)]">Pinned</div>
          </div>
          <div>
            <div className="text-lg font-bold text-[var(--color-warning)]">{notifications.filter(n => n.priority === 'high' || n.priority === 'urgent').length}</div>
            <div className="text-xs text-[var(--text-secondary)]">Priority</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-[var(--text-tertiary)]" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[var(--surface-secondary)] border border-[var(--border-primary)] rounded-lg text-sm focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent outline-none"
            />
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 bg-[var(--surface-secondary)] border border-[var(--border-primary)] rounded-lg text-sm"
                  >
                    <option value="all">All Categories</option>
                    {notificationGroups.map(group => (
                      <option key={group.id} value={group.id}>{group.name}</option>
                    ))}
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-2 bg-[var(--surface-secondary)] border border-[var(--border-primary)] rounded-lg text-sm"
                  >
                    <option value="timestamp">Sort by Time</option>
                    <option value="priority">Sort by Priority</option>
                    <option value="category">Sort by Category</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {/* Pinned Notifications */}
          {pinnedNotifications.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-[var(--text-primary)] mb-3 flex items-center">
                <Pin className="w-4 h-4 mr-2" />
                Pinned Notifications
              </h4>
              <div className="space-y-3">
                {pinnedNotifications.map(notification => (
                  <NotificationCard key={notification.id} notification={notification} />
                ))}
              </div>
            </div>
          )}

          {/* Regular Notifications */}
          {regularNotifications.length > 0 && (
            <div>
              {pinnedNotifications.length > 0 && (
                <h4 className="text-sm font-medium text-[var(--text-primary)] mb-3">
                  Recent Notifications
                </h4>
              )}
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {regularNotifications.slice(0, 8).map(notification => (
                  <NotificationCard key={notification.id} notification={notification} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 bg-[var(--surface-secondary)] rounded-xl border border-[var(--border-primary)]"
            >
              <h4 className="text-sm font-medium text-[var(--text-primary)] mb-3">Notification Settings</h4>
              <div className="space-y-3">
                {notificationGroups.map(group => (
                  <div key={group.id} className="flex items-center justify-between p-3 bg-[var(--surface-primary)] rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="p-2 rounded-lg text-white"
                        style={{ backgroundColor: group.color }}
                      >
                        {group.icon}
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-[var(--text-primary)]">{group.name}</h5>
                        <p className="text-xs text-[var(--text-secondary)]">
                          {group.notifications.length} notifications
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="xs" title="Sound notifications">
                        {group.sound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                      </Button>
                      <Button variant="ghost" size="xs" title="Push notifications">
                        <Smartphone className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {filteredNotifications.length === 0 && (
          <div className="text-center py-8">
            <Bell className="w-12 h-12 text-[var(--text-tertiary)] mx-auto mb-3" />
            <h4 className="text-sm font-medium text-[var(--text-primary)] mb-1">
              {searchQuery ? 'No notifications found' : 'All caught up!'}
            </h4>
            <p className="text-xs text-[var(--text-secondary)]">
              {searchQuery ? 'Try adjusting your search' : 'You\'re all up to date with your notifications'}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default NotificationsPro;
