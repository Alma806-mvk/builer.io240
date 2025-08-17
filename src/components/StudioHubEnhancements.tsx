import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BellIcon,
  CogIcon,
  UserGroupIcon,
  ClockIcon,
  TrophyIcon,
  FireIcon,
  LightBulbIcon,
  ChartBarIcon,
  PlayCircleIcon,
  PauseCircleIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  StarIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from '../context/AuthContext';
import { useCredits } from '../context/CreditContext';
import { notificationService, NotificationData } from '../services/notificationService';

// Using NotificationData from service instead of local interface

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  category: "productivity" | "quality" | "consistency" | "growth";
}

interface CollaborationRequest {
  id: string;
  userName: string;
  userAvatar: string;
  projectName: string;
  requestType: "invite" | "review" | "feedback";
  timestamp: Date;
  status: "pending" | "accepted" | "declined";
}

export const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [firestoreStatus, setFirestoreStatus] = useState<{ available: boolean; message: string }>({ available: true, message: '' });
  const { user } = useAuth();
  const { credits } = useCredits();

  // Load real notifications
  useEffect(() => {
    const loadNotifications = async () => {
      if (!user) {
        setNotifications([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userNotifications = await notificationService.getUserNotifications(user.uid, 20);
        setNotifications(userNotifications);

        // Check and create activity streak notification
        await notificationService.checkActivityStreak(user.uid);

        // Check for low credits warning
        if (credits && credits.balance <= 5 && credits.balance > 0) {
          await notificationService.createLowCreditsNotification(user.uid, credits.balance);
          // Reload notifications to include the new one
          const updatedNotifications = await notificationService.getUserNotifications(user.uid, 20);
          setNotifications(updatedNotifications);
        }

        // Check Firestore status
        setFirestoreStatus(notificationService.getFirestoreStatus());

      } catch (error) {
        console.error('Error loading notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [user, credits]);

  // Initialize notifications for new users
  useEffect(() => {
    if (user && !loading) {
      notificationService.initializeUserNotifications(user);
    }
  }, [user, loading]);

  // Simulate some notifications for demo purposes
  useEffect(() => {
    const createDemoNotifications = async () => {
      if (!user || notifications.length > 0) return;

      // Simulate performance notification
      setTimeout(async () => {
        await notificationService.createPerformanceNotification(
          user.uid,
          "AI Marketing Video",
          "views",
          12500
        );

        // Simulate upcoming content notification
        await notificationService.createUpcomingContentNotification(
          user.uid,
          3,
          "tomorrow"
        );

        // Simulate trend alert
        await notificationService.createTrendAlertNotification(
          user.uid,
          "AI Content Creation",
          156
        );

        // Reload notifications
        const updatedNotifications = await notificationService.getUserNotifications(user.uid, 20);
        setNotifications(updatedNotifications);
      }, 2000);
    };

    createDemoNotifications();
  }, [user, notifications.length]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircleIcon className="w-5 h-5 text-green-400" />;
      case "warning": return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400" />;
      case "achievement": return <TrophyIcon className="w-5 h-5 text-purple-400" />;
      case "welcome": return <HeartIcon className="w-5 h-5 text-pink-400" />;
      default: return <InformationCircleIcon className="w-5 h-5 text-blue-400" />;
    }
  };

  const handleNotificationClick = async (notification: NotificationData) => {
    if (!notification.read) {
      await notificationService.markAsRead(notification.id);
      setNotifications(prev =>
        prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
      );
    }

    // Handle action URL if exists
    if (notification.actionUrl) {
      // This would navigate to the action URL in a real app
      console.log('Navigate to:', notification.actionUrl);
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (hours < 1) {
      return minutes < 1 ? 'Just now' : `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return timestamp.toLocaleDateString();
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-600/30 rounded-2xl p-6 h-fit">
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <BellIcon className="w-5 h-5 text-orange-400" />
            Notifications
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </h3>
          {!firestoreStatus.available && (
            <div className="flex items-center gap-1 mt-1">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-xs text-yellow-400">Local storage mode</span>
            </div>
          )}
        </div>
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-sky-400 hover:text-sky-300 text-sm transition-colors"
        >
          {showAll ? "Show Less" : "View All"}
        </button>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="text-center text-slate-400 py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sky-400 mx-auto"></div>
            <p className="text-xs mt-2">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center text-slate-400 py-4">
            <BellIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No notifications yet</p>
            <p className="text-xs mt-1">We'll notify you when something important happens!</p>
          </div>
        ) : (
          notifications.slice(0, showAll ? notifications.length : 3).map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => handleNotificationClick(notification)}
              className={`bg-slate-700/30 border border-slate-600/30 rounded-lg p-3 cursor-pointer hover:bg-slate-700/50 transition-colors ${
                !notification.read ? "ring-1 ring-sky-400/30" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                {getNotificationIcon(notification.type)}
                <div className="flex-1">
                  <h4 className="font-medium text-white text-sm">{notification.title}</h4>
                  <p className="text-slate-300 text-xs mt-1">{notification.message}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-slate-500">
                      {formatTimestamp(notification.timestamp)}
                    </span>
                    {notification.actionable && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNotificationClick(notification);
                        }}
                        className="text-sky-400 hover:text-sky-300 text-xs flex items-center gap-1 transition-colors"
                      >
                        Take Action <ArrowRightIcon className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export const AchievementSystem: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    const mockAchievements: Achievement[] = [
      {
        id: "1",
        title: "Content Creator",
        description: "Create your first 10 pieces of content",
        icon: "🎬",
        progress: 8,
        maxProgress: 10,
        unlocked: false,
        category: "productivity",
      },
      {
        id: "2",
        title: "Viral Master",
        description: "Achieve 1M total views across all content",
        icon: "🚀",
        progress: 750000,
        maxProgress: 1000000,
        unlocked: false,
        category: "growth",
      },
      {
        id: "3",
        title: "Consistent Creator",
        description: "Upload content for 30 consecutive days",
        icon: "⭐",
        progress: 23,
        maxProgress: 30,
        unlocked: false,
        category: "consistency",
      },
      {
        id: "4",
        title: "Quality Focus",
        description: "Maintain 90%+ engagement rate for 5 videos",
        icon: "💎",
        progress: 5,
        maxProgress: 5,
        unlocked: true,
        category: "quality",
      },
    ];
    setAchievements(mockAchievements);
  }, []);

  const categoryColors = {
    productivity: "from-blue-600 to-blue-700",
    quality: "from-purple-600 to-purple-700",
    consistency: "from-green-600 to-green-700",
    growth: "from-orange-600 to-orange-700",
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-600/30 rounded-2xl p-6">
      <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
        <TrophyIcon className="w-5 h-5 text-yellow-400" />
        Achievements
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((achievement) => (
          <motion.div
            key={achievement.id}
            whileHover={{ scale: 1.02 }}
            className={`bg-gradient-to-br ${categoryColors[achievement.category]} p-4 rounded-xl text-white relative overflow-hidden ${
              achievement.unlocked ? "opacity-100" : "opacity-75"
            }`}
          >
            {achievement.unlocked && (
              <div className="absolute top-2 right-2">
                <CheckCircleIcon className="w-5 h-5 text-green-300" />
              </div>
            )}
            
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{achievement.icon}</span>
              <div>
                <h4 className="font-semibold text-sm">{achievement.title}</h4>
                <p className="text-xs opacity-90">{achievement.description}</p>
              </div>
            </div>

            <div className="mb-2">
              <div className="flex items-center justify-between text-xs mb-1">
                <span>Progress</span>
                <span>
                  {achievement.category === "growth" 
                    ? `${(achievement.progress / 1000).toFixed(0)}K / ${(achievement.maxProgress / 1000).toFixed(0)}K`
                    : `${achievement.progress} / ${achievement.maxProgress}`
                  }
                </span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="bg-white h-2 rounded-full"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export const CollaborationHub: React.FC = () => {
  const [requests, setRequests] = useState<CollaborationRequest[]>([]);

  useEffect(() => {
    const mockRequests: CollaborationRequest[] = [
      {
        id: "1",
        userName: "Sarah Johnson",
        userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b814?w=50&h=50&fit=crop&crop=face",
        projectName: "Q1 Marketing Campaign",
        requestType: "invite",
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        status: "pending",
      },
      {
        id: "2",
        userName: "Mike Chen",
        userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
        projectName: "Tech Tutorial Series",
        requestType: "review",
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        status: "pending",
      },
    ];
    setRequests(mockRequests);
  }, []);

  const getRequestTypeColor = (type: string) => {
    switch (type) {
      case "invite": return "bg-blue-500/20 text-blue-300";
      case "review": return "bg-orange-500/20 text-orange-300";
      case "feedback": return "bg-green-500/20 text-green-300";
      default: return "bg-gray-500/20 text-gray-300";
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-600/30 rounded-2xl p-6 h-fit">
      <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
        <UserGroupIcon className="w-5 h-5 text-cyan-400" />
        Collaboration Hub
      </h3>

      {requests.length > 0 ? (
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="bg-slate-700/30 border border-slate-600/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <img
                  src={request.userAvatar}
                  alt={request.userName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-white text-sm">{request.userName}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs ${getRequestTypeColor(request.requestType)}`}>
                      {request.requestType}
                    </span>
                  </div>
                  <p className="text-slate-300 text-xs mb-2">
                    Wants to collaborate on "{request.projectName}"
                  </p>
                  <div className="flex items-center gap-2">
                    <button className="bg-sky-600 hover:bg-sky-500 text-white px-3 py-1 rounded-lg text-xs transition-colors">
                      Accept
                    </button>
                    <button className="bg-slate-600 hover:bg-slate-500 text-white px-3 py-1 rounded-lg text-xs transition-colors">
                      Decline
                    </button>
                  </div>
                </div>
                <span className="text-xs text-slate-500">
                  {new Date(request.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <UserGroupIcon className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">No collaboration requests</p>
          <button className="mt-3 bg-sky-600 hover:bg-sky-500 text-white px-4 py-2 rounded-lg text-sm transition-colors">
            Invite Collaborators
          </button>
        </div>
      )}
    </div>
  );
};

export { EnhancedFocusTimer as ProductivityTimer } from './EnhancedFocusTimer';
