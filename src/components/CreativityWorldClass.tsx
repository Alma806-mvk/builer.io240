import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lightbulb,
  Brain,
  Shuffle,
  Timer,
  Palette,
  Sparkles,
  Target,
  Flame,
  Heart,
  Zap,
  RefreshCw,
  Play,
  Pause,
  Save,
  Send,
  Star,
  TrendingUp,
  Users,
  Eye,
  Coffee,
  Rocket,
  ChevronRight,
  ChevronDown,
  Download,
  Share2,
  Plus,
  Trash2,
  Edit3,
  Copy,
  Check,
  Clock,
  Award,
  Camera,
  Mic,
  Video,
  Image as ImageIcon,
  FileText,
  Layers,
  Grid,
  List,
  Filter,
  Search,
  ArrowRight,
  Globe,
  Bookmark,
  MessageSquare,
  ThumbsUp,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import {
  Card,
  Button,
  GradientText,
  ProgressBar,
  Badge,
  Modal,
  TabHeader
} from './ui/WorldClassComponents';

interface CreativeSession {
  id: string;
  title: string;
  mode: string;
  ideas: string[];
  timestamp: Date;
  duration: number;
  tags: string[];
}

interface CreativeIdea {
  id: string;
  text: string;
  mode: string;
  category: string;
  rating: number;
  isFavorite: boolean;
  timestamp: Date;
  linkedTo?: string[];
}

interface VisualPrompt {
  id: string;
  type: 'color' | 'image' | 'pattern' | 'texture';
  data: string;
  description: string;
  category: string;
}

interface CreativityWorldClassProps {
  onNavigateToTab?: (tab: string) => void;
}

const CreativityWorldClass: React.FC<CreativityWorldClassProps> = ({
  onNavigateToTab
}) => {
  const [activeSection, setActiveSection] = useState<'dashboard' | 'breaker' | 'inspiration' | 'sessions' | 'analytics'>('dashboard');
  const [currentMode, setCurrentMode] = useState<'mood' | 'random' | 'challenge' | 'visual' | 'collaborative' | 'advanced'>('mood');
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [currentIdea, setCurrentIdea] = useState<string>('');
  const [currentIdeaElements, setCurrentIdeaElements] = useState<any>(null);
  const [savedIdeas, setSavedIdeas] = useState<CreativeIdea[]>([]);
  const [creativeSessions, setCreativeSessions] = useState<CreativeSession[]>([]);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [challengeTimer, setChallengeTimer] = useState(300); // 5 minutes
  const [sessionIdeas, setSessionIdeas] = useState<string[]>([]);
  const [brainstormInput, setBrainstormInput] = useState('');
  const [brainstormHistory, setBrainstormHistory] = useState<Array<{isUser: boolean, text: string, timestamp: Date}>>([]);
  const [visualPrompts, setVisualPrompts] = useState<VisualPrompt[]>([]);
  const [showIdeaModal, setShowIdeaModal] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<CreativeIdea | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<typeof visualCategories[0] | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [creativityScore, setCreativityScore] = useState(85);
  const [weeklyGoal, setWeeklyGoal] = useState(50);
  const [currentStreak, setCurrentStreak] = useState(7);
  const [realTimeInspirations, setRealTimeInspirations] = useState<string[]>([]);
  const [colorPalettes, setColorPalettes] = useState<Array<{name: string, colors: string[], mood: string}>>([]);
  const [aiPersonality, setAiPersonality] = useState('creative-genius');
  const [userCreativityProfile, setUserCreativityProfile] = useState({
    preferredMoods: ['energetic', 'artistic'],
    successfulPatterns: ['visual-heavy', 'emotional-hooks'],
    peakTimes: ['morning', 'late-evening'],
    creativityScore: 85
  });

  const timerRef = useRef<NodeJS.Timeout>();

  const moods = [
    {
      emoji: '���',
      label: 'Energetic',
      color: 'from-orange-500/20 to-red-500/20 border-orange-500/30',
      techniques: ['High-energy brainstorming', 'Rapid-fire ideation', 'Movement-based creativity'],
      prompts: [
        'Create explosive content that gets people hyped about [topic]',
        'Design a high-energy challenge around your niche',
        'Make content that feels like a pep rally for [subject]'
      ]
    },
    {
      emoji: '🧘',
      label: 'Contemplative',
      color: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30',
      techniques: ['Deep reflection', 'Mindful ideation', 'Philosophical approaches'],
      prompts: [
        'Explore the deeper meaning behind [topic]',
        'Create thoughtful, reflective content about [subject]',
        'Design a meditation or mindfulness approach to [niche]'
      ]
    },
    {
      emoji: '😤',
      label: 'Frustrated',
      color: 'from-red-500/20 to-pink-500/20 border-red-500/30',
      techniques: ['Problem-focused thinking', 'Contrarian perspectives', 'Solution-oriented creativity'],
      prompts: [
        'Channel frustration into "Why [topic] is broken and how to fix it"',
        'Create content about common misconceptions in [niche]',
        'Design a "brutally honest" take on [subject]'
      ]
    },
    {
      emoji: '🎨',
      label: 'Artistic',
      color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30',
      techniques: ['Visual thinking', 'Aesthetic approaches', 'Sensory creativity'],
      prompts: [
        'Create visually stunning content about [topic]',
        'Design an artistic interpretation of [concept]',
        'Make content that feels like a work of art'
      ]
    },
    {
      emoji: '🤔',
      label: 'Analytical',
      color: 'from-green-500/20 to-teal-500/20 border-green-500/30',
      techniques: ['Data-driven creativity', 'Systematic approaches', 'Research-based ideation'],
      prompts: [
        'Break down [topic] into its core components',
        'Create data-driven content about [subject]',
        'Design an analytical framework for [niche]'
      ]
    },
    {
      emoji: '🎭',
      label: 'Playful',
      color: 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30',
      techniques: ['Gamification', 'Humor-based approaches', 'Interactive creativity'],
      prompts: [
        'Turn [topic] into a fun game or challenge',
        'Create humorous content about [subject]',
        'Design an interactive experience around [niche]'
      ]
    }
  ];

  const creativeTechniques = [
    {
      name: 'SCAMPER Method',
      description: 'Substitute, Combine, Adapt, Modify, Put to other uses, Eliminate, Reverse',
      category: 'systematic',
      difficulty: 'intermediate'
    },
    {
      name: 'Six Thinking Hats',
      description: 'Explore ideas from 6 different perspectives (logic, emotion, caution, etc.)',
      category: 'perspective',
      difficulty: 'beginner'
    },
    {
      name: 'Random Word Association',
      description: 'Connect random words to your topic for unexpected insights',
      category: 'association',
      difficulty: 'beginner'
    },
    {
      name: 'Reverse Brainstorming',
      description: 'Think about how to make the worst possible solution, then flip it',
      category: 'contrarian',
      difficulty: 'intermediate'
    },
    {
      name: 'Morphological Box',
      description: 'Break problems into parameters and combine different solutions',
      category: 'systematic',
      difficulty: 'advanced'
    },
    {
      name: 'Biomimicry',
      description: 'Find inspiration in nature and natural processes',
      category: 'analogy',
      difficulty: 'intermediate'
    }
  ];

  // TRENDING TOPICS BY POPULARITY (Most Popular → Niche)
  const trendingElements = [
    // MOST POPULAR - Universal Appeal
    'AI Tools', 'Productivity', 'Mental Health', 'Side Hustles', 'Social Media',
    'Personal Finance', 'Fitness', 'Cooking', 'Travel', 'Photography',
    'Relationships', 'Career Growth', 'Self Improvement', 'Time Management', 'Goal Setting',

    // VERY POPULAR - Broad Interest
    'Remote Work', 'Content Creation', 'Investing', 'Digital Marketing', 'Entrepreneurship',
    'Nutrition', 'Minimalism', 'Meditation', 'Online Learning', 'Personal Branding',
    'Home Workouts', 'Budgeting', 'Dating', 'Parenting', 'Leadership',

    // POPULAR - Growing Interest
    'Crypto', 'NFTs', 'Freelancing', 'YouTube', 'TikTok',
    'Plant-Based Diet', 'Sustainable Living', 'Digital Nomads', 'E-commerce', 'Dropshipping',
    'Coding', 'Web Design', 'Affiliate Marketing', 'Podcast Creation', 'Home Organization',

    // TRENDING - Current Hot Topics
    'Gen Z Marketing', 'Work-Life Balance', 'Mental Health Apps', 'Video Editing', 'Influencer Marketing',
    'Electric Vehicles', 'Climate Action', 'Virtual Reality', 'Gaming', 'Streaming',
    'Food Delivery', 'Online Courses', 'Language Learning', 'Smart Home', 'Renewable Energy',

    // NICHE BUT GROWING - Specialized Interest
    'Biohacking', 'Cold Therapy', 'Intermittent Fasting', 'Micro-Investing', 'Urban Gardening',
    'Fermentation', 'Digital Detox', 'Stoicism', 'Mindfulness', 'Habit Tracking',
    'Sleep Optimization', 'Breathwork', 'Sound Healing', 'Forest Bathing', 'Grounding',

    // SPECIALIZED NICHES - Dedicated Communities
    'Mushroom Cultivation', 'Beekeeping', 'Vintage Restoration', 'Woodworking', 'Pottery',
    'Soap Making', 'Candle Making', 'Embroidery', 'Calligraphy', 'Origami',
    'Bonsai Care', 'Aquaponics', 'Composting', 'Seed Starting', 'Foraging',

    // EMERGING NICHES - Early Adopters
    'NFT Art Creation', 'Metaverse Building', 'Drone Photography', 'Voice Acting', 'Motion Graphics',
    'Data Visualization', 'UX Design', 'Product Management', 'Growth Hacking', 'Conversion Optimization',
    'Email Marketing', 'SEO Strategies', 'Content Strategy', 'Brand Storytelling', 'Customer Research'
  ];

  // EXPANDED PERSPECTIVES DATABASE (100+ unique viewpoints)
  const perspectives = [
    // Experience Levels
    'Complete Beginner', 'Intermediate Learner', 'Advanced Practitioner', 'Industry Expert', 'Thought Leader',
    'Veteran Professional', 'Recent Graduate', 'Career Changer', 'Self-Taught Expert', 'Academic Researcher',

    // Age & Life Stage
    'Teenager\'s View', 'College Student', 'Young Professional', 'Mid-Career Professional', 'Senior Executive',
    'Recent Retiree', 'Elderly Wisdom', 'New Parent', 'Empty Nester', 'Grandparent',

    // Cultural & Geographic
    'Rural Perspective', 'Urban Dweller', 'Suburban Family', 'International Perspective', 'Cultural Outsider',
    'Immigrant Experience', 'First-Generation', 'Traditional Culture', 'Modern Progressive', 'Conservative View',

    // Professional Roles
    'CEO\'s Perspective', 'Startup Founder', 'Freelancer\'s View', 'Employee Mindset', 'Consultant Angle',
    'Investor Perspective', 'Customer\'s View', 'Vendor Perspective', 'Competitor Analysis', 'Partner Viewpoint',

    // Personality Types
    'Optimistic Outlook', 'Pessimistic View', 'Skeptical Critic', 'Enthusiastic Fan', 'Analytical Mind',
    'Creative Thinker', 'Practical Realist', 'Idealistic Dreamer', 'Risk-Taker', 'Cautious Planner',

    // Fictional & Creative
    'Time Traveler from 1920s', 'Visitor from 2050', 'Alien Observer', 'Robot\'s Logic', 'AI\'s Perspective',
    'Child\'s Wonder', 'Philosopher\'s View', 'Scientist\'s Method', 'Artist\'s Vision', 'Detective\'s Investigation',

    // Economic Perspectives
    'Budget-Conscious', 'Luxury Lifestyle', 'Minimalist Approach', 'Maximalist View', 'Frugal Living',
    'Investment Minded', 'Debt-Free Journey', 'Financial Advisor', 'Economic Analyst', 'Consumer Advocate',

    // Psychological States
    'Anxious Perspective', 'Confident Approach', 'Curious Explorer', 'Overwhelmed Beginner', 'Burned-Out Professional',
    'Motivated Achiever', 'Stressed Parent', 'Relaxed Retiree', 'Ambitious Student', 'Content Settler',

    // Social Roles
    'Community Leader', 'Social Influencer', 'Quiet Observer', 'Team Player', 'Solo Operator',
    'Mentor\'s Guidance', 'Student\'s Questions', 'Teacher\'s Explanation', 'Coach\'s Strategy', 'Therapist\'s Insight',

    // Industry Specific
    'Healthcare Worker', 'Educator\'s View', 'Engineer\'s Logic', 'Designer\'s Aesthetic', 'Marketer\'s Angle',
    'Salesperson\'s Pitch', 'Developer\'s Code', 'Manager\'s Strategy', 'HR Perspective', 'Legal Viewpoint'
  ];

  // MASSIVE CONTENT FORMATS DATABASE (150+ formats)
  const contentFormats = [
    // Video Content
    'YouTube Video', 'TikTok Short', 'Instagram Reel', 'Facebook Video', 'LinkedIn Video',
    'Video Series', 'Mini-Documentary', 'Tutorial Video', 'Behind-the-Scenes', 'Vlog Entry',
    'Product Demo', 'Unboxing Video', 'Reaction Video', 'Video Essay', 'Animated Explainer',
    'Live Stream', 'Webinar', 'Virtual Event', 'Video Interview', 'Panel Discussion',

    // Audio Content
    'Podcast Episode', 'Audio Blog', 'Voice Message', 'Audio Drama', 'Meditation Guide',
    'Audio Book Chapter', 'Music Video', 'Sound Effect Story', 'Radio Show', 'Audio Interview',

    // Written Content
    'Blog Post', 'Article', 'Newsletter', 'Email Series', 'Twitter Thread',
    'LinkedIn Article', 'Medium Story', 'Case Study', 'White Paper', 'Research Report',
    'E-book Chapter', 'Short Story', 'Poetry', 'Script', 'Speech',

    // Visual Content
    'Infographic', 'Carousel Post', 'Meme', 'Comic Strip', 'Illustration',
    'Photo Series', 'Photography Project', 'Art Portfolio', 'Design Mockup', 'Visual Story',
    'Chart/Graph', 'Diagram', 'Map Visualization', 'Timeline', 'Comparison Chart',

    // Interactive Content
    'Quiz', 'Poll', 'Survey', 'Interactive Story', 'Choose-Your-Adventure',
    'Calculator Tool', 'Assessment', 'Game', 'Puzzle', 'Challenge',
    'Virtual Tour', 'AR Experience', 'VR Content', 'Interactive Map', 'Chatbot Conversation',

    // Social Media Formats
    'Instagram Story', 'Snapchat Story', 'Instagram Highlight', 'Pinterest Pin', 'Pinterest Board',
    'LinkedIn Carousel', 'Twitter Poll', 'Facebook Event', 'Instagram Live', 'Clubhouse Room',

    // Educational Formats
    'Course Module', 'Workshop', 'Masterclass', 'Tutorial Series', 'Study Guide',
    'Lesson Plan', 'Exercise Set', 'Practice Problems', 'Flashcards', 'Summary Notes',
    'Cheat Sheet', 'Reference Guide', 'How-to Guide', 'Step-by-Step Tutorial', 'Quick Tips',

    // Business Formats
    'Presentation', 'Pitch Deck', 'Business Plan', 'Marketing Campaign', 'Sales Funnel',
    'Landing Page', 'Email Campaign', 'Press Release', 'Product Launch', 'Brand Story',

    // Entertainment Formats
    'Comedy Sketch', 'Parody', 'Satire', 'Drama Scene', 'Musical Performance',
    'Dance Video', 'Magic Trick', 'Prank', 'Challenge Video', 'Trend Participation',

    // Community Formats
    'Forum Post', 'Community Challenge', 'User-Generated Content', 'Collaboration', 'Group Project',
    'Mentorship Program', 'Study Group', 'Discussion Panel', 'Debate', 'Q&A Session',

    // Experimental Formats
    'AI-Generated Content', 'Mixed Media', 'Transmedia Story', 'Cross-Platform Campaign', 'Real-Time Content',
    'Location-Based Content', 'Weather-Triggered Content', 'Mood-Based Content', 'Personalized Content', 'Dynamic Content'
  ];

  const visualCategories = [
    {
      name: 'Color Palettes',
      count: 24,
      icon: Palette,
      prompts: [
        'Create content inspired by ocean blues and sandy beiges',
        'Use a sunset palette (oranges, pinks, purples) for your next post',
        'Try a minimalist black and white with one accent color',
        'Incorporate forest greens and earth tones for nature content',
        'Use neon cyberpunk colors (hot pink, electric blue, lime green)',
        'Create with warm autumn colors (burnt orange, deep red, golden yellow)'
      ]
    },
    {
      name: 'Abstract Patterns',
      count: 18,
      icon: Grid,
      prompts: [
        'Use geometric shapes to explain your concept',
        'Create content in a spiral or circular flow pattern',
        'Try a mosaic-style breakdown of your topic',
        'Use zigzag or lightning patterns for energy',
        'Create flowing, organic shapes for smooth transitions',
        'Use broken or fragmented patterns for dramatic effect'
      ]
    },
    {
      name: 'Nature Inspired',
      count: 32,
      icon: Sparkles,
      prompts: [
        'Explain your topic like seasons changing',
        'Use water metaphors (flow, waves, deep/shallow)',
        'Compare your subject to plant growth stages',
        'Use animal behavior parallels in your content',
        'Create content inspired by weather patterns',
        'Use mountain/valley metaphors for ups and downs'
      ]
    },
    {
      name: 'Minimalist',
      count: 16,
      icon: Target,
      prompts: [
        'Strip your topic down to just 3 core elements',
        'Create content with maximum white space',
        'Use only one key point per piece of content',
        'Focus on single, powerful statements',
        'Remove all unnecessary elements and decorations',
        'Create with "less is more" philosophy'
      ]
    },
    {
      name: 'Vintage/Retro',
      count: 22,
      icon: Clock,
      prompts: [
        'Explain modern concepts using 1950s language',
        'Create content as if it\'s from a vintage magazine',
        'Use old-school photography styles and filters',
        'Compare today\'s problems to historical ones',
        'Create content in the style of classic advertisements',
        'Use nostalgic references your audience will remember'
      ]
    },
    {
      name: 'Futuristic',
      count: 14,
      icon: Rocket,
      prompts: [
        'Predict how your topic will evolve in 10 years',
        'Create content as if it\'s from the year 2050',
        'Use sci-fi terminology and concepts',
        'Imagine your topic in a space-age setting',
        'Create content with holographic/digital aesthetics',
        'Explore how AI/robots would handle your topic'
      ]
    }
  ];

  // Timer effect
  useEffect(() => {
    if (isTimerRunning && challengeTimer > 0) {
      timerRef.current = setInterval(() => {
        setChallengeTimer((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerRunning, challengeTimer]);

  // ADDITIONAL RANDOMIZATION DIMENSIONS
  const targetAudiences = [
    'Millennials', 'Gen Z', 'Gen X', 'Baby Boomers', 'Teenagers', 'College Students', 'Young Professionals',
    'Parents', 'Entrepreneurs', 'Small Business Owners', 'Remote Workers', 'Freelancers', 'Creatives',
    'Tech Enthusiasts', 'Fitness Enthusiasts', 'Foodies', 'Travelers', 'Investors', 'Beginners', 'Experts'
  ];

  const contentAngles = [
    'Beginner\'s Guide', 'Advanced Strategies', 'Common Mistakes', 'Success Stories', 'Failure Lessons',
    'Behind the Scenes', 'Future Predictions', 'Historical Analysis', 'Comparison Study', 'Myth Busting',
    'Surprising Facts', 'Hidden Secrets', 'Expert Tips', 'Personal Journey', 'Transformation Story',
    'Before & After', 'Step-by-Step', 'Quick Wins', 'Long-term Strategy', 'Controversial Take'
  ];

  const emotionalTones = [
    'Inspiring', 'Humorous', 'Serious', 'Playful', 'Mysterious', 'Urgent', 'Calming', 'Exciting',
    'Nostalgic', 'Hopeful', 'Dramatic', 'Casual', 'Professional', 'Intimate', 'Bold', 'Gentle'
  ];

  const contentPurposes = [
    'Educate', 'Entertain', 'Inspire', 'Convince', 'Warn', 'Celebrate', 'Analyze', 'Simplify',
    'Challenge', 'Support', 'Question', 'Reveal', 'Transform', 'Connect', 'Motivate', 'Comfort'
  ];

  // SIMPLIFIED LOGICAL IDEA GENERATOR
  const generateRandomIdea = () => {
    const topic = trendingElements[Math.floor(Math.random() * trendingElements.length)];
    const format = contentFormats[Math.floor(Math.random() * contentFormats.length)];
    const audience = targetAudiences[Math.floor(Math.random() * targetAudiences.length)];
    const angle = contentAngles[Math.floor(Math.random() * contentAngles.length)];

    // Store elements for display (simplified)
    const elements = { topic, format, audience, angle };
    setCurrentIdeaElements(elements);

    // SIMPLE, LOGICAL PATTERNS that actually make sense
    const patterns = [
      `${angle}: ${topic} for ${audience}`,
      `${format} about ${topic} for ${audience}`,
      `${topic} ${angle.toLowerCase()} for ${audience}`,
      `How ${audience.toLowerCase()} can use ${topic}`,
      `${topic}: ${angle.toLowerCase()} for ${audience}`,
      `${audience}'s guide to ${topic}`,
      `${topic} tips for ${audience.toLowerCase()}`,
      `${angle} of ${topic} for ${audience}`,
      `${audience} and ${topic}: ${angle.toLowerCase()}`,
      `${format}: ${topic} for ${audience}`
    ];

    const selectedPattern = patterns[Math.floor(Math.random() * patterns.length)];
    setCurrentIdea(selectedPattern);
  };

  // Save idea with enhanced data
  const saveIdea = (ideaText: string, category: string = 'general', elements?: any) => {
    const newIdea: CreativeIdea = {
      id: Date.now().toString(),
      text: ideaText,
      mode: currentMode,
      category,
      rating: 0,
      isFavorite: false,
      timestamp: new Date(),
      linkedTo: elements ? [JSON.stringify(elements)] : undefined
    };
    setSavedIdeas(prev => [newIdea, ...prev]);
  };

  // Start creativity session
  const startCreativitySession = () => {
    setIsTimerRunning(true);
    setSessionIdeas([]);
    setChallengeTimer(300); // 5 minutes
  };

  // Add idea to current session
  const addToSession = (idea: string) => {
    setSessionIdeas(prev => [...prev, idea]);
  };

  // Color palette generator
  const generateColorPalette = () => {
    const palettes = [
      {
        name: 'Ocean Breeze',
        colors: ['#0077BE', '#87CEEB', '#F0F8FF', '#20B2AA', '#4682B4'],
        mood: 'calm, refreshing, trustworthy',
        usage: 'Use for content about clarity, peace, professional growth'
      },
      {
        name: 'Sunset Vibes',
        colors: ['#FF6B35', '#F7931E', '#FFD23F', '#FF8C94', '#FF9AA2'],
        mood: 'warm, energetic, optimistic',
        usage: 'Perfect for motivational content, celebrations, achievements'
      },
      {
        name: 'Forest Wisdom',
        colors: ['#2F4F2F', '#228B22', '#90EE90', '#8FBC8F', '#F0FFF0'],
        mood: 'natural, grounded, growth-focused',
        usage: 'Great for educational content, sustainability, personal development'
      },
      {
        name: 'Cyber Neon',
        colors: ['#FF1493', '#00FFFF', '#7FFF00', '#FF69B4', '#8A2BE2'],
        mood: 'futuristic, bold, innovative',
        usage: 'Tech content, disruptive ideas, cutting-edge topics'
      },
      {
        name: 'Minimal Zen',
        colors: ['#F5F5F5', '#E5E5E5', '#D3D3D3', '#A9A9A9', '#696969'],
        mood: 'clean, focused, sophisticated',
        usage: 'Minimalist content, clear explanations, professional advice'
      },
      {
        name: 'Royal Luxury',
        colors: ['#4B0082', '#8B008B', '#FFD700', '#DC143C', '#2F4F4F'],
        mood: 'premium, exclusive, powerful',
        usage: 'High-value content, luxury topics, authority building'
      }
    ];
    return palettes[Math.floor(Math.random() * palettes.length)];
  };

  // AI personality responses
  const getAIResponse = (input: string, personality: string) => {
    const responses = {
      'creative-genius': [
        "What if we flipped that completely upside down? 🎭",
        "That's interesting! Now imagine it as a surrealist painting... 🎨",
        "I'm seeing connections to 17th century philosophy mixed with TikTok energy! ⚡",
        "Let's break every rule and see what happens! 🔥"
      ],
      'strategic-mastermind': [
        "Fascinating angle! The psychological trigger here would be... 🧠",
        "Data shows this type of content performs 23% better when... 📊",
        "I'm analyzing the emotional impact vectors... 📈",
        "Let's map the decision tree for maximum engagement! ���"
      ],
      'trend-prophet': [
        "I'm sensing this will be huge in 3-6 months... 🔮",
        "This reminds me of a pattern I spotted in early 2019... 👁️",
        "Mark my words: this approach will dominate summer 2024! ⚡",
        "I'm getting strong signals this aligns with emerging zeitgeist! 🌊"
      ],
      'chaos-agent': [
        "Perfect! Now let's add some beautiful chaos to it! ⚡",
        "What if we randomly combined it with... quantum physics? 🌪️",
        "Controlled explosion mode: activated! 💥",
        "I love the entropy in this idea! Let's amplify it! 🎲"
      ],
      'empathy-master': [
        "I can feel the emotional resonance in this... ❤️",
        "This would make people feel seen and understood! 🤗",
        "The vulnerability in this approach is powerful! 💝",
        "This taps into a deep human need for connection! 🌟"
      ]
    };

    const personalityResponses = responses[personality as keyof typeof responses] || responses['creative-genius'];
    return personalityResponses[Math.floor(Math.random() * personalityResponses.length)];
  };

  // Real-time inspiration generator
  const generateRealTimeInspiration = () => {
    const inspirations = [
      "🔥 TRENDING NOW: 'Micro-productivity' is exploding - try 30-second improvement tips",
      "💡 INSIGHT: Content with questions in titles gets 43% more engagement",
      "🌊 WAVE ALERT: 'Authentic failures' trend rising - share your real struggles",
      "⚡ VIRAL PATTERN: Before/After transformations are peaking this week",
      "🎯 OPPORTUNITY: 'Explain like I'm 5' format is underused in your niche",
      "🚀 PREDICTION: Interactive content will dominate next quarter",
      "💎 GOLDMINE: People are craving 'behind the scenes' authenticity right now"
    ];
    return inspirations[Math.floor(Math.random() * inspirations.length)];
  };

  // End session and save
  const endSession = () => {
    if (sessionIdeas.length > 0) {
      const session: CreativeSession = {
        id: Date.now().toString(),
        title: `Creative Session ${new Date().toLocaleDateString()}`,
        mode: currentMode,
        ideas: sessionIdeas,
        timestamp: new Date(),
        duration: 300 - challengeTimer,
        tags: [currentMode, selectedMood].filter(Boolean)
      };
      setCreativeSessions(prev => [session, ...prev]);
    }
    setIsTimerRunning(false);
    setSessionIdeas([]);
  };

  // Format timer display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Filter ideas
  const filteredIdeas = savedIdeas.filter(idea => {
    const matchesSearch = idea.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || idea.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center text-white mx-auto mb-4">
          <Brain className="w-10 h-10" />
        </div>
        <h1 className="heading-1 mb-3">
          <GradientText>Creativity Studio</GradientText>
        </h1>
        <p className="body-large max-w-2xl mx-auto">
          Break through creative blocks, discover fresh perspectives, and generate unlimited content ideas with AI-powered creativity techniques.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Lightbulb className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--text-primary)]">{savedIdeas.length}</div>
              <div className="text-sm text-[var(--text-secondary)]">Ideas Generated</div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Flame className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--text-primary)]">{currentStreak}</div>
              <div className="text-sm text-[var(--text-secondary)]">Day Streak</div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <BarChart3 className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--text-primary)]">{creativityScore}%</div>
              <div className="text-sm text-[var(--text-secondary)]">Creativity Score</div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Target className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--text-primary)]">{Math.round((savedIdeas.length / weeklyGoal) * 100)}%</div>
              <div className="text-sm text-[var(--text-secondary)]">Weekly Goal</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="heading-4">Quick Start</h3>
          <Badge variant="glow">New Session</Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="secondary"
            size="lg"
            onClick={() => {
              setActiveSection('breaker');
              setCurrentMode('random');
            }}
            className="h-20 flex-col space-y-2"
          >
            <Shuffle className="w-6 h-6" />
            <span>Random Idea Generator</span>
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={() => {
              setActiveSection('breaker');
              setCurrentMode('mood');
            }}
            className="h-20 flex-col space-y-2"
          >
            <Heart className="w-6 h-6" />
            <span>Mood-Based Creativity</span>
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={() => {
              setActiveSection('breaker');
              setCurrentMode('challenge');
              startCreativitySession();
            }}
            className="h-20 flex-col space-y-2"
          >
            <Timer className="w-6 h-6" />
            <span>5-Minute Sprint</span>
          </Button>
        </div>
      </Card>

      {/* Recent Ideas */}
      {savedIdeas.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="heading-4">Recent Ideas</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveSection('sessions')}
            >
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          
          <div className="space-y-3">
            {savedIdeas.slice(0, 3).map((idea) => (
              <div
                key={idea.id}
                className="p-3 bg-[var(--surface-tertiary)] rounded-lg hover:bg-[var(--surface-quaternary)] transition-colors cursor-pointer"
                onClick={() => {
                  setSelectedIdea(idea);
                  setShowIdeaModal(true);
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-[var(--text-primary)] mb-1">{idea.text}</p>
                    <div className="flex items-center space-x-2 text-xs text-[var(--text-secondary)]">
                      <Badge variant="outline" size="sm">{idea.mode}</Badge>
                      <span>{idea.timestamp.toLocaleDateString()}</span>
                    </div>
                  </div>
                  {idea.isFavorite && (
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Creative Techniques */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="heading-4">Featured Techniques</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveSection('inspiration')}
          >
            Explore All
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {creativeTechniques.slice(0, 4).map((technique) => (
            <div
              key={technique.name}
              className="p-4 bg-[var(--surface-tertiary)] rounded-lg hover:bg-[var(--surface-quaternary)] transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-[var(--text-primary)]">{technique.name}</h4>
                <Badge variant="outline" size="sm">{technique.difficulty}</Badge>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mb-3">{technique.description}</p>
              <Badge variant="outline" size="sm">{technique.category}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderBlockBreaker = () => (
    <div className="space-y-6">
      {/* Mode Selector */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="heading-4">Creative Mode</h3>
          {isTimerRunning && (
            <div className="flex items-center space-x-2">
              <Timer className="w-4 h-4 text-orange-400" />
              <span className="font-mono text-lg font-bold text-orange-400">
                {formatTime(challengeTimer)}
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          {[
            { key: 'mood', icon: Heart, label: 'Mood', color: 'purple' },
            { key: 'random', icon: Shuffle, label: 'Random', color: 'blue' },
            { key: 'challenge', icon: Timer, label: 'Challenge', color: 'orange' },
            { key: 'visual', icon: Palette, label: 'Visual', color: 'pink' },
            { key: 'collaborative', icon: Users, label: 'Collaborate', color: 'green' },
            { key: 'advanced', icon: Brain, label: 'Advanced', color: 'indigo' }
          ].map(({ key, icon: Icon, label, color }) => (
            <Button
              key={key}
              variant={currentMode === key ? 'primary' : 'secondary'}
              onClick={() => setCurrentMode(key as any)}
              className="flex-col space-y-1 h-16"
              size="sm"
            >
              <Icon className="w-4 h-4" />
              <span className="text-xs">{label}</span>
            </Button>
          ))}
        </div>
      </Card>

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Creative Area */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <AnimatePresence mode="wait">
              {currentMode === 'mood' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <h4 className="heading-4">Choose Your Creative Mood</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {moods.map((mood) => (
                      <motion.div
                        key={mood.label}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedMood(mood.label)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedMood === mood.label
                            ? `bg-gradient-to-r ${mood.color}`
                            : 'border-[var(--border-primary)] hover:border-[var(--brand-primary)]/50'
                        }`}
                      >
                        <div className="flex items-center space-x-3 mb-3">
                          <span className="text-2xl">{mood.emoji}</span>
                          <div>
                            <h5 className="font-semibold text-[var(--text-primary)]">{mood.label}</h5>
                            <p className="text-xs text-[var(--text-secondary)]">{mood.techniques.join(', ')}</p>
                          </div>
                        </div>
                        {selectedMood === mood.label && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="space-y-2"
                          >
                            {mood.prompts.map((prompt, index) => (
                              <div
                                key={index}
                                className="p-2 bg-white/10 rounded text-xs cursor-pointer hover:bg-white/20 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCurrentIdea(prompt);
                                }}
                              >
                                {prompt}
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {currentMode === 'random' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <h4 className="heading-4 mb-4">Infinite Idea Generator</h4>
                    <div className="flex justify-center space-x-3 mb-6">
                      <Button
                        onClick={generateRandomIdea}
                        size="lg"
                      >
                        <Shuffle className="w-5 h-5 mr-2" />
                        Generate New Idea
                      </Button>
                      <Button
                        onClick={() => {
                          // Generate 3 ideas rapid-fire
                          generateRandomIdea();
                          setTimeout(generateRandomIdea, 500);
                          setTimeout(generateRandomIdea, 1000);
                        }}
                        variant="secondary"
                        size="lg"
                      >
                        <Zap className="w-5 h-5 mr-2" />
                        Surprise Me!
                      </Button>
                    </div>
                    <div className="text-sm text-[var(--text-secondary)] mb-4">
                      🎯 <strong>{(trendingElements.length * contentFormats.length * targetAudiences.length * contentAngles.length).toLocaleString()}+</strong> unique combinations possible
                    </div>
                  </div>

                  {currentIdea && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl"
                    >
                      <div className="text-center mb-4">
                        <Lightbulb className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                        <h5 className="font-semibold text-[var(--text-primary)] mb-2">Your Creative Spark</h5>
                      </div>

                      <div className="p-4 bg-[var(--surface-secondary)] rounded-lg mb-4">
                        <p className="text-[var(--text-primary)] text-lg font-medium">{currentIdea}</p>
                      </div>

                      {/* Element Breakdown */}
                      {currentIdeaElements && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                          <div className="p-2 bg-[var(--surface-tertiary)] rounded text-center">
                            <div className="text-xs text-[var(--text-secondary)] mb-1">🎯 Topic</div>
                            <div className="text-xs font-medium text-[var(--text-primary)]">{currentIdeaElements.topic}</div>
                          </div>
                          <div className="p-2 bg-[var(--surface-tertiary)] rounded text-center">
                            <div className="text-xs text-[var(--text-secondary)] mb-1">📱 Format</div>
                            <div className="text-xs font-medium text-[var(--text-primary)]">{currentIdeaElements.format}</div>
                          </div>
                          <div className="p-2 bg-[var(--surface-tertiary)] rounded text-center">
                            <div className="text-xs text-[var(--text-secondary)] mb-1">�� Audience</div>
                            <div className="text-xs font-medium text-[var(--text-primary)]">{currentIdeaElements.audience}</div>
                          </div>
                          <div className="p-2 bg-[var(--surface-tertiary)] rounded text-center">
                            <div className="text-xs text-[var(--text-secondary)] mb-1">📐 Angle</div>
                            <div className="text-xs font-medium text-[var(--text-primary)]">{currentIdeaElements.angle}</div>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-center space-x-3">
                        <Button
                          variant="ghost"
                          onClick={() => saveIdea(currentIdea, 'random', currentIdeaElements)}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save Idea
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={generateRandomIdea}
                        >
                          <Shuffle className="w-4 h-4 mr-2" />
                          Remix
                        </Button>
                        <Button
                          onClick={() => {
                            localStorage.setItem('generatorPrefill', currentIdea);
                            onNavigateToTab?.('generator');
                          }}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Generate Content
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {currentMode === 'challenge' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <h4 className="heading-4 mb-4">Creativity Challenge</h4>
                    <div className="text-4xl font-bold text-[var(--brand-primary)] mb-4">
                      {formatTime(challengeTimer)}
                    </div>
                    
                    {!isTimerRunning ? (
                      <Button
                        onClick={startCreativitySession}
                        size="lg"
                      >
                        <Play className="w-5 h-5 mr-2" />
                        Start 5-Minute Sprint
                      </Button>
                    ) : (
                      <Button
                        onClick={endSession}
                        variant="secondary"
                      >
                        <Pause className="w-5 h-5 mr-2" />
                        End Session
                      </Button>
                    )}
                  </div>

                  {isTimerRunning && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h5 className="font-semibold">Quick Ideas ({sessionIdeas.length})</h5>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => addToSession(`Idea ${sessionIdeas.length + 1}: ${new Date().toLocaleTimeString()}`)}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Idea
                        </Button>
                      </div>
                      <div className="max-h-40 overflow-y-auto space-y-2">
                        {sessionIdeas.map((idea, index) => (
                          <div key={index} className="p-2 bg-[var(--surface-tertiary)] rounded text-sm">
                            {index + 1}. {idea}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {currentMode === 'visual' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="heading-4">Visual Inspiration</h4>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        const palette = generateColorPalette();
                        setCurrentIdea(`Create content using ${palette.name} color palette: ${palette.usage}`);
                      }}
                    >
                      <Palette className="w-4 h-4 mr-2" />
                      Generate Palette
                    </Button>
                  </div>

                  {/* Live Color Palette Generator */}
                  <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
                    <h5 className="font-semibold mb-3 flex items-center">
                      <Sparkles className="w-4 h-4 mr-2 text-yellow-400" />
                      Live Color Inspiration
                    </h5>
                    {(() => {
                      const palette = generateColorPalette();
                      return (
                        <div className="space-y-3">
                          <div className="flex space-x-2">
                            {palette.colors.map((color, index) => (
                              <div
                                key={index}
                                className="w-12 h-12 rounded-lg shadow-md cursor-pointer hover:scale-110 transition-transform"
                                style={{ backgroundColor: color }}
                                title={color}
                                onClick={() => {
                                  navigator.clipboard.writeText(color);
                                }}
                              />
                            ))}
                          </div>
                          <div>
                            <h6 className="font-medium text-[var(--text-primary)]">{palette.name}</h6>
                            <p className="text-sm text-[var(--text-secondary)] mb-1">Mood: {palette.mood}</p>
                            <p className="text-xs text-[var(--text-tertiary)]">{palette.usage}</p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Visual Categories */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {visualCategories.map((category) => (
                      <motion.div
                        key={category.name}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="p-4 bg-[var(--surface-tertiary)] rounded-lg hover:bg-[var(--surface-quaternary)] transition-colors cursor-pointer text-center"
                        onClick={() => {
                          setSelectedCategory(category);
                          setShowCategoryModal(true);
                        }}
                      >
                        <category.icon className="w-8 h-8 mx-auto mb-2 text-[var(--brand-primary)]" />
                        <h5 className="font-semibold text-[var(--text-primary)] mb-1">{category.name}</h5>
                        <p className="text-xs text-[var(--text-secondary)] mb-3">{category.count} prompts</p>
                        <Button variant="outline" size="sm" className="w-full">
                          Explore Category
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {currentMode === 'collaborative' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="heading-4">AI Creativity Partner</h4>
                    <select
                      value={aiPersonality}
                      onChange={(e) => setAiPersonality(e.target.value)}
                      className="px-3 py-1.5 bg-[var(--surface-secondary)] border border-[var(--border-primary)] rounded-lg text-sm"
                    >
                      <option value="creative-genius">🎨 Creative Genius</option>
                      <option value="strategic-mastermind">🧠 Strategic Mastermind</option>
                      <option value="trend-prophet">🔮 Trend Prophet</option>
                      <option value="chaos-agent">⚡ Chaos Agent</option>
                      <option value="empathy-master">❤️ Empathy Master</option>
                    </select>
                  </div>

                  {/* AI Personality Display */}
                  <div className="p-3 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-2xl">
                        {aiPersonality === 'creative-genius' ? '🎨' :
                         aiPersonality === 'strategic-mastermind' ? '🧠' :
                         aiPersonality === 'trend-prophet' ? '🔮' :
                         aiPersonality === 'chaos-agent' ? '⚡' : '❤️'}
                      </span>
                      <div>
                        <h5 className="font-semibold text-[var(--text-primary)]">
                          {aiPersonality === 'creative-genius' ? 'Creative Genius' :
                           aiPersonality === 'strategic-mastermind' ? 'Strategic Mastermind' :
                           aiPersonality === 'trend-prophet' ? 'Trend Prophet' :
                           aiPersonality === 'chaos-agent' ? 'Chaos Agent' : 'Empathy Master'}
                        </h5>
                        <p className="text-xs text-[var(--text-secondary)]">
                          {aiPersonality === 'creative-genius' ? 'Wild, unconventional ideas that break all rules' :
                           aiPersonality === 'strategic-mastermind' ? 'Data-driven creativity with psychological insights' :
                           aiPersonality === 'trend-prophet' ? 'Predicts what will be viral before it happens' :
                           aiPersonality === 'chaos-agent' ? 'Controlled chaos that creates breakthrough moments' : 'Deeply understands audience emotions and desires'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Real-Time Inspiration Feed */}
                  <div className="p-3 bg-[var(--surface-secondary)] rounded-lg">
                    <h5 className="font-semibold mb-2 flex items-center">
                      <Activity className="w-4 h-4 mr-2 text-green-400" />
                      Live Inspiration Feed
                    </h5>
                    <p className="text-sm text-[var(--text-primary)]">
                      {generateRealTimeInspiration()}
                    </p>
                  </div>

                  <div className="h-48 bg-[var(--surface-secondary)] rounded-lg p-4 overflow-y-auto">
                    <div className="space-y-3">
                      {brainstormHistory.length === 0 && (
                        <div className="text-center text-[var(--text-secondary)] text-sm mt-16">
                          🚀 Start collaborating with your AI creativity partner!
                        </div>
                      )}
                      {brainstormHistory.map((msg, index) => (
                        <div
                          key={index}
                          className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] p-3 rounded-lg ${
                              msg.isUser
                                ? 'bg-[var(--brand-primary)] text-white'
                                : 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 text-[var(--text-primary)]'
                            }`}
                          >
                            <p className="text-sm">{msg.text}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {msg.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Share your creative challenge..."
                      value={brainstormInput}
                      onChange={(e) => setBrainstormInput(e.target.value)}
                      className="flex-1 px-4 py-2 bg-[var(--surface-secondary)] border border-[var(--border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/50"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && brainstormInput.trim()) {
                          const userMessage = {
                            isUser: true,
                            text: brainstormInput.trim(),
                            timestamp: new Date()
                          };
                          setBrainstormHistory(prev => [...prev, userMessage]);

                          // Generate AI response
                          setTimeout(() => {
                            const aiResponse = {
                              isUser: false,
                              text: getAIResponse(brainstormInput.trim(), aiPersonality),
                              timestamp: new Date()
                            };
                            setBrainstormHistory(prev => [...prev, aiResponse]);
                          }, 1000);

                          setBrainstormInput('');
                        }
                      }}
                    />
                    <Button
                      onClick={() => {
                        if (brainstormInput.trim()) {
                          const userMessage = {
                            isUser: true,
                            text: brainstormInput.trim(),
                            timestamp: new Date()
                          };
                          setBrainstormHistory(prev => [...prev, userMessage]);

                          // Generate AI response
                          setTimeout(() => {
                            const aiResponse = {
                              isUser: false,
                              text: getAIResponse(brainstormInput.trim(), aiPersonality),
                              timestamp: new Date()
                            };
                            setBrainstormHistory(prev => [...prev, aiResponse]);
                          }, 1000);

                          setBrainstormInput('');
                        }
                      }}
                      disabled={!brainstormInput.trim()}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {currentMode === 'advanced' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <h4 className="heading-4">Advanced Techniques</h4>
                  <div className="space-y-4">
                    {creativeTechniques.map((technique) => (
                      <div
                        key={technique.name}
                        className="p-4 bg-[var(--surface-tertiary)] rounded-lg hover:bg-[var(--surface-quaternary)] transition-colors cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h5 className="font-semibold text-[var(--text-primary)]">{technique.name}</h5>
                          <Badge variant="outline">{technique.difficulty}</Badge>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] mb-3">{technique.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{technique.category}</Badge>
                          <Button variant="ghost" size="sm">
                            Try This Technique
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Active Session */}
          {isTimerRunning && (
            <Card>
              <h5 className="font-semibold mb-3 flex items-center">
                <Activity className="w-4 h-4 mr-2 text-green-400" />
                Active Session
              </h5>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Time Remaining:</span>
                  <span className="font-mono">{formatTime(challengeTimer)}</span>
                </div>
                <ProgressBar 
                  value={((300 - challengeTimer) / 300) * 100} 
                  color="var(--brand-primary)" 
                />
                <div className="flex justify-between text-sm">
                  <span>Ideas Generated:</span>
                  <span className="font-semibold">{sessionIdeas.length}</span>
                </div>
              </div>
            </Card>
          )}

          {/* Real-Time Inspiration */}
          <Card>
            <h5 className="font-semibold mb-3 flex items-center">
              <Activity className="w-4 h-4 mr-2 text-green-400 animate-pulse" />
              Live Inspiration
            </h5>
            <div className="space-y-3">
              <div className="p-3 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-lg">
                <p className="text-xs text-[var(--text-primary)]">
                  {generateRealTimeInspiration()}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => {
                  // Refresh inspiration
                  window.location.reload();
                }}
              >
                <RefreshCw className="w-3 h-3 mr-2" />
                New Inspiration
              </Button>
            </div>
          </Card>

          {/* Quick Tools */}
          <Card>
            <h5 className="font-semibold mb-3">Quick Tools</h5>
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  const words = ['quantum', 'velvet', 'storm', 'digital', 'ancient', 'neon', 'whisper', 'explosion'];
                  const word = words[Math.floor(Math.random() * words.length)];
                  setCurrentIdea(`Create content inspired by the word: ${word}`);
                }}
              >
                <Shuffle className="w-4 h-4 mr-2" />
                Random Word
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  const questions = [
                    'What would happen if everyone knew this?',
                    'How would a child explain this?',
                    'What\'s the opposite of this truth?',
                    'Why should anyone care about this?'
                  ];
                  const question = questions[Math.floor(Math.random() * questions.length)];
                  setCurrentIdea(`Focus question: ${question}`);
                }}
              >
                <Target className="w-4 h-4 mr-2" />
                Focus Question
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  const palette = generateColorPalette();
                  setCurrentIdea(`Color inspiration: ${palette.name} - ${palette.usage}`);
                }}
              >
                <Palette className="w-4 h-4 mr-2" />
                Color Inspiration
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  const trends = ['AI productivity', 'Micro-learning', 'Authentic storytelling', 'Visual minimalism', 'Community building'];
                  const trend = trends[Math.floor(Math.random() * trends.length)];
                  setCurrentIdea(`Trending topic: ${trend} - create content around this growing interest`);
                }}
              >
                <Globe className="w-4 h-4 mr-2" />
                Trending Topics
              </Button>
            </div>
          </Card>

          {/* Recent Favorites */}
          {savedIdeas.filter(idea => idea.isFavorite).length > 0 && (
            <Card>
              <h5 className="font-semibold mb-3 flex items-center">
                <Star className="w-4 h-4 mr-2 text-yellow-400" />
                Favorites
              </h5>
              <div className="space-y-2">
                {savedIdeas.filter(idea => idea.isFavorite).slice(0, 3).map((idea) => (
                  <div
                    key={idea.id}
                    className="p-2 bg-[var(--surface-secondary)] rounded text-xs cursor-pointer hover:bg-[var(--surface-tertiary)] transition-colors"
                  >
                    {idea.text.substring(0, 60)}...
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );

  const renderInspiration = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="heading-2">Creative Inspiration</h2>
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="ghost" size="sm">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visualCategories.map((category) => (
          <Card key={category.name} className="hover:shadow-lg transition-shadow">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <category.icon className="w-8 h-8 text-purple-400" />
              </div>
              <h4 className="font-semibold text-[var(--text-primary)] mb-2">{category.name}</h4>
              <p className="text-sm text-[var(--text-secondary)] mb-4">{category.count} inspiration prompts</p>
              <Button variant="outline" size="sm" className="w-full">
                Explore Category
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <h3 className="heading-4 mb-4">Featured Techniques</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {creativeTechniques.map((technique) => (
            <div
              key={technique.name}
              className="p-4 border border-[var(--border-primary)] rounded-lg hover:border-[var(--brand-primary)]/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-[var(--text-primary)]">{technique.name}</h4>
                <Badge variant="outline">{technique.difficulty}</Badge>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mb-3">{technique.description}</p>
              <div className="flex items-center justify-between">
                <Badge variant="outline">{technique.category}</Badge>
                <Button variant="ghost" size="sm">
                  Learn More
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderSessions = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="heading-2">Ideas & Sessions</h2>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Search ideas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-1.5 bg-[var(--surface-secondary)] border border-[var(--border-primary)] rounded-lg text-sm"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-1.5 bg-[var(--surface-secondary)] border border-[var(--border-primary)] rounded-lg text-sm"
          >
            <option value="all">All Categories</option>
            <option value="mood">Mood-Based</option>
            <option value="random">Random</option>
            <option value="challenge">Challenge</option>
            <option value="visual">Visual</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ideas List */}
        <Card>
          <h3 className="heading-4 mb-4">Saved Ideas ({filteredIdeas.length})</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredIdeas.map((idea) => (
              <div
                key={idea.id}
                className="p-3 border border-[var(--border-primary)] rounded-lg hover:border-[var(--brand-primary)]/50 transition-colors cursor-pointer"
                onClick={() => {
                  setSelectedIdea(idea);
                  setShowIdeaModal(true);
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-[var(--text-primary)] mb-2">{idea.text}</p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" size="sm">{idea.mode}</Badge>
                      <Badge variant="outline" size="sm">{idea.category}</Badge>
                      <span className="text-xs text-[var(--text-secondary)]">
                        {idea.timestamp.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-3">
                    {idea.isFavorite && (
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    )}
                    <Button variant="ghost" size="sm">
                      <Send className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Sessions History */}
        <Card>
          <h3 className="heading-4 mb-4">Creative Sessions ({creativeSessions.length})</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {creativeSessions.map((session) => (
              <div
                key={session.id}
                className="p-4 border border-[var(--border-primary)] rounded-lg hover:border-[var(--brand-primary)]/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-[var(--text-primary)]">{session.title}</h4>
                  <span className="text-xs text-[var(--text-secondary)]">
                    {Math.floor(session.duration / 60)}m {session.duration % 60}s
                  </span>
                </div>
                <p className="text-sm text-[var(--text-secondary)] mb-3">
                  {session.ideas.length} ideas generated • {session.timestamp.toLocaleDateString()}
                </p>
                <div className="flex items-center space-x-2">
                  {session.tags.map((tag) => (
                    <Badge key={tag} variant="outline" size="sm">{tag}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className="heading-2">Creativity Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-[var(--brand-primary)] mb-1">{creativityScore}%</div>
            <div className="text-sm text-[var(--text-secondary)]">Creativity Score</div>
            <ProgressBar value={creativityScore} color="var(--brand-primary)" className="mt-2" />
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-1">{currentStreak}</div>
            <div className="text-sm text-[var(--text-secondary)]">Day Streak</div>
            <div className="flex justify-center mt-2">
              <Flame className="w-5 h-5 text-orange-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-1">{savedIdeas.length}</div>
            <div className="text-sm text-[var(--text-secondary)]">Total Ideas</div>
            <div className="text-xs text-[var(--text-tertiary)] mt-1">
              +{savedIdeas.filter(idea => {
                const today = new Date();
                const ideaDate = idea.timestamp;
                return ideaDate.toDateString() === today.toDateString();
              }).length} today
            </div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-1">{creativeSessions.length}</div>
            <div className="text-sm text-[var(--text-secondary)]">Sessions</div>
            <div className="text-xs text-[var(--text-tertiary)] mt-1">
              Avg: {creativeSessions.length > 0 ? Math.round(creativeSessions.reduce((acc, s) => acc + s.duration, 0) / creativeSessions.length / 60) : 0}min
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="heading-4 mb-4">Weekly Progress</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[var(--text-secondary)]">Ideas Generated</span>
              <span className="font-semibold">{savedIdeas.length} / {weeklyGoal}</span>
            </div>
            <ProgressBar value={(savedIdeas.length / weeklyGoal) * 100} color="var(--brand-primary)" />
            <div className="text-xs text-[var(--text-secondary)]">
              {Math.max(0, weeklyGoal - savedIdeas.length)} more to reach your weekly goal
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="heading-4 mb-4">Most Used Modes</h3>
          <div className="space-y-3">
            {Object.entries(
              savedIdeas.reduce((acc: Record<string, number>, idea) => {
                acc[idea.mode] = (acc[idea.mode] || 0) + 1;
                return acc;
              }, {})
            ).sort(([,a], [,b]) => b - a).slice(0, 4).map(([mode, count]) => (
              <div key={mode} className="flex justify-between items-center">
                <span className="text-sm capitalize">{mode}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-[var(--surface-secondary)] rounded-full h-2">
                    <div 
                      className="bg-[var(--brand-primary)] h-2 rounded-full"
                      style={{ width: `${(count / savedIdeas.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--background-primary)]">
      {/* Header Navigation */}
      <div className="px-6 py-6">
        <TabHeader
          title="Creativity"
          subtitle="Break creative blocks & generate ideas"
          icon={<Brain />}
          badge="Pro Planning"
          actions={
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm">
                <div className="flex items-center space-x-1">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span>{currentStreak} day streak</span>
                </div>
                <div className="w-px h-4 bg-[var(--border-primary)]" />
                <div>{savedIdeas.length} ideas</div>
              </div>

              <Button
                variant="primary"
                onClick={() => {
                  setActiveSection('breaker');
                  setCurrentMode('random');
                  generateRandomIdea();
                }}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Quick Spark
              </Button>
            </div>
          }
        />

        {/* Sub Navigation */}
        <div className="flex items-center space-x-1 mt-6">
          {[
            { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { key: 'breaker', label: 'Block Breaker', icon: Brain },
            { key: 'inspiration', label: 'Inspiration', icon: Lightbulb },
            { key: 'sessions', label: 'Ideas & Sessions', icon: Bookmark },
            { key: 'analytics', label: 'Analytics', icon: PieChart }
          ].map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              variant={activeSection === key ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setActiveSection(key as any)}
              className="flex items-center space-x-2"
            >
              <Icon className="w-4 h-4" />
              <span className="hidden md:inline">{label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6">
        <AnimatePresence mode="wait">
          {activeSection === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {renderDashboard()}
            </motion.div>
          )}

          {activeSection === 'breaker' && (
            <motion.div
              key="breaker"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {renderBlockBreaker()}
            </motion.div>
          )}

          {activeSection === 'inspiration' && (
            <motion.div
              key="inspiration"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {renderInspiration()}
            </motion.div>
          )}

          {activeSection === 'sessions' && (
            <motion.div
              key="sessions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {renderSessions()}
            </motion.div>
          )}

          {activeSection === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {renderAnalytics()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Idea Detail Modal */}
      <Modal isOpen={showIdeaModal} onClose={() => setShowIdeaModal(false)}>
        {selectedIdea && (
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <h3 className="heading-4">Idea Details</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSavedIdeas(prev => 
                    prev.map(idea => 
                      idea.id === selectedIdea.id 
                        ? { ...idea, isFavorite: !idea.isFavorite }
                        : idea
                    )
                  );
                  setSelectedIdea(prev => prev ? { ...prev, isFavorite: !prev.isFavorite } : null);
                }}
              >
                <Star className={`w-4 h-4 ${selectedIdea.isFavorite ? 'fill-current text-yellow-400' : ''}`} />
              </Button>
            </div>
            
            <div className="p-4 bg-[var(--surface-secondary)] rounded-lg">
              <p className="text-[var(--text-primary)]">{selectedIdea.text}</p>
            </div>

            <div className="flex items-center space-x-2">
              <Badge variant="outline">{selectedIdea.mode}</Badge>
              <Badge variant="outline">{selectedIdea.category}</Badge>
              <span className="text-sm text-[var(--text-secondary)]">
                {selectedIdea.timestamp.toLocaleDateString()}
              </span>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="ghost"
                onClick={() => {
                  navigator.clipboard.writeText(selectedIdea.text);
                }}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button
                onClick={() => {
                  localStorage.setItem('generatorPrefill', selectedIdea.text);
                  onNavigateToTab?.('generator');
                  setShowIdeaModal(false);
                }}
              >
                <Send className="w-4 h-4 mr-2" />
                Generate Content
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Category Inspiration Modal */}
      <Modal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        title={selectedCategory?.name}
        size="lg"
      >
        {selectedCategory && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <selectedCategory.icon className="w-8 h-8 text-purple-400" />
              </div>
              <p className="text-[var(--text-secondary)]">
                {selectedCategory.count} creative prompts to spark your imagination
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-[var(--text-primary)] mb-3">💡 Inspiration Prompts:</h4>
              {selectedCategory.prompts.map((prompt, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group p-4 bg-[var(--surface-secondary)] rounded-lg hover:bg-[var(--surface-tertiary)] transition-colors cursor-pointer"
                  onClick={() => {
                    setCurrentIdea(prompt);
                    setShowCategoryModal(false);
                    setActiveSection('breaker');
                    setCurrentMode('visual');
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors">
                        {prompt}
                      </p>
                    </div>
                    <div className="flex space-x-2 ml-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          saveIdea(prompt, selectedCategory.name.toLowerCase());
                        }}
                      >
                        <Save className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          localStorage.setItem('generatorPrefill', prompt);
                          onNavigateToTab?.('generator');
                          setShowCategoryModal(false);
                        }}
                      >
                        <Send className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-center space-x-3 pt-4 border-t border-[var(--border-primary)]">
              <Button
                variant="ghost"
                onClick={() => {
                  // Generate random prompt from this category
                  const randomPrompt = selectedCategory.prompts[Math.floor(Math.random() * selectedCategory.prompts.length)];
                  setCurrentIdea(randomPrompt);
                  setShowCategoryModal(false);
                  setActiveSection('breaker');
                  setCurrentMode('visual');
                }}
              >
                <Shuffle className="w-4 h-4 mr-2" />
                Random from Category
              </Button>
              <Button
                onClick={() => {
                  // Save all prompts from this category
                  selectedCategory.prompts.forEach(prompt => {
                    saveIdea(prompt, selectedCategory.name.toLowerCase());
                  });
                  setShowCategoryModal(false);
                }}
              >
                <Bookmark className="w-4 h-4 mr-2" />
                Save All Prompts
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CreativityWorldClass;
