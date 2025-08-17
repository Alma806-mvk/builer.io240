/**
 * Ultra-Comprehensive Question Database
 * Covers every possible question a user might ask about CreateGen Studio
 */

export interface QuestionPattern {
  patterns: string[];
  category: string;
  subCategory: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  responseTemplate: string;
  dynamicElements?: string[];
  followUpSuggestions?: string[];
  relatedTopics?: string[];
}

export interface DynamicResponse {
  template: string;
  variables: Record<string, string | string[]>;
  conditions?: Record<string, any>;
}

// Ultra-comprehensive question patterns covering every possible scenario
export const COMPREHENSIVE_QUESTION_DATABASE: QuestionPattern[] = [
  // GENERATOR QUESTIONS - Every possible scenario
  {
    patterns: [
      "how do i create", "how to create", "help me create", "i want to create", "can you help me create",
      "how can i make", "how to make", "help me make", "i need to make", "show me how to create"
    ],
    category: "generator",
    subCategory: "creation_basics",
    difficulty: "beginner",
    responseTemplate: "🎬 **Creating Content with Generator - Complete Guide:**\n\n**What You Can Create:**\n• **Scripts** (video, podcast, live streams)\n• **Titles & Headlines** (viral, SEO-optimized)\n• **Video Hooks** (attention-grabbing openers)\n• **Content Ideas** (specific, actionable concepts)\n• **Social Captions** (platform-optimized)\n• **And 20+ more content types**\n\n**Step-by-Step Process:**\n1. **Choose Platform** - Select YouTube, TikTok, Instagram, etc.\n2. **Pick Content Type** - Choose from 25+ options in dropdown\n3. **Enter Your Topic** - Be specific for better results\n4. **Configure Settings:**\n   - AI Persona (Professional, Casual, Creative)\n   - Target Audience (be specific)\n   - Video Length (for scripts)\n   - Batch Variations (1-50 options)\n5. **Generate & Refine** - Click Generate, then use refinement tools\n\n**Pro Tips for Better Results:**\n• Be specific: \"YouTube script for tech review\" vs \"create content\"\n• Include your niche: \"fitness for busy moms\"\n• Mention target audience: \"beginner photographers\"\n• Use batch generation for A/B testing\n• Try different AI personas for variety\n\nWhat specific type of content would you like to create?",
    followUpSuggestions: [
      "Show me how to create viral YouTube titles",
      "I want to generate video scripts",
      "Help me create social media captions"
    ],
    relatedTopics: ["thumbnails", "strategy", "trends"]
  },
  
  {
    patterns: [
      "not relevant", "wrong results", "bad results", "not good", "not what i wanted",
      "doesn't match", "not related", "poor quality", "not helpful", "bad content"
    ],
    category: "generator",
    subCategory: "quality_issues",
    difficulty: "intermediate",
    responseTemplate: "🎯 **Improving Generation Quality - Expert Tips:**\n\n**Why Results Might Not Match:**\n• Prompt too vague or generic\n• Wrong AI persona selected\n• Target audience not specified\n• Platform not optimized\n• Content type doesn't match goal\n\n**Immediate Fixes:**\n\n**1. Improve Your Prompt:**\n❌ Bad: \"Create content about fitness\"\n✅ Good: \"Create YouTube video script about home workouts for busy moms, 5-7 minutes, motivational tone\"\n\n**2. Choose Right AI Persona:**\n• **Professional** - Business, educational, authoritative\n• **Casual** - Social media, friendly, conversational\n• **Creative** - Artistic, innovative, unique angles\n• **Expert** - Technical, detailed, industry-specific\n\n**3. Specify Your Audience:**\nInstead of \"general audience\" use:\n• \"Beginner photographers\"\n• \"Small business owners\"\n• \"Fitness enthusiasts over 40\"\n\n**4. Platform Optimization:**\n• YouTube: Longer, detailed content\n• TikTok: Short, punchy, trend-focused\n• LinkedIn: Professional, value-driven\n• Instagram: Visual, lifestyle-oriented\n\n**5. Use Refinement Tools:**\nAfter generation, use buttons to:\n• Make content shorter/longer\n• Adjust tone (more/less formal)\n• Add specific elements\n• Optimize for engagement\n\n**Advanced Techniques:**\n• Add context: \"My channel focuses on...\"\n• Include style references: \"Like MrBeast but for cooking\"\n• Specify call-to-action: \"Drive to my course\"\n• Mention constraints: \"Family-friendly content only\"\n\nWant me to help you craft the perfect prompt for your specific needs?",
    followUpSuggestions: [
      "Help me write better prompts",
      "Show me AI persona examples",
      "How do I optimize for my specific platform?"
    ]
  },

  {
    patterns: [
      "batch generation", "multiple versions", "variations", "a/b test", "multiple options",
      "many versions", "different variations", "test different", "create many"
    ],
    category: "generator",
    subCategory: "batch_generation",
    difficulty: "intermediate",
    responseTemplate: "🔄 **Batch Generation Master Guide:**\n\n**What is Batch Generation?**\nCreate 2-50 variations of the same content type with one click for A/B testing and optimization.\n\n**How to Use Batch Generation:**\n1. **Enter your prompt** as normal\n2. **Set batch variations** to 5-15 (start small)\n3. **Configure settings** (persona, audience, etc.)\n4. **Click Generate** - wait for all variations\n5. **Review results** - pick the best ones\n6. **Save favorites** to History for later use\n\n**Strategic Batch Generation:**\n\n**For Titles (10-15 variations):**\n• Mix emotional angles (fear, excitement, curiosity)\n• Test different numbers (\"5 Ways\" vs \"Ultimate Guide\")\n• Vary urgency levels (\"Now\" vs \"This Year\")\n• Try different hooks (question vs statement)\n\n**For Scripts (3-5 variations):**\n• Different opening hooks\n• Varied content structure\n• Alternative examples/stories\n• Different call-to-actions\n\n**For Social Captions (8-12 variations):**\n• Different hashtag sets\n• Varying caption lengths\n• Different call-to-actions\n• Various emoji combinations\n\n**A/B Testing Strategy:**\n1. **Generate 10-15 variations**\n2. **Pre-filter to top 3-5**\n3. **Test with small audience first**\n4. **Analyze performance metrics**\n5. **Use winning patterns** for future content\n\n**Pro Tips:**\n• Start with 5-10 variations to avoid overwhelm\n• Premium users get up to 50 variations\n• Save successful patterns for reuse\n• Test different emotional triggers\n• Compare performance over time\n\n**Performance Tracking:**\n• Save best performers to Favorites\n• Note patterns in successful variations\n• Apply learnings to future batches\n• Track which personas work best\n\nReady to create your first batch generation test?",
    followUpSuggestions: [
      "Show me A/B testing best practices",
      "How do I analyze batch results?",
      "Help me create title variations"
    ]
  },

  // CANVAS QUESTIONS - Comprehensive coverage
  {
    patterns: [
      "mind map", "mindmap", "mind mapping", "create mind map", "how to mind map",
      "brainstorm visually", "visual brainstorming", "map ideas", "organize thoughts"
    ],
    category: "canvas",
    subCategory: "mind_mapping",
    difficulty: "beginner",
    responseTemplate: "🧠 **Mind Mapping Mastery in Canvas:**\n\n**Method 1: Import from Strategy (Recommended)**\n1. **Create strategy first** - Go to Strategy tab\n2. **Generate content strategy** with pillars and themes\n3. **Open Canvas tab**\n4. **Click \"Import from Strategy\"** (if available)\n5. **Auto-generates mind map** from your content plan\n\n**Method 2: Manual Creation**\n1. **Start with central topic** - Add text element in center\n2. **Add main branches** - Create 3-5 primary categories\n3. **Connect with lines** - Use Connector tool to link elements\n4. **Add sub-branches** - Break down each category\n5. **Color code** - Use different colors for different types\n6. **Add icons/images** - Make it more visual\n\n**Mind Map Best Practices:**\n\n**🎨 Visual Hierarchy:**\n• **Center topic** - Largest, bold, bright color\n• **Main branches** - Medium size, distinct colors\n• **Sub-branches** - Smaller, related colors\n• **Details** - Smallest text, subtle colors\n\n**🔗 Connection Patterns:**\n• **Radial** - Center to edge (most common)\n• **Hierarchical** - Top-down organization\n• **Network** - Interconnected ideas\n• **Flow** - Sequential processes\n\n**📝 Content Organization:**\n• Keep text concise (2-4 words per node)\n• Use keywords, not full sentences\n• Group related concepts with colors\n• Add symbols for different content types\n\n**🎯 Mind Map Types:**\n\n**Content Strategy Map:**\n• Center: Your niche/brand\n• Branches: Content pillars (3-5)\n• Sub-branches: Content ideas, topics\n• Details: Specific video/post ideas\n\n**Project Planning Map:**\n• Center: Project name\n• Branches: Phases/milestones\n• Sub-branches: Tasks and deliverables\n• Details: Resources needed\n\n**Learning/Research Map:**\n• Center: Main topic\n• Branches: Key concepts\n• Sub-branches: Supporting details\n• Details: Examples and applications\n\n**Advanced Features:**\n• **Sticky notes** for quick ideas\n• **Images** for visual memory\n• **Frames** to group sections\n• **Export** as PNG for sharing\n• **Collaboration** with team members\n\n**Export Options:**\n• High-resolution PNG for presentations\n• Save as Canvas project for editing\n• Share link for team collaboration\n\nReady to create your first strategic mind map?",
    followUpSuggestions: [
      "Help me create a content strategy mind map",
      "Show me advanced Canvas features",
      "How do I collaborate on Canvas projects?"
    ]
  },

  // STRATEGY QUESTIONS - Every angle covered
  {
    patterns: [
      "content strategy", "content plan", "strategic plan", "content planning",
      "strategy for", "plan for", "strategic approach", "content framework"
    ],
    category: "strategy",
    subCategory: "planning",
    difficulty: "intermediate",
    responseTemplate: "🎯 **Comprehensive Content Strategy Creation:**\n\n**Strategic Planning Process:**\n\n**Phase 1: Foundation Setting**\n1. **Define Your Niche** (be ultra-specific)\n   • Bad: \"Fitness\"\n   • Good: \"Home workouts for busy working moms\"\n2. **Identify Target Audience**\n   • Demographics (age, location, income)\n   • Psychographics (values, interests, pain points)\n   • Behavior patterns (when/how they consume content)\n3. **Set SMART Goals**\n   • Specific: \"Gain 10K YouTube subscribers\"\n   • Measurable: Track weekly growth\n   • Achievable: Based on current metrics\n   • Relevant: Align with business goals\n   • Time-bound: \"In 6 months\"\n\n**Phase 2: Content Architecture**\n\n**Content Pillars (3-4 strategic themes):**\n• **Pillar 1: Educational** (40% of content)\n  - How-to tutorials\n  - Tips and tricks\n  - Problem-solving content\n• **Pillar 2: Inspirational** (30% of content)\n  - Success stories\n  - Motivational content\n  - Behind-the-scenes\n• **Pillar 3: Entertainment** (20% of content)\n  - Fun challenges\n  - Trending topics\n  - Community engagement\n• **Pillar 4: Promotional** (10% of content)\n  - Product features\n  - Services overview\n  - Call-to-actions\n\n**Phase 3: Platform Strategy**\n\n**YouTube Strategy:**\n• Long-form content (8-15 minutes)\n• SEO-optimized titles and descriptions\n• Consistent upload schedule\n• Playlist organization\n• Community engagement\n\n**TikTok/Instagram Reels:**\n• Short-form content (15-60 seconds)\n• Trend-based content\n• Quick tips and tricks\n• Behind-the-scenes moments\n• User-generated content\n\n**LinkedIn Strategy:**\n• Professional insights\n• Industry news commentary\n• Career development tips\n• Business case studies\n• Thought leadership\n\n**Phase 4: Content Calendar Framework**\n\n**Weekly Content Schedule:**\n• **Monday**: Motivational Monday (Inspiration)\n• **Tuesday**: Tutorial Tuesday (Education)\n• **Wednesday**: Behind-the-scenes (Personal)\n• **Thursday**: Tips Thursday (Education)\n• **Friday**: Fun Friday (Entertainment)\n• **Weekend**: Community engagement\n\n**Monthly Content Themes:**\n• **Week 1**: Foundation topics\n• **Week 2**: Advanced techniques\n�� **Week 3**: Case studies/examples\n• **Week 4**: Community challenges\n\n**Phase 5: Optimization Strategy**\n\n**SEO Strategy:**\n• Primary keywords for each pillar\n• Long-tail keyword opportunities\n• Hashtag research and rotation\n• Cross-platform keyword consistency\n\n**Engagement Strategy:**\n• Response time goals (under 2 hours)\n• Community building tactics\n• User-generated content campaigns\n• Collaboration opportunities\n\n**Performance Tracking:**\n• Weekly analytics review\n• Monthly strategy adjustments\n• Quarterly goal assessment\n• Annual strategy overhaul\n\n**Content Repurposing Matrix:**\n• 1 Long-form video → 5 short clips\n• 1 Blog post → 10 social posts\n• 1 Tutorial → 3 quote cards\n• 1 Case study → 1 infographic\n\nReady to build your strategic content empire?",
    followUpSuggestions: [
      "Help me define my content pillars",
      "Show me platform-specific strategies",
      "How do I track strategy performance?"
    ]
  },

  // TROUBLESHOOTING - Every possible issue
  {
    patterns: [
      "not working", "doesn't work", "broken", "error", "problem", "issue",
      "help", "stuck", "can't", "won't", "failed", "not loading"
    ],
    category: "troubleshooting",
    subCategory: "general_issues",
    difficulty: "beginner",
    responseTemplate: "🔧 **Intelligent Problem Diagnosis:**\n\nI'm here to help solve any issue you're experiencing! Let me guide you through our smart troubleshooting system.\n\n**Quick Self-Diagnosis (Try These First):**\n\n**1. ⚡ Instant Fixes:**\n• **Refresh the page** (Ctrl+R or Cmd+R)\n• **Clear browser cache** (Ctrl+Shift+Delete)\n• **Try incognito mode** (Ctrl+Shift+N)\n• **Check internet connection**\n\n**2. 🌐 Browser Compatibility:**\n✅ **Recommended**: Chrome, Firefox, Safari (latest)\n❌ **Avoid**: Internet Explorer, outdated browsers\n\n**3. 💾 Account & Limits:**\n• Check if you're logged in\n• Verify subscription status\n• Confirm generation limits (Free: 5/day)\n\n**Tell Me Exactly What's Happening:**\nFor precise help, describe:\n• **What you were trying to do**\n• **What tool you were using**\n• **What error message you saw**\n• **When the problem started**\n• **Your browser and device**\n\n**Common Issues I Can Solve:**\n\n🚀 **Generation Problems:**\n• \"Generation taking too long\"\n• \"Error during content creation\"\n• \"Results not relevant to my prompt\"\n• \"Generation failed or stuck\"\n\n🎨 **Canvas Issues:**\n• \"Elements not moving or responding\"\n• \"Canvas running slowly\"\n• \"Export not working\"\n• \"Collaboration problems\"\n\n📊 **Analytics Issues:**\n• \"YouTube analysis not working\"\n• \"Channel stats not loading\"\n• \"Analysis gets stuck processing\"\n\n🖼️ **Thumbnail Problems:**\n• \"Can't save or export thumbnails\"\n• \"Template not loading\"\n• \"Text not appearing correctly\"\n\n🗓️ **Calendar Issues:**\n• \"Events not saving\"\n• \"Schedule not importing\"\n• \"Calendar not displaying correctly\"\n\n**Advanced Diagnostics Available:**\n• Step-by-step troubleshooting guides\n• Browser compatibility checks\n• Account verification\n• Performance optimization\n• Feature-specific solutions\n\n**Premium Support Benefits:**\n• Priority troubleshooting\n• Direct support channel\n• Advanced diagnostic tools\n• Faster response times\n\nDescribe your specific issue and I'll provide targeted solutions!",
    followUpSuggestions: [
      "My generation is taking too long",
      "Canvas is running slowly",
      "YouTube analysis not working"
    ]
  },

  // ADVANCED USAGE QUESTIONS
  {
    patterns: [
      "optimize", "best practices", "advanced", "professional", "expert level",
      "power user", "maximize", "get better results", "improve performance"
    ],
    category: "optimization",
    subCategory: "advanced_usage",
    difficulty: "advanced",
    responseTemplate: "⚡ **Advanced Optimization Techniques:**\n\n**Power User Strategies:**\n\n**🎯 Advanced Content Generation:**\n\n**Prompt Engineering Mastery:**\n• **Context Stacking**: Provide background + goal + audience + constraints\n• **Style Anchoring**: Reference successful creators in your niche\n• **Constraint Optimization**: Use limitations to drive creativity\n• **Multi-dimensional Prompting**: Combine multiple content angles\n\n**Example Advanced Prompt:**\n\"Create a YouTube script for a 10-minute tech review video about the iPhone 15 Pro, targeting photography enthusiasts who are considering an upgrade from iPhone 12. Style should be like Peter McKinnon - technical but approachable, with practical examples. Include camera comparisons, real-world scenarios, and clear upgrade recommendation. Target 60% retention rate with hook in first 15 seconds.\"\n\n**🔄 Workflow Automation:**\n\n**Content Production Pipeline:**\n1. **Strategy Phase** (Monthly)\n   • Generate comprehensive strategy\n   • Create content calendar framework\n   • Set performance benchmarks\n\n2. **Batch Creation Phase** (Weekly)\n   • Generate 20+ title variations\n   • Create 5-10 script concepts\n   • Design thumbnail templates\n   • Plan social media angles\n\n3. **Production Phase** (Daily)\n   • Refine selected content\n   • Create platform variations\n   • Schedule across channels\n   • Track performance metrics\n\n**🎨 Canvas Power Techniques:**\n\n**Advanced Mind Mapping:**\n• **Layered Information**: Use colors/sizes for priority\n• **Cross-linking**: Connect related concepts across branches\n• **Dynamic Updates**: Version control for evolving projects\n• **Template Systems**: Reusable frameworks for different content types\n\n**Collaboration Optimization:**\n• **Role-based Access**: Different permissions for team members\n• **Feedback Loops**: Structured review processes\n• **Asset Libraries**: Shared resources and brand elements\n\n**📊 Analytics Integration:**\n\n**Performance Tracking System:**\n• **Baseline Metrics**: Establish current performance levels\n• **A/B Testing Framework**: Systematic content experimentation\n• **Trend Analysis**: Identify patterns in successful content\n• **Predictive Modeling**: Use past data to inform future strategy\n\n**Cross-Platform Optimization:**\n• **Content Adaptation Matrix**: Systematic repurposing workflows\n• **Platform-Specific Metrics**: Optimize for each platform's algorithm\n• **Audience Journey Mapping**: Guide users through content funnel\n\n**🚀 Advanced Integrations:**\n\n**API Utilization** (Enterprise):\n• **Automated Content Scheduling**\n• **Custom Workflow Triggers**\n• **Data Export for Advanced Analytics**\n• **Third-party Tool Integration**\n\n**Team Optimization:**\n• **Role Specialization**: Dedicated team member workflows\n• **Quality Control Processes**: Multi-stage review systems\n• **Brand Consistency**: Style guides and approval workflows\n• **Performance Incentives**: Data-driven team management\n\n**🎓 Continuous Improvement:**\n\n**Learning Systems:**\n• **Weekly Performance Reviews**: Identify optimization opportunities\n• **Monthly Strategy Audits**: Adjust based on market changes\n• **Quarterly Goal Assessments**: Measure against business objectives\n• **Annual Platform Evolution**: Adapt to new features and trends\n\n**Expert-Level Features:**\n• **Custom AI Training** (Enterprise): Train AI on your brand voice\n• **Advanced Analytics**: Deep-dive performance insights\n• **White-label Solutions**: Brand the platform for your agency\n• **Priority Processing**: Faster generation and support\n\nWhich advanced technique would you like to implement first?",
    followUpSuggestions: [
      "Show me prompt engineering techniques",
      "Help me set up workflow automation",
      "Teach me advanced Canvas features"
    ]
  },

  // INTEGRATION QUESTIONS
  {
    patterns: [
      "integrate", "connect", "api", "automation", "workflow", "sync",
      "third party", "external", "import", "export", "link"
    ],
    category: "integration",
    subCategory: "workflow_automation",
    difficulty: "advanced",
    responseTemplate: "🔗 **Integration & Automation Guide:**\n\n**Available Integrations:**\n\n**📤 Export Integrations:**\n• **Google Calendar** - Sync content calendar\n• **Slack/Discord** - Team notifications\n• **Trello/Asana** - Project management\n• **Google Drive** - Content backup\n• **Dropbox** - Asset sharing\n\n**📊 Analytics Integrations:**\n• **Google Analytics** - Website traffic correlation\n• **YouTube Analytics** - Performance tracking\n• **Social Media APIs** - Cross-platform metrics\n• **Custom Webhooks** - Real-time data feeds\n\n**🤖 Automation Workflows:**\n\n**Content Publishing Automation:**\n1. **Strategy Generation** → Auto-create calendar events\n2. **Content Creation** → Auto-generate social variations\n3. **Performance Tracking** → Auto-update strategy based on results\n4. **Team Notifications** → Auto-alert on milestones\n\n**API Access (Enterprise Plans):**\n\n**Content Generation API:**\n```javascript\n// Example API call\nfetch('/api/generate', {\n  method: 'POST',\n  headers: { 'Authorization': 'Bearer YOUR_API_KEY' },\n  body: JSON.stringify({\n    platform: 'youtube',\n    contentType: 'script',\n    prompt: 'Your content prompt',\n    options: { persona: 'professional', length: '10min' }\n  })\n})\n```\n\n**Calendar Integration API:**\n```javascript\n// Sync to external calendar\nfetch('/api/calendar/sync', {\n  method: 'POST',\n  body: JSON.stringify({\n    provider: 'google',\n    events: calendarEvents\n  })\n})\n```\n\n**Webhook Configuration:**\n• **Content Generated** - Trigger external workflows\n• **Strategy Updated** - Update project management tools\n• **Performance Thresholds** - Alert systems\n• **Team Activities** - Collaboration notifications\n\n**🔧 Custom Workflow Examples:**\n\n**Agency Workflow:**\n1. Client requests content in CRM\n2. Auto-generate strategy in CreateGen\n3. Create calendar events in shared calendar\n4. Generate content based on strategy\n5. Export to client review platform\n6. Track performance and optimize\n\n**Creator Workflow:**\n1. Weekly trend analysis\n2. Auto-generate content ideas\n3. Create batch variations\n4. Schedule across platforms\n5. Monitor performance\n6. Adjust strategy automatically\n\n**Enterprise Workflow:**\n1. Brand strategy templates\n2. Multi-team collaboration\n3. Approval workflows\n4. Compliance checking\n5. Performance reporting\n6. ROI calculation\n\n**🎯 Setup Instructions:**\n\n**Basic Integrations:**\n1. **Go to Settings** → Integrations\n2. **Connect your accounts** (Google, Slack, etc.)\n3. **Configure sync preferences**\n4. **Test the connection**\n5. **Set up automation rules**\n\n**Advanced API Setup:**\n1. **Request API access** (Enterprise plans)\n2. **Generate API keys**\n3. **Configure webhooks**\n4. **Test endpoints**\n5. **Implement in your workflow**\n\n**Security Considerations:**\n• **API Rate Limits** - Respect usage quotas\n• **Data Encryption** - All transfers secured\n• **Access Control** - Team permission management\n• **Audit Trails** - Track all integration activity\n\nWhich integration would be most valuable for your workflow?",
    followUpSuggestions: [
      "Help me set up Google Calendar sync",
      "Show me API documentation",
      "Configure team automation workflows"
    ]
  }
];

/**
 * Advanced pattern matching for natural language understanding
 */
export class ComprehensiveQuestionMatcher {
  /**
   * Find the best matching pattern for a user question
   */
  findBestMatch(question: string, userContext?: any): QuestionPattern | null {
    const lowerQuestion = question.toLowerCase();
    let bestMatch: { pattern: QuestionPattern; score: number } | null = null;

    for (const pattern of COMPREHENSIVE_QUESTION_DATABASE) {
      const score = this.calculateMatchScore(lowerQuestion, pattern, userContext);
      
      if (!bestMatch || score > bestMatch.score) {
        bestMatch = { pattern, score };
      }
    }

    // Return match only if confidence is high enough
    return bestMatch && bestMatch.score > 0.6 ? bestMatch.pattern : null;
  }

  /**
   * Calculate how well a question matches a pattern
   */
  private calculateMatchScore(question: string, pattern: QuestionPattern, userContext?: any): number {
    let score = 0;
    let totalWeight = 0;

    // Check pattern matching
    for (const patternText of pattern.patterns) {
      const patternWords = patternText.toLowerCase().split(' ');
      let patternMatchScore = 0;

      for (const word of patternWords) {
        if (question.includes(word)) {
          patternMatchScore += 1;
        }
      }

      const normalizedScore = patternMatchScore / patternWords.length;
      score += normalizedScore * 0.7; // 70% weight for pattern matching
      totalWeight += 0.7;
    }

    // Context matching bonus
    if (userContext?.currentTool && pattern.category === userContext.currentTool) {
      score += 0.2; // 20% bonus for current tool context
      totalWeight += 0.2;
    }

    // User level matching
    if (userContext?.technicalLevel) {
      if (pattern.difficulty === userContext.technicalLevel) {
        score += 0.1; // 10% bonus for matching difficulty
      }
      totalWeight += 0.1;
    }

    return totalWeight > 0 ? score / totalWeight : 0;
  }

  /**
   * Generate dynamic response based on pattern and context
   */
  generateDynamicResponse(pattern: QuestionPattern, userContext?: any): string {
    let response = pattern.responseTemplate;

    // Replace dynamic elements based on context
    if (userContext) {
      // User plan specific content
      if (userContext.userPlan === 'free') {
        response = response.replace(/Premium users get/g, 'Premium users get (upgrade for');
        response = response.replace(/unlimited/g, 'unlimited (premium feature)');
      }

      // Current tool context
      if (userContext.currentTool) {
        response = `*Based on your current tool (${userContext.currentTool}):*\n\n${response}`;
      }

      // Recent activity context
      if (userContext.recentActivity?.length > 0) {
        const recentTools = userContext.recentActivity.map((a: any) => a.tool);
        const uniqueTools = [...new Set(recentTools)];
        if (uniqueTools.length > 1) {
          response += `\n\n*I notice you've been using ${uniqueTools.join(', ')} recently. These tools work great together!*`;
        }
      }
    }

    return response;
  }

  /**
   * Get contextual follow-up suggestions
   */
  getContextualFollowUps(pattern: QuestionPattern, userContext?: any): string[] {
    const baseFollowUps = pattern.followUpSuggestions || [];
    const contextualFollowUps: string[] = [];

    // Add context-specific follow-ups
    if (userContext?.technicalLevel === 'beginner' && pattern.difficulty === 'advanced') {
      contextualFollowUps.push("Can you explain this in simpler terms?");
    }

    if (userContext?.technicalLevel === 'advanced' && pattern.difficulty === 'beginner') {
      contextualFollowUps.push("Show me advanced techniques for this");
    }

    if (userContext?.currentTool && pattern.relatedTopics?.includes(userContext.currentTool)) {
      contextualFollowUps.push(`How does this relate to ${userContext.currentTool}?`);
    }

    return [...baseFollowUps, ...contextualFollowUps].slice(0, 4);
  }
}

export const comprehensiveQuestionMatcher = new ComprehensiveQuestionMatcher();
export default comprehensiveQuestionMatcher;
