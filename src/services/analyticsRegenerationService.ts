import { GoogleGenAI } from '@google/genai';
import { ContentStrategyPlanOutput } from '../types';
import { GEMINI_TEXT_MODEL } from '../../constants';

class AnalyticsRegenerationService {
  private genAI: GoogleGenAI;

  constructor() {
    const fallbackApiKey = "AIzaSyDVSNxrbTQqAI4SxWVzkSZEttRHKFm5cj0";
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || fallbackApiKey;

    if (!apiKey) {
      throw new Error('VITE_GEMINI_API_KEY environment variable is required');
    }

    this.genAI = new GoogleGenAI({ apiKey: apiKey as string });
  }

  async regenerateAnalyticsMetric(
    strategyPlan: ContentStrategyPlanOutput,
    metricText: string,
    metricType: 'primary' | 'advanced',
    metricTitle: string,
    strategyConfig: any
  ): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ 
        model: GEMINI_TEXT_MODEL,
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 200,
        }
      });

      const prompt = `
You are a data analytics expert specializing in content strategy performance metrics. I need you to regenerate ONE specific analytics metric while maintaining consistency with the existing strategy.

CURRENT STRATEGY CONTEXT:
- Niche: ${strategyConfig.niche}
- Target Audience: ${strategyConfig.targetAudience}
- Platforms: ${strategyConfig.platforms?.join(', ')}
- Timeframe: ${strategyConfig.timeframe}
- Budget: ${strategyConfig.budget}

METRIC TO REGENERATE:
- Type: ${metricType.toUpperCase()} KPI
- Current Title: ${metricTitle}
- Current Description: ${metricText}

INSTRUCTIONS:
1. Generate a NEW ${metricType} analytics metric that replaces the current one
2. The new metric should be:
   - Specific and measurable
   - Aligned with the niche and target audience
   - Relevant to the platforms being used
   - Different from the current metric but equally valuable
   - Include specific targets or benchmarks where applicable

3. For PRIMARY metrics: Focus on core business objectives (growth, engagement, conversion)
4. For ADVANCED metrics: Focus on deeper insights (CLV, attribution, performance indices)

EXAMPLES of good metrics:
- Primary: "Achieve 25% engagement rate increase within 6 months across all platforms"
- Advanced: "Track customer acquisition cost reduction of 30% through organic content"

OUTPUT REQUIREMENTS:
- Provide ONLY the new metric description
- Be specific with numbers and timeframes
- Keep it under 150 characters
- Make it actionable and measurable

New ${metricType} metric:`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const newMetric = response.text().trim();

      if (!newMetric || newMetric.length < 10) {
        throw new Error('Generated metric is too short or empty');
      }

      console.log('✅ Analytics metric regenerated successfully:', newMetric);
      return newMetric;

    } catch (error) {
      console.error('❌ Error regenerating analytics metric:', error);
      
      // Provide fallback metrics based on type
      const fallbackMetrics = {
        primary: [
          "Increase overall engagement rate by 15% within next quarter",
          "Achieve 30% growth in target audience reach over 6 months", 
          "Improve conversion rate from content views to actions by 20%",
          "Boost brand mention sentiment score to 85% positive"
        ],
        advanced: [
          "Reduce customer acquisition cost by 25% through content optimization",
          "Increase average session duration by 40% across all content",
          "Achieve 90% content-to-conversion attribution accuracy",
          "Improve lifetime value prediction accuracy to 95%"
        ]
      };

      const randomMetric = fallbackMetrics[metricType][Math.floor(Math.random() * fallbackMetrics[metricType].length)];
      console.log('🔄 Using fallback metric:', randomMetric);
      return randomMetric;
    }
  }

  async regeneratePrimaryMetric(
    strategyPlan: ContentStrategyPlanOutput, 
    currentMetric: string,
    metricIndex: number,
    strategyConfig: any
  ): Promise<string> {
    return this.regenerateAnalyticsMetric(
      strategyPlan, 
      currentMetric, 
      'primary',
      `Primary KPI ${metricIndex + 1}`,
      strategyConfig
    );
  }

  async regenerateAdvancedMetric(
    strategyPlan: ContentStrategyPlanOutput,
    currentMetric: string,
    metricTitle: string,
    strategyConfig: any
  ): Promise<string> {
    return this.regenerateAnalyticsMetric(
      strategyPlan,
      currentMetric,
      'advanced', 
      metricTitle,
      strategyConfig
    );
  }
}

// Export singleton instance
export const analyticsRegenerationService = new AnalyticsRegenerationService();
export default analyticsRegenerationService;
