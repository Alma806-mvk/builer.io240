import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClockIcon,
  PlayCircleIcon,
  PauseCircleIcon,
  StopIcon,
  CogIcon,
  ChartBarIcon,
  TrophyIcon,
  FireIcon,
  CheckCircleIcon,
  XMarkIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowPathIcon,
  CalendarDaysIcon,
  BellIcon,
  BeakerIcon,
  BookOpenIcon,
  LightBulbIcon,
  MusicalNoteIcon,
} from "@heroicons/react/24/outline";

interface TimerSession {
  id: string;
  type: "work" | "shortBreak" | "longBreak";
  duration: number;
  completed: boolean;
  startTime: Date;
  endTime?: Date;
}

interface TimerStats {
  sessionsCompleted: number;
  totalFocusTime: number;
  streak: number;
  longestStreak: number;
  sessionsToday: number;
  weeklyGoal: number;
  productivity: number;
}

interface TimerSettings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
  autoStartBreaks: boolean;
  autoStartWork: boolean;
  soundEnabled: boolean;
  notifications: boolean;
  minimalistMode: boolean;
  dailyGoal: number;
  backgroundSounds: string;
}

const BACKGROUND_SOUNDS = {
  none: "Silent",
  rain: "Gentle Rain",
  forest: "Forest Ambience",
  ocean: "Ocean Waves",
  cafe: "Coffee Shop",
  white: "White Noise",
  brown: "Brown Noise",
  pink: "Pink Noise",
};

const TIMER_PRESETS = {
  pomodoro: { work: 25, shortBreak: 5, longBreak: 15 },
  deep: { work: 45, shortBreak: 10, longBreak: 30 },
  quick: { work: 15, shortBreak: 3, longBreak: 10 },
  flow: { work: 90, shortBreak: 20, longBreak: 45 },
  custom: { work: 25, shortBreak: 5, longBreak: 15 },
};

export const EnhancedFocusTimer: React.FC = () => {
  // Core timer state
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [currentSession, setCurrentSession] = useState<"work" | "shortBreak" | "longBreak">("work");
  const [sessionCount, setSessionCount] = useState(0);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  
  // UI state
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showTaskInput, setShowTaskInput] = useState(false);
  const [currentTask, setCurrentTask] = useState("");
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  
  // Settings
  const [settings, setSettings] = useState<TimerSettings>({
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    longBreakInterval: 4,
    autoStartBreaks: false,
    autoStartWork: false,
    soundEnabled: true,
    notifications: true,
    minimalistMode: false,
    dailyGoal: 8,
    backgroundSounds: "none",
  });

  // Stats
  const [stats, setStats] = useState<TimerStats>({
    sessionsCompleted: 0,
    totalFocusTime: 0,
    streak: 0,
    longestStreak: 0,
    sessionsToday: 0,
    weeklyGoal: 40,
    productivity: 85,
  });

  // Session history
  const [sessions, setSessions] = useState<TimerSession[]>([]);
  const intervalRef = useRef<NodeJS.Timeout>();
  const notificationTimeoutRef = useRef<NodeJS.Timeout>();

  // Load data from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("focusTimer:settings");
    const savedStats = localStorage.getItem("focusTimer:stats");
    const savedSessions = localStorage.getItem("focusTimer:sessions");
    
    if (savedSettings) setSettings(JSON.parse(savedSettings));
    if (savedStats) setStats(JSON.parse(savedStats));
    if (savedSessions) setSessions(JSON.parse(savedSessions));
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem("focusTimer:settings", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem("focusTimer:stats", JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem("focusTimer:sessions", JSON.stringify(sessions));
  }, [sessions]);

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      handleSessionComplete();
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft]);

  const handleSessionComplete = useCallback(() => {
    setIsRunning(false);
    
    // Play notification sound
    if (settings.soundEnabled) {
      const audio = new Audio('/notification.mp3');
      audio.play().catch(() => {});
    }

    // Show browser notification
    if (settings.notifications && "Notification" in window) {
      new Notification(`${currentSession === "work" ? "Work" : "Break"} session completed!`, {
        body: currentSession === "work" ? "Time for a break!" : "Ready to get back to work?",
        icon: "/favicon.ico",
      });
    }

    // Complete current session
    if (currentSessionId) {
      const completedSession: TimerSession = {
        id: currentSessionId,
        type: currentSession,
        duration: getDurationForSession(currentSession),
        completed: true,
        startTime: new Date(Date.now() - getDurationForSession(currentSession) * 60 * 1000),
        endTime: new Date(),
      };

      setSessions(prev => [...prev, completedSession]);
      
      // Update stats
      if (currentSession === "work") {
        setStats(prev => ({
          ...prev,
          sessionsCompleted: prev.sessionsCompleted + 1,
          totalFocusTime: prev.totalFocusTime + getDurationForSession(currentSession),
          sessionsToday: prev.sessionsToday + 1,
          streak: prev.streak + 1,
          longestStreak: Math.max(prev.longestStreak, prev.streak + 1),
        }));

        if (currentTask) {
          setCompletedTasks(prev => [...prev, currentTask]);
          setCurrentTask("");
        }
      }
    }

    // Determine next session
    let nextSession: "work" | "shortBreak" | "longBreak" = "work";
    
    if (currentSession === "work") {
      const workSessionsCompleted = sessionCount + 1;
      nextSession = workSessionsCompleted % settings.longBreakInterval === 0 ? "longBreak" : "shortBreak";
      setSessionCount(workSessionsCompleted);
    }

    setCurrentSession(nextSession);
    setTimeLeft(getDurationForSession(nextSession) * 60);
    setCurrentSessionId(null);

    // Auto-start next session if enabled
    const shouldAutoStart = (currentSession === "work" && settings.autoStartBreaks) || 
                           (currentSession !== "work" && settings.autoStartWork);
    
    if (shouldAutoStart) {
      notificationTimeoutRef.current = setTimeout(() => {
        startSession();
      }, 3000);
    }
  }, [currentSession, currentSessionId, sessionCount, settings, currentTask]);

  const getDurationForSession = (session: "work" | "shortBreak" | "longBreak"): number => {
    switch (session) {
      case "work": return settings.workDuration;
      case "shortBreak": return settings.shortBreakDuration;
      case "longBreak": return settings.longBreakDuration;
    }
  };

  const startSession = () => {
    setIsRunning(true);
    setCurrentSessionId(Date.now().toString());
    
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }
  };

  const pauseSession = () => {
    setIsRunning(false);
  };

  const stopSession = () => {
    setIsRunning(false);
    setTimeLeft(getDurationForSession(currentSession) * 60);
    setCurrentSessionId(null);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setCurrentSession("work");
    setTimeLeft(settings.workDuration * 60);
    setSessionCount(0);
    setCurrentSessionId(null);
    setCurrentTask("");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getSessionColor = () => {
    switch (currentSession) {
      case "work": return "from-blue-500 to-purple-600";
      case "shortBreak": return "from-green-500 to-teal-600";
      case "longBreak": return "from-orange-500 to-red-600";
    }
  };

  const getProgressPercentage = () => {
    const totalDuration = getDurationForSession(currentSession) * 60;
    return ((totalDuration - timeLeft) / totalDuration) * 100;
  };

  const applyPreset = (presetName: keyof typeof TIMER_PRESETS) => {
    const preset = TIMER_PRESETS[presetName];
    setSettings(prev => ({
      ...prev,
      workDuration: preset.work,
      shortBreakDuration: preset.shortBreak,
      longBreakDuration: preset.longBreak,
    }));
    
    if (!isRunning) {
      setTimeLeft(preset.work * 60);
      setCurrentSession("work");
    }
  };

  const requestNotificationPermission = () => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  if (settings.minimalistMode) {
    return (
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 text-center">
        <div className="mb-6">
          <div className={`text-6xl font-bold bg-gradient-to-r ${getSessionColor()} bg-clip-text text-transparent mb-2`}>
            {formatTime(timeLeft)}
          </div>
          <div className="text-slate-400 text-sm uppercase tracking-wider">
            {currentSession.replace(/([A-Z])/g, ' $1').trim()}
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={isRunning ? pauseSession : startSession}
            className={`p-4 rounded-full text-white transition-all ${
              isRunning
                ? "bg-red-500 hover:bg-red-400"
                : "bg-green-500 hover:bg-green-400"
            }`}
          >
            {isRunning ? <PauseCircleIcon className="w-8 h-8" /> : <PlayCircleIcon className="w-8 h-8" />}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSettings(prev => ({ ...prev, minimalistMode: false }))}
            className="p-4 rounded-full bg-slate-600 hover:bg-slate-500 text-white transition-all"
          >
            <EyeIcon className="w-8 h-8" />
          </motion.button>
        </div>

        <div className="w-full bg-slate-700 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${getProgressPercentage()}%` }}
            className={`h-2 rounded-full bg-gradient-to-r ${getSessionColor()}`}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-600/30 rounded-2xl p-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <motion.div
            animate={{ rotate: isRunning ? 360 : 0 }}
            transition={{ duration: 2, repeat: isRunning ? Infinity : 0, ease: "linear" }}
          >
            <ClockIcon className="w-6 h-6 text-green-400" />
          </motion.div>
          Focus Timer
        </h3>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowStats(!showStats)}
            className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 transition-all"
          >
            <ChartBarIcon className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 transition-all"
          >
            <CogIcon className="w-5 h-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSettings(prev => ({ ...prev, minimalistMode: true }))}
            className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 transition-all"
          >
            <EyeSlashIcon className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Main Timer Display */}
      <div className="text-center mb-6">
        <motion.div
          key={timeLeft}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className={`text-5xl font-bold mb-4 bg-gradient-to-r ${getSessionColor()} bg-clip-text text-transparent`}
        >
          {formatTime(timeLeft)}
        </motion.div>

        <div className="mb-4">
          <span className={`px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r ${getSessionColor()} text-white`}>
            {currentSession === "work" && "🎯 Work Session"}
            {currentSession === "shortBreak" && "☕ Short Break"}
            {currentSession === "longBreak" && "🌱 Long Break"}
          </span>
        </div>

        {/* Progress Ring */}
        <div className="relative w-32 h-32 mx-auto mb-6">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="54"
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              className="text-slate-700"
            />
            <motion.circle
              cx="60"
              cy="60"
              r="54"
              stroke="url(#gradient)"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 54}
              strokeDashoffset={2 * Math.PI * 54 * (1 - getProgressPercentage() / 100)}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={currentSession === "work" ? "#3B82F6" : currentSession === "shortBreak" ? "#10B981" : "#F59E0B"} />
                <stop offset="100%" stopColor={currentSession === "work" ? "#8B5CF6" : currentSession === "shortBreak" ? "#06B6D4" : "#EF4444"} />
              </linearGradient>
            </defs>
          </svg>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ scale: isRunning ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 1, repeat: isRunning ? Infinity : 0 }}
              className="text-2xl"
            >
              {currentSession === "work" ? "🎯" : currentSession === "shortBreak" ? "☕" : "🌱"}
            </motion.div>
          </div>
        </div>

        {/* Current Task */}
        <AnimatePresence>
          {currentTask && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-3 bg-slate-700/30 rounded-lg border border-slate-600/30"
            >
              <div className="text-sm text-slate-300 mb-1">Current Task:</div>
              <div className="text-white font-medium">{currentTask}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Control Buttons */}
      <div className="flex justify-center gap-3 mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isRunning ? pauseSession : startSession}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
            isRunning
              ? "bg-red-500 hover:bg-red-400 text-white"
              : "bg-green-500 hover:bg-green-400 text-white"
          }`}
        >
          {isRunning ? (
            <>
              <PauseCircleIcon className="w-5 h-5" />
              Pause
            </>
          ) : (
            <>
              <PlayCircleIcon className="w-5 h-5" />
              Start
            </>
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={stopSession}
          className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-600 hover:bg-slate-500 text-white font-semibold transition-all"
        >
          <StopIcon className="w-5 h-5" />
          Stop
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowTaskInput(!showTaskInput)}
          className="flex items-center gap-2 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all"
        >
          <BookOpenIcon className="w-5 h-5" />
          Task
        </motion.button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-slate-700/30 rounded-lg">
          <div className="text-lg font-bold text-white">{stats.sessionsToday}</div>
          <div className="text-xs text-slate-400">Today</div>
        </div>
        <div className="text-center p-3 bg-slate-700/30 rounded-lg">
          <div className="text-lg font-bold text-orange-400">{stats.streak}</div>
          <div className="text-xs text-slate-400">Streak</div>
        </div>
        <div className="text-center p-3 bg-slate-700/30 rounded-lg">
          <div className="text-lg font-bold text-green-400">{Math.round(stats.totalFocusTime / 60)}h</div>
          <div className="text-xs text-slate-400">Total</div>
        </div>
      </div>

      {/* Task Input Modal */}
      <AnimatePresence>
        {showTaskInput && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowTaskInput(false)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-800 border border-slate-600 rounded-2xl p-6 max-w-md w-full mx-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Set Current Task</h3>
                <button
                  onClick={() => setShowTaskInput(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <input
                type="text"
                value={currentTask}
                onChange={(e) => setCurrentTask(e.target.value)}
                placeholder="What are you working on?"
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                autoFocus
              />

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => {
                    setShowTaskInput(false);
                  }}
                  className="flex-1 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium transition-colors"
                >
                  Set Task
                </button>
                <button
                  onClick={() => {
                    setCurrentTask("");
                    setShowTaskInput(false);
                  }}
                  className="flex-1 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg font-medium transition-colors"
                >
                  Clear
                </button>
              </div>

              {completedTasks.length > 0 && (
                <div className="mt-4">
                  <div className="text-sm text-slate-400 mb-2">Completed Today:</div>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {completedTasks.slice(-5).map((task, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircleIcon className="w-4 h-4 text-green-400" />
                        {task}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-800 border border-slate-600 rounded-2xl p-6 max-w-lg w-full mx-4 my-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Timer Settings</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Timer Presets */}
                <div>
                  <label className="block text-sm font-medium text-white mb-3">Timer Presets</label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(TIMER_PRESETS).map(([key, preset]) => (
                      <motion.button
                        key={key}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => applyPreset(key as keyof typeof TIMER_PRESETS)}
                        className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-left transition-colors"
                      >
                        <div className="text-white font-medium capitalize">{key}</div>
                        <div className="text-xs text-slate-400">
                          {preset.work}m work, {preset.shortBreak}m break
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Duration Settings */}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Work Duration ({settings.workDuration} minutes)
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="120"
                      step="5"
                      value={settings.workDuration}
                      onChange={(e) => setSettings(prev => ({ ...prev, workDuration: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Short Break ({settings.shortBreakDuration} minutes)
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="30"
                      value={settings.shortBreakDuration}
                      onChange={(e) => setSettings(prev => ({ ...prev, shortBreakDuration: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Long Break ({settings.longBreakDuration} minutes)
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="60"
                      step="5"
                      value={settings.longBreakDuration}
                      onChange={(e) => setSettings(prev => ({ ...prev, longBreakDuration: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Feature Toggles */}
                <div className="space-y-3">
                  {[
                    { key: "autoStartBreaks", label: "Auto-start breaks", icon: ArrowPathIcon },
                    { key: "autoStartWork", label: "Auto-start work sessions", icon: ArrowPathIcon },
                    { key: "soundEnabled", label: "Sound notifications", icon: SpeakerWaveIcon },
                    { key: "notifications", label: "Browser notifications", icon: BellIcon },
                  ].map(({ key, label, icon: Icon }) => (
                    <div key={key} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="w-5 h-5 text-slate-400" />
                        <span className="text-white">{label}</span>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSettings(prev => ({ ...prev, [key]: !prev[key as keyof TimerSettings] }))}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          settings[key as keyof TimerSettings] ? "bg-green-500" : "bg-slate-600"
                        }`}
                      >
                        <motion.div
                          animate={{
                            x: settings[key as keyof TimerSettings] ? 24 : 0
                          }}
                          className="w-6 h-6 bg-white rounded-full shadow-md"
                        />
                      </motion.button>
                    </div>
                  ))}
                </div>

                {/* Background Sounds */}
                <div>
                  <label className="block text-sm font-medium text-white mb-3">Background Sounds</label>
                  <select
                    value={settings.backgroundSounds}
                    onChange={(e) => setSettings(prev => ({ ...prev, backgroundSounds: e.target.value }))}
                    className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  >
                    {Object.entries(BACKGROUND_SOUNDS).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={resetTimer}
                    className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-colors"
                  >
                    Reset Timer
                  </button>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="flex-1 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium transition-colors"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Modal */}
      <AnimatePresence>
        {showStats && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto"
            onClick={() => setShowStats(false)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-800 border border-slate-600 rounded-2xl p-6 max-w-lg w-full mx-4 my-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <ChartBarIcon className="w-6 h-6 text-blue-400" />
                  Statistics
                </h3>
                <button
                  onClick={() => setShowStats(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-700/50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-400">{stats.sessionsCompleted}</div>
                  <div className="text-sm text-slate-400">Total Sessions</div>
                </div>
                <div className="bg-slate-700/50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-400">{Math.round(stats.totalFocusTime / 60)}h</div>
                  <div className="text-sm text-slate-400">Focus Time</div>
                </div>
                <div className="bg-slate-700/50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-400">{stats.streak}</div>
                  <div className="text-sm text-slate-400">Current Streak</div>
                </div>
                <div className="bg-slate-700/50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-400">{stats.longestStreak}</div>
                  <div className="text-sm text-slate-400">Best Streak</div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white">Daily Goal Progress</span>
                  <span className="text-slate-400">{stats.sessionsToday}/{settings.dailyGoal}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((stats.sessionsToday / settings.dailyGoal) * 100, 100)}%` }}
                    className="h-3 rounded-full bg-gradient-to-r from-green-500 to-blue-500"
                  />
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-white font-medium mb-3">Recent Achievements</h4>
                <div className="space-y-2">
                  {stats.streak >= 7 && (
                    <div className="flex items-center gap-3 p-3 bg-yellow-500/20 rounded-lg">
                      <TrophyIcon className="w-5 h-5 text-yellow-400" />
                      <span className="text-white text-sm">Week Warrior - 7 day streak!</span>
                    </div>
                  )}
                  {stats.sessionsCompleted >= 50 && (
                    <div className="flex items-center gap-3 p-3 bg-purple-500/20 rounded-lg">
                      <FireIcon className="w-5 h-5 text-purple-400" />
                      <span className="text-white text-sm">Focus Master - 50 sessions completed!</span>
                    </div>
                  )}
                  {stats.totalFocusTime >= 1000 && (
                    <div className="flex items-center gap-3 p-3 bg-blue-500/20 rounded-lg">
                      <ClockIcon className="w-5 h-5 text-blue-400" />
                      <span className="text-white text-sm">Time Lord - 1000+ minutes focused!</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => setShowStats(false)}
                className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
