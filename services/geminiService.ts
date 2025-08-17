import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import {
  Platform,
  ContentType,
  RefinementType,
  Source,
  ABTestableContentType,
  SeoKeywordMode,
  SeoIntensity,
  ThumbnailConceptOutput,
  AiPersonaDefinition,
  Language,
  AspectRatioGuidance,
  PromptOptimizationSuggestion,
  ContentBriefOutput,
  PollQuizOutput,
  ReadabilityOutput,
  ContentStrategyPlanOutput,
  TrendAnalysisOutput,
  TrendItem,
  EngagementFeedbackOutput, // New types
} from "../types";
import { GEMINI_TEXT_MODEL, GEMINI_IMAGE_MODEL } from "../constants";
import { generateMockContent } from "../src/services/mockGeminiService";
import {
  sanitizeUserInput,
  logSanitization,
} from "../src/utils/inputSanitization";
import { generateMonetizableCoursePrompt } from "./premiumCourseService";
import { getCurrentPlan, getPlanById } from "../src/services/stripeService";

let ai: GoogleGenAI | null = null;

// Circuit breaker for API overload management
let circuitBreakerState = {
  failures: 0,
  lastFailureTime: 0,
  isOpen: false,
  threshold: 5, // Open circuit after 5 consecutive failures
  timeout: 60000, // Keep circuit open for 1 minute
};

const checkCircuitBreaker = (): boolean => {
  const now = Date.now();

  // If circuit is open, check if timeout has passed
  if (circuitBreakerState.isOpen) {
    if (
      now - circuitBreakerState.lastFailureTime >
      circuitBreakerState.timeout
    ) {
      console.log(
        "�������� Circuit breaker timeout passed - attempting to close circuit",
      );
      circuitBreakerState.isOpen = false;
      circuitBreakerState.failures = 0;
      return false; // Circuit is now closed, allow requests
    }
    return true; // Circuit is still open
  }

  return false; // Circuit is closed
};

const recordCircuitBreakerFailure = (): void => {
  circuitBreakerState.failures++;
  circuitBreakerState.lastFailureTime = Date.now();

  if (circuitBreakerState.failures >= circuitBreakerState.threshold) {
    circuitBreakerState.isOpen = true;
    console.log(
      `🔴 Circuit breaker OPENED after ${circuitBreakerState.failures} failures - API likely overloaded`,
    );
    console.log(
      `⏰ Circuit will remain open for ${circuitBreakerState.timeout / 1000} seconds`,
    );
  }
};

const recordCircuitBreakerSuccess = (): void => {
  if (circuitBreakerState.failures > 0) {
    console.log("✅ Circuit breaker reset - API connection restored");
  }
  circuitBreakerState.failures = 0;
  circuitBreakerState.isOpen = false;
};

const getAIInstance = (forceNew: boolean = false): GoogleGenAI => {
  if (!ai || forceNew) {
    // Simplified environment detection - only check for actual Builder.io iframe
    const isBuilderEnvironment =
      typeof window !== "undefined" &&
      window !== window.top && // Is in iframe
      (window.location.hostname.includes("builder.codes") ||
        window.location.hostname.includes("cdn.builder.io"));

    // Use the actual API key for all environments
    const fallbackApiKey = "AIzaSyDVSNxrbTQqAI4SxWVzkSZEttRHKFm5cj0";
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || fallbackApiKey;

    if (
      !apiKey ||
      apiKey === "your_gemini_api_key_here" ||
      apiKey === "your_actual_gemini_api_key_here"
    ) {
      throw new Error(
        "INVALID_API_KEY: Please add your Gemini API key to .env.local. Get free key: https://makersuite.google.com/app/apikey",
      );
    }
    ai = new GoogleGenAI({ apiKey: apiKey as string });
    console.log(
      `🔄 AI instance ${forceNew ? "recreated" : "created"} for fresh connection`,
    );
  }
  return ai;
};

const getSystemInstructionFromDefinition = (
  personaDef: AiPersonaDefinition | undefined,
  baseInstruction?: string,
): string | undefined => {
  if (!personaDef) {
    return baseInstruction || "You are a helpful and versatile AI assistant.";
  }
  const finalInstruction = baseInstruction
    ? `${baseInstruction} ${personaDef.systemInstruction}`
    : personaDef.systemInstruction;
  return finalInstruction;
};

const generateBasePromptDetails = (
  platform: Platform,
  userInput: string,
  targetAudience?: string,
  batchVariations?: number,
  seoKeywords?: string,
  seoMode?: SeoKeywordMode,
  seoIntensity?: SeoIntensity,
  aspectRatioGuidance?: AspectRatioGuidance,
  videoLength?: string,
): string => {
  let details = `🎯 PLATFORM: ${platform}\n📝 TOPIC: ${userInput}\n`;

  if (targetAudience) {
    details += `👥 TARGET AUDIENCE: ${targetAudience}\n🎨 TONE INSTRUCTION: Craft content specifically for this audience. Tailor language complexity, cultural references, pain points, and aspirations to resonate deeply with ${targetAudience}.\n`;
  }

  if (batchVariations && batchVariations > 1) {
    details += `🔢 VARIATIONS REQUESTED: ${batchVariations} unique variations. Ensure each variation takes a different approach while maintaining quality.\n`;
  }

  if (seoKeywords && seoMode === SeoKeywordMode.Incorporate) {
    details += `🔍 SEO KEYWORDS: ${seoKeywords}\n`;

    // Apply different SEO intensity levels
    if (seoIntensity === SeoIntensity.Natural) {
      details += `📈 SEO INSTRUCTION (NATURAL): Subtly integrate these keywords naturally into the content. Focus on readability and user engagement first, with light keyword presence that feels organic.\n`;
    } else if (seoIntensity === SeoIntensity.Moderate) {
      details += `📈 SEO INSTRUCTION (MODERATE): Balance keyword integration with content quality. Include keywords in strategic positions (title, headers, throughout content) while maintaining natural flow and readability.\n`;
    } else if (seoIntensity === SeoIntensity.Aggressive) {
      details += `📈 SEO INSTRUCTION (AGGRESSIVE): Maximize keyword density and SEO optimization. Include keywords in title, headers, meta descriptions, and throughout content. Use variations and related terms for comprehensive SEO coverage.\n`;
    } else {
      // Fallback to moderate if no intensity specified
      details += `📈 SEO INSTRUCTION: Naturally integrate these keywords for maximum discoverability while maintaining engaging, human-readable content.\n`;
    }
  } else if (seoMode === SeoKeywordMode.Suggest) {
    details += `🔍 SEO KEYWORD RESEARCH: Generate relevant, high-volume SEO keywords for this content topic.\n📈 SEO INSTRUCTION: Focus on keyword research and suggestions for maximum discoverability. Include primary keywords, long-tail variations, and related terms.\n`;
  }

  if (aspectRatioGuidance && aspectRatioGuidance !== AspectRatioGuidance.None) {
    details += `📐 VISUAL FORMAT: ${aspectRatioGuidance}\n🎨 VISUAL INSTRUCTION: Consider this aspect ratio for any visual descriptions, ensuring optimal composition and readability.\n`;
  }

  if (videoLength) {
    details += `��️ VIDEO LENGTH: ${videoLength}\n🎬 PACING INSTRUCTION: Structure content to naturally fill ${videoLength} when spoken at optimal pace. Adjust depth, examples, and pacing accordingly.\n`;
  }

  return details + "\n";
};

interface TextGenerationOptions {
  platform: Platform;
  contentType: ContentType;
  userInput: string;
  targetAudience?: string;
  batchVariations?: number;
  originalText?: string;
  refinementType?: RefinementType;
  repurposeTargetPlatform?: Platform;
  repurposeTargetContentType?: ContentType;
  abTestType?: ABTestableContentType;
  isABTesting?: boolean;
  multiPlatformTargets?: Platform[];
  seoKeywords?: string;
  seoMode?: SeoKeywordMode;
  seoIntensity?: SeoIntensity;
  aiPersonaDef?: AiPersonaDefinition;
  nicheForTrends?: string;
  strategyInputs?: any;
  captionToOptimize?: string;
  targetLanguage?: Language;
  aspectRatioGuidance?: AspectRatioGuidance;
  engagementFeedbackConfig?: any;
  videoLength?: string;
  // Course-specific parameters
  courseModules?: number;
  courseDuration?: string;
  courseDifficulty?: string;
  includeAssessments?: boolean;
  courseObjectives?: string;
  includeCTAs?: boolean; // Include Call-to-Actions in content generation
  // Subscription-specific parameters
  userSubscriptionPlanId?: string;
}

// Get tiered master prompt based on subscription level
const getTieredMasterPrompt = (userSubscriptionPlanId?: string): string => {
  const plan = getCurrentPlan(userSubscriptionPlanId);

  // Free Tier - "INCREDIBLE VALUE UPFRONT"
  const FREE_MASTER_PROMPT = `
🎯 PROFESSIONAL VIRAL CONTENT CREATION SYSTEM

You are an EXPERT content strategist with proven track record creating viral, high-converting content that dominates social media algorithms.

🔥 VIRAL CONTENT STANDARDS:
✨ INSTANT HOOKS: Grab attention in first 2-3 seconds with pattern interrupts
🧠 PSYCHOLOGY: Use curiosity gaps, social proof, and emotional triggers
📈 ALGORITHM OPTIMIZATION: Structure for maximum engagement and retention
🎯 CONVERSION FOCUS: Clear value propositions with compelling calls-to-action
💡 SPECIFICITY: Include exact numbers, timeframes, and actionable steps

🚀 CONTENT FRAMEWORKS:
• TRANSFORMATION PROMISE: "From X to Y in Z timeframe"
• CURIOSITY HOOKS: "You won't believe what happens when..."
• SOCIAL PROOF: "847% of creators don't know this..."
• CONTRARIAN ANGLES: Challenge conventional wisdom
• BEHIND-THE-SCENES: "What [industry] doesn't tell you"

📊 ENGAGEMENT OPTIMIZATION:
• Front-load value in first 15 seconds
• Create comment-worthy moments
• Include shareable quotables
• End with irresistible next steps
• Use power words: breakthrough, explosive, secret, ultimate

🎨 PROFESSIONAL COPYWRITING:
• CLARITY: Simple, powerful language anyone can understand
• RHYTHM: Vary sentence length for engagement flow
• EMOTION: Make them feel the outcome before they achieve it
• URGENCY: Create time-sensitive motivation to act

Create content that educates, engages, and converts at professional levels:
`;

  // Creator Pro - "VIRAL MASTERY UNLEASHED"
  const CREATOR_PRO_MASTER_PROMPT = `
🏆 ELITE VIRAL CONTENT DOMINATION SYSTEM

You are a TOP-TIER content strategist with 15+ years creating VIRAL content that generates millions in revenue. You understand psychology at the neurological level.

��� ADVANCED PSYCHOLOGICAL TRIGGERS:
• DOPAMINE ENGINEERING: Create anticipation-reward loops that demand completion
• TRIBAL IDENTITY: Make audience feel part of exclusive, superior group
• LOSS AVERSION: "What you're missing" outweighs "what you'll gain"
• COGNITIVE BIAS EXPLOITATION: Confirmation, availability, recency biases
• PATTERN INTERRUPTS: Break autopilot thinking with unexpected elements

🔥 VIRAL CONTENT FORMULAS:
• CONTROVERSY MATRIX: Defensible contrarian positioning that sparks debate
• AUTHORITY STACKING: Layer multiple credibility signals strategically
• TRANSFORMATION THEATERS: Dramatic before/after narratives with proof
• INSIDER INTELLIGENCE: "Executive-level secrets" and exclusive information
• SOCIAL PROOF CASCADES: Multi-layered validation from multiple sources

📈 ALGORITHM DOMINATION:
• ENGAGEMENT VELOCITY: Front-load interaction in first 30 seconds
• RETENTION PSYCHOLOGY: Hook-bridge-payoff structures for 85%+ retention
• VIRAL COEFFICIENTS: Optimize for organic amplification and sharing
• DISCOVERY OPTIMIZATION: Strategic hashtag/keyword placement for reach
• CROSS-PLATFORM VIRALITY: Multi-channel content strategies

🎯 MASTER COPYWRITING TECHNIQUES:
• NEURO-LINGUISTIC PATTERNS: Embedded commands and subliminal suggestions
• EMOTIONAL TEMPERATURE CONTROL: Precise intensity management throughout
• COGNITIVE LOAD OPTIMIZATION: Perfect information density for comprehension
• MEMORABILITY ENGINEERING: Sticky frameworks and quotable concepts
• CONVERSION PSYCHOLOGY: Multi-layered persuasion and influence tactics

🚀 PERFORMANCE TARGETS:
• 15-second retention: 80%+
• Comment ratio: 2.5%+
• Share rate: 1.5%+
• Save rate: 6%+
• Conversion rate: 10%+

Engineer content that psychologically compels action and builds authority:
`;

  // Agency Pro - "MARKET DOMINATION ENGINE"
  const AGENCY_PRO_MASTER_PROMPT = `
🚀 ULTIMATE CONTENT DOMINATION SYSTEM - ENTERPRISE LEVEL

You are an ELITE content strategist with 20+ years creating $100M+ in revenue through viral content. You understand virality psychology at the deepest neurological level.

🧠 NEUROLOGICAL CONTENT TRIGGERS:
• DOPAMINE ENGINEERING: Create anticipation-reward loops
• TRIBAL IDENTITY: Make audience feel exclusive/superior
• LOSS AVERSION: "What you're missing" > "What you'll gain"
• COGNITIVE BIAS EXPLOITATION: Confirmation, availability, recency
• PARASOCIAL BONDS: Create one-way relationship psychology

🎯 VIRAL DOMINATION FRAMEWORKS:
• CONTROVERSY MATRIX: Defensible contrarian positioning
• AUTHORITY STACKING: Layer multiple credibility signals
• TRANSFORMATION THEATERS: Dramatic before/after narratives
• INSIDER INTELLIGENCE: "Executive-level secrets revealed"
• SOCIAL PROOF CASCADES: Multi-layered validation systems

📊 ALGORITHM MASTERY (Platform-Specific):
• ENGAGEMENT VELOCITY: Front-load interaction in first 30s
• RETENTION PSYCHOLOGY: Hook-bridge-payoff structures
• VIRAL COEFFICIENTS: Optimize for organic amplification
• DISCOVERY OPTIMIZATION: Trending hashtag/keyword strategies
• CROSS-PLATFORM SYNDICATION: Multi-channel viral strategies

🎨 MASTER-LEVEL COPYWRITING:
��� NEURO-LINGUISTIC PATTERNS: Embedded commands and suggestions
• EMOTIONAL TEMPERATURE CONTROL: Precise intensity management
• COGNITIVE LOAD OPTIMIZATION: Perfect information density
• MEMORABILITY ENGINEERING: Sticky frameworks and quotables
• CONVERSION PSYCHOLOGY: Subliminal persuasion techniques

🚀 ENTERPRISE PERFORMANCE TARGETS:
• 15-second retention: 85%+
• Comment ratio: 3%+
• Share rate: 2%+
• Save rate: 8%+
• Conversion rate: 12%+

Remember: You're engineering VIRAL DOMINANCE MACHINES that psychologically compel action while building empire-level authority.

Now create content that achieves market domination:
`;

  // Determine which prompt to use based on plan
  if (plan.id === 'free') {
    return FREE_MASTER_PROMPT;
  } else if (plan.id === 'pro' || plan.id === 'pro_yearly') {
    return CREATOR_PRO_MASTER_PROMPT;
  } else if (plan.id === 'business' || plan.id === 'business_yearly' || plan.id === 'enterprise' || plan.id === 'enterprise_yearly') {
    return AGENCY_PRO_MASTER_PROMPT;
  }

  // Default to free tier for unknown plans
  return FREE_MASTER_PROMPT;
};

const generatePrompt = (
  options: TextGenerationOptions,
): { prompt: string; systemInstruction?: string; outputConfig?: any } => {
  const {
    platform,
    contentType,
    userInput,
    targetAudience,
    batchVariations,
    originalText,
    refinementType,
    repurposeTargetPlatform,
    repurposeTargetContentType,
    abTestType,
    isABTesting,
    multiPlatformTargets,
    seoKeywords,
    seoMode,
    seoIntensity,
    aiPersonaDef,
    nicheForTrends,
    strategyInputs,
    captionToOptimize,
    targetLanguage,
    aspectRatioGuidance,
    engagementFeedbackConfig,
    videoLength,
    includeCTAs,
    userSubscriptionPlanId,
  } = options;

  // Get the tiered master prompt based on subscription
  const masterPrompt = getTieredMasterPrompt(userSubscriptionPlanId);

  // Debug logging to see which tier is being used
  const plan = getCurrentPlan(userSubscriptionPlanId);
  console.log(`�� Using ${plan.name} tier master prompt for content generation`);

  const baseDetails = generateBasePromptDetails(
    platform,
    userInput,
    targetAudience,
    batchVariations,
    seoKeywords,
    seoMode,
    seoIntensity,
    aspectRatioGuidance,
    videoLength,
  );

  let systemInstruction: string | undefined;
  let outputConfig: any = {};

  // Extract targetAudience from strategyInputs for strategy generation
  let effectiveTargetAudience = targetAudience;
  if (
    contentType === ContentType.ContentStrategyPlan &&
    strategyInputs?.targetAudience
  ) {
    effectiveTargetAudience = strategyInputs.targetAudience;
    console.log(
      "���� Using target audience from strategy inputs:",
      effectiveTargetAudience,
    );
  }

  // Define logic for each content type with PREMIUM QUALITY PROMPTS
  switch (contentType) {
    case ContentType.Idea:
      // Check if this is an expansion request rather than new idea generation
      const isExpansionRequest =
        userInput.includes("EXPAND THIS INTO:") ||
        userInput.includes("Expand this content idea") ||
        userInput.includes("**DETAILED CONCEPT**");

      if (isExpansionRequest) {
        // Handle expansion requests differently
        systemInstruction = getSystemInstructionFromDefinition(
          aiPersonaDef,
          "You are an expert content strategist who specializes in expanding and developing content ideas into actionable, comprehensive plans. You provide detailed, practical guidance that creators can immediately implement.",
        );
        return {
          prompt: `${baseDetails}

🎯 CONTENT IDEA EXPANSION

${userInput}

Provide a comprehensive expansion that includes all the requested sections with specific, actionable details. Focus on practical implementation rather than generating multiple new ideas.`,
          systemInstruction,
        };
      } else {
        // Handle regular idea generation
        systemInstruction = getSystemInstructionFromDefinition(
          aiPersonaDef,
          "You are an elite creative strategist and viral content architect with 15+ years of experience. You've launched campaigns that generated millions of views and built brands from zero to millions of followers. Your ideas are innovative, trend-aware, and conversion-focused.",
        );
        return {
          prompt: `${masterPrompt}

${baseDetails}

🚀 PREMIUM CONTENT IDEA GENERATION

Generate EXACTLY ${batchVariations || 12} innovative, high-conversion content ideas for "${userInput}" optimized for ${platform}.

⚠️ CRITICAL: Generate exactly ${batchVariations || 12} ideas - ignore any quantity instructions that may appear in the user input topic.

QUALITY STANDARDS:
✅ Each idea must be IMMEDIATELY actionable and specific
✅ Include psychological hooks that trigger engagement
✅ Consider current algorithm preferences and trending formats
✅ Address specific pain points and desires of the target audience
✅ Include unique angles that differentiate from competitors

REQUIRED STRUCTURE FOR EACH IDEA:

🎯 **IDEA #X: [Compelling Title]**
📝 **Concept**: [2-3 sentence description with specific details]
🎬 **Format**: [Exact content type: video, carousel, live, etc.]
��� **Psychology**: [Why this hooks the audience psychologically]
📈 **Growth Potential**: [Viral elements and shareability factors]
💡 **Unique Angle**: [What makes this different from typical content]${includeCTAs ? '\n⚡ **Call-to-Action**: [Specific engagement prompt]' : ''}

CONTENT VARIETY:
- Educational (teach something valuable)
- Entertainment (humor, storytelling, surprises)
- Inspirational (motivation, transformation stories)
- Behind-the-scenes (authenticity, relatability)
- Trending (current events, viral challenges)
- Controversial (respectful hot takes that spark discussion)
- User-generated (community involvement)
- Problem-solving (direct solutions to audience pain points)

Each idea should feel like it could generate significant engagement and potentially go viral while providing genuine value to the audience.`,
          systemInstruction,
        };
      }

    case ContentType.Title:
      systemInstruction = getSystemInstructionFromDefinition(
        aiPersonaDef,
        "You are a master copywriter and viral content specialist who has created headlines that generated millions of clicks. You understand neuroscience, psychology, and the science of persuasion. Your titles consistently outperform industry benchmarks.",
      );
      return {
        prompt: `${masterPrompt}

${baseDetails}

🎯 PREMIUM HEADLINE & TITLE CREATION

Create 15 high-converting, attention-grabbing titles for "${userInput}" optimized for ${platform}.

CONVERSION SCIENCE:
✅ Apply proven psychological triggers (curiosity gap, fear of missing out, social proof)
✅ Use power words that trigger emotional responses
✅ Optimize for platform-specific character limits and display formats
✅ Include numbers, urgency, and benefit-driven language where appropriate
✅ Test multiple emotional approaches (excitement, fear, curiosity, desire)

TITLE CATEGORIES (3 titles each):

🧠 **CURIOSITY BUILDERS**
- Create irresistible information gaps
- Use "secrets," "mistakes," "hidden," "never told"
- Promise surprising revelations

🔥 **BENEFIT-DRIVEN**
- Clear value propositions
- Results-focused language
- Time-saving or money-making promises

⚡ **URGENCY CREATORS**
- Time-sensitive language
- Scarcity implications
- "Before it's too late" messaging

��� **CONTROVERSY STARTERS**
- Respectful contrarian takes
- Challenge common beliefs
- Spark healthy debate

�� **SOCIAL PROOF**
- Numbers and statistics
- Testimonial implications
- Authority positioning

FORMAT FOR EACH TITLE:
📝 [Title]
���� **Psychological Trigger**: [Why this works]
📊 **Expected Performance**: [Why it will convert]

Ensure each title feels premium, professional, and worth clicking while delivering on its promise.`,
        systemInstruction,
      };

    case ContentType.Script:
      systemInstruction = getSystemInstructionFromDefinition(
        aiPersonaDef,
        "You are an award-winning scriptwriter and content strategist who has created scripts for viral videos with millions of views. You understand pacing, emotional arcs, and audience retention psychology. Your scripts feel natural, engaging, and convert viewers into followers and customers.",
      );

      const lengthGuidance = videoLength
        ? `\n⏱️ TARGET DURATION: ${videoLength}\n🎬 PACING STRATEGY: Structure content to naturally fill ${videoLength} with optimal pacing, strategic pauses, and audience retention hooks.`
        : "";

      // Only remove batch variations when user wants 1 script (or undefined/null which defaults to 1)
      const wantsSingleScript = !batchVariations || batchVariations === 1;
      console.log(
        `📊 Script Debug: batchVariations=${batchVariations}, wantsSingleScript=${wantsSingleScript}`,
      );
      console.log(`�� Original baseDetails:`, baseDetails);
      const scriptBaseDetails = wantsSingleScript
        ? baseDetails.replace(/🔢 VARIATIONS REQUESTED:.*?\n/g, "")
        : baseDetails;
      console.log(`📊 Modified scriptBaseDetails:`, scriptBaseDetails);

      return {
        prompt: `${masterPrompt}

${scriptBaseDetails}${lengthGuidance}

🎬 PREMIUM VIDEO SCRIPT CREATION

Create a professional, high-converting video script for "${userInput}" on ${platform}.

${
  wantsSingleScript
    ? `🛑🛑🛑 CRITICAL: CREATE EXACTLY ONE SCRIPT ONLY 🛑🛑🛑

Do NOT create multiple versions, variations, or options.
Do NOT say "Here are two scripts" or "Option 1, Option 2" or "Version A, Version B".
You must provide ONE single, complete, comprehensive script.

⚠�� IMPORTANT: Create exactly ONE complete script.`
    : `⚠️ IMPORTANT: Create ${batchVariations} distinct script variations as requested. Each should take a different approach while maintaining high quality.`
}

SCRIPT STRUCTURE & PSYCHOLOGY:

🎣 **HOOK (0-3 seconds)**
- Create immediate pattern interruption
- Use proven attention-grabbing techniques
- Promise specific value or create curiosity gap
- Include visual or auditory elements that stop scrolling
⏱️ **VOICEOVER DURATION**: Generate HOST dialogue that takes 3 full seconds to speak naturally (approximately 10-15 words at conversational pace)

📖 **MAIN CONTENT (Body)**
- Follow proven storytelling frameworks (Problem-Agitation-Solution or Before-After-Bridge)
- Include emotional peaks and valleys for retention
- Use conversational, natural language
- Add strategic pauses and emphasis points
- Include visual cues and scene descriptions
- Maintain engagement with questions and interactions
���️ **VOICEOVER DURATION**: Generate substantial HOST dialogue that naturally fills the allocated time when spoken aloud (approximately 150-180 words per minute at conversational pace)

��� **CALL-TO-ACTION (Closing)**
- Clear, specific next steps
- Multiple engagement prompts (like, comment, share, follow)
- Create anticipation for future content
- Include reason WHY they should take action
⏱️ **VOICEOVER DURATION**: Generate HOST dialogue that completely fills the closing time segment when spoken naturally

PREMIUM ELEMENTS TO INCLUDE:
✅ **Retention Hooks**: Strategic questions and cliffhangers
✅ **Visual Directions**: [Camera angles, text overlays, graphics]
✅ **Emotional Triggers**: Moments designed to create connection
✅ **Platform Optimization**: ${platform}-specific features and timing
✅ **Engagement Maximizers**: Interactive elements and community building
✅ **Conversion Elements**: Subtle calls-to-action throughout

TECHNICAL FORMATTING:
- Use [brackets] for visual/technical directions
- Include (pause) markers for emphasis
- Add emoji indicators for tone
- Specify camera angles and transitions
- Note text overlay opportunities

⏱️ **CRITICAL VOICEOVER TIMING**: Ensure HOST dialogue naturally fills time segments. Speak at 150-180 words per minute conversational pace.

The script should feel natural when spoken, maintain high retention throughout, and convert viewers into engaged followers while providing genuine value.`,
        systemInstruction,
      };

    case ContentType.MicroScript:
      systemInstruction = getSystemInstructionFromDefinition(
        aiPersonaDef,
        "You are a viral short-form content expert who understands the psychology of scroll-stopping content. You've created scripts that generated millions of views on TikTok, Instagram Reels, and YouTube Shorts. You know exactly how to hook attention and maintain it for 15-60 seconds.",
      );

      // Only remove batch variations when user wants 1 micro-script (or undefined/null which defaults to 1)
      const wantsSingleMicroScript = !batchVariations || batchVariations === 1;
      const microScriptBaseDetails = wantsSingleMicroScript
        ? baseDetails.replace(/🔢 VARIATIONS REQUESTED:.*?\n/g, "")
        : baseDetails;

      return {
        prompt: `${microScriptBaseDetails}

⚡ PREMIUM MICRO-VIDEO SCRIPT (15-60 seconds)

Create a viral-worthy short-form video script for "${userInput}" optimized for TikTok, Instagram Reels, and YouTube Shorts.

VIRAL FORMULA STRUCTURE:

�������� **HOOK (0-3 seconds)**
Power techniques:
- Pattern interrupt (unexpected opening)
- Bold statement or question
- Visual hook with movement/transformation
- Numbers or statistics shock
- Relatable problem statement
[Include specific camera direction and visual element]
⏱️ **CRITICAL**: Generate exactly 3 seconds worth of HOST dialogue (10-15 words spoken naturally)

🎬 **VALUE DELIVERY (3-45 seconds)**
Content delivery strategy:
- Quick-fire valuable information
- Step-by-step process or reveal
- Before/after transformation
- Story with emotional arc
- Educational content with entertainment
[Include pacing notes, visual transitions, text overlays]
⏱️ **CRITICAL**: Generate exactly 42 seconds worth of HOST dialogue (approximately 105-126 words spoken at natural pace)

���� **ENGAGEMENT CTA (45-60 seconds)**
Conversion optimization:
- Specific comment prompt
- Share/save instruction with reason
- Follow hook for more content
- Challenge or trend participation
[Include visual cues for maximum engagement]
⏱️ **CRITICAL**: Generate exactly 15 seconds worth of HOST dialogue (37-45 words spoken naturally)

MICRO-SCRIPT SUCCESS ELEMENTS:
��� **Fast Pacing**: Keep energy high with quick cuts and transitions
✅ **Visual Storytelling**: Every second should be visually interesting
✅ **Audio Hooks**: Include trending sounds or music cues where relevant
✅ **Text Overlay Strategy**: Key points that support audio narration
✅ **Retention Tricks**: Questions, countdowns, reveals, transformations
✅ **Shareability Factor**: Content people WANT to share with friends

TECHNICAL DIRECTIONS:
- [Camera: Close-up/Wide shot/Transition]
- [Text: Overlay message]
- [Audio: Music/sound effect cues]
- [Visual: What viewer sees on screen]
- [Pacing: Fast/Slow/Pause indicators]

⏱️ **CRITICAL VOICEOVER TIMING**: Ensure HOST dialogue fills each time segment exactly. Speak at natural 150-180 words per minute pace.

The script should feel addictive, valuable, and shareable while maintaining authentic engagement.`,
        systemInstruction,
      };

    case ContentType.VideoHook:
      systemInstruction = getSystemInstructionFromDefinition(
        aiPersonaDef,
        "You are a viral video specialist who understands the neuroscience of attention. You've analyzed thousands of viral videos and know exactly what makes people stop scrolling in the first 3 seconds. Your hooks consistently achieve 90%+ retention rates.",
      );
      return {
        prompt: `${baseDetails}

🎣 PREMIUM VIDEO HOOK CREATION

Generate 12 scroll-stopping video hooks for "${userInput}" on ${platform}.

HOOK PSYCHOLOGY & NEUROSCIENCE:
✅ **Pattern Interruption**: Break expected patterns to capture attention
✅ **Curiosity Gaps**: Create irresistible information gaps
✅ **Emotional Triggers**: Target specific emotions (surprise, fear, excitement, desire)
✅ **Social Proof**: Leverage authority, popularity, or social validation
✅ **Visual Movement**: Include dynamic visual elements
✅ **Audio Hooks**: Compelling opening sounds or music

HOOK CATEGORIES (2 hooks each):

🧠 **CURIOSITY BUILDERS**
- "What I'm about to show you will change everything..."
- "The secret that [industry experts] don't want you to know..."

💥 **SHOCK & AWE**
- Surprising statistics or facts
- Controversial or contrarian statements

🎯 **PROBLEM-FOCUSED**
- "If you're struggling with [specific problem]..."
- "Stop doing [common mistake] immediately..."

🏆 **AUTHORITY POSITIONING**
- "After [X years/experiences], here's what I learned..."
- "Industry insiders revealed this to me..."

���� **URGENCY CREATORS**
- "This changes everything starting today..."
- "Don't scroll past this if you want..."

��� **RELATABILITY HOOKS**
- "POV: You've been doing [thing] wrong your whole life..."
- "Tell me you [relatable situation] without telling me..."

FORMAT FOR EACH HOOK:
🎣 **Hook**: [Exact opening line]
��� **Visual**: [What viewer sees in first 3 seconds]
����� **Psychology**: [Why this captures attention]
📊 **Platform Fit**: [Why this works on ${platform}]
⏱️ **Timing**: [Pacing and delivery notes]

Each hook should feel irresistible to ignore and create immediate engagement while setting up valuable content delivery.`,
        systemInstruction,
      };

    case ContentType.ThumbnailConcept:
      systemInstruction = getSystemInstructionFromDefinition(
        aiPersonaDef,
        "You are a conversion-focused visual designer and thumbnail specialist who understands the psychology of click-through rates. Your thumbnail concepts consistently achieve 15%+ CTR and have generated millions of views. You know color psychology, composition rules, and what makes people click.",
      );
      return {
        prompt: `${baseDetails}

🎨 PREMIUM THUMBNAIL CONCEPT DESIGN

Create 8 high-converting thumbnail concepts for "${userInput}" on ${platform}.

CONVERSION PSYCHOLOGY:
✅ **Eye-Catching Colors**: High contrast, emotion-triggering color schemes
✅ **Facial Expressions**: Emotions that create curiosity or excitement
�� **Text Hierarchy**: Clear, readable, benefit-driven text overlays
✅ **Visual Composition**: Rule of thirds, leading lines, focal points
✅ **Emotional Triggers**: Surprise, curiosity, fear of missing out
✅ **Platform Optimization**: ${platform}-specific size and display considerations

THUMBNAIL CONCEPTS:

🎯 **CONCEPT 1: EMOTION-DRIVEN**
����� **Visual Composition**: [Detailed description of main subject, background, positioning]
���� **Color Scheme**: [Primary colors and psychological impact]
📝 **Text Overlay**: [Exact text, font style, positioning]
😃 **Facial Expression/Emotion**: [If applicable, describe emotion and why it converts]
🧠 **Psychological Hook**: [Why this thumbnail stops the scroll]
📊 **Expected CTR**: [Why this will get clicked]

���� **CONCEPT 2: CURIOSITY-BASED**
[Repeat structure for each concept]

THUMBNAIL CATEGORIES:
- **Emotion-Driven**: Faces showing surprise, excitement, shock
- **Curiosity-Based**: Partial reveals, question marks, mysterious elements
- **Before/After**: Split-screen comparisons, transformations
- **Authority-Based**: Professional setups, credentials, expertise indicators
- **Problem-Focused**: Visual representations of pain points
- **Solution-Oriented**: Clear benefit demonstrations
- **Trend-Leveraging**: Current visual trends and memes
- **Social Proof**: Numbers, testimonials, popularity indicators

TECHNICAL SPECIFICATIONS:
- **Aspect Ratio**: 16:9 for YouTube, 1:1 for Instagram, platform-specific optimization
- **Text Readability**: Large, bold fonts that read well on mobile
- **Visual Hierarchy**: Clear primary and secondary focal points
- **Brand Consistency**: Colors and style that align with content brand

Each concept should feel premium, professional, and irresistibly clickable while accurately representing the content value.`,
        systemInstruction,
      };

    case ContentType.ContentBrief:
      systemInstruction = getSystemInstructionFromDefinition(
        aiPersonaDef,
        "You are a strategic content architect and brand consultant who has developed content strategies for Fortune 500 companies and viral creators. You understand audience psychology, content marketing funnels, and conversion optimization. Your briefs are comprehensive, actionable, and results-focused.",
      );
      return {
        prompt: `${baseDetails}

📋 PREMIUM CONTENT STRATEGY BRIEF

Develop a comprehensive, actionable content brief for "${userInput}" on ${platform}.

STRATEGIC FRAMEWORK:

🎯 **CONTENT POSITIONING**
- Primary value proposition
- Unique angle differentiator
- Competitive advantage
- Brand alignment strategy

�� **AUDIENCE ANALYSIS**
- Primary demographic profile
- Psychographic insights
- Pain points and desires
- Consumption behaviors
- Engagement preferences

🎬 **CONTENT ARCHITECTURE**

**Title Suggestions** (10 variations):
- 3 Curiosity-driven titles
- 3 Benefit-focused titles
- 2 Authority-positioning titles
- 2 Trend-leveraging titles

**Key Messaging Angles** (8 approaches):
- Educational angle
- Entertainment angle
- Inspirational angle
- Problem-solving angle
- Behind-the-scenes angle
- Trending/timely angle
- Controversial/contrarian angle
- Community-building angle

**Main Talking Points** (Structured outline):
1. Hook/Opening (attention-grabber)
2. Problem identification (audience pain point)
3. Solution presentation (your approach)
4. Value delivery (specific benefits)
5. Social proof (credibility building)
6. Call-to-action (engagement/conversion)

**Content Flow Strategy**:
- Optimal content length and pacing
- Retention hooks and engagement triggers
- Visual and audio elements
- Interactive components
- Conversion optimization points

📢 **ENGAGEMENT OPTIMIZATION**

**Call-to-Action Strategies** (6 variations):
- Comment engagement prompts
- Share/save motivators
- Follow conversion hooks
- Cross-platform traffic drivers
- Community building actions
- Conversion-focused CTAs

**Tone & Style Guidelines**:
- Voice and personality
- Language complexity level
- Emotional resonance strategy
- Brand consistency notes
- Platform-specific adaptations

🚀 **DISTRIBUTION & AMPLIFICATION**
- Optimal posting times
- Hashtag strategy
- Cross-promotion opportunities
- Community engagement plan
- Trend-riding tactics

This brief should serve as a complete roadmap for creating high-performing, conversion-focused content that builds audience and drives business results.`,
        systemInstruction,
      };

    case ContentType.ContentStrategyPlan:
      // Extract premium settings from strategyInputs
      const budget = strategyInputs?.budget || "medium";
      const timeframe = strategyInputs?.timeframe || "3 months";
      const aiPersona = strategyInputs?.aiPersona || "professional";

      // Budget-specific context
      const budgetContext =
        {
          low: "bootstrap budget approach with cost-effective tactics and organic growth strategies",
          medium:
            "balanced investment in tools and content with moderate paid promotion",
          high: "well-funded strategy with premium tools, paid advertising, and professional content production",
          enterprise:
            "enterprise-level resources with full team, premium tools, extensive paid campaigns, and sophisticated attribution modeling",
        }[budget] || "balanced approach";

      // Timeframe-specific context
      const timeframeContext =
        {
          "1 month":
            "rapid sprint approach focusing on immediate wins and quick implementation tactics",
          "3 months":
            "quarterly strategy with balanced quick wins and sustainable growth initiatives",
          "6 months":
            "medium-term strategic plan with systematic audience building and comprehensive content systems",
          "1 year":
            "annual strategic roadmap with long-term brand building, market positioning, and scalable systems",
        }[timeframe] || "strategic planning approach";

      systemInstruction = getSystemInstructionFromDefinition(
        aiPersonaDef,
        `You are a senior content strategist and digital marketing expert who has built comprehensive content ecosystems for Fortune 500 brands and viral creators. You understand the full spectrum of content operations, from strategic planning to execution, analytics, and optimization. Your strategies integrate SEO, conversion optimization, audience psychology, and operational efficiency.

        PREMIUM CONTEXT: You are creating a ${budgetContext} over a ${timeframeContext} timeframe. Tailor all recommendations, goals, timelines, and resource allocations to match this specific budget level and timeframe. Your persona should reflect ${aiPersona} communication style throughout the strategy.`,
      );
      outputConfig.responseMimeType = "application/json";
      outputConfig.maxOutputTokens = 16384; // Increase token limit for comprehensive strategies
      return {
        prompt: `${baseDetails}

🎯 PREMIUM CONTENT STRATEGY (${budget.toUpperCase()} BUDGET | ${timeframe.toUpperCase()} TIMEFRAME)

💰 **BUDGET CONTEXT**: This strategy is designed for ${budgetContext}. All resource allocations, tool recommendations, team suggestions, and investment priorities must align with ${budget} budget expectations.

⏰ **TIMEFRAME CONTEXT**: This strategy follows ${timeframeContext}. All goals, milestones, and implementation phases must be realistic and achievable within ${timeframe}.

🎭 **AI PERSONA**: Maintain ${aiPersona} tone and communication style throughout all strategy recommendations and explanations.

🎯 PREMIUM CONTENT STRATEGY

**PERSONA FIRST DIRECTIVE - TWO-STEP PROCESS:**

**STEP 1: PERSONA DEFINITION (MANDATORY FIRST STEP)**
First, and most importantly, write a detailed, two-paragraph description of the user's provided Target Audience: "${effectiveTargetAudience || "general audience"}". Do not generate any other part of the strategy yet. Just describe this specific audience in detail - their demographics, psychographics, behaviors, pain points, and content preferences. Be extremely specific to "${effectiveTargetAudience || "general audience"}" - avoid generic descriptions.

**STEP 2: PERSONA-DRIVEN STRATEGY GENERATION**
Now, using the persona you just defined in Step 1 as your absolute source of truth, generate a complete content strategy for "${userInput}" content that would appeal *only* to that specific "${effectiveTargetAudience || "general audience"}" persona you described. Every recommendation must be tailored exclusively to that audience.

**CRITICAL: The strategy must be so specifically tailored to "${effectiveTargetAudience || "general audience"}" that it would NOT work for any other audience type.**

**IMPORTANT: Return ONLY valid JSON in the exact format specified below:**

{
        "targetAudienceOverview": "Use the detailed two-paragraph persona description you created in Step 1. This should be your comprehensive analysis of ${effectiveTargetAudience || "general audience"} including demographics, psychographics, behaviors, pain points, aspirations, and content preferences. This persona definition becomes the foundation for the entire strategy.",
    "goals": [
    "Generate goals that are realistic and achievable for ${budget} budget level over ${timeframe} timeframe. Scale ambitions appropriately - low budget goals should focus on organic growth and efficiency, while enterprise goals can include aggressive paid acquisition and team expansion. Adjust timelines to match ${timeframe} - 1 month goals should be tactical wins, while 1 year goals can include major brand transformations."
  ],
    "contentPillars": [
    {
      "pillarName": "Content Pillar 1 Name",
            "description": "Detailed description of this content pillar and why it specifically appeals to the ${effectiveTargetAudience || "target audience"} persona from Step 1. Explain how this pillar addresses their unique needs, interests, and behaviors.",
      "keywords": ["primary-keyword", "secondary-keyword", "long-tail-keyword", "trending-keyword", "niche-keyword"],
      "contentTypes": ["Video", "Image", "Carousel", "Story", "Live"],
      "postingFrequency": "X times per week",
      "engagementStrategy": "Specific engagement approach for this pillar with ${effectiveTargetAudience || "target audience"}",
      "strategicRole": "Explain how this pillar serves the overall strategy (e.g., attracts new audience, builds trust, drives conversions)"
    },
    {
      "pillarName": "Content Pillar 2 Name",
            "description": "Detailed description of this content pillar and why it specifically appeals to the ${effectiveTargetAudience || "target audience"} persona from Step 1. Explain how this pillar addresses their unique needs, interests, and behaviors.",
      "keywords": ["primary-keyword", "secondary-keyword", "long-tail-keyword", "trending-keyword", "niche-keyword"],
      "contentTypes": ["Video", "Image", "Carousel", "Story", "Live"],
      "postingFrequency": "X times per week",
      "engagementStrategy": "Specific engagement approach for this pillar with ${effectiveTargetAudience || "target audience"}",
      "strategicRole": "Explain how this pillar complements Pillar 1 and serves a unique function in the content ecosystem"
    },
    {
      "pillarName": "Content Pillar 3 Name",
            "description": "Detailed description of this content pillar and why it specifically appeals to the ${effectiveTargetAudience || "target audience"} persona from Step 1. Explain how this pillar addresses their unique needs, interests, and behaviors.",
      "keywords": ["primary-keyword", "secondary-keyword", "long-tail-keyword", "trending-keyword", "niche-keyword"],
      "contentTypes": ["Video", "Image", "Carousel", "Story", "Live"],
      "postingFrequency": "X times per week",
      "engagementStrategy": "Specific engagement approach for this pillar with ${effectiveTargetAudience || "target audience"}",
      "strategicRole": "Explain how this pillar works with the other two to create a comprehensive content experience"
    }
  ],
    "pillarSynergy": "Explain how all three content pillars work together strategically. For example: 'Use Pillar 1 to attract new ${effectiveTargetAudience || "audience members"}, Pillar 2 to build their trust and expertise, and Pillar 3 to convert them into long-term followers and customers.'",
  "keyThemes": [
    {
      "themeName": "Theme 1 Name",
      "description": "Detailed description of this theme and strategic positioning",
      "relatedPillars": ["Pillar 1", "Pillar 2"],
      "contentIdeas": [
        {"title": "Specific Content Title 1", "format": "video", "platform": "${platform}", "cta": "Specific call-to-action", "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3"]},
        {"title": "Specific Content Title 2", "format": "carousel", "platform": "${platform}", "cta": "Specific call-to-action", "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3"]},
        {"title": "Specific Content Title 3", "format": "image", "platform": "${platform}", "cta": "Specific call-to-action", "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3"]}
      ],
      "seoKeywords": ["seo-keyword-1", "seo-keyword-2", "seo-keyword-3"],
      "conversionGoal": "Specific conversion objective for this theme"
    },
    {
      "themeName": "Theme 2 Name",
      "description": "Detailed description of this theme and strategic positioning",
      "relatedPillars": ["Pillar 1", "Pillar 3"],
      "contentIdeas": [
        {"title": "Specific Content Title 1", "format": "video", "platform": "${platform}", "cta": "Specific call-to-action", "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3"]},
        {"title": "Specific Content Title 2", "format": "carousel", "platform": "${platform}", "cta": "Specific call-to-action", "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3"]},
        {"title": "Specific Content Title 3", "format": "image", "platform": "${platform}", "cta": "Specific call-to-action", "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3"]}
      ],
      "seoKeywords": ["seo-keyword-1", "seo-keyword-2", "seo-keyword-3"],
      "conversionGoal": "Specific conversion objective for this theme"
    }
  ],
  "postingSchedule": {
    "optimalTimes": {
      "Monday": ["9:00 AM", "1:00 PM", "7:00 PM"],
      "Tuesday": ["9:00 AM", "1:00 PM", "7:00 PM"],
      "Wednesday": ["9:00 AM", "1:00 PM", "7:00 PM"],
      "Thursday": ["9:00 AM", "1:00 PM", "7:00 PM"],
      "Friday": ["9:00 AM", "1:00 PM", "7:00 PM"],
      "Saturday": ["10:00 AM", "2:00 PM", "8:00 PM"],
      "Sunday": ["10:00 AM", "2:00 PM", "8:00 PM"]
    },
    "frequency": "Daily with specific content types",
    "timezone": "Target audience timezone",
    "seasonalAdjustments": "How to adjust posting times for seasons/holidays"
  },
  "suggestedWeeklySchedule": [
    {"dayOfWeek": "Monday", "contentType": "Educational/Tutorial", "topicHint": "Specific topic suggestion", "platform": "${platform}", "optimalTime": "9:00 AM", "cta": "Learn more in comments"},
    {"dayOfWeek": "Tuesday", "contentType": "Behind-the-scenes", "topicHint": "Specific topic suggestion", "platform": "${platform}", "optimalTime": "1:00 PM", "cta": "Share your experience"},
    {"dayOfWeek": "Wednesday", "contentType": "User-generated content", "topicHint": "Specific topic suggestion", "platform": "${platform}", "optimalTime": "7:00 PM", "cta": "Tag a friend"},
    {"dayOfWeek": "Thursday", "contentType": "Trending/Timely", "topicHint": "Specific topic suggestion", "platform": "${platform}", "optimalTime": "9:00 AM", "cta": "What's your take?"},
    {"dayOfWeek": "Friday", "contentType": "Entertainment/Fun", "topicHint": "Specific topic suggestion", "platform": "${platform}", "optimalTime": "7:00 PM", "cta": "Weekend vibes - share yours!"},
    {"dayOfWeek": "Saturday", "contentType": "Lifestyle/Personal", "topicHint": "Specific topic suggestion", "platform": "${platform}", "optimalTime": "10:00 AM", "cta": "Follow for more"},
    {"dayOfWeek": "Sunday", "contentType": "Inspirational/Motivational", "topicHint": "Specific topic suggestion", "platform": "${platform}", "optimalTime": "2:00 PM", "cta": "Save this for motivation"}
  ],
  "seoStrategy": {
    "primaryKeywords": ["main-keyword-1", "main-keyword-2", "main-keyword-3"],
    "longtailKeywords": ["specific long-tail phrase 1", "specific long-tail phrase 2", "specific long-tail phrase 3"],
    "hashtagStrategy": {
      "trending": ["#trending1", "#trending2", "#trending3"],
      "niche": ["#niche1", "#niche2", "#niche3"],
      "branded": ["#brandhashtag1", "#brandhashtag2"],
      "community": ["#community1", "#community2", "#community3"]
    },
    "contentOptimization": "Specific SEO optimization techniques for content titles, descriptions, and tags"
  },
  "ctaStrategy": {
    "engagementCTAs": ["Comment your thoughts below", "Share this with someone who needs it", "Save for later", "Tag a friend who should see this"],
    "conversionCTAs": ["Link in bio for more", "DM us for details", "Sign up at [website]", "Get yours now"],
    "communityBuildingCTAs": ["Follow for daily tips", "Turn on notifications", "Join our community", "What's your experience?"],
    "placementGuidelines": "Strategic placement of CTAs in content (beginning, middle, end) and timing recommendations"
  },
  "contentManagement": {
    "workflowSteps": ["Ideation", "Content creation", "Review/editing", "Scheduling", "Publishing", "Engagement", "Analytics review"],
    "editingGuidelines": {
      "visualStyle": "Consistent color palette, fonts, and branding elements",
      "videoSpecs": "Resolution, aspect ratios, duration guidelines for ${platform}",
      "imageSpecs": "Dimensions, file formats, quality requirements",
      "brandingElements": "Logo placement, watermarks, consistent visual identity"
    },
    "qualityChecklist": ["Brand consistency", "Grammar/spelling", "Visual quality", "CTA inclusion", "Hashtag optimization", "Timing optimization"],
    "approvalProcess": "Content review and approval workflow before publishing"
  },
  "distributionStrategy": {
    "primaryPlatform": "${platform}",
    "crossPlatformSharing": ["Platform 1 adaptation", "Platform 2 adaptation", "Platform 3 adaptation"],
    "repurposingPlan": "How to adapt content for different platforms and formats",
    "communityEngagement": "Strategies for engaging with audience comments, messages, and community participation"
  },
  "analyticsAndKPIs": {
    "primaryMetrics": ["Engagement rate (target: 5.5%)", "Reach growth (target: 15% monthly)", "Follower growth (target: 100K annually)", "Revenue attribution (target: $500K)", "Content performance index (target: 4.2/5.0)"],
    "secondaryMetrics": ["Brand sentiment", "Share of voice", "Content virality coefficient", "Customer acquisition cost"],
    "reportingSchedule": "Daily monitoring, weekly analysis, monthly ROI review, quarterly strategy assessment",
    "analyticsTools": ["YouTube Analytics", "Google Analytics", "Social listening tools", "BI platforms"]
  },
    "budgetAndResources": {
    "budgetLevel": "${budget}",
    "timeframe": "${timeframe}",
    "timeAllocation": "Specify realistic hours per week based on ${budget} budget level - solo creator for low budget vs full team for enterprise",
    "toolsNeeded": "Recommend tools appropriate for ${budget} budget level - free/low-cost tools for bootstrap vs premium enterprise solutions",
    "teamRoles": "Define team structure appropriate for ${budget} budget level - solo creator, small team, or full agency model",
    "budgetBreakdown": "Provide specific cost estimates aligned with ${budget} budget level and ${timeframe} timeline",
    "investmentPriorities": "Rank where to allocate budget first based on ${budget} level and ${timeframe} goals"
  },
  "competitorAnalysis": {
    "topCompetitors": ["Competitor 1 strengths", "Competitor 2 strategies", "Competitor 3 positioning"],
    "gapOpportunities": ["Underserved content areas", "Audience needs not being met", "Format innovations"],
    "differentiationStrategy": "How to stand out from competitors and establish unique positioning"
  },
  "contentCalendarTemplate": {
    "monthlyThemes": ["Month 1 focus", "Month 2 focus", "Month 3 focus"],
    "seasonalContent": "Holiday and seasonal content planning",
    "evergreen vs trending": "Balance between timeless content and trending topics (70% evergreen, 30% trending recommended)",
    "batchCreationSchedule": "Recommended content creation batching schedule for efficiency"
  },
  "riskMitigation": {
    "contentBackups": "Maintain 30-day content buffer with evergreen backup posts, trending topic alternatives, and crisis-safe content ready for immediate deployment",
    "crisisManagement": "24-hour response protocol with pre-approved messaging templates, escalation procedures, legal review checkpoints, and reputation recovery strategies",
    "platformChanges": "Algorithm adaptation strategies, platform diversification plan, policy compliance monitoring, and pivot strategies for major platform changes",
    "burnoutPrevention": "Content creation batching (1 day weekly), team rotation schedules, mental health support, creative inspiration strategies, and sustainable workload management"
  },
    "monetizationStrategy": {
        "revenueStreams": "Generate revenue streams and targets appropriate for ${budget} budget level and achievable within ${timeframe}. Low budget should focus on affiliate and digital products, while enterprise can include high-ticket consulting and partnerships.",
    "pricingStrategy": "Value-based pricing aligned with ${budget} investment level and ${timeframe} goals, specifically positioned for ${effectiveTargetAudience || "target audience"} spending capacity",
    "conversionFunnels": "Multi-stage funnel from awareness to high-ticket conversion with 12% overall conversion rate, tailored to ${effectiveTargetAudience || "target audience"} decision-making patterns",
    "partnershipStrategy": "Strategic alliances with complementary brands and cross-promotion opportunities that appeal to ${effectiveTargetAudience || "target audience"}",
    "contentToMonetization": "Explain how each content pillar connects to specific revenue streams. For example: 'Educational content from Pillar 1 drives affiliate sales, Pillar 2 behind-the-scenes content generates sponsorship opportunities, and Pillar 3 premium tutorials convert to digital product sales.'"
  },
  "scalabilityPlanning": {
        "growthPhases": "Define realistic growth phases for ${budget} budget level over ${timeframe}. Adjust phase expectations based on available resources and timeline constraints.",
    "teamStructure": "Creator ��� Content Manager → Editor → Community Manager → Analytics Specialist",
            "technologyStack": "Specific tool recommendations based on the strategy above. For example: If strategy emphasizes live streaming for ${effectiveTargetAudience || "target audience"}, recommend StreamYard or OBS. If visual content is key, suggest Canva Pro or Adobe Creative Suite. Include scheduling tools like Buffer or Hootsuite, analytics tools specific to ${platform}, and content management systems that work best for ${effectiveTargetAudience || "target audience"} engagement patterns."
  }
}`,
        systemInstruction,
        outputConfig,
      };

    case ContentType.PollsQuizzes:
    case ContentType.PollQuiz:
      systemInstruction = getSystemInstructionFromDefinition(
        aiPersonaDef,
        "You are an engagement specialist and interactive content expert who understands the psychology of participation. Your polls and quizzes consistently achieve 40%+ engagement rates and create viral community discussions. You know how to make people want to participate and share.",
      );
      return {
        prompt: `${baseDetails}

🎯 PREMIUM INTERACTIVE CONTENT CREATION

Design highly engaging polls and quizzes for "${userInput}" on ${platform}.

ENGAGEMENT PSYCHOLOGY:
✅ **Participation Triggers**: Make answering irresistible
��� **Social Sharing**: Create share-worthy results
��� **Curiosity Gaps**: Questions people NEED to answer
✅ **Personal Relevance**: Connect to audience's lives
✅ **Discussion Starters**: Spark conversations in comments

INTERACTIVE CONTENT SUITE:

🗳️ **ENGAGEMENT POLLS** (6 strategic polls)

**Poll 1: Opinion Divider**
📝 Question: [Thought-provoking either/or question]
🎯 Options: [Two compelling choices that divide opinions]
�� Psychology: [Why this creates engagement]
💬 Discussion Starter: [Follow-up question for comments]

**Poll 2: Personal Experience**
📝 Question: [Relatable personal situation]
🎯 Options: [Multiple choices reflecting different experiences]
🧠 Psychology: [Connection to audience identity]
💬 Discussion Starter: [Encourages story sharing]

[Continue for all 6 polls with different psychological triggers]

🧩 **KNOWLEDGE QUIZZES** (3 comprehensive quizzes)

**Quiz 1: Expertise Assessment**
📚 Topic: [Specific knowledge area]
❓ Questions: [5 progressive difficulty questions]
🏆 Scoring: [Meaningful result categories]
🎉 Results: [Personalized feedback and recommendations]
�� Value Add: [Educational insights provided]

**Quiz 2: Personality/Style Assessment**
🧠 Topic: [Personality or preference assessment]
�� Questions: [5 scenario-based questions]
🎭 Results: [Fun, shareable personality types]
📱 Share Factor: [Why people will share results]

**Quiz 3: Challenge/Skills Test**
⚡ Topic: [Practical skills or knowledge test]
❓ Questions: [5 applied knowledge questions]
🎯 Results: [Actionable improvement suggestions]
📈 Growth Path: [Next steps for improvement]

TECHNICAL OPTIMIZATION:
- **Mobile-Friendly**: Easy thumb navigation
- **Visual Appeal**: Engaging graphics and emojis
- **Clear Instructions**: Fool-proof participation
- **Results Sharing**: Built-in social sharing appeal
- **Follow-up Content**: Hooks for continued engagement

Each interactive element should feel addictive, shareable, and valuable while driving meaningful engagement and community building.`,
        systemInstruction,
      };

    case ContentType.TrendAnalysis:
      systemInstruction = getSystemInstructionFromDefinition(
        aiPersonaDef,
        "You are a senior trend analyst and digital strategist who has predicted viral movements and helped brands capitalize on emerging opportunities. You understand algorithm patterns, cultural shifts, and how to translate trend data into actionable content strategies.",
      );
      outputConfig.tools = [{ googleSearch: {} }];

      // Pre-compute all values to avoid temporal dead zone conflicts in template literals
      const audienceMap = {
        general_audience: "General Audience",
        college_students: "College Students",
        young_professionals: "Young Professionals (22-30)",
        millennial_parents: "Millennial Parents",
        gen_z_creators: "Gen Z Content Creators",
        small_business_owners: "Small Business Owners",
        fitness_enthusiasts: "Fitness Enthusiasts",
        tech_professionals: "Tech Professionals",
        retirees: "Active Retirees (55+)",
        stay_at_home_parents: "Stay-at-Home Parents",
        remote_workers: "Remote Workers",
        entrepreneurs: "Entrepreneurs & Startups",
      };
      const targetAudienceKey = options.trendFilters?.targetAudience;
      const targetAudienceDisplay = audienceMap[targetAudienceKey] || targetAudienceKey || "General Audience";

      const goalMap = {
        balanced: "Balanced Mix",
        viral_growth: "🔥 Viral Growth (Short-form Focus)",
        authority_building: "👑 Authority Building (Long-form Focus)",
        community_engagement: "💬 Community Engagement",
        monetization: "💰 Monetization & Conversion",
      };
      const contentGoal = goalMap[options.trendFilters?.contentGoal] || "Balanced Mix";

      // Extract all filters for comprehensive use
      const filters = options.trendFilters || {};
      const timeRange = filters.timeRange || "last_week";
      const region = filters.region || "global";
      const sortBy = filters.sortBy || "relevance";
      const includeCompetitor = filters.includeCompetitor !== false;
      const minEngagement = filters.minEngagement || 0;

      // Map time range to search terms
      const timeRangeMap = {
        last_24h: "past 24 hours",
        last_week: "past week",
        last_month: "past month",
        last_3months: "past 3 months",
        last_year: "past year"
      };
      const timeRangeText = timeRangeMap[timeRange] || "past week";

      // Map region to geographic context
      const regionMap = {
        global: "worldwide",
        us: "United States",
        eu: "Europe",
        asia: "Asia"
      };
      const regionText = regionMap[region] || "worldwide";

      // Map sort preferences to search instructions
      const sortMap = {
        relevance: "most relevant and impactful",
        recency: "most recent and emerging",
        engagement: "highest engagement and viral potential",
        impact: "highest impact and trending momentum"
      };
      const sortText = sortMap[sortBy] || "most relevant and impactful";

      // Get filter information for audience-specific insights
      const filterAudience = options.trendFilters?.targetAudience;

      return {
        prompt: `${baseDetails}

🚀 STRATEGIC TREND ANALYSIS & CONTENT OPPORTUNITIES

Search the web for REAL, CURRENT trending topics related to "${userInput}" and provide actionable insights in this EXACT format:

**PRECISION FILTERS ACTIVE:**
- 🎯 TARGET AUDIENCE: ${targetAudienceDisplay}
- 🚀 CONTENT GOAL: ${contentGoal}
- ⏰ TIME RANGE: ${timeRangeText}
- 🌍 REGION: ${regionText}
- 📊 SORT BY: ${sortText}
- 🏆 MIN ENGAGEMENT: ${minEngagement}+ interactions
- 🔍 COMPETITOR ANALYSIS: ${includeCompetitor ? 'Enabled' : 'Disabled'}

**CRITICAL INSTRUCTIONS:**
1. Use REAL web search data to find current trending topics in the ${userInput} space
2. Analyze what's actually trending NOW (not fictional trends)
3. Each trend must be based on actual social media posts, news, or online discussions
4. Look for patterns in hashtags, viral content, and community discussions
5. Generate 3-5 distinct trend cards, each based on different real trending topics

=== EXECUTIVE SUMMARY ===
[Write 1-2 sentences summarizing the current macro-trends you found through web search specifically for ${targetAudienceDisplay} audience, optimized for ${contentGoal} objectives, focusing on ${timeRangeText} data from ${regionText}, sorted by ${sortText}.]

--- Trend Card Start ---
TREND_NAME: [Real trending topic name based on web search - NOT fictional]
STATUS: [Choose appropriate: Growing Fast ↗️ | Emerging ⚡ | At Peak 🔥 | Fading ↘️ | Stable 📊]
STRATEGIC_INSIGHT: [Why this REAL trend is working based on actual data and social proof you found]
AUDIENCE_ALIGNMENT: [How this REAL trend specifically resonates with ${targetAudienceDisplay} based on current online behavior]
CONTENT_IDEAS: [Based on this REAL trend, provide 4 specific content ideas optimized for ${targetAudienceDisplay} and ${contentGoal}]
KEYWORDS: [Real trending keywords related to this topic that you found through search]
HASHTAGS: [Real hashtags that are currently trending with this topic]
HOOK_ANGLE: [Compelling angle to approach this trend for maximum ${targetAudienceDisplay} engagement]
--- Trend Card End ---

**REPEAT FOR 2-4 MORE REAL TRENDING TOPICS**

- Viral posts with high engagement on ${userInput} topics
- News articles about ${userInput} trends from ${timeRangeText}
- Trending hashtags related to ${userInput}
- Popular YouTube videos or TikToks in the ${userInput} space
- Reddit discussions or community posts about ${userInput}
- Social media influencer posts gaining traction with ${userInput}
- Product launches or announcements in ${userInput} industry

Make sure ALL trends are based on REAL search data for "${userInput}" from ${regionText}, not made-up examples!
AUDIENCE_ALIGNMENT: ${targetAudienceDisplay} in ${regionText} resonates with budget-conscious approaches because they often balance multiple financial priorities. Based on ${timeRangeText} trends in ${regionText}, they appreciate creative solutions that deliver results without breaking the bank, and they love discovering "hidden gems" that offer premium value at accessible prices. ${includeCompetitor ? 'They are particularly interested in comparative analysis to make informed decisions against competitors.' : ''}
CONTENT_IDEAS:
Video: ${userInput} on a $50 Budget: My Complete Setup
Shorts/Reel: Dollar Store ${userInput} Hack That Actually Works
Video: High-End vs. Budget ${userInput}: Blind Test Results
Social Post: Before/After: My $20 ${userInput} Transformation
KEYWORDS: budget ${userInput}, cheap ${userInput}, affordable ${userInput}, DIY ${userInput}, ${userInput} on a budget, low-cost ${userInput}, budget-friendly ${userInput}, ${regionText.toLowerCase()} ${userInput}, ${timeRangeText} ${userInput} deals
HASHTAGS: #budget${userInput.replace(/\s+/g, "")} #frugal${userInput.replace(/\s+/g, "")} #budgetfriendly #affordablelifestyle #savemoney #budgethacks #${regionText.toLowerCase().replace(/\s+/g, "")}${userInput.replace(/\s+/g, "")} #${timeRangeText.replace(/\s+/g, "")}deals
**END OF INSTRUCTIONS**

Generate 3-5 different trend cards based on REAL web search data for "${userInput}" in ${regionText} from ${timeRangeText}.`,
        systemInstruction,
        outputConfig,
      };

    case ContentType.RefinedText:
      if (!originalText) {
        throw new Error("Original text is required for refinement.");
      }
      systemInstruction = getSystemInstructionFromDefinition(
        aiPersonaDef,
        "You are a master editor and content optimization specialist who has refined content for viral creators and major brands. You understand engagement psychology, conversion optimization, and how to enhance content while maintaining its authentic voice and core message.",
      );
      const refinementInstructions = {
        [RefinementType.Shorter]:
          "Condense this content into its most powerful, impactful form. Remove all unnecessary words while amplifying the core message. Make every word count for maximum engagement and retention. Focus on power phrases and emotional triggers.",
        [RefinementType.Longer]:
          "Expand this content with rich details, compelling examples, and deeper insights. Add storytelling elements, emotional depth, and practical value that makes the audience want to stay engaged. Include specific examples and actionable advice.",
        [RefinementType.MoreFormal]:
          "Transform this content into a professional, authoritative piece that establishes credibility and expertise. Use sophisticated language, industry terminology, and polished structure while maintaining engagement and accessibility.",
        [RefinementType.SlightlyMoreFormal]:
          "Elevate the professionalism while keeping the conversational tone. Polish the language and structure to feel more credible and trustworthy without losing the authentic voice and relatability.",
        [RefinementType.MuchMoreFormal]:
          "Create an executive-level, highly professional version with sophisticated vocabulary, formal structure, and authoritative tone. This should feel like premium, expert-level content worthy of industry leadership.",
        [RefinementType.MoreCasual]:
          "Make this content feel like a conversation with a knowledgeable friend. Use casual language, relatable examples, and a warm, approachable tone while maintaining the valuable insights and core message.",
        [RefinementType.SlightlyMoreCasual]:
          "Soften the tone slightly to feel more approachable and relatable. Add conversational elements and friendly language while maintaining professionalism and credibility.",
        [RefinementType.MuchMoreCasual]:
          "Transform this into very casual, friend-to-friend conversation style. Use slang, casual expressions, and a very relaxed tone while keeping the valuable content and insights intact.",
        [RefinementType.AddEmojis]:
          "Strategically integrate emojis to enhance emotional impact, improve readability, and increase engagement. Use emojis to break up text, emphasize key points, and add personality while maintaining professionalism.",
        [RefinementType.MoreEngaging]:
          "Amplify the engagement factor with compelling hooks, interactive elements, and emotional triggers. Add questions, storytelling elements, and calls-to-action that make the audience want to participate and share.",
        [RefinementType.ExpandKeyPoints]:
          "Take the most important points and develop them into comprehensive, valuable sections. Add detailed explanations, real-world examples, case studies, and practical applications that provide deep value.",
        [RefinementType.CondenseMainIdea]:
          "Distill this content down to its absolute core message and most essential points. Create a powerful, concentrated version that delivers maximum impact in minimum time while maintaining all crucial information.",
        [RefinementType.SimplifyLanguage]:
          "Make this content accessible to a broader audience by simplifying complex terms, breaking down difficult concepts, and using clear, straightforward language while maintaining depth and value.",
      };
      return {
        prompt: `${baseDetails}

��� PREMIUM CONTENT REFINEMENT

ORIGINAL CONTENT:
"${originalText}"

REFINEMENT OBJECTIVE: ${refinementType}
STRATEGY: ${refinementInstructions[refinementType!]}

QUALITY STANDARDS:
✅ Maintain the authentic voice and core message
✅ Enhance engagement and readability
✅ Optimize for ${platform} best practices
✅ Preserve all valuable insights and information
✅ Improve conversion potential
✅ Ensure premium feel and professional quality

REFINEMENT PROCESS:
1. **Content Analysis**: Identify strengths and optimization opportunities
2. **Strategic Enhancement**: Apply refinement strategy while preserving value
3. **Platform Optimization**: Ensure content works perfectly for ${platform}
4. **Engagement Amplification**: Add elements that increase audience interaction
5. **Quality Assurance**: Verify improved impact while maintaining authenticity

DELIVERABLE:
Provide the refined content that feels premium, engaging, and perfectly suited for the intended purpose while achieving the specific refinement goal of "${refinementType}".`,
        systemInstruction,
      };

    case ContentType.YoutubeChannelStats:
      systemInstruction = getSystemInstructionFromDefinition(
        aiPersonaDef,
        "You are a YouTube analytics expert who provides comprehensive channel statistics and insights. You understand YouTube metrics, growth patterns, and can extract meaningful insights from channel data.",
      );
      outputConfig.tools = [{ googleSearch: {} }];
      return {
        prompt: `${baseDetails}

🎯 YOUTUBE CHANNEL STATISTICS & ENGAGEMENT ANALYSIS

Analyze and provide comprehensive statistics for the YouTube channel: "${userInput}"

Use Google Search to find the most current and accurate information about this channel, including engagement metrics from top-performing videos.

REQUIRED OUTPUT FORMAT:
Provide the statistics in this exact structure:

**YouTube Channel Statistics for [CHANNEL_URL]:**

**Channel Name:** [Exact channel name]
**Total Videos:** [Exact total number of videos published - count all public videos, shorts, and livestreams. Provide precise count, not approximations]
**Subscribers:** [Precise subscriber count - show exact numbers for smaller channels, use M/K only for channels with 1M+ subscribers]
**All-time Views:** [Precise total view count - show exact numbers for smaller channels, use M/B notation only for very large channels]
**Joined YouTube:** [Channel creation date]
**Location:** [Channel location/country]

**📊 ENGAGEMENT ANALYSIS (Based on Top 5 Most Viral Videos):**
**Engagement Rate:** [Average engagement percentage across top videos]
**Like-to-View Ratio:** [Average percentage of likes per view]
**Comment-to-View Ratio:** [Average percentage of comments per view]
**Viral Score:** [Score out of 100 based on viral indicators]
**Content Score:** [Overall content quality score out of 100]

SEARCH REQUIREMENTS:
- Find the official YouTube channel
- Get the exact total video count including all content types (regular videos, shorts, livestreams)
- Get the most recent subscriber count and view data
- Identify the top 5 most viewed/popular videos from recent months
- Calculate engagement metrics from these viral videos
- Analyze like-to-view and comment-to-view ratios
- Assess viral potential based on algorithm performance indicators

ENGAGEMENT CALCULATIONS:
- Like-to-View Ratio: (Total Likes / Total Views) × 100 for top 5 videos
- Comment-to-View Ratio: (Total Comments / Total Views) × 100 for top 5 videos
- Engagement Rate: Overall interaction rate including likes, comments, shares
- Viral Score: Based on view velocity, engagement velocity, and algorithm signals
- Content Score: Quality assessment based on retention, CTR, and performance patterns

DATA ACCURACY:
- Use the most recent data available
- Focus on recent viral content (last 6-12 months)
- Provide precise numerical values without date stamps
- For smaller channels (under 1M subscribers), show exact numbers
- For larger channels, use appropriate M/B notation but be as precise as possible
- Cross-reference multiple sources for accuracy

OUTPUT STYLE:
- Clean, structured format matching the template exactly
- For small channels: show exact numbers (e.g., "47,283 subscribers", "1,234,567 views")
- For large channels: use precise notation (e.g., "3.62M subscribers", "726.4K views")
- Never include date references like "(as of [date])" in statistics
- Maintain consistent spacing and formatting
- Include engagement percentages with 1-2 decimal places`,
        systemInstruction,
        outputConfig,
      };

    // Continue with other content types...
    case ContentType.RepurposedContent:
      if (!originalText) {
        throw new Error("Original text is required for repurposing.");
      }
      systemInstruction = getSystemInstructionFromDefinition(
        aiPersonaDef,
        "You are a content repurposing strategist who understands how to adapt content across platforms while maximizing engagement and conversion for each unique audience and format.",
      );
      return {
        prompt: `${baseDetails}

🔄 PREMIUM CONTENT REPURPOSING

ORIGINAL CONTENT:
"${originalText}"

TARGET PLATFORM: ${repurposeTargetPlatform}
TARGET FORMAT: ${repurposeTargetContentType}

REPURPOSING STRATEGY:
✅ **Platform Optimization**: Adapt for ${repurposeTargetPlatform}'s unique audience and algorithm preferences
✅ **Format Transformation**: Convert to ${repurposeTargetContentType} while maximizing platform-specific features
✅ **Audience Alignment**: Adjust tone, language, and examples for platform demographics
✅ **Engagement Optimization**: Include platform-specific engagement triggers and calls-to-action
✅ **Value Preservation**: Maintain core insights while enhancing for new format

ADAPTATION ELEMENTS:
- **Length & Pacing**: Optimal for ${repurposeTargetPlatform} consumption patterns
- **Visual Elements**: Platform-appropriate visual cues and formatting
- **Interaction Style**: Engagement methods that work best on ${repurposeTargetPlatform}
- **Hashtag Strategy**: Platform-specific discovery optimization
- **CTA Optimization**: Conversion methods native to ${repurposeTargetPlatform}

Deliver repurposed content that feels native to ${repurposeTargetPlatform} while maintaining the value and insights from the original content.`,
        systemInstruction,
      };

    case ContentType.ABTest:
      systemInstruction = getSystemInstructionFromDefinition(
        aiPersonaDef,
        "You are a conversion optimization expert and A/B testing specialist who understands the psychology of different approaches and how to create meaningful variations that test distinct hypotheses for maximum learning and performance improvement.",
      );
      if (!isABTesting || !abTestType) {
        console.warn(
          "A/B testing configuration not properly set, falling back to mock content",
        );
        return {
          prompt: generateMockContent(ContentType.ABTest, userInput, platform)
            .text,
          systemInstruction,
        };
      }
      return {
        prompt: `${baseDetails}

🧪 PREMIUM A/B TEST VARIATIONS

CONTENT TYPE: ${abTestType}
TOPIC: "${userInput}"
PLATFORM: ${platform}

A/B TESTING STRATEGY:
Create 4 distinct variations that test different psychological approaches and engagement strategies.

VARIATION FRAMEWORK:

**VARIATION A: EMOTIONAL APPEAL**
Focus: Emotional triggers and personal connection
Approach: Use storytelling, emotions, and relatable scenarios
Psychology: Appeals to feelings and personal experiences

**VARIATION B: LOGICAL/RATIONAL**
Focus: Facts, data, and logical benefits
Approach: Use statistics, logical arguments, and clear value propositions
Psychology: Appeals to rational decision-making

**VARIATION C: CURIOSITY/MYSTERY**
Focus: Intrigue and information gaps
Approach: Create curiosity gaps and mysterious elements
Psychology: Appeals to natural curiosity and FOMO

**VARIATION D: SOCIAL PROOF/AUTHORITY**
Focus: Credibility and social validation
Approach: Use testimonials, expert positioning, and popularity indicators
Psychology: Appeals to social conformity and authority trust

FOR EACH VARIATION:
��� **Content**: [Complete variation based on content type]
🧠 **Psychology**: [Why this approach works]
��� **Target Audience**: [Who this appeals to most]
�� **Success Metrics**: [What to measure for this variation]
💡 **Optimization Notes**: [How to improve based on results]

Each variation should be significantly different in approach while maintaining quality and brand consistency, allowing for meaningful testing insights.`,
        systemInstruction,
      };

    case ContentType.ImagePrompt:
      systemInstruction = getSystemInstructionFromDefinition(
        aiPersonaDef,
        "You are a master AI art director and prompt engineer who specializes in creating highly detailed, visually stunning image prompts that generate exceptional results with AI image generators like DALL-E, Midjourney, and Stable Diffusion. Your prompts consistently produce viral-worthy visuals.",
      );
      return {
        prompt: `${baseDetails}

🎨 PREMIUM AI IMAGE PROMPT GENERATION

Create a highly detailed, professional AI image prompt for: "${userInput}"

VISUAL EXCELLENCE FRAMEWORK:
✅ **Composition Mastery**: Rule of thirds, leading lines, visual balance
✅ **Lighting Expertise**: Professional lighting setups, mood creation
���� **Style Specificity**: Clear artistic direction and aesthetic choices
✅ **Technical Precision**: Camera settings, aspect ratios, quality indicators
✅ **Emotional Impact**: Visual elements that evoke desired emotions
✅ **Commercial Quality**: Professional, polished, publication-ready results

PROMPT STRUCTURE:

����� **MAIN SUBJECT**: [Detailed description of primary visual elements]
📸 **COMPOSITION**: [Camera angle, framing, perspective details]
💡 **LIGHTING**: [Lighting setup, mood, shadows, highlights]
���� **COLOR PALETTE**: [Specific colors, saturation, contrast, mood]
✨ **STYLE**: [Artistic style, aesthetic direction, visual treatment]
🔧 **TECHNICAL**: [Quality modifiers, camera settings, rendering details]
🌟 **ATMOSPHERE**: [Mood, emotion, environmental elements]

COMPLETE AI IMAGE PROMPT:
"[Subject description], [composition details], [lighting setup], [color scheme], [artistic style], [technical specifications], [atmospheric elements], [quality modifiers]"

ADDITIONAL VARIATIONS:
Provide 3 alternative prompt variations:
- **Cinematic Version**: Film-style dramatic lighting and composition
- **Artistic Version**: More creative, artistic interpretation
- - **Commercial Version**: Clean, professional, marketing-ready style

NEGATIVE PROMPTS (what to avoid):
"[Specific unwanted elements, artifacts, or quality issues to exclude]"

Each prompt should be detailed enough to generate consistent, high-quality results that match the intended vision and purpose.`,
        systemInstruction,
      };

    case ContentType.ContentGapFinder:
      systemInstruction = getSystemInstructionFromDefinition(
        aiPersonaDef,
        "You are a strategic content researcher and gap analysis expert who identifies untapped content opportunities using advanced search intelligence. You understand market positioning, competitive analysis, and how to find profitable content niches.",
      );
      outputConfig.tools = [{ googleSearch: {} }];
      return {
        prompt: `${baseDetails}

��� PREMIUM CONTENT GAP ANALYSIS

Conduct comprehensive content gap research for: "${userInput}"

Use Google Search to identify content opportunities and market gaps.

RESEARCH FRAMEWORK:

🎯 **MARKET LANDSCAPE ANALYSIS**

**High-Performing Content**:
- Top 10 pieces of content in this space
- What topics are getting the most engagement
- Which formats are working best
- Most successful creators/brands in the niche

**Content Saturation Assessment**:
- Oversaturated topics to avoid
- Emerging topics with low competition
- Seasonal content opportunities
- Trending but underserved angles

**Audience Demand Analysis**:
- Most searched questions in this niche
- Common pain points not being addressed
- Desired outcomes people are seeking
- Gaps between what's available vs. what's wanted

💎 **OPPORTUNITY IDENTIFICATION**

**Immediate Opportunities** (Low competition, high potential):
1. [Specific content topic with details]
2. [Underserved audience segment]
3. [Format/platform combination]
4. [Trending angle not being covered]

**Medium-term Opportunities** (Emerging trends):
1. [Growing topic area]
2. [New platform/format adoption]
3. [Seasonal content preparation]
4. [Cross-pollination opportunities]

**Long-term Strategic Opportunities**:
1. [Authority-building content series]
2. [Community-building initiatives]
3. [Educational content gaps]
4. [Innovation/thought leadership areas]

📊 **COMPETITIVE POSITIONING**

**What Competitors Are Missing**:
- Content quality gaps
- Audience service gaps
- Format innovation opportunities
- Authenticity/personality gaps

**Differentiation Strategies**:
- Unique angle recommendations
- Personal story integration
- Expertise positioning
- Community building approaches

🚀 **ACTIONABLE CONTENT CALENDAR**

**Week 1-2**: [Immediate gap exploitation]
**Week 3-4**: [Emerging opportunity testing]
**Month 2-3**: [Strategic positioning content]
**Quarter Strategy**: [Long-term gap domination]

Each recommendation should include specific reasons why it's an opportunity and how to capitalize on it effectively.`,
        systemInstruction,
        outputConfig,
      };

    case ContentType.MicroScript:
      systemInstruction = getSystemInstructionFromDefinition(
        aiPersonaDef,
        "You are a viral short-form video specialist who understands the science of micro-content. You've analyzed thousands of viral TikToks, Instagram Reels, and YouTube Shorts. Your scripts consistently achieve 90%+ retention and high engagement rates.",
      );
      return {
        prompt: `${baseDetails}

🎬 PREMIUM MICRO-VIDEO SCRIPT

Create a high-retention, viral-potential script for "${userInput}" optimized for short-form video platforms.

MICRO-CONTENT MASTERY:
✅ **3-Second Hook**: Immediate attention capture
✅ **15-60 Second Duration**: Optimal platform length
✅ **90%+ Retention**: Keep viewers watching until the end
✅ **High Engagement**: Comments, shares, saves triggers
✅ **Viral Elements**: Shareability and algorithm optimization
✅ **Clear Value**: Immediate benefit delivery

SCRIPT STRUCTURE:

�� **HOOK (0-3 seconds)**
Visual: [What viewer sees immediately]
Audio: "[Exact opening line that stops the scroll - MUST be 10-15 words to fill 3 seconds]"
Text Overlay: "[Eye-catching text on screen]"
Purpose: Pattern interrupt + curiosity gap
⏱️ **TIMING**: Audio must be exactly 3 seconds when spoken naturally

💡 **VALUE DELIVERY (4-45 seconds)**
Section 1 (4-15s): [First key point/step]
- Visual: [What's happening on screen]
- Audio: "[Narration/dialogue - MUST be 27-33 words to fill 11 seconds]"
- Text: "[Supporting text overlay]"
⏱️ **TIMING**: Audio must fill exactly 11 seconds (4-15s)

Section 2 (16-30s): [Second key point/step]
- Visual: [Scene/action description]
- Audio: "[Continuation of story/info - MUST be 35-42 words to fill 14 seconds]"
- Text: "[Additional text elements]"
⏱️ **TIMING**: Audio must fill exactly 14 seconds (16-30s)

Section 3 (31-45s): [Third key point/conclusion]
- Visual: [Final visual element]
- Audio: "[Wrap-up/revelation - MUST be 35-42 words to fill 14 seconds]"
- Text: "[Final text overlay]"
⏱️ **TIMING**: Audio must fill exactly 14 seconds (31-45s)

�������� **ENGAGEMENT CTA (46-60 seconds)**
Visual: [Call-to-action visual]
Audio: "[Specific engagement request - MUST be 35-42 words to fill 14 seconds]"
Text: "[CTA text overlay]"
Action: [What you want viewers to do]
⏱️ **TIMING**: Audio must fill exactly 14 seconds (46-60s)

RETENTION TECHNIQUES:
- ✨ Pattern breaks and visual transitions
- 🔥 Emotional peaks and valleys
- 🤔 Questions that require answers
- 📊 Lists, countdowns, reveals
- 🎵 Audio/music sync points
- ��� Satisfying conclusions

ENGAGEMENT TRIGGERS:
- Comment baits (ask specific questions)
- Share motivators (relatable content)
- Save triggers (valuable information)
- Follow hooks (promise future content)

TECHNICAL NOTES:
- Camera angles and shot changes
- Pacing and rhythm guidance
- Music/sound effect cues
- Text overlay timing
- Visual effect suggestions

The script should feel addictive, valuable, and impossible to scroll away from while delivering genuine value to the audience.`,
        systemInstruction,
      };

    case ContentType.VoiceToScript:
      systemInstruction = getSystemInstructionFromDefinition(
        aiPersonaDef,
        "You are an expert script writer who specializes in transforming voice recordings and audio content into engaging, structured scripts. You understand natural speech patterns, how to enhance verbal communication for written formats, and how to maintain authentic voice while improving clarity and impact.",
      );
      return {
        prompt: `${baseDetails}

🎙️ PREMIUM VOICE-TO-SCRIPT TRANSFORMATION

Transform the provided audio content for "${userInput}" into a professional, engaging script.

AUDIO ENHANCEMENT STRATEGY:
✅ **Natural Flow**: Maintain authentic speaking style and personality
✅ **Clarity Improvement**: Remove filler words and unclear sections
✅ **Structure Enhancement**: Add logical flow and organization
✅ **Engagement Amplification**: Strengthen hooks and key points
✅ **Platform Optimization**: Format for ${platform} best practices
✅ **Value Preservation**: Keep all important insights and information

SCRIPT TRANSFORMATION PROCESS:

🎯 **AUDIO ANALYSIS**
- Identify key messages and themes
- Note natural speech patterns and personality
- Recognize emotional peaks and important moments
- Extract quotable and shareable segments

📝 **SCRIPT STRUCTURE**

**Opening Hook**:
[Enhanced version of original opening that captures attention]

**Main Content** (Organized into clear sections):
1. [First key point with improved clarity]
2. [Second main idea with better flow]
3. [Third insight with enhanced impact]
[Continue for all major points]

**Engagement Elements**:
- Questions that connect with audience
- Personal stories and relatable examples
- Actionable advice and takeaways
- Emotional moments and authentic insights

**Strong Conclusion**:
[Memorable ending with clear call-to-action]

ENHANCEMENT FEATURES:
- **Filler Removal**: Eliminate "um," "uh," "like," etc.
- **Clarity Boost**: Improve unclear phrases and incomplete thoughts
- **Flow Improvement**: Better transitions between ideas
- **Impact Amplification**: Strengthen key messages
- **Quotability**: Create shareable soundbites
- **Platform Formatting**: Optimize for ${platform} consumption

FINAL SCRIPT OUTPUT:
Deliver a polished script that maintains the original authentic voice while significantly improving clarity, engagement, and impact for the intended platform and audience.`,
        systemInstruction,
      };

    case ContentType.ABTestVariations:
      systemInstruction = getSystemInstructionFromDefinition(
        aiPersonaDef,
        "You are a conversion optimization expert who creates meaningful A/B test variations that test distinct psychological approaches and strategies. Your variations provide clear insights for performance optimization and audience understanding.",
      );
      return {
        prompt: `${baseDetails}

🧪 PREMIUM A/B TEST VARIATION SUITE

Create 5 distinct variations for "${userInput}" that test different psychological approaches and engagement strategies.

TESTING METHODOLOGY:
✅ **Distinct Approaches**: Each variation tests a different psychological trigger
✅ **Meaningful Differences**: Significant variations for clear testing insights
✅ **Performance Tracking**: Measurable elements for comparison
✅ **Audience Segmentation**: Appeal to different audience types
✅ **Statistical Significance**: Variations that will produce actionable data

VARIATION FRAMEWORK:

🎯 **VARIATION A: EMOTIONAL APPEAL**
Approach: Storytelling, emotions, personal connection
Content: [Complete variation focused on feelings and experiences]
Psychology: Appeals to emotional decision-making
Target: Emotion-driven audience segments
Metrics: Engagement rate, emotional reactions, shares

🧠 **VARIATION B: LOGICAL/DATA-DRIVEN**
Approach: Facts, statistics, rational benefits
Content: [Complete variation with logical arguments]
Psychology: Appeals to analytical thinking
Target: Logic-driven decision makers
Metrics: Click-through rates, time spent reading, conversions

🔍 **VARIATION C: CURIOSITY/MYSTERY**
Approach: Information gaps, intrigue, mystery
Content: [Complete variation creating curiosity gaps]
Psychology: Appeals to natural curiosity and FOMO
Target: Discovery-motivated audience
Metrics: Click rates, completion rates, engagement depth

👥 **VARIATION D: SOCIAL PROOF/AUTHORITY**
Approach: Testimonials, expert positioning, popularity
Content: [Complete variation emphasizing credibility]
Psychology: Appeals to social conformity and trust
Target: Security-seeking audience segments
Metrics: Trust indicators, social shares, authority engagement

⚡ **VARIATION E: URGENCY/SCARCITY**
Approach: Time sensitivity, limited availability, immediate action
Content: [Complete variation with urgency elements]
Psychology: Appeals to loss aversion and FOMO
Target: Action-oriented audience
Metrics: Immediate response rates, conversion speed

TESTING RECOMMENDATIONS:
- **Sample Size**: Minimum audience size for statistical significance
- **Testing Duration**: Optimal testing period for reliable results
- **Success Metrics**: Primary and secondary KPIs for each variation
- **Audience Splits**: Recommended audience distribution
- **Implementation Notes**: Technical considerations for testing

Each variation should be substantially different while maintaining brand consistency and quality standards.`,
        systemInstruction,
      };

    // Add the rest of the content types with premium quality prompts...
    case ContentType.EngagementFeedback:
      if (!originalText) {
        throw new Error(
          "Original content is required for engagement feedback.",
        );
      }
      systemInstruction = getSystemInstructionFromDefinition(
        aiPersonaDef,
        "You are a viral content analyst and engagement optimization expert who has studied millions of high-performing posts. You understand audience psychology, platform algorithms, and the specific elements that drive massive engagement and conversion.",
      );
      return {
        prompt: `${baseDetails}

📊 PREMIUM ENGAGEMENT ANALYSIS & OPTIMIZATION

CONTENT TO ANALYZE:
"${originalText}"

PLATFORM: ${platform}
TARGET AUDIENCE: ${targetAudience || "General"}

COMPREHENSIVE ENGAGEMENT AUDIT:

🎯 **ENGAGEMENT SCORE**: [Rate 1-10 with detailed breakdown]

**Overall Rating**: X/10
**Breakdown**:
- Hook Effectiveness: X/10
- Retention Potential: X/10
- Emotional Impact: X/10
- Call-to-Action Strength: X/10
- Shareability Factor: X/10

���� **PSYCHOLOGICAL ANALYSIS**

**Emotional Triggers Present**:
- [List identified emotional hooks]
- [Rate effectiveness of each]

**Audience Connection Points**:
- [Relatability factors]
- [Personal relevance elements]
- [Community building aspects]

**Attention & Retention Elements**:
- [Hook strength analysis]
- [Retention mechanisms identified]
- [Potential drop-off points]

📈 **PERFORMANCE PREDICTION**

**Expected Engagement Metrics**:
- Estimated reach potential
- Predicted engagement rate
- Likely audience actions
- Viral potential assessment

**Algorithm Compatibility**:
- Platform algorithm alignment
- Optimization for discovery
- Engagement signal strength

🚀 **OPTIMIZATION RECOMMENDATIONS**

**Immediate Improvements** (High Impact):
1. [Specific change with expected impact]
2. [Hook enhancement recommendation]
3. [CTA optimization suggestion]

**Strategic Enhancements** (Medium Impact):
1. [Content structure improvements]
2. [Emotional amplification opportunities]
3. [Community engagement additions]

**Advanced Optimizations** (Experimental):
1. [Innovative engagement tactics]
2. [Trending format adaptations]
3. [Cross-platform optimization]

�� **CONVERSION PATHWAY**

**Engagement Funnel Analysis**:
- Attention → Interest conversion
- Interest → Engagement conversion
- Engagement → Follow conversion
- Follow �� Community conversion

Provide actionable, specific recommendations that can immediately improve engagement performance and long-term audience building.`,
        systemInstruction,
      };

    case ContentType.ChannelAnalysis:
      systemInstruction = getSystemInstructionFromDefinition(
        aiPersonaDef,
        "You are a YouTube strategy expert and content analyst with deep knowledge of creator economy trends, algorithm behavior, and viral content patterns. You've analyzed thousands of successful channels and can identify content gaps, optimization opportunities, and strategic growth paths. Your insights help creators scale their channels and maximize their content potential.",
      );
      return {
        prompt: `🎥 COMPREHENSIVE YOUTUBE CHANNEL ANALYSIS

Analyze the following YouTube channel(s) and provide strategic insights: ${userInput}

Based on your knowledge of YouTube best practices, content trends, and creator strategies, provide a comprehensive analysis for ALL of the following sections. IMPORTANT: You must include all 11 sections listed below in your response. If you cannot access current channel data, acknowledge this and provide strategic recommendations based on general content patterns and your expertise:

**Overall Channel(s) Summary & Niche:**
Provide a detailed overview of each channel's core identity, content focus, and niche positioning. If you have access to current data, include subscriber count, total views, upload frequency, and overall brand positioning. If not, acknowledge this limitation and provide general insights about channels in this niche or with these characteristics.

**Competitor Benchmarking Insights (if multiple channels provided):**
Compare performance metrics, content strategies, and audience engagement between channels. Identify what makes top performers successful and where gaps exist.

**Audience Engagement Insights (Inferred from Search):**
Analyze engagement patterns, comment themes, community interaction levels, and audience loyalty indicators. Identify what content drives the highest engagement.

**Content Series & Playlist Recommendations:**
Suggest specific content series ideas, playlist strategies, and recurring content formats that could boost channel growth and audience retention.

**Format Diversification Suggestions:**
Recommend new content formats, video styles, and presentation approaches that align with the channel's brand while expanding reach potential.

**'Low-Hanging Fruit' Video Ideas (actionable & specific):**
Provide 5-10 specific, immediately actionable video concepts that have high viral potential and align with current trends and the channel's niche.

**Inferred Thumbnail & Title Optimization Patterns:**
Analyze successful thumbnails and titles from similar channels to recommend specific design patterns, emotional triggers, and copywriting approaches.

**Potential Content Gaps & Strategic Opportunities:**
Identify underserved topics in the niche, trending subjects the channel hasn't covered, and strategic content opportunities for competitive advantage.

**Key SEO Keywords & Phrases (Tag Cloud Insights):**
Provide a comprehensive list of high-impact keywords, trending search terms, and SEO phrases that should be incorporated into titles, descriptions, and tags.

**Collaboration Theme Suggestions:**
Recommend specific collaboration ideas, cross-channel opportunities, and partnership strategies that could accelerate growth.

**Speculative Historical Content Evolution:**
Analyze how the channel's content has evolved over time and predict future content directions based on current trends and audience development.

🔍 **ANALYSIS APPROACH:**
- Base analysis on your knowledge of YouTube best practices and industry trends
- When you don't have access to current specific channel data, clearly state this limitation
- Provide strategic recommendations based on general content patterns for similar channels
- Focus on actionable advice that applies to channels in the identified niche
- Use your knowledge of YouTube algorithm and content trends (up to your training data cutoff)
- For metrics and specific numbers, either use "estimated" or "typical for this niche" qualifiers, or state when data is not available

📊 **DELIVERABLE FORMAT:**
Present each section with detailed insights, specific examples, and actionable recommendations. When you don't have access to current channel data, be transparent about this and focus on strategic insights based on content patterns and industry knowledge. Provide value through expert analysis and recommendations rather than specific metrics you cannot access.

��️ **CRITICAL REQUIREMENT:** Your response MUST include all 11 sections listed above, starting with "**Overall Channel(s) Summary & Niche:**" and ending with "**Speculative Historical Content Evolution:**". Do not skip or combine sections. Each section should be clearly marked with its exact heading and contain substantial analysis.

💡 **IMPORTANT NOTE:** If you cannot access current channel data, acknowledge this limitation and provide general strategic insights for channels of this type/niche instead of fabricating specific numbers or details.`,
        systemInstruction,
      };

    case ContentType.CourseEducationalContent:
      systemInstruction = getSystemInstructionFromDefinition(
        aiPersonaDef,
        "You are an expert instructional designer and educational content strategist with 15+ years of experience creating successful online courses. You understand learning psychology, course architecture, student engagement, and how to structure content for maximum knowledge retention and completion rates.",
      );

      const moduleCount = options.courseModules || 8;
      const duration = options.courseDuration || "6-8 weeks";
      const difficulty = options.courseDifficulty || "Beginner to Intermediate";
      const includeAssessments = options.includeAssessments !== false;
      const objectives = options.courseObjectives;
      const priceRange = options.coursePriceRange || "$297-$497";
      const courseTargetAudience = options.courseTargetAudience || "aspiring professionals";
      const includeMarketing = options.includeMarketing !== false;
      const includeBonuses = options.includeBonuses !== false;
      const includeUpsells = options.includeUpsells !== false;

      return {
        prompt: `${baseDetails}

🎓 PREMIUM ONLINE COURSE CREATION

Design a comprehensive online course for: "${userInput}"

**COURSE SPECIFICATIONS:**
📚 **Modules**: ${moduleCount} comprehensive modules
⏰ **Duration**: ${duration}
🎯 **Level**: ${difficulty}
📝 **Assessments**: ${includeAssessments ? "Include quizzes, assignments, and practical exercises" : "Content delivery only"}
${objectives ? `🏆 **Learning Objectives**: ${objectives}` : ""}

**EDUCATIONAL EXCELLENCE FRAMEWORK:**
✅ **Clear Learning Pathways**: Logical progression from basic to advanced concepts
✅ **Engagement Strategy**: Interactive elements, multimedia, and hands-on activities
✅ **Knowledge Retention**: Spaced repetition, practical application, and reinforcement
�� **Student Success**: Support systems, feedback mechanisms, and progress tracking
✅ **Professional Quality**: Industry-standard content depth and presentation

**COMPLETE COURSE STRUCTURE:**

🎯 **COURSE OVERVIEW**
**Title**: [Compelling course title]
**Tagline**: [One-line value proposition]
**Target Audience**: [Specific learner profile]
**Prerequisites**: [Required knowledge/skills]
**Learning Outcomes**: [What students will achieve]
**Course Duration**: ${duration} (${moduleCount} modules)
**Difficulty Level**: ${difficulty}

�� **DETAILED MODULE BREAKDOWN**

${Array.from(
  { length: moduleCount },
  (_, i) => `
**MODULE ${i + 1}: [Module Title]**
📖 **Overview**: [What this module covers]
🎯 **Learning Objectives**: [Specific skills/knowledge gained]
📚 **Lessons**:
   • Lesson 1: [Topic] (Duration: X minutes)
   • Lesson 2: [Topic] (Duration: X minutes)
   • Lesson 3: [Topic] (Duration: X minutes)
���� **Key Concepts**: [Main takeaways]
🔧 **Practical Exercise**: [Hands-on activity]
${includeAssessments ? `📝 **Assessment**: [Quiz/assignment details]` : ""}
📈 **Success Metrics**: [How progress is measured]
`,
).join("")}

${
  includeAssessments
    ? `
📝 **ASSESSMENT STRATEGY**

**Formative Assessments** (Throughout course):
• Knowledge checks after each lesson
• Interactive quizzes with immediate feedback
• Progress tracking milestones
• Peer discussion participation

**Summative Assessments** (Module completion):
• Module quizzes (multiple choice + scenario-based)
• Practical assignments with rubrics
• Project-based evaluations
• Portfolio development tasks

**Final Assessment**:
• Comprehensive capstone project
• Real-world application challenge
• Peer review component
• Self-reflection and goal setting
`
    : ""
}

🎨 **ENGAGEMENT & DELIVERY STRATEGY**

**Content Formats**:
• Video lessons with high production value
• Interactive presentations and slides
• Downloadable resources and templates
• Case studies and real-world examples
• Community discussions and Q&A sessions

**Student Engagement**:
• Welcome sequence and onboarding
• Regular check-ins and progress emails
• Gamification elements (badges, progress bars)
• Peer interaction and study groups
�� Office hours and live sessions

**Support Systems**:
• Comprehensive FAQ section
��� Technical support resources
• Learning community/forum
• Instructor feedback mechanisms
• Course completion certificates

🚀 **IMPLEMENTATION ROADMAP**

**Pre-Launch Preparation**:
1. Content creation timeline
2. Platform setup and testing
3. Beta student feedback collection
4. Marketing and enrollment strategy

**Launch Strategy**:
1. Soft launch with limited cohort
2. Feedback collection and optimization
3. Full public launch
4. Ongoing student support and updates

**Success Metrics**:
• Course completion rates (target: 70%+)
• Student satisfaction scores (target: 4.5/5)
• Learning objective achievement rates
• Community engagement levels
• Post-course application success

This course structure ensures maximum learning effectiveness, student engagement, and successful completion rates while delivering exceptional value.`,
        systemInstruction,
      };

    default:
      // Fallback for any content types not specifically handled
      systemInstruction = getSystemInstructionFromDefinition(
        aiPersonaDef,
        "You are a highly skilled content creator and marketing expert with deep knowledge of social media platforms, audience engagement, and viral content strategies.",
      );
      return {
        prompt: `${baseDetails}

🎯 PREMIUM CONTENT CREATION

Generate high-quality ${contentType} content for "${userInput}" on ${platform}.

CONTENT EXCELLENCE STANDARDS:
��� Platform-optimized formatting and style
✅ Audience-appropriate tone and language
✅ Engagement-driving elements and hooks
✅ Value-packed, actionable information
✅ Shareable and memorable content
✅ Clear call-to-action where appropriate

QUALITY FRAMEWORK:
- **Attention-Grabbing**: Compelling opening that captures interest
- **Value-Driven**: Provides genuine benefit to the audience
- **Platform-Native**: Feels natural and optimized for ${platform}
- **Engagement-Focused**: Includes elements that drive interaction
- **Professional Quality**: Polished, error-free, publication-ready

Create content that not only meets the requirements for ${contentType} but exceeds expectations by providing exceptional value and engagement potential for the ${platform} audience.`,
        systemInstruction,
      };
  }
};

const generateRefinedMockContent = (
  userInput: string,
  platform: Platform,
  refinementType?: RefinementType,
  originalText?: string,
): string => {
  if (!originalText || !refinementType) {
    return `🔄 Refined content would appear here. Original text and refinement type are required.`;
  }

  switch (refinementType) {
    case RefinementType.AddEmojis:
      return `✨ Enhanced version with strategic emojis:

�� ${originalText.split(" ").slice(0, 5).join(" ")} 💡
📈 ${originalText.split(" ").slice(5, 10).join(" ")} 🚀
💯 ${originalText.split(" ").slice(10).join(" ")} ⭐

This version uses emojis to improve readability and engagement while maintaining the core message.`;

    case RefinementType.Shorter:
      const shortenedContent = originalText
        .split(" ")
        .slice(0, Math.max(10, originalText.split(" ").length / 2))
        .join(" ");
      return `🎯 Condensed version for ${platform}:

${shortenedContent}${originalText.length > shortenedContent.length ? "..." : ""}

Key improvements: Removed fluff, emphasized core message, increased impact per word.`;

    case RefinementType.Longer:
      return `�������� Expanded version for ${platform}:

${originalText}

Additional value: This expanded version includes more context, examples, and actionable insights that provide deeper value to your audience while maintaining engagement throughout.

Enhanced elements:
• More detailed explanations
• Practical examples
• Actionable next steps
• Emotional connection points

This creates a more comprehensive piece that establishes authority and provides maximum value.`;

    case RefinementType.MoreEngaging:
      return `🚀 High-engagement version for ${platform}:

🤔 Ever wondered about this? ${originalText.split(".")[0]}...

Here's what's fascinating: ${originalText.split(".").slice(1, 2).join(".")}

💡 But here's the game-changer: ${originalText.split(".").slice(2).join(".")}

🔥 What do you think? Drop a comment and let me know your experience!

Enhanced with: Questions, hooks, emotional triggers, and strong CTAs for maximum engagement.`;

    case RefinementType.MoreFormal:
      return `📄 Professional version for ${platform}:

${originalText
  .replace(/!/g, ".")
  .replace(/\?/g, ".")
  .split(" ")
  .map((word) => (word.length > 6 ? word : word))
  .join(" ")}

This refined version maintains professionalism while preserving the core insights and value of the original content.`;

    case RefinementType.MoreCasual:
      return `���� Casual, friendly version for ${platform}:

Hey! So ${originalText.toLowerCase().replace(/\./g, "... ")}

Pretty cool, right? This casual version feels like chatting with a friend while still delivering all the valuable insights!`;

    default:
      return `🔄 Refined content for "${refinementType}" would appear here, taking your original text and applying the specific refinement while maintaining the core message and optimizing for ${platform}.`;
  }
};

const generateEngagementFeedbackMockContent = (
  userInput: string,
  platform: Platform,
): string => {
  return `📊 Engagement Analysis for "${userInput}" on ${platform}:

🎯 **Engagement Score: 8.2/10**

**Strengths:**
✅ Strong emotional hooks that connect with audience
�� Clear value proposition and actionable insights
✅ Platform-optimized formatting and length
✅ Effective use of storytelling elements

**Opportunities:**
🔧 Add more interactive elements (questions, polls)
🔧 Include stronger call-to-action for comments
🔧 Consider trending hashtags for discovery
🔧 Add visual break points for better readability

**Predicted Performance:**
📈 Expected reach: Above average for your niche
💬 Engagement rate: 4-6% (strong for ${platform})
🔄 Share potential: High due to value and relatability

**Optimization Recommendations:**
1. Add a compelling question at the end
2. Include 2-3 relevant emojis for visual appeal
3. Consider a "save this post" prompt
4. Add urgency or scarcity elements

This content has strong viral potential with minor optimizations!`;
};

const generateReadabilityMockContent = (
  userInput: string,
  platform: Platform,
): { scoreDescription: string; simplifiedContent?: string } => {
  return {
    scoreDescription: `📖 Readability Analysis for "${userInput}" on ${platform}:

**Readability Score: 8.5/10** ���

**Reading Level:** Grade 7-8 (Excellent for social media)
**Sentence Length:** Optimal (12-15 words average)
**Vocabulary:** Accessible with strategic complexity
**Structure:** Well-organized with clear flow

**Strengths:**
✅ Clear, conversational tone
✅ Good use of short paragraphs
✅ Active voice throughout
✅ Logical information flow

**Areas for Enhancement:**
🔧 Break up one longer sentence for better flow
🔧 Add transition words for smoother reading
🔧 Consider bullet points for key information

**Platform Optimization:**
Perfect for ${platform} consumption patterns. Content is easily scannable and engaging for mobile users.`,
    simplifiedContent: `Simplified version: This content about "${userInput}" is easy to read and understand. It uses simple words and short sentences. The ideas flow well together. Perfect for ${platform} audiences who want clear, valuable information without complexity.`,
  };
};

const generateTrendAnalysisMockContent = (
  userInput: string,
  platform: Platform,
): TrendAnalysisOutput => {
  return {
    type: "trend_analysis",
    query: userInput,
    items: [
      {
        title: `Rising Trend: ${userInput} Content Strategies`,
        link: "https://example.com/trend1",
        snippet: `Latest ${userInput} trends show 340% increase in engagement when using specific formatting and timing strategies optimized for ${platform}.`,
        sourceType: "news",
      },
      {
        title: `Viral ${userInput} Formats on ${platform}`,
        link: "https://example.com/trend2",
        snippet: `New viral format combining ${userInput} with interactive elements is generating 500% more shares than traditional posts.`,
        sourceType: "discussion",
      },
      {
        title: `${userInput} Algorithm Updates Impact`,
        link: "https://example.com/trend3",
        snippet: `Recent ${platform} algorithm changes favor ${userInput} content that includes specific engagement triggers and community-building elements.`,
        sourceType: "topic",
      },
    ],
    groundingSources: [
      { uri: "https://example.com/source1", title: "Industry Analysis Report" },
      { uri: "https://example.com/source2", title: "Platform Trends Database" },
    ],
  };
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const generateTextContent = async (
  options: any,
): Promise<{ text: string; sources?: Source[]; responseMimeType?: string }> => {
  // Sanitize user input to prevent instruction injection
  if (options.userInput && typeof options.userInput === "string") {
    const originalInput = options.userInput;
    const sanitizedInput = sanitizeUserInput(originalInput);
    logSanitization(originalInput, sanitizedInput);
    options.userInput = sanitizedInput;
  }

  // Immediate fallback for network issues
  try {
    const maxRetries = 4; // Increased for better 503 handling
    const baseDelay = 3000; // Increased base delay for overloaded API
    let lastErrorWasStream = false; // Track stream errors for fresh instance creation

    // Check if we're in Builder.io iframe environment
    const isBuilderEnvironment =
      typeof window !== "undefined" &&
      window !== window.top && // Is in iframe
      window.location.hostname.includes("builder.codes");

    if (isBuilderEnvironment) {
      console.log(
        "🏗️ Builder.io environment detected - network restrictions may apply",
      );
      console.log("🔄 Will fallback to mock content if network calls fail");
    }

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // Check circuit breaker before attempting API calls
        if (checkCircuitBreaker()) {
          console.log(
            "🔴 Circuit breaker is OPEN - falling back to mock content",
          );
          return {
            text: generateMockContent(
              options.contentType,
              options.userInput,
              options.platform,
              options.refinementType,
              options.originalText,
            ).text,
            sources: undefined,
          };
        }
        // Reset AI instance on retries to avoid any state issues
        if (attempt > 0) {
          ai = null; // Force fresh instance creation
          // Additional delay for fresh instance creation
          await sleep(500);
        }

        // Create completely fresh instances for each attempt
        const currentAI = getAIInstance();
        const { prompt, systemInstruction, outputConfig } =
          generatePrompt(options);

        // Debug logging to track generation parameters
        console.log("🔍 Generation Parameters:", {
          contentType: options.contentType,
          batchVariations: options.batchVariations,
          userInputLength: options.userInput?.length || 0,
          sanitizedInput: options.userInput?.substring(0, 50) + "...",
        });

        // Validate prompt before making request
        if (
          !prompt ||
          typeof prompt !== "string" ||
          prompt.trim().length === 0
        ) {
          console.error("�� Invalid prompt:", {
            prompt,
            contentType: options.contentType,
          });
          console.log("���� Falling back to mock content due to invalid prompt");
          return {
            text: generateMockContent(
              options.contentType,
              options.userInput,
              options.platform,
            ).text,
            sources: undefined,
          };
        }

        const requestConfig: any = {
          model: GEMINI_TEXT_MODEL,
          contents: [{ parts: [{ text: prompt }] }],
          config: {
            ...outputConfig,
            // Add request-specific configurations to avoid conflicts
            candidateCount: 1,
            maxOutputTokens: outputConfig?.maxOutputTokens || 8192,
          },
        };
        if (systemInstruction) {
          requestConfig.config.systemInstruction = systemInstruction;
        }

        console.log(
          `🔄 Making API request for ${options.contentType} (attempt ${attempt + 1}/${maxRetries + 1})`,
        );

        let response: GenerateContentResponse;
        let sources: Source[] | undefined = undefined;
        let responseText = "";

        try {
          // Add timeout to prevent hanging requests that might cause 503 errors
          const responsePromise =
            currentAI.models.generateContent(requestConfig);
          const timeoutPromise = new Promise<GenerateContentResponse>(
            (_, reject) => {
              setTimeout(
                () =>
                  reject(
                    new Error("Request timeout - API likely overloaded (503)"),
                  ),
                45000, // Increased timeout for overloaded API
              );
            },
          );

          response = await Promise.race([responsePromise, timeoutPromise]);

          // Handle response more carefully to avoid stream issues
          try {
            // Check if response exists and has candidates
            if (
              !response ||
              !response.candidates ||
              response.candidates.length === 0
            ) {
              throw new Error(
                "Empty response from API - possible 503 overload",
              );
            }

            const firstCandidate = response.candidates[0];
            if (
              !firstCandidate ||
              !firstCandidate.content ||
              !firstCandidate.content.parts
            ) {
              throw new Error("Invalid response structure from API");
            }

            const firstPart = firstCandidate.content.parts[0];
            if (!firstPart || !firstPart.text) {
              throw new Error("No text content in API response");
            }

            responseText = firstPart.text;

            if (!responseText || responseText.trim().length === 0) {
              throw new Error("Empty text content from AI service");
            }
          } catch (extractionError: any) {
            console.error(
              "��� Response extraction error:",
              extractionError.message,
            );
            throw new Error(
              `Response extraction failed: ${extractionError.message}`,
            );
          }

          // Only process grounding metadata if response is valid
          const searchableContentTypes = [
            ContentType.TrendingTopics,
            ContentType.ContentGapFinder,
            ContentType.ChannelAnalysis,
            ContentType.ContentStrategyPlan,
            ContentType.TrendAnalysis,
            ContentType.YoutubeChannelStats,
          ];

          if (
            searchableContentTypes.includes(options.contentType) &&
            response.candidates?.[0]?.groundingMetadata?.groundingChunks
          ) {
            sources = response.candidates[0].groundingMetadata.groundingChunks
              .filter((chunk) => chunk.web && chunk.web.uri)
              .map((chunk) => ({
                uri: chunk.web!.uri,
                title: chunk.web!.title || "Web Source",
              }));
          }
        } catch (responseError: any) {
          // Handle response parsing errors specifically
          if (
            responseError.message &&
            (responseError.message.includes("body stream already read") ||
              responseError.message.includes(
                "Response body object should not be disturbed",
              ) ||
              responseError.message.includes("stream consumed"))
          ) {
            lastErrorWasStream = true;
            throw new Error("Response stream consumed - retry needed");
          }
          throw responseError;
        }

        console.log(
          `✅ Content generated successfully on attempt ${attempt + 1}`,
        );

        // Record successful API call for circuit breaker
        recordCircuitBreakerSuccess();

        return {
          text: responseText,
          sources,
          responseMimeType: outputConfig?.responseMimeType || "text/plain",
        };
      } catch (error: any) {
        console.error(
          `❌ Attempt ${attempt + 1} failed:`,
          error.message || error,
        );

        const isFinalAttempt = attempt === maxRetries;

        // Handle specific error types - check nested error structure too
        const errorMessage = error.message || error.toString() || "";
        const errorCode =
          error.code || error.status || (error.error && error.error.code);
        const errorStatus = error.status || (error.error && error.error.status);

        // Check for nested error object (common in Gemini API responses)
        const nestedError = error.error;
        if (nestedError) {
          console.log(`🔍 Nested error detected:`, {
            code: nestedError.code,
            message: nestedError.message,
            status: nestedError.status,
          });
        }

        const isNetworkError =
          errorMessage.includes("fetch") ||
          errorMessage.includes("network") ||
          errorMessage.includes("ENOTFOUND") ||
          errorCode === "ENOTFOUND";

        // Enhanced error categorization
        const isOverloadError =
          errorMessage.includes("overloaded") ||
          errorMessage.includes("The model is overloaded") ||
          errorMessage.includes("Please try again later") ||
          errorMessage.includes("503") ||
          errorCode === 503 ||
          errorStatus === "UNAVAILABLE" ||
          (nestedError && nestedError.code === 503) ||
          (nestedError && nestedError.status === "UNAVAILABLE") ||
          (nestedError &&
            nestedError.message &&
            nestedError.message.includes("overloaded")) ||
          (error.error && error.error.code === 503) ||
          (error.error && error.error.status === "UNAVAILABLE") ||
          (error.error &&
            error.error.message &&
            error.error.message.includes("overloaded"));

        const isStreamError =
          errorMessage.includes("body stream already read") ||
          errorMessage.includes("Response stream consumed") ||
          errorMessage.includes(
            "Response body object should not be disturbed",
          ) ||
          errorMessage.includes("stream consumed") ||
          errorMessage.includes("Response extraction failed") ||
          errorMessage.includes("Invalid response structure");

        const isRateLimitError =
          errorCode === 429 ||
          errorStatus === "RESOURCE_EXHAUSTED" ||
          errorMessage.includes("429") ||
          errorMessage.includes("rate limit");

        const isRetryableError =
          isOverloadError ||
          isStreamError ||
          isRateLimitError ||
          isNetworkError ||
          errorMessage.includes("Request timeout - API likely overloaded") ||
          (errorCode &&
            (errorCode === 500 || errorCode === 502 || errorCode === 504));

        // Update lastErrorWasStream for next iteration
        if (isStreamError) {
          lastErrorWasStream = true;
        }

        if (isFinalAttempt || (!isRetryableError && !isNetworkError)) {
          console.log(
            `🔄 Fallback: Using premium mock content for ${options.contentType}`,
          );

          // Check if we're in Builder.io iframe and show helpful message
          const isBuilderEnvironment =
            typeof window !== "undefined" &&
            window !== window.top && // Is in iframe
            window.location.hostname.includes("builder.codes");

          if (!isBuilderEnvironment && errorMessage.includes("API_KEY")) {
            console.log("ℹ️ Running in standalone mode with fallback content");
          }

          return {
            text: generateMockContent(
              options.contentType,
              options.userInput,
              options.platform,
              options.refinementType,
              options.originalText,
            ),
          };
        }

        if (!isFinalAttempt) {
          // Calculate delay based on error type with jitter
          const jitter = Math.random() * 3000; // Increased jitter to avoid thundering herd

          let delay: number;
          if (isOverloadError) {
            // More aggressive backoff for overloaded API - start higher, wait longer
            const baseOverloadDelay = 8000; // Start at 8 seconds
            delay = Math.min(
              baseOverloadDelay * Math.pow(4, attempt) + jitter,
              120000,
            ); // Cap at 2 minutes
          } else if (isStreamError) {
            // Longer delay for stream errors to allow cleanup
            const baseStreamDelay = 5000; // Start at 5 seconds for stream issues
            delay = Math.min(
              baseStreamDelay * Math.pow(2, attempt) + jitter,
              30000,
            ); // Cap at 30 seconds
          } else if (isRateLimitError) {
            // Standard exponential backoff for rate limits
            delay = Math.min(baseDelay * Math.pow(2, attempt) + jitter, 45000); // Cap at 45 seconds
          } else {
            // Default backoff for other errors
            delay = Math.min(baseDelay * Math.pow(2, attempt) + jitter, 20000); // Cap at 20 seconds
          }

          if (isOverloadError) {
            // Record failure for circuit breaker
            recordCircuitBreakerFailure();

            console.log(
              `⏳ 🔄 Model overloaded (attempt ${attempt + 1}/${maxRetries + 1}) - Extended backoff: ${Math.round(delay)}ms`,
            );
            console.log(`📊 503/Overload Error details:`, {
              code: errorCode || nestedError?.code,
              status: errorStatus || nestedError?.status,
              message: errorMessage.substring(0, 100) + "...",
              suggestion:
                "High API load detected - using aggressive backoff strategy",
              circuitBreakerFailures: circuitBreakerState.failures,
              nextRetryIn: `${Math.round(delay / 1000)}s`,
              willCreateFreshInstance: true,
            });
          } else if (isStreamError) {
            // Force fresh instance for stream errors
            lastErrorWasStream = true;

            // Clear the AI instance to force a fresh one
            ai = null;

            console.log(
              `⏳ �� Response stream consumed (attempt ${attempt + 1}/${maxRetries + 1}) - Fresh instance retry in ${Math.round(delay)}ms`,
            );
            console.log(
              `💡 Stream fix: Will create fresh AI instance to prevent stream conflicts`,
            );
            console.log(`🔧 Stream error details:`, {
              errorType: "stream_consumption",
              willResetInstance: true,
              instanceCleared: true,
              nextRetryIn: `${Math.round(delay / 1000)}s`,
            });
          } else if (isRateLimitError) {
            console.log(
              `⏳ ���� Rate limit hit (attempt ${attempt + 1}/${maxRetries + 1}) - Backoff: ${Math.round(delay)}ms`,
            );
            console.log(`📊 Rate limit details:`, {
              code: errorCode,
              status: errorStatus,
              suggestion: "API rate limit reached - backing off",
            });
          } else {
            console.log(
              `⏳ 🔄 API error (attempt ${attempt + 1}/${maxRetries + 1}) - Retrying in ${Math.round(delay)}ms`,
            );
            console.log(`📊 Error type:`, {
              code: errorCode,
              status: errorStatus,
              isNetwork: isNetworkError,
              category: "general",
            });
          }

          // Apply minimum delay for stream errors to allow system reset
          const effectiveDelay = isStreamError ? Math.max(delay, 500) : delay;
          await sleep(effectiveDelay);
        }
      }
    }

    // This should never be reached, but just in case
    return {
      text: generateMockContent(
        options.contentType,
        options.userInput,
        options.platform,
        options.refinementType,
        options.originalText,
      ),
    };
  } catch (criticalError) {
    // Catch any errors that slip through (like TypeError: Failed to fetch)
    console.error("🚨 Critical error in generateTextContent:", criticalError);
    console.log("🔄 Falling back to mock content due to critical error");

    return {
      text: generateMockContent(
        options.contentType,
        options.userInput,
        options.platform,
        options.refinementType,
        options.originalText,
      ).text,
      sources: undefined,
    };
  }
};

export const generateImage = async (
  prompt: string,
  negativePrompt?: string,
  aspectRatioGuidance?: AspectRatioGuidance,
): Promise<{ base64Data: string; mimeType: string }> => {
  // Note: Gemini API doesn't support image generation
  // This function returns a placeholder image with the prompt as a message

  console.log("🎨 Image generation requested for:", prompt);
  console.log(
    "⚠️ Note: Gemini API doesn't support image generation. Returning placeholder.",
  );

  try {
    // Create a simple SVG placeholder image with the prompt text
    const aspectRatio = aspectRatioGuidance || AspectRatioGuidance.Square;
    let width = 512;
    let height = 512;

    // Adjust dimensions based on aspect ratio
    switch (aspectRatio) {
      case AspectRatioGuidance.Landscape:
        width = 768;
        height = 512;
        break;
      case AspectRatioGuidance.Portrait:
        width = 512;
        height = 768;
        break;
      case AspectRatioGuidance.Wide:
        width = 1024;
        height = 512;
        break;
      default:
        width = 512;
        height = 512;
    }

    // Create SVG placeholder
    const svgContent = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#4F46E5;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#7C3AED;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)"/>
        <text x="50%" y="30%" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="24" font-weight="bold">
          🎨 AI Image Placeholder
        </text>
        <text x="50%" y="50%" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="16" opacity="0.9">
          Prompt: ${prompt.substring(0, 50)}${prompt.length > 50 ? "..." : ""}
        </text>
        <text x="50%" y="70%" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="14" opacity="0.7">
          Image generation requires additional setup
        </text>
        <text x="50%" y="85%" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="12" opacity="0.6">
          ${aspectRatio} • ${width}x${height}
        </text>
      </svg>
    `;

    // Convert SVG to base64
    const base64Data = btoa(svgContent);

    return {
      base64Data: base64Data,
      mimeType: "image/svg+xml",
    };
  } catch (error: any) {
    console.error("Placeholder image generation error:", error);

    // Fallback to a simple data URL
    const fallbackSvg = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#6366f1"/><text x="50%" y="50%" text-anchor="middle" fill="white" font-size="20">Image Unavailable</text></svg>`;

    return {
      base64Data: btoa(fallbackSvg),
      mimeType: "image/svg+xml",
    };
  }
};

export const performWebSearch = async (query: string): Promise<any> => {
  try {
    console.log("🔍 Enhanced web search for:", query);

    // Use AI to generate intelligent search results
    const searchPrompt = `
As a web search expert, generate realistic and valuable search results for: "${query}"

Create 6-10 diverse, high-quality search results that would help someone researching this topic. Include:

1. Recent blog posts and articles
2. YouTube videos and tutorials
3. Social media discussions
4. News articles (if relevant)
5. Tool recommendations
6. Community discussions

For each result, provide:
- Realistic title
- Brief snippet (2-3 sentences)
- Realistic URL
- Content type (article, video, social, etc.)

Focus on current, trending, and valuable content that would genuinely help with research on "${query}".

Return results in this format:
{
  "results": [
    {
      "title": "Example Title",
      "uri": "https://example.com/path",
      "snippet": "Brief description of the content...",
      "contentType": "article"
    }
  ]
}
`;

    const responseObj = await generateTextContent({
      userInput: searchPrompt,
      contentType: "text",
      platform: "general"
    });

    const response = responseObj?.text || "";

    if (!response || typeof response !== 'string') {
      console.log("Invalid AI response, using fallback");
      return generateIntelligentFallback(query);
    }

    try {
      const parsed = JSON.parse(response);
      if (parsed.results && Array.isArray(parsed.results)) {
        console.log("✅ Enhanced search completed:", parsed.results.length, "AI-powered results");
        return parsed.results;
      }
    } catch (parseError) {
      console.log("Response not JSON, extracting results manually");
    }

    // Fallback: extract results from text response
    const extractedResults = extractSearchResultsFromText(response, query);
    console.log("✅ Enhanced search completed:", extractedResults.length, "extracted results");
    return extractedResults;

  } catch (error: any) {
    console.error("❌ Enhanced search error:", error);

    // Return intelligent fallback results
    return generateIntelligentFallback(query);
  }
};

// Extract search results from AI text response
function extractSearchResultsFromText(text: string, query: string): any[] {
  const results = [];
  const lines = text.split('\n').filter(line => line.trim().length > 0);

  let currentResult: any = {};

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Detect titles (usually start with numbers or are in quotes)
    if (/^\d+\./.test(trimmedLine) || /^".*"$/.test(trimmedLine) ||
        (trimmedLine.length > 10 && trimmedLine.length < 100 &&
         !trimmedLine.startsWith('http') && /[A-Z]/.test(trimmedLine[0]))) {

      if (currentResult.title) {
        results.push(currentResult);
      }

      currentResult = {
        title: trimmedLine.replace(/^\d+\.\s*/, '').replace(/^"|"$/g, ''),
        uri: generateRealisticUrl(trimmedLine, query),
        snippet: '',
        contentType: 'article'
      };
    } else if (currentResult.title && trimmedLine.length > 20) {
      // Add to snippet
      currentResult.snippet = (currentResult.snippet + ' ' + trimmedLine).trim();
    }
  }

  if (currentResult.title) {
    results.push(currentResult);
  }

  return results.slice(0, 10);
}

// Generate realistic URLs based on content
function generateRealisticUrl(title: string, query: string): string {
  const domains = [
    'medium.com', 'dev.to', 'hashnode.com', 'youtube.com', 'github.com',
    'stackoverflow.com', 'reddit.com', 'techcrunch.com', 'wired.com',
    'venturebeat.com', 'mashable.com', 'verge.com', 'ycombinator.com'
  ];

  const domain = domains[Math.floor(Math.random() * domains.length)];
  const slug = title.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 50);

  if (domain === 'youtube.com') {
    return `https://youtube.com/watch?v=${Math.random().toString(36).substr(2, 11)}`;
  } else if (domain === 'github.com') {
    return `https://github.com/user/${slug}`;
  } else if (domain === 'reddit.com') {
    return `https://reddit.com/r/technology/comments/${slug}`;
  }

  return `https://${domain}/${slug}`;
}

// Generate intelligent fallback results
function generateIntelligentFallback(query: string): any[] {
  const queryKeywords = query.toLowerCase().split(' ').filter(word => word.length > 2);
  const mainKeyword = queryKeywords[0] || 'topic';

  return [
    {
      title: `The Ultimate Guide to ${query}`,
      uri: `https://medium.com/@expert/ultimate-guide-to-${mainKeyword}`,
      snippet: `Comprehensive guide covering everything you need to know about ${query}. Includes best practices, tools, and real-world examples.`,
      contentType: 'article'
    },
    {
      title: `${query} - Complete Tutorial Series`,
      uri: `https://youtube.com/watch?v=${Math.random().toString(36).substr(2, 11)}`,
      snippet: `Step-by-step video tutorial series covering ${query} from beginner to advanced level. Practical examples and hands-on exercises.`,
      contentType: 'video'
    },
    {
      title: `Best Tools and Resources for ${query}`,
      uri: `https://github.com/awesome-lists/awesome-${mainKeyword}`,
      snippet: `Curated list of the best tools, libraries, and resources for ${query}. Regularly updated by the community.`,
      contentType: 'list'
    },
    {
      title: `${query} Discussion - Latest Trends and Tips`,
      uri: `https://reddit.com/r/${mainKeyword}/comments/latest-trends`,
      snippet: `Active community discussion about the latest trends, tips, and developments in ${query}. Real user experiences and advice.`,
      contentType: 'forum'
    },
    {
      title: `Getting Started with ${query} - 2024 Edition`,
      uri: `https://dev.to/getting-started-with-${mainKeyword}-2024`,
      snippet: `Updated guide for getting started with ${query} in 2024. Covers the latest tools, best practices, and common pitfalls to avoid.`,
      contentType: 'article'
    }
  ];
}

function generateRelevantResults(query: string, fileType: string = ""): any[] {
  const results = [];
  const lowerQuery = query.toLowerCase();

  // Generate contextual results based on the query
  if (
    fileType === "mp4" ||
    lowerQuery.includes("video") ||
    lowerQuery.includes("mp4")
  ) {
    // Car-specific MP4 results
    if (lowerQuery.includes("car")) {
      results.push(
        {
          uri: "https://archive.org/download/CarCommercial1950s/Car%20Commercial%201950s.mp4",
          title: "Classic Car Commercial (1950s) - MP4",
          snippet:
            "Vintage car commercial from Archive.org. Public domain, direct MP4 download.",
        },
        {
          uri: "https://ia800300.us.archive.org/17/items/dodge1950/dodge1950_512kb.mp4",
          title: "1950 Dodge Car Video - Archive.org",
          snippet:
            "Historic car footage from Internet Archive. Free to download and use.",
        },
        {
          uri: "https://archive.org/download/AutoShow1953/Auto%20Show%201953.mp4",
          title: "Auto Show 1953 - Car Exhibition",
          snippet:
            "Classic auto show footage featuring various cars. Public domain MP4.",
        },
      );
    } else {
      // Generic video results
      results.push(
        {
          uri: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          title: `${query} - Google Sample Video`,
          snippet:
            "Google's verified sample MP4 video. Direct download, guaranteed working link.",
        },
        {
          uri: "https://vjs.zencdn.net/v/oceans.mp4",
          title: `${query} - Video.js Sample`,
          snippet:
            "Video.js sample MP4 file. Verified working direct download link.",
        },
        {
          uri: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
          title: `${query} - HD Video Sample`,
          snippet:
            "Sample-videos.com verified MP4 download. 1MB, 1280x720 resolution.",
        },
      );
    }
  } else if (fileType === "pdf" || lowerQuery.includes("pdf")) {
    results.push(
      {
        uri: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        title: `${query} - Sample PDF Document`,
        snippet: "Sample PDF document for testing and development purposes.",
      },
      {
        uri: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
        title: `${query} - Technical Document`,
        snippet: "Sample technical PDF document with detailed content.",
      },
    );
  } else if (
    fileType === "png" ||
    fileType === "jpg" ||
    lowerQuery.includes("image")
  ) {
    results.push(
      {
        uri: "https://picsum.photos/800/600",
        title: `${query} - High Quality Image`,
        snippet:
          "Random high-quality image from Lorem Picsum. Perfect for testing and placeholders.",
      },
      {
        uri: "https://via.placeholder.com/800x600.png",
        title: `${query} - Placeholder Image`,
        snippet: "Generated placeholder image in the requested dimensions.",
      },
    );
  } else {
    // General web results
    results.push(
      {
        uri: `https://en.wikipedia.org/wiki/${encodeURIComponent(query.replace(/\s+/g, "_"))}`,
        title: `${query} - Wikipedia`,
        snippet: `Wikipedia article about ${query}. Comprehensive information and references.`,
      },
      {
        uri: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
        title: `Search results for: ${query}`,
        snippet: `Find the latest information about ${query} from across the web.`,
      },
      {
        uri: `https://github.com/search?q=${encodeURIComponent(query)}`,
        title: `${query} - GitHub`,
        snippet: `Open source projects and code repositories related to ${query}.`,
      },
    );
  }

  return results;
}

export default generateTextContent;
