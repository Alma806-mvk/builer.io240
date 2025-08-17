import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChartBarIcon,
  CalendarIcon,
  SparklesIcon,
  TrophyIcon,
  CheckCircleIcon,
  PlusIcon,
  XMarkIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";

interface Goal {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  period: "daily" | "weekly" | "monthly";
  category: "content" | "analytics" | "engagement" | "learning";
  color: string;
  icon: string;
  deadline?: Date;
  isCompleted: boolean;
}

const GOAL_CATEGORIES = {
  content: { color: "text-blue-400", bgColor: "bg-blue-500", icon: SparklesIcon },
  analytics: { color: "text-green-400", bgColor: "bg-green-500", icon: ChartBarIcon },
  engagement: { color: "text-purple-400", bgColor: "bg-purple-500", icon: TrophyIcon },
  learning: { color: "text-yellow-400", bgColor: "bg-yellow-500", icon: CalendarIcon },
};

const PRESET_GOALS = [
  { title: "Daily Content", target: 3, unit: "posts", period: "daily", category: "content" },
  { title: "Weekly Analytics", target: 5, unit: "reports", period: "weekly", category: "analytics" },
  { title: "Monthly Engagement", target: 1000, unit: "interactions", period: "monthly", category: "engagement" },
  { title: "Learning Goals", target: 2, unit: "skills", period: "weekly", category: "learning" },
];

const ProgressRings: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    target: 1,
    unit: "items",
    period: "daily" as "daily" | "weekly" | "monthly",
    category: "content" as keyof typeof GOAL_CATEGORIES,
  });

  // Load goals from localStorage
  useEffect(() => {
    const savedGoals = localStorage.getItem('studioHub:progressGoals');
    if (savedGoals) {
      const parsedGoals = JSON.parse(savedGoals);
      setGoals(parsedGoals.map((goal: any) => ({
        ...goal,
        deadline: goal.deadline ? new Date(goal.deadline) : undefined
      })));
    } else {
      // Initialize with default goals
      const defaultGoals: Goal[] = PRESET_GOALS.map((preset, index) => ({
        id: `default-${index}`,
        ...preset,
        description: `Track your ${preset.title.toLowerCase()}`,
        current: Math.floor(Math.random() * preset.target),
        color: GOAL_CATEGORIES[preset.category as keyof typeof GOAL_CATEGORIES].color,
        icon: preset.category,
        isCompleted: false,
      }));
      setGoals(defaultGoals);
    }
  }, []);

  // Save goals to localStorage
  useEffect(() => {
    localStorage.setItem('studioHub:progressGoals', JSON.stringify(goals));
  }, [goals]);

  const calculateProgress = (goal: Goal): number => {
    return Math.min((goal.current / goal.target) * 100, 100);
  };

  const updateGoalProgress = (goalId: string, newCurrent: number) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { 
            ...goal, 
            current: Math.max(0, newCurrent),
            isCompleted: newCurrent >= goal.target
          }
        : goal
    ));
  };

  const addGoal = () => {
    if (!newGoal.title.trim()) return;

    const goal: Goal = {
      id: Date.now().toString(),
      ...newGoal,
      current: 0,
      color: GOAL_CATEGORIES[newGoal.category].color,
      icon: newGoal.category,
      isCompleted: false,
    };

    setGoals(prev => [...prev, goal]);
    setNewGoal({
      title: "",
      description: "",
      target: 1,
      unit: "items",
      period: "daily",
      category: "content",
    });
    setShowAddGoal(false);
  };

  const deleteGoal = (goalId: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId));
  };

  const CircularProgress: React.FC<{ 
    progress: number; 
    size: number; 
    strokeWidth: number; 
    color: string;
    goal: Goal;
  }> = ({ progress, size, strokeWidth, color, goal }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = `${circumference} ${circumference}`;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    const IconComponent = GOAL_CATEGORIES[goal.category as keyof typeof GOAL_CATEGORIES].icon;

    return (
      <div className="relative inline-block">
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-slate-700"
          />
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            className={color}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <IconComponent className={`w-5 h-5 ${color} mb-1`} />
          <span className="text-xs font-semibold text-white">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="progress-rings bg-slate-800/50 rounded-xl border border-slate-700 p-4">
      {/* Header */}
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <TrophyIcon className="w-5 h-5 text-yellow-400" />
          <h3 className="font-semibold text-white">Daily Goals</h3>
          <span className="text-xs bg-slate-600 text-slate-300 px-2 py-1 rounded-full">
            {goals.filter(g => g.isCompleted).length}/{goals.length}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </div>

      {/* Compact view - show progress rings in a row */}
      {!isExpanded && goals.length > 0 && (
        <div className="flex items-center gap-3 mt-3 overflow-x-auto">
          {goals.slice(0, 4).map((goal) => (
            <motion.div
              key={goal.id}
              className="flex-shrink-0"
              whileHover={{ scale: 1.05 }}
            >
              <CircularProgress
                progress={calculateProgress(goal)}
                size={48}
                strokeWidth={4}
                color={goal.color}
                goal={goal}
              />
            </motion.div>
          ))}
          {goals.length > 4 && (
            <span className="text-xs text-slate-400 ml-2">+{goals.length - 4} more</span>
          )}
        </div>
      )}

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 space-y-4"
          >
            {/* Goals Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {goals.map((goal) => {
                const progress = calculateProgress(goal);
                return (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`p-3 rounded-lg border ${
                      goal.isCompleted 
                        ? 'bg-green-500/10 border-green-500/30' 
                        : 'bg-slate-700/30 border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CircularProgress
                          progress={progress}
                          size={40}
                          strokeWidth={3}
                          color={goal.color}
                          goal={goal}
                        />
                        <div>
                          <h4 className="text-sm font-medium text-white">{goal.title}</h4>
                          <p className="text-xs text-slate-400">{goal.period}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-600 rounded text-slate-400 hover:text-red-300 transition-all"
                      >
                        <XMarkIcon className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-300">
                        {goal.current} / {goal.target} {goal.unit}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => updateGoalProgress(goal.id, goal.current - 1)}
                          className="w-6 h-6 bg-slate-600 hover:bg-slate-500 rounded text-white text-xs flex items-center justify-center"
                        >
                          −
                        </button>
                        <button
                          onClick={() => updateGoalProgress(goal.id, goal.current + 1)}
                          className="w-6 h-6 bg-blue-500 hover:bg-blue-600 rounded text-white text-xs flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {goal.isCompleted && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-1 mt-2 text-green-400"
                      >
                        <CheckCircleIcon className="w-4 h-4" />
                        <span className="text-xs">Completed!</span>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Add New Goal */}
            <div>
              {!showAddGoal ? (
                <button
                  onClick={() => setShowAddGoal(true)}
                  className="flex items-center gap-2 w-full p-3 border-2 border-dashed border-slate-600 rounded-lg text-slate-400 hover:border-slate-500 hover:text-slate-300 transition-colors"
                >
                  <PlusIcon className="w-4 h-4" />
                  Add New Goal
                </button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-slate-700/30 border border-slate-600 rounded-lg space-y-3"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Goal title"
                      value={newGoal.title}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                      className="col-span-2 p-2 bg-slate-700 border border-slate-600 rounded text-white text-sm placeholder-slate-400"
                    />
                    <input
                      type="number"
                      placeholder="Target"
                      value={newGoal.target}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, target: parseInt(e.target.value) || 1 }))}
                      className="p-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Unit (posts, views, etc.)"
                      value={newGoal.unit}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, unit: e.target.value }))}
                      className="p-2 bg-slate-700 border border-slate-600 rounded text-white text-sm placeholder-slate-400"
                    />
                    <select
                      value={newGoal.period}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, period: e.target.value as any }))}
                      className="p-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                    <select
                      value={newGoal.category}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, category: e.target.value as any }))}
                      className="p-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                    >
                      <option value="content">Content</option>
                      <option value="analytics">Analytics</option>
                      <option value="engagement">Engagement</option>
                      <option value="learning">Learning</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={addGoal}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded text-sm font-medium"
                    >
                      Add Goal
                    </button>
                    <button
                      onClick={() => setShowAddGoal(false)}
                      className="bg-slate-600 hover:bg-slate-500 text-white py-2 px-4 rounded text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProgressRings;
