import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SparklesIcon,
  XMarkIcon,
  ArrowUpIcon,
  FireIcon,
  ChartBarIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  RocketLaunchIcon,
  GiftIcon,
  ClockIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { UsageStats } from '../services/aiAssistantUsageService';

interface AIAssistantUpgradePromptProps {
  isOpen: boolean;
  onClose: () => void;
  usageStats: UsageStats | null;
  currentPlan: string;
  onUpgrade: (plan: string) => void;
  trigger?: 'limit_reached' | 'low_usage' | 'premium_feature' | 'manual';
}

export const AIAssistantUpgradePrompt: React.FC<AIAssistantUpgradePromptProps> = ({
  isOpen,
  onClose,
  usageStats,
  currentPlan,
  onUpgrade,
  trigger = 'manual',
}) => {
  const [selectedPlan, setSelectedPlan] = useState<string>('creator');
  const [showComparison, setShowComparison] = useState(false);

  const getPromptTitle = () => {
    switch (trigger) {
      case 'limit_reached':
        return 'Daily AI Question Limit Reached';
      case 'low_usage':
        return 'Running Low on AI Questions';
      case 'premium_feature':
        return 'Unlock Premium AI Features';
      default:
        return 'Upgrade Your AI Assistant';
    }
  };

  const getPromptDescription = () => {
    switch (trigger) {
      case 'limit_reached':
        return `You've used all ${usageStats?.dailyLimit || 5} AI questions for today. Upgrade to get unlimited access and advanced features.`;
      case 'low_usage':
        return `You have ${usageStats?.questionsRemaining || 0} questions left today. Upgrade to never worry about limits again.`;
      case 'premium_feature':
        return 'This advanced AI feature requires a premium plan. Upgrade to unlock the full potential of your AI assistant.';
      default:
        return 'Get more AI questions, advanced features, and priority support with a premium plan.';
    }
  };

  const plans = [
    {
      id: 'creator',
      name: 'Creator Pro',
      price: '$9.99',
      period: '/month',
      questions: '50 questions/day',
      highlight: 'Most Popular',
      color: 'from-orange-500 to-amber-500',
      features: [
        '50 AI questions per day',
        'Advanced content insights',
        'Priority response speed',
        'Export conversation history',
        'Email support',
      ],
      icon: <SparklesIcon className="w-6 h-6" />,
    },
    {
      id: 'agency',
      name: 'Agency Pro',
      price: '$29.99',
      period: '/month',
      questions: 'Unlimited questions',
      highlight: 'Best Value',
      color: 'from-blue-500 to-cyan-500',
      features: [
        'Unlimited AI questions',
        'Team collaboration features',
        'Advanced analytics dashboard',
        'Custom AI personality training',
        'Priority support',
        'White-label options',
      ],
      icon: <UserGroupIcon className="w-6 h-6" />,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      questions: 'Everything unlimited',
      highlight: 'Enterprise',
      color: 'from-purple-500 to-indigo-500',
      features: [
        'Everything unlimited',
        'Custom AI model training',
        'Dedicated account manager',
        'SLA guarantees',
        '24/7 phone support',
        'Custom integrations',
      ],
      icon: <ShieldCheckIcon className="w-6 h-6" />,
    },
  ];

  const getCurrentPlanLimitations = () => {
    if (currentPlan === 'free') {
      return [
        'Only 5 AI questions per day',
        'Basic responses only',
        'No conversation history',
        'Community support only',
      ];
    }
    return [];
  };

  const getUpgradeReasons = () => {
    switch (trigger) {
      case 'limit_reached':
        return [
          'Never hit daily limits again',
          'Get instant answers anytime',
          'Access advanced AI features',
          'Export your conversations',
        ];
      case 'low_usage':
        return [
          `10x more questions (${plans[0].questions})`,
          'Advanced content insights',
          'Priority response speed',
          'Never worry about limits',
        ];
      case 'premium_feature':
        return [
          'Unlock all premium features',
          'Advanced AI capabilities',
          'Custom personality training',
          'Team collaboration tools',
        ];
      default:
        return [
          'More AI questions daily',
          'Advanced features',
          'Better response quality',
          'Priority support',
        ];
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative p-6 border-b border-slate-700/50">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-300 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            
            <div className="flex items-center gap-3 mb-2">
              {trigger === 'limit_reached' && <ClockIcon className="w-8 h-8 text-red-400" />}
              {trigger === 'low_usage' && <GiftIcon className="w-8 h-8 text-orange-400" />}
              {trigger === 'premium_feature' && <RocketLaunchIcon className="w-8 h-8 text-purple-400" />}
              {trigger === 'manual' && <SparklesIcon className="w-8 h-8 text-blue-400" />}
              
              <div>
                <h2 className="text-2xl font-bold text-white">{getPromptTitle()}</h2>
                <p className="text-slate-400 mt-1">{getPromptDescription()}</p>
              </div>
            </div>

            {/* Current Usage Stats */}
            {usageStats && !usageStats.isUnlimited && (
              <div className="bg-slate-800/50 rounded-lg p-4 mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">Today's Usage</span>
                  <span className="text-sm font-medium text-slate-300">
                    {usageStats.questionsUsed}/{usageStats.dailyLimit}
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${usageStats.percentageUsed}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Upgrade Benefits */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Why upgrade?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getUpgradeReasons().map((reason, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-slate-300">{reason}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Plan Comparison Toggle */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Choose Your Plan</h3>
              <button
                onClick={() => setShowComparison(!showComparison)}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
              >
                {showComparison ? 'Simple View' : 'Compare Features'}
              </button>
            </div>

            {/* Plans Grid */}
            <div className={`grid gap-6 mb-8 ${showComparison ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'}`}>
              {plans.map((plan) => (
                <motion.div
                  key={plan.id}
                  whileHover={{ scale: 1.02 }}
                  className={`relative bg-slate-800/50 border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                    selectedPlan === plan.id
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-slate-700 hover:border-slate-600'
                  }`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {/* Plan Highlight Badge */}
                  {plan.highlight && (
                    <div className={`absolute -top-3 left-6 px-3 py-1 bg-gradient-to-r ${plan.color} text-white text-xs font-semibold rounded-full`}>
                      {plan.highlight}
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${plan.color}`}>
                      {plan.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">{plan.name}</h4>
                      <p className="text-slate-400 text-sm">{plan.questions}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="text-3xl font-bold text-white">{plan.price}</span>
                    <span className="text-slate-400">{plan.period}</span>
                  </div>

                  {showComparison ? (
                    <div className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircleIcon className="w-4 h-4 text-green-400 flex-shrink-0" />
                          <span className="text-slate-300 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-slate-300 text-sm">
                        {plan.features.slice(0, 3).map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircleIcon className="w-3 h-3 text-green-400 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                      {plan.features.length > 3 && (
                        <p className="text-slate-400 text-xs">
                          +{plan.features.length - 3} more features
                        </p>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Current Plan Limitations (for free users) */}
            {currentPlan === 'free' && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
                <h4 className="text-red-400 font-semibold mb-2">Current Free Plan Limitations:</h4>
                <div className="space-y-1">
                  {getCurrentPlanLimitations().map((limitation, index) => (
                    <div key={index} className="flex items-center gap-2 text-red-300 text-sm">
                      <XMarkIcon className="w-3 h-3 flex-shrink-0" />
                      <span>{limitation}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => onUpgrade(selectedPlan)}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
              >
                <ArrowUpIcon className="w-5 h-5" />
                {plans.find(p => p.id === selectedPlan)?.price === 'Custom' 
                  ? 'Contact Sales' 
                  : `Upgrade to ${plans.find(p => p.id === selectedPlan)?.name}`
                }
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 border border-slate-600 text-slate-300 rounded-xl hover:bg-slate-800 transition-all duration-200"
              >
                Maybe Later
              </button>
            </div>

            {/* Fine Print */}
            <p className="text-xs text-slate-500 text-center mt-4">
              All plans include 30-day money-back guarantee. Cancel anytime.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AIAssistantUpgradePrompt;
