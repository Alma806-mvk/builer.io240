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
  PlayIcon,
  StopIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  BeakerIcon,
  CalendarIcon,
  ChartPieIcon,
  FilmIcon,
  PhotoIcon,
  MapIcon,
  MagnifyingGlassIcon,
  BookOpenIcon,
  FireIcon,
  EyeIcon,
  PresentationChartLineIcon,
  CloudIcon,
  AcademicCapIcon,
  BugAntIcon,
  ShieldCheckIcon,
  CpuChipIcon as BrainIcon
} from '@heroicons/react/24/outline';
// Temporarily commented out to fix Firebase permissions error
// import { aiAssistantUsageService, UsageStats } from '../services/aiAssistantUsageService';
import { UsageStats } from '../services/aiAssistantUsageService';
import { useSubscription } from '../context/SubscriptionContext';
import AIAssistantUsageDisplay from './AIAssistantUsageDisplay';
import AIAssistantUpgradePrompt from './AIAssistantUpgradePrompt';
import { auth } from '../config/firebase';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'analysis' | 'workflow' | 'troubleshooting' | 'success' | 'warning' | 'info';
  actions?: Array<{
    label: string;
    action: () => void;
    icon?: React.ComponentType<any>;
    type?: 'primary' | 'secondary' | 'success' | 'warning';
  }>;
  metadata?: {
    confidence: number;
    category: string;
    relatedTools: string[];
    estimatedTime?: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
  };
  isTypewriting?: boolean;
  displayedContent?: string;
}

interface UserContext {
  projects: any[];
  currentTool: string;
  recentActivity: any[];
  performance: any;
  goals: string[];
  userPlan?: string;
  preferences?: any;
}

interface IntelligentAIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  userContext?: UserContext;
  onNavigateToTab?: (tab: string) => void;
  position?: 'floating' | 'sidebar' | 'modal';
  className?: string;
}

const IntelligentAIAssistant: React.FC<IntelligentAIAssistantProps> = ({
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
  const [thinkingState, setThinkingState] = useState<'none' | 'analyzing' | 'deep-thinking' | 'consulting'>('none');
  const [thinkingProgress, setThinkingProgress] = useState(0);
  const [conversationContext, setConversationContext] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typewriterTimeouts = useRef<NodeJS.Timeout[]>([]);

  // Usage tracking state
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [upgradePromptTrigger, setUpgradePromptTrigger] = useState<'limit_reached' | 'low_usage' | 'premium_feature' | 'manual'>('manual');
  const { billingInfo } = useSubscription();
  const currentPlan = userContext?.userPlan || billingInfo?.subscription?.planId || 'free';

  // Load usage stats on mount and when plan changes
  useEffect(() => {
    loadUsageStats();
  }, [currentPlan, isOpen]);

  const loadUsageStats = async () => {
    if (!auth.currentUser || !isOpen) return;

    // Temporarily use fallback stats until Firestore rules are deployed
    setUsageStats({
      questionsRemaining: currentPlan === 'premium' ? 999 : 5,
      questionsUsed: 0,
      dailyLimit: currentPlan === 'premium' ? 999 : 5,
      isUnlimited: currentPlan === 'premium',
      percentageUsed: 0,
      resetsAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      planLevel: currentPlan || 'free'
    });

    // TODO: Re-enable usage tracking once Firestore rules are deployed
    /*
    try {
      const stats = await aiAssistantUsageService.getUsageStats(auth.currentUser.uid, currentPlan);
      setUsageStats(stats);
    } catch (error) {
      console.error('Error loading AI assistant usage stats:', error);
    }
    */
  };

  // Complete CreateGen Studio knowledge base
  const APP_KNOWLEDGE = {
    tools: {
      studioHub: {
        name: "Studio Hub",
        purpose: "Central command center for managing all your content creation projects",
        features: ["Project Pipeline", "Activity Feed", "Quick Launch", "Analytics Dashboard", "Command Palette"],
        workflows: ["Create Project", "Track Progress", "Launch Tools", "View Insights"],
        tips: "Use Cmd+K for instant navigation to any tool or feature"
      },
      generator: {
        name: "Generator",
        purpose: "AI-powered content creation for scripts, titles, hooks, and 25+ content types",
        features: ["25+ Content Types", "AI Personas", "Batch Generation", "Custom Templates", "Export Options"],
        workflows: ["Select Content Type", "Choose AI Persona", "Input Topic", "Generate", "Refine & Export"],
        tips: "Try different AI personas for varied writing styles and tones"
      },
      canvas: {
        name: "Canvas",
        purpose: "Visual design workspace for mind maps, flowcharts, layouts, and presentations",
        features: ["Drag & Drop Elements", "Custom Shapes", "Text Boxes", "Connectors", "Export to PNG/SVG"],
        workflows: ["Add Elements", "Connect Items", "Style Design", "Export Visual"],
        tips: "Use Alt+A to open AI assistant for design suggestions while working"
      },
      ytAnalysis: {
        name: "YT Analysis",
        purpose: "Deep YouTube channel analysis and competitive intelligence",
        features: ["Channel Insights", "Competitor Analysis", "Content Gap Analysis", "Trending Topics", "Optimization Suggestions"],
        workflows: ["Connect Channel", "Analyze Performance", "Compare Competitors", "Get Recommendations"],
        tips: "Connect your YouTube channel first for personalized insights"
      },
      ytStats: {
        name: "YT Stats",
        purpose: "Comprehensive YouTube statistics and performance metrics",
        features: ["View Analytics", "Performance Tracking", "Audience Insights", "Revenue Metrics", "Growth Trends"],
        workflows: ["View Dashboard", "Analyze Metrics", "Track Growth", "Export Reports"],
        tips: "Check weekly for consistent performance monitoring"
      },
      thumbnails: {
        name: "Thumbnails",
        purpose: "Professional thumbnail creation with AI-generated backgrounds and elements",
        features: ["AI Backgrounds", "Text Overlays", "Face Cutouts", "Templates", "A/B Testing"],
        workflows: ["Choose Template", "Add Elements", "Customize Design", "Export HD"],
        tips: "Test multiple designs to find what works best for your audience"
      },
      strategy: {
        name: "Strategy",
        purpose: "Comprehensive content strategy planning and execution framework",
        features: ["Content Planning", "Goal Setting", "Audience Analysis", "Channel Strategy", "Growth Plans"],
        workflows: ["Set Goals", "Analyze Audience", "Plan Content", "Create Strategy", "Track Results"],
        tips: "Start with clear goals and target audience for best results"
      },
      calendar: {
        name: "Calendar",
        purpose: "Content scheduling and planning with automated publishing",
        features: ["Content Scheduling", "Publishing Calendar", "Batch Planning", "Reminders", "Integration"],
        workflows: ["Plan Content", "Schedule Posts", "Set Reminders", "Track Publishing"],
        tips: "Batch schedule content weekly for consistent posting"
      },
      trends: {
        name: "Trends",
        purpose: "Real-time trend analysis and viral opportunity identification",
        features: ["Trending Topics", "Viral Predictions", "Hashtag Analysis", "Competitor Trends", "Opportunity Alerts"],
        workflows: ["Browse Trends", "Analyze Virality", "Create Content", "Monitor Performance"],
        tips: "Check daily for emerging trends and act quickly on opportunities"
      },
      history: {
        name: "History",
        purpose: "Complete content library and project management system",
        features: ["Content Archive", "Version Control", "Search & Filter", "Export Options", "Collaboration"],
        workflows: ["Browse History", "Search Content", "Restore Versions", "Export Projects"],
        tips: "Use tags and folders to organize your content library effectively"
      },
      webSearch: {
        name: "Web Search",
        purpose: "AI-enhanced research and content discovery with intelligent summarization",
        features: ["Smart Search", "Content Summarization", "Source Verification", "Research Notes", "Integration"],
        workflows: ["Search Topic", "Review Results", "Save Research", "Create Content"],
        tips: "Use specific keywords for better, more targeted research results"
      }
    },
    commonWorkflows: {
      videoCreation: {
        steps: [
          "Research trends in Trends tab",
          "Generate script in Generator",
          "Create thumbnail in Thumbnails tab",
          "Plan strategy in Strategy tab",
          "Schedule in Calendar"
        ],
        estimatedTime: "45-60 minutes",
        difficulty: "beginner"
      },
      channelAnalysis: {
        steps: [
          "Connect YouTube in YT Stats",
          "Analyze performance in YT Analysis",
          "Research competitors",
          "Create strategy in Strategy tab"
        ],
        estimatedTime: "30-45 minutes",
        difficulty: "intermediate"
      },
      contentPlanning: {
        steps: [
          "Set goals in Strategy tab",
          "Research trends and opportunities",
          "Generate content ideas in Generator",
          "Plan schedule in Calendar",
          "Create visual strategy in Canvas"
        ],
        estimatedTime: "60-90 minutes",
        difficulty: "intermediate"
      }
    },
    troubleshooting: {
      "can't generate content": {
        solution: "Check your subscription plan limits. Free plan has 5 generations/day. Try refreshing the page or switching to a different content type.",
        steps: ["Check plan limits", "Refresh browser", "Try different content type", "Contact support if persists"]
      },
      "youtube not connecting": {
        solution: "Ensure you're logged into the correct Google account and have given necessary permissions. Try disconnecting and reconnecting.",
        steps: ["Check Google login", "Clear browser cache", "Disconnect and reconnect", "Verify permissions"]
      },
      "canvas not loading": {
        solution: "Canvas requires WebGL support. Try updating your browser or disabling browser extensions that might interfere.",
        steps: ["Update browser", "Disable extensions", "Check WebGL support", "Clear browser data"]
      },
      "exports failing": {
        solution: "Large files may take time to process. Check your internet connection and try exporting smaller file sizes.",
        steps: ["Check internet connection", "Reduce file size", "Try different format", "Wait for processing"]
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Cleanup typewriter timeouts
  useEffect(() => {
    return () => {
      typewriterTimeouts.current.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  // Typewriter effect function
  const startTypewriter = (message: Message, fullContent: string) => {
    const words = fullContent.split(' ');
    let currentContent = '';
    let wordIndex = 0;

    const typeNextWord = () => {
      if (wordIndex < words.length) {
        currentContent += (wordIndex > 0 ? ' ' : '') + words[wordIndex];

        setMessages(prev => prev.map(msg =>
          msg.id === message.id
            ? { ...msg, displayedContent: currentContent, isTypewriting: true }
            : msg
        ));

        wordIndex++;

        // Variable speed based on content complexity
        const delay = words[wordIndex - 1]?.length > 8 ? 120 : 80;
        const timeout = setTimeout(typeNextWord, delay);
        typewriterTimeouts.current.push(timeout);
      } else {
        // Typewriting complete
        setMessages(prev => prev.map(msg =>
          msg.id === message.id
            ? { ...msg, displayedContent: fullContent, isTypewriting: false }
            : msg
        ));
      }
    };

    typeNextWord();
  };

  // Determine message complexity for appropriate thinking time
  const getMessageComplexity = (message: string, analysis: any): 'simple' | 'complex' | 'expert' => {
    const lowerMessage = message.toLowerCase();

    // Expert level questions
    if (
      lowerMessage.includes('strategy') ||
      lowerMessage.includes('optimize') ||
      lowerMessage.includes('workflow') ||
      lowerMessage.includes('comprehensive') ||
      lowerMessage.includes('complete guide') ||
      lowerMessage.includes('step by step') ||
      analysis.tools.length > 2 ||
      message.length > 100
    ) {
      return 'expert';
    }

    // Complex questions
    if (
      lowerMessage.includes('how do i') ||
      lowerMessage.includes('create') ||
      lowerMessage.includes('analyze') ||
      lowerMessage.includes('troubleshoot') ||
      analysis.tools.length > 0 ||
      message.length > 50
    ) {
      return 'complex';
    }

    // Simple questions
    return 'simple';
  };

  // Simulate intelligent thinking with progress
  const simulateThinking = async (duration: number, description: string) => {
    setIsTyping(true);
    setThinkingProgress(0);

    const steps = [
      'Analyzing your request...',
      'Accessing CreateGen Studio knowledge base...',
      'Consulting best practices...',
      'Formulating expert response...',
      'Optimizing recommendations...'
    ];

    const stepDuration = duration / steps.length;

    for (let i = 0; i < steps.length; i++) {
      setThinkingProgress((i + 1) / steps.length * 100);
      await new Promise(resolve => setTimeout(resolve, stepDuration));
    }

    setIsTyping(false);
    setThinkingProgress(0);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Enhanced welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        content: `👋 **Hi! I'm your AI Content Assistant.**

I can help you create content, analyze performance, generate ideas, and optimize your workflow. Just ask me anything!

What would you like to work on today? 🚀`,
        isUser: false,
        timestamp: new Date(),
        type: 'info',
        actions: [
          {
            label: 'Create My First Video',
            action: () => handleQuickWorkflow('video-creation'),
            icon: FilmIcon,
            type: 'primary'
          },
          {
            label: 'Analyze My Performance',
            action: () => handleQuickWorkflow('performance-analysis'),
            icon: ChartBarIcon,
            type: 'secondary'
          },
          {
            label: 'Plan Content Strategy',
            action: () => handleQuickWorkflow('strategy-planning'),
            icon: MapIcon,
            type: 'secondary'
          }
        ],
        metadata: {
          confidence: 100,
          category: 'welcome',
          relatedTools: ['all']
        }
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen]);

  const handleQuickWorkflow = (workflow: string) => {
    const workflowMessages: Record<string, string> = {
      'video-creation': "I want to create a viral video from start to finish. Walk me through the complete process.",
      'performance-analysis': "I need to analyze my channel's performance and understand what's working and what isn't.",
      'strategy-planning': "Help me create a comprehensive content strategy for my channel."
    };

    const message = workflowMessages[workflow];
    if (message) {
      handleSendMessage(message);
    }
  };

  const analyzeUserIntent = (message: string): {
    intent: string;
    confidence: number;
    entities: string[];
    tools: string[];
    urgency: 'low' | 'medium' | 'high';
  } => {
    const lowerMessage = message.toLowerCase();
    
    // Intent classification
    let intent = 'general';
    let confidence = 0.5;
    let entities: string[] = [];
    let tools: string[] = [];
    let urgency: 'low' | 'medium' | 'high' = 'medium';

    // Specific intent detection
    if (lowerMessage.includes('create') || lowerMessage.includes('make') || lowerMessage.includes('generate')) {
      intent = 'creation';
      confidence = 0.9;
      urgency = 'medium';
    } else if (lowerMessage.includes('fix') || lowerMessage.includes('error') || lowerMessage.includes('not working') || lowerMessage.includes('broken')) {
      intent = 'troubleshooting';
      confidence = 0.95;
      urgency = 'high';
    } else if (lowerMessage.includes('how') || lowerMessage.includes('tutorial') || lowerMessage.includes('guide')) {
      intent = 'guidance';
      confidence = 0.85;
      urgency = 'low';
    } else if (lowerMessage.includes('analyze') || lowerMessage.includes('performance') || lowerMessage.includes('metrics')) {
      intent = 'analysis';
      confidence = 0.9;
      urgency = 'medium';
    } else if (lowerMessage.includes('optimize') || lowerMessage.includes('improve') || lowerMessage.includes('better')) {
      intent = 'optimization';
      confidence = 0.8;
      urgency = 'medium';
    }

    // Entity extraction (tools mentioned)
    Object.keys(APP_KNOWLEDGE.tools).forEach(toolKey => {
      const tool = APP_KNOWLEDGE.tools[toolKey as keyof typeof APP_KNOWLEDGE.tools];
      if (lowerMessage.includes(tool.name.toLowerCase()) || lowerMessage.includes(toolKey)) {
        tools.push(toolKey);
        entities.push(tool.name);
      }
    });

    // Content type detection
    const contentTypes = ['video', 'thumbnail', 'script', 'title', 'description', 'strategy', 'calendar', 'trend'];
    contentTypes.forEach(type => {
      if (lowerMessage.includes(type)) {
        entities.push(type);
      }
    });

    return { intent, confidence, entities, tools, urgency };
  };

  const generateIntelligentResponse = async (userMessage: string): Promise<Message> => {
    // Determine thinking complexity
    const analysis = analyzeUserIntent(userMessage);
    const messageComplexity = getMessageComplexity(userMessage, analysis);

    // Set appropriate thinking state
    if (messageComplexity === 'simple') {
      setThinkingState('analyzing');
      await simulateThinking(1000, 'Quick analysis of your request...');
    } else if (messageComplexity === 'complex') {
      setThinkingState('deep-thinking');
      await simulateThinking(3000, 'Deep analysis in progress...');
    } else {
      setThinkingState('consulting');
      await simulateThinking(4500, 'Consulting my expertise database...');
    }

    setThinkingState('none');

    // Update conversation context
    setConversationContext(prev => [...prev.slice(-4), userMessage]);

    let response = '';
    let type: Message['type'] = 'text';
    let actions: Message['actions'] = [];
    let metadata = analysis;

    const lowerMessage = userMessage.toLowerCase();

    // Intent-based response generation
    switch (analysis.intent) {
      case 'creation':
        response = generateCreationResponse(userMessage, analysis);
        type = 'workflow';
        actions = getCreationActions(analysis);
        break;
      
      case 'troubleshooting':
        response = generateTroubleshootingResponse(userMessage, analysis);
        type = 'troubleshooting';
        actions = getTroubleshootingActions(analysis);
        break;
      
      case 'guidance':
        response = generateGuidanceResponse(userMessage, analysis);
        type = 'suggestion';
        actions = getGuidanceActions(analysis);
        break;
      
      case 'analysis':
        response = generateAnalysisResponse(userMessage, analysis);
        type = 'analysis';
        actions = getAnalysisActions(analysis);
        break;
      
      case 'optimization':
        response = generateOptimizationResponse(userMessage, analysis);
        type = 'suggestion';
        actions = getOptimizationActions(analysis);
        break;
      
      default:
        response = generateContextualResponse(userMessage, analysis);
        actions = getGeneralActions(analysis);
    }

    // Create the message first
    const aiMessage: Message = {
      id: Date.now().toString(),
      content: response,
      isUser: false,
      timestamp: new Date(),
      type,
      actions,
      metadata: {
        ...metadata,
        category: analysis.intent,
        relatedTools: analysis.tools
      },
      displayedContent: '',
      isTypewriting: true
    };

    return aiMessage;
  };

  const generateCreationResponse = (message: string, analysis: any): string => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('video') || lowerMessage.includes('viral')) {
      return `🎬 **VIRAL VIDEO STRATEGY: The Complete Expert Framework**

As your content strategist, I'm going to share the exact system that has generated over 50M+ views for my clients. This isn't theory - this is battle-tested methodology.

**🔥 PHASE 1: Strategic Foundation (20 mins)**
**Step 1.1:** Open Trends → Filter by your niche → Identify rising opportunities (aim for 10K-100K monthly searches)
**Step 1.2:** Launch YT Analysis → Input 3 top competitors → Document their successful formats, timing, and hooks
**Step 1.3:** Define your competitive edge: What unique value/perspective can you provide that they don't?

**🎯 PHASE 2: Content Architecture (35 mins)**
**Step 2.1:** Generator �� "Video Hook" → Create 5 variations → Test each for emotional trigger strength
**Step 2.2:** Generator → "YouTube Script" → Build full narrative with proven retention patterns
**Step 2.3:** Thumbnails → Design 3 variants → Use A/B testing principles for maximum CTR (target 8%+)

**📈 PHASE 3: Launch & Optimization (20 mins)**
**Step 3.1:** Strategy → Optimize metadata with high-intent keywords → Schedule optimal posting time
**Step 3.2:** Calendar → Plan follow-up content to capitalize on momentum
**Step 3.3:** Set YT Stats tracking for real-time performance monitoring

**💡 CONSULTANT INSIGHT:** The difference between 1K and 1M views is in the first 15 seconds. 73% of viral videos hook viewers with a problem/curiosity gap within 8 seconds.

**Ready for viral success?** Let's start with trend analysis - I'll guide you to the perfect opportunity for your niche!`;
    }
    
    if (lowerMessage.includes('thumbnail')) {
      return `🎨 **Let's Create Click-Worthy Thumbnails!**

Here's my proven thumbnail creation process:

**Step 1: Psychology First**
• What emotion do you want to trigger? (curiosity, excitement, urgency)
• Who is your target viewer? (their age, interests, problems)
• What's the main benefit you're promising?

**Step 2: Design Elements**
• **Text**: Keep it under 4 words, make it BOLD
• **Faces**: Use close-ups with strong emotions if relevant
• **Contrast**: Bright elements against darker backgrounds
• **Rule of Thirds**: Place key elements at intersection points

**Step 3: CreateGen Studio Process**
1. Open Thumbnails tab
2. Choose a template that matches your video mood
3. Add your key text (test different versions)
4. Use AI backgrounds for professional look
5. Export multiple versions for A/B testing

**Step 4: Testing & Optimization**
• Create 3-5 variations
• Test different text, colors, layouts
• Use YT Stats to track which performs better
• Iterate based on click-through rates

**Insider Secret:** The best thumbnails tell a story in 1 second. Your viewer should instantly know what they'll get and why they need it.

Want to create your first thumbnail now?`;
    }

    if (lowerMessage.includes('script')) {
      return `📝 **Let's Write a Compelling Script!**

Here's my step-by-step script creation method:

**STEP 1: Hook (First 15 seconds)**
• Start with a problem, surprising fact, or bold claim
• Use Generator's "Video Hook" content type
• Test multiple hooks - this determines if people stay

**STEP 2: Promise & Preview**
• Tell them exactly what they'll learn
• Give a quick preview of the best part
• Set clear expectations

**STEP 3: Content Structure**
• Break into 3-5 main points
• Use Generator's "YouTube Script" for full structure
• Include transitions between sections

**STEP 4: Engagement Elements**
• Ask questions to keep viewers active
• Include call-to-actions throughout
• Use pattern interrupts (sound effects, visual changes)

**STEP 5: Strong Conclusion**
• Summarize key takeaways
• Clear next steps for viewers
• Strong subscribe/engagement ask

**Advanced Tip:** Use the Generator's different AI personas to match your brand voice. The "Expert" persona works great for educational content, while "Friendly" is perfect for lifestyle videos.

Ready to write your script? What's your video topic?`;
    }

    return `🚀 **I'm excited to help you create something amazing!**

To give you the most specific guidance, I need to understand exactly what you want to create. Here's what I can help you with:

**Content Creation:**
• Video scripts (any niche or style)
• Eye-catching thumbnails
• Social media posts
• Email campaigns
• Blog articles
• Marketing copy

**Visual Design:**
• Mind maps and flowcharts
• Strategy diagrams
• Presentation layouts
• Infographics

**Strategy & Planning:**
• Content calendars
• Channel strategies
• Competitive analysis
• Growth plans

Tell me specifically what you want to create, and I'll walk you through the exact process step-by-step!`;
  };

  const generateTroubleshootingResponse = (message: string, analysis: any): string => {
    const lowerMessage = message.toLowerCase();

    // Specific troubleshooting scenarios
    if (lowerMessage.includes('not working') || lowerMessage.includes('broken')) {
      return `🔧 **Let's Fix This Issue Right Away!**

I need to diagnose exactly what's happening. Here's my systematic troubleshooting approach:

**IMMEDIATE STEPS:**
1. **Refresh the page** - Sometimes it's just a temporary glitch
2. **Check your internet** - Weak connection can cause issues
3. **Clear browser cache** - Old data might be interfering

**SPECIFIC DIAGNOSTICS:**
Tell me:
• Which tool/feature is having issues?
• What exactly happens when you try to use it?
• Any error messages you see?
• When did this start happening?

**COMMON FIXES:**

**Generator Issues:**
• Check your plan limits (Free: 5/day, Creator Pro: 50/day)
• Try a different content type
• Switch AI personas

**Canvas Problems:**
• Update your browser (Canvas needs WebGL)
• Disable extensions temporarily
• Try incognito mode

**YouTube Connection:**
• Log out and back into Google
• Check permissions in Google account settings
• Try disconnecting and reconnecting

**Export Failures:**
• Reduce file size
• Try different format
• Check available storage space

Give me more details about what's not working, and I'll give you the exact solution!`;
    }

    if (lowerMessage.includes('slow') || lowerMessage.includes('loading')) {
      return `⚡ **Let's Speed Things Up!**

Slow performance can be frustrating! Here's how to optimize your experience:

**IMMEDIATE FIXES:**
1. **Close unnecessary browser tabs** - Each tab uses memory
2. **Refresh the page** - Clear temporary data
3. **Check internet speed** - Use speedtest.net

**BROWSER OPTIMIZATION:**
• Update to latest browser version
• Clear cache and cookies
• Disable unused extensions
• Try incognito/private mode

**CREATEGEN SPECIFIC TIPS:**
• **Canvas**: Large designs load slower - try simpler layouts first
• **Generator**: Batch operations are more efficient than one-by-one
• **Thumbnails**: High-res exports take longer - be patient
• **YT Analysis**: First-time channel analysis takes 2-3 minutes

**PERFORMANCE SETTINGS:**
• Close other applications using internet
• Use Chrome or Firefox for best performance
• Ensure you have at least 4GB RAM available

**STILL SLOW?**
If you're on a slower connection, try:
• Working during off-peak hours
• Using simpler features first
• Exporting smaller file sizes

What specifically is running slow for you? I can give more targeted advice!`;
    }

    return `🛠️ **I'm Here to Fix Any Issue You're Having!**

Don't worry - most issues have quick solutions. I've helped solve thousands of problems, and I'm confident we can get you back on track.

**To help you faster, tell me:**
1. What were you trying to do when the issue happened?
2. What exactly is the problem? (error message, not loading, unexpected behavior)
3. Which tool or feature is affected?
4. Have you tried refreshing the page?

**Most Common Issues & Quick Fixes:**

🔴 **Can't Generate Content** → Check plan limits, try different content type
🔴 **YouTube Won't Connect** → Reauthorize Google account permissions  
🔴 **Canvas Not Loading** → Update browser, disable extensions
🔴 **Exports Failing** → Check file size, try different format
🔴 **Slow Performance** → Clear cache, close other tabs

I'm ready to solve this with you - just give me those details!`;
  };

  const generateGuidanceResponse = (message: string, analysis: any): string => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('how') && analysis.tools.length > 0) {
      const tool = analysis.tools[0];
      const toolInfo = APP_KNOWLEDGE.tools[tool as keyof typeof APP_KNOWLEDGE.tools];
      
      if (toolInfo) {
        return `📚 **Complete Guide to ${toolInfo.name}**

**Purpose:** ${toolInfo.purpose}

**Key Features:**
${toolInfo.features.map(feature => `• ${feature}`).join('\n')}

**Step-by-Step Workflow:**
${toolInfo.workflows.map((step, index) => `${index + 1}. **${step}**`).join('\n')}

**Pro Tips:**
${toolInfo.tips}

**Best Practices:**
• Start with clear goals in mind
• Experiment with different options
• Save your best work for future reference
• Use in combination with other tools for best results

**Common Use Cases:**
Let me know what you specifically want to achieve with ${toolInfo.name}, and I'll give you detailed step-by-step instructions!

Want me to walk you through a specific workflow?`;
      }
    }

    if (lowerMessage.includes('beginner') || lowerMessage.includes('new') || lowerMessage.includes('start')) {
      return `🌟 **Perfect! Let's Get You Started Like a Pro!**

Welcome to CreateGen Studio! I'm going to set you up for success from day one.

**YOUR FIRST 30 MINUTES PLAN:**

**Minutes 1-5: Orientation**
• Take a quick tour of Studio Hub (your home base)
• Press Cmd+K to see the command palette
• Notice the 11 tools in your sidebar

**Minutes 6-15: Create Your First Content**
• Go to Generator tab
• Try "YouTube Title" content type
• Input a topic you're passionate about
• Generate 5 titles and see the magic!

**Minutes 16-25: Explore Visual Tools**
• Open Canvas tab
• Create a simple mind map of your content ideas
• Drag, connect, and style elements

**Minutes 26-30: Plan Ahead**
• Check out Trends to see what's hot
• Browse Strategy tab for planning tools
• Set up your content calendar

**BEGINNER-FRIENDLY TOOLS TO START WITH:**
1. **Generator** - Easiest wins, instant results
2. **Canvas** - Visual and intuitive
3. **Trends** - Great for inspiration
4. **History** - See everything you create

**AVOID THESE INITIALLY:**
• YT Analysis (needs channel connection first)
• Complex Canvas designs
• Advanced Strategy features

Ready for your first win? Let's generate some amazing content titles!`;
    }

    return `��� **I'm Your Personal Tutor for CreateGen Studio!**

I love helping people master this platform! Whether you're a complete beginner or looking to level up specific skills, I've got you covered.

**LEARNING PATHS AVAILABLE:**

**🚀 Quick Start (30 mins)**
Perfect for: Complete beginners
Learn: Basic tool navigation, first content creation, key features

**���� Creator Accelerator (2 hours)**
Perfect for: Serious content creators
Learn: Advanced workflows, tool combinations, optimization strategies

**🎯 Specific Tool Mastery**
Perfect for: Focused skill building
Learn: Deep dive into any of our 11 tools

**💼 Business Strategy (1 hour)**
Perfect for: Agencies and businesses
Learn: Client workflows, team features, scaling strategies

**WHAT WOULD YOU LIKE TO LEARN?**
• "How to create viral content from scratch"
• "Master thumbnail design that gets clicks"
• "Build a complete content strategy"
• "Analyze competitors like a pro"
• "Set up automated workflows"

Just tell me what you want to accomplish, and I'll create a personalized learning path for you!`;
  };

  const generateAnalysisResponse = (message: string, analysis: any): string => {
    return `📊 **Let's Dive Deep Into Your Performance Analysis!**

I'll help you understand exactly what's working and what needs improvement.

**COMPREHENSIVE ANALYSIS PROCESS:**

**STEP 1: Data Collection (YT Stats)**
• Connect your YouTube channel if you haven't already
• Review last 30 days of performance
• Identify your top 5 and bottom 5 videos

**STEP 2: Competitive Intelligence (YT Analysis)**
• Analyze 3-5 competitors in your niche
• Compare their successful content to yours
• Identify content gaps and opportunities

**STEP 3: Performance Breakdown**
Let's examine:
• **Click-Through Rate (CTR)** - Are your thumbnails/titles working?
• **Average View Duration** - Is your content engaging?
• **Subscriber Conversion** - Are you growing your audience?
• **Engagement Rate** - Are people interacting?

**STEP 4: Actionable Insights**
I'll help you identify:
• Which content types perform best for you
• Optimal posting times and frequency
• Thumbnail styles that get clicks
• Topics your audience loves most

**STEP 5: Optimization Strategy**
Based on data, we'll create:
• Content improvement plan
• Thumbnail optimization strategy
• Title formula that works for you
• Posting schedule optimization

**READY TO START?**
First, tell me: Do you have YouTube analytics access, and what's your main goal? (More views, subscribers, engagement, revenue?)

I'll tailor the analysis to focus on what matters most to you!`;
  };

  const generateOptimizationResponse = (message: string, analysis: any): string => {
    return `🚀 **Let's Optimize for Maximum Results!**

I love optimization challenges! Let's turn your content into a high-performing machine.

**OPTIMIZATION AUDIT CHECKLIST:**

**📸 THUMBNAIL OPTIMIZATION**
Current Issues to Check:
• Are faces clearly visible and emotional?
• Is text readable on mobile devices?
• Do colors stand out in YouTube's interface?
• Are you testing multiple versions?

**📝 TITLE OPTIMIZATION**
Power Formula: [Emotional Hook] + [Clear Benefit] + [Urgency/Curiosity]
• Front-load important keywords
• Use numbers when possible
• Create curiosity gaps
• Match search intent

**🎬 CONTENT OPTIMIZATION**
• Hook strength (first 15 seconds)
• Pacing and energy level
• Call-to-action placement
• End screen effectiveness

**📈 STRATEGY OPTIMIZATION**
• Posting consistency
• Topic selection process
• Audience engagement tactics
• Cross-platform promotion

**🔍 TECHNICAL OPTIMIZATION**
• SEO in descriptions
• Tag strategy
• End screens and cards
• Community tab usage

**PERSONALIZED OPTIMIZATION PLAN:**

Tell me:
1. What specifically needs optimization? (views, CTR, engagement, subscribers)
2. What's your current biggest challenge?
3. What type of content do you create?

I'll create a custom 30-day optimization plan that addresses your exact situation!

Ready to 10x your results?`;
  };

  const generateContextualResponse = (message: string, analysis: any): string => {
    return `💡 **I'm here to help with whatever you need!**

Based on what you've asked, I can provide specific guidance on:

**If you're looking to:**
🎯 **Create Content** - I'll walk you through our proven content creation workflows
📊 **Analyze Performance** - Let's dive deep into your metrics and find optimization opportunities  
🛠️ **Learn Tools** - I'll teach you any feature with hands-on tutorials
🔧 **Fix Issues** - I can troubleshoot and solve any technical problems
🚀 **Optimize Results** - Let's improve your content performance systematically

**Popular Questions I Love Helping With:**
• "How do I create content that actually gets views?"
• "Walk me through analyzing my competitors"
• "What's the best workflow for consistent content creation?"
• "Help me understand why my content isn't performing"
• "Show me how to use [specific tool] effectively"

**The more specific you are, the better I can help!**

For example, instead of "help with YouTube," try:
• "My YouTube videos get low click-through rates - fix this"
• "Create a thumbnail that will get 10%+ CTR"
• "Analyze why my competitor gets more views"

What would you like to tackle first? I'm excited to help you succeed! 🎬`;
  };

  // Action generators for different intents
  const getCreationActions = (analysis: any): Message['actions'] => [
    {
      label: 'Start Creating',
      action: () => onNavigateToTab?.('generator'),
      icon: RocketLaunchIcon,
      type: 'primary'
    },
    {
      label: 'Browse Templates',
      action: () => onNavigateToTab?.('studioHub'),
      icon: BeakerIcon,
      type: 'secondary'
    }
  ];

  const getTroubleshootingActions = (analysis: any): Message['actions'] => [
    {
      label: 'Run Diagnostics',
      action: () => handleSendMessage("Run a complete diagnostic check on my account"),
      icon: BugAntIcon,
      type: 'primary'
    },
    {
      label: 'Contact Support',
      action: () => window.open('mailto:support@creategen.ai', '_blank'),
      icon: ShieldCheckIcon,
      type: 'secondary'
    }
  ];

  const getGuidanceActions = (analysis: any): Message['actions'] => [
    {
      label: 'Show Me Around',
      action: () => handleSendMessage("Give me a complete tour of all features"),
      icon: MapIcon,
      type: 'primary'
    },
    {
      label: 'Quick Tutorial',
      action: () => onNavigateToTab?.('studioHub'),
      icon: AcademicCapIcon,
      type: 'secondary'
    }
  ];

  const getAnalysisActions = (analysis: any): Message['actions'] => [
    {
      label: 'Check YT Stats',
      action: () => onNavigateToTab?.('ytStats'),
      icon: ChartPieIcon,
      type: 'primary'
    },
    {
      label: 'Analyze Competitors',
      action: () => onNavigateToTab?.('ytAnalysis'),
      icon: EyeIcon,
      type: 'secondary'
    }
  ];

  const getOptimizationActions = (analysis: any): Message['actions'] => [
    {
      label: 'Create Strategy',
      action: () => onNavigateToTab?.('strategy'),
      icon: ChartBarIcon,
      type: 'primary'
    },
    {
      label: 'Test Thumbnails',
      action: () => onNavigateToTab?.('thumbnails'),
      icon: PhotoIcon,
      type: 'secondary'
    }
  ];

  const getGeneralActions = (analysis: any): Message['actions'] => [
    {
      label: 'Explore Tools',
      action: () => onNavigateToTab?.('studioHub'),
      icon: CogIcon,
      type: 'secondary'
    },
    {
      label: 'Get Ideas',
      action: () => onNavigateToTab?.('generator'),
      icon: LightBulbIcon,
      type: 'secondary'
    }
  ];

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text || !auth.currentUser) return;

    // Temporarily disable usage checking until Firestore rules are deployed
    const canAsk = true; // Always allow questions for now

    // TODO: Re-enable usage checking once Firestore rules are deployed
    /*
    const canAsk = await aiAssistantUsageService.canAskQuestion(auth.currentUser.uid, currentPlan);

    if (!canAsk) {
      // Show upgrade prompt for limit reached
      setUpgradePromptTrigger('limit_reached');
      setShowUpgradePrompt(true);
      return;
    }
    */

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
      const aiResponse = await generateIntelligentResponse(text);

      // Temporarily disable usage tracking until Firestore rules are deployed
      // TODO: Re-enable once Firestore rules are deployed
      /*
      const responseLength = aiResponse.content.length;
      const usageSuccess = await aiAssistantUsageService.incrementUsage(
        auth.currentUser.uid,
        text,
        responseLength,
        currentPlan,
        userContext?.currentTool || 'studioHub'
      );

      if (usageSuccess) {
        // Reload usage stats
        await loadUsageStats();

        // Check if we should show low usage warning
        const updatedStats = await aiAssistantUsageService.getUsageStats(auth.currentUser.uid, currentPlan);
        if (!updatedStats.isUnlimited && updatedStats.questionsRemaining <= 2 && updatedStats.questionsRemaining > 0) {
          // Show subtle upgrade hint for low usage (not intrusive)
          setTimeout(() => {
            if (currentPlan === 'free') {
              setUpgradePromptTrigger('low_usage');
              // Only show upgrade prompt if user is on free plan and running low
              if (Math.random() > 0.7) { // 30% chance to avoid being annoying
                setShowUpgradePrompt(true);
              }
            }
          }, 3000);
        }
      }
      */

      // Add message to state first (with empty displayed content)
      setMessages(prev => [...prev, aiResponse]);

      // Start typewriter effect after a brief delay
      setTimeout(() => {
        startTypewriter(aiResponse, aiResponse.content);
      }, 500);

    } catch (error) {
      console.error('Error generating AI response:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "I apologize, but I encountered an issue processing your request. Let me know what you need help with, and I'll do my best to assist you!",
        isUser: false,
        timestamp: new Date(),
        type: 'warning'
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
        return `fixed bottom-24 right-6 w-96 h-[36rem] z-50 ${baseClasses}`;
      case 'sidebar':
        return `w-full h-full ${baseClasses}`;
      case 'modal':
        return `fixed inset-4 md:inset-20 z-50 ${baseClasses}`;
      default:
        return `${baseClasses} ${className}`;
    }
  };

  const getMessageTypeIcon = (type: Message['type']) => {
    switch (type) {
      case 'workflow': return <RocketLaunchIcon className="w-4 h-4 text-blue-400" />;
      case 'troubleshooting': return <ExclamationTriangleIcon className="w-4 h-4 text-red-400" />;
      case 'analysis': return <ChartBarIcon className="w-4 h-4 text-green-400" />;
      case 'suggestion': return <LightBulbIcon className="w-4 h-4 text-yellow-400" />;
      case 'success': return <CheckCircleIcon className="w-4 h-4 text-green-400" />;
      case 'warning': return <ExclamationTriangleIcon className="w-4 h-4 text-yellow-400" />;
      case 'info': return <InformationCircleIcon className="w-4 h-4 text-blue-400" />;
      default: return <SparklesIcon className="w-4 h-4 text-purple-400" />;
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
      {/* Enhanced Header */}
      <div className="border-b border-slate-700/50 bg-gradient-to-r from-purple-600/10 to-blue-600/10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <SparklesIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">AI Support Specialist</h3>
              <p className="text-slate-400 text-xs">Expert in all CreateGen Studio features</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Usage Display */}
        <div className="px-4 pb-3">
          <AIAssistantUsageDisplay
            userPlan={currentPlan}
            compact={true}
            onUpgradeClick={() => {
              setUpgradePromptTrigger('manual');
              setShowUpgradePrompt(true);
            }}
          />
        </div>
      </div>

      {/* Enhanced Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ height: position === 'floating' ? '24rem' : 'calc(100% - 8rem)' }}>
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
                {/* Message Type Indicator for AI messages */}
                {!message.isUser && message.type && (
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-600/30">
                    {getMessageTypeIcon(message.type)}
                    <span className="text-xs font-medium text-slate-300 capitalize">
                      {message.type === 'troubleshooting' ? 'Problem Solving' : message.type}
                    </span>
                    {message.metadata?.confidence && (
                      <span className="text-xs text-slate-400">
                        ({Math.round(message.metadata.confidence * 100)}% confident)
                      </span>
                    )}
                  </div>
                )}

                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.isUser ? message.content : (message.displayedContent || message.content)}
                  {message.isTypewriting && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="text-purple-400 ml-1"
                    >
                      ▊
                    </motion.span>
                  )}
                </div>
                
                {/* Enhanced Action buttons */}
                {!message.isUser && message.actions && message.actions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {message.actions.map((action, index) => {
                      const IconComponent = action.icon || RocketLaunchIcon;
                      const buttonStyle = action.type === 'primary' 
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white'
                        : action.type === 'success'
                        ? 'bg-green-600/20 hover:bg-green-600/30 border-green-500/50 text-green-300'
                        : action.type === 'warning'
                        ? 'bg-yellow-600/20 hover:bg-yellow-600/30 border-yellow-500/50 text-yellow-300'
                        : 'bg-slate-600/50 hover:bg-slate-600 border border-slate-500/50 text-slate-200';
                      
                      return (
                        <button
                          key={index}
                          onClick={action.action}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105 ${buttonStyle}`}
                        >
                          <IconComponent className="w-3 h-3" />
                          {action.label}
                        </button>
                      );
                    })}
                  </div>
                )}
                
                {/* Enhanced Message Footer */}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-600/30">
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    {!message.isUser && <SparklesIcon className="w-3 h-3" />}
                    {message.isUser && <UserIcon className="w-3 h-3" />}
                    <span>{message.isUser ? 'You' : 'AI Specialist'}</span>
                    {message.metadata?.estimatedTime && (
                      <span className="text-slate-500">• {message.metadata.estimatedTime}</span>
                    )}
                  </div>
                  <span className="text-xs text-slate-500">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Enhanced Thinking indicator with sophistication */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-gradient-to-r from-slate-700/80 to-slate-800/80 border border-purple-500/30 p-4 rounded-xl shadow-lg">
              <div className="space-y-3">
                {/* Thinking State Header */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BrainIcon className="w-3 h-3 text-purple-400" />
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-white">
                      {thinkingState === 'analyzing' && 'Analyzing Request'}
                      {thinkingState === 'deep-thinking' && 'Deep Analysis Mode'}
                      {thinkingState === 'consulting' && 'Expert Consultation'}
                      {thinkingState === 'none' && 'Processing...'}
                    </span>
                    <p className="text-xs text-slate-400">
                      {thinkingState === 'analyzing' && 'Quick assessment of your needs'}
                      {thinkingState === 'deep-thinking' && 'Accessing comprehensive knowledge base'}
                      {thinkingState === 'consulting' && 'Consulting expert strategies and workflows'}
                      {thinkingState === 'none' && 'Preparing response...'}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                {thinkingProgress > 0 && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Progress</span>
                      <span>{Math.round(thinkingProgress)}%</span>
                    </div>
                    <div className="w-full bg-slate-600/50 rounded-full h-1.5">
                      <motion.div
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-1.5 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${thinkingProgress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                )}

                {/* Thinking Process Indicators */}
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4].map((dot, index) => (
                    <motion.div
                      key={dot}
                      className="w-2 h-2 bg-purple-400 rounded-full"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.4, 1, 0.4]
                      }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: index * 0.2
                      }}
                    />
                  ))}
                  <span className="text-xs text-purple-300 ml-2">
                    Crafting expert response...
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Input */}
      <div className="p-4 border-t border-slate-700/50 bg-slate-800/50">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything specific about CreateGen Studio..."
            disabled={isLoading}
            className="flex-1 bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-colors text-sm"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputValue.trim()}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-white transition-all duration-200 flex items-center gap-2 hover:scale-105"
          >
            <PaperAirplaneIcon className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
          <span>💡 Be specific for better help</span>
          <span>•</span>
          <span>Press Enter to send</span>
        </div>
      </div>

      {/* Upgrade Prompt Modal */}
      <AIAssistantUpgradePrompt
        isOpen={showUpgradePrompt}
        onClose={() => setShowUpgradePrompt(false)}
        usageStats={usageStats}
        currentPlan={currentPlan}
        onUpgrade={(plan) => {
          setShowUpgradePrompt(false);
          // Navigate to billing page or handle upgrade
          onNavigateToTab?.('billing');
        }}
        trigger={upgradePromptTrigger}
      />
    </motion.div>
  );
};

export default IntelligentAIAssistant;
