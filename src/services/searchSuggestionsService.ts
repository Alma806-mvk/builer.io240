import { generateTextContent } from "../../services/geminiService";

export interface SearchSuggestion {
  text: string;
  type: "keyword" | "phrase" | "topic" | "trend";
  popularity: number;
  category: string;
  description?: string;
}

export interface AutocompleteResult {
  suggestions: SearchSuggestion[];
  trendingQueries: string[];
  relatedTopics: string[];
}

class SearchSuggestionsService {
  private static instance: SearchSuggestionsService;
  private suggestionCache = new Map<string, { suggestions: SearchSuggestion[]; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  public static getInstance(): SearchSuggestionsService {
    if (!SearchSuggestionsService.instance) {
      SearchSuggestionsService.instance = new SearchSuggestionsService();
    }
    return SearchSuggestionsService.instance;
  }

  // Trending queries by category
  private readonly trendingQueries = {
    technology: [
      "AI content creation tools 2024",
      "machine learning for beginners",
      "blockchain development trends",
      "cybersecurity best practices",
      "cloud computing comparison",
      "web3 development guide",
      "data science career path",
      "mobile app development",
      "DevOps automation tools",
      "quantum computing basics"
    ],
    business: [
      "digital marketing strategies",
      "e-commerce optimization",
      "startup funding guide",
      "remote team management",
      "customer retention tactics",
      "B2B sales techniques",
      "market research methods",
      "brand building strategies",
      "competitive analysis tools",
      "business model innovation"
    ],
    lifestyle: [
      "sustainable living tips",
      "minimalist home design",
      "healthy meal prep ideas",
      "fitness routine for beginners",
      "meditation techniques",
      "work-life balance",
      "personal finance budgeting",
      "travel planning guide",
      "productivity hacks",
      "mindfulness practices"
    ],
    creative: [
      "video editing techniques",
      "photography composition",
      "graphic design trends",
      "music production basics",
      "creative writing tips",
      "digital art tutorials",
      "animation principles",
      "content creation strategy",
      "social media aesthetics",
      "storytelling methods"
    ],
    education: [
      "online learning platforms",
      "study techniques effective",
      "skill development path",
      "language learning apps",
      "certification programs",
      "career change guide",
      "professional development",
      "interview preparation",
      "resume writing tips",
      "networking strategies"
    ]
  };

  // Get autocomplete suggestions for a query
  async getAutocompleteSuggestions(query: string, category?: string): Promise<AutocompleteResult> {
    if (!query.trim()) {
      return this.getDefaultSuggestions(category);
    }

    // Check cache first
    const cacheKey = `${query.toLowerCase()}_${category || 'all'}`;
    const cached = this.suggestionCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      console.log("🚀 Using cached suggestions");
      return {
        suggestions: cached.suggestions,
        trendingQueries: this.getTrendingForCategory(category),
        relatedTopics: this.getRelatedTopics(query)
      };
    }

    try {
      console.log("🔍 Generating AI-powered suggestions for:", query);
      
      const suggestions = await this.generateAISuggestions(query, category);
      
      // Cache the results
      this.suggestionCache.set(cacheKey, {
        suggestions,
        timestamp: Date.now()
      });

      return {
        suggestions,
        trendingQueries: this.getTrendingForCategory(category),
        relatedTopics: this.getRelatedTopics(query)
      };

    } catch (error) {
      console.error("❌ Suggestion generation error:", error);
      return this.getFallbackSuggestions(query, category);
    }
  }

  // Generate AI-powered suggestions
  private async generateAISuggestions(query: string, category?: string): Promise<SearchSuggestion[]> {
    const suggestionPrompt = `
Generate 8-12 intelligent search suggestions for the query: "${query}"
${category ? `Focus on the ${category} category.` : ''}

The suggestions should be:
1. Relevant and specific
2. Trending and current
3. Actionable for content creators
4. Varied in scope (broad to specific)
5. Include related keywords and phrases

Types of suggestions to include:
- Keyword variations
- Trending phrases
- Related topics
- Specific applications
- Popular combinations

For each suggestion, classify as:
- "keyword": Single important terms
- "phrase": Short 2-4 word phrases  
- "topic": Broader subject areas
- "trend": Currently trending items

Return as JSON array:
[
  {
    "text": "suggestion text",
    "type": "keyword|phrase|topic|trend",
    "popularity": 1-100,
    "category": "category name",
    "description": "brief explanation"
  }
]

Focus on suggestions that would help someone create content or research trends.
`;

    try {
      const responseObj = await generateTextContent({
        userInput: suggestionPrompt,
        contentType: "text",
        platform: "general"
      });

      const response = responseObj?.text || "";

      if (response && typeof response === 'string') {
        const parsed = JSON.parse(response);

        if (Array.isArray(parsed)) {
          return parsed.map(item => this.normalizeSuggestion(item)).slice(0, 12);
        }
      }
    } catch (e) {
      console.log("AI response not JSON, extracting suggestions manually");
    }

    // Fallback: generate rule-based suggestions
    return this.generateRuleBasedSuggestions(query, category);
  }

  // Generate rule-based suggestions as fallback
  private generateRuleBasedSuggestions(query: string, category?: string): SearchSuggestion[] {
    const suggestions: SearchSuggestion[] = [];
    const queryLower = query.toLowerCase();
    const words = queryLower.split(' ').filter(word => word.length > 1);

    // Add exact phrase variations
    suggestions.push({
      text: `${query} tutorial`,
      type: "phrase",
      popularity: 85,
      category: category || "education",
      description: "Step-by-step tutorials"
    });

    suggestions.push({
      text: `${query} tools`,
      type: "phrase", 
      popularity: 90,
      category: category || "technology",
      description: "Best tools and resources"
    });

    suggestions.push({
      text: `${query} 2024`,
      type: "trend",
      popularity: 95,
      category: category || "general",
      description: "Latest 2024 trends"
    });

    suggestions.push({
      text: `best ${query}`,
      type: "phrase",
      popularity: 88,
      category: category || "general",
      description: "Top recommendations"
    });

    suggestions.push({
      text: `${query} for beginners`,
      type: "phrase",
      popularity: 82,
      category: category || "education",
      description: "Beginner-friendly content"
    });

    // Add keyword variations
    if (words.length > 1) {
      words.forEach(word => {
        if (word.length > 3) {
          suggestions.push({
            text: word,
            type: "keyword",
            popularity: 70,
            category: category || "general",
            description: `Related to ${word}`
          });
        }
      });
    }

    // Add trending combinations
    const trendingPrefixes = ["advanced", "ultimate", "complete", "essential", "modern"];
    const trendingSuffixes = ["guide", "tips", "strategies", "techniques", "methods"];

    if (suggestions.length < 12) {
      trendingPrefixes.forEach(prefix => {
        suggestions.push({
          text: `${prefix} ${query}`,
          type: "phrase",
          popularity: 75,
          category: category || "general",
          description: `${prefix} approaches to ${query}`
        });
      });
    }

    if (suggestions.length < 12) {
      trendingSuffixes.forEach(suffix => {
        suggestions.push({
          text: `${query} ${suffix}`,
          type: "phrase",
          popularity: 78,
          category: category || "general", 
          description: `${query} ${suffix} and techniques`
        });
      });
    }

    return suggestions.slice(0, 12);
  }

  // Normalize suggestion from AI response
  private normalizeSuggestion(item: any): SearchSuggestion {
    return {
      text: item.text || "",
      type: item.type || "phrase",
      popularity: Math.max(1, Math.min(100, item.popularity || 50)),
      category: item.category || "general",
      description: item.description || ""
    };
  }

  // Get default suggestions when no query
  private getDefaultSuggestions(category?: string): AutocompleteResult {
    const categoryQueries = category ? this.trendingQueries[category as keyof typeof this.trendingQueries] : [];
    const allQueries = Object.values(this.trendingQueries).flat();
    
    const suggestions: SearchSuggestion[] = (categoryQueries.length > 0 ? categoryQueries : allQueries)
      .slice(0, 10)
      .map(query => ({
        text: query,
        type: "trend" as const,
        popularity: 80 + Math.random() * 20,
        category: category || "trending",
        description: `Popular search in ${category || 'all categories'}`
      }));

    return {
      suggestions,
      trendingQueries: this.getTrendingForCategory(category),
      relatedTopics: []
    };
  }

  // Get fallback suggestions on error
  private getFallbackSuggestions(query: string, category?: string): AutocompleteResult {
    const fallbackSuggestions: SearchSuggestion[] = [
      {
        text: `${query} guide`,
        type: "phrase",
        popularity: 85,
        category: category || "general",
        description: "Comprehensive guides"
      },
      {
        text: `${query} tips`,
        type: "phrase", 
        popularity: 82,
        category: category || "general",
        description: "Helpful tips and tricks"
      },
      {
        text: `${query} 2024`,
        type: "trend",
        popularity: 90,
        category: category || "general", 
        description: "Latest 2024 information"
      }
    ];

    return {
      suggestions: fallbackSuggestions,
      trendingQueries: this.getTrendingForCategory(category),
      relatedTopics: this.getRelatedTopics(query)
    };
  }

  // Get trending queries for specific category
  private getTrendingForCategory(category?: string): string[] {
    if (!category || !this.trendingQueries[category as keyof typeof this.trendingQueries]) {
      // Return mix from all categories
      return Object.values(this.trendingQueries)
        .flat()
        .sort(() => Math.random() - 0.5)
        .slice(0, 6);
    }
    
    return this.trendingQueries[category as keyof typeof this.trendingQueries].slice(0, 6);
  }

  // Get related topics for a query
  private getRelatedTopics(query: string): string[] {
    const queryLower = query.toLowerCase();
    const allQueries = Object.values(this.trendingQueries).flat();
    
    // Find queries that share words with the input query
    const queryWords = queryLower.split(' ').filter(word => word.length > 2);
    const related = allQueries.filter(trendQuery => {
      const trendWords = trendQuery.toLowerCase().split(' ');
      return queryWords.some(word => trendWords.some(trendWord => trendWord.includes(word) || word.includes(trendWord)));
    });
    
    return related.slice(0, 5);
  }

  // Get popular search terms by category
  getPopularSearches(category?: string): string[] {
    return this.getTrendingForCategory(category);
  }

  // Clear suggestion cache
  clearCache(): void {
    this.suggestionCache.clear();
    console.log("🗑️ Search suggestions cache cleared");
  }

  // Get cache statistics
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.suggestionCache.size,
      keys: Array.from(this.suggestionCache.keys())
    };
  }
}

export default SearchSuggestionsService;
