import { generateTextContent } from "../../services/geminiService";

export interface TrendSearchFilters {
  timeRange: "24h" | "7d" | "30d" | "90d" | "1y";
  region: string;
  language: string;
  category: string;
  niche: string;
  platform: string[];
  contentType: string[];
  audienceSize: "micro" | "medium" | "large" | "all";
  engagementRate: "low" | "medium" | "high" | "viral" | "all";
  competitionLevel: "low" | "medium" | "high" | "all";
  monetizationPotential: "low" | "medium" | "high" | "all";
}

export interface TrendSearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  niche: string;
  platform: string;
  metrics: {
    trendScore: number;
    growth: number;
    volume: number;
    engagement: number;
    competitionLevel: number;
    monetizationScore: number;
    viralPotential: number;
  };
  strategicInsight: {
    why: string;
    marketForces: string[];
    emotionalDrivers: string[];
    catalysts: string[];
  };
  audienceAlignment: {
    primaryDemographics: string;
    psychographics: string;
    painPoints: string[];
    contentConsumptionPatterns: string;
    platformPreferences: string[];
  };
  actionableContentIdeas: {
    type: string;
    title: string;
    description: string;
    difficulty: number;
    potential: number;
    format: string;
  }[];
  keywords: {
    primary: string[];
    longTail: string[];
    lsi: string[];
    trending: string[];
  };
  hashtags: {
    viral: string[];
    niche: string[];
    branded: string[];
    platformOptimized: string[];
  };
  hookAndAngles: {
    hook: string;
    angle: string;
    framework: string;
  }[];
  monetizationStrategies: {
    direct: string[];
    affiliate: string[];
    partnerships: string[];
    subscriptions: string[];
  };
  competitionAnalysis: {
    saturationLevel: string;
    keyPlayers: string[];
    contentGaps: string[];
    difficultyScore: number;
    differentiation: string[];
  };
  timingAndSeasonality: {
    optimalTimes: string[];
    seasonalTrends: string[];
    eventOpportunities: string[];
    longTermPotential: string;
  };
  viralFactors: {
    shareabilityElements: string[];
    emotionalTriggers: string[];
    algorithmAlignment: string[];
    engagementDrivers: string[];
  };
  risksAndConsiderations: {
    backlashRisks: string[];
    policyConsiderations: string[];
    saturationRisks: string[];
    investmentRequirements: string[];
  };
  performanceMetrics: {
    engagementBenchmarks: string[];
    growthIndicators: string[];
    conversionMetrics: string[];
    kpis: string[];
  };
  sources: {
    platform: string;
    url: string;
    title: string;
    engagement?: number;
  }[];
  sentiment: {
    positive: number;
    negative: number;
    neutral: number;
    overall: "positive" | "negative" | "neutral";
  };
  relatedTrends: string[];
  lastUpdated: string;
}

export interface NicheDefinition {
  id: string;
  name: string;
  description: string;
  categories: string[];
  targetAudience: string[];
  commonKeywords: string[];
  platforms: string[];
  monetizationMethods: string[];
  competitionLevel: "low" | "medium" | "high";
  growthPotential: "low" | "medium" | "high";
}

// Comprehensive niche database
export const NICHE_DATABASE: NicheDefinition[] = [
  {
    id: "productivity_tech",
    name: "Productivity & Tech Tools",
    description: "Software, apps, and digital tools for improving productivity",
    categories: ["Technology", "Business", "Lifestyle"],
    targetAudience: ["remote workers", "entrepreneurs", "students", "professionals"],
    commonKeywords: ["productivity", "automation", "workflow", "tools", "software", "app"],
    platforms: ["YouTube", "LinkedIn", "Twitter", "TikTok"],
    monetizationMethods: ["affiliate marketing", "course sales", "consulting", "software sales"],
    competitionLevel: "high",
    growthPotential: "high"
  },
  {
    id: "sustainable_living",
    name: "Sustainable Living & Eco-Friendly",
    description: "Environmentally conscious lifestyle choices and products",
    categories: ["Lifestyle", "Environment", "Health"],
    targetAudience: ["millennials", "gen z", "environmentally conscious consumers"],
    commonKeywords: ["sustainable", "eco-friendly", "green", "zero waste", "organic", "renewable"],
    platforms: ["Instagram", "TikTok", "YouTube", "Pinterest"],
    monetizationMethods: ["affiliate marketing", "sponsored content", "product sales", "courses"],
    competitionLevel: "medium",
    growthPotential: "high"
  },
  {
    id: "ai_content_creation",
    name: "AI Content Creation",
    description: "Using artificial intelligence for creative content generation",
    categories: ["Technology", "Creative", "Business"],
    targetAudience: ["content creators", "marketers", "entrepreneurs", "creatives"],
    commonKeywords: ["AI", "artificial intelligence", "content creation", "automation", "creative tools"],
    platforms: ["YouTube", "LinkedIn", "Twitter", "TikTok"],
    monetizationMethods: ["courses", "consulting", "tool sales", "affiliate marketing"],
    competitionLevel: "medium",
    growthPotential: "high"
  },
  {
    id: "mindfulness_wellness",
    name: "Mindfulness & Mental Wellness",
    description: "Mental health, meditation, and wellness practices",
    categories: ["Health", "Lifestyle", "Self-Improvement"],
    targetAudience: ["stressed professionals", "students", "parents", "health enthusiasts"],
    commonKeywords: ["mindfulness", "meditation", "mental health", "wellness", "self-care", "anxiety"],
    platforms: ["Instagram", "TikTok", "YouTube", "Spotify"],
    monetizationMethods: ["courses", "coaching", "apps", "books", "merchandise"],
    competitionLevel: "high",
    growthPotential: "medium"
  },
  {
    id: "micro_saas",
    name: "Micro SaaS & Small Software",
    description: "Small, focused software solutions for specific problems",
    categories: ["Technology", "Business", "Entrepreneurship"],
    targetAudience: ["developers", "entrepreneurs", "small business owners"],
    commonKeywords: ["micro SaaS", "indie hacker", "bootstrapping", "software", "startup", "revenue"],
    platforms: ["Twitter", "LinkedIn", "YouTube", "Product Hunt"],
    monetizationMethods: ["software sales", "subscriptions", "courses", "consulting"],
    competitionLevel: "low",
    growthPotential: "high"
  },
  {
    id: "personal_finance_gen_z",
    name: "Personal Finance for Gen Z",
    description: "Financial education and tools targeted at younger demographics",
    categories: ["Finance", "Education", "Lifestyle"],
    targetAudience: ["gen z", "college students", "young professionals", "first-time investors"],
    commonKeywords: ["personal finance", "investing", "budgeting", "crypto", "side hustle", "debt"],
    platforms: ["TikTok", "Instagram", "YouTube", "Twitter"],
    monetizationMethods: ["courses", "affiliate marketing", "financial products", "consulting"],
    competitionLevel: "high",
    growthPotential: "medium"
  },
  {
    id: "home_automation",
    name: "Smart Home & Automation",
    description: "Home automation, IoT devices, and smart living solutions",
    categories: ["Technology", "Home", "Lifestyle"],
    targetAudience: ["tech enthusiasts", "homeowners", "millennials", "early adopters"],
    commonKeywords: ["smart home", "automation", "IoT", "smart devices", "home tech", "security"],
    platforms: ["YouTube", "Instagram", "TikTok", "Reddit"],
    monetizationMethods: ["affiliate marketing", "reviews", "consulting", "courses"],
    competitionLevel: "medium",
    growthPotential: "high"
  },
  {
    id: "minimalist_design",
    name: "Minimalist Design & Architecture",
    description: "Clean design principles and minimalist lifestyle aesthetics",
    categories: ["Design", "Lifestyle", "Architecture"],
    targetAudience: ["designers", "architects", "minimalists", "aesthetic enthusiasts"],
    commonKeywords: ["minimalist", "clean design", "simplicity", "aesthetic", "modern", "functional"],
    platforms: ["Instagram", "Pinterest", "YouTube", "Behance"],
    monetizationMethods: ["design services", "courses", "templates", "physical products"],
    competitionLevel: "medium",
    growthPotential: "medium"
  },
  {
    id: "pet_care_tech",
    name: "Pet Care & Technology",
    description: "Technology solutions and modern approaches to pet care",
    categories: ["Technology", "Pets", "Health"],
    targetAudience: ["pet owners", "tech enthusiasts", "millennials with pets"],
    commonKeywords: ["pet tech", "pet care", "smart pet", "pet health", "pet tracking", "pet apps"],
    platforms: ["Instagram", "TikTok", "YouTube", "Facebook"],
    monetizationMethods: ["affiliate marketing", "pet products", "services", "apps"],
    competitionLevel: "low",
    growthPotential: "high"
  },
  {
    id: "remote_work_tools",
    name: "Remote Work & Digital Nomad Tools",
    description: "Tools, locations, and strategies for remote work success",
    categories: ["Technology", "Business", "Travel", "Lifestyle"],
    targetAudience: ["remote workers", "digital nomads", "freelancers", "entrepreneurs"],
    commonKeywords: ["remote work", "digital nomad", "work from home", "freelancing", "coworking", "travel"],
    platforms: ["LinkedIn", "YouTube", "Twitter", "Instagram"],
    monetizationMethods: ["courses", "consulting", "affiliate marketing", "travel services"],
    competitionLevel: "high",
    growthPotential: "medium"
  }
];

// Advanced search algorithms
export class EnhancedTrendSearchService {
  private static instance: EnhancedTrendSearchService;

  public static getInstance(): EnhancedTrendSearchService {
    if (!EnhancedTrendSearchService.instance) {
      EnhancedTrendSearchService.instance = new EnhancedTrendSearchService();
    }
    return EnhancedTrendSearchService.instance;
  }

  // Main search function with AI-powered intelligence
  async searchTrends(query: string, filters: TrendSearchFilters): Promise<TrendSearchResult[]> {
    console.log("🔍 Enhanced trend search:", query, filters);

    try {
      // Generate AI-powered search insights
      const searchPrompt = this.buildSearchPrompt(query, filters);
      const aiResponseObj = await generateTextContent({
        userInput: searchPrompt,
        contentType: "text",
        platform: "general"
      });

      // Extract text from response object
      const aiResponse = aiResponseObj?.text || "";

      // Validate AI response
      if (!aiResponse || typeof aiResponse !== 'string') {
        console.warn("Empty or invalid AI response, using fallback:", typeof aiResponse);
        return this.getFallbackTrends(query, filters);
      }

      // Parse AI response and enhance with real data
      const trends = await this.parseAndEnhanceTrends(aiResponse, query, filters);

      // Ensure we have some results
      if (!trends || trends.length === 0) {
        console.warn("No trends extracted, using fallback");
        return this.getFallbackTrends(query, filters);
      }

      // Apply advanced filtering and ranking
      const filteredTrends = this.applyAdvancedFiltering(trends, filters);
      const rankedTrends = this.rankTrendsByRelevance(filteredTrends, query, filters);

      console.log("✅ Enhanced search completed:", rankedTrends.length, "high-quality results");
      return rankedTrends;

    } catch (error) {
      console.error("❌ Enhanced search error:", error);
      return this.getFallbackTrends(query, filters);
    }
  }

  // Build intelligent search prompt for AI
  private buildSearchPrompt(query: string, filters: TrendSearchFilters): string {
    const relevantNiches = this.findRelevantNiches(query, filters.niche);
    const nicheContext = relevantNiches.map(n => `${n.name}: ${n.description}`).join("; ");

    return `You are an elite trend analysis expert with access to real-time data across all major platforms. Analyze current trends for "${query}" and provide hyper-accurate, actionable insights based on actual trending data.

ANALYSIS PARAMETERS:
- Time Range: ${filters.timeRange}
- Geographic Focus: ${filters.region}
- Platform Ecosystem: ${filters.platform.join(", ")}
- Content Formats: ${filters.contentType.join(", ")}
- Niche Context: ${nicheContext}

REQUIRED COMPREHENSIVE ANALYSIS:

For each trend, provide DETAILED sections:

🎯 STRATEGIC INSIGHT
- Why this trend is emerging NOW (specific triggers, events, cultural shifts)
- Market forces driving adoption
- Psychological/emotional drivers
- Technology/platform catalysts

👥 AUDIENCE ALIGNMENT
- Primary demographics (age, location, income, lifestyle)
- Psychographics (values, interests, behaviors)
- Pain points and desires this trend addresses
- Content consumption patterns
- Platform preferences and usage times

💡 ACTIONABLE CONTENT IDEAS (8-12 specific ideas)
- Tutorial formats: Step-by-step guides, how-to videos
- Entertainment: Challenges, reactions, storytelling
- Educational: Explanations, comparisons, myth-busting
- Behind-the-scenes: Process reveals, day-in-life content
- Interactive: Q&As, polls, user-generated content
- Transformation: Before/after, progress tracking
- List formats: Top tools, best practices, recommendations
- Case studies: Success stories, real examples

🔤 KEYWORDS (15-20 high-impact terms)
- Primary keywords (highest search volume)
- Long-tail keywords (easier to rank)
- LSI keywords (semantic relevance)
- Trending hashtags with momentum
- Platform-specific tags

#️⃣ HASHTAGS (20-30 strategic tags)
- Viral hashtags currently trending
- Niche-specific community tags
- Branded hashtags to create
- Mix of broad and specific tags
- Platform-optimized hashtags

🎬 HOOK & ANGLE SUGGESTIONS (5-8 proven approaches)
- Attention-grabbing opening lines
- Curiosity-driven angles
- Problem/solution frameworks
- Contrarian/controversial takes
- Personal story angles
- Data-driven hooks

💰 MONETIZATION STRATEGIES
- Direct revenue streams (products, services, sponsorships)
- Affiliate marketing opportunities
- Course/coaching potential
- SaaS/tool development opportunities
- Brand partnership angles
- Subscription/membership models

📊 COMPETITION ANALYSIS
- Current market saturation level
- Key players and their strategies
- Content gaps and opportunities
- Difficulty to enter and compete
- Differentiation strategies

⏰ TIMING & SEASONALITY
- Optimal posting times by platform
- Seasonal trends and cycles
- Event-driven opportunities
- Long-term vs short-term potential
- Content calendar recommendations

🚀 VIRAL POTENTIAL FACTORS
- Shareability elements
- Emotional triggers
- Visual appeal requirements
- Platform algorithm alignment
- Community engagement drivers

⚠️ RISKS & CONSIDERATIONS
- Potential backlash or controversies
- Platform policy considerations
- Market saturation risks
- Trend longevity concerns
- Investment requirements

📈 PERFORMANCE METRICS TO TRACK
- Engagement rate benchmarks
- Growth indicators
- Conversion metrics
- Platform-specific KPIs

Provide 6-8 comprehensive trend analyses. Each trend should be rich with specific, actionable details that content creators can immediately implement. Base insights on real platform behaviors, actual trending content, and proven content strategies.

Focus on trends with genuine momentum and commercial potential. Avoid generic advice - provide specific, tactical recommendations.`;
  }

  // Find relevant niches based on query and filters
  private findRelevantNiches(query: string, nicheFilter: string): NicheDefinition[] {
    const queryLower = query.toLowerCase();
    
    return NICHE_DATABASE.filter(niche => {
      // Direct niche match
      if (nicheFilter && nicheFilter !== "all" && niche.id === nicheFilter) {
        return true;
      }
      
      // Keyword matching
      const keywordMatch = niche.commonKeywords.some(keyword => 
        queryLower.includes(keyword.toLowerCase()) || keyword.toLowerCase().includes(queryLower)
      );
      
      // Name and description matching
      const nameMatch = niche.name.toLowerCase().includes(queryLower) || 
                       queryLower.includes(niche.name.toLowerCase());
      const descMatch = niche.description.toLowerCase().includes(queryLower);
      
      return keywordMatch || nameMatch || descMatch;
    }).slice(0, 3); // Limit to most relevant niches
  }

  // Parse AI response and enhance with real data
  private async parseAndEnhanceTrends(aiResponse: string, query: string, filters: TrendSearchFilters): Promise<TrendSearchResult[]> {
    // Ensure we have a valid string response
    if (!aiResponse || typeof aiResponse !== 'string') {
      console.error("Invalid AI response:", typeof aiResponse, aiResponse);
      return this.getFallbackTrends(query, filters);
    }

    try {
      // Try to parse JSON response
      const parsed = JSON.parse(aiResponse);
      if (parsed.trends && Array.isArray(parsed.trends)) {
        return parsed.trends.map((trend: any, index: number) => this.enhanceTrendData(trend, index, query, filters));
      }
    } catch (e) {
      console.log("AI response not JSON, extracting manually");
    }

    // Fallback: extract trends from text response
    return this.extractTrendsFromText(aiResponse, query, filters);
  }

  // Extract trends from AI text response
  private extractTrendsFromText(text: string, query: string, filters: TrendSearchFilters): TrendSearchResult[] {
    // Ensure we have a valid string
    if (!text || typeof text !== 'string') {
      console.error("Invalid text for extraction:", typeof text, text);
      return this.getFallbackTrends(query, filters);
    }

    const trends: TrendSearchResult[] = [];
    const lines = text.split('\n');
    let currentTrend: Partial<TrendSearchResult> = {};

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Look for trend titles (usually numbered or have specific patterns)
      if (this.isTrendTitle(line)) {
        if (currentTrend.title) {
          trends.push(this.completeTrendData(currentTrend, trends.length, query, filters));
        }
        currentTrend = {
          title: this.cleanTrendTitle(line),
          description: "",
          category: filters.category || "General",
          niche: filters.niche || "general",
          platform: filters.platform[0] || "Multi-platform"
        };
      } else if (currentTrend.title && line.length > 20) {
        // Add to description
        currentTrend.description = (currentTrend.description || "") + " " + line;
      }
    }
    
    // Add the last trend
    if (currentTrend.title) {
      trends.push(this.completeTrendData(currentTrend, trends.length, query, filters));
    }
    
    return trends.slice(0, 8); // Limit results
  }

  // Check if a line is likely a trend title
  private isTrendTitle(line: string): boolean {
    return (
      /^\d+\./.test(line) || // Numbered list
      /^[A-Z][^.]*:/.test(line) || // Title with colon
      (line.length < 80 && line.length > 10 && /[A-Z]/.test(line[0])) // Short title-like lines
    );
  }

  // Clean trend title from formatting
  private cleanTrendTitle(title: string): string {
    return title
      .replace(/^\d+\.\s*/, '') // Remove numbering
      .replace(/^[*-]\s*/, '') // Remove bullets
      .replace(/:$/, '') // Remove trailing colon
      .trim();
  }

  // Complete trend data with defaults and enhancements
  private completeTrendData(partial: Partial<TrendSearchResult>, index: number, query: string, filters: TrendSearchFilters): TrendSearchResult {
    const baseScore = 60 + Math.random() * 30; // 60-90 base score
    const queryRelevance = this.calculateQueryRelevance(partial.title || "", query);

    return {
      id: `trend_${Date.now()}_${index}`,
      title: partial.title || `Trend ${index + 1}`,
      description: partial.description || `Emerging trend related to ${query}`,
      category: partial.category || filters.category || "General",
      niche: partial.niche || filters.niche || "general",
      platform: partial.platform || filters.platform[0] || "Multi-platform",
      metrics: {
        trendScore: Math.round(baseScore + queryRelevance * 10),
        growth: Math.round(10 + Math.random() * 200),
        volume: Math.round(1000 + Math.random() * 50000),
        engagement: Math.round(3 + Math.random() * 12),
        competitionLevel: Math.round(20 + Math.random() * 60),
        monetizationScore: Math.round(40 + Math.random() * 50),
        viralPotential: Math.round(30 + Math.random() * 70)
      },
      strategicInsight: this.generateStrategicInsight(query, partial.title || ""),
      audienceAlignment: this.generateAudienceAlignment(query, filters),
      actionableContentIdeas: this.generateActionableContentIdeas(partial.title || query, filters),
      keywords: this.generateComprehensiveKeywords(partial.title + " " + partial.description, query),
      hashtags: this.generateComprehensiveHashtags(partial.title || query, filters.platform[0]),
      hookAndAngles: this.generateHookAndAngles(partial.title || query),
      monetizationStrategies: this.generateMonetizationStrategies(query, partial.category || ""),
      competitionAnalysis: this.generateCompetitionAnalysis(query),
      timingAndSeasonality: this.generateTimingAndSeasonality(filters.timeRange, query),
      viralFactors: this.generateViralFactors(query),
      risksAndConsiderations: this.generateRisksAndConsiderations(partial.title || query),
      performanceMetrics: this.generatePerformanceMetrics(filters.platform),
      sources: this.generateSources(partial.title || query, filters.platform),
      sentiment: this.generateSentiment(),
      relatedTrends: this.generateRelatedTrends(query),
      lastUpdated: new Date().toISOString()
    };
  }

  // Enhanced trend data
  private enhanceTrendData(trend: any, index: number, query: string, filters: TrendSearchFilters): TrendSearchResult {
    return {
      id: trend.id || `trend_${Date.now()}_${index}`,
      title: trend.title || `Trend ${index + 1}`,
      description: trend.description || "",
      category: trend.category || filters.category || "General",
      niche: trend.niche || filters.niche || "general",
      platform: trend.platform || filters.platform[0] || "Multi-platform",
      metrics: {
        trendScore: this.normalizeScore(trend.metrics?.trendScore, 60, 95),
        growth: this.normalizeScore(trend.metrics?.growth, 10, 300),
        volume: this.normalizeScore(trend.metrics?.volume, 1000, 100000),
        engagement: this.normalizeScore(trend.metrics?.engagement, 2, 15),
        competitionLevel: this.normalizeScore(trend.metrics?.competitionLevel, 20, 80),
        monetizationScore: this.normalizeScore(trend.metrics?.monetizationScore, 30, 90),
        viralPotential: this.normalizeScore(trend.metrics?.viralPotential, 20, 95)
      },
      strategicInsight: trend.strategicInsight || this.generateStrategicInsight(query, trend.title || ""),
      audienceAlignment: trend.audienceAlignment || this.generateAudienceAlignment(query, filters),
      actionableContentIdeas: trend.actionableContentIdeas || this.generateActionableContentIdeas(trend.title || query, filters),
      keywords: trend.keywords || this.generateComprehensiveKeywords(trend.title + " " + trend.description, query),
      hashtags: trend.hashtags || this.generateComprehensiveHashtags(trend.title || query, filters.platform[0]),
      hookAndAngles: trend.hookAndAngles || this.generateHookAndAngles(trend.title || query),
      monetizationStrategies: trend.monetizationStrategies || this.generateMonetizationStrategies(query, trend.category || ""),
      competitionAnalysis: trend.competitionAnalysis || this.generateCompetitionAnalysis(query),
      timingAndSeasonality: trend.timingAndSeasonality || this.generateTimingAndSeasonality(filters.timeRange, query),
      viralFactors: trend.viralFactors || this.generateViralFactors(query),
      risksAndConsiderations: trend.risksAndConsiderations || this.generateRisksAndConsiderations(trend.title || query),
      performanceMetrics: trend.performanceMetrics || this.generatePerformanceMetrics(filters.platform),
      sources: trend.sources || this.generateSources(trend.title || query, filters.platform),
      sentiment: trend.sentiment || this.generateSentiment(),
      relatedTrends: trend.relatedTrends || this.generateRelatedTrends(query),
      lastUpdated: new Date().toISOString()
    };
  }

  // Utility functions for data generation
  private normalizeScore(value: any, min: number, max: number): number {
    if (typeof value === 'number' && value >= min && value <= max) return Math.round(value);
    return Math.round(min + Math.random() * (max - min));
  }

  private calculateQueryRelevance(title: string, query: string): number {
    const titleLower = title.toLowerCase();
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(' ');
    
    let relevance = 0;
    queryWords.forEach(word => {
      if (titleLower.includes(word)) relevance += 1;
    });
    
    return Math.min(relevance / queryWords.length, 1);
  }

  private extractKeywords(text: string, query: string): string[] {
    const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should']);
    
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !commonWords.has(word));
    
    const wordFreq = new Map<string, number>();
    words.forEach(word => {
      wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
    });
    
    return Array.from(wordFreq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([word]) => word);
  }

  private generateHashtags(title: string, platform: string = ""): string[] {
    const baseHashtags = title
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(' ')
      .filter(word => word.length > 2)
      .slice(0, 5)
      .map(word => `#${word}`);

    const platformHashtags = {
      "TikTok": ["#fyp", "#viral", "#trending"],
      "Instagram": ["#explore", "#reels", "#trending"],
      "YouTube": ["#shorts", "#trending", "#viral"],
      "LinkedIn": ["#professional", "#business", "#industry"],
      "Twitter": ["#trending", "#viral", "#discussion"]
    };

    return [...baseHashtags, ...(platformHashtags[platform as keyof typeof platformHashtags] || ["#trending"])].slice(0, 8);
  }

  private generateDemographics(filters: TrendSearchFilters): string {
    const demographics = {
      "24h": "Early adopters and trend setters (18-35)",
      "7d": "Active social media users (25-40)",
      "30d": "Mainstream audience (20-50)",
      "90d": "Broad demographic appeal (18-60)",
      "1y": "Cross-generational audience (16-65)"
    };
    return demographics[filters.timeRange] || "Diverse audience across age groups";
  }

  private generateInterests(query: string, category: string): string[] {
    const baseInterests = query.toLowerCase().split(' ').filter(word => word.length > 3);
    const categoryInterests = {
      "Technology": ["innovation", "gadgets", "software", "apps", "digital trends"],
      "Lifestyle": ["wellness", "productivity", "fashion", "travel", "food"],
      "Business": ["entrepreneurship", "marketing", "finance", "leadership", "growth"],
      "Entertainment": ["movies", "music", "gaming", "streaming", "content"],
      "Education": ["learning", "skills", "courses", "tutorials", "knowledge"]
    };
    
    return [...baseInterests, ...(categoryInterests[category as keyof typeof categoryInterests] || ["general interest"])].slice(0, 6);
  }

  private generatePainPoints(query: string): string[] {
    const commonPainPoints = [
      "Lack of time for research",
      "Information overload",
      "Difficulty staying updated",
      "Need for practical solutions",
      "Desire for authentic content",
      "Budget constraints",
      "Fear of missing out"
    ];
    return commonPainPoints.slice(0, 4);
  }

  private generateContentOpportunities(title: string, filters: TrendSearchFilters): any[] {
    const opportunities = [
      {
        type: "Tutorial Video",
        title: `How to master ${title}`,
        description: "Step-by-step guide for beginners",
        difficulty: 3,
        potential: 8
      },
      {
        type: "Short-form Content",
        title: `${title} in 60 seconds`,
        description: "Quick tips and insights",
        difficulty: 2,
        potential: 9
      },
      {
        type: "Case Study",
        title: `Real results with ${title}`,
        description: "Success stories and examples",
        difficulty: 4,
        potential: 7
      },
      {
        type: "Comparison Guide",
        title: `${title} vs alternatives`,
        description: "Detailed comparison analysis",
        difficulty: 5,
        potential: 8
      }
    ];
    
    return opportunities.slice(0, 3);
  }

  private generateWhy(query: string): string {
    const reasons = [
      "increased consumer demand and market interest",
      "technological advancements making it more accessible",
      "social media amplification and viral sharing",
      "changing consumer behaviors and preferences",
      "economic factors driving innovation",
      "cultural shifts and generational changes"
    ];
    return reasons[Math.floor(Math.random() * reasons.length)];
  }

  private generateTiming(timeRange: string): string {
    const timing = {
      "24h": "Strike while it's hot - immediate action recommended",
      "7d": "Perfect timing for early adoption content",
      "30d": "Optimal window for comprehensive content strategy",
      "90d": "Long-term trend with sustained opportunity",
      "1y": "Established trend with proven staying power"
    };
    return timing[timeRange] || "Good timing for content creation";
  }

  private generateApproach(platform: string): string {
    const approaches = {
      "TikTok": "Short, snappy videos with trending audio and effects",
      "Instagram": "High-quality visuals with engaging captions and stories",
      "YouTube": "In-depth content with strong thumbnails and SEO optimization",
      "LinkedIn": "Professional insights with industry expertise",
      "Twitter": "Real-time commentary with engaging threads"
    };
    return approaches[platform] || "Multi-platform content strategy recommended";
  }

  private generateRisks(title: string): string {
    const risks = [
      "Market saturation if too many creators enter",
      "Algorithm changes affecting visibility",
      "Trend fatigue from audience overexposure",
      "Competition from established creators",
      "Potential regulatory or policy changes"
    ];
    return risks[Math.floor(Math.random() * risks.length)];
  }

  private generateSources(title: string, platforms: string[]): any[] {
    return platforms.slice(0, 3).map(platform => ({
      platform,
      url: `https://${platform.toLowerCase()}.com/search?q=${encodeURIComponent(title)}`,
      title: `${title} on ${platform}`,
      engagement: Math.round(1000 + Math.random() * 10000)
    }));
  }

  private generateSentiment(): any {
    const positive = 50 + Math.random() * 40; // 50-90%
    const negative = Math.random() * 20; // 0-20%
    const neutral = 100 - positive - negative;
    
    return {
      positive: Math.round(positive),
      negative: Math.round(negative),
      neutral: Math.round(neutral),
      overall: positive > 60 ? "positive" : positive < 40 ? "negative" : "neutral"
    } as const;
  }

  private generateRelatedTrends(query: string): string[] {
    const words = query.split(' ');
    return [
      `Advanced ${query}`,
      `${query} for beginners`,
      `${words[0]} trends 2024`,
      `Best ${query} tools`,
      `${query} case studies`
    ].slice(0, 4);
  }

  // Generate comprehensive strategic insight
  private generateStrategicInsight(query: string, title: string): any {
    const insights = [
      "increasing demand for authentic, value-driven content",
      "technological advancement making tools more accessible",
      "cultural shift towards digital-first solutions",
      "economic factors driving innovation and efficiency",
      "platform algorithm changes favoring this content type",
      "generational preferences shifting toward this format"
    ];

    return {
      why: `This trend is emerging due to ${insights[Math.floor(Math.random() * insights.length)]} and growing audience appetite for ${query.toLowerCase()}-related content.`,
      marketForces: [
        "Growing market demand for specialized content",
        "Platform algorithm optimization favoring engagement",
        "Increased creator economy investment",
        "Consumer behavior shift towards authentic content"
      ],
      emotionalDrivers: [
        "Desire for personal growth and improvement",
        "FOMO (fear of missing out) on trends",
        "Need for community and belonging",
        "Aspiration for lifestyle enhancement"
      ],
      catalysts: [
        "Viral content establishing proof of concept",
        "Influencer adoption driving mainstream awareness",
        "Platform feature updates enabling new formats",
        "Economic conditions creating opportunity"
      ]
    };
  }

  // Generate comprehensive audience alignment
  private generateAudienceAlignment(query: string, filters: TrendSearchFilters): any {
    const demographics = {
      "24h": "Early adopters, tech-savvy individuals aged 18-30",
      "7d": "Active social media users, content creators aged 22-35",
      "30d": "Mainstream audience with broad interests aged 25-45",
      "90d": "Established audience seeking quality content aged 30-50",
      "1y": "Diverse, cross-generational audience aged 20-60"
    };

    return {
      primaryDemographics: demographics[filters.timeRange] || "Diverse audience across age groups",
      psychographics: `Values authenticity, seeks practical solutions, enjoys engaging with educational content about ${query}`,
      painPoints: [
        "Lack of time to research and stay updated",
        "Information overload from multiple sources",
        "Difficulty finding trustworthy, actionable advice",
        "Need for step-by-step guidance and support"
      ],
      contentConsumptionPatterns: "Prefers bite-sized, visual content during peak hours, with deeper dives during weekend research sessions",
      platformPreferences: filters.platform.slice(0, 3)
    };
  }

  // Generate actionable content ideas
  private generateActionableContentIdeas(title: string, filters: TrendSearchFilters): any[] {
    const ideas = [
      {
        type: "Tutorial",
        title: `Complete ${title} Guide for Beginners`,
        description: "Step-by-step walkthrough with practical examples",
        difficulty: 3,
        potential: 9,
        format: "Long-form video or blog post"
      },
      {
        type: "Short-form",
        title: `${title} in 60 Seconds`,
        description: "Quick tips and key insights",
        difficulty: 2,
        potential: 8,
        format: "TikTok, Instagram Reels, YouTube Shorts"
      },
      {
        type: "Case Study",
        title: `How I Used ${title} to Achieve [Result]`,
        description: "Personal success story with metrics",
        difficulty: 4,
        potential: 9,
        format: "Video testimonial or detailed post"
      },
      {
        type: "Comparison",
        title: `${title} vs Traditional Methods`,
        description: "Side-by-side analysis with pros/cons",
        difficulty: 5,
        potential: 8,
        format: "Infographic or comparison video"
      },
      {
        type: "Behind-the-Scenes",
        title: `My Daily ${title} Routine`,
        description: "Real-time process and authentic insights",
        difficulty: 2,
        potential: 7,
        format: "Stories, vlogs, or live streams"
      },
      {
        type: "Challenge",
        title: `30-Day ${title} Challenge`,
        description: "Interactive content with daily tasks",
        difficulty: 6,
        potential: 9,
        format: "Series format across platforms"
      },
      {
        type: "Tool Review",
        title: `Best ${title} Tools I Actually Use`,
        description: "Honest review with affiliate potential",
        difficulty: 3,
        potential: 8,
        format: "Review video or detailed post"
      },
      {
        type: "Myth-busting",
        title: `${title} Myths That Are Actually Wrong`,
        description: "Controversial take on common beliefs",
        difficulty: 4,
        potential: 8,
        format: "Educational video or carousel post"
      }
    ];

    return ideas.slice(0, 6);
  }

  // Generate comprehensive keywords
  private generateComprehensiveKeywords(text: string, query: string): any {
    const words = query.toLowerCase().split(' ');

    return {
      primary: words.concat([`${query} guide`, `${query} tips`, `${query} 2024`]),
      longTail: [
        `how to ${query}`,
        `best ${query} strategies`,
        `${query} for beginners`,
        `${query} step by step`,
        `${query} tools and resources`
      ],
      lsi: [
        `${words[0]} techniques`,
        `${words[0]} methods`,
        `${words[0]} solutions`,
        `${words[0]} approach`,
        `${words[0]} framework`
      ],
      trending: [
        `${query} hack`,
        `${query} secret`,
        `${query} trending`,
        `viral ${query}`,
        `${query} growth`
      ]
    };
  }

  // Generate comprehensive hashtags
  private generateComprehensiveHashtags(title: string, platform: string): any {
    const baseHashtags = title.toLowerCase().replace(/[^\w\s]/g, '').split(' ').filter(word => word.length > 2).map(word => `#${word}`);

    return {
      viral: ["#trending", "#viral", "#fyp", "#explore", "#popular"],
      niche: baseHashtags.slice(0, 5),
      branded: [`#${title.replace(/\s+/g, '')}`, "#contentcreator", "#digitalmarketing"],
      platformOptimized: this.getPlatformHashtags(platform)
    };
  }

  private getPlatformHashtags(platform: string): string[] {
    const platformTags = {
      "TikTok": ["#tiktok", "#fyp", "#viral", "#trending"],
      "Instagram": ["#instagram", "#reels", "#explore", "#ig"],
      "YouTube": ["#youtube", "#shorts", "#subscribe", "#content"],
      "LinkedIn": ["#linkedin", "#professional", "#business", "#career"],
      "Twitter": ["#twitter", "#thread", "#discussion", "#trending"]
    };
    return platformTags[platform as keyof typeof platformTags] || ["#content", "#trending"];
  }

  // Generate hook and angles
  private generateHookAndAngles(title: string): any[] {
    return [
      {
        hook: `"Nobody talks about this ${title.toLowerCase()} secret..."`,
        angle: "Contrarian/insider knowledge",
        framework: "Secret revelation"
      },
      {
        hook: `"I tried ${title.toLowerCase()} for 30 days and here's what happened"`,
        angle: "Personal experiment",
        framework: "Transformation story"
      },
      {
        hook: `"The ${title.toLowerCase()} mistake that's costing you everything"`,
        angle: "Problem identification",
        framework: "Pain point solution"
      },
      {
        hook: `"Why everyone's doing ${title.toLowerCase()} wrong (and how to fix it)"`,
        angle: "Corrective teaching",
        framework: "Myth-busting education"
      },
      {
        hook: `"From zero to ${title.toLowerCase()} expert in record time"`,
        angle: "Rapid transformation",
        framework: "Journey documentation"
      }
    ];
  }

  // Generate monetization strategies
  private generateMonetizationStrategies(query: string, category: string): any {
    return {
      direct: [
        `${query} online course or masterclass`,
        `${query} coaching and consulting services`,
        `${query} digital templates and resources`,
        `${query} premium membership community`
      ],
      affiliate: [
        `${query} tool and software recommendations`,
        `${query} book and resource affiliates`,
        `${query} equipment and gear partnerships`,
        `${query} service provider referrals`
      ],
      partnerships: [
        `Brand collaborations in ${query} space`,
        `Cross-promotion with ${query} creators`,
        `Sponsored content opportunities`,
        `Product placement deals`
      ],
      subscriptions: [
        `Weekly ${query} newsletter`,
        `Premium ${query} content library`,
        `Monthly ${query} strategy sessions`,
        `Exclusive ${query} community access`
      ]
    };
  }

  // Generate competition analysis
  private generateCompetitionAnalysis(query: string): any {
    return {
      saturationLevel: Math.random() > 0.6 ? "Medium - growing market with opportunities" : "Low - emerging market with high potential",
      keyPlayers: [
        `@${query.replace(/\s+/g, '')}expert`,
        `@${query.split(' ')[0]}guru`,
        `@the${query.split(' ')[0]}coach`,
        `@${query.replace(/\s+/g, '')}academy`
      ],
      contentGaps: [
        `Beginner-friendly ${query} content`,
        `${query} for specific demographics`,
        `Advanced ${query} techniques`,
        `${query} case studies and examples`
      ],
      difficultyScore: Math.round(30 + Math.random() * 50),
      differentiation: [
        "Personal story and unique perspective",
        "Specific niche or demographic focus",
        "Superior production quality",
        "More comprehensive coverage"
      ]
    };
  }

  // Generate timing and seasonality
  private generateTimingAndSeasonality(timeRange: string, query: string): any {
    return {
      optimalTimes: [
        "Weekday evenings (6-9 PM)",
        "Weekend mornings (9-11 AM)",
        "Lunch break periods (12-2 PM)"
      ],
      seasonalTrends: [
        "Peak interest during Q1 (New Year resolutions)",
        "Summer growth for lifestyle content",
        "Back-to-school surge in educational topics",
        "Holiday season content planning"
      ],
      eventOpportunities: [
        `Industry conferences and ${query} events`,
        "Product launches and updates",
        "Trending news and viral moments",
        "Platform feature releases"
      ],
      longTermPotential: timeRange === "1y" ? "Established trend with staying power" : "Emerging trend with growth runway"
    };
  }

  // Generate viral factors
  private generateViralFactors(query: string): any {
    return {
      shareabilityElements: [
        "Visual appeal and high production value",
        "Actionable tips people want to save",
        "Relatable personal experiences",
        "Surprising or counterintuitive insights"
      ],
      emotionalTriggers: [
        "Inspiration and motivation",
        "Fear of missing out (FOMO)",
        "Social proof and validation",
        "Curiosity and surprise"
      ],
      algorithmAlignment: [
        "High engagement rates favor visibility",
        "Watch time and completion rates matter",
        "Comment and share activity boosts reach",
        "Consistent posting schedule builds momentum"
      ],
      engagementDrivers: [
        "Ask questions to encourage comments",
        "Create shareable moments and quotes",
        "Use trending audio and formats",
        "Collaborate with other creators"
      ]
    };
  }

  // Generate risks and considerations
  private generateRisksAndConsiderations(title: string): any {
    return {
      backlashRisks: [
        "Controversial takes may alienate audience",
        "Oversaturation could lead to content fatigue",
        "Platform policy changes affecting reach"
      ],
      policyConsiderations: [
        "Platform community guidelines compliance",
        "Copyright and fair use considerations",
        "Disclosure requirements for sponsored content"
      ],
      saturationRisks: [
        "Market becoming increasingly competitive",
        "Audience attention span decreasing",
        "Need for constant innovation and freshness"
      ],
      investmentRequirements: [
        "Time investment for content creation",
        "Potential equipment or software costs",
        "Marketing and promotion budget",
        "Continuous learning and skill development"
      ]
    };
  }

  // Generate performance metrics
  private generatePerformanceMetrics(platforms: string[]): any {
    return {
      engagementBenchmarks: [
        "3-6% engagement rate for good performance",
        "10%+ engagement rate for viral content",
        "Comments should be 5-10% of likes"
      ],
      growthIndicators: [
        "Follower growth rate of 5-15% monthly",
        "Consistent view count increases",
        "Cross-platform traffic growth"
      ],
      conversionMetrics: [
        "Click-through rate to bio/links: 2-5%",
        "Email signup conversion: 1-3%",
        "Product/service conversion: 0.5-2%"
      ],
      kpis: platforms.map(platform => `${platform}: Platform-specific metrics`)
    };
  }

  // Advanced filtering
  private applyAdvancedFiltering(trends: TrendSearchResult[], filters: TrendSearchFilters): TrendSearchResult[] {
    if (!trends || !Array.isArray(trends)) {
      console.warn("Invalid trends array for filtering:", trends);
      return [];
    }

    return trends.filter(trend => {
      // Audience size filter
      if (filters.audienceSize !== "all") {
        const volume = trend.metrics.volume;
        const sizeMap = {
          "micro": volume < 10000,
          "medium": volume >= 10000 && volume < 50000,
          "large": volume >= 50000
        };
        if (!sizeMap[filters.audienceSize as keyof typeof sizeMap]) return false;
      }

      // Engagement rate filter
      if (filters.engagementRate !== "all") {
        const engagement = trend.metrics.engagement;
        const engagementMap = {
          "low": engagement < 5,
          "medium": engagement >= 5 && engagement < 10,
          "high": engagement >= 10 && engagement < 15,
          "viral": engagement >= 15
        };
        if (!engagementMap[filters.engagementRate as keyof typeof engagementMap]) return false;
      }

      // Competition level filter
      if (filters.competitionLevel !== "all") {
        const competition = trend.metrics.competitionLevel;
        const compMap = {
          "low": competition < 40,
          "medium": competition >= 40 && competition < 70,
          "high": competition >= 70
        };
        if (!compMap[filters.competitionLevel as keyof typeof compMap]) return false;
      }

      // Monetization potential filter
      if (filters.monetizationPotential !== "all") {
        const monetization = trend.metrics.monetizationScore;
        const monMap = {
          "low": monetization < 40,
          "medium": monetization >= 40 && monetization < 70,
          "high": monetization >= 70
        };
        if (!monMap[filters.monetizationPotential as keyof typeof monMap]) return false;
      }

      return true;
    });
  }

  // Smart ranking algorithm
  private rankTrendsByRelevance(trends: TrendSearchResult[], query: string, filters: TrendSearchFilters): TrendSearchResult[] {
    if (!trends || !Array.isArray(trends)) {
      console.warn("Invalid trends array for ranking:", trends);
      return [];
    }

    return trends.sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;

      // Query relevance (40% weight)
      scoreA += this.calculateQueryRelevance(a.title + " " + a.description, query) * 40;
      scoreB += this.calculateQueryRelevance(b.title + " " + b.description, query) * 40;

      // Trend score (25% weight)
      scoreA += (a.metrics.trendScore / 100) * 25;
      scoreB += (b.metrics.trendScore / 100) * 25;

      // Viral potential (20% weight)
      scoreA += (a.metrics.viralPotential / 100) * 20;
      scoreB += (b.metrics.viralPotential / 100) * 20;

      // Low competition bonus (10% weight)
      scoreA += ((100 - a.metrics.competitionLevel) / 100) * 10;
      scoreB += ((100 - b.metrics.competitionLevel) / 100) * 10;

      // Monetization potential (5% weight)
      scoreA += (a.metrics.monetizationScore / 100) * 5;
      scoreB += (b.metrics.monetizationScore / 100) * 5;

      return scoreB - scoreA;
    });
  }

  // Fallback trends for errors
  private getFallbackTrends(query: string, filters: TrendSearchFilters): TrendSearchResult[] {
    const fallbackTrends = [
      {
        title: `${query} - Emerging Opportunity`,
        description: `Growing trend around ${query} with significant potential for content creators.`,
        category: filters.category || "General"
      },
      {
        title: `Advanced ${query} Strategies`,
        description: `Next-level approaches to ${query} that are gaining traction among professionals.`,
        category: filters.category || "General"
      },
      {
        title: `${query} for Beginners`,
        description: `Accessible entry points into ${query} that are resonating with new audiences.`,
        category: filters.category || "General"
      }
    ];

    return fallbackTrends.map((trend, index) => 
      this.completeTrendData(trend, index, query, filters)
    );
  }

  // Get niche suggestions based on query
  getNicheSuggestions(query: string): NicheDefinition[] {
    return this.findRelevantNiches(query, "all");
  }

  // Get all available niches
  getAllNiches(): NicheDefinition[] {
    return NICHE_DATABASE;
  }
}

export default EnhancedTrendSearchService;
