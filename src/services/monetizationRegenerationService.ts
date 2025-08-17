import { GoogleGenAI } from '@google/genai';
import { ContentStrategyPlanOutput } from '../types';
import { GEMINI_TEXT_MODEL } from '../../constants';

class MonetizationRegenerationService {
  private genAI: GoogleGenAI;

  constructor() {
    const fallbackApiKey = "AIzaSyDVSNxrbTQqAI4SxWVzkSZEttRHKFm5cj0";
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || fallbackApiKey;

    if (!apiKey) {
      throw new Error('VITE_GEMINI_API_KEY environment variable is required');
    }

    this.genAI = new GoogleGenAI({ apiKey: apiKey as string });
  }

  async regenerateMonetizationItem(
    strategyPlan: ContentStrategyPlanOutput,
    itemText: string,
    itemType: 'revenue-stream' | 'pricing-strategy' | 'conversion-funnel',
    itemTitle: string,
    strategyConfig: any
  ): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ 
        model: GEMINI_TEXT_MODEL,
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 250,
        }
      });

      const typeInstructions = {
        'revenue-stream': {
          focus: 'Revenue generation methods and income sources',
          examples: 'Direct sales, subscription models, affiliate marketing, sponsorships, course sales',
          requirements: 'Specific revenue amounts, timeframes, and growth targets'
        },
        'pricing-strategy': {
          focus: 'Pricing models, tiers, and value proposition',
          examples: 'Freemium model, tiered pricing, value-based pricing, dynamic pricing',
          requirements: 'Specific price points, packages, and competitive positioning'
        },
        'conversion-funnel': {
          focus: 'Customer journey optimization and conversion tactics',
          examples: 'Lead magnets, email sequences, sales pages, upsell strategies',
          requirements: 'Conversion rates, touchpoints, and optimization tactics'
        }
      };

      const typeConfig = typeInstructions[itemType];

      const prompt = `
You are a monetization strategy expert specializing in content business models. I need you to regenerate ONE specific ${itemType.replace('-', ' ')} while maintaining consistency with the existing strategy.

CURRENT STRATEGY CONTEXT:
- Niche: ${strategyConfig.niche}
- Target Audience: ${strategyConfig.targetAudience}
- Platforms: ${strategyConfig.platforms?.join(', ')}
- Timeframe: ${strategyConfig.timeframe}
- Budget: ${strategyConfig.budget}

ITEM TO REGENERATE:
- Type: ${itemType.toUpperCase().replace('-', ' ')}
- Current Title: ${itemTitle}
- Current Description: ${itemText}

FOCUS AREA: ${typeConfig.focus}
EXAMPLES: ${typeConfig.examples}
REQUIREMENTS: ${typeConfig.requirements}

INSTRUCTIONS:
1. Generate a NEW ${itemType.replace('-', ' ')} that replaces the current one
2. The new item should be:
   - Highly specific and actionable
   - Aligned with the niche and target audience
   - Relevant to the platforms being used
   - Different from the current item but equally valuable
   - Include specific numbers, percentages, or targets where applicable

3. For REVENUE STREAMS: Focus on scalable income sources with clear targets
4. For PRICING STRATEGY: Focus on competitive pricing with clear value tiers
5. For CONVERSION FUNNEL: Focus on high-converting sequences with optimization points

MONETIZATION EXAMPLES:
- Revenue Stream: "Launch premium membership tier at $47/month targeting 500 members within 6 months"
- Pricing Strategy: "3-tier SaaS model: Basic ($19/mo), Pro ($49/mo), Enterprise ($99/mo) with 14-day free trial"
- Conversion Funnel: "Free lead magnet → Email sequence (7 days) → Webinar pitch → Course sale (target 8% conversion)"

OUTPUT REQUIREMENTS:
- Provide ONLY the new ${itemType.replace('-', ' ')} description
- Be specific with numbers, targets, and implementation details
- Keep it under 200 characters
- Make it actionable and measurable

New ${itemType.replace('-', ' ')}:`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const newItem = response.text().trim();

      if (!newItem || newItem.length < 15) {
        throw new Error('Generated item is too short or empty');
      }

      console.log(`✅ ${itemType} regenerated successfully:`, newItem);
      return newItem;

    } catch (error) {
      console.error(`❌ Error regenerating ${itemType}:`, error);
      
      // Provide fallback items based on type
      const fallbackItems = {
        'revenue-stream': [
          "Premium course sales targeting $25,000 monthly recurring revenue",
          "Affiliate marketing partnerships generating 20% commission rates",
          "Sponsored content deals averaging $2,500 per collaboration",
          "Membership community with $97/month recurring subscriptions"
        ],
        'pricing-strategy': [
          "Tiered pricing: Basic ($29), Pro ($79), Premium ($149) with annual discounts",
          "Freemium model with 14-day premium trial converting at 12% rate",
          "Value-based pricing starting at $497 for comprehensive solutions",
          "Dynamic pricing based on audience size and engagement metrics"
        ],
        'conversion-funnel': [
          "Free webinar → Email sequence → Course pitch achieving 8% conversion",
          "Lead magnet → Nurture sequence → Sales call booking funnel",
          "Content marketing → Email list → Product launch sequence",
          "Social media → Landing page → Tripwire → Core offer funnel"
        ]
      };

      const randomItem = fallbackItems[itemType][Math.floor(Math.random() * fallbackItems[itemType].length)];
      console.log(`🔄 Using fallback ${itemType}:`, randomItem);
      return randomItem;
    }
  }

  async regenerateRevenueStream(
    strategyPlan: ContentStrategyPlanOutput, 
    currentItem: string,
    itemIndex: number,
    strategyConfig: any
  ): Promise<string> {
    return this.regenerateMonetizationItem(
      strategyPlan, 
      currentItem, 
      'revenue-stream',
      `Revenue Stream ${itemIndex + 1}`,
      strategyConfig
    );
  }

  async regeneratePricingStrategy(
    strategyPlan: ContentStrategyPlanOutput,
    currentItem: string,
    strategyConfig: any
  ): Promise<string> {
    return this.regenerateMonetizationItem(
      strategyPlan,
      currentItem,
      'pricing-strategy', 
      'Pricing Strategy',
      strategyConfig
    );
  }

  async regenerateConversionFunnel(
    strategyPlan: ContentStrategyPlanOutput,
    currentItem: string,
    strategyConfig: any
  ): Promise<string> {
    return this.regenerateMonetizationItem(
      strategyPlan,
      currentItem,
      'conversion-funnel', 
      'Conversion Funnel',
      strategyConfig
    );
  }
}

// Export singleton instance
export const monetizationRegenerationService = new MonetizationRegenerationService();
export default monetizationRegenerationService;
