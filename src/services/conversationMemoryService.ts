/**
 * Conversation Memory and Context Service
 * Tracks conversation history, user preferences, and contextual information
 */

export interface ConversationMessage {
  id: string;
  question: string;
  answer: string;
  timestamp: Date;
  category: string;
  confidence: number;
  userSatisfaction?: 'helpful' | 'not_helpful';
  followUpUsed?: boolean;
}

export interface UserSessionContext {
  sessionId: string;
  startTime: Date;
  currentTool?: string;
  userPlan: string;
  technicalLevel: 'beginner' | 'intermediate' | 'advanced';
  preferredResponseStyle: 'detailed' | 'concise' | 'step_by_step';
  conversationHistory: ConversationMessage[];
  frequentTopics: Map<string, number>;
  currentProject?: string;
  recentActions: Array<{
    action: string;
    tool: string;
    timestamp: Date;
  }>;
  goals: string[];
  painPoints: string[];
  successPatterns: string[];
}

export interface ConversationInsight {
  type: 'pattern' | 'preference' | 'knowledge_gap' | 'success_indicator';
  description: string;
  confidence: number;
  recommendation: string;
}

class ConversationMemoryService {
  private userSessions = new Map<string, UserSessionContext>();
  private globalPatterns = new Map<string, number>();

  /**
   * Initialize or get user session
   */
  getOrCreateSession(userId: string, userPlan: string = 'free'): UserSessionContext {
    if (!this.userSessions.has(userId)) {
      this.userSessions.set(userId, {
        sessionId: userId,
        startTime: new Date(),
        userPlan,
        technicalLevel: 'intermediate', // Default, will be inferred
        preferredResponseStyle: 'detailed',
        conversationHistory: [],
        frequentTopics: new Map(),
        recentActions: [],
        goals: [],
        painPoints: [],
        successPatterns: []
      });
    }
    return this.userSessions.get(userId)!;
  }

  /**
   * Add conversation to memory
   */
  addConversation(
    userId: string, 
    question: string, 
    answer: string, 
    category: string, 
    confidence: number
  ): void {
    const session = this.getOrCreateSession(userId);
    
    const conversation: ConversationMessage = {
      id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      question,
      answer,
      timestamp: new Date(),
      category,
      confidence
    };

    session.conversationHistory.push(conversation);
    
    // Update frequent topics
    const topic = this.extractMainTopic(question);
    session.frequentTopics.set(topic, (session.frequentTopics.get(topic) || 0) + 1);
    
    // Update global patterns
    this.globalPatterns.set(category, (this.globalPatterns.get(category) || 0) + 1);
    
    // Infer user technical level
    this.inferTechnicalLevel(session, question);
    
    // Infer preferred response style
    this.inferResponsePreference(session);
    
    // Keep conversation history manageable
    if (session.conversationHistory.length > 50) {
      session.conversationHistory = session.conversationHistory.slice(-30);
    }
  }

  /**
   * Get conversation context for better responses
   */
  getConversationContext(userId: string): {
    recentTopics: string[];
    userLevel: string;
    preferredStyle: string;
    currentFocus: string;
    suggestions: string[];
  } {
    const session = this.getOrCreateSession(userId);
    
    const recentConversations = session.conversationHistory.slice(-5);
    const recentTopics = recentConversations.map(c => this.extractMainTopic(c.question));
    
    const topTopics = Array.from(session.frequentTopics.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([topic]) => topic);

    const currentFocus = this.determineCurrentFocus(session);
    const suggestions = this.generatePersonalizedSuggestions(session);

    return {
      recentTopics,
      userLevel: session.technicalLevel,
      preferredStyle: session.preferredResponseStyle,
      currentFocus,
      suggestions
    };
  }

  /**
   * Generate intelligent follow-up questions
   */
  generateFollowUps(userId: string, lastAnswer: string, category: string): string[] {
    const session = this.getOrCreateSession(userId);
    const context = this.getConversationContext(userId);
    
    const followUps: string[] = [];

    // Category-specific follow-ups
    switch (category) {
      case 'generator':
        followUps.push(
          "Would you like me to show you how to refine these results?",
          "Should I explain how to create multiple variations?",
          "Want to learn about optimizing for different platforms?"
        );
        break;
      
      case 'canvas':
        followUps.push(
          "Need help exporting your canvas design?",
          "Want to learn about advanced canvas features?",
          "Should I show you collaboration tools?"
        );
        break;
      
      case 'strategy':
        followUps.push(
          "Ready to implement this strategy in Calendar?",
          "Want help creating content based on these pillars?",
          "Should I explain how to track strategy performance?"
        );
        break;
      
      case 'troubleshooting':
        followUps.push(
          "Did this solution work for you?",
          "Need help with any other issues?",
          "Want me to show you how to prevent this in the future?"
        );
        break;
      
      default:
        followUps.push(
          "Is there anything specific you'd like me to explain further?",
          "Would you like to see this applied to a real example?",
          "Any other questions about this topic?"
        );
    }

    // Context-aware follow-ups
    if (context.userLevel === 'beginner') {
      followUps.push("Want me to break this down into simpler steps?");
    } else if (context.userLevel === 'advanced') {
      followUps.push("Interested in advanced techniques for this?");
    }

    // Personalized based on frequent topics
    const topTopic = Array.from(session.frequentTopics.entries())[0];
    if (topTopic && topTopic[0] !== category) {
      followUps.push(`How does this relate to ${topTopic[0]}?`);
    }

    return followUps.slice(0, 3); // Return top 3 most relevant
  }

  /**
   * Get conversation insights for improving responses
   */
  getConversationInsights(userId: string): ConversationInsight[] {
    const session = this.getOrCreateSession(userId);
    const insights: ConversationInsight[] = [];
    
    // Analyze patterns
    if (session.conversationHistory.length >= 5) {
      const categories = session.conversationHistory.map(c => c.category);
      const mostCommon = this.getMostFrequent(categories);
      
      if (mostCommon) {
        insights.push({
          type: 'pattern',
          description: `User frequently asks about ${mostCommon}`,
          confidence: 0.8,
          recommendation: `Prepare detailed responses about ${mostCommon} topics`
        });
      }
    }

    // Check for knowledge gaps
    const lowConfidenceQuestions = session.conversationHistory
      .filter(c => c.confidence < 0.6)
      .map(c => c.category);
    
    if (lowConfidenceQuestions.length > 0) {
      const gap = this.getMostFrequent(lowConfidenceQuestions);
      insights.push({
        type: 'knowledge_gap',
        description: `Struggling with ${gap} topics`,
        confidence: 0.7,
        recommendation: `Provide more detailed guidance on ${gap}`
      });
    }

    return insights;
  }

  /**
   * Update user satisfaction feedback
   */
  updateSatisfaction(userId: string, messageId: string, satisfaction: 'helpful' | 'not_helpful'): void {
    const session = this.getOrCreateSession(userId);
    const message = session.conversationHistory.find(m => m.id === messageId);
    
    if (message) {
      message.userSatisfaction = satisfaction;
      
      // Learn from feedback
      if (satisfaction === 'helpful') {
        session.successPatterns.push(message.category);
      } else {
        session.painPoints.push(message.category);
      }
    }
  }

  /**
   * Extract main topic from question
   */
  private extractMainTopic(question: string): string {
    const lowerQ = question.toLowerCase();
    
    const topicMap = {
      'generator': ['generate', 'script', 'title', 'content', 'create'],
      'canvas': ['canvas', 'design', 'visual', 'mind map'],
      'thumbnails': ['thumbnail', 'image', 'background'],
      'strategy': ['strategy', 'plan', 'pillar', 'planning'],
      'calendar': ['calendar', 'schedule', 'posting'],
      'trends': ['trend', 'viral', 'trending'],
      'youtube': ['youtube', 'channel', 'video'],
      'analytics': ['analytics', 'stats', 'performance', 'metrics'],
      'troubleshooting': ['problem', 'error', 'issue', 'not working', 'help']
    };

    for (const [topic, keywords] of Object.entries(topicMap)) {
      if (keywords.some(keyword => lowerQ.includes(keyword))) {
        return topic;
      }
    }

    return 'general';
  }

  /**
   * Infer user technical level from questions
   */
  private inferTechnicalLevel(session: UserSessionContext, question: string): void {
    const lowerQ = question.toLowerCase();
    
    const beginnerIndicators = ['how do i', 'what is', 'help me', 'i need', 'basic', 'simple'];
    const advancedIndicators = ['optimize', 'automate', 'advanced', 'api', 'integration', 'custom'];
    
    let beginnerScore = beginnerIndicators.filter(indicator => lowerQ.includes(indicator)).length;
    let advancedScore = advancedIndicators.filter(indicator => lowerQ.includes(indicator)).length;
    
    if (advancedScore > beginnerScore && advancedScore > 0) {
      session.technicalLevel = 'advanced';
    } else if (beginnerScore > 0) {
      session.technicalLevel = 'beginner';
    } else {
      session.technicalLevel = 'intermediate';
    }
  }

  /**
   * Infer response style preference
   */
  private inferResponsePreference(session: UserSessionContext): void {
    const recentQuestions = session.conversationHistory.slice(-5).map(c => c.question.toLowerCase());
    
    const detailedIndicators = recentQuestions.filter(q => 
      q.includes('explain') || q.includes('detail') || q.includes('how exactly')
    ).length;
    
    const conciseIndicators = recentQuestions.filter(q =>
      q.includes('quick') || q.includes('brief') || q.includes('short')
    ).length;
    
    if (detailedIndicators > conciseIndicators) {
      session.preferredResponseStyle = 'detailed';
    } else if (conciseIndicators > 0) {
      session.preferredResponseStyle = 'concise';
    } else {
      session.preferredResponseStyle = 'step_by_step';
    }
  }

  /**
   * Determine current focus area
   */
  private determineCurrentFocus(session: UserSessionContext): string {
    const recentTopics = session.conversationHistory
      .slice(-10)
      .map(c => this.extractMainTopic(c.question));
    
    return this.getMostFrequent(recentTopics) || 'general';
  }

  /**
   * Generate personalized suggestions
   */
  private generatePersonalizedSuggestions(session: UserSessionContext): string[] {
    const suggestions: string[] = [];
    const topTopics = Array.from(session.frequentTopics.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2);

    topTopics.forEach(([topic]) => {
      switch (topic) {
        case 'generator':
          suggestions.push("Try advanced batch generation techniques");
          break;
        case 'canvas':
          suggestions.push("Explore canvas collaboration features");
          break;
        case 'strategy':
          suggestions.push("Learn about strategy performance tracking");
          break;
      }
    });

    return suggestions.slice(0, 3);
  }

  /**
   * Get most frequent item from array
   */
  private getMostFrequent(arr: string[]): string | null {
    if (arr.length === 0) return null;
    
    const frequency = new Map();
    arr.forEach(item => frequency.set(item, (frequency.get(item) || 0) + 1));
    
    return Array.from(frequency.entries())
      .sort((a, b) => b[1] - a[1])[0][0];
  }
}

export const conversationMemoryService = new ConversationMemoryService();
export default conversationMemoryService;
