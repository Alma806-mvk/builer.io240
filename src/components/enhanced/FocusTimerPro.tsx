import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  PauseCircle,
  RotateCcw,
  Settings,
  Coffee,
  Brain,
  Target,
  Zap,
  Volume2,
  VolumeX,
  SkipForward,
  Award,
  Clock,
  TrendingUp,
  Calendar
} from "lucide-react";
import { Button, Card, ProgressBar } from "../ui/WorldClassComponents";

interface FocusSession {
  type: 'focus' | 'break' | 'long_break';
  duration: number;
  label: string;
  color: string;
  icon: React.ReactNode;
}

interface FocusStats {
  todayFocusTime: number;
  weeklyFocusTime: number;
  streak: number;
  sessionsCompleted: number;
  productivity: number;
}

interface FocusTimerProProps {
  onSessionComplete?: (session: FocusSession) => void;
  onProductivityUpdate?: (minutes: number) => void;
}

const FocusTimerPro: React.FC<FocusTimerProProps> = ({
  onSessionComplete,
  onProductivityUpdate
}) => {
  const [isActive, setIsActive] = useState(false);
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [currentSession, setCurrentSession] = useState<FocusSession>({
    type: 'focus',
    duration: 25,
    label: 'Deep Focus',
    color: '#3b82f6',
    icon: <Brain className="w-4 h-4" />
  });
  const [sessionCount, setSessionCount] = useState(0);
  const [isBreak, setIsBreak] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState<FocusStats>({
    // Mock data commented out for clean user experience
    // todayFocusTime: 145,
    // weeklyFocusTime: 620,
    // streak: 7,
    // sessionsCompleted: 28,
    // productivity: 87
    todayFocusTime: 0,
    weeklyFocusTime: 0,
    streak: 0,
    sessionsCompleted: 0,
    productivity: 0
  });

  const focusPresets: FocusSession[] = [
    {
      type: 'focus',
      duration: 25,
      label: 'Pomodoro',
      color: '#ef4444',
      icon: <Target className="w-4 h-4" />
    },
    {
      type: 'focus',
      duration: 45,
      label: 'Deep Focus',
      color: '#3b82f6',
      icon: <Brain className="w-4 h-4" />
    },
    {
      type: 'focus',
      duration: 15,
      label: 'Quick Sprint',
      color: '#f59e0b',
      icon: <Zap className="w-4 h-4" />
    },
    {
      type: 'focus',
      duration: 90,
      label: 'Flow State',
      color: '#8b5cf6',
      icon: <TrendingUp className="w-4 h-4" />
    }
  ];

  const breakPresets: FocusSession[] = [
    {
      type: 'break',
      duration: 5,
      label: 'Short Break',
      color: '#10b981',
      icon: <Coffee className="w-4 h-4" />
    },
    {
      type: 'long_break',
      duration: 15,
      label: 'Long Break',
      color: '#06b6d4',
      icon: <Coffee className="w-4 h-4" />
    }
  ];

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          // Session completed
          setIsActive(false);
          handleSessionComplete();
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, minutes, seconds]);

  const handleSessionComplete = () => {
    if (soundEnabled) {
      // Play completion sound (would need actual audio implementation)
      console.log('🔔 Session completed!');
    }

    // Update stats
    const newStats = { ...stats };
    newStats.sessionsCompleted += 1;
    
    if (currentSession.type === 'focus') {
      newStats.todayFocusTime += currentSession.duration;
      newStats.weeklyFocusTime += currentSession.duration;
      onProductivityUpdate?.(currentSession.duration);
    }

    setStats(newStats);
    onSessionComplete?.(currentSession);

    // Auto-suggest next session
    if (currentSession.type === 'focus') {
      setSessionCount(sessionCount + 1);
      if (sessionCount % 4 === 3) {
        // Suggest long break after 4 sessions
        switchToSession(breakPresets[1]);
      } else {
        // Suggest short break
        switchToSession(breakPresets[0]);
      }
    } else {
      // Return to focus session
      switchToSession(focusPresets[0]);
    }
  };

  const switchToSession = (session: FocusSession) => {
    setCurrentSession(session);
    setMinutes(session.duration);
    setSeconds(0);
    setIsBreak(session.type !== 'focus');
  };

  const startTimer = () => {
    setIsActive(true);
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(currentSession.duration);
    setSeconds(0);
  };

  const skipSession = () => {
    setIsActive(false);
    handleSessionComplete();
  };

  const getProgress = () => {
    const totalSeconds = currentSession.duration * 60;
    const remainingSeconds = minutes * 60 + seconds;
    return ((totalSeconds - remainingSeconds) / totalSeconds) * 100;
  };

  const formatTime = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div
              className="p-2 rounded-lg text-white"
              style={{ backgroundColor: currentSession.color }}
            >
              {currentSession.icon}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-sm text-[var(--text-primary)] truncate">Focus Timer</h3>
              <p className="text-xs text-[var(--text-secondary)] truncate">{currentSession.label}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="xs"
              onClick={() => setShowStats(!showStats)}
              className="relative"
            >
              <TrendingUp className="w-4 h-4" />
              {stats.streak > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {stats.streak}
                </span>
              )}
            </Button>
            <Button
              variant="ghost"
              size="xs"
              onClick={() => setSoundEnabled(!soundEnabled)}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="xs"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Stats Panel */}
        <AnimatePresence>
          {showStats && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-[var(--surface-secondary)] rounded-xl p-4"
            >
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-[var(--brand-primary)]">
                    {formatTime(stats.todayFocusTime)}
                  </div>
                  <div className="text-xs text-[var(--text-secondary)]">Today</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-[var(--color-success)]">
                    {stats.streak}
                  </div>
                  <div className="text-xs text-[var(--text-secondary)]">Day Streak</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-[var(--brand-secondary)]">
                    {stats.sessionsCompleted}
                  </div>
                  <div className="text-xs text-[var(--text-secondary)]">Sessions</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-[var(--color-warning)]">
                    {stats.productivity}%
                  </div>
                  <div className="text-xs text-[var(--text-secondary)]">Productivity</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Timer Display */}
        <div className="text-center space-y-4">
          <motion.div
            key={`${minutes}-${seconds}`}
            initial={{ scale: 1 }}
            animate={{ scale: isActive ? [1, 1.02, 1] : 1 }}
            transition={{ duration: 1, repeat: isActive ? Infinity : 0 }}
            className="relative"
          >
            <div 
              className="w-32 h-32 mx-auto rounded-full flex items-center justify-center text-white relative overflow-hidden"
              style={{ 
                background: `conic-gradient(${currentSession.color} ${getProgress() * 3.6}deg, var(--surface-tertiary) 0deg)`
              }}
            >
              <div className="w-28 h-28 bg-[var(--surface-primary)] rounded-full flex flex-col items-center justify-center">
                <div className="text-2xl font-bold text-[var(--text-primary)]">
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </div>
                <div className="text-xs text-[var(--text-secondary)] mt-1">
                  {isBreak ? '☕ Break Time' : '🧠 Focus Time'}
                </div>
              </div>
            </div>
            
            {/* Pulse effect for active timer */}
            {isActive && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 opacity-30"
                style={{ borderColor: currentSession.color }}
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <ProgressBar
              value={getProgress()}
              color={currentSession.color}
              size="sm"
              className="rounded-full"
            />
            <div className="flex justify-between text-xs text-[var(--text-tertiary)]">
              <span>Session {sessionCount + 1}</span>
              <span>{Math.round(getProgress())}% Complete</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetTimer}
            disabled={isActive}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            variant={isActive ? "secondary" : "primary"}
            size="sm"
            onClick={isActive ? pauseTimer : startTimer}
            className="px-8"
          >
            {isActive ? (
              <>
                <PauseCircle className="w-4 h-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={skipSession}
            disabled={!isActive}
          >
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>

        {/* Quick Presets */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              <div>
                <h4 className="text-sm font-medium text-[var(--text-primary)] mb-2">Focus Sessions</h4>
                <div className="grid grid-cols-2 gap-2">
                  {focusPresets.map((preset) => (
                    <Button
                      key={preset.label}
                      variant={currentSession.label === preset.label ? "primary" : "ghost"}
                      size="xs"
                      onClick={() => switchToSession(preset)}
                      className="flex items-center space-x-1 text-xs"
                      disabled={isActive}
                    >
                      {preset.icon}
                      <span>{preset.duration}m</span>
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-[var(--text-primary)] mb-2">Break Sessions</h4>
                <div className="grid grid-cols-2 gap-2">
                  {breakPresets.map((preset) => (
                    <Button
                      key={preset.label}
                      variant={currentSession.label === preset.label ? "primary" : "ghost"}
                      size="xs"
                      onClick={() => switchToSession(preset)}
                      className="flex items-center space-x-1 text-xs"
                      disabled={isActive}
                    >
                      {preset.icon}
                      <span>{preset.duration}m</span>
                    </Button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Achievement Notification */}
        <AnimatePresence>
          {stats.streak > 0 && stats.streak % 7 === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg p-3"
            >
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium text-yellow-500">Week Streak! ���</p>
                  <p className="text-xs text-yellow-500/80">You've maintained focus for {stats.streak} days!</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
};

export default FocusTimerPro;
