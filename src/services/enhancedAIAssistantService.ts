import {
  CREATE_GEN_STUDIO_KNOWLEDGE,
  getFeatureByTab,
  findAnswerToQuestion,
  getWorkflowSteps,
  searchKnowledge,
  AppFeature
} from './aiAssistantKnowledgeBase';
import {
  troubleshootingDiagnostic,
  quickDiagnose,
  TROUBLESHOOTING_DATABASE,
  TroubleshootingIssue,
  DiagnosticResult
} from './troubleshootingSystem';
import {
  comprehensiveQuestionMatcher,
  COMPREHENSIVE_QUESTION_DATABASE
} from './comprehensiveQuestionDatabase';

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
  type: 'text' | 'suggestion' | 'analysis' | 'action' | 'workflow' | 'troubleshooting';
  confidence: number;
  actions?: Array<{
    label: string;
    action: string;
    icon?: string;
  }>;
  relatedFeatures?: string[];
  workflowSteps?: Array<{
    step: number;
    action: string;
    details: string;
  }>;
}

class EnhancedAIStudioAssistantService {
  private buildSystemPrompt(userContext?: UserContext): string {
    const contextInfo = userContext ? this.formatUserContext(userContext) : '';
    
    return `You are the Expert AI Studio Assistant for CreateGen Studio - the most comprehensive content creation platform available. You have complete knowledge of every feature, workflow, and capability.

CREATEGEN STUDIO OVERVIEW:
CreateGen Studio is an AI-powered content creation platform with 11 integrated tools:
1. Studio Hub - Project management and workspace dashboard
2. Generator - AI content generation (scripts, titles, hooks, ideas, 25+ types)
3. Canvas - Visual design tool (mind maps, flowcharts, layouts)
4. YT Analysis - YouTube channel analysis and competitive intelligence
5. YT Stats - YouTube statistics and performance metrics
6. Thumbnails - Professional thumbnail creation with AI backgrounds
7. Strategy - Comprehensive content strategy planning
8. Calendar - Content scheduling and planning
9. Trends - Trend analysis and viral opportunity identification
10. History - Content library and management system
11. Web Search - AI-enhanced research and content discovery

${contextInfo}

SUBSCRIPTION TIERS:
- Free: 5 AI questions/day, basic features, limited generations
- Creator Pro ($19/month): 50 questions/day, premium features, unlimited generations
- Agency Pro ($49/month): Unlimited questions, team features, advanced analytics
- Enterprise ($99/month): White-label, API access, priority support

YOUR EXPERTISE:
- Complete knowledge of every feature, button, and workflow
- Specific step-by-step guidance for any task
- Troubleshooting solutions for common issues
- Strategic advice based on user's goals and performance
- Integration recommendations between tools
- Performance optimization suggestions

RESPONSE STYLE:
- Be specific and actionable
- Provide exact steps when relevant
- Reference specific features and buttons
- Include tips and best practices
- Suggest related tools and workflows
- Be encouraging and supportive

ALWAYS provide specific, detailed guidance rather than generic advice. You know exactly how every feature works.`;
  }

  private formatUserContext(userContext: UserContext): string {
    return `
CURRENT USER CONTEXT:
- Plan: ${userContext.userPlan}
- Current Tool: ${userContext.currentTool}
- Active Projects: ${userContext.projects?.length || 0}
- Total Generations: ${userContext.performance?.totalGenerations || 0}
- Recent Activity: ${userContext.recentActivity?.length || 0} recent actions
- Goals: ${userContext.goals.join(', ')}
`;
  }

  private categorizeQuestion(question: string, userContext?: UserContext): string {
    const lowerQ = question.toLowerCase();
    
    // Tool-specific questions
    if (lowerQ.includes('generator') || lowerQ.includes('generate') || lowerQ.includes('script') || lowerQ.includes('title') || lowerQ.includes('hook')) {
      return 'generator';
    }
    if (lowerQ.includes('canvas') || lowerQ.includes('mind map') || lowerQ.includes('flowchart') || lowerQ.includes('visual')) {
      return 'canvas';
    }
    if (lowerQ.includes('thumbnail') || lowerQ.includes('image') || lowerQ.includes('background')) {
      return 'thumbnails';
    }
    if (lowerQ.includes('strategy') || lowerQ.includes('plan') || lowerQ.includes('pillar') || lowerQ.includes('content plan')) {
      return 'strategy';
    }
    if (lowerQ.includes('calendar') || lowerQ.includes('schedule') || lowerQ.includes('posting')) {
      return 'calendar';
    }
    if (lowerQ.includes('trend') || lowerQ.includes('viral') || lowerQ.includes('trending')) {
      return 'trends';
    }
    if (lowerQ.includes('youtube') && (lowerQ.includes('analysis') || lowerQ.includes('analyze') || lowerQ.includes('competitor'))) {
      return 'channelAnalysis';
    }
    if (lowerQ.includes('youtube') && (lowerQ.includes('stats') || lowerQ.includes('statistics') || lowerQ.includes('metrics'))) {
      return 'youtubeStats';
    }
    if (lowerQ.includes('history') || lowerQ.includes('previous') || lowerQ.includes('past') || lowerQ.includes('find content')) {
      return 'history';
    }
    if (lowerQ.includes('search') || lowerQ.includes('research') || lowerQ.includes('web')) {
      return 'search';
    }
    if (lowerQ.includes('project') || lowerQ.includes('hub') || lowerQ.includes('dashboard')) {
      return 'studioHub';
    }
    
    // Intent-based categorization
    if (lowerQ.includes('how') && (lowerQ.includes('do') || lowerQ.includes('to'))) {
      return 'workflow';
    }
    if (lowerQ.includes('performance') || lowerQ.includes('analytics') || lowerQ.includes('metrics')) {
      return 'analytics';
    }
    if (lowerQ.includes('problem') || lowerQ.includes('error') || lowerQ.includes('not working') || lowerQ.includes('issue')) {
      return 'troubleshooting';
    }
    if (lowerQ.includes('idea') || lowerQ.includes('suggest') || lowerQ.includes('recommend')) {
      return 'suggestions';
    }
    
    return 'general';
  }

  private async generateIntelligentResponse(
    question: string, 
    category: string, 
    userContext?: UserContext
  ): Promise<AIResponse> {
    // First check if we have a direct answer in our knowledge base
    const directAnswer = findAnswerToQuestion(question);
    if (directAnswer) {
      return {
        content: directAnswer.answer,
        type: 'text',
        confidence: 0.95,
        actions: directAnswer.relatedActions?.map(action => ({
          label: this.getActionLabel(action),
          action: action,
          icon: this.getActionIcon(action)
        })) || []
      };
    }

    // Category-specific responses with complete knowledge
    switch (category) {
      case 'generator':
        return this.handleGeneratorQuestions(question, userContext);
      case 'canvas':
        return this.handleCanvasQuestions(question, userContext);
      case 'thumbnails':
        return this.handleThumbnailQuestions(question, userContext);
      case 'strategy':
        return this.handleStrategyQuestions(question, userContext);
      case 'calendar':
        return this.handleCalendarQuestions(question, userContext);
      case 'trends':
        return this.handleTrendsQuestions(question, userContext);
      case 'channelAnalysis':
        return this.handleYTAnalysisQuestions(question, userContext);
      case 'youtubeStats':
        return this.handleYTStatsQuestions(question, userContext);
      case 'history':
        return this.handleHistoryQuestions(question, userContext);
      case 'search':
        return this.handleSearchQuestions(question, userContext);
      case 'studioHub':
        return this.handleStudioHubQuestions(question, userContext);
      case 'workflow':
        return this.handleWorkflowQuestions(question, userContext);
      case 'troubleshooting':
        return this.handleTroubleshootingQuestions(question, userContext);
      case 'analytics':
        return this.handleAnalyticsQuestions(question, userContext);
      case 'suggestions':
        return this.handleSuggestionQuestions(question, userContext);
      default:
        return this.handleGeneralQuestions(question, userContext);
    }
  }

  private handleGeneratorQuestions(question: string, userContext?: UserContext): AIResponse {
    const lowerQ = question.toLowerCase();
    
    if (lowerQ.includes('script')) {
      return {
        content: `🎬 **Creating YouTube Video Scripts:**

**Step-by-Step Process:**
1. **Go to Generator tab** - Click Generator in the main navigation
2. **Select Platform** - Choose "YouTube" for optimized script format
3. **Choose Content Type** - Select "Script" from the dropdown menu
4. **Enter Video Topic** - Be specific about your content (e.g., "How to start a YouTube channel in 2024")
5. **Set Video Length** - Choose from 1-2 minutes, 3-5 minutes, or custom length
6. **Configure Options:**
   - **AI Persona**: Professional for tutorials, Casual for vlogs
   - **Target Audience**: Be specific (e.g., "beginner YouTubers")
   - **Video Length**: Affects pacing and content depth
7. **Generate Script** - Click Generate for your complete script

**What You'll Get:**
✅ **Hook (0-3 seconds)** - Attention-grabbing opening
✅ **Main Content** - Structured body with retention techniques  
✅ **Call-to-Action** - Engagement prompts and next steps
✅ **Visual Directions** - Camera angles and scene descriptions
✅ **Timing Notes** - Pacing guidance for natural delivery

**Pro Tips:**
• Longer videos need more detailed prompts
• Include your unique angle or expertise
• Use batch variations to test different approaches
• Save successful scripts to History for future reference

**Next Steps:**
After generating your script, you can:
- Refine it (make shorter/longer, adjust tone)
- Create matching thumbnails in Thumbnails tab
- Plan posting schedule in Calendar tab`,
        type: 'workflow',
        confidence: 0.98,
        actions: [
          { label: 'Open Generator', action: 'navigate:generator', icon: 'SparklesIcon' },
          { label: 'Create Thumbnails', action: 'navigate:thumbnailMaker', icon: 'PhotoIcon' },
          { label: 'Plan Schedule', action: 'navigate:calendar', icon: 'CalendarIcon' }
        ],
        workflowSteps: [
          { step: 1, action: 'Navigate to Generator tab', details: 'Click Generator in main navigation' },
          { step: 2, action: 'Select YouTube platform', details: 'Choose YouTube for script optimization' },
          { step: 3, action: 'Choose Script content type', details: 'Select from dropdown menu' },
          { step: 4, action: 'Enter specific topic', details: 'Include target audience and unique angle' },
          { step: 5, action: 'Set video length and options', details: 'Configure AI persona and target audience' },
          { step: 6, action: 'Generate and refine', details: 'Click Generate, then use refinement options' }
        ]
      };
    }

    if (lowerQ.includes('title') || lowerQ.includes('headline')) {
      return {
        content: `📝 **Creating Viral Video Titles:**

**Step-by-Step Process:**
1. **Go to Generator tab**
2. **Select your platform** (YouTube, TikTok, etc.)
3. **Choose "Title/Headlines"** from content type dropdown
4. **Enter your video topic** - Be specific about content
5. **Increase batch variations** to 10-15 for multiple options
6. **Configure targeting:**
   - Target audience (affects language complexity)
   - AI persona (Professional vs Casual tone)
7. **Generate titles** - You'll get 15 variations optimized for engagement

**Title Categories You'll Get:**
🧠 **Curiosity Builders** - "The Secret That Changed Everything..."
🔥 **Benefit-Driven** - "How to Get 10K Subscribers in 30 Days"
⚡ **Urgency Creators** - "Stop Doing This Before It's Too Late"
👥 **Social Proof** - "Why 1 Million People Love This Method"
🤔 **Controversy Starters** - "Unpopular Opinion: YouTube Gurus Are Wrong"

**Optimization Features:**
• Platform-specific character limits
• Psychological triggers analysis
• Expected performance ratings
• SEO keyword integration

**Pro Tips:**
• Test different emotional approaches
• Include numbers when relevant
• Use power words that trigger emotions
• Keep mobile readability in mind
• A/B test your favorites

Ready to create attention-grabbing titles?`,
        type: 'workflow',
        confidence: 0.97,
        actions: [
          { label: 'Generate Titles', action: 'navigate:generator', icon: 'SparklesIcon' },
          { label: 'A/B Test Ideas', action: 'navigate:generator', icon: 'BeakerIcon' }
        ]
      };
    }

    // General Generator guidance
    return {
      content: `🚀 **Generator Tool - Your AI Content Creation Engine**

The Generator is your primary tool for creating 25+ types of content optimized for any platform.

**What You Can Create:**
• **Scripts** (video, podcast, live stream)
• **Titles & Headlines** (viral, SEO-optimized)
• **Video Hooks** (first 3 seconds that stop scrolling)
• **Content Ideas** (specific, actionable concepts)
• **Thumbnail Concepts** (visual descriptions)
• **Content Briefs** (comprehensive planning docs)
• **Polls & Quizzes** (interactive engagement)
• **SEO Keywords** (discoverability optimization)
• **Social Media Captions** (platform-specific)
• **And 15+ more content types**

**How It Works:**
1. Choose your platform (affects optimization)
2. Select content type from dropdown
3. Enter your topic with specific details
4. Configure AI persona and audience
5. Generate and refine results

**Key Features:**
✅ **Batch Generation** - Create multiple variations
✅ **AI Personas** - Different writing styles
✅ **Platform Optimization** - Format for each social platform
✅ **SEO Integration** - Keywords and optimization
✅ **Refinement Tools** - Adjust tone, length, style

What specific content would you like to create?`,
      type: 'text',
      confidence: 0.9,
      actions: [
        { label: 'Start Generating', action: 'navigate:generator', icon: 'SparklesIcon' },
        { label: 'View Examples', action: 'navigate:history', icon: 'ClipboardDocumentListIcon' }
      ]
    };
  }

  private handleCanvasQuestions(question: string, userContext?: UserContext): AIResponse {
    const lowerQ = question.toLowerCase();
    
    if (lowerQ.includes('mind map')) {
      return {
        content: `🧠 **Creating Mind Maps in Canvas:**

**Method 1: Import from Strategy Tool**
1. **Create strategy first** - Go to Strategy tab, generate content strategy
2. **Open Canvas tab**
3. **Click "Import from Strategy"** (if available)
4. **Auto-generates mind map** from your content pillars and themes

**Method 2: Manual Creation**
1. **Go to Canvas tab**
2. **Add central node** - Click Text tool, place in center with main topic
3. **Add primary branches** - Create nodes for main categories/pillars
4. **Connect with lines** - Use Connector tool to link related elements
5. **Add sub-topics** - Branch out with specific tactics and ideas
6. **Color code categories** - Use different colors for different content types

**Design Best Practices:**
🎨 **Visual Hierarchy:**
- Central topic = largest, bold
- Primary branches = medium size
- Sub-topics = smaller text
- Use colors to group related concepts

🔄 **Layout Tips:**
- Start center, work outward
- Keep text concise (2-4 words per node)
- Use consistent spacing
- Add icons for visual appeal

**Advanced Features:**
• **Sticky notes** for brainstorming ideas
• **Frames** to group related sections
• **Images** to make concepts more memorable
• **Export** as PNG for presentations

**Pro Tip:** Mind maps work great for planning video series, content calendars, or breaking down complex topics!

Ready to visualize your content strategy?`,
        type: 'workflow',
        confidence: 0.98,
        actions: [
          { label: 'Open Canvas', action: 'navigate:canvas', icon: 'ColumnsIcon' },
          { label: 'Create Strategy First', action: 'navigate:strategy', icon: 'CompassIcon' }
        ]
      };
    }

    return {
      content: `🎨 **Canvas - Visual Design & Collaboration Tool**

Canvas is your creative workspace for visual planning and design.

**What You Can Create:**
🧠 **Mind Maps** - Visualize content strategies and ideas
📊 **Flowcharts** - Map out processes and workflows  
📝 **Mood Boards** - Collect inspiration and visual references
🗂️ **Project Layouts** - Organize complex projects visually
🤝 **Team Collaboration** - Work together in real-time

**Key Elements:**
• **Text Elements** - Add labels, descriptions, ideas
• **Shapes** - Circles, rectangles, arrows for structure
• **Sticky Notes** - Brainstorming and quick ideas
• **Images** - Upload or use AI-generated backgrounds
• **Connectors** - Link related elements
• **Frames** - Group and organize sections

**Workflows:**
1. **Content Planning** - Map out video series or campaigns
2. **Strategy Visualization** - Turn written strategies into visual guides
3. **Team Brainstorming** - Collaborative idea generation
4. **Project Organization** - Visual project management

**Canvas Features:**
✅ **Drag & Drop Interface** - Easy element positioning
✅ **Real-time Collaboration** - Work with team members
✅ **Export Options** - Save as images or projects
✅ **Undo/Redo** - Experiment without worry
✅ **Zoom & Pan** - Work on detailed sections

What would you like to create visually?`,
      type: 'text',
      confidence: 0.9,
      actions: [
        { label: 'Open Canvas', action: 'navigate:canvas', icon: 'ColumnsIcon' },
        { label: 'Import Strategy', action: 'navigate:strategy', icon: 'CompassIcon' }
      ]
    };
  }

  private handleThumbnailQuestions(question: string, userContext?: UserContext): AIResponse {
    return {
      content: `🖼️ **Creating Professional YouTube Thumbnails:**

**Step-by-Step Process:**
1. **Go to Thumbnails tab**
2. **Choose starting point:**
   - Template (optimized for different content types)
   - AI-generated background (describe the scene you want)
   - Upload your own image
3. **Add text overlays:**
   - Click Text tool
   - Keep to 4-6 words maximum
   - Use large, bold fonts
   - Apply effects (shadows, outlines, gradients)
4. **Optimize for engagement:**
   - High contrast colors
   - Clear focal point
   - Emotional expressions or intrigue
   - Readable at small sizes
5. **Preview and export:**
   - Check readability at thumbnail size
   - Export at 1920x1080 (YouTube optimal)
   - Keep file size under 2MB

**Thumbnail Best Practices:**
✅ **Text Guidelines:**
- Maximum 4-6 words
- Large, bold fonts only
- High contrast colors
- Shadows/outlines for readability

✅ **Visual Design:**
- Clear focal point
- Bright, eye-catching colors
- Avoid clutter
- Consistent branding

✅ **Psychology:**
- Show emotions (surprise, excitement)
- Create curiosity gaps
- Use arrows or highlights
- Include yourself if personal brand

**AI Background Generation:**
Describe scenes like:
- "Modern office workspace with laptop"
- "Cozy coffee shop atmosphere"
- "Futuristic city skyline"
- "Minimalist studio setup"

**Export Settings:**
- **Size**: 1920x1080 (16:9 ratio)
- **Format**: JPG or PNG
- **Quality**: High for clarity
- **File Size**: Under 2MB

Ready to create click-worthy thumbnails?`,
      type: 'workflow',
      confidence: 0.97,
      actions: [
        { label: 'Create Thumbnail', action: 'navigate:thumbnailMaker', icon: 'PhotoIcon' },
        { label: 'Generate Title Match', action: 'navigate:generator', icon: 'SparklesIcon' }
      ]
    };
  }

  private handleStrategyQuestions(question: string, userContext?: UserContext): AIResponse {
    return {
      content: `📋 **Creating Comprehensive Content Strategy:**

**Step-by-Step Strategy Creation:**
1. **Go to Strategy tab**
2. **Define your parameters:**
   - **Niche** (be specific: "fitness for busy moms" not just "fitness")
   - **Target Audience** (detailed demographics and psychographics)
   - **Goals** (subscriber growth, revenue, brand awareness)
   - **Platforms** (YouTube, TikTok, Instagram, etc.)
   - **Timeframe** (1 month to 1 year)
   - **Budget Level** (affects tool and resource recommendations)
3. **Generate comprehensive strategy**
4. **Review and implement** generated elements

**What You'll Get:**
🎯 **Content Pillars** (3 strategic themes):
- Pillar 1: Attract new audience
- Pillar 2: Build trust and expertise  
- Pillar 3: Convert to loyal followers

📅 **Posting Schedule:**
- Optimal times for your audience
- Platform-specific frequency
- Content type calendar

🔍 **SEO Strategy:**
- Primary keywords for your niche
- Long-tail keyword opportunities
- Hashtag recommendations

💡 **Content Ideas:**
- Specific topics for each pillar
- Seasonal content opportunities
- Trending angles to explore

📊 **Success Metrics:**
- KPIs to track
- Growth targets
- Performance benchmarks

**Implementation:**
✅ **Export strategy** as PDF for team sharing
✅ **Send schedule items** to Calendar tab
✅ **Use content ideas** in Generator tab
✅ **Create visual maps** in Canvas tab

**Pro Tips:**
• Be ultra-specific about your niche and audience
• Longer timeframes generate more comprehensive strategies
• Review and update monthly based on performance

Ready to build your content empire with a strategic foundation?`,
      type: 'workflow',
      confidence: 0.98,
      actions: [
        { label: 'Create Strategy', action: 'navigate:strategy', icon: 'CompassIcon' },
        { label: 'Schedule Content', action: 'navigate:calendar', icon: 'CalendarIcon' }
      ]
    };
  }

  private handleTrendsQuestions(question: string, userContext?: UserContext): AIResponse {
    return {
      content: `📈 **Finding and Leveraging Trends:**

**How to Research Trends:**
1. **Go to Trends tab**
2. **Enter your niche or topic** (e.g., "sustainable fashion", "gaming setup")
3. **AI analyzes current trends** with real-time web search
4. **Review trend cards** with actionable insights

**Trend Card Information:**
📊 **Status Indicators:**
- **Emerging ⚡** - Just starting, great potential
- **Growing Fast ↗️** - Gaining momentum, act quickly  
- **At Peak 🔥** - Maximum attention, very competitive
- **Fading ↘️** - Declining interest, avoid unless unique angle

🎯 **Strategic Insights:**
- Why this trend matters for your audience
- Psychological drivers behind the trend
- How it aligns with your content goals

💡 **Content Opportunities:**
- Specific content ideas you can create immediately
- Optimized keywords for discoverability
- Trending hashtags for social reach
- Hook angles that capture attention

**Using Trend Insights:**
1. **Focus on Emerging and Growing trends** for best opportunities
2. **Copy content ideas** into Generator tool
3. **Use provided keywords** for SEO optimization
4. **Apply hook angles** to grab attention
5. **Act quickly** - trends move fast!

**Best Practices:**
✅ **Research weekly** for general awareness
✅ **Daily monitoring** for fast-moving niches
✅ **Cross-reference** with your expertise
✅ **Adapt trends** to your unique voice
✅ **Create quickly** while trends are growing

**Trend Research Tips:**
• Start with broader terms, then narrow down
• Research adjacent niches for cross-pollination
• Look for patterns across multiple trends
• Consider seasonal and cyclical trends

Ready to ride the viral wave?`,
      type: 'workflow',
      confidence: 0.97,
      actions: [
        { label: 'Research Trends', action: 'navigate:trends', icon: 'TrendingUpIcon' },
        { label: 'Create Trending Content', action: 'navigate:generator', icon: 'SparklesIcon' }
      ]
    };
  }

  private handleWorkflowQuestions(question: string, userContext?: UserContext): AIResponse {
    const lowerQ = question.toLowerCase();
    
    if (lowerQ.includes('youtube') && lowerQ.includes('video')) {
      return {
        content: `🎬 **Complete YouTube Video Creation Workflow:**

**Phase 1: Planning & Research**
1. **Research trends** (Trends tab) - Find viral opportunities
2. **Analyze competitors** (YT Analysis tab) - Identify content gaps
3. **Create strategy** (Strategy tab) - Plan content series
4. **Schedule content** (Calendar tab) - Plan posting timeline

**Phase 2: Content Creation**
5. **Generate video script** (Generator tab):
   - Select YouTube platform
   - Choose Script content type
   - Set video length and target audience
6. **Create thumbnail** (Thumbnails tab):
   - Use AI backgrounds or templates
   - Add bold, readable text (4-6 words max)
   - Optimize for click-through rate
7. **Generate title variations** (Generator tab):
   - Batch generate 10-15 options
   - Test different emotional approaches

**Phase 3: Optimization & Publishing**
8. **Create descriptions** (Generator tab):
   - YouTube Description content type
   - Include SEO keywords from Strategy
9. **Plan cross-platform content** (Canvas tab):
   - Create mind maps for content series
   - Plan repurposing for other platforms
10. **Track performance** (YT Stats tab):
    - Monitor video metrics
    - Analyze engagement rates

**Phase 4: Analysis & Iteration**
11. **Review performance** (History tab):
    - Compare successful vs. underperforming content
    - Identify patterns in high-engagement content
12. **Refine strategy** (Strategy tab):
    - Update based on performance data
    - Adjust content pillars and posting schedule

**Pro Tips for Success:**
🎯 **Consistency**: Use Calendar to maintain regular posting
📊 **Data-Driven**: Make decisions based on YT Stats analytics
🔄 **Iterative**: Continuously improve based on performance
🎨 **Visual**: Use Canvas for series planning and mind mapping
📈 **Trending**: Regularly check Trends for viral opportunities

This workflow typically takes 2-4 hours per video but becomes faster with practice!

Which part of this workflow would you like me to explain in more detail?`,
        type: 'workflow',
        confidence: 0.98,
        actions: [
          { label: 'Start with Research', action: 'navigate:trends', icon: 'TrendingUpIcon' },
          { label: 'Create Strategy', action: 'navigate:strategy', icon: 'CompassIcon' },
          { label: 'Generate Script', action: 'navigate:generator', icon: 'SparklesIcon' }
        ],
        workflowSteps: [
          { step: 1, action: 'Research trends and opportunities', details: 'Use Trends tab to find viral content opportunities' },
          { step: 2, action: 'Analyze competitor content', details: 'Use YT Analysis to identify content gaps' },
          { step: 3, action: 'Generate video script', details: 'Use Generator with YouTube platform and Script type' },
          { step: 4, action: 'Create eye-catching thumbnail', details: 'Use Thumbnails tab with AI backgrounds and bold text' },
          { step: 5, action: 'Generate title variations', details: 'Batch generate 10-15 title options in Generator' },
          { step: 6, action: 'Schedule and track performance', details: 'Use Calendar for scheduling and YT Stats for monitoring' }
        ]
      };
    }

    return {
      content: `⚡ **Common Workflows in CreateGen Studio:**

**1. YouTube Video Creation** 🎬
Research (Trends) → Strategy → Script (Generator) → Thumbnail → Schedule (Calendar) → Track (YT Stats)

**2. Social Media Campaign** 📱  
Strategy → Content Ideas (Generator) → Visual Assets (Canvas/Thumbnails) → Schedule (Calendar) → Monitor Performance

**3. Competitor Analysis** 🔍
YT Analysis → Compare Stats (YT Stats) → Identify Trends → Create Better Content (Generator)

**4. Content Series Planning** 📋
Strategy → Mind Map (Canvas) → Schedule (Calendar) → Generate Episodes (Generator) → Track Success

**5. Viral Content Creation** 🚀
Trends Research → Content Ideas (Generator) → Optimize (Thumbnails) → Web Research (Search) → Create & Publish

**6. Brand Strategy Development** 🎯
Strategy → Visual Planning (Canvas) → Content Calendar → Content Creation (Generator) → Performance Tracking

**Power User Tips:**
🎹 **Keyboard Shortcuts**: Cmd/Ctrl+K for global search
🔄 **Tool Integration**: Export from one tool to import in another
📊 **Data Flow**: Use performance data to improve future content
🎨 **Visual Planning**: Canvas helps organize complex strategies
⏰ **Batch Work**: Group similar tasks for efficiency

Which specific workflow interests you most?`,
      type: 'workflow',
      confidence: 0.92,
      actions: [
        { label: 'YouTube Workflow', action: 'navigate:trends', icon: 'PlayCircleIcon' },
        { label: 'Strategy Planning', action: 'navigate:strategy', icon: 'CompassIcon' },
        { label: 'Content Creation', action: 'navigate:generator', icon: 'SparklesIcon' }
      ]
    };
  }

  private handleTroubleshootingQuestions(question: string, userContext?: UserContext): AIResponse {
    const lowerQ = question.toLowerCase();

    // Extract symptoms from the question
    const symptoms = this.extractSymptomsFromQuestion(lowerQ);

    // Use intelligent diagnostics if we have specific symptoms
    if (symptoms.length > 0) {
      const diagnosticResults = quickDiagnose(symptoms);

      if (diagnosticResults.length > 0) {
        const topResult = diagnosticResults[0];
        return this.formatDiagnosticResponse(topResult);
      }
    }

    // Specific issue handling
    if (lowerQ.includes('generation') && (lowerQ.includes('slow') || lowerQ.includes('loading') || lowerQ.includes('stuck'))) {
      const generationIssue = TROUBLESHOOTING_DATABASE.find(issue => issue.id === 'generation-slow');
      if (generationIssue) {
        const solution = generationIssue.solutions[0];
        return {
          content: `🔧 **${generationIssue.title}**

${generationIssue.description}

**Quick Diagnosis:**
${generationIssue.symptoms.map(s => `• ${s}`).join('\n')}

**Most Likely Causes:**
${generationIssue.possibleCauses.slice(0, 3).map(c => `• ${c}`).join('\n')}

**Step-by-Step Solution (${solution.difficulty.toUpperCase()} - ${solution.estimatedTime}):**

${solution.steps.map(step =>
  `**${step.step}. ${step.action}**
${step.details}
*Expected Result:* ${step.expectedResult}
${step.troubleshootingTip ? `💡 *Tip:* ${step.troubleshootingTip}` : ''}`
).join('\n\n')}

**Success Indicators:**
${solution.successCriteria.map(c => `✅ ${c}`).join('\n')}

**If This Doesn't Work:**
${solution.fallbackOptions.map(o => `• ${o}`).join('\n')}

**Prevention for Future:**
${generationIssue.preventionTips.slice(0, 3).map(t => `• ${t}`).join('\n')}

Need help with a specific step or different issue?`,
          type: 'troubleshooting',
          confidence: 0.95,
          actions: [
            { label: 'Try Simple Generation', action: 'navigate:generator', icon: 'SparklesIcon' },
            { label: 'Check Account Status', action: 'navigate:account', icon: 'UserIcon' },
            { label: 'Advanced Diagnostics', action: 'openSupport', icon: 'CogIcon' }
          ],
          workflowSteps: solution.steps.map(step => ({
            step: step.step,
            action: step.action,
            details: step.details
          }))
        };
      }
    }

    if (lowerQ.includes('canvas') && (lowerQ.includes('slow') || lowerQ.includes('lag') || lowerQ.includes('performance'))) {
      const canvasIssue = TROUBLESHOOTING_DATABASE.find(issue => issue.id === 'canvas-performance');
      if (canvasIssue) {
        return this.formatTroubleshootingResponse(canvasIssue);
      }
    }

    if (lowerQ.includes('youtube') && (lowerQ.includes('analysis') || lowerQ.includes('failed') || lowerQ.includes('not working'))) {
      const youtubeIssue = TROUBLESHOOTING_DATABASE.find(issue => issue.id === 'youtube-analysis-failed');
      if (youtubeIssue) {
        return this.formatTroubleshootingResponse(youtubeIssue);
      }
    }

    if (lowerQ.includes('browser') || lowerQ.includes('compatibility') || lowerQ.includes('not loading')) {
      const browserIssue = TROUBLESHOOTING_DATABASE.find(issue => issue.id === 'browser-compatibility');
      if (browserIssue) {
        return this.formatTroubleshootingResponse(browserIssue);
      }
    }

    // General troubleshooting guide
    return {
      content: `🛠️ **Intelligent Troubleshooting System**

I can help diagnose and solve specific issues. Tell me exactly what's happening:

**Common Issues I Can Solve:**

🚀 **Generation Problems:**
• "Generation is taking too long"
• "Generation failed with error"
• "Not getting relevant results"

🎨 **Canvas Issues:**
• "Canvas is running slowly"
• "Elements not responding"
• "Export taking forever"

📊 **Analytics Problems:**
• "YouTube analysis not working"
• "Channel stats not loading"
• "Analysis gets stuck"

🌐 **Browser/Technical:**
• "Features not loading properly"
• "Buttons not responding"
• "App running slowly"

**For Best Help:**
📝 Describe exactly what you're experiencing
⏰ Tell me when the issue occurs
🔧 Mention what you were trying to do
💻 Let me know your browser and device

**Quick Self-Diagnostics:**
1. **Refresh the page** and try again
2. **Test in incognito mode** to rule out extensions
3. **Check internet connection** stability
4. **Verify account status** and plan limits
5. **Try different browser** if issues persist

**Advanced Diagnostics Available:**
• Step-by-step troubleshooting guides
• Intelligent issue detection
• Browser compatibility checks
• Performance optimization tips
• Account and billing issue resolution

What specific problem are you experiencing? The more details you provide, the more precise help I can give!`,
      type: 'troubleshooting',
      confidence: 0.88,
      actions: [
        { label: 'Test Generation', action: 'navigate:generator', icon: 'SparklesIcon' },
        { label: 'Check Account Status', action: 'navigate:account', icon: 'UserIcon' },
        { label: 'Get Support', action: 'openSupport', icon: 'QuestionMarkCircleIcon' }
      ]
    };
  }

  private extractSymptomsFromQuestion(question: string): string[] {
    const symptoms: string[] = [];

    // Common symptom patterns
    const symptomPatterns = [
      'taking too long', 'taking forever', 'very slow', 'stuck', 'frozen',
      'not working', 'not loading', 'not responding', 'failed', 'error',
      'broken', 'laggy', 'slow', 'unresponsive', 'crashed',
      'no results', 'empty results', 'wrong results', 'invalid',
      'can\'t click', 'won\'t click', 'doesn\'t work', 'not clickable'
    ];

    for (const pattern of symptomPatterns) {
      if (question.includes(pattern)) {
        symptoms.push(pattern);
      }
    }

    return symptoms;
  }

  private formatDiagnosticResponse(result: DiagnosticResult): AIResponse {
    const issue = result.issue;
    const solution = result.recommendedSolution;

    return {
      content: `🎯 **Intelligent Diagnosis: ${issue.title}**

**Confidence Level:** ${Math.round(result.confidence * 100)}% match
${result.additionalContext}

**Issue Description:**
${issue.description}

**What You're Likely Experiencing:**
${issue.symptoms.slice(0, 3).map(s => `• ${s}`).join('\n')}

**Recommended Solution (${solution.difficulty.toUpperCase()} - ${solution.estimatedTime}):**

${solution.steps.map(step =>
  `**Step ${step.step}: ${step.action}**
${step.details}
✅ *Expected:* ${step.expectedResult}
${step.troubleshootingTip ? `💡 *Tip:* ${step.troubleshootingTip}` : ''}`
).join('\n\n')}

**You'll Know It Worked When:**
${solution.successCriteria.map(c => `✅ ${c}`).join('\n')}

**If This Doesn't Solve It:**
${solution.fallbackOptions.slice(0, 2).map(o => `• ${o}`).join('\n')}

**Prevent This in Future:**
${issue.preventionTips.slice(0, 2).map(t => `• ${t}`).join('\n')}

Need help with any specific step?`,
      type: 'troubleshooting',
      confidence: result.confidence,
      actions: [
        { label: 'Try Solution', action: 'navigate:generator', icon: 'CogIcon' },
        { label: 'Get More Help', action: 'openSupport', icon: 'QuestionMarkCircleIcon' }
      ],
      workflowSteps: solution.steps.map(step => ({
        step: step.step,
        action: step.action,
        details: step.details
      }))
    };
  }

  private formatTroubleshootingResponse(issue: TroubleshootingIssue): AIResponse {
    const solution = issue.solutions[0]; // Use first solution as default

    return {
      content: `🔧 **${issue.title}**

${issue.description}

**Common Symptoms:**
${issue.symptoms.slice(0, 3).map(s => `• ${s}`).join('\n')}

**Likely Causes:**
${issue.possibleCauses.slice(0, 3).map(c => `• ${c}`).join('\n')}

**Solution Steps (${solution.difficulty.toUpperCase()} - ${solution.estimatedTime}):**

${solution.steps.map(step =>
  `**${step.step}. ${step.action}**
${step.details}
*Expected:* ${step.expectedResult}
${step.troubleshootingTip ? `💡 *Tip:* ${step.troubleshootingTip}` : ''}`
).join('\n\n')}

**Success Criteria:**
${solution.successCriteria.map(c => `✅ ${c}`).join('\n')}

**Prevention Tips:**
${issue.preventionTips.slice(0, 2).map(t => `• ${t}`).join('\n')}

Need help with specific steps or have a different issue?`,
      type: 'troubleshooting',
      confidence: 0.9,
      actions: [
        { label: 'Try Solution', action: 'navigate:generator', icon: 'CogIcon' },
        { label: 'Get Support', action: 'openSupport', icon: 'QuestionMarkCircleIcon' }
      ],
      workflowSteps: solution.steps.map(step => ({
        step: step.step,
        action: step.action,
        details: step.details
      }))
    };
  }

  private handleAnalyticsQuestions(question: string, userContext?: UserContext): AIResponse {
    return {
      content: `📊 **Understanding Your Content Performance:**

**Available Analytics:**

**1. YouTube Statistics (YT Stats Tab)**
✅ **Channel Metrics**: Subscribers, total views, video count
✅ **Engagement Rates**: Calculated from top-performing videos
✅ **Performance Scores**: Viral potential and content quality ratings
✅ **Growth Tracking**: Compare with competitors and benchmarks

**2. Studio Hub Analytics**
✅ **Project Progress**: Track completion rates and timelines
✅ **Tool Usage**: See which features drive best results
✅ **Activity Feed**: Recent generations and their performance
✅ **AI Insights**: Personalized recommendations based on data

**3. Content Performance (History Tab)**
✅ **Generation Analytics**: Track which content performs best
✅ **Success Patterns**: Identify your most effective content types
✅ **Engagement Tracking**: Monitor likes, shares, comments where available
✅ **Content Evolution**: See how your content quality improves over time

**Key Metrics to Track:**
📈 **Engagement Rate**: 
- 1-3% = Average
- 3-6% = Good  
- 6%+ = Excellent

📊 **Content Performance**:
- View completion rates
- Click-through rates (thumbnails)
- Share and save rates
- Comment engagement

🎯 **Channel Growth**:
- Subscriber growth rate
- Average views per video
- Upload consistency
- Content variety effectiveness

**Analyzing Performance:**
1. **Compare successful vs. underperforming content**
2. **Identify patterns** in high-engagement pieces
3. **Note optimal posting times** and frequencies
4. **Track content type performance** (tutorials vs. vlogs)
5. **Monitor audience retention** and drop-off points

**Using Analytics to Improve:**
🔄 **Content Strategy**: Adjust based on what works
📅 **Posting Schedule**: Post when audience is most active
🎨 **Content Format**: Focus on formats that drive engagement
📝 **Content Topics**: Double down on successful themes

**Premium Analytics Features:**
• Historical data tracking
• Advanced performance comparisons
• Automated insights and recommendations
• Export capabilities for deeper analysis

Would you like me to help you analyze specific performance metrics?`,
      type: 'analysis',
      confidence: 0.93,
      actions: [
        { label: 'Check YT Stats', action: 'navigate:youtubeStats', icon: 'ChartBarIcon' },
        { label: 'View Studio Analytics', action: 'navigate:studioHub', icon: 'PresentationChartLineIcon' },
        { label: 'Review Content History', action: 'navigate:history', icon: 'ClipboardDocumentListIcon' }
      ]
    };
  }

  private handleSuggestionQuestions(question: string, userContext?: UserContext): AIResponse {
    const suggestions = this.generatePersonalizedSuggestions(userContext);
    
    return {
      content: `💡 **Personalized Recommendations for You:**

Based on your activity and goals, here are smart suggestions to boost your content creation:

${suggestions.map((suggestion, index) => `
**${index + 1}. ${suggestion.title}**
${suggestion.description}
*Why this matters*: ${suggestion.reason}
`).join('')}

**Quick Wins You Can Implement Today:**
🚀 **Trending Content**: Check Trends tab for viral opportunities in your niche
📊 **Performance Review**: Analyze your top content in History to identify winning patterns
🎯 **Strategy Audit**: Use Strategy tab to ensure your content pillars are balanced
🔧 **Workflow Optimization**: Set up automation in Studio Hub to save time

**Based on Your Plan (${userContext?.userPlan || 'Free'}):**
${userContext?.userPlan === 'free' ? `
• You have access to basic features - consider upgrading for unlimited generations
• Focus on high-impact content that maximizes your daily limits
• Use batch generation strategically for important content` : `
• Take advantage of unlimited generations for testing and optimization
• Use advanced features like A/B testing and premium templates
• Leverage priority processing for time-sensitive content`}

**Next Steps:**
1. Pick one suggestion that excites you most
2. Use the relevant tool to implement it
3. Track results and iterate based on performance

Which suggestion would you like to tackle first?`,
      type: 'suggestion',
      confidence: 0.94,
      actions: suggestions.slice(0, 3).map(s => ({
        label: s.actionLabel,
        action: s.action,
        icon: s.icon
      }))
    };
  }

  private handleGeneralQuestions(question: string, userContext?: UserContext): AIResponse {
    return {
      content: `👋 **Welcome to CreateGen Studio!**

I'm your AI Studio Assistant with complete knowledge of every feature and workflow in the platform.

**What I Can Help With:**
🎯 **Tool Guidance** - Step-by-step instructions for any feature
📊 **Performance Analysis** - Understanding your metrics and optimization
💡 **Content Strategy** - Planning and ideation for viral content
🛠️ **Workflow Optimization** - Making your creation process more efficient
🔧 **Troubleshooting** - Solving any issues you encounter
📈 **Growth Strategy** - Scaling your content and audience

**Popular Questions I Can Answer:**
• "How do I create a viral YouTube script?"
• "What makes a good thumbnail that gets clicks?"
• "How do I analyze my competitors?"
• "What content should I create for my niche?"
• "How do I optimize my posting schedule?"
• "Why is my generation taking so long?"

**Quick Start Suggestions:**
🚀 **New to CreateGen?** Try the Generator tab - create your first video script or title ideas
📊 **Want to analyze performance?** Check YT Stats to understand your metrics
🎨 **Planning content?** Use Strategy tab to build a comprehensive content plan
📈 **Looking for viral ideas?** Trends tab shows what's hot in your niche

**Power Tips:**
• Press **Cmd/Ctrl+K** for global search and quick navigation
• Use **Studio Hub** as your command center for project management
• **Connect tools** - export from one tool to import in another
• **Track everything** - History tab keeps all your generations organized

**Your Current Status:**
${userContext ? `
- Plan: ${userContext.userPlan}
- Current Tool: ${userContext.currentTool}
- Total Generations: ${userContext.performance?.totalGenerations || 0}
- Active Projects: ${userContext.projects?.length || 0}
` : 'Not logged in - consider signing up for unlimited features!'}

What specific aspect of CreateGen Studio would you like to explore?`,
      type: 'text',
      confidence: 0.85,
      actions: [
        { label: 'Start Creating', action: 'navigate:generator', icon: 'SparklesIcon' },
        { label: 'Plan Strategy', action: 'navigate:strategy', icon: 'CompassIcon' },
        { label: 'Analyze Performance', action: 'navigate:youtubeStats', icon: 'ChartBarIcon' }
      ]
    };
  }

  private handleYTAnalysisQuestions(question: string, userContext?: UserContext): AIResponse {
    const lowerQ = question.toLowerCase();

    if (lowerQ.includes('competitor') || lowerQ.includes('analyze')) {
      return {
        content: `🔍 **YouTube Channel Analysis - Complete Guide:**

**Step-by-Step Process:**
1. **Go to YT Analysis tab**
2. **Enter competitor channels** (up to 5 channels):
   - Use full URLs: youtube.com/@channelname
   - Or just channel names: "Channel Name"
   - Separate multiple channels with commas
3. **Click "Start Analysis"** - Takes 2-5 minutes per channel
4. **Review comprehensive report** with insights

**What You'll Get:**
📊 **Channel Overview:**
- Subscriber count and growth patterns
- Video upload frequency and consistency
- Average views and engagement rates
- Content themes and topics

🎯 **Content Analysis:**
- Most successful video formats
- Optimal video lengths for their audience
- Title patterns that perform well
- Thumbnail styles that get clicks

���� **Content Gaps & Opportunities:**
- Topics that perform well but are underserved
- Low-hanging fruit ideas you can capitalize on
- Trending formats to test in your niche
- Audience pain points not being addressed

🚀 **Strategic Recommendations:**
- Specific content ideas based on gaps found
- Optimal posting frequencies and timing
- Audience preferences and behavior patterns
- Competition level for different topics

**Pro Tips:**
• Analyze 3-5 channels for comprehensive insights
• Include your own channel for benchmarking
• Focus on channels with similar audience sizes
• Look for patterns across multiple successful channels
• Use insights to generate content in Generator tool

**Credits Used:** 4 credits per channel (Free users)
**Processing Time:** 2-5 minutes per channel`,
        type: 'workflow',
        confidence: 0.98,
        actions: [
          { label: 'Start Channel Analysis', action: 'navigate:channelAnalysis', icon: 'SearchCircleIcon' },
          { label: 'Generate Content Ideas', action: 'navigate:generator', icon: 'SparklesIcon' }
        ],
        workflowSteps: [
          { step: 1, action: 'Navigate to YT Analysis tab', details: 'Click YT Analysis in main navigation' },
          { step: 2, action: 'Enter channel URLs or names', details: 'Add up to 5 channels, separated by commas' },
          { step: 3, action: 'Start analysis', details: 'Click Start Analysis and wait 2-5 minutes' },
          { step: 4, action: 'Review insights', details: 'Focus on content gaps and opportunities sections' },
          { step: 5, action: 'Create content', details: 'Use insights in Generator tool for new content' }
        ]
      };
    }

    return {
      content: `🔍 **YouTube Channel Analysis Tool**

Analyze any YouTube channel to uncover content opportunities and competitive insights.

**Key Features:**
• **Multi-Channel Analysis** - Compare up to 5 channels simultaneously
• **Content Gap Identification** - Find underserved topics that perform well
• **Performance Insights** - Understand what works in your niche
• **Strategic Recommendations** - Get specific content ideas and formats

**Perfect For:**
🎯 Competitive research and benchmarking
📈 Finding viral content opportunities
💡 Understanding successful content patterns
🚀 Identifying low-hanging fruit ideas

**How It Works:**
1. Enter YouTube channel URLs or names
2. AI analyzes content patterns and performance
3. Get comprehensive report with actionable insights
4. Use findings to create better content

**Analysis Includes:**
- Video performance patterns
- Content themes and topics
- Audience engagement data
- Posting frequency insights
- Title and thumbnail patterns

Ready to uncover hidden opportunities in your niche?`,
      type: 'text',
      confidence: 0.9,
      actions: [
        { label: 'Analyze Competitors', action: 'navigate:channelAnalysis', icon: 'SearchCircleIcon' },
        { label: 'View Stats Tool', action: 'navigate:youtubeStats', icon: 'ChartBarIcon' }
      ]
    };
  }

  private handleYTStatsQuestions(question: string, userContext?: UserContext): AIResponse {
    const lowerQ = question.toLowerCase();

    if (lowerQ.includes('engagement') || lowerQ.includes('metrics')) {
      return {
        content: `📊 **YouTube Statistics & Performance Metrics:**

**How to Check Any Channel's Stats:**
1. **Go to YT Stats tab**
2. **Enter channel information:**
   - Channel name (e.g., "MrBeast")
   - @handle (e.g., "@mrbeast")
   - Full YouTube URL
3. **View comprehensive metrics** instantly

**Key Metrics Explained:**

📈 **Subscriber Metrics:**
- Total subscriber count
- Estimated growth rate
- Subscriber-to-view ratio
- Channel creation date and age

🎯 **Engagement Analysis:**
- **Engagement Rate**: Likes + Comments ÷ Views
  - 1-3% = Average performance
  - 3-6% = Good engagement
  - 6%+ = Excellent engagement
- **Like-to-View Ratio**: Indicates content quality
- **Viral Score**: Algorithm-friendliness rating

📊 **Performance Indicators:**
- Average views per video
- Total channel views
- Video upload consistency
- Content performance trends

🔍 **What Good Stats Look Like:**
✅ **Healthy Channel Indicators:**
- Consistent upload schedule
- Engagement rate above 3%
- Growing subscriber count
- Strong like-to-view ratio (2%+)

⚠️ **Warning Signs:**
- Declining engagement rates
- Irregular posting patterns
- High subscriber count but low views
- Poor like-to-dislike ratios

**Using Stats for Strategy:**
• **Benchmark against competitors** in your niche
• **Track your own growth** over time
• **Identify successful channels** to study
• **Set realistic goals** based on similar channels
• **Spot trends** in your market

**Pro Tips:**
• Check stats monthly for trend analysis
• Compare multiple channels in your niche
• Use data to inform content strategy
• Track engagement rates over subscriber counts

Ready to dive into the numbers?`,
        type: 'analysis',
        confidence: 0.97,
        actions: [
          { label: 'Check Channel Stats', action: 'navigate:youtubeStats', icon: 'ChartBarIcon' },
          { label: 'Analyze Competitors', action: 'navigate:channelAnalysis', icon: 'SearchCircleIcon' }
        ]
      };
    }

    return {
      content: `📊 **YouTube Statistics Tool**

Get comprehensive analytics for any public YouTube channel instantly.

**What You Can Track:**
📈 **Growth Metrics**
- Subscriber count and growth rate
- Total views and average per video
- Channel age and posting frequency

🎯 **Engagement Data**
- Engagement rates (likes, comments, shares)
- Like-to-view ratios
- Viral performance scores
- Content quality indicators

📊 **Performance Analysis**
- Upload consistency patterns
- Content performance trends
- Audience engagement levels
- Algorithm optimization scores

**Perfect For:**
• **Competitor Analysis** - See how you stack up
• **Self-Monitoring** - Track your own progress
• **Market Research** - Understand your niche
• **Goal Setting** - Set realistic targets

**How It Works:**
Simply enter any YouTube channel name, @handle, or URL to get instant comprehensive statistics and performance insights.

**Real-Time Data:**
All statistics are pulled directly from YouTube's public data and calculated using advanced engagement algorithms.`,
      type: 'text',
      confidence: 0.9,
      actions: [
        { label: 'View Channel Stats', action: 'navigate:youtubeStats', icon: 'ChartBarIcon' },
        { label: 'Compare Channels', action: 'navigate:channelAnalysis', icon: 'SearchCircleIcon' }
      ]
    };
  }

  private handleHistoryQuestions(question: string, userContext?: UserContext): AIResponse {
    const lowerQ = question.toLowerCase();

    if (lowerQ.includes('find') || lowerQ.includes('search') || lowerQ.includes('previous')) {
      return {
        content: `📚 **Finding and Managing Your Content History:**

**How to Find Previous Content:**
1. **Go to History tab**
2. **Use search and filters:**
   - **Search by keywords** - Find content by topic
   - **Filter by content type** - Scripts, titles, thumbnails, etc.
   - **Filter by platform** - YouTube, TikTok, Instagram, etc.
   - **Filter by date range** - Last week, month, or custom range
3. **Browse by recency** - Most recent content appears first

**Search Tips:**
🔍 **Effective Search Strategies:**
- Use specific keywords from your content
- Search by target audience (e.g., "beginners")
- Look for content themes (e.g., "tutorial", "review")
- Filter by tool used (Generator, Canvas, etc.)

⭐ **Favorites System:**
- Star your best-performing content
- Quick access to proven content
- Build a library of successful patterns

**Content Management:**
📁 **Organization Features:**
- **Automatic categorization** by content type
- **Platform-specific views** for each social media
- **Performance tracking** where available
- **Tagging system** for easy retrieval

🔄 **Reuse and Refinement:**
- **Edit previous content** with refinement tools
- **Repurpose for different platforms**
- **Use as templates** for new content
- **Build on successful themes**

**Power User Tips:**
• Create consistent naming conventions in prompts
• Use descriptive keywords for better searchability
• Regularly favorite high-performing content
• Export collections for backup or team sharing
• Review history monthly to identify patterns

**Content Lifecycle:**
1. **Generate** content in any tool
2. **Automatically saved** to History
3. **Search and find** when needed
4. **Refine or repurpose** for new use
5. **Track performance** and success patterns

Never lose your best content ideas again!`,
        type: 'workflow',
        confidence: 0.96,
        actions: [
          { label: 'Browse History', action: 'navigate:history', icon: 'ClipboardDocumentListIcon' },
          { label: 'Create New Content', action: 'navigate:generator', icon: 'SparklesIcon' }
        ]
      };
    }

    return {
      content: `📚 **Content History & Library Management**

Your comprehensive content archive with powerful search and organization tools.

**What's Stored:**
🎬 **All Generated Content:**
- Scripts, titles, hooks, and ideas
- Thumbnail concepts and designs
- Strategy plans and content calendars
- Canvas designs and mind maps
- Research findings and trend insights

📊 **Content Analytics:**
- Generation timestamps and details
- Content performance tracking
- Usage patterns and favorites
- Success rate indicators

**Key Features:**
🔍 **Advanced Search**
- Keyword-based content discovery
- Filter by type, platform, date
- Smart categorization system

⭐ **Favorites System**
- Mark your best content
- Quick access to proven winners
- Build success pattern libraries

🔄 **Content Reuse**
- Edit and refine previous content
- Repurpose for different platforms
- Use successful content as templates

📤 **Export Options**
- Download individual items
- Export content collections
- Share with team members
- Backup your content library

**Best Practices:**
• Regularly review and organize content
• Star high-performing pieces
• Use consistent keywords in prompts
• Build on successful patterns
• Export important content for backup

Your content history is your creative goldmine!`,
      type: 'text',
      confidence: 0.92,
      actions: [
        { label: 'Explore History', action: 'navigate:history', icon: 'ClipboardDocumentListIcon' },
        { label: 'Search Content', action: 'navigate:history', icon: 'GlobeAltIcon' }
      ]
    };
  }

  private handleSearchQuestions(question: string, userContext?: UserContext): AIResponse {
    const lowerQ = question.toLowerCase();

    if (lowerQ.includes('research') || lowerQ.includes('web search')) {
      return {
        content: `🌐 **AI-Enhanced Web Search & Research:**

**How to Perform Smart Research:**
1. **Go to Web Search tab**
2. **Enter your research query:**
   - Be specific about your topic
   - Include your niche for targeted results
   - Add context like "content ideas" or "trending"
3. **AI analyzes and categorizes results:**
   - News articles and recent developments
   - Forum discussions and community insights
   - Video content and tutorials
   - Topic-specific deep dives
4. **Extract actionable insights** for content creation

**Smart Research Strategies:**

🎯 **Content Research:**
- "Best [topic] tools 2024" - For review content
- "[Niche] trends and predictions" - For trending topics
- "[Topic] beginner mistakes" - For educational content
- "[Industry] case studies" - For data-driven content

💡 **Competitor Research:**
- "[Competitor] strategy analysis"
- "What makes [channel] successful"
- "[Niche] best practices"
- "[Platform] algorithm changes"

📈 **Market Research:**
- "[Topic] market size and growth"
- "[Industry] consumer behavior"
- "[Niche] audience demographics"
- "Emerging trends in [field]"

**What Makes Our Search Different:**

🧠 **AI Enhancement:**
- Query optimization for better results
- Source credibility scoring
- Content categorization and tagging
- Insight extraction and summary

📊 **Research Analysis:**
- **Common Questions** - What people are asking
- **Content Gaps** - Opportunities to fill
- **Trending Subtopics** - Emerging discussions
- **Source Quality** - Credible vs. unreliable sources

**Using Research for Content:**
1. **Identify trending topics** in your niche
2. **Find common questions** to answer
3. **Discover content gaps** to fill
4. **Gather supporting data** for your content
5. **Stay ahead of trends** and news

**Pro Research Tips:**
• Use specific, long-tail queries
• Cross-reference multiple sources
• Look for recent discussions and forums
• Note questions people are asking
• Save valuable research for later reference

**Export & Apply:**
- Export research findings as reports
- Use insights directly in Generator tool
- Apply trends to Strategy planning
- Build content around discoveries

Turn research into viral content opportunities!`,
        type: 'workflow',
        confidence: 0.97,
        actions: [
          { label: 'Start Research', action: 'navigate:search', icon: 'GlobeAltIcon' },
          { label: 'Apply to Content', action: 'navigate:generator', icon: 'SparklesIcon' },
          { label: 'Check Trends', action: 'navigate:trends', icon: 'TrendingUpIcon' }
        ]
      };
    }

    return {
      content: `🌐 **AI-Enhanced Web Search & Research Tool**

Intelligent research that goes beyond basic search to find content opportunities.

**Key Features:**
🧠 **Smart Search Enhancement**
- AI-optimized query expansion
- Source credibility analysis
- Content categorization by type
- Insight extraction and analysis

📊 **Research Categories:**
- **News & Updates** - Latest developments
- **Discussions** - Community conversations
- **Videos** - Visual content and tutorials
- **Topics** - Deep-dive subject matter

🎯 **Content Applications:**
- **Topic Research** - Find trending subjects
- **Competitor Analysis** - Study successful content
- **Market Insights** - Understand audience needs
- **Question Discovery** - Find what people ask

**Research Workflow:**
1. Enter specific research queries
2. AI analyzes and categorizes results
3. Extract actionable insights
4. Apply findings to content strategy
5. Export research for future reference

**Perfect For:**
• **Content Ideation** - Find viral topics
• **Market Research** - Understand trends
• **Competitive Analysis** - Study successful content
• **Audience Insights** - Discover pain points
• **Trend Validation** - Confirm emerging topics

**Pro Tips:**
• Use specific, contextual queries
• Research adjacent topics for cross-pollination
• Look for patterns across multiple sources
• Focus on recent discussions and trends

Transform research into content gold!`,
      type: 'text',
      confidence: 0.9,
      actions: [
        { label: 'Research Topics', action: 'navigate:search', icon: 'GlobeAltIcon' },
        { label: 'Find Trends', action: 'navigate:trends', icon: 'TrendingUpIcon' }
      ]
    };
  }

  private handleStudioHubQuestions(question: string, userContext?: UserContext): AIResponse {
    const lowerQ = question.toLowerCase();

    if (lowerQ.includes('project') || lowerQ.includes('manage')) {
      return {
        content: `🏠 **Studio Hub - Your Content Creation Command Center:**

**Project Management Features:**

📋 **Project Pipeline:**
- **Create New Projects** with templates or from scratch
- **Track Progress** with visual status indicators
- **Set Deadlines** and milestones
- **Organize by Status:** Planning → In Progress → Review → Completed

🚀 **Quick Launch Bar:**
- **One-click access** to all 11 tools
- **Recent activity** and quick actions
- **Smart recommendations** based on your workflow
- **Keyboard shortcuts** (Cmd/Ctrl+K for global search)

📊 **Activity Feed:**
- **Recent generations** and content created
- **AI insights** and performance recommendations
- **Tool usage statistics** and optimization tips
- **Success patterns** and trending opportunities

**Project Templates:**
🎬 **YouTube Video Project:**
- Pre-configured with Generator, Thumbnails, Analytics
- Workflow: Research → Script → Thumbnail → Schedule → Track

📱 **Social Media Campaign:**
- Multi-platform content planning
- Cross-platform optimization tools
- Consistent branding workflow

📚 **Content Series:**
- Episode planning and tracking
- Series-wide strategy coordination
- Progress monitoring across episodes

**Workspace Actions:**
⚡ **Automation Setup:**
- **Content Workflows** - Streamline repetitive tasks
- **Publishing Schedules** - Automated calendar integration
- **Performance Tracking** - Automated insights and reports
- **Team Collaboration** - Shared projects and permissions

📈 **Analytics Dashboard:**
- **Project Performance** - Success rates and completion times
- **Tool Efficiency** - Which tools drive best results
- **Content ROI** - Performance vs. effort analysis
- **Growth Tracking** - Audience and engagement trends

**Navigation & Organization:**
🗂️ **Smart Organization:**
- **Filter projects** by status, type, or date
- **Search functionality** across all projects
- **Tags and categories** for custom organization
- **Archive completed** projects for reference

⌨️ **Keyboard Shortcuts:**
- **Cmd/Ctrl+K** - Global search and quick navigation
- **Cmd/Ctrl+N** - New project
- **Cmd/Ctrl+T** - Switch between tools
- **Cmd/Ctrl+H** - Return to Hub

**Best Practices:**
• Start every content initiative as a project
• Use templates to ensure consistent workflows
• Set realistic deadlines and track progress
• Review analytics monthly for optimization
• Archive completed projects for future reference

**Pro Tips:**
• Use the Activity Feed for daily workflow planning
• Set up automation for repetitive tasks
• Track which tools and workflows perform best
• Use insights to optimize your content strategy

Your command center for content creation success!`,
        type: 'workflow',
        confidence: 0.98,
        actions: [
          { label: 'Create New Project', action: 'navigate:studioHub', icon: 'RocketLaunchIcon' },
          { label: 'View Analytics', action: 'navigate:studioHub', icon: 'ChartBarIcon' },
          { label: 'Quick Launch Tool', action: 'openCommandPalette', icon: 'CompassIcon' }
        ]
      };
    }

    return {
      content: `🏠 **Studio Hub - Central Command for Content Creation**

Your workspace dashboard for managing all content creation projects and accessing tools efficiently.

**Key Features:**
📋 **Project Management**
- Create and track content projects
- Template-based project setup
- Progress monitoring and deadlines
- Status tracking from planning to completion

🚀 **Quick Launch**
- One-click access to all 11 tools
- Recent activity and smart suggestions
- Global search (Cmd/Ctrl+K)
- Tool usage statistics

📊 **Activity & Insights**
- Recent content generation history
- AI-powered recommendations
- Performance insights and trends
- Workflow optimization suggestions

⚡ **Automation Hub**
- Streamlined content workflows
- Publishing schedule integration
- Performance tracking automation
- Team collaboration features

**Project Templates:**
• **YouTube Video** - Complete video creation workflow
• **Social Campaign** - Multi-platform content planning
• **Content Series** - Episode planning and tracking
• **Brand Strategy** - Comprehensive brand development

**Navigation Features:**
🎹 **Keyboard Shortcuts**
- Cmd/Ctrl+K for global search
- Quick tool switching
- Project creation shortcuts

📱 **Responsive Design**
- Works seamlessly on all devices
- Mobile-optimized interface
- Touch-friendly interactions

**Perfect For:**
• Managing multiple content projects
• Tracking progress and deadlines
• Accessing tools efficiently
• Monitoring content performance
• Team collaboration and workflow optimization

Your creative command center awaits!`,
      type: 'text',
      confidence: 0.92,
      actions: [
        { label: 'Explore Studio Hub', action: 'navigate:studioHub', icon: 'RocketLaunchIcon' },
        { label: 'Open Command Palette', action: 'openCommandPalette', icon: 'CompassIcon' }
      ]
    };
  }

  private handleCalendarQuestions(question: string, userContext?: UserContext): AIResponse {
    const lowerQ = question.toLowerCase();

    if (lowerQ.includes('schedule') || lowerQ.includes('plan')) {
      return {
        content: `📅 **Content Calendar - Master Your Publishing Schedule:**

**Setting Up Your Content Calendar:**

📋 **Step-by-Step Setup:**
1. **Go to Calendar tab**
2. **Import from Strategy** (recommended):
   - Create strategy in Strategy tab first
   - Import optimal posting schedule automatically
   - Get pre-planned content types and timing
3. **Or create manually:**
   - Click on any date to add events
   - Set content type, platform, topic, status
   - Add preparation deadlines and reminders

📊 **Calendar Features:**

🗓️ **Multiple Views:**
- **Monthly View** - See entire month's content plan
- **Weekly View** - Detailed week planning
- **Daily View** - Focus on specific dates
- **Agenda View** - List format for easy scanning

🎯 **Content Planning:**
- **Content Types** - Videos, posts, stories, etc.
- **Platform Targeting** - YouTube, TikTok, Instagram, etc.
- **Status Tracking** - Planned → In Progress → Completed
- **Deadline Management** - Creation vs. publish dates

**Smart Scheduling Strategies:**

⏰ **Optimal Timing:**
- **YouTube**: Tuesday, Thursday, Saturday (2-4 PM)
- **TikTok**: Tuesday-Thursday (6-10 AM, 7-9 PM)
- **Instagram**: Monday-Wednesday (11 AM-1 PM)
- **LinkedIn**: Tuesday-Thursday (8-10 AM)

📈 **Content Frequency:**
- **YouTube**: 1-3 videos per week
- **TikTok**: 3-5 posts per week
- **Instagram**: 4-7 posts per week
- **LinkedIn**: 3-5 posts per week

🎨 **Content Balance:**
- **Educational**: 40% (tutorials, how-tos)
- **Entertainment**: 30% (fun, engaging content)
- **Personal/Behind-scenes**: 20% (connection building)
- **Promotional**: 10% (products, services)

**Advanced Calendar Management:**

🔄 **Batch Planning:**
- **Theme Weeks** - Focus on specific topics
- **Series Planning** - Multi-part content coordination
- **Seasonal Content** - Holiday and event planning
- **Trend Integration** - Viral opportunity scheduling

📱 **Integration Features:**
- **Export to Google Calendar** for personal sync
- **Team Sharing** for collaboration
- **Reminder Systems** for deadline management
- **Performance Tracking** for optimization

⚡ **Automation Options:**
- **Recurring Events** - Weekly/monthly content
- **Template Events** - Reusable content formats
- **Bulk Operations** - Mass scheduling and editing
- **Smart Suggestions** - AI-recommended timing

**Content Creation Workflow:**
1. **Strategy Planning** (Strategy tab)
2. **Calendar Setup** (import strategy schedule)
3. **Content Creation** (Generator, Canvas, Thumbnails)
4. **Performance Tracking** (YT Stats, Analytics)
5. **Strategy Refinement** (based on results)

**Pro Tips:**
• Plan content 2-4 weeks in advance
• Leave buffer time for trending topics
• Batch similar content creation tasks
• Track performance to optimize timing
• Use color coding for different content types
• Set reminders for complex content preparation

**Crisis Management:**
• Keep 2-3 backup content pieces ready
• Have "evergreen" content for slow news days
• Plan flexible slots for trending opportunities
• Create rapid-response content templates

Turn chaos into consistent content success!`,
        type: 'workflow',
        confidence: 0.98,
        actions: [
          { label: 'Setup Calendar', action: 'navigate:calendar', icon: 'CalendarIcon' },
          { label: 'Import Strategy', action: 'navigate:strategy', icon: 'CompassIcon' },
          { label: 'Create Content', action: 'navigate:generator', icon: 'SparklesIcon' }
        ],
        workflowSteps: [
          { step: 1, action: 'Create content strategy first', details: 'Use Strategy tab to plan optimal posting schedule' },
          { step: 2, action: 'Import schedule to Calendar', details: 'Automatically populate calendar with strategic timing' },
          { step: 3, action: 'Add specific content events', details: 'Plan individual pieces with deadlines and topics' },
          { step: 4, action: 'Set creation reminders', details: 'Plan preparation time before publish dates' },
          { step: 5, action: 'Track and optimize', details: 'Monitor performance and adjust schedule accordingly' }
        ]
      };
    }

    return {
      content: `📅 **Content Calendar - Strategic Publishing Planner**

Organize and schedule your content creation with visual calendar interface and strategic timing optimization.

**Core Features:**
🗓️ **Visual Planning**
- Monthly, weekly, and daily views
- Drag-and-drop event management
- Color-coded content types
- Status tracking and progress monitoring

📊 **Strategic Scheduling**
- Import optimal timing from Strategy tool
- Platform-specific scheduling recommendations
- Audience behavior-based timing
- Content balance and frequency optimization

🎯 **Content Management**
- Event creation with detailed planning
- Deadline and reminder systems
- Content type categorization
- Multi-platform coordination

⚡ **Workflow Integration**
- Strategy tool import functionality
- Generator tool content planning
- Performance tracking integration
- Team collaboration features

**Perfect For:**
• **Consistent Publishing** - Never miss a post
• **Strategic Timing** - Post when audience is active
• **Content Balance** - Maintain variety and engagement
• **Team Coordination** - Shared planning and deadlines
• **Performance Optimization** - Data-driven scheduling

**Key Benefits:**
✅ Never run out of content ideas
✅ Optimal timing for maximum reach
✅ Balanced content mix for engagement
✅ Deadline management for quality
✅ Team collaboration and coordination

**Best Practices:**
• Plan 2-4 weeks ahead for consistency
• Use Strategy tool insights for optimal timing
• Balance content types for audience engagement
• Set creation deadlines before publish dates
• Regular review and optimization based on performance

Ready to transform your content chaos into strategic success?`,
      type: 'text',
      confidence: 0.9,
      actions: [
        { label: 'Plan Content Calendar', action: 'navigate:calendar', icon: 'CalendarIcon' },
        { label: 'Create Strategy First', action: 'navigate:strategy', icon: 'CompassIcon' }
      ]
    };
  }

  private generatePersonalizedSuggestions(userContext?: UserContext): Array<{
    title: string;
    description: string;
    reason: string;
    actionLabel: string;
    action: string;
    icon: string;
    priority: 'high' | 'medium' | 'low';
  }> {
    // Implementation of personalized suggestions
    return [
      {
        title: 'Boost Your Engagement',
        description: 'Create more engaging content with proven formulas',
        reason: 'Your current content could benefit from engagement optimization',
        actionLabel: 'Analyze Performance',
        action: 'navigate:youtubeStats',
        icon: 'ChartBarIcon',
        priority: 'high'
      }
    ];
  }

  private getActionLabel(action: string): string {
    const actionLabels: Record<string, string> = {
      'navigate:generator': 'Open Generator',
      'navigate:canvas': 'Open Canvas',
      'navigate:thumbnailMaker': 'Create Thumbnails',
      'navigate:strategy': 'Plan Strategy',
      'navigate:calendar': 'Schedule Content',
      'navigate:trends': 'Check Trends',
      'navigate:youtubeStats': 'View Analytics',
      'navigate:channelAnalysis': 'Analyze Channels',
      'navigate:history': 'View History',
      'navigate:search': 'Web Search',
      'navigate:studioHub': 'Studio Hub'
    };
    return actionLabels[action] || 'Take Action';
  }

  private getActionIcon(action: string): string {
    const actionIcons: Record<string, string> = {
      'navigate:generator': 'SparklesIcon',
      'navigate:canvas': 'ColumnsIcon',
      'navigate:thumbnailMaker': 'PhotoIcon',
      'navigate:strategy': 'CompassIcon',
      'navigate:calendar': 'CalendarIcon',
      'navigate:trends': 'TrendingUpIcon',
      'navigate:youtubeStats': 'ChartBarIcon',
      'navigate:channelAnalysis': 'SearchCircleIcon',
      'navigate:history': 'ClipboardDocumentListIcon',
      'navigate:search': 'GlobeAltIcon',
      'navigate:studioHub': 'RocketLaunchIcon'
    };
    return actionIcons[action] || 'ArrowRightIcon';
  }

  // Main public method with comprehensive question matching
  async askQuestion(question: string, userContext?: UserContext): Promise<AIResponse> {
    try {
      const sanitizedQuestion = question.trim().substring(0, 2000);

      // First try comprehensive question matching
      const questionPattern = comprehensiveQuestionMatcher.findBestMatch(sanitizedQuestion, userContext);

      if (questionPattern) {
        // Use pattern-based response with dynamic content
        const dynamicResponse = comprehensiveQuestionMatcher.generateDynamicResponse(questionPattern, userContext);
        const followUps = comprehensiveQuestionMatcher.getContextualFollowUps(questionPattern, userContext);

        return {
          content: dynamicResponse,
          type: this.mapCategoryToResponseType(questionPattern.category),
          confidence: 0.95,
          actions: followUps.slice(0, 3).map(followUp => ({
            label: followUp,
            action: followUp.includes('navigate:') ? followUp : `ask:${followUp}`,
            icon: this.getIconForCategory(questionPattern.category)
          })),
          workflowSteps: questionPattern.category === 'generator' || questionPattern.category === 'canvas'
            ? this.extractWorkflowSteps(dynamicResponse) : undefined
        };
      }

      // Fallback to original categorization and response generation
      const category = this.categorizeQuestion(sanitizedQuestion, userContext);
      return await this.generateIntelligentResponse(sanitizedQuestion, category, userContext);

    } catch (error) {
      console.error('Enhanced AI Assistant error:', error);

      return {
        content: `I apologize for the brief interruption! I'm back and ready to help with comprehensive CreateGen Studio guidance.

**I have expert knowledge of:**
• **Generator** - Scripts, titles, hooks, 25+ content types with specific workflows
• **Canvas** - Visual design, mind maps, collaboration with step-by-step guidance
• **Strategy** - Content planning, pillars, optimization with proven frameworks
• **Trends** - Viral opportunity identification with actionable insights
• **YouTube Tools** - Channel analysis and performance statistics with expert interpretation
• **Troubleshooting** - Intelligent problem diagnosis with personalized solutions

**Recent comprehensive additions:**
• 1000+ question patterns covering every possible scenario
• Context-aware responses based on your usage patterns
• Intelligent follow-up suggestions
• Real-time conversation memory for personalized help

What specific aspect of content creation can I help you master today?`,
        type: 'text',
        confidence: 0.8,
        actions: [
          { label: 'Master Content Generation', action: 'navigate:generator', icon: 'SparklesIcon' },
          { label: 'Build Strategic Plans', action: 'navigate:strategy', icon: 'CompassIcon' },
          { label: 'Analyze Performance', action: 'navigate:youtubeStats', icon: 'ChartBarIcon' }
        ]
      };
    }
  }

  // Helper method to map categories to response types
  private mapCategoryToResponseType(category: string): AIResponse['type'] {
    const categoryMap: Record<string, AIResponse['type']> = {
      'generator': 'workflow',
      'canvas': 'workflow',
      'strategy': 'analysis',
      'troubleshooting': 'troubleshooting',
      'optimization': 'analysis',
      'integration': 'workflow'
    };
    return categoryMap[category] || 'text';
  }

  // Helper method to get appropriate icon for category
  private getIconForCategory(category: string): string {
    const iconMap: Record<string, string> = {
      'generator': 'SparklesIcon',
      'canvas': 'ColumnsIcon',
      'strategy': 'CompassIcon',
      'troubleshooting': 'CogIcon',
      'optimization': 'ChartBarIcon',
      'integration': 'ArrowRightIcon'
    };
    return iconMap[category] || 'QuestionMarkCircleIcon';
  }

  // Helper method to extract workflow steps from response content
  private extractWorkflowSteps(content: string): Array<{step: number, action: string, details: string}> | undefined {
    const stepMatches = content.match(/\*\*(\d+)\.\s*([^*]+)\*\*\s*([^*\n]+)/g);
    if (!stepMatches) return undefined;

    return stepMatches.map((match, index) => {
      const stepMatch = match.match(/\*\*(\d+)\.\s*([^*]+)\*\*\s*([^*\n]+)/);
      if (stepMatch) {
        return {
          step: parseInt(stepMatch[1]),
          action: stepMatch[2].trim(),
          details: stepMatch[3].trim()
        };
      }
      return {
        step: index + 1,
        action: 'Follow step',
        details: match.replace(/\*\*/g, '').trim()
      };
    });
  }

  // Quick helper methods
  async getContentIdeas(topic: string, userContext?: UserContext): Promise<AIResponse> {
    return this.askQuestion(`I need creative content ideas for ${topic}`, userContext);
  }

  async analyzePerformance(userContext: UserContext): Promise<AIResponse> {
    return this.askQuestion("Analyze my content performance and give me specific insights", userContext);
  }

  async getToolGuidance(toolName: string): Promise<AIResponse> {
    return this.askQuestion(`How do I use the ${toolName} tool? Give me step-by-step instructions.`);
  }

  async optimizeWorkflow(userContext: UserContext): Promise<AIResponse> {
    return this.askQuestion("How can I optimize my content creation workflow for maximum efficiency?", userContext);
  }
}

export const enhancedAIStudioAssistantService = new EnhancedAIStudioAssistantService();
export default enhancedAIStudioAssistantService;
