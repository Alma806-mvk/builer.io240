import { NewProjectData } from '../components/NewProjectModal';

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'content' | 'marketing' | 'analysis' | 'planning';
  data: Partial<NewProjectData>;
  estimatedDuration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  popular?: boolean;
}

export const projectTemplates: ProjectTemplate[] = [
  {
    id: 'youtube-video',
    name: 'YouTube Video',
    description: 'Complete video production from script to upload',
    icon: '🎬',
    category: 'content',
    estimatedDuration: '8-16 hours',
    difficulty: 'intermediate',
    popular: true,
    data: {
      type: 'video',
      platform: 'YouTube',
      priority: 'medium',
      tags: ['YouTube', 'Video', 'Content'],
      estimatedHours: 12,
      description: 'Plan, script, record, edit, and publish a YouTube video including thumbnail creation and optimization.'
    }
  },
  {
    id: 'thumbnail-set',
    name: 'Thumbnail Design Set',
    description: 'Create multiple thumbnail variations for A/B testing',
    icon: '🎨',
    category: 'content',
    estimatedDuration: '2-4 hours',
    difficulty: 'beginner',
    popular: true,
    data: {
      type: 'thumbnail',
      platform: 'YouTube',
      priority: 'high',
      tags: ['Thumbnails', 'Design', 'A/B Testing'],
      estimatedHours: 3,
      description: 'Design 3-5 thumbnail variations for upcoming video content with different styles and hooks to test performance.'
    }
  },
  {
    id: 'content-strategy',
    name: 'Monthly Content Strategy',
    description: 'Plan content calendar and strategy for the month',
    icon: '📅',
    category: 'planning',
    estimatedDuration: '4-6 hours',
    difficulty: 'intermediate',
    data: {
      type: 'strategy',
      platform: 'Multi-Platform',
      priority: 'high',
      tags: ['Strategy', 'Planning', 'Content Calendar'],
      estimatedHours: 5,
      description: 'Develop comprehensive content strategy including topic research, content calendar, platform optimization, and growth tactics.'
    }
  },
  {
    id: 'analytics-review',
    name: 'Performance Analytics Review',
    description: 'Deep dive into channel/account performance metrics',
    icon: '📊',
    category: 'analysis',
    estimatedDuration: '2-3 hours',
    difficulty: 'intermediate',
    data: {
      type: 'analytics',
      platform: 'Multi-Platform',
      priority: 'medium',
      tags: ['Analytics', 'Performance', 'Insights'],
      estimatedHours: 2.5,
      description: 'Analyze performance metrics, identify trends, create actionable insights, and develop optimization recommendations.'
    }
  },
  {
    id: 'instagram-reels',
    name: 'Instagram Reels Campaign',
    description: 'Create a series of engaging Instagram Reels',
    icon: '📱',
    category: 'content',
    estimatedDuration: '6-10 hours',
    difficulty: 'beginner',
    popular: true,
    data: {
      type: 'content',
      platform: 'Instagram',
      priority: 'medium',
      tags: ['Instagram', 'Reels', 'Short-form'],
      estimatedHours: 8,
      description: 'Plan, create, and schedule 5-7 Instagram Reels focusing on trending topics and engaging visual content.'
    }
  },
  {
    id: 'tiktok-viral',
    name: 'TikTok Viral Strategy',
    description: 'Research and create content designed for viral potential',
    icon: '🚀',
    category: 'marketing',
    estimatedDuration: '4-8 hours',
    difficulty: 'advanced',
    data: {
      type: 'content',
      platform: 'TikTok',
      priority: 'high',
      tags: ['TikTok', 'Viral', 'Trending'],
      estimatedHours: 6,
      description: 'Research trending sounds, hashtags, and formats to create TikTok content optimized for maximum reach and engagement.'
    }
  },
  {
    id: 'podcast-episode',
    name: 'Podcast Episode',
    description: 'Plan, record, and publish a podcast episode',
    icon: '🎙️',
    category: 'content',
    estimatedDuration: '10-15 hours',
    difficulty: 'advanced',
    data: {
      type: 'content',
      platform: 'Multi-Platform',
      priority: 'medium',
      tags: ['Podcast', 'Audio', 'Interview'],
      estimatedHours: 12,
      description: 'Research topics, prepare questions, conduct interview/recording, edit audio, create show notes, and distribute across platforms.'
    }
  },
  {
    id: 'blog-post',
    name: 'SEO Blog Post',
    description: 'Write and optimize a blog post for search engines',
    icon: '✍️',
    category: 'content',
    estimatedDuration: '3-5 hours',
    difficulty: 'beginner',
    data: {
      type: 'content',
      platform: 'Other',
      priority: 'medium',
      tags: ['Blog', 'SEO', 'Writing'],
      estimatedHours: 4,
      description: 'Research keywords, write comprehensive blog post, optimize for SEO, create meta descriptions, and format for web publication.'
    }
  },
  {
    id: 'social-audit',
    name: 'Social Media Audit',
    description: 'Comprehensive review of all social media accounts',
    icon: '🔍',
    category: 'analysis',
    estimatedDuration: '3-6 hours',
    difficulty: 'intermediate',
    data: {
      type: 'analytics',
      platform: 'Multi-Platform',
      priority: 'low',
      tags: ['Audit', 'Social Media', 'Optimization'],
      estimatedHours: 4.5,
      description: 'Review all social media profiles, analyze performance, identify improvement opportunities, and create optimization roadmap.'
    }
  },
  {
    id: 'competitor-analysis',
    name: 'Competitor Analysis',
    description: 'Research and analyze competitor strategies',
    icon: '🎯',
    category: 'analysis',
    estimatedDuration: '4-6 hours',
    difficulty: 'advanced',
    data: {
      type: 'strategy',
      platform: 'Multi-Platform',
      priority: 'medium',
      tags: ['Competitor Analysis', 'Research', 'Strategy'],
      estimatedHours: 5,
      description: 'Identify key competitors, analyze their content strategies, performance metrics, and extract actionable insights for improvement.'
    }
  }
];

export const getTemplatesByCategory = (category: ProjectTemplate['category']) => {
  return projectTemplates.filter(template => template.category === category);
};

export const getPopularTemplates = () => {
  return projectTemplates.filter(template => template.popular);
};

export const getTemplateById = (id: string) => {
  return projectTemplates.find(template => template.id === id);
};
