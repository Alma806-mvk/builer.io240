import { generateTextContent } from '../../services/geminiService';

export interface PillarRegenerationContext {
  currentPillar: any;
  otherPillars: any[];
  niche?: string;
  targetAudience?: string;
  platforms?: string[];
  goals?: string[];
}

class PillarRegenerationService {

  async regenerateContentPillar(context: PillarRegenerationContext): Promise<any> {
    const { currentPillar, otherPillars, niche, targetAudience, platforms, goals } = context;

    const existingPillarNames = otherPillars.map(p => p.pillarName).join(', ');
    
    const prompt = `
Regenerate this content pillar to be fresh and unique while maintaining strategic coherence.

**CURRENT PILLAR TO REGENERATE:**
Name: ${currentPillar.pillarName}
Description: ${currentPillar.description}

**CONTEXT:**
- Niche: ${niche || 'General content creation'}
- Target Audience: ${targetAudience || 'Content enthusiasts'}
- Platforms: ${platforms?.join(', ') || 'Multi-platform'}
- Goals: ${goals?.join(', ') || 'Growth and engagement'}

**OTHER EXISTING PILLARS (avoid overlap):**
${existingPillarNames}

**REQUIREMENTS:**
1. Create a COMPLETELY NEW pillar concept that's different from the current one
2. Ensure it doesn't overlap with existing pillars: ${existingPillarNames}
3. Make it highly relevant to the niche: ${niche}
4. Align with the target audience: ${targetAudience}
5. Optimize for the specified platforms

**OUTPUT FORMAT (JSON):**
{
  "pillarName": "Unique, catchy pillar name (2-4 words)",
  "description": "Compelling 2-3 sentence description explaining the pillar's purpose and value",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "contentTypes": ["content type 1", "content type 2", "content type 3"],
  "postingFrequency": "Specific frequency (e.g., '3x per week', 'Daily', 'Bi-weekly')",
  "engagementStrategy": "Detailed 1-2 sentence strategy for engaging audience with this pillar"
}

Generate a fresh, innovative content pillar that would enhance the overall content strategy.
`;

    try {
      console.log('🤖 Using working generateTextContent function...');
      console.log('📝 Prompt being sent:', prompt.substring(0, 200) + '...');

      const responseObj = await generateTextContent({
        userInput: prompt,
        contentType: "text",
        platform: "general"
      });

      const responseText = responseObj?.text || "";
      console.log('📥 Received response from generateTextContent:', responseText);
      
      // Clean and parse the response
      let cleanedResponse = responseText.trim();
      console.log('📝 Raw response text:', responseText);

      // Remove any markdown code block markers
      cleanedResponse = cleanedResponse.replace(/```json\s*/, '').replace(/```\s*$/, '');
      console.log('🧹 Cleaned response:', cleanedResponse);

      // Find JSON content
      const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('❌ No JSON found in response:', cleanedResponse);
        throw new Error(`No valid JSON found in response: ${cleanedResponse.substring(0, 100)}...`);
      }

      console.log('🔍 JSON match found:', jsonMatch[0]);
      const pillarData = JSON.parse(jsonMatch[0]);
      console.log('✅ Parsed pillar data:', pillarData);
      
      // Validate required fields
      const requiredFields = ['pillarName', 'description', 'keywords', 'contentTypes', 'postingFrequency', 'engagementStrategy'];
      for (const field of requiredFields) {
        if (!pillarData[field]) {
          throw new Error(`Missing required field: ${field}`);
        }
      }
      
      // Ensure arrays are properly formatted
      if (!Array.isArray(pillarData.keywords)) {
        pillarData.keywords = [];
      }
      if (!Array.isArray(pillarData.contentTypes)) {
        pillarData.contentTypes = [];
      }
      
      return pillarData;
    } catch (error) {
      console.error('Pillar regeneration failed:', error);
      
      // Fallback pillar based on current pillar but with variations
      const fallbackPillars = [
        {
          pillarName: "Educational Excellence",
          description: "High-value educational content that teaches practical skills and shares expert knowledge with actionable takeaways.",
          keywords: ["tutorials", "how-to", "education", "learning", "skills"],
          contentTypes: ["Video Tutorials", "Step-by-step Guides", "Educational Posts"],
          postingFrequency: "3x per week",
          engagementStrategy: "Use interactive elements like quizzes and encourage questions to create learning discussions."
        },
        {
          pillarName: "Behind the Scenes",
          description: "Authentic glimpses into the creative process, daily routines, and personal journey to build deeper connections.",
          keywords: ["authentic", "process", "journey", "personal", "transparent"],
          contentTypes: ["Process Videos", "Daily Vlogs", "Workspace Tours"],
          postingFrequency: "2x per week",
          engagementStrategy: "Share vulnerable moments and ask audience about their own experiences to foster community."
        },
        {
          pillarName: "Trend Analysis",
          description: "Timely commentary on industry trends, news, and emerging topics with unique perspective and insights.",
          keywords: ["trends", "analysis", "commentary", "insights", "current"],
          contentTypes: ["Trend Reports", "News Commentary", "Prediction Posts"],
          postingFrequency: "4x per week",
          engagementStrategy: "Encourage debate and discussion by asking audience for their predictions and opinions."
        }
      ];
      
      // Return a random fallback that's different from the current pillar
      const availableFallbacks = fallbackPillars.filter(
        fb => fb.pillarName.toLowerCase() !== currentPillar.pillarName.toLowerCase()
      );
      
      return availableFallbacks[Math.floor(Math.random() * availableFallbacks.length)] || fallbackPillars[0];
    }
  }
}

export const pillarRegenerationService = new PillarRegenerationService();
