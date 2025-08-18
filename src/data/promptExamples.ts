export interface PromptExample {
  id: string;
  title: string;
  prompt: string;
  category: string;
  platform?: string;
  contentType?: string;
  icon: string; // Now using Lucide icon names
}

export const promptExamples: PromptExample[] = [
  // YouTube Content
  {
    id: 'yt-money-1',
    title: 'Making Money Online',
    prompt: 'I want to make a video about making money online',
    category: 'YouTube',
    platform: 'youtube',
    contentType: 'tutorial',
    icon: 'DollarSign'
  },
  {
    id: 'yt-fitness-1',
    title: 'Fitness Tips',
    prompt: 'I want to create a workout routine video for beginners',
    category: 'YouTube',
    platform: 'youtube',
    contentType: 'tutorial',
    icon: 'Dumbbell'
  },
  {
    id: 'yt-cooking-1',
    title: 'Quick Recipes',
    prompt: 'I want to show how to make a 15-minute healthy meal',
    category: 'YouTube',
    platform: 'youtube',
    contentType: 'tutorial',
    icon: 'ChefHat'
  },
  {
    id: 'yt-tech-1',
    title: 'Tech Review',
    prompt: 'I want to review the latest smartphone features',
    category: 'YouTube',
    platform: 'youtube',
    contentType: 'review',
    icon: 'Smartphone'
  },

  // Instagram Content
  {
    id: 'ig-lifestyle-1',
    title: 'Daily Routine',
    prompt: 'I want to share my morning routine for productivity',
    category: 'Instagram',
    platform: 'instagram',
    contentType: 'lifestyle',
    icon: 'Coffee'
  },
  {
    id: 'ig-fashion-1',
    title: 'Outfit Ideas',
    prompt: 'I want to showcase affordable fashion outfits',
    category: 'Instagram',
    platform: 'instagram',
    contentType: 'fashion',
    icon: 'Shirt'
  },
  {
    id: 'ig-travel-1',
    title: 'Travel Tips',
    prompt: 'I want to share budget travel tips for students',
    category: 'Instagram',
    platform: 'instagram',
    contentType: 'travel',
    icon: 'MapPin'
  },
  {
    id: 'ig-business-1',
    title: 'Business Tips',
    prompt: 'I want to share small business growth strategies',
    category: 'Instagram',
    platform: 'instagram',
    contentType: 'business',
    icon: 'TrendingUp'
  },

  // TikTok Content
  {
    id: 'tt-hack-1',
    title: 'Life Hacks',
    prompt: 'I want to show a useful life hack for organizing',
    category: 'TikTok',
    platform: 'tiktok',
    contentType: 'hack',
    icon: 'Lightbulb'
  },
  {
    id: 'tt-skill-1',
    title: 'Quick Skills',
    prompt: 'I want to teach a skill in 60 seconds',
    category: 'TikTok',
    platform: 'tiktok',
    contentType: 'educational',
    icon: 'Target'
  },
  {
    id: 'tt-motivation-1',
    title: 'Daily Motivation',
    prompt: 'I want to create motivational content for entrepreneurs',
    category: 'TikTok',
    platform: 'tiktok',
    contentType: 'motivation',
    icon: 'Zap'
  },

  // Twitter/X Content
  {
    id: 'tw-thread-1',
    title: 'Knowledge Thread',
    prompt: 'I want to share what I learned this week in a thread',
    category: 'Twitter',
    platform: 'twitter',
    contentType: 'thread',
    icon: 'MessageSquare'
  },
  {
    id: 'tw-opinion-1',
    title: 'Industry Opinion',
    prompt: 'I want to share my thoughts on current industry trends',
    category: 'Twitter',
    platform: 'twitter',
    contentType: 'opinion',
    icon: 'MessageCircle'
  },
  {
    id: 'tw-tip-1',
    title: 'Quick Tip',
    prompt: 'I want to share a productivity tip for remote workers',
    category: 'Twitter',
    platform: 'twitter',
    contentType: 'tip',
    icon: 'Lightbulb'
  },

  // LinkedIn Content
  {
    id: 'li-career-1',
    title: 'Career Advice',
    prompt: 'I want to share career advice for recent graduates',
    category: 'LinkedIn',
    platform: 'linkedin',
    contentType: 'advice',
    icon: 'BriefcaseBusiness'
  },
  {
    id: 'li-success-1',
    title: 'Success Story',
    prompt: 'I want to share how I overcame a professional challenge',
    category: 'LinkedIn',
    platform: 'linkedin',
    contentType: 'story',
    icon: 'Trophy'
  },
  {
    id: 'li-network-1',
    title: 'Networking Tips',
    prompt: 'I want to share effective networking strategies',
    category: 'LinkedIn',
    platform: 'linkedin',
    contentType: 'networking',
    icon: 'Users'
  },

  // Blog Content
  {
    id: 'blog-guide-1',
    title: 'How-To Guide',
    prompt: 'I want to write a guide on starting a side business',
    category: 'Blog',
    platform: 'blog',
    contentType: 'guide',
    icon: 'BookOpen'
  },
  {
    id: 'blog-list-1',
    title: 'Top Tools List',
    prompt: 'I want to list the best tools for content creators',
    category: 'Blog',
    platform: 'blog',
    contentType: 'list',
    icon: 'ListChecks'
  },
  {
    id: 'blog-review-1',
    title: 'Product Review',
    prompt: 'I want to review a software tool I use daily',
    category: 'Blog',
    platform: 'blog',
    contentType: 'review',
    icon: 'Star'
  },

  // Email Marketing
  {
    id: 'email-welcome-1',
    title: 'Welcome Email',
    prompt: 'I want to write a welcome email for new subscribers',
    category: 'Email',
    platform: 'email',
    contentType: 'welcome',
    icon: 'Mail'
  },
  {
    id: 'email-tips-1',
    title: 'Weekly Tips',
    prompt: 'I want to share weekly tips in my newsletter',
    category: 'Email',
    platform: 'email',
    contentType: 'newsletter',
    icon: 'Send'
  },

  // Universal/Cross-Platform
  {
    id: 'universal-story-1',
    title: 'Personal Story',
    prompt: 'I want to share a personal story that inspires others',
    category: 'Universal',
    contentType: 'story',
    icon: 'Heart'
  },
  {
    id: 'universal-announcement-1',
    title: 'Product Launch',
    prompt: 'I want to announce my new product launch',
    category: 'Universal',
    contentType: 'announcement',
    icon: 'Rocket'
  },
  {
    id: 'universal-behind-1',
    title: 'Behind the Scenes',
    prompt: 'I want to show behind the scenes of my work process',
    category: 'Universal',
    contentType: 'behind-scenes',
    icon: 'Eye'
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

// Guided prompt templates for Phase 2
export interface GuidedTemplate {
  id: string;
  name: string;
  template: string;
  fields: Array<{
    key: string;
    label: string;
    placeholder: string;
    options?: string[];
  }>;
  icon: string;
}

export const guidedTemplates: GuidedTemplate[] = [
  {
    id: 'basic-video',
    name: 'Basic Video Content',
    template: 'I want to make a {contentType} about {topic} for {platform} that will make {audience} feel {emotion}',
    fields: [
      {
        key: 'contentType',
        label: 'Content Type',
        placeholder: 'video, tutorial, review',
        options: ['video', 'tutorial', 'review', 'story', 'guide', 'tips']
      },
      {
        key: 'topic',
        label: 'Topic',
        placeholder: 'making money online, fitness tips, cooking'
      },
      {
        key: 'platform',
        label: 'Platform',
        placeholder: 'YouTube, Instagram, TikTok',
        options: ['YouTube', 'Instagram', 'TikTok', 'Twitter', 'LinkedIn']
      },
      {
        key: 'audience',
        label: 'Target Audience',
        placeholder: 'beginners, entrepreneurs, students'
      },
      {
        key: 'emotion',
        label: 'Desired Emotion',
        placeholder: 'inspired, educated, entertained',
        options: ['inspired', 'educated', 'entertained', 'motivated', 'informed', 'excited']
      }
    ],
    icon: 'Video'
  },
  {
    id: 'social-post',
    name: 'Social Media Post',
    template: 'I want to create a {postType} for {platform} about {topic} that {action} and targets {audience}',
    fields: [
      {
        key: 'postType',
        label: 'Post Type',
        placeholder: 'post, story, reel',
        options: ['post', 'story', 'reel', 'carousel', 'thread']
      },
      {
        key: 'platform',
        label: 'Platform',
        placeholder: 'Instagram, TikTok, Twitter',
        options: ['Instagram', 'TikTok', 'Twitter', 'LinkedIn', 'Facebook']
      },
      {
        key: 'topic',
        label: 'Topic',
        placeholder: 'productivity tips, daily routine'
      },
      {
        key: 'action',
        label: 'Goal',
        placeholder: 'drives engagement, educates, entertains',
        options: ['drives engagement', 'educates followers', 'entertains audience', 'builds community', 'generates leads']
      },
      {
        key: 'audience',
        label: 'Target Audience',
        placeholder: 'entrepreneurs, fitness enthusiasts'
      }
    ],
    icon: 'Hash'
  },
  {
    id: 'educational',
    name: 'Educational Content',
    template: 'I want to teach {audience} how to {skill} using {method} in a {format} that takes {duration}',
    fields: [
      {
        key: 'audience',
        label: 'Target Audience',
        placeholder: 'beginners, professionals, students'
      },
      {
        key: 'skill',
        label: 'Skill/Topic',
        placeholder: 'start a business, cook healthy meals'
      },
      {
        key: 'method',
        label: 'Teaching Method',
        placeholder: 'step-by-step guide, practical examples',
        options: ['step-by-step guide', 'practical examples', 'case studies', 'hands-on tutorial', 'visual demonstration']
      },
      {
        key: 'format',
        label: 'Content Format',
        placeholder: 'video, blog post, course',
        options: ['video', 'blog post', 'course', 'infographic', 'podcast', 'webinar']
      },
      {
        key: 'duration',
        label: 'Duration/Length',
        placeholder: '10 minutes, 5 steps, 1 week'
      }
    ],
    icon: 'GraduationCap'
  }
];
