/**
 * Comprehensive CreateGen Studio Knowledge Base for AI Assistant
 * Contains detailed information about every feature, workflow, and capability
 */

export interface AppFeature {
  name: string;
  id: string;
  description: string;
  mainComponents: string[];
  workflows: WorkflowStep[];
  commonQuestions: QuestionAnswer[];
  troubleshooting: TroubleshootingItem[];
  integrations: string[];
  premiumFeatures?: string[];
}

export interface WorkflowStep {
  step: number;
  title: string;
  action: string;
  details: string;
  tips?: string[];
}

export interface QuestionAnswer {
  question: string;
  answer: string;
  relatedActions?: string[];
}

export interface TroubleshootingItem {
  issue: string;
  solution: string;
  prevention?: string;
}

export const CREATE_GEN_STUDIO_KNOWLEDGE: AppFeature[] = [
  {
    name: "Studio Hub",
    id: "studioHub",
    description: "Central workspace and project management dashboard. Your command center for managing all content creation projects and accessing tools.",
    mainComponents: ["Project Pipeline", "Activity Feed", "Quick Launch Bar", "Tools Integration Hub", "Command Palette", "Workspace Actions"],
    workflows: [
      {
        step: 1,
        title: "Create New Project",
        action: "Click the 'New Project' button in Quick Launch section",
        details: "Choose from templates: YouTube Video, Social Campaign, Content Series, Brand Strategy, or start blank",
        tips: ["Use templates to get pre-configured tool combinations", "Set deadlines to track progress"]
      },
      {
        step: 2,
        title: "Manage Project Progress",
        action: "View projects in the Project Pipeline",
        details: "Track status (planning, in_progress, review, completed) and progress percentage",
        tips: ["Click on projects to expand details", "Use filters to view by status"]
      },
      {
        step: 3,
        title: "Access Tools Quickly",
        action: "Use Quick Launch Bar or Command Palette (Cmd/Ctrl+K)",
        details: "Navigate to any tool with one click or keyboard shortcut",
        tips: ["Cmd+K for global search", "Tools show usage statistics and recommendations"]
      },
      {
        step: 4,
        title: "View Activity & Insights",
        action: "Check Activity Feed for recent generations and AI insights",
        details: "See recent content creation activity and performance recommendations",
        tips: ["Insights are updated based on your content performance", "Click actions to jump to relevant tools"]
      }
    ],
    commonQuestions: [
      {
        question: "How do I create a new project?",
        answer: "Click the 'New Project' button in the Quick Launch section of Studio Hub. Choose a template (YouTube Video, Social Campaign, etc.) or start blank. Fill in project details and select tools to use.",
        relatedActions: ["navigate:studioHub"]
      },
      {
        question: "What's the Command Palette?",
        answer: "Press Cmd+K (Mac) or Ctrl+K (Windows) to open the Command Palette. It's a global search that lets you quickly navigate to any tool, search content, or perform actions.",
        relatedActions: ["openCommandPalette"]
      },
      {
        question: "How do I track project progress?",
        answer: "In the Project Pipeline section, you can see all projects with their status, progress percentage, and last updated time. Click on any project to expand details and update status.",
        relatedActions: ["navigate:studioHub"]
      }
    ],
    troubleshooting: [
      {
        issue: "Projects not showing up",
        solution: "Check your view mode filter in Project Pipeline. Switch between 'dashboard', 'projects', and 'analytics' views.",
        prevention: "Projects are automatically saved to browser storage and Firebase if logged in"
      }
    ],
    integrations: ["YouTube Channel Connection", "Project Export", "Automation Setup", "Analytics Dashboard"]
  },
  {
    name: "Generator",
    id: "generator",
    description: "AI-powered content generation engine that creates scripts, titles, hooks, ideas, and 25+ types of content optimized for different platforms.",
    mainComponents: ["Platform Selection", "Content Type Dropdown", "Generation Interface", "AI Persona Settings", "Batch Generation", "Output Management"],
    workflows: [
      {
        step: 1,
        title: "Select Platform",
        action: "Choose target platform (YouTube, TikTok, Instagram, Twitter, LinkedIn, Facebook)",
        details: "Platform selection optimizes content format, length, and style for that specific platform's audience and algorithm",
        tips: ["Different platforms have different optimal content lengths", "Platform affects hashtag suggestions and tone"]
      },
      {
        step: 2,
        title: "Choose Content Type",
        action: "Select from 25+ content types in the dropdown menu",
        details: "Options include: Scripts, Ideas, Titles, Video Hooks, Thumbnail Concepts, Content Briefs, Polls & Quizzes, A/B Test Variations, SEO Keywords, and more",
        tips: ["Scripts can specify video length", "Titles generate multiple variations", "Hooks focus on first 3 seconds"]
      },
      {
        step: 3,
        title: "Enter Topic/Prompt",
        action: "Describe your content topic or paste existing content for refinement",
        details: "Be specific for better results. Include target audience, key points, or style preferences",
        tips: ["More specific prompts = better results", "You can refine existing content too", "Mention your niche for relevant suggestions"]
      },
      {
        step: 4,
        title: "Configure Generation Options",
        action: "Set AI persona, target audience, batch variations, SEO keywords, video length",
        details: "AI personas change the writing style. Batch generation creates multiple variations. SEO mode optimizes for search",
        tips: ["Professional persona for business content", "Casual persona for social media", "Batch generation great for A/B testing"]
      },
      {
        step: 5,
        title: "Generate & Refine",
        action: "Click Generate, then use refinement options to improve results",
        details: "Generated content can be made shorter/longer, more formal/casual, or optimized for engagement",
        tips: ["Save best results to History", "Export to other tools like Canvas or Thumbnails", "Use A/B test variations for optimization"]
      }
    ],
    commonQuestions: [
      {
        question: "How do I create a YouTube video script?",
        answer: "1. Select 'YouTube' platform 2. Choose 'Script' from content type dropdown 3. Enter your video topic 4. Set video length (1-2 min, 3-5 min, etc.) 5. Choose AI persona and target audience 6. Click Generate. The AI will create a structured script with hooks, main content, and call-to-actions.",
        relatedActions: ["navigate:generator"]
      },
      {
        question: "What are AI personas and how do I use them?",
        answer: "AI personas change the writing style and tone. Options include Professional (formal, authoritative), Casual (friendly, conversational), Creative (innovative, artistic), and others. Choose based on your brand voice and target audience.",
        relatedActions: ["navigate:generator"]
      },
      {
        question: "How do I generate multiple title variations?",
        answer: "1. Select your platform 2. Choose 'Title/Headlines' content type 3. Enter your topic 4. Increase 'Batch Variations' to 10-15 5. Generate. You'll get multiple title options optimized for engagement and SEO.",
        relatedActions: ["navigate:generator"]
      },
      {
        question: "Can I refine generated content?",
        answer: "Yes! After generation, use the refinement buttons to make content shorter/longer, more/less formal, add emojis, or optimize for engagement. Each refinement creates a new version while preserving the original.",
        relatedActions: ["navigate:generator"]
      }
    ],
    troubleshooting: [
      {
        issue: "Generation taking too long",
        solution: "Check your internet connection. Complex requests (like batch generation) take longer. Free users may experience slower generation during peak times.",
        prevention: "Premium users get priority processing and faster generation times"
      },
      {
        issue: "Generated content not relevant",
        solution: "Be more specific in your prompt. Include target audience, key points, and desired tone. Try different AI personas or adjust platform selection.",
        prevention: "Use detailed prompts with context about your audience and goals"
      }
    ],
    integrations: ["Canvas (for visual layouts)", "Thumbnails (for matching visuals)", "Strategy (for strategic planning)", "History (for saving results)"],
    premiumFeatures: ["Unlimited generations", "Advanced AI personas", "Batch generation up to 50 variations", "Priority processing", "Custom AI training"]
  },
  {
    name: "Canvas",
    id: "canvas",
    description: "Visual design and layout tool for creating mind maps, flowcharts, mood boards, and collaborative visual workspaces with drag-and-drop interface.",
    mainComponents: ["Canvas Workspace", "Element Toolbar", "Property Panel", "Layer Management", "Export Options", "Collaboration Tools"],
    workflows: [
      {
        step: 1,
        title: "Add Elements",
        action: "Use toolbar to add text, shapes, sticky notes, images, or frames",
        details: "Click element type, then click on canvas to place. Elements can be resized, moved, and styled",
        tips: ["Sticky notes for brainstorming", "Frames for grouping elements", "Connectors for flowcharts"]
      },
      {
        step: 2,
        title: "Design and Layout",
        action: "Drag elements to position, resize with handles, use property panel for styling",
        details: "Change colors, fonts, borders, and effects. Use alignment tools for professional layouts",
        tips: ["Hold Shift while resizing to maintain proportions", "Use snap-to-grid for alignment", "Group related elements together"]
      },
      {
        step: 3,
        title: "Create Mind Maps",
        action: "Import content from Strategy tool or create manually with connected elements",
        details: "Use central nodes with branching connections. Add colors and icons for visual hierarchy",
        tips: ["Start with main topic in center", "Use colors to categorize topics", "Keep text concise on nodes"]
      },
      {
        step: 4,
        title: "Export and Share",
        action: "Export as PNG, JPG, or save as project for later editing",
        details: "Choose resolution and format. Projects can be shared with team members for collaboration",
        tips: ["High resolution for print", "PNG for transparency", "Save project to preserve editing capability"]
      }
    ],
    commonQuestions: [
      {
        question: "How do I create a mind map from my content strategy?",
        answer: "1. Go to Strategy tool first and generate a content strategy 2. In Canvas, click 'Import from Strategy' or manually create 3. Add a central node with your main topic 4. Branch out with content pillars as secondary nodes 5. Add details and tactics as third-level nodes 6. Use colors to categorize different types of content",
        relatedActions: ["navigate:canvas", "navigate:strategy"]
      },
      {
        question: "How do I add images to my canvas?",
        answer: "Click the 'Image' tool in the toolbar, then click on canvas where you want to place it. You can upload your own images or use AI-generated backgrounds (premium feature). Resize and position as needed.",
        relatedActions: ["navigate:canvas"]
      },
      {
        question: "Can I collaborate with team members on canvas projects?",
        answer: "Yes! Premium users can share canvas projects with team members for real-time collaboration. Use the share button to generate collaboration links with view or edit permissions.",
        relatedActions: ["navigate:canvas"]
      }
    ],
    troubleshooting: [
      {
        issue: "Elements not aligning properly",
        solution: "Enable snap-to-grid in the view options. Use the alignment tools in the property panel to align multiple selected elements.",
        prevention: "Use guides and grid settings for consistent layouts"
      },
      {
        issue: "Canvas running slowly",
        solution: "Large canvases with many elements can slow down. Try grouping elements, reducing image sizes, or breaking into multiple canvas projects.",
        prevention: "Keep canvas projects focused and use appropriate image resolutions"
      }
    ],
    integrations: ["Strategy tool (import content plans)", "Generator (add generated content)", "Export to image formats", "Team collaboration"],
    premiumFeatures: ["AI-generated backgrounds", "Advanced shapes and templates", "Team collaboration", "Version history", "High-resolution exports"]
  },
  {
    name: "YouTube Analysis",
    id: "channelAnalysis",
    description: "Intelligent YouTube channel analyzer that identifies content gaps, opportunities, and competitive insights by analyzing up to 5 channels simultaneously.",
    mainComponents: ["Channel Input Interface", "Analysis Engine", "Report Generator", "Content Gap Identifier", "Opportunity Finder", "Export Options"],
    workflows: [
      {
        step: 1,
        title: "Enter Channel Information",
        action: "Input YouTube channel URLs or channel names (supports up to 5 channels)",
        details: "Can analyze your own channel, competitors, or channels for inspiration. URLs like youtube.com/@channelname or just the channel name work",
        tips: ["Analyze successful channels in your niche", "Compare multiple competitors", "Include your own channel for benchmarking"]
      },
      {
        step: 2,
        title: "Run Analysis",
        action: "Click 'Start Analysis' and wait for AI to process channels",
        details: "AI analyzes video titles, descriptions, thumbnail patterns, posting frequency, engagement rates, and content themes",
        tips: ["Analysis takes 2-5 minutes per channel", "Free users: 4 credits per channel", "Premium users get priority processing"]
      },
      {
        step: 3,
        title: "Review Analysis Report",
        action: "Read comprehensive report with channel overview, content analysis, and audience insights",
        details: "Report includes subscriber count, video performance, content themes, posting patterns, and audience engagement data",
        tips: ["Pay attention to content gaps section", "Note successful video formats", "Look for underserved topics"]
      },
      {
        step: 4,
        title: "Identify Opportunities",
        action: "Focus on 'Content Gaps & Opportunities' and 'Low-Hanging Fruit Ideas' sections",
        details: "AI identifies topics that perform well but are underserved, optimal video lengths, and content formats to try",
        tips: ["Start with low-hanging fruit ideas", "Consider seasonal opportunities", "Match opportunities to your expertise"]
      },
      {
        step: 5,
        title: "Generate Content Ideas",
        action: "Use insights to create content in Generator tool or export analysis",
        details: "Take specific opportunities and generate titles, scripts, or thumbnail concepts in Generator tool",
        tips: ["Copy promising formats", "Adapt successful patterns to your niche", "Test different content lengths identified"]
      }
    ],
    commonQuestions: [
      {
        question: "How do I analyze my competitor's YouTube channel?",
        answer: "1. Go to YT Analysis tab 2. Enter competitor's YouTube channel URL (youtube.com/@channelname) or just the channel name 3. Click 'Start Analysis' 4. Wait 2-5 minutes for AI processing 5. Review the comprehensive report focusing on content gaps and opportunities 6. Use insights to create better content in Generator tool",
        relatedActions: ["navigate:channelAnalysis"]
      },
      {
        question: "Can I analyze multiple channels at once?",
        answer: "Yes! You can analyze up to 5 channels simultaneously. Enter multiple channel URLs separated by commas or new lines. This is great for comprehensive competitive analysis or studying successful channels in your niche.",
        relatedActions: ["navigate:channelAnalysis"]
      },
      {
        question: "What should I look for in the analysis results?",
        answer: "Focus on: 1) Content Gaps - topics that perform well but are underserved 2) Low-Hanging Fruit - easy opportunities you can quickly capitalize on 3) Posting patterns and video lengths that work 4) Thumbnail and title patterns that get high engagement 5) Audience preferences and pain points",
        relatedActions: ["navigate:channelAnalysis"]
      },
      {
        question: "How often should I run channel analysis?",
        answer: "Monthly for competitive tracking, or when planning new content strategies. Analysis helps identify trending topics and shifts in audience preferences. Premium users get unlimited analysis for continuous monitoring.",
        relatedActions: ["navigate:channelAnalysis"]
      }
    ],
    troubleshooting: [
      {
        issue: "Channel not found or analysis failed",
        solution: "Check channel URL format (use youtube.com/@channelname or youtube.com/c/channelname). Ensure channel is public and has recent videos. Private or empty channels cannot be analyzed.",
        prevention: "Use exact YouTube URLs or verified channel names"
      },
      {
        issue: "Analysis taking too long",
        solution: "Large channels with thousands of videos take longer to analyze. Free users may experience delays during peak times. Premium users get priority processing.",
        prevention: "Premium subscription provides faster analysis and higher priority"
      }
    ],
    integrations: ["Generator (use insights for content creation)", "Strategy (incorporate findings into strategy)", "Trends (cross-reference with trending topics)", "Export to PDF/CSV"],
    premiumFeatures: ["Unlimited channel analysis", "Priority processing", "Advanced competitive insights", "Automated monitoring", "Historical trend analysis"]
  },
  {
    name: "YouTube Stats",
    id: "youtubeStats",
    description: "Comprehensive YouTube analytics dashboard providing detailed channel statistics, performance metrics, and growth insights for any public YouTube channel.",
    mainComponents: ["Channel Stats Display", "Engagement Metrics", "Performance Analytics", "Growth Tracking", "Video Analysis", "Export Tools"],
    workflows: [
      {
        step: 1,
        title: "Enter Channel Name",
        action: "Input YouTube channel name or URL in the search field",
        details: "Works with channel names, @handles, or full YouTube URLs. Searches for public channels only",
        tips: ["Use exact channel name for best results", "@ handles work great", "Channels must be public to analyze"]
      },
      {
        step: 2,
        title: "View Channel Statistics",
        action: "Review comprehensive metrics including subscribers, views, and engagement rates",
        details: "Shows total subscribers, all-time views, video count, channel creation date, and location if available",
        tips: ["Compare metrics to industry benchmarks", "Note channel growth trajectory", "Check engagement vs subscriber ratio"]
      },
      {
        step: 3,
        title: "Analyze Performance Metrics",
        action: "Study engagement rates, like-to-view ratios, and content performance scores",
        details: "Engagement rate calculated from top-performing videos, viral score based on algorithm performance indicators",
        tips: ["Engagement rate above 3% is good", "High like-to-view ratio indicates quality content", "Viral score shows algorithm friendliness"]
      },
      {
        step: 4,
        title: "Export or Track Data",
        action: "Export statistics or bookmark for regular monitoring",
        details: "Save data for competitive analysis, track your own growth, or benchmark against successful channels",
        tips: ["Export for reports and presentations", "Regular monitoring shows trends", "Compare with your own channel stats"]
      }
    ],
    commonQuestions: [
      {
        question: "How do I check my YouTube channel statistics?",
        answer: "1. Go to YT Stats tab 2. Enter your channel name, @handle, or URL 3. View comprehensive stats including subscribers, views, engagement rates 4. The system calculates engagement rates from your top-performing videos and provides viral scores",
        relatedActions: ["navigate:youtubeStats"]
      },
      {
        question: "What is a good engagement rate?",
        answer: "YouTube engagement rates: 1-3% = Average, 3-6% = Good, 6%+ = Excellent. Our system calculates this from your top-performing videos' likes and comments divided by views. Higher engagement indicates stronger audience connection.",
        relatedActions: ["navigate:youtubeStats"]
      },
      {
        question: "Can I track competitor channel stats?",
        answer: "Yes! Enter any public YouTube channel to see their statistics. Use this for competitive analysis, benchmarking, or studying successful channels in your niche. Export data to track changes over time.",
        relatedActions: ["navigate:youtubeStats"]
      },
      {
        question: "How accurate are the statistics?",
        answer: "We pull data directly from YouTube's public API and calculate engagement metrics from recent top-performing videos. Subscriber counts and view counts are real-time. Engagement rates are calculated from the most viral content.",
        relatedActions: ["navigate:youtubeStats"]
      }
    ],
    troubleshooting: [
      {
        issue: "Channel not found",
        solution: "Check spelling of channel name. Try using the exact @handle or full YouTube URL. Channel must be public and have recent activity.",
        prevention: "Use exact channel names or @ handles from YouTube"
      },
      {
        issue: "Statistics seem outdated",
        solution: "YouTube statistics update with slight delays. Very new channels or recently created videos may not show immediately in calculations.",
        prevention: "YouTube API updates have natural delays for recent data"
      }
    ],
    integrations: ["Export to spreadsheets", "Compare with channel analysis", "Track for strategy planning", "Benchmark against competitors"],
    premiumFeatures: ["Historical data tracking", "Automated monitoring alerts", "Advanced analytics", "Bulk channel analysis", "Custom reporting"]
  },
  {
    name: "Thumbnails",
    id: "thumbnailMaker",
    description: "Professional thumbnail creation tool with AI-powered background generation, customizable text overlays, and templates optimized for maximum click-through rates.",
    mainComponents: ["Canvas Editor", "Text Tools", "Background Generator", "Template Library", "Effects Panel", "Export Options"],
    workflows: [
      {
        step: 1,
        title: "Choose Starting Point",
        action: "Select from templates, upload image, or start with AI-generated background",
        details: "Templates are optimized for different content types (gaming, education, vlogs, etc.). AI backgrounds create custom scenes based on your description",
        tips: ["Templates save time and follow best practices", "AI backgrounds are unique and eye-catching", "Start with your content topic in mind"]
      },
      {
        step: 2,
        title: "Add and Style Text",
        action: "Click to add text overlays with customizable fonts, sizes, colors, and effects",
        details: "Use bold, readable fonts. Apply effects like shadows, outlines, gradients. Position text for maximum readability",
        tips: ["Keep text large and readable on mobile", "Use contrasting colors", "Limit to 4-6 words max", "Test readability at small sizes"]
      },
      {
        step: 3,
        title: "Apply Effects and Filters",
        action: "Enhance with filters, adjust brightness/contrast, add graphic elements",
        details: "Subtle effects can improve visual appeal without being distracting. Maintain focus on main subject",
        tips: ["Don't over-edit", "Keep focus on main subject", "Use effects to enhance, not distract", "Preview at different sizes"]
      },
      {
        step: 4,
        title: "Preview and Export",
        action: "Preview at different sizes, then export in optimal format (1920x1080 recommended)",
        details: "Check how thumbnail looks as small preview. Export in high quality for best results across platforms",
        tips: ["Test visibility at small sizes", "Export at 1920x1080 for YouTube", "Keep file size under 2MB", "Save project for future edits"]
      }
    ],
    commonQuestions: [
      {
        question: "How do I create an eye-catching YouTube thumbnail?",
        answer: "1. Go to Thumbnails tab 2. Choose a template or AI-generated background related to your content 3. Add bold, readable text (4-6 words max) 4. Use contrasting colors and large text 5. Preview at small size to ensure readability 6. Export at 1920x1080 resolution. Focus on emotions and curiosity to drive clicks.",
        relatedActions: ["navigate:thumbnailMaker"]
      },
      {
        question: "What makes a good thumbnail?",
        answer: "Good thumbnails have: 1) Bold, readable text (visible even when small) 2) High contrast colors 3) Clear focal point 4) Emotional expression or intrigue 5) Consistent branding 6) Text that complements the video title. Avoid cluttered designs and tiny text.",
        relatedActions: ["navigate:thumbnailMaker"]
      },
      {
        question: "Can I generate custom backgrounds with AI?",
        answer: "Yes! Describe the scene you want and our AI will generate a unique background. For example: 'modern office setup', 'cozy coffee shop', or 'futuristic cityscape'. This creates original, eye-catching backgrounds that stand out.",
        relatedActions: ["navigate:thumbnailMaker"]
      },
      {
        question: "What size should YouTube thumbnails be?",
        answer: "YouTube recommends 1920x1080 pixels (16:9 aspect ratio) with file size under 2MB. This ensures your thumbnail looks crisp on all devices and loads quickly. Our tool exports at optimal dimensions automatically.",
        relatedActions: ["navigate:thumbnailMaker"]
      }
    ],
    troubleshooting: [
      {
        issue: "Text not readable at small sizes",
        solution: "Increase font size, use bolder fonts, add text outlines or shadows, choose higher contrast colors. Preview thumbnail at small size to test readability.",
        prevention: "Always preview thumbnails at actual YouTube display size before finalizing"
      },
      {
        issue: "AI background generation failed",
        solution: "Try simpler descriptions, check internet connection, or use template backgrounds. Premium users get priority AI generation and more attempts.",
        prevention: "Use clear, descriptive prompts for AI background generation"
      }
    ],
    integrations: ["Generator (create matching titles)", "Canvas (for complex layouts)", "Strategy (align with brand guidelines)", "Export to video platforms"],
    premiumFeatures: ["Unlimited AI background generation", "Advanced templates", "Brand kit integration", "A/B testing tools", "Batch thumbnail creation"]
  },
  {
    name: "Strategy",
    id: "strategy",
    description: "Comprehensive content strategy generator that creates detailed strategic plans including content pillars, posting schedules, SEO strategy, and competitive analysis.",
    mainComponents: ["Strategy Configuration", "Content Pillars Generator", "Posting Schedule Creator", "SEO Strategy Builder", "Competitive Analysis", "Export Tools"],
    workflows: [
      {
        step: 1,
        title: "Define Strategy Parameters",
        action: "Enter niche, target audience, goals, platforms, timeframe, and budget level",
        details: "Be specific about your niche and audience. Goals should be measurable (subscribers, revenue, engagement). Timeframe affects strategy depth",
        tips: ["Specific niches get better strategies", "Multiple platforms need different approaches", "Longer timeframes allow more comprehensive planning"]
      },
      {
        step: 2,
        title: "Generate Content Strategy",
        action: "AI creates comprehensive strategy with content pillars, themes, and scheduling recommendations",
        details: "Strategy includes 3 content pillars, posting schedules, SEO keywords, CTA strategies, and budget recommendations tailored to your inputs",
        tips: ["Review content pillars for balance", "Adjust posting frequency to your capacity", "Note recommended tools and investments"]
      },
      {
        step: 3,
        title: "Review Content Pillars",
        action: "Examine the 3 content pillars and how they work together strategically",
        details: "Pillars represent different content types that serve specific strategic functions (attract, engage, convert). Each has specific content ideas and posting frequency",
        tips: ["Pillars should complement each other", "Balance educational, entertaining, and promotional content", "Each pillar targets different audience needs"]
      },
      {
        step: 4,
        title: "Implement and Export",
        action: "Export strategy as PDF or send elements to Calendar for scheduling",
        details: "Full strategy can be exported for team sharing. Individual elements can be sent to other tools for implementation",
        tips: ["Export full strategy for reference", "Send schedule items to Calendar", "Use content ideas in Generator", "Review strategy monthly"]
      }
    ],
    commonQuestions: [
      {
        question: "How do I create a content strategy for my YouTube channel?",
        answer: "1. Go to Strategy tab 2. Enter your niche (e.g., 'tech reviews', 'fitness for beginners') 3. Define target audience specifically 4. Set goals (subscriber growth, revenue, etc.) 5. Choose platforms and timeframe 6. Generate comprehensive strategy with content pillars, posting schedule, and SEO recommendations 7. Export or implement using other tools",
        relatedActions: ["navigate:strategy"]
      },
      {
        question: "What are content pillars and why do I need them?",
        answer: "Content pillars are 3-4 main themes that structure your content strategy. They ensure variety and strategic purpose. For example: Educational (teach skills), Entertainment (engage audience), Behind-the-scenes (build connection). Each pillar serves different goals and keeps content balanced.",
        relatedActions: ["navigate:strategy"]
      },
      {
        question: "How often should I post content?",
        answer: "Our AI recommends posting frequency based on your capacity, audience, and goals. Generally: YouTube (1-3x/week), TikTok (daily), Instagram (4-7x/week). Consistency matters more than frequency. Start sustainable and increase gradually.",
        relatedActions: ["navigate:strategy"]
      },
      {
        question: "Can I create strategies for multiple platforms?",
        answer: "Yes! Select multiple platforms and the AI creates platform-specific recommendations. Each platform gets optimized content types, posting frequencies, and engagement strategies while maintaining overall brand consistency.",
        relatedActions: ["navigate:strategy"]
      }
    ],
    troubleshooting: [
      {
        issue: "Strategy seems too generic",
        solution: "Be more specific in your niche definition and target audience. Instead of 'fitness', try 'home workouts for busy moms'. More specificity generates more targeted strategies.",
        prevention: "Use detailed, specific descriptions for niche and audience"
      },
      {
        issue: "Posting schedule seems unrealistic",
        solution: "Adjust your capacity and timeframe inputs. Start with lower frequency and scale up. The AI adapts recommendations based on your available time and resources.",
        prevention: "Be realistic about time availability and start conservatively"
      }
    ],
    integrations: ["Calendar (import posting schedule)", "Generator (create planned content)", "Canvas (visualize strategy)", "Export to PDF/team sharing"],
    premiumFeatures: ["Advanced competitive analysis", "Multi-platform optimization", "Revenue strategy integration", "Team collaboration features", "Monthly strategy updates"]
  },
  {
    name: "Calendar",
    id: "calendar",
    description: "Content scheduling and planning tool that helps organize your content creation timeline with visual calendar interface and integration with strategy plans.",
    mainComponents: ["Monthly Calendar View", "Event Creation", "Content Planning", "Strategy Integration", "Export Options", "Reminder System"],
    workflows: [
      {
        step: 1,
        title: "View Content Calendar",
        action: "Navigate months to see your content schedule in calendar format",
        details: "Calendar shows content events, deadlines, and planning milestones. Different colors represent different content types",
        tips: ["Color coding helps identify content types", "Click on any date to add events", "Week view available for detailed planning"]
      },
      {
        step: 2,
        title: "Add Content Events",
        action: "Click on date to add new content events with details",
        details: "Events can include content type, platform, topic, status, and notes. Set reminders for creation deadlines",
        tips: ["Plan content creation before publish dates", "Include preparation time", "Set reminders for complex content"]
      },
      {
        step: 3,
        title: "Import from Strategy",
        action: "Import posting schedule and content plan from Strategy tool",
        details: "Strategy tool generates optimal posting schedules that can be automatically imported into Calendar for implementation",
        tips: ["Import strategy first for structured planning", "Adjust imported events as needed", "Strategy provides optimal timing"]
      },
      {
        step: 4,
        title: "Track and Manage",
        action: "Update event status, track completion, and adjust schedule as needed",
        details: "Mark events as planned, in-progress, or completed. Reschedule events by dragging to new dates",
        tips: ["Update status regularly", "Batch similar content creation", "Plan buffer time for complex content"]
      }
    ],
    commonQuestions: [
      {
        question: "How do I plan my content calendar?",
        answer: "1. Go to Calendar tab 2. Click on dates to add content events 3. Include content type, platform, topic, and deadlines 4. Import posting schedule from Strategy tool for optimal timing 5. Set reminders for content creation deadlines 6. Track progress by updating event status",
        relatedActions: ["navigate:calendar"]
      },
      {
        question: "Can I import my content strategy schedule?",
        answer: "Yes! After creating a strategy in the Strategy tool, you can import the recommended posting schedule directly into Calendar. This automatically populates your calendar with optimal posting times and content types.",
        relatedActions: ["navigate:calendar", "navigate:strategy"]
      },
      {
        question: "How do I track content creation progress?",
        answer: "Each calendar event has status options: Planned, In Progress, Completed. Update status as you work on content. This helps track deadlines and see what's coming up. Set reminders for complex content that needs advance preparation.",
        relatedActions: ["navigate:calendar"]
      },
      {
        question: "Can I export my calendar?",
        answer: "Yes! Export your content calendar to Google Calendar, Outlook, or other calendar apps. This keeps your content schedule synchronized with your personal calendar and enables reminders.",
        relatedActions: ["navigate:calendar"]
      }
    ],
    troubleshooting: [
      {
        issue: "Events not showing up",
        solution: "Check your date range and filters. Make sure you're viewing the correct month. Events are automatically saved and should persist across sessions.",
        prevention: "Events are automatically saved to browser storage and Firebase if logged in"
      },
      {
        issue: "Calendar feels overwhelming",
        solution: "Start with fewer events and build up gradually. Use color coding to identify different content types. Focus on one platform initially before expanding.",
        prevention: "Start small and scale up content planning gradually"
      }
    ],
    integrations: ["Strategy tool (import schedules)", "Generator (link to content creation)", "External calendars (Google, Outlook)", "Team collaboration"],
    premiumFeatures: ["Team calendar sharing", "Advanced reminders", "Bulk event management", "External calendar sync", "Analytics integration"]
  },
  {
    name: "Trends",
    id: "trends",
    description: "Advanced trend analysis and monitoring system that identifies viral opportunities, analyzes market movements, and provides actionable content recommendations based on real-time data.",
    mainComponents: ["Trend Analysis Engine", "Market Research Tools", "Opportunity Identifier", "Performance Tracking", "Content Recommendations", "Monitoring Dashboard"],
    workflows: [
      {
        step: 1,
        title: "Enter Research Query",
        action: "Input your niche, topic, or market area for trend analysis",
        details: "Can research broad niches like 'fitness' or specific topics like 'home workout equipment'. More specific queries give more targeted insights",
        tips: ["Start broad then narrow down", "Include your target audience", "Research competitor niches too"]
      },
      {
        step: 2,
        title: "Review Trend Cards",
        action: "Analyze generated trend cards showing status, strategic insights, and content opportunities",
        details: "Each trend card shows: Status (Growing/Emerging/Peak/Fading), Strategic Insight, Audience Alignment, Content Ideas, Keywords, Hashtags, Hook Angles",
        tips: ["Focus on Growing and Emerging trends", "Note audience alignment scores", "Save promising content ideas"]
      },
      {
        step: 3,
        title: "Identify Content Opportunities",
        action: "Use content ideas, keywords, and hook angles to create viral content",
        details: "Trend cards provide specific content suggestions, optimized keywords, trending hashtags, and hook angles that work for each trend",
        tips: ["Act quickly on emerging trends", "Adapt suggestions to your style", "Combine multiple trends creatively"]
      },
      {
        step: 4,
        title: "Create and Monitor",
        action: "Generate content using insights, then monitor trend performance over time",
        details: "Use Generator tool with trend insights to create content. Monitor how trends evolve and adjust strategy accordingly",
        tips: ["Create content while trends are growing", "Monitor competitor responses", "Track your content performance against trends"]
      }
    ],
    commonQuestions: [
      {
        question: "How do I find trending topics in my niche?",
        answer: "1. Go to Trends tab 2. Enter your niche or topic (e.g., 'sustainable fashion', 'gaming setup') 3. AI analyzes current trends with web search 4. Review trend cards showing growth status and opportunities 5. Use content ideas and keywords to create timely content in Generator tool",
        relatedActions: ["navigate:trends"]
      },
      {
        question: "What do the trend statuses mean?",
        answer: "Emerging ⚡ = Just starting, great potential; Growing Fast ↗️ = Gaining momentum, act quickly; At Peak 🔥 = Maximum attention, very competitive; Fading ↘️ = Declining interest, avoid unless unique angle. Focus on Emerging and Growing for best opportunities.",
        relatedActions: ["navigate:trends"]
      },
      {
        question: "How do I use trend insights to create content?",
        answer: "Each trend card provides: 1) Content Ideas - specific suggestions you can implement 2) Keywords - for SEO and discoverability 3) Hashtags - for social media reach 4) Hook Angles - attention-grabbing opening strategies. Copy these into Generator tool for content creation.",
        relatedActions: ["navigate:trends", "navigate:generator"]
      },
      {
        question: "How often should I research trends?",
        answer: "Weekly for general awareness, daily for fast-moving niches like tech or news. Trends change rapidly, especially on social media. Set up regular trend monitoring to catch opportunities early and adjust content strategy accordingly.",
        relatedActions: ["navigate:trends"]
      }
    ],
    troubleshooting: [
      {
        issue: "No trends found for my niche",
        solution: "Try broader search terms, check spelling, or research related niches. Some very specific niches may have limited trend data. Expand search to adjacent topics.",
        prevention: "Start with broader terms and narrow down based on results"
      },
      {
        issue: "Trends seem outdated",
        solution: "Trend analysis uses real-time web search. If results seem old, try more specific or current terms. Some trends have longer lifecycles than others.",
        prevention: "Use current terminology and check multiple trend angles"
      }
    ],
    integrations: ["Generator (create trend-based content)", "Strategy (incorporate into planning)", "Calendar (schedule trending content)", "Web Search (additional research)"],
    premiumFeatures: ["Real-time trend monitoring", "Competitor trend tracking", "Historical trend analysis", "Custom trend alerts", "Advanced filtering options"]
  },
  {
    name: "History",
    id: "history",
    description: "Comprehensive content history and management system that stores, organizes, and enables reuse of all previously generated content with advanced search and filtering capabilities.",
    mainComponents: ["Content Library", "Search and Filter System", "Favorites Management", "Export Tools", "Content Analytics", "Reuse Interface"],
    workflows: [
      {
        step: 1,
        title: "Browse Content History",
        action: "View all previously generated content organized by date, type, or platform",
        details: "History shows all content created across all tools with thumbnails, generation details, and performance data if available",
        tips: ["Use filters to find specific content types", "Sort by date to see recent work", "Star favorites for quick access"]
      },
      {
        step: 2,
        title: "Search and Filter",
        action: "Use search bar and filters to find specific content or themes",
        details: "Search by keywords, content type, platform, or date range. Advanced filters help narrow down large content libraries",
        tips: ["Search by topic keywords", "Filter by platform for consistency", "Use date ranges for projects"]
      },
      {
        step: 3,
        title: "Reuse and Refine",
        action: "Select content to edit, refine, or use as inspiration for new content",
        details: "Previously generated content can be refined, repurposed for different platforms, or used as starting points for new content",
        tips: ["Refine successful content for new platforms", "Use popular content as templates", "Build on proven themes"]
      },
      {
        step: 4,
        title: "Organize and Export",
        action: "Organize content into favorites and export collections for projects or teams",
        details: "Mark best content as favorites, create collections for projects, and export content libraries for backup or sharing",
        tips: ["Star your best performing content", "Export for portfolio or team sharing", "Regular cleanup keeps library organized"]
      }
    ],
    commonQuestions: [
      {
        question: "How do I find my previous content?",
        answer: "1. Go to History tab 2. Browse by date or use search/filter options 3. Search by keywords, content type, or platform 4. Use favorites to quickly access your best content 5. Click on any item to view full details and reuse options",
        relatedActions: ["navigate:history"]
      },
      {
        question: "Can I reuse and modify old content?",
        answer: "Yes! Click on any historical content to view it, then use 'Refine' or 'Edit' options to modify. You can make content shorter/longer, change tone, adapt for different platforms, or use as inspiration for new content.",
        relatedActions: ["navigate:history"]
      },
      {
        question: "How do I organize my content library?",
        answer: "Use the favorites system to mark your best content. Search and filter by content type, platform, or date range. For large libraries, create naming conventions and use consistent keywords in your original prompts for easier searching later.",
        relatedActions: ["navigate:history"]
      },
      {
        question: "Can I export my content history?",
        answer: "Yes! Export individual items or entire collections as PDF, CSV, or other formats. This is useful for portfolios, team sharing, or backup purposes. Premium users get additional export options and bulk operations.",
        relatedActions: ["navigate:history"]
      }
    ],
    troubleshooting: [
      {
        issue: "Content not appearing in history",
        solution: "Make sure you're logged in when generating content. Anonymous generations may not be saved. Check filters and date ranges. Content should appear immediately after generation.",
        prevention: "Sign in before generating content to ensure it's saved to your permanent history"
      },
      {
        issue: "History getting cluttered",
        solution: "Use favorites to mark important content. Delete or archive content you no longer need. Use consistent keywords and descriptions for better organization.",
        prevention: "Regular maintenance and consistent tagging keeps history organized"
      }
    ],
    integrations: ["All generation tools (automatic saving)", "Export to external systems", "Search across all content types", "Performance tracking"],
    premiumFeatures: ["Unlimited history storage", "Advanced analytics", "Bulk operations", "Team sharing", "Advanced search filters"]
  },
  {
    name: "Web Search",
    id: "search",
    description: "AI-enhanced web search and research tool that performs intelligent searches, categorizes results, and provides research insights for content creation and market analysis.",
    mainComponents: ["Enhanced Search Engine", "Result Categorization", "Source Analysis", "Content Extraction", "Research Tools", "Export Options"],
    workflows: [
      {
        step: 1,
        title: "Perform Enhanced Search",
        action: "Enter search query and let AI perform intelligent web research",
        details: "AI enhances your search with related terms, finds diverse sources, and categorizes results by type (news, discussions, videos, etc.)",
        tips: ["Use specific queries for better results", "Include your niche for targeted research", "Search competitors or industry terms"]
      },
      {
        step: 2,
        title: "Review Categorized Results",
        action: "Browse results organized by source type: news, discussions, topics, videos",
        details: "Results are automatically categorized and scored for relevance. Each result includes source credibility and content type indicators",
        tips: ["Check multiple source types", "Look for recent discussions and trends", "Note credible sources for citing"]
      },
      {
        step: 3,
        title: "Extract Research Insights",
        action: "Use AI analysis to extract key insights and content opportunities from search results",
        details: "AI analyzes search results to identify common themes, trending topics, content gaps, and audience questions you can address",
        tips: ["Look for common questions in discussions", "Note trending subtopics", "Identify content gaps to fill"]
      },
      {
        step: 4,
        title: "Apply Research to Content",
        action: "Use research insights to inform content creation in other tools",
        details: "Export research findings or use insights directly in Generator, Strategy, or Trends tools for informed content creation",
        tips: ["Save valuable research for later reference", "Use findings to validate trend analysis", "Apply insights across multiple content pieces"]
      }
    ],
    commonQuestions: [
      {
        question: "How is this different from regular Google search?",
        answer: "Our Web Search uses AI to enhance queries, categorize results by source type, analyze content quality, and extract actionable insights for content creation. It focuses on finding content opportunities and research that directly applies to your content strategy.",
        relatedActions: ["navigate:search"]
      },
      {
        question: "What types of sources does it search?",
        answer: "The search covers news articles, forum discussions, video platforms, topic-specific sites, and social media mentions. Results are categorized so you can focus on the most relevant source types for your research needs.",
        relatedActions: ["navigate:search"]
      },
      {
        question: "How do I use search results for content creation?",
        answer: "Look for: 1) Common questions people ask (great for educational content) 2) Trending subtopics within your niche 3) Content gaps where limited information exists 4) Discussion points that generate engagement 5) Recent news or developments to comment on",
        relatedActions: ["navigate:search", "navigate:generator"]
      },
      {
        question: "Can I export research findings?",
        answer: "Yes! Export search results and AI analysis as PDF or CSV for later reference. This is useful for building research libraries, supporting content claims, or sharing findings with team members.",
        relatedActions: ["navigate:search"]
      }
    ],
    troubleshooting: [
      {
        issue: "Search returning irrelevant results",
        solution: "Use more specific search terms, include your niche context, or add qualifiers like 'best practices', 'how to', or year/time specifications.",
        prevention: "Use specific, contextual search terms related to your content goals"
      },
      {
        issue: "Not finding current information",
        solution: "Add current year or time indicators to your search. Focus on news and discussion categories for the most recent information.",
        prevention: "Include temporal context in searches for current information"
      }
    ],
    integrations: ["Generator (inform content creation)", "Trends (validate trend research)", "Strategy (market research)", "Export for reference"],
    premiumFeatures: ["Advanced source filtering", "Automated research reports", "Competitive intelligence", "Research monitoring", "Bulk search operations"]
  }
];

// Additional utility functions for AI Assistant
export const getFeatureByTab = (tabId: string): AppFeature | undefined => {
  return CREATE_GEN_STUDIO_KNOWLEDGE.find(feature => feature.id === tabId);
};

export const searchKnowledge = (query: string): AppFeature[] => {
  const lowerQuery = query.toLowerCase();
  return CREATE_GEN_STUDIO_KNOWLEDGE.filter(feature => 
    feature.name.toLowerCase().includes(lowerQuery) ||
    feature.description.toLowerCase().includes(lowerQuery) ||
    feature.commonQuestions.some(q => 
      q.question.toLowerCase().includes(lowerQuery) ||
      q.answer.toLowerCase().includes(lowerQuery)
    )
  );
};

export const getWorkflowSteps = (featureId: string): WorkflowStep[] => {
  const feature = getFeatureByTab(featureId);
  return feature?.workflows || [];
};

export const findAnswerToQuestion = (question: string): QuestionAnswer | undefined => {
  const lowerQuestion = question.toLowerCase();
  
  for (const feature of CREATE_GEN_STUDIO_KNOWLEDGE) {
    const matchingQA = feature.commonQuestions.find(qa =>
      qa.question.toLowerCase().includes(lowerQuestion) ||
      lowerQuestion.includes(qa.question.toLowerCase()) ||
      // Check for keyword matches
      qa.question.toLowerCase().split(' ').some(word => 
        word.length > 3 && lowerQuestion.includes(word)
      )
    );
    
    if (matchingQA) {
      return {
        ...matchingQA,
        answer: `${matchingQA.answer}\n\n*This feature is part of ${feature.name}.*`
      };
    }
  }
  
  return undefined;
};
