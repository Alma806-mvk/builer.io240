import { GoogleGenAI } from '@google/genai';
import { ContentStrategyPlanOutput } from '../types';
import { GEMINI_TEXT_MODEL } from '../../constants';

class RiskManagementRegenerationService {
  private genAI: GoogleGenAI;

  constructor() {
    const fallbackApiKey = "AIzaSyDVSNxrbTQqAI4SxWVzkSZEttRHKFm5cj0";
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || fallbackApiKey;

    if (!apiKey) {
      throw new Error('VITE_GEMINI_API_KEY environment variable is required');
    }

    this.genAI = new GoogleGenAI({ apiKey: apiKey as string });
  }

  async regenerateRiskManagementItem(
    strategyPlan: ContentStrategyPlanOutput,
    itemText: string,
    riskType: string,
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

      const riskTypeInstructions = {
        'content': {
          focus: 'Content-related risks and mitigation strategies',
          examples: 'Copyright issues, content quality drops, viral backlash, content burnout',
          requirements: 'Specific prevention methods, response protocols, and recovery strategies'
        },
        'platform': {
          focus: 'Platform dependency and algorithm change risks',
          examples: 'Algorithm updates, policy changes, account suspension, platform decline',
          requirements: 'Diversification strategies, backup plans, and adaptation protocols'
        },
        'crisis': {
          focus: 'Crisis management and reputation protection',
          examples: 'PR disasters, negative feedback, controversy management, community backlash',
          requirements: 'Response timelines, communication strategies, and damage control'
        },
        'burnout': {
          focus: 'Creator burnout prevention and mental health',
          examples: 'Content creation fatigue, perfectionism, social media pressure, work-life balance',
          requirements: 'Prevention strategies, early warning signs, and recovery protocols'
        },
        'financial': {
          focus: 'Financial risks and revenue protection',
          examples: 'Revenue drops, sponsor loss, market changes, economic downturns',
          requirements: 'Diversification plans, emergency funds, and alternative income streams'
        }
      };

      // Determine risk category based on the risk type
      let category = 'crisis';
      const lowerType = riskType.toLowerCase();
      if (lowerType.includes('content') || lowerType.includes('copyright')) category = 'content';
      else if (lowerType.includes('platform') || lowerType.includes('algorithm')) category = 'platform';
      else if (lowerType.includes('burnout') || lowerType.includes('mental') || lowerType.includes('health')) category = 'burnout';
      else if (lowerType.includes('financial') || lowerType.includes('revenue') || lowerType.includes('money')) category = 'financial';

      const typeConfig = riskTypeInstructions[category];

      const prompt = `
You are a risk management expert specializing in content creator and digital marketing business risks. I need you to regenerate ONE specific risk management strategy while maintaining consistency with the existing business strategy.

CURRENT STRATEGY CONTEXT:
- Niche: ${strategyConfig.niche}
- Target Audience: ${strategyConfig.targetAudience}
- Platforms: ${strategyConfig.platforms?.join(', ')}
- Timeframe: ${strategyConfig.timeframe}
- Budget: ${strategyConfig.budget}

RISK TO ADDRESS:
- Risk Category: ${category.toUpperCase()}
- Current Title: ${itemTitle}
- Current Strategy: ${itemText}

FOCUS AREA: ${typeConfig.focus}
EXAMPLES: ${typeConfig.examples}
REQUIREMENTS: ${typeConfig.requirements}

INSTRUCTIONS:
1. Generate a NEW risk management strategy that replaces the current one
2. The new strategy should be:
   - Comprehensive and actionable
   - Aligned with the niche and target audience
   - Relevant to the platforms being used
   - Different from the current strategy but equally valuable
   - Include specific timelines, protocols, or metrics where applicable

3. For CONTENT risks: Focus on quality control, copyright protection, and content strategy resilience
4. For PLATFORM risks: Focus on diversification, algorithm adaptation, and platform independence
5. For CRISIS risks: Focus on rapid response, communication protocols, and reputation recovery
6. For BURNOUT risks: Focus on prevention, early detection, and sustainable practices
7. For FINANCIAL risks: Focus on revenue diversification, emergency planning, and market adaptation

RISK MANAGEMENT EXAMPLES:
- Content: "Implement content review checklist with legal compliance verification and 48-hour approval process"
- Platform: "Maintain presence on 3+ platforms with 40% audience overlap to reduce single-platform dependency"
- Crisis: "Deploy 24-hour crisis response protocol with pre-approved messaging templates and stakeholder communication plan"
- Burnout: "Schedule mandatory 2-week breaks quarterly with content bank preparation and guest creator partnerships"
- Financial: "Maintain 6-month expense reserve with 3 diversified revenue streams and monthly financial health reviews"

OUTPUT REQUIREMENTS:
- Provide ONLY the new risk management strategy
- Be specific with timelines, processes, and measurable outcomes
- Keep it under 200 words
- Make it actionable and implementable

New ${category} risk management strategy:`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const newStrategy = response.text().trim();

      if (!newStrategy || newStrategy.length < 20) {
        throw new Error('Generated strategy is too short or empty');
      }

      console.log(`✅ ${riskType} risk management strategy regenerated successfully:`, newStrategy);
      return newStrategy;

    } catch (error) {
      console.error(`❌ Error regenerating ${riskType} risk management strategy:`, error);
      
      // Provide fallback strategies based on category
      const fallbackStrategies = {
        content: [
          "Establish content approval workflow with legal review for sensitive topics and maintain content calendar 30 days ahead",
          "Create content quality checklist with peer review system and regular brand guideline audits every quarter",
          "Implement copyright clearance process with licensed content database and fair use documentation protocol",
          "Develop content crisis response plan with 24-hour review cycle and community management escalation procedures"
        ],
        platform: [
          "Diversify across 4+ platforms with cross-platform content strategy and independent audience building on each",
          "Monitor algorithm changes weekly and maintain direct communication channels (email, SMS) with core audience",
          "Create platform backup strategy with content export procedures and alternative hosting solutions prepared",
          "Build owned media properties (website, newsletter) to reduce platform dependency and control audience access"
        ],
        crisis: [
          "Develop 72-hour crisis response protocol with pre-approved statements and stakeholder communication hierarchy",
          "Create reputation monitoring system with daily brand mention alerts and sentiment analysis tracking",
          "Establish crisis communication team with designated spokespeople and media training for key personnel",
          "Implement proactive community management with conflict de-escalation training and response time standards"
        ],
        burnout: [
          "Schedule mandatory rest periods with content batch creation and automated posting to maintain consistency",
          "Implement workload monitoring with weekly check-ins and productivity metrics to identify early burnout signs",
          "Create support network with peer creators and mental health resources including therapy and coaching access",
          "Establish sustainable content creation schedule with realistic goals and buffer time for personal projects"
        ],
        financial: [
          "Maintain 6-month operating expense reserve with diversified income streams and monthly financial health reviews",
          "Create revenue protection plan with contract insurance and payment terms negotiation for all partnerships",
          "Develop alternative income strategies with passive revenue streams and emergency monetization protocols",
          "Implement financial risk assessment with quarterly budget reviews and market condition impact analysis"
        ]
      };

      // Determine category for fallback
      let fallbackCategory = 'crisis';
      const lowerType = riskType.toLowerCase();
      if (lowerType.includes('content') || lowerType.includes('copyright')) fallbackCategory = 'content';
      else if (lowerType.includes('platform') || lowerType.includes('algorithm')) fallbackCategory = 'platform';
      else if (lowerType.includes('burnout') || lowerType.includes('mental') || lowerType.includes('health')) fallbackCategory = 'burnout';
      else if (lowerType.includes('financial') || lowerType.includes('revenue') || lowerType.includes('money')) fallbackCategory = 'financial';

      const randomStrategy = fallbackStrategies[fallbackCategory][Math.floor(Math.random() * fallbackStrategies[fallbackCategory].length)];
      console.log(`🔄 Using fallback ${fallbackCategory} strategy:`, randomStrategy);
      return randomStrategy;
    }
  }

  async regenerateRiskItem(
    strategyPlan: ContentStrategyPlanOutput, 
    currentItem: string,
    riskType: string,
    strategyConfig: any
  ): Promise<string> {
    return this.regenerateRiskManagementItem(
      strategyPlan, 
      currentItem, 
      riskType,
      riskType.replace(/([A-Z])/g, ' $1').trim(),
      strategyConfig
    );
  }
}

// Export singleton instance
export const riskManagementRegenerationService = new RiskManagementRegenerationService();
export default riskManagementRegenerationService;
