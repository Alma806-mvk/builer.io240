import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  QuestionMarkCircleIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import IntelligentAIAssistant from './IntelligentAIAssistant';
import { UserContext } from '../services/intelligentAIAssistantService';

interface FloatingAIAssistantProps {
  onNavigateToTab?: (tab: string) => void;
  userContext?: UserContext;
  userPlan?: string;
  isVisible?: boolean;
  currentTool?: string;
}

const FloatingAIAssistant: React.FC<FloatingAIAssistantProps> = ({
  onNavigateToTab,
  userContext,
  userPlan = 'free',
  isVisible = true,
  currentTool,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewSuggestion, setHasNewSuggestion] = useState(false);
  const [showPulse, setShowPulse] = useState(true);
  const [assistantStatus, setAssistantStatus] = useState<'ready' | 'thinking' | 'offline'>('ready');
  const [notificationCount, setNotificationCount] = useState(0);

  // Enhanced user context with current tool
  const actualCurrentTool = currentTool || 'studioHub';
  const enhancedUserContext: UserContext = {
    ...userContext,
    currentTool: actualCurrentTool,
    userPlan,
    conversationHistory: userContext?.conversationHistory || []
  } as UserContext;

  // Show pulse animation on first load, then periodically
  useEffect(() => {
    const pulseTimer = setTimeout(() => {
      setShowPulse(false);
    }, 5000);

    // Periodically show pulse to draw attention when there might be helpful suggestions
    const periodicPulse = setInterval(() => {
      if (!isOpen && Math.random() > 0.7) { // 30% chance every 2 minutes
        setShowPulse(true);
        setHasNewSuggestion(true);
        setTimeout(() => {
          setShowPulse(false);
          setHasNewSuggestion(false);
        }, 8000);
      }
    }, 120000); // Every 2 minutes

    return () => {
      clearTimeout(pulseTimer);
      clearInterval(periodicPulse);
    };
  }, [isOpen]);

  // Contextual suggestions based on current tool
  useEffect(() => {
    if (!isOpen && actualCurrentTool) {
      // Show contextual hints based on the tool being used
      const toolSuggestions = {
        generator: "💡 Need content ideas? I can suggest trending topics!",
        canvas: "🎨 Want design tips? I can help optimize your layout!",
        thumbnails: "📸 Struggling with CTR? I know what makes thumbnails click!",
        ytAnalysis: "📊 Need competitor insights? I can guide your analysis!",
        strategy: "🎯 Building a strategy? I have proven frameworks to share!",
        trends: "🔥 Found trends? I can help you create viral content!",
      };

      if (toolSuggestions[actualCurrentTool as keyof typeof toolSuggestions]) {
        const suggestionTimer = setTimeout(() => {
          if (!isOpen) {
            setHasNewSuggestion(true);
            setNotificationCount(prev => prev + 1);
            setTimeout(() => setHasNewSuggestion(false), 15000);
          }
        }, Math.random() * 30000 + 60000); // Random delay between 1-1.5 minutes

        return () => clearTimeout(suggestionTimer);
      }
    }
  }, [actualCurrentTool, isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
    setHasNewSuggestion(false);
    setShowPulse(false);
    setNotificationCount(0);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const getPlanFeatures = () => {
    switch (userPlan) {
      case 'creator':
      case 'pro':
        return {
          dailyQuestions: 50,
          features: ['Advanced Workflows', 'Performance Analysis', 'Strategic Insights'],
          badge: '⭐ Creator Pro',
          badgeColor: 'from-orange-500 to-amber-500',
          description: 'Pro-level AI assistance with advanced features'
        };
      case 'agency':
        return {
          dailyQuestions: 'Unlimited',
          features: ['Team Workflows', 'Client Strategy', 'Advanced Analytics'],
          badge: '🚀 Agency Pro',
          badgeColor: 'from-blue-500 to-cyan-500',
          description: 'Agency-focused AI with team collaboration features'
        };
      case 'enterprise':
        return {
          dailyQuestions: 'Unlimited',
          features: ['Custom Solutions', 'Priority Support', 'Advanced Training'],
          badge: '💎 Enterprise',
          badgeColor: 'from-purple-500 to-indigo-500',
          description: 'Enterprise-grade AI with custom solutions'
        };
      default:
        return {
          dailyQuestions: 5,
          features: ['Basic Guidance', 'Tool Help', 'Getting Started'],
          badge: 'Free',
          badgeColor: 'from-slate-500 to-slate-600',
          description: 'Essential AI assistance to get you started'
        };
    }
  };

  const planFeatures = getPlanFeatures();

  const getStatusIcon = () => {
    switch (assistantStatus) {
      case 'thinking':
        return <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <SparklesIcon className="w-6 h-6 text-blue-400" />
        </motion.div>;
      case 'offline':
        return <ExclamationCircleIcon className="w-6 h-6 text-red-400" />;
      default:
        return <SparklesIcon className="w-6 h-6 text-purple-400" />;
    }
  };

  const getFloatingButtonContent = () => {
    if (hasNewSuggestion) {
      return (
        <div className="relative">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <SparklesIcon className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-sm font-medium">New Ideas!</span>
          </div>
          {notificationCount > 0 && (
            <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">{notificationCount > 9 ? '9+' : notificationCount}</span>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        {getStatusIcon()}
        <span className="text-sm font-medium">AI Assistant</span>
      </div>
    );
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpen}
            className={`fixed bottom-6 right-6 z-40 px-4 py-3 rounded-full shadow-2xl border transition-all duration-300 ${
              hasNewSuggestion
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 border-green-400/50 animate-pulse'
                : assistantStatus === 'offline'
                  ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 border-red-400/50'
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 border-purple-400/50'
            } text-white`}
          >
            {/* Pulse ring for attention */}
            {showPulse && (
              <motion.div
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-purple-400"
              />
            )}
            
            {getFloatingButtonContent()}
          </motion.button>
        )}
      </AnimatePresence>

      {/* AI Assistant Modal */}
      <AnimatePresence>
        {isOpen && (
          <IntelligentAIAssistant
            isOpen={isOpen}
            onClose={handleClose}
            userContext={{ ...enhancedUserContext, userPlan }}
            onNavigateToTab={onNavigateToTab}
            position="floating"
          />
        )}
      </AnimatePresence>

      {/* Status Indicator (small, unobtrusive) */}
      {!isOpen && assistantStatus !== 'ready' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-20 right-6 z-30 px-3 py-2 bg-slate-800/90 backdrop-blur-xl border border-slate-600/50 rounded-lg text-xs text-slate-300"
        >
          <div className="flex items-center gap-2">
            {assistantStatus === 'thinking' && (
              <>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                <span>AI is analyzing...</span>
              </>
            )}
            {assistantStatus === 'offline' && (
              <>
                <div className="w-2 h-2 bg-red-400 rounded-full" />
                <span>Connection issue</span>
              </>
            )}
          </div>
        </motion.div>
      )}

      {/* Contextual Tips Overlay (appears occasionally) */}
      {hasNewSuggestion && !isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="fixed bottom-24 right-20 z-30 max-w-xs p-4 bg-gradient-to-r from-purple-900/95 to-blue-900/95 backdrop-blur-xl border border-purple-400/50 rounded-xl shadow-2xl"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <SparklesIcon className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-1">AI Tip</h4>
              <p className="text-xs text-purple-200 leading-relaxed">
                {actualCurrentTool === 'generator' && "💡 I can suggest trending topics for your next video!"}
                {actualCurrentTool === 'canvas' && "🎨 Need help with your design layout? I have proven templates!"}
                {actualCurrentTool === 'thumbnails' && "📸 Want thumbnails that get 10%+ CTR? I know the secrets!"}
                {actualCurrentTool === 'ytAnalysis' && "📊 Analyzing competitors? I can guide you to find their best strategies!"}
                {actualCurrentTool === 'strategy' && "🎯 Building a content strategy? I have frameworks that work!"}
                {actualCurrentTool === 'trends' && "🔥 Found good trends? I can help you create viral content around them!"}
                {!['generator', 'canvas', 'thumbnails', 'ytAnalysis', 'strategy', 'trends'].includes(actualCurrentTool) &&
                  "🚀 I'm here to help! Ask me anything about CreateGen Studio - I know every feature!"}
              </p>
              <button
                onClick={handleOpen}
                className="mt-2 text-xs font-medium text-purple-300 hover:text-white transition-colors"
              >
                Ask me anything →
              </button>
            </div>
            <button
              onClick={() => setHasNewSuggestion(false)}
              className="flex-shrink-0 text-purple-300 hover:text-white transition-colors"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Plan Features Badge (shows occasionally) */}
      {!isOpen && Math.random() > 0.95 && ( // Very rare appearance
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className="fixed bottom-6 right-40 z-20 px-3 py-2 bg-slate-800/90 backdrop-blur-xl border border-slate-600/50 rounded-lg text-xs"
        >
          <div className="flex items-center gap-2">
            <div className={`px-2 py-1 rounded text-xs font-medium bg-gradient-to-r ${planFeatures.badgeColor} text-white`}>
              {planFeatures.badge}
            </div>
            <span className="text-slate-300">{planFeatures.dailyQuestions} questions/day</span>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default FloatingAIAssistant;
