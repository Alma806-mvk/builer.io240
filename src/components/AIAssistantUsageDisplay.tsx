import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SparklesIcon,
  ExclamationTriangleIcon,
  FireIcon,
  ClockIcon,
  ChartBarIcon,
  ArrowUpIcon,
  GiftIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';
// Temporarily commented out to fix Firebase permissions error
// import { aiAssistantUsageService, UsageStats } from '../services/aiAssistantUsageService';
import { UsageStats } from '../services/aiAssistantUsageService';
import { useSubscription } from '../context/SubscriptionContext';
import { auth } from '../config/firebase';

interface AIAssistantUsageDisplayProps {
  userPlan: string;
  className?: string;
  compact?: boolean;
  onUpgradeClick?: () => void;
}

export const AIAssistantUsageDisplay: React.FC<AIAssistantUsageDisplayProps> = ({
  userPlan,
  className = '',
  compact = false,
  onUpgradeClick,
}) => {
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const { billingInfo } = useSubscription();

  useEffect(() => {
    loadUsageStats();
    const interval = setInterval(loadUsageStats, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [userPlan]);

  const loadUsageStats = async () => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    // Temporarily use fallback stats until Firestore rules are deployed
    setUsageStats({
      questionsRemaining: userPlan === 'premium' ? 999 : 5,
      questionsUsed: 0,
      dailyLimit: userPlan === 'premium' ? 999 : 5,
      isUnlimited: userPlan === 'premium',
      percentageUsed: 0,
      resetsAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      planLevel: userPlan || 'free'
    });
    setLoading(false);

    // TODO: Re-enable once Firestore rules are deployed
    /*
    try {
      const stats = await aiAssistantUsageService.getUsageStats(auth.currentUser.uid, userPlan);
      setUsageStats(stats);
    } catch (error) {
      console.error('Error loading usage stats:', error);
    } finally {
      setLoading(false);
    }
    */
  };

  const getUsageColor = () => {
    if (!usageStats || usageStats.isUnlimited) return 'text-green-400';
    
    if (usageStats.percentageUsed >= 90) return 'text-red-400';
    if (usageStats.percentageUsed >= 70) return 'text-orange-400';
    if (usageStats.percentageUsed >= 50) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getProgressBarColor = () => {
    if (!usageStats || usageStats.isUnlimited) return 'bg-green-500';
    
    if (usageStats.percentageUsed >= 90) return 'bg-red-500';
    if (usageStats.percentageUsed >= 70) return 'bg-orange-500';
    if (usageStats.percentageUsed >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getUsageIcon = () => {
    if (!usageStats) return <SparklesIcon className="w-4 h-4" />;
    
    if (usageStats.isUnlimited) return <FireIcon className="w-4 h-4 text-purple-400" />;
    if (usageStats.questionsRemaining === 0) return <LockClosedIcon className="w-4 h-4 text-red-400" />;
    if (usageStats.percentageUsed >= 90) return <ExclamationTriangleIcon className="w-4 h-4 text-red-400" />;
    return <SparklesIcon className="w-4 h-4" />;
  };

  const getTimeUntilReset = () => {
    if (!usageStats) return '';
    
    const now = new Date();
    const reset = usageStats.resetsAt;
    const diff = reset.getTime() - now.getTime();
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getPlanDisplayName = () => {
    switch (userPlan) {
      case 'creator':
      case 'pro':
        return 'Creator Pro';
      case 'agency':
      case 'agency pro':
        return 'Agency Pro';
      case 'enterprise':
        return 'Enterprise';
      default:
        return 'Free';
    }
  };

  const getPlanFeatures = () => {
    switch (userPlan) {
      case 'creator':
      case 'pro':
        return ['50 AI questions/day', 'Advanced insights', 'Priority support'];
      case 'agency':
      case 'agency pro':
        return ['Unlimited AI questions', 'Team features', 'Advanced analytics'];
      case 'enterprise':
        return ['Unlimited everything', 'Custom solutions', 'Dedicated support'];
      default:
        return ['5 AI questions/day', 'Basic guidance', 'Community support'];
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="w-4 h-4 bg-slate-600 rounded animate-pulse" />
        <div className="w-16 h-4 bg-slate-600 rounded animate-pulse" />
      </div>
    );
  }

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {getUsageIcon()}
        <span className={`text-sm font-medium ${getUsageColor()}`}>
          {usageStats?.isUnlimited 
            ? '∞' 
            : `${usageStats?.questionsRemaining || 0}/${usageStats?.dailyLimit || 5}`
          }
        </span>
      </div>
    );
  }

  return (
    <div className={`bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {getUsageIcon()}
          <span className="text-sm font-medium text-slate-300">AI Assistant</span>
          <div className="px-2 py-1 bg-slate-700/50 rounded text-xs font-medium text-slate-400">
            {getPlanDisplayName()}
          </div>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-slate-400 hover:text-slate-300 transition-colors"
        >
          <ChartBarIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Usage Display */}
      <div className="space-y-3">
        {usageStats?.isUnlimited ? (
          <div className="flex items-center gap-2 text-purple-400">
            <FireIcon className="w-5 h-5" />
            <span className="font-semibold">Unlimited Questions</span>
          </div>
        ) : (
          <>
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className={`font-medium ${getUsageColor()}`}>
                  {usageStats?.questionsRemaining || 0} remaining
                </span>
                <span className="text-slate-400">
                  {usageStats?.questionsUsed || 0}/{usageStats?.dailyLimit || 5}
                </span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${usageStats?.percentageUsed || 0}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={`h-2 rounded-full ${getProgressBarColor()}`}
                />
              </div>
            </div>

            {/* Reset Timer */}
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ClockIcon className="w-3 h-3" />
              <span>Resets in {getTimeUntilReset()}</span>
            </div>
          </>
        )}

        {/* Low Usage Warning */}
        {usageStats && !usageStats.isUnlimited && usageStats.questionsRemaining <= 1 && usageStats.questionsRemaining > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 text-xs"
          >
            <div className="flex items-center gap-2 text-orange-400 mb-1">
              <ExclamationTriangleIcon className="w-4 h-4" />
              <span className="font-semibold">Almost out of questions!</span>
            </div>
            <p className="text-orange-300">
              You have {usageStats.questionsRemaining} question{usageStats.questionsRemaining !== 1 ? 's' : ''} left today.
            </p>
          </motion.div>
        )}

        {/* Out of Questions */}
        {usageStats && !usageStats.isUnlimited && usageStats.questionsRemaining === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-xs"
          >
            <div className="flex items-center gap-2 text-red-400 mb-2">
              <LockClosedIcon className="w-4 h-4" />
              <span className="font-semibold">Daily limit reached</span>
            </div>
            <p className="text-red-300 mb-3">
              You've used all {usageStats.dailyLimit} questions for today. Questions reset in {getTimeUntilReset()}.
            </p>
            {onUpgradeClick && (
              <button
                onClick={onUpgradeClick}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-2 justify-center"
              >
                <ArrowUpIcon className="w-3 h-3" />
                Upgrade for More Questions
              </button>
            )}
          </motion.div>
        )}

        {/* Upgrade Hint for Free Users */}
        {usageStats && userPlan === 'free' && usageStats.percentageUsed >= 60 && usageStats.questionsRemaining > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-xs"
          >
            <div className="flex items-center gap-2 text-blue-400 mb-1">
              <GiftIcon className="w-4 h-4" />
              <span className="font-semibold">Get 10x more questions!</span>
            </div>
            <p className="text-blue-300 mb-2">
              Upgrade to Creator Pro for 50 questions per day plus advanced features.
            </p>
            {onUpgradeClick && (
              <button
                onClick={onUpgradeClick}
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Learn more →
              </button>
            )}
          </motion.div>
        )}

        {/* Detailed Stats */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-slate-700/50 pt-3 space-y-2"
            >
              <div className="text-xs text-slate-400">
                <span className="font-medium">Plan Features:</span>
              </div>
              {getPlanFeatures().map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                  <span>{feature}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AIAssistantUsageDisplay;
