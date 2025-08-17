import React, { useState, useEffect, useCallback } from "react";

interface TrendAlert {
  id: string;
  keyword: string;
  threshold: number;
  frequency: "realtime" | "hourly" | "daily" | "weekly";
  isActive: boolean;
  createdAt: string;
  lastTriggered?: string;
  triggerCount: number;
  notificationMethod: "email" | "push" | "both";
  description?: string;
}

interface MonitoredTrend {
  id: string;
  keyword: string;
  currentScore: number;
  changePercent: number;
  isRising: boolean;
  lastUpdated: string;
  historicalData: { date: string; score: number; volume: number }[];
  category: "technology" | "business" | "entertainment" | "health" | "other";
  priority: "low" | "medium" | "high";
}

interface TrendMonitoringProps {
  isPremium: boolean;
  onUpgrade: () => void;
}

export const TrendMonitoring: React.FC<TrendMonitoringProps> = ({
  isPremium,
  onUpgrade,
}) => {
  const [activeTab, setActiveTab] = useState<"alerts" | "trends" | "dashboard" | "settings">("dashboard");
  const [alerts, setAlerts] = useState<TrendAlert[]>([]);
  const [monitoredTrends, setMonitoredTrends] = useState<MonitoredTrend[]>([]);
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [showCreateAlert, setShowCreateAlert] = useState(false);
  const [showAddTrend, setShowAddTrend] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [notifications, setNotifications] = useState<{id: string, message: string, type: 'alert' | 'info' | 'warning', timestamp: Date}[]>([]);

  // Form states
  const [newAlert, setNewAlert] = useState({
    keyword: "",
    threshold: 70,
    frequency: "daily" as const,
    notificationMethod: "email" as const,
    description: ""
  });

  const [newTrend, setNewTrend] = useState({
    keyword: "",
    category: "other" as const,
    priority: "medium" as const
  });

  // Initialize with some demo data for non-premium users
  useEffect(() => {
    if (!isPremium) {
      setAlerts([
        {
          id: "demo-1",
          keyword: "AI automation",
          threshold: 75,
          frequency: "daily",
          isActive: true,
          createdAt: "2025-07-15",
          lastTriggered: "2025-07-20",
          triggerCount: 3,
          notificationMethod: "email",
          description: "Monitor AI automation trends for content opportunities"
        },
        {
          id: "demo-2",
          keyword: "sustainable technology",
          threshold: 60,
          frequency: "hourly",
          isActive: false,
          createdAt: "2025-07-18",
          triggerCount: 1,
          notificationMethod: "push",
          description: "Track sustainable tech developments"
        }
      ]);

      setMonitoredTrends([
        {
          id: "trend-demo-1",
          keyword: "remote work",
          currentScore: 78,
          changePercent: 12.5,
          isRising: true,
          lastUpdated: "2025-07-21T10:30:00Z",
          category: "business",
          priority: "high",
          historicalData: [
            { date: "2025-07-15", score: 65, volume: 1200 },
            { date: "2025-07-16", score: 68, volume: 1350 },
            { date: "2025-07-17", score: 71, volume: 1480 },
            { date: "2025-07-18", score: 74, volume: 1590 },
            { date: "2025-07-19", score: 76, volume: 1650 },
            { date: "2025-07-20", score: 78, volume: 1720 }
          ]
        },
        {
          id: "trend-demo-2",
          keyword: "blockchain gaming",
          currentScore: 45,
          changePercent: -8.2,
          isRising: false,
          lastUpdated: "2025-07-21T10:25:00Z",
          category: "technology",
          priority: "medium",
          historicalData: [
            { date: "2025-07-15", score: 52, volume: 890 },
            { date: "2025-07-16", score: 50, volume: 820 },
            { date: "2025-07-17", score: 48, volume: 760 },
            { date: "2025-07-18", score: 46, volume: 720 },
            { date: "2025-07-19", score: 44, volume: 680 },
            { date: "2025-07-20", score: 45, volume: 710 }
          ]
        }
      ]);
    }
  }, [isPremium]);

  // Simulate live updates
  useEffect(() => {
    if (!isLiveMode) return;

    const interval = setInterval(() => {
      setLastUpdate(new Date());
      
      // Simulate trend score updates
      setMonitoredTrends(prev => prev.map(trend => ({
        ...trend,
        currentScore: Math.max(0, Math.min(100, trend.currentScore + (Math.random() - 0.5) * 5)),
        changePercent: (Math.random() - 0.5) * 20,
        isRising: Math.random() > 0.5,
        lastUpdated: new Date().toISOString()
      })));

      // Check for alert triggers
      checkAlertTriggers();
    }, 30000); // Update every 30 seconds in live mode

    return () => clearInterval(interval);
  }, [isLiveMode, alerts, monitoredTrends]);

  const checkAlertTriggers = useCallback(() => {
    alerts.forEach(alert => {
      if (!alert.isActive) return;
      
      const trend = monitoredTrends.find(t => t.keyword.toLowerCase().includes(alert.keyword.toLowerCase()));
      if (trend && trend.currentScore >= alert.threshold) {
        const shouldTrigger = 
          alert.frequency === "realtime" ||
          (alert.frequency === "hourly" && (!alert.lastTriggered || 
            Date.now() - new Date(alert.lastTriggered).getTime() > 3600000)) ||
          (alert.frequency === "daily" && (!alert.lastTriggered || 
            Date.now() - new Date(alert.lastTriggered).getTime() > 86400000));

        if (shouldTrigger) {
          triggerAlert(alert, trend);
        }
      }
    });
  }, [alerts, monitoredTrends]);

  const triggerAlert = (alert: TrendAlert, trend: MonitoredTrend) => {
    const notification = {
      id: Date.now().toString(),
      message: `Alert: "${alert.keyword}" has reached ${trend.currentScore} (threshold: ${alert.threshold})`,
      type: "alert" as const,
      timestamp: new Date()
    };
    
    setNotifications(prev => [notification, ...prev.slice(0, 9)]);
    
    // Update alert trigger count and timestamp
    setAlerts(prev => prev.map(a => 
      a.id === alert.id 
        ? { ...a, lastTriggered: new Date().toISOString(), triggerCount: a.triggerCount + 1 }
        : a
    ));
  };

  const createAlert = () => {
    if (!newAlert.keyword.trim()) return;

    const alert: TrendAlert = {
      id: Date.now().toString(),
      keyword: newAlert.keyword,
      threshold: newAlert.threshold,
      frequency: newAlert.frequency,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0],
      triggerCount: 0,
      notificationMethod: newAlert.notificationMethod,
      description: newAlert.description
    };

    setAlerts(prev => [alert, ...prev]);
    setNewAlert({
      keyword: "",
      threshold: 70,
      frequency: "daily",
      notificationMethod: "email",
      description: ""
    });
    setShowCreateAlert(false);

    // Add notification
    setNotifications(prev => [{
      id: Date.now().toString(),
      message: `New alert created for "${alert.keyword}"`,
      type: "info",
      timestamp: new Date()
    }, ...prev.slice(0, 9)]);
  };

  const addTrendToMonitor = () => {
    if (!newTrend.keyword.trim()) return;

    const trend: MonitoredTrend = {
      id: Date.now().toString(),
      keyword: newTrend.keyword,
      currentScore: Math.floor(Math.random() * 40) + 30, // Random initial score
      changePercent: (Math.random() - 0.5) * 20,
      isRising: Math.random() > 0.5,
      lastUpdated: new Date().toISOString(),
      category: newTrend.category,
      priority: newTrend.priority,
      historicalData: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        score: Math.floor(Math.random() * 40) + 30,
        volume: Math.floor(Math.random() * 1000) + 500
      }))
    };

    setMonitoredTrends(prev => [trend, ...prev]);
    setNewTrend({
      keyword: "",
      category: "other",
      priority: "medium"
    });
    setShowAddTrend(false);

    // Add notification
    setNotifications(prev => [{
      id: Date.now().toString(),
      message: `Now monitoring "${trend.keyword}"`,
      type: "info",
      timestamp: new Date()
    }, ...prev.slice(0, 9)]);
  };

  const toggleAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isActive: !alert.isActive } : alert
    ));
  };

  const deleteAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    setNotifications(prev => [{
      id: Date.now().toString(),
      message: "Alert deleted",
      type: "info",
      timestamp: new Date()
    }, ...prev.slice(0, 9)]);
  };

  const deleteTrend = (trendId: string) => {
    setMonitoredTrends(prev => prev.filter(trend => trend.id !== trendId));
    setNotifications(prev => [{
      id: Date.now().toString(),
      message: "Trend removed from monitoring",
      type: "info",
      timestamp: new Date()
    }, ...prev.slice(0, 9)]);
  };

  const exportData = () => {
    const exportData = {
      alerts,
      monitoredTrends,
      notifications: notifications.slice(0, 50),
      exportedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `trend-monitoring-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Live Status and Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-white">Monitoring Dashboard</h3>
          <span className={`px-3 py-1 rounded-full text-sm ${
            isLiveMode 
              ? "bg-green-600/20 text-green-400 border border-green-500/30" 
              : "bg-slate-600/20 text-slate-400 border border-slate-500/30"
          }`}>
            {isLiveMode ? "🟢 Live" : "⚪ Offline"}
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsLiveMode(!isLiveMode)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              isLiveMode 
                ? "bg-green-600 hover:bg-green-700 text-white" 
                : "bg-slate-700 hover:bg-slate-600 text-white"
            }`}
          >
            {isLiveMode ? "Stop Live Mode" : "Start Live Mode"}
          </button>
          <button
            onClick={exportData}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium"
          >
            📊 Export Data
          </button>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Active Alerts</p>
              <p className="text-2xl font-bold text-green-400">{alerts.filter(a => a.isActive).length}</p>
            </div>
            <span className="text-2xl">🔔</span>
          </div>
        </div>

        <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Monitored Trends</p>
              <p className="text-2xl font-bold text-blue-400">{monitoredTrends.length}</p>
            </div>
            <span className="text-2xl">📈</span>
          </div>
        </div>

        <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Rising Trends</p>
              <p className="text-2xl font-bold text-emerald-400">{monitoredTrends.filter(t => t.isRising).length}</p>
            </div>
            <span className="text-2xl">⬆️</span>
          </div>
        </div>

        <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Total Triggers</p>
              <p className="text-2xl font-bold text-purple-400">{alerts.reduce((sum, a) => sum + a.triggerCount, 0)}</p>
            </div>
            <span className="text-2xl">⚡</span>
          </div>
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-white">Recent Notifications</h4>
          <span className="text-sm text-slate-400">Last updated: {lastUpdate.toLocaleTimeString()}</span>
        </div>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="text-slate-400 text-center py-4">No notifications yet</p>
          ) : (
            notifications.map((notification) => (
              <div key={notification.id} className={`p-3 rounded-lg border ${
                notification.type === "alert" ? "bg-red-600/10 border-red-500/30" :
                notification.type === "warning" ? "bg-yellow-600/10 border-yellow-500/30" :
                "bg-blue-600/10 border-blue-500/30"
              }`}>
                <div className="flex items-center justify-between">
                  <p className="text-white text-sm">{notification.message}</p>
                  <span className="text-xs text-slate-400">
                    {notification.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
          <h4 className="font-semibold text-white mb-4">Quick Actions</h4>
          <div className="space-y-3">
            <button
              onClick={() => setShowCreateAlert(true)}
              className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white text-left flex items-center space-x-3"
            >
              <span>🔔</span>
              <span>Create New Alert</span>
            </button>
            <button
              onClick={() => setShowAddTrend(true)}
              className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-left flex items-center space-x-3"
            >
              <span>📈</span>
              <span>Add Trend to Monitor</span>
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-left flex items-center space-x-3"
            >
              <span>⚙️</span>
              <span>Monitoring Settings</span>
            </button>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
          <h4 className="font-semibold text-white mb-4">Top Performing Trends</h4>
          <div className="space-y-3">
            {monitoredTrends
              .sort((a, b) => b.currentScore - a.currentScore)
              .slice(0, 3)
              .map((trend) => (
                <div key={trend.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{trend.keyword}</p>
                    <p className="text-slate-400 text-xs">{trend.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-emerald-400">{trend.currentScore}</p>
                    <p className={`text-xs ${
                      trend.changePercent > 0 ? "text-green-400" : "text-red-400"
                    }`}>
                      {trend.changePercent > 0 ? "+" : ""}{trend.changePercent.toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAlerts = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Alert Management</h3>
        <button
          onClick={() => setShowCreateAlert(true)}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white text-sm font-medium"
        >
          + Create Alert
        </button>
      </div>

      <div className="space-y-4">
        {alerts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔔</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No Alerts Set</h3>
            <p className="text-slate-400 mb-4">Create your first alert to start monitoring trends</p>
            <button
              onClick={() => setShowCreateAlert(true)}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium"
            >
              Create Your First Alert
            </button>
          </div>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} className="p-6 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-semibold text-white">{alert.keyword}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      alert.isActive 
                        ? "bg-green-500/20 text-green-400" 
                        : "bg-slate-500/20 text-slate-400"
                    }`}>
                      {alert.isActive ? "Active" : "Inactive"}
                    </span>
                    <span className="px-2 py-1 text-xs bg-purple-500/20 text-purple-400 rounded-full">
                      {alert.frequency}
                    </span>
                  </div>
                  
                  {alert.description && (
                    <p className="text-slate-300 text-sm mb-3">{alert.description}</p>
                  )}
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Threshold:</span>
                      <p className="text-white font-medium">{alert.threshold}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Triggers:</span>
                      <p className="text-white font-medium">{alert.triggerCount}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Created:</span>
                      <p className="text-white font-medium">{alert.createdAt}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Last Triggered:</span>
                      <p className="text-white font-medium">{alert.lastTriggered || "Never"}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => toggleAlert(alert.id)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      alert.isActive
                        ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    {alert.isActive ? "Pause" : "Activate"}
                  </button>
                  <button
                    onClick={() => deleteAlert(alert.id)}
                    className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderTrends = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Monitored Trends</h3>
        <button
          onClick={() => setShowAddTrend(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium"
        >
          + Add Trend
        </button>
      </div>

      <div className="space-y-4">
        {monitoredTrends.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📈</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No Trends Monitored</h3>
            <p className="text-slate-400 mb-4">Add trends to track their performance over time</p>
            <button
              onClick={() => setShowAddTrend(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium"
            >
              Add Your First Trend
            </button>
          </div>
        ) : (
          monitoredTrends.map((trend) => (
            <div key={trend.id} className="p-6 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-semibold text-white">{trend.keyword}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      trend.priority === "high" ? "bg-red-500/20 text-red-400" :
                      trend.priority === "medium" ? "bg-yellow-500/20 text-yellow-400" :
                      "bg-green-500/20 text-green-400"
                    }`}>
                      {trend.priority} priority
                    </span>
                    <span className="px-2 py-1 text-xs bg-slate-500/20 text-slate-400 rounded-full capitalize">
                      {trend.category}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-slate-400">Current Score:</span>
                      <p className="text-2xl font-bold text-white">{trend.currentScore}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Change:</span>
                      <p className={`text-lg font-bold ${
                        trend.changePercent > 0 ? "text-green-400" : "text-red-400"
                      }`}>
                        {trend.changePercent > 0 ? "+" : ""}{trend.changePercent.toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-400">Trend:</span>
                      <p className={`font-medium ${
                        trend.isRising ? "text-green-400" : "text-red-400"
                      }`}>
                        {trend.isRising ? "📈 Rising" : "📉 Falling"}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-400">Updated:</span>
                      <p className="text-white font-medium">
                        {new Date(trend.lastUpdated).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  {/* Mini Chart */}
                  <div className="h-16 flex items-end space-x-1">
                    {trend.historicalData.slice(-7).map((data, index) => (
                      <div
                        key={index}
                        className="flex-1 bg-gradient-to-t from-purple-600 to-blue-500 rounded-t"
                        style={{ height: `${(data.score / 100) * 100}%` }}
                        title={`${data.date}: ${data.score}`}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => deleteTrend(trend.id)}
                    className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Monitoring Settings</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
          <h4 className="font-semibold text-white mb-4">Notification Preferences</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Email Notifications</span>
              <input type="checkbox" defaultChecked className="rounded bg-slate-700 border-slate-600" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Push Notifications</span>
              <input type="checkbox" defaultChecked className="rounded bg-slate-700 border-slate-600" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Daily Digest</span>
              <input type="checkbox" className="rounded bg-slate-700 border-slate-600" />
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
          <h4 className="font-semibold text-white mb-4">Update Frequency</h4>
          <div className="space-y-3">
            <select className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white">
              <option value="realtime">Real-time</option>
              <option value="5min">Every 5 minutes</option>
              <option value="15min">Every 15 minutes</option>
              <option value="30min">Every 30 minutes</option>
              <option value="1hour">Hourly</option>
            </select>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
          <h4 className="font-semibold text-white mb-4">Data Retention</h4>
          <div className="space-y-3">
            <select className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white">
              <option value="30d">30 days</option>
              <option value="90d">90 days</option>
              <option value="1y">1 year</option>
              <option value="forever">Forever</option>
            </select>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
          <h4 className="font-semibold text-white mb-4">Export Options</h4>
          <div className="space-y-3">
            <button
              onClick={exportData}
              className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-left"
            >
              📊 Export All Data
            </button>
            <button className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white text-left">
              📧 Schedule Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-300 to-red-300 bg-clip-text text-transparent">
              Trend Monitoring
            </h1>
            <p className="text-slate-400 text-sm">
              Real-time alerts and trend tracking
            </p>
          </div>
          <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full border border-orange-500/30">
            <span className="text-orange-400 text-xl">🔔</span>
            <span className="text-orange-300 text-sm font-semibold">
              Live Monitoring
            </span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex space-x-2">
          {[
            { key: "dashboard", label: "Dashboard", icon: "📊" },
            { key: "alerts", label: "Alerts", icon: "🔔" },
            { key: "trends", label: "Trends", icon: "📈" },
            { key: "settings", label: "Settings", icon: "⚙️" }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                activeTab === tab.key
                  ? "bg-orange-600 text-white"
                  : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 overflow-auto">
        {!isPremium && activeTab !== "dashboard" ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Premium Feature</h3>
            <p className="text-slate-400 mb-4">Unlock advanced monitoring and alert features</p>
            <button
              onClick={onUpgrade}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg text-white font-semibold"
            >
              Upgrade to Premium
            </button>
          </div>
        ) : (
          <>
            {activeTab === "dashboard" && renderDashboard()}
            {activeTab === "alerts" && renderAlerts()}
            {activeTab === "trends" && renderTrends()}
            {activeTab === "settings" && renderSettings()}
          </>
        )}
      </div>

      {/* Create Alert Modal */}
      {showCreateAlert && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Create New Alert</h3>
              <button
                onClick={() => setShowCreateAlert(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Keyword or Phrase
                </label>
                <input
                  type="text"
                  value={newAlert.keyword}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, keyword: e.target.value }))}
                  placeholder="e.g., AI automation, sustainable tech"
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Score Threshold
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={newAlert.threshold}
                    onChange={(e) => setNewAlert(prev => ({ ...prev, threshold: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                  <div className="text-center text-white font-medium">{newAlert.threshold}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Frequency
                  </label>
                  <select
                    value={newAlert.frequency}
                    onChange={(e) => setNewAlert(prev => ({ ...prev, frequency: e.target.value as any }))}
                    className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  >
                    <option value="realtime">Real-time</option>
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Notification Method
                </label>
                <select
                  value={newAlert.notificationMethod}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, notificationMethod: e.target.value as any }))}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                >
                  <option value="email">Email</option>
                  <option value="push">Push Notification</option>
                  <option value="both">Both</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={newAlert.description}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this alert is for..."
                  rows={3}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowCreateAlert(false)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={createAlert}
                  disabled={!newAlert.keyword.trim()}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white disabled:opacity-50"
                >
                  Create Alert
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Trend Modal */}
      {showAddTrend && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Add Trend to Monitor</h3>
              <button
                onClick={() => setShowAddTrend(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Keyword or Phrase
                </label>
                <input
                  type="text"
                  value={newTrend.keyword}
                  onChange={(e) => setNewTrend(prev => ({ ...prev, keyword: e.target.value }))}
                  placeholder="e.g., electric vehicles, crypto DeFi"
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Category
                </label>
                <select
                  value={newTrend.category}
                  onChange={(e) => setNewTrend(prev => ({ ...prev, category: e.target.value as any }))}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                >
                  <option value="technology">Technology</option>
                  <option value="business">Business</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="health">Health</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Priority
                </label>
                <select
                  value={newTrend.priority}
                  onChange={(e) => setNewTrend(prev => ({ ...prev, priority: e.target.value as any }))}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddTrend(false)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={addTrendToMonitor}
                  disabled={!newTrend.keyword.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white disabled:opacity-50"
                >
                  Add Trend
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
