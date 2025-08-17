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
  PlayCircleIcon,
  PhotoIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  GlobeAltIcon,
  BeakerIcon,
  PresentationChartLineIcon,
  QuestionMarkCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { ColumnsIcon, SearchCircleIcon, CompassIcon, TrendingUpIcon } from './IconComponents';
import { enhancedAIStudioAssistantService, UserContext, AIResponse } from '../services/enhancedAIAssistantService';
import { conversationMemoryService } from '../services/conversationMemoryService';
import { comprehensiveQuestionMatcher } from '../services/comprehensiveQuestionDatabase';
import TypewriterEffect from './TypewriterEffect';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'analysis' | 'action' | 'workflow' | 'troubleshooting';
  actions?: Array<{
    label: string;
    action: string;
    icon?: string;
  }>;
  workflowSteps?: Array<{
    step: number;
    action: string;
    details: string;
  }>;
  confidence?: number;
}

interface EnhancedAIStudioAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  userContext?: UserContext;
  onNavigateToTab?: (tab: string) => void;
  position?: 'floating' | 'sidebar' | 'modal';
  className?: string;
  onInputText?: (text: string) => void;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  SparklesIcon,
  PlayCircleIcon,
  PhotoIcon,
  CompassIcon,
  CalendarIcon,
  TrendingUpIcon,
  ColumnsIcon,
  SearchCircleIcon,
  ClipboardDocumentListIcon,
  GlobeAltIcon,
  BeakerIcon,
  ChartBarIcon,
  PresentationChartLineIcon,
  QuestionMarkCircleIcon,
  ArrowRightIcon,
  RocketLaunchIcon,
  CogIcon,
  UserIcon,
  LightBulbIcon
};

const EnhancedAIStudioAssistant: React.FC<EnhancedAIStudioAssistantProps> = ({
  isOpen,
  onClose,
  userContext,
  onNavigateToTab,
  position = 'floating',
  className = '',
  onInputText,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAITyping, setIsAITyping] = useState(false);
  const [currentlyTypingMessageId, setCurrentlyTypingMessageId] = useState<string | null>(null);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (position !== 'sidebar') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, position]);

  useEffect(() => {
    if (isOpen && inputRef.current && position !== 'sidebar') {
      inputRef.current.focus();
    }
  }, [isOpen, position]);

  // Enhanced welcome message with comprehensive knowledge
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initialize conversation memory
      const session = conversationMemoryService.getOrCreateSession(sessionId, userContext?.userPlan || 'free');

      const welcomeMessage: Message = {
        id: 'welcome',
        content: position === 'sidebar'
          ? `👋 **Welcome to your Expert AI Studio Assistant!**

**I learn from our conversation** to provide increasingly relevant help!

What would you like to create or optimize today?`
          : `👋 **Welcome to your Expert AI Studio Assistant!**

**I'm designed to give you:**
• **Specific, actionable guidance** - No generic responses
• **Step-by-step workflows** for any task
• **Expert troubleshooting** with intelligent diagnosis
• **Personalized recommendations** based on your usage
• **Real-time typing** that feels genuinely conversational

**I learn from our conversation** to provide increasingly relevant help!

What would you like to create or optimize today?`,
        isUser: false,
        timestamp: new Date(),
        type: 'text',
        actions: [
          {
            label: 'Create YouTube Script',
            action: 'navigate:generator',
            icon: 'PlayCircleIcon',
          },
          {
            label: 'Analyze Performance',
            action: 'navigate:youtubeStats',
            icon: 'ChartBarIcon',
          },
          {
            label: 'Plan Content Strategy',
            action: 'navigate:strategy',
            icon: 'CompassIcon',
          },
          {
            label: 'Find Trending Topics',
            action: 'navigate:trends',
            icon: 'TrendingUpIcon',
          },
        ],
      };
      setMessages([welcomeMessage]);
      // Welcome message is static, no typewriter effect
    }
  }, [isOpen, sessionId]);

  // Handle external input text (from Quick Create buttons)
  useEffect(() => {
    if (onInputText) {
      // Create a function that can be called to set input text
      const handleExternalInput = (text: string) => {
        setInputValue(text);
        if (inputRef.current && position !== 'sidebar') {
          inputRef.current.focus();
        }
      };
      // Store this function so it can be called externally
      (window as any).setAIAssistantInput = handleExternalInput;
    }
  }, [onInputText]);

  const handleActionClick = (action: string) => {
    if (action.startsWith('navigate:')) {
      const tab = action.replace('navigate:', '');
      onNavigateToTab?.(tab);
    } else if (action === 'openCommandPalette') {
      // Trigger command palette if available
      const event = new KeyboardEvent('keydown', {
        key: 'k',
        metaKey: true,
        ctrlKey: true,
      });
      document.dispatchEvent(event);
    } else if (action === 'openSupport') {
      // Open support/feedback
      console.log('Opening support...');
    } else {
      // Handle follow-up questions by auto-filling the input
      setInputValue(action);
      if (position !== 'sidebar') {
        inputRef.current?.focus();
      }
    }
  };

  const convertAIResponseToMessage = (aiResponse: AIResponse): Message => {
    return {
      id: Date.now().toString(),
      content: aiResponse.content,
      isUser: false,
      timestamp: new Date(),
      type: aiResponse.type,
      actions: aiResponse.actions,
      workflowSteps: aiResponse.workflowSteps,
      confidence: aiResponse.confidence
    };
  };

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text || isLoading || isAITyping) return;

    // Add user message
    const userMessageId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const userMessage: Message = {
      id: userMessageId,
      content: text,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Build comprehensive user context
      const session = conversationMemoryService.getOrCreateSession(sessionId, userContext?.userPlan || 'free');
      const conversationContext = conversationMemoryService.getConversationContext(sessionId);

      // Enhanced user context with conversation memory
      const enhancedUserContext = {
        ...userContext,
        technicalLevel: conversationContext.userLevel,
        conversationHistory: session.conversationHistory.slice(-5), // Last 5 conversations
        recentTopics: conversationContext.recentTopics,
        currentFocus: conversationContext.currentFocus,
        sessionId
      };

      // Try comprehensive question matching first
      const questionPattern = comprehensiveQuestionMatcher.findBestMatch(text, enhancedUserContext);

      let aiResponse: AIResponse;

      if (questionPattern) {
        // Use pattern-based response with dynamic content
        const dynamicResponse = comprehensiveQuestionMatcher.generateDynamicResponse(questionPattern, enhancedUserContext);
        const followUps = comprehensiveQuestionMatcher.getContextualFollowUps(questionPattern, enhancedUserContext);

        aiResponse = {
          content: dynamicResponse,
          type: questionPattern.category as any,
          confidence: 0.95,
          actions: followUps.slice(0, 3).map(followUp => ({
            label: followUp,
            action: `ask:${followUp}`,
            icon: 'QuestionMarkCircleIcon'
          }))
        };
      } else {
        // Fallback to enhanced AI service
        aiResponse = await enhancedAIStudioAssistantService.askQuestion(text, enhancedUserContext);
      }

      // Add conversation to memory
      conversationMemoryService.addConversation(
        sessionId,
        text,
        aiResponse.content,
        aiResponse.type,
        aiResponse.confidence || 0.8
      );

      // Generate intelligent follow-ups based on conversation history
      const intelligentFollowUps = conversationMemoryService.generateFollowUps(
        sessionId,
        aiResponse.content,
        aiResponse.type
      );

      // Add follow-ups to actions if not already present
      const existingActionLabels = (aiResponse.actions || []).map(a => a.label);
      const newFollowUps = intelligentFollowUps
        .filter(followUp => !existingActionLabels.includes(followUp))
        .slice(0, 2)
        .map(followUp => ({
          label: followUp,
          action: `ask:${followUp}`,
          icon: 'LightBulbIcon'
        }));

      const enhancedActions = [...(aiResponse.actions || []), ...newFollowUps];

      setIsTyping(false);

      // Create AI message with typewriter effect
      const aiMessageId = `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const aiMessage: Message = {
        id: aiMessageId,
        content: aiResponse.content,
        isUser: false,
        timestamp: new Date(),
        type: aiResponse.type,
        actions: enhancedActions.map(action => ({
          ...action,
          action: action.action.startsWith('ask:')
            ? action.action.replace('ask:', '')
            : action.action
        })),
        workflowSteps: aiResponse.workflowSteps,
        confidence: aiResponse.confidence
      };

      setMessages(prev => [...prev, aiMessage]);
      setCurrentlyTypingMessageId(aiMessageId);
      setIsAITyping(true);

    } catch (error) {
      console.error('Error generating AI response:', error);
      setIsTyping(false);

      const errorMessageId = `error_${Date.now()}`;
      const errorMessage: Message = {
        id: errorMessageId,
        content: `I apologize for the interruption! I'm still here to help with your CreateGen Studio questions.

**I have comprehensive knowledge of:**
• **All 11 tools** and their specific features
• **Every workflow** with step-by-step guidance
• **Troubleshooting solutions** for any issue
• **Performance optimization** strategies
• **Content creation best practices**

**Recent conversation topics:** ${conversationMemoryService.getConversationContext(sessionId).recentTopics.join(', ') || 'None yet'}

Please try asking your question again, or ask me about a specific tool or feature you'd like help with!`,
        isUser: false,
        timestamp: new Date(),
        type: 'text',
        actions: [
          { label: 'Try Generator', action: 'navigate:generator', icon: 'SparklesIcon' },
          { label: 'Get Help with Canvas', action: 'navigate:canvas', icon: 'ColumnsIcon' },
          { label: 'Plan Strategy', action: 'navigate:strategy', icon: 'CompassIcon' }
        ]
      };
      setMessages(prev => [...prev, errorMessage]);
      setCurrentlyTypingMessageId(errorMessageId);
      setIsAITyping(true);
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

  const renderWorkflowSteps = (steps: Message['workflowSteps']) => {
    if (!steps || steps.length === 0) return null;

    return (
      <div className="mt-4 space-y-2">
        <h4 className="text-sm font-semibold text-slate-300 mb-2">📋 Step-by-Step Workflow:</h4>
        {steps.map((step, index) => (
          <div key={index} className="flex gap-3 p-2 bg-slate-800/50 rounded-lg border border-slate-600/30">
            <div className="flex-shrink-0 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
              {step.step}
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-slate-200">{step.action}</div>
              <div className="text-xs text-slate-400 mt-1">{step.details}</div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const getConfidenceIndicator = (confidence?: number) => {
    if (!confidence) return null;
    
    const getColor = () => {
      if (confidence >= 0.9) return 'text-green-400';
      if (confidence >= 0.7) return 'text-yellow-400';
      return 'text-orange-400';
    };

    const getLabel = () => {
      if (confidence >= 0.9) return 'Highly Confident';
      if (confidence >= 0.7) return 'Confident';
      return 'Moderate Confidence';
    };

    return (
      <div className={`text-xs ${getColor()} flex items-center gap-1`}>
        <div className="w-2 h-2 rounded-full bg-current"></div>
        {getLabel()} ({Math.round(confidence * 100)}%)
      </div>
    );
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
            <h3 className="text-white font-semibold">Expert AI Assistant</h3>
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
                <div className="text-sm leading-relaxed">
                  {!message.isUser && currentlyTypingMessageId === message.id && message.id !== 'welcome' ? (
                    <TypewriterEffect
                      text={message.content}
                      speed={120} // Characters per second - very fast for realistic AI feel
                      onComplete={() => {
                        setCurrentlyTypingMessageId(null);
                        setIsAITyping(false);
                      }}
                      onTypeStart={() => setIsAITyping(true)}
                      cursor
                      delay={200} // Small delay before starting
                    />
                  ) : (
                    <div
                      className="whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{
                        __html: message.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      }}
                    />
                  )}
                </div>
                
                {/* Workflow steps for detailed guidance */}
                {!message.isUser && renderWorkflowSteps(message.workflowSteps)}
                
                {/* Action buttons for AI messages */}
                {!message.isUser && message.actions && message.actions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {message.actions.map((action, index) => {
                      const IconComponent = action.icon ? iconMap[action.icon] || RocketLaunchIcon : RocketLaunchIcon;
                      return (
                        <button
                          key={index}
                          onClick={() => handleActionClick(action.action)}
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
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      {!message.isUser && <SparklesIcon className="w-3 h-3" />}
                      {message.isUser && <UserIcon className="w-3 h-3" />}
                      <span>{message.isUser ? 'You' : 'Expert AI'}</span>
                    </div>
                    {!message.isUser && getConfidenceIndicator(message.confidence)}
                  </div>
                  <span className="text-xs text-slate-500">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Enhanced typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-slate-700/50 border border-slate-600/50 p-3 rounded-xl">
              <div className="flex items-center gap-2 text-slate-400">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></div>
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse delay-150"></div>
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse delay-300"></div>
                </div>
                <span className="text-xs">
                  {isAITyping ? 'Formulating expert response...' : 'Analyzing with comprehensive knowledge...'}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Input */}
      <div className="p-4 border-t border-slate-700/50">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isAITyping ? "AI is typing..." : "Ask me anything about CreateGen Studio - I know every detail!"}
            disabled={isLoading || isAITyping}
            className="flex-1 bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-colors text-sm"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading || isAITyping || !inputValue.trim()}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-white transition-colors flex items-center gap-2"
          >
            <PaperAirplaneIcon className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>Press Enter to send</span>
            <span>•</span>
            <span>Shift+Enter for new line</span>
          </div>
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${isAITyping ? 'bg-cyan-400 animate-pulse' : 'bg-green-400'}`}></div>
            <span>
              {isAITyping ? 'AI responding...' : 'Expert knowledge active'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EnhancedAIStudioAssistant;
