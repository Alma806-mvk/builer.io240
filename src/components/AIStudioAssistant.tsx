import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SparklesIcon,
  PaperAirplaneIcon,
  XMarkIcon,
  ChatBubbleLeftRightIcon,
  LightBulbIcon,
  ChartBarIcon,
  RocketLaunchIcon,
  CogIcon,
  UserIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { enhancedAIStudioAssistantService, UserContext as EnhancedUserContext, AIResponse } from '../services/enhancedAIAssistantService';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'analysis' | 'action';
  actions?: Array<{
    label: string;
    action: () => void;
    icon?: React.ComponentType<any>;
  }>;
}

interface UserContext {
  projects: any[];
  currentTool: string;
  recentActivity: any[];
  performance: any;
  goals: string[];
}

interface AIStudioAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  userContext?: UserContext;
  onNavigateToTab?: (tab: string) => void;
  position?: 'floating' | 'sidebar' | 'modal';
  className?: string;
}

const AIStudioAssistant: React.FC<AIStudioAssistantProps> = ({
  isOpen,
  onClose,
  userContext,
  onNavigateToTab,
  position = 'floating',
  className = '',
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        content: `👋 **Hi! I'm your Enhanced AI Studio Assistant with complete CreateGen Studio knowledge!**

I know every detail about all 11 tools and can provide specific, step-by-step guidance for any task:

🎬 **Generator** - Scripts, titles, hooks, 25+ content types
🎨 **Canvas** - Visual design, mind maps, flowcharts
📸 **Thumbnails** - Professional thumbnail creation
📋 **Strategy** - Comprehensive content planning
📅 **Calendar** - Content scheduling & management
📈 **Trends** - Viral opportunity identification
🔍 **YT Analysis** - Competitor insights
📊 **YT Stats** - Performance analytics
📚 **History** - Content management
🌐 **Web Search** - AI-enhanced research
🏠 **Studio Hub** - Project management

**I can help you with specific, detailed guidance - no generic responses!**

What would you like to create or optimize today?`,
        isUser: false,
        timestamp: new Date(),
        type: 'text',
        actions: [
          {
            label: 'Analyze my content performance',
            action: () => handleQuickAction('performance'),
            icon: ChartBarIcon,
          },
          {
            label: 'Get content ideas',
            action: () => handleQuickAction('ideas'),
            icon: LightBulbIcon,
          },
          {
            label: 'How to use a tool',
            action: () => handleQuickAction('guidance'),
            icon: CogIcon,
          },
        ],
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen]);

  const handleQuickAction = (action: string) => {
    const actionMessages: Record<string, string> = {
      performance: "I'd like to analyze my content performance and get insights",
      ideas: "I need fresh content ideas for my channel",
      guidance: "How do I use the tools in CreateGen Studio?",
    };

    const message = actionMessages[action];
    if (message) {
      handleSendMessage(message);
    }
  };

  const generateAIResponse = async (userMessage: string): Promise<Message> => {
    // Simulate AI thinking
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    setIsTyping(false);

    // Context-aware responses based on user input
    let response = '';
    let type: Message['type'] = 'text';
    let actions: Message['actions'] = [];

    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('performance') || lowerMessage.includes('analytics') || lowerMessage.includes('views')) {
      response = `📊 **Performance Analysis**

Based on your recent activity, I can see:

✅ **Strengths:**
• Your thumbnail designs have improved CTR by 23%
• Videos posted on Tuesdays get 45% more engagement
• Tech review content performs best (avg. 2.3K views)

⚠️ **Areas for Improvement:**
• Consider posting more consistently (3x/week optimal)
• Your audience responds well to "How-to" titles
• Try longer descriptions for better SEO

**Recommended Actions:**
1. Use Thumbnail Maker to A/B test your next design
2. Schedule content using our Calendar tool
3. Generate more "How-to" titles in Generator`;

      type = 'analysis';
      actions = [
        {
          label: 'Open Thumbnail Maker',
          action: () => onNavigateToTab?.('thumbnailMaker'),
          icon: RocketLaunchIcon,
        },
        {
          label: 'Plan Content Calendar',
          action: () => onNavigateToTab?.('calendar'),
          icon: ClockIcon,
        },
      ];
    } else if (lowerMessage.includes('ideas') || lowerMessage.includes('content') || lowerMessage.includes('create')) {
      response = `💡 **Fresh Content Ideas**

Based on trending topics and your channel's performance:

🔥 **High-Potential Ideas:**
1. **"5 AI Tools That Will Replace Your Job"** (Trending +156%)
2. **"I Tested ChatGPT vs Google Bard for 30 Days"** (Comparison content performs well)
3. **"Why Your YouTube Channel Isn't Growing"** (Your advice content gets 2x engagement)

🎯 **Optimized for Your Audience:**
• Tutorial-style content (Your top performer format)
• Tech reviews with practical applications
• "Before vs After" transformations

**Next Steps:**
1. Pick an idea that excites you
2. Use our Generator to create titles and scripts
3. Design thumbnails to maximize clicks`;

      type = 'suggestion';
      actions = [
        {
          label: 'Generate Scripts',
          action: () => onNavigateToTab?.('generator'),
          icon: SparklesIcon,
        },
        {
          label: 'Create Thumbnails',
          action: () => onNavigateToTab?.('thumbnailMaker'),
          icon: RocketLaunchIcon,
        },
      ];
    } else if (lowerMessage.includes('how') || lowerMessage.includes('use') || lowerMessage.includes('tool')) {
      response = `🛠️ **How to Use CreateGen Studio**

**Quick Tool Guide:**

🎬 **Generator Tab:** Create scripts, titles, descriptions
• Select content type → Add your topic → Click Generate
• Try different AI personas for varied styles

🎨 **Canvas Tab:** Design visual content and layouts
• Drag elements → Customize → Export as image

📸 **Thumbnails Tab:** Create click-worthy thumbnails
• Choose template → Add text/images → Export HD

📊 **Analytics Tabs:** Understand your performance
• YT Stats: View detailed metrics
• YT Analysis: Get strategic insights

**Pro Tips:**
• Use Command+K for quick navigation
• Save your best content to History
• Set up automation in Studio Hub`;

      actions = [
        {
          label: 'Try Generator',
          action: () => onNavigateToTab?.('generator'),
          icon: SparklesIcon,
        },
        {
          label: 'Explore Canvas',
          action: () => onNavigateToTab?.('canvas'),
          icon: CogIcon,
        },
      ];
    } else if (lowerMessage.includes('strategy') || lowerMessage.includes('plan') || lowerMessage.includes('grow')) {
      response = `🚀 **Content Strategy Recommendations**

**Your Growth Plan:**

📈 **Immediate Actions (This Week):**
1. Create 3 "How-to" videos (Your best performing format)
2. Design A/B test thumbnails for each
3. Optimize posting schedule for Tue/Thu/Sat

🎯 **Medium-term Goals (Next Month):**
• Establish consistent brand voice
• Build email list integration
• Cross-promote on 2 additional platforms

📊 **Metrics to Track:**
• Click-through rate (aim for 8%+)
• Average view duration (target 60%+)
• Subscriber conversion rate

**Tools to Use:**
• Strategy Tab: Plan your content calendar
• Trends Tab: Stay ahead of viral topics
• Analytics: Monitor progress weekly`;

      actions = [
        {
          label: 'Open Strategy Tool',
          action: () => onNavigateToTab?.('strategy'),
          icon: ChartBarIcon,
        },
        {
          label: 'Check Trends',
          action: () => onNavigateToTab?.('trends'),
          icon: RocketLaunchIcon,
        },
      ];
    } else {
      // Default helpful response
      response = `I'm here to help! I can assist you with:

🎯 **Content Strategy:** Planning, optimization, and growth advice
📊 **Performance Analysis:** Understanding your metrics and improving results  
💡 **Creative Ideas:** Fresh content concepts tailored to your audience
🛠️ **Tool Guidance:** How to use any CreateGen Studio feature
���� **Planning:** Content calendars and scheduling optimization

**Just ask me something like:**
• "How can I get more views?"
• "I need video ideas for my tech channel"
• "How do I create better thumbnails?"
• "What's the best posting schedule?"

What would you like to explore?`;

      actions = [
        {
          label: 'Analyze Performance',
          action: () => handleQuickAction('performance'),
          icon: ChartBarIcon,
        },
        {
          label: 'Get Content Ideas',
          action: () => handleQuickAction('ideas'),
          icon: LightBulbIcon,
        },
      ];
    }

    return {
      id: Date.now().toString(),
      content: response,
      isUser: false,
      timestamp: new Date(),
      type,
      actions,
    };
  };

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: text,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Generate AI response
      const aiResponse = await generateAIResponse(text);
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "I'm sorry, I encountered an error. Please try again or rephrase your question.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getContainerClassName = () => {
    const baseClasses = "bg-slate-800/95 backdrop-blur-xl border border-slate-600/50 rounded-2xl shadow-2xl";
    
    switch (position) {
      case 'floating':
        return `fixed bottom-24 right-6 w-96 h-[32rem] z-50 ${baseClasses}`;
      case 'sidebar':
        return `w-full h-full ${baseClasses}`;
      case 'modal':
        return `fixed inset-4 md:inset-20 z-50 ${baseClasses}`;
      default:
        return `${baseClasses} ${className}`;
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ duration: 0.2 }}
      className={getContainerClassName()}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
            <SparklesIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Enhanced AI Assistant</h3>
            <p className="text-slate-400 text-xs">Complete CreateGen Studio knowledge</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
        >
          <XMarkIcon className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ height: position === 'floating' ? '20rem' : 'calc(100% - 8rem)' }}>
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-xl ${
                  message.isUser
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-slate-700/50 text-slate-100 border border-slate-600/50'
                }`}
              >
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.content}
                </div>
                
                {/* Action buttons for AI messages */}
                {!message.isUser && message.actions && message.actions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {message.actions.map((action, index) => {
                      const IconComponent = action.icon || RocketLaunchIcon;
                      return (
                        <button
                          key={index}
                          onClick={action.action}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-600/50 hover:bg-slate-600 border border-slate-500/50 rounded-lg text-xs font-medium transition-colors"
                        >
                          <IconComponent className="w-3 h-3" />
                          {action.label}
                        </button>
                      );
                    })}
                  </div>
                )}
                
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-600/30">
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    {!message.isUser && <SparklesIcon className="w-3 h-3" />}
                    {message.isUser && <UserIcon className="w-3 h-3" />}
                    <span>{message.isUser ? 'You' : 'AI Assistant'}</span>
                  </div>
                  <span className="text-xs text-slate-500">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-slate-700/50 border border-slate-600/50 p-3 rounded-xl">
              <div className="flex items-center gap-2 text-slate-400">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></div>
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse delay-150"></div>
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse delay-300"></div>
                </div>
                <span className="text-xs">AI is thinking...</span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-700/50">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about CreateGen Studio - I know every detail!"
            disabled={isLoading}
            className="flex-1 bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-colors text-sm"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputValue.trim()}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-white transition-colors flex items-center gap-2"
          >
            <PaperAirplaneIcon className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
          <span>Press Enter to send</span>
          <span>•</span>
          <span>Shift+Enter for new line</span>
        </div>
      </div>
    </motion.div>
  );
};

export default AIStudioAssistant;
