export interface PromptExample {
  id: string;
  title: string;
  prompt: string;
  category: string;
  platform?: string;
  contentType?: string;
  icon?: string;
}

export const promptExamples: PromptExample[] = [
  // YouTube Content
  {
    id: 'yt-hook-1',
    title: 'YouTube Hook',
    prompt: 'Create a compelling hook for a YouTube video about productivity tips that grabs attention in the first 5 seconds and makes viewers want to watch until the end',
    category: 'YouTube',
    platform: 'youtube',
    contentType: 'hook',
    icon: '🎬'
  },
  {
    id: 'yt-tutorial-1',
    title: 'Tutorial Script',
    prompt: 'Write a step-by-step tutorial script for a 10-minute YouTube video teaching beginners how to start their first online business',
    category: 'YouTube',
    platform: 'youtube',
    contentType: 'script',
    icon: '📚'
  },
  {
    id: 'yt-story-1',
    title: 'Story Opener',
    prompt: 'Create an engaging personal story opener for a YouTube video about overcoming challenges that connects with viewers emotionally',
    category: 'YouTube',
    platform: 'youtube',
    contentType: 'story',
    icon: '✨'
  },

  // Instagram Content
  {
    id: 'ig-caption-1',
    title: 'Instagram Caption',
    prompt: 'Write an engaging Instagram caption for a fitness transformation post that inspires followers and includes relevant hashtags',
    category: 'Instagram',
    platform: 'instagram',
    contentType: 'caption',
    icon: '📸'
  },
  {
    id: 'ig-reel-1',
    title: 'Reel Script',
    prompt: 'Create a 30-second Instagram Reel script about quick cooking hacks that\'s entertaining and informative',
    category: 'Instagram',
    platform: 'instagram',
    contentType: 'reel',
    icon: '🎵'
  },
  {
    id: 'ig-story-1',
    title: 'Story Series',
    prompt: 'Plan a 5-slide Instagram Story series about daily wellness routines that encourages audience interaction',
    category: 'Instagram',
    platform: 'instagram',
    contentType: 'story',
    icon: '📱'
  },

  // TikTok Content
  {
    id: 'tt-trend-1',
    title: 'TikTok Trend',
    prompt: 'Create a TikTok video concept that uses current trending sounds to showcase DIY home organization tips',
    category: 'TikTok',
    platform: 'tiktok',
    contentType: 'trend',
    icon: '🎭'
  },
  {
    id: 'tt-edu-1',
    title: 'Educational TikTok',
    prompt: 'Write a script for an educational TikTok explaining a complex topic in simple terms that goes viral',
    category: 'TikTok',
    platform: 'tiktok',
    contentType: 'educational',
    icon: '🧠'
  },

  // Twitter/X Content
  {
    id: 'tw-thread-1',
    title: 'Twitter Thread',
    prompt: 'Create a viral Twitter thread about entrepreneurship lessons learned that provides real value and encourages retweets',
    category: 'Twitter',
    platform: 'twitter',
    contentType: 'thread',
    icon: '🧵'
  },
  {
    id: 'tw-engage-1',
    title: 'Engagement Tweet',
    prompt: 'Write a thought-provoking tweet about work-life balance that sparks meaningful conversations and gets high engagement',
    category: 'Twitter',
    platform: 'twitter',
    contentType: 'engagement',
    icon: '💭'
  },

  // LinkedIn Content
  {
    id: 'li-post-1',
    title: 'LinkedIn Post',
    prompt: 'Create a professional LinkedIn post about career growth insights that positions you as a thought leader in your industry',
    category: 'LinkedIn',
    platform: 'linkedin',
    contentType: 'post',
    icon: '💼'
  },
  {
    id: 'li-story-1',
    title: 'Success Story',
    prompt: 'Write a LinkedIn success story post about overcoming professional challenges that inspires others and builds personal brand',
    category: 'LinkedIn',
    platform: 'linkedin',
    contentType: 'story',
    icon: '🏆'
  },

  // Blog Content
  {
    id: 'blog-intro-1',
    title: 'Blog Introduction',
    prompt: 'Write a compelling blog post introduction about sustainable living tips that hooks readers and keeps them scrolling',
    category: 'Blog',
    platform: 'blog',
    contentType: 'introduction',
    icon: '📝'
  },
  {
    id: 'blog-list-1',
    title: 'Listicle Post',
    prompt: 'Create a "Top 10" listicle about productivity tools for remote workers that\'s comprehensive and shareable',
    category: 'Blog',
    platform: 'blog',
    contentType: 'listicle',
    icon: '📋'
  },

  // Email Marketing
  {
    id: 'email-subject-1',
    title: 'Email Subject Line',
    prompt: 'Write compelling email subject lines for a newsletter about tech news that achieve high open rates',
    category: 'Email',
    platform: 'email',
    contentType: 'subject',
    icon: '📧'
  },
  {
    id: 'email-welcome-1',
    title: 'Welcome Email',
    prompt: 'Create a warm welcome email for new subscribers that introduces your brand and sets expectations',
    category: 'Email',
    platform: 'email',
    contentType: 'welcome',
    icon: '👋'
  },

  // General & Cross-Platform
  {
    id: 'viral-hook-1',
    title: 'Viral Hook',
    prompt: 'Create a universal hook that can work across all social platforms about personal development that stops the scroll',
    category: 'Universal',
    contentType: 'hook',
    icon: '🔥'
  },
  {
    id: 'cta-1',
    title: 'Call-to-Action',
    prompt: 'Write compelling call-to-action copy for a digital product launch that converts browsers into buyers',
    category: 'Universal',
    contentType: 'cta',
    icon: '🎯'
  },
  {
    id: 'brand-voice-1',
    title: 'Brand Voice',
    prompt: 'Develop a consistent brand voice for a tech startup that sounds approachable yet professional across all content',
    category: 'Universal',
    contentType: 'brand',
    icon: '🎨'
  },
  {
    id: 'trend-analysis-1',
    title: 'Trend Analysis',
    prompt: 'Analyze current social media trends and create content that taps into what\'s popular right now',
    category: 'Universal',
    contentType: 'trend',
    icon: '📈'
  }
];

export const promptCategories = [
  'All',
  'YouTube',
  'Instagram', 
  'TikTok',
  'Twitter',
  'LinkedIn',
  'Blog',
  'Email',
  'Universal'
];

// Helper function to get examples by category
export const getExamplesByCategory = (category: string): PromptExample[] => {
  if (category === 'All') return promptExamples;
  return promptExamples.filter(example => example.category === category);
};

// Helper function to get random examples
export const getRandomExamples = (count: number = 5): PromptExample[] => {
  const shuffled = [...promptExamples].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
