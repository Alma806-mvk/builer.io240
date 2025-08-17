import { NewProjectData } from '../components/NewProjectModal';

export interface NicheTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'gaming' | 'tech' | 'lifestyle' | 'business' | 'education' | 'fitness' | 'travel' | 'food';
  color: string;
  estimatedSetupTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  popular?: boolean;
  blueprint: {
    contentStrategy: {
      videoTypes: string[];
      postingSchedule: string;
      growthGoals: string;
      monetization: string[];
    };
    contentCalendar: {
      weeklyStructure: Record<string, string>;
      monthlyThemes: string[];
    };
    brandAssets: {
      colorPalette: string[];
      thumbnailStyles: string[];
      designElements: string[];
    };
    analyticsSetup: {
      kpis: string[];
      competitorList: string[];
    };
    automationWorkflows: string[];
    preBuiltProjects: Partial<NewProjectData>[];
  };
}

export const nicheTemplates: NicheTemplate[] = [
  {
    id: 'gaming-channel',
    name: 'Gaming Channel Template',
    description: 'Complete gaming channel setup with content strategy, streaming workflows, and community building',
    icon: '🎮',
    category: 'gaming',
    color: 'from-purple-500 to-pink-500',
    estimatedSetupTime: '2-3 hours',
    difficulty: 'intermediate',
    popular: true,
    blueprint: {
      contentStrategy: {
        videoTypes: ['Let\'s Plays', 'Game Reviews', 'Tutorials & Tips', 'Live Streams', 'Gaming News'],
        postingSchedule: '3 videos/week + 2 streams',
        growthGoals: '10K subscribers in 6 months',
        monetization: ['Sponsorships', 'Donations', 'Merchandise', 'Affiliate Marketing']
      },
      contentCalendar: {
        weeklyStructure: {
          'Monday': 'Game Reviews',
          'Wednesday': 'Tutorial/Tips',
          'Friday': 'Let\'s Play Series',
          'Saturday': 'Live Stream',
          'Sunday': 'Community Stream'
        },
        monthlyThemes: ['New Game Releases', 'Indie Game Spotlight', 'Retro Gaming', 'Competitive Analysis']
      },
      brandAssets: {
        colorPalette: ['#8B5CF6', '#EC4899', '#06B6D4', '#10B981'],
        thumbnailStyles: ['Action shots', 'Reaction faces', 'Game UI overlays', 'Character focus'],
        designElements: ['Gaming controllers', 'Pixel art', 'Neon effects', 'Stream overlays']
      },
      analyticsSetup: {
        kpis: ['Watch time', 'Subscriber growth', 'Stream viewer count', 'Engagement rate', 'Revenue per viewer'],
        competitorList: ['PewDiePie', 'Markiplier', 'Ninja', 'Pokimane', 'Shroud']
      },
      automationWorkflows: [
        'Auto-generate gaming content ideas',
        'Stream highlight clips creation',
        'Community post scheduling',
        'Cross-platform content distribution'
      ],
      preBuiltProjects: [
        {
          title: 'Weekly Game Review',
          type: 'video',
          platform: 'YouTube',
          priority: 'medium',
          tags: ['Gaming', 'Review', 'Weekly'],
          estimatedHours: 6,
          description: 'In-depth review of latest game releases with gameplay footage and analysis'
        },
        {
          title: 'Stream Highlights Compilation',
          type: 'video',
          platform: 'YouTube',
          priority: 'low',
          tags: ['Highlights', 'Compilation', 'Stream'],
          estimatedHours: 3,
          description: 'Best moments from week\'s live streams edited into entertaining compilation'
        },
        {
          title: 'Gaming Thumbnails Pack',
          type: 'thumbnail',
          platform: 'YouTube',
          priority: 'high',
          tags: ['Gaming', 'Thumbnails', 'Pack'],
          estimatedHours: 4,
          description: 'Create 10 gaming-themed thumbnails with consistent branding'
        }
      ]
    }
  },
  {
    id: 'tech-review-channel',
    name: 'Tech Review Channel',
    description: 'Professional tech channel with product reviews, unboxings, and industry analysis',
    icon: '💻',
    category: 'tech',
    color: 'from-blue-500 to-cyan-500',
    estimatedSetupTime: '2-4 hours',
    difficulty: 'intermediate',
    popular: true,
    blueprint: {
      contentStrategy: {
        videoTypes: ['Unboxings', 'Product Reviews', 'Comparisons', 'Tech News', 'Buying Guides'],
        postingSchedule: '2 videos/week + weekly podcast',
        growthGoals: '50K subscribers in 8 months',
        monetization: ['Affiliate links', 'Sponsorships', 'Product partnerships', 'Premium content']
      },
      contentCalendar: {
        weeklyStructure: {
          'Monday': 'Tech News Roundup',
          'Thursday': 'Product Review',
          'Saturday': 'Comparison/Buying Guide',
          'Sunday': 'Tech Podcast'
        },
        monthlyThemes: ['CES Coverage', 'Back to School Tech', 'Holiday Gift Guides', 'Year-end Awards']
      },
      brandAssets: {
        colorPalette: ['#3B82F6', '#06B6D4', '#64748B', '#F8FAFC'],
        thumbnailStyles: ['Clean product shots', 'Before/after comparisons', 'Feature highlights', 'Rating overlays'],
        designElements: ['Minimal backgrounds', 'Product photography', 'Technical diagrams', 'Rating systems']
      },
      analyticsSetup: {
        kpis: ['Click-through rate', 'Affiliate conversion', 'Average view duration', 'Subscriber quality', 'Revenue per video'],
        competitorList: ['MKBHD', 'Unbox Therapy', 'Austin Evans', 'Dave2D', 'iJustine']
      },
      automationWorkflows: [
        'Product launch calendar integration',
        'Affiliate link management',
        'Review checklist automation',
        'Multi-platform publishing'
      ],
      preBuiltProjects: [
        {
          title: 'Smartphone Comparison Review',
          type: 'video',
          platform: 'YouTube',
          priority: 'high',
          tags: ['Tech', 'Review', 'Smartphone'],
          estimatedHours: 10,
          description: 'Comprehensive comparison of latest flagship smartphones with testing and analysis'
        },
        {
          title: 'Tech Product Unboxing',
          type: 'video',
          platform: 'YouTube',
          priority: 'medium',
          tags: ['Unboxing', 'Tech', 'First Look'],
          estimatedHours: 4,
          description: 'Professional unboxing with first impressions and initial setup'
        }
      ]
    }
  },
  {
    id: 'lifestyle-food-channel',
    name: 'Lifestyle & Food Channel',
    description: 'Complete lifestyle channel with cooking, home, and wellness content',
    icon: '🍳',
    category: 'lifestyle',
    color: 'from-pink-500 to-orange-500',
    estimatedSetupTime: '1-2 hours',
    difficulty: 'beginner',
    popular: true,
    blueprint: {
      contentStrategy: {
        videoTypes: ['Recipe Videos', 'Home Tours', 'DIY Projects', 'Wellness Tips', 'Day in Life'],
        postingSchedule: '3 videos/week + daily stories',
        growthGoals: '25K subscribers in 6 months',
        monetization: ['Sponsored content', 'Affiliate marketing', 'Digital products', 'Brand partnerships']
      },
      contentCalendar: {
        weeklyStructure: {
          'Monday': 'Recipe Monday',
          'Wednesday': 'Home & DIY',
          'Friday': 'Wellness & Self-care',
          'Daily': 'Instagram Stories'
        },
        monthlyThemes: ['Seasonal recipes', 'Home organization', 'Wellness challenges', 'Holiday preparations']
      },
      brandAssets: {
        colorPalette: ['#EC4899', '#F97316', '#EAB308', '#F8FAFC'],
        thumbnailStyles: ['Bright food shots', 'Before/after transformations', 'Lifestyle aesthetics', 'Step-by-step'],
        designElements: ['Natural lighting', 'Warm tones', 'Minimalist layouts', 'Personal branding']
      },
      analyticsSetup: {
        kpis: ['Engagement rate', 'Save rate', 'Share rate', 'Comment sentiment', 'Story completion'],
        competitorList: ['Emma Chamberlain', 'Rosemary Gladstar', 'Pick Up Limes', 'Honeysuckle', 'Tasty']
      },
      automationWorkflows: [
        'Recipe content calendar',
        'Seasonal content planning',
        'Cross-platform recipe sharing',
        'Ingredient affiliate tracking'
      ],
      preBuiltProjects: [
        {
          title: '5-Minute Healthy Recipe',
          type: 'video',
          platform: 'Instagram',
          priority: 'high',
          tags: ['Recipe', 'Healthy', 'Quick'],
          estimatedHours: 3,
          description: 'Quick and healthy recipe perfect for busy weekdays with step-by-step instructions'
        },
        {
          title: 'Home Organization Makeover',
          type: 'video',
          platform: 'YouTube',
          priority: 'medium',
          tags: ['Home', 'Organization', 'DIY'],
          estimatedHours: 8,
          description: 'Complete room organization with before/after transformation and tips'
        }
      ]
    }
  },
  {
    id: 'business-entrepreneur',
    name: 'Business & Entrepreneurship',
    description: 'Professional business content with tutorials, case studies, and industry insights',
    icon: '💼',
    category: 'business',
    color: 'from-slate-700 to-blue-600',
    estimatedSetupTime: '3-4 hours',
    difficulty: 'advanced',
    blueprint: {
      contentStrategy: {
        videoTypes: ['Business Tutorials', 'Case Studies', 'Industry Analysis', 'Interviews', 'Strategy Breakdowns'],
        postingSchedule: '2 videos/week + weekly newsletter',
        growthGoals: '100K subscribers in 12 months',
        monetization: ['Courses', 'Consulting', 'Speaking', 'Premium content', 'Affiliate marketing']
      },
      contentCalendar: {
        weeklyStructure: {
          'Tuesday': 'Tutorial Tuesday',
          'Friday': 'Case Study Friday',
          'Weekly': 'Industry Newsletter'
        },
        monthlyThemes: ['Startup strategies', 'Marketing deep-dives', 'Financial planning', 'Leadership skills']
      },
      brandAssets: {
        colorPalette: ['#334155', '#3B82F6', '#64748B', '#F1F5F9'],
        thumbnailStyles: ['Professional headshots', 'Data visualizations', 'Clean graphics', 'Authority positioning'],
        designElements: ['Corporate aesthetics', 'Charts and graphs', 'Professional typography', 'Minimalist design']
      },
      analyticsSetup: {
        kpis: ['Lead generation', 'Course sales', 'Email subscribers', 'Consultation bookings', 'Authority metrics'],
        competitorList: ['Gary Vee', 'Grant Cardone', 'Amy Porterfield', 'Pat Flynn', 'Marie Forleo']
      },
      automationWorkflows: [
        'Lead magnet distribution',
        'Email sequence automation',
        'Content repurposing',
        'Social proof collection'
      ],
      preBuiltProjects: [
        {
          title: 'Business Strategy Breakdown',
          type: 'video',
          platform: 'YouTube',
          priority: 'high',
          tags: ['Business', 'Strategy', 'Analysis'],
          estimatedHours: 12,
          description: 'Deep dive analysis of successful business strategies with actionable takeaways'
        },
        {
          title: 'LinkedIn Content Series',
          type: 'content',
          platform: 'LinkedIn',
          priority: 'medium',
          tags: ['LinkedIn', 'Professional', 'Series'],
          estimatedHours: 6,
          description: '5-part professional content series for LinkedIn audience building'
        }
      ]
    }
  },
  {
    id: 'fitness-wellness',
    name: 'Fitness & Wellness',
    description: 'Complete fitness channel with workouts, nutrition, and wellness content',
    icon: '💪',
    category: 'fitness',
    color: 'from-green-500 to-teal-500',
    estimatedSetupTime: '2-3 hours',
    difficulty: 'intermediate',
    blueprint: {
      contentStrategy: {
        videoTypes: ['Workout Videos', 'Nutrition Tips', 'Progress Updates', 'Wellness Routines', 'Equipment Reviews'],
        postingSchedule: '4 videos/week + daily motivation',
        growthGoals: '75K subscribers in 10 months',
        monetization: ['Fitness programs', 'Supplements', 'Equipment affiliate', 'Coaching services']
      },
      contentCalendar: {
        weeklyStructure: {
          'Monday': 'Motivation Monday',
          'Tuesday': 'Workout Tuesday',
          'Thursday': 'Nutrition Thursday',
          'Saturday': 'Weekend Wellness',
          'Daily': 'Motivational Posts'
        },
        monthlyThemes: ['New Year fitness', 'Summer body prep', 'Back to school health', 'Holiday wellness']
      },
      brandAssets: {
        colorPalette: ['#10B981', '#14B8A6', '#06B6D4', '#F0FDF4'],
        thumbnailStyles: ['Action workout shots', 'Before/after results', 'Motivational quotes', 'Equipment focus'],
        designElements: ['High energy visuals', 'Progress tracking', 'Motivational text', 'Active lifestyle']
      },
      analyticsSetup: {
        kpis: ['Workout completion rate', 'Program sales', 'Community engagement', 'Transformation posts', 'Retention rate'],
        competitorList: ['Chloe Ting', 'FitnessBlender', 'Athlean-X', 'Yoga with Adriene', 'MadFit']
      },
      automationWorkflows: [
        'Workout plan generation',
        'Progress tracking reminders',
        'Nutrition content calendar',
        'Community challenge automation'
      ],
      preBuiltProjects: [
        {
          title: '30-Day Fitness Challenge',
          type: 'content',
          platform: 'Instagram',
          priority: 'high',
          tags: ['Fitness', 'Challenge', '30-Day'],
          estimatedHours: 20,
          description: 'Complete 30-day fitness challenge with daily workouts and progress tracking'
        },
        {
          title: 'Equipment-Free Home Workout',
          type: 'video',
          platform: 'YouTube',
          priority: 'high',
          tags: ['Workout', 'Home', 'No Equipment'],
          estimatedHours: 5,
          description: 'Full-body workout that can be done at home without any equipment'
        }
      ]
    }
  },
  {
    id: 'travel-adventure',
    name: 'Travel & Adventure',
    description: 'Travel channel with destination guides, vlogs, and adventure content',
    icon: '✈️',
    category: 'travel',
    color: 'from-sky-500 to-indigo-500',
    estimatedSetupTime: '2-3 hours',
    difficulty: 'intermediate',
    blueprint: {
      contentStrategy: {
        videoTypes: ['Destination Guides', 'Travel Vlogs', 'Budget Tips', 'Cultural Experiences', 'Adventure Activities'],
        postingSchedule: '2 videos/week + travel stories',
        growthGoals: '40K subscribers in 8 months',
        monetization: ['Tourism boards', 'Hotel partnerships', 'Travel gear affiliate', 'Travel planning services']
      },
      contentCalendar: {
        weeklyStructure: {
          'Tuesday': 'Destination Tuesday',
          'Friday': 'Adventure Friday',
          'Daily': 'Travel Stories'
        },
        monthlyThemes: ['Budget travel', 'Luxury escapes', 'Cultural immersion', 'Adventure sports']
      },
      brandAssets: {
        colorPalette: ['#0EA5E9', '#6366F1', '#8B5CF6', '#F0F9FF'],
        thumbnailStyles: ['Scenic landscapes', 'Adventure action', 'Cultural moments', 'Travel aesthetics'],
        designElements: ['Geographic elements', 'Travel icons', 'Adventure imagery', 'Cultural symbols']
      },
      analyticsSetup: {
        kpis: ['Destination interest', 'Booking conversions', 'Travel inspiration', 'Partnership value', 'Audience reach'],
        competitorList: ['Peter McKinnon', 'Kara and Nate', 'Mark Wiens', 'Eva Zu Beck', 'Lost LeBlanc']
      },
      automationWorkflows: [
        'Destination research automation',
        'Travel itinerary generation',
        'Cultural content planning',
        'Partnership opportunity tracking'
      ],
      preBuiltProjects: [
        {
          title: 'Complete Destination Guide',
          type: 'video',
          platform: 'YouTube',
          priority: 'high',
          tags: ['Travel', 'Guide', 'Destination'],
          estimatedHours: 15,
          description: 'Comprehensive travel guide including attractions, food, culture, and practical tips'
        },
        {
          title: 'Budget Travel Series',
          type: 'content',
          platform: 'YouTube',
          priority: 'medium',
          tags: ['Budget', 'Travel', 'Tips'],
          estimatedHours: 8,
          description: 'Multi-part series on how to travel on a budget with practical tips and examples'
        }
      ]
    }
  },
  {
    id: 'education-tutorial',
    name: 'Education & Tutorials',
    description: 'Educational channel with courses, tutorials, and skill-building content',
    icon: '📚',
    category: 'education',
    color: 'from-amber-500 to-red-500',
    estimatedSetupTime: '3-4 hours',
    difficulty: 'advanced',
    blueprint: {
      contentStrategy: {
        videoTypes: ['Step-by-step Tutorials', 'Course Modules', 'Skill Assessments', 'Live Q&A', 'Resource Reviews'],
        postingSchedule: '3 videos/week + weekly live session',
        growthGoals: '60K subscribers in 10 months',
        monetization: ['Online courses', 'Membership site', 'Consulting', 'Resource sales', 'Speaking']
      },
      contentCalendar: {
        weeklyStructure: {
          'Monday': 'Tutorial Monday',
          'Wednesday': 'Skill Wednesday',
          'Friday': 'Resource Friday',
          'Sunday': 'Live Q&A'
        },
        monthlyThemes: ['Beginner skills', 'Advanced techniques', 'Industry trends', 'Career development']
      },
      brandAssets: {
        colorPalette: ['#F59E0B', '#EF4444', '#DC2626', '#FEF3C7'],
        thumbnailStyles: ['Educational graphics', 'Progress indicators', 'Skill demonstrations', 'Authority positioning'],
        designElements: ['Academic aesthetics', 'Progress tracking', 'Knowledge symbols', 'Professional layouts']
      },
      analyticsSetup: {
        kpis: ['Course completion rate', 'Student success rate', 'Knowledge retention', 'Certification earned', 'Career advancement'],
        competitorList: ['Khan Academy', 'Crash Course', 'TED-Ed', 'Skillshare', 'MasterClass']
      },
      automationWorkflows: [
        'Curriculum planning automation',
        'Student progress tracking',
        'Assessment generation',
        'Resource recommendation engine'
      ],
      preBuiltProjects: [
        {
          title: 'Complete Skill Course',
          type: 'content',
          platform: 'YouTube',
          priority: 'high',
          tags: ['Education', 'Course', 'Skills'],
          estimatedHours: 25,
          description: 'Comprehensive course series teaching a complete skill from beginner to advanced'
        },
        {
          title: 'Interactive Tutorial Series',
          type: 'video',
          platform: 'YouTube',
          priority: 'medium',
          tags: ['Tutorial', 'Interactive', 'Learning'],
          estimatedHours: 12,
          description: 'Interactive tutorial series with exercises and practical applications'
        }
      ]
    }
  },
  {
    id: 'faceless-channel',
    name: 'Faceless Channel Empire',
    description: 'Fully automated content creation with AI voiceovers, stock footage, and scalable workflows',
    icon: '🤖',
    category: 'business',
    color: 'from-violet-600 to-purple-600',
    estimatedSetupTime: '4-6 hours',
    difficulty: 'advanced',
    popular: true,
    blueprint: {
      contentStrategy: {
        videoTypes: ['Top 10 Lists', 'Educational Explainers', 'Comparison Videos', 'History/Mystery', 'Motivational Content', 'Tech Reviews', 'Finance Tips'],
        postingSchedule: '1-2 videos daily (highly scalable)',
        growthGoals: '100K subscribers in 6 months through volume',
        monetization: ['YouTube AdSense', 'Affiliate marketing', 'Sponsored content', 'Multiple channels', 'Course sales', 'Brand partnerships']
      },
      contentCalendar: {
        weeklyStructure: {
          'Monday': 'Tech/AI Topics',
          'Tuesday': 'Business/Finance',
          'Wednesday': 'Educational Lists',
          'Thursday': 'Comparison Content',
          'Friday': 'Motivational/Self-Help',
          'Saturday': 'History/Mystery',
          'Sunday': 'Trending Topics'
        },
        monthlyThemes: ['Trending AI topics', 'Financial literacy', 'Productivity hacks', 'Historical mysteries']
      },
      brandAssets: {
        colorPalette: ['#7C3AED', '#8B5CF6', '#A855F7', '#C084FC'],
        thumbnailStyles: ['Bold text overlays', 'Contrasting backgrounds', 'Number emphasis', 'Curiosity gaps', 'Split screen comparisons'],
        designElements: ['Minimalist graphics', 'Stock photo integration', 'Animated text', 'Color gradients', 'Clean typography']
      },
      analyticsSetup: {
        kpis: ['Upload consistency', 'Click-through rate', 'Watch time retention', 'Revenue per video', 'Automation efficiency', 'Content velocity'],
        competitorList: ['Bright Side', 'The Infographics Show', 'Top5s', 'BE AMAZED', 'Kurzgesagt', 'Simplicissimus']
      },
      automationWorkflows: [
        'AI script generation with ChatGPT/Claude',
        'Automated voiceover with ElevenLabs',
        'Stock footage sourcing and editing',
        'Thumbnail generation with AI tools',
        'SEO optimization and scheduling',
        'Performance tracking and optimization',
        'Content idea mining from trends',
        'Multi-channel content distribution'
      ],
      preBuiltProjects: [
        {
          title: 'AI Script Generation Workflow',
          type: 'content',
          platform: 'YouTube',
          priority: 'high',
          tags: ['AI', 'Automation', 'Scripts'],
          estimatedHours: 8,
          description: 'Set up automated script generation system using AI tools for consistent content creation'
        },
        {
          title: 'Top 10 Video Series Setup',
          type: 'video',
          platform: 'YouTube',
          priority: 'high',
          tags: ['Top 10', 'Lists', 'Automated'],
          estimatedHours: 6,
          description: 'Create template system for automated Top 10 list videos with voiceover and stock footage'
        },
        {
          title: 'Faceless Thumbnail Templates',
          type: 'thumbnail',
          platform: 'YouTube',
          priority: 'medium',
          tags: ['Thumbnails', 'Templates', 'Automation'],
          estimatedHours: 4,
          description: 'Design automated thumbnail templates optimized for faceless content CTR'
        },
        {
          title: 'Voice Clone & Brand Setup',
          type: 'content',
          platform: 'Multi-Platform',
          priority: 'high',
          tags: ['Voice', 'Branding', 'AI'],
          estimatedHours: 5,
          description: 'Set up consistent AI voice persona and brand guidelines for scalable content'
        },
        {
          title: 'Stock Footage Library System',
          type: 'content',
          platform: 'YouTube',
          priority: 'medium',
          tags: ['Stock Footage', 'Library', 'Organization'],
          estimatedHours: 3,
          description: 'Organize and categorize stock footage library for efficient automated video production'
        },
        {
          title: 'Educational Explainer Series',
          type: 'video',
          platform: 'YouTube',
          priority: 'medium',
          tags: ['Education', 'Explainer', 'Animation'],
          estimatedHours: 10,
          description: 'Create educational content series with animated graphics and professional voiceover'
        },
        {
          title: 'Multi-Channel Strategy Setup',
          type: 'strategy',
          platform: 'Multi-Platform',
          priority: 'medium',
          tags: ['Multi-Channel', 'Strategy', 'Scaling'],
          estimatedHours: 12,
          description: 'Plan and implement strategy for managing multiple faceless channels across niches'
        },
        {
          title: 'Automated Publishing Workflow',
          type: 'content',
          platform: 'YouTube',
          priority: 'high',
          tags: ['Automation', 'Publishing', 'Scheduling'],
          estimatedHours: 6,
          description: 'Set up automated video publishing, SEO optimization, and social media distribution'
        }
      ]
    }
  }
];

export const getCategoryTemplates = (category: NicheTemplate['category']) => {
  return nicheTemplates.filter(template => template.category === category);
};

export const getPopularNicheTemplates = () => {
  return nicheTemplates.filter(template => template.popular);
};

export const getNicheTemplateById = (id: string) => {
  return nicheTemplates.find(template => template.id === id);
};

export const getAllCategories = (): NicheTemplate['category'][] => {
  return ['gaming', 'tech', 'lifestyle', 'business', 'education', 'fitness', 'travel', 'food'];
};
