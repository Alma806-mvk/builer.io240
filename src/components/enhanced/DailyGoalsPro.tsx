import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  Plus,
  Minus,
  Trophy,
  Star,
  Zap,
  TrendingUp,
  Calendar,
  CheckCircle,
  Circle,
  Edit3,
  Trash2,
  Award,
  Flame,
  Settings,
  BarChart3,
  ChevronRight,
  Clock,
  MessageSquare,
  Timer,
  RotateCcw,
  Heart,
  Users,
  X
} from "lucide-react";
import { Button, Card, ProgressBar, Badge } from "../ui/WorldClassComponents";

interface DailyGoal {
  id: string;
  title: string;
  description: string;
  current: number;
  target: number;
  color: string;
  icon: React.ReactNode;
  category: 'productivity' | 'content' | 'health' | 'learning' | 'social';
  priority: 'low' | 'medium' | 'high';
  streak: number;
  completed: boolean;
  lastUpdated: Date;
  weeklyProgress: number[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress: number;
  target: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface DailyGoalsProProps {
  onGoalComplete?: (goal: DailyGoal) => void;
  onStreakMilestone?: (streak: number) => void;
}

const DailyGoalsPro: React.FC<DailyGoalsProProps> = ({
  onGoalComplete,
  onStreakMilestone
}) => {
  const [goals, setGoals] = useState<DailyGoal[]>([
    // Mock data commented out for clean user experience
    /*
    {
      id: '1',
      title: 'Content Created',
      description: 'Create engaging content pieces',
      current: 3,
      target: 5,
      color: '#3b82f6',
      icon: <MessageSquare className="w-4 h-4" />,
      category: 'content',
      priority: 'high',
      streak: 5,
      completed: false,
      lastUpdated: new Date(),
      weeklyProgress: [4, 5, 3, 5, 4, 3, 0]
    },
    {
      id: '2',
      title: 'Focus Sessions',
      description: 'Complete focused work sessions',
      current: 6,
      target: 8,
      color: '#10b981',
      icon: <Timer className="w-4 h-4" />,
      category: 'productivity',
      priority: 'high',
      streak: 12,
      completed: false,
      lastUpdated: new Date(),
      weeklyProgress: [8, 6, 7, 8, 5, 6, 0]
    },
    {
      id: '3',
      title: 'Learning Time',
      description: 'Dedicate time to skill development',
      current: 2,
      target: 3,
      color: '#8b5cf6',
      icon: <BarChart3 className="w-4 h-4" />,
      category: 'learning',
      priority: 'medium',
      streak: 3,
      completed: false,
      lastUpdated: new Date(),
      weeklyProgress: [3, 2, 3, 1, 2, 3, 0]
    }
    */
  ]);

  const [achievements, setAchievements] = useState<Achievement[]>([
    // Mock achievements commented out for clean user experience
    /*
    {
      id: 'streak_7',
      title: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: <Flame className="w-4 h-4" />,
      unlocked: false,
      progress: 5,
      target: 7,
      rarity: 'common'
    },
    {
      id: 'content_50',
      title: 'Content Creator',
      description: 'Create 50 pieces of content',
      icon: <Edit3 className="w-4 h-4" />,
      unlocked: false,
      progress: 32,
      target: 50,
      rarity: 'rare'
    },
    {
      id: 'focus_master',
      title: 'Focus Master',
      description: 'Complete 100 focus sessions',
      icon: <Target className="w-4 h-4" />,
      unlocked: true,
      progress: 100,
      target: 100,
      rarity: 'epic'
    }
    */
  ]);

  const [showDetails, setShowDetails] = useState(false);
  const [newGoalMode, setNewGoalMode] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    target: 1,
    category: 'productivity' as DailyGoal['category'],
    priority: 'medium' as DailyGoal['priority']
  });

  const categoryColors = {
    productivity: '#3b82f6',
    content: '#ef4444',
    health: '#10b981',
    learning: '#8b5cf6',
    social: '#f59e0b'
  };

  const rarityColors = {
    common: '#6b7280',
    rare: '#3b82f6',
    epic: '#8b5cf6',
    legendary: '#f59e0b'
  };

  const updateGoalProgress = (goalId: string, increment: number) => {
    setGoals(prevGoals => {
      return prevGoals.map(goal => {
        if (goal.id === goalId) {
          const newCurrent = Math.max(0, Math.min(goal.target, goal.current + increment));
          const wasCompleted = goal.completed;
          const isNowCompleted = newCurrent >= goal.target;
          
          // Check for goal completion
          if (!wasCompleted && isNowCompleted) {
            onGoalComplete?.(goal);
            
            // Update streak
            const newStreak = goal.streak + 1;
            if (newStreak % 7 === 0) {
              onStreakMilestone?.(newStreak);
            }
          }
          
          return {
            ...goal,
            current: newCurrent,
            completed: isNowCompleted,
            lastUpdated: new Date(),
            streak: isNowCompleted && !wasCompleted ? goal.streak + 1 : goal.streak
          };
        }
        return goal;
      });
    });
  };

  const resetDailyGoals = () => {
    setGoals(prevGoals => 
      prevGoals.map(goal => ({
        ...goal,
        current: 0,
        completed: false,
        lastUpdated: new Date()
      }))
    );
  };

  const getOverallProgress = () => {
    const totalProgress = goals.reduce((sum, goal) => sum + (goal.current / goal.target), 0);
    return Math.round((totalProgress / goals.length) * 100);
  };

  const getCompletedGoals = () => {
    return goals.filter(goal => goal.completed).length;
  };

  const getTotalStreak = () => {
    return goals.reduce((sum, goal) => sum + goal.streak, 0);
  };

  const getMotivationalMessage = () => {
    const progress = getOverallProgress();
    if (progress === 100) return "🎉 Perfect day! All goals crushed!";
    if (progress >= 80) return "🔥 Almost there! You're on fire!";
    if (progress >= 50) return "💪 Great progress! Keep pushing!";
    if (progress >= 25) return "🚀 Good start! Let's build momentum!";
    return "✨ Every journey starts with a single step!";
  };

  const getCategoryIcon = (category: DailyGoal['category']) => {
    switch (category) {
      case 'productivity': return <Timer className="w-4 h-4" />;
      case 'content': return <MessageSquare className="w-4 h-4" />;
      case 'health': return <Heart className="w-4 h-4" />;
      case 'learning': return <BarChart3 className="w-4 h-4" />;
      case 'social': return <Users className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const createNewGoal = () => {
    if (!newGoal.title.trim()) return;

    const goal: DailyGoal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description || `Track your ${newGoal.title.toLowerCase()}`,
      current: 0,
      target: newGoal.target,
      color: categoryColors[newGoal.category],
      icon: getCategoryIcon(newGoal.category),
      category: newGoal.category,
      priority: newGoal.priority,
      streak: 0,
      completed: false,
      lastUpdated: new Date(),
      weeklyProgress: [0, 0, 0, 0, 0, 0, 0]
    };

    setGoals(prev => [...prev, goal]);
    setNewGoal({
      title: '',
      description: '',
      target: 1,
      category: 'productivity',
      priority: 'medium'
    });
    setNewGoalMode(false);
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)] text-white">
              <Target className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-sm text-[var(--text-primary)] truncate">Daily Goals</h3>
              <p className="text-xs text-[var(--text-secondary)] truncate">
                {getCompletedGoals()}/{goals.length} completed • {getOverallProgress()}% progress
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
            >
              <BarChart3 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetDailyGoals}
              title="Reset daily goals"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="space-y-3">
          <div className="text-center">
            <motion.div
              key={getOverallProgress()}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-3xl font-bold bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] bg-clip-text text-transparent"
            >
              {getOverallProgress()}%
            </motion.div>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              {getMotivationalMessage()}
            </p>
          </div>
          
          <ProgressBar
            value={getOverallProgress()}
            color="var(--brand-primary)"
            size="md"
            className="rounded-full"
          />
          
          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="flex items-center justify-center space-x-1">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-lg font-bold text-orange-500">{getTotalStreak()}</span>
              </div>
              <div className="text-xs text-[var(--text-secondary)]">Total Streak</div>
            </div>
            <div>
              <div className="flex items-center justify-center space-x-1">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="text-lg font-bold text-yellow-500">{achievements.filter(a => a.unlocked).length}</span>
              </div>
              <div className="text-xs text-[var(--text-secondary)]">Achievements</div>
            </div>
            <div>
              <div className="flex items-center justify-center space-x-1">
                <Star className="w-4 h-4 text-blue-500" />
                <span className="text-lg font-bold text-blue-500">{getCompletedGoals()}</span>
              </div>
              <div className="text-xs text-[var(--text-secondary)]">Today</div>
            </div>
          </div>
        </div>

        {/* Goals List */}
        <div className="space-y-3">
          {goals.map((goal, index) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                goal.completed 
                  ? 'bg-green-500/10 border-green-500/30' 
                  : 'bg-[var(--surface-secondary)] border-[var(--border-primary)] hover:border-[var(--brand-primary)]30'
              }`}
              onClick={() => setSelectedGoal(selectedGoal === goal.id ? null : goal.id)}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="p-2 rounded-lg text-white"
                      style={{ backgroundColor: goal.color }}
                    >
                      {goal.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-[var(--text-primary)] text-sm">
                          {goal.title}
                        </h4>
                        {goal.completed && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                        {goal.streak > 0 && (
                          <Badge variant="warning" className="text-xs">
                            {goal.streak}🔥
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-[var(--text-secondary)]">
                        {goal.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight 
                    className={`w-4 h-4 text-[var(--text-tertiary)] transition-transform ${
                      selectedGoal === goal.id ? 'rotate-90' : ''
                    }`} 
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[var(--text-tertiary)]">
                      Progress
                    </span>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateGoalProgress(goal.id, -1);
                        }}
                        disabled={goal.current <= 0}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="text-sm font-medium text-[var(--text-primary)] min-w-[3rem] text-center">
                        {goal.current}/{goal.target}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateGoalProgress(goal.id, 1);
                        }}
                        disabled={goal.current >= goal.target}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <ProgressBar
                    value={(goal.current / goal.target) * 100}
                    color={goal.color}
                    size="sm"
                  />
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {selectedGoal === goal.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pt-3 border-t border-[var(--border-primary)]"
                    >
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="text-[var(--text-secondary)]">Category:</span>
                            <Badge 
                              variant="neutral" 
                              className="ml-2 capitalize"
                              style={{ backgroundColor: `${categoryColors[goal.category]}20`, color: categoryColors[goal.category] }}
                            >
                              {goal.category}
                            </Badge>
                          </div>
                          <div>
                            <span className="text-[var(--text-secondary)]">Priority:</span>
                            <Badge 
                              variant={goal.priority === 'high' ? 'danger' : goal.priority === 'medium' ? 'warning' : 'neutral'}
                              className="ml-2 capitalize"
                            >
                              {goal.priority}
                            </Badge>
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="text-xs font-medium text-[var(--text-primary)] mb-2">Weekly Progress</h5>
                          <div className="flex items-end space-x-1 h-8">
                            {goal.weeklyProgress.map((value, i) => (
                              <div
                                key={i}
                                className="flex-1 rounded-t"
                                style={{
                                  height: `${(value / goal.target) * 100}%`,
                                  backgroundColor: i === goal.weeklyProgress.length - 1 ? goal.color : `${goal.color}60`,
                                  minHeight: '4px'
                                }}
                                title={`${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}: ${value}/${goal.target}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Achievements */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-[var(--text-primary)]">Recent Achievements</h4>
          <div className="space-y-2">
            {achievements.slice(0, 2).map((achievement) => (
              <div
                key={achievement.id}
                className={`p-3 rounded-lg border transition-all ${
                  achievement.unlocked
                    ? 'bg-yellow-500/10 border-yellow-500/30'
                    : 'bg-[var(--surface-secondary)] border-[var(--border-primary)]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className={`p-2 rounded-lg ${
                      achievement.unlocked ? 'bg-yellow-500 text-white' : 'bg-[var(--surface-tertiary)] text-[var(--text-secondary)]'
                    }`}
                  >
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h5 className="text-sm font-medium text-[var(--text-primary)]">
                        {achievement.title}
                      </h5>
                      <Badge 
                        variant="neutral"
                        style={{ 
                          backgroundColor: `${rarityColors[achievement.rarity]}20`,
                          color: rarityColors[achievement.rarity]
                        }}
                        className="text-xs capitalize"
                      >
                        {achievement.rarity}
                      </Badge>
                      {achievement.unlocked && (
                        <Trophy className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {achievement.description}
                    </p>
                    {!achievement.unlocked && (
                      <div className="mt-2">
                        <ProgressBar
                          value={(achievement.progress / achievement.target) * 100}
                          color={rarityColors[achievement.rarity]}
                          size="xs"
                        />
                        <div className="text-xs text-[var(--text-tertiary)] mt-1">
                          {achievement.progress}/{achievement.target}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add New Goal */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setNewGoalMode(true)}
          className="w-full border-2 border-dashed border-[var(--border-primary)] hover:border-[var(--brand-primary)] transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Goal
        </Button>

        {/* New Goal Modal */}
        <AnimatePresence>
          {newGoalMode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              onClick={() => setNewGoalMode(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-[var(--surface-primary)] rounded-2xl p-6 w-full max-w-md mx-4 border border-[var(--border-primary)]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-[var(--text-primary)]">Create New Goal</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setNewGoalMode(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                        Goal Title *
                      </label>
                      <input
                        type="text"
                        value={newGoal.title}
                        onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g., Write blog posts, Exercise, Learn coding..."
                        className="w-full px-3 py-2 bg-[var(--surface-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--brand-primary)]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                        Description
                      </label>
                      <input
                        type="text"
                        value={newGoal.description}
                        onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Optional description of your goal"
                        className="w-full px-3 py-2 bg-[var(--surface-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--brand-primary)]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                          Daily Target
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={newGoal.target}
                          onChange={(e) => setNewGoal(prev => ({ ...prev, target: Math.max(1, parseInt(e.target.value) || 1) }))}
                          className="w-full px-3 py-2 bg-[var(--surface-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-primary)]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                          Priority
                        </label>
                        <select
                          value={newGoal.priority}
                          onChange={(e) => setNewGoal(prev => ({ ...prev, priority: e.target.value as DailyGoal['priority'] }))}
                          className="w-full px-3 py-2 bg-[var(--surface-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-primary)]"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                        Category
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {Object.entries(categoryColors).map(([category, color]) => (
                          <button
                            key={category}
                            onClick={() => setNewGoal(prev => ({ ...prev, category: category as DailyGoal['category'] }))}
                            className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center space-y-1 ${
                              newGoal.category === category
                                ? 'border-2 bg-opacity-20'
                                : 'border-[var(--border-primary)] hover:border-[var(--brand-primary)]30'
                            }`}
                            style={{
                              borderColor: newGoal.category === category ? color : undefined,
                              backgroundColor: newGoal.category === category ? `${color}20` : undefined
                            }}
                          >
                            <div
                              className="p-2 rounded-lg text-white"
                              style={{ backgroundColor: color }}
                            >
                              {getCategoryIcon(category as DailyGoal['category'])}
                            </div>
                            <span className="text-xs font-medium text-[var(--text-primary)] capitalize">
                              {category}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      variant="ghost"
                      onClick={() => setNewGoalMode(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={createNewGoal}
                      disabled={!newGoal.title.trim()}
                      className="flex-1"
                    >
                      Create Goal
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
};

export default DailyGoalsPro;
