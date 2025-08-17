import { GoogleGenAI } from '@google/genai';
import { ContentStrategyPlanOutput } from '../types';
import { GEMINI_TEXT_MODEL } from '../../constants';

class GoalRegenerationService {
  private genAI: GoogleGenAI;

  constructor() {
    const fallbackApiKey = "AIzaSyDVSNxrbTQqAI4SxWVzkSZEttRHKFm5cj0";
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || fallbackApiKey;

    if (!apiKey) {
      throw new Error('VITE_GEMINI_API_KEY environment variable is required');
    }

    this.genAI = new GoogleGenAI({ apiKey: apiKey as string });
  }

  async regenerateSpecificGoal(
    strategyPlan: ContentStrategyPlanOutput,
    goalIndex: number,
    strategyConfig: any
  ): Promise<string> {
    try {

      const currentGoal = strategyPlan.goals[goalIndex];
      const otherGoals = strategyPlan.goals.filter((_, index) => index !== goalIndex);

      const prompt = `
You are a strategic content planning expert. I need you to regenerate ONE specific strategic goal while maintaining consistency with the existing strategy.

CURRENT STRATEGY CONTEXT:
- Niche: ${strategyConfig.niche}
- Target Audience: ${strategyConfig.targetAudience}
- Platforms: ${strategyConfig.platforms?.join(', ')}
- Timeframe: ${strategyConfig.timeframe}
- Budget: ${strategyConfig.budget}

EXISTING GOALS (keep these for context, but don't change them):
${otherGoals.map((goal, i) => `${i + 1}. ${goal}`).join('\n')}

GOAL TO REGENERATE (position ${goalIndex + 1}):
Current: ${currentGoal}

INSTRUCTIONS:
1. Generate a NEW strategic goal that replaces the current goal at position ${goalIndex + 1}
2. The new goal should be:
   - Specific and measurable
   - Aligned with the niche and target audience
   - Complementary to (not duplicate) the existing goals
   - Achievable within the ${strategyConfig.timeframe} timeframe
   - Appropriate for the ${strategyConfig.budget} budget level
3. Keep the same strategic focus but provide a fresh perspective
4. Make it actionable and results-oriented

RESPONSE FORMAT:
Return ONLY the new goal text, no numbering, no additional text, no explanations.

NEW STRATEGIC GOAL:`;

      const requestConfig = {
        model: GEMINI_TEXT_MODEL,
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          maxOutputTokens: 512,
          temperature: 0.7,
        }
      };

      const response = await this.genAI.models.generateContent(requestConfig);

      // Extract text from response using the correct structure
      const firstCandidate = response.candidates?.[0];
      if (!firstCandidate || !firstCandidate.content || !firstCandidate.content.parts) {
        throw new Error('Invalid response structure from API');
      }

      const firstPart = firstCandidate.content.parts[0];
      if (!firstPart || !firstPart.text) {
        throw new Error('No text content in API response');
      }

      const newGoal = firstPart.text.trim();

      if (!newGoal || newGoal.length < 10) {
        throw new Error('Generated goal is too short or empty');
      }

      return newGoal;
    } catch (error) {
      console.error('Error regenerating specific goal:', error);
      throw new Error('Failed to regenerate goal. Please try again.');
    }
  }

  async regenerateMultipleGoals(
    strategyPlan: ContentStrategyPlanOutput,
    goalIndices: number[],
    strategyConfig: any
  ): Promise<string[]> {
    try {
      const promises = goalIndices.map(index => 
        this.regenerateSpecificGoal(strategyPlan, index, strategyConfig)
      );
      
      return await Promise.all(promises);
    } catch (error) {
      console.error('Error regenerating multiple goals:', error);
      throw new Error('Failed to regenerate goals. Please try again.');
    }
  }
}

export const goalRegenerationService = new GoalRegenerationService();
