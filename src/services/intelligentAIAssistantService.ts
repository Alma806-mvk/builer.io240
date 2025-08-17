import {
  CREATE_GEN_STUDIO_KNOWLEDGE,
  getFeatureByTab,
  findAnswerToQuestion,
  getWorkflowSteps,
  searchKnowledge,
  AppFeature
} from './aiAssistantKnowledgeBase';

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
  conversationHistory: string[];
}

export interface AIResponse {
  content: string;
  type: 'text' | 'suggestion' | 'analysis' | 'action' | 'workflow' | 'troubleshooting' | 'success' | 'warning' | 'info';
  confidence: number;
  actions?: Array<{
    label: string;
    action: string;
    icon?: string;
    type?: 'primary' | 'secondary' | 'success' | 'warning';
  }>;
  relatedFeatures?: string[];
  workflowSteps?: Array<{
    step: number;
    action: string;
    details: string;
  }>;
  metadata?: {
    intent: string;
    urgency: 'low' | 'medium' | 'high';
    estimatedTime?: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    relatedTools: string[];
  };
}

class IntelligentAIAssistantService {
  private geminiApiKey: string;
  private conversationHistory: Array<{role: 'user' | 'assistant', content: string}> = [];
  private lastRequestTime: number = 0;
  private requestCount: number = 0;
  private rateLimitResetTime: number = 0;

  constructor() {
    this.geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  }

  private checkRateLimit(): boolean {
    const now = Date.now();

    // Reset counter every minute
    if (now - this.rateLimitResetTime > 60000) {
      this.requestCount = 0;
      this.rateLimitResetTime = now;
    }

    // Allow max 10 requests per minute to be safe
    if (this.requestCount >= 10) {
      return false;
    }

    // Ensure minimum 2 seconds between requests
    if (now - this.lastRequestTime < 2000) {
      return false;
    }

    return true;
  }

  private async waitForRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < 2000) {
      const waitTime = 2000 - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  private buildComprehensiveSystemPrompt(userContext?: UserContext): string {
    const contextInfo = userContext ? this.formatUserContext(userContext) : '';
    
    return `You are the Expert AI Support Specialist for CreateGen Studio - a comprehensive content creation platform. You are NOT a generic AI assistant. You are specifically trained to be a knowledgeable, helpful human-like support person who understands every detail of this platform.

CRITICAL INSTRUCTIONS:
- Act like a real human support specialist who genuinely cares about helping users succeed
- Provide specific, actionable advice based on the exact tools and features available
- Never give generic responses - always relate your advice to CreateGen Studio's specific capabilities
- Ask follow-up questions when you need more information to help effectively
- Show empathy and understanding when users are frustrated
- Celebrate their successes and encourage them when they're struggling

CREATEGEN STUDIO COMPLETE PLATFORM KNOWLEDGE:

=== PLATFORM OVERVIEW ===
CreateGen Studio is an AI-powered content creation platform with 11 integrated tools designed for YouTube creators, content creators, and agencies:

1. **Studio Hub** - Central command center and project management
   - Purpose: Project management dashboard and workspace control
   - Features: Project Pipeline, Activity Feed, Quick Launch, Analytics Dashboard, Command Palette (Cmd+K)
   - Best for: Managing multiple projects, getting overview of all activities
   - Common workflows: Create projects, track progress, launch tools, view insights

2. **Generator** - AI content creation engine
   - Purpose: Generate scripts, titles, hooks, descriptions, and 25+ content types
   - Features: Multiple AI personas, batch generation, custom templates, export options
   - Best for: Creating written content of any type
   - Common workflows: Select content type → Choose AI persona → Input topic → Generate → Refine

3. **Canvas** - Visual design and diagramming tool
   - Purpose: Create mind maps, flowcharts, presentations, visual layouts
   - Features: Drag & drop elements, custom shapes, connectors, text boxes, export PNG/SVG
   - Best for: Visual content, strategy diagrams, mind mapping
   - Common workflows: Add elements → Connect items → Style design → Export

4. **YT Analysis** - YouTube competitive intelligence
   - Purpose: Analyze YouTube channels and competitors for strategic insights
   - Features: Channel insights, competitor analysis, content gap analysis, trending topics
   - Best for: Understanding market opportunities and competitor strategies
   - Common workflows: Connect channel → Analyze performance → Compare competitors → Get recommendations

5. **YT Stats** - YouTube analytics dashboard
   - Purpose: Comprehensive YouTube statistics and performance metrics
   - Features: View analytics, performance tracking, audience insights, revenue metrics
   - Best for: Understanding your own channel performance
   - Common workflows: View dashboard → Analyze metrics → Track growth → Export reports

6. **Thumbnails** - Professional thumbnail creator
   - Purpose: Create click-worthy YouTube thumbnails with AI backgrounds
   - Features: AI backgrounds, text overlays, face cutouts, templates, A/B testing capabilities
   - Best for: Creating high-converting thumbnails
   - Common workflows: Choose template → Add elements → Customize design → Export HD

7. **Strategy** - Content strategy planning
   - Purpose: Comprehensive content strategy and planning framework
   - Features: Content planning, goal setting, audience analysis, channel strategy, growth plans
   - Best for: Long-term planning and strategic content decisions
   - Common workflows: Set goals → Analyze audience → Plan content → Create strategy → Track results

8. **Calendar** - Content scheduling system
   - Purpose: Schedule and manage content publishing
   - Features: Content scheduling, publishing calendar, batch planning, reminders
   - Best for: Maintaining consistent posting schedules
   - Common workflows: Plan content → Schedule posts → Set reminders → Track publishing

9. **Trends** - Trend analysis and opportunity identification
   - Purpose: Identify viral opportunities and trending topics
   - Features: Trending topics, viral predictions, hashtag analysis, competitor trends
   - Best for: Staying ahead of trends and finding viral opportunities
   - Common workflows: Browse trends → Analyze virality → Create content → Monitor performance

10. **History** - Content library and management
    - Purpose: Archive and manage all created content
    - Features: Content archive, version control, search & filter, export options
    - Best for: Organizing and retrieving past work
    - Common workflows: Browse history → Search content → Restore versions → Export projects

11. **Web Search** - AI-enhanced research tool
    - Purpose: Research and content discovery with intelligent summarization
    - Features: Smart search, content summarization, source verification, research notes
    - Best for: Content research and fact-checking
    - Common workflows: Search topic → Review results → Save research → Create content

=== SUBSCRIPTION TIERS ===
- **Free Plan**: 5 AI generations/day, basic features access
- **Creator Pro ($19/month)**: 50 AI interactions/day, premium features, unlimited generations
- **Agency Pro ($49/month)**: Unlimited AI interactions, team features, advanced analytics
- **Enterprise ($299/month)**: White-label, API access, priority support, custom solutions

=== COMMON USER WORKFLOWS ===

**Video Creation Workflow:**
1. Research trends (Trends tab) → 2. Generate script (Generator) → 3. Create thumbnail (Thumbnails) → 4. Plan strategy (Strategy) → 5. Schedule (Calendar)

**Channel Analysis Workflow:**
1. Connect YouTube (YT Stats) → 2. Analyze performance (YT Analysis) → 3. Research competitors → 4. Create strategy (Strategy)

**Content Planning Workflow:**
1. Set goals (Strategy) → 2. Research trends → 3. Generate ideas (Generator) → 4. Plan schedule (Calendar) → 5. Create visuals (Canvas)

=== TROUBLESHOOTING KNOWLEDGE ===

**Common Issues & Solutions:**
- **Can't generate content**: Check plan limits, refresh page, try different content type
- **YouTube not connecting**: Verify Google login, clear cache, check permissions
- **Canvas not loading**: Update browser (needs WebGL), disable extensions
- **Exports failing**: Check file size, internet connection, try different format
- **Slow performance**: Close other tabs, clear cache, update browser

${contextInfo}

=== YOUR PERSONALITY & APPROACH ===
- Be conversational and supportive like a helpful colleague
- Use specific examples from CreateGen Studio features
- Ask clarifying questions to understand user goals
- Provide step-by-step guidance with exact button clicks and navigation
- Celebrate user wins and encourage experimentation
- Show genuine interest in helping them succeed
- Use emojis appropriately to convey enthusiasm and clarity

=== RESPONSE GUIDELINES ===
- Always provide specific, actionable steps
- Reference exact tool names and features
- Suggest logical next steps after completing tasks
- Offer alternatives when one approach might not work
- Connect related tools and features for comprehensive solutions
- Give time estimates for workflows when helpful
- Include pro tips and best practices from successful creators

Remember: You're not just answering questions - you're helping users succeed with their content creation goals using CreateGen Studio's specific tools and features.`;
  }

  private formatUserContext(userContext: UserContext): string {
    return `
=== USER CONTEXT ===
Current Tool: ${userContext.currentTool || 'Studio Hub'}
User Plan: ${userContext.userPlan || 'Free'}
Active Projects: ${userContext.projects?.length || 0}
Recent Activity: ${userContext.recentActivity?.length || 0} recent actions
Goals: ${userContext.goals?.join(', ') || 'Not specified'}
Total Generations: ${userContext.performance?.totalGenerations || 0}

Recent Projects:
${userContext.projects?.slice(0, 3).map(p => `- ${p.title} (${p.status}, ${p.progress}% complete)`).join('\n') || 'No recent projects'}

Recent Activity:
${userContext.recentActivity?.slice(0, 3).map(a => `- ${a.type}: ${a.title} in ${a.tool}`).join('\n') || 'No recent activity'}
`;
  }

  private analyzeUserIntent(message: string, conversationHistory: string[] = []): {
    intent: string;
    confidence: number;
    urgency: 'low' | 'medium' | 'high';
    entities: string[];
    tools: string[];
    contentType?: string;
    actionType?: string;
  } {
    const lowerMessage = message.toLowerCase();
    let intent = 'general';
    let confidence = 0.5;
    let urgency: 'low' | 'medium' | 'high' = 'medium';
    let entities: string[] = [];
    let tools: string[] = [];
    let contentType: string | undefined;
    let actionType: string | undefined;

    // High-priority intent detection
    if (lowerMessage.includes('not working') || lowerMessage.includes('broken') || lowerMessage.includes('error') || lowerMessage.includes('fix')) {
      intent = 'troubleshooting';
      confidence = 0.95;
      urgency = 'high';
    } else if (lowerMessage.includes('how') && (lowerMessage.includes('do') || lowerMessage.includes('to'))) {
      intent = 'guidance';
      confidence = 0.9;
      urgency = 'low';
    } else if (lowerMessage.includes('create') || lowerMessage.includes('make') || lowerMessage.includes('generate')) {
      intent = 'creation';
      confidence = 0.85;
      urgency = 'medium';
      if (lowerMessage.includes('video')) contentType = 'video';
      if (lowerMessage.includes('thumbnail')) contentType = 'thumbnail';
      if (lowerMessage.includes('script')) contentType = 'script';
      if (lowerMessage.includes('title')) contentType = 'title';
    } else if (lowerMessage.includes('analyze') || lowerMessage.includes('performance') || lowerMessage.includes('metrics') || lowerMessage.includes('stats')) {
      intent = 'analysis';
      confidence = 0.9;
      urgency = 'medium';
    } else if (lowerMessage.includes('optimize') || lowerMessage.includes('improve') || lowerMessage.includes('better') || lowerMessage.includes('increase')) {
      intent = 'optimization';
      confidence = 0.8;
      urgency = 'medium';
    } else if (lowerMessage.includes('plan') || lowerMessage.includes('strategy') || lowerMessage.includes('schedule')) {
      intent = 'planning';
      confidence = 0.85;
      urgency = 'medium';
    }

    // Tool detection
    const toolMap = {
      'generator': ['generator', 'generate', 'content creation', 'script', 'title', 'description'],
      'canvas': ['canvas', 'visual', 'mind map', 'flowchart', 'diagram'],
      'thumbnails': ['thumbnail', 'thumb', 'image', 'cover'],
      'ytAnalysis': ['analysis', 'competitor', 'research', 'channel analysis'],
      'ytStats': ['stats', 'statistics', 'analytics', 'performance', 'metrics'],
      'strategy': ['strategy', 'plan', 'planning', 'goal'],
      'calendar': ['calendar', 'schedule', 'scheduling', 'publish'],
      'trends': ['trends', 'trending', 'viral', 'hot topics'],
      'history': ['history', 'archive', 'past', 'previous'],
      'webSearch': ['search', 'research', 'find information']
    };

    Object.entries(toolMap).forEach(([tool, keywords]) => {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        tools.push(tool);
        entities.push(tool);
      }
    });

    // Content type detection
    const contentTypes = ['video', 'thumbnail', 'script', 'title', 'description', 'hook', 'strategy', 'calendar', 'trend'];
    contentTypes.forEach(type => {
      if (lowerMessage.includes(type)) {
        entities.push(type);
        if (!contentType) contentType = type;
      }
    });

    // Action type detection
    if (lowerMessage.includes('step by step') || lowerMessage.includes('tutorial') || lowerMessage.includes('guide')) {
      actionType = 'tutorial';
    } else if (lowerMessage.includes('quick') || lowerMessage.includes('fast')) {
      actionType = 'quick';
    } else if (lowerMessage.includes('complete') || lowerMessage.includes('comprehensive')) {
      actionType = 'comprehensive';
    }

    return { intent, confidence, urgency, entities, tools, contentType, actionType };
  }

  private async callGeminiAPI(prompt: string, userMessage: string, retryCount = 0): Promise<string> {
    if (!this.geminiApiKey) {
      throw new Error('Gemini API key not configured');
    }

    // Check rate limits before making request
    if (!this.checkRateLimit()) {
      return this.getRateLimitedResponse(userMessage);
    }

    // Wait for rate limit if needed
    await this.waitForRateLimit();

    try {
      this.requestCount++;
      this.lastRequestTime = Date.now();
      const messages = [
        ...this.conversationHistory.slice(-6), // Keep last 6 messages for context
        { role: 'user' as const, content: userMessage }
      ];

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${this.geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt + '\n\nUser Question: ' + userMessage }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        }),
      });

      if (!response.ok) {
        // Handle rate limiting specifically
        if (response.status === 429) {
          // Exponential backoff for rate limiting
          if (retryCount < 2) {
            const backoffTime = Math.pow(2, retryCount) * 2000; // 2s, 4s
            console.log(`Rate limited, retrying in ${backoffTime}ms...`);
            await new Promise(resolve => setTimeout(resolve, backoffTime));
            return this.callGeminiAPI(prompt, userMessage, retryCount + 1);
          } else {
            // Max retries reached, return rate limited response
            return this.getRateLimitedResponse(userMessage);
          }
        }
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, but I encountered an issue generating a response. Please try rephrasing your question.';

      // Update conversation history
      this.conversationHistory.push(
        { role: 'user', content: userMessage },
        { role: 'assistant', content: generatedText }
      );

      // Keep only last 10 messages (5 exchanges)
      if (this.conversationHistory.length > 10) {
        this.conversationHistory = this.conversationHistory.slice(-10);
      }

      return generatedText;

    } catch (error) {
      console.error('Gemini API error:', error);
      return this.getFallbackResponse(userMessage);
    }
  }

  private getRateLimitedResponse(userMessage: string): string {
    const analysis = this.analyzeUserIntent(userMessage);

    return `⏱️ **I'm experiencing high demand right now!**

I'm your AI Content Strategy Consultant, and I want to give you the best possible response. Due to high usage, I need to pace my responses for optimal performance.

**While you wait, here's immediate expert guidance:**

${this.getInstantGuidance(analysis)}

**💡 Pro Tip:** I'll be back to full capacity in a moment. For immediate help, try one of the quick actions in the sidebar or ask me again in 30 seconds.

Remember: Great content strategy takes time - and so does expert consultation! 🎯`;
  }

  private getInstantGuidance(analysis: any): string {
    switch (analysis.intent) {
      case 'creation':
        return `🎬 **Quick Creation Guide:**
• Start with trending topics in the Trends tab
• Use Generator for scripts with proven personas
• Create 3 thumbnail variants for A/B testing
• Plan your posting schedule in Calendar`;

      case 'analysis':
        return `📊 **Instant Performance Boost:**
• Check YT Stats for your CTR and retention rates
• CTR below 8%? Focus on thumbnail optimization
• Low retention? Improve your video hooks
• Compare top performers vs. low performers`;

      case 'troubleshooting':
        return `🔧 **Quick Fixes:**
• Refresh the page for most issues
• Check your internet connection
• Clear browser cache if features aren't loading
• Update your browser for best performance`;

      default:
        return `🚀 **Expert Quick Wins:**
• Use the Generator for instant content ideas
• Check Trends for viral opportunities
• Optimize thumbnails for higher CTR
• Plan consistent posting schedule`;
    }
  }

  private getFallbackResponse(userMessage: string): string {
    const analysis = this.analyzeUserIntent(userMessage);
    
    if (analysis.intent === 'troubleshooting') {
      return `🔧 **I'm here to help solve this issue!**

I understand you're experiencing a problem. While I work on connecting to my knowledge base, here are some immediate steps that often resolve common issues:

**Quick Fixes to Try:**
1. **Refresh your browser page** - This solves 60% of issues
2. **Clear browser cache** - Go to Settings > Privacy > Clear browsing data
3. **Check your internet connection** - Ensure you have a stable connection
4. **Try incognito/private mode** - This helps identify extension conflicts

**If you're having trouble with:**
• **Content Generation** - Check your plan limits (Free: 5/day, Creator Pro: 50/day)
• **YouTube Connection** - Log out and back into your Google account
��� **Canvas Issues** - Update your browser (Chrome or Firefox recommended)
• **Export Problems** - Try reducing file size or different format

Can you tell me specifically:
1. Which tool are you using?
2. What exactly happens when you try to use it?
3. Any error messages you see?

I'll provide the exact solution once I understand your specific situation!`;
    }

    if (analysis.intent === 'creation') {
      return `🎬 **I'd love to help you create amazing content!**

I can guide you through creating any type of content in CreateGen Studio. Here's what I can help you with:

**Content Creation Options:**
• **Video Scripts** - Full scripts with hooks, structure, and CTAs
• **YouTube Titles** - Click-worthy titles that get views
• **Thumbnails** - Eye-catching designs that increase CTR
• **Content Strategy** - Complete planning and optimization
• **Social Media Posts** - Engaging content for all platforms

**Quick Start Process:**
1. **Choose your content type** (What specifically do you want to create?)
2. **Define your goal** (Views, engagement, subscribers, sales?)
3. **Identify your audience** (Who are you creating for?)
4. **Select the right tool** (I'll guide you to the perfect tool)
5. **Create and optimize** (Step-by-step guidance)

**What would you like to create first?** Just tell me something like:
• "Help me create a viral video about [topic]"
• "I need a thumbnail that gets clicks"
• "Write a script for my [niche] channel"

The more specific you are, the better I can help you succeed!`;
    }

    if (analysis.intent === 'guidance') {
      return `📚 **I'm your personal CreateGen Studio tutor!**

I love helping people master this platform! Whether you're brand new or looking to level up, I've got you covered.

**What I Can Teach You:**
• **Complete Tool Walkthroughs** - Every feature explained
• **Proven Workflows** - How successful creators use the platform
• **Advanced Techniques** - Pro tips and optimization strategies
• **Troubleshooting** - Fix any issues you encounter
• **Best Practices** - What works and what doesn't

**Learning Paths Available:**
🚀 **Quick Start** (30 mins) - Perfect for beginners
📈 **Creator Accelerator** (2 hours) - For serious content creators  
🎯 **Tool Mastery** - Deep dive into specific features
💼 **Business Strategy** - For agencies and teams

**To give you the best guidance, tell me:**
1. What's your experience level? (Beginner, some experience, advanced)
2. What's your main goal? (More views, better content, save time, grow audience)
3. What specifically do you want to learn?

**Examples of great questions:**
• "Walk me through creating my first viral video"
• "How do I analyze my competitors effectively?"
• "Show me the best workflow for consistent content creation"

What would you like to master first?`;
    }

    // General fallback
    return `👋 **Hi! I'm your AI Support Specialist for CreateGen Studio!**

I'm here to help you succeed with every aspect of the platform. I have deep knowledge of all 11 tools and can provide specific, step-by-step guidance.

**I can help you with:**
🎬 **Content Creation** - Scripts, titles, thumbnails, strategies
📊 **Performance Analysis** - Understanding your metrics and optimization
🛠️ **Tool Guidance** - How to use any feature effectively
🔧 **Troubleshooting** - Fixing any issues you encounter
🚀 **Optimization** - Making your content perform better

**Popular requests I love helping with:**
• "Create a complete video from idea to publish"
• "My content isn't getting views - help me fix it"
• "Walk me through analyzing my competitors"
• "Set up an automated content workflow"
• "I'm new here - where do I start?"

**For the best help, be specific!** Instead of "help with YouTube," try:
• "My YouTube thumbnails get low click rates - fix this"
• "Create a viral video script about [specific topic]"
• "Analyze why my competitor gets more views than me"

What would you like to accomplish today? I'm excited to help you succeed! 🎯`;
  }

  async generateResponse(userMessage: string, userContext?: UserContext): Promise<AIResponse> {
    try {
      const analysis = this.analyzeUserIntent(userMessage, userContext?.conversationHistory || []);
      const systemPrompt = this.buildComprehensiveSystemPrompt(userContext);
      
      // Get AI response
      const content = await this.callGeminiAPI(systemPrompt, userMessage);
      
      // Generate appropriate actions based on intent and content
      const actions = this.generateActionsForResponse(analysis, content);
      
      return {
        content,
        type: this.mapIntentToType(analysis.intent),
        confidence: analysis.confidence,
        actions,
        relatedFeatures: analysis.tools,
        metadata: {
          intent: analysis.intent,
          urgency: analysis.urgency,
          estimatedTime: this.estimateTimeForIntent(analysis.intent, analysis.contentType),
          difficulty: this.estimateDifficulty(analysis.intent),
          relatedTools: analysis.tools
        }
      };

    } catch (error) {
      console.error('AI Assistant Service error:', error);
      
      return {
        content: this.getFallbackResponse(userMessage),
        type: 'info',
        confidence: 0.7,
        actions: [],
        metadata: {
          intent: 'fallback',
          urgency: 'low',
          relatedTools: []
        }
      };
    }
  }

  private mapIntentToType(intent: string): AIResponse['type'] {
    switch (intent) {
      case 'troubleshooting': return 'troubleshooting';
      case 'creation': return 'workflow';
      case 'analysis': return 'analysis';
      case 'optimization': return 'suggestion';
      case 'guidance': return 'info';
      case 'planning': return 'workflow';
      default: return 'text';
    }
  }

  private estimateTimeForIntent(intent: string, contentType?: string): string {
    switch (intent) {
      case 'creation':
        if (contentType === 'video') return '45-60 minutes';
        if (contentType === 'thumbnail') return '10-15 minutes';
        if (contentType === 'script') return '20-30 minutes';
        return '15-30 minutes';
      case 'analysis': return '30-45 minutes';
      case 'planning': return '60-90 minutes';
      case 'troubleshooting': return '5-15 minutes';
      case 'optimization': return '30-60 minutes';
      default: return '10-20 minutes';
    }
  }

  private estimateDifficulty(intent: string): 'beginner' | 'intermediate' | 'advanced' {
    switch (intent) {
      case 'creation': return 'beginner';
      case 'guidance': return 'beginner';
      case 'troubleshooting': return 'intermediate';
      case 'analysis': return 'intermediate';
      case 'optimization': return 'advanced';
      case 'planning': return 'intermediate';
      default: return 'beginner';
    }
  }

  private generateActionsForResponse(analysis: any, content: string): Array<{
    label: string;
    action: string;
    icon?: string;
    type?: 'primary' | 'secondary' | 'success' | 'warning';
  }> {
    const actions: any[] = [];

    // Generate actions based on intent and mentioned tools
    switch (analysis.intent) {
      case 'creation':
        actions.push({ label: 'Start Creating', action: 'navigate:generator', type: 'primary' });
        if (analysis.contentType === 'thumbnail') {
          actions.push({ label: 'Open Thumbnails', action: 'navigate:thumbnails', type: 'primary' });
        }
        if (analysis.contentType === 'video') {
          actions.push({ label: 'Plan Strategy', action: 'navigate:strategy', type: 'secondary' });
        }
        break;
      
      case 'analysis':
        actions.push({ label: 'Check YT Stats', action: 'navigate:ytStats', type: 'primary' });
        actions.push({ label: 'Analyze Competitors', action: 'navigate:ytAnalysis', type: 'secondary' });
        break;
      
      case 'troubleshooting':
        actions.push({ label: 'Contact Support', action: 'contact:support', type: 'primary' });
        actions.push({ label: 'View Help Docs', action: 'open:docs', type: 'secondary' });
        break;
      
      case 'guidance':
        actions.push({ label: 'Start Tutorial', action: 'navigate:studioHub', type: 'primary' });
        if (analysis.tools.length > 0) {
          actions.push({ label: `Open ${analysis.tools[0]}`, action: `navigate:${analysis.tools[0]}`, type: 'secondary' });
        }
        break;
      
      case 'optimization':
        actions.push({ label: 'Create Strategy', action: 'navigate:strategy', type: 'primary' });
        actions.push({ label: 'Check Performance', action: 'navigate:ytStats', type: 'secondary' });
        break;
      
      default:
        actions.push({ label: 'Explore Tools', action: 'navigate:studioHub', type: 'secondary' });
    }

    return actions;
  }

  clearConversationHistory(): void {
    this.conversationHistory = [];
  }

  getConversationHistory(): Array<{role: 'user' | 'assistant', content: string}> {
    return [...this.conversationHistory];
  }
}

export const intelligentAIAssistantService = new IntelligentAIAssistantService();
export default intelligentAIAssistantService;
