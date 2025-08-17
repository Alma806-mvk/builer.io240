import { geminiService } from '../../services/geminiService';

export interface UserContext {
  projects: Array<{
    id: string;
    title: string;
    type: string;
    status: string;
    progress: number;
    tools: string[];
    lastUpdated: Date;
  }>;
  currentTool: string;
  recentActivity: Array<{
    id: string;
    type: string;
    title: string;
    timestamp: Date;
    tool: string;
  }>;
  performance: {
    totalGenerations: number;
    averageEngagement: number;
    topPerformingContent: string[];
    recentMetrics: any;
  };
  goals: string[];
  userPlan: string;
  preferences: any;
}

export interface AIResponse {
  content: string;
  type: 'text' | 'suggestion' | 'analysis' | 'action';
  confidence: number;
  actions?: Array<{
    label: string;
    action: string;
    icon?: string;
  }>;
}

class AIStudioAssistantService {
  private buildSystemPrompt(userContext?: UserContext): string {
    return `You are the AI Studio Assistant for CreateGen Studio - a premium content creation platform. You are helpful, knowledgeable, and conversational.

CONTEXT: You are integrated into CreateGen Studio, which has these tools:
- Generator: AI content creation (scripts, titles, hooks, etc.)
- Canvas: Visual design and layout tool
- Thumbnails: Professional thumbnail creation
- Strategy: Content strategy planning
- Calendar: Content scheduling and planning
- Trends: Trend analysis and research
- YT Analysis: YouTube channel analysis
- YT Stats: YouTube performance metrics
- History: Content generation history
- Web Search: Enhanced web research

YOUR CAPABILITIES:
✅ App guidance and tutorials
✅ Content strategy recommendations
✅ Performance analysis and insights
✅ Creative brainstorming and ideas
✅ Workflow optimization suggestions
✅ Tool-specific help and tips

PERSONALITY:
- Conversational but professional
- Enthusiastic about content creation
- Data-driven but creative
- Supportive and encouraging
- Direct and actionable

${userContext ? this.buildUserContextPrompt(userContext) : ''}

INSTRUCTIONS:
- Always provide specific, actionable advice
- Reference specific tools when relevant
- Use the user's context to personalize responses
- Include step-by-step guidance when helpful
- Suggest concrete next steps
- Be encouraging and motivational
- Focus on practical implementation

Format your response naturally - don't use excessive formatting unless it improves clarity.`;
  }

  private buildUserContextPrompt(userContext: UserContext): string {
    let contextPrompt = `\nUSER CONTEXT:\n`;
    
    if (userContext.projects?.length > 0) {
      contextPrompt += `Current Projects: ${userContext.projects.length} active projects\n`;
      const recentProject = userContext.projects[0];
      contextPrompt += `Latest Project: "${recentProject.title}" (${recentProject.status}, ${recentProject.progress}% complete)\n`;
    }

    if (userContext.currentTool) {
      contextPrompt += `Currently Using: ${userContext.currentTool} tool\n`;
    }

    if (userContext.performance) {
      contextPrompt += `Performance: ${userContext.performance.totalGenerations || 0} total generations\n`;
      if ((userContext.performance.averageEngagement || 0) > 0) {
        contextPrompt += `Average Engagement: ${userContext.performance.averageEngagement}%\n`;
      }
    }

    if (userContext.userPlan) {
      contextPrompt += `Subscription: ${userContext.userPlan} plan\n`;
    }

    if (userContext.goals?.length > 0) {
      contextPrompt += `Goals: ${userContext.goals.join(', ')}\n`;
    }

    return contextPrompt;
  }

  private categorizeQuestion(question: string, userContext?: UserContext): string {
    const lowerQ = question.toLowerCase();
    
    if (lowerQ.includes('how') && (lowerQ.includes('use') || lowerQ.includes('work') || lowerQ.includes('do'))) {
      return 'guidance';
    }
    
    if (lowerQ.includes('performance') || lowerQ.includes('analytics') || lowerQ.includes('metrics') || lowerQ.includes('views') || lowerQ.includes('engagement')) {
      return 'performance';
    }
    
    if (lowerQ.includes('idea') || lowerQ.includes('content') || lowerQ.includes('create') || lowerQ.includes('suggest')) {
      return 'ideas';
    }
    
    if (lowerQ.includes('strategy') || lowerQ.includes('plan') || lowerQ.includes('grow') || lowerQ.includes('increase')) {
      return 'strategy';
    }
    
    if (lowerQ.includes('workflow') || lowerQ.includes('efficient') || lowerQ.includes('faster') || lowerQ.includes('automate')) {
      return 'workflow';
    }
    
    return 'general';
  }

  private buildContextualPrompt(question: string, category: string, userContext?: UserContext): string {
    const baseContext = userContext ? this.buildUserContextPrompt(userContext) : '';
    
    const categoryPrompts = {
      guidance: `The user is asking for guidance on how to use CreateGen Studio. Provide step-by-step instructions and practical tips. Reference specific tools and features. Make it easy to follow.`,
      
      performance: `The user wants to understand or improve their content performance. Analyze their context and provide specific, data-driven recommendations. Include actionable steps they can take immediately.`,
      
      ideas: `The user needs creative content ideas. Use their context (current projects, tools, goals) to provide personalized, relevant suggestions. Be creative but practical.`,
      
      strategy: `The user is asking about content strategy. Provide comprehensive, strategic advice that considers their current situation, goals, and available tools. Think long-term and holistic.`,
      
      workflow: `The user wants to optimize their workflow or be more efficient. Suggest specific tools, features, and processes they can use. Focus on practical productivity improvements.`,
      
      general: `Provide helpful, contextual advice based on the user's question and current situation in CreateGen Studio.`
    };

    return `${this.buildSystemPrompt(userContext)}

SPECIFIC CONTEXT FOR THIS QUESTION:
${categoryPrompts[category as keyof typeof categoryPrompts] || categoryPrompts.general}

USER QUESTION: "${question}"

Provide a helpful, specific response that addresses their question directly and offers actionable next steps.`;
  }

  async askQuestion(question: string, userContext?: UserContext): Promise<AIResponse> {
    try {
      // Sanitize input
      const sanitizedQuestion = question.trim().substring(0, 1000);

      // Categorize the question to provide more contextual responses
      const category = this.categorizeQuestion(sanitizedQuestion, userContext);

      // Build contextual prompt using the actual geminiService structure
      const prompt = this.buildGeminiPrompt(sanitizedQuestion, category, userContext);

      // Import the geminiService dynamically to avoid circular dependencies
      const { generateTextContent } = await import('../../services/geminiService');

      // Use the actual geminiService generateTextContent method
      const response = await generateTextContent(prompt);

      // Extract actions from response if any
      const actions = this.extractActions(response.text, category, userContext);

      return {
        content: response.text,
        type: this.getResponseType(category),
        confidence: 0.9,
        actions
      };

    } catch (error) {
      console.error('AI Studio Assistant error:', error);

      // Provide intelligent fallback responses based on question category
      const fallbackResponse = this.getFallbackResponse(question, userContext);

      return fallbackResponse;
    }
  }

  private buildGeminiPrompt(question: string, category: string, userContext?: UserContext): string {
    const systemContext = this.buildSystemPrompt(userContext);
    const categoryContext = this.getCategorySpecificPrompt(category, userContext);

    return `${systemContext}

${categoryContext}

User Question: "${question}"

Please provide a helpful, specific, and actionable response. Keep your response conversational but informative. Include specific next steps when relevant.`;
  }

  private getCategorySpecificPrompt(category: string, userContext?: UserContext): string {
    const contextInfo = userContext ? `
Current Projects: ${userContext.projects.length} active
Recent Activity: ${userContext.recentActivity.length} recent actions
Current Tool: ${userContext.currentTool}
User Plan: ${userContext.userPlan}
Performance: ${userContext.performance?.totalGenerations || 0} total generations
` : '';

    const prompts = {
      guidance: `${contextInfo}
The user needs guidance on using CreateGen Studio tools. Provide step-by-step instructions and practical tips. Be specific about which buttons to click and what to expect.`,

      performance: `${contextInfo}
The user wants to understand or improve their content performance. Analyze their metrics and provide data-driven recommendations with specific action items.`,

      ideas: `${contextInfo}
The user needs creative content ideas. Provide personalized suggestions based on their context, current projects, and goals. Be creative but practical.`,

      strategy: `${contextInfo}
The user is asking about content strategy. Provide comprehensive strategic advice considering their current situation and available tools. Think holistically about their content ecosystem.`,

      workflow: `${contextInfo}
The user wants to optimize their workflow. Suggest specific tools, features, and processes. Focus on practical productivity improvements they can implement immediately.`,

      general: `${contextInfo}
Provide helpful advice based on the user's question and context. Be conversational and supportive while offering specific guidance.`
    };

    return prompts[category as keyof typeof prompts] || prompts.general;
  }

  private getFallbackResponse(question: string, userContext?: UserContext): AIResponse {
    const lowerQ = question.toLowerCase();

    if (lowerQ.includes('performance') || lowerQ.includes('analytics')) {
      return {
        content: `I can help you analyze your content performance! Based on your activity, I see you've generated ${userContext?.performance?.totalGenerations || 0} pieces of content.

Here are some ways I can help:
• Analyze your top-performing content patterns
• Suggest improvements based on your metrics
• Recommend optimal posting strategies
• Compare your performance across different content types

What specific aspect of your performance would you like to explore?`,
        type: 'analysis',
        confidence: 0.8,
        actions: [
          { label: 'View Analytics', action: 'navigate:youtubeStats', icon: 'ChartBarIcon' },
          { label: 'Check Trends', action: 'navigate:trends', icon: 'TrendingUpIcon' }
        ]
      };
    }

    if (lowerQ.includes('idea') || lowerQ.includes('content')) {
      return {
        content: `I'm great at helping with content ideas! I can suggest:

• Fresh video concepts tailored to your audience
• Trending topics in your niche
• Content series that build on your successful posts
• Cross-platform content adaptations
• SEO-optimized content angles

What type of content are you looking to create? I can provide specific ideas based on your goals and past performance.`,
        type: 'suggestion',
        confidence: 0.8,
        actions: [
          { label: 'Generate Ideas', action: 'navigate:generator', icon: 'SparklesIcon' },
          { label: 'Check Trends', action: 'navigate:trends', icon: 'TrendingUpIcon' }
        ]
      };
    }

    return {
      content: `I'm here to help you succeed with CreateGen Studio! I can assist with:

🎯 **Content Strategy** - Planning your content calendar and goals
💡 **Creative Ideas** - Fresh concepts for videos, posts, and campaigns
📊 **Performance Analysis** - Understanding your metrics and improving results
🛠️ **Tool Guidance** - How to use any CreateGen Studio feature
⚡ **Workflow Tips** - Making your content creation more efficient

What would you like to explore? Just ask me about any aspect of content creation!`,
      type: 'text',
      confidence: 0.7,
      actions: [
        { label: 'Get Ideas', action: 'navigate:generator', icon: 'SparklesIcon' },
        { label: 'View Analytics', action: 'navigate:youtubeStats', icon: 'ChartBarIcon' },
        { label: 'Plan Strategy', action: 'navigate:strategy', icon: 'CompassIcon' }
      ]
    };
  }

  private extractActions(response: string, category: string, userContext?: UserContext): Array<{label: string, action: string, icon?: string}> {
    const actions: Array<{label: string, action: string, icon?: string}> = [];
    
    // Extract navigation suggestions from response
    const toolMentions = {
      'generator': { label: 'Open Generator', action: 'navigate:generator', icon: 'SparklesIcon' },
      'canvas': { label: 'Open Canvas', action: 'navigate:canvas', icon: 'ColumnsIcon' },
      'thumbnail': { label: 'Create Thumbnails', action: 'navigate:thumbnailMaker', icon: 'PhotoIcon' },
      'strategy': { label: 'Plan Strategy', action: 'navigate:strategy', icon: 'CompassIcon' },
      'calendar': { label: 'Schedule Content', action: 'navigate:calendar', icon: 'CalendarIcon' },
      'trends': { label: 'Check Trends', action: 'navigate:trends', icon: 'TrendingUpIcon' },
      'analytics': { label: 'View Analytics', action: 'navigate:youtubeStats', icon: 'ChartBarIcon' }
    };

    // Check if response mentions specific tools
    const lowerResponse = response.toLowerCase();
    for (const [tool, actionData] of Object.entries(toolMentions)) {
      if (lowerResponse.includes(tool)) {
        actions.push(actionData);
      }
    }

    // Add category-specific default actions
    if (actions.length === 0) {
      switch (category) {
        case 'ideas':
          actions.push({ label: 'Generate Content', action: 'navigate:generator', icon: 'SparklesIcon' });
          break;
        case 'performance':
          actions.push({ label: 'View Analytics', action: 'navigate:youtubeStats', icon: 'ChartBarIcon' });
          break;
        case 'strategy':
          actions.push({ label: 'Create Strategy', action: 'navigate:strategy', icon: 'CompassIcon' });
          break;
        case 'guidance':
          actions.push({ label: 'Explore Tools', action: 'navigate:studioHub', icon: 'CogIcon' });
          break;
      }
    }

    return actions.slice(0, 3); // Limit to 3 actions max
  }

  private getResponseType(category: string): 'text' | 'suggestion' | 'analysis' | 'action' {
    const typeMap = {
      guidance: 'text' as const,
      performance: 'analysis' as const,
      ideas: 'suggestion' as const,
      strategy: 'suggestion' as const,
      workflow: 'action' as const,
      general: 'text' as const
    };
    
    return typeMap[category as keyof typeof typeMap] || 'text';
  }

  // Quick action handlers for common requests
  async getContentIdeas(topic: string, userContext?: UserContext): Promise<AIResponse> {
    return this.askQuestion(`I need fresh content ideas for ${topic}`, userContext);
  }

  async analyzePerformance(userContext: UserContext): Promise<AIResponse> {
    return this.askQuestion("Analyze my content performance and give me insights", userContext);
  }

  async getToolGuidance(toolName: string): Promise<AIResponse> {
    return this.askQuestion(`How do I use the ${toolName} tool in CreateGen Studio?`);
  }

  async optimizeWorkflow(userContext: UserContext): Promise<AIResponse> {
    return this.askQuestion("How can I optimize my content creation workflow?", userContext);
  }

  // Advanced suggestion methods
  async getPersonalizedSuggestions(userContext: UserContext): Promise<AIResponse> {
    const suggestions = this.generateIntelligentSuggestions(userContext);

    return {
      content: this.formatSuggestions(suggestions, userContext),
      type: 'suggestion',
      confidence: 0.95,
      actions: suggestions.slice(0, 3).map(s => ({
        label: s.actionLabel,
        action: s.action,
        icon: s.icon
      }))
    };
  }

  private generateIntelligentSuggestions(userContext: UserContext): Array<{
    title: string;
    description: string;
    reason: string;
    actionLabel: string;
    action: string;
    icon: string;
    priority: 'high' | 'medium' | 'low';
  }> {
    const suggestions = [];

    // Analyze user's project status
    const completedProjects = userContext.projects.filter(p => p.status === 'completed').length;
    const inProgressProjects = userContext.projects.filter(p => p.status === 'in_progress').length;
    const totalProjects = userContext.projects.length;

    // Performance-based suggestions
    if ((userContext.performance?.totalGenerations || 0) > 10 && (userContext.performance?.averageEngagement || 0) < 5) {
      suggestions.push({
        title: 'Boost Your Engagement',
        description: 'Your content volume is great, but let\'s improve engagement rates',
        reason: `With ${userContext.performance?.totalGenerations || 0} pieces created but ${userContext.performance?.averageEngagement || 0}% engagement, there's room to optimize`,
        actionLabel: 'Analyze Performance',
        action: 'navigate:youtubeStats',
        icon: 'ChartBarIcon',
        priority: 'high' as const
      });
    }

    // Project management suggestions
    if (inProgressProjects > 3) {
      suggestions.push({
        title: 'Focus Your Efforts',
        description: 'You have many projects in progress - let\'s prioritize completion',
        reason: `${inProgressProjects} active projects might be spreading your focus thin`,
        actionLabel: 'Review Projects',
        action: 'navigate:studioHub',
        icon: 'RocketLaunchIcon',
        priority: 'high' as const
      });
    }

    // Content creation suggestions based on plan
    if (userContext.userPlan === 'free' && (userContext.performance?.totalGenerations || 0) > 20) {
      suggestions.push({
        title: 'Unlock Advanced Features',
        description: 'You\'re a power user! Upgrade for batch generation and advanced analytics',
        reason: `${userContext.performance?.totalGenerations || 0} generations shows you\'re serious about content creation`,
        actionLabel: 'View Plans',
        action: 'navigate:billing',
        icon: 'SparklesIcon',
        priority: 'medium' as const
      });
    }

    // Workflow optimization suggestions
    const usedTools = Array.from(new Set((userContext.projects || []).flatMap(p => p.tools)));
    if (usedTools.length < 3) {
      suggestions.push({
        title: 'Explore More Tools',
        description: 'You\'re only using a few tools - discover the full CreateGen ecosystem',
        reason: `You're using ${usedTools.join(', ')} but missing out on other powerful features`,
        actionLabel: 'Explore Tools',
        action: 'navigate:studioHub',
        icon: 'BeakerIcon',
        priority: 'medium' as const
      });
    }

    // Trend-based suggestions
    suggestions.push({
      title: 'Ride the Trends',
      description: 'Check what\'s trending in your niche for viral content opportunities',
      reason: 'Trending content gets 3x more engagement on average',
      actionLabel: 'Check Trends',
      action: 'navigate:trends',
      icon: 'TrendingUpIcon',
      priority: 'medium' as const
    });

    // Content strategy suggestions
    if (totalProjects > 0 && completedProjects / totalProjects < 0.5) {
      suggestions.push({
        title: 'Strategic Planning',
        description: 'Let\'s create a content strategy to improve your completion rate',
        reason: `${Math.round((completedProjects / totalProjects) * 100)}% completion rate could be improved with better planning`,
        actionLabel: 'Plan Strategy',
        action: 'navigate:strategy',
        icon: 'CompassIcon',
        priority: 'high' as const
      });
    }

    // Automation suggestions for power users
    if ((userContext.performance?.totalGenerations || 0) > 30) {
      suggestions.push({
        title: 'Automate Your Workflow',
        description: 'You\'re creating lots of content - let\'s set up automation to save time',
        reason: 'Power users save 4+ hours weekly with smart automation',
        actionLabel: 'Setup Automation',
        action: 'navigate:studioHub',
        icon: 'CogIcon',
        priority: 'low' as const
      });
    }

    // Sort by priority and return top suggestions
    return suggestions.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }).slice(0, 5);
  }

  private formatSuggestions(suggestions: any[], userContext: UserContext): string {
    const userName = userContext.userPlan === 'free' ? 'Creator' : 'Pro Creator';

    let content = `👋 Hey ${userName}! Based on your activity, here are personalized suggestions to supercharge your content creation:\n\n`;

    suggestions.forEach((suggestion, index) => {
      const priorityEmoji = suggestion.priority === 'high' ? '🔥' : suggestion.priority === 'medium' ? '⭐' : '💡';

      content += `${priorityEmoji} **${suggestion.title}**\n`;
      content += `${suggestion.description}\n`;
      content += `*Why: ${suggestion.reason}*\n\n`;
    });

    content += `💪 **Your Progress:**\n`;
    content += `• ${userContext.projects?.length || 0} total projects\n`;
    content += `• ${userContext.performance?.totalGenerations || 0} pieces created\n`;
    content += `• ${userContext.projects?.filter(p => p.status === 'completed').length || 0} projects completed\n\n`;

    content += `🚀 Ready to level up? Pick a suggestion above or ask me anything specific!`;

    return content;
  }

  // Contextual suggestion based on current activity
  async getContextualSuggestion(currentTool: string, userContext: UserContext): Promise<AIResponse> {
    const toolSuggestions = {
      'generator': 'Based on your Generator usage, try creating thumbnail concepts for your content!',
      'canvas': 'Your Canvas designs could be enhanced with trending color palettes from our Trends tool!',
      'thumbnails': 'Great thumbnails! Now create engaging titles and scripts in the Generator to match.',
      'strategy': 'Your strategy is solid! Use the Calendar tool to schedule your planned content.',
      'calendar': 'Your calendar is organized! Check Trends to ensure you\'re riding the viral waves.',
      'trends': 'Trending topics discovered! Generate specific content ideas in the Generator.',
      'studioHub': 'Welcome to your command center! Let me suggest the best next action for you.'
    };

    const suggestion = toolSuggestions[currentTool as keyof typeof toolSuggestions]
      || 'Let me analyze your activity and suggest the best next steps!';

    return {
      content: suggestion,
      type: 'suggestion',
      confidence: 0.8,
      actions: this.getToolSpecificActions(currentTool)
    };
  }

  private getToolSpecificActions(currentTool: string): Array<{label: string, action: string, icon?: string}> {
    const actions = {
      'generator': [
        { label: 'Create Thumbnails', action: 'navigate:thumbnailMaker', icon: 'PhotoIcon' },
        { label: 'Check Trends', action: 'navigate:trends', icon: 'TrendingUpIcon' }
      ],
      'canvas': [
        { label: 'Generate Content', action: 'navigate:generator', icon: 'SparklesIcon' },
        { label: 'View Trends', action: 'navigate:trends', icon: 'TrendingUpIcon' }
      ],
      'thumbnails': [
        { label: 'Write Scripts', action: 'navigate:generator', icon: 'SparklesIcon' },
        { label: 'Plan Strategy', action: 'navigate:strategy', icon: 'CompassIcon' }
      ],
      'strategy': [
        { label: 'Schedule Content', action: 'navigate:calendar', icon: 'CalendarIcon' },
        { label: 'Generate Content', action: 'navigate:generator', icon: 'SparklesIcon' }
      ]
    };

    return actions[currentTool as keyof typeof actions] || [
      { label: 'Generate Ideas', action: 'navigate:generator', icon: 'SparklesIcon' }
    ];
  }
}

export const aiStudioAssistantService = new AIStudioAssistantService();
export default aiStudioAssistantService;
