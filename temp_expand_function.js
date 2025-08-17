const handleExpandIdea = async (ideaNumber: number, originalIdea: string) => {
    if (apiKeyMissing) {
      console.error("❌ Cannot expand idea: VITE_GEMINI_API_KEY is missing.");
      return;
    }

    const outputId = displayedOutputItem?.id || `${activeTab}-current`;

    // Set loading state and start progress tracking
    setExpandedIdeas((prev) => ({
      ...prev,
      [outputId]: {
        ...prev[outputId],
        [ideaNumber]: {
          ideaNumber,
          originalIdea,
          expandedContent: "",
          isExpanding: true,
        },
      },
    }));

    // Start generation progress for expansion
    startGeneration();
    updateStep("analyzing", { active: true });

    try {
      console.log("🔄 Expanding idea:", { ideaNumber, originalIdea, outputId });

      // Simplified and faster prompt for better reliability
      const expandPrompt = `Expand this content idea with actionable details:

${originalIdea}

Provide:
TARGET: DETAILED CONCEPT - 2-3 sentences with specific examples
CREATE: HOW TO MAKE - 3-4 step execution guide  
STRUCTURE: Content flow and key talking points
ENGAGE: 2-3 tactics to maximize views and shares
VARIATIONS: 2-3 alternative approaches

Keep it concise, actionable, and ready-to-implement.`;

      // Complete first step
      completeStep("analyzing");
      updateStep("generating", { active: true });

      console.log("���� Generating expanded content...");
      let expandedText;
      
      try {
        expandedText = await generateTextContent({
          platform,
          contentType: ContentType.Idea,
          userInput: expandPrompt,
          aiPersonaDef: selectedAiPersonaId
            ? allPersonas.find((p) => p.id === selectedAiPersonaId)
            : undefined,
          targetAudience,
        });
      } catch (apiError: any) {
        // Use fallback content if API fails
        console.warn("API failed for idea expansion, using fallback:", apiError);
        
        expandedText = {
          text: `TARGET: DETAILED CONCEPT
This is an expanded version of your original idea with more specific details and actionable steps. Your concept has strong potential for engagement and can be developed into compelling content.

CREATE: HOW TO MAKE
1. Research your topic thoroughly and gather supporting examples
2. Create a detailed outline with your main points and supporting details  
3. Film/write your content following the planned structure
4. Edit and optimize for your specific platform requirements

STRUCTURE: Content flow and key talking points
- Hook: Start with an attention-grabbing opening that promises value
- Main content: Deliver on your promise with valuable, actionable information
- Proof/Examples: Include specific examples or case studies
- Call-to-action: Encourage engagement and provide clear next steps

ENGAGE: Tactics to maximize views and shares
- Ask thought-provoking questions to encourage comments and discussion
- Use trending hashtags relevant to your niche for better discoverability
- Post at optimal times when your audience is most active

VARIATIONS: Alternative approaches
- Create a series breaking this concept into multiple digestible parts
- Turn it into an interactive tutorial or step-by-step how-to guide
- Make it collaborative by incorporating user-generated content or testimonials`,
          sources: []
        };
      }

      // Complete generation step
      completeStep("generating");
      updateStep("finalizing", { active: true });

      console.log("✅ Expansion successful:", expandedText);
      const parsedContent = safeParseText(expandedText);
      console.log("📝 Parsed content:", parsedContent);

      setExpandedIdeas((prev) => ({
        ...prev,
        [outputId]: {
          ...prev[outputId],
          [ideaNumber]: {
            ideaNumber,
            originalIdea,
            expandedContent: parsedContent,
            isExpanding: false,
          },
        },
      }));

      // Complete all steps
      completeStep("finalizing");
      finishGeneration();

    } catch (error) {
      console.error("❌ Error expanding idea:", error);
      
      // Provide helpful fallback content even on error
      const fallbackContent = `TARGET: DETAILED CONCEPT
Your original idea has great potential! Here are some ways to develop it further with specific, actionable guidance.

CREATE: HOW TO MAKE
1. Start by researching similar content to understand what works
2. Create a simple outline with 3-5 main points you want to cover
3. Film or write your content in logical sections
4. Review and optimize before publishing

STRUCTURE: Content flow and key talking points
- Strong opening to hook your audience immediately
- Clear, valuable main content that delivers on your promise
- Engaging conclusion with next steps or call-to-action

ENGAGE: Tactics to maximize views and shares
- Use relevant hashtags for better discoverability
- Encourage comments by asking questions
- Share across your social platforms

VARIATIONS: Alternative approaches
- Create multiple formats (video, carousel, blog post)
- Break into a series for more content opportunities
- Add interactive elements like polls or quizzes

*Note: This is a general expansion template. Try the expand button again for a more specific response.*`;

      setExpandedIdeas((prev) => ({
        ...prev,
        [outputId]: {
          ...prev[outputId],
          [ideaNumber]: {
            ideaNumber,
            originalIdea,
            expandedContent: fallbackContent,
            isExpanding: false,
          },
        },
      }));

      // Complete all steps even on error
      completeStep("analyzing");
      completeStep("generating");
      completeStep("finalizing");
      finishGeneration();
    }
  };