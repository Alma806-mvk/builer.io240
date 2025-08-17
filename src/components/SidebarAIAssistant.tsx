import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SparklesIcon,
  PaperAirplaneIcon,
  LightBulbIcon,
  ChartBarIcon,
  RocketLaunchIcon,
  CpuChipIcon as BrainIcon,
  UserIcon,
  FilmIcon,
  PhotoIcon,
  MapIcon,
  ArrowTrendingUpIcon,
  EyeIcon,
  BeakerIcon,
  PlayIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  BookOpenIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import { UserContext } from '../services/intelligentAIAssistantService';
import intelligentAIAssistantService from '../services/intelligentAIAssistantService';

interface SidebarAIAssistantProps {
  userContext?: UserContext;
  onNavigateToTab?: (tab: string) => void;
  userPlan?: string;
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  action: () => void;
  description: string;
  category: 'creation' | 'analysis' | 'strategy' | 'trending';
}

const SidebarAIAssistant: React.FC<SidebarAIAssistantProps> = ({
  userContext,
  onNavigateToTab,
  userPlan = 'free'
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResponse, setLastResponse] = useState<string>('');
  const [showResponse, setShowResponse] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const quickActions: QuickAction[] = [
    {
      id: 'script',
      label: 'Create YouTube Script',
      icon: FilmIcon,
      action: () => handleQuickAction('Create a viral YouTube script for my channel'),
      description: 'Generate engaging video scripts',
      category: 'creation'
    },
    {
      id: 'analyze',
      label: 'Analyze Performance',
      icon: ChartBarIcon,
      action: () => handleQuickAction('Analyze my content performance and suggest improvements'),
      description: 'Deep performance insights',
      category: 'analysis'
    },
    {
      id: 'strategy',
      label: 'Plan Content Strategy',
      icon: MapIcon,
      action: () => handleQuickAction('Create a comprehensive content strategy for my channel'),
      description: 'Strategic planning & roadmaps',
      category: 'strategy'
    },
    {
      id: 'trends',
      label: 'Find Trending Topics',
      icon: ArrowTrendingUpIcon,
      action: () => handleQuickAction('What are the trending topics I should create content about?'),
      description: 'Discover viral opportunities',
      category: 'trending'
    }
  ];

  const expertTips = [
    "💡 Ask me specific questions like 'How do I get 10%+ CTR on thumbnails?'",
    "🎯 I can analyze your competitors and create winning strategies",
    "🚀 Try 'Walk me through creating viral content from start to finish'",
    "📊 Say 'My videos get low views - diagnose and fix this issue'",
    "⚡ I know every workflow across all 11 CreateGen Studio tools"
  ];

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % expertTips.length);
    }, 8000);
    return () => clearInterval(tipInterval);
  }, []);

  const handleQuickAction = async (prompt: string) => {
    setInputValue(prompt);
    await handleSendMessage(prompt);
  };

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text || isProcessing) return;

    setIsProcessing(true);
    setInputValue('');
    setShowResponse(false);

    try {
      const response = await intelligentAIAssistantService.generateResponse(text, userContext);
      
      // Extract key insights for sidebar display
      const insights = extractKeyInsights(response.content);
      setLastResponse(insights);
      setShowResponse(true);

      // Execute navigation actions if suggested
      if (response.actions && response.actions.length > 0) {
        const navigationAction = response.actions.find(action => 
          action.action.startsWith('navigate:')
        );
        if (navigationAction) {
          const tab = navigationAction.action.replace('navigate:', '');
          setTimeout(() => {
            onNavigateToTab?.(tab);
          }, 2000); // Give user time to read response
        }
      }

    } catch (error) {
      console.error('Sidebar AI error:', error);

      // Provide helpful error responses based on the type of error
      if (error.message?.includes('429') || error.message?.includes('rate limit')) {
        setLastResponse("⏱️ I'm experiencing high demand! Try again in 30 seconds, or use the quick actions above for instant help.");
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        setLastResponse("🌐 Connection issue detected. Check your internet and try again, or browse our quick actions for immediate guidance.");
      } else {
        setLastResponse("🔧 I'm having a brief technical moment. While I reconnect, try the quick actions above or ask me again in a moment!");
      }

      setShowResponse(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const extractKeyInsights = (content: string): string => {
    // Extract the most actionable parts for sidebar display
    const lines = content.split('\n').filter(line => line.trim());
    
    // Look for key actionable items
    const keyLines = lines.filter(line => 
      line.includes('Step') || 
      line.includes('**') || 
      line.includes('•') ||
      line.includes('1.') ||
      line.includes('2.') ||
      line.includes('3.')
    ).slice(0, 4);

    if (keyLines.length > 0) {
      return keyLines.join('\n');
    }

    // Fallback to first few sentences
    return lines.slice(0, 3).join('\n');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
            <SparklesIcon className="w-4 h-4 text-white" />
          </div>
          <h4 className="text-sm font-semibold text-white">Expert AI Assistant</h4>
        </div>
        <p className="text-xs text-slate-400">Complete CreateGen Studio knowledge</p>
      </div>

      {/* Expert Tip Carousel */}
      <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <BrainIcon className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
          <div className="min-h-[40px]">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentTip}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-xs text-purple-200 leading-relaxed"
              >
                {expertTips[currentTip]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h5 className="text-xs font-medium text-slate-300 mb-3 flex items-center gap-2">
          <RocketLaunchIcon className="w-3 h-3" />
          Quick Actions
        </h5>
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <button
                key={action.id}
                onClick={action.action}
                disabled={isProcessing}
                className="p-2 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 hover:border-purple-500/30 rounded-lg transition-all duration-200 group disabled:opacity-50"
                title={action.description}
              >
                <div className="flex flex-col items-center gap-1">
                  <IconComponent className="w-4 h-4 text-slate-400 group-hover:text-purple-400 transition-colors" />
                  <span className="text-xs text-slate-300 group-hover:text-white transition-colors text-center leading-tight">
                    {action.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* AI Response */}
      <AnimatePresence>
        {showResponse && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-3"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <SparklesIcon className="w-2 h-2 text-white" />
              </div>
              <span className="text-xs font-medium text-purple-300">AI Consultant</span>
            </div>
            <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
              {lastResponse}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Processing Indicator */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-lg p-3"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full"
                />
              </div>
              <div>
                <p className="text-xs font-medium text-purple-300">Analyzing...</p>
                <p className="text-xs text-purple-200/70">Consulting expert knowledge</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Input */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask your AI consultant..."
            disabled={isProcessing}
            className="flex-1 bg-slate-700/50 border border-slate-600/50 focus:border-purple-500/50 rounded-lg px-3 py-2 text-white placeholder-slate-400 text-xs focus:outline-none transition-colors"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isProcessing || !inputValue.trim()}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2 rounded-lg text-white transition-all duration-200 flex items-center justify-center"
          >
            <PaperAirplaneIcon className="w-3 h-3" />
          </button>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Press Enter to send</span>
          <span className={`font-medium ${
            userPlan === 'free' ? 'text-orange-400' : 'text-green-400'
          }`}>
            {userPlan === 'free' ? '5 questions/day' : 
             userPlan === 'creator' ? '50 questions/day' : 'Unlimited'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SidebarAIAssistant;
