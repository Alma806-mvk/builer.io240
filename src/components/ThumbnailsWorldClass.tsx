import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Image,
  Sparkles,
  Wand2,
  Download,
  Share2,
  Copy,
  Edit3,
  Palette,
  Type,
  Layers,
  Grid3X3,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Save,
  Trash2,
  Star,
  Heart,
  Eye,
  TrendingUp,
  Target,
  Brain,
  Lightbulb,
  Camera,
  Filter,
  Settings,
  Plus,
  Search,
  Upload,
  FolderOpen,
  Tag,
  Clock,
  Award,
  Zap,
  Rocket,
  Play,
  Volume2,
  MessageSquare,
  BarChart3,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Maximize,
  Minimize,
  Move,
  Square,
  Circle,
  Triangle,
  Mouse,
  Mail,
  Bell,
  Users,
  Cpu,
  PaintBucket,
  Layout,
  Scissors,
  Crop,
  Sliders,
  Droplets,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  ArrowRight,
  CheckCircle2,
  X,
  Video,
  ThumbsUp,
  MessageCircle,
  ChevronRight,
} from "lucide-react";

// Import our world-class components
import {
  Button,
  Card,
  Badge,
  GradientText,
  StatCard,
  ProgressBar,
  Input,
  TabHeader,
  EmptyState,
  QuickActionCard,
} from "./ui/WorldClassComponents";

interface ThumbnailTemplate {
  id: string;
  name: string;
  category: string;
  style: string;
  tags: string[];
  preview: string;
  premium?: boolean;
  popular?: boolean;
  performance?: {
    ctr: number;
    views: number;
    engagement: number;
  };
}

interface ThumbnailProject {
  id: string;
  title: string;
  thumbnail: string;
  created: Date;
  modified: Date;
  status: 'draft' | 'published' | 'archived';
  platform: string;
  performance?: {
    views: number;
    ctr: number;
    engagement: number;
  };
  tags: string[];
}

interface DesignElement {
  id: string;
  type: 'text' | 'image' | 'shape' | 'icon';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  content?: string;
  style?: any;
}

interface ThumbnailsWorldClassProps {
  userPlan?: string;
  onNavigateToTab?: (tab: string) => void;
}

interface NotificationData {
  name: string;
  email: string;
}

const ThumbnailsWorldClass: React.FC<ThumbnailsWorldClassProps> = ({
  userPlan = "free",
  onNavigateToTab,
}) => {
  // Coming soon page states
  const [showComingSoon, setShowComingSoon] = useState(true);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);

  // Original thumbnail studio states
  const [activeView, setActiveView] = useState<'gallery' | 'templates' | 'editor' | 'analytics'>('gallery');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState<ThumbnailTemplate | null>(null);
  const [selectedProject, setSelectedProject] = useState<ThumbnailProject | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [designElements, setDesignElements] = useState<DesignElement[]>([]);
  const [showTemplatePreview, setShowTemplatePreview] = useState(false);

  // Mock data for original functionality
  const [projects, setProjects] = useState<ThumbnailProject[]>([
    {
      id: '1',
      title: 'Ultimate YouTube Growth Strategy 2025',
      thumbnail: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      created: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      modified: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: 'published',
      platform: 'YouTube',
      performance: { views: 125000, ctr: 12.4, engagement: 8.7 },
      tags: ['Strategy', 'Growth', 'YouTube']
    },
    {
      id: '2',
      title: 'AI Tools That Will Change Everything',
      thumbnail: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      created: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      modified: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      status: 'draft',
      platform: 'YouTube',
      performance: { views: 89000, ctr: 9.8, engagement: 6.2 },
      tags: ['AI', 'Technology', 'Tutorial']
    },
    {
      id: '3',
      title: 'How I Made $10K This Month',
      thumbnail: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      created: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
      modified: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      status: 'published',
      platform: 'YouTube',
      performance: { views: 312000, ctr: 15.7, engagement: 11.3 },
      tags: ['Money', 'Business', 'Success']
    },
    {
      id: '4',
      title: 'Top 10 Programming Languages 2025',
      thumbnail: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      created: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
      modified: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      status: 'archived',
      platform: 'YouTube',
      performance: { views: 67000, ctr: 8.3, engagement: 5.1 },
      tags: ['Programming', 'Code', 'Tech']
    }
  ]);

  const [templates, setTemplates] = useState<ThumbnailTemplate[]>([
    {
      id: '1',
      name: 'Gaming Thumbnail',
      category: 'Gaming',
      style: 'Bold & Colorful',
      tags: ['Gaming', 'Action', 'Bold'],
      preview: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      popular: true,
      performance: { ctr: 15.2, views: 850000, engagement: 9.1 }
    },
    {
      id: '2',
      name: 'Tutorial Thumbnail',
      category: 'Education',
      style: 'Clean & Professional',
      tags: ['Tutorial', 'Education', 'Clean'],
      preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      premium: true,
      performance: { ctr: 11.8, views: 420000, engagement: 7.9 }
    },
    {
      id: '3',
      name: 'Tech Review Template',
      category: 'Technology',
      style: 'Modern & Sleek',
      tags: ['Tech', 'Review', 'Modern'],
      preview: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      performance: { ctr: 13.5, views: 680000, engagement: 8.4 }
    },
    {
      id: '4',
      name: 'Vlog Thumbnail',
      category: 'Lifestyle',
      style: 'Personal & Authentic',
      tags: ['Vlog', 'Personal', 'Lifestyle'],
      preview: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      popular: true,
      performance: { ctr: 14.1, views: 720000, engagement: 10.2 }
    },
    {
      id: '5',
      name: 'Business Thumbnail',
      category: 'Business',
      style: 'Professional & Corporate',
      tags: ['Business', 'Corporate', 'Professional'],
      preview: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      premium: true,
      performance: { ctr: 12.3, views: 390000, engagement: 6.8 }
    },
    {
      id: '6',
      name: 'Comedy Thumbnail',
      category: 'Entertainment',
      style: 'Fun & Expressive',
      tags: ['Comedy', 'Fun', 'Entertainment'],
      preview: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      performance: { ctr: 16.7, views: 920000, engagement: 12.1 }
    }
  ]);

  const categories = [
    { id: 'all', label: 'All', count: templates.length },
    { id: 'gaming', label: 'Gaming', count: templates.filter(t => t.category === 'Gaming').length },
    { id: 'education', label: 'Education', count: templates.filter(t => t.category === 'Education').length },
    { id: 'technology', label: 'Technology', count: templates.filter(t => t.category === 'Technology').length },
    { id: 'lifestyle', label: 'Lifestyle', count: templates.filter(t => t.category === 'Lifestyle').length },
    { id: 'business', label: 'Business', count: templates.filter(t => t.category === 'Business').length },
    { id: 'entertainment', label: 'Entertainment', count: templates.filter(t => t.category === 'Entertainment').length }
  ];

  // Features for coming soon page
  const features = [
    {
      icon: <Wand2 className="w-8 h-8" />,
      title: "AI-Powered Design",
      description: "Generate stunning thumbnails with advanced AI that understands YouTube trends"
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Professional Templates",
      description: "Access thousands of high-converting templates designed by professionals"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "A/B Testing Suite",
      description: "Test multiple thumbnail variations to maximize your click-through rates"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Smart Analytics",
      description: "Get insights on what makes thumbnails perform better in your niche"
    }
  ];

  // Filter templates
  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category.toLowerCase() === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Filter projects
  const filteredProjects = projects.filter(project => {
    return project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  // Cycle through features for coming soon page
  useEffect(() => {
    if (showComingSoon) {
      const interval = setInterval(() => {
        setCurrentFeature((prev) => (prev + 1) % features.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [showComingSoon]);

  // Calculate stats
  const totalViews = projects.filter(p => p.performance).reduce((sum, p) => sum + (p.performance?.views || 0), 0);
  const avgCTR = projects.filter(p => p.performance).reduce((sum, p) => sum + (p.performance?.ctr || 0), 0) / projects.filter(p => p.performance).length || 0;
  const publishedCount = projects.filter(p => p.status === 'published').length;

  const handleNotifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setSubmitted(true);
    setShowSuccess(true);
    
    // Clear form
    setEmail("");
    setName("");
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  const handleUseTemplate = (template: ThumbnailTemplate) => {
    setSelectedTemplate(template);
    setActiveView('editor');
    setIsEditing(true);
  };

  const handleEditProject = (project: ThumbnailProject) => {
    setSelectedProject(project);
    setActiveView('editor');
    setIsEditing(true);
  };

  const handleCreateNew = () => {
    setSelectedTemplate(null);
    setSelectedProject(null);
    setActiveView('editor');
    setIsEditing(true);
  };

  // Coming Soon Page
  if (showComingSoon) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating orbs */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-purple-400/20 to-pink-400/20 blur-xl"
              style={{
                width: `${100 + i * 50}px`,
                height: `${100 + i * 50}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, 30, -30, 0],
                y: [0, -30, 30, 0],
                scale: [1, 1.1, 0.9, 1],
              }}
              transition={{
                duration: 10 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
          
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>

        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="max-w-6xl mx-auto text-center">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-12"
            >
              {/* Icon Animation */}
              <motion.div
                className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white mb-8 shadow-2xl"
                animate={{
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Image className="w-12 h-12" />
              </motion.div>

              {/* Main Title */}
              <motion.h1
                className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                Thumbnail Studio
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                className="text-xl md:text-2xl text-slate-300 mb-4 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                The most powerful thumbnail creation tool for YouTube creators
              </motion.p>

              {/* Coming Soon Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600/30 to-pink-600/30 backdrop-blur-sm border border-purple-500/30 rounded-full px-6 py-3 mb-12"
              >
                <Rocket className="w-5 h-5 text-purple-400" />
                <span className="text-purple-300 font-medium">Coming Soon</span>
                <Badge variant="warning" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                  2025
                </Badge>
              </motion.div>
            </motion.div>

            {/* Features Preview */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className={`p-6 rounded-2xl border backdrop-blur-sm transition-all duration-500 ${
                    currentFeature === index
                      ? 'bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-500/50 shadow-lg shadow-purple-500/20'
                      : 'bg-slate-800/40 border-slate-700/50 hover:border-slate-600/50'
                  }`}
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className={`mb-4 ${currentFeature === index ? 'text-purple-400' : 'text-slate-400'}`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* Notification Signup */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.8 }}
              className="max-w-2xl mx-auto"
            >
              <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-700/50 p-8">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full text-white mb-4">
                    <Bell className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Get Early Access
                  </h2>
                  <p className="text-slate-400">
                    Be the first to know when Thumbnail Studio launches. Get exclusive access and early-bird pricing.
                  </p>
                </div>

                {!submitted ? (
                  <form onSubmit={handleNotifySubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Input
                          type="text"
                          placeholder="Your name"
                          value={name}
                          onChange={setName}
                          required
                          className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                        />
                      </div>
                      <div>
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={setEmail}
                          required
                          className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                        />
                      </div>
                    </div>
                    
                    <div className="flex space-x-4">
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={isSubmitting || !email || !name}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 text-lg"
                      >
                        {isSubmitting ? (
                          <>
                            <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                            Subscribing...
                          </>
                        ) : (
                          <>
                            <Bell className="w-5 h-5 mr-2" />
                            Notify Me When Ready
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setShowComingSoon(false)}
                        className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-4 px-8"
                      >
                        <Eye className="w-5 h-5 mr-2" />
                        Preview
                      </Button>
                    </div>
                  </form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-4"
                  >
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                      You're on the list!
                    </h3>
                    <p className="text-slate-400">
                      We'll notify you as soon as Thumbnail Studio is ready for launch.
                    </p>
                    <div className="flex flex-col space-y-3">
                      <div className="flex space-x-3">
                        <Button
                          variant="ghost"
                          onClick={() => setSubmitted(false)}
                          className="text-purple-400 hover:text-purple-300 flex-1"
                        >
                          Subscribe another email
                        </Button>
                        <Button
                          variant="primary"
                          onClick={() => setShowComingSoon(false)}
                          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 flex-1"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Preview Features
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </Card>
            </motion.div>

            {/* Feature Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Cpu className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">AI-Powered</h4>
                <p className="text-slate-400 text-sm">
                  Advanced AI algorithms that understand what makes thumbnails click-worthy
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Performance Driven</h4>
                <p className="text-slate-400 text-sm">
                  Built-in analytics and A/B testing to maximize your click-through rates
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Lightning Fast</h4>
                <p className="text-slate-400 text-sm">
                  Create professional thumbnails in seconds, not hours
                </p>
              </div>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.8 }}
              className="mt-16 text-center"
            >
              <div className="inline-flex items-center space-x-6 text-slate-400">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span className="text-sm">1,000+ creators waiting</span>
                </div>
                <div className="w-px h-4 bg-slate-600" />
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm">Launching Q2 2025</span>
                </div>
                <div className="w-px h-4 bg-slate-600" />
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <span className="text-sm">Free for early adopters</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Success Toast */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className="fixed bottom-8 right-8 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg z-50"
            >
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6" />
                <div>
                  <div className="font-semibold">Successfully subscribed!</div>
                  <div className="text-sm opacity-90">We'll notify you when it's ready</div>
                </div>
                <button
                  onClick={() => setShowSuccess(false)}
                  className="ml-4 hover:bg-green-700 rounded p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Full Thumbnail Studio Interface
  return (
    <div className="h-full flex flex-col bg-[var(--surface-primary)]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              <GradientText className="text-white">Thumbnail Studio</GradientText>
            </h1>
            <p className="text-lg opacity-90">
              Create eye-catching thumbnails that drive clicks
            </p>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
              <div className="text-sm opacity-75">Total Views</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{avgCTR.toFixed(1)}%</div>
              <div className="text-sm opacity-75">Avg CTR</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{publishedCount}</div>
              <div className="text-sm opacity-75">Published</div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComingSoon(true)}
              className="text-white/80 hover:text-white border border-white/20"
            >
              <Rocket className="w-4 h-4 mr-2" />
              Coming Soon
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-[var(--surface-secondary)] border-b border-[var(--border-primary)]">
        <div className="flex items-center justify-between px-6">
          <div className="flex space-x-6">
            {[
              { id: 'gallery', label: 'Gallery', icon: <Grid3X3 className="w-4 h-4" /> },
              { id: 'templates', label: 'Templates', icon: <Layers className="w-4 h-4" /> },
              { id: 'editor', label: 'Editor', icon: <Edit3 className="w-4 h-4" /> },
              { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                  activeView === tab.id
                    ? 'border-[var(--brand-primary)] text-[var(--brand-primary)]'
                    : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {tab.icon}
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="primary" size="sm" onClick={handleCreateNew}>
              <Plus className="w-4 h-4" />
              New Thumbnail
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {/* Gallery View */}
          {activeView === 'gallery' && (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-6 overflow-y-auto h-full"
            >
              <div className="max-w-7xl mx-auto space-y-6">
                {/* Gallery Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">Your Thumbnails</h2>
                    <p className="text-[var(--text-secondary)]">Manage and track your thumbnail performance</p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Input
                      placeholder="Search thumbnails..."
                      value={searchQuery}
                      onChange={setSearchQuery}
                      className="w-80"
                      icon={<Search className="w-4 h-4" />}
                    />
                    <Button variant="ghost" size="sm">
                      <Filter className="w-4 h-4" />
                      Filter
                    </Button>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <StatCard
                    title="Total Thumbnails"
                    value={projects.length.toString()}
                    change="+3 this week"
                    changeType="positive"
                    icon={<Image />}
                    description="created"
                  />
                  <StatCard
                    title="Avg CTR"
                    value={`${avgCTR.toFixed(1)}%`}
                    change="+2.1%"
                    changeType="positive"
                    icon={<Target />}
                    description="click-through rate"
                  />
                  <StatCard
                    title="Total Views"
                    value={`${(totalViews / 1000).toFixed(0)}K`}
                    change="+15.3%"
                    changeType="positive"
                    icon={<Eye />}
                    description="all time"
                  />
                  <StatCard
                    title="Published"
                    value={publishedCount.toString()}
                    change="+1 this week"
                    changeType="positive"
                    icon={<CheckCircle />}
                    description="live thumbnails"
                  />
                </div>

                {/* Thumbnails Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProjects.map((project) => (
                    <Card
                      key={project.id}
                      className="cursor-pointer hover:shadow-lg transition-all duration-200 group"
                      onClick={() => handleEditProject(project)}
                    >
                      <div className="space-y-4">
                        {/* Thumbnail Preview */}
                        <div className="aspect-video bg-gradient-to-br rounded-lg flex items-center justify-center text-white text-2xl font-bold relative"
                             style={{ background: project.thumbnail }}>
                          <Image className="w-8 h-8 opacity-50" />
                          
                          {/* Overlay Controls */}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm" className="text-white">
                                <Edit3 className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-white">
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-white">
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Project Info */}
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <h3 className="font-semibold text-[var(--text-primary)] line-clamp-2">
                              {project.title}
                            </h3>
                            <Badge 
                              variant={
                                project.status === 'published' ? 'success' :
                                project.status === 'draft' ? 'warning' : 'neutral'
                              }
                            >
                              {project.status}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm text-[var(--text-secondary)]">
                            <span>{project.platform}</span>
                            <span>{new Date(project.modified).toLocaleDateString()}</span>
                          </div>
                          
                          {project.performance && (
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center space-x-3">
                                <span className="flex items-center space-x-1">
                                  <Eye className="w-3 h-3" />
                                  {project.performance.views.toLocaleString()}
                                </span>
                                <span className="flex items-center space-x-1">
                                  <Target className="w-3 h-3" />
                                  {project.performance.ctr}%
                                </span>
                              </div>
                              <Badge variant="success" className="text-xs">
                                {project.performance.engagement}% eng
                              </Badge>
                            </div>
                          )}
                          
                          {/* Tags */}
                          <div className="flex flex-wrap gap-1">
                            {project.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="neutral" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Templates View */}
          {activeView === 'templates' && (
            <motion.div
              key="templates"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-6 overflow-y-auto h-full"
            >
              <div className="max-w-7xl mx-auto space-y-6">
                {/* Template Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Input
                      placeholder="Search templates..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-80"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-[var(--text-secondary)]">
                      {filteredTemplates.length} templates
                    </span>
                  </div>
                </div>

                {/* Categories */}
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "primary" : "ghost"}
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                      className="whitespace-nowrap"
                    >
                      {category.label} ({category.count})
                    </Button>
                  ))}
                </div>

                {/* Templates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredTemplates.map((template) => (
                    <Card
                      key={template.id}
                      className="cursor-pointer hover:shadow-lg transition-all duration-200 group"
                      onClick={() => handleUseTemplate(template)}
                    >
                      <div className="space-y-4">
                        {/* Template Preview */}
                        <div className="aspect-video bg-gradient-to-br rounded-lg flex items-center justify-center text-white relative"
                             style={{ background: template.preview }}>
                          <Layers className="w-8 h-8 opacity-50" />
                          
                          {/* Premium/Popular Badge */}
                          <div className="absolute top-2 left-2">
                            {template.premium && (
                              <Badge variant="warning" className="text-xs">Premium</Badge>
                            )}
                            {template.popular && (
                              <Badge variant="success" className="text-xs">Popular</Badge>
                            )}
                          </div>
                          
                          {/* Overlay Controls */}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                            <Button variant="primary" size="sm" className="text-white">
                              <Wand2 className="w-4 h-4 mr-2" />
                              Use Template
                            </Button>
                          </div>
                        </div>
                        
                        {/* Template Info */}
                        <div className="space-y-3">
                          <div>
                            <h3 className="font-semibold text-[var(--text-primary)] line-clamp-1">
                              {template.name}
                            </h3>
                            <p className="text-sm text-[var(--text-secondary)]">{template.style}</p>
                          </div>
                          
                          {template.performance && (
                            <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                              <span>{template.performance.ctr}% CTR</span>
                              <span>{template.performance.views.toLocaleString()} views</span>
                              <span>{template.performance.engagement}% eng</span>
                            </div>
                          )}
                          
                          {/* Tags */}
                          <div className="flex flex-wrap gap-1">
                            {template.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="neutral" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Editor View */}
          {activeView === 'editor' && (
            <motion.div
              key="editor"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-full"
            >
              <div className="h-full flex">
                {/* Editor Sidebar */}
                <div className="w-80 bg-[var(--surface-secondary)] border-r border-[var(--border-primary)] p-4 overflow-y-auto">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-[var(--text-primary)] mb-4">Design Tools</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="ghost" size="sm" className="justify-start">
                          <Type className="w-4 h-4 mr-2" />
                          Text
                        </Button>
                        <Button variant="ghost" size="sm" className="justify-start">
                          <Image className="w-4 h-4 mr-2" />
                          Image
                        </Button>
                        <Button variant="ghost" size="sm" className="justify-start">
                          <Square className="w-4 h-4 mr-2" />
                          Shape
                        </Button>
                        <Button variant="ghost" size="sm" className="justify-start">
                          <Star className="w-4 h-4 mr-2" />
                          Icon
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-[var(--text-primary)] mb-4">Quick Actions</h3>
                      <div className="space-y-2">
                        <Button variant="ghost" size="sm" className="w-full justify-start">
                          <Wand2 className="w-4 h-4 mr-2" />
                          AI Generate
                        </Button>
                        <Button variant="ghost" size="sm" className="w-full justify-start">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Image
                        </Button>
                        <Button variant="ghost" size="sm" className="w-full justify-start">
                          <Palette className="w-4 h-4 mr-2" />
                          Color Picker
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-[var(--text-primary)] mb-4">Layers</h3>
                      <div className="space-y-1">
                        <div className="p-2 bg-[var(--surface-tertiary)] rounded text-sm">
                          Background
                        </div>
                        <div className="p-2 bg-[var(--surface-tertiary)] rounded text-sm">
                          Main Title
                        </div>
                        <div className="p-2 bg-[var(--surface-tertiary)] rounded text-sm">
                          Subtitle
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Editor Canvas */}
                <div className="flex-1 flex flex-col">
                  <div className="p-4 border-b border-[var(--border-primary)] flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <h3 className="font-semibold text-[var(--text-primary)]">
                        {selectedTemplate ? `Editing: ${selectedTemplate.name}` : 
                         selectedProject ? `Editing: ${selectedProject.title}` : 
                         'New Thumbnail'}
                      </h3>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <RotateCcw className="w-4 h-4" />
                        Undo
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ZoomOut className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ZoomIn className="w-4 h-4" />
                      </Button>
                      <Button variant="secondary" size="sm">
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button variant="primary" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex-1 flex items-center justify-center p-8 bg-slate-100">
                    {/* Canvas Area */}
                    <div className="aspect-video w-full max-w-4xl bg-white rounded-lg shadow-lg border-2 border-dashed border-slate-300 flex items-center justify-center">
                      <div className="text-center text-slate-500">
                        <Edit3 className="w-16 h-16 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Thumbnail Editor</h3>
                        <p className="text-sm">
                          {selectedTemplate ? `Using template: ${selectedTemplate.name}` :
                           selectedProject ? `Editing: ${selectedProject.title}` :
                           'Start creating your thumbnail'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Analytics View */}
          {activeView === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-6 overflow-y-auto h-full"
            >
              <div className="max-w-7xl mx-auto space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-[var(--text-primary)]">Thumbnail Analytics</h2>
                  <p className="text-[var(--text-secondary)]">Track performance and optimize your thumbnails</p>
                </div>

                {/* Performance Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard
                    title="Avg CTR"
                    value={`${avgCTR.toFixed(1)}%`}
                    change="+2.1%"
                    changeType="positive"
                    icon={<Target />}
                    description="last 30 days"
                  />
                  <StatCard
                    title="Total Views"
                    value={`${(totalViews / 1000).toFixed(0)}K`}
                    change="+15.3%"
                    changeType="positive"
                    icon={<Eye />}
                    description="all time"
                  />
                  <StatCard
                    title="Avg Engagement"
                    value="8.7%"
                    change="+1.2%"
                    changeType="positive"
                    icon={<Heart />}
                    description="likes/views ratio"
                  />
                  <StatCard
                    title="A/B Tests"
                    value="12"
                    change="+3"
                    changeType="positive"
                    icon={<BarChart3 />}
                    description="running tests"
                  />
                </div>

                {/* Top Performing Thumbnails */}
                <Card>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-[var(--text-primary)]">Top Performing Thumbnails</h3>
                      <Button variant="ghost" size="sm">
                        View All
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {projects
                        .filter(p => p.performance)
                        .sort((a, b) => (b.performance?.ctr || 0) - (a.performance?.ctr || 0))
                        .slice(0, 5)
                        .map((project, index) => (
                          <div 
                            key={project.id} 
                            className="flex items-center space-x-4 p-4 bg-[var(--surface-tertiary)] rounded-lg hover:bg-[var(--surface-quaternary)] transition-colors cursor-pointer"
                          >
                            <div className="flex items-center justify-center w-8 h-8 bg-[var(--brand-primary)] text-white rounded-full text-sm font-bold">
                              {index + 1}
                            </div>
                            
                            <div className="w-20 h-12 rounded" style={{ background: project.thumbnail }} />
                            
                            <div className="flex-1">
                              <h4 className="font-medium text-[var(--text-primary)] line-clamp-1">{project.title}</h4>
                              <div className="flex items-center space-x-4 text-sm text-[var(--text-secondary)]">
                                <span className="flex items-center space-x-1">
                                  <Eye className="w-3 h-3" />
                                  {project.performance?.views.toLocaleString()}
                                </span>
                                <span className="flex items-center space-x-1">
                                  <Target className="w-3 h-3" />
                                  {project.performance?.ctr}%
                                </span>
                                <span className="flex items-center space-x-1">
                                  <Heart className="w-3 h-3" />
                                  {project.performance?.engagement}%
                                </span>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="text-lg font-bold text-[var(--text-primary)]">
                                {project.performance?.ctr}%
                              </div>
                              <div className="text-sm text-[var(--text-secondary)]">CTR</div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </Card>

                {/* Analytics Charts Placeholder */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <div className="space-y-4">
                      <h3 className="font-semibold text-[var(--text-primary)]">CTR Trends</h3>
                      <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl flex items-center justify-center">
                        <div className="text-center">
                          <BarChart3 className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                          <p className="text-gray-600">CTR performance over time</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                  
                  <Card>
                    <div className="space-y-4">
                      <h3 className="font-semibold text-[var(--text-primary)]">Category Performance</h3>
                      <div className="h-64 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl flex items-center justify-center">
                        <div className="text-center">
                          <Target className="w-16 h-16 text-green-500 mx-auto mb-4" />
                          <p className="text-gray-600">Performance by category</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ThumbnailsWorldClass;
