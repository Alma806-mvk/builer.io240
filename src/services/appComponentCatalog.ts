/**
 * Comprehensive CreateGen Studio Component and Feature Catalog
 * Complete mapping of all app components, features, and workflows for AI Assistant
 */

export interface ComponentInfo {
  name: string;
  path: string;
  description: string;
  features: string[];
  dependencies: string[];
  userFacing: boolean;
  category: 'core' | 'tool' | 'ui' | 'service' | 'utility' | 'layout' | 'auth' | 'billing';
  keyFunctionality: string[];
}

export interface ToolMapping {
  toolId: string;
  toolName: string;
  primaryComponent: string;
  supportingComponents: string[];
  services: string[];
  features: string[];
  workflows: string[];
}

export interface WorkflowDefinition {
  name: string;
  description: string;
  steps: Array<{
    step: number;
    component: string;
    action: string;
    userInput: string;
    result: string;
  }>;
  involvedComponents: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
}

// Core Application Components
export const CORE_COMPONENTS: ComponentInfo[] = [
  {
    name: 'App',
    path: 'src/app.tsx',
    description: 'Main application component with routing and state management',
    features: ['Global state', 'Route management', 'Authentication flow', 'Theme management'],
    dependencies: ['React Router', 'Context providers', 'Firebase Auth'],
    userFacing: true,
    category: 'core',
    keyFunctionality: ['Application initialization', 'Global state management', 'Route coordination']
  },
  {
    name: 'StudioHub',
    path: 'src/components/StudioHub.tsx',
    description: 'Central dashboard and project management interface',
    features: ['Project management', 'Tool navigation', 'Activity feed', 'Quick launch', 'Command palette'],
    dependencies: ['Project data', 'User context', 'Tool components'],
    userFacing: true,
    category: 'core',
    keyFunctionality: ['Project creation', 'Tool access', 'Workspace management', 'Activity tracking']
  },
  {
    name: 'MainTabNavigation',
    path: 'src/components/MainTabNavigation.tsx',
    description: 'Primary navigation between all 11 tools',
    features: ['Tab switching', 'Tool icons', 'Active state', 'Responsive design'],
    dependencies: ['Tool components', 'Navigation state'],
    userFacing: true,
    category: 'layout',
    keyFunctionality: ['Tool navigation', 'State management', 'Visual feedback']
  }
];

// Tool-Specific Components
export const TOOL_COMPONENTS: ComponentInfo[] = [
  {
    name: 'GeneratorSection',
    path: 'src/components/GeneratorSection.tsx',
    description: 'AI content generation interface for 25+ content types',
    features: ['Content type selection', 'Platform optimization', 'AI persona settings', 'Batch generation'],
    dependencies: ['Gemini API', 'Content templates', 'Premium features'],
    userFacing: true,
    category: 'tool',
    keyFunctionality: ['Content generation', 'Platform optimization', 'Batch processing', 'Result refinement']
  },
  {
    name: 'CanvasSection',
    path: 'src/components/CanvasSection.tsx',
    description: 'Visual design tool for mind maps, flowcharts, and layouts',
    features: ['Drag-drop interface', 'Element library', 'Export options', 'Collaboration'],
    dependencies: ['Canvas renderer', 'Element components', 'Export utilities'],
    userFacing: true,
    category: 'tool',
    keyFunctionality: ['Visual design', 'Element manipulation', 'Export generation', 'Collaborative editing']
  },
  {
    name: 'ThumbnailMaker',
    path: 'src/components/ThumbnailMaker.tsx',
    description: 'Professional thumbnail creation with AI backgrounds',
    features: ['Template library', 'AI background generation', 'Text overlays', 'Effects panel'],
    dependencies: ['Image processing', 'AI generation', 'Template data'],
    userFacing: true,
    category: 'tool',
    keyFunctionality: ['Thumbnail design', 'AI enhancement', 'Template application', 'Export optimization']
  },
  {
    name: 'ChannelAnalysisSection',
    path: 'src/components/ChannelAnalysisSection.tsx',
    description: 'YouTube channel analysis and competitive intelligence',
    features: ['Multi-channel analysis', 'Content gap detection', 'Performance insights', 'Report generation'],
    dependencies: ['YouTube API', 'Analysis algorithms', 'Report templates'],
    userFacing: true,
    category: 'tool',
    keyFunctionality: ['Channel analysis', 'Competitive intelligence', 'Gap identification', 'Insight generation']
  },
  {
    name: 'YouTubeStatsEnhanced',
    path: 'src/components/YouTubeStatsEnhanced.tsx',
    description: 'Comprehensive YouTube analytics and performance metrics',
    features: ['Real-time stats', 'Engagement analysis', 'Growth tracking', 'Performance scoring'],
    dependencies: ['YouTube API', 'Analytics calculations', 'Visualization libraries'],
    userFacing: true,
    category: 'tool',
    keyFunctionality: ['Statistics display', 'Performance analysis', 'Engagement calculation', 'Growth tracking']
  },
  {
    name: 'EnhancedCalendar',
    path: 'src/components/EnhancedCalendar.tsx',
    description: 'Content scheduling and calendar management',
    features: ['Visual calendar', 'Event management', 'Strategy integration', 'Reminder system'],
    dependencies: ['Calendar libraries', 'Event data', 'Strategy imports'],
    userFacing: true,
    category: 'tool',
    keyFunctionality: ['Content scheduling', 'Calendar visualization', 'Event management', 'Integration workflows']
  },
  {
    name: 'TrendCardsView',
    path: 'src/components/TrendCardsView.tsx',
    description: 'Trend analysis and viral opportunity identification',
    features: ['Trend monitoring', 'Opportunity scoring', 'Content suggestions', 'Market insights'],
    dependencies: ['Web search API', 'Trend algorithms', 'Content analysis'],
    userFacing: true,
    category: 'tool',
    keyFunctionality: ['Trend identification', 'Opportunity analysis', 'Content recommendation', 'Market research']
  },
  {
    name: 'HistorySection',
    path: 'src/components/HistorySection.tsx',
    description: 'Content library and history management',
    features: ['Content search', 'Filtering system', 'Favorites management', 'Export options'],
    dependencies: ['Content database', 'Search algorithms', 'Export utilities'],
    userFacing: true,
    category: 'tool',
    keyFunctionality: ['Content management', 'Search functionality', 'Organization tools', 'Content reuse']
  },
  {
    name: 'EnhancedWebSearch',
    path: 'src/components/EnhancedWebSearch.tsx',
    description: 'AI-enhanced web search and research tool',
    features: ['Smart search', 'Result categorization', 'Insight extraction', 'Research tools'],
    dependencies: ['Search APIs', 'AI analysis', 'Content extraction'],
    userFacing: true,
    category: 'tool',
    keyFunctionality: ['Web research', 'Content analysis', 'Insight generation', 'Research organization']
  }
];

// AI and Enhancement Components
export const AI_COMPONENTS: ComponentInfo[] = [
  {
    name: 'EnhancedAIStudioAssistant',
    path: 'src/components/EnhancedAIStudioAssistant.tsx',
    description: 'Expert AI assistant with comprehensive app knowledge',
    features: ['Complete app knowledge', 'Workflow guidance', 'Troubleshooting', 'Performance analysis'],
    dependencies: ['Enhanced AI service', 'Knowledge base', 'User context'],
    userFacing: true,
    category: 'core',
    keyFunctionality: ['Expert guidance', 'Problem solving', 'Workflow optimization', 'Learning assistance']
  },
  {
    name: 'FloatingAIAssistant',
    path: 'src/components/FloatingAIAssistant.tsx',
    description: 'Floating AI assistant interface with plan-based features',
    features: ['Global access', 'Plan restrictions', 'Quick actions', 'Usage tracking'],
    dependencies: ['AI assistant', 'Subscription system', 'User plans'],
    userFacing: true,
    category: 'core',
    keyFunctionality: ['Global AI access', 'Plan enforcement', 'Quick assistance', 'Usage monitoring']
  },
  {
    name: 'SmartSuggestions',
    path: 'src/components/SmartSuggestions.tsx',
    description: 'Intelligent content and workflow suggestions',
    features: ['Context-aware suggestions', 'Performance optimization', 'Workflow improvements'],
    dependencies: ['AI analysis', 'User behavior', 'Performance data'],
    userFacing: true,
    category: 'utility',
    keyFunctionality: ['Smart recommendations', 'Context analysis', 'Performance optimization']
  }
];

// UI and Layout Components
export const UI_COMPONENTS: ComponentInfo[] = [
  {
    name: 'ResponsiveLayout',
    path: 'src/components/ResponsiveLayout.tsx',
    description: 'Responsive design system for all screen sizes',
    features: ['Mobile optimization', 'Responsive grids', 'Adaptive layouts'],
    dependencies: ['CSS frameworks', 'Breakpoint system'],
    userFacing: true,
    category: 'layout',
    keyFunctionality: ['Responsive design', 'Mobile adaptation', 'Layout optimization']
  },
  {
    name: 'GlobalCommandPalette',
    path: 'src/components/GlobalCommandPalette.tsx',
    description: 'Command palette for quick navigation and actions',
    features: ['Quick search', 'Command execution', 'Keyboard shortcuts'],
    dependencies: ['Navigation system', 'Command registry'],
    userFacing: true,
    category: 'ui',
    keyFunctionality: ['Quick access', 'Command execution', 'Keyboard navigation']
  },
  {
    name: 'EnhancedThemeToggle',
    path: 'src/components/EnhancedThemeToggle.tsx',
    description: 'Advanced theme management with customization',
    features: ['Theme switching', 'Custom themes', 'Preference persistence'],
    dependencies: ['Theme context', 'Style system'],
    userFacing: true,
    category: 'ui',
    keyFunctionality: ['Theme management', 'Customization', 'Preference handling']
  }
];

// Authentication and User Management
export const AUTH_COMPONENTS: ComponentInfo[] = [
  {
    name: 'AuthWrapper',
    path: 'src/components/AuthWrapper.tsx',
    description: 'Authentication wrapper and user session management',
    features: ['Session management', 'Route protection', 'User state'],
    dependencies: ['Firebase Auth', 'User context'],
    userFacing: true,
    category: 'auth',
    keyFunctionality: ['User authentication', 'Session management', 'Access control']
  },
  {
    name: 'AccountPage',
    path: 'src/components/AccountPage.tsx',
    description: 'User account management and settings',
    features: ['Profile management', 'Settings', 'Subscription info'],
    dependencies: ['User data', 'Subscription service'],
    userFacing: true,
    category: 'auth',
    keyFunctionality: ['Account management', 'Settings control', 'Profile updates']
  }
];

// Billing and Subscription Components
export const BILLING_COMPONENTS: ComponentInfo[] = [
  {
    name: 'BillingPage',
    path: 'src/components/BillingPage.tsx',
    description: 'Subscription management and billing interface',
    features: ['Plan management', 'Payment processing', 'Usage tracking'],
    dependencies: ['Stripe integration', 'Subscription service'],
    userFacing: true,
    category: 'billing',
    keyFunctionality: ['Subscription management', 'Payment processing', 'Plan upgrades']
  },
  {
    name: 'PremiumFeatureGate',
    path: 'src/components/PremiumFeatureGate.tsx',
    description: 'Premium feature access control and upgrade prompts',
    features: ['Feature gating', 'Upgrade prompts', 'Plan enforcement'],
    dependencies: ['Subscription service', 'Plan definitions'],
    userFacing: true,
    category: 'billing',
    keyFunctionality: ['Access control', 'Premium enforcement', 'Upgrade promotion']
  }
];

// Tool Mapping for AI Assistant
export const TOOL_MAPPINGS: ToolMapping[] = [
  {
    toolId: 'studioHub',
    toolName: 'Studio Hub',
    primaryComponent: 'StudioHub',
    supportingComponents: ['StudioHubDashboard', 'StudioHubCommandPalette', 'MainTabNavigation'],
    services: ['Project management', 'Activity tracking', 'Quick actions'],
    features: ['Project creation', 'Tool navigation', 'Command palette', 'Activity feed'],
    workflows: ['Create project', 'Navigate tools', 'Track activity', 'Quick launch']
  },
  {
    toolId: 'generator',
    toolName: 'Generator',
    primaryComponent: 'GeneratorSection',
    supportingComponents: ['GeneratorForm', 'GeneratorOutput', 'GeneratingContent'],
    services: ['Gemini AI', 'Content generation', 'Premium features'],
    features: ['25+ content types', 'Platform optimization', 'Batch generation', 'AI personas'],
    workflows: ['Generate content', 'Refine output', 'Batch create', 'Platform optimize']
  },
  {
    toolId: 'canvas',
    toolName: 'Canvas',
    primaryComponent: 'CanvasSection',
    supportingComponents: ['CanvasRenderer', 'PropertyPanel', 'ElementComponents'],
    services: ['Canvas rendering', 'Export generation', 'Collaboration'],
    features: ['Visual design', 'Mind maps', 'Element library', 'Export options'],
    workflows: ['Create design', 'Add elements', 'Collaborate', 'Export design']
  },
  {
    toolId: 'thumbnailMaker',
    toolName: 'Thumbnails',
    primaryComponent: 'ThumbnailMaker',
    supportingComponents: ['EnhancedThumbnailMaker', 'Template library'],
    services: ['AI background generation', 'Image processing', 'Template management'],
    features: ['Template library', 'AI backgrounds', 'Text overlays', 'Effects'],
    workflows: ['Choose template', 'Add text', 'Apply effects', 'Export thumbnail']
  },
  {
    toolId: 'channelAnalysis',
    toolName: 'YT Analysis',
    primaryComponent: 'ChannelAnalysisSection',
    supportingComponents: ['YouTube analytics', 'Report generation'],
    services: ['YouTube API', 'Analysis algorithms', 'Competitive intelligence'],
    features: ['Multi-channel analysis', 'Content gaps', 'Performance insights'],
    workflows: ['Enter channels', 'Analyze performance', 'Identify gaps', 'Generate report']
  },
  {
    toolId: 'youtubeStats',
    toolName: 'YT Stats',
    primaryComponent: 'YouTubeStatsEnhanced',
    supportingComponents: ['Analytics display', 'Performance tracking'],
    services: ['YouTube API', 'Statistics calculation', 'Performance analysis'],
    features: ['Real-time stats', 'Engagement analysis', 'Growth tracking'],
    workflows: ['Enter channel', 'View statistics', 'Analyze performance', 'Track growth']
  },
  {
    toolId: 'strategy',
    toolName: 'Strategy',
    primaryComponent: 'Strategy planning component',
    supportingComponents: ['Content planning', 'Strategy generation'],
    services: ['AI strategy generation', 'Content planning', 'Optimization'],
    features: ['Content pillars', 'Posting schedules', 'SEO strategy', 'Competitive analysis'],
    workflows: ['Define parameters', 'Generate strategy', 'Review pillars', 'Implement plan']
  },
  {
    toolId: 'calendar',
    toolName: 'Calendar',
    primaryComponent: 'EnhancedCalendar',
    supportingComponents: ['Event management', 'Schedule integration'],
    services: ['Calendar management', 'Strategy integration', 'Reminder system'],
    features: ['Visual calendar', 'Event creation', 'Strategy import', 'Reminders'],
    workflows: ['Create events', 'Import strategy', 'Set reminders', 'Track progress']
  },
  {
    toolId: 'trends',
    toolName: 'Trends',
    primaryComponent: 'TrendCardsView',
    supportingComponents: ['TrendCard', 'TrendAnalytics', 'TrendMonitoring'],
    services: ['Trend analysis', 'Web search', 'Opportunity identification'],
    features: ['Trend monitoring', 'Opportunity scoring', 'Content suggestions'],
    workflows: ['Research trends', 'Analyze opportunities', 'Generate content', 'Monitor performance']
  },
  {
    toolId: 'history',
    toolName: 'History',
    primaryComponent: 'HistorySection',
    supportingComponents: ['Content search', 'Favorites management'],
    services: ['Content storage', 'Search algorithms', 'Export utilities'],
    features: ['Content library', 'Search & filter', 'Favorites', 'Export'],
    workflows: ['Browse content', 'Search history', 'Manage favorites', 'Export collections']
  },
  {
    toolId: 'search',
    toolName: 'Web Search',
    primaryComponent: 'EnhancedWebSearch',
    supportingComponents: ['Search interface', 'Result analysis'],
    services: ['Web search API', 'AI analysis', 'Content extraction'],
    features: ['Smart search', 'Result categorization', 'Insight extraction'],
    workflows: ['Enter query', 'Analyze results', 'Extract insights', 'Apply findings']
  }
];

// Key Workflows Across Components
export const KEY_WORKFLOWS: WorkflowDefinition[] = [
  {
    name: 'Complete YouTube Video Creation',
    description: 'End-to-end workflow for creating optimized YouTube content',
    steps: [
      {
        step: 1,
        component: 'TrendCardsView',
        action: 'Research trending topics',
        userInput: 'Enter niche or topic',
        result: 'List of trending opportunities'
      },
      {
        step: 2,
        component: 'ChannelAnalysisSection',
        action: 'Analyze competitor channels',
        userInput: 'Enter competitor channel URLs',
        result: 'Competitive analysis report'
      },
      {
        step: 3,
        component: 'GeneratorSection',
        action: 'Generate video script',
        userInput: 'Video topic and parameters',
        result: 'Complete video script'
      },
      {
        step: 4,
        component: 'ThumbnailMaker',
        action: 'Create thumbnail',
        userInput: 'Design preferences',
        result: 'Professional thumbnail'
      },
      {
        step: 5,
        component: 'EnhancedCalendar',
        action: 'Schedule publication',
        userInput: 'Publish date and time',
        result: 'Scheduled content event'
      }
    ],
    involvedComponents: ['TrendCardsView', 'ChannelAnalysisSection', 'GeneratorSection', 'ThumbnailMaker', 'EnhancedCalendar'],
    difficulty: 'intermediate',
    estimatedTime: '45-60 minutes'
  },
  {
    name: 'Strategic Content Planning',
    description: 'Comprehensive content strategy development and implementation',
    steps: [
      {
        step: 1,
        component: 'Strategy Component',
        action: 'Create content strategy',
        userInput: 'Niche, audience, goals',
        result: 'Comprehensive strategy plan'
      },
      {
        step: 2,
        component: 'CanvasSection',
        action: 'Visualize strategy',
        userInput: 'Strategy elements',
        result: 'Visual strategy map'
      },
      {
        step: 3,
        component: 'EnhancedCalendar',
        action: 'Import posting schedule',
        userInput: 'Strategy schedule',
        result: 'Populated content calendar'
      },
      {
        step: 4,
        component: 'GeneratorSection',
        action: 'Generate content',
        userInput: 'Strategy content ideas',
        result: 'Content pieces for strategy'
      }
    ],
    involvedComponents: ['Strategy Component', 'CanvasSection', 'EnhancedCalendar', 'GeneratorSection'],
    difficulty: 'advanced',
    estimatedTime: '90-120 minutes'
  }
];

// Service Integration Map
export const SERVICE_INTEGRATIONS = {
  aiServices: ['enhancedAIAssistantService', 'geminiService', 'smartSuggestions'],
  authServices: ['authService', 'Firebase Auth', 'User management'],
  billingServices: ['stripeService', 'subscriptionService', 'creditManagement'],
  contentServices: ['contentGeneration', 'fileStorageService', 'exportUtilities'],
  analyticsServices: ['youtubeService', 'performanceTracking', 'insightGeneration'],
  utilityServices: ['notificationService', 'cacheService', 'errorHandling']
};

// Feature Categories for AI Assistant
export const FEATURE_CATEGORIES = {
  contentCreation: ['Generator', 'Thumbnails', 'Canvas', 'Strategy'],
  analysis: ['YT Analysis', 'YT Stats', 'Trends', 'Web Search'],
  management: ['Studio Hub', 'Calendar', 'History'],
  enhancement: ['AI Assistant', 'Premium Features', 'Automation'],
  userExperience: ['Responsive Design', 'Theme Management', 'Navigation']
};

export default {
  CORE_COMPONENTS,
  TOOL_COMPONENTS,
  AI_COMPONENTS,
  UI_COMPONENTS,
  AUTH_COMPONENTS,
  BILLING_COMPONENTS,
  TOOL_MAPPINGS,
  KEY_WORKFLOWS,
  SERVICE_INTEGRATIONS,
  FEATURE_CATEGORIES
};
