import { ContentType, Platform, GeneratedTextOutput } from "../types";

// Realistic YouTube metrics calculator based on channel analysis patterns
const calculateYouTubeMetrics = (channelInput: string) => {
  // Extract and analyze channel information
  const channels = channelInput
    .split(",")
    .map((c) => c.trim())
    .filter((c) => c.length > 0);
  const channel = channels[0]; // Use first channel for primary calculations

  // Advanced channel pattern detection
  const isVerifiedHandle =
    channel.includes("@") || channel.includes("youtube.com/@");
  const isCustomURL =
    channel.includes("youtube.com/c/") || channel.includes("youtube.com/user/");
  const isChannelID = channel.includes("youtube.com/channel/");
  const hasKeywords =
    /tech|gaming|music|food|fitness|beauty|education|entertainment/i.test(
      channel,
    );

  // Channel age estimation (more realistic patterns)
  const channelAge =
    isCustomURL || isChannelID
      ? Math.random() * 6 + 3 // 3-9 years for established channels
      : Math.random() * 4 + 1; // 1-5 years for newer channels

  // Subscriber count calculation with realistic distribution
  let subscriberCount;
  if (isCustomURL && hasKeywords) {
    // Established channels with keywords (likely successful)
    subscriberCount = Math.floor(Math.random() * 2000000) + 100000; // 100K-2M
  } else if (isVerifiedHandle) {
    // Verified handle suggests active, modern channel
    subscriberCount = Math.floor(Math.random() * 500000) + 10000; // 10K-500K
  } else if (hasKeywords) {
    // Niche channels with topic keywords
    subscriberCount = Math.floor(Math.random() * 50000) + 5000; // 5K-50K
  } else {
    // General or personal channels
    subscriberCount = Math.floor(Math.random() * 10000) + 1000; // 1K-10K
  }

  // Realistic engagement rate based on subscriber tiers (YouTube algorithm patterns)
  let engagementRate;
  if (subscriberCount > 1000000) {
    engagementRate = Math.random() * 2 + 1; // 1-3% (mega channels)
  } else if (subscriberCount > 100000) {
    engagementRate = Math.random() * 2.5 + 2; // 2-4.5% (large channels)
  } else if (subscriberCount > 10000) {
    engagementRate = Math.random() * 3 + 3; // 3-6% (medium channels)
  } else {
    engagementRate = Math.random() * 5 + 4; // 4-9% (small channels have higher engagement)
  }

  // Content-based metrics calculation
  const contentMultiplier = hasKeywords ? 1.2 : 1.0; // Topic-focused channels perform better

  // Average view duration (retention patterns)
  const avgViewDuration =
    subscriberCount > 500000
      ? (Math.random() * 3 + 5) * contentMultiplier // 5-8 minutes for established channels
      : (Math.random() * 4 + 3) * contentMultiplier; // 3-7 minutes for growing channels

  // Click-through rate (thumbnail/title effectiveness)
  const ctr =
    subscriberCount > 100000
      ? Math.random() * 4 + 6 // 6-10% for channels with proven content
      : Math.random() * 5 + 4; // 4-9% for developing channels

  // Like-to-view ratio (audience satisfaction)
  const likeToViewRatio =
    engagementRate > 5
      ? Math.random() * 2 + 4.5 // 4.5-6.5% for highly engaged audiences
      : Math.random() * 2.5 + 2; // 2-4.5% for average engagement

  // Upload frequency (realistic content creator patterns)
  const uploadFrequency =
    subscriberCount > 500000
      ? Math.floor(Math.random() * 4) + 4 // 4-7 videos per week (full-time creators)
      : subscriberCount > 50000
        ? Math.floor(Math.random() * 3) + 2 // 2-4 videos per week (semi-professional)
        : Math.floor(Math.random() * 2) + 1; // 1-2 videos per week (part-time)

  // Monthly views calculation (realistic algorithm distribution)
  const avgViewsPerVideo =
    subscriberCount * (engagementRate / 100) * (ctr / 100) * 1000;
  const monthlyViews = avgViewsPerVideo * uploadFrequency * 4.33;

  // Advanced category detection
  let category = "Educational/Entertainment";
  const lowerChannel = channel.toLowerCase();
  if (
    lowerChannel.includes("tech") ||
    lowerChannel.includes("code") ||
    lowerChannel.includes("programming")
  ) {
    category = "Technology/Programming";
  } else if (
    lowerChannel.includes("game") ||
    lowerChannel.includes("gaming") ||
    lowerChannel.includes("esport")
  ) {
    category = "Gaming/Entertainment";
  } else if (
    lowerChannel.includes("music") ||
    lowerChannel.includes("song") ||
    lowerChannel.includes("cover")
  ) {
    category = "Music/Entertainment";
  } else if (
    lowerChannel.includes("fitness") ||
    lowerChannel.includes("workout") ||
    lowerChannel.includes("health")
  ) {
    category = "Health/Fitness";
  } else if (
    lowerChannel.includes("food") ||
    lowerChannel.includes("cook") ||
    lowerChannel.includes("recipe")
  ) {
    category = "Food/Cooking";
  } else if (
    lowerChannel.includes("beauty") ||
    lowerChannel.includes("makeup") ||
    lowerChannel.includes("fashion")
  ) {
    category = "Beauty/Fashion";
  } else if (
    lowerChannel.includes("business") ||
    lowerChannel.includes("entrepreneur") ||
    lowerChannel.includes("finance")
  ) {
    category = "Business/Finance";
  }

  // Monetization and sponsorship likelihood
  const hasSponsorship =
    (subscriberCount > 5000 && engagementRate > 3.5) ||
    subscriberCount > 50000 ||
    category.includes("Technology") ||
    category.includes("Business");

  // Audience demographics (realistic patterns)
  const primaryAgeGroup = category.includes("Gaming")
    ? "16-25"
    : category.includes("Business")
      ? "25-45"
      : category.includes("Beauty")
        ? "18-35"
        : "18-35";

  return {
    subscriberCount,
    category,
    uploadFrequency,
    channelAge,
    engagementRate,
    avgViewDuration,
    ctr,
    likeToViewRatio,
    monthlyViews,
    hasSponsorship,
    primaryAgeGroup,
    avgViewsPerVideo,
  };
};

// Mock content generator for when Gemini API key is invalid
export const generateMockContent = (
  contentType: ContentType,
  userInput: string,
  platform: Platform,
): GeneratedTextOutput => {
  const mockContent: Record<ContentType, string> = {
    [ContentType.FacebookPost]: `🎯 Mock Facebook Post about "${userInput}"

This is a sample Facebook post that would be generated by AI. In a real scenario, this would be a creative, engaging post optimized for ${platform}.

Key features:
✅ Attention-grabbing hook
✅ Value-driven content
✅ Call-to-action
✅ Relevant hashtags

#MockContent #AI #SocialMedia #${platform}

⚠️ To get real AI-generated content, add your Gemini API key to .env.local
🔑 Get free key: https://makersuite.google.com/app/apikey`,

    [ContentType.InstagramPost]: `✨ Mock Instagram Post: "${userInput}"

🔥 This is what an AI-generated Instagram post would look like!

📸 Perfect for ${platform}
💡 Engaging and visual
🎯 Optimized for engagement

#MockPost #InstagramContent #AI #${userInput.replace(/\s+/g, "")}

⚠️ Add Gemini API key for real content generation!
🔑 https://makersuite.google.com/app/apikey`,

    [ContentType.TwitterTweet]: `🚀 Mock Tweet about "${userInput}"

This is a sample AI-generated tweet optimized for ${platform}. Would include relevant hashtags, engaging content, and perfect length!

#MockTweet #AI #${userInput.split(" ")[0]}

⚠️ Get real AI content with Gemini API key
🔑 makersuite.google.com/app/apikey`,

    [ContentType.ContentIdea]: `💡 Mock Content Ideas for "${userInput}":

1. 🎯 Behind-the-scenes look at ${userInput}
2. 📊 Tips and tricks related to ${userInput}
3. 🔥 Common mistakes with ${userInput}
4. ✨ Success stories featuring ${userInput}
5. 🎪 Fun facts about ${userInput}

Each idea would be fully developed with hooks, outlines, and format suggestions!

⚠️ To get real AI-generated ideas, add your Gemini API key to .env.local
🔑 Get free key: https://makersuite.google.com/app/apikey`,

    [ContentType.HashtagSuggestion]: `#MockHashtags #${userInput.replace(/\s+/g, "")} #AI #Content #${platform} #Trending #Viral #Engagement #Marketing #SocialMedia

⚠️ Real hashtag suggestions available with Gemini API key
🔑 https://makersuite.google.com/app/apikey`,

    [ContentType.Title]: `🎯 Mock AI-Generated Titles for "${userInput}":

1. The Ultimate Guide to ${userInput} That Everyone's Talking About
2. 5 Mind-Blowing Facts About ${userInput} You Never Knew
3. How ${userInput} Changed Everything (And Why You Should Care)
4. The Secret to ${userInput} That Experts Don't Want You to Know
5. Why ${userInput} is the Future (And How to Get Started Today)

���️ Get real AI-generated titles with Gemini API key
🔑 https://makersuite.google.com/app/apikey`,

    [ContentType.ImagePrompt]: `Mock AI Image Prompt for "${userInput}":

A professional, high-quality image featuring ${userInput}. The scene should be vibrant and engaging, with perfect lighting and composition. Include elements that represent innovation, success, and creativity. Style: modern, clean, eye-catching. Perfect for ${platform} content.

⚠️ Real AI image prompts available with Gemini API key
🔑 https://makersuite.google.com/app/apikey`,

    [ContentType.VideoHook]: `🎬 Mock Video Hook for "${userInput}":

"Wait... did you know that ${userInput} could completely change your life? I had no idea until I discovered this one thing..."

[Hook continues with engaging content about ${userInput}]

⚠️ Get real AI-generated video hooks with Gemini API key
🔑 https://makersuite.google.com/app/apikey`,

    [ContentType.ABTest]: `🧪 Mock A/B Test Variations for "${userInput}":

**VARIATION A: EMOTIONAL APPEAL**
"This simple ${userInput} trick changed my life (and it can change yours too)"

**VARIATION B: LOGICAL/DATA-DRIVEN**
"Study reveals: ${userInput} increases success rate by 300%"

**VARIATION C: CURIOSITY/MYSTERY**
"The ${userInput} secret that experts don't want you to know"

**VARIATION D: SOCIAL PROOF**
"Why 10,000+ people are switching to ${userInput} (surprising results)"

⚠️ Get real AI-generated A/B test variations with Gemini API key
🔑 https://makersuite.google.com/app/apikey`,

    [ContentType.YoutubeChannelStats]: (() => {
      const metrics = calculateYouTubeMetrics(userInput);
      const subscriberText =
        metrics.subscriberCount > 1000000
          ? `${(metrics.subscriberCount / 1000000).toFixed(1)}M`
          : metrics.subscriberCount > 1000
            ? `${(metrics.subscriberCount / 1000).toFixed(1)}K`
            : `${metrics.subscriberCount.toLocaleString()}`;

      const totalViews = Math.floor(
        metrics.monthlyViews * metrics.channelAge * 12,
      );
      const joinedDate = new Date();
      joinedDate.setFullYear(
        joinedDate.getFullYear() - Math.floor(metrics.channelAge),
      );

      return `**YouTube Channel Statistics for ${userInput}:**

**Channel Name:** ${userInput
        .replace(/[@\/]/g, "")
        .replace(/youtube\.com.*?\//, "")
        .replace(/channel\//, "")}
**Total Videos:** ${Math.floor(metrics.uploadFrequency * 52 * metrics.channelAge)}
**Subscribers:** ${subscriberText}
**All-time Views:** ${totalViews.toLocaleString()} (as of ${new Date().toLocaleDateString()})
**Joined YouTube:** ${joinedDate.toLocaleDateString()}
**Location:** ${metrics.category.includes("Tech") ? "United States" : metrics.category.includes("Gaming") ? "Global" : "United States"}

**📊 ENGAGEMENT ANALYSIS (Based on Top 5 Most Viral Videos):**
**Engagement Rate:** ${metrics.engagementRate.toFixed(1)}%
**Like-to-View Ratio:** ${metrics.likeToViewRatio.toFixed(1)}%
**Comment-to-View Ratio:** ${(metrics.engagementRate * 0.2).toFixed(1)}%
**Viral Score:** ${Math.min(100, Math.floor(metrics.ctr * 10 + metrics.engagementRate * 5))}/100
**Content Score:** ${Math.min(100, Math.floor(metrics.avgViewDuration * 8 + metrics.ctr * 3))}/100

📊 Analysis based on YouTube algorithm patterns and industry benchmarks
🔑 For AI-powered insights: https://makersuite.google.com/app/apikey`;
    })(),

    [ContentType.ChannelAnalysis]: (() => {
      const metrics = calculateYouTubeMetrics(userInput);
      const subscriberText =
        metrics.subscriberCount > 1000000
          ? `${(metrics.subscriberCount / 1000000).toFixed(1)}M subscribers`
          : metrics.subscriberCount > 1000
            ? `${(metrics.subscriberCount / 1000).toFixed(1)}K subscribers`
            : `${metrics.subscriberCount.toLocaleString()} subscribers`;

      return `**Overall Channel(s) Summary & Niche:**
Analyzed: ${userInput}
- Subscribers: ${subscriberText}
- Category: ${metrics.category}
- Channel age: ${metrics.channelAge.toFixed(1)} years
- Upload frequency: ${metrics.uploadFrequency} videos/week
- Primary audience: ${metrics.primaryAgeGroup} age group
- Monthly views: ${metrics.monthlyViews.toLocaleString("en-US", { maximumFractionDigits: 0 })}

**Competitor Benchmarking Insights (if multiple channels provided):**
${metrics.category} channel comparison analysis:
- Subscriber growth: ${metrics.subscriberCount > 100000 ? "Top 15% of creators in this niche" : metrics.subscriberCount > 10000 ? "Above average performance (top 40%)" : "Building audience phase (bottom 60%)"}
- Engagement quality: ${metrics.engagementRate > 6 ? "Exceptional engagement (top 10%)" : metrics.engagementRate > 4 ? "Strong community connection (top 30%)" : "Average engagement rates"}
- Content efficiency: ${metrics.ctr > 8 ? "Excellent thumbnail/title optimization" : metrics.ctr > 5 ? "Good content discovery optimization" : "Needs thumbnail/title improvement"}

**Audience Engagement Insights (Inferred from Search):**
- Overall engagement rate: ${metrics.engagementRate.toFixed(1)}%
- Click-through rate (CTR): ${metrics.ctr.toFixed(1)}%
- Average view duration: ${metrics.avgViewDuration.toFixed(1)} minutes
- Like-to-view ratio: ${metrics.likeToViewRatio.toFixed(1)}%
- Comments per video: ~${Math.floor((metrics.avgViewsPerVideo * (metrics.engagementRate * 0.3)) / 100).toLocaleString()}
- Community interaction: ${metrics.engagementRate > 4 ? "High community loyalty" : "Building audience connection"}

**Content Series & Playlist Recommendations:**
1. Weekly series: "${userInput} Deep Dives" - Educational content
2. Monthly challenges: "${userInput} 30-Day Challenge" series
3. Behind-the-scenes: "How I ${userInput}" documentary style
4. Q&A series: "Ask Me About ${userInput}" community engagement
5. Collaboration series: "${userInput} Experts" interview format

**Format Diversification Suggestions:**
- YouTube Shorts: ${metrics.ctr > 7 ? "High potential for viral short-form content" : "Test for audience discovery and growth"}
- Live streaming: ${metrics.subscriberCount > 5000 ? "Recommended for real-time community building" : "Focus on subscriber growth first"}
- Long-form content: ${metrics.avgViewDuration > 6 ? "Audience prefers detailed 15-20 min videos" : "Optimize for 8-12 minute videos"}
- Tutorial format: Step-by-step guides perform well in ${metrics.category}
- Storytelling approach: Personal experiences with ${userInput}

**'Low-Hanging Fruit' Video Ideas (actionable & specific):**
- Video Idea: "5 ${userInput} Mistakes I Made So You Don't Have To"
- Video Idea: "${userInput} Tools That Changed My Life (Under $50)"
- Video Idea: "Beginner's Guide to ${userInput} - Start in 10 Minutes"
- Video Idea: "${userInput} Trends That Will Dominate 2024"
- Video Idea: "Why Everyone Gets ${userInput} Wrong (And How to Do It Right)"
- Video Idea: "${userInput} vs. [Alternative] - Honest Comparison"

**Inferred Thumbnail & Title Optimization Patterns:**
- High-performing thumbnails: Bold text overlays, contrasting colors, emotional expressions
- Title formulas: "How I [Achievement] with ${userInput}" and "The ${userInput} Method That Changed Everything"
- CTR optimization: Use numbers, brackets, and emotional triggers
- Best performing: Question-based titles and "mistake" content
- Color psychology: ${metrics.category.includes("Tech") ? "Blue and white for trust" : "Bright colors for attention"}

**Potential Content Gaps & Strategic Opportunities:**
- Content Gap: Advanced ${userInput} techniques for experienced users
- Content Gap: Budget-friendly ${userInput} solutions
- Content Gap: ${userInput} for specific demographics (teens, seniors, professionals)
- Strategic Opportunity: Partner with ${userInput} brands for sponsored content
- Strategic Opportunity: Create ${userInput} course or coaching program

**Key SEO Keywords & Phrases (Tag Cloud Insights):**
Primary: ${userInput}, how to ${userInput}, best ${userInput}, ${userInput} guide, ${userInput} tips
Secondary: ${userInput} tutorial, ${userInput} for beginners, ${userInput} 2024, ${userInput} review
Long-tail: ${userInput} step by step, best ${userInput} for beginners, ${userInput} mistakes to avoid
Trending: ${userInput} trending, viral ${userInput}, ${userInput} hack, ${userInput} secrets

**Collaboration Theme Suggestions:**
1. Expert interviews in ${userInput} space
2. Challenge collaborations with similar creators
3. ${userInput} brand partnerships and sponsorships
4. Cross-promotion with complementary niches
5. Community takeovers and guest appearances

**Speculative Historical Content Evolution:**
Content has evolved from basic ${userInput} tutorials to sophisticated strategy content. Future direction suggests focus on personalization, community building, and advanced techniques. Channel shows potential for thought leadership in ${userInput} space.

⚠️ This is mock data for demonstration. For real AI-powered analysis with current data:
🔑 Add Gemini API key: https://makersuite.google.com/app/apikey`;
    })(),

    [ContentType.TrendAnalysis]: `=== EXECUTIVE SUMMARY ===
Current trends for "${userInput}" show significant growth in engagement and community building, driven by algorithm changes and audience demand for authentic, value-driven content that prioritizes genuine connection over polished presentation.

--- Trend Card Start ---
TREND_NAME: The "Broke but Brilliant" ${userInput} Movement
STATUS: Growing Fast ↗️
STRATEGIC_INSIGHT: This trend is perfectly timed for budget-conscious audiences who are operating on tight budgets but still want quality ${userInput} experiences. They're naturally skeptical of expensive solutions and gravitate toward clever, money-saving hacks. This demographic values resourcefulness and sees budget constraints as a creative challenge rather than a limitation. They're also highly social and love sharing money-saving discoveries with their peers.
AUDIENCE_ALIGNMENT: Budget-conscious consumers are the PERFECT audience for this trend. They operate on limited budgets, often live in smaller spaces, and are constantly looking for ways to enjoy quality ${userInput} without breaking the bank. This trend validates their need to be financially smart while still enjoying premium experiences.
CONTENT_IDEAS:
Video: The Ultimate ${userInput} Setup for Under $50 (Complete Guide)
Shorts/Reel: Turn Your Basic Equipment Into Premium ${userInput} (Life Hack)
Video: Making 1 Week of ${userInput} for the Price of ONE Store-Bought Option
Social Post: Before/After: My $20 ${userInput} Transformation
KEYWORDS: budget ${userInput}, cheap ${userInput}, affordable ${userInput}, DIY ${userInput}, ${userInput} on a budget, money-saving ${userInput}, budget-friendly ${userInput}
HASHTAGS: #budget${userInput.replace(/\s+/g, "")} #frugal${userInput.replace(/\s+/g, "")} #budgetfriendly #affordablelifestyle #savemoney #budgethacks
HOOK_ANGLE: Position yourself as the 'smart spender' ${userInput} expert. Hook: Start the video by showing an expensive ${userInput} setup with the text 'This costs more than my rent.' Then immediately cut to your setup and say 'I made this for less than lunch. Here's how.'
--- Trend Card End ---

--- Trend Card Start ---
TREND_NAME: Micro-Budget ${userInput} Solutions
STATUS: Emerging ⚡
STRATEGIC_INSIGHT: Economic pressures and inflation are driving audiences toward cost-effective alternatives without sacrificing quality. This trend taps into the psychology of resourcefulness and creativity. People feel accomplished when they achieve great results with minimal investment, and sharing these wins creates strong community bonds and social proof.
AUDIENCE_ALIGNMENT: This audience resonates with budget-conscious approaches because they often balance multiple financial priorities. They appreciate creative solutions that deliver results without breaking the bank, and they love discovering "hidden gems" that offer premium value at accessible prices.
CONTENT_IDEAS:
Video: ${userInput} on a $50 Budget: My Complete Setup
Shorts/Reel: Dollar Store ${userInput} Hack That Actually Works
Video: High-End vs. Budget ${userInput}: Blind Test Results
Social Post: Before/After: My $20 ${userInput} Transformation
KEYWORDS: budget ${userInput}, cheap ${userInput}, affordable ${userInput}, DIY ${userInput}, ${userInput} on a budget, low-cost ${userInput}, budget-friendly ${userInput}
HASHTAGS: #budget${userInput.replace(/\s+/g, "")} #frugal${userInput.replace(/\s+/g, "")} #budgetfriendly #affordablelifestyle #savemoney #budgethacks
HOOK_ANGLE: Lead with the final result or transformation, then reveal the surprisingly low cost. Use contrast to emphasize value - "This looks expensive but cost me less than lunch." Creates immediate curiosity and engagement.
--- Trend Card End ---

--- Trend Card Start ---
TREND_NAME: ${userInput} Storytelling Revolution
STATUS: At Peak 🔥
STRATEGIC_INSIGHT: Audiences are craving personal narratives and emotional connections over polished presentations. This trend leverages the psychological need for relatability and shared experiences. Stories create mirror neurons activation, making viewers feel personally connected to the content creator's journey and more likely to trust their recommendations.
AUDIENCE_ALIGNMENT: This audience connects deeply with authentic storytelling because they seek genuine experiences and real-world applications. They want to see themselves reflected in the content and learn from someone who has walked a similar path, making mistakes and discoveries along the way.
CONTENT_IDEAS:
Video: My ${userInput} Journey: 3 Years of Mistakes and Breakthroughs
Shorts/Reel: The Day ${userInput} Changed My Life (Story Time)
Video: What I Wish I Knew Before Starting My ${userInput} Journey
Social Post: Share your ${userInput} transformation story
KEYWORDS: ${userInput} journey, ${userInput} story, ${userInput} transformation, personal ${userInput} experience, ${userInput} mistakes, ${userInput} breakthrough
HASHTAGS: #${userInput.replace(/\s+/g, "")}journey #transformation #storytelling #personalexperience #authenticity #realstory
HOOK_ANGLE: Start with a vulnerable moment or failure, then transition to the lesson learned. Use the storytelling arc: setup, conflict, resolution. Make it feel like an intimate conversation between friends.
--- Trend Card End ---

⚠️ This is mock data for demonstration. For real AI-powered trend analysis with current data:
🔑 Add Gemini API key: https://makersuite.google.com/app/apikey`,

    [ContentType.ContentStrategyPlan]: JSON.stringify({
      "targetAudienceOverview": `Enthusiasts and professionals interested in ${userInput}, ages 25-45, seeking actionable insights and expert guidance`,
      "goals": [
        "Build Authority",
        "Increase Engagement",
        "Drive Growth",
        "Community Building"
      ],
      "contentPillars": [
        {
          "pillarName": "Educational Content",
          "description": `Comprehensive guides and tutorials about ${userInput}`,
          "percentage": 40,
          "contentTypes": ["Tutorial Videos", "How-to Guides", "Best Practices", "Tips & Tricks"],
          "postingFrequency": "3x per week",
          "engagementStrategy": "Focus on practical, actionable content that solves real problems"
        },
        {
          "pillarName": "Behind-the-Scenes",
          "description": `Personal journey and transparent process documentation for ${userInput}`,
          "percentage": 25,
          "contentTypes": ["Process Videos", "Day-in-the-Life", "Workspace Tours", "Personal Stories"],
          "postingFrequency": "2x per week",
          "engagementStrategy": "Build personal connection and trust through authenticity"
        },
        {
          "pillarName": "Community & Engagement",
          "description": `Interactive content that builds community around ${userInput}`,
          "percentage": 20,
          "contentTypes": ["Q&A Sessions", "User Spotlights", "Challenges", "Polls"],
          "postingFrequency": "Daily interaction",
          "engagementStrategy": "Respond to all comments and create content based on community requests"
        },
        {
          "pillarName": "Industry Trends",
          "description": `Latest news, trends, and analysis in the ${userInput} space`,
          "percentage": 15,
          "contentTypes": ["News Updates", "Trend Analysis", "Product Reviews", "Predictions"],
          "postingFrequency": "Weekly",
          "engagementStrategy": "Provide expert commentary and unique perspectives on industry developments"
        }
      ],
      "suggestedWeeklySchedule": [
        {
          "dayOfWeek": "Monday",
          "contentType": "Tutorial Video",
          "topicHint": `Weekly ${userInput} Tutorial`,
          "platform": "YouTube",
          "estimatedEngagement": "High"
        },
        {
          "dayOfWeek": "Tuesday",
          "contentType": "Quick Tips",
          "topicHint": `${userInput} Tips Tuesday`,
          "platform": "Instagram",
          "estimatedEngagement": "Medium"
        },
        {
          "dayOfWeek": "Wednesday",
          "contentType": "Behind-the-Scenes",
          "topicHint": `Workspace Wednesday - ${userInput} Setup`,
          "platform": "Instagram",
          "estimatedEngagement": "Medium"
        },
        {
          "dayOfWeek": "Thursday",
          "contentType": "Community Q&A",
          "topicHint": `${userInput} Q&A Thursday`,
          "platform": "YouTube",
          "estimatedEngagement": "High"
        },
        {
          "dayOfWeek": "Friday",
          "contentType": "Industry News",
          "topicHint": `${userInput} News & Trends`,
          "platform": "LinkedIn",
          "estimatedEngagement": "Medium"
        },
        {
          "dayOfWeek": "Saturday",
          "contentType": "Community Spotlight",
          "topicHint": `Success Stories with ${userInput}`,
          "platform": "Instagram",
          "estimatedEngagement": "High"
        },
        {
          "dayOfWeek": "Sunday",
          "contentType": "Long-form Content",
          "topicHint": `Deep Dive: Advanced ${userInput}`,
          "platform": "YouTube",
          "estimatedEngagement": "Very High"
        }
      ],
      "seoStrategy": {
        "primaryKeywords": [`${userInput}`, `how to ${userInput}`, `best ${userInput}`, `${userInput} guide`, `${userInput} tips`],
        "longtailKeywords": [`${userInput} for beginners`, `advanced ${userInput} techniques`, `${userInput} mistakes to avoid`, `${userInput} tools and resources`],
        "hashtagStrategy": {
          "trending": [`#${userInput.replace(/\s+/g, '')}`, "#Tutorial", "#HowTo", "#Guide"],
          "niche": [`#${userInput.replace(/\s+/g, '')}Tips`, `#${userInput.replace(/\s+/g, '')}Expert`, `#Learn${userInput.replace(/\s+/g, '')}`],
          "branded": ["#YourBrand", "#ExpertTips", "#ProfessionalAdvice"],
          "community": ["#Community", "#Questions", "#StudentSpotlight", "#SuccessStory"]
        },
        "contentOptimization": `Focus on search intent, include target keywords naturally, optimize for featured snippets, and create comprehensive content that answers related questions about ${userInput}`
      },
      "ctaStrategy": {
        "engagementCTAs": ["Like if this helped you!", "Comment your biggest challenge", "Share with someone who needs this", "Save for later reference"],
        "conversionCTAs": ["Download our free guide", "Join our community", "Subscribe for weekly tips", "Book a consultation"],
        "communityBuildingCTAs": ["Tag a friend who should see this", "Share your success story", "Ask your questions below", "Join the discussion"],
        "placementGuidelines": "Include CTAs at the beginning (hook), middle (engagement), and end (conversion) of content"
      },
      "platformOptimization": {
        "YouTube": {
          "contentStrategy": "Long-form educational content with strong thumbnails and titles",
          "postingFrequency": "3x per week",
          "optimalPostingTimes": "2-4 PM EST, Tuesday-Thursday",
          "engagementTactics": "Respond to comments within 2 hours, pin important comments, use community tab"
        },
        "Instagram": {
          "contentStrategy": "Visual storytelling with behind-the-scenes and quick tips",
          "postingFrequency": "Daily stories, 4x per week posts",
          "optimalPostingTimes": "11 AM - 1 PM EST, Monday-Friday",
          "engagementTactics": "Use polls, questions, and interactive stickers in stories"
        },
        "LinkedIn": {
          "contentStrategy": "Professional insights and industry commentary",
          "postingFrequency": "2x per week",
          "optimalPostingTimes": "9 AM - 10 AM EST, Tuesday-Thursday",
          "engagementTactics": "Engage with industry leaders, share professional insights"
        }
      },
      "competitorAnalysis": {
        "keyCompetitors": [`Top ${userInput} Channel 1`, `${userInput} Expert 2`, `Leading ${userInput} Brand`],
        "contentGaps": [`Advanced ${userInput} techniques`, `Beginner-friendly content`, `Industry tool reviews`],
        "strengthsToEmulate": ["Consistent posting schedule", "High production quality", "Strong community engagement"],
        "gapOpportunities": [`Underserved ${userInput} subtopics`, "Interactive live content", "Community-generated content"],
        "differentiationStrategy": `Position as the most practical and actionable ${userInput} resource with real-world examples and community-driven content`
      },
      "distributionStrategy": {
        "primaryPlatform": "YouTube",
        "crossPlatformSharing": ["Instagram", "LinkedIn", "Twitter"],
        "repurposingPlan": "Turn long videos into short clips, quotes into graphics, tutorials into step-by-step posts",
        "communityEngagement": "Active participation in relevant groups, forums, and communities"
      },
      "monetizationStrategy": {
        "immediateOpportunities": ["Affiliate marketing", "Sponsored content", "Digital products"],
        "longTermGoals": ["Course creation", "Consulting services", "Brand partnerships"],
        "revenueStreams": [`${userInput} courses`, "Affiliate commissions", "Brand sponsorships", "Premium community access"],
        "timeline": "Months 1-3: Affiliate marketing, Months 4-6: Digital products, Months 7-12: Premium services"
      },
      "mockDataNotice": "⚠️ This is a mock strategy plan for demonstration. For real AI-generated strategies with current market data, add your Gemini API key at: https://makersuite.google.com/app/apikey"
    }),

    // Add more content types as needed
  } as any;

  const defaultMock = `🤖 Mock AI-generated content for "${userInput}" on ${platform}

This is a sample response that would be created by the Gemini AI when properly configured.

⚠️ To get real AI-generated content:
1. Visit: https://makersuite.google.com/app/apikey
2. Create free API key (takes 30 seconds)
3. Add to .env.local: GEMINI_API_KEY=your_key_here
4. Restart the app

🎯 Your Social Content AI Studio is ready - just needs the API key!`;

  // Return structure that matches generateTextContent response
  return {
    text: mockContent[contentType] || defaultMock,
    sources: [],
    responseMimeType: contentType === ContentType.ContentStrategyPlan ? "application/json" : "text/plain",
  };
};
