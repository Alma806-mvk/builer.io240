export interface MagicTool {
  id: string;
  label: string;
  iconName: string; // Icon component name as string
  description: string;
  color: string;
  category: 'regenerate' | 'refine' | 'transform' | 'analyze' | 'translate';
  enabled: boolean;
  requiresPremium?: boolean;
  action: 'regenerate' | 'refine' | 'custom';
  customAction?: string;
  creditCost: number; // Cost in credits
}

export interface MagicToolCategory {
  id: string;
  name: string;
  iconName: string; // Icon component name as string
  description: string;
  tools: MagicTool[];
}

// Default Magic Tools Configuration
export const DEFAULT_MAGIC_TOOLS: MagicToolCategory[] = [
  {
    id: 'regenerate',
    name: 'Regenerate',
    iconName: 'RefreshIcon',
    description: 'Create fresh versions of selected text',
    tools: [
      {
        id: 'regenerate-smart',
        label: 'Smart Regenerate',
        iconName: 'RefreshIcon',
        description: 'Regenerate with AI understanding context',
        color: '#10b981',
        category: 'regenerate',
        enabled: true,
        action: 'regenerate',
        creditCost: 1,
      },
      {
        id: 'regenerate-creative',
        label: 'Creative Rewrite',
        iconName: 'SparklesIcon',
        description: 'More creative and engaging version',
        color: '#8b5cf6',
        category: 'regenerate',
        enabled: true,
        requiresPremium: true,
        action: 'refine',
        customAction: 'creative',
        creditCost: 1,
      },
    ],
  },
  {
    id: 'refine',
    name: 'Refine Text',
    iconName: 'EditIcon',
    description: 'Improve and modify text style',
    tools: [
      {
        id: 'expand-text',
        label: 'Expand Text',
        iconName: 'ExpandIcon',
        description: 'Add more detail and expand content',
        color: '#8b5cf6',
        category: 'refine',
        enabled: true,
        action: 'refine',
        customAction: 'expand',
        creditCost: 1,
      },
      {
        id: 'simplify-text',
        label: 'Simplify',
        iconName: 'CompressIcon',
        description: 'Make text simpler and clearer',
        color: '#3b82f6',
        category: 'refine',
        enabled: true,
        action: 'refine',
        customAction: 'simplify',
        creditCost: 1,
      },
      {
        id: 'professional-tone',
        label: 'Professional Tone',
        iconName: 'TieIcon',
        description: 'Convert to professional writing style',
        color: '#dc2626',
        category: 'refine',
        enabled: true,
        action: 'refine',
        customAction: 'professional',
        creditCost: 1,
      },
      {
        id: 'casual-tone',
        label: 'Casual Tone',
        iconName: 'ChatIcon',
        description: 'Make text more conversational',
        color: '#ea580c',
        category: 'refine',
        enabled: true,
        action: 'refine',
        customAction: 'casual',
        creditCost: 1,
      },
    ],
  },
  {
    id: 'transform',
    name: 'Transform',
    iconName: 'SparklesIcon',
    description: 'Convert text to different formats',
    tools: [
      {
        id: 'add-emojis',
        label: 'Add Emojis',
        iconName: 'EmojiIcon',
        description: 'Add relevant emojis to text',
        color: '#f59e0b',
        category: 'transform',
        enabled: true,
        action: 'refine',
        customAction: 'add-emojis',
        creditCost: 1,
      },
      {
        id: 'bullet-points',
        label: 'To Bullet Points',
        iconName: 'CheckCircleIcon',
        description: 'Convert to bullet point format',
        color: '#10b981',
        category: 'transform',
        enabled: true,
        requiresPremium: true,
        action: 'refine',
        customAction: 'bullet-points',
        creditCost: 1,
      },
    ],
  },
  {
    id: 'analyze',
    name: 'Analyze',
    iconName: 'ChartBarIcon',
    description: 'Get insights about the text',
    tools: [
      {
        id: 'sentiment-analysis',
        label: 'Sentiment Analysis',
        iconName: 'ChartBarIcon',
        description: 'Analyze emotional tone',
        color: '#8b5cf6',
        category: 'analyze',
        enabled: true,
        requiresPremium: true,
        action: 'custom',
        customAction: 'analyze-sentiment',
        creditCost: 1,
      },
    ],
  },
  {
    id: 'translate',
    name: 'Translate',
    iconName: 'LanguageIcon',
    description: 'Translate to different languages',
    tools: [
      {
        id: 'translate-spanish',
        label: 'To Spanish',
        iconName: 'LanguageIcon',
        description: 'Translate to Spanish',
        color: '#ef4444',
        category: 'translate',
        enabled: true,
        requiresPremium: true,
        action: 'custom',
        customAction: 'translate-spanish',
        creditCost: 1,
      },
    ],
  },
];

// Utility functions for managing magic tools
export class MagicToolsManager {
  private static tools: MagicToolCategory[] = [...DEFAULT_MAGIC_TOOLS];

  // Get all enabled tools
  static getEnabledTools(): MagicTool[] {
    return this.tools
      .flatMap(category => category.tools)
      .filter(tool => tool.enabled);
  }

  // Get tools by category
  static getToolsByCategory(categoryId: string): MagicTool[] {
    const category = this.tools.find(cat => cat.id === categoryId);
    return category ? category.tools.filter(tool => tool.enabled) : [];
  }

  // Add a new tool
  static addTool(categoryId: string, tool: MagicTool) {
    const category = this.tools.find(cat => cat.id === categoryId);
    if (category) {
      category.tools.push(tool);
    }
  }

  // Remove a tool
  static removeTool(toolId: string) {
    this.tools.forEach(category => {
      category.tools = category.tools.filter(tool => tool.id !== toolId);
    });
  }

  // Toggle tool enabled state
  static toggleTool(toolId: string) {
    this.tools.forEach(category => {
      const tool = category.tools.find(t => t.id === toolId);
      if (tool) {
        tool.enabled = !tool.enabled;
      }
    });
  }

  // Add a new category
  static addCategory(category: MagicToolCategory) {
    this.tools.push(category);
  }

  // Get all categories
  static getCategories(): MagicToolCategory[] {
    return this.tools;
  }

  // Check if user has access to tool (premium check)
  static hasAccess(tool: MagicTool, isPremium: boolean = false): boolean {
    return !tool.requiresPremium || isPremium;
  }

  // Filter tools by user's premium status
  static getAvailableTools(isPremium: boolean = false): MagicTool[] {
    return this.getEnabledTools().filter(tool => this.hasAccess(tool, isPremium));
  }

  // Reset to default configuration
  static resetToDefaults() {
    this.tools = [...DEFAULT_MAGIC_TOOLS];
  }

  // Load configuration from localStorage
  static loadFromStorage(): boolean {
    try {
      const stored = localStorage.getItem('magicToolsConfig');
      if (stored) {
        this.tools = JSON.parse(stored);
        return true;
      }
    } catch (error) {
      console.warn('Failed to load magic tools config from storage:', error);
    }
    return false;
  }

  // Save configuration to localStorage
  static saveToStorage(): boolean {
    try {
      localStorage.setItem('magicToolsConfig', JSON.stringify(this.tools));
      return true;
    } catch (error) {
      console.warn('Failed to save magic tools config to storage:', error);
      return false;
    }
  }
}

export default MagicToolsManager;
